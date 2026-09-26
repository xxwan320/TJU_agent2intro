"""Image-only preprocessing; never replace a failed reconstruction with geometry."""
from PIL import Image, ImageOps
import numpy as np

def prepare_image(original, remove_background=True, remover=None, profile_name="u2net", return_foreground=False):
    original = ImageOps.exif_transpose(original).convert('RGBA')
    if original.width < 2 or original.height < 2:
        raise ValueError('图片至少需要2×2像素')
    original.thumbnail((1536, 1536))
    coverage = lambda im: float((np.asarray(im)[:, :, 3] > 127).mean())
    if coverage(original) == 0:
        raise ValueError('图片完全透明，没有可见主体；请上传包含可见内容的原图')
    info = {'profile': 'supplied-alpha' if original.getextrema()[3] != (255, 255) else 'original', 'warnings': [], 'attempts': []}
    im = original
    if remove_background and original.getextrema()[3] == (255, 255):
        try:
            candidate = remover(original.copy()).convert('RGBA')
            fraction = coverage(candidate)
            info['attempts'].append({'profile': profile_name, 'foregroundCoverage': fraction})
            if fraction >= .03:
                im = candidate
                info['profile'] = profile_name
            else:
                info['profile'] = 'original-recovery'
                info['warnings'].append('自动去背景未保留足够主体，已使用原图继续真实重建；背景可能进入模型，请对照原图检查。')
        except Exception as exc:
            info['profile'] = 'original-recovery'
            info['attempts'].append({'profile': profile_name, 'errorType': type(exc).__name__})
            info['warnings'].append('自动去背景不可用，已使用原图继续真实重建；背景可能进入模型。')
    info['foregroundCoverage'] = coverage(im)
    # Crop to nonzero alpha, not alpha>127: preserve faint/small supplied subjects.
    bbox = im.getchannel('A').getbbox()
    if not bbox:
        raise ValueError('图片没有可见主体')
    im = im.crop(bbox)
    side = max(2, int(max(im.size) / .9 + .5))
    canvas = Image.new('RGBA', (side, side), (128,128,128,0))
    canvas.paste(im, ((side-im.width)//2, (side-im.height)//2))
    background = Image.new('RGBA', canvas.size, (128,128,128,255))
    prepared=Image.alpha_composite(background,canvas).convert('RGB')
    return (prepared,info,canvas) if return_foreground else (prepared,info)
