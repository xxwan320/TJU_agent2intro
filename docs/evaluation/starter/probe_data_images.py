#!/usr/bin/env python3
"""Read-only image inventory and optional same-origin HTTP probes; stdlib first."""
import argparse
import base64
import hashlib
import io
import json
import re
import tempfile
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import parse_qsl, urljoin, urlsplit, urlunsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener
import os

EXTS = {'.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tif', '.tiff', '.avif', '.ico', '.svg'}
EXCLUDE = {'.git', '.worktrees', 'node_modules', 'dist', 'build', '.venv', 'venv', '__pycache__', '.next', 'coverage'}
LIMIT = 8 * 1024 * 1024
LITERAL = re.compile(r'''(["'])([^"'\r\n]+\.(?:png|jpe?g|webp|gif|bmp|tiff?|avif|ico|svg)(?:[?#][^"'\r\n]*)?)\1''', re.I)
PNG = base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=')


def origin(url):
    p = urlsplit(url)
    return p.scheme.lower(), (p.hostname or '').lower(), p.port or (443 if p.scheme == 'https' else 80)


def safe_url(url):
    p = urlsplit(url)
    host = p.hostname or ''
    if ':' in host:
        host = '[' + host + ']'
    if p.port:
        host += ':' + str(p.port)
    return urlunsplit((p.scheme, host or p.netloc, p.path, '[redacted]' if p.query else '', ''))


def sensitive(url):
    p = urlsplit(url)
    keys = [k.lower().replace('-', '_') for k, _ in parse_qsl(p.query)]
    return bool(p.username or p.password or any(any(t in k for t in ('token', 'key', 'signature', 'credential', 'auth')) or k in {'sig', 'expires'} or k.startswith(('x_amz_', 'x_goog_')) for k in keys))


def signature(data):
    if data.startswith(b'\x89PNG\r\n\x1a\n'): return 'png'
    if data.startswith(b'\xff\xd8\xff'): return 'jpeg'
    if data[:6] in (b'GIF87a', b'GIF89a'): return 'gif'
    if data[:4] == b'RIFF' and data[8:12] == b'WEBP': return 'webp'
    if data.startswith(b'BM'): return 'bmp'
    if data[:4] in (b'II*\x00', b'MM\x00*'): return 'tiff'
    if data.startswith(b'\x00\x00\x01\x00'): return 'ico'
    if data[4:8] == b'ftyp' and any(x in data[8:40] for x in (b'avif', b'avis')): return 'avif'
    if b'<svg' in data[:1024].lower(): return 'svg'
    return None


def decode(data, force_unavailable=False):
    if force_unavailable:
        return {'decode_status': 'decoder_unavailable'}
    if signature(data) == 'svg':
        return {'decode_status': 'decoder_unsupported_format'}
    try:
        from PIL import Image
    except ImportError:
        return {'decode_status': 'decoder_unavailable'}
    try:
        with Image.open(io.BytesIO(data)) as im:
            width, height = im.size
            im.load()
        return {'decode_status': 'decoded', 'width': width, 'height': height}
    except Exception as exc:
        return {'decode_status': 'decode_failed', 'error_type': type(exc).__name__}


def inspect_local(path, repo):
    result = {'local_path': str(path), 'mapping_status': 'unverified'}
    try:
        path.resolve().relative_to(repo.resolve())
        result['local_path'] = path.relative_to(repo).as_posix()
    except ValueError:
        return dict(result, status='outside_repo_skipped')
    try:
        digest, head, size = hashlib.sha256(), b'', 0
        with path.open('rb') as f:
            for chunk in iter(lambda: f.read(1024 * 1024), b''):
                digest.update(chunk)
                size += len(chunk)
                if len(head) < LIMIT + 1:
                    head += chunk[:LIMIT + 1 - len(head)]
        result.update(status='read', bytes=size, sha256=digest.hexdigest(), signature=signature(head))
        result.update(decode(head) if size <= LIMIT else {'decode_status': 'size_limit_skipped'})
    except OSError as exc:
        result.update(status='read_failed', error_type=type(exc).__name__)
    return result


