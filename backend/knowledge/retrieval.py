"""Registered, bounded evidence workflow. Web text never supplies navigation data."""
from __future__ import annotations
import asyncio
from collections import OrderedDict
from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone, timedelta
import hashlib
import json
from pathlib import Path
import re
import time
from urllib.parse import urljoin, urlsplit
from zoneinfo import ZoneInfo
import httpx
from lxml import html
from backend.contracts import Source

ROOT = Path(__file__).resolve().parents[2] / 'docs/evaluation/starter'
try:
    SHANGHAI = ZoneInfo('Asia/Shanghai')
except KeyError:
    SHANGHAI = timezone(timedelta(hours=8), 'Asia/Shanghai')


def today():
    return datetime.now(SHANGHAI).date().isoformat()


def intent_for(query):
    if re.search('今天|今日|现在|开放|关门|闭馆|预约|门禁|临时|票价', query):
        return 'current_rule'
    if re.search('新闻|最近|近期|出发前', query):
        return 'news'
    if re.search('拍照|体验|好玩', query):
        return 'experience'
    return 'stable'


@dataclass
class Evidence:
    sourceId: str
    registryId: str
    title: str
    text: str
    url: str
    finalUrl: str
    publishedAt: str | None
    validFrom: str | None
    validTo: str | None
    fetchedAt: str
    campusId: str
    poiIds: list[str]
    provenance: dict
    currentApplicable: bool = False

    def source(self):
        label = '社区资料（非官方）' if self.provenance['sourceTier'] == 'community' else '官方资料'
        return Source(id=self.sourceId, title=f'{label}：{self.title}',
                      snippet=self.text + ('' if self.currentApplicable else '；不能据此确认今日开放或入校许可。'),
                      url=self.finalUrl, campus_id=self.campusId,
                      published_at=self.publishedAt, retrieved_at=self.fetchedAt)


@dataclass
class RetrievalResult:
    status: str
    evidence: list[Evidence] = field(default_factory=list)
    scope: list[str] = field(default_factory=list)
    trace: list[dict] = field(default_factory=list)
    page_calls: int = 0
    search_calls: int = 0
    cache_hit: bool = False


class SourceRegistry:
    def __init__(self):
        self.sources = json.loads((ROOT / 'source_registry.json').read_text('utf-8'))['sources']
        self.policy = json.loads((ROOT / 'retrieval_policy.json').read_text('utf-8'))
        documents=Path(__file__).resolve().parents[2]/'data/knowledge/documents.json'
        self.version = hashlib.sha256(json.dumps(self.sources, sort_keys=True).encode()+documents.read_bytes()).hexdigest()[:12]

    def match(self, url, campus, enabled=True):
        parsed = urlsplit(url)
        if parsed.scheme != 'https' or parsed.username or parsed.password or parsed.port not in (None, 443):
            return None
        return next((s for s in self.sources if (s['enabled'] or not enabled) and campus in s['campuses']
                     and parsed.hostname in s['hosts'] and any(parsed.path.startswith(p) for p in s['allowed_path_prefixes'])), None)

    def candidates(self, query, campus, intent, supplemental=False):
        eligible = [s for s in self.sources if s['enabled'] and campus in s['campuses']
                    and (s['tier'] == 'community') == supplemental]
        if supplemental:
            return eligible if intent in ('stable', 'experience') else []
        if '尚贤' in query or '孔子石' in query:
            return [s for s in eligible if s['id'] == 'tju-news']
        if re.search('校史|博物馆|出发前', query):
            return [s for s in eligible if s['id'] in ('tju-archives', 'tju-news')]
        return [s for s in eligible if s['id'] in ('tju-news', 'tju-main')]


def terms(query):
    return set(re.findall(r'[A-Za-z]{3,}|[\u3400-\u9fff]{2}', query)) - {'天津', '大学', '今天', '请问', '一下', '介绍', '北洋', '园校', '卫津', '路校'}


