// In-page roaming controller for the external VRM avatar (Tianxuanji-style walk).
// Lives entirely in this module: a fixed overlay appended to <body>, no app CSS/JS changes.
export function roamEnabled(): boolean {
  try {
    const param = new URLSearchParams(window.location.search).get('roam');
    if (param === '0' || param === 'off') return false;
    if (param === '1' || param === 'on') return true;
    return window.localStorage.getItem('campus.avatar.roam') !== '0';
  } catch {
    return true;
  }
}

export function setRoamEnabled(enabled: boolean): void {
  try {
    if (enabled) window.localStorage.removeItem('campus.avatar.roam');
    else window.localStorage.setItem('campus.avatar.roam', '0');
  } catch { /* ignore */ }
}

const OVERLAY_WIDTH = 190;
const OVERLAY_HEIGHT = 260;
const MARGIN = 10;
const WALK_SPEED = 78;

/** Convert overlay motion (positive Y moves up the screen) to normalized-VRM yaw. */
export function headingForScreenMotion(dx: number, dy: number): number {
  return Math.atan2(dx, -dy);
}

/** Preserve the avatar's visible screen position when it leaves an in-page presentation dock. */
export function roamPositionForRect(rect: Pick<DOMRect, 'left' | 'bottom'>, viewportHeight: number): {x:number;y:number} {
  return {x: rect.left, y: viewportHeight - rect.bottom};
}

export class RoamController {
  readonly stage: HTMLDivElement;
  motion: 'idle' | 'walk' = 'idle';
  facing: 1 | -1 = 1;
  /** World-space yaw target (radians) for the current movement direction. */
  heading = 0;
  x = 0;
  y = 48;

  private overlay: HTMLDivElement;
  private bubble: HTMLDivElement;
  private screen!: HTMLDivElement;
  private videoElement!: HTMLVideoElement;
  private screenVisible = false;
  private palm = {x: OVERLAY_WIDTH / 2, y: OVERLAY_HEIGHT / 2};
  private dock:HTMLElement|null=null;

  setPresentationHost(host:HTMLElement|null):void{
    const dockedRect=this.dock&&!host?this.overlay.getBoundingClientRect():null;
    this.dock=host;
    (host??document.body).appendChild(this.overlay);
    Object.assign(this.overlay.style,host?{position:'absolute',left:'0',bottom:'0',transform:'none',zIndex:'1'}:{position:'fixed',left:'0',bottom:'0',zIndex:'9999'});
    this.overlay.dataset.avatarDocked=String(!!host);
    this.halt();
    if(!host){
      if(dockedRect){
        const position=roamPositionForRect(dockedRect,window.innerHeight);
        this.x=this.targetX=position.x;
        this.y=this.targetY=position.y;
        this.clampPosition();
      }
      this.resume(performance.now());this.applyPosition();
    }
  }
  private hit!: HTMLDivElement;
  private targetX: number;
  private targetY: number;
  private idleUntil = 0;
  private dragging = false;
  private moved = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private dragStartClientX = 0;
  private dragStartClientY = 0;
  private readonly onGreet: () => void;
  private readonly onResize = () => this.clampPosition();
  private readonly onPointerMove = (event: PointerEvent) => this.pointerMove(event);
  private readonly onPointerUp = (event: PointerEvent) => this.pointerUp(event);

