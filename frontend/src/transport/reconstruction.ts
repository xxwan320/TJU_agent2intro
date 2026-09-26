export type ReconstructionFeedback={registeredViews:number|null;totalViews:number;coverage:'unknown'|'observed_surfaces';coordinateScale:'unknown'|'relative'|'metric';warnings:string[]};
export type QualityReview={status:'passed'|'failed'|'unreviewed';assetSha256?:string;limitations?:string[];method?:string};
export type GLMPreflight={status:'completed'|'unavailable';model?:string;requestId?:string;elapsedMs?:number;totalTokens?:number;requestedProvider?:string;recommendedProvider?:string;appliedProvider?:string;requestedQuality?:string;appliedQuality?:string;suitability?:'good'|'limited'|'insufficient_evidence';reasons?:string[];captureAdvice?:string;scope?:string;verifiedVisually?:false;error?:string};
export type GLMReview={status:'pending'|'completed'|'unavailable';model?:string;requestId?:string;elapsedMs?:number;totalTokens?:number;assessment?:'metrics_consistent'|'needs_attention'|'insufficient_evidence';issues?:string[];nextStep?:string;reason?:string;scope?:string;verifiedVisually?:false;error?:string};
export type ReconstructedCamera={viewIndex:number;position:[number,number,number];target:[number,number,number];up?:[number,number,number];fovYDeg?:number};
export type ModelAsset={id:string;generator?:string;displayName?:string;poiId:string|null;campusId:string;imageId:string;jobId:string;sha256:string;extents:number[];bounds:number[][];vertices:number;faces:number;quality:string;qualityReview?:QualityReview;glmPreflight?:GLMPreflight;glmReview?:GLMReview;parametricSpec?:{floors:number;windowsPerFloor:number;totalFrontWindows:number;windowCountExplicit?:boolean;door?:boolean;roofStyle?:string;verifiedWindowCounts?:{floor:number;frontWindows:number}[]};geometryAudit?:{watertight?:boolean;connectedComponents?:number;volumeToConvexHullRatio?:number};fallbackUsed?:boolean;fallbackFrom?:string;fallbackReason?:string;hunyuanGeometryAudit?:{volumeToConvexHullRatio?:number};publicFileUrl?:string;generatedAt?:string;reconstructionScope?:string;sourceImages?:{url:string;title?:string;sourceUrl?:string}[];cameras?:ReconstructedCamera[];imageIds?:string[];viewCount?:number;inputMode?:'single_image'|'multi_view'|'concept_text';feedback?:ReconstructionFeedback;preprocessing?:{profile:string;warnings:string[]}};
export type ModelLayout={assetId:string;poiId:string|null;campusId:string;anchorLngLat:[number,number];headingDeg:number;metersPerModelUnit:number;revision:number;dimensionsM:{width:number;height:number;depth:number};reference:{axis:string;lengthM:number;source:string;points?:[number,number][]};anchorSource:string;calibration?:{status:'verified'|'unverified';assetSha256?:string;sourceKind?:'map_measurement'|'documented_dimension'|'user_measurement';evidence?:string[]}};
export type ReconstructionState={ready:boolean;textReady?:boolean;providers?:string[];defaultProvider?:string;multiViewReady?:boolean;multiViewMaxViews?:number;images:any[];jobs:any[];assets:ModelAsset[];layouts:ModelLayout[];runs:any[]};
type Activity={jobs:string[];runs:string[];images:string[]};
const ACTIVITY_KEY='ai4tju.reconstruction.activity.v2';
export function reconstructionActivity():Activity{try{return {jobs:[],runs:[],images:[],...JSON.parse(sessionStorage.getItem(ACTIVITY_KEY)||'{}')};}catch{return {jobs:[],runs:[],images:[]};}}
export function rememberReconstruction(kind:keyof Activity,id:string){const activity=reconstructionActivity();if(id&&!activity[kind].includes(id)){activity[kind]=[...activity[kind],id].slice(-60);sessionStorage.setItem(ACTIVITY_KEY,JSON.stringify(activity));}window.dispatchEvent(new CustomEvent('reconstruction-updated'));}
export function qualityPassed(asset:ModelAsset){return asset.qualityReview?.status==='passed'&&asset.qualityReview.assetSha256===asset.sha256;}
let sessionPromise:Promise<string>|null=null;
export async function reconstructionToken(){
 if(!sessionPromise)sessionPromise=(async()=>{const old=localStorage.getItem('ai4tju.reconstruction.session');const response=await fetch('/api/reconstruction/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:old})});if(!response.ok)throw Error('建模会话无法建立');const {token}=await response.json();localStorage.setItem('ai4tju.reconstruction.session',token);return token as string;})().catch(e=>{sessionPromise=null;throw e;});
 return sessionPromise;
}
export async function reconstructionApi(path:string,body?:unknown,method=body===undefined?'GET':'POST',signal?:AbortSignal){
 const token=await reconstructionToken(),r=await fetch('/api/reconstruction'+path,{method,headers:{'Content-Type':'application/json','X-Reconstruction-Session':token},body:body===undefined?undefined:JSON.stringify(body),signal});
 const data=await r.json();if(!r.ok){const detail=data.detail??data.error?.message;throw Error(typeof detail==='string'?detail:'建模请求失败，请检查输入后重试');}return data;
}
export async function modelDownload(asset:ModelAsset){const token=asset.publicFileUrl?'':await reconstructionToken();const r=await fetch(asset.publicFileUrl??`/api/reconstruction/assets/${asset.id}/file`,asset.publicFileUrl?{}:{headers:{'X-Reconstruction-Session':token}});if(!r.ok)throw Error('模型下载失败');const blob=await r.blob(),href=URL.createObjectURL(blob),a=document.createElement('a');a.href=href;a.download=(asset.poiId||asset.id)+'.glb';a.click();setTimeout(()=>URL.revokeObjectURL(href),1000);}
export async function startReconstructionTask(message:string,campusId:string){
 window.dispatchEvent(new CustomEvent('reconstruction-open'));
 if(/^(取消|停止|终止).*(生成|建模|重建|模型)|取消这次建模/.test(message)){
  const state:ReconstructionState=await reconstructionApi('/state'),activity=reconstructionActivity();
  for(const r of state.runs.filter(r=>r.campusId===campusId&&activity.runs.includes(r.id)&&!['succeeded','failed','cancelled','partial'].includes(r.stage)))await reconstructionApi(`/runs/${r.id}/cancel`,{});
  for(const j of state.jobs.filter(j=>j.campusId===campusId&&activity.jobs.includes(j.id)&&!['succeeded','failed','cancelled'].includes(j.stage)))await reconstructionApi(`/jobs/${j.id}/cancel`,{});
  window.dispatchEvent(new CustomEvent('reconstruction-updated'));return;
 }
 const detail:{context?:{sessionId?:string;tourId?:string|null;tourSessionId?:string|null;poiId?:string|null}}={};window.dispatchEvent(new CustomEvent('reconstruction-context-request',{detail}));
 const run=await reconstructionApi('/runs',{message,campusId,idempotencyKey:crypto.randomUUID(),context:detail.context??{}});rememberReconstruction('runs',run.id);return run;
}
export function isReconstructionIntent(text:string){return /建模|重建|三维|3\s*d|glb|模型.*(生成|摆放|地图|展示)|生成.*模型/i.test(text);}
export function isCompoundIntent(text:string){
 const goals=[/介绍|讲解/,/导航|路线|走到/,/导出|下载/,/文档|通知/,/分享/,/建模|三维|3d|模型/i];
 return goals.filter(r=>r.test(text)).length>=2||/先.+再|然后|并且|同时.*并|分别/.test(text);
}
