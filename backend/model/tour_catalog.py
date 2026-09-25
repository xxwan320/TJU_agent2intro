"""Read-only projection of D's same catalog; never projects precise locations."""
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from backend.common.errors import DomainError
from backend.knowledge.service import knowledge
from backend.r2_contracts import KnowledgeRecord
from backend.r3_contracts import Evidence
from .privacy import redact_coordinates


def utcnow():
    return datetime.now(timezone.utc)


def timestamp(value):
    try:
        result = datetime.fromisoformat(value.replace('Z', '+00:00'))
        return result if result.tzinfo else result.replace(tzinfo=timezone.utc)
    except (ValueError, AttributeError):
        return None


class TourCatalog:
    def __init__(self, source=knowledge):
        self.source = source

    def poi(self, poi_id, campus):
        poi = self.source.get_poi(poi_id)
        searchable = getattr(self.source, 'is_map_searchable', None)
        visible = getattr(self.source, 'is_frontend_visible', None)
        if (not poi or poi.campus_id != campus or (searchable and not searchable(poi_id))
                or (visible and not visible(poi_id))):
            raise DomainError('VALIDATION_ERROR', '地点不存在或不属于所选校区', 422)
        return poi

    def pois(self, campus):
        result, cursor = [], None
        while True:
            page = self.source.list_pois(campus, None, '', 100, cursor)
            result.extend(p for p in page.items if p.campus_id == campus)
            cursor = page.next_cursor
            if not cursor:
                return result

    def resolve(self, name, campus):
        exact = [p for p in self.pois(campus) if name == p.id or name in [p.name, *p.aliases]]
        return exact

    def evidence(self, poi_id, campus, visit_date=None):
        self.poi(poi_id, campus)
        projection = getattr(self.source, 'get_tour_context', None)
        if projection:
            return [x.evidence.model_copy(deep=True) for x in projection(poi_id, campus, visit_date).evidence][:16]
        # Public extension point for D. Until available, read its existing typed
        # facts file, without mutating the store or treating search hits as proof.
        getter = getattr(self.source, 'tour_evidence', None)
        if getter:
            result = []
            for value in getter(poi_id, campus):
                item = Evidence.model_validate(value.model_dump() if isinstance(value, Evidence) else value)
                item.claim = redact_coordinates(item.claim)
                temporal = any(x in item.claim for x in ('开放', '门禁', '入口', '预约', '通行'))
                if (item.checked_at and item.checked_at > utcnow()) or (item.valid_until and item.valid_until <= utcnow()) or (temporal and item.valid_until is None):
                    item.verification = 'unverified'
                result.append(item)
            return result[:12]
        directory = getattr(self.source, 'data_directory', None)
        if directory is None:
            return []
        try:
            rows = json.loads((Path(directory) / 'facts.json').read_text(encoding='utf-8-sig'))
        except (OSError, ValueError):
            return []
        result = []
        for row in rows:
            fact = KnowledgeRecord.model_validate(row)
            if fact.entity_id != poi_id or fact.campus_id != campus or not fact.sources:
                continue
            checked = timestamp(fact.retrieved_at)
            temporal = any(x in fact.fact + fact.category for x in ('开放', '门禁', '入口', '预约', '通行', '时间', '服务规则'))
            historical = fact.verification_status == 'historical'
            verified = fact.verification_status == 'verified' and checked and checked <= utcnow() and not temporal
            result.append(Evidence(evidence_id=fact.id, source_ref=fact.id,
                claim=redact_coordinates(fact.fact + ('（资料适用：'+fact.applicable_at+'）' if fact.applicable_at else '（适用日期未提供）'))[:500], relation='supports',
                verification='historical' if historical else ('verified' if verified else 'unverified'),
                checked_at=checked, valid_until=None))
        return result[:12]

    def safe_candidate(self, poi):
        return {'poi_id': poi.id, 'name': redact_coordinates(poi.name),
                'category': poi.category, 'description': redact_coordinates(poi.description)[:250]}

    def photo_ids(self):
        """POI ids with a bound reference photo; None when this source has no photo directory."""
        directory = getattr(self.source, 'data_directory', None)
        if directory is None:
            return None
        root = Path(directory).parent / 'reference_photos'
        if not root.is_dir():
            return None
        result = set()
        for campus_dir in root.iterdir():
            if not campus_dir.is_dir():
                continue
            for item in campus_dir.iterdir():
                match = re.match(r'^(.+?)-\d+\.[A-Za-z0-9]+$', item.name)
                if match:
                    result.add(match.group(1))
        return result

    def planning_pois(self, campus):
        """Planning pool: photo-less stops stay out of generated tours."""
        pois = self.pois(campus)
        ids = self.photo_ids()
        return pois if ids is None else [p for p in pois if p.id in ids]


catalog = TourCatalog()
