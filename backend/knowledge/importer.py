"""Validate reviewed offline bundles and replace with rollback; never fetch URLs."""
from __future__ import annotations
import argparse
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import shutil
import tempfile
from backend.contracts import Source, Building
from backend.r2_contracts import POI, KnowledgeRecord, CampusAssets
from .service import DATA_DIRECTORY

MANAGED = ("documents.json","buildings.json","pois.json","map_searchability.json","assets.json","SOURCE_REGISTRY.json","facts.json",
           "evidence_metadata.json","service_rules.json","core_routes.json","r3/conflicts.json")
def _rows(directory, name):
    value=json.loads((directory/name).read_text(encoding="utf-8"))
    if not isinstance(value,list) or any(not isinstance(x,dict) for x in value):
        raise ValueError(f"{name}: expected object array")
    return value

def inspect(directory: Path) -> dict[str,int]:
    rows={name:_rows(directory,name) for name in MANAGED}
    for name,data in rows.items():
        identity = {"assets.json": "campus_id", "evidence_metadata.json": "fact_id", "core_routes.json": "poi_id",
                    "map_searchability.json": "poi_id"}.get(name, "id")
        ids = [x.get(identity) for x in data]
        if len(ids)!=len(set(ids)) or any(x is None for x in ids):raise ValueError(f"{name}: invalid/duplicate identity")
    registry={x["id"]:x for x in rows["SOURCE_REGISTRY.json"]}
    for row in registry.values():
        if not row.get("canonical_url","").startswith("https://") or not row.get("retrieved_at"):raise ValueError("invalid source")
    pois={x["id"]:POI.model_validate(x) for x in rows["pois.json"]}
    for poi in pois.values():
        if not poi.source_refs or not set(poi.source_refs)<=registry.keys():raise ValueError("orphan POI source")
    searchability = rows["map_searchability.json"]
    if {row["poi_id"] for row in searchability} != set(pois):
        raise ValueError("map searchability must cover exactly all POIs")
    if any(row.get("provider") != "amap" or row.get("status") not in {"searchable", "not_found"}
           or not row.get("checked_at") or ("frontend_visible" in row and type(row["frontend_visible"]) is not bool)
           for row in searchability):
        raise ValueError("invalid map searchability")
    for row in rows["documents.json"]:
        copy=dict(row)
        for extra in ("aliases","building_id","temporal_note"):copy.pop(extra,None)
        Source.model_validate(copy)
    for row in rows["buildings.json"]:
        copy=dict(row);copy.pop("aliases",None); Building.model_validate(copy)
    for row in rows["facts.json"]:
        f=KnowledgeRecord.model_validate(row)
        if f.entity_id and (f.entity_id not in pois or pois[f.entity_id].campus_id!=f.campus_id):raise ValueError("orphan/cross-campus fact")
        if not f.sources:raise ValueError("fact requires sources")
        for src in f.sources:
            if src.id not in registry or src.url!=registry[src.id]["canonical_url"] or src.campus_id!=f.campus_id:raise ValueError("invalid fact source")
    maps={}
    for row in rows["assets.json"]:
        a=CampusAssets.model_validate({k:v for k,v in row.items() if k!="campus_id"}|{"version":None})
        for item in [*a.maps,*a.media]:
            if item.campus_id!=row["campus_id"]:raise ValueError("cross-campus asset")
            if not item.local_path.startswith("/assets/campus/") or ".." in item.local_path:raise ValueError("invalid asset path")
        for m in a.maps:
            if m.id in maps or not set(m.source_refs)<=registry.keys():raise ValueError("invalid map")
            maps[m.id]=m
    for poi in pois.values():
        pos=poi.schematic_position
        if pos and (pos.map_id not in maps or maps[pos.map_id].campus_id!=poi.campus_id or pos.source_ref not in registry):raise ValueError("invalid schematic reference")
    facts = {f["id"]: f for f in rows["facts.json"]}
    metadata = {r["fact_id"]: r for r in rows["evidence_metadata.json"]}
    rules = {r["id"]: r for r in rows["service_rules.json"]}
    conflicts = {r["id"]: r for r in rows["r3/conflicts.json"]}
    if set(metadata) != set(facts):
        raise ValueError("evidence metadata must cover exactly all facts")
    for meta in metadata.values():
        fact = facts[meta["fact_id"]]
        if set(meta["source_refs"]) != {s["id"] for s in fact["sources"]}:
            raise ValueError("metadata source mismatch")
        if not set(meta["conflict_ids"]) <= conflicts.keys():
            raise ValueError("orphan conflict")
        if any(e not in pois or pois[e].campus_id != fact["campus_id"] for e in meta["entity_ids"]):
            raise ValueError("cross-campus evidence metadata")
        if meta.get("service_rule_id") and meta["service_rule_id"] not in rules:
            raise ValueError("orphan service rule")
        if meta.get("valid_from") and meta.get("valid_until") and meta["valid_until"] < meta["valid_from"]:
            raise ValueError("invalid evidence time range")
    for rule in rules.values():
        if not rule["fact_ids"] or not set(rule["fact_ids"]) <= facts.keys():
            raise ValueError("orphan service evidence")
        if not set(rule["source_refs"]) <= registry.keys():
            raise ValueError("orphan service source")
        if not set(rule["conflict_ids"]) <= conflicts.keys():
            raise ValueError("orphan rule conflict")
        for fid in rule["fact_ids"]:
            if metadata[fid].get("service_rule_id") != rule["id"] or facts[fid]["campus_id"] not in rule["campus_ids"]:
                raise ValueError("invalid service projection")
        if set(rule["entity_ids"]) != {e for fid in rule["fact_ids"] for e in metadata[fid]["entity_ids"]}:
            raise ValueError("service entity mismatch")
    for row in rows["core_routes.json"]:
        if row["poi_id"] not in pois or pois[row["poi_id"]].campus_id != row["campus_id"]:
            raise ValueError("invalid core identity")
        if not set(row["name_evidence_ids"]) <= facts.keys() or not set(row["service_rule_ids"]) <= rules.keys():
            raise ValueError("invalid core evidence")
        for fid in row["name_evidence_ids"]:
            if facts[fid]["entity_id"] != row["poi_id"]:
                raise ValueError("core name evidence mismatch")
        if not set(row["road_source_refs"] + row["entrance_source_refs"]) <= registry.keys():
            raise ValueError("orphan core source")
        if row["road_access"] == "verified" and not row["field_checked_at"]:
            raise ValueError("road verification needs field check")
    for conflict in conflicts.values():
        if not set(conflict["source_refs"]) <= registry.keys():
            raise ValueError("orphan conflict source")
    return {name:len(value) for name,value in rows.items()}

