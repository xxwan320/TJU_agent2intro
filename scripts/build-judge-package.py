#!/usr/bin/env python3
"""Build the self-contained Windows x64 judge package.

The output intentionally contains the local LLM and AMap credentials from
``.env`` and must never be committed or publicly redistributed. ASR
credentials remain cleared.
"""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
from hashlib import sha256
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys
from urllib.request import urlopen
from zipfile import ZIP_DEFLATED, ZipFile


ROOT = Path(__file__).resolve().parents[1]
RUNTIME_ROOT = ROOT / ".runtime"
PYTHON_VERSION = "3.11.9"
PYTHON_ARCHIVE = f"python-{PYTHON_VERSION}-embed-amd64.zip"
PYTHON_URL = f"https://www.python.org/ftp/python/{PYTHON_VERSION}/{PYTHON_ARCHIVE}"
PYTHON_SHA256 = "009d6bf7e3b2ddca3d784fa09f90fe54336d5b60f0e0f305c37f400bf83cfd3b"
PACKAGE_NAME = "海小棠校园数字人导游_评委一键运行_Windows_x64"


def run(*args: str) -> None:
    env = os.environ.copy()
    env.setdefault("UV_CACHE_DIR", str(RUNTIME_ROOT / "uv-cache"))
    subprocess.run(args, cwd=ROOT, check=True, env=env)


def digest(path: Path) -> str:
    value = sha256()
    with path.open("rb") as source:
        for block in iter(lambda: source.read(1024 * 1024), b""):
            value.update(block)
    return value.hexdigest()


def download_python(cache: Path) -> Path:
    cache.mkdir(parents=True, exist_ok=True)
    archive = cache / PYTHON_ARCHIVE
    if not archive.is_file() or digest(archive) != PYTHON_SHA256:
        temporary = archive.with_suffix(".download")
        with urlopen(PYTHON_URL, timeout=60) as response, temporary.open("wb") as target:
            shutil.copyfileobj(response, target)
        if digest(temporary) != PYTHON_SHA256:
            temporary.unlink(missing_ok=True)
            raise RuntimeError("The downloaded Python runtime failed SHA-256 verification")
        temporary.replace(archive)
    return archive


def prepare_python(stage: Path, archive: Path) -> None:
    runtime = stage / "runtime" / "python"
    runtime.mkdir(parents=True)
    with ZipFile(archive) as source:
        source.extractall(runtime)
    pth = runtime / "python311._pth"
    pth.write_text(
        # Windows embeddable Python resolves these entries from python.exe.
        # Keep the package root explicit; Judge-Start additionally launches a
        # bootstrap which inserts the resolved root before importing backend.
        "python311.zip\n.\nLib\\site-packages\n..\\..\nimport site\n",
        encoding="utf-8",
    )
    site_packages = runtime / "Lib" / "site-packages"
    site_packages.mkdir(parents=True)
    requirements = RUNTIME_ROOT / "judge-requirements.txt"
    uv = ROOT / ".tools" / "bin" / "uv"
    if not uv.is_file():
        found = shutil.which("uv")
        if not found:
            raise RuntimeError("uv is required to assemble Windows wheels")
        uv = Path(found)
    run(
        str(uv), "export", "--quiet", "--frozen", "--no-dev", "--no-emit-project",
        "--format", "requirements.txt", "--output-file", str(requirements),
    )
    run(
        str(uv), "pip", "install", "--requirements", str(requirements),
        "--target", str(site_packages), "--python-version", "3.11",
        "--python-platform", "x86_64-pc-windows-msvc", "--only-binary", ":all:",
    )


def copy_runtime_files(stage: Path) -> None:
    shutil.copytree(ROOT / "backend", stage / "backend", ignore=shutil.ignore_patterns("__pycache__", "*.pyc"))
    shutil.copytree(ROOT / "dist", stage / "dist")
    shutil.copytree(
        ROOT / "data", stage / "data",
        ignore=shutil.ignore_patterns("reference_photos", "__pycache__", "*.pyc"),
    )
    docs = stage / "docs" / "evaluation"
    docs.mkdir(parents=True)
    shutil.copytree(ROOT / "docs" / "evaluation" / "starter", docs / "starter")
    scripts = stage / "scripts"
    scripts.mkdir()
    for name in ("Judge-Start.ps1", "Judge-Stop.ps1", "Configure-Map.ps1"):
        # Windows PowerShell 5.1 treats BOM-less UTF-8 as the system ANSI code
        # page. Always emit UTF-8 BOM + CRLF so Chinese literals cannot break
        # string parsing on the judge's machine.
        source = (ROOT / "scripts" / name).read_text(encoding="utf-8-sig")
        (scripts / name).write_text(source, encoding="utf-8-sig", newline="\r\n")
    shutil.copy2(ROOT / "scripts" / "judge_bootstrap.py", scripts / "judge_bootstrap.py")
    for name in ("启动海小棠.cmd", "关闭海小棠.cmd", "配置高德地图.cmd"):
        source = (ROOT / name).read_text(encoding="ascii")
        (stage / name).write_text(source, encoding="ascii", newline="\r\n")
    shutil.copy2(ROOT / "THIRD_PARTY_NOTICES.md", stage / "THIRD_PARTY_NOTICES.md")
    shutil.copy2(ROOT / "docs" / "DEPENDENCY_LICENSES.json", stage / "DEPENDENCY_LICENSES.json")


