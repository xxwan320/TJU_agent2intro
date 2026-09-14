import type { MapPublicConfig, POI, RouteRequest, RouteResponse, UserPosition } from '../../../shared/r2';
import { AmapNavigation, type AmapSdk, type MapDestination, type InternalRouteRequest } from '../transport/amap-navigation';
import { MapBudget } from '../transport/map-budget';

type AMapApi = AmapSdk & Record<string, new (...args: any[]) => any>;

export interface OnlineMapHandle {
  setPois(pois: POI[], selectedId: string | null): void;
  showPosition(position: UserPosition): void;
  showDestination(destination:MapDestination|null):void;
  showRoute(polyline: [number, number][][]): void;
  highlightStep(polyline:[number,number][]):void;
  pickStart(callback:((position:UserPosition)=>void)|null):void;
  clearRoute(): void;
  resize(): void;
  locate(operationId: string, signal: AbortSignal): Promise<UserPosition>;
  locateCity(operationId: string, signal: AbortSignal): Promise<UserPosition>;
  findDestination(poi:POI,operationId:string,signal:AbortSignal):Promise<MapDestination[]>;
  walk(request: RouteRequest, poi: POI, signal: AbortSignal, matched?:MapDestination): Promise<RouteResponse>;
  navigate(request:InternalRouteRequest,poi:POI,signal:AbortSignal,matched?:MapDestination):Promise<{route:RouteResponse;origin:UserPosition;destination?:MapDestination}>;
  destroy(): void;
}
// Pure classification remains testable; the M controller validates navigation origins.
export async function createOnlineMap(host: HTMLElement, config: MapPublicConfig, budget: MapBudget, operationId: string, signal: AbortSignal, onSelect: (poiId: string) => void): Promise<OnlineMapHandle> {
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
  const map = await navigation.createMap(host, operationId, signal, true, {viewMode:'2D',center:[117.17,39.11],zoom:15}) as any;
  const AMap = namespace! as AMapApi;
  if (AMap.Scale) map.addControl(new AMap.Scale());
  let markers:any[] = [], locationMarker:any = null, accuracyCircle:any = null, routeLines:any[] = [];
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
    if (markers.length) map.remove(markers);
    markers = pois.filter(poi => poi.location?.crs==='GCJ02' && poi.verification_status==='verified' && poi.location.verified_at && !['pending','approximate'].includes(poi.location.quality)).map(poi => {
      const marker = new AMap.Marker({position:[poi.location!.lng,poi.location!.lat],title:poi.name,zIndex:poi.id===selectedId?140:100});
      marker.on('click',()=>onSelect(poi.id)); return marker;
    });
    if (markers.length) {map.add(markers); map.setFitView(markers,false,[48,48,48,48],17);}
  }
  function showPosition(position:UserPosition) {
    const point=[position.lng,position.lat];
    const title=position.source==='manual'?'手动起点':position.accuracy_m===null?'IP 区域中心（粗略起点）':'设备定位';
    if (!locationMarker) locationMarker=new AMap.Marker({position:point,title,zIndex:200});
    else {locationMarker.setPosition(point);locationMarker.setTitle(title);}
    map.add(locationMarker);
    map.setCenter(point);
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
  function showDestination(destination:MapDestination|null){
    if(destinationMarker)map.remove(destinationMarker);destinationMarker=null;
    if(!destination)return;
    destinationMarker=new AMap.Marker({position:[destination.lng,destination.lat],title:destination.name,zIndex:190});
    map.add(destinationMarker);map.setZoomAndCenter(17,[destination.lng,destination.lat]);
  }
  return {setPois,showPosition,showDestination,showRoute,highlightStep,pickStart(callback){startPicker=callback;},clearRoute,resize(){map.resize?.();},locate:(id,abort)=>navigation.locate(id,abort,true),locateCity:(id,abort)=>navigation.locateCity(id,abort,true),findDestination:(poi,id,abort)=>navigation.findDestination(poi,id,abort),walk:(request,poi,abort,matched)=>navigation.walk(request,poi,abort,matched),navigate:(request,poi,abort,matched)=>navigation.navigate(request,poi,abort,matched),destroy(){startPicker=null;clearRoute();map.destroy();}};
}
