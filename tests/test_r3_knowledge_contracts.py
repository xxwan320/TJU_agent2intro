"""Public D/C/A evidence boundary; no invented source facts or provider calls."""
from datetime import date
from fastapi import FastAPI
from fastapi.testclient import TestClient
from pydantic import ValidationError
import pytest
from backend.r2_contracts import CampusMedia
from backend.r3_knowledge_contracts import ApplicableEvidence,TourKnowledgeContext
from backend.common.knowledge_tour_routes import router
from backend.common.knowledge_ports import get_tour_knowledge

def evidence():
    return dict(poi_id="fixture-poi",campus_id="weijinlu",claim_type="published_rule",current_status="pending",
        evidence=dict(evidence_id="fixture-evidence",source_ref="fixture-source",claim="TEST ONLY: opening rule",
            relation="retrieved",verification="unverified",checked_at=None))

def test_retrieval_does_not_confirm_current_access():
    body=evidence();ApplicableEvidence(**body)
    body["evidence"]=dict(body["evidence"],verification="verified",checked_at="2026-09-15T00:00:00Z")
    with pytest.raises(ValidationError):ApplicableEvidence(**body)
    body["current_status"]="confirmed";ApplicableEvidence(**body)
    with pytest.raises(ValidationError):ApplicableEvidence(**dict(body,conflict_ids=["fixture-conflict"]))

def test_context_references_and_no_coordinates():
    base=dict(poi_id="fixture-poi",campus_id="weijinlu",requested_date=None,version="fixture-only",evidence=[evidence()])
    TourKnowledgeContext(**base)
    with pytest.raises(ValidationError):TourKnowledgeContext(**dict(base,campus_id="beiyangyuan"))
    with pytest.raises(ValidationError):TourKnowledgeContext(**dict(base,coordinates={"lng":117,"lat":39}))

def test_http_projects_same_store_and_requested_date():
    calls=[]
    class Source:
        def get_tour_context(self,poi_id,campus_id,visit_date):
            calls.append((poi_id,campus_id,visit_date))
            return dict(poi_id=poi_id,campus_id=campus_id,requested_date=visit_date,version="fixture-only",evidence=[])
    app=FastAPI();app.include_router(router);app.dependency_overrides[get_tour_knowledge]=lambda:Source()
    with TestClient(app) as client:
        r=client.get("/api/knowledge/tour-context/fixture-poi?campus_id=weijinlu&visit_date=2026-10-01")
        assert r.status_code==200 and r.json()["requested_date"]=="2026-10-01"
    assert calls==[("fixture-poi","weijinlu",date(2026,10,1))]

def test_media_optional_entity_does_not_guess():
    sample=dict(id="fixture-media",campus_id="weijinlu",local_path="/assets/campus/fixture.jpg",source_url="https://example.invalid/test",
        creator=None,usage_basis="TEST ONLY",caption="fixture",focal_point=(.5,.5),width=1,height=1)
    assert CampusMedia(**sample).poi_id is None
    assert CampusMedia(**dict(sample,poi_id="fixture-poi")).poi_id=="fixture-poi"
    with pytest.raises(ValidationError):CampusMedia(**dict(sample,poi_id="../invalid"))