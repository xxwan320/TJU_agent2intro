"""Restricted AMap adapter. It never logs precise coordinates or accepts an upstream URL."""
import asyncio,time,json,os,re,math
from pathlib import Path
from collections import OrderedDict,deque
from urllib.parse import urlencode
from uuid import UUID
from datetime import datetime,timezone
import httpx
from backend.common.errors import DomainError
from backend.r2_contracts import ExternalNavigation, RouteResponse, RouteStep
from backend.knowledge.service import knowledge

# Fixed destinations only; serviceHost/_AMapService is the official JS security proxy prefix.
# SDK query strings must never be logged: they can contain precise user coordinates.
_PROXY={
 "v4/map/styles":("https://webapi.amap.com/v4/map/styles",{"styleid","style","protocol"},"map_load"),
 "v3/geocode/regeo":("https://restapi.amap.com/v3/geocode/regeo",{"location","extensions","radius","roadlevel","poitype","homeorcorp"},"geolocation"),
 "v3/geocode/geo":("https://restapi.amap.com/v3/geocode/geo",{"address","city"},"poi_search"),
 "v3/ip":("https://restapi.amap.com/v3/ip",set(),"geolocation"),
 "v3/assistant/coordinate/convert":("https://restapi.amap.com/v3/assistant/coordinate/convert",{"locations","coordsys"},"geolocation"),
 "v3/place/text":("https://restapi.amap.com/v3/place/text",{"keywords","types","city","citylimit","children","offset","page","extensions"},"poi_search"),
 "v3/place/around":("https://restapi.amap.com/v3/place/around",{"location","keywords","types","city","radius","sortrule","offset","page","extensions"},"poi_search"),
 "v3/direction/walking":("https://restapi.amap.com/v3/direction/walking",{"origin","destination","isindoor","originid","destinationid","show_fields"},"walking_route"),
 "v5/direction/walking":("https://restapi.amap.com/v5/direction/walking",{"origin","destination","show_fields"},"walking_route"),
}
_COMMON={"key","callback","output","platform","s","logversion","appname","csid","sdkversion"}
def _validate_proxy(params,allowed,js):
 if any(k not in allowed|_COMMON for k in params):raise DomainError("VALIDATION_ERROR","查询参数不在允许列表",422)
 if "key" in params and params["key"] != js:raise DomainError("VALIDATION_ERROR","JS Key 与应用配置不一致",422)
 clean={}
 for key,value in params.items():
  if not isinstance(value,str) or len(value)>512 or any(ord(c)<32 for c in value):raise DomainError("VALIDATION_ERROR","地图参数格式无效",422)
  if key=="callback" and not re.fullmatch(r"[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*){0,3}",value):raise DomainError("VALIDATION_ERROR","回调名称无效",422)
  if key in ("origin","destination","location","locations"):
   pairs=value.split(";")
   if len(pairs)>10 or (key!="locations" and len(pairs)!=1):raise DomainError("VALIDATION_ERROR","坐标数量无效",422)
   try:
    for pair in pairs:
     lng,lat=map(float,pair.split(","))
     if not math.isfinite(lng+lat) or not -180<=lng<=180 or not -90<=lat<=90:raise ValueError()
   except ValueError:raise DomainError("VALIDATION_ERROR","坐标格式无效",422) from None
  limits={"page":(1,100),"offset":(1,25),"radius":(0,50000),"children":(0,1),"roadlevel":(0,1),"isindoor":(0,1)}
  if key in limits:
   lo,hi=limits[key]
   if not value.isdigit() or not lo<=int(value)<=hi:raise DomainError("VALIDATION_ERROR","地图分页或范围参数无效",422)
  enums={"output":{"json","JSON"},"extensions":{"base","all"},"citylimit":{"true","false"},"coordsys":{"gps","mapbar","baidu","autonavi"},"sortrule":{"distance","weight"}}
  if key in enums and value not in enums[key]:raise DomainError("VALIDATION_ERROR","地图参数枚举无效",422)
  clean[key]=value
 clean["key"]=js
 clean["platform"]="JS"
 clean["s"]="rsv3"
 return clean

