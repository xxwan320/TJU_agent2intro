// Hook/event-handler fixtures only: no DOM renderer, browser, live GPS or sound.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'vite';
import {pathToFileURL} from 'node:url';
const catalog=JSON.parse(readFileSync('data/knowledge/pois.json','utf8'));
const samples=['beiyangyuan-tailei-square','beiyangyuan-tianlin-square','beiyangyuan-shutian-square','beiyangyuan-datong-center','beiyangyuan-zhengdong-library'].map(id=>catalog.find(p=>p.id===id));
await build({configFile:false,logLevel:'silent',plugins:[{name:'offline-page',enforce:'pre',resolveId(id){if(id==='react'||id==='react/jsx-runtime')return '\0'+id;},load(id){
 if(id==='\0react')return ['useState','useRef','useMemo','useCallback','useEffect'].map(name=>`export const ${name}=(...a)=>globalThis.__hooks.${name}(...a);`).join('\n');
 if(id==='\0react/jsx-runtime')return 'export const Fragment="fragment";export const jsx=(type,props,key)=>({type,props:props??{},key});export const jsxs=jsx;';
 const name=id.replaceAll('\\','/');
 if(name.endsWith('/scene/amap.ts'))return `export const CAMPUS_MAP_VIEW={beiyangyuan:{center:[117.3138,38.9978],zoom:15}};export async function createOnlineMap(...args){globalThis.__mapSelect=args[5];return globalThis.__map;}`;
 if(name.endsWith('/transport/r2.ts'))return 'export const r2Transport=new Proxy({}, {get:(_,key)=>globalThis.__transport[key]});';
 if(name.endsWith('/ui/CampusExplorer.tsx'))return readFileSync(id,'utf8').replaceAll('setTimeout(', 'globalThis.__timers.setTimeout(').replaceAll('clearTimeout(', 'globalThis.__timers.clearTimeout(');
 if(name.endsWith('/transport/interaction.ts'))return readFileSync(id,'utf8').replace(/export function mapCooldown[\s\S]*$/, 'export async function mapCooldown(signal:AbortSignal){if(signal.aborted)throw Error("cancelled");}');
}}],build:{outDir:'.runtime/interaction-page',emptyOutDir:false,minify:false,lib:{entry:{page:'frontend/src/ui/CampusExplorer.tsx',photo:'frontend/src/ui/PhotoCarousel.tsx'},formats:['es']}}});
const {CampusExplorer}=await import(pathToFileURL(process.cwd()+'/.runtime/interaction-page/page.js'));
const {PhotoCarousel}=await import(pathToFileURL(process.cwd()+'/.runtime/interaction-page/photo.js'));
const depsSame=(a,b)=>a&&b&&a.length===b.length&&a.every((x,i)=>Object.is(x,b[i]));
function harness(Component,props){
 const slots=[];let cursor=0,dirty=true,tree,queue=[];
 const hooks={
  useState(initial){const i=cursor++;slots[i]??={value:typeof initial==='function'?initial():initial};return [slots[i].value,value=>{const next=typeof value==='function'?value(slots[i].value):value;if(!Object.is(next,slots[i].value)){slots[i].value=next;dirty=true;}}];},
  useRef(value){const i=cursor++;slots[i]??={current:value};return slots[i];},
  useMemo(fn,deps){const i=cursor++;if(!slots[i]||!depsSame(slots[i].deps,deps))slots[i]={value:fn(),deps};return slots[i].value;},
  useCallback(fn,deps){return hooks.useMemo(()=>fn,deps);},
  useEffect(fn,deps){const i=cursor++;if(!slots[i]||!depsSame(slots[i].deps,deps)){const old=slots[i];slots[i]={deps,cleanup:old?.cleanup};queue.push(()=>{slots[i].cleanup?.();slots[i].cleanup=fn();});}}
 };
 function render(){globalThis.__hooks=hooks;cursor=0;dirty=false;tree=Component(props);for(const node of nodes(tree))if(node.props.ref&&typeof node.props.ref==='object'&&!node.props.ref.current)node.props.ref.current={style:{},clientWidth:1000,clientHeight:600,addEventListener(){},removeEventListener(){},classList:{add(){},remove(){}}};const pending=queue;queue=[];pending.forEach(fn=>fn());}
 return {get tree(){return tree;},set(patch){Object.assign(props,patch);dirty=true;},async settle(){for(let i=0;i<12;i++){if(dirty)render();await new Promise(r=>setImmediate(r));}assert.ok(!dirty,'fixture render settled');},dispose(){for(const slot of slots)slot?.cleanup?.();},props};
}
function nodes(tree){if(!tree)return [];if(Array.isArray(tree))return tree.flatMap(nodes);if(typeof tree!=='object')return [];return [tree,...nodes(tree.props.children)];}
function text(tree){if(tree==null||typeof tree==='boolean')return '';if(Array.isArray(tree))return tree.map(text).join('');if(typeof tree!=='object')return String(tree);return text(tree.props.children);}
function button(h,label){const node=nodes(h.tree).find(n=>n.type==='button'&&text(n)===label);assert.ok(node,'button '+label);return node.props;}
function input(h,label){const node=nodes(h.tree).find(n=>n.type==='input'&&n.props['aria-label']===label);assert.ok(node,label);return node.props;}
function directory(h,name){return nodes(h.tree).find(n=>n.type==='button'&&nodes(n).some(child=>child.type==='strong'&&text(child)===name)&&n.props.className!==undefined);}
const position=()=>({lng:117.31,lat:38.998,source:'manual',crs:'GCJ02',accuracy_m:null,timestamp:new Date().toISOString()});
function rig(){
 const callbacks=new Map();let next=0, picker=null, searches=[],drawn=[],dest=null,stops=0,explain=[];
 globalThis.__timers={setTimeout(fn,ms){callbacks.set(++next,{fn,ms});return next;},clearTimeout(id){callbacks.delete(id);}};
 globalThis.document={visibilityState:'visible'};globalThis.window={addEventListener(){},removeEventListener(){},setInterval(){return 1;},clearInterval(){}};
 globalThis.__transport={pois:async()=>({items:samples,total:5,next_cursor:null}),poi:async id=>samples.find(p=>p.id===id),campusAssets:async()=>({maps:[],media:[]}),mapConfig:async()=>({js_key:'fixture',status:{security_key_configured:true}}),externalNavigation:async id=>({poi_id:id,kind:'unavailable'})};
 const map={destroy(){},setPois(){},resize(){},focusCampus(){},clearPosition(){},showTourStops(){},highlightStep(){},showPosition(p){map.position=p;},pickStart(fn){picker=fn;},clearRoute(){drawn=[];},showRoute(lines){drawn=lines;},showDestination(d){dest=d;},async findDestination(p){searches.push(p.id);return [{poiId:p.id,name:p.name,lng:117.313,lat:38.998,matchedAt:Date.now(),providerId:p.id}];},async locate(){throw Error('permission_denied');},async locateCity(){return {...position(),source:'amap_geolocation'};},async navigate(request){return {origin:request.origin,route:{route_id:request.route_id,destination_poi_id:request.destination_poi_id,steps:[{instruction:'真实服务形状的离线步道',polyline:[[117.31,38.998],[117.313,38.998]],distance_m:100}],distance_m:100,duration_s:80,campus_access:'unverified'}};}};
 globalThis.__map=map;
 let h;h=harness(CampusExplorer,{campus:'beiyangyuan',sessionId:'s',selected:null,focusPoiId:null,focusRevision:0,routeTarget:null,tourSession:null,onRouteChange(){},onStop:async()=>stops++,onSelect(p){h.set({selected:p});},onAssets(){},onAsk(_,p){explain.push(p.id);},onReadRoute(){},onInstruction(){}});
 return {h,map,callbacks,searches,get drawn(){return drawn;},get destination(){return dest;},get picker(){return picker;},get stops(){return stops;},explain};
}
test('I01-I05 selected ID, directory/card/photo identity, reverse-sync and late B invalidation',async()=>{
 const r=rig(),h=r.h;await h.settle();
 directory(h,samples[3].name).props.onClick();await h.settle();assert.equal(h.props.selected.id,samples[3].id);assert.equal(r.destination.poiId,samples[3].id);assert.ok(nodes(h.tree).some(n=>n.props['data-poi-id']===samples[3].id));
 button(h,'开始讲解').onClick();assert.deepEqual(r.explain,[samples[3].id]);await button(h,'停止讲解').onClick();assert.equal(r.stops,1);
 let resolveB;const find=r.map.findDestination;r.map.findDestination=p=>p.id===samples[4].id?new Promise(resolve=>resolveB=resolve):find(p);
 directory(h,samples[4].name).props.onClick();await h.settle();directory(h,samples[3].name).props.onClick();await h.settle();resolveB([{poiId:samples[4].id,name:samples[4].name}]);await h.settle();assert.equal(r.destination.poiId,samples[3].id);
 globalThis.__mapSelect(samples[0].id);await h.settle();assert.equal(h.props.selected.id,samples[0].id);
 const photo=harness(PhotoCarousel,{campus:'beiyangyuan',selectedPoi:samples[4]});await photo.settle();assert.equal(nodes(photo.tree).find(n=>n.type==='img').props.alt,samples[4].name);photo.set({selectedPoi:samples[0]});await photo.settle();assert.equal(nodes(photo.tree).find(n=>n.type==='img').props.src,'/assets/campus/photos/beiyangyuan-tailei-square-1.jpg');photo.dispose();h.dispose();
});
test('I06-I08 map/manual origin, route retention, late route cancellation, missing location',async()=>{
 const r=rig(),h=r.h;await h.settle();button(h,'在地图选择起点').onClick();await h.settle();assert.equal(typeof r.picker,'function');const picked=position();r.picker(picked);await h.settle();assert.deepEqual(r.map.position,picked);
 directory(h,samples[3].name).props.onClick();await h.settle();await button(h,'从起点步行到这里').onClick();await h.settle();assert.equal(r.drawn.length,1);
 const online=nodes(h.tree).find(n=>n.props?.className==='online-map-wrap');assert.equal(online.props.hidden,false);assert.ok(text(h.tree).includes('步行方案'));
 directory(h,samples[4].name).props.onClick();await h.settle();assert.equal(r.drawn.length,1);assert.ok(text(h.tree).includes('步行方案'));
 let finish;const original=r.map.navigate;r.map.navigate=async req=>new Promise(resolve=>finish=()=>original(req).then(resolve));button(h,'从起点步行到这里').onClick();await h.settle();button(h,'清空路线').onClick();finish();await h.settle();assert.equal(r.drawn.length,0);
 r.map.findDestination=async()=>{throw Error('destination_not_found');};directory(h,samples[2].name).props.onClick();await h.settle();assert.equal(r.destination,null);assert.ok(text(h.tree).includes('暂未定位'));assert.ok(nodes(h.tree).some(n=>n.type?.name==='PoiProfile'&&n.props.poi.id===samples[2].id&&n.props.poi.description===samples[2].description)); // This fixture does not render child components; Chrome verifies visibility.
 assert.ok(!nodes(h.tree).some(n=>n.props['aria-label']==='手动起点经度'));
 h.dispose();
});
test('origin controls: denied GPS, coarse fallback rejection, continuous update/stop and cleanup',async()=>{
 const r=rig(),h=r.h;await h.settle();await button(h,'定位一次').onClick();await h.settle();assert.ok(text(h.tree).includes('定位权限被拒绝'));
 r.map.locate=async()=>({...position(),source:'amap_geolocation'});await button(h,'持续定位').onClick();await h.settle();assert.equal(r.callbacks.size,1);assert.ok(text(h.tree).includes('IP 城市粗略位置'));
 button(h,'停止定位').onClick();await h.settle();assert.equal(r.callbacks.size,0);
 directory(h,samples[3].name).props.onClick();await h.settle();await button(h,'先确认步行起点').onClick();await h.settle();assert.ok(text(h.tree).includes('IP 城市中心不能'));
 assert.ok(!text(h.tree).includes('持续 IP 定位'));
 r.map.locate=async()=>({...position(),source:'amap_geolocation',accuracy_m:10});await button(h,'持续定位').onClick();await h.settle();assert.equal(r.callbacks.size,1);h.dispose();assert.equal(r.callbacks.size,0);
});
test('chat target and draft itinerary automatically apply paths after origin confirmation, without a second map form',async()=>{
 const r=rig(),h=r.h;await h.settle();h.set({routeTarget:{poiId:samples[3].id,revision:1}});await h.settle();assert.ok(text(h.tree).includes('请先在地图选择起点'));assert.equal(r.drawn.length,0);
 button(h,'在地图选择起点').onClick();r.picker(position());await h.settle();assert.equal(r.drawn.length,1);
 const session={tour_id:'tour',session_id:'s',status:'draft',plan:{version:1,stops:samples.slice(3).map((p,i)=>({poi_id:p.id,stop_id:String(i),title:p.name}))}};
 h.set({routeTarget:null,tourSession:session});await h.settle();assert.equal(r.drawn.length,2);assert.ok(text(h.tree).includes('行程路线已显示'));
 const paths=r.drawn;directory(h,samples[0].name).props.onClick();await h.settle();assert.equal(r.drawn,paths);
 h.dispose();
});
test('a late focus detail lookup cannot undo a newer directory selection',async()=>{
 const r=rig(),h=r.h;await h.settle();let finish;
 globalThis.__transport.poi=()=>new Promise(resolve=>finish=resolve);
 h.set({focusPoiId:'not-in-directory',focusRevision:1});await h.settle();
 directory(h,samples[3].name).props.onClick();await h.settle();finish({...samples[4],id:'not-in-directory'});await h.settle();
 assert.equal(h.props.selected.id,samples[3].id);h.dispose();
});
test('live follow actually replans only after movement/time thresholds and keeps one location timer',async()=>{
 const r=rig(),h=r.h,now=Date.now;let plans=0,offset=0,shift=0;const navigate=r.map.navigate;
 r.map.navigate=async(...args)=>{plans++;return navigate(...args);};
 try{
  await h.settle();button(h,'在地图选择起点').onClick();r.picker(position());await h.settle();directory(h,samples[3].name).props.onClick();await h.settle();button(h,'从起点步行到这里').onClick();await h.settle();assert.equal(plans,1);
  r.map.locate=async()=>({...position(),lng:117.31+shift,source:'amap_geolocation',accuracy_m:10});Date.now=()=>now()+offset;
  button(h,'持续定位').onClick();await h.settle();assert.equal(plans,1);
  const tick=async()=>{const [id,timer]=[...r.callbacks][0];r.callbacks.delete(id);timer.fn();await h.settle();};
  shift=.0001;offset=61000;await tick();assert.equal(plans,1);
  shift=.002;await tick();assert.equal(plans,2);assert.equal(r.callbacks.size,1);assert.ok(button(h,'停止定位'));
  button(h,'停止定位').onClick();await h.settle();assert.equal(r.callbacks.size,0);assert.equal(plans,2);
 }finally{Date.now=now;h.dispose();}
});

