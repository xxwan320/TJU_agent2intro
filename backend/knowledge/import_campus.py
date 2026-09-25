"""Maintainer-only local import: python -m backend.knowledge.import_campus."""
from __future__ import annotations

import argparse
import json
from pathlib import Path

from .user_library import MAX_FILE_BYTES, extract_text, user_library


def main(argv=None):
    parser = argparse.ArgumentParser(description="导入校园介绍、校史或办事指南，供校园数字人检索")
    parser.add_argument("--campus", required=True, choices=("weijinlu", "beiyangyuan"))
    parser.add_argument("files", nargs="+", type=Path)
    args = parser.parse_args(argv)
    # Validate the whole input batch before publishing any record.
    extracted = []
    for path in args.files:
        if not path.is_file():
            parser.error(f"文件不存在：{path}")
        if path.stat().st_size > MAX_FILE_BYTES:
            parser.error(f"文件超过 12 MB：{path.name}")
        try:
            extracted.append((path.name, extract_text(path.name, path.read_bytes())))
        except ValueError as exc:
            parser.error(f"{path.name}：{exc}")
    for filename, text in extracted:
        record = user_library.add_campus_text(args.campus, filename, text)
        print(json.dumps({"filename": record.filename, "campus_id": record.campus_id,
                          "id": record.id, "chunks": len(record.chunks)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
