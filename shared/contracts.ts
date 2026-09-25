// CONTRACT_VERSION mirrors backend/contracts.py.
export const CONTRACT_VERSION = '1.1.0';
export type CampusId = 'weijinlu' | 'beiyangyuan';
export type Mode = 'campus_qa' | 'content_generation' | 'general_chat';
export type AvatarState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';
export interface AvatarCapabilities { renderer: boolean; lip_sync: 'none'|'amplitude'|'viseme'; expressions: string[]; motions: string[]; customization: ('scale'|'background')[]; is_3d: boolean; face_morph: boolean }
export interface AvatarManifest { id: string; display_name: string; source_character: string; renderer: 'live2d'|'image'|'vrm'; model_url: string; core_url?: string; capabilities: AvatarCapabilities }
export interface AdapterResult { status: 'ready'|'not_implemented'|'failed'; error_code?: string }
export interface AvatarAdapter { readonly manifest: AvatarManifest; mount(host: HTMLElement): Promise<AdapterResult>; setState(state: AvatarState): void; setAudioLevel?(level:number):void; setCompanionVideo?(video: {src:string; mime?:string; caption?:string} | null):void; setPresentationHost?(host:HTMLElement|null):void; dispose(): void }
export interface SpeechContext { request_id: string; session_id: string; signal: AbortSignal }
export interface AudioPayload { encoding: 'base64'; mime_type: 'audio/wav'; sample_rate_hz: 16000; channels: 1; audio_base64: string }
export interface SpeechCallbacks { onText(text: string, is_final: boolean): void; onStart(utterance_id: string): void; onEnd(utterance_id: string): void; onFailure(utterance_id: string, code: string): void }
export interface Voice { id: string; name: string; locale: string; provider: string }
export interface SpeechAdapter {
  readonly capabilities: { asr: boolean; tts: boolean; timestamps: 'none'|'word'|'viseme' };
  start(context: SpeechContext, callbacks: SpeechCallbacks): Promise<AdapterResult>;
  stop(request_id: string): Promise<{ local_stopped: boolean; upstream_stop: 'not_started'|'unconfirmed'|'confirmed' }>;
  speak(context: SpeechContext, utterance_id: string, text: string, voice_id: string, callbacks: SpeechCallbacks): Promise<AdapterResult>;
  listVoices(): Promise<Voice[]>;
}
export interface Source { id: string; title: string; snippet: string; url: string; campus_id: CampusId; published_at: string|null; retrieved_at: string }
export interface Building { id: string; title: string; campus_id: CampusId; summary: string; url: string; published_at: string|null; retrieved_at: string; coordinates: {lat:number;lng:number}|null }
export interface KnowledgeStatus { status: 'unavailable'|'ready'; version: string|null; document_count: number; building_count: number; updated_at: string|null }
export interface ChatRequest { request_id: string; session_id: string; message: string; mode: Mode; campus_id: CampusId; selected_building_id: string|null }
export interface SceneAction { action_id: string; request_id: string; type: 'focus_building'|'show_building_card'; parameters: {building_id:string} }
export interface ChatResponse { request_id: string; session_id: string; answer: string; sources: Source[]; model: string; usage: {prompt_tokens:number;completion_tokens:number;total_tokens:number}|null; elapsed_ms: number; actions: SceneAction[] }
export interface ApiError { error: { code: string; message: string; request_id: string|null; retryable: boolean } }
export interface RuntimeEvent { event_id: string; request_id: string; seq: number; timestamp: string; origin: 'backend'|'frontend'; stage: 'request'|'knowledge'|'model'|'speech'|'avatar'|'scene'|'generation'; status: 'started'|'completed'|'failed'|'cancelled'|'rendered'; duration_ms: number|null; data: {code?: string|null;action_id?:string|null;building_id?:string|null;count?:number|null;model?:string|null} }
export interface EventPage { events: RuntimeEvent[]; next_cursor: number; truncated: boolean }
export interface CancelRequest { session_id: string }
export interface CancelResponse { request_id: string; status: 'cancel_requested'|'already_terminal'; local_task_stopped: boolean; upstream_stop: 'not_started'|'unconfirmed'|'confirmed' }
export interface SceneAck { request_id:string; session_id:string; action_id:string; status:'completed'|'failed'; error_code?:'execution_failed'|'unsupported' }
export interface SceneAckResponse { request_id:string; action_id:string; status:'recorded'|'duplicate' }
export interface ClientEventInput { event_id:string; request_id:string; session_id:string; stage:'speech'|'avatar'; status:'started'|'completed'|'failed'|'cancelled'; duration_ms:number|null; data:{code?:'not_implemented'|'playback_failed'|'permission_denied'|'stopped'} }
export interface Health { status:'ok'; contract_version:string; model:{configured:boolean;verified:boolean}; capabilities:{chat:boolean;asr:boolean;tts:boolean;knowledge:boolean;scene_3d:boolean} }
export interface SpeechStopResponse { request_id:string; local_stopped:boolean; upstream_stop:'not_started'|'unconfirmed'|'confirmed' }
export interface SearchResponse { hits:Source[]; status:KnowledgeStatus }
export interface BuildingList { buildings:Building[] }
