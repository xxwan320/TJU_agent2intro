"""Offline contract tests; no providers, GPU workers, or production state writes."""
import asyncio
from copy import deepcopy

import pytest

from backend import reconstruction as store
from backend.model import reconstruction_workflow as workflow
from backend.reconstruction_evidence import calibration_review, map_reference_distance, quality_review


@pytest.fixture
def isolated(tmp_path, monkeypatch):
    monkeypatch.setattr(store, 'HOME', tmp_path)
    monkeypatch.setattr(store, 'FILE', tmp_path / 'state.json')
    monkeypatch.setattr(store, 'DB', {k: {} for k in ('sessions', 'images', 'jobs', 'assets', 'layouts', 'runs')})
    monkeypatch.setattr(store, 'ensure_worker', lambda: None)
    return tmp_path


def sample_asset(tmp_path):
    file = tmp_path / 'model.glb'
    file.write_bytes(b'previously validated mesh fixture, not a real reconstruction')
    digest = store.sha(file.read_bytes())
    return {'id': 'a', 'owner': 'owner', 'poiId': 'p', 'campusId': 'beiyangyuan',
            'imageId': 'im', 'jobId': 'j', 'path': str(file), 'sha256': digest,
            'extents': [2.0, 1.0, 3.0], 'qualityReview': {
                'status': 'passed', 'assetSha256': digest, 'reviewer': 'offline reviewer fixture',
                'method': 'source image and front/side/back render comparison fixture',
                'reviewedAt': '2026-09-26T00:00:00+00:00', 'evidence': ['fixture/source-and-renders.png'],
                'checks': {'identity': True, 'mainStructure': True, 'nonCollapsed': True, 'appearance': True},
                'limitations': ['Unseen surfaces are inferred.']}}


def sample_layout(asset):
    return {'assetId': 'a', 'assetVersion': asset['sha256'], 'crs': 'GCJ02', 'revision': 1,
            'reference': {'axis': 'width', 'lengthM': 20, 'source': 'offline fixture user measurement'},
            'metersPerModelUnit': 10, 'dimensionsM': {'width': 20, 'height': 10, 'depth': 30},
            'calibration': {'status': 'verified', 'assetSha256': asset['sha256'],
                'referenceAxis': 'width', 'referenceLengthM': 20, 'modelReferenceLength': 2,
                'sourceKind': 'user_measurement', 'evidence': ['fixture/measured-edge.png'],
                'method': 'User measured complete width and marked its matching model axis.',
                'verifiedAt': '2026-09-26T00:00:00+00:00'}}


def sample_run(asset):
    return {'id': 'run', 'owner': 'owner', 'campusId': 'beiyangyuan',
            'items': [{'poiId': 'p', 'imageId': 'im', 'assetId': 'a', 'jobId': 'j'}],
            'requiredPoiIds': ['p'], 'needsMap': True, 'exports': [{'assetId': 'a'}],
            'applied': {'a': 1}, 'cancelled': False, 'deadline': 10**12, 'trace': [],
            'messages': [], 'results': {}, 'modelCalls': 0, 'toolCalls': 0}


def install_asset(asset):
    store.DB['assets']['a'] = asset
    store.DB['jobs']['j'] = {'id': 'j', 'stage': 'succeeded', 'assetId': 'a'}


def test_quality_requires_hash_bound_complete_review(isolated):
    asset = sample_asset(isolated)
    assert quality_review(asset)['status'] == 'passed'
    asset['qualityReview']['assetSha256'] = 'another model'
    assert quality_review(asset)['status'] == 'unreviewed'
    asset['qualityReview']['assetSha256'] = asset['sha256']
    asset['qualityReview']['checks']['mainStructure'] = False
    assert quality_review(asset)['status'] == 'failed'
    del asset['qualityReview']
    assert quality_review(asset)['status'] == 'unreviewed'


@pytest.mark.parametrize('field,value', [('evidence', []), ('reviewedAt', '2026-09-26'), ('reviewer', ''), ('checks', {})])
def test_quality_cannot_pass_incomplete_review(isolated, field, value):
    asset = sample_asset(isolated)
    asset['qualityReview'][field] = value
    assert quality_review(asset)['status'] != 'passed'


