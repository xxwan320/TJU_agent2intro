// Controlled transport delays, no external services or real device claims.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import {createParser} from 'eventsource-parser';
const source=fs.readFileSync('frontend/src/transport/harness.ts','utf8').replace("import {createParser} from 'eventsource-parser';",'const createParser=globalThis.__closeoutParser;');
globalThis.__closeoutParser=createParser;
const {HarnessClient}=await import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText).toString('base64'));
const context={sessionId:'unused',campusId:'beiyangyuan',channel:'harness'};
const deferred=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};};
const tick=()=>new Promise(r=>setImmediate(r));
test('C12 stop during session establishment prevents any run submission',async()=>{
 const old=globalThis.fetch,session=deferred(),calls=[];
 globalThis.fetch=async(url)=>{calls.push(url);if(url.endsWith('/sessions'))return session.promise;return new Response('');};
 try{const client=new HarnessClient();const task=client.run(context,'',undefined,()=>{},async()=>{});await tick();await client.cancel();session.resolve(Response.json({sessionId:'s',token:'t'}));await task;assert.equal(calls.filter(x=>x.endsWith('/runs')).length,0);}
 finally{globalThis.fetch=old;}
});
test('C12 newer run supersedes an older session wait even if replies arrive reversed',async()=>{
 const old=globalThis.fetch,sessions=[deferred(),deferred()],submitted=[];let count=0;
 globalThis.fetch=async(url,options)=>{if(url.endsWith('/sessions'))return sessions[count++].promise;if(url.endsWith('/runs'))submitted.push(JSON.parse(options.body).message);return new Response('');};
 try{const client=new HarnessClient();const first=client.run(context,'old',undefined,()=>{},async()=>{});await tick();const second=client.run({...context,campusId:'weijinlu'},'new',undefined,()=>{},async()=>{});await tick();sessions[1].resolve(Response.json({sessionId:'new',token:'t'}));await second;sessions[0].resolve(Response.json({sessionId:'old',token:'t'}));await first;assert.deepEqual(submitted,['new']);}
 finally{globalThis.fetch=old;}
});
