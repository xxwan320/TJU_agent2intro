"""Assemble evidence summaries; no business source mutations or external model calls."""
import json,re,hashlib,subprocess
from pathlib import Path
from datetime import datetime
from urllib.parse import urlsplit
import httpx
OUT=Path(__file__).resolve().parent
ROOT=OUT.parents[2]
def read(name):return json.loads((OUT/name).read_text(encoding='utf-8-sig'))
def save(name,value):(OUT/name).write_text(json.dumps(value,ensure_ascii=False,indent=2),encoding='utf-8')
def sanitize(text):
    return re.sub(r'([?&](?:token|key|api_key|access_token|jscode)=)[^&\s)"<>]+',r'\1[REDACTED]',text,flags=re.I)
for p in (OUT/'references').iterdir():
    if p.is_file():p.write_text(sanitize(p.read_text(encoding='utf-8')),encoding='utf-8')
for filename in ['map_candidates.json','map_extra.json','map_route.json']:
    data=read(filename)
    def clean(v):
        if isinstance(v,dict):return {k:clean(x) for k,x in v.items() if k not in ('tel','photos','featured_reviews','featured_reviews_remake')}
        if isinstance(v,list):return [clean(x) for x in v]
        return v
    save(filename,clean(data))
paths=['backend/app.py','backend/model/service.py','backend/model/stream_routes.py','backend/model/tour_planner.py','backend/knowledge/service.py','backend/knowledge/web_search.py','backend/maps/service.py','backend/maps/routes.py','backend/speech/service.py','frontend/src/ui/App.tsx','frontend/src/ui/CampusExplorer.tsx','frontend/src/ui/TourWorkspace.tsx','frontend/src/ui/tour-model.ts','frontend/src/ui/navigation-model.ts','frontend/src/transport/amap-navigation.ts','frontend/src/scene/amap.ts','frontend/src/speech/controller.ts','frontend/src/speech/adapter.ts','frontend/src/avatar/adapter.ts','frontend/src/avatar/vrm/flag.ts','frontend/src/avatar/vrm/roam.ts','frontend/src/avatar/vrm/renderer.ts']
index={}
for path in paths:
    lines=(ROOT/path).read_text(encoding='utf-8').splitlines()
    symbols=[{'line':n,'text':line[:400]} for n,line in enumerate(lines,1) if re.search(r'(?:class |def |function |async (?:mount|stop|play|navigate|walk|begin)|private (?:greet|take|pump)|const (?:clearRoute|choose)=|onReadRoute=|audio.onplaying)',line)]
    index[path]={'sha256':hashlib.sha256((ROOT/path).read_bytes()).hexdigest(),'symbols':symbols}
save('source_index.json',index)
assetpaths=['/assets/avatar/vrm/kelaita.vrm','/assets/avatar/vrm/AliciaSolid_vrm-0.51.vrm','/assets/kelaita/runtime/kelaita.model3.json','/vendor/live2dcubismcore.min.js']
runtime={'time':datetime.now().astimezone().isoformat(),'assets':[]}
with httpx.Client(timeout=8,trust_env=False) as c:
    runtime['tours_status']=c.get('http://127.0.0.1:8000/api/tours/status').json()
    runtime['health_after']=c.get('http://127.0.0.1:8000/api/health').json()
    html=c.get('http://127.0.0.1:8000/').text
    js=re.search(r'src="([^"]+\.js)"',html).group(1)
    r=c.get('http://127.0.0.1:8000'+js)
    runtime['frontend_asset']={'path':js,'status':r.status_code,'sha256':hashlib.sha256(r.content).hexdigest(),'matches_disk':r.content==(ROOT/'dist'/js.lstrip('/')).read_bytes()}
    for path in assetpaths:
        # GET on small manifest/Core, streamed GET closed after headers for large VRM.
        with c.stream('GET','http://127.0.0.1:8000'+path) as r:
            runtime['assets'].append({'path':path,'status':r.status_code,'content_length':r.headers.get('content-length'),'public_exists':(ROOT/'frontend/public'/path.lstrip('/')).is_file()})
