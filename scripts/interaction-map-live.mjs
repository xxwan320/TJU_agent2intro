// Real service requests with a public campus test origin, NOT a browser map-picked/GPS origin.
import {readFileSync,writeFileSync} from 'node:fs';
import {AmapNavigation} from '../.runtime/adapter-build/navigation.js';
import {MapBudget} from '../.runtime/adapter-build/map-budget.js';
const base='http://127.0.0.1:8000',out='docs/interaction/20260917-optimization/';
const catalog=JSON.parse(readFileSync('data/knowledge/pois.json','utf8'));
const ids=['beiyangyuan-datong-center','beiyangyuan-zhengdong-library','beiyangyuan-tailei-square','beiyangyuan-tianlin-square','beiyangyuan-shutian-square'];
const config=await (await fetch(base+'/api/maps/config')).json();
const budget=new MapBudget({limits:{map_load:0,geolocation:0,poi_search:6,walking_route:2}});
const readJson=async(path,options)=>{const response=await fetch(base+'/api'+path,options);const body=await response.json();if(!response.ok)throw body;return body;};
const nav=new AmapNavigation(config,budget,undefined,readJson);
const signal=()=>AbortSignal.timeout(25000),wait=()=>new Promise(r=>setTimeout(r,5100));
const results={validation:'real_service_only; no browser map application',poi:[],routes:[],origin_source:'public campus point from previous recorded Amap result; manual test fixture, not device GPS'};
const save=()=>writeFileSync(out+'live-map.json',JSON.stringify({...results,budget:budget.snapshot()},null,2));
for(const id of ids){
 if(results.poi.length)await wait();const p=catalog.find(p=>p.id===id),start=performance.now();
 try{const matches=await nav.findDestination(p,crypto.randomUUID(),signal());results.poi.push({id,ms:performance.now()-start,matches});}
 catch(error){results.poi.push({id,ms:performance.now()-start,error:error.code??error.message});}
 save();console.log(JSON.stringify(results.poi.at(-1)));
}
const recorded=JSON.parse(readFileSync('docs/diagnostics/20260917-150656/map_route.json','utf8'));
const [lng,lat]=recorded.selected_public_pois[0].location.split(',').map(Number);
let origin={lng,lat,crs:'GCJ02',source:'manual',accuracy_m:null,timestamp:new Date().toISOString()};
for(const id of ids.slice(0,2).reverse()){
 if(results.routes.length)await wait();const start=performance.now();
 try{const result=await nav.navigate({route_id:crypto.randomUUID(),session_id:crypto.randomUUID(),campus_id:'beiyangyuan',destination_poi_id:id,entrance_id:null,origin,user_initiated:true},catalog.find(p=>p.id===id),signal());results.routes.push({id,ms:performance.now()-start,...result});const end=result.route.steps.at(-1).polyline.at(-1);origin={...origin,lng:end[0],lat:end[1]};}
 catch(error){results.routes.push({id,ms:performance.now()-start,error:error.code??error.message});}
 save();console.log(JSON.stringify({id,...(results.routes.at(-1).error?{error:results.routes.at(-1).error}:{steps:results.routes.at(-1).route.steps.length,ms:performance.now()-start})}));
}
