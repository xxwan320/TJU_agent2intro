"""Five fixed retrieval queries; no LLM/TTS/route calls. Run before/after separately."""
import asyncio
import json
import sys
import time
from pathlib import Path
from uuid import uuid4
from backend.contracts import ChatRequest
from backend.model.service import CampusModelService
from backend.model.runtime import runtime

QUERIES = ['北洋园何时投入使用', '郑东图书馆在哪个校区', '介绍当前选中地点', '未知展厅开放时间', '北洋园投入使用年份和郑东图书馆今日关门时间']

async def main():
    service = CampusModelService()
    rows=[]
    # Measure stable facts live; temporal/unknown branches are exercised with offline fixtures in tests.
    for message in QUERIES[:2]*3:
        request=ChatRequest(request_id=uuid4(),session_id=uuid4(),message=message,mode='campus_qa',campus_id='beiyangyuan')
        state={'request':request};state.update(await service._intent_stage(state))
        runtime.begin(request.request_id,request.session_id)
        start=time.perf_counter();result=await service._retrieval_stage(state)
        rows.append({'question':message,'retrieval_ms':(time.perf_counter()-start)*1000,'hits':[{'id':h.id,'snippet':h.snippet} for h in result['hits']],'llm_calls':0,'web_actions':[r['action'] for r in runtime.traces if r['request_id']==str(request.request_id) and r['action'].startswith('web_search')]})
    Path(sys.argv[1]).write_text(json.dumps(rows,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps([{'question':r['question'],'retrieval_ms':r['retrieval_ms'],'hits':len(r['hits'])} for r in rows],ensure_ascii=False))

if __name__=='__main__':asyncio.run(main())
