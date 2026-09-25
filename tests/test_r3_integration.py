"""M independent cross-window checks. Simulated arrivals are never field evidence."""
import asyncio
from uuid import uuid4
import pytest
from fastapi.testclient import TestClient
from backend.app import app
from backend.common.errors import DomainError
from backend.knowledge.service import knowledge
from backend.r3_contracts import TourCommand, TourRequest, TourRestore, PlanRevision
from backend.model.tour_catalog import TourCatalog
from backend.model.tour_planner import Planner
from backend.model.tour_service import TourService
from backend.model.runtime import RuntimeStore
from tests.model.test_tours import request, mutation, command
from tests.model.tour_fixtures import fixture_service, Provider
from backend.model.service import HistoryStore
from types import SimpleNamespace

def test_real_store_projection_http_scope_and_provenance():
    with TestClient(app) as client:
        reply=client.get('/api/knowledge/tour-context/weijinlu-history-museum?campus_id=weijinlu&visit_date=2026-09-15')
        assert reply.status_code==200, reply.text
        context=reply.json()
        assert context['evidence'] and context['requested_date']=='2026-09-15'
        for item in context['evidence']:
            fact=knowledge.get_evidence_record(item['evidence']['source_ref'])
            assert fact and item['source_url'].startswith('http')
            assert item['field_checked_at'] is None
            if item['claim_type']!='stable_fact': assert item['evidence']['verification']!='verified'
        assert client.get('/api/knowledge/tour-context/weijinlu-history-museum?campus_id=beiyangyuan').status_code==422

def test_unknown_ack_skip_identity_and_user_end_not_success():
    async def run():
        service,_=fixture_service()
        s=(await service.create(request())).session
        s=await command(service,s,'check')
        with pytest.raises(DomainError,match='核实'):
            await service.command(s.tour_id,TourCommand(**mutation(s,action='start')))
        s=await command(service,s,'start')
        with pytest.raises(DomainError):
            await service.command(s.tour_id,TourCommand(**mutation(s,action='skip',stop_id=uuid4())))
        old=s.current_stop_id;s=await command(service,s,'skip')
        assert s.current_stop_id!=old and s.progress[0].state=='skipped'
        rid=uuid4()
        result=await service.command(s.tour_id,TourCommand(**{**mutation(s,action='end'),'request_id':rid}))
        assert result.session.completion_reason=='user_ended'
        assert service.metrics[(s.session_id,rid)]['task_completed'] is False
    asyncio.run(run())

def test_formal_constraints_privacy_clarification_and_same_gate_last():
    async def run():
        service,provider=fixture_service()
        req=request(message='了解校史，位置%31%31%37%2E%31%32%33%34',must_visit=['fixture-weijinlu-4'],
            avoid=['fixture-weijinlu-1'],start={'kind':'poi','poi_id':'fixture-weijinlu-2'},end={'kind':'poi','poi_id':'fixture-weijinlu-2'},
            visit_date='2026-09-15',max_walking_minutes=20)
        result=await service.create(req)
        s=result.session;ids=[p.poi_id for p in s.plan.stops]
        assert 'fixture-weijinlu-4' in ids and 'fixture-weijinlu-1' not in ids
        assert ids[-1]=='fixture-weijinlu-2'
        assert '117.1234' not in str(provider.messages) and '%31%' not in s.plan.request.message
        assert s.plan.request.max_walking_minutes==20
        question=await service.create(request(message='文字时长只有30分钟'))
        assert question.clarification_required and question.clarifications
    asyncio.run(run())

def test_current_real_data_simulated_full_loop_and_live_restore_pauses():
    async def run():
        provider=Provider()
        planner=Planner(TourCatalog(knowledge),model_service=SimpleNamespace(provider=provider,history=HistoryStore()))
        service=TourService(planner,RuntimeStore())
        req=TourRequest(request_id=uuid4(),session_id=uuid4(),campus_id='weijinlu',duration_minutes=60,
            message='第一次来天大，希望了解校史，最后回到出发校门',interests=['校史'],
            start={'kind':'poi','poi_id':'weijinlu-09-teaching'},end={'kind':'poi','poi_id':'weijinlu-09-teaching'},
            must_visit=['weijinlu-history-museum'],visit_date='2026-09-15')
        s=(await service.create(req)).session
        assert 3<=len(s.plan.stops)<=5 and s.plan.stops[-1].poi_id=='weijinlu-09-teaching'
        s=await command(service,s,'check');s=await command(service,s,'start')
        s=await command(service,s,'arrive');s=await command(service,s,'explain');s=await command(service,s,'complete_stop')
        completed=s.plan.stops[0].model_dump()
        s=(await service.revise(s.tour_id,PlanRevision(**mutation(s,operation='set_remaining_time',remaining_minutes=30)))).session
        assert s.plan.stops[0].model_dump()==completed
        s=await command(service,s,'next');s=await command(service,s,'save')
        restored=(await service.restore(TourRestore(request_id=uuid4(),session_id=s.session_id,snapshot=s))).session
        assert restored.status=='paused' and restored.state_version>s.state_version
        restored=await command(service,restored,'resume')
        assert restored.progress[0].state=='completed' and restored.remaining_minutes<=30
    asyncio.run(run())

def test_dated_service_question_keeps_published_rule_with_scope():
    from backend.model.service import model
    from backend.r2_contracts import R2ChatRequest
    for text,expected in [
        ('评估日期：2026-09-15。校史馆团体要提前多久预约？','r3-museum-booking'),
        ('评估日期：2026-09-15。郑东图书馆阅览区可以带奶茶吗？','r3-library-food-by')]:
        request=R2ChatRequest(request_id=uuid4(),session_id=uuid4(),message_id=uuid4(),mode='campus_qa',
            campus_id='beiyangyuan' if '郑东' in text else 'weijinlu',message=text)
        hits=model._published_rule_hits(request,[])
        assert expected in [h.id for h in hits]
        assert all('现场未核验' in h.snippet for h in hits)
