"""M-owned R2 additions to v1. Existing IDs and stores remain authoritative."""
from typing import Annotated, Literal
from uuid import UUID
from pydantic import Field, model_validator
from backend.contracts import Strict, CampusId, ChatRequest, ChatResponse, Source, SceneAction, Usage
Id = Annotated[str, Field(pattern=r"^[a-z0-9][a-z0-9_-]{0,63}$")]
Verification = Literal["verified", "pending", "historical", "disputed"]
Category = Literal["teaching", "library", "gate", "dining", "dorm_area", "sports", "culture", "service", "other"]
class GenerationOptions(Strict):
    type: Literal["guide_script", "visit_plan", "social_post"]
    requirements: str = Field(default="", max_length=2000)
    length: Literal["short", "medium", "long"] = "short"
    style: Literal["friendly", "formal", "lively"] = "friendly"
class R2ChatRequest(ChatRequest):
    message_id: UUID
    selected_poi_id: Id | None = None
    generation: GenerationOptions | None = None
    @model_validator(mode="after")
    def reconcile(self):
        if self.selected_poi_id and self.selected_building_id and self.selected_poi_id != self.selected_building_id:
            raise ValueError("Conflicting entity IDs")
        self.selected_building_id = self.selected_poi_id or self.selected_building_id
        self.selected_poi_id = self.selected_building_id
        if (self.mode == "content_generation") != (self.generation is not None):
            raise ValueError("Generation options required only for content_generation")
        return self
class GeoLocation(Strict):
    lng: float = Field(ge=-180, le=180)
    lat: float = Field(ge=-90, le=90)
    crs: Literal["WGS84", "GCJ02"]
    coordinate_source: str = Field(min_length=1)
    verified_at: str | None
    quality: Literal["entrance", "building_center", "approximate", "pending"]
class SchematicPosition(Strict):
    map_id: Id
    x: float = Field(ge=0, le=1)
    y: float = Field(ge=0, le=1)
    source_ref: str
    quality: Literal["schematic", "map_checked"]
class Entrance(Strict):
    id: Id
    name: str
    location: GeoLocation | None
    source_refs: list[str]
    access_notes: str | None
class POI(Strict):
    id: Id
    campus_id: CampusId
    name: str
    aliases: list[str]
    category: Category
    description: str
    source_refs: list[str]
    location: GeoLocation | None
    schematic_position: SchematicPosition | None
    entrances: list[Entrance]
    verification_status: Verification
class POIPage(Strict):
    items: list[POI]
    total: int | None = Field(ge=0)
    next_cursor: str | None
    version: str | None
class KnowledgeRecord(Strict):
    id: Id
    campus_id: CampusId
    entity_id: Id | None
    title: str
    category: str
    aliases: list[str]
    fact: str
    sources: list[Source]
    applicable_at: str | None
    retrieved_at: str
    verification_status: Verification
class CampusMedia(Strict):
    poi_id: Id | None = None
    id: Id
    campus_id: CampusId
    local_path: str
    source_url: str
    creator: str | None
    usage_basis: str
    caption: str
    focal_point: tuple[float, float]
    width: int = Field(gt=0)
    height: int = Field(gt=0)
    @model_validator(mode="after")
    def focal_bounds(self):
        if any(x < 0 or x > 1 for x in self.focal_point): raise ValueError("Invalid focal point")
        return self
class CampusMap(Strict):
    id: Id
    campus_id: CampusId
    local_path: str
    kind: Literal["schematic", "licensed_map"]
    width: int = Field(gt=0)
    height: int = Field(gt=0)
    source_refs: list[str]
    creator: str
    usage_basis: str
    version: str
    data_as_of: str | None
    supports_precise_navigation: Literal[False] = False
class CampusAssets(Strict):
    maps: list[CampusMap]
    media: list[CampusMedia]
    version: str | None
class ProviderCrosswalk(Strict):
    poi_id: Id
    provider: Literal["amap"]
    provider_poi_id: str
    matched_at: str
    match_status: Literal["verified", "pending"]
    retention_basis: str
class CampusCounts(Strict):
    campus_id: CampusId
    facts: int = Field(ge=0)
    pois: int = Field(ge=0)
    verified_coordinates: int = Field(ge=0)
    usable_media: int = Field(ge=0)
class Coverage(Strict):
    status: Literal["ready", "not_implemented"]
    version: str | None
    source_pages: int | None = Field(ge=0)
    fact_count: int | None = Field(ge=0)
    chunk_count: int | None = Field(ge=0)
    campuses: list[CampusCounts]
