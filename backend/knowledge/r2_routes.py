"""D implements richer views over the existing authoritative knowledge store."""
from fastapi import APIRouter, Query
from backend.contracts import CampusId
from backend.common.errors import DomainError
from backend.r2_contracts import POI, POIPage, Coverage, CampusAssets, Category
from .service import knowledge
router=APIRouter(prefix="/api/knowledge", tags=["knowledge-r2"])
@router.get("/pois",response_model=POIPage)
def pois(campus_id:CampusId,category:Category|None=None,query:str=Query("",max_length=100),limit:int=Query(20,ge=1,le=100),cursor:str|None=Query(None,max_length=256)):
    try:
        return knowledge.list_pois(campus_id,category,query,limit,cursor)
    except ValueError:
        raise DomainError("invalid_cursor","目录游标无效、已过期或不匹配当前过滤条件",400)
@router.get("/pois/{poi_id}",response_model=POI)
def poi(poi_id:str):
    result=knowledge.get_poi(poi_id)
    if result is None or not knowledge.is_frontend_visible(poi_id):
        raise DomainError("poi_not_found","点位 ID 不存在",404)
    return result
@router.get("/coverage",response_model=Coverage)
def coverage(): return knowledge.get_coverage()
@router.get("/campus-assets",response_model=CampusAssets)
def assets(campus_id:CampusId): return knowledge.get_campus_assets(campus_id)
