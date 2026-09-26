import asyncio
import io
import pytest
from fastapi import HTTPException
from PIL import Image
from backend import reconstruction as r
from backend.model import reconstruction_workflow as workflow

@pytest.fixture
def isolated(tmp_path,monkeypatch):
    monkeypatch.setattr(r,'HOME',tmp_path)
    monkeypatch.setattr(r,'FILE',tmp_path/'state.json')
    monkeypatch.setattr(r,'DB',{k:{} for k in ('sessions','images','jobs','assets','layouts','runs')})
    monkeypatch.setattr(r,'ensure_worker',lambda:None)
    return tmp_path

def test_image_decode_ownership_and_original(isolated):
    buf=io.BytesIO();Image.new('RGB',(30,20),'red').save(buf,format='JPEG')
    data=buf.getvalue();image=r.import_image('one',data,'建筑.jpg',None,'user upload','beiyangyuan')
    assert (isolated/'images'/image['id']/'original').read_bytes()==data
    assert Image.open(isolated/'images'/image['id']/'input.png').size==(30,20)
    with pytest.raises(HTTPException):r.owned('images',image['id'],'two')
    with pytest.raises(OSError):r.import_image('one',b'not jpeg','fake.jpg',None,'user upload','beiyangyuan')

def test_scale_revision_and_transform_saved_once(isolated):
    r.DB['assets']['a']={'id':'a','owner':'one','poiId':'p','campusId':'beiyangyuan','extents':[2,1,3]}
    b=r.Layout(assetId='a',anchorLngLat=[117.31,39],headingDeg=-90,referenceLengthM=20,referenceAxis='width',referenceSource='test fixture length, not real building',revision=0,anchorSource='test fixture anchor')
    layout=r.set_layout('one',b)
    assert layout['metersPerModelUnit']==10
    assert layout['dimensionsM']=={'width':20,'height':10,'depth':30}
    assert layout['headingDeg']==270 and layout['revision']==1
    with pytest.raises(ValueError):r.set_layout('one',b)
    b.revision=1;again=r.set_layout('one',b)
    assert again['dimensionsM']==layout['dimensionsM'] and again['revision']==2
    with pytest.raises(HTTPException):r.set_layout('two',b)

def test_queue_cancellation_is_final_without_publication(isolated):
    (isolated/'jobs'/'j').mkdir(parents=True)
    r.DB['jobs']['j']={'id':'j','owner':'one','stage':'queued'}
    assert r.cancel_job('one','j')['stage']=='cancelled'
    assert (isolated/'jobs'/'j'/'cancel').exists()
    assert not r.DB['assets']

def test_run_tools_validate_owner_campus_and_scene_prerequisites(isolated):
    r.DB['assets']['a']={'id':'a','owner':'one','campusId':'beiyangyuan'}
    run={'id':'r','owner':'one','campusId':'weijinlu','cancelled':False,'deadline':10**12}
    with pytest.raises(ValueError):workflow.run_assets(run,['a'])
    run['campusId']='beiyangyuan'
    with pytest.raises(ValueError):asyncio.run(workflow.execute(run,'scene_show',{'assetIds':['a']},'c'))
    assert run['sceneRequest']['revisions']['a'] is None
    run['cancelled']=True
    with pytest.raises(asyncio.CancelledError):asyncio.run(workflow.execute(run,'model_export',{'assetIds':['a']},'c'))

def test_job_idempotency_and_session_boundary(isolated,monkeypatch):
    home=isolated/'.reconstruction';home.mkdir()
    (home/'source-version.json').write_text('{"commit":"fixture"}')
    (home/'weights.json').write_text('{"revision":"fixture"}')
    monkeypatch.setattr(r,'ROOT',isolated);monkeypatch.setattr(r,'ready',lambda:True);monkeypatch.setattr(r,'providers',lambda:['triposr'])
    (isolated/'input.png').write_bytes(b'fixture pixels')
    r.DB['images']['im']={'path':str(isolated/'input.png'),'id':'im','owner':'one','poiId':'p','campusId':'beiyangyuan','sha256':'abc'}
    first=r.submit('one','im','key');second=r.submit('one','im','key')
    assert first['id']==second['id'] and len(r.DB['jobs'])==1
    with pytest.raises(HTTPException):r.submit('two','im','key')
    r.DB['jobs'][first['id']].update(stage='succeeded',assetId='a')
    asset_path=isolated/'valid.glb';asset_path.write_bytes(b'validated bytes fixture')
    r.DB['assets']['a']={'path':str(asset_path),'sha256':r.sha(asset_path.read_bytes())}
    assert r.submit('one','im','different')['cacheHit'] is True
    asset_path.write_bytes(b'corrupted')
    assert r.submit('one','im','another')['id']!=first['id']
    with pytest.raises(ValueError,match='相同提交标识'):r.submit('one','im','key',False)

