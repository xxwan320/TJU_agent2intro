$ErrorActionPreference='Stop'
$root=Split-Path -Parent $PSScriptRoot
Push-Location $root
try {
 if(Test-Path (Join-Path $PSScriptRoot 'check-r2.ps1')) {
  & (Join-Path $PSScriptRoot 'check-r2.ps1')
  if(-not $?){throw 'Existing regression failed'}
 } else {
  & npm.cmd run build
  if($LASTEXITCODE -ne 0){throw 'Build failed'}
  & '.\.venv\Scripts\python.exe' -m pytest -q
  if($LASTEXITCODE -ne 0){throw 'Backend regression failed'}
 }
 & '.\.venv\Scripts\python.exe' scripts/export-r3-schema.py --check
 if($LASTEXITCODE -ne 0){throw 'R3 schema/type drift'}
 & '.\.venv\Scripts\python.exe' scripts/export-r3-knowledge-schema.py --check
 if($LASTEXITCODE -ne 0){throw 'R3 knowledge schema/type drift'}
 & node scripts/check-interaction.mjs
 if($LASTEXITCODE -ne 0){throw 'R3 transport regression failed'}
} finally {Pop-Location}