def walk(root):
    for folder, dirs, files in os.walk(root, followlinks=False):
        dirs[:] = sorted(d for d in dirs if d not in EXCLUDE and not (Path(folder) / d).is_symlink())
        for name in sorted(files):
            path = Path(folder) / name
            if not path.is_symlink():
                yield path


def inventory(repo, manifest=None):
    assets = [inspect_local(p, repo) for p in walk(repo / 'data') if p.suffix.lower() in EXTS]
    refs, warnings = [], []
    if not (repo / 'data').is_dir(): warnings.append('repo/data does not exist; no data images scanned')
    for ts in (p for p in walk(repo) if p.name == 'tour-photos.ts'):
        try:
            source = ts.read_text(encoding='utf-8-sig')
        except (OSError, UnicodeError) as exc:
            warnings.append(f'{ts.relative_to(repo)}: {type(exc).__name__}')
            continue
        for match in LITERAL.finditer(source):
            value = match.group(2)
            if not (value.startswith('/') or value.startswith(('http://', 'https://'))): continue
            refs.append({'source': ts.relative_to(repo).as_posix(), 'line': source.count('\n', 0, match.start()) + 1,
                         'app_url': safe_url(value), '_url': value, 'mapping_status': 'unverified_literal_candidate',
                         'label_verified': False, 'sensitive_url_rejected': sensitive(value)})
    if manifest:
        obj = json.loads(manifest.read_text(encoding='utf-8-sig'))
        if not isinstance(obj, dict) or not isinstance(obj.get('assets'), list):
            raise ValueError('manifest must contain an assets array')
        for entry in obj['assets']:
            if not isinstance(entry, dict): raise ValueError('each asset must be an object')
            ref = {k: entry[k] for k in ('asset_id', 'poi_id', 'campus_id', 'label_verified') if k in entry}
            ref.update(source='explicit_manifest', mapping_status='manifest_claim_not_independently_verified')
            if entry.get('local_path'):
                ref['local'] = inspect_local(repo / entry['local_path'], repo)
            value = entry.get('app_url', '')
            ref.update(app_url=safe_url(value), _url=value, sensitive_url_rejected=sensitive(value))
            refs.append(ref)
    return {'data_images': assets, 'references': refs, 'warnings': warnings,
            'dom_render_status': 'not_tested', 'visual_recognition_status': 'not_tested', 'gps_status': 'not_tested'}


class SameOriginRedirect(HTTPRedirectHandler):
    def __init__(self, allowed): self.allowed = allowed
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        if origin(newurl) != self.allowed or sensitive(newurl):
            raise HTTPError(req.full_url, code, 'redirect_rejected', headers, fp)
        return super().redirect_request(req, fp, code, msg, headers, newurl)


def http_probe(value, base, force_unavailable=False):
    result = {'app_url': safe_url(value)}
    if sensitive(value): return dict(result, status='sensitive_url_rejected')
    if not value or not (value.startswith('/') or value.startswith(('http://', 'https://'))):
        return dict(result, status='not_a_public_url_candidate')
    url = urljoin(base.rstrip('/') + '/', value)
    if origin(url) != origin(base): return dict(result, status='external_origin_skipped')
    result['request_url'] = safe_url(url)
    opener = build_opener(SameOriginRedirect(origin(base)))
    try:
        with opener.open(Request(url, headers={'Accept': 'image/*', 'User-Agent': 'AI4TJU-local-image-probe/1'}), timeout=5) as response:
            result.update(http_status=response.status, mime=response.headers.get_content_type())
            data = response.read(LIMIT + 1)
        result['bytes_read'] = len(data)
        if result['http_status'] != 200: return dict(result, status='unexpected_http_status')
        if len(data) > LIMIT: return dict(result, status='size_limit_exceeded')
        head = data[:1024].lstrip().lower()
        if result['mime'] == 'text/html' or head.startswith((b'<!doctype html', b'<html')):
            return dict(result, status='html_spa_fallback_or_error')
        kind = signature(data)
        result['signature'] = kind
        expected = {'png':'image/png', 'jpeg':'image/jpeg', 'gif':'image/gif', 'webp':'image/webp', 'bmp':'image/bmp', 'tiff':'image/tiff', 'avif':'image/avif', 'ico':'image/vnd.microsoft.icon', 'svg':'image/svg+xml'}
        if not kind: return dict(result, status='unrecognized_image_signature')
        if result['mime'] != expected[kind] and not (kind == 'ico' and result['mime'] == 'image/x-icon'):
            return dict(result, status='mime_signature_mismatch')
        result.update(decode(data, force_unavailable))
        result['status'] = {'decoded':'image_content_validated', 'decoder_unavailable':'image_bytes_decode_unverified', 'decoder_unsupported_format':'image_bytes_decode_unverified', 'decode_failed':'image_decode_failed'}[result['decode_status']]
        return result
    except HTTPError as exc:
        return dict(result, http_status=exc.code, status='not_found' if exc.code == 404 else ('redirect_rejected' if exc.reason == 'redirect_rejected' else 'http_error'))
    except (OSError, URLError, ValueError) as exc:
        return dict(result, status='request_failed', error_type=type(exc).__name__)


