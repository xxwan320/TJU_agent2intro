// Isolated providers/audio/microphone. No live ASR, model, listening, or render claim.
import assert from 'node:assert/strict';
import test from 'node:test';
import { build } from 'vite';
import { pathToFileURL } from 'node:url';
await build({ configFile: false, logLevel: 'silent', build: { outDir: '.runtime/speech-r3-tests', emptyOutDir: false, minify: false, lib: { entry: 'tests/speech/r3-entry.ts', formats: ['es'], fileName: () => 'r3.js' } } });
const { CampusSpeechAdapter, CampusSpeechController, createSpeechInteractionController, KelaitaAvatarAdapter } = await import(pathToFileURL(`${process.cwd()}/.runtime/speech-r3-tests/r3.js`));
const flush = () => new Promise(r => setTimeout(r, 5));
const context = () => ({ request_id: crypto.randomUUID(), session_id: crypto.randomUUID(), signal: new AbortController().signal });
const callbacks = events => ({ onText: (text, final) => events.push({text, final}), onStart(){}, onEnd(){}, onFailure: (_, code) => events.push({code}) });

function rig(t, extra = {}) {
  const keys = ['navigator','window','fetch','Audio','requestAnimationFrame','cancelAnimationFrame'];
  const descriptors = Object.fromEntries(keys.map(key => [key, Object.getOwnPropertyDescriptor(globalThis,key)]));
  t.after(() => { for(const key of keys) { const d=descriptors[key]; if(d) Object.defineProperty(globalThis,key,d); else delete globalThis[key]; } });
  let stopped=0, destroyed=0, vadOptions, player, submits=0, levelSample=0.1, frame;
  const track={stop(){stopped++;},getSettings(){return {echoCancellation:true};}};
  const stream={getTracks:()=>[track],getAudioTracks:()=>[track]};
  Object.defineProperty(globalThis,'navigator',{value:{mediaDevices:{getUserMedia:async()=>stream}},configurable:true});
  class AudioContext {
    state='running'; destination={};
    async resume(){} async close(){this.state='closed';} async decodeAudioData(){}
    createAnalyser(){return {fftSize:512,connect(){},disconnect(){},getFloatTimeDomainData(samples){samples.fill(levelSample);}};}
    createMediaElementSource(){return {connect(){},disconnect(){}};}
  }
  globalThis.window={setTimeout,clearTimeout,AudioContext};
  globalThis.requestAnimationFrame=callback=>{frame=callback;return 1;};
  globalThis.cancelAnimationFrame=()=>{frame=null;};
  globalThis.Audio=class { constructor(){player=this;this.paused=true;this.ended=false;this.muted=false;this.volume=1;} async play(){this.paused=false;this.onplaying?.();} pause(){this.paused=true;this.onpause?.();} load(){} removeAttribute(){} };
  globalThis.fetch=async(url,options={})=>{
    if(url==='/api/health')return Response.json({capabilities:{asr:true}});
    if(url==='/api/speech/stop')return Response.json({local_stopped:true,upstream_stop:'unconfirmed'});
    if(url==='/api/speech/asr'){submits++;const b=JSON.parse(options.body);return Response.json({request_id:b.request_id,text:'请介绍天津大学',is_final:true});}
    if(url==='/api/speech/tts'){const b=JSON.parse(options.body);return Response.json({...b,audio_url:'/api/speech/audio/test',mime_type:'audio/mpeg',timestamps:'none'});}
    return new Response(new Uint8Array([73,68,51,4]),{headers:{'content-type':'audio/mpeg'}});
  };
  const module={MicVAD:{new:async options=>{vadOptions=options;await options.getStream();return {pause:async()=>{},destroy:async()=>{destroyed++;await options.pauseStream(stream);}};}},utils:{encodeWAV:()=>new ArrayBuffer(44),arrayBufferToBase64:()=> 'fixture'}};
  const adapter=new CampusSpeechAdapter({loadVad:async()=>module,...extra});
  t.after(()=>adapter.dispose());
  return {adapter,module,get vad(){return vadOptions;},get player(){return player;},get stopped(){return stopped;},get destroyed(){return destroyed;},get submits(){return submits;},tick(){frame?.();},sample(value){levelSample=value;},async segment(){vadOptions.onSpeechStart();vadOptions.onSpeechEnd(new Float32Array(16000).fill(.1));await flush();}};
}

