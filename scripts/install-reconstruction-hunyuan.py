"""Install isolated, pinned official Hunyuan3D-2mini shape inference only."""
from pathlib import Path
import concurrent.futures, hashlib, json, os, subprocess, sys, time, urllib.request

ROOT=Path(__file__).resolve().parents[1] if Path(__file__).parent.name=='scripts' else Path(r'E:\AI4TJU')
HOME=ROOT/'.reconstruction-hunyuan'
SOURCE='f8db63096c8282cb27354314d896feba5ba6ff8a'
REVISION='f90a0f7df7d5e6f71109cf333f6a95a0ae3194a6'
WEIGHT_SHA='3cc66f3bea33e4062b7dbc875ffe1d70c4888914aec3e91b60f94e9bd01b522b'
WEIGHT_BYTES=3819958234
SUBFOLDER='hunyuan3d-dit-v2-mini'
MODEL_REPO='tencent/Hunyuan3D-2mini'
WEIGHT_HOME='weights'
WEIGHT_META='weights.json'
PART_HOME='weight-parts'
TURBO='--turbo' in sys.argv
if TURBO:
    REVISION='b84a30f453ff5d92ea51556ca8a37713910fd97b'
    WEIGHT_SHA='bdbcef30dd0149a281e17d5b5b1fdad1122c904e098a42f3100e04e03c247bc4'
    WEIGHT_BYTES=3819958234
    SUBFOLDER='hunyuan3d-dit-v2-mini-turbo'
    WEIGHT_HOME='weights-turbo'
    WEIGHT_META='weights-turbo.json'
    PART_HOME='weight-parts-turbo'
elif '--full' in sys.argv:
    REVISION='9cd649ba6913f7a852e3286bad86bfa9a2d83dcf'
    WEIGHT_SHA='360bc281fc956d4acac0c3d36d5ec0ebf8cdddbf4b8892e894d12419388d479b'
    WEIGHT_BYTES=4928151562
    SUBFOLDER='hunyuan3d-dit-v2-0'
    MODEL_REPO='tencent/Hunyuan3D-2'
    WEIGHT_HOME='weights-full'
    WEIGHT_META='weights-full.json'
    PART_HOME='weight-parts-full'

def get(url):
    with urllib.request.urlopen(url,timeout=90) as response:return response.read()

def digest(path):
    h=hashlib.sha256()
    with path.open('rb') as f:
        for data in iter(lambda:f.read(8*1024*1024),b''):h.update(data)
    return h.hexdigest()

def run(args):subprocess.run(list(map(str,args)),check=True,cwd=ROOT)

def source():
    base=HOME/'source';base.mkdir(exist_ok=True)
    tree=json.loads(get(f'https://api.github.com/repos/Tencent-Hunyuan/Hunyuan3D-2/git/trees/{SOURCE}?recursive=1'))
    names=[v['path'] for v in tree['tree'] if v['type']=='blob' and (v['path'].startswith('hy3dgen/shapegen/') or v['path'] in ('hy3dgen/__init__.py','LICENSE','NOTICE','README.md'))]
    def item(name):
        p=base/name;p.parent.mkdir(parents=True,exist_ok=True)
        if not p.exists():p.write_bytes(get(f'https://raw.githubusercontent.com/Tencent-Hunyuan/Hunyuan3D-2/{SOURCE}/{name}'))
        return {'path':name,'sha256':digest(p)}
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:manifest=list(pool.map(item,names))
    (HOME/'source-version.json').write_text(json.dumps({'repository':'https://github.com/Tencent-Hunyuan/Hunyuan3D-2','commit':SOURCE,'files':manifest},indent=2),encoding='utf-8')
    print('SOURCE_READY',len(names),flush=True)

def dependencies():
    py=HOME/'venv/Scripts/python.exe'
    if not py.exists():run([sys.executable,'-m','venv',HOME/'venv'])
    site=HOME/'venv/Lib/site-packages'
    (site/'reused-torch.pth').write_text(str(ROOT/'.reconstruction/venv/Lib/site-packages')+'\n',encoding='utf-8')
    run([py,'-m','pip','install','--no-deps','diffusers==0.33.1','transformers==4.46.3','accelerate==1.6.0','safetensors==0.5.3','einops==0.8.1','huggingface-hub==0.30.2','tokenizers==0.20.3','pymeshlab==2023.12.post3','pygltflib==1.16.4','dataclasses-json==0.6.7','marshmallow==3.26.1','typing-inspect==0.9.0','mypy-extensions==1.0.0','deprecated==1.2.18','wrapt==1.17.2'])
    print('DEPENDENCIES_READY',flush=True)

def weights():
    target=HOME/WEIGHT_HOME/SUBFOLDER/'model.fp16.safetensors';target.parent.mkdir(parents=True,exist_ok=True)
    for name in ['LICENSE','README.md',SUBFOLDER+'/config.yaml']:
        p=HOME/WEIGHT_HOME/name;p.parent.mkdir(parents=True,exist_ok=True)
        if not p.exists():p.write_bytes(get(f'https://huggingface.co/{MODEL_REPO}/resolve/{REVISION}/{name}'))
    if not (target.exists() and target.stat().st_size==WEIGHT_BYTES and digest(target)==WEIGHT_SHA):
        chunks=HOME/PART_HOME;chunks.mkdir(exist_ok=True);size=16*1024*1024
        def part(start):
            end=min(WEIGHT_BYTES,start+size)-1;p=chunks/str(start)
            if p.exists() and p.stat().st_size==end-start+1:return p
            for attempt in range(4):
                try:
                    req=urllib.request.Request(f'https://huggingface.co/{MODEL_REPO}/resolve/{REVISION}/{SUBFOLDER}/model.fp16.safetensors?part={start}',headers={'Range':f'bytes={start}-{end}'})
                    with urllib.request.urlopen(req,timeout=180) as response:
                        if response.status!=206 or not response.headers.get('Content-Range','').startswith(f'bytes {start}-{end}/'):raise ValueError('Unexpected weight range response')
                        data=response.read()
                    if len(data)!=end-start+1:raise ValueError('Incomplete weight range')
                    p.write_bytes(data);return p
                except Exception:
                    if attempt==3:raise
                    time.sleep(2*(attempt+1))
        starts=list(range(0,WEIGHT_BYTES,size));done=0
        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
            for p in pool.map(part,starts):
                done+=1
                if done%8==0:print('WEIGHT_PROGRESS',done,len(starts),flush=True)
        assembled=target.with_suffix('.download')
        with assembled.open('wb') as out:
            for start in starts:
                with (chunks/str(start)).open('rb') as sourcefile:
                    for data in iter(lambda:sourcefile.read(1024*1024),b''):out.write(data)
        if digest(assembled)!=WEIGHT_SHA:raise ValueError('Weight SHA256 mismatch')
        assembled.replace(target)
    (HOME/WEIGHT_META).write_text(json.dumps({'repo':MODEL_REPO,'revision':REVISION,'path':str(target.parent.parent),'subfolder':SUBFOLDER,'weightSha256':WEIGHT_SHA,'bytes':WEIGHT_BYTES},indent=2),encoding='utf-8')
    print('WEIGHTS_VERIFIED',flush=True)

def turbo_vae():
    subfolder='hunyuan3d-vae-v2-mini-turbo';size=407410402
    checksum='5dcaca67a8da9e7079fb7b55714a572d0651ac95983bb43099913feaf6738f94'
    target=HOME/'model-cache'/MODEL_REPO/subfolder/'model.fp16.safetensors';target.parent.mkdir(parents=True,exist_ok=True)
    config=target.parent/'config.yaml'
    if not config.exists():config.write_bytes(get(f'https://huggingface.co/{MODEL_REPO}/resolve/{REVISION}/{subfolder}/config.yaml'))
    chunks=HOME/'weight-parts-vae-turbo';chunks.mkdir(exist_ok=True);part_size=16*1024*1024
    def part(start):
        end=min(size,start+part_size)-1;p=chunks/str(start)
        if p.exists() and p.stat().st_size==end-start+1:return p
        for attempt in range(4):
            try:
                req=urllib.request.Request(f'https://huggingface.co/{MODEL_REPO}/resolve/{REVISION}/{subfolder}/model.fp16.safetensors?part={start}',headers={'Range':f'bytes={start}-{end}'})
                with urllib.request.urlopen(req,timeout=180) as response:
                    if response.status!=206 or not response.headers.get('Content-Range','').startswith(f'bytes {start}-{end}/'):raise ValueError('Unexpected Turbo VAE range response')
                    data=response.read()
                if len(data)!=end-start+1:raise ValueError('Incomplete Turbo VAE weight range')
                p.write_bytes(data);return p
            except Exception:
                if attempt==3:raise
                time.sleep(2*(attempt+1))
    starts=list(range(0,size,part_size));done=0
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        for p in pool.map(part,starts):
            done+=1
            if done%8==0:print('TURBO_VAE_PROGRESS',done,len(starts),flush=True)
    assembled=target.with_suffix('.download')
    with assembled.open('wb') as out:
        for start in starts:
            with (chunks/str(start)).open('rb') as sourcefile:
                for data in iter(lambda:sourcefile.read(1024*1024),b''):out.write(data)
    if digest(assembled)!=checksum:raise ValueError('Turbo VAE SHA256 mismatch')
    assembled.replace(target)
    (HOME/'weights-turbo-vae.json').write_text(json.dumps({'repo':MODEL_REPO,'revision':REVISION,'path':str(HOME/'model-cache'),'subfolder':subfolder,'weightSha256':checksum,'bytes':size},indent=2),encoding='utf-8')
    print('TURBO_VAE_VERIFIED',flush=True)

if __name__=='__main__':
    HOME.mkdir(exist_ok=True)
    if '--weights-only' in sys.argv:
        weights()
        if TURBO:turbo_vae()
        print('INSTALL_COMPLETE',flush=True);sys.exit(0)
    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        for future in [pool.submit(source),pool.submit(dependencies),pool.submit(weights)]:future.result()
    if TURBO:turbo_vae()
    ready={
        'provider':'hunyuan3d-2mini-turbo' if TURBO else 'hunyuan3d-2' if '--full' in sys.argv else 'hunyuan3d-2mini',
        'sourceRepository':'https://github.com/Tencent-Hunyuan/Hunyuan3D-2',
        'sourceCommit':SOURCE,
        'weightsRepository':MODEL_REPO,
        'weightsRevision':REVISION,
        'weightsSha256':WEIGHT_SHA,
        'weightsBytes':WEIGHT_BYTES,
        'installationComplete':True,
        'technicalInferenceVerified':False,
    }
    marker=HOME/('ready-turbo.json' if TURBO else 'ready-full.json' if '--full' in sys.argv else 'ready.json')
    marker.write_text(json.dumps(ready,indent=2),encoding='utf-8')
    print('INSTALL_COMPLETE',flush=True)