def test_cached_asset_is_counted_without_new_job(isolated):
    r.DB['assets']['a']={'id':'a','owner':'one','campusId':'beiyangyuan','imageId':'im','jobId':'j','poiId':'p'}
    run={'owner':'one','campusId':'beiyangyuan','items':[]}
    workflow.run_assets(run,['a']);workflow.run_assets(run,['a'])
    assert len(run['items'])==1 and run['items'][0]['cacheHit'] is True
    assert run['items'][0]['assetId']=='a' and not r.DB['jobs']


def test_empty_mask_recovers_original_and_records_reason():
    from scripts.reconstruction_preprocess import prepare_image
    original=Image.new('RGB',(120,60),'red')
    im,meta=prepare_image(original,True,lambda image:Image.new('RGBA',image.size,(0,0,0,0)))
    assert meta['profile']=='original-recovery' and meta['warnings']
    assert meta['attempts'][0]['foregroundCoverage']==0
    assert im.getpixel((im.width//2,im.height//2))==(255,0,0)

def test_small_alpha_subject_preserved_and_empty_upload_rejected():
    from scripts.reconstruction_preprocess import prepare_image
    im=Image.new('RGBA',(100,100),(0,0,0,0));im.putpixel((50,50),(255,0,0,255))
    result,meta=prepare_image(im,True,lambda _:pytest.fail('must preserve alpha'))
    assert meta['profile']=='supplied-alpha' and result.width>=2
    with pytest.raises(ValueError,match='完全透明'):prepare_image(Image.new('RGBA',(100,100)))

def test_original_pixels_not_filename_control_preprocessing(isolated,monkeypatch):
    monkeypatch.setattr(r,'catalog',lambda campus:[{'poiId':'p'}])
    buf=io.BytesIO();Image.new('RGB',(120,60),'red').save(buf,format='JPEG')
    imported=r.import_image('one',buf.getvalue(),'beiyangyuan-datong-center-2.jpg','p','reference','beiyangyuan')
    assert Image.open(r.DB['images'][imported['id']]['path']).size==(120,60)

def test_finish_never_accepts_model_claim_or_missing_requested_building(isolated):
    run={'owner':'one','items':[{'poiId':'p','jobId':'j'}],'requiredPoiIds':['p','q'],'answer':'全部完成'}
    r.DB['jobs']['j']={'stage':'failed','error':'foreground removed'}
    workflow.finish(run)
    assert run['stage']=='failed' and '全部完成' not in run['answer']
    assert len(run['outcomes'])==2

def test_finish_rechecks_artifact_and_requires_scene_receipt(isolated):
    file=isolated/'model.glb';file.write_bytes(b'validated test fixture')
    r.DB['assets']['a']={'id':'a','owner':'one','path':str(file),'sha256':r.sha(file.read_bytes())}
    r.DB['jobs']['j']={'stage':'succeeded'}
    run={'owner':'one','items':[{'poiId':'p','jobId':'j','assetId':'a'}],'requiredPoiIds':['p'],'exports':[{'assetId':'a'}],'needsMap':True}
    workflow.finish(run);assert run['stage']=='partial'
    run['needsMap']=False;workflow.finish(run);assert run['stage']=='partial'  # Unreviewed geometry is not successful reconstruction.
    run['requiredPoiIds'].append('q');workflow.finish(run);assert run['stage']=='partial'
    file.write_bytes(b'corrupt');workflow.finish(run);assert run['stage']=='failed'


def test_multi_building_rejects_duplicate_before_queue_mutation(isolated):
    for iid in ('i1','i2'):r.DB['images'][iid]={'id':iid,'owner':'one','poiId':'p','campusId':'beiyangyuan'}
    run={'owner':'one','campusId':'beiyangyuan','requiredPoiIds':['p','q'],'items':[],'cancelled':False,'deadline':10**12}
    with pytest.raises(ValueError,match='同一建筑'):asyncio.run(workflow.execute(run,'reconstruction_submit',{'imageAssetIds':['i1','i2']},'c'))
    assert not run['items'] and not r.DB['jobs']

def test_inspect_reconciles_cached_submit_item(isolated):
    r.DB['assets']['a']={'id':'a','owner':'one','imageId':'im','jobId':'j','campusId':'beiyangyuan'}
    run={'owner':'one','campusId':'beiyangyuan','items':[{'imageId':'im'}]}
    workflow.run_assets(run,['a'])
    assert run['items'][0]['assetId']=='a' and run['items'][0]['jobId']=='j'

def test_failed_image_reconstruction_never_becomes_text_concept(isolated,monkeypatch):
    monkeypatch.setattr(r,'ROOT',isolated);monkeypatch.setattr(r,'text_ready',lambda:True)
    (isolated/'.vision').mkdir();(isolated/'.vision/weights.json').write_text('{}')
    folder=isolated/'job';folder.mkdir();calls=[]
    def child(j,folder,script,args,output,timeout=600):
        calls.append(script)
        assert script=='reconstruction-worker.py'
        return {'stage':'failed','error':'real shape extraction failed'}
    monkeypatch.setattr(r,'child_job',child)
    j={'removeBackground':True,'cancelRequested':False}
    result=r.generate(j,folder,{'id':'image','path':'actual-input.png'})
    assert result['stage']=='failed' and calls==['reconstruction-worker.py']
    assert j['attempts'][0]['stage']=='failed'


def test_separate_exports_preserve_all_requested_assets(isolated):
    for aid in ('a','b'):
        path=isolated/(aid+'.glb');path.write_bytes(aid.encode())
        r.DB['assets'][aid]={'id':aid,'owner':'one','campusId':'beiyangyuan','imageId':aid,'jobId':aid,'poiId':aid,'sha256':r.sha(path.read_bytes()),'path':str(path)}
    run={'owner':'one','campusId':'beiyangyuan','items':[],'cancelled':False,'deadline':10**12}
    for aid in ('a','b','a'):
        asyncio.run(workflow.execute(run,'model_export',{'assetIds':[aid]},aid))
    assert {item['assetId'] for item in run['exports']}=={'a','b'}


def test_map_reference_points_cannot_supply_height_or_fictitious_length(isolated):
    r.DB['assets']['a']={'id':'a','owner':'one','poiId':'p','campusId':'beiyangyuan','sha256':'sha','extents':[2,1,3]}
    args=dict(assetId='a',anchorLngLat=[117.31,39],headingDeg=0,referenceLengthM=20,referenceAxis='height',referenceSource='map measurement',referenceKind='map_measurement',referenceEvidence=['two observed map endpoints'],referencePoints=[[117.31,39],[117.3102,39]],revision=0,anchorSource='test fixture anchor')
    with pytest.raises(ValueError,match='高度'):r.set_layout('one',r.Layout(**args))
    args['referenceAxis']='width';args['referenceLengthM']=500
    with pytest.raises(ValueError,match='重算距离'):r.set_layout('one',r.Layout(**args))


def test_old_free_text_reference_is_preserved_as_unverified(isolated):
    from backend.reconstruction_evidence import calibration_review
    r.DB['assets']['a']={'id':'a','owner':'one','poiId':'p','campusId':'beiyangyuan','sha256':'sha','extents':[2,1,3]}
    layout=r.set_layout('one',r.Layout(assetId='a',anchorLngLat=[117.31,39],headingDeg=0,referenceLengthM=20,referenceAxis='width',referenceSource='looks about right',revision=0,anchorSource='test fixture anchor'))
    assert layout['calibrationStatus']=='unverified'
    assert calibration_review(r.DB['assets']['a'],layout)['status']=='unverified'


def test_polling_state_excludes_private_or_bulk_trace():
    value=r.public({'id':'r','trace':[{'model':'large'}],'results':{'c':{}},'messages':['private'],'owner':'owner','path':'private','stage':'planning'})
    assert value=={'id':'r','stage':'planning'}
