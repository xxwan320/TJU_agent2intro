"""M-owned injection boundary; C implements services in its existing directories."""
from typing import Protocol
from uuid import UUID
from backend.r3_contracts import TourRequest, TourResult, TourSession, PlanRevision, TourCommand, TourRestore, RouteCostRequest, RouteCostResponse

class TourService(Protocol):
    implementation: str
    async def create(self, body: TourRequest) -> TourResult: ...
    async def read(self, tour_id: UUID, session_id: UUID) -> TourSession: ...
    async def revise(self, tour_id: UUID, body: PlanRevision) -> TourResult: ...
    async def command(self, tour_id: UUID, body: TourCommand) -> TourResult: ...
    async def restore(self, body: TourRestore) -> TourResult: ...

def get_tour_service() -> TourService:
    from backend.model.tour_service import tour_service
    return tour_service

class RouteCostService(Protocol):
    async def estimate(self, body: RouteCostRequest) -> RouteCostResponse: ...

def get_route_cost_service() -> RouteCostService:
    from backend.maps.cost_service import cost_service
    return cost_service