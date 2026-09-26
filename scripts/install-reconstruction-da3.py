"""Pinned official DA3-SMALL core inference; separate env, no CUDA replacement."""
from pathlib import Path
import concurrent.futures,hashlib,json,subprocess,sys,time,urllib.request
ROOT=Path(__file__).resolve().parents[1] if Path(__file__).parent.name=='scripts' else Path(r'E:\AI4TJU')
HOME=ROOT/'.reconstruction-da3'
COMMIT='3d835ec1a5802d64a8b8b15f817a1ab54809bfe4'
REVISION='e08cab65ca0ec38e7826075418411ab90cab4da3'
SHA='364492e38a3a06d221ac75da7f6621ada3f2361cd24fde11ba79091e9f40efcf'
SIZE=137248940
def get(url):
    with urllib.request.urlopen(url,timeout=120) as r:return r.read()
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def source():
    tree=json.loads(get(f'https://api.github.com/repos/ByteDance-Seed/Depth-Anything-3/git/trees/{COMMIT}?recursive=1'))
    names=[x['path'] for x in tree['tree'] if x['type']=='blob' and (x['path'].startswith('src/') or x['path'] in ['LICENSE','README.md','pyproject.toml'] or x['path'].startswith('assets/examples/SOH/'))]
    def item(n):
        p=HOME/'source'/n;p.parent.mkdir(parents=True,exist_ok=True)
        if not p.exists():p.write_bytes(get(f'https://raw.githubusercontent.com/ByteDance-Seed/Depth-Anything-3/{COMMIT}/{n}'))
        return {'path':n,'sha256':sha(p)}
    with concurrent.futures.ThreadPoolExecutor(8) as pool:manifest=list(pool.map(item,names))
    (HOME/'source-version.json').write_text(json.dumps({'repository':'https://github.com/ByteDance-Seed/Depth-Anything-3','commit':COMMIT,'files':manifest},indent=2),'utf-8')
    print('SOURCE_READY',len(names),flush=True)
def environment():
    py=HOME/'venv/Scripts/python.exe'
    # Match the ABI of the shared CUDA wheels (the system Python may differ).
    base_python=ROOT/'.reconstruction/venv/Scripts/python.exe'
    if py.exists():
        old_version=subprocess.check_output([str(py),'--version'],text=True).strip()
        base_version=subprocess.check_output([str(base_python),'--version'],text=True).strip()
        if old_version!=base_version:
            target=HOME/('venv-incompatible-'+str(int(time.time())))
            if (HOME/'venv').resolve().parent!=HOME.resolve():raise ValueError('Unsafe environment path')
            (HOME/'venv').rename(target)
    if not py.exists():subprocess.run([str(base_python),'-m','venv',str(HOME/'venv')],check=True)
    site=HOME/'venv/Lib/site-packages'
    paths=[ROOT/'.reconstruction-hunyuan/venv/Lib/site-packages',ROOT/'.reconstruction/venv/Lib/site-packages',HOME/'source/src']
    (site/'ai4tju-shared-inference.pth').write_text('\n'.join(map(str,paths))+'\n','utf-8')
    # torch/numpy/etc come from the existing isolated reconstruction env. Never upgrade it.
    packages=['evo==1.37.1','pycolmap==4.2.0','plyfile==1.1.5','addict==2.4.0','moviepy==1.0.3','decorator==4.4.2','proglog==0.1.12','imageio-ffmpeg==0.6.0','natsort==8.4.0','argcomplete==3.7.2','colorama==0.4.6','ruamel.yaml==0.19.1']
    packages+=['matplotlib==3.10.1','contourpy==1.3.2','cycler==0.12.1','fonttools==4.57.0','kiwisolver==1.4.8','pyparsing==3.2.3','python-dateutil==2.9.0.post0','six==1.17.0']
    subprocess.run([str(py),'-m','pip','install','--no-deps',*packages],check=True)
    (HOME/'dependencies.json').write_text(json.dumps({'packages':packages,'sharedPaths':list(map(str,paths)),'attention':'official torch SDPA; xformers optional fallback','excludedOptional':'gsplat/e3nn are not required for depth+camera inference'},indent=2),'utf-8')
    print('ENVIRONMENT_READY',flush=True)
def weights():
    base=HOME/'weights';base.mkdir(exist_ok=True)
    for n in ['README.md','config.json']:
        p=base/n
        if not p.exists():p.write_bytes(get(f'https://huggingface.co/depth-anything/DA3-SMALL/resolve/{REVISION}/{n}'))
    p=base/'model.safetensors'
    if not(p.exists() and p.stat().st_size==SIZE and sha(p)==SHA):
        parts=HOME/'download-parts';parts.mkdir(exist_ok=True);chunk=16*1024*1024
        def download(start):
            end=min(start+chunk,SIZE)-1;q=parts/str(start)
            if q.exists() and q.stat().st_size==end-start+1:return q
            url=f'https://huggingface.co/depth-anything/DA3-SMALL/resolve/{REVISION}/model.safetensors?part={start}'
            request=urllib.request.Request(url,headers={'Range':f'bytes={start}-{end}'})
            with urllib.request.urlopen(request,timeout=180) as r:data=r.read()
            if len(data)!=end-start+1:raise ValueError('Invalid range response')
            q.write_bytes(data);return q
        with concurrent.futures.ThreadPoolExecutor(6) as pool:downloaded=list(pool.map(download,range(0,SIZE,chunk)))
        with p.open('wb') as f:
            for q in downloaded:f.write(q.read_bytes())
        if sha(p)!=SHA:raise ValueError('Weight SHA mismatch')
    (HOME/'weights.json').write_text(json.dumps({'repo':'depth-anything/DA3-SMALL','revision':REVISION,'weightSha256':SHA,'bytes':SIZE,'path':str(base),'license':'Apache-2.0'},indent=2),'utf-8')
    print('WEIGHTS_READY',SIZE,SHA,flush=True)
if __name__=='__main__':
    HOME.mkdir(exist_ok=True);source();environment();weights()
