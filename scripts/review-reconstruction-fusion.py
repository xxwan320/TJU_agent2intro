from pathlib import Path
import json,sys
import numpy as np
import trimesh
from PIL import Image,ImageDraw
from numba import njit

@njit
def raster(xy,z,faces,colors,w,h):
 buffer=np.full((h,w),1e20);pixels=np.full((h,w,3),240.,dtype=np.float64)
 for f in faces:
  if min(z[f])<=1e-6:continue
  a,b,c=xy[f[0]],xy[f[1]],xy[f[2]]
  lx=max(0,int(np.floor(min(a[0],b[0],c[0]))));hx=min(w-1,int(np.ceil(max(a[0],b[0],c[0]))))
  ly=max(0,int(np.floor(min(a[1],b[1],c[1]))));hy=min(h-1,int(np.ceil(max(a[1],b[1],c[1]))))
  den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1])
  if abs(den)<1e-12:continue
  for y in range(ly,hy+1):
   for x in range(lx,hx+1):
    u=((b[1]-c[1])*(x-c[0])+(c[0]-b[0])*(y-c[1]))/den
    v=((c[1]-a[1])*(x-c[0])+(a[0]-c[0])*(y-c[1]))/den
    if u<0 or v<0 or u+v>1:continue
    q=np.array([u,v,1-u-v])/z[f];d=1/q.sum()
    if d<buffer[y,x]:
     buffer[y,x]=d
     for channel in range(3):pixels[y,x,channel]=np.sum(q*colors[f,channel])*d
 return pixels,buffer

folder=Path(sys.argv[1]);mesh=trimesh.load(folder/'model.glb',force='mesh',process=False)
evidence=np.load(folder/'geometry-evidence.npz');ext=evidence['worldToCamera'];ks=evidence['intrinsics'];depth=evidence['depth'];confidence=evidence['confidence']
world=(mesh.vertices*np.array([1,-1,-1])-ext[0,:3,3])@ext[0,:3,:3]
n,h,w=depth.shape;sheet=Image.new('RGB',(w*2,(h+28)*n),'white');draw=ImageDraw.Draw(sheet);cameras=[];metrics=[]
for i in range(n):
 cam=world@ext[i,:3,:3].T+ext[i,:3,3];p=cam@ks[i].T;xy=p[:,:2]/np.maximum(p[:,2:],1e-8)
 pixels,buffer=raster(xy,cam[:,2],mesh.faces.astype('int64'),mesh.visual.vertex_colors[:,:3].astype('float64'),w,h)
 original=Image.open(folder/f'processed-{i:02d}.png').convert('RGB');render=Image.fromarray(pixels.clip(0,255).astype('uint8'));render.save(folder/f'reprojected-{i:02d}.png')
 sheet.paste(original,(0,i*(h+28)));sheet.paste(render,(w,i*(h+28)));draw.text((4,i*(h+28)+h+5),f'Source {i+1}',fill='black');draw.text((w+4,i*(h+28)+h+5),f'Fused mesh at estimated camera {i+1}',fill='black')
 center=-ext[i,:3,:3].T@ext[i,:3,3];forward=ext[i,:3,:3].T@np.array([0,0,1]);up=ext[i,:3,:3].T@np.array([0,-1,0]);target=center+forward*np.median(depth[i])
 transform=lambda point:((point@ext[0,:3,:3].T+ext[0,:3,3])*np.array([1,-1,-1])).tolist()
 cameras.append({'viewIndex':i,'position':transform(center),'target':transform(target),'up':((up@ext[0,:3,:3].T)*np.array([1,-1,-1])).tolist()})
 valid=buffer<1e19;actual=np.asarray(original).astype('float64');mae=float(np.abs(actual[valid]-pixels[valid]).mean()) if valid.any() else None
 metrics.append({'viewIndex':i,'renderedCoverage':float(valid.mean()),'meanAbsoluteColorError':mae,'confidencePercentiles':np.percentile(confidence[i],[0,25,40,50,75,90,100]).tolist(),'depthPercentiles':np.percentile(depth[i],[0,1,25,50,75,99,100]).tolist()})
sheet.save(folder/'source-reprojection-review.jpg',quality=92)
(folder/'camera-viewer.json').write_text(json.dumps(cameras,indent=2),'utf-8');(folder/'source-reprojection-metrics.json').write_text(json.dumps(metrics,indent=2),'utf-8')
print(json.dumps(metrics))
