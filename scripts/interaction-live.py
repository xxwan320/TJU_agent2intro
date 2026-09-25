"""Bounded live HTTP evidence. Does not control a browser or claim audible playback."""
import hashlib
import json
import re
import time
from pathlib import Path
from uuid import uuid4
import httpx

OUT=Path('docs/interaction/20260917-optimization')
BASE='http://127.0.0.1:8000'
QUERIES=['北洋园何时投入使用','郑东图书馆在哪个校区','介绍当前选中地点','未知展厅开放时间','北洋园投入使用年份和郑东图书馆今日关门时间']
counts={'llm':0,'tts':0,'walking':0,'poi':0,'location_ip':0}
def save(name,data):
    (OUT/name).write_text(json.dumps(data,ensure_ascii=False,indent=2),encoding='utf-8')
def main():
    with httpx.Client(base_url=BASE,timeout=130,trust_env=False) as client:
        index=client.get('/');asset=re.search(r'src="([^"]+\.js)"',index.text).group(1)
        built=client.get(asset).content
        save('runtime.json',{'url':BASE,'asset':asset,'sha256':hashlib.sha256(built).hexdigest(),'matches_dist':built==(Path('dist')/asset.lstrip('/')).read_bytes(),'health':client.get('/api/health').json(),'pid_receipt':json.loads(Path('.runtime/managed-processes.json').read_text(encoding='utf-8-sig')),'browser':'unavailable: cua browsers=[]; getBrowser returned No browser is available'})
        rows=[]
        for i,message in enumerate(QUERIES):
            body={'request_id':str(uuid4()),'session_id':str(uuid4()),'message_id':str(uuid4()),'campus_id':'beiyangyuan','mode':'campus_qa','message':message}
            if i==2:body['selected_building_id']=body['selected_poi_id']='beiyangyuan-datong-center'
            counts['llm']+=1;save('call-budget.json',counts)
            start=time.perf_counter();first=None;events=[]
            try:
                with client.stream('POST','/api/chat/stream',json=body) as response:
                    status=response.status_code
                    for line in response.iter_lines():
                        if line.startswith('data: '):
                            event=json.loads(line[6:]);events.append(event)
                            if event.get('type')=='answer_delta' and first is None:first=(time.perf_counter()-start)*1000
                row={'question':message,'status':status,'first_text_ms':first,'total_ms':(time.perf_counter()-start)*1000,'events':events,'browser_text_ms':None}
            except Exception as exc:row={'question':message,'error_type':type(exc).__name__}
            rows.append(row);save('live-qa.json',rows);print(json.dumps({k:v for k,v in row.items() if k!='events'},ensure_ascii=False),flush=True)
        # One TTS request for the actual existing selected-point introduction.
        poi=client.get('/api/knowledge/pois/beiyangyuan-datong-center').json()
        body={'request_id':str(uuid4()),'session_id':str(uuid4()),'utterance_id':str(uuid4()),'text':poi['name']+'。'+poi['description'],'voice_id':'edge:zh-CN-XiaoxiaoNeural'}
        counts['tts']+=1;save('call-budget.json',counts);start=time.perf_counter()
        try:
            response=client.post('/api/speech/tts',json=body);tts={'status':response.status_code,'synthesis_ms':(time.perf_counter()-start)*1000,'response':response.json(),'audio_playing':None,'human_listening':None,'avatar_observed':None}
            if response.status_code==200:
                audio=client.get(response.json()['audio_url']);(OUT/'selected-poi.mp3').write_bytes(audio.content);tts.update(audio_status=audio.status_code,audio_bytes=len(audio.content),sha256=hashlib.sha256(audio.content).hexdigest())
            save('live-tts.json',tts);print('TTS evidence recorded',flush=True)
        except Exception as exc:save('live-tts.json',{'error_type':type(exc).__name__})
        rows=[]
        for repeat in range(3):
            for id in ['beiyangyuan-datong-center','beiyangyuan-zhengdong-library']:
                start=time.perf_counter();response=client.get('/assets/campus/photos/'+id+'-1.jpg')
                rows.append({'id':id,'repeat':repeat,'http_ms':(time.perf_counter()-start)*1000,'status':response.status_code,'bytes':len(response.content),'etag':response.headers.get('etag'),'note':'HTTP retrieval only; no browser decode/cache/click timing'})
        save('image-http.json',rows)

if __name__=='__main__':main()