test('draft POI origin and endpoint auto-route without location or extra clicks',async()=>{
 const r=rig(),h=r.h;await h.settle();const calls=[];const navigate=r.map.navigate;
 r.map.navigate=async req=>{calls.push(req);return navigate(req);};
 const session={tour_id:'poi-origin',session_id:'s',status:'checked',plan:{version:1,request:{start:{kind:'poi',poi_id:samples[0].id},end:{kind:'poi',poi_id:samples[4].id}},stops:samples.slice(0,3).map((p,i)=>({poi_id:p.id,stop_id:String(i),title:p.name}))}};
 h.set({tourSession:session});await h.settle();
 assert.deepEqual(calls.map(c=>c.destination_poi_id),[samples[1].id,samples[2].id,samples[4].id]);
 assert.equal(calls[0].origin.lng,117.313);assert.ok(text(h.tree).includes('行程路线已显示'));
 h.set({tourSession:{...session,status:'active'}});await h.settle();assert.equal(calls.length,3);h.dispose();
});
test('common origins use existing POIs and stop continuous location',async()=>{
 const r=rig(),h=r.h;await h.settle();r.map.locate=async()=>({...position(),source:'amap_geolocation',accuracy_m:10});
 await button(h,'持续定位').onClick();await h.settle();assert.equal(r.callbacks.size,1);
 const select=nodes(h.tree).find(n=>n.type==='select'&&n.props['aria-label']==='常用起点');assert.ok(select);
 assert.equal(nodes(select).filter(n=>n.type==='option').length,samples.length+1);
 await select.props.onChange({target:{value:samples[2].id}});await h.settle();assert.equal(r.callbacks.size,0);
 assert.equal(r.map.position.lng,117.313);assert.ok(text(h.tree).includes('常用起点：'+samples[2].name));h.dispose();
});
