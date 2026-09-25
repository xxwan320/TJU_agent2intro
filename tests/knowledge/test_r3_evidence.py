import hashlib
import json
import shutil
from pathlib import Path
import pytest
from backend.knowledge.service import LocalKnowledge, DATA_DIRECTORY
from backend.knowledge import importer
from backend.knowledge.evaluate_r3 import evaluate_development


def copy_bundle(target):
    target.mkdir()
    for name in importer.MANAGED:
        (target / name).parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(DATA_DIRECTORY / name, target / name)


@pytest.mark.parametrize("query,expected", [
    ("请介绍一下北馆", "weijinlu-chunshui-library"),
    ("南馆叫什么", "weijinlu-science-library"),
    ("２５教在哪", "weijinlu-25-teaching"),
    ("曾宪梓楼", "weijinlu-25-teaching"),
])
def test_alias_in_questions_and_legacy_identity(query, expected):
    k = LocalKnowledge()
    assert expected in k.resolve_entities(query, "weijinlu")
    assert any(s.id == "poi-" + expected for s in k.search(query, "weijinlu", 5))
    assert k.get_building(expected).title == k.get_poi(expected).name


def test_generic_categories_are_not_single_campus_aliases():
    k = LocalKnowledge()
    assert set(k.resolve_entities("图书馆", "weijinlu")) == {
        "weijinlu-chunshui-library", "weijinlu-science-library"}
    assert not k.search("卫津路北馆", "beiyangyuan", 5)
    assert "weijinlu-25-teaching" not in k.resolve_entities("125教", "weijinlu")


@pytest.mark.parametrize("query,campus", [
    ("食堂几点开门", "weijinlu"), ("郑东馆下周开放时间", "beiyangyuan"),
    ("2026-09-20校史馆开放吗", "weijinlu"), ("今天三问桥施工吗", "beiyangyuan"),
    ("郑东馆无障碍通道在哪", "beiyangyuan"), ("北馆厕所在哪", "weijinlu"),
    ("北馆现在能进吗", "weijinlu"),
])
def test_no_operational_proof_from_directory_or_expired_notice(query, campus):
    assert LocalKnowledge().search(query, campus, 5) == []


def test_historical_reopening_is_not_live_opening():
    k = LocalKnowledge()
    assert "chunshui-reopened" in {h.id for h in k.search("北馆改造重新开放时间", "weijinlu", 5)}


def test_frozen_development_only():
    report = evaluate_development()
    assert report["legacy"]["evidence_questions"] == 40
    assert report["legacy"]["other_questions"] == 10
    assert report["service_development"] == {
        "evidence_questions": 6, "recall_at_5": 1,
        "no_evidence_questions": 2, "no_evidence_pass": 2}
    assert report["holdout_evaluation"] == "NOT_RUN_BY_D"
    assert all(r["case_id"] not in {"s09", "s10", "s11", "s12"} for r in report["results"])


def test_frozen_questions_unchanged_and_each_gold_has_traceable_basis():
    root = DATA_DIRECTORY / "r3"
    receipt = json.loads((root / "freeze-portability.json").read_text(encoding="utf-8"))
    for name, expected in receipt["sha256_lf"].items():
        assert hashlib.sha256((root/name).read_text(encoding="utf-8").encode()).hexdigest() == expected
    legacy = json.loads((root/"legacy-50.json").read_text(encoding="utf-8"))
    original = json.loads((DATA_DIRECTORY/"evaluation.json").read_text(encoding="utf-8"))
    for before, frozen in zip(original["questions"], legacy["questions"], strict=True):
        assert all(frozen[key] == value for key, value in before.items())
    k = LocalKnowledge()
    extended = json.loads((root/"evaluation-v1.json").read_text(encoding="utf-8"))
    assert sum(c["split"] == "holdout" for c in extended["questions"]) == 8
    # Referential checks only: no holdout query is sent to retrieval or a model.
    for case in legacy["questions"] + extended["questions"]:
        assert case["hard_constraints"]
        for reference in case["source_refs"] + case["relevant_fact_ids"]:
            assert k.get_evidence_record(reference) is not None


def test_metadata_version_is_portable_and_invalidates_when_evidence_changes(tmp_path):
    target = tmp_path / "bundle"; copy_bundle(target)
    original = LocalKnowledge(target).get_status().version
    for name in importer.MANAGED:
        file = target / name
        file.write_bytes(file.read_text(encoding="utf-8").replace("\n", "\r\n").encode())
    assert LocalKnowledge(target).get_status().version == original
    file = target/"evidence_metadata.json"
    rows = json.loads(file.read_text(encoding="utf-8"))
    rows[0]["current_status"] = "changed"
    file.write_text(json.dumps(rows), encoding="utf-8")
    assert LocalKnowledge(target).get_status().version != original


def test_core_evidence_exposes_pending_not_field_verified():
    k = LocalKnowledge()
    for campus, count in (("weijinlu", 42), ("beiyangyuan", 36)):
        bundle = k.get_core_bundle(campus)
        assert len(bundle["items"]) == count and not bundle["field_verified"]
        for row in bundle["items"]:
            assert row["poi"]["id"] == row["audit"]["poi_id"]
            assert row["poi"]["location"] is None
            assert row["audit"]["field_checked_at"] is None
            assert row["audit"]["visitor_access"] == "pending"
            assert row["audit"]["pending_items"]
        bundle["rules"][0]["title"] = "caller mutation"
        assert k.get_service_rules(campus)[0]["title"] != "caller mutation"
    evidence = k.get_evidence_record("r3-museum-personal")
    assert evidence["metadata"]["conflict_ids"] == ["conflict-museum-calendar"]
    assert evidence["conflicts"][0]["status"] == "pending_current_confirmation"


@pytest.mark.parametrize("name,mutate", [
    ("evidence_metadata.json", lambda rows: rows[0].update(entity_ids=["beiyangyuan-east-gate"])),
    ("service_rules.json", lambda rows: rows[0].update(fact_ids=["unknown-fact"])),
    ("core_routes.json", lambda rows: rows[0].update(road_access="verified")),
])
def test_import_rejects_new_provenance_errors_before_write(tmp_path, name, mutate):
    stage = tmp_path/"stage"; active = tmp_path/"active"
    copy_bundle(stage); copy_bundle(active)
    before = {n:(active/n).read_bytes() for n in importer.MANAGED}
    file = stage/name; rows = json.loads(file.read_text(encoding="utf-8")); mutate(rows)
    file.write_text(json.dumps(rows),encoding="utf-8")
    with pytest.raises(ValueError):
        importer.replace_from_staging(stage, False, active)
    assert before == {n:(active/n).read_bytes() for n in importer.MANAGED}


def test_candidates_cannot_be_displayed():
    candidates = json.loads((DATA_DIRECTORY/"media_candidates.json").read_text(encoding="utf-8"))
    for row in candidates:
        assert not row["display_eligible"] and row["local_path"] is None
    k = LocalKnowledge()
    assert all(not k.get_campus_assets(c).media for c in ("weijinlu", "beiyangyuan"))
