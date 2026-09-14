import test from 'node:test';
import assert from 'node:assert/strict';
import {MapBudget} from '../../.runtime/adapter-build/map-budget.js';
import {AmapNavigation,DestinationSelectionRequired,routeNarration,speakRoute} from '../../.runtime/adapter-build/navigation.js';
const sig=()=>new AbortController().signal;
const limits={map_load:10,geolocation:10,poi_search:10,walking_route:10};
const config={js_key:'isolated-fixture',service_host:'/api/maps/amap/_AMapService',route_backend:'js_api',status:{security_key_configured:true,online_map:'UNVERIFIED'}};
const position=()=>({lng:1,lat:1,crs:'GCJ02',source:'amap_geolocation',accuracy_m:10,timestamp:new Date().toISOString()});
const poi=()=>({id:'fixture-poi',campus_id:'weijinlu',verification_status:'verified',location:{lng:1.01,lat:1.01,crs:'GCJ02',coordinate_source:'isolated-fixture',verified_at:'2026-01-01',quality:'building_center'},entrances:[]});
const request=()=>({route_id:'fixture-route',session_id:'fixture-session',campus_id:'weijinlu',destination_poi_id:'fixture-poi',entrance_id:null,origin:position(),user_initiated:true});
function fakeSdk(){
 const calls={map:0,geo:0,walk:0};const requests=[];
 return {calls,requests,readJson:async(path)=>{
  const url=new URL(path,'http://local.test');requests.push(url);
  assert.ok(url.pathname.startsWith('/maps/amap/_AMapService/'));
  assert.equal(url.searchParams.has('key'),false);assert.equal(url.searchParams.has('jscode'),false);
  if(url.pathname.endsWith('/place/text'))return {status:'1',pois:[{id:'amap-fixture',name:'Fixture Library',address:'Fixture campus',location:'1.02,1.03'}]};
  if(url.pathname.endsWith('/v3/ip'))return {status:'1',rectangle:'0.9,0.9;1.1,1.1'};
  calls.walk++;return {status:'1',route:{paths:[{distance:'120',duration:'90',steps:[{instruction:'沿测试步道前行',distance:'120',polyline:'1,1;1.01,1.01'}]}]}};
 },sdk:{
  Map:class{constructor(){calls.map++}destroy(){}},
  Geolocation:class{getCurrentPosition(cb){calls.geo++;cb('complete',{position:{lng:1,lat:1},accuracy:10,location_type:'html5'});}},

 }};
}
test('each operation has separate counters and no claimed vendor debit',async()=>{
 const b=new MapBudget({limits});
 for(const kind of Object.keys(limits))await b.run(kind,kind,true,sig(),async()=>true);
 for(const kind of Object.keys(limits))assert.equal(b.snapshot().counters[kind].initiated,1);
 assert.equal(b.snapshot().platform_quota_debit,null);
});
test('consent and pre-aborted requests invoke zero SDK operations',async()=>{
 const b=new MapBudget();let calls=0;const invoke=async()=>calls++;
 await assert.rejects(b.run('geolocation','a',false,sig(),invoke),{code:'user_action_required'});
 const c=new AbortController();c.abort();await assert.rejects(b.run('geolocation','b',true,c.signal,invoke),{code:'cancelled'});
 assert.equal(calls,0);
});
test('default smoke budget blocks POI search and a second route',async()=>{
 let t=0;const b=new MapBudget({now:()=>t});let calls=0;
 await assert.rejects(b.run('poi_search','p',true,sig(),async()=>calls++),{code:'test_budget_exhausted'});
 await b.run('walking_route','r1',true,sig(),async()=>calls++);t=6000;
 await assert.rejects(b.run('walking_route','r2',true,sig(),async()=>calls++),{code:'test_budget_exhausted'});
 assert.equal(calls,1);
});
test('duplicate clicks and in-flight overlap do not call provider twice',async()=>{
 const b=new MapBudget({limits});let done;let calls=0;
 const pending=b.run('walking_route','same',true,sig(),()=>new Promise(r=>{calls++;done=r;}));
 await assert.rejects(b.run('walking_route','same',true,sig(),async()=>calls++),{code:'duplicate_operation'});
 await assert.rejects(b.run('walking_route','other',true,sig(),async()=>calls++),{code:'operation_in_progress'});
 done(true);await pending;assert.equal(calls,1);
});
test('five-second cooldown applies before starting another request',async()=>{
 let t=0;const b=new MapBudget({limits,now:()=>t});await b.run('walking_route','a',true,sig(),async()=>true);
 t=100;await assert.rejects(b.run('walking_route','b',true,sig(),async()=>true),{code:'rate_limited'});
});
test('failed or cancelled calls retain reservations and never retry',async()=>{
 const b=new MapBudget();let calls=0;
 await assert.rejects(b.run('walking_route','a',true,sig(),async()=>{calls++;throw Error('fixture_failure');}));
 assert.equal(calls,1);assert.equal(b.snapshot().counters.walking_route.failed,1);assert.equal(b.snapshot().counters.walking_route.initiated,1);
});
test('refresh keeps test reservations; corrupt storage fails closed',async()=>{
 const data=new Map();const storage={getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)};
 await new MapBudget({storage}).run('walking_route','first',true,sig(),async()=>true);
 const refreshed=new MapBudget({storage});
 await assert.rejects(refreshed.run('walking_route','second',true,sig(),async()=>true),{code:'test_budget_exhausted'});
 assert.ok(!JSON.stringify([...data]).includes('first'));
 assert.throws(()=>new MapBudget({storage:{getItem:()=>'{broken',setItem(){}}}),{code:'budget_storage_invalid'});
});
test('map and location use SDK while walking parses same-origin provider results',async()=>{
 const f=fakeSdk();const nav=new AmapNavigation(config,new MapBudget(),async()=>f.sdk,f.readJson);
 await nav.createMap({},'m',sig(),true);
 const loc=await nav.locate('g',sig(),true);assert.equal(loc.accuracy_m,10);
 const route=await nav.walk(request(),poi(),sig());assert.equal(route.distance_m,120);assert.equal(route.duration_s,90);assert.equal(route.steps[0].instruction,'沿测试步道前行');
 assert.equal(route.campus_access,'unverified');assert.deepEqual(f.calls,{map:1,geo:1,walk:1});
});
test('wrong campus and stale device origin spend zero direct route calls',async()=>{
 const f=fakeSdk();const nav=new AmapNavigation(config,new MapBudget(),async()=>f.sdk,f.readJson);
 await assert.rejects(nav.walk(request(),{...poi(),campus_id:'beiyangyuan'},sig()),{code:'poi_context_mismatch'});
 await assert.rejects(nav.walk({...request(),origin:{...position(),timestamp:'2000-01-01'}},poi(),sig()),{code:'location_expired_or_inaccurate'});
 assert.equal(f.calls.walk,0);
});
test('cancelled HTTP route ignores a late response and counts only cancellation',async()=>{
 let complete;const f=fakeSdk();f.readJson=()=>new Promise(resolve=>{complete=resolve});
 const budget=new MapBudget();const nav=new AmapNavigation(config,budget,async()=>f.sdk,f.readJson);const c=new AbortController();
 const result=nav.walk(request(),poi(),c.signal);
 await new Promise(r=>setImmediate(r));c.abort();await assert.rejects(result,{code:'cancelled'});
 complete({status:'1',route:{paths:[]}});assert.equal(budget.snapshot().counters.walking_route.cancelled,1);assert.equal(budget.snapshot().counters.walking_route.completed,0);
});

