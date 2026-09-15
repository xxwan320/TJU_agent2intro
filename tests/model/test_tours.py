import asyncio
from uuid import uuid4
import pytest
from backend.common.errors import DomainError
from backend.r3_contracts import TourRequest,TourCommand,PlanRevision,TourRestore,TourSession
from backend.model.tour_planner import understand
from backend.model.privacy import redact_coordinates
from tests.model.tour_fixtures import fixture_service,Costs


def request(**updates):
    return TourRequest(**dict(dict(request_id=uuid4(),session_id=uuid4(),campus_id='weijinlu',duration_minutes=60,
        interests=['文化'],start={'kind':'unspecified'},end={'kind':'unspecified'}),**updates))

def mutation(s,**fields):
    return dict(request_id=uuid4(),session_id=s.session_id,expected_version=s.plan.version,expected_state_version=s.state_version,**fields)

async def command(service,s,action):
    args=mutation(s,action=action,**({'accept_unverified':True} if action in ('start','resume') else {}))
    if action in ('arrive','explain','complete_stop','skip'):args['stop_id']=s.current_stop_id
    return (await service.command(s.tour_id,TourCommand(**args))).session

async def active(service):
    s=(await service.create(request())).session
    s=await command(service,s,'check')
    return await command(service,s,'start')


def test_lifecycle_revision_completion_and_history():
    async def run():
        service,provider=fixture_service(Costs())
        s=await active(service)
        s=await command(service,s,'arrive');s=await command(service,s,'explain')
        assert service.explanation_context(s.tour_id,s.session_id)['selected_poi_id']==s.plan.stops[0].poi_id
        s=await command(service,s,'complete_stop');completed=s.plan.stops[0].model_dump()
        second=s.plan.stops[1]
        s=(await service.revise(s.tour_id,PlanRevision(**mutation(s,operation='replace_stop',stop_id=second.stop_id,replacement_poi_id='fixture-weijinlu-4')))).session
        assert s.plan.stops[0].model_dump()==completed and s.plan.stops[1].stop_id!=second.stop_id
        s=(await service.revise(s.tour_id,PlanRevision(**mutation(s,operation='set_remaining_time',remaining_minutes=30)))).session
        assert s.plan.stops[0].model_dump()==completed
        for _ in range(2):
            s=await command(service,s,'next');s=await command(service,s,'arrive');s=await command(service,s,'complete_stop')
        assert s.status=='completed' and provider.calls==1
        assert len(service.planner.model_service.history.messages_for(s.session_id,0))==2
        assert all(p.state=='completed' for p in s.progress)
    asyncio.run(run())


def test_idempotency_versions_and_response_copy():
    async def run():
        service,p=fixture_service();body=request();r=await service.create(body)
        r.session.plan.stops[0].title='tampered'
        replay=await service.create(body)
        assert replay.replayed and p.calls==1 and replay.session.plan.stops[0].title!='tampered'
        with pytest.raises(DomainError) as exc:await service.create(body.model_copy(update={'duration_minutes':30}))
        assert exc.value.code=='TOUR_IDEMPOTENCY_CONFLICT'
        s=replay.session;cmd=TourCommand(**mutation(s,action='check'))
        checked=await service.command(s.tour_id,cmd)
        assert (await service.command(s.tour_id,cmd)).replayed
        with pytest.raises(DomainError) as exc:await service.command(s.tour_id,cmd.model_copy(update={'request_id':uuid4()}))
        assert exc.value.code=='TOUR_VERSION_CONFLICT'
        assert checked.session.plan.version==s.plan.version+1
    asyncio.run(run())


@pytest.mark.parametrize('costs,minutes,expected',[(Costs(60),60,'draft'),(Costs(3600),10,'infeasible'),(Costs(1,True),60,'infeasible'),(None,60,'draft')])
def test_feasibility(costs,minutes,expected):
    async def run():
        service,_=fixture_service(costs);s=(await service.create(request(duration_minutes=minutes))).session
        assert s.status==expected
        if costs is None:
            assert all(l.duration_s is None and l.distance_m is None for l in s.plan.legs)
            assert service.planner.schedule(s.plan)[0]['arrival_offset_minutes'] is None
    asyncio.run(run())


@pytest.mark.parametrize('interest',['必去同名','必去不存在','60分钟；不去测试站0；必去测试站0','从同名出发','30分钟'])
def test_clarification_is_batched_before_model(interest):
    async def run():
        service,p=fixture_service();s=(await service.create(request(interests=[interest]))).session
        assert s.plan.warnings and p.calls==0
        if s.status=='draft':
            with pytest.raises(DomainError):await command(service,s,'check')
    asyncio.run(run())


