import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'vite';
import {pathToFileURL} from 'node:url';
await build({configFile:false,logLevel:'silent',build:{outDir:'.runtime/r3-test',emptyOutDir:false,minify:false,lib:{entry:'frontend/src/transport/r3.ts',formats:['es'],fileName:()=> 'r3.js'}}});
const {acceptsTourResult,r3Transport}=await import(pathToFileURL(process.cwd()+'/.runtime/r3-test/r3.js'));
test('late, foreign-campus, wrong-request and stale-state responses are rejected',()=>{
 const ctx={requestId:'request',sessionId:'session',campusId:'weijinlu',generation:2,tourId:'tour',planVersion:2,stateVersion:4};
 const result={request_id:'request',session:{tour_id:'tour',session_id:'session',state_version:4,plan:{campus_id:'weijinlu',version:2}}};
 assert.equal(acceptsTourResult(result,ctx,2),true);
 assert.equal(acceptsTourResult(result,ctx,3),false);
 for(const patch of [{requestId:'old'},{campusId:'beiyangyuan'},{sessionId:'other'},{tourId:'other'},{planVersion:3},{stateVersion:5}])
  assert.equal(acceptsTourResult(result,{...ctx,...patch},2),false);
});
test('tour transport preserves cancellation and does not replay POST automatically',async()=>{
 const original=globalThis.fetch;let calls=0;
 try {
  globalThis.fetch=async(url,options)=>{
   calls++;assert.equal(url,'/api/tours');assert.equal(options.method,'POST');
   return new Promise((resolve,reject)=>options.signal.addEventListener('abort',()=>reject(options.signal.reason)));
  };
  const control=new AbortController();
  const promise=r3Transport.create({request_id:'test-only'},control.signal);
  control.abort(new Error('user-cancelled'));
  await assert.rejects(promise,{message:'user-cancelled'});
  assert.equal(calls,1);
 } finally {globalThis.fetch=original;}
});