class MapStatus(Strict):
    local_map: Literal["ready", "not_implemented"]
    external_navigation: Literal["ready", "not_implemented"]
    online_map: Literal["NOT_CONFIGURED", "NOT_IMPLEMENTED", "UNVERIFIED", "VERIFIED", "FAILED"]
    js_key_configured: bool
    security_key_configured: bool
    web_service_key_configured: bool
    precise_location: Literal["not_implemented", "NOT_CONFIGURED", "UNVERIFIED", "VERIFIED", "FAILED"]
    in_app_routing: Literal["not_implemented", "NOT_CONFIGURED", "UNVERIFIED", "VERIFIED", "FAILED"]
class MapPublicConfig(Strict):
    route_backend: Literal["js_api"] = "js_api"
    js_key: str | None
    service_host: Literal["/api/maps/amap/_AMapService"]
    status: MapStatus
class ExternalNavigation(Strict):
    poi_id: Id
    url: str | None
    kind: Literal["coordinate", "search", "unavailable"]
    precision: Literal["verified_destination", "name_search", "unknown"]
class AcceptedPayload(Strict):
    session_id: UUID
    message_id: UUID
    campus_id: CampusId
    mode: Literal["campus_qa", "content_generation", "general_chat"]
class StatusPayload(Strict):
    stage: Literal["request", "knowledge", "model", "generation"]
    status: Literal["started"]
class DeltaPayload(Strict):
    text: str = Field(min_length=1, max_length=23000)
class SourcesPayload(Strict):
    sources: list[Source]
    kind: Literal["retrieved", "cited"]
class ActionPayload(Strict):
    action: SceneAction
class UsagePayload(Strict):
    model: str
    usage: Usage | None
class CompletedPayload(Strict):
    response: ChatResponse
class StreamErrorPayload(Strict):
    code: str
    message: str
    retryable: bool
    partial: bool
    answer: str
    reason: Literal["timeout", "disconnect", "length", "empty", "upstream", "validation", "not_implemented"]
class CancelledPayload(Strict):
    local_task_stopped: bool
    upstream_stop: Literal["not_started", "unconfirmed", "confirmed"]
class StreamBase(Strict):
    event_id: UUID
    request_id: UUID
    seq: int = Field(ge=1)
    timestamp: str
class AcceptedEvent(StreamBase):
    type: Literal["accepted"]
    payload: AcceptedPayload
class StatusEvent(StreamBase):
    type: Literal["status"]
    payload: StatusPayload
class DeltaEvent(StreamBase):
    type: Literal["answer_delta"]
    payload: DeltaPayload
class SourcesEvent(StreamBase):
    type: Literal["sources"]
    payload: SourcesPayload
class ActionEvent(StreamBase):
    type: Literal["poi_action"]
    payload: ActionPayload
class UsageEvent(StreamBase):
    type: Literal["usage"]
    payload: UsagePayload
class CompletedEvent(StreamBase):
    type: Literal["completed"]
    payload: CompletedPayload
class StreamErrorEvent(StreamBase):
    type: Literal["error"]
    payload: StreamErrorPayload
class CancelledEvent(StreamBase):
    type: Literal["cancelled"]
    payload: CancelledPayload
StreamEvent = Annotated[AcceptedEvent | StatusEvent | DeltaEvent | SourcesEvent | ActionEvent | UsageEvent | CompletedEvent | StreamErrorEvent | CancelledEvent, Field(discriminator="type")]
class GenerationRendered(Strict):
    event_id: UUID
    request_id: UUID
    session_id: UUID
    message_id: UUID
    campus_id: CampusId
    answer_chars: int = Field(gt=0, le=23000)
class RenderReceipt(Strict):
    event_id: UUID
    request_id: UUID
    status: Literal["recorded", "duplicate"]
    origin: Literal["frontend"] = "frontend"

class UserPosition(Strict):
    lng: float = Field(ge=-180,le=180)
    lat: float = Field(ge=-90,le=90)
    crs: Literal["GCJ02"]
    source: Literal["amap_geolocation", "manual"]
    accuracy_m: float | None = Field(ge=0)
    timestamp: str
class RouteRequest(Strict):
    route_id: UUID
    session_id: UUID
    campus_id: CampusId
    destination_poi_id: Id
    entrance_id: Id | None = None
    origin: UserPosition
    user_initiated: Literal[True]
class RouteStep(Strict):
    instruction: str
    distance_m: float = Field(ge=0)
    polyline: list[tuple[float,float]]
class RouteResponse(Strict):
    route_id: UUID
    destination_poi_id: Id
    provider: Literal["amap"]
    crs: Literal["GCJ02"]
    distance_m: float = Field(ge=0)
    duration_s: float | None = Field(ge=0)
    steps: list[RouteStep]
    campus_access: Literal["unverified", "verified"]
    access_source_refs: list[str]
class RouteCancelRequest(Strict):
    session_id: UUID
class RouteCancelResponse(Strict):
    route_id: UUID
    local_stopped: bool
    upstream_stop: Literal["not_started","unconfirmed","confirmed"]
