"""Start the packaged app with its project root on the import path."""
from __future__ import annotations

import argparse
from pathlib import Path
import sys


PROJECT_ROOT = Path(__file__).resolve().parents[1]
BACKEND_APP = PROJECT_ROOT / "backend" / "app.py"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, required=True)
    args = parser.parse_args()

    if not BACKEND_APP.is_file():
        raise RuntimeError(f"Packaged backend is missing: {BACKEND_APP}")

    # python311._pth isolates the embeddable runtime. Insert the resolved
    # package root explicitly before uvicorn resolves ``backend.app:app``.
    sys.path.insert(0, str(PROJECT_ROOT))

    import uvicorn

    uvicorn.run(
        "backend.app:app",
        host=args.host,
        port=args.port,
        access_log=False,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
