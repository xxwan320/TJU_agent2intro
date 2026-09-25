"""Bounded real calls, raw SSE timings and content evidence, never print secrets."""
import asyncio,json,time,sys
from uuid import uuid4
from pathlib import Path
import httpx
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from backend.knowledge.retrieval import EvidenceRetriever, RetrievalResult

ROOT=Path('docs/interaction/20260917-functional')

async def main():
    results=[]
    async with httpx.AsyncClient(timeout=50) as client:
        for qid,text,poi in ([] if '--pages-only' in sys.argv else [('Q01','北洋园校区何时投入使用？',None),('Q02','郑东图书馆在哪个校区？',None),('Q04','尚贤石上的字是谁写的？','beiyangyuan-shangxian-stone'),('Q06','北洋园启用年份，以及图书馆今天几点关门？',None)]):
            body={'request_id':str(uuid4()),'session_id':str(uuid4()),'message_id':str(uuid4()),'campus_id':'beiyangyuan','mode':'campus_qa','message':text,'selected_poi_id':poi}
            start=time.perf_counter();events=[];first=None
            async with client.stream('POST','http://127.0.0.1:8000/api/chat/stream',json=body) as response:
                async for line in response.aiter_lines():
                    if line.startswith('data: '):
                        event=json.loads(line[6:]);events.append(event)
                        if event['type']=='answer_delta' and event['payload']['text'].strip() and first is None:first=(time.perf_counter()-start)*1000
            trace=await client.get('http://127.0.0.1:8000/api/campus/query-trace/'+body['request_id'])
            results.append({'id':qid,'input':text,'first_body_ms':first,'completed_ms':(time.perf_counter()-start)*1000,'events':events,'trace':trace.json()})
    if results:ROOT.joinpath('live-answers.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf-8')
    retriever=EvidenceRetriever();pages=[]
    # Three explicitly registered pages; no discovery/fallback requests in this probe.
    for url,query in [('https://news.tju.edu.cn/info/1003/89019.htm','尚贤石介绍'),('https://dag.tju.edu.cn/web/news/info/231147/237592.htmlx','校史馆新闻'),('https://wiki.tjubot.cn/category/campus-attractions/','校园文化')]:
        result=RetrievalResult('no_evidence');page,status=await retriever._page(url,'beiyangyuan',time.monotonic()+1.5,result)
        evidence=retriever.filter(page,query,'beiyangyuan',None,'stable','2026-09-17') if page else None
        from dataclasses import asdict
        pages.append({'url':url,'status':status,'calls':result.page_calls,'trace':result.trace,'title':page[1] if page else None,'body_chars':len(page[2]) if page else 0,'evidence':asdict(evidence) if evidence else None})
    await retriever.client.aclose()
    ROOT.joinpath('live-pages-authorized.json' if '--pages-only' in sys.argv else 'live-pages.json').write_text(json.dumps(pages,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({'answers':[{'id':r['id'],'first_body_ms':r['first_body_ms'],'terminal':r['events'][-1]['type'] if r['events'] else 'no_events'} for r in results],'pages':[{k:v for k,v in r.items() if k in ('url','status','body_chars','calls')} for r in pages]},ensure_ascii=False))

asyncio.run(main())
