"""DA3 jointly estimated cameras/depth -> observed, confidence-filtered surface mesh.
No POI-specific geometry, fabricated back surfaces, or absolute scale assumptions.
"""
from pathlib import Path
import hashlib,json,os,sys,time,traceback
ROOT=Path(__file__).resolve().parents[1];HOME=ROOT/'.reconstruction-da3'
os.environ['HF_HUB_OFFLINE']='1';os.environ['TRANSFORMERS_OFFLINE']='1'
VERSION='da3-observed-tsdf-v2'
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def feature_geometry(images,depth,ext,ks):
    import numpy as np,cv2
    records=[];sift=cv2.SIFT_create(nfeatures=2500)
    features=[sift.detectAndCompute(cv2.cvtColor(im,cv2.COLOR_RGB2GRAY),None) for im in images]
    for i in range(len(images)):
        for j in range(i+1,len(images)):
            ka,da=features[i];kb,db=features[j];record={'a':i,'b':j,'matches':0,'fundamentalInliers':0}
            if da is None or db is None:records.append(record);continue
            pairs=cv2.BFMatcher().knnMatch(da,db,k=2);good=[a for a,b in pairs if a.distance<.75*b.distance]
            record['matches']=len(good)
            if len(good)<12:records.append(record);continue
            a=np.float32([ka[m.queryIdx].pt for m in good]);b=np.float32([kb[m.trainIdx].pt for m in good])
            f,mask=cv2.findFundamentalMat(a,b,cv2.FM_RANSAC,2.,.999)
            if mask is None:records.append(record);continue
            a=a[mask.ravel()>0];b=b[mask.ravel()>0];record['fundamentalInliers']=len(a)
            if not len(a):records.append(record);continue
            d=cv2.remap(depth[i],a[:,0].reshape(-1,1),a[:,1].reshape(-1,1),cv2.INTER_LINEAR).ravel()
            cam=(np.c_[a,np.ones(len(a))]@np.linalg.inv(ks[i]).T)*d[:,None]
            world=(cam-ext[i,:3,3])@ext[i,:3,:3]
            other=world@ext[j,:3,:3].T+ext[j,:3,3];p=other@ks[j].T
            xy=p[:,:2]/np.maximum(p[:,2:],1e-8);error=np.linalg.norm(xy-b,axis=1)
            record.update(medianPredictedReprojectionErrorPx=float(np.median(error)),p90PredictedReprojectionErrorPx=float(np.percentile(error,90)),within12pxFraction=float((error<12).mean()))
            records.append(record)
    return records
