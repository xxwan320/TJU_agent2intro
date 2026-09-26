"""Same-origin bounded SSE commands, authenticated run receipts and file downloads."""
import asyncio, json
from fastapi import APIRouter, Header, HTTPException
from fastapi.responses import StreamingResponse, Response
from pydantic import Field
from backend.harness_contracts import *
from backend.model.harness import harness, drive
import secrets,time
from collections import OrderedDict
sessions=OrderedDict()
router=APIRouter(prefix='/api/harness',tags=['harness'])
class Start(Strict):
    context: ToolContext
    message: str = Field(default='',max_length=4000)
    direct: dict | None = None
    deviceCapabilities: list[dict] = Field(default_factory=list,max_length=8)
class Ack(Strict):
    context: ToolContext
    result: ToolResult
class SessionStart(Strict):
    campusId: Literal['weijinlu','beiyangyuan']
@router.post('/sessions')
async def session_start(body:SessionStart):
    token=secrets.token_urlsafe(32);sid=secrets.token_urlsafe(24)
    sessions[token]={'sessionId':sid,'campusId':body.campusId,'expires':time.monotonic()+3600}
    while len(sessions)>512:sessions.popitem(last=False)
    return {'sessionId':sid,'token':token}
def authorized(token,context=None):
    s=sessions.get(token)
    if not s or s['expires']<=time.monotonic():raise HTTPException(401,'session expired')
    if context and (s['sessionId']!=context.sessionId or s['campusId']!=context.campusId):raise HTTPException(403,'session mismatch')
    return s
@router.post('/upload-ticket')
async def upload_ticket(context:ToolContext,x_harness_session:str=Header(default='')):
    authorized(x_harness_session,context)
    from backend.knowledge.harness_provider import provider
    return provider.create_upload_ticket(context)
@router.post('/capabilities')
async def capabilities(context:ToolContext,x_harness_session:str=Header(default='')):
    authorized(x_harness_session,context)
    return await harness.capabilities(context)
@router.post('/runs')
async def start(body:Start,x_harness_session:str=Header(default='')):
    authorized(x_harness_session,body.context)
    if body.direct and (set(body.direct)!={'toolName','input'} or body.direct['toolName'] not in {'poi_select','narration_control','route_plan','itinerary_export','device_capabilities','device_pick_document','device_share','device_open_app','document_read'}):raise HTTPException(422,'invalid direct tool')
    try:r=harness.begin(body.context)
    except ValueError:raise HTTPException(409,'stale generation or busy') from None
    r.device_caps=body.deviceCapabilities
    async def events():
        r.task=asyncio.create_task(drive(harness,r,body.message,body.direct))
        yield 'event: accepted\ndata: '+json.dumps({'type':'accepted','runId':r.id,'token':r.token,'context':r.context.model_dump(mode='json')})+'\n\n'
        try:
            while True:
                item=await r.queue.get()
                if item is None:break
                yield 'event: '+item['type']+'\ndata: '+json.dumps(item,ensure_ascii=False)+'\n\n'
        finally:
            if not r.ended:harness.cancel(r)
    return StreamingResponse(events(),media_type='text/event-stream',headers={'Cache-Control':'no-cache, no-transform','X-Accel-Buffering':'no'})
def owned(rid,token):
    try:return harness.get(rid,token)
    except ValueError:raise HTTPException(404,'run unavailable') from None
@router.post('/runs/{rid}/cancel')
async def cancel(rid:str,x_harness_token:str=Header(default='')):
    r=owned(rid,x_harness_token);harness.cancel(r)
    return {'status':'cancel_requested','upstreamStop':'unconfirmed'}
@router.post('/runs/{rid}/ack')
async def ack(rid:str,body:Ack,x_harness_token:str=Header(default='')):
    r=owned(rid,x_harness_token)
    try:harness.acknowledge(r,body.context,body.result.toolCallId,body.result)
    except ValueError:raise HTTPException(409,'stale or invalid receipt') from None
    return {'status':'recorded'}
@router.get('/files/{fid}')
async def download(fid:str,x_harness_token:str=Header(default='')):
    import secrets,time
    f=harness.files.get(fid)
    if not f or time.monotonic()>f['expires'] or not secrets.compare_digest(f['token'],x_harness_token):raise HTTPException(404,'file unavailable')
    return Response(f['content'],media_type='application/json' if f['filename'].endswith('.json') else 'text/markdown; charset=utf-8',headers={'Content-Disposition':'attachment; filename="'+f['filename']+'"','Cache-Control':'no-store'})

@router.post('/runs/{rid}/continuation-ack')
async def continuation_ack(rid:str,body:Ack,x_harness_token:str=Header(default='')):
    r=owned(rid,x_harness_token);entry=r.continuations.get(body.result.toolCallId)
    current=harness.latest.get((r.context.sessionId,r.context.channel))
    if r.cancelled or body.context!=r.context or not entry or current!=(r.context.generation,r.id):raise HTTPException(409,'stale continuation')
    from backend.model.harness import now
    if now()>entry['request'].deadlineAt:raise HTTPException(409,'continuation expired')
    if entry['result'] is not None:
        if entry['result']!=body.result:raise HTTPException(409,'conflicting receipt')
        return {'status':'duplicate'}
    if body.result.status=='pending_user_action':raise HTTPException(422,'continuation must terminate')
    entry['result']=body.result
    r.ledger.append({'event':'continuation_completed','toolCallId':body.result.toolCallId,'status':body.result.status,'modelRequests':0,'toolCalls':1,'budgetSeconds':45})
    from pathlib import Path
    audit={'scope':'real','runId':r.id,'modelCalls':0,'toolCalls':1,'ledger':[r.ledger[-1]]}
    with (Path(__file__).resolve().parents[1]/'docs/diagnostics/harness-b/run-ledger.jsonl').open('a',encoding='utf-8') as output:output.write(json.dumps(audit,ensure_ascii=False)+'\n')
    return {'status':'recorded'}
