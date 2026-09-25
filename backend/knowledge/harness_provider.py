"""A's data providers. B owns request authorization, orchestration and UI receipts.

No HTTP execute endpoint: only the trusted Harness calls this object. Upload
tickets are issued by B after session authorization; client context is not a grant.
"""
from __future__ import annotations

import asyncio
import base64
import binascii
import hashlib
import json
import secrets
import time
from collections import OrderedDict
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, ConfigDict, Field

from backend.harness_contracts import Capability, ToolContext, ToolRequest, ToolResult, Evidence, SourceEvidence, ToolError
from .service import knowledge
from .retrieval import EvidenceRetriever, SourceRegistry, intent_for
from .user_library import user_library, extract_text

ROOT = Path(__file__).resolve().parents[2]


class Query(BaseModel):
    model_config = ConfigDict(extra='forbid')
    query: str = Field(min_length=1, max_length=2000)
    poiId: str | None = None


class DocumentInput(BaseModel):
    model_config = ConfigDict(extra='forbid')
    uploadId: str = Field(pattern=r'^upload-[0-9a-f]{16}$')
    offset: int = Field(default=0, ge=0, le=500000)
    limit: int = Field(default=6000, ge=1, le=6000)


class EmptyInput(BaseModel):
    model_config = ConfigDict(extra='forbid')


class OfficialRegistry(SourceRegistry):
    """Use registered local document URLs as bounded entry points, not a new crawler."""
    def __init__(self):
        super().__init__()
        self.local = json.loads((ROOT/'data/knowledge/SOURCE_REGISTRY.json').read_text('utf-8'))

    def candidates(self, query, campus, intent, supplemental=False):
        if supplemental:
            return []  # official_search must never silently use community evidence.
        candidates = super().candidates(query, campus, intent, False)
        if intent == 'stable':
            for poi_id in knowledge.resolve_entities(query, campus):
                poi = knowledge.get_poi(poi_id)
                if not poi or not knowledge.is_frontend_visible(poi_id):
                    continue
                for ref in poi.source_refs:
                    record = next((r for r in self.local if r['id'] == ref), None)
                    if not record:
                        continue
                    url = record['canonical_url']
                    registered = self.match(url, campus)
                    if registered and registered['tier'] == 'official':
                        candidates = [{'id': registered['id'], **registered, 'seed_urls': [url]},
                                      *[s for s in candidates if s['id'] != registered['id']]]
        return candidates


class OfficialRetriever(EvidenceRetriever):
    """Source-body cache supplements the existing query cache and singleflight.

    One conservative 60s positive TTL fits the current-rule policy. Failures
    cool down for 15s; a readable page without article content lasts only 30s.
    Cached HTML tuples retain their original observation time in evidence.
    """
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.page_cache = OrderedDict()
        self.page_observed = {}

    async def _page(self, url, campus, end, result):
        key = (campus, url, self.registry.version)
        cached = self.page_cache.get(key)
        if cached and cached[0] > time.monotonic():
            result.trace.append({'url':url, 'sourceCacheHit':True, 'elapsed_ms':0})
            return cached[1], cached[2]
        if time.monotonic() >= end:
            return None, 'timeout'
        page, status = await super()._page(url, campus, end, result)
        ttl = (60 if page[2] else 30) if page else 15
        self.page_cache[key] = (time.monotonic()+ttl, page, status)
        if page:
            self.page_observed[(campus, page[-1])] = datetime.now(timezone.utc).isoformat()
        while len(self.page_cache) > 256:
            old, _ = self.page_cache.popitem(last=False)
            self.page_observed.pop((old[0], old[1]), None)
        return page, status

    def filter(self, page, query, campus, poi, intent, as_of):
        evidence = super().filter(page, query, campus, poi, intent, as_of)
        if evidence:
            evidence.fetchedAt = self.page_observed.get((campus, page[-1]), evidence.fetchedAt)
        return evidence


