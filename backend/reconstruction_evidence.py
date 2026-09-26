"""Pure evidence checks shared by the reconstruction store and agent workflow.

File validity, appearance review, and scale calibration are separate claims.
These checks validate the bindings of trusted review records; review creation
belongs to a local reviewer, never to model supplied tool arguments.
"""
from datetime import datetime
import math


QUALITY_CHECKS = ('identity', 'mainStructure', 'nonCollapsed', 'appearance')
CALIBRATION_SOURCES = ('map_measurement', 'documented_dimension', 'user_measurement')
AXES = {'width': 0, 'height': 1, 'depth': 2}


def _number(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value)


def _text(value):
    return isinstance(value, str) and bool(value.strip())


def _date(value):
    if not _text(value):
        return False
    try:
        return datetime.fromisoformat(value.replace('Z', '+00:00')).tzinfo is not None
    except ValueError:
        return False


def _evidence(value):
    return isinstance(value, list) and bool(value) and all(
        _text(item) or isinstance(item, dict) and any(_text(item.get(k)) for k in ('path', 'uri', 'url'))
        for item in value
    )


def _close(a, b):
    return _number(a) and _number(b) and math.isclose(a, b, rel_tol=1e-6, abs_tol=1e-6)


def quality_review(asset):
    """Return passed only for a complete review bound to this exact GLB hash."""
    review = asset.get('qualityReview')
    if not isinstance(review, dict):
        return {'status': 'unreviewed', 'issues': ['缺少建筑外观质量审查记录']}
    issues = []
    if not _text(asset.get('sha256')) or review.get('assetSha256') != asset.get('sha256'):
        issues.append('质量审查没有绑定当前GLB哈希')
    if not all(_text(review.get(k)) for k in ('reviewer', 'method')) or not _date(review.get('reviewedAt')):
        issues.append('质量审查缺少审阅者、方法或带时区时间')
    if not _evidence(review.get('evidence')):
        issues.append('质量审查缺少可追溯的照片/渲染证据')
    checks = review.get('checks', {})
    if not isinstance(checks, dict):
        checks = {}
    failed = [key for key in QUALITY_CHECKS if checks.get(key) is False]
    missing = [key for key in QUALITY_CHECKS if checks.get(key) is not True]
    if missing:
        issues.append('建筑质量检查未全部通过：' + ', '.join(missing))
    status = 'failed' if review.get('status') == 'failed' or failed else 'unreviewed'
    if review.get('status') == 'passed' and not issues:
        status = 'passed'
    elif review.get('status') != 'passed' and not issues:
        issues.append('建筑质量审查尚未通过')
    return {'status': status, 'issues': issues, 'limitations': review.get('limitations', [])}


def map_reference_distance(points):
    """Spherical estimate in metres for two recorded GCJ-02 map points."""
    if not isinstance(points, (list, tuple)) or len(points) != 2:
        raise ValueError('地图参考边必须恰有两个端点')
    for point in points:
        if not isinstance(point, (list, tuple)) or len(point) != 2 or not all(_number(n) for n in point):
            raise ValueError('地图参考端点必须是有限经纬度')
        if not (-180 <= point[0] <= 180 and -90 <= point[1] <= 90):
            raise ValueError('地图参考端点超出经纬度范围')
    (lng1, lat1), (lng2, lat2) = points
    p1, p2 = math.radians(lat1), math.radians(lat2)
    value = math.sin((p2-p1)/2)**2 + math.cos(p1)*math.cos(p2)*math.sin(math.radians(lng2-lng1)/2)**2
    return 6371000 * 2 * math.asin(math.sqrt(min(1, max(0, value))))


def calibration_review(asset, layout):
    """Validate evidence and the measured-reference to model-axis correspondence."""
    if not isinstance(layout, dict):
        return {'status': 'unverified', 'issues': ['没有地图与尺度标定记录']}
    record = layout.get('calibration')
    reference = layout.get('reference')
    if not isinstance(record, dict) or not isinstance(reference, dict):
        return {'status': 'unverified', 'issues': ['只有声明的参考长度，缺少经核对的标定记录']}
    issues = []
    if record.get('status') != 'verified':
        issues.append('参考尺度尚未核对')
    digest = asset.get('sha256')
    if not _text(digest) or record.get('assetSha256') != digest or layout.get('assetVersion') != digest:
        issues.append('标定没有绑定当前GLB版本')
    if record.get('sourceKind') not in CALIBRATION_SOURCES:
        issues.append('标定来源类型无效')
    if not _evidence(record.get('evidence')) or not _text(record.get('method')) or not _date(record.get('verifiedAt')):
        issues.append('标定缺少依据、对应方法或带时区核对时间')
    axis = record.get('referenceAxis')
    if axis not in AXES or axis != reference.get('axis'):
        issues.append('参考边与模型轴不对应')
    length = record.get('referenceLengthM')
    if not _number(length) or not (0 < length <= 2000) or not _close(length, reference.get('lengthM')):
        issues.append('参考长度无效或与布局记录不一致')
    extents = asset.get('extents')
    valid_extents = isinstance(extents, (list, tuple)) and len(extents) == 3 and all(_number(x) and x > 0 for x in extents)
    model_length = record.get('modelReferenceLength')
    if not valid_extents or axis not in AXES or not _close(model_length, extents[AXES[axis]]):
        issues.append('参考边没有对应当前模型的同一完整轴向边长')
    if _number(length) and _number(model_length) and model_length > 0:
        expected_scale = length / model_length
        if not _close(layout.get('metersPerModelUnit'), expected_scale):
            issues.append('布局比例与参考长度不一致')
        dimensions = layout.get('dimensionsM', {})
        if valid_extents and (not isinstance(dimensions, dict) or any(not _close(dimensions.get(k), extents[i]*expected_scale) for k, i in AXES.items())):
            issues.append('显示尺寸与实际模型变换不一致')
    if record.get('sourceKind') == 'map_measurement':
        if layout.get('crs') != 'GCJ02':
            issues.append('地图量测坐标系不是明确的GCJ02')
        try:
            measured = map_reference_distance(reference.get('points'))
            if not _number(length) or measured <= 0 or abs(measured-length) > max(0.05, measured*0.01):
                issues.append('参考长度与地图端点球面距离不一致')
        except ValueError as exc:
            issues.append(str(exc))
    return {'status': 'verified' if not issues else 'unverified', 'issues': issues, 'sourceKind': record.get('sourceKind')}
