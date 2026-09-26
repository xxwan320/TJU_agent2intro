"""CPU projective TSDF fusion of observed DA3 depths; no hole filling or hidden faces.

Function output uses the input OpenCV world frame. The CLI exports first-camera
glTF Y-up, matching reconstruction-multiview-worker.py.
"""
from pathlib import Path
import hashlib,json,time
import numpy as np


def fuse_tsdf(processed_images,depth,confidence,intrinsics,world_to_camera,masks,resolution=160):
    from scipy.ndimage import map_coordinates
    from skimage.measure import marching_cubes
    import trimesh
    started=time.monotonic()
    images=np.asarray(processed_images);depth=np.asarray(depth,dtype=np.float32)
    conf=np.asarray(confidence,dtype=np.float32);ks=np.asarray(intrinsics,dtype=np.float32)
    ext=np.asarray(world_to_camera,dtype=np.float32);masks=np.asarray(masks)
    if depth.ndim!=3 or len(depth)<2 or images.shape!=(*depth.shape,3) or conf.shape!=depth.shape or masks.shape!=depth.shape:raise ValueError('Expected matching N,H,W depth/confidence/masks and N,H,W,3 RGB, N>=2')
    n,h,w=depth.shape
    if ks.shape!=(n,3,3) or ext.shape not in ((n,3,4),(n,4,4)):raise ValueError('Invalid camera dimensions')
    if not np.isfinite(ks).all() or not np.isfinite(ext).all():raise ValueError('Camera matrices must be finite')
    if not 48<=resolution<=256:raise ValueError('Resolution must be between 48 and 256')
    valid=[];thresholds=[];surface_points=[];far_clips=[]
    yy,xx=np.mgrid[:h,:w];pixel=np.stack([xx,yy,np.ones_like(xx)],-1).reshape(-1,3)
    for i in range(n):
        finite=conf[i][np.isfinite(conf[i])]
        if not len(finite):raise ValueError('No finite confidence')
        threshold=max(1.00001,float(min(max(1.05,np.percentile(finite,40)),np.percentile(finite,90))))
        use=np.isfinite(depth[i])&(depth[i]>0)&np.isfinite(conf[i])&(conf[i]>=threshold)&(masks[i]>.5)
        if use.sum()<64:raise ValueError('Too few confident observed depth pixels')
        far=float(np.percentile(depth[i][use],98));use&=depth[i]<=far
        points=(pixel[use.ravel()]@np.linalg.inv(ks[i]).T)*depth[i][use,None]
        points=(points-ext[i,:3,3])@ext[i,:3,:3]
        surface_points.append(points[::max(1,len(points)//50000)])
        valid.append(use);thresholds.append(threshold);far_clips.append(far)
    all_points=np.concatenate(surface_points)
    lo,hi=np.percentile(all_points,[.25,99.75],axis=0)
    longest=float((hi-lo).max())
    if not np.isfinite(longest) or longest<=0:raise ValueError('Invalid observed bounds')
    voxel=longest/(resolution-9);trunc=4*voxel;lo-=trunc;hi+=trunc
    shape=np.ceil((hi-lo)/voxel).astype(int)+1;total=int(np.prod(shape))
    sums=np.zeros(total,np.float32);weights=np.zeros(total,np.float32)
    near_count=np.zeros(total,np.uint8);color_sum=np.zeros((total,3),np.float32);color_weight=np.zeros(total,np.float32)
    per_view=[{'view':i,'confidentPixels':int(valid[i].sum()),'confidenceThreshold':thresholds[i],'farClip98Percentile':far_clips[i],'integratedVoxels':0,'nearSurfaceVoxels':0} for i in range(n)]
    for start in range(0,total,200000):
        end=min(start+200000,total);indices=np.arange(start,end)
        grid=np.column_stack(np.unravel_index(indices,tuple(shape))).astype(np.float32)
        world=grid*voxel+lo
        for i in range(n):
            camera=world@ext[i,:3,:3].T+ext[i,:3,3];projected=camera@ks[i].T
            z=camera[:,2];uv=projected[:,:2]/np.maximum(projected[:,2:],1e-8)
            inside=(z>0)&np.isfinite(uv).all(1)&(uv[:,0]>=0)&(uv[:,0]<w-1)&(uv[:,1]>=0)&(uv[:,1]<h-1)
            local=np.flatnonzero(inside)
            if not len(local):continue
            xy=uv[local].T[[1,0]]
            # All bilinear contributors must be valid, avoiding interpolation
            # across sky, alpha holes and low-confidence pixels.
            sampled_valid=map_coordinates(valid[i].astype(np.float32),xy,order=1,mode='constant',cval=0)
            keep=sampled_valid>=.999;local=local[keep];xy=xy[:,keep]
            sampled_depth=map_coordinates(depth[i],xy,order=1,mode='constant',cval=0)
            sampled_conf=map_coordinates(conf[i],xy,order=1,mode='constant',cval=0)
            sdf=sampled_depth-z[local]
            # Standard projective TSDF: free space votes positive, no evidence
            # is integrated farther than truncation behind an observed surface.
            keep=sdf>=-trunc;local=local[keep];xy=xy[:,keep];sampled_conf=sampled_conf[keep];sdf=sdf[keep]
            target=start+local
            if not len(target):continue
            confidence_weight=np.clip(sampled_conf/max(thresholds[i],1e-6),.1,4).astype(np.float32)
            weights[target]+=confidence_weight;sums[target]+=np.clip(sdf/trunc,-1,1)*confidence_weight
            close=np.abs(sdf)<=trunc;selected=target[close];cw=confidence_weight[close]
            source_color=np.column_stack([map_coordinates(images[i,:,:,channel].astype(np.float32),xy[:,close],order=1,mode='constant',cval=0) for channel in range(3)])
            near_count[selected]+=1;color_sum[selected]+=source_color*cw[:,None];color_weight[selected]+=cw
            per_view[i]['integratedVoxels']+=len(target);per_view[i]['nearSurfaceVoxels']+=len(selected)
    observed=weights>0;field=np.ones(total,np.float32);field[observed]=sums[observed]/weights[observed]
    supported=observed.reshape(tuple(shape))
    # A valid MC cell needs eight observed corners, not 27 neighbours in the
    # narrow band. Positive free-space observations are also genuine evidence.
    valid_cells=np.ones(tuple(shape-1),bool)
    for dx in (0,1):
        for dy in (0,1):
            for dz in (0,1):valid_cells&=supported[dx:shape[0]-1+dx,dy:shape[1]-1+dy,dz:shape[2]-1+dz]
    extract_mask=supported
    if not extract_mask.any() or field.min()>=0:raise ValueError('No observed zero crossing after fusion')
    vertices,faces,_,_=marching_cubes(field.reshape(tuple(shape)),level=0,spacing=(voxel,voxel,voxel),mask=extract_mask,allow_degenerate=False)
    # Enforce the complete-cell rule explicitly, independent of the library's
    # mask indexing. Unknown boundaries never gain triangles or caps.
    cell=np.floor(vertices[faces].mean(axis=1)/voxel).astype(int)
    cell=np.clip(cell,0,shape-2)
    faces=faces[valid_cells[cell[:,0],cell[:,1],cell[:,2]]]
    world_vertices=vertices+lo
    coordinates=(vertices/voxel).T
    colors=np.zeros((len(vertices),3),np.float32)
    denom=np.maximum(map_coordinates(color_weight.reshape(tuple(shape)),coordinates,order=1,mode='nearest'),1e-8)
    for channel in range(3):colors[:,channel]=map_coordinates(color_sum[:,channel].reshape(tuple(shape)),coordinates,order=1,mode='nearest')/denom
    mesh=trimesh.Trimesh(vertices=world_vertices,faces=faces,vertex_colors=colors.clip(0,255).astype(np.uint8),process=False)
    mesh.remove_unreferenced_vertices();mesh.fix_normals()
    if len(mesh.faces)<20:raise ValueError('Too few observed TSDF triangles')
    evidence={'method':'confidence-weighted projective TSDF with masked marching cubes','version':'cpu-tsdf-observed-v1','coordinateFrame':'OpenCV world','resolutionRequested':resolution,'gridShape':shape.tolist(),'voxelSizeRelative':voxel,'truncationRelative':trunc,'boundsPercentiles':[.25,99.75],'observedVoxels':int(observed.sum()),'nearSurfaceVoxels':int((near_count>0).sum()),'fusedVoxelsObservedBy2OrMore':int((near_count>=2).sum()),'fusedVoxelsObservedBy2+':int((near_count>=2).sum()),'multiViewNarrowBandFraction':float((near_count>=2).sum()/max((near_count>0).sum(),1)),'extractionMaskVoxels':int(extract_mask.sum()),'perView':per_view,'views':per_view,'vertices':len(mesh.vertices),'faces':len(mesh.faces),'watertight':bool(mesh.is_watertight),'holeFilling':False,'hiddenGeometry':'none','unknownBoundaryCapping':False,'absoluteScaleKnown':False,'seconds':time.monotonic()-started,'limitations':['Camera poses and depth are predicted, not measured.','Fusion covers confident observed surfaces only.','TSDF merging is not an independent camera registration or appearance quality certificate.']}
    evidence.update(version='cpu-tsdf-observed-v2',depthSampling='bilinear with four valid source neighbours',extractionSupport='eight observed corners per grid cell',validExtractionCells=int(valid_cells.sum()))
    return mesh,evidence


def main():
    import argparse
    from PIL import Image
    parser=argparse.ArgumentParser();parser.add_argument('folder',type=Path);parser.add_argument('--resolution',type=int,default=160);parser.add_argument('--output',type=Path)
    args=parser.parse_args();folder=args.folder
    data=np.load(folder/'geometry-evidence.npz');images=np.stack([np.asarray(Image.open(folder/f'processed-{i:02d}.png').convert('RGB')) for i in range(len(data['depth']))])
    mesh,evidence=fuse_tsdf(images,data['depth'],data['confidence'],data['intrinsics'],data['worldToCamera'],data['masks'],args.resolution)
    camera=data['worldToCamera'][0];mesh.vertices=(mesh.vertices@camera[:3,:3].T+camera[:3,3])*np.array([1,-1,-1])
    target=args.output or folder/'tsdf-model.glb';target.parent.mkdir(parents=True,exist_ok=True);mesh.export(target)
    evidence.update(exportCoordinateFrame='first-camera glTF Y-up',sha256=hashlib.sha256(target.read_bytes()).hexdigest(),bytes=target.stat().st_size,output=str(target))
    target.with_suffix('.json').write_text(json.dumps(evidence,indent=2),'utf-8');print(json.dumps(evidence),flush=True)


if __name__=='__main__':main()
