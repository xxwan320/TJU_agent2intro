// M-owned thin transport. A owns lane/generation/AbortController and decides what to send.
import {api} from './api';
import type {TourRequest,TourResult,TourSession,PlanRevision,TourCommand,TourRestore,RouteCostRequest,RouteCostResponse} from '../../../shared/r3';
const json=(body:unknown,signal?:AbortSignal):RequestInit=>({method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal});
const path=(id:string)=>'/tours/'+encodeURIComponent(id);
export const r3Transport={
 create:(body:TourRequest,signal:AbortSignal)=>api<TourResult>('/tours',json(body,signal)),
 read:(tourId:string,sessionId:string,signal?:AbortSignal)=>api<TourSession>(path(tourId)+'?'+new URLSearchParams({session_id:sessionId}),{signal}),
 revise:(tourId:string,body:PlanRevision,signal:AbortSignal)=>api<TourResult>(path(tourId)+'/revisions',json(body,signal)),
 command:(tourId:string,body:TourCommand,signal:AbortSignal)=>api<TourResult>(path(tourId)+'/commands',json(body,signal)),
 restore:(body:TourRestore,signal:AbortSignal)=>api<TourResult>('/tours/restore',json(body,signal)),
 routeCosts:(body:RouteCostRequest,signal:AbortSignal)=>api<RouteCostResponse>('/maps/route-costs',json(body,signal)),
};
export interface TourResponseContext {
 requestId:string; sessionId:string; campusId:string; generation:number;
 tourId?:string; planVersion:number; stateVersion:number;
}
// A calls before commit, including after cancellation/campus changes; this helper owns no UI state.
export function acceptsTourResult(result:TourResult,ctx:TourResponseContext,currentGeneration:number):boolean {
 const session=result.session;
 return ctx.generation===currentGeneration && result.request_id===ctx.requestId
  && session.session_id===ctx.sessionId && session.plan.campus_id===ctx.campusId
  && (!ctx.tourId||session.tour_id===ctx.tourId)
  && session.plan.version>=ctx.planVersion && session.state_version>=ctx.stateVersion;
}