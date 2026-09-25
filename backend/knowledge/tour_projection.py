"""Typed projection of the existing store; no new corpus or location data."""
from datetime import datetime, timezone, date, time
from backend.common.errors import DomainError
from backend.r3_contracts import Evidence, RouteCostResponse, RouteCostResult
from backend.r3_knowledge_contracts import ApplicableEvidence, TourKnowledgeContext

def stamp(value):
    if not value: return None
    parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    return parsed if parsed.tzinfo else parsed.replace(tzinfo=timezone.utc)

def context(store, poi_id, campus_id, visit_date=None):
    poi = store.get_poi(poi_id)
    if not poi or poi.campus_id != campus_id:
        raise DomainError("VALIDATION_ERROR", "地点不存在或不属于所选校区", 422)
    items = []
    for fact in store._facts:
        if fact.entity_id != poi_id or fact.campus_id != campus_id or not fact.sources: continue
        meta = store._evidence_metadata.get(fact.id, {})
        kind = {"directory_assertion":"stable_fact", "historical_fact":"historical_event",
                "historical_rule":"historical_event"}.get(meta.get("claim_type"), "published_rule")
        conflicts = meta.get("conflict_ids", [])
        checked = stamp(meta.get("source_checked_at") or fact.retrieved_at)
        field = stamp(meta.get("field_checked_at"))
        until = stamp(meta.get("valid_until"))
        requested = visit_date or datetime.now(timezone.utc).date()
        status = meta.get("current_status", "unknown")
        status = status if status in ("confirmed","pending","expired","conflict","unknown") else "unknown"
        if until and until.date() < requested: status = "expired"
        if conflicts: status = "conflict"
        # Historical notices remain historical, even when their source was just fetched.
        verification = "historical" if kind == "historical_event" else "unverified"
        if conflicts: verification = "disputed"
        elif kind == "stable_fact" and fact.verification_status == "verified" and checked and checked <= datetime.now(timezone.utc):
            verification = "verified"
        claim = fact.fact + ("（资料适用："+fact.applicable_at+"）" if fact.applicable_at else "（适用日期未提供）")
        items.append(ApplicableEvidence(poi_id=poi_id,campus_id=campus_id,
            evidence=Evidence(evidence_id=fact.id,source_ref=fact.id,claim=claim[:500],
                relation="supports",verification=verification,checked_at=checked,valid_until=until),
            source_url=fact.sources[0].url,
            claim_type=kind,applicable_at=meta.get("applicable_at") or fact.applicable_at,
            audience=meta.get("audience"),valid_from=stamp(meta.get("valid_from")).date() if meta.get("valid_from") else None,
            valid_through=until.date() if until else None,source_checked_at=checked,field_checked_at=field,
            current_status=status,conflict_ids=conflicts))
    return TourKnowledgeContext(poi_id=poi_id,campus_id=campus_id,requested_date=visit_date,
        version=store.get_status().version or "unknown",evidence=items[:40],
        warnings=["来源核对不等于现场开放核验；入口、道路和当日通行须另行确认。"])

def route_costs(store, request):
    for place in request.places:
        if place.kind == "poi":
            poi=store.get_poi(place.poi_id)
            if not poi or poi.campus_id != request.campus_id:
                raise DomainError("VALIDATION_ERROR","地点不存在或校区不匹配",422)
    return RouteCostResponse(request_id=request.request_id,costs=[
        RouteCostResult(from_ref=a,to_ref=b,distance_m=None,duration_s=None,
            source="unknown",verification="unverified",checked_at=None,campus_access="unverified",reason="missing_data")
        for a,b in zip(request.places,request.places[1:])])
