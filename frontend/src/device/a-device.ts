import type { SpeechAdapter } from '../../../shared/contracts';

/** Structural v1 boundary; shared/harness remains owned by B. */
export interface DeviceContext { sessionId: string; campusId: string; channel: string; generation: number; deviceId?: string }
export interface DeviceRequest { schemaVersion: string; runId: string; toolCallId: string; toolName: string; input: Record<string, unknown>; context: DeviceContext; deadlineAt: string; cancelToken: string; idempotencyKey?: string }
export interface DeviceSession extends DeviceContext { deviceId: string; expiresAt: string; connected: boolean }
export interface DeviceResult { schemaVersion: '1.0'; toolCallId: string; status: 'completed' | 'failed' | 'cancelled' | 'pending_user_action'; data: Record<string, unknown>; sources: never[]; error: { code: string; message: string } | null; observedAt: string; evidence: { type: string; observed: string; traceRef: string }[] }
export interface AppReceipt { verified: boolean; observation: string; traceRef: string }
export interface DeviceOptions {
  /** Supplied by the trusted session owner; never constructed from model input. */
  getSession(): DeviceSession | null;
  speechAdapter?: SpeechAdapter;
  upload?: (file: File, context: { request: DeviceRequest; signal: AbortSignal }) => Promise<{ uploadId: string }>;
  apps?: Readonly<Record<string, (context: { signal: AbortSignal; request: DeviceRequest }) => Promise<AppReceipt>>>;
}
type Entry = { request: DeviceRequest; result: DeviceResult; actionId: string; expires: number; timer: ReturnType<typeof setTimeout>; controller?: AbortController; continuation?: DeviceRequest };
const toolNames = ['device_capabilities', 'device_pick_document', 'speech_input', 'device_share', 'device_open_app'] as const;
const fail = (code: string) => Object.assign(new Error(code), { code });
const binding = (c: DeviceContext) => JSON.stringify([c.sessionId, c.deviceId, c.campusId, c.channel, c.generation]);
const callKey = (r: DeviceRequest) => JSON.stringify([r.runId, r.toolCallId]);

