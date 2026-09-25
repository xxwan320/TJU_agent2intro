"""Optional text generation/recovery: run after install-reconstruction.py.
Usage: .venv/Scripts/python.exe scripts/install-reconstruction-extras.py [--verify]
TripoSR's normal fast path does not import these models or dependencies.
"""
from pathlib import Path
import sys,subprocess,json,os,hashlib,concurrent.futures,time,shutil
ROOT=Path(__file__).resolve().parents[1]
SHAPE='50131012ee11c9d2617f3886c10f000d3c7a3b43'
CLIP='d05afc436d78f1c48dc0dbf8e5980a9d471f35f6'
VISION='7e3e67edbbed1bf9888184d9df282b700a323964'
def run(args):subprocess.run([str(a) for a in args],cwd=ROOT,check=True)
def install():
 py=ROOT/'.reconstruction/venv/Scripts/python.exe'
 if not py.is_file():raise SystemExit('Run scripts/install-reconstruction.py first')
 if '--verify' not in sys.argv:
  for name,url,commit in [('shap-e','https://github.com/openai/shap-e.git',SHAPE),('CLIP','https://github.com/openai/CLIP.git',CLIP)]:
   repo=ROOT/'.reconstruction'/name
   if not repo.exists():
    bundled=ROOT/'models/vendor'/name
    if bundled.is_dir():shutil.copytree(bundled,repo)
    else:run(['git','clone',url,repo])
   if (repo/'.git').exists():run(['git','-C',repo,'checkout','--detach',commit])
  run([py,'-m','ensurepip','--upgrade'])
  run([py,'-m','pip','install','--no-deps',ROOT/'.reconstruction/CLIP','blobfile==3.3.0','ftfy==6.3.1','humanize==4.16.0','fire==0.7.1','pycryptodomex==3.23.0','lxml==6.1.3','wcwidth==0.9.1','termcolor==3.3.0'])
  run([py,'-m','pip','install','--target',ROOT/'.vision/packages','transformers==4.57.6','numpy==1.26.4','pillow==11.3.0'])
 run([py,Path(__file__),'--worker',*(['--verify'] if '--verify' in sys.argv else [])])
if '--worker' not in sys.argv:
 if __name__=='__main__':install()
 sys.exit(0)
sys.path[:0]=[str(ROOT/'.vision/packages'),str(ROOT/'.reconstruction/shap-e'),str(ROOT/'.reconstruction/CLIP')]
import requests,clip
from shap_e.models.download import MODEL_PATHS,CONFIG_PATHS,URL_HASHES,fetch_file_cached
from huggingface_hub import HfApi,hf_hub_download
cache=ROOT/'.reconstruction/shap-e-weights';cache.mkdir(parents=True,exist_ok=True)
def download(url,expected):
 target=cache/url.split('/')[-1]
 if target.is_file() and hashlib.sha256(target.read_bytes()).hexdigest()==expected:return
 if '--verify' in sys.argv:raise SystemExit('Missing or invalid weight: '+target.name)
 probe=requests.get(url,headers={'Range':'bytes=0-0'},timeout=40)
 assert probe.status_code==206,('server lacks ranges',probe.status_code)
 size=int(probe.headers['Content-Range'].split('/')[-1]);print('RANGE_START',target.name,size,flush=True)
 partdir=cache/(target.name+'.parts');partdir.mkdir(exist_ok=True);chunk=4*1024*1024
 def part(start):
  end=min(size,start+chunk)-1;p=partdir/str(start)
  if p.exists() and p.stat().st_size==end-start+1:return p
  for attempt in range(3):
   try:
    response=requests.get(url,headers={'Range':f'bytes={start}-{end}'},timeout=(20,90));assert response.status_code==206
    data=response.content;assert len(data)==end-start+1;p.write_bytes(data);return p
   except Exception:
    if attempt==2:raise
    time.sleep(1)
 starts=list(range(0,size,chunk));done=0
 with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
  for p in pool.map(part,starts):
   done+=1
   if done%20==0:print('RANGE_PROGRESS',target.name,done,len(starts),flush=True)
 with target.with_suffix('.assembled').open('wb') as out:
  for start in starts:out.write((partdir/str(start)).read_bytes())
 assembled=target.with_suffix('.assembled');assert hashlib.sha256(assembled.read_bytes()).hexdigest()==expected;assembled.replace(target)
 print('RANGE_VERIFIED',target.name,flush=True)

bundle=ROOT/'models/weights'
for source,name in [('vector_decoder.pt','decoder'),('text_cond.pt','text300M'),('ViT-L-14.pt','clip')]:
 sourcefile=bundle/('shap-e' if name!='clip' else 'shap-e')/source
 if sourcefile.is_file():
  target=cache/sourcefile.name
  if not target.is_file():shutil.copy2(sourcefile,target)
for name in ('decoder','text300M'):download(MODEL_PATHS[name],URL_HASHES[MODEL_PATHS[name]])
for name in ('decoder','text300M','diffusion'):fetch_file_cached(CONFIG_PATHS[name],cache_dir=str(cache))
url=clip.clip._MODELS['ViT-L/14'];download(url,url.split('/')[-2])
(ROOT/'.reconstruction/shap-e-version.json').write_text(json.dumps({'commit':SHAPE,'cache':str(cache)}))
repo='HuggingFaceTB/SmolVLM-256M-Instruct';cache=ROOT/'.vision/weights';cache.mkdir(parents=True,exist_ok=True)
bundle=ROOT/'models/weights/smolvlm'
if bundle.is_dir():
 for sourcefile in bundle.iterdir():
  if sourcefile.is_file() and not (cache/sourcefile.name).exists():shutil.copy2(sourcefile,cache/sourcefile.name)
if '--verify' in sys.argv:
 meta=json.loads((ROOT/'.vision/weights.json').read_text());assert meta['revision']==VISION
 assert hashlib.sha256((cache/'model.safetensors').read_bytes()).hexdigest()==meta['weightSha256']
else:
 if not (cache/'model.safetensors').is_file():
  info=HfApi().model_info(repo,revision=VISION,files_metadata=True)
  for file in info.siblings:
   name=file.rfilename
   if '/' in name or not name.endswith(('.json','.safetensors','.jinja','.txt')):continue
   if name.endswith('.safetensors'):download(f'https://huggingface.co/{repo}/resolve/{VISION}/{name}',file.lfs.sha256)
   else:shutil.copyfile(hf_hub_download(repo,name,revision=VISION),cache/name)
 (ROOT/'.vision/weights.json').write_text(json.dumps({'repo':repo,'revision':VISION,'path':str(cache),'weightSha256':hashlib.sha256((cache/'model.safetensors').read_bytes()).hexdigest()}))
print('Optional text generation and image-description recovery weights verified.')
