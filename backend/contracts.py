"""Wire schema v1.1.0 using UTC ISO-8601 dates."""
from typing import Literal
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field
CONTRACT_VERSION = "1.1.0"
CampusId = Literal["weijinlu", "beiyangyuan"]
class Strict(BaseModel):
    model_config = ConfigDict(extra="forbid")
class ChatRequest(Strict):
    request_id: UUID
    session_id: UUID
    message: str = Field(min_length=1, max_length=8000, pattern=r"\S")
    mode: Literal["campus_qa", "content_generation", "general_chat"]
    campus_id: CampusId
    selected_building_id: str | None = Field(default=None, pattern=r"^[a-z0-9][a-z0-9_-]{0,63}$")
class Source(Strict):
    id: str
    title: str
    snippet: str
    url: str
    campus_id: CampusId
    published_at: str | None
    retrieved_at: str
class Coordinates(Strict):
    lat: float = Field(ge=-90, le=90)
    lng: float = Field(ge=-180, le=180)
class Building(Strict):
    id: str
    title: str
    campus_id: CampusId
    summary: str
    url: str
    published_at: str | None
    retrieved_at: str
    coordinates: Coordinates | None
class KnowledgeStatus(Strict):
    status: Literal["unavailable", "ready"]
    version: str | None
    document_count: int = Field(ge=0)
    building_count: int = Field(ge=0)
    updated_at: str | None
class SearchResponse(Strict):
    hits: list[Source]
    status: KnowledgeStatus
class BuildingList(Strict):
    buildings: list[Building]
class ActionParameters(Strict):
    building_id: str = Field(pattern=r"^[a-z0-9][a-z0-9_-]{0,63}$")
class SceneAction(Strict):
    action_id: UUID
    request_id: UUID
    type: Literal["focus_building", "show_building_card"]
    parameters: ActionParameters
class Usage(Strict):
    prompt_tokens: int = Field(ge=0)
    completion_tokens: int = Field(ge=0)
    total_tokens: int = Field(ge=0)
class ChatResponse(Strict):
    request_id: UUID
    session_id: UUID
    answer: str
    sources: list[Source]
    model: str
    usage: Usage | None
    elapsed_ms: float = Field(ge=0)
    actions: list[SceneAction]
class ErrorDetail(Strict):
    code: str
    message: str
    request_id: UUID | None
    retryable: bool
class ApiError(Strict):
    error: ErrorDetail
class EventData(Strict):
    code: str | None = None
    action_id: str | None = None
    building_id: str | None = None
    count: int | None = None
    model: str | None = None
class RuntimeEvent(Strict):
    event_id: UUID
    request_id: UUID
    seq: int
    timestamp: str
    origin: Literal["backend", "frontend"]
    stage: Literal["request", "knowledge", "model", "speech", "avatar", "scene", "generation"]
    status: Literal["started", "completed", "failed", "cancelled", "rendered"]
    duration_ms: float | None
    data: EventData
class EventPage(Strict):
    events: list[RuntimeEvent]
    next_cursor: int
    truncated: bool
class CancelRequest(Strict):
    session_id: UUID
class CancelResponse(Strict):
    request_id: UUID
    status: Literal["cancel_requested", "already_terminal"]
    local_task_stopped: bool
    upstream_stop: Literal["not_started", "unconfirmed", "confirmed"]
class SceneAck(Strict):
    request_id: UUID
    session_id: UUID
    action_id: UUID
    status: Literal["completed", "failed"]
    error_code: Literal["execution_failed", "unsupported"] | None = None
class SceneAckResponse(Strict):
    request_id: UUID
    action_id: UUID
    status: Literal["recorded", "duplicate"]
class ClientEventData(Strict):
    code: Literal["not_implemented", "playback_failed", "permission_denied", "stopped"] | None = None
class ClientEventInput(Strict):
    event_id: UUID
    request_id: UUID
    session_id: UUID
    stage: Literal["speech", "avatar"]
    status: Literal["started", "completed", "failed", "cancelled"]
    duration_ms: float | None = Field(default=None, ge=0, le=3600000)
    data: ClientEventData
class Health(Strict):
    status: Literal["ok"]
    contract_version: str
    model: dict[str, bool]
    capabilities: dict[str, bool]
class SpeechContext(Strict):
    request_id: UUID
    session_id: UUID
class AudioPayload(Strict):
    encoding: Literal["base64"]
    mime_type: Literal["audio/wav"]
    sample_rate_hz: Literal[16000]
    channels: Literal[1]
    audio_base64: str = Field(min_length=1, max_length=1500000)
class AsrRequest(SpeechContext):
    audio: AudioPayload
class AsrResponse(Strict):
    request_id: UUID
    text: str
    is_final: bool
class TtsRequest(SpeechContext):
    utterance_id: UUID
    text: str = Field(min_length=1, max_length=4000)
    voice_id: str = Field(min_length=1, max_length=100)
class TtsResponse(Strict):
    request_id: UUID
    utterance_id: UUID
    audio_url: str
    mime_type: str
    timestamps: Literal["none", "word", "viseme"]
class Voice(Strict):
    id: str
    name: str
    locale: str
    provider: str
class VoiceList(Strict):
    voices: list[Voice]
    status: Literal["not_implemented", "ready"]

class SpeechStopResponse(Strict):
    request_id: UUID
    local_stopped: bool
    upstream_stop: Literal['not_started', 'unconfirmed', 'confirmed']
