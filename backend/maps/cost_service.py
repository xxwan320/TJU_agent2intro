"""Conservative adjacent costs. No map requests or quota use during planning."""
from backend.r3_contracts import RouteCostResponse, RouteCostResult
from backend.model.tour_catalog import catalog


class CostService:
    def __init__(self, directory=catalog):
        self.catalog = directory

    async def estimate(self, body):
        for place in body.places:
            if place.kind == 'poi':
                self.catalog.poi(place.poi_id, body.campus_id)
        projection = getattr(self.catalog.source, 'get_tour_route_costs', None)
        if projection:
            return projection(body)
        return RouteCostResponse(request_id=body.request_id, costs=[
            RouteCostResult(from_ref=a, to_ref=b, distance_m=None, duration_s=None,
                source='unknown', verification='unverified', checked_at=None,
                campus_access='unverified', evidence_ids=[], reason='missing_data')
            for a, b in zip(body.places, body.places[1:])])

cost_service = CostService()