def public(obj):
    if isinstance(obj, dict): return {k: public(v) for k, v in obj.items() if not k.startswith('_')}
    if isinstance(obj, list): return [public(v) for v in obj]
    return obj


def self_test():
    class Handler(BaseHTTPRequestHandler):
        def log_message(self, *args): pass
        def do_GET(self):
            if self.path == '/missing.png': self.send_error(404); return
            if self.path == '/ok.svg':
                self.send_response(200); self.send_header('Content-Type', 'image/svg+xml'); self.end_headers()
                self.wfile.write(b'<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>'); return
            if self.path == '/redirect.png':
                self.send_response(302); self.send_header('Location', 'http://example.invalid/a.png'); self.end_headers(); return
            is_html = self.path == '/spa.png'
            self.send_response(200)
            self.send_header('Content-Type', 'text/html' if is_html else ('text/plain' if self.path == '/mime.png' else 'image/png'))
            self.end_headers(); self.wfile.write(b'<html>SPA</html>' if is_html else PNG)
    server = ThreadingHTTPServer(('127.0.0.1', 0), Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True); thread.start()
    base = f'http://127.0.0.1:{server.server_port}'
    try:
        assert http_probe('/ok.png', base, True)['status'] == 'image_bytes_decode_unverified'
        assert http_probe('/ok.png', base)['status'] in {'image_content_validated', 'image_bytes_decode_unverified'}
        svg = http_probe('/ok.svg', base)
        assert svg['signature'] == 'svg' and svg['mime'] == 'image/svg+xml'
        assert svg['decode_status'] == 'decoder_unsupported_format' and svg['status'] == 'image_bytes_decode_unverified'
        for name, expected in [('spa', 'html_spa_fallback_or_error'), ('missing', 'not_found'), ('mime', 'mime_signature_mismatch'), ('redirect', 'redirect_rejected')]:
            assert http_probe(f'/{name}.png', base)['status'] == expected
        assert http_probe('/ok.png?token=SECRET', base)['status'] == 'sensitive_url_rejected'
        assert 'SECRET' not in json.dumps(http_probe('/ok.png?token=SECRET', base))
        assert http_probe('http://example.invalid/a.png', base)['status'] == 'external_origin_skipped'
        with tempfile.TemporaryDirectory() as temp:
            repo = Path(temp); (repo / 'data').mkdir(); (repo / 'data/a.png').write_bytes(PNG)
            (repo / 'tour-photos.ts').write_text('export const photos = { fakePoi: "/a.png" };', encoding='utf-8')
            inv = inventory(repo)
            assert inv['data_images'][0]['sha256'] == hashlib.sha256(PNG).hexdigest()
            assert len(inv['references']) == 1 and 'poi_id' not in inv['references'][0]
        print('SELF-TEST PASS: local inventory; image GET; SVG decode unverified; missing decoder; HTML fallback; 404; MIME; origin/redirect guard; secret redaction; no inferred POI.')
    finally:
        server.shutdown(); server.server_close(); thread.join(timeout=2)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', type=Path, help='Local repository root, e.g. E:\\AI4TJU')
    parser.add_argument('--out', type=Path, default=Path('docs/evaluation/image_probe'), help='Output directory relative to repo, or absolute')
    parser.add_argument('--manifest', type=Path, help='Optional reviewed asset manifest; path relative to repo, or absolute')
    parser.add_argument('--base-url', help='Actual running application origin; report example http://127.0.0.1:8000 must be verified at runtime')
    parser.add_argument('--check-http', action='store_true', help='Opt in to bounded GET requests; never tests DOM rendering')
    parser.add_argument('--max-http', type=int, default=6, help='Maximum initial HTTP probes; redirects can add requests')
    parser.add_argument('--self-test', action='store_true')
    args = parser.parse_args()
    if args.self_test: self_test(); return
    if not args.repo or not args.repo.is_dir(): parser.error('--repo must be an existing local directory')
    if args.max_http < 0: parser.error('--max-http must be nonnegative')
    if args.check_http and (not args.base_url or urlsplit(args.base_url).scheme not in {'http', 'https'} or not urlsplit(args.base_url).netloc or sensitive(args.base_url)):
        parser.error('--check-http requires a valid --base-url without credentials or secret query parameters')
    repo = args.repo.resolve(); out = repo / args.out
    inv = inventory(repo, repo / args.manifest if args.manifest else None)
    results, attempted = [], 0
    for ref in inv['references']:
        value = ref['_url']
        if not args.check_http: result = {'app_url': ref['app_url'], 'status':'not_requested'}
        elif attempted >= args.max_http: result = {'app_url': ref['app_url'], 'status':'budget_skipped'}
        else:
            result = http_probe(value, args.base_url)
            if 'request_url' in result: attempted += 1
        results.append(result)
    out.mkdir(parents=True, exist_ok=True)
    (out / 'inventory.json').write_text(json.dumps(public(inv), ensure_ascii=False, indent=2), encoding='utf-8')
    (out / 'http_results.json').write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding='utf-8')
    counts = {state: sum(r['status'] == state for r in results) for state in sorted({r['status'] for r in results})}
    summary = f'''# Image probe summary\n\nData images: {len(inv['data_images'])}; reference candidates: {len(inv['references'])}; Initial HTTP probes: {attempted}. Redirect follow-ups are not counted here; this is not an exact vendor request count.\n\nHTTP statuses: `{json.dumps(counts, ensure_ascii=False)}`\n\n- Source files were read only. Only this output directory is written.\n- TS extraction is a lexical candidate scan, including possible comments or unused literals; it does not execute TS or prove runtime use. Nearby keys never become POI IDs. Relative imports and runtime-concatenated URLs are not resolved; bind their real public URLs explicitly in a reviewed manifest.\n- Review candidates and explicitly map asset IDs, POI IDs, campus IDs, local paths and app URLs in a manifest. Manifest labels are supplied claims, not independently verified facts.\n- Local image paths do not prove HTTP routes. HTTP 200 alone does not prove an image works. No Pillow means decoder_unavailable, not successful decoding.\n- HTTP validation does not verify browser DOM rendering, app use of an image, or model visual recognition. All remain NOT TESTED.\n- Media-to-POI metadata association is not visual recognition. A photograph without GPS is not evidence of the user's current location; even photo GPS would describe capture location, not necessarily current location.\n- Requests use a 5-second socket timeout, an 8 MiB response limit and same-origin redirect checks. No secret-bearing query URLs are requested; query values are redacted in output.\n- SVG returns decoder_unsupported_format and image_bytes_decode_unverified; its marker and MIME checks do not validate XML, safety, browser rendering or visual content. SVG browser rendering is not tested by Pillow. No external URLs, app credentials or login sessions are used.\n'''
    (out / 'summary.md').write_text(summary, encoding='utf-8')
    print(f'Wrote inventory.json, http_results.json and summary.md to {out}')


if __name__ == '__main__':
    main()
