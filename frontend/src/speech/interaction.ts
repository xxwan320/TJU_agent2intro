import type { SpeechInteractionEvent } from '../../../shared/r3';
import type { SpeechInteractionController, SpeechInteractionOptions, SpeechInteractionCapabilities } from '../../../shared/r3-speech';
import { CampusSpeechController, createSpeechController, type PlaybackEvent } from './controller';

export interface InteractionDependencies {
  /** Pass A's existing controller; never create a second playback queue. */
  speechController?: CampusSpeechController;
  /** Explicit headset choice only. Speaker/default mode uses manual interruption. */
  automaticBargeIn?: boolean;
}

export const RECOGNITION_MESSAGES: Readonly<Record<string, string>> = {
  asr_not_configured: '中文识别服务尚未配置，请使用文字输入。',
  asr_unavailable: '中文识别服务暂时不可用，请重试或使用文字输入。',
  asr_timeout: '中文识别超时，麦克风已释放，请重试。',
  capture_timeout: '麦克风授权或语音检测加载超时，请检查权限后重试。',
  permission_denied: '麦克风权限被拒绝，请在浏览器中允许后重试。',
  capture_unsupported: '当前浏览器不支持麦克风采集。',
  capture_failed: '麦克风或语音检测加载失败，请检查设备后重试。',
  audio_too_long: '单次发言请控制在29秒以内，麦克风已释放。',
};

/** Owns local speech only. A owns business requests, cancellation and send preferences. */
export class CampusSpeechInteractionController implements SpeechInteractionController {
  readonly speechController: CampusSpeechController;
  private options?: SpeechInteractionOptions;
  private capture?: AbortController;
  private epoch = 0;
  private disposed = false;
  private playing: PlaybackEvent | null = null;
  private quietUntil = 0;
  private readonly unsubscribe: () => void;
  private readonly unsubscribeLevel: () => void;
  private readonly unsubscribeProgress: () => void;
  private readonly ownsController: boolean;

  constructor(private readonly dependencies: InteractionDependencies = {}) {
    this.ownsController = !dependencies.speechController;
    this.speechController = dependencies.speechController ?? createSpeechController();
    this.unsubscribe = this.speechController.subscribePlayback(event => this.onPlayback(event));
    this.unsubscribeProgress = this.speechController.subscribe(progress => {
      const options = this.options;
      if (progress.status !== 'error' || !options || progress.generation_id !== options.context.generation_id || progress.request_id !== options.context.request_id) return;
      this.playing = null; this.quietUntil = Date.now() + 800;
      options.onAudioLevel?.(0);
      this.emit(options, 'speech.error', { error_code: 'playback_failed' });
    });
    this.unsubscribeLevel = this.speechController.getAdapter().subscribeAudioLevel(level => {
      if (!level || (this.playing && this.matches(this.playing))) this.options?.onAudioLevel?.(level);
    });
  }

  get capabilities(): SpeechInteractionCapabilities {
    return { ...this.speechController.getAdapter().recognitionStatus,
      continuous: this.speechController.getAdapter().supportsContinuousRecognition, interruption: this.dependencies.automaticBargeIn ? 'headset_vad_unverified' : 'manual',
      lip_sync: 'amplitude' as const };
  }

  /** A binds a fresh task snapshot even when microphone capture is off. Does not start capture. */
  bind(options: SpeechInteractionOptions): void {
    this.capture?.abort(); this.capture = undefined; this.epoch += 1;
    this.options?.onAudioLevel?.(0);
    this.options = { ...options, context: { ...options.context } };
  }

  async start(options: SpeechInteractionOptions): Promise<{ status: 'started' | 'unavailable'; error_code?: string }> {
    if (this.disposed) return { status: 'unavailable', error_code: 'disposed' };
    if (options.mode === 'push_to_talk') await this.interrupt();
    this.bind(options);
    const epoch = this.epoch, snapshot = this.options!;
    const adapter = this.speechController.getAdapter();
    if (options.mode === 'continuous' && !adapter.supportsContinuousRecognition) {
      adapter.recognitionStatus.error_code = 'continuous_not_supported';
      this.emit(snapshot, 'speech.error', { error_code: 'recognition_failed' });
      return { status: 'unavailable', error_code: 'continuous_not_supported' };
    }
    await adapter.refreshAsrCapability();
    if (epoch !== this.epoch || this.disposed) return { status: 'unavailable', error_code: 'stopped' };
    if (!adapter.capabilities.asr) {
      const code = adapter.recognitionStatus.error_code ?? 'asr_not_configured';
      this.emit(snapshot, 'speech.error', { error_code: code === 'asr_not_configured' ? 'asr_not_configured' : 'recognition_failed' });
      return { status: 'unavailable', error_code: code };
    }
    if (epoch !== this.epoch || this.disposed) return { status: 'unavailable', error_code: 'stopped' };
    const capture = new AbortController(); this.capture = capture;
    // Capture has its own request ID so stopping ASR cannot cancel a prefetched TTS operation.
    const request_id = crypto.randomUUID();
    capture.signal.addEventListener('abort', () => { void adapter.stop(request_id); }, { once: true });
    const current = () => this.capture === capture && !capture.signal.aborted && epoch === this.epoch;
    const result = await adapter.start({ request_id, session_id: snapshot.context.session_id, signal: capture.signal }, {
      onText: (text, final) => {
        if (!current() || !text.trim()) return;
        this.emit(snapshot, final ? 'recognition.final' : 'recognition.partial', { text });
      },
      onStart: () => undefined, onEnd: () => undefined,
      onFailure: (_, code) => {
        if (!current()) return;
        this.emit(snapshot, 'speech.error', { error_code: code === 'permission_denied' ? 'permission_denied' : code === 'asr_not_configured' ? 'asr_not_configured' : 'recognition_failed' });
      },
    }, {
      continuous: options.mode === 'continuous',
      canAccept: () => current() && (this.dependencies.automaticBargeIn || (!this.playing && Date.now() >= this.quietUntil)),
      automaticBargeIn: this.dependencies.automaticBargeIn,
      onVoice: () => { if (current() && this.playing) void this.interrupt(); },
    });
    if (!current()) return { status: 'unavailable', error_code: 'stopped' };
    return result.status === 'ready' ? { status: 'started' } : { status: 'unavailable', error_code: result.error_code };
  }

  /** Bind this to an explicit button/key. A handles answer cancellation on the event. */
  async interrupt(): Promise<void> {
    const snapshot = this.options;
    const stopping = this.speechController.stop('cancel');
    this.quietUntil = Date.now() + 800;
    snapshot?.onAudioLevel?.(0);
    if (snapshot) this.emit(snapshot, 'speech.interrupted');
    await stopping;
  }

  async stop(reason: 'user' | 'campus_changed' | 'disposed'): Promise<void> {
    this.epoch += 1;
    this.capture?.abort(); this.capture = undefined;
    const stopping = this.speechController.stop(reason === 'campus_changed' ? 'campus_change' : reason === 'disposed' ? 'clear' : 'user');
    this.options?.onAudioLevel?.(0);
    this.playing = null;
    this.quietUntil = Date.now() + 800;
    await stopping;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true; void this.stop('disposed');
    this.unsubscribe(); this.unsubscribeLevel(); this.unsubscribeProgress();
    if (this.ownsController) this.speechController.dispose();
    this.options = undefined;
  }

  private matches(event: PlaybackEvent): boolean {
    const context = this.options?.context;
    return !!context && event.run.request_id === context.request_id && event.run.session_id === context.session_id
      && event.run.generation_id === context.generation_id && event.run.campus_id === context.campus_id;
  }

  private onPlayback(event: PlaybackEvent): void {
    if (event.type === 'playback.started') this.playing = event;
    else if (this.playing?.utterance_id === event.utterance_id) { this.playing = null; this.quietUntil = Date.now() + 800; }
    if (!this.matches(event)) return;
    const options = this.options!;
    if (event.type !== 'playback.started') options.onAudioLevel?.(0);
    this.emit(options, event.type, { utterance_id: event.utterance_id });
  }

  private emit(options: SpeechInteractionOptions, type: SpeechInteractionEvent['type'], fields: Partial<SpeechInteractionEvent> = {}): void {
    options.onEvent({ ...options.context, event_id: crypto.randomUUID(), timestamp: new Date().toISOString(),
      type, text: null, utterance_id: null, error_code: null, ...fields });
  }
}

export function createSpeechInteractionController(dependencies?: InteractionDependencies): CampusSpeechInteractionController {
  return new CampusSpeechInteractionController(dependencies);
}
