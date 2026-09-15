import asyncio
import base64
from io import BytesIO
from pathlib import Path
from uuid import uuid4
import wave

import pytest

from backend.common.config import Settings
from backend.common.errors import DomainError
from backend.contracts import AsrRequest, SpeechContext, TtsRequest
from backend.speech.service import CampusSpeechService, decode_pcm16_wav
from backend.speech.service import VOICE_CHOICES


def test_only_four_voices_are_listed_and_english_can_synthesize(monkeypatch, tmp_path):
    async def inventory():
        return [{"ShortName":name,"Locale":value[1]} for name,value in VOICE_CHOICES.items()]+[{"ShortName":"zh-CN-unwanted","Locale":"zh-CN"}]
    monkeypatch.setattr("backend.speech.service.edge_tts.list_voices",inventory)
    class Audio:
        async def save(self, path): Path(path).write_bytes(b"ID3fixture")
    monkeypatch.setattr("backend.speech.service.prepare_edge_tts",lambda text,voice:Audio())
    async def run():
        service=CampusSpeechService(Settings(),tmp_path)
        voices=await service.list_voices()
        assert [v.id for v in voices]==['edge:'+v for v in VOICE_CHOICES]
        result=await service.synthesize(TtsRequest(request_id=uuid4(),session_id=uuid4(),utterance_id=uuid4(),text="Welcome",voice_id="edge:en-US-JennyNeural"))
        assert result.mime_type=="audio/mpeg"
    asyncio.run(run())


def pcm16_wav(seconds: float = 0.1, sample_rate: int = 16000, channels: int = 1) -> bytes:
    output = BytesIO()
    with wave.open(output, "wb") as wav:
        wav.setnchannels(channels)
        wav.setsampwidth(2)
        wav.setframerate(sample_rate)
        wav.writeframes(b"\0\0" * int(seconds * sample_rate) * channels)
    return output.getvalue()


def asr_request(data: bytes) -> AsrRequest:
    return AsrRequest(
        request_id=uuid4(),
        session_id=uuid4(),
        audio={
            "encoding": "base64",
            "mime_type": "audio/wav",
            "sample_rate_hz": 16000,
            "channels": 1,
            "audio_base64": base64.b64encode(data).decode("ascii"),
        },
    )


def settings(**updates) -> Settings:
    values = {
        "asr_url": "",
        "asr_model": "",
        "asr_api_key": "",
        "tts_provider": "edge",
        "tts_voice": "zh-CN-XiaoxiaoNeural",
    }
    values.update(updates)
    return Settings(**values)


def test_pcm16_wav_validation_rejects_wrong_rate_and_malformed_data():
    assert decode_pcm16_wav(asr_request(pcm16_wav())).startswith(b"RIFF")
    with pytest.raises(DomainError) as wrong_rate:
        decode_pcm16_wav(asr_request(pcm16_wav(sample_rate=8000)))
    assert wrong_rate.value.code == "invalid_audio"
    with pytest.raises(DomainError) as malformed:
        decode_pcm16_wav(asr_request(b"not-a-wave"))
    assert malformed.value.code == "invalid_audio"
    with pytest.raises(DomainError) as truncated:
        decode_pcm16_wav(asr_request(pcm16_wav()[:-8]))
    assert truncated.value.code == "invalid_audio"


def test_unconfigured_asr_has_explicit_error(tmp_path: Path):
    async def run():
        service = CampusSpeechService(settings(), tmp_path)
        request = asr_request(pcm16_wav())
        with pytest.raises(DomainError) as caught:
            await service.transcribe(request)
        assert caught.value.code == "asr_not_configured"
        assert caught.value.status == 503

    asyncio.run(run())


def test_tts_audio_is_bounded_to_local_one_shot_url(monkeypatch, tmp_path: Path):
    class FakeCommunicate:
        async def save(self, target: str):
            Path(target).write_bytes(b"ID3\x04\x00\x00test-audio")

    monkeypatch.setattr("backend.speech.service.prepare_edge_tts", lambda text, voice: FakeCommunicate())

    async def run():
        service = CampusSpeechService(settings(), tmp_path)
        request = TtsRequest(
            request_id=uuid4(),
            session_id=uuid4(),
            utterance_id=uuid4(),
            text="你好，欢迎来到天津大学。",
            voice_id="edge:zh-CN-XiaoxiaoNeural",
        )
        response = await service.synthesize(request)
        assert response.audio_url.startswith("/api/speech/audio/")
        assert response.mime_type == "audio/mpeg"
        assert response.timestamps == "none"
        token = response.audio_url.rsplit("/", 1)[-1]
        content, mime_type = service.take_audio(token)
        assert content.startswith(b"ID3") and mime_type == "audio/mpeg"
        with pytest.raises(DomainError) as expired:
            service.take_audio(token)
        assert expired.value.status == 404

    asyncio.run(run())


def test_audio_registry_recovers_completed_files_and_drops_partial_files(tmp_path: Path):
    token = "a" * 32
    completed = tmp_path / f"{token}.mp3"
    partial = tmp_path / ".orphan.part"
    completed.write_bytes(b"ID3recovered")
    partial.write_bytes(b"unfinished")
    service = CampusSpeechService(settings(), tmp_path)
    assert not partial.exists()
    assert service.take_audio(token) == (b"ID3recovered", "audio/mpeg")
    assert not completed.exists()


