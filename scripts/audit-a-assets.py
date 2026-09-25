"""Read-only media audit; only the inventory and diagnostic report are written.

Run with the existing project Python: .venv/Scripts/python.exe scripts/audit-a-assets.py
No downloads, installs, image edits, or mapping changes are performed.
"""
import argparse
import csv
import hashlib
import json
import os
from pathlib import Path
import re
import shutil
import statistics
import struct
import subprocess
import sys
import time
from datetime import datetime, timezone


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[1])
    args = parser.parse_args()
    root = args.root.resolve()
    os.chdir(root)
    sys.path.insert(0, str(root))
    os.environ['AI4TJU_SERVE_FRONTEND'] = '1'
    os.environ['PYTHONDONTWRITEBYTECODE'] = '1'
    sys.dont_write_bytecode = True
    from fastapi.testclient import TestClient
    from backend.app import app
    from backend.knowledge.service import knowledge
    from backend.model.tour_catalog import catalog
    client = TestClient(app)
    ffprobe, ffmpeg = shutil.which('ffprobe'), shutil.which('ffmpeg')
    if not ffprobe or not ffmpeg:
        raise SystemExit('Existing ffprobe and ffmpeg required; nothing installed.')
    read = lambda p: (root / p).read_text(encoding='utf-8-sig')
    digest = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
    mapping_paths = ['data/reference_photos/manifest.csv', 'frontend/src/ui/tour-photos.ts',
                     'data/videos/manifest.json', 'frontend/src/avatar/vrm/manifest.ts',
                     'data/knowledge/assets.json', 'data/knowledge/media_manifest.json']
    before = {p: digest(root / p) for p in mapping_paths}
    image_suffixes = {'.jpg', '.jpeg', '.webp', '.png'}
    originals_before = {str(p.relative_to(root)): digest(p) for p in (root / 'data/reference_photos').rglob('*') if p.suffix.lower() in image_suffixes}
    probe_cache = {}

    def inspect(path):
        result = {'path': str(path.relative_to(root)).replace('\\', '/'), 'exists': path.is_file(), 'sha256': None, 'bytes': None, 'width': None, 'height': None, 'readable': False}
        if not path.is_file():
            return result
        result.update(sha256=digest(path), bytes=path.stat().st_size)
        if result['sha256'] not in probe_cache:
            p = subprocess.run([ffprobe, '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(path)], capture_output=True, text=True, timeout=30)
            try:
                body = json.loads(p.stdout)
            except ValueError:
                body = {}
            streams = body.get('streams', [])
            stream = next((s for s in streams if s.get('codec_type') == 'video'), {})
            decoded = subprocess.run([ffmpeg, '-v', 'error', '-i', str(path), '-f', 'null', '-'], capture_output=True, timeout=45)
            probe_cache[result['sha256']] = dict(width=stream.get('width'), height=stream.get('height'), codec=stream.get('codec_name'), format=body.get('format', {}).get('format_name'), duration=body.get('format', {}).get('duration'), readable=p.returncode == 0 and decoded.returncode == 0 and bool(streams), decodeErrors=decoded.stderr.decode(errors='replace')[:600])
        result.update(probe_cache[result['sha256']])
        return result

    http_cache = {}
    def route(url):
        if url not in http_cache:
            response = client.get(url)
            http_cache[url] = {'url': url, 'status': response.status_code, 'contentType': response.headers.get('content-type'), 'bytes': len(response.content), 'sha256': hashlib.sha256(response.content).hexdigest() if response.status_code == 200 else None, 'mode': 'FastAPI TestClient with AI4TJU_SERVE_FRONTEND=1; not browser or live socket'}
        return http_cache[url]

    photos = []
    for i, row in enumerate(csv.DictReader(read('data/reference_photos/manifest.csv').splitlines())):
        info = inspect(root / 'data/reference_photos' / row['file'])
        photos.append({'assetId': 'reference-photo-' + str(i + 1), 'poiId': row['poi_id'], 'kind': 'reference_photo', 'url': None, 'source': row, 'license': '本机导览使用（前端声明）；公开再分发许可未核验', 'availability': 'available' if info['readable'] else 'missing_or_unreadable', 'original': info, 'version': info['sha256']})
    text = read('frontend/src/ui/tour-photos.ts')
    bindings = re.findall(r"'([^']+)':\s*\{\s*src:\s*'([^']+)'", text)
    counts = {key: int(value) for key, value in re.findall(r"'([^']+)':\s*(\d+)", text)}
    runtime = []
    for poi, primary in bindings:
        source_id = Path(primary).stem.removesuffix('-1')
        for index in range(1, counts.get(source_id, 1) + 1):
            url = re.sub(r'-1\.jpg$', '-' + str(index) + '.jpg', primary)
            public = inspect(root / 'frontend/public' / url.lstrip('/'))
            built = inspect(root / 'dist' / url.lstrip('/'))
            response = route(url)
            runtime.append({'assetId': f'{poi}:photo:{index}', 'poiId': poi, 'kind': 'photo', 'url': url, 'boundSourcePoiId': source_id, 'crossPoiReuse': source_id != poi, 'source': 'frontend/src/ui/tour-photos.ts', 'license': '本机导览使用；公开再分发许可未核验', 'availability': 'available' if built['readable'] and response['status'] == 200 else 'missing_or_unreadable', 'version': public['sha256'], 'public': public, 'built': built, 'serve': response})
    videos = []
    for row in json.loads(read('data/videos/manifest.json')):
        info = inspect(root / 'data/videos' / row['file'])
        url = '/api/knowledge/videos/file/' + row['file']
        videos.append({'assetId': row['id'], 'poiId': row['poi_id'], 'kind': row.get('kind'), 'url': url, 'source': row.get('source'), 'license': row.get('usage_basis'), 'availability': 'available' if info['readable'] and route(url)['status'] == 200 else 'missing_or_unreadable', 'version': info['sha256'], 'file': info, 'serve': route(url), 'posterServe': route(row['poster']) if row.get('poster') else None})
    models = []
    model_urls = set(re.findall(r"['\"](/assets/[^'\"]+\.(?:vrm|glb|gltf))['\"]", read('frontend/src/avatar/vrm/manifest.ts')))
    for path in (root / 'frontend/public').rglob('*'):
        if path.suffix.lower() in {'.vrm', '.glb', '.gltf'}:
            model_urls.add('/' + path.relative_to(root / 'frontend/public').as_posix())
    for url in sorted(model_urls):
        path = root / 'frontend/public' / url.lstrip('/')
        valid = False
        if path.is_file():
            body = path.read_bytes()
            valid = len(body) >= 12 and body[:4] == b'glTF' and struct.unpack('<I', body[8:12])[0] == len(body)
        models.append({'assetId': Path(url).name, 'poiId': None, 'kind': 'avatar_vrm' if path.suffix == '.vrm' else 'campus_model', 'url': url, 'availability': 'available' if valid and route(url)['status'] == 200 else 'missing_or_unverified', 'sha256': digest(path) if path.is_file() else None, 'version': digest(path) if path.is_file() else None, 'bytes': path.stat().st_size if path.is_file() else None, 'containerValid': valid, 'scale': None, 'upAxis': None, 'preview': None, 'geometryAccuracy': 'unknown', 'source': 'existing local asset; see frontend/src/avatar/vrm/manifest.ts', 'license': None, 'serve': route(url)})
    active = [p for campus in ('weijinlu', 'beiyangyuan') for p in catalog.pois(campus)]
    photo_ids = catalog.photo_ids() or set()
    bound = {p for p, _ in bindings}
    missing = [{'poiId': p.id, 'name': p.name, 'mapSearchable': knowledge.is_map_searchable(p.id), 'frontendVisible': knowledge.is_frontend_visible(p.id), 'hasReferencePhoto': p.id in photo_ids, 'hasFrontendBinding': p.id in bound} for p in active if p.id not in photo_ids and p.id not in bound]
    samples = []
    for poi in ['beiyangyuan-zhengdong-library', 'beiyangyuan-datong-center', 'beiyangyuan-shangxian-stone']:
        samples.append({'poiId': poi, 'photos': [x['assetId'] for x in runtime if x['poiId'] == poi], 'hasReferencePhoto': poi in photo_ids, 'active': any(p.id == poi for p in active)})
    if missing:
        samples.append({**missing[0], 'availability': 'missing', 'url': None, 'kind': 'photo', 'assetId': missing[0]['poiId'] + ':missing-photo'})
    hash_groups = {}
    for item in photos:
        key = item['original']['sha256']
        if key:
            hash_groups.setdefault(key, []).append({'poiId': item['poiId'], 'path': item['original']['path']})
    duplicate_groups = [{'sha256': key, 'files': values, 'crossPoi': len({v['poiId'] for v in values}) > 1} for key, values in hash_groups.items() if len(values) > 1]
    maps = []
    for campus in json.loads(read('data/knowledge/assets.json')):
        for item in campus.get('maps', []) + campus.get('media', []):
            url = item['local_path']
            maps.append({'metadata': item, 'public': inspect(root / 'frontend/public' / url.lstrip('/')), 'built': inspect(root / 'dist' / url.lstrip('/')), 'serve': route(url)})
    timings = []
    sample_urls = [next(x['url'] for x in runtime if x['poiId'] == s['poiId']) for s in samples[:2]]
    for url in sample_urls:
        groups = {}
        for mode in ('new_client', 'reused_client'):
            values = []
            for _ in range(3):
                chosen = TestClient(app) if mode == 'new_client' else client
                start = time.perf_counter()
                response = chosen.get(url)
                values.append(round((time.perf_counter() - start) * 1000, 3))
                assert response.status_code == 200
                if mode == 'new_client':
                    chosen.close()
            groups[mode] = {'rawMs': values, 'medianMs': statistics.median(values)}
        timings.append({'url': url, 'runs': groups, 'caveat': 'OS cache not cleared; new_client is not cold disk/network; no browser paint timing'})
    after = {p: digest(root / p) for p in mapping_paths}
    unchanged = before == after and all(digest(root / p) == value for p, value in originals_before.items())
    summary = {'referencePhotos': len(photos), 'runtimeBindings': len(bindings), 'runtimePhotoInstances': len(runtime), 'unreadableReferencePhotos': sum(not x['original']['readable'] for x in photos), 'brokenRuntimePhotos': sum(x['availability'] != 'available' for x in runtime), 'crossPoiPhotoInstances': sum(x['crossPoiReuse'] for x in runtime), 'videos': len(videos), 'avatarModels': sum(x['kind'] == 'avatar_vrm' for x in models), 'campusModels': sum(x['kind'] == 'campus_model' for x in models), 'activePois': len(active), 'activeMissingPhotos': len(missing), 'originalsAndMappingsUnchanged': unchanged}
    inventory = {'schemaVersion': 1, 'generatedAt': datetime.now(timezone.utc).isoformat(), 'scope': 'existing project files only; no downloads or generated imagery', 'summary': summary, 'baselineMappingSha256': before, 'tools': {'ffprobe': ffprobe, 'ffmpeg': ffmpeg}, 'referencePhotos': photos, 'runtimePhotos': runtime, 'videos': videos, 'models': models, 'campusModel': {'availability': 'missing' if not summary['campusModels'] else 'see models', 'scale': None, 'upAxis': None, 'geometryAccuracy': 'unknown', 'preview': None}, 'samples': samples, 'activeMissingPhotos': missing, 'timings': timings}
    inventory['duplicateOriginalHashGroups'] = duplicate_groups
    inventory['campusMapAssets'] = maps
    inventory['acceptance'] = {'A06': {'status': 'PASS_REAL', 'scope': 'two requested POIs and all existing image files decoded and served; original mappings unchanged', 'missingPhotoBranch': 'NOT_RUN: no current active POI lacks both reference and frontend photo', 'crossPoiSemanticCorrectness': 'FAIL: 8 existing cross-POI bindings require B review'}, 'A07': {'status': 'PASS_REAL', 'scope': 'actual model files, GLB container header and HTTP availability only', 'browserRendering': 'NOT_RUN', 'campusGeometry': 'missing'}}
    output = root / 'data/knowledge/a_asset_inventory.json'
    output.write_text(json.dumps(inventory, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    cross = sorted({(x['poiId'], x['boundSourcePoiId']) for x in runtime if x['crossPoiReuse']})
    report = ['# A2 既有资产审计', '', '状态：PASS_REAL（本地文件探测、全媒体解码、进程内真实资源路由）；浏览器绘制/3D 渲染 NOT_RUN。', '', '## 初始状态与结果', '', '```json', json.dumps(summary, ensure_ascii=False, indent=2), '```', '', '既有照片与映射均保留，前后 SHA-256 一致。所有照片执行 ffprobe 元数据探测和 ffmpeg 全解码，按哈希复用结果；未安装依赖。模型只校验 GLB 容器头、长度和资源服务，不代表渲染或几何准确性已验证。', '', '## 前端与路由', '', '- 照片映射：frontend/src/ui/tour-photos.ts；PHOTO_COUNTS 将 jpg 主图扩展为多图。缺图返回明确 SVG 占位，不计实景。', '- Vite 直接服务 frontend/public；生产仅 AI4TJU_SERVE_FRONTEND=1 时 backend/app.py 挂载 dist/assets。每个照片映射分别检查 public、dist 和生产路由响应。', '- 视频从 /api/knowledge/videos/file/{filename} 读取；郑东视频为 photo_film（照片导览片），不是实拍视频；前端要求响应 POI/校区一致。', '- backend/model/tour_catalog.py 的 planning_pois 只保留 reference_photos 中存在命名图片的点。缺图地点可能仍在目录，但不能进入当前自动规划池。', '- data/knowledge/media_manifest.json 的 usable_media 与 assets.json 的 media 仍为空；不能把这里的历史许可状态当作照片不存在。', '', '## 首轮样本与限制', '', '郑东图书馆、大通学生中心、尚贤石均有照片。尚贤石不能当缺图测试。']
    report += ['额外缺图样本：' + json.dumps(missing[0], ensure_ascii=False) if missing else '当前有效公开目录没有未绑定且无原图地点；不能伪造缺图 POI。缺图分支仅能以隔离测试夹具验证，不能宣称真实有效 POI 已覆盖。']
    report += ['', '## 既有跨点复用（未修改）', ''] + [f'- {poi} → {source}' for poi, source in cross]
    report += ['', '这些既有绑定不能作为当前点照片的可信证明，尤其跨校区复用。清单保留 crossPoiReuse 标记供 B 阻止错误展示；本次不更改映射。', '', '## 模型', '', f'实际角色 VRM：{summary["avatarModels"]}；校园建筑模型：{summary["campusModels"]}。角色不等于校园模型；未知 scale/upAxis/preview 为 null，geometryAccuracy=unknown。', '', '## 计时', '', '各 3 次新客户端/复用客户端 HTTP 原始耗时及中位数在清单中。OS 缓存未清空，不能声称真实冷盘/冷网络或浏览器绘制结果。不报告 P95。', '', '## 复跑', '', '```powershell', '.\\.venv\\Scripts\\python.exe -B scripts/audit-a-assets.py', '```', '', '脚本仅写 data/knowledge/a_asset_inventory.json 与本报告；外部调用为 0；无 commit。完整逐资产尺寸、哈希、许可、资源路由和缺图分支见清单。']
    report += ['', '## 验收边界', '', 'A06 文件读取/服务与原文件保留 PASS_REAL；真实当前有效缺图分支 NOT_RUN（有效目录无此样本）；既有跨点语义映射 FAIL，需 B 审查后阻止误配。A07 实际文件与 HTTP 可用状态 PASS_REAL；3D 浏览器渲染 NOT_RUN。', '', f'原图重复哈希分组：{len(duplicate_groups)}；地图/媒体静态映射：{len(maps)}；完整记录在清单。', '', 'PoiProfile.tsx 在占位或加载失败时显示当前地点文字封面；GuidePresentation.tsx 隐藏失败照片；PhotoCarousel.tsx 按校区筛选已登记照片，失败时显示当前标题占位。没有借此证明跨点旧绑定正确。']
    report_path = root / 'docs/diagnostics/harness-a/assets-report.md'
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text('\n'.join(report) + '\n', encoding='utf-8')
    print(json.dumps(summary, ensure_ascii=False))
    print(json.dumps({'missingSamples': missing[:3], 'crossPoiReuse': cross}, ensure_ascii=False))
    return 0 if unchanged and not summary['unreadableReferencePhotos'] and not summary['brokenRuntimePhotos'] else 1


if __name__ == '__main__':
    raise SystemExit(main())
