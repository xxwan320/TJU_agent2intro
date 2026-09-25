import {createParser} from 'eventsource-parser';
import type {HarnessEvent,ToolContext,ToolRequest,ToolResult} from '../../../shared/harness';
export class HarnessClient {
 private active:{abort:AbortController;runId:string;token:string;context:ToolContext}|null=null;
 generation=0;
 private requestEpoch=0;
 private sessions=new Map<string,{sessionId:string;token:string}>();
 async session(campusId:string){let s=this.sessions.get(campusId);if(!s){const r=await fetch('/api/harness/sessions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({campusId})});if(!r.ok)throw Error('会话无法建立');s=await r.json() as {sessionId:string;token:string};this.sessions.set(campusId,s);}return s;}
 context:ToolContext|null=null;
 deviceCapabilities:Record<string,unknown>[]=[];
 onContext:((context:ToolContext)=>void)|null=null;
 async upload(file:File,request:ToolRequest,signal:AbortSignal){
  if(file.size>1024*1024)throw Error('文档不得超过1MiB');
  const session=await this.session(request.context.campusId);
  const response=await fetch('/api/harness/upload-ticket',{method:'POST',headers:{'Content-Type':'application/json','X-Harness-Session':session.token},body:JSON.stringify(request.context),signal});if(!response.ok)throw Error('上传授权已失效');const ticket=await response.json();
  const bytes=new Uint8Array(await file.arrayBuffer());let binary='';for(const value of bytes)binary+=String.fromCharCode(value);
  const uploaded=await fetch(ticket.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({uploadToken:ticket.uploadToken,filename:file.name,contentBase64:btoa(binary)}),signal});if(!uploaded.ok)throw Error('文档上传失败');return await uploaded.json() as {uploadId:string};
 }

 async cancel(){++this.requestEpoch;const a=this.active;this.active=null;if(!a)return;a.abort.abort();if(a.runId)await fetch(`/api/harness/runs/${a.runId}/cancel`,{method:'POST',headers:{'X-Harness-Token':a.token}}).catch(()=>null);}
 async run(context:Omit<ToolContext,'generation'>,message:string,direct:{toolName:string;input:Record<string,unknown>}|undefined,onEvent:(e:HarnessEvent,token:string)=>void,execute:(r:ToolRequest,signal:AbortSignal)=>Promise<ToolResult>){
  const cancelling=this.cancel();
  const epoch=this.requestEpoch;
  await cancelling;
  if(epoch!==this.requestEpoch)return;
  const session=await this.session(String(context.campusId));context={...context,sessionId:session.sessionId};
  if(epoch!==this.requestEpoch)return;
  const a={abort:new AbortController(),runId:'',token:'',context:{...context,generation:++this.generation} as ToolContext};this.active=a;this.context=a.context;this.onContext?.(a.context);
  const timer=setTimeout(()=>{if(this.active===a)void this.cancel();},46000);
  const current=()=>this.active===a&&!a.abort.signal.aborted;
  const pending:Promise<void>[]=[];
  try{
   const response=await fetch('/api/harness/runs',{method:'POST',headers:{'Content-Type':'application/json','X-Harness-Session':session.token},body:JSON.stringify({context:a.context,message,deviceCapabilities:this.deviceCapabilities,...(direct?{direct}:{})}),signal:a.abort.signal});
   if(!response.ok||!response.body)throw Error('工具服务暂不可用');
   const reader=response.body.getReader(),decoder=new TextDecoder();
   const seen=new Set<string>();
   const parser=createParser({onEvent:event=>{
    const e=JSON.parse(event.data) as HarnessEvent;
    if(!current()||e.context.sessionId!==a.context.sessionId||e.context.campusId!==a.context.campusId||e.context.channel!==a.context.channel||e.context.generation!==a.context.generation)return;
    if(e.type==='accepted'){a.runId=e.runId;a.token=e.token??'';}
    if(e.runId!==a.runId)return;
    onEvent(e,a.token);
    if(e.type==='command'&&e.request&&!seen.has(e.request.toolCallId)){
     const request=e.request;seen.add(request.toolCallId);
     if(Date.parse(request.deadlineAt)<=Date.now())return;
     const work=(async()=>{
      const result=await execute(request,a.abort.signal);
      if(!current()||Date.parse(request.deadlineAt)<=Date.now())return;
      await fetch(`/api/harness/runs/${a.runId}/ack`,{method:'POST',headers:{'Content-Type':'application/json','X-Harness-Token':a.token},body:JSON.stringify({context:a.context,result}),signal:a.abort.signal});
     })();pending.push(work.catch(()=>undefined));
    }
   }});
   while(current()){const {value,done}=await reader.read();if(done)break;parser.feed(decoder.decode(value,{stream:true}));}
   parser.feed(decoder.decode());await Promise.all(pending);
  }finally{clearTimeout(timer);if(this.active===a)this.active=null;}
 }
}
export function observed(request:ToolRequest,data:Record<string,unknown>,type='client_applied'):ToolResult{return {toolCallId:request.toolCallId,status:'completed',data,sources:[],error:null,observedAt:new Date().toISOString(),evidence:[{type,observed:data}]};}
export function failed(request:ToolRequest,error:unknown):ToolResult{return {toolCallId:request.toolCallId,status:'failed',data:null,sources:[],error:{code:'NO_EVIDENCE',message:error instanceof Error?error.message:'操作没有完成证据'},observedAt:new Date().toISOString(),evidence:[]};}
export async function waitObserved(test:()=>boolean,signal:AbortSignal,deadline:string){while(!test()){if(signal.aborted)throw Error('已取消');if(Date.now()>=Date.parse(deadline))throw Error('等待实际操作回执超时');await new Promise(resolve=>setTimeout(resolve,50));}if(signal.aborted)throw Error('已取消');}
export async function downloadHarness(url:string,token:string,filename:string){
 if(!/^\/api\/harness\/files\/[\w-]+$/.test(url))throw Error('无效下载入口');
 const r=await fetch(url,{headers:{'X-Harness-Token':token}});if(!r.ok)throw Error('文件已过期或无权限');
 const blob=await r.blob(),href=URL.createObjectURL(blob),a=document.createElement('a');a.href=href;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(href),1000);
}
