import base64,hashlib,json,shutil
from pathlib import Path
import pytest
from fastapi.testclient import TestClient
from backend.app import app
from backend.knowledge.service import LocalKnowledge,DATA_DIRECTORY
from backend.knowledge import importer
from backend.knowledge.evaluate import evaluate

def test_all_pois_have_same_identity_in_legacy_projection():
    k=LocalKnowledge()
    for campus in ("weijinlu","beiyangyuan"):
        page=k.list_pois(campus,None,"",100,None)
        assert {p.id for p in page.items}=={b.id for b in k.list_buildings(campus)}
        assert all(k.get_building(p.id).campus_id==campus for p in page.items)
    assert k.get_poi("beiyangyuan-zhengdong-library") is not None
    assert k.search("三问桥","beiyangyuan",5)
    assert k.search("春水图书馆","weijinlu",5)

def test_long_chinese_query_round_trip_all_pages():
    c=TestClient(app); params=dict(campus_id="beiyangyuan",query="天津大学北洋园校区图书馆和食堂的相对位置在哪里",limit=1)
    ids=set(); total=None
    while True:
        response=c.get("/api/knowledge/pois",params=params)
        assert response.status_code==200
        data=response.json(); total=data["total"]
        for p in data["items"]:
            assert p["id"] not in ids;ids.add(p["id"])
        if not data["next_cursor"]:break
        assert len(data["next_cursor"])<=256
        params["cursor"]=data["next_cursor"]
    assert len(ids)==total and total>1

@pytest.mark.parametrize("payload",["[]","null","42",'{"f":"x","o":true}','{"f":"x","o":-1}'])
def test_malformed_cursors_are_domain_errors(payload):
    digest=hashlib.sha256(payload.encode()).hexdigest()[:12]
    token=base64.urlsafe_b64encode((digest+"."+payload).encode()).decode().rstrip("=")
    assert TestClient(app).get("/api/knowledge/pois",params={"campus_id":"weijinlu","cursor":token}).status_code==400

def test_coverage_counts_records_not_legacy_summaries():
    k=LocalKnowledge(); facts=json.loads((DATA_DIRECTORY/"facts.json").read_text(encoding="utf-8"))
    assert k.get_coverage().fact_count==len(facts)
    assert len(facts)>=200
    assert len({(f["campus_id"], f["fact"]) for f in facts})==len(facts)
    assert k.get_coverage().fact_count==sum(c.facts for c in k.get_coverage().campuses)
    assert k.get_coverage().source_pages==22
    assert sum(c.verified_coordinates for c in k.get_coverage().campuses)==0

def test_historical_maps_are_local_relative_only():
    k=LocalKnowledge()
    for campus in ("weijinlu","beiyangyuan"):
        assets=k.get_campus_assets(campus)
        assert len(assets.maps)==1 and not assets.maps[0].supports_precise_navigation
        points=[p for p in k.list_pois(campus,None,"",100,None).items if p.schematic_position]
        assert len(points)>=10
        assert all(p.schematic_position.map_id==assets.maps[0].id and p.location is None for p in points)
        assert all(p.schematic_position.source_ref=="src-maps-2017" for p in points)

def _copy_bundle(destination):
    destination.mkdir()
    for name in importer.MANAGED:
        (destination/name).parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(DATA_DIRECTORY/name,destination/name)

def test_import_rejects_orphan_before_mutating(tmp_path):
    staging=tmp_path/"staging"; active=tmp_path/"active"
    _copy_bundle(staging);_copy_bundle(active)
    payload=json.loads((staging/"pois.json").read_text(encoding="utf-8"));payload[0]["source_refs"]=["orphan"]
    (staging/"pois.json").write_text(json.dumps(payload),encoding="utf-8")
    before={n:(active/n).read_bytes() for n in importer.MANAGED}
    with pytest.raises(ValueError):importer.replace_from_staging(staging,False,active)
    assert before=={n:(active/n).read_bytes() for n in importer.MANAGED}
    assert not (active/".backups").exists()

def test_import_failure_restores_all_changed_files(tmp_path,monkeypatch):
    staging=tmp_path/"staging";active=tmp_path/"active"
    _copy_bundle(staging);_copy_bundle(active)
    # Different formatting makes the first replacement detectable.
    (staging/"documents.json").write_text(json.dumps(json.loads((staging/"documents.json").read_text(encoding="utf-8"))),encoding="utf-8")
    before={n:(active/n).read_bytes() for n in importer.MANAGED}
    original=importer.os.replace; calls=0
    def failing(source,destination):
        nonlocal calls
        calls+=1
        if calls==2:raise OSError("isolated injected disk failure")
        return original(source,destination)
    monkeypatch.setattr(importer.os,"replace",failing)
    with pytest.raises(OSError):importer.replace_from_staging(staging,False,active)
    assert before=={n:(active/n).read_bytes() for n in importer.MANAGED}
    assert len(list((active/".backups").iterdir()))==1

def test_import_complete_backup_is_restorable(tmp_path):
    staging=tmp_path/"staging";active=tmp_path/"active"
    _copy_bundle(staging);_copy_bundle(active)
    before={n:(active/n).read_bytes() for n in importer.MANAGED}
    importer.replace_from_staging(staging,False,active)
    importer.restore_last_backup(active)
    assert before=={n:(active/n).read_bytes() for n in importer.MANAGED}
    assert len(list((active/".backups").iterdir()))==2

def test_frozen_retrieval_evaluation():
    report=evaluate()
    assert report["evidence_questions"]==40 and report["other_questions"]==10
    assert report["recall_at_5"]>=.85
    assert report["other_pass"]==10
