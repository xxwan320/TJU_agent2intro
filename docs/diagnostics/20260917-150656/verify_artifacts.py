"""Local artifact checks; do not print configuration values."""
import hashlib,json,re,subprocess
from pathlib import Path
from urllib.parse import urlsplit
OUT=Path(__file__).resolve().parent
ROOT=OUT.parents[2]
def read(name):return json.loads((OUT/name).read_text(encoding='utf-8-sig'))
data=read('probe_results.json')
assert len(data['cases'])==8
assert sum(c['calls'].get('llm',0) for c in data['cases'])==3
assert sum(c['calls'].get('maps',0) for c in data['cases'])==1
missing=[]
for c in data['cases']:
 for p in c['evidence']:
  if not (OUT/p).is_file():missing.append(p)
assert not missing,missing
pois=read('local_knowledge.json')['pois']
counts={'poi_count':len(pois),'with_location':sum(p.get('location') is not None for p in pois),'with_entrances':sum(bool(p.get('entrances')) for p in pois)}
# Check actual locally configured credential values only; never emit the values or env content.
secrets=[]
env=ROOT/'.env'
if env.is_file():
 for line in env.read_text(encoding='utf-8-sig').splitlines():
  if '=' not in line or line.lstrip().startswith('#'):continue
  name,value=line.split('=',1)
  value=value.strip().strip('"\'')
  if re.search('KEY|SECRET|TOKEN|PASSWORD',name,re.I) and len(value)>=8:secrets.append(value)
leaks=[];credential_urls=[]
for p in OUT.rglob('*'):
 if not p.is_file() or p.suffix not in ('.md','.json','.py','.mjs','.txt','.ts','.js'):continue
 text=p.read_text(encoding='utf-8-sig')
 if any(s in text for s in secrets):leaks.append(str(p.relative_to(OUT)))
 for url in re.findall(r'https?://[^\s<>"\')]+',text):
  try:
   parsed=urlsplit(url)
   if parsed.username or parsed.password:credential_urls.append(str(p.relative_to(OUT)))
  except ValueError:pass
assert not leaks, 'credential value detected in output artifacts'
assert not credential_urls, 'credential URL detected in output artifacts'
result={'json_valid':True,'case_count':8,'missing_evidence':missing,'local_secret_value_leaks':leaks,'credential_url_files':credential_urls,'data_counts':counts,'source_changed':read('final_check.json')['changed_tracked_files'],'diagnostic_files':sum(p.is_file() for p in OUT.rglob('*')),'business_change_check':'tracked SHA256 plus git diff/status; user preexisting untracked worktrees untouched'}
(OUT/'artifact_verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(result,ensure_ascii=False))
