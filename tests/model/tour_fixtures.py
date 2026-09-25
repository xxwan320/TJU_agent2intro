"""Frozen C algorithm fixtures. Never imported by the application."""
import json
from types import SimpleNamespace
from backend.r2_contracts import POI
from backend.r3_contracts import Evidence, RouteCostResponse, RouteCostResult
from backend.model.tour_catalog import TourCatalog, utcnow
from backend.model.service import HistoryStore

DATASET_VERSION = 'c-algorithm-fixture-v1'

class Directory:
    def __init__(self):
        self.rows = [POI(id=f'fixture-{campus}-{i}',campus_id=campus,name=f'测试站{i}',aliases=['同名'] if i in (1,2) else [],
            category='culture',description='合成测试资料',source_refs=[],location=None,schematic_position=None,
            entrances=[],verification_status='pending') for campus in ('weijinlu','beiyangyuan') for i in range(5)]
    def get_poi(self,pid):
        return next((p for p in self.rows if p.id==pid),None)
    def list_pois(self,campus,category,query,limit,cursor):
        return SimpleNamespace(items=[p for p in self.rows if p.campus_id==campus],next_cursor=None)
    def tour_evidence(self,pid,campus):
        return [Evidence(evidence_id='ev-'+pid,source_ref='fact-'+pid,claim='合成测试事实',relation='supports',verification='verified',checked_at=utcnow())]

class Provider:
    def __init__(self):
        self.calls=0; self.messages=[]; self.wait=None; self.entered=None; self.swallow=False; self.answer=None
    async def complete(self,rid,messages):
        self.calls+=1; self.messages.append(messages)
        if self.entered:self.entered.set()
        if self.wait:
            try:await self.wait.wait()
            except __import__('asyncio').CancelledError:
                if not self.swallow:raise
        payload=json.loads(messages[-1]['content'])
        return self.answer or json.dumps({'poi_ids':[p['poi_id'] for p in payload['candidates'][:3]]}),None,'fixture-model'

class Costs:
    def __init__(self,seconds=60,restricted=False):self.seconds=seconds;self.restricted=restricted
    async def estimate(self,body):
        return RouteCostResponse(request_id=body.request_id,costs=[RouteCostResult(from_ref=a,to_ref=b,
            distance_m=100,duration_s=self.seconds,source='campus_evidence',verification='unverified',checked_at=utcnow(),
            campus_access='restricted' if self.restricted else 'unverified',reason='available') for a,b in zip(body.places,body.places[1:])])

def fixture_service(costs=None,clock=None,ttl=3600,capacity=1000):
    from backend.model.tour_service import TourService
    from backend.model.tour_planner import Planner
    from backend.model.runtime import RuntimeStore
    provider=Provider();model=SimpleNamespace(provider=provider,history=HistoryStore())
    planner=Planner(TourCatalog(Directory()),costs,model)
    kwargs={'clock':clock} if clock else {}
    return TourService(planner,RuntimeStore(),ttl,capacity,**kwargs),provider