def fuse(images,depth,conf,ext,ks,masks,folder):
    import numpy as np,cv2,trimesh
    n,h,w=depth.shape;stride=max(1,int(np.ceil(max(h,w)/320)));vertices=[];colors=[];faces=[];records=[];pair_records=[];offset=0
    # Same robust threshold rule as official utils/export/glb.py. A percentile
    # alone can equal 1.0 and incorrectly retain the least certain sky pixels.
    thresholds=[float(min(max(1.05,np.percentile(c[np.isfinite(c)],40)),np.percentile(c[np.isfinite(c)],90))) for c in conf]
    for i in range(n):
        yy,xx=np.mgrid[0:h:stride,0:w:stride];d=depth[i,::stride,::stride];c=conf[i,::stride,::stride]
        valid=np.isfinite(d)&(d>0)&np.isfinite(c)&(c>=thresholds[i])&(masks[i,::stride,::stride]>.5)
        if not valid.any():raise ValueError(f'No confident depth pixels in view {i}')
        far=float(np.percentile(d[valid],98));valid &= d<=far
        rays=np.stack([xx,yy,np.ones_like(xx)],-1).reshape(-1,3)@np.linalg.inv(ks[i]).T
        cam=rays*d.reshape(-1,1);world=(cam-ext[i,:3,3])@ext[i,:3,:3]
        supported=np.zeros(len(world),bool);conflicts=np.zeros(len(world),bool);compared=np.zeros(len(world),bool)
        for j in range(n):
            if j==i:continue
            other=world@ext[j,:3,:3].T+ext[j,:3,3];p=other@ks[j].T;uv=(p[:,:2]/np.maximum(p[:,2:],1e-8)).astype('float32')
            inside=(p[:,2]>0)&(uv[:,0]>=0)&(uv[:,0]<w-1)&(uv[:,1]>=0)&(uv[:,1]<h-1)
            observed=cv2.remap(depth[j],uv[:,0].reshape(d.shape),uv[:,1].reshape(d.shape),cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT).ravel()
            certainty=cv2.remap(conf[j],uv[:,0].reshape(d.shape),uv[:,1].reshape(d.shape),cv2.INTER_LINEAR,borderMode=cv2.BORDER_CONSTANT).ravel()
            usable=inside&(certainty>=thresholds[j])&(observed>0);error=np.abs(p[:,2]-observed)/np.maximum(observed,1e-8)
            count=int((usable&valid.ravel()).sum());support_count=int((usable&valid.ravel()&(error<.08)).sum())
            center_i=-ext[i,:3,:3].T@ext[i,:3,3];center_j=-ext[j,:3,:3].T@ext[j,:3,3]
            baseline=float(np.linalg.norm(center_i-center_j)/np.median(d[valid]))
            pair_records.append({'a':i,'b':j,'comparedPixels':count,'supportedPixels':support_count,'supportFraction':support_count/max(count,1),'baselineToMedianDepth':baseline})
            compared |= usable;supported |= usable&(error<.08)
            # A farther point may simply be occluded in this other view. Retain it.
            conflicts |= usable&(p[:,2]<observed*.85)
        base=valid.ravel();retain=base&(~conflicts|supported);records.append({'view':i,'confidentPixels':int(base.sum()),'retainedPixels':int(retain.sum()),'comparedPixels':int((base&compared).sum()),'supportedPixels':int((base&supported).sum()),'conflictingPixels':int((base&conflicts&~supported).sum()),'confidenceThreshold':thresholds[i],'relativeFarClip98Percentile':far})
        rows,cols=d.shape;a=np.arange((rows-1)*cols).reshape(rows-1,cols)[:,:-1];b=a+1;cc=a+cols;e=cc+1
        f=np.concatenate([np.stack([a,cc,b],-1).reshape(-1,3),np.stack([b,cc,e],-1).reshape(-1,3)])
        fd=d.ravel()[f];use=retain[f].all(1)&((fd.max(1)-fd.min(1))<.08*np.maximum(fd.mean(1),1e-8))
        vertices.append(world);colors.append(images[i,::stride,::stride].reshape(-1,3));faces.append(f[use]+offset);offset+=len(world)
        cv2.imwrite(str(folder/f'view-{i:02d}-retained.png'),(retain.reshape(d.shape)*255).astype('uint8'))
    vertices=np.concatenate(vertices);colors=np.concatenate(colors);faces=np.concatenate(faces)
    used=np.unique(faces);remap=np.full(len(vertices),-1,int);remap[used]=np.arange(len(used));vertices=vertices[used];colors=colors[used];faces=remap[faces]
    if len(faces)<20:raise ValueError('Too few mutually consistent surface triangles')
    # Merge only subpixel-near samples in a common world frame; no hole filling.
    voxel=float(np.median(depth[np.isfinite(depth)&(depth>0)]))/600
    keys=np.floor(vertices/max(voxel,1e-7)).astype('int64');_,inverse=np.unique(keys,axis=0,return_inverse=True);counts=np.bincount(inverse)
    nv=np.column_stack([np.bincount(inverse,weights=vertices[:,i])/counts for i in range(3)]);nc=np.column_stack([np.bincount(inverse,weights=colors[:,i])/counts for i in range(3)])
    merged=len(vertices)-len(nv);faces=inverse[faces];faces=faces[(faces[:,0]!=faces[:,1])&(faces[:,0]!=faces[:,2])&(faces[:,1]!=faces[:,2])];_,keep=np.unique(np.sort(faces,axis=1),axis=0,return_index=True);faces=faces[keep]
    # OpenCV world, aligned to first source camera -> right-handed glTF Y-up camera frame.
    nv=(nv@ext[0,:3,:3].T+ext[0,:3,3])*np.array([1,-1,-1])
    mesh=trimesh.Trimesh(vertices=nv,faces=faces,vertex_colors=nc.clip(0,255).astype('uint8'),process=False);mesh.remove_unreferenced_vertices();mesh.fix_normals()
    return mesh,{'views':records,'pairs':pair_records,'pixelStride':stride,'relativeVoxelSize':voxel,'mergedVertexSamples':merged,'depthAgreementRelativeTolerance':.08,'freeSpaceConflictTolerance':.15,'hiddenGeometry':'none','holeFilling':False}
