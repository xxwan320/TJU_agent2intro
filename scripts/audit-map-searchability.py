#!/usr/bin/env python
"""Re-audit AMap searchability for the campus POI directory.

Only rewrites data/knowledge/map_searchability.json: POI records themselves are
never touched. Entries whose latest audit fails simply disappear from the public
directory / navigation paths while staying in the knowledge store.

Usage (backend must be running on 127.0.0.1:8000):
  .venv/bin/python scripts/audit-map-searchability.py [--campus weijinlu] [--only-searchable]

Notes:
- AMap rate-limits bursts; queries are paced and retried with backoff.
- A POI is only reported searchable when a name-matching candidate exists within
  the campus radius. If every query errored, the previous status is kept and the
  row carries a `note` so the run can be repeated later.
"""
from __future__ import annotations

import argparse
import json
import math
import re
import time
import urllib.parse
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
POIS = ROOT / 'data/knowledge/pois.json'
OUTPUT = ROOT / 'data/knowledge/map_searchability.json'
PROXY = 'http://127.0.0.1:8000/api/maps/amap/_AMapService/v3/place/text'
CAMPUS_CENTER = {'weijinlu': (117.175, 39.108), 'beiyangyuan': (117.3138, 38.9978)}
CAMPUS_LABEL = {'weijinlu': '天津大学卫津路校区', 'beiyangyuan': '天津大学北洋园校区'}
RADIUS_M = 2500
PREFIXES = ('天津大学卫津路校区', '天津大学北洋园校区', '天津大学', '卫津路校区', '北洋园校区')
RATE_LIMIT_CODES = {'10003', '10019', '10020', '10021', '10022', '10044'}
QUERY_DELAY = 1.0


def normalize(value: str) -> str:
    text = re.sub(r'[（(][^）)]*[）)]', '', str(value or ''))
    text = re.sub(r'\s+', '', text)
    for prefix in PREFIXES:
        text = text.replace(prefix, '')
    return text.strip('·-—、')


def haversine(lng1: float, lat1: float, lng2: float, lat2: float) -> float:
    radius = 6371000.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = phi2 - phi1
    dlambda = math.radians(lng2 - lng1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return 2 * radius * math.asin(math.sqrt(a))


def search(keywords: str, city: str = '天津') -> tuple[list[dict], str]:
    query = urllib.parse.urlencode({'keywords': keywords, 'city': city, 'citylimit': 'true', 'offset': 25})
    for attempt in range(6):
        try:
            with urllib.request.urlopen(f'{PROXY}?{query}', timeout=20) as response:
                payload = json.load(response)
        except Exception:
            time.sleep(1.5 * (attempt + 1))
            continue
        if payload.get('status') == '1':
            return list(payload.get('pois') or []), 'ok'
        info = str(payload.get('infocode'))
        if info in RATE_LIMIT_CODES:
            time.sleep(1.5 * (attempt + 1))
            continue
        return [], f'amap:{info}'
    return [], 'rate_limited'


def core_name(value: str) -> str:
    text = re.sub(r'[（(][^）)]*[）)]', '', str(value or ''))
    for token in ('天津大学', '北洋园校区', '卫津路校区'):
        text = text.replace(token, '')
    return text.strip()


def campus_candidate(poi: dict, row: dict, campus: str) -> bool:
    """Mirror frontend/transport/interaction.ts campusCandidate."""
    location = row.get('location') or ''
    if ',' not in location:
        return False
    try:
        lng, lat = (float(part) for part in location.split(',', 1))
    except (TypeError, ValueError):
        return False
    if not math.isfinite(lng) or not math.isfinite(lat):
        return False
    center = CAMPUS_CENTER[campus]
    if abs(lng - center[0]) > 0.025 or abs(lat - center[1]) > 0.018:
        return False
    label = str(row.get('name', '')) + ' ' + str(row.get('address', ''))
    if re.search(r'公交|地铁|客运|工业大学|南开大学|师范大学|财经大学', label):
        return False
    if campus == 'beiyangyuan' and '卫津路校区' in label:
        return False
    if campus == 'weijinlu' and re.search(r'北洋园|新校区', label):
        return False
    aliases = [name for name in (poi.get('aliases') or []) if name not in ('图书馆', '食堂', '校门', '主楼', '体育馆')]
    wanted = [core_name(poi.get('name', '')), *(core_name(name) for name in aliases)]
    observed = core_name(row.get('name', ''))
    return any(len(name) >= 2 and name in observed for name in wanted)


def audit(poi: dict, previous: dict | None = None) -> dict:
    previous = previous or {}
    campus = poi['campus_id']
    # Exactly the query the app uses in AmapNavigation.findDestination.
    keyword = CAMPUS_LABEL[campus] + re.sub(r'天津大学|卫津路校区|北洋园校区', '', poi['name']).strip()
    rows, status = search(keyword)
    accepted = [row for row in rows if campus_candidate(poi, row, campus)]
    if accepted:
        return {'poi_id': poi['id'], 'provider': 'amap', 'status': 'searchable',
                'checked_at': str(date.today()), 'provider_candidate_count': len(rows),
                'usable_candidate_count': len(accepted)}
    if status != 'ok':
        if not previous:
            raise RuntimeError(f"Audit unavailable for {poi['id']}: {status}; directory unchanged")
        return {**previous, 'note': f'kept_previous:{status}'}
    return {'poi_id': poi['id'], 'provider': 'amap', 'status': 'not_found',
            'checked_at': str(date.today()), 'provider_candidate_count': len(rows),
            'usable_candidate_count': 0, 'note': '' if status == 'ok' else status}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--campus', choices=sorted(CAMPUS_CENTER))
    parser.add_argument('--only-searchable', action='store_true', help='re-check entries currently marked searchable')
    args = parser.parse_args()

    pois = json.loads(POIS.read_text(encoding='utf-8'))
    previous = {row['poi_id']: row for row in json.loads(OUTPUT.read_text(encoding='utf-8'))} if OUTPUT.exists() else {}
    targets = [p for p in pois if (not args.campus or p['campus_id'] == args.campus)]
    if args.only_searchable:
        targets = [p for p in targets if previous.get(p['id'], {}).get('status') == 'searchable']
    print(f'auditing {len(targets)} POIs')
    rows = []
    for index, poi in enumerate(targets, 1):
        row = audit(poi, previous.get(poi['id']))
        old = previous.get(poi['id'], {}).get('status')
        flag = '' if old in (None, row['status']) else f"  <- {old} -> {row['status']}"
        note = f" [{row['note']}]" if row.get('note') else ''
        print(f"[{index:3d}/{len(targets)}] {poi['id']:38s} {row['status']:10s} usable={row['usable_candidate_count']}{flag}{note}")
        rows.append(row)
        time.sleep(QUERY_DELAY)

    if args.campus or args.only_searchable:
        merged = {**previous}
        merged.update({row['poi_id']: row for row in rows})
        rows = [merged[poi['id']] for poi in pois]
    OUTPUT.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    searchable = sum(1 for row in rows if row['status'] == 'searchable')
    kept = sum(1 for row in rows if str(row.get('note', '')).startswith('kept_previous'))
    print(f'wrote {OUTPUT}: {searchable} searchable / {len(rows)} total, {kept} kept-from-previous (rerun later)')


if __name__ == '__main__':
    main()
