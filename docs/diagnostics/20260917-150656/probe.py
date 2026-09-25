"""Read-only diagnostics; writes only evidence here, except documented service side effects."""
import asyncio, hashlib, json, os, subprocess, sys, time
from pathlib import Path
from datetime import datetime
from uuid import uuid4
ROOT = Path(__file__).resolve().parents[3]
OUT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))
os.environ['PYTHONDONTWRITEBYTECODE'] = '1'
import httpx
BASE = 'http://127.0.0.1:8000'
def save(name, value):
    (OUT / (name + '.json')).write_text(json.dumps(value, ensure_ascii=False, indent=2), encoding='utf-8')
def git(*args):
    return subprocess.check_output(['git', *args], cwd=ROOT).decode('utf-8').strip()
def hashes():
    return {p:hashlib.sha256((ROOT/p).read_bytes()).hexdigest() for p in git('ls-files').splitlines() if (ROOT/p).is_file()}
async def baseline():
    result={'time':datetime.now().astimezone().isoformat(),'branch':git('branch','--show-current'),'head':git('rev-parse','HEAD'),'status':git('status','--short'),'worktrees':git('worktree','list','--porcelain'),'tracked_sha256':hashes(),'env_file_exists':(ROOT/'.env').is_file(),'http':{}}
    async with httpx.AsyncClient(timeout=8,trust_env=False) as c:
        for path in ['/api/health','/api/knowledge/status','/api/knowledge/coverage','/api/maps/status','/']:
            t=time.perf_counter()
            try:
                r=await c.get(BASE+path)
                result['http'][path]={'status':r.status_code,'elapsed_ms':(time.perf_counter()-t)*1000,'body':r.json() if path!='/' else r.text[:3000]}
            except Exception as e:result['http'][path]={'error':type(e).__name__}
    save('baseline',result)
    print(json.dumps({k:v for k,v in result.items() if k!='tracked_sha256'},ensure_ascii=False))
def local():
    from backend.knowledge.service import knowledge
    pois=json.loads((ROOT/'data/knowledge/pois.json').read_text(encoding='utf-8'))
    result={'status':knowledge.get_status().model_dump(),'coverage':knowledge.get_coverage().model_dump(),'counts':{},'pois':pois,'samples':{}}
    for p in (ROOT/'data/knowledge').glob('*.json'):
        data=json.loads(p.read_text(encoding='utf-8'));result['counts'][p.name]=len(data) if isinstance(data,list) else None
    for q in ['北洋园校区何时正式落成并投入使用？请用不超过80字回答并标出资料来源。','北洋园的大通在哪里？请用不超过80字回答；有歧义就澄清。','北洋园量子玫瑰秘密展厅2026年9月17日几点开放，门票多少？请用不超过80字回答；没有资料请明确说明。']:
        result['samples'][q]={'resolved':knowledge.resolve_entities(q,'beiyangyuan'),'hits':[h.model_dump() for h in knowledge.search(q,'beiyangyuan',5)]}
    save('local_knowledge',result)
    print(json.dumps({'status':result['status'],'coverage':result['coverage'],'counts':result['counts'],'samples':result['samples'],'poi_sample':pois[:2]},ensure_ascii=False))
async def chat(case):
    if (OUT/('chat_'+case+'.json')).exists(): raise RuntimeError('Case already recorded; do not spend another call in this run')
    prompts=json.loads((OUT/'local_knowledge.json').read_text(encoding='utf-8'))['samples']
    prompt=list(prompts)[int(case)-1]
    rid,sid,mid=map(str,(uuid4(),uuid4(),uuid4()))
    body={'request_id':rid,'session_id':sid,'message_id':mid,'campus_id':'beiyangyuan','mode':'campus_qa','message':prompt,'selected_building_id':None}
    result={'input':body,'time':datetime.now().astimezone().isoformat(),'validation':'real_http','events':[],'first_answer_ms':None,'complete_ms':None,'first_display_ms':None,'first_audio_play_ms':None,'error':None,'request_budget_reserved':1}
    async with httpx.AsyncClient(timeout=55,trust_env=False) as c:
        t=time.perf_counter()
        try:
            async with asyncio.timeout(55):
                async with c.stream('POST',BASE+'/api/chat/stream',json=body) as r:
                    result['http_status']=r.status_code
                    async for line in r.aiter_lines():
                        if line.startswith('data:'):
                            event=json.loads(line[5:]);ms=(time.perf_counter()-t)*1000
                            result['events'].append({'client_ms':ms,'event':event})
                            if event['type']=='answer_delta' and event['payload']['text'].strip() and result['first_answer_ms'] is None:result['first_answer_ms']=ms
                            if event['type']=='completed':result['complete_ms']=ms
                            if event['type']=='error':result['error']=event['payload']
        except Exception as e:
            result['error']=type(e).__name__
            try:result['cancel']=(await c.post(BASE+f'/api/requests/{rid}/cancel',json={'session_id':sid})).json()
            except Exception as ce:result['cancel_error']=type(ce).__name__
        result['client_end_ms']=(time.perf_counter()-t)*1000
        try:result['runtime']=(await c.get(BASE+'/api/runtime/events',params={'request_id':rid})).json()
        except Exception as e:result['runtime_error']=type(e).__name__
    trace=ROOT/'.runtime/model-r2.jsonl'
    result['trace']=[json.loads(line) for line in trace.read_text(encoding='utf-8').splitlines() if rid in line] if trace.exists() else []
    result['llm_calls_observed']=sum(e.get('stage')=='model' and e.get('status')=='started' and e.get('action') in ('stream','upstream') for e in result['trace'])
    save('chat_'+case,result)
    print(json.dumps(result,ensure_ascii=False))
