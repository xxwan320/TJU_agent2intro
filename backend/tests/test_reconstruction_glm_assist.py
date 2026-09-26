import asyncio

import pytest
from PIL import Image

from backend import reconstruction as store


@pytest.fixture
def glm_env(tmp_path, monkeypatch):
    monkeypatch.setattr(store, 'HOME', tmp_path)
    monkeypatch.setattr(store, 'FILE', tmp_path / 'state.json')
    monkeypatch.setattr(store, 'DB', {k: {} for k in ('sessions', 'images', 'jobs', 'assets', 'layouts', 'runs')})
    path = tmp_path / 'input.png'
    Image.new('RGB', (96, 64), (120, 130, 140)).save(path)
    image = {'id': 'im', 'owner': 'owner', 'path': str(path), 'sha256': 'a' * 64,
             'poiId': None, 'campusId': 'beiyangyuan',
             'inspection': {'caption': 'a small campus building with a visible front arch'}}
    store.DB['images']['im'] = image
    return image


def test_preflight_can_route_auto_but_preserves_explicit_user_choice(glm_env, monkeypatch):
    async def glm(stage, payload):
        assert stage == 'preflight'
        assert payload['imageFacts']['width'] == 96
        return ({'recommendedProvider': 'hunyuan3d-2mini', 'suitability': 'limited',
                 'reasons': ['主体占画面较小'], 'captureAdvice': '靠近主体拍摄'},
                {'status': 'completed', 'model': 'glm-5.1', 'requestedModel': 'glm-5.1', 'elapsedMs': 25, 'totalTokens': 80, 'requestId': 'fixture-1', 'promptSha256': 'c' * 64})

    monkeypatch.setattr(store, '_glm_json_call', glm)
    advice = asyncio.run(store.glm_reconstruction_preflight(glm_env, 'standard', 'auto', ['triposr', 'hunyuan3d-2mini']))
    assert advice['status'] == 'completed', advice.get('failureField') or advice.get('errorType')
    assert advice['appliedProvider'] == 'hunyuan3d-2mini'
    assert advice['appliedQuality'] == 'standard'
    assert advice['verifiedVisually'] is False

    explicit = asyncio.run(store.glm_reconstruction_preflight(glm_env, 'fast', 'triposr', ['triposr', 'hunyuan3d-2mini']))
    assert explicit['appliedProvider'] == 'triposr'
    assert explicit['appliedQuality'] == 'fast'


def test_post_review_is_advisory_and_does_not_certify_asset(glm_env, monkeypatch):
    asset = {'id': 'asset', 'owner': 'owner', 'sha256': 'b' * 64, 'qualityReview': {'status': 'unreviewed'},
             'projection': {'texture': {'silhouetteIoU': 0.91, 'observedFaceFraction': 0.4}},
             'vertices': 1200, 'faces': 2400, 'generator': 'triposr'}
    store.DB['assets']['asset'] = asset

    async def glm(stage, payload):
        assert stage == 'post_generation_review'
        assert payload['silhouetteIoU'] == 0.91
        return ({'assessment': 'needs_attention', 'issues': ['单图背面缺少证据'],
                 'nextStep': 'add_views', 'reason': '补充相邻角度照片'},
                {'status': 'completed', 'model': 'glm-5.1', 'requestedModel': 'glm-5.1', 'elapsedMs': 30, 'totalTokens': 70, 'requestId': 'fixture-2', 'promptSha256': 'd' * 64})

    monkeypatch.setattr(store, '_glm_json_call', glm)
    store._glm_review_async('owner', 'asset', 'b' * 64)
    assert asset['glmReview']['status'] == 'completed', asset['glmReview'].get('failureField') or asset['glmReview'].get('errorType')
    assert asset['glmReview']['assessment'] == 'needs_attention'
    assert asset['glmReview']['verifiedVisually'] is False
    assert asset['qualityReview']['status'] == 'unreviewed'


def test_create_job_uses_glm_route_for_auto_and_preserves_requested_options(glm_env, monkeypatch):
    calls = {}
    async def glm(stage, payload):
        return ({'recommendedProvider': 'hunyuan3d-2mini', 'suitability': 'good',
                 'reasons': ['可用单图流程'], 'captureAdvice': ''},
                {'status': 'completed', 'model': 'glm-5.1', 'requestedModel': 'glm-5.1', 'elapsedMs': 20, 'totalTokens': 60, 'requestId': 'fixture-3', 'promptSha256': 'e' * 64})

    def fake_submit(owner, image_id, key, background, quality, generator, **kwargs):
        calls.update(owner=owner, image_id=image_id, quality=quality, generator=generator, **kwargs)
        return {'id': 'job-fixture', 'glmPreflight': kwargs['glm_preflight']}

    monkeypatch.setattr(store, 'auth', lambda token: 'owner')
    monkeypatch.setattr(store, 'providers', lambda: ['triposr', 'hunyuan3d-2mini'])
    monkeypatch.setattr(store, '_glm_json_call', glm)
    monkeypatch.setattr(store, 'submit', fake_submit)
    request = store.Submit(imageId='im', idempotencyKey='idempotency', quality='standard', generator='auto')
    response = asyncio.run(store.create_job(request, 'session'))
    assert calls['generator'] == 'hunyuan3d-2mini'
    assert calls['requested_generator'] == 'auto'
    assert calls['quality'] == 'standard'
    assert response['glmPreflight']['status'] == 'completed'


def test_unavailable_glm_falls_back_without_blocking_or_caching_failure(glm_env, monkeypatch):
    glm_env.pop('inspection')
    async def offline(stage, payload):
        raise TimeoutError('gateway unavailable')

    monkeypatch.setattr(store, '_glm_json_call', offline)
    advice = asyncio.run(store.glm_reconstruction_preflight(glm_env, 'standard', 'auto', ['triposr']))
    assert advice['status'] == 'unavailable'
    assert advice['appliedProvider'] == 'triposr'
    assert advice['verifiedVisually'] is False
    assert advice['callLog']['status'] == 'failed'
    assert advice['callLog']['errorType'] == 'TimeoutError'
    assert advice['callLog']['elapsedMs'] >= 0
    assert not glm_env.get('glmPreflights')


def test_glm_json_parser_rejects_non_object_output():
    assert store._parse_glm_json('```json\n{"ok": true}\n```') == {'ok': True}
    with pytest.raises(ValueError):
        store._parse_glm_json('["not", "an object"]')


def test_geometry_fallback_only_for_severely_incomplete_single_poi_building(monkeypatch):
    monkeypatch.setattr(store, 'providers', lambda: ['hunyuan3d-2mini', 'triposr'])
    job = {'generator': 'hunyuan3d-2mini', 'poiId': 'campus-building', 'inputMode': 'single_image'}
    assert store._needs_geometry_fallback(job, {'stage': 'succeeded', 'geometryAudit': {'volumeToConvexHullRatio': 0.036}})
    assert not store._needs_geometry_fallback(job, {'stage': 'succeeded', 'geometryAudit': {'volumeToConvexHullRatio': 0.64}})
    assert not store._needs_geometry_fallback({**job, 'poiId': None}, {'stage': 'succeeded', 'geometryAudit': {'volumeToConvexHullRatio': 0.036}})
