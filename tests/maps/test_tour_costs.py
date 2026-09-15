import asyncio
from uuid import uuid4
import pytest
from backend.common.errors import DomainError
from backend.maps.cost_service import CostService
from backend.model.tour_catalog import TourCatalog
from backend.r3_contracts import RouteCostRequest
from tests.model.tour_fixtures import Directory


def test_costs_adjacent_unknown_no_provider_and_cross_campus():
    async def run():
        service=CostService(TourCatalog(Directory()))
        body=RouteCostRequest(request_id=uuid4(),session_id=uuid4(),campus_id='weijinlu',places=[
            {'kind':'current_position'},{'kind':'poi','poi_id':'fixture-weijinlu-0'},{'kind':'poi','poi_id':'fixture-weijinlu-1'}])
        result=await service.estimate(body)
        assert len(result.costs)==2 and all(x.source=='unknown' and x.duration_s is None for x in result.costs)
        body.places[1].poi_id='fixture-beiyangyuan-0'
        with pytest.raises(DomainError):await service.estimate(body)
    asyncio.run(run())