def replace_from_staging(staging:Path,dry_run:bool,destination:Path=DATA_DIRECTORY)->dict[str,int]:
    counts=inspect(staging)
    if dry_run:return counts
    destination=destination.resolve(); staging=staging.resolve()
    if staging==destination:raise ValueError("staging must differ from destination")
    # Validate before creating or changing any active file. Preserve every complete
    # backup, including the previous one; one-file os.replace is not a transaction.
    destination.mkdir(parents=True,exist_ok=True)
    backup=destination/".backups"/datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
    backup.mkdir(parents=True)
    existed={name:(destination/name).exists() for name in MANAGED}
    for name,present in existed.items():
        if present:
            (backup/name).parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(destination/name,backup/name)
    temporary=Path(tempfile.mkdtemp(prefix=".import-",dir=destination))
    changed=[]
    try:
        for name in MANAGED:
            (temporary/name).parent.mkdir(parents=True, exist_ok=True)
            (destination/name).parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(staging/name,temporary/name)
        for name in MANAGED:
            os.replace(temporary/name,destination/name);changed.append(name)
    except BaseException:
        for name in reversed(changed):
            if existed[name]:shutil.copy2(backup/name,destination/name)
            else:(destination/name).unlink(missing_ok=True)
        raise
    finally:shutil.rmtree(temporary,ignore_errors=True)
    (destination/".last-backup").write_text(str(backup),encoding="utf-8")
    return counts

def restore_last_backup(destination:Path=DATA_DIRECTORY)->None:
    destination=destination.resolve()
    backup=Path((destination/".last-backup").read_text(encoding="utf-8")).resolve()
    if backup.parent!=destination/".backups":raise ValueError("backup outside managed directory")
    inspect(backup)
    replace_from_staging(backup,False,destination)

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--staging",type=Path);parser.add_argument("--dry-run",action="store_true");parser.add_argument("--restore-last-backup",action="store_true")
    args=parser.parse_args()
    if args.restore_last_backup:restore_last_backup();print("restored validated backup")
    else:print(json.dumps(replace_from_staging(args.staging,args.dry_run) if args.staging else inspect(DATA_DIRECTORY),ensure_ascii=False,sort_keys=True))
if __name__=="__main__":main()
