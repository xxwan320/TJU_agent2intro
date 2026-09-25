import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {reconstructionToken,type ModelAsset,type ModelLayout} from '../transport/reconstruction';
import {r2Transport} from '../transport/r2';
import type {POI} from '../../../shared/r2';
import type {MapDestination} from '../transport/amap-navigation';
type Bridge={map:any;api:any;host:HTMLElement;resolve?:(poi:POI)=>Promise<MapDestination[]>};
let bridge:Bridge|null=null,cleanup:(()=>void)|null=null,objects:THREE.Object3D[]=[];
let currentLayouts:ModelLayout[]=[];
let cancelPick:(()=>void)|null=null;
let pickRestore:ReturnType<typeof setTimeout>|null=null;let savedDoubleZoom:boolean|null=null;
export function registerReconstructionMap(map:any,api:any,host:HTMLElement,resolve?:(poi:POI)=>Promise<MapDestination[]>){bridge={map,api,host,resolve};if(typeof window!=='undefined'&&typeof window.dispatchEvent==='function')window.dispatchEvent(new CustomEvent('reconstruction-map-ready'));return()=>{cancelPick?.();cleanup?.();cleanup=null;bridge=null;};}
export async function locateModelPoi(poiId:string):Promise<[number,number]>{
 if(!bridge)throw Error('请先打开在线地图');const owner=bridge,poi=await r2Transport.poi(poiId);
 let point:[number,number];
 if(poi.location?.crs==='GCJ02'&&poi.verification_status==='verified')point=[poi.location.lng,poi.location.lat];
 else {const matches=await owner.resolve?.(poi);if(!matches?.length)throw Error('地图未找到可靠匹配，请手动选择建筑位置');if(matches.length!==1)throw Error('地图存在多个候选，请在地图确认建筑位置');point=[matches[0].lng,matches[0].lat];}
 if(bridge!==owner)throw Error('地图已切换');owner.map.setPitch(0);owner.map.setRotation(0);owner.map.resize();owner.map.setZoomAndCenter(18,point);return point;
}
export function pickModelPoint():Promise<[number,number]>{
 cancelPick?.();return new Promise((resolve,reject)=>{
  if(!bridge){reject(Error('请先切换到在线地图，等待地图就绪'));return;}
  const owner=bridge,{map,host}=owner;map.setPitch(0);map.setRotation(0);map.resize();if(pickRestore)clearTimeout(pickRestore);if(savedDoubleZoom===null)savedDoubleZoom=map.getStatus().doubleClickZoom;map.setStatus({doubleClickZoom:false});map.setDefaultCursor?.('crosshair');let timer:ReturnType<typeof setTimeout>;
  const dispose=()=>{clearTimeout(timer);host.removeEventListener('click',click,true);map.setDefaultCursor?.('default');cancelPick=null;pickRestore=setTimeout(()=>{if(bridge===owner&&!cancelPick){map.setStatus({doubleClickZoom:savedDoubleZoom??true});savedDoubleZoom=null;}},600);};
  const click=(e:MouseEvent)=>{e.preventDefault();e.stopPropagation();const rect=host.getBoundingClientRect();const zoom=map.getZoom(),centerPixel=map.lngLatToPixel(map.getCenter(),zoom);const point=map.pixelToLngLat([centerPixel.getX()+e.clientX-rect.left-rect.width/2,centerPixel.getY()+e.clientY-rect.top-rect.height/2],zoom);host.dataset.lastPick=JSON.stringify({x:e.clientX-rect.left,y:e.clientY-rect.top,zoom,center:map.getCenter().toArray(),point:point.toArray()});dispose();if(bridge!==owner||!point){reject(Error('地图已切换或选点超出地面'));return;}resolve([point.getLng(),point.getLat()]);};
  cancelPick=()=>{dispose();reject(Error('已取消上次地图选点'));};timer=setTimeout(()=>{dispose();reject(Error('选点超时，请重新选择'));},90000);
  setTimeout(()=>{if(cancelPick)host.addEventListener('click',click,true);},0);
 });
}
export function referenceDistance(a:[number,number],b:[number,number]){const rad=Math.PI/180,dlat=(b[1]-a[1])*rad,dlng=(b[0]-a[0])*rad,v=Math.sin(dlat/2)**2+Math.cos(a[1]*rad)*Math.cos(b[1]*rad)*Math.sin(dlng/2)**2;return 6371000*2*Math.atan2(Math.sqrt(v),Math.sqrt(1-v));}
export function focusModelMap(){if(bridge&&currentLayouts.length){bridge.map.setZoomAndCenter(17,currentLayouts[0].anchorLngLat);bridge.map.setPitch(55);}}
export async function showModelsOnMap(assets:ModelAsset[],layouts:ModelLayout[],onApplied:(id:string,revision:number)=>void){
 if(!bridge)throw Error('请先打开在线地图');const owner=bridge;
 const token=await reconstructionToken(),loader=new GLTFLoader().setRequestHeader({'X-Reconstruction-Session':token});
 const loaded=await Promise.all(assets.map(async a=>({a,gltf:await loader.loadAsync(`/api/reconstruction/assets/${a.id}/file?v=${a.sha256}`)})));
 if(bridge!==owner)throw Error('地图实例已变更');cleanup?.();
 const {map,host}=owner,coords=map.customCoords;const origin=layouts[0].anchorLngLat;coords.setCenter(origin);coords.lngLatsToCoords(layouts.map(l=>l.anchorLngLat));
 // Separate WebGL2 canvas overlays this same map. Modern Three needs WebGL2; never clear or dispose the SDK's GL context.
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0,0);
 const canvas=renderer.domElement;canvas.className='reconstruction-map-canvas';Object.assign(canvas.style,{position:'absolute',inset:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:'180'});host.appendChild(canvas);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera();scene.add(new THREE.HemisphereLight(0xffffff,0x999999,2));const light=new THREE.DirectionalLight(0xffffff,2);light.position.set(0,-100,200);scene.add(light);
 objects=[];currentLayouts=layouts;
 for(const {a,gltf} of loaded){const l=layouts.find(l=>l.assetId===a.id)!;if(!l)continue;const object=gltf.scene,box=new THREE.Box3().setFromObject(object),center=box.getCenter(new THREE.Vector3());object.position.set(-center.x,-box.min.y,-center.z);const group=new THREE.Group();group.add(object);
  // glTF Y up -> map Z up. Explicit heading is clockwise from map north.
  group.rotation.set(Math.PI/2,0,-l.headingDeg*Math.PI/180);group.userData={layout:l};scene.add(group);objects.push(group);
 }
 let disposed=false,first=true,frame=0;
 let resolveDraw:()=>void=()=>{},rejectDraw:(e:Error)=>void=()=>{};
 const drawn=new Promise<void>((resolve,reject)=>{resolveDraw=resolve;rejectDraw=reject;});
 const deadline=setTimeout(()=>rejectDraw(Error('地图尚未完成三维绘制，请确认在线地图可见')),15000);
 function render(){if(disposed||bridge!==owner)return;const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);coords.setCenter(origin);
  for(const group of objects){const l=group.userData.layout as ModelLayout;const [lng,lat]=l.anchorLngLat;const east:[number,number]=[lng+10/(111319.490793*Math.cos(lat*Math.PI/180)),lat];const points=coords.lngLatsToCoords([[lng,lat],east]);const unitsPerMeter=Math.hypot(points[1][0]-points[0][0],points[1][1]-points[0][1])/referenceDistance([lng,lat],east);group.position.set(points[0][0],points[0][1],0);group.scale.setScalar(l.metersPerModelUnit*unitsPerMeter);}
  const c=coords.getCameraParams();camera.near=c.near;camera.far=c.far;camera.fov=c.fov;camera.aspect=w/h;camera.position.fromArray(c.position);camera.up.fromArray(c.up);camera.lookAt(new THREE.Vector3().fromArray(c.lookAt));camera.updateProjectionMatrix();renderer.render(scene,camera);
  if(first){first=false;canvas.dataset.assetIds=assets.map(a=>a.id).join(',');requestAnimationFrame(()=>{if(!disposed){for(const l of layouts)onApplied(l.assetId,l.revision);clearTimeout(deadline);resolveDraw();}});}
 }
 const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(render);};
 const events=['viewchange','mapmove','zoomchange','rotatechange','pitchchange','resize'];events.forEach(e=>map.on(e,schedule));const resize=new ResizeObserver(schedule);resize.observe(host);schedule();
 cleanup=()=>{disposed=true;clearTimeout(deadline);rejectDraw(Error('地图已关闭或重新绘制'));cancelAnimationFrame(frame);resize.disconnect();events.forEach(e=>map.off(e,schedule));scene.traverse(o=>{const mesh=o as THREE.Mesh;mesh.geometry?.dispose();const mats=Array.isArray(mesh.material)?mesh.material:[mesh.material];mats.forEach(m=>m?.dispose());});renderer.dispose();canvas.remove();objects=[];};
 await drawn;
}

export function adjustModelMap(action:'pan'|'rotate'|'pitch'|'zoom'){if(!bridge)throw Error('请先打开在线地图');const m=bridge.map;if(action==='pan')m.panBy(90,0);if(action==='rotate')m.setRotation((m.getRotation()+45)%360);if(action==='pitch')m.setPitch(m.getPitch()>0?0:55);if(action==='zoom')m.setZoom(Math.min(19,m.getZoom()+1));}
