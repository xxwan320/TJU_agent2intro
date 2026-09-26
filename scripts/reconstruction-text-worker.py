"""Actual Shap-E text-conditioned diffusion and validated, self-contained GLB."""
from pathlib import Path
import sys,json,time,hashlib,gc,os
root=Path(__file__).resolve().parents[1];sys.path.insert(0,str(root/'.reconstruction/shap-e'))
jobfile=Path(sys.argv[1]);job=json.loads(jobfile.read_text());folder=jobfile.parent;started=time.monotonic();times={}
def phase(name):
 if (folder/'cancel').exists():raise InterruptedError('cancelled')
 times[name]=time.monotonic()-started;(folder/'phase.json').write_text(json.dumps({'stage':name,'elapsedSeconds':times[name]}))
try:
 phase('loading');import torch,numpy as np,trimesh
 from shap_e.diffusion.sample import sample_latents
 from shap_e.diffusion.gaussian_diffusion import diffusion_from_config
 from shap_e.models.download import load_model,load_config
 import shap_e.models.download as download
 from shap_e.models.nn.camera import DifferentiableCameraBatch,DifferentiableProjectiveCamera
 from shap_e.util.collections import AttrDict
 cache=str(root/'.reconstruction/shap-e-weights');download.default_cache_dir=lambda:cache
 torch.cuda.reset_peak_memory_stats();device=torch.device('cuda');torch.manual_seed(42)
 model=load_model('text300M',device=device,cache_dir=cache)
 phase('reconstructing')
 latents=sample_latents(batch_size=1,model=model,diffusion=diffusion_from_config(load_config('diffusion',cache_dir=cache)),guidance_scale=15.,model_kwargs={'texts':[job['prompt']]},clip_denoised=True,use_fp16=True,use_karras=True,karras_steps=64,sigma_min=1e-3,sigma_max=160,s_churn=0,progress=False)
 del model;gc.collect();torch.cuda.empty_cache();phase('exporting')
 decoder=load_model('decoder',device=device,cache_dir=cache)
 # Shap-E official notebook's minimal camera batch is used only to extract mesh.
 origins=[];xs=[];ys=[];zs=[]
 for theta in np.linspace(0,2*np.pi,20):
  z=np.array([np.sin(theta),np.cos(theta),-.5]);z/=np.linalg.norm(z);x=np.array([np.cos(theta),-np.sin(theta),0.]);origins.append(-z*4);xs.append(x);ys.append(np.cross(z,x));zs.append(z)
 cam=DifferentiableCameraBatch(shape=(1,20),flat_camera=DifferentiableProjectiveCamera(**{k:torch.from_numpy(np.stack(v)).float().to(device) for k,v in [('origin',origins),('x',xs),('y',ys),('z',zs)]},width=2,height=2,x_fov=.7,y_fov=.7))
 with torch.no_grad():decoded=decoder.renderer.render_views(AttrDict(cameras=cam),params=decoder.bottleneck_to_params(latents[0][None]),options=AttrDict(rendering_mode='stf',render_with_direction=False))
 meshdata=decoded.raw_meshes[0].tri_mesh();colors=np.stack([meshdata.vertex_channels[k] for k in 'RGB'],axis=-1)
 mesh=trimesh.Trimesh(vertices=meshdata.verts,faces=meshdata.faces,vertex_colors=(colors.clip(0,1)*255).astype(np.uint8),process=False)
 # Shap-E meshes can have small, high-frequency bumps from voxel decoding.
 # A short Taubin pass suppresses those ripples while limiting the shrinkage
 # of ordinary Laplacian smoothing. Keep colors and topology unchanged.
 smooth_passes=6
 trimesh.smoothing.filter_taubin(mesh,lamb=.45,nu=.47,iterations=smooth_passes)
 mesh.fix_normals(multibody=True);mesh.apply_transform(trimesh.transformations.rotation_matrix(-np.pi/2,[1,0,0]))
 def material(tree):
  tree['materials']=[{'pbrMetallicRoughness':{'baseColorFactor':[1,1,1,1],'metallicFactor':0,'roughnessFactor':1}}]
  for m in tree['meshes']:
   for primitive in m['primitives']:primitive['material']=0
 path=folder/'model.glb';path.write_bytes(trimesh.exchange.gltf.export_glb(mesh.scene(),tree_postprocessor=material));phase('validating')
 scene=trimesh.load(path,force='scene');parts=list(scene.geometry.values());assert parts
 for part in parts:
  assert len(part.vertices)>3 and len(part.faces)>3 and np.isfinite(part.vertices).all() and (part.extents>1e-5).all()
  assert part.faces.min()>=0 and part.faces.max()<len(part.vertices) and part.visual.kind in ('vertex','texture','face')
 result={'stage':'succeeded','generator':'shap-e-text','conditionPrompt':job['prompt'],'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'bytes':path.stat().st_size,'bounds':scene.bounds.tolist(),'extents':scene.extents.tolist(),'vertices':sum(len(p.vertices) for p in parts),'faces':sum(len(p.faces) for p in parts),'colors':True,'surfacePolish':{'method':'Taubin smoothing','passes':smooth_passes,'note':'Reduces small mesh ripples; does not add texture detail.'},'upAxis':'Y','timings':times,'totalSeconds':time.monotonic()-started,'peakCudaBytes':torch.cuda.max_memory_allocated(),'environment':{'torch':torch.__version__,'gpu':torch.cuda.get_device_name(),'source':json.loads((root/'.reconstruction/shap-e-version.json').read_text())},'quality':'根据自然语言条件生成的概念模型；非测绘还原，未见结构为推断。'}
 (folder/'result.json').write_text(json.dumps(result,ensure_ascii=False),encoding='utf-8')
except BaseException as exc:
 import traceback;traceback.print_exc();(folder/'result.json').write_text(json.dumps({'stage':'cancelled' if isinstance(exc,InterruptedError) else 'failed','error':str(exc),'errorType':type(exc).__name__}),encoding='utf-8');sys.exit(2)
