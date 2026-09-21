"""Map status, fixed AMap security proxy, external navigation and walking routes."""
from uuid import UUID
from pathlib import Path
from fastapi import APIRouter, Request
from fastapi.responses import Response
from backend.common.config import get_settings
from backend.r2_contracts import MapStatus,MapPublicConfig,ExternalNavigation,RouteRequest,RouteResponse,RouteCancelRequest,RouteCancelResponse
from backend.knowledge.service import knowledge
from .service import MapService
router=APIRouter(prefix="/api/maps",tags=["maps"])
settings=get_settings();maps=MapService(settings)
@router.get("/status",response_model=MapStatus)
def status():
 def exists(asset):
  relative=asset.local_path
  if not relative.startswith("/assets/"):return False
  root=Path(__file__).resolve().parents[2]
  for public in ((root/"dist").resolve(),(root/"frontend"/"public").resolve()):
   target=(public/relative.lstrip("/")).resolve()
   if target.is_relative_to(public) and target.is_file():return True
  return False
 getter=getattr(knowledge,"get_campus_assets",None) or getattr(knowledge,"get_assets",None)
 local_ready=False
 if getter:
  try:local_ready=all(any(exists(asset) for asset in getter(campus).maps) for campus in ("weijinlu","beiyangyuan"))
  except Exception:local_ready=False
 try:external_ready=any(knowledge.list_buildings(campus) for campus in ("weijinlu","beiyangyuan"))
 except Exception:external_ready=False
 return MapStatus(local_map="ready" if local_ready else "not_implemented",external_navigation="ready" if external_ready else "not_implemented",
  online_map=maps.online_state,js_key_configured=bool(settings.amap_js_key),security_key_configured=bool(settings.amap_security_key.get_secret_value()),
  web_service_key_configured=bool(settings.amap_web_service_key.get_secret_value()),precise_location="UNVERIFIED" if maps.online_state!="NOT_CONFIGURED" else "NOT_CONFIGURED",in_app_routing=maps.route_state)
@router.get("/config",response_model=MapPublicConfig)
def public_config():return MapPublicConfig(js_key=settings.amap_js_key or None,service_host="/api/maps/amap/_AMapService",route_backend="js_api",status=status())
@router.get("/external-navigation/{poi_id}",response_model=ExternalNavigation)
def external_navigation(poi_id:str):return maps.external(poi_id)
@router.get("/amap/_AMapService/{path:path}")
async def proxy(path:str,request:Request):
 if len(request.query_params.multi_items()) != len(request.query_params):
  from backend.common.errors import DomainError
  raise DomainError("VALIDATION_ERROR","重复地图参数无效",422)
 upstream=await maps.proxy(path,dict(request.query_params))
 return Response(content=upstream.content,status_code=upstream.status_code,media_type=upstream.headers.get("content-type","application/json"))
@router.post("/routes",response_model=RouteResponse)
async def plan_route(body:RouteRequest):return await maps.route(body)
@router.post("/routes/{route_id}/cancel",response_model=RouteCancelResponse)
async def cancel_route(route_id:UUID,body:RouteCancelRequest):
 local_stopped,upstream=maps.cancel(route_id,body.session_id)
 return RouteCancelResponse(route_id=route_id,local_stopped=local_stopped,upstream_stop=upstream)