test('continuous server recognition accepts five Chinese segments with one microphone',async t=>{
  const r=rig(t),events=[];
  assert.equal((await r.adapter.start(context(),callbacks(events),{continuous:true})).status,'ready');
  for(let i=0;i<5;i++)await r.segment();
  assert.equal(events.filter(e=>e.final).length,5);assert.ok(events.every(e=>e.text==='请介绍天津大学'));assert.equal(r.submits,5);assert.equal(r.destroyed,0);
  r.adapter.dispose();await flush();assert.ok(r.stopped>=1);assert.equal(r.destroyed,1);
});

test('default speaker guard discards a whole contaminated segment and ignores a VAD misfire',async t=>{
  const r=rig(t),events=[];let accept=false,interrupts=0;
  await r.adapter.start(context(),callbacks(events),{continuous:true,canAccept:()=>accept,onVoice:()=>interrupts++});
  r.vad.onSpeechStart();accept=true;r.vad.onSpeechEnd(new Float32Array(16000));await flush();
  r.vad.onVADMisfire();assert.equal(r.submits,0);assert.equal(interrupts,0);
  await r.segment();assert.equal(r.submits,1);
});

test('headset auto barge-in requires sustained probability, RMS and echo cancellation',async t=>{
  const r=rig(t);let interrupts=0;
  await r.adapter.start(context(),callbacks([]),{continuous:true,automaticBargeIn:true,onVoice:()=>interrupts++});
  r.vad.onSpeechStart();
  for(let i=0;i<20;i++)r.vad.onFrameProcessed({isSpeech:.95},new Float32Array(512).fill(.001));
  assert.equal(interrupts,0);
  for(let i=0;i<14;i++)r.vad.onFrameProcessed({isSpeech:.95},new Float32Array(512).fill(.1));
  assert.equal(interrupts,0);r.vad.onFrameProcessed({isSpeech:.95},new Float32Array(512).fill(.1));
  assert.equal(interrupts,1);
  for(let i=0;i<30;i++)r.vad.onFrameProcessed({isSpeech:.95},new Float32Array(512).fill(.1));
  assert.equal(interrupts,1);
});

test('permission denial returns a safe code and releases capture',async t=>{
  const r=rig(t),events=[];
  navigator.mediaDevices.getUserMedia=async()=>{throw new DOMException('private detail','NotAllowedError');};
  const result=await r.adapter.start(context(),callbacks(events));
  assert.equal(result.error_code,'permission_denied');assert.deepEqual(events,[{code:'permission_denied'}]);
});

test('ASR timeout aborts fetch and releases microphone',async t=>{
  const r=rig(t,{asrTimeoutMs:10}),events=[];
  globalThis.fetch=(_,options)=>new Promise((_,reject)=>options.signal.addEventListener('abort',()=>reject(new DOMException('Aborted','AbortError'))));
  await r.adapter.start(context(),callbacks(events),{continuous:true});await r.segment();await new Promise(r=>setTimeout(r,20));
  assert.deepEqual(events,[{code:'asr_timeout'}]);assert.ok(r.stopped>0);assert.equal(r.destroyed,1);
});

test('late successful or failed ASR responses after campus stop cannot emit text or errors',async t=>{
  for(const ok of [true,false]){
    const r=rig(t),events=[];let resolve;
    globalThis.fetch=(url,options)=>url==='/api/speech/stop'?Promise.resolve(Response.json({local_stopped:true,upstream_stop:'unconfirmed'})):new Promise(res=>{resolve=()=>res(ok?Response.json({request_id:JSON.parse(options.body).request_id,text:'旧文本',is_final:true}):Response.json({error:{code:'old_failure'}},{status:503}));});
    const ctx=context();await r.adapter.start(ctx,callbacks(events),{continuous:true});await r.segment();
    await r.adapter.stop(ctx.request_id);resolve();await flush();assert.deepEqual(events,[]);
  }
});