class ADataProvider:
    def __init__(self, *, library=user_library, retriever=None):
        self.library = library
        self.retriever = retriever or OfficialRetriever(registry=OfficialRegistry())
        self.tasks = {}
        self.tickets = OrderedDict()
        self.uploads = OrderedDict()
        self.document_pois = {row['id']:row.get('building_id') for row in
            json.loads((ROOT/'data/knowledge/documents.json').read_text('utf-8'))}

    @staticmethod
    def _scope(context):
        return (context.sessionId, context.campusId)

    def create_upload_ticket(self, context: ToolContext, ttl_seconds=120):
        """Trusted Python API only. B must authorize the session before calling."""
        context = ToolContext.model_validate(context)
        now = time.monotonic()
        self.tickets = OrderedDict((k, v) for k, v in self.tickets.items() if v['expires'] > now)
        token = secrets.token_urlsafe(32)
        self.tickets[token] = {'context': context.model_copy(deep=True), 'expires': now + min(max(ttl_seconds, 1), 120)}
        while len(self.tickets) > 128:
            self.tickets.popitem(last=False)
        return {'uploadToken': token, 'expiresInSeconds': min(max(ttl_seconds, 1), 120),
                'endpoint': '/api/harness/uploads', 'maxBytes': 1024*1024}

    def accept_upload(self, token, filename, content):
        ticket = self.tickets.pop(token, None)
        if ticket is None or ticket['expires'] <= time.monotonic():
            raise PermissionError('Upload ticket is missing, expired, or already used')
        if Path(filename).suffix.lower() not in ('.txt', '.md'):
            raise ValueError('This Harness upload entry supports TXT and Markdown only')
        if len(content) > 1024*1024:
            raise ValueError('Upload exceeds 1 MiB')
        context = ticket['context']
        text = extract_text(filename, content)
        record = self.library.add_text(context.sessionId, context.campusId, filename, 'text/plain', text)
        key = (*self._scope(context), record.id)
        self.uploads[key] = {'record': record, 'expires': time.monotonic()+3600}
        while len(self.uploads) > 512:
            self.uploads.popitem(last=False)
        return {'uploadId': record.id, 'filename': record.filename, 'sessionId': context.sessionId,
                'campusId': context.campusId, 'generation': context.generation,
                'channel': context.channel, 'deviceId': context.deviceId,
                'evidence': {'type': 'SELECTED_UPLOAD', 'observed': {'bytes': len(content), 'sha256': record.sha256}}}

    async def list_capabilities(self, context):
        ToolContext.model_validate(context)
        result = []
        for name, schema, status, reason in [
            ('knowledge_search', Query, 'available', None),
            ('official_search', Query, 'available', None),
            ('document_read', DocumentInput, 'available', None),
            ('weather_query', EmptyInput, 'unavailable', 'No weather provider is configured'),
            ('device_capabilities', EmptyInput, 'available', None),
        ]:
            result.append(Capability(toolName=name, status=status, inputSchema=schema.model_json_schema(),
                conditions=['Trusted Harness context required', 'document_read requires a selected upload ticket'] if name=='document_read' else ['Trusted Harness context required'],
                error=ToolError(code='SOURCE_UNAVAILABLE', message=reason) if reason else None))
        for name in ('device_pick_document', 'speech_input', 'device_share', 'device_open_app'):
            result.append(Capability(toolName=name, status='unavailable', executionLocation='frontend',
                conditions=['B must merge the current browser capability probe and dispatch to a-device.ts'],
                error=ToolError(code='DEVICE_DISCONNECTED', message='No verified browser device is attached to this backend provider'), sideEffect=True))
        return result

    @staticmethod
    def _result(request, *, data=None, sources=(), code=None, message=None, evidence_type='LOCAL_DATA', status=None):
        return ToolResult(toolCallId=request.toolCallId, status=status or ('failed' if code else 'completed'),
            data={'runId': request.runId, 'sessionId': request.context.sessionId,
                  'channel': request.context.channel, 'generation': request.context.generation,
                  'callLedger': {'modelRequests': 0, 'searchRequests': 0, 'pageFetches': 0}, **(data or {})},
            sources=list(sources), error=ToolError(code=code, message=message or code) if code else None,
            evidence=[Evidence(type=evidence_type, observed={'tool': request.toolName, 'outcome': code or 'completed'},
                               traceRef=f'{request.runId}/{request.toolCallId}')])

    def _source(self, source):
        match = self.retriever.registry.match(source.url, source.campus_id, enabled=False)
        local = next((r for r in getattr(self.retriever.registry, 'local', []) if r['canonical_url'] == source.url), None)
        return SourceEvidence(sourceId=source.id, registryId=('campus-maintained-uploads' if source.url.startswith('urn:ai4tju:upload:')
            else match['id'] if match else local['id'] if local else None),
            title=source.title, url=source.url, excerpt=source.snippet, publishedAt=source.published_at,
            fetchedAt=source.retrieved_at, localRef='data/knowledge' if not source.url.startswith('urn:') else source.url)

    async def execute_tool(self, request):
        request = ToolRequest.model_validate(request)
        key = (request.runId, request.toolCallId)
        if key in self.tasks:
            return self._result(request, code='INVALID_INPUT', message='Duplicate active tool call')
        remaining = (request.deadlineAt-datetime.now(timezone.utc)).total_seconds()
        if remaining <= 0:
            return self._result(request, code='TIMEOUT')
        task = asyncio.create_task(self._execute(request, time.monotonic()+min(remaining, 3.5)))
        self.tasks[key] = task
        try:
            result = await asyncio.wait_for(task, min(remaining, 3.5))
            if datetime.now(timezone.utc) >= request.deadlineAt:
                return self._result(request, sources=result.sources, code='TIMEOUT', data={'partial':bool(result.sources)})
            return result
        except (ValueError, TypeError) as exc:
            return self._result(request, code='INVALID_INPUT', message=type(exc).__name__)
        except TimeoutError:
            return self._result(request, code='TIMEOUT', data=self._interrupted_ledger(request))
        except asyncio.CancelledError:
            return self._result(request, code='CANCELLED', status='cancelled', data=self._interrupted_ledger(request))
        except Exception as exc:
            return self._result(request, code='SOURCE_UNAVAILABLE', message=type(exc).__name__, data=self._interrupted_ledger(request))
        finally:
            self.tasks.pop(key, None)

    @staticmethod
    def _interrupted_ledger(request):
        # A cancelled upstream may already have sent HTTP; never report fake zero.
        return {'callLedger': {'modelRequests':0, 'searchRequests':0,
                              'pageFetches':None if request.toolName=='official_search' else 0},
                'callLedgerNote':'null means interrupted before an exact page count was available'}

    async def _execute(self, request, deadline):
        name, context = request.toolName, request.context
        if name in ('knowledge_search', 'official_search'):
            args = Query.model_validate(request.input)
            poi_id = args.poiId or context.poiId
            if poi_id:
                poi = knowledge.get_poi(poi_id)
                if not poi or poi.campus_id != context.campusId or not knowledge.is_frontend_visible(poi_id):
                    return self._result(request, code='INVALID_INPUT', message='POI is unavailable in this campus')
                named = knowledge.resolve_entities(args.query, context.campusId)
                if named and poi_id not in named:
                    return self._result(request, code='INVALID_INPUT', message='Query and selected POI disagree')
            if name == 'knowledge_search':
                query = f'{poi.name} {args.query}' if poi_id and not named else args.query
                hits = knowledge.search(query, context.campusId, 12 if poi_id else 6)
                if poi_id:
                    def belongs(source):
                        record = knowledge.get_evidence_record(source.id)
                        return (source.id == 'poi-'+poi_id or self.document_pois.get(source.id) == poi_id
                                or (record or {}).get('record',{}).get('entity_id') == poi_id)
                    hits = [s for s in hits if belongs(s)][:6]
                elif intent_for(args.query) != 'current_rule':
                    # Reuse the existing maintainer-published library only.
                    # Private uploads still require explicit document_read selection.
                    hits += self.library.search_campus(args.query, context.campusId, 4)
                sources = [self._source(s) for s in hits]
                return self._result(request, sources=sources, data={'poiId': poi_id,
                    'currentAccess': 'unknown', 'facts': [s.model_dump() for s in sources]},
                    code=None if hits else 'NO_EVIDENCE')
            result = await self.retriever.retrieve(args.query, context.campusId, poi_id, deadline=deadline)
            sources = [SourceEvidence(registryId=e.registryId, sourceId=e.sourceId, title=e.title,
                url=e.finalUrl, excerpt=e.text, publishedAt=e.publishedAt, fetchedAt=e.fetchedAt) for e in result.evidence
                if e.provenance['sourceTier'] == 'official']
            code = None if sources else {'timeout':'TIMEOUT','unavailable':'SOURCE_UNAVAILABLE'}.get(result.status, 'NO_EVIDENCE')
            return self._result(request, sources=sources, code=code, evidence_type='REGISTERED_HTTP', data={
                'retrievalStatus': result.status, 'partial': result.status != 'success', 'poiId': poi_id,
                'currentAccess': 'evidence_available' if any(e.currentApplicable for e in result.evidence) else 'unknown',
                'cacheHit': result.cache_hit, 'trace': result.trace,
                'callLedger': {'modelRequests':0, 'searchRequests':result.search_calls, 'pageFetches':result.page_calls}})
        if name == 'document_read':
            args = DocumentInput.model_validate(request.input)
            selected = self.uploads.get((*self._scope(context), args.uploadId))
            if selected is None or selected['expires'] <= time.monotonic():
                return self._result(request, code='PERMISSION_DENIED', message='Upload was not selected for this session and campus, or has expired')
            record = selected['record']
            text = '\n\n'.join(record.chunks)
            excerpt = text[args.offset:args.offset+args.limit]
            source = SourceEvidence(registryId='session-selected-uploads', sourceId=record.id,
                title=record.filename, localRef=f'urn:ai4tju:upload:{record.id}', excerpt=excerpt,
                fetchedAt=record.created_at)
            return self._result(request, sources=[source], evidence_type='SELECTED_UPLOAD', data={
                'uploadId':record.id, 'text':excerpt, 'offset':args.offset, 'nextOffset':args.offset+len(excerpt),
                'truncated':args.offset+len(excerpt)<len(text), 'untrustedContent':True})
        if name == 'device_capabilities':
            EmptyInput.model_validate(request.input)
            caps = await self.list_capabilities(context)
            return self._result(request, data={'capabilities':[c.model_dump(mode='json') for c in caps],
                'platform':'backend', 'physicalDeviceTest':'NOT_RUN'}, evidence_type='CAPABILITY_PROBE')
        if name == 'weather_query':
            EmptyInput.model_validate(request.input)
            return self._result(request, code='SOURCE_UNAVAILABLE', message='No weather provider is configured')
        if name in ('device_pick_document','speech_input','device_share','device_open_app'):
            return self._result(request, code='DEVICE_DISCONNECTED', message='Dispatch through the verified browser executor')
        return self._result(request, code='INVALID_INPUT', message='Unknown A tool')

    async def cancel_tool(self, runId, toolCallId):
        task = self.tasks.get((runId, toolCallId))
        if task is None or task.done():
            return {'status':'not_running', 'runId':runId, 'toolCallId':toolCallId}
        task.cancel()
        await asyncio.gather(task, return_exceptions=True)
        return {'status':'cancelled', 'runId':runId, 'toolCallId':toolCallId}


provider = ADataProvider()
router = APIRouter(prefix='/api/harness', tags=['harness-selected-uploads'])


class UploadBody(BaseModel):
    model_config = ConfigDict(extra='forbid')
    uploadToken: str = Field(min_length=20, max_length=100)
    filename: str = Field(min_length=1, max_length=180)
    contentBase64: str = Field(min_length=1, max_length=1398104)


@router.post('/uploads')
async def upload_document(body: UploadBody):
    try:
        content = base64.b64decode(body.contentBase64, validate=True)
        return provider.accept_upload(body.uploadToken, body.filename, content)
    except PermissionError as exc:
        raise HTTPException(403, str(exc)) from None
    except (ValueError, binascii.Error) as exc:
        raise HTTPException(422, str(exc)) from None
