// All browser objects below are explicit TEST_PROVIDER fixtures; no real device claims.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
const source=readFileSync(new URL('../../frontend/src/device/a-device.ts',import.meta.url),'utf8');
const {createDeviceExecutor}=await import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64'));
const trusted={isTrusted:true,type:'click'};
const session=()=>({sessionId:'s',campusId:'beiyangyuan',channel:'web',generation:1,deviceId:'d',connected:true,expiresAt:new Date(Date.now()+60000).toISOString()});
let sequence=0;
const req=(s,patch={})=>({schemaVersion:'1.0',runId:'r',toolCallId:'c'+ ++sequence,toolName:'device_open_app',input:{appId:'map'},context:{...s},deadlineAt:new Date(Date.now()+1000).toISOString(),cancelToken:'cancel',idempotencyKey:'key'+sequence,...patch});
const next=r=>({...r,toolCallId:r.toolCallId+'next',deadlineAt:new Date(Date.now()+1000).toISOString()});
const pending=async(e,r)=>{const p=await e.execute_tool(r);assert.equal(p.status,'pending_user_action');return p.data.pendingAction.actionId;};

test('probe requires configured APIs and does not invoke permissions or app callbacks',async()=>{
 const s=session();let count=0;const e=createDeviceExecutor({getSession:()=>s,apps:{map:async()=>{count++;}}});
 const caps=e.list_capabilities(s);assert.equal(count,0);assert.equal(caps.find(c=>c.toolName==='device_open_app').status,'needs_permission');
 assert.equal(caps.find(c=>c.toolName==='speech_input').status,'unavailable');assert.equal(caps.find(c=>c.toolName==='device_pick_document').status,'unavailable');
 const result=await e.execute_tool(req(s,{toolName:'device_capabilities'}));assert.equal(result.status,'completed');assert.equal(result.data.generation,1);assert.ok(!('runId' in result));e.disconnect();
});
test('unknown apps and spoofed session fail before creating an action',async()=>{
 const s=session(),e=createDeviceExecutor({getSession:()=>s,apps:{map:async()=>({verified:true})}});
 assert.equal((await e.execute_tool(req(s,{input:{appId:'unknown'}}))).error.code,'SOURCE_UNAVAILABLE');
 assert.equal((await e.execute_tool(req({...s,deviceId:'wrong'}))).error.code,'PERMISSION_DENIED');e.disconnect();
});
test('trusted continuation has fresh correlation; duplicate actions never run twice',async()=>{
 const s=session();let count=0;const e=createDeviceExecutor({getSession:()=>s,apps:{map:async()=>{count++;return {verified:true,observation:'fixture open receipt',traceRef:'TEST_PROVIDER'};}}});
 const r=req(s),id=await pending(e,r);assert.equal((await e.resume_tool(id,next(r),{isTrusted:false,type:'click'})).error.code,'PERMISSION_DENIED');
 assert.equal((await e.resume_tool(id,r,trusted)).error.code,'PERMISSION_DENIED');
 const result=await e.resume_tool(id,next(r),trusted);assert.equal(result.status,'completed');assert.equal(result.data.originalToolCallId,r.toolCallId);
 assert.equal((await e.execute_tool({...r,toolCallId:'duplicate'})).error.code,'DUPLICATE_ACTION');assert.equal(count,1);e.disconnect();
});
test('cancel and disconnect tombstones prohibit replay',async()=>{
 const s=session(),e=createDeviceExecutor({getSession:()=>s,apps:{map:async()=>{throw Error('must not run');}}});
 const r=req(s),id=await pending(e,r);assert.equal(e.cancel_tool(r.runId,r.toolCallId).status,'cancelled');assert.equal((await e.resume_tool(id,next(r),trusted)).status,'failed');
 assert.equal((await e.execute_tool(r)).error.code,'DUPLICATE_ACTION');e.disconnect();assert.equal((await e.execute_tool(req(s))).error.code,'DEVICE_DISCONNECTED');
});
test('expired pending actions and stale generations cannot resume',async()=>{
 let s=session();const e=createDeviceExecutor({getSession:()=>s,apps:{map:async()=>({verified:true})}});
 const r=req(s,{deadlineAt:new Date(Date.now()+20).toISOString()}),id=await pending(e,r);await new Promise(r=>setTimeout(r,40));assert.equal((await e.resume_tool(id,next(r),trusted)).status,'failed');
 const r2=req(s),id2=await pending(e,r2);s={...s,generation:2};assert.equal((await e.resume_tool(id2,next(r2),trusted)).error.code,'PERMISSION_DENIED');e.disconnect();
});
test('uncooperative in-flight providers are bounded and cancelled',async()=>{
 const s=session();let signal;const e=createDeviceExecutor({getSession:()=>s,apps:{map:({signal:s})=>{signal=s;return new Promise(()=>{});}}});
 const r=req(s),id=await pending(e,r),resume=next(r);resume.deadlineAt=new Date(Date.now()+30).toISOString();
 const result=await e.resume_tool(id,resume,trusted);assert.equal(result.error.code,'TIMEOUT');assert.equal(signal.aborted,true);e.disconnect();
});
test('late results after generation changes cannot complete',async()=>{
 let s=session();const e=createDeviceExecutor({getSession:()=>s,apps:{map:()=>new Promise(()=>{})}});
 const r=req(s),id=await pending(e,r),promise=e.resume_tool(id,next(r),trusted);s={...s,generation:2};const result=await promise;assert.equal(result.error.code,'PERMISSION_DENIED');e.disconnect();
});
test('unverified app receipt cannot claim successful opening',async()=>{
 const s=session(),e=createDeviceExecutor({getSession:()=>s,apps:{map:async()=>({verified:false,observation:'assigned URI',traceRef:'TEST_PROVIDER'})}});
 const r=req(s),id=await pending(e,r);assert.equal((await e.resume_tool(id,next(r),trusted)).error.code,'NO_EVIDENCE');e.disconnect();
});
test('share resolution means no verified delivery and AbortError means cancelled',async()=>{
 const saved=Object.getOwnPropertyDescriptor(globalThis,'navigator');
 const savedDoc=globalThis.document,savedSecure=globalThis.isSecureContext;
 globalThis.document={};globalThis.isSecureContext=true;
 let cancelled=false;Object.defineProperty(globalThis,'navigator',{configurable:true,value:{share:async()=>{if(cancelled)throw new DOMException('cancel','AbortError');}}});
 try {const s=session(),e=createDeviceExecutor({getSession:()=>s});let r=req(s,{toolName:'device_share',input:{text:'test'}}),id=await pending(e,r);const result=await e.resume_tool(id,next(r),trusted);assert.equal(result.status,'completed');assert.equal(result.data.sent,false);
 cancelled=true;r=req(s,{toolName:'device_share',input:{text:'test'}});id=await pending(e,r);assert.equal((await e.resume_tool(id,next(r),trusted)).status,'cancelled');e.disconnect();}
 finally {if(saved)Object.defineProperty(globalThis,'navigator',saved);else delete globalThis.navigator;globalThis.document=savedDoc;globalThis.isSecureContext=savedSecure;}
});
test('file cancel never uploads; a selected markdown yields only uploadId',async()=>{
 const savedDoc=globalThis.document;let input,uploads=0,removed=0;
 globalThis.document={body:{appendChild(){}},createElement(){input=new EventTarget();input.remove=()=>removed++;input.click=()=>{};return input;}};
 try {const s=session(),e=createDeviceExecutor({getSession:()=>s,upload:async(file)=>{uploads++;assert.equal(file.name,'notice.md');return {uploadId:'fixture-id'};}});
 let r=req(s,{toolName:'device_pick_document',input:{}}),id=await pending(e,r),p=e.resume_tool(id,next(r),trusted);input.dispatchEvent(new Event('cancel'));assert.equal((await p).status,'cancelled');assert.equal(uploads,0);
 r=req(s,{toolName:'device_pick_document',input:{}});id=await pending(e,r);p=e.resume_tool(id,next(r),trusted);input.files=[new File(['notice'],'notice.md')];input.dispatchEvent(new Event('change'));const result=await p;assert.equal(result.data.uploadId,'fixture-id');assert.equal(uploads,1);assert.equal(removed,2);e.disconnect();}
 finally {globalThis.document=savedDoc;}
});
test('injected existing speech adapter handles permission denial and final text',async()=>{
 const saved=Object.getOwnPropertyDescriptor(globalThis,'navigator'),savedDoc=globalThis.document,savedSecure=globalThis.isSecureContext;
 globalThis.document={};globalThis.isSecureContext=true;Object.defineProperty(globalThis,'navigator',{configurable:true,value:{mediaDevices:{getUserMedia(){throw Error('probe must not call getUserMedia');}}}});
 let deny=true,stops=0;
 const speechAdapter={capabilities:{asr:true},async start(context,callbacks){assert.equal(context.session_id,'s');if(deny)return {status:'failed',error_code:'permission_denied'};callbacks.onText('天津大学',true);return {status:'ready'};},async stop(){stops++;}};
 try {const s=session(),e=createDeviceExecutor({getSession:()=>s,speechAdapter});assert.equal(e.list_capabilities(s).find(c=>c.toolName==='speech_input').status,'needs_permission');let r=req(s,{toolName:'speech_input',input:{}}),id=await pending(e,r);assert.equal((await e.resume_tool(id,next(r),trusted)).error.code,'PERMISSION_DENIED');
 deny=false;r=req(s,{toolName:'speech_input',input:{}});id=await pending(e,r);const result=await e.resume_tool(id,next(r),trusted);assert.equal(result.data.text,'天津大学');assert.equal(result.data.audioDurationMs,null);assert.equal(stops,2);e.disconnect();}
 finally {if(saved)Object.defineProperty(globalThis,'navigator',saved);else delete globalThis.navigator;globalThis.document=savedDoc;globalThis.isSecureContext=savedSecure;}
});
test('Windows API absence stays unavailable and all emitted shapes validate against B Python contract',async()=>{
 const saved=Object.getOwnPropertyDescriptor(globalThis,'navigator'),savedDoc=globalThis.document;
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{userAgent:'TEST_PROVIDER Windows NT 10.0'}});globalThis.document={};
 try {const s=session(),e=createDeviceExecutor({getSession:()=>s,apps:{map:async()=>({verified:true,observation:'TEST_PROVIDER receipt',traceRef:'fixture'})}});
 const capabilities=e.list_capabilities(s);assert.equal(capabilities.find(c=>c.toolName==='device_share').status,'unavailable');
 const probe=await e.execute_tool(req(s,{toolName:'device_capabilities'}));assert.match(probe.data.platform,/Windows/);
 const r=req(s),p=await e.execute_tool(r);const done=await e.resume_tool(p.data.pendingAction.actionId,next(r),trusted);
 const r2=req(s),p2=await e.execute_tool(r2);const cancelled=e.cancel_tool(r2.runId,r2.toolCallId);
 const failed=await e.execute_tool(req(s,{input:{appId:'missing'}}));
 const root=fileURLToPath(new URL('../../',import.meta.url));
 const check=spawnSync(resolve(root,'.venv/Scripts/python.exe'),['-B','-c','import json,sys; from backend.harness_contracts import Capability,ToolResult; d=json.load(sys.stdin); [Capability.model_validate(x) for x in d["capabilities"]]; [ToolResult.model_validate(x) for x in d["results"]]; print("B schema valid")'],{cwd:root,input:JSON.stringify({capabilities,results:[probe,p,done,p2,cancelled,failed]}),encoding:'utf8'});
 assert.equal(check.status,0,check.stderr);assert.match(check.stdout,/B schema valid/);e.disconnect();}
 finally {if(saved)Object.defineProperty(globalThis,'navigator',saved);else delete globalThis.navigator;globalThis.document=savedDoc;}
});