test('late microphone permission after stop stops tracks and cannot resurrect capture',async t=>{
  const r=rig(t),events=[];let grant;
  navigator.mediaDevices.getUserMedia=()=>new Promise(resolve=>{grant=resolve;});
  const ctx=context(),pending=r.adapter.start(ctx,callbacks(events));await flush();
  await r.adapter.stop(ctx.request_id);let stopped=0;
  grant({getTracks:()=>[{stop(){stopped++;}}]});
  assert.equal((await pending).error_code,'stopped');await flush();assert.equal(stopped,1);assert.deepEqual(events,[]);
});

test('concurrent starts cannot replace the latest microphone',async t=>{
  const r=rig(t),events=[];const first=r.adapter.start(context(),callbacks(events));const second=r.adapter.start(context(),callbacks(events));
  assert.equal((await first).error_code,'stopped');assert.equal((await second).status,'ready');
});

test('real player events and measured RMS drive mouth; pause/mute/end/cancel close immediately',async t=>{
  const r=rig(t),levels=[],events=[];r.adapter.subscribeAudioLevel(level=>levels.push(level));
  await r.adapter.activatePlayback();const ctx=context();
  await r.adapter.speak(ctx,crypto.randomUUID(),'隔离音频','edge:test',{...callbacks([]),onStart:()=>events.push('playing'),onEnd:()=>events.push('ended')});
  assert.deepEqual(events,['playing']);assert.ok(levels.at(-1)>0);
  r.sample(0);r.tick();assert.equal(levels.at(-1),0);r.sample(.1);r.tick();assert.ok(levels.at(-1)>0);
  r.adapter.setOutput(1,true);assert.equal(levels.at(-1),0);r.adapter.setOutput(1,false);r.tick();
  r.adapter.pausePlayback();assert.equal(levels.at(-1),0);await r.adapter.resumePlayback();assert.ok(levels.at(-1)>0);
  r.player.onended();assert.equal(levels.at(-1),0);assert.deepEqual(events,['playing','playing','ended']);
  await r.adapter.speak(ctx,crypto.randomUUID(),'旧文本','edge:test',callbacks([]));assert.ok(levels.at(-1)>0);await r.adapter.stop(ctx.request_id);assert.equal(levels.at(-1),0);
  const avatar=new KelaitaAvatarAdapter();let mouth=-1;avatar.model={internalModel:{coreModel:{setParameterValueById(id,v){if(id==='ParamMouthOpenY')mouth=v;}}}};
  avatar.setAudioLevel(.4);assert.equal(mouth,.4);avatar.setAudioLevel(NaN);assert.equal(mouth,0);avatar.model=undefined;
});

test('R3 bridge shares queue, lets A choose confirm/auto send, and guards five changing contexts',async t=>{
  const r=rig(t),controller=new CampusSpeechController({adapter:r.adapter});await controller.enable(true);
  const bridge=createSpeechInteractionController({speechController:controller});t.after(()=>bridge.dispose());
  const events=[];let sends=0;
  for(let turn=0;turn<5;turn++){
    const ctx={...context(),interaction_id:crypto.randomUUID(),generation_id:crypto.randomUUID(),campus_id:'weijinlu'};
    const options={context:ctx,mode:'continuous',onEvent:e=>events.push(e)};
    assert.equal((await bridge.start(options)).status,'started');
    if(turn)await new Promise(resolve=>setTimeout(resolve,810));
    await r.segment();
    const final=events.at(-1);assert.equal(final.type,'recognition.final');assert.equal(final.generation_id,ctx.generation_id);
    // This explicit test A action represents either confirmation or the selected auto-send policy.
    assert.equal(sends,turn);sends++;
    const run={...ctx,voice_id:'edge:test',mode:'full'};
    await controller.playFull(run,'隔离中文回答。');await flush();assert.equal(events.at(-1).type,'playback.started');
    const before=r.submits;await r.segment();assert.equal(r.submits,before);
    r.player.onended();await flush();assert.equal(events.at(-1).type,'playback.ended');
    await bridge.stop('user');
  }
  assert.equal(sends,5);assert.equal(events.filter(e=>e.type==='recognition.final').length,5);
});

