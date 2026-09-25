import type { AvatarManifest } from '../../../../shared/contracts';

/** Drop your own VRoid export at this path to replace the sample model; no code change needed. */
export const VRM_CUSTOM_MODEL = '/assets/avatar/vrm/kelaita.vrm';
/** Bundled fallback so the renderer never breaks when the custom model is absent. */
export const VRM_FALLBACK_MODEL = '/assets/avatar/vrm/AliciaSolid_vrm-0.51.vrm';

export const vrmManifest: AvatarManifest = {
  id: 'kelaita-vrm-external',
  display_name: 'VRM 外接形象（实验）',
  source_character: 'AliciaSolid（VRM 官方示例模型，仅本地评估；正式发布请替换为自建 VRoid 模型）',
  renderer: 'vrm',
  model_url: VRM_CUSTOM_MODEL,
  capabilities: {
    renderer: true,
    lip_sync: 'amplitude',
    expressions: ['happy', 'angry', 'sad', 'relaxed', 'surprised', 'blink', 'lookUp', 'lookDown', 'lookLeft', 'lookRight'],
    motions: ['idle', 'listening', 'thinking', 'speaking', 'error'],
    customization: ['scale', 'background'],
    is_3d: true,
    face_morph: true,
  },
};
