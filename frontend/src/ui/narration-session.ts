import type {POI, SpeechProgress, SpeechRun} from '../../../shared/r2';
import type {CampusSpeechController} from '../speech/controller';
import {tourKnowledgeContext} from '../transport/r3-knowledge';
import {tourPhotosFor,type TourPhoto} from './tour-photos';
import {poiIntroduction} from './poi-introduction';

export type NarrationStatus='preparing'|'playing'|'buffering'|'paused'|'ended'|'stopped'|'error';
export interface NarrationSnapshot {
  id:string; poi:POI; status:NarrationStatus; text:string; caption:string;
  photos:TourPhoto[]; mediaStatus:'ready'|'missing'; error:string|null;
}
export function guideTrace(event:string,fields:Record<string,unknown>={}) {
  if(typeof window==='undefined')return;
  const target=window as typeof window & {__guideTrace?:unknown[]};
  target.__guideTrace??=[];target.__guideTrace.push({event,at:performance.now(),...fields});
  if(target.__guideTrace.length>300)target.__guideTrace.shift();
}

/** One generation owns text, existing speech queue, captions and matching media. */
export class NarrationSession {
  private active:NarrationSnapshot|null=null;
  private abort:AbortController|null=null;
  private unsubscribe:()=>void;
  private paused=false;
  private lastStart:{poi:POI;topic:string;sessionId:string;voiceId:string}|null=null;
  private started=false;
  constructor(private speech:CampusSpeechController,private publish:(value:NarrationSnapshot|null)=>void) {
    this.unsubscribe=speech.subscribe(value=>this.progress(value));
  }
  private update(patch:Partial<NarrationSnapshot>) {if(this.active){this.active={...this.active,...patch};this.publish(this.active);}}
  async start(poi:POI,topic:string,sessionId:string,voiceId:string) {
    if(this.active?.poi.id===poi.id&&!['ended','stopped','error'].includes(this.active.status))return;
    void this.stop();
    this.paused=false;
    this.lastStart={poi,topic,sessionId,voiceId};this.started=false;
    const id=crypto.randomUUID(), abort=new AbortController();this.abort=abort;
    const photos=tourPhotosFor(poi.id,poi.name);
    this.active={id,poi,status:'preparing',text:poiIntroduction(poi),caption:'',photos,mediaStatus:photos[0]?.placeholder?'missing':'ready',error:null};
    this.publish(this.active);guideTrace('introduction.request',{id,poi:poi.id,campus:poi.campus_id});
    const current=()=>this.active?.id===id&&!abort.signal.aborted;
    // Point-specific image sets are local and never block narration preparation.
    const context=tourKnowledgeContext(poi.id,poi.campus_id,undefined,abort.signal).catch(()=>null);
    const enabled=await this.speech.enable(true);
    if(!current())return;
    if(enabled.status!=='ready'){this.update({status:'error',error:'点击继续播放以开启声音。'});return;}
    const extra=await Promise.race([context,new Promise<null>(resolve=>{const timer=setTimeout(()=>resolve(null),1600);abort.signal.addEventListener('abort',()=>{clearTimeout(timer);resolve(null);},{once:true});})]);
    if(!current())return;
    const introduction=poiIntroduction(poi);
    const claims=(extra?.evidence??[]).filter(x=>x.poi_id===poi.id&&x.campus_id===poi.campus_id&&x.evidence.relation==='supports'&&['stable_fact','historical_event'].includes(x.claim_type)&&['verified','historical'].includes(x.evidence.verification)&&x.current_status!=='conflict').map(x=>x.evidence.claim.replace(/（适用日期未提供）/g,'')).filter(claim=>{
      const core=claim.trim().replace(/[。！？!?；;]+$/g,'');
      if(/^(?:校方|学校).*资料.*(?:列有|收录)/.test(core))return false;
      const withoutName=core.startsWith(poi.name)?core.slice(poi.name.length):core;
      return !introduction.includes(core)&&!(withoutName.length>=4&&introduction.includes(withoutName));
    });
    const text=[introduction,...[...new Set(claims)].slice(0,3)].join('\n');
    this.update({text});
    const run:SpeechRun={request_id:id,session_id:sessionId,campus_id:poi.campus_id,generation_id:id,voice_id:voiceId||'edge:zh-CN-XiaoxiaoNeural',mode:'full',signal:abort.signal};
    const result=await this.speech.playFull(run,text);
    if(current())this.started=result.status==='ready';
    if(current()&&this.paused)await this.speech.pause();
    if(current()&&result.status!=='ready')this.update({status:'error',error:'声音暂未播放，请点击继续播放。'});
  }
  private progress(progress:SpeechProgress) {
    if(!this.active||progress.generation_id!==this.active.id||this.abort?.signal.aborted)return;
    const status=({speaking:'playing',buffering:'buffering',paused:'paused',idle:'ended',stopped:'stopped',error:'error'} as const)[progress.status];
    guideTrace('speech.'+progress.status,{id:this.active.id,utterance:progress.utterance_id});
    this.update({status:this.paused&&status==='buffering'?'paused':status,caption:progress.status==='speaking'?(progress.text??this.active.caption):this.active.caption,error:status==='error'?'声音暂未播放，请点击继续播放。':null});
  }
  pause(){guideTrace('command.pause',{id:this.active?.id});this.paused=true;this.update({status:'paused'});return this.speech.pause();}
  async resume(){
    if(!this.active||['stopped','ended'].includes(this.active.status))return;
    guideTrace('command.resume',{id:this.active.id});this.paused=false;
    if(this.active.status==='error'&&!this.started&&this.lastStart){const p=this.lastStart;this.update({status:'stopped'});return this.start(p.poi,p.topic,p.sessionId,p.voiceId);}
    const id=this.active.id;this.update({status:'buffering',error:null});
    const enabled=await this.speech.enable(true);
    if(this.active?.id!==id||this.abort?.signal.aborted)return;
    if(enabled.status!=='ready'){this.update({status:'error',error:'请允许网页播放声音后重试。'});return;}
    if(this.active.status==='playing'||!this.started)return;
    const result=await this.speech.resume();
    if(this.active?.id===id&&result.status!=='ready')this.update({status:'error',error:'声音暂未恢复，请重试。'});
  }
  async stop(clear=false){
    this.paused=false;
    this.abort?.abort();this.abort=null;
    if(this.active){guideTrace('session.stop',{id:this.active.id});this.update({status:'stopped',caption:''});if(clear){this.active=null;this.publish(null);}}
    await this.speech.stop('new_request');
  }
  dispose(){this.unsubscribe();void this.stop(true);}
}