def test_free_text_source_does_not_verify_scale(isolated):
    asset = sample_asset(isolated)
    layout = sample_layout(asset)
    assert calibration_review(asset, layout)['status'] == 'verified'
    del layout['calibration']
    layout['calibrationStatus'] = 'reference_supplied'
    assert calibration_review(asset, layout)['status'] == 'unverified'


def test_scale_rejects_stale_hash_or_wrong_model_correspondence(isolated):
    asset = sample_asset(isolated)
    for target, key, value in [('calibration', 'assetSha256', 'stale'),
                               ('calibration', 'modelReferenceLength', 1),
                               ('calibration', 'referenceAxis', 'depth'),
                               ('dimensionsM', 'height', 999)]:
        layout = sample_layout(asset)
        layout[target][key] = value
        assert calibration_review(asset, layout)['status'] == 'unverified'


def test_map_measurement_checks_two_points_and_real_distance(isolated):
    asset = sample_asset(isolated)
    layout = sample_layout(asset)
    points = [[117.31, 39], [117.311, 39]]
    length = map_reference_distance(points)
    layout['reference'].update(lengthM=length, points=points)
    layout['calibration'].update(sourceKind='map_measurement', referenceLengthM=length)
    layout['metersPerModelUnit'] = length / 2
    layout['dimensionsM'] = {'width': length, 'height': length / 2, 'depth': length * 1.5}
    assert calibration_review(asset, layout)['status'] == 'verified'
    layout['reference']['points'] = [points[0], points[0]]
    assert calibration_review(asset, layout)['status'] == 'unverified'
    layout['reference']['points'] = [[float('nan'), 39], points[1]]
    assert calibration_review(asset, layout)['status'] == 'unverified'


def test_finished_pipeline_cannot_claim_quality_or_scale_completion(isolated):
    asset = sample_asset(isolated)
    install_asset(asset)
    run = sample_run(asset)
    store.DB['layouts']['a'] = sample_layout(asset)
    del asset['qualityReview']
    workflow.finish(run)
    assert run['stage'] == 'partial'
    assert run['outcomes'][0]['acceptance']['pipeline']['status'] == 'passed'
    assert run['outcomes'][0]['acceptance']['quality']['status'] == 'unreviewed'
    assert not run['repairableMissing']  # A model cannot produce its own trusted appearance review.
    asset['qualityReview'] = sample_asset(isolated)['qualityReview']
    del store.DB['layouts']['a']['calibration']
    workflow.finish(run)
    assert run['stage'] == 'partial'
    assert 'estimatedDimensionsM' not in run['outcomes'][0]
    assert '任务部分完成' in run['answer']


def test_reviewed_deliverable_requires_current_scene_revision(isolated):
    asset = sample_asset(isolated)
    install_asset(asset)
    store.DB['layouts']['a'] = sample_layout(asset)
    run = sample_run(asset)
    workflow.finish(run)
    assert run['stage'] == 'succeeded'
    store.DB['layouts']['a']['revision'] = 2
    workflow.finish(run)
    assert run['stage'] == 'partial'
    assert run['outcomes'][0]['acceptance']['placement']['status'] == 'pending'


def test_inspect_rechecks_file_and_reports_separate_verdicts(isolated):
    asset = sample_asset(isolated)
    install_asset(asset)
    run = sample_run(asset)
    (isolated / 'model.glb').write_bytes(b'tampered')
    result = asyncio.run(workflow.execute(run, 'model_inspect', {'assetIds': ['a']}, 'inspect'))
    assert result[0]['acceptance']['pipeline']['status'] == 'failed'
    assert result[0]['acceptance']['scale']['status'] == 'unverified'
    workflow.finish(run)
    assert run['stage'] == 'failed'


def test_resume_reuses_started_tool_budget_and_preserves_partial_artifact(isolated):
    asset = sample_asset(isolated)
    install_asset(asset)
    run = sample_run(asset)
    run.update(modelCalls=8, toolCalls=1, startedTools=['call'], pending=[{
        'id': 'call', 'type': 'function', 'function': {'name': 'model_export', 'arguments': '{"assetIds":["a"]}'}}])
    asyncio.run(workflow.drive(run))
    assert run['toolCalls'] == 1
    assert run['modelCalls'] == 8
    assert 'call' in run['results']
    assert run['stage'] == 'partial'
    assert run['outcomes'][0]['assetId'] == 'a'
    assert run['exports'][0]['assetId'] == 'a'


