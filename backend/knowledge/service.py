"""Small, local, provenance-preserving campus knowledge adapter.

This module deliberately does not fetch the web at import or query time. The
checked-in JSON corpus contains short, manually verified summaries of official
pages, rather than copies of their text or images. There is no embedding
provider in the selected M0 stack, so retrieval is deterministic keyword,
alias, and Chinese character n-gram matching.
"""
from __future__ import annotations

from dataclasses import dataclass
import base64
import binascii
from hashlib import sha256
import json
from pathlib import Path
import re
import unicodedata
from copy import deepcopy
from typing import Any, Protocol

from backend.contracts import Building, CampusId, KnowledgeStatus, Source
from backend.r2_contracts import CampusAssets, CampusCounts, Coverage, POI, POIPage, KnowledgeRecord


DATA_DIRECTORY = Path(__file__).resolve().parents[2] / "data" / "knowledge"
DOCUMENTS_FILE = DATA_DIRECTORY / "documents.json"
BUILDINGS_FILE = DATA_DIRECTORY / "buildings.json"
POIS_FILE = DATA_DIRECTORY / "pois.json"
ASSETS_FILE = DATA_DIRECTORY / "assets.json"
_TOKEN = re.compile(r"[a-z0-9]+|[\u3400-\u9fff]+", re.IGNORECASE)


class KnowledgeAdapter(Protocol):
    def search(self, query: str, campus_id: CampusId, limit: int) -> list[Source]: ...
    def get_status(self) -> KnowledgeStatus: ...
    def list_buildings(self, campus_id: CampusId) -> list[Building]: ...
    def get_building(self, id: str) -> Building | None: ...
    def list_pois(self, campus_id: CampusId, category: str | None, query: str, limit: int, cursor: str | None) -> POIPage: ...
    def get_poi(self, id: str) -> POI | None: ...
    def get_coverage(self) -> Coverage: ...
    def get_campus_assets(self, campus_id: CampusId) -> CampusAssets: ...
    def resolve_entities(self, query: str, campus_id: CampusId) -> list[str]: ...
    def get_evidence_record(self, reference: str) -> dict | None: ...
    def get_service_rules(self, campus_id: CampusId, poi_id: str | None = None) -> list[dict]: ...
    def get_core_bundle(self, campus_id: CampusId) -> dict: ...


@dataclass(frozen=True)
class _Document:
    source: Source
    aliases: tuple[str, ...]
    building_id: str | None
    temporal_note: str | None


def _tokens(value: str) -> set[str]:
    """Return Latin words and CJK bigrams, avoiding one-character false hits."""
    tokens: set[str] = set()
    for part in _TOKEN.findall(value.lower()):
        if part[0].isascii():
            tokens.add(part)
        else:
            tokens.update(part[index:index + 2] for index in range(len(part) - 1))
    return tokens


def _load_array(path: Path) -> list[dict[str, Any]]:
    try:
        parsed = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return []
    return parsed if isinstance(parsed, list) else []


