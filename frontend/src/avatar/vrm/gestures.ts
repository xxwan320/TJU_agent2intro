// Interaction gesture catalog for the external VRM avatar.
// Kept free of three.js imports so tests can load it without WebGL.
import type { AvatarGesture } from './flag';

export const GESTURE_DURATIONS: Record<AvatarGesture, number> = {
  wave: 2.4,
  jump: 1.8,
  dance: 3.2,
  nod: 1.3,
};

export const IDLE_GESTURES: AvatarGesture[] = ['wave', 'jump', 'dance', 'nod'];

export function isAvatarGesture(value: string): value is AvatarGesture {
  return Object.prototype.hasOwnProperty.call(GESTURE_DURATIONS, value);
}
