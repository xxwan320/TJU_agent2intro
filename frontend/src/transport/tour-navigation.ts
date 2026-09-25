// M-owned bridge: existing AmapNavigation remains the sole online navigation path.
import type {TourSession,TourStop} from '../../../shared/r3';
import type {POI,UserPosition} from '../../../shared/r2';
import {AmapNavigation,type MapDestination} from './amap-navigation';
export const R3_NAVIGATION_POLICY=Object.freeze({
 destinationCacheMs:600000,positionMaxAgeMs:120000,
 autoRecalculate:false,deviationTrigger:'user_confirmed' as const,
 routeCache:'memory_current_leg_only' as const,
});
export function navigateTourStop(nav:AmapNavigation,session:TourSession,stop:TourStop,poi:POI,
 routeId:string,origin:UserPosition|null,signal:AbortSignal,matched?:MapDestination) {
 if(session.status!=='active'||session.current_stop_id!==stop.stop_id||
    !session.plan.stops.some(s=>s.stop_id===stop.stop_id&&s.poi_id===stop.poi_id)||
    stop.poi_id!==poi.id||session.plan.campus_id!==poi.campus_id) {
  throw new Error('tour_navigation_context_mismatch');
 }
 return nav.navigate({route_id:routeId,session_id:session.session_id,campus_id:session.plan.campus_id,
  destination_poi_id:poi.id,entrance_id:null,user_initiated:true,origin},poi,signal,matched);
}