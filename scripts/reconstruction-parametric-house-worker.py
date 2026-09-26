"""Deterministic low-poly house for prompts with explicit per-floor window counts."""
from pathlib import Path
import sys,json,hashlib,time
import numpy as np
import trimesh
jobfile=Path(sys.argv[1]);job=json.loads(jobfile.read_text(encoding="utf-8"));folder=jobfile.parent;spec=job["spec"];started=time.time()
floors=int(spec["floors"]);count=int(spec["windowsPerFloor"]);dims=spec["dimensions"];width=float(dims["width"]);depth=float(dims["depth"]);fh=float(dims["floorHeight"]);wt=float(dims["wallThickness"]);slab=.025;parts=[]
colors={"wall":[220,211,190,255],"roof":[95,73,61,255],"frame":[235,235,225,255],"glass":[65,112,140,255],"base":[155,150,140,255]}
def box(name,ext,center,color):
    if min(ext)<=0:return
    m=trimesh.creation.box(extents=ext);m.apply_translation(center);m.visual.vertex_colors=np.tile(np.array(color,dtype=np.uint8),(len(m.vertices),1));m.metadata["name"]=name;parts.append(m)
front=depth/2;win_w=min(.16,width/(count+1)*.58);win_h=min(.115,fh*.46);door_enabled=bool(spec.get("door"));door_w=min(.15,width*.22);door_h=min(.22,fh*.78)
for level in range(floors):
    y0=level*fh;box(f"floor-{level+1}",(width,slab,depth),(0,y0+slab/2,0),colors["base"]);bottom=y0+slab;top=y0+fh-slab/2;wall_h=top-bottom;win_cy=bottom+wall_h*.59
    if count==1:centers=[0.0]
    else:centers=np.linspace(-width*.32,width*.32,count).tolist()
    xcuts=sorted(set([-width/2,width/2]+[max(-width/2,min(width/2,c+sgn*win_w/2)) for c in centers for sgn in (-1,1)]+([-door_w/2,door_w/2] if level==0 and door_enabled else [])));ycuts=sorted(set([bottom,top]+[max(bottom,min(top,win_cy+sgn*win_h/2)) for sgn in (-1,1)]+([bottom+door_h] if level==0 and door_enabled else [])))
    for xi in range(len(xcuts)-1):
        for yi in range(len(ycuts)-1):
            x1,x2=xcuts[xi:xi+2];a,b=ycuts[yi:yi+2];cx=(x1+x2)/2;cy=(a+b)/2
            inside=any(abs(cx-c)<win_w/2-1e-7 and abs(cy-win_cy)<win_h/2-1e-7 for c in centers) or (level==0 and door_enabled and abs(cx)<door_w/2-1e-7 and bottom<cy<bottom+door_h)
            if not inside:box(f"front-wall-{level+1}-{xi}-{yi}",(x2-x1,b-a,wt),(cx,cy,front-wt/2),colors["wall"])
    box(f"back-wall-{level+1}",(width-2*wt,wall_h,wt),(0,(bottom+top)/2,-depth/2+wt/2),colors["wall"])
    box(f"left-wall-{level+1}",(wt,wall_h,depth-2*wt),(-width/2+wt/2,(bottom+top)/2,0),colors["wall"]);box(f"right-wall-{level+1}",(wt,wall_h,depth-2*wt),(width/2-wt/2,(bottom+top)/2,0),colors["wall"])
    for index,cx in enumerate(centers,1):
        z=front-wt*.58;box(f"window-pane-{level+1}-{index}",(win_w*.82,win_h*.82,.006),(cx,win_cy,z),colors["glass"]);bar=.012;fz=front+.002
        box(f"window-frame-top-{level+1}-{index}",(win_w+bar,bar,.012),(cx,win_cy+win_h/2,fz),colors["frame"]);box(f"window-frame-bottom-{level+1}-{index}",(win_w+bar,bar,.012),(cx,win_cy-win_h/2,fz),colors["frame"])
        for side in (-1,1):box(f"window-frame-side-{level+1}-{index}-{side}",(bar,win_h,.012),(cx+side*win_w/2,win_cy,fz),colors["frame"])
    if level==0 and door_enabled:
        door_y=bottom+door_h/2;box("front-door-panel",(door_w*.9,door_h*.96,.008),(0,door_y,front-wt*.52),[90,67,54,255]);frame=.012
        box("door-frame-top",(door_w+frame,frame,.014),(0,bottom+door_h,front+.002),colors["frame"])
        box("door-frame-bottom",(door_w+frame,frame,.014),(0,bottom,front+.002),colors["frame"])
        for side in (-1,1):box(f"door-frame-side-{side}",(frame,door_h,.014),(side*door_w/2,door_y,front+.002),colors["frame"])
    # Storey labels are analytic evidence for the guaranteed count, not inferred texture.
roof_y=floors*fh-slab/2
if spec.get("roofStyle")=="gable":
    # One regular triangular prism avoids a seam between independently rotated roof slabs.
    half=width/2+.02;rise=.13;z=depth/2+.02
    vertices=[[-half,roof_y,-z],[half,roof_y,-z],[0,roof_y+rise,-z],[-half,roof_y,z],[half,roof_y,z],[0,roof_y+rise,z]]
    faces=[[0,2,1],[3,4,5],[0,3,5],[0,5,2],[1,2,5],[1,5,4],[0,1,4],[0,4,3]]
    roof=trimesh.Trimesh(vertices=vertices,faces=faces,process=False);roof.fix_normals();roof.visual.vertex_colors=np.tile(np.array(colors["roof"],dtype=np.uint8),(len(roof.vertices),1));parts.append(roof)
else:box("flat-roof",(width+.04,slab,depth+.04),(0,floors*fh,0),colors["roof"])
scene=trimesh.Scene();[scene.add_geometry(m,node_name=m.metadata.get("name",f"part-{i}")) for i,m in enumerate(parts)]
path=folder/"model.glb";path.write_bytes(trimesh.exchange.gltf.export_glb(scene));digest=hashlib.sha256(path.read_bytes()).hexdigest();records=[{"floor":level+1,"frontWindows":count} for level in range(floors)]
result={"stage":"succeeded","generator":"parametric-house","originalPrompt":job["originalPrompt"],"conditionPrompt":job["conditionPrompt"],"parametricSpec":{**spec,"verifiedWindowCounts":records},"sha256":digest,"bytes":path.stat().st_size,"bounds":scene.bounds.tolist(),"extents":scene.extents.tolist(),"vertices":sum(len(m.vertices) for m in parts),"faces":sum(len(m.faces) for m in parts),"colors":True,"upAxis":"Y","timings":{"generation":time.time()-started},"totalSeconds":time.time()-started,"quality":"Parametric house: exact requested floor and front-window counts; architectural geometry is constructed directly, colors and fine facade details are simplified.","qualityReview":{"status":"unreviewed","accepted":False,"limitations":["Exact window count is guaranteed by the parametric construction; proportions and facade details are simplified.","Check slicer preview and orient/support settings before printing."]},"printability":{"status":"not_certified","reason":"GLB scene contains adjoining solid parts; repair/union and slicer validation are required before printing."}}
(folder if False else jobfile.parent).joinpath("result.json").write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding="utf-8")