  constructor(onGreet: () => void) {
    this.onGreet = onGreet;
    const width = typeof window === 'undefined' ? 1200 : window.innerWidth;
    this.x = Math.max(MARGIN, width - OVERLAY_WIDTH - 24);
    this.targetX = this.x;
    this.targetY = this.y;

    this.overlay = document.createElement('div');
    this.overlay.dataset.avatarRoam = 'true';
    Object.assign(this.overlay.style, {
      position: 'fixed', left: '0', bottom: '0', width: `${OVERLAY_WIDTH}px`, height: `${OVERLAY_HEIGHT}px`,
      zIndex: '9999', pointerEvents: 'none', transition: 'none',
    } satisfies Partial<CSSStyleDeclaration>);

    this.stage = document.createElement('div');
    Object.assign(this.stage.style, { width: '100%', height: '100%', pointerEvents: 'none', touchAction: 'none' });
    this.overlay.appendChild(this.stage);

    // Only the character body is interactive; the rest of the overlay is click-through.
    const hit = document.createElement('div');
    hit.dataset.avatarHit = 'true';
    Object.assign(hit.style, {
      position: 'absolute', left: '50%', bottom: '0', width: '96px', height: '220px',
      transform: 'translateX(-50%)', pointerEvents: 'auto', cursor: 'grab',
    } satisfies Partial<CSSStyleDeclaration>);
    this.overlay.appendChild(hit);
    this.hit = hit;

    this.bubble = document.createElement('div');
    Object.assign(this.bubble.style, {
      position: 'absolute', top: '-6px', left: '50%', transform: 'translate(-50%, -100%)', maxWidth: '180px',
      padding: '6px 10px', borderRadius: '10px', background: 'rgba(255,255,255,.95)', border: '1px solid #d8e3ec',
      boxShadow: '0 4px 14px rgba(24,58,86,.12)', fontSize: '12px', color: '#132b46', whiteSpace: 'nowrap',
      opacity: '0', transition: 'opacity .25s ease', pointerEvents: 'none',
    } satisfies Partial<CSSStyleDeclaration>);
    this.overlay.appendChild(this.bubble);

    // Narration screen: a blank placeholder until a clip is bound for the POI.
    this.screen = document.createElement('div');
    this.screen.dataset.avatarScreen = 'true';
    Object.assign(this.screen.style, {
      position: 'absolute', left: '0', top: '0',
      width: '176px', height: '99px', borderRadius: '10px', overflow: 'hidden',
      background: '#0d141c', border: '1px solid rgba(255,255,255,.35)',
      boxShadow: '0 8px 20px rgba(10,25,40,.28)', opacity: '0', transition: 'opacity .2s ease',
      pointerEvents: 'none',
    } satisfies Partial<CSSStyleDeclaration>);
    this.videoElement = document.createElement('video');
    this.videoElement.muted = true;
    this.videoElement.loop = true;
    this.videoElement.playsInline = true;
    Object.assign(this.videoElement.style, { width: '100%', height: '100%', objectFit: 'contain', display: 'none' });
    this.videoElement.addEventListener('error', () => this.hideScreen());
    this.overlay.appendChild(this.screen);

    document.body.appendChild(this.overlay);
    window.addEventListener('resize', this.onResize);
    hit.addEventListener('pointerdown', (event) => this.pointerDown(event));
    hit.addEventListener('click', () => { if (!this.moved) this.greet(); });
    this.applyPosition();
  }

  update(now: number, deltaSeconds=1/60): void {
    if(this.dock)return;
    if (this.dragging) return;
    if (this.motion === 'walk') {
      const step = WALK_SPEED * Math.min(deltaSeconds,.1);
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const distance = Math.hypot(dx, dy);
      if (distance <= step) {
        this.x = this.targetX;
        this.y = this.targetY;
        this.motion = 'idle';
        this.idleUntil = now + 2600 + Math.random() * 4200;
      } else {
        this.x += (dx / distance) * step;
        this.y += (dy / distance) * step;
        this.facing = dx < 0 ? -1 : 1;
        // The normalized model faces +Z. Screen up points away from the +Z
        // camera, so map the screen path to world direction (dx, 0, -dy).
        this.heading = headingForScreenMotion(dx, dy);
      }
      this.applyPosition();
    } else if (now >= this.idleUntil) {
      this.targetX = MARGIN + Math.random() * Math.max(1, window.innerWidth - OVERLAY_WIDTH - MARGIN * 2);
      this.targetY = MARGIN + Math.random() * Math.max(1, window.innerHeight - OVERLAY_HEIGHT - MARGIN * 2);
      this.motion = 'walk';
    }
  }

  showBubble(text: string, ms = 2200): void {
    this.bubble.textContent = text;
    this.bubble.style.opacity = '1';
    window.setTimeout(() => { this.bubble.style.opacity = '0'; }, ms);
  }

  /** Show the narration screen while the guide speaks (blank placeholder without a clip). */
  showScreen(): void {
    this.screenVisible = true;
    this.clampPosition();
    this.screen.setAttribute('aria-label', '点位讲解视频');
    this.screen.style.opacity = '1';
    this.anchorScreen(this.palm.x, this.palm.y);
  }

