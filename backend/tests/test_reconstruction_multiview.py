"""Multi-view orchestration contracts with CPU/GPU execution replaced by fixtures."""
import asyncio
import json
from copy import deepcopy

import pytest
from fastapi import HTTPException
from pydantic import ValidationError

from backend import reconstruction as store


@pytest.fixture
def group_env(tmp_path, monkeypatch):
    monkeypatch.setattr(store, 'ROOT', tmp_path)
    monkeypatch.setattr(store, 'HOME', tmp_path / 'runtime')
    store.HOME.mkdir()
    monkeypatch.setattr(store, 'FILE', store.HOME / 'state.json')
    monkeypatch.setattr(store, 'DB', {k: {} for k in ('sessions', 'images', 'jobs', 'assets', 'layouts', 'runs')})
    monkeypatch.setattr(store, 'ensure_worker', lambda: None)
    monkeypatch.setattr(store, 'providers', lambda: ['triposr', 'depth-anything-3'])
    monkeypatch.setattr(store, 'multiview_config', lambda: {'provider': 'depth-anything-3', 'technicalInferenceVerified': True, 'maxViews': 4, 'revision': 'fixture'})
    (tmp_path / 'scripts').mkdir()
    (tmp_path / 'scripts/reconstruction-multiview-worker.py').write_text('# fixture')
    for number in range(1, 6):
        iid = 'im' + str(number)
        path = tmp_path / (iid + '.png')
        path.write_bytes(('unique fixture image ' + str(number)).encode())
        store.DB['images'][iid] = {'id': iid, 'owner': 'owner', 'path': str(path), 'poiId': None, 'campusId': 'beiyangyuan'}
    monkeypatch.setattr(store, 'inspect_image_group', lambda owner, ids: {'status': 'connected', 'viewCount': len(ids), 'warnings': [], 'recommendations': []})
    return tmp_path


def test_submit_schema_legacy_and_ordered_group():
    assert store.Submit(imageId='im', idempotencyKey='key').imageIds is None
    assert store.Submit(imageIds=['im2', 'im1'], idempotencyKey='key').imageIds == ['im2', 'im1']
    for payload in ({}, {'imageId': 'one', 'imageIds': ['two']}, {'imageIds': []}, {'imageIds': ['x'] * 13}):
        with pytest.raises(ValidationError):
            store.Submit(idempotencyKey='key', **payload)


def test_joint_group_is_one_job_with_honest_pending_feedback(group_env):
    job = store.submit('owner', None, 'key', imageIds=['im1', 'im2'])
    assert job['generator'] == 'depth-anything-3'
    assert job['removeBackground'] is False
    assert job['imageIds'] == ['im1', 'im2']
    assert job['viewCount'] == 2 and job['inputMode'] == 'multi_view'
    assert job['feedback'] == {'registeredViews': None, 'totalViews': 2, 'coverage': 'unknown', 'coordinateScale': 'unknown', 'warnings': []}
    assert len(store.DB['jobs']) == 1


def test_group_cache_binds_content_and_order(group_env):
    first = store.submit('owner', None, 'first', imageIds=['im1', 'im2'])
    assert store.submit('owner', None, 'same', imageIds=['im1', 'im2'])['id'] == first['id']
    reordered = store.submit('owner', None, 'reordered', imageIds=['im2', 'im1'])
    assert reordered['cacheKey'] != first['cacheKey']
    with pytest.raises(ValueError, match='相同提交标识'):
        store.submit('owner', None, 'first', imageIds=['im2', 'im1'])
    (group_env / 'im2.png').write_bytes(b'changed processed pixels')
    changed = store.submit('owner', None, 'changed', imageIds=['im1', 'im2'])
    assert changed['cacheKey'] != first['cacheKey']


@pytest.mark.parametrize('options, match', [({'generator': 'triposr'}, '只支持单图'), ({'removeBackground': True}, '关闭去背景')])
def test_no_independent_or_background_removed_fake_fusion(group_env, options, match):
    with pytest.raises(ValueError, match=match):
        store.submit('owner', None, 'key', imageIds=['im1', 'im2'], **options)
    assert not store.DB['jobs']


def test_actual_provider_limit_is_enforced(group_env):
    with pytest.raises(ValueError, match='最多处理4张'):
        store.submit('owner', None, 'key', imageIds=['im1', 'im2', 'im3', 'im4', 'im5'])
    assert not store.DB['jobs']


def test_group_owner_campus_and_scene_boundaries(group_env):
    with pytest.raises(HTTPException):
        store.image_group('another owner', ['im1', 'im2'])
    store.DB['images']['im2']['campusId'] = 'weijinlu'
    with pytest.raises(ValueError, match='校区'):
        store.image_group('owner', ['im1', 'im2'])
    store.DB['images']['im2']['campusId'] = 'beiyangyuan'
    store.DB['images']['im1']['poiId'] = 'first-building'
    store.DB['images']['im2']['poiId'] = 'another-building'
    with pytest.raises(ValueError, match='不同地点'):
        store.image_group('owner', ['im1', 'im2'])
    with pytest.raises(ValueError, match='重复'):
        store.image_group('owner', ['im1', 'im1'])


