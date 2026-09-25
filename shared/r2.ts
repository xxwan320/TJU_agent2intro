// R2 contract 1.1.0; legacy wire types stay compatible.
import type { CampusId, Mode, Source, ChatRequest, ChatResponse, SceneAction, Voice, AdapterResult } from './contracts';
export type GenerationOptions = { type:'guide_script'|'visit_plan'|'social_post'; requirements:string; length:'short'|'medium'|'long'; style:'friendly'|'formal'|'lively' };
export type R2ChatRequest = ChatRequest & {message_id:string; selected_poi_id:string|null; generation:GenerationOptions|null};
export type Verification = 'verified'|'pending'|'historical'|'disputed';
export type POICategory = 'teaching'|'library'|'gate'|'dining'|'dorm_area'|'sports'|'culture'|'service'|'other';
export interface GeoLocation {lng:number;lat:number;crs:'WGS84'|'GCJ02';coordinate_source:string;verified_at:string|null;quality:'entrance'|'building_center'|'approximate'|'pending'}
export interface SchematicPosition {map_id:string;x:number;y:number;source_ref:string;quality:'schematic'|'map_checked'}
export interface Entrance {id:string;name:string;location:GeoLocation|null;source_refs:string[];access_notes:string|null}
export interface POI {id:string;campus_id:CampusId;name:string;aliases:string[];category:POICategory;description:string;source_refs:string[];location:GeoLocation|null;schematic_position:SchematicPosition|null;entrances:Entrance[];verification_status:Verification}
export interface POIPage {items:POI[];total:number|null;next_cursor:string|null;version:string|null}
export interface KnowledgeRecord {id:string;campus_id:CampusId;entity_id:string|null;title:string;category:string;aliases:string[];fact:string;sources:Source[];applicable_at:string|null;retrieved_at:string;verification_status:Verification}
export interface CampusMedia {id:string;poi_id?:string|null;campus_id:CampusId;local_path:string;source_url:string;creator:string|null;usage_basis:string;caption:string;focal_point:[number,number];width:number;height:number}
export interface CampusMap {id:string;campus_id:CampusId;local_path:string;kind:'schematic'|'licensed_map';width:number;height:number;source_refs:string[];creator:string;usage_basis:string;version:string;data_as_of:string|null;supports_precise_navigation:false}
export interface CampusAssets {maps:CampusMap[];media:CampusMedia[];version:string|null}
export interface ProviderCrosswalk {poi_id:string;provider:'amap';provider_poi_id:string;matched_at:string;match_status:'verified'|'pending';retention_basis:string}
export interface Coverage {status:'ready'|'not_implemented';version:string|null;source_pages:number|null;fact_count:number|null;chunk_count:number|null;campuses:{campus_id:CampusId;facts:number;pois:number;verified_coordinates:number;usable_media:number}[]}
export interface MapStatus {local_map:'ready'|'not_implemented';external_navigation:'ready'|'not_implemented';online_map:'NOT_CONFIGURED'|'NOT_IMPLEMENTED'|'UNVERIFIED'|'VERIFIED'|'FAILED';js_key_configured:boolean;security_key_configured:boolean;web_service_key_configured:boolean;precise_location:'not_implemented'|'NOT_CONFIGURED'|'UNVERIFIED'|'VERIFIED'|'FAILED';in_app_routing:'not_implemented'|'NOT_CONFIGURED'|'UNVERIFIED'|'VERIFIED'|'FAILED'}
export interface MapPublicConfig {route_backend:'js_api';js_key:string|null;service_host:'/api/maps/amap/_AMapService';status:MapStatus}
export interface ExternalNavigation {poi_id:string;url:string|null;kind:'coordinate'|'search'|'unavailable';precision:'verified_destination'|'name_search'|'unknown'}
type Payloads = {
 accepted:{session_id:string;message_id:string;campus_id:CampusId;mode:Mode};
 status:{stage:'request'|'knowledge'|'model'|'generation';status:'started';query_state?:'success'|'partial'|'no_evidence'|'timeout'|'unavailable'|'cancelled'|'error'|null;parts?:Record<string,string>|null};
 answer_delta:{text:string};
 sources:{sources:Source[];kind:'retrieved'|'cited'};
 poi_action:{action:SceneAction};
 usage:{model:string;usage:ChatResponse['usage']};
 completed:{response:ChatResponse};
 error:{code:string;message:string;retryable:boolean;partial:boolean;answer:string;reason:'timeout'|'disconnect'|'length'|'empty'|'upstream'|'validation'|'not_implemented'};
 cancelled:{local_task_stopped:boolean;upstream_stop:'not_started'|'unconfirmed'|'confirmed'};
};
export type StreamEvent = {[K in keyof Payloads]:{event_id:string;request_id:string;seq:number;type:K;timestamp:string;payload:Payloads[K];channel?:string|null;requestId?:string|null;generation?:string|null;campusId?:CampusId|null;poiId?:string|null;routeId?:string|null}}[keyof Payloads];
export interface GenerationRendered {event_id:string;request_id:string;session_id:string;message_id:string;campus_id:CampusId;answer_chars:number}
export interface RenderReceipt {event_id:string;request_id:string;status:'recorded'|'duplicate';origin:'frontend'}
export interface SpeechRun {request_id:string;session_id:string;campus_id:CampusId;generation_id:string;voice_id:string;mode:'brief'|'full';signal:AbortSignal}
export interface SpeechProgress {request_id:string;generation_id:string;utterance_id:string|null;segment_id:string|null;status:'idle'|'buffering'|'speaking'|'paused'|'stopped'|'error';code:string|null;text?:string}
export interface SpeechController {
 readonly capabilities:{incremental:boolean;pause:boolean;resume:boolean;timestamps:'none'|'word'|'viseme'};
 enable(enabled:boolean):Promise<AdapterResult>;
 begin(run:SpeechRun):Promise<AdapterResult>;
 append(generation_id:string,text:string):void;
 finish(generation_id:string,final_text:string):Promise<void>;
 playSegment(run:SpeechRun,text:string,segment_id:string):Promise<AdapterResult>;
 playFull(run:SpeechRun,text:string):Promise<AdapterResult>;
 stop(reason:'user'|'new_request'|'clear'|'campus_change'|'cancel'):Promise<void>;
 replay?(run?:SpeechRun):Promise<AdapterResult>; continueRemaining?(run?:SpeechRun):Promise<AdapterResult>;
 playVerbatimUrl?(run:SpeechRun,text:string,segment_id:string,explicitRequest:boolean):Promise<AdapterResult>;
 pause():Promise<AdapterResult>; resume():Promise<AdapterResult>;
 listVoices():Promise<Voice[]>;
 subscribe(callback:(state:SpeechProgress)=>void):()=>void;
 dispose():void;
}

export const CAMPUS_ALIASES:Record<CampusId,readonly string[]> = {weijinlu:['卫津路','卫津路校区','老校区'],beiyangyuan:['北洋园','北洋园校区','新校区']};

export interface UserPosition {lng:number;lat:number;crs:'GCJ02';source:'amap_geolocation'|'manual';accuracy_m:number|null;timestamp:string}
export interface RouteRequest {route_id:string;session_id:string;campus_id:CampusId;destination_poi_id:string;entrance_id:string|null;origin:UserPosition;user_initiated:true}
export interface RouteResponse {route_id:string;destination_poi_id:string;provider:'amap';crs:'GCJ02';distance_m:number;duration_s:number|null;steps:{instruction:string;distance_m:number;polyline:[number,number][]}[];campus_access:'unverified'|'verified';access_source_refs:string[]}
export interface RouteCancelResponse {route_id:string;local_stopped:boolean;upstream_stop:'not_started'|'unconfirmed'|'confirmed'}
