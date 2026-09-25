"""One owned job: CUDA TripoSR, explicitly CPU marching cubes, self-contained GLB."""
from pathlib import Path
import sys,json,time,os,hashlib,platform
root=Path(__file__).resolve().parents[1];home=root/'.reconstruction'
sys.path[:0]=[str(home/'compat'),str(home/'TripoSR')]
os.environ['HF_HUB_DISABLE_TELEMETRY']='1'
jobfile=Path(sys.argv[1]);job=json.loads(jobfile.read_text());folder=jobfile.parent
start=time.time();times={};fast=job.get('quality','fast')=='fast';resolution=128 if fast else 256
def phase(name):
 if (folder/'cancel').exists():raise InterruptedError('cancelled')
 (folder/'phase.json').write_text(json.dumps({'stage':name,'elapsedSeconds':time.time()-start}));times[name]=time.time()-start
def digest(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
try:
 phase('preprocessing')
 import torch,numpy as np,trimesh
 from PIL import Image,ImageOps
 from tsr.system import TSR
 from reconstruction_preprocess import prepare_image
 assert torch.cuda.is_available(),'CUDA unavailable'
 probe=torch.randn(64,64,device='cuda');assert torch.isfinite(probe@probe).all().item()
 torch.cuda.reset_peak_memory_stats()
 im=ImageOps.exif_transpose(Image.open(job['imagePath'])).convert('RGBA')
 def remove_background(image):
  import rembg
  return rembg.remove(image,session=rembg.new_session('u2netp' if fast else 'u2net',providers=['CPUExecutionProvider']))
 im,preprocessing=prepare_image(im,job.get('removeBackground',True),remove_background,'u2netp' if fast else 'u2net')
 coverage=preprocessing['foregroundCoverage'];im.save(folder/'processed.png')
 (folder/'preprocessing.json').write_text(json.dumps(preprocessing,ensure_ascii=False),encoding='utf-8')
 phase('loading')
 weights=json.loads((home/'weights.json').read_text());model=TSR.from_pretrained(weights['path'],config_name='config.yaml',weight_name='model.ckpt')
 model.renderer.set_chunk_size(4096);model.to('cuda')
 phase('reconstructing')
 with torch.no_grad(),torch.autocast(device_type='cuda',dtype=torch.float16,enabled=fast):codes=model([im],device='cuda')
 torch.cuda.synchronize();phase('exporting')
 with torch.no_grad(),torch.autocast(device_type='cuda',dtype=torch.float16,enabled=fast):meshes=model.extract_mesh(codes,True,resolution=resolution)
 mesh=meshes[0]
 # skimage and torchmcubes use opposite face winding. Repair each component;
 # otherwise a valid GLB renders its inner faces and appears dark or perforated.
 mesh.fix_normals(multibody=True)
 # TripoSR Z-up -> glTF Y-up, preserve orientation for separately calibrated heading.
 mesh.apply_transform(trimesh.transformations.rotation_matrix(-np.pi/2,[1,0,0]))
 mesh.apply_transform(trimesh.transformations.rotation_matrix(np.pi/2,[0,1,0]))
 def material(tree):
  tree['materials']=[{'name':'Reconstructed vertex colors','pbrMetallicRoughness':{'baseColorFactor':[1,1,1,1],'metallicFactor':0,'roughnessFactor':1}}]
  for m in tree['meshes']:
   for primitive in m['primitives']:primitive['material']=0
 (folder/'model.glb').write_bytes(trimesh.exchange.gltf.export_glb(mesh.scene(),tree_postprocessor=material))
 phase('validating')
 scene=trimesh.load(folder/'model.glb',force='scene');parts=list(scene.geometry.values());assert parts
 for m in parts:
  assert len(m.vertices)>3 and len(m.faces)>3 and np.isfinite(m.vertices).all()
  assert m.faces.min()>=0 and m.faces.max()<len(m.vertices)
  assert (m.extents>1e-5).all()
  assert m.visual.kind in ('vertex','texture','face')
 peak=torch.cuda.max_memory_allocated();phase('succeeded')
 data={'stage':'succeeded','generator':'triposr','qualityProfile':job.get('quality','fast'),'meshResolution':resolution,'precision':'autocast-fp16' if fast else 'fp32','inputSha256':digest(job['imagePath']),'sha256':digest(folder/'model.glb'),'bytes':(folder/'model.glb').stat().st_size,'bounds':scene.bounds.tolist(),'extents':scene.extents.tolist(),'vertices':sum(len(m.vertices) for m in parts),'faces':sum(len(m.faces) for m in parts),'colors':True,'upAxis':'Y','foregroundCoverage':coverage,'preprocessing':preprocessing,'timings':times,'totalSeconds':time.time()-start,'peakCudaBytes':peak,'environment':{'python':platform.python_version(),'torch':torch.__version__,'cuda':torch.version.cuda,'gpu':torch.cuda.get_device_name(),'capability':torch.cuda.get_device_capability(),'marchingCubes':'scikit-image CPU compatibility adapter','source':json.loads((home/'source-version.json').read_text()),'weightsRevision':weights['revision']},'quality':'图片生成的粗略网格；需对照原图检查，背面及遮挡面为推断。'}
 (folder/'result.json').write_text(json.dumps(data,indent=2))
except BaseException as e:
 import traceback;traceback.print_exc()
 (folder/'result.json').write_text(json.dumps({'stage':'cancelled' if isinstance(e,InterruptedError) else 'failed','error':str(e),'errorType':type(e).__name__,'elapsedSeconds':time.time()-start}))
 sys.exit(2)