test('IP location can plan a route while retaining unknown accuracy',async()=>{
 const f=fakeSdk();f.sdk.Geolocation=class{getCurrentPosition(cb){cb('complete',{position:{lng:1,lat:1},accuracy:10000,location_type:'ip'})}};
 const nav=new AmapNavigation(config,new MapBudget(),async()=>f.sdk,f.readJson);
 const location=await nav.locate('g',sig(),true);
 assert.equal(location.accuracy_m,null);
 const route=await nav.walk({...request(),origin:location},poi(),sig());
 assert.equal(route.distance_m,120);assert.equal(location.accuracy_m,null);assert.equal(f.calls.walk,1);
});

test('city IP lookup displays a coarse center and respects cancellation',async()=>{
 const f=fakeSdk();
 const nav=new AmapNavigation(config,new MapBudget(),async()=>f.sdk,f.readJson);
 const result=await nav.locateCity('city',sig(),true);
 assert.equal(result.lng,1);assert.equal(result.lat,1);assert.equal(result.accuracy_m,null);
 const controller=new AbortController();controller.abort();
 await assert.rejects(nav.locateCity('cancel',controller.signal,true),{code:'cancelled'});
});
test('route narration delegates actual step text to the existing speech controller',async()=>{
 const route={distance_m:120,steps:[{instruction:'沿测试步道前行'}],campus_access:'unverified'};
 let text;await speakRoute({playFull:async(run,value)=>{text=value;return {status:'ready'}}},{},route);
 assert.equal(text,routeNarration(route));assert.ok(text.includes('沿测试步道前行'));assert.ok(text.includes('尚待核验'));
});

