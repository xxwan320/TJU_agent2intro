import asyncio
from uuid import uuid4

from backend.common.config import Settings
from backend.contracts import Source
from backend.knowledge.web_search import WebSearch, public_url, search_query
from backend.model.service import _citations


def source():
    return Source(id="one", title="Official", snippet="Example", url="https://www.tju.edu.cn/",
                  campus_id="weijinlu", published_at=None, retrieved_at="2026-09-14T00:00:00Z")


def test_citation_format_and_urls_do_not_discard_basic_answer():
    for text in ("Useful answer", "Answer [1]", "Answer https://www.tju.edu.cn/", "Answer [source:unknown]"):
        answer, refs = _citations(text, [source()], True, uuid4())
        assert answer.startswith(text.split(" [source:")[0])
        assert "source:unknown" not in answer
        assert [r.id for r in refs] == ["one"]
    answer, refs = _citations("Answer [source:one]", [source()], True, uuid4())
    assert answer == "Answer"
    assert "资料提示" not in answer
    assert refs[0].id == "one"


def test_step_citations_are_collected_once_at_end_not_in_body():
    answer, refs = _citations("第一步[source:one]。\n第二步[source:one]。\n[source:unknown]", [source()], True, uuid4())
    assert answer.startswith("第一步。\n第二步。")
    assert "[source:" not in answer
    assert "来源待核验" not in answer
    assert [r.id for r in refs] == ["one"]


def test_search_query_excludes_credentials_and_precise_coordinates():
    query = search_query("天津大学 api_key=secret-value 117.123456 39.123456 " + "a" * 32, None, "weijinlu")
    assert "secret-value" not in query and "117.123456" not in query and "a" * 32 not in query
    for url in ("http://localhost/x", "http://127.0.0.1/", "file:///secret", "https://user:pass@example.org/", "http://169.254.169.254/"):
        assert not public_url(url)


def test_search_sources_cache_and_failure_are_explicit(monkeypatch):
    calls = []
    class Engine:
        def __init__(self, **kwargs): pass
        def text(self, query, **kwargs):
            calls.append(query)
            return [{"title":"TJU", "href":"https://www.tju.edu.cn/", "body":"A public search excerpt"},
                    {"title":"Private", "href":"http://127.0.0.1/", "body":"Never fetch"}]
    monkeypatch.setattr("backend.knowledge.web_search.DDGS", Engine)
    async def page(*args): return "Read official page"
    monkeypatch.setattr(WebSearch, "_page", page)
    async def run():
        service = WebSearch()
        settings = Settings(web_search_enabled=True)
        hits, status = await service.search("TJU", "weijinlu", settings)
        assert status == "completed" and len(hits) == 1
        assert hits[0].id.startswith("web-") and "已读取网页" in hits[0].snippet
        _, status = await service.search("TJU", "weijinlu", settings)
        assert status == "cached" and len(calls) == 1
        def failed(*args, **kwargs): raise RuntimeError("no connection")
        monkeypatch.setattr(Engine, "text", failed)
        hits, status = await service.search("other", "weijinlu", settings)
        assert not hits and status == "unavailable"
    asyncio.run(run())


def test_empty_local_corpus_still_calls_model_and_stream_completes(monkeypatch):
    import json
    import httpx
    from fastapi.testclient import TestClient
    from openai import AsyncOpenAI
    from backend.app import app
    from backend.model.service import CampusModelService, OpenAICompatibleProvider
    import backend.model.service as service_module
    import backend.model.stream_routes as routes
    import backend.model.runtime as runtime_module
    from backend.contracts import KnowledgeStatus
    class Empty:
        def get_status(self):
            return KnowledgeStatus(status="unavailable",version=None,document_count=0,building_count=0,updated_at=None)
    class Stream(httpx.AsyncByteStream):
        async def __aiter__(self):
            payload={"id":"fixture","object":"chat.completion.chunk","created":1,"model":"glm-5.1","choices":[{"index":0,"delta":{"content":"这里先提供通用参观建议；具体藏品尚待核实。"},"finish_reason":"stop"}]}
            yield ("data: "+json.dumps(payload)+"\n\ndata: [DONE]\n\n").encode()
    http=httpx.AsyncClient(transport=httpx.MockTransport(lambda r:httpx.Response(200,headers={"content-type":"text/event-stream"},stream=Stream())))
    settings=Settings(llm_api_key="fixture",web_search_enabled=False)
    sdk=AsyncOpenAI(api_key="fixture",base_url="https://fixture.invalid/v1",http_client=http)
    service=CampusModelService(settings,OpenAICompatibleProvider(settings,sdk))
    store=runtime_module.RuntimeStore()
    monkeypatch.setattr(service_module,"knowledge",Empty())
    monkeypatch.setattr(routes,"model",service)
    monkeypatch.setattr(routes,"runtime",store)
    monkeypatch.setattr(runtime_module,"runtime",store)
    with TestClient(app) as client:
        body={"request_id":str(uuid4()),"session_id":str(uuid4()),"message_id":str(uuid4()),"campus_id":"weijinlu","mode":"campus_qa","message":"请介绍藏品"}
        response=client.post("/api/chat/stream",json=body)
    events=[json.loads(x[6:]) for x in response.text.splitlines() if x.startswith('data: ')]
    assert events[-1]["type"]=="completed" and "通用参观建议" in events[-1]["payload"]["response"]["answer"]
    assert events[-1]["payload"]["response"]["model"]=="glm-5.1"
    asyncio.run(http.aclose())

def test_padded_source_markers_link_existing_evidence_without_leaking_marker():
    answer, refs = _citations("规则已注明适用期。 [source: one ]", [source()], True, uuid4())
    assert answer == "规则已注明适用期。"
    assert [r.id for r in refs] == ["one"]

def test_grouped_source_ids_from_live_response_do_not_leak_into_text():
    answer, refs = _citations('当前地点介绍。\n[source: one, one, unknown]', [source()], True, uuid4())
    assert '[source:' not in answer
    assert answer.startswith('当前地点介绍。')
    assert [r.id for r in refs] == ['one']