def _proxy_payload(response,callback):
 try:
  raw=response.text.strip()
  if callback:
   prefix=callback+"("
   if not raw.startswith(prefix) or not re.search(r"\)\s*;?\s*$",raw):raise ValueError()
   raw=re.sub(r"\)\s*;?\s*$","",raw[len(prefix):])
  data=json.loads(raw)
  if not isinstance(data,dict):raise ValueError()
  return data
 except (ValueError,TypeError):raise DomainError("UPSTREAM_PROTOCOL_ERROR","高德响应格式无效",503) from None

def _poi(pid):
 searchable=getattr(knowledge,"is_map_searchable",None)
 if searchable and not searchable(pid):return None
 visible=getattr(knowledge,"is_frontend_visible",None)
 if visible and not visible(pid):return None
 getter=getattr(knowledge,"get_poi",None)
 if getter:
  try:return getter(pid)
  except Exception:return None
 b=knowledge.get_building(pid)
 return b
def _verified_location(loc):
 return bool(loc and loc.quality=="entrance" and loc.verified_at and loc.coordinate_source.strip())
def _location(poi,entrance_id=None):
 entrances=getattr(poi,"entrances",[]) or []
 if entrance_id:
  match=next((e for e in entrances if e.id==entrance_id),None)
  if not match:raise DomainError("VALIDATION_ERROR","指定入口不存在",422)
  return (match.location,match) if _verified_location(match.location) else (None,None)
 verified=[e for e in entrances if _verified_location(e.location)]
 if verified:return verified[0].location,verified[0]
 loc=getattr(poi,"location",None)
 return (loc,None) if _verified_location(loc) else (None,None)
