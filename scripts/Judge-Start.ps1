param([int]$PreferredPort=8000)
$ErrorActionPreference='Stop'
$root=[IO.Path]::GetFullPath((Split-Path -Parent $PSScriptRoot))
$runtime=Join-Path $root '.runtime'
$logs=Join-Path $runtime 'logs'
$receiptPath=Join-Path $runtime 'judge-process.json'
[IO.Directory]::CreateDirectory($logs) | Out-Null

function Read-OwnedProcess($receipt) {
 if (-not $receipt -or -not $receipt.pid -or -not $receipt.started_ticks) { return $null }
 $process=Get-Process -Id ([int]$receipt.pid) -ErrorAction SilentlyContinue
 if ($process -and $process.StartTime.ToUniversalTime().Ticks.ToString() -eq [string]$receipt.started_ticks) { return $process }
 return $null
}

function Open-GuideBrowser([string]$Url) {
 try { Start-Process $Url -ErrorAction Stop }
 catch { Write-Warning "浏览器未能自动打开，请手动访问：$Url" }
}

if (Test-Path -LiteralPath $receiptPath) {
 try {
  $prior=Get-Content -LiteralPath $receiptPath -Raw | ConvertFrom-Json
  $owned=Read-OwnedProcess $prior
  if ($owned) {
   Write-Host "海小棠已经在运行：$($prior.url)"
   Open-GuideBrowser ([string]$prior.url)
   exit 0
  }
 } catch { Write-Warning '旧的运行记录已失效，将重新启动。' }
}

if (-not (Test-Path -LiteralPath (Join-Path $root 'dist\index.html'))) {
 throw '缺少前端生产构建 dist\index.html；请使用完整的评委运行包。'
}
$envFile=Join-Path $root '.env'
if (-not (Test-Path -LiteralPath $envFile)) {
 throw '缺少 .env；评委运行包不完整，无法读取模型配置。'
}
$bootstrap=Join-Path $root 'scripts\judge_bootstrap.py'
if (-not (Test-Path -LiteralPath $bootstrap)) {
 throw '缺少 Python 启动引导脚本；请重新解压完整的评委运行包。'
}

$candidates=@(
 (Join-Path $root 'runtime\python\python.exe'),
 (Join-Path $root '.venv\Scripts\python.exe')
)
$python=$null
$pythonPrefix=@()
foreach ($candidate in $candidates) {
 if (-not (Test-Path -LiteralPath $candidate)) { continue }
 & $candidate -c "import sys; raise SystemExit(0 if sys.version_info[:2] == (3, 11) else 1)" 2>$null
 if ($LASTEXITCODE -eq 0) { $python=$candidate; break }
}
if (-not $python) {
 foreach ($command in @('py.exe','python.exe')) {
 $found=Get-Command $command -ErrorAction SilentlyContinue
 if (-not $found) { continue }
  $candidatePrefix=if ($command -eq 'py.exe') {@('-3.11')} else {@()}
  & $found.Source @candidatePrefix -c "import sys; raise SystemExit(0 if sys.version_info[:2] == (3, 11) else 1)" 2>$null
  if ($LASTEXITCODE -eq 0) { $python=$found.Source; $pythonPrefix=$candidatePrefix; break }
 }
}
if (-not $python) { throw '未找到随包 Python 3.11 运行时，也未检测到系统 Python 3.11。' }

function Test-FreePort([int]$Port) {
 $listener=$null
 try {
  $listener=[Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback,$Port)
  $listener.Start(); return $true
 } catch { return $false }
 finally { if ($listener) { $listener.Stop() } }
}
$port=$null
foreach ($candidate in $PreferredPort..($PreferredPort+20)) {
 if (Test-FreePort $candidate) { $port=$candidate; break }
}
if (-not $port) { throw "端口 $PreferredPort-$($PreferredPort+20) 均被占用。" }

$env:AI4TJU_ENV_FILE=$envFile
$env:AI4TJU_SERVE_FRONTEND='1'
$env:AI4TJU_API_PORT=[string]$port
$env:LANGSMITH_TRACING='false'
$env:LANGCHAIN_TRACING_V2='false'
$env:NO_PROXY='127.0.0.1,localhost'
$stdout=Join-Path $logs 'judge.stdout.log'
$stderr=Join-Path $logs 'judge.stderr.log'
$arguments=@($pythonPrefix)+@(('"'+$bootstrap+'"'),'--host','127.0.0.1','--port',[string]$port)
$process=Start-Process -FilePath $python -ArgumentList $arguments -WorkingDirectory $root -WindowStyle Hidden -PassThru -RedirectStandardOutput $stdout -RedirectStandardError $stderr
$url="http://127.0.0.1:$port/"
$receipt=[pscustomobject]@{root=$root;pid=$process.Id;started_ticks=$process.StartTime.ToUniversalTime().Ticks.ToString();port=$port;url=$url}
$receipt | ConvertTo-Json | Set-Content -LiteralPath $receiptPath -Encoding UTF8

$health=$null
for ($attempt=0; $attempt -lt 60; $attempt++) {
 try {
  $health=Invoke-RestMethod -Uri "http://127.0.0.1:$port/api/health" -TimeoutSec 2
  if ($health.status -eq 'ok') { break }
 } catch { Start-Sleep -Milliseconds 500 }
}
if (-not $health -or $health.status -ne 'ok') {
 if (Read-OwnedProcess $receipt) { Stop-Process -Id $process.Id -ErrorAction SilentlyContinue }
 Write-Host '启动失败，后端日志最后内容如下：' -ForegroundColor Red
 if (Test-Path -LiteralPath $stderr) { Get-Content -LiteralPath $stderr -Tail 30 }
 throw '服务未能在 30 秒内通过健康检查。'
}

Write-Host "海小棠已启动：$url" -ForegroundColor Green
Write-Host "模型已配置：$($health.model.configured)；首次真实调用成功后，页面会显示模型已验证。"
Write-Host '高德在线地图已随评委包配置；若密钥失效，可运行“配置高德地图.cmd”后重启。'
Open-GuideBrowser $url
exit 0
