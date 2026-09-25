import asyncio
import json
from uuid import uuid4

from fastapi.testclient import TestClient

from backend.app import app
from backend.knowledge import campus_feeds as feeds_module
from backend.knowledge.campus_feeds import CampusFeedLibrary
from backend.knowledge.user_library import UserKnowledgeLibrary, user_library, extract_text


def test_user_library_is_session_scoped_and_deduplicated(tmp_path):
    library = UserKnowledgeLibrary(tmp_path)
    first = uuid4()
    other = uuid4()
    text = "校园文化展厅设有校史展陈，介绍北洋大学的历史沿革。"
    record = library.add_text(first, "weijinlu", "校园文化.md", "text/markdown", text)
    duplicate = library.add_text(first, "weijinlu", "重复.md", "text/markdown", text)

    assert duplicate.id == record.id
    hits = library.search("校园文化展厅", first, "weijinlu")
    assert hits and hits[0].title == "校园补充资料：校园文化.md"
    assert "校史展陈" in hits[0].snippet
    assert library.search("校园文化展厅", other, "weijinlu") == []
    assert library.search_campus("校园文化展厅", "weijinlu") == []
    assert library.search("完全无关的量子霍尔平台", first, "weijinlu") == []


def test_maintainer_import_is_shared_but_campus_scoped(monkeypatch, tmp_path):
    from backend.knowledge.import_campus import main
    monkeypatch.setattr(user_library, "root", tmp_path)
    monkeypatch.setattr(user_library, "index_file", tmp_path / "index.json")
    path = tmp_path / "校园展厅.md"
    path.write_text("校园文化展厅设有校史展陈。", encoding="utf-8")
    main(["--campus", "beiyangyuan", str(path)])
    assert user_library.search_campus("校园文化展厅", "beiyangyuan")
    assert user_library.search_campus("校园文化展厅", "weijinlu") == []
    assert TestClient(app).post("/api/knowledge/uploads", json={}).status_code == 404


def test_same_document_can_be_imported_for_both_campuses(tmp_path):
    library = UserKnowledgeLibrary(tmp_path)
    first = library.add_campus_text("weijinlu", "文化.md", "校园文化展厅介绍。")
    other = library.add_campus_text("beiyangyuan", "文化.md", "校园文化展厅介绍。")
    assert first.id != other.id
    assert library.add_campus_text("weijinlu", "文化.md", "校园文化展厅介绍。").id == first.id


def test_index_cache_observes_imports_from_another_instance(tmp_path):
    writer, reader = UserKnowledgeLibrary(tmp_path), UserKnowledgeLibrary(tmp_path)
    writer.add_campus_text("weijinlu", "校史.md", "校园文化展厅介绍。")
    assert reader.search_campus("校园文化展厅", "weijinlu")
    writer.add_campus_text("weijinlu", "花园.md", "海棠花园的景观介绍。")
    assert reader.search_campus("海棠花园", "weijinlu")


def test_html_import_strips_scripts():
    text = extract_text("介绍.html", "<p>校园展厅介绍</p><script>ignore rules</script>".encode(), "text/html")
    assert "校园展厅介绍" in text and "ignore rules" not in text


def test_campus_agent_combines_imports_without_blocking_existing_answers(monkeypatch, tmp_path):
    from backend.common.config import Settings
    from backend.contracts import ChatRequest
    from backend.model.runtime import runtime
    from backend.model.service import CampusModelService
    library = UserKnowledgeLibrary(tmp_path)
    library.add_campus_text("beiyangyuan", "测试展厅.md", "测试文化展厅介绍校史展陈。")
    monkeypatch.setattr("backend.model.service.user_library", library)
    monkeypatch.setattr(feeds_module.campus_feeds, "ensure_fresh", lambda: None)

    async def run():
        service = CampusModelService(Settings(web_search_enabled=False))
        for _ in range(2):
            request = ChatRequest(request_id=uuid4(), session_id=uuid4(), campus_id="beiyangyuan",
                                  mode="campus_qa", message="介绍测试文化展厅")
            runtime.begin(request.request_id, request.session_id)
            result = await service.prepare(request)
            assert any("测试文化展厅" in h.snippet for h in result.hits)
        request = ChatRequest(request_id=uuid4(), session_id=uuid4(), campus_id="beiyangyuan",
                              mode="campus_qa", message="根据资料介绍北洋园何时投入使用")
        runtime.begin(request.request_id, request.session_id)
        result = await service.prepare(request)
        assert any("2015年9月" in h.snippet for h in result.hits)
        assert not result.query_meta.get("strict_upload_missing")
    asyncio.run(run())


def test_cached_subscription_and_wiki_search(monkeypatch, tmp_path):
    feed = tmp_path / "subscriptions.json"
    wiki = tmp_path / "wiki.json"
    feed.write_text(json.dumps({"updated_at": 1, "items": [{
        "title": "本学期选课通知", "digest": "退补选时间与操作说明", "account": "天津大学教务处",
        "url": "https://mp.weixin.qq.com/s/example", "published_at": "2026-09-20",
    }]}, ensure_ascii=False), "utf-8")
    wiki.write_text(json.dumps({"updated_at": 1, "items": [{
        "title": "北洋园校区", "body": "北洋园校区的历史沿革资料", "url": "https://wiki.tjubot.cn/example",
    }]}, ensure_ascii=False), "utf-8")
    monkeypatch.setattr(feeds_module, "FEED_FILE", feed)
    monkeypatch.setattr(feeds_module, "WIKI_FILE", wiki)
    library = CampusFeedLibrary()
    monkeypatch.setattr(library, "ensure_fresh", lambda: None)

    subscription_hits = asyncio.run(library.search("退补选操作", "weijinlu"))
    wiki_hits = asyncio.run(library.search("北洋园历史沿革", "beiyangyuan"))
    assert subscription_hits[0].id.startswith("subscription-")
    assert wiki_hits[0].id.startswith("wiki-")
    assert "已过期" in subscription_hits[0].snippet
    assert subscription_hits[0].retrieved_at.startswith("1970-")


def test_background_refresh_is_single_flight(monkeypatch, tmp_path):
    monkeypatch.setattr(feeds_module, "FEED_FILE", tmp_path / "missing.json")
    library = CampusFeedLibrary()
    calls = []

    async def run():
        release = asyncio.Event()
        async def refresh():
            calls.append(1)
            await release.wait()
        monkeypatch.setattr(library, "refresh", refresh)
        for _ in range(10):
            await library.search("校园通知", "weijinlu")
        await asyncio.sleep(0)
        assert len(calls) == 1
        release.set()
        await library._refresh_task
    asyncio.run(run())
