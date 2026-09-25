param([string]$Model='turbo',[ValidateSet('cpu','cuda')][string]$Device='cpu',[int]$Port=8010)
$ErrorActionPreference='Stop'
$root=Split-Path -Parent $PSScriptRoot
Set-Location $root
# First install: .\.tools\Scripts\uv.exe pip install --python .venv/Scripts/python.exe -r scripts/requirements-asr.txt
# CPU/int8 works without CUDA DLLs. CUDA requires compatible cuBLAS and cuDNN.
$compute=if ($Device -eq 'cuda') {'float16'} else {'int8'}
& '.\.venv\Scripts\python.exe' scripts/local-asr-server.py --model $Model --device $Device --compute-type $compute --port $Port
exit $LASTEXITCODE
