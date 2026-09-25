"""Shared A/B contract v1. Runtime schemas are generated from these models."""
from datetime import datetime, timezone
from typing import Any, Literal
from pydantic import BaseModel, ConfigDict, Field, model_validator

class Strict(BaseModel):
    model_config = ConfigDict(extra='forbid')

class ToolContext(BaseModel):
    model_config = ConfigDict(extra='allow')
    sessionId: str = Field(min_length=1,max_length=128)
    campusId: Literal['weijinlu','beiyangyuan']
    channel: str = Field(min_length=1,max_length=40)
    generation: int = Field(ge=0)
    deviceId: str | None = None
    poiId: str | None = None

class ToolRequest(Strict):
    schemaVersion: Literal['1.0'] = '1.0'
    runId: str = Field(min_length=1,max_length=128)
    toolCallId: str = Field(min_length=1,max_length=128)
    toolName: str = Field(min_length=1,max_length=80)
    input: dict[str,Any]
    context: ToolContext
    deadlineAt: datetime
    cancelToken: str = Field(min_length=1,max_length=128)
    idempotencyKey: str | None = None
    @model_validator(mode='after')
    def timezone_required(self):
        if self.deadlineAt.tzinfo is None: raise ValueError('deadlineAt requires timezone')
        return self

class SourceEvidence(Strict):
    registryId: str | None = None
    sourceId: str | None = None
    title: str | None = None
    url: str | None = None
    localRef: str | None = None
    excerpt: str | None = None
    publishedAt: str | None = None
    fetchedAt: str | None = None

class Evidence(Strict):
    type: str
    observed: Any
    traceRef: str | None = None

class ToolError(Strict):
    code: str
    message: str

class PendingAction(Strict):
    actionId: str
    runId: str
    toolCallId: str
    expiresAt: datetime
    label: str
    kind: str

class ToolResult(Strict):
    schemaVersion: Literal['1.0'] = '1.0'
    toolCallId: str
    status: Literal['completed','pending_user_action','failed','cancelled']
    data: Any = None
    sources: list[SourceEvidence] = Field(default_factory=list)
    error: ToolError | None = None
    observedAt: datetime = Field(default_factory=lambda:datetime.now(timezone.utc))
    evidence: list[Evidence] = Field(default_factory=list)
    @model_validator(mode='after')
    def truthful_status(self):
        if self.status=='completed' and (self.error or not self.evidence): raise ValueError('completion requires evidence without error')
        if self.status=='failed' and self.error is None: raise ValueError('failure requires error')
        if self.status=='pending_user_action': PendingAction.model_validate((self.data or {}).get('pendingAction'))
        return self

class Capability(Strict):
    toolName: str
    status: Literal['available','unavailable','needs_permission']
    inputSchema: dict[str,Any] = Field(default_factory=dict)
    outputSchema: dict[str,Any] = Field(default_factory=lambda:ToolResult.model_json_schema())
    executionLocation: Literal['backend','frontend','device','external'] = 'backend'
    cancellable: bool = True
    conditions: list[str] = Field(default_factory=list)
    error: ToolError | None = None
    sideEffect: bool = False
    timeoutMs: int = Field(default=3500,gt=0,le=45000)
    maxResultBytes: int = Field(default=24000,gt=0,le=262144)
