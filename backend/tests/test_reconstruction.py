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
    monkeypatch.setattr(r,'ROOT',isolated);monkeypatch.setattr(r,'ready',lambda:True)
    r.DB['images']['im']={'id':'im','owner':'one','poiId':'p','campusId':'beiyangyuan','sha256':'abc'}
    first=r.submit('one','im','key');second=r.submit('one','im','key')
    assert first['id']==second['id'] and len(r.DB['jobs'])==1
    with pytest.raises(HTTPException):r.submit('two','im','key')
    r.DB['jobs'][first['id']]['stage']='succeeded'
    assert r.submit('one','im','different')['cacheHit'] is True

def test_cached_asset_is_counted_without_new_job(isolated):
    r.DB['assets']['a']={'id':'a','owner':'one','campusId':'beiyangyuan','imageId':'im','jobId':'j','poiId':'p'}
    run={'owner':'one','campusId':'beiyangyuan','items':[]}
    workflow.run_assets(run,['a']);workflow.run_assets(run,['a'])
    assert len(run['items'])==1 and run['items'][0]['cacheHit'] is True
    assert run['items'][0]['assetId']=='a' and not r.DB['jobs']
