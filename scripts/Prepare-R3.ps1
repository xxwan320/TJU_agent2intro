# M-only: validate ALL original trees, fast-forward only, then isolated frozen dependency checks.
param([string]$Baseline='r3-launch')
$ErrorActionPreference='Stop'
$root=[IO.Path]::GetFullPath((Split-Path -Parent $PSScriptRoot))
Set-Location $root
function Invoke-GitChecked([string]$path,[string[]]$arguments) {
 $output=& git -C $path @arguments
 if($LASTEXITCODE -ne 0){throw "Git check failed in $path"}
 return $output
}
$launch=(Invoke-GitChecked $root @('rev-parse',"refs/tags/$Baseline")).Trim()
if($launch -notmatch '^[0-9a-f]{40}$'){throw 'Missing immutable baseline'}
if((Invoke-GitChecked $root @('rev-parse','HEAD')).Trim() -ne $launch){throw 'M HEAD differs from frozen baseline'}
if(Invoke-GitChecked $root @('status','--porcelain')){throw 'M worktree is dirty'}
$spec=@(
 @{window='A';name='ui';branch='work/ui';web_port=5174;api_port=8001;fixture_port=8011},
 @{window='B';name='avatar';branch='work/avatar';web_port=5175;api_port=8002;fixture_port=8012},
 @{window='C';name='api';branch='work/api';web_port=5176;api_port=8003;fixture_port=8013},
 @{window='D';name='knowledge';branch='work/knowledge';web_port=5177;api_port=8004;fixture_port=8014}
)
foreach($item in $spec){
 $path=[IO.Path]::GetFullPath((Join-Path $root ('.worktrees\'+$item.name)))
 if(-not $path.StartsWith($root+'\',[StringComparison]::OrdinalIgnoreCase)){throw 'Outside workspace'}
 if((Invoke-GitChecked $path @('rev-parse','--show-toplevel')).Trim().Replace('/','\') -ne $path){throw 'Unexpected Git boundary'}
 if((Invoke-GitChecked $path @('branch','--show-current')).Trim() -ne $item.branch){throw 'Unexpected worktree branch'}
 if(Invoke-GitChecked $path @('status','--porcelain')){throw "Uncommitted changes; preserve $path"}
 Invoke-GitChecked $path @('merge-base','--is-ancestor','HEAD',$launch) | Out-Null
 foreach($name in @('node_modules','.venv','.tools','.runtime')){
  $dir=Join-Path $path $name
  if(-not(Test-Path -LiteralPath $dir)){throw "Missing independent dependency directory: $dir"}
  if((Get-Item -LiteralPath $dir).Attributes -band [IO.FileAttributes]::ReparsePoint){throw "Writable dependency link: $dir"}
 }
 if(Test-Path -LiteralPath (Join-Path $path '.env')){throw "Unexpected .env; preserve $path"}
 $item.path=$path
}
$stateDir=Join-Path $root '.runtime\R3'
[IO.Directory]::CreateDirectory($stateDir)|Out-Null
$receipt=Join-Path $stateDir 'parallel-state.json'
$result=@()
$oldEnvFile=$env:AI4TJU_ENV_FILE
$oldWebSearch=$env:CAMPUS_WEB_SEARCH_ENABLED
# Do not inherit the main .env in worktree validation.
$env:AI4TJU_ENV_FILE=$null
$env:CAMPUS_WEB_SEARCH_ENABLED='false'
try {
 foreach($item in $spec){
  $path=$item.path
  if(Invoke-GitChecked $path @('status','--porcelain')){throw "Tree changed during preparation: $path"}
  Invoke-GitChecked $path @('merge','--ff-only','--quiet',$launch)|Out-Null
  Push-Location $path
  try {
   $runtime=Join-Path $path '.runtime'
   $uv=Start-Process -FilePath (Join-Path $path '.tools\Scripts\uv.exe') -ArgumentList @('sync','--offline','--frozen','--link-mode','copy') -WorkingDirectory $path -WindowStyle Hidden -Wait -PassThru -RedirectStandardOutput (Join-Path $runtime 'r3-sync.stdout.log') -RedirectStandardError (Join-Path $runtime 'r3-sync.stderr.log')
   if($uv.ExitCode -ne 0){throw "Frozen offline dependency sync failed: $path (see .runtime/r3-sync.stderr.log)"}
   & npm.cmd ls --depth=0 *> (Join-Path $runtime 'r3-npm.log')
   if($LASTEXITCODE -ne 0){throw "NPM dependencies mismatch: $path"}
   & node node_modules/typescript/bin/tsc --noEmit *> (Join-Path $runtime 'r3-typecheck.log')
   if($LASTEXITCODE -ne 0){throw "Typecheck failed: $path"}
   & '.\.venv\Scripts\python.exe' -m pytest -p no:langsmith -q tests/test_r3_contracts.py *> (Join-Path $runtime 'r3-contract.log')
   if($LASTEXITCODE -ne 0){throw "R3 import/contract checks failed: $path"}
   & '.\.venv\Scripts\python.exe' scripts/export-r3-schema.py --check *> (Join-Path $runtime 'r3-schema.log')
   if($LASTEXITCODE -ne 0){throw "Schema mismatch: $path"}
   if(Invoke-GitChecked $path @('status','--porcelain')){throw "Unexpected tracked changes: $path"}
   [IO.File]::WriteAllText((Join-Path $runtime 'BASE_COMMIT_R3'),$launch)
   $result+=[pscustomobject]@{window=$item.window;path=$path;branch=$item.branch;head=$launch;web_port=$item.web_port;api_port=$item.api_port;fixture_port=$item.fixture_port;dependency_sync='PASS';typecheck='PASS';contracts='PASS';env_copied=$false}
  } finally {Pop-Location}
 }
 [pscustomobject]@{status='R3_READY';base_commit=$launch;branch=(Invoke-GitChecked $root @('branch','--show-current')).Trim();worktrees=$result;created_at=(Get-Date).ToUniversalTime().ToString('o')}|ConvertTo-Json -Depth 6|Set-Content -LiteralPath $receipt -Encoding UTF8
} catch {
 [pscustomobject]@{status='R3_NOT_READY';base_commit=$launch;completed_worktrees=$result}|ConvertTo-Json -Depth 6|Set-Content -LiteralPath $receipt -Encoding UTF8
 throw
} finally {
 $env:AI4TJU_ENV_FILE=$oldEnvFile
 $env:CAMPUS_WEB_SEARCH_ENABLED=$oldWebSearch
}
$result|Format-Table window,branch,dependency_sync,typecheck,contracts
Write-Output "R3_READY $launch"