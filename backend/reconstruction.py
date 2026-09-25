"""Persistent per-session assets/jobs/layouts. One GPU process, never the web interpreter."""
from pathlib import Path
import base64,hashlib,io,json,math,os,secrets,subprocess,threading,time
from datetime import datetime,timezone
from fastapi import APIRouter,Header,HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel,ConfigDict,Field

ROOT=Path(__file__).resolve().parents[1];HOME=ROOT/'.runtime/reconstruction';HOME.mkdir(parents=True,exist_ok=True)
LOCK=threading.RLock();FILE=HOME/'state.json'
DB=json.loads(FILE.read_text('utf-8')) if FILE.exists() else {k:{} for k in ('sessions','images','jobs','assets','layouts','runs')}
def stamp():return datetime.now(timezone.utc).isoformat()
def save():
 with LOCK:
  p=FILE.with_suffix('.tmp');p.write_text(json.dumps(DB,ensure_ascii=False),encoding='utf-8');os.replace(p,FILE)
def uid(prefix):return prefix+'-'+secrets.token_hex(12)
def sha(data):return hashlib.sha256(data).hexdigest()
def auth(token):
 with LOCK:
  if token not in DB['sessions']:raise HTTPException(401,'建模会话已失效')
  return DB['sessions'][token]['id']
def owned(kind,key,owner):
 v=DB[kind].get(key)
 if not v or v.get('owner')!=owner:raise HTTPException(404,'资源不存在或无权读取')
 return v
def public(v):return {k:x for k,x in v.items() if k not in ('owner','path','messages','pending','imagePath')}
def ready():return (ROOT/'.reconstruction/weights.json').exists() and (ROOT/'.reconstruction/venv/Scripts/python.exe').exists()
def catalog(campus):
 data=json.loads((ROOT/'data/knowledge/a_asset_inventory.json').read_text('utf-8'));items=[]
 for p in data['runtimePhotos']:
  if p['poiId'].startswith(campus+'-') and not p.get('crossPoiReuse') and p.get('availability')=='available':
   path=(ROOT/p['public']['path']).resolve()
   if path.is_relative_to(ROOT/'frontend/public') and path.is_file():items.append({'id':p['assetId'],'poiId':p['poiId'],'url':p['url'],'source':p['source'],'license':p['license'],'path':str(path)})
 return items
def import_image(owner,data,filename,poi,source,campus):
 from PIL import Image,ImageOps
 if len(data)>8*1024*1024:raise ValueError('图片不能超过8MiB')
 with Image.open(io.BytesIO(data)) as raw:
  if raw.format not in ('JPEG','PNG') or raw.width*raw.height>24000000:raise ValueError('需要JPEG/PNG，最多2400万像素')
  raw.load();im=ImageOps.exif_transpose(raw).convert('RGBA')
 if source!='user upload' and filename=='beiyangyuan-datong-center-2.jpg':
  im=im.crop((int(im.width*.08),int(im.height*.22),int(im.width*.71),int(im.height*.61)))
 if poi and poi not in {p['poiId'] for p in catalog(campus)}:raise ValueError('请选择当前校区有效地点')
 key=uid('image');folder=HOME/'images'/key;folder.mkdir(parents=True)
 (folder/'original').write_bytes(data);im.save(folder/'input.png');im.thumbnail((512,512));im.save(folder/'thumbnail.png')
 v={'id':key,'owner':owner,'poiId':poi,'campusId':campus,'filename':Path(filename).name,'source':source,'sha256':sha(data),'path':str(folder/'input.png'),'createdAt':stamp(),'thumbnailUrl':f'/api/reconstruction/images/{key}'}
 with LOCK:DB['images'][key]=v;save()
 return public(v)
def existing_image(owner,photoId,campus):
 p=next((p for p in catalog(campus) if p['id']==photoId),None)
 if not p:raise ValueError('照片不存在或跨地点复用，不可用于该建筑重建')
 digest=sha(Path(p['path']).read_bytes())
 for v in DB['images'].values():
  if v['owner']==owner and v['poiId']==p['poiId'] and v['sha256']==digest:return public(v)
 return import_image(owner,Path(p['path']).read_bytes(),Path(p['path']).name,p['poiId'],p['source'],campus)