def test_wait_records_resume_without_resetting_budget(isolated):
    run = sample_run(sample_asset(isolated))
    run.update(modelCalls=3, toolCalls=4)
    asyncio.run(workflow.wait_for(run, lambda: True, 'waiting_jobs'))
    assert [e['event'] for e in run['trace']] == ['wait_started', 'wait_resumed']
    assert (run['modelCalls'], run['toolCalls']) == (3, 4)


def generation_fixture(monkeypatch):
    store.DB['images']['im'] = {'id': 'im', 'owner': 'owner', 'poiId': None, 'campusId': 'beiyangyuan'}
    def submit(owner, image_id, key, **options):
        for job in store.DB['jobs'].values():
            if job['idempotencyKey'] == key:
                return deepcopy(job)
        jid = 'j' + str(len(store.DB['jobs']) + 1)
        job = {'id': jid, 'owner': owner, 'idempotencyKey': key, 'stage': 'queued', 'options': options}
        store.DB['jobs'][jid] = job
        return deepcopy(job)
    monkeypatch.setattr(store, 'submit', submit)
    return {'id': 'run', 'owner': 'owner', 'campusId': 'beiyangyuan', 'items': [],
            'cancelled': False, 'deadline': 10**12, 'trace': [], 'budget': workflow.configured_budget()}


def test_default_generator_parameters_and_durable_retry_budget(isolated, monkeypatch):
    run = generation_fixture(monkeypatch)
    first = asyncio.run(workflow.execute(run, 'reconstruction_submit', {'imageAssetIds': ['im']}, 'first'))[0]
    assert first['options'] == {'generator': 'auto', 'quality': 'standard', 'removeBackground': True}
    repeated = asyncio.run(workflow.execute(run, 'reconstruction_submit', {'imageAssetIds': ['im']}, 'first'))[0]
    assert repeated['id'] == first['id'] and run['inferenceAttempts'] == 1
    store.DB['jobs'][first['id']]['stage'] = 'failed'
    args = {'imageAssetIds': ['im'], 'generator': 'triposr', 'retryReason': 'Hunyuan process failed; retry with the compatible TripoSR provider.'}
    second = asyncio.run(workflow.execute(run, 'reconstruction_submit', args, 'second'))[0]
    assert second['id'] != first['id'] and run['inferenceAttempts'] == 2
    assert len(run['items']) == 1 and len(run['items'][0]['attempts']) == 2
    store.DB['jobs'][second['id']]['stage'] = 'failed'
    with pytest.raises(ValueError, match='一次修复重试'):
        asyncio.run(workflow.execute(run, 'reconstruction_submit', args, 'third'))
    assert len(store.DB['jobs']) == 2


def test_quality_failed_retry_must_change_generation(isolated, monkeypatch):
    run = generation_fixture(monkeypatch)
    first = asyncio.run(workflow.execute(run, 'reconstruction_submit', {'imageAssetIds': ['im']}, 'first'))[0]
    asset = sample_asset(isolated)
    asset['qualityReview']['status'] = 'failed'
    asset['qualityReview']['checks']['mainStructure'] = False
    store.DB['assets']['a'] = asset
    store.DB['jobs'][first['id']].update(stage='succeeded', assetId='a')
    args = {'imageAssetIds': ['im'], 'retryReason': 'The primary geometry collapsed; repeat with a changed model.'}
    with pytest.raises(ValueError, match='必须改变'):
        asyncio.run(workflow.execute(run, 'reconstruction_submit', args, 'same'))
    args['generator'] = 'hunyuan3d-2mini'
    asyncio.run(workflow.execute(run, 'reconstruction_submit', args, 'changed'))
    assert run['inferenceAttempts'] == 2


def test_running_or_unreviewed_job_cannot_request_failure_retry(isolated, monkeypatch):
    run = generation_fixture(monkeypatch)
    asyncio.run(workflow.execute(run, 'reconstruction_submit', {'imageAssetIds': ['im']}, 'first'))
    with pytest.raises(ValueError, match='才允许重试'):
        asyncio.run(workflow.execute(run, 'reconstruction_submit', {'imageAssetIds': ['im'], 'retryReason': 'No actual failure; this must not create an extra GPU job.'}, 'retry'))
    assert len(store.DB['jobs']) == 1


