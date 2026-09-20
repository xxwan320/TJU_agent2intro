"""Local supplemental campus documents, imported by the site maintainer.

Legacy private session records remain isolated and are never published implicitly.
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timezone
from hashlib import sha256
import io
import json
from pathlib import Path
import re
import threading
from typing import Iterable
from uuid import UUID, uuid4
from zipfile import BadZipFile, ZipFile

from lxml import etree, html

from backend.contracts import CampusId, Source


DATA_ROOT = Path(__file__).resolve().parents[2] / "data" / "user_knowledge"
INDEX_FILE = DATA_ROOT / "index.json"
MAX_FILE_BYTES = 12 * 1024 * 1024
MAX_TEXT_CHARS = 500_000
MAX_SESSION_DOCUMENTS = 80
CAMPUS_SCOPE = "campus-maintained"
_TOKEN = re.compile(r"[a-z0-9]+|[\u3400-\u9fff]+", re.IGNORECASE)
_lock = threading.RLock()


def _utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def _tokens(value: str) -> set[str]:
    out: set[str] = set()
    for part in _TOKEN.findall(value.casefold()):
        if part[0].isascii():
            out.add(part)
        elif len(part) == 1:
            out.add(part)
        else:
            out.update(part[index:index + 2] for index in range(len(part) - 1))
    return out


def _chunks(text: str, size: int = 1200, overlap: int = 180) -> list[str]:
    paragraphs = [re.sub(r"\s+", " ", p).strip() for p in re.split(r"\n\s*\n|(?<=[。！？])\s*", text)]
    paragraphs = [p for p in paragraphs if p]
    chunks: list[str] = []
    current = ""
    for paragraph in paragraphs:
        if len(current) + len(paragraph) + 1 <= size:
            current = (current + "\n" + paragraph).strip()
            continue
        if current:
            chunks.append(current)
        tail = current[-overlap:] if current else ""
        current = (tail + "\n" + paragraph).strip()
        while len(current) > size:
            chunks.append(current[:size])
            current = current[size - overlap:]
    if current:
        chunks.append(current)
    return chunks[:200]


def _plain_text(content: bytes) -> str:
    for encoding in ("utf-8-sig", "utf-16", "gb18030"):
        try:
            return content.decode(encoding)
        except UnicodeDecodeError:
            pass
    raise ValueError("文件文字编码无法识别")


def _html_text(content: bytes) -> str:
    tree = html.fromstring(_plain_text(content))
    for node in tree.xpath("//script|//style|//nav|//footer"):
        node.drop_tree()
    return tree.text_content()


def _docx_text(content: bytes) -> str:
    try:
        with ZipFile(io.BytesIO(content)) as archive:
            raw = archive.read("word/document.xml")
    except (BadZipFile, KeyError) as exc:
        raise ValueError("DOCX 文件损坏或格式不受支持") from exc
    root = etree.fromstring(raw)
    paragraphs = []
    ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
    for paragraph in root.xpath("//w:p", namespaces=ns):
        value = "".join(paragraph.xpath(".//w:t/text()", namespaces=ns)).strip()
        if value:
            paragraphs.append(value)
    return "\n\n".join(paragraphs)


def _pdf_text(content: bytes) -> str:
    try:
        from pypdf import PdfReader
    except ImportError as exc:
        raise ValueError("PDF 解析组件尚未安装") from exc
    try:
        reader = PdfReader(io.BytesIO(content))
        return "\n\n".join((page.extract_text() or "").strip() for page in reader.pages[:300])
    except Exception as exc:
        raise ValueError("PDF 无法解析；扫描版请先转换为可提取文字的文档") from exc


def extract_text(filename: str, content: bytes, media_type: str | None = None) -> str:
    """Extract text from bounded campus document types."""
    if not content:
        raise ValueError("文件为空")
    if len(content) > MAX_FILE_BYTES:
        raise ValueError("单个文件不能超过 12 MB")
    suffix = Path(filename).suffix.casefold()
    media_type = (media_type or "").split(";", 1)[0].casefold()
    if suffix in {".html", ".htm"} or media_type == "text/html":
        text = _html_text(content)
    elif suffix in {".txt", ".md", ".csv", ".tsv", ".json"}:
        text = _plain_text(content)
    elif suffix == ".docx" or media_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        text = _docx_text(content)
    elif suffix == ".pdf" or media_type == "application/pdf":
        text = _pdf_text(content)
    else:
        raise ValueError("支持 TXT、Markdown、CSV、JSON、HTML、DOCX 和文字版 PDF 校园资料")
    text = text.replace("\x00", "")[:MAX_TEXT_CHARS].strip()
    if len(text) < 2:
        raise ValueError("资料中未提取到可检索文字")
    return text


@dataclass(frozen=True)
class UploadRecord:
    id: str
    session_id: str
    campus_id: CampusId
    filename: str
    media_type: str
    created_at: str
    sha256: str
    chunks: list[str]


class UserKnowledgeLibrary:
    def __init__(self, root: Path = DATA_ROOT):
        self.root = root
        self.index_file = root / "index.json"
        self._signature = None
        self._rows = []

    def _read(self) -> list[dict]:
        try:
            stat = self.index_file.stat()
            signature = (str(self.index_file), stat.st_mtime_ns, stat.st_size)
            if signature == self._signature:
                return self._rows
            value = json.loads(self.index_file.read_text("utf-8"))
            rows = value.get("documents", []) if isinstance(value, dict) else []
            if not isinstance(rows, list):
                raise ValueError("校园补充资料索引格式无效")
            self._signature, self._rows = signature, rows
            return rows
        except FileNotFoundError:
            return []

    def _write(self, rows: Iterable[dict]) -> None:
        self.root.mkdir(parents=True, exist_ok=True)
        target = {"version": 1, "documents": list(rows), "updated_at": _utc_now()}
        temporary = self.index_file.with_suffix(".tmp")
        temporary.write_text(json.dumps(target, ensure_ascii=False), "utf-8")
        temporary.replace(self.index_file)
        self._signature = None

    def add_campus_text(self, campus_id: CampusId, filename: str, text: str) -> UploadRecord:
        return self.add_text(CAMPUS_SCOPE, campus_id, filename, "text/plain", text)

    def search_campus(self, query: str, campus_id: CampusId, limit: int = 6) -> list[Source]:
        return self.search(query, CAMPUS_SCOPE, campus_id, limit)

    def add_text(self, session_id: UUID | str, campus_id: CampusId, filename: str,
                 media_type: str, text: str, digest: str | None = None) -> UploadRecord:
        sid = str(session_id)
        clean = text.replace("\x00", "")[:MAX_TEXT_CHARS].strip()
        if len(clean) < 2:
            raise ValueError("资料中未提取到可检索文字")
        checksum = digest or sha256(clean.encode("utf-8")).hexdigest()
        with _lock:
            rows = self._read()
            duplicate = next((r for r in rows if r.get("session_id") == sid and r.get("campus_id") == campus_id and r.get("sha256") == checksum), None)
            if duplicate:
                return UploadRecord(**{key: duplicate[key] for key in UploadRecord.__annotations__})
            if sum(r.get("session_id") == sid and r.get("campus_id") == campus_id for r in rows) >= MAX_SESSION_DOCUMENTS:
                raise ValueError("当前资料库每校区最多保存 80 份资料")
            record = UploadRecord(
                id="upload-" + uuid4().hex[:16], session_id=sid, campus_id=campus_id,
                filename=Path(filename).name[:180] or "未命名资料", media_type=media_type[:120],
                created_at=_utc_now(), sha256=checksum, chunks=_chunks(clean),
            )
            rows.append(record.__dict__)
            self._write(rows)
            return record

    def has_documents(self, session_id: UUID | str) -> bool:
        sid = str(session_id)
        with _lock:
            return any(r.get("session_id") == sid for r in self._read())

    def list(self, session_id: UUID | str) -> list[dict]:
        sid = str(session_id)
        with _lock:
            return [{k: r.get(k) for k in ("id", "filename", "media_type", "created_at")}
                    for r in self._read() if r.get("session_id") == sid]

    def search(self, query: str, session_id: UUID | str, campus_id: CampusId, limit: int = 6) -> list[Source]:
        sid = str(session_id)
        q = re.sub(r"\s+", " ", query).strip().casefold()
        q_tokens = _tokens(q)
        if not q_tokens:
            return []
        ranked: list[tuple[float, int, dict, str]] = []
        with _lock:
            rows = [r for r in self._read() if r.get("session_id") == sid and r.get("campus_id") == campus_id]
        for doc_index, row in enumerate(rows):
            for chunk_index, chunk in enumerate(row.get("chunks") or []):
                blob = f"{row.get('filename', '')} {chunk}".casefold()
                overlap = q_tokens & _tokens(blob)
                coverage = len(overlap) / max(1, len(q_tokens))
                score = len(overlap) + coverage * 5
                if q in blob:
                    score += 10
                if any(token in str(row.get("filename", "")).casefold() for token in q_tokens):
                    score += 2
                # Require meaningful overlap so unrelated uploads do not become evidence.
                if score < 2.5 or (len(q_tokens) >= 4 and coverage < .18):
                    continue
                ranked.append((score, -(doc_index * 1000 + chunk_index), row, chunk))
        ranked.sort(key=lambda item: (-item[0], -item[1]))
        hits: list[Source] = []
        seen: set[tuple[str, str]] = set()
        for _, _, row, chunk in ranked:
            key = (row["id"], chunk[:80])
            if key in seen:
                continue
            seen.add(key)
            hits.append(Source(
                id=f"{row['id']}-{len(hits) + 1}", title=f"校园补充资料：{row['filename']}",
                snippet=chunk[:2000], url=f"urn:ai4tju:upload:{row['id']}", campus_id=campus_id,
                published_at=None, retrieved_at=row["created_at"],
            ))
            if len(hits) >= limit:
                break
        return hits


user_library = UserKnowledgeLibrary()
