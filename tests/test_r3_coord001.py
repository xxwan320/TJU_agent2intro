"""COORD-001: added fields are optional, but contradictory or misleading payloads fail."""
from uuid import uuid4
import pytest
from pydantic import ValidationError
from backend.r3_contracts import TourRequest, TourCommand, TourResult, EvaluationRecord
from tests.test_r3_contracts import fixture

def test_old_request_and_structured_constraints():
    sample=fixture.sample_request()
    assert TourRequest(**sample).must_visit==[]
    request=TourRequest(**dict(sample,message="想看校史",must_visit=["fixture-stop-0"],avoid=["fixture-stop-1"],visit_date="2026-10-01",max_walking_minutes=20))
    assert request.visit_date.isoformat()=="2026-10-01"
    for patch in [dict(must_visit=["x","x"]),dict(must_visit=["x"],avoid=["x"]),dict(avoid=["x"],start={"kind":"poi","poi_id":"x"}),dict(max_walking_minutes=-1)]:
        with pytest.raises(ValidationError):TourRequest(**dict(sample,**patch))

def test_skip_end_and_acknowledgement_shapes():
    base=dict(request_id=uuid4(),session_id=uuid4(),expected_version=1,expected_state_version=1)
    TourCommand(**base,action="skip",stop_id=uuid4())
    TourCommand(**base,action="end")
    TourCommand(**base,action="start",accept_unverified=True)
    with pytest.raises(ValidationError):TourCommand(**base,action="skip")
    with pytest.raises(ValidationError):TourCommand(**base,action="end",stop_id=uuid4())
    with pytest.raises(ValidationError):TourCommand(**base,action="check",accept_unverified=True)

def test_clarifications_are_structured_and_consistent():
    base=dict(request_id=uuid4(),session=fixture.sample_session())
    question=dict(question_id="start-ambiguous",field="start",prompt="请选择校门",candidate_poi_ids=["fixture-gate-a","fixture-gate-b"])
    TourResult(**base,clarification_required=True,clarifications=[question])
    with pytest.raises(ValidationError):TourResult(**base,clarifications=[question])
    with pytest.raises(ValidationError):TourResult(**base,clarification_required=True)
    with pytest.raises(ValidationError):TourResult(**base,clarification_required=True,clarifications=[question,question])

def test_evaluation_timing_does_not_mislabel_full_response_as_stream():
    import json
    from pathlib import Path
    sample=json.loads((Path(__file__).resolve().parents[1]/"docs/R3/examples.json").read_text(encoding="utf-8"))["EvaluationRecord"]
    old=EvaluationRecord(**sample)
    assert old.web_search_calls is None and old.first_content_source=="unknown"
    current=EvaluationRecord(**dict(sample,solution_id="enhanced",web_search_calls=1,failure_retries=0,first_content_ms=20,first_content_source="nonstream_response"))
    assert current.usage is None
    with pytest.raises(ValidationError):EvaluationRecord(**dict(sample,first_content_ms=20))