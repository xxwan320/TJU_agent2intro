import type { ChatResponse, Source } from '../../../shared/contracts';
import type { CampusAssets, CampusMedia, GenerationOptions, POI, StreamEvent } from '../../../shared/r2';
import type { createParser as ParserFactory } from 'eventsource-parser';

export type TaskPhase = 'pending' | 'running' | 'has_content' | 'complete' | 'error' | 'cancelled';
export interface StreamTaskView {
  requestId: string;
  messageId: string;
  relatedRequestId: string | null;
  phase: TaskPhase;
  stage: string | null;
  answer: string;
  sources: Source[];
  model: string | null;
  usage: ChatResponse['usage'];
  elapsedMs: number | null;
  errorCode: string | null;
  errorMessage: string | null;
  partial: boolean;
  startedAt: number;
  finishedAt: number | null;
}

export interface GenerationDraft {
  prompt: string;
  type: GenerationOptions['type'];
  requirements: string;
  length: GenerationOptions['length'];
  style: GenerationOptions['style'];
}

export function validateGenerationDraft(draft: GenerationDraft): string | null {
  if (!draft.prompt.trim()) return '请先说明要生成的校园内容。';
  if (draft.prompt.length > 8000) return '生成主题不能超过 8000 字。';
  if (draft.requirements.length > 2000) return '补充要求不能超过 2000 字。';
  return null;
}

export function newTask(requestId: string, messageId: string, relatedRequestId: string | null = null): StreamTaskView {
  return { requestId, messageId, relatedRequestId, phase: 'pending', stage: null, answer: '', sources: [], model: null, usage: null, elapsedMs: null, errorCode: null, errorMessage: null, partial: false, startedAt: Date.now(), finishedAt: null };
}

export function safeBackendMessage(value: unknown): string {
  if (typeof value !== 'string' || !value.trim()) return '服务未返回可显示的错误说明。';
  return value.replace(/(?:authorization\s*[:=]?\s*(?:bearer\s+)?|bearer\s+|api[_-]?key\s*[:=]?\s*|secret\s*[:=]?\s*)[^\s,;]+/gi, '[敏感信息已隐藏]').replace(/https?:\/\/[^\s]+/g, '[地址已隐藏]').replace(/[\r\n\t]+/g, ' ').trim().slice(0, 280);
}

export function appendUniqueSources(current: Source[], incoming: Source[]): Source[] {
  const result = new Map(current.map((source) => [source.id, source]));
  for (const source of incoming) result.set(source.id, source);
  return [...result.values()];
}

export function mergePoiPages(current: POI[], incoming: POI[]): POI[] {
  const result = new Map(current.map((poi) => [poi.id, poi]));
  for (const poi of incoming) result.set(poi.id, poi);
  return [...result.values()];
}

export function campusMediaFor(assets: CampusAssets | null, campus: string): CampusMedia | null {
  return assets?.media.find((media) => media.campus_id === campus && media.local_path.startsWith('/assets/campus/')) ?? null;
}

export function shouldFollowLatest(scrollTop: number, scrollHeight: number, clientHeight: number): boolean {
  return scrollHeight - scrollTop - clientHeight < 56;
}

export function readableParagraphs(text: string): string[] {
  // Hide complete and still-streaming source markers; final references have their own panel.
  return text.replace(/\[source:[^\]]*(?:\]|$)/gi, '').replace(/\[(?:s|so|sou|sour|sourc|source)?$/i, '').replace(/\r\n/g, '\n').split(/\n{2,}/).filter((paragraph) => paragraph.trim().length > 0);
}