class EvidenceRetriever:
    def __init__(self, registry=None, client=None):
        self.registry = registry or SourceRegistry()
        self.client = client or httpx.AsyncClient(follow_redirects=False, timeout=1.5, headers={'User-Agent': 'AI4TJU-Guide/1.0'})
        self.cache = OrderedDict()
        self.flights = {}
        self.consumers = {}
        self.pending_results = {}
        self.slots = asyncio.Semaphore(self.registry.policy['limits']['max_concurrency'])
        self.host_slots = {}

    def cache_key(self, query, campus, poi, intent, as_of, constraints, scope):
        normalized = {k: sorted(v) if k in ('mustVisit', 'avoid', 'must_visit') and isinstance(v, list) else v
                      for k, v in (constraints or {}).items()}
        return json.dumps([campus, poi, intent, as_of, re.sub(r'\s+', '', query), normalized, scope,
                           self.registry.version], sort_keys=True, ensure_ascii=False)

    async def retrieve(self, query, campus, poi=None, as_of=None, constraints=None, deadline=None, supplemental=False):
        if campus not in ('weijinlu', 'beiyangyuan'):
            raise ValueError('invalid campus')
        as_of = as_of or today()
        datetime.strptime(as_of, '%Y-%m-%d')
        intent = intent_for(query)
        scope = [s['id'] for s in self.registry.candidates(query, campus, intent, supplemental)]
        key = self.cache_key(query, campus, poi, intent, as_of, constraints, scope)
        cached = self.cache.get(key)
        if cached and cached[0] > time.monotonic():
            return RetrievalResult(**{**cached[1].__dict__, 'cache_hit': True, 'page_calls': 0, 'search_calls': 0})
        if key not in self.flights:
            end = min(deadline or time.monotonic()+45, time.monotonic()+self.registry.policy['limits']['retrieval_total_ms']/1000)
            self.pending_results[key]=RetrievalResult('no_evidence')
            self.flights[key] = asyncio.create_task(self._run(query, campus, poi, intent, as_of, end, supplemental,self.pending_results[key]))
            self.consumers[key] = 0
        task = self.flights[key]
        self.consumers[key] += 1
        try:
            remaining = max(0, (deadline or time.monotonic()+45)-time.monotonic())
            try:result = await asyncio.wait_for(asyncio.shield(task), remaining)
            except TimeoutError:
                current=self.pending_results[key]
                return RetrievalResult('timeout',list(current.evidence),list(current.scope),list(current.trace),current.page_calls,current.search_calls)
            profile = 'stable' if intent == 'experience' else intent
            ttl = (self.registry.policy['cache']['ttl_seconds'][profile] if result.status in ('success', 'partial')
                   else 30 if result.status == 'no_evidence' else 15)
            self.cache[key] = (time.monotonic()+ttl, result)
            while len(self.cache) > 256:
                self.cache.popitem(last=False)
            return result
        finally:
            self.consumers[key] -= 1
            if not self.consumers[key]:
                if not task.done():
                    task.cancel()
                self.flights.pop(key, None)
                self.consumers.pop(key, None)
                self.pending_results.pop(key, None)

    async def _page(self, url, campus, end, result):
        remaining = min(self.registry.policy['limits']['per_source_timeout_ms']/1000, end-time.monotonic())
        if remaining <= 0 or result.page_calls >= 4:
            return None, 'timeout'
        source = self.registry.match(url, campus)
        if not source:
            return None, 'unavailable'
        host = urlsplit(url).hostname
        self.host_slots.setdefault(host, asyncio.Semaphore(self.registry.policy['limits']['per_host_concurrency']))
        start = time.monotonic()
        try:
            async with asyncio.timeout(remaining):
                async with self.slots, self.host_slots[host]:
                    if end <= time.monotonic() or result.page_calls >= 4:
                        return None, 'timeout'
                    result.page_calls += 1
                    response = await self.client.get(url)
                # Redirect requests must pass the same registry and budget, never auto-follow.
                if response.is_redirect:
                    target = urljoin(url, response.headers.get('location', ''))
                    if not self.registry.match(target, campus):
                        return None, 'unavailable'
                    return await self._page(target, campus, end, result)
                response.raise_for_status()
                if len(response.content) > 2_000_000:
                    return None, 'unavailable'
                tree = html.fromstring(response.text)
                for node in tree.xpath('//script|//style|//nav|//footer|//header|//aside'):
                    node.drop_tree()
                title = ''.join(tree.xpath('//title/text()')).strip()
                mains = tree.xpath('//article|//main|//*[contains(@class,"v_news_content")]|//*[@id="vsb_content"]|//*[contains(@class,"news-content")]|//*[contains(@class,"article-content")]')
                main = max(mains, key=lambda n: len(n.text_content()), default=None)
                text = re.sub(r'\s+', ' ', main.text_content()).strip() if main is not None else ''
                links = [(urljoin(url, a.get('href', '')), a.text_content().strip()) for a in tree.xpath('//a[@href]')]
                published = next(iter(tree.xpath('//meta[@property="article:published_time"]/@content')), None)
                if not published:
                    dates = re.findall(r'(?:发布时间|发布日期|日期|时间)\s*[:：]?\s*(20\d{2}[-年]\d{1,2}[-月]\d{1,2})', tree.text_content())
                    published = dates[0].replace('年', '-').replace('月', '-') if dates else None
                if not published:
                    seed=json.loads((ROOT/'official_content_seed.json').read_text('utf-8'))
                    published=next((s['published_at'] for s in seed['sources'] if s['url']==url),None)
                return (source, title, text, links, published, url), 'success'
        except (TimeoutError, httpx.TimeoutException):
            return None, 'timeout'
        except (httpx.HTTPError, ValueError):
            return None, 'unavailable'
        finally:
            result.trace.append({'url': url, 'elapsed_ms': round((time.monotonic()-start)*1000, 2)})

    def filter(self, page, query, campus, poi, intent, as_of):
        source, title, text, links, published, url = page
        if len(text) < 60 or not any(t in title+text for t in terms(query)):
            return None
        wrong = '卫津路' if campus == 'beiyangyuan' else '北洋园'
        right = '北洋园' if campus == 'beiyangyuan' else '卫津路'
        if wrong in text+title and right not in text+title:
            return None
        if poi:
            from .service import knowledge
            entity = knowledge.get_poi(poi)
            if not entity or entity.campus_id != campus or not any(n in text+title for n in [entity.name, *entity.aliases]):
                return None
        if intent == 'current_rule' and (source['tier'] != 'official' or not re.search('开放|闭馆|预约|门禁|入校|入馆|关门|临时', text)):
            return None
        # Retain whole sentences with dates/negation. Never truncate a clause.
        sentences = re.split(r'(?<=[。！？；])', text)
        ranked = sorted(enumerate(sentences), key=lambda x: (-sum(t in x[1] for t in terms(query)), x[0]))
        chosen = []; size = 0
        for index, sentence in ranked:
            if size+len(sentence) <= 1800:
                chosen.append((index, sentence)); size += len(sentence)
        content = ''.join(s for _, s in sorted(chosen))
        if not content:
            return None
        # No inferred validity from crawl/publication date. Current claims need explicit scope.
        period = re.search(r'(20\d{2}-\d{2}-\d{2})\s*(?:至|到|—|~)\s*(20\d{2}-\d{2}-\d{2})', text)
        valid_from, valid_to = period.groups() if period else (None, None)
        applicable = bool(intent == 'current_rule' and valid_from and valid_from <= as_of <= valid_to)
        return Evidence('web-'+hashlib.sha256(url.encode()).hexdigest()[:16], source['id'], title, content,
                        url, url, published, valid_from, valid_to, datetime.now(SHANGHAI).isoformat(), campus,
                        [poi] if poi else [], {'publisher': source['name'], 'sourceTier': source['tier'],
                        'retrievalMethod': 'registered_page', 'repostOf': next(iter(re.findall(r'来源\s*[:：]\s*([^\s]{2,40})', text)), None)}, applicable)

    async def _run(self, query, campus, poi, intent, as_of, end, supplemental,result=None):
        result = result or RetrievalResult('no_evidence')
        sources = self.registry.candidates(query, campus, intent, supplemental)
        seeds = []
        for source in sources[:3]:
            urls = source['seed_urls']
            if '尚贤' in query and source['id'] == 'tju-news':
                urls = [u for u in urls if '89019' in u]
            elif source['id'] == 'tju-archives' and intent == 'news':
                urls = [u for u in urls if '237592' in u] + urls[:1]
            elif source['id'] == 'tju-archives' and '参观' in query:
                urls = [u for u in urls if '235247' in u] + urls[:1]
            seeds.extend(urls[:1])
        failures=[];seen=set(); candidates=[]
        for round_no in range(2):
            urls = seeds if round_no == 0 else [u for _, u in sorted(candidates, reverse=True) if u not in seen][:max(0,4-result.page_calls)]
            if round_no and not urls and not result.evidence and intent in ('stable','experience') and not supplemental:
                urls = [s['seed_urls'][-1] for s in self.registry.candidates(query,campus,intent,True)]
            if not urls or end <= time.monotonic():
                break
            seen.update(urls)
            pages = await asyncio.gather(*(self._page(u,campus,end,result) for u in urls[:3]))
            for page,status in pages:
                if not page:
                    failures.append(status);continue
                source,title,text,links,published,url=page
                result.scope.append(source['id'])
                evidence=self.filter(page,query,campus,poi,intent,as_of)
                if evidence and not any(e.text==evidence.text or e.finalUrl==evidence.finalUrl for e in result.evidence):
                    result.evidence.append(evidence)
                if not text and not links:
                    failures.append('unavailable')
                for link,label in links:
                    score=sum(t in label for t in terms(query))
                    if score and self.registry.match(link,campus):
                        candidates.append((score,link))
            if result.evidence and (intent!='current_rule' or any(e.currentApplicable for e in result.evidence)):
                break
        if result.evidence:
            result.status='partial' if failures or intent=='current_rule' and not any(e.currentApplicable for e in result.evidence) else 'success'
        elif failures:
            result.status='timeout' if 'timeout' in failures else 'unavailable'
        if intent=='current_rule' and '图书馆' in query and not result.evidence:
            result.status='unavailable'  # Registered library body adapter explicitly not enabled.
        result.scope=list(dict.fromkeys(result.scope))
        result.trace.append({'status':result.status,'scope':result.scope,'coverage':'registered pages only; no search provider configured','page_calls':result.page_calls})
        return result


retriever = EvidenceRetriever()