  hideScreen(): void {
    this.screenVisible = false;
    this.screen.style.opacity = '0';
    this.setScreenVideo(null);
  }

  /** Attach the bottom of the clip to the projected palm and keep it in view. */
  anchorScreen(x: number, y: number): void {
    this.palm = {x, y};
    if (!this.screenVisible) return;
    const box = this.overlay.getBoundingClientRect();
    const width = Math.min(176, Math.max(1, window.innerWidth - MARGIN * 2));
    const height = width * 9 / 16;
    // Left hand projects to the right of the camera-facing avatar. The screen
    // extends outwards so the body stays visible while its corner rests on hand.
    const left = Math.min(window.innerWidth - width - MARGIN, Math.max(MARGIN, box.left + x - 18));
    const top = Math.min(window.innerHeight - height - MARGIN, Math.max(MARGIN, box.top + y - height - 5));
    Object.assign(this.screen.style, {left: `${left - box.left}px`, top: `${top - box.top}px`, width: `${width}px`, height: `${height}px`});
  }

  setScreenVideo(src: string | null): void {
    const video = this.videoElement;
    if (!src) {
      video.pause();
      video.remove();
      if (video.dataset.src) {
        video.removeAttribute('src');
        delete video.dataset.src;
        video.load();
      }
      video.style.display = 'none';
      return;
    }
    if (!video.isConnected) this.screen.appendChild(video);
    if (video.dataset.src !== src) {
      video.dataset.src = src;
      video.src = src;
    }
    video.style.display = 'block';
    void video.play().catch(() => undefined);
  }

  /** Stand still (stop walking and cancel the next wander) while the guide speaks. */
  halt(): void {
    this.targetX = this.x;
    this.targetY = this.y;
    this.motion = 'idle';
    this.idleUntil = Number.POSITIVE_INFINITY;
  }

  /** Allow roaming again after speech playback ends. */
  resume(now: number): void {
    this.motion = 'idle';
    this.idleUntil = now + 1200;
  }

  dispose(): void {
    this.setScreenVideo(null);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    this.overlay.remove();
  }

  private greet(): void {
    this.onGreet();
    this.showBubble('你好呀～我是海小棠');
    this.idleUntil = performance.now() + 3200;
  }

  private pointerDown(event: PointerEvent): void {
    if(this.dock)return;
    this.dragging = true;
    this.moved = false;
    this.dragStartX = this.x;
    this.dragStartY = this.y;
    this.dragStartClientX = event.clientX;
    this.dragStartClientY = event.clientY;
    this.hit.style.cursor = 'grabbing';
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
  }

  private pointerMove(event: PointerEvent): void {
    if (!this.dragging) return;
    const dx = event.clientX - this.dragStartClientX;
    const dy = event.clientY - this.dragStartClientY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) this.moved = true;
    this.x = this.dragStartX + dx;
    this.y = this.dragStartY - dy;
    this.clampPosition();
    this.applyPosition();
  }

  private pointerUp(event: PointerEvent): void {
    if (!this.dragging) return;
    this.dragging = false;
    this.hit.style.cursor = 'grab';
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    this.targetX = this.x;
    this.targetY = this.y;
    this.moved = Math.abs(event.clientX - this.dragStartClientX) > 4 || Math.abs(event.clientY - this.dragStartClientY) > 4;
    this.motion = 'idle';
    this.idleUntil = performance.now() + 1800 + Math.random() * 2200;
  }

  private clampPosition(): void {
    const maxX = Math.max(MARGIN, window.innerWidth - OVERLAY_WIDTH - MARGIN - (this.screenVisible ? 140 : 0));
    const maxY = Math.max(MARGIN, window.innerHeight - OVERLAY_HEIGHT - MARGIN);
    this.x = Math.min(maxX, Math.max(MARGIN, this.x));
    this.y = Math.min(maxY, Math.max(MARGIN, this.y));
    this.targetX = Math.min(maxX, Math.max(MARGIN, this.targetX));
    this.targetY = Math.min(maxY, Math.max(MARGIN, this.targetY));
    this.applyPosition();
  }

  private applyPosition(): void {
    if(this.dock)return;
    this.overlay.style.transform = `translate(${Math.round(this.x)}px, ${-Math.round(this.y)}px)`;
  }
}