def test_disconnected_features_warn_but_do_not_claim_geometry(group_env, monkeypatch):
    monkeypatch.setattr(store, 'inspect_image_group', lambda owner, ids: {'status': 'disconnected', 'warnings': [], 'recommendations': ['Add intermediate angle']})
    job = store.submit('owner', None, 'key', imageIds=['im1', 'im2'])
    assert job['overlapEvidence']['status'] == 'disconnected'
    assert '几何一致性' in job['feedback']['warnings'][0]
    assert job['feedback']['registeredViews'] is None


def test_duplicate_only_group_is_rejected(group_env, monkeypatch):
    monkeypatch.setattr(store, 'inspect_image_group', lambda owner, ids: {'status': 'duplicate_only', 'warnings': [], 'recommendations': []})
    with pytest.raises(ValueError, match='重复视角'):
        store.submit('owner', None, 'key', imageIds=['im1', 'im2'])
    assert not store.DB['jobs']


def test_generate_passes_ordered_sources_to_joint_worker(group_env, monkeypatch):
    job = store.submit('owner', None, 'key', imageIds=['im2', 'im1'])
    calls = []
    def child(j, folder, script, args, output):
        calls.append((script, json.loads((folder / 'job.json').read_text())))
        return {'stage': 'failed', 'error': 'fixture: no GPU executed'}
    monkeypatch.setattr(store, 'child_job', child)
    store.generate(store.DB['jobs'][job['id']], store.HOME / 'jobs' / job['id'], store.DB['images']['im2'])
    script, payload = calls[0]
    assert script == 'reconstruction-multiview-worker.py'
    assert payload['imageIds'] == ['im2', 'im1']
    assert payload['imagePaths'] == [store.DB['images'][iid]['path'] for iid in ['im2', 'im1']]
    assert payload['viewCount'] == 2 and payload['removeBackground'] is False


def test_public_metadata_never_exposes_source_paths():
    assert store.public({'imagePaths': ['private/path'], 'imageIds': ['safe']}) == {'imageIds': ['safe']}


def test_workflow_group_is_one_budgeted_item_and_resumes(group_env):
    from backend.model import reconstruction_workflow as workflow
    run = {'id': 'run', 'owner': 'owner', 'campusId': 'beiyangyuan', 'items': [], 'cancelled': False, 'deadline': 10**12, 'trace': [], 'budget': workflow.configured_budget()}
    args = {'imageGroups': [{'itemId': 'arbitrary user scene', 'imageAssetIds': ['im1', 'im2', 'im3']}]}
    first = asyncio.run(workflow.execute(run, 'reconstruction_submit', args, 'call'))[0]
    again = asyncio.run(workflow.execute(run, 'reconstruction_submit', args, 'call'))[0]
    assert again['id'] == first['id'] and again['reusedAttempt'] is True
    assert len(run['items']) == 1 and run['inferenceAttempts'] == 1
    assert run['items'][0]['itemId'] == 'arbitrary user scene'
    assert run['items'][0]['imageIds'] == ['im1', 'im2', 'im3']
    store.DB['jobs'][first['id']]['stage'] = 'failed'
    args.update(retryReason='The camera registration failed; replace the third photograph with an intermediate angle.')
    args['imageGroups'][0]['imageAssetIds'] = ['im1', 'im2', 'im4']
    retry = asyncio.run(workflow.execute(run, 'reconstruction_submit', args, 'retry'))[0]
    assert retry['id'] != first['id'] and run['inferenceAttempts'] == 2
    assert len(run['items']) == 1
    store.DB['jobs'][retry['id']]['stage'] = 'failed'
    with pytest.raises(ValueError, match='一次修复重试'):
        asyncio.run(workflow.execute(run, 'reconstruction_submit', args, 'third'))


def test_workflow_rejected_preflight_does_not_spend_inference(group_env):
    from backend.model import reconstruction_workflow as workflow
    run = {'id': 'run', 'owner': 'owner', 'campusId': 'beiyangyuan', 'items': [], 'cancelled': False, 'deadline': 10**12, 'trace': [], 'budget': workflow.configured_budget()}
    with pytest.raises(ValueError, match='只支持单图'):
        asyncio.run(workflow.execute(run, 'reconstruction_submit', {'imageGroups': [{'imageAssetIds': ['im1', 'im2']}], 'generator': 'triposr'}, 'call'))
    assert not run['items'] and not store.DB['jobs']
    assert workflow.inference_attempts(run) == 0
