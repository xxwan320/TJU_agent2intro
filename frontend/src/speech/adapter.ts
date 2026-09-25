import type {
  AdapterResult,
  ApiError,
  SpeechAdapter,
  SpeechCallbacks,
  SpeechContext,
  Voice,
} from '../../../shared/contracts';

type AsrResponse = { request_id: string; text: string; is_final: boolean };
type TtsResponse = {
  request_id: string;
  utterance_id: string;
  audio_url: string;
  mime_type: string;
  timestamps: 'none' | 'word' | 'viseme';
};

type RecognitionMode = 'server' | 'browser';

export interface SpeechAdapterOptions {
  /** Server uses VAD + /api/speech/asr. Browser is an explicit online browser-service fallback. */
  recognitionMode?: RecognitionMode;
  /** Receives bounded metadata only. Text, audio bytes, URLs, and credentials are never included. */
  onTrace?: (event: SpeechPlaybackTrace) => void;
  volume?: number;
  muted?: boolean;
  /** Injectable only for isolated tests; production uses the pinned vad-web module. */
  loadVad?: typeof loadVadModule;
  asrTimeoutMs?: number;
  captureTimeoutMs?: number;
}

export type SpeechPlaybackTraceStage =
  | 'activation'
  | 'text_received'
  | 'tts_response'
  | 'audio_response'
  | 'decode'
  | 'play_request'
  | 'play_resolved'
  | 'playing'
  | 'paused'
  | 'ended'
  | 'error'
  | 'stopped';

export interface SpeechPlaybackTrace {
  stage: SpeechPlaybackTraceStage;
  request_id: string | null;
  utterance_id: string | null;
  elapsed_ms: number | null;
  status: number | null;
  content_type: string | null;
  bytes: number | null;
  chars: number | null;
  volume: number | null;
  muted: boolean | null;
  audio_context_state: AudioContextState | 'unavailable' | null;
  code: string | null;
}

export type PreparedSpeech = {
  readonly requestId: string;
  readonly utteranceId: string;
  readonly context: SpeechContext;
  readonly text: string;
  readonly voiceId: string;
  readonly kind: 'server' | 'browser';
  readonly objectUrl?: string;
  released: boolean;
};

export interface CaptureOptions {
  continuous?: boolean;
  canAccept?: () => boolean;
  onVoice?: () => void;
  automaticBargeIn?: boolean;
}

type VadInstance = {
  pause(): Promise<void>;
  destroy(): Promise<void>;
};

type BrowserRecognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { resultIndex: number; results: ArrayLike<{ 0: { transcript: string }; isFinal: boolean }> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  abort(): void;
};

type BrowserRecognitionConstructor = new () => BrowserRecognition;

type SpeechWindow = Window & typeof globalThis & {
  SpeechRecognition?: BrowserRecognitionConstructor;
  webkitSpeechRecognition?: BrowserRecognitionConstructor;
};

type Capture = {
  requestId: string;
  generation: number;
  stop(): Promise<void>;
  removeAbort(): void;
};

type Playback = {
  requestId: string;
  generation: number;
  stop(): void;
  removeAbort(): void;
  pause?(): boolean;
  resume?(): Promise<AdapterResult>;
};

export async function loadVadModule() {
  return import('@ricky0123/vad-web');
}

function safeErrorCode(response: Response, fallback: string): Promise<string> {
  return response.json()
    .then((body: ApiError) => body?.error?.code || fallback)
    .catch(() => fallback);
}

function browserRecognitionConstructor(): BrowserRecognitionConstructor | undefined {
  if (typeof window === 'undefined') return undefined;
  const speechWindow = window as SpeechWindow;
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
}

function browserTtsAvailable(): boolean {
  return typeof window !== 'undefined'
    && 'speechSynthesis' in window
    && typeof SpeechSynthesisUtterance !== 'undefined';
}

function now(): number {
  return typeof performance === 'undefined' ? Date.now() : performance.now();
}

function elapsed(startedAt: number): number {
  return Math.round((now() - startedAt) * 10) / 10;
}

/** Settle promptly even if a provider/permission promise ignores AbortSignal. */
function abortable<T>(pending: Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const abort = () => reject(new DOMException('Stopped', 'AbortError'));
    pending.then(resolve, reject).finally(() => signal.removeEventListener('abort', abort));
    if (signal.aborted) { abort(); return; }
    signal.addEventListener('abort', abort, { once: true });
  });
}

function permissionCode(error: unknown): string {
  if (error instanceof DOMException && (error.name === 'NotAllowedError' || error.name === 'SecurityError')) {
    return 'permission_denied';
  }
  return 'capture_failed';
}

async function waitForBrowserVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!browserTtsAvailable()) return [];
  const immediate = window.speechSynthesis.getVoices();
  if (immediate.length) return immediate;
  return new Promise((resolve) => {
    const timeout = window.setTimeout(() => finish(), 5000);
    const finish = () => {
      window.clearTimeout(timeout);
      window.speechSynthesis.removeEventListener('voiceschanged', finish);
      resolve(window.speechSynthesis.getVoices());
    };
    window.speechSynthesis.addEventListener('voiceschanged', finish, { once: true });
  });
}

