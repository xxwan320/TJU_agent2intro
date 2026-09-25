$ErrorActionPreference='Stop'
$root=[IO.Path]::GetFullPath((Split-Path -Parent $PSScriptRoot))
$path=Join-Path $root '.runtime/managed-processes.json'
if (-not (Test-Path -LiteralPath $path)) { Write-Host 'No managed process receipt; no processes stopped.'; return }
$receipt=Get-Content -LiteralPath $path -Raw | ConvertFrom-Json
if ($receipt.root -ne $root) { throw 'Receipt belongs to another project directory' }
$items=@($receipt.processes)
[array]::Reverse($items)
foreach ($item in $items) {
 $process=Get-Process -Id $item.pid -ErrorAction SilentlyContinue
 if (-not $process) { continue }
 if ($process.StartTime.ToUniversalTime().Ticks.ToString() -ne $item.started_ticks) { Write-Warning "PID $($item.pid) was reused; left untouched."; continue }
 try { Stop-Process -Id $process.Id -ErrorAction Stop }
 catch {
  # A recorded parent can exit as its child stops; disappearance is successful.
  if (Get-Process -Id $item.pid -ErrorAction SilentlyContinue) { throw }
 }
 Write-Host "Stopped owned PID $($item.pid) ($($item.role))"
}
# Keep receipt as a local audit; next launch ignores exited processes.
