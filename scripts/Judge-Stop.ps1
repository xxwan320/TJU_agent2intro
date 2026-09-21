$ErrorActionPreference='Stop'
$root=[IO.Path]::GetFullPath((Split-Path -Parent $PSScriptRoot))
$receiptPath=Join-Path $root '.runtime\judge-process.json'
if (-not (Test-Path -LiteralPath $receiptPath)) { Write-Host '没有发现由一键启动器创建的运行进程。'; exit 0 }
$receipt=Get-Content -LiteralPath $receiptPath -Raw | ConvertFrom-Json
if ($receipt.root -ne $root) { throw '运行记录不属于当前项目目录，已拒绝关闭。' }
$process=Get-Process -Id ([int]$receipt.pid) -ErrorAction SilentlyContinue
if (-not $process) { Write-Host '服务已经停止。'; exit 0 }
if ($process.StartTime.ToUniversalTime().Ticks.ToString() -ne [string]$receipt.started_ticks) { throw '进程号已被复用，已拒绝关闭其他程序。' }
Stop-Process -Id $process.Id -ErrorAction Stop
Write-Host "海小棠服务已关闭（PID $($process.Id)）。" -ForegroundColor Green