test('provider permission and timeout failures expose only safe codes',async()=>{
 for(const [message,code] of [['PERMISSION_DENIED secret fixture detail','permission_denied'],['TIME_OUT private fixture detail','location_timeout']]){
  const f=fakeSdk();f.sdk.Geolocation=class{getCurrentPosition(cb){cb('error',{message})}};
  const budget=new MapBudget();const nav=new AmapNavigation(config,budget,async()=>f.sdk,f.readJson);
  await assert.rejects(nav.locate('g',sig(),true),error=>error.code===code&&!error.message.includes('fixture'));
  assert.equal(budget.snapshot().counters.geolocation.failed,1);
 }
});
test('manual origins remain explicit and do not invent GPS accuracy',async()=>{
 const f=fakeSdk();const nav=new AmapNavigation(config,new MapBudget(),async()=>f.sdk,f.readJson);
 const req={...request(),origin:{...position(),source:'manual',accuracy_m:null}};
 assert.equal((await nav.walk(req,poi(),sig())).destination_poi_id,poi().id);
 const another=new AmapNavigation(config,new MapBudget(),async()=>f.sdk,f.readJson);
 await assert.rejects(another.walk({...req,origin:{...req.origin,accuracy_m:0}},poi(),sig()),{code:'location_expired_or_inaccurate'});
});

test('live place matches enable walking for a directory POI without coordinates',async()=>{
 const f=fakeSdk();
 const nav=new AmapNavigation(config,new MapBudget({limits}),async()=>f.sdk,f.readJson);
 const local={...poi(),name:'Fixture Library',location:null,verification_status:'pending'};
 const [match]=await nav.findDestination(local,'search',sig());
 assert.ok(f.requests[0].searchParams.get('keywords').startsWith('天津大学卫津路校区 '));assert.equal(f.requests[0].searchParams.get('citylimit'),'true');
 await assert.rejects(nav.walk(request(),local,sig(),{...match}),{code:'destination_match_expired'});
 await assert.rejects(nav.walk({...request(),origin:{...position(),accuracy_m:-1}},local,sig(),match),{code:'location_expired_or_inaccurate'});
 const route=await nav.walk({...request(),origin:{...position(),source:'manual',accuracy_m:null}},local,sig(),match);
 assert.equal(route.steps.length,1);assert.equal(f.requests[1].searchParams.get('destination'),'1.020000,1.030000');
 assert.equal(local.location,null);assert.equal(local.verification_status,'pending');assert.equal(f.calls.walk,1);
});

test('cancelled or empty place searches do not fabricate destination coordinates',async()=>{
 const f=fakeSdk();let complete;f.readJson=()=>new Promise(resolve=>{complete=resolve});
 const nav=new AmapNavigation(config,new MapBudget({limits}),async()=>f.sdk,f.readJson);
 const controller=new AbortController();const pending=nav.findDestination({...poi(),name:'Fixture'},'search',controller.signal);
 await new Promise(resolve=>setImmediate(resolve));controller.abort();await assert.rejects(pending,{code:'cancelled'});
 complete({status:'1',pois:[]});
 f.readJson=async()=>({status:'1',pois:[]});
 const empty=new AmapNavigation(config,new MapBudget({limits}),async()=>f.sdk,f.readJson);
 await assert.rejects(empty.findDestination({...poi(),name:'Fixture'},'empty',sig()),{code:'destination_not_found'});
 assert.equal(f.calls.walk,0);
});

test('proxy failures preserve safe codes without leaking messages or credentials',async()=>{
 for(const code of ['INVALID_USER_KEY','VALIDATION_ERROR','RATE_LIMITED','TRANSPORT_TIMEOUT']){
  const nav=new AmapNavigation(config,new MapBudget(),async()=>{throw Error('SDK services must not be needed')},async()=>{throw {error:{code,message:'private fixture key=secret'}}});
  await assert.rejects(nav.walk(request(),poi(),sig()),error=>error.code===code&&!error.message.includes('secret'));
 }
});

