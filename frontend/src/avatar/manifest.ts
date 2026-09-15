import type { AvatarManifest } from '../../../shared/contracts';

export const kelaitaManifest: AvatarManifest = {
  id: 'kelaita',
  display_name: '珂莱塔',
  source_character: '珂莱塔 / 鸣潮 BongoCat 风格',
  renderer: 'live2d',
  model_url: '/assets/kelaita/runtime/kelaita.model3.json',
  core_url: '/vendor/live2dcubismcore.min.js',
  capabilities: {
    renderer: true,
    lip_sync: 'amplitude',
    expressions: [],
    motions: [],
    customization: ['scale'],
    is_3d: false,
    face_morph: false,
  },
};

// The selected asset has eye, gaze, brow, head/body, breath and mouth parameters.
// Its only exp3 toggles the original watermark, so it is deliberately not exposed as emotion.
// No motion3 or viseme/phoneme timing exists; state poses are parameter-driven and mouth follows actual playback RMS only.
