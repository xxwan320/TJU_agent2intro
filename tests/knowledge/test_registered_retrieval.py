import asyncio
import time
import httpx
import pytest
from backend.knowledge.retrieval import EvidenceRetriever, SourceRegistry, intent_for


def client(handler):
    return httpx.AsyncClient(transport=httpx.MockTransport(handler))


def test_registered_evidence_filters_and_dates():
    r=EvidenceRetriever();source=r.registry.sources[1]
    text='尚贤石位于天津大学北洋园校区，题字出自赵冷月，取意于墨子尚贤篇。'*4
    page=(source,'尚贤石',text,[], '2015-09-28','https://news.tju.edu.cn/info/1003/89019.htm')
    evidence=r.filter(page,'尚贤石介绍','beiyangyuan','beiyangyuan-shangxian-stone','stable','2026-09-17')
    assert evidence and evidence.publishedAt=='2015-09-28' and not evidence.currentApplicable
    assert r.filter((source,'目录','',[],None,page[-1]),'尚贤石','beiyangyuan',None,'stable','2026-09-17') is None
    assert r.filter((source,'卫津路',('卫津路校区闭馆公告。'*12),[],None,page[-1]),'闭馆公告','beiyangyuan',None,'current_rule','2026-09-17') is None
    assert not r.registry.match('https://news.tju.edu.cn.evil.test/a','beiyangyuan')
    assert not r.registry.match('http://127.0.0.1/a','beiyangyuan')
    assert not r.registry.match('https://home.lib.tju.edu.cn/','beiyangyuan')


def test_cache_identity_and_route_order():
    r=EvidenceRetriever();key=lambda **kw:r.cache_key(kw.get('q','同问句'),kw.get('c','beiyangyuan'),kw.get('p','a'),'current_rule',kw.get('day','2026-09-17'),kw.get('constraints',{}),['tju-news'])
    baseline=key()
    assert all(baseline!=key(**v) for v in [{'c':'weijinlu'},{'p':'b'},{'day':'2026-09-18'},{'q':'另一问句'},{'constraints':{'avoid':['a']}}])
    assert key(constraints={'mustVisit':['b','a']})==key(constraints={'mustVisit':['a','b']})
    assert key(constraints={'stopIds':['b','a']})!=key(constraints={'stopIds':['a','b']})


def test_singleflight_cancellation_and_failure_cooldown():
    async def run():
        calls=[]
        async def handler(req):
            calls.append(str(req.url));await asyncio.sleep(.04)
            return httpx.Response(503)
        r=EvidenceRetriever(client=client(handler))
        a=asyncio.create_task(r.retrieve('尚贤石','beiyangyuan'))
        b=asyncio.create_task(r.retrieve('尚贤石','beiyangyuan'))
        await asyncio.sleep(.01);a.cancel()
        with pytest.raises(asyncio.CancelledError):await a
        result=await b
        assert result.status=='unavailable' and len(calls)==2  # main + allowed community fallback
        again=await r.retrieve('尚贤石','beiyangyuan')
        assert again.cache_hit and again.status=='unavailable' and len(calls)==2
        await r.client.aclose()
    asyncio.run(run())


def test_shared_deadline_not_reset_and_library_not_no_evidence():
    async def run():
        calls=[]
        async def handler(req):
            calls.append(str(req.url));await asyncio.sleep(2);return httpx.Response(200,text='empty')
        r=EvidenceRetriever(client=client(handler));start=time.monotonic()
        result=await r.retrieve('尚贤石','beiyangyuan',deadline=start+.08)
        assert time.monotonic()-start<.25 and result.status=='timeout' and len(calls)==1
        async def empty(req):return httpx.Response(200,text='<html><title>图书馆</title></html>')
        r=EvidenceRetriever(client=client(empty))
        result=await r.retrieve('今天能进图书馆吗','beiyangyuan')
        assert result.status=='unavailable'
    asyncio.run(run())