test('manual start is rounded to six decimals and no SDK service plugins are required',async()=>{
 const f=fakeSdk();const nav=new AmapNavigation(config,new MapBudget({limits}),async()=>{throw Error('SDK should not load for service calls')},f.readJson);
 const local={...poi(),location:null,name:'Fixture Library'};
 const [match]=await nav.findDestination(local,'match',sig());
 const req={...request(),origin:{...position(),lng:1.123456789,lat:1.987654321,source:'manual',accuracy_m:null}};
 const route=await nav.walk(req,local,sig(),match);
 assert.equal(f.requests[1].searchParams.get('origin'),'1.123457,1.987654');assert.equal(route.steps[0].polyline.length,2);
});

test('malformed or empty route data never becomes a successful internal route',async()=>{
 for(const paths of [[],[{distance:'',steps:[{instruction:'step',distance:'1',polyline:'1,1;2,2'}]}],[{distance:'1',steps:[{instruction:'step',distance:'1',polyline:'bad'}]}]]){
  const nav=new AmapNavigation(config,new MapBudget(),undefined,async()=>({status:'1',route:{paths}}));
  await assert.rejects(nav.walk(request(),poi(),sig()));
 }
});

test('one action obtains IP and resolves missing, approximate and unverified destinations',async()=>{
 for(const location of [null,{...poi().location,quality:'approximate'},{...poi().location,verified_at:null}]){
  const f=fakeSdk();const nav=new AmapNavigation(config,new MapBudget({limits}),async()=>{throw Error('SDK services not needed')},f.readJson);
  const result=await nav.navigate({...request(),origin:null},{...poi(),name:'Fixture Library',location,verification_status:'pending'},sig());
  assert.equal(result.origin.accuracy_m,null);assert.equal(result.destination.name,'Fixture Library');assert.equal(result.route.distance_m,120);
  assert.deepEqual(f.requests.map(url=>url.pathname.split('/').slice(-2).join('/')),['v3/ip','place/text','direction/walking']);
 }
});

test('stale IP is refreshed automatically and old manual points remain usable',async()=>{
 const f=fakeSdk();const nav=new AmapNavigation(config,new MapBudget({limits}),undefined,f.readJson);
 const result=await nav.navigate({...request(),origin:{...position(),accuracy_m:null,timestamp:'2000-01-01'}},poi(),sig());
 assert.equal(result.origin.accuracy_m,null);assert.ok(f.requests[0].pathname.endsWith('/v3/ip'));
 const manual=fakeSdk();const other=new AmapNavigation(config,new MapBudget({limits}),undefined,manual.readJson);
 await other.navigate({...request(),origin:{...position(),source:'manual',accuracy_m:null,timestamp:'2000-01-01'}},poi(),sig());
 assert.equal(manual.requests.length,1);assert.ok(manual.requests[0].pathname.endsWith('/direction/walking'));
});

test('ambiguous destinations request selection and resume using the selected live match',async()=>{
 const f=fakeSdk();const read=f.readJson;f.readJson=async(path)=>path.includes('/place/text')?{status:'1',pois:[{id:'a',name:'Candidate A',location:'1,1'},{id:'b',name:'Candidate B',location:'2,2'}]}:read(path);
 const nav=new AmapNavigation(config,new MapBudget({limits}),undefined,f.readJson);
 const local={...poi(),name:'Library',location:null};let matches,origin;
 await assert.rejects(nav.navigate({...request(),origin:null},local,sig()),error=>{assert.ok(error instanceof DestinationSelectionRequired);matches=error.matches;origin=error.origin;return true});
 assert.equal(f.calls.walk,0);
 const result=await nav.navigate({...request(),origin},local,sig(),matches[1]);assert.equal(result.destination.name,'Candidate B');assert.equal(f.calls.walk,1);
 assert.equal(f.requests.filter(url=>url.pathname.endsWith('/v3/ip')).length,1);
});

test('an IP with no returned region cannot silently become an invented origin',async()=>{
 const nav=new AmapNavigation(config,new MapBudget({limits}),undefined,async()=>({status:'1',rectangle:[]}));
 await assert.rejects(nav.navigate({...request(),origin:null},poi(),sig()),{code:'city_location_unavailable'});
});
