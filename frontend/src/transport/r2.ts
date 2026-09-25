// Same-origin streaming interface.
import { api } from './api';
import type {CampusId} from '../../../shared/contracts';
import type {R2ChatRequest,POICategory,POIPage,POI,Coverage,CampusAssets,MapStatus,MapPublicConfig,ExternalNavigation,GenerationRendered,RenderReceipt,RouteRequest,RouteResponse,RouteCancelResponse} from '../../../shared/r2';
export {createParser as createSseParser} from 'eventsource-parser';
const json=(body:unknown):RequestInit=>({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
export const r2Transport={
 openStream:(body:R2ChatRequest,signal:AbortSignal)=>fetch('/api/chat/stream',{...json(body),headers:{'Content-Type':'application/json',Accept:'text/event-stream'},signal}),
 pois:(campus_id:CampusId,options:{category?:POICategory;query?:string;limit?:number;cursor?:string}={})=>{
  const p=new URLSearchParams({campus_id}); for(const [key,value] of Object.entries(options)) if(value!==undefined)p.set(key,String(value));
  return api<POIPage>('/knowledge/pois?'+p);
 },
 poi:(id:string)=>api<POI>('/knowledge/pois/'+encodeURIComponent(id)),
 coverage:()=>api<Coverage>('/knowledge/coverage'),
 campusAssets:(campus_id:CampusId)=>api<CampusAssets>('/knowledge/campus-assets?campus_id='+campus_id),
 planRoute:(body:RouteRequest,signal:AbortSignal)=>api<RouteResponse>('/maps/routes',{...json(body),signal}),
 cancelRoute:(route_id:string,session_id:string)=>api<RouteCancelResponse>('/maps/routes/'+encodeURIComponent(route_id)+'/cancel',json({session_id})),
 mapStatus:()=>api<MapStatus>('/maps/status'),
 mapConfig:()=>api<MapPublicConfig>('/maps/config'),
 externalNavigation:(id:string)=>api<ExternalNavigation>('/maps/external-navigation/'+encodeURIComponent(id)),
 generationRendered:(body:GenerationRendered)=>api<RenderReceipt>('/runtime/generation-rendered',json(body)),
};
