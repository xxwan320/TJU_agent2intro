import type { AdapterResult, AvatarAdapter, AvatarState } from '../../../../shared/contracts';
import { vrmManifest } from './manifest';
import './flag';

type CompanionVideo = { src: string; mime?: string; caption?: string } | null;

type VrmRendererLike = {
  mount(host: HTMLElement): Promise<AdapterResult>;
  setState(state: AvatarState): void;
  setAudioLevel(level: number): void;
  setScale(scale: number): void;
  setCompanionVideo(video: CompanionVideo): void;
  setPresentationHost(host:HTMLElement|null):void;
  dispose(): void;
};

/** Thin lazy wrapper: three.js / three-vrm are only fetched when this adapter mounts. */
export class VrmAvatarAdapter implements AvatarAdapter {
  readonly manifest = vrmManifest;
  private renderer?: VrmRendererLike;
  private generation = 0;
  private pendingState: AvatarState = 'idle';
  private pendingScale = 1;
  private pendingVideo: CompanionVideo = null;
  private presentationHost:HTMLElement|null=null;

  async mount(host: HTMLElement): Promise<AdapterResult> {
    this.dispose();
    this.generation += 1;
    const generation = this.generation;
    try {
      const { VrmRenderer } = await import('./renderer');
      if (generation !== this.generation) return { status: 'failed', error_code: 'stopped' };
      const renderer = new VrmRenderer();
      this.renderer = renderer;
      const result = await renderer.mount(host);
      if (generation !== this.generation) {
        renderer.dispose();
        return { status: 'failed', error_code: 'stopped' };
      }
      renderer.setState(this.pendingState);
      renderer.setScale(this.pendingScale);
      renderer.setCompanionVideo(this.pendingVideo);
      renderer.setPresentationHost(this.presentationHost);
      return result;
    } catch {
      this.renderer = undefined;
      return { status: 'failed', error_code: 'vrm_renderer_unavailable' };
    }
  }

  setState(state: AvatarState): void {
    this.pendingState = state;
    this.renderer?.setState(state);
  }

  setAudioLevel(level: number): void {
    this.renderer?.setAudioLevel(level);
  }

  setScale(scale: number): void {
    this.pendingScale = scale;
    this.renderer?.setScale(scale);
  }

  setCompanionVideo(video: CompanionVideo): void {
    this.pendingVideo = video;
    this.renderer?.setCompanionVideo(video);
  }

  setPresentationHost(host:HTMLElement|null):void{this.presentationHost=host;this.renderer?.setPresentationHost(host);}

  dispose(): void {
    this.generation += 1;
    this.renderer?.dispose();
    this.renderer = undefined;
  }
}
