"""Retrieve local clips by canonical POI, then rank that POI's clips by keywords.

No model call is needed: the directory supplies identity and a local manifest
supplies retrieval text. Unknown names never resolve across campus boundaries.
"""
import json
import re
from pathlib import Path
from urllib.parse import quote

from fastapi import APIRouter, Query
from fastapi.responses import FileResponse
from pydantic import BaseModel

from backend.common.errors import DomainError
from backend.contracts import CampusId
from .service import knowledge

ROOT = Path(__file__).resolve().parents[2]
VIDEO_ROOT = ROOT / 'data' / 'videos'
PUBLIC_ROOT = ROOT / 'frontend' / 'public' / 'assets' / 'campus' / 'videos'
SUFFIXES = {'.mp4': 'video/mp4', '.webm': 'video/webm'}
router = APIRouter(prefix='/api/knowledge/videos', tags=['knowledge-videos'])


class VideoMatch(BaseModel):
    id: str = ''
    poi_id: str
    campus_id: CampusId
    src: str
    mime: str
    caption: str
    kind: str = 'video'
    poster: str | None = None
    source: str | None = None


class VideoResult(BaseModel):
    video: VideoMatch | None = None


def local_file(name: str) -> Path | None:
    if Path(name).name != name or '/' in name or '\\' in name or Path(name).suffix.lower() not in SUFFIXES:
        return None
    for root in (VIDEO_ROOT, PUBLIC_ROOT):
        candidate = (root / name).resolve()
        if candidate.is_relative_to(root.resolve()) and candidate.is_file():
            return candidate
    return None


def retrieve_video(poi_id: str | None, campus_id: CampusId, query: str = '') -> VideoMatch | None:
    pois = knowledge.list_pois(campus_id, None, '', 100, None).items
    poi = next((p for p in pois if p.id == poi_id), None)
    if poi_id is None:
        matches = [p for p in pois if any(name and name in query for name in (p.id, p.name, *p.aliases))]
        # Ambiguity is resolved by the user selecting a place, never guessed.
        if len(matches) == 1:
            poi = matches[0]
    if poi is None:
        return None
    manifest = VIDEO_ROOT / 'manifest.json'
    try:
        rows = json.loads(manifest.read_text(encoding='utf-8')) if manifest.is_file() else []
    except (ValueError, OSError):
        rows = []
    candidates = {}
    indexed_files = {row.get('file') for row in rows if isinstance(row, dict) and isinstance(row.get('file'), str)} if isinstance(rows, list) else set()
    for row in rows if isinstance(rows, list) else []:
        if not isinstance(row, dict) or row.get('poi_id') != poi.id or row.get('campus_id', campus_id) != campus_id or row.get('available') is False:
            continue
        filename = row.get('file', '')
        if not isinstance(filename, str) or not local_file(filename):
            continue
        tags = [row.get('title', ''), row.get('description', ''), *(row.get('keywords', []) if isinstance(row.get('keywords'), list) else [])]
        score = sum(len(tag) for tag in tags if isinstance(tag, str) and tag and tag in query)
        title = row.get('title') if isinstance(row.get('title'), str) else poi.name
        candidates[filename] = (score, title or poi.name)
    for root in (VIDEO_ROOT, PUBLIC_ROOT):
        if root.is_dir():
            for path in root.iterdir():
                if path.name not in indexed_files and re.fullmatch(re.escape(poi.id) + r'-\d+\.(mp4|webm)', path.name, re.IGNORECASE) and local_file(path.name):
                    candidates.setdefault(path.name, (0, poi.name))
    if not candidates:
        return None
    filename = sorted(candidates, key=lambda name: (-candidates[name][0], name))[0]
    meta = next((r for r in rows if isinstance(r, dict) and r.get('poi_id') == poi.id and r.get('file') == filename), {}) if isinstance(rows, list) else {}
    return VideoMatch(id=str(meta.get('id', filename)), poi_id=poi.id, campus_id=campus_id, src='/api/knowledge/videos/file/' + quote(filename),
                      mime=SUFFIXES[Path(filename).suffix.lower()], caption=candidates[filename][1],
                      kind=str(meta.get('kind', 'video')), poster=meta.get('poster'), source=meta.get('source'))


@router.get('/search', response_model=VideoResult)
def search(campus_id: CampusId, poi_id: str | None = Query(None, max_length=120), query: str = Query('', max_length=1000)):
    return VideoResult(video=retrieve_video(poi_id, campus_id, query))


@router.get('/file/{filename}')
def video_file(filename: str):
    path = local_file(filename)
    if path is None:
        raise DomainError('video_not_found', '视频不存在', 404)
    return FileResponse(path, media_type=SUFFIXES[path.suffix.lower()])
