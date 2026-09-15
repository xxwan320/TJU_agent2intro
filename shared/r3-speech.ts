// M-owned additive B -> A local contract. A owns model/business request decisions.
import type {SpeechInteractionEvent} from './r3';
import type {SpeechController} from './r2';
export interface SpeechInteractionContext {
 interaction_id:string;session_id:string;campus_id:'weijinlu'|'beiyangyuan';
 generation_id:string;request_id:string|null;
}
export interface SpeechInteractionOptions {
 context:SpeechInteractionContext;mode:'push_to_talk'|'continuous';
 onEvent:(event:SpeechInteractionEvent)=>void;
 onAudioLevel?:(level:number)=>void;
}
export interface SpeechInteractionCapabilities {
 configured:boolean;state:string;error_code:string|null;continuous:boolean;
 interruption:'manual'|'headset_vad_unverified';
 lip_sync:'none'|'amplitude';
}
export interface SpeechInteractionController {
 start(options:SpeechInteractionOptions):Promise<{status:'started'|'unavailable';error_code?:string}>;
 stop(reason:'user'|'campus_changed'|'disposed'):Promise<void>;
 dispose():void;
 // Optional for old implementations; R3 connected factory below guarantees these.
 bind?(options:SpeechInteractionOptions):void;
 interrupt?():Promise<void>;
 readonly speechController?:SpeechController;
 readonly capabilities?:SpeechInteractionCapabilities;
}
export interface ConnectedSpeechInteractionController extends SpeechInteractionController {
 bind(options:SpeechInteractionOptions):void;
 interrupt():Promise<void>;
 readonly speechController:SpeechController;
 readonly capabilities:SpeechInteractionCapabilities;
}
export interface SpeechInteractionDependencies {
 speechController:SpeechController;
 automaticBargeIn?:boolean;
}
export type SpeechInteractionFactory=(dependencies:SpeechInteractionDependencies)=>ConnectedSpeechInteractionController;
// B may retain an optional no-arg factory for standalone use; A always injects its existing queue.
// bind does not start microphone capture. Await stop before binding a new active playback context.