"""Pinned image-conditioned Hunyuan3D-2mini, with visible-only photo projection.

Produces reviewable candidates. File validity and silhouette fit are not fidelity acceptance.
No POI-specific logic, masks, prompts, dimensions, or geometry substitutes are used.
"""
from pathlib import Path
import gc, hashlib, json, os, sys, time, traceback

ROOT=Path(os.environ.get('AI4TJU_PROJECT_ROOT',Path(__file__).resolve().parents[1]))
HOME=ROOT/'.reconstruction-hunyuan'
sys.path.insert(0,str(HOME/'source'))
os.environ['HF_HUB_DISABLE_TELEMETRY']='1'
os.environ['HF_HUB_OFFLINE']='1'
os.environ['TRANSFORMERS_OFFLINE']='1'
os.environ['U2NET_HOME']=str(ROOT/'models/weights/rembg')
PREPROCESS_VERSION='hunyuan-image-v1-largest-alpha-component'

def digest(path):
    h=hashlib.sha256()
    with Path(path).open('rb') as f:
        for data in iter(lambda:f.read(8*1024*1024),b''):h.update(data)
    return h.hexdigest()

def main(jobfile):
    import cv2, numpy as np, torch, trimesh
    from PIL import Image, ImageOps
    from hy3dgen.shapegen import Hunyuan3DDiTFlowMatchingPipeline
    from hunyuan_mesh_review import project_visible_colors, render_review
    folder=jobfile.parent;job=json.loads(jobfile.read_text('utf-8'))
    started=time.monotonic();times={};params={};generator=job.get('provider','hunyuan3d-2mini')
    def phase(stage,**extra):
        if (folder/'cancel').exists():raise InterruptedError('cancelled')
        times[stage]=time.monotonic()-started
        (folder/'phase.json').write_text(json.dumps({'stage':stage,'elapsedSeconds':times[stage],**extra}),encoding='utf-8')
        print(stage,round(times[stage],2),extra,flush=True)
    try:
        if generator not in ('hunyuan3d-2mini','hunyuan3d-2'):raise ValueError('Unsupported Hunyuan shape provider')
        phase('preprocessing')
        original=ImageOps.exif_transpose(Image.open(job['imagePath'])).convert('RGBA')
        original.thumbnail((1536,1536))
        if min(original.size)<32:raise ValueError('Input is too small for credible reconstruction: minimum 32 pixels on each axis')
        alpha=np.asarray(original)[:,:,3]
        info={'profile':'supplied-alpha','version':PREPROCESS_VERSION,'warnings':[],'inputSize':list(original.size),'maskIsQualityScore':False}
        if alpha.min()==255:
            if not job.get('removeBackground',True):
                masked=original.copy();info['profile']='unmasked-source';info['warnings'].append('Background removal disabled; geometry can contain scenery.')
            else:
                import rembg
                masked=rembg.remove(original,session=rembg.new_session('u2net',providers=['CPUExecutionProvider'])).convert('RGBA')
                alpha=np.asarray(masked)[:,:,3]
                binary=(alpha>127).astype('uint8')
                count,labels,stats,centroids=cv2.connectedComponentsWithStats(binary,8)
                if count<=1:raise ValueError('Foreground segmentation found no object; source needs an explicit object mask')
                largest=1+int(np.argmax(stats[1:,cv2.CC_STAT_AREA]));core=(labels==largest).astype('uint8')
                coverage=float(core.mean())
                if coverage<.03:raise ValueError('Foreground segmentation rejected: less than 3% credible object; original background is not substituted')
                alpha=np.where(core>0,alpha,0).astype('uint8');masked.putalpha(Image.fromarray(alpha))
                info.update(profile='u2net-largest-component',foregroundCoverage=coverage,components=count-1)
                if coverage>.94:info['warnings'].append('Foreground covers nearly the full image; background separation is uncertain.')
        else:masked=original.copy()
        if masked.getchannel('A').getbbox() is None:raise ValueError('Input contains no visible object')
        masked.save(folder/'foreground.png')
        mask_array=np.asarray(masked)[:,:,3]
        info.setdefault('foregroundCoverage',float((mask_array>127).mean()))
        info['maskSha256']=digest(folder/'foreground.png')
        (folder/'preprocessing.json').write_text(json.dumps(info,indent=2),encoding='utf-8')
        phase('loading')
        if not torch.cuda.is_available():raise RuntimeError('CUDA is unavailable')
        torch.set_num_threads(4);torch.cuda.reset_peak_memory_stats()
        free,total=torch.cuda.mem_get_info()
        if free<3.5*1024**3:raise RuntimeError('Insufficient free CUDA memory for staged image reconstruction')
        weights=json.loads((HOME/('weights-full.json' if generator=='hunyuan3d-2' else 'weights.json')).read_text('utf-8'))
        source=json.loads((HOME/'source-version.json').read_text('utf-8'))
        modeldir=Path(weights['path'])/weights['subfolder']
        pipeline=Hunyuan3DDiTFlowMatchingPipeline.from_single_file(str(modeldir/'model.fp16.safetensors'),str(modeldir/'config.yaml'),device='cpu',dtype=torch.float16,use_safetensors=True)
        volume_decoder=job.get('volumeDecoder','hierarchical')
        if volume_decoder=='hierarchical':
            from hy3dgen.shapegen.models.autoencoders import HierarchicalVolumeDecoding
            pipeline.vae.volume_decoder=HierarchicalVolumeDecoding()
        elif volume_decoder!='vanilla':raise ValueError('Unsupported volume decoder')
        # Retain upstream mathematics; stage full modules to CUDA to bound VRAM.
        pipeline.device=torch.device('cuda')
        upstream_encode=pipeline.encode_cond
        def encode(*args,**kwargs):
            pipeline.conditioner.to('cuda')
            result=upstream_encode(*args,**kwargs)
            pipeline.conditioner.to('cpu');gc.collect();torch.cuda.empty_cache()
            pipeline.model.to('cuda');return result
        pipeline.encode_cond=encode
        upstream_export=pipeline._export
        def export(latents,*args,**kwargs):
            phase('exporting')
            pipeline.model.to('cpu');gc.collect();torch.cuda.empty_cache()
            pipeline.vae.to('cuda')
            return upstream_export(latents,*args,**kwargs)
        pipeline._export=export
        processed=pipeline.image_processor(masked,to_tensor=False)
        Image.fromarray(processed['image']).save(folder/'processed.png')
        Image.fromarray(processed['mask'].squeeze()).save(folder/'processed-mask.png')
        quality=job.get('quality','fast');steps=int(job.get('steps',30 if quality=='fast' else 50));resolution=int(job.get('resolution',256 if quality=='fast' else 384))
        params={'steps':steps,'octreeResolution':resolution,'guidanceScale':5.0,'seed':42,'numChunks':4096,'precision':'fp16','memoryPolicy':'conditioner/model/vae sequential CUDA','surfaceExtractor':'upstream marching cubes','texture':'source-photo orthographic visible-surface projection, unobserved surfaces gray'}
        params['volumeDecoder']=volume_decoder
        phase('reconstructing')
        def callback(i,t,outputs):phase('reconstructing',step=i+1,totalSteps=steps)
        with torch.inference_mode():
            mesh=pipeline(image=masked,num_inference_steps=steps,guidance_scale=5.0,generator=torch.Generator(device='cuda').manual_seed(42),octree_resolution=resolution,num_chunks=4096,callback=callback,callback_steps=5,enable_pbar=False)[0]
        peak=torch.cuda.max_memory_allocated()
        del pipeline;gc.collect();torch.cuda.empty_cache()
        if mesh is None or len(mesh.vertices)<4:raise ValueError('Shape model returned no geometry')
        mesh.fix_normals(multibody=True)
        # Official Hunyuan shapes use Y-up. Preserve axes and record fitted camera separately.
        mesh.export(folder/'shape.glb')
        phase('projecting')
        projection=project_visible_colors(mesh,masked,folder)
        mesh.export(folder/'model.glb')
        phase('validating')
        loaded=trimesh.load(folder/'model.glb',force='scene');parts=list(loaded.geometry.values())
        if not parts:raise ValueError('Empty exported scene')
        for p in parts:
            if len(p.faces)<4 or not np.isfinite(p.vertices).all() or np.min(p.extents)<1e-5:raise ValueError('Invalid exported geometry')
        render_review(mesh,folder/'review-views.png')
        result={'stage':'succeeded','generator':'hunyuan3d-2mini','version':'hunyuan-image-shape-v1','qualityProfile':quality,'sourceCommit':source['commit'],'weightsRevision':weights['revision'],'weightsSha256':weights['weightSha256'],'preprocessVersion':PREPROCESS_VERSION,'parameters':params,'inputSha256':digest(job['imagePath']),'sha256':digest(folder/'model.glb'),'bytes':(folder/'model.glb').stat().st_size,'bounds':loaded.bounds.tolist(),'extents':loaded.extents.tolist(),'vertices':sum(len(p.vertices) for p in parts),'faces':sum(len(p.faces) for p in parts),'colors':True,'upAxis':'Y','foregroundCoverage':info['foregroundCoverage'],'preprocessing':info,'projection':projection,'timings':times,'totalSeconds':time.monotonic()-started,'peakCudaBytes':peak,'environment':{'torch':torch.__version__,'cuda':torch.version.cuda,'gpu':torch.cuda.get_device_name()},'quality':'Image-conditioned candidate; single-view hidden geometry is inferred. Visible colors are projected from source; gray surfaces have no source observation. Silhouette agreement is not proof of architectural accuracy.','qualityAssessment':{'status':'unreviewed','accepted':False,'requires':['compare source and at least six render views','inspect roof/major volumes/openings','independent view evidence for hidden geometry']}}
        result['generator']=generator
        hull_volume=float(mesh.convex_hull.volume)
        result['geometryAudit']={'watertight':bool(mesh.is_watertight),'connectedComponents':len(mesh.split(only_watertight=False)),'convexHullVolume':hull_volume,'orientedVolume':float(mesh.volume),'volumeToConvexHullRatio':abs(float(mesh.volume))/hull_volume if hull_volume>0 else None,'note':'Thin/open geometry may be legitimate for some objects; these diagnostics require image context and are not acceptance scores.'}
        (folder/'result.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
        phase('succeeded')
    except BaseException as exc:
        traceback.print_exc()
        result={'stage':'cancelled' if isinstance(exc,InterruptedError) else 'failed','generator':'hunyuan3d-2mini','error':str(exc),'errorType':type(exc).__name__,'parameters':params,'timings':times,'totalSeconds':time.monotonic()-started}
        result['generator']=generator
        (folder/'result.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
        raise

if __name__=='__main__':main(Path(sys.argv[1]))
