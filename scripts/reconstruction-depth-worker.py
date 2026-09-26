"""Image-depth backprojection of observed pixels only. Never closes unseen geometry."""
from pathlib import Path
import hashlib,json,os,sys,time,traceback
ROOT=Path(__file__).resolve().parents[1];HOME=ROOT/'.reconstruction-depth'
os.environ['HF_HUB_OFFLINE']='1';os.environ['TRANSFORMERS_OFFLINE']='1';os.environ['U2NET_HOME']=str(ROOT/'models/weights/rembg')
def main(jobfile):
    import torch,numpy as np,trimesh,cv2
    from PIL import Image,ImageOps
    from transformers import AutoImageProcessor,AutoModelForDepthEstimation
    from hunyuan_mesh_review import render_review
    folder=jobfile.parent;job=json.loads(jobfile.read_text('utf-8'));started=time.monotonic();times={}
    def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
    def phase(name):
        if (folder/'cancel').exists():raise InterruptedError('cancelled')
        times[name]=time.monotonic()-started;(folder/'phase.json').write_text(json.dumps({'stage':name,'elapsedSeconds':times[name]}),encoding='utf-8');print(name,round(times[name],3),flush=True)
    try:
        phase('preprocessing');original=ImageOps.exif_transpose(Image.open(job['imagePath'])).convert('RGBA');original.thumbnail((1024,1024))
        rgb=original.convert('RGB');w,h=rgb.size
        if min(w,h)<32:raise ValueError('Image too small for depth reconstruction')
        mask=np.asarray(original)[:,:,3]>127;mode=job.get('surfaceMode','foreground')
        if mode=='foreground' and mask.all():
            import rembg
            removed=rembg.remove(original,session=rembg.new_session('u2net',providers=['CPUExecutionProvider']));mask=np.asarray(removed)[:,:,3]>127
            if mask.mean()<.03:raise ValueError('Foreground mask unreliable; choose explicit scene visible-surface mode or provide an alpha mask')
        Image.fromarray((mask*255).astype('uint8')).save(folder/'observed-mask.png')
        phase('loading');meta=json.loads((HOME/'weights.json').read_text('utf-8'));device='cuda' if torch.cuda.is_available() else 'cpu';torch.set_num_threads(4)
        if device=='cuda':torch.cuda.reset_peak_memory_stats()
        processor=AutoImageProcessor.from_pretrained(meta['path'],local_files_only=True)
        model=AutoModelForDepthEstimation.from_pretrained(meta['path'],local_files_only=True).to(device).eval()
        phase('estimating_depth');inputs=processor(images=rgb,return_tensors='pt').to(device)
        with torch.inference_mode():prediction=model(**inputs).predicted_depth
        prediction=torch.nn.functional.interpolate(prediction.unsqueeze(1),size=(h,w),mode='bicubic',align_corners=False)[0,0].cpu().numpy()
        np.save(folder/'predicted-inverse-depth.npy',prediction)
        peak=torch.cuda.max_memory_allocated() if device=='cuda' else None
        del model,inputs;torch.cuda.empty_cache() if device=='cuda' else None
        valid=mask&np.isfinite(prediction);p2,p98=np.percentile(prediction[valid],[2,98]);normalized=np.clip((prediction-p2)/max(p98-p2,1e-6),0,1)
        Image.fromarray(cv2.applyColorMap((normalized*255).astype('uint8'),cv2.COLORMAP_TURBO)[:,:,::-1]).save(folder/'relative-depth.png')
        phase('exporting')
        # Relative inverse-depth is scale-and-shift ambiguous; explicitly record this gauge.
        inverse_median=max(float(np.median(prediction[valid])),1e-6);relative_inverse=np.maximum(prediction/inverse_median,.05);depth=1/relative_inverse
        far_limit=float(np.percentile(depth[valid],98));valid &= depth<=far_limit
        stride=max(1,int(np.ceil(max(w,h)/320)));yy,xx=np.mgrid[0:h:stride,0:w:stride];d=depth[::stride,::stride];visible=valid[::stride,::stride]
        calibration=job.get('cameraIntrinsics');fx=float(calibration['fx']) if calibration else w/(2*np.tan(np.radians(30)));fy=float(calibration.get('fy',fx)) if calibration else fx;cx=float(calibration.get('cx',w/2)) if calibration else w/2;cy=float(calibration.get('cy',h/2)) if calibration else h/2
        vertices=np.stack([(xx-cx)*d/fx,-(yy-cy)*d/fy,-d],axis=-1).reshape(-1,3);colors=np.asarray(rgb)[::stride,::stride].reshape(-1,3)
        rows,cols=d.shape;a=np.arange((rows-1)*cols).reshape(rows-1,cols)[:,:-1];b=a+1;c=a+cols;e=c+1
        faces=np.concatenate([np.stack([a,c,b],-1).reshape(-1,3),np.stack([b,c,e],-1).reshape(-1,3)])
        use=visible.ravel()[faces].all(1);face_depth=d.ravel()[faces];use &= (face_depth.max(1)-face_depth.min(1))<.15*face_depth.mean(1)
        mesh=trimesh.Trimesh(vertices=vertices,faces=faces[use],vertex_colors=colors,process=False);mesh.remove_unreferenced_vertices();mesh.fix_normals()
        if len(mesh.faces)<10:raise ValueError('Too few continuous observed depth faces')
        mesh.export(folder/'model.glb');phase('validating');render_review(mesh,folder/'review-views.png')
        result={'stage':'succeeded','generator':'depth-anything-v2-small','version':'observed-depth-surface-v1','reconstructionMode':'partial_surface','inputSha256':sha(job['imagePath']),'sha256':sha(folder/'model.glb'),'bytes':(folder/'model.glb').stat().st_size,'bounds':mesh.bounds.tolist(),'extents':mesh.extents.tolist(),'vertices':len(mesh.vertices),'faces':len(mesh.faces),'colors':True,'upAxis':'Y','weightsRevision':meta['revision'],'weightsSha256':meta['weightSha256'],'sourceCommit':'transformers-4.46.3','parameters':{'mode':mode,'pixelStride':stride,'inverseDepthGauge':'prediction / visible-pixel median, then reciprocal','inverseDepthMedian':inverse_median,'relativeFarClip98Percentile':far_limit,'depthDiscontinuityCutoff':.15,'intrinsics':{'fx':fx,'fy':fy,'cx':cx,'cy':cy,'source':'supplied' if calibration else 'assumed horizontal field of view 60 degrees'},'metricScaleKnown':False,'hiddenGeometry':'none; no closure or convex hull'},'preprocessing':{'foregroundCoverage':float(mask.mean()),'warnings':[]},'timings':times,'totalSeconds':time.monotonic()-started,'peakCudaBytes':peak,'quality':'Learned relative-depth reconstruction of visible source pixels only. Absolute distance, camera calibration and hidden geometry are unknown. Suitable for observed-facade reference; not a complete building volume.','qualityAssessment':{'status':'unreviewed','accepted':False,'scope':'observed_surface_only'}}
        (folder/'result.json').write_text(json.dumps(result,indent=2),encoding='utf-8');phase('succeeded')
    except BaseException as exc:
        traceback.print_exc();(folder/'result.json').write_text(json.dumps({'stage':'cancelled' if isinstance(exc,InterruptedError) else 'failed','generator':'depth-anything-v2-small','error':str(exc),'errorType':type(exc).__name__,'timings':times}),encoding='utf-8');raise
if __name__=='__main__':main(Path(sys.argv[1]))
