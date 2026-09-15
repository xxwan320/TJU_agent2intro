import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'vite';
import {spawn} from 'node:child_process';
import {randomUUID as uuid} from 'node:crypto';
const output=await build({configFile:false,logLevel:'silent',build:{write:false,minify:false,lib:{entry:'frontend/src/ui/tour-model.ts',formats:['es'],fileName:()=> 'tour-model.js'}}});
const chunk=(Array.isArray(output)?output[0]:output).output.find(v=>v.type==='chunk');
const {TourLifecycle,tourCommand,privateText,savedSnapshot,storeSaved,listSaved,SAVED_PREFIX,speechEventCurrent,remainingTimeIntent}=await import('data:text/javascript;base64,'+Buffer.from(chunk.code).toString('base64'));
const sample=(version=1)=>({
 tour_id:'tour',session_id:'session',state_version:version,status:'draft',saved:false,remaining_minutes:60,current_stop_id:null,updated_at:'2026-09-15T00:00:00Z',
 plan:{plan_id:'plan',campus_id:'weijinlu',version,status:'draft',request:{request_id:'original',session_id:'session',campus_id:'weijinlu',duration_minutes:60,interests:['history'],start:{kind:'current_position'},end:{kind:'unspecified'}},stops:[{stop_id:'a',poi_id:'poi-a',title:'A',visit_minutes:10,visit_time_source:'planner_allocation',purpose:'history'}],legs:[],evidence:[],warnings:[],created_at:'2026-09-15T00:00:00Z'},progress:[{stop_id:'a',state:'pending'}]
});
const result=(id,version=1)=>({request_id:id,session:sample(version)});
function memoryStorage(){
 const data=new Map();return {get length(){return data.size;},key:i=>[...data.keys()][i]??null,getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};
}
test('T12 delayed create cannot overwrite the latest response; cancellation is sent remotely',async()=>{
 const cancellations=[];const lane=new TourLifecycle({},async(...args)=>{cancellations.push(args);});
 let resolve;let oldSignal;
 const old=lane.run('old','session','weijinlu',signal=>{oldSignal=signal;return new Promise(r=>resolve=r);});
 await lane.run('latest','session','weijinlu',async()=>result('latest',2));
 resolve(result('old',1));assert.equal(await old,null);
 assert.equal(lane.session.state_version,2);assert.ok(oldSignal.aborted);assert.deepEqual(cancellations,[['old','session']]);
});
test('T12 late responses after cancel/campus switch and foreign contexts are ignored',async()=>{
 const lane=new TourLifecycle({},async()=>null);let resolve;
 const old=lane.run('old','session','weijinlu',()=>new Promise(r=>resolve=r));await lane.invalidate();resolve(result('old'));assert.equal(await old,null);assert.equal(lane.session,null);
 for(const patch of [{request_id:'foreign'},{session:{...sample(),session_id:'other'}},{session:{...sample(),plan:{...sample().plan,campus_id:'beiyangyuan'}}}]){
  assert.equal(await lane.run('expected','session','weijinlu',async()=>({...result('expected'),...patch})),null);
 }
});
test('T11 both versions are monotonic; restore can replace tour ID',async()=>{
 const lane=new TourLifecycle({},async()=>null);lane.session=sample(5);
 assert.equal(await lane.run('old','session','weijinlu',async()=>result('old',4)),null);
 assert.equal(await lane.run('mixed','session','weijinlu',async()=>({request_id:'mixed',session:{...sample(6),plan:sample(4).plan}})),null);
 const restored={...sample(6),tour_id:'restored'};
 assert.equal((await lane.run('restore','session','weijinlu',async()=>({request_id:'restore',session:restored}),true)).session.tour_id,'restored');
});
test('T12 a delayed GET cannot overwrite a later mutation',async()=>{
 let resolve;const lane=new TourLifecycle({read:()=>new Promise(r=>resolve=r)},async()=>null);lane.session=sample();
 const old=lane.refresh();await lane.run('new','session','weijinlu',async()=>result('new',3));resolve(sample(2));assert.equal(await old,null);assert.equal(lane.session.state_version,3);
});
test('T10 only explicit saves survive refresh; forget and malformed records are handled',()=>{
 const storage=memoryStorage();const s=sample();storeSaved(storage,s);assert.equal(listSaved(storage).length,0);
 s.saved=true;storeSaved(storage,s);assert.equal(listSaved(storage)[0].tour_id,s.tour_id);
 storage.setItem(SAVED_PREFIX+'bad','{"saved":true}');assert.equal(listSaved(storage).length,1);
 storeSaved(storage,{...s,saved:false});assert.equal(listSaved(storage).length,0);
 assert.throws(()=>storeSaved({setItem(){throw Error('quota');},removeItem(){}},s),/quota/);
});
test('N03 snapshot projects known fields and strips free-text coordinates',()=>{
 const s=sample();s.saved=true;s.position={lat:39.123456,lng:117.123456};s.audio='recording';s.plan.polyline=[[117.123456,39.123456]];
 s.plan.request.interests=['history 117.123456,39.123456'];s.plan.request.start.coords=[117.123456,39.123456];
 s.plan.stops[0].purpose='latitude=39.123456 longitude=117.123456';
 const raw=JSON.stringify(savedSnapshot(s));for(const banned of ['117.123456','39.123456','polyline','recording','coords','"position"'])assert.ok(!raw.includes(banned),banned);
 assert.equal(privateText('60 minutes, 3-5 stops'),'60 minutes, 3-5 stops');
 assert.ok(!privateText('117.1,39.1').includes('117.1'));
});
test('S02 B events must match every context dimension; partial and final share the same guard',()=>{
 const c={interaction_id:'i',session_id:'s',campus_id:'weijinlu',generation_id:'g',request_id:null};
 for(const type of ['recognition.partial','recognition.final','speech.interrupted','playback.started','playback.ended']){
  assert.equal(speechEventCurrent({...c,type},c),true);
  for(const key of Object.keys(c))assert.equal(speechEventCurrent({...c,type,[key]:'old'},c),false);
 }
});
test('T04/T08/T10 command payload includes stop_id only for stop actions',()=>{
 const s={...sample(),current_stop_id:'a'};
 for(const action of ['check','start','next','pause','resume','cancel','save','forget'])assert.equal('stop_id' in tourCommand(s,'id',action),false);
 for(const action of ['arrive','explain','complete_stop'])assert.equal(tourCommand(s,'id',action).stop_id,'a');
 assert.equal(tourCommand(s,'id','save').expected_state_version,1);
});

