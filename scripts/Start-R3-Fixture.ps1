param([ValidateSet(8011,8012,8013,8014)][int]$Port=8011)
$ErrorActionPreference='Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
# This explicit separate server never loads backend.app or root .env, and never calls upstream.
$env:AI4TJU_ENV_FILE=$null
$env:CAMPUS_WEB_SEARCH_ENABLED='false'
Write-Host 'R3 TEST ONLY fixture: synthetic tour results, no real model/maps/ASR.'
& '.\.venv\Scripts\python.exe' -m uvicorn r3_fixture:app --app-dir tests --host 127.0.0.1 --port $Port --no-access-log
exit $LASTEXITCODE