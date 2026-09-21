param([ValidateSet('Js','WebService','Security')][string]$Kind)
$ErrorActionPreference='Stop'
$root=Split-Path -Parent $PSScriptRoot

function Set-MapKey([ValidateSet('Js','WebService','Security')][string]$KeyKind) {
 $name=@{Js='CAMPUS_AMAP_JS_KEY';WebService='CAMPUS_AMAP_WEB_SERVICE_KEY';Security='CAMPUS_AMAP_SECURITY_KEY'}[$KeyKind]
 $labels=@{Js='Web 端 JS API Key';WebService='Web 服务 API Key';Security='Web 端安全密钥'}
 $secret=Read-Host "$($labels[$KeyKind])（输入内容不会显示）" -AsSecureString
 $ptr=[Runtime.InteropServices.Marshal]::SecureStringToBSTR($secret)
 try {
  $value=[Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr)
  if($value -notmatch '^[A-Za-z0-9_-]{16,128}$'){throw "$($labels[$KeyKind])格式不符合预期，配置未写入。"}
  $path=Join-Path $root '.env'
  $lines=if(Test-Path -LiteralPath $path){[IO.File]::ReadAllLines($path)}else{@()}
  $next=@($lines|Where-Object {$_ -notmatch ('^'+[regex]::Escape($name)+'=')})
  $next+=($name+'='+$value)
  [IO.File]::WriteAllLines($path,$next,[Text.UTF8Encoding]::new($false))
  Write-Host "$($labels[$KeyKind])已保存。" -ForegroundColor Green
 } finally {
  if($ptr -ne [IntPtr]::Zero){[Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)}
  $value=$null
 }
}

Write-Host '高德在线地图为可选功能，需要自行准备 Web 端 JS API Key 和安全密钥。'
Write-Host '输入内容仅写入本机 .env，不会显示在屏幕上，也不会发送给项目作者。'
if($Kind){Set-MapKey $Kind}
else {
 Set-MapKey 'Js'
 Set-MapKey 'Security'
 Write-Host '配置完成。请先运行“关闭海小棠.cmd”，再运行“启动海小棠.cmd”。' -ForegroundColor Green
}
