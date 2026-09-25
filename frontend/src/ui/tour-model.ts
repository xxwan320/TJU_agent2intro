import type { TourRequest, TourSession, TourResult, PlanRevision, TourCommand, SpeechInteractionEvent } from '../../../shared/r3';
import type { SpeechInteractionContext } from '../../../shared/r3-speech';
import { acceptsTourResult } from '../transport/r3';

export const SAVED_PREFIX = 'ai4tju.r3.saved-tour.v1.';
export const CAMPUS_LABEL = {weijinlu:'卫津路校区',beiyangyuan:'北洋园校区'};
export function privateText(text:string):string {
 let value=text; for(let i=0;i<3;i++){try{const decoded=decodeURIComponent(value);if(decoded===value)break;value=decoded;}catch{break;}}
 return value.replace(/[-+]?\d{1,3}\.\d{3,}/g,'[位置已移除，请使用地图定位]').replace(/(?:[-+]?\d{1,3}\.\d+)\s*[,，;/\s]\s*(?:[-+]?\d{1,3}\.\d+)/g,'[位置已移除，请使用地图定位]')
  .replace(/(?:经度|纬度|longitude|latitude|lng|lat)\s*[:：=]?\s*[-+]?\d{1,3}(?:\.\d+)?/gi,'[位置已移除，请使用地图定位]');
}
const str=(value:string)=>privateText(value);
const place=(p:TourRequest['start'])=>({kind:p.kind,poi_id:p.kind==='poi'?p.poi_id:null});
export function savedSnapshot(s:TourSession):TourSession {
 const r=s.plan.request;
 return {tour_id:s.tour_id,session_id:s.session_id,state_version:s.state_version,status:s.status,
  plan:{plan_id:s.plan.plan_id,version:s.plan.version,campus_id:s.plan.campus_id,status:s.plan.status,
   request:{request_id:r.request_id,session_id:r.session_id,campus_id:r.campus_id,duration_minutes:r.duration_minutes,
    message:str(r.message??''),must_visit:r.must_visit??[],avoid:r.avoid??[],visit_date:r.visit_date??null,max_walking_minutes:r.max_walking_minutes??null,interests:r.interests.map(str),start:place(r.start),end:place(r.end),accessibility:r.accessibility??'standard'},
   stops:s.plan.stops.map(p=>({stop_id:p.stop_id,poi_id:p.poi_id,title:str(p.title),visit_minutes:p.visit_minutes,visit_time_source:p.visit_time_source,purpose:str(p.purpose),evidence_ids:p.evidence_ids??[]})),
   legs:(s.plan.legs??[]).map(l=>({from_ref:place(l.from_ref),to_ref:place(l.to_ref),distance_m:l.distance_m,duration_s:l.duration_s,source:l.source,verification:l.verification,checked_at:l.checked_at,campus_access:l.campus_access,evidence_ids:l.evidence_ids??[],reason:l.reason})),
   evidence:(s.plan.evidence??[]).map(e=>({evidence_id:e.evidence_id,source_ref:str(e.source_ref),claim:str(e.claim),relation:e.relation,verification:e.verification,checked_at:e.checked_at,valid_until:e.valid_until??null})),
   warnings:(s.plan.warnings??[]).map(str),created_at:s.plan.created_at},
  progress:s.progress.map(p=>({stop_id:p.stop_id,state:p.state})),current_stop_id:s.current_stop_id,
  remaining_minutes:s.remaining_minutes,saved:s.saved,updated_at:s.updated_at,completion_reason:s.completion_reason??null};
}
export function listSaved(storage:Pick<Storage,'length'|'key'|'getItem'>):TourSession[] {
 const list:TourSession[]=[];
 for(let i=0;i<storage.length;i++){const key=storage.key(i);if(!key?.startsWith(SAVED_PREFIX))continue;
  try{const raw=storage.getItem(key);if(!raw||new TextEncoder().encode(raw).byteLength>65536)continue;const s=savedSnapshot(JSON.parse(raw));
   if(s.saved&&key===SAVED_PREFIX+s.session_id&&s.plan.campus_id in CAMPUS_LABEL)list.push(s);
  }catch{/* Malformed saved data is never restored automatically. */}
 }return list;
}
export function storeSaved(storage:Pick<Storage,'setItem'|'removeItem'>,s:TourSession){
 const key=SAVED_PREFIX+s.session_id;
 if(!s.saved){storage.removeItem(key);return;}
 const raw=JSON.stringify(savedSnapshot(s));if(new TextEncoder().encode(raw).byteLength>65536)throw Error('snapshot_too_large');
 storage.setItem(key,raw);
}
export function speechEventCurrent(e:SpeechInteractionEvent,c:SpeechInteractionContext):boolean{
 return e.interaction_id===c.interaction_id&&e.session_id===c.session_id&&e.campus_id===c.campus_id&&e.generation_id===c.generation_id&&e.request_id===c.request_id;
}
export interface TourPort {
 create(body:TourRequest,signal:AbortSignal):Promise<TourResult>;
 revise(id:string,body:PlanRevision,signal:AbortSignal):Promise<TourResult>;
 command(id:string,body:TourCommand,signal:AbortSignal):Promise<TourResult>;
 restore(body:{request_id:string;session_id:string;snapshot:TourSession},signal:AbortSignal):Promise<TourResult>;
 read(id:string,session:string,signal?:AbortSignal):Promise<TourSession>;
}
export class TourLifecycle {
 generation=0; session:TourSession|null=null; pending:{id:string;sessionId:string;abort:AbortController}|null=null;
 constructor(readonly port:TourPort,readonly cancelRemote:(id:string,sid:string)=>Promise<unknown>){}
 invalidate(){this.generation++;const old=this.pending;this.pending=null;old?.abort.abort();return old?this.cancelRemote(old.id,old.sessionId):Promise.resolve(null);}
 async run(requestId:string,sessionId:string,campus:TourRequest['campus_id'],operation:(signal:AbortSignal)=>Promise<TourResult>,restore=false){
  void this.invalidate().catch(()=>null);const generation=++this.generation;const abort=new AbortController();
  const current=this.session;
  const context={requestId,sessionId,campusId:campus,generation,tourId:restore?undefined:current?.tour_id,planVersion:current?.plan.version??0,stateVersion:current?.state_version??0};
  this.pending={id:requestId,sessionId,abort};
  try{
   const result=await operation(abort.signal);
   if(!acceptsTourResult(result,context,this.generation))return null;
   this.session=result.session;return result;
  }finally{if(generation===this.generation)this.pending=null;}
 }
 async refresh(){
  const s=this.session;if(!s)return null;
  const generation=this.generation;const fresh=await this.port.read(s.tour_id,s.session_id);
  if(generation!==this.generation||fresh.session_id!==s.session_id||fresh.tour_id!==s.tour_id||fresh.plan.campus_id!==s.plan.campus_id||fresh.state_version<s.state_version||fresh.plan.version<s.plan.version)return null;
  this.session=fresh;return fresh;
 }
}


export function tourCommand(s:TourSession,id:string,action:TourCommand['action'],acceptUnverified=false):TourCommand {
 return {request_id:id,session_id:s.session_id,expected_version:s.plan.version,expected_state_version:s.state_version,action,...(acceptUnverified&&['start','resume'].includes(action)?{accept_unverified:true}:{}),
  ...(['arrive','explain','complete_stop','skip'].includes(action)?{stop_id:s.current_stop_id}:{})};
}

// Only explicit time adjustments become mutations; all other text remains a question.
export function remainingTimeIntent(text:string):number|null {
 const clean=privateText(text).replace(/\s/g,'');
 if(!/(?:只剩|还剩|剩余|时间.*剩)/.test(clean))return null;
 if(/半小时/.test(clean))return 30;
 const numeric=/(\d+)(?:分钟|分)/.exec(clean);
 if(numeric)return Number(numeric[1]);
 const chinese:Record<string,number>={'十':10,'二十':20,'三十':30,'四十':40,'五十':50,'六十':60};
 for(const [word,minutes] of Object.entries(chinese).reverse())if(clean.includes(word+'分钟'))return minutes;
 return null;
}
