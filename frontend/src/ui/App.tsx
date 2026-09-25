import {ReconstructionPanel} from './ReconstructionPanel';
import {isCompoundIntent,isReconstructionIntent,startReconstructionTask} from '../transport/reconstruction';
import {createDeviceExecutor,type DeviceRequest,type DeviceResult} from '../device/a-device';
import {HarnessClient,observed,failed,waitObserved,downloadHarness} from '../transport/harness';
import type {ToolRequest,ToolResult} from '../../../shared/harness';
import { TourWorkspace, type TourMemory } from './TourWorkspace';
import { privateText, speechEventCurrent } from './tour-model';
import type { SpeechInteractionController, SpeechInteractionContext } from '../../../shared/r3-speech';
import type { SpeechInteractionEvent } from '../../../shared/r3';
import { createSpeechInteractionController } from '../speech/interaction';
import { connectSpeechInteraction } from '../transport/r3-speech';
import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { ApiError, AvatarAdapter, AvatarState, CampusId, ChatResponse, Health, Mode, RuntimeEvent, Source, SpeechAdapter, Voice } from '../../../shared/contracts';
import { NarrationSession, type NarrationSnapshot } from './narration-session';
import { GuidePresentation } from './GuidePresentation';
import { introductionIntent,mentionedPois } from './introduction';
import {ChatComposer,type ChatComposerHandle} from './ChatComposer';
import {presentationText} from '../../../shared/presentation-text';
import {poiIntroduction} from './poi-introduction';
import type { CampusAssets, GenerationOptions, POI, SpeechController, SpeechProgress, SpeechRun, StreamEvent } from '../../../shared/r2';
import { createAvatarAdapter } from '../avatar/adapter';
import { createSpeechController, SPEECH_ERROR_MESSAGES } from '../speech/controller';
import { MandarinRecorder } from '../speech/recorder';
import { transport } from '../transport/api';
import { createSseParser, r2Transport } from '../transport/r2';
import { routeNarration } from '../transport/amap-navigation';
import { freshUuid, mergeRuntimeEvents, safeSourceUrl, sanitizedLogExport } from './model';
import { applyStreamEvent, consumeR2Stream, exportGeneratedText, newTask, readableParagraphs, shouldFollowLatest, StreamTaskError, type GenerationDraft, type StreamTaskView, validateGenerationDraft, responseWithDeadline } from './r2-model';
import './theme.css';
import './style.css';
import './guide-presentation.css';

type Lane = 'chat' | 'generation';
type WorkView = 'chat' | 'generation';
type MobileView = 'guide' | 'work';
type SpeechMode = 'off' | 'brief' | 'full';
interface TaskRecord extends StreamTaskView {
  lane: Lane; prompt: string; mode: Mode; campus: CampusId; poiId: string | null; generation: GenerationOptions | null;
  queryStatus?:string;
  localKind?:'introduction'|'clarification'|'control';
}
interface Preferences { campus: CampusId; avatarScale: number; panelWidth: number; speechMode: SpeechMode }

const CAMPUS_NAMES: Record<CampusId, string> = { weijinlu: '卫津路校区', beiyangyuan: '北洋园校区' };
const PHASE_LABELS: Record<StreamTaskView['phase'], string> = { pending: '待开始', running: '执行中', has_content: '正在接收', complete: '已完成', error: '失败', cancelled: '已取消' };
const STAGE_LABELS: Record<string, string> = { request: '请求已受理', knowledge: '检索中', model: '模型生成中', generation: '内容生成中' };
const AVATAR_LABELS: Record<AvatarState, string> = { idle: '随时为你导览', listening: '正在听你说', thinking: '正在回答', speaking: '正在播报', error: '暂时无法响应' };
const WEATHER_LABELS: Record<number, string> = {0:'晴',1:'少云',2:'多云',3:'阴',45:'雾',48:'雾凇',51:'毛毛雨',53:'毛毛雨',55:'毛毛雨',56:'冻毛毛雨',57:'冻毛毛雨',61:'小雨',63:'中雨',65:'大雨',66:'冻雨',67:'冻雨',71:'小雪',73:'中雪',75:'大雪',77:'雪粒',80:'阵雨',81:'阵雨',82:'强阵雨',85:'阵雪',86:'阵雪',95:'雷阵雨',96:'雷暴',99:'雷暴'};
function weatherLabel(code: number | undefined): string { return WEATHER_LABELS[code ?? -1] ?? '天气'; }

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
  const paragraphs = readableParagraphs(presentationText(text));
  return <div className="rich-text">{paragraphs.map((paragraph, index) => <div className="readable-paragraph" key={index}><div>{paragraph.split('\n').map((line, lineIndex) => <p key={lineIndex}>{safeInline(line)}</p>)}</div>{onReadParagraph && paragraph.trim() && <button aria-label={`朗读第 ${index + 1} 段`} onClick={() => onReadParagraph(paragraph, index)}>读这一段</button>}</div>)}</div>;
}

function SourceDetails({ sources, final }: { sources: Source[]; final: boolean }) {
  if (!sources.length) return null;
  return <details className="task-sources"><summary>{final ? '资料来源' : '资料来源'} {sources.length} 条</summary><ol>{sources.map((source, index) => { const href = safeSourceUrl(source.url); return <li key={source.id}><span>[{index + 1}]</span><div><strong>{source.title}</strong><p>{source.snippet}</p>{href && <a href={href} target="_blank" rel="noreferrer">打开资料</a>}</div></li>; })}</ol></details>;
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
  const [waited,setWaited]=useState(false);
  useEffect(()=>{setWaited(false);const timer=setTimeout(()=>setWaited(true),8000);return()=>clearTimeout(timer);},[task.requestId]);
  const hasText = Boolean(task.answer.trim()); const sameCampus = task.campus === currentCampus;
  const shortReply=task.localKind==='control'||task.localKind==='clarification';
  return <article className={`task-card ${task.phase}`} data-task-id={task.requestId}><header><div><TaskStatus task={task}/><span className="task-campus">{CAMPUS_NAMES[task.campus]}</span></div></header>
    <div className="task-prompt"><span>{task.lane === 'generation' ? '生成主题' : '你'}</span><p>{task.prompt}</p></div>
    {(task.phase === 'pending' || (task.phase === 'running' && !hasText)) && <div className="stream-wait"><span/><p>{task.phase === 'pending' ? '正在提交请求…' : '海小棠正在回答，你可以继续输入或停止等待。'}</p></div>}
    {waited&&!hasText&&canStop&&task.sources.length>0&&<aside className="query-preview"><p>回答仍在生成，可以随时停止。</p>{task.sources.slice(0,2).map(source=><p key={source.id}>{source.snippet} <small>——{source.title}</small></p>)}</aside>}
    {hasText && <div className={`task-body ${expanded ? '' : 'collapsed'}`}><RichText text={task.answer} onReadParagraph={shortReply?undefined:(text, index) => onRead(text, `${task.messageId}-p${index}`)}/></div>}
    {task.phase === 'error' && <div className="task-error" role="alert"><strong>{task.partial && hasText ? '输出未完整结束' : '本次操作失败'}</strong><p>{task.errorMessage}</p><button onClick={onLogs}>查看相关日志</button></div>}
    {task.phase === 'cancelled' && <p className="task-cancelled">已停止这次回答，可以继续提问。</p>}
    <SourceDetails sources={task.sources} final={task.phase === 'complete'}/>
    {!task.localKind&&<details className="task-technical"><summary>技术详情</summary><code>{task.requestId}</code><p>{task.errorCode}</p>{hasText && <div className="task-meta"><span>{task.model ?? '模型未返回'}</span><span>{task.elapsedMs == null ? '耗时未返回' : `${Math.round(task.elapsedMs)} ms`}</span><span>{task.usage ? `${task.usage.total_tokens} tokens` : '用量未返回'}</span></div>}</details>}
    {!shortReply&&<footer>{canStop && <button className="danger" onClick={onStop}>停止回答</button>}{(task.phase === 'error' || task.phase === 'cancelled') && <button onClick={onRetry}>新请求重试</button>}{hasText && <><button onClick={() => setExpanded((value) => !value)}>{expanded ? '收起正文' : '展开正文'}</button><button onClick={onCopy}>复制</button>{task.lane === 'generation' && <button onClick={onExport}>导出文本</button>}<button onClick={onReadFull}>读全文</button></>}{task.phase === 'complete' && <button onClick={onContinue}>展开讲讲</button>}{task.phase === 'complete' && sameCampus && task.poiId && <button onClick={onMap}>在地图查看</button>}</footer>}
    {task.relatedRequestId && <small className="retry-link">此结果来自一次重新请求</small>}
  </article>;
}

