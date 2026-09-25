"""Reproducible workflow evidence. Never opens a network socket or calls a model."""
import asyncio,json,sys,time
from pathlib import Path
from types import SimpleNamespace
from uuid import uuid4
import httpx
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from backend.knowledge.retrieval import EvidenceRetriever
from backend.knowledge.query_routes import execute_tool
from backend.model.service import CampusModelService
from backend.common.config import Settings
from backend.contracts import ChatRequest
from backend.model.runtime import runtime

async def main():
    rows=[]
    for scenario in ('official','community','timeout','old_notice','empty_library'):
        async def handler(req):
            if scenario=='timeout':await asyncio.sleep(.15);return httpx.Response(503)
            if scenario=='empty_library':return httpx.Response(200,text='<title>目录页，无正文</title>')
            if scenario=='community' and req.url.host!='wiki.tjubot.cn':return httpx.Response(200,text='<title>目录页</title>')
            text='北洋园尚贤石的校园文化介绍，题字为赵冷月。'*8
            if scenario=='old_notice':text='北洋园尚贤石区域不开放，临时封闭，有效期2025-09-01至2025-09-30。'*6
            return httpx.Response(200,text='<title>尚贤石</title><article>'+text+'</article>')
        r=EvidenceRetriever(client=httpx.AsyncClient(transport=httpx.MockTransport(handler)))
        q='今天能进图书馆吗' if scenario=='empty_library' else '尚贤石今天开放吗' if scenario=='old_notice' else '尚贤石介绍'
        start=time.monotonic();res=await r.retrieve(q,'beiyangyuan',deadline=start+.06 if scenario=='timeout' else None)
        from dataclasses import asdict
        rows.append({'scenario':scenario,'evidence_type':'mock','elapsed_ms':(time.monotonic()-start)*1000,'result':asdict(res)})
        await r.client.aclose()
    class Message:
        tool_calls=[SimpleNamespace(id='fixture-tool',function=SimpleNamespace(name='search_local',arguments=json.dumps({'campusId':'beiyangyuan','query':'尚贤石'})))]
        def model_dump(self,**kw):return {'role':'assistant','tool_calls':[{'id':'fixture-tool','type':'function','function':{'name':'search_local','arguments':self.tool_calls[0].function.arguments}}]}
    class Provider:
        async def select_tools(self,r):return Message()
    service=CampusModelService(Settings(web_search_enabled=False),provider=Provider());service.tool_calls_verified=True
    req=ChatRequest(request_id=uuid4(),session_id=uuid4(),mode='campus_qa',campus_id='beiyangyuan',message='请联网介绍尚贤石')
    runtime.begin(req.request_id,req.session_id);prepared=await service.prepare(req)
    rows.append({'scenario':'validated_tool_execution','evidence_type':'mock tool proposal + actual local executor','trace':prepared.query_meta,'source_ids':[s.id for s in prepared.hits]})
    for campus in ('beiyangyuan','weijinlu'):
        rows.append({'scenario':'trip_brief','campus':campus,'evidence_type':'local seeded records','result':await execute_tool('get_trip_brief',{'campusId':campus,'stopIds':[]})})
    Path('docs/interaction/20260917-functional/offline-traces.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
    print('Saved 8 offline traces; zero external calls')
asyncio.run(main())
