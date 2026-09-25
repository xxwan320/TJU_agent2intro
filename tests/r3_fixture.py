"""EXPLICIT TEST/DEVELOPMENT ONLY. Synthetic responses; no provider, maps or microphone.
Run: python -m uvicorn r3_fixture:app --app-dir tests --host 127.0.0.1 --port 8011
No production import or environment flag enables this fixture.
This is a response-shape simulator, not C's transition/feasibility implementation.
"""
from copy import deepcopy
from datetime import datetime, timezone
from uuid import uuid4
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from backend.knowledge.routes import router as knowledge_router
from backend.knowledge.r2_routes import router as knowledge_r2_router
from backend.common.tour_routes import router
from backend.common.tour_ports import get_tour_service, get_route_cost_service
from backend.common.errors import DomainError
from backend.r3_contracts import TourRequest, TourSession, TourResult, RouteCostResponse

def sample_request():
    return dict(request_id=str(uuid4()),session_id=str(uuid4()),campus_id="weijinlu",
        duration_minutes=60,interests=["TEST ONLY: fixture interests"],
        start={"kind":"unspecified","poi_id":None},end={"kind":"unspecified","poi_id":None},
        accessibility="standard")

def sample_session(request=None):
    request=request or sample_request()
    now=datetime.now(timezone.utc).isoformat()
    stops=[dict(stop_id=str(uuid4()),poi_id="fixture-stop-"+str(i),title="TEST ONLY "+str(i),
        visit_minutes=10,visit_time_source="planner_allocation",purpose="Synthetic contract fixture",evidence_ids=[]) for i in range(3)]
    return dict(tour_id=str(uuid4()),session_id=request["session_id"],state_version=1,status="draft",
        plan=dict(plan_id=str(uuid4()),version=1,campus_id=request["campus_id"],status="draft",request=request,
        stops=stops,legs=[],evidence=[],warnings=["TEST ONLY — no real campus facts or route costs"],created_at=now),
        progress=[{"stop_id":s["stop_id"],"state":"pending"} for s in stops],current_stop_id=None,
        remaining_minutes=60,saved=False,updated_at=now)

class FixtureTour:
    implementation="fixture_only"
    def __init__(self):
        self.sessions={}
    def result(self, request_id, session):
        validated=TourSession.model_validate(session)
        self.sessions[str(validated.tour_id)]=validated.model_dump(mode="json")
        return TourResult(request_id=request_id,session=validated,usage=None)
    async def create(self, body):
        return self.result(body.request_id,sample_session(body.model_dump(mode="json")))
    async def read(self, tour_id, session_id):
        s=self.sessions.get(str(tour_id))
        if s is None or s["session_id"]!=str(session_id):
            raise DomainError("TOUR_NOT_FOUND","Fixture tour not found",404)
        return TourSession.model_validate(s)
    async def checked(self,tour_id,body):
        s=(await self.read(tour_id,body.session_id)).model_dump(mode="json")
        if s["plan"]["version"]!=body.expected_version or s["state_version"]!=body.expected_state_version:
            raise DomainError("TOUR_VERSION_CONFLICT","Fixture version conflict",409,body.request_id)
        s["state_version"]+=1
        return s
    async def revise(self,tour_id,body):
        s=await self.checked(tour_id,body)
        s["plan"]["version"]+=1
        if body.operation=="set_remaining_time":s["remaining_minutes"]=body.remaining_minutes
        elif body.operation=="remove_stop":
            s["plan"]["stops"]=[x for x in s["plan"]["stops"] if x["stop_id"]!=str(body.stop_id)]
            s["progress"]=[x for x in s["progress"] if x["stop_id"]!=str(body.stop_id)]
            if s["current_stop_id"]==str(body.stop_id):s["current_stop_id"]=None;s["status"]="paused"
        else:
            for stop in s["plan"]["stops"]:
                if stop["stop_id"]==str(body.stop_id):stop["poi_id"]=body.replacement_poi_id
        return self.result(body.request_id,s)
    async def command(self,tour_id,body):
        s=await self.checked(tour_id,body)
        action=body.action
        if action=="check":s["status"]="checked";s["plan"]["status"]="checked"
        elif action in ("start","resume","next"):
            s["status"]="active";s["plan"]["status"]="checked"
            pending=next((x for x in s["progress"] if x["state"] not in ("completed","skipped")),None)
            s["current_stop_id"]=pending["stop_id"] if pending else None
            if pending:pending["state"]="navigating"
            else:s["status"]="completed"
        elif action in ("pause","cancel"):s["status"]="paused" if action=="pause" else "cancelled"
        elif action=="end":
            s["status"]="completed";s["completion_reason"]="user_ended";s["current_stop_id"]=None
            for progress in s["progress"]:
                if progress["state"]!="completed":progress["state"]="skipped"
        elif action=="skip":
            for progress in s["progress"]:
                if progress["stop_id"]==str(body.stop_id):progress["state"]="skipped"
            pending=next((x for x in s["progress"] if x["state"] not in ("completed","skipped")),None)
            s["current_stop_id"]=pending["stop_id"] if pending else None
            if pending:pending["state"]="navigating"
            else:s["status"]="completed";s["completion_reason"]="all_stops_resolved"
        elif action in ("save","forget"):s["saved"]=action=="save"
        else:
            for p in s["progress"]:
                if p["stop_id"]==str(body.stop_id):p["state"]={"arrive":"arrived","explain":"explaining","complete_stop":"completed"}[action]
        return self.result(body.request_id,s)
    async def restore(self,body):
        s=body.snapshot.model_dump(mode="json")
        s["tour_id"]=str(uuid4());s["state_version"]+=1
        if s["status"]=="active":s["status"]="paused"
        return self.result(body.request_id,s)

class FixtureCosts:
    async def estimate(self,body):
        return RouteCostResponse(request_id=body.request_id,costs=[dict(from_ref=a,to_ref=b,
            distance_m=None,duration_s=None,source="unknown",verification="unverified",checked_at=None,
            campus_access="unverified",evidence_ids=[],reason="missing_data") for a,b in zip(body.places,body.places[1:])])

app=FastAPI(title="R3 TEST ONLY fixture; never real campus/provider evidence")
app.include_router(router)
app.include_router(knowledge_router)
app.include_router(knowledge_r2_router)
fixture_service=FixtureTour()
app.dependency_overrides[get_tour_service]=lambda:fixture_service
app.dependency_overrides[get_route_cost_service]=lambda:FixtureCosts()
@app.middleware("http")
async def label(request,call_next):
    response=await call_next(request)
    response.headers["X-R3-Fixture"]="TEST-ONLY"
    return response
@app.exception_handler(DomainError)
async def domain_error(request,error):
    return JSONResponse(status_code=error.status,content={"error":{"code":error.code,"message":error.message,
        "request_id":str(error.request_id) if error.request_id else None,"retryable":False}})
@app.get("/api/health")
def health():
    return {"status":"ok","contract_version":"1.1.0","model":{"configured":False,"verified":False},
        "capabilities":{"chat":False,"asr":False,"tts":False,"knowledge":True,"scene_3d":False}}
@app.get("/api/maps/status")
def map_status():
    return {"local_map":"ready","external_navigation":"not_implemented","online_map":"NOT_CONFIGURED",
        "js_key_configured":False,"security_key_configured":False,"web_service_key_configured":False,
        "precise_location":"NOT_CONFIGURED","in_app_routing":"NOT_CONFIGURED"}
@app.get("/api/maps/config")
def map_config():
    return {"js_key":None,"service_host":"/api/maps/amap/_AMapService","route_backend":"js_api","status":map_status()}
