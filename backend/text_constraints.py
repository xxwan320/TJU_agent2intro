"""Small deterministic parsers for text requirements that a diffusion model cannot guarantee."""
import re

_NUM = r"(\d+|[零一二两三四五六七八九十]+)"
_DIGITS = {"零": 0, "一": 1, "二": 2, "两": 2, "三": 3, "四": 4, "五": 5, "六": 6, "七": 7, "八": 8, "九": 9}

def _number(value):
    if value.isdigit(): return int(value)
    if value == "十": return 10
    if "十" in value:
        left, right = value.split("十", 1)
        return (_DIGITS.get(left, 1) * 10) + (_DIGITS.get(right, 0) if right else 0)
    return _DIGITS.get(value, 0)

def parse_house_constraints(prompt):
    """Return a structured spec for simple, rectilinear architectural prompts."""
    text=prompt.strip().lower()
    if not re.search(r"房子|房屋|楼房|住宅|建筑|小屋|房舍|\bhouse\b|\bbuilding\b|\bcabin\b|\bcottage\b",text): return None
    windows=None
    cn=re.search(r"(?:每层|每一层)\s*(?:要有|有)?\s*"+_NUM+r"\s*(?:扇|个|樘)?\s*(?:窗户|窗)",text)
    en=re.search(r"(\d+)\s+windows?\s+per\s+(?:floor|storey|story)",text)
    match=cn or en
    if match: windows=_number(match.group(1))
    floors_match=re.search(_NUM+r"\s*(?:层楼|层|storeys?|stories|floors?)",text)
    # Avoid treating the phrase 'every floor' as a floor count.
    floors=_number(floors_match.group(1)) if floors_match and not text.startswith("每") else (1 if re.search(r"小屋|小房|\bcabin\b|\bcottage\b",text) else 2)
    regularity=r"轮廓简洁|线条规整|平直线条|规整|对称|简约|干净的轮廓|clean silhouette|straight lines|regular geometry|symmetrical"
    if windows is None and not re.search(regularity,text):return None
    explicit_windows=windows is not None
    if windows is None: windows=2
    if not 1<=windows<=8:return None
    if not 1<=floors<=8:floors=2
    roof="gable" if re.search(r"尖顶|人字顶|坡屋顶|gable|pitched roof",text) else "flat"
    door=bool(re.search(r"入口|正门|门|\bentrance\b|\bfront door\b",text))
    return {"floors":floors,"windowsPerFloor":windows,"totalFrontWindows":floors*windows,"windowCountExplicit":explicit_windows,"door":door,"roofStyle":roof,"windowPlacement":"front facade, evenly spaced and symmetric","dimensions":{"width":1.0,"depth":0.72,"floorHeight":0.28,"wallThickness":0.035},"specVersion":"parametric-house-v2"}