export class CampusSpeechAdapter implements SpeechAdapter {
  readonly capabilities = {
    asr: false,
    tts: false,
    timestamps: 'none' as const,
  };

  private readonly recognitionMode: RecognitionMode;
  get supportsContinuousRecognition(): boolean { return this.recognitionMode === 'server'; }
  private readonly onTrace?: (event: SpeechPlaybackTrace) => void;
  private capture?: Capture;
  private playback?: Playback;
  private player?: HTMLAudioElement;
  private audioContext?: AudioContext;
  private prepared = new Set<PreparedSpeech>();
  private audioCache = new Map<string, Blob>();
  private preparing = new Map<AbortController, string>();
  private captureGeneration = 0;
  private playbackGeneration = 0;
  private volume: number;
  private muted: boolean;
  private readonly loadVad: typeof loadVadModule;
  private readonly asrTimeoutMs: number;
  private readonly captureTimeoutMs: number;
  private captureOptions?: CaptureOptions;
  private captureAbort?: AbortController;
  private readonly levels = new Set<(level: number) => void>();
  private analyser?: AnalyserNode;
  private source?: MediaElementAudioSourceNode;
  private levelFrame?: number;
  private sounding = false;
  readonly recognitionStatus = { configured: false, state: 'idle', error_code: null as string | null };

  constructor(options: SpeechAdapterOptions = {}) {
    this.recognitionMode = options.recognitionMode ?? 'server';
    this.loadVad = options.loadVad ?? loadVadModule;
    this.asrTimeoutMs = options.asrTimeoutMs ?? 65000;
    this.captureTimeoutMs = options.captureTimeoutMs ?? 20000;
    this.onTrace = options.onTrace;
    this.volume = Math.max(0, Math.min(1, options.volume ?? 1));
    this.muted = options.muted ?? false;
  }

  /** Must be called from the user's click/keyboard event for the current page session. */
  async activatePlayback(): Promise<AdapterResult> {
    if (typeof Audio === 'undefined') return { status: 'failed', error_code: 'playback_unsupported' };
    this.ensurePlayer();
    let state: AudioContextState | 'unavailable' = 'unavailable';
    try {
      const Context = typeof window !== 'undefined'
        ? (window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)
        : undefined;
      if (Context) {
        this.audioContext ??= new Context();
        if (this.audioContext.state === 'suspended') await this.audioContext.resume();
        state = this.audioContext.state;
        if (state !== 'running') throw new Error('audio_context_not_running');
      }
      this.trace('activation', null, null, { audio_context_state: state });
      return { status: 'ready' };
    } catch {
      this.trace('error', null, null, { audio_context_state: this.audioContext?.state ?? state, code: 'playback_activation_failed' });
      return { status: 'failed', error_code: 'playback_activation_failed' };
    }
  }