test('FIXTURE HTTP: 3 stops to second stop, revise, pause/resume, save/restore and forget',async()=>{
 const port=8011,base='http://127.0.0.1:'+port;
 const existing=await fetch(base+'/api/tours/status',{signal:AbortSignal.timeout(700)}).then(()=>true).catch(()=>false);
 assert.equal(existing,false,'Port 8011 is occupied; do not reuse or stop an unknown process.');
 const child=spawn('.venv/Scripts/python.exe',['-m','uvicorn','r3_fixture:app','--app-dir','tests','--host','127.0.0.1','--port',String(port),'--no-access-log'],{cwd:process.cwd(),windowsHide:true,env:{...process.env,PYTHONDONTWRITEBYTECODE:'1'},stdio:'ignore'});
 const started=Date.now();let ready=false;
 try{
  while(Date.now()-started<15000){await new Promise(r=>setTimeout(r,150));ready=await fetch(base+'/api/tours/status').then(async r=>(await r.json()).fixture===true).catch(()=>false);if(ready)break;if(child.exitCode!==null)break;}
  assert.ok(ready,'M fixture must start');
  const post=async(path,body)=>{const response=await fetch(base+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});assert.equal(response.headers.get('X-R3-Fixture'),'TEST-ONLY');const value=await response.json();assert.equal(response.status,200,JSON.stringify(value));return value;};
  const sid=uuid();const request={request_id:uuid(),session_id:sid,campus_id:'weijinlu',duration_minutes:60,interests:['TEST ONLY history'],start:{kind:'unspecified'},end:{kind:'unspecified'}};
  let s=(await post('/api/tours',request)).session;assert.equal(s.plan.stops.length,3);
  const cmd=async action=>{s=(await post('/api/tours/'+s.tour_id+'/commands',tourCommand(s,uuid(),action))).session;};
  const revision=async patch=>{s=(await post('/api/tours/'+s.tour_id+'/revisions',{request_id:uuid(),session_id:s.session_id,expected_version:s.plan.version,expected_state_version:s.state_version,...patch})).session;};
  await cmd('check');await cmd('start');const first=s.current_stop_id;
  await cmd('arrive');await cmd('explain');await cmd('complete_stop');await cmd('next');
  assert.notEqual(s.current_stop_id,first);assert.equal(s.progress.find(p=>p.stop_id===first).state,'completed');
  const second=s.current_stop_id;await cmd('pause');assert.equal(s.status,'paused');
  await revision({operation:'set_remaining_time',remaining_minutes:30});assert.equal(s.remaining_minutes,30);
  await revision({operation:'replace_stop',stop_id:s.plan.stops.at(-1).stop_id,replacement_poi_id:'fixture-replacement'});assert.equal(s.plan.stops.at(-1).poi_id,'fixture-replacement');
  await revision({operation:'remove_stop',stop_id:s.plan.stops.at(-1).stop_id});assert.equal(s.plan.stops.length,2);
  assert.equal(s.progress.find(p=>p.stop_id===first).state,'completed');await cmd('resume');assert.equal(s.current_stop_id,second);
  await cmd('save');const storage=memoryStorage();storeSaved(storage,s);const saved=listSaved(storage)[0];
  const restored=(await post('/api/tours/restore',{request_id:uuid(),session_id:sid,snapshot:saved})).session;
  assert.equal(restored.status,'paused');assert.equal(restored.current_stop_id,second);
  assert.equal(restored.progress.find(p=>p.stop_id===first).state,'completed');assert.notEqual(restored.tour_id,s.tour_id);
  s=restored;await cmd('forget');storeSaved(storage,s);assert.equal(listSaved(storage).length,0);
  await cmd('cancel');assert.equal(s.status,'cancelled');
 }finally{child.kill();await new Promise(resolve=>{if(child.exitCode!==null)resolve();else child.once('exit',resolve);});}
});