def submit(owner,imageId,key,removeBackground=True):
 image=owned('images',imageId,owner)
 if not image['poiId']:raise ValueError('生成前请将图片绑定到现有地点')
 if not ready():raise ValueError('重建环境和权重尚未就绪')
 version=json.loads((ROOT/'.reconstruction/source-version.json').read_text());weights=json.loads((ROOT/'.reconstruction/weights.json').read_text())
 cache=sha(json.dumps([image['sha256'],version,weights['revision'],removeBackground,256,'preprocess-v3-cpu-mc-outward-front-matte']).encode())
 with LOCK:
  for j in DB['jobs'].values():
   if j['owner']==owner and (j['idempotencyKey']==key or (j['cacheKey']==cache and j['poiId']==image['poiId'] and j['stage'] not in ('failed','cancelled'))):return {**public(j),'cacheHit':j['stage']=='succeeded'}
  jid=uid('job');folder=HOME/'jobs'/jid;folder.mkdir(parents=True)
  j={'id':jid,'owner':owner,'imageId':imageId,'poiId':image['poiId'],'campusId':image['campusId'],'idempotencyKey':key,'cacheKey':cache,'stage':'queued','createdAt':stamp(),'queuedAt':time.time(),'removeBackground':removeBackground,'cancelRequested':False}
  DB['jobs'][jid]=j;save();ensure_worker();return public(j)
def cancel_job(owner,jid):
 with LOCK:
  j=owned('jobs',jid,owner)
  if j['stage'] in ('succeeded','failed','cancelled'):return public(j)
  j['cancelRequested']=True;(HOME/'jobs'/jid/'cancel').touch()
  if j['stage']=='queued':j['stage']='cancelled'
  save();return public(j)
_worker=None
def ensure_worker():
 global _worker
 if _worker is None or not _worker.is_alive():_worker=threading.Thread(target=worker,daemon=True);_worker.start()
def worker():
 while True:
  with LOCK:
   j=next((j for j in DB['jobs'].values() if j['stage']=='queued'),None)
   if j:
    if time.time()-j['queuedAt']>1800:j.update(stage='failed',error='排队超过30分钟');save();continue
    j.update(stage='preprocessing',startedAt=stamp());save()
  if not j:time.sleep(1);continue
  folder=HOME/'jobs'/j['id'];image=DB['images'][j['imageId']]
  (folder/'job.json').write_text(json.dumps({'imagePath':image['path'],'removeBackground':j['removeBackground']}))
  try:
   with (folder/'worker.log').open('w',encoding='utf-8') as log:
    p=subprocess.Popen([str(ROOT/'.reconstruction/venv/Scripts/python.exe'),str(ROOT/'scripts/reconstruction-worker.py'),str(folder/'job.json')],cwd=ROOT,stdout=log,stderr=log,creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0))
    start=time.monotonic()
    while p.poll() is None:
     if time.monotonic()-start>600:
      subprocess.run(['taskkill','/PID',str(p.pid),'/T','/F'],capture_output=True);p.wait();raise TimeoutError('单次重建超过10分钟，已终止本任务进程')
     try:
      stage=json.loads((folder/'phase.json').read_text())
      with LOCK:j.update(stage=stage['stage'],elapsedSeconds=stage['elapsedSeconds']);save()
     except (FileNotFoundError,json.JSONDecodeError):pass
     time.sleep(.5)
   result=json.loads((folder/'result.json').read_text())
   with LOCK:
    if j['cancelRequested']:j['stage']='cancelled'
    elif result['stage']=='succeeded':
     aid=uid('model');a={'id':aid,'owner':j['owner'],'imageId':j['imageId'],'poiId':j['poiId'],'campusId':j['campusId'],'jobId':j['id'],'path':str(folder/'model.glb'),'createdAt':stamp(),**result}
     DB['assets'][aid]=a;j.update(stage='succeeded',assetId=aid,result=public(a))
    else:j.update(stage=result['stage'],error=result.get('error'))
    save()
  except Exception as e:
   with LOCK:j.update(stage='cancelled' if j['cancelRequested'] else 'failed',error=str(e));save()

# On web restart, interrupted jobs never become false successes or remain running.
for _j in DB['jobs'].values():
 if _j['stage'] not in ('queued','succeeded','failed','cancelled'):_j.update(stage='failed',error='服务重启中断任务；请检查后显式重试')
save()
class Strict(BaseModel):model_config=ConfigDict(extra='forbid')
class Session(Strict):token:str|None=None
class ImageUpload(Strict):
 filename:str=Field(max_length=200);contentBase64:str=Field(max_length=12000000);poiId:str|None=None;campusId:str=Field(pattern='^(weijinlu|beiyangyuan)$')
class ImportPhoto(Strict):photoId:str;campusId:str=Field(pattern='^(weijinlu|beiyangyuan)$')
class Submit(Strict):imageId:str;idempotencyKey:str=Field(min_length=1,max_length=200);removeBackground:bool=True
class Layout(Strict):
 assetId:str;anchorLngLat:tuple[float,float];headingDeg:float=Field(ge=-360,le=360);referenceLengthM:float=Field(gt=0,le=2000);referenceAxis:str=Field(pattern='^(width|depth|height)$');referenceSource:str=Field(min_length=3,max_length=500);revision:int=Field(ge=0);anchorSource:str=Field(min_length=3,max_length=500);referencePoints:list[tuple[float,float]]|None=None
