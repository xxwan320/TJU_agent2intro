import os,sys,json,asyncio,time,hashlib,subprocess
from pathlib import Path
from uuid import uuid4
root=Path(__file__).resolve().parents[1];sys.path.insert(0,str(root));os.chdir(root)

os.environ['LANGSMITH_TRACING']='false';os.environ['LANGCHAIN_TRACING_V2']='false'
import argparse
parser=argparse.ArgumentParser(description="Explicit live R3 comparison. Quantitative outputs stay in an ignored local directory.")
parser.add_argument('--allow-live',action='store_true',help='Authorize real model calls; no automatic retry.')
parser.add_argument('--solutions',nargs='+',choices=['direct_glm','baseline','enhanced'],default=['direct_glm','baseline','enhanced'])
parser.add_argument('--cases',nargs='+',help='Optional frozen case IDs for targeted repair verification')
parser.add_argument('--output',type=Path,default=root/'.runtime/M1-R3/comparison-final')
args=parser.parse_args()
if not args.allow_live:parser.error('--allow-live is required; full run can call the model up to 60 times')
if not os.environ.get('AI4TJU_ENV_FILE'):parser.error('M/C must explicitly set AI4TJU_ENV_FILE; secrets are never copied')
if not args.output.resolve().is_relative_to((root/'.runtime').resolve()):parser.error('Output must be in the ignored .runtime directory')
os.environ['CAMPUS_WEB_SEARCH_ENABLED']='false'
from backend.r2_contracts import R2ChatRequest
from backend.r3_contracts import TourRequest, TourCommand, PlanRevision
from backend.model.tour_evaluation import compare_entry, BASELINE_COMMIT
from backend.model.service import model
from backend.model.runtime import runtime
from backend.model.tour_service import tour_service
from backend.knowledge.service import knowledge
out=args.output;out.mkdir(parents=True,exist_ok=True)
dataset=root/'data/knowledge/r3/evaluation-v1.json';corpus=json.loads(dataset.read_text(encoding='utf-8'))
def sha(p):return hashlib.sha256(p.read_bytes().replace(b'\r\n',b'\n')).hexdigest()
manifest={'dataset_id':corpus['dataset_id'],'dataset_sha256_lf':sha(dataset),'baseline_commit':BASELINE_COMMIT,
 'build_commit':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip(),
 'code_hashes':{str(p.relative_to(root)):sha(p) for folder in ('backend/model','backend/knowledge') for p in (root/folder).glob('*.py')},
 'model':model.settings.llm_model,'data_version':knowledge.get_status().version,
 'web_search_enabled':False,'automatic_retries':0,'runs_per_case':1,'parallel_cases':2,
 'input_policy':'Frozen question unchanged. Identical date and campus preamble; itinerary uses east gate as explicit common default starting point. No gold answer sent.',
 'service_policy':'Direct GLM without retrieval; saved M0 algorithm and current algorithm share same current corpus/provider. Difference in retrieved context is part of each algorithm.',
 'task_policy':'t03 contains simulated state replay; its latency is not directly comparable to natural-language answers. Physical task completion never inferred from generation.',
 'first_content_source':'nonstream_response','first_audio_ms':None,'first_audio_status':'not_measured',
 'holdout_policy':corpus['holdout_policy']}
