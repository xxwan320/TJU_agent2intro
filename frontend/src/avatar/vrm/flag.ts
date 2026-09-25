// Plug-and-play VRM avatar switch. VRM is enabled by default for the trial;
// the original Live2D renderer stays intact and can be restored at any time.
// Enable: default, ?avatar=vrm or localStorage['campus.avatar.renderer'] = 'vrm'
// Disable: ?avatar=live2d or window.campusAvatar.disable()
export const VRM_RENDERER_KEY = 'campus.avatar.renderer';

export function vrmAvatarEnabled(): boolean {
  try {
    const param = new URLSearchParams(window.location.search).get('avatar');
    if (param === 'vrm') return true;
    if (param === 'live2d') return false;
    const stored = window.localStorage.getItem(VRM_RENDERER_KEY);
    if (stored === 'live2d') return false;
    return true;
  } catch {
    return true;
  }
}

import { roamEnabled, setRoamEnabled } from './roam';
import type { AvatarState } from '../../../../shared/contracts';

export type AvatarGesture = 'wave' | 'jump' | 'dance' | 'nod';

type AvatarSwitch = {
  enable: () => string;
  disable: () => string;
  mode: () => 'vrm' | 'live2d';
  roam: (enabled: boolean) => string;
  roamMode: () => 'on' | 'off';
  reload: () => void;
  /** Play an interaction gesture on the VRM avatar; no-op when Live2D is active. */
  gesture?: (kind: AvatarGesture) => string;
  /** Test/demo hook: force an avatar state (idle | listening | thinking | speaking | error). */
  setState?: (state: AvatarState) => string;
  /** Test/demo hook: bind or clear the narration screen clip. */
  setCompanionVideo?: (video: { src: string; mime?: string; caption?: string } | null) => string;
};

declare global {
  interface Window {
    campusAvatar?: AvatarSwitch;
  }
}

export function installAvatarSwitch(): void {
  if (typeof window === 'undefined' || window.campusAvatar) return;
  window.campusAvatar = {
    enable: () => { try { window.localStorage.setItem(VRM_RENDERER_KEY, 'vrm'); } catch { /* ignore */ } return 'vrm: refresh to apply'; },
    disable: () => { try { window.localStorage.removeItem(VRM_RENDERER_KEY); } catch { /* ignore */ } return 'live2d: refresh to apply'; },
    mode: () => (vrmAvatarEnabled() ? 'vrm' : 'live2d'),
    roam: (enabled: boolean) => { setRoamEnabled(enabled); return `roam: ${enabled ? 'on' : 'off'} (refresh to apply)`; },
    roamMode: () => (roamEnabled() ? 'on' : 'off'),
    reload: () => window.location.reload(),
  };
}

installAvatarSwitch();
