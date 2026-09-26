"""Image-only overlap evidence, not a certificate of reconstructable 3D geometry.

Uses local SIFT correspondences with geometric RANSAC. No building names,
catalog annotations, measurements, network services, or generated views.
"""
from pathlib import Path
import argparse, hashlib, json, time
import cv2
import numpy as np

VERSION = "sift-overlap-v1"

def _coverage(points, shape):
    if len(points) < 3:
        return 0.0
    return float(cv2.contourArea(cv2.convexHull(np.asarray(points, np.float32)))) / (shape[0] * shape[1])

def analyze_views(images):
    started = time.monotonic()
    if not 1 <= len(images) <= 12:
        raise ValueError("每组需要1至12张照片")
    detector = cv2.SIFT_create(nfeatures=2400, contrastThreshold=0.025)
    cv2.setRNGSeed(0)
    views, duplicates, hashes = [], [], {}
    for source in images:
        data = np.fromfile(str(source['path']), dtype=np.uint8)
        gray = cv2.imdecode(data, cv2.IMREAD_GRAYSCALE)
        if gray is None:
            raise ValueError("照片解码失败: " + str(source['id']))
        if min(gray.shape) < 64:
            raise ValueError("照片分辨率过低: " + str(source['id']))
        size = min(1., 960. / max(gray.shape))
        if size < 1:
            gray = cv2.resize(gray, None, fx=size, fy=size, interpolation=cv2.INTER_AREA)
        digest = hashlib.sha256(gray.tobytes() + str(gray.shape).encode()).hexdigest()
        if digest in hashes:
            duplicates.append({'imageId': source['id'], 'duplicateOf': hashes[digest]})
            continue
        hashes[digest] = source['id']
        points, descriptors = detector.detectAndCompute(gray, None)
        views.append({'id': source['id'], 'shape': gray.shape, 'points': points, 'descriptors': descriptors})
    pairs, edges = [], {v['id']: set() for v in views}
    matcher = cv2.BFMatcher(cv2.NORM_L2)
    for i, a in enumerate(views):
        for b in views[i + 1:]:
            pair = {'a': a['id'], 'b': b['id'], 'matches': 0, 'inliers': 0,
                    'inlierRatio': 0., 'coverageA': 0., 'coverageB': 0.,
                    'overlapEvidence': False, 'geometry': 'insufficient'}
            pairs.append(pair)
            if a['descriptors'] is None or b['descriptors'] is None:
                continue
            forward = matcher.knnMatch(a['descriptors'], b['descriptors'], k=2)
            backward = matcher.knnMatch(b['descriptors'], a['descriptors'], k=2)
            reverse = {(m.queryIdx, m.trainIdx) for matches in backward if len(matches) == 2 for m, n in [matches] if m.distance < .72 * n.distance}
            matches = [m for two in forward if len(two) == 2 for m, n in [two]
                       if m.distance < .72 * n.distance and (m.trainIdx, m.queryIdx) in reverse]
            pair['matches'] = len(matches)
            if len(matches) < 12:
                continue
            pa = np.float32([a['points'][m.queryIdx].pt for m in matches])
            pb = np.float32([b['points'][m.trainIdx].pt for m in matches])
            masks = []
            _, fm = cv2.findFundamentalMat(pa, pb, cv2.FM_RANSAC, 1.5, .995)
            if fm is not None and fm.size == len(matches):
                masks.append(('epipolar', fm.reshape(-1).astype(bool)))
            _, hm = cv2.findHomography(pa, pb, cv2.RANSAC, 2.5)
            if hm is not None and hm.size == len(matches):
                masks.append(('planar_or_rotation', hm.reshape(-1).astype(bool)))
            if not masks:
                continue
            geometry, mask = max(masks, key=lambda item: int(item[1].sum()))
            inliers = int(mask.sum())
            ca, cb = _coverage(pa[mask], a['shape']), _coverage(pb[mask], b['shape'])
            overlap = inliers >= 16 and inliers / len(matches) >= .4 and min(ca, cb) >= .012
            pair.update(inliers=inliers, inlierRatio=round(inliers / len(matches), 4),
                        coverageA=round(ca, 4), coverageB=round(cb, 4),
                        overlapEvidence=bool(overlap), geometry=geometry)
            if overlap:
                edges[a['id']].add(b['id'])
                edges[b['id']].add(a['id'])
    components, seen = [], set()
    for view in views:
        if view['id'] in seen:
            continue
        stack, component = [view['id']], []
        while stack:
            current = stack.pop()
            if current in seen:
                continue
            seen.add(current)
            component.append(current)
            stack.extend(sorted(edges[current] - seen, reverse=True))
        components.append(component)
    status = ('single_view' if len(images) == 1 else 'duplicate_only' if len(views) == 1
              else 'connected' if len(components) == 1 else 'disconnected')
    warnings, recommendations = [], []
    if duplicates:
        warnings.append('重复照片不提供新的视角，未计入独立视角数。')
    if status == 'disconnected':
        warnings.append('照片组缺少可靠的跨图重叠证据；不能据此宣称已经融合为同一场景。')
        recommendations.append('补拍连接各组的中间视角，保留相同窗户、转角或其他稳定特征；不要混入无共同区域的室内照片。')
    if status in ('single_view', 'duplicate_only'):
        recommendations.append('沿目标侧向移动后补拍相邻视角，保留约一半共同区域；同一位置旋转或重复照片不增加有效视差。')
    if any(p['geometry'] == 'planar_or_rotation' and p['overlapEvidence'] for p in pairs):
        warnings.append('部分匹配可由平面或相机旋转解释；仍需由三维重投影一致性检查判断有效视差。')
    return {'status': status, 'viewCount': len(images), 'uniqueViewCount': len(views),
            'components': components, 'duplicates': duplicates, 'pairs': pairs,
            'warnings': warnings, 'recommendations': recommendations,
            'method': 'mutual SIFT ratio matches + fundamental/homography RANSAC; heuristic overlap evidence only',
            'version': VERSION, 'elapsedSeconds': round(time.monotonic() - started, 3)}

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('input', type=Path)
    parser.add_argument('--output', type=Path)
    args = parser.parse_args()
    result = analyze_views(json.loads(args.input.read_text(encoding='utf-8'))['images'])
    payload = json.dumps(result, ensure_ascii=False, indent=2)
    if args.output:
        args.output.write_text(payload, encoding='utf-8')
    else:
        print(payload)

if __name__ == '__main__':
    main()