# Store hashes, not source or prompts, with the comparison manifest.
manifest['solutions']=args.solutions
manifest['cases']=args.cases or [q['id'] for q in corpus['questions']]
if args.cases and not set(args.cases)<=set(q['id'] for q in corpus['questions']):parser.error('Unknown frozen case ID')
(out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
# Full frozen retrieval set, with itinerary rows explicitly excluded from Recall.
legacy=json.loads((root/'data/knowledge/r3/legacy-50.json').read_text(encoding='utf-8'))['questions']
offline=[]
for q in [*legacy,*corpus['questions']]:
 hits=knowledge.search(q['query'],q['campus_id'],5) if q['kind']!='itinerary' else []
 expected=set(q.get('relevant_fact_ids',[]));found={h.id for h in hits}
 offline.append({'case_id':q['id'],'kind':q['kind'],'retrieved_ids':sorted(found),'expected_ids':sorted(expected),'recall_at_5':len(expected&found)/len(expected) if expected else None,'no_evidence_pass':not hits if q['kind']=='no_evidence' else None})
(out/'retrieval.json').write_text(json.dumps(offline,ensure_ascii=False,indent=2),encoding='utf-8')
sem=asyncio.Semaphore(2)
async def command(s,action):
 b=dict(request_id=uuid4(),session_id=s.session_id,expected_version=s.plan.version,expected_state_version=s.state_version,action=action)
 if action in ('start','resume'):b['accept_unverified']=True
 if action in ('arrive','explain','complete_stop','skip'):b['stop_id']=s.current_stop_id
 return (await tour_service.command(s.tour_id,TourCommand(**b))).session
async def run_case(index,q):
 async with sem:
  order=['direct_glm','baseline','enhanced'];order=order[index%3:]+order[:index%3];order=[mode for mode in order if mode in args.solutions]
  for mode in order:
   rid,sid=uuid4(),uuid4();is_tour=q['kind']=='itinerary';campus=q['campus_id']
   preamble='评估日期：2026-09-15。校区：'+('卫津路' if campus=='weijinlu' else '北洋园')+'。'
   if is_tour:preamble+='未另指定时从本校区东门出发；已完成状态仅供软件验证，不表示实地到达。'
   text=preamble+q['query']
   req=R2ChatRequest(request_id=rid,session_id=sid,message_id=uuid4(),message=text,
     mode='content_generation' if is_tour else 'campus_qa',campus_id=campus,
     generation={'type':'visit_plan','length':'short','style':'friendly','requirements':'缺失事实或成本必须保留未知。'} if is_tour else None)
   row={'build_commit':manifest['build_commit'],'case_id':q['id'],'solution_id':mode,'kind':q['kind'],'split':q['split'],'input_sha256':hashlib.sha256(text.encode()).hexdigest(),'status':'NOT_TESTED','first_content_ms':None,'first_audio_ms':None,'usage':None,'usage_status':'unknown','failure_retries':0,'task_completed':None,'constraint_passed':None,'fact_correctness':None}
   start=time.monotonic()
   try:
    async with asyncio.timeout(125):
     if mode=='enhanced' and is_tour:
      simulated=q['id'].startswith('t03');duration=60 if simulated or not q['id'].startswith('t02') else 30
      initial_message='了解校园文化，参观60分钟' if simulated else q['query']
      body=TourRequest(request_id=rid,session_id=sid,campus_id=campus,duration_minutes=duration,
       message=initial_message,interests=['文化','图书馆','餐饮'] if q['id'].startswith('t01') else ['校园文化'],
       start={'kind':'poi','poi_id':{'weijinlu':'weijinlu-09-teaching','beiyangyuan':'beiyangyuan-qiushi-hall'}[campus]},end={'kind':'unspecified'},
       accessibility='step_free' if q['id'].startswith('t02') else 'standard',visit_date='2026-09-15')
      result=await tour_service.create(body);s=result.session
      row['first_content_ms']=(time.monotonic()-start)*1000
      if simulated:
       s=await command(s,'check');s=await command(s,'start');s=await command(s,'arrive');s=await command(s,'complete_stop')
       first=s.plan.stops[0].model_dump(mode='json')
       s=(await tour_service.revise(s.tour_id,PlanRevision(request_id=uuid4(),session_id=sid,expected_version=s.plan.version,expected_state_version=s.state_version,operation='set_remaining_time',remaining_minutes=20))).session
       removable=next(p for p in s.plan.stops if p.stop_id!=s.current_stop_id and p.poi_id!={'weijinlu':'weijinlu-09-teaching','beiyangyuan':'beiyangyuan-qiushi-hall'}[campus])
       s=(await tour_service.revise(s.tour_id,PlanRevision(request_id=uuid4(),session_id=sid,expected_version=s.plan.version,expected_state_version=s.state_version,operation='remove_stop',stop_id=removable.stop_id))).session
       row['state_replay']={'completed_preserved':s.plan.stops[0].model_dump(mode='json')==first,'remaining_minutes':s.remaining_minutes,'stops_after_remove':len(s.plan.stops)}
      row['session']=s.model_dump(mode='json');row['usage']=result.usage.model_dump() if result.usage else None
      row['structural_pass']=all(knowledge.get_poi(p.poi_id).campus_id==campus for p in s.plan.stops) and (2<=len(s.plan.stops)<=5 if simulated else 3<=len(s.plan.stops)<=5)
      row['task_completed']=False
     else:
      if mode=='enhanced':
       record=runtime.begin(rid,sid)
       try:result=await model.generate(req);model.commit(req,result);runtime.finish(rid,'completed',len(result.answer))
       except BaseException:runtime.finish(rid,'failed');raise
      else:result=await compare_entry(mode,req)
      row['first_content_ms']=(time.monotonic()-start)*1000
      row['answer']=result.answer;row['sources']=[s.model_dump(mode='json') for s in result.sources];row['returned_model']=result.model
      row['usage']=result.usage.model_dump() if result.usage else None
     row['status']='PASS'
   except BaseException as e:
    if isinstance(e,(KeyboardInterrupt,SystemExit)):raise
    row['status']='FAIL';row['error_code']=getattr(e,'code',type(e).__name__)
   row['elapsed_ms']=(time.monotonic()-start)*1000
   traces=[t for t in runtime.traces if t['request_id']==str(rid)]
   row['model_calls']=sum(t['stage']=='model' and t['status']=='started' for t in traces)
   row['usage_status']='known' if row['usage'] is not None else 'unknown'
   row['unknown_usage_calls']=row['model_calls'] if row['usage'] is None else 0
   row['web_search_calls']=sum(t['action'].startswith('web_search.') for t in traces)
   (out/(q['id']+'-'+mode+'.json')).write_text(json.dumps(row,ensure_ascii=False,indent=2),encoding='utf-8')
   print(q['id']+' '+mode+' '+row['status'],flush=True)
async def main():
 await asyncio.gather(*(run_case(i,q) for i,q in enumerate(corpus['questions']) if not args.cases or q['id'] in args.cases))
 (out/'COMPLETE').write_text('All selected frozen R3 cases attempted once for each selected solution. See per-case statuses.\n',encoding='utf-8')
 print('Comparison run complete',flush=True)
asyncio.run(main())
