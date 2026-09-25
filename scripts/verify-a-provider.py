"""Reproducible A source samples and cold/warm timings; --live enables bounded HTTP.

Run from project root: .venv/Scripts/python.exe -B scripts/verify-a-provider.py --live
No model requests, credential values, microphone activation or production uploads.
"""
import argparse
import asyncio
import json
import statistics
import sys
import time
from datetime import datetime, timezone, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from backend.harness_contracts import ToolRequest, ToolContext
from backend.knowledge.harness_provider import ADataProvider
from backend.knowledge.service import knowledge

POIS = ('beiyangyuan-zhengdong-library','beiyangyuan-datong-center','beiyangyuan-shangxian-stone')


def request(name, query, pid, call):
    return ToolRequest(runId='a-source-probe',toolCallId=call,toolName=name,
        input={'query':query,'poiId':pid}, context=ToolContext(sessionId='a-source-probe',campusId='beiyangyuan',channel='probe',generation=1),
        deadlineAt=datetime.now(timezone.utc)+timedelta(seconds=3.5),cancelToken='a-source-probe')


async def run(live):
    output = ROOT/'docs/diagnostics/harness-a'
    output.mkdir(parents=True,exist_ok=True)
    started = datetime.now(timezone.utc).isoformat()
    timings, samples, sources, budget = [], [], {}, {'pageFetches':0,'searchRequests':0,'modelRequests':0}
    for pid in POIS:
        poi = knowledge.get_poi(pid)
        p = ADataProvider()
        local = await p.execute_tool(request('knowledge_search',poi.name,pid,'local-'+pid))
        sample = {'poiId':pid,'campusId':poi.campus_id,'title':poi.name,
                  'description':poi.description,'spokenIntroduction':None,'currentAccess':'unknown','facts':[]}
        for source in local.sources:
            record = knowledge.get_evidence_record(source.sourceId)
            meta = (record or {}).get('metadata',{})
            sample['facts'].append({**source.model_dump(mode='json'), 'poiId':pid,'campusId':poi.campus_id,
                'validFrom':meta.get('valid_from'),'validUntil':meta.get('valid_until'),
                'provenance':'existing_local_fact','currentVerified':False})
        meaningful = [s for s in local.sources if not s.sourceId.startswith('poi-')]
        sample['spokenIntroduction'] = ' '.join(s.excerpt for s in meaningful[:2]) or poi.description
        sample['spokenSourceIds'] = [s.sourceId for s in meaningful[:2]]
        await p.retriever.client.aclose()
        for tool in (('knowledge_search','official_search') if live else ('knowledge_search',)):
            cold, warm, results = [], [], []
            for i in range(3):
                provider = ADataProvider()
                for category, values in (('cold',cold),('warm',warm)):
                    start = time.perf_counter()
                    result = await provider.execute_tool(request(tool,poi.name+'介绍',pid,f'{tool}-{pid}-{i}-{category}'))
                    elapsed = round((time.perf_counter()-start)*1000,3)
                    values.append(elapsed)
                    data = result.model_dump(mode='json')
                    data['timingCategory'] = category
                    results.append(data)
                    ledger=result.data.get('callLedger',{})
                    for k in budget:budget[k]+=ledger.get(k,0)
                    for source in result.sources:
                        sources[(source.registryId,source.url)] = {'registryId':source.registryId,'url':source.url,
                            'lastCheckedAt':source.fetchedAt, 'status':'PASS_REAL', 'scope':'adapter extracted relevant evidence'}
                    if tool=='official_search' and category=='cold' and i==0:
                        sample['liveEvidence']=[s.model_dump(mode='json') for s in result.sources]
                await provider.retriever.client.aclose()
            timings.append({'tool':tool,'poiId':pid,'coldMs':cold,'warmMs':warm,
                'coldMedianMs':statistics.median(cold),'warmMedianMs':statistics.median(warm),
                'scope':'fresh provider vs same-provider repeat; OS/network caches not controlled; not page render timing',
                'results':results})
        samples.append(sample)
    registry=json.loads((ROOT/'docs/evaluation/starter/source_registry.json').read_text('utf-8'))
    observations=[]
    for source in registry['sources']:
        hits=[row for row in sources.values() if row['registryId']==source['id']]
        observations.append({'registryId':source['id'],'entryUrls':source['seed_urls'],
            'topics':source['topics'],'trustTier':source['tier'],'fetchMethod':'existing registered HTML parser',
            'enabled':source['enabled'],'status':'PASS_REAL' if hits else 'NOT_RUN',
            'lastCheckedAt':max((h['lastCheckedAt'] for h in hits),default=None),
            'priorVerification':source['verification'],'observations':hits})
    report={'startedAt':started,'finishedAt':datetime.now(timezone.utc).isoformat(),
        'liveNetworkEnabled':live,'callLedger':budget,'sources':observations,'timings':timings,
        'limitations':['Desktop microphone and physical mobile not exercised','No model calls',
                      'Unknown dates remain null; local fetchedAt is not rewritten',
                      'Network failures are not proof of no announcements']}
    (output/'provider-probe.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),'utf-8')
    (ROOT/'data/knowledge/a_fact_samples.json').write_text(json.dumps(samples,ensure_ascii=False,indent=2),'utf-8')
    (ROOT/'data/knowledge/a_source_observations.json').write_text(json.dumps(observations,ensure_ascii=False,indent=2),'utf-8')
    print(json.dumps({'callLedger':budget,'timings':[{k:v for k,v in t.items() if k!='results'} for t in timings],
                      'resultStatuses':[[r['status'] for r in t['results']] for t in timings]},ensure_ascii=False))


if __name__=='__main__':
    args=argparse.ArgumentParser()
    args.add_argument('--live',action='store_true')
    asyncio.run(run(args.parse_args().live))