def set_layout(owner,b):
 a=owned('assets',b.assetId,owner);lng,lat=b.anchorLngLat
 if not all(math.isfinite(x) for x in [lng,lat,b.headingDeg,b.referenceLengthM]) or not (116<lng<118 and 38<lat<41):raise ValueError('锚点必须是天津校区附近GCJ-02坐标')
 idx={'width':0,'height':1,'depth':2}[b.referenceAxis];scale=b.referenceLengthM/a['extents'][idx]
 with LOCK:
  old=DB['layouts'].get(b.assetId)
  if (old['revision'] if old else 0)!=b.revision:raise ValueError('布局已变更，请刷新后再保存')
  v={'owner':owner,'assetId':b.assetId,'poiId':a['poiId'],'campusId':a['campusId'],'anchorLngLat':[lng,lat],'crs':'GCJ02','anchorSource':b.anchorSource,'headingDeg':b.headingDeg%360,'headingSource':'user calibration; clockwise from north','metersPerModelUnit':scale,'upAxis':'Y','pivot':'bottom-center','localOrigin':[lng,lat],'reference':{'axis':b.referenceAxis,'lengthM':b.referenceLengthM,'source':b.referenceSource,'points':b.referencePoints,'at':stamp()},'dimensionsM':{k:a['extents'][i]*scale for k,i in [('width',0),('height',1),('depth',2)]},'dimensionQuality':'reference axis estimated from stated source; other axes inferred from generated mesh','revision':b.revision+1,'calibrationStatus':'reference_supplied','updatedAt':stamp()}
  v.update(assetVersion=a.get('sha256'),imageId=a.get('imageId'),modelBounds=a.get('bounds'),localBoundsM=[[-v['dimensionsM']['width']/2,0,-v['dimensionsM']['depth']/2],[v['dimensionsM']['width']/2,v['dimensionsM']['height'],v['dimensionsM']['depth']/2]])
  DB['layouts'][b.assetId]=v;save();return public(v)
router=APIRouter(prefix='/api/reconstruction',tags=['reconstruction'])
@router.post('/session')
def session(b:Session):
 with LOCK:
  if b.token in DB['sessions']:return {'token':b.token}
  token=secrets.token_urlsafe(32);DB['sessions'][token]={'id':uid('owner'),'createdAt':stamp()};save();return {'token':token}
@router.get('/state')
async def state(x_reconstruction_session:str=Header(default='')):
 owner=auth(x_reconstruction_session);ensure_worker()
 from backend.model.reconstruction_workflow import ensure_runs
 ensure_runs(owner)
 with LOCK:return {'ready':ready(),**{k:[public(v) for v in DB[k].values() if v['owner']==owner] for k in ('images','jobs','assets','layouts','runs')}}
@router.get('/catalog/{campus}')
def list_catalog(campus:str):return [{k:v for k,v in p.items() if k!='path'} for p in catalog(campus)]
@router.post('/images')
def upload(b:ImageUpload,x_reconstruction_session:str=Header(default='')):
 try:return import_image(auth(x_reconstruction_session),base64.b64decode(b.contentBase64,validate=True),b.filename,b.poiId,'user upload',b.campusId)
 except (ValueError,OSError) as e:raise HTTPException(422,str(e))
@router.post('/images/import')
def import_photo(b:ImportPhoto,x_reconstruction_session:str=Header(default='')):
 try:return existing_image(auth(x_reconstruction_session),b.photoId,b.campusId)
 except ValueError as e:raise HTTPException(422,str(e))
@router.get('/images/{iid}')
def thumbnail(iid:str,x_reconstruction_session:str=Header(default='')):
 v=owned('images',iid,auth(x_reconstruction_session));return FileResponse(Path(v['path']).parent/'thumbnail.png',headers={'Cache-Control':'private, max-age=3600'})
@router.post('/jobs')
def create_job(b:Submit,x_reconstruction_session:str=Header(default='')):
 try:return submit(auth(x_reconstruction_session),b.imageId,b.idempotencyKey,b.removeBackground)
 except ValueError as e:raise HTTPException(422,str(e))
@router.post('/jobs/{jid}/cancel')
def cancel(jid:str,x_reconstruction_session:str=Header(default='')):return cancel_job(auth(x_reconstruction_session),jid)
@router.get('/assets/{aid}/file')
def asset_file(aid:str,x_reconstruction_session:str=Header(default='')):
 a=owned('assets',aid,auth(x_reconstruction_session));return FileResponse(a['path'],media_type='model/gltf-binary',filename=a['poiId']+'.glb',headers={'Cache-Control':'private, max-age=3600','X-Asset-SHA256':a['sha256']})
@router.put('/layouts')
def layout(b:Layout,x_reconstruction_session:str=Header(default='')):
 try:return set_layout(auth(x_reconstruction_session),b)
 except ValueError as e:raise HTTPException(409,str(e))
