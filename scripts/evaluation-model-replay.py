"""Real GLM tool execution, using previously recorded page evidence (zero web calls)."""
import asyncio,json,sys,time
from pathlib import Path
from uuid import uuid4
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from backend.model.service import CampusModelService
from backend.model.runtime import runtime
from backend.contracts import ChatRequest
from backend.knowledge.retrieval import retriever, Evidence, RetrievalResult

ROOT=Path('docs/interaction/20260917-functional')
async def main():
    recorded=json.loads((ROOT/'live-pages-authorized.json').read_text('utf-8'))[0]['evidence']
    async def replay(query,campus,poi=None,*args,**kwargs):
        if '尚贤' in query or poi=='beiyangyuan-shangxian-stone':return RetrievalResult('success',[Evidence(**recorded)],['tju-news'],[{'evidence_type':'recorded_replay','fixture':'live-pages-authorized.json'}])
        return RetrievalResult('unavailable',trace=[{'evidence_type':'recorded_replay','reason':'No applicable current library evidence; registered library adapter disabled'}])
    retriever.retrieve=replay
    service=CampusModelService();service.tool_calls_verified=True
    results=[]
    samples=[('请联网介绍尚贤石，使用注册的资料工具。','beiyangyuan-shangxian-stone'),('北洋园启用年份，以及图书馆今天几点关门？',None)]
    if '--composite-only' in sys.argv:samples=samples[1:]
    for text,poi in samples:
        req=ChatRequest(request_id=uuid4(),session_id=uuid4(),mode='campus_qa',campus_id='beiyangyuan',message=text,selected_building_id=poi)
        runtime.begin(req.request_id,req.session_id);start=time.monotonic()
        try:
            answer=await service.generate(req)
            results.append({'request_id':str(req.request_id),'input':text,'answer':answer.model_dump(mode='json'),'trace':service.query_traces.get(str(req.request_id)),'elapsed_ms':(time.monotonic()-start)*1000,'model_evidence':'live_http','page_evidence':'recorded_replay'})
        except Exception as e:results.append({'input':text,'error':type(e).__name__,'code':getattr(e,'code',None)})
        runtime.finish(req.request_id,'completed')
    ROOT.joinpath('model-composite-fixed.json' if '--composite-only' in sys.argv else 'model-tool-replay-final.json' if '--final' in sys.argv else 'model-tool-replay.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps([{'input':r['input'],'answer':r.get('answer',{}).get('answer'),'tools':r.get('trace',{}).get('tool_calls'),'error':r.get('error')} for r in results],ensure_ascii=False))
asyncio.run(main())
