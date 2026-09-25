"""One owned job: CUDA TripoSR, explicitly CPU marching cubes, self-contained GLB."""
from pathlib import Path
import sys,json,time,os,hashlib,platform
root=Path(__file__).resolve().parents[1];home=root/'.reconstruction'
sys.path[:0]=[str(home/'compat'),str(home/'TripoSR')]
os.environ['HF_HUB_DISABLE_TELEMETRY']='1'
jobfile=Path(sys.argv[1]);job=json.loads(jobfile.read_text());folder=jobfile.parent
start=time.time();times={}
def phase(name):
 if (folder/'cancel').exists():raise InterruptedError('cancelled')
 (folder/'phase.json').write_text(json.dumps({'stage':name,'elapsedSeconds':time.time()-start}));times[name]=time.time()-start
def digest(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
try:
 phase('preprocessing')
 import torch,numpy as np,trimesh
 from PIL import Image,ImageOps
 from tsr.system import TSR
 from tsr.utils import resize_foreground
 assert torch.cuda.is_available(),'CUDA unavailable'
 probe=torch.randn(64,64,device='cuda');assert torch.isfinite(probe@probe).all().item()
 torch.cuda.reset_peak_memory_stats()
 im=ImageOps.exif_transpose(Image.open(job['imagePath'])).convert('RGBA')
 # Preserve supplied alpha. Background removal is optional; original remains untouched.
 if job.get('removeBackground',True) and im.getextrema()[3]==(255,255):
  import rembg
  im=rembg.remove(im,session=rembg.new_session('u2net',providers=['CPUExecutionProvider']))
 alpha=np.asarray(im)[:,:,3];coverage=float((alpha>127).mean())
 if coverage<.03:raise ValueError('Foreground mask removed the subject; use the original-image profile or crop manually')
 im=resize_foreground(im,.9);a=np.asarray(im).astype(np.float32)/255
 rgb=a[:,:,:3]*a[:,:,3:4]+.5*(1-a[:,:,3:4]);im=Image.fromarray((rgb*255).astype(np.uint8));im.save(folder/'processed.png')
 phase('loading')
 weights=json.loads((home/'weights.json').read_text());model=TSR.from_pretrained(weights['path'],config_name='config.yaml',weight_name='model.ckpt')
 model.renderer.set_chunk_size(4096);model.to('cuda')
 phase('reconstructing')
 with torch.no_grad():codes=model([im],device='cuda')
 torch.cuda.synchronize();phase('exporting')
 meshes=model.extract_mesh(codes,True,resolution=256);mesh=meshes[0]
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
 data={'stage':'succeeded','inputSha256':digest(job['imagePath']),'sha256':digest(folder/'model.glb'),'bytes':(folder/'model.glb').stat().st_size,'bounds':scene.bounds.tolist(),'extents':scene.extents.tolist(),'vertices':sum(len(m.vertices) for m in parts),'faces':sum(len(m.faces) for m in parts),'colors':True,'upAxis':'Y','foregroundCoverage':coverage,'timings':times,'totalSeconds':time.time()-start,'peakCudaBytes':peak,'environment':{'python':platform.python_version(),'torch':torch.__version__,'cuda':torch.version.cuda,'gpu':torch.cuda.get_device_name(),'capability':torch.cuda.get_device_capability(),'marchingCubes':'scikit-image CPU compatibility adapter','source':json.loads((home/'source-version.json').read_text()),'weightsRevision':weights['revision']},'quality':'Generated geometry; visual review required; hidden surfaces inferred'}
 (folder/'result.json').write_text(json.dumps(data,indent=2))
except BaseException as e:
 import traceback;traceback.print_exc()
 (folder/'result.json').write_text(json.dumps({'stage':'cancelled' if isinstance(e,InterruptedError) else 'failed','error':str(e),'errorType':type(e).__name__,'elapsedSeconds':time.time()-start}))
 sys.exit(2)
