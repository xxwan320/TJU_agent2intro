param([ValidateSet('dev','app')][string]$Mode='app',[int]$ApiPort=8000,[int]$WebPort=5173,[string]$EnvFile='')
$ErrorActionPreference='Stop'
$root=[IO.Path]::GetFullPath((Split-Path -Parent $PSScriptRoot))
$runtime=Join-Path $root '.runtime'
$receiptPath=Join-Path $runtime 'managed-processes.json'
if (Test-Path -LiteralPath $receiptPath) {
 $prior=Get-Content -LiteralPath $receiptPath -Raw | ConvertFrom-Json
 foreach ($item in $prior.processes) {
  $process=Get-Process -Id $item.pid -ErrorAction SilentlyContinue
  if ($process -and $process.StartTime.ToUniversalTime().Ticks.ToString() -eq $item.started_ticks) { throw 'This project is already running. Use scripts/stop.ps1 first.' }
 }
}
$ports=if ($Mode -eq 'dev') { @($ApiPort,$WebPort) } else { @($ApiPort) }
foreach ($port in $ports) {
 if ($port -lt 1024 -or $port -gt 65535) { throw 'Port outside 1024..65535' }
 if (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue) { throw "Port $port occupied; choose another port. No process was stopped." }
}
if ($Mode -eq 'dev' -and $ApiPort -eq $WebPort) { throw 'API and web ports must differ' }
if ($Mode -eq 'app' -and -not (Test-Path -LiteralPath (Join-Path $root 'dist/index.html'))) { throw 'Build missing. Run start-app.ps1 -Build.' }
if (-not $EnvFile -and (Test-Path -LiteralPath (Join-Path $root '.env'))) { $EnvFile=Join-Path $root '.env' }
if ($EnvFile) { $env:AI4TJU_ENV_FILE=(Resolve-Path -LiteralPath $EnvFile).Path }
$env:AI4TJU_WEB_PORT=[string]$WebPort
$env:AI4TJU_API_PORT=[string]$ApiPort
$env:AI4TJU_SERVE_FRONTEND=if ($Mode -eq 'app') { '1' } else { '0' }
$env:LANGSMITH_TRACING='false'
$env:LANGCHAIN_TRACING_V2='false'
$logs=Join-Path $runtime 'logs'
[IO.Directory]::CreateDirectory($logs) | Out-Null
$records=[Collections.Generic.List[object]]::new()
function Save-Receipt {
 [pscustomobject]@{root=$root;mode=$Mode;api_port=$ApiPort;web_port=if ($Mode -eq 'dev') {$WebPort} else {$ApiPort};processes=@($records.ToArray())} | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $receiptPath -Encoding UTF8
}
function Record-Process([int]$ProcessId,[string]$Role) {
 if ($records.pid -contains $ProcessId) { return }
 $process=Get-Process -Id $ProcessId -ErrorAction SilentlyContinue
 if ($process) { $records.Add([pscustomobject]@{pid=$process.Id;started_ticks=$process.StartTime.ToUniversalTime().Ticks.ToString();role=$Role}); Save-Receipt }
}
# Start the optional local Mandarin recognizer only when the backend points to it.
# Remote ASR configurations are left to their existing service.
$localAsr=& (Join-Path $root '.venv/Scripts/python.exe') -c "from backend.common.config import get_settings; s=get_settings(); print(s.asr_model.removeprefix('whisper-') if s.asr_url.rstrip('/') == 'http://127.0.0.1:8010/v1' else '')"
if ($localAsr -and -not (Get-NetTCPConnection -LocalPort 8010 -State Listen -ErrorAction SilentlyContinue)) {
 $env:HF_HOME=Join-Path $runtime 'huggingface'
 $asr=Start-Process -FilePath (Join-Path $root '.venv/Scripts/python.exe') -ArgumentList @('scripts/local-asr-server.py','--model',$localAsr.Trim(),'--port','8010') -WorkingDirectory $root -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $logs 'asr.stdout.log') -RedirectStandardError (Join-Path $logs 'asr.stderr.log')
 Record-Process $asr.Id 'asr-launcher'
}
$api=Start-Process -FilePath (Join-Path $root '.venv/Scripts/python.exe') -ArgumentList @('-m','uvicorn','backend.app:app','--host','127.0.0.1','--port',[string]$ApiPort,'--no-access-log') -WorkingDirectory $root -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $logs 'api.stdout.log') -RedirectStandardError (Join-Path $logs 'api.stderr.log')
Record-Process $api.Id 'api-launcher'
if ($Mode -eq 'dev') {
 $vite=Join-Path $root 'node_modules/vite/bin/vite.js'
 $web=Start-Process -FilePath (Get-Command node.exe).Source -ArgumentList @(('"{0}"' -f $vite),'--host','127.0.0.1') -WorkingDirectory $root -WindowStyle Hidden -PassThru -RedirectStandardOutput (Join-Path $logs 'web.stdout.log') -RedirectStandardError (Join-Path $logs 'web.stderr.log')
 Record-Process $web.Id 'web'
}
# Windows venv python may delegate to a child: record returned descendants, never all python processes.
for ($attempt=0; $attempt -lt 20; $attempt++) {
 $children=Get-CimInstance Win32_Process | Where-Object { $records.pid -contains [int]$_.ParentProcessId }
 foreach ($child in $children) { Record-Process ([int]$child.ProcessId) 'child' }
 try {
  $health=Invoke-RestMethod -Uri "http://127.0.0.1:$ApiPort/api/health" -TimeoutSec 2
  $webReady=$true
  if ($Mode -eq 'dev') { $null=Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:$WebPort/" -TimeoutSec 2 }
  if ($health.status -eq 'ok' -and $webReady) { break }
 } catch { if ($attempt -eq 19) { throw 'Startup check failed. Inspect this project .runtime/logs; stop.ps1 stops only recorded processes.' }; Start-Sleep -Milliseconds 500 }
}
Save-Receipt
$url=if ($Mode -eq 'dev') { "http://127.0.0.1:$WebPort" } else { "http://127.0.0.1:$ApiPort" }
Write-Host "URL: $url  API: http://127.0.0.1:$ApiPort"
$records | Format-Table pid,role
Write-Host "Model configured: $($health.model.configured); verified in this process: $($health.model.verified)"