def test_cross_campus_and_unknown_rejected():
    async def run():
        service,p=fixture_service()
        for pid in ('fixture-beiyangyuan-0','missing'):
            with pytest.raises(DomainError):await service.create(request(start={'kind':'poi','poi_id':pid}))
        s=await active(service)
        with pytest.raises(DomainError):await service.revise(s.tour_id,PlanRevision(**mutation(s,operation='replace_stop',stop_id=s.plan.stops[1].stop_id,replacement_poi_id='fixture-beiyangyuan-1')))
    asyncio.run(run())


def test_pause_resume_locked_and_failed_revision_atomic():
    async def run():
        service,_=fixture_service(Costs());s=await active(service)
        with pytest.raises(DomainError):await service.revise(s.tour_id,PlanRevision(**mutation(s,operation='remove_stop',stop_id=s.current_stop_id)))
        s=await command(service,s,'pause')
        s=(await service.revise(s.tour_id,PlanRevision(**mutation(s,operation='remove_stop',stop_id=s.current_stop_id)))).session
        assert len(s.plan.stops)==2
        before=s.model_dump()
        with pytest.raises(DomainError):await service.revise(s.tour_id,PlanRevision(**mutation(s,operation='set_remaining_time',remaining_minutes=0)))
        assert (await service.read(s.tour_id,s.session_id)).model_dump()==before
        s=await command(service,s,'resume');assert s.status=='active'
    asyncio.run(run())


def test_cancel_and_late_provider_cannot_commit():
    async def run():
        service,p=fixture_service();p.wait=asyncio.Event();p.entered=asyncio.Event();p.swallow=True
        body=request();task=asyncio.create_task(service.create(body));await p.entered.wait()
        with pytest.raises(DomainError) as exc:await service.create(body)
        assert exc.value.code=='TOUR_REQUEST_IN_PROGRESS'
        record=service.runtime.get(body.request_id);record.cancel_requested=True;task.cancel()
        with pytest.raises(DomainError) as exc:await task
        assert exc.value.status==499 and not service.tours
        assert not service.planner.model_service.history.messages_for(body.session_id,0)
        with pytest.raises(DomainError):await service.create(body)
        assert p.calls==1
    asyncio.run(run())


def test_restore_revalidates_and_never_rolls_back_live_tour():
    async def run():
        service,_=fixture_service();s=await active(service);s=await command(service,s,'save')
        snapshot=s.model_copy(deep=True);s=await command(service,s,'pause')
        result=await service.restore(TourRestore(request_id=uuid4(),session_id=s.session_id,snapshot=snapshot))
        assert result.session.state_version==s.state_version
        other,_=fixture_service()
        snapshot.plan.stops[0].title='伪造名称';snapshot.plan.evidence[0].claim='伪造事实'
        restored=(await other.restore(TourRestore(request_id=uuid4(),session_id=s.session_id,snapshot=snapshot))).session
        assert restored.tour_id!=s.tour_id and restored.status=='paused'
        assert '伪造' not in restored.model_dump_json()
        snapshot.progress[2].state='completed'
        with pytest.raises(DomainError):await other.restore(TourRestore(request_id=uuid4(),session_id=s.session_id,snapshot=snapshot))
    asyncio.run(run())


def test_ttl_and_pause_clock():
    async def run():
        now=[0.0];service,_=fixture_service(clock=lambda:now[0],ttl=3600)
        s=await active(service);now[0]+=120;s=await command(service,s,'pause');assert s.remaining_minutes==58
        now[0]+=600;s=await command(service,s,'resume');assert s.remaining_minutes==58
        now[0]+=3601
        with pytest.raises(DomainError) as exc:await service.read(s.tour_id,s.session_id)
        assert exc.value.code=='TOUR_EXPIRED'
    asyncio.run(run())


def test_internal_skip_end_and_cancel_terminal():
    async def run():
        service,_=fixture_service();s=await active(service)
        service._transition(s,'skip');assert s.progress[0].state=='skipped'
        service._transition(s,'end');assert s.status=='completed'
        TourSession.model_validate(s.model_dump())
        real=await service.read(s.tour_id,s.session_id);real=await command(service,real,'cancel')
        with pytest.raises(DomainError):await command(service,real,'resume')
    asyncio.run(run())


def test_privacy_and_unknown_usage():
    async def run():
        service,p=fixture_service();body=request(interests=['文化，117.123456,39.123456'])
        result=await service.create(body);s=result.session
        assert '117.123456' not in s.model_dump_json() and '117.123456' not in str(p.messages)
        metrics=service.metrics[(body.session_id,body.request_id)]
        assert metrics['usage'] is None and metrics['unknown_usage_calls']==1
        from backend.model.tour_evaluation import evaluation_record,BASELINE_COMMIT
        record=evaluation_record(metrics,case_id='privacy',dataset_version='fixture-v1',build_commit=BASELINE_COMMIT,kind='fixture',session=s)
        assert record.usage_status=='unknown' and record.task_completed is False
        assert '39.123456' not in redact_coordinates('lat=39.123456 lng=117.123456')
    asyncio.run(run())



