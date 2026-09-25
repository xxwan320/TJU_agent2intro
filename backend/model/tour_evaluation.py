"""Same-case evaluation entry points. Baseline is loaded from M's immutable commit."""
import importlib.util
import subprocess
import sys
import time
from pathlib import Path
from uuid import uuid4
from backend.common.errors import DomainError
from backend.contracts import ChatResponse, Usage
from backend.r3_contracts import EvaluationRecord
from .runtime import runtime
from .service import model, _private_request
from .privacy import redact_coordinates

BASELINE_COMMIT = '0bf2e4bc8f49a9697878eaf0db614a1017ace5c1'


def baseline_service():
    root = Path(__file__).resolve().parents[2]
    actual = subprocess.check_output(['git','rev-parse','r3-launch'],cwd=root,text=True).strip()
    if actual != BASELINE_COMMIT:
        raise DomainError('BASELINE_MISMATCH', '基线标签不匹配M保存版本', 409)
    source = subprocess.check_output(['git','show',BASELINE_COMMIT+':backend/model/service.py'],cwd=root).decode('utf-8-sig')
    # Avoid the module's global constructor: the saved class/functions are exact,
    # but all evaluation modes share the original authoritative HistoryStore.
    source = source.split('settings=get_settings();model:ModelAdapter=')[0]
    name = 'backend.model._saved_r3_baseline'
    module = importlib.util.module_from_spec(importlib.util.spec_from_loader(name, loader=None))
    sys.modules[name] = module
    exec(compile(source, BASELINE_COMMIT+':backend/model/service.py','exec'), module.__dict__)
    return module.CampusModelService(settings=model.settings, provider=model.provider, history=model.history)


async def compare_entry(mode, request, tour_request=None):
    """direct_glm/baseline use identical R2 request; enhanced additionally needs
    the same case's frozen structured constraints. Each run uses a fresh session.
    No automatic repeats, cross-mode accumulated history, or hidden map calls.
    """
    if mode == 'enhanced':
        from .tour_service import tour_service
        if tour_request is None:
            raise ValueError('enhanced requires the case TourRequest')
        return await tour_service.create(tour_request)
    if mode not in ('direct_glm', 'baseline'):
        raise ValueError('unknown comparison mode')
    request = _private_request(request)
    record = runtime.begin(request.request_id, request.session_id)
    started = time.monotonic()
    try:
        if mode == 'baseline':
            response = await baseline_service().generate(request)
        else:
            answer, usage, name = await model.provider.complete(request.request_id,
                [{'role':'system','content':'你是天津大学校园导游，卫津路和北洋园均指天津大学校区。未知资料须明确未知，不编造开放、路线或事实。'},
                 {'role':'user','content':redact_coordinates(request.message)}])
            response = ChatResponse(request_id=request.request_id,session_id=request.session_id,
                answer=answer,sources=[],model=name,usage=usage,elapsed_ms=(time.monotonic()-started)*1000,actions=[])
        if record.cancel_requested:
            import asyncio
            raise asyncio.CancelledError
        model.commit(request,response)
        runtime.finish(request.request_id,'completed',len(response.answer))
        return response
    except BaseException:
        runtime.finish(request.request_id,'cancelled' if record.cancel_requested else 'failed')
        raise


def evaluation_record(metrics, *, case_id, dataset_version, build_commit, kind, session=None):
    evidence = session.plan.evidence if session else []
    return EvaluationRecord(evaluation_id=uuid4(), case_id=case_id,dataset_version=dataset_version,
        build_commit=build_commit,kind=kind,outcome=metrics.get('outcome','not_tested'),
        task_completed=metrics.get('task_completed'),
        constraint_passed=None if session is None else (False if session.plan.status == 'infeasible' else (None if any(l.duration_s is None or l.campus_access != 'verified' or l.verification != 'verified' for l in session.plan.legs) or session.plan.request.accessibility == 'step_free' else True)),
        evidence_supported=sum(e.relation == 'supports' and e.verification == 'verified' for e in evidence) if session else None,
        evidence_total=len(evidence) if session else None,elapsed_ms=metrics.get('elapsed_ms'),
        solution_id=metrics.get('solution_id'),comparison_group_id=metrics.get('comparison_group_id'),
        web_search_calls=metrics.get('web_calls'),failure_retries=metrics.get('failure_retries'),
        first_content_ms=metrics.get('first_content_ms'),
        first_content_source='nonstream_response' if metrics.get('first_content_ms') is not None else 'unknown',
        model_calls=metrics.get('model_calls'),usage_status=metrics['usage_status'],
        usage=Usage.model_validate(metrics['usage']) if metrics.get('usage') else None,
        unknown_usage_calls=metrics['unknown_usage_calls'],map_operations=metrics.get('map_operations'))