def test_image_inspection_is_real_store_callback_and_scoped(isolated, monkeypatch):
    run = generation_fixture(monkeypatch)
    calls = []
    async def inspect(owner, image_id):
        calls.append((owner, image_id))
        return {'imageAssetId': image_id, 'caption': 'Visible facade fixture', 'status': 'reviewed'}
    monkeypatch.setattr(store, 'inspect_image', inspect, raising=False)
    result = asyncio.run(workflow.execute(run, 'image_inspect', {'imageAssetIds': ['im']}, 'inspect'))
    assert calls == [('owner', 'im')] and result[0]['caption'] == 'Visible facade fixture'
    store.DB['images']['im']['campusId'] = 'weijinlu'
    with pytest.raises(ValueError, match='校区'):
        asyncio.run(workflow.execute(run, 'image_inspect', {'imageAssetIds': ['im']}, 'wrong'))


def test_mixed_goals_require_real_receipts(isolated):
    asset = sample_asset(isolated)
    install_asset(asset)
    store.DB['layouts']['a'] = sample_layout(asset)
    run = sample_run(asset)
    run['requiredClientTools'] = workflow.requested_client_tools('介绍这里，再导航到图书馆，并导出行程，最后用照片建模')
    assert set(run['requiredClientTools']) == {'narration_control', 'route_plan', 'itinerary_export'}
    workflow.finish(run)
    assert run['stage'] == 'partial' and run['repairableMissing']
    run['clientOperations'] = {n: n for n in run['requiredClientTools']}
    run['clientResults'] = {n: {'status': 'completed', 'evidence': [{'type': 'fixture', 'observed': True}]} for n in run['requiredClientTools']}
    workflow.finish(run)
    assert run['stage'] == 'succeeded'


def test_client_ack_validates_call_status_evidence_and_duplicate(isolated):
    from fastapi import HTTPException
    from pydantic import ValidationError
    store.DB['sessions']['token'] = {'id': 'owner'}
    run = sample_run(sample_asset(isolated))
    run.update(stage='waiting_client', clientRequest={'runId': 'run', 'toolCallId': 'call', 'toolName': 'route_plan', 'deadlineAt': '2999-01-01T00:00:00+00:00'})
    store.DB['runs']['run'] = run
    with pytest.raises(ValidationError):
        workflow.ClientAck(toolCallId='call', status='completed', result={'toolCallId': 'call', 'status': 'completed'})
    body = workflow.ClientAck(toolCallId='call', status='completed', result={'toolCallId': 'call', 'status': 'completed', 'evidence': [{'type': 'map_applied', 'observed': {'routeId': 'fixture-route'}}]})
    assert asyncio.run(workflow.client_ack('run', body, 'token'))['duplicate'] is False
    assert asyncio.run(workflow.client_ack('run', body, 'token'))['duplicate'] is True
    run['cancelled'] = True
    with pytest.raises(HTTPException) as error:
        asyncio.run(workflow.client_ack('run', body, 'token'))
    assert error.value.status_code == 409


def test_client_tool_wait_uses_saved_deadline_and_records_failure(isolated):
    run = sample_run(sample_asset(isolated))
    run.update(requiredClientTools=['route_plan'], clientRequest={'runId': 'run', 'toolCallId': 'route', 'toolName': 'route_plan', 'deadlineAt': '2000-01-01T00:00:00+00:00'})
    with pytest.raises(ValueError, match='超时'):
        asyncio.run(workflow.execute(run, 'route_plan', {'poiId': 'p'}, 'route'))
    assert run['clientRequest'] is None


def test_new_budget_config_and_legacy_resume_are_distinct(isolated, monkeypatch):
    for name in ('RECONSTRUCTION_MAX_MODEL_CALLS', 'RECONSTRUCTION_MAX_TOOL_CALLS', 'RECONSTRUCTION_MAX_INFERENCE_ATTEMPTS'):
        monkeypatch.delenv(name, raising=False)
    assert workflow.configured_budget() == {'maxModelCalls': 12, 'maxToolCalls': 36, 'maxItems': 2, 'maxInferenceAttempts': 4, 'maxAttemptsPerItem': 2}
    assert workflow.budget({})['maxModelCalls'] == 8
    with pytest.raises(Exception):
        workflow.Start(message='hello', campusId='beiyangyuan', idempotencyKey='key', context={'unexpected': 'value'})
