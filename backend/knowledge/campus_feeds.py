"""Lightweight cached campus resource tier.

This borrows freshness mechanics from the reference project without copying its
UI or crawler stack: registered official pages are scanned for subscription
links, stale data is served immediately, and one background refresh updates it.
"""
from __future__ import annotations

import asyncio
from datetime import datetime, timezone
from hashlib import sha256
import json
from pathlib import Path
import re
import time
from urllib.parse import urljoin, urlsplit

import httpx
from lxml import html

from backend.contracts import CampusId, Source


ROOT = Path(__file__).resolve().parents[2]
CHANNELS_FILE = ROOT / "data" / "knowledge" / "campus_channels.json"
LIVE_ROOT = ROOT / "data" / "live_knowledge"
FEED_FILE = LIVE_ROOT / "subscriptions.json"
WIKI_FILE = LIVE_ROOT / "wiki.json"
INDEX_TTL = 3600
FEED_TTL = 3600
WIKI_TTL = 6 * 3600
_TOKEN = re.compile(r"[a-z0-9]+|[\u3400-\u9fff]{2}", re.IGNORECASE)


def _load(path: Path, fallback):
    try:
        value = json.loads(path.read_text("utf-8"))
        return value if isinstance(value, type(fallback)) else fallback
    except (OSError, json.JSONDecodeError):
        return fallback


def _save(path: Path, value) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(".tmp")
    temporary.write_text(json.dumps(value, ensure_ascii=False), "utf-8")
    temporary.replace(path)


def _terms(value: str) -> set[str]:
    out = set(_TOKEN.findall(value.casefold()))
    chinese = "".join(re.findall(r"[\u3400-\u9fff]", value))
    out.update(chinese[i:i + 2] for i in range(len(chinese) - 1))
    return out - {"天津", "大学", "天大", "校区", "一下", "请问"}