def main(jobfile):
    import numpy as np,torch,cv2
    from PIL import Image,ImageOps
    from depth_anything_3.api import DepthAnything3
    from hunyuan_mesh_review import render_review
    folder=jobfile.parent;job=json.loads(jobfile.read_text('utf-8'));started=time.monotonic();times={};generator='depth-anything-3'
    def phase(name):
        if (folder/'cancel').exists():raise InterruptedError('cancelled')
        times[name]=time.monotonic()-started;(folder/'phase.json').write_text(json.dumps({'stage':name,'elapsedSeconds':times[name]}),'utf-8');print(name,round(times[name],3),flush=True)
    try:
        phase('preprocessing');paths=job.get('imagePaths') or [job['imagePath']]
        if not 2<=len(paths)<=4:raise ValueError('DA3 local multi-view provider currently supports 2 to 4 images')
        hashes=list(map(sha,paths))
        if len(set(hashes))!=len(paths):raise ValueError('Duplicate images cannot establish multi-view geometry')
        rgb=[];alphas=[]
        for i,path in enumerate(paths):
            im=ImageOps.exif_transpose(Image.open(path)).convert('RGBA');im.thumbnail((1600,1600));arr=np.asarray(im)
            if min(im.size)<64:raise ValueError('Source image too small')
            alpha=arr[:,:,3];background=Image.new('RGBA',im.size,(128,128,128,255));background.alpha_composite(im);rgb.append(background.convert('RGB'));alphas.append(Image.fromarray(np.repeat(alpha[:,:,None],3,axis=2)))
            im.save(folder/f'input-{i:02d}.png')
        phase('loading');meta=json.loads((HOME/'weights.json').read_text('utf-8'));source=json.loads((HOME/'source-version.json').read_text('utf-8'))
        device='cuda' if torch.cuda.is_available() else 'cpu';torch.set_num_threads(4)
        if device=='cuda':torch.cuda.reset_peak_memory_stats()
        model=DepthAnything3.from_pretrained(str(HOME/'weights')).to(device).eval()
        resolution=504 if job.get('quality')=='standard' else 392
        phase('estimating_cameras_and_depth');prediction=model.inference(rgb,process_res=resolution,process_res_method='upper_bound_resize',use_ray_pose=False,ref_view_strategy='saddle_balanced')
        # Run alpha through the same official resize/crop pipeline as the RGB images.
        ma,_,_=model.input_processor(alphas,process_res=resolution,process_res_method='upper_bound_resize')
        masks=(ma[:,0].numpy()*.229+.485).clip(0,1)
        if prediction.sky is not None:
            masks*=~prediction.sky
        peak=torch.cuda.max_memory_allocated() if device=='cuda' else None
        del model;torch.cuda.empty_cache() if device=='cuda' else None
        images=prediction.processed_images;depth=prediction.depth;conf=prediction.conf;ext=prediction.extrinsics;ks=prediction.intrinsics
        if any(v is None for v in [depth,conf,ext,ks]):raise ValueError('DA3 did not return complete camera and depth predictions')
        if not all(np.isfinite(v).all() for v in [depth,ext,ks]):raise ValueError('Non-finite joint geometry')
        np.savez_compressed(folder/'geometry-evidence.npz',depth=depth,confidence=conf,worldToCamera=ext,intrinsics=ks,masks=masks)
        cameras={'convention':'OpenCV world-to-camera','intrinsics':ks.tolist(),'worldToCamera':ext.tolist(),'coordinateScale':'relative','gravityAligned':False,'cameraSource':'jointly predicted by DA3-SMALL, not measured','imageIds':job.get('imageIds',[]),'inputSha256s':hashes}
        render_cameras=[];flip=np.array([1,-1,-1])
        for i,pose in enumerate(ext):
            center=-pose[:3,:3].T@pose[:3,3];forward=pose[:3,:3].T@np.array([0,0,1]);up=pose[:3,:3].T@np.array([0,-1,0])
            render_cameras.append({'viewIndex':i,'position':((center@ext[0,:3,:3].T+ext[0,:3,3])*flip).tolist(),'target':(((center+forward)@ext[0,:3,:3].T+ext[0,:3,3])*flip).tolist(),'up':((up@ext[0,:3,:3].T)*flip).tolist(),'intrinsics':ks[i].tolist(),'imageSize':[images.shape[2],images.shape[1]]})
        cameras['gltfCameras']=render_cameras
        (folder/'cameras.json').write_text(json.dumps(cameras,indent=2),'utf-8')
        for i in range(len(paths)):
            Image.fromarray(images[i]).save(folder/f'processed-{i:02d}.png');p2,p98=np.percentile(depth[i],[2,98]);color=cv2.applyColorMap((np.clip((depth[i]-p2)/max(p98-p2,1e-6),0,1)*255).astype('uint8'),cv2.COLORMAP_TURBO);cv2.imwrite(str(folder/f'depth-{i:02d}.png'),color)
        phase('checking_geometry');pair_evidence=feature_geometry(images,depth,ext,ks);(folder/'pair-geometry.json').write_text(json.dumps(pair_evidence,indent=2),'utf-8')
        phase('fusing_observed_surfaces');mesh,fusion=fuse(images,depth,conf,ext,ks,masks,folder)
        from reconstruction_tsdf import fuse_tsdf
        mesh,tsdf_evidence=fuse_tsdf(images,depth,conf,ks,ext,masks,resolution=256)
        if tsdf_evidence.get('fusedVoxelsObservedBy2OrMore',0)<64:raise ValueError('Insufficient common observed TSDF voxels; no credible multi-view fusion')
        mesh.vertices=(mesh.vertices@ext[0,:3,:3].T+ext[0,:3,3])*np.array([1,-1,-1])
        fusion['method']='projective confidence-weighted TSDF, shared zero-level surface'
        fusion['tsdf']=tsdf_evidence
        mesh.export(folder/'model.glb');(folder/'fusion.json').write_text(json.dumps(fusion,indent=2),'utf-8')
        phase('validating');render_review(mesh,folder/'review-views.png')
        supported=sum(v['supportedPixels'] for v in fusion['views']);compared=sum(v['comparedPixels'] for v in fusion['views']);ratio=supported/max(compared,1)
        reliable_pairs=[]
        for p in fusion['pairs']:
            matching=next((q for q in pair_evidence if {q['a'],q['b']}=={p['a'],p['b']}),{})
            independently_contradicted=matching.get('fundamentalInliers',0)>=20 and matching.get('medianPredictedReprojectionErrorPx',1e9)>=20
            if p['comparedPixels']>=100 and p['supportFraction']>.3 and p['baselineToMedianDepth']>.01 and not independently_contradicted:reliable_pairs.append(p)
        reached={0}
        for _ in paths:
            for p in reliable_pairs:
                if p['a'] in reached or p['b'] in reached:reached.update([p['a'],p['b']])
        # Depth and poses come from the same network; self-consistency alone can
        # hide an incorrectly shifted repetitive facade. Require independent
        # feature reprojection support before automatic geometric acceptance.
        independent_reached={0}
        for _ in paths:
            for p in pair_evidence:
                if p['fundamentalInliers']>=20 and p.get('medianPredictedReprojectionErrorPx',1e9)<20 and (p['a'] in independent_reached or p['b'] in independent_reached):independent_reached.update([p['a'],p['b']])
        geometry_consistent=len(reached)==len(paths) and ratio>.25 and len(independent_reached)==len(paths)
        warnings=['Only observed surfaces are reconstructed; unseen faces remain open.','Scale is relative; north direction, gravity and map placement are not measured.']
        if not geometry_consistent:warnings.append('Cross-view geometry evidence is insufficient; this artifact requires review and must not be treated as a verified reconstruction.')
        if not any(p['fundamentalInliers']>=20 for p in pair_evidence):warnings.append('Sparse feature matches did not independently verify the predicted camera geometry.')
        result={'stage':'succeeded','generator':generator,'version':VERSION,'model':'DA3-SMALL','inputMode':'multi_view','reconstructionScope':'observed_surfaces','reconstructionMode':'multiview_observed_surface','imageIds':job.get('imageIds',[]),'viewCount':len(paths),'inputSha256s':hashes,'sha256':sha(folder/'model.glb'),'bytes':(folder/'model.glb').stat().st_size,'bounds':mesh.bounds.tolist(),'extents':mesh.extents.tolist(),'vertices':len(mesh.vertices),'faces':len(mesh.faces),'colors':True,'upAxis':'Y','sourceCommit':source['commit'],'weightsRevision':meta['revision'],'weightsSha256':meta['weightSha256'],'preprocessVersion':'da3-official-aspect-resize-alpha-v1','parameters':{'processResolution':resolution,'poseMethod':'official camera decoder','attention':'torch SDPA','confidencePercentile':25,'fusion':fusion,'metricScaleKnown':False,'gravityAligned':False},'feedback':{'registeredViews':len(paths),'geometricallySupportedViews':len(reached),'totalViews':len(paths),'coverage':'observed_surfaces','coordinateScale':'relative','warnings':warnings,'crossViewDepthAgreement':ratio,'geometricallyConsistent':geometry_consistent},'timings':times,'totalSeconds':time.monotonic()-started,'peakCudaBytes':peak,'quality':'Joint neural multi-view observed surface reconstruction; camera poses and depth are predicted, absolute scale and hidden surfaces unknown.','qualityAssessment':{'status':'review_required' if geometry_consistent else 'geometry_evidence_insufficient','accepted':False,'scope':'observed_surfaces','geometryConsistent':geometry_consistent},'geometryEvidence':{'pairChecks':pair_evidence,'crossViewDepthAgreement':ratio},'preprocessing':{'removeBackground':False,'alphaPreserved':True,'manualCrop':False,'warnings':['Foreground removal disabled for multi-view scene correspondence.'] if job.get('removeBackground') else []}}
        result['feedback']['registeredViews']=len(reached) if len(reached)>=2 else 0
        result['geometryConsistent']=geometry_consistent
        result['parameters']['confidencePercentile']=40
        result['parameters']['confidenceRule']='min(max(1.05, percentile40), percentile90), official DA3 GLB rule'
        result['feedback']['geometryConsistent']=geometry_consistent
        result['feedback']['predictedCameraCount']=len(paths)
        result['feedback']['fusedVoxelsObservedBy2OrMore']=tsdf_evidence['fusedVoxelsObservedBy2OrMore']
        result['feedback']['independentlyVerifiedViews']=len(independent_reached) if len(independent_reached)>=2 else 0
        result['registrationEvidence']={'method':'predicted depth reprojection with optional independent SIFT consistency','supportedViewIndices':sorted(reached) if len(reached)>=2 else [],'reliableDirectedPairs':reliable_pairs,'cameraPredictionAloneIsRegistration':False}
        (folder/'result.json').write_text(json.dumps(result,indent=2),'utf-8');phase('succeeded')
    except BaseException as exc:
        traceback.print_exc();(folder/'result.json').write_text(json.dumps({'stage':'cancelled' if isinstance(exc,InterruptedError) else 'failed','generator':generator,'error':str(exc),'errorType':type(exc).__name__,'timings':times},indent=2),'utf-8');raise
if __name__=='__main__':main(Path(sys.argv[1]))
