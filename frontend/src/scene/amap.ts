import {registerReconstructionMap} from './reconstruction-map';
import type { TourSession, TourStop } from '../../../shared/r3';
import type { CampusId } from '../../../shared/contracts';
import { navigateTourStop } from '../transport/tour-navigation';
import type { MapPublicConfig, POI, RouteRequest, RouteResponse, UserPosition } from '../../../shared/r2';
import { AmapNavigation, type AmapSdk, type MapDestination, type InternalRouteRequest } from '../transport/amap-navigation';
import { MapBudget } from '../transport/map-budget';

type AMapApi = AmapSdk & Record<string, new (...args: any[]) => any>;

export interface TourStopMarker { stop_id: string; poiId: string; title: string; lng: number; lat: number; index: number }

// GCJ02 campus centers; the online map re-centers here when the campus changes.
export const CAMPUS_MAP_VIEW: Record<CampusId, { center: [number, number]; zoom: number }> = {
  weijinlu: { center: [117.175, 39.108], zoom: 15 },
  beiyangyuan: { center: [117.3138, 38.9978], zoom: 15 },
};

export interface OnlineMapHandle {
  setPois(pois: POI[], selectedId: string | null): void;
  showTourStops(stops: TourStopMarker[]): void;
  showPosition(position: UserPosition, focus?:boolean): void; clearPosition():void;
  showDestination(destination:MapDestination|null):void;
  showRoute(polyline: [number, number][][]): void;
  highlightStep(polyline:[number,number][]):void;
  pickStart(callback:((position:UserPosition)=>void)|null):void;
  clearRoute(): void;
  focusCampus(center: [number, number], zoom: number): void;
  resize(): void;
  locate(operationId: string, signal: AbortSignal): Promise<UserPosition>;
  locateCity(operationId: string, signal: AbortSignal): Promise<UserPosition>;
  findDestination(poi:POI,operationId:string,signal:AbortSignal):Promise<MapDestination[]>;
  walk(request: RouteRequest, poi: POI, signal: AbortSignal, matched?:MapDestination): Promise<RouteResponse>;
  navigate(request:InternalRouteRequest,poi:POI,signal:AbortSignal,matched?:MapDestination):Promise<{route:RouteResponse;origin:UserPosition;destination?:MapDestination}>;
  navigateTour(session:TourSession,stop:TourStop,poi:POI,routeId:string,origin:UserPosition|null,signal:AbortSignal,matched?:MapDestination):ReturnType<typeof navigateTourStop>;
  destroy(): void;
}
// Pure classification remains testable; the M controller validates navigation origins.
export async function createOnlineMap(host: HTMLElement, config: MapPublicConfig, budget: MapBudget, operationId: string, signal: AbortSignal, onSelect: (poiId: string) => void, view: { center: [number, number]; zoom: number }): Promise<OnlineMapHandle> {
  let namespace: AMapApi | null = null;
  // This loader is invoked only inside M's reserved map_load budget operation.
  const navigation = new AmapNavigation(config, budget, async (settings) => {
    const service = new URL(settings.service_host, location.origin);
    if (service.origin !== location.origin) throw new Error('service_host_not_same_origin');
    (window as Window & {_AMapSecurityConfig?: {serviceHost:string}})._AMapSecurityConfig = {serviceHost:service.href.replace(/\/$/, '')};
    const loader = await import('@amap/amap-jsapi-loader');
    namespace = await loader.default.load({key:settings.js_key!,version:'2.0',plugins:['AMap.Geolocation','AMap.CitySearch','AMap.Scale']}) as AMapApi;
    return namespace;
  });
  const map = await navigation.createMap(host, operationId, signal, true, {viewMode:'3D',pitch:0,center:view.center,zoom:view.zoom}) as any;
  const AMap = namespace! as AMapApi;
  const releaseReconstruction=registerReconstructionMap(map,AMap,host,poi=>navigation.findDestination(poi,'model-anchor-'+crypto.randomUUID(),new AbortController().signal));
  if (AMap.Scale) map.addControl(new AMap.Scale());
  let markers:any[] = [], locationMarker:any = null, accuracyCircle:any = null, routeLines:any[] = [], tourMarkers:any[] = [];
  const poiMarkers=new Map<string,{marker:any;key:string}>();
  let previousPois:POI[]|null=null,previousSelected:string|null=null;
  let activeStep:any=null,destinationMarker:any=null,startPicker:((position:UserPosition)=>void)|null=null;
  map.on('click',(event:any)=>{
    if(!startPicker||!event.lnglat)return;
    const callback=startPicker;startPicker=null;
    callback({lng:event.lnglat.getLng(),lat:event.lnglat.getLat(),crs:'GCJ02',source:'manual',accuracy_m:null,timestamp:new Date().toISOString()});
  });
  function clearRoute() { if (routeLines.length) map.remove(routeLines); routeLines=[];if(activeStep)map.remove(activeStep);activeStep=null; }
  function highlightStep(path:[number,number][]){
    if(activeStep)map.remove(activeStep);activeStep=null;
    if(path.length<2)return;
    activeStep=new AMap.Polyline({path,strokeColor:'#ea8732',strokeWeight:9,zIndex:150,showDir:true});
    map.add(activeStep);map.setFitView([activeStep],false,[60,60,60,60],18);
  }
  function setPois(pois: POI[], selectedId: string | null) {
    if(previousPois===pois){
      if(previousSelected!==selectedId){
        const old=previousSelected?poiMarkers.get(previousSelected)?.marker:null;
        old?.setzIndex?.(100);old?.setLabel?.({content:'',direction:'top'});
        const next=selectedId?poiMarkers.get(selectedId)?.marker:null;
        next?.setzIndex?.(190);next?.setLabel?.({content:'已选中',direction:'top'});
      }
      previousSelected=selectedId;return;
    }
    const valid=pois.filter(poi=>poi.location?.crs==='GCJ02'&&poi.verification_status==='verified'&&poi.location.verified_at&&!['pending','approximate'].includes(poi.location.quality));
    const ids=new Set(valid.map(p=>p.id));
    for(const [id,entry] of poiMarkers)if(!ids.has(id)){map.remove(entry.marker);poiMarkers.delete(id);}
    for(const poi of valid){
      const key=JSON.stringify([poi.location!.lng,poi.location!.lat,poi.name]);let entry=poiMarkers.get(poi.id);
      if(entry?.key!==key){
        if(entry)map.remove(entry.marker);
        const marker=new AMap.Marker({position:[poi.location!.lng,poi.location!.lat],title:poi.name});
        marker.on('click',()=>onSelect(poi.id));entry={marker,key};poiMarkers.set(poi.id,entry);map.add(marker);
      }
      entry.marker.setzIndex?.(poi.id===selectedId?190:100);
      entry.marker.setLabel?.({content:poi.id===selectedId?'已选中':'',direction:'top'});
    }
    markers=[...poiMarkers.values()].map(entry=>entry.marker);
    previousPois=pois;previousSelected=selectedId;
  }
  function showPosition(position:UserPosition,focus=true) {
    const point=[position.lng,position.lat];
    const title=position.source==='manual'?'手动起点':position.accuracy_m===null?'IP 区域中心（粗略起点）':'设备定位';
    if (!locationMarker) locationMarker=new AMap.Marker({position:point,title,zIndex:200});
    else {locationMarker.setPosition(point);locationMarker.setTitle(title);}
    map.add(locationMarker);
    if(focus)map.setCenter(point);
    if (accuracyCircle) {map.remove(accuracyCircle);accuracyCircle=null;}
    if (position.accuracy_m!==null) {
      accuracyCircle=new AMap.Circle({center:point,radius:position.accuracy_m,strokeColor:'#147da5',fillOpacity:.14});map.add(accuracyCircle);
    }
  }
  function showRoute(lines:[number,number][][]) {
    clearRoute();
    routeLines=lines.filter(line=>line.length>1).map(path=>new AMap.Polyline({path,strokeColor:'#08779d',strokeWeight:7,showDir:true}));
    if(routeLines.length){map.add(routeLines);map.setFitView(routeLines);}
  }
  function showTourStops(stops:TourStopMarker[]){
    if(tourMarkers.length)map.remove(tourMarkers);tourMarkers=[];
    if(!stops.length)return;
    tourMarkers=stops.map(item=>{const marker=new AMap.Marker({position:[item.lng,item.lat],title:item.title,zIndex:130,label:{content:String(item.index+1),direction:'top'}});marker.on('click',()=>onSelect(item.poiId));return marker;});
    map.add(tourMarkers);
    if(!routeLines.length)map.setFitView(tourMarkers,false,[48,48,48,48],15);
  }
  function showDestination(destination:MapDestination|null){
    if(destinationMarker)map.remove(destinationMarker);destinationMarker=null;
    if(!destination)return;
    destinationMarker=new AMap.Marker({position:[destination.lng,destination.lat],title:destination.name,zIndex:190,label:{content:'已选中',direction:'top'}});
    destinationMarker.on('click',()=>onSelect(destination.poiId));
    map.add(destinationMarker);map.setZoomAndCenter(17,[destination.lng,destination.lat]);
  }
  return {focusCampus(center,zoom){map.setZoomAndCenter(zoom,center);},setPois,showTourStops,showPosition,clearPosition(){if(locationMarker)map.remove(locationMarker);if(accuracyCircle)map.remove(accuracyCircle);locationMarker=null;accuracyCircle=null;},showDestination,showRoute,highlightStep,pickStart(callback){startPicker=callback;},clearRoute,resize(){map.resize?.();},locate:(id,abort)=>navigation.locate(id,abort,true),locateCity:(id,abort)=>navigation.locateCity(id,abort,true),findDestination:(poi,id,abort)=>navigation.findDestination(poi,id,abort),walk:(request,poi,abort,matched)=>navigation.walk(request,poi,abort,matched),navigate:(request,poi,abort,matched)=>navigation.navigate(request,poi,abort,matched),navigateTour:(session,stop,poi,id,origin,abort,matched)=>navigateTourStop(navigation,session,stop,poi,id,origin,abort,matched),destroy(){releaseReconstruction();startPicker=null;clearRoute();if(tourMarkers.length){map.remove(tourMarkers);tourMarkers=[];}map.destroy();}};
}
