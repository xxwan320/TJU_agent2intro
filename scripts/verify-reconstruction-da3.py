"""Verify real DA3 inference and TSDF output before enabling the local provider."""
from pathlib import Path
import argparse, hashlib, json, subprocess

ROOT=Path(__file__).resolve().parents[1]
HOME=ROOT/'.reconstruction-da3'
def digest(path):return hashlib.sha256(path.read_bytes()).hexdigest()
def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--existing-job',type=Path,help='Validate a completed local worker job instead of running the official two-photo example again.')
    args=parser.parse_args()
    folder=args.existing_job
    if folder is None:
        folder=ROOT/'.runtime/reconstruction-readiness/da3';folder.mkdir(parents=True,exist_ok=True)
        images=[HOME/'source/assets/examples/SOH'/name for name in ['000.png','010.png']]
        (folder/'job.json').write_text(json.dumps({'imagePaths':list(map(str,images)),'imageIds':['official-soh-000','official-soh-010'],'quality':'standard','removeBackground':False}),'utf-8')
        subprocess.run([str(HOME/'venv/Scripts/python.exe'),str(ROOT/'scripts/reconstruction-multiview-worker.py'),str(folder/'job.json')],cwd=ROOT,check=True)
    if not folder.is_absolute():folder=ROOT/folder
    result=json.loads((folder/'result.json').read_text('utf-8'))
    if result.get('stage')!='succeeded' or result.get('geometryConsistent') is not True:raise RuntimeError('Actual joint geometry verification failed; provider remains disabled.')
    if digest(folder/'model.glb')!=result.get('sha256'):raise RuntimeError('Output GLB hash mismatch')
    if result.get('feedback',{}).get('registeredViews',0)<2:raise RuntimeError('Two verified views required')
    source=json.loads((HOME/'source-version.json').read_text('utf-8'));weights=json.loads((HOME/'weights.json').read_text('utf-8'))
    if digest(HOME/'weights/model.safetensors')!=weights['weightSha256']:raise RuntimeError('Weights hash mismatch')
    if result.get('weightsSha256')!=weights['weightSha256'] or result.get('sourceCommit')!=source['commit']:raise RuntimeError('Evidence does not match the installed source and weights')
    ready={'provider':'depth-anything-3','model':'DA3-SMALL','sourceCommit':source['commit'],'weightsRevision':weights['revision'],'weightsSha256':weights['weightSha256'],'technicalInferenceVerified':True,'qualityAccepted':False,'maxViews':2,'verifiedExample':str(folder),'verifiedModelSha256':result['sha256'],'verifiedViewCount':2,'coordinateScale':'relative','reconstructionScope':'observed_surfaces','workerSha256':digest(ROOT/'scripts/reconstruction-multiview-worker.py'),'tsdfSha256':digest(ROOT/'scripts/reconstruction_tsdf.py')}
    (HOME/'ready.json').write_text(json.dumps(ready,indent=2),'utf-8')
    print(json.dumps({'provider':ready['provider'],'verifiedViewCount':2,'sha256':ready['verifiedModelSha256']}))
if __name__=='__main__':main()
