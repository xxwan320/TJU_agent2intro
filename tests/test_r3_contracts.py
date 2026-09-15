"""M-owned shared boundary checks; synthetic fixtures are not live task evidence."""
import importlib.util
from pathlib import Path
from uuid import uuid4
import pytest
from fastapi.testclient import TestClient
from pydantic import ValidationError
from backend.app import app
from backend.r3_contracts import TourRequest,TourSession,PlanRevision,RouteCostResult,SpeechInteractionEvent,EvaluationRecord
spec=importlib.util.spec_from_file_location("r3_fixture",Path(__file__).with_name("r3_fixture.py"))
fixture=importlib.util.module_from_spec(spec);spec.loader.exec_module(fixture)

def test_production_is_not_fixture():
    with TestClient(app) as client:
        status=client.get("/api/tours/status")
        assert status.json()["fixture"] is False and "X-R3-Fixture" not in status.headers
        if status.json()["implementation"]=="not_implemented":
            r=client.post("/api/tours",json=fixture.sample_request())
            assert r.status_code==501 and r.json()["error"]["code"]=="TOUR_NOT_IMPLEMENTED"
        bad=fixture.sample_request();bad["start"]["lat"]=39
        r=client.post("/api/tours",json=bad)
        assert r.status_code==422 and "39" not in r.text
    assert not app.dependency_overrides

def test_session_refs_and_history_rejected():
    sample=fixture.sample_session()
    TourSession.model_validate(sample)
    for key,value in [("history",[]),("coordinates",{"lat":39,"lng":117})]:
        with pytest.raises(ValidationError):TourSession.model_validate(dict(sample,**{key:value}))
    sample["progress"]=sample["progress"][:1]
    with pytest.raises(ValidationError):TourSession.model_validate(sample)
    sample=fixture.sample_session();sample["plan"]["stops"]=sample["plan"]["stops"][:2]
    with pytest.raises(ValidationError):TourSession.model_validate(sample)

def test_revision_fields_are_unambiguous():
    base=dict(request_id=uuid4(),session_id=uuid4(),expected_version=1,expected_state_version=1)
    PlanRevision(**base,operation="set_remaining_time",remaining_minutes=0)
    with pytest.raises(ValidationError):PlanRevision(**base,operation="replace_stop",stop_id=uuid4())
    with pytest.raises(ValidationError):PlanRevision(**base,operation="remove_stop",stop_id=uuid4(),remaining_minutes=20)

def test_unknown_cost_and_verification():
    body=dict(from_ref={"kind":"unspecified"},to_ref={"kind":"poi","poi_id":"fixture-stop"},
        distance_m=None,duration_s=None,source="unknown",verification="unverified",checked_at=None,campus_access="unverified",reason="missing_data")
    RouteCostResult(**body)
    with pytest.raises(ValidationError):RouteCostResult(**dict(body,distance_m=10))
    with pytest.raises(ValidationError):RouteCostResult(**dict(body,campus_access="verified"))
    with pytest.raises(ValidationError):RouteCostResult(**dict(body,distance_m=float("nan")))

def test_speech_events_cannot_claim_text_as_playback():
    base=dict(event_id=uuid4(),interaction_id=uuid4(),session_id=uuid4(),campus_id="weijinlu",
        generation_id=uuid4(),request_id=None,timestamp="2026-09-15T00:00:00Z")
    SpeechInteractionEvent(**base,type="recognition.final",text="还有三十分钟")
    with pytest.raises(ValidationError):SpeechInteractionEvent(**base,type="playback.started",text="hello",utterance_id=uuid4())
    with pytest.raises(ValidationError):SpeechInteractionEvent(**base,type="playback.started")

def test_usage_unknown_not_zero_or_full_text():
    base=dict(evaluation_id=uuid4(),case_id="fixture-case",dataset_version="fixture-v1",
        build_commit="0"*40,kind="fixture",outcome="not_tested",task_completed=None,constraint_passed=None,
        evidence_supported=None,evidence_total=None,elapsed_ms=None,model_calls=None,
        usage_status="unknown",usage=None,unknown_usage_calls=1,map_operations=None)
    EvaluationRecord(**base)
    with pytest.raises(ValidationError):EvaluationRecord(**dict(base,usage_status="known"))
    with pytest.raises(ValidationError):EvaluationRecord(**dict(base,prompt="raw private transcript"))

def test_fixture_flow_is_labeled_and_isolated():
    with TestClient(fixture.app) as c:
        r=c.post("/api/tours",json=fixture.sample_request())
        assert r.headers["X-R3-Fixture"]=="TEST-ONLY"
        s=r.json()["session"];tour=s["tour_id"]
        for action in ("check","start","pause","save"):
            body=dict(request_id=str(uuid4()),session_id=s["session_id"],expected_version=s["plan"]["version"],
                expected_state_version=s["state_version"],action=action)
            r=c.post(f"/api/tours/{tour}/commands",json=body)
            assert r.status_code==200,r.text
            s=r.json()["session"]
        assert s["status"]=="paused" and s["saved"]
        assert c.post(f"/api/tours/{tour}/commands",json=body).status_code==409
        restored=c.post("/api/tours/restore",json=dict(request_id=str(uuid4()),session_id=s["session_id"],snapshot=s))
        assert restored.status_code==200 and restored.json()["session"]["tour_id"]!=tour
    with TestClient(app) as production:
        assert production.get("/api/tours/status").json()["fixture"] is False