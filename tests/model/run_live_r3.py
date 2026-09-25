"""Explicit, bounded live verification; output contains metadata only.
Run with AI4TJU_ENV_FILE explicitly set. No fixture imports, coordinates, prompts,
answer bodies or credentials are written to this report. No automatic retries.
"""
import asyncio
import json
from pathlib import Path
import subprocess
import time
from uuid import uuid4
import httpx
from backend.app import app
from backend.model.tour_evaluation import compare_entry,BASELINE_COMMIT,evaluation_record
from backend.model.tour_service import tour_service
from backend.model.runtime import runtime
from backend.knowledge.service import knowledge
from backend.r2_contracts import R2ChatRequest
from backend.r3_contracts import TourRequest


def chat(text,kind='visit_plan'):
    return R2ChatRequest(request_id=uuid4(),session_id=uuid4(),message_id=uuid4(),message=text,
        mode='content_generation' if kind else 'general_chat',campus_id='weijinlu',
        generation={'type':kind,'length':'short','style':'friendly','requirements':'事实缺失明确待核实'} if kind else None)


def trace_metrics(rid,usage,elapsed):
    traces=[t for t in runtime.traces if t['request_id']==str(rid)]
    calls=sum(t['stage']=='model' and t['status']=='started' for t in traces)
    return {'model_calls':calls,'web_calls':sum(t['action'].startswith('web_search.') for t in traces),
        'failure_retries':max(0,calls-1),'first_content_ms':elapsed,
        'usage':usage.model_dump() if usage else None,'usage_status':'known' if usage else 'unknown',
        'unknown_usage_calls':0 if usage else calls,'elapsed_ms':elapsed,'map_operations':0,
        'task_completed':False,'outcome':'pass'}


async def main():
    build=subprocess.check_output(['git','rev-parse','HEAD'],text=True).strip()
    report={'kind':'live','transport':'in_process_http_and_provider','baseline_commit':BASELINE_COMMIT,
        'build_commit':build,'knowledge_version':knowledge.get_status().version,'runs':[],
        'physical_arrival_verified':False,'new_live_walking_verified':False,'fixture_used':False}
    for mode in ('direct_glm','baseline','enhanced'):
        req=chat('请规划卫津路校区60分钟校园文化参观，起终点未指定；只使用真实地点，距离、开放和门禁未知须明确。')
        tour=TourRequest(request_id=req.request_id,session_id=req.session_id,campus_id=req.campus_id,
            duration_minutes=60,interests=['校园文化'],start={'kind':'unspecified'},end={'kind':'unspecified'})
        start=time.monotonic()
        try:
            result=await compare_entry(mode,req,tour)
            elapsed=(time.monotonic()-start)*1000
            metrics=tour_service.metrics[(tour.session_id,tour.request_id)] if mode=='enhanced' else trace_metrics(req.request_id,result.usage,elapsed)
            row={'mode':mode,'http_or_provider_ok':True,'metrics':metrics}
            if mode=='enhanced':
                row['session_status']=result.session.status
                row['poi_ids']=[s.poi_id for s in result.session.plan.stops]
                row['unknown_legs']=sum(l.duration_s is None for l in result.session.plan.legs)
                row['evaluation']=evaluation_record(metrics,case_id='c-live-60-culture',dataset_version='c-live-smoke-v1',build_commit=build,kind='live',session=result.session).model_dump(mode='json')
            else:
                row['returned_model']=result.model;row['body_chars']=len(result.answer)
            report['runs'].append(row)
        except Exception as exc:
            report['runs'].append({'mode':mode,'http_or_provider_ok':False,'error_code':getattr(exc,'code','internal_error'),'elapsed_ms':(time.monotonic()-start)*1000})
        print(json.dumps(report['runs'][-1],ensure_ascii=False),flush=True)
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app),base_url='http://127.0.0.1',timeout=125) as client:
        for kind,text in ((None,'你好，请用一句话介绍校园导游能提供的帮助。'),('guide_script','请介绍卫津路校区校史博物馆，未知事实明确待核实。'),('social_post','请写两句话欢迎新生来天津大学参观。')):
            req=chat(text,kind);start=time.monotonic();response=await client.post('/api/chat',json=req.model_dump(mode='json'))
            data=response.json();row={'mode':'legacy-'+str(kind or 'chat'),'status_code':response.status_code,
                'returned_model':data.get('model'),'body_chars':len(data.get('answer','')),
                'usage':data.get('usage'),'elapsed_ms':(time.monotonic()-start)*1000,'error_code':data.get('error',{}).get('code')}
            report['runs'].append(row);print(json.dumps(row,ensure_ascii=False),flush=True)
        response=await client.post('/api/maps/route-costs',json={'request_id':str(uuid4()),'session_id':str(uuid4()),'campus_id':'weijinlu',
            'places':[{'kind':'unspecified'},{'kind':'poi','poi_id':knowledge.list_pois('weijinlu',None,'',1,None).items[0].id}]})
        report['cost_http']={'status_code':response.status_code,'unknown_only':all(x['duration_s'] is None for x in response.json().get('costs',[]))}
        state=(await client.get('/api/maps/status')).json()
        report['maps_configuration']={k:state[k] for k in ('js_key_configured','security_key_configured','web_service_key_configured','in_app_routing')}
    path=Path('.runtime/M1-R3/C-live-evidence.json');path.parent.mkdir(parents=True,exist_ok=True);path.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')

if __name__=='__main__':asyncio.run(main())
