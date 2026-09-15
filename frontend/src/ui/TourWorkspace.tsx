import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { CampusId } from '../../../shared/contracts';
import type { POI, CampusAssets, RouteResponse } from '../../../shared/r2';
import type { TourCommand, TourRequest, TourSession, TourStop, PlanRevision, TourResult } from '../../../shared/r3';
import { api, transport } from '../transport/api';
import { r3Transport } from '../transport/r3';
import { r2Transport } from '../transport/r2';
import { CampusExplorer } from './CampusExplorer';
import { freshUuid, safeSourceUrl } from './model';
import { CAMPUS_LABEL, tourCommand, TourLifecycle, listSaved, storeSaved, SAVED_PREFIX, privateText, remainingTimeIntent } from './tour-model';
import { campusMediaFor } from './r2-model';
import { tourKnowledgeContext } from '../transport/r3-knowledge';
import type { TourKnowledgeContext } from '../../../shared/r3-knowledge';
import './tour.css';

export interface TourMemory {
 session:TourSession|null;
 draft?:{duration:string;interests:string;start:string;end:string;must:string;avoid:string;access:boolean;date?:string;maxWalk?:string};
}
interface Props {
 registerText(handler:((text:string)=>Promise<boolean>)|null):void;
 memory?:TourMemory; onMemory(value:TourMemory):void; registerCancel(handler:(()=>void)|null):void;
 campus:CampusId; voice:ReactNode; caption:string; narration:string;
 onReadRoute(route:RouteResponse):void; onStop():Promise<void>; onExplain(stop:TourStop):void; onCampus(campus:CampusId):void;
}
const STATUS={draft:'行程草稿',checked:'已完成条件检查',active:'参观进行中',paused:'已暂停',completed:'参观已完成',cancelled:'已结束',infeasible:'条件暂不满足'};
const PROGRESS={pending:'待参观',navigating:'前往本站',arrived:'已确认到达',explaining:'正在讲解',completed:'已完成',skipped:'已跳过'};
export function TourWorkspace({campus,voice,caption,narration,onStop,onExplain,onCampus,onReadRoute,memory,onMemory,registerCancel,registerText}:Props){
 const lifecycle=useRef(new TourLifecycle(r3Transport,(id,sid)=>transport.cancel(id,sid).catch(()=>null)));
 const [session,setSession]=useState<TourSession|null>(memory?.session??null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 const actionEpoch=useRef(0);
 const busyRef=useRef(false),mounted=useRef(true),[duration,setDuration]=useState(memory?.draft?.duration??'60'),[interests,setInterests]=useState(memory?.draft?.interests??'校园历史、建筑'),[start,setStart]=useState(memory?.draft?.start??'unspecified'),[end,setEnd]=useState(memory?.draft?.end??'unspecified'),[must,setMust]=useState(memory?.draft?.must??''),[avoid,setAvoid]=useState(memory?.draft?.avoid??''),[access,setAccess]=useState(memory?.draft?.access??false);
 const [pois,setPois]=useState<POI[]>([]),[poiError,setPoiError]=useState(false),[assets,setAssets]=useState<CampusAssets|null>(null),[fixture,setFixture]=useState<boolean|null>(null);
 const [saved,setSaved]=useState<TourSession[]>([]),[remaining,setRemaining]=useState('30'),[replacement,setReplacement]=useState(''),[editStop,setEditStop]=useState<string|null>(null),[confirmed,setConfirmed]=useState(false);
 const [date,setDate]=useState(memory?.draft?.date??''),[maxWalk,setMaxWalk]=useState(memory?.draft?.maxWalk??'');
 const [resultMeta,setResultMeta]=useState<TourResult|null>(null),[usage,setUsage]=useState<TourResult['usage']>(null);
 const [contexts,setContexts]=useState<Record<string,TourKnowledgeContext>>({});
 const [instruction,setInstruction]=useState('');
 const [mapFocus,setMapFocus]=useState<string|null>(null),[mapRevision,setMapRevision]=useState(0),[navigationEpoch,setNavigationEpoch]=useState(0);
 const initialSession=useRef(memory?.session?.session_id??freshUuid());
 const initialized=useRef(false);if(!initialized.current){lifecycle.current.session=memory?.session??null;initialized.current=true;}
 const draftRef=useRef({duration,interests,start,end,must,avoid,access,date,maxWalk});draftRef.current={duration,interests,start,end,must,avoid,access,date,maxWalk};
 const refreshSaved=()=>{try{setSaved(listSaved(localStorage));}catch{setNotice('浏览器无法读取保存的行程。');}};
 useEffect(()=>{
  mounted.current=true;refreshSaved();
  registerCancel(()=>{if(!lifecycle.current.pending)return;actionEpoch.current++;void lifecycle.current.invalidate();busyRef.current=false;setBusy(false);setNavigationEpoch(v=>v+1);setNotice('本地已停止规划等待；上游取消未确认，请重新读取行程。');});
  if(lifecycle.current.session)void lifecycle.current.refresh().then(s=>{if(s&&mounted.current)publish(s);}).catch(()=>{if(mounted.current)setNotice('暂未刷新服务端进度，请重新读取后操作。');});
  let live=true;
  void api<{fixture:boolean;implementation:string}>('/tours/status').then(s=>{if(live)setFixture(s.fixture||s.implementation==='fixture_only');}).catch(()=>{if(live)setFixture(null);});
  async function load(){try{let cursor:string|undefined;const all:POI[]=[];do{const page=await r2Transport.pois(campus,{limit:100,...(cursor?{cursor}:{})});if(!live)return;all.push(...page.items.filter(p=>p.campus_id===campus));cursor=page.next_cursor??undefined;}while(cursor);setPois(all);}catch{if(live)setPoiError(true);}}
  void load();
  return()=>{onMemory({session:lifecycle.current.session,draft:draftRef.current});registerCancel(null);live=false;mounted.current=false;actionEpoch.current++;void lifecycle.current.invalidate();void onStop();};
 },[campus]);
 useEffect(()=>{
  let live=true;setContexts({});
  for(const stop of session?.plan.stops??[])void tourKnowledgeContext(stop.poi_id,campus,session?.plan.request.visit_date??undefined).then(value=>{if(live)setContexts(old=>({...old,[stop.poi_id]:value}));}).catch(()=>undefined);
  return()=>{live=false;};
 },[session?.tour_id,session?.plan.version,campus]);
 useEffect(()=>{
  registerText(async text=>{
   const minutes=remainingTimeIntent(text);if(minutes===null)return false;
   if(!lifecycle.current.session){setError('请先创建行程，再调整剩余时间。');return true;}
   setRemaining(String(minutes));await revise('set_remaining_time',undefined,minutes);return true;
  });
  return()=>registerText(null);
 });
 const publish=(s:TourSession)=>{if(!mounted.current)return;setSession(s);onMemory({session:s,draft:draftRef.current});setConfirmed(false);try{storeSaved(localStorage,s);refreshSaved();}catch{setNotice('本机保存失败。行程仍在内存中，请允许存储后再保存。');}};
 async function perform(call:(id:string,sid:string,signal:AbortSignal)=>ReturnType<typeof r3Transport.create>,restore=false,sid=session?.session_id??initialSession.current){
  if(busyRef.current||!mounted.current)return null;const epoch=++actionEpoch.current;busyRef.current=true;setBusy(true);setError('');setNotice('');
  try{const result=await lifecycle.current.run(freshUuid(),sid,campus,signal=>{const request=lifecycle.current.pending!;return call(request.id,sid,signal);},restore);
   if(result&&mounted.current&&epoch===actionEpoch.current){setResultMeta(result);if(result.usage)setUsage(result.usage);publish(result.session);return result.session;}
  }catch(e){
   if(!mounted.current||epoch!==actionEpoch.current)return null;
   const failure=(e as {error?:{code?:string;message?:string}})?.error;
   if(failure?.code?.startsWith('TOUR_')&&failure.code.includes('CONFLICT')){
    const fresh=await lifecycle.current.refresh().catch(()=>null);if(fresh&&epoch===actionEpoch.current)publish(fresh);
    if(epoch!==actionEpoch.current)return null;
    setError('行程已在服务端更新，已尝试读取最新进度。请检查后重新选择操作。');
   }else if(!(e instanceof DOMException&&e.name==='AbortError')){
    setError(failure?.code==='TOUR_NOT_IMPLEMENTED'?'行程服务尚未接入。可继续使用校园对话与地图，或在明确开发环境联调。':privateText(failure?.message??'连接中断，未取得结果。请重新读取服务端进度后再操作。'));
   }
  }finally{if(mounted.current&&epoch===actionEpoch.current){busyRef.current=false;setBusy(false);}}
  return null;
 }
 const stopLocal=async()=>{setMapFocus(null);setInstruction('');setNavigationEpoch(v=>v+1);await onStop();};
 async function command(action:TourCommand['action']){
  const s=lifecycle.current.session;if(!s)return;
  if(['pause','cancel','end'].includes(action)){
   // Invalidate before waiting for B or the remote cancellation acknowledgement.
   actionEpoch.current++;await lifecycle.current.invalidate();busyRef.current=false;setBusy(false);
  }
  await stopLocal();
  const result=await perform((id,sid,signal)=>r3Transport.command(s.tour_id,tourCommand(s,id,action,confirmed),signal));
  if(result&&['start','resume','next','skip'].includes(action)){
   setNavigationEpoch(v=>v+1);const target=result.plan.stops.find(p=>p.stop_id===result.current_stop_id);setMapFocus(target?.poi_id??null);setMapRevision(v=>v+1);
  }
  if(result&&action==='explain'){const target=result.plan.stops.find(p=>p.stop_id===result.current_stop_id);if(target)onExplain(target);}
 }
 async function revise(operation:PlanRevision['operation'],stopId?:string,minutes=Number(remaining)){
  const s=lifecycle.current.session;if(!s||busyRef.current)return;
  if(operation==='set_remaining_time'&&(!Number.isInteger(minutes)||minutes<1||minutes>240)){setError('剩余时间请输入 1—240 的整数分钟。');return;}
  if(operation==='replace_stop'&&!replacement){setError('请先选择同校区替换地点。');return;}
  await stopLocal();
  await perform((id,sid,signal)=>r3Transport.revise(s.tour_id,{request_id:id,session_id:sid,expected_version:s.plan.version,expected_state_version:s.state_version,operation,...(operation==='set_remaining_time'?{remaining_minutes:minutes}:{stop_id:stopId}),...(operation==='replace_stop'?{replacement_poi_id:replacement}:{})},signal));
 }
 async function create(){
  if(session&&!['cancelled','completed'].includes(session.status)){setError('请先结束当前行程，再创建新行程。');return;}
  const fields=[interests,must,avoid];if(fields.some(t=>privateText(t)!==t)){setError('已移除输入中的精确位置。请通过地图定位入口提供起点。');setInterests(privateText(interests));setMust(privateText(must));setAvoid(privateText(avoid));return;}
  if(!Number.isInteger(Number(duration))||Number(duration)<10||Number(duration)>240){setError('参观时长请输入 10—240 的整数分钟。');return;}
  const prefs=interests.split(/[、，,\n]/).map(v=>v.trim()).filter(Boolean);
  const resolve=(value:string)=>{
   const ids:string[]=[];
   for(const name of value.split(/[、，,\n]/).map(v=>v.trim()).filter(Boolean)){
    const matches=pois.filter(p=>p.id===name||p.name===name||p.aliases.includes(name));
    if(matches.length!==1)throw Error('地点“'+name+'”尚不明确，请填写所选校区的完整地点名称。');
    ids.push(matches[0].id);
   }return [...new Set(ids)];
  };
  let required:string[],avoided:string[];
  try{required=resolve(must);avoided=resolve(avoid);}catch(e){setError((e as Error).message);return;}
  if(required.length>5||required.some(id=>avoided.includes(id))){setError('必去最多5处，且不能同时避开。');return;}
  if(maxWalk!==''&&(!Number.isInteger(Number(maxWalk))||Number(maxWalk)<0||Number(maxWalk)>240)){setError('步行上限请输入 0—240 分钟。');return;}
  if(prefs.length>8){setError('兴趣与地点要求合计最多 8 项，请精简后重试。');return;}
  if(!prefs.length){setError('请填写至少一项兴趣或参观要求。');return;}
  setUsage(null);setResultMeta(null);lifecycle.current.session=null;const newSession=freshUuid();initialSession.current=newSession;
  const ref=(id:string):TourRequest['start']=>id==='unspecified'?{kind:'unspecified'}:id==='current_position'?{kind:'current_position'}:{kind:'poi',poi_id:id};
  await stopLocal();
  await perform((id,sid,signal)=>r3Transport.create({request_id:id,session_id:sid,campus_id:campus,duration_minutes:Number(duration),message:interests,must_visit:required,avoid:avoided,visit_date:date||null,max_walking_minutes:maxWalk===''?null:Number(maxWalk),interests:prefs,start:ref(start),end:ref(end),accessibility:access?'step_free':'standard'},signal),false,newSession);
 }
 async function restore(s:TourSession){
  if(s.plan.campus_id!==campus){onCampus(s.plan.campus_id);return;}
  lifecycle.current.session=null;await stopLocal();
  await perform((id,sid,signal)=>r3Transport.restore({request_id:id,session_id:sid,snapshot:s},signal),true,s.session_id);
 }
 const current=session?.plan.stops.find(s=>s.stop_id===session.current_stop_id),progress=session?.progress.find(p=>p.stop_id===session.current_stop_id)?.state;
 const walking=session?.status==='active'||session?.status==='paused';
 const totalVisit=session?.plan.stops.filter(s=>!session.progress.some(p=>p.stop_id===s.stop_id&&['completed','skipped'].includes(p.state))).reduce((n,s)=>n+s.visit_minutes,0)??0;
 const legs=session?.plan.legs??[],knownWalk=legs.length>=Math.max(1,(session?.plan.stops.length??0)-1)&&legs.every(l=>l.duration_s!==null)&&!(session?.plan.warnings??[]).length;
 const photo=campusMediaFor(assets,campus),photoUrl=photo?safeSourceUrl(photo.source_url):null;
 const editable=session&&['draft','checked','active','paused'].includes(session.status);
 const placeName=(p:TourRequest['start'])=>p.kind==='current_position'?'当前位置（仅导航时定位）':p.kind==='unspecified'?'请导游建议':pois.find(x=>x.id===p.poi_id)?.name??p.poi_id;
 return <main className={'tour-workspace '+(walking?'walking':'')} aria-label="校园行程">
  <header className="tour-heading"><div><small>AI4TJU · 校园漫游</small><h1>{walking?'跟着行程，慢慢认识天大':'留一点时间，认识天大'}</h1><p>3—5 站校园参观 · {CAMPUS_LABEL[campus]}</p></div><label>浏览校区<select value={campus} onChange={e=>onCampus(e.target.value as CampusId)}><option value="weijinlu">卫津路校区</option><option value="beiyangyuan">北洋园校区</option></select></label></header>
  {fixture&&<p className="fixture-banner" role="status">开发测试数据 · 合成站点，仅验证页面流程，不是真实校园行程。</p>}
  {error&&<div className="tour-alert" role="alert"><strong>需要处理</strong><p>{error}</p>{session&&<button disabled={busy} onClick={()=>{void lifecycle.current.refresh().then(s=>{if(s)publish(s);}).catch(()=>setError('未能重新读取行程，请稍后再试。'));}}>重新读取行程</button>}</div>}
  {notice&&<p role="status" className="tour-alert">{notice}</p>}
  {!session&&saved.length>0&&<section className="saved-tours"><h2>接着上次走</h2><p>恢复后先确认进度，再继续。不会自动开启定位、麦克风或播报。</p>{saved.map(s=><article key={s.session_id}><strong>{CAMPUS_LABEL[s.plan.campus_id]} · {s.plan.stops.length} 站</strong><span>{s.progress.filter(p=>p.state==='completed').length} 站已完成</span><button disabled={busy} onClick={()=>void restore(s)}>{s.plan.campus_id===campus?'恢复已保存行程':'切换校区查看'}</button><button disabled={busy} onClick={()=>{try{localStorage.removeItem(SAVED_PREFIX+s.session_id);refreshSaved();}catch{setError('无法删除本机记录。');}}}>删除本机记录</button></article>)}</section>}
  <div className="tour-columns"><section className="tour-planning">
  <details className="tour-input" open={!session}><summary>安排这次参观 · {CAMPUS_LABEL[campus]}</summary><form onSubmit={e=>{e.preventDefault();void create();}} onKeyDown={e=>{if(e.key==='Enter'&&(e.nativeEvent.isComposing||e.keyCode===229))e.preventDefault();}}>
   <label>可用时长（分钟）<input type="number" min="10" max="240" step="1" value={duration} onChange={e=>setDuration(e.target.value)} required/></label>
   <label>感兴趣的内容<textarea value={interests} maxLength={160} onChange={e=>setInterests(e.target.value)} placeholder="校园历史、建筑、图书馆…" rows={2}/></label>
   <div className="tour-form-row">{(['start','end'] as const).map((kind)=><label key={kind}>{kind==='start'?'从哪里出发':'最后到哪里'}<select value={kind==='start'?start:end} onChange={e=>(kind==='start'?setStart:setEnd)(e.target.value)}><option value="unspecified">请导游建议</option><option value="current_position">当前位置（仅导航使用）</option>{pois.map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</select></label>)}</div>
   {poiError&&<p>地点目录未加载，可先选择“请导游建议”。</p>}
   <label>必去地点<input value={must} maxLength={60} onChange={e=>setMust(e.target.value)} placeholder="如：图书馆"/></label><label>避开地点<input value={avoid} maxLength={60} onChange={e=>setAvoid(e.target.value)} placeholder="如：施工区域"/></label>
   <label>参观日期（选填）<input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label><label>步行上限（分钟，选填）<input type="number" min="0" max="240" value={maxWalk} onChange={e=>setMaxWalk(e.target.value)}/></label>
   <label className="tour-check"><input type="checkbox" checked={access} onChange={e=>setAccess(e.target.checked)}/>需要无台阶路线</label>
   <button className="tour-primary" disabled={busy||!!session&&!['completed','cancelled'].includes(session.status)}>安排我的行程</button>
  </form></details>
  {session&&<section className="tour-plan" aria-label="结构化行程卡"><header><div><small>{CAMPUS_LABEL[session.plan.campus_id]}</small><h2>{STATUS[session.status]}</h2></div><strong>{session.plan.stops.length} 站</strong></header>
   <p className="tour-total">剩余停留 {totalVisit} 分钟 · 步行 {knownWalk?Math.ceil(legs.reduce((n,l)=>n+(l.duration_s??0),0)/60)+' 分钟':'待核实'}<br/>计划内总时间：{knownWalk?totalVisit+Math.ceil(legs.reduce((n,l)=>n+(l.duration_s??0),0)/60)+' 分钟（不含临时绕行）':'暂不能确定'} · 时间预算 {session.plan.request.duration_minutes} 分钟</p>
   <p>本次规划 Token：{usage?.total_tokens??'unknown（服务未返回，或刷新后未保存用量）'} · 已完成 {session.progress.filter(p=>p.state==='completed').length} 站 / 跳过 {session.progress.filter(p=>p.state==='skipped').length} 站{session.completion_reason==='user_ended'?' · 用户提前结束':''}</p>
   {resultMeta?.clarification_required&&<section role="alert"><h3>请补充这些信息</h3>{resultMeta.clarifications?.map(q=><p key={q.question_id}>{q.prompt}</p>)}<p>取消当前草稿，修正输入后重新规划。</p></section>}
   <details><summary>本次输入快照</summary><p>{CAMPUS_LABEL[session.plan.request.campus_id]} · {session.plan.request.duration_minutes} 分钟</p><p>{session.plan.request.interests.join(' / ')}</p><p>{placeName(session.plan.request.start)} → {placeName(session.plan.request.end)}</p></details>
   <section className="tour-warnings"><h3>出发前，确认一下</h3>{!knownWalk&&<p>缺少可核实的步行耗时，总时间和通行条件请以现场为准。</p>}{(session.plan.warnings??[]).map((w,i)=><p key={i}>{privateText(w)}</p>)}<p>必去、避开及无障碍要求请对照站点与资料确认。</p></section>
   <ol className="tour-stops">{session.plan.stops.map((stop,index)=>{const state=session.progress.find(p=>p.stop_id===stop.stop_id)?.state??'pending';const locked=['completed','skipped'].includes(state)||(state==='explaining'&&session.status!=='paused');const leg=legs.find(l=>l.to_ref.poi_id===stop.poi_id);return <li key={stop.stop_id} aria-current={stop.stop_id===session.current_stop_id?'step':undefined}><span className="tour-number">{index+1}</span><div><small>{PROGRESS[state]}</small><h3>{stop.title}</h3><p>{stop.purpose}</p><strong>停留 {stop.visit_minutes} 分钟</strong><small> · {stop.visit_time_source==='user_preference'?'你的偏好':'规划分配'}</small><p>步行：{leg?.duration_s!=null?Math.ceil(leg.duration_s/60)+' 分钟':'耗时待核实'}{leg?.distance_m!=null?' · '+Math.round(leg.distance_m)+' 米':''} · {leg?.source==='amap'?'高德':leg?.source==='campus_evidence'?'校园资料':'来源待核实'}</p>{(stop.evidence_ids??[]).length>0&&<details><summary>本站依据与进入条件</summary>{(stop.evidence_ids??[]).map(id=>{const evidence=session.plan.evidence?.find(e=>e.evidence_id===id);const scoped=contexts[stop.poi_id]?.evidence?.find(e=>e.evidence.evidence_id===id);const url=safeSourceUrl(scoped?.source_url??'');return evidence&&<p key={id}>{evidence.claim}<br/><small>依据 {id} · {evidence.verification} · 当日适用：{scoped?.current_status??'未核实'}</small>{url&&<> · <a href={url} target="_blank" rel="noreferrer">查看原始来源</a></>}</p>;})}</details>}{editable&&!locked&&<div className="tour-actions"><button disabled={busy} onClick={()=>void revise('remove_stop',stop.stop_id)}>删除本站</button><button disabled={busy} onClick={()=>{setEditStop(editStop===stop.stop_id?null:stop.stop_id);setReplacement('');}}>替换本站</button></div>}{editStop===stop.stop_id&&editable&&!locked&&<div className="tour-replace"><label>同校区替换地点<select value={replacement} onChange={e=>setReplacement(e.target.value)}><option value="">请选择</option>{pois.filter(p=>!session.plan.stops.some(s=>s.poi_id===p.id)).map(p=><option value={p.id} key={p.id}>{p.name}</option>)}</select></label><button disabled={busy||!replacement} onClick={()=>void revise('replace_stop',stop.stop_id)}>确认替换</button></div>}</div></li>;})}</ol>
   {editable&&<div className="tour-shorten"><label>剩余时间（分钟）<input type="number" min="1" max="240" value={remaining} onChange={e=>setRemaining(e.target.value)}/></label><button disabled={busy} onClick={()=>void revise('set_remaining_time')}>调整剩余行程</button></div>}
   <div className="tour-actions">{session.status==='draft'&&<button disabled={busy} onClick={()=>void command('check')}>检查行程条件</button>}{session.status==='checked'&&<><label className="tour-check"><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>我已了解待核实条件</label><button className="tour-primary" disabled={busy||!confirmed} onClick={()=>void command('start')}>开始参观</button></>}<button disabled={busy} onClick={()=>void command(session.saved?'forget':'save')}>{session.saved?'取消保存并删除本机记录':'保存行程与进度到本机'}</button>{editable&&<button onClick={()=>void command('cancel')}>取消行程</button>}</div>
   <details className="tour-technical"><summary>技术详情</summary><p>行程版本 {session.plan.version} / 状态版本 {session.state_version}</p><p>tour_id: {session.tour_id}</p><p>request_id: {session.plan.request.request_id}</p><p>环境：{fixture===true?'fixture':fixture===false?'服务端':'未确认'} · 仅 C 返回快照作为行程状态</p></details>
  </section>}
  {photo&&<figure className="tour-photo"><img src={photo.local_path} alt={photo.caption} onError={e=>{e.currentTarget.hidden=true;}}/><figcaption>{photo.caption} · {photo.creator??'作者未署名'} · {photo.usage_basis} {photoUrl&&<a href={photoUrl} target="_blank" rel="noreferrer">图源</a>}</figcaption></figure>}
  </section><section className="tour-map" aria-label="行程地图">
   <CampusExplorer resetEpoch={navigationEpoch} campus={campus} sessionId={session?.session_id??initialSession.current} focusPoiId={mapFocus} focusRevision={mapRevision} tourSession={session} onInstruction={setInstruction} onSelect={()=>undefined} onAssets={setAssets} onReadRoute={onReadRoute} onAsk={(_,poi)=>{const stop=session?.plan.stops.find(s=>s.poi_id===poi.id);if(stop)onExplain(stop);else setNotice('请先从行程中选择当前站点。');}}/>
  </section></div>
  <section className="tour-guide-dock" aria-label="当前导览">{instruction&&<p className="tour-next-step">下一步：{instruction}</p>}<div className="tour-current"><small>{session?STATUS[session.status]:'准备好就出发'}</small><strong>{current?.title??'你的校园参观'}</strong><span>{session?'剩余 '+session.remaining_minutes+' 分钟（服务端预算）':'填写兴趣和时间，安排一次参观'}</span></div>
   {session?.status==='paused'&&<p>继续前请确认当前位置和剩余时间；地图将重新取得起点，不自动播放旧内容。</p>}
   <div className="tour-actions">{session?.status==='active'&&<>{progress==='navigating'&&<button disabled={busy} onClick={()=>void command('arrive')}>我已到达本站</button>}{progress==='arrived'&&<button disabled={busy} onClick={()=>void command('explain')}>开始本站讲解</button>}{(progress==='arrived'||progress==='explaining')&&<button disabled={busy} onClick={()=>void command('complete_stop')}>完成本站</button>}{progress==='completed'&&<button disabled={busy} onClick={()=>void command('next')}>前往下一站</button>}<button onClick={()=>void command('pause')}>暂停参观</button><button disabled={busy||progress==='completed'||progress==='skipped'} onClick={()=>void command('skip')}>跳过本站</button></>}{session?.status==='paused'&&<><label><input type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)}/>我已了解待核实条件</label><button disabled={busy||!confirmed} onClick={()=>void command('resume')}>确认并继续参观</button></>}{walking&&<button onClick={()=>void command('end')}>提前结束参观</button>}{busy&&<button onClick={()=>{actionEpoch.current++;void lifecycle.current.invalidate();busyRef.current=false;setBusy(false);setNotice('本地已停止等待；上游取消未确认。请重新读取行程。');}}>取消等待</button>}</div>
   <div className="tour-voice">{voice}</div><p className="tour-caption" aria-live="polite">{caption||'文字和语音都可以随时使用'}</p>{narration&&<details className="tour-narration" open><summary>当前讲解</summary><p>{privateText(narration)}</p></details>}
  </section>
 </main>;
}