def test_community_only_supplements_culture():
    async def run():
        async def handler(req):
            if req.url.host=='wiki.tjubot.cn':return httpx.Response(200,text='<title>尚贤石</title><article>'+('北洋园尚贤石校园文化经验。'*12)+'</article>')
            return httpx.Response(200,text='<html><title>目录</title><a href="/">目录</a></html>')
        r=EvidenceRetriever(client=client(handler))
        result=await r.retrieve('尚贤石介绍','beiyangyuan')
        assert result.evidence and result.evidence[0].provenance['sourceTier']=='community'
        assert '非官方' in result.evidence[0].source().title
        result=await r.retrieve('尚贤石今天开放吗','beiyangyuan')
        assert not result.evidence
    asyncio.run(run())


def test_compound_question_keeps_stable_evidence_and_invalid_tools_fall_back(monkeypatch):
    from backend.model.service import CampusModelService, _user_payload
    from backend.common.config import Settings
    from backend.contracts import ChatRequest
    from backend.model.runtime import runtime
    from backend.knowledge.retrieval import RetrievalResult
    from types import SimpleNamespace
    from uuid import uuid4
    import json
    async def unavailable(*a,**k):return RetrievalResult('unavailable')
    monkeypatch.setattr('backend.model.service.retriever.retrieve',unavailable)
    class Message:
        tool_calls=[SimpleNamespace(id='bad',function=SimpleNamespace(name='search_official',arguments='{bad json'))]
        def model_dump(self,**kw):return {'role':'assistant','tool_calls':[]}
    class Provider:
        async def select_tools(self,r):return Message()
    async def run():
        service=CampusModelService(Settings(),provider=Provider());service.tool_calls_verified=True
        r=ChatRequest(request_id=uuid4(),session_id=uuid4(),mode='campus_qa',campus_id='beiyangyuan',message='北洋园启用年份，以及图书馆今天几点关门？')
        runtime.begin(r.request_id,r.session_id);p=await service.prepare(r)
        assert any(s.id=='beiyangyuan-opened-2015' for s in p.hits)
        payload=json.loads(_user_payload(p))
        assert any(s['id']=='beiyangyuan-opened-2015' for s in payload['retrieved_context_untrusted'])
        assert p.query_meta['parts']=={'stable':'success','current':'unavailable'}
        r=r.model_copy(update={'request_id':uuid4(),'session_id':uuid4(),'message':'请联网介绍尚贤石'})
        runtime.begin(r.request_id,r.session_id);p=await service.prepare(r)
        assert p.query_meta['tool_validation']=='malformed_or_invalid_arguments_rejected'
        assert p.query_meta['tool_calls']==[] and p.query_meta['tool_messages']==[]
    asyncio.run(run())


def test_old_notices_do_not_become_current_and_redirects_release_slots():
    async def run():
        r=EvidenceRetriever();source=r.registry.sources[1]
        text=('北洋园尚贤石参观区域不开放，临时封闭，有效期2025-09-01至2025-09-30。'*4)
        page=(source,'尚贤石临时封闭',text,[],'2025-09-01','https://news.tju.edu.cn/info/1003/89019.htm')
        old=r.filter(page,'尚贤石今天开放吗','beiyangyuan','beiyangyuan-shangxian-stone','current_rule','2026-09-17')
        assert old and not old.currentApplicable and '不开放' in old.text and old.validTo=='2025-09-30'
        assert r.filter(page,'尚贤石今天开放吗','weijinlu',None,'current_rule','2026-09-17') is None
        async def handler(req):
            if req.url.path.endswith('/89019.htm'):return httpx.Response(302,headers={'location':'/info/1003/89020.htm'})
            return httpx.Response(200,text='<title>尚贤石</title><article>'+('北洋园尚贤石由赵冷月题字。'*10)+'</article>')
        r=EvidenceRetriever(client=client(handler));r.slots=asyncio.Semaphore(1)
        result=await r.retrieve('尚贤石','beiyangyuan')
        assert result.status=='success' and result.page_calls==2
        assert result.evidence[0].finalUrl.endswith('/89020.htm')
    asyncio.run(run())