test('N01 view changes retain M concurrency and rate guards',async()=>{
 const built=await build({configFile:false,logLevel:'silent',build:{write:false,minify:false,lib:{entry:'frontend/src/ui/map-session.ts',formats:['es'],fileName:()=> 'map-session.js'}}});
 const chunk=(Array.isArray(built)?built[0]:built).output.find(v=>v.type==='chunk');
 const {productionMapBudget}=await import('data:text/javascript;base64,'+Buffer.from(chunk.code).toString('base64'));
 const first=productionMapBudget();let finish;
 const pending=first.run('walking_route','route-one',true,new AbortController().signal,()=>new Promise(r=>finish=r));
 const nextView=productionMapBudget();
 await assert.rejects(nextView.run('walking_route','route-two',true,new AbortController().signal,async()=>null),{message:'operation_in_progress'});
 finish(null);await pending;
 await assert.rejects(nextView.run('walking_route','route-three',true,new AbortController().signal,async()=>null),{message:'rate_limited'});
 assert.equal(nextView.snapshot().counters.walking_route.initiated,1);
});

test('M integration saves formal constraints and interprets only explicit remaining time',()=>{
 const s=sample();Object.assign(s.plan.request,{message:'校史',must_visit:['poi-a'],avoid:['poi-b'],visit_date:'2026-09-15',max_walking_minutes:20});
 const saved=savedSnapshot(s);
 assert.deepEqual(saved.plan.request.must_visit,['poi-a']);assert.equal(saved.plan.request.max_walking_minutes,20);assert.equal(saved.plan.request.visit_date,'2026-09-15');
 assert.equal(remainingTimeIntent('时间只剩半小时'),30);
 assert.equal(remainingTimeIntent('现在还剩二十分钟'),20);
 assert.equal(remainingTimeIntent('校史馆开放30分钟吗'),null);
 assert.ok(!privateText('%31%31%37%2E%31%32%33%34').includes('%31'));
});