const MemoTaskCard=memo(TaskCard,(a,b)=>a.task===b.task&&a.currentCampus===b.currentCampus&&a.canStop===b.canStop);

export function App() {
  const [prefs, setPrefs] = useState(readPreferences); const [health, setHealth] = useState<Health | null>(null); const [serviceError, setServiceError] = useState(false);
  const tourTextRef=useRef<((text:string)=>Promise<boolean>)|null>(null);
  const harnessClient=useRef(new HarnessClient());
  const harnessDeviceId=useRef(freshUuid());
  const selectedUpload=useRef<Partial<Record<CampusId,string>>>({});
  const deviceExecutor=useRef<ReturnType<typeof createDeviceExecutor>|null>(null);
  const normalizeDevice=(value:DeviceResult):ToolResult=>({...value,error:value.error?{code:value.error.code,message:value.error.message}:null});
  function ensureDevice(){
    if(!deviceExecutor.current)deviceExecutor.current=createDeviceExecutor({speechAdapter:asrRef.current??undefined,getSession:()=>harnessClient.current.context?{...harnessClient.current.context,deviceId:harnessDeviceId.current,expiresAt:new Date(Date.now()+60000).toISOString(),connected:true}:null,upload:(file,ctx)=>harnessClient.current.upload(file,ctx.request as ToolRequest,ctx.signal)});
    return deviceExecutor.current;
  }
  async function resumeDevice(result:ToolResult,token:string,event:Event){
    const request=result.data?.continuation as ToolRequest|undefined;if(!request)return;
    const value=normalizeDevice(await ensureDevice().resume_tool(String(result.data?.pendingAction.actionId),request as DeviceRequest,event));
    if(request.context.generation!==harnessClient.current.context?.generation)return;
    const ack=await fetch(`/api/harness/runs/${request.runId}/continuation-ack`,{method:'POST',headers:{'Content-Type':'application/json','X-Harness-Token':token},body:JSON.stringify({context:request.context,result:value})});
    if(!ack.ok){setHarnessText('操作回执已过期，未更新当前任务。');return;}
    if(value.status==='completed'&&typeof value.data?.uploadId==='string')selectedUpload.current[request.context.campusId]=value.data.uploadId;
    setHarnessResults(items=>items.filter(x=>x.result.toolCallId!==result.toolCallId));
    setHarnessText(value.status==='completed'?(value.data?.uploadId?'文档已选定，可以询问其中内容。':'设备接口已返回，实际发送或目标操作未作保证。'):value.status==='cancelled'?'设备操作已取消。':value.error?.message??'设备操作未完成');
  }

  const [harnessBusy,setHarnessBusy]=useState(false),[harnessText,setHarnessText]=useState('');
  const [harnessResults,setHarnessResults]=useState<Array<{result:ToolResult;token:string}>>([]);
  const harnessEpoch=useRef(0),harnessExecuting=useRef(false);
  const harnessRoute=useRef<((poiId:string,signal:AbortSignal,deadline:string)=>Promise<Record<string,unknown>>)|null>(null);
  async function cancelHarness(){++harnessEpoch.current;setHarnessBusy(false);deviceExecutor.current?.disconnect();deviceExecutor.current=null;harnessClient.current.context=null;setHarnessResults([]);await harnessClient.current.cancel();}
  async function executeHarness(request:ToolRequest,signal:AbortSignal):Promise<ToolResult>{
    try{
      if(request.context.campusId!==campusRef.current||signal.aborted)throw Error('任务已经失效');
      harnessExecuting.current=true;
      signal.addEventListener('abort',()=>{if(request.toolName==='narration_control')void narratorRef.current?.stop();},{once:true});
      const id=String(request.input.poiId??selectedPoiRef.current?.id??'');
      if(request.toolName==='poi_select'){
        const poi=await r2Transport.poi(id);if(signal.aborted)throw Error('已取消');onSelectPoi(poi);mapFocusRef.current?.(id);
        await waitObserved(()=>selectedPoiRef.current?.id===id&&!!document.querySelector(`[data-poi-id="${CSS.escape(id)}"]`),signal,request.deadlineAt);
        return observed(request,{poiId:id,cardApplied:true,mapSelection:'仅在现有匹配 marker 可用时同步'});
      }
      if(request.toolName==='route_plan'){
        if(!harnessRoute.current)throw Error('地图入口尚未就绪');
        return observed(request,await harnessRoute.current(id,signal,request.deadlineAt),'map_applied');
      }
      if(request.toolName==='narration_control'){
        const action=request.input.action;
        if(action==='start'){
          const poi=await r2Transport.poi(id);if(signal.aborted)throw Error('已取消');await startIntroduction(poi);
        }else if(action==='pause')await narratorRef.current?.pause();
        else if(action==='resume')await narratorRef.current?.resume();
        else await narratorRef.current?.stop();
        const status=action==='start'||action==='resume'?'playing':action==='pause'?'paused':'stopped';
        await waitObserved(()=>narrationSnapshotRef.current?.status===status&&(status==='stopped'||narrationSnapshotRef.current?.poi.id===id),signal,request.deadlineAt);
        return observed(request,{poiId:narrationSnapshotRef.current?.poi.id,status},'media_event');
      }
      if(request.toolName.startsWith('device_')||request.toolName==='speech_input')return normalizeDevice(await ensureDevice().execute_tool(request as DeviceRequest));
      throw Error('客户端工具尚未接入');
    }catch(e){return failed(request,e);}finally{harnessExecuting.current=false;}
  }
  async function runHarness(message:string,direct?:{toolName:string;input:Record<string,unknown>},sessionId?:string){
    deviceExecutor.current?.disconnect();deviceExecutor.current=null;setPanelOpen(true);const epoch=++harnessEpoch.current;setHarnessBusy(true);setHarnessText('正在处理…');setHarnessResults([]);
    harnessClient.current.onContext=context=>{harnessClient.current.deviceCapabilities=ensureDevice().list_capabilities(context as Parameters<ReturnType<typeof createDeviceExecutor>['list_capabilities']>[0]);};
    try{await harnessClient.current.run({deviceId:harnessDeviceId.current,uploadId:selectedUpload.current[campusRef.current]??null,sessionId:sessionId??currentSession('chat'),campusId:campusRef.current,channel:'harness',tourId:tourMemoryRef.current[campusRef.current]?.session?.tour_id??null,tourSessionId:tourMemoryRef.current[campusRef.current]?.session?.session_id??null,poiId:selectedPoiRef.current?.id??null},message,direct,(event,token)=>{
      if(epoch!==harnessEpoch.current)return;
      if(event.text)setHarnessText(event.text);
      if(event.result)setHarnessResults(items=>[...items,{result:event.result!,token}]);
    },executeHarness);}catch(e){if(epoch===harnessEpoch.current)setHarnessText(e instanceof Error?e.message:'工具请求未完成');}
    finally{if(epoch===harnessEpoch.current)setHarnessBusy(false);}
  }

  const tourMemoryRef=useRef<Partial<Record<CampusId,TourMemory>>>({});const mapFocusRef=useRef<((poiId:string|null)=>void)|null>(null);const tourCancelRef=useRef<(()=>void)|null>(null);
  const [voiceSend,setVoiceSend]=useState<'confirm'|'auto'>('confirm');
  const interactionRef=useRef<SpeechInteractionController|null>(null); const interactionContext=useRef<SpeechInteractionContext|null>(null); const voiceSendRef=useRef(voiceSend); voiceSendRef.current=voiceSend;
  const [workView, setWorkView] = useState<WorkView>('chat');
  const composerRef=useRef<ChatComposerHandle|null>(null),composerDraft=useRef('');
  const setChatInput=(text:string)=>composerRef.current?.setText(text); const [chatValidation, setChatValidation] = useState(''); const [draft, setDraft] = useState(DEFAULT_DRAFT); const [generationValidation, setGenerationValidation] = useState('');
  const [chatTasks, setChatTasks] = useState<TaskRecord[]>([]); const [generationTasks, setGenerationTasks] = useState<TaskRecord[]>([]); const [events, setEvents] = useState<RuntimeEvent[]>([]); const [logsOpen, setLogsOpen] = useState(false); const [logRequest, setLogRequest] = useState<string | null>(null); const [notice, setNotice] = useState('');
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null); const [focusPoiId, setFocusPoiId] = useState<string | null>(null); const [focusRevision,setFocusRevision]=useState(0); const [campusAssets, setCampusAssets] = useState<CampusAssets | null>(null);
  const [avatarState, setAvatarState] = useState<AvatarState>('idle'); const [avatarReady, setAvatarReady] = useState(false); const [avatarMessage, setAvatarMessage] = useState('正在连接人物渲染器…');
  const [speechEnabled, setSpeechEnabled] = useState(false); const [speechProgress, setSpeechProgress] = useState<SpeechProgress | null>(null); const [voices, setVoices] = useState<Voice[]>([]); const [voiceId, setVoiceId] = useState('');
  const [asrBusy, setAsrBusy] = useState(false);
  const recorderRef=useRef<MandarinRecorder|null>(null);
  const [recordingState,setRecordingState]=useState('');
  useEffect(()=>{recorderRef.current=new MandarinRecorder(state=>{setRecordingState(state);setAsrBusy(state.startsWith('正在'));},text=>{setChatInput(text);if(voiceSendRef.current==='auto')void submitTextRef.current(text);});return()=>recorderRef.current?.cancel();},[]);
  const [laneBusy, setLaneBusy] = useState<Record<Lane, boolean>>({ chat: false, generation: false });
  const [showLatest, setShowLatest] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const narratorRef=useRef<NarrationSession|null>(null);
  const [narrationSession,setNarrationSession]=useState<NarrationSnapshot|null>(null);
  const narrationSnapshotRef=useRef(narrationSession);narrationSnapshotRef.current=narrationSession;
  const catalogRef=useRef<Promise<POI[]>|null>(null);
  const conversationPoi=useRef<POI|null>(null),conversationEstablished=useRef(false);
  const introductionTask=useRef<{id:string;poiId:string}|null>(null);
  const [dialogContext,setDialogContext]=useState<POI|null>(null);
  const pendingIntroduction=useRef<{poi:POI;topic:string}|null>(null);
  const [introCandidates,setIntroCandidates]=useState<POI[]>([]);
  const submitEpoch=useRef(0);
  const submitTextRef=useRef<(text:string)=>Promise<void>>(async()=>{});submitTextRef.current=submitTourText;

  const [narrationText,setNarrationText]=useState('');
  const [now, setNow] = useState(() => new Date());
  const [weather, setWeather] = useState<{ temp: number; label: string } | null>(null);
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 30000); return () => window.clearInterval(timer); }, []);
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=39.109&longitude=117.157&current=temperature_2m,weather_code&timezone=Asia%2FShanghai');
        if (!response.ok) return;
        const data = await response.json();
        const temp = Math.round(data?.current?.temperature_2m);
        if (active && Number.isFinite(temp)) setWeather({ temp, label: weatherLabel(data?.current?.weather_code) });
      } catch { /* Weather is decorative; failures keep the fallback. */ }
    };
    void load();
    const timer = window.setInterval(load, 900000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);
  useEffect(() => {
    let downX = 0, downY = 0;
    const onDown = (event: PointerEvent) => { downX = event.clientX; downY = event.clientY; };
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const onAvatar = Boolean(target?.closest?.('[data-avatar-hit],.guide-character'));
      if (!onAvatar) return;
      if (Math.hypot(event.clientX - downX, event.clientY - downY) > 6) return;
      setPanelOpen((value) => !value);
    };
    document.addEventListener('pointerdown', onDown, true);
    document.addEventListener('click', onClick, true);
    return () => { document.removeEventListener('pointerdown', onDown, true); document.removeEventListener('click', onClick, true); };
  }, []);
  const avatarHostRef = useRef<HTMLDivElement>(null); const avatarRef = useRef<AvatarAdapter | null>(null); const asrRef = useRef<SpeechAdapter | null>(null); const speechControllerRef = useRef<SpeechController | null>(null);
  const sessionsRef = useRef<Record<Lane, Record<CampusId, string>>>({ chat: { weijinlu: freshUuid(), beiyangyuan: freshUuid() }, generation: { weijinlu: freshUuid(), beiyangyuan: freshUuid() } });
  const laneAbortRef = useRef<Record<Lane, AbortController | null>>({ chat: null, generation: null }); const laneGenerationRef = useRef<Record<Lane, number>>({ chat: 0, generation: 0 }); const runningRef = useRef<Record<Lane, boolean>>({ chat: false, generation: false }); const requestRef = useRef<Record<Lane, string | null>>({ chat: null, generation: null });
  const requestSessionRef=useRef<Record<Lane,string|null>>({chat:null,generation:null});
  const messageListRef = useRef<HTMLDivElement>(null); const autoFollowRef = useRef(true); const previousCampusRef = useRef(prefs.campus); const campusRef = useRef(prefs.campus);
  const speechProgressRef = useRef<SpeechProgress | null>(null); const renderReceiptsRef = useRef(new Set<string>());
  const selectedPoiRef = useRef<POI | null>(null); const speechRunRequestRef = useRef<string | null>(null);
  const asrAbortRef = useRef<AbortController | null>(null); const asrGenerationRef = useRef(0); const asrRequestRef = useRef<string | null>(null);
  const playbackEpoch=useRef(0);
  const onSelectPoi = useCallback((poi: POI | null) => {
    if(selectedPoiRef.current?.id!==poi?.id){if(!harnessExecuting.current)void cancelHarness();void narratorRef.current?.stop(true);playbackEpoch.current++;void speechControllerRef.current?.stop('new_request');lastSpeechRunRef.current=null;void cancelLane('chat');void cancelLane('generation');setAvatarState('idle');}
    selectedPoiRef.current = poi; setSelectedPoi(poi);setNarrationText(poi?.description??'');
  }, []);
  const onRouteChange=useCallback(()=>{void narratorRef.current?.stop(true);setNarrationText('');playbackEpoch.current++;lastSpeechRunRef.current=null;void speechControllerRef.current?.stop('new_request');setAvatarState('idle');},[]); const onCampusAssets = useCallback((assets: CampusAssets | null) => setCampusAssets(assets), []);

  useEffect(()=>()=>{void cancelHarness();},[prefs.campus]);
  useEffect(() => { try { localStorage.setItem('ai4tju.r2.preferences', JSON.stringify(prefs)); } catch { /* Preferences remain in memory. */ } }, [prefs]);
  campusRef.current=prefs.campus;
  useEffect(() => {
    let active = true; const avatar = createAvatarAdapter(); const controller = createSpeechController(); const asr = controller.getAdapter(); avatarRef.current = avatar; asrRef.current = asr; speechControllerRef.current = controller;
    narratorRef.current=new NarrationSession(controller,value=>{
      narrationSnapshotRef.current=value;setNarrationSession(value);
      const task=introductionTask.current;
      if(value?.text&&task?.poiId===value.poi.id)setChatTasks(items=>items.some(t=>t.requestId===task.id&&t.answer!==value.text)?items.map(t=>t.requestId===task.id?{...t,answer:value.text}:t):items);
    });
    interactionRef.current=connectSpeechInteraction(()=>createSpeechInteractionController({speechController:controller}),controller);
    const unsubscribeLevel=controller.getAdapter().subscribeAudioLevel(level=>avatar.setAudioLevel?.(level));
    void transport.health().then((value) => { if (active) { setHealth(value); setServiceError(false); } }).catch(() => { if (active) setServiceError(true); });
    if (avatarHostRef.current) void avatar.mount(avatarHostRef.current).then((result) => { if (active) { setAvatarReady(result.status === 'ready'); setAvatarMessage(result.status === 'ready' ? '人物已就位' : result.status === 'failed' ? '人物渲染失败' : '人物渲染尚未接入'); } });
    const unsubscribe = controller.subscribe((progress) => { if (!active) return; speechProgressRef.current = progress; setSpeechProgress(progress); if (progress.status === 'error') setNotice(SPEECH_ERROR_MESSAGES[progress.code??'']??'声音暂未播放，请点击继续讲解或重新朗读。'); speechRunRequestRef.current = progress.status === 'idle' || progress.status === 'stopped' || progress.status === 'error' ? null : progress.request_id; if (progress.status === 'speaking') setAvatarState('speaking'); else if (!runningRef.current.chat && !runningRef.current.generation) setAvatarState(progress.status === 'error' ? 'error' : 'idle'); });
    return () => { active = false; laneAbortRef.current.chat?.abort(); laneAbortRef.current.generation?.abort(); asrAbortRef.current?.abort(); unsubscribe(); unsubscribeLevel(); narratorRef.current?.dispose();narratorRef.current=null;controller.dispose(); interactionContext.current=null;interactionRef.current?.dispose(); avatar.dispose(); if (asrRequestRef.current) void asr.stop(asrRequestRef.current); };
  }, []);
  useEffect(() => { avatarRef.current?.setState(avatarState); }, [avatarState]);
  useEffect(() => {
    if (previousCampusRef.current === prefs.campus) return; previousCampusRef.current = prefs.campus; setSelectedPoi(null); selectedPoiRef.current = null; setFocusPoiId(null); setCampusAssets(null); setNotice('已切换浏览校区；实际位置不会自动改变。');
    void (async()=>{await narratorRef.current?.stop(true);await stopListening();await cancelLane('chat','campus_change');await cancelLane('generation','campus_change');
      const pending=pendingIntroduction.current;if(pending?.poi.campus_id===campusRef.current){pendingIntroduction.current=null;await startIntroduction(pending.poi,pending.topic);}
    })();
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

  function focusMap(poiId:string|null){mapFocusRef.current?.(poiId);}
  function currentSession(lane: Lane, campus = prefs.campus) { return tourMemoryRef.current[campus]?.session?.session_id ?? sessionsRef.current[lane][campus]; }
  function setTasks(lane: Lane, update: (current: TaskRecord[]) => TaskRecord[]) { if (lane === 'chat') setChatTasks(items=>update(items).slice(-40)); else setGenerationTasks(items=>update(items).slice(-10)); }
  function setRunning(lane: Lane, value: boolean) { runningRef.current[lane] = value; setLaneBusy((current) => ({ ...current, [lane]: value })); }
  function isCurrent(lane: Lane, generation: number, requestId: string) { return laneGenerationRef.current[lane] === generation && requestRef.current[lane] === requestId; }
  function pollRuntime(requestId: string, lane: Lane, generation: number) {
    let cursor = 0; let stopped = false; let timer = 0; let pending = false;
    const poll = async () => { if (stopped || pending || !isCurrent(lane, generation, requestId)) return; pending = true; try { const page = await transport.events(requestId, cursor); if (isCurrent(lane, generation, requestId)) { cursor = page.next_cursor; if(page.events.length)setEvents((current) => mergeRuntimeEvents(current, page.events)); } } catch { /* SSE error card remains authoritative. */ } finally { pending = false; } };
    void poll(); timer = window.setInterval(() => void poll(), 1000); return async () => { window.clearInterval(timer); await poll(); stopped = true; };
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
    focusMap(event.payload.action.parameters.building_id);
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
    const campus = poi?.campus_id??prefs.campus; const requestId = freshUuid(requestRef.current[lane] ?? undefined); const messageId = freshUuid(); const controller = new AbortController(); const laneGeneration = ++laneGenerationRef.current[lane];
    requestSessionRef.current[lane]=currentSession(lane,campus); requestRef.current[lane] = requestId; laneAbortRef.current[lane] = controller; setRunning(lane, true); setAvatarState('thinking');
    const initial: TaskRecord = { ...newTask(requestId, messageId, relatedRequestId), lane, prompt: clean, mode, campus, poiId: poi?.campus_id === campus ? poi.id : poiIdOverride, generation: options };
    setTasks(lane, (current) => [...current, initial]); if (lane === 'chat') { setChatValidation(''); } else setGenerationValidation(''); setNotice('');
    const startedAt = Date.now(); let hardTimedOut = false; const hardDeadline = setTimeout(() => { hardTimedOut = true; controller.abort(); }, 45000); const finishPoll = pollRuntime(requestId, lane, laneGeneration); const speechGenerationId = freshUuid(); let speechStarted = false; let localTask = initial;
    let paintTimer:ReturnType<typeof setTimeout>|null=null;
    const paint=()=>{paintTimer=null;if(isCurrent(lane,laneGeneration,requestId)){const snapshot=localTask;setTasks(lane,current=>current.map(task=>task.requestId===requestId?snapshot:task));}};
    try {
      await stopListening(); await speechControllerRef.current?.stop('new_request');
      if (!isCurrent(lane, laneGeneration, requestId) || controller.signal.aborted) return;
      setAvatarState('thinking'); speechStarted = await beginSpeech(initial, speechGenerationId);
      if(!isCurrent(lane,laneGeneration,requestId)||controller.signal.aborted)return;
      const response = await responseWithDeadline(() => r2Transport.openStream({ request_id: requestId, session_id: currentSession(lane, campus), message_id: messageId, message: clean, mode, campus_id: campus, selected_building_id: initial.poiId, selected_poi_id: initial.poiId, generation: options }, controller.signal), controller);
      const completed = await consumeR2Stream(response, requestId, controller.signal, (event) => {
        if (!isCurrent(lane, laneGeneration, requestId)) return; localTask = { ...localTask, ...applyStreamEvent(localTask, event) };
        if(event.type==='status'&&event.payload.query_state)localTask.queryStatus=event.payload.query_state;
        if(event.type==='answer_delta'){if(!paintTimer)paintTimer=setTimeout(paint,80);}else{if(paintTimer)clearTimeout(paintTimer);paint();}
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
      if(paintTimer)clearTimeout(paintTimer);clearTimeout(hardDeadline); void finishPoll(); if (isCurrent(lane, laneGeneration, requestId)) { setRunning(lane, false); laneAbortRef.current[lane] = null; if (!runningRef.current.chat && !runningRef.current.generation && speechProgressRef.current?.status !== 'speaking') setAvatarState('idle'); void transport.health().then(setHealth).catch(() => undefined); }
    }
  }
  async function cancelLane(lane: Lane, reason: 'user' | 'campus_change' | 'clear' = 'user') {
    const requestId = requestRef.current[lane]; if (!requestId || !runningRef.current[lane]) return;
    const sessionId = requestSessionRef.current[lane];if(!sessionId)return; ++laneGenerationRef.current[lane]; laneAbortRef.current[lane]?.abort(); laneAbortRef.current[lane] = null; setRunning(lane, false);
    setTasks(lane, (current) => current.map((item) => item.requestId === requestId && item.phase !== 'complete' ? { ...item, phase: 'cancelled', errorCode: 'CANCELLED', errorMessage: '本次操作已取消。', finishedAt: Date.now() } : item));
    if (speechRunRequestRef.current === requestId) await speechControllerRef.current?.stop(reason === 'user' ? 'cancel' : reason);
    // Local stop must not wait on a potentially unavailable cancellation endpoint.
    void transport.cancel(requestId, sessionId).catch(()=>undefined);
    if (!runningRef.current.chat && !runningRef.current.generation) setAvatarState('idle');
  }
  async function enableSpeech() {
    const controller = speechControllerRef.current; if (!controller) return; const result = await controller.enable(true); if (result.status !== 'ready') { setNotice('语音导览尚未集成或服务不可用。'); return; }
    const available = await controller.listVoices(); const chinese = available.find((voice) => /^zh(?:-|_)/i.test(voice.locale)); setVoices(available); if (!chinese) { setNotice('未检测到中文音色，语音导览未开启。'); return; } setVoiceId(chinese.id); setSpeechEnabled(true); setPrefs((current) => ({ ...current, speechMode: current.speechMode === 'off' ? 'brief' : current.speechMode }));
  }
  async function playTask(task: TaskRecord, text: string, segmentId?: string) {
    void narratorRef.current?.stop(true);
    const speech=speechControllerRef.current;if(!speech||!text.trim())return;
    const epoch=playbackEpoch.current;
    // Unlock the existing player in this click, before network or cancellation awaits.
    const activation=speech.enable(true);setNotice('正在准备语音…');
    if((await activation).status!=='ready'){setNotice('浏览器未允许播放，请点击“再次播放声音”。');return;}
    let chosen=voiceId;
    if(!chosen){const available=await speech.listVoices();setVoices(available);chosen=available.find(v=>/^zh(?:-|_)/i.test(v.locale))?.id??'';}
    if(epoch!==playbackEpoch.current||task.campus!==campusRef.current)return;
    if(!chosen){setNotice('中文音色暂不可用，请检查语音服务后重试。');return;}
    setVoiceId(chosen);setSpeechEnabled(true);
    const generationId = freshUuid(); const controller = new AbortController(); const run: SpeechRun = { request_id: task.requestId, session_id: currentSession(task.lane, task.campus), campus_id: task.campus, generation_id: generationId, voice_id: chosen, mode: 'full', signal: controller.signal };
    await stopListening();if(epoch!==playbackEpoch.current||task.campus!==campusRef.current)return;setNarrationText(text);bindPlayback(run);
    const result = segmentId ? await speech.playSegment(run, text, segmentId) : await speech.playFull(run, text); if (result.status !== 'ready') setNotice('语音播放未能开始。');else setNotice('');
  }
  async function continueSpeech(){
    const previous=lastSpeechRunRef.current;
    if(!previous||previous.campus_id!==prefs.campus){setNotice('没有本校区可继续的内容。');return;}
    const run:SpeechRun={...previous,generation_id:freshUuid(),signal:new AbortController().signal};
    bindPlayback(run);
    const result=await speechControllerRef.current?.continueRemaining?.(run);
    if(result?.status!=='ready')setNotice('没有可继续的内容，请选择正文朗读。');
  }
  function loadDirectory():Promise<POI[]>{
    if(!catalogRef.current)catalogRef.current=Promise.all((['weijinlu','beiyangyuan'] as const).map(campus=>r2Transport.pois(campus,{limit:100}))).then(pages=>pages.flatMap(page=>page.items)).catch(error=>{catalogRef.current=null;throw error;});
    return catalogRef.current;
  }
  function rememberPoi(poi:POI|null){conversationEstablished.current=true;conversationPoi.current=poi;setDialogContext(poi);}
  function addDialog(prompt:string,answer:string,localKind:TaskRecord['localKind'],poi:POI|null=null){
    const id=freshUuid();setTasks('chat',items=>[...items,{...newTask(id,freshUuid()),lane:'chat',prompt,answer,phase:'complete',finishedAt:Date.now(),mode:'campus_qa',campus:poi?.campus_id??campusRef.current,poiId:poi?.id??null,generation:null,localKind}]);return id;
  }
  async function startIntroduction(poi:POI,topic=poi.name){
    setIntroCandidates([]);setNotice('');
    if(poi.campus_id!==campusRef.current){pendingIntroduction.current={poi,topic};setPrefs(current=>({...current,campus:poi.campus_id}));return;}
    const activation=speechControllerRef.current?.enable(true);
    onSelectPoi(poi);
    const epoch=++playbackEpoch.current;
    await Promise.all([cancelLane('chat'),cancelLane('generation'),stopListening(),activation]);
    if(epoch!==playbackEpoch.current||poi.id!==selectedPoiRef.current?.id)return;
    rememberPoi(poi);
    const prior=narrationSnapshotRef.current;
    if(!prior||prior.poi.id!==poi.id||['ended','stopped','error'].includes(prior.status))introductionTask.current={id:addDialog(topic===poi.name?'介绍一下'+poi.name:topic,poiIntroduction(poi),'introduction',poi),poiId:poi.id};
    setSpeechEnabled(true);setNarrationText(poiIntroduction(poi));
    await narratorRef.current?.start(poi,topic,currentSession('chat',poi.campus_id),voiceId);
  }
  async function recoverSpeech(){
    const active=narrationSnapshotRef.current;
    if(active&&!['ended','stopped'].includes(active.status)){await narratorRef.current?.resume();return;}
    const enabled=await speechControllerRef.current?.enable(true);
    if(enabled?.status==='ready')await speechControllerRef.current?.resume();
    else setNotice('请允许网页播放声音后重试。');
  }
  async function explainPoi(poi:POI){
    const active=narrationSnapshotRef.current;
    if(active?.poi.id===poi.id&&['playing','preparing','buffering'].includes(active.status)){await narratorRef.current?.pause();return;}
    if(active?.poi.id===poi.id&&['paused','error'].includes(active.status)){await narratorRef.current?.resume();return;}
    await startIntroduction(poi);
  }
  async function submitTourText(text:string){
    text=text.trim();if(!text)return;
    if(isReconstructionIntent(text)){try{await startReconstructionTask(text,campusRef.current);setNotice('建模任务已提交，请查看建筑建模面板的实际进度。');}catch(e){setNotice(e instanceof Error?e.message:'建模任务无法启动');}return;}
    if(isCompoundIntent(text)){setPanelOpen(true);await runHarness(text);return;}
    if(/文档|上传|分享|能做什么|天气.*(通知|出发)|官网.*天气/.test(text)){setPanelOpen(true);setChatInput('');await runHarness(text);return;}
    if(/导出.*(行程|安排)|(行程|安排).*导出/.test(text)){const tour=tourMemoryRef.current[campusRef.current]?.session;if(!tour){setNotice('请先创建参观行程。');return;}await runHarness(text,{toolName:'itinerary_export',input:{tourId:tour.tour_id,tourSessionId:tour.session_id,format:/json/i.test(text)?'json':'markdown'}},tour.session_id);return;}
    const epoch=++submitEpoch.current,pendingCandidates=introCandidates;
    pendingIntroduction.current=null;++playbackEpoch.current;
    setPanelOpen(true);setChatInput('');setNotice('');setIntroCandidates([]);
    await cancelLane('chat');
    let pois:POI[]=[];if(introductionIntent(text,[],null).kind!=='control')try{pois=await Promise.race([loadDirectory(),new Promise<POI[]>(resolve=>setTimeout(()=>resolve([]),1000))]);}catch{/* Server retrieval can answer even if the directory is unavailable. */}
    if(epoch!==submitEpoch.current)return;
    const context=conversationEstablished.current?conversationPoi.current:selectedPoiRef.current;
    const chosen=pendingCandidates.filter(p=>text.includes(p.name)||text.includes(CAMPUS_NAMES[p.campus_id].replace('校区','')));
    const intent=chosen.length===1?{kind:'introduce' as const,poi:chosen[0]}:introductionIntent(text,pois,context);
    if(intent.kind==='control'){
      if(intent.action==='pause')await narratorRef.current?.pause();
      else if(intent.action==='resume'){
        if(narrationSnapshotRef.current&&!['ended','stopped'].includes(narrationSnapshotRef.current.status))await narratorRef.current?.resume();
        else if(context)await startIntroduction(context,'进一步介绍'+context.name);
        else await runTask('chat','请继续刚才的话题。','campus_qa',null,null,null);
      }else{await cancelHarness();await narratorRef.current?.stop(intent.action==='change');if(intent.action==='change'){rememberPoi(null);onSelectPoi(null);}}
      if(intent.action!=='resume')addDialog(text,intent.action==='pause'?'讲解已暂停，你可以继续提问。':intent.action==='change'?'想聊哪个地方？直接告诉我名字就可以。':'已停止讲解。','control');
      return;
    }
    if(intent.kind==='introduce'){await startIntroduction(intent.poi,text);return;}
    if(intent.kind==='clarify'){
      // A follow-up to a broad topic stays in that conversation, not an old map selection.
      if(!intent.candidates.length&&!context&&conversationEstablished.current&&/进一步|再详细|展开|刚才/.test(text)){await narratorRef.current?.stop(true);await runTask('chat',text,'campus_qa',null,null,null);return;}
      setIntroCandidates(intent.candidates);addDialog(text,intent.candidates.length?'你说的是哪一处？可以回复名称或校区，也可以点下面的选项。':'你想了解哪个地方？直接告诉我名字就可以，也可以说“介绍天津大学”。','clarification');return;
    }
    await narratorRef.current?.stop(true);
    if(epoch!==submitEpoch.current)return;
    const routePois=mentionedPois(text,pois).filter(p=>p.campus_id===campusRef.current);
    if(/路线|导航|怎么走|步行|走到/.test(text)&&routePois.length===1){await runHarness(text,{toolName:'route_plan',input:{poiId:routePois[0].id}});return;}
    const tourHandled=await tourTextRef.current?.(text);
    if(epoch!==submitEpoch.current)return;
    if(tourHandled){addDialog(text,'请求已交给地图或行程面板，完成状态请看面板提示。','control');return;}
    const named=mentionedPois(text,pois),poi=named.length===1?named[0]:/它|这里|那里|这个地方|刚才/.test(text)?context:null;
    if(poi)rememberPoi(poi);else if(!/它|这里|那里|这个地方|刚才|继续/.test(text))rememberPoi(null);
    await runTask('chat',text,'campus_qa',null,null,poi);
  }
  async function startListening() {
    if(narrationSnapshotRef.current&&!['ended','stopped'].includes(narrationSnapshotRef.current.status))await narratorRef.current?.pause();else await speechControllerRef.current?.stop('new_request');
    try{await recorderRef.current?.start(currentSession('chat'));}catch(e){setRecordingState((e as Error).message);setAsrBusy(false);}
  }
  async function startContinuousListening() {
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
  async function stopListening() { recorderRef.current?.cancel();interactionContext.current=null;await interactionRef.current?.stop('user'); const id = asrRequestRef.current; asrRequestRef.current = null; ++asrGenerationRef.current; asrAbortRef.current?.abort(); asrAbortRef.current = null; setAsrBusy(false); setAvatarState('idle'); if (id) await asrRef.current?.stop(id); }
  function copyTask(task: TaskRecord) { if (!task.answer.trim()) return; void navigator.clipboard.writeText(privateText(task.answer)).then(() => setNotice('内容已复制。')).catch(() => setNotice('浏览器未允许复制，请手动选择正文。')); }
  function exportTask(task: TaskRecord) { const blob = exportGeneratedText({...task,answer:privateText(task.answer)}); if (!blob) { setNotice('正文为空，无法导出。'); return; } const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = `tju-${task.generation?.type ?? 'content'}-${task.requestId.slice(0, 8)}.txt`; anchor.click(); URL.revokeObjectURL(url); }
  function retryTask(task: TaskRecord) { if (task.lane === 'generation') void runTask('generation', task.prompt, 'content_generation', task.generation, task.requestId, task.poiId === selectedPoi?.id ? selectedPoi : null, task.poiId); else void runTask('chat', task.prompt, task.mode, null, task.requestId, task.poiId === selectedPoi?.id ? selectedPoi : null, task.poiId); }
  function submitGeneration() { const error = validateGenerationDraft(draft); if (error) { setGenerationValidation(error); return; } void runTask('generation', draft.prompt, 'content_generation', { type: draft.type, requirements: draft.requirements, length: draft.length, style: draft.style }); }
  function clearChat() { ++submitEpoch.current;rememberPoi(null);setIntroCandidates([]);introductionTask.current=null;void narratorRef.current?.stop(true); void stopListening(); void speechControllerRef.current?.stop('clear'); void cancelLane('chat', 'clear'); sessionsRef.current.chat[prefs.campus] = freshUuid(sessionsRef.current.chat[prefs.campus]); setChatTasks([]); setChatValidation(''); }
  function onMessageScroll() { const node = messageListRef.current; if (!node) return; const atBottom = shouldFollowLatest(node.scrollTop, node.scrollHeight, node.clientHeight); autoFollowRef.current = atBottom; setShowLatest(!atBottom); }
  function goLatest() { const node = messageListRef.current; if (!node) return; autoFollowRef.current = true; node.scrollTop = node.scrollHeight; setShowLatest(false); }
  function resizeStart(event: React.PointerEvent<HTMLDivElement>) { if (window.innerWidth < 900) return; const startX = event.clientX; const startWidth = prefs.panelWidth; const move = (next: PointerEvent) => setPrefs((current) => ({ ...current, panelWidth: Math.min(760, Math.max(420, startWidth + startX - next.clientX)) })); const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); }; window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); }
  function showLogs(requestId?: string) { setLogRequest(requestId ?? null); setLogsOpen(true); }
  const timeText = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', hour12: false }).format(now);
  const dateText = new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', month: 'numeric', day: 'numeric', weekday: 'short' }).format(now);
  const speechSummary = !speechEnabled ? '未开启' : speechProgress?.status === 'speaking' ? '播报中' : speechProgress?.status === 'buffering' ? '准备中' : speechProgress?.status === 'error' ? '播报失败' : speechProgress?.status === 'paused' ? '已暂停' : '已开启';
  const shownEvents = logRequest ? events.filter((event) => event.request_id === logRequest) : events;
  const cardActions=useRef({cancelLane,retryTask,showLogs,copyTask,playTask,focusMap,continueTask:async(task:TaskRecord)=>{}});
  cardActions.current={cancelLane,retryTask,showLogs,copyTask,playTask,focusMap,continueTask:async task=>{
    if(task.poiId){try{const poi=await r2Transport.poi(task.poiId);await startIntroduction(poi,'进一步介绍'+poi.name);}catch{setNotice('这个地点暂时无法读取，请稍后再试。');}}
    else void submitTextRef.current('请基于刚才的回答进一步介绍：'+task.prompt);
  }};
  const campusChatTasks = chatTasks;
  const serviceTone = serviceError ? 'off' : health ? 'ready' : 'pending'; const modelTone = health?.model.verified ? 'ready' : health?.model.configured ? 'pending' : 'off';

  return <div className="app-shell r2-shell">
    <header className="topbar"><div className="topbar-left"><div className="topbar-pill topbar-clock" title="北京时间（Asia/Shanghai）"><strong>{timeText}</strong><span>{dateText}</span></div><div className="topbar-pill topbar-weather" title={weather ? `天津 · ${weather.label}` : '天津天气暂不可用'}><strong>{weather ? `${weather.temp}°C` : '--'}</strong><span>{weather ? weather.label : '天气 --'}</span></div></div><div className="topbar-right"><details className="speech-menu"><summary>语音讲解<small>{speechSummary}</small></summary><div className="speech-menu-body"><div className="speech-controls">{!speechEnabled ? <button onClick={() => void enableSpeech()}>开启语音导览</button> : <><select aria-label="自动播报方式" value={prefs.speechMode} onChange={(event) => { setPrefs({ ...prefs, speechMode: event.target.value as SpeechMode }); if (event.target.value === 'off') void speechControllerRef.current?.stop('user'); }}><option value="off">自动播报关闭</option><option value="brief">自动简述</option><option value="full">自动全文</option></select><select aria-label="导览语音" value={voiceId} onChange={(event) => setVoiceId(event.target.value)}>{voices.map((voice) => <option key={voice.id} value={voice.id}>{voice.name}</option>)}</select><button onClick={() => void enableSpeech()}>刷新音色</button><button onClick={() => void recoverSpeech()}>恢复声音</button>{speechControllerRef.current?.continueRemaining && <button onClick={() => void continueSpeech()}>继续讲</button>}<span>{speechProgress?.status === 'speaking' ? '正在播报' : speechProgress?.status === 'buffering' ? '准备播报' : speechProgress?.status === 'error' ? '播报失败，请恢复或重读' : speechProgress?.status === 'paused' ? '播报已暂停' : '语音已开启'}</span>{(speechProgress?.status === 'speaking' || speechProgress?.status === 'buffering') && <button onClick={() => void speechControllerRef.current?.stop('user')}>停止播报</button>}</>}</div></div></details><button className="logs-button" onClick={() => showLogs()}><span>运行日志</span>{events.length > 0 && <b>{events.length}</b>}</button></div></header>
    <aside className="guide-character" aria-label="数字人导游"><div ref={avatarHostRef} className="guide-character-host" style={{transform: `scale(${prefs.avatarScale})`}}/></aside>
    <button className="open-guide" onClick={()=>setPanelOpen(!panelOpen)}>{panelOpen?'收起对话':'和海小棠聊聊'}</button><TourWorkspace registerHarnessRoute={handler=>{harnessRoute.current=handler;}} onExport={(tour,format)=>void runHarness('导出行程',{toolName:'itinerary_export',input:{tourId:tour.tour_id,tourSessionId:tour.session_id,format}},tour.session_id)} key={prefs.campus} campus={prefs.campus} memory={tourMemoryRef.current[prefs.campus]} onMemory={value=>{tourMemoryRef.current[prefs.campus]=value;}} registerCancel={handler=>{tourCancelRef.current=handler;}} registerText={handler=>{tourTextRef.current=handler;}} registerMapFocus={handler=>{mapFocusRef.current=handler;}} selectedPoi={selectedPoi} onExplainPoi={poi=>void explainPoi(poi)} onRouteChange={onRouteChange} onSelectPoi={onSelectPoi} onCampus={campus=>setPrefs(current=>({...current,campus}))}
      explainLabel={narrationSession&&narrationSession.poi.id===selectedPoi?.id?(['playing','buffering','preparing'].includes(narrationSession.status)?'暂停讲解':['paused','error'].includes(narrationSession.status)?'继续讲解':'开始讲解'):'开始讲解'}
      presentation={narrationSession?.poi.id===selectedPoi?.id&&narrationSession?<GuidePresentation key={narrationSession.id} session={narrationSession} avatar={avatarRef.current} onPause={()=>void narratorRef.current?.pause()} onResume={()=>void narratorRef.current?.resume()} onStop={()=>void narratorRef.current?.stop()}/>:null}
      speechStatus={<div className="poi-speech-status" role="status" aria-live="polite"><span>{speechProgress?.status==='speaking'?'正在播放':speechProgress?.status==='buffering'?'正在准备语音':speechProgress?.status==='stopped'?'已停止':speechProgress?.status==='error'?'声音暂未播放，请点击继续讲解':!speechEnabled?'点击开始讲解，将开启中文语音':'语音已就绪'}</span>{speechProgress?.status==='error'&&<button onClick={()=>void recoverSpeech()}>再次播放声音</button>}{notice&&<p>{notice}</p>}</div>}
      onReadRoute={route=>{const task:TaskRecord={...newTask(freshUuid(),freshUuid()),lane:'chat',prompt:'路线讲解',mode:'campus_qa',campus:prefs.campus,poiId:null,generation:null};void playTask(task,privateText(routeNarration(route)));}}
      onStop={async()=>{await cancelHarness();void narratorRef.current?.stop();playbackEpoch.current++;lastSpeechRunRef.current=null;void speechControllerRef.current?.stop('user');await stopListening();await cancelLane('chat');await cancelLane('generation');await speechControllerRef.current?.stop('user');}}
      panelOpen={panelOpen} onPanelClose={()=>setPanelOpen(false)} onExplain={stop=>{void r2Transport.poi(stop.poi_id).then(poi=>startIntroduction(poi)).catch(()=>setNotice('地点暂时无法读取。'));}}
      caption={asrBusy?'正在聆听…':speechProgress?.status==='speaking'?'正在播报当前讲解':notice}
      narration={narrationText}
      voice={<>
<div className="task-scroll tour-chat-history" ref={messageListRef} onScroll={onMessageScroll}>{campusChatTasks.length===0&&<p className="tour-chat-empty">你好，我是海小棠。可以直接聊校园、问问题或告诉我想了解的地方，不用先选地点。</p>}{campusChatTasks.map(task=><MemoTaskCard key={task.requestId} task={task} currentCampus={prefs.campus} canStop={laneBusy.chat&&requestRef.current.chat===task.requestId} onStop={()=>void cardActions.current.cancelLane('chat')} onRetry={()=>cardActions.current.retryTask(task)} onLogs={()=>cardActions.current.showLogs(task.requestId)} onCopy={()=>cardActions.current.copyTask(task)} onExport={()=>undefined} onRead={(text,id)=>void cardActions.current.playTask(task,text,id)} onReadFull={()=>void cardActions.current.playTask(task,task.answer)} onContinue={()=>void cardActions.current.continueTask(task)} onMap={()=>cardActions.current.focusMap(task.poiId)}/>)}
{introCandidates.length>0&&<div className="dialog-candidates" role="group" aria-label="选择介绍地点">{introCandidates.map(poi=><button key={poi.id} onClick={()=>void startIntroduction(poi)}>{poi.name} · {CAMPUS_NAMES[poi.campus_id]}</button>)}</div>}
{narrationSession&&<div className="dialog-narration-controls"><span>{narrationSession.poi.name}</span><button onClick={()=>void explainPoi(narrationSession.poi)}>{narrationSession.status==='paused'?'继续讲解':['ended','stopped','error'].includes(narrationSession.status)?'重新讲解':'暂停讲解'}</button><button onClick={()=>void narratorRef.current?.stop()}>停止讲解</button><button onClick={()=>{setPanelOpen(false);document.querySelector('.guide-presentation')?.scrollIntoView({behavior:'smooth',block:'center'});}}>查看讲解画面</button></div>}
</div>

<button disabled={harnessBusy} onClick={()=>void runHarness('选择文档',{toolName:'device_pick_document',input:{}})}>选择文档（TXT/MD）</button>
{(harnessText||harnessBusy)&&<div className="task-card" role="status"><RichText text={harnessText}/>{harnessBusy&&<button onClick={()=>void cancelHarness()}>停止工具任务</button>}{harnessResults.flatMap(({result})=>result.sources).filter((source,index,all)=>all.findIndex(s=>s.sourceId===source.sourceId)===index).map(source=><details key={source.sourceId}><summary>资料来源：{source.title??'所选资料'}</summary><p>{source.excerpt}</p>{source.url&&safeSourceUrl(source.url)&&<a href={safeSourceUrl(source.url)!} target="_blank" rel="noreferrer">打开来源</a>}</details>)}{harnessResults.map(({result,token})=>result.data?.downloadUrl?<button key={result.toolCallId} onClick={()=>void downloadHarness(result.data!.downloadUrl,token,result.data!.filename).catch(()=>setHarnessText('文件无法下载，请重新导出。'))}>下载 {result.data.filename}</button>:result.status==='pending_user_action'?<button key={result.toolCallId} onClick={event=>void resumeDevice(result,token,event.nativeEvent)}>{result.data?.pendingAction?.label??'在设备上继续'}</button>:null)}</div>}
{showLatest&&<button className="latest-button" onClick={goLatest}>回到最新</button>}

{dialogContext&&<div className="context-chip">正在聊：{dialogContext.name}<button onClick={()=>rememberPoi(null)} aria-label="清除对话地点">×</button></div>}
<ChatComposer ref={composerRef} draft={composerDraft} recording={asrBusy} transcribing={recorderRef.current?.state==='transcribing'} busy={laneBusy.chat}
 onSubmit={text=>void submitTextRef.current(text)} onCancel={()=>void cancelLane('chat')} onRecord={()=>asrBusy?recorderRef.current?.finish():void startListening()}
 onEdit={()=>{if(asrBusy){recorderRef.current?.cancel();setAsrBusy(false);setRecordingState('已取消识别，保留编辑文字。');}}}/>
{recordingState&&<p role="status">{recordingState}{asrBusy&&<button onClick={()=>{void stopListening();setRecordingState('录音与识别已取消。');}}>取消录音/识别</button>}</p>}
<div className="tour-composer-foot"><details className="tour-voice-more"><summary>语音设置</summary><div className="tour-voice-menu"><p>录音停止后转成可编辑文字，由你确认发送，不会自动执行路线。</p><div className="tour-voice-buttons"><button type="button" className="tour-voice-action" onClick={()=>void enableSpeech()}>开启中文播报</button><button type="button" className="tour-voice-action danger" onClick={()=>void speechControllerRef.current?.stop('user')}>停止播报</button></div></div></details><button type="button" className="tour-chat-clear" onClick={clearChat} disabled={campusChatTasks.length===0}>清空对话</button></div></>}/>
    <ReconstructionPanel campus={prefs.campus}/>
    <div className={`drawer-backdrop ${logsOpen ? 'open' : ''}`} onClick={() => setLogsOpen(false)}/><aside className={`log-drawer ${logsOpen ? 'open' : ''}`} inert={!logsOpen} aria-hidden={!logsOpen}><header><div><strong>{logRequest ? `请求 ${logRequest.slice(0, 8)} 的日志` : '当前会话日志'}</strong><span>仅显示服务返回的真实事件</span></div><button onClick={() => setLogsOpen(false)}>关闭</button></header><div className="drawer-tools"><button disabled={!shownEvents.length} onClick={() => { const blob = new Blob([sanitizedLogExport(shownEvents)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'ai4tju-runtime-events.json'; anchor.click(); URL.revokeObjectURL(url); }}>脱敏导出</button></div><div className="log-list">{shownEvents.length === 0 ? <p>尚无实际运行事件。</p> : shownEvents.map((event) => <article key={`${event.origin}:${event.event_id}`}><i className={event.status}/><div><strong>{event.origin === 'backend' ? '后端' : '浏览器'} · {event.stage}</strong><span>{event.status} · {event.duration_ms == null ? '耗时未返回' : `${Math.round(event.duration_ms)} ms`}</span><time>{new Date(event.timestamp).toLocaleTimeString('zh-CN', { hour12: false })}</time></div></article>)}</div></aside>
  </div>;
}
