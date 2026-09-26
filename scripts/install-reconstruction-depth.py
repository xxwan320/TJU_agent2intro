"""Pinned official Depth Anything V2 Small HF relative-depth model."""
from pathlib import Path
import hashlib,json,urllib.request
ROOT=Path(__file__).resolve().parents[1] if Path(__file__).parent.name=='scripts' else Path(r'E:\AI4TJU')
HOME=ROOT/'.reconstruction-depth';REPO='depth-anything/Depth-Anything-V2-Small-hf';REV='5426e4f0f36572d16453bbda7a8389317b1bef99'
SHA='3152477ce0d8d6978d76b995120de97cb5b928701fd0f817769f59e249a16b70'
def main():
    target=HOME/'weights';target.mkdir(parents=True,exist_ok=True)
    for name in ['README.md','config.json','preprocessor_config.json','model.safetensors']:
        p=target/name
        if p.exists() and (name!='model.safetensors' or hashlib.sha256(p.read_bytes()).hexdigest()==SHA):continue
        with urllib.request.urlopen(f'https://huggingface.co/{REPO}/resolve/{REV}/{name}',timeout=180) as response:
            p.write_bytes(response.read())
        if name=='model.safetensors' and hashlib.sha256(p.read_bytes()).hexdigest()!=SHA:raise RuntimeError('Depth model SHA256 mismatch')
        print('VERIFIED',name,p.stat().st_size,flush=True)
    (HOME/'weights.json').write_text(json.dumps({'repo':REPO,'revision':REV,'path':str(target),'weightSha256':SHA,'license':'Apache-2.0','implementation':'transformers 4.46.3 DepthAnythingForDepthEstimation'},indent=2),encoding='utf-8')
if __name__=='__main__':main()
