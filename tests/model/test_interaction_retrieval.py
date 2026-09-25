import asyncio
from uuid import uuid4
from backend.contracts import ChatRequest
from backend.common.config import Settings
from backend.model.service import CampusModelService, stable_local_question
from backend.model.runtime import runtime

def req(message, selected=None):
    return ChatRequest(request_id=uuid4(), session_id=uuid4(), campus_id='beiyangyuan', mode='campus_qa', message=message, selected_building_id=selected)

def test_fixed_five_questions_keep_evidence_and_temporal_search(monkeypatch):
    calls=[]
    async def offline_search(query, *args, **kwargs):
        calls.append(query)
        from backend.knowledge.retrieval import RetrievalResult
        return RetrievalResult('unavailable')
    monkeypatch.setattr('backend.model.service.retriever.retrieve', offline_search)
    async def run():
        service=CampusModelService(Settings(web_search_enabled=True))
        results=[]
        for message, selected in [
            ('北洋园何时投入使用',None),('郑东图书馆在哪个校区',None),
            ('介绍当前选中地点','beiyangyuan-zhengdong-library'),
            ('未知展厅开放时间',None),('北洋园投入使用年份和郑东图书馆今日关门时间',None)]:
            request=req(message,selected);runtime.begin(request.request_id,request.session_id)
            result=await service.prepare(request);results.append(result)
        assert any('2015年9月' in h.snippet for h in results[0].hits)
        assert any('北洋园校区' in h.snippet and '郑东图书馆' in h.snippet for h in results[1].hits)
        assert results[2].selected_title=='郑东图书馆'
        assert len(calls)==3
        assert any('今日关门' in q for q in calls)
        assert not stable_local_question(req('联网搜索北洋园何时投入使用'),results[0].hits)
        assert not stable_local_question(req('北洋园何时投入使用以及今天几点关门'),results[0].hits)
        assert not stable_local_question(req('北洋园何时投入使用'),[])
        assert not stable_local_question(req('郑东图书馆在哪个校区，谁设计的'),results[1].hits)
    asyncio.run(run())