class LocalKnowledge:
    """Read a portable JSON corpus once; malformed rows are ignored safely."""

    def __init__(self, data_directory: Path = DATA_DIRECTORY):
        self.data_directory = data_directory
        self._documents: list[_Document] = []
        self._buildings: dict[str, Building] = {}
        self._building_aliases: dict[str, tuple[str, ...]] = {}
        self._pois: dict[str, POI] = {}
        self._assets: dict[str, CampusAssets] = {}
        self._facts: list[KnowledgeRecord] = []
        self._registry: dict[str, dict] = {}
        self._evidence_metadata: dict[str, dict] = {}
        self._service_rules: list[dict] = []
        self._core_routes: list[dict] = []
        self._conflicts: dict[str, dict] = {}
        self._version: str | None = None
        self._updated_at: str | None = None
        self._load()

    def get_tour_context(self, poi_id, campus_id, visit_date=None):
        from .tour_projection import context
        return context(self, poi_id, campus_id, visit_date)

    def get_tour_route_costs(self, request):
        from .tour_projection import route_costs
        return route_costs(self, request)

    def _load(self) -> None:
        documents_path = self.data_directory / DOCUMENTS_FILE.name
        buildings_path = self.data_directory / BUILDINGS_FILE.name
        pois_path = self.data_directory / POIS_FILE.name
        assets_path = self.data_directory / ASSETS_FILE.name
        raw_documents = _load_array(documents_path)
        raw_buildings = _load_array(buildings_path)
        raw_pois = _load_array(pois_path)
        raw_assets = _load_array(assets_path)
        self._registry = {row["id"]: row for row in _load_array(self.data_directory / "SOURCE_REGISTRY.json") if isinstance(row, dict) and "id" in row}
        self._evidence_metadata = {r['fact_id']: r for r in _load_array(self.data_directory / 'evidence_metadata.json')}
        self._service_rules = _load_array(self.data_directory / 'service_rules.json')
        self._core_routes = _load_array(self.data_directory / 'core_routes.json')
        self._conflicts = {r['id']: r for r in _load_array(self.data_directory / 'r3/conflicts.json')}
        for row in raw_buildings:
            if not isinstance(row, dict):
                continue
            aliases = row.pop("aliases", [])
            try:
                building = Building.model_validate(row)
            except (TypeError, ValueError):
                continue
            self._buildings[building.id] = building
            self._building_aliases[building.id] = tuple(str(a) for a in aliases if isinstance(a, str))
        for row in raw_documents:
            if not isinstance(row, dict):
                continue
            aliases = row.pop("aliases", [])
            building_id = row.pop("building_id", None)
            temporal_note = row.pop("temporal_note", None)
            try:
                source = Source.model_validate(row)
            except (TypeError, ValueError):
                continue
            self._documents.append(_Document(
                source=source,
                aliases=tuple(str(a) for a in aliases if isinstance(a, str)),
                building_id=building_id if isinstance(building_id, str) else None,
                temporal_note=temporal_note if isinstance(temporal_note, str) else None,
            ))
        for row in raw_pois:
            if not isinstance(row, dict):
                continue
            try:
                poi = POI.model_validate(row)
            except (TypeError, ValueError):
                continue
            # IDs are canonical identity; retaining only one row makes repeated
            # imports idempotent and prevents alias duplicates from entering the
            # public directory.
            self._pois.setdefault(poi.id, poi)
        for row in raw_assets:
            if not isinstance(row, dict):
                continue
            campus_id = row.get("campus_id")
            if campus_id not in ("weijinlu", "beiyangyuan"):
                continue
            try:
                self._assets[campus_id] = CampusAssets.model_validate({
                    "maps": row.get("maps", []), "media": row.get("media", []), "version": None,
                })
            except (TypeError, ValueError):
                continue
        for row in _load_array(self.data_directory / "facts.json"):
            fact = KnowledgeRecord.model_validate(row)
            self._facts.append(fact)
            source = fact.sources[0].model_copy(update={"id": fact.id, "title": fact.title, "snippet": fact.fact})
            self._documents.append(_Document(source, tuple(fact.aliases), fact.entity_id, fact.applicable_at))
        for poi in self._pois.values():
            registered = next((self._registry[x] for x in poi.source_refs if x in self._registry), None)
            if registered:
                self._buildings[poi.id] = Building(id=poi.id, title=poi.name, campus_id=poi.campus_id, summary=poi.description,
                    url=registered["canonical_url"], published_at=None, retrieved_at=registered["retrieved_at"], coordinates=None)
                self._building_aliases[poi.id] = tuple(poi.aliases)
        if not self._documents and not self._buildings and not self._pois:
            return
        # Canonical JSON is portable across LF/CRLF. Evidence changes also
        # invalidate the public version and all bound pagination cursors.
        names = ("documents.json", "buildings.json", "pois.json", "assets.json",
                 "facts.json", "SOURCE_REGISTRY.json", "evidence_metadata.json",
                 "service_rules.json", "core_routes.json", "r3/conflicts.json")
        payload = {name: _load_array(self.data_directory / name) for name in names}
        encoded = json.dumps(payload, ensure_ascii=False, sort_keys=True, separators=(",", ":")).encode()
        self._version = f"sha256:{sha256(encoded).hexdigest()[:12]}"

        dates = [document.source.retrieved_at for document in self._documents]
        dates.extend(building.retrieved_at for building in self._buildings.values())
        self._updated_at = max(dates, default=None)

    def get_status(self) -> KnowledgeStatus:
        ready = bool(self._documents or self._buildings)
        return KnowledgeStatus(
            status="ready" if ready else "unavailable",
            version=self._version if ready else None,
            document_count=len(self._documents),
            building_count=len(self._buildings),
            updated_at=self._updated_at if ready else None,
        )

    def list_buildings(self, campus_id: CampusId) -> list[Building]:
        return [building for building in self._buildings.values() if building.campus_id == campus_id]

    def get_building(self, id: str) -> Building | None:
        return self._buildings.get(id)

    def _filter_digest(self, campus_id, category, query):
        return sha256(json.dumps([self._version, campus_id, category, query], ensure_ascii=False).encode()).hexdigest()[:24]

    def _cursor(self, campus_id: CampusId, category: str | None, query: str, offset: int) -> str:
        payload = json.dumps({"f": self._filter_digest(campus_id, category, query), "o": offset}, separators=(",", ":"))
        digest = sha256(payload.encode()).hexdigest()[:12]
        return base64.urlsafe_b64encode(f"{digest}.{payload}".encode()).decode().rstrip("=")

    def _parse_cursor(self, cursor: str, campus_id: CampusId, category: str | None, query: str) -> int:
        try:
            if len(cursor) > 256: raise ValueError
            decoded = base64.b64decode(cursor + "=" * (-len(cursor) % 4), altchars=b"-_", validate=True).decode()
            digest, payload = decoded.split(".", 1)
            parsed = json.loads(payload)
            if digest != sha256(payload.encode()).hexdigest()[:12]: raise ValueError
            if not isinstance(parsed, dict) or set(parsed) != {"f", "o"}: raise ValueError
            if parsed["f"] != self._filter_digest(campus_id, category, query): raise ValueError
            offset = parsed["o"]
            if type(offset) is not int or not 0 <= offset <= len(self._pois): raise ValueError
            return offset
        except (ValueError, UnicodeDecodeError, binascii.Error, TypeError):
            raise ValueError("invalid_cursor") from None

    def list_pois(self, campus_id: CampusId, category: str | None, query: str, limit: int, cursor: str | None) -> POIPage:
        query = query.strip().lower()
        offset = self._parse_cursor(cursor, campus_id, category, query) if cursor else 0
        candidates = [p for p in self._pois.values() if p.campus_id == campus_id and (category is None or p.category == category)]
        if query:
            resolved = set(self.resolve_entities(query, campus_id))
            direct = [p for p in candidates if p.id in resolved or any(query in x.lower() for x in (p.id,p.name,*p.aliases))]
            candidates = direct or [p for p in candidates if len(_tokens(query) & _tokens(" ".join((p.name,*p.aliases,p.description)))) >= 2]
        if query and self._campus_conflict(query, campus_id):
            candidates = []
        candidates.sort(key=lambda p: (0 if query and query in [p.name.lower(),*[x.lower() for x in p.aliases]] else 1,p.id))
        page = candidates[offset:offset + limit]
        following = offset + len(page)
        return POIPage(items=page,total=len(candidates),next_cursor=self._cursor(campus_id,category,query,following) if following < len(candidates) else None,version=self._version)

    def get_poi(self, id: str) -> POI | None:
        return self._pois.get(id)

    def get_coverage(self) -> Coverage:
        campuses = []
        for campus in ("weijinlu","beiyangyuan"):
            pois = [p for p in self._pois.values() if p.campus_id == campus]
            verified = [p for p in pois if p.location and p.location.quality != "pending"
                        and p.location.verified_at and p.location.coordinate_source
                        and p.verification_status == "verified"]
            campuses.append(CampusCounts(campus_id=campus, facts=sum(f.campus_id==campus for f in self._facts),
                pois=len(pois), verified_coordinates=len(verified),
                usable_media=len(self.get_campus_assets(campus).media)))
        urls = {d.source.url for d in self._documents}
        urls.update(r["canonical_url"] for r in self._registry.values())
        return Coverage(status="ready" if self._version else "not_implemented",version=self._version,
                        source_pages=len(urls),fact_count=len(self._facts) if self._facts else None,
                        chunk_count=0,campuses=campuses)

    def get_campus_assets(self, campus_id: CampusId) -> CampusAssets:
        assets = self._assets.get(campus_id, CampusAssets(maps=[], media=[], version=None))
        return assets.model_copy(update={"version": self._version})

    def get_assets(self, campus_id: CampusId) -> CampusAssets:
        return self.get_campus_assets(campus_id)

    def _score(self, document: _Document, query: str, query_tokens: set[str]) -> int:
        searchable = " ".join((
            document.source.title, document.source.snippet, document.source.id,
            document.building_id or "", *document.aliases,
        )).lower()
        document_tokens = _tokens(searchable)
        score = len(query_tokens & document_tokens)
        if query.lower() in searchable:
            score += 8
        if document.building_id:
            building = self._buildings.get(document.building_id)
            if building:
                fields = " ".join((building.id, building.title, *self._building_aliases.get(building.id, ()))).lower()
                building_tokens = _tokens(fields)
                # The document already carries its factual wording. Building
                # metadata adds only identifier/alias context; duplicating its
                # individual-character score would make unrelated 东 matches win.
                score += len(query_tokens & building_tokens - document_tokens)
                if query.lower() in fields:
                    score += 8
        return score

    @staticmethod
    def _normalize(text: str) -> str:
        return re.sub(r"\s+", "", unicodedata.normalize("NFKC", text).casefold())

    def _campus_conflict(self, query: str, campus_id: CampusId) -> bool:
        labels = {"weijinlu": ("卫津路", "老校区", "七里台"),
                  "beiyangyuan": ("北洋园", "新校区")}
        local = any(x in query for x in labels[campus_id])
        foreign = any(x in query for c, names in labels.items() if c != campus_id for x in names)
        if foreign and not local:
            return True
        return bool(self.resolve_entities(query, "beiyangyuan" if campus_id == "weijinlu" else "weijinlu")
                    and not self.resolve_entities(query, campus_id))

    def resolve_entities(self, query: str, campus_id: CampusId) -> list[str]:
        """Resolve longest alias spans while preserving multiple candidates."""
        query = self._normalize(query).replace("海棠季", "")
        matches = []
        for poi in self._pois.values():
            if poi.campus_id != campus_id:
                continue
            names = (poi.id, poi.name, *poi.aliases, *re.split(r"[（()）]", poi.name))
            for name in names:
                name = self._normalize(name)
                if len(name) < 2 or name in ("图书馆", "食堂"):
                    continue
                for match in re.finditer(re.escape(name), query):
                    if name[0].isdigit() and match.start() and query[match.start()-1].isdigit():
                        continue
                    matches.append((match.start(), match.end(), poi.id))
        retained = [m for m in matches if not any(a <= m[0] and b >= m[1] and b-a > m[1]-m[0]
                                                 for a,b,_ in matches)]
        ids = {pid for _,_,pid in retained}
        named_categories = {self._pois[pid].category for pid in ids}
        for word, category in (("图书馆", "library"), ("食堂", "dining")):
            if word in query and category not in named_categories:
                ids.update(p.id for p in self._pois.values() if p.campus_id == campus_id and p.category == category)
        return sorted(ids)

    def get_evidence_record(self, reference: str) -> dict | None:
        """Local read helper for C; source existence is not claim support."""
        fact = next((f for f in self._facts if f.id == reference), None)
        if fact:
            metadata = self._evidence_metadata.get(reference, {})
            return deepcopy({"kind": "fact", "record": fact.model_dump(), "metadata": metadata,
                             "conflicts": [self._conflicts[c] for c in metadata.get("conflict_ids", []) if c in self._conflicts],
                             "data_version": self._version})
        if reference in self._registry:
            return deepcopy({"kind": "source", "record": self._registry[reference], "data_version": self._version})
        return None

    def get_service_rules(self, campus_id: CampusId, poi_id: str | None = None) -> list[dict]:
        return deepcopy([r for r in self._service_rules if campus_id in r["campus_ids"]
                         and (poi_id is None or poi_id in r["entity_ids"])])

    def get_core_bundle(self, campus_id: CampusId) -> dict:
        rows = []
        for row in self._core_routes:
            poi = self.get_poi(row["poi_id"])
            if row["campus_id"] == campus_id and poi and poi.campus_id == campus_id:
                rows.append({"poi": poi.model_dump(), "audit": deepcopy(row)})
        return {"data_version": self._version, "campus_id": campus_id, "items": rows,
                "rules": self.get_service_rules(campus_id), "field_verified": False}

    def search(self, query: str, campus_id: CampusId, limit: int) -> list[Source]:
        query = self._normalize(query)
        query_tokens = _tokens(query)
        if not query_tokens or limit <= 0 or self._campus_conflict(query, campus_id):
            return []
        entities = set(self.resolve_entities(query, campus_id))
        history = any(x in query for x in ("改造", "重新开放", "始建", "命名", "建成", "扩建", "捐资", "设计", "历史", "哪年", "何年"))
        service = not history and any(x in query for x in (
            "几点", "开放", "营业", "门禁", "施工", "预约", "入馆", "进校", "入校", "校园卡",
            "证件", "陪同", "迟到", "轮椅", "行动不便", "饮料", "奶茶", "饮食", "阅览区", "电话", "咨询", "雨天", "休息", "座位", "清真", "卫生间"))
        current = any(x in query for x in ("今天", "明天", "后天", "下周", "本周", "现在", "目前", "当前", "今晚", "实时", "当日"))
        operational = service or any(x in query for x in ("能进", "能去", "能过", "能走", "通行", "施工", "关门"))
        dated = re.findall(r"20[0-9]{2}(?:[-年][0-9]{1,2}[-月][0-9]{1,2}日?)?", query)
        explicit_guidance = any(x in query for x in ("指南", "规定", "报道", "通知", "海棠季", "暑期", "2024"))
        if (current and operational) or (operational and any(len(d) > 4 for d in dated) and not explicit_guidance):
            return []
        if any(x in query for x in ("施工", "卫生间", "厕所", "洗手间", "无障碍通道", "轮椅通行", "遮雨连廊")):
            return []
        if operational and not service:
            return []
        directory = not service and not history
        ranked = []
        for index, document in enumerate(self._documents):
            if document.source.campus_id != campus_id:
                continue
            meta = self._evidence_metadata.get(document.source.id, {})
            is_rule = meta.get("claim_type") in ("published_rule", "historical_rule")
            if service != is_rule and (service or is_rule):
                continue
            if service and any(x in query for x in ("几点", "开门", "营业时间", "开放时间")):
                if not any(x in document.source.title for x in ("时段", "开放", "闭馆")):
                    continue
            associated = set(meta.get("entity_ids", [])) | ({document.building_id} if document.building_id else set())
            if entities and associated and not (associated & entities):
                continue
            if service and dated and not any(d[:4] in (document.temporal_note or "") for d in dated):
                continue
            score = self._score(document, query, query_tokens)
            if associated & entities:
                score += 20
            if score < 2:
                continue
            score += 3 * len(query_tokens & _tokens(document.source.title))
            if directory and document.source.id.startswith("poi-"):
                score += 12
            ranked.append((score, index, document.source))
        return [source for _,_,source in sorted(ranked, key=lambda r: (-r[0],r[1]))][:limit]


class UnavailableKnowledge(LocalKnowledge):
    def __init__(self):
        super().__init__(Path("__no_knowledge_data__"))


knowledge: KnowledgeAdapter = LocalKnowledge()