def test_stop_cancels_running_tts_and_preserves_session(monkeypatch, tmp_path: Path):
    started = asyncio.Event()

    class WaitingCommunicate:
        async def save(self, target: str):
            started.set()
            await asyncio.sleep(20)

    monkeypatch.setattr("backend.speech.service.prepare_edge_tts", lambda text, voice: WaitingCommunicate())

    async def run():
        service = CampusSpeechService(settings(), tmp_path)
        request = TtsRequest(
            request_id=uuid4(),
            session_id=uuid4(),
            utterance_id=uuid4(),
            text="这段语音会被打断。",
            voice_id="zh-CN-XiaoxiaoNeural",
        )
        task = asyncio.create_task(service.synthesize(request))
        await asyncio.wait_for(started.wait(), timeout=1)
        stopped = await service.stop(SpeechContext(request_id=request.request_id, session_id=request.session_id))
        assert stopped.local_stopped is True
        assert stopped.upstream_stop == "unconfirmed"
        with pytest.raises(DomainError) as cancelled:
            await task
        assert cancelled.value.code == "stopped"
        mismatch = SpeechContext(request_id=request.request_id, session_id=uuid4())
        with pytest.raises(DomainError) as conflict:
            await service.stop(mismatch)
        assert conflict.value.status == 409

    asyncio.run(run())


@pytest.mark.parametrize("failure", [None, "timeout", "unavailable", "empty"])
def test_asr_chinese_result_safe_errors_and_client_cleanup(monkeypatch, tmp_path, failure):
    from types import SimpleNamespace
    closed = []
    class Client:
        def __init__(self):
            self.audio = SimpleNamespace(transcriptions=self)
        async def create(self, **kwargs):
            assert kwargs["file"][0] == "speech.wav"
            assert kwargs["file"][1].startswith(b"RIFF")
            if failure == "timeout":
                raise asyncio.TimeoutError("private upstream details")
            if failure == "unavailable":
                raise RuntimeError("private upstream details")
            return SimpleNamespace(text="" if failure == "empty" else "请介绍天津大学")
        async def close(self):
            closed.append(True)
    monkeypatch.setattr("backend.speech.service.prepare_asr_client", lambda *args: Client())
    async def run():
        service = CampusSpeechService(settings(asr_url="https://asr.invalid/v1", asr_model="test-asr", asr_api_key="fixture-only"), tmp_path)
        request = asr_request(pcm16_wav())
        if failure:
            with pytest.raises(DomainError) as error:
                await service.transcribe(request)
            assert error.value.code == {"timeout":"asr_timeout", "unavailable":"asr_unavailable", "empty":"asr_empty"}[failure]
            assert "private" not in str(error.value)
        else:
            result = await service.transcribe(request)
            assert result.text == "请介绍天津大学" and result.is_final
        assert service._operations == {}
        assert closed == [True]
    asyncio.run(run())


def test_asr_cancel_rejects_provider_that_swallows_cancel_and_uncancels(monkeypatch, tmp_path):
    from types import SimpleNamespace
    started = asyncio.Event()
    closed = []
    class Client:
        def __init__(self):
            self.audio = SimpleNamespace(transcriptions=self)
        async def create(self, **kwargs):
            started.set()
            try:
                await asyncio.sleep(20)
            except asyncio.CancelledError:
                asyncio.current_task().uncancel()
            return SimpleNamespace(text="迟到文本必须丢弃")
        async def close(self):
            closed.append(True)
    monkeypatch.setattr("backend.speech.service.prepare_asr_client", lambda *args: Client())
    async def run():
        service = CampusSpeechService(settings(asr_url="https://asr.invalid/v1", asr_model="test-asr", asr_api_key="fixture-only"), tmp_path)
        request = asr_request(pcm16_wav())
        task = asyncio.create_task(service.transcribe(request))
        await started.wait()
        result = await service.stop(SpeechContext(request_id=request.request_id, session_id=request.session_id))
        assert result.upstream_stop == "unconfirmed"
        with pytest.raises(DomainError) as error:
            await task
        assert error.value.code == "stopped"
        assert service._operations == {} and closed == [True]
    asyncio.run(run())


def test_tts_cancel_rejects_provider_that_writes_late_audio(monkeypatch, tmp_path):
    started = asyncio.Event()
    class Provider:
        async def save(self, target):
            started.set()
            try:
                await asyncio.sleep(20)
            except asyncio.CancelledError:
                asyncio.current_task().uncancel()
            Path(target).write_bytes(b"ID3fixture")
    monkeypatch.setattr("backend.speech.service.prepare_edge_tts", lambda *args: Provider())
    async def run():
        service = CampusSpeechService(settings(), tmp_path)
        request = TtsRequest(request_id=uuid4(), session_id=uuid4(), utterance_id=uuid4(), text="取消测试", voice_id="zh-CN-XiaoxiaoNeural")
        task = asyncio.create_task(service.synthesize(request))
        await started.wait()
        await service.stop(SpeechContext(request_id=request.request_id, session_id=request.session_id))
        with pytest.raises(DomainError) as error:
            await task
        assert error.value.code == "stopped"
        assert service.tts_verified is False
        assert service._audio == {} and list(tmp_path.iterdir()) == []
    asyncio.run(run())
