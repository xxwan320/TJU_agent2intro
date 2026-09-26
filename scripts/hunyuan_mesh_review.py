"""CPU geometry review and bounded source projection; no generated image edits."""
import numpy as np
from PIL import Image, ImageDraw

def camera(az,el):
    az,el=np.radians([az,el]);eye=np.array([np.sin(az)*np.cos(el),np.sin(el),np.cos(az)*np.cos(el)])
    right=np.array([np.cos(az),0,-np.sin(az)]);up=np.cross(eye,right)
    return np.column_stack([right,up,eye])

def render_review(mesh,path):
    vertices=mesh.vertices.copy();vertices-=(vertices.min(0)+vertices.max(0))/2;vertices/=max(np.ptp(vertices,axis=0))
    output=Image.new('RGB',(1440,960),'white')
    colors=mesh.visual.vertex_colors[:,:3] if hasattr(mesh.visual,'vertex_colors') else np.tile([180,185,195],(len(vertices),1))
    color=colors[mesh.faces].mean(axis=1);shade=.4+.6*np.abs(mesh.face_normals@np.array([.3,.7,.65]));color=(color*shade[:,None]).clip(0,255).astype('uint8')
    for index,(az,el) in enumerate([(0,0),(90,0),(180,0),(270,0),(45,25),(225,25)]):
        projected=vertices@camera(az,el);xy=projected[:,:2]*np.array([360,-360])+240
        view=Image.new('RGB',(480,480),(245,246,249));draw=ImageDraw.Draw(view)
        for f in np.argsort(projected[mesh.faces,2].mean(axis=1)):draw.polygon([tuple(p) for p in xy[mesh.faces[f]]],fill=tuple(color[f]))
        draw.text((10,10),f'azimuth {az}, elevation {el}',fill='black');output.paste(view,((index%3)*480,(index//3)*480))
    output.save(path)

def project_visible_colors(mesh,image,folder):
    import cv2
    from numba import njit
    rgba=np.asarray(image);alpha=rgba[:,:,3]>127;ys,xs=np.nonzero(alpha)
    target_box=np.array([xs.min(),ys.min(),xs.max(),ys.max()],dtype=float)
    target_size=target_box[2:]-target_box[:2];target_center=(target_box[:2]+target_box[2:])/2
    vertices=mesh.vertices;center=(vertices.min(0)+vertices.max(0))/2;v=vertices-center
    target=cv2.resize(alpha.astype('uint8'),(128,128),interpolation=cv2.INTER_NEAREST)
    best=None
    # Camera is fit against observed foreground only; repeated symmetries remain ambiguous.
    for az in range(0,360,5):
        for el in range(-10,41,5):
            basis=camera(az,el);p=v@basis;p[:,1]*=-1
            lo=p[:,:2].min(0);hi=p[:,:2].max(0);scale=min(target_size/(hi-lo));offset=target_center-(lo+hi)/2*scale
            xy=(p[:,:2]*scale+offset)/np.array(image.size)*128
            hull=cv2.convexHull(np.round(xy).astype('int32'));mask=np.zeros((128,128),'uint8');cv2.fillConvexPoly(mask,hull,1)
            intersection=np.count_nonzero(mask&target);union=np.count_nonzero(mask|target);iou=intersection/max(union,1)
            if best is None or iou>best[0]:best=(iou,az,el,scale,offset,basis)
    iou,az,el,scale,offset,basis=best;p=v@basis;p[:,1]*=-1;xy=p[:,:2]*scale+offset
    @njit(cache=False)
    def zbuffer(xy,z,faces,width,height):
        buffer=np.full((height,width),-1e10)
        for face in faces:
            a,b,c=xy[face[0]],xy[face[1]],xy[face[2]];za,zb,zc=z[face[0]],z[face[1]],z[face[2]]
            lo_x=max(0,int(np.floor(min(a[0],b[0],c[0]))));hi_x=min(width-1,int(np.ceil(max(a[0],b[0],c[0]))))
            lo_y=max(0,int(np.floor(min(a[1],b[1],c[1]))));hi_y=min(height-1,int(np.ceil(max(a[1],b[1],c[1]))))
            denominator=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1])
            if abs(denominator)<1e-10:continue
            for y in range(lo_y,hi_y+1):
                for x in range(lo_x,hi_x+1):
                    u=((b[1]-c[1])*(x-c[0])+(c[0]-b[0])*(y-c[1]))/denominator
                    w=((c[1]-a[1])*(x-c[0])+(a[0]-c[0])*(y-c[1]))/denominator
                    if u>=-.001 and w>=-.001 and u+w<=1.001:
                        depth=u*za+w*zb+(1-u-w)*zc
                        if depth>buffer[y,x]:buffer[y,x]=depth
        return buffer
    w,h=image.size;z=zbuffer(xy,p[:,2],mesh.faces,w,h)
    coord=np.round(xy).astype('int32');inside=(coord[:,0]>=0)&(coord[:,0]<w)&(coord[:,1]>=0)&(coord[:,1]<h)
    safe=coord.copy();safe[:,0]=safe[:,0].clip(0,w-1);safe[:,1]=safe[:,1].clip(0,h-1)
    tolerance=max(mesh.extents)*.01
    visible=inside & (p[:,2]>=z[safe[:,1],safe[:,0]]-tolerance) & alpha[safe[:,1],safe[:,0]] & ((mesh.vertex_normals@basis[:,2])>0)
    colors=np.tile([170,178,188,255],(len(v),1)).astype('uint8');colors[visible,:3]=rgba[safe[visible,1],safe[visible,0],:3]
    mesh.visual.vertex_colors=colors
    overlay=rgba[:,:,:3].copy();boundary=np.zeros((h,w),'uint8');cv2.drawContours(boundary,[cv2.convexHull(np.round(xy).astype('int32'))],-1,255,2);overlay[boundary>0]=[255,0,150];Image.fromarray(overlay).save(folder/'projection-overlay.png')
    report={'method':'orthographic silhouette camera fit plus z-buffer visible-only vertex colors','cameraAzimuthDeg':az,'cameraElevationDeg':el,'pixelsPerModelUnit':float(scale),'convexSilhouetteIoU':float(iou),'observedVertexFraction':float(visible.mean()),'hiddenSurfaceColor':'neutral gray','cameraIsMeasured':False,'limitations':'Camera estimated from one silhouette, ambiguous under symmetry; hidden textures and geometry remain unverified.'}
    fit={'basis':basis,'projectedVertices':p,'imageCoordinates':xy,'azimuth':az,'elevation':el,'iou':iou}
    return report,fit,z

def bake_visible_texture(mesh,image,folder,fit,depth_map):
    """Bake the observed camera view into UV coordinates; keep unseen faces neutral gray."""
    import cv2, trimesh
    from trimesh.visual.material import SimpleMaterial
    from trimesh.visual.texture import TextureVisuals
    rgba=np.asarray(image.convert('RGBA'));alpha=rgba[:,:,3]>127;ys,xs=np.nonzero(alpha)
    if not len(xs):raise ValueError('Cannot bake a texture from an empty foreground mask')
    vertices=mesh.vertices;faces=mesh.faces
    basis=fit['basis'];p=fit['projectedVertices'];xy=fit['imageCoordinates'];az=fit['azimuth'];el=fit['elevation'];iou=fit['iou']
    h,w=alpha.shape
    tri_xy=xy[faces];centers=tri_xy.mean(axis=1);tri_depth=p[faces,2].mean(axis=1)
    coords=np.round(centers).astype('int32');inside=(coords[:,0]>=0)&(coords[:,0]<w)&(coords[:,1]>=0)&(coords[:,1]<h)
    safe=coords.copy();safe[:,0]=safe[:,0].clip(0,w-1);safe[:,1]=safe[:,1].clip(0,h-1)
    face_normals=mesh.face_normals
    tolerance=max(mesh.extents)*.01
    visible=inside&(tri_depth>=depth_map[safe[:,1],safe[:,0]]-tolerance)&alpha[safe[:,1],safe[:,0]]&((face_normals@basis[:,2])>0)
    # Composite transparent background pixels before baking. RGB values beneath
    # alpha=0 are commonly black; GPU texture filtering can otherwise bleed that
    # black into the silhouette edge even when the face center is foreground.
    pad=8
    neutral=Image.new('RGBA',(w,h),(170,178,188,255))
    neutral.alpha_composite(image.convert('RGBA'))
    atlas=Image.new('RGB',(w+pad*2,h+pad*2),(170,178,188))
    atlas.paste(neutral.convert('RGB'),(pad,pad))
    atlas_path=folder/'texture-atlas.png';atlas.save(atlas_path,optimize=True)
    # Share vertices within the observed and unobserved regions; duplicate only at
    # their boundary instead of tripling every face's geometry.
    corner_mode=np.repeat(visible.astype(np.int64),3)
    unique_keys,inverse=np.unique(faces.reshape(-1)*2+corner_mode,return_inverse=True)
    source_indices=unique_keys//2;observed_corners=(unique_keys%2)==1
    split_vertices=vertices[source_indices];split_normals=mesh.vertex_normals[source_indices]
    split_uv=np.empty((len(source_indices),2),dtype=np.float32)
    split_uv[:]=[(w+pad+pad/2)/(w+2*pad),1-(h+pad+pad/2)/(h+2*pad)]
    if observed_corners.any():
        sample=np.clip(xy[source_indices[observed_corners]],[[0,0]],[w-1,h-1])
        split_uv[observed_corners,0]=(sample[:,0]+pad)/(w+2*pad)
        split_uv[observed_corners,1]=1-(sample[:,1]+pad)/(h+2*pad)
    split_faces=inverse.reshape(-1,3)
    material=SimpleMaterial(image=atlas,diffuse=[255,255,255,255],glossiness=1.0)
    textured=trimesh.Trimesh(vertices=split_vertices,faces=split_faces,vertex_normals=split_normals,visual=TextureVisuals(uv=split_uv,material=material),process=False)
    return textured,{'method':'single-view camera projection baked to UV texture','textureSize':[atlas.width,atlas.height],'textureFile':'embedded in model.glb','observedFaceFraction':float(visible.mean()),'hiddenSurfaceColor':'neutral gray','cameraAzimuthDeg':az,'cameraElevationDeg':el,'silhouetteIoU':float(iou),'limitations':'Only faces visible in the input photograph receive photo texture; hidden and occluded surfaces remain neutral gray.'}
