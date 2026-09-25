// Replay one recorded real provider response through the actual TS parser and narration.
import {build} from 'vite';
import {readFileSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const root='docs/diagnostics/20260917-150656/';
await build({configFile:false,logLevel:'silent',build:{outDir:root+'route-build',emptyOutDir:false,minify:false,lib:{entry:'frontend/src/transport/amap-navigation.ts',formats:['es'],fileName:()=> 'route.js'}}});
// Map SDK is never invoked: walk with fixture configuration + injected recorded response only.
const {AmapNavigation,routeNarration}=await import(pathToFileURL(process.cwd()+'/'+root+'route-build/route.js'));
const recorded=JSON.parse(readFileSync(root+'map_route.json','utf8'));
const poi={id:'beiyangyuan-zhengdong-library',campus_id:'beiyangyuan',verification_status:'verified',location:{lng:117.313812,lat:38.997751,crs:'GCJ02',coordinate_source:'recorded_amap',verified_at:'2026-09-17',quality:'entrance'},entrances:[]};
const nav=new AmapNavigation({js_key:'fixture',status:{security_key_configured:true,online_map:'VERIFIED'}},{run:async(a,b,c,d,fn)=>fn()},async()=>{throw Error('SDK forbidden in replay')},async()=>recorded.response);
const route=await nav.walk({route_id:'replay-route',session_id:'replay-session',campus_id:'beiyangyuan',destination_poi_id:poi.id,entrance_id:null,origin:{lng:117.310599,lat:38.997576,source:'manual',crs:'GCJ02',accuracy_m:null,timestamp:new Date().toISOString()},user_initiated:true},poi,new AbortController().signal);
assert.equal(route.distance_m,286);assert.equal(route.duration_s,229);assert.equal(route.steps.length,3);
assert.ok(route.steps.every(s=>s.polyline.length>1));
const narration=routeNarration(route);assert.ok(route.steps.every(s=>narration.includes(s.instruction)));
writeFileSync(root+'route-replay.json',JSON.stringify({validation:'recorded_real_response_replay_not_browser',external_calls:0,route,narration,map_applied_ms:null,note:'Fixture POI coordinate eligibility is only for parser replay, not evidence that corpus coordinates are verified.'},null,2));
console.log('Recorded route parsed; 286 m, 229 s, 3 steps; all step instructions shared by narration. Browser rendering unverified.');