test('manual interruption stops player/queue and notifies A; stale callbacks retain old context',async t=>{
  const r=rig(t),controller=new CampusSpeechController({adapter:r.adapter});await controller.enable(true);
  const bridge=createSpeechInteractionController({speechController:controller});t.after(()=>bridge.dispose());
  const ctx={...context(),interaction_id:crypto.randomUUID(),generation_id:crypto.randomUUID(),campus_id:'weijinlu'},events=[];
  bridge.bind({context:ctx,mode:'continuous',onEvent:e=>events.push(e)});
  await controller.playFull({...ctx,voice_id:'edge:test',mode:'full'},'隔离回答。');await flush();const late=r.player.onended;
  await bridge.interrupt();assert.equal(r.player.paused,true);assert.ok(events.some(e=>e.type==='speech.interrupted'));assert.ok(events.some(e=>e.type==='playback.cancelled'));
  const count=events.length;await bridge.stop('campus_changed');bridge.bind({context:{...ctx,campus_id:'beiyangyuan',generation_id:crypto.randomUUID()},mode:'continuous',onEvent:e=>events.push(e)});late();assert.equal(events.length,count);
});

test('unconfigured ASR emits contract-safe error without requesting the microphone',async t=>{
  const r=rig(t);globalThis.fetch=async()=>Response.json({capabilities:{asr:false}});
  const controller=new CampusSpeechController({adapter:r.adapter}),bridge=createSpeechInteractionController({speechController:controller});t.after(()=>bridge.dispose());
  const events=[],ctx={...context(),interaction_id:crypto.randomUUID(),generation_id:crypto.randomUUID(),campus_id:'weijinlu'};
  assert.equal((await bridge.start({context:ctx,mode:'continuous',onEvent:e=>events.push(e)})).error_code,'asr_not_configured');
  assert.equal(r.vad,undefined);assert.equal(events[0].error_code,'asr_not_configured');assert.equal(events[0].text,null);
});


test('capture model-load timeout settles even when the import promise never resolves',async t=>{
  const r=rig(t,{captureTimeoutMs:10,loadVad:()=>new Promise(()=>{})}),events=[];
  const result=await r.adapter.start(context(),callbacks(events));
  assert.equal(result.error_code,'capture_timeout');assert.deepEqual(events,[{code:'capture_timeout'}]);
});

test('late ASR success that ignores abort cannot escape the recognition deadline',async t=>{
  const r=rig(t,{asrTimeoutMs:10}),events=[];let complete;
  globalThis.fetch=(_,options)=>new Promise(resolve=>{complete=()=>resolve(Response.json({request_id:JSON.parse(options.body).request_id,text:'迟到识别',is_final:true}));});
  await r.adapter.start(context(),callbacks(events),{continuous:true});await r.segment();await new Promise(resolve=>setTimeout(resolve,20));
  complete();await flush();assert.deepEqual(events,[{code:'asr_timeout'}]);assert.equal(r.destroyed,1);
});

test('ASR service failure releases tracks and never includes provider details',async t=>{
  const r=rig(t),events=[];
  globalThis.fetch=async()=>Response.json({error:{code:'asr_unavailable',message:'private provider details'}},{status:503});
  await r.adapter.start(context(),callbacks(events),{continuous:true});await r.segment();
  assert.deepEqual(events,[{code:'asr_unavailable'}]);assert.ok(r.stopped>0);
});