class MapService:
 def __init__(self,settings,client=None):
  self.settings=settings;self.client=client or httpx.AsyncClient(timeout=12,follow_redirects=False)
  self.online_state="UNVERIFIED" if settings.amap_js_key and settings.amap_security_key.get_secret_value() else "NOT_CONFIGURED"
  self.route_state="UNVERIFIED" if settings.amap_js_key and settings.amap_security_key.get_secret_value() else "NOT_CONFIGURED"
  self.proxy_recent=deque();self.proxy_counts={k:{"started":0,"completed":0,"failed":0} for k in ("map_load","geolocation","poi_search","walking_route")};self.records:OrderedDict[UUID,dict]=OrderedDict();self.session_running={};self.recent=deque();self.traces=deque(maxlen=2000);self.semaphore=asyncio.Semaphore(2)
 def trace(self,action,status,request_id=None,elapsed_ms=None,code=None):
  entry={"origin":"backend","metric":"proxy_http_requests" if action.startswith("proxy.") else "rest_requests","platform_quota_debit":None,"request_id":str(request_id) if request_id else None,"action":action,"status":status,"monotonic_ms":round(time.monotonic()*1000,3),"elapsed_ms":elapsed_ms,"code":code};self.traces.append(entry)
  if "PYTEST_CURRENT_TEST" not in os.environ:
   path=Path(".runtime/map-r2.jsonl");path.parent.mkdir(exist_ok=True)
   with path.open("a",encoding="utf-8") as output:output.write(json.dumps(entry,ensure_ascii=False,separators=(",",":"))+"\n")
 async def proxy(self,path,params):
  if path not in _PROXY:raise DomainError("VALIDATION_ERROR","该高德路径不在允许列表",404)
  js=self.settings.amap_js_key;security=self.settings.amap_security_key.get_secret_value()
  if not js or not security:raise DomainError("NOT_CONFIGURED","在线地图安全代理尚未配置",503)
  url,allowed,category=_PROXY[path]
  clean=_validate_proxy(params,allowed,js)
  if "direction/walking" in path and not all(k in clean for k in ("origin","destination")):raise DomainError("VALIDATION_ERROR","步行路线缺少起终点",422)
  clean["jscode"]=security
  now=time.monotonic()
  while self.proxy_recent and now-self.proxy_recent[0][0]>60:self.proxy_recent.popleft()
  # Hard backend cap supplements the browser's persistent smoke budget; no retries.
  if len(self.proxy_recent)>=60 or (category=="walking_route" and sum(c=="walking_route" for _,c in self.proxy_recent)>=6):raise DomainError("RATE_LIMITED","地图代理请求过于频繁；请使用外部导航",429,retryable=True)
  self.proxy_recent.append((now,category))
  action="proxy."+category;self.proxy_counts[category]["started"]+=1
  started=time.monotonic();self.trace(action,"started")
  try:
   async with self.semaphore:
    response=await self.client.get(url,params=clean);response.raise_for_status()
   if len(response.content)>2_000_000:raise DomainError("UPSTREAM_PROTOCOL_ERROR","高德响应超过安全上限",503)
   data=_proxy_payload(response,clean.get("callback"))
   success=str(data.get("status"))=="1" or (path=="v4/map/styles" and data.get("errcode")==0)
   if not success:
    info=str(data.get("info",""))
    messages={"USERKEY_PLAT_NOMATCH":"高德 Key 平台类型不匹配，请使用 Web 端 JS API Key", "INVALID_USER_KEY":"高德 Key 无效或已停用", "INVALID_USER_SCODE":"高德 Key 与安全密钥不匹配", "INVALID_USER_DOMAIN":"当前域名不在高德 Key 的允许列表", "DAILY_QUERY_OVER_LIMIT":"高德每日调用额度已用完", "INSUFFICIENT_PRIVILEGES":"此高德 Key 未开通相应服务"}
    raise DomainError(info if info in messages else "UPSTREAM_PROTOCOL_ERROR",messages.get(info,"高德服务未返回业务成功"),503)
   self.proxy_counts[category]["completed"]+=1
   self.trace(action,"completed",elapsed_ms=(time.monotonic()-started)*1000)
   # Proxy success is not proof that a browser rendered a map, located a device or executed a route.
   return response
  except (httpx.HTTPError,DomainError) as error:
   code=error.code if isinstance(error,DomainError) else ("UPSTREAM_TIMEOUT" if isinstance(error,httpx.TimeoutException) else "NETWORK_ERROR")
   self.proxy_counts[category]["failed"]+=1;self.trace(action,"failed",elapsed_ms=(time.monotonic()-started)*1000,code=code)
   if isinstance(error,DomainError):raise
   raise DomainError(code,"高德服务暂时不可用",503,retryable=True) from None

 def external(self,pid):
  poi=_poi(pid)
  if poi is None:raise DomainError("VALIDATION_ERROR","点位不存在",404)
  loc,_=_location(poi)
  name=getattr(poi,"name",None) or getattr(poi,"title",pid)
  campus={"weijinlu":"天津大学卫津路校区","beiyangyuan":"天津大学北洋园校区"}.get(getattr(poi,"campus_id",None),"天津大学")
  qualified=f"{campus} {name}"
  if loc and loc.crs in ("GCJ02","WGS84"):
   coordinate="gaode" if loc.crs=="GCJ02" else "wgs84"
   url="https://uri.amap.com/marker?"+urlencode({"position":f"{loc.lng},{loc.lat}","name":name,"coordinate":coordinate,"src":"AI4TJU","callnative":"1"})
   return ExternalNavigation(poi_id=pid,url=url,kind="coordinate",precision="verified_destination")
  url="https://uri.amap.com/search?"+urlencode({"keyword":qualified,"src":"AI4TJU","callnative":"1"})
  return ExternalNavigation(poi_id=pid,url=url,kind="search",precision="name_search")
 def reserve(self,body):
  now=time.monotonic()
  while self.recent and now-self.recent[0][0]>60:self.recent.popleft()
  if body.route_id in self.records:raise DomainError("VALIDATION_ERROR","route_id 已存在，避免重复执行",409,body.route_id)
  if body.session_id in self.session_running:raise DomainError("RATE_LIMITED","同一会话已有路线请求",429,body.route_id,True)
  if sum(1 for _,s in self.recent if s==body.session_id)>=6 or len(self.recent)>=30:raise DomainError("RATE_LIMITED","路线请求过于频繁",429,body.route_id,True)
  self.recent.append((now,body.session_id));self.records[body.route_id]={"session":body.session_id,"status":"running","task":asyncio.current_task(),"upstream":"not_started"};self.session_running[body.session_id]=body.route_id
  while len(self.records)>1000:self.records.popitem(last=False)
 async def route(self,body):
  key=self.settings.amap_web_service_key.get_secret_value()
  if not key:raise DomainError("NOT_CONFIGURED","未配置高德 Web 服务；可使用外部导航",503,body.route_id)
  poi=_poi(body.destination_poi_id)
  if poi is None or getattr(poi,"campus_id",None)!=body.campus_id:raise DomainError("VALIDATION_ERROR","目的点不存在或不属于所选校区",422,body.route_id)
  loc,entrance=_location(poi,body.entrance_id)
  if not loc:raise DomainError("VALIDATION_ERROR","该点位没有经验证的入口坐标，可使用名称外部导航",422,body.route_id)
  if loc.crs!="GCJ02":raise DomainError("VALIDATION_ERROR","步行规划要求起终点均为 GCJ02，当前入口坐标系不一致",422,body.route_id)
  try:
   recorded=datetime.fromisoformat(body.origin.timestamp.replace("Z","+00:00"))
   if recorded.tzinfo is None:raise ValueError()
   age=(datetime.now(timezone.utc)-recorded).total_seconds()
   if not -5<=age<=120:raise ValueError()
  except ValueError:raise DomainError("VALIDATION_ERROR","起点时间无效或已过期，请重新选择起点",422,body.route_id) from None
  if body.origin.source=="amap_geolocation" and (body.origin.accuracy_m is None or body.origin.accuracy_m>200):raise DomainError("VALIDATION_ERROR","定位精度不足，请手动选择起点",422,body.route_id)
  self.reserve(body);rec=self.records[body.route_id];started=time.monotonic();self.trace("walking_route","started",body.route_id)
  try:
   async with self.semaphore:
    rec["task"]=asyncio.current_task();rec["upstream"]="unconfirmed"
    response=await self.client.get("https://restapi.amap.com/v3/direction/walking",params={"key":key,"origin":f"{body.origin.lng},{body.origin.lat}","destination":f"{loc.lng},{loc.lat}","output":"JSON"})
    response.raise_for_status();data=response.json()
   if str(data.get("status"))!="1":raise DomainError("UPSTREAM_PROTOCOL_ERROR","高德未返回可用步行路线",503,body.route_id)
   paths=data.get("route",{}).get("paths",[])
   if not paths:raise DomainError("UPSTREAM_PROTOCOL_ERROR","高德未返回可用步行路线",503,body.route_id)
   path=paths[0];steps=[]
   for s in path.get("steps",[]):
    poly=[]
    for pair in (s.get("polyline") or "").split(";"):
     try:x,y=pair.split(",");poly.append((float(x),float(y)))
     except ValueError:continue
    steps.append(RouteStep(instruction=s.get("instruction") or "继续步行",distance_m=float(s.get("distance") or 0),polyline=poly))
   if not steps or path.get("distance") is None:raise DomainError("UPSTREAM_PROTOCOL_ERROR","高德路线缺少距离或步骤",503,body.route_id)
   refs=list(getattr(entrance,"source_refs",[]) or [])
   result=RouteResponse(route_id=body.route_id,destination_poi_id=body.destination_poi_id,provider="amap",crs="GCJ02",distance_m=float(path.get("distance") or 0),duration_s=float(path["duration"]) if path.get("duration") is not None else None,steps=steps,campus_access="unverified",access_source_refs=refs)
   rec["status"]="completed";self.trace("walking_route","completed",body.route_id,(time.monotonic()-started)*1000)
   return result
  except asyncio.CancelledError:rec["status"]="cancelled";self.trace("walking_route","cancelled",body.route_id,(time.monotonic()-started)*1000,"CANCELLED");raise DomainError("CANCELLED","本地路线请求已取消；上游停止状态未确认",499,body.route_id) from None
  except DomainError as e:rec["status"]="failed";self.trace("walking_route","failed",body.route_id,(time.monotonic()-started)*1000,e.code);raise
  except httpx.TimeoutException:rec["status"]="failed";self.trace("walking_route","failed",body.route_id,(time.monotonic()-started)*1000,"UPSTREAM_TIMEOUT");raise DomainError("UPSTREAM_TIMEOUT","高德路线请求超时",503,body.route_id,True) from None
  except Exception:rec["status"]="failed";self.trace("walking_route","failed",body.route_id,(time.monotonic()-started)*1000,"UPSTREAM_PROTOCOL_ERROR");raise DomainError("UPSTREAM_PROTOCOL_ERROR","高德路线响应无效",503,body.route_id) from None
  finally:self.session_running.pop(body.session_id,None);rec["task"]=None
 def cancel(self,rid,sid):
  rec=self.records.get(rid)
  if not rec or rec["session"]!=sid:raise DomainError("VALIDATION_ERROR","路线请求不存在或会话不匹配",404,rid)
  running=rec["status"]=="running"
  if running and rec["task"]:rec["task"].cancel()
  return not running,rec["upstream"]
