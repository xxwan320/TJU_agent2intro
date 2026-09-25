// Isolated IO/controller tests. Browser media measurements live in verify-guide-browser.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'vite';
import {pathToFileURL} from 'node:url';
await build({configFile:false,logLevel:'silent',build:{outDir:'.runtime/guide-session-tests',emptyOutDir:false,minify:false,lib:{entry:'tests/ui/guide-entry.ts',formats:['es'],fileName:()=> 'guide.js'}}});
const {introductionIntent,NarrationSession,cachedRead,CampusSpeechController,presentationText,tourPhotosFor}=await import(pathToFileURL(process.cwd()+'/.runtime/guide-session-tests/guide.js'));
const poi=(id,name,campus='weijinlu')=>({id,name,campus_id:campus,aliases:[],description:'校园里的参观地点。'});
const a=poi('a','第九教学楼'),b=poi('b','郑东图书馆','beiyangyuan');
const flush=()=>new Promise(r=>setTimeout(r,0));
const deferred=()=>{let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};};
test('process labels are omitted while factual uncertainty stays visible',()=>{
 assert.equal(presentationText('资料查询：本次查询范围内未取得依据\n今天的开放时间暂不清楚。\n**核查通过**\n郑东图书馆位于北洋园。'),'今天的开放时间暂不清楚。\n郑东图书馆位于北洋园。');
});

test('explicit introduction and control share canonical identity; navigation/mentions never introduce',()=>{
 for(const text of ['介绍一下这里','给我讲讲这个地方','这里有什么特色'])assert.equal(introductionIntent(text,[a,b],a).poi.id,'a');
 assert.equal(introductionIntent('介绍一下郑东图书馆',[a,b],a).poi.campus_id,'beiyangyuan');
 for(const text of ['导航到郑东图书馆','郑东图书馆地址','郑东图书馆在哪','路过郑东图书馆'])assert.equal(introductionIntent(text,[a,b],a).kind,'none');
 for(const [text,action] of [['暂停','pause'],['继续','resume'],['停止讲解','stop'],['换一个地方','change']])assert.equal(introductionIntent(text,[a,b],a).action,action);
 assert.equal(introductionIntent('介绍一下这里',[b],a).kind,'clarify');
 const c={...a,id:'c',campus_id:'beiyangyuan'};
 assert.equal(introductionIntent('介绍第九教学楼',[a,c],a).candidates.length,2);
 assert.equal(introductionIntent('介绍北洋园第九教学楼',[a,c],a).poi.id,'c');
});
test('broad conversation never requires selecting a location; follow-up media uses discussed identity',()=>{
 for(const selected of [null,a])for(const text of ['介绍一下天津大学','介绍天津大学的文化','介绍一下海小棠','你好'])assert.equal(introductionIntent(text,[a,b],selected).kind,'none');
 assert.equal(introductionIntent('请进一步介绍',[a,b],b).poi.id,b.id);
 assert.equal(introductionIntent('详细说说它',[a,b],b).poi.id,b.id);
 assert.equal(introductionIntent('介绍郑东图书馆，不用视频',[a,b],b).kind,'none');
 assert.equal(introductionIntent('郑东图书馆怎么样',[a,b],b).kind,'none');
});

test('shared read cancels consumers independently and never mixes campus/cache keys',async()=>{
 const read=cachedRead(),one=new AbortController(),two=new AbortController(),io=deferred();let calls=0,signal;
 const fetcher=s=>{calls++;signal=s;return io.promise;};
 const p=read('weijinlu:a',one.signal,fetcher),q=read('weijinlu:a',two.signal,fetcher);
 const rejection=assert.rejects(p);one.abort();await rejection;assert.equal(signal.aborted,false);
 io.resolve({name:'a'});assert.deepEqual(await q,{name:'a'});assert.equal(calls,1);
 await read('weijinlu:a',two.signal,fetcher);assert.equal(calls,1);
 await read('beiyangyuan:a',undefined,async()=>{calls++;return {name:'other'};});assert.equal(calls,2);
});

