import { TourWorkspace, type TourMemory } from './TourWorkspace';
import { privateText, speechEventCurrent } from './tour-model';
import type { SpeechInteractionController, SpeechInteractionContext } from '../../../shared/r3-speech';
import type { SpeechInteractionEvent } from '../../../shared/r3';
import { createSpeechInteractionController } from '../speech/interaction';
import { connectSpeechInteraction } from '../transport/r3-speech';
import { Fragment, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { ApiError, AvatarAdapter, AvatarState, CampusId, ChatResponse, Health, Mode, RuntimeEvent, Source, SpeechAdapter, Voice } from '../../../shared/contracts';
import type { CampusAssets, GenerationOptions, POI, SpeechController, SpeechProgress, SpeechRun, StreamEvent } from '../../../shared/r2';
import { createAvatarAdapter } from '../avatar/adapter';
import { createSpeechController } from '../speech/controller';
import { transport } from '../transport/api';
import { createSseParser, r2Transport } from '../transport/r2';
import { CampusBackdrop } from './CampusBackdrop';
import { routeNarration } from '../transport/amap-navigation';
import { CampusExplorer } from './CampusExplorer';
import { freshUuid, mergeRuntimeEvents, safeSourceUrl, sanitizedLogExport } from './model';
import { applyStreamEvent, consumeR2Stream, exportGeneratedText, newTask, readableParagraphs, shouldFollowLatest, StreamTaskError, type GenerationDraft, type StreamTaskView, validateGenerationDraft, responseWithDeadline } from './r2-model';
import './style.css';

type Lane = 'chat' | 'generation';
type WorkView = 'chat' | 'generation';
type MobileView = 'guide' | 'work';
type SpeechMode = 'off' | 'brief' | 'full';
interface TaskRecord extends StreamTaskView {
  lane: Lane; prompt: string; mode: Mode; campus: CampusId; poiId: string | null; generation: GenerationOptions | null;
}
interface Preferences { campus: CampusId; avatarScale: number; panelWidth: number; speechMode: SpeechMode }

const CAMPUS_NAMES: Record<CampusId, string> = { weijinlu: '卫津路校区', beiyangyuan: '北洋园校区' };
const PHASE_LABELS: Record<StreamTaskView['phase'], string> = { pending: '待开始', running: '执行中', has_content: '正在接收', complete: '已完成', error: '失败', cancelled: '已取消' };
const STAGE_LABELS: Record<string, string> = { request: '请求已受理', knowledge: '检索中', model: '模型生成中', generation: '内容生成中' };
const AVATAR_LABELS: Record<AvatarState, string> = { idle: '随时为你导览', listening: '正在听你说', thinking: '正在回答', speaking: '正在播报', error: '暂时无法响应' };
const DEFAULT_DRAFT: GenerationDraft = { prompt: '', type: 'guide_script', requirements: '', length: 'medium', style: 'friendly' };

function readPreferences(): Preferences {
  try {
    const saved = JSON.parse(localStorage.getItem('ai4tju.r2.preferences') ?? '{}') as Partial<Preferences>;
    return { campus: saved.campus === 'beiyangyuan' ? 'beiyangyuan' : 'weijinlu', avatarScale: typeof saved.avatarScale === 'number' ? Math.min(1.25, Math.max(.8, saved.avatarScale)) : 1, panelWidth: typeof saved.panelWidth === 'number' ? Math.min(760, Math.max(420, saved.panelWidth)) : 520, speechMode: saved.speechMode === 'brief' || saved.speechMode === 'full' ? saved.speechMode : 'off' };
  } catch { return { campus: 'weijinlu', avatarScale: 1, panelWidth: 520, speechMode: 'off' }; }
}

function safeInline(text: string) {
  return text.split(/(`[^`]+`|\[[^\]]+\]\([^\s)]+\)|\*\*[^*]+\*\*)/g).map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) return <code key={index}>{part.slice(1, -1)}</code>;
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={index}>{part.slice(2, -2)}</strong>;
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part); const href = link ? safeSourceUrl(link[2]) : null;
    if (link) return href ? <a key={index} href={href} target="_blank" rel="noreferrer">{link[1]}</a> : <Fragment key={index}>{link[1]}</Fragment>;
    return <Fragment key={index}>{part}</Fragment>;
  });
}

function RichText({ text, onReadParagraph }: { text: string; onReadParagraph?: (text: string, index: number) => void }) {
  const paragraphs = readableParagraphs(text);
  return <div className="rich-text">{paragraphs.map((paragraph, index) => <div className="readable-paragraph" key={index}><div>{paragraph.split('\n').map((line, lineIndex) => <p key={lineIndex}>{safeInline(line)}</p>)}</div>{onReadParagraph && paragraph.trim() && <button aria-label={`朗读第 ${index + 1} 段`} onClick={() => onReadParagraph(paragraph, index)}>读这一段</button>}</div>)}</div>;
}

function SourceDetails({ sources, final }: { sources: Source[]; final: boolean }) {
  if (!sources.length) return null;
  return <details className="task-sources"><summary>{final ? '参考资料' : '正在检索的资料'} {sources.length} 条</summary><ol>{sources.map((source, index) => { const href = safeSourceUrl(source.url); return <li key={source.id}><span>[{index + 1}]</span><div><strong>{source.title}</strong><p>{source.snippet}</p>{href && <a href={href} target="_blank" rel="noreferrer">打开资料</a>}</div></li>; })}</ol></details>;
}

function TaskStatus({ task }: { task: TaskRecord }) {
  return <span className={`task-status ${task.phase}`}>{PHASE_LABELS[task.phase]}{task.stage && (task.phase === 'running' || task.phase === 'has_content') ? ` · ${STAGE_LABELS[task.stage] ?? task.stage}` : ''}</span>;
}

interface TaskCardProps {
  task: TaskRecord; currentCampus: CampusId; canStop: boolean;
  onStop(): void; onRetry(): void; onLogs(): void; onCopy(): void; onExport(): void; onRead(text: string, segmentId: string): void; onReadFull(): void; onContinue(): void; onMap(): void;
}
function TaskCard({ task, currentCampus, canStop, onStop, onRetry, onLogs, onCopy, onExport, onRead, onReadFull, onContinue, onMap }: TaskCardProps) {
  const [expanded, setExpanded] = useState(true);
  const hasText = Boolean(task.answer.trim()); const sameCampus = task.campus === currentCampus;
  return <article className={`task-card ${task.phase}`} data-task-id={task.requestId}><header><div><TaskStatus task={task}/><span className="task-campus">{CAMPUS_NAMES[task.campus]}</span></div></header>
    <div className="task-prompt"><span>{task.lane === 'generation' ? '生成主题' : '你'}</span><p>{task.prompt}</p></div>
    {(task.phase === 'pending' || (task.phase === 'running' && !hasText)) && <div className="stream-wait"><span/><p>{task.phase === 'pending' ? '正在提交请求…' : '等待第一段可见正文；不会把心跳或推理当作内容。'}</p></div>}
    {hasText && <div className={`task-body ${expanded ? '' : 'collapsed'}`}><RichText text={task.answer} onReadParagraph={(text, index) => onRead(text, `${task.messageId}-p${index}`)}/></div>}
    {task.phase === 'error' && <div className="task-error" role="alert"><strong>{task.partial && hasText ? '输出未完整结束' : '本次操作失败'}</strong><p>{task.errorMessage}</p><button onClick={onLogs}>查看相关日志</button></div>}
    {task.phase === 'cancelled' && <p className="task-cancelled">请求已取消，旧流事件不会写入后续任务。</p>}
    <SourceDetails sources={task.sources} final={task.phase === 'complete'}/>
    <details className="task-technical"><summary>技术详情</summary><code>{task.requestId}</code><p>{task.errorCode}</p>{hasText && <div className="task-meta"><span>{task.model ?? '模型未返回'}</span><span>{task.elapsedMs == null ? '耗时未返回' : `${Math.round(task.elapsedMs)} ms`}</span><span>{task.usage ? `${task.usage.total_tokens} tokens` : '用量未返回'}</span></div>}</details>
    <footer>{canStop && <button className="danger" onClick={onStop}>停止回答</button>}{(task.phase === 'error' || task.phase === 'cancelled') && <button onClick={onRetry}>新请求重试</button>}{hasText && <><button onClick={() => setExpanded((value) => !value)}>{expanded ? '收起正文' : '展开正文'}</button><button onClick={onCopy}>复制</button>{task.lane === 'generation' && <button onClick={onExport}>导出文本</button>}<button onClick={onReadFull}>读全文</button></>}{task.phase === 'complete' && <button onClick={onContinue}>展开讲讲</button>}{task.phase === 'complete' && sameCampus && task.poiId && <button onClick={onMap}>在地图查看</button>}</footer>
    {task.relatedRequestId && <small className="retry-link">此结果来自一次重新请求</small>}
  </article>;
}

export function App() {
  const [prefs, setPrefs] = useState(readPreferences); const [health, setHealth] = useState<Health | null>(null); const [serviceError, setServiceError] = useState(false);
  const [tourMode,setTourMode]=useState(true);
  const tourTextRef=useRef<((text:string)=>Promise<boolean>)|null>(null);
  const tourMemoryRef=useRef<Partial<Record<CampusId,TourMemory>>>({});const tourCancelRef=useRef<(()=>void)|null>(null);
  const [voiceSend,setVoiceSend]=useState<'confirm'|'auto'>('confirm');
  const interactionRef=useRef<SpeechInteractionController|null>(null); const interactionContext=useRef<SpeechInteractionContext|null>(null); const voiceSendRef=useRef(voiceSend); voiceSendRef.current=voiceSend;
  const [workView, setWorkView] = useState<WorkView>('chat'); const [mobileView, setMobileView] = useState<MobileView>('work'); const [chatMode, setChatMode] = useState<Exclude<Mode, 'content_generation'>>('campus_qa');
  const [chatInput, setChatInput] = useState(''); const [chatValidation, setChatValidation] = useState(''); const [draft, setDraft] = useState(DEFAULT_DRAFT); const [generationValidation, setGenerationValidation] = useState('');
  const [chatTasks, setChatTasks] = useState<TaskRecord[]>([]); const [generationTasks, setGenerationTasks] = useState<TaskRecord[]>([]); const [events, setEvents] = useState<RuntimeEvent[]>([]); const [logsOpen, setLogsOpen] = useState(false); const [logRequest, setLogRequest] = useState<string | null>(null); const [notice, setNotice] = useState('');
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null); const [focusPoiId, setFocusPoiId] = useState<string | null>(null); const [focusRevision,setFocusRevision]=useState(0); const [campusAssets, setCampusAssets] = useState<CampusAssets | null>(null);
  const [avatarState, setAvatarState] = useState<AvatarState>('idle'); const [avatarReady, setAvatarReady] = useState(false); const [avatarMessage, setAvatarMessage] = useState('正在连接人物渲染器…');
  const [speechEnabled, setSpeechEnabled] = useState(false); const [speechProgress, setSpeechProgress] = useState<SpeechProgress | null>(null); const [voices, setVoices] = useState<Voice[]>([]); const [voiceId, setVoiceId] = useState('');
  const [asrBusy, setAsrBusy] = useState(false);
  const [laneBusy, setLaneBusy] = useState<Record<Lane, boolean>>({ chat: false, generation: false });
  const [showLatest, setShowLatest] = useState(false);
  const avatarHostRef = useRef<HTMLDivElement>(null); const avatarRef = useRef<AvatarAdapter | null>(null); const asrRef = useRef<SpeechAdapter | null>(null); const speechControllerRef = useRef<SpeechController | null>(null);
  const sessionsRef = useRef<Record<Lane, Record<CampusId, string>>>({ chat: { weijinlu: freshUuid(), beiyangyuan: freshUuid() }, generation: { weijinlu: freshUuid(), beiyangyuan: freshUuid() } });
  const laneAbortRef = useRef<Record<Lane, AbortController | null>>({ chat: null, generation: null }); const laneGenerationRef = useRef<Record<Lane, number>>({ chat: 0, generation: 0 }); const runningRef = useRef<Record<Lane, boolean>>({ chat: false, generation: false }); const requestRef = useRef<Record<Lane, string | null>>({ chat: null, generation: null });
  const requestSessionRef=useRef<Record<Lane,string|null>>({chat:null,generation:null});
  const composingRef = useRef(false); const messageListRef = useRef<HTMLDivElement>(null); const autoFollowRef = useRef(true); const previousCampusRef = useRef(prefs.campus); const campusRef = useRef(prefs.campus);
  const speechProgressRef = useRef<SpeechProgress | null>(null); const renderReceiptsRef = useRef(new Set<string>());
  const selectedPoiRef = useRef<POI | null>(null); const speechRunRequestRef = useRef<string | null>(null);
  const asrAbortRef = useRef<AbortController | null>(null); const asrGenerationRef = useRef(0); const asrRequestRef = useRef<string | null>(null);
  const onSelectPoi = useCallback((poi: POI | null) => { selectedPoiRef.current = poi; setSelectedPoi(poi); }, []); const onCampusAssets = useCallback((assets: CampusAssets | null) => setCampusAssets(assets), []);

  useEffect(() => { try { localStorage.setItem('ai4tju.r2.preferences', JSON.stringify(prefs)); } catch { /* Preferences remain in memory. */ } }, [prefs]);
  campusRef.current=prefs.campus;
  useEffect(() => {
    let active = true; const avatar = createAvatarAdapter(); const controller = createSpeechController(); const asr = controller.getAdapter(); avatarRef.current = avatar; asrRef.current = asr; speechControllerRef.current = controller;
    interactionRef.current=connectSpeechInteraction(()=>createSpeechInteractionController({speechController:controller}),controller);
    const unsubscribeLevel=controller.getAdapter().subscribeAudioLevel(level=>avatar.setAudioLevel?.(level));
    void transport.health().then((value) => { if (active) { setHealth(value); setServiceError(false); } }).catch(() => { if (active) setServiceError(true); });
    if (avatarHostRef.current) void avatar.mount(avatarHostRef.current).then((result) => { if (active) { setAvatarReady(result.status === 'ready'); setAvatarMessage(result.status === 'ready' ? '人物已就位' : result.status === 'failed' ? '人物渲染失败' : '人物渲染尚未接入'); } });
    const unsubscribe = controller.subscribe((progress) => { if (!active) return; speechProgressRef.current = progress; setSpeechProgress(progress); if (progress.status === 'error') setNotice('播报失败：' + (progress.code ?? 'speech_failed') + '。可点击恢复声音或重新朗读。'); speechRunRequestRef.current = progress.status === 'idle' || progress.status === 'stopped' || progress.status === 'error' ? null : progress.request_id; if (progress.status === 'speaking') setAvatarState('speaking'); else if (!runningRef.current.chat && !runningRef.current.generation) setAvatarState(progress.status === 'error' ? 'error' : 'idle'); });
    return () => { active = false; laneAbortRef.current.chat?.abort(); laneAbortRef.current.generation?.abort(); asrAbortRef.current?.abort(); unsubscribe(); unsubscribeLevel(); controller.dispose(); interactionContext.current=null;interactionRef.current?.dispose(); avatar.dispose(); if (asrRequestRef.current) void asr.stop(asrRequestRef.current); };
  }, []);
  useEffect(() => { avatarRef.current?.setState(avatarState); }, [avatarState]);
  useEffect(() => {
    if (previousCampusRef.current === prefs.campus) return; previousCampusRef.current = prefs.campus; setSelectedPoi(null); selectedPoiRef.current = null; setFocusPoiId(null); setCampusAssets(null); setNotice('已切换浏览校区；实际位置不会自动改变。');
    void stopListening(); void cancelLane('chat', 'campus_change'); void cancelLane('generation', 'campus_change'); void speechControllerRef.current?.stop('campus_change');
  }, [prefs.campus]);
  useEffect(() => {
    if (!autoFollowRef.current || !messageListRef.current || workView !== 'chat') return;
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [chatTasks, workView]);

  useEffect(() => {
    if (workView !== 'generation') return;
    for (const task of generationTasks) {
      if (task.campus !== prefs.campus || task.phase !== 'complete' || !task.answer.trim() || renderReceiptsRef.current.has(task.requestId)) continue;
      if (!document.querySelector('[data-task-id="' + CSS.escape(task.requestId) + '"] .task-body')?.textContent?.trim()) continue;
      renderReceiptsRef.current.add(task.requestId);
      void r2Transport.generationRendered({ event_id: freshUuid(), request_id: task.requestId, session_id: sessionsRef.current.generation[task.campus], message_id: task.messageId, campus_id: task.campus, answer_chars: task.answer.length }).catch(() => setNotice('正文已显示，渲染回执未确认。'));
    }
  }, [generationTasks, workView, prefs.campus]);

  function currentSession(lane: Lane, campus = prefs.campus) { return (tourMode?tourMemoryRef.current[campus]?.session?.session_id:undefined)??sessionsRef.current[lane][campus]; }
  function setTasks(lane: Lane, update: (current: TaskRecord[]) => TaskRecord[]) { if (lane === 'chat') setChatTasks(update); else setGenerationTasks(update); }
  function setRunning(lane: Lane, value: boolean) { runningRef.current[lane] = value; setLaneBusy((current) => ({ ...current, [lane]: value })); }
  function isCurrent(lane: Lane, generation: number, requestId: string) { return laneGenerationRef.current[lane] === generation && requestRef.current[lane] === requestId; }
  function pollRuntime(requestId: string, lane: Lane, generation: number) {
    let cursor = 0; let stopped = false; let timer = 0; let pending = false;
    const poll = async () => { if (stopped || pending || !isCurrent(lane, generation, requestId)) return; pending = true; try { const page = await transport.events(requestId, cursor); if (isCurrent(lane, generation, requestId)) { cursor = page.next_cursor; setEvents((current) => mergeRuntimeEvents(current, page.events)); } } catch { /* SSE error card remains authoritative. */ } finally { pending = false; } };
    void poll(); timer = window.setInterval(() => void poll(), 500); return async () => { window.clearInterval(timer); await poll(); stopped = true; };
  }
  const lastSpeechRunRef=useRef<SpeechRun|null>(null);
  function bindPlayback(run:SpeechRun){
    lastSpeechRunRef.current=run;
    const context:SpeechInteractionContext={interaction_id:freshUuid(),session_id:run.session_id,campus_id:run.campus_id,generation_id:run.generation_id,request_id:run.request_id};
    interactionContext.current=context;
    interactionRef.current?.bind?.({context,mode:'continuous',onEvent:handleInteraction});
  }
  async function beginSpeech(task: TaskRecord, generationId: string): Promise<boolean> {
    if (!speechEnabled || prefs.speechMode === 'off' || !voiceId || !speechControllerRef.current) return false;
    const run: SpeechRun = { request_id: task.requestId, session_id: currentSession(task.lane, task.campus), campus_id: task.campus, generation_id: generationId, voice_id: voiceId, mode: prefs.speechMode, signal: laneAbortRef.current[task.lane]!.signal };
    bindPlayback(run);
    const result = await speechControllerRef.current.begin(run); if (result.status !== 'ready') { setNotice('语音导览控制器尚未就绪，正文会继续生成。'); return false; } speechRunRequestRef.current = task.requestId; return true;
  }
  async function handleSceneEvent(event: Extract<StreamEvent, { type: 'poi_action' }>, task: TaskRecord, laneGeneration: number) {
    if (!isCurrent(task.lane, laneGeneration, task.requestId) || task.campus !== prefs.campus) return;
    setFocusPoiId(event.payload.action.parameters.building_id); setMobileView('guide');
    for (let attempt=0; attempt<20; attempt++) {
      await new Promise<void>(resolve => setTimeout(resolve,50));
      if (!isCurrent(task.lane,laneGeneration,task.requestId) || campusRef.current!==task.campus) return;
      if (document.querySelector('[data-poi-id="' + CSS.escape(event.payload.action.parameters.building_id) + '"]')) break;
    }
    const completed = Boolean(document.querySelector(`[data-poi-id="${CSS.escape(event.payload.action.parameters.building_id)}"]`));
    await transport.ack({ request_id: task.requestId, session_id: currentSession(task.lane, task.campus), action_id: event.payload.action.action_id, status: completed ? 'completed' : 'failed', ...(completed ? {} : { error_code: 'execution_failed' as const }) }).catch(() => setNotice('点位已处理，但场景回执发送失败。'));
  }
  async function runTask(lane: Lane, prompt: string, mode: Mode, options: GenerationOptions | null, relatedRequestId: string | null = null, poi = selectedPoiRef.current, poiIdOverride: string | null = null) {
    if(campusRef.current!==prefs.campus)return;
    const clean = privateText(prompt.trim());
    const cleanRequirements=privateText(options?.requirements??'');
    if(clean!==prompt.trim()||cleanRequirements!==(options?.requirements??'')){setNotice('已移除精确位置，请使用地图定位入口。');if(lane==='chat')setChatInput(clean);else setDraft(current=>({...current,prompt:clean,requirements:cleanRequirements}));return;}
    if (!clean) { if (lane === 'chat') setChatValidation('请输入问题后再发送。'); else setGenerationValidation('请先说明要生成的校园内容。'); return; }
    if (runningRef.current[lane]) { setNotice(`${lane === 'chat' ? '对话' : '生成'}任务仍在执行，请先停止或等待完成。`); return; }
    void stopListening();
    const campus = prefs.campus; const requestId = freshUuid(requestRef.current[lane] ?? undefined); const messageId = freshUuid(); const controller = new AbortController(); const laneGeneration = ++laneGenerationRef.current[lane];
    requestSessionRef.current[lane]=currentSession(lane,campus); requestRef.current[lane] = requestId; laneAbortRef.current[lane] = controller; setRunning(lane, true); setAvatarState('thinking');
    const initial: TaskRecord = { ...newTask(requestId, messageId, relatedRequestId), lane, prompt: clean, mode, campus, poiId: poi?.campus_id === campus ? poi.id : poiIdOverride, generation: options };
    setTasks(lane, (current) => [...current, initial]); if (lane === 'chat') { setChatInput(''); setChatValidation(''); } else setGenerationValidation(''); setNotice('');
    const startedAt = Date.now(); let hardTimedOut = false; const hardDeadline = setTimeout(() => { hardTimedOut = true; controller.abort(); }, 120000); const finishPoll = pollRuntime(requestId, lane, laneGeneration); const speechGenerationId = freshUuid(); let speechStarted = false; let localTask = initial;
    try {
      await stopListening(); await speechControllerRef.current?.stop('new_request');
      if (!isCurrent(lane, laneGeneration, requestId) || controller.signal.aborted) return;
      setAvatarState('thinking'); speechStarted = await beginSpeech(initial, speechGenerationId);
      if(!isCurrent(lane,laneGeneration,requestId)||controller.signal.aborted)return;
      const response = await responseWithDeadline(() => r2Transport.openStream({ request_id: requestId, session_id: currentSession(lane, campus), message_id: messageId, message: clean, mode, campus_id: campus, selected_building_id: initial.poiId, selected_poi_id: initial.poiId, generation: options }, controller.signal), controller);
      const completed = await consumeR2Stream(response, requestId, controller.signal, (event) => {
        if (!isCurrent(lane, laneGeneration, requestId)) return; localTask = { ...localTask, ...applyStreamEvent(localTask, event) }; setTasks(lane, (current) => current.map((task) => task.requestId === requestId ? localTask : task));
        if (event.type === 'answer_delta' && speechStarted) speechControllerRef.current?.append(speechGenerationId, event.payload.text);
        if (event.type === 'poi_action') void handleSceneEvent(event, localTask, laneGeneration);
      }, createSseParser, { startedAt, onTimeout: () => controller.abort(), expected: { sessionId: currentSession(lane, campus), messageId, campusId: campus, mode } });
      if (!isCurrent(lane, laneGeneration, requestId)) return;
      if (!completed.answer.trim()) throw new StreamTaskError('EMPTY_ANSWER', '服务返回了空正文，未计为成功。', false, '', 'empty');
      // Audio drains independently: a blocked player must not hold the text task open.
      if (speechStarted) void speechControllerRef.current?.finish(speechGenerationId, completed.answer).catch(() => setNotice('正文已完成，播报未完成，请重新朗读。'));
    } catch (error) {
      if (hardTimedOut) error = new StreamTaskError('INCOMPLETE_OUTPUT', '请求超过总时限，已停止等待。', Boolean(localTask.answer), localTask.answer, 'timeout');
      if (!isCurrent(lane, laneGeneration, requestId)) return;
      if (speechRunRequestRef.current === requestId) void speechControllerRef.current?.stop('cancel');
      const cancelled = controller.signal.aborted && !(error instanceof StreamTaskError && error.reason === 'timeout'); const streamError = error instanceof StreamTaskError ? error : null;
      setTasks(lane, (current) => current.map((task) => task.requestId === requestId ? { ...task, phase: cancelled || streamError?.reason === 'cancelled' ? 'cancelled' : 'error', answer: streamError?.answer || task.answer, partial: streamError?.partial ?? Boolean(task.answer), errorCode: cancelled ? 'CANCELLED' : streamError?.code ?? 'TRANSPORT_ERROR', errorMessage: cancelled ? '本次操作已取消。' : streamError?.message ?? '网络连接中断，未收到有效终态。', finishedAt: Date.now() } : task));
    } finally {
      clearTimeout(hardDeadline); void finishPoll(); if (isCurrent(lane, laneGeneration, requestId)) { setRunning(lane, false); laneAbortRef.current[lane] = null; if (!runningRef.current.chat && !runningRef.current.generation && speechProgressRef.current?.status !== 'speaking') setAvatarState('idle'); void transport.health().then(setHealth).catch(() => undefined); }
    }
  }
  async function cancelLane(lane: Lane, reason: 'user' | 'campus_change' | 'clear' = 'user') {
    const requestId = requestRef.current[lane]; if (!requestId || !runningRef.current[lane]) return;
    const sessionId = requestSessionRef.current[lane];if(!sessionId)return; ++laneGenerationRef.current[lane]; laneAbortRef.current[lane]?.abort(); laneAbortRef.current[lane] = null; setRunning(lane, false);
    setTasks(lane, (current) => current.map((item) => item.requestId === requestId && item.phase !== 'complete' ? { ...item, phase: 'cancelled', errorCode: 'CANCELLED', errorMessage: '本次操作已取消。', finishedAt: Date.now() } : item));
    if (speechRunRequestRef.current === requestId) await speechControllerRef.current?.stop(reason === 'user' ? 'cancel' : reason);
    await transport.cancel(requestId, sessionId).then((result) => { if (result.upstream_stop === 'unconfirmed') setNotice('本地已停止；上游停止状态未确认。'); }).catch(() => setNotice('本地已停止；取消回执未确认。'));
    if (!runningRef.current.chat && !runningRef.current.generation) setAvatarState('idle');
  }
  async function enableSpeech() {
    const controller = speechControllerRef.current; if (!controller) return; const result = await controller.enable(true); if (result.status !== 'ready') { setNotice('语音导览尚未集成或服务不可用。'); return; }
    const available = await controller.listVoices(); const chinese = available.find((voice) => /^zh(?:-|_)/i.test(voice.locale)); setVoices(available); if (!chinese) { setNotice('未检测到中文音色，语音导览未开启。'); return; } setVoiceId(chinese.id); setSpeechEnabled(true); setPrefs((current) => ({ ...current, speechMode: current.speechMode === 'off' ? 'brief' : current.speechMode }));
  }
  async function playTask(task: TaskRecord, text: string, segmentId?: string) {
    if (!speechEnabled || !voiceId || !speechControllerRef.current) { setNotice('请先开启语音导览并选择中文音色。'); return; }
    const generationId = freshUuid(); const controller = new AbortController(); const run: SpeechRun = { request_id: task.requestId, session_id: currentSession(task.lane, task.campus), campus_id: task.campus, generation_id: generationId, voice_id: voiceId, mode: 'full', signal: controller.signal };
    await stopListening();bindPlayback(run);
    const result = segmentId ? await speechControllerRef.current.playSegment(run, text, segmentId) : await speechControllerRef.current.playFull(run, text); if (result.status !== 'ready') setNotice('语音播放未能开始。');
  }
  async function continueSpeech(){
    const previous=lastSpeechRunRef.current;
    if(!previous||previous.campus_id!==prefs.campus){setNotice('没有本校区可继续的内容。');return;}
    const run:SpeechRun={...previous,generation_id:freshUuid(),signal:new AbortController().signal};
    bindPlayback(run);
    const result=await speechControllerRef.current?.continueRemaining?.(run);
    if(result?.status!=='ready')setNotice('没有可继续的内容，请选择正文朗读。');
  }
  async function submitTourText(text:string){
    if(tourMode&&await tourTextRef.current?.(text)){setChatInput('');return;}
    await runTask('chat',text,'campus_qa',null);
  }
  async function startListening() {
    if(asrBusy)return;const listenGeneration=++asrGenerationRef.current;
    tourCancelRef.current?.();
    await cancelLane('chat'); await cancelLane('generation'); await speechControllerRef.current?.stop('new_request');
    if(campusRef.current!==prefs.campus||listenGeneration!==asrGenerationRef.current)return;
    if(interactionRef.current){
      try{
        if(campusRef.current!==prefs.campus||listenGeneration!==asrGenerationRef.current)return;
        const context:SpeechInteractionContext={interaction_id:freshUuid(),session_id:currentSession('chat'),campus_id:prefs.campus,generation_id:freshUuid(),request_id:null};
        interactionContext.current=context;setAsrBusy(true);setAvatarState('listening');
        const result=await interactionRef.current.start({context,mode:'continuous',onEvent:handleInteraction});
        if(interactionContext.current!==context)return;
        if(result.status==='unavailable'){setAsrBusy(false);setNotice('语音服务暂不可用，请使用文字输入。');}
      }catch{setAsrBusy(false);setNotice('语音识别无法启动，请检查麦克风权限或服务。');}
      return;
    }
    const asr = asrRef.current; if (!asr?.capabilities.asr) { setNotice('语音识别尚未配置，请使用文字输入。'); return; }
    if (asrBusy || runningRef.current.chat) { setNotice('请先结束当前语音或对话任务。'); return; }
    const requestId = freshUuid(asrRequestRef.current ?? undefined); const generation = ++asrGenerationRef.current; const campus = prefs.campus; const sessionId = currentSession('chat', campus); const controller = new AbortController(); asrAbortRef.current = controller; asrRequestRef.current = requestId; setAsrBusy(true); setAvatarState('listening');
    try {
      const result = await asr.start({ request_id: requestId, session_id: sessionId, signal: controller.signal }, { onText: (text, isFinal) => { if (asrGenerationRef.current !== generation || campusRef.current !== campus) return; setChatInput(text); if (isFinal) { setAsrBusy(false); setAvatarState('idle'); if(voiceSendRef.current==='auto')void submitTourText(text);else {void stopListening();setNotice('识别文字已填入，请确认后发送。');} } }, onStart: () => undefined, onEnd: () => undefined, onFailure: (id, code) => { if (asrGenerationRef.current !== generation || id !== requestId || campusRef.current !== campus) return; setAsrBusy(false); setAvatarState('idle'); setNotice(code.includes('permission') ? '麦克风权限被拒绝。' : '语音识别服务暂不可用。'); } });
      if (asrGenerationRef.current === generation && result.status !== 'ready') { setAsrBusy(false); setAvatarState('idle'); }
    } catch { if (asrGenerationRef.current === generation) { setAsrBusy(false); setAvatarState('idle'); setNotice('无法启动语音识别。'); } }
  }
  function handleInteraction(event:SpeechInteractionEvent){
    const context=interactionContext.current;
    if(!context||!speechEventCurrent(event,context)||campusRef.current!==context.campus_id)return;
    if(event.type==='speech.interrupted'){
      tourCancelRef.current?.();
      void cancelLane('chat');void cancelLane('generation');void speechControllerRef.current?.stop('new_request');return;
    }
    if(event.type==='recognition.partial'){setChatInput(privateText(event.text??''));return;}
    if(event.type==='recognition.final'){
      const text=privateText(event.text??'').trim();if(!text)return;setChatInput(text);
      if(text!==(event.text??'').trim()){setNotice('识别中包含精确位置，已移除；请改用地图定位。');return;}
      if(voiceSendRef.current==='auto')void submitTourText(text);
      else {void stopListening();setNotice('识别文字已填入，请确认后发送。');}
    }
    if(event.type==='speech.error'){setAsrBusy(false);setNotice('语音服务暂不可用，请使用文字输入。');}
  }
  async function stopListening() { interactionContext.current=null;await interactionRef.current?.stop('user'); const id = asrRequestRef.current; asrRequestRef.current = null; ++asrGenerationRef.current; asrAbortRef.current?.abort(); asrAbortRef.current = null; setAsrBusy(false); setAvatarState('idle'); if (id) await asrRef.current?.stop(id); }
  function copyTask(task: TaskRecord) { if (!task.answer.trim()) return; void navigator.clipboard.writeText(privateText(task.answer)).then(() => setNotice('内容已复制。')).catch(() => setNotice('浏览器未允许复制，请手动选择正文。')); }
  function exportTask(task: TaskRecord) { const blob = exportGeneratedText({...task,answer:privateText(task.answer)}); if (!blob) { setNotice('正文为空，无法导出。'); return; } const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `tju-${task.generation?.type ?? 'content'}-${task.requestId.slice(0, 8)}.txt`; anchor.click(); URL.revokeObjectURL(url); }
  function retryTask(task: TaskRecord) { if (task.lane === 'generation') void runTask('generation', task.prompt, 'content_generation', task.generation, task.requestId, task.poiId === selectedPoi?.id ? selectedPoi : null, task.poiId); else void runTask('chat', task.prompt, task.mode, null, task.requestId, task.poiId === selectedPoi?.id ? selectedPoi : null, task.poiId); }
  function submitGeneration() { const error = validateGenerationDraft(draft); if (error) { setGenerationValidation(error); return; } void runTask('generation', draft.prompt, 'content_generation', { type: draft.type, requirements: draft.requirements, length: draft.length, style: draft.style }); }
  function clearChat() { void stopListening(); void speechControllerRef.current?.stop('clear'); void cancelLane('chat', 'clear'); sessionsRef.current.chat[prefs.campus] = freshUuid(sessionsRef.current.chat[prefs.campus]); setChatTasks((current) => current.filter((task) => task.campus !== prefs.campus)); setChatValidation(''); }
  function onMessageScroll() { const node = messageListRef.current; if (!node) return; const atBottom = shouldFollowLatest(node.scrollTop, node.scrollHeight, node.clientHeight); autoFollowRef.current = atBottom; setShowLatest(!atBottom); }
  function goLatest() { const node = messageListRef.current; if (!node) return; autoFollowRef.current = true; node.scrollTop = node.scrollHeight; setShowLatest(false); }
  function resizeStart(event: React.PointerEvent<HTMLDivElement>) { if (window.innerWidth < 900) return; const startX = event.clientX; const startWidth = prefs.panelWidth; const move = (next: PointerEvent) => setPrefs((current) => ({ ...current, panelWidth: Math.min(760, Math.max(420, startWidth + startX - next.clientX)) })); const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); }; window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); }
  function showLogs(requestId?: string) { setLogRequest(requestId ?? null); setLogsOpen(true); }
  const shownEvents = logRequest ? events.filter((event) => event.request_id === logRequest) : events;
  const serviceTone = serviceError ? 'off' : health ? 'ready' : 'pending'; const modelTone = health?.model.verified ? 'ready' : health?.model.configured ? 'pending' : 'off';

  return <div className="app-shell r2-shell">
    <header className="topbar"><div className="brand"><span className="brand-mark">珂</span><div><strong>珂莱塔</strong><span>天津大学数字人校园导游</span></div></div><details className="system-status"><summary>技术详情</summary><span className={`status-pill ${serviceTone}`}><i/>{serviceError ? '应用离线' : health ? '应用在线' : '连接中'}</span><span className={`status-pill ${modelTone}`}><i/>{health?.model.verified ? '模型已连通' : health?.model.configured ? '模型待验证' : '模型未配置'}</span></details><div className="speech-controls">{!speechEnabled ? <button onClick={() => void enableSpeech()}>开启语音导览</button> : <><select aria-label="自动播报方式" value={prefs.speechMode} onChange={(event) => { setPrefs({ ...prefs, speechMode: event.target.value as SpeechMode }); if (event.target.value === 'off') void speechControllerRef.current?.stop('user'); }}><option value="off">自动播报关闭</option><option value="brief">自动简述</option><option value="full">自动全文</option></select><select aria-label="导览语音" value={voiceId} onChange={(event) => setVoiceId(event.target.value)}>{voices.map((voice) => <option key={voice.id} value={voice.id}>{voice.name}</option>)}</select><button onClick={() => void enableSpeech()}>刷新音色</button><button onClick={() => void speechControllerRef.current?.enable(true).then((result) => setNotice(result.status === 'ready' ? '已请求恢复声音。' : '声音恢复失败，请检查浏览器权限。'))}>恢复声音</button>{speechControllerRef.current?.continueRemaining && <button onClick={() => void continueSpeech()}>继续讲</button>}<span>{speechProgress?.status === 'speaking' ? '正在播报' : speechProgress?.status === 'buffering' ? '准备播报' : speechProgress?.status === 'error' ? '播报失败，请恢复或重读' : speechProgress?.status === 'paused' ? '播报已暂停' : '语音已开启'}</span>{(speechProgress?.status === 'speaking' || speechProgress?.status === 'buffering') && <button onClick={() => void speechControllerRef.current?.stop('user')}>停止播报</button>}</>}</div><button className="logs-button" onClick={() => showLogs()}><span>运行日志</span>{events.length > 0 && <b>{events.length}</b>}</button></header>
    <aside className="guide-character" aria-label="数字人导游"><div ref={avatarHostRef} className="guide-character-host" style={{transform: `scale(${prefs.avatarScale})`}}/><span>{avatarReady?AVATAR_LABELS[avatarState]:avatarMessage}</span></aside>
    <nav className="experience-switch" aria-label="使用方式"><button aria-pressed={tourMode} onClick={()=>setTourMode(true)}>行程与步行导览</button><button aria-pressed={!tourMode} onClick={()=>{setTourMode(false);void stopListening();void cancelLane('chat');void cancelLane('generation');void speechControllerRef.current?.stop('user');}}>校园对话与内容生成</button></nav>
    {tourMode&&<TourWorkspace key={prefs.campus} campus={prefs.campus} memory={tourMemoryRef.current[prefs.campus]} onMemory={value=>{tourMemoryRef.current[prefs.campus]=value;}} registerCancel={handler=>{tourCancelRef.current=handler;}} registerText={handler=>{tourTextRef.current=handler;}} onCampus={campus=>setPrefs(current=>({...current,campus}))}
      onReadRoute={route=>{const task:TaskRecord={...newTask(freshUuid(),freshUuid()),lane:'chat',prompt:'路线讲解',mode:'campus_qa',campus:prefs.campus,poiId:null,generation:null};void playTask(task,privateText(routeNarration(route)));}}
      onStop={async()=>{await stopListening();await cancelLane('chat');await cancelLane('generation');await speechControllerRef.current?.stop('user');}}
      onExplain={stop=>{void cancelLane('chat').then(()=>runTask('chat','请简短讲解'+stop.title+'，说明值得观察的细节；缺少资料时明确说明。','content_generation',{type:'guide_script',requirements:'只讲当前已确认到达站点；注明来源和进入条件。',length:'short',style:'friendly'},null,null,stop.poi_id));}}
      caption={asrBusy?'正在聆听…':speechProgress?.status==='speaking'?'正在播报当前讲解':notice}
      narration={[...chatTasks].reverse().find(t=>t.campus===prefs.campus)?.answer??''}
      voice={<><button onClick={()=>asrBusy?void stopListening():void startListening()}>{asrBusy?'停止识别':'语音输入'}</button><select aria-label="识别后的发送方式" value={voiceSend} onChange={e=>setVoiceSend(e.target.value as 'confirm'|'auto')}><option value="confirm">识别后确认发送</option><option value="auto">说完自动发送</option></select><button onClick={()=>void enableSpeech()}>开启中文播报</button><button onClick={()=>void speechControllerRef.current?.stop('user')}>停止播报</button><label className="tour-speech-input">对导游说<textarea value={chatInput} rows={2} maxLength={8000} onChange={e=>setChatInput(e.target.value)} onCompositionStart={()=>{composingRef.current=true;}} onCompositionEnd={()=>{composingRef.current=false;}} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.nativeEvent.isComposing&&!composingRef.current){e.preventDefault();void submitTourText(chatInput);}}}/></label><button disabled={laneBusy.chat||!chatInput.trim()} onClick={()=>void submitTourText(chatInput)}>确认发送</button>{laneBusy.chat&&<button onClick={()=>void cancelLane('chat')}>取消回答</button>}</>}/>}
    <div className={tourMode?'legacy-workspace hidden-for-tour':'legacy-workspace'}>
    <nav className="mobile-switch" aria-label="小屏视图"><button className={mobileView === 'guide' ? 'active' : ''} onClick={() => setMobileView('guide')}>地图与导览</button><button className={mobileView === 'work' ? 'active' : ''} onClick={() => setMobileView('work')}>对话与生成</button></nav>
    <main className="workspace r2-workspace" data-mobile-view={mobileView} style={{ '--panel-width': `${prefs.panelWidth}px` } as CSSProperties}>
      <section className="guide-stage"><CampusBackdrop campus={prefs.campus} assets={campusAssets}><div className="avatar-stage"><div className="campus-stamp"><span>AI4TJU</span><strong>{CAMPUS_NAMES[prefs.campus]}</strong></div><div className="avatar-host" style={{ transform: `scale(${prefs.avatarScale})` }}/>{!avatarReady && <div className="avatar-fallback"><span className="fallback-monogram">珂</span><strong>{avatarMessage}</strong><p>不会使用替代人物冒充已有形象</p></div>}<div className={`avatar-state ${avatarState}`}><i/><div><small>珂莱塔</small><strong>{AVATAR_LABELS[avatarState]}</strong></div></div></div></CampusBackdrop>
        <div className="campus-bar"><div><span>当前浏览</span><strong>{CAMPUS_NAMES[prefs.campus]}</strong></div><div role="group" aria-label="选择浏览校区">{(Object.keys(CAMPUS_NAMES) as CampusId[]).map((campus) => <button key={campus} className={prefs.campus === campus ? 'active' : ''} onClick={() => setPrefs((current) => ({ ...current, campus }))}>{CAMPUS_NAMES[campus]}</button>)}</div></div>
        {!tourMode&&<CampusExplorer campus={prefs.campus} sessionId={currentSession('chat')} focusPoiId={focusPoiId} focusRevision={focusRevision} onSelect={onSelectPoi} onAssets={onCampusAssets} onReadRoute={(route) => { const requestId = freshUuid(); const task: TaskRecord = { ...newTask(requestId, freshUuid()), lane: 'chat', prompt: '路线讲解', mode: 'campus_qa', campus: prefs.campus, poiId: selectedPoiRef.current?.id ?? null, generation: null }; void playTask(task,privateText(routeNarration(route))); }} onAsk={(prompt, poi) => { selectedPoiRef.current = poi; setWorkView('chat'); setMobileView('work'); setChatInput(prompt); }}/>}
      </section>
      <div className="panel-resizer" role="separator" aria-label="调整对话面板宽度" onPointerDown={resizeStart}/>
      <section className="work-panel"><div className="work-tabs" role="tablist"><button role="tab" aria-selected={workView === 'chat'} onClick={() => setWorkView('chat')}>校园对话</button><button role="tab" aria-selected={workView === 'generation'} onClick={() => setWorkView('generation')}>内容生成</button></div>
        {workView === 'chat' ? <><div className="chat-toolbar"><div><button className={chatMode === 'campus_qa' ? 'active' : ''} onClick={() => setChatMode('campus_qa')}>校园问答</button><button className={chatMode === 'general_chat' ? 'active' : ''} onClick={() => setChatMode('general_chat')}>普通聊天</button></div><button onClick={clearChat}>清空本校区对话</button></div><div className="task-scroll chat-history" ref={messageListRef} onScroll={onMessageScroll}>{chatTasks.filter((task) => task.campus === prefs.campus).length === 0 && <div className="work-empty"><strong>从校园问题开始</strong><p>流式正文会写入同一条消息；向上阅读时不会强制跳回底部。</p></div>}{chatTasks.filter((task) => task.campus === prefs.campus).map((task) => <TaskCard key={task.requestId} task={task} currentCampus={prefs.campus} canStop={laneBusy.chat && requestRef.current.chat === task.requestId} onStop={() => void cancelLane('chat')} onRetry={() => retryTask(task)} onLogs={() => showLogs(task.requestId)} onCopy={() => copyTask(task)} onExport={() => undefined} onRead={(text, id) => void playTask(task, text, id)} onReadFull={() => void playTask(task, task.answer)} onContinue={() => setChatInput(`请基于刚才的回答展开讲讲：${task.prompt}`)} onMap={() => { setFocusPoiId(task.poiId); setFocusRevision(value=>value+1); setMobileView('guide'); }}/>)}</div>{showLatest && <button className="latest-button" onClick={goLatest}>回到最新</button>}<div className="composer-area"><label>识别后的发送方式<select value={voiceSend} onChange={e=>setVoiceSend(e.target.value as 'confirm'|'auto')}><option value="confirm">识别后确认发送</option><option value="auto">说完自动发送</option></select></label>{selectedPoi && <div className="context-chip">当前点位：{selectedPoi.name}<button onClick={() => onSelectPoi(null)}>×</button></div>}<textarea value={chatInput} maxLength={8000} rows={3} placeholder="输入校园问题…" onChange={(event) => { setChatInput(event.target.value); setChatValidation(''); }} onCompositionStart={() => { composingRef.current = true; }} onCompositionEnd={() => { composingRef.current = false; }} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && !composingRef.current) { event.preventDefault(); void runTask('chat', chatInput, chatMode, null); } }}/>{chatValidation && <p className="field-error">{chatValidation}</p>}<div><span>{chatInput.length}/8000 · Enter 发送</span><span className="composer-actions"><button onClick={() => asrBusy ? void stopListening() : void startListening()}>{asrBusy ? '停止识别' : '语音输入'}</button><button aria-disabled={laneBusy.chat} title={laneBusy.chat ? '当前对话仍在执行，请先停止' : !chatInput.trim() ? '请输入问题后发送' : undefined} onClick={() => void runTask('chat', chatInput, chatMode, null)}>{laneBusy.chat ? '对话执行中' : '发送'}</button></span></div></div></> : <><div className="generation-form"><label>内容类型<select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value as GenerationOptions['type'] })}><option value="guide_script">导游讲解词</option><option value="visit_plan">参观计划</option><option value="social_post">校园社交文案</option></select></label><div className="form-row"><label>篇幅<select value={draft.length} onChange={(event) => setDraft({ ...draft, length: event.target.value as GenerationOptions['length'] })}><option value="short">简短</option><option value="medium">适中</option><option value="long">详细</option></select></label><label>风格<select value={draft.style} onChange={(event) => setDraft({ ...draft, style: event.target.value as GenerationOptions['style'] })}><option value="friendly">亲切</option><option value="formal">正式</option><option value="lively">活泼</option></select></label></div><label>生成主题<textarea value={draft.prompt} maxLength={8000} rows={3} onChange={(event) => { setDraft({ ...draft, prompt: event.target.value }); setGenerationValidation(''); }} placeholder="例如：为新生写一段北洋园图书馆导览词"/></label><label>补充要求<textarea value={draft.requirements} maxLength={2000} rows={2} onChange={(event) => setDraft({ ...draft, requirements: event.target.value })} placeholder="选填：受众、重点、避免内容…"/></label>{generationValidation && <p className="field-error">{generationValidation}</p>}<button className="generate-button" aria-disabled={laneBusy.generation} title={laneBusy.generation ? '已有生成任务执行中，请先停止' : !draft.prompt.trim() ? '请先填写生成主题' : undefined} onClick={submitGeneration}>{laneBusy.generation ? '生成任务执行中' : '开始生成'}</button></div><div className="task-scroll generation-results">{generationTasks.filter((task) => task.campus === prefs.campus).length === 0 && <div className="work-empty"><strong>生成结果会出现在这里</strong><p>每次生成使用独立 request_id；空正文、断流与取消不会显示成功。</p></div>}{generationTasks.filter((task) => task.campus === prefs.campus).map((task) => <TaskCard key={task.requestId} task={task} currentCampus={prefs.campus} canStop={laneBusy.generation && requestRef.current.generation === task.requestId} onStop={() => void cancelLane('generation')} onRetry={() => retryTask(task)} onLogs={() => showLogs(task.requestId)} onCopy={() => copyTask(task)} onExport={() => exportTask(task)} onRead={(text, id) => void playTask(task, text, id)} onReadFull={() => void playTask(task, task.answer)} onContinue={() => void runTask('generation', '请针对以下已生成稿件展开讲讲，保留有依据的事实和限制。主题：' + task.prompt.slice(0,500) + '\n稿件：' + task.answer.slice(0,6500), 'content_generation', task.generation, task.requestId, null, task.poiId)} onMap={() => { setFocusPoiId(task.poiId); setFocusRevision(value=>value+1); setMobileView('guide'); }}/>)}</div></>}
        {notice && <p className="global-notice" role="status">{notice}</p>}
      </section>
    </main>
    </div>
    <div className={`drawer-backdrop ${logsOpen ? 'open' : ''}`} onClick={() => setLogsOpen(false)}/><aside className={`log-drawer ${logsOpen ? 'open' : ''}`} inert={!logsOpen} aria-hidden={!logsOpen}><header><div><strong>{logRequest ? `请求 ${logRequest.slice(0, 8)} 的日志` : '当前会话日志'}</strong><span>仅显示服务返回的真实事件</span></div><button onClick={() => setLogsOpen(false)}>关闭</button></header><div className="drawer-tools"><button disabled={!shownEvents.length} onClick={() => { const blob = new Blob([sanitizedLogExport(shownEvents)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'ai4tju-runtime-events.json'; anchor.click(); URL.revokeObjectURL(url); }}>脱敏导出</button></div><div className="log-list">{shownEvents.length === 0 ? <p>尚无实际运行事件。</p> : shownEvents.map((event) => <article key={`${event.origin}:${event.event_id}`}><i className={event.status}/><div><strong>{event.origin === 'backend' ? '后端' : '浏览器'} · {event.stage}</strong><span>{event.status} · {event.duration_ms == null ? '耗时未返回' : `${Math.round(event.duration_ms)} ms`}</span><time>{new Date(event.timestamp).toLocaleTimeString('zh-CN', { hour12: false })}</time></div></article>)}</div></aside>
  </div>;
}
