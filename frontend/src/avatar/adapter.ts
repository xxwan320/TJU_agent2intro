import type { Application } from 'pixi.js';
import type { Live2DModel } from 'pixi-live2d-display/cubism4';
import type { AdapterResult, AvatarAdapter, AvatarState } from '../../../shared/contracts';
import { kelaitaManifest } from './manifest';
import { VrmAvatarAdapter } from './vrm/adapter';
import { vrmAvatarEnabled } from './vrm/flag';

type CoreModel = {
  setParameterValueById(id: string, value: number, weight?: number): void;
};

type BrowserWindow = Window & typeof globalThis & {
  PIXI?: typeof import('pixi.js');
  Live2DCubismCore?: unknown;
};

let coreLoad: Promise<void> | undefined;

function loadCubismCore(url: string): Promise<void> {
  const browser = window as BrowserWindow;
  if (browser.Live2DCubismCore) return Promise.resolve();
  if (coreLoad) return coreLoad;

  coreLoad = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-ai4tju-cubism-core]');
    const script = existing ?? document.createElement('script');
    const fail = () => {
      script.remove();
      coreLoad = undefined;
      reject(new Error('cubism_core_load_failed'));
    };
    script.addEventListener('load', () => browser.Live2DCubismCore ? resolve() : fail(), { once: true });
    script.addEventListener('error', fail, { once: true });
    if (!existing) {
      script.src = url;
      script.async = true;
      script.dataset.ai4tjuCubismCore = 'true';
      document.head.appendChild(script);
    }
  });
  return coreLoad;
}

export async function loadRendererModules(coreUrl = kelaitaManifest.core_url) {
  if (!coreUrl) throw new Error('cubism_core_url_missing');
  const pixi = await import('pixi.js');
  (window as BrowserWindow).PIXI = pixi;
  await loadCubismCore(coreUrl);
  const live2d = await import('pixi-live2d-display/cubism4');
  live2d.Live2DModel.registerTicker(pixi.Ticker);
  return { pixi, live2d };
}

export class KelaitaAvatarAdapter implements AvatarAdapter {
  readonly manifest = kelaitaManifest;
  private app?: Application;
  private model?: Live2DModel;
  private observer?: ResizeObserver;
  private state: AvatarState = 'idle';
  private scale = 0.94;
  private audioLevel = 0;
  private nextBlinkAt = 0;
  private blinkStartedAt: number | null = null;
  private generation = 0;

  async mount(host: HTMLElement): Promise<AdapterResult> {
    this.dispose();
    const generation = this.generation;
    try {
      const { pixi, live2d } = await loadRendererModules();
      if (generation !== this.generation) return { status: 'failed', error_code: 'stopped' };
      if (!pixi.utils.isWebGLSupported()) {
        return { status: 'failed', error_code: 'webgl_unavailable' };
      }

      const app = new pixi.Application({
        antialias: true,
        autoDensity: true,
        backgroundAlpha: 0,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
      });
      const canvas = app.view as HTMLCanvasElement;
      canvas.dataset.avatarRenderer = 'kelaita-live2d';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
      host.appendChild(canvas);
      this.app = app;

      const model = await live2d.Live2DModel.from(kelaitaManifest.model_url, {
        autoInteract: false,
        autoUpdate: false,
      });
      if (generation !== this.generation) {
        model.destroy({ children: true, texture: true, baseTexture: true });
        return { status: 'failed', error_code: 'stopped' };
      }
      model.anchor.set(0.5, 0.5);
      app.stage.addChild(model);
      this.model = model;
      this.nextBlinkAt = performance.now() + 1200;

      const fit = () => this.fit(host);
      this.observer = new ResizeObserver(fit);
      this.observer.observe(host);
      fit();
      model.internalModel.on('beforeModelUpdate', () => this.driveParameters(performance.now()));
      app.ticker.add(() => model.update(app.ticker.deltaMS));
      return { status: 'ready' };
    } catch (error) {
      const code = error instanceof Error && error.message.includes('cubism_core')
        ? 'cubism_core_load_failed'
        : 'avatar_model_load_failed';
      if (generation === this.generation) this.dispose();
      return { status: 'failed', error_code: code };
    }
  }

  setState(state: AvatarState): void {
    this.state = state;
  }

