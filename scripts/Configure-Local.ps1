# Does not print secrets.
$ErrorActionPreference='Stop'
$root=Split-Path -Parent $PSScriptRoot
$path=Join-Path $root '.env'
$lines=if (Test-Path -LiteralPath $path) { @(Get-Content -LiteralPath $path) } else { @(Get-Content -LiteralPath (Join-Path $root '.env.example')) }
if ($lines | Where-Object { $_ -match '^CAMPUS_LLM_API_KEY=.+$' }) { Write-Host 'Existing project key retained.'; exit 0 }
$secret=Read-Host 'Enter CAMPUS_LLM_API_KEY (hidden; blank cancels)' -AsSecureString
$ptr=[Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret)
try {
 $key=[Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
 if ([string]::IsNullOrWhiteSpace($key)) { Write-Host 'No configuration changed.'; exit 0 }
 if ($key -match "[\r\n]") { throw 'Key must be one line' }
 $escaped=$key.Replace('\','\\').Replace("'","\'")
 $lines=@($lines | Where-Object { $_ -notmatch '^CAMPUS_LLM_API_KEY=' })
 $lines += "CAMPUS_LLM_API_KEY='$escaped'"
 [IO.File]::WriteAllLines($path,$lines,[Text.UTF8Encoding]::new($false))
 Write-Host 'Project key configured: true. Model verified: false.'
} finally {
 [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
 $key=$null; $lines=$null
}