  setOutput(volume: number, muted: boolean): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.muted = muted;
    if (muted || this.volume === 0) this.emitLevel(0);
    if (this.player) {
      this.player.volume = this.volume;
      this.player.muted = this.muted;
    }
  }

  dispose(): void {
    void this.stopCapture();
    this.cancelPlayback();
    for (const controller of this.preparing.keys()) controller.abort();
    this.preparing.clear();
    for (const item of [...this.prepared]) this.releasePrepared(item);
    if (this.audioContext && this.audioContext.state !== 'closed') void this.audioContext.close();
    this.stopLevels();
    this.source?.disconnect();
    this.analyser?.disconnect();
    this.source = undefined;
    this.analyser = undefined;
    this.levels.clear();
    this.audioContext = undefined;
    this.player = undefined;
  }

  subscribeAudioLevel(callback: (level: number) => void): () => void {
    this.levels.add(callback);
    return () => this.levels.delete(callback);
  }

  async start(context: SpeechContext, callbacks: SpeechCallbacks, options?: CaptureOptions): Promise<AdapterResult> {
    const stopping = this.stopCapture();
    const generation = this.captureGeneration;
    await stopping;
    if (generation !== this.captureGeneration) return { status: 'failed', error_code: 'stopped' };
    this.captureOptions = options;
    if (!options?.continuous) this.cancelPlayback();
    if (context.signal.aborted) return { status: 'failed', error_code: 'stopped' };
    return this.recognitionMode === 'browser'
      ? this.startBrowserRecognition(context, callbacks)
      : this.startServerRecognition(context, callbacks);
  }

  async stop(requestId: string) {
    const stoppedCapture = !!this.capture && this.capture.requestId === requestId;
    const stoppedPlayback = !!this.playback && this.playback.requestId === requestId;
    if (stoppedPlayback) this.cancelPlayback();
    const stoppingCapture = stoppedCapture ? this.stopCapture() : Promise.resolve();
    for (const [controller, preparingRequestId] of this.preparing) {
      if (preparingRequestId === requestId) controller.abort();
    }
    for (const item of [...this.prepared]) {
      if (item.requestId === requestId) this.releasePrepared(item);
    }

    const stopController = new AbortController();
    const stopTimeout = setTimeout(() => stopController.abort(), 5000);
    try {
      await stoppingCapture;
      const sessionId = this.lastSessionByRequest.get(requestId);
      if (!sessionId) return { local_stopped: true, upstream_stop: 'not_started' as const };
      const response = await fetch('/api/speech/stop', {
        method: 'POST',
        signal: stopController.signal,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ request_id: requestId, session_id: sessionId }),
      });
      if (!response.ok) return { local_stopped: true, upstream_stop: 'unconfirmed' as const };
      const body = await response.json() as { local_stopped: boolean; upstream_stop: 'not_started' | 'unconfirmed' | 'confirmed' };
      return { local_stopped: stoppedCapture || stoppedPlayback || body.local_stopped, upstream_stop: body.upstream_stop };
    } catch {
      return { local_stopped: true, upstream_stop: 'unconfirmed' as const };
    } finally {
      clearTimeout(stopTimeout);
    }
  }

  async speak(
    context: SpeechContext,
    utteranceId: string,
    text: string,
    voiceId: string,
    callbacks: SpeechCallbacks,
  ): Promise<AdapterResult> {
    this.remember(context);
    if (context.signal.aborted) return { status: 'failed', error_code: 'stopped' };
    const prepared = await this.prepareSpeech(context, utteranceId, text, voiceId);
    if ('status' in prepared) {
      if (prepared.error_code !== 'stopped') callbacks.onFailure(utteranceId, prepared.error_code ?? 'tts_unavailable');
      return prepared;
    }
    return this.playPreparedSpeech(prepared, callbacks);
  }

  async prepareSpeech(
    context: SpeechContext,
    utteranceId: string,
    text: string,
    voiceId: string,
  ): Promise<PreparedSpeech | AdapterResult> {
    this.remember(context);
    if (context.signal.aborted) return { status: 'failed', error_code: 'stopped' };
    this.trace('text_received', context.request_id, utteranceId, { chars: [...text].length });
    if (voiceId.startsWith('browser:')) {
      const item: PreparedSpeech = {
        requestId: context.request_id,
        utteranceId,
        context,
        text,
        voiceId,
        kind: 'browser',
        released: false,
      };
      this.prepared.add(item);
      return item;
    }
    return this.prepareServerSpeech(context, utteranceId, text, voiceId);
  }

  async playPreparedSpeech(prepared: PreparedSpeech, callbacks: SpeechCallbacks): Promise<AdapterResult> {
    if (prepared.released || prepared.context.signal.aborted) {
      return { status: 'failed', error_code: 'stopped' };
    }
    if (!this.captureOptions?.continuous) await this.stopCapture();
    if (prepared.released || prepared.context.signal.aborted) return { status: 'failed', error_code: 'stopped' };
    this.cancelPlayback();
    if (prepared.kind === 'browser') {
      this.prepared.delete(prepared);
      prepared.released = true;
      return this.speakWithBrowser(
        prepared.context,
        prepared.utteranceId,
        prepared.text,
        prepared.voiceId.slice('browser:'.length),
        callbacks,
      );
    }
    return this.playPreparedServerSpeech(prepared, callbacks);
  }

  pausePlayback(): AdapterResult {
    const paused = this.playback?.pause?.() ?? false;
    return paused ? { status: 'ready' } : { status: 'failed', error_code: 'nothing_playing' };
  }

  async resumePlayback(): Promise<AdapterResult> {
    if (!this.playback?.resume) return { status: 'failed', error_code: 'nothing_to_resume' };
    return this.playback.resume();
  }

  releasePrepared(prepared: PreparedSpeech): void {
    if (prepared.released) return;
    prepared.released = true;
    this.prepared.delete(prepared);
    if (prepared.objectUrl) URL.revokeObjectURL(prepared.objectUrl);
  }

  async listVoices(): Promise<Voice[]> {
    const [voices] = await Promise.all([this.listServerVoices(), this.refreshAsrCapability()]);
    this.capabilities.tts = voices.length > 0;
    return voices;
  }

  private readonly lastSessionByRequest = new Map<string, string>();

  private remember(context: SpeechContext): void {
    this.lastSessionByRequest.set(context.request_id, context.session_id);
    if (this.lastSessionByRequest.size > 128) {
      const oldest = this.lastSessionByRequest.keys().next().value as string | undefined;
      if (oldest) this.lastSessionByRequest.delete(oldest);
    }
  }

  private async startServerRecognition(context: SpeechContext, callbacks: SpeechCallbacks): Promise<AdapterResult> {
    this.remember(context);
    const options = this.captureOptions;
    const generation = ++this.captureGeneration;
    const controller = new AbortController();
    this.captureAbort = controller;
    const current = () => generation === this.captureGeneration && !context.signal.aborted && !controller.signal.aborted;
    const fail = (code: string) => {
      if (!current()) return;
      this.recognitionStatus.state = 'error'; this.recognitionStatus.error_code = code;
      callbacks.onFailure(context.request_id, code);
      if (current()) void this.stopCapture();
    };
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      fail('capture_unsupported'); return { status: 'failed', error_code: 'capture_unsupported' };
    }
    let vad: VadInstance | undefined;
    let stream: MediaStream | undefined;
    let busy = false, contaminated = false, trustedMs = 0, voiced = false;
    let segmentTimer: ReturnType<typeof setTimeout> | undefined;
    const abort = () => { if (generation === this.captureGeneration) void this.stopCapture(); };
    context.signal.addEventListener('abort', abort, { once: true });
    const stopTracks = () => stream?.getTracks().forEach(track => track.stop());
    const initialTimer = setTimeout(() => fail('capture_timeout'), this.captureTimeoutMs);
    this.capture = {
      requestId: context.request_id, generation,
      removeAbort: () => context.signal.removeEventListener('abort', abort),
      stop: async () => { controller.abort(); clearTimeout(initialTimer); clearTimeout(segmentTimer); stopTracks(); await vad?.destroy(); },
    };
    this.recognitionStatus.state = 'starting'; this.recognitionStatus.error_code = null;
    try {
      const module = await abortable(this.loadVad(), controller.signal);
      if (!current()) return { status: 'failed', error_code: 'stopped' };
      const pending = module.MicVAD.new({
        model: 'v5', baseAssetPath: '/vendor/vad/', onnxWASMBasePath: '/vendor/ort/', startOnLoad: true,
        positiveSpeechThreshold: 0.5, negativeSpeechThreshold: 0.35,
        minSpeechMs: 250, redemptionMs: 1100, preSpeechPadMs: 450,
        getStream: async () => {
          const acquired = await navigator.mediaDevices.getUserMedia({ audio: {
            channelCount: 1, echoCancellation: true, noiseSuppression: true, autoGainControl: true,
          } });
          if (!current()) { acquired.getTracks().forEach(track => track.stop()); throw new DOMException('Stopped', 'AbortError'); }
          stream = acquired;
          return acquired;
        },
        pauseStream: async () => { stopTracks(); },
        onSpeechStart: () => {
          if (!current()) return;
          contaminated = busy || !(options?.canAccept?.() ?? true); trustedMs = 0; voiced = false;
          clearTimeout(segmentTimer);
          segmentTimer = setTimeout(() => fail('audio_too_long'), 29000);
        },
        onFrameProcessed: (probabilities, frame) => {
          if (!current()) return;
          if (!(options?.canAccept?.() ?? true)) contaminated = true;
          const rms = Math.sqrt(frame.reduce((sum, value) => sum + value * value, 0) / Math.max(1, frame.length));
          trustedMs = probabilities.isSpeech >= 0.9 && rms >= 0.025 ? trustedMs + frame.length / 16 : 0;
          if (!contaminated && !busy && !voiced && trustedMs >= 480) {
            voiced = true;
            if (options?.automaticBargeIn && stream?.getAudioTracks()[0]?.getSettings().echoCancellation === true) options.onVoice?.();
          }
        },
        onVADMisfire: () => { clearTimeout(segmentTimer); trustedMs = 0; },
        onSpeechEnd: (audio) => {
          clearTimeout(segmentTimer);
          if (!current() || busy || contaminated || !(options?.canAccept?.() ?? true)) return;
          busy = true;
          void this.submitAudio(context, generation, audio, callbacks, controller.signal).finally(() => { busy = false; });
        },
      });
      // A permission prompt or model load cannot keep start() pending after stop/timeout.
      void pending.then(async instance => { if (!current()) await instance.destroy(); }, () => undefined);
      vad = await abortable(pending, controller.signal);
      clearTimeout(initialTimer);
      if (!current()) { await vad.destroy(); return { status: 'failed', error_code: 'stopped' }; }
      this.recognitionStatus.state = 'listening';
      if (!options?.continuous) segmentTimer = setTimeout(() => fail('capture_timeout'), this.captureTimeoutMs);
      return { status: 'ready' };
    } catch (error) {
      stopTracks();
      if (!current()) return { status: 'failed', error_code: this.recognitionStatus.error_code ?? 'stopped' };
      const code = permissionCode(error); fail(code);
      return { status: 'failed', error_code: code };
    }
  }

  private async submitAudio(context: SpeechContext, generation: number, audio: Float32Array, callbacks: SpeechCallbacks, captureSignal: AbortSignal): Promise<void> {
    const current = () => generation === this.captureGeneration && !context.signal.aborted && !captureSignal.aborted;
    if (!current()) return;
    const controller = new AbortController();
    const abort = () => controller.abort();
    captureSignal.addEventListener('abort', abort, { once: true });
    let timedOut = false;
    const timeout = setTimeout(() => { timedOut = true; controller.abort(); }, this.asrTimeoutMs);
    const fail = (code: string) => {
      if (!current()) return;
      this.recognitionStatus.state = 'error'; this.recognitionStatus.error_code = code;
      callbacks.onFailure(context.request_id, code);
      if (current()) void this.stopCapture();
    };
    try {
      if (!audio.length || audio.length > 16000 * 30) { fail('audio_too_long'); return; }
      const vad = await abortable(this.loadVad(), controller.signal);
      if (!current() || controller.signal.aborted) return;
      const wav = vad.utils.encodeWAV(audio, 1, 16000, 1, 16);
      this.recognitionStatus.state = 'recognizing';
      const response = await abortable(fetch('/api/speech/asr', {
        method: 'POST', headers: { 'content-type': 'application/json' }, signal: controller.signal,
        body: JSON.stringify({ request_id: context.request_id, session_id: context.session_id,
          audio: { encoding: 'base64', mime_type: 'audio/wav', sample_rate_hz: 16000, channels: 1, audio_base64: vad.utils.arrayBufferToBase64(wav) } }),
      }), controller.signal);
      if (!current()) return;
      if (!response.ok) { const code = await abortable(safeErrorCode(response, 'asr_unavailable'), controller.signal); fail(code); return; }
      const body = await abortable(response.json(), controller.signal) as AsrResponse;
      if (!current()) return;
      if (body.request_id !== context.request_id || typeof body.text !== 'string' || !body.text.trim() || body.text.length > 8000 || body.is_final !== true) { fail('invalid_asr_response'); return; }
      this.capabilities.asr = true; this.recognitionStatus.state = 'listening';
      callbacks.onText(body.text.trim(), true);
    } catch {
      fail(timedOut ? 'asr_timeout' : 'asr_unavailable');
    } finally {
      clearTimeout(timeout); captureSignal.removeEventListener('abort', abort);
      if (current() && !this.captureOptions?.continuous) await this.stopCapture();
    }
  }

  private async startBrowserRecognition(context: SpeechContext, callbacks: SpeechCallbacks): Promise<AdapterResult> {
    this.remember(context);
    const Recognition = browserRecognitionConstructor();
    if (!Recognition) {
      callbacks.onFailure(context.request_id, 'browser_asr_unsupported');
      return { status: 'failed', error_code: 'browser_asr_unsupported' };
    }
    const generation = ++this.captureGeneration;
    const recognition = new Recognition();
    recognition.lang = 'zh-CN';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      if (generation !== this.captureGeneration || context.signal.aborted) return;
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const transcript = result?.[0]?.transcript?.trim();
        if (transcript) callbacks.onText(transcript, !!result.isFinal);
      }
    };
    recognition.onerror = (event) => {
      if (generation !== this.captureGeneration) return;
      if (event.error === 'not-allowed') this.capabilities.asr = false;
      callbacks.onFailure(context.request_id, event.error === 'not-allowed' ? 'permission_denied' : 'browser_asr_failed');
    };
    recognition.onend = () => {
      if (this.capture?.generation !== generation) return;
      this.capture.removeAbort();
      this.capture = undefined;
    };
    const abort = () => void this.stopCapture();
    context.signal.addEventListener('abort', abort, { once: true });
    this.capture = {
      requestId: context.request_id,
      generation,
      stop: async () => recognition.abort(),
      removeAbort: () => context.signal.removeEventListener('abort', abort),
    };
    try {
      recognition.start();
      this.capabilities.asr = true;
      return { status: 'ready' };
    } catch (error) {
      await this.stopCapture();
      const code = permissionCode(error);
      callbacks.onFailure(context.request_id, code);
      return { status: 'failed', error_code: code };
    }
  }

  private async prepareServerSpeech(
    context: SpeechContext,
    utteranceId: string,
    text: string,
    voiceId: string,
  ): Promise<PreparedSpeech | AdapterResult> {
    const cacheKey=JSON.stringify([text,voiceId,'+0%']);
    const cached=this.audioCache.get(cacheKey);
    if(cached&&!context.signal.aborted){
      const item:PreparedSpeech={requestId:context.request_id,utteranceId,context,text,voiceId,kind:'server',objectUrl:URL.createObjectURL(cached),released:false};
      this.prepared.add(item);return item;
    }
    const controller = new AbortController();
    this.preparing.set(controller, context.request_id);
    const abort = () => controller.abort();
    context.signal.addEventListener('abort', abort, { once: true });
    const startedAt = now();
    try {
      const response = await fetch('/api/speech/tts', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          request_id: context.request_id,
          session_id: context.session_id,
          utterance_id: utteranceId,
          text,
          voice_id: voiceId,
        }),
      });
      const responseType = response.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase() ?? '';
      this.trace('tts_response', context.request_id, utteranceId, {
        elapsed_ms: elapsed(startedAt), status: response.status, content_type: responseType || null,
      });
      if (context.signal.aborted || controller.signal.aborted) return { status: 'failed', error_code: 'stopped' };
      if (!response.ok) {
        const code = await safeErrorCode(response, 'tts_unavailable');
        this.trace('error', context.request_id, utteranceId, { elapsed_ms: elapsed(startedAt), code });
        return { status: 'failed', error_code: code };
      }
      if (responseType !== 'application/json') throw new Error('invalid_tts_content_type');
      const body = await response.json() as TtsResponse;
      if (body.request_id !== context.request_id || body.utterance_id !== utteranceId
          || !body.audio_url.startsWith('/api/speech/audio/') || !body.mime_type.startsWith('audio/')) {
        throw new Error('invalid_tts_response');
      }
      const audioStartedAt = now();
      const audioResponse = await fetch(body.audio_url, { signal: controller.signal, headers: { accept: 'audio/*' } });
      const audioType = audioResponse.headers.get('content-type')?.split(';', 1)[0]?.trim().toLowerCase() ?? '';
      if (!audioResponse.ok) {
        this.trace('audio_response', context.request_id, utteranceId, {
          elapsed_ms: elapsed(audioStartedAt), status: audioResponse.status, content_type: audioType || null,
        });
        return { status: 'failed', error_code: 'audio_fetch_failed' };
      }
      if (!audioType.startsWith('audio/')) throw new Error('invalid_audio_content_type');
      const audioBytes = await audioResponse.arrayBuffer();
      this.trace('audio_response', context.request_id, utteranceId, {
        elapsed_ms: elapsed(audioStartedAt), status: audioResponse.status, content_type: audioType, bytes: audioBytes.byteLength,
      });
      if (audioBytes.byteLength === 0) throw new Error('empty_audio');
      if (context.signal.aborted || controller.signal.aborted) return { status: 'failed', error_code: 'stopped' };
      const decodeStartedAt = now();
      if (this.audioContext) await this.audioContext.decodeAudioData(audioBytes.slice(0));
      this.trace('decode', context.request_id, utteranceId, {
        elapsed_ms: elapsed(decodeStartedAt), bytes: audioBytes.byteLength,
        audio_context_state: this.audioContext?.state ?? 'unavailable',
      });
      if (context.signal.aborted || controller.signal.aborted) return { status: 'failed', error_code: 'stopped' };
      const blob = new Blob([audioBytes], { type: audioType });
      // Only decoded, nonempty successful responses are reusable. Bound memory.
      this.audioCache.set(cacheKey,blob);
      while(this.audioCache.size>24)this.audioCache.delete(this.audioCache.keys().next().value!);
      const item: PreparedSpeech = {
        requestId: context.request_id,
        utteranceId,
        context,
        text,
        voiceId,
        kind: 'server',
        objectUrl: URL.createObjectURL(blob),
        released: false,
      };
      this.prepared.add(item);
      this.capabilities.tts = true;
      return item;
    } catch (error) {
      const code = context.signal.aborted || controller.signal.aborted || (error instanceof DOMException && error.name === 'AbortError')
        ? 'stopped'
        : error instanceof Error && error.message === 'empty_audio'
          ? 'tts_empty_audio'
          : error instanceof Error && error.message.includes('content_type')
            ? 'tts_invalid_content_type'
            : error instanceof Error && error.message === 'invalid_tts_response'
              ? 'invalid_tts_response'
              : 'audio_decode_failed';
      this.trace('error', context.request_id, utteranceId, { elapsed_ms: elapsed(startedAt), code });
      return { status: 'failed', error_code: code };
    } finally {
      this.preparing.delete(controller);
      context.signal.removeEventListener('abort', abort);
    }
  }

  private async playPreparedServerSpeech(prepared: PreparedSpeech, callbacks: SpeechCallbacks): Promise<AdapterResult> {
    if (typeof Audio === 'undefined' || !prepared.objectUrl) {
      this.releasePrepared(prepared);
      callbacks.onFailure(prepared.utteranceId, 'playback_unsupported');
      return { status: 'failed', error_code: 'playback_unsupported' };
    }
    const audio = this.ensurePlayer();
    const generation = ++this.playbackGeneration;
    const startedAt = now();
    let blocked = false;
    const abort = () => { if (this.playback?.generation === generation) this.cancelPlayback(); };
    prepared.context.signal.addEventListener('abort', abort, { once: true });
    const cleanup = (release = true) => {
      prepared.context.signal.removeEventListener('abort', abort);
      if (generation === this.playbackGeneration) {
        audio.onplaying = null;
        audio.onended = null;
        audio.onerror = null;
        audio.onpause = null;
        audio.onwaiting = null;
        this.stopLevels();
      }
      if (release) this.releasePrepared(prepared);
      if (this.playback?.generation === generation) this.playback = undefined;
    };
    const resume = async (): Promise<AdapterResult> => {
      try {
        this.trace('play_request', prepared.requestId, prepared.utteranceId, {
          elapsed_ms: elapsed(startedAt), volume: audio.volume, muted: audio.muted,
          audio_context_state: this.audioContext?.state ?? 'unavailable',
        });
        if (this.audioContext?.state === 'suspended') await this.audioContext.resume();
        if (generation !== this.playbackGeneration || prepared.context.signal.aborted) return { status: 'failed', error_code: 'stopped' };
        await audio.play();
        if (generation !== this.playbackGeneration || prepared.context.signal.aborted) return { status: 'failed', error_code: 'stopped' };
        blocked = false;
        this.trace('play_resolved', prepared.requestId, prepared.utteranceId, { elapsed_ms: elapsed(startedAt) });
        return { status: 'ready' };
      } catch (error) {
        if (generation !== this.playbackGeneration || prepared.context.signal.aborted) return { status: 'failed', error_code: 'stopped' };
        const code = error instanceof DOMException && error.name === 'NotAllowedError'
          ? 'playback_permission_denied'
          : 'playback_failed';
        blocked = code === 'playback_permission_denied';
        this.trace('error', prepared.requestId, prepared.utteranceId, { elapsed_ms: elapsed(startedAt), code });
        callbacks.onFailure(prepared.utteranceId, code);
        if (!blocked) { this.audioCache.delete(JSON.stringify([prepared.text,prepared.voiceId,'+0%'])); cleanup(); }
        return { status: 'failed', error_code: code };
      }
    };
    audio.preload = 'auto';
    audio.volume = this.volume;
    audio.muted = this.muted;
    audio.src = prepared.objectUrl;
    audio.load();
    audio.onplaying = () => {
      if (generation !== this.playbackGeneration) return;
      this.startLevels();
      this.trace('playing', prepared.requestId, prepared.utteranceId, {
        elapsed_ms: elapsed(startedAt), volume: audio.volume, muted: audio.muted,
        audio_context_state: this.audioContext?.state ?? 'unavailable',
      });
      callbacks.onStart(prepared.utteranceId);
    };
    audio.onpause = audio.onwaiting = () => { if (generation === this.playbackGeneration) this.stopLevels(); };
    audio.onended = () => {
      if (generation !== this.playbackGeneration) return;
      this.trace('ended', prepared.requestId, prepared.utteranceId, { elapsed_ms: elapsed(startedAt) });
      cleanup();
      callbacks.onEnd(prepared.utteranceId);
    };
    audio.onerror = () => {
      if (generation !== this.playbackGeneration || blocked) return;
      this.audioCache.delete(JSON.stringify([prepared.text,prepared.voiceId,'+0%']));
      this.trace('error', prepared.requestId, prepared.utteranceId, { elapsed_ms: elapsed(startedAt), code: 'playback_failed' });
      cleanup();
      callbacks.onFailure(prepared.utteranceId, 'playback_failed');
    };
    this.playback = {
      requestId: prepared.requestId,
      generation,
      stop: () => {
        this.stopLevels();
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
        cleanup();
      },
      removeAbort: () => prepared.context.signal.removeEventListener('abort', abort),
      pause: () => {
        if (audio.paused || audio.ended) return false;
        this.stopLevels();
        audio.pause();
        this.trace('paused', prepared.requestId, prepared.utteranceId, { elapsed_ms: elapsed(startedAt) });
        return true;
      },
      resume,
    };
    return resume();
  }

  private async speakWithBrowser(
    context: SpeechContext,
    utteranceId: string,
    text: string,
    voiceUri: string,
    callbacks: SpeechCallbacks,
  ): Promise<AdapterResult> {
    if (!browserTtsAvailable()) {
      callbacks.onFailure(utteranceId, 'browser_tts_unsupported');
      return { status: 'failed', error_code: 'browser_tts_unsupported' };
    }
    const generation = ++this.playbackGeneration;
    const startedAt = now();
    const abort = () => this.cancelPlayback();
    context.signal.addEventListener('abort', abort, { once: true });
    this.playback = {
      requestId: context.request_id,
      generation,
      stop: () => window.speechSynthesis.cancel(),
      removeAbort: () => context.signal.removeEventListener('abort', abort),
      pause: () => {
        if (!window.speechSynthesis.speaking || window.speechSynthesis.paused) return false;
        window.speechSynthesis.pause();
        this.trace('paused', context.request_id, utteranceId, { elapsed_ms: elapsed(startedAt) });
        return true;
      },
      resume: async () => {
        if (!window.speechSynthesis.paused) return { status: 'failed', error_code: 'nothing_to_resume' };
        window.speechSynthesis.resume();
        return { status: 'ready' };
      },
    };
    const voices = await waitForBrowserVoices();
    if (generation !== this.playbackGeneration || context.signal.aborted) {
      return { status: 'failed', error_code: 'stopped' };
    }
    const voice = voices.find((item) => item.voiceURI === voiceUri && item.lang.toLowerCase().startsWith('zh'));
    if (!voice) {
      this.playback?.removeAbort();
      this.playback = undefined;
      callbacks.onFailure(utteranceId, 'voice_unavailable');
      return { status: 'failed', error_code: 'voice_unavailable' };
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voice.lang;
    utterance.voice = voice;
    utterance.onstart = () => {
      if (generation === this.playbackGeneration) {
        this.trace('playing', context.request_id, utteranceId, { elapsed_ms: elapsed(startedAt) });
        callbacks.onStart(utteranceId);
      }
    };
    utterance.onresume = () => { if (generation === this.playbackGeneration) callbacks.onStart(utteranceId); };
    utterance.onend = () => {
      if (generation !== this.playbackGeneration) return;
      this.playback?.removeAbort();
      this.playback = undefined;
      this.trace('ended', context.request_id, utteranceId, { elapsed_ms: elapsed(startedAt) });
      callbacks.onEnd(utteranceId);
    };
    utterance.onerror = () => {
      if (generation !== this.playbackGeneration) return;
      this.playback?.removeAbort();
      this.playback = undefined;
      this.trace('error', context.request_id, utteranceId, { elapsed_ms: elapsed(startedAt), code: 'playback_failed' });
      callbacks.onFailure(utteranceId, 'playback_failed');
    };
    this.trace('play_request', context.request_id, utteranceId, { elapsed_ms: elapsed(startedAt) });
    window.speechSynthesis.speak(utterance);
    this.capabilities.tts = true;
    return { status: 'ready' };
  }

  async refreshAsrCapability(): Promise<void> {
    if (this.recognitionMode === 'browser') { this.capabilities.asr = !!browserRecognitionConstructor(); this.recognitionStatus.configured = this.capabilities.asr; this.recognitionStatus.error_code = this.capabilities.asr ? null : 'browser_asr_unsupported'; return; }
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 4000);
    try {
      const response = await fetch('/api/health', { signal: controller.signal });
      this.capabilities.asr = response.ok && (await response.json()).capabilities?.asr === true;
      this.recognitionStatus.configured = this.capabilities.asr;
      this.recognitionStatus.error_code = response.ok ? (this.capabilities.asr ? null : 'asr_not_configured') : 'asr_unavailable';
    } catch { this.capabilities.asr = false; this.recognitionStatus.configured = false; this.recognitionStatus.error_code = 'asr_unavailable'; }
    finally { window.clearTimeout(timeout); }
  }

  private async listServerVoices(): Promise<Voice[]> {
    const controller = new AbortController();
    // Server voice discovery has a 10-second deadline; allow transport overhead.
    // Each explicit listVoices call is a fresh retry, without background polling.
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch('/api/speech/voices', { signal: controller.signal });
      if (!response.ok) return [];
      const body = await response.json() as { voices: Voice[]; status: 'ready' | 'not_implemented' };
      return body.status === 'ready' ? body.voices : [];
    } catch {
      return [];
    } finally {
      window.clearTimeout(timeout);
    }
  }

  private async stopCapture(): Promise<void> {
    const capture = this.capture;
    this.capture = undefined;
    this.captureAbort?.abort();
    this.captureAbort = undefined;
    this.captureGeneration += 1;
    if (this.recognitionStatus.state !== 'error') this.recognitionStatus.state = 'idle';
    if (!capture) return;
    capture.removeAbort();
    try {
      await capture.stop();
    } catch {
      // The local microphone state is already detached from this adapter.
    }
  }

  private emitLevel(level: number): void { for (const callback of this.levels) callback(level); }
  private stopLevels(): void {
    this.sounding = false;
    if (this.levelFrame !== undefined) cancelAnimationFrame(this.levelFrame);
    this.levelFrame = undefined;
    this.emitLevel(0);
  }
  private startLevels(): void {
    this.stopLevels();
    if (!this.audioContext || !this.player || typeof requestAnimationFrame === 'undefined') return;
    try {
      if (!this.source) {
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 512;
        this.source = this.audioContext.createMediaElementSource(this.player);
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
      }
      this.sounding = true;
      const samples = new Float32Array(this.analyser!.fftSize);
      const tick = () => {
        if (!this.sounding) return;
        this.analyser!.getFloatTimeDomainData(samples);
        const rms = Math.sqrt(samples.reduce((sum, value) => sum + value * value, 0) / samples.length);
        const audible = !this.player!.muted && !this.player!.paused && !this.player!.ended && this.audioContext?.state === 'running';
        this.emitLevel(audible ? Math.min(1, Math.max(0, rms - 0.008) * 6 * this.player!.volume) : 0);
        this.levelFrame = requestAnimationFrame(tick);
      };
      tick();
    } catch { this.stopLevels(); }
  }

  private ensurePlayer(): HTMLAudioElement {
    this.player ??= new Audio();
    this.player.preload = 'auto';
    this.player.volume = this.volume;
    this.player.muted = this.muted;
    return this.player;
  }

  private trace(
    stage: SpeechPlaybackTraceStage,
    requestId: string | null,
    utteranceId: string | null,
    values: Partial<Omit<SpeechPlaybackTrace, 'stage' | 'request_id' | 'utterance_id'>> = {},
  ): void {
    this.onTrace?.({
      stage,
      request_id: requestId,
      utterance_id: utteranceId,
      elapsed_ms: values.elapsed_ms ?? null,
      status: values.status ?? null,
      content_type: values.content_type ?? null,
      bytes: values.bytes ?? null,
      chars: values.chars ?? null,
      volume: values.volume ?? null,
      muted: values.muted ?? null,
      audio_context_state: values.audio_context_state ?? null,
      code: values.code ?? null,
    });
  }

  private cancelPlayback(): void {
    const playback = this.playback;
    this.stopLevels();
    this.playback = undefined;
    this.playbackGeneration += 1;
    if (!playback) return;
    playback.removeAbort();
    playback.stop();
    this.trace('stopped', playback.requestId, null, {});
  }
}

export function createSpeechAdapter(options?: SpeechAdapterOptions): SpeechAdapter {
  return new CampusSpeechAdapter(options);
}

// Compatibility alias for the M0 assembly; it now uses the production adapter.
export { CampusSpeechAdapter as StubSpeechAdapter };
