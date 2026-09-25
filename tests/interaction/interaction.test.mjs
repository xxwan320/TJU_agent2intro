// Offline providers and SDK fixtures. Does not assert browser drawing or audible sound.
import test from 'node:test';
import assert from 'node:assert/strict';
import {build} from 'vite';
import {readFileSync,writeFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
const dir='.runtime/interaction-tests';
async function bundle(name,before=false){
 await build({configFile:false,logLevel:'silent',plugins:[{name:'isolated-amap',enforce:'pre',resolveId(id){if(id==='@amap/amap-jsapi-loader')return '\0sdk';},load(id){if(id==='\0sdk')return 'export default {load:async()=>globalThis.__sdk}';if(before&&id.replaceAll('\\','/').endsWith('/frontend/src/scene/amap.ts'))return readFileSync('docs/interaction/20260917-optimization/amap.before.ts','utf8');}}],build:{outDir:dir,emptyOutDir:false,minify:false,lib:{entry:'tests/interaction/entry.ts',formats:['es'],fileName:()=>name+'.js'},rolldownOptions:{output:{codeSplitting:false}}}});
 return import(pathToFileURL(process.cwd()+'/'+dir+'/'+name+'.js'));
}
const current=await bundle('current'),before=await bundle('before',true);
const {campusCandidate,preciseOrigin,planSegments,routeIntent,OperationScope,tourPhotoFor,AmapNavigation,MapBudget}=current;
const catalog=JSON.parse(readFileSync('data/knowledge/pois.json','utf8'));
const ids=['beiyangyuan-tailei-square','beiyangyuan-tianlin-square','beiyangyuan-shutian-square','beiyangyuan-datong-center','beiyangyuan-zhengdong-library'];
const samples=ids.map(id=>catalog.find(p=>p.id===id));
const origin=()=>({lng:117.31,lat:38.998,crs:'GCJ02',source:'manual',accuracy_m:null,timestamp:new Date().toISOString()});
const config={js_key:'offline-fixture',service_host:'/api/maps/amap',status:{security_key_configured:true,online_map:'UNVERIFIED'}};
const signal=()=>new AbortController().signal;
const limits={map_load:10,poi_search:6,walking_route:2,geolocation:5};
test('fixed five samples all reuse the supplied image registry without placeholders',()=>{
 assert.equal(samples.length,5);assert.ok(samples.every(Boolean));
 assert.deepEqual(samples.map(p=>!!tourPhotoFor(p.id,p.name).placeholder),[false,false,false,false,false]);
 for(const p of samples)assert.equal(tourPhotoFor(p.id,p.name).caption,p.name);
});
test('reject bus stops, wrong universities/campuses and distant names; replay previous real provider responses',()=>{
 const recorded=JSON.parse(readFileSync('docs/diagnostics/20260917-150656/map_candidates.json','utf8'));
 for(const result of recorded){const p=catalog.find(p=>p.id===result.poi_id);if(!p)continue;for(const row of result.response.pois??[]){const [lng,lat]=row.location.split(',').map(Number);if(/公交|工业大学|南开大学/.test(row.name))assert.equal(campusCandidate(p,{...row,lng,lat}),false);}}
 const library=samples[4];const good={name:library.name,address:'天津大学北洋园校区',lng:117.313,lat:38.998};
 assert.ok(campusCandidate(library,good));
 for(const patch of [{name:'郑东图书馆公交站'},{lng:116.4},{address:'天津大学卫津路校区'},{name:'别的图书馆'}])assert.equal(campusCandidate(library,{...good,...patch}),false);
});
test('coarse IP and stale/inaccurate device positions cannot enter the page route flow',()=>{
 assert.ok(preciseOrigin(origin()));assert.ok(!preciseOrigin(null));
 for(const patch of [{source:'amap_geolocation'},{source:'amap_geolocation',accuracy_m:500},{source:'amap_geolocation',accuracy_m:10,timestamp:'2000-01-01'},{lng:181}])assert.equal(preciseOrigin({...origin(),...patch}),false);
 assert.equal(routeIntent('请规划步行到郑东图书馆的路线',samples)?.id,samples[4].id);
 assert.equal(routeIntent('介绍郑东图书馆',samples),null);
});
test('A→B→A delayed callbacks and clear invalidate prior generations independently of a valid route',async()=>{
 const selection=new OperationScope(),route=new OperationScope();const r=route.begin();
 const a=selection.begin(),b=selection.begin(),final=selection.begin();assert.ok(!a.current()&&!b.current()&&final.current()&&r.current());
 route.cancel();assert.ok(!r.current()&&final.current());selection.cancel();assert.ok(!final.current());
});
test('multi-stop routes preserve real segment paths, origin chaining, totals, identity and cancellation',async()=>{
 const calls=[],paths=[[[117.31,38.998],[117.3105,38.9985],[117.311,38.999]],[[117.311,38.999],[117.312,38.9995],[117.313,39]]];
 const result=await planSegments(samples.slice(3),origin(),'tour',signal(),async(p,from,id)=>{const i=calls.length;calls.push({from,id});return {route:{route_id:id,destination_poi_id:p.id,steps:[{polyline:paths[i],instruction:p.name,distance_m:100}],distance_m:100,duration_s:90}};},async()=>{});
 assert.deepEqual(result.route.steps.map(s=>s.polyline),paths);assert.equal(result.route.distance_m,200);assert.equal(result.route.duration_s,180);assert.equal(result.route.route_id,'tour');assert.equal(calls[1].from.lng,117.311);assert.equal(result.stops.length,2);
 const c=new AbortController();let finish;let count=0;
 const pending=planSegments(samples.slice(3),origin(),'old',c.signal,()=>{count++;return new Promise(r=>finish=r);},async()=>{});
 c.abort();finish({route:{}});await assert.rejects(pending,/cancelled/);assert.equal(count,1);
 await assert.rejects(planSegments(samples.slice(3),origin(),'bad',signal(),async()=>({route:{route_id:'foreign'}}),async()=>{}),/invalid_route_result/);
});
test('provider candidate caching removes repeated A/B/A queries without trusting user-forged candidates',async()=>{
 let count=0,t=0;const nav=new AmapNavigation(config,new MapBudget({limits,now:()=>t}),undefined,async path=>{count++;const query=new URL(path,'http://fixture').searchParams.get('keywords');const p=query.includes('郑东')?samples[4]:samples[3];return {status:'1',pois:[{id:p.id,name:p.name,location:'117.313,38.998',address:'天津大学北洋园校区'}]};});
 const a=await nav.findDestination(samples[3],'a',signal());t=6000;await nav.findDestination(samples[4],'b',signal());const a2=await nav.findDestination(samples[3],'a2',signal());assert.equal(count,2);assert.equal(a,a2);
});
test('uncached selections wait locally for cooldown and abort without provider reservations',async()=>{
 let now=0;const budget=new MapBudget({limits,now:()=>now});await budget.run('poi_search','a',true,signal(),async()=>{});
 const c=new AbortController(),waiting=budget.waitForSlot('poi_search',c.signal);c.abort();await assert.rejects(waiting,{code:'cancelled'});
 assert.equal(budget.snapshot().counters.poi_search.initiated,1);now=5000;await budget.waitForSlot('poi_search',signal());
});
function sdkRig(){
 const log={markers:0,centers:0,fits:0,removed:0};const instances=[];
 class Marker{constructor(options){log.markers++;this.options=options;this.events={};instances.push(this);}on(n,fn){this.events[n]=fn;}setzIndex(v){this.z=v;}setLabel(v){this.label=v;}setPosition(v){this.options.position=v;}setTitle(v){this.options.title=v;}}
 class Map{constructor(){this.events={};}on(n,fn){this.events[n]=fn;}add(){}remove(){log.removed++;}setCenter(){log.centers++;}setFitView(){log.fits++;}setZoomAndCenter(){log.centers++;}destroy(){}resize(){}}
 return {log,instances,sdk:{Map,Marker,Polyline:class{},Circle:class{}}};
}
test('map markers reverse-sync, picking resets, tracking does not recenter, and repeated selection reuses markers',async()=>{
 globalThis.window={};globalThis.location={origin:'http://127.0.0.1:8000'};
 const rig=sdkRig();globalThis.__sdk=rig.sdk;const clicks=[];
 const map=await current.createOnlineMap({},config,new MapBudget({limits}), 'm',signal(),id=>clicks.push(id),{center:[117.313,38.998],zoom:15});
 const verified=samples.map((p,i)=>({...p,location:{...origin(),lng:117.31+i*.001,quality:'building_center',verified_at:'2026-09-17'},verification_status:'verified'}));
 map.setPois(verified,ids[0]);const count=rig.log.markers;for(const id of [ids[1],ids[0],ids[1]])map.setPois(verified,id);assert.equal(rig.log.markers,count);
 rig.instances[0].events.click();assert.equal(clicks[0],ids[0]);
 map.showTourStops([{poiId:ids[1],stop_id:'s',title:'B',lng:117.31,lat:38.998,index:0}]);rig.instances.at(-1).events.click();assert.equal(clicks.at(-1),ids[1]);
 map.showPosition(origin(),false);assert.equal(rig.log.centers,0);
 map.showDestination({poiId:ids[4],name:'B',lng:117.313,lat:38.998});rig.instances.at(-1).events.click();assert.equal(clicks.at(-1),ids[4]);map.destroy();
});
test('record before/after marker update CPU values: synthetic SDK, not browser timings',async()=>{
 const measurements=[];
 for(const [label,version] of [['before',before],['after',current]]){
  for(let repeat=0;repeat<3;repeat++){
   const rig=sdkRig();globalThis.__sdk=rig.sdk;globalThis.window={};globalThis.location={origin:'http://127.0.0.1:8000'};
   const map=await version.createOnlineMap({},config,new MapBudget({limits}),'m',signal(),()=>{},{center:[117.31,38.998],zoom:15});
   const pois=samples.map((p,i)=>({...p,location:{...origin(),lng:117.31+i*.001,quality:'building_center',verified_at:'2026-09-17'},verification_status:'verified'}));
   const t=performance.now();for(let i=0;i<100;i++)map.setPois(pois,pois[i%5].id);
   measurements.push({label,repeat,update_ms:performance.now()-t,...rig.log,iterations:100,validation:'offline_sdk_fixture'});map.destroy();
  }
 }
 writeFileSync('docs/interaction/20260917-optimization/marker-performance.json',JSON.stringify(measurements,null,2));
 assert.equal(measurements[0].markers,500);assert.equal(measurements[3].markers,5);
});