def raw_env_value(text: str, name: str) -> str:
    match = re.search(rf"(?m)^{re.escape(name)}=(.*)$", text)
    return match.group(1).strip() if match else ""


def write_judge_env(stage: Path) -> None:
    source = ROOT / ".env"
    if not source.is_file():
        raise RuntimeError("Root .env is required because the judge package uses the owner's model API")
    text = source.read_text(encoding="utf-8")
    values = {name: raw_env_value(text, name) for name in (
        "CAMPUS_LLM_URL", "CAMPUS_LLM_MODEL", "CAMPUS_LLM_API_KEY",
        "CAMPUS_TTS_PROVIDER", "CAMPUS_TTS_VOICE",
        "CAMPUS_AMAP_JS_KEY", "CAMPUS_AMAP_SECURITY_KEY", "CAMPUS_AMAP_WEB_SERVICE_KEY",
    )}
    if not values["CAMPUS_LLM_API_KEY"].strip("'\""):
        raise RuntimeError("CAMPUS_LLM_API_KEY is empty; refusing to create a misleading runnable package")
    for name in ("CAMPUS_AMAP_JS_KEY", "CAMPUS_AMAP_SECURITY_KEY"):
        if not values[name].strip("'\""):
            raise RuntimeError(f"{name} is empty; the judge package must include the configured online map")
    defaults = {
        "CAMPUS_LLM_URL": "http://111.32.22.35:32592/mgate/v1/chat/completions",
        "CAMPUS_LLM_MODEL": "glm-5.1",
        "CAMPUS_TTS_PROVIDER": "edge",
        "CAMPUS_TTS_VOICE": "zh-CN-XiaoxiaoNeural",
    }
    for key, fallback in defaults.items():
        values[key] = values[key] or fallback
    lines = [
        "# Judge-only configuration. Contains the project owner's model key; do not commit or redistribute.",
        *(f"{name}={values[name]}" for name in (
            "CAMPUS_LLM_URL", "CAMPUS_LLM_MODEL", "CAMPUS_LLM_API_KEY",
            "CAMPUS_TTS_PROVIDER", "CAMPUS_TTS_VOICE",
        )),
        "CAMPUS_ASR_URL=", "CAMPUS_ASR_MODEL=", "CAMPUS_ASR_API_KEY=",
        "# Judge map configuration supplied by the project owner.",
        *(f"{name}={values[name]}" for name in (
            "CAMPUS_AMAP_JS_KEY", "CAMPUS_AMAP_SECURITY_KEY", "CAMPUS_AMAP_WEB_SERVICE_KEY",
        )),
        "CAMPUS_WEB_SEARCH_ENABLED=false", "CAMPUS_TOUR_MODEL_SUGGESTIONS=false", "",
    ]
    (stage / ".env").write_text("\n".join(lines), encoding="utf-8")


def write_readme(stage: Path) -> None:
    (stage / "评委请先读.txt").write_text(
        """海小棠校园数字人导游（Windows 10/11 64位）

运行方法：
1. 完整解压本压缩包，不能直接在压缩软件预览窗口内运行。
2. 双击“启动海小棠.cmd”。脚本会启动本地服务并自动打开浏览器。
3. 使用结束后双击“关闭海小棠.cmd”。

无需安装 Python、Node.js 或 npm，前端已经构建，Python 运行时和依赖已经随包提供。
首次进行 AI 问答时需要能够访问天津移动模型网关；模型固定为 glm-5.1。

本包已配置项目作者提供的高德 Web 端 JS API Key 与安全密钥，可直接使用在线地图。
若密钥失效或需要更换，可双击“配置高德地图.cmd”重新填写并重启应用。

若浏览器没有自动打开，请查看启动窗口输出的 http://127.0.0.1:端口/ 地址。
启动失败日志位于 .runtime\\logs\\judge.stderr.log。
""",
        encoding="utf-8-sig",
    )
    try:
        commit = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=ROOT, text=True).strip()
    except (OSError, subprocess.CalledProcessError):
        commit = "unknown"
    try:
        dirty = bool(subprocess.check_output(["git", "status", "--porcelain", "--untracked-files=no"], cwd=ROOT, text=True).strip())
    except (OSError, subprocess.CalledProcessError):
        dirty = True
    (stage / "版本信息.txt").write_text(
        f"source_commit={commit}\nsource_has_uncommitted_changes={str(dirty).lower()}\nbuilt_at={datetime.now(timezone.utc).isoformat()}\n"
        f"python={PYTHON_VERSION}-embed-amd64\nmodel=glm-5.1\n",
        encoding="utf-8",
    )


