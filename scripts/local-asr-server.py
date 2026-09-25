#!/usr/bin/env python
"""Local OpenAI-compatible ASR endpoint (faster-whisper) for the campus guide.

Start (dedicated venv, see docs/USER_GUIDE.md):
  /home/jy/.local/share/tju-asr/venv/bin/python scripts/local-asr-server.py --port 8010
Wire into .env (all three are required by the backend):
  CAMPUS_ASR_URL=http://127.0.0.1:8010/v1
  CAMPUS_ASR_MODEL=whisper-turbo
  CAMPUS_ASR_API_KEY=local-asr

The service is independent from the chat gateway: it exposes
POST /v1/audio/transcriptions (multipart `file`, optional `model`/`language`)
and returns {"text": ...}. Any non-empty token is accepted unless --token is set.
"""
from __future__ import annotations

import argparse
import io
import os
import threading
import time
from pathlib import Path

from fastapi import FastAPI, File, Form, Header, HTTPException, UploadFile
from starlette.concurrency import run_in_threadpool


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--host', default='127.0.0.1')
    parser.add_argument('--port', type=int, default=8010)
    parser.add_argument('--model', default='turbo')
    parser.add_argument('--device', default='cpu')
    parser.add_argument('--compute-type', default='int8')
    parser.add_argument('--download-root', default=str(Path(__file__).resolve().parents[1] / '.runtime' / 'asr-models'))
    parser.add_argument('--token', default=os.environ.get('LOCAL_ASR_TOKEN', ''))
    args = parser.parse_args()

    app = FastAPI(title='local-asr')
    state: dict = {'model': None, 'error': None, 'loading': True}

    def load() -> None:
        try:
            from faster_whisper import WhisperModel
            state['model'] = WhisperModel(args.model, device=args.device, compute_type=args.compute_type,
                                          download_root=args.download_root)
        except Exception as error:  # pragma: no cover - startup diagnostics
            state['error'] = f'{type(error).__name__}: {error}'
        finally:
            state['loading'] = False

    threading.Thread(target=load, daemon=True).start()
    inference_lock = threading.Lock()

    def recognize(data: bytes, language: str) -> dict:
        from faster_whisper import decode_audio
        audio = decode_audio(io.BytesIO(data), sampling_rate=16000)
        if not 0 < len(audio) <= 30 * 16000:
            raise HTTPException(status_code=422, detail='audio must be 0-30 seconds')
        started = time.monotonic()
        # Keep inference off the event loop, so health and cancellation remain responsive.
        with inference_lock:
            segments, info = state['model'].transcribe(
                audio, language=language or 'zh', task='transcribe', beam_size=5,
                temperature=0, condition_on_previous_text=False,
                vad_filter=True, vad_parameters={'min_silence_duration_ms': 700, 'speech_pad_ms': 400},
                initial_prompt='以下是普通话简体中文。天津大学，卫津路校区，北洋园校区，郑东图书馆，第九教学楼，校友之家。',
            )
            text = ''.join(segment.text for segment in segments).strip()
        return {'text': text, 'language': info.language, 'duration': info.duration,
                'elapsed_s': round(time.monotonic() - started, 2)}

    def authorize(authorization: str | None) -> None:
        if args.token and authorization != f'Bearer {args.token}':
            raise HTTPException(status_code=401, detail='invalid api key')

    @app.get('/health')
    def health() -> dict:
        return {
            'status': 'ok' if state['model'] else ('loading' if state['loading'] else 'failed'),
            'model': args.model,
            'error': state['error'],
        }

    @app.post('/v1/audio/transcriptions')
    async def transcriptions(
        file: UploadFile = File(...),
        model: str = Form(''),
        language: str = Form('zh'),
        authorization: str | None = Header(default=None),
    ) -> dict:
        del model  # accepted for OpenAI compatibility; the loaded model is fixed
        authorize(authorization)
        if state['model'] is None:
            detail = 'model loading' if state['loading'] else f"model unavailable: {state['error']}"
            raise HTTPException(status_code=503, detail=detail)
        data = await file.read(2 * 1024 * 1024 + 1)
        if len(data) > 2 * 1024 * 1024:
            raise HTTPException(status_code=413, detail='audio too large')
        try:
            return await run_in_threadpool(recognize, data, language)
        except HTTPException:
            raise
        except Exception:
            raise HTTPException(status_code=422, detail='invalid audio or transcription failed') from None

    import uvicorn
    uvicorn.run(app, host=args.host, port=args.port, log_level='warning')


if __name__ == '__main__':
    main()