save('runtime_identity.json',runtime)
cases=[]
for n in range(1,4):
    j=read(f'chat_{n}.json');response=next((e['event']['payload']['response'] for e in j['events'] if e['event']['type']=='completed'),None)
    marker={1:'2015年9月',2:'大通学生中心',3:'未见'}[n]
    accumulated='';effective=None
    for event in j['events']:
        if event['event']['type']=='answer_delta':
            accumulated+=event['event']['payload']['text']
            if marker in accumulated and effective is None:effective=event['client_ms']
    traces=j['trace'];first_backend=next((e['monotonic_ms'] for e in traces if e['stage']=='first_content'),None);route_backend=next((e['monotonic_ms'] for e in traces if e['stage']=='request'),None)
    metrics={'submit_to_client_first_effective_answer_ms':effective,'effective_marker':marker,'submit_to_client_first_nonempty_delta_ms':j['first_answer_ms'],'submit_to_first_display_ms':None,'submit_to_complete_ms':j['complete_ms'],'submit_to_actual_audio_play_ms':None,'asr_ms':None,'tts_ms':None,'backend_route_to_first_content_ms':first_backend-route_backend if first_backend is not None and route_backend is not None else None,'clock':'client perf_counter; backend monotonic separately; never subtract across clocks','process_state':'existing warm application, new isolated session; upstream cold/warm unknown','llm_cache_hit':None,'web_status':next((e['action'] for e in traces if e['action'].startswith('web_search.')),None),'web_elapsed_ms':next((e['elapsed_ms'] for e in traces if e['action'].startswith('web_search.')),None)}
    cases.append({'id':n,'input':j['input']['message'],'expected':{1:'2015年9月，引用 beiyangyuan-opened-2015',2:'大通学生中心或澄清，不编造具体方位',3:'明确无资料，不编造展厅、票价、开放时间'}[n],'validation_type':'真实运行通过（HTTP客户端；浏览器未验证）','result':response['answer'] if response else None,'measurements':metrics,'calls':{'llm':j['llm_calls_observed'],'maps':0,'asr':0,'tts':0},'errors':j['error'],'evidence':[f'chat_{n}.json','local_knowledge.json'],'limitations':{1:'只验证该事实，不代表全库；首个非空delta为角色称呼',2:'实体解析器未命中简称；模型谨慎澄清；联网资料含多条明显无关结果，检索质量失败',3:'无编造所问事实；引用ID存在不匹配，返回了资料提示及不支持该展厅的泛校园参考'}[n]})
route=read('map_route.json');tts=read('tts.json')
common_null={'submit_to_client_first_effective_answer_ms':None,'submit_to_first_display_ms':None,'submit_to_complete_ms':None,'submit_to_actual_audio_play_ms':None}
cases.extend([
 {'id':4,'input':'大通学生中心 → 郑东图书馆（北洋园）；初选东门因匹配失败改选','expected':'同校区真实地点、供应商步行折线，地图/说明/朗读共享结果','validation_type':'真实代理路线通过＋录制响应解析模拟通过；浏览器未验证','result':{'provider':'amap','crs':'GCJ02','distance_m':286,'duration_s':229,'steps':3,'polylines':True,'map_display':None,'chat_route_record':None,'role_speech':None},'measurements':{**common_null,'route_submit_to_service_return_ms':route['service_return_ms'],'route_submit_to_map_applied_ms':None,'cache_hit':None},'calls':{'llm':0,'maps':1,'poi_search':3,'asr':0,'tts':0},'errors':['东门检索出现公交站及其他学校；未选用这些候选','初次离线回放因data URL无法解析Vite分块失败；改为独立目录构建后通过，零新增外部调用'],'evidence':['map_candidates.json','map_extra.json','map_route.json','route-replay.json','route-replay.mjs'],'limitations':'实时探针走现有同源代理；没有启动SDK，前端解析复用录制响应；入口及门禁未核验。路线朗读未写入聊天任务列表，场景更换是否同步停止旧讲解未验证。'},
 {'id':5,'input':'夹具A延迟返回、B先完成；取消/跨校区/过期GET/旧ASR事件','expected':'A不能覆盖B；已停止的旧语音事件不复活','validation_type':'仅模拟通过','result':'TourLifecycle与speechEventCurrent 4项通过；旧ASR及停止后旧播放事件由组8覆盖','measurements':common_null,'calls':{'llm':0,'maps':0,'asr':0,'tts':0},'errors':None,'evidence':['offline-1.json','offline-1.txt','offline-2.txt'],'limitations':'夹具验证生产纯逻辑和语音控制器；没有覆盖真实App DOM、路线切换自动停止讲解或真人麦克风'},
 {'id':6,'input':'复用组1 SSE记录','expected':'有效正文多段送达，不以accepted/status/思考流作为首答','validation_type':'真实HTTP流通过；UI未验证','result':'正文分段抵达，非全文结束后一次性收到；瓶颈主要在联网检索等待和上游首正文前','measurements':cases[0]['measurements'],'calls':{'llm':0,'maps':0,'asr':0,'tts':0},'reuses_case':1,'errors':None,'evidence':['chat_1.json'],'limitations':'后端与客户端用各自单调钟；不能从两个绝对时间直接推出传输延迟；浏览器绘制延迟null'},
 {'id':7,'input':tts['input']['text'],'expected':'ASR识别校园名称；TTS音频生成；实际播放器启动分别验证','validation_type':'TTS真实运行通过；ASR/浏览器播放未验证','result':{'tts_status':tts['status'],'audio_bytes':tts['audio_bytes'],'ffprobe':read('tts_ffprobe.json'),'asr':None,'browser_audio':None},'measurements':{**common_null,'tts_ms':tts['tts_ms'],'asr_ms':None},'calls':{'llm':0,'maps':0,'asr':0,'tts':1},'errors':['运行健康检查asr=false；无可用已知校园名称测试录音；无浏览器或麦克风控制面'],'evidence':['tts.json','tts_sample.mp3','tts_ffprobe.json','baseline.json'],'limitations':'MP3 24kHz单声道3.432秒，仅证明音频产出可解析，不能证明已播放或真人识别'},
 {'id':8,'input':'复用隔离播放器测试：播放中停止、旧ended回调、RMS口型；角色点击静态检查','expected':'停止清空队列、旧事件不复活、角色回idle/闭口；点击有响应','validation_type':'停止与口型仅模拟通过；VRM点击仅静态证据','result':'4项语音测试通过；默认VRM RoamController.greet点击显示气泡并触发1.5秒姿态；Live2D autoInteract=false','measurements':common_null,'calls':{'llm':0,'maps':0,'asr':0,'tts':0},'errors':None,'evidence':['offline-2.json','offline-2.txt','source_index.json','runtime_identity.json'],'limitations':'fake Audio/AudioContext，并非真实播放；VRM渲染、点击、角色停止实际状态未验证'}])
