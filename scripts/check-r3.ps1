$ErrorActionPreference='Continue'
$root=Split-Path -Parent $PSScriptRoot
Push-Location $root
try {
 & (Join-Path $PSScriptRoot 'check-r2.ps1')
 if(-not $?){throw 'Existing regression failed'}
 & '.\.venv\Scripts\python.exe' scripts/export-r3-schema.py --check
 if($LASTEXITCODE -ne 0){throw 'R3 schema/type drift'}
 & '.\.venv\Scripts\python.exe' scripts/export-r3-knowledge-schema.py --check
 if($LASTEXITCODE -ne 0){throw 'R3 knowledge schema/type drift'}
 & node --test tests/transport/r3.test.mjs tests/transport/r3-speech.test.mjs tests/ui/tour.test.mjs tests/speech/r3.test.mjs
 if($LASTEXITCODE -ne 0){throw 'R3 transport regression failed'}
} finally {Pop-Location}