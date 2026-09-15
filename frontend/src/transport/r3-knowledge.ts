// M-owned same-origin read-only transport. No raw location fields.
import {api} from './api';
import type {CampusId} from '../../../shared/contracts';
import type {TourKnowledgeContext} from '../../../shared/r3-knowledge';
export function tourKnowledgeContext(poiId:string,campusId:CampusId,visitDate?:string,signal?:AbortSignal):Promise<TourKnowledgeContext>{
 const query=new URLSearchParams({campus_id:campusId});
 if(visitDate)query.set('visit_date',visitDate);
 return api<TourKnowledgeContext>('/knowledge/tour-context/'+encodeURIComponent(poiId)+'?'+query,{signal});
}