result={'run':OUT.name,'date':datetime.now().astimezone().isoformat(),'mode':'diagnostic_only','base_url':'http://127.0.0.1:8000','budget':{'limits':{'llm':4,'maps':2,'asr':1,'tts':1},'actual':{'llm':3,'maps':1,'asr':0,'tts':1},'additional_poi_search_http_requests':3,'web_search_application_requests':3,'web_search_underlying_provider_requests':None,'retries_model':0,'note':'DDGS内部搜索提供方次数没有暴露；不计为LLM但明确未测。所有付费模型请求由现有服务发出。'},'cases':cases,'processes_started':[],'side_effects':['本目录报告、独立脚本、回放构建、下载的参考文本','既有服务内存隔离聊天会话/事件/联网缓存/地图计数','既有服务 .runtime/model-r2.jsonl 和 .runtime/map-r2.jsonl 追加脱敏事件','既有服务 .runtime/speech-audio/a765902117f24fb48adf4450a09d4e92.mp3 音频及服务按原逻辑的缓存清理；本目录保留音频副本'],'limitations':['无浏览器控制面，apps=[] browsers=[]','未重启或停止既有服务，启动流程为静态核验，冷启动耗时未测','没有执行新行程LLM生成，只有tours/status和源码证据','未测稳定P95或确定加速倍数']}
save('probe_results.json',result)
result['budget']['actual']['tts']=None
result['budget']['tts_application_invocations']=1
result['budget']['tts_provider_attempts']=None
result['budget']['tts_provider_attempts_upper_bound']=2
result['budget']['tts_budget_compliance']='not_fully_observable: installed edge_tts.stream may retry once on HTTP403; application does not expose attempts; no additional call made'
result['cases'][6]['calls']['tts']=None
result['cases'][6]['calls']['tts_application_invocations']=1
result['cases'][6]['limitations']+='；供应商尝试数未暴露，不能严格证明TTS上游调用≤1（SDK可能403重试）。'
for case in result['cases']:
    n=case['id'];prefix='.\\.venv\\Scripts\\python.exe -B docs/diagnostics/20260917-150656/probe.py '
    case['commands']=([prefix+'chat '+str(n)] if n<=3 else {
        4:[prefix+'maps_find',prefix+'map_extra',prefix+'maps_route','node docs/diagnostics/20260917-150656/route-replay.mjs'],
        5:['node docs/diagnostics/20260917-150656/offline.mjs'],
        6:['reuse chat_1.json, no additional call'],
        7:[prefix+'tts','ffprobe -v error -show_entries format=duration,size:stream=codec_name,sample_rate,channels -of json docs/diagnostics/20260917-150656/tts_sample.mp3'],
        8:['node docs/diagnostics/20260917-150656/offline.mjs (shared execution with case5)','rg static inspection of frontend/src/avatar/vrm and frontend/src/avatar/adapter.ts']
    }[n])
    case['started_at']=read(f'chat_{n}.json')['time'] if n<=3 else (tts['time'] if n==7 else None)
    if case['started_at'] is None:case['time_note']='wall-clock start not separately captured; original monotonic measurement/TAP preserved; do not infer from file mtime'
tts_record=read('tts.json');tts_record['tts_calls']=None;tts_record['tts_application_invocations']=1;tts_record['provider_attempts']=None;tts_record['provider_attempts_note']='edge_tts.stream handles HTTP403 with one retry; attempts not exposed in service traces.';save('tts.json',tts_record)
save('probe_results.json',result)
print(json.dumps({'effective_timings':[(c['id'],c['measurements'].get('submit_to_client_first_effective_answer_ms')) for c in cases[:3]],'runtime':runtime,'budget':result['budget']},ensure_ascii=False))
