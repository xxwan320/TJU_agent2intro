"""M-owned additive HTTP assembly for D's public temporal evidence projection."""
from datetime import date
from fastapi import APIRouter, Depends
from backend.contracts import CampusId
from backend.r2_contracts import Id
from backend.r3_knowledge_contracts import TourKnowledgeContext
from backend.common.knowledge_ports import get_tour_knowledge
from backend.common.errors import DomainError
router=APIRouter(prefix="/api/knowledge",tags=["R3 knowledge"])

@router.get("/tour-context/{poi_id}",response_model=TourKnowledgeContext)
def tour_context(poi_id: Id,campus_id: CampusId,visit_date: date | None = None,source=Depends(get_tour_knowledge)):
    getter=getattr(source,"get_tour_context",None)
    if getter is None:
        raise DomainError("KNOWLEDGE_TOUR_NOT_IMPLEMENTED","行程资料投影待D窗口实现",501)
    context=TourKnowledgeContext.model_validate(getter(poi_id,campus_id,visit_date))
    if context.poi_id!=poi_id or context.campus_id!=campus_id or context.requested_date!=visit_date:
        raise DomainError("KNOWLEDGE_CONTEXT_MISMATCH","资料上下文不匹配",503)
    return context