"""Speech providers, validation, cancellation, and bounded local audio storage."""

from __future__ import annotations

import asyncio
import base64
import binascii
from collections import OrderedDict
from dataclasses import dataclass
from io import BytesIO
import logging
from pathlib import Path
import time
from typing import Protocol
from uuid import UUID, uuid4
import wave

import edge_tts
from openai import AsyncOpenAI, APITimeoutError

from backend.common.config import Settings, get_settings
from backend.common.errors import DomainError
from backend.contracts import AsrRequest, AsrResponse, SpeechContext, TtsRequest, TtsResponse, Voice

MAX_RUNNING_OPERATIONS = 64
MAX_AUDIO_FILES = 128
MAX_AUDIO_BYTES = 100 * 1024 * 1024
AUDIO_TTL_SECONDS = 10 * 60
MAX_WAV_FRAMES = 30 * 16000
VOICE_CHOICES = {
    "zh-CN-XiaoxiaoNeural": ("原版女声 · 普通话", "zh-CN"),
    "zh-CN-YunxiNeural": ("男声 · 普通话", "zh-CN"),
    "zh-HK-HiuGaaiNeural": ("粤语", "zh-HK"),
    "en-US-JennyNeural": ("English", "en-US"),
}
logger = logging.getLogger(__name__)


@dataclass
class Operation:
    session_id: UUID
    task: asyncio.Task
    upstream_started: bool = False
    cancelled: bool = False


@dataclass
class AudioFile:
    path: Path
    mime_type: str
    created_at: float
    size: int


class SpeechProvider(Protocol):
    async def transcribe(self, request: AsrRequest) -> AsrResponse: ...
    async def synthesize(self, request: TtsRequest) -> TtsResponse: ...
    async def list_voices(self) -> list[Voice]: ...
    async def stop(self, request: SpeechContext): ...
    def take_audio(self, token: str) -> tuple[bytes, str]: ...


def prepare_edge_tts(text: str, voice: str) -> edge_tts.Communicate:
    return edge_tts.Communicate(text, voice)


def prepare_asr_client(url: str, key: str) -> AsyncOpenAI:
    return AsyncOpenAI(base_url=url.rstrip("/"), api_key=key, timeout=30, max_retries=0)


def decode_pcm16_wav(request: AsrRequest) -> bytes:
    try:
        data = base64.b64decode(request.audio.audio_base64, validate=True)
    except (binascii.Error, ValueError):
        raise DomainError("invalid_audio", "音频不是有效的 base64 PCM16 WAV", 422, request.request_id) from None
    try:
        with wave.open(BytesIO(data), "rb") as wav:
            if (
                wav.getcomptype() != "NONE"
                or wav.getsampwidth() != 2
                or wav.getframerate() != 16000
                or wav.getnchannels() != 1
            ):
                raise DomainError("invalid_audio", "音频必须是 16kHz 单声道 PCM16 WAV", 422, request.request_id)
            frames = wav.getnframes()
            if frames <= 0 or frames > MAX_WAV_FRAMES:
                raise DomainError("invalid_audio_duration", "音频时长必须大于 0 且不超过 30 秒", 422, request.request_id)
            payload = wav.readframes(frames)
            if len(payload) != frames * wav.getnchannels() * wav.getsampwidth():
                raise DomainError("invalid_audio", "音频 WAV 数据不完整", 422, request.request_id)
    except DomainError:
        raise
    except (EOFError, wave.Error):
        raise DomainError("invalid_audio", "音频 WAV 头损坏或不完整", 422, request.request_id) from None
    return data


class CampusSpeechService:
    def __init__(self, settings: Settings | None = None, audio_root: Path | None = None):
        self.settings = settings or get_settings()
        self.tts_verified = False
        project_root = Path(__file__).resolve().parents[2]
        self.audio_root = audio_root or project_root / ".runtime" / "speech-audio"
        self._operations: dict[UUID, Operation] = {}
        self._sessions: OrderedDict[UUID, UUID] = OrderedDict()
        self._audio: OrderedDict[str, AudioFile] = OrderedDict()
        self._voice_cache: tuple[float, list[Voice]] | None = None
        self._recover_audio_files()

    async def list_voices(self) -> list[Voice]:
        if self.settings.tts_provider != "edge":
            return []
        if self._voice_cache and time.monotonic() - self._voice_cache[0] < 3600:
            return list(self._voice_cache[1])
        try:
            raw_voices = await asyncio.wait_for(edge_tts.list_voices(), timeout=10)
            voices = sorted(
                (
                    Voice(
                        id=f"edge:{item['ShortName']}",
                        name=VOICE_CHOICES[item["ShortName"]][0],
                        locale=item["Locale"],
                        provider="edge",
                    )
                    for item in raw_voices
                    if item.get("ShortName") in VOICE_CHOICES
                ),
                key=lambda item: list(VOICE_CHOICES).index(item.id.removeprefix("edge:")),
            )
        except Exception:
            return []
        self._voice_cache = (time.monotonic(), voices)
        return list(voices)

    async def transcribe(self, request: AsrRequest) -> AsrResponse:
        audio = decode_pcm16_wav(request)
        key = self.settings.asr_api_key.get_secret_value()
        asr_url = self.settings.asr_url.rstrip("/")
        if (
            not asr_url
            or not self.settings.asr_model
            or not key
            or asr_url in (self.settings.llm_url.rstrip("/"), self.settings.llm_url.removesuffix("/chat/completions").rstrip("/"))
        ):
            raise DomainError(
                "asr_not_configured",
                "ASR 服务未配置；可显式改用浏览器中文识别降级",
                503,
                request.request_id,
            )
        operation = self._begin(request.request_id, request.session_id)
        operation.upstream_started = True
        client = None
        try:
            client = prepare_asr_client(asr_url, key)
            result = await client.audio.transcriptions.create(
                model=self.settings.asr_model,
                file=("speech.wav", audio, "audio/wav"),
            )
            if self._operations.get(request.request_id) is not operation or operation.cancelled or operation.task.cancelling():
                raise DomainError("stopped", "语音识别已取消", 499, request.request_id)
            text = result.text.strip()
            if not text:
                raise DomainError("asr_empty", "语音服务未识别到文字", 503, request.request_id, True)
            return AsrResponse(request_id=request.request_id, text=text, is_final=True)
        except asyncio.CancelledError:
            raise DomainError("stopped", "语音识别已取消", 499, request.request_id) from None
        except DomainError:
            raise
        except (APITimeoutError, asyncio.TimeoutError):
            raise DomainError("asr_timeout", "语音识别超时，请重试", 503, request.request_id, True) from None
        except Exception as error:
            logger.warning("ASR provider failed (%s)", type(error).__name__)
            raise DomainError("asr_unavailable", "语音识别服务暂时不可用", 503, request.request_id, True) from None
        finally:
            self._finish(request.request_id, operation)
            if client is not None:
                try:
                    await client.close()
                except Exception:
                    pass

    async def synthesize(self, request: TtsRequest) -> TtsResponse:
        if self.settings.tts_provider != "edge":
            raise DomainError("tts_not_configured", "TTS provider 未配置为 edge", 503, request.request_id)
        voice = request.voice_id.removeprefix("edge:")
        if voice not in VOICE_CHOICES:
            raise DomainError("voice_unavailable", "请选择原版女声、普通话男声、粤语或英语", 422, request.request_id)
        operation = self._begin(request.request_id, request.session_id)
        self._cleanup_audio()
        self.audio_root.mkdir(parents=True, exist_ok=True)
        token = uuid4().hex
        temporary = self.audio_root / f".{token}.part"
        destination = self.audio_root / f"{token}.mp3"
        operation.upstream_started = True
        try:
            await asyncio.wait_for(prepare_edge_tts(request.text, voice).save(str(temporary)), timeout=30)
            if operation.cancelled:
                raise asyncio.CancelledError()
            temporary.replace(destination)
            size = destination.stat().st_size
            if size <= 0 or size > MAX_AUDIO_BYTES:
                destination.unlink(missing_ok=True)
                raise DomainError("tts_invalid_audio", "语音服务返回了无效音频", 503, request.request_id, True)
            self.tts_verified = True
            self._audio[token] = AudioFile(destination, "audio/mpeg", time.monotonic(), size)
            self._cleanup_audio()
            return TtsResponse(
                request_id=request.request_id,
                utterance_id=request.utterance_id,
                audio_url=f"/api/speech/audio/{token}",
                mime_type="audio/mpeg",
                timestamps="none",
            )
        except asyncio.CancelledError:
            temporary.unlink(missing_ok=True)
            destination.unlink(missing_ok=True)
            raise DomainError("stopped", "语音合成已取消", 499, request.request_id) from None
        except DomainError:
            raise
        except Exception as error:
            temporary.unlink(missing_ok=True)
            destination.unlink(missing_ok=True)
            logger.warning("TTS provider failed (%s)", type(error).__name__)
            raise DomainError("tts_unavailable", "语音合成服务暂时不可用", 503, request.request_id, True) from None
        finally:
            self._finish(request.request_id, operation)

    async def stop(self, request: SpeechContext):
        from backend.contracts import SpeechStopResponse

        known_session = self._sessions.get(request.request_id)
        if known_session is not None and known_session != request.session_id:
            raise DomainError("session_conflict", "语音操作不属于该会话", 409, request.request_id)
        operation = self._operations.get(request.request_id)
        if operation is None:
            return SpeechStopResponse(
                request_id=request.request_id,
                local_stopped=True,
                upstream_stop="not_started",
            )
        if operation.session_id != request.session_id:
            raise DomainError("session_conflict", "语音操作不属于该会话", 409, request.request_id)
        upstream = "unconfirmed" if operation.upstream_started else "not_started"
        operation.cancelled = True
        if not operation.task.done():
            operation.task.cancel()
            await asyncio.sleep(0)
        return SpeechStopResponse(
            request_id=request.request_id,
            local_stopped=True,
            upstream_stop=upstream,
        )

    def take_audio(self, token: str) -> tuple[bytes, str]:
        if len(token) != 32 or any(char not in "0123456789abcdef" for char in token):
            raise DomainError("audio_not_found", "音频不存在或已过期", 404)
        self._cleanup_audio()
        item = self._audio.pop(token, None)
        if item is None or not item.path.is_file():
            raise DomainError("audio_not_found", "音频不存在或已过期", 404)
        try:
            return item.path.read_bytes(), item.mime_type
        finally:
            item.path.unlink(missing_ok=True)

    def _begin(self, request_id: UUID, session_id: UUID) -> Operation:
        known_session = self._sessions.get(request_id)
        if known_session is not None and known_session != session_id:
            raise DomainError("session_conflict", "语音操作不属于该会话", 409, request_id)
        if request_id in self._operations:
            raise DomainError("speech_conflict", "同一请求已有语音操作在运行", 409, request_id)
        if len(self._operations) >= MAX_RUNNING_OPERATIONS:
            raise DomainError("speech_capacity", "语音服务当前繁忙", 429, request_id, True)
        task = asyncio.current_task()
        if task is None:
            raise DomainError("internal_error", "语音任务上下文不可用", 500, request_id)
        operation = Operation(session_id, task)
        self._operations[request_id] = operation
        self._sessions[request_id] = session_id
        self._sessions.move_to_end(request_id)
        while len(self._sessions) > 1024:
            oldest, _ = self._sessions.popitem(last=False)
            if oldest in self._operations:
                self._sessions[oldest] = self._operations[oldest].session_id
                break
        return operation

    def _finish(self, request_id: UUID, operation: Operation) -> None:
        if self._operations.get(request_id) is operation:
            self._operations.pop(request_id, None)

    def _cleanup_audio(self) -> None:
        now = time.monotonic()
        for token, item in list(self._audio.items()):
            if now - item.created_at > AUDIO_TTL_SECONDS or not item.path.is_file():
                item.path.unlink(missing_ok=True)
                self._audio.pop(token, None)
        total = sum(item.size for item in self._audio.values())
        while self._audio and (len(self._audio) > MAX_AUDIO_FILES or total > MAX_AUDIO_BYTES):
            _, item = self._audio.popitem(last=False)
            total -= item.size
            item.path.unlink(missing_ok=True)

    def _recover_audio_files(self) -> None:
        if not self.audio_root.is_dir():
            return
        for partial in self.audio_root.glob(".*.part"):
            partial.unlink(missing_ok=True)
        wall_now = time.time()
        monotonic_now = time.monotonic()
        for path in self.audio_root.glob("*.mp3"):
            token = path.stem
            if len(token) != 32 or any(char not in "0123456789abcdef" for char in token):
                continue
            stat = path.stat()
            age = max(0.0, wall_now - stat.st_mtime)
            self._audio[token] = AudioFile(path, "audio/mpeg", monotonic_now - age, stat.st_size)
        self._cleanup_audio()


speech: SpeechProvider = CampusSpeechService()
