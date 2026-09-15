// M-owned assembly guard. No audio queue, microphone, model call or business state here.
import type {SpeechController} from '../../../shared/r2';
import type {SpeechInteractionFactory,ConnectedSpeechInteractionController} from '../../../shared/r3-speech';
export function connectSpeechInteraction(factory:SpeechInteractionFactory,speechController:SpeechController,
 options:{automaticBargeIn?:boolean}={}):ConnectedSpeechInteractionController {
 const interaction=factory({speechController,automaticBargeIn:options.automaticBargeIn??false});
 if(interaction.speechController!==speechController||typeof interaction.bind!=='function'||typeof interaction.interrupt!=='function'){
  interaction.dispose();
  throw new Error('speech_interaction_shared_controller_required');
 }
 return interaction;
}