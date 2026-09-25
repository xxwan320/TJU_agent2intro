import { i as __toESM } from "./rolldown-runtime-B-lAHAz2.js";
import { n as roamEnabled, o as vrmManifest, r as setRoamEnabled } from "./roam-BMd-haNA.js";
//#region frontend/src/speech/adapter.ts
async function loadVadModule() {
	return import("./dist-BH898c_6.js").then((m) => /* @__PURE__ */ __toESM(m.default, 1));
}
function safeErrorCode(response, fallback) {
	return response.json().then((body) => body?.error?.code || fallback).catch(() => fallback);
}
function browserRecognitionConstructor() {
	if (typeof window === "undefined") return void 0;
	const speechWindow = window;
	return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
}
function browserTtsAvailable() {
	return typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
}
function now() {
	return typeof performance === "undefined" ? Date.now() : performance.now();
}
function elapsed(startedAt) {
	return Math.round((now() - startedAt) * 10) / 10;
}
/** Settle promptly even if a provider/permission promise ignores AbortSignal. */
function abortable(pending, signal) {
	return new Promise((resolve, reject) => {
		const abort = () => reject(new DOMException("Stopped", "AbortError"));
		pending.then(resolve, reject).finally(() => signal.removeEventListener("abort", abort));
		if (signal.aborted) {
			abort();
			return;
		}
		signal.addEventListener("abort", abort, { once: true });
	});
}
function permissionCode(error) {
	if (error instanceof DOMException && (error.name === "NotAllowedError" || error.name === "SecurityError")) return "permission_denied";
	return "capture_failed";
}
async function waitForBrowserVoices() {
	if (!browserTtsAvailable()) return [];
	const immediate = window.speechSynthesis.getVoices();
	if (immediate.length) return immediate;
	return new Promise((resolve) => {
		const timeout = window.setTimeout(() => finish(), 5e3);
		const finish = () => {
			window.clearTimeout(timeout);
			window.speechSynthesis.removeEventListener("voiceschanged", finish);
			resolve(window.speechSynthesis.getVoices());
		};
		window.speechSynthesis.addEventListener("voiceschanged", finish, { once: true });
	});
}
var CampusSpeechAdapter = class {
	capabilities = {
		asr: false,
		tts: false,
		timestamps: "none"
	};
	recognitionMode;
	get supportsContinuousRecognition() {
		return this.recognitionMode === "server";
	}
	onTrace;
	capture;
	playback;
	player;
	audioContext;
	prepared = /* @__PURE__ */ new Set();
	preparing = /* @__PURE__ */ new Map();
	captureGeneration = 0;
	playbackGeneration = 0;
	volume;
	muted;
	loadVad;
	asrTimeoutMs;
	captureTimeoutMs;
	captureOptions;
	captureAbort;
	levels = /* @__PURE__ */ new Set();
	analyser;
	source;
	levelFrame;
	sounding = false;
	recognitionStatus = {
		configured: false,
		state: "idle",
		error_code: null
	};
	constructor(options = {}) {
		this.recognitionMode = options.recognitionMode ?? "server";
		this.loadVad = options.loadVad ?? loadVadModule;
		this.asrTimeoutMs = options.asrTimeoutMs ?? 35e3;
		this.captureTimeoutMs = options.captureTimeoutMs ?? 2e4;
		this.onTrace = options.onTrace;
		this.volume = Math.max(0, Math.min(1, options.volume ?? 1));
		this.muted = options.muted ?? false;
	}
	/** Must be called from the user's click/keyboard event for the current page session. */
	async activatePlayback() {
		if (typeof Audio === "undefined") return {
			status: "failed",
			error_code: "playback_unsupported"
		};
		this.ensurePlayer();
		let state = "unavailable";
		try {
			const Context = typeof window !== "undefined" ? window.AudioContext ?? window.webkitAudioContext : void 0;
			if (Context) {
				this.audioContext ??= new Context();
				if (this.audioContext.state === "suspended") await this.audioContext.resume();
				state = this.audioContext.state;
				if (state !== "running") throw new Error("audio_context_not_running");
			}
			this.trace("activation", null, null, { audio_context_state: state });
			return { status: "ready" };
		} catch {
			this.trace("error", null, null, {
				audio_context_state: this.audioContext?.state ?? state,
				code: "playback_activation_failed"
			});
			return {
				status: "failed",
				error_code: "playback_activation_failed"
			};
		}
	}
	setOutput(volume, muted) {
		this.volume = Math.max(0, Math.min(1, volume));
		this.muted = muted;
		if (muted || this.volume === 0) this.emitLevel(0);
		if (this.player) {
			this.player.volume = this.volume;
			this.player.muted = this.muted;
		}
	}
	dispose() {
		this.stopCapture();
		this.cancelPlayback();
		for (const controller of this.preparing.keys()) controller.abort();
		this.preparing.clear();
		for (const item of [...this.prepared]) this.releasePrepared(item);
		if (this.audioContext && this.audioContext.state !== "closed") this.audioContext.close();
		this.stopLevels();
		this.source?.disconnect();
		this.analyser?.disconnect();
		this.source = void 0;
		this.analyser = void 0;
		this.levels.clear();
		this.audioContext = void 0;
		this.player = void 0;
	}
	subscribeAudioLevel(callback) {
		this.levels.add(callback);
		return () => this.levels.delete(callback);
	}
	async start(context, callbacks, options) {
		const stopping = this.stopCapture();
		const generation = this.captureGeneration;
		await stopping;
		if (generation !== this.captureGeneration) return {
			status: "failed",
			error_code: "stopped"
		};
		this.captureOptions = options;
		if (!options?.continuous) this.cancelPlayback();
		if (context.signal.aborted) return {
			status: "failed",
			error_code: "stopped"
		};
		return this.recognitionMode === "browser" ? this.startBrowserRecognition(context, callbacks) : this.startServerRecognition(context, callbacks);
	}
	async stop(requestId) {
		const stoppedCapture = !!this.capture && this.capture.requestId === requestId;
		const stoppedPlayback = !!this.playback && this.playback.requestId === requestId;
		if (stoppedPlayback) this.cancelPlayback();
		const stoppingCapture = stoppedCapture ? this.stopCapture() : Promise.resolve();
		for (const [controller, preparingRequestId] of this.preparing) if (preparingRequestId === requestId) controller.abort();
		for (const item of [...this.prepared]) if (item.requestId === requestId) this.releasePrepared(item);
		const stopController = new AbortController();
		const stopTimeout = setTimeout(() => stopController.abort(), 5e3);
		try {
			await stoppingCapture;
			const sessionId = this.lastSessionByRequest.get(requestId);
			if (!sessionId) return {
				local_stopped: true,
				upstream_stop: "not_started"
			};
			const response = await fetch("/api/speech/stop", {
				method: "POST",
				signal: stopController.signal,
				headers: { "content-type": "application/json" },
				body: JSON.stringify({
					request_id: requestId,
					session_id: sessionId
				})
			});
			if (!response.ok) return {
				local_stopped: true,
				upstream_stop: "unconfirmed"
			};
			const body = await response.json();
			return {
				local_stopped: stoppedCapture || stoppedPlayback || body.local_stopped,
				upstream_stop: body.upstream_stop
			};
		} catch {
			return {
				local_stopped: true,
				upstream_stop: "unconfirmed"
			};
		} finally {
			clearTimeout(stopTimeout);
		}
	}
	async speak(context, utteranceId, text, voiceId, callbacks) {
		this.remember(context);
		if (context.signal.aborted) return {
			status: "failed",
			error_code: "stopped"
		};
		const prepared = await this.prepareSpeech(context, utteranceId, text, voiceId);
		if ("status" in prepared) {
			if (prepared.error_code !== "stopped") callbacks.onFailure(utteranceId, prepared.error_code ?? "tts_unavailable");
			return prepared;
		}
		return this.playPreparedSpeech(prepared, callbacks);
	}
	async prepareSpeech(context, utteranceId, text, voiceId) {
		this.remember(context);
		if (context.signal.aborted) return {
			status: "failed",
			error_code: "stopped"
		};
		this.trace("text_received", context.request_id, utteranceId, { chars: [...text].length });
		if (voiceId.startsWith("browser:")) {
			const item = {
				requestId: context.request_id,
				utteranceId,
				context,
				text,
				voiceId,
				kind: "browser",
				released: false
			};
			this.prepared.add(item);
			return item;
		}
		return this.prepareServerSpeech(context, utteranceId, text, voiceId);
	}
	async playPreparedSpeech(prepared, callbacks) {
		if (prepared.released || prepared.context.signal.aborted) return {
			status: "failed",
			error_code: "stopped"
		};
		if (!this.captureOptions?.continuous) await this.stopCapture();
		if (prepared.released || prepared.context.signal.aborted) return {
			status: "failed",
			error_code: "stopped"
		};
		this.cancelPlayback();
		if (prepared.kind === "browser") {
			this.prepared.delete(prepared);
			prepared.released = true;
			return this.speakWithBrowser(prepared.context, prepared.utteranceId, prepared.text, prepared.voiceId.slice(8), callbacks);
		}
		return this.playPreparedServerSpeech(prepared, callbacks);
	}
	pausePlayback() {
		return this.playback?.pause?.() ?? false ? { status: "ready" } : {
			status: "failed",
			error_code: "nothing_playing"
		};
	}
	async resumePlayback() {
		if (!this.playback?.resume) return {
			status: "failed",
			error_code: "nothing_to_resume"
		};
		return this.playback.resume();
	}
	releasePrepared(prepared) {
		if (prepared.released) return;
		prepared.released = true;
		this.prepared.delete(prepared);
		if (prepared.objectUrl) URL.revokeObjectURL(prepared.objectUrl);
	}
	async listVoices() {
		const [voices] = await Promise.all([this.listServerVoices(), this.refreshAsrCapability()]);
		this.capabilities.tts = voices.length > 0;
		return voices;
	}
	lastSessionByRequest = /* @__PURE__ */ new Map();
	remember(context) {
		this.lastSessionByRequest.set(context.request_id, context.session_id);
		if (this.lastSessionByRequest.size > 128) {
			const oldest = this.lastSessionByRequest.keys().next().value;
			if (oldest) this.lastSessionByRequest.delete(oldest);
		}
	}
	async startServerRecognition(context, callbacks) {
		this.remember(context);
		const options = this.captureOptions;
		const generation = ++this.captureGeneration;
		const controller = new AbortController();
		this.captureAbort = controller;
		const current = () => generation === this.captureGeneration && !context.signal.aborted && !controller.signal.aborted;
		const fail = (code) => {
			if (!current()) return;
			this.recognitionStatus.state = "error";
			this.recognitionStatus.error_code = code;
			callbacks.onFailure(context.request_id, code);
			if (current()) this.stopCapture();
		};
		if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
			fail("capture_unsupported");
			return {
				status: "failed",
				error_code: "capture_unsupported"
			};
		}
		let vad;
		let stream;
		let busy = false, contaminated = false, trustedMs = 0, voiced = false;
		let segmentTimer;
		const abort = () => {
			if (generation === this.captureGeneration) this.stopCapture();
		};
		context.signal.addEventListener("abort", abort, { once: true });
		const stopTracks = () => stream?.getTracks().forEach((track) => track.stop());
		const initialTimer = setTimeout(() => fail("capture_timeout"), this.captureTimeoutMs);
		this.capture = {
			requestId: context.request_id,
			generation,
			removeAbort: () => context.signal.removeEventListener("abort", abort),
			stop: async () => {
				controller.abort();
				clearTimeout(initialTimer);
				clearTimeout(segmentTimer);
				stopTracks();
				await vad?.destroy();
			}
		};
		this.recognitionStatus.state = "starting";
		this.recognitionStatus.error_code = null;
		try {
			const module = await abortable(this.loadVad(), controller.signal);
			if (!current()) return {
				status: "failed",
				error_code: "stopped"
			};
			const pending = module.MicVAD.new({
				model: "v5",
				baseAssetPath: "/vendor/vad/",
				onnxWASMBasePath: "/vendor/ort/",
				startOnLoad: true,
				positiveSpeechThreshold: .85,
				negativeSpeechThreshold: .65,
				minSpeechMs: 480,
				redemptionMs: 650,
				preSpeechPadMs: 250,
				getStream: async () => {
					const acquired = await navigator.mediaDevices.getUserMedia({ audio: {
						channelCount: 1,
						echoCancellation: true,
						noiseSuppression: true,
						autoGainControl: true
					} });
					if (!current()) {
						acquired.getTracks().forEach((track) => track.stop());
						throw new DOMException("Stopped", "AbortError");
					}
					stream = acquired;
					return acquired;
				},
				pauseStream: async () => {
					stopTracks();
				},
				onSpeechStart: () => {
					if (!current()) return;
					contaminated = busy || !(options?.canAccept?.() ?? true);
					trustedMs = 0;
					voiced = false;
					clearTimeout(segmentTimer);
					segmentTimer = setTimeout(() => fail("audio_too_long"), 29e3);
				},
				onFrameProcessed: (probabilities, frame) => {
					if (!current()) return;
					if (!(options?.canAccept?.() ?? true)) contaminated = true;
					const rms = Math.sqrt(frame.reduce((sum, value) => sum + value * value, 0) / Math.max(1, frame.length));
					trustedMs = probabilities.isSpeech >= .9 && rms >= .025 ? trustedMs + frame.length / 16 : 0;
					if (!contaminated && !busy && !voiced && trustedMs >= 480) {
						voiced = true;
						if (options?.automaticBargeIn && stream?.getAudioTracks()[0]?.getSettings().echoCancellation === true) options.onVoice?.();
					}
				},
				onVADMisfire: () => {
					clearTimeout(segmentTimer);
					trustedMs = 0;
				},
				onSpeechEnd: (audio) => {
					clearTimeout(segmentTimer);
					if (!current() || busy || contaminated || !(options?.canAccept?.() ?? true)) return;
					busy = true;
					this.submitAudio(context, generation, audio, callbacks, controller.signal).finally(() => {
						busy = false;
					});
				}
			});
			pending.then(async (instance) => {
				if (!current()) await instance.destroy();
			}, () => void 0);
			vad = await abortable(pending, controller.signal);
			clearTimeout(initialTimer);
			if (!current()) {
				await vad.destroy();
				return {
					status: "failed",
					error_code: "stopped"
				};
			}
			this.recognitionStatus.state = "listening";
			if (!options?.continuous) segmentTimer = setTimeout(() => fail("capture_timeout"), this.captureTimeoutMs);
			return { status: "ready" };
		} catch (error) {
			stopTracks();
			if (!current()) return {
				status: "failed",
				error_code: this.recognitionStatus.error_code ?? "stopped"
			};
			const code = permissionCode(error);
			fail(code);
			return {
				status: "failed",
				error_code: code
			};
		}
	}
	async submitAudio(context, generation, audio, callbacks, captureSignal) {
		const current = () => generation === this.captureGeneration && !context.signal.aborted && !captureSignal.aborted;
		if (!current()) return;
		const controller = new AbortController();
		const abort = () => controller.abort();
		captureSignal.addEventListener("abort", abort, { once: true });
		let timedOut = false;
		const timeout = setTimeout(() => {
			timedOut = true;
			controller.abort();
		}, this.asrTimeoutMs);
		const fail = (code) => {
			if (!current()) return;
			this.recognitionStatus.state = "error";
			this.recognitionStatus.error_code = code;
			callbacks.onFailure(context.request_id, code);
			if (current()) this.stopCapture();
		};
		try {
			if (!audio.length || audio.length > 48e4) {
				fail("audio_too_long");
				return;
			}
			const vad = await abortable(this.loadVad(), controller.signal);
			if (!current() || controller.signal.aborted) return;
			const wav = vad.utils.encodeWAV(audio, 1, 16e3, 1, 16);
			this.recognitionStatus.state = "recognizing";
			const response = await abortable(fetch("/api/speech/asr", {
				method: "POST",
				headers: { "content-type": "application/json" },
				signal: controller.signal,
				body: JSON.stringify({
					request_id: context.request_id,
					session_id: context.session_id,
					audio: {
						encoding: "base64",
						mime_type: "audio/wav",
						sample_rate_hz: 16e3,
						channels: 1,
						audio_base64: vad.utils.arrayBufferToBase64(wav)
					}
				})
			}), controller.signal);
			if (!current()) return;
			if (!response.ok) {
				fail(await abortable(safeErrorCode(response, "asr_unavailable"), controller.signal));
				return;
			}
			const body = await abortable(response.json(), controller.signal);
			if (!current()) return;
			if (body.request_id !== context.request_id || typeof body.text !== "string" || !body.text.trim() || body.text.length > 8e3 || body.is_final !== true) {
				fail("invalid_asr_response");
				return;
			}
			this.capabilities.asr = true;
			this.recognitionStatus.state = "listening";
			callbacks.onText(body.text.trim(), true);
		} catch {
			fail(timedOut ? "asr_timeout" : "asr_unavailable");
		} finally {
			clearTimeout(timeout);
			captureSignal.removeEventListener("abort", abort);
			if (current() && !this.captureOptions?.continuous) await this.stopCapture();
		}
	}
	async startBrowserRecognition(context, callbacks) {
		this.remember(context);
		const Recognition = browserRecognitionConstructor();
		if (!Recognition) {
			callbacks.onFailure(context.request_id, "browser_asr_unsupported");
			return {
				status: "failed",
				error_code: "browser_asr_unsupported"
			};
		}
		const generation = ++this.captureGeneration;
		const recognition = new Recognition();
		recognition.lang = "zh-CN";
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
			if (event.error === "not-allowed") this.capabilities.asr = false;
			callbacks.onFailure(context.request_id, event.error === "not-allowed" ? "permission_denied" : "browser_asr_failed");
		};
		recognition.onend = () => {
			if (this.capture?.generation !== generation) return;
			this.capture.removeAbort();
			this.capture = void 0;
		};
		const abort = () => void this.stopCapture();
		context.signal.addEventListener("abort", abort, { once: true });
		this.capture = {
			requestId: context.request_id,
			generation,
			stop: async () => recognition.abort(),
			removeAbort: () => context.signal.removeEventListener("abort", abort)
		};
		try {
			recognition.start();
			this.capabilities.asr = true;
			return { status: "ready" };
		} catch (error) {
			await this.stopCapture();
			const code = permissionCode(error);
			callbacks.onFailure(context.request_id, code);
			return {
				status: "failed",
				error_code: code
			};
		}
	}
	async prepareServerSpeech(context, utteranceId, text, voiceId) {
		const controller = new AbortController();
		this.preparing.set(controller, context.request_id);
		const abort = () => controller.abort();
		context.signal.addEventListener("abort", abort, { once: true });
		const startedAt = now();
		try {
			const response = await fetch("/api/speech/tts", {
				method: "POST",
				headers: { "content-type": "application/json" },
				signal: controller.signal,
				body: JSON.stringify({
					request_id: context.request_id,
					session_id: context.session_id,
					utterance_id: utteranceId,
					text,
					voice_id: voiceId
				})
			});
			const responseType = response.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase() ?? "";
			this.trace("tts_response", context.request_id, utteranceId, {
				elapsed_ms: elapsed(startedAt),
				status: response.status,
				content_type: responseType || null
			});
			if (context.signal.aborted || controller.signal.aborted) return {
				status: "failed",
				error_code: "stopped"
			};
			if (!response.ok) {
				const code = await safeErrorCode(response, "tts_unavailable");
				this.trace("error", context.request_id, utteranceId, {
					elapsed_ms: elapsed(startedAt),
					code
				});
				return {
					status: "failed",
					error_code: code
				};
			}
			if (responseType !== "application/json") throw new Error("invalid_tts_content_type");
			const body = await response.json();
			if (body.request_id !== context.request_id || body.utterance_id !== utteranceId || !body.audio_url.startsWith("/api/speech/audio/") || !body.mime_type.startsWith("audio/")) throw new Error("invalid_tts_response");
			const audioStartedAt = now();
			const audioResponse = await fetch(body.audio_url, {
				signal: controller.signal,
				headers: { accept: "audio/*" }
			});
			const audioType = audioResponse.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase() ?? "";
			if (!audioResponse.ok) {
				this.trace("audio_response", context.request_id, utteranceId, {
					elapsed_ms: elapsed(audioStartedAt),
					status: audioResponse.status,
					content_type: audioType || null
				});
				return {
					status: "failed",
					error_code: "audio_fetch_failed"
				};
			}
			if (!audioType.startsWith("audio/")) throw new Error("invalid_audio_content_type");
			const audioBytes = await audioResponse.arrayBuffer();
			this.trace("audio_response", context.request_id, utteranceId, {
				elapsed_ms: elapsed(audioStartedAt),
				status: audioResponse.status,
				content_type: audioType,
				bytes: audioBytes.byteLength
			});
			if (audioBytes.byteLength === 0) throw new Error("empty_audio");
			if (context.signal.aborted || controller.signal.aborted) return {
				status: "failed",
				error_code: "stopped"
			};
			const decodeStartedAt = now();
			if (this.audioContext) await this.audioContext.decodeAudioData(audioBytes.slice(0));
			this.trace("decode", context.request_id, utteranceId, {
				elapsed_ms: elapsed(decodeStartedAt),
				bytes: audioBytes.byteLength,
				audio_context_state: this.audioContext?.state ?? "unavailable"
			});
			if (context.signal.aborted || controller.signal.aborted) return {
				status: "failed",
				error_code: "stopped"
			};
			const blob = new Blob([audioBytes], { type: audioType });
			const item = {
				requestId: context.request_id,
				utteranceId,
				context,
				text,
				voiceId,
				kind: "server",
				objectUrl: URL.createObjectURL(blob),
				released: false
			};
			this.prepared.add(item);
			this.capabilities.tts = true;
			return item;
		} catch (error) {
			const code = context.signal.aborted || controller.signal.aborted || error instanceof DOMException && error.name === "AbortError" ? "stopped" : error instanceof Error && error.message === "empty_audio" ? "tts_empty_audio" : error instanceof Error && error.message.includes("content_type") ? "tts_invalid_content_type" : error instanceof Error && error.message === "invalid_tts_response" ? "invalid_tts_response" : "audio_decode_failed";
			this.trace("error", context.request_id, utteranceId, {
				elapsed_ms: elapsed(startedAt),
				code
			});
			return {
				status: "failed",
				error_code: code
			};
		} finally {
			this.preparing.delete(controller);
			context.signal.removeEventListener("abort", abort);
		}
	}
	async playPreparedServerSpeech(prepared, callbacks) {
		if (typeof Audio === "undefined" || !prepared.objectUrl) {
			this.releasePrepared(prepared);
			callbacks.onFailure(prepared.utteranceId, "playback_unsupported");
			return {
				status: "failed",
				error_code: "playback_unsupported"
			};
		}
		const audio = this.ensurePlayer();
		const generation = ++this.playbackGeneration;
		const startedAt = now();
		let blocked = false;
		const abort = () => {
			if (this.playback?.generation === generation) this.cancelPlayback();
		};
		prepared.context.signal.addEventListener("abort", abort, { once: true });
		const cleanup = (release = true) => {
			prepared.context.signal.removeEventListener("abort", abort);
			if (generation === this.playbackGeneration) {
				audio.onplaying = null;
				audio.onended = null;
				audio.onerror = null;
				audio.onpause = null;
				audio.onwaiting = null;
				this.stopLevels();
			}
			if (release) this.releasePrepared(prepared);
			if (this.playback?.generation === generation) this.playback = void 0;
		};
		const resume = async () => {
			try {
				this.trace("play_request", prepared.requestId, prepared.utteranceId, {
					elapsed_ms: elapsed(startedAt),
					volume: audio.volume,
					muted: audio.muted,
					audio_context_state: this.audioContext?.state ?? "unavailable"
				});
				if (this.audioContext?.state === "suspended") await this.audioContext.resume();
				if (generation !== this.playbackGeneration || prepared.context.signal.aborted) return {
					status: "failed",
					error_code: "stopped"
				};
				await audio.play();
				if (generation !== this.playbackGeneration || prepared.context.signal.aborted) return {
					status: "failed",
					error_code: "stopped"
				};
				blocked = false;
				this.trace("play_resolved", prepared.requestId, prepared.utteranceId, { elapsed_ms: elapsed(startedAt) });
				return { status: "ready" };
			} catch (error) {
				if (generation !== this.playbackGeneration || prepared.context.signal.aborted) return {
					status: "failed",
					error_code: "stopped"
				};
				const code = error instanceof DOMException && error.name === "NotAllowedError" ? "playback_permission_denied" : "playback_failed";
				blocked = code === "playback_permission_denied";
				this.trace("error", prepared.requestId, prepared.utteranceId, {
					elapsed_ms: elapsed(startedAt),
					code
				});
				callbacks.onFailure(prepared.utteranceId, code);
				if (!blocked) cleanup();
				return {
					status: "failed",
					error_code: code
				};
			}
		};
		audio.preload = "auto";
		audio.volume = this.volume;
		audio.muted = this.muted;
		audio.src = prepared.objectUrl;
		audio.load();
		audio.onplaying = () => {
			if (generation !== this.playbackGeneration) return;
			this.startLevels();
			this.trace("playing", prepared.requestId, prepared.utteranceId, {
				elapsed_ms: elapsed(startedAt),
				volume: audio.volume,
				muted: audio.muted,
				audio_context_state: this.audioContext?.state ?? "unavailable"
			});
			callbacks.onStart(prepared.utteranceId);
		};
		audio.onpause = audio.onwaiting = () => {
			if (generation === this.playbackGeneration) this.stopLevels();
		};
		audio.onended = () => {
			if (generation !== this.playbackGeneration) return;
			this.trace("ended", prepared.requestId, prepared.utteranceId, { elapsed_ms: elapsed(startedAt) });
			cleanup();
			callbacks.onEnd(prepared.utteranceId);
		};
		audio.onerror = () => {
			if (generation !== this.playbackGeneration || blocked) return;
			this.trace("error", prepared.requestId, prepared.utteranceId, {
				elapsed_ms: elapsed(startedAt),
				code: "playback_failed"
			});
			cleanup();
			callbacks.onFailure(prepared.utteranceId, "playback_failed");
		};
		this.playback = {
			requestId: prepared.requestId,
			generation,
			stop: () => {
				this.stopLevels();
				audio.pause();
				audio.removeAttribute("src");
				audio.load();
				cleanup();
			},
			removeAbort: () => prepared.context.signal.removeEventListener("abort", abort),
			pause: () => {
				if (audio.paused || audio.ended) return false;
				this.stopLevels();
				audio.pause();
				this.trace("paused", prepared.requestId, prepared.utteranceId, { elapsed_ms: elapsed(startedAt) });
				return true;
			},
			resume
		};
		return resume();
	}
	async speakWithBrowser(context, utteranceId, text, voiceUri, callbacks) {
		if (!browserTtsAvailable()) {
			callbacks.onFailure(utteranceId, "browser_tts_unsupported");
			return {
				status: "failed",
				error_code: "browser_tts_unsupported"
			};
		}
		const generation = ++this.playbackGeneration;
		const startedAt = now();
		const abort = () => this.cancelPlayback();
		context.signal.addEventListener("abort", abort, { once: true });
		this.playback = {
			requestId: context.request_id,
			generation,
			stop: () => window.speechSynthesis.cancel(),
			removeAbort: () => context.signal.removeEventListener("abort", abort),
			pause: () => {
				if (!window.speechSynthesis.speaking || window.speechSynthesis.paused) return false;
				window.speechSynthesis.pause();
				this.trace("paused", context.request_id, utteranceId, { elapsed_ms: elapsed(startedAt) });
				return true;
			},
			resume: async () => {
				if (!window.speechSynthesis.paused) return {
					status: "failed",
					error_code: "nothing_to_resume"
				};
				window.speechSynthesis.resume();
				return { status: "ready" };
			}
		};
		const voices = await waitForBrowserVoices();
		if (generation !== this.playbackGeneration || context.signal.aborted) return {
			status: "failed",
			error_code: "stopped"
		};
		const voice = voices.find((item) => item.voiceURI === voiceUri && item.lang.toLowerCase().startsWith("zh"));
		if (!voice) {
			this.playback?.removeAbort();
			this.playback = void 0;
			callbacks.onFailure(utteranceId, "voice_unavailable");
			return {
				status: "failed",
				error_code: "voice_unavailable"
			};
		}
		const utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = voice.lang;
		utterance.voice = voice;
		utterance.onstart = () => {
			if (generation === this.playbackGeneration) {
				this.trace("playing", context.request_id, utteranceId, { elapsed_ms: elapsed(startedAt) });
				callbacks.onStart(utteranceId);
			}
		};
		utterance.onresume = () => {
			if (generation === this.playbackGeneration) callbacks.onStart(utteranceId);
		};
		utterance.onend = () => {
			if (generation !== this.playbackGeneration) return;
			this.playback?.removeAbort();
			this.playback = void 0;
			this.trace("ended", context.request_id, utteranceId, { elapsed_ms: elapsed(startedAt) });
			callbacks.onEnd(utteranceId);
		};
		utterance.onerror = () => {
			if (generation !== this.playbackGeneration) return;
			this.playback?.removeAbort();
			this.playback = void 0;
			this.trace("error", context.request_id, utteranceId, {
				elapsed_ms: elapsed(startedAt),
				code: "playback_failed"
			});
			callbacks.onFailure(utteranceId, "playback_failed");
		};
		this.trace("play_request", context.request_id, utteranceId, { elapsed_ms: elapsed(startedAt) });
		window.speechSynthesis.speak(utterance);
		this.capabilities.tts = true;
		return { status: "ready" };
	}
	async refreshAsrCapability() {
		if (this.recognitionMode === "browser") {
			this.capabilities.asr = !!browserRecognitionConstructor();
			this.recognitionStatus.configured = this.capabilities.asr;
			this.recognitionStatus.error_code = this.capabilities.asr ? null : "browser_asr_unsupported";
			return;
		}
		const controller = new AbortController();
		const timeout = window.setTimeout(() => controller.abort(), 4e3);
		try {
			const response = await fetch("/api/health", { signal: controller.signal });
			this.capabilities.asr = response.ok && (await response.json()).capabilities?.asr === true;
			this.recognitionStatus.configured = this.capabilities.asr;
			this.recognitionStatus.error_code = response.ok ? this.capabilities.asr ? null : "asr_not_configured" : "asr_unavailable";
		} catch {
			this.capabilities.asr = false;
			this.recognitionStatus.configured = false;
			this.recognitionStatus.error_code = "asr_unavailable";
		} finally {
			window.clearTimeout(timeout);
		}
	}
	async listServerVoices() {
		const controller = new AbortController();
		const timeout = window.setTimeout(() => controller.abort(), 15e3);
		try {
			const response = await fetch("/api/speech/voices", { signal: controller.signal });
			if (!response.ok) return [];
			const body = await response.json();
			return body.status === "ready" ? body.voices : [];
		} catch {
			return [];
		} finally {
			window.clearTimeout(timeout);
		}
	}
	async stopCapture() {
		const capture = this.capture;
		this.capture = void 0;
		this.captureAbort?.abort();
		this.captureAbort = void 0;
		this.captureGeneration += 1;
		if (this.recognitionStatus.state !== "error") this.recognitionStatus.state = "idle";
		if (!capture) return;
		capture.removeAbort();
		try {
			await capture.stop();
		} catch {}
	}
	emitLevel(level) {
		for (const callback of this.levels) callback(level);
	}
	stopLevels() {
		this.sounding = false;
		if (this.levelFrame !== void 0) cancelAnimationFrame(this.levelFrame);
		this.levelFrame = void 0;
		this.emitLevel(0);
	}
	startLevels() {
		this.stopLevels();
		if (!this.audioContext || !this.player || typeof requestAnimationFrame === "undefined") return;
		try {
			if (!this.source) {
				this.analyser = this.audioContext.createAnalyser();
				this.analyser.fftSize = 512;
				this.source = this.audioContext.createMediaElementSource(this.player);
				this.source.connect(this.analyser);
				this.analyser.connect(this.audioContext.destination);
			}
			this.sounding = true;
			const samples = new Float32Array(this.analyser.fftSize);
			const tick = () => {
				if (!this.sounding) return;
				this.analyser.getFloatTimeDomainData(samples);
				const rms = Math.sqrt(samples.reduce((sum, value) => sum + value * value, 0) / samples.length);
				const audible = !this.player.muted && !this.player.paused && !this.player.ended && this.audioContext?.state === "running";
				this.emitLevel(audible ? Math.min(1, Math.max(0, rms - .008) * 6 * this.player.volume) : 0);
				this.levelFrame = requestAnimationFrame(tick);
			};
			tick();
		} catch {
			this.stopLevels();
		}
	}
	ensurePlayer() {
		this.player ??= new Audio();
		this.player.preload = "auto";
		this.player.volume = this.volume;
		this.player.muted = this.muted;
		return this.player;
	}
	trace(stage, requestId, utteranceId, values = {}) {
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
			code: values.code ?? null
		});
	}
	cancelPlayback() {
		const playback = this.playback;
		this.stopLevels();
		this.playback = void 0;
		this.playbackGeneration += 1;
		if (!playback) return;
		playback.removeAbort();
		playback.stop();
		this.trace("stopped", playback.requestId, null, {});
	}
};
function createSpeechAdapter(options) {
	return new CampusSpeechAdapter(options);
}
//#endregion
//#region frontend/src/speech/controller.ts
var MAX_SEGMENTS = 64;
var MAX_RUN_CHARS = 23e3;
var MAX_SEGMENT_CHARS = 4e3;
var MAX_PENDING_CONSTRUCT_CHARS = 4096;
var BRIEF_CHARS = 220;
var BRIEF_SENTENCES = 2;
var SHORT_SEGMENT_CHARS = 28;
function cleanLines(text) {
	const lines = text.replace(/\r\n?/g, "\n").split("\n");
	const kept = [];
	for (const source of lines) {
		const line = source.trim();
		if (!line) continue;
		if (/^(?:#{1,6}\s*)?(?:来源|参考(?:资料|文献)?|sources?|references?)\s*[:：]?\s*$/iu.test(line)) break;
		if (/^(?:来源|参考(?:资料|文献)?|sources?|references?)\s*[:：]/iu.test(line)) continue;
		const withoutList = line.replace(/^#{1,6}\s*/, "").replace(/^(?:[-+*•>]|\d{1,3}[.)、]|[（(]?[一二三四五六七八九十]+[）).、])\s*/, "").replace(/[*_~]+/g, "").trim();
		if (withoutList) kept.push(withoutList);
	}
	return kept.join("。").replace(/\s+/g, " ").replace(/。{2,}/g, "。").replace(/\s+([，。！？；：,.!?;:])/g, "$1").trim();
}
/** Deterministic Markdown-to-speech transform. It never returns a URL or code body. */
function sanitizeSpeechText(raw, final = true) {
	let output = "";
	let index = 0;
	let pendingAt = -1;
	const lower = raw.toLowerCase();
	while (index < raw.length) {
		if (raw.startsWith("```", index)) {
			const end = raw.indexOf("```", index + 3);
			if (end < 0) {
				if (!final) pendingAt = index;
				break;
			}
			index = end < 0 ? raw.length : end + 3;
			continue;
		}
		if (raw[index] === "`") {
			const end = raw.indexOf("`", index + 1);
			if (end < 0) {
				if (!final) pendingAt = index;
				break;
			}
			index = end < 0 ? raw.length : end + 1;
			continue;
		}
		if (!final && raw[index] === "!" && index === raw.length - 1) {
			pendingAt = index;
			break;
		}
		if (raw.startsWith("![", index)) {
			const labelEnd = raw.indexOf("]", index + 2);
			const urlStart = labelEnd >= 0 && raw[labelEnd + 1] === "(" ? labelEnd + 2 : -1;
			const urlEnd = urlStart >= 0 ? raw.indexOf(")", urlStart) : -1;
			if (labelEnd < 0 || urlStart < 0 || urlEnd < 0) {
				if (!final) pendingAt = index;
				break;
			}
			index = urlEnd + 1;
			continue;
		}
		if (raw[index] === "[") {
			const labelEnd = raw.indexOf("]", index + 1);
			if (labelEnd < 0) {
				if (!final) pendingAt = index;
				break;
			}
			if (!final && labelEnd === raw.length - 1) {
				pendingAt = index;
				break;
			}
			const label = raw.slice(index + 1, labelEnd);
			if (/^source:/i.test(label)) {
				index = labelEnd + 1;
				continue;
			}
			if (raw[labelEnd + 1] === "(") {
				const urlEnd = raw.indexOf(")", labelEnd + 2);
				if (urlEnd < 0) {
					if (!final) pendingAt = index;
					break;
				}
				output += label;
				index = urlEnd + 1;
				continue;
			}
			if (/^\s*\d+(?:\s*[-,，]\s*\d+)*\s*$/.test(label)) {
				index = labelEnd + 1;
				continue;
			}
		}
		if (raw[index] === "【") {
			const end = raw.indexOf("】", index + 1);
			if (end < 0) {
				if (!final) pendingAt = index;
				break;
			}
			if (/^\s*\d+(?:\s*[-,，]\s*\d+)*\s*$/.test(raw.slice(index + 1, end))) {
				index = end + 1;
				continue;
			}
		}
		if (raw[index] === "<") {
			const end = raw.indexOf(">", index + 1);
			if (end < 0) {
				if (!final) pendingAt = index;
				break;
			}
			index = end < 0 ? raw.length : end + 1;
			continue;
		}
		if (lower.startsWith("https://", index) || lower.startsWith("http://", index) || lower.startsWith("www.", index)) {
			let end = index;
			while (end < raw.length && !/[\s，。！？；、）】}>]/u.test(raw[end])) end += 1;
			if (end === raw.length && !final) {
				pendingAt = index;
				break;
			}
			index = end;
			continue;
		}
		output += raw[index];
		index += 1;
	}
	return {
		text: cleanLines(output),
		pendingRawChars: pendingAt < 0 ? 0 : raw.length - pendingAt
	};
}
/** Only call after the UI has established that the user explicitly asked to hear a URL verbatim. */
function sanitizeExplicitUrlSpeechText(raw) {
	return cleanLines(raw.replace(/\[source:[^\]]*(?:\]|$)/gi, "").replace(/```[\s\S]*?(?:```|$)/g, "").replace(/`[^`]*(?:`|$)/g, "").replace(/!\[[^\]]*\]\([^)]*(?:\)|$)/g, "").replace(/<[^>]*(?:>|$)/g, "").replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/giu, "$1，$2").replace(/\[(?:\s*\d+(?:\s*[-,，]\s*\d+)*)\]|【(?:\s*\d+(?:\s*[-,，]\s*\d+)*)】/g, ""));
}
function sentenceEnds(text, from) {
	const ends = [];
	const pattern = /[。！？!?；;](?:[”’）】])?/gu;
	pattern.lastIndex = from;
	for (let match = pattern.exec(text); match; match = pattern.exec(text)) ends.push(pattern.lastIndex);
	return ends;
}
function splitBounded(text) {
	if ([...text].length <= MAX_SEGMENT_CHARS) return [text];
	const result = [];
	let rest = text;
	while ([...rest].length > MAX_SEGMENT_CHARS) {
		const chars = [...rest];
		let cut = MAX_SEGMENT_CHARS;
		for (let i = 3999; i >= Math.max(1, 3500); i -= 1) if (/[，、；;。！？!?\s]/u.test(chars[i])) {
			cut = i + 1;
			break;
		}
		result.push(chars.slice(0, cut).join("").trim());
		rest = chars.slice(cut).join("").trim();
	}
	if (rest) result.push(rest);
	return result.filter(Boolean);
}
var IncrementalSpeechSanitizer = class {
	raw = "";
	consumed = 0;
	emittedPrefix = "";
	append(chunk) {
		this.raw += chunk;
		if ([...this.raw].length > MAX_RUN_CHARS) throw new Error("speech_queue_overflow");
		const parsed = sanitizeSpeechText(this.raw, false);
		if (parsed.pendingRawChars > MAX_PENDING_CONSTRUCT_CHARS) throw new Error("speech_sanitizer_limit");
		return this.take(parsed.text, false);
	}
	finish(finalText) {
		if ([...finalText].length > MAX_RUN_CHARS) throw new Error("speech_queue_overflow");
		const parsed = sanitizeSpeechText(finalText, true);
		if (this.emittedPrefix && !parsed.text.startsWith(this.emittedPrefix)) throw new Error("speech_final_mismatch");
		this.raw = finalText;
		return this.take(parsed.text, true);
	}
	take(text, final) {
		if (this.consumed > text.length || !text.startsWith(this.emittedPrefix)) throw new Error("speech_final_mismatch");
		const ends = sentenceEnds(text, this.consumed);
		const segments = [];
		let start = this.consumed;
		for (const end of ends) {
			const candidate = text.slice(start, end).trim();
			if (!candidate) {
				start = end;
				continue;
			}
			if (!final && [...candidate].length < SHORT_SEGMENT_CHARS && end === ends.at(-1) && end === text.length) break;
			if ([...candidate].length < SHORT_SEGMENT_CHARS && end !== ends.at(-1)) continue;
			segments.push(...splitBounded(candidate));
			start = end;
		}
		if (final) {
			const tail = text.slice(start).trim();
			if (tail) segments.push(...splitBounded(tail));
			start = text.length;
		}
		this.consumed = start;
		this.emittedPrefix = text.slice(0, this.consumed);
		return segments;
	}
};
var SPEECH_ERROR_MESSAGES = {
	speech_not_enabled: "请先点击开启语音；本页面尚未取得播放权限。",
	playback_permission_denied: "浏览器拦截了播放，请点击继续播报。",
	playback_activation_failed: "播放器未能恢复，请检查网页声音权限后重试。",
	tts_unavailable: "语音合成服务暂时不可用，文字答案仍可阅读，请稍后重试。",
	tts_empty_audio: "语音服务返回了空音频，文字答案仍可阅读，请重试。",
	audio_decode_failed: "浏览器无法解码这段音频，请重试或改用浏览器中文音色。",
	audio_fetch_failed: "音频文件未能取回，文字答案仍可阅读，请重试。",
	playback_failed: "浏览器播放失败，文字答案仍可阅读，请重试。",
	voice_unavailable: "所选中文音色当前不可用，请重新选择后重试。",
	speech_queue_overflow: "回答过长，已停止播报；文字答案不受影响，可选择一段朗读。",
	speech_sanitizer_limit: "朗读内容含过长的未闭合链接或代码，已安全停止，避免读出网址。",
	speech_final_mismatch: "最终答案与已播增量不一致，已停止以避免重复播报。",
	nothing_to_replay: "当前没有可重播的语音段。",
	nothing_to_continue: "当前回答没有未播报的剩余段。",
	explicit_url_request_required: "只有用户明确要求逐字朗读网址时才能使用此入口。"
};
var CampusSpeechController = class {
	capabilities = {
		incremental: true,
		pause: true,
		resume: true,
		timestamps: "none"
	};
	adapter;
	listeners = /* @__PURE__ */ new Set();
	traces = [];
	playbackListeners = /* @__PURE__ */ new Set();
	enabled = false;
	activeRun = null;
	activeItem = null;
	prefetched = null;
	pumping = false;
	blocked = false;
	disposed = false;
	transition = 0;
	lastPlayback = null;
	lastResponse = null;
	constructor(options = {}) {
		this.adapter = options.adapter ?? new CampusSpeechAdapter({
			...options,
			onTrace: (event) => {
				this.traces.push(event);
				if (this.traces.length > 256) this.traces.shift();
				options.onTrace?.(event);
			}
		});
	}
	subscribePlayback(callback) {
		this.playbackListeners.add(callback);
		return () => this.playbackListeners.delete(callback);
	}
	playbackEvent(run, type, utterance_id) {
		for (const callback of this.playbackListeners) callback({
			run,
			type,
			utterance_id
		});
	}
	getTrace() {
		return [...this.traces];
	}
	/** Shared ASR/player resource owner; R3 continuous capture uses this exact instance. */
	getAdapter() {
		return this.adapter;
	}
	async enable(enabled) {
		if (this.disposed) return {
			status: "failed",
			error_code: "disposed"
		};
		if (!enabled) {
			this.enabled = false;
			await this.stop("user");
			return { status: "ready" };
		}
		const result = await this.adapter.activatePlayback();
		this.enabled = result.status === "ready";
		if (!this.enabled) this.emit("error", result.error_code ?? "playback_activation_failed");
		if (this.enabled && this.blocked) return this.resume();
		return result;
	}
	async begin(run) {
		if (!this.enabled) {
			this.emitFor(run, "error", "speech_not_enabled");
			return {
				status: "failed",
				error_code: "speech_not_enabled"
			};
		}
		const stopping = this.stop("new_request");
		const transition = this.transition;
		await stopping;
		if (transition !== this.transition || this.disposed || run.signal.aborted) return {
			status: "failed",
			error_code: "stopped"
		};
		const controller = new AbortController();
		const abort = () => void this.stop("cancel");
		run.signal.addEventListener("abort", abort, { once: true });
		this.activeRun = {
			run,
			controller,
			removeAbort: () => run.signal.removeEventListener("abort", abort),
			sanitizer: new IncrementalSpeechSanitizer(),
			queue: [],
			seen: /* @__PURE__ */ new Set(),
			nextSeq: 1,
			queuedChars: 0,
			briefSentences: 0,
			finished: false,
			failedItem: null,
			drainWaiters: [],
			plannedText: []
		};
		this.blocked = false;
		this.emit("buffering", null);
		return { status: "ready" };
	}
	append(generationId, text) {
		const state = this.activeRun;
		if (!state || state.run.generation_id !== generationId || state.finished || !text) return;
		try {
			this.enqueue(state, state.sanitizer.append(text));
		} catch (error) {
			this.fail(errorCode(error));
		}
	}
	async finish(generationId, finalText) {
		const state = this.activeRun;
		if (!state || state.run.generation_id !== generationId || state.finished) return;
		state.finished = true;
		try {
			this.enqueue(state, state.sanitizer.finish(finalText));
			const full = sanitizeSpeechText(finalText, true).text;
			const planned = state.plannedText.join("");
			this.lastResponse = {
				run: state.run,
				remaining: full.startsWith(planned) ? full.slice(planned.length).trim() : ""
			};
		} catch (error) {
			this.fail(errorCode(error));
			return;
		}
		this.checkDrained();
		if (!this.activeRun || this.activeRun !== state || !this.activeItem && !state.queue.length && !this.pumping) return;
		await new Promise((resolve) => state.drainWaiters.push(resolve));
	}
	async playSegment(run, text, segmentId) {
		const ready = await this.begin({
			...run,
			mode: "full"
		});
		if (ready.status !== "ready") return ready;
		const state = this.activeRun;
		state.finished = true;
		const sanitized = sanitizeSpeechText(text, true).text;
		if (!sanitized) return this.fail("speech_empty");
		try {
			splitBounded(sanitized).forEach((part, index) => this.enqueueItem(state, part, index === 0 ? segmentId : `${segmentId}-${index + 1}`));
		} catch (error) {
			return this.fail(errorCode(error));
		}
		return { status: "ready" };
	}
	async playFull(run, text) {
		const ready = await this.begin({
			...run,
			mode: "full"
		});
		if (ready.status !== "ready") return ready;
		const state = this.activeRun;
		state.finished = true;
		if (!sanitizeSpeechText(text, true).text) return this.fail("speech_empty");
		try {
			this.enqueue(state, state.sanitizer.finish(text));
		} catch (error) {
			return this.fail(errorCode(error));
		}
		return { status: "ready" };
	}
	async stop(reason) {
		this.transition += 1;
		if (reason !== "user") {
			this.lastResponse = null;
			this.lastPlayback = null;
		}
		const state = this.activeRun;
		const utterance = this.activeItem?.utteranceId;
		this.activeRun = null;
		this.activeItem = null;
		this.blocked = false;
		this.pumping = false;
		const prefetched = this.prefetched;
		this.prefetched = null;
		if (!state) return;
		state.removeAbort();
		state.controller.abort();
		if (prefetched) prefetched.promise.then((item) => {
			if (!("status" in item)) this.adapter.releasePrepared(item);
		});
		const stopping = this.adapter.stop(state.run.request_id);
		for (const resolve of state.drainWaiters.splice(0)) resolve();
		if (utterance) this.playbackEvent(state.run, "playback.cancelled", utterance);
		this.emitFor(state.run, "stopped", reason);
		await stopping;
	}
	pause() {
		const result = this.adapter.pausePlayback();
		if (result.status === "ready") this.emit("paused", null);
		return Promise.resolve(result);
	}
	async resume() {
		if (!this.enabled) return {
			status: "failed",
			error_code: "speech_not_enabled"
		};
		if (this.blocked && this.activeItem) {
			const state = this.activeRun;
			const item = this.activeItem;
			const result = await this.adapter.resumePlayback();
			if (!state || !this.isCurrent(state, item, item.utteranceId)) return {
				status: "failed",
				error_code: "stopped"
			};
			if (result.status === "ready") {
				this.blocked = false;
				return result;
			}
			this.emit("error", result.error_code ?? "playback_failed");
			return result;
		}
		const state = this.activeRun;
		if (state?.failedItem) {
			state.queue.unshift(state.failedItem);
			state.failedItem = null;
			this.blocked = false;
			this.pump();
			return { status: "ready" };
		}
		return await this.adapter.resumePlayback();
	}
	/** Replays the current or most recently started segment from its beginning. */
	async replay(run) {
		const current = this.activeRun && this.activeItem ? {
			run: this.activeRun.run,
			text: this.activeItem.text,
			segmentId: this.activeItem.segmentId
		} : this.lastPlayback;
		if (!current) return {
			status: "failed",
			error_code: "nothing_to_replay"
		};
		const replayRun = {
			...run ?? current.run,
			generation_id: run?.generation_id ?? crypto.randomUUID(),
			signal: run?.signal ?? new AbortController().signal,
			mode: "full"
		};
		return this.playSegment(replayRun, current.text, `replay-${current.segmentId}`);
	}
	/** Continues only the unspoken remainder left by the latest automatic brief. */
	async continueRemaining(nextRun) {
		const previous = this.lastResponse;
		if (!previous?.remaining) return {
			status: "failed",
			error_code: "nothing_to_continue"
		};
		const run = {
			...nextRun ?? previous.run,
			generation_id: nextRun?.generation_id ?? crypto.randomUUID(),
			signal: nextRun?.signal ?? new AbortController().signal,
			mode: "full"
		};
		const remaining = previous.remaining;
		this.lastResponse = null;
		return this.playFull(run, remaining);
	}
	/** Separate guarded path for an explicit user request to read a URL verbatim. */
	async playVerbatimUrl(run, text, segmentId, explicitRequest) {
		if (!explicitRequest) return {
			status: "failed",
			error_code: "explicit_url_request_required"
		};
		const spoken = sanitizeExplicitUrlSpeechText(text);
		if (!spoken) return {
			status: "failed",
			error_code: "speech_empty"
		};
		if ([...spoken].length > MAX_SEGMENT_CHARS) return {
			status: "failed",
			error_code: "speech_queue_overflow"
		};
		const ready = await this.begin({
			...run,
			mode: "full"
		});
		if (ready.status !== "ready") return ready;
		const state = this.activeRun;
		state.finished = true;
		this.enqueueItem(state, spoken, segmentId);
		return { status: "ready" };
	}
	listVoices() {
		return this.adapter.listVoices();
	}
	subscribe(callback) {
		this.listeners.add(callback);
		return () => this.listeners.delete(callback);
	}
	dispose() {
		if (this.disposed) return;
		this.disposed = true;
		this.stop("clear");
		this.listeners.clear();
		this.playbackListeners.clear();
		this.adapter.dispose();
	}
	enqueue(state, segments) {
		for (const segment of segments) {
			let spoken = segment;
			if (state.run.mode === "brief") {
				if (state.briefSentences >= BRIEF_SENTENCES || state.queuedChars >= BRIEF_CHARS) continue;
				const ends = sentenceEnds(segment, 0);
				if (ends.at(-1) !== segment.length) ends.push(segment.length);
				const allowed = ends.slice(0, BRIEF_SENTENCES - state.briefSentences);
				spoken = segment.slice(0, allowed.at(-1) ?? 0);
				const available = BRIEF_CHARS - state.queuedChars;
				const chars = [...spoken];
				if (chars.length > available) {
					let cut = available;
					for (let i = available - 1; i >= Math.floor(available / 2); i -= 1) if (/[\uFF0C\u3001\uFF1B;\uFF1A:\s]/u.test(chars[i])) {
						cut = i + 1;
						break;
					}
					while (cut > 0 && /[A-Za-z0-9]/u.test(chars[cut - 1]) && /[A-Za-z0-9]/u.test(chars[cut] ?? "")) cut -= 1;
					spoken = chars.slice(0, cut).join("").trim();
					state.briefSentences = BRIEF_SENTENCES;
				} else state.briefSentences += allowed.length;
				if (!spoken) continue;
			}
			this.enqueueItem(state, spoken, `stream-${state.nextSeq}`);
		}
	}
	enqueueItem(state, text, segmentId) {
		const chars = [...text].length;
		if (state.queue.length + (this.activeItem ? 1 : 0) >= MAX_SEGMENTS || state.queuedChars + chars > MAX_RUN_CHARS) throw new Error("speech_queue_overflow");
		const seq = state.nextSeq++;
		const key = `${state.run.request_id}:${segmentId}:${seq}`;
		if (state.seen.has(key)) return;
		state.seen.add(key);
		const item = {
			key,
			segmentId,
			seq,
			text,
			utteranceId: crypto.randomUUID()
		};
		state.queue.push(item);
		state.plannedText.push(text);
		state.queuedChars += chars;
		this.emit("buffering", null, item);
		if (this.activeItem) this.ensurePrefetch();
		else this.pump();
	}
	async pump() {
		const state = this.activeRun;
		if (!state || this.pumping || this.activeItem || this.blocked || state.failedItem) return;
		const item = state.queue.shift();
		if (!item) {
			this.checkDrained();
			return;
		}
		this.pumping = true;
		this.activeItem = item;
		const context = {
			request_id: state.run.request_id,
			session_id: state.run.session_id,
			signal: state.controller.signal
		};
		let prepared;
		if (this.prefetched?.item === item) {
			const prefetched = this.prefetched;
			prepared = await prefetched.promise;
			if (this.prefetched === prefetched) this.prefetched = null;
		} else prepared = await this.adapter.prepareSpeech(context, item.utteranceId, item.text, state.run.voice_id);
		if (this.activeRun !== state || state.controller.signal.aborted) {
			if (!("status" in prepared)) this.adapter.releasePrepared(prepared);
			return;
		}
		if ("status" in prepared) {
			this.pumping = false;
			this.activeItem = null;
			state.failedItem = item;
			this.fail(prepared.error_code ?? "tts_unavailable", false);
			return;
		}
		this.ensurePrefetch();
		const result = await this.adapter.playPreparedSpeech(prepared, {
			onText: () => void 0,
			onStart: (utteranceId) => {
				if (this.isCurrent(state, item, utteranceId)) {
					this.lastPlayback = {
						run: state.run,
						text: item.text,
						segmentId: item.segmentId
					};
					this.playbackEvent(state.run, "playback.started", utteranceId);
					if (this.isCurrent(state, item, utteranceId)) this.emit("speaking", null, item);
				}
			},
			onEnd: (utteranceId) => {
				if (!this.isCurrent(state, item, utteranceId)) return;
				this.playbackEvent(state.run, "playback.ended", utteranceId);
				if (!this.isCurrent(state, item, utteranceId)) return;
				this.activeItem = null;
				this.pumping = false;
				if (state.queue.length) this.emit("buffering", null, item);
				this.pump();
			},
			onFailure: (utteranceId, code) => {
				if (!this.isCurrent(state, item, utteranceId)) return;
				this.blocked = code === "playback_permission_denied";
				if (!this.blocked) {
					this.activeItem = null;
					state.failedItem = item;
				}
				this.pumping = false;
				this.emit("error", code, item);
				this.resolveDrain(state);
			}
		});
		if (!this.isCurrent(state, item, item.utteranceId) || state.controller.signal.aborted) return;
		if (result.status !== "ready" && this.pumping) {
			this.pumping = false;
			this.activeItem = null;
			state.failedItem = item;
			this.fail(result.error_code ?? "playback_failed", false);
		}
	}
	ensurePrefetch() {
		const state = this.activeRun;
		const next = state?.queue[0];
		if (!state || !next || this.prefetched) return;
		const context = {
			request_id: state.run.request_id,
			session_id: state.run.session_id,
			signal: state.controller.signal
		};
		this.prefetched = {
			item: next,
			promise: this.adapter.prepareSpeech(context, next.utteranceId, next.text, state.run.voice_id)
		};
	}
	isCurrent(state, item, utteranceId) {
		return this.activeRun === state && this.activeItem === item && item.utteranceId === utteranceId;
	}
	fail(code, clearQueue = true) {
		const state = this.activeRun;
		if (state && clearQueue) {
			state.queue.length = 0;
			state.controller.abort();
			this.activeItem = null;
			this.pumping = false;
			const prefetched = this.prefetched;
			this.prefetched = null;
			if (prefetched) prefetched.promise.then((item) => {
				if (!("status" in item)) this.adapter.releasePrepared(item);
			});
		}
		this.blocked = false;
		this.emit("error", code);
		if (state) this.resolveDrain(state);
		return {
			status: "failed",
			error_code: code
		};
	}
	checkDrained() {
		const state = this.activeRun;
		if (!state || !state.finished || state.failedItem || this.blocked || this.activeItem || this.pumping || state.queue.length) return;
		this.emit("idle", null);
		this.resolveDrain(state);
		state.removeAbort();
		if (this.activeRun === state) this.activeRun = null;
	}
	resolveDrain(state) {
		for (const resolve of state.drainWaiters.splice(0)) resolve();
	}
	emit(status, code, item = this.activeItem) {
		const state = this.activeRun;
		if (state) this.emitFor(state.run, status, code, item);
	}
	emitFor(run, status, code, item = null) {
		const value = {
			request_id: run.request_id,
			generation_id: run.generation_id,
			utterance_id: item?.utteranceId ?? null,
			segment_id: item?.segmentId ?? null,
			status,
			code
		};
		for (const listener of this.listeners) listener(value);
	}
};
function errorCode(error) {
	return error instanceof Error ? error.message : "speech_failed";
}
function createSpeechController(options) {
	return new CampusSpeechController(options);
}
//#endregion
//#region frontend/src/speech/interaction.ts
var RECOGNITION_MESSAGES = {
	asr_not_configured: "中文识别服务尚未配置，请使用文字输入。",
	asr_unavailable: "中文识别服务暂时不可用，请重试或使用文字输入。",
	asr_timeout: "中文识别超时，麦克风已释放，请重试。",
	capture_timeout: "麦克风授权或语音检测加载超时，请检查权限后重试。",
	permission_denied: "麦克风权限被拒绝，请在浏览器中允许后重试。",
	capture_unsupported: "当前浏览器不支持麦克风采集。",
	capture_failed: "麦克风或语音检测加载失败，请检查设备后重试。",
	audio_too_long: "单次发言请控制在29秒以内，麦克风已释放。"
};
/** Owns local speech only. A owns business requests, cancellation and send preferences. */
var CampusSpeechInteractionController = class {
	dependencies;
	speechController;
	options;
	capture;
	epoch = 0;
	disposed = false;
	playing = null;
	quietUntil = 0;
	unsubscribe;
	unsubscribeLevel;
	unsubscribeProgress;
	ownsController;
	constructor(dependencies = {}) {
		this.dependencies = dependencies;
		this.ownsController = !dependencies.speechController;
		this.speechController = dependencies.speechController ?? createSpeechController();
		this.unsubscribe = this.speechController.subscribePlayback((event) => this.onPlayback(event));
		this.unsubscribeProgress = this.speechController.subscribe((progress) => {
			const options = this.options;
			if (progress.status !== "error" || !options || progress.generation_id !== options.context.generation_id || progress.request_id !== options.context.request_id) return;
			this.playing = null;
			this.quietUntil = Date.now() + 800;
			options.onAudioLevel?.(0);
			this.emit(options, "speech.error", { error_code: "playback_failed" });
		});
		this.unsubscribeLevel = this.speechController.getAdapter().subscribeAudioLevel((level) => {
			if (!level || this.playing && this.matches(this.playing)) this.options?.onAudioLevel?.(level);
		});
	}
	get capabilities() {
		return {
			...this.speechController.getAdapter().recognitionStatus,
			continuous: this.speechController.getAdapter().supportsContinuousRecognition,
			interruption: this.dependencies.automaticBargeIn ? "headset_vad_unverified" : "manual",
			lip_sync: "amplitude"
		};
	}
	/** A binds a fresh task snapshot even when microphone capture is off. Does not start capture. */
	bind(options) {
		this.capture?.abort();
		this.capture = void 0;
		this.epoch += 1;
		this.options?.onAudioLevel?.(0);
		this.options = {
			...options,
			context: { ...options.context }
		};
	}
	async start(options) {
		if (this.disposed) return {
			status: "unavailable",
			error_code: "disposed"
		};
		if (options.mode === "push_to_talk") await this.interrupt();
		this.bind(options);
		const epoch = this.epoch, snapshot = this.options;
		const adapter = this.speechController.getAdapter();
		if (options.mode === "continuous" && !adapter.supportsContinuousRecognition) {
			adapter.recognitionStatus.error_code = "continuous_not_supported";
			this.emit(snapshot, "speech.error", { error_code: "recognition_failed" });
			return {
				status: "unavailable",
				error_code: "continuous_not_supported"
			};
		}
		await adapter.refreshAsrCapability();
		if (epoch !== this.epoch || this.disposed) return {
			status: "unavailable",
			error_code: "stopped"
		};
		if (!adapter.capabilities.asr) {
			const code = adapter.recognitionStatus.error_code ?? "asr_not_configured";
			this.emit(snapshot, "speech.error", { error_code: code === "asr_not_configured" ? "asr_not_configured" : "recognition_failed" });
			return {
				status: "unavailable",
				error_code: code
			};
		}
		if (epoch !== this.epoch || this.disposed) return {
			status: "unavailable",
			error_code: "stopped"
		};
		const capture = new AbortController();
		this.capture = capture;
		const request_id = crypto.randomUUID();
		capture.signal.addEventListener("abort", () => {
			adapter.stop(request_id);
		}, { once: true });
		const current = () => this.capture === capture && !capture.signal.aborted && epoch === this.epoch;
		const result = await adapter.start({
			request_id,
			session_id: snapshot.context.session_id,
			signal: capture.signal
		}, {
			onText: (text, final) => {
				if (!current() || !text.trim()) return;
				this.emit(snapshot, final ? "recognition.final" : "recognition.partial", { text });
			},
			onStart: () => void 0,
			onEnd: () => void 0,
			onFailure: (_, code) => {
				if (!current()) return;
				this.emit(snapshot, "speech.error", { error_code: code === "permission_denied" ? "permission_denied" : code === "asr_not_configured" ? "asr_not_configured" : "recognition_failed" });
			}
		}, {
			continuous: options.mode === "continuous",
			canAccept: () => current() && (this.dependencies.automaticBargeIn || !this.playing && Date.now() >= this.quietUntil),
			automaticBargeIn: this.dependencies.automaticBargeIn,
			onVoice: () => {
				if (current() && this.playing) this.interrupt();
			}
		});
		if (!current()) return {
			status: "unavailable",
			error_code: "stopped"
		};
		return result.status === "ready" ? { status: "started" } : {
			status: "unavailable",
			error_code: result.error_code
		};
	}
	/** Bind this to an explicit button/key. A handles answer cancellation on the event. */
	async interrupt() {
		const snapshot = this.options;
		const stopping = this.speechController.stop("cancel");
		this.quietUntil = Date.now() + 800;
		snapshot?.onAudioLevel?.(0);
		if (snapshot) this.emit(snapshot, "speech.interrupted");
		await stopping;
	}
	async stop(reason) {
		this.epoch += 1;
		this.capture?.abort();
		this.capture = void 0;
		const stopping = this.speechController.stop(reason === "campus_changed" ? "campus_change" : reason === "disposed" ? "clear" : "user");
		this.options?.onAudioLevel?.(0);
		this.playing = null;
		this.quietUntil = Date.now() + 800;
		await stopping;
	}
	dispose() {
		if (this.disposed) return;
		this.disposed = true;
		this.stop("disposed");
		this.unsubscribe();
		this.unsubscribeLevel();
		this.unsubscribeProgress();
		if (this.ownsController) this.speechController.dispose();
		this.options = void 0;
	}
	matches(event) {
		const context = this.options?.context;
		return !!context && event.run.request_id === context.request_id && event.run.session_id === context.session_id && event.run.generation_id === context.generation_id && event.run.campus_id === context.campus_id;
	}
	onPlayback(event) {
		if (event.type === "playback.started") this.playing = event;
		else if (this.playing?.utterance_id === event.utterance_id) {
			this.playing = null;
			this.quietUntil = Date.now() + 800;
		}
		if (!this.matches(event)) return;
		const options = this.options;
		if (event.type !== "playback.started") options.onAudioLevel?.(0);
		this.emit(options, event.type, { utterance_id: event.utterance_id });
	}
	emit(options, type, fields = {}) {
		options.onEvent({
			...options.context,
			event_id: crypto.randomUUID(),
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			type,
			text: null,
			utterance_id: null,
			error_code: null,
			...fields
		});
	}
};
function createSpeechInteractionController(dependencies) {
	return new CampusSpeechInteractionController(dependencies);
}
//#endregion
//#region frontend/src/avatar/manifest.ts
var kelaitaManifest = {
	id: "kelaita",
	display_name: "珂莱塔",
	source_character: "珂莱塔 / 鸣潮 BongoCat 风格",
	renderer: "live2d",
	model_url: "/assets/kelaita/runtime/kelaita.model3.json",
	core_url: "/vendor/live2dcubismcore.min.js",
	capabilities: {
		renderer: true,
		lip_sync: "amplitude",
		expressions: [],
		motions: [],
		customization: ["scale"],
		is_3d: false,
		face_morph: false
	}
};
//#endregion
//#region frontend/src/avatar/vrm/flag.ts
var VRM_RENDERER_KEY = "campus.avatar.renderer";
function vrmAvatarEnabled() {
	try {
		const param = new URLSearchParams(window.location.search).get("avatar");
		if (param === "vrm") return true;
		if (param === "live2d") return false;
		if (window.localStorage.getItem("campus.avatar.renderer") === "live2d") return false;
		return true;
	} catch {
		return true;
	}
}
function installAvatarSwitch() {
	if (typeof window === "undefined" || window.campusAvatar) return;
	window.campusAvatar = {
		enable: () => {
			try {
				window.localStorage.setItem(VRM_RENDERER_KEY, "vrm");
			} catch {}
			return "vrm: refresh to apply";
		},
		disable: () => {
			try {
				window.localStorage.removeItem(VRM_RENDERER_KEY);
			} catch {}
			return "live2d: refresh to apply";
		},
		mode: () => vrmAvatarEnabled() ? "vrm" : "live2d",
		roam: (enabled) => {
			setRoamEnabled(enabled);
			return `roam: ${enabled ? "on" : "off"} (refresh to apply)`;
		},
		roamMode: () => roamEnabled() ? "on" : "off",
		reload: () => window.location.reload()
	};
}
installAvatarSwitch();
//#endregion
//#region frontend/src/avatar/vrm/adapter.ts
/** Thin lazy wrapper: three.js / three-vrm are only fetched when this adapter mounts. */
var VrmAvatarAdapter = class {
	manifest = vrmManifest;
	renderer;
	generation = 0;
	pendingState = "idle";
	pendingScale = 1;
	async mount(host) {
		this.dispose();
		this.generation += 1;
		const generation = this.generation;
		try {
			const { VrmRenderer } = await import("./renderer-BWdqDeHL.js");
			if (generation !== this.generation) return {
				status: "failed",
				error_code: "stopped"
			};
			const renderer = new VrmRenderer();
			this.renderer = renderer;
			const result = await renderer.mount(host);
			if (generation !== this.generation) {
				renderer.dispose();
				return {
					status: "failed",
					error_code: "stopped"
				};
			}
			renderer.setState(this.pendingState);
			renderer.setScale(this.pendingScale);
			return result;
		} catch {
			this.renderer = void 0;
			return {
				status: "failed",
				error_code: "vrm_renderer_unavailable"
			};
		}
	}
	setState(state) {
		this.pendingState = state;
		this.renderer?.setState(state);
	}
	setAudioLevel(level) {
		this.renderer?.setAudioLevel(level);
	}
	setScale(scale) {
		this.pendingScale = scale;
		this.renderer?.setScale(scale);
	}
	dispose() {
		this.generation += 1;
		this.renderer?.dispose();
		this.renderer = void 0;
	}
};
//#endregion
//#region frontend/src/avatar/adapter.ts
var coreLoad;
function loadCubismCore(url) {
	const browser = window;
	if (browser.Live2DCubismCore) return Promise.resolve();
	if (coreLoad) return coreLoad;
	coreLoad = new Promise((resolve, reject) => {
		const existing = document.querySelector("script[data-ai4tju-cubism-core]");
		const script = existing ?? document.createElement("script");
		const fail = () => {
			script.remove();
			coreLoad = void 0;
			reject(/* @__PURE__ */ new Error("cubism_core_load_failed"));
		};
		script.addEventListener("load", () => browser.Live2DCubismCore ? resolve() : fail(), { once: true });
		script.addEventListener("error", fail, { once: true });
		if (!existing) {
			script.src = url;
			script.async = true;
			script.dataset.ai4tjuCubismCore = "true";
			document.head.appendChild(script);
		}
	});
	return coreLoad;
}
async function loadRendererModules(coreUrl = kelaitaManifest.core_url) {
	if (!coreUrl) throw new Error("cubism_core_url_missing");
	const pixi = await import("./pixi-DJuN-NFW.js");
	window.PIXI = pixi;
	await loadCubismCore(coreUrl);
	const live2d = await import("./cubism4.es-DFUg6fOm.js");
	live2d.Live2DModel.registerTicker(pixi.Ticker);
	return {
		pixi,
		live2d
	};
}
var KelaitaAvatarAdapter = class {
	manifest = kelaitaManifest;
	app;
	model;
	observer;
	state = "idle";
	scale = .94;
	audioLevel = 0;
	nextBlinkAt = 0;
	blinkStartedAt = null;
	generation = 0;
	async mount(host) {
		this.dispose();
		const generation = this.generation;
		try {
			const { pixi, live2d } = await loadRendererModules();
			if (generation !== this.generation) return {
				status: "failed",
				error_code: "stopped"
			};
			if (!pixi.utils.isWebGLSupported()) return {
				status: "failed",
				error_code: "webgl_unavailable"
			};
			const app = new pixi.Application({
				antialias: true,
				autoDensity: true,
				backgroundAlpha: 0,
				resolution: Math.min(window.devicePixelRatio || 1, 2)
			});
			const canvas = app.view;
			canvas.dataset.avatarRenderer = "kelaita-live2d";
			canvas.style.width = "100%";
			canvas.style.height = "100%";
			canvas.style.display = "block";
			host.appendChild(canvas);
			this.app = app;
			const model = await live2d.Live2DModel.from(kelaitaManifest.model_url, {
				autoInteract: false,
				autoUpdate: false
			});
			if (generation !== this.generation) {
				model.destroy({
					children: true,
					texture: true,
					baseTexture: true
				});
				return {
					status: "failed",
					error_code: "stopped"
				};
			}
			model.anchor.set(.5, .5);
			app.stage.addChild(model);
			this.model = model;
			this.nextBlinkAt = performance.now() + 1200;
			const fit = () => this.fit(host);
			this.observer = new ResizeObserver(fit);
			this.observer.observe(host);
			fit();
			model.internalModel.on("beforeModelUpdate", () => this.driveParameters(performance.now()));
			app.ticker.add(() => model.update(app.ticker.deltaMS));
			return { status: "ready" };
		} catch (error) {
			const code = error instanceof Error && error.message.includes("cubism_core") ? "cubism_core_load_failed" : "avatar_model_load_failed";
			if (generation === this.generation) this.dispose();
			return {
				status: "failed",
				error_code: code
			};
		}
	}
	setState(state) {
		this.state = state;
	}
	/** Actual playback amplitude only; independent of A's business presentation state. */
	setAudioLevel(level) {
		this.audioLevel = Number.isFinite(level) ? Math.max(0, Math.min(1, level)) : 0;
		(this.model?.internalModel.coreModel)?.setParameterValueById("ParamMouthOpenY", this.audioLevel);
	}
	/** Display-only customization supported by the first model. */
	setScale(scale) {
		this.scale = Math.max(.6, Math.min(1.25, scale));
		const canvas = this.app?.view;
		if (canvas?.parentElement) this.fit(canvas.parentElement);
	}
	dispose() {
		this.setAudioLevel(0);
		this.generation += 1;
		this.observer?.disconnect();
		this.observer = void 0;
		const model = this.model;
		const app = this.app;
		this.model = void 0;
		this.app = void 0;
		if (model) {
			model.parent?.removeChild(model);
			model.destroy({
				children: true,
				texture: true,
				baseTexture: true
			});
		}
		app?.destroy(true, { children: true });
		this.blinkStartedAt = null;
	}
	fit(host) {
		if (!this.app || !this.model) return;
		const width = Math.max(1, host.clientWidth || 640);
		const height = Math.max(1, host.clientHeight || 640);
		this.app.renderer.resize(width, height);
		this.model.scale.set(1);
		const bounds = this.model.getLocalBounds();
		const factor = Math.min(width / Math.max(bounds.width, 1), height / Math.max(bounds.height, 1)) * this.scale;
		this.model.scale.set(factor);
		this.model.position.set(width / 2, height / 2);
	}
	driveParameters(now) {
		if (!this.model) return;
		const core = this.model.internalModel.coreModel;
		const seconds = now / 1e3;
		let angleX = Math.sin(seconds * .55) * 2;
		let angleY = Math.sin(seconds * .37) * 1.2;
		let angleZ = Math.sin(seconds * .42) * .8;
		let bodyZ = angleZ * .35;
		let eyeX = 0;
		let browY = 0;
		if (this.state === "listening") {
			angleX += Math.sin(seconds * 1.8) * 2.5;
			browY = .15;
		} else if (this.state === "thinking") {
			eyeX = Math.sin(seconds * 1.4) * .55;
			angleY -= 4;
		} else if (this.state === "speaking") {
			angleZ += Math.sin(seconds * 2.8) * 1.8;
			bodyZ += Math.sin(seconds * 2.8) * .9;
		} else if (this.state === "error") {
			angleZ = -5;
			browY = -.35;
		}
		core.setParameterValueById("ParamAngleX", angleX);
		core.setParameterValueById("ParamAngleY", angleY);
		core.setParameterValueById("ParamAngleZ", angleZ);
		core.setParameterValueById("ParamBodyAngleZ", bodyZ);
		core.setParameterValueById("ParamEyeBallX", eyeX);
		core.setParameterValueById("ParamBrowLY", browY);
		core.setParameterValueById("ParamBrowRY", browY);
		core.setParameterValueById("ParamBreath", (Math.sin(seconds * 1.9) + 1) / 2);
		core.setParameterValueById("ParamMouthOpenY", this.audioLevel);
		if (this.state === "error") {
			core.setParameterValueById("ParamEyeLOpen", .72);
			core.setParameterValueById("ParamEyeROpen", .72);
			return;
		}
		if (this.blinkStartedAt === null && now >= this.nextBlinkAt) this.blinkStartedAt = now;
		if (this.blinkStartedAt !== null) {
			const phase = (now - this.blinkStartedAt) / 170;
			const openness = phase < .5 ? 1 - phase * 2 : (phase - .5) * 2;
			core.setParameterValueById("ParamEyeLOpen", Math.max(0, Math.min(1, openness)));
			core.setParameterValueById("ParamEyeROpen", Math.max(0, Math.min(1, openness)));
			if (phase >= 1) {
				this.blinkStartedAt = null;
				this.nextBlinkAt = now + 2200 + Math.random() * 2400;
			}
		} else {
			core.setParameterValueById("ParamEyeLOpen", 1);
			core.setParameterValueById("ParamEyeROpen", 1);
		}
	}
};
function createAvatarAdapter() {
	if (vrmAvatarEnabled()) return new VrmAvatarAdapter();
	return new KelaitaAvatarAdapter();
}
//#endregion
export { CampusSpeechAdapter, CampusSpeechAdapter as StubSpeechAdapter, CampusSpeechController, CampusSpeechInteractionController, IncrementalSpeechSanitizer, KelaitaAvatarAdapter, KelaitaAvatarAdapter as StubAvatarAdapter, RECOGNITION_MESSAGES, SPEECH_ERROR_MESSAGES, createAvatarAdapter, createSpeechAdapter, createSpeechController, createSpeechInteractionController, loadRendererModules, loadVadModule, sanitizeExplicitUrlSpeechText, sanitizeSpeechText };