function speechMock(){
 let listener;return {runs:[],subscribe(fn){listener=fn;return()=>{};},enable:async()=>({status:'ready'}),stop:async()=>{},pause:async()=>({status:'ready'}),resume:async()=>({status:'ready'}),playFull:async function(run,text){this.runs.push({run,text});return {status:'ready'};},emit(value){listener(value);}};
}
test('narration binds a point-specific image carousel and ignores late speech from the replaced point',async t=>{
 const original=globalThis.fetch;t.after(()=>globalThis.fetch=original);
 const requests=[];globalThis.fetch=async url=>{requests.push(String(url));return Response.json({evidence:[]});};
 const photoA=poi('weijinlu-aiwan-lake','爱晚湖'),photoB=poi('beiyangyuan-zhengdong-library','郑东图书馆','beiyangyuan');
 const speech=speechMock();let current;const session=new NarrationSession(speech,value=>current=value);t.after(()=>session.dispose());
 await session.start(photoA,'a',crypto.randomUUID(),'v');const old=current.id;assert.equal(current.photos.length,2);
 await session.start(photoB,'b',crypto.randomUUID(),'v');const next=current.id;
 speech.emit({generation_id:old,status:'speaking',text:'old'});await flush();assert.equal(current.id,next);assert.equal(current.photos.length,3);assert.ok(current.photos.every(photo=>photo.caption==='郑东图书馆'));
 await session.stop();assert.equal(current.status,'stopped');assert.ok(requests.every(url=>!url.includes('/videos/search')));
});
test('reused image sequences keep the target point identity',()=>{
 const photos=tourPhotosFor('weijinlu-gym','体育馆');assert.equal(photos.length,2);assert.ok(photos.every(photo=>photo.caption==='体育馆'));assert.match(photos[1].src,/-2\.jpg$/);
});
test('permission failure has an actionable session retry, not permanent fake buffering',async t=>{
 const original=globalThis.fetch;t.after(()=>globalThis.fetch=original);globalThis.fetch=async()=>Response.json({evidence:[]});
 const speech=speechMock();speech.enable=async()=>({status:'failed'});let current;const session=new NarrationSession(speech,v=>current=v);t.after(()=>session.dispose());
 await session.start(a,'permission-retry',crypto.randomUUID(),'v');assert.equal(current.status,'error');
 speech.enable=async()=>({status:'ready'});await session.resume();assert.equal(speech.runs.length,1);assert.notEqual(current.status,'error');
});

function adapterMock(){return {activatePlayback:async()=>({status:'ready'}),stop:async()=>{},pausePlayback:()=>({status:'ready'}),resumePlayback:async()=>({status:'ready'}),releasePrepared(){},dispose(){},async prepareSpeech(c,id,text){return {id,text};},async playPreparedSpeech(p,cb){cb.onStart(p.id);return {status:'ready'};}};}
const run=()=>({request_id:crypto.randomUUID(),session_id:crypto.randomUUID(),campus_id:'weijinlu',generation_id:crypto.randomUUID(),voice_id:'v',mode:'full',signal:new AbortController().signal});
test('pause during TTS preparation prevents playback until resume',async t=>{
 const adapter=adapterMock(),io=deferred();let plays=0,prepares=0;
 adapter.prepareSpeech=async(c,id,text)=>{prepares++;if(prepares===1)await io.promise;return {id,text};};
 adapter.playPreparedSpeech=async(p,cb)=>{plays++;cb.onStart(p.id);return {status:'ready'};};
 const controller=new CampusSpeechController({adapter});t.after(()=>controller.dispose());await controller.enable(true);await controller.playFull(run(),'这是准备阶段暂停的讲解。');
 await controller.pause();io.resolve();await flush();assert.equal(plays,0);
 await controller.resume();await flush();assert.equal(plays,1);
});
test('failed TTS segment retries once through the same queue on resume',async t=>{
 const adapter=adapterMock();let prepares=0,plays=0;
 adapter.prepareSpeech=async(c,id,text)=>++prepares===1?{status:'failed',error_code:'tts_unavailable'}:{id,text};
 adapter.playPreparedSpeech=async(p,cb)=>{plays++;cb.onStart(p.id);return {status:'ready'};};
 const controller=new CampusSpeechController({adapter});t.after(()=>controller.dispose());await controller.enable(true);await controller.playFull(run(),'这是网络失败后重试的讲解。');await flush();
 await controller.resume();await flush();assert.equal(plays,1);assert.equal(prepares,2);
});