def test_model_fabricated_candidate_falls_back_without_external_calls():
    async def run():
        service,p=fixture_service();p.answer='{"poi_ids":["not-real","also-fake","third"]}'
        s=(await service.create(request())).session
        assert all(x.poi_id.startswith('fixture-weijinlu-') for x in s.plan.stops)
        assert any('模型候选' in w for w in s.plan.warnings)
    asyncio.run(run())


def test_must_avoid_remain_constraints_after_revision():
    async def run():
        service,_=fixture_service();s=(await service.create(request(interests=['必去测试站0；不去测试站4']))).session
        target=next(x for x in s.plan.stops if x.poi_id=='fixture-weijinlu-0')
        with pytest.raises(DomainError):await service.revise(s.tour_id,PlanRevision(**mutation(s,operation='remove_stop',stop_id=target.stop_id)))
        other=next(x for x in s.plan.stops if x.poi_id!=target.poi_id)
        with pytest.raises(DomainError):await service.revise(s.tour_id,PlanRevision(**mutation(s,operation='replace_stop',stop_id=other.stop_id,replacement_poi_id='fixture-weijinlu-4')))
    asyncio.run(run())


def test_capacity_has_no_silent_eviction():
    async def run():
        service,_=fixture_service(capacity=1);body=request();s=(await service.create(body)).session
        with pytest.raises(DomainError) as exc:await service.create(request())
        assert exc.value.code=='TOUR_CAPACITY'
        assert (await service.read(s.tour_id,s.session_id)).tour_id==s.tour_id
    asyncio.run(run())


def test_current_evidence_does_not_upgrade_expired_opening():
    from datetime import timedelta
    from tests.model.tour_fixtures import Directory
    from backend.model.tour_catalog import TourCatalog,utcnow
    source=Directory();original=source.tour_evidence
    def facts(pid,campus):
        e=original(pid,campus)[0];e.claim='开放规则';e.valid_until=utcnow()-timedelta(days=1);return [e]
    source.tour_evidence=facts
    assert TourCatalog(source).evidence('fixture-weijinlu-0','weijinlu')[0].verification=='unverified'


def test_mutation_commit_rechecks_version_after_await():
    async def run():
        service,_=fixture_service();s=await active(service)
        original=service.planner.check
        async def delayed(*args,**kwargs):
            value=await original(*args,**kwargs)
            service.tours[s.tour_id].state_version+=1
            return value
        service.planner.check=delayed
        with pytest.raises(DomainError) as exc:await service.revise(s.tour_id,PlanRevision(**mutation(s,operation='set_remaining_time',remaining_minutes=30)))
        assert exc.value.code=='TOUR_VERSION_CONFLICT'
        assert service.tours[s.tour_id].remaining_minutes==60
    asyncio.run(run())


def test_guide_script_binds_current_arrived_station(monkeypatch):
    async def run():
        import backend.model.tour_service as module
        from backend.model.service import _private_request
        from backend.r2_contracts import R2ChatRequest
        service,_=fixture_service();monkeypatch.setattr(module,'tour_service',service)
        s=await active(service)
        req=R2ChatRequest(request_id=uuid4(),session_id=s.session_id,message_id=uuid4(),message='请介绍这里',
            mode='content_generation',campus_id='weijinlu',generation={'type':'guide_script'})
        with pytest.raises(DomainError):_private_request(req)
        s=await command(service,s,'arrive')
        safe=_private_request(req)
        assert safe.selected_poi_id==s.plan.stops[0].poi_id
        req.selected_building_id=s.plan.stops[1].poi_id
        with pytest.raises(DomainError):_private_request(req)
    asyncio.run(run())


def test_frequent_commands_do_not_reset_active_elapsed_time():
    async def run():
        now=[0.0];service,_=fixture_service(clock=lambda:now[0]);s=await active(service)
        now[0]=30;s=await command(service,s,'save');assert s.remaining_minutes==60
        now[0]=60;s=await command(service,s,'save');assert s.remaining_minutes==59
    asyncio.run(run())


def test_expired_request_id_is_not_silently_reexecuted():
    async def run():
        now=[0.0];service,p=fixture_service(clock=lambda:now[0]);body=request()
        await service.create(body);now[0]=3601
        with pytest.raises(DomainError) as exc:await service.create(body)
        assert exc.value.code=='TOUR_EXPIRED' and p.calls==1
    asyncio.run(run())


def test_json_and_encoded_coordinate_values_are_removed():
    from backend.model.privacy import redact_coordinates
    for value in ('{"lat":39.123456,"lng":117.123456}', 'location=117.123456%2C39.123456'):
        safe=redact_coordinates(value)
        assert '117.123456' not in safe and '39.123456' not in safe
