import type { POI, RouteResponse, UserPosition } from '../../../shared/r2';
import type { MapDestination } from './amap-navigation';

/** Campus bounds are only a rejection filter, never verified access coordinates. */
export function campusCandidate(poi:POI, row:{name:string;address?:string;lng:number;lat:number}):boolean {
  const center=poi.campus_id==='beiyangyuan'?[117.3138,38.9978]:[117.175,39.108];
  if(Math.abs(row.lng-center[0])>.025||Math.abs(row.lat-center[1])>.018)return false;
  const label=row.name+' '+(row.address??'');
  if(/公交|地铁|客运|工业大学|南开大学|师范大学|财经大学/.test(label))return false;
  if(poi.campus_id==='beiyangyuan'?/卫津路校区/.test(label):/北洋园|新校区/.test(label))return false;
  const core=(s:string)=>s.replace(/天津大学|北洋园校区|卫津路校区|[（(][^）)]*[）)]/g,'').trim();
  const aliases=(poi.aliases??[]).filter(name=>!['图书馆','食堂','校门','主楼','体育馆'].includes(name));
  return [poi.name,...aliases].map(core).some(name=>name.length>=2&&core(row.name).includes(name));
}
export function preciseOrigin(origin:UserPosition|null):origin is UserPosition {
  return !!origin&&origin.crs==='GCJ02'&&Number.isFinite(origin.lng)&&Number.isFinite(origin.lat)&&Math.abs(origin.lng)<=180&&Math.abs(origin.lat)<=90&&
    (origin.source==='manual'||(origin.accuracy_m!==null&&origin.accuracy_m>=0&&origin.accuracy_m<=200&&Date.now()-Date.parse(origin.timestamp)<120000));
}
export function routeIntent(text:string,pois:POI[]):POI|null {
  if(!/(路线|导航|怎么走|步行|走到)/.test(text))return null;
  const found=pois.filter(p=>[p.name,...p.aliases].some(name=>name.length>=2&&text.includes(name)));
  return found.length===1?found[0]:null;
}
export async function planSegments(pois:POI[],origin:UserPosition,routeId:string,signal:AbortSignal,
  navigate:(poi:POI,origin:UserPosition,id:string,signal:AbortSignal)=>Promise<{route:RouteResponse;destination?:MapDestination}>,
  wait:(signal:AbortSignal)=>Promise<void>):Promise<{route:RouteResponse;stops:Array<{poi:POI;lng:number;lat:number}>}> {
  if(!preciseOrigin(origin))throw Error('location_accuracy_unverified');
  const legs:RouteResponse[]=[],stops:Array<{poi:POI;lng:number;lat:number}>=[];let from=origin;
  for(const [index,poi] of pois.entries()){
    if(signal.aborted)throw Error('cancelled');
    if(index)await wait(signal);
    const result=await navigate(poi,from,routeId+'-'+index,signal);
    if(signal.aborted)throw Error('cancelled');
    if(result.route.route_id!==routeId+'-'+index||result.route.destination_poi_id!==poi.id)throw Error('invalid_route_result');
    const last=result.route.steps.at(-1)?.polyline.at(-1);
    if(!last||result.route.steps.some(step=>step.polyline.length<2))throw Error('invalid_route_result');
    legs.push(result.route);stops.push({poi,lng:last[0],lat:last[1]});
    from={...origin,lng:last[0],lat:last[1],source:'manual',accuracy_m:null,timestamp:new Date().toISOString()};
  }
  if(!legs.length)throw Error('route_no_data');
  return {route:{...legs[legs.length-1],route_id:routeId,steps:legs.flatMap(l=>l.steps),distance_m:legs.reduce((n,l)=>n+l.distance_m,0),
    duration_s:legs.every(l=>l.duration_s!==null)?legs.reduce((n,l)=>n+l.duration_s!,0):null,campus_access:'unverified',access_source_refs:[]},stops};
}
export function mapCooldown(signal:AbortSignal):Promise<void>{
  return new Promise((resolve,reject)=>{
    const abort=()=>{clearTimeout(timer);reject(Error('cancelled'));};
    const timer=setTimeout(()=>{signal.removeEventListener('abort',abort);resolve();},5100);
    signal.addEventListener('abort',abort,{once:true});if(signal.aborted)abort();
  });
}