def write_checksums(stage: Path) -> None:
    target = stage / "完整性校验_SHA256.txt"
    rows = []
    for path in sorted(stage.rglob("*")):
        if path.is_file() and path != target:
            rows.append(f"{digest(path)}  {path.relative_to(stage).as_posix()}")
    target.write_text("\n".join(rows) + "\n", encoding="utf-8")


def validate_stage(stage: Path) -> None:
    cmd_files = sorted(stage.glob("*.cmd"))
    expected_cmd = {"启动海小棠.cmd", "关闭海小棠.cmd", "配置高德地图.cmd"}
    if {path.name for path in cmd_files} != expected_cmd:
        raise RuntimeError("Judge package command-file set is incomplete")
    for path in cmd_files:
        data = path.read_bytes()
        data.decode("ascii")
        if b"\n" in data.replace(b"\r\n", b""):
            raise RuntimeError(f"Batch file does not use CRLF exclusively: {path.name}")

    ps_files = sorted((stage / "scripts").glob("*.ps1"))
    expected_ps = {"Judge-Start.ps1", "Judge-Stop.ps1", "Configure-Map.ps1"}
    if {path.name for path in ps_files} != expected_ps:
        raise RuntimeError("Judge package PowerShell-file set is incomplete")
    for path in ps_files:
        data = path.read_bytes()
        if not data.startswith(b"\xef\xbb\xbf"):
            raise RuntimeError(f"PowerShell file is missing the UTF-8 BOM: {path.name}")
        data.decode("utf-8-sig")
        if b"\n" in data.replace(b"\r\n", b""):
            raise RuntimeError(f"PowerShell file does not use CRLF exclusively: {path.name}")

    start = (stage / "scripts" / "Judge-Start.ps1").read_text(encoding="utf-8-sig")
    stop = (stage / "scripts" / "Judge-Stop.ps1").read_text(encoding="utf-8-sig")
    bootstrap = stage / "scripts" / "judge_bootstrap.py"
    pth = stage / "runtime" / "python" / "python311._pth"
    if "$python=$null" not in start or "$pythonPrefix=@()" not in start:
        raise RuntimeError("Judge-Start.ps1 does not initialize Python launch arguments")
    if "started_ticks" not in start or "started_ticks" not in stop:
        raise RuntimeError("Start/stop scripts do not both validate process start time")
    if "catch { Write-Warning" not in start or "Open-GuideBrowser $url" not in start:
        raise RuntimeError("Browser launch is not guarded as a non-fatal operation")
    if not bootstrap.is_file() or "sys.path.insert(0, str(PROJECT_ROOT))" not in bootstrap.read_text(encoding="utf-8"):
        raise RuntimeError("Packaged Python bootstrap does not insert the project root")
    if not pth.is_file() or "..\\.." not in pth.read_text(encoding="utf-8").splitlines():
        raise RuntimeError("Embedded Python path file does not include the package root")

    checksum_path = stage / "完整性校验_SHA256.txt"
    recorded = {}
    for row in checksum_path.read_text(encoding="utf-8").splitlines():
        value, relative = row.split("  ", 1)
        recorded[relative] = value
    critical = [
        "启动海小棠.cmd", "关闭海小棠.cmd", "配置高德地图.cmd",
        "scripts/Judge-Start.ps1", "scripts/Judge-Stop.ps1",
        "scripts/Configure-Map.ps1", "scripts/judge_bootstrap.py",
        "runtime/python/python311._pth",
    ]
    for relative in critical:
        path = stage / relative
        if recorded.get(relative) != digest(path):
            raise RuntimeError(f"Checksum is absent or stale for {relative}")


def make_zip(stage: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = destination.with_suffix(".tmp")
    with ZipFile(temporary, "w", ZIP_DEFLATED, compresslevel=6) as archive:
        for path in sorted(stage.rglob("*")):
            if path.is_file():
                archive.write(path, (Path(PACKAGE_NAME) / path.relative_to(stage)).as_posix())
    temporary.replace(destination)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=ROOT / "参赛提交_待填写联系人+赛道一+海小棠校园数字人导游" / "01_作品成果" / f"{PACKAGE_NAME}.zip")
    parser.add_argument("--skip-build", action="store_true")
    args = parser.parse_args()
    if not args.skip_build:
        run("npm", "run", "build")
    stage = RUNTIME_ROOT / "judge-build" / PACKAGE_NAME
    if stage.exists():
        shutil.rmtree(stage)
    stage.mkdir(parents=True)
    copy_runtime_files(stage)
    write_judge_env(stage)
    prepare_python(stage, download_python(RUNTIME_ROOT))
    write_readme(stage)
    write_checksums(stage)
    validate_stage(stage)
    make_zip(stage, args.output.resolve())
    receipt = {
        "package": str(args.output.resolve()),
        "sha256": digest(args.output.resolve()),
        "bytes": args.output.resolve().stat().st_size,
        "contains_owner_llm_key": True,
        "amap_credentials_included": True,
    }
    (RUNTIME_ROOT / "judge-package-receipt.json").write_text(json.dumps(receipt, ensure_ascii=False, indent=2), encoding="utf-8")
    print(json.dumps(receipt, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
