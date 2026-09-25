import json

from backend.knowledge import videos


def test_video_retrieval_scoped_ranked_and_files_checked(monkeypatch, tmp_path):
    monkeypatch.setattr(videos, 'VIDEO_ROOT', tmp_path)
    monkeypatch.setattr(videos, 'PUBLIC_ROOT', tmp_path / 'public')
    poi = 'weijinlu-09-teaching'
    (tmp_path / f'{poi}-1.mp4').write_bytes(b'fixture')
    (tmp_path / f'{poi}-2.mp4').write_bytes(b'fixture')
    (tmp_path / 'manifest.json').write_text(json.dumps([
        {'poi_id': poi, 'file': f'{poi}-2.mp4', 'title': '建筑故事', 'keywords': ['建筑']},
        {'poi_id': poi, 'file': '../outside.mp4', 'keywords': ['建筑']},
        {'poi_id': poi, 'file': 'missing.mp4', 'keywords': ['建筑']},
    ]), encoding='utf-8')
    assert videos.retrieve_video(poi, 'weijinlu', '介绍建筑').src.endswith('-2.mp4')
    assert videos.retrieve_video(poi, 'weijinlu').src.endswith('-1.mp4')
    assert videos.retrieve_video(poi, 'beiyangyuan') is None
    assert videos.retrieve_video('unknown', 'weijinlu') is None
    assert videos.retrieve_video('weijinlu-old-gym', 'weijinlu') is None
    assert videos.local_file('../outside.mp4') is None
    assert videos.local_file('..\\outside.mp4') is None
    assert videos.retrieve_video(None, 'weijinlu', '第九教学楼').poi_id == poi


def test_empty_or_broken_video_library_is_empty(monkeypatch, tmp_path):
    monkeypatch.setattr(videos, 'VIDEO_ROOT', tmp_path)
    monkeypatch.setattr(videos, 'PUBLIC_ROOT', tmp_path / 'public')
    assert videos.retrieve_video('weijinlu-09-teaching', 'weijinlu') is None
    (tmp_path / 'manifest.json').write_text('broken', encoding='utf-8')
    assert videos.retrieve_video('weijinlu-09-teaching', 'weijinlu') is None


def test_disabled_or_wrong_campus_index_cannot_reappear_through_filename_fallback(monkeypatch, tmp_path):
    monkeypatch.setattr(videos, 'VIDEO_ROOT', tmp_path)
    monkeypatch.setattr(videos, 'PUBLIC_ROOT', tmp_path / 'public')
    poi = 'weijinlu-09-teaching'
    name = f'{poi}-1.mp4'
    (tmp_path / name).write_bytes(b'fixture')
    for metadata in ({'available': False}, {'campus_id': 'beiyangyuan'}):
        (tmp_path / 'manifest.json').write_text(json.dumps([{'poi_id': poi, 'file': name, **metadata}]), encoding='utf-8')
        assert videos.retrieve_video(poi, 'weijinlu') is None
