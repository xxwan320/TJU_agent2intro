// M-owned JS API operations. A owns map/UI lifecycle, C owns the security proxy.
// Map rendering/location use the SDK; search/walking use the fixed same-origin JS security proxy.
import type {MapPublicConfig,POI,RouteRequest,RouteResponse,UserPosition,SpeechController,SpeechRun} from '../../../shared/r2';
import {MapBudget,MapCallError} from './map-budget';
import {api} from './api';
type Pair=[number,number];
type LngLat={getLng():number;getLat():number};
type Callback=(status:string,result:unknown)=>void;
interface Geo {getCurrentPosition(callback:Callback):void}
interface CitySearch {getLocalCity(callback:Callback):void}
export interface MapDestination {poiId:string;providerId:string;name:string;address:string;lng:number;lat:number;matchedAt:number}
export class DestinationSelectionRequired extends MapCallError{
 origin?:UserPosition;
 constructor(readonly matches:MapDestination[]){super('destination_selection_required');}
}
export type InternalRouteRequest=Omit<RouteRequest,'origin'>&{origin:UserPosition|null};
export interface MapHandle {destroy():void}
export interface AmapSdk {
 Map:new(host:HTMLElement,options:Record<string,unknown>)=>MapHandle;
 Geolocation:new(options:Record<string,unknown>)=>Geo;
 CitySearch?:new()=>CitySearch;
}
type Loader=(config:MapPublicConfig)=>Promise<AmapSdk>;
const loadSdk:Loader=async config=>{
 if(!config.js_key||!config.status.security_key_configured)throw new MapCallError('map_not_configured');
 (window as Window&{_AMapSecurityConfig?:{serviceHost:string}})._AMapSecurityConfig={serviceHost:window.location.origin+config.service_host};
 const loader=await import('@amap/amap-jsapi-loader');
 return await loader.default.load({key:config.js_key,version:'2.0',plugins:['AMap.Geolocation','AMap.CitySearch']}) as AmapSdk;
};
function pair(value:unknown):Pair {
 const p=value as Partial<LngLat>&{lng?:number;lat?:number};
 const lng=typeof p?.getLng==='function'?p.getLng():p?.lng;
 const lat=typeof p?.getLat==='function'?p.getLat():p?.lat;
 if(typeof lng!=='number'||typeof lat!=='number'||!Number.isFinite(lng)||!Number.isFinite(lat)||Math.abs(lng)>180||Math.abs(lat)>90)throw new MapCallError('invalid_coordinates');
 return [lng,lat];
}
function providerPoint(value:unknown):Pair{
 if(typeof value!=='string')throw new MapCallError('invalid_coordinates');
 const parts=value.split(',');if(parts.length!==2||parts.some(p=>!p.trim()))throw new MapCallError('invalid_coordinates');
 return pair({lng:Number(parts[0]),lat:Number(parts[1])});
}
function meters(value:unknown):number{
 if(typeof value!=='number'&&(typeof value!=='string'||!/^\d+(?:\.\d+)?$/.test(value)))throw new MapCallError('invalid_route_result');
 const result=Number(value);if(!Number.isFinite(result)||result<0)throw new MapCallError('invalid_route_result');return result;
}
const SERVICE_CODES=new Set(['NOT_CONFIGURED','VALIDATION_ERROR','RATE_LIMITED','UPSTREAM_TIMEOUT','TRANSPORT_TIMEOUT','NETWORK_ERROR','UPSTREAM_PROTOCOL_ERROR','INVALID_USER_KEY','USERKEY_PLAT_NOMATCH','INVALID_USER_SCODE','INVALID_USER_DOMAIN','DAILY_QUERY_OVER_LIMIT','INSUFFICIENT_PRIVILEGES','NO_ROADS_NEARBY','OVER_DIRECTION_RANGE','OUT_OF_SERVICE']);
function callbackResult<T>(signal:AbortSignal,invoke:(done:Callback)=>void,parse:(value:unknown)=>T,cleanup:()=>void=()=>{},timeoutMs=15000):Promise<T>{
 return new Promise((resolve,reject)=>{
  let settled=false;
  const finish=(error:unknown,value?:T)=>{if(settled)return;settled=true;clearTimeout(timer);signal.removeEventListener('abort',abort);cleanup();if(error)reject(error);else resolve(value as T);};
  const abort=()=>finish(new MapCallError('cancelled'));
  const timer=setTimeout(()=>finish(new MapCallError('map_timeout')),timeoutMs);
  signal.addEventListener('abort',abort,{once:true});
  if(signal.aborted){abort();return;}
  try {invoke((status,result)=>{if(settled)return;if(status!=='complete'){
     const data=result as {info?:unknown;message?:unknown;code?:unknown}|null;
     const reason=[data?.info,data?.message,data?.code].filter(x=>typeof x==='string').join(' ').toUpperCase();
     const code=/PERMISSION_DENIED|USER_DENIED|USER DENIED/.test(reason)?'permission_denied':/TIME_OUT|TIMEOUT|TIME OUT/.test(reason)?'location_timeout':status==='no_data'?'route_no_data':'map_provider_failed';
     finish(new MapCallError(code));return;
    }try{finish(null,parse(result));}catch(error){finish(error);}});}catch(error){finish(error);}
 });
}
export class AmapNavigation {
 private sdk:AmapSdk|null=null;
 private loading:Promise<AmapSdk>|null=null;
 private config:MapPublicConfig;
 readonly budget:MapBudget;
 private loader:Loader;
 private readJson:typeof api;
 private destinations=new Map<string,MapDestination>();
 private destinationLists=new Map<string,MapDestination[]>();
 constructor(config:MapPublicConfig,budget:MapBudget,loader:Loader=loadSdk,readJson:typeof api=api){this.config=config;this.budget=budget;this.loader=loader;this.readJson=readJson;}
 private async serviceGet<T>(path:'v3/place/text'|'v3/direction/walking'|'v3/ip',params:Record<string,string>,signal:AbortSignal):Promise<T>{
  if(signal.aborted)throw new MapCallError('cancelled');
  let abort:()=>void=()=>{};
  const cancelled=new Promise<never>((_,reject)=>{abort=()=>reject(new MapCallError('cancelled'));signal.addEventListener('abort',abort,{once:true});});
  try{
   const body=await Promise.race([this.readJson<T&{status?:unknown}>('/maps/amap/_AMapService/'+path+'?'+new URLSearchParams({...params,output:'JSON'}),{signal,cache:'no-store'}),cancelled]);
   if(!body||String(body.status)!=='1')throw new MapCallError('UPSTREAM_PROTOCOL_ERROR');
   return body;
  }catch(error){
   if(signal.aborted)throw new MapCallError('cancelled');
   if(error instanceof MapCallError)throw error;
   const code=(error as {error?:{code?:unknown}})?.error?.code;
   throw new MapCallError(typeof code==='string'&&SERVICE_CODES.has(code)?code:'NETWORK_ERROR');
  }finally{signal.removeEventListener('abort',abort);}
 }
 private assertReady(){
  if(!this.config.js_key||!this.config.status.security_key_configured)throw new MapCallError('map_not_configured');
  if(!['UNVERIFIED','VERIFIED'].includes(this.config.status.online_map))throw new MapCallError('map_proxy_not_ready');
 }
 private async getSdk(){
  this.assertReady();
  if(!this.config.js_key||!this.config.status.security_key_configured)throw new MapCallError('map_not_configured');
  if(this.sdk)return this.sdk;
  if(!this.loading)this.loading=this.loader(this.config).then(sdk=>{this.sdk=sdk;return sdk;}); // Failure is sticky, no hidden retry.
  return this.loading;
 }
 async createMap(host:HTMLElement,operationId:string,signal:AbortSignal,userInitiated:boolean,options:Record<string,unknown>={}):Promise<MapHandle>{
  this.assertReady();
  return this.budget.run('map_load',operationId,userInitiated,signal,async()=>{
   const sdk=await this.getSdk();if(signal.aborted)throw new MapCallError('cancelled');
   const handle=new sdk.Map(host,{zoom:15,...options});
   if(signal.aborted){handle.destroy();throw new MapCallError('cancelled');}
   return handle;
  });
 }
 async locate(operationId:string,signal:AbortSignal,userConsented:boolean):Promise<UserPosition>{
  this.assertReady();
  return this.budget.run('geolocation',operationId,userConsented,signal,async()=>{
   const sdk=await this.getSdk();if(signal.aborted)throw new MapCallError('cancelled');
   const geo=new sdk.Geolocation({enableHighAccuracy:true,timeout:10000,convert:true,noIpLocate:0,showMarker:false,showCircle:false,panToLocation:false});
   return callbackResult(signal,done=>geo.getCurrentPosition(done),value=>{
    const result=value as {position:LngLat;accuracy?:number;location_type?:string};const [lng,lat]=pair(result.position);
    // Keep coarse positions explicit; the UI labels routes planned from an IP region center.
    const accuracy=typeof result.accuracy==='number'&&Number.isFinite(result.accuracy)&&result.accuracy>=0&&result.location_type!=='ip'?result.accuracy:null;
    return {lng,lat,crs:'GCJ02',source:'amap_geolocation',accuracy_m:accuracy,timestamp:new Date().toISOString()};
   });
  });
 }
 async locateCity(operationId:string,signal:AbortSignal,userConsented:boolean):Promise<UserPosition>{
  this.assertReady();
  return this.budget.run('geolocation',operationId,userConsented,signal,async()=>{
   const result=await this.serviceGet<{rectangle?:unknown}>('v3/ip',{},signal);
    if(typeof result.rectangle!=='string'||!result.rectangle.includes(';'))throw new MapCallError('city_location_unavailable');
    const corners=result.rectangle.split(';').map(providerPoint);
    if(corners.length!==2)throw new MapCallError('city_location_unavailable');
    const coordinates=pair({lng:(corners[0][0]+corners[1][0])/2,lat:(corners[0][1]+corners[1][1])/2});
    return {lng:coordinates[0],lat:coordinates[1],crs:'GCJ02',source:'amap_geolocation',accuracy_m:null,timestamp:new Date().toISOString()};
  });
 }
 async findDestination(poi:POI,operationId:string,signal:AbortSignal):Promise<MapDestination[]>{
  this.assertReady();
  if(signal.aborted)throw new MapCallError('cancelled');
  const cached=this.destinationLists.get(poi.id);
  if(cached?.length&&cached.every(match=>Date.now()-match.matchedAt<600000))return cached;
  return this.budget.run('poi_search',operationId,true,signal,async()=>{
   const campus=poi.campus_id==='weijinlu'?'天津大学卫津路校区':'天津大学北洋园校区';
   const value=await this.serviceGet<{pois?:Array<{id:string;name:string;address?:string;location:string}>}>('v3/place/text',{keywords:campus+poi.name.replace(/天津大学|卫津路校区|北洋园校区/g,'').trim(),city:'天津',citylimit:'true',offset:'5',page:'1',extensions:'base'},signal);
    const rows=value.pois;
    if(rows!==undefined&&!Array.isArray(rows))throw new MapCallError('UPSTREAM_PROTOCOL_ERROR');
    if(!rows?.length)throw new MapCallError('destination_not_found');
    const matches=rows.slice(0,5).filter(row=>typeof row.id==='string'&&typeof row.name==='string'&&row.location).map(row=>{
     const [lng,lat]=providerPoint(row.location);
     const match=Object.freeze({poiId:poi.id,providerId:row.id,name:row.name,address:typeof row.address==='string'?row.address:'地址未提供',lng,lat,matchedAt:Date.now()});
     this.destinations.set(poi.id+'/'+row.id,match);return match;
    });
    while(this.destinations.size>100)this.destinations.delete(this.destinations.keys().next().value!);
    if(!matches.length)throw new MapCallError('destination_not_found');
    this.destinationLists.set(poi.id,matches);
    while(this.destinationLists.size>100)this.destinationLists.delete(this.destinationLists.keys().next().value!);
    return matches;
  });
 }
 async navigate(request:InternalRouteRequest,poi:POI,signal:AbortSignal,matched?:MapDestination):Promise<{route:RouteResponse;origin:UserPosition;destination?:MapDestination}>{
  if(poi.id!==request.destination_poi_id||poi.campus_id!==request.campus_id)throw new MapCallError('poi_context_mismatch');
  if(!request.user_initiated)throw new MapCallError('user_action_required');
  let origin=request.origin;
  if(!origin||(origin.source!=='manual'&&(!Number.isFinite(Date.parse(origin.timestamp))||Date.now()-Date.parse(origin.timestamp)>120000))){
   origin=await this.locateCity(request.route_id+'-ip',signal,true);
  }
  let route:RouteResponse;
  try{route=await this.walk({...request,origin},poi,signal,matched);}
  catch(error){if(error instanceof DestinationSelectionRequired)error.origin=origin;throw error;}
  const matches=this.destinationLists.get(poi.id)??[];
  const destination=matched&&Date.now()-matched.matchedAt<600000?matched:matches.find(candidate=>candidate.name.endsWith(poi.name))??(matches.length===1?matches[0]:undefined);
  return {route,origin,destination};
 }
 async walk(request:RouteRequest,poi:POI,signal:AbortSignal,matched?:MapDestination):Promise<RouteResponse>{
  if(signal.aborted)throw new MapCallError('cancelled');
  if(!request.user_initiated)throw new MapCallError('user_action_required');
  if(poi.id!==request.destination_poi_id||poi.campus_id!==request.campus_id)throw new MapCallError('poi_context_mismatch');
  const entrance=request.entrance_id?poi.entrances.find(x=>x.id===request.entrance_id):null;
  if(request.entrance_id&&!entrance)throw new MapCallError('entrance_not_found');
  let target:{lng:number;lat:number}|null=entrance?entrance.location:poi.location;
  if(matched&&Date.now()-matched.matchedAt>=600000)matched=undefined;
  const loc=entrance?entrance.location:poi.location;
  if(!matched&&(!loc||loc.crs!=='GCJ02'||loc.quality==='pending'||loc.quality==='approximate'||!loc.verified_at||poi.verification_status!=='verified')){
   const matches=await this.findDestination(poi,request.route_id+'-destination',signal);
   const exact=matches.filter(candidate=>candidate.name.endsWith(poi.name));
   if(exact.length===1)matched=exact[0];
   else if(matches.length===1)matched=matches[0];
   else throw new DestinationSelectionRequired(matches);
  }
  if(matched){
   const known=this.destinations.get(poi.id+'/'+matched.providerId);
   if(!known||known!==matched||known.poiId!==poi.id||Date.now()-known.matchedAt>600000)throw new MapCallError('destination_match_expired');
   target=known;
  }else{
   target=loc!;
  }
  const origin=request.origin;pair(origin);pair(target);
  const age=Date.now()-Date.parse(origin.timestamp);
  if(origin.crs!=='GCJ02'||!['manual','amap_geolocation'].includes(origin.source)||(origin.accuracy_m!==null&&(!Number.isFinite(origin.accuracy_m)||origin.accuracy_m<0))||(origin.source==='manual'&&origin.accuracy_m!==null)||!Number.isFinite(age)||age< -5000||(origin.source!=='manual'&&age>120000))throw new MapCallError('location_expired_or_inaccurate');
  this.assertReady();
  return this.budget.run('walking_route',request.route_id,request.user_initiated,signal,async()=>{
   const point=(p:{lng:number;lat:number})=>p.lng.toFixed(6)+','+p.lat.toFixed(6);
   const value=await this.serviceGet<{route?:{paths?:Array<{distance:string;duration?:string;steps?:Array<{instruction:string;distance:string;polyline:string}>}>}}>('v3/direction/walking',{origin:point(origin),destination:point(target)},signal);
    const paths=value.route?.paths;
    if(!Array.isArray(paths)||!paths.length)throw new MapCallError('route_no_data');
    const raw=paths[0];
    if(!raw||!Array.isArray(raw.steps)||!raw.steps.length)throw new MapCallError('invalid_route_result');
    const steps=raw.steps.map(step=>{
     if(typeof step.instruction!=='string'||!step.instruction.trim()||typeof step.polyline!=='string'||!step.polyline)throw new MapCallError('invalid_route_step');
     return {instruction:step.instruction,distance_m:meters(step.distance),polyline:step.polyline.split(';').map(providerPoint)};
    });
    return {route_id:request.route_id,destination_poi_id:poi.id,provider:'amap',crs:'GCJ02',distance_m:meters(raw.distance),duration_s:raw.duration==null?null:meters(raw.duration),steps,campus_access:'unverified',access_source_refs:[]};
  });
 }
}
export function routeNarration(route:RouteResponse):string {
 return ['步行路线，全程约'+Math.round(route.distance_m)+'米。',...route.steps.map((s,i)=>'第'+(i+1)+'步，'+s.instruction),...(route.campus_access==='unverified'?['校园入口、门禁和道路实际通行情况尚待核验。']:[])].join('\n');
}
export async function speakRoute(controller:SpeechController,run:SpeechRun,route:RouteResponse){
 // B's existing controller owns the common sanitizer/FIFO/player; no extra TTS/LLM chain.
 return controller.playFull(run,routeNarration(route));
}