export function createDeviceExecutor(options: DeviceOptions) {
  const actions = new Map<string, Entry>();
  // Keep tombstones for this executor lifetime: cancel/disconnect must never enable replay.
  const seen = new Map<string, Entry>();
  const calls = new Map<string, Entry>();
  let disconnected = false;
  function result(r: DeviceRequest, status: DeviceResult['status'], data: Record<string, unknown> = {}, code?: string, observed?: string): DeviceResult {
    return { schemaVersion: '1.0', toolCallId: r.toolCallId, status,
      data: {...data, runId:r.runId, sessionId:r.context.sessionId, channel:r.context.channel, generation:r.context.generation}, sources: [], error: code ? { code, message: code } : null, observedAt: new Date().toISOString(),
      evidence: observed ? [{ type: 'BROWSER_API', observed, traceRef: `${r.runId}/${r.toolCallId}` }] : [] };
  }
  function validate(r: DeviceRequest) {
    if (r.schemaVersion !== '1.0' || !r.runId || !r.toolCallId || !r.cancelToken || !r.context?.deviceId || !r.input || !Number.isFinite(Date.parse(r.deadlineAt))) throw fail('INVALID_INPUT');
    const s = options.getSession();
    if (disconnected || !s?.connected) throw fail('DEVICE_DISCONNECTED');
    if (binding(s) !== binding(r.context)) throw fail('PERMISSION_DENIED');
    if (!Number.isFinite(Date.parse(s.expiresAt)) || Date.parse(s.expiresAt) <= Date.now()) throw fail('PERMISSION_DENIED');
    if (Date.parse(r.deadlineAt) <= Date.now()) throw fail('TIMEOUT');
    return s;
  }
  function list_capabilities(context?: DeviceContext) {
    const s = options.getSession();
    const connected = !disconnected && !!s?.connected && Date.parse(s.expiresAt) > Date.now() && (!context || binding(context) === binding(s));
    const browser = typeof document !== 'undefined' && typeof navigator !== 'undefined';
    const supports: Record<string, boolean> = {
      device_capabilities: true,
      device_pick_document: browser && !!options.upload,
      speech_input: browser && globalThis.isSecureContext === true && !!navigator.mediaDevices?.getUserMedia && options.speechAdapter?.capabilities.asr === true,
      device_share: browser && globalThis.isSecureContext === true && typeof navigator.share === 'function',
      device_open_app: !!options.apps && Object.keys(options.apps).length > 0,
    };
    return toolNames.map(toolName => ({ toolName, status: !connected || !supports[toolName] ? 'unavailable' : toolName === 'device_capabilities' ? 'available' : 'needs_permission',
      inputSchema: { type: 'object', properties: toolName === 'device_share' ? { title: {type:'string'}, text: {type:'string'}, url: {type:'string'} } : toolName === 'device_open_app' ? {appId:{type:'string',enum:Object.keys(options.apps ?? {})}} : {}, additionalProperties: false },
      outputSchema: { type: 'object' }, executionLocation: 'frontend', cancellable: true,
      conditions: toolName === 'device_capabilities' ? [] : ['trusted user event', 'current device session', 'new continuation budget'],
      error: !connected || !supports[toolName] ? { code: !connected ? 'DEVICE_DISCONNECTED' : 'SOURCE_UNAVAILABLE', message: 'No verified configured execution channel' } : null,
      sideEffect: toolName !== 'device_capabilities', timeoutMs: 45000, maxResultBytes: 32768 }));
  }
  function finish(entry: Entry, value: DeviceResult) {
    clearTimeout(entry.timer); actions.delete(entry.actionId); entry.result = value;
    return value;
  }
  function stop(entry: Entry, code: string) {
    if (entry.result.status !== 'pending_user_action') return entry.result;
    entry.controller?.abort(code);
    return finish(entry, result(entry.continuation ?? entry.request, code === 'TIMEOUT' ? 'failed' : 'cancelled', { originalToolCallId: entry.request.toolCallId }, code));
  }
  async function execute_tool(r: DeviceRequest): Promise<DeviceResult> {
    try {
      validate(r);
      if (!toolNames.includes(r.toolName as typeof toolNames[number])) throw fail('INVALID_INPUT');
      if (r.toolName === 'device_capabilities') return result(r, 'completed', { capabilities: list_capabilities(r.context), platform: typeof navigator === 'undefined' ? 'no_browser' : navigator.userAgent }, undefined, 'API presence and injected service configuration only; no permissions requested');
      if (!r.idempotencyKey) throw fail('INVALID_INPUT');
      const key = JSON.stringify([r.context.sessionId, r.context.deviceId, r.idempotencyKey]);
      const old = seen.get(key) ?? calls.get(callKey(r));
      if (old) return result(r, 'failed', { originalToolCallId: old.request.toolCallId, originalStatus: old.result.status }, 'DUPLICATE_ACTION');
      if (r.toolName === 'device_open_app' && (typeof r.input.appId !== 'string' || !Object.hasOwn(options.apps ?? {}, r.input.appId))) throw fail('SOURCE_UNAVAILABLE');
      if (list_capabilities(r.context).find(c => c.toolName === r.toolName)?.status === 'unavailable') throw fail('SOURCE_UNAVAILABLE');
      // Snapshot the command so callers cannot change the operation after displaying consent.
      const request = structuredClone(r);
      const actionId = crypto.randomUUID();
      const expires = Math.min(Date.parse(options.getSession()!.expiresAt), Date.now() + 45000, Date.parse(r.deadlineAt));
      const value = result(r, 'pending_user_action', { pendingAction: { actionId, runId:r.runId, toolCallId:r.toolCallId, expiresAt:new Date(expires).toISOString(), label: {device_pick_document:'选择文档',speech_input:'开始普通话输入',device_share:'打开系统分享',device_open_app:'打开指定应用'}[r.toolName], kind:r.toolName } });
      const entry: Entry = { request, result:value, actionId, expires, timer:setTimeout(() => stop(entry, 'TIMEOUT'), expires-Date.now()) };
      actions.set(actionId, entry); seen.set(key,entry); calls.set(callKey(r),entry);
      return value;
    } catch (error) { return result(r, 'failed', {}, errorCode(error)); }
  }
  async function resume_tool(actionId: string, r: DeviceRequest, event: Event): Promise<DeviceResult> {
    const entry = actions.get(actionId);
    try {
      validate(r);
      if (!entry || entry.controller) throw fail('INVALID_INPUT');
      if (Date.now() >= entry.expires) { stop(entry,'TIMEOUT'); throw fail('TIMEOUT'); }
      if (binding(entry.request.context) !== binding(r.context) || entry.request.runId !== r.runId || r.toolCallId === entry.request.toolCallId || calls.has(callKey(r)) || r.toolName !== entry.request.toolName || r.idempotencyKey !== entry.request.idempotencyKey) throw fail('PERMISSION_DENIED');
      if (!event?.isTrusted || !['click','pointerup','keydown'].includes(event.type) || (typeof navigator !== 'undefined' && navigator.userActivation && !navigator.userActivation.isActive)) throw fail('PERMISSION_DENIED');
      const session = validate(r);
      const deadline = Math.min(Date.parse(r.deadlineAt), Date.parse(session.expiresAt), Date.now()+45000);
      const controller = new AbortController(); entry.controller = controller; entry.continuation = structuredClone(r); calls.set(callKey(r),entry);
      clearTimeout(entry.timer);
      entry.timer = setTimeout(() => stop(entry,'TIMEOUT'), deadline-Date.now());
      // Poll the trusted owner to stop an in-flight operation when its generation changes.
      const watch = setInterval(() => { try { validate(r); } catch(error) { stop(entry,errorCode(error)); } },50);
      const startedAt = Date.now();
      try {
        const request = { ...entry.request, toolCallId:r.toolCallId, deadlineAt:r.deadlineAt, cancelToken:r.cancelToken };
        const data = await abortable(perform(request,controller.signal),controller.signal);
        validate(r);
        if (controller.signal.aborted) throw fail(String(controller.signal.reason));
        return finish(entry,result(r,'completed',{...data, originalToolCallId:entry.request.toolCallId, elapsedMs:Date.now()-startedAt},undefined,String(data.observation)));
      } catch(error) {
        const code = controller.signal.aborted ? String(controller.signal.reason) : errorCode(error);
        return finish(entry,result(r,['CANCELLED','DEVICE_DISCONNECTED'].includes(code) ? 'cancelled' : 'failed',{originalToolCallId:entry.request.toolCallId},code));
      } finally { clearInterval(watch); }
    } catch(error) { return result(r,'failed',{},errorCode(error)); }
  }
  async function perform(r: DeviceRequest, signal: AbortSignal): Promise<Record<string, unknown>> {
    if (r.toolName === 'device_pick_document') {
      const file = await pickDocument(signal);
      if (signal.aborted) throw fail('CANCELLED');
      validate(r);
      if (!/\.(txt|md|markdown)$/i.test(file.name) || file.size > 1024*1024) throw fail('INVALID_INPUT');
      const uploaded = await options.upload!(file,{request:r,signal});
      if (!uploaded.uploadId || typeof uploaded.uploadId !== 'string') throw fail('NO_EVIDENCE');
      return {uploadId:uploaded.uploadId, observation:'User selected document uploaded; no local path exposed'};
    }
    if (r.toolName === 'device_share') {
      const data: ShareData = {};
      for (const key of ['title','text','url'] as const) { const value = r.input[key]; if (value !== undefined) { if(typeof value !== 'string' || value.length>8000) throw fail('INVALID_INPUT'); data[key]=value; } }
      if (!data.text && !data.url) throw fail('INVALID_INPUT');
      if (data.url && !['https:','http:'].includes(new URL(data.url).protocol)) throw fail('INVALID_INPUT');
      await navigator.share(data);
      return {apiResolved:true, sent:false, observation:'Web Share API resolved; delivery and recipient are not verified'};
    }
    if (r.toolName === 'device_open_app') {
      const receipt = await options.apps![String(r.input.appId)]({request:r,signal});
      if (receipt?.verified !== true || !receipt.observation || !receipt.traceRef) throw fail('NO_EVIDENCE');
      return {appId:r.input.appId, receipt, navigated:false, observation:receipt.observation};
    }
    if (r.toolName === 'speech_input') {
      const adapter = options.speechAdapter!;
      const start = Date.now();
      try {
        const text = await abortable(new Promise<string>((resolve,reject) => {
          const callbacks = {onText:(text:string,final:boolean)=>{if(final) text.trim() ? resolve(text.trim()) : reject(fail('NO_EVIDENCE'));},onStart:()=>{},onEnd:()=>{},onFailure:(_id:string,code:string)=>reject(fail(code==='permission_denied'?'PERMISSION_DENIED':code==='stopped'?'CANCELLED':'NO_EVIDENCE'))};
          adapter.start({request_id:r.toolCallId,session_id:r.context.sessionId,signal},callbacks).then(value=>{if(value.status!=='ready')reject(fail(value.error_code==='permission_denied'?'PERMISSION_DENIED':'SOURCE_UNAVAILABLE'));},reject);
        }),signal);
        return {text,locale:'zh-CN',recognitionElapsedMs:Date.now()-start,audioDurationMs:null,observation:'Final transcription from injected existing SpeechAdapter; audio duration not measured'};
      } finally { void adapter.stop(r.toolCallId).catch(()=>{}); }
    }
    throw fail('INVALID_INPUT');
  }
  function cancel_tool(runId:string, toolCallId:string) { const entry=calls.get(JSON.stringify([runId,toolCallId])); return entry ? stop(entry,'CANCELLED') : null; }
  function disconnect() { disconnected=true; for(const entry of actions.values()) stop(entry,'DEVICE_DISCONNECTED'); }
  return {list_capabilities, execute_tool, resume_tool, cancel_tool, disconnect};
}
function errorCode(error:unknown):string {
  if (error instanceof DOMException) { if(error.name==='AbortError')return 'CANCELLED'; if(['NotAllowedError','SecurityError'].includes(error.name))return 'PERMISSION_DENIED'; }
  return typeof error==='object' && error!==null && 'code' in error && typeof error.code==='string' ? error.code : 'SOURCE_UNAVAILABLE';
}
function abortable<T>(pending:Promise<T>, signal:AbortSignal):Promise<T> {
  return new Promise((resolve,reject)=>{ const abort=()=>reject(fail(String(signal.reason ?? 'CANCELLED'))); pending.then(resolve,reject).finally(()=>signal.removeEventListener('abort',abort)); if(signal.aborted)abort();else signal.addEventListener('abort',abort,{once:true}); });
}
function pickDocument(signal:AbortSignal):Promise<File> {
  return new Promise((resolve,reject)=>{
    const input=document.createElement('input'); input.type='file'; input.accept='.txt,.md,.markdown,text/plain,text/markdown'; input.hidden=true;
    const cleanup=()=>{input.remove();signal.removeEventListener('abort',abort);};
    const abort=()=>{cleanup();reject(fail(String(signal.reason ?? 'CANCELLED')));};
    input.addEventListener('cancel',()=>{cleanup();reject(fail('CANCELLED'));},{once:true});
    input.addEventListener('change',()=>{const file=input.files?.[0];cleanup();file?resolve(file):reject(fail('CANCELLED'));},{once:true});
    signal.addEventListener('abort',abort,{once:true});
    if(signal.aborted){abort();return;}
    document.body.appendChild(input);
    try { input.click(); } catch(error) { cleanup();reject(error); }
  });
}