export function applyStreamEvent(task: StreamTaskView, event: StreamEvent): StreamTaskView {
  if (event.request_id !== task.requestId || ['complete', 'error', 'cancelled'].includes(task.phase)) return task;
  if (event.type === 'accepted') return { ...task, phase: 'running', stage: 'request' };
  if (event.type === 'status') return { ...task, phase: task.answer ? 'has_content' : 'running', stage: event.payload.stage };
  if (event.type === 'answer_delta') return { ...task, phase: task.phase === 'complete' ? 'complete' : 'has_content', answer: task.answer + event.payload.text };
  if (event.type === 'sources') return { ...task, sources: appendUniqueSources(task.sources, event.payload.sources) };
  if (event.type === 'usage') return { ...task, model: event.payload.model, usage: event.payload.usage };
  if (event.type === 'completed') {
    const response = event.payload.response;
    return { ...task, phase: response.answer.trim() ? 'complete' : 'error', answer: response.answer, sources: response.sources, model: response.model, usage: response.usage, elapsedMs: response.elapsed_ms, errorCode: response.answer.trim() ? null : 'EMPTY_ANSWER', errorMessage: response.answer.trim() ? null : '服务返回了空正文，未计为生成成功。', finishedAt: Date.now() };
  }
  if (event.type === 'error') return { ...task, phase: 'error', answer: event.payload.answer || task.answer, errorCode: event.payload.code, errorMessage: safeBackendMessage(event.payload.message), partial: event.payload.partial, finishedAt: Date.now() };
  if (event.type === 'cancelled') return { ...task, phase: 'cancelled', errorCode: 'CANCELLED', errorMessage: '本次操作已取消。', finishedAt: Date.now() };
  return task;
}

export class StreamTaskError extends Error {
  readonly code: string; readonly partial: boolean; readonly answer: string; readonly reason: string;
  constructor(code: string, message: string, partial: boolean, answer: string, reason: string) { super(message); this.code = code; this.partial = partial; this.answer = answer; this.reason = reason; }
}

export async function consumeR2Stream(
  response: Response,
  requestId: string,
  signal: AbortSignal,
  onEvent: (event: StreamEvent) => void,
  createParser: typeof ParserFactory,
  options: { startedAt?: number; totalTimeoutMs?: number; visibleIdleMs?: number; onTimeout?: () => void; expected?: { sessionId: string; messageId: string; campusId: string; mode: string } } = {},
): Promise<ChatResponse> {
  if (!response.ok) {
    let body: unknown;
    try { body = await response.json(); } catch { body = null; }
    const api = body as { error?: { code?: string; message?: string } } | null;
    throw new StreamTaskError(api?.error?.code ?? `HTTP_${response.status}`, safeBackendMessage(api?.error?.message), false, '', 'upstream');
  }
  if (!response.body) throw new StreamTaskError('STREAM_UNAVAILABLE', '服务没有返回可读取的内容流。', false, '', 'disconnect');
  const reader = response.body.getReader(); const decoder = new TextDecoder(); const seen = new Set<string>();
  const started = options.startedAt ?? Date.now(); let lastVisible = started; let lastSeq = 0; let answer = ''; let terminal: ChatResponse | null = null; let terminalError: StreamTaskError | null = null; let parserError: StreamTaskError | null = null; let terminalSeen = false; let acceptedSeen = false;
  const parser = createParser({ maxBufferSize: 262144, onError: () => { parserError = new StreamTaskError('STREAM_PROTOCOL_ERROR', '响应流格式不完整。', Boolean(answer), answer, 'disconnect'); }, onEvent: (record) => {
    try {
      const event = JSON.parse(record.data) as StreamEvent;
        if (!event || event.request_id !== requestId || typeof event.event_id !== 'string' || typeof event.seq !== 'number' || event.type !== record.event || (record.id && record.id !== event.event_id)) throw new Error('envelope');
        if(event.requestId&&event.requestId!==requestId||event.generation&&event.generation!==requestId||event.campusId&&options.expected&&event.campusId!==options.expected.campusId)throw new Error('stale_channel');
      if (seen.has(event.event_id)) return;
      if (terminalSeen) throw new Error('event_after_terminal');
      if (!['accepted','status','answer_delta','sources','poi_action','usage','completed','error','cancelled'].includes(event.type)) throw new Error('unknown_event');
      if (event.seq <= lastSeq) throw new Error('sequence');
      if (!acceptedSeen && event.type !== 'accepted') throw new Error('accepted_required');
      if (event.type === 'accepted' && acceptedSeen) throw new Error('duplicate_accepted');
      if (event.type === 'accepted' && options.expected && (event.payload.session_id !== options.expected.sessionId || event.payload.message_id !== options.expected.messageId || event.payload.campus_id !== options.expected.campusId || event.payload.mode !== options.expected.mode)) throw new Error('accepted_snapshot');
      if (event.type === 'completed' && (event.payload.response.request_id !== requestId || (options.expected && event.payload.response.session_id !== options.expected.sessionId))) throw new Error('completed_snapshot');
      if (event.type === 'completed' || event.type === 'error' || event.type === 'cancelled') { if (terminalSeen) throw new Error('duplicate_terminal'); terminalSeen = true; }
      seen.add(event.event_id); lastSeq = event.seq; if (event.type === 'accepted') acceptedSeen = true;
      if (event.type === 'answer_delta') { if (typeof event.payload.text !== 'string' || answer.length + event.payload.text.length > 23000) throw new Error('invalid_answer'); answer += event.payload.text; if (event.payload.text.trim()) lastVisible = Date.now(); }
      onEvent(event);
      if (event.type === 'completed') {
        if (!event.payload.response.answer.trim()) terminalError = new StreamTaskError('EMPTY_ANSWER', '服务返回了空正文，未计为成功。', false, '', 'empty');
        else terminal = event.payload.response;
      } else if (event.type === 'error') terminalError = new StreamTaskError(event.payload.code, safeBackendMessage(event.payload.message), event.payload.partial, event.payload.answer || answer, event.payload.reason);
      else if (event.type === 'cancelled') terminalError = new StreamTaskError('CANCELLED', '本次操作已取消。', Boolean(answer), answer, 'cancelled');
    } catch (error) { if (!(error instanceof StreamTaskError)) parserError = new StreamTaskError('STREAM_PROTOCOL_ERROR', '响应流包含无法验证的事件。', Boolean(answer), answer, 'disconnect'); }
  }});
  const totalTimeout = options.totalTimeoutMs ?? 120000; const visibleIdle = options.visibleIdleMs ?? 60000;
  try {
    while (!terminal && !terminalError) {
      if (signal.aborted) throw new StreamTaskError('CANCELLED', '本次操作已取消。', Boolean(answer), answer, 'cancelled');
      const remaining = Math.min(totalTimeout - (Date.now() - started), visibleIdle - (Date.now() - lastVisible));
      if (remaining <= 0) { options.onTimeout?.(); throw new StreamTaskError('INCOMPLETE_OUTPUT', '等待正文超时，已停止本次请求。', Boolean(answer), answer, 'timeout'); }
      let timer: ReturnType<typeof setTimeout> | undefined;
      const read = await Promise.race([reader.read(), new Promise<never>((_, reject) => { timer = setTimeout(() => { options.onTimeout?.(); reject(new StreamTaskError('INCOMPLETE_OUTPUT', '响应流等待超时，已停止本次请求。', Boolean(answer), answer, 'timeout')); }, remaining); })]).finally(() => { if (timer) clearTimeout(timer); });
      if (read.done) break;
      parser.feed(decoder.decode(read.value, { stream: true }));
      if (parserError) throw parserError;
    }
    if (terminalError) throw terminalError;
    if (!terminal) throw new StreamTaskError('INCOMPLETE_OUTPUT', '响应流提前结束，内容未标记为完成。', Boolean(answer), answer, 'disconnect');
    return terminal;
  } finally { try { await reader.cancel(); } catch { /* Connection may already be closed. */ } }
}

export function exportGeneratedText(task: StreamTaskView): Blob | null {
  if (!task.answer.trim()) return null;
  return new Blob([task.answer], { type: 'text/plain;charset=utf-8' });
}

/** Deadline starts before fetch, not after response headers. */
export async function responseWithDeadline(open: () => Promise<Response>, controller: AbortController, timeoutMs = 60000): Promise<Response> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let onAbort: (() => void) | undefined;
  try {
    return await Promise.race([open(), new Promise<never>((_, reject) => {
      onAbort = () => reject(new StreamTaskError('CANCELLED', '本次操作已取消。', false, '', 'cancelled'));
      controller.signal.addEventListener('abort', onAbort, { once: true });
      if (controller.signal.aborted) onAbort();
      timer = setTimeout(() => {
        controller.signal.removeEventListener('abort', onAbort!);
        reject(new StreamTaskError('INCOMPLETE_OUTPUT', '等待服务响应超时，请稍后重试。', false, '', 'timeout'));
        controller.abort();
      }, timeoutMs);
    })]);
  } finally { if (timer) clearTimeout(timer); if (onAbort) controller.signal.removeEventListener('abort', onAbort); }
}