  /** Actual playback amplitude only; independent of A's business presentation state. */
  setAudioLevel(level: number): void {
    this.audioLevel = Number.isFinite(level) ? Math.max(0, Math.min(1, level)) : 0;
    const core = this.model?.internalModel.coreModel as unknown as CoreModel | undefined;
    core?.setParameterValueById('ParamMouthOpenY', this.audioLevel);
  }

  /** Display-only customization supported by the first model. */
  setScale(scale: number): void {
    this.scale = Math.max(0.6, Math.min(1.25, scale));
    const canvas = this.app?.view as HTMLCanvasElement | undefined;
    if (canvas?.parentElement) this.fit(canvas.parentElement);
  }

  dispose(): void {
    this.setAudioLevel(0);
    this.generation += 1;
    this.observer?.disconnect();
    this.observer = undefined;
    const model = this.model;
    const app = this.app;
    this.model = undefined;
    this.app = undefined;
    if (model) {
      model.parent?.removeChild(model);
      model.destroy({ children: true, texture: true, baseTexture: true });
    }
    app?.destroy(true, { children: true });
    this.blinkStartedAt = null;
  }

  private fit(host: HTMLElement): void {
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

  private driveParameters(now: number): void {
    if (!this.model) return;
    const core = this.model.internalModel.coreModel as unknown as CoreModel;
    const seconds = now / 1000;
    let angleX = Math.sin(seconds * 0.55) * 2;
    let angleY = Math.sin(seconds * 0.37) * 1.2;
    let angleZ = Math.sin(seconds * 0.42) * 0.8;
    let bodyZ = angleZ * 0.35;
    let eyeX = 0;
    let browY = 0;

    if (this.state === 'listening') {
      angleX += Math.sin(seconds * 1.8) * 2.5;
      browY = 0.15;
    } else if (this.state === 'thinking') {
      eyeX = Math.sin(seconds * 1.4) * 0.55;
      angleY -= 4;
    } else if (this.state === 'speaking') {
      angleZ += Math.sin(seconds * 2.8) * 1.8;
      bodyZ += Math.sin(seconds * 2.8) * 0.9;
    } else if (this.state === 'error') {
      angleZ = -5;
      browY = -0.35;
    }

    core.setParameterValueById('ParamAngleX', angleX);
    core.setParameterValueById('ParamAngleY', angleY);
    core.setParameterValueById('ParamAngleZ', angleZ);
    core.setParameterValueById('ParamBodyAngleZ', bodyZ);
    core.setParameterValueById('ParamEyeBallX', eyeX);
    core.setParameterValueById('ParamBrowLY', browY);
    core.setParameterValueById('ParamBrowRY', browY);
    core.setParameterValueById('ParamBreath', (Math.sin(seconds * 1.9) + 1) / 2);
    core.setParameterValueById('ParamMouthOpenY', this.audioLevel);

    if (this.state === 'error') {
      core.setParameterValueById('ParamEyeLOpen', 0.72);
      core.setParameterValueById('ParamEyeROpen', 0.72);
      return;
    }
    if (this.blinkStartedAt === null && now >= this.nextBlinkAt) this.blinkStartedAt = now;
    if (this.blinkStartedAt !== null) {
      const phase = (now - this.blinkStartedAt) / 170;
      const openness = phase < 0.5 ? 1 - phase * 2 : (phase - 0.5) * 2;
      core.setParameterValueById('ParamEyeLOpen', Math.max(0, Math.min(1, openness)));
      core.setParameterValueById('ParamEyeROpen', Math.max(0, Math.min(1, openness)));
      if (phase >= 1) {
        this.blinkStartedAt = null;
        this.nextBlinkAt = now + 2200 + Math.random() * 2400;
      }
    } else {
      core.setParameterValueById('ParamEyeLOpen', 1);
      core.setParameterValueById('ParamEyeROpen', 1);
    }
  }
}

export function createAvatarAdapter(): AvatarAdapter {
  // Plug-and-play VRM renderer (external module); Live2D stays the default and untouched.
  if (vrmAvatarEnabled()) return new VrmAvatarAdapter();
  return new KelaitaAvatarAdapter();
}

// Compatibility alias for the M0 assembly; it now mounts the real renderer.
export { KelaitaAvatarAdapter as StubAvatarAdapter };