class CampusFeedLibrary:
    def __init__(self):
        self._refresh_task: asyncio.Task | None = None
        self._guard = asyncio.Lock()
        self._retry_after = 0.0

    def channels(self) -> list[dict]:
        data = _load(CHANNELS_FILE, {"channels": []})
        return data.get("channels", []) if isinstance(data, dict) else []

    @staticmethod
    def _age(path: Path, key: str = "updated_at") -> float:
        data = _load(path, {})
        try:
            return time.time() - float(data.get(key) or 0)
        except (TypeError, ValueError):
            return float("inf")

    def ensure_fresh(self) -> None:
        """Half-life renewal plus stale-on-query refresh; callers never await it."""
        if time.monotonic() < self._retry_after or self._age(FEED_FILE) <= FEED_TTL * .5:
            return
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            return
        if self._refresh_task is None or self._refresh_task.done():
            self._retry_after = time.monotonic() + 60
            self._refresh_task = loop.create_task(self.refresh())
            self._refresh_task.add_done_callback(self._refresh_finished)

    def _refresh_finished(self, task):
        if not task.cancelled():
            # Retrieve errors so a disk/network failure never leaks an unhandled task.
            task.exception()

    async def refresh(self) -> dict:
        async with self._guard:
            # Recheck inside the single-flight guard.
            if self._age(FEED_FILE) < FEED_TTL * .5:
                return _load(FEED_FILE, {"items": []})
            channels = [c for c in self.channels() if c.get("site")][:24]
            semaphore = asyncio.Semaphore(5)
            async with httpx.AsyncClient(timeout=3.5, follow_redirects=True,
                                         headers={"User-Agent": "AI4TJU/1.1 campus subscription index"}) as client:
                async def scan(channel: dict) -> list[dict] | None:
                    url = channel["site"]
                    try:
                        async with semaphore:
                            response = await client.get(url)
                        response.raise_for_status()
                        if len(response.content) > 2_000_000:
                            return []
                        tree = html.fromstring(response.text)
                        rows = []
                        for anchor in tree.xpath("//a[@href]"):
                            target = urljoin(str(response.url), anchor.get("href", ""))
                            if urlsplit(target).hostname != "mp.weixin.qq.com":
                                continue
                            title = re.sub(r"\s+", " ", anchor.text_content()).strip()
                            if len(title) < 5:
                                continue
                            rows.append({"title": title[:240], "url": target, "account": channel["name"],
                                         "category": channel["category"], "published_at": None,
                                         "retrieved_at": datetime.now(timezone.utc).isoformat()})
                        return rows[:30]
                    except (httpx.HTTPError, ValueError):
                        return None
                pages = await asyncio.gather(*(scan(channel) for channel in channels))
            existing = _load(FEED_FILE, {"items": []}).get("items", [])
            if not pages or all(page is None for page in pages):
                return _load(FEED_FILE, {"items": []})
            by_url = {row.get("url"): row for row in existing if row.get("url")}
            for row in (item for page in pages if page is not None for item in page):
                by_url[row["url"]] = {**by_url.get(row["url"], {}), **row}
            value = {"updated_at": int(time.time()), "items": list(by_url.values())[-500:]}
            _save(FEED_FILE, value)
            return value

    async def search(self, query: str, campus_id: CampusId, limit: int = 5) -> list[Source]:
        self.ensure_fresh()
        terms = _terms(query)
        if not terms:
            return []
        feed = _load(FEED_FILE, {"items": []}).get("items", [])
        wiki = _load(WIKI_FILE, {"items": []}).get("items", [])
        ranked: list[tuple[float, str, dict]] = []
        for row in feed:
            if row.get("campus_id") not in (None, campus_id):
                continue
            text = " ".join(str(row.get(k, "")) for k in ("title", "digest", "account", "category"))
            overlap = terms & _terms(text)
            if not overlap:
                continue
            score = len(overlap) * 2 + (4 if query.casefold() in text.casefold() else 0)
            ranked.append((score, "subscription", row))
        # Wiki rows are optional cached resources, refreshed by an external importer at 6h TTL.
        # Their age is exposed in the snippet so they cannot masquerade as live notices.
        wiki_stale = self._age(WIKI_FILE) > WIKI_TTL
        for row in wiki:
            if row.get("campus_id") not in (None, campus_id):
                continue
            text = f"{row.get('title', '')} {row.get('body', '')}"
            overlap = terms & _terms(text)
            if overlap:
                ranked.append((len(overlap), "wiki", row))
        ranked.sort(key=lambda item: -item[0])
        feed_stale = self._age(FEED_FILE) > FEED_TTL
        hits = []
        for _, kind, row in ranked[:limit]:
            if kind == "subscription":
                snippet = (row.get("digest") or row.get("title") or "")[:1800]
                snippet = ("订阅缓存已过期；" if feed_stale else "") + "官网收录的公众号链接，未核验全文和当前有效期；" + snippet
                title = f"公众号订阅：{row.get('account') or '天津大学校内账号'} · {row.get('title') or '通知'}"
                prefix = "subscription"
            else:
                snippet = ("缓存可能已超过 6 小时；" if wiki_stale else "") + str(row.get("body") or "")[:1800]
                title = f"北洋维基缓存：{row.get('title') or '校内条目'}"
                prefix = "wiki"
            digest = sha256(f"{row.get('url')}\n{row.get('title')}".encode()).hexdigest()[:16]
            cache = FEED_FILE if kind == "subscription" else WIKI_FILE
            raw_updated = _load(cache, {}).get("updated_at")
            try:
                fetched_at = datetime.fromtimestamp(float(raw_updated), timezone.utc).isoformat()
            except (TypeError, ValueError, OSError, OverflowError):
                fetched_at = "1970-01-01T00:00:00+00:00"
            hits.append(Source(id=f"{prefix}-{digest}", title=title, snippet=snippet,
                url=row.get("url") or "https://wiki.tjubot.cn/", campus_id=campus_id,
                published_at=row.get("published_at"), retrieved_at=row.get("retrieved_at") or fetched_at))
        return hits


campus_feeds = CampusFeedLibrary()
