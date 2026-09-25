"""M-owned public projection for D's existing knowledge store; no location fields."""
from datetime import date
from typing import Literal
from pydantic import AwareDatetime, Field, model_validator
from backend.contracts import Strict, CampusId
from backend.r2_contracts import Id
from backend.r3_contracts import Evidence, RouteCostResult, RouteCostRequest, RouteCostResponse

class ApplicableEvidence(Strict):
    poi_id: Id
    campus_id: CampusId
    evidence: Evidence
    source_url: str | None = Field(default=None, max_length=2000)
    claim_type: Literal["stable_fact", "published_rule", "historical_event", "field_observation"]
    applicable_at: str | None = Field(default=None, max_length=500)
    audience: str | None = Field(default=None, max_length=200)
    valid_from: date | None = None
    valid_through: date | None = None
    source_checked_at: AwareDatetime | None = None
    field_checked_at: AwareDatetime | None = None
    current_status: Literal["confirmed", "pending", "expired", "conflict", "unknown"]
    conflict_ids: list[Id] = Field(default_factory=list, max_length=20)
    @model_validator(mode="after")
    def applicability(self):
        if self.valid_from and self.valid_through and self.valid_from > self.valid_through:
            raise ValueError("Invalid applicability interval")
        if self.evidence.verification == "verified" and self.claim_type != "stable_fact":
            if self.current_status != "confirmed" or self.conflict_ids:
                raise ValueError("Unresolved temporal evidence cannot be verified")
        return self

class TourKnowledgeContext(Strict):
    poi_id: Id
    campus_id: CampusId
    requested_date: date | None
    version: str = Field(min_length=1, max_length=100)
    evidence: list[ApplicableEvidence] = Field(default_factory=list, max_length=40)
    route_costs: list[RouteCostResult] = Field(default_factory=list, max_length=20)
    warnings: list[str] = Field(default_factory=list, max_length=20)
    @model_validator(mode="after")
    def references(self):
        ids={x.evidence.evidence_id for x in self.evidence}
        if len(ids)!=len(self.evidence):
            raise ValueError("Duplicate evidence")
        if any(x.poi_id!=self.poi_id or x.campus_id!=self.campus_id for x in self.evidence):
            raise ValueError("Evidence must match requested entity and campus")
        if any(i not in ids for cost in self.route_costs for i in cost.evidence_ids):
            raise ValueError("Route cost must cite included independent evidence")
        return self