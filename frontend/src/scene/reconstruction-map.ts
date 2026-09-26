import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {reconstructionToken,type ModelAsset,type ModelLayout} from '../transport/reconstruction';
import {r2Transport} from '../transport/r2';
import type {POI} from '../../../shared/r2';
import type {MapDestination} from '../transport/amap-navigation';
type Bridge={map:any;api:any;host:HTMLElement;resolve?:(poi:POI)=>Promise<MapDestination[]>};
let bridge:Bridge|null=null,cleanup:(()=>void)|null=null,objects:THREE.Object3D[]=[];
let currentLayouts:ModelLayout[]=[];
let generation=0;
const receipts=new Map<string,{revision:number;pixels:number}>();
let cancelPick:(()=>void)|null=null;
let pickRestore:ReturnType<typeof setTimeout>|null=null;let savedDoubleZoom:boolean|null=null;
function visibleHost(host:HTMLElement){const r=host.getBoundingClientRect();return host.isConnected&&r.width>0&&r.height>0&&getComputedStyle(host).visibility!=='hidden'&&r.bottom>0&&r.right>0&&r.top<innerHeight&&r.left<innerWidth;}
function releaseObject(root:THREE.Object3D){root.traverse(o=>{const mesh=o as THREE.Mesh;mesh.geometry?.dispose();for(const material of Array.isArray(mesh.material)?mesh.material:[mesh.material])if(material){for(const value of Object.values(material))if(value instanceof THREE.Texture)value.dispose();material.dispose();}});}
export function clearModelsOnMap(){generation++;cleanup?.();cleanup=null;currentLayouts=[];receipts.clear();}
export function registerReconstructionMap(map:any,api:any,host:HTMLElement,resolve?:(poi:POI)=>Promise<MapDestination[]>){clearModelsOnMap();const owner={map,api,host,resolve};bridge=owner;if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('reconstruction-map-ready'));return()=>{if(bridge!==owner)return;cancelPick?.();clearModelsOnMap();bridge=null;};}
export async function locateModelPoi(poiId:string):Promise<[number,number]>{
 if(!bridge)throw Error('请先打开在线地图');const owner=bridge,poi=await r2Transport.poi(poiId);let point:[number,number];
 if(poi.location?.crs==='GCJ02'&&poi.verification_status==='verified')point=[poi.location.lng,poi.location.lat];
 else{const matches=await owner.resolve?.(poi);if(!matches?.length)throw Error('地图未找到可靠匹配，请手动选择建筑位置');if(matches.length!==1)throw Error('地图存在多个候选，请在地图确认建筑位置');point=[matches[0].lng,matches[0].lat];}
 if(bridge!==owner)throw Error('地图已切换');owner.map.setPitch(0);owner.map.setRotation(0);owner.map.resize();owner.map.setZoomAndCenter(18,point);owner.host.scrollIntoView({behavior:'smooth',block:'center'});return point;
}
export function cancelModelPointPick(){cancelPick?.();}
export function pickModelPoint():Promise<[number,number]>{
 cancelPick?.();return new Promise((resolve,reject)=>{
  if(!bridge){reject(Error('请先切换到在线地图，等待地图就绪'));return;}
  const owner=bridge,{map,host}=owner;receipts.clear();host.querySelectorAll<HTMLCanvasElement>('.reconstruction-map-canvas').forEach(canvas=>canvas.style.visibility='hidden');map.setPitch(0);map.setRotation(0);map.resize();host.scrollIntoView({behavior:'smooth',block:'center'});if(pickRestore)clearTimeout(pickRestore);if(savedDoubleZoom===null)savedDoubleZoom=map.getStatus().doubleClickZoom;map.setStatus({doubleClickZoom:false});map.setDefaultCursor?.('crosshair');let timer:ReturnType<typeof setTimeout>;
  const dispose=()=>{clearTimeout(timer);host.removeEventListener('click',click,true);map.setDefaultCursor?.('default');cancelPick=null;pickRestore=setTimeout(()=>{if(bridge===owner&&!cancelPick){map.setStatus({doubleClickZoom:savedDoubleZoom??true});savedDoubleZoom=null;host.querySelectorAll<HTMLCanvasElement>('.reconstruction-map-canvas').forEach(canvas=>canvas.style.visibility='');}},600);};
  const click=(e:MouseEvent)=>{e.preventDefault();e.stopPropagation();const rect=host.getBoundingClientRect();const zoom=map.getZoom(),centerPixel=map.lngLatToPixel(map.getCenter(),zoom);const point=map.pixelToLngLat([centerPixel.getX()+e.clientX-rect.left-rect.width/2,centerPixel.getY()+e.clientY-rect.top-rect.height/2],zoom);host.dataset.lastPick=JSON.stringify({x:e.clientX-rect.left,y:e.clientY-rect.top,zoom,center:map.getCenter().toArray(),point:point.toArray()});dispose();if(bridge!==owner||!point){reject(Error('地图已切换或选点超出地面'));return;}resolve([point.getLng(),point.getLat()]);};
  cancelPick=()=>{dispose();reject(Error('已取消地图选点'));};timer=setTimeout(()=>{dispose();reject(Error('选点超时，请重新选择'));},90000);setTimeout(()=>{if(cancelPick)host.addEventListener('click',click,true);},0);
 });
}
export function referenceDistance(a:[number,number],b:[number,number]){const rad=Math.PI/180,dlat=(b[1]-a[1])*rad,dlng=(b[0]-a[0])*rad,v=Math.sin(dlat/2)**2+Math.cos(a[1]*rad)*Math.cos(b[1]*rad)*Math.sin(dlng/2)**2;return 6371000*2*Math.atan2(Math.sqrt(v),Math.sqrt(Math.max(0,1-v)));}
export function focusModelMap(){if(bridge&&currentLayouts.length){const lng=currentLayouts.reduce((s,l)=>s+l.anchorLngLat[0],0)/currentLayouts.length,lat=currentLayouts.reduce((s,l)=>s+l.anchorLngLat[1],0)/currentLayouts.length;bridge.map.setZoomAndCenter(currentLayouts.length>1?16:18,[lng,lat]);bridge.map.setPitch(55);bridge.host.scrollIntoView({behavior:'smooth',block:'center'});}}
export function modelMapReceipt(assetId:string,revision:number){const receipt=receipts.get(assetId);return bridge&&visibleHost(bridge.host)&&receipt?.revision===revision?receipt:null;}
export function modelMapQuaternion(headingDeg:number){const up=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),Math.PI/2),front=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),Math.PI);return new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),-headingDeg*Math.PI/180).multiply(up).multiply(front);}
export async function showModelsOnMap(assets:ModelAsset[],layouts:ModelLayout[],onApplied:(id:string,revision:number)=>void,focus=false){
 if(!bridge)throw Error('请先打开在线地图');if(!assets.length||!layouts.length){clearModelsOnMap();return;}const owner=bridge,epoch=++generation;
 const token=await reconstructionToken(),loader=new GLTFLoader().setRequestHeader({'X-Reconstruction-Session':token});
 const loaded=await Promise.all(assets.map(async a=>({a,gltf:await loader.loadAsync(`/api/reconstruction/assets/${a.id}/file?v=${a.sha256}`)})));
 if(bridge!==owner||epoch!==generation){loaded.forEach(({gltf})=>releaseObject(gltf.scene));throw Error('地图或待显示模型已变更');}cleanup?.();receipts.clear();
 const {map,host}=owner,coords=map.customCoords;if(!coords?.getCameraParams)throw Error('当前地图不支持三维坐标同步');
 // Campus origin stays fixed while panning, zooming and switching the selected model.
 const origin:[number,number]=assets[0].campusId==='beiyangyuan'?[117.3138,38.9978]:[117.175,39.108];coords.setCenter(origin);
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0,0);
 const canvas=renderer.domElement;canvas.className='reconstruction-map-canvas';Object.assign(canvas.style,{position:'absolute',inset:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:'180'});host.appendChild(canvas);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera();scene.add(new THREE.HemisphereLight(0xffffff,0x999999,2));const light=new THREE.DirectionalLight(0xffffff,2);light.position.set(0,-100,200);scene.add(light);
 const probe=new THREE.WebGLRenderTarget(128,128,{depthBuffer:true}),probeMaterial=new THREE.MeshBasicMaterial({color:0xffffff,side:THREE.DoubleSide}),pixels=new Uint8Array(128*128*4);
 const localObjects:THREE.Group[]=[];objects=localObjects;currentLayouts=layouts;
 for(const {a,gltf} of loaded){const l=layouts.find(l=>l.assetId===a.id);if(!l){releaseObject(gltf.scene);continue;}const object=gltf.scene,box=new THREE.Box3().setFromObject(object),center=box.getCenter(new THREE.Vector3());object.position.set(-center.x,-box.min.y,-center.z);const group=new THREE.Group();group.add(object);group.quaternion.copy(modelMapQuaternion(l.headingDeg));group.userData={layout:l};scene.add(group);localObjects.push(group);}
 let disposed=false,first=true,frame=0;let evidenceTimer:ReturnType<typeof setTimeout>;
 let resolveDraw:()=>void=()=>{},rejectDraw:(e:Error)=>void=()=>{};const drawn=new Promise<void>((resolve,reject)=>{resolveDraw=resolve;rejectDraw=reject;});const deadline=setTimeout(()=>rejectDraw(Error('地图尚未完成三维绘制，请打开在线地图')),15000);
 function pixelEvidence(){
  receipts.clear();if(cancelPick||canvas.style.visibility==='hidden'||!visibleHost(host))return;const previousTarget=renderer.getRenderTarget();scene.overrideMaterial=probeMaterial;renderer.setRenderTarget(probe);
  try{for(const candidate of localObjects){for(const group of localObjects)group.visible=group===candidate;renderer.clear();renderer.render(scene,camera);renderer.readRenderTargetPixels(probe,0,0,128,128,pixels);let count=0;for(let i=3;i<pixels.length;i+=4)if(pixels[i]>0)count++;const l=candidate.userData.layout as ModelLayout;if(count>=4){receipts.set(l.assetId,{revision:l.revision,pixels:count});onApplied(l.assetId,l.revision);}}}
  finally{for(const group of localObjects)group.visible=true;scene.overrideMaterial=null;renderer.setRenderTarget(previousTarget);}
  canvas.dataset.renderedAssetIds=[...receipts.keys()].join(',');
 }
 function render(){if(disposed||bridge!==owner||epoch!==generation)return;const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);coords.setCenter(origin);
  for(const group of localObjects){const l=group.userData.layout as ModelLayout,[lng,lat]=l.anchorLngLat;const east:[number,number]=[lng+10/(111319.490793*Math.cos(lat*Math.PI/180)),lat];const points=coords.lngLatsToCoords([[lng,lat],east]);const unitsPerMeter=Math.hypot(points[1][0]-points[0][0],points[1][1]-points[0][1])/referenceDistance([lng,lat],east);group.position.set(points[0][0],points[0][1],0);group.scale.setScalar(l.metersPerModelUnit*unitsPerMeter);}
  const c=coords.getCameraParams();camera.near=c.near;camera.far=c.far;camera.fov=c.fov;camera.aspect=w/h;camera.position.fromArray(c.position);camera.up.fromArray(c.up);camera.lookAt(new THREE.Vector3().fromArray(c.lookAt));camera.updateProjectionMatrix();renderer.render(scene,camera);canvas.dataset.assetIds=assets.map(a=>a.id).join(',');
  if(first){first=false;pixelEvidence();renderer.render(scene,camera);clearTimeout(deadline);resolveDraw();}else receipts.clear();
 }
 const schedule=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(render);clearTimeout(evidenceTimer);evidenceTimer=setTimeout(()=>{if(!disposed){pixelEvidence();renderer.render(scene,camera);window.dispatchEvent(new CustomEvent('reconstruction-map-drawn'));}},160);};
 const settled=()=>{if(disposed)return;schedule();requestAnimationFrame(()=>{if(!disposed){pixelEvidence();renderer.render(scene,camera);window.dispatchEvent(new CustomEvent('reconstruction-map-drawn'));}});};
 const events=['viewchange','mapmove','zoomchange','rotatechange','pitchchange','resize'];events.forEach(e=>map.on(e,schedule));const endEvents=['moveend','zoomend','rotateend','pitchend'];endEvents.forEach(e=>map.on(e,settled));const resize=new ResizeObserver(settled);resize.observe(host);
 const viewObserver=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting))settled();else receipts.clear();},{threshold:.1});viewObserver.observe(host);
 cleanup=()=>{disposed=true;clearTimeout(deadline);clearTimeout(evidenceTimer);rejectDraw(Error('地图已关闭或重新绘制'));cancelAnimationFrame(frame);resize.disconnect();viewObserver.disconnect();events.forEach(e=>map.off(e,schedule));endEvents.forEach(e=>map.off(e,settled));releaseObject(scene);probe.dispose();probeMaterial.dispose();renderer.dispose();canvas.remove();objects=[];receipts.clear();};
 if(focus)focusModelMap();schedule();await drawn;
}
export function adjustModelMap(action:'pan'|'rotate'|'pitch'|'zoom'){if(!bridge)throw Error('请先打开在线地图');const m=bridge.map;if(action==='pan')m.panBy(90,0);if(action==='rotate')m.setRotation((m.getRotation()+45)%360);if(action==='pitch')m.setPitch(m.getPitch()>0?0:55);if(action==='zoom')m.setZoom(Math.min(19,m.getZoom()+1));}
