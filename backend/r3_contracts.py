"""M-owned R3 additive wire contract. No chat history or precise positions."""
from typing import Annotated, Literal
from datetime import date
from uuid import UUID
from pydantic import Field, AwareDatetime, model_validator
from backend.contracts import Strict, CampusId, Usage
from backend.r2_contracts import Id

R3_CONTRACT_VERSION = "1.2.0"
Text = Annotated[str, Field(min_length=1, max_length=500, pattern=r"\S")]
Version = Annotated[int, Field(ge=1)]
Verification = Literal["verified", "unverified", "historical", "disputed"]
class PlaceRef(Strict):
    kind: Literal["poi", "current_position", "unspecified"]
    poi_id: Id | None = None
    @model_validator(mode="after")
    def ref_shape(self):
        if (self.kind == "poi") != (self.poi_id is not None):
            raise ValueError("poi_id required only for poi")
        return self

class Evidence(Strict):
    evidence_id: Id
    source_ref: str = Field(min_length=1, max_length=200)
    claim: Text
    relation: Literal["retrieved", "supports", "contradicts"]
    verification: Verification
    checked_at: AwareDatetime | None
    valid_until: AwareDatetime | None = None
    @model_validator(mode="after")
    def verified_date(self):
        if self.verification == "verified" and self.checked_at is None:
            raise ValueError("Verified evidence requires check time")
        return self

class RouteCostResult(Strict):
    from_ref: PlaceRef
    to_ref: PlaceRef
    distance_m: float | None = Field(ge=0, allow_inf_nan=False)
    duration_s: float | None = Field(ge=0, allow_inf_nan=False)
    source: Literal["amap", "campus_evidence", "unknown"]
    verification: Verification
    checked_at: AwareDatetime | None
    campus_access: Literal["verified", "unverified", "restricted"]
    evidence_ids: list[Id] = Field(default_factory=list, max_length=20)
    reason: Literal["available", "missing_data", "not_configured", "cancelled", "unavailable", "budget_exhausted"]
    @model_validator(mode="after")
    def honest_cost(self):
        if self.source == "unknown" and (self.distance_m is not None or self.duration_s is not None):
            raise ValueError("Unknown cost has no numeric values")
        if self.source != "unknown" and self.checked_at is None:
            raise ValueError("Measured cost requires timestamp")
        if self.verification == "verified" and not self.evidence_ids:
            raise ValueError("Verified cost requires evidence")
        if self.campus_access == "verified" and not self.evidence_ids:
            raise ValueError("Verified access requires independent evidence")
        return self

class TourRequest(Strict):
    request_id: UUID
    session_id: UUID
    campus_id: CampusId
    duration_minutes: int = Field(ge=10, le=240)
    interests: list[Text] = Field(min_length=1, max_length=8)
    start: PlaceRef
    end: PlaceRef
    accessibility: Literal["standard", "step_free"] = "standard"
    message: str = Field(default="", max_length=2000)
    must_visit: list[Id] = Field(default_factory=list, max_length=5)
    avoid: list[Id] = Field(default_factory=list, max_length=100)
    visit_date: date | None = None
    max_walking_minutes: int | None = Field(default=None, ge=0, le=240)
    @model_validator(mode="after")
    def structured_constraints(self):
        if len(set(self.must_visit)) != len(self.must_visit) or len(set(self.avoid)) != len(self.avoid):
            raise ValueError("Duplicate constraint IDs")
        if set(self.must_visit) & set(self.avoid):
            raise ValueError("Conflicting required and avoided places")
        if any(p.poi_id in self.avoid for p in (self.start, self.end) if p.kind == "poi"):
            raise ValueError("Endpoint cannot be avoided")
        return self

class TourStop(Strict):
    stop_id: UUID
    poi_id: Id
    title: Text
    visit_minutes: int = Field(ge=1, le=120)
    visit_time_source: Literal["user_preference", "planner_allocation"]
    purpose: Text
    evidence_ids: list[Id] = Field(default_factory=list, max_length=20)

class TourPlan(Strict):
    plan_id: UUID
    version: Version
    campus_id: CampusId
    status: Literal["draft", "checked", "infeasible"]
    request: TourRequest
    stops: list[TourStop] = Field(max_length=5)
    legs: list[RouteCostResult] = Field(default_factory=list, max_length=6)
    evidence: list[Evidence] = Field(default_factory=list, max_length=80)
    warnings: list[Text] = Field(default_factory=list, max_length=20)
    created_at: AwareDatetime
    @model_validator(mode="after")
    def consistency(self):
        if self.campus_id != self.request.campus_id:
            raise ValueError("Campus mismatch")
        if len({x.stop_id for x in self.stops}) != len(self.stops) or len({x.poi_id for x in self.stops}) != len(self.stops):
            raise ValueError("Duplicate stops")
        if self.version == 1 and self.status != "infeasible" and not 3 <= len(self.stops) <= 5:
            raise ValueError("Initial plan requires 3-5 stops")
        if self.status == "checked" and not self.stops:
            raise ValueError("Checked plan requires stops")
        ids = {x.evidence_id for x in self.evidence}
        if len(ids) != len(self.evidence) or any(i not in ids for s in self.stops for i in s.evidence_ids) or any(i not in ids for leg in self.legs for i in leg.evidence_ids):
            raise ValueError("Invalid evidence reference")
        return self

class StopProgress(Strict):
    stop_id: UUID
    state: Literal["pending", "navigating", "arrived", "explaining", "completed", "skipped"]

class TourSession(Strict):
    tour_id: UUID
    session_id: UUID
    state_version: Version
    status: Literal["draft", "checked", "active", "paused", "completed", "cancelled", "infeasible"]
    plan: TourPlan
    progress: list[StopProgress] = Field(max_length=5)
    current_stop_id: UUID | None
    remaining_minutes: int = Field(ge=0, le=240)
    saved: bool
    updated_at: AwareDatetime
    completion_reason: Literal["all_stops_resolved", "user_ended"] | None = None
    @model_validator(mode="after")
    def consistency(self):
        if self.completion_reason is not None and self.status != "completed":
            raise ValueError("Completion reason belongs only to completed sessions")
        ids = {s.stop_id for s in self.plan.stops}
        if self.session_id != self.plan.request.session_id:
            raise ValueError("Session mismatch")
        if len(self.progress) != len(ids) or {s.stop_id for s in self.progress} != ids:
            raise ValueError("Progress must exactly cover plan")
        if self.current_stop_id is not None and self.current_stop_id not in ids:
            raise ValueError("Unknown current stop")
        if self.status in ("draft", "checked", "infeasible") and self.status != self.plan.status:
            raise ValueError("Plan and session status mismatch")
        if self.status in ("active", "paused", "completed") and self.plan.status != "checked":
            raise ValueError("Execution requires checked plan")
        if self.status == "active" and self.current_stop_id is None:
            raise ValueError("Active session requires current stop")
        return self

class Mutation(Strict):
    request_id: UUID
    session_id: UUID
    expected_version: Version
    expected_state_version: Version

class PlanRevision(Mutation):
    operation: Literal["set_remaining_time", "remove_stop", "replace_stop"]
    remaining_minutes: int | None = Field(default=None, ge=0, le=240)
    stop_id: UUID | None = None
    replacement_poi_id: Id | None = None
    @model_validator(mode="after")
    def operation_fields(self):
        expected = {"set_remaining_time": (True, False, False), "remove_stop": (False, True, False), "replace_stop": (False, True, True)}
        actual = (self.remaining_minutes is not None, self.stop_id is not None, self.replacement_poi_id is not None)
        if actual != expected[self.operation]:
            raise ValueError("Invalid revision fields")
        return self

class TourCommand(Mutation):
    accept_unverified: bool = False
    action: Literal["check", "start", "arrive", "explain", "complete_stop", "next", "pause", "resume", "cancel", "save", "forget", "skip", "end"]
    stop_id: UUID | None = None
    @model_validator(mode="after")
    def stop_field(self):
        if self.accept_unverified and self.action not in ("start", "resume"):
            raise ValueError("Risk acknowledgement belongs only to start/resume")
        if (self.action in ("arrive", "explain", "complete_stop", "skip")) != (self.stop_id is not None):
            raise ValueError("stop_id required only for stop actions")
        return self

class TourRestore(Strict):
    request_id: UUID
    session_id: UUID
    snapshot: TourSession
    @model_validator(mode="after")
    def saved_snapshot(self):
        if not self.snapshot.saved or self.snapshot.session_id != self.session_id:
            raise ValueError("Only explicitly saved same-session snapshots restore")
        return self

class ClarificationQuestion(Strict):
    question_id: Id
    field: Literal["message", "duration_minutes", "interests", "start", "end", "must_visit", "avoid", "visit_date", "max_walking_minutes", "accessibility"]
    prompt: Text
    candidate_poi_ids: list[Id] = Field(default_factory=list, max_length=20)

class TourResult(Strict):
    contract_version: Literal["1.2.0"] = "1.2.0"
    request_id: UUID
    session: TourSession
    replayed: bool = False
    usage: Usage | None = None
    clarification_required: bool = False
    clarifications: list[ClarificationQuestion] = Field(default_factory=list, max_length=8)
    @model_validator(mode="after")
    def questions_match(self):
        if self.clarification_required != bool(self.clarifications):
            raise ValueError("Clarification flag and questions disagree")
        if self.clarification_required and self.session.status not in ("draft", "infeasible"):
            raise ValueError("Clarification must precede execution")
        if len({q.question_id for q in self.clarifications}) != len(self.clarifications):
            raise ValueError("Duplicate question IDs")
        return self

class RouteCostRequest(Strict):
    request_id: UUID
    session_id: UUID
    campus_id: CampusId
    places: list[PlaceRef] = Field(min_length=2, max_length=7)
class RouteCostResponse(Strict):
    request_id: UUID
    costs: list[RouteCostResult] = Field(min_length=1, max_length=6)

class SpeechInteractionEvent(Strict):
    event_id: UUID
    interaction_id: UUID
    session_id: UUID
    campus_id: CampusId
    generation_id: UUID
    request_id: UUID | None
    type: Literal["recognition.partial", "recognition.final", "speech.interrupted", "playback.started", "playback.ended", "playback.cancelled", "speech.error"]
    timestamp: AwareDatetime
    text: str | None = Field(default=None, min_length=1, max_length=8000, pattern=r"\S")
    utterance_id: UUID | None = None
    error_code: Literal["permission_denied", "asr_not_configured", "recognition_failed", "playback_failed", "cancelled"] | None = None
    @model_validator(mode="after")
    def event_fields(self):
        if self.type.startswith("recognition.") != (self.text is not None):
            raise ValueError("Text belongs only to recognition events")
        if self.type.startswith("playback.") != (self.utterance_id is not None):
            raise ValueError("Playback event requires utterance")
        if (self.type == "speech.error") != (self.error_code is not None):
            raise ValueError("Error event requires code")
        return self

class EvaluationRecord(Strict):
    evaluation_id: UUID
    case_id: Id
    dataset_version: str = Field(min_length=1, max_length=100)
    build_commit: str = Field(pattern=r"^[0-9a-f]{40}$")
    kind: Literal["fixture", "live"]
    outcome: Literal["pass", "fail", "blocked", "not_tested"]
    task_completed: bool | None
    constraint_passed: bool | None
    evidence_supported: int | None = Field(ge=0)
    evidence_total: int | None = Field(ge=0)
    elapsed_ms: float | None = Field(ge=0, allow_inf_nan=False)
    model_calls: int | None = Field(ge=0)
    usage_status: Literal["known", "partial", "unknown"]
    usage: Usage | None
    unknown_usage_calls: int = Field(ge=0)
    map_operations: int | None = Field(ge=0)
    solution_id: Literal["direct_glm", "baseline", "enhanced"] | None = None
    comparison_group_id: UUID | None = None
    web_search_calls: int | None = Field(default=None, ge=0)
    failure_retries: int | None = Field(default=None, ge=0)
    first_content_ms: float | None = Field(default=None, ge=0, allow_inf_nan=False)
    first_content_source: Literal["stream_first_visible", "nonstream_response", "unknown"] = "unknown"
    @model_validator(mode="after")
    def usage_truth(self):
        if (self.first_content_ms is None) != (self.first_content_source == "unknown"):
            raise ValueError("First content timing requires an actual observation source")
        if (self.usage_status == "unknown") != (self.usage is None):
            raise ValueError("Unknown usage remains null")
        if self.usage_status == "known" and self.unknown_usage_calls != 0:
            raise ValueError("Known usage cannot omit calls")
        if self.usage_status == "partial" and self.unknown_usage_calls == 0:
            raise ValueError("Partial usage requires missing calls")
        if self.evidence_supported is not None and self.evidence_total is not None and self.evidence_supported > self.evidence_total:
            raise ValueError("Invalid evidence counts")
        return self