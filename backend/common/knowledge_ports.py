"""M-owned read-only protocol. D implements it on the SAME LocalKnowledge instance."""
from datetime import date
from typing import Protocol
from backend.contracts import CampusId
from backend.r3_knowledge_contracts import TourKnowledgeContext
from backend.r3_contracts import RouteCostRequest, RouteCostResponse

class TourKnowledgeSource(Protocol):
    def get_tour_context(self, poi_id: str, campus_id: CampusId, visit_date: date | None = None) -> TourKnowledgeContext: ...
    def get_tour_route_costs(self, body: RouteCostRequest) -> RouteCostResponse: ...

def get_tour_knowledge():
    from backend.knowledge.service import knowledge
    return knowledge