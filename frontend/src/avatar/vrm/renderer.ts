import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRMLoaderPlugin, VRMUtils, type VRM } from '@pixiv/three-vrm';
import type { VRMHumanBoneName } from '@pixiv/three-vrm-core';
import type { AdapterResult, AvatarState } from '../../../../shared/contracts';
import { VRM_CUSTOM_MODEL, VRM_FALLBACK_MODEL, vrmManifest } from './manifest';
import { RoamController, roamEnabled } from './roam';
import type { AvatarGesture } from './flag';
import { GESTURE_DURATIONS, IDLE_GESTURES } from './gestures';

const TARGET_HEIGHT = 1.55;
const BASE_CAMERA_Z = 2.1;
/** three-vrm normalizes both VRM 0.x and 1.0 models to face +Z (toward our camera). */
const VRM_BASE_YAW = 0;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export class VrmRenderer {
  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private vrm?: VRM;
  private observer?: ResizeObserver;
  private clock = new THREE.Clock();
  private state: AvatarState = 'idle';
  private audioLevel = 0;
  private smoothedLevel = 0;
  private scale = 1;
  private nextBlinkAt = performance.now() + 1400;
  private blinkStartedAt: number | null = null;
  private roam?: RoamController;
  private walkBlend = 0;
  private greetUntil = 0;
  private baseY = 0;
  private halted = false;
  private screenShown = false;
  private presentationBlend = 0;
  private presentationHost:HTMLElement|null=null;
  private lastFrameAt=0;
  private canvasWidth=190;
  private canvasHeight=260;
  private palmVector=new THREE.Vector3();
  private lastPalm={x:NaN,y:NaN};

  setPresentationHost(host:HTMLElement|null):void{this.presentationHost=host;this.lastPalm={x:NaN,y:NaN};this.roam?.setPresentationHost(host);}
  private companionVideo: { src: string; mime?: string; caption?: string } | null = null;
  private speakMotion: { kind: 'spread' | 'tilt'; startedAt: number; duration: number; sign: 1 | -1 } | null = null;
  private nextSpeakMotionAt = 0;
  private gesture: { kind: AvatarGesture; startedAt: number; duration: number } | null = null;
  private gestureKind: AvatarGesture | null = null;
  private gestureElapsed = 0;
  private gestureWeight = 0;
  private gestureOffsetY = 0;
  private nextGestureAt = performance.now() + 18000 + Math.random() * 22000;
  private walker?: {
    hips?: THREE.Object3D; leftUpperLeg?: THREE.Object3D; leftLowerLeg?: THREE.Object3D; leftFoot?: THREE.Object3D;
    rightUpperLeg?: THREE.Object3D; rightLowerLeg?: THREE.Object3D; rightFoot?: THREE.Object3D;
    leftUpperArm?: THREE.Object3D; leftLowerArm?: THREE.Object3D; leftHand?: THREE.Object3D;
    rightUpperArm?: THREE.Object3D; rightLowerArm?: THREE.Object3D; rightHand?: THREE.Object3D;
  };
  private bones: { head?: THREE.Object3D; chest?: THREE.Object3D; hips?: THREE.Object3D } = {};
  private baseQuaternions = new Map<THREE.Object3D, THREE.Quaternion>();

  async mount(host: HTMLElement): Promise<AdapterResult> {
    this.dispose();
    try {
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      const canvas = renderer.domElement;
      canvas.dataset.avatarRenderer = 'vrm';
      canvas.dataset.avatarState = 'idle';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.display = 'block';
      let renderHost = host;
      if (roamEnabled()) {
        this.roam = new RoamController(() => { this.playGesture('wave'); });
        this.roam.stage.appendChild(canvas);
        renderHost = this.roam.stage;
      } else {
        host.appendChild(canvas);
      }
      this.renderer = renderer;

      const scene = new THREE.Scene();
      this.scene = scene;
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 40);
      this.camera = camera;

      scene.add(new THREE.HemisphereLight(0xffffff, 0x9fb4c8, 1.1));
      const key = new THREE.DirectionalLight(0xffffff, 1.15);
      key.position.set(1.2, 2.2, 2.4);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0x9fd4ff, 0.35);
      rim.position.set(-1.6, 1.4, -1.8);
      scene.add(rim);

      const loader = new GLTFLoader();
      loader.register((parser) => new VRMLoaderPlugin(parser));
      let gltf;
      try {
        gltf = await loader.loadAsync(VRM_CUSTOM_MODEL);
      } catch {
        gltf = await loader.loadAsync(VRM_FALLBACK_MODEL);
      }
      const vrm = gltf.userData.vrm as VRM | undefined;
      if (!vrm) return { status: 'failed', error_code: 'vrm_model_load_failed' };
      VRMUtils.removeUnnecessaryVertices(gltf.scene);
      VRMUtils.combineSkeletons(gltf.scene);
      VRMUtils.rotateVRM0(vrm);
      vrm.scene.traverse((object) => { object.frustumCulled = false; });

      vrm.scene.rotation.y = VRM_BASE_YAW;
      const box = new THREE.Box3().setFromObject(vrm.scene);
      const size = new THREE.Vector3();
      box.getSize(size);
      const factor = size.y > 0 ? TARGET_HEIGHT / size.y : 1;
      vrm.scene.scale.setScalar(factor);
      vrm.scene.position.set(0, -box.min.y * factor, 0);
      this.baseY = vrm.scene.position.y;

      const bone = (name: string) => vrm.humanoid.getNormalizedBoneNode(name as VRMHumanBoneName) ?? undefined;
      this.bones = { head: bone('head'), chest: bone('chest'), hips: bone('hips') };
      this.walker = {
        hips: this.bones.hips, leftUpperLeg: bone('leftUpperLeg'), leftLowerLeg: bone('leftLowerLeg'), leftFoot: bone('leftFoot'),
        rightUpperLeg: bone('rightUpperLeg'), rightLowerLeg: bone('rightLowerLeg'), rightFoot: bone('rightFoot'),
        leftUpperArm: bone('leftUpperArm'), leftLowerArm: bone('leftLowerArm'), leftHand: bone('leftHand'),
        rightUpperArm: bone('rightUpperArm'), rightLowerArm: bone('rightLowerArm'), rightHand: bone('rightHand'),
      };
      for (const item of [...Object.values(this.bones), ...Object.values(this.walker)]) {
        if (item) this.baseQuaternions.set(item, item.quaternion.clone());
      }
      scene.add(vrm.scene);
      this.vrm = vrm;

      // The roaming canvas is reparented out of the original 1:1 avatar host.
      // Size the renderer from its actual 190:260 stage to avoid CSS stretching.
      const fit = () => this.resize(renderHost);
      this.observer = new ResizeObserver(fit);
      this.observer.observe(renderHost);
      fit();
      this.applyScale();

      renderer.setAnimationLoop(() => this.tick());
      const api = window.campusAvatar;
      if (api) {
        api.gesture = (kind) => this.playGesture(kind);
        api.setState = (state) => { this.setState(state); return `state: ${state}`; };
        api.setCompanionVideo = (video) => { this.setCompanionVideo(video); return video ? `video: ${video.src}` : 'video: none'; };
      }
      return { status: 'ready' };
    } catch {
      this.dispose();
      return { status: 'failed', error_code: 'vrm_renderer_unavailable' };
    }
  }

  setState(state: AvatarState): void {
    this.state = state;
    if (this.renderer) this.renderer.domElement.dataset.avatarState = state;
  }

  setAudioLevel(level: number): void {
    this.audioLevel = Number.isFinite(level) ? clamp(level, 0, 1) : 0;
  }

  setScale(scale: number): void {
    this.scale = clamp(scale, 0.6, 1.25);
    this.applyScale();
  }

  /** Interaction gestures: wave hello, hop, dance, nod. */
  playGesture(kind: AvatarGesture): string {
    const duration = GESTURE_DURATIONS[kind];
    if (!duration) return 'gesture: unknown';
    this.gesture = { kind, startedAt: performance.now(), duration };
    if (kind === 'wave' || kind === 'dance') this.greetUntil = performance.now() + duration * 1000;
    return `gesture: ${kind}`;
  }

  /** Bind the clip shown above the palm; null hides the presentation. */
  setCompanionVideo(video: { src: string; mime?: string; caption?: string } | null): void {
    this.companionVideo = video;
    if (this.state === 'speaking') this.roam?.setScreenVideo(video?.src ?? null);
  }

  dispose(): void {
    this.renderer?.setAnimationLoop(null);
    this.observer?.disconnect();
    this.observer = undefined;
    this.roam?.dispose();
    this.roam = undefined;
    const api = window.campusAvatar;
    if (api?.gesture) delete api.gesture;
    if (api?.setState) delete api.setState;
    if (api?.setCompanionVideo) delete api.setCompanionVideo;
    this.walkBlend = 0;
    this.walker = undefined;
    this.gesture = null;
    this.gestureKind = null;
    this.gestureWeight = 0;
    this.gestureOffsetY = 0;
    this.halted = false;
    this.screenShown = false;
    this.presentationBlend = 0;
    this.speakMotion = null;
    this.companionVideo = null;
    if (this.vrm) {
      try { VRMUtils.deepDispose(this.vrm.scene); } catch { /* ignore */ }
      this.vrm = undefined;
    }
    this.scene?.clear();
    this.scene = undefined;
    this.camera = undefined;
    this.bones = {};
    this.baseQuaternions.clear();
    const renderer = this.renderer;
    this.renderer = undefined;
    if (renderer) {
      renderer.dispose();
      renderer.forceContextLoss?.();
      renderer.domElement.remove();
    }
    this.smoothedLevel = 0;
    this.blinkStartedAt = null;
  }

  private applyScale(): void {
    if (!this.camera) return;
    const fov = (this.camera.fov * Math.PI) / 180;
    const heightNeed = TARGET_HEIGHT * 1.18;
    const widthNeed = TARGET_HEIGHT * 0.78;
    const distanceV = heightNeed / (2 * Math.tan(fov / 2));
    const distanceH = widthNeed / (2 * Math.tan(fov / 2) * Math.max(this.camera.aspect, 0.25));
    const distance = Math.max(distanceV, distanceH, BASE_CAMERA_Z) / this.scale;
    this.camera.position.set(0, TARGET_HEIGHT * 0.52, distance);
    this.camera.lookAt(0, TARGET_HEIGHT * 0.5, 0);
  }

  private resize(host: HTMLElement): void {
    if (!this.renderer || !this.camera) return;
    const width = Math.max(1, host.clientWidth || 640);
    const height = Math.max(1, host.clientHeight || 640);
    this.canvasWidth=width;this.canvasHeight=height;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.applyScale();
  }

  private tick(): void {
    if (!this.renderer || !this.scene || !this.camera || !this.vrm) return;
    const now = performance.now();
    const typing=document.activeElement?.matches('textarea,input,[contenteditable="true"]');
    if(document.hidden||now-this.lastFrameAt<1000/(typing?20:30))return;
    this.lastFrameAt=now;
    const delta=Math.min(.1,this.clock.getDelta());
    this.smoothedLevel += (this.audioLevel - this.smoothedLevel) * 0.45;
    // Speech playback keeps the avatar standing in place: roaming halts and the
    // model turns back to face the camera until the utterance ends.
    const speaking = this.state === 'speaking';
    if (speaking && !this.halted) { this.halted = true; this.roam?.halt(); }
    else if (!speaking && this.halted) { this.halted = false; this.roam?.resume(now); }
    if (!speaking) this.roam?.update(now,delta);
    this.advanceGesture(now, speaking);
    const presenting = speaking && !!this.companionVideo;
    this.presentationBlend += ((presenting || this.presentationHost ? 1 : 0) - this.presentationBlend) * Math.min(1, delta * 7);
    if (presenting !== this.screenShown) {
      this.screenShown = presenting;
      if (presenting) {
        this.roam?.showScreen();
        this.roam?.setScreenVideo(this.companionVideo?.src ?? null);
      } else {
        this.roam?.hideScreen();
      }
    }
    if (this.renderer) {
      const data=this.renderer.domElement.dataset;
      const halted=String(this.halted),motion=this.roam?.motion??'none',speak=this.speakMotion?.kind??'none';
      if(data.avatarHalted!==halted)data.avatarHalted=halted;
      if(data.avatarMotion!==motion)data.avatarMotion=motion;
      if(data.avatarSpeakMotion!==speak)data.avatarSpeakMotion=speak;
    }
    const walking = this.roam?.motion === 'walk';
    this.walkBlend += ((walking ? 1 : 0) - this.walkBlend) * Math.min(1, delta * 8);
    if (this.roam) {
      const target = walking ? this.roam.heading : VRM_BASE_YAW;
      const current = this.vrm.scene.rotation.y;
      const difference = Math.atan2(Math.sin(target - current), Math.cos(target - current));
      this.vrm.scene.rotation.y = current + difference * Math.min(1, delta * 8);
      const bob = Math.abs(Math.sin(now / 1000 * 6.4)) * 0.02 * this.walkBlend;
      this.vrm.scene.position.y = this.baseY + bob + this.gestureOffsetY;
    } else {
      this.vrm.scene.position.y = this.baseY + this.gestureOffsetY;
    }
    this.driveExpressions(now);
    this.driveBones(now, delta);
    this.vrm.update(delta);
    // Project the animated palm instead of anchoring the screen to fixed pixels.
    if ((presenting || this.presentationHost) && this.roam) {
      const hand = this.vrm.humanoid.getRawBoneNode('leftHand');
      if (hand) {
        const palm = hand.getWorldPosition(this.palmVector).project(this.camera);
        const x=Math.round((palm.x+1)*this.canvasWidth/2),y=Math.round((1-palm.y)*this.canvasHeight/2);
        if(x!==this.lastPalm.x||y!==this.lastPalm.y){
          this.lastPalm={x,y};
          if(this.presentationHost){this.presentationHost.style.setProperty('--palm-x',`${x}px`);this.presentationHost.style.setProperty('--palm-y',`${y}px`);}
          else this.roam.anchorScreen(x,y);
        }
      }
    }
    this.renderer.render(this.scene, this.camera);
  }

  /** Speaking motions: arms spread or head tilt, triggered at irregular intervals. */
  private speakMotionData(now: number): { kind: 'spread' | 'tilt' | null; env: number; sign: 1 | -1 } {
    if (this.state !== 'speaking') {
      this.speakMotion = null;
      return { kind: null, env: 0, sign: 1 };
    }
    if (!this.speakMotion && now >= this.nextSpeakMotionAt) {
      const kind = this.companionVideo || this.presentationHost ? 'tilt' : Math.random() < 0.55 ? 'spread' : 'tilt';
      this.speakMotion = { kind, startedAt: now, duration: 1.3 + Math.random() * 0.7, sign: Math.random() < 0.5 ? -1 : 1 };
      this.nextSpeakMotionAt = now + 3200 + Math.random() * 4200;
    }
    if (!this.speakMotion) return { kind: null, env: 0, sign: 1 };
    const phase = (now - this.speakMotion.startedAt) / 1000 / this.speakMotion.duration;
    if (phase >= 1) {
      this.speakMotion = null;
      return { kind: null, env: 0, sign: 1 };
    }
    return { kind: this.speakMotion.kind, env: Math.sin(Math.PI * phase), sign: this.speakMotion.sign };
  }

  /** Advance the active gesture and occasionally play one while idle. */
  private advanceGesture(now: number, speaking: boolean): void {
    if (speaking) this.gesture = null;
    this.gestureKind = null;
    this.gestureElapsed = 0;
    this.gestureWeight = 0;
    this.gestureOffsetY = 0;
    if (this.gesture) {
      const elapsed = (now - this.gesture.startedAt) / 1000;
      if (elapsed >= this.gesture.duration) {
        this.gesture = null;
      } else {
        const fadeIn = Math.min(1, elapsed / 0.22);
        const fadeOut = Math.min(1, (this.gesture.duration - elapsed) / 0.3);
        this.gestureKind = this.gesture.kind;
        this.gestureElapsed = elapsed;
        this.gestureWeight = Math.max(0, Math.min(fadeIn, fadeOut));
      }
    } else if (!speaking && this.state === 'idle' && (!this.roam || this.roam.motion === 'idle') && now >= this.nextGestureAt) {
      this.playGesture(IDLE_GESTURES[Math.floor(Math.random() * IDLE_GESTURES.length)]);
      this.nextGestureAt = now + 24000 + Math.random() * 30000;
    }
    if (this.gestureKind === 'jump') {
      this.gestureOffsetY = Math.abs(Math.sin(Math.PI * this.gestureElapsed / 0.9)) * 0.12 * this.gestureWeight;
    }
  }

  private driveExpressions(now: number): void {
    const manager = this.vrm?.expressionManager;
    if (!manager) return;
    const seconds = now / 1000;
    let mouth = 0;
    let blink = 0;

    if (this.state === 'speaking') {
      mouth = clamp(this.smoothedLevel * 1.2, 0, 1);
    } else if (this.state === 'listening') {
      mouth = clamp((Math.sin(seconds * 2.2) + 1) * 0.05, 0, 0.1);
    }

    manager.setValue('aa', mouth);
    manager.setValue('happy', this.state === 'listening' ? 0.18 : (now < this.greetUntil ? 0.9 : 0));
    manager.setValue('sad', this.state === 'error' ? 0.55 : 0);
    manager.setValue('lookUp', this.state === 'thinking' ? 0.45 : 0);
    manager.setValue('lookLeft', this.state === 'thinking' ? 0.35 : 0);

    if (this.blinkStartedAt === null && now >= this.nextBlinkAt) this.blinkStartedAt = now;
    if (this.blinkStartedAt !== null) {
      const phase = (now - this.blinkStartedAt) / 150;
      blink = phase < 0.5 ? phase * 2 : (1 - phase) * 2;
      if (phase >= 1) {
        this.blinkStartedAt = null;
        this.nextBlinkAt = now + 2200 + Math.random() * 2400;
      }
    }
    manager.setValue('blink', clamp(blink, 0, 1));
  }

  private driveBones(now: number, delta: number): void {
    void delta;
    const seconds = now / 1000;
    const pose = new Map<THREE.Object3D, { x: number; y: number; z: number }>();
    const add = (bone: THREE.Object3D | undefined, x: number, y: number, z: number) => {
      if (!bone) return;
      const current = pose.get(bone) ?? { x: 0, y: 0, z: 0 };
      pose.set(bone, { x: current.x + x, y: current.y + y, z: current.z + z });
    };
    const blend = this.walkBlend;
    // Relaxed A-pose: normalized left/right arms point +X/-X in T-pose, so
    // they need opposite Z rotations to hang down beside the body.
    if (this.walker) {
      add(this.walker.leftUpperArm, 0, -0.08, -1.25);
      add(this.walker.rightUpperArm, 0, 0.08, 1.25);
      add(this.walker.leftLowerArm, 0.12, 0, 0);
      add(this.walker.rightLowerArm, 0.12, 0, 0);
    }
    if (blend > 0.01 && this.walker) {
      const swing = Math.sin(seconds * 6.4);
      const kneeLeft = Math.max(0, -swing);
      const kneeRight = Math.max(0, swing);
      add(this.walker.leftUpperLeg, swing * 0.55 * blend, 0, 0);
      add(this.walker.rightUpperLeg, -swing * 0.55 * blend, 0, 0);
      add(this.walker.leftLowerLeg, -kneeLeft * 0.75 * blend, 0, 0);
      add(this.walker.rightLowerLeg, -kneeRight * 0.75 * blend, 0, 0);
      add(this.walker.leftFoot, kneeLeft * 0.3 * blend, 0, 0);
      add(this.walker.rightFoot, kneeRight * 0.3 * blend, 0, 0);
      add(this.walker.leftUpperArm, -swing * 0.18 * blend, 0, 0);
      add(this.walker.rightUpperArm, swing * 0.18 * blend, 0, 0);
      add(this.walker.leftLowerArm, 0.1 * blend, 0, 0);
      add(this.walker.rightLowerArm, 0.1 * blend, 0, 0);
    }
    const gesture = this.gestureKind;
    const weight = this.gestureWeight;
    const gestureTime = this.gestureElapsed;
    const motion = this.speakMotionData(now);
    if (motion.kind === 'spread' && motion.env > 0 && this.walker && !this.companionVideo && !this.presentationHost) {
      // Arms open outward and close again, at irregular moments while narrating.
      const spread = motion.env;
      add(this.walker.leftUpperArm, -0.15 * spread, 0, 0.95 * spread);
      add(this.walker.rightUpperArm, -0.15 * spread, 0, -0.95 * spread);
      add(this.walker.leftLowerArm, 0, 0, -0.3 * spread);
      add(this.walker.rightLowerArm, 0, 0, 0.3 * spread);
    }
    if (this.walker && this.presentationBlend > 0.001) {
      const hold = this.presentationBlend;
      // Raise the left forearm sideways, keep the wrist level and palm upward.
      add(this.walker.leftUpperArm, -0.2 * hold, 0.08 * hold, 0.75 * hold);
      add(this.walker.leftLowerArm, -0.12 * hold, -0.15 * hold, 0.65 * hold);
      add(this.walker.leftHand, Math.PI * hold, 0, -0.15 * hold);
      if(this.renderer!.domElement.dataset.avatarPresentation!=='palm')this.renderer!.domElement.dataset.avatarPresentation='palm';
    } else if (this.renderer&&this.renderer.domElement.dataset.avatarPresentation!=='none') this.renderer.domElement.dataset.avatarPresentation = 'none';
    if (gesture && weight > 0 && this.walker) {
      if (gesture === 'wave') {
        add(this.walker.rightUpperArm, -0.12 * weight, 0.08 * weight, -1.7 * weight);
        add(this.walker.rightLowerArm, 0, 0, (-0.8 + Math.sin(gestureTime * 9) * 0.3) * weight);
      } else if (gesture === 'jump') {
        const hop = Math.abs(Math.sin(Math.PI * gestureTime / 0.9));
        add(this.walker.leftUpperArm, 0, 0, 0.95 * weight);
        add(this.walker.rightUpperArm, 0, 0, -0.95 * weight);
        add(this.walker.leftUpperLeg, 0.35 * hop * weight, 0, 0);
        add(this.walker.rightUpperLeg, 0.35 * hop * weight, 0, 0);
        add(this.walker.leftLowerLeg, -0.55 * hop * weight, 0, 0);
        add(this.walker.rightLowerLeg, -0.55 * hop * weight, 0, 0);
      } else if (gesture === 'dance') {
        const sway = Math.sin(gestureTime * 5);
        add(this.walker.leftUpperArm, 0, 0, (0.9 + sway * 0.35) * weight);
        add(this.walker.rightUpperArm, 0, 0, (-0.9 + sway * 0.35) * weight);
        add(this.walker.leftLowerArm, 0, 0, -0.45 * weight);
        add(this.walker.rightLowerArm, 0, 0, 0.45 * weight);
        add(this.bones.hips, 0, 0, sway * 0.16 * weight);
        add(this.bones.chest, 0, 0, Math.sin(gestureTime * 5 + 0.8) * 0.1 * weight);
      }
    }
    let headX = Math.sin(seconds * 0.5) * 0.02;
    let headY = Math.sin(seconds * 0.34) * 0.03;
    let headZ = Math.sin(seconds * 0.4) * 0.015;
    let chestZ = Math.sin(seconds * 0.4) * 0.012;
    let hipsZ = 0;
    if (this.state === 'listening') {
      headY += Math.sin(seconds * 1.6) * 0.05;
      headZ += 0.04;
    } else if (this.state === 'thinking') {
      headX -= 0.05;
      headY += 0.04;
    } else if (this.state === 'speaking') {
      headX += Math.sin(seconds * 2.6) * 0.03;
      chestZ += Math.sin(seconds * 2.6) * 0.01;
    } else if (this.state === 'error') {
      headX += 0.12;
      hipsZ = 0;
    }
    if (motion.kind === 'tilt') headZ += motion.env * motion.sign * 0.22;
    if (gesture === 'wave') headZ += 0.06 * weight;
    else if (gesture === 'nod') headX += Math.sin(gestureTime * 10) * 0.13 * weight;
    else if (gesture === 'jump') headX -= 0.06 * weight;
    else if (gesture === 'dance') {
      headX += Math.sin(gestureTime * 5) * 0.05 * weight;
      headY += Math.sin(gestureTime * 5 + 1) * 0.07 * weight;
    }
    add(this.bones.head, headX, headY, headZ);
    add(this.bones.chest, 0, 0, chestZ);
    add(this.bones.hips, 0, 0, hipsZ);

    const deltaQuaternion = new THREE.Quaternion();
    const euler = new THREE.Euler();
    for (const [bone, rotation] of pose) {
      const base = this.baseQuaternions.get(bone);
      euler.set(rotation.x, rotation.y, rotation.z);
      deltaQuaternion.setFromEuler(euler);
      if (base) bone.quaternion.copy(base).multiply(deltaQuaternion);
      else bone.quaternion.multiply(deltaQuaternion);
    }
  }
}
