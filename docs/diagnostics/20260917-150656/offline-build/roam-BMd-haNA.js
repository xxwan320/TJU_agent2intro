//#region frontend/src/avatar/vrm/manifest.ts
/** Drop your own VRoid export at this path to replace the sample model; no code change needed. */
var VRM_CUSTOM_MODEL = "/assets/avatar/vrm/kelaita.vrm";
/** Bundled fallback so the renderer never breaks when the custom model is absent. */
var VRM_FALLBACK_MODEL = "/assets/avatar/vrm/AliciaSolid_vrm-0.51.vrm";
var vrmManifest = {
	id: "kelaita-vrm-external",
	display_name: "VRM 外接形象（实验）",
	source_character: "AliciaSolid（VRM 官方示例模型，仅本地评估；正式发布请替换为自建 VRoid 模型）",
	renderer: "vrm",
	model_url: VRM_CUSTOM_MODEL,
	capabilities: {
		renderer: true,
		lip_sync: "amplitude",
		expressions: [
			"happy",
			"angry",
			"sad",
			"relaxed",
			"surprised",
			"blink",
			"lookUp",
			"lookDown",
			"lookLeft",
			"lookRight"
		],
		motions: [
			"idle",
			"listening",
			"thinking",
			"speaking",
			"error"
		],
		customization: ["scale", "background"],
		is_3d: true,
		face_morph: true
	}
};
//#endregion
//#region frontend/src/avatar/vrm/roam.ts
function roamEnabled() {
	try {
		const param = new URLSearchParams(window.location.search).get("roam");
		if (param === "0" || param === "off") return false;
		if (param === "1" || param === "on") return true;
		return window.localStorage.getItem("campus.avatar.roam") !== "0";
	} catch {
		return true;
	}
}
function setRoamEnabled(enabled) {
	try {
		if (enabled) window.localStorage.removeItem("campus.avatar.roam");
		else window.localStorage.setItem("campus.avatar.roam", "0");
	} catch {}
}
var OVERLAY_WIDTH = 190;
var OVERLAY_HEIGHT = 260;
var MARGIN = 10;
var WALK_SPEED = 78;
var RoamController = class {
	stage;
	motion = "idle";
	facing = 1;
	/** World-space yaw target (radians) for the current movement direction. */
	heading = Math.PI;
	x = 0;
	y = 48;
	overlay;
	bubble;
	hit;
	targetX;
	targetY;
	idleUntil = 0;
	dragging = false;
	moved = false;
	dragStartX = 0;
	dragStartY = 0;
	dragStartClientX = 0;
	dragStartClientY = 0;
	onGreet;
	onResize = () => this.clampPosition();
	onPointerMove = (event) => this.pointerMove(event);
	onPointerUp = (event) => this.pointerUp(event);
	constructor(onGreet) {
		this.onGreet = onGreet;
		const width = typeof window === "undefined" ? 1200 : window.innerWidth;
		this.x = Math.max(MARGIN, width - OVERLAY_WIDTH - 24);
		this.targetX = this.x;
		this.targetY = this.y;
		this.overlay = document.createElement("div");
		this.overlay.dataset.avatarRoam = "true";
		Object.assign(this.overlay.style, {
			position: "fixed",
			left: "0",
			bottom: "0",
			width: `${OVERLAY_WIDTH}px`,
			height: `${OVERLAY_HEIGHT}px`,
			zIndex: "9999",
			pointerEvents: "none",
			transition: "none"
		});
		this.stage = document.createElement("div");
		Object.assign(this.stage.style, {
			width: "100%",
			height: "100%",
			pointerEvents: "none",
			touchAction: "none"
		});
		this.overlay.appendChild(this.stage);
		const hit = document.createElement("div");
		hit.dataset.avatarHit = "true";
		Object.assign(hit.style, {
			position: "absolute",
			left: "50%",
			bottom: "0",
			width: "96px",
			height: "220px",
			transform: "translateX(-50%)",
			pointerEvents: "auto",
			cursor: "grab"
		});
		this.overlay.appendChild(hit);
		this.hit = hit;
		this.bubble = document.createElement("div");
		Object.assign(this.bubble.style, {
			position: "absolute",
			top: "-6px",
			left: "50%",
			transform: "translate(-50%, -100%)",
			maxWidth: "180px",
			padding: "6px 10px",
			borderRadius: "10px",
			background: "rgba(255,255,255,.95)",
			border: "1px solid #d8e3ec",
			boxShadow: "0 4px 14px rgba(24,58,86,.12)",
			fontSize: "12px",
			color: "#132b46",
			whiteSpace: "nowrap",
			opacity: "0",
			transition: "opacity .25s ease",
			pointerEvents: "none"
		});
		this.overlay.appendChild(this.bubble);
		document.body.appendChild(this.overlay);
		window.addEventListener("resize", this.onResize);
		hit.addEventListener("pointerdown", (event) => this.pointerDown(event));
		hit.addEventListener("click", () => {
			if (!this.moved) this.greet();
		});
		this.applyPosition();
	}
	update(now) {
		if (this.dragging) return;
		if (this.motion === "walk") {
			const step = WALK_SPEED / 1e3 * 16;
			const dx = this.targetX - this.x;
			const dy = this.targetY - this.y;
			const distance = Math.hypot(dx, dy);
			if (distance <= step) {
				this.x = this.targetX;
				this.y = this.targetY;
				this.motion = "idle";
				this.idleUntil = now + 2600 + Math.random() * 4200;
			} else {
				this.x += dx / distance * step;
				this.y += dy / distance * step;
				this.facing = dx < 0 ? -1 : 1;
				this.heading = Math.atan2(-dx, dy);
			}
			this.applyPosition();
		} else if (now >= this.idleUntil) {
			this.targetX = MARGIN + Math.random() * Math.max(1, window.innerWidth - OVERLAY_WIDTH - 20);
			this.targetY = MARGIN + Math.random() * Math.max(1, window.innerHeight - OVERLAY_HEIGHT - 20);
			this.motion = "walk";
		}
	}
	showBubble(text, ms = 2200) {
		this.bubble.textContent = text;
		this.bubble.style.opacity = "1";
		window.setTimeout(() => {
			this.bubble.style.opacity = "0";
		}, ms);
	}
	dispose() {
		window.removeEventListener("resize", this.onResize);
		window.removeEventListener("pointermove", this.onPointerMove);
		window.removeEventListener("pointerup", this.onPointerUp);
		this.overlay.remove();
	}
	greet() {
		this.onGreet();
		this.showBubble("你好呀～我是珂莱塔");
		this.idleUntil = performance.now() + 3200;
	}
	pointerDown(event) {
		this.dragging = true;
		this.moved = false;
		this.dragStartX = this.x;
		this.dragStartY = this.y;
		this.dragStartClientX = event.clientX;
		this.dragStartClientY = event.clientY;
		this.hit.style.cursor = "grabbing";
		window.addEventListener("pointermove", this.onPointerMove);
		window.addEventListener("pointerup", this.onPointerUp);
	}
	pointerMove(event) {
		if (!this.dragging) return;
		const dx = event.clientX - this.dragStartClientX;
		const dy = event.clientY - this.dragStartClientY;
		if (Math.abs(dx) > 4 || Math.abs(dy) > 4) this.moved = true;
		this.x = this.dragStartX + dx;
		this.y = this.dragStartY - dy;
		this.clampPosition();
		this.applyPosition();
	}
	pointerUp(event) {
		if (!this.dragging) return;
		this.dragging = false;
		this.hit.style.cursor = "grab";
		window.removeEventListener("pointermove", this.onPointerMove);
		window.removeEventListener("pointerup", this.onPointerUp);
		this.targetX = this.x;
		this.targetY = this.y;
		this.moved = Math.abs(event.clientX - this.dragStartClientX) > 4 || Math.abs(event.clientY - this.dragStartClientY) > 4;
		this.motion = "idle";
		this.idleUntil = performance.now() + 1800 + Math.random() * 2200;
	}
	clampPosition() {
		const maxX = Math.max(MARGIN, window.innerWidth - OVERLAY_WIDTH - MARGIN);
		const maxY = Math.max(MARGIN, window.innerHeight - OVERLAY_HEIGHT - MARGIN);
		this.x = Math.min(maxX, Math.max(MARGIN, this.x));
		this.y = Math.min(maxY, Math.max(MARGIN, this.y));
		this.targetX = Math.min(maxX, Math.max(MARGIN, this.targetX));
		this.targetY = Math.min(maxY, Math.max(MARGIN, this.targetY));
		this.applyPosition();
	}
	applyPosition() {
		this.overlay.style.transform = `translate(${Math.round(this.x)}px, ${-Math.round(this.y)}px)`;
	}
};
//#endregion
export { VRM_FALLBACK_MODEL as a, VRM_CUSTOM_MODEL as i, roamEnabled as n, vrmManifest as o, setRoamEnabled as r, RoamController as t };
