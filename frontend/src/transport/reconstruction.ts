export type ModelAsset={id:string;poiId:string;campusId:string;imageId:string;jobId:string;sha256:string;extents:number[];bounds:number[][];vertices:number;faces:number;quality:string};
export type ModelLayout={assetId:string;poiId:string;campusId:string;anchorLngLat:[number,number];headingDeg:number;metersPerModelUnit:number;revision:number;dimensionsM:{width:number;height:number;depth:number};reference:{axis:string;lengthM:number;source:string;points?:[number,number][]};anchorSource:string};
export type ReconstructionState={ready:boolean;images:any[];jobs:any[];assets:ModelAsset[];layouts:ModelLayout[];runs:any[]};
let sessionPromise:Promise<string>|null=null;
export async function reconstructionToken(){
 if(!sessionPromise)sessionPromise=(async()=>{const old=localStorage.getItem('ai4tju.reconstruction.session');const response=await fetch('/api/reconstruction/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({token:old})});if(!response.ok)throw Error('建模会话无法建立');const {token}=await response.json();localStorage.setItem('ai4tju.reconstruction.session',token);return token as string;})().catch(e=>{sessionPromise=null;throw e;});
 return sessionPromise;
}
export async function reconstructionApi(path:string,body?:unknown,method=body===undefined?'GET':'POST'){
 const token=await reconstructionToken(),r=await fetch('/api/reconstruction'+path,{method,headers:{'Content-Type':'application/json','X-Reconstruction-Session':token},body:body===undefined?undefined:JSON.stringify(body)});
 const data=await r.json();if(!r.ok)throw Error(data.detail??data.error?.message??'建模请求失败');return data;
}
export async function modelDownload(asset:ModelAsset){const token=await reconstructionToken();const r=await fetch(`/api/reconstruction/assets/${asset.id}/file`,{headers:{'X-Reconstruction-Session':token}});if(!r.ok)throw Error('模型下载失败');const blob=await r.blob(),href=URL.createObjectURL(blob),a=document.createElement('a');a.href=href;a.download=asset.poiId+'.glb';a.click();setTimeout(()=>URL.revokeObjectURL(href),1000);}
export async function startReconstructionTask(message:string,campusId:string){
 window.dispatchEvent(new CustomEvent('reconstruction-open'));
 if(/^(取消|停止|终止).*(生成|建模|重建|模型)|取消这次建模/.test(message)){
  const state:ReconstructionState=await reconstructionApi('/state');
  for(const r of state.runs.filter(r=>r.campusId===campusId&&!['succeeded','failed','cancelled','partial'].includes(r.stage)))await reconstructionApi(`/runs/${r.id}/cancel`,{});
  for(const j of state.jobs.filter(j=>j.campusId===campusId&&!['succeeded','failed','cancelled'].includes(j.stage)))await reconstructionApi(`/jobs/${j.id}/cancel`,{});
  return;
 }
 return reconstructionApi('/runs',{message,campusId,idempotencyKey:crypto.randomUUID()});
}
export function isReconstructionIntent(text:string){return /建模|重建|三维|3\s*d|glb|模型.*(生成|摆放|地图|展示)|生成.*模型/i.test(text);}
export function isCompoundIntent(text:string){
 const goals=[/介绍|讲解/,/导航|路线|走到/,/导出|下载/,/文档|通知/,/分享/,/建模|三维|3d|模型/i];
 return goals.filter(r=>r.test(text)).length>=2||/先.+再|然后|并且|同时.*并|分别/.test(text);
}
