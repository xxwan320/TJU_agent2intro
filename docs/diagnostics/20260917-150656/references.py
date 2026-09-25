"""Fetch only metadata, tree and selected public text; never execute downloaded content."""
import sys, json, asyncio
from pathlib import Path
from datetime import datetime
import httpx
OUT=Path(__file__).resolve().parent/'references'
OUT.mkdir(exist_ok=True)
REPOS=['ayusudi/hangout-ai','Open-LLM-VTuber/Open-LLM-VTuber','pipecat-ai/pipecat']
async def main():
 async with httpx.AsyncClient(timeout=25,follow_redirects=True) as c:
  if len(sys.argv)==1:
   for repo in REPOS:
    name=repo.split('/')[-1]
    try:
     r=await c.get('https://api.github.com/repos/'+repo+'/commits/HEAD');r.raise_for_status();commit=r.json()['sha']
     r=await c.get('https://api.github.com/repos/'+repo+'/git/trees/'+commit,params={'recursive':'1'});r.raise_for_status()
     paths=[x['path'] for x in r.json()['tree'] if x['type']=='blob']
     metadata={'repository':repo,'read_at':datetime.now().astimezone().isoformat(),'commit':commit,'paths':paths}
     (OUT/(name+'.json')).write_text(json.dumps(metadata,indent=2),encoding='utf-8')
     readme=next((p for p in paths if p.lower()=='readme.md'),None)
     if readme:
      r=await c.get(f'https://raw.githubusercontent.com/{repo}/{commit}/{readme}');r.raise_for_status();(OUT/(name+'-README.md')).write_text(r.text,encoding='utf-8')
     print(name,commit,readme)
    except Exception as e:print(name,type(e).__name__)
  else:
   name=sys.argv[1];meta=json.loads((OUT/(name+'.json')).read_text(encoding='utf-8'))
   for path in sys.argv[2:]:
    assert path in meta['paths']
    r=await c.get(f"https://raw.githubusercontent.com/{meta['repository']}/{meta['commit']}/{path}");r.raise_for_status()
    (OUT/(name+'--'+path.replace('/','__'))).write_text(r.text,encoding='utf-8');print(path)
asyncio.run(main())