def final_check():
    before=json.loads((OUT/'baseline.json').read_text(encoding='utf-8'))['tracked_sha256'];after=hashes()
    result={'time':datetime.now().astimezone().isoformat(),'head':git('rev-parse','HEAD'),'status':git('status','--short'),'changed_tracked_files':[p for p in before if before[p]!=after.get(p)],'new_tracked_files':[p for p in after if p not in before]}
    save('final_check',result);print(json.dumps(result,ensure_ascii=False))
async def maps_find():
    if (OUT/'map_candidates.json').exists(): raise RuntimeError('Already recorded')
    result=[]
    async with httpx.AsyncClient(timeout=20,trust_env=False) as c:
        for pid,title in [('beiyangyuan-east-gate','天津大学北洋园校区东门'),('beiyangyuan-zhengdong-library','天津大学北洋园校区郑东图书馆')]:
            t=time.perf_counter()
            try:
                r=await c.get(BASE+'/api/maps/amap/_AMapService/v3/place/text',params={'keywords':title,'city':'天津','citylimit':'true','offset':'5','page':'1','extensions':'base','output':'JSON'})
                result.append({'poi_id':pid,'query':title,'elapsed_ms':(time.perf_counter()-t)*1000,'status':r.status_code,'response':r.json()})
            except Exception as e:result.append({'poi_id':pid,'error':type(e).__name__})
    save('map_candidates',result);print(json.dumps(result,ensure_ascii=False))
async def maps_route():
    if (OUT/'map_route.json').exists():raise RuntimeError('Already recorded')
    rows=json.loads((OUT/'map_candidates.json').read_text(encoding='utf-8'))
    extra=json.loads((OUT/'map_extra.json').read_text(encoding='utf-8'))
    selected=[extra['selected'],next(p for p in rows[1]['response']['pois'] if p['id']=='B0H04DD3W7')]
    assert selected[0] is not None
    result={'source':'real_amap_same_origin_proxy','selected_public_pois':selected,'map_applied_ms':None,'planning_calls':1}
    async with httpx.AsyncClient(timeout=20,trust_env=False) as c:
        t=time.perf_counter()
        try:
            r=await c.get(BASE+'/api/maps/amap/_AMapService/v3/direction/walking',params={'origin':selected[0]['location'],'destination':selected[1]['location'],'output':'JSON'})
            result.update(status=r.status_code,service_return_ms=(time.perf_counter()-t)*1000,response=r.json())
        except Exception as e:result.update(error=type(e).__name__,service_return_ms=(time.perf_counter()-t)*1000)
    save('map_route',result);print(json.dumps(result,ensure_ascii=False))
async def map_extra():
    if (OUT/'map_extra.json').exists():raise RuntimeError('Already recorded')
    query='天津大学北洋园校区大通学生中心'
    async with httpx.AsyncClient(timeout=20,trust_env=False) as c:
        t=time.perf_counter();r=await c.get(BASE+'/api/maps/amap/_AMapService/v3/place/text',params={'keywords':query,'city':'天津','citylimit':'true','offset':'5','page':'1','extensions':'base','output':'JSON'})
        data=r.json();matches=[p for p in data.get('pois',[]) if p['name']==query and p.get('parent')=='B0FFF7ALXA']
        result={'query':query,'status':r.status_code,'elapsed_ms':(time.perf_counter()-t)*1000,'response':data,'selected':matches[0] if len(matches)==1 else None}
        save('map_extra',result);print(json.dumps(result,ensure_ascii=False))
async def tts():
    if (OUT/'tts.json').exists():raise RuntimeError('Already recorded')
    body={'request_id':str(uuid4()),'session_id':str(uuid4()),'utterance_id':str(uuid4()),'text':'欢迎来到天津大学北洋园校区。','voice_id':'edge:zh-CN-XiaoxiaoNeural'}
    result={'input':body,'time':datetime.now().astimezone().isoformat(),'tts_calls':1,'browser_play_ms':None,'asr_ms':None,'asr_calls':0,'asr_blocker':'live health asr=false; no known campus-name test audio'}
    async with httpx.AsyncClient(timeout=40,trust_env=False) as c:
        t=time.perf_counter()
        try:
            r=await c.post(BASE+'/api/speech/tts',json=body);result.update(status=r.status_code,tts_ms=(time.perf_counter()-t)*1000,response=r.json())
            if r.status_code==200:
                audio=await c.get(BASE+r.json()['audio_url']);result['audio_bytes']=len(audio.content);result['audio_status']=audio.status_code
                result['audio_sha256']=hashlib.sha256(audio.content).hexdigest();result['audio_magic_hex']=audio.content[:12].hex()
                (OUT/'tts_sample.mp3').write_bytes(audio.content)
        except Exception as e:result['error']=type(e).__name__
    save('tts',result);print(json.dumps(result,ensure_ascii=False))
if __name__=='__main__':
    mode=sys.argv[1]
    if mode=='baseline':asyncio.run(baseline())
    elif mode=='local':local()
    elif mode=='chat':asyncio.run(chat(sys.argv[2]))
    elif mode=='final':final_check()
    elif mode=='maps_find':asyncio.run(maps_find())
    elif mode=='maps_route':asyncio.run(maps_route())
    elif mode=='map_extra':asyncio.run(map_extra())
    elif mode=='tts':asyncio.run(tts())
