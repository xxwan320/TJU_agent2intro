// Same-origin transport; contains no key or upstream URL.
import type { ChatRequest, ChatResponse, EventPage, Health, KnowledgeStatus, CancelResponse, SceneAck, SceneAckResponse, ClientEventInput, RuntimeEvent, SpeechStopResponse, SearchResponse, BuildingList, Building, CampusId } from '../../../shared/contracts';
export async function api<T>(path:string, options?:RequestInit):Promise<T> {
  const controller=new AbortController();
  const external=options?.signal;
  const abort=()=>controller.abort(external?.reason);
  if(external?.aborted)abort();else external?.addEventListener('abort',abort,{once:true});
  const timeout=setTimeout(()=>controller.abort(new Error('transport_timeout')),(path==='/chat'||path==='/tours'||path.startsWith('/tours/'))?125000:15000);
  try {
    const response=await fetch('/api'+path,{...options,signal:controller.signal});
    let body:unknown;
    try { body=await response.json(); }
    catch(error) {
      if(controller.signal.aborted)throw error;
      throw {error:{code:'UPSTREAM_PROTOCOL_ERROR',message:'应用接口未返回有效 JSON。',request_id:null,retryable:false}};
    }
    if(!response.ok)throw body;
    return body as T;
  } catch(error) {
    if(controller.signal.aborted&&!external?.aborted)throw {error:{code:'TRANSPORT_TIMEOUT',message:'等待应用接口超时，请重试。',request_id:null,retryable:true}};
    throw error;
  } finally {clearTimeout(timeout);external?.removeEventListener('abort',abort);}
}
const json = (body:unknown):RequestInit => ({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
export const transport = {
  health:()=>api<Health>('/health'),
  knowledgeStatus:()=>api<KnowledgeStatus>('/knowledge/status'),
  search:(query:string,campus_id:CampusId,limit=5)=>api<SearchResponse>('/knowledge/search?'+new URLSearchParams({query,campus_id,limit:String(limit)})),
  buildings:(campus_id:CampusId)=>api<BuildingList>('/knowledge/buildings?campus_id='+campus_id),
  building:(id:string)=>api<Building>('/knowledge/buildings/'+encodeURIComponent(id)),
  chat:(body:ChatRequest,signal?:AbortSignal)=>api<ChatResponse>('/chat',{...json(body),signal}),
  events:(request_id:string,cursor=0)=>api<EventPage>('/runtime/events?request_id='+encodeURIComponent(request_id)+'&cursor='+cursor),
  cancel:(request_id:string,session_id:string)=>api<CancelResponse>('/requests/'+encodeURIComponent(request_id)+'/cancel',json({session_id})),
  speechStop:(request_id:string,session_id:string)=>api<SpeechStopResponse>('/speech/stop',json({request_id,session_id})),
  ack:(body:SceneAck)=>api<SceneAckResponse>('/scene/ack',json(body)),
  clientEvent:(body:ClientEventInput)=>api<RuntimeEvent>('/runtime/client-events',json(body))
};
