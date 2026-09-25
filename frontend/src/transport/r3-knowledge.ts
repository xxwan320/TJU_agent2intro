// M-owned same-origin read-only transport. No raw location fields.
import {api} from './api';
import type {CampusId} from '../../../shared/contracts';
import type {TourKnowledgeContext} from '../../../shared/r3-knowledge';
import {cachedRead} from './cached-read';
const readContext=cachedRead<TourKnowledgeContext>();
export function tourKnowledgeContext(poiId:string,campusId:CampusId,visitDate?:string,signal?:AbortSignal):Promise<TourKnowledgeContext>{
 const query=new URLSearchParams({campus_id:campusId});
 if(visitDate)query.set('visit_date',visitDate);
 const path='/knowledge/tour-context/'+encodeURIComponent(poiId)+'?'+query;
 return readContext(path,signal,shared=>api<TourKnowledgeContext>(path,{signal:shared}));
}
