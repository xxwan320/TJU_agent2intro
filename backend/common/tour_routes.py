"""M-owned additive HTTP assembly; fixtures are dependency overrides in a separate app."""
from uuid import UUID
from fastapi import APIRouter, Depends
from backend.r3_contracts import TourRequest, TourResult, TourSession, PlanRevision, TourCommand, TourRestore, RouteCostRequest, RouteCostResponse
from backend.common.tour_ports import get_tour_service, get_route_cost_service

router = APIRouter(prefix="/api", tags=["R3"])
@router.get("/tours/status")
def status(service=Depends(get_tour_service)):
    return {"contract_version": "1.2.0", "implementation": service.implementation, "fixture": service.implementation == "fixture_only"}

@router.post("/tours", response_model=TourResult)
async def create(body: TourRequest, service=Depends(get_tour_service)):
    return await service.create(body)

@router.post("/tours/restore", response_model=TourResult)
async def restore(body: TourRestore, service=Depends(get_tour_service)):
    return await service.restore(body)

@router.get("/tours/{tour_id}", response_model=TourSession)
async def read(tour_id: UUID, session_id: UUID, service=Depends(get_tour_service)):
    return await service.read(tour_id, session_id)

@router.post("/tours/{tour_id}/revisions", response_model=TourResult)
async def revise(tour_id: UUID, body: PlanRevision, service=Depends(get_tour_service)):
    return await service.revise(tour_id, body)

@router.post("/tours/{tour_id}/commands", response_model=TourResult)
async def command(tour_id: UUID, body: TourCommand, service=Depends(get_tour_service)):
    return await service.command(tour_id, body)

@router.post("/maps/route-costs", response_model=RouteCostResponse)
async def costs(body: RouteCostRequest, service=Depends(get_route_cost_service)):
    return await service.estimate(body)