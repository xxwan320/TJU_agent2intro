"""Install pinned official TripoSR in an isolated Windows environment.

Run with the project's Python: .venv/Scripts/python.exe scripts/install-reconstruction.py
Weights and generated assets stay local and are excluded from git.
"""
from pathlib import Path
import json,subprocess,sys
ROOT=Path(__file__).resolve().parents[1]
HOME=ROOT/'.reconstruction'
COMMIT='107cefdc244c39106fa830359024f6a2f1c78871'
WEIGHTS='5b521936b01fbe1890f6f9baed0254ab6351c04a'

def run(args):subprocess.run([str(a) for a in args],cwd=ROOT,check=True)
def main():
    HOME.mkdir(exist_ok=True);py=HOME/'venv/Scripts/python.exe';repo=HOME/'TripoSR'
    if not py.exists():run([sys.executable,'-m','venv',HOME/'venv'])
    if not repo.exists():run(['git','clone','https://github.com/VAST-AI-Research/TripoSR.git',repo])
    run(['git','-C',repo,'checkout','--detach',COMMIT])
    (HOME/'source-version.json').write_text(json.dumps({'repository':'https://github.com/VAST-AI-Research/TripoSR','commit':COMMIT,'license':'MIT'}))
    run([py,'-m','pip','install','--upgrade','pip==26.2.1'])
    run([py,'-m','pip','install','--timeout','120','--retries','2','torch==2.7.1','torchvision==0.22.1','--index-url','https://download.pytorch.org/whl/cu128'])
    run([py,'-m','pip','install','omegaconf==2.3.0','Pillow==10.4.0','einops==0.7.0','transformers==4.35.0','trimesh==4.4.9','huggingface-hub==0.17.3','rembg==2.0.59','onnxruntime==1.20.1','imageio[ffmpeg]==2.37.4','scikit-image==0.24.0','numpy==1.26.4','opencv-python-headless==4.10.0.84'])
    (HOME/'compat').mkdir(exist_ok=True)
    (HOME/'compat/torchmcubes.py').write_text('import torch\nfrom skimage.measure import marching_cubes as mc\ndef marching_cubes(volume, threshold):\n v,f,_,_=mc(volume.detach().cpu().numpy(),level=threshold)\n return torch.from_numpy(v[:,[2,1,0]].copy()),torch.from_numpy(f.astype("int64").copy())\n')
    run([py,'-c',f'from huggingface_hub import snapshot_download; import pathlib,json; p=snapshot_download("stabilityai/TripoSR",revision="{WEIGHTS}",allow_patterns=["config.yaml","model.ckpt"]); pathlib.Path(".reconstruction/weights.json").write_text(json.dumps({{"repo":"stabilityai/TripoSR","path":p,"revision":"{WEIGHTS}"}}))'])
    run([py,'-c',"import rembg,torch; rembg.new_session('u2net',providers=['CPUExecutionProvider']); x=torch.randn(64,64,device='cuda'); assert torch.isfinite(x@x).all(); print(torch.cuda.get_device_name(),torch.version.cuda)"])
    print('Installed. Run a reconstruction job to validate mesh extraction and output quality.')
if __name__=='__main__':main()
