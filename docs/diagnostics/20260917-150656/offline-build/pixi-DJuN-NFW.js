import { i as __toESM, t as __commonJSMin } from "./rolldown-runtime-B-lAHAz2.js";
import { $ as Shader, $t as hex2rgb, A as GLFramebuffer, An as RENDERER_TYPE, At as UPDATE_PRIORITY, B as MaskSystem, Bt as Point, C as ContextSystem, Cn as ENV, Ct as getTestContext, D as FilterSystem, Dn as MIPMAP_MODES, Dt as uniformParsers, E as FilterState, En as MASK_TYPES, Et as systems, F as IGLUniformData, Fn as WRAP_MODES, Ft as DEG_TO_RAD, G as QuadUv, Gt as SHAPES, H as Program, Ht as RAD_TO_DEG, I as INSTALLED, It as Ellipse, J as RenderTextureSystem, Jt as CanvasRenderTarget, K as RenderTexture, Kt as Transform, L as ImageBitmapResource, Lt as Matrix, M as GLTexture, Mn as SCALE_MODES, Mt as ExtensionType, N as Geometry, Nn as TARGETS, Nt as extensions, O as Framebuffer, On as MSAA_QUALITY, Ot as Ticker, P as GeometrySystem, Pn as TYPES, Pt as Circle, Q as ScissorSystem, Qt as getResolutionOfUrl, R as ImageResource, Rt as ObservablePoint, S as CanvasResource, Sn as DRAW_MODES, St as generateUniformBufferSync, T as Filter, Tn as GC_MODES, Tt as resources, U as ProjectionSystem, Ut as Rectangle, V as ObjectRenderer, Vt as Polygon, W as Quad, Wt as RoundedRectangle, X as Resource, Xt as createIndicesForQuads, Y as Renderer, Yt as correctBlendMode, Z as SVGResource, Zt as deprecation, _ as BatchShaderGenerator, _n as BLEND_MODES, _t as checkMaxIfStatementsInShader, a as AbstractBatchRenderer, an as premultiplyTintToRgba, at as System, b as Buffer, bn as CLEAR_MODES, bt as defaultVertex$1, c as ArrayResource, cn as string2hex, ct as TextureMatrix, d as BaseRenderTexture, dn as url, dt as UniformGroup, en as hex2string, et as ShaderSystem, f as BaseTexture, fn as utils_exports, ft as VERSION, g as BatchRenderer, gn as ALPHA_MODES, gt as autoDetectResource, h as BatchPluginFactory, hn as settings, ht as autoDetectRenderer, i as TemporaryDisplayObject, in as premultiplyTint, it as StencilSystem, j as GLProgram, jn as SAMPLER_TYPES, jt as Runner, k as FramebufferSystem, kn as PRECISION, kt as TickerPlugin, l as Attribute, ln as trimCanvas, lt as TextureSystem, m as BatchGeometry, mn as isMobile, mt as ViewableBuffer, n as Container, nn as import_eventemitter3, nt as State, o as AbstractMultiResource, on as removeItems, ot as Texture, p as BatchDrawCall, pn as BrowserAdapter, pt as VideoResource, q as RenderTexturePool, qt as groupD8, r as DisplayObject, rn as premultiplyRgba, rt as StateSystem, s as AbstractRenderer, sn as sign, st as TextureGCSystem, t as Bounds, tn as import_earcut, tt as SpriteMaskFilter, u as BaseImageResource, un as uid, ut as TextureUvs, v as BatchSystem, vn as BUFFER_BITS, vt as createUBOElements, w as CubeResource, wn as FORMATS, wt as getUBOData, x as BufferResource, xn as COLOR_MASK_BITS, xt as generateProgram, y as BatchTextureArray, yn as BUFFER_TYPE, yt as defaultFilterVertex, z as MaskData, zt as PI_2 } from "./display-BqAnRZRb.js";
//#region node_modules/promise-polyfill/src/finally.js
/**
* @this {Promise}
*/
function finallyConstructor(callback) {
	var constructor = this.constructor;
	return this.then(function(value) {
		return constructor.resolve(callback()).then(function() {
			return value;
		});
	}, function(reason) {
		return constructor.resolve(callback()).then(function() {
			return constructor.reject(reason);
		});
	});
}
//#endregion
//#region node_modules/promise-polyfill/src/allSettled.js
function allSettled(arr) {
	return new this(function(resolve, reject) {
		if (!(arr && typeof arr.length !== "undefined")) return reject(/* @__PURE__ */ new TypeError(typeof arr + " " + arr + " is not iterable(cannot read property Symbol(Symbol.iterator))"));
		var args = Array.prototype.slice.call(arr);
		if (args.length === 0) return resolve([]);
		var remaining = args.length;
		function res(i, val) {
			if (val && (typeof val === "object" || typeof val === "function")) {
				var then = val.then;
				if (typeof then === "function") {
					then.call(val, function(val) {
						res(i, val);
					}, function(e) {
						args[i] = {
							status: "rejected",
							reason: e
						};
						if (--remaining === 0) resolve(args);
					});
					return;
				}
			}
			args[i] = {
				status: "fulfilled",
				value: val
			};
			if (--remaining === 0) resolve(args);
		}
		for (var i = 0; i < args.length; i++) res(i, args[i]);
	});
}
//#endregion
//#region node_modules/promise-polyfill/src/any.js
/**
* @constructor
*/
function AggregateError(errors, message) {
	this.name = "AggregateError", this.errors = errors;
	this.message = message || "";
}
AggregateError.prototype = Error.prototype;
function any(arr) {
	var P = this;
	return new P(function(resolve, reject) {
		if (!(arr && typeof arr.length !== "undefined")) return reject(/* @__PURE__ */ new TypeError("Promise.any accepts an array"));
		var args = Array.prototype.slice.call(arr);
		if (args.length === 0) return reject();
		var rejectionReasons = [];
		for (var i = 0; i < args.length; i++) try {
			P.resolve(args[i]).then(resolve).catch(function(error) {
				rejectionReasons.push(error);
				if (rejectionReasons.length === args.length) reject(new AggregateError(rejectionReasons, "All promises were rejected"));
			});
		} catch (ex) {
			reject(ex);
		}
	});
}
//#endregion
//#region node_modules/promise-polyfill/src/index.js
var setTimeoutFunc = setTimeout;
function isArray(x) {
	return Boolean(x && typeof x.length !== "undefined");
}
function noop() {}
function bind(fn, thisArg) {
	return function() {
		fn.apply(thisArg, arguments);
	};
}
/**
* @constructor
* @param {Function} fn
*/
function Promise$1(fn) {
	if (!(this instanceof Promise$1)) throw new TypeError("Promises must be constructed via new");
	if (typeof fn !== "function") throw new TypeError("not a function");
	/** @type {!number} */
	this._state = 0;
	/** @type {!boolean} */
	this._handled = false;
	/** @type {Promise|undefined} */
	this._value = void 0;
	/** @type {!Array<!Function>} */
	this._deferreds = [];
	doResolve(fn, this);
}
function handle(self, deferred) {
	while (self._state === 3) self = self._value;
	if (self._state === 0) {
		self._deferreds.push(deferred);
		return;
	}
	self._handled = true;
	Promise$1._immediateFn(function() {
		var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
		if (cb === null) {
			(self._state === 1 ? resolve : reject)(deferred.promise, self._value);
			return;
		}
		var ret;
		try {
			ret = cb(self._value);
		} catch (e) {
			reject(deferred.promise, e);
			return;
		}
		resolve(deferred.promise, ret);
	});
}
function resolve(self, newValue) {
	try {
		if (newValue === self) throw new TypeError("A promise cannot be resolved with itself.");
		if (newValue && (typeof newValue === "object" || typeof newValue === "function")) {
			var then = newValue.then;
			if (newValue instanceof Promise$1) {
				self._state = 3;
				self._value = newValue;
				finale(self);
				return;
			} else if (typeof then === "function") {
				doResolve(bind(then, newValue), self);
				return;
			}
		}
		self._state = 1;
		self._value = newValue;
		finale(self);
	} catch (e) {
		reject(self, e);
	}
}
function reject(self, newValue) {
	self._state = 2;
	self._value = newValue;
	finale(self);
}
function finale(self) {
	if (self._state === 2 && self._deferreds.length === 0) Promise$1._immediateFn(function() {
		if (!self._handled) Promise$1._unhandledRejectionFn(self._value);
	});
	for (var i = 0, len = self._deferreds.length; i < len; i++) handle(self, self._deferreds[i]);
	self._deferreds = null;
}
/**
* @constructor
*/
function Handler(onFulfilled, onRejected, promise) {
	this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
	this.onRejected = typeof onRejected === "function" ? onRejected : null;
	this.promise = promise;
}
/**
* Take a potentially misbehaving resolver function and make sure
* onFulfilled and onRejected are only called once.
*
* Makes no guarantees about asynchrony.
*/
function doResolve(fn, self) {
	var done = false;
	try {
		fn(function(value) {
			if (done) return;
			done = true;
			resolve(self, value);
		}, function(reason) {
			if (done) return;
			done = true;
			reject(self, reason);
		});
	} catch (ex) {
		if (done) return;
		done = true;
		reject(self, ex);
	}
}
Promise$1.prototype["catch"] = function(onRejected) {
	return this.then(null, onRejected);
};
Promise$1.prototype.then = function(onFulfilled, onRejected) {
	var prom = new this.constructor(noop);
	handle(this, new Handler(onFulfilled, onRejected, prom));
	return prom;
};
Promise$1.prototype["finally"] = finallyConstructor;
Promise$1.all = function(arr) {
	return new Promise$1(function(resolve, reject) {
		if (!isArray(arr)) return reject(/* @__PURE__ */ new TypeError("Promise.all accepts an array"));
		var args = Array.prototype.slice.call(arr);
		if (args.length === 0) return resolve([]);
		var remaining = args.length;
		function res(i, val) {
			try {
				if (val && (typeof val === "object" || typeof val === "function")) {
					var then = val.then;
					if (typeof then === "function") {
						then.call(val, function(val) {
							res(i, val);
						}, reject);
						return;
					}
				}
				args[i] = val;
				if (--remaining === 0) resolve(args);
			} catch (ex) {
				reject(ex);
			}
		}
		for (var i = 0; i < args.length; i++) res(i, args[i]);
	});
};
Promise$1.any = any;
Promise$1.allSettled = allSettled;
Promise$1.resolve = function(value) {
	if (value && typeof value === "object" && value.constructor === Promise$1) return value;
	return new Promise$1(function(resolve) {
		resolve(value);
	});
};
Promise$1.reject = function(value) {
	return new Promise$1(function(resolve, reject) {
		reject(value);
	});
};
Promise$1.race = function(arr) {
	return new Promise$1(function(resolve, reject) {
		if (!isArray(arr)) return reject(/* @__PURE__ */ new TypeError("Promise.race accepts an array"));
		for (var i = 0, len = arr.length; i < len; i++) Promise$1.resolve(arr[i]).then(resolve, reject);
	});
};
Promise$1._immediateFn = typeof setImmediate === "function" && function(fn) {
	setImmediate(fn);
} || function(fn) {
	setTimeoutFunc(fn, 0);
};
Promise$1._unhandledRejectionFn = function _unhandledRejectionFn(err) {
	if (typeof console !== "undefined" && console) console.warn("Possible Unhandled Promise Rejection:", err);
};
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
//#endregion
//#region node_modules/@pixi/polyfill/dist/esm/polyfill.mjs
/*!
* @pixi/polyfill - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/polyfill is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
var import_object_assign = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;
	function toObject(val) {
		if (val === null || val === void 0) throw new TypeError("Object.assign cannot be called with null or undefined");
		return Object(val);
	}
	function shouldUseNative() {
		try {
			if (!Object.assign) return false;
			var test1 = /* @__PURE__ */ new String("abc");
			test1[5] = "de";
			if (Object.getOwnPropertyNames(test1)[0] === "5") return false;
			var test2 = {};
			for (var i = 0; i < 10; i++) test2["_" + String.fromCharCode(i)] = i;
			if (Object.getOwnPropertyNames(test2).map(function(n) {
				return test2[n];
			}).join("") !== "0123456789") return false;
			var test3 = {};
			"abcdefghijklmnopqrst".split("").forEach(function(letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") return false;
			return true;
		} catch (err) {
			return false;
		}
	}
	module.exports = shouldUseNative() ? Object.assign : function(target, source) {
		var from;
		var to = toObject(target);
		var symbols;
		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);
			for (var key in from) if (hasOwnProperty.call(from, key)) to[key] = from[key];
			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) if (propIsEnumerable.call(from, symbols[i])) to[symbols[i]] = from[symbols[i]];
			}
		}
		return to;
	};
})))(), 1);
if (typeof globalThis === "undefined") {
	if (typeof self !== "undefined") self.globalThis = self;
	else if (typeof global !== "undefined") global.globalThis = global;
}
if (!globalThis.Promise) globalThis.Promise = Promise$1;
if (!Object.assign) Object.assign = import_object_assign.default;
var ONE_FRAME_TIME = 16;
if (!(Date.now && Date.prototype.getTime)) Date.now = function now() {
	return (/* @__PURE__ */ new Date()).getTime();
};
if (!(globalThis.performance && globalThis.performance.now)) {
	var startTime_1 = Date.now();
	if (!globalThis.performance) globalThis.performance = {};
	globalThis.performance.now = function() {
		return Date.now() - startTime_1;
	};
}
var lastTime = Date.now();
var vendors = [
	"ms",
	"moz",
	"webkit",
	"o"
];
for (var x = 0; x < vendors.length && !globalThis.requestAnimationFrame; ++x) {
	var p = vendors[x];
	globalThis.requestAnimationFrame = globalThis[p + "RequestAnimationFrame"];
	globalThis.cancelAnimationFrame = globalThis[p + "CancelAnimationFrame"] || globalThis[p + "CancelRequestAnimationFrame"];
}
if (!globalThis.requestAnimationFrame) globalThis.requestAnimationFrame = function(callback) {
	if (typeof callback !== "function") throw new TypeError(callback + "is not a function");
	var currentTime = Date.now();
	var delay = ONE_FRAME_TIME + lastTime - currentTime;
	if (delay < 0) delay = 0;
	lastTime = currentTime;
	return globalThis.self.setTimeout(function() {
		lastTime = Date.now();
		callback(performance.now());
	}, delay);
};
if (!globalThis.cancelAnimationFrame) globalThis.cancelAnimationFrame = function(id) {
	return clearTimeout(id);
};
if (!Math.sign) Math.sign = function mathSign(x) {
	x = Number(x);
	if (x === 0 || isNaN(x)) return x;
	return x > 0 ? 1 : -1;
};
if (!Number.isInteger) Number.isInteger = function numberIsInteger(value) {
	return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
};
if (!globalThis.ArrayBuffer) globalThis.ArrayBuffer = Array;
if (!globalThis.Float32Array) globalThis.Float32Array = Array;
if (!globalThis.Uint32Array) globalThis.Uint32Array = Array;
if (!globalThis.Uint16Array) globalThis.Uint16Array = Array;
if (!globalThis.Uint8Array) globalThis.Uint8Array = Array;
if (!globalThis.Int32Array) globalThis.Int32Array = Array;
//#endregion
//#region node_modules/@pixi/accessibility/dist/esm/accessibility.mjs
/*!
* @pixi/accessibility - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/accessibility is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/**
* Default property values of accessible objects
* used by {@link PIXI.AccessibilityManager}.
* @private
* @function accessibleTarget
* @memberof PIXI
* @type {object}
* @example
*      function MyObject() {}
*
*      Object.assign(
*          MyObject.prototype,
*          PIXI.accessibleTarget
*      );
*/
var accessibleTarget = {
	/**
	*  Flag for if the object is accessible. If true AccessibilityManager will overlay a
	*   shadow div with attributes set
	* @member {boolean}
	* @memberof PIXI.DisplayObject#
	*/
	accessible: false,
	/**
	* Sets the title attribute of the shadow div
	* If accessibleTitle AND accessibleHint has not been this will default to 'displayObject [tabIndex]'
	* @member {?string}
	* @memberof PIXI.DisplayObject#
	*/
	accessibleTitle: null,
	/**
	* Sets the aria-label attribute of the shadow div
	* @member {string}
	* @memberof PIXI.DisplayObject#
	*/
	accessibleHint: null,
	/**
	* @member {number}
	* @memberof PIXI.DisplayObject#
	* @private
	* @todo Needs docs.
	*/
	tabIndex: 0,
	/**
	* @member {boolean}
	* @memberof PIXI.DisplayObject#
	* @todo Needs docs.
	*/
	_accessibleActive: false,
	/**
	* @member {boolean}
	* @memberof PIXI.DisplayObject#
	* @todo Needs docs.
	*/
	_accessibleDiv: null,
	/**
	* Specify the type of div the accessible layer is. Screen readers treat the element differently
	* depending on this type. Defaults to button.
	* @member {string}
	* @memberof PIXI.DisplayObject#
	* @default 'button'
	*/
	accessibleType: "button",
	/**
	* Specify the pointer-events the accessible div will use
	* Defaults to auto.
	* @member {string}
	* @memberof PIXI.DisplayObject#
	* @default 'auto'
	*/
	accessiblePointerEvents: "auto",
	/**
	* Setting to false will prevent any children inside this container to
	* be accessible. Defaults to true.
	* @member {boolean}
	* @memberof PIXI.DisplayObject#
	* @default true
	*/
	accessibleChildren: true,
	renderId: -1
};
DisplayObject.mixin(accessibleTarget);
var KEY_CODE_TAB = 9;
var DIV_TOUCH_SIZE = 100;
var DIV_TOUCH_POS_X = 0;
var DIV_TOUCH_POS_Y = 0;
var DIV_TOUCH_ZINDEX = 2;
var DIV_HOOK_SIZE = 1;
var DIV_HOOK_POS_X = -1e3;
var DIV_HOOK_POS_Y = -1e3;
var DIV_HOOK_ZINDEX = 2;
/**
* The Accessibility manager recreates the ability to tab and have content read by screen readers.
* This is very important as it can possibly help people with disabilities access PixiJS content.
*
* A DisplayObject can be made accessible just like it can be made interactive. This manager will map the
* events as if the mouse was being used, minimizing the effort required to implement.
*
* An instance of this class is automatically created by default, and can be found at `renderer.plugins.accessibility`
* @class
* @memberof PIXI
*/
var AccessibilityManager = function() {
	/**
	* @param {PIXI.CanvasRenderer|PIXI.Renderer} renderer - A reference to the current renderer
	*/
	function AccessibilityManager(renderer) {
		/** Setting this to true will visually show the divs. */
		this.debug = false;
		/** Internal variable, see isActive getter. */
		this._isActive = false;
		/** Internal variable, see isMobileAccessibility getter. */
		this._isMobileAccessibility = false;
		/** A simple pool for storing divs. */
		this.pool = [];
		/** This is a tick used to check if an object is no longer being rendered. */
		this.renderId = 0;
		/** The array of currently active accessible items. */
		this.children = [];
		/** Count to throttle div updates on android devices. */
		this.androidUpdateCount = 0;
		/**  The frequency to update the div elements. */
		this.androidUpdateFrequency = 500;
		this._hookDiv = null;
		if (isMobile.tablet || isMobile.phone) this.createTouchHook();
		var div = document.createElement("div");
		div.style.width = DIV_TOUCH_SIZE + "px";
		div.style.height = DIV_TOUCH_SIZE + "px";
		div.style.position = "absolute";
		div.style.top = DIV_TOUCH_POS_X + "px";
		div.style.left = DIV_TOUCH_POS_Y + "px";
		div.style.zIndex = DIV_TOUCH_ZINDEX.toString();
		this.div = div;
		this.renderer = renderer;
		/**
		* pre-bind the functions
		* @type {Function}
		* @private
		*/
		this._onKeyDown = this._onKeyDown.bind(this);
		/**
		* pre-bind the functions
		* @type {Function}
		* @private
		*/
		this._onMouseMove = this._onMouseMove.bind(this);
		globalThis.addEventListener("keydown", this._onKeyDown, false);
	}
	Object.defineProperty(AccessibilityManager.prototype, "isActive", {
		/**
		* Value of `true` if accessibility is currently active and accessibility layers are showing.
		* @member {boolean}
		* @readonly
		*/
		get: function() {
			return this._isActive;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(AccessibilityManager.prototype, "isMobileAccessibility", {
		/**
		* Value of `true` if accessibility is enabled for touch devices.
		* @member {boolean}
		* @readonly
		*/
		get: function() {
			return this._isMobileAccessibility;
		},
		enumerable: false,
		configurable: true
	});
	/**
	* Creates the touch hooks.
	* @private
	*/
	AccessibilityManager.prototype.createTouchHook = function() {
		var _this = this;
		var hookDiv = document.createElement("button");
		hookDiv.style.width = DIV_HOOK_SIZE + "px";
		hookDiv.style.height = DIV_HOOK_SIZE + "px";
		hookDiv.style.position = "absolute";
		hookDiv.style.top = DIV_HOOK_POS_X + "px";
		hookDiv.style.left = DIV_HOOK_POS_Y + "px";
		hookDiv.style.zIndex = DIV_HOOK_ZINDEX.toString();
		hookDiv.style.backgroundColor = "#FF0000";
		hookDiv.title = "select to enable accessibility for this content";
		hookDiv.addEventListener("focus", function() {
			_this._isMobileAccessibility = true;
			_this.activate();
			_this.destroyTouchHook();
		});
		document.body.appendChild(hookDiv);
		this._hookDiv = hookDiv;
	};
	/**
	* Destroys the touch hooks.
	* @private
	*/
	AccessibilityManager.prototype.destroyTouchHook = function() {
		if (!this._hookDiv) return;
		document.body.removeChild(this._hookDiv);
		this._hookDiv = null;
	};
	/**
	* Activating will cause the Accessibility layer to be shown.
	* This is called when a user presses the tab key.
	* @private
	*/
	AccessibilityManager.prototype.activate = function() {
		var _a;
		if (this._isActive) return;
		this._isActive = true;
		globalThis.document.addEventListener("mousemove", this._onMouseMove, true);
		globalThis.removeEventListener("keydown", this._onKeyDown, false);
		this.renderer.on("postrender", this.update, this);
		(_a = this.renderer.view.parentNode) === null || _a === void 0 || _a.appendChild(this.div);
	};
	/**
	* Deactivating will cause the Accessibility layer to be hidden.
	* This is called when a user moves the mouse.
	* @private
	*/
	AccessibilityManager.prototype.deactivate = function() {
		var _a;
		if (!this._isActive || this._isMobileAccessibility) return;
		this._isActive = false;
		globalThis.document.removeEventListener("mousemove", this._onMouseMove, true);
		globalThis.addEventListener("keydown", this._onKeyDown, false);
		this.renderer.off("postrender", this.update);
		(_a = this.div.parentNode) === null || _a === void 0 || _a.removeChild(this.div);
	};
	/**
	* This recursive function will run through the scene graph and add any new accessible objects to the DOM layer.
	* @private
	* @param {PIXI.Container} displayObject - The DisplayObject to check.
	*/
	AccessibilityManager.prototype.updateAccessibleObjects = function(displayObject) {
		if (!displayObject.visible || !displayObject.accessibleChildren) return;
		if (displayObject.accessible && displayObject.interactive) {
			if (!displayObject._accessibleActive) this.addChild(displayObject);
			displayObject.renderId = this.renderId;
		}
		var children = displayObject.children;
		if (children) for (var i = 0; i < children.length; i++) this.updateAccessibleObjects(children[i]);
	};
	/**
	* Before each render this function will ensure that all divs are mapped correctly to their DisplayObjects.
	* @private
	*/
	AccessibilityManager.prototype.update = function() {
		var now = performance.now();
		if (isMobile.android.device && now < this.androidUpdateCount) return;
		this.androidUpdateCount = now + this.androidUpdateFrequency;
		if (!this.renderer.renderingToScreen) return;
		if (this.renderer._lastObjectRendered) this.updateAccessibleObjects(this.renderer._lastObjectRendered);
		var _a = this.renderer.view.getBoundingClientRect(), left = _a.left, top = _a.top, width = _a.width, height = _a.height;
		var _b = this.renderer, viewWidth = _b.width, viewHeight = _b.height, resolution = _b.resolution;
		var sx = width / viewWidth * resolution;
		var sy = height / viewHeight * resolution;
		var div = this.div;
		div.style.left = left + "px";
		div.style.top = top + "px";
		div.style.width = viewWidth + "px";
		div.style.height = viewHeight + "px";
		for (var i = 0; i < this.children.length; i++) {
			var child = this.children[i];
			if (child.renderId !== this.renderId) {
				child._accessibleActive = false;
				removeItems(this.children, i, 1);
				this.div.removeChild(child._accessibleDiv);
				this.pool.push(child._accessibleDiv);
				child._accessibleDiv = null;
				i--;
			} else {
				div = child._accessibleDiv;
				var hitArea = child.hitArea;
				var wt = child.worldTransform;
				if (child.hitArea) {
					div.style.left = (wt.tx + hitArea.x * wt.a) * sx + "px";
					div.style.top = (wt.ty + hitArea.y * wt.d) * sy + "px";
					div.style.width = hitArea.width * wt.a * sx + "px";
					div.style.height = hitArea.height * wt.d * sy + "px";
				} else {
					hitArea = child.getBounds();
					this.capHitArea(hitArea);
					div.style.left = hitArea.x * sx + "px";
					div.style.top = hitArea.y * sy + "px";
					div.style.width = hitArea.width * sx + "px";
					div.style.height = hitArea.height * sy + "px";
					if (div.title !== child.accessibleTitle && child.accessibleTitle !== null) div.title = child.accessibleTitle;
					if (div.getAttribute("aria-label") !== child.accessibleHint && child.accessibleHint !== null) div.setAttribute("aria-label", child.accessibleHint);
				}
				if (child.accessibleTitle !== div.title || child.tabIndex !== div.tabIndex) {
					div.title = child.accessibleTitle;
					div.tabIndex = child.tabIndex;
					if (this.debug) this.updateDebugHTML(div);
				}
			}
		}
		this.renderId++;
	};
	/**
	* private function that will visually add the information to the
	* accessability div
	* @param {HTMLElement} div -
	*/
	AccessibilityManager.prototype.updateDebugHTML = function(div) {
		div.innerHTML = "type: " + div.type + "</br> title : " + div.title + "</br> tabIndex: " + div.tabIndex;
	};
	/**
	* Adjust the hit area based on the bounds of a display object
	* @param {PIXI.Rectangle} hitArea - Bounds of the child
	*/
	AccessibilityManager.prototype.capHitArea = function(hitArea) {
		if (hitArea.x < 0) {
			hitArea.width += hitArea.x;
			hitArea.x = 0;
		}
		if (hitArea.y < 0) {
			hitArea.height += hitArea.y;
			hitArea.y = 0;
		}
		var _a = this.renderer, viewWidth = _a.width, viewHeight = _a.height;
		if (hitArea.x + hitArea.width > viewWidth) hitArea.width = viewWidth - hitArea.x;
		if (hitArea.y + hitArea.height > viewHeight) hitArea.height = viewHeight - hitArea.y;
	};
	/**
	* Adds a DisplayObject to the accessibility manager
	* @private
	* @param {PIXI.DisplayObject} displayObject - The child to make accessible.
	*/
	AccessibilityManager.prototype.addChild = function(displayObject) {
		var div = this.pool.pop();
		if (!div) {
			div = document.createElement("button");
			div.style.width = DIV_TOUCH_SIZE + "px";
			div.style.height = DIV_TOUCH_SIZE + "px";
			div.style.backgroundColor = this.debug ? "rgba(255,255,255,0.5)" : "transparent";
			div.style.position = "absolute";
			div.style.zIndex = DIV_TOUCH_ZINDEX.toString();
			div.style.borderStyle = "none";
			if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1) div.setAttribute("aria-live", "off");
			else div.setAttribute("aria-live", "polite");
			if (navigator.userAgent.match(/rv:.*Gecko\//)) div.setAttribute("aria-relevant", "additions");
			else div.setAttribute("aria-relevant", "text");
			div.addEventListener("click", this._onClick.bind(this));
			div.addEventListener("focus", this._onFocus.bind(this));
			div.addEventListener("focusout", this._onFocusOut.bind(this));
		}
		div.style.pointerEvents = displayObject.accessiblePointerEvents;
		div.type = displayObject.accessibleType;
		if (displayObject.accessibleTitle && displayObject.accessibleTitle !== null) div.title = displayObject.accessibleTitle;
		else if (!displayObject.accessibleHint || displayObject.accessibleHint === null) div.title = "displayObject " + displayObject.tabIndex;
		if (displayObject.accessibleHint && displayObject.accessibleHint !== null) div.setAttribute("aria-label", displayObject.accessibleHint);
		if (this.debug) this.updateDebugHTML(div);
		displayObject._accessibleActive = true;
		displayObject._accessibleDiv = div;
		div.displayObject = displayObject;
		this.children.push(displayObject);
		this.div.appendChild(displayObject._accessibleDiv);
		displayObject._accessibleDiv.tabIndex = displayObject.tabIndex;
	};
	/**
	* Maps the div button press to pixi's InteractionManager (click)
	* @private
	* @param {MouseEvent} e - The click event.
	*/
	AccessibilityManager.prototype._onClick = function(e) {
		var interactionManager = this.renderer.plugins.interaction;
		var displayObject = e.target.displayObject;
		var eventData = interactionManager.eventData;
		interactionManager.dispatchEvent(displayObject, "click", eventData);
		interactionManager.dispatchEvent(displayObject, "pointertap", eventData);
		interactionManager.dispatchEvent(displayObject, "tap", eventData);
	};
	/**
	* Maps the div focus events to pixi's InteractionManager (mouseover)
	* @private
	* @param {FocusEvent} e - The focus event.
	*/
	AccessibilityManager.prototype._onFocus = function(e) {
		if (!e.target.getAttribute("aria-live")) e.target.setAttribute("aria-live", "assertive");
		var interactionManager = this.renderer.plugins.interaction;
		var displayObject = e.target.displayObject;
		var eventData = interactionManager.eventData;
		interactionManager.dispatchEvent(displayObject, "mouseover", eventData);
	};
	/**
	* Maps the div focus events to pixi's InteractionManager (mouseout)
	* @private
	* @param {FocusEvent} e - The focusout event.
	*/
	AccessibilityManager.prototype._onFocusOut = function(e) {
		if (!e.target.getAttribute("aria-live")) e.target.setAttribute("aria-live", "polite");
		var interactionManager = this.renderer.plugins.interaction;
		var displayObject = e.target.displayObject;
		var eventData = interactionManager.eventData;
		interactionManager.dispatchEvent(displayObject, "mouseout", eventData);
	};
	/**
	* Is called when a key is pressed
	* @private
	* @param {KeyboardEvent} e - The keydown event.
	*/
	AccessibilityManager.prototype._onKeyDown = function(e) {
		if (e.keyCode !== KEY_CODE_TAB) return;
		this.activate();
	};
	/**
	* Is called when the mouse moves across the renderer element
	* @private
	* @param {MouseEvent} e - The mouse event.
	*/
	AccessibilityManager.prototype._onMouseMove = function(e) {
		if (e.movementX === 0 && e.movementY === 0) return;
		this.deactivate();
	};
	/** Destroys the accessibility manager */
	AccessibilityManager.prototype.destroy = function() {
		this.destroyTouchHook();
		this.div = null;
		globalThis.document.removeEventListener("mousemove", this._onMouseMove, true);
		globalThis.removeEventListener("keydown", this._onKeyDown);
		this.pool = null;
		this.children = null;
		this.renderer = null;
	};
	/** @ignore */
	AccessibilityManager.extension = {
		name: "accessibility",
		type: [ExtensionType.RendererPlugin, ExtensionType.CanvasRendererPlugin]
	};
	return AccessibilityManager;
}();
//#endregion
//#region node_modules/@pixi/interaction/dist/esm/interaction.mjs
/*!
* @pixi/interaction - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/interaction is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/**
* Holds all information related to an Interaction event
* @memberof PIXI
*/
var InteractionData = function() {
	function InteractionData() {
		/**
		* Pressure applied by the pointing device during the event. A Touch's force property
		* will be represented by this value.
		* @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pressure
		*/
		this.pressure = 0;
		/**
		* From TouchEvents (not PointerEvents triggered by touches), the rotationAngle of the Touch.
		* @see https://developer.mozilla.org/en-US/docs/Web/API/Touch/rotationAngle
		*/
		this.rotationAngle = 0;
		/**
		* Twist of a stylus pointer.
		* @see https://w3c.github.io/pointerevents/#pointerevent-interface
		*/
		this.twist = 0;
		/**
		* Barrel pressure on a stylus pointer.
		* @see https://w3c.github.io/pointerevents/#pointerevent-interface
		*/
		this.tangentialPressure = 0;
		this.global = new Point();
		this.target = null;
		this.originalEvent = null;
		this.identifier = null;
		this.isPrimary = false;
		this.button = 0;
		this.buttons = 0;
		this.width = 0;
		this.height = 0;
		this.tiltX = 0;
		this.tiltY = 0;
		this.pointerType = null;
		this.pressure = 0;
		this.rotationAngle = 0;
		this.twist = 0;
		this.tangentialPressure = 0;
	}
	Object.defineProperty(InteractionData.prototype, "pointerId", {
		/**
		* The unique identifier of the pointer. It will be the same as `identifier`.
		* @readonly
		* @see https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerId
		*/
		get: function() {
			return this.identifier;
		},
		enumerable: false,
		configurable: true
	});
	/**
	* This will return the local coordinates of the specified displayObject for this InteractionData
	* @param displayObject - The DisplayObject that you would like the local
	*  coords off
	* @param point - A Point object in which to store the value, optional (otherwise
	*  will create a new point)
	* @param globalPos - A Point object containing your custom global coords, optional
	*  (otherwise will use the current global coords)
	* @returns - A point containing the coordinates of the InteractionData position relative
	*  to the DisplayObject
	*/
	InteractionData.prototype.getLocalPosition = function(displayObject, point, globalPos) {
		return displayObject.worldTransform.applyInverse(globalPos || this.global, point);
	};
	/**
	* Copies properties from normalized event data.
	* @param {Touch|MouseEvent|PointerEvent} event - The normalized event data
	*/
	InteractionData.prototype.copyEvent = function(event) {
		if ("isPrimary" in event && event.isPrimary) this.isPrimary = true;
		this.button = "button" in event && event.button;
		var buttons = "buttons" in event && event.buttons;
		this.buttons = Number.isInteger(buttons) ? buttons : "which" in event && event.which;
		this.width = "width" in event && event.width;
		this.height = "height" in event && event.height;
		this.tiltX = "tiltX" in event && event.tiltX;
		this.tiltY = "tiltY" in event && event.tiltY;
		this.pointerType = "pointerType" in event && event.pointerType;
		this.pressure = "pressure" in event && event.pressure;
		this.rotationAngle = "rotationAngle" in event && event.rotationAngle;
		this.twist = "twist" in event && event.twist || 0;
		this.tangentialPressure = "tangentialPressure" in event && event.tangentialPressure || 0;
	};
	/** Resets the data for pooling. */
	InteractionData.prototype.reset = function() {
		this.isPrimary = false;
	};
	return InteractionData;
}();
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics$17 = function(d, b) {
	extendStatics$17 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
		d.__proto__ = b;
	} || function(d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	};
	return extendStatics$17(d, b);
};
function __extends$17(d, b) {
	extendStatics$17(d, b);
	function __() {
		this.constructor = d;
	}
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
/**
* Event class that mimics native DOM events.
* @memberof PIXI
*/
var InteractionEvent = function() {
	function InteractionEvent() {
		this.stopped = false;
		this.stopsPropagatingAt = null;
		this.stopPropagationHint = false;
		this.target = null;
		this.currentTarget = null;
		this.type = null;
		this.data = null;
	}
	/** Prevents event from reaching any objects other than the current object. */
	InteractionEvent.prototype.stopPropagation = function() {
		this.stopped = true;
		this.stopPropagationHint = true;
		this.stopsPropagatingAt = this.currentTarget;
	};
	/** Resets the event. */
	InteractionEvent.prototype.reset = function() {
		this.stopped = false;
		this.stopsPropagatingAt = null;
		this.stopPropagationHint = false;
		this.currentTarget = null;
		this.target = null;
	};
	return InteractionEvent;
}();
/**
* DisplayObjects with the {@link PIXI.interactiveTarget} mixin use this class to track interactions
* @class
* @private
* @memberof PIXI
*/
var InteractionTrackingData = function() {
	/**
	* @param {number} pointerId - Unique pointer id of the event
	* @private
	*/
	function InteractionTrackingData(pointerId) {
		this._pointerId = pointerId;
		this._flags = InteractionTrackingData.FLAGS.NONE;
	}
	/**
	*
	* @private
	* @param {number} flag - The interaction flag to set
	* @param {boolean} yn - Should the flag be set or unset
	*/
	InteractionTrackingData.prototype._doSet = function(flag, yn) {
		if (yn) this._flags = this._flags | flag;
		else this._flags = this._flags & ~flag;
	};
	Object.defineProperty(InteractionTrackingData.prototype, "pointerId", {
		/**
		* Unique pointer id of the event
		* @readonly
		* @private
		* @member {number}
		*/
		get: function() {
			return this._pointerId;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(InteractionTrackingData.prototype, "flags", {
		/**
		* State of the tracking data, expressed as bit flags
		* @private
		* @member {number}
		*/
		get: function() {
			return this._flags;
		},
		set: function(flags) {
			this._flags = flags;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(InteractionTrackingData.prototype, "none", {
		/**
		* Is the tracked event inactive (not over or down)?
		* @private
		* @member {number}
		*/
		get: function() {
			return this._flags === InteractionTrackingData.FLAGS.NONE;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(InteractionTrackingData.prototype, "over", {
		/**
		* Is the tracked event over the DisplayObject?
		* @private
		* @member {boolean}
		*/
		get: function() {
			return (this._flags & InteractionTrackingData.FLAGS.OVER) !== 0;
		},
		set: function(yn) {
			this._doSet(InteractionTrackingData.FLAGS.OVER, yn);
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(InteractionTrackingData.prototype, "rightDown", {
		/**
		* Did the right mouse button come down in the DisplayObject?
		* @private
		* @member {boolean}
		*/
		get: function() {
			return (this._flags & InteractionTrackingData.FLAGS.RIGHT_DOWN) !== 0;
		},
		set: function(yn) {
			this._doSet(InteractionTrackingData.FLAGS.RIGHT_DOWN, yn);
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(InteractionTrackingData.prototype, "leftDown", {
		/**
		* Did the left mouse button come down in the DisplayObject?
		* @private
		* @member {boolean}
		*/
		get: function() {
			return (this._flags & InteractionTrackingData.FLAGS.LEFT_DOWN) !== 0;
		},
		set: function(yn) {
			this._doSet(InteractionTrackingData.FLAGS.LEFT_DOWN, yn);
		},
		enumerable: false,
		configurable: true
	});
	InteractionTrackingData.FLAGS = Object.freeze({
		NONE: 0,
		OVER: 1,
		LEFT_DOWN: 2,
		RIGHT_DOWN: 4
	});
	return InteractionTrackingData;
}();
/**
* Strategy how to search through stage tree for interactive objects
* @memberof PIXI
*/
var TreeSearch = function() {
	function TreeSearch() {
		this._tempPoint = new Point();
	}
	/**
	* Recursive implementation for findHit
	* @private
	* @param interactionEvent - event containing the point that
	*  is tested for collision
	* @param displayObject - the displayObject
	*  that will be hit test (recursively crawls its children)
	* @param func - the function that will be called on each interactive object. The
	*  interactionEvent, displayObject and hit will be passed to the function
	* @param hitTest - this indicates if the objects inside should be hit test against the point
	* @param interactive - Whether the displayObject is interactive
	* @returns - Returns true if the displayObject hit the point
	*/
	TreeSearch.prototype.recursiveFindHit = function(interactionEvent, displayObject, func, hitTest, interactive) {
		var _a;
		if (!displayObject || !displayObject.visible) return false;
		var point = interactionEvent.data.global;
		interactive = displayObject.interactive || interactive;
		var hit = false;
		var interactiveParent = interactive;
		var hitTestChildren = true;
		if (displayObject.hitArea) {
			if (hitTest) {
				displayObject.worldTransform.applyInverse(point, this._tempPoint);
				if (!displayObject.hitArea.contains(this._tempPoint.x, this._tempPoint.y)) {
					hitTest = false;
					hitTestChildren = false;
				} else hit = true;
			}
			interactiveParent = false;
		} else if (displayObject._mask) {
			if (hitTest) {
				var maskObject = displayObject._mask.isMaskData ? displayObject._mask.maskObject : displayObject._mask;
				if (maskObject && !((_a = maskObject.containsPoint) === null || _a === void 0 ? void 0 : _a.call(maskObject, point))) hitTest = false;
			}
		}
		if (hitTestChildren && displayObject.interactiveChildren && displayObject.children) {
			var children = displayObject.children;
			for (var i = children.length - 1; i >= 0; i--) {
				var child = children[i];
				var childHit = this.recursiveFindHit(interactionEvent, child, func, hitTest, interactiveParent);
				if (childHit) {
					if (!child.parent) continue;
					interactiveParent = false;
					if (childHit) {
						if (interactionEvent.target) hitTest = false;
						hit = true;
					}
				}
			}
		}
		if (interactive) {
			if (hitTest && !interactionEvent.target) {
				if (!displayObject.hitArea && displayObject.containsPoint) {
					if (displayObject.containsPoint(point)) hit = true;
				}
			}
			if (displayObject.interactive) {
				if (hit && !interactionEvent.target) interactionEvent.target = displayObject;
				if (func) func(interactionEvent, displayObject, !!hit);
			}
		}
		return hit;
	};
	/**
	* This function is provides a neat way of crawling through the scene graph and running a
	* specified function on all interactive objects it finds. It will also take care of hit
	* testing the interactive objects and passes the hit across in the function.
	* @private
	* @param interactionEvent - event containing the point that
	*  is tested for collision
	* @param displayObject - the displayObject
	*  that will be hit test (recursively crawls its children)
	* @param func - the function that will be called on each interactive object. The
	*  interactionEvent, displayObject and hit will be passed to the function
	* @param hitTest - this indicates if the objects inside should be hit test against the point
	* @returns - Returns true if the displayObject hit the point
	*/
	TreeSearch.prototype.findHit = function(interactionEvent, displayObject, func, hitTest) {
		this.recursiveFindHit(interactionEvent, displayObject, func, hitTest, false);
	};
	return TreeSearch;
}();
/**
* Interface for classes that represent a hit area.
*
* It is implemented by the following classes:
* - {@link PIXI.Circle}
* - {@link PIXI.Ellipse}
* - {@link PIXI.Polygon}
* - {@link PIXI.RoundedRectangle}
* @interface IHitArea
* @memberof PIXI
*/
/**
* Checks whether the x and y coordinates given are contained within this area
* @method
* @name contains
* @memberof PIXI.IHitArea#
* @param {number} x - The X coordinate of the point to test
* @param {number} y - The Y coordinate of the point to test
* @returns {boolean} Whether the x/y coordinates are within this area
*/
/**
* Default property values of interactive objects
* Used by {@link PIXI.InteractionManager} to automatically give all DisplayObjects these properties
* @private
* @name interactiveTarget
* @type {object}
* @memberof PIXI
* @example
*      function MyObject() {}
*
*      Object.assign(
*          DisplayObject.prototype,
*          PIXI.interactiveTarget
*      );
*/
var interactiveTarget = {
	interactive: false,
	interactiveChildren: true,
	hitArea: null,
	/**
	* If enabled, the mouse cursor use the pointer behavior when hovered over the displayObject if it is interactive
	* Setting this changes the 'cursor' property to `'pointer'`.
	* @example
	* const sprite = new PIXI.Sprite(texture);
	* sprite.interactive = true;
	* sprite.buttonMode = true;
	* @member {boolean}
	* @memberof PIXI.DisplayObject#
	*/
	get buttonMode() {
		return this.cursor === "pointer";
	},
	set buttonMode(value) {
		if (value) this.cursor = "pointer";
		else if (this.cursor === "pointer") this.cursor = null;
	},
	/**
	* This defines what cursor mode is used when the mouse cursor
	* is hovered over the displayObject.
	* @example
	* const sprite = new PIXI.Sprite(texture);
	* sprite.interactive = true;
	* sprite.cursor = 'wait';
	* @see https://developer.mozilla.org/en/docs/Web/CSS/cursor
	* @member {string}
	* @memberof PIXI.DisplayObject#
	*/
	cursor: null,
	/**
	* Internal set of all active pointers, by identifier
	* @member {Map<number, InteractionTrackingData>}
	* @memberof PIXI.DisplayObject#
	* @private
	*/
	get trackedPointers() {
		if (this._trackedPointers === void 0) this._trackedPointers = {};
		return this._trackedPointers;
	},
	/**
	* Map of all tracked pointers, by identifier. Use trackedPointers to access.
	* @private
	* @type {Map<number, InteractionTrackingData>}
	*/
	_trackedPointers: void 0
};
DisplayObject.mixin(interactiveTarget);
var MOUSE_POINTER_ID = 1;
var hitTestEvent = {
	target: null,
	data: { global: null }
};
/**
* The interaction manager deals with mouse, touch and pointer events.
*
* Any DisplayObject can be interactive if its `interactive` property is set to true.
*
* This manager also supports multitouch.
*
* An instance of this class is automatically created by default, and can be found at `renderer.plugins.interaction`
* @memberof PIXI
*/
var InteractionManager = function(_super) {
	__extends$17(InteractionManager, _super);
	/**
	* @param {PIXI.CanvasRenderer|PIXI.Renderer} renderer - A reference to the current renderer
	* @param options - The options for the manager.
	* @param {boolean} [options.autoPreventDefault=true] - Should the manager automatically prevent default browser actions.
	* @param {number} [options.interactionFrequency=10] - Maximum frequency (ms) at pointer over/out states will be checked.
	* @param {number} [options.useSystemTicker=true] - Whether to add {@link tickerUpdate} to {@link PIXI.Ticker.system}.
	*/
	function InteractionManager(renderer, options) {
		var _this = _super.call(this) || this;
		options = options || {};
		_this.renderer = renderer;
		_this.autoPreventDefault = options.autoPreventDefault !== void 0 ? options.autoPreventDefault : true;
		_this.interactionFrequency = options.interactionFrequency || 10;
		_this.mouse = new InteractionData();
		_this.mouse.identifier = MOUSE_POINTER_ID;
		_this.mouse.global.set(-999999);
		_this.activeInteractionData = {};
		_this.activeInteractionData[MOUSE_POINTER_ID] = _this.mouse;
		_this.interactionDataPool = [];
		_this.eventData = new InteractionEvent();
		_this.interactionDOMElement = null;
		_this.moveWhenInside = false;
		_this.eventsAdded = false;
		_this.tickerAdded = false;
		_this.mouseOverRenderer = !("PointerEvent" in globalThis);
		_this.supportsTouchEvents = "ontouchstart" in globalThis;
		_this.supportsPointerEvents = !!globalThis.PointerEvent;
		_this.onPointerUp = _this.onPointerUp.bind(_this);
		_this.processPointerUp = _this.processPointerUp.bind(_this);
		_this.onPointerCancel = _this.onPointerCancel.bind(_this);
		_this.processPointerCancel = _this.processPointerCancel.bind(_this);
		_this.onPointerDown = _this.onPointerDown.bind(_this);
		_this.processPointerDown = _this.processPointerDown.bind(_this);
		_this.onPointerMove = _this.onPointerMove.bind(_this);
		_this.processPointerMove = _this.processPointerMove.bind(_this);
		_this.onPointerOut = _this.onPointerOut.bind(_this);
		_this.processPointerOverOut = _this.processPointerOverOut.bind(_this);
		_this.onPointerOver = _this.onPointerOver.bind(_this);
		_this.cursorStyles = {
			default: "inherit",
			pointer: "pointer"
		};
		_this.currentCursorMode = null;
		_this.cursor = null;
		_this.resolution = 1;
		_this.delayedEvents = [];
		_this.search = new TreeSearch();
		_this._tempDisplayObject = new TemporaryDisplayObject();
		_this._eventListenerOptions = {
			capture: true,
			passive: false
		};
		/**
		* Fired when a pointer device button (usually a mouse left-button) is pressed on the display
		* object.
		* @event PIXI.InteractionManager#mousedown
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device secondary button (usually a mouse right-button) is pressed
		* on the display object.
		* @event PIXI.InteractionManager#rightdown
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device button (usually a mouse left-button) is released over the display
		* object.
		* @event PIXI.InteractionManager#mouseup
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device secondary button (usually a mouse right-button) is released
		* over the display object.
		* @event PIXI.InteractionManager#rightup
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device button (usually a mouse left-button) is pressed and released on
		* the display object.
		* @event PIXI.InteractionManager#click
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device secondary button (usually a mouse right-button) is pressed
		* and released on the display object.
		* @event PIXI.InteractionManager#rightclick
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device button (usually a mouse left-button) is released outside the
		* display object that initially registered a
		* [mousedown]{@link PIXI.InteractionManager#event:mousedown}.
		* @event PIXI.InteractionManager#mouseupoutside
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device secondary button (usually a mouse right-button) is released
		* outside the display object that initially registered a
		* [rightdown]{@link PIXI.InteractionManager#event:rightdown}.
		* @event PIXI.InteractionManager#rightupoutside
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device (usually a mouse) is moved while over the display object
		* @event PIXI.InteractionManager#mousemove
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device (usually a mouse) is moved onto the display object
		* @event PIXI.InteractionManager#mouseover
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device (usually a mouse) is moved off the display object
		* @event PIXI.InteractionManager#mouseout
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device button is pressed on the display object.
		* @event PIXI.InteractionManager#pointerdown
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device button is released over the display object.
		* Not always fired when some buttons are held down while others are released. In those cases,
		* use [mousedown]{@link PIXI.InteractionManager#event:mousedown} and
		* [mouseup]{@link PIXI.InteractionManager#event:mouseup} instead.
		* @event PIXI.InteractionManager#pointerup
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when the operating system cancels a pointer event
		* @event PIXI.InteractionManager#pointercancel
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device button is pressed and released on the display object.
		* @event PIXI.InteractionManager#pointertap
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device button is released outside the display object that initially
		* registered a [pointerdown]{@link PIXI.InteractionManager#event:pointerdown}.
		* @event PIXI.InteractionManager#pointerupoutside
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device is moved while over the display object
		* @event PIXI.InteractionManager#pointermove
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device is moved onto the display object
		* @event PIXI.InteractionManager#pointerover
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device is moved off the display object
		* @event PIXI.InteractionManager#pointerout
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a touch point is placed on the display object.
		* @event PIXI.InteractionManager#touchstart
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a touch point is removed from the display object.
		* @event PIXI.InteractionManager#touchend
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when the operating system cancels a touch
		* @event PIXI.InteractionManager#touchcancel
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a touch point is placed and removed from the display object.
		* @event PIXI.InteractionManager#tap
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a touch point is removed outside of the display object that initially
		* registered a [touchstart]{@link PIXI.InteractionManager#event:touchstart}.
		* @event PIXI.InteractionManager#touchendoutside
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a touch point is moved along the display object.
		* @event PIXI.InteractionManager#touchmove
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device button (usually a mouse left-button) is pressed on the display.
		* object. DisplayObject's `interactive` property must be set to `true` to fire event.
		*
		* This comes from the @pixi/interaction package.
		* @event PIXI.DisplayObject#mousedown
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device secondary button (usually a mouse right-button) is pressed
		* on the display object. DisplayObject's `interactive` property must be set to `true` to fire event.
		*
		* This comes from the @pixi/interaction package.
		* @event PIXI.DisplayObject#rightdown
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device button (usually a mouse left-button) is released over the display
		* object. DisplayObject's `interactive` property must be set to `true` to fire event.
		*
		* This comes from the @pixi/interaction package.
		* @event PIXI.DisplayObject#mouseup
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device secondary button (usually a mouse right-button) is released
		* over the display object. DisplayObject's `interactive` property must be set to `true` to fire event.
		*
		* This comes from the @pixi/interaction package.
		* @event PIXI.DisplayObject#rightup
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device button (usually a mouse left-button) is pressed and released on
		* the display object. DisplayObject's `interactive` property must be set to `true` to fire event.
		*
		* This comes from the @pixi/interaction package.
		* @event PIXI.DisplayObject#click
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device secondary button (usually a mouse right-button) is pressed
		* and released on the display object. DisplayObject's `interactive` property must be set to `true` to fire event.
		*
		* This comes from the @pixi/interaction package.
		* @event PIXI.DisplayObject#rightclick
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device button (usually a mouse left-button) is released outside the
		* display object that initially registered a
		* [mousedown]{@link PIXI.DisplayObject#event:mousedown}.
		* DisplayObject's `interactive` property must be set to `true` to fire event.
		*
		* This comes from the @pixi/interaction package.
		* @event PIXI.DisplayObject#mouseupoutside
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device secondary button (usually a mouse right-button) is released
		* outside the display object that initially registered a
		* [rightdown]{@link PIXI.DisplayObject#event:rightdown}.
		* DisplayObject's `interactive` property must be set to `true` to fire event.
		*
		* This comes from the @pixi/interaction package.
		* @event PIXI.DisplayObject#rightupoutside
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device (usually a mouse) is moved while over the display object.
		* DisplayObject's `interactive` property must be set to `true` to fire event.
		*
		* This comes from the @pixi/interaction package.
		* @event PIXI.DisplayObject#mousemove
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device (usually a mouse) is moved onto the display object.
		* DisplayObject's `interactive` property must be set to `true` to fire event.
		*
		* This comes from the @pixi/interaction package.
		* @event PIXI.DisplayObject#mouseover
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device (usually a mouse) is moved off the display object.
		* DisplayObject's `interactive` property must be set to `true` to fire event.
		*
		* This comes from the @pixi/interaction package.
		* @event PIXI.DisplayObject#mouseout
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device button is pressed on the display object.
		* DisplayObject's `interactive` property must be set to `true` to fire event.
		*
		* This comes from the @pixi/interaction package.
		* @event PIXI.DisplayObject#pointerdown
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device button is released over the display object.
		* DisplayObject's `interactive` property must be set to `true` to fire event.
		*
		* This comes from the @pixi/interaction package.
		* @event PIXI.DisplayObject#pointerup
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when the operating system cancels a pointer event.
		* DisplayObject's `interactive` property must be set to `true` to fire event.
		*
		* This comes from the @pixi/interaction package.
		* @event PIXI.DisplayObject#pointercancel
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device button is pressed and released on the display object.
		* DisplayObject's `interactive` property must be set to `true` to fire event.
		*
		* This comes from the @pixi/interaction package.
		* @event PIXI.DisplayObject#pointertap
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device button is released outside the display object that initially
		* registered a [pointerdown]{@link PIXI.DisplayObject#event:pointerdown}.
		* DisplayObject's `interactive` property must be set to `true` to fire event.
		*
		* This comes from the @pixi/interaction package.
		* @event PIXI.DisplayObject#pointerupoutside
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device is moved while over the display object.
		* DisplayObject's `interactive` property must be set to `true` to fire event.
		*
		* This comes from the @pixi/interaction package.
		* @event PIXI.DisplayObject#pointermove
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device is moved onto the display object.
		* DisplayObject's `interactive` property must be set to `true` to fire event.
		*
		* This comes from the @pixi/interaction package.
		* @event PIXI.DisplayObject#pointerover
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a pointer device is moved off the display object.
		* DisplayObject's `interactive` property must be set to `true` to fire event.
		*
		* This comes from the @pixi/interaction package.
		* @event PIXI.DisplayObject#pointerout
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a touch point is placed on the display object.
		* DisplayObject's `interactive` property must be set to `true` to fire event.
		*
		* This comes from the @pixi/interaction package.
		* @event PIXI.DisplayObject#touchstart
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a touch point is removed from the display object.
		* DisplayObject's `interactive` property must be set to `true` to fire event.
		*
		* This comes from the @pixi/interaction package.
		* @event PIXI.DisplayObject#touchend
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when the operating system cancels a touch.
		* DisplayObject's `interactive` property must be set to `true` to fire event.
		*
		* This comes from the @pixi/interaction package.
		* @event PIXI.DisplayObject#touchcancel
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a touch point is placed and removed from the display object.
		* DisplayObject's `interactive` property must be set to `true` to fire event.
		*
		* This comes from the @pixi/interaction package.
		* @event PIXI.DisplayObject#tap
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a touch point is removed outside of the display object that initially
		* registered a [touchstart]{@link PIXI.DisplayObject#event:touchstart}.
		* DisplayObject's `interactive` property must be set to `true` to fire event.
		*
		* This comes from the @pixi/interaction package.
		* @event PIXI.DisplayObject#touchendoutside
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		/**
		* Fired when a touch point is moved along the display object.
		* DisplayObject's `interactive` property must be set to `true` to fire event.
		*
		* This comes from the @pixi/interaction package.
		* @event PIXI.DisplayObject#touchmove
		* @param {PIXI.InteractionEvent} event - Interaction event
		*/
		_this._useSystemTicker = options.useSystemTicker !== void 0 ? options.useSystemTicker : true;
		_this.setTargetElement(_this.renderer.view, _this.renderer.resolution);
		return _this;
	}
	Object.defineProperty(InteractionManager.prototype, "useSystemTicker", {
		/**
		* Should the InteractionManager automatically add {@link tickerUpdate} to {@link PIXI.Ticker.system}.
		* @default true
		*/
		get: function() {
			return this._useSystemTicker;
		},
		set: function(useSystemTicker) {
			this._useSystemTicker = useSystemTicker;
			if (useSystemTicker) this.addTickerListener();
			else this.removeTickerListener();
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(InteractionManager.prototype, "lastObjectRendered", {
		/**
		* Last rendered object or temp object.
		* @readonly
		* @protected
		*/
		get: function() {
			return this.renderer._lastObjectRendered || this._tempDisplayObject;
		},
		enumerable: false,
		configurable: true
	});
	/**
	* Hit tests a point against the display tree, returning the first interactive object that is hit.
	* @param globalPoint - A point to hit test with, in global space.
	* @param root - The root display object to start from. If omitted, defaults
	* to the last rendered root of the associated renderer.
	* @returns - The hit display object, if any.
	*/
	InteractionManager.prototype.hitTest = function(globalPoint, root) {
		hitTestEvent.target = null;
		hitTestEvent.data.global = globalPoint;
		if (!root) root = this.lastObjectRendered;
		this.processInteractive(hitTestEvent, root, null, true);
		return hitTestEvent.target;
	};
	/**
	* Sets the DOM element which will receive mouse/touch events. This is useful for when you have
	* other DOM elements on top of the renderers Canvas element. With this you'll be bale to delegate
	* another DOM element to receive those events.
	* @param element - the DOM element which will receive mouse and touch events.
	* @param resolution - The resolution / device pixel ratio of the new element (relative to the canvas).
	*/
	InteractionManager.prototype.setTargetElement = function(element, resolution) {
		if (resolution === void 0) resolution = 1;
		this.removeTickerListener();
		this.removeEvents();
		this.interactionDOMElement = element;
		this.resolution = resolution;
		this.addEvents();
		this.addTickerListener();
	};
	/** Adds the ticker listener. */
	InteractionManager.prototype.addTickerListener = function() {
		if (this.tickerAdded || !this.interactionDOMElement || !this._useSystemTicker) return;
		Ticker.system.add(this.tickerUpdate, this, UPDATE_PRIORITY.INTERACTION);
		this.tickerAdded = true;
	};
	/** Removes the ticker listener. */
	InteractionManager.prototype.removeTickerListener = function() {
		if (!this.tickerAdded) return;
		Ticker.system.remove(this.tickerUpdate, this);
		this.tickerAdded = false;
	};
	/** Registers all the DOM events. */
	InteractionManager.prototype.addEvents = function() {
		if (this.eventsAdded || !this.interactionDOMElement) return;
		var style = this.interactionDOMElement.style;
		if (globalThis.navigator.msPointerEnabled) {
			style.msContentZooming = "none";
			style.msTouchAction = "none";
		} else if (this.supportsPointerEvents) style.touchAction = "none";
		if (this.supportsPointerEvents) {
			globalThis.document.addEventListener("pointermove", this.onPointerMove, this._eventListenerOptions);
			this.interactionDOMElement.addEventListener("pointerdown", this.onPointerDown, this._eventListenerOptions);
			this.interactionDOMElement.addEventListener("pointerleave", this.onPointerOut, this._eventListenerOptions);
			this.interactionDOMElement.addEventListener("pointerover", this.onPointerOver, this._eventListenerOptions);
			globalThis.addEventListener("pointercancel", this.onPointerCancel, this._eventListenerOptions);
			globalThis.addEventListener("pointerup", this.onPointerUp, this._eventListenerOptions);
		} else {
			globalThis.document.addEventListener("mousemove", this.onPointerMove, this._eventListenerOptions);
			this.interactionDOMElement.addEventListener("mousedown", this.onPointerDown, this._eventListenerOptions);
			this.interactionDOMElement.addEventListener("mouseout", this.onPointerOut, this._eventListenerOptions);
			this.interactionDOMElement.addEventListener("mouseover", this.onPointerOver, this._eventListenerOptions);
			globalThis.addEventListener("mouseup", this.onPointerUp, this._eventListenerOptions);
		}
		if (this.supportsTouchEvents) {
			this.interactionDOMElement.addEventListener("touchstart", this.onPointerDown, this._eventListenerOptions);
			this.interactionDOMElement.addEventListener("touchcancel", this.onPointerCancel, this._eventListenerOptions);
			this.interactionDOMElement.addEventListener("touchend", this.onPointerUp, this._eventListenerOptions);
			this.interactionDOMElement.addEventListener("touchmove", this.onPointerMove, this._eventListenerOptions);
		}
		this.eventsAdded = true;
	};
	/** Removes all the DOM events that were previously registered. */
	InteractionManager.prototype.removeEvents = function() {
		if (!this.eventsAdded || !this.interactionDOMElement) return;
		var style = this.interactionDOMElement.style;
		if (globalThis.navigator.msPointerEnabled) {
			style.msContentZooming = "";
			style.msTouchAction = "";
		} else if (this.supportsPointerEvents) style.touchAction = "";
		if (this.supportsPointerEvents) {
			globalThis.document.removeEventListener("pointermove", this.onPointerMove, this._eventListenerOptions);
			this.interactionDOMElement.removeEventListener("pointerdown", this.onPointerDown, this._eventListenerOptions);
			this.interactionDOMElement.removeEventListener("pointerleave", this.onPointerOut, this._eventListenerOptions);
			this.interactionDOMElement.removeEventListener("pointerover", this.onPointerOver, this._eventListenerOptions);
			globalThis.removeEventListener("pointercancel", this.onPointerCancel, this._eventListenerOptions);
			globalThis.removeEventListener("pointerup", this.onPointerUp, this._eventListenerOptions);
		} else {
			globalThis.document.removeEventListener("mousemove", this.onPointerMove, this._eventListenerOptions);
			this.interactionDOMElement.removeEventListener("mousedown", this.onPointerDown, this._eventListenerOptions);
			this.interactionDOMElement.removeEventListener("mouseout", this.onPointerOut, this._eventListenerOptions);
			this.interactionDOMElement.removeEventListener("mouseover", this.onPointerOver, this._eventListenerOptions);
			globalThis.removeEventListener("mouseup", this.onPointerUp, this._eventListenerOptions);
		}
		if (this.supportsTouchEvents) {
			this.interactionDOMElement.removeEventListener("touchstart", this.onPointerDown, this._eventListenerOptions);
			this.interactionDOMElement.removeEventListener("touchcancel", this.onPointerCancel, this._eventListenerOptions);
			this.interactionDOMElement.removeEventListener("touchend", this.onPointerUp, this._eventListenerOptions);
			this.interactionDOMElement.removeEventListener("touchmove", this.onPointerMove, this._eventListenerOptions);
		}
		this.interactionDOMElement = null;
		this.eventsAdded = false;
	};
	/**
	* Updates the state of interactive objects if at least {@link interactionFrequency}
	* milliseconds have passed since the last invocation.
	*
	* Invoked by a throttled ticker update from {@link PIXI.Ticker.system}.
	* @param deltaTime - time delta since the last call
	*/
	InteractionManager.prototype.tickerUpdate = function(deltaTime) {
		this._deltaTime += deltaTime;
		if (this._deltaTime < this.interactionFrequency) return;
		this._deltaTime = 0;
		this.update();
	};
	/** Updates the state of interactive objects. */
	InteractionManager.prototype.update = function() {
		if (!this.interactionDOMElement) return;
		if (this._didMove) {
			this._didMove = false;
			return;
		}
		this.cursor = null;
		for (var k in this.activeInteractionData) if (this.activeInteractionData.hasOwnProperty(k)) {
			var interactionData = this.activeInteractionData[k];
			if (interactionData.originalEvent && interactionData.pointerType !== "touch") {
				var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, interactionData.originalEvent, interactionData);
				this.processInteractive(interactionEvent, this.lastObjectRendered, this.processPointerOverOut, true);
			}
		}
		this.setCursorMode(this.cursor);
	};
	/**
	* Sets the current cursor mode, handling any callbacks or CSS style changes.
	* @param mode - cursor mode, a key from the cursorStyles dictionary
	*/
	InteractionManager.prototype.setCursorMode = function(mode) {
		mode = mode || "default";
		var applyStyles = true;
		if (globalThis.OffscreenCanvas && this.interactionDOMElement instanceof OffscreenCanvas) applyStyles = false;
		if (this.currentCursorMode === mode) return;
		this.currentCursorMode = mode;
		var style = this.cursorStyles[mode];
		if (style) switch (typeof style) {
			case "string":
				if (applyStyles) this.interactionDOMElement.style.cursor = style;
				break;
			case "function":
				style(mode);
				break;
			case "object": if (applyStyles) Object.assign(this.interactionDOMElement.style, style);
		}
		else if (applyStyles && typeof mode === "string" && !Object.prototype.hasOwnProperty.call(this.cursorStyles, mode)) this.interactionDOMElement.style.cursor = mode;
	};
	/**
	* Dispatches an event on the display object that was interacted with.
	* @param displayObject - the display object in question
	* @param eventString - the name of the event (e.g, mousedown)
	* @param eventData - the event data object
	*/
	InteractionManager.prototype.dispatchEvent = function(displayObject, eventString, eventData) {
		if (!eventData.stopPropagationHint || displayObject === eventData.stopsPropagatingAt) {
			eventData.currentTarget = displayObject;
			eventData.type = eventString;
			displayObject.emit(eventString, eventData);
			if (displayObject[eventString]) displayObject[eventString](eventData);
		}
	};
	/**
	* Puts a event on a queue to be dispatched later. This is used to guarantee correct
	* ordering of over/out events.
	* @param displayObject - the display object in question
	* @param eventString - the name of the event (e.g, mousedown)
	* @param eventData - the event data object
	*/
	InteractionManager.prototype.delayDispatchEvent = function(displayObject, eventString, eventData) {
		this.delayedEvents.push({
			displayObject,
			eventString,
			eventData
		});
	};
	/**
	* Maps x and y coords from a DOM object and maps them correctly to the PixiJS view. The
	* resulting value is stored in the point. This takes into account the fact that the DOM
	* element could be scaled and positioned anywhere on the screen.
	* @param point - the point that the result will be stored in
	* @param x - the x coord of the position to map
	* @param y - the y coord of the position to map
	*/
	InteractionManager.prototype.mapPositionToPoint = function(point, x, y) {
		var rect;
		if (!this.interactionDOMElement.parentElement) rect = {
			x: 0,
			y: 0,
			width: this.interactionDOMElement.width,
			height: this.interactionDOMElement.height,
			left: 0,
			top: 0
		};
		else rect = this.interactionDOMElement.getBoundingClientRect();
		var resolutionMultiplier = 1 / this.resolution;
		point.x = (x - rect.left) * (this.interactionDOMElement.width / rect.width) * resolutionMultiplier;
		point.y = (y - rect.top) * (this.interactionDOMElement.height / rect.height) * resolutionMultiplier;
	};
	/**
	* This function is provides a neat way of crawling through the scene graph and running a
	* specified function on all interactive objects it finds. It will also take care of hit
	* testing the interactive objects and passes the hit across in the function.
	* @protected
	* @param interactionEvent - event containing the point that
	*  is tested for collision
	* @param displayObject - the displayObject
	*  that will be hit test (recursively crawls its children)
	* @param func - the function that will be called on each interactive object. The
	*  interactionEvent, displayObject and hit will be passed to the function
	* @param hitTest - indicates whether we want to calculate hits
	*  or just iterate through all interactive objects
	*/
	InteractionManager.prototype.processInteractive = function(interactionEvent, displayObject, func, hitTest) {
		var hit = this.search.findHit(interactionEvent, displayObject, func, hitTest);
		var delayedEvents = this.delayedEvents;
		if (!delayedEvents.length) return hit;
		interactionEvent.stopPropagationHint = false;
		var delayedLen = delayedEvents.length;
		this.delayedEvents = [];
		for (var i = 0; i < delayedLen; i++) {
			var _a = delayedEvents[i], displayObject_1 = _a.displayObject, eventString = _a.eventString, eventData = _a.eventData;
			if (eventData.stopsPropagatingAt === displayObject_1) eventData.stopPropagationHint = true;
			this.dispatchEvent(displayObject_1, eventString, eventData);
		}
		return hit;
	};
	/**
	* Is called when the pointer button is pressed down on the renderer element
	* @param originalEvent - The DOM event of a pointer button being pressed down
	*/
	InteractionManager.prototype.onPointerDown = function(originalEvent) {
		if (this.supportsTouchEvents && originalEvent.pointerType === "touch") return;
		var events = this.normalizeToPointerData(originalEvent);
		if (this.autoPreventDefault && events[0].isNormalized) {
			if (originalEvent.cancelable || !("cancelable" in originalEvent)) originalEvent.preventDefault();
		}
		var eventLen = events.length;
		for (var i = 0; i < eventLen; i++) {
			var event = events[i];
			var interactionData = this.getInteractionDataForPointerId(event);
			var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);
			interactionEvent.data.originalEvent = originalEvent;
			this.processInteractive(interactionEvent, this.lastObjectRendered, this.processPointerDown, true);
			this.emit("pointerdown", interactionEvent);
			if (event.pointerType === "touch") this.emit("touchstart", interactionEvent);
			else if (event.pointerType === "mouse" || event.pointerType === "pen") {
				var isRightButton = event.button === 2;
				this.emit(isRightButton ? "rightdown" : "mousedown", this.eventData);
			}
		}
	};
	/**
	* Processes the result of the pointer down check and dispatches the event if need be
	* @param interactionEvent - The interaction event wrapping the DOM event
	* @param displayObject - The display object that was tested
	* @param hit - the result of the hit test on the display object
	*/
	InteractionManager.prototype.processPointerDown = function(interactionEvent, displayObject, hit) {
		var data = interactionEvent.data;
		var id = interactionEvent.data.identifier;
		if (hit) {
			if (!displayObject.trackedPointers[id]) displayObject.trackedPointers[id] = new InteractionTrackingData(id);
			this.dispatchEvent(displayObject, "pointerdown", interactionEvent);
			if (data.pointerType === "touch") this.dispatchEvent(displayObject, "touchstart", interactionEvent);
			else if (data.pointerType === "mouse" || data.pointerType === "pen") {
				var isRightButton = data.button === 2;
				if (isRightButton) displayObject.trackedPointers[id].rightDown = true;
				else displayObject.trackedPointers[id].leftDown = true;
				this.dispatchEvent(displayObject, isRightButton ? "rightdown" : "mousedown", interactionEvent);
			}
		}
	};
	/**
	* Is called when the pointer button is released on the renderer element
	* @param originalEvent - The DOM event of a pointer button being released
	* @param cancelled - true if the pointer is cancelled
	* @param func - Function passed to {@link processInteractive}
	*/
	InteractionManager.prototype.onPointerComplete = function(originalEvent, cancelled, func) {
		var events = this.normalizeToPointerData(originalEvent);
		var eventLen = events.length;
		var target = originalEvent.target;
		if (originalEvent.composedPath && originalEvent.composedPath().length > 0) target = originalEvent.composedPath()[0];
		var eventAppend = target !== this.interactionDOMElement ? "outside" : "";
		for (var i = 0; i < eventLen; i++) {
			var event = events[i];
			var interactionData = this.getInteractionDataForPointerId(event);
			var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);
			interactionEvent.data.originalEvent = originalEvent;
			this.processInteractive(interactionEvent, this.lastObjectRendered, func, cancelled || !eventAppend);
			this.emit(cancelled ? "pointercancel" : "pointerup" + eventAppend, interactionEvent);
			if (event.pointerType === "mouse" || event.pointerType === "pen") {
				var isRightButton = event.button === 2;
				this.emit(isRightButton ? "rightup" + eventAppend : "mouseup" + eventAppend, interactionEvent);
			} else if (event.pointerType === "touch") {
				this.emit(cancelled ? "touchcancel" : "touchend" + eventAppend, interactionEvent);
				this.releaseInteractionDataForPointerId(event.pointerId);
			}
		}
	};
	/**
	* Is called when the pointer button is cancelled
	* @param event - The DOM event of a pointer button being released
	*/
	InteractionManager.prototype.onPointerCancel = function(event) {
		if (this.supportsTouchEvents && event.pointerType === "touch") return;
		this.onPointerComplete(event, true, this.processPointerCancel);
	};
	/**
	* Processes the result of the pointer cancel check and dispatches the event if need be
	* @param interactionEvent - The interaction event wrapping the DOM event
	* @param displayObject - The display object that was tested
	*/
	InteractionManager.prototype.processPointerCancel = function(interactionEvent, displayObject) {
		var data = interactionEvent.data;
		var id = interactionEvent.data.identifier;
		if (displayObject.trackedPointers[id] !== void 0) {
			delete displayObject.trackedPointers[id];
			this.dispatchEvent(displayObject, "pointercancel", interactionEvent);
			if (data.pointerType === "touch") this.dispatchEvent(displayObject, "touchcancel", interactionEvent);
		}
	};
	/**
	* Is called when the pointer button is released on the renderer element
	* @param event - The DOM event of a pointer button being released
	*/
	InteractionManager.prototype.onPointerUp = function(event) {
		if (this.supportsTouchEvents && event.pointerType === "touch") return;
		this.onPointerComplete(event, false, this.processPointerUp);
	};
	/**
	* Processes the result of the pointer up check and dispatches the event if need be
	* @param interactionEvent - The interaction event wrapping the DOM event
	* @param displayObject - The display object that was tested
	* @param hit - the result of the hit test on the display object
	*/
	InteractionManager.prototype.processPointerUp = function(interactionEvent, displayObject, hit) {
		var data = interactionEvent.data;
		var id = interactionEvent.data.identifier;
		var trackingData = displayObject.trackedPointers[id];
		var isTouch = data.pointerType === "touch";
		var isMouse = data.pointerType === "mouse" || data.pointerType === "pen";
		var isMouseTap = false;
		if (isMouse) {
			var isRightButton = data.button === 2;
			var flags = InteractionTrackingData.FLAGS;
			var test = isRightButton ? flags.RIGHT_DOWN : flags.LEFT_DOWN;
			var isDown = trackingData !== void 0 && trackingData.flags & test;
			if (hit) {
				this.dispatchEvent(displayObject, isRightButton ? "rightup" : "mouseup", interactionEvent);
				if (isDown) {
					this.dispatchEvent(displayObject, isRightButton ? "rightclick" : "click", interactionEvent);
					isMouseTap = true;
				}
			} else if (isDown) this.dispatchEvent(displayObject, isRightButton ? "rightupoutside" : "mouseupoutside", interactionEvent);
			if (trackingData) {
				if (isRightButton) trackingData.rightDown = false;
				else trackingData.leftDown = false;
			}
		}
		if (hit) {
			this.dispatchEvent(displayObject, "pointerup", interactionEvent);
			if (isTouch) this.dispatchEvent(displayObject, "touchend", interactionEvent);
			if (trackingData) {
				if (!isMouse || isMouseTap) this.dispatchEvent(displayObject, "pointertap", interactionEvent);
				if (isTouch) {
					this.dispatchEvent(displayObject, "tap", interactionEvent);
					trackingData.over = false;
				}
			}
		} else if (trackingData) {
			this.dispatchEvent(displayObject, "pointerupoutside", interactionEvent);
			if (isTouch) this.dispatchEvent(displayObject, "touchendoutside", interactionEvent);
		}
		if (trackingData && trackingData.none) delete displayObject.trackedPointers[id];
	};
	/**
	* Is called when the pointer moves across the renderer element
	* @param originalEvent - The DOM event of a pointer moving
	*/
	InteractionManager.prototype.onPointerMove = function(originalEvent) {
		if (this.supportsTouchEvents && originalEvent.pointerType === "touch") return;
		var events = this.normalizeToPointerData(originalEvent);
		if (events[0].pointerType === "mouse" || events[0].pointerType === "pen") {
			this._didMove = true;
			this.cursor = null;
		}
		var eventLen = events.length;
		for (var i = 0; i < eventLen; i++) {
			var event = events[i];
			var interactionData = this.getInteractionDataForPointerId(event);
			var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);
			interactionEvent.data.originalEvent = originalEvent;
			this.processInteractive(interactionEvent, this.lastObjectRendered, this.processPointerMove, true);
			this.emit("pointermove", interactionEvent);
			if (event.pointerType === "touch") this.emit("touchmove", interactionEvent);
			if (event.pointerType === "mouse" || event.pointerType === "pen") this.emit("mousemove", interactionEvent);
		}
		if (events[0].pointerType === "mouse") this.setCursorMode(this.cursor);
	};
	/**
	* Processes the result of the pointer move check and dispatches the event if need be
	* @param interactionEvent - The interaction event wrapping the DOM event
	* @param displayObject - The display object that was tested
	* @param hit - the result of the hit test on the display object
	*/
	InteractionManager.prototype.processPointerMove = function(interactionEvent, displayObject, hit) {
		var data = interactionEvent.data;
		var isTouch = data.pointerType === "touch";
		var isMouse = data.pointerType === "mouse" || data.pointerType === "pen";
		if (isMouse) this.processPointerOverOut(interactionEvent, displayObject, hit);
		if (!this.moveWhenInside || hit) {
			this.dispatchEvent(displayObject, "pointermove", interactionEvent);
			if (isTouch) this.dispatchEvent(displayObject, "touchmove", interactionEvent);
			if (isMouse) this.dispatchEvent(displayObject, "mousemove", interactionEvent);
		}
	};
	/**
	* Is called when the pointer is moved out of the renderer element
	* @private
	* @param {PointerEvent} originalEvent - The DOM event of a pointer being moved out
	*/
	InteractionManager.prototype.onPointerOut = function(originalEvent) {
		if (this.supportsTouchEvents && originalEvent.pointerType === "touch") return;
		var event = this.normalizeToPointerData(originalEvent)[0];
		if (event.pointerType === "mouse") {
			this.mouseOverRenderer = false;
			this.setCursorMode(null);
		}
		var interactionData = this.getInteractionDataForPointerId(event);
		var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);
		interactionEvent.data.originalEvent = event;
		this.processInteractive(interactionEvent, this.lastObjectRendered, this.processPointerOverOut, false);
		this.emit("pointerout", interactionEvent);
		if (event.pointerType === "mouse" || event.pointerType === "pen") this.emit("mouseout", interactionEvent);
		else this.releaseInteractionDataForPointerId(interactionData.identifier);
	};
	/**
	* Processes the result of the pointer over/out check and dispatches the event if need be.
	* @param interactionEvent - The interaction event wrapping the DOM event
	* @param displayObject - The display object that was tested
	* @param hit - the result of the hit test on the display object
	*/
	InteractionManager.prototype.processPointerOverOut = function(interactionEvent, displayObject, hit) {
		var data = interactionEvent.data;
		var id = interactionEvent.data.identifier;
		var isMouse = data.pointerType === "mouse" || data.pointerType === "pen";
		var trackingData = displayObject.trackedPointers[id];
		if (hit && !trackingData) trackingData = displayObject.trackedPointers[id] = new InteractionTrackingData(id);
		if (trackingData === void 0) return;
		if (hit && this.mouseOverRenderer) {
			if (!trackingData.over) {
				trackingData.over = true;
				this.delayDispatchEvent(displayObject, "pointerover", interactionEvent);
				if (isMouse) this.delayDispatchEvent(displayObject, "mouseover", interactionEvent);
			}
			if (isMouse && this.cursor === null) this.cursor = displayObject.cursor;
		} else if (trackingData.over) {
			trackingData.over = false;
			this.dispatchEvent(displayObject, "pointerout", this.eventData);
			if (isMouse) this.dispatchEvent(displayObject, "mouseout", interactionEvent);
			if (trackingData.none) delete displayObject.trackedPointers[id];
		}
	};
	/**
	* Is called when the pointer is moved into the renderer element.
	* @param originalEvent - The DOM event of a pointer button being moved into the renderer view.
	*/
	InteractionManager.prototype.onPointerOver = function(originalEvent) {
		if (this.supportsTouchEvents && originalEvent.pointerType === "touch") return;
		var event = this.normalizeToPointerData(originalEvent)[0];
		var interactionData = this.getInteractionDataForPointerId(event);
		var interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);
		interactionEvent.data.originalEvent = event;
		if (event.pointerType === "mouse") this.mouseOverRenderer = true;
		this.emit("pointerover", interactionEvent);
		if (event.pointerType === "mouse" || event.pointerType === "pen") this.emit("mouseover", interactionEvent);
	};
	/**
	* Get InteractionData for a given pointerId. Store that data as well.
	* @param event - Normalized pointer event, output from normalizeToPointerData.
	* @returns - Interaction data for the given pointer identifier.
	*/
	InteractionManager.prototype.getInteractionDataForPointerId = function(event) {
		var pointerId = event.pointerId;
		var interactionData;
		if (pointerId === MOUSE_POINTER_ID || event.pointerType === "mouse") interactionData = this.mouse;
		else if (this.activeInteractionData[pointerId]) interactionData = this.activeInteractionData[pointerId];
		else {
			interactionData = this.interactionDataPool.pop() || new InteractionData();
			interactionData.identifier = pointerId;
			this.activeInteractionData[pointerId] = interactionData;
		}
		interactionData.copyEvent(event);
		return interactionData;
	};
	/**
	* Return unused InteractionData to the pool, for a given pointerId
	* @param pointerId - Identifier from a pointer event
	*/
	InteractionManager.prototype.releaseInteractionDataForPointerId = function(pointerId) {
		var interactionData = this.activeInteractionData[pointerId];
		if (interactionData) {
			delete this.activeInteractionData[pointerId];
			interactionData.reset();
			this.interactionDataPool.push(interactionData);
		}
	};
	/**
	* Configure an InteractionEvent to wrap a DOM PointerEvent and InteractionData
	* @param interactionEvent - The event to be configured
	* @param pointerEvent - The DOM event that will be paired with the InteractionEvent
	* @param interactionData - The InteractionData that will be paired
	*        with the InteractionEvent
	* @returns - the interaction event that was passed in
	*/
	InteractionManager.prototype.configureInteractionEventForDOMEvent = function(interactionEvent, pointerEvent, interactionData) {
		interactionEvent.data = interactionData;
		this.mapPositionToPoint(interactionData.global, pointerEvent.clientX, pointerEvent.clientY);
		if (pointerEvent.pointerType === "touch") {
			pointerEvent.globalX = interactionData.global.x;
			pointerEvent.globalY = interactionData.global.y;
		}
		interactionData.originalEvent = pointerEvent;
		interactionEvent.reset();
		return interactionEvent;
	};
	/**
	* Ensures that the original event object contains all data that a regular pointer event would have
	* @param {TouchEvent|MouseEvent|PointerEvent} event - The original event data from a touch or mouse event
	* @returns - An array containing a single normalized pointer event, in the case of a pointer
	*  or mouse event, or a multiple normalized pointer events if there are multiple changed touches
	*/
	InteractionManager.prototype.normalizeToPointerData = function(event) {
		var normalizedEvents = [];
		if (this.supportsTouchEvents && event instanceof TouchEvent) for (var i = 0, li = event.changedTouches.length; i < li; i++) {
			var touch = event.changedTouches[i];
			if (typeof touch.button === "undefined") touch.button = event.touches.length ? 1 : 0;
			if (typeof touch.buttons === "undefined") touch.buttons = event.touches.length ? 1 : 0;
			if (typeof touch.isPrimary === "undefined") touch.isPrimary = event.touches.length === 1 && event.type === "touchstart";
			if (typeof touch.width === "undefined") touch.width = touch.radiusX || 1;
			if (typeof touch.height === "undefined") touch.height = touch.radiusY || 1;
			if (typeof touch.tiltX === "undefined") touch.tiltX = 0;
			if (typeof touch.tiltY === "undefined") touch.tiltY = 0;
			if (typeof touch.pointerType === "undefined") touch.pointerType = "touch";
			if (typeof touch.pointerId === "undefined") touch.pointerId = touch.identifier || 0;
			if (typeof touch.pressure === "undefined") touch.pressure = touch.force || .5;
			if (typeof touch.twist === "undefined") touch.twist = 0;
			if (typeof touch.tangentialPressure === "undefined") touch.tangentialPressure = 0;
			if (typeof touch.layerX === "undefined") touch.layerX = touch.offsetX = touch.clientX;
			if (typeof touch.layerY === "undefined") touch.layerY = touch.offsetY = touch.clientY;
			touch.isNormalized = true;
			normalizedEvents.push(touch);
		}
		else if (!globalThis.MouseEvent || event instanceof MouseEvent && (!this.supportsPointerEvents || !(event instanceof globalThis.PointerEvent))) {
			var tempEvent = event;
			if (typeof tempEvent.isPrimary === "undefined") tempEvent.isPrimary = true;
			if (typeof tempEvent.width === "undefined") tempEvent.width = 1;
			if (typeof tempEvent.height === "undefined") tempEvent.height = 1;
			if (typeof tempEvent.tiltX === "undefined") tempEvent.tiltX = 0;
			if (typeof tempEvent.tiltY === "undefined") tempEvent.tiltY = 0;
			if (typeof tempEvent.pointerType === "undefined") tempEvent.pointerType = "mouse";
			if (typeof tempEvent.pointerId === "undefined") tempEvent.pointerId = MOUSE_POINTER_ID;
			if (typeof tempEvent.pressure === "undefined") tempEvent.pressure = .5;
			if (typeof tempEvent.twist === "undefined") tempEvent.twist = 0;
			if (typeof tempEvent.tangentialPressure === "undefined") tempEvent.tangentialPressure = 0;
			tempEvent.isNormalized = true;
			normalizedEvents.push(tempEvent);
		} else normalizedEvents.push(event);
		return normalizedEvents;
	};
	/** Destroys the interaction manager. */
	InteractionManager.prototype.destroy = function() {
		this.removeEvents();
		this.removeTickerListener();
		this.removeAllListeners();
		this.renderer = null;
		this.mouse = null;
		this.eventData = null;
		this.interactionDOMElement = null;
		this.onPointerDown = null;
		this.processPointerDown = null;
		this.onPointerUp = null;
		this.processPointerUp = null;
		this.onPointerCancel = null;
		this.processPointerCancel = null;
		this.onPointerMove = null;
		this.processPointerMove = null;
		this.onPointerOut = null;
		this.processPointerOverOut = null;
		this.onPointerOver = null;
		this.search = null;
	};
	/** @ignore */
	InteractionManager.extension = {
		name: "interaction",
		type: [ExtensionType.RendererPlugin, ExtensionType.CanvasRendererPlugin]
	};
	return InteractionManager;
}(import_eventemitter3.default);
//#endregion
//#region node_modules/@pixi/extract/dist/esm/extract.mjs
/*!
* @pixi/extract - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/extract is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
var TEMP_RECT = new Rectangle();
var BYTES_PER_PIXEL = 4;
/**
* This class provides renderer-specific plugins for exporting content from a renderer.
* For instance, these plugins can be used for saving an Image, Canvas element or for exporting the raw image data (pixels).
*
* Do not instantiate these plugins directly. It is available from the `renderer.plugins` property.
* See {@link PIXI.CanvasRenderer#plugins} or {@link PIXI.Renderer#plugins}.
* @example
* // Create a new app (will auto-add extract plugin to renderer)
* const app = new PIXI.Application();
*
* // Draw a red circle
* const graphics = new PIXI.Graphics()
*     .beginFill(0xFF0000)
*     .drawCircle(0, 0, 50);
*
* // Render the graphics as an HTMLImageElement
* const image = app.renderer.plugins.extract.image(graphics);
* document.body.appendChild(image);
* @memberof PIXI
*/
var Extract = function() {
	/**
	* @param renderer - A reference to the current renderer
	*/
	function Extract(renderer) {
		this.renderer = renderer;
	}
	/**
	* Will return a HTML Image of the target
	* @param target - A displayObject or renderTexture
	*  to convert. If left empty will use the main renderer
	* @param format - Image format, e.g. "image/jpeg" or "image/webp".
	* @param quality - JPEG or Webp compression from 0 to 1. Default is 0.92.
	* @returns - HTML Image of the target
	*/
	Extract.prototype.image = function(target, format, quality) {
		var image = new Image();
		image.src = this.base64(target, format, quality);
		return image;
	};
	/**
	* Will return a base64 encoded string of this target. It works by calling
	*  `Extract.getCanvas` and then running toDataURL on that.
	* @param target - A displayObject or renderTexture
	*  to convert. If left empty will use the main renderer
	* @param format - Image format, e.g. "image/jpeg" or "image/webp".
	* @param quality - JPEG or Webp compression from 0 to 1. Default is 0.92.
	* @returns - A base64 encoded string of the texture.
	*/
	Extract.prototype.base64 = function(target, format, quality) {
		return this.canvas(target).toDataURL(format, quality);
	};
	/**
	* Creates a Canvas element, renders this target to it and then returns it.
	* @param target - A displayObject or renderTexture
	*  to convert. If left empty will use the main renderer
	* @param frame - The frame the extraction is restricted to.
	* @returns - A Canvas element with the texture rendered on.
	*/
	Extract.prototype.canvas = function(target, frame) {
		var _a = this._rawPixels(target, frame), pixels = _a.pixels, width = _a.width, height = _a.height, flipY = _a.flipY;
		var canvasBuffer = new CanvasRenderTarget(width, height, 1);
		var canvasData = canvasBuffer.context.getImageData(0, 0, width, height);
		Extract.arrayPostDivide(pixels, canvasData.data);
		canvasBuffer.context.putImageData(canvasData, 0, 0);
		if (flipY) {
			var target_1 = new CanvasRenderTarget(canvasBuffer.width, canvasBuffer.height, 1);
			target_1.context.scale(1, -1);
			target_1.context.drawImage(canvasBuffer.canvas, 0, -height);
			canvasBuffer.destroy();
			canvasBuffer = target_1;
		}
		return canvasBuffer.canvas;
	};
	/**
	* Will return a one-dimensional array containing the pixel data of the entire texture in RGBA
	* order, with integer values between 0 and 255 (included).
	* @param target - A displayObject or renderTexture
	*  to convert. If left empty will use the main renderer
	* @param frame - The frame the extraction is restricted to.
	* @returns - One-dimensional array containing the pixel data of the entire texture
	*/
	Extract.prototype.pixels = function(target, frame) {
		var pixels = this._rawPixels(target, frame).pixels;
		Extract.arrayPostDivide(pixels, pixels);
		return pixels;
	};
	Extract.prototype._rawPixels = function(target, frame) {
		var renderer = this.renderer;
		var resolution;
		var flipY = false;
		var renderTexture;
		var generated = false;
		if (target) {
			if (target instanceof RenderTexture) renderTexture = target;
			else {
				var multisample = renderer.context.webGLVersion >= 2 ? renderer.multisample : MSAA_QUALITY.NONE;
				renderTexture = this.renderer.generateTexture(target, { multisample });
				if (multisample !== MSAA_QUALITY.NONE) {
					var resolvedTexture = RenderTexture.create({
						width: renderTexture.width,
						height: renderTexture.height
					});
					renderer.framebuffer.bind(renderTexture.framebuffer);
					renderer.framebuffer.blit(resolvedTexture.framebuffer);
					renderer.framebuffer.bind(null);
					renderTexture.destroy(true);
					renderTexture = resolvedTexture;
				}
				generated = true;
			}
		}
		if (renderTexture) {
			resolution = renderTexture.baseTexture.resolution;
			frame = frame !== null && frame !== void 0 ? frame : renderTexture.frame;
			flipY = false;
			renderer.renderTexture.bind(renderTexture);
		} else {
			resolution = renderer.resolution;
			if (!frame) {
				frame = TEMP_RECT;
				frame.width = renderer.width;
				frame.height = renderer.height;
			}
			flipY = true;
			renderer.renderTexture.bind(null);
		}
		var width = Math.round(frame.width * resolution);
		var height = Math.round(frame.height * resolution);
		var pixels = new Uint8Array(BYTES_PER_PIXEL * width * height);
		var gl = renderer.gl;
		gl.readPixels(Math.round(frame.x * resolution), Math.round(frame.y * resolution), width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
		if (generated) renderTexture.destroy(true);
		return {
			pixels,
			width,
			height,
			flipY
		};
	};
	/** Destroys the extract. */
	Extract.prototype.destroy = function() {
		this.renderer = null;
	};
	/**
	* Takes premultiplied pixel data and produces regular pixel data
	* @private
	* @param pixels - array of pixel data
	* @param out - output array
	*/
	Extract.arrayPostDivide = function(pixels, out) {
		for (var i = 0; i < pixels.length; i += 4) {
			var alpha = out[i + 3] = pixels[i + 3];
			if (alpha !== 0) {
				out[i] = Math.round(Math.min(pixels[i] * 255 / alpha, 255));
				out[i + 1] = Math.round(Math.min(pixels[i + 1] * 255 / alpha, 255));
				out[i + 2] = Math.round(Math.min(pixels[i + 2] * 255 / alpha, 255));
			} else {
				out[i] = pixels[i];
				out[i + 1] = pixels[i + 1];
				out[i + 2] = pixels[i + 2];
			}
		}
	};
	/** @ignore */
	Extract.extension = {
		name: "extract",
		type: ExtensionType.RendererPlugin
	};
	return Extract;
}();
//#endregion
//#region node_modules/@pixi/loaders/dist/esm/loaders.mjs
/*!
* @pixi/loaders - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/loaders is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/**
* @memberof PIXI
*/
var SignalBinding = function() {
	/**
	* SignalBinding constructor.
	* @constructs SignalBinding
	* @param {Function} fn - Event handler to be called.
	* @param {boolean} [once=false] - Should this listener be removed after dispatch
	* @param {object} [thisArg] - The context of the callback function.
	* @api private
	*/
	function SignalBinding(fn, once, thisArg) {
		if (once === void 0) once = false;
		this._fn = fn;
		this._once = once;
		this._thisArg = thisArg;
		this._next = this._prev = this._owner = null;
	}
	SignalBinding.prototype.detach = function() {
		if (this._owner === null) return false;
		this._owner.detach(this);
		return true;
	};
	return SignalBinding;
}();
/**
* @param self
* @param node
* @private
*/
function _addSignalBinding(self, node) {
	if (!self._head) {
		self._head = node;
		self._tail = node;
	} else {
		self._tail._next = node;
		node._prev = self._tail;
		self._tail = node;
	}
	node._owner = self;
	return node;
}
/**
* @memberof PIXI
*/
var Signal = function() {
	/**
	* MiniSignal constructor.
	* @example
	* let mySignal = new Signal();
	* let binding = mySignal.add(onSignal);
	* mySignal.dispatch('foo', 'bar');
	* mySignal.detach(binding);
	*/
	function Signal() {
		this._head = this._tail = void 0;
	}
	/**
	* Return an array of attached SignalBinding.
	* @param {boolean} [exists=false] - We only need to know if there are handlers.
	* @returns {PIXI.SignalBinding[] | boolean} Array of attached SignalBinding or Boolean if called with exists = true
	* @api public
	*/
	Signal.prototype.handlers = function(exists) {
		if (exists === void 0) exists = false;
		var node = this._head;
		if (exists) return !!node;
		var ee = [];
		while (node) {
			ee.push(node);
			node = node._next;
		}
		return ee;
	};
	/**
	* Return true if node is a SignalBinding attached to this MiniSignal
	* @param {PIXI.SignalBinding} node - Node to check.
	* @returns {boolean} True if node is attache to mini-signal
	*/
	Signal.prototype.has = function(node) {
		if (!(node instanceof SignalBinding)) throw new Error("MiniSignal#has(): First arg must be a SignalBinding object.");
		return node._owner === this;
	};
	/**
	* Dispaches a signal to all registered listeners.
	* @param {...any} args
	* @returns {boolean} Indication if we've emitted an event.
	*/
	Signal.prototype.dispatch = function() {
		var arguments$1 = arguments;
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments$1[_i];
		var node = this._head;
		if (!node) return false;
		while (node) {
			if (node._once) this.detach(node);
			node._fn.apply(node._thisArg, args);
			node = node._next;
		}
		return true;
	};
	/**
	* Register a new listener.
	* @param {Function} fn - Callback function.
	* @param {object} [thisArg] - The context of the callback function.
	* @returns {PIXI.SignalBinding} The SignalBinding node that was added.
	*/
	Signal.prototype.add = function(fn, thisArg) {
		if (thisArg === void 0) thisArg = null;
		if (typeof fn !== "function") throw new Error("MiniSignal#add(): First arg must be a Function.");
		return _addSignalBinding(this, new SignalBinding(fn, false, thisArg));
	};
	/**
	* Register a new listener that will be executed only once.
	* @param {Function} fn - Callback function.
	* @param {object} [thisArg] - The context of the callback function.
	* @returns {PIXI.SignalBinding} The SignalBinding node that was added.
	*/
	Signal.prototype.once = function(fn, thisArg) {
		if (thisArg === void 0) thisArg = null;
		if (typeof fn !== "function") throw new Error("MiniSignal#once(): First arg must be a Function.");
		return _addSignalBinding(this, new SignalBinding(fn, true, thisArg));
	};
	/**
	* Remove binding object.
	* @param {PIXI.SignalBinding} node - The binding node that will be removed.
	* @returns {Signal} The instance on which this method was called.
	@api public */
	Signal.prototype.detach = function(node) {
		if (!(node instanceof SignalBinding)) throw new Error("MiniSignal#detach(): First arg must be a SignalBinding object.");
		if (node._owner !== this) return this;
		if (node._prev) node._prev._next = node._next;
		if (node._next) node._next._prev = node._prev;
		if (node === this._head) {
			this._head = node._next;
			if (node._next === null) this._tail = null;
		} else if (node === this._tail) {
			this._tail = node._prev;
			this._tail._next = null;
		}
		node._owner = null;
		return this;
	};
	/**
	* Detach all listeners.
	* @returns {Signal} The instance on which this method was called.
	*/
	Signal.prototype.detachAll = function() {
		var node = this._head;
		if (!node) return this;
		this._head = this._tail = null;
		while (node) {
			node._owner = null;
			node = node._next;
		}
		return this;
	};
	return Signal;
}();
/**
* function from npm package `parseUri`, converted to TS to avoid leftpad incident
* @param {string} str
* @param [opts] - options
* @param {boolean} [opts.strictMode] - type of parser
*/
function parseUri(str, opts) {
	opts = opts || {};
	var o = {
		key: [
			"source",
			"protocol",
			"authority",
			"userInfo",
			"user",
			"password",
			"host",
			"port",
			"relative",
			"path",
			"directory",
			"file",
			"query",
			"anchor"
		],
		q: {
			name: "queryKey",
			parser: /(?:^|&)([^&=]*)=?([^&]*)/g
		},
		parser: {
			strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
			loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
		}
	};
	var m = o.parser[opts.strictMode ? "strict" : "loose"].exec(str);
	var uri = {};
	var i = 14;
	while (i--) uri[o.key[i]] = m[i] || "";
	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function(_t0, t1, t2) {
		if (t1) uri[o.q.name][t1] = t2;
	});
	return uri;
}
var useXdr;
var tempAnchor = null;
var STATUS_NONE = 0;
var STATUS_OK = 200;
var STATUS_EMPTY = 204;
var STATUS_IE_BUG_EMPTY = 1223;
var STATUS_TYPE_OK = 2;
function _noop$1() {}
/**
* Quick helper to set a value on one of the extension maps. Ensures there is no
* dot at the start of the extension.
* @ignore
* @param map - The map to set on.
* @param extname - The extension (or key) to set.
* @param val - The value to set.
*/
function setExtMap(map, extname, val) {
	if (extname && extname.indexOf(".") === 0) extname = extname.substring(1);
	if (!extname) return;
	map[extname] = val;
}
/**
* Quick helper to get string xhr type.
* @ignore
* @param xhr - The request to check.
* @returns The type.
*/
function reqType(xhr) {
	return xhr.toString().replace("object ", "");
}
/**
* Manages the state and loading of a resource and all child resources.
*
* Can be extended in `GlobalMixins.LoaderResource`.
* @memberof PIXI
*/
var LoaderResource = function() {
	/**
	* @param {string} name - The name of the resource to load.
	* @param {string|string[]} url - The url for this resource, for audio/video loads you can pass
	*      an array of sources.
	* @param {object} [options] - The options for the load.
	* @param {string|boolean} [options.crossOrigin] - Is this request cross-origin? Default is to
	*      determine automatically.
	* @param {number} [options.timeout=0] - A timeout in milliseconds for the load. If the load takes
	*      longer than this time it is cancelled and the load is considered a failure. If this value is
	*      set to `0` then there is no explicit timeout.
	* @param {PIXI.LoaderResource.LOAD_TYPE} [options.loadType=LOAD_TYPE.XHR] - How should this resource
	*      be loaded?
	* @param {PIXI.LoaderResource.XHR_RESPONSE_TYPE} [options.xhrType=XHR_RESPONSE_TYPE.DEFAULT] - How
	*      should the data being loaded be interpreted when using XHR?
	* @param {PIXI.LoaderResource.IMetadata} [options.metadata] - Extra configuration for middleware
	*      and the Resource object.
	*/
	function LoaderResource(name, url, options) {
		/**
		* The `dequeue` method that will be used a storage place for the async queue dequeue method
		* used privately by the loader.
		* @private
		* @member {Function}
		*/
		this._dequeue = _noop$1;
		/**
		* Used a storage place for the on load binding used privately by the loader.
		* @private
		* @member {Function}
		*/
		this._onLoadBinding = null;
		/**
		* The timer for element loads to check if they timeout.
		* @private
		*/
		this._elementTimer = 0;
		/**
		* The `complete` function bound to this resource's context.
		* @private
		* @type {Function}
		*/
		this._boundComplete = null;
		/**
		* The `_onError` function bound to this resource's context.
		* @private
		* @type {Function}
		*/
		this._boundOnError = null;
		/**
		* The `_onProgress` function bound to this resource's context.
		* @private
		* @type {Function}
		*/
		this._boundOnProgress = null;
		/**
		* The `_onTimeout` function bound to this resource's context.
		* @private
		* @type {Function}
		*/
		this._boundOnTimeout = null;
		this._boundXhrOnError = null;
		this._boundXhrOnTimeout = null;
		this._boundXhrOnAbort = null;
		this._boundXhrOnLoad = null;
		if (typeof name !== "string" || typeof url !== "string") throw new Error("Both name and url are required for constructing a resource.");
		options = options || {};
		this._flags = 0;
		this._setFlag(LoaderResource.STATUS_FLAGS.DATA_URL, url.indexOf("data:") === 0);
		this.name = name;
		this.url = url;
		this.extension = this._getExtension();
		this.data = null;
		this.crossOrigin = options.crossOrigin === true ? "anonymous" : options.crossOrigin;
		this.timeout = options.timeout || 0;
		this.loadType = options.loadType || this._determineLoadType();
		this.xhrType = options.xhrType;
		this.metadata = options.metadata || {};
		this.error = null;
		this.xhr = null;
		this.children = [];
		this.type = LoaderResource.TYPE.UNKNOWN;
		this.progressChunk = 0;
		this._dequeue = _noop$1;
		this._onLoadBinding = null;
		this._elementTimer = 0;
		this._boundComplete = this.complete.bind(this);
		this._boundOnError = this._onError.bind(this);
		this._boundOnProgress = this._onProgress.bind(this);
		this._boundOnTimeout = this._onTimeout.bind(this);
		this._boundXhrOnError = this._xhrOnError.bind(this);
		this._boundXhrOnTimeout = this._xhrOnTimeout.bind(this);
		this._boundXhrOnAbort = this._xhrOnAbort.bind(this);
		this._boundXhrOnLoad = this._xhrOnLoad.bind(this);
		this.onStart = new Signal();
		this.onProgress = new Signal();
		this.onComplete = new Signal();
		this.onAfterMiddleware = new Signal();
	}
	/**
	* Sets the load type to be used for a specific extension.
	* @static
	* @param {string} extname - The extension to set the type for, e.g. "png" or "fnt"
	* @param {PIXI.LoaderResource.LOAD_TYPE} loadType - The load type to set it to.
	*/
	LoaderResource.setExtensionLoadType = function(extname, loadType) {
		setExtMap(LoaderResource._loadTypeMap, extname, loadType);
	};
	/**
	* Sets the load type to be used for a specific extension.
	* @static
	* @param {string} extname - The extension to set the type for, e.g. "png" or "fnt"
	* @param {PIXI.LoaderResource.XHR_RESPONSE_TYPE} xhrType - The xhr type to set it to.
	*/
	LoaderResource.setExtensionXhrType = function(extname, xhrType) {
		setExtMap(LoaderResource._xhrTypeMap, extname, xhrType);
	};
	Object.defineProperty(LoaderResource.prototype, "isDataUrl", {
		/**
		* When the resource starts to load.
		* @memberof PIXI.LoaderResource
		* @callback OnStartSignal
		* @param {PIXI.Resource} resource - The resource that the event happened on.
		*/
		/**
		* When the resource reports loading progress.
		* @memberof PIXI.LoaderResource
		* @callback OnProgressSignal
		* @param {PIXI.Resource} resource - The resource that the event happened on.
		* @param {number} percentage - The progress of the load in the range [0, 1].
		*/
		/**
		* When the resource finishes loading.
		* @memberof PIXI.LoaderResource
		* @callback OnCompleteSignal
		* @param {PIXI.Resource} resource - The resource that the event happened on.
		*/
		/**
		* @memberof PIXI.LoaderResource
		* @typedef {object} IMetadata
		* @property {HTMLImageElement|HTMLAudioElement|HTMLVideoElement} [loadElement=null] - The
		*      element to use for loading, instead of creating one.
		* @property {boolean} [skipSource=false] - Skips adding source(s) to the load element. This
		*      is useful if you want to pass in a `loadElement` that you already added load sources to.
		* @property {string|string[]} [mimeType] - The mime type to use for the source element
		*      of a video/audio elment. If the urls are an array, you can pass this as an array as well
		*      where each index is the mime type to use for the corresponding url index.
		*/
		/**
		* Stores whether or not this url is a data url.
		* @readonly
		* @member {boolean}
		*/
		get: function() {
			return this._hasFlag(LoaderResource.STATUS_FLAGS.DATA_URL);
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(LoaderResource.prototype, "isComplete", {
		/**
		* Describes if this resource has finished loading. Is true when the resource has completely
		* loaded.
		* @readonly
		* @member {boolean}
		*/
		get: function() {
			return this._hasFlag(LoaderResource.STATUS_FLAGS.COMPLETE);
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(LoaderResource.prototype, "isLoading", {
		/**
		* Describes if this resource is currently loading. Is true when the resource starts loading,
		* and is false again when complete.
		* @readonly
		* @member {boolean}
		*/
		get: function() {
			return this._hasFlag(LoaderResource.STATUS_FLAGS.LOADING);
		},
		enumerable: false,
		configurable: true
	});
	/** Marks the resource as complete. */
	LoaderResource.prototype.complete = function() {
		this._clearEvents();
		this._finish();
	};
	/**
	* Aborts the loading of this resource, with an optional message.
	* @param {string} message - The message to use for the error
	*/
	LoaderResource.prototype.abort = function(message) {
		if (this.error) return;
		this.error = new Error(message);
		this._clearEvents();
		if (this.xhr) this.xhr.abort();
		else if (this.xdr) this.xdr.abort();
		else if (this.data) {
			if (this.data.src) this.data.src = LoaderResource.EMPTY_GIF;
			else while (this.data.firstChild) this.data.removeChild(this.data.firstChild);
		}
		this._finish();
	};
	/**
	* Kicks off loading of this resource. This method is asynchronous.
	* @param {PIXI.LoaderResource.OnCompleteSignal} [cb] - Optional callback to call once the resource is loaded.
	*/
	LoaderResource.prototype.load = function(cb) {
		var _this = this;
		if (this.isLoading) return;
		if (this.isComplete) {
			if (cb) setTimeout(function() {
				return cb(_this);
			}, 1);
			return;
		} else if (cb) this.onComplete.once(cb);
		this._setFlag(LoaderResource.STATUS_FLAGS.LOADING, true);
		this.onStart.dispatch(this);
		if (this.crossOrigin === false || typeof this.crossOrigin !== "string") this.crossOrigin = this._determineCrossOrigin(this.url);
		switch (this.loadType) {
			case LoaderResource.LOAD_TYPE.IMAGE:
				this.type = LoaderResource.TYPE.IMAGE;
				this._loadElement("image");
				break;
			case LoaderResource.LOAD_TYPE.AUDIO:
				this.type = LoaderResource.TYPE.AUDIO;
				this._loadSourceElement("audio");
				break;
			case LoaderResource.LOAD_TYPE.VIDEO:
				this.type = LoaderResource.TYPE.VIDEO;
				this._loadSourceElement("video");
				break;
			case LoaderResource.LOAD_TYPE.XHR:
			default:
				if (typeof useXdr === "undefined") useXdr = !!(globalThis.XDomainRequest && !("withCredentials" in new XMLHttpRequest()));
				if (useXdr && this.crossOrigin) this._loadXdr();
				else this._loadXhr();
		}
	};
	/**
	* Checks if the flag is set.
	* @param flag - The flag to check.
	* @returns True if the flag is set.
	*/
	LoaderResource.prototype._hasFlag = function(flag) {
		return (this._flags & flag) !== 0;
	};
	/**
	* (Un)Sets the flag.
	* @param flag - The flag to (un)set.
	* @param value - Whether to set or (un)set the flag.
	*/
	LoaderResource.prototype._setFlag = function(flag, value) {
		this._flags = value ? this._flags | flag : this._flags & ~flag;
	};
	/** Clears all the events from the underlying loading source. */
	LoaderResource.prototype._clearEvents = function() {
		clearTimeout(this._elementTimer);
		if (this.data && this.data.removeEventListener) {
			this.data.removeEventListener("error", this._boundOnError, false);
			this.data.removeEventListener("load", this._boundComplete, false);
			this.data.removeEventListener("progress", this._boundOnProgress, false);
			this.data.removeEventListener("canplaythrough", this._boundComplete, false);
		}
		if (this.xhr) {
			if (this.xhr.removeEventListener) {
				this.xhr.removeEventListener("error", this._boundXhrOnError, false);
				this.xhr.removeEventListener("timeout", this._boundXhrOnTimeout, false);
				this.xhr.removeEventListener("abort", this._boundXhrOnAbort, false);
				this.xhr.removeEventListener("progress", this._boundOnProgress, false);
				this.xhr.removeEventListener("load", this._boundXhrOnLoad, false);
			} else {
				this.xhr.onerror = null;
				this.xhr.ontimeout = null;
				this.xhr.onprogress = null;
				this.xhr.onload = null;
			}
		}
	};
	/** Finalizes the load. */
	LoaderResource.prototype._finish = function() {
		if (this.isComplete) throw new Error("Complete called again for an already completed resource.");
		this._setFlag(LoaderResource.STATUS_FLAGS.COMPLETE, true);
		this._setFlag(LoaderResource.STATUS_FLAGS.LOADING, false);
		this.onComplete.dispatch(this);
	};
	/**
	* Loads this resources using an element that has a single source,
	* like an HTMLImageElement.
	* @private
	* @param type - The type of element to use.
	*/
	LoaderResource.prototype._loadElement = function(type) {
		if (this.metadata.loadElement) this.data = this.metadata.loadElement;
		else if (type === "image" && typeof globalThis.Image !== "undefined") this.data = new Image();
		else this.data = document.createElement(type);
		if (this.crossOrigin) this.data.crossOrigin = this.crossOrigin;
		if (!this.metadata.skipSource) this.data.src = this.url;
		this.data.addEventListener("error", this._boundOnError, false);
		this.data.addEventListener("load", this._boundComplete, false);
		this.data.addEventListener("progress", this._boundOnProgress, false);
		if (this.timeout) this._elementTimer = setTimeout(this._boundOnTimeout, this.timeout);
	};
	/**
	* Loads this resources using an element that has multiple sources,
	* like an HTMLAudioElement or HTMLVideoElement.
	* @param type - The type of element to use.
	*/
	LoaderResource.prototype._loadSourceElement = function(type) {
		if (this.metadata.loadElement) this.data = this.metadata.loadElement;
		else if (type === "audio" && typeof globalThis.Audio !== "undefined") this.data = new Audio();
		else this.data = document.createElement(type);
		if (this.data === null) {
			this.abort("Unsupported element: " + type);
			return;
		}
		if (this.crossOrigin) this.data.crossOrigin = this.crossOrigin;
		if (!this.metadata.skipSource) {
			if (navigator.isCocoonJS) this.data.src = Array.isArray(this.url) ? this.url[0] : this.url;
			else if (Array.isArray(this.url)) {
				var mimeTypes = this.metadata.mimeType;
				for (var i = 0; i < this.url.length; ++i) this.data.appendChild(this._createSource(type, this.url[i], Array.isArray(mimeTypes) ? mimeTypes[i] : mimeTypes));
			} else {
				var mimeTypes = this.metadata.mimeType;
				this.data.appendChild(this._createSource(type, this.url, Array.isArray(mimeTypes) ? mimeTypes[0] : mimeTypes));
			}
		}
		this.data.addEventListener("error", this._boundOnError, false);
		this.data.addEventListener("load", this._boundComplete, false);
		this.data.addEventListener("progress", this._boundOnProgress, false);
		this.data.addEventListener("canplaythrough", this._boundComplete, false);
		this.data.load();
		if (this.timeout) this._elementTimer = setTimeout(this._boundOnTimeout, this.timeout);
	};
	/** Loads this resources using an XMLHttpRequest. */
	LoaderResource.prototype._loadXhr = function() {
		if (typeof this.xhrType !== "string") this.xhrType = this._determineXhrType();
		var xhr = this.xhr = new XMLHttpRequest();
		if (this.crossOrigin === "use-credentials") xhr.withCredentials = true;
		xhr.open("GET", this.url, true);
		xhr.timeout = this.timeout;
		if (this.xhrType === LoaderResource.XHR_RESPONSE_TYPE.JSON || this.xhrType === LoaderResource.XHR_RESPONSE_TYPE.DOCUMENT) xhr.responseType = LoaderResource.XHR_RESPONSE_TYPE.TEXT;
		else xhr.responseType = this.xhrType;
		xhr.addEventListener("error", this._boundXhrOnError, false);
		xhr.addEventListener("timeout", this._boundXhrOnTimeout, false);
		xhr.addEventListener("abort", this._boundXhrOnAbort, false);
		xhr.addEventListener("progress", this._boundOnProgress, false);
		xhr.addEventListener("load", this._boundXhrOnLoad, false);
		xhr.send();
	};
	/** Loads this resources using an XDomainRequest. This is here because we need to support IE9 (gross). */
	LoaderResource.prototype._loadXdr = function() {
		if (typeof this.xhrType !== "string") this.xhrType = this._determineXhrType();
		var xdr = this.xhr = new globalThis.XDomainRequest();
		xdr.timeout = this.timeout || 5e3;
		xdr.onerror = this._boundXhrOnError;
		xdr.ontimeout = this._boundXhrOnTimeout;
		xdr.onprogress = this._boundOnProgress;
		xdr.onload = this._boundXhrOnLoad;
		xdr.open("GET", this.url, true);
		setTimeout(function() {
			return xdr.send();
		}, 1);
	};
	/**
	* Creates a source used in loading via an element.
	* @param type - The element type (video or audio).
	* @param url - The source URL to load from.
	* @param [mime] - The mime type of the video
	* @returns The source element.
	*/
	LoaderResource.prototype._createSource = function(type, url, mime) {
		if (!mime) mime = type + "/" + this._getExtension(url);
		var source = document.createElement("source");
		source.src = url;
		source.type = mime;
		return source;
	};
	/**
	* Called if a load errors out.
	* @param event - The error event from the element that emits it.
	*/
	LoaderResource.prototype._onError = function(event) {
		this.abort("Failed to load element using: " + event.target.nodeName);
	};
	/**
	* Called if a load progress event fires for an element or xhr/xdr.
	* @param event - Progress event.
	*/
	LoaderResource.prototype._onProgress = function(event) {
		if (event && event.lengthComputable) this.onProgress.dispatch(this, event.loaded / event.total);
	};
	/** Called if a timeout event fires for an element. */
	LoaderResource.prototype._onTimeout = function() {
		this.abort("Load timed out.");
	};
	/** Called if an error event fires for xhr/xdr. */
	LoaderResource.prototype._xhrOnError = function() {
		var xhr = this.xhr;
		this.abort(reqType(xhr) + " Request failed. Status: " + xhr.status + ", text: \"" + xhr.statusText + "\"");
	};
	/** Called if an error event fires for xhr/xdr. */
	LoaderResource.prototype._xhrOnTimeout = function() {
		var xhr = this.xhr;
		this.abort(reqType(xhr) + " Request timed out.");
	};
	/** Called if an abort event fires for xhr/xdr. */
	LoaderResource.prototype._xhrOnAbort = function() {
		var xhr = this.xhr;
		this.abort(reqType(xhr) + " Request was aborted by the user.");
	};
	/** Called when data successfully loads from an xhr/xdr request. */
	LoaderResource.prototype._xhrOnLoad = function() {
		var xhr = this.xhr;
		var text = "";
		var status = typeof xhr.status === "undefined" ? STATUS_OK : xhr.status;
		if (xhr.responseType === "" || xhr.responseType === "text" || typeof xhr.responseType === "undefined") text = xhr.responseText;
		if (status === STATUS_NONE && (text.length > 0 || xhr.responseType === LoaderResource.XHR_RESPONSE_TYPE.BUFFER)) status = STATUS_OK;
		else if (status === STATUS_IE_BUG_EMPTY) status = STATUS_EMPTY;
		if ((status / 100 | 0) === STATUS_TYPE_OK) {
			if (this.xhrType === LoaderResource.XHR_RESPONSE_TYPE.TEXT) {
				this.data = text;
				this.type = LoaderResource.TYPE.TEXT;
			} else if (this.xhrType === LoaderResource.XHR_RESPONSE_TYPE.JSON) try {
				this.data = JSON.parse(text);
				this.type = LoaderResource.TYPE.JSON;
			} catch (e) {
				this.abort("Error trying to parse loaded json: " + e);
				return;
			}
			else if (this.xhrType === LoaderResource.XHR_RESPONSE_TYPE.DOCUMENT) try {
				if (globalThis.DOMParser) {
					var domparser = new DOMParser();
					this.data = domparser.parseFromString(text, "text/xml");
				} else {
					var div = document.createElement("div");
					div.innerHTML = text;
					this.data = div;
				}
				this.type = LoaderResource.TYPE.XML;
			} catch (e$1) {
				this.abort("Error trying to parse loaded xml: " + e$1);
				return;
			}
			else this.data = xhr.response || text;
		} else {
			this.abort("[" + xhr.status + "] " + xhr.statusText + ": " + xhr.responseURL);
			return;
		}
		this.complete();
	};
	/**
	* Sets the `crossOrigin` property for this resource based on if the url
	* for this resource is cross-origin. If crossOrigin was manually set, this
	* function does nothing.
	* @private
	* @param url - The url to test.
	* @param [loc=globalThis.location] - The location object to test against.
	* @returns The crossOrigin value to use (or empty string for none).
	*/
	LoaderResource.prototype._determineCrossOrigin = function(url, loc) {
		if (url.indexOf("data:") === 0) return "";
		if (globalThis.origin !== globalThis.location.origin) return "anonymous";
		loc = loc || globalThis.location;
		if (!tempAnchor) tempAnchor = document.createElement("a");
		tempAnchor.href = url;
		var parsedUrl = parseUri(tempAnchor.href, { strictMode: true });
		var samePort = !parsedUrl.port && loc.port === "" || parsedUrl.port === loc.port;
		var protocol = parsedUrl.protocol ? parsedUrl.protocol + ":" : "";
		if (parsedUrl.host !== loc.hostname || !samePort || protocol !== loc.protocol) return "anonymous";
		return "";
	};
	/**
	* Determines the responseType of an XHR request based on the extension of the
	* resource being loaded.
	* @private
	* @returns {PIXI.LoaderResource.XHR_RESPONSE_TYPE} The responseType to use.
	*/
	LoaderResource.prototype._determineXhrType = function() {
		return LoaderResource._xhrTypeMap[this.extension] || LoaderResource.XHR_RESPONSE_TYPE.TEXT;
	};
	/**
	* Determines the loadType of a resource based on the extension of the
	* resource being loaded.
	* @private
	* @returns {PIXI.LoaderResource.LOAD_TYPE} The loadType to use.
	*/
	LoaderResource.prototype._determineLoadType = function() {
		return LoaderResource._loadTypeMap[this.extension] || LoaderResource.LOAD_TYPE.XHR;
	};
	/**
	* Extracts the extension (sans '.') of the file being loaded by the resource.
	* @param [url] - url to parse, `this.url` by default.
	* @returns The extension.
	*/
	LoaderResource.prototype._getExtension = function(url) {
		if (url === void 0) url = this.url;
		var ext = "";
		if (this.isDataUrl) {
			var slashIndex = url.indexOf("/");
			ext = url.substring(slashIndex + 1, url.indexOf(";", slashIndex));
		} else {
			var queryStart = url.indexOf("?");
			var hashStart = url.indexOf("#");
			var index = Math.min(queryStart > -1 ? queryStart : url.length, hashStart > -1 ? hashStart : url.length);
			url = url.substring(0, index);
			ext = url.substring(url.lastIndexOf(".") + 1);
		}
		return ext.toLowerCase();
	};
	/**
	* Determines the mime type of an XHR request based on the responseType of
	* resource being loaded.
	* @param type - The type to get a mime type for.
	* @private
	* @returns The mime type to use.
	*/
	LoaderResource.prototype._getMimeFromXhrType = function(type) {
		switch (type) {
			case LoaderResource.XHR_RESPONSE_TYPE.BUFFER: return "application/octet-binary";
			case LoaderResource.XHR_RESPONSE_TYPE.BLOB: return "application/blob";
			case LoaderResource.XHR_RESPONSE_TYPE.DOCUMENT: return "application/xml";
			case LoaderResource.XHR_RESPONSE_TYPE.JSON: return "application/json";
			case LoaderResource.XHR_RESPONSE_TYPE.DEFAULT:
			case LoaderResource.XHR_RESPONSE_TYPE.TEXT:
			default: return "text/plain";
		}
	};
	return LoaderResource;
}();
(function(LoaderResource) {
	(function(STATUS_FLAGS) {
		/** None */
		STATUS_FLAGS[STATUS_FLAGS["NONE"] = 0] = "NONE";
		/** Data URL */
		STATUS_FLAGS[STATUS_FLAGS["DATA_URL"] = 1] = "DATA_URL";
		/** Complete */
		STATUS_FLAGS[STATUS_FLAGS["COMPLETE"] = 2] = "COMPLETE";
		/** Loading */
		STATUS_FLAGS[STATUS_FLAGS["LOADING"] = 4] = "LOADING";
	})(LoaderResource.STATUS_FLAGS || (LoaderResource.STATUS_FLAGS = {}));
	(function(TYPE) {
		/** Unknown */
		TYPE[TYPE["UNKNOWN"] = 0] = "UNKNOWN";
		/** JSON */
		TYPE[TYPE["JSON"] = 1] = "JSON";
		/** XML */
		TYPE[TYPE["XML"] = 2] = "XML";
		/** Image */
		TYPE[TYPE["IMAGE"] = 3] = "IMAGE";
		/** Audio */
		TYPE[TYPE["AUDIO"] = 4] = "AUDIO";
		/** Video */
		TYPE[TYPE["VIDEO"] = 5] = "VIDEO";
		/** Plain text */
		TYPE[TYPE["TEXT"] = 6] = "TEXT";
	})(LoaderResource.TYPE || (LoaderResource.TYPE = {}));
	(function(LOAD_TYPE) {
		/** Uses XMLHttpRequest to load the resource. */
		LOAD_TYPE[LOAD_TYPE["XHR"] = 1] = "XHR";
		/** Uses an `Image` object to load the resource. */
		LOAD_TYPE[LOAD_TYPE["IMAGE"] = 2] = "IMAGE";
		/** Uses an `Audio` object to load the resource. */
		LOAD_TYPE[LOAD_TYPE["AUDIO"] = 3] = "AUDIO";
		/** Uses a `Video` object to load the resource. */
		LOAD_TYPE[LOAD_TYPE["VIDEO"] = 4] = "VIDEO";
	})(LoaderResource.LOAD_TYPE || (LoaderResource.LOAD_TYPE = {}));
	(function(XHR_RESPONSE_TYPE) {
		/** string */
		XHR_RESPONSE_TYPE["DEFAULT"] = "text";
		/** ArrayBuffer */
		XHR_RESPONSE_TYPE["BUFFER"] = "arraybuffer";
		/** Blob */
		XHR_RESPONSE_TYPE["BLOB"] = "blob";
		/** Document */
		XHR_RESPONSE_TYPE["DOCUMENT"] = "document";
		/** Object */
		XHR_RESPONSE_TYPE["JSON"] = "json";
		/** String */
		XHR_RESPONSE_TYPE["TEXT"] = "text";
	})(LoaderResource.XHR_RESPONSE_TYPE || (LoaderResource.XHR_RESPONSE_TYPE = {}));
	LoaderResource._loadTypeMap = {
		gif: LoaderResource.LOAD_TYPE.IMAGE,
		png: LoaderResource.LOAD_TYPE.IMAGE,
		bmp: LoaderResource.LOAD_TYPE.IMAGE,
		jpg: LoaderResource.LOAD_TYPE.IMAGE,
		jpeg: LoaderResource.LOAD_TYPE.IMAGE,
		tif: LoaderResource.LOAD_TYPE.IMAGE,
		tiff: LoaderResource.LOAD_TYPE.IMAGE,
		webp: LoaderResource.LOAD_TYPE.IMAGE,
		tga: LoaderResource.LOAD_TYPE.IMAGE,
		avif: LoaderResource.LOAD_TYPE.IMAGE,
		svg: LoaderResource.LOAD_TYPE.IMAGE,
		"svg+xml": LoaderResource.LOAD_TYPE.IMAGE,
		mp3: LoaderResource.LOAD_TYPE.AUDIO,
		ogg: LoaderResource.LOAD_TYPE.AUDIO,
		wav: LoaderResource.LOAD_TYPE.AUDIO,
		mp4: LoaderResource.LOAD_TYPE.VIDEO,
		webm: LoaderResource.LOAD_TYPE.VIDEO
	};
	LoaderResource._xhrTypeMap = {
		xhtml: LoaderResource.XHR_RESPONSE_TYPE.DOCUMENT,
		html: LoaderResource.XHR_RESPONSE_TYPE.DOCUMENT,
		htm: LoaderResource.XHR_RESPONSE_TYPE.DOCUMENT,
		xml: LoaderResource.XHR_RESPONSE_TYPE.DOCUMENT,
		tmx: LoaderResource.XHR_RESPONSE_TYPE.DOCUMENT,
		svg: LoaderResource.XHR_RESPONSE_TYPE.DOCUMENT,
		tsx: LoaderResource.XHR_RESPONSE_TYPE.DOCUMENT,
		gif: LoaderResource.XHR_RESPONSE_TYPE.BLOB,
		png: LoaderResource.XHR_RESPONSE_TYPE.BLOB,
		bmp: LoaderResource.XHR_RESPONSE_TYPE.BLOB,
		jpg: LoaderResource.XHR_RESPONSE_TYPE.BLOB,
		jpeg: LoaderResource.XHR_RESPONSE_TYPE.BLOB,
		tif: LoaderResource.XHR_RESPONSE_TYPE.BLOB,
		tiff: LoaderResource.XHR_RESPONSE_TYPE.BLOB,
		webp: LoaderResource.XHR_RESPONSE_TYPE.BLOB,
		tga: LoaderResource.XHR_RESPONSE_TYPE.BLOB,
		avif: LoaderResource.XHR_RESPONSE_TYPE.BLOB,
		json: LoaderResource.XHR_RESPONSE_TYPE.JSON,
		text: LoaderResource.XHR_RESPONSE_TYPE.TEXT,
		txt: LoaderResource.XHR_RESPONSE_TYPE.TEXT,
		ttf: LoaderResource.XHR_RESPONSE_TYPE.BUFFER,
		otf: LoaderResource.XHR_RESPONSE_TYPE.BUFFER
	};
	LoaderResource.EMPTY_GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
})(LoaderResource || (LoaderResource = {}));
/**
* Smaller version of the async library constructs.
* @ignore
*/
function _noop() {}
/**
* Ensures a function is only called once.
* @ignore
* @param {Function} fn - The function to wrap.
* @returns {Function} The wrapping function.
*/
function onlyOnce(fn) {
	return function onceWrapper() {
		var arguments$1 = arguments;
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments$1[_i];
		if (fn === null) throw new Error("Callback was already called.");
		var callFn = fn;
		fn = null;
		callFn.apply(this, args);
	};
}
/**
* @private
* @memberof PIXI
*/
var AsyncQueueItem = function() {
	/**
	* @param data
	* @param callback
	* @private
	*/
	function AsyncQueueItem(data, callback) {
		this.data = data;
		this.callback = callback;
	}
	return AsyncQueueItem;
}();
/**
* @private
* @memberof PIXI
*/
var AsyncQueue = function() {
	/**
	* @param worker
	* @param concurrency
	* @private
	*/
	function AsyncQueue(worker, concurrency) {
		var _this = this;
		if (concurrency === void 0) concurrency = 1;
		this.workers = 0;
		this.saturated = _noop;
		this.unsaturated = _noop;
		this.empty = _noop;
		this.drain = _noop;
		this.error = _noop;
		this.started = false;
		this.paused = false;
		this._tasks = [];
		this._insert = function(data, insertAtFront, callback) {
			if (callback && typeof callback !== "function") throw new Error("task callback must be a function");
			_this.started = true;
			if (data == null && _this.idle()) {
				setTimeout(function() {
					return _this.drain();
				}, 1);
				return;
			}
			var item = new AsyncQueueItem(data, typeof callback === "function" ? callback : _noop);
			if (insertAtFront) _this._tasks.unshift(item);
			else _this._tasks.push(item);
			setTimeout(_this.process, 1);
		};
		this.process = function() {
			while (!_this.paused && _this.workers < _this.concurrency && _this._tasks.length) {
				var task = _this._tasks.shift();
				if (_this._tasks.length === 0) _this.empty();
				_this.workers += 1;
				if (_this.workers === _this.concurrency) _this.saturated();
				_this._worker(task.data, onlyOnce(_this._next(task)));
			}
		};
		this._worker = worker;
		if (concurrency === 0) throw new Error("Concurrency must not be zero");
		this.concurrency = concurrency;
		this.buffer = concurrency / 4;
	}
	/**
	* @param task
	* @private
	*/
	AsyncQueue.prototype._next = function(task) {
		var _this = this;
		return function() {
			var arguments$1 = arguments;
			var args = [];
			for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments$1[_i];
			_this.workers -= 1;
			task.callback.apply(task, args);
			if (args[0] != null) _this.error(args[0], task.data);
			if (_this.workers <= _this.concurrency - _this.buffer) _this.unsaturated();
			if (_this.idle()) _this.drain();
			_this.process();
		};
	};
	AsyncQueue.prototype.push = function(data, callback) {
		this._insert(data, false, callback);
	};
	AsyncQueue.prototype.kill = function() {
		this.workers = 0;
		this.drain = _noop;
		this.started = false;
		this._tasks = [];
	};
	AsyncQueue.prototype.unshift = function(data, callback) {
		this._insert(data, true, callback);
	};
	AsyncQueue.prototype.length = function() {
		return this._tasks.length;
	};
	AsyncQueue.prototype.running = function() {
		return this.workers;
	};
	AsyncQueue.prototype.idle = function() {
		return this._tasks.length + this.workers === 0;
	};
	AsyncQueue.prototype.pause = function() {
		if (this.paused === true) return;
		this.paused = true;
	};
	AsyncQueue.prototype.resume = function() {
		if (this.paused === false) return;
		this.paused = false;
		for (var w = 1; w <= this.concurrency; w++) this.process();
	};
	/**
	* Iterates an array in series.
	* @param {Array.<*>} array - Array to iterate.
	* @param {Function} iterator - Function to call for each element.
	* @param {Function} callback - Function to call when done, or on error.
	* @param {boolean} [deferNext=false] - Break synchronous each loop by calling next with a setTimeout of 1.
	*/
	AsyncQueue.eachSeries = function(array, iterator, callback, deferNext) {
		var i = 0;
		var len = array.length;
		function next(err) {
			if (err || i === len) {
				if (callback) callback(err);
				return;
			}
			if (deferNext) setTimeout(function() {
				iterator(array[i++], next);
			}, 1);
			else iterator(array[i++], next);
		}
		next();
	};
	/**
	* Async queue implementation,
	* @param {Function} worker - The worker function to call for each task.
	* @param {number} concurrency - How many workers to run in parrallel.
	* @returns {*} The async queue object.
	*/
	AsyncQueue.queue = function(worker, concurrency) {
		return new AsyncQueue(worker, concurrency);
	};
	return AsyncQueue;
}();
var MAX_PROGRESS = 100;
var rgxExtractUrlHash = /(#[\w-]+)?$/;
/**
* The new loader, forked from Resource Loader by Chad Engler: https://github.com/englercj/resource-loader
*
* ```js
* const loader = PIXI.Loader.shared; // PixiJS exposes a premade instance for you to use.
* // or
* const loader = new PIXI.Loader(); // You can also create your own if you want
*
* const sprites = {};
*
* // Chainable `add` to enqueue a resource
* loader.add('bunny', 'data/bunny.png')
*       .add('spaceship', 'assets/spritesheet.json');
* loader.add('scoreFont', 'assets/score.fnt');
*
* // Chainable `pre` to add a middleware that runs for each resource, *before* loading that resource.
* // This is useful to implement custom caching modules (using filesystem, indexeddb, memory, etc).
* loader.pre(cachingMiddleware);
*
* // Chainable `use` to add a middleware that runs for each resource, *after* loading that resource.
* // This is useful to implement custom parsing modules (like spritesheet parsers, spine parser, etc).
* loader.use(parsingMiddleware);
*
* // The `load` method loads the queue of resources, and calls the passed in callback called once all
* // resources have loaded.
* loader.load((loader, resources) => {
*     // resources is an object where the key is the name of the resource loaded and the value is the resource object.
*     // They have a couple default properties:
*     // - `url`: The URL that the resource was loaded from
*     // - `error`: The error that happened when trying to load (if any)
*     // - `data`: The raw data that was loaded
*     // also may contain other properties based on the middleware that runs.
*     sprites.bunny = new PIXI.TilingSprite(resources.bunny.texture);
*     sprites.spaceship = new PIXI.TilingSprite(resources.spaceship.texture);
*     sprites.scoreFont = new PIXI.TilingSprite(resources.scoreFont.texture);
* });
*
* // throughout the process multiple signals can be dispatched.
* loader.onProgress.add(() => {}); // called once per loaded/errored file
* loader.onError.add(() => {}); // called once per errored file
* loader.onLoad.add(() => {}); // called once per loaded file
* loader.onComplete.add(() => {}); // called once when the queued resources all load.
* ```
* @memberof PIXI
*/
var Loader = function() {
	/**
	* @param baseUrl - The base url for all resources loaded by this loader.
	* @param concurrency - The number of resources to load concurrently.
	*/
	function Loader(baseUrl, concurrency) {
		var _this = this;
		if (baseUrl === void 0) baseUrl = "";
		if (concurrency === void 0) concurrency = 10;
		/** The progress percent of the loader going through the queue. */
		this.progress = 0;
		/** Loading state of the loader, true if it is currently loading resources. */
		this.loading = false;
		/**
		* A querystring to append to every URL added to the loader.
		*
		* This should be a valid query string *without* the question-mark (`?`). The loader will
		* also *not* escape values for you. Make sure to escape your parameters with
		* [`encodeURIComponent`](https://mdn.io/encodeURIComponent) before assigning this property.
		* @example
		* const loader = new Loader();
		*
		* loader.defaultQueryString = 'user=me&password=secret';
		*
		* // This will request 'image.png?user=me&password=secret'
		* loader.add('image.png').load();
		*
		* loader.reset();
		*
		* // This will request 'image.png?v=1&user=me&password=secret'
		* loader.add('iamge.png?v=1').load();
		*/
		this.defaultQueryString = "";
		/** The middleware to run before loading each resource. */
		this._beforeMiddleware = [];
		/** The middleware to run after loading each resource. */
		this._afterMiddleware = [];
		/** The tracks the resources we are currently completing parsing for. */
		this._resourcesParsing = [];
		/**
		* The `_loadResource` function bound with this object context.
		* @param r - The resource to load
		* @param d - The dequeue function
		*/
		this._boundLoadResource = function(r, d) {
			return _this._loadResource(r, d);
		};
		/** All the resources for this loader keyed by name. */
		this.resources = {};
		this.baseUrl = baseUrl;
		this._beforeMiddleware = [];
		this._afterMiddleware = [];
		this._resourcesParsing = [];
		this._boundLoadResource = function(r, d) {
			return _this._loadResource(r, d);
		};
		this._queue = AsyncQueue.queue(this._boundLoadResource, concurrency);
		this._queue.pause();
		this.resources = {};
		this.onProgress = new Signal();
		this.onError = new Signal();
		this.onLoad = new Signal();
		this.onStart = new Signal();
		this.onComplete = new Signal();
		for (var i = 0; i < Loader._plugins.length; ++i) {
			var plugin = Loader._plugins[i];
			var pre = plugin.pre, use = plugin.use;
			if (pre) this.pre(pre);
			if (use) this.use(use);
		}
		this._protected = false;
	}
	/**
	* Same as add, params have strict order
	* @private
	* @param name - The name of the resource to load.
	* @param url - The url for this resource, relative to the baseUrl of this loader.
	* @param options - The options for the load.
	* @param callback - Function to call when this specific resource completes loading.
	* @returns The loader itself.
	*/
	Loader.prototype._add = function(name, url, options, callback) {
		if (this.loading && (!options || !options.parentResource)) throw new Error("Cannot add resources while the loader is running.");
		if (this.resources[name]) throw new Error("Resource named \"" + name + "\" already exists.");
		url = this._prepareUrl(url);
		this.resources[name] = new LoaderResource(name, url, options);
		if (typeof callback === "function") this.resources[name].onAfterMiddleware.once(callback);
		if (this.loading) {
			var parent = options.parentResource;
			var incompleteChildren = [];
			for (var i = 0; i < parent.children.length; ++i) if (!parent.children[i].isComplete) incompleteChildren.push(parent.children[i]);
			var eachChunk = parent.progressChunk * (incompleteChildren.length + 1) / (incompleteChildren.length + 2);
			parent.children.push(this.resources[name]);
			parent.progressChunk = eachChunk;
			for (var i = 0; i < incompleteChildren.length; ++i) incompleteChildren[i].progressChunk = eachChunk;
			this.resources[name].progressChunk = eachChunk;
		}
		this._queue.push(this.resources[name]);
		return this;
	};
	/**
	* Sets up a middleware function that will run *before* the
	* resource is loaded.
	* @param fn - The middleware function to register.
	* @returns The loader itself.
	*/
	Loader.prototype.pre = function(fn) {
		this._beforeMiddleware.push(fn);
		return this;
	};
	/**
	* Sets up a middleware function that will run *after* the
	* resource is loaded.
	* @param fn - The middleware function to register.
	* @returns The loader itself.
	*/
	Loader.prototype.use = function(fn) {
		this._afterMiddleware.push(fn);
		return this;
	};
	/**
	* Resets the queue of the loader to prepare for a new load.
	* @returns The loader itself.
	*/
	Loader.prototype.reset = function() {
		this.progress = 0;
		this.loading = false;
		this._queue.kill();
		this._queue.pause();
		for (var k in this.resources) {
			var res = this.resources[k];
			if (res._onLoadBinding) res._onLoadBinding.detach();
			if (res.isLoading) res.abort("loader reset");
		}
		this.resources = {};
		return this;
	};
	/**
	* Starts loading the queued resources.
	* @param cb - Optional callback that will be bound to the `complete` event.
	* @returns The loader itself.
	*/
	Loader.prototype.load = function(cb) {
		deprecation("6.5.0", "@pixi/loaders is being replaced with @pixi/assets in the next major release.");
		if (typeof cb === "function") this.onComplete.once(cb);
		if (this.loading) return this;
		if (this._queue.idle()) {
			this._onStart();
			this._onComplete();
		} else {
			var chunk = MAX_PROGRESS / this._queue._tasks.length;
			for (var i = 0; i < this._queue._tasks.length; ++i) this._queue._tasks[i].data.progressChunk = chunk;
			this._onStart();
			this._queue.resume();
		}
		return this;
	};
	Object.defineProperty(Loader.prototype, "concurrency", {
		/**
		* The number of resources to load concurrently.
		* @default 10
		*/
		get: function() {
			return this._queue.concurrency;
		},
		set: function(concurrency) {
			this._queue.concurrency = concurrency;
		},
		enumerable: false,
		configurable: true
	});
	/**
	* Prepares a url for usage based on the configuration of this object
	* @param url - The url to prepare.
	* @returns The prepared url.
	*/
	Loader.prototype._prepareUrl = function(url) {
		var parsedUrl = parseUri(url, { strictMode: true });
		var result;
		if (parsedUrl.protocol || !parsedUrl.path || url.indexOf("//") === 0) result = url;
		else if (this.baseUrl.length && this.baseUrl.lastIndexOf("/") !== this.baseUrl.length - 1 && url.charAt(0) !== "/") result = this.baseUrl + "/" + url;
		else result = this.baseUrl + url;
		if (this.defaultQueryString) {
			var hash = rgxExtractUrlHash.exec(result)[0];
			result = result.slice(0, result.length - hash.length);
			if (result.indexOf("?") !== -1) result += "&" + this.defaultQueryString;
			else result += "?" + this.defaultQueryString;
			result += hash;
		}
		return result;
	};
	/**
	* Loads a single resource.
	* @param resource - The resource to load.
	* @param dequeue - The function to call when we need to dequeue this item.
	*/
	Loader.prototype._loadResource = function(resource, dequeue) {
		var _this = this;
		resource._dequeue = dequeue;
		AsyncQueue.eachSeries(this._beforeMiddleware, function(fn, next) {
			fn.call(_this, resource, function() {
				next(resource.isComplete ? {} : null);
			});
		}, function() {
			if (resource.isComplete) _this._onLoad(resource);
			else {
				resource._onLoadBinding = resource.onComplete.once(_this._onLoad, _this);
				resource.load();
			}
		}, true);
	};
	/** Called once loading has started. */
	Loader.prototype._onStart = function() {
		this.progress = 0;
		this.loading = true;
		this.onStart.dispatch(this);
	};
	/** Called once each resource has loaded. */
	Loader.prototype._onComplete = function() {
		this.progress = MAX_PROGRESS;
		this.loading = false;
		this.onComplete.dispatch(this, this.resources);
	};
	/**
	* Called each time a resources is loaded.
	* @param resource - The resource that was loaded
	*/
	Loader.prototype._onLoad = function(resource) {
		var _this = this;
		resource._onLoadBinding = null;
		this._resourcesParsing.push(resource);
		resource._dequeue();
		AsyncQueue.eachSeries(this._afterMiddleware, function(fn, next) {
			fn.call(_this, resource, next);
		}, function() {
			resource.onAfterMiddleware.dispatch(resource);
			_this.progress = Math.min(MAX_PROGRESS, _this.progress + resource.progressChunk);
			_this.onProgress.dispatch(_this, resource);
			if (resource.error) _this.onError.dispatch(resource.error, _this, resource);
			else _this.onLoad.dispatch(_this, resource);
			_this._resourcesParsing.splice(_this._resourcesParsing.indexOf(resource), 1);
			if (_this._queue.idle() && _this._resourcesParsing.length === 0) _this._onComplete();
		}, true);
	};
	/** Destroy the loader, removes references. */
	Loader.prototype.destroy = function() {
		if (!this._protected) this.reset();
	};
	Object.defineProperty(Loader, "shared", {
		/** A premade instance of the loader that can be used to load resources. */
		get: function() {
			var shared = Loader._shared;
			if (!shared) {
				shared = new Loader();
				shared._protected = true;
				Loader._shared = shared;
			}
			return shared;
		},
		enumerable: false,
		configurable: true
	});
	/**
	* Use the {@link PIXI.extensions.add} API to register plugins.
	* @deprecated since 6.5.0
	* @param plugin - The plugin to add
	* @returns Reference to PIXI.Loader for chaining
	*/
	Loader.registerPlugin = function(plugin) {
		deprecation("6.5.0", "Loader.registerPlugin() is deprecated, use extensions.add() instead.");
		extensions.add({
			type: ExtensionType.Loader,
			ref: plugin
		});
		return Loader;
	};
	Loader._plugins = [];
	return Loader;
}();
extensions.handleByList(ExtensionType.Loader, Loader._plugins);
Loader.prototype.add = function add(name, url, options, callback) {
	if (Array.isArray(name)) {
		for (var i = 0; i < name.length; ++i) this.add(name[i]);
		return this;
	}
	if (typeof name === "object") {
		options = name;
		callback = url || options.callback || options.onComplete;
		url = options.url;
		name = options.name || options.key || options.url;
	}
	if (typeof url !== "string") {
		callback = options;
		options = url;
		url = name;
	}
	if (typeof url !== "string") throw new Error("No url passed to add resource to loader.");
	if (typeof options === "function") {
		callback = options;
		options = null;
	}
	return this._add(name, url, options, callback);
};
/**
* Application plugin for supporting loader option. Installing the LoaderPlugin
* is not necessary if using **pixi.js** or **pixi.js-legacy**.
* @example
* import {AppLoaderPlugin} from '@pixi/loaders';
* import {extensions} from '@pixi/core';
* extensions.add(AppLoaderPlugin);
* @memberof PIXI
*/
var AppLoaderPlugin = function() {
	function AppLoaderPlugin() {}
	/**
	* Called on application constructor
	* @param options
	* @private
	*/
	AppLoaderPlugin.init = function(options) {
		options = Object.assign({ sharedLoader: false }, options);
		this.loader = options.sharedLoader ? Loader.shared : new Loader();
	};
	/**
	* Called when application destroyed
	* @private
	*/
	AppLoaderPlugin.destroy = function() {
		if (this.loader) {
			this.loader.destroy();
			this.loader = null;
		}
	};
	/** @ignore */
	AppLoaderPlugin.extension = ExtensionType.Application;
	return AppLoaderPlugin;
}();
/**
* Loader plugin for handling Texture resources.
* @memberof PIXI
*/
var TextureLoader = function() {
	function TextureLoader() {}
	/** Handle SVG elements a text, render with SVGResource. */
	TextureLoader.add = function() {
		LoaderResource.setExtensionLoadType("svg", LoaderResource.LOAD_TYPE.XHR);
		LoaderResource.setExtensionXhrType("svg", LoaderResource.XHR_RESPONSE_TYPE.TEXT);
	};
	/**
	* Called after a resource is loaded.
	* @see PIXI.Loader.loaderMiddleware
	* @param resource
	* @param {Function} next
	*/
	TextureLoader.use = function(resource, next) {
		if (resource.data && (resource.type === LoaderResource.TYPE.IMAGE || resource.extension === "svg")) {
			var data = resource.data, url = resource.url, name = resource.name, metadata = resource.metadata;
			Texture.fromLoader(data, url, name, metadata).then(function(texture) {
				resource.texture = texture;
				next();
			}).catch(next);
		} else next();
	};
	/** @ignore */
	TextureLoader.extension = ExtensionType.Loader;
	return TextureLoader;
}();
var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
/**
* Encodes binary into base64.
* @function encodeBinary
* @param {string} input - The input data to encode.
* @returns {string} The encoded base64 string
*/
function encodeBinary(input) {
	var output = "";
	var inx = 0;
	while (inx < input.length) {
		var bytebuffer = [
			0,
			0,
			0
		];
		var encodedCharIndexes = [
			0,
			0,
			0,
			0
		];
		for (var jnx = 0; jnx < bytebuffer.length; ++jnx) if (inx < input.length) bytebuffer[jnx] = input.charCodeAt(inx++) & 255;
		else bytebuffer[jnx] = 0;
		encodedCharIndexes[0] = bytebuffer[0] >> 2;
		encodedCharIndexes[1] = (bytebuffer[0] & 3) << 4 | bytebuffer[1] >> 4;
		encodedCharIndexes[2] = (bytebuffer[1] & 15) << 2 | bytebuffer[2] >> 6;
		encodedCharIndexes[3] = bytebuffer[2] & 63;
		switch (inx - (input.length - 1)) {
			case 2:
				encodedCharIndexes[3] = 64;
				encodedCharIndexes[2] = 64;
				break;
			case 1: encodedCharIndexes[3] = 64;
		}
		for (var jnx = 0; jnx < encodedCharIndexes.length; ++jnx) output += _keyStr.charAt(encodedCharIndexes[jnx]);
	}
	return output;
}
/**
* A middleware for transforming XHR loaded Blobs into more useful objects
* @ignore
* @function parsing
* @example
* import { Loader, middleware } from 'resource-loader';
* const loader = new Loader();
* loader.use(middleware.parsing);
* @param resource - Current Resource
* @param next - Callback when complete
*/
function parsing(resource, next) {
	if (!resource.data) {
		next();
		return;
	}
	if (resource.xhr && resource.xhrType === LoaderResource.XHR_RESPONSE_TYPE.BLOB) {
		if (!self.Blob || typeof resource.data === "string") {
			var type = resource.xhr.getResponseHeader("content-type");
			if (type && type.indexOf("image") === 0) {
				resource.data = new Image();
				resource.data.src = "data:" + type + ";base64," + encodeBinary(resource.xhr.responseText);
				resource.type = LoaderResource.TYPE.IMAGE;
				resource.data.onload = function() {
					resource.data.onload = null;
					next();
				};
				return;
			}
		} else if (resource.data.type.indexOf("image") === 0) {
			var Url_1 = globalThis.URL || globalThis.webkitURL;
			var src_1 = Url_1.createObjectURL(resource.data);
			resource.blob = resource.data;
			resource.data = new Image();
			resource.data.src = src_1;
			resource.type = LoaderResource.TYPE.IMAGE;
			resource.data.onload = function() {
				Url_1.revokeObjectURL(src_1);
				resource.data.onload = null;
				next();
			};
			return;
		}
	}
	next();
}
/**
* Parse any blob into more usable objects (e.g. Image).
* @memberof PIXI
*/
var ParsingLoader = function() {
	function ParsingLoader() {}
	/** @ignore */
	ParsingLoader.extension = ExtensionType.Loader;
	ParsingLoader.use = parsing;
	return ParsingLoader;
}();
extensions.add(TextureLoader, ParsingLoader);
//#endregion
//#region node_modules/@pixi/compressed-textures/dist/esm/compressed-textures.mjs
/*!
* @pixi/compressed-textures - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/compressed-textures is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
var _a$2;
/**
* WebGL internal formats, including compressed texture formats provided by extensions
* @memberof PIXI
* @static
* @name INTERNAL_FORMATS
* @enum {number}
* @property {number} [COMPRESSED_RGB_S3TC_DXT1_EXT=0x83F0] -
* @property {number} [COMPRESSED_RGBA_S3TC_DXT1_EXT=0x83F1] -
* @property {number} [COMPRESSED_RGBA_S3TC_DXT3_EXT=0x83F2] -
* @property {number} [COMPRESSED_RGBA_S3TC_DXT5_EXT=0x83F3] -
* @property {number} [COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT=35917] -
* @property {number} [COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT=35918] -
* @property {number} [COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT=35919] -
* @property {number} [COMPRESSED_SRGB_S3TC_DXT1_EXT=35916] -
* @property {number} [COMPRESSED_R11_EAC=0x9270] -
* @property {number} [COMPRESSED_SIGNED_R11_EAC=0x9271] -
* @property {number} [COMPRESSED_RG11_EAC=0x9272] -
* @property {number} [COMPRESSED_SIGNED_RG11_EAC=0x9273] -
* @property {number} [COMPRESSED_RGB8_ETC2=0x9274] -
* @property {number} [COMPRESSED_RGBA8_ETC2_EAC=0x9278] -
* @property {number} [COMPRESSED_SRGB8_ETC2=0x9275] -
* @property {number} [COMPRESSED_SRGB8_ALPHA8_ETC2_EAC=0x9279] -
* @property {number} [COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2=0x9276] -
* @property {number} [COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2=0x9277] -
* @property {number} [COMPRESSED_RGB_PVRTC_4BPPV1_IMG=0x8C00] -
* @property {number} [COMPRESSED_RGBA_PVRTC_4BPPV1_IMG=0x8C02] -
* @property {number} [COMPRESSED_RGB_PVRTC_2BPPV1_IMG=0x8C01] -
* @property {number} [COMPRESSED_RGBA_PVRTC_2BPPV1_IMG=0x8C03] -
* @property {number} [COMPRESSED_RGB_ETC1_WEBGL=0x8D64] -
* @property {number} [COMPRESSED_RGB_ATC_WEBGL=0x8C92] -
* @property {number} [COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL=0x8C92] -
* @property {number} [COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL=0x87EE] -
* @property {number} [COMPRESSED_RGBA_ASTC_4x4_KHR=0x93B0] -
*/
var INTERNAL_FORMATS;
(function(INTERNAL_FORMATS) {
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGB_S3TC_DXT1_EXT"] = 33776] = "COMPRESSED_RGB_S3TC_DXT1_EXT";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGBA_S3TC_DXT1_EXT"] = 33777] = "COMPRESSED_RGBA_S3TC_DXT1_EXT";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGBA_S3TC_DXT3_EXT"] = 33778] = "COMPRESSED_RGBA_S3TC_DXT3_EXT";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGBA_S3TC_DXT5_EXT"] = 33779] = "COMPRESSED_RGBA_S3TC_DXT5_EXT";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT"] = 35917] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT"] = 35918] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT"] = 35919] = "COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_SRGB_S3TC_DXT1_EXT"] = 35916] = "COMPRESSED_SRGB_S3TC_DXT1_EXT";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_R11_EAC"] = 37488] = "COMPRESSED_R11_EAC";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_SIGNED_R11_EAC"] = 37489] = "COMPRESSED_SIGNED_R11_EAC";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RG11_EAC"] = 37490] = "COMPRESSED_RG11_EAC";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_SIGNED_RG11_EAC"] = 37491] = "COMPRESSED_SIGNED_RG11_EAC";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGB8_ETC2"] = 37492] = "COMPRESSED_RGB8_ETC2";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGBA8_ETC2_EAC"] = 37496] = "COMPRESSED_RGBA8_ETC2_EAC";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_SRGB8_ETC2"] = 37493] = "COMPRESSED_SRGB8_ETC2";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_SRGB8_ALPHA8_ETC2_EAC"] = 37497] = "COMPRESSED_SRGB8_ALPHA8_ETC2_EAC";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2"] = 37494] = "COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2"] = 37495] = "COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGB_PVRTC_4BPPV1_IMG"] = 35840] = "COMPRESSED_RGB_PVRTC_4BPPV1_IMG";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGBA_PVRTC_4BPPV1_IMG"] = 35842] = "COMPRESSED_RGBA_PVRTC_4BPPV1_IMG";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGB_PVRTC_2BPPV1_IMG"] = 35841] = "COMPRESSED_RGB_PVRTC_2BPPV1_IMG";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGBA_PVRTC_2BPPV1_IMG"] = 35843] = "COMPRESSED_RGBA_PVRTC_2BPPV1_IMG";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGB_ETC1_WEBGL"] = 36196] = "COMPRESSED_RGB_ETC1_WEBGL";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGB_ATC_WEBGL"] = 35986] = "COMPRESSED_RGB_ATC_WEBGL";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL"] = 35986] = "COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL"] = 34798] = "COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL";
	INTERNAL_FORMATS[INTERNAL_FORMATS["COMPRESSED_RGBA_ASTC_4x4_KHR"] = 37808] = "COMPRESSED_RGBA_ASTC_4x4_KHR";
})(INTERNAL_FORMATS || (INTERNAL_FORMATS = {}));
/**
* Maps the compressed texture formats in {@link PIXI.INTERNAL_FORMATS} to the number of bytes taken by
* each texel.
* @memberof PIXI
* @static
* @ignore
*/
var INTERNAL_FORMAT_TO_BYTES_PER_PIXEL = (_a$2 = {}, _a$2[INTERNAL_FORMATS.COMPRESSED_RGB_S3TC_DXT1_EXT] = .5, _a$2[INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT1_EXT] = .5, _a$2[INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT3_EXT] = 1, _a$2[INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT5_EXT] = 1, _a$2[INTERNAL_FORMATS.COMPRESSED_SRGB_S3TC_DXT1_EXT] = .5, _a$2[INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT] = .5, _a$2[INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT] = 1, _a$2[INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT] = 1, _a$2[INTERNAL_FORMATS.COMPRESSED_R11_EAC] = .5, _a$2[INTERNAL_FORMATS.COMPRESSED_SIGNED_R11_EAC] = .5, _a$2[INTERNAL_FORMATS.COMPRESSED_RG11_EAC] = 1, _a$2[INTERNAL_FORMATS.COMPRESSED_SIGNED_RG11_EAC] = 1, _a$2[INTERNAL_FORMATS.COMPRESSED_RGB8_ETC2] = .5, _a$2[INTERNAL_FORMATS.COMPRESSED_RGBA8_ETC2_EAC] = 1, _a$2[INTERNAL_FORMATS.COMPRESSED_SRGB8_ETC2] = .5, _a$2[INTERNAL_FORMATS.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC] = 1, _a$2[INTERNAL_FORMATS.COMPRESSED_RGB8_PUNCHTHROUGH_ALPHA1_ETC2] = .5, _a$2[INTERNAL_FORMATS.COMPRESSED_SRGB8_PUNCHTHROUGH_ALPHA1_ETC2] = .5, _a$2[INTERNAL_FORMATS.COMPRESSED_RGB_PVRTC_4BPPV1_IMG] = .5, _a$2[INTERNAL_FORMATS.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG] = .5, _a$2[INTERNAL_FORMATS.COMPRESSED_RGB_PVRTC_2BPPV1_IMG] = .25, _a$2[INTERNAL_FORMATS.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG] = .25, _a$2[INTERNAL_FORMATS.COMPRESSED_RGB_ETC1_WEBGL] = .5, _a$2[INTERNAL_FORMATS.COMPRESSED_RGB_ATC_WEBGL] = .5, _a$2[INTERNAL_FORMATS.COMPRESSED_RGBA_ATC_EXPLICIT_ALPHA_WEBGL] = 1, _a$2[INTERNAL_FORMATS.COMPRESSED_RGBA_ATC_INTERPOLATED_ALPHA_WEBGL] = 1, _a$2[INTERNAL_FORMATS.COMPRESSED_RGBA_ASTC_4x4_KHR] = 1, _a$2);
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics$16 = function(d, b) {
	extendStatics$16 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
		d.__proto__ = b;
	} || function(d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	};
	return extendStatics$16(d, b);
};
function __extends$16(d, b) {
	extendStatics$16(d, b);
	function __() {
		this.constructor = d;
	}
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
function __awaiter(thisArg, _arguments, P, generator) {
	function adopt(value) {
		return value instanceof P ? value : new P(function(resolve) {
			resolve(value);
		});
	}
	return new (P || (P = Promise))(function(resolve, reject) {
		function fulfilled(value) {
			try {
				step(generator.next(value));
			} catch (e) {
				reject(e);
			}
		}
		function rejected(value) {
			try {
				step(generator["throw"](value));
			} catch (e) {
				reject(e);
			}
		}
		function step(result) {
			result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
		}
		step((generator = generator.apply(thisArg, _arguments || [])).next());
	});
}
function __generator(thisArg, body) {
	var _ = {
		label: 0,
		sent: function() {
			if (t[0] & 1) throw t[1];
			return t[1];
		},
		trys: [],
		ops: []
	}, f, y, t, g = {
		next: verb(0),
		"throw": verb(1),
		"return": verb(2)
	};
	return typeof Symbol === "function" && (g[Symbol.iterator] = function() {
		return this;
	}), g;
	function verb(n) {
		return function(v) {
			return step([n, v]);
		};
	}
	function step(op) {
		if (f) throw new TypeError("Generator is already executing.");
		while (_) try {
			if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
			if (y = 0, t) op = [op[0] & 2, t.value];
			switch (op[0]) {
				case 0:
				case 1:
					t = op;
					break;
				case 4:
					_.label++;
					return {
						value: op[1],
						done: false
					};
				case 5:
					_.label++;
					y = op[1];
					op = [0];
					continue;
				case 7:
					op = _.ops.pop();
					_.trys.pop();
					continue;
				default:
					if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
						_ = 0;
						continue;
					}
					if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
						_.label = op[1];
						break;
					}
					if (op[0] === 6 && _.label < t[1]) {
						_.label = t[1];
						t = op;
						break;
					}
					if (t && _.label < t[2]) {
						_.label = t[2];
						_.ops.push(op);
						break;
					}
					if (t[2]) _.ops.pop();
					_.trys.pop();
					continue;
			}
			op = body.call(thisArg, _);
		} catch (e) {
			op = [6, e];
			y = 0;
		} finally {
			f = t = 0;
		}
		if (op[0] & 5) throw op[1];
		return {
			value: op[0] ? op[1] : void 0,
			done: true
		};
	}
}
/**
* Resource that fetches texture data over the network and stores it in a buffer.
* @class
* @extends PIXI.Resource
* @memberof PIXI
*/
var BlobResource = function(_super) {
	__extends$16(BlobResource, _super);
	/**
	* @param {string} source - the URL of the texture file
	* @param {PIXI.IBlobOptions} options
	* @param {boolean}[options.autoLoad] - whether to fetch the data immediately;
	*  you can fetch it later via {@link BlobResource#load}
	* @param {boolean}[options.width] - the width in pixels.
	* @param {boolean}[options.height] - the height in pixels.
	*/
	function BlobResource(source, options) {
		if (options === void 0) options = {
			width: 1,
			height: 1,
			autoLoad: true
		};
		var _this = this;
		var origin;
		var data;
		if (typeof source === "string") {
			origin = source;
			data = /* @__PURE__ */ new Uint8Array();
		} else {
			origin = null;
			data = source;
		}
		_this = _super.call(this, data, options) || this;
		/**
		* The URL of the texture file
		* @member {string}
		*/
		_this.origin = origin;
		/**
		* The viewable buffer on the data
		* @member {ViewableBuffer}
		*/
		_this.buffer = data ? new ViewableBuffer(data) : null;
		if (_this.origin && options.autoLoad !== false) _this.load();
		if (data && data.length) {
			_this.loaded = true;
			_this.onBlobLoaded(_this.buffer.rawBinaryData);
		}
		return _this;
	}
	BlobResource.prototype.onBlobLoaded = function(_data) {};
	/** Loads the blob */
	BlobResource.prototype.load = function() {
		return __awaiter(this, void 0, Promise, function() {
			var response, blob, arrayBuffer;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0: return [4, fetch(this.origin)];
					case 1:
						response = _a.sent();
						return [4, response.blob()];
					case 2:
						blob = _a.sent();
						return [4, blob.arrayBuffer()];
					case 3:
						arrayBuffer = _a.sent();
						this.data = new Uint32Array(arrayBuffer);
						this.buffer = new ViewableBuffer(arrayBuffer);
						this.loaded = true;
						this.onBlobLoaded(arrayBuffer);
						this.update();
						return [2, this];
				}
			});
		});
	};
	return BlobResource;
}(BufferResource);
/**
* Resource for compressed texture formats, as follows: S3TC/DXTn (& their sRGB formats), ATC, ASTC, ETC 1/2, PVRTC.
*
* Compressed textures improve performance when rendering is texture-bound. The texture data stays compressed in
* graphics memory, increasing memory locality and speeding up texture fetches. These formats can also be used to store
* more detail in the same amount of memory.
*
* For most developers, container file formats are a better abstraction instead of directly handling raw texture
* data. PixiJS provides native support for the following texture file formats (via {@link PIXI.Loader}):
*
* **.dds** - the DirectDraw Surface file format stores DXTn (DXT-1,3,5) data. See {@link PIXI.DDSLoader}
* **.ktx** - the Khronos Texture Container file format supports storing all the supported WebGL compression formats.
*  See {@link PIXI.KTXLoader}.
* **.basis** - the BASIS supercompressed file format stores texture data in an internal format that is transcoded
*  to the compression format supported on the device at _runtime_. It also supports transcoding into a uncompressed
*  format as a fallback; you must install the `@pixi/basis-loader`, `@pixi/basis-transcoder` packages separately to
*  use these files. See {@link PIXI.BasisLoader}.
*
* The loaders for the aforementioned formats use `CompressedTextureResource` internally. It is strongly suggested that
* they be used instead.
*
* ## Working directly with CompressedTextureResource
*
* Since `CompressedTextureResource` inherits `BlobResource`, you can provide it a URL pointing to a file containing
* the raw texture data (with no file headers!):
*
* ```js
* // The resource backing the texture data for your textures.
* // NOTE: You can also provide a ArrayBufferView instead of a URL. This is used when loading data from a container file
* //   format such as KTX, DDS, or BASIS.
* const compressedResource = new PIXI.CompressedTextureResource("bunny.dxt5", {
*   format: PIXI.INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT5_EXT,
*   width: 256,
*   height: 256
* });
*
* // You can create a base-texture to the cache, so that future `Texture`s can be created using the `Texture.from` API.
* const baseTexture = new PIXI.BaseTexture(compressedResource, { pmaMode: PIXI.ALPHA_MODES.NPM });
*
* // Create a Texture to add to the TextureCache
* const texture = new PIXI.Texture(baseTexture);
*
* // Add baseTexture & texture to the global texture cache
* PIXI.BaseTexture.addToCache(baseTexture, "bunny.dxt5");
* PIXI.Texture.addToCache(texture, "bunny.dxt5");
* ```
* @memberof PIXI
*/
var CompressedTextureResource = function(_super) {
	__extends$16(CompressedTextureResource, _super);
	/**
	* @param source - the buffer/URL holding the compressed texture data
	* @param options
	* @param {PIXI.INTERNAL_FORMATS} options.format - the compression format
	* @param {number} options.width - the image width in pixels.
	* @param {number} options.height - the image height in pixels.
	* @param {number} [options.level=1] - the mipmap levels stored in the compressed texture, including level 0.
	* @param {number} [options.levelBuffers] - the buffers for each mipmap level. `CompressedTextureResource` can allows you
	*      to pass `null` for `source`, for cases where each level is stored in non-contiguous memory.
	*/
	function CompressedTextureResource(source, options) {
		var _this = _super.call(this, source, options) || this;
		_this.format = options.format;
		_this.levels = options.levels || 1;
		_this._width = options.width;
		_this._height = options.height;
		_this._extension = CompressedTextureResource._formatToExtension(_this.format);
		if (options.levelBuffers || _this.buffer) _this._levelBuffers = options.levelBuffers || CompressedTextureResource._createLevelBuffers(source instanceof Uint8Array ? source : _this.buffer.uint8View, _this.format, _this.levels, 4, 4, _this.width, _this.height);
		return _this;
	}
	/**
	* @override
	* @param renderer - A reference to the current renderer
	* @param _texture - the texture
	* @param _glTexture - texture instance for this webgl context
	*/
	CompressedTextureResource.prototype.upload = function(renderer, _texture, _glTexture) {
		var gl = renderer.gl;
		if (!renderer.context.extensions[this._extension]) throw new Error(this._extension + " textures are not supported on the current machine");
		if (!this._levelBuffers) return false;
		for (var i = 0, j = this.levels; i < j; i++) {
			var _a = this._levelBuffers[i], levelID = _a.levelID, levelWidth = _a.levelWidth, levelHeight = _a.levelHeight, levelBuffer = _a.levelBuffer;
			gl.compressedTexImage2D(gl.TEXTURE_2D, levelID, this.format, levelWidth, levelHeight, 0, levelBuffer);
		}
		return true;
	};
	/** @protected */
	CompressedTextureResource.prototype.onBlobLoaded = function() {
		this._levelBuffers = CompressedTextureResource._createLevelBuffers(this.buffer.uint8View, this.format, this.levels, 4, 4, this.width, this.height);
	};
	/**
	* Returns the key (to ContextSystem#extensions) for the WebGL extension supporting the compression format
	* @private
	* @param format - the compression format to get the extension for.
	*/
	CompressedTextureResource._formatToExtension = function(format) {
		if (format >= 33776 && format <= 33779) return "s3tc";
		else if (format >= 37488 && format <= 37497) return "etc";
		else if (format >= 35840 && format <= 35843) return "pvrtc";
		else if (format >= 36196) return "etc1";
		else if (format >= 35986 && format <= 34798) return "atc";
		throw new Error("Invalid (compressed) texture format given!");
	};
	/**
	* Pre-creates buffer views for each mipmap level
	* @private
	* @param buffer -
	* @param format - compression formats
	* @param levels - mipmap levels
	* @param blockWidth -
	* @param blockHeight -
	* @param imageWidth - width of the image in pixels
	* @param imageHeight - height of the image in pixels
	*/
	CompressedTextureResource._createLevelBuffers = function(buffer, format, levels, blockWidth, blockHeight, imageWidth, imageHeight) {
		var buffers = new Array(levels);
		var offset = buffer.byteOffset;
		var levelWidth = imageWidth;
		var levelHeight = imageHeight;
		var alignedLevelWidth = levelWidth + blockWidth - 1 & ~(blockWidth - 1);
		var alignedLevelHeight = levelHeight + blockHeight - 1 & ~(blockHeight - 1);
		var levelSize = alignedLevelWidth * alignedLevelHeight * INTERNAL_FORMAT_TO_BYTES_PER_PIXEL[format];
		for (var i = 0; i < levels; i++) {
			buffers[i] = {
				levelID: i,
				levelWidth: levels > 1 ? levelWidth : alignedLevelWidth,
				levelHeight: levels > 1 ? levelHeight : alignedLevelHeight,
				levelBuffer: new Uint8Array(buffer.buffer, offset, levelSize)
			};
			offset += levelSize;
			levelWidth = levelWidth >> 1 || 1;
			levelHeight = levelHeight >> 1 || 1;
			alignedLevelWidth = levelWidth + blockWidth - 1 & ~(blockWidth - 1);
			alignedLevelHeight = levelHeight + blockHeight - 1 & ~(blockHeight - 1);
			levelSize = alignedLevelWidth * alignedLevelHeight * INTERNAL_FORMAT_TO_BYTES_PER_PIXEL[format];
		}
		return buffers;
	};
	return CompressedTextureResource;
}(BlobResource);
/**
* Loader plugin for handling compressed textures for all platforms.
* @class
* @memberof PIXI
* @implements {PIXI.ILoaderPlugin}
*/
var CompressedTextureLoader = function() {
	function CompressedTextureLoader() {}
	/**
	* Called after a compressed-textures manifest is loaded.
	*
	* This will then load the correct compression format for the device. Your manifest should adhere
	* to the following schema:
	*
	* ```js
	* import { INTERNAL_FORMATS } from '@pixi/constants';
	*
	* type CompressedTextureManifest = {
	*  textures: Array<{ src: string, format?: keyof INTERNAL_FORMATS}>,
	*  cacheID: string;
	* };
	* ```
	*
	* This is an example of a .json manifest file
	*
	* ```json
	* {
	*   "cacheID":"asset",
	*   "textures":[
	*     { "src":"asset.fallback.png" },
	*     { "format":"COMPRESSED_RGBA_S3TC_DXT5_EXT", "src":"asset.s3tc.ktx" },
	*     { "format":"COMPRESSED_RGBA8_ETC2_EAC", "src":"asset.etc.ktx" },
	*     { "format":"RGBA_PVRTC_4BPPV1_IMG", "src":"asset.pvrtc.ktx" }
	*   ]
	* }
	* ```
	*/
	CompressedTextureLoader.use = function(resource, next) {
		var data = resource.data;
		var loader = this;
		if (resource.type === LoaderResource.TYPE.JSON && data && data.cacheID && data.textures) {
			var textures = data.textures;
			var textureURL = void 0;
			var fallbackURL = void 0;
			for (var i = 0, j = textures.length; i < j; i++) {
				var texture = textures[i];
				var url_1 = texture.src;
				var format = texture.format;
				if (!format) fallbackURL = url_1;
				if (CompressedTextureLoader.textureFormats[format]) {
					textureURL = url_1;
					break;
				}
			}
			textureURL = textureURL || fallbackURL;
			if (!textureURL) {
				next(/* @__PURE__ */ new Error("Cannot load compressed-textures in " + resource.url + ", make sure you provide a fallback"));
				return;
			}
			if (textureURL === resource.url) {
				next(/* @__PURE__ */ new Error("URL of compressed texture cannot be the same as the manifest's URL"));
				return;
			}
			var loadOptions = {
				crossOrigin: resource.crossOrigin,
				metadata: resource.metadata.imageMetadata,
				parentResource: resource
			};
			var resourcePath = url.resolve(resource.url.replace(loader.baseUrl, ""), textureURL);
			var resourceName = data.cacheID;
			loader.add(resourceName, resourcePath, loadOptions, function(res) {
				if (res.error) {
					next(res.error);
					return;
				}
				var _a = res.texture, texture = _a === void 0 ? null : _a, _b = res.textures;
				Object.assign(resource, {
					texture,
					textures: _b === void 0 ? {} : _b
				});
				next();
			});
		} else next();
	};
	Object.defineProperty(CompressedTextureLoader, "textureExtensions", {
		/**  Map of available texture extensions. */
		get: function() {
			if (!CompressedTextureLoader._textureExtensions) {
				var gl = settings.ADAPTER.createCanvas().getContext("webgl");
				if (!gl) {
					console.warn("WebGL not available for compressed textures. Silently failing.");
					return {};
				}
				CompressedTextureLoader._textureExtensions = {
					s3tc: gl.getExtension("WEBGL_compressed_texture_s3tc"),
					s3tc_sRGB: gl.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
					etc: gl.getExtension("WEBGL_compressed_texture_etc"),
					etc1: gl.getExtension("WEBGL_compressed_texture_etc1"),
					pvrtc: gl.getExtension("WEBGL_compressed_texture_pvrtc") || gl.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
					atc: gl.getExtension("WEBGL_compressed_texture_atc"),
					astc: gl.getExtension("WEBGL_compressed_texture_astc")
				};
			}
			return CompressedTextureLoader._textureExtensions;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(CompressedTextureLoader, "textureFormats", {
		/** Map of available texture formats. */
		get: function() {
			if (!CompressedTextureLoader._textureFormats) {
				var extensions = CompressedTextureLoader.textureExtensions;
				CompressedTextureLoader._textureFormats = {};
				for (var extensionName in extensions) {
					var extension = extensions[extensionName];
					if (!extension) continue;
					Object.assign(CompressedTextureLoader._textureFormats, Object.getPrototypeOf(extension));
				}
			}
			return CompressedTextureLoader._textureFormats;
		},
		enumerable: false,
		configurable: true
	});
	/** @ignore */
	CompressedTextureLoader.extension = ExtensionType.Loader;
	return CompressedTextureLoader;
}();
/**
* Creates base-textures and textures for each compressed-texture resource and adds them into the global
* texture cache. The first texture has two IDs - `${url}`, `${url}-1`; while the rest have an ID of the
* form `${url}-i`.
* @param url - the original address of the resources
* @param resources - the resources backing texture data
* @ignore
*/
function registerCompressedTextures(url, resources, metadata) {
	var result = {
		textures: {},
		texture: null
	};
	if (!resources) return result;
	resources.map(function(resource) {
		return new Texture(new BaseTexture(resource, Object.assign({
			mipmap: MIPMAP_MODES.OFF,
			alphaMode: ALPHA_MODES.NO_PREMULTIPLIED_ALPHA
		}, metadata)));
	}).forEach(function(texture, i) {
		var baseTexture = texture.baseTexture;
		var cacheID = url + "-" + (i + 1);
		BaseTexture.addToCache(baseTexture, cacheID);
		Texture.addToCache(texture, cacheID);
		if (i === 0) {
			BaseTexture.addToCache(baseTexture, url);
			Texture.addToCache(texture, url);
			result.texture = texture;
		}
		result.textures[cacheID] = texture;
	});
	return result;
}
var _a$1;
var _b$1;
var DDS_MAGIC_SIZE = 4;
var DDS_HEADER_SIZE = 124;
var DDS_HEADER_PF_SIZE = 32;
var DDS_HEADER_DX10_SIZE = 20;
var DDS_MAGIC = 542327876;
/**
* DWORD offsets of the DDS file header fields (relative to file start).
* @ignore
*/
var DDS_FIELDS = {
	SIZE: 1,
	FLAGS: 2,
	HEIGHT: 3,
	WIDTH: 4,
	MIPMAP_COUNT: 7,
	PIXEL_FORMAT: 19
};
/**
* DWORD offsets of the DDS PIXEL_FORMAT fields.
* @ignore
*/
var DDS_PF_FIELDS = {
	SIZE: 0,
	FLAGS: 1,
	FOURCC: 2,
	RGB_BITCOUNT: 3,
	R_BIT_MASK: 4,
	G_BIT_MASK: 5,
	B_BIT_MASK: 6,
	A_BIT_MASK: 7
};
/**
* DWORD offsets of the DDS_HEADER_DX10 fields.
* @ignore
*/
var DDS_DX10_FIELDS = {
	DXGI_FORMAT: 0,
	RESOURCE_DIMENSION: 1,
	MISC_FLAG: 2,
	ARRAY_SIZE: 3,
	MISC_FLAGS2: 4
};
/**
* @see https://docs.microsoft.com/en-us/windows/win32/api/dxgiformat/ne-dxgiformat-dxgi_format
* @ignore
*/
var DXGI_FORMAT;
(function(DXGI_FORMAT) {
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_UNKNOWN"] = 0] = "DXGI_FORMAT_UNKNOWN";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32G32B32A32_TYPELESS"] = 1] = "DXGI_FORMAT_R32G32B32A32_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32G32B32A32_FLOAT"] = 2] = "DXGI_FORMAT_R32G32B32A32_FLOAT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32G32B32A32_UINT"] = 3] = "DXGI_FORMAT_R32G32B32A32_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32G32B32A32_SINT"] = 4] = "DXGI_FORMAT_R32G32B32A32_SINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32G32B32_TYPELESS"] = 5] = "DXGI_FORMAT_R32G32B32_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32G32B32_FLOAT"] = 6] = "DXGI_FORMAT_R32G32B32_FLOAT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32G32B32_UINT"] = 7] = "DXGI_FORMAT_R32G32B32_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32G32B32_SINT"] = 8] = "DXGI_FORMAT_R32G32B32_SINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16G16B16A16_TYPELESS"] = 9] = "DXGI_FORMAT_R16G16B16A16_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16G16B16A16_FLOAT"] = 10] = "DXGI_FORMAT_R16G16B16A16_FLOAT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16G16B16A16_UNORM"] = 11] = "DXGI_FORMAT_R16G16B16A16_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16G16B16A16_UINT"] = 12] = "DXGI_FORMAT_R16G16B16A16_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16G16B16A16_SNORM"] = 13] = "DXGI_FORMAT_R16G16B16A16_SNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16G16B16A16_SINT"] = 14] = "DXGI_FORMAT_R16G16B16A16_SINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32G32_TYPELESS"] = 15] = "DXGI_FORMAT_R32G32_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32G32_FLOAT"] = 16] = "DXGI_FORMAT_R32G32_FLOAT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32G32_UINT"] = 17] = "DXGI_FORMAT_R32G32_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32G32_SINT"] = 18] = "DXGI_FORMAT_R32G32_SINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32G8X24_TYPELESS"] = 19] = "DXGI_FORMAT_R32G8X24_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_D32_FLOAT_S8X24_UINT"] = 20] = "DXGI_FORMAT_D32_FLOAT_S8X24_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32_FLOAT_X8X24_TYPELESS"] = 21] = "DXGI_FORMAT_R32_FLOAT_X8X24_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_X32_TYPELESS_G8X24_UINT"] = 22] = "DXGI_FORMAT_X32_TYPELESS_G8X24_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R10G10B10A2_TYPELESS"] = 23] = "DXGI_FORMAT_R10G10B10A2_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R10G10B10A2_UNORM"] = 24] = "DXGI_FORMAT_R10G10B10A2_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R10G10B10A2_UINT"] = 25] = "DXGI_FORMAT_R10G10B10A2_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R11G11B10_FLOAT"] = 26] = "DXGI_FORMAT_R11G11B10_FLOAT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8G8B8A8_TYPELESS"] = 27] = "DXGI_FORMAT_R8G8B8A8_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8G8B8A8_UNORM"] = 28] = "DXGI_FORMAT_R8G8B8A8_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8G8B8A8_UNORM_SRGB"] = 29] = "DXGI_FORMAT_R8G8B8A8_UNORM_SRGB";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8G8B8A8_UINT"] = 30] = "DXGI_FORMAT_R8G8B8A8_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8G8B8A8_SNORM"] = 31] = "DXGI_FORMAT_R8G8B8A8_SNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8G8B8A8_SINT"] = 32] = "DXGI_FORMAT_R8G8B8A8_SINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16G16_TYPELESS"] = 33] = "DXGI_FORMAT_R16G16_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16G16_FLOAT"] = 34] = "DXGI_FORMAT_R16G16_FLOAT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16G16_UNORM"] = 35] = "DXGI_FORMAT_R16G16_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16G16_UINT"] = 36] = "DXGI_FORMAT_R16G16_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16G16_SNORM"] = 37] = "DXGI_FORMAT_R16G16_SNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16G16_SINT"] = 38] = "DXGI_FORMAT_R16G16_SINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32_TYPELESS"] = 39] = "DXGI_FORMAT_R32_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_D32_FLOAT"] = 40] = "DXGI_FORMAT_D32_FLOAT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32_FLOAT"] = 41] = "DXGI_FORMAT_R32_FLOAT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32_UINT"] = 42] = "DXGI_FORMAT_R32_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R32_SINT"] = 43] = "DXGI_FORMAT_R32_SINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R24G8_TYPELESS"] = 44] = "DXGI_FORMAT_R24G8_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_D24_UNORM_S8_UINT"] = 45] = "DXGI_FORMAT_D24_UNORM_S8_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R24_UNORM_X8_TYPELESS"] = 46] = "DXGI_FORMAT_R24_UNORM_X8_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_X24_TYPELESS_G8_UINT"] = 47] = "DXGI_FORMAT_X24_TYPELESS_G8_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8G8_TYPELESS"] = 48] = "DXGI_FORMAT_R8G8_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8G8_UNORM"] = 49] = "DXGI_FORMAT_R8G8_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8G8_UINT"] = 50] = "DXGI_FORMAT_R8G8_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8G8_SNORM"] = 51] = "DXGI_FORMAT_R8G8_SNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8G8_SINT"] = 52] = "DXGI_FORMAT_R8G8_SINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16_TYPELESS"] = 53] = "DXGI_FORMAT_R16_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16_FLOAT"] = 54] = "DXGI_FORMAT_R16_FLOAT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_D16_UNORM"] = 55] = "DXGI_FORMAT_D16_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16_UNORM"] = 56] = "DXGI_FORMAT_R16_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16_UINT"] = 57] = "DXGI_FORMAT_R16_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16_SNORM"] = 58] = "DXGI_FORMAT_R16_SNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R16_SINT"] = 59] = "DXGI_FORMAT_R16_SINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8_TYPELESS"] = 60] = "DXGI_FORMAT_R8_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8_UNORM"] = 61] = "DXGI_FORMAT_R8_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8_UINT"] = 62] = "DXGI_FORMAT_R8_UINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8_SNORM"] = 63] = "DXGI_FORMAT_R8_SNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8_SINT"] = 64] = "DXGI_FORMAT_R8_SINT";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_A8_UNORM"] = 65] = "DXGI_FORMAT_A8_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R1_UNORM"] = 66] = "DXGI_FORMAT_R1_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R9G9B9E5_SHAREDEXP"] = 67] = "DXGI_FORMAT_R9G9B9E5_SHAREDEXP";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R8G8_B8G8_UNORM"] = 68] = "DXGI_FORMAT_R8G8_B8G8_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_G8R8_G8B8_UNORM"] = 69] = "DXGI_FORMAT_G8R8_G8B8_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC1_TYPELESS"] = 70] = "DXGI_FORMAT_BC1_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC1_UNORM"] = 71] = "DXGI_FORMAT_BC1_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC1_UNORM_SRGB"] = 72] = "DXGI_FORMAT_BC1_UNORM_SRGB";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC2_TYPELESS"] = 73] = "DXGI_FORMAT_BC2_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC2_UNORM"] = 74] = "DXGI_FORMAT_BC2_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC2_UNORM_SRGB"] = 75] = "DXGI_FORMAT_BC2_UNORM_SRGB";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC3_TYPELESS"] = 76] = "DXGI_FORMAT_BC3_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC3_UNORM"] = 77] = "DXGI_FORMAT_BC3_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC3_UNORM_SRGB"] = 78] = "DXGI_FORMAT_BC3_UNORM_SRGB";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC4_TYPELESS"] = 79] = "DXGI_FORMAT_BC4_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC4_UNORM"] = 80] = "DXGI_FORMAT_BC4_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC4_SNORM"] = 81] = "DXGI_FORMAT_BC4_SNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC5_TYPELESS"] = 82] = "DXGI_FORMAT_BC5_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC5_UNORM"] = 83] = "DXGI_FORMAT_BC5_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC5_SNORM"] = 84] = "DXGI_FORMAT_BC5_SNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_B5G6R5_UNORM"] = 85] = "DXGI_FORMAT_B5G6R5_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_B5G5R5A1_UNORM"] = 86] = "DXGI_FORMAT_B5G5R5A1_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_B8G8R8A8_UNORM"] = 87] = "DXGI_FORMAT_B8G8R8A8_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_B8G8R8X8_UNORM"] = 88] = "DXGI_FORMAT_B8G8R8X8_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_R10G10B10_XR_BIAS_A2_UNORM"] = 89] = "DXGI_FORMAT_R10G10B10_XR_BIAS_A2_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_B8G8R8A8_TYPELESS"] = 90] = "DXGI_FORMAT_B8G8R8A8_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_B8G8R8A8_UNORM_SRGB"] = 91] = "DXGI_FORMAT_B8G8R8A8_UNORM_SRGB";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_B8G8R8X8_TYPELESS"] = 92] = "DXGI_FORMAT_B8G8R8X8_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_B8G8R8X8_UNORM_SRGB"] = 93] = "DXGI_FORMAT_B8G8R8X8_UNORM_SRGB";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC6H_TYPELESS"] = 94] = "DXGI_FORMAT_BC6H_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC6H_UF16"] = 95] = "DXGI_FORMAT_BC6H_UF16";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC6H_SF16"] = 96] = "DXGI_FORMAT_BC6H_SF16";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC7_TYPELESS"] = 97] = "DXGI_FORMAT_BC7_TYPELESS";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC7_UNORM"] = 98] = "DXGI_FORMAT_BC7_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_BC7_UNORM_SRGB"] = 99] = "DXGI_FORMAT_BC7_UNORM_SRGB";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_AYUV"] = 100] = "DXGI_FORMAT_AYUV";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_Y410"] = 101] = "DXGI_FORMAT_Y410";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_Y416"] = 102] = "DXGI_FORMAT_Y416";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_NV12"] = 103] = "DXGI_FORMAT_NV12";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_P010"] = 104] = "DXGI_FORMAT_P010";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_P016"] = 105] = "DXGI_FORMAT_P016";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_420_OPAQUE"] = 106] = "DXGI_FORMAT_420_OPAQUE";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_YUY2"] = 107] = "DXGI_FORMAT_YUY2";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_Y210"] = 108] = "DXGI_FORMAT_Y210";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_Y216"] = 109] = "DXGI_FORMAT_Y216";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_NV11"] = 110] = "DXGI_FORMAT_NV11";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_AI44"] = 111] = "DXGI_FORMAT_AI44";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_IA44"] = 112] = "DXGI_FORMAT_IA44";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_P8"] = 113] = "DXGI_FORMAT_P8";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_A8P8"] = 114] = "DXGI_FORMAT_A8P8";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_B4G4R4A4_UNORM"] = 115] = "DXGI_FORMAT_B4G4R4A4_UNORM";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_P208"] = 116] = "DXGI_FORMAT_P208";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_V208"] = 117] = "DXGI_FORMAT_V208";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_V408"] = 118] = "DXGI_FORMAT_V408";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_SAMPLER_FEEDBACK_MIN_MIP_OPAQUE"] = 119] = "DXGI_FORMAT_SAMPLER_FEEDBACK_MIN_MIP_OPAQUE";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_SAMPLER_FEEDBACK_MIP_REGION_USED_OPAQUE"] = 120] = "DXGI_FORMAT_SAMPLER_FEEDBACK_MIP_REGION_USED_OPAQUE";
	DXGI_FORMAT[DXGI_FORMAT["DXGI_FORMAT_FORCE_UINT"] = 121] = "DXGI_FORMAT_FORCE_UINT";
})(DXGI_FORMAT || (DXGI_FORMAT = {}));
/**
* Possible values of the field {@link DDS_DX10_FIELDS.RESOURCE_DIMENSION}
* @ignore
*/
var D3D10_RESOURCE_DIMENSION;
(function(D3D10_RESOURCE_DIMENSION) {
	D3D10_RESOURCE_DIMENSION[D3D10_RESOURCE_DIMENSION["DDS_DIMENSION_TEXTURE1D"] = 2] = "DDS_DIMENSION_TEXTURE1D";
	D3D10_RESOURCE_DIMENSION[D3D10_RESOURCE_DIMENSION["DDS_DIMENSION_TEXTURE2D"] = 3] = "DDS_DIMENSION_TEXTURE2D";
	D3D10_RESOURCE_DIMENSION[D3D10_RESOURCE_DIMENSION["DDS_DIMENSION_TEXTURE3D"] = 6] = "DDS_DIMENSION_TEXTURE3D";
})(D3D10_RESOURCE_DIMENSION || (D3D10_RESOURCE_DIMENSION = {}));
var PF_FLAGS = 1;
var DDPF_ALPHA = 2;
var DDPF_FOURCC = 4;
var DDPF_RGB = 64;
var DDPF_YUV = 512;
var DDPF_LUMINANCE = 131072;
var FOURCC_DXT1 = 827611204;
var FOURCC_DXT3 = 861165636;
var FOURCC_DXT5 = 894720068;
var FOURCC_DX10 = 808540228;
var DDS_RESOURCE_MISC_TEXTURECUBE = 4;
/**
* Maps `FOURCC_*` formats to internal formats (see {@link PIXI.INTERNAL_FORMATS}).
* @ignore
*/
var FOURCC_TO_FORMAT = (_a$1 = {}, _a$1[FOURCC_DXT1] = INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT1_EXT, _a$1[FOURCC_DXT3] = INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT3_EXT, _a$1[FOURCC_DXT5] = INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT5_EXT, _a$1);
/**
* Maps {@link DXGI_FORMAT} to types/internal-formats (see {@link PIXI.TYPES}, {@link PIXI.INTERNAL_FORMATS})
* @ignore
*/
var DXGI_TO_FORMAT = (_b$1 = {}, _b$1[DXGI_FORMAT.DXGI_FORMAT_BC1_TYPELESS] = INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT1_EXT, _b$1[DXGI_FORMAT.DXGI_FORMAT_BC1_UNORM] = INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT1_EXT, _b$1[DXGI_FORMAT.DXGI_FORMAT_BC2_TYPELESS] = INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT3_EXT, _b$1[DXGI_FORMAT.DXGI_FORMAT_BC2_UNORM] = INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT3_EXT, _b$1[DXGI_FORMAT.DXGI_FORMAT_BC3_TYPELESS] = INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT5_EXT, _b$1[DXGI_FORMAT.DXGI_FORMAT_BC3_UNORM] = INTERNAL_FORMATS.COMPRESSED_RGBA_S3TC_DXT5_EXT, _b$1[DXGI_FORMAT.DXGI_FORMAT_BC1_UNORM_SRGB] = INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT, _b$1[DXGI_FORMAT.DXGI_FORMAT_BC2_UNORM_SRGB] = INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT, _b$1[DXGI_FORMAT.DXGI_FORMAT_BC3_UNORM_SRGB] = INTERNAL_FORMATS.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT, _b$1);
/**
* @class
* @memberof PIXI
* @implements {PIXI.ILoaderPlugin}
* @see https://docs.microsoft.com/en-us/windows/win32/direct3ddds/dx-graphics-dds-pguide
*/
/**
* Parses the DDS file header, generates base-textures, and puts them into the texture cache.
* @param arrayBuffer
*/
function parseDDS(arrayBuffer) {
	var data = new Uint32Array(arrayBuffer);
	if (data[0] !== DDS_MAGIC) throw new Error("Invalid DDS file magic word");
	var header = new Uint32Array(arrayBuffer, 0, DDS_HEADER_SIZE / Uint32Array.BYTES_PER_ELEMENT);
	var height = header[DDS_FIELDS.HEIGHT];
	var width = header[DDS_FIELDS.WIDTH];
	var mipmapCount = header[DDS_FIELDS.MIPMAP_COUNT];
	var pixelFormat = new Uint32Array(arrayBuffer, DDS_FIELDS.PIXEL_FORMAT * Uint32Array.BYTES_PER_ELEMENT, DDS_HEADER_PF_SIZE / Uint32Array.BYTES_PER_ELEMENT);
	var formatFlags = pixelFormat[PF_FLAGS];
	if (formatFlags & DDPF_FOURCC) {
		var fourCC = pixelFormat[DDS_PF_FIELDS.FOURCC];
		if (fourCC !== FOURCC_DX10) {
			var internalFormat_1 = FOURCC_TO_FORMAT[fourCC];
			var dataOffset_1 = DDS_MAGIC_SIZE + DDS_HEADER_SIZE;
			return [new CompressedTextureResource(new Uint8Array(arrayBuffer, dataOffset_1), {
				format: internalFormat_1,
				width,
				height,
				levels: mipmapCount
			})];
		}
		var dx10Offset = DDS_MAGIC_SIZE + DDS_HEADER_SIZE;
		var dx10Header = new Uint32Array(data.buffer, dx10Offset, DDS_HEADER_DX10_SIZE / Uint32Array.BYTES_PER_ELEMENT);
		var dxgiFormat = dx10Header[DDS_DX10_FIELDS.DXGI_FORMAT];
		var resourceDimension = dx10Header[DDS_DX10_FIELDS.RESOURCE_DIMENSION];
		var miscFlag = dx10Header[DDS_DX10_FIELDS.MISC_FLAG];
		var arraySize = dx10Header[DDS_DX10_FIELDS.ARRAY_SIZE];
		var internalFormat_2 = DXGI_TO_FORMAT[dxgiFormat];
		if (internalFormat_2 === void 0) throw new Error("DDSParser cannot parse texture data with DXGI format " + dxgiFormat);
		if (miscFlag === DDS_RESOURCE_MISC_TEXTURECUBE) throw new Error("DDSParser does not support cubemap textures");
		if (resourceDimension === D3D10_RESOURCE_DIMENSION.DDS_DIMENSION_TEXTURE3D) throw new Error("DDSParser does not supported 3D texture data");
		var imageBuffers = new Array();
		var dataOffset = DDS_MAGIC_SIZE + DDS_HEADER_SIZE + DDS_HEADER_DX10_SIZE;
		if (arraySize === 1) imageBuffers.push(new Uint8Array(arrayBuffer, dataOffset));
		else {
			var pixelSize = INTERNAL_FORMAT_TO_BYTES_PER_PIXEL[internalFormat_2];
			var imageSize = 0;
			var levelWidth = width;
			var levelHeight = height;
			for (var i = 0; i < mipmapCount; i++) {
				var levelSize = Math.max(1, levelWidth + 3 & -4) * Math.max(1, levelHeight + 3 & -4) * pixelSize;
				imageSize += levelSize;
				levelWidth = levelWidth >>> 1;
				levelHeight = levelHeight >>> 1;
			}
			var imageOffset = dataOffset;
			for (var i = 0; i < arraySize; i++) {
				imageBuffers.push(new Uint8Array(arrayBuffer, imageOffset, imageSize));
				imageOffset += imageSize;
			}
		}
		return imageBuffers.map(function(buffer) {
			return new CompressedTextureResource(buffer, {
				format: internalFormat_2,
				width,
				height,
				levels: mipmapCount
			});
		});
	}
	if (formatFlags & DDPF_RGB) throw new Error("DDSParser does not support uncompressed texture data.");
	if (formatFlags & DDPF_YUV) throw new Error("DDSParser does not supported YUV uncompressed texture data.");
	if (formatFlags & DDPF_LUMINANCE) throw new Error("DDSParser does not support single-channel (lumninance) texture data!");
	if (formatFlags & DDPF_ALPHA) throw new Error("DDSParser does not support single-channel (alpha) texture data!");
	throw new Error("DDSParser failed to load a texture file due to an unknown reason!");
}
var _a$3;
var _b;
var _c;
/**
* The 12-byte KTX file identifier
* @see https://www.khronos.org/opengles/sdk/tools/KTX/file_format_spec/#2.1
* @ignore
*/
var FILE_IDENTIFIER = [
	171,
	75,
	84,
	88,
	32,
	49,
	49,
	187,
	13,
	10,
	26,
	10
];
/**
* The value stored in the "endianness" field.
* @see https://www.khronos.org/opengles/sdk/tools/KTX/file_format_spec/#2.2
* @ignore
*/
var ENDIANNESS = 67305985;
/**
* Byte offsets of the KTX file header fields
* @ignore
*/
var KTX_FIELDS = {
	FILE_IDENTIFIER: 0,
	ENDIANNESS: 12,
	GL_TYPE: 16,
	GL_TYPE_SIZE: 20,
	GL_FORMAT: 24,
	GL_INTERNAL_FORMAT: 28,
	GL_BASE_INTERNAL_FORMAT: 32,
	PIXEL_WIDTH: 36,
	PIXEL_HEIGHT: 40,
	PIXEL_DEPTH: 44,
	NUMBER_OF_ARRAY_ELEMENTS: 48,
	NUMBER_OF_FACES: 52,
	NUMBER_OF_MIPMAP_LEVELS: 56,
	BYTES_OF_KEY_VALUE_DATA: 60
};
/**
* Byte size of the file header fields in {@code KTX_FIELDS}
* @ignore
*/
var FILE_HEADER_SIZE = 64;
/**
* Maps {@link PIXI.TYPES} to the bytes taken per component, excluding those ones that are bit-fields.
* @ignore
*/
var TYPES_TO_BYTES_PER_COMPONENT = (_a$3 = {}, _a$3[TYPES.UNSIGNED_BYTE] = 1, _a$3[TYPES.UNSIGNED_SHORT] = 2, _a$3[TYPES.INT] = 4, _a$3[TYPES.UNSIGNED_INT] = 4, _a$3[TYPES.FLOAT] = 4, _a$3[TYPES.HALF_FLOAT] = 8, _a$3);
/**
* Number of components in each {@link PIXI.FORMATS}
* @ignore
*/
var FORMATS_TO_COMPONENTS = (_b = {}, _b[FORMATS.RGBA] = 4, _b[FORMATS.RGB] = 3, _b[FORMATS.RG] = 2, _b[FORMATS.RED] = 1, _b[FORMATS.LUMINANCE] = 1, _b[FORMATS.LUMINANCE_ALPHA] = 2, _b[FORMATS.ALPHA] = 1, _b);
/**
* Number of bytes per pixel in bit-field types in {@link PIXI.TYPES}
* @ignore
*/
var TYPES_TO_BYTES_PER_PIXEL = (_c = {}, _c[TYPES.UNSIGNED_SHORT_4_4_4_4] = 2, _c[TYPES.UNSIGNED_SHORT_5_5_5_1] = 2, _c[TYPES.UNSIGNED_SHORT_5_6_5] = 2, _c);
function parseKTX(url, arrayBuffer, loadKeyValueData) {
	if (loadKeyValueData === void 0) loadKeyValueData = false;
	var dataView = new DataView(arrayBuffer);
	if (!validate(url, dataView)) return null;
	var littleEndian = dataView.getUint32(KTX_FIELDS.ENDIANNESS, true) === ENDIANNESS;
	var glType = dataView.getUint32(KTX_FIELDS.GL_TYPE, littleEndian);
	var glFormat = dataView.getUint32(KTX_FIELDS.GL_FORMAT, littleEndian);
	var glInternalFormat = dataView.getUint32(KTX_FIELDS.GL_INTERNAL_FORMAT, littleEndian);
	var pixelWidth = dataView.getUint32(KTX_FIELDS.PIXEL_WIDTH, littleEndian);
	var pixelHeight = dataView.getUint32(KTX_FIELDS.PIXEL_HEIGHT, littleEndian) || 1;
	var pixelDepth = dataView.getUint32(KTX_FIELDS.PIXEL_DEPTH, littleEndian) || 1;
	var numberOfArrayElements = dataView.getUint32(KTX_FIELDS.NUMBER_OF_ARRAY_ELEMENTS, littleEndian) || 1;
	var numberOfFaces = dataView.getUint32(KTX_FIELDS.NUMBER_OF_FACES, littleEndian);
	var numberOfMipmapLevels = dataView.getUint32(KTX_FIELDS.NUMBER_OF_MIPMAP_LEVELS, littleEndian);
	var bytesOfKeyValueData = dataView.getUint32(KTX_FIELDS.BYTES_OF_KEY_VALUE_DATA, littleEndian);
	if (pixelHeight === 0 || pixelDepth !== 1) throw new Error("Only 2D textures are supported");
	if (numberOfFaces !== 1) throw new Error("CubeTextures are not supported by KTXLoader yet!");
	if (numberOfArrayElements !== 1) throw new Error("WebGL does not support array textures");
	var blockWidth = 4;
	var blockHeight = 4;
	var alignedWidth = pixelWidth + 3 & -4;
	var alignedHeight = pixelHeight + 3 & -4;
	var imageBuffers = new Array(numberOfArrayElements);
	var imagePixels = pixelWidth * pixelHeight;
	if (glType === 0) imagePixels = alignedWidth * alignedHeight;
	var imagePixelByteSize;
	if (glType !== 0) {
		if (TYPES_TO_BYTES_PER_COMPONENT[glType]) imagePixelByteSize = TYPES_TO_BYTES_PER_COMPONENT[glType] * FORMATS_TO_COMPONENTS[glFormat];
		else imagePixelByteSize = TYPES_TO_BYTES_PER_PIXEL[glType];
	} else imagePixelByteSize = INTERNAL_FORMAT_TO_BYTES_PER_PIXEL[glInternalFormat];
	if (imagePixelByteSize === void 0) throw new Error("Unable to resolve the pixel format stored in the *.ktx file!");
	var kvData = loadKeyValueData ? parseKvData(dataView, bytesOfKeyValueData, littleEndian) : null;
	var mipByteSize = imagePixels * imagePixelByteSize;
	var mipWidth = pixelWidth;
	var mipHeight = pixelHeight;
	var alignedMipWidth = alignedWidth;
	var alignedMipHeight = alignedHeight;
	var imageOffset = FILE_HEADER_SIZE + bytesOfKeyValueData;
	for (var mipmapLevel = 0; mipmapLevel < numberOfMipmapLevels; mipmapLevel++) {
		var imageSize = dataView.getUint32(imageOffset, littleEndian);
		var elementOffset = imageOffset + 4;
		for (var arrayElement = 0; arrayElement < numberOfArrayElements; arrayElement++) {
			var mips = imageBuffers[arrayElement];
			if (!mips) mips = imageBuffers[arrayElement] = new Array(numberOfMipmapLevels);
			mips[mipmapLevel] = {
				levelID: mipmapLevel,
				levelWidth: numberOfMipmapLevels > 1 || glType !== 0 ? mipWidth : alignedMipWidth,
				levelHeight: numberOfMipmapLevels > 1 || glType !== 0 ? mipHeight : alignedMipHeight,
				levelBuffer: new Uint8Array(arrayBuffer, elementOffset, mipByteSize)
			};
			elementOffset += mipByteSize;
		}
		imageOffset += imageSize + 4;
		imageOffset = imageOffset % 4 !== 0 ? imageOffset + 4 - imageOffset % 4 : imageOffset;
		mipWidth = mipWidth >> 1 || 1;
		mipHeight = mipHeight >> 1 || 1;
		alignedMipWidth = mipWidth + blockWidth - 1 & ~(blockWidth - 1);
		alignedMipHeight = mipHeight + blockHeight - 1 & ~(blockHeight - 1);
		mipByteSize = alignedMipWidth * alignedMipHeight * imagePixelByteSize;
	}
	if (glType !== 0) return {
		uncompressed: imageBuffers.map(function(levelBuffers) {
			var buffer = levelBuffers[0].levelBuffer;
			var convertToInt = false;
			if (glType === TYPES.FLOAT) buffer = new Float32Array(levelBuffers[0].levelBuffer.buffer, levelBuffers[0].levelBuffer.byteOffset, levelBuffers[0].levelBuffer.byteLength / 4);
			else if (glType === TYPES.UNSIGNED_INT) {
				convertToInt = true;
				buffer = new Uint32Array(levelBuffers[0].levelBuffer.buffer, levelBuffers[0].levelBuffer.byteOffset, levelBuffers[0].levelBuffer.byteLength / 4);
			} else if (glType === TYPES.INT) {
				convertToInt = true;
				buffer = new Int32Array(levelBuffers[0].levelBuffer.buffer, levelBuffers[0].levelBuffer.byteOffset, levelBuffers[0].levelBuffer.byteLength / 4);
			}
			return {
				resource: new BufferResource(buffer, {
					width: levelBuffers[0].levelWidth,
					height: levelBuffers[0].levelHeight
				}),
				type: glType,
				format: convertToInt ? convertFormatToInteger(glFormat) : glFormat
			};
		}),
		kvData
	};
	return {
		compressed: imageBuffers.map(function(levelBuffers) {
			return new CompressedTextureResource(null, {
				format: glInternalFormat,
				width: pixelWidth,
				height: pixelHeight,
				levels: numberOfMipmapLevels,
				levelBuffers
			});
		}),
		kvData
	};
}
/**
* Checks whether the arrayBuffer contains a valid *.ktx file.
* @param url
* @param dataView
*/
function validate(url, dataView) {
	for (var i = 0; i < FILE_IDENTIFIER.length; i++) if (dataView.getUint8(i) !== FILE_IDENTIFIER[i]) {
		console.error(url + " is not a valid *.ktx file!");
		return false;
	}
	return true;
}
function convertFormatToInteger(format) {
	switch (format) {
		case FORMATS.RGBA: return FORMATS.RGBA_INTEGER;
		case FORMATS.RGB: return FORMATS.RGB_INTEGER;
		case FORMATS.RG: return FORMATS.RG_INTEGER;
		case FORMATS.RED: return FORMATS.RED_INTEGER;
		default: return format;
	}
}
function parseKvData(dataView, bytesOfKeyValueData, littleEndian) {
	var kvData = /* @__PURE__ */ new Map();
	var bytesIntoKeyValueData = 0;
	while (bytesIntoKeyValueData < bytesOfKeyValueData) {
		var keyAndValueByteSize = dataView.getUint32(FILE_HEADER_SIZE + bytesIntoKeyValueData, littleEndian);
		var keyAndValueByteOffset = FILE_HEADER_SIZE + bytesIntoKeyValueData + 4;
		var valuePadding = 3 - (keyAndValueByteSize + 3) % 4;
		if (keyAndValueByteSize === 0 || keyAndValueByteSize > bytesOfKeyValueData - bytesIntoKeyValueData) {
			console.error("KTXLoader: keyAndValueByteSize out of bounds");
			break;
		}
		var keyNulByte = 0;
		for (; keyNulByte < keyAndValueByteSize; keyNulByte++) if (dataView.getUint8(keyAndValueByteOffset + keyNulByte) === 0) break;
		if (keyNulByte === -1) {
			console.error("KTXLoader: Failed to find null byte terminating kvData key");
			break;
		}
		var key = new TextDecoder().decode(new Uint8Array(dataView.buffer, keyAndValueByteOffset, keyNulByte));
		var value = new DataView(dataView.buffer, keyAndValueByteOffset + keyNulByte + 1, keyAndValueByteSize - keyNulByte - 1);
		kvData.set(key, value);
		bytesIntoKeyValueData += 4 + keyAndValueByteSize + valuePadding;
	}
	return kvData;
}
LoaderResource.setExtensionXhrType("dds", LoaderResource.XHR_RESPONSE_TYPE.BUFFER);
/**
* @class
* @memberof PIXI
* @implements {PIXI.ILoaderPlugin}
* @see https://docs.microsoft.com/en-us/windows/win32/direct3ddds/dx-graphics-dds-pguide
*/
var DDSLoader = function() {
	function DDSLoader() {}
	/**
	* Registers a DDS compressed texture
	* @see PIXI.Loader.loaderMiddleware
	* @param resource - loader resource that is checked to see if it is a DDS file
	* @param next - callback Function to call when done
	*/
	DDSLoader.use = function(resource, next) {
		if (resource.extension === "dds" && resource.data) try {
			Object.assign(resource, registerCompressedTextures(resource.name || resource.url, parseDDS(resource.data), resource.metadata));
		} catch (err) {
			next(err);
			return;
		}
		next();
	};
	/** @ignore */
	DDSLoader.extension = ExtensionType.Loader;
	return DDSLoader;
}();
LoaderResource.setExtensionXhrType("ktx", LoaderResource.XHR_RESPONSE_TYPE.BUFFER);
/**
* Loader plugin for handling KTX texture container files.
*
* This KTX loader does not currently support the following features:
* * cube textures
* * 3D textures
* * endianness conversion for big-endian machines
* * embedded *.basis files
*
* It does supports the following features:
* * multiple textures per file
* * mipmapping (only for compressed formats)
* * vendor-specific key/value data parsing (enable {@link PIXI.KTXLoader.loadKeyValueData})
* @class
* @memberof PIXI
* @implements {PIXI.ILoaderPlugin}
*/
var KTXLoader = function() {
	function KTXLoader() {}
	/**
	* Called after a KTX file is loaded.
	*
	* This will parse the KTX file header and add a {@code BaseTexture} to the texture
	* cache.
	* @see PIXI.Loader.loaderMiddleware
	* @param resource - loader resource that is checked to see if it is a KTX file
	* @param next - callback Function to call when done
	*/
	KTXLoader.use = function(resource, next) {
		if (resource.extension === "ktx" && resource.data) try {
			var url_1 = resource.name || resource.url;
			var _a = parseKTX(url_1, resource.data, this.loadKeyValueData), compressed = _a.compressed, uncompressed = _a.uncompressed, kvData_1 = _a.kvData;
			if (compressed) {
				var result = registerCompressedTextures(url_1, compressed, resource.metadata);
				if (kvData_1 && result.textures) for (var textureId in result.textures) result.textures[textureId].baseTexture.ktxKeyValueData = kvData_1;
				Object.assign(resource, result);
			} else if (uncompressed) {
				var textures_1 = {};
				uncompressed.forEach(function(image, i) {
					var texture = new Texture(new BaseTexture(image.resource, {
						mipmap: MIPMAP_MODES.OFF,
						alphaMode: ALPHA_MODES.NO_PREMULTIPLIED_ALPHA,
						type: image.type,
						format: image.format
					}));
					var cacheID = url_1 + "-" + (i + 1);
					if (kvData_1) texture.baseTexture.ktxKeyValueData = kvData_1;
					BaseTexture.addToCache(texture.baseTexture, cacheID);
					Texture.addToCache(texture, cacheID);
					if (i === 0) {
						textures_1[url_1] = texture;
						BaseTexture.addToCache(texture.baseTexture, url_1);
						Texture.addToCache(texture, url_1);
					}
					textures_1[cacheID] = texture;
				});
				Object.assign(resource, { textures: textures_1 });
			}
		} catch (err) {
			next(err);
			return;
		}
		next();
	};
	/** @ignore */
	KTXLoader.extension = ExtensionType.Loader;
	/**
	* If set to `true`, {@link PIXI.KTXLoader} will parse key-value data in KTX textures. This feature relies
	* on the [Encoding Standard]{@link https://encoding.spec.whatwg.org}.
	*
	* The key-value data will be available on the base-textures as {@code PIXI.BaseTexture.ktxKeyValueData}. They
	* will hold a reference to the texture data buffer, so make sure to delete key-value data once you are done
	* using it.
	*/
	KTXLoader.loadKeyValueData = false;
	return KTXLoader;
}();
//#endregion
//#region node_modules/@pixi/particle-container/dist/esm/particle-container.mjs
/*!
* @pixi/particle-container - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/particle-container is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics$15 = function(d, b) {
	extendStatics$15 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
		d.__proto__ = b;
	} || function(d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	};
	return extendStatics$15(d, b);
};
function __extends$15(d, b) {
	extendStatics$15(d, b);
	function __() {
		this.constructor = d;
	}
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
/**
* The ParticleContainer class is a really fast version of the Container built solely for speed,
* so use when you need a lot of sprites or particles.
*
* The tradeoff of the ParticleContainer is that most advanced functionality will not work.
* ParticleContainer implements the basic object transform (position, scale, rotation)
* and some advanced functionality like tint (as of v4.5.6).
*
* Other more advanced functionality like masking, children, filters, etc will not work on sprites in this batch.
*
* It's extremely easy to use:
* ```js
* let container = new ParticleContainer();
*
* for (let i = 0; i < 100; ++i)
* {
*     let sprite = PIXI.Sprite.from("myImage.png");
*     container.addChild(sprite);
* }
* ```
*
* And here you have a hundred sprites that will be rendered at the speed of light.
* @memberof PIXI
*/
var ParticleContainer = function(_super) {
	__extends$15(ParticleContainer, _super);
	/**
	* @param maxSize - The maximum number of particles that can be rendered by the container.
	*  Affects size of allocated buffers.
	* @param properties - The properties of children that should be uploaded to the gpu and applied.
	* @param {boolean} [properties.vertices=false] - When true, vertices be uploaded and applied.
	*                  if sprite's ` scale/anchor/trim/frame/orig` is dynamic, please set `true`.
	* @param {boolean} [properties.position=true] - When true, position be uploaded and applied.
	* @param {boolean} [properties.rotation=false] - When true, rotation be uploaded and applied.
	* @param {boolean} [properties.uvs=false] - When true, uvs be uploaded and applied.
	* @param {boolean} [properties.tint=false] - When true, alpha and tint be uploaded and applied.
	* @param {number} [batchSize=16384] - Number of particles per batch. If less than maxSize, it uses maxSize instead.
	* @param {boolean} [autoResize=false] - If true, container allocates more batches in case
	*  there are more than `maxSize` particles.
	*/
	function ParticleContainer(maxSize, properties, batchSize, autoResize) {
		if (maxSize === void 0) maxSize = 1500;
		if (batchSize === void 0) batchSize = 16384;
		if (autoResize === void 0) autoResize = false;
		var _this = _super.call(this) || this;
		var maxBatchSize = 16384;
		if (batchSize > maxBatchSize) batchSize = maxBatchSize;
		_this._properties = [
			false,
			true,
			false,
			false,
			false
		];
		_this._maxSize = maxSize;
		_this._batchSize = batchSize;
		_this._buffers = null;
		_this._bufferUpdateIDs = [];
		_this._updateID = 0;
		_this.interactiveChildren = false;
		_this.blendMode = BLEND_MODES.NORMAL;
		_this.autoResize = autoResize;
		_this.roundPixels = true;
		_this.baseTexture = null;
		_this.setProperties(properties);
		_this._tint = 0;
		_this.tintRgb = /* @__PURE__ */ new Float32Array(4);
		_this.tint = 16777215;
		return _this;
	}
	/**
	* Sets the private properties array to dynamic / static based on the passed properties object
	* @param properties - The properties to be uploaded
	*/
	ParticleContainer.prototype.setProperties = function(properties) {
		if (properties) {
			this._properties[0] = "vertices" in properties || "scale" in properties ? !!properties.vertices || !!properties.scale : this._properties[0];
			this._properties[1] = "position" in properties ? !!properties.position : this._properties[1];
			this._properties[2] = "rotation" in properties ? !!properties.rotation : this._properties[2];
			this._properties[3] = "uvs" in properties ? !!properties.uvs : this._properties[3];
			this._properties[4] = "tint" in properties || "alpha" in properties ? !!properties.tint || !!properties.alpha : this._properties[4];
		}
	};
	ParticleContainer.prototype.updateTransform = function() {
		this.displayObjectUpdateTransform();
	};
	Object.defineProperty(ParticleContainer.prototype, "tint", {
		/**
		* The tint applied to the container. This is a hex value.
		* A value of 0xFFFFFF will remove any tint effect.
		* IMPORTANT: This is a WebGL only feature and will be ignored by the canvas renderer.
		* @default 0xFFFFFF
		*/
		get: function() {
			return this._tint;
		},
		set: function(value) {
			this._tint = value;
			hex2rgb(value, this.tintRgb);
		},
		enumerable: false,
		configurable: true
	});
	/**
	* Renders the container using the WebGL renderer.
	* @param renderer - The WebGL renderer.
	*/
	ParticleContainer.prototype.render = function(renderer) {
		var _this = this;
		if (!this.visible || this.worldAlpha <= 0 || !this.children.length || !this.renderable) return;
		if (!this.baseTexture) {
			this.baseTexture = this.children[0]._texture.baseTexture;
			if (!this.baseTexture.valid) this.baseTexture.once("update", function() {
				return _this.onChildrenChange(0);
			});
		}
		renderer.batch.setObjectRenderer(renderer.plugins.particle);
		renderer.plugins.particle.render(this);
	};
	/**
	* Set the flag that static data should be updated to true
	* @param smallestChildIndex - The smallest child index.
	*/
	ParticleContainer.prototype.onChildrenChange = function(smallestChildIndex) {
		var bufferIndex = Math.floor(smallestChildIndex / this._batchSize);
		while (this._bufferUpdateIDs.length < bufferIndex) this._bufferUpdateIDs.push(0);
		this._bufferUpdateIDs[bufferIndex] = ++this._updateID;
	};
	ParticleContainer.prototype.dispose = function() {
		if (this._buffers) {
			for (var i = 0; i < this._buffers.length; ++i) this._buffers[i].destroy();
			this._buffers = null;
		}
	};
	/**
	* Destroys the container
	* @param options - Options parameter. A boolean will act as if all options
	*  have been set to that value
	* @param {boolean} [options.children=false] - if set to true, all the children will have their
	*  destroy method called as well. 'options' will be passed on to those calls.
	* @param {boolean} [options.texture=false] - Only used for child Sprites if options.children is set to true
	*  Should it destroy the texture of the child sprite
	* @param {boolean} [options.baseTexture=false] - Only used for child Sprites if options.children is set to true
	*  Should it destroy the base texture of the child sprite
	*/
	ParticleContainer.prototype.destroy = function(options) {
		_super.prototype.destroy.call(this, options);
		this.dispose();
		this._properties = null;
		this._buffers = null;
		this._bufferUpdateIDs = null;
	};
	return ParticleContainer;
}(Container);
/**
* The particle buffer manages the static and dynamic buffers for a particle container.
* @private
* @memberof PIXI
*/
var ParticleBuffer = function() {
	/**
	* @param {object} properties - The properties to upload.
	* @param {boolean[]} dynamicPropertyFlags - Flags for which properties are dynamic.
	* @param {number} size - The size of the batch.
	*/
	function ParticleBuffer(properties, dynamicPropertyFlags, size) {
		this.geometry = new Geometry();
		this.indexBuffer = null;
		this.size = size;
		this.dynamicProperties = [];
		this.staticProperties = [];
		for (var i = 0; i < properties.length; ++i) {
			var property = properties[i];
			property = {
				attributeName: property.attributeName,
				size: property.size,
				uploadFunction: property.uploadFunction,
				type: property.type || TYPES.FLOAT,
				offset: property.offset
			};
			if (dynamicPropertyFlags[i]) this.dynamicProperties.push(property);
			else this.staticProperties.push(property);
		}
		this.staticStride = 0;
		this.staticBuffer = null;
		this.staticData = null;
		this.staticDataUint32 = null;
		this.dynamicStride = 0;
		this.dynamicBuffer = null;
		this.dynamicData = null;
		this.dynamicDataUint32 = null;
		this._updateID = 0;
		this.initBuffers();
	}
	/** Sets up the renderer context and necessary buffers. */
	ParticleBuffer.prototype.initBuffers = function() {
		var geometry = this.geometry;
		var dynamicOffset = 0;
		this.indexBuffer = new Buffer(createIndicesForQuads(this.size), true, true);
		geometry.addIndex(this.indexBuffer);
		this.dynamicStride = 0;
		for (var i = 0; i < this.dynamicProperties.length; ++i) {
			var property = this.dynamicProperties[i];
			property.offset = dynamicOffset;
			dynamicOffset += property.size;
			this.dynamicStride += property.size;
		}
		var dynBuffer = /* @__PURE__ */ new ArrayBuffer(this.size * this.dynamicStride * 4 * 4);
		this.dynamicData = new Float32Array(dynBuffer);
		this.dynamicDataUint32 = new Uint32Array(dynBuffer);
		this.dynamicBuffer = new Buffer(this.dynamicData, false, false);
		var staticOffset = 0;
		this.staticStride = 0;
		for (var i = 0; i < this.staticProperties.length; ++i) {
			var property = this.staticProperties[i];
			property.offset = staticOffset;
			staticOffset += property.size;
			this.staticStride += property.size;
		}
		var statBuffer = /* @__PURE__ */ new ArrayBuffer(this.size * this.staticStride * 4 * 4);
		this.staticData = new Float32Array(statBuffer);
		this.staticDataUint32 = new Uint32Array(statBuffer);
		this.staticBuffer = new Buffer(this.staticData, true, false);
		for (var i = 0; i < this.dynamicProperties.length; ++i) {
			var property = this.dynamicProperties[i];
			geometry.addAttribute(property.attributeName, this.dynamicBuffer, 0, property.type === TYPES.UNSIGNED_BYTE, property.type, this.dynamicStride * 4, property.offset * 4);
		}
		for (var i = 0; i < this.staticProperties.length; ++i) {
			var property = this.staticProperties[i];
			geometry.addAttribute(property.attributeName, this.staticBuffer, 0, property.type === TYPES.UNSIGNED_BYTE, property.type, this.staticStride * 4, property.offset * 4);
		}
	};
	/**
	* Uploads the dynamic properties.
	* @param children - The children to upload.
	* @param startIndex - The index to start at.
	* @param amount - The number to upload.
	*/
	ParticleBuffer.prototype.uploadDynamic = function(children, startIndex, amount) {
		for (var i = 0; i < this.dynamicProperties.length; i++) {
			var property = this.dynamicProperties[i];
			property.uploadFunction(children, startIndex, amount, property.type === TYPES.UNSIGNED_BYTE ? this.dynamicDataUint32 : this.dynamicData, this.dynamicStride, property.offset);
		}
		this.dynamicBuffer._updateID++;
	};
	/**
	* Uploads the static properties.
	* @param children - The children to upload.
	* @param startIndex - The index to start at.
	* @param amount - The number to upload.
	*/
	ParticleBuffer.prototype.uploadStatic = function(children, startIndex, amount) {
		for (var i = 0; i < this.staticProperties.length; i++) {
			var property = this.staticProperties[i];
			property.uploadFunction(children, startIndex, amount, property.type === TYPES.UNSIGNED_BYTE ? this.staticDataUint32 : this.staticData, this.staticStride, property.offset);
		}
		this.staticBuffer._updateID++;
	};
	/** Destroys the ParticleBuffer. */
	ParticleBuffer.prototype.destroy = function() {
		this.indexBuffer = null;
		this.dynamicProperties = null;
		this.dynamicBuffer = null;
		this.dynamicData = null;
		this.dynamicDataUint32 = null;
		this.staticProperties = null;
		this.staticBuffer = null;
		this.staticData = null;
		this.staticDataUint32 = null;
		this.geometry.destroy();
	};
	return ParticleBuffer;
}();
var fragment$6 = "varying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n    vec4 color = texture2D(uSampler, vTextureCoord) * vColor;\n    gl_FragColor = color;\n}";
var vertex$3 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\n\nattribute vec2 aPositionCoord;\nattribute float aRotation;\n\nuniform mat3 translationMatrix;\nuniform vec4 uColor;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nvoid main(void){\n    float x = (aVertexPosition.x) * cos(aRotation) - (aVertexPosition.y) * sin(aRotation);\n    float y = (aVertexPosition.x) * sin(aRotation) + (aVertexPosition.y) * cos(aRotation);\n\n    vec2 v = vec2(x, y);\n    v = v + aPositionCoord;\n\n    gl_Position = vec4((translationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vColor = aColor * uColor;\n}\n";
/**
* Renderer for Particles that is designer for speed over feature set.
* @memberof PIXI
*/
var ParticleRenderer = function(_super) {
	__extends$15(ParticleRenderer, _super);
	/**
	* @param renderer - The renderer this sprite batch works for.
	*/
	function ParticleRenderer(renderer) {
		var _this = _super.call(this, renderer) || this;
		_this.shader = null;
		_this.properties = null;
		_this.tempMatrix = new Matrix();
		_this.properties = [
			{
				attributeName: "aVertexPosition",
				size: 2,
				uploadFunction: _this.uploadVertices,
				offset: 0
			},
			{
				attributeName: "aPositionCoord",
				size: 2,
				uploadFunction: _this.uploadPosition,
				offset: 0
			},
			{
				attributeName: "aRotation",
				size: 1,
				uploadFunction: _this.uploadRotation,
				offset: 0
			},
			{
				attributeName: "aTextureCoord",
				size: 2,
				uploadFunction: _this.uploadUvs,
				offset: 0
			},
			{
				attributeName: "aColor",
				size: 1,
				type: TYPES.UNSIGNED_BYTE,
				uploadFunction: _this.uploadTint,
				offset: 0
			}
		];
		_this.shader = Shader.from(vertex$3, fragment$6, {});
		_this.state = State.for2d();
		return _this;
	}
	/**
	* Renders the particle container object.
	* @param container - The container to render using this ParticleRenderer.
	*/
	ParticleRenderer.prototype.render = function(container) {
		var children = container.children;
		var maxSize = container._maxSize;
		var batchSize = container._batchSize;
		var renderer = this.renderer;
		var totalChildren = children.length;
		if (totalChildren === 0) return;
		else if (totalChildren > maxSize && !container.autoResize) totalChildren = maxSize;
		var buffers = container._buffers;
		if (!buffers) buffers = container._buffers = this.generateBuffers(container);
		var baseTexture = children[0]._texture.baseTexture;
		var premultiplied = baseTexture.alphaMode > 0;
		this.state.blendMode = correctBlendMode(container.blendMode, premultiplied);
		renderer.state.set(this.state);
		var gl = renderer.gl;
		var m = container.worldTransform.copyTo(this.tempMatrix);
		m.prepend(renderer.globalUniforms.uniforms.projectionMatrix);
		this.shader.uniforms.translationMatrix = m.toArray(true);
		this.shader.uniforms.uColor = premultiplyRgba(container.tintRgb, container.worldAlpha, this.shader.uniforms.uColor, premultiplied);
		this.shader.uniforms.uSampler = baseTexture;
		this.renderer.shader.bind(this.shader);
		var updateStatic = false;
		for (var i = 0, j = 0; i < totalChildren; i += batchSize, j += 1) {
			var amount = totalChildren - i;
			if (amount > batchSize) amount = batchSize;
			if (j >= buffers.length) buffers.push(this._generateOneMoreBuffer(container));
			var buffer = buffers[j];
			buffer.uploadDynamic(children, i, amount);
			var bid = container._bufferUpdateIDs[j] || 0;
			updateStatic = updateStatic || buffer._updateID < bid;
			if (updateStatic) {
				buffer._updateID = container._updateID;
				buffer.uploadStatic(children, i, amount);
			}
			renderer.geometry.bind(buffer.geometry);
			gl.drawElements(gl.TRIANGLES, amount * 6, gl.UNSIGNED_SHORT, 0);
		}
	};
	/**
	* Creates one particle buffer for each child in the container we want to render and updates internal properties.
	* @param container - The container to render using this ParticleRenderer
	* @returns - The buffers
	*/
	ParticleRenderer.prototype.generateBuffers = function(container) {
		var buffers = [];
		var size = container._maxSize;
		var batchSize = container._batchSize;
		var dynamicPropertyFlags = container._properties;
		for (var i = 0; i < size; i += batchSize) buffers.push(new ParticleBuffer(this.properties, dynamicPropertyFlags, batchSize));
		return buffers;
	};
	/**
	* Creates one more particle buffer, because container has autoResize feature.
	* @param container - The container to render using this ParticleRenderer
	* @returns - The generated buffer
	*/
	ParticleRenderer.prototype._generateOneMoreBuffer = function(container) {
		var batchSize = container._batchSize;
		var dynamicPropertyFlags = container._properties;
		return new ParticleBuffer(this.properties, dynamicPropertyFlags, batchSize);
	};
	/**
	* Uploads the vertices.
	* @param children - the array of sprites to render
	* @param startIndex - the index to start from in the children array
	* @param amount - the amount of children that will have their vertices uploaded
	* @param array - The vertices to upload.
	* @param stride - Stride to use for iteration.
	* @param offset - Offset to start at.
	*/
	ParticleRenderer.prototype.uploadVertices = function(children, startIndex, amount, array, stride, offset) {
		var w0 = 0;
		var w1 = 0;
		var h0 = 0;
		var h1 = 0;
		for (var i = 0; i < amount; ++i) {
			var sprite = children[startIndex + i];
			var texture = sprite._texture;
			var sx = sprite.scale.x;
			var sy = sprite.scale.y;
			var trim = texture.trim;
			var orig = texture.orig;
			if (trim) {
				w1 = trim.x - sprite.anchor.x * orig.width;
				w0 = w1 + trim.width;
				h1 = trim.y - sprite.anchor.y * orig.height;
				h0 = h1 + trim.height;
			} else {
				w0 = orig.width * (1 - sprite.anchor.x);
				w1 = orig.width * -sprite.anchor.x;
				h0 = orig.height * (1 - sprite.anchor.y);
				h1 = orig.height * -sprite.anchor.y;
			}
			array[offset] = w1 * sx;
			array[offset + 1] = h1 * sy;
			array[offset + stride] = w0 * sx;
			array[offset + stride + 1] = h1 * sy;
			array[offset + stride * 2] = w0 * sx;
			array[offset + stride * 2 + 1] = h0 * sy;
			array[offset + stride * 3] = w1 * sx;
			array[offset + stride * 3 + 1] = h0 * sy;
			offset += stride * 4;
		}
	};
	/**
	* Uploads the position.
	* @param children - the array of sprites to render
	* @param startIndex - the index to start from in the children array
	* @param amount - the amount of children that will have their positions uploaded
	* @param array - The vertices to upload.
	* @param stride - Stride to use for iteration.
	* @param offset - Offset to start at.
	*/
	ParticleRenderer.prototype.uploadPosition = function(children, startIndex, amount, array, stride, offset) {
		for (var i = 0; i < amount; i++) {
			var spritePosition = children[startIndex + i].position;
			array[offset] = spritePosition.x;
			array[offset + 1] = spritePosition.y;
			array[offset + stride] = spritePosition.x;
			array[offset + stride + 1] = spritePosition.y;
			array[offset + stride * 2] = spritePosition.x;
			array[offset + stride * 2 + 1] = spritePosition.y;
			array[offset + stride * 3] = spritePosition.x;
			array[offset + stride * 3 + 1] = spritePosition.y;
			offset += stride * 4;
		}
	};
	/**
	* Uploads the rotation.
	* @param children - the array of sprites to render
	* @param startIndex - the index to start from in the children array
	* @param amount - the amount of children that will have their rotation uploaded
	* @param array - The vertices to upload.
	* @param stride - Stride to use for iteration.
	* @param offset - Offset to start at.
	*/
	ParticleRenderer.prototype.uploadRotation = function(children, startIndex, amount, array, stride, offset) {
		for (var i = 0; i < amount; i++) {
			var spriteRotation = children[startIndex + i].rotation;
			array[offset] = spriteRotation;
			array[offset + stride] = spriteRotation;
			array[offset + stride * 2] = spriteRotation;
			array[offset + stride * 3] = spriteRotation;
			offset += stride * 4;
		}
	};
	/**
	* Uploads the UVs.
	* @param children - the array of sprites to render
	* @param startIndex - the index to start from in the children array
	* @param amount - the amount of children that will have their rotation uploaded
	* @param array - The vertices to upload.
	* @param stride - Stride to use for iteration.
	* @param offset - Offset to start at.
	*/
	ParticleRenderer.prototype.uploadUvs = function(children, startIndex, amount, array, stride, offset) {
		for (var i = 0; i < amount; ++i) {
			var textureUvs = children[startIndex + i]._texture._uvs;
			if (textureUvs) {
				array[offset] = textureUvs.x0;
				array[offset + 1] = textureUvs.y0;
				array[offset + stride] = textureUvs.x1;
				array[offset + stride + 1] = textureUvs.y1;
				array[offset + stride * 2] = textureUvs.x2;
				array[offset + stride * 2 + 1] = textureUvs.y2;
				array[offset + stride * 3] = textureUvs.x3;
				array[offset + stride * 3 + 1] = textureUvs.y3;
				offset += stride * 4;
			} else {
				array[offset] = 0;
				array[offset + 1] = 0;
				array[offset + stride] = 0;
				array[offset + stride + 1] = 0;
				array[offset + stride * 2] = 0;
				array[offset + stride * 2 + 1] = 0;
				array[offset + stride * 3] = 0;
				array[offset + stride * 3 + 1] = 0;
				offset += stride * 4;
			}
		}
	};
	/**
	* Uploads the tint.
	* @param children - the array of sprites to render
	* @param startIndex - the index to start from in the children array
	* @param amount - the amount of children that will have their rotation uploaded
	* @param array - The vertices to upload.
	* @param stride - Stride to use for iteration.
	* @param offset - Offset to start at.
	*/
	ParticleRenderer.prototype.uploadTint = function(children, startIndex, amount, array, stride, offset) {
		for (var i = 0; i < amount; ++i) {
			var sprite = children[startIndex + i];
			var premultiplied = sprite._texture.baseTexture.alphaMode > 0;
			var alpha = sprite.alpha;
			var argb = alpha < 1 && premultiplied ? premultiplyTint(sprite._tintRGB, alpha) : sprite._tintRGB + (alpha * 255 << 24);
			array[offset] = argb;
			array[offset + stride] = argb;
			array[offset + stride * 2] = argb;
			array[offset + stride * 3] = argb;
			offset += stride * 4;
		}
	};
	/** Destroys the ParticleRenderer. */
	ParticleRenderer.prototype.destroy = function() {
		_super.prototype.destroy.call(this);
		if (this.shader) {
			this.shader.destroy();
			this.shader = null;
		}
		this.tempMatrix = null;
	};
	/** @ignore */
	ParticleRenderer.extension = {
		name: "particle",
		type: ExtensionType.RendererPlugin
	};
	return ParticleRenderer;
}(ObjectRenderer);
//#endregion
//#region node_modules/@pixi/graphics/dist/esm/graphics.mjs
/*!
* @pixi/graphics - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/graphics is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/**
* Supported line joints in `PIXI.LineStyle` for graphics.
* @see PIXI.Graphics#lineStyle
* @see https://graphicdesign.stackexchange.com/questions/59018/what-is-a-bevel-join-of-two-lines-exactly-illustrator
* @name LINE_JOIN
* @memberof PIXI
* @static
* @enum {string}
* @property {string} MITER - 'miter': make a sharp corner where outer part of lines meet
* @property {string} BEVEL - 'bevel': add a square butt at each end of line segment and fill the triangle at turn
* @property {string} ROUND - 'round': add an arc at the joint
*/
var LINE_JOIN;
(function(LINE_JOIN) {
	LINE_JOIN["MITER"] = "miter";
	LINE_JOIN["BEVEL"] = "bevel";
	LINE_JOIN["ROUND"] = "round";
})(LINE_JOIN || (LINE_JOIN = {}));
/**
* Support line caps in `PIXI.LineStyle` for graphics.
* @see PIXI.Graphics#lineStyle
* @name LINE_CAP
* @memberof PIXI
* @static
* @enum {string}
* @property {string} BUTT - 'butt': don't add any cap at line ends (leaves orthogonal edges)
* @property {string} ROUND - 'round': add semicircle at ends
* @property {string} SQUARE - 'square': add square at end (like `BUTT` except more length at end)
*/
var LINE_CAP;
(function(LINE_CAP) {
	LINE_CAP["BUTT"] = "butt";
	LINE_CAP["ROUND"] = "round";
	LINE_CAP["SQUARE"] = "square";
})(LINE_CAP || (LINE_CAP = {}));
/**
* Graphics curves resolution settings. If `adaptive` flag is set to `true`,
* the resolution is calculated based on the curve's length to ensure better visual quality.
* Adaptive draw works with `bezierCurveTo` and `quadraticCurveTo`.
* @static
* @constant
* @memberof PIXI
* @name GRAPHICS_CURVES
* @type {object}
* @property {boolean} [adaptive=true] - flag indicating if the resolution should be adaptive
* @property {number} [maxLength=10] - maximal length of a single segment of the curve (if adaptive = false, ignored)
* @property {number} [minSegments=8] - minimal number of segments in the curve (if adaptive = false, ignored)
* @property {number} [maxSegments=2048] - maximal number of segments in the curve (if adaptive = false, ignored)
*/
var GRAPHICS_CURVES = {
	adaptive: true,
	maxLength: 10,
	minSegments: 8,
	maxSegments: 2048,
	epsilon: 1e-4,
	_segmentsCount: function(length, defaultSegments) {
		if (defaultSegments === void 0) defaultSegments = 20;
		if (!this.adaptive || !length || isNaN(length)) return defaultSegments;
		var result = Math.ceil(length / this.maxLength);
		if (result < this.minSegments) result = this.minSegments;
		else if (result > this.maxSegments) result = this.maxSegments;
		return result;
	}
};
/**
* Fill style object for Graphics.
* @memberof PIXI
*/
var FillStyle = function() {
	function FillStyle() {
		/**
		* The hex color value used when coloring the Graphics object.
		* @default 0xFFFFFF
		*/
		this.color = 16777215;
		/** The alpha value used when filling the Graphics object. */
		this.alpha = 1;
		/**
		* The texture to be used for the fill.
		* @default 0
		*/
		this.texture = Texture.WHITE;
		/**
		* The transform applied to the texture.
		* @default null
		*/
		this.matrix = null;
		/** If the current fill is visible. */
		this.visible = false;
		this.reset();
	}
	/** Clones the object */
	FillStyle.prototype.clone = function() {
		var obj = new FillStyle();
		obj.color = this.color;
		obj.alpha = this.alpha;
		obj.texture = this.texture;
		obj.matrix = this.matrix;
		obj.visible = this.visible;
		return obj;
	};
	/** Reset */
	FillStyle.prototype.reset = function() {
		this.color = 16777215;
		this.alpha = 1;
		this.texture = Texture.WHITE;
		this.matrix = null;
		this.visible = false;
	};
	/** Destroy and don't use after this. */
	FillStyle.prototype.destroy = function() {
		this.texture = null;
		this.matrix = null;
	};
	return FillStyle;
}();
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics$14 = function(d, b) {
	extendStatics$14 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
		d.__proto__ = b;
	} || function(d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	};
	return extendStatics$14(d, b);
};
function __extends$14(d, b) {
	extendStatics$14(d, b);
	function __() {
		this.constructor = d;
	}
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
function fixOrientation(points, hole) {
	var _a, _b;
	if (hole === void 0) hole = false;
	var m = points.length;
	if (m < 6) return;
	var area = 0;
	for (var i = 0, x1 = points[m - 2], y1 = points[m - 1]; i < m; i += 2) {
		var x2 = points[i];
		var y2 = points[i + 1];
		area += (x2 - x1) * (y2 + y1);
		x1 = x2;
		y1 = y2;
	}
	if (!hole && area > 0 || hole && area <= 0) {
		var n = m / 2;
		for (var i = n + n % 2; i < m; i += 2) {
			var i1 = m - i - 2;
			var i2 = m - i - 1;
			var i3 = i;
			var i4 = i + 1;
			_a = [points[i3], points[i1]], points[i1] = _a[0], points[i3] = _a[1];
			_b = [points[i4], points[i2]], points[i2] = _b[0], points[i4] = _b[1];
		}
	}
}
/**
* Builds a polygon to draw
*
* Ignored from docs since it is not directly exposed.
* @ignore
* @private
* @param {PIXI.WebGLGraphicsData} graphicsData - The graphics object containing all the necessary properties
* @param {object} webGLData - an object containing all the WebGL-specific information to create this shape
* @param {object} webGLDataNativeLines - an object containing all the WebGL-specific information to create nativeLines
*/
var buildPoly = {
	build: function(graphicsData) {
		graphicsData.points = graphicsData.shape.points.slice();
	},
	triangulate: function(graphicsData, graphicsGeometry) {
		var points = graphicsData.points;
		var holes = graphicsData.holes;
		var verts = graphicsGeometry.points;
		var indices = graphicsGeometry.indices;
		if (points.length >= 6) {
			fixOrientation(points, false);
			var holeArray = [];
			for (var i = 0; i < holes.length; i++) {
				var hole = holes[i];
				fixOrientation(hole.points, true);
				holeArray.push(points.length / 2);
				points = points.concat(hole.points);
			}
			var triangles = (0, import_earcut.default)(points, holeArray, 2);
			if (!triangles) return;
			var vertPos = verts.length / 2;
			for (var i = 0; i < triangles.length; i += 3) {
				indices.push(triangles[i] + vertPos);
				indices.push(triangles[i + 1] + vertPos);
				indices.push(triangles[i + 2] + vertPos);
			}
			for (var i = 0; i < points.length; i++) verts.push(points[i]);
		}
	}
};
/**
* Builds a circle to draw
*
* Ignored from docs since it is not directly exposed.
* @ignore
* @private
* @param {PIXI.WebGLGraphicsData} graphicsData - The graphics object to draw
* @param {object} webGLData - an object containing all the WebGL-specific information to create this shape
* @param {object} webGLDataNativeLines - an object containing all the WebGL-specific information to create nativeLines
*/
var buildCircle = {
	build: function(graphicsData) {
		var points = graphicsData.points;
		var x;
		var y;
		var dx;
		var dy;
		var rx;
		var ry;
		if (graphicsData.type === SHAPES.CIRC) {
			var circle = graphicsData.shape;
			x = circle.x;
			y = circle.y;
			rx = ry = circle.radius;
			dx = dy = 0;
		} else if (graphicsData.type === SHAPES.ELIP) {
			var ellipse = graphicsData.shape;
			x = ellipse.x;
			y = ellipse.y;
			rx = ellipse.width;
			ry = ellipse.height;
			dx = dy = 0;
		} else {
			var roundedRect = graphicsData.shape;
			var halfWidth = roundedRect.width / 2;
			var halfHeight = roundedRect.height / 2;
			x = roundedRect.x + halfWidth;
			y = roundedRect.y + halfHeight;
			rx = ry = Math.max(0, Math.min(roundedRect.radius, Math.min(halfWidth, halfHeight)));
			dx = halfWidth - rx;
			dy = halfHeight - ry;
		}
		if (!(rx >= 0 && ry >= 0 && dx >= 0 && dy >= 0)) {
			points.length = 0;
			return;
		}
		var n = Math.ceil(2.3 * Math.sqrt(rx + ry));
		var m = n * 8 + (dx ? 4 : 0) + (dy ? 4 : 0);
		points.length = m;
		if (m === 0) return;
		if (n === 0) {
			points.length = 8;
			points[0] = points[6] = x + dx;
			points[1] = points[3] = y + dy;
			points[2] = points[4] = x - dx;
			points[5] = points[7] = y - dy;
			return;
		}
		var j1 = 0;
		var j2 = n * 4 + (dx ? 2 : 0) + 2;
		var j3 = j2;
		var j4 = m;
		var x0 = dx + rx;
		var y0 = dy;
		var x1 = x + x0;
		var x2 = x - x0;
		var y1 = y + y0;
		points[j1++] = x1;
		points[j1++] = y1;
		points[--j2] = y1;
		points[--j2] = x2;
		if (dy) {
			var y2 = y - y0;
			points[j3++] = x2;
			points[j3++] = y2;
			points[--j4] = y2;
			points[--j4] = x1;
		}
		for (var i = 1; i < n; i++) {
			var a = Math.PI / 2 * (i / n);
			var x0 = dx + Math.cos(a) * rx;
			var y0 = dy + Math.sin(a) * ry;
			var x1 = x + x0;
			var x2 = x - x0;
			var y1 = y + y0;
			var y2 = y - y0;
			points[j1++] = x1;
			points[j1++] = y1;
			points[--j2] = y1;
			points[--j2] = x2;
			points[j3++] = x2;
			points[j3++] = y2;
			points[--j4] = y2;
			points[--j4] = x1;
		}
		var x0 = dx;
		var y0 = dy + ry;
		var x1 = x + x0;
		var x2 = x - x0;
		var y1 = y + y0;
		var y2 = y - y0;
		points[j1++] = x1;
		points[j1++] = y1;
		points[--j4] = y2;
		points[--j4] = x1;
		if (dx) {
			points[j1++] = x2;
			points[j1++] = y1;
			points[--j4] = y2;
			points[--j4] = x2;
		}
	},
	triangulate: function(graphicsData, graphicsGeometry) {
		var points = graphicsData.points;
		var verts = graphicsGeometry.points;
		var indices = graphicsGeometry.indices;
		if (points.length === 0) return;
		var vertPos = verts.length / 2;
		var center = vertPos;
		var x;
		var y;
		if (graphicsData.type !== SHAPES.RREC) {
			var circle = graphicsData.shape;
			x = circle.x;
			y = circle.y;
		} else {
			var roundedRect = graphicsData.shape;
			x = roundedRect.x + roundedRect.width / 2;
			y = roundedRect.y + roundedRect.height / 2;
		}
		var matrix = graphicsData.matrix;
		verts.push(graphicsData.matrix ? matrix.a * x + matrix.c * y + matrix.tx : x, graphicsData.matrix ? matrix.b * x + matrix.d * y + matrix.ty : y);
		vertPos++;
		verts.push(points[0], points[1]);
		for (var i = 2; i < points.length; i += 2) {
			verts.push(points[i], points[i + 1]);
			indices.push(vertPos++, center, vertPos);
		}
		indices.push(center + 1, center, vertPos);
	}
};
/**
* Builds a rectangle to draw
*
* Ignored from docs since it is not directly exposed.
* @ignore
* @private
* @param {PIXI.WebGLGraphicsData} graphicsData - The graphics object containing all the necessary properties
* @param {object} webGLData - an object containing all the WebGL-specific information to create this shape
* @param {object} webGLDataNativeLines - an object containing all the WebGL-specific information to create nativeLines
*/
var buildRectangle = {
	build: function(graphicsData) {
		var rectData = graphicsData.shape;
		var x = rectData.x;
		var y = rectData.y;
		var width = rectData.width;
		var height = rectData.height;
		var points = graphicsData.points;
		points.length = 0;
		points.push(x, y, x + width, y, x + width, y + height, x, y + height);
	},
	triangulate: function(graphicsData, graphicsGeometry) {
		var points = graphicsData.points;
		var verts = graphicsGeometry.points;
		var vertPos = verts.length / 2;
		verts.push(points[0], points[1], points[2], points[3], points[6], points[7], points[4], points[5]);
		graphicsGeometry.indices.push(vertPos, vertPos + 1, vertPos + 2, vertPos + 1, vertPos + 2, vertPos + 3);
	}
};
/**
* Calculate a single point for a quadratic bezier curve.
* Utility function used by quadraticBezierCurve.
* Ignored from docs since it is not directly exposed.
* @ignore
* @private
* @param {number} n1 - first number
* @param {number} n2 - second number
* @param {number} perc - percentage
* @returns {number} the result
*/
function getPt(n1, n2, perc) {
	return n1 + (n2 - n1) * perc;
}
/**
* Calculate the points for a quadratic bezier curve. (helper function..)
* Based on: https://stackoverflow.com/questions/785097/how-do-i-implement-a-bezier-curve-in-c
*
* Ignored from docs since it is not directly exposed.
* @ignore
* @private
* @param {number} fromX - Origin point x
* @param {number} fromY - Origin point x
* @param {number} cpX - Control point x
* @param {number} cpY - Control point y
* @param {number} toX - Destination point x
* @param {number} toY - Destination point y
* @param {number[]} [out=[]] - The output array to add points into. If not passed, a new array is created.
* @returns {number[]} an array of points
*/
function quadraticBezierCurve(fromX, fromY, cpX, cpY, toX, toY, out) {
	if (out === void 0) out = [];
	var n = 20;
	var points = out;
	var xa = 0;
	var ya = 0;
	var xb = 0;
	var yb = 0;
	var x = 0;
	var y = 0;
	for (var i = 0, j = 0; i <= n; ++i) {
		j = i / n;
		xa = getPt(fromX, cpX, j);
		ya = getPt(fromY, cpY, j);
		xb = getPt(cpX, toX, j);
		yb = getPt(cpY, toY, j);
		x = getPt(xa, xb, j);
		y = getPt(ya, yb, j);
		if (i === 0 && points[points.length - 2] === x && points[points.length - 1] === y) continue;
		points.push(x, y);
	}
	return points;
}
/**
* Builds a rounded rectangle to draw
*
* Ignored from docs since it is not directly exposed.
* @ignore
* @private
* @param {PIXI.WebGLGraphicsData} graphicsData - The graphics object containing all the necessary properties
* @param {object} webGLData - an object containing all the WebGL-specific information to create this shape
* @param {object} webGLDataNativeLines - an object containing all the WebGL-specific information to create nativeLines
*/
var buildRoundedRectangle = {
	build: function(graphicsData) {
		if (Graphics.nextRoundedRectBehavior) {
			buildCircle.build(graphicsData);
			return;
		}
		var rrectData = graphicsData.shape;
		var points = graphicsData.points;
		var x = rrectData.x;
		var y = rrectData.y;
		var width = rrectData.width;
		var height = rrectData.height;
		var radius = Math.max(0, Math.min(rrectData.radius, Math.min(width, height) / 2));
		points.length = 0;
		if (!radius) points.push(x, y, x + width, y, x + width, y + height, x, y + height);
		else {
			quadraticBezierCurve(x, y + radius, x, y, x + radius, y, points);
			quadraticBezierCurve(x + width - radius, y, x + width, y, x + width, y + radius, points);
			quadraticBezierCurve(x + width, y + height - radius, x + width, y + height, x + width - radius, y + height, points);
			quadraticBezierCurve(x + radius, y + height, x, y + height, x, y + height - radius, points);
		}
	},
	triangulate: function(graphicsData, graphicsGeometry) {
		if (Graphics.nextRoundedRectBehavior) {
			buildCircle.triangulate(graphicsData, graphicsGeometry);
			return;
		}
		var points = graphicsData.points;
		var verts = graphicsGeometry.points;
		var indices = graphicsGeometry.indices;
		var vecPos = verts.length / 2;
		var triangles = (0, import_earcut.default)(points, null, 2);
		for (var i = 0, j = triangles.length; i < j; i += 3) {
			indices.push(triangles[i] + vecPos);
			indices.push(triangles[i + 1] + vecPos);
			indices.push(triangles[i + 2] + vecPos);
		}
		for (var i = 0, j = points.length; i < j; i++) verts.push(points[i], points[++i]);
	}
};
/**
* Buffers vertices to draw a square cap.
*
* Ignored from docs since it is not directly exposed.
* @ignore
* @private
* @param {number} x - X-coord of end point
* @param {number} y - Y-coord of end point
* @param {number} nx - X-coord of line normal pointing inside
* @param {number} ny - Y-coord of line normal pointing inside
* @param {number} innerWeight - Weight of inner points
* @param {number} outerWeight - Weight of outer points
* @param {boolean} clockwise - Whether the cap is drawn clockwise
* @param {Array<number>} verts - vertex buffer
* @returns {number} - no. of vertices pushed
*/
function square(x, y, nx, ny, innerWeight, outerWeight, clockwise, verts) {
	var ix = x - nx * innerWeight;
	var iy = y - ny * innerWeight;
	var ox = x + nx * outerWeight;
	var oy = y + ny * outerWeight;
	var exx;
	var eyy;
	if (clockwise) {
		exx = ny;
		eyy = -nx;
	} else {
		exx = -ny;
		eyy = nx;
	}
	var eix = ix + exx;
	var eiy = iy + eyy;
	var eox = ox + exx;
	var eoy = oy + eyy;
	verts.push(eix, eiy);
	verts.push(eox, eoy);
	return 2;
}
/**
* Buffers vertices to draw an arc at the line joint or cap.
*
* Ignored from docs since it is not directly exposed.
* @ignore
* @private
* @param {number} cx - X-coord of center
* @param {number} cy - Y-coord of center
* @param {number} sx - X-coord of arc start
* @param {number} sy - Y-coord of arc start
* @param {number} ex - X-coord of arc end
* @param {number} ey - Y-coord of arc end
* @param {Array<number>} verts - buffer of vertices
* @param {boolean} clockwise - orientation of vertices
* @returns {number} - no. of vertices pushed
*/
function round(cx, cy, sx, sy, ex, ey, verts, clockwise) {
	var cx2p0x = sx - cx;
	var cy2p0y = sy - cy;
	var angle0 = Math.atan2(cx2p0x, cy2p0y);
	var angle1 = Math.atan2(ex - cx, ey - cy);
	if (clockwise && angle0 < angle1) angle0 += Math.PI * 2;
	else if (!clockwise && angle0 > angle1) angle1 += Math.PI * 2;
	var startAngle = angle0;
	var angleDiff = angle1 - angle0;
	var absAngleDiff = Math.abs(angleDiff);
	var radius = Math.sqrt(cx2p0x * cx2p0x + cy2p0y * cy2p0y);
	var segCount = (15 * absAngleDiff * Math.sqrt(radius) / Math.PI >> 0) + 1;
	var angleInc = angleDiff / segCount;
	startAngle += angleInc;
	if (clockwise) {
		verts.push(cx, cy);
		verts.push(sx, sy);
		for (var i = 1, angle = startAngle; i < segCount; i++, angle += angleInc) {
			verts.push(cx, cy);
			verts.push(cx + Math.sin(angle) * radius, cy + Math.cos(angle) * radius);
		}
		verts.push(cx, cy);
		verts.push(ex, ey);
	} else {
		verts.push(sx, sy);
		verts.push(cx, cy);
		for (var i = 1, angle = startAngle; i < segCount; i++, angle += angleInc) {
			verts.push(cx + Math.sin(angle) * radius, cy + Math.cos(angle) * radius);
			verts.push(cx, cy);
		}
		verts.push(ex, ey);
		verts.push(cx, cy);
	}
	return segCount * 2;
}
/**
* Builds a line to draw using the polygon method.
*
* Ignored from docs since it is not directly exposed.
* @ignore
* @private
* @param {PIXI.GraphicsData} graphicsData - The graphics object containing all the necessary properties
* @param {PIXI.GraphicsGeometry} graphicsGeometry - Geometry where to append output
*/
function buildNonNativeLine(graphicsData, graphicsGeometry) {
	var shape = graphicsData.shape;
	var points = graphicsData.points || shape.points.slice();
	var eps = graphicsGeometry.closePointEps;
	if (points.length === 0) return;
	var style = graphicsData.lineStyle;
	var firstPoint = new Point(points[0], points[1]);
	var lastPoint = new Point(points[points.length - 2], points[points.length - 1]);
	var closedShape = shape.type !== SHAPES.POLY || shape.closeStroke;
	var closedPath = Math.abs(firstPoint.x - lastPoint.x) < eps && Math.abs(firstPoint.y - lastPoint.y) < eps;
	if (closedShape) {
		points = points.slice();
		if (closedPath) {
			points.pop();
			points.pop();
			lastPoint.set(points[points.length - 2], points[points.length - 1]);
		}
		var midPointX = (firstPoint.x + lastPoint.x) * .5;
		var midPointY = (lastPoint.y + firstPoint.y) * .5;
		points.unshift(midPointX, midPointY);
		points.push(midPointX, midPointY);
	}
	var verts = graphicsGeometry.points;
	var length = points.length / 2;
	var indexCount = points.length;
	var indexStart = verts.length / 2;
	var width = style.width / 2;
	var widthSquared = width * width;
	var miterLimitSquared = style.miterLimit * style.miterLimit;
	var x0 = points[0];
	var y0 = points[1];
	var x1 = points[2];
	var y1 = points[3];
	var x2 = 0;
	var y2 = 0;
	var perpx = -(y0 - y1);
	var perpy = x0 - x1;
	var perp1x = 0;
	var perp1y = 0;
	var dist = Math.sqrt(perpx * perpx + perpy * perpy);
	perpx /= dist;
	perpy /= dist;
	perpx *= width;
	perpy *= width;
	var ratio = style.alignment;
	var innerWeight = (1 - ratio) * 2;
	var outerWeight = ratio * 2;
	if (!closedShape) {
		if (style.cap === LINE_CAP.ROUND) indexCount += round(x0 - perpx * (innerWeight - outerWeight) * .5, y0 - perpy * (innerWeight - outerWeight) * .5, x0 - perpx * innerWeight, y0 - perpy * innerWeight, x0 + perpx * outerWeight, y0 + perpy * outerWeight, verts, true) + 2;
		else if (style.cap === LINE_CAP.SQUARE) indexCount += square(x0, y0, perpx, perpy, innerWeight, outerWeight, true, verts);
	}
	verts.push(x0 - perpx * innerWeight, y0 - perpy * innerWeight);
	verts.push(x0 + perpx * outerWeight, y0 + perpy * outerWeight);
	for (var i = 1; i < length - 1; ++i) {
		x0 = points[(i - 1) * 2];
		y0 = points[(i - 1) * 2 + 1];
		x1 = points[i * 2];
		y1 = points[i * 2 + 1];
		x2 = points[(i + 1) * 2];
		y2 = points[(i + 1) * 2 + 1];
		perpx = -(y0 - y1);
		perpy = x0 - x1;
		dist = Math.sqrt(perpx * perpx + perpy * perpy);
		perpx /= dist;
		perpy /= dist;
		perpx *= width;
		perpy *= width;
		perp1x = -(y1 - y2);
		perp1y = x1 - x2;
		dist = Math.sqrt(perp1x * perp1x + perp1y * perp1y);
		perp1x /= dist;
		perp1y /= dist;
		perp1x *= width;
		perp1y *= width;
		var dx0 = x1 - x0;
		var dy0 = y0 - y1;
		var dx1 = x1 - x2;
		var dy1 = y2 - y1;
		var dot = dx0 * dx1 + dy0 * dy1;
		var cross = dy0 * dx1 - dy1 * dx0;
		var clockwise = cross < 0;
		if (Math.abs(cross) < .001 * Math.abs(dot)) {
			verts.push(x1 - perpx * innerWeight, y1 - perpy * innerWeight);
			verts.push(x1 + perpx * outerWeight, y1 + perpy * outerWeight);
			if (dot >= 0) {
				if (style.join === LINE_JOIN.ROUND) indexCount += round(x1, y1, x1 - perpx * innerWeight, y1 - perpy * innerWeight, x1 - perp1x * innerWeight, y1 - perp1y * innerWeight, verts, false) + 4;
				else indexCount += 2;
				verts.push(x1 - perp1x * outerWeight, y1 - perp1y * outerWeight);
				verts.push(x1 + perp1x * innerWeight, y1 + perp1y * innerWeight);
			}
			continue;
		}
		var c1 = (-perpx + x0) * (-perpy + y1) - (-perpx + x1) * (-perpy + y0);
		var c2 = (-perp1x + x2) * (-perp1y + y1) - (-perp1x + x1) * (-perp1y + y2);
		var px = (dx0 * c2 - dx1 * c1) / cross;
		var py = (dy1 * c1 - dy0 * c2) / cross;
		var pdist = (px - x1) * (px - x1) + (py - y1) * (py - y1);
		var imx = x1 + (px - x1) * innerWeight;
		var imy = y1 + (py - y1) * innerWeight;
		var omx = x1 - (px - x1) * outerWeight;
		var omy = y1 - (py - y1) * outerWeight;
		var smallerInsideSegmentSq = Math.min(dx0 * dx0 + dy0 * dy0, dx1 * dx1 + dy1 * dy1);
		var insideWeight = clockwise ? innerWeight : outerWeight;
		if (pdist <= smallerInsideSegmentSq + insideWeight * insideWeight * widthSquared) {
			if (style.join === LINE_JOIN.BEVEL || pdist / widthSquared > miterLimitSquared) {
				if (clockwise) {
					verts.push(imx, imy);
					verts.push(x1 + perpx * outerWeight, y1 + perpy * outerWeight);
					verts.push(imx, imy);
					verts.push(x1 + perp1x * outerWeight, y1 + perp1y * outerWeight);
				} else {
					verts.push(x1 - perpx * innerWeight, y1 - perpy * innerWeight);
					verts.push(omx, omy);
					verts.push(x1 - perp1x * innerWeight, y1 - perp1y * innerWeight);
					verts.push(omx, omy);
				}
				indexCount += 2;
			} else if (style.join === LINE_JOIN.ROUND) {
				if (clockwise) {
					verts.push(imx, imy);
					verts.push(x1 + perpx * outerWeight, y1 + perpy * outerWeight);
					indexCount += round(x1, y1, x1 + perpx * outerWeight, y1 + perpy * outerWeight, x1 + perp1x * outerWeight, y1 + perp1y * outerWeight, verts, true) + 4;
					verts.push(imx, imy);
					verts.push(x1 + perp1x * outerWeight, y1 + perp1y * outerWeight);
				} else {
					verts.push(x1 - perpx * innerWeight, y1 - perpy * innerWeight);
					verts.push(omx, omy);
					indexCount += round(x1, y1, x1 - perpx * innerWeight, y1 - perpy * innerWeight, x1 - perp1x * innerWeight, y1 - perp1y * innerWeight, verts, false) + 4;
					verts.push(x1 - perp1x * innerWeight, y1 - perp1y * innerWeight);
					verts.push(omx, omy);
				}
			} else {
				verts.push(imx, imy);
				verts.push(omx, omy);
			}
		} else {
			verts.push(x1 - perpx * innerWeight, y1 - perpy * innerWeight);
			verts.push(x1 + perpx * outerWeight, y1 + perpy * outerWeight);
			if (style.join === LINE_JOIN.ROUND) {
				if (clockwise) indexCount += round(x1, y1, x1 + perpx * outerWeight, y1 + perpy * outerWeight, x1 + perp1x * outerWeight, y1 + perp1y * outerWeight, verts, true) + 2;
				else indexCount += round(x1, y1, x1 - perpx * innerWeight, y1 - perpy * innerWeight, x1 - perp1x * innerWeight, y1 - perp1y * innerWeight, verts, false) + 2;
			} else if (style.join === LINE_JOIN.MITER && pdist / widthSquared <= miterLimitSquared) {
				if (clockwise) {
					verts.push(omx, omy);
					verts.push(omx, omy);
				} else {
					verts.push(imx, imy);
					verts.push(imx, imy);
				}
				indexCount += 2;
			}
			verts.push(x1 - perp1x * innerWeight, y1 - perp1y * innerWeight);
			verts.push(x1 + perp1x * outerWeight, y1 + perp1y * outerWeight);
			indexCount += 2;
		}
	}
	x0 = points[(length - 2) * 2];
	y0 = points[(length - 2) * 2 + 1];
	x1 = points[(length - 1) * 2];
	y1 = points[(length - 1) * 2 + 1];
	perpx = -(y0 - y1);
	perpy = x0 - x1;
	dist = Math.sqrt(perpx * perpx + perpy * perpy);
	perpx /= dist;
	perpy /= dist;
	perpx *= width;
	perpy *= width;
	verts.push(x1 - perpx * innerWeight, y1 - perpy * innerWeight);
	verts.push(x1 + perpx * outerWeight, y1 + perpy * outerWeight);
	if (!closedShape) {
		if (style.cap === LINE_CAP.ROUND) indexCount += round(x1 - perpx * (innerWeight - outerWeight) * .5, y1 - perpy * (innerWeight - outerWeight) * .5, x1 - perpx * innerWeight, y1 - perpy * innerWeight, x1 + perpx * outerWeight, y1 + perpy * outerWeight, verts, false) + 2;
		else if (style.cap === LINE_CAP.SQUARE) indexCount += square(x1, y1, perpx, perpy, innerWeight, outerWeight, false, verts);
	}
	var indices = graphicsGeometry.indices;
	var eps2 = GRAPHICS_CURVES.epsilon * GRAPHICS_CURVES.epsilon;
	for (var i = indexStart; i < indexCount + indexStart - 2; ++i) {
		x0 = verts[i * 2];
		y0 = verts[i * 2 + 1];
		x1 = verts[(i + 1) * 2];
		y1 = verts[(i + 1) * 2 + 1];
		x2 = verts[(i + 2) * 2];
		y2 = verts[(i + 2) * 2 + 1];
		if (Math.abs(x0 * (y1 - y2) + x1 * (y2 - y0) + x2 * (y0 - y1)) < eps2) continue;
		indices.push(i, i + 1, i + 2);
	}
}
/**
* Builds a line to draw using the gl.drawArrays(gl.LINES) method
*
* Ignored from docs since it is not directly exposed.
* @ignore
* @private
* @param {PIXI.GraphicsData} graphicsData - The graphics object containing all the necessary properties
* @param {PIXI.GraphicsGeometry} graphicsGeometry - Geometry where to append output
*/
function buildNativeLine(graphicsData, graphicsGeometry) {
	var i = 0;
	var shape = graphicsData.shape;
	var points = graphicsData.points || shape.points;
	var closedShape = shape.type !== SHAPES.POLY || shape.closeStroke;
	if (points.length === 0) return;
	var verts = graphicsGeometry.points;
	var indices = graphicsGeometry.indices;
	var length = points.length / 2;
	var startIndex = verts.length / 2;
	var currentIndex = startIndex;
	verts.push(points[0], points[1]);
	for (i = 1; i < length; i++) {
		verts.push(points[i * 2], points[i * 2 + 1]);
		indices.push(currentIndex, currentIndex + 1);
		currentIndex++;
	}
	if (closedShape) indices.push(currentIndex, startIndex);
}
/**
* Builds a line to draw
*
* Ignored from docs since it is not directly exposed.
* @ignore
* @private
* @param {PIXI.GraphicsData} graphicsData - The graphics object containing all the necessary properties
* @param {PIXI.GraphicsGeometry} graphicsGeometry - Geometry where to append output
*/
function buildLine(graphicsData, graphicsGeometry) {
	if (graphicsData.lineStyle.native) buildNativeLine(graphicsData, graphicsGeometry);
	else buildNonNativeLine(graphicsData, graphicsGeometry);
}
/**
* Utilities for arc curves.
* @private
*/
var ArcUtils = function() {
	function ArcUtils() {}
	/**
	* The arcTo() method creates an arc/curve between two tangents on the canvas.
	*
	* "borrowed" from https://code.google.com/p/fxcanvas/ - thanks google!
	* @private
	* @param x1 - The x-coordinate of the beginning of the arc
	* @param y1 - The y-coordinate of the beginning of the arc
	* @param x2 - The x-coordinate of the end of the arc
	* @param y2 - The y-coordinate of the end of the arc
	* @param radius - The radius of the arc
	* @param points -
	* @returns - If the arc length is valid, return center of circle, radius and other info otherwise `null`.
	*/
	ArcUtils.curveTo = function(x1, y1, x2, y2, radius, points) {
		var fromX = points[points.length - 2];
		var a1 = points[points.length - 1] - y1;
		var b1 = fromX - x1;
		var a2 = y2 - y1;
		var b2 = x2 - x1;
		var mm = Math.abs(a1 * b2 - b1 * a2);
		if (mm < 1e-8 || radius === 0) {
			if (points[points.length - 2] !== x1 || points[points.length - 1] !== y1) points.push(x1, y1);
			return null;
		}
		var dd = a1 * a1 + b1 * b1;
		var cc = a2 * a2 + b2 * b2;
		var tt = a1 * a2 + b1 * b2;
		var k1 = radius * Math.sqrt(dd) / mm;
		var k2 = radius * Math.sqrt(cc) / mm;
		var j1 = k1 * tt / dd;
		var j2 = k2 * tt / cc;
		var cx = k1 * b2 + k2 * b1;
		var cy = k1 * a2 + k2 * a1;
		var px = b1 * (k2 + j1);
		var py = a1 * (k2 + j1);
		var qx = b2 * (k1 + j2);
		var qy = a2 * (k1 + j2);
		var startAngle = Math.atan2(py - cy, px - cx);
		var endAngle = Math.atan2(qy - cy, qx - cx);
		return {
			cx: cx + x1,
			cy: cy + y1,
			radius,
			startAngle,
			endAngle,
			anticlockwise: b1 * a2 > b2 * a1
		};
	};
	/**
	* The arc method creates an arc/curve (used to create circles, or parts of circles).
	* @private
	* @param _startX - Start x location of arc
	* @param _startY - Start y location of arc
	* @param cx - The x-coordinate of the center of the circle
	* @param cy - The y-coordinate of the center of the circle
	* @param radius - The radius of the circle
	* @param startAngle - The starting angle, in radians (0 is at the 3 o'clock position
	*  of the arc's circle)
	* @param endAngle - The ending angle, in radians
	* @param _anticlockwise - Specifies whether the drawing should be
	*  counter-clockwise or clockwise. False is default, and indicates clockwise, while true
	*  indicates counter-clockwise.
	* @param points - Collection of points to add to
	*/
	ArcUtils.arc = function(_startX, _startY, cx, cy, radius, startAngle, endAngle, _anticlockwise, points) {
		var sweep = endAngle - startAngle;
		var n = GRAPHICS_CURVES._segmentsCount(Math.abs(sweep) * radius, Math.ceil(Math.abs(sweep) / PI_2) * 40);
		var theta = sweep / (n * 2);
		var theta2 = theta * 2;
		var cTheta = Math.cos(theta);
		var sTheta = Math.sin(theta);
		var segMinus = n - 1;
		var remainder = segMinus % 1 / segMinus;
		for (var i = 0; i <= segMinus; ++i) {
			var real = i + remainder * i;
			var angle = theta + startAngle + theta2 * real;
			var c = Math.cos(angle);
			var s = -Math.sin(angle);
			points.push((cTheta * c + sTheta * s) * radius + cx, (cTheta * -s + sTheta * c) * radius + cy);
		}
	};
	return ArcUtils;
}();
/**
* Utilities for bezier curves
* @private
*/
var BezierUtils = function() {
	function BezierUtils() {}
	/**
	* Calculate length of bezier curve.
	* Analytical solution is impossible, since it involves an integral that does not integrate in general.
	* Therefore numerical solution is used.
	* @private
	* @param fromX - Starting point x
	* @param fromY - Starting point y
	* @param cpX - Control point x
	* @param cpY - Control point y
	* @param cpX2 - Second Control point x
	* @param cpY2 - Second Control point y
	* @param toX - Destination point x
	* @param toY - Destination point y
	* @returns - Length of bezier curve
	*/
	BezierUtils.curveLength = function(fromX, fromY, cpX, cpY, cpX2, cpY2, toX, toY) {
		var n = 10;
		var result = 0;
		var t = 0;
		var t2 = 0;
		var t3 = 0;
		var nt = 0;
		var nt2 = 0;
		var nt3 = 0;
		var x = 0;
		var y = 0;
		var dx = 0;
		var dy = 0;
		var prevX = fromX;
		var prevY = fromY;
		for (var i = 1; i <= n; ++i) {
			t = i / n;
			t2 = t * t;
			t3 = t2 * t;
			nt = 1 - t;
			nt2 = nt * nt;
			nt3 = nt2 * nt;
			x = nt3 * fromX + 3 * nt2 * t * cpX + 3 * nt * t2 * cpX2 + t3 * toX;
			y = nt3 * fromY + 3 * nt2 * t * cpY + 3 * nt * t2 * cpY2 + t3 * toY;
			dx = prevX - x;
			dy = prevY - y;
			prevX = x;
			prevY = y;
			result += Math.sqrt(dx * dx + dy * dy);
		}
		return result;
	};
	/**
	* Calculate the points for a bezier curve and then draws it.
	*
	* Ignored from docs since it is not directly exposed.
	* @ignore
	* @param cpX - Control point x
	* @param cpY - Control point y
	* @param cpX2 - Second Control point x
	* @param cpY2 - Second Control point y
	* @param toX - Destination point x
	* @param toY - Destination point y
	* @param points - Path array to push points into
	*/
	BezierUtils.curveTo = function(cpX, cpY, cpX2, cpY2, toX, toY, points) {
		var fromX = points[points.length - 2];
		var fromY = points[points.length - 1];
		points.length -= 2;
		var n = GRAPHICS_CURVES._segmentsCount(BezierUtils.curveLength(fromX, fromY, cpX, cpY, cpX2, cpY2, toX, toY));
		var dt = 0;
		var dt2 = 0;
		var dt3 = 0;
		var t2 = 0;
		var t3 = 0;
		points.push(fromX, fromY);
		for (var i = 1, j = 0; i <= n; ++i) {
			j = i / n;
			dt = 1 - j;
			dt2 = dt * dt;
			dt3 = dt2 * dt;
			t2 = j * j;
			t3 = t2 * j;
			points.push(dt3 * fromX + 3 * dt2 * j * cpX + 3 * dt * t2 * cpX2 + t3 * toX, dt3 * fromY + 3 * dt2 * j * cpY + 3 * dt * t2 * cpY2 + t3 * toY);
		}
	};
	return BezierUtils;
}();
/**
* Utilities for quadratic curves.
* @private
*/
var QuadraticUtils = function() {
	function QuadraticUtils() {}
	/**
	* Calculate length of quadratic curve
	* @see {@link http://www.malczak.linuxpl.com/blog/quadratic-bezier-curve-length/}
	* for the detailed explanation of math behind this.
	* @private
	* @param fromX - x-coordinate of curve start point
	* @param fromY - y-coordinate of curve start point
	* @param cpX - x-coordinate of curve control point
	* @param cpY - y-coordinate of curve control point
	* @param toX - x-coordinate of curve end point
	* @param toY - y-coordinate of curve end point
	* @returns - Length of quadratic curve
	*/
	QuadraticUtils.curveLength = function(fromX, fromY, cpX, cpY, toX, toY) {
		var ax = fromX - 2 * cpX + toX;
		var ay = fromY - 2 * cpY + toY;
		var bx = 2 * cpX - 2 * fromX;
		var by = 2 * cpY - 2 * fromY;
		var a = 4 * (ax * ax + ay * ay);
		var b = 4 * (ax * bx + ay * by);
		var c = bx * bx + by * by;
		var s = 2 * Math.sqrt(a + b + c);
		var a2 = Math.sqrt(a);
		var a32 = 2 * a * a2;
		var c2 = 2 * Math.sqrt(c);
		var ba = b / a2;
		return (a32 * s + a2 * b * (s - c2) + (4 * c * a - b * b) * Math.log((2 * a2 + ba + s) / (ba + c2))) / (4 * a32);
	};
	/**
	* Calculate the points for a quadratic bezier curve and then draws it.
	* Based on: https://stackoverflow.com/questions/785097/how-do-i-implement-a-bezier-curve-in-c
	* @private
	* @param cpX - Control point x
	* @param cpY - Control point y
	* @param toX - Destination point x
	* @param toY - Destination point y
	* @param points - Points to add segments to.
	*/
	QuadraticUtils.curveTo = function(cpX, cpY, toX, toY, points) {
		var fromX = points[points.length - 2];
		var fromY = points[points.length - 1];
		var n = GRAPHICS_CURVES._segmentsCount(QuadraticUtils.curveLength(fromX, fromY, cpX, cpY, toX, toY));
		var xa = 0;
		var ya = 0;
		for (var i = 1; i <= n; ++i) {
			var j = i / n;
			xa = fromX + (cpX - fromX) * j;
			ya = fromY + (cpY - fromY) * j;
			points.push(xa + (cpX + (toX - cpX) * j - xa) * j, ya + (cpY + (toY - cpY) * j - ya) * j);
		}
	};
	return QuadraticUtils;
}();
/**
* A structure to hold interim batch objects for Graphics.
* @memberof PIXI.graphicsUtils
*/
var BatchPart = function() {
	function BatchPart() {
		this.reset();
	}
	/**
	* Begin batch part.
	* @param style
	* @param startIndex
	* @param attribStart
	*/
	BatchPart.prototype.begin = function(style, startIndex, attribStart) {
		this.reset();
		this.style = style;
		this.start = startIndex;
		this.attribStart = attribStart;
	};
	/**
	* End batch part.
	* @param endIndex
	* @param endAttrib
	*/
	BatchPart.prototype.end = function(endIndex, endAttrib) {
		this.attribSize = endAttrib - this.attribStart;
		this.size = endIndex - this.start;
	};
	BatchPart.prototype.reset = function() {
		this.style = null;
		this.size = 0;
		this.start = 0;
		this.attribStart = 0;
		this.attribSize = 0;
	};
	return BatchPart;
}();
/**
* Generalized convenience utilities for Graphics.
* @namespace graphicsUtils
* @memberof PIXI
*/
var _a = {};
/**
* Map of fill commands for each shape type.
* @memberof PIXI.graphicsUtils
* @member {object} FILL_COMMANDS
*/
var FILL_COMMANDS = (_a[SHAPES.POLY] = buildPoly, _a[SHAPES.CIRC] = buildCircle, _a[SHAPES.ELIP] = buildCircle, _a[SHAPES.RECT] = buildRectangle, _a[SHAPES.RREC] = buildRoundedRectangle, _a);
/**
* Batch pool, stores unused batches for preventing allocations.
* @memberof PIXI.graphicsUtils
* @member {Array<PIXI.graphicsUtils.BatchPart>} BATCH_POOL
*/
var BATCH_POOL = [];
/**
* Draw call pool, stores unused draw calls for preventing allocations.
* @memberof PIXI.graphicsUtils
* @member {Array<PIXI.BatchDrawCall>} DRAW_CALL_POOL
*/
var DRAW_CALL_POOL = [];
/**
* A class to contain data useful for Graphics objects
* @memberof PIXI
*/
var GraphicsData = function() {
	/**
	* @param {PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.Rectangle|PIXI.RoundedRectangle} shape - The shape object to draw.
	* @param fillStyle - the width of the line to draw
	* @param lineStyle - the color of the line to draw
	* @param matrix - Transform matrix
	*/
	function GraphicsData(shape, fillStyle, lineStyle, matrix) {
		if (fillStyle === void 0) fillStyle = null;
		if (lineStyle === void 0) lineStyle = null;
		if (matrix === void 0) matrix = null;
		/** The collection of points. */
		this.points = [];
		/** The collection of holes. */
		this.holes = [];
		this.shape = shape;
		this.lineStyle = lineStyle;
		this.fillStyle = fillStyle;
		this.matrix = matrix;
		this.type = shape.type;
	}
	/**
	* Creates a new GraphicsData object with the same values as this one.
	* @returns - Cloned GraphicsData object
	*/
	GraphicsData.prototype.clone = function() {
		return new GraphicsData(this.shape, this.fillStyle, this.lineStyle, this.matrix);
	};
	/** Destroys the Graphics data. */
	GraphicsData.prototype.destroy = function() {
		this.shape = null;
		this.holes.length = 0;
		this.holes = null;
		this.points.length = 0;
		this.points = null;
		this.lineStyle = null;
		this.fillStyle = null;
	};
	return GraphicsData;
}();
var tmpPoint = new Point();
/**
* The Graphics class contains methods used to draw primitive shapes such as lines, circles and
* rectangles to the display, and to color and fill them.
*
* GraphicsGeometry is designed to not be continually updating the geometry since it's expensive
* to re-tesselate using **earcut**. Consider using {@link PIXI.Mesh} for this use-case, it's much faster.
* @memberof PIXI
*/
var GraphicsGeometry = function(_super) {
	__extends$14(GraphicsGeometry, _super);
	function GraphicsGeometry() {
		var _this = _super.call(this) || this;
		/** Minimal distance between points that are considered different. Affects line tesselation. */
		_this.closePointEps = 1e-4;
		/** Padding to add to the bounds. */
		_this.boundsPadding = 0;
		_this.uvsFloat32 = null;
		_this.indicesUint16 = null;
		_this.batchable = false;
		/** An array of points to draw, 2 numbers per point */
		_this.points = [];
		/** The collection of colors */
		_this.colors = [];
		/** The UVs collection */
		_this.uvs = [];
		/** The indices of the vertices */
		_this.indices = [];
		/** Reference to the texture IDs. */
		_this.textureIds = [];
		/**
		* The collection of drawn shapes.
		* @member {PIXI.GraphicsData[]}
		*/
		_this.graphicsData = [];
		/**
		* List of current draw calls drived from the batches.
		* @member {PIXI.BatchDrawCall[]}
		*/
		_this.drawCalls = [];
		/** Batches need to regenerated if the geometry is updated. */
		_this.batchDirty = -1;
		/**
		* Intermediate abstract format sent to batch system.
		* Can be converted to drawCalls or to batchable objects.
		* @member {PIXI.graphicsUtils.BatchPart[]}
		*/
		_this.batches = [];
		/** Used to detect if the graphics object has changed. */
		_this.dirty = 0;
		/** Used to check if the cache is dirty. */
		_this.cacheDirty = -1;
		/** Used to detect if we cleared the graphicsData. */
		_this.clearDirty = 0;
		/** Index of the last batched shape in the stack of calls. */
		_this.shapeIndex = 0;
		/** Cached bounds. */
		_this._bounds = new Bounds();
		/** The bounds dirty flag. */
		_this.boundsDirty = -1;
		return _this;
	}
	Object.defineProperty(GraphicsGeometry.prototype, "bounds", {
		/**
		* Get the current bounds of the graphic geometry.
		* @readonly
		*/
		get: function() {
			this.updateBatches();
			if (this.boundsDirty !== this.dirty) {
				this.boundsDirty = this.dirty;
				this.calculateBounds();
			}
			return this._bounds;
		},
		enumerable: false,
		configurable: true
	});
	/** Call if you changed graphicsData manually. Empties all batch buffers. */
	GraphicsGeometry.prototype.invalidate = function() {
		this.boundsDirty = -1;
		this.dirty++;
		this.batchDirty++;
		this.shapeIndex = 0;
		this.points.length = 0;
		this.colors.length = 0;
		this.uvs.length = 0;
		this.indices.length = 0;
		this.textureIds.length = 0;
		for (var i = 0; i < this.drawCalls.length; i++) {
			this.drawCalls[i].texArray.clear();
			DRAW_CALL_POOL.push(this.drawCalls[i]);
		}
		this.drawCalls.length = 0;
		for (var i = 0; i < this.batches.length; i++) {
			var batchPart = this.batches[i];
			batchPart.reset();
			BATCH_POOL.push(batchPart);
		}
		this.batches.length = 0;
	};
	/**
	* Clears the graphics that were drawn to this Graphics object, and resets fill and line style settings.
	* @returns - This GraphicsGeometry object. Good for chaining method calls
	*/
	GraphicsGeometry.prototype.clear = function() {
		if (this.graphicsData.length > 0) {
			this.invalidate();
			this.clearDirty++;
			this.graphicsData.length = 0;
		}
		return this;
	};
	/**
	* Draws the given shape to this Graphics object. Can be any of Circle, Rectangle, Ellipse, Line or Polygon.
	* @param {PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.Rectangle|PIXI.RoundedRectangle} shape - The shape object to draw.
	* @param fillStyle - Defines style of the fill.
	* @param lineStyle - Defines style of the lines.
	* @param matrix - Transform applied to the points of the shape.
	* @returns - Returns geometry for chaining.
	*/
	GraphicsGeometry.prototype.drawShape = function(shape, fillStyle, lineStyle, matrix) {
		if (fillStyle === void 0) fillStyle = null;
		if (lineStyle === void 0) lineStyle = null;
		if (matrix === void 0) matrix = null;
		var data = new GraphicsData(shape, fillStyle, lineStyle, matrix);
		this.graphicsData.push(data);
		this.dirty++;
		return this;
	};
	/**
	* Draws the given shape to this Graphics object. Can be any of Circle, Rectangle, Ellipse, Line or Polygon.
	* @param {PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.Rectangle|PIXI.RoundedRectangle} shape - The shape object to draw.
	* @param matrix - Transform applied to the points of the shape.
	* @returns - Returns geometry for chaining.
	*/
	GraphicsGeometry.prototype.drawHole = function(shape, matrix) {
		if (matrix === void 0) matrix = null;
		if (!this.graphicsData.length) return null;
		var data = new GraphicsData(shape, null, null, matrix);
		var lastShape = this.graphicsData[this.graphicsData.length - 1];
		data.lineStyle = lastShape.lineStyle;
		lastShape.holes.push(data);
		this.dirty++;
		return this;
	};
	/** Destroys the GraphicsGeometry object. */
	GraphicsGeometry.prototype.destroy = function() {
		_super.prototype.destroy.call(this);
		for (var i = 0; i < this.graphicsData.length; ++i) this.graphicsData[i].destroy();
		this.points.length = 0;
		this.points = null;
		this.colors.length = 0;
		this.colors = null;
		this.uvs.length = 0;
		this.uvs = null;
		this.indices.length = 0;
		this.indices = null;
		this.indexBuffer.destroy();
		this.indexBuffer = null;
		this.graphicsData.length = 0;
		this.graphicsData = null;
		this.drawCalls.length = 0;
		this.drawCalls = null;
		this.batches.length = 0;
		this.batches = null;
		this._bounds = null;
	};
	/**
	* Check to see if a point is contained within this geometry.
	* @param point - Point to check if it's contained.
	* @returns {boolean} `true` if the point is contained within geometry.
	*/
	GraphicsGeometry.prototype.containsPoint = function(point) {
		var graphicsData = this.graphicsData;
		for (var i = 0; i < graphicsData.length; ++i) {
			var data = graphicsData[i];
			if (!data.fillStyle.visible) continue;
			if (data.shape) {
				if (data.matrix) data.matrix.applyInverse(point, tmpPoint);
				else tmpPoint.copyFrom(point);
				if (data.shape.contains(tmpPoint.x, tmpPoint.y)) {
					var hitHole = false;
					if (data.holes) {
						for (var i_1 = 0; i_1 < data.holes.length; i_1++) if (data.holes[i_1].shape.contains(tmpPoint.x, tmpPoint.y)) {
							hitHole = true;
							break;
						}
					}
					if (!hitHole) return true;
				}
			}
		}
		return false;
	};
	/**
	* Generates intermediate batch data. Either gets converted to drawCalls
	* or used to convert to batch objects directly by the Graphics object.
	*/
	GraphicsGeometry.prototype.updateBatches = function() {
		if (!this.graphicsData.length) {
			this.batchable = true;
			return;
		}
		if (!this.validateBatching()) return;
		this.cacheDirty = this.dirty;
		var uvs = this.uvs;
		var graphicsData = this.graphicsData;
		var batchPart = null;
		var currentStyle = null;
		if (this.batches.length > 0) {
			batchPart = this.batches[this.batches.length - 1];
			currentStyle = batchPart.style;
		}
		for (var i = this.shapeIndex; i < graphicsData.length; i++) {
			this.shapeIndex++;
			var data = graphicsData[i];
			var fillStyle = data.fillStyle;
			var lineStyle = data.lineStyle;
			FILL_COMMANDS[data.type].build(data);
			if (data.matrix) this.transformPoints(data.points, data.matrix);
			if (fillStyle.visible || lineStyle.visible) this.processHoles(data.holes);
			for (var j = 0; j < 2; j++) {
				var style = j === 0 ? fillStyle : lineStyle;
				if (!style.visible) continue;
				var nextTexture = style.texture.baseTexture;
				var index_1 = this.indices.length;
				var attribIndex = this.points.length / 2;
				nextTexture.wrapMode = WRAP_MODES.REPEAT;
				if (j === 0) this.processFill(data);
				else this.processLine(data);
				var size = this.points.length / 2 - attribIndex;
				if (size === 0) continue;
				if (batchPart && !this._compareStyles(currentStyle, style)) {
					batchPart.end(index_1, attribIndex);
					batchPart = null;
				}
				if (!batchPart) {
					batchPart = BATCH_POOL.pop() || new BatchPart();
					batchPart.begin(style, index_1, attribIndex);
					this.batches.push(batchPart);
					currentStyle = style;
				}
				this.addUvs(this.points, uvs, style.texture, attribIndex, size, style.matrix);
			}
		}
		var index = this.indices.length;
		var attrib = this.points.length / 2;
		if (batchPart) batchPart.end(index, attrib);
		if (this.batches.length === 0) {
			this.batchable = true;
			return;
		}
		var need32 = attrib > 65535;
		if (this.indicesUint16 && this.indices.length === this.indicesUint16.length && need32 === this.indicesUint16.BYTES_PER_ELEMENT > 2) this.indicesUint16.set(this.indices);
		else this.indicesUint16 = need32 ? new Uint32Array(this.indices) : new Uint16Array(this.indices);
		this.batchable = this.isBatchable();
		if (this.batchable) this.packBatches();
		else this.buildDrawCalls();
	};
	/**
	* Affinity check
	* @param styleA
	* @param styleB
	*/
	GraphicsGeometry.prototype._compareStyles = function(styleA, styleB) {
		if (!styleA || !styleB) return false;
		if (styleA.texture.baseTexture !== styleB.texture.baseTexture) return false;
		if (styleA.color + styleA.alpha !== styleB.color + styleB.alpha) return false;
		if (!!styleA.native !== !!styleB.native) return false;
		return true;
	};
	/** Test geometry for batching process. */
	GraphicsGeometry.prototype.validateBatching = function() {
		if (this.dirty === this.cacheDirty || !this.graphicsData.length) return false;
		for (var i = 0, l = this.graphicsData.length; i < l; i++) {
			var data = this.graphicsData[i];
			var fill = data.fillStyle;
			var line = data.lineStyle;
			if (fill && !fill.texture.baseTexture.valid) return false;
			if (line && !line.texture.baseTexture.valid) return false;
		}
		return true;
	};
	/** Offset the indices so that it works with the batcher. */
	GraphicsGeometry.prototype.packBatches = function() {
		this.batchDirty++;
		this.uvsFloat32 = new Float32Array(this.uvs);
		var batches = this.batches;
		for (var i = 0, l = batches.length; i < l; i++) {
			var batch = batches[i];
			for (var j = 0; j < batch.size; j++) {
				var index = batch.start + j;
				this.indicesUint16[index] = this.indicesUint16[index] - batch.attribStart;
			}
		}
	};
	/**
	* Checks to see if this graphics geometry can be batched.
	* Currently it needs to be small enough and not contain any native lines.
	*/
	GraphicsGeometry.prototype.isBatchable = function() {
		if (this.points.length > 131070) return false;
		var batches = this.batches;
		for (var i = 0; i < batches.length; i++) if (batches[i].style.native) return false;
		return this.points.length < GraphicsGeometry.BATCHABLE_SIZE * 2;
	};
	/** Converts intermediate batches data to drawCalls. */
	GraphicsGeometry.prototype.buildDrawCalls = function() {
		var TICK = ++BaseTexture._globalBatch;
		for (var i = 0; i < this.drawCalls.length; i++) {
			this.drawCalls[i].texArray.clear();
			DRAW_CALL_POOL.push(this.drawCalls[i]);
		}
		this.drawCalls.length = 0;
		var colors = this.colors;
		var textureIds = this.textureIds;
		var currentGroup = DRAW_CALL_POOL.pop();
		if (!currentGroup) {
			currentGroup = new BatchDrawCall();
			currentGroup.texArray = new BatchTextureArray();
		}
		currentGroup.texArray.count = 0;
		currentGroup.start = 0;
		currentGroup.size = 0;
		currentGroup.type = DRAW_MODES.TRIANGLES;
		var textureCount = 0;
		var currentTexture = null;
		var textureId = 0;
		var native = false;
		var drawMode = DRAW_MODES.TRIANGLES;
		var index = 0;
		this.drawCalls.push(currentGroup);
		for (var i = 0; i < this.batches.length; i++) {
			var data = this.batches[i];
			var MAX_TEXTURES = 8;
			var style = data.style;
			var nextTexture = style.texture.baseTexture;
			if (native !== !!style.native) {
				native = !!style.native;
				drawMode = native ? DRAW_MODES.LINES : DRAW_MODES.TRIANGLES;
				currentTexture = null;
				textureCount = MAX_TEXTURES;
				TICK++;
			}
			if (currentTexture !== nextTexture) {
				currentTexture = nextTexture;
				if (nextTexture._batchEnabled !== TICK) {
					if (textureCount === MAX_TEXTURES) {
						TICK++;
						textureCount = 0;
						if (currentGroup.size > 0) {
							currentGroup = DRAW_CALL_POOL.pop();
							if (!currentGroup) {
								currentGroup = new BatchDrawCall();
								currentGroup.texArray = new BatchTextureArray();
							}
							this.drawCalls.push(currentGroup);
						}
						currentGroup.start = index;
						currentGroup.size = 0;
						currentGroup.texArray.count = 0;
						currentGroup.type = drawMode;
					}
					nextTexture.touched = 1;
					nextTexture._batchEnabled = TICK;
					nextTexture._batchLocation = textureCount;
					nextTexture.wrapMode = WRAP_MODES.REPEAT;
					currentGroup.texArray.elements[currentGroup.texArray.count++] = nextTexture;
					textureCount++;
				}
			}
			currentGroup.size += data.size;
			index += data.size;
			textureId = nextTexture._batchLocation;
			this.addColors(colors, style.color, style.alpha, data.attribSize, data.attribStart);
			this.addTextureIds(textureIds, textureId, data.attribSize, data.attribStart);
		}
		BaseTexture._globalBatch = TICK;
		this.packAttributes();
	};
	/** Packs attributes to single buffer. */
	GraphicsGeometry.prototype.packAttributes = function() {
		var verts = this.points;
		var uvs = this.uvs;
		var colors = this.colors;
		var textureIds = this.textureIds;
		var glPoints = /* @__PURE__ */ new ArrayBuffer(verts.length * 3 * 4);
		var f32 = new Float32Array(glPoints);
		var u32 = new Uint32Array(glPoints);
		var p = 0;
		for (var i = 0; i < verts.length / 2; i++) {
			f32[p++] = verts[i * 2];
			f32[p++] = verts[i * 2 + 1];
			f32[p++] = uvs[i * 2];
			f32[p++] = uvs[i * 2 + 1];
			u32[p++] = colors[i];
			f32[p++] = textureIds[i];
		}
		this._buffer.update(glPoints);
		this._indexBuffer.update(this.indicesUint16);
	};
	/**
	* Process fill part of Graphics.
	* @param data
	*/
	GraphicsGeometry.prototype.processFill = function(data) {
		if (data.holes.length) buildPoly.triangulate(data, this);
		else FILL_COMMANDS[data.type].triangulate(data, this);
	};
	/**
	* Process line part of Graphics.
	* @param data
	*/
	GraphicsGeometry.prototype.processLine = function(data) {
		buildLine(data, this);
		for (var i = 0; i < data.holes.length; i++) buildLine(data.holes[i], this);
	};
	/**
	* Process the holes data.
	* @param holes
	*/
	GraphicsGeometry.prototype.processHoles = function(holes) {
		for (var i = 0; i < holes.length; i++) {
			var hole = holes[i];
			FILL_COMMANDS[hole.type].build(hole);
			if (hole.matrix) this.transformPoints(hole.points, hole.matrix);
		}
	};
	/** Update the local bounds of the object. Expensive to use performance-wise. */
	GraphicsGeometry.prototype.calculateBounds = function() {
		var bounds = this._bounds;
		bounds.clear();
		bounds.addVertexData(this.points, 0, this.points.length);
		bounds.pad(this.boundsPadding, this.boundsPadding);
	};
	/**
	* Transform points using matrix.
	* @param points - Points to transform
	* @param matrix - Transform matrix
	*/
	GraphicsGeometry.prototype.transformPoints = function(points, matrix) {
		for (var i = 0; i < points.length / 2; i++) {
			var x = points[i * 2];
			var y = points[i * 2 + 1];
			points[i * 2] = matrix.a * x + matrix.c * y + matrix.tx;
			points[i * 2 + 1] = matrix.b * x + matrix.d * y + matrix.ty;
		}
	};
	/**
	* Add colors.
	* @param colors - List of colors to add to
	* @param color - Color to add
	* @param alpha - Alpha to use
	* @param size - Number of colors to add
	* @param offset
	*/
	GraphicsGeometry.prototype.addColors = function(colors, color, alpha, size, offset) {
		if (offset === void 0) offset = 0;
		var rgb = (color >> 16) + (color & 65280) + ((color & 255) << 16);
		var rgba = premultiplyTint(rgb, alpha);
		colors.length = Math.max(colors.length, offset + size);
		for (var i = 0; i < size; i++) colors[offset + i] = rgba;
	};
	/**
	* Add texture id that the shader/fragment wants to use.
	* @param textureIds
	* @param id
	* @param size
	* @param offset
	*/
	GraphicsGeometry.prototype.addTextureIds = function(textureIds, id, size, offset) {
		if (offset === void 0) offset = 0;
		textureIds.length = Math.max(textureIds.length, offset + size);
		for (var i = 0; i < size; i++) textureIds[offset + i] = id;
	};
	/**
	* Generates the UVs for a shape.
	* @param verts - Vertices
	* @param uvs - UVs
	* @param texture - Reference to Texture
	* @param start - Index buffer start index.
	* @param size - The size/length for index buffer.
	* @param matrix - Optional transform for all points.
	*/
	GraphicsGeometry.prototype.addUvs = function(verts, uvs, texture, start, size, matrix) {
		if (matrix === void 0) matrix = null;
		var index = 0;
		var uvsStart = uvs.length;
		var frame = texture.frame;
		while (index < size) {
			var x = verts[(start + index) * 2];
			var y = verts[(start + index) * 2 + 1];
			if (matrix) {
				var nx = matrix.a * x + matrix.c * y + matrix.tx;
				y = matrix.b * x + matrix.d * y + matrix.ty;
				x = nx;
			}
			index++;
			uvs.push(x / frame.width, y / frame.height);
		}
		var baseTexture = texture.baseTexture;
		if (frame.width < baseTexture.width || frame.height < baseTexture.height) this.adjustUvs(uvs, texture, uvsStart, size);
	};
	/**
	* Modify uvs array according to position of texture region
	* Does not work with rotated or trimmed textures
	* @param uvs - array
	* @param texture - region
	* @param start - starting index for uvs
	* @param size - how many points to adjust
	*/
	GraphicsGeometry.prototype.adjustUvs = function(uvs, texture, start, size) {
		var baseTexture = texture.baseTexture;
		var eps = 1e-6;
		var finish = start + size * 2;
		var frame = texture.frame;
		var scaleX = frame.width / baseTexture.width;
		var scaleY = frame.height / baseTexture.height;
		var offsetX = frame.x / frame.width;
		var offsetY = frame.y / frame.height;
		var minX = Math.floor(uvs[start] + eps);
		var minY = Math.floor(uvs[start + 1] + eps);
		for (var i = start + 2; i < finish; i += 2) {
			minX = Math.min(minX, Math.floor(uvs[i] + eps));
			minY = Math.min(minY, Math.floor(uvs[i + 1] + eps));
		}
		offsetX -= minX;
		offsetY -= minY;
		for (var i = start; i < finish; i += 2) {
			uvs[i] = (uvs[i] + offsetX) * scaleX;
			uvs[i + 1] = (uvs[i + 1] + offsetY) * scaleY;
		}
	};
	/**
	* The maximum number of points to consider an object "batchable",
	* able to be batched by the renderer's batch system.
	\
	*/
	GraphicsGeometry.BATCHABLE_SIZE = 100;
	return GraphicsGeometry;
}(BatchGeometry);
/**
* Represents the line style for Graphics.
* @memberof PIXI
*/
var LineStyle = function(_super) {
	__extends$14(LineStyle, _super);
	function LineStyle() {
		var _this = _super !== null && _super.apply(this, arguments) || this;
		/** The width (thickness) of any lines drawn. */
		_this.width = 0;
		/** The alignment of any lines drawn (0.5 = middle, 1 = outer, 0 = inner). WebGL only. */
		_this.alignment = .5;
		/** If true the lines will be draw using LINES instead of TRIANGLE_STRIP. */
		_this.native = false;
		/**
		* Line cap style.
		* @member {PIXI.LINE_CAP}
		* @default PIXI.LINE_CAP.BUTT
		*/
		_this.cap = LINE_CAP.BUTT;
		/**
		* Line join style.
		* @member {PIXI.LINE_JOIN}
		* @default PIXI.LINE_JOIN.MITER
		*/
		_this.join = LINE_JOIN.MITER;
		/** Miter limit. */
		_this.miterLimit = 10;
		return _this;
	}
	/** Clones the object. */
	LineStyle.prototype.clone = function() {
		var obj = new LineStyle();
		obj.color = this.color;
		obj.alpha = this.alpha;
		obj.texture = this.texture;
		obj.matrix = this.matrix;
		obj.visible = this.visible;
		obj.width = this.width;
		obj.alignment = this.alignment;
		obj.native = this.native;
		obj.cap = this.cap;
		obj.join = this.join;
		obj.miterLimit = this.miterLimit;
		return obj;
	};
	/** Reset the line style to default. */
	LineStyle.prototype.reset = function() {
		_super.prototype.reset.call(this);
		this.color = 0;
		this.alignment = .5;
		this.width = 0;
		this.native = false;
	};
	return LineStyle;
}(FillStyle);
var temp = /* @__PURE__ */ new Float32Array(3);
var DEFAULT_SHADERS = {};
/**
* The Graphics class is primarily used to render primitive shapes such as lines, circles and
* rectangles to the display, and to color and fill them.  However, you can also use a Graphics
* object to build a list of primitives to use as a mask, or as a complex hitArea.
*
* Please note that due to legacy naming conventions, the behavior of some functions in this class
* can be confusing.  Each call to `drawRect()`, `drawPolygon()`, etc. actually stores that primitive
* in the Geometry class's GraphicsGeometry object for later use in rendering or hit testing - the
* functions do not directly draw anything to the screen.  Similarly, the `clear()` function doesn't
* change the screen, it simply resets the list of primitives, which can be useful if you want to
* rebuild the contents of an existing Graphics object.
*
* Once a GraphicsGeometry list is built, you can re-use it in other Geometry objects as
* an optimization, by passing it into a new Geometry object's constructor.  Because of this
* ability, it's important to call `destroy()` on Geometry objects once you are done with them, to
* properly dereference each GraphicsGeometry and prevent memory leaks.
* @memberof PIXI
*/
var Graphics = function(_super) {
	__extends$14(Graphics, _super);
	/**
	* @param geometry - Geometry to use, if omitted will create a new GraphicsGeometry instance.
	*/
	function Graphics(geometry) {
		if (geometry === void 0) geometry = null;
		var _this = _super.call(this) || this;
		/**
		* Represents the vertex and fragment shaders that processes the geometry and runs on the GPU.
		* Can be shared between multiple Graphics objects.
		*/
		_this.shader = null;
		/** Renderer plugin for batching */
		_this.pluginName = "batch";
		/**
		* Current path
		* @readonly
		*/
		_this.currentPath = null;
		/** A collections of batches! These can be drawn by the renderer batch system. */
		_this.batches = [];
		/** Update dirty for limiting calculating tints for batches. */
		_this.batchTint = -1;
		/** Update dirty for limiting calculating batches.*/
		_this.batchDirty = -1;
		/** Copy of the object vertex data. */
		_this.vertexData = null;
		/** Current fill style. */
		_this._fillStyle = new FillStyle();
		/** Current line style. */
		_this._lineStyle = new LineStyle();
		/** Current shape transform matrix. */
		_this._matrix = null;
		/** Current hole mode is enabled. */
		_this._holeMode = false;
		/**
		* Represents the WebGL state the Graphics required to render, excludes shader and geometry. E.g.,
		* blend mode, culling, depth testing, direction of rendering triangles, backface, etc.
		*/
		_this.state = State.for2d();
		_this._geometry = geometry || new GraphicsGeometry();
		_this._geometry.refCount++;
		/**
		* When cacheAsBitmap is set to true the graphics object will be rendered as if it was a sprite.
		* This is useful if your graphics element does not change often, as it will speed up the rendering
		* of the object in exchange for taking up texture memory. It is also useful if you need the graphics
		* object to be anti-aliased, because it will be rendered using canvas. This is not recommended if
		* you are constantly redrawing the graphics element.
		* @name cacheAsBitmap
		* @member {boolean}
		* @memberof PIXI.Graphics#
		* @default false
		*/
		_this._transformID = -1;
		_this.tint = 16777215;
		_this.blendMode = BLEND_MODES.NORMAL;
		return _this;
	}
	Object.defineProperty(Graphics.prototype, "geometry", {
		/**
		* Includes vertex positions, face indices, normals, colors, UVs, and
		* custom attributes within buffers, reducing the cost of passing all
		* this data to the GPU. Can be shared between multiple Mesh or Graphics objects.
		* @readonly
		*/
		get: function() {
			return this._geometry;
		},
		enumerable: false,
		configurable: true
	});
	/**
	* Creates a new Graphics object with the same values as this one.
	* Note that only the geometry of the object is cloned, not its transform (position,scale,etc)
	* @returns - A clone of the graphics object
	*/
	Graphics.prototype.clone = function() {
		this.finishPoly();
		return new Graphics(this._geometry);
	};
	Object.defineProperty(Graphics.prototype, "blendMode", {
		get: function() {
			return this.state.blendMode;
		},
		/**
		* The blend mode to be applied to the graphic shape. Apply a value of
		* `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.  Note that, since each
		* primitive in the GraphicsGeometry list is rendered sequentially, modes
		* such as `PIXI.BLEND_MODES.ADD` and `PIXI.BLEND_MODES.MULTIPLY` will
		* be applied per-primitive.
		* @default PIXI.BLEND_MODES.NORMAL
		*/
		set: function(value) {
			this.state.blendMode = value;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Graphics.prototype, "tint", {
		/**
		* The tint applied to each graphic shape. This is a hex value. A value of
		* 0xFFFFFF will remove any tint effect.
		* @default 0xFFFFFF
		*/
		get: function() {
			return this._tint;
		},
		set: function(value) {
			this._tint = value;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Graphics.prototype, "fill", {
		/**
		* The current fill style.
		* @readonly
		*/
		get: function() {
			return this._fillStyle;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Graphics.prototype, "line", {
		/**
		* The current line style.
		* @readonly
		*/
		get: function() {
			return this._lineStyle;
		},
		enumerable: false,
		configurable: true
	});
	Graphics.prototype.lineStyle = function(options, color, alpha, alignment, native) {
		if (options === void 0) options = null;
		if (color === void 0) color = 0;
		if (alpha === void 0) alpha = 1;
		if (alignment === void 0) alignment = .5;
		if (native === void 0) native = false;
		if (typeof options === "number") options = {
			width: options,
			color,
			alpha,
			alignment,
			native
		};
		return this.lineTextureStyle(options);
	};
	/**
	* Like line style but support texture for line fill.
	* @param [options] - Collection of options for setting line style.
	* @param {number} [options.width=0] - width of the line to draw, will update the objects stored style
	* @param {PIXI.Texture} [options.texture=PIXI.Texture.WHITE] - Texture to use
	* @param {number} [options.color=0x0] - color of the line to draw, will update the objects stored style.
	*  Default 0xFFFFFF if texture present.
	* @param {number} [options.alpha=1] - alpha of the line to draw, will update the objects stored style
	* @param {PIXI.Matrix} [options.matrix=null] - Texture matrix to transform texture
	* @param {number} [options.alignment=0.5] - alignment of the line to draw, (0 = inner, 0.5 = middle, 1 = outer).
	*        WebGL only.
	* @param {boolean} [options.native=false] - If true the lines will be draw using LINES instead of TRIANGLE_STRIP
	* @param {PIXI.LINE_CAP}[options.cap=PIXI.LINE_CAP.BUTT] - line cap style
	* @param {PIXI.LINE_JOIN}[options.join=PIXI.LINE_JOIN.MITER] - line join style
	* @param {number}[options.miterLimit=10] - miter limit ratio
	* @returns {PIXI.Graphics} This Graphics object. Good for chaining method calls
	*/
	Graphics.prototype.lineTextureStyle = function(options) {
		options = Object.assign({
			width: 0,
			texture: Texture.WHITE,
			color: options && options.texture ? 16777215 : 0,
			alpha: 1,
			matrix: null,
			alignment: .5,
			native: false,
			cap: LINE_CAP.BUTT,
			join: LINE_JOIN.MITER,
			miterLimit: 10
		}, options);
		if (this.currentPath) this.startPoly();
		var visible = options.width > 0 && options.alpha > 0;
		if (!visible) this._lineStyle.reset();
		else {
			if (options.matrix) {
				options.matrix = options.matrix.clone();
				options.matrix.invert();
			}
			Object.assign(this._lineStyle, { visible }, options);
		}
		return this;
	};
	/**
	* Start a polygon object internally.
	* @protected
	*/
	Graphics.prototype.startPoly = function() {
		if (this.currentPath) {
			var points = this.currentPath.points;
			var len = this.currentPath.points.length;
			if (len > 2) {
				this.drawShape(this.currentPath);
				this.currentPath = new Polygon();
				this.currentPath.closeStroke = false;
				this.currentPath.points.push(points[len - 2], points[len - 1]);
			}
		} else {
			this.currentPath = new Polygon();
			this.currentPath.closeStroke = false;
		}
	};
	/**
	* Finish the polygon object.
	* @protected
	*/
	Graphics.prototype.finishPoly = function() {
		if (this.currentPath) {
			if (this.currentPath.points.length > 2) {
				this.drawShape(this.currentPath);
				this.currentPath = null;
			} else this.currentPath.points.length = 0;
		}
	};
	/**
	* Moves the current drawing position to x, y.
	* @param x - the X coordinate to move to
	* @param y - the Y coordinate to move to
	* @returns - This Graphics object. Good for chaining method calls
	*/
	Graphics.prototype.moveTo = function(x, y) {
		this.startPoly();
		this.currentPath.points[0] = x;
		this.currentPath.points[1] = y;
		return this;
	};
	/**
	* Draws a line using the current line style from the current drawing position to (x, y);
	* The current drawing position is then set to (x, y).
	* @param x - the X coordinate to draw to
	* @param y - the Y coordinate to draw to
	* @returns - This Graphics object. Good for chaining method calls
	*/
	Graphics.prototype.lineTo = function(x, y) {
		if (!this.currentPath) this.moveTo(0, 0);
		var points = this.currentPath.points;
		var fromX = points[points.length - 2];
		var fromY = points[points.length - 1];
		if (fromX !== x || fromY !== y) points.push(x, y);
		return this;
	};
	/**
	* Initialize the curve
	* @param x
	* @param y
	*/
	Graphics.prototype._initCurve = function(x, y) {
		if (x === void 0) x = 0;
		if (y === void 0) y = 0;
		if (this.currentPath) {
			if (this.currentPath.points.length === 0) this.currentPath.points = [x, y];
		} else this.moveTo(x, y);
	};
	/**
	* Calculate the points for a quadratic bezier curve and then draws it.
	* Based on: https://stackoverflow.com/questions/785097/how-do-i-implement-a-bezier-curve-in-c
	* @param cpX - Control point x
	* @param cpY - Control point y
	* @param toX - Destination point x
	* @param toY - Destination point y
	* @returns - This Graphics object. Good for chaining method calls
	*/
	Graphics.prototype.quadraticCurveTo = function(cpX, cpY, toX, toY) {
		this._initCurve();
		var points = this.currentPath.points;
		if (points.length === 0) this.moveTo(0, 0);
		QuadraticUtils.curveTo(cpX, cpY, toX, toY, points);
		return this;
	};
	/**
	* Calculate the points for a bezier curve and then draws it.
	* @param cpX - Control point x
	* @param cpY - Control point y
	* @param cpX2 - Second Control point x
	* @param cpY2 - Second Control point y
	* @param toX - Destination point x
	* @param toY - Destination point y
	* @returns This Graphics object. Good for chaining method calls
	*/
	Graphics.prototype.bezierCurveTo = function(cpX, cpY, cpX2, cpY2, toX, toY) {
		this._initCurve();
		BezierUtils.curveTo(cpX, cpY, cpX2, cpY2, toX, toY, this.currentPath.points);
		return this;
	};
	/**
	* The arcTo() method creates an arc/curve between two tangents on the canvas.
	*
	* "borrowed" from https://code.google.com/p/fxcanvas/ - thanks google!
	* @param x1 - The x-coordinate of the first tangent point of the arc
	* @param y1 - The y-coordinate of the first tangent point of the arc
	* @param x2 - The x-coordinate of the end of the arc
	* @param y2 - The y-coordinate of the end of the arc
	* @param radius - The radius of the arc
	* @returns - This Graphics object. Good for chaining method calls
	*/
	Graphics.prototype.arcTo = function(x1, y1, x2, y2, radius) {
		this._initCurve(x1, y1);
		var points = this.currentPath.points;
		var result = ArcUtils.curveTo(x1, y1, x2, y2, radius, points);
		if (result) {
			var cx = result.cx, cy = result.cy, radius_1 = result.radius, startAngle = result.startAngle, endAngle = result.endAngle, anticlockwise = result.anticlockwise;
			this.arc(cx, cy, radius_1, startAngle, endAngle, anticlockwise);
		}
		return this;
	};
	/**
	* The arc method creates an arc/curve (used to create circles, or parts of circles).
	* @param cx - The x-coordinate of the center of the circle
	* @param cy - The y-coordinate of the center of the circle
	* @param radius - The radius of the circle
	* @param startAngle - The starting angle, in radians (0 is at the 3 o'clock position
	*  of the arc's circle)
	* @param endAngle - The ending angle, in radians
	* @param anticlockwise - Specifies whether the drawing should be
	*  counter-clockwise or clockwise. False is default, and indicates clockwise, while true
	*  indicates counter-clockwise.
	* @returns - This Graphics object. Good for chaining method calls
	*/
	Graphics.prototype.arc = function(cx, cy, radius, startAngle, endAngle, anticlockwise) {
		if (anticlockwise === void 0) anticlockwise = false;
		if (startAngle === endAngle) return this;
		if (!anticlockwise && endAngle <= startAngle) endAngle += PI_2;
		else if (anticlockwise && startAngle <= endAngle) startAngle += PI_2;
		if (endAngle - startAngle === 0) return this;
		var startX = cx + Math.cos(startAngle) * radius;
		var startY = cy + Math.sin(startAngle) * radius;
		var eps = this._geometry.closePointEps;
		var points = this.currentPath ? this.currentPath.points : null;
		if (points) {
			var xDiff = Math.abs(points[points.length - 2] - startX);
			var yDiff = Math.abs(points[points.length - 1] - startY);
			if (xDiff < eps && yDiff < eps);
			else points.push(startX, startY);
		} else {
			this.moveTo(startX, startY);
			points = this.currentPath.points;
		}
		ArcUtils.arc(startX, startY, cx, cy, radius, startAngle, endAngle, anticlockwise, points);
		return this;
	};
	/**
	* Specifies a simple one-color fill that subsequent calls to other Graphics methods
	* (such as lineTo() or drawCircle()) use when drawing.
	* @param color - the color of the fill
	* @param alpha - the alpha of the fill
	* @returns - This Graphics object. Good for chaining method calls
	*/
	Graphics.prototype.beginFill = function(color, alpha) {
		if (color === void 0) color = 0;
		if (alpha === void 0) alpha = 1;
		return this.beginTextureFill({
			texture: Texture.WHITE,
			color,
			alpha
		});
	};
	/**
	* Begin the texture fill
	* @param options - Object object.
	* @param {PIXI.Texture} [options.texture=PIXI.Texture.WHITE] - Texture to fill
	* @param {number} [options.color=0xffffff] - Background to fill behind texture
	* @param {number} [options.alpha=1] - Alpha of fill
	* @param {PIXI.Matrix} [options.matrix=null] - Transform matrix
	* @returns {PIXI.Graphics} This Graphics object. Good for chaining method calls
	*/
	Graphics.prototype.beginTextureFill = function(options) {
		options = Object.assign({
			texture: Texture.WHITE,
			color: 16777215,
			alpha: 1,
			matrix: null
		}, options);
		if (this.currentPath) this.startPoly();
		var visible = options.alpha > 0;
		if (!visible) this._fillStyle.reset();
		else {
			if (options.matrix) {
				options.matrix = options.matrix.clone();
				options.matrix.invert();
			}
			Object.assign(this._fillStyle, { visible }, options);
		}
		return this;
	};
	/**
	* Applies a fill to the lines and shapes that were added since the last call to the beginFill() method.
	* @returns - This Graphics object. Good for chaining method calls
	*/
	Graphics.prototype.endFill = function() {
		this.finishPoly();
		this._fillStyle.reset();
		return this;
	};
	/**
	* Draws a rectangle shape.
	* @param x - The X coord of the top-left of the rectangle
	* @param y - The Y coord of the top-left of the rectangle
	* @param width - The width of the rectangle
	* @param height - The height of the rectangle
	* @returns - This Graphics object. Good for chaining method calls
	*/
	Graphics.prototype.drawRect = function(x, y, width, height) {
		return this.drawShape(new Rectangle(x, y, width, height));
	};
	/**
	* Draw a rectangle shape with rounded/beveled corners.
	* @param x - The X coord of the top-left of the rectangle
	* @param y - The Y coord of the top-left of the rectangle
	* @param width - The width of the rectangle
	* @param height - The height of the rectangle
	* @param radius - Radius of the rectangle corners
	* @returns - This Graphics object. Good for chaining method calls
	*/
	Graphics.prototype.drawRoundedRect = function(x, y, width, height, radius) {
		return this.drawShape(new RoundedRectangle(x, y, width, height, radius));
	};
	/**
	* Draws a circle.
	* @param x - The X coordinate of the center of the circle
	* @param y - The Y coordinate of the center of the circle
	* @param radius - The radius of the circle
	* @returns - This Graphics object. Good for chaining method calls
	*/
	Graphics.prototype.drawCircle = function(x, y, radius) {
		return this.drawShape(new Circle(x, y, radius));
	};
	/**
	* Draws an ellipse.
	* @param x - The X coordinate of the center of the ellipse
	* @param y - The Y coordinate of the center of the ellipse
	* @param width - The half width of the ellipse
	* @param height - The half height of the ellipse
	* @returns - This Graphics object. Good for chaining method calls
	*/
	Graphics.prototype.drawEllipse = function(x, y, width, height) {
		return this.drawShape(new Ellipse(x, y, width, height));
	};
	/**
	* Draws a polygon using the given path.
	* @param {number[]|PIXI.IPointData[]|PIXI.Polygon} path - The path data used to construct the polygon.
	* @returns - This Graphics object. Good for chaining method calls
	*/
	Graphics.prototype.drawPolygon = function() {
		var arguments$1 = arguments;
		var path = [];
		for (var _i = 0; _i < arguments.length; _i++) path[_i] = arguments$1[_i];
		var points;
		var closeStroke = true;
		var poly = path[0];
		if (poly.points) {
			closeStroke = poly.closeStroke;
			points = poly.points;
		} else if (Array.isArray(path[0])) points = path[0];
		else points = path;
		var shape = new Polygon(points);
		shape.closeStroke = closeStroke;
		this.drawShape(shape);
		return this;
	};
	/**
	* Draw any shape.
	* @param {PIXI.Circle|PIXI.Ellipse|PIXI.Polygon|PIXI.Rectangle|PIXI.RoundedRectangle} shape - Shape to draw
	* @returns - This Graphics object. Good for chaining method calls
	*/
	Graphics.prototype.drawShape = function(shape) {
		if (!this._holeMode) this._geometry.drawShape(shape, this._fillStyle.clone(), this._lineStyle.clone(), this._matrix);
		else this._geometry.drawHole(shape, this._matrix);
		return this;
	};
	/**
	* Clears the graphics that were drawn to this Graphics object, and resets fill and line style settings.
	* @returns - This Graphics object. Good for chaining method calls
	*/
	Graphics.prototype.clear = function() {
		this._geometry.clear();
		this._lineStyle.reset();
		this._fillStyle.reset();
		this._boundsID++;
		this._matrix = null;
		this._holeMode = false;
		this.currentPath = null;
		return this;
	};
	/**
	* True if graphics consists of one rectangle, and thus, can be drawn like a Sprite and
	* masked with gl.scissor.
	* @returns - True if only 1 rect.
	*/
	Graphics.prototype.isFastRect = function() {
		var data = this._geometry.graphicsData;
		return data.length === 1 && data[0].shape.type === SHAPES.RECT && !data[0].matrix && !data[0].holes.length && !(data[0].lineStyle.visible && data[0].lineStyle.width);
	};
	/**
	* Renders the object using the WebGL renderer
	* @param renderer - The renderer
	*/
	Graphics.prototype._render = function(renderer) {
		this.finishPoly();
		var geometry = this._geometry;
		geometry.updateBatches();
		if (geometry.batchable) {
			if (this.batchDirty !== geometry.batchDirty) this._populateBatches();
			this._renderBatched(renderer);
		} else {
			renderer.batch.flush();
			this._renderDirect(renderer);
		}
	};
	/** Populating batches for rendering. */
	Graphics.prototype._populateBatches = function() {
		var geometry = this._geometry;
		var blendMode = this.blendMode;
		var len = geometry.batches.length;
		this.batchTint = -1;
		this._transformID = -1;
		this.batchDirty = geometry.batchDirty;
		this.batches.length = len;
		this.vertexData = new Float32Array(geometry.points);
		for (var i = 0; i < len; i++) {
			var gI = geometry.batches[i];
			var color = gI.style.color;
			var vertexData = new Float32Array(this.vertexData.buffer, gI.attribStart * 4 * 2, gI.attribSize * 2);
			var uvs = new Float32Array(geometry.uvsFloat32.buffer, gI.attribStart * 4 * 2, gI.attribSize * 2);
			var batch = {
				vertexData,
				blendMode,
				indices: new Uint16Array(geometry.indicesUint16.buffer, gI.start * 2, gI.size),
				uvs,
				_batchRGB: hex2rgb(color),
				_tintRGB: color,
				_texture: gI.style.texture,
				alpha: gI.style.alpha,
				worldAlpha: 1
			};
			this.batches[i] = batch;
		}
	};
	/**
	* Renders the batches using the BathedRenderer plugin
	* @param renderer - The renderer
	*/
	Graphics.prototype._renderBatched = function(renderer) {
		if (!this.batches.length) return;
		renderer.batch.setObjectRenderer(renderer.plugins[this.pluginName]);
		this.calculateVertices();
		this.calculateTints();
		for (var i = 0, l = this.batches.length; i < l; i++) {
			var batch = this.batches[i];
			batch.worldAlpha = this.worldAlpha * batch.alpha;
			renderer.plugins[this.pluginName].render(batch);
		}
	};
	/**
	* Renders the graphics direct
	* @param renderer - The renderer
	*/
	Graphics.prototype._renderDirect = function(renderer) {
		var shader = this._resolveDirectShader(renderer);
		var geometry = this._geometry;
		var tint = this.tint;
		var worldAlpha = this.worldAlpha;
		var uniforms = shader.uniforms;
		var drawCalls = geometry.drawCalls;
		uniforms.translationMatrix = this.transform.worldTransform;
		uniforms.tint[0] = (tint >> 16 & 255) / 255 * worldAlpha;
		uniforms.tint[1] = (tint >> 8 & 255) / 255 * worldAlpha;
		uniforms.tint[2] = (tint & 255) / 255 * worldAlpha;
		uniforms.tint[3] = worldAlpha;
		renderer.shader.bind(shader);
		renderer.geometry.bind(geometry, shader);
		renderer.state.set(this.state);
		for (var i = 0, l = drawCalls.length; i < l; i++) this._renderDrawCallDirect(renderer, geometry.drawCalls[i]);
	};
	/**
	* Renders specific DrawCall
	* @param renderer
	* @param drawCall
	*/
	Graphics.prototype._renderDrawCallDirect = function(renderer, drawCall) {
		var texArray = drawCall.texArray, type = drawCall.type, size = drawCall.size, start = drawCall.start;
		var groupTextureCount = texArray.count;
		for (var j = 0; j < groupTextureCount; j++) renderer.texture.bind(texArray.elements[j], j);
		renderer.geometry.draw(type, size, start);
	};
	/**
	* Resolves shader for direct rendering
	* @param renderer - The renderer
	*/
	Graphics.prototype._resolveDirectShader = function(renderer) {
		var shader = this.shader;
		var pluginName = this.pluginName;
		if (!shader) {
			if (!DEFAULT_SHADERS[pluginName]) {
				var MAX_TEXTURES = renderer.plugins[pluginName].MAX_TEXTURES;
				var sampleValues = new Int32Array(MAX_TEXTURES);
				for (var i = 0; i < MAX_TEXTURES; i++) sampleValues[i] = i;
				var uniforms = {
					tint: new Float32Array([
						1,
						1,
						1,
						1
					]),
					translationMatrix: new Matrix(),
					default: UniformGroup.from({ uSamplers: sampleValues }, true)
				};
				var program = renderer.plugins[pluginName]._shader.program;
				DEFAULT_SHADERS[pluginName] = new Shader(program, uniforms);
			}
			shader = DEFAULT_SHADERS[pluginName];
		}
		return shader;
	};
	/** Retrieves the bounds of the graphic shape as a rectangle object. */
	Graphics.prototype._calculateBounds = function() {
		this.finishPoly();
		var geometry = this._geometry;
		if (!geometry.graphicsData.length) return;
		var _a = geometry.bounds, minX = _a.minX, minY = _a.minY, maxX = _a.maxX, maxY = _a.maxY;
		this._bounds.addFrame(this.transform, minX, minY, maxX, maxY);
	};
	/**
	* Tests if a point is inside this graphics object
	* @param point - the point to test
	* @returns - the result of the test
	*/
	Graphics.prototype.containsPoint = function(point) {
		this.worldTransform.applyInverse(point, Graphics._TEMP_POINT);
		return this._geometry.containsPoint(Graphics._TEMP_POINT);
	};
	/** Recalculate the tint by applying tint to batches using Graphics tint. */
	Graphics.prototype.calculateTints = function() {
		if (this.batchTint !== this.tint) {
			this.batchTint = this.tint;
			var tintRGB = hex2rgb(this.tint, temp);
			for (var i = 0; i < this.batches.length; i++) {
				var batch = this.batches[i];
				var batchTint = batch._batchRGB;
				var r = tintRGB[0] * batchTint[0] * 255;
				var g = tintRGB[1] * batchTint[1] * 255;
				var b = tintRGB[2] * batchTint[2] * 255;
				var color = (r << 16) + (g << 8) + (b | 0);
				batch._tintRGB = (color >> 16) + (color & 65280) + ((color & 255) << 16);
			}
		}
	};
	/** If there's a transform update or a change to the shape of the geometry, recalculate the vertices. */
	Graphics.prototype.calculateVertices = function() {
		var wtID = this.transform._worldID;
		if (this._transformID === wtID) return;
		this._transformID = wtID;
		var wt = this.transform.worldTransform;
		var a = wt.a;
		var b = wt.b;
		var c = wt.c;
		var d = wt.d;
		var tx = wt.tx;
		var ty = wt.ty;
		var data = this._geometry.points;
		var vertexData = this.vertexData;
		var count = 0;
		for (var i = 0; i < data.length; i += 2) {
			var x = data[i];
			var y = data[i + 1];
			vertexData[count++] = a * x + c * y + tx;
			vertexData[count++] = d * y + b * x + ty;
		}
	};
	/**
	* Closes the current path.
	* @returns - Returns itself.
	*/
	Graphics.prototype.closePath = function() {
		var currentPath = this.currentPath;
		if (currentPath) {
			currentPath.closeStroke = true;
			this.finishPoly();
		}
		return this;
	};
	/**
	* Apply a matrix to the positional data.
	* @param matrix - Matrix to use for transform current shape.
	* @returns - Returns itself.
	*/
	Graphics.prototype.setMatrix = function(matrix) {
		this._matrix = matrix;
		return this;
	};
	/**
	* Begin adding holes to the last draw shape
	* IMPORTANT: holes must be fully inside a shape to work
	* Also weirdness ensues if holes overlap!
	* Ellipses, Circles, Rectangles and Rounded Rectangles cannot be holes or host for holes in CanvasRenderer,
	* please use `moveTo` `lineTo`, `quadraticCurveTo` if you rely on pixi-legacy bundle.
	* @returns - Returns itself.
	*/
	Graphics.prototype.beginHole = function() {
		this.finishPoly();
		this._holeMode = true;
		return this;
	};
	/**
	* End adding holes to the last draw shape.
	* @returns - Returns itself.
	*/
	Graphics.prototype.endHole = function() {
		this.finishPoly();
		this._holeMode = false;
		return this;
	};
	/**
	* Destroys the Graphics object.
	* @param options - Options parameter. A boolean will act as if all
	*  options have been set to that value
	* @param {boolean} [options.children=false] - if set to true, all the children will have
	*  their destroy method called as well. 'options' will be passed on to those calls.
	* @param {boolean} [options.texture=false] - Only used for child Sprites if options.children is set to true
	*  Should it destroy the texture of the child sprite
	* @param {boolean} [options.baseTexture=false] - Only used for child Sprites if options.children is set to true
	*  Should it destroy the base texture of the child sprite
	*/
	Graphics.prototype.destroy = function(options) {
		this._geometry.refCount--;
		if (this._geometry.refCount === 0) this._geometry.dispose();
		this._matrix = null;
		this.currentPath = null;
		this._lineStyle.destroy();
		this._lineStyle = null;
		this._fillStyle.destroy();
		this._fillStyle = null;
		this._geometry = null;
		this.shader = null;
		this.vertexData = null;
		this.batches.length = 0;
		this.batches = null;
		_super.prototype.destroy.call(this, options);
	};
	/**
	* New rendering behavior for rounded rectangles: circular arcs instead of quadratic bezier curves.
	* In the next major release, we'll enable this by default.
	*/
	Graphics.nextRoundedRectBehavior = false;
	/**
	* Temporary point to use for containsPoint.
	* @private
	*/
	Graphics._TEMP_POINT = new Point();
	return Graphics;
}(Container);
var graphicsUtils = {
	buildPoly,
	buildCircle,
	buildRectangle,
	buildRoundedRectangle,
	buildLine,
	ArcUtils,
	BezierUtils,
	QuadraticUtils,
	BatchPart,
	FILL_COMMANDS,
	BATCH_POOL,
	DRAW_CALL_POOL
};
//#endregion
//#region node_modules/@pixi/sprite/dist/esm/sprite.mjs
/*!
* @pixi/sprite - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/sprite is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics$13 = function(d, b) {
	extendStatics$13 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
		d.__proto__ = b;
	} || function(d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	};
	return extendStatics$13(d, b);
};
function __extends$13(d, b) {
	extendStatics$13(d, b);
	function __() {
		this.constructor = d;
	}
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var tempPoint$2 = new Point();
var indices = new Uint16Array([
	0,
	1,
	2,
	0,
	2,
	3
]);
/**
* The Sprite object is the base for all textured objects that are rendered to the screen
*
* A sprite can be created directly from an image like this:
*
* ```js
* let sprite = PIXI.Sprite.from('assets/image.png');
* ```
*
* The more efficient way to create sprites is using a {@link PIXI.Spritesheet},
* as swapping base textures when rendering to the screen is inefficient.
*
* ```js
* PIXI.Loader.shared.add("assets/spritesheet.json").load(setup);
*
* function setup() {
*   let sheet = PIXI.Loader.shared.resources["assets/spritesheet.json"].spritesheet;
*   let sprite = new PIXI.Sprite(sheet.textures["image.png"]);
*   ...
* }
* ```
* @memberof PIXI
*/
var Sprite = function(_super) {
	__extends$13(Sprite, _super);
	/** @param texture - The texture for this sprite. */
	function Sprite(texture) {
		var _this = _super.call(this) || this;
		_this._anchor = new ObservablePoint(_this._onAnchorUpdate, _this, texture ? texture.defaultAnchor.x : 0, texture ? texture.defaultAnchor.y : 0);
		_this._texture = null;
		_this._width = 0;
		_this._height = 0;
		_this._tint = null;
		_this._tintRGB = null;
		_this.tint = 16777215;
		_this.blendMode = BLEND_MODES.NORMAL;
		_this._cachedTint = 16777215;
		_this.uvs = null;
		_this.texture = texture || Texture.EMPTY;
		_this.vertexData = /* @__PURE__ */ new Float32Array(8);
		_this.vertexTrimmedData = null;
		_this._transformID = -1;
		_this._textureID = -1;
		_this._transformTrimmedID = -1;
		_this._textureTrimmedID = -1;
		_this.indices = indices;
		_this.pluginName = "batch";
		/**
		* Used to fast check if a sprite is.. a sprite!
		* @member {boolean}
		*/
		_this.isSprite = true;
		_this._roundPixels = settings.ROUND_PIXELS;
		return _this;
	}
	/** When the texture is updated, this event will fire to update the scale and frame. */
	Sprite.prototype._onTextureUpdate = function() {
		this._textureID = -1;
		this._textureTrimmedID = -1;
		this._cachedTint = 16777215;
		if (this._width) this.scale.x = sign(this.scale.x) * this._width / this._texture.orig.width;
		if (this._height) this.scale.y = sign(this.scale.y) * this._height / this._texture.orig.height;
	};
	/** Called when the anchor position updates. */
	Sprite.prototype._onAnchorUpdate = function() {
		this._transformID = -1;
		this._transformTrimmedID = -1;
	};
	/** Calculates worldTransform * vertices, store it in vertexData. */
	Sprite.prototype.calculateVertices = function() {
		var texture = this._texture;
		if (this._transformID === this.transform._worldID && this._textureID === texture._updateID) return;
		if (this._textureID !== texture._updateID) this.uvs = this._texture._uvs.uvsFloat32;
		this._transformID = this.transform._worldID;
		this._textureID = texture._updateID;
		var wt = this.transform.worldTransform;
		var a = wt.a;
		var b = wt.b;
		var c = wt.c;
		var d = wt.d;
		var tx = wt.tx;
		var ty = wt.ty;
		var vertexData = this.vertexData;
		var trim = texture.trim;
		var orig = texture.orig;
		var anchor = this._anchor;
		var w0 = 0;
		var w1 = 0;
		var h0 = 0;
		var h1 = 0;
		if (trim) {
			w1 = trim.x - anchor._x * orig.width;
			w0 = w1 + trim.width;
			h1 = trim.y - anchor._y * orig.height;
			h0 = h1 + trim.height;
		} else {
			w1 = -anchor._x * orig.width;
			w0 = w1 + orig.width;
			h1 = -anchor._y * orig.height;
			h0 = h1 + orig.height;
		}
		vertexData[0] = a * w1 + c * h1 + tx;
		vertexData[1] = d * h1 + b * w1 + ty;
		vertexData[2] = a * w0 + c * h1 + tx;
		vertexData[3] = d * h1 + b * w0 + ty;
		vertexData[4] = a * w0 + c * h0 + tx;
		vertexData[5] = d * h0 + b * w0 + ty;
		vertexData[6] = a * w1 + c * h0 + tx;
		vertexData[7] = d * h0 + b * w1 + ty;
		if (this._roundPixels) {
			var resolution = settings.RESOLUTION;
			for (var i = 0; i < vertexData.length; ++i) vertexData[i] = Math.round((vertexData[i] * resolution | 0) / resolution);
		}
	};
	/**
	* Calculates worldTransform * vertices for a non texture with a trim. store it in vertexTrimmedData.
	*
	* This is used to ensure that the true width and height of a trimmed texture is respected.
	*/
	Sprite.prototype.calculateTrimmedVertices = function() {
		if (!this.vertexTrimmedData) this.vertexTrimmedData = /* @__PURE__ */ new Float32Array(8);
		else if (this._transformTrimmedID === this.transform._worldID && this._textureTrimmedID === this._texture._updateID) return;
		this._transformTrimmedID = this.transform._worldID;
		this._textureTrimmedID = this._texture._updateID;
		var texture = this._texture;
		var vertexData = this.vertexTrimmedData;
		var orig = texture.orig;
		var anchor = this._anchor;
		var wt = this.transform.worldTransform;
		var a = wt.a;
		var b = wt.b;
		var c = wt.c;
		var d = wt.d;
		var tx = wt.tx;
		var ty = wt.ty;
		var w1 = -anchor._x * orig.width;
		var w0 = w1 + orig.width;
		var h1 = -anchor._y * orig.height;
		var h0 = h1 + orig.height;
		vertexData[0] = a * w1 + c * h1 + tx;
		vertexData[1] = d * h1 + b * w1 + ty;
		vertexData[2] = a * w0 + c * h1 + tx;
		vertexData[3] = d * h1 + b * w0 + ty;
		vertexData[4] = a * w0 + c * h0 + tx;
		vertexData[5] = d * h0 + b * w0 + ty;
		vertexData[6] = a * w1 + c * h0 + tx;
		vertexData[7] = d * h0 + b * w1 + ty;
	};
	/**
	*
	* Renders the object using the WebGL renderer
	* @param renderer - The webgl renderer to use.
	*/
	Sprite.prototype._render = function(renderer) {
		this.calculateVertices();
		renderer.batch.setObjectRenderer(renderer.plugins[this.pluginName]);
		renderer.plugins[this.pluginName].render(this);
	};
	/** Updates the bounds of the sprite. */
	Sprite.prototype._calculateBounds = function() {
		var trim = this._texture.trim;
		var orig = this._texture.orig;
		if (!trim || trim.width === orig.width && trim.height === orig.height) {
			this.calculateVertices();
			this._bounds.addQuad(this.vertexData);
		} else {
			this.calculateTrimmedVertices();
			this._bounds.addQuad(this.vertexTrimmedData);
		}
	};
	/**
	* Gets the local bounds of the sprite object.
	* @param rect - Optional output rectangle.
	* @returns The bounds.
	*/
	Sprite.prototype.getLocalBounds = function(rect) {
		if (this.children.length === 0) {
			if (!this._localBounds) this._localBounds = new Bounds();
			this._localBounds.minX = this._texture.orig.width * -this._anchor._x;
			this._localBounds.minY = this._texture.orig.height * -this._anchor._y;
			this._localBounds.maxX = this._texture.orig.width * (1 - this._anchor._x);
			this._localBounds.maxY = this._texture.orig.height * (1 - this._anchor._y);
			if (!rect) {
				if (!this._localBoundsRect) this._localBoundsRect = new Rectangle();
				rect = this._localBoundsRect;
			}
			return this._localBounds.getRectangle(rect);
		}
		return _super.prototype.getLocalBounds.call(this, rect);
	};
	/**
	* Tests if a point is inside this sprite
	* @param point - the point to test
	* @returns The result of the test
	*/
	Sprite.prototype.containsPoint = function(point) {
		this.worldTransform.applyInverse(point, tempPoint$2);
		var width = this._texture.orig.width;
		var height = this._texture.orig.height;
		var x1 = -width * this.anchor.x;
		var y1 = 0;
		if (tempPoint$2.x >= x1 && tempPoint$2.x < x1 + width) {
			y1 = -height * this.anchor.y;
			if (tempPoint$2.y >= y1 && tempPoint$2.y < y1 + height) return true;
		}
		return false;
	};
	/**
	* Destroys this sprite and optionally its texture and children.
	* @param options - Options parameter. A boolean will act as if all options
	*  have been set to that value
	* @param [options.children=false] - if set to true, all the children will have their destroy
	*      method called as well. 'options' will be passed on to those calls.
	* @param [options.texture=false] - Should it destroy the current texture of the sprite as well
	* @param [options.baseTexture=false] - Should it destroy the base texture of the sprite as well
	*/
	Sprite.prototype.destroy = function(options) {
		_super.prototype.destroy.call(this, options);
		this._texture.off("update", this._onTextureUpdate, this);
		this._anchor = null;
		if (typeof options === "boolean" ? options : options && options.texture) {
			var destroyBaseTexture = typeof options === "boolean" ? options : options && options.baseTexture;
			this._texture.destroy(!!destroyBaseTexture);
		}
		this._texture = null;
	};
	/**
	* Helper function that creates a new sprite based on the source you provide.
	* The source can be - frame id, image url, video url, canvas element, video element, base texture
	* @param {string|PIXI.Texture|HTMLCanvasElement|HTMLVideoElement} source - Source to create texture from
	* @param {object} [options] - See {@link PIXI.BaseTexture}'s constructor for options.
	* @returns The newly created sprite
	*/
	Sprite.from = function(source, options) {
		return new Sprite(source instanceof Texture ? source : Texture.from(source, options));
	};
	Object.defineProperty(Sprite.prototype, "roundPixels", {
		get: function() {
			return this._roundPixels;
		},
		/**
		* If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
		*
		* Advantages can include sharper image quality (like text) and faster rendering on canvas.
		* The main disadvantage is movement of objects may appear less smooth.
		*
		* To set the global default, change {@link PIXI.settings.ROUND_PIXELS}.
		* @default false
		*/
		set: function(value) {
			if (this._roundPixels !== value) this._transformID = -1;
			this._roundPixels = value;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Sprite.prototype, "width", {
		/** The width of the sprite, setting this will actually modify the scale to achieve the value set. */
		get: function() {
			return Math.abs(this.scale.x) * this._texture.orig.width;
		},
		set: function(value) {
			var s = sign(this.scale.x) || 1;
			this.scale.x = s * value / this._texture.orig.width;
			this._width = value;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Sprite.prototype, "height", {
		/** The height of the sprite, setting this will actually modify the scale to achieve the value set. */
		get: function() {
			return Math.abs(this.scale.y) * this._texture.orig.height;
		},
		set: function(value) {
			var s = sign(this.scale.y) || 1;
			this.scale.y = s * value / this._texture.orig.height;
			this._height = value;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Sprite.prototype, "anchor", {
		/**
		* The anchor sets the origin point of the sprite. The default value is taken from the {@link PIXI.Texture|Texture}
		* and passed to the constructor.
		*
		* The default is `(0,0)`, this means the sprite's origin is the top left.
		*
		* Setting the anchor to `(0.5,0.5)` means the sprite's origin is centered.
		*
		* Setting the anchor to `(1,1)` would mean the sprite's origin point will be the bottom right corner.
		*
		* If you pass only single parameter, it will set both x and y to the same value as shown in the example below.
		* @example
		* const sprite = new PIXI.Sprite(texture);
		* sprite.anchor.set(0.5); // This will set the origin to center. (0.5) is same as (0.5, 0.5).
		*/
		get: function() {
			return this._anchor;
		},
		set: function(value) {
			this._anchor.copyFrom(value);
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Sprite.prototype, "tint", {
		/**
		* The tint applied to the sprite. This is a hex value.
		*
		* A value of 0xFFFFFF will remove any tint effect.
		* @default 0xFFFFFF
		*/
		get: function() {
			return this._tint;
		},
		set: function(value) {
			this._tint = value;
			this._tintRGB = (value >> 16) + (value & 65280) + ((value & 255) << 16);
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Sprite.prototype, "texture", {
		/** The texture that the sprite is using. */
		get: function() {
			return this._texture;
		},
		set: function(value) {
			if (this._texture === value) return;
			if (this._texture) this._texture.off("update", this._onTextureUpdate, this);
			this._texture = value || Texture.EMPTY;
			this._cachedTint = 16777215;
			this._textureID = -1;
			this._textureTrimmedID = -1;
			if (value) {
				if (value.baseTexture.valid) this._onTextureUpdate();
				else value.once("update", this._onTextureUpdate, this);
			}
		},
		enumerable: false,
		configurable: true
	});
	return Sprite;
}(Container);
//#endregion
//#region node_modules/@pixi/text/dist/esm/text.mjs
/*!
* @pixi/text - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/text is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics$12 = function(d, b) {
	extendStatics$12 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
		d.__proto__ = b;
	} || function(d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	};
	return extendStatics$12(d, b);
};
function __extends$12(d, b) {
	extendStatics$12(d, b);
	function __() {
		this.constructor = d;
	}
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
/**
* Constants that define the type of gradient on text.
* @static
* @constant
* @name TEXT_GRADIENT
* @memberof PIXI
* @type {object}
* @property {number} LINEAR_VERTICAL Vertical gradient
* @property {number} LINEAR_HORIZONTAL Linear gradient
*/
var TEXT_GRADIENT;
(function(TEXT_GRADIENT) {
	TEXT_GRADIENT[TEXT_GRADIENT["LINEAR_VERTICAL"] = 0] = "LINEAR_VERTICAL";
	TEXT_GRADIENT[TEXT_GRADIENT["LINEAR_HORIZONTAL"] = 1] = "LINEAR_HORIZONTAL";
})(TEXT_GRADIENT || (TEXT_GRADIENT = {}));
var defaultStyle = {
	align: "left",
	breakWords: false,
	dropShadow: false,
	dropShadowAlpha: 1,
	dropShadowAngle: Math.PI / 6,
	dropShadowBlur: 0,
	dropShadowColor: "black",
	dropShadowDistance: 5,
	fill: "black",
	fillGradientType: TEXT_GRADIENT.LINEAR_VERTICAL,
	fillGradientStops: [],
	fontFamily: "Arial",
	fontSize: 26,
	fontStyle: "normal",
	fontVariant: "normal",
	fontWeight: "normal",
	letterSpacing: 0,
	lineHeight: 0,
	lineJoin: "miter",
	miterLimit: 10,
	padding: 0,
	stroke: "black",
	strokeThickness: 0,
	textBaseline: "alphabetic",
	trim: false,
	whiteSpace: "pre",
	wordWrap: false,
	wordWrapWidth: 100,
	leading: 0
};
var genericFontFamilies = [
	"serif",
	"sans-serif",
	"monospace",
	"cursive",
	"fantasy",
	"system-ui"
];
/**
* A TextStyle Object contains information to decorate a Text objects.
*
* An instance can be shared between multiple Text objects; then changing the style will update all text objects using it.
*
* A tool can be used to generate a text style [here](https://pixijs.io/pixi-text-style).
*
* @memberof PIXI
*/
var TextStyle = function() {
	/**
	* @param {object} [style] - The style parameters
	* @param {string} [style.align='left'] - Alignment for multiline text ('left', 'center' or 'right'),
	*  does not affect single line text
	* @param {boolean} [style.breakWords=false] - Indicates if lines can be wrapped within words, it
	*  needs wordWrap to be set to true
	* @param {boolean} [style.dropShadow=false] - Set a drop shadow for the text
	* @param {number} [style.dropShadowAlpha=1] - Set alpha for the drop shadow
	* @param {number} [style.dropShadowAngle=Math.PI/6] - Set a angle of the drop shadow
	* @param {number} [style.dropShadowBlur=0] - Set a shadow blur radius
	* @param {string|number} [style.dropShadowColor='black'] - A fill style to be used on the dropshadow e.g 'red', '#00FF00'
	* @param {number} [style.dropShadowDistance=5] - Set a distance of the drop shadow
	* @param {string|string[]|number|number[]|CanvasGradient|CanvasPattern} [style.fill='black'] - A canvas
	*  fillstyle that will be used on the text e.g 'red', '#00FF00'. Can be an array to create a gradient
	*  eg ['#000000','#FFFFFF']
	* {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle|MDN}
	* @param {number} [style.fillGradientType=PIXI.TEXT_GRADIENT.LINEAR_VERTICAL] - If fill is an array of colours
	*  to create a gradient, this can change the type/direction of the gradient. See {@link PIXI.TEXT_GRADIENT}
	* @param {number[]} [style.fillGradientStops] - If fill is an array of colours to create a gradient, this array can set
	* the stop points (numbers between 0 and 1) for the color, overriding the default behaviour of evenly spacing them.
	* @param {string|string[]} [style.fontFamily='Arial'] - The font family
	* @param {number|string} [style.fontSize=26] - The font size (as a number it converts to px, but as a string,
	*  equivalents are '26px','20pt','160%' or '1.6em')
	* @param {string} [style.fontStyle='normal'] - The font style ('normal', 'italic' or 'oblique')
	* @param {string} [style.fontVariant='normal'] - The font variant ('normal' or 'small-caps')
	* @param {string} [style.fontWeight='normal'] - The font weight ('normal', 'bold', 'bolder', 'lighter' and '100',
	*  '200', '300', '400', '500', '600', '700', '800' or '900')
	* @param {number} [style.leading=0] - The space between lines
	* @param {number} [style.letterSpacing=0] - The amount of spacing between letters, default is 0
	* @param {number} [style.lineHeight] - The line height, a number that represents the vertical space that a letter uses
	* @param {string} [style.lineJoin='miter'] - The lineJoin property sets the type of corner created, it can resolve
	*      spiked text issues. Possible values "miter" (creates a sharp corner), "round" (creates a round corner) or "bevel"
	*      (creates a squared corner).
	* @param {number} [style.miterLimit=10] - The miter limit to use when using the 'miter' lineJoin mode. This can reduce
	*      or increase the spikiness of rendered text.
	* @param {number} [style.padding=0] - Occasionally some fonts are cropped. Adding some padding will prevent this from
	*     happening by adding padding to all sides of the text.
	* @param {string|number} [style.stroke='black'] - A canvas fillstyle that will be used on the text stroke
	*  e.g 'blue', '#FCFF00'
	* @param {number} [style.strokeThickness=0] - A number that represents the thickness of the stroke.
	*  Default is 0 (no stroke)
	* @param {boolean} [style.trim=false] - Trim transparent borders
	* @param {string} [style.textBaseline='alphabetic'] - The baseline of the text that is rendered.
	* @param {string} [style.whiteSpace='pre'] - Determines whether newlines & spaces are collapsed or preserved "normal"
	*      (collapse, collapse), "pre" (preserve, preserve) | "pre-line" (preserve, collapse). It needs wordWrap to be set to true
	* @param {boolean} [style.wordWrap=false] - Indicates if word wrap should be used
	* @param {number} [style.wordWrapWidth=100] - The width at which text will wrap, it needs wordWrap to be set to true
	*/
	function TextStyle(style) {
		this.styleID = 0;
		this.reset();
		deepCopyProperties(this, style, style);
	}
	/**
	* Creates a new TextStyle object with the same values as this one.
	* Note that the only the properties of the object are cloned.
	*
	* @return New cloned TextStyle object
	*/
	TextStyle.prototype.clone = function() {
		var clonedProperties = {};
		deepCopyProperties(clonedProperties, this, defaultStyle);
		return new TextStyle(clonedProperties);
	};
	/** Resets all properties to the defaults specified in TextStyle.prototype._default */
	TextStyle.prototype.reset = function() {
		deepCopyProperties(this, defaultStyle, defaultStyle);
	};
	Object.defineProperty(TextStyle.prototype, "align", {
		/**
		* Alignment for multiline text ('left', 'center' or 'right'), does not affect single line text
		*
		* @member {string}
		*/
		get: function() {
			return this._align;
		},
		set: function(align) {
			if (this._align !== align) {
				this._align = align;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextStyle.prototype, "breakWords", {
		/** Indicates if lines can be wrapped within words, it needs wordWrap to be set to true. */
		get: function() {
			return this._breakWords;
		},
		set: function(breakWords) {
			if (this._breakWords !== breakWords) {
				this._breakWords = breakWords;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextStyle.prototype, "dropShadow", {
		/** Set a drop shadow for the text. */
		get: function() {
			return this._dropShadow;
		},
		set: function(dropShadow) {
			if (this._dropShadow !== dropShadow) {
				this._dropShadow = dropShadow;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextStyle.prototype, "dropShadowAlpha", {
		/** Set alpha for the drop shadow. */
		get: function() {
			return this._dropShadowAlpha;
		},
		set: function(dropShadowAlpha) {
			if (this._dropShadowAlpha !== dropShadowAlpha) {
				this._dropShadowAlpha = dropShadowAlpha;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextStyle.prototype, "dropShadowAngle", {
		/** Set a angle of the drop shadow. */
		get: function() {
			return this._dropShadowAngle;
		},
		set: function(dropShadowAngle) {
			if (this._dropShadowAngle !== dropShadowAngle) {
				this._dropShadowAngle = dropShadowAngle;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextStyle.prototype, "dropShadowBlur", {
		/** Set a shadow blur radius. */
		get: function() {
			return this._dropShadowBlur;
		},
		set: function(dropShadowBlur) {
			if (this._dropShadowBlur !== dropShadowBlur) {
				this._dropShadowBlur = dropShadowBlur;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextStyle.prototype, "dropShadowColor", {
		/** A fill style to be used on the dropshadow e.g 'red', '#00FF00'. */
		get: function() {
			return this._dropShadowColor;
		},
		set: function(dropShadowColor) {
			var outputColor = getColor(dropShadowColor);
			if (this._dropShadowColor !== outputColor) {
				this._dropShadowColor = outputColor;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextStyle.prototype, "dropShadowDistance", {
		/** Set a distance of the drop shadow. */
		get: function() {
			return this._dropShadowDistance;
		},
		set: function(dropShadowDistance) {
			if (this._dropShadowDistance !== dropShadowDistance) {
				this._dropShadowDistance = dropShadowDistance;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextStyle.prototype, "fill", {
		/**
		* A canvas fillstyle that will be used on the text e.g 'red', '#00FF00'.
		*
		* Can be an array to create a gradient eg ['#000000','#FFFFFF']
		* {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle|MDN}
		*
		* @member {string|string[]|number|number[]|CanvasGradient|CanvasPattern}
		*/
		get: function() {
			return this._fill;
		},
		set: function(fill) {
			var outputColor = getColor(fill);
			if (this._fill !== outputColor) {
				this._fill = outputColor;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextStyle.prototype, "fillGradientType", {
		/**
		* If fill is an array of colours to create a gradient, this can change the type/direction of the gradient.
		*
		* @see PIXI.TEXT_GRADIENT
		*/
		get: function() {
			return this._fillGradientType;
		},
		set: function(fillGradientType) {
			if (this._fillGradientType !== fillGradientType) {
				this._fillGradientType = fillGradientType;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextStyle.prototype, "fillGradientStops", {
		/**
		* If fill is an array of colours to create a gradient, this array can set the stop points
		* (numbers between 0 and 1) for the color, overriding the default behaviour of evenly spacing them.
		*/
		get: function() {
			return this._fillGradientStops;
		},
		set: function(fillGradientStops) {
			if (!areArraysEqual(this._fillGradientStops, fillGradientStops)) {
				this._fillGradientStops = fillGradientStops;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextStyle.prototype, "fontFamily", {
		/** The font family. */
		get: function() {
			return this._fontFamily;
		},
		set: function(fontFamily) {
			if (this.fontFamily !== fontFamily) {
				this._fontFamily = fontFamily;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextStyle.prototype, "fontSize", {
		/**
		* The font size
		* (as a number it converts to px, but as a string, equivalents are '26px','20pt','160%' or '1.6em')
		*/
		get: function() {
			return this._fontSize;
		},
		set: function(fontSize) {
			if (this._fontSize !== fontSize) {
				this._fontSize = fontSize;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextStyle.prototype, "fontStyle", {
		/**
		* The font style
		* ('normal', 'italic' or 'oblique')
		*
		* @member {string}
		*/
		get: function() {
			return this._fontStyle;
		},
		set: function(fontStyle) {
			if (this._fontStyle !== fontStyle) {
				this._fontStyle = fontStyle;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextStyle.prototype, "fontVariant", {
		/**
		* The font variant
		* ('normal' or 'small-caps')
		*
		* @member {string}
		*/
		get: function() {
			return this._fontVariant;
		},
		set: function(fontVariant) {
			if (this._fontVariant !== fontVariant) {
				this._fontVariant = fontVariant;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextStyle.prototype, "fontWeight", {
		/**
		* The font weight
		* ('normal', 'bold', 'bolder', 'lighter' and '100', '200', '300', '400', '500', '600', '700', 800' or '900')
		*
		* @member {string}
		*/
		get: function() {
			return this._fontWeight;
		},
		set: function(fontWeight) {
			if (this._fontWeight !== fontWeight) {
				this._fontWeight = fontWeight;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextStyle.prototype, "letterSpacing", {
		/** The amount of spacing between letters, default is 0. */
		get: function() {
			return this._letterSpacing;
		},
		set: function(letterSpacing) {
			if (this._letterSpacing !== letterSpacing) {
				this._letterSpacing = letterSpacing;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextStyle.prototype, "lineHeight", {
		/** The line height, a number that represents the vertical space that a letter uses. */
		get: function() {
			return this._lineHeight;
		},
		set: function(lineHeight) {
			if (this._lineHeight !== lineHeight) {
				this._lineHeight = lineHeight;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextStyle.prototype, "leading", {
		/** The space between lines. */
		get: function() {
			return this._leading;
		},
		set: function(leading) {
			if (this._leading !== leading) {
				this._leading = leading;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextStyle.prototype, "lineJoin", {
		/**
		* The lineJoin property sets the type of corner created, it can resolve spiked text issues.
		* Default is 'miter' (creates a sharp corner).
		*
		* @member {string}
		*/
		get: function() {
			return this._lineJoin;
		},
		set: function(lineJoin) {
			if (this._lineJoin !== lineJoin) {
				this._lineJoin = lineJoin;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextStyle.prototype, "miterLimit", {
		/**
		* The miter limit to use when using the 'miter' lineJoin mode.
		*
		* This can reduce or increase the spikiness of rendered text.
		*/
		get: function() {
			return this._miterLimit;
		},
		set: function(miterLimit) {
			if (this._miterLimit !== miterLimit) {
				this._miterLimit = miterLimit;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextStyle.prototype, "padding", {
		/**
		* Occasionally some fonts are cropped. Adding some padding will prevent this from happening
		* by adding padding to all sides of the text.
		*/
		get: function() {
			return this._padding;
		},
		set: function(padding) {
			if (this._padding !== padding) {
				this._padding = padding;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextStyle.prototype, "stroke", {
		/**
		* A canvas fillstyle that will be used on the text stroke
		* e.g 'blue', '#FCFF00'
		*/
		get: function() {
			return this._stroke;
		},
		set: function(stroke) {
			var outputColor = getColor(stroke);
			if (this._stroke !== outputColor) {
				this._stroke = outputColor;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextStyle.prototype, "strokeThickness", {
		/**
		* A number that represents the thickness of the stroke.
		*
		* @default 0
		*/
		get: function() {
			return this._strokeThickness;
		},
		set: function(strokeThickness) {
			if (this._strokeThickness !== strokeThickness) {
				this._strokeThickness = strokeThickness;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextStyle.prototype, "textBaseline", {
		/**
		* The baseline of the text that is rendered.
		*
		* @member {string}
		*/
		get: function() {
			return this._textBaseline;
		},
		set: function(textBaseline) {
			if (this._textBaseline !== textBaseline) {
				this._textBaseline = textBaseline;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextStyle.prototype, "trim", {
		/** Trim transparent borders. */
		get: function() {
			return this._trim;
		},
		set: function(trim) {
			if (this._trim !== trim) {
				this._trim = trim;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextStyle.prototype, "whiteSpace", {
		/**
		* How newlines and spaces should be handled.
		* Default is 'pre' (preserve, preserve).
		*
		*  value       | New lines     |   Spaces
		*  ---         | ---           |   ---
		* 'normal'     | Collapse      |   Collapse
		* 'pre'        | Preserve      |   Preserve
		* 'pre-line'   | Preserve      |   Collapse
		*
		* @member {string}
		*/
		get: function() {
			return this._whiteSpace;
		},
		set: function(whiteSpace) {
			if (this._whiteSpace !== whiteSpace) {
				this._whiteSpace = whiteSpace;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextStyle.prototype, "wordWrap", {
		/** Indicates if word wrap should be used. */
		get: function() {
			return this._wordWrap;
		},
		set: function(wordWrap) {
			if (this._wordWrap !== wordWrap) {
				this._wordWrap = wordWrap;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextStyle.prototype, "wordWrapWidth", {
		/** The width at which text will wrap, it needs wordWrap to be set to true. */
		get: function() {
			return this._wordWrapWidth;
		},
		set: function(wordWrapWidth) {
			if (this._wordWrapWidth !== wordWrapWidth) {
				this._wordWrapWidth = wordWrapWidth;
				this.styleID++;
			}
		},
		enumerable: false,
		configurable: true
	});
	/**
	* Generates a font style string to use for `TextMetrics.measureFont()`.
	*
	* @return Font style string, for passing to `TextMetrics.measureFont()`
	*/
	TextStyle.prototype.toFontString = function() {
		var fontSizeString = typeof this.fontSize === "number" ? this.fontSize + "px" : this.fontSize;
		var fontFamilies = this.fontFamily;
		if (!Array.isArray(this.fontFamily)) fontFamilies = this.fontFamily.split(",");
		for (var i = fontFamilies.length - 1; i >= 0; i--) {
			var fontFamily = fontFamilies[i].trim();
			if (!/([\"\'])[^\'\"]+\1/.test(fontFamily) && genericFontFamilies.indexOf(fontFamily) < 0) fontFamily = "\"" + fontFamily + "\"";
			fontFamilies[i] = fontFamily;
		}
		return this.fontStyle + " " + this.fontVariant + " " + this.fontWeight + " " + fontSizeString + " " + fontFamilies.join(",");
	};
	return TextStyle;
}();
/**
* Utility function to convert hexadecimal colors to strings, and simply return the color if it's a string.
* @private
* @param color
* @return The color as a string.
*/
function getSingleColor(color) {
	if (typeof color === "number") return hex2string(color);
	else if (typeof color === "string") {
		if (color.indexOf("0x") === 0) color = color.replace("0x", "#");
	}
	return color;
}
function getColor(color) {
	if (!Array.isArray(color)) return getSingleColor(color);
	else {
		for (var i = 0; i < color.length; ++i) color[i] = getSingleColor(color[i]);
		return color;
	}
}
/**
* Utility function to convert hexadecimal colors to strings, and simply return the color if it's a string.
* This version can also convert array of colors
* @private
* @param array1 - First array to compare
* @param array2 - Second array to compare
* @return Do the arrays contain the same values in the same order
*/
function areArraysEqual(array1, array2) {
	if (!Array.isArray(array1) || !Array.isArray(array2)) return false;
	if (array1.length !== array2.length) return false;
	for (var i = 0; i < array1.length; ++i) if (array1[i] !== array2[i]) return false;
	return true;
}
/**
* Utility function to ensure that object properties are copied by value, and not by reference
* @private
* @param target - Target object to copy properties into
* @param source - Source object for the properties to copy
* @param propertyObj - Object containing properties names we want to loop over
*/
function deepCopyProperties(target, source, propertyObj) {
	for (var prop in propertyObj) if (Array.isArray(source[prop])) target[prop] = source[prop].slice();
	else target[prop] = source[prop];
}
var contextSettings = { willReadFrequently: true };
/**
* The TextMetrics object represents the measurement of a block of text with a specified style.
*
* ```js
* let style = new PIXI.TextStyle({fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'})
* let textMetrics = PIXI.TextMetrics.measureText('Your text', style)
* ```
* @memberof PIXI
*/
var TextMetrics = function() {
	/**
	* @param text - the text that was measured
	* @param style - the style that was measured
	* @param width - the measured width of the text
	* @param height - the measured height of the text
	* @param lines - an array of the lines of text broken by new lines and wrapping if specified in style
	* @param lineWidths - an array of the line widths for each line matched to `lines`
	* @param lineHeight - the measured line height for this style
	* @param maxLineWidth - the maximum line width for all measured lines
	* @param {PIXI.IFontMetrics} fontProperties - the font properties object from TextMetrics.measureFont
	*/
	function TextMetrics(text, style, width, height, lines, lineWidths, lineHeight, maxLineWidth, fontProperties) {
		this.text = text;
		this.style = style;
		this.width = width;
		this.height = height;
		this.lines = lines;
		this.lineWidths = lineWidths;
		this.lineHeight = lineHeight;
		this.maxLineWidth = maxLineWidth;
		this.fontProperties = fontProperties;
	}
	/**
	* Measures the supplied string of text and returns a Rectangle.
	* @param text - The text to measure.
	* @param style - The text style to use for measuring
	* @param wordWrap - Override for if word-wrap should be applied to the text.
	* @param canvas - optional specification of the canvas to use for measuring.
	* @returns Measured width and height of the text.
	*/
	TextMetrics.measureText = function(text, style, wordWrap, canvas) {
		if (canvas === void 0) canvas = TextMetrics._canvas;
		wordWrap = wordWrap === void 0 || wordWrap === null ? style.wordWrap : wordWrap;
		var font = style.toFontString();
		var fontProperties = TextMetrics.measureFont(font);
		if (fontProperties.fontSize === 0) {
			fontProperties.fontSize = style.fontSize;
			fontProperties.ascent = style.fontSize;
		}
		var context = canvas.getContext("2d", contextSettings);
		context.font = font;
		var lines = (wordWrap ? TextMetrics.wordWrap(text, style, canvas) : text).split(/(?:\r\n|\r|\n)/);
		var lineWidths = new Array(lines.length);
		var maxLineWidth = 0;
		for (var i = 0; i < lines.length; i++) {
			var lineWidth = context.measureText(lines[i]).width + (lines[i].length - 1) * style.letterSpacing;
			lineWidths[i] = lineWidth;
			maxLineWidth = Math.max(maxLineWidth, lineWidth);
		}
		var width = maxLineWidth + style.strokeThickness;
		if (style.dropShadow) width += style.dropShadowDistance;
		var lineHeight = style.lineHeight || fontProperties.fontSize + style.strokeThickness;
		var height = Math.max(lineHeight, fontProperties.fontSize + style.strokeThickness) + (lines.length - 1) * (lineHeight + style.leading);
		if (style.dropShadow) height += style.dropShadowDistance;
		return new TextMetrics(text, style, width, height, lines, lineWidths, lineHeight + style.leading, maxLineWidth, fontProperties);
	};
	/**
	* Applies newlines to a string to have it optimally fit into the horizontal
	* bounds set by the Text object's wordWrapWidth property.
	* @param text - String to apply word wrapping to
	* @param style - the style to use when wrapping
	* @param canvas - optional specification of the canvas to use for measuring.
	* @returns New string with new lines applied where required
	*/
	TextMetrics.wordWrap = function(text, style, canvas) {
		if (canvas === void 0) canvas = TextMetrics._canvas;
		var context = canvas.getContext("2d", contextSettings);
		var width = 0;
		var line = "";
		var lines = "";
		var cache = Object.create(null);
		var letterSpacing = style.letterSpacing, whiteSpace = style.whiteSpace;
		var collapseSpaces = TextMetrics.collapseSpaces(whiteSpace);
		var collapseNewlines = TextMetrics.collapseNewlines(whiteSpace);
		var canPrependSpaces = !collapseSpaces;
		var wordWrapWidth = style.wordWrapWidth + letterSpacing;
		var tokens = TextMetrics.tokenize(text);
		for (var i = 0; i < tokens.length; i++) {
			var token = tokens[i];
			if (TextMetrics.isNewline(token)) {
				if (!collapseNewlines) {
					lines += TextMetrics.addLine(line);
					canPrependSpaces = !collapseSpaces;
					line = "";
					width = 0;
					continue;
				}
				token = " ";
			}
			if (collapseSpaces) {
				var currIsBreakingSpace = TextMetrics.isBreakingSpace(token);
				var lastIsBreakingSpace = TextMetrics.isBreakingSpace(line[line.length - 1]);
				if (currIsBreakingSpace && lastIsBreakingSpace) continue;
			}
			var tokenWidth = TextMetrics.getFromCache(token, letterSpacing, cache, context);
			if (tokenWidth > wordWrapWidth) {
				if (line !== "") {
					lines += TextMetrics.addLine(line);
					line = "";
					width = 0;
				}
				if (TextMetrics.canBreakWords(token, style.breakWords)) {
					var characters = TextMetrics.wordWrapSplit(token);
					for (var j = 0; j < characters.length; j++) {
						var char = characters[j];
						var k = 1;
						while (characters[j + k]) {
							var nextChar = characters[j + k];
							var lastChar = char[char.length - 1];
							if (!TextMetrics.canBreakChars(lastChar, nextChar, token, j, style.breakWords)) char += nextChar;
							else break;
							k++;
						}
						j += char.length - 1;
						var characterWidth = TextMetrics.getFromCache(char, letterSpacing, cache, context);
						if (characterWidth + width > wordWrapWidth) {
							lines += TextMetrics.addLine(line);
							canPrependSpaces = false;
							line = "";
							width = 0;
						}
						line += char;
						width += characterWidth;
					}
				} else {
					if (line.length > 0) {
						lines += TextMetrics.addLine(line);
						line = "";
						width = 0;
					}
					var isLastToken = i === tokens.length - 1;
					lines += TextMetrics.addLine(token, !isLastToken);
					canPrependSpaces = false;
					line = "";
					width = 0;
				}
			} else {
				if (tokenWidth + width > wordWrapWidth) {
					canPrependSpaces = false;
					lines += TextMetrics.addLine(line);
					line = "";
					width = 0;
				}
				if (line.length > 0 || !TextMetrics.isBreakingSpace(token) || canPrependSpaces) {
					line += token;
					width += tokenWidth;
				}
			}
		}
		lines += TextMetrics.addLine(line, false);
		return lines;
	};
	/**
	* Convienience function for logging each line added during the wordWrap method.
	* @param line    - The line of text to add
	* @param newLine - Add new line character to end
	* @returns A formatted line
	*/
	TextMetrics.addLine = function(line, newLine) {
		if (newLine === void 0) newLine = true;
		line = TextMetrics.trimRight(line);
		line = newLine ? line + "\n" : line;
		return line;
	};
	/**
	* Gets & sets the widths of calculated characters in a cache object
	* @param key            - The key
	* @param letterSpacing  - The letter spacing
	* @param cache          - The cache
	* @param context        - The canvas context
	* @returns The from cache.
	*/
	TextMetrics.getFromCache = function(key, letterSpacing, cache, context) {
		var width = cache[key];
		if (typeof width !== "number") {
			var spacing = key.length * letterSpacing;
			width = context.measureText(key).width + spacing;
			cache[key] = width;
		}
		return width;
	};
	/**
	* Determines whether we should collapse breaking spaces.
	* @param whiteSpace - The TextStyle property whiteSpace
	* @returns Should collapse
	*/
	TextMetrics.collapseSpaces = function(whiteSpace) {
		return whiteSpace === "normal" || whiteSpace === "pre-line";
	};
	/**
	* Determines whether we should collapse newLine chars.
	* @param whiteSpace - The white space
	* @returns  should collapse
	*/
	TextMetrics.collapseNewlines = function(whiteSpace) {
		return whiteSpace === "normal";
	};
	/**
	* Trims breaking whitespaces from string.
	* @param  text - The text
	* @returns Trimmed string
	*/
	TextMetrics.trimRight = function(text) {
		if (typeof text !== "string") return "";
		for (var i = text.length - 1; i >= 0; i--) {
			var char = text[i];
			if (!TextMetrics.isBreakingSpace(char)) break;
			text = text.slice(0, -1);
		}
		return text;
	};
	/**
	* Determines if char is a newline.
	* @param  char - The character
	* @returns True if newline, False otherwise.
	*/
	TextMetrics.isNewline = function(char) {
		if (typeof char !== "string") return false;
		return TextMetrics._newlines.indexOf(char.charCodeAt(0)) >= 0;
	};
	/**
	* Determines if char is a breaking whitespace.
	*
	* It allows one to determine whether char should be a breaking whitespace
	* For example certain characters in CJK langs or numbers.
	* It must return a boolean.
	* @param char - The character
	* @param [_nextChar] - The next character
	* @returns True if whitespace, False otherwise.
	*/
	TextMetrics.isBreakingSpace = function(char, _nextChar) {
		if (typeof char !== "string") return false;
		return TextMetrics._breakingSpaces.indexOf(char.charCodeAt(0)) >= 0;
	};
	/**
	* Splits a string into words, breaking-spaces and newLine characters
	* @param  text - The text
	* @returns  A tokenized array
	*/
	TextMetrics.tokenize = function(text) {
		var tokens = [];
		var token = "";
		if (typeof text !== "string") return tokens;
		for (var i = 0; i < text.length; i++) {
			var char = text[i];
			var nextChar = text[i + 1];
			if (TextMetrics.isBreakingSpace(char, nextChar) || TextMetrics.isNewline(char)) {
				if (token !== "") {
					tokens.push(token);
					token = "";
				}
				tokens.push(char);
				continue;
			}
			token += char;
		}
		if (token !== "") tokens.push(token);
		return tokens;
	};
	/**
	* Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
	*
	* It allows one to customise which words should break
	* Examples are if the token is CJK or numbers.
	* It must return a boolean.
	* @param _token - The token
	* @param  breakWords - The style attr break words
	* @returns Whether to break word or not
	*/
	TextMetrics.canBreakWords = function(_token, breakWords) {
		return breakWords;
	};
	/**
	* Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
	*
	* It allows one to determine whether a pair of characters
	* should be broken by newlines
	* For example certain characters in CJK langs or numbers.
	* It must return a boolean.
	* @param _char - The character
	* @param _nextChar - The next character
	* @param _token - The token/word the characters are from
	* @param _index - The index in the token of the char
	* @param _breakWords - The style attr break words
	* @returns whether to break word or not
	*/
	TextMetrics.canBreakChars = function(_char, _nextChar, _token, _index, _breakWords) {
		return true;
	};
	/**
	* Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
	*
	* It is called when a token (usually a word) has to be split into separate pieces
	* in order to determine the point to break a word.
	* It must return an array of characters.
	* @example
	* // Correctly splits emojis, eg "🤪🤪" will result in two element array, each with one emoji.
	* TextMetrics.wordWrapSplit = (token) => [...token];
	* @param  token - The token to split
	* @returns The characters of the token
	*/
	TextMetrics.wordWrapSplit = function(token) {
		return token.split("");
	};
	/**
	* Calculates the ascent, descent and fontSize of a given font-style
	* @param font - String representing the style of the font
	* @returns Font properties object
	*/
	TextMetrics.measureFont = function(font) {
		if (TextMetrics._fonts[font]) return TextMetrics._fonts[font];
		var properties = {
			ascent: 0,
			descent: 0,
			fontSize: 0
		};
		var canvas = TextMetrics._canvas;
		var context = TextMetrics._context;
		context.font = font;
		var metricsString = TextMetrics.METRICS_STRING + TextMetrics.BASELINE_SYMBOL;
		var width = Math.ceil(context.measureText(metricsString).width);
		var baseline = Math.ceil(context.measureText(TextMetrics.BASELINE_SYMBOL).width);
		var height = Math.ceil(TextMetrics.HEIGHT_MULTIPLIER * baseline);
		baseline = baseline * TextMetrics.BASELINE_MULTIPLIER | 0;
		canvas.width = width;
		canvas.height = height;
		context.fillStyle = "#f00";
		context.fillRect(0, 0, width, height);
		context.font = font;
		context.textBaseline = "alphabetic";
		context.fillStyle = "#000";
		context.fillText(metricsString, 0, baseline);
		var imagedata = context.getImageData(0, 0, width, height).data;
		var pixels = imagedata.length;
		var line = width * 4;
		var i = 0;
		var idx = 0;
		var stop = false;
		for (i = 0; i < baseline; ++i) {
			for (var j = 0; j < line; j += 4) if (imagedata[idx + j] !== 255) {
				stop = true;
				break;
			}
			if (!stop) idx += line;
			else break;
		}
		properties.ascent = baseline - i;
		idx = pixels - line;
		stop = false;
		for (i = height; i > baseline; --i) {
			for (var j = 0; j < line; j += 4) if (imagedata[idx + j] !== 255) {
				stop = true;
				break;
			}
			if (!stop) idx -= line;
			else break;
		}
		properties.descent = i - baseline;
		properties.fontSize = properties.ascent + properties.descent;
		TextMetrics._fonts[font] = properties;
		return properties;
	};
	/**
	* Clear font metrics in metrics cache.
	* @param {string} [font] - font name. If font name not set then clear cache for all fonts.
	*/
	TextMetrics.clearMetrics = function(font) {
		if (font === void 0) font = "";
		if (font) delete TextMetrics._fonts[font];
		else TextMetrics._fonts = {};
	};
	Object.defineProperty(TextMetrics, "_canvas", {
		/**
		* Cached canvas element for measuring text
		* TODO: this should be private, but isn't because of backward compat, will fix later.
		* @ignore
		*/
		get: function() {
			if (!TextMetrics.__canvas) {
				var canvas = void 0;
				try {
					var c = new OffscreenCanvas(0, 0);
					var context = c.getContext("2d", contextSettings);
					if (context && context.measureText) {
						TextMetrics.__canvas = c;
						return c;
					}
					canvas = settings.ADAPTER.createCanvas();
				} catch (ex) {
					canvas = settings.ADAPTER.createCanvas();
				}
				canvas.width = canvas.height = 10;
				TextMetrics.__canvas = canvas;
			}
			return TextMetrics.__canvas;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TextMetrics, "_context", {
		/**
		* TODO: this should be private, but isn't because of backward compat, will fix later.
		* @ignore
		*/
		get: function() {
			if (!TextMetrics.__context) TextMetrics.__context = TextMetrics._canvas.getContext("2d", contextSettings);
			return TextMetrics.__context;
		},
		enumerable: false,
		configurable: true
	});
	return TextMetrics;
}();
/**
* Internal return object for {@link PIXI.TextMetrics.measureFont `TextMetrics.measureFont`}.
* @typedef {object} FontMetrics
* @property {number} ascent - The ascent distance
* @property {number} descent - The descent distance
* @property {number} fontSize - Font size from ascent to descent
* @memberof PIXI.TextMetrics
* @private
*/
/**
* Cache of {@see PIXI.TextMetrics.FontMetrics} objects.
* @memberof PIXI.TextMetrics
* @type {object}
* @private
*/
TextMetrics._fonts = {};
/**
* String used for calculate font metrics.
* These characters are all tall to help calculate the height required for text.
* @static
* @memberof PIXI.TextMetrics
* @name METRICS_STRING
* @type {string}
* @default |ÉqÅ
*/
TextMetrics.METRICS_STRING = "|ÉqÅ";
/**
* Baseline symbol for calculate font metrics.
* @static
* @memberof PIXI.TextMetrics
* @name BASELINE_SYMBOL
* @type {string}
* @default M
*/
TextMetrics.BASELINE_SYMBOL = "M";
/**
* Baseline multiplier for calculate font metrics.
* @static
* @memberof PIXI.TextMetrics
* @name BASELINE_MULTIPLIER
* @type {number}
* @default 1.4
*/
TextMetrics.BASELINE_MULTIPLIER = 1.4;
/**
* Height multiplier for setting height of canvas to calculate font metrics.
* @static
* @memberof PIXI.TextMetrics
* @name HEIGHT_MULTIPLIER
* @type {number}
* @default 2.00
*/
TextMetrics.HEIGHT_MULTIPLIER = 2;
/**
* Cache of new line chars.
* @memberof PIXI.TextMetrics
* @type {number[]}
* @private
*/
TextMetrics._newlines = [10, 13];
/**
* Cache of breaking spaces.
* @memberof PIXI.TextMetrics
* @type {number[]}
* @private
*/
TextMetrics._breakingSpaces = [
	9,
	32,
	8192,
	8193,
	8194,
	8195,
	8196,
	8197,
	8198,
	8200,
	8201,
	8202,
	8287,
	12288
];
/**
* A number, or a string containing a number.
* @memberof PIXI
* @typedef {object} IFontMetrics
* @property {number} ascent - Font ascent
* @property {number} descent - Font descent
* @property {number} fontSize - Font size
*/
var defaultDestroyOptions = {
	texture: true,
	children: false,
	baseTexture: true
};
/**
* A Text Object will create a line or multiple lines of text.
*
* The text is created using the [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API).
*
* The primary advantage of this class over BitmapText is that you have great control over the style of the text,
* which you can change at runtime.
*
* The primary disadvantages is that each piece of text has it's own texture, which can use more memory.
* When text changes, this texture has to be re-generated and re-uploaded to the GPU, taking up time.
*
* To split a line you can use '\n' in your text string, or, on the `style` object,
* change its `wordWrap` property to true and and give the `wordWrapWidth` property a value.
*
* A Text can be created directly from a string and a style object,
* which can be generated [here](https://pixijs.io/pixi-text-style).
*
* ```js
* let text = new PIXI.Text('This is a PixiJS text',{fontFamily : 'Arial', fontSize: 24, fill : 0xff1010, align : 'center'});
* ```
* @memberof PIXI
*/
var Text = function(_super) {
	__extends$12(Text, _super);
	/**
	* @param text - The string that you would like the text to display
	* @param {object|PIXI.TextStyle} [style] - The style parameters
	* @param canvas - The canvas element for drawing text
	*/
	function Text(text, style, canvas) {
		var _this = this;
		var ownCanvas = false;
		if (!canvas) {
			canvas = settings.ADAPTER.createCanvas();
			ownCanvas = true;
		}
		canvas.width = 3;
		canvas.height = 3;
		var texture = Texture.from(canvas);
		texture.orig = new Rectangle();
		texture.trim = new Rectangle();
		_this = _super.call(this, texture) || this;
		_this._ownCanvas = ownCanvas;
		_this.canvas = canvas;
		_this.context = canvas.getContext("2d", { willReadFrequently: true });
		_this._resolution = settings.RESOLUTION;
		_this._autoResolution = true;
		_this._text = null;
		_this._style = null;
		_this._styleListener = null;
		_this._font = "";
		_this.text = text;
		_this.style = style;
		_this.localStyleID = -1;
		return _this;
	}
	/**
	* Renders text to its canvas, and updates its texture.
	*
	* By default this is used internally to ensure the texture is correct before rendering,
	* but it can be used called externally, for example from this class to 'pre-generate' the texture from a piece of text,
	* and then shared across multiple Sprites.
	* @param respectDirty - Whether to abort updating the text if the Text isn't dirty and the function is called.
	*/
	Text.prototype.updateText = function(respectDirty) {
		var style = this._style;
		if (this.localStyleID !== style.styleID) {
			this.dirty = true;
			this.localStyleID = style.styleID;
		}
		if (!this.dirty && respectDirty) return;
		this._font = this._style.toFontString();
		var context = this.context;
		var measured = TextMetrics.measureText(this._text || " ", this._style, this._style.wordWrap, this.canvas);
		var width = measured.width;
		var height = measured.height;
		var lines = measured.lines;
		var lineHeight = measured.lineHeight;
		var lineWidths = measured.lineWidths;
		var maxLineWidth = measured.maxLineWidth;
		var fontProperties = measured.fontProperties;
		this.canvas.width = Math.ceil(Math.ceil(Math.max(1, width) + style.padding * 2) * this._resolution);
		this.canvas.height = Math.ceil(Math.ceil(Math.max(1, height) + style.padding * 2) * this._resolution);
		context.scale(this._resolution, this._resolution);
		context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		context.font = this._font;
		context.lineWidth = style.strokeThickness;
		context.textBaseline = style.textBaseline;
		context.lineJoin = style.lineJoin;
		context.miterLimit = style.miterLimit;
		var linePositionX;
		var linePositionY;
		var passesCount = style.dropShadow ? 2 : 1;
		for (var i = 0; i < passesCount; ++i) {
			var isShadowPass = style.dropShadow && i === 0;
			var dsOffsetText = isShadowPass ? Math.ceil(Math.max(1, height) + style.padding * 2) : 0;
			var dsOffsetShadow = dsOffsetText * this._resolution;
			if (isShadowPass) {
				context.fillStyle = "black";
				context.strokeStyle = "black";
				var dropShadowColor = style.dropShadowColor;
				var rgb = hex2rgb(typeof dropShadowColor === "number" ? dropShadowColor : string2hex(dropShadowColor));
				var dropShadowBlur = style.dropShadowBlur * this._resolution;
				var dropShadowDistance = style.dropShadowDistance * this._resolution;
				context.shadowColor = "rgba(" + rgb[0] * 255 + "," + rgb[1] * 255 + "," + rgb[2] * 255 + "," + style.dropShadowAlpha + ")";
				context.shadowBlur = dropShadowBlur;
				context.shadowOffsetX = Math.cos(style.dropShadowAngle) * dropShadowDistance;
				context.shadowOffsetY = Math.sin(style.dropShadowAngle) * dropShadowDistance + dsOffsetShadow;
			} else {
				context.fillStyle = this._generateFillStyle(style, lines, measured);
				context.strokeStyle = style.stroke;
				context.shadowColor = "black";
				context.shadowBlur = 0;
				context.shadowOffsetX = 0;
				context.shadowOffsetY = 0;
			}
			var linePositionYShift = (lineHeight - fontProperties.fontSize) / 2;
			if (!Text.nextLineHeightBehavior || lineHeight - fontProperties.fontSize < 0) linePositionYShift = 0;
			for (var i_1 = 0; i_1 < lines.length; i_1++) {
				linePositionX = style.strokeThickness / 2;
				linePositionY = style.strokeThickness / 2 + i_1 * lineHeight + fontProperties.ascent + linePositionYShift;
				if (style.align === "right") linePositionX += maxLineWidth - lineWidths[i_1];
				else if (style.align === "center") linePositionX += (maxLineWidth - lineWidths[i_1]) / 2;
				if (style.stroke && style.strokeThickness) this.drawLetterSpacing(lines[i_1], linePositionX + style.padding, linePositionY + style.padding - dsOffsetText, true);
				if (style.fill) this.drawLetterSpacing(lines[i_1], linePositionX + style.padding, linePositionY + style.padding - dsOffsetText);
			}
		}
		this.updateTexture();
	};
	/**
	* Render the text with letter-spacing.
	* @param text - The text to draw
	* @param x - Horizontal position to draw the text
	* @param y - Vertical position to draw the text
	* @param isStroke - Is this drawing for the outside stroke of the
	*  text? If not, it's for the inside fill
	*/
	Text.prototype.drawLetterSpacing = function(text, x, y, isStroke) {
		if (isStroke === void 0) isStroke = false;
		var letterSpacing = this._style.letterSpacing;
		var supportLetterSpacing = Text.experimentalLetterSpacing && ("letterSpacing" in CanvasRenderingContext2D.prototype || "textLetterSpacing" in CanvasRenderingContext2D.prototype);
		if (letterSpacing === 0 || supportLetterSpacing) {
			if (supportLetterSpacing) {
				this.context.letterSpacing = letterSpacing;
				this.context.textLetterSpacing = letterSpacing;
			}
			if (isStroke) this.context.strokeText(text, x, y);
			else this.context.fillText(text, x, y);
			return;
		}
		var currentPosition = x;
		var stringArray = Array.from ? Array.from(text) : text.split("");
		var previousWidth = this.context.measureText(text).width;
		var currentWidth = 0;
		for (var i = 0; i < stringArray.length; ++i) {
			var currentChar = stringArray[i];
			if (isStroke) this.context.strokeText(currentChar, currentPosition, y);
			else this.context.fillText(currentChar, currentPosition, y);
			var textStr = "";
			for (var j = i + 1; j < stringArray.length; ++j) textStr += stringArray[j];
			currentWidth = this.context.measureText(textStr).width;
			currentPosition += previousWidth - currentWidth + letterSpacing;
			previousWidth = currentWidth;
		}
	};
	/** Updates texture size based on canvas size. */
	Text.prototype.updateTexture = function() {
		var canvas = this.canvas;
		if (this._style.trim) {
			var trimmed = trimCanvas(canvas);
			if (trimmed.data) {
				canvas.width = trimmed.width;
				canvas.height = trimmed.height;
				this.context.putImageData(trimmed.data, 0, 0);
			}
		}
		var texture = this._texture;
		var style = this._style;
		var padding = style.trim ? 0 : style.padding;
		var baseTexture = texture.baseTexture;
		texture.trim.width = texture._frame.width = canvas.width / this._resolution;
		texture.trim.height = texture._frame.height = canvas.height / this._resolution;
		texture.trim.x = -padding;
		texture.trim.y = -padding;
		texture.orig.width = texture._frame.width - padding * 2;
		texture.orig.height = texture._frame.height - padding * 2;
		this._onTextureUpdate();
		baseTexture.setRealSize(canvas.width, canvas.height, this._resolution);
		texture.updateUvs();
		this.dirty = false;
	};
	/**
	* Renders the object using the WebGL renderer
	* @param renderer - The renderer
	*/
	Text.prototype._render = function(renderer) {
		if (this._autoResolution && this._resolution !== renderer.resolution) {
			this._resolution = renderer.resolution;
			this.dirty = true;
		}
		this.updateText(true);
		_super.prototype._render.call(this, renderer);
	};
	/** Updates the transform on all children of this container for rendering. */
	Text.prototype.updateTransform = function() {
		this.updateText(true);
		_super.prototype.updateTransform.call(this);
	};
	Text.prototype.getBounds = function(skipUpdate, rect) {
		this.updateText(true);
		if (this._textureID === -1) skipUpdate = false;
		return _super.prototype.getBounds.call(this, skipUpdate, rect);
	};
	/**
	* Gets the local bounds of the text object.
	* @param rect - The output rectangle.
	* @returns The bounds.
	*/
	Text.prototype.getLocalBounds = function(rect) {
		this.updateText(true);
		return _super.prototype.getLocalBounds.call(this, rect);
	};
	/** Calculates the bounds of the Text as a rectangle. The bounds calculation takes the worldTransform into account. */
	Text.prototype._calculateBounds = function() {
		this.calculateVertices();
		this._bounds.addQuad(this.vertexData);
	};
	/**
	* Generates the fill style. Can automatically generate a gradient based on the fill style being an array
	* @param style - The style.
	* @param lines - The lines of text.
	* @param metrics
	* @returns The fill style
	*/
	Text.prototype._generateFillStyle = function(style, lines, metrics) {
		var fillStyle = style.fill;
		if (!Array.isArray(fillStyle)) return fillStyle;
		else if (fillStyle.length === 1) return fillStyle[0];
		var gradient;
		var dropShadowCorrection = style.dropShadow ? style.dropShadowDistance : 0;
		var padding = style.padding || 0;
		var width = this.canvas.width / this._resolution - dropShadowCorrection - padding * 2;
		var height = this.canvas.height / this._resolution - dropShadowCorrection - padding * 2;
		var fill = fillStyle.slice();
		var fillGradientStops = style.fillGradientStops.slice();
		if (!fillGradientStops.length) {
			var lengthPlus1 = fill.length + 1;
			for (var i = 1; i < lengthPlus1; ++i) fillGradientStops.push(i / lengthPlus1);
		}
		fill.unshift(fillStyle[0]);
		fillGradientStops.unshift(0);
		fill.push(fillStyle[fillStyle.length - 1]);
		fillGradientStops.push(1);
		if (style.fillGradientType === TEXT_GRADIENT.LINEAR_VERTICAL) {
			gradient = this.context.createLinearGradient(width / 2, padding, width / 2, height + padding);
			var textHeight = metrics.fontProperties.fontSize + style.strokeThickness;
			for (var i = 0; i < lines.length; i++) {
				var lastLineBottom = metrics.lineHeight * (i - 1) + textHeight;
				var thisLineTop = metrics.lineHeight * i;
				var thisLineGradientStart = thisLineTop;
				if (i > 0 && lastLineBottom > thisLineTop) thisLineGradientStart = (thisLineTop + lastLineBottom) / 2;
				var thisLineBottom = thisLineTop + textHeight;
				var nextLineTop = metrics.lineHeight * (i + 1);
				var thisLineGradientEnd = thisLineBottom;
				if (i + 1 < lines.length && nextLineTop < thisLineBottom) thisLineGradientEnd = (thisLineBottom + nextLineTop) / 2;
				var gradStopLineHeight = (thisLineGradientEnd - thisLineGradientStart) / height;
				for (var j = 0; j < fill.length; j++) {
					var lineStop = 0;
					if (typeof fillGradientStops[j] === "number") lineStop = fillGradientStops[j];
					else lineStop = j / fill.length;
					var globalStop = Math.min(1, Math.max(0, thisLineGradientStart / height + lineStop * gradStopLineHeight));
					globalStop = Number(globalStop.toFixed(5));
					gradient.addColorStop(globalStop, fill[j]);
				}
			}
		} else {
			gradient = this.context.createLinearGradient(padding, height / 2, width + padding, height / 2);
			var totalIterations = fill.length + 1;
			var currentIteration = 1;
			for (var i = 0; i < fill.length; i++) {
				var stop = void 0;
				if (typeof fillGradientStops[i] === "number") stop = fillGradientStops[i];
				else stop = currentIteration / totalIterations;
				gradient.addColorStop(stop, fill[i]);
				currentIteration++;
			}
		}
		return gradient;
	};
	/**
	* Destroys this text object.
	*
	* Note* Unlike a Sprite, a Text object will automatically destroy its baseTexture and texture as
	* the majority of the time the texture will not be shared with any other Sprites.
	* @param options - Options parameter. A boolean will act as if all options
	*  have been set to that value
	* @param {boolean} [options.children=false] - if set to true, all the children will have their
	*  destroy method called as well. 'options' will be passed on to those calls.
	* @param {boolean} [options.texture=true] - Should it destroy the current texture of the sprite as well
	* @param {boolean} [options.baseTexture=true] - Should it destroy the base texture of the sprite as well
	*/
	Text.prototype.destroy = function(options) {
		if (typeof options === "boolean") options = { children: options };
		options = Object.assign({}, defaultDestroyOptions, options);
		_super.prototype.destroy.call(this, options);
		if (this._ownCanvas) this.canvas.height = this.canvas.width = 0;
		this.context = null;
		this.canvas = null;
		this._style = null;
	};
	Object.defineProperty(Text.prototype, "width", {
		/** The width of the Text, setting this will actually modify the scale to achieve the value set. */
		get: function() {
			this.updateText(true);
			return Math.abs(this.scale.x) * this._texture.orig.width;
		},
		set: function(value) {
			this.updateText(true);
			var s = sign(this.scale.x) || 1;
			this.scale.x = s * value / this._texture.orig.width;
			this._width = value;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Text.prototype, "height", {
		/** The height of the Text, setting this will actually modify the scale to achieve the value set. */
		get: function() {
			this.updateText(true);
			return Math.abs(this.scale.y) * this._texture.orig.height;
		},
		set: function(value) {
			this.updateText(true);
			var s = sign(this.scale.y) || 1;
			this.scale.y = s * value / this._texture.orig.height;
			this._height = value;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Text.prototype, "style", {
		/**
		* Set the style of the text.
		*
		* Set up an event listener to listen for changes on the style object and mark the text as dirty.
		*/
		get: function() {
			return this._style;
		},
		set: function(style) {
			style = style || {};
			if (style instanceof TextStyle) this._style = style;
			else this._style = new TextStyle(style);
			this.localStyleID = -1;
			this.dirty = true;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Text.prototype, "text", {
		/** Set the copy for the text object. To split a line you can use '\n'. */
		get: function() {
			return this._text;
		},
		set: function(text) {
			text = String(text === null || text === void 0 ? "" : text);
			if (this._text === text) return;
			this._text = text;
			this.dirty = true;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Text.prototype, "resolution", {
		/**
		* The resolution / device pixel ratio of the canvas.
		*
		* This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
		* @default 1
		*/
		get: function() {
			return this._resolution;
		},
		set: function(value) {
			this._autoResolution = false;
			if (this._resolution === value) return;
			this._resolution = value;
			this.dirty = true;
		},
		enumerable: false,
		configurable: true
	});
	/**
	* New behavior for `lineHeight` that's meant to mimic HTML text. A value of `true` will
	* make sure the first baseline is offset by the `lineHeight` value if it is greater than `fontSize`.
	* A value of `false` will use the legacy behavior and not change the baseline of the first line.
	* In the next major release, we'll enable this by default.
	*/
	Text.nextLineHeightBehavior = false;
	/**
	* New rendering behavior for letter-spacing which uses Chrome's new native API. This will
	* lead to more accurate letter-spacing results because it does not try to manually draw
	* each character. However, this Chrome API is experimental and may not serve all cases yet.
	*/
	Text.experimentalLetterSpacing = false;
	return Text;
}(Sprite);
//#endregion
//#region node_modules/@pixi/prepare/dist/esm/prepare.mjs
/*!
* @pixi/prepare - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/prepare is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/**
* Default number of uploads per frame using prepare plugin.
* @static
* @memberof PIXI.settings
* @name UPLOADS_PER_FRAME
* @type {number}
* @default 4
*/
settings.UPLOADS_PER_FRAME = 4;
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics$11 = function(d, b) {
	extendStatics$11 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
		d.__proto__ = b;
	} || function(d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	};
	return extendStatics$11(d, b);
};
function __extends$11(d, b) {
	extendStatics$11(d, b);
	function __() {
		this.constructor = d;
	}
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
/**
* CountLimiter limits the number of items handled by a {@link PIXI.BasePrepare} to a specified
* number of items per frame.
* @memberof PIXI
*/
var CountLimiter = function() {
	/**
	* @param maxItemsPerFrame - The maximum number of items that can be prepared each frame.
	*/
	function CountLimiter(maxItemsPerFrame) {
		this.maxItemsPerFrame = maxItemsPerFrame;
		this.itemsLeft = 0;
	}
	/** Resets any counting properties to start fresh on a new frame. */
	CountLimiter.prototype.beginFrame = function() {
		this.itemsLeft = this.maxItemsPerFrame;
	};
	/**
	* Checks to see if another item can be uploaded. This should only be called once per item.
	* @returns If the item is allowed to be uploaded.
	*/
	CountLimiter.prototype.allowedToUpload = function() {
		return this.itemsLeft-- > 0;
	};
	return CountLimiter;
}();
/**
* Built-in hook to find multiple textures from objects like AnimatedSprites.
* @private
* @param item - Display object to check
* @param queue - Collection of items to upload
* @returns If a PIXI.Texture object was found.
*/
function findMultipleBaseTextures(item, queue) {
	var result = false;
	if (item && item._textures && item._textures.length) {
		for (var i = 0; i < item._textures.length; i++) if (item._textures[i] instanceof Texture) {
			var baseTexture = item._textures[i].baseTexture;
			if (queue.indexOf(baseTexture) === -1) {
				queue.push(baseTexture);
				result = true;
			}
		}
	}
	return result;
}
/**
* Built-in hook to find BaseTextures from Texture.
* @private
* @param item - Display object to check
* @param queue - Collection of items to upload
* @returns If a PIXI.Texture object was found.
*/
function findBaseTexture(item, queue) {
	if (item.baseTexture instanceof BaseTexture) {
		var texture = item.baseTexture;
		if (queue.indexOf(texture) === -1) queue.push(texture);
		return true;
	}
	return false;
}
/**
* Built-in hook to find textures from objects.
* @private
* @param item - Display object to check
* @param queue - Collection of items to upload
* @returns If a PIXI.Texture object was found.
*/
function findTexture(item, queue) {
	if (item._texture && item._texture instanceof Texture) {
		var texture = item._texture.baseTexture;
		if (queue.indexOf(texture) === -1) queue.push(texture);
		return true;
	}
	return false;
}
/**
* Built-in hook to draw PIXI.Text to its texture.
* @private
* @param _helper - Not used by this upload handler
* @param item - Item to check
* @returns If item was uploaded.
*/
function drawText(_helper, item) {
	if (item instanceof Text) {
		item.updateText(true);
		return true;
	}
	return false;
}
/**
* Built-in hook to calculate a text style for a PIXI.Text object.
* @private
* @param _helper - Not used by this upload handler
* @param item - Item to check
* @returns If item was uploaded.
*/
function calculateTextStyle(_helper, item) {
	if (item instanceof TextStyle) {
		var font = item.toFontString();
		TextMetrics.measureFont(font);
		return true;
	}
	return false;
}
/**
* Built-in hook to find Text objects.
* @private
* @param item - Display object to check
* @param queue - Collection of items to upload
* @returns if a PIXI.Text object was found.
*/
function findText(item, queue) {
	if (item instanceof Text) {
		if (queue.indexOf(item.style) === -1) queue.push(item.style);
		if (queue.indexOf(item) === -1) queue.push(item);
		var texture = item._texture.baseTexture;
		if (queue.indexOf(texture) === -1) queue.push(texture);
		return true;
	}
	return false;
}
/**
* Built-in hook to find TextStyle objects.
* @private
* @param item - Display object to check
* @param queue - Collection of items to upload
* @returns If a PIXI.TextStyle object was found.
*/
function findTextStyle(item, queue) {
	if (item instanceof TextStyle) {
		if (queue.indexOf(item) === -1) queue.push(item);
		return true;
	}
	return false;
}
/**
* The prepare manager provides functionality to upload content to the GPU.
*
* BasePrepare handles basic queuing functionality and is extended by
* {@link PIXI.Prepare} and {@link PIXI.CanvasPrepare}
* to provide preparation capabilities specific to their respective renderers.
* @example
* // Create a sprite
* const sprite = PIXI.Sprite.from('something.png');
*
* // Load object into GPU
* app.renderer.plugins.prepare.upload(sprite, () => {
*
*     //Texture(s) has been uploaded to GPU
*     app.stage.addChild(sprite);
*
* })
* @abstract
* @memberof PIXI
*/
var BasePrepare = function() {
	/**
	* @param {PIXI.AbstractRenderer} renderer - A reference to the current renderer
	*/
	function BasePrepare(renderer) {
		var _this = this;
		this.limiter = new CountLimiter(settings.UPLOADS_PER_FRAME);
		this.renderer = renderer;
		this.uploadHookHelper = null;
		this.queue = [];
		this.addHooks = [];
		this.uploadHooks = [];
		this.completes = [];
		this.ticking = false;
		this.delayedTick = function() {
			if (!_this.queue) return;
			_this.prepareItems();
		};
		this.registerFindHook(findText);
		this.registerFindHook(findTextStyle);
		this.registerFindHook(findMultipleBaseTextures);
		this.registerFindHook(findBaseTexture);
		this.registerFindHook(findTexture);
		this.registerUploadHook(drawText);
		this.registerUploadHook(calculateTextStyle);
	}
	/** @ignore */
	BasePrepare.prototype.upload = function(item, done) {
		var _this = this;
		if (typeof item === "function") {
			done = item;
			item = null;
		}
		if (done) deprecation("6.5.0", "BasePrepare.upload callback is deprecated, use the return Promise instead.");
		return new Promise(function(resolve) {
			if (item) _this.add(item);
			var complete = function() {
				done === null || done === void 0 || done();
				resolve();
			};
			if (_this.queue.length) {
				_this.completes.push(complete);
				if (!_this.ticking) {
					_this.ticking = true;
					Ticker.system.addOnce(_this.tick, _this, UPDATE_PRIORITY.UTILITY);
				}
			} else complete();
		});
	};
	/**
	* Handle tick update
	* @private
	*/
	BasePrepare.prototype.tick = function() {
		setTimeout(this.delayedTick, 0);
	};
	/**
	* Actually prepare items. This is handled outside of the tick because it will take a while
	* and we do NOT want to block the current animation frame from rendering.
	* @private
	*/
	BasePrepare.prototype.prepareItems = function() {
		this.limiter.beginFrame();
		while (this.queue.length && this.limiter.allowedToUpload()) {
			var item = this.queue[0];
			var uploaded = false;
			if (item && !item._destroyed) {
				for (var i = 0, len = this.uploadHooks.length; i < len; i++) if (this.uploadHooks[i](this.uploadHookHelper, item)) {
					this.queue.shift();
					uploaded = true;
					break;
				}
			}
			if (!uploaded) this.queue.shift();
		}
		if (!this.queue.length) {
			this.ticking = false;
			var completes = this.completes.slice(0);
			this.completes.length = 0;
			for (var i = 0, len = completes.length; i < len; i++) completes[i]();
		} else Ticker.system.addOnce(this.tick, this, UPDATE_PRIORITY.UTILITY);
	};
	/**
	* Adds hooks for finding items.
	* @param {Function} addHook - Function call that takes two parameters: `item:*, queue:Array`
	*          function must return `true` if it was able to add item to the queue.
	* @returns Instance of plugin for chaining.
	*/
	BasePrepare.prototype.registerFindHook = function(addHook) {
		if (addHook) this.addHooks.push(addHook);
		return this;
	};
	/**
	* Adds hooks for uploading items.
	* @param {Function} uploadHook - Function call that takes two parameters: `prepare:CanvasPrepare, item:*` and
	*          function must return `true` if it was able to handle upload of item.
	* @returns Instance of plugin for chaining.
	*/
	BasePrepare.prototype.registerUploadHook = function(uploadHook) {
		if (uploadHook) this.uploadHooks.push(uploadHook);
		return this;
	};
	/**
	* Manually add an item to the uploading queue.
	* @param {PIXI.DisplayObject|PIXI.Container|PIXI.BaseTexture|PIXI.Texture|PIXI.Graphics|PIXI.Text|*} item - Object to
	*        add to the queue
	* @returns Instance of plugin for chaining.
	*/
	BasePrepare.prototype.add = function(item) {
		for (var i = 0, len = this.addHooks.length; i < len; i++) if (this.addHooks[i](item, this.queue)) break;
		if (item instanceof Container) for (var i = item.children.length - 1; i >= 0; i--) this.add(item.children[i]);
		return this;
	};
	/** Destroys the plugin, don't use after this. */
	BasePrepare.prototype.destroy = function() {
		if (this.ticking) Ticker.system.remove(this.tick, this);
		this.ticking = false;
		this.addHooks = null;
		this.uploadHooks = null;
		this.renderer = null;
		this.completes = null;
		this.queue = null;
		this.limiter = null;
		this.uploadHookHelper = null;
	};
	return BasePrepare;
}();
/**
* Built-in hook to upload PIXI.Texture objects to the GPU.
* @private
* @param renderer - instance of the webgl renderer
* @param item - Item to check
* @returns If item was uploaded.
*/
function uploadBaseTextures(renderer, item) {
	if (item instanceof BaseTexture) {
		if (!item._glTextures[renderer.CONTEXT_UID]) renderer.texture.bind(item);
		return true;
	}
	return false;
}
/**
* Built-in hook to upload PIXI.Graphics to the GPU.
* @private
* @param renderer - instance of the webgl renderer
* @param item - Item to check
* @returns If item was uploaded.
*/
function uploadGraphics(renderer, item) {
	if (!(item instanceof Graphics)) return false;
	var geometry = item.geometry;
	item.finishPoly();
	geometry.updateBatches();
	var batches = geometry.batches;
	for (var i = 0; i < batches.length; i++) {
		var texture = batches[i].style.texture;
		if (texture) uploadBaseTextures(renderer, texture.baseTexture);
	}
	if (!geometry.batchable) renderer.geometry.bind(geometry, item._resolveDirectShader(renderer));
	return true;
}
/**
* Built-in hook to find graphics.
* @private
* @param item - Display object to check
* @param queue - Collection of items to upload
* @returns if a PIXI.Graphics object was found.
*/
function findGraphics(item, queue) {
	if (item instanceof Graphics) {
		queue.push(item);
		return true;
	}
	return false;
}
/**
* The prepare plugin provides renderer-specific plugins for pre-rendering DisplayObjects. These plugins are useful for
* asynchronously preparing and uploading to the GPU assets, textures, graphics waiting to be displayed.
*
* Do not instantiate this plugin directly. It is available from the `renderer.plugins` property.
* See {@link PIXI.CanvasRenderer#plugins} or {@link PIXI.Renderer#plugins}.
* @example
* // Create a new application
* const app = new PIXI.Application();
* document.body.appendChild(app.view);
*
* // Don't start rendering right away
* app.stop();
*
* // create a display object
* const rect = new PIXI.Graphics()
*     .beginFill(0x00ff00)
*     .drawRect(40, 40, 200, 200);
*
* // Add to the stage
* app.stage.addChild(rect);
*
* // Don't start rendering until the graphic is uploaded to the GPU
* app.renderer.plugins.prepare.upload(app.stage, () => {
*     app.start();
* });
* @memberof PIXI
*/
var Prepare = function(_super) {
	__extends$11(Prepare, _super);
	/**
	* @param {PIXI.Renderer} renderer - A reference to the current renderer
	*/
	function Prepare(renderer) {
		var _this = _super.call(this, renderer) || this;
		_this.uploadHookHelper = _this.renderer;
		_this.registerFindHook(findGraphics);
		_this.registerUploadHook(uploadBaseTextures);
		_this.registerUploadHook(uploadGraphics);
		return _this;
	}
	/** @ignore */
	Prepare.extension = {
		name: "prepare",
		type: ExtensionType.RendererPlugin
	};
	return Prepare;
}(BasePrepare);
/**
* TimeLimiter limits the number of items handled by a {@link PIXI.BasePrepare} to a specified
* number of milliseconds per frame.
* @memberof PIXI
*/
var TimeLimiter = function() {
	/** @param maxMilliseconds - The maximum milliseconds that can be spent preparing items each frame. */
	function TimeLimiter(maxMilliseconds) {
		this.maxMilliseconds = maxMilliseconds;
		this.frameStart = 0;
	}
	/** Resets any counting properties to start fresh on a new frame. */
	TimeLimiter.prototype.beginFrame = function() {
		this.frameStart = Date.now();
	};
	/**
	* Checks to see if another item can be uploaded. This should only be called once per item.
	* @returns - If the item is allowed to be uploaded.
	*/
	TimeLimiter.prototype.allowedToUpload = function() {
		return Date.now() - this.frameStart < this.maxMilliseconds;
	};
	return TimeLimiter;
}();
//#endregion
//#region node_modules/@pixi/spritesheet/dist/esm/spritesheet.mjs
/*!
* @pixi/spritesheet - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/spritesheet is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/**
* Utility class for maintaining reference to a collection
* of Textures on a single Spritesheet.
*
* To access a sprite sheet from your code you may pass its JSON data file to Pixi's loader:
*
* ```js
* PIXI.Loader.shared.add("images/spritesheet.json").load(setup);
*
* function setup() {
*   let sheet = PIXI.Loader.shared.resources["images/spritesheet.json"].spritesheet;
*   ...
* }
* ```
*
* Alternately, you may circumvent the loader by instantiating the Spritesheet directly:
* ```js
* const sheet = new PIXI.Spritesheet(texture, spritesheetData);
* await sheet.parse();
* console.log('Spritesheet ready to use!');
* ```
*
* With the `sheet.textures` you can create Sprite objects,`sheet.animations` can be used to create an AnimatedSprite.
*
* Sprite sheets can be packed using tools like {@link https://codeandweb.com/texturepacker|TexturePacker},
* {@link https://renderhjs.net/shoebox/|Shoebox} or {@link https://github.com/krzysztof-o/spritesheet.js|Spritesheet.js}.
* Default anchor points (see {@link PIXI.Texture#defaultAnchor}) and grouping of animation sprites are currently only
* supported by TexturePacker.
* @memberof PIXI
*/
var Spritesheet = function() {
	/**
	* @param texture - Reference to the source BaseTexture object.
	* @param {object} data - Spritesheet image data.
	* @param resolutionFilename - The filename to consider when determining
	*        the resolution of the spritesheet. If not provided, the imageUrl will
	*        be used on the BaseTexture.
	*/
	function Spritesheet(texture, data, resolutionFilename) {
		if (resolutionFilename === void 0) resolutionFilename = null;
		/** For multi-packed spritesheets, this contains a reference to all the other spritesheets it depends on. */
		this.linkedSheets = [];
		this._texture = texture instanceof Texture ? texture : null;
		this.baseTexture = texture instanceof BaseTexture ? texture : this._texture.baseTexture;
		this.textures = {};
		this.animations = {};
		this.data = data;
		var resource = this.baseTexture.resource;
		this.resolution = this._updateResolution(resolutionFilename || (resource ? resource.url : null));
		this._frames = this.data.frames;
		this._frameKeys = Object.keys(this._frames);
		this._batchIndex = 0;
		this._callback = null;
	}
	/**
	* Generate the resolution from the filename or fallback
	* to the meta.scale field of the JSON data.
	* @param resolutionFilename - The filename to use for resolving
	*        the default resolution.
	* @returns Resolution to use for spritesheet.
	*/
	Spritesheet.prototype._updateResolution = function(resolutionFilename) {
		if (resolutionFilename === void 0) resolutionFilename = null;
		var scale = this.data.meta.scale;
		var resolution = getResolutionOfUrl(resolutionFilename, null);
		if (resolution === null) resolution = scale !== void 0 ? parseFloat(scale) : 1;
		if (resolution !== 1) this.baseTexture.setResolution(resolution);
		return resolution;
	};
	/** @ignore */
	Spritesheet.prototype.parse = function(callback) {
		var _this = this;
		if (callback) deprecation("6.5.0", "Spritesheet.parse callback is deprecated, use the return Promise instead.");
		return new Promise(function(resolve) {
			_this._callback = function(textures) {
				callback === null || callback === void 0 || callback(textures);
				resolve(textures);
			};
			_this._batchIndex = 0;
			if (_this._frameKeys.length <= Spritesheet.BATCH_SIZE) {
				_this._processFrames(0);
				_this._processAnimations();
				_this._parseComplete();
			} else _this._nextBatch();
		});
	};
	/**
	* Process a batch of frames
	* @param initialFrameIndex - The index of frame to start.
	*/
	Spritesheet.prototype._processFrames = function(initialFrameIndex) {
		var frameIndex = initialFrameIndex;
		var maxFrames = Spritesheet.BATCH_SIZE;
		while (frameIndex - initialFrameIndex < maxFrames && frameIndex < this._frameKeys.length) {
			var i = this._frameKeys[frameIndex];
			var data = this._frames[i];
			var rect = data.frame;
			if (rect) {
				var frame = null;
				var trim = null;
				var sourceSize = data.trimmed !== false && data.sourceSize ? data.sourceSize : data.frame;
				var orig = new Rectangle(0, 0, Math.floor(sourceSize.w) / this.resolution, Math.floor(sourceSize.h) / this.resolution);
				if (data.rotated) frame = new Rectangle(Math.floor(rect.x) / this.resolution, Math.floor(rect.y) / this.resolution, Math.floor(rect.h) / this.resolution, Math.floor(rect.w) / this.resolution);
				else frame = new Rectangle(Math.floor(rect.x) / this.resolution, Math.floor(rect.y) / this.resolution, Math.floor(rect.w) / this.resolution, Math.floor(rect.h) / this.resolution);
				if (data.trimmed !== false && data.spriteSourceSize) trim = new Rectangle(Math.floor(data.spriteSourceSize.x) / this.resolution, Math.floor(data.spriteSourceSize.y) / this.resolution, Math.floor(rect.w) / this.resolution, Math.floor(rect.h) / this.resolution);
				this.textures[i] = new Texture(this.baseTexture, frame, orig, trim, data.rotated ? 2 : 0, data.anchor);
				Texture.addToCache(this.textures[i], i);
			}
			frameIndex++;
		}
	};
	/** Parse animations config. */
	Spritesheet.prototype._processAnimations = function() {
		var animations = this.data.animations || {};
		for (var animName in animations) {
			this.animations[animName] = [];
			for (var i = 0; i < animations[animName].length; i++) {
				var frameName = animations[animName][i];
				this.animations[animName].push(this.textures[frameName]);
			}
		}
	};
	/** The parse has completed. */
	Spritesheet.prototype._parseComplete = function() {
		var callback = this._callback;
		this._callback = null;
		this._batchIndex = 0;
		callback.call(this, this.textures);
	};
	/** Begin the next batch of textures. */
	Spritesheet.prototype._nextBatch = function() {
		var _this = this;
		this._processFrames(this._batchIndex * Spritesheet.BATCH_SIZE);
		this._batchIndex++;
		setTimeout(function() {
			if (_this._batchIndex * Spritesheet.BATCH_SIZE < _this._frameKeys.length) _this._nextBatch();
			else {
				_this._processAnimations();
				_this._parseComplete();
			}
		}, 0);
	};
	/**
	* Destroy Spritesheet and don't use after this.
	* @param {boolean} [destroyBase=false] - Whether to destroy the base texture as well
	*/
	Spritesheet.prototype.destroy = function(destroyBase) {
		var _a;
		if (destroyBase === void 0) destroyBase = false;
		for (var i in this.textures) this.textures[i].destroy();
		this._frames = null;
		this._frameKeys = null;
		this.data = null;
		this.textures = null;
		if (destroyBase) {
			(_a = this._texture) === null || _a === void 0 || _a.destroy();
			this.baseTexture.destroy();
		}
		this._texture = null;
		this.baseTexture = null;
		this.linkedSheets = [];
	};
	/** The maximum number of Textures to build per process. */
	Spritesheet.BATCH_SIZE = 1e3;
	return Spritesheet;
}();
/**
* Reference to Spritesheet object created.
* @member {PIXI.Spritesheet} spritesheet
* @memberof PIXI.LoaderResource
* @instance
*/
/**
* Dictionary of textures from Spritesheet.
* @member {Object<string, PIXI.Texture>} textures
* @memberof PIXI.LoaderResource
* @instance
*/
/**
* {@link PIXI.Loader} middleware for loading texture atlases that have been created with
* TexturePacker or similar JSON-based spritesheet.
*
* This middleware automatically generates Texture resources.
*
* If you're using Webpack or other bundlers and plan on bundling the atlas' JSON,
* use the {@link PIXI.Spritesheet} class to directly parse the JSON.
*
* The Loader's image Resource name is automatically appended with `"_image"`.
* If a Resource with this name is already loaded, the Loader will skip parsing the
* Spritesheet. The code below will generate an internal Loader Resource called `"myatlas_image"`.
* @example
* loader.add('myatlas', 'path/to/myatlas.json');
* loader.load(() => {
*   loader.resources.myatlas; // atlas JSON resource
*   loader.resources.myatlas_image; // atlas Image resource
* });
* @memberof PIXI
*/
var SpritesheetLoader = function() {
	function SpritesheetLoader() {}
	/**
	* Called after a resource is loaded.
	* @see PIXI.Loader.loaderMiddleware
	* @param resource
	* @param next
	*/
	SpritesheetLoader.use = function(resource, next) {
		var _a, _b;
		var loader = this;
		var imageResourceName = resource.name + "_image";
		if (!resource.data || resource.type !== LoaderResource.TYPE.JSON || !resource.data.frames || loader.resources[imageResourceName]) {
			next();
			return;
		}
		var multiPacks = (_b = (_a = resource.data) === null || _a === void 0 ? void 0 : _a.meta) === null || _b === void 0 ? void 0 : _b.related_multi_packs;
		if (Array.isArray(multiPacks)) {
			var _loop_1 = function(item) {
				if (typeof item !== "string") return "continue";
				var itemName = item.replace(".json", "");
				var itemUrl = url.resolve(resource.url.replace(loader.baseUrl, ""), item);
				if (loader.resources[itemName] || Object.values(loader.resources).some(function(r) {
					return url.format(url.parse(r.url)) === itemUrl;
				})) return "continue";
				var options = {
					crossOrigin: resource.crossOrigin,
					loadType: LoaderResource.LOAD_TYPE.XHR,
					xhrType: LoaderResource.XHR_RESPONSE_TYPE.JSON,
					parentResource: resource,
					metadata: resource.metadata
				};
				loader.add(itemName, itemUrl, options);
			};
			for (var _i = 0, multiPacks_1 = multiPacks; _i < multiPacks_1.length; _i++) {
				var item = multiPacks_1[_i];
				_loop_1(item);
			}
		}
		var loadOptions = {
			crossOrigin: resource.crossOrigin,
			metadata: resource.metadata.imageMetadata,
			parentResource: resource
		};
		var resourcePath = SpritesheetLoader.getResourcePath(resource, loader.baseUrl);
		loader.add(imageResourceName, resourcePath, loadOptions, function onImageLoad(res) {
			if (res.error) {
				next(res.error);
				return;
			}
			var spritesheet = new Spritesheet(res.texture, resource.data, resource.url);
			spritesheet.parse().then(function() {
				resource.spritesheet = spritesheet;
				resource.textures = spritesheet.textures;
				next();
			});
		});
	};
	/**
	* Get the spritesheets root path
	* @param resource - Resource to check path
	* @param baseUrl - Base root url
	*/
	SpritesheetLoader.getResourcePath = function(resource, baseUrl) {
		if (resource.isDataUrl) return resource.data.meta.image;
		return url.resolve(resource.url.replace(baseUrl, ""), resource.data.meta.image);
	};
	/** @ignore */
	SpritesheetLoader.extension = ExtensionType.Loader;
	return SpritesheetLoader;
}();
//#endregion
//#region node_modules/@pixi/sprite-tiling/dist/esm/sprite-tiling.mjs
/*!
* @pixi/sprite-tiling - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/sprite-tiling is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics$10 = function(d, b) {
	extendStatics$10 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
		d.__proto__ = b;
	} || function(d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	};
	return extendStatics$10(d, b);
};
function __extends$10(d, b) {
	extendStatics$10(d, b);
	function __() {
		this.constructor = d;
	}
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var tempPoint$1 = new Point();
/**
* A tiling sprite is a fast way of rendering a tiling image.
* @memberof PIXI
*/
var TilingSprite = function(_super) {
	__extends$10(TilingSprite, _super);
	/**
	* @param texture - The texture of the tiling sprite.
	* @param width - The width of the tiling sprite.
	* @param height - The height of the tiling sprite.
	*/
	function TilingSprite(texture, width, height) {
		if (width === void 0) width = 100;
		if (height === void 0) height = 100;
		var _this = _super.call(this, texture) || this;
		_this.tileTransform = new Transform();
		_this._width = width;
		_this._height = height;
		_this.uvMatrix = _this.texture.uvMatrix || new TextureMatrix(texture);
		/**
		* Plugin that is responsible for rendering this element.
		* Allows to customize the rendering process without overriding '_render' method.
		* @default 'tilingSprite'
		*/
		_this.pluginName = "tilingSprite";
		_this.uvRespectAnchor = false;
		return _this;
	}
	Object.defineProperty(TilingSprite.prototype, "clampMargin", {
		/**
		* Changes frame clamping in corresponding textureTransform, shortcut
		* Change to -0.5 to add a pixel to the edge, recommended for transparent trimmed textures in atlas
		* @default 0.5
		* @member {number}
		*/
		get: function() {
			return this.uvMatrix.clampMargin;
		},
		set: function(value) {
			this.uvMatrix.clampMargin = value;
			this.uvMatrix.update(true);
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TilingSprite.prototype, "tileScale", {
		/** The scaling of the image that is being tiled. */
		get: function() {
			return this.tileTransform.scale;
		},
		set: function(value) {
			this.tileTransform.scale.copyFrom(value);
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TilingSprite.prototype, "tilePosition", {
		/** The offset of the image that is being tiled. */
		get: function() {
			return this.tileTransform.position;
		},
		set: function(value) {
			this.tileTransform.position.copyFrom(value);
		},
		enumerable: false,
		configurable: true
	});
	/**
	* @protected
	*/
	TilingSprite.prototype._onTextureUpdate = function() {
		if (this.uvMatrix) this.uvMatrix.texture = this._texture;
		this._cachedTint = 16777215;
	};
	/**
	* Renders the object using the WebGL renderer
	* @param renderer - The renderer
	*/
	TilingSprite.prototype._render = function(renderer) {
		var texture = this._texture;
		if (!texture || !texture.valid) return;
		this.tileTransform.updateLocalTransform();
		this.uvMatrix.update();
		renderer.batch.setObjectRenderer(renderer.plugins[this.pluginName]);
		renderer.plugins[this.pluginName].render(this);
	};
	/** Updates the bounds of the tiling sprite. */
	TilingSprite.prototype._calculateBounds = function() {
		var minX = this._width * -this._anchor._x;
		var minY = this._height * -this._anchor._y;
		var maxX = this._width * (1 - this._anchor._x);
		var maxY = this._height * (1 - this._anchor._y);
		this._bounds.addFrame(this.transform, minX, minY, maxX, maxY);
	};
	/**
	* Gets the local bounds of the sprite object.
	* @param rect - Optional output rectangle.
	* @returns The bounds.
	*/
	TilingSprite.prototype.getLocalBounds = function(rect) {
		if (this.children.length === 0) {
			this._bounds.minX = this._width * -this._anchor._x;
			this._bounds.minY = this._height * -this._anchor._y;
			this._bounds.maxX = this._width * (1 - this._anchor._x);
			this._bounds.maxY = this._height * (1 - this._anchor._y);
			if (!rect) {
				if (!this._localBoundsRect) this._localBoundsRect = new Rectangle();
				rect = this._localBoundsRect;
			}
			return this._bounds.getRectangle(rect);
		}
		return _super.prototype.getLocalBounds.call(this, rect);
	};
	/**
	* Checks if a point is inside this tiling sprite.
	* @param point - The point to check.
	* @returns Whether or not the sprite contains the point.
	*/
	TilingSprite.prototype.containsPoint = function(point) {
		this.worldTransform.applyInverse(point, tempPoint$1);
		var width = this._width;
		var height = this._height;
		var x1 = -width * this.anchor._x;
		if (tempPoint$1.x >= x1 && tempPoint$1.x < x1 + width) {
			var y1 = -height * this.anchor._y;
			if (tempPoint$1.y >= y1 && tempPoint$1.y < y1 + height) return true;
		}
		return false;
	};
	/**
	* Destroys this sprite and optionally its texture and children
	* @param {object|boolean} [options] - Options parameter. A boolean will act as if all options
	*  have been set to that value
	* @param {boolean} [options.children=false] - if set to true, all the children will have their destroy
	*      method called as well. 'options' will be passed on to those calls.
	* @param {boolean} [options.texture=false] - Should it destroy the current texture of the sprite as well
	* @param {boolean} [options.baseTexture=false] - Should it destroy the base texture of the sprite as well
	*/
	TilingSprite.prototype.destroy = function(options) {
		_super.prototype.destroy.call(this, options);
		this.tileTransform = null;
		this.uvMatrix = null;
	};
	/**
	* Helper function that creates a new tiling sprite based on the source you provide.
	* The source can be - frame id, image url, video url, canvas element, video element, base texture
	* @static
	* @param {string|PIXI.Texture|HTMLCanvasElement|HTMLVideoElement} source - Source to create texture from
	* @param {object} options - See {@link PIXI.BaseTexture}'s constructor for options.
	* @param {number} options.width - required width of the tiling sprite
	* @param {number} options.height - required height of the tiling sprite
	* @returns {PIXI.TilingSprite} The newly created texture
	*/
	TilingSprite.from = function(source, options) {
		return new TilingSprite(source instanceof Texture ? source : Texture.from(source, options), options.width, options.height);
	};
	Object.defineProperty(TilingSprite.prototype, "width", {
		/** The width of the sprite, setting this will actually modify the scale to achieve the value set. */
		get: function() {
			return this._width;
		},
		set: function(value) {
			this._width = value;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(TilingSprite.prototype, "height", {
		/** The height of the TilingSprite, setting this will actually modify the scale to achieve the value set. */
		get: function() {
			return this._height;
		},
		set: function(value) {
			this._height = value;
		},
		enumerable: false,
		configurable: true
	});
	return TilingSprite;
}(Sprite);
var fragmentSimpleSrc = "#version 100\n#define SHADER_NAME Tiling-Sprite-Simple-100\n\nprecision lowp float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 uColor;\n\nvoid main(void)\n{\n    vec4 texSample = texture2D(uSampler, vTextureCoord);\n    gl_FragColor = texSample * uColor;\n}\n";
var gl1VertexSrc = "#version 100\n#define SHADER_NAME Tiling-Sprite-100\n\nprecision lowp float;\n\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTransform;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;\n}\n";
var gl1FragmentSrc = "#version 100\n#ifdef GL_EXT_shader_texture_lod\n    #extension GL_EXT_shader_texture_lod : enable\n#endif\n#define SHADER_NAME Tiling-Sprite-100\n\nprecision lowp float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 uColor;\nuniform mat3 uMapCoord;\nuniform vec4 uClampFrame;\nuniform vec2 uClampOffset;\n\nvoid main(void)\n{\n    vec2 coord = vTextureCoord + ceil(uClampOffset - vTextureCoord);\n    coord = (uMapCoord * vec3(coord, 1.0)).xy;\n    vec2 unclamped = coord;\n    coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);\n\n    #ifdef GL_EXT_shader_texture_lod\n        vec4 texSample = unclamped == coord\n            ? texture2D(uSampler, coord) \n            : texture2DLodEXT(uSampler, coord, 0);\n    #else\n        vec4 texSample = texture2D(uSampler, coord);\n    #endif\n\n    gl_FragColor = texSample * uColor;\n}\n";
var gl2VertexSrc = "#version 300 es\n#define SHADER_NAME Tiling-Sprite-300\n\nprecision lowp float;\n\nin vec2 aVertexPosition;\nin vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTransform;\n\nout vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;\n}\n";
var gl2FragmentSrc = "#version 300 es\n#define SHADER_NAME Tiling-Sprite-100\n\nprecision lowp float;\n\nin vec2 vTextureCoord;\n\nout vec4 fragmentColor;\n\nuniform sampler2D uSampler;\nuniform vec4 uColor;\nuniform mat3 uMapCoord;\nuniform vec4 uClampFrame;\nuniform vec2 uClampOffset;\n\nvoid main(void)\n{\n    vec2 coord = vTextureCoord + ceil(uClampOffset - vTextureCoord);\n    coord = (uMapCoord * vec3(coord, 1.0)).xy;\n    vec2 unclamped = coord;\n    coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);\n\n    vec4 texSample = texture(uSampler, coord, unclamped == coord ? 0.0f : -32.0f);// lod-bias very negative to force lod 0\n\n    fragmentColor = texSample * uColor;\n}\n";
var tempMat = new Matrix();
/**
* WebGL renderer plugin for tiling sprites
* @class
* @memberof PIXI
* @extends PIXI.ObjectRenderer
*/
var TilingSpriteRenderer = function(_super) {
	__extends$10(TilingSpriteRenderer, _super);
	/**
	* constructor for renderer
	* @param {PIXI.Renderer} renderer - The renderer this tiling awesomeness works for.
	*/
	function TilingSpriteRenderer(renderer) {
		var _this = _super.call(this, renderer) || this;
		renderer.runners.contextChange.add(_this);
		_this.quad = new QuadUv();
		/**
		* The WebGL state in which this renderer will work.
		* @member {PIXI.State}
		* @readonly
		*/
		_this.state = State.for2d();
		return _this;
	}
	/** Creates shaders when context is initialized. */
	TilingSpriteRenderer.prototype.contextChange = function() {
		var renderer = this.renderer;
		var uniforms = { globals: renderer.globalUniforms };
		this.simpleShader = Shader.from(gl1VertexSrc, fragmentSimpleSrc, uniforms);
		this.shader = renderer.context.webGLVersion > 1 ? Shader.from(gl2VertexSrc, gl2FragmentSrc, uniforms) : Shader.from(gl1VertexSrc, gl1FragmentSrc, uniforms);
	};
	/**
	* @param {PIXI.TilingSprite} ts - tilingSprite to be rendered
	*/
	TilingSpriteRenderer.prototype.render = function(ts) {
		var renderer = this.renderer;
		var quad = this.quad;
		var vertices = quad.vertices;
		vertices[0] = vertices[6] = ts._width * -ts.anchor.x;
		vertices[1] = vertices[3] = ts._height * -ts.anchor.y;
		vertices[2] = vertices[4] = ts._width * (1 - ts.anchor.x);
		vertices[5] = vertices[7] = ts._height * (1 - ts.anchor.y);
		var anchorX = ts.uvRespectAnchor ? ts.anchor.x : 0;
		var anchorY = ts.uvRespectAnchor ? ts.anchor.y : 0;
		vertices = quad.uvs;
		vertices[0] = vertices[6] = -anchorX;
		vertices[1] = vertices[3] = -anchorY;
		vertices[2] = vertices[4] = 1 - anchorX;
		vertices[5] = vertices[7] = 1 - anchorY;
		quad.invalidate();
		var tex = ts._texture;
		var baseTex = tex.baseTexture;
		var premultiplied = baseTex.alphaMode > 0;
		var lt = ts.tileTransform.localTransform;
		var uv = ts.uvMatrix;
		var isSimple = baseTex.isPowerOfTwo && tex.frame.width === baseTex.width && tex.frame.height === baseTex.height;
		if (isSimple) {
			if (!baseTex._glTextures[renderer.CONTEXT_UID]) {
				if (baseTex.wrapMode === WRAP_MODES.CLAMP) baseTex.wrapMode = WRAP_MODES.REPEAT;
			} else isSimple = baseTex.wrapMode !== WRAP_MODES.CLAMP;
		}
		var shader = isSimple ? this.simpleShader : this.shader;
		var w = tex.width;
		var h = tex.height;
		var W = ts._width;
		var H = ts._height;
		tempMat.set(lt.a * w / W, lt.b * w / H, lt.c * h / W, lt.d * h / H, lt.tx / W, lt.ty / H);
		tempMat.invert();
		if (isSimple) tempMat.prepend(uv.mapCoord);
		else {
			shader.uniforms.uMapCoord = uv.mapCoord.toArray(true);
			shader.uniforms.uClampFrame = uv.uClampFrame;
			shader.uniforms.uClampOffset = uv.uClampOffset;
		}
		shader.uniforms.uTransform = tempMat.toArray(true);
		shader.uniforms.uColor = premultiplyTintToRgba(ts.tint, ts.worldAlpha, shader.uniforms.uColor, premultiplied);
		shader.uniforms.translationMatrix = ts.transform.worldTransform.toArray(true);
		shader.uniforms.uSampler = tex;
		renderer.shader.bind(shader);
		renderer.geometry.bind(quad);
		this.state.blendMode = correctBlendMode(ts.blendMode, premultiplied);
		renderer.state.set(this.state);
		renderer.geometry.draw(this.renderer.gl.TRIANGLES, 6, 0);
	};
	/** @ignore */
	TilingSpriteRenderer.extension = {
		name: "tilingSprite",
		type: ExtensionType.RendererPlugin
	};
	return TilingSpriteRenderer;
}(ObjectRenderer);
//#endregion
//#region node_modules/@pixi/mesh/dist/esm/mesh.mjs
/*!
* @pixi/mesh - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/mesh is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics$9 = function(d, b) {
	extendStatics$9 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
		d.__proto__ = b;
	} || function(d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	};
	return extendStatics$9(d, b);
};
function __extends$9(d, b) {
	extendStatics$9(d, b);
	function __() {
		this.constructor = d;
	}
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
/**
* Class controls cache for UV mapping from Texture normal space to BaseTexture normal space.
* @memberof PIXI
*/
var MeshBatchUvs = function() {
	/**
	* @param uvBuffer - Buffer with normalized uv's
	* @param uvMatrix - Material UV matrix
	*/
	function MeshBatchUvs(uvBuffer, uvMatrix) {
		this.uvBuffer = uvBuffer;
		this.uvMatrix = uvMatrix;
		this.data = null;
		this._bufferUpdateId = -1;
		this._textureUpdateId = -1;
		this._updateID = 0;
	}
	/**
	* Updates
	* @param forceUpdate - force the update
	*/
	MeshBatchUvs.prototype.update = function(forceUpdate) {
		if (!forceUpdate && this._bufferUpdateId === this.uvBuffer._updateID && this._textureUpdateId === this.uvMatrix._updateID) return;
		this._bufferUpdateId = this.uvBuffer._updateID;
		this._textureUpdateId = this.uvMatrix._updateID;
		var data = this.uvBuffer.data;
		if (!this.data || this.data.length !== data.length) this.data = new Float32Array(data.length);
		this.uvMatrix.multiplyUvs(data, this.data);
		this._updateID++;
	};
	return MeshBatchUvs;
}();
var tempPoint = new Point();
var tempPolygon = new Polygon();
/**
* Base mesh class.
*
* This class empowers you to have maximum flexibility to render any kind of WebGL visuals you can think of.
* This class assumes a certain level of WebGL knowledge.
* If you know a bit this should abstract enough away to make your life easier!
*
* Pretty much ALL WebGL can be broken down into the following:
* - Geometry - The structure and data for the mesh. This can include anything from positions, uvs, normals, colors etc..
* - Shader - This is the shader that PixiJS will render the geometry with (attributes in the shader must match the geometry)
* - State - This is the state of WebGL required to render the mesh.
*
* Through a combination of the above elements you can render anything you want, 2D or 3D!
* @memberof PIXI
*/
var Mesh = function(_super) {
	__extends$9(Mesh, _super);
	/**
	* @param geometry - The geometry the mesh will use.
	* @param {PIXI.MeshMaterial} shader - The shader the mesh will use.
	* @param state - The state that the WebGL context is required to be in to render the mesh
	*        if no state is provided, uses {@link PIXI.State.for2d} to create a 2D state for PixiJS.
	* @param drawMode - The drawMode, can be any of the {@link PIXI.DRAW_MODES} constants.
	*/
	function Mesh(geometry, shader, state, drawMode) {
		if (drawMode === void 0) drawMode = DRAW_MODES.TRIANGLES;
		var _this = _super.call(this) || this;
		_this.geometry = geometry;
		_this.shader = shader;
		_this.state = state || State.for2d();
		_this.drawMode = drawMode;
		_this.start = 0;
		_this.size = 0;
		_this.uvs = null;
		_this.indices = null;
		_this.vertexData = /* @__PURE__ */ new Float32Array(1);
		_this.vertexDirty = -1;
		_this._transformID = -1;
		_this._roundPixels = settings.ROUND_PIXELS;
		_this.batchUvs = null;
		return _this;
	}
	Object.defineProperty(Mesh.prototype, "geometry", {
		/**
		* Includes vertex positions, face indices, normals, colors, UVs, and
		* custom attributes within buffers, reducing the cost of passing all
		* this data to the GPU. Can be shared between multiple Mesh objects.
		*/
		get: function() {
			return this._geometry;
		},
		set: function(value) {
			if (this._geometry === value) return;
			if (this._geometry) {
				this._geometry.refCount--;
				if (this._geometry.refCount === 0) this._geometry.dispose();
			}
			this._geometry = value;
			if (this._geometry) this._geometry.refCount++;
			this.vertexDirty = -1;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Mesh.prototype, "uvBuffer", {
		/**
		* To change mesh uv's, change its uvBuffer data and increment its _updateID.
		* @readonly
		*/
		get: function() {
			return this.geometry.buffers[1];
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Mesh.prototype, "verticesBuffer", {
		/**
		* To change mesh vertices, change its uvBuffer data and increment its _updateID.
		* Incrementing _updateID is optional because most of Mesh objects do it anyway.
		* @readonly
		*/
		get: function() {
			return this.geometry.buffers[0];
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Mesh.prototype, "material", {
		get: function() {
			return this.shader;
		},
		/** Alias for {@link PIXI.Mesh#shader}. */
		set: function(value) {
			this.shader = value;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Mesh.prototype, "blendMode", {
		get: function() {
			return this.state.blendMode;
		},
		/**
		* The blend mode to be applied to the Mesh. Apply a value of
		* `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.
		* @default PIXI.BLEND_MODES.NORMAL;
		*/
		set: function(value) {
			this.state.blendMode = value;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Mesh.prototype, "roundPixels", {
		get: function() {
			return this._roundPixels;
		},
		/**
		* If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
		* Advantages can include sharper image quality (like text) and faster rendering on canvas.
		* The main disadvantage is movement of objects may appear less smooth.
		* To set the global default, change {@link PIXI.settings.ROUND_PIXELS}
		* @default false
		*/
		set: function(value) {
			if (this._roundPixels !== value) this._transformID = -1;
			this._roundPixels = value;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Mesh.prototype, "tint", {
		/**
		* The multiply tint applied to the Mesh. This is a hex value. A value of
		* `0xFFFFFF` will remove any tint effect.
		*
		* Null for non-MeshMaterial shaders
		* @default 0xFFFFFF
		*/
		get: function() {
			return "tint" in this.shader ? this.shader.tint : null;
		},
		set: function(value) {
			this.shader.tint = value;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Mesh.prototype, "texture", {
		/** The texture that the Mesh uses. Null for non-MeshMaterial shaders */
		get: function() {
			return "texture" in this.shader ? this.shader.texture : null;
		},
		set: function(value) {
			this.shader.texture = value;
		},
		enumerable: false,
		configurable: true
	});
	/**
	* Standard renderer draw.
	* @param renderer - Instance to renderer.
	*/
	Mesh.prototype._render = function(renderer) {
		var vertices = this.geometry.buffers[0].data;
		if (this.shader.batchable && this.drawMode === DRAW_MODES.TRIANGLES && vertices.length < Mesh.BATCHABLE_SIZE * 2) this._renderToBatch(renderer);
		else this._renderDefault(renderer);
	};
	/**
	* Standard non-batching way of rendering.
	* @param renderer - Instance to renderer.
	*/
	Mesh.prototype._renderDefault = function(renderer) {
		var shader = this.shader;
		shader.alpha = this.worldAlpha;
		if (shader.update) shader.update();
		renderer.batch.flush();
		shader.uniforms.translationMatrix = this.transform.worldTransform.toArray(true);
		renderer.shader.bind(shader);
		renderer.state.set(this.state);
		renderer.geometry.bind(this.geometry, shader);
		renderer.geometry.draw(this.drawMode, this.size, this.start, this.geometry.instanceCount);
	};
	/**
	* Rendering by using the Batch system.
	* @param renderer - Instance to renderer.
	*/
	Mesh.prototype._renderToBatch = function(renderer) {
		var geometry = this.geometry;
		var shader = this.shader;
		if (shader.uvMatrix) {
			shader.uvMatrix.update();
			this.calculateUvs();
		}
		this.calculateVertices();
		this.indices = geometry.indexBuffer.data;
		this._tintRGB = shader._tintRGB;
		this._texture = shader.texture;
		var pluginName = this.material.pluginName;
		renderer.batch.setObjectRenderer(renderer.plugins[pluginName]);
		renderer.plugins[pluginName].render(this);
	};
	/** Updates vertexData field based on transform and vertices. */
	Mesh.prototype.calculateVertices = function() {
		var verticesBuffer = this.geometry.buffers[0];
		var vertices = verticesBuffer.data;
		var vertexDirtyId = verticesBuffer._updateID;
		if (vertexDirtyId === this.vertexDirty && this._transformID === this.transform._worldID) return;
		this._transformID = this.transform._worldID;
		if (this.vertexData.length !== vertices.length) this.vertexData = new Float32Array(vertices.length);
		var wt = this.transform.worldTransform;
		var a = wt.a;
		var b = wt.b;
		var c = wt.c;
		var d = wt.d;
		var tx = wt.tx;
		var ty = wt.ty;
		var vertexData = this.vertexData;
		for (var i = 0; i < vertexData.length / 2; i++) {
			var x = vertices[i * 2];
			var y = vertices[i * 2 + 1];
			vertexData[i * 2] = a * x + c * y + tx;
			vertexData[i * 2 + 1] = b * x + d * y + ty;
		}
		if (this._roundPixels) {
			var resolution = settings.RESOLUTION;
			for (var i = 0; i < vertexData.length; ++i) vertexData[i] = Math.round((vertexData[i] * resolution | 0) / resolution);
		}
		this.vertexDirty = vertexDirtyId;
	};
	/** Updates uv field based on from geometry uv's or batchUvs. */
	Mesh.prototype.calculateUvs = function() {
		var geomUvs = this.geometry.buffers[1];
		var shader = this.shader;
		if (!shader.uvMatrix.isSimple) {
			if (!this.batchUvs) this.batchUvs = new MeshBatchUvs(geomUvs, shader.uvMatrix);
			this.batchUvs.update();
			this.uvs = this.batchUvs.data;
		} else this.uvs = geomUvs.data;
	};
	/**
	* Updates the bounds of the mesh as a rectangle. The bounds calculation takes the worldTransform into account.
	* there must be a aVertexPosition attribute present in the geometry for bounds to be calculated correctly.
	*/
	Mesh.prototype._calculateBounds = function() {
		this.calculateVertices();
		this._bounds.addVertexData(this.vertexData, 0, this.vertexData.length);
	};
	/**
	* Tests if a point is inside this mesh. Works only for PIXI.DRAW_MODES.TRIANGLES.
	* @param point - The point to test.
	* @returns - The result of the test.
	*/
	Mesh.prototype.containsPoint = function(point) {
		if (!this.getBounds().contains(point.x, point.y)) return false;
		this.worldTransform.applyInverse(point, tempPoint);
		var vertices = this.geometry.getBuffer("aVertexPosition").data;
		var points = tempPolygon.points;
		var indices = this.geometry.getIndex().data;
		var len = indices.length;
		var step = this.drawMode === 4 ? 3 : 1;
		for (var i = 0; i + 2 < len; i += step) {
			var ind0 = indices[i] * 2;
			var ind1 = indices[i + 1] * 2;
			var ind2 = indices[i + 2] * 2;
			points[0] = vertices[ind0];
			points[1] = vertices[ind0 + 1];
			points[2] = vertices[ind1];
			points[3] = vertices[ind1 + 1];
			points[4] = vertices[ind2];
			points[5] = vertices[ind2 + 1];
			if (tempPolygon.contains(tempPoint.x, tempPoint.y)) return true;
		}
		return false;
	};
	Mesh.prototype.destroy = function(options) {
		_super.prototype.destroy.call(this, options);
		if (this._cachedTexture) {
			this._cachedTexture.destroy();
			this._cachedTexture = null;
		}
		this.geometry = null;
		this.shader = null;
		this.state = null;
		this.uvs = null;
		this.indices = null;
		this.vertexData = null;
	};
	/** The maximum number of vertices to consider batchable. Generally, the complexity of the geometry. */
	Mesh.BATCHABLE_SIZE = 100;
	return Mesh;
}(Container);
var fragment$5 = "varying vec2 vTextureCoord;\nuniform vec4 uColor;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord) * uColor;\n}\n";
var vertex$2 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTextureMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = (uTextureMatrix * vec3(aTextureCoord, 1.0)).xy;\n}\n";
/**
* Slightly opinionated default shader for PixiJS 2D objects.
* @memberof PIXI
*/
var MeshMaterial = function(_super) {
	__extends$9(MeshMaterial, _super);
	/**
	* @param uSampler - Texture that material uses to render.
	* @param options - Additional options
	* @param {number} [options.alpha=1] - Default alpha.
	* @param {number} [options.tint=0xFFFFFF] - Default tint.
	* @param {string} [options.pluginName='batch'] - Renderer plugin for batching.
	* @param {PIXI.Program} [options.program=0xFFFFFF] - Custom program.
	* @param {object} [options.uniforms] - Custom uniforms.
	*/
	function MeshMaterial(uSampler, options) {
		var _this = this;
		var uniforms = {
			uSampler,
			alpha: 1,
			uTextureMatrix: Matrix.IDENTITY,
			uColor: new Float32Array([
				1,
				1,
				1,
				1
			])
		};
		options = Object.assign({
			tint: 16777215,
			alpha: 1,
			pluginName: "batch"
		}, options);
		if (options.uniforms) Object.assign(uniforms, options.uniforms);
		_this = _super.call(this, options.program || Program.from(vertex$2, fragment$5), uniforms) || this;
		_this._colorDirty = false;
		_this.uvMatrix = new TextureMatrix(uSampler);
		_this.batchable = options.program === void 0;
		_this.pluginName = options.pluginName;
		_this.tint = options.tint;
		_this.alpha = options.alpha;
		return _this;
	}
	Object.defineProperty(MeshMaterial.prototype, "texture", {
		/** Reference to the texture being rendered. */
		get: function() {
			return this.uniforms.uSampler;
		},
		set: function(value) {
			if (this.uniforms.uSampler !== value) {
				if (!this.uniforms.uSampler.baseTexture.alphaMode !== !value.baseTexture.alphaMode) this._colorDirty = true;
				this.uniforms.uSampler = value;
				this.uvMatrix.texture = value;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(MeshMaterial.prototype, "alpha", {
		get: function() {
			return this._alpha;
		},
		/**
		* This gets automatically set by the object using this.
		* @default 1
		*/
		set: function(value) {
			if (value === this._alpha) return;
			this._alpha = value;
			this._colorDirty = true;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(MeshMaterial.prototype, "tint", {
		get: function() {
			return this._tint;
		},
		/**
		* Multiply tint for the material.
		* @default 0xFFFFFF
		*/
		set: function(value) {
			if (value === this._tint) return;
			this._tint = value;
			this._tintRGB = (value >> 16) + (value & 65280) + ((value & 255) << 16);
			this._colorDirty = true;
		},
		enumerable: false,
		configurable: true
	});
	/** Gets called automatically by the Mesh. Intended to be overridden for custom {@link MeshMaterial} objects. */
	MeshMaterial.prototype.update = function() {
		if (this._colorDirty) {
			this._colorDirty = false;
			var baseTexture = this.texture.baseTexture;
			premultiplyTintToRgba(this._tint, this._alpha, this.uniforms.uColor, baseTexture.alphaMode);
		}
		if (this.uvMatrix.update()) this.uniforms.uTextureMatrix = this.uvMatrix.mapCoord;
	};
	return MeshMaterial;
}(Shader);
/**
* Standard 2D geometry used in PixiJS.
*
* Geometry can be defined without passing in a style or data if required.
*
* ```js
* const geometry = new PIXI.Geometry();
*
* geometry.addAttribute('positions', [0, 0, 100, 0, 100, 100, 0, 100], 2);
* geometry.addAttribute('uvs', [0,0,1,0,1,1,0,1], 2);
* geometry.addIndex([0,1,2,1,3,2]);
*
* ```
* @memberof PIXI
*/
var MeshGeometry = function(_super) {
	__extends$9(MeshGeometry, _super);
	/**
	* @param {Float32Array|number[]} [vertices] - Positional data on geometry.
	* @param {Float32Array|number[]} [uvs] - Texture UVs.
	* @param {Uint16Array|number[]} [index] - IndexBuffer
	*/
	function MeshGeometry(vertices, uvs, index) {
		var _this = _super.call(this) || this;
		var verticesBuffer = new Buffer(vertices);
		var uvsBuffer = new Buffer(uvs, true);
		var indexBuffer = new Buffer(index, true, true);
		_this.addAttribute("aVertexPosition", verticesBuffer, 2, false, TYPES.FLOAT).addAttribute("aTextureCoord", uvsBuffer, 2, false, TYPES.FLOAT).addIndex(indexBuffer);
		_this._updateId = -1;
		return _this;
	}
	Object.defineProperty(MeshGeometry.prototype, "vertexDirtyId", {
		/**
		* If the vertex position is updated.
		* @readonly
		* @private
		*/
		get: function() {
			return this.buffers[0]._updateID;
		},
		enumerable: false,
		configurable: true
	});
	return MeshGeometry;
}(Geometry);
//#endregion
//#region node_modules/@pixi/text-bitmap/dist/esm/text-bitmap.mjs
/*!
* @pixi/text-bitmap - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/text-bitmap is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics$8 = function(d, b) {
	extendStatics$8 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
		d.__proto__ = b;
	} || function(d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	};
	return extendStatics$8(d, b);
};
function __extends$8(d, b) {
	extendStatics$8(d, b);
	function __() {
		this.constructor = d;
	}
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
/**
* Normalized parsed data from .fnt files.
* @memberof PIXI
*/
var BitmapFontData = function() {
	function BitmapFontData() {
		this.info = [];
		this.common = [];
		this.page = [];
		this.char = [];
		this.kerning = [];
		this.distanceField = [];
	}
	return BitmapFontData;
}();
/**
* BitmapFont format that's Text-based.
* @private
*/
var TextFormat = function() {
	function TextFormat() {}
	/**
	* Check if resource refers to txt font data.
	* @param data
	* @returns - True if resource could be treated as font data, false otherwise.
	*/
	TextFormat.test = function(data) {
		return typeof data === "string" && data.indexOf("info face=") === 0;
	};
	/**
	* Convert text font data to a javascript object.
	* @param txt - Raw string data to be converted
	* @returns - Parsed font data
	*/
	TextFormat.parse = function(txt) {
		var items = txt.match(/^[a-z]+\s+.+$/gm);
		var rawData = {
			info: [],
			common: [],
			page: [],
			char: [],
			chars: [],
			kerning: [],
			kernings: [],
			distanceField: []
		};
		for (var i in items) {
			var name = items[i].match(/^[a-z]+/gm)[0];
			var attributeList = items[i].match(/[a-zA-Z]+=([^\s"']+|"([^"]*)")/gm);
			var itemData = {};
			for (var i_1 in attributeList) {
				var split = attributeList[i_1].split("=");
				var key = split[0];
				var strValue = split[1].replace(/"/gm, "");
				var floatValue = parseFloat(strValue);
				itemData[key] = isNaN(floatValue) ? strValue : floatValue;
			}
			rawData[name].push(itemData);
		}
		var font = new BitmapFontData();
		rawData.info.forEach(function(info) {
			return font.info.push({
				face: info.face,
				size: parseInt(info.size, 10)
			});
		});
		rawData.common.forEach(function(common) {
			return font.common.push({ lineHeight: parseInt(common.lineHeight, 10) });
		});
		rawData.page.forEach(function(page) {
			return font.page.push({
				id: parseInt(page.id, 10),
				file: page.file
			});
		});
		rawData.char.forEach(function(char) {
			return font.char.push({
				id: parseInt(char.id, 10),
				page: parseInt(char.page, 10),
				x: parseInt(char.x, 10),
				y: parseInt(char.y, 10),
				width: parseInt(char.width, 10),
				height: parseInt(char.height, 10),
				xoffset: parseInt(char.xoffset, 10),
				yoffset: parseInt(char.yoffset, 10),
				xadvance: parseInt(char.xadvance, 10)
			});
		});
		rawData.kerning.forEach(function(kerning) {
			return font.kerning.push({
				first: parseInt(kerning.first, 10),
				second: parseInt(kerning.second, 10),
				amount: parseInt(kerning.amount, 10)
			});
		});
		rawData.distanceField.forEach(function(df) {
			return font.distanceField.push({
				distanceRange: parseInt(df.distanceRange, 10),
				fieldType: df.fieldType
			});
		});
		return font;
	};
	return TextFormat;
}();
/**
* BitmapFont format that's XML-based.
* @private
*/
var XMLFormat = function() {
	function XMLFormat() {}
	/**
	* Check if resource refers to xml font data.
	* @param data
	* @returns - True if resource could be treated as font data, false otherwise.
	*/
	XMLFormat.test = function(data) {
		return data instanceof XMLDocument && data.getElementsByTagName("page").length && data.getElementsByTagName("info")[0].getAttribute("face") !== null;
	};
	/**
	* Convert the XML into BitmapFontData that we can use.
	* @param xml
	* @returns - Data to use for BitmapFont
	*/
	XMLFormat.parse = function(xml) {
		var data = new BitmapFontData();
		var info = xml.getElementsByTagName("info");
		var common = xml.getElementsByTagName("common");
		var page = xml.getElementsByTagName("page");
		var char = xml.getElementsByTagName("char");
		var kerning = xml.getElementsByTagName("kerning");
		var distanceField = xml.getElementsByTagName("distanceField");
		for (var i = 0; i < info.length; i++) data.info.push({
			face: info[i].getAttribute("face"),
			size: parseInt(info[i].getAttribute("size"), 10)
		});
		for (var i = 0; i < common.length; i++) data.common.push({ lineHeight: parseInt(common[i].getAttribute("lineHeight"), 10) });
		for (var i = 0; i < page.length; i++) data.page.push({
			id: parseInt(page[i].getAttribute("id"), 10) || 0,
			file: page[i].getAttribute("file")
		});
		for (var i = 0; i < char.length; i++) {
			var letter = char[i];
			data.char.push({
				id: parseInt(letter.getAttribute("id"), 10),
				page: parseInt(letter.getAttribute("page"), 10) || 0,
				x: parseInt(letter.getAttribute("x"), 10),
				y: parseInt(letter.getAttribute("y"), 10),
				width: parseInt(letter.getAttribute("width"), 10),
				height: parseInt(letter.getAttribute("height"), 10),
				xoffset: parseInt(letter.getAttribute("xoffset"), 10),
				yoffset: parseInt(letter.getAttribute("yoffset"), 10),
				xadvance: parseInt(letter.getAttribute("xadvance"), 10)
			});
		}
		for (var i = 0; i < kerning.length; i++) data.kerning.push({
			first: parseInt(kerning[i].getAttribute("first"), 10),
			second: parseInt(kerning[i].getAttribute("second"), 10),
			amount: parseInt(kerning[i].getAttribute("amount"), 10)
		});
		for (var i = 0; i < distanceField.length; i++) data.distanceField.push({
			fieldType: distanceField[i].getAttribute("fieldType"),
			distanceRange: parseInt(distanceField[i].getAttribute("distanceRange"), 10)
		});
		return data;
	};
	return XMLFormat;
}();
/**
* BitmapFont format that's XML-based.
* @private
*/
var XMLStringFormat = function() {
	function XMLStringFormat() {}
	/**
	* Check if resource refers to text xml font data.
	* @param data
	* @returns - True if resource could be treated as font data, false otherwise.
	*/
	XMLStringFormat.test = function(data) {
		if (typeof data === "string" && data.indexOf("<font>") > -1) {
			var xml = new globalThis.DOMParser().parseFromString(data, "text/xml");
			return XMLFormat.test(xml);
		}
		return false;
	};
	/**
	* Convert the text XML into BitmapFontData that we can use.
	* @param xmlTxt
	* @returns - Data to use for BitmapFont
	*/
	XMLStringFormat.parse = function(xmlTxt) {
		var xml = new globalThis.DOMParser().parseFromString(xmlTxt, "text/xml");
		return XMLFormat.parse(xml);
	};
	return XMLStringFormat;
}();
var formats = [
	TextFormat,
	XMLFormat,
	XMLStringFormat
];
/**
* Auto-detect BitmapFont parsing format based on data.
* @private
* @param {any} data - Data to detect format
* @returns {any} Format or null
*/
function autoDetectFormat(data) {
	for (var i = 0; i < formats.length; i++) if (formats[i].test(data)) return formats[i];
	return null;
}
/**
* Generates the fill style. Can automatically generate a gradient based on the fill style being an array
* @private
* @param canvas
* @param context
* @param {object} style - The style.
* @param resolution
* @param {string[]} lines - The lines of text.
* @param metrics
* @returns {string|number|CanvasGradient} The fill style
*/
function generateFillStyle(canvas, context, style, resolution, lines, metrics) {
	var fillStyle = style.fill;
	if (!Array.isArray(fillStyle)) return fillStyle;
	else if (fillStyle.length === 1) return fillStyle[0];
	var gradient;
	var dropShadowCorrection = style.dropShadow ? style.dropShadowDistance : 0;
	var padding = style.padding || 0;
	var width = canvas.width / resolution - dropShadowCorrection - padding * 2;
	var height = canvas.height / resolution - dropShadowCorrection - padding * 2;
	var fill = fillStyle.slice();
	var fillGradientStops = style.fillGradientStops.slice();
	if (!fillGradientStops.length) {
		var lengthPlus1 = fill.length + 1;
		for (var i = 1; i < lengthPlus1; ++i) fillGradientStops.push(i / lengthPlus1);
	}
	fill.unshift(fillStyle[0]);
	fillGradientStops.unshift(0);
	fill.push(fillStyle[fillStyle.length - 1]);
	fillGradientStops.push(1);
	if (style.fillGradientType === TEXT_GRADIENT.LINEAR_VERTICAL) {
		gradient = context.createLinearGradient(width / 2, padding, width / 2, height + padding);
		var lastIterationStop = 0;
		var gradStopLineHeight = (metrics.fontProperties.fontSize + style.strokeThickness) / height;
		for (var i = 0; i < lines.length; i++) {
			var thisLineTop = metrics.lineHeight * i;
			for (var j = 0; j < fill.length; j++) {
				var lineStop = 0;
				if (typeof fillGradientStops[j] === "number") lineStop = fillGradientStops[j];
				else lineStop = j / fill.length;
				var globalStop = thisLineTop / height + lineStop * gradStopLineHeight;
				var clampedStop = Math.max(lastIterationStop, globalStop);
				clampedStop = Math.min(clampedStop, 1);
				gradient.addColorStop(clampedStop, fill[j]);
				lastIterationStop = clampedStop;
			}
		}
	} else {
		gradient = context.createLinearGradient(padding, height / 2, width + padding, height / 2);
		var totalIterations = fill.length + 1;
		var currentIteration = 1;
		for (var i = 0; i < fill.length; i++) {
			var stop = void 0;
			if (typeof fillGradientStops[i] === "number") stop = fillGradientStops[i];
			else stop = currentIteration / totalIterations;
			gradient.addColorStop(stop, fill[i]);
			currentIteration++;
		}
	}
	return gradient;
}
/**
* Draws the glyph `metrics.text` on the given canvas.
*
* Ignored because not directly exposed.
* @ignore
* @param {HTMLCanvasElement} canvas
* @param {CanvasRenderingContext2D} context
* @param {TextMetrics} metrics
* @param {number} x
* @param {number} y
* @param {number} resolution
* @param {TextStyle} style
*/
function drawGlyph(canvas, context, metrics, x, y, resolution, style) {
	var char = metrics.text;
	var fontProperties = metrics.fontProperties;
	context.translate(x, y);
	context.scale(resolution, resolution);
	var tx = style.strokeThickness / 2;
	var ty = -(style.strokeThickness / 2);
	context.font = style.toFontString();
	context.lineWidth = style.strokeThickness;
	context.textBaseline = style.textBaseline;
	context.lineJoin = style.lineJoin;
	context.miterLimit = style.miterLimit;
	context.fillStyle = generateFillStyle(canvas, context, style, resolution, [char], metrics);
	context.strokeStyle = style.stroke;
	if (style.dropShadow) {
		var dropShadowColor = style.dropShadowColor;
		var rgb = hex2rgb(typeof dropShadowColor === "number" ? dropShadowColor : string2hex(dropShadowColor));
		var dropShadowBlur = style.dropShadowBlur * resolution;
		var dropShadowDistance = style.dropShadowDistance * resolution;
		context.shadowColor = "rgba(" + rgb[0] * 255 + "," + rgb[1] * 255 + "," + rgb[2] * 255 + "," + style.dropShadowAlpha + ")";
		context.shadowBlur = dropShadowBlur;
		context.shadowOffsetX = Math.cos(style.dropShadowAngle) * dropShadowDistance;
		context.shadowOffsetY = Math.sin(style.dropShadowAngle) * dropShadowDistance;
	} else {
		context.shadowColor = "black";
		context.shadowBlur = 0;
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
	}
	if (style.stroke && style.strokeThickness) context.strokeText(char, tx, ty + metrics.lineHeight - fontProperties.descent);
	if (style.fill) context.fillText(char, tx, ty + metrics.lineHeight - fontProperties.descent);
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.fillStyle = "rgba(0, 0, 0, 0)";
}
/**
* Ponyfill for IE because it doesn't support `Array.from`
* @param text
* @private
*/
function splitTextToCharacters(text) {
	return Array.from ? Array.from(text) : text.split("");
}
/**
* Processes the passed character set data and returns a flattened array of all the characters.
*
* Ignored because not directly exposed.
* @ignore
* @param {string | string[] | string[][] } chars
* @returns {string[]} the flattened array of characters
*/
function resolveCharacters(chars) {
	if (typeof chars === "string") chars = [chars];
	var result = [];
	for (var i = 0, j = chars.length; i < j; i++) {
		var item = chars[i];
		if (Array.isArray(item)) {
			if (item.length !== 2) throw new Error("[BitmapFont]: Invalid character range length, expecting 2 got " + item.length + ".");
			var startCode = item[0].charCodeAt(0);
			var endCode = item[1].charCodeAt(0);
			if (endCode < startCode) throw new Error("[BitmapFont]: Invalid character range.");
			for (var i_1 = startCode, j_1 = endCode; i_1 <= j_1; i_1++) result.push(String.fromCharCode(i_1));
		} else result.push.apply(result, splitTextToCharacters(item));
	}
	if (result.length === 0) throw new Error("[BitmapFont]: Empty set when resolving characters.");
	return result;
}
/**
* Ponyfill for IE because it doesn't support `codePointAt`
* @param str
* @private
*/
function extractCharCode(str) {
	return str.codePointAt ? str.codePointAt(0) : str.charCodeAt(0);
}
/**
* BitmapFont represents a typeface available for use with the BitmapText class. Use the `install`
* method for adding a font to be used.
* @memberof PIXI
*/
var BitmapFont = function() {
	/**
	* @param data
	* @param textures
	* @param ownsTextures - Setting to `true` will destroy page textures
	*        when the font is uninstalled.
	*/
	function BitmapFont(data, textures, ownsTextures) {
		var _a, _b;
		var info = data.info[0];
		var common = data.common[0];
		var page = data.page[0];
		var distanceField = data.distanceField[0];
		var res = getResolutionOfUrl(page.file);
		var pageTextures = {};
		this._ownsTextures = ownsTextures;
		this.font = info.face;
		this.size = info.size;
		this.lineHeight = common.lineHeight / res;
		this.chars = {};
		this.pageTextures = pageTextures;
		for (var i = 0; i < data.page.length; i++) {
			var _c = data.page[i], id = _c.id, file = _c.file;
			pageTextures[id] = textures instanceof Array ? textures[i] : textures[file];
			if ((distanceField === null || distanceField === void 0 ? void 0 : distanceField.fieldType) && distanceField.fieldType !== "none") {
				pageTextures[id].baseTexture.alphaMode = ALPHA_MODES.NO_PREMULTIPLIED_ALPHA;
				pageTextures[id].baseTexture.mipmap = MIPMAP_MODES.OFF;
			}
		}
		for (var i = 0; i < data.char.length; i++) {
			var _d = data.char[i], id = _d.id, page_1 = _d.page;
			var _e = data.char[i], x = _e.x, y = _e.y, width = _e.width, height = _e.height, xoffset = _e.xoffset, yoffset = _e.yoffset, xadvance = _e.xadvance;
			x /= res;
			y /= res;
			width /= res;
			height /= res;
			xoffset /= res;
			yoffset /= res;
			xadvance /= res;
			var rect = new Rectangle(x + pageTextures[page_1].frame.x / res, y + pageTextures[page_1].frame.y / res, width, height);
			this.chars[id] = {
				xOffset: xoffset,
				yOffset: yoffset,
				xAdvance: xadvance,
				kerning: {},
				texture: new Texture(pageTextures[page_1].baseTexture, rect),
				page: page_1
			};
		}
		for (var i = 0; i < data.kerning.length; i++) {
			var _f = data.kerning[i], first = _f.first, second = _f.second, amount = _f.amount;
			first /= res;
			second /= res;
			amount /= res;
			if (this.chars[second]) this.chars[second].kerning[first] = amount;
		}
		this.distanceFieldRange = distanceField === null || distanceField === void 0 ? void 0 : distanceField.distanceRange;
		this.distanceFieldType = (_b = (_a = distanceField === null || distanceField === void 0 ? void 0 : distanceField.fieldType) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : "none";
	}
	/** Remove references to created glyph textures. */
	BitmapFont.prototype.destroy = function() {
		for (var id in this.chars) {
			this.chars[id].texture.destroy();
			this.chars[id].texture = null;
		}
		for (var id in this.pageTextures) {
			if (this._ownsTextures) this.pageTextures[id].destroy(true);
			this.pageTextures[id] = null;
		}
		this.chars = null;
		this.pageTextures = null;
	};
	/**
	* Register a new bitmap font.
	* @param data - The
	*        characters map that could be provided as xml or raw string.
	* @param textures - List of textures for each page.
	* @param ownsTextures - Set to `true` to destroy page textures
	*        when the font is uninstalled. By default fonts created with
	*        `BitmapFont.from` or from the `BitmapFontLoader` are `true`.
	* @returns {PIXI.BitmapFont} Result font object with font, size, lineHeight
	*         and char fields.
	*/
	BitmapFont.install = function(data, textures, ownsTextures) {
		var fontData;
		if (data instanceof BitmapFontData) fontData = data;
		else {
			var format = autoDetectFormat(data);
			if (!format) throw new Error("Unrecognized data format for font.");
			fontData = format.parse(data);
		}
		if (textures instanceof Texture) textures = [textures];
		var font = new BitmapFont(fontData, textures, ownsTextures);
		BitmapFont.available[font.font] = font;
		return font;
	};
	/**
	* Remove bitmap font by name.
	* @param name - Name of the font to uninstall.
	*/
	BitmapFont.uninstall = function(name) {
		var font = BitmapFont.available[name];
		if (!font) throw new Error("No font found named '" + name + "'");
		font.destroy();
		delete BitmapFont.available[name];
	};
	/**
	* Generates a bitmap-font for the given style and character set. This does not support
	* kernings yet. With `style` properties, only the following non-layout properties are used:
	*
	* - {@link PIXI.TextStyle#dropShadow|dropShadow}
	* - {@link PIXI.TextStyle#dropShadowDistance|dropShadowDistance}
	* - {@link PIXI.TextStyle#dropShadowColor|dropShadowColor}
	* - {@link PIXI.TextStyle#dropShadowBlur|dropShadowBlur}
	* - {@link PIXI.TextStyle#dropShadowAngle|dropShadowAngle}
	* - {@link PIXI.TextStyle#fill|fill}
	* - {@link PIXI.TextStyle#fillGradientStops|fillGradientStops}
	* - {@link PIXI.TextStyle#fillGradientType|fillGradientType}
	* - {@link PIXI.TextStyle#fontFamily|fontFamily}
	* - {@link PIXI.TextStyle#fontSize|fontSize}
	* - {@link PIXI.TextStyle#fontVariant|fontVariant}
	* - {@link PIXI.TextStyle#fontWeight|fontWeight}
	* - {@link PIXI.TextStyle#lineJoin|lineJoin}
	* - {@link PIXI.TextStyle#miterLimit|miterLimit}
	* - {@link PIXI.TextStyle#stroke|stroke}
	* - {@link PIXI.TextStyle#strokeThickness|strokeThickness}
	* - {@link PIXI.TextStyle#textBaseline|textBaseline}
	* @param name - The name of the custom font to use with BitmapText.
	* @param textStyle - Style options to render with BitmapFont.
	* @param options - Setup options for font or name of the font.
	* @param {string|string[]|string[][]} [options.chars=PIXI.BitmapFont.ALPHANUMERIC] - characters included
	*      in the font set. You can also use ranges. For example, `[['a', 'z'], ['A', 'Z'], "!@#$%^&*()~{}[] "]`.
	*      Don't forget to include spaces ' ' in your character set!
	* @param {number} [options.resolution=1] - Render resolution for glyphs.
	* @param {number} [options.textureWidth=512] - Optional width of atlas, smaller values to reduce memory.
	* @param {number} [options.textureHeight=512] - Optional height of atlas, smaller values to reduce memory.
	* @param {number} [options.padding=4] - Padding between glyphs on texture atlas.
	* @returns Font generated by style options.
	* @example
	* PIXI.BitmapFont.from("TitleFont", {
	*     fontFamily: "Arial",
	*     fontSize: 12,
	*     strokeThickness: 2,
	*     fill: "purple"
	* });
	*
	* const title = new PIXI.BitmapText("This is the title", { fontName: "TitleFont" });
	*/
	BitmapFont.from = function(name, textStyle, options) {
		if (!name) throw new Error("[BitmapFont] Property `name` is required.");
		var _a = Object.assign({}, BitmapFont.defaultOptions, options), chars = _a.chars, padding = _a.padding, resolution = _a.resolution, textureWidth = _a.textureWidth, textureHeight = _a.textureHeight;
		var charsList = resolveCharacters(chars);
		var style = textStyle instanceof TextStyle ? textStyle : new TextStyle(textStyle);
		var lineWidth = textureWidth;
		var fontData = new BitmapFontData();
		fontData.info[0] = {
			face: style.fontFamily,
			size: style.fontSize
		};
		fontData.common[0] = { lineHeight: style.fontSize };
		var positionX = 0;
		var positionY = 0;
		var canvas;
		var context;
		var baseTexture;
		var maxCharHeight = 0;
		var textures = [];
		for (var i = 0; i < charsList.length; i++) {
			if (!canvas) {
				canvas = settings.ADAPTER.createCanvas();
				canvas.width = textureWidth;
				canvas.height = textureHeight;
				context = canvas.getContext("2d");
				baseTexture = new BaseTexture(canvas, { resolution });
				textures.push(new Texture(baseTexture));
				fontData.page.push({
					id: textures.length - 1,
					file: ""
				});
			}
			var character = charsList[i];
			var metrics = TextMetrics.measureText(character, style, false, canvas);
			var width = metrics.width;
			var height = Math.ceil(metrics.height);
			var textureGlyphWidth = Math.ceil((style.fontStyle === "italic" ? 2 : 1) * width);
			if (positionY >= textureHeight - height * resolution) {
				if (positionY === 0) throw new Error("[BitmapFont] textureHeight " + textureHeight + "px is too small " + ("(fontFamily: '" + style.fontFamily + "', fontSize: " + style.fontSize + "px, char: '" + character + "')"));
				--i;
				canvas = null;
				context = null;
				baseTexture = null;
				positionY = 0;
				positionX = 0;
				maxCharHeight = 0;
				continue;
			}
			maxCharHeight = Math.max(height + metrics.fontProperties.descent, maxCharHeight);
			if (textureGlyphWidth * resolution + positionX >= lineWidth) {
				if (positionX === 0) throw new Error("[BitmapFont] textureWidth " + textureWidth + "px is too small " + ("(fontFamily: '" + style.fontFamily + "', fontSize: " + style.fontSize + "px, char: '" + character + "')"));
				--i;
				positionY += maxCharHeight * resolution;
				positionY = Math.ceil(positionY);
				positionX = 0;
				maxCharHeight = 0;
				continue;
			}
			drawGlyph(canvas, context, metrics, positionX, positionY, resolution, style);
			var id = extractCharCode(metrics.text);
			fontData.char.push({
				id,
				page: textures.length - 1,
				x: positionX / resolution,
				y: positionY / resolution,
				width: textureGlyphWidth,
				height,
				xoffset: 0,
				yoffset: 0,
				xadvance: Math.ceil(width - (style.dropShadow ? style.dropShadowDistance : 0) - (style.stroke ? style.strokeThickness : 0))
			});
			positionX += (textureGlyphWidth + 2 * padding) * resolution;
			positionX = Math.ceil(positionX);
		}
		if (!(options === null || options === void 0 ? void 0 : options.skipKerning)) for (var i = 0, len = charsList.length; i < len; i++) {
			var first = charsList[i];
			for (var j = 0; j < len; j++) {
				var second = charsList[j];
				var c1 = context.measureText(first).width;
				var c2 = context.measureText(second).width;
				var amount = context.measureText(first + second).width - (c1 + c2);
				if (amount) fontData.kerning.push({
					first: extractCharCode(first),
					second: extractCharCode(second),
					amount
				});
			}
		}
		var font = new BitmapFont(fontData, textures, true);
		if (BitmapFont.available[name] !== void 0) BitmapFont.uninstall(name);
		BitmapFont.available[name] = font;
		return font;
	};
	/**
	* This character set includes all the letters in the alphabet (both lower- and upper- case).
	* @type {string[][]}
	* @example
	* BitmapFont.from("ExampleFont", style, { chars: BitmapFont.ALPHA })
	*/
	BitmapFont.ALPHA = [
		["a", "z"],
		["A", "Z"],
		" "
	];
	/**
	* This character set includes all decimal digits (from 0 to 9).
	* @type {string[][]}
	* @example
	* BitmapFont.from("ExampleFont", style, { chars: BitmapFont.NUMERIC })
	*/
	BitmapFont.NUMERIC = [["0", "9"]];
	/**
	* This character set is the union of `BitmapFont.ALPHA` and `BitmapFont.NUMERIC`.
	* @type {string[][]}
	*/
	BitmapFont.ALPHANUMERIC = [
		["a", "z"],
		["A", "Z"],
		["0", "9"],
		" "
	];
	/**
	* This character set consists of all the ASCII table.
	* @member {string[][]}
	* @see http://www.asciitable.com/
	*/
	BitmapFont.ASCII = [[" ", "~"]];
	/**
	* Collection of default options when using `BitmapFont.from`.
	* @property {number} [resolution=1] -
	* @property {number} [textureWidth=512] -
	* @property {number} [textureHeight=512] -
	* @property {number} [padding=4] -
	* @property {string|string[]|string[][]} chars = PIXI.BitmapFont.ALPHANUMERIC
	*/
	BitmapFont.defaultOptions = {
		resolution: 1,
		textureWidth: 512,
		textureHeight: 512,
		padding: 4,
		chars: BitmapFont.ALPHANUMERIC
	};
	/** Collection of available/installed fonts. */
	BitmapFont.available = {};
	return BitmapFont;
}();
var msdfFrag = "// Pixi texture info\r\nvarying vec2 vTextureCoord;\r\nuniform sampler2D uSampler;\r\n\r\n// Tint\r\nuniform vec4 uColor;\r\n\r\n// on 2D applications fwidth is screenScale / glyphAtlasScale * distanceFieldRange\r\nuniform float uFWidth;\r\n\r\nvoid main(void) {\r\n\r\n  // To stack MSDF and SDF we need a non-pre-multiplied-alpha texture.\r\n  vec4 texColor = texture2D(uSampler, vTextureCoord);\r\n\r\n  // MSDF\r\n  float median = texColor.r + texColor.g + texColor.b -\r\n                  min(texColor.r, min(texColor.g, texColor.b)) -\r\n                  max(texColor.r, max(texColor.g, texColor.b));\r\n  // SDF\r\n  median = min(median, texColor.a);\r\n\r\n  float screenPxDistance = uFWidth * (median - 0.5);\r\n  float alpha = clamp(screenPxDistance + 0.5, 0.0, 1.0);\r\n  if (median < 0.01) {\r\n    alpha = 0.0;\r\n  } else if (median > 0.99) {\r\n    alpha = 1.0;\r\n  }\r\n\r\n  // NPM Textures, NPM outputs\r\n  gl_FragColor = vec4(uColor.rgb, uColor.a * alpha);\r\n\r\n}\r\n";
var msdfVert = "// Mesh material default fragment\r\nattribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\n\r\nuniform mat3 projectionMatrix;\r\nuniform mat3 translationMatrix;\r\nuniform mat3 uTextureMatrix;\r\n\r\nvarying vec2 vTextureCoord;\r\n\r\nvoid main(void)\r\n{\r\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\r\n\r\n    vTextureCoord = (uTextureMatrix * vec3(aTextureCoord, 1.0)).xy;\r\n}\r\n";
var pageMeshDataDefaultPageMeshData = [];
var pageMeshDataMSDFPageMeshData = [];
var charRenderDataPool = [];
/**
* A BitmapText object will create a line or multiple lines of text using bitmap font.
*
* The primary advantage of this class over Text is that all of your textures are pre-generated and loading,
* meaning that rendering is fast, and changing text has no performance implications.
*
* Supporting character sets other than latin, such as CJK languages, may be impractical due to the number of characters.
*
* To split a line you can use '\n', '\r' or '\r\n' in your string.
*
* PixiJS can auto-generate fonts on-the-fly using BitmapFont or use fnt files provided by:
* http://www.angelcode.com/products/bmfont/ for Windows or
* http://www.bmglyph.com/ for Mac.
*
* You can also use SDF, MSDF and MTSDF BitmapFonts for vector-like scaling appearance provided by:
* https://github.com/soimy/msdf-bmfont-xml for SDF and MSDF fnt files or
* https://github.com/Chlumsky/msdf-atlas-gen for SDF, MSDF and MTSDF json files
*
* A BitmapText can only be created when the font is loaded.
*
* ```js
* // in this case the font is in a file called 'desyrel.fnt'
* let bitmapText = new PIXI.BitmapText("text using a fancy font!", {
*   fontName: "Desyrel",
*   fontSize: 35,
*   align: "right"
* });
* ```
* @memberof PIXI
*/
var BitmapText = function(_super) {
	__extends$8(BitmapText, _super);
	/**
	* @param text - A string that you would like the text to display.
	* @param style - The style parameters.
	* @param {string} style.fontName - The installed BitmapFont name.
	* @param {number} [style.fontSize] - The size of the font in pixels, e.g. 24. If undefined,
	*.     this will default to the BitmapFont size.
	* @param {string} [style.align='left'] - Alignment for multiline text ('left', 'center', 'right' or 'justify'),
	*      does not affect single line text.
	* @param {number} [style.tint=0xFFFFFF] - The tint color.
	* @param {number} [style.letterSpacing=0] - The amount of spacing between letters.
	* @param {number} [style.maxWidth=0] - The max width of the text before line wrapping.
	*/
	function BitmapText(text, style) {
		if (style === void 0) style = {};
		var _this = _super.call(this) || this;
		/**
		* Private tracker for the current tint.
		* @private
		*/
		_this._tint = 16777215;
		var _a = Object.assign({}, BitmapText.styleDefaults, style), align = _a.align, tint = _a.tint, maxWidth = _a.maxWidth, letterSpacing = _a.letterSpacing, fontName = _a.fontName, fontSize = _a.fontSize;
		if (!BitmapFont.available[fontName]) throw new Error("Missing BitmapFont \"" + fontName + "\"");
		_this._activePagesMeshData = [];
		_this._textWidth = 0;
		_this._textHeight = 0;
		_this._align = align;
		_this._tint = tint;
		_this._font = void 0;
		_this._fontName = fontName;
		_this._fontSize = fontSize;
		_this.text = text;
		_this._maxWidth = maxWidth;
		_this._maxLineHeight = 0;
		_this._letterSpacing = letterSpacing;
		_this._anchor = new ObservablePoint(function() {
			_this.dirty = true;
		}, _this, 0, 0);
		_this._roundPixels = settings.ROUND_PIXELS;
		_this.dirty = true;
		_this._resolution = settings.RESOLUTION;
		_this._autoResolution = true;
		_this._textureCache = {};
		return _this;
	}
	/** Renders text and updates it when needed. This should only be called if the BitmapFont is regenerated. */
	BitmapText.prototype.updateText = function() {
		var _a;
		var data = BitmapFont.available[this._fontName];
		var fontSize = this.fontSize;
		var scale = fontSize / data.size;
		var pos = new Point();
		var chars = [];
		var lineWidths = [];
		var lineSpaces = [];
		var charsInput = splitTextToCharacters(this._text.replace(/(?:\r\n|\r)/g, "\n") || " ");
		var maxWidth = this._maxWidth * data.size / fontSize;
		var pageMeshDataPool = data.distanceFieldType === "none" ? pageMeshDataDefaultPageMeshData : pageMeshDataMSDFPageMeshData;
		var prevCharCode = null;
		var lastLineWidth = 0;
		var maxLineWidth = 0;
		var line = 0;
		var lastBreakPos = -1;
		var lastBreakWidth = 0;
		var spacesRemoved = 0;
		var maxLineHeight = 0;
		var spaceCount = 0;
		for (var i = 0; i < charsInput.length; i++) {
			var char = charsInput[i];
			var charCode = extractCharCode(char);
			if (/(?:\s)/.test(char)) {
				lastBreakPos = i;
				lastBreakWidth = lastLineWidth;
				spaceCount++;
			}
			if (char === "\r" || char === "\n") {
				lineWidths.push(lastLineWidth);
				lineSpaces.push(-1);
				maxLineWidth = Math.max(maxLineWidth, lastLineWidth);
				++line;
				++spacesRemoved;
				pos.x = 0;
				pos.y += data.lineHeight;
				prevCharCode = null;
				spaceCount = 0;
				continue;
			}
			var charData = data.chars[charCode];
			if (!charData) continue;
			if (prevCharCode && charData.kerning[prevCharCode]) pos.x += charData.kerning[prevCharCode];
			var charRenderData = charRenderDataPool.pop() || {
				texture: Texture.EMPTY,
				line: 0,
				charCode: 0,
				prevSpaces: 0,
				position: new Point()
			};
			charRenderData.texture = charData.texture;
			charRenderData.line = line;
			charRenderData.charCode = charCode;
			charRenderData.position.x = pos.x + charData.xOffset + this._letterSpacing / 2;
			charRenderData.position.y = pos.y + charData.yOffset;
			charRenderData.prevSpaces = spaceCount;
			chars.push(charRenderData);
			lastLineWidth = charRenderData.position.x + Math.max(charData.xAdvance - charData.xOffset, charData.texture.orig.width);
			pos.x += charData.xAdvance + this._letterSpacing;
			maxLineHeight = Math.max(maxLineHeight, charData.yOffset + charData.texture.height);
			prevCharCode = charCode;
			if (lastBreakPos !== -1 && maxWidth > 0 && pos.x > maxWidth) {
				++spacesRemoved;
				removeItems(chars, 1 + lastBreakPos - spacesRemoved, 1 + i - lastBreakPos);
				i = lastBreakPos;
				lastBreakPos = -1;
				lineWidths.push(lastBreakWidth);
				lineSpaces.push(chars.length > 0 ? chars[chars.length - 1].prevSpaces : 0);
				maxLineWidth = Math.max(maxLineWidth, lastBreakWidth);
				line++;
				pos.x = 0;
				pos.y += data.lineHeight;
				prevCharCode = null;
				spaceCount = 0;
			}
		}
		var lastChar = charsInput[charsInput.length - 1];
		if (lastChar !== "\r" && lastChar !== "\n") {
			if (/(?:\s)/.test(lastChar)) lastLineWidth = lastBreakWidth;
			lineWidths.push(lastLineWidth);
			maxLineWidth = Math.max(maxLineWidth, lastLineWidth);
			lineSpaces.push(-1);
		}
		var lineAlignOffsets = [];
		for (var i = 0; i <= line; i++) {
			var alignOffset = 0;
			if (this._align === "right") alignOffset = maxLineWidth - lineWidths[i];
			else if (this._align === "center") alignOffset = (maxLineWidth - lineWidths[i]) / 2;
			else if (this._align === "justify") alignOffset = lineSpaces[i] < 0 ? 0 : (maxLineWidth - lineWidths[i]) / lineSpaces[i];
			lineAlignOffsets.push(alignOffset);
		}
		var lenChars = chars.length;
		var pagesMeshData = {};
		var newPagesMeshData = [];
		var activePagesMeshData = this._activePagesMeshData;
		pageMeshDataPool.push.apply(pageMeshDataPool, activePagesMeshData);
		for (var i = 0; i < lenChars; i++) {
			var texture = chars[i].texture;
			var baseTextureUid = texture.baseTexture.uid;
			if (!pagesMeshData[baseTextureUid]) {
				var pageMeshData = pageMeshDataPool.pop();
				if (!pageMeshData) {
					var geometry = new MeshGeometry();
					var material = void 0;
					var meshBlendMode = void 0;
					if (data.distanceFieldType === "none") {
						material = new MeshMaterial(Texture.EMPTY);
						meshBlendMode = BLEND_MODES.NORMAL;
					} else {
						material = new MeshMaterial(Texture.EMPTY, {
							program: Program.from(msdfVert, msdfFrag),
							uniforms: { uFWidth: 0 }
						});
						meshBlendMode = BLEND_MODES.NORMAL_NPM;
					}
					var mesh = new Mesh(geometry, material);
					mesh.blendMode = meshBlendMode;
					pageMeshData = {
						index: 0,
						indexCount: 0,
						vertexCount: 0,
						uvsCount: 0,
						total: 0,
						mesh,
						vertices: null,
						uvs: null,
						indices: null
					};
				}
				pageMeshData.index = 0;
				pageMeshData.indexCount = 0;
				pageMeshData.vertexCount = 0;
				pageMeshData.uvsCount = 0;
				pageMeshData.total = 0;
				var _textureCache = this._textureCache;
				_textureCache[baseTextureUid] = _textureCache[baseTextureUid] || new Texture(texture.baseTexture);
				pageMeshData.mesh.texture = _textureCache[baseTextureUid];
				pageMeshData.mesh.tint = this._tint;
				newPagesMeshData.push(pageMeshData);
				pagesMeshData[baseTextureUid] = pageMeshData;
			}
			pagesMeshData[baseTextureUid].total++;
		}
		for (var i = 0; i < activePagesMeshData.length; i++) if (newPagesMeshData.indexOf(activePagesMeshData[i]) === -1) this.removeChild(activePagesMeshData[i].mesh);
		for (var i = 0; i < newPagesMeshData.length; i++) if (newPagesMeshData[i].mesh.parent !== this) this.addChild(newPagesMeshData[i].mesh);
		this._activePagesMeshData = newPagesMeshData;
		for (var i in pagesMeshData) {
			var pageMeshData = pagesMeshData[i];
			var total = pageMeshData.total;
			if (!(((_a = pageMeshData.indices) === null || _a === void 0 ? void 0 : _a.length) > 6 * total) || pageMeshData.vertices.length < Mesh.BATCHABLE_SIZE * 2) {
				pageMeshData.vertices = new Float32Array(8 * total);
				pageMeshData.uvs = new Float32Array(8 * total);
				pageMeshData.indices = new Uint16Array(6 * total);
			} else {
				var total_1 = pageMeshData.total;
				var vertices = pageMeshData.vertices;
				for (var i_1 = total_1 * 4 * 2; i_1 < vertices.length; i_1++) vertices[i_1] = 0;
			}
			pageMeshData.mesh.size = 6 * total;
		}
		for (var i = 0; i < lenChars; i++) {
			var char = chars[i];
			var offset = char.position.x + lineAlignOffsets[char.line] * (this._align === "justify" ? char.prevSpaces : 1);
			if (this._roundPixels) offset = Math.round(offset);
			var xPos = offset * scale;
			var yPos = char.position.y * scale;
			var texture = char.texture;
			var pageMesh = pagesMeshData[texture.baseTexture.uid];
			var textureFrame = texture.frame;
			var textureUvs = texture._uvs;
			var index = pageMesh.index++;
			pageMesh.indices[index * 6 + 0] = 0 + index * 4;
			pageMesh.indices[index * 6 + 1] = 1 + index * 4;
			pageMesh.indices[index * 6 + 2] = 2 + index * 4;
			pageMesh.indices[index * 6 + 3] = 0 + index * 4;
			pageMesh.indices[index * 6 + 4] = 2 + index * 4;
			pageMesh.indices[index * 6 + 5] = 3 + index * 4;
			pageMesh.vertices[index * 8 + 0] = xPos;
			pageMesh.vertices[index * 8 + 1] = yPos;
			pageMesh.vertices[index * 8 + 2] = xPos + textureFrame.width * scale;
			pageMesh.vertices[index * 8 + 3] = yPos;
			pageMesh.vertices[index * 8 + 4] = xPos + textureFrame.width * scale;
			pageMesh.vertices[index * 8 + 5] = yPos + textureFrame.height * scale;
			pageMesh.vertices[index * 8 + 6] = xPos;
			pageMesh.vertices[index * 8 + 7] = yPos + textureFrame.height * scale;
			pageMesh.uvs[index * 8 + 0] = textureUvs.x0;
			pageMesh.uvs[index * 8 + 1] = textureUvs.y0;
			pageMesh.uvs[index * 8 + 2] = textureUvs.x1;
			pageMesh.uvs[index * 8 + 3] = textureUvs.y1;
			pageMesh.uvs[index * 8 + 4] = textureUvs.x2;
			pageMesh.uvs[index * 8 + 5] = textureUvs.y2;
			pageMesh.uvs[index * 8 + 6] = textureUvs.x3;
			pageMesh.uvs[index * 8 + 7] = textureUvs.y3;
		}
		this._textWidth = maxLineWidth * scale;
		this._textHeight = (pos.y + data.lineHeight) * scale;
		for (var i in pagesMeshData) {
			var pageMeshData = pagesMeshData[i];
			if (this.anchor.x !== 0 || this.anchor.y !== 0) {
				var vertexCount = 0;
				var anchorOffsetX = this._textWidth * this.anchor.x;
				var anchorOffsetY = this._textHeight * this.anchor.y;
				for (var i_2 = 0; i_2 < pageMeshData.total; i_2++) {
					pageMeshData.vertices[vertexCount++] -= anchorOffsetX;
					pageMeshData.vertices[vertexCount++] -= anchorOffsetY;
					pageMeshData.vertices[vertexCount++] -= anchorOffsetX;
					pageMeshData.vertices[vertexCount++] -= anchorOffsetY;
					pageMeshData.vertices[vertexCount++] -= anchorOffsetX;
					pageMeshData.vertices[vertexCount++] -= anchorOffsetY;
					pageMeshData.vertices[vertexCount++] -= anchorOffsetX;
					pageMeshData.vertices[vertexCount++] -= anchorOffsetY;
				}
			}
			this._maxLineHeight = maxLineHeight * scale;
			var vertexBuffer = pageMeshData.mesh.geometry.getBuffer("aVertexPosition");
			var textureBuffer = pageMeshData.mesh.geometry.getBuffer("aTextureCoord");
			var indexBuffer = pageMeshData.mesh.geometry.getIndex();
			vertexBuffer.data = pageMeshData.vertices;
			textureBuffer.data = pageMeshData.uvs;
			indexBuffer.data = pageMeshData.indices;
			vertexBuffer.update();
			textureBuffer.update();
			indexBuffer.update();
		}
		for (var i = 0; i < chars.length; i++) charRenderDataPool.push(chars[i]);
		this._font = data;
		this.dirty = false;
	};
	BitmapText.prototype.updateTransform = function() {
		this.validate();
		this.containerUpdateTransform();
	};
	BitmapText.prototype._render = function(renderer) {
		if (this._autoResolution && this._resolution !== renderer.resolution) {
			this._resolution = renderer.resolution;
			this.dirty = true;
		}
		var _a = BitmapFont.available[this._fontName], distanceFieldRange = _a.distanceFieldRange, distanceFieldType = _a.distanceFieldType, size = _a.size;
		if (distanceFieldType !== "none") {
			var _b = this.worldTransform, a = _b.a, b = _b.b, c = _b.c, d = _b.d;
			var dx = Math.sqrt(a * a + b * b);
			var dy = Math.sqrt(c * c + d * d);
			var worldScale = (Math.abs(dx) + Math.abs(dy)) / 2;
			var fontScale = this.fontSize / size;
			for (var _i = 0, _c = this._activePagesMeshData; _i < _c.length; _i++) {
				var mesh = _c[_i];
				mesh.mesh.shader.uniforms.uFWidth = worldScale * distanceFieldRange * fontScale * this._resolution;
			}
		}
		_super.prototype._render.call(this, renderer);
	};
	/**
	* Validates text before calling parent's getLocalBounds
	* @returns - The rectangular bounding area
	*/
	BitmapText.prototype.getLocalBounds = function() {
		this.validate();
		return _super.prototype.getLocalBounds.call(this);
	};
	/**
	* Updates text when needed
	* @private
	*/
	BitmapText.prototype.validate = function() {
		var font = BitmapFont.available[this._fontName];
		if (!font) throw new Error("Missing BitmapFont \"" + this._fontName + "\"");
		if (this._font !== font) this.dirty = true;
		if (this.dirty) this.updateText();
	};
	Object.defineProperty(BitmapText.prototype, "tint", {
		/**
		* The tint of the BitmapText object.
		* @default 0xffffff
		*/
		get: function() {
			return this._tint;
		},
		set: function(value) {
			if (this._tint === value) return;
			this._tint = value;
			for (var i = 0; i < this._activePagesMeshData.length; i++) this._activePagesMeshData[i].mesh.tint = value;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BitmapText.prototype, "align", {
		/**
		* The alignment of the BitmapText object.
		* @member {string}
		* @default 'left'
		*/
		get: function() {
			return this._align;
		},
		set: function(value) {
			if (this._align !== value) {
				this._align = value;
				this.dirty = true;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BitmapText.prototype, "fontName", {
		/** The name of the BitmapFont. */
		get: function() {
			return this._fontName;
		},
		set: function(value) {
			if (!BitmapFont.available[value]) throw new Error("Missing BitmapFont \"" + value + "\"");
			if (this._fontName !== value) {
				this._fontName = value;
				this.dirty = true;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BitmapText.prototype, "fontSize", {
		/** The size of the font to display. */
		get: function() {
			var _a;
			return (_a = this._fontSize) !== null && _a !== void 0 ? _a : BitmapFont.available[this._fontName].size;
		},
		set: function(value) {
			if (this._fontSize !== value) {
				this._fontSize = value;
				this.dirty = true;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BitmapText.prototype, "anchor", {
		/**
		* The anchor sets the origin point of the text.
		*
		* The default is `(0,0)`, this means the text's origin is the top left.
		*
		* Setting the anchor to `(0.5,0.5)` means the text's origin is centered.
		*
		* Setting the anchor to `(1,1)` would mean the text's origin point will be the bottom right corner.
		*/
		get: function() {
			return this._anchor;
		},
		set: function(value) {
			if (typeof value === "number") this._anchor.set(value);
			else this._anchor.copyFrom(value);
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BitmapText.prototype, "text", {
		/** The text of the BitmapText object. */
		get: function() {
			return this._text;
		},
		set: function(text) {
			text = String(text === null || text === void 0 ? "" : text);
			if (this._text === text) return;
			this._text = text;
			this.dirty = true;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BitmapText.prototype, "maxWidth", {
		/**
		* The max width of this bitmap text in pixels. If the text provided is longer than the
		* value provided, line breaks will be automatically inserted in the last whitespace.
		* Disable by setting the value to 0.
		*/
		get: function() {
			return this._maxWidth;
		},
		set: function(value) {
			if (this._maxWidth === value) return;
			this._maxWidth = value;
			this.dirty = true;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BitmapText.prototype, "maxLineHeight", {
		/**
		* The max line height. This is useful when trying to use the total height of the Text,
		* i.e. when trying to vertically align.
		* @readonly
		*/
		get: function() {
			this.validate();
			return this._maxLineHeight;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BitmapText.prototype, "textWidth", {
		/**
		* The width of the overall text, different from fontSize,
		* which is defined in the style object.
		* @readonly
		*/
		get: function() {
			this.validate();
			return this._textWidth;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BitmapText.prototype, "letterSpacing", {
		/** Additional space between characters. */
		get: function() {
			return this._letterSpacing;
		},
		set: function(value) {
			if (this._letterSpacing !== value) {
				this._letterSpacing = value;
				this.dirty = true;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BitmapText.prototype, "roundPixels", {
		/**
		* If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
		* Advantages can include sharper image quality (like text) and faster rendering on canvas.
		* The main disadvantage is movement of objects may appear less smooth.
		* To set the global default, change {@link PIXI.settings.ROUND_PIXELS}
		* @default PIXI.settings.ROUND_PIXELS
		*/
		get: function() {
			return this._roundPixels;
		},
		set: function(value) {
			if (value !== this._roundPixels) {
				this._roundPixels = value;
				this.dirty = true;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BitmapText.prototype, "textHeight", {
		/**
		* The height of the overall text, different from fontSize,
		* which is defined in the style object.
		* @readonly
		*/
		get: function() {
			this.validate();
			return this._textHeight;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BitmapText.prototype, "resolution", {
		/**
		* The resolution / device pixel ratio of the canvas.
		*
		* This is set to automatically match the renderer resolution by default, but can be overridden by setting manually.
		* @default 1
		*/
		get: function() {
			return this._resolution;
		},
		set: function(value) {
			this._autoResolution = false;
			if (this._resolution === value) return;
			this._resolution = value;
			this.dirty = true;
		},
		enumerable: false,
		configurable: true
	});
	BitmapText.prototype.destroy = function(options) {
		var _textureCache = this._textureCache;
		var pageMeshDataPool = BitmapFont.available[this._fontName].distanceFieldType === "none" ? pageMeshDataDefaultPageMeshData : pageMeshDataMSDFPageMeshData;
		pageMeshDataPool.push.apply(pageMeshDataPool, this._activePagesMeshData);
		for (var _i = 0, _a = this._activePagesMeshData; _i < _a.length; _i++) {
			var pageMeshData = _a[_i];
			this.removeChild(pageMeshData.mesh);
		}
		this._activePagesMeshData = [];
		pageMeshDataPool.filter(function(page) {
			return _textureCache[page.mesh.texture.baseTexture.uid];
		}).forEach(function(page) {
			page.mesh.texture = Texture.EMPTY;
		});
		for (var id in _textureCache) {
			_textureCache[id].destroy();
			delete _textureCache[id];
		}
		this._font = null;
		this._textureCache = null;
		_super.prototype.destroy.call(this, options);
	};
	BitmapText.styleDefaults = {
		align: "left",
		tint: 16777215,
		maxWidth: 0,
		letterSpacing: 0
	};
	return BitmapText;
}(Container);
/**
* {@link PIXI.Loader Loader} middleware for loading
* bitmap-based fonts suitable for using with {@link PIXI.BitmapText}.
* @memberof PIXI
*/
var BitmapFontLoader = function() {
	function BitmapFontLoader() {}
	/**
	* Called when the plugin is installed.
	* @see PIXI.extensions.add
	*/
	BitmapFontLoader.add = function() {
		LoaderResource.setExtensionXhrType("fnt", LoaderResource.XHR_RESPONSE_TYPE.TEXT);
	};
	/**
	* Called after a resource is loaded.
	* @see PIXI.Loader.loaderMiddleware
	* @param this
	* @param {PIXI.LoaderResource} resource
	* @param {Function} next
	*/
	BitmapFontLoader.use = function(resource, next) {
		var format = autoDetectFormat(resource.data);
		if (!format) {
			next();
			return;
		}
		var baseUrl = BitmapFontLoader.getBaseUrl(this, resource);
		var data = format.parse(resource.data);
		var textures = {};
		var completed = function(page) {
			textures[page.metadata.pageFile] = page.texture;
			if (Object.keys(textures).length === data.page.length) {
				resource.bitmapFont = BitmapFont.install(data, textures, true);
				next();
			}
		};
		for (var i = 0; i < data.page.length; ++i) {
			var pageFile = data.page[i].file;
			var url = baseUrl + pageFile;
			var exists = false;
			for (var name in this.resources) {
				var bitmapResource = this.resources[name];
				if (bitmapResource.url === url) {
					bitmapResource.metadata.pageFile = pageFile;
					if (bitmapResource.texture) completed(bitmapResource);
					else bitmapResource.onAfterMiddleware.add(completed);
					exists = true;
					break;
				}
			}
			if (!exists) {
				var options = {
					crossOrigin: resource.crossOrigin,
					loadType: LoaderResource.LOAD_TYPE.IMAGE,
					metadata: Object.assign({ pageFile }, resource.metadata.imageMetadata),
					parentResource: resource
				};
				this.add(url, options, completed);
			}
		}
	};
	/**
	* Get folder path from a resource.
	* @param loader
	* @param resource
	*/
	BitmapFontLoader.getBaseUrl = function(loader, resource) {
		var resUrl = !resource.isDataUrl ? BitmapFontLoader.dirname(resource.url) : "";
		if (resource.isDataUrl) {
			if (resUrl === ".") resUrl = "";
			if (loader.baseUrl && resUrl) {
				if (loader.baseUrl.charAt(loader.baseUrl.length - 1) === "/") resUrl += "/";
			}
		}
		resUrl = resUrl.replace(loader.baseUrl, "");
		if (resUrl && resUrl.charAt(resUrl.length - 1) !== "/") resUrl += "/";
		return resUrl;
	};
	/**
	* Replacement for NodeJS's path.dirname
	* @param {string} url - Path to get directory for
	*/
	BitmapFontLoader.dirname = function(url) {
		var dir = url.replace(/\\/g, "/").replace(/\/$/, "").replace(/\/[^\/]*$/, "");
		if (dir === url) return ".";
		else if (dir === "") return "/";
		return dir;
	};
	/** @ignore */
	BitmapFontLoader.extension = ExtensionType.Loader;
	return BitmapFontLoader;
}();
//#endregion
//#region node_modules/@pixi/filter-alpha/dist/esm/filter-alpha.mjs
/*!
* @pixi/filter-alpha - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/filter-alpha is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics$7 = function(d, b) {
	extendStatics$7 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
		d.__proto__ = b;
	} || function(d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	};
	return extendStatics$7(d, b);
};
function __extends$7(d, b) {
	extendStatics$7(d, b);
	function __() {
		this.constructor = d;
	}
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var fragment$4 = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float uAlpha;\n\nvoid main(void)\n{\n   gl_FragColor = texture2D(uSampler, vTextureCoord) * uAlpha;\n}\n";
/**
* Simplest filter - applies alpha.
*
* Use this instead of Container's alpha property to avoid visual layering of individual elements.
* AlphaFilter applies alpha evenly across the entire display object and any opaque elements it contains.
* If elements are not opaque, they will blend with each other anyway.
*
* Very handy if you want to use common features of all filters:
*
* 1. Assign a blendMode to this filter, blend all elements inside display object with background.
*
* 2. To use clipping in display coordinates, assign a filterArea to the same container that has this filter.
* @memberof PIXI.filters
*/
var AlphaFilter = function(_super) {
	__extends$7(AlphaFilter, _super);
	/**
	* @param alpha - Amount of alpha from 0 to 1, where 0 is transparent
	*/
	function AlphaFilter(alpha) {
		if (alpha === void 0) alpha = 1;
		var _this = _super.call(this, "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}", fragment$4, { uAlpha: 1 }) || this;
		_this.alpha = alpha;
		return _this;
	}
	Object.defineProperty(AlphaFilter.prototype, "alpha", {
		/**
		* Coefficient for alpha multiplication
		* @default 1
		*/
		get: function() {
			return this.uniforms.uAlpha;
		},
		set: function(value) {
			this.uniforms.uAlpha = value;
		},
		enumerable: false,
		configurable: true
	});
	return AlphaFilter;
}(Filter);
//#endregion
//#region node_modules/@pixi/filter-blur/dist/esm/filter-blur.mjs
/*!
* @pixi/filter-blur - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/filter-blur is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics$6 = function(d, b) {
	extendStatics$6 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
		d.__proto__ = b;
	} || function(d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	};
	return extendStatics$6(d, b);
};
function __extends$6(d, b) {
	extendStatics$6(d, b);
	function __() {
		this.constructor = d;
	}
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var vertTemplate = "\n    attribute vec2 aVertexPosition;\n\n    uniform mat3 projectionMatrix;\n\n    uniform float strength;\n\n    varying vec2 vBlurTexCoords[%size%];\n\n    uniform vec4 inputSize;\n    uniform vec4 outputFrame;\n\n    vec4 filterVertexPosition( void )\n    {\n        vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n        return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n    }\n\n    vec2 filterTextureCoord( void )\n    {\n        return aVertexPosition * (outputFrame.zw * inputSize.zw);\n    }\n\n    void main(void)\n    {\n        gl_Position = filterVertexPosition();\n\n        vec2 textureCoord = filterTextureCoord();\n        %blur%\n    }";
function generateBlurVertSource(kernelSize, x) {
	var halfLength = Math.ceil(kernelSize / 2);
	var vertSource = vertTemplate;
	var blurLoop = "";
	var template;
	if (x) template = "vBlurTexCoords[%index%] =  textureCoord + vec2(%sampleIndex% * strength, 0.0);";
	else template = "vBlurTexCoords[%index%] =  textureCoord + vec2(0.0, %sampleIndex% * strength);";
	for (var i = 0; i < kernelSize; i++) {
		var blur = template.replace("%index%", i.toString());
		blur = blur.replace("%sampleIndex%", i - (halfLength - 1) + ".0");
		blurLoop += blur;
		blurLoop += "\n";
	}
	vertSource = vertSource.replace("%blur%", blurLoop);
	vertSource = vertSource.replace("%size%", kernelSize.toString());
	return vertSource;
}
var GAUSSIAN_VALUES = {
	5: [
		.153388,
		.221461,
		.250301
	],
	7: [
		.071303,
		.131514,
		.189879,
		.214607
	],
	9: [
		.028532,
		.067234,
		.124009,
		.179044,
		.20236
	],
	11: [
		.0093,
		.028002,
		.065984,
		.121703,
		.175713,
		.198596
	],
	13: [
		.002406,
		.009255,
		.027867,
		.065666,
		.121117,
		.174868,
		.197641
	],
	15: [
		489e-6,
		.002403,
		.009246,
		.02784,
		.065602,
		.120999,
		.174697,
		.197448
	]
};
var fragTemplate = [
	"varying vec2 vBlurTexCoords[%size%];",
	"uniform sampler2D uSampler;",
	"void main(void)",
	"{",
	"    gl_FragColor = vec4(0.0);",
	"    %blur%",
	"}"
].join("\n");
function generateBlurFragSource(kernelSize) {
	var kernel = GAUSSIAN_VALUES[kernelSize];
	var halfLength = kernel.length;
	var fragSource = fragTemplate;
	var blurLoop = "";
	var template = "gl_FragColor += texture2D(uSampler, vBlurTexCoords[%index%]) * %value%;";
	var value;
	for (var i = 0; i < kernelSize; i++) {
		var blur = template.replace("%index%", i.toString());
		value = i;
		if (i >= halfLength) value = kernelSize - i - 1;
		blur = blur.replace("%value%", kernel[value].toString());
		blurLoop += blur;
		blurLoop += "\n";
	}
	fragSource = fragSource.replace("%blur%", blurLoop);
	fragSource = fragSource.replace("%size%", kernelSize.toString());
	return fragSource;
}
/**
* The BlurFilterPass applies a horizontal or vertical Gaussian blur to an object.
* @memberof PIXI.filters
*/
var BlurFilterPass = function(_super) {
	__extends$6(BlurFilterPass, _super);
	/**
	* @param horizontal - Do pass along the x-axis (`true`) or y-axis (`false`).
	* @param strength - The strength of the blur filter.
	* @param quality - The quality of the blur filter.
	* @param resolution - The resolution of the blur filter.
	* @param kernelSize - The kernelSize of the blur filter.Options: 5, 7, 9, 11, 13, 15.
	*/
	function BlurFilterPass(horizontal, strength, quality, resolution, kernelSize) {
		if (strength === void 0) strength = 8;
		if (quality === void 0) quality = 4;
		if (resolution === void 0) resolution = settings.FILTER_RESOLUTION;
		if (kernelSize === void 0) kernelSize = 5;
		var _this = this;
		var vertSrc = generateBlurVertSource(kernelSize, horizontal);
		var fragSrc = generateBlurFragSource(kernelSize);
		_this = _super.call(this, vertSrc, fragSrc) || this;
		_this.horizontal = horizontal;
		_this.resolution = resolution;
		_this._quality = 0;
		_this.quality = quality;
		_this.blur = strength;
		return _this;
	}
	/**
	* Applies the filter.
	* @param filterManager - The manager.
	* @param input - The input target.
	* @param output - The output target.
	* @param clearMode - How to clear
	*/
	BlurFilterPass.prototype.apply = function(filterManager, input, output, clearMode) {
		if (output) {
			if (this.horizontal) this.uniforms.strength = 1 / output.width * (output.width / input.width);
			else this.uniforms.strength = 1 / output.height * (output.height / input.height);
		} else if (this.horizontal) this.uniforms.strength = 1 / filterManager.renderer.width * (filterManager.renderer.width / input.width);
		else this.uniforms.strength = 1 / filterManager.renderer.height * (filterManager.renderer.height / input.height);
		this.uniforms.strength *= this.strength;
		this.uniforms.strength /= this.passes;
		if (this.passes === 1) filterManager.applyFilter(this, input, output, clearMode);
		else {
			var renderTarget = filterManager.getFilterTexture();
			var renderer = filterManager.renderer;
			var flip = input;
			var flop = renderTarget;
			this.state.blend = false;
			filterManager.applyFilter(this, flip, flop, CLEAR_MODES.CLEAR);
			for (var i = 1; i < this.passes - 1; i++) {
				filterManager.bindAndClear(flip, CLEAR_MODES.BLIT);
				this.uniforms.uSampler = flop;
				var temp = flop;
				flop = flip;
				flip = temp;
				renderer.shader.bind(this);
				renderer.geometry.draw(5);
			}
			this.state.blend = true;
			filterManager.applyFilter(this, flop, output, clearMode);
			filterManager.returnFilterTexture(renderTarget);
		}
	};
	Object.defineProperty(BlurFilterPass.prototype, "blur", {
		/**
		* Sets the strength of both the blur.
		* @default 16
		*/
		get: function() {
			return this.strength;
		},
		set: function(value) {
			this.padding = 1 + Math.abs(value) * 2;
			this.strength = value;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BlurFilterPass.prototype, "quality", {
		/**
		* Sets the quality of the blur by modifying the number of passes. More passes means higher
		* quality bluring but the lower the performance.
		* @default 4
		*/
		get: function() {
			return this._quality;
		},
		set: function(value) {
			this._quality = value;
			this.passes = value;
		},
		enumerable: false,
		configurable: true
	});
	return BlurFilterPass;
}(Filter);
/**
* The BlurFilter applies a Gaussian blur to an object.
*
* The strength of the blur can be set for the x-axis and y-axis separately.
* @memberof PIXI.filters
*/
var BlurFilter = function(_super) {
	__extends$6(BlurFilter, _super);
	/**
	* @param strength - The strength of the blur filter.
	* @param quality - The quality of the blur filter.
	* @param [resolution=PIXI.settings.FILTER_RESOLUTION] - The resolution of the blur filter.
	* @param kernelSize - The kernelSize of the blur filter.Options: 5, 7, 9, 11, 13, 15.
	*/
	function BlurFilter(strength, quality, resolution, kernelSize) {
		if (strength === void 0) strength = 8;
		if (quality === void 0) quality = 4;
		if (resolution === void 0) resolution = settings.FILTER_RESOLUTION;
		if (kernelSize === void 0) kernelSize = 5;
		var _this = _super.call(this) || this;
		_this.blurXFilter = new BlurFilterPass(true, strength, quality, resolution, kernelSize);
		_this.blurYFilter = new BlurFilterPass(false, strength, quality, resolution, kernelSize);
		_this.resolution = resolution;
		_this.quality = quality;
		_this.blur = strength;
		_this.repeatEdgePixels = false;
		return _this;
	}
	/**
	* Applies the filter.
	* @param filterManager - The manager.
	* @param input - The input target.
	* @param output - The output target.
	* @param clearMode - How to clear
	*/
	BlurFilter.prototype.apply = function(filterManager, input, output, clearMode) {
		var xStrength = Math.abs(this.blurXFilter.strength);
		var yStrength = Math.abs(this.blurYFilter.strength);
		if (xStrength && yStrength) {
			var renderTarget = filterManager.getFilterTexture();
			this.blurXFilter.apply(filterManager, input, renderTarget, CLEAR_MODES.CLEAR);
			this.blurYFilter.apply(filterManager, renderTarget, output, clearMode);
			filterManager.returnFilterTexture(renderTarget);
		} else if (yStrength) this.blurYFilter.apply(filterManager, input, output, clearMode);
		else this.blurXFilter.apply(filterManager, input, output, clearMode);
	};
	BlurFilter.prototype.updatePadding = function() {
		if (this._repeatEdgePixels) this.padding = 0;
		else this.padding = Math.max(Math.abs(this.blurXFilter.strength), Math.abs(this.blurYFilter.strength)) * 2;
	};
	Object.defineProperty(BlurFilter.prototype, "blur", {
		/**
		* Sets the strength of both the blurX and blurY properties simultaneously
		* @default 2
		*/
		get: function() {
			return this.blurXFilter.blur;
		},
		set: function(value) {
			this.blurXFilter.blur = this.blurYFilter.blur = value;
			this.updatePadding();
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BlurFilter.prototype, "quality", {
		/**
		* Sets the number of passes for blur. More passes means higher quality bluring.
		* @default 1
		*/
		get: function() {
			return this.blurXFilter.quality;
		},
		set: function(value) {
			this.blurXFilter.quality = this.blurYFilter.quality = value;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BlurFilter.prototype, "blurX", {
		/**
		* Sets the strength of the blurX property
		* @default 2
		*/
		get: function() {
			return this.blurXFilter.blur;
		},
		set: function(value) {
			this.blurXFilter.blur = value;
			this.updatePadding();
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BlurFilter.prototype, "blurY", {
		/**
		* Sets the strength of the blurY property
		* @default 2
		*/
		get: function() {
			return this.blurYFilter.blur;
		},
		set: function(value) {
			this.blurYFilter.blur = value;
			this.updatePadding();
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BlurFilter.prototype, "blendMode", {
		/**
		* Sets the blendmode of the filter
		* @default PIXI.BLEND_MODES.NORMAL
		*/
		get: function() {
			return this.blurYFilter.blendMode;
		},
		set: function(value) {
			this.blurYFilter.blendMode = value;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BlurFilter.prototype, "repeatEdgePixels", {
		/**
		* If set to true the edge of the target will be clamped
		* @default false
		*/
		get: function() {
			return this._repeatEdgePixels;
		},
		set: function(value) {
			this._repeatEdgePixels = value;
			this.updatePadding();
		},
		enumerable: false,
		configurable: true
	});
	return BlurFilter;
}(Filter);
//#endregion
//#region node_modules/@pixi/filter-color-matrix/dist/esm/filter-color-matrix.mjs
/*!
* @pixi/filter-color-matrix - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/filter-color-matrix is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics$5 = function(d, b) {
	extendStatics$5 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
		d.__proto__ = b;
	} || function(d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	};
	return extendStatics$5(d, b);
};
function __extends$5(d, b) {
	extendStatics$5(d, b);
	function __() {
		this.constructor = d;
	}
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var fragment$3 = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float m[20];\nuniform float uAlpha;\n\nvoid main(void)\n{\n    vec4 c = texture2D(uSampler, vTextureCoord);\n\n    if (uAlpha == 0.0) {\n        gl_FragColor = c;\n        return;\n    }\n\n    // Un-premultiply alpha before applying the color matrix. See issue #3539.\n    if (c.a > 0.0) {\n      c.rgb /= c.a;\n    }\n\n    vec4 result;\n\n    result.r = (m[0] * c.r);\n        result.r += (m[1] * c.g);\n        result.r += (m[2] * c.b);\n        result.r += (m[3] * c.a);\n        result.r += m[4];\n\n    result.g = (m[5] * c.r);\n        result.g += (m[6] * c.g);\n        result.g += (m[7] * c.b);\n        result.g += (m[8] * c.a);\n        result.g += m[9];\n\n    result.b = (m[10] * c.r);\n       result.b += (m[11] * c.g);\n       result.b += (m[12] * c.b);\n       result.b += (m[13] * c.a);\n       result.b += m[14];\n\n    result.a = (m[15] * c.r);\n       result.a += (m[16] * c.g);\n       result.a += (m[17] * c.b);\n       result.a += (m[18] * c.a);\n       result.a += m[19];\n\n    vec3 rgb = mix(c.rgb, result.rgb, uAlpha);\n\n    // Premultiply alpha again.\n    rgb *= result.a;\n\n    gl_FragColor = vec4(rgb, result.a);\n}\n";
/**
* The ColorMatrixFilter class lets you apply a 5x4 matrix transformation on the RGBA
* color and alpha values of every pixel on your displayObject to produce a result
* with a new set of RGBA color and alpha values. It's pretty powerful!
*
* ```js
*  let colorMatrix = new PIXI.filters.ColorMatrixFilter();
*  container.filters = [colorMatrix];
*  colorMatrix.contrast(2);
* ```
* @author Clément Chenebault <clement@goodboydigital.com>
* @memberof PIXI.filters
*/
var ColorMatrixFilter = function(_super) {
	__extends$5(ColorMatrixFilter, _super);
	function ColorMatrixFilter() {
		var _this = this;
		var uniforms = {
			m: new Float32Array([
				1,
				0,
				0,
				0,
				0,
				0,
				1,
				0,
				0,
				0,
				0,
				0,
				1,
				0,
				0,
				0,
				0,
				0,
				1,
				0
			]),
			uAlpha: 1
		};
		_this = _super.call(this, "attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n    gl_Position = filterVertexPosition();\n    vTextureCoord = filterTextureCoord();\n}\n", fragment$3, uniforms) || this;
		_this.alpha = 1;
		return _this;
	}
	/**
	* Transforms current matrix and set the new one
	* @param {number[]} matrix - 5x4 matrix
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	ColorMatrixFilter.prototype._loadMatrix = function(matrix, multiply) {
		if (multiply === void 0) multiply = false;
		var newMatrix = matrix;
		if (multiply) {
			this._multiply(newMatrix, this.uniforms.m, matrix);
			newMatrix = this._colorMatrix(newMatrix);
		}
		this.uniforms.m = newMatrix;
	};
	/**
	* Multiplies two mat5's
	* @private
	* @param out - 5x4 matrix the receiving matrix
	* @param a - 5x4 matrix the first operand
	* @param b - 5x4 matrix the second operand
	* @returns {number[]} 5x4 matrix
	*/
	ColorMatrixFilter.prototype._multiply = function(out, a, b) {
		out[0] = a[0] * b[0] + a[1] * b[5] + a[2] * b[10] + a[3] * b[15];
		out[1] = a[0] * b[1] + a[1] * b[6] + a[2] * b[11] + a[3] * b[16];
		out[2] = a[0] * b[2] + a[1] * b[7] + a[2] * b[12] + a[3] * b[17];
		out[3] = a[0] * b[3] + a[1] * b[8] + a[2] * b[13] + a[3] * b[18];
		out[4] = a[0] * b[4] + a[1] * b[9] + a[2] * b[14] + a[3] * b[19] + a[4];
		out[5] = a[5] * b[0] + a[6] * b[5] + a[7] * b[10] + a[8] * b[15];
		out[6] = a[5] * b[1] + a[6] * b[6] + a[7] * b[11] + a[8] * b[16];
		out[7] = a[5] * b[2] + a[6] * b[7] + a[7] * b[12] + a[8] * b[17];
		out[8] = a[5] * b[3] + a[6] * b[8] + a[7] * b[13] + a[8] * b[18];
		out[9] = a[5] * b[4] + a[6] * b[9] + a[7] * b[14] + a[8] * b[19] + a[9];
		out[10] = a[10] * b[0] + a[11] * b[5] + a[12] * b[10] + a[13] * b[15];
		out[11] = a[10] * b[1] + a[11] * b[6] + a[12] * b[11] + a[13] * b[16];
		out[12] = a[10] * b[2] + a[11] * b[7] + a[12] * b[12] + a[13] * b[17];
		out[13] = a[10] * b[3] + a[11] * b[8] + a[12] * b[13] + a[13] * b[18];
		out[14] = a[10] * b[4] + a[11] * b[9] + a[12] * b[14] + a[13] * b[19] + a[14];
		out[15] = a[15] * b[0] + a[16] * b[5] + a[17] * b[10] + a[18] * b[15];
		out[16] = a[15] * b[1] + a[16] * b[6] + a[17] * b[11] + a[18] * b[16];
		out[17] = a[15] * b[2] + a[16] * b[7] + a[17] * b[12] + a[18] * b[17];
		out[18] = a[15] * b[3] + a[16] * b[8] + a[17] * b[13] + a[18] * b[18];
		out[19] = a[15] * b[4] + a[16] * b[9] + a[17] * b[14] + a[18] * b[19] + a[19];
		return out;
	};
	/**
	* Create a Float32 Array and normalize the offset component to 0-1
	* @param {number[]} matrix - 5x4 matrix
	* @returns {number[]} 5x4 matrix with all values between 0-1
	*/
	ColorMatrixFilter.prototype._colorMatrix = function(matrix) {
		var m = new Float32Array(matrix);
		m[4] /= 255;
		m[9] /= 255;
		m[14] /= 255;
		m[19] /= 255;
		return m;
	};
	/**
	* Adjusts brightness
	* @param b - value of the brigthness (0-1, where 0 is black)
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	ColorMatrixFilter.prototype.brightness = function(b, multiply) {
		var matrix = [
			b,
			0,
			0,
			0,
			0,
			0,
			b,
			0,
			0,
			0,
			0,
			0,
			b,
			0,
			0,
			0,
			0,
			0,
			1,
			0
		];
		this._loadMatrix(matrix, multiply);
	};
	/**
	* Sets each channel on the diagonal of the color matrix.
	* This can be used to achieve a tinting effect on Containers similar to the tint field of some
	* display objects like Sprite, Text, Graphics, and Mesh.
	* @param color - Color of the tint. This is a hex value.
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	ColorMatrixFilter.prototype.tint = function(color, multiply) {
		var r = color >> 16 & 255;
		var g = color >> 8 & 255;
		var b = color & 255;
		var matrix = [
			r / 255,
			0,
			0,
			0,
			0,
			0,
			g / 255,
			0,
			0,
			0,
			0,
			0,
			b / 255,
			0,
			0,
			0,
			0,
			0,
			1,
			0
		];
		this._loadMatrix(matrix, multiply);
	};
	/**
	* Set the matrices in grey scales
	* @param scale - value of the grey (0-1, where 0 is black)
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	ColorMatrixFilter.prototype.greyscale = function(scale, multiply) {
		var matrix = [
			scale,
			scale,
			scale,
			0,
			0,
			scale,
			scale,
			scale,
			0,
			0,
			scale,
			scale,
			scale,
			0,
			0,
			0,
			0,
			0,
			1,
			0
		];
		this._loadMatrix(matrix, multiply);
	};
	/**
	* Set the black and white matrice.
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	ColorMatrixFilter.prototype.blackAndWhite = function(multiply) {
		this._loadMatrix([
			.3,
			.6,
			.1,
			0,
			0,
			.3,
			.6,
			.1,
			0,
			0,
			.3,
			.6,
			.1,
			0,
			0,
			0,
			0,
			0,
			1,
			0
		], multiply);
	};
	/**
	* Set the hue property of the color
	* @param rotation - in degrees
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	ColorMatrixFilter.prototype.hue = function(rotation, multiply) {
		rotation = (rotation || 0) / 180 * Math.PI;
		var cosR = Math.cos(rotation);
		var sinR = Math.sin(rotation);
		var sqrt = Math.sqrt;
		var w = 1 / 3;
		var sqrW = sqrt(w);
		var matrix = [
			cosR + (1 - cosR) * w,
			w * (1 - cosR) - sqrW * sinR,
			w * (1 - cosR) + sqrW * sinR,
			0,
			0,
			w * (1 - cosR) + sqrW * sinR,
			cosR + w * (1 - cosR),
			w * (1 - cosR) - sqrW * sinR,
			0,
			0,
			w * (1 - cosR) - sqrW * sinR,
			w * (1 - cosR) + sqrW * sinR,
			cosR + w * (1 - cosR),
			0,
			0,
			0,
			0,
			0,
			1,
			0
		];
		this._loadMatrix(matrix, multiply);
	};
	/**
	* Set the contrast matrix, increase the separation between dark and bright
	* Increase contrast : shadows darker and highlights brighter
	* Decrease contrast : bring the shadows up and the highlights down
	* @param amount - value of the contrast (0-1)
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	ColorMatrixFilter.prototype.contrast = function(amount, multiply) {
		var v = (amount || 0) + 1;
		var o = -.5 * (v - 1);
		var matrix = [
			v,
			0,
			0,
			0,
			o,
			0,
			v,
			0,
			0,
			o,
			0,
			0,
			v,
			0,
			o,
			0,
			0,
			0,
			1,
			0
		];
		this._loadMatrix(matrix, multiply);
	};
	/**
	* Set the saturation matrix, increase the separation between colors
	* Increase saturation : increase contrast, brightness, and sharpness
	* @param amount - The saturation amount (0-1)
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	ColorMatrixFilter.prototype.saturate = function(amount, multiply) {
		if (amount === void 0) amount = 0;
		var x = amount * 2 / 3 + 1;
		var y = (x - 1) * -.5;
		var matrix = [
			x,
			y,
			y,
			0,
			0,
			y,
			x,
			y,
			0,
			0,
			y,
			y,
			x,
			0,
			0,
			0,
			0,
			0,
			1,
			0
		];
		this._loadMatrix(matrix, multiply);
	};
	/** Desaturate image (remove color) Call the saturate function */
	ColorMatrixFilter.prototype.desaturate = function() {
		this.saturate(-1);
	};
	/**
	* Negative image (inverse of classic rgb matrix)
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	ColorMatrixFilter.prototype.negative = function(multiply) {
		this._loadMatrix([
			-1,
			0,
			0,
			1,
			0,
			0,
			-1,
			0,
			1,
			0,
			0,
			0,
			-1,
			1,
			0,
			0,
			0,
			0,
			1,
			0
		], multiply);
	};
	/**
	* Sepia image
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	ColorMatrixFilter.prototype.sepia = function(multiply) {
		this._loadMatrix([
			.393,
			.7689999,
			.18899999,
			0,
			0,
			.349,
			.6859999,
			.16799999,
			0,
			0,
			.272,
			.5339999,
			.13099999,
			0,
			0,
			0,
			0,
			0,
			1,
			0
		], multiply);
	};
	/**
	* Color motion picture process invented in 1916 (thanks Dominic Szablewski)
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	ColorMatrixFilter.prototype.technicolor = function(multiply) {
		this._loadMatrix([
			1.9125277891456083,
			-.8545344976951645,
			-.09155508482755585,
			0,
			11.793603434377337,
			-.3087833385928097,
			1.7658908555458428,
			-.10601743074722245,
			0,
			-70.35205161461398,
			-.231103377548616,
			-.7501899197440212,
			1.847597816108189,
			0,
			30.950940869491138,
			0,
			0,
			0,
			1,
			0
		], multiply);
	};
	/**
	* Polaroid filter
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	ColorMatrixFilter.prototype.polaroid = function(multiply) {
		this._loadMatrix([
			1.438,
			-.062,
			-.062,
			0,
			0,
			-.122,
			1.378,
			-.122,
			0,
			0,
			-.016,
			-.016,
			1.483,
			0,
			0,
			0,
			0,
			0,
			1,
			0
		], multiply);
	};
	/**
	* Filter who transforms : Red -> Blue and Blue -> Red
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	ColorMatrixFilter.prototype.toBGR = function(multiply) {
		this._loadMatrix([
			0,
			0,
			1,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			0,
			0,
			0,
			1,
			0
		], multiply);
	};
	/**
	* Color reversal film introduced by Eastman Kodak in 1935. (thanks Dominic Szablewski)
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	ColorMatrixFilter.prototype.kodachrome = function(multiply) {
		this._loadMatrix([
			1.1285582396593525,
			-.3967382283601348,
			-.03992559172921793,
			0,
			63.72958762196502,
			-.16404339962244616,
			1.0835251566291304,
			-.05498805115633132,
			0,
			24.732407896706203,
			-.16786010706155763,
			-.5603416277695248,
			1.6014850761964943,
			0,
			35.62982807460946,
			0,
			0,
			0,
			1,
			0
		], multiply);
	};
	/**
	* Brown delicious browni filter (thanks Dominic Szablewski)
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	ColorMatrixFilter.prototype.browni = function(multiply) {
		this._loadMatrix([
			.5997023498159715,
			.34553243048391263,
			-.2708298674538042,
			0,
			47.43192855600873,
			-.037703249837783157,
			.8609577587992641,
			.15059552388459913,
			0,
			-36.96841498319127,
			.24113635128153335,
			-.07441037908422492,
			.44972182064877153,
			0,
			-7.562075277591283,
			0,
			0,
			0,
			1,
			0
		], multiply);
	};
	/**
	* Vintage filter (thanks Dominic Szablewski)
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	ColorMatrixFilter.prototype.vintage = function(multiply) {
		this._loadMatrix([
			.6279345635605994,
			.3202183420819367,
			-.03965408211312453,
			0,
			9.651285835294123,
			.02578397704808868,
			.6441188644374771,
			.03259127616149294,
			0,
			7.462829176470591,
			.0466055556782719,
			-.0851232987247891,
			.5241648018700465,
			0,
			5.159190588235296,
			0,
			0,
			0,
			1,
			0
		], multiply);
	};
	/**
	* We don't know exactly what it does, kind of gradient map, but funny to play with!
	* @param desaturation - Tone values.
	* @param toned - Tone values.
	* @param lightColor - Tone values, example: `0xFFE580`
	* @param darkColor - Tone values, example: `0xFFE580`
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	ColorMatrixFilter.prototype.colorTone = function(desaturation, toned, lightColor, darkColor, multiply) {
		desaturation = desaturation || .2;
		toned = toned || .15;
		lightColor = lightColor || 16770432;
		darkColor = darkColor || 3375104;
		var lR = (lightColor >> 16 & 255) / 255;
		var lG = (lightColor >> 8 & 255) / 255;
		var lB = (lightColor & 255) / 255;
		var dR = (darkColor >> 16 & 255) / 255;
		var dG = (darkColor >> 8 & 255) / 255;
		var dB = (darkColor & 255) / 255;
		var matrix = [
			.3,
			.59,
			.11,
			0,
			0,
			lR,
			lG,
			lB,
			desaturation,
			0,
			dR,
			dG,
			dB,
			toned,
			0,
			lR - dR,
			lG - dG,
			lB - dB,
			0,
			0
		];
		this._loadMatrix(matrix, multiply);
	};
	/**
	* Night effect
	* @param intensity - The intensity of the night effect.
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	ColorMatrixFilter.prototype.night = function(intensity, multiply) {
		intensity = intensity || .1;
		var matrix = [
			intensity * -2,
			-intensity,
			0,
			0,
			0,
			-intensity,
			0,
			intensity,
			0,
			0,
			0,
			intensity,
			intensity * 2,
			0,
			0,
			0,
			0,
			0,
			1,
			0
		];
		this._loadMatrix(matrix, multiply);
	};
	/**
	* Predator effect
	*
	* Erase the current matrix by setting a new indepent one
	* @param amount - how much the predator feels his future victim
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	ColorMatrixFilter.prototype.predator = function(amount, multiply) {
		var matrix = [
			11.224130630493164 * amount,
			-4.794486999511719 * amount,
			-2.8746118545532227 * amount,
			0 * amount,
			.40342438220977783 * amount,
			-3.6330697536468506 * amount,
			9.193157196044922 * amount,
			-2.951810836791992 * amount,
			0 * amount,
			-1.316135048866272 * amount,
			-3.2184197902679443 * amount,
			-4.2375030517578125 * amount,
			7.476448059082031 * amount,
			0 * amount,
			.8044459223747253 * amount,
			0,
			0,
			0,
			1,
			0
		];
		this._loadMatrix(matrix, multiply);
	};
	/**
	* LSD effect
	*
	* Multiply the current matrix
	* @param multiply - if true, current matrix and matrix are multiplied. If false,
	*  just set the current matrix with @param matrix
	*/
	ColorMatrixFilter.prototype.lsd = function(multiply) {
		this._loadMatrix([
			2,
			-.4,
			.5,
			0,
			0,
			-.5,
			2,
			-.4,
			0,
			0,
			-.4,
			-.5,
			3,
			0,
			0,
			0,
			0,
			0,
			1,
			0
		], multiply);
	};
	/** Erase the current matrix by setting the default one. */
	ColorMatrixFilter.prototype.reset = function() {
		this._loadMatrix([
			1,
			0,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			0,
			1,
			0
		], false);
	};
	Object.defineProperty(ColorMatrixFilter.prototype, "matrix", {
		/**
		* The matrix of the color matrix filter
		* @member {number[]}
		* @default [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]
		*/
		get: function() {
			return this.uniforms.m;
		},
		set: function(value) {
			this.uniforms.m = value;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(ColorMatrixFilter.prototype, "alpha", {
		/**
		* The opacity value to use when mixing the original and resultant colors.
		*
		* When the value is 0, the original color is used without modification.
		* When the value is 1, the result color is used.
		* When in the range (0, 1) the color is interpolated between the original and result by this amount.
		* @default 1
		*/
		get: function() {
			return this.uniforms.uAlpha;
		},
		set: function(value) {
			this.uniforms.uAlpha = value;
		},
		enumerable: false,
		configurable: true
	});
	return ColorMatrixFilter;
}(Filter);
ColorMatrixFilter.prototype.grayscale = ColorMatrixFilter.prototype.greyscale;
//#endregion
//#region node_modules/@pixi/filter-displacement/dist/esm/filter-displacement.mjs
/*!
* @pixi/filter-displacement - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/filter-displacement is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics$4 = function(d, b) {
	extendStatics$4 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
		d.__proto__ = b;
	} || function(d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	};
	return extendStatics$4(d, b);
};
function __extends$4(d, b) {
	extendStatics$4(d, b);
	function __() {
		this.constructor = d;
	}
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var fragment$2 = "varying vec2 vFilterCoord;\nvarying vec2 vTextureCoord;\n\nuniform vec2 scale;\nuniform mat2 rotation;\nuniform sampler2D uSampler;\nuniform sampler2D mapSampler;\n\nuniform highp vec4 inputSize;\nuniform vec4 inputClamp;\n\nvoid main(void)\n{\n  vec4 map =  texture2D(mapSampler, vFilterCoord);\n\n  map -= 0.5;\n  map.xy = scale * inputSize.zw * (rotation * map.xy);\n\n  gl_FragColor = texture2D(uSampler, clamp(vec2(vTextureCoord.x + map.x, vTextureCoord.y + map.y), inputClamp.xy, inputClamp.zw));\n}\n";
var vertex$1 = "attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\nuniform mat3 filterMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec2 vFilterCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n	gl_Position = filterVertexPosition();\n	vTextureCoord = filterTextureCoord();\n	vFilterCoord = ( filterMatrix * vec3( vTextureCoord, 1.0)  ).xy;\n}\n";
/**
* The DisplacementFilter class uses the pixel values from the specified texture
* (called the displacement map) to perform a displacement of an object.
*
* You can use this filter to apply all manor of crazy warping effects.
* Currently the `r` property of the texture is used to offset the `x`
* and the `g` property of the texture is used to offset the `y`.
*
* The way it works is it uses the values of the displacement map to look up the
* correct pixels to output. This means it's not technically moving the original.
* Instead, it's starting at the output and asking "which pixel from the original goes here".
* For example, if a displacement map pixel has `red = 1` and the filter scale is `20`,
* this filter will output the pixel approximately 20 pixels to the right of the original.
* @memberof PIXI.filters
*/
var DisplacementFilter = function(_super) {
	__extends$4(DisplacementFilter, _super);
	/**
	* @param {PIXI.Sprite} sprite - The sprite used for the displacement map. (make sure its added to the scene!)
	* @param scale - The scale of the displacement
	*/
	function DisplacementFilter(sprite, scale) {
		var _this = this;
		var maskMatrix = new Matrix();
		sprite.renderable = false;
		_this = _super.call(this, vertex$1, fragment$2, {
			mapSampler: sprite._texture,
			filterMatrix: maskMatrix,
			scale: {
				x: 1,
				y: 1
			},
			rotation: new Float32Array([
				1,
				0,
				0,
				1
			])
		}) || this;
		_this.maskSprite = sprite;
		_this.maskMatrix = maskMatrix;
		if (scale === null || scale === void 0) scale = 20;
		/**
		* scaleX, scaleY for displacements
		* @member {PIXI.Point}
		*/
		_this.scale = new Point(scale, scale);
		return _this;
	}
	/**
	* Applies the filter.
	* @param filterManager - The manager.
	* @param input - The input target.
	* @param output - The output target.
	* @param clearMode - clearMode.
	*/
	DisplacementFilter.prototype.apply = function(filterManager, input, output, clearMode) {
		this.uniforms.filterMatrix = filterManager.calculateSpriteMatrix(this.maskMatrix, this.maskSprite);
		this.uniforms.scale.x = this.scale.x;
		this.uniforms.scale.y = this.scale.y;
		var wt = this.maskSprite.worldTransform;
		var lenX = Math.sqrt(wt.a * wt.a + wt.b * wt.b);
		var lenY = Math.sqrt(wt.c * wt.c + wt.d * wt.d);
		if (lenX !== 0 && lenY !== 0) {
			this.uniforms.rotation[0] = wt.a / lenX;
			this.uniforms.rotation[1] = wt.b / lenX;
			this.uniforms.rotation[2] = wt.c / lenY;
			this.uniforms.rotation[3] = wt.d / lenY;
		}
		filterManager.applyFilter(this, input, output, clearMode);
	};
	Object.defineProperty(DisplacementFilter.prototype, "map", {
		/** The texture used for the displacement map. Must be power of 2 sized texture. */
		get: function() {
			return this.uniforms.mapSampler;
		},
		set: function(value) {
			this.uniforms.mapSampler = value;
		},
		enumerable: false,
		configurable: true
	});
	return DisplacementFilter;
}(Filter);
//#endregion
//#region node_modules/@pixi/filter-fxaa/dist/esm/filter-fxaa.mjs
/*!
* @pixi/filter-fxaa - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/filter-fxaa is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics$3 = function(d, b) {
	extendStatics$3 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
		d.__proto__ = b;
	} || function(d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	};
	return extendStatics$3(d, b);
};
function __extends$3(d, b) {
	extendStatics$3(d, b);
	function __() {
		this.constructor = d;
	}
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var vertex = "\nattribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 v_rgbNW;\nvarying vec2 v_rgbNE;\nvarying vec2 v_rgbSW;\nvarying vec2 v_rgbSE;\nvarying vec2 v_rgbM;\n\nvarying vec2 vFragCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvoid texcoords(vec2 fragCoord, vec2 inverseVP,\n               out vec2 v_rgbNW, out vec2 v_rgbNE,\n               out vec2 v_rgbSW, out vec2 v_rgbSE,\n               out vec2 v_rgbM) {\n    v_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;\n    v_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;\n    v_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;\n    v_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;\n    v_rgbM = vec2(fragCoord * inverseVP);\n}\n\nvoid main(void) {\n\n   gl_Position = filterVertexPosition();\n\n   vFragCoord = aVertexPosition * outputFrame.zw;\n\n   texcoords(vFragCoord, inputSize.zw, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);\n}\n";
var fragment$1 = "varying vec2 v_rgbNW;\nvarying vec2 v_rgbNE;\nvarying vec2 v_rgbSW;\nvarying vec2 v_rgbSE;\nvarying vec2 v_rgbM;\n\nvarying vec2 vFragCoord;\nuniform sampler2D uSampler;\nuniform highp vec4 inputSize;\n\n\n/**\n Basic FXAA implementation based on the code on geeks3d.com with the\n modification that the texture2DLod stuff was removed since it's\n unsupported by WebGL.\n\n --\n\n From:\n https://github.com/mitsuhiko/webgl-meincraft\n\n Copyright (c) 2011 by Armin Ronacher.\n\n Some rights reserved.\n\n Redistribution and use in source and binary forms, with or without\n modification, are permitted provided that the following conditions are\n met:\n\n * Redistributions of source code must retain the above copyright\n notice, this list of conditions and the following disclaimer.\n\n * Redistributions in binary form must reproduce the above\n copyright notice, this list of conditions and the following\n disclaimer in the documentation and/or other materials provided\n with the distribution.\n\n * The names of the contributors may not be used to endorse or\n promote products derived from this software without specific\n prior written permission.\n\n THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS\n \"AS IS\" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT\n LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR\n A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT\n OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,\n SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,\n DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY\n THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT\n (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\n OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n */\n\n#ifndef FXAA_REDUCE_MIN\n#define FXAA_REDUCE_MIN   (1.0/ 128.0)\n#endif\n#ifndef FXAA_REDUCE_MUL\n#define FXAA_REDUCE_MUL   (1.0 / 8.0)\n#endif\n#ifndef FXAA_SPAN_MAX\n#define FXAA_SPAN_MAX     8.0\n#endif\n\n//optimized version for mobile, where dependent\n//texture reads can be a bottleneck\nvec4 fxaa(sampler2D tex, vec2 fragCoord, vec2 inverseVP,\n          vec2 v_rgbNW, vec2 v_rgbNE,\n          vec2 v_rgbSW, vec2 v_rgbSE,\n          vec2 v_rgbM) {\n    vec4 color;\n    vec3 rgbNW = texture2D(tex, v_rgbNW).xyz;\n    vec3 rgbNE = texture2D(tex, v_rgbNE).xyz;\n    vec3 rgbSW = texture2D(tex, v_rgbSW).xyz;\n    vec3 rgbSE = texture2D(tex, v_rgbSE).xyz;\n    vec4 texColor = texture2D(tex, v_rgbM);\n    vec3 rgbM  = texColor.xyz;\n    vec3 luma = vec3(0.299, 0.587, 0.114);\n    float lumaNW = dot(rgbNW, luma);\n    float lumaNE = dot(rgbNE, luma);\n    float lumaSW = dot(rgbSW, luma);\n    float lumaSE = dot(rgbSE, luma);\n    float lumaM  = dot(rgbM,  luma);\n    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));\n    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));\n\n    mediump vec2 dir;\n    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));\n    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));\n\n    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *\n                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);\n\n    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);\n    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),\n              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),\n                  dir * rcpDirMin)) * inverseVP;\n\n    vec3 rgbA = 0.5 * (\n                       texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +\n                       texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);\n    vec3 rgbB = rgbA * 0.5 + 0.25 * (\n                                     texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +\n                                     texture2D(tex, fragCoord * inverseVP + dir * 0.5).xyz);\n\n    float lumaB = dot(rgbB, luma);\n    if ((lumaB < lumaMin) || (lumaB > lumaMax))\n        color = vec4(rgbA, texColor.a);\n    else\n        color = vec4(rgbB, texColor.a);\n    return color;\n}\n\nvoid main() {\n\n      vec4 color;\n\n      color = fxaa(uSampler, vFragCoord, inputSize.zw, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);\n\n      gl_FragColor = color;\n}\n";
/**
* Basic FXAA (Fast Approximate Anti-Aliasing) implementation based on the code on geeks3d.com
* with the modification that the texture2DLod stuff was removed since it is unsupported by WebGL.
* @see https://github.com/mitsuhiko/webgl-meincraft
* @memberof PIXI.filters
*/
var FXAAFilter = function(_super) {
	__extends$3(FXAAFilter, _super);
	function FXAAFilter() {
		return _super.call(this, vertex, fragment$1) || this;
	}
	return FXAAFilter;
}(Filter);
//#endregion
//#region node_modules/@pixi/filter-noise/dist/esm/filter-noise.mjs
/*!
* @pixi/filter-noise - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/filter-noise is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics$2 = function(d, b) {
	extendStatics$2 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
		d.__proto__ = b;
	} || function(d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	};
	return extendStatics$2(d, b);
};
function __extends$2(d, b) {
	extendStatics$2(d, b);
	function __() {
		this.constructor = d;
	}
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
var fragment = "precision highp float;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform float uNoise;\nuniform float uSeed;\nuniform sampler2D uSampler;\n\nfloat rand(vec2 co)\n{\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvoid main()\n{\n    vec4 color = texture2D(uSampler, vTextureCoord);\n    float randomValue = rand(gl_FragCoord.xy * uSeed);\n    float diff = (randomValue - 0.5) * uNoise;\n\n    // Un-premultiply alpha before applying the color matrix. See issue #3539.\n    if (color.a > 0.0) {\n        color.rgb /= color.a;\n    }\n\n    color.r += diff;\n    color.g += diff;\n    color.b += diff;\n\n    // Premultiply alpha again.\n    color.rgb *= color.a;\n\n    gl_FragColor = color;\n}\n";
/**
* A Noise effect filter.
*
* original filter: https://github.com/evanw/glfx.js/blob/master/src/filters/adjust/noise.js
* @memberof PIXI.filters
* @author Vico @vicocotea
*/
var NoiseFilter = function(_super) {
	__extends$2(NoiseFilter, _super);
	/**
	* @param {number} [noise=0.5] - The noise intensity, should be a normalized value in the range [0, 1].
	* @param {number} [seed] - A random seed for the noise generation. Default is `Math.random()`.
	*/
	function NoiseFilter(noise, seed) {
		if (noise === void 0) noise = .5;
		if (seed === void 0) seed = Math.random();
		var _this = _super.call(this, "attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n    gl_Position = filterVertexPosition();\n    vTextureCoord = filterTextureCoord();\n}\n", fragment, {
			uNoise: 0,
			uSeed: 0
		}) || this;
		_this.noise = noise;
		_this.seed = seed;
		return _this;
	}
	Object.defineProperty(NoiseFilter.prototype, "noise", {
		/**
		* The amount of noise to apply, this value should be in the range (0, 1].
		* @default 0.5
		*/
		get: function() {
			return this.uniforms.uNoise;
		},
		set: function(value) {
			this.uniforms.uNoise = value;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(NoiseFilter.prototype, "seed", {
		/** A seed value to apply to the random noise generation. `Math.random()` is a good value to use. */
		get: function() {
			return this.uniforms.uSeed;
		},
		set: function(value) {
			this.uniforms.uSeed = value;
		},
		enumerable: false,
		configurable: true
	});
	return NoiseFilter;
}(Filter);
//#endregion
//#region node_modules/@pixi/mixin-cache-as-bitmap/dist/esm/mixin-cache-as-bitmap.mjs
/*!
* @pixi/mixin-cache-as-bitmap - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/mixin-cache-as-bitmap is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
var _tempMatrix = new Matrix();
DisplayObject.prototype._cacheAsBitmap = false;
DisplayObject.prototype._cacheData = null;
DisplayObject.prototype._cacheAsBitmapResolution = null;
DisplayObject.prototype._cacheAsBitmapMultisample = MSAA_QUALITY.NONE;
/**
* @class
* @ignore
* @private
*/
var CacheData = function() {
	function CacheData() {
		this.textureCacheId = null;
		this.originalRender = null;
		this.originalRenderCanvas = null;
		this.originalCalculateBounds = null;
		this.originalGetLocalBounds = null;
		this.originalUpdateTransform = null;
		this.originalDestroy = null;
		this.originalMask = null;
		this.originalFilterArea = null;
		this.originalContainsPoint = null;
		this.sprite = null;
	}
	return CacheData;
}();
Object.defineProperties(DisplayObject.prototype, {
	/**
	* The resolution to use for cacheAsBitmap. By default this will use the renderer's resolution
	* but can be overriden for performance. Lower values will reduce memory usage at the expense
	* of render quality. A falsey value of `null` or `0` will default to the renderer's resolution.
	* If `cacheAsBitmap` is set to `true`, this will re-render with the new resolution.
	* @member {number} cacheAsBitmapResolution
	* @memberof PIXI.DisplayObject#
	* @default null
	*/
	cacheAsBitmapResolution: {
		get: function() {
			return this._cacheAsBitmapResolution;
		},
		set: function(resolution) {
			if (resolution === this._cacheAsBitmapResolution) return;
			this._cacheAsBitmapResolution = resolution;
			if (this.cacheAsBitmap) {
				this.cacheAsBitmap = false;
				this.cacheAsBitmap = true;
			}
		}
	},
	/**
	* The number of samples to use for cacheAsBitmap. If set to `null`, the renderer's
	* sample count is used.
	* If `cacheAsBitmap` is set to `true`, this will re-render with the new number of samples.
	* @member {number} cacheAsBitmapMultisample
	* @memberof PIXI.DisplayObject#
	* @default PIXI.MSAA_QUALITY.NONE
	*/
	cacheAsBitmapMultisample: {
		get: function() {
			return this._cacheAsBitmapMultisample;
		},
		set: function(multisample) {
			if (multisample === this._cacheAsBitmapMultisample) return;
			this._cacheAsBitmapMultisample = multisample;
			if (this.cacheAsBitmap) {
				this.cacheAsBitmap = false;
				this.cacheAsBitmap = true;
			}
		}
	},
	/**
	* Set this to true if you want this display object to be cached as a bitmap.
	* This basically takes a snap shot of the display object as it is at that moment. It can
	* provide a performance benefit for complex static displayObjects.
	* To remove simply set this property to `false`
	*
	* IMPORTANT GOTCHA - Make sure that all your textures are preloaded BEFORE setting this property to true
	* as it will take a snapshot of what is currently there. If the textures have not loaded then they will not appear.
	* @member {boolean}
	* @memberof PIXI.DisplayObject#
	*/
	cacheAsBitmap: {
		get: function() {
			return this._cacheAsBitmap;
		},
		set: function(value) {
			if (this._cacheAsBitmap === value) return;
			this._cacheAsBitmap = value;
			var data;
			if (value) {
				if (!this._cacheData) this._cacheData = new CacheData();
				data = this._cacheData;
				data.originalRender = this.render;
				data.originalRenderCanvas = this.renderCanvas;
				data.originalUpdateTransform = this.updateTransform;
				data.originalCalculateBounds = this.calculateBounds;
				data.originalGetLocalBounds = this.getLocalBounds;
				data.originalDestroy = this.destroy;
				data.originalContainsPoint = this.containsPoint;
				data.originalMask = this._mask;
				data.originalFilterArea = this.filterArea;
				this.render = this._renderCached;
				this.renderCanvas = this._renderCachedCanvas;
				this.destroy = this._cacheAsBitmapDestroy;
			} else {
				data = this._cacheData;
				if (data.sprite) this._destroyCachedDisplayObject();
				this.render = data.originalRender;
				this.renderCanvas = data.originalRenderCanvas;
				this.calculateBounds = data.originalCalculateBounds;
				this.getLocalBounds = data.originalGetLocalBounds;
				this.destroy = data.originalDestroy;
				this.updateTransform = data.originalUpdateTransform;
				this.containsPoint = data.originalContainsPoint;
				this._mask = data.originalMask;
				this.filterArea = data.originalFilterArea;
			}
		}
	}
});
/**
* Renders a cached version of the sprite with WebGL
* @private
* @method _renderCached
* @memberof PIXI.DisplayObject#
* @param {PIXI.Renderer} renderer - the WebGL renderer
*/
DisplayObject.prototype._renderCached = function _renderCached(renderer) {
	if (!this.visible || this.worldAlpha <= 0 || !this.renderable) return;
	this._initCachedDisplayObject(renderer);
	this._cacheData.sprite.transform._worldID = this.transform._worldID;
	this._cacheData.sprite.worldAlpha = this.worldAlpha;
	this._cacheData.sprite._render(renderer);
};
/**
* Prepares the WebGL renderer to cache the sprite
* @private
* @method _initCachedDisplayObject
* @memberof PIXI.DisplayObject#
* @param {PIXI.Renderer} renderer - the WebGL renderer
*/
DisplayObject.prototype._initCachedDisplayObject = function _initCachedDisplayObject(renderer) {
	var _a;
	if (this._cacheData && this._cacheData.sprite) return;
	var cacheAlpha = this.alpha;
	this.alpha = 1;
	renderer.batch.flush();
	var bounds = this.getLocalBounds(null, true).clone();
	if (this.filters && this.filters.length) {
		var padding = this.filters[0].padding;
		bounds.pad(padding);
	}
	bounds.ceil(settings.RESOLUTION);
	var cachedRenderTexture = renderer.renderTexture.current;
	var cachedSourceFrame = renderer.renderTexture.sourceFrame.clone();
	var cachedDestinationFrame = renderer.renderTexture.destinationFrame.clone();
	var cachedProjectionTransform = renderer.projection.transform;
	var renderTexture = RenderTexture.create({
		width: bounds.width,
		height: bounds.height,
		resolution: this.cacheAsBitmapResolution || renderer.resolution,
		multisample: (_a = this.cacheAsBitmapMultisample) !== null && _a !== void 0 ? _a : renderer.multisample
	});
	var textureCacheId = "cacheAsBitmap_" + uid();
	this._cacheData.textureCacheId = textureCacheId;
	BaseTexture.addToCache(renderTexture.baseTexture, textureCacheId);
	Texture.addToCache(renderTexture, textureCacheId);
	var m = this.transform.localTransform.copyTo(_tempMatrix).invert().translate(-bounds.x, -bounds.y);
	this.render = this._cacheData.originalRender;
	renderer.render(this, {
		renderTexture,
		clear: true,
		transform: m,
		skipUpdateTransform: false
	});
	renderer.framebuffer.blit();
	renderer.projection.transform = cachedProjectionTransform;
	renderer.renderTexture.bind(cachedRenderTexture, cachedSourceFrame, cachedDestinationFrame);
	this.render = this._renderCached;
	this.updateTransform = this.displayObjectUpdateTransform;
	this.calculateBounds = this._calculateCachedBounds;
	this.getLocalBounds = this._getCachedLocalBounds;
	this._mask = null;
	this.filterArea = null;
	this.alpha = cacheAlpha;
	var cachedSprite = new Sprite(renderTexture);
	cachedSprite.transform.worldTransform = this.transform.worldTransform;
	cachedSprite.anchor.x = -(bounds.x / bounds.width);
	cachedSprite.anchor.y = -(bounds.y / bounds.height);
	cachedSprite.alpha = cacheAlpha;
	cachedSprite._bounds = this._bounds;
	this._cacheData.sprite = cachedSprite;
	this.transform._parentID = -1;
	if (!this.parent) {
		this.enableTempParent();
		this.updateTransform();
		this.disableTempParent(null);
	} else this.updateTransform();
	this.containsPoint = cachedSprite.containsPoint.bind(cachedSprite);
};
/**
* Renders a cached version of the sprite with canvas
* @private
* @method _renderCachedCanvas
* @memberof PIXI.DisplayObject#
* @param {PIXI.CanvasRenderer} renderer - The canvas renderer
*/
DisplayObject.prototype._renderCachedCanvas = function _renderCachedCanvas(renderer) {
	if (!this.visible || this.worldAlpha <= 0 || !this.renderable) return;
	this._initCachedDisplayObjectCanvas(renderer);
	this._cacheData.sprite.worldAlpha = this.worldAlpha;
	this._cacheData.sprite._renderCanvas(renderer);
};
/**
* Prepares the Canvas renderer to cache the sprite
* @private
* @method _initCachedDisplayObjectCanvas
* @memberof PIXI.DisplayObject#
* @param {PIXI.CanvasRenderer} renderer - The canvas renderer
*/
DisplayObject.prototype._initCachedDisplayObjectCanvas = function _initCachedDisplayObjectCanvas(renderer) {
	if (this._cacheData && this._cacheData.sprite) return;
	var bounds = this.getLocalBounds(null, true);
	var cacheAlpha = this.alpha;
	this.alpha = 1;
	var cachedRenderTarget = renderer.context;
	var cachedProjectionTransform = renderer._projTransform;
	bounds.ceil(settings.RESOLUTION);
	var renderTexture = RenderTexture.create({
		width: bounds.width,
		height: bounds.height
	});
	var textureCacheId = "cacheAsBitmap_" + uid();
	this._cacheData.textureCacheId = textureCacheId;
	BaseTexture.addToCache(renderTexture.baseTexture, textureCacheId);
	Texture.addToCache(renderTexture, textureCacheId);
	var m = _tempMatrix;
	this.transform.localTransform.copyTo(m);
	m.invert();
	m.tx -= bounds.x;
	m.ty -= bounds.y;
	this.renderCanvas = this._cacheData.originalRenderCanvas;
	renderer.render(this, {
		renderTexture,
		clear: true,
		transform: m,
		skipUpdateTransform: false
	});
	renderer.context = cachedRenderTarget;
	renderer._projTransform = cachedProjectionTransform;
	this.renderCanvas = this._renderCachedCanvas;
	this.updateTransform = this.displayObjectUpdateTransform;
	this.calculateBounds = this._calculateCachedBounds;
	this.getLocalBounds = this._getCachedLocalBounds;
	this._mask = null;
	this.filterArea = null;
	this.alpha = cacheAlpha;
	var cachedSprite = new Sprite(renderTexture);
	cachedSprite.transform.worldTransform = this.transform.worldTransform;
	cachedSprite.anchor.x = -(bounds.x / bounds.width);
	cachedSprite.anchor.y = -(bounds.y / bounds.height);
	cachedSprite.alpha = cacheAlpha;
	cachedSprite._bounds = this._bounds;
	this._cacheData.sprite = cachedSprite;
	this.transform._parentID = -1;
	if (!this.parent) {
		this.parent = renderer._tempDisplayObjectParent;
		this.updateTransform();
		this.parent = null;
	} else this.updateTransform();
	this.containsPoint = cachedSprite.containsPoint.bind(cachedSprite);
};
/**
* Calculates the bounds of the cached sprite
* @private
* @method
*/
DisplayObject.prototype._calculateCachedBounds = function _calculateCachedBounds() {
	this._bounds.clear();
	this._cacheData.sprite.transform._worldID = this.transform._worldID;
	this._cacheData.sprite._calculateBounds();
	this._bounds.updateID = this._boundsID;
};
/**
* Gets the bounds of the cached sprite.
* @private
* @method
* @returns {Rectangle} The local bounds.
*/
DisplayObject.prototype._getCachedLocalBounds = function _getCachedLocalBounds() {
	return this._cacheData.sprite.getLocalBounds(null);
};
/**
* Destroys the cached sprite.
* @private
* @method
*/
DisplayObject.prototype._destroyCachedDisplayObject = function _destroyCachedDisplayObject() {
	this._cacheData.sprite._texture.destroy(true);
	this._cacheData.sprite = null;
	BaseTexture.removeFromCache(this._cacheData.textureCacheId);
	Texture.removeFromCache(this._cacheData.textureCacheId);
	this._cacheData.textureCacheId = null;
};
/**
* Destroys the cached object.
* @private
* @method
* @param {object|boolean} [options] - Options parameter. A boolean will act as if all options
*  have been set to that value.
*  Used when destroying containers, see the Container.destroy method.
*/
DisplayObject.prototype._cacheAsBitmapDestroy = function _cacheAsBitmapDestroy(options) {
	this.cacheAsBitmap = false;
	this.destroy(options);
};
//#endregion
//#region node_modules/@pixi/mixin-get-child-by-name/dist/esm/mixin-get-child-by-name.mjs
/*!
* @pixi/mixin-get-child-by-name - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/mixin-get-child-by-name is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/**
* The instance name of the object.
* @memberof PIXI.DisplayObject#
* @member {string} name
*/
DisplayObject.prototype.name = null;
/**
* Returns the display object in the container.
*
* Recursive searches are done in a preorder traversal.
* @method getChildByName
* @memberof PIXI.Container#
* @param {string} name - Instance name.
* @param {boolean}[deep=false] - Whether to search recursively
* @returns {PIXI.DisplayObject} The child with the specified name.
*/
Container.prototype.getChildByName = function getChildByName(name, deep) {
	for (var i = 0, j = this.children.length; i < j; i++) if (this.children[i].name === name) return this.children[i];
	if (deep) for (var i = 0, j = this.children.length; i < j; i++) {
		var child = this.children[i];
		if (!child.getChildByName) continue;
		var target = child.getChildByName(name, true);
		if (target) return target;
	}
	return null;
};
//#endregion
//#region node_modules/@pixi/mixin-get-global-position/dist/esm/mixin-get-global-position.mjs
/*!
* @pixi/mixin-get-global-position - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/mixin-get-global-position is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/**
* Returns the global position of the displayObject. Does not depend on object scale, rotation and pivot.
* @method getGlobalPosition
* @memberof PIXI.DisplayObject#
* @param {PIXI.Point} [point=new PIXI.Point()] - The point to write the global value to.
* @param {boolean} [skipUpdate=false] - Setting to true will stop the transforms of the scene graph from
*  being updated. This means the calculation returned MAY be out of date BUT will give you a
*  nice performance boost.
* @returns {PIXI.Point} The updated point.
*/
DisplayObject.prototype.getGlobalPosition = function getGlobalPosition(point, skipUpdate) {
	if (point === void 0) point = new Point();
	if (skipUpdate === void 0) skipUpdate = false;
	if (this.parent) this.parent.toGlobal(this.position, point, skipUpdate);
	else {
		point.x = this.position.x;
		point.y = this.position.y;
	}
	return point;
};
//#endregion
//#region node_modules/@pixi/app/dist/esm/app.mjs
/*!
* @pixi/app - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/app is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/**
* Middleware for for Application's resize functionality
* @private
* @class
*/
var ResizePlugin = function() {
	function ResizePlugin() {}
	/**
	* Initialize the plugin with scope of application instance
	* @static
	* @private
	* @param {object} [options] - See application options
	*/
	ResizePlugin.init = function(options) {
		var _this = this;
		Object.defineProperty(
			this,
			"resizeTo",
			/**
			* The HTML element or window to automatically resize the
			* renderer's view element to match width and height.
			* @member {Window|HTMLElement}
			* @name resizeTo
			* @memberof PIXI.Application#
			*/
			{
				set: function(dom) {
					globalThis.removeEventListener("resize", this.queueResize);
					this._resizeTo = dom;
					if (dom) {
						globalThis.addEventListener("resize", this.queueResize);
						this.resize();
					}
				},
				get: function() {
					return this._resizeTo;
				}
			}
		);
		/**
		* Resize is throttled, so it's safe to call this multiple times per frame and it'll
		* only be called once.
		* @memberof PIXI.Application#
		* @method queueResize
		* @private
		*/
		this.queueResize = function() {
			if (!_this._resizeTo) return;
			_this.cancelResize();
			_this._resizeId = requestAnimationFrame(function() {
				return _this.resize();
			});
		};
		/**
		* Cancel the resize queue.
		* @memberof PIXI.Application#
		* @method cancelResize
		* @private
		*/
		this.cancelResize = function() {
			if (_this._resizeId) {
				cancelAnimationFrame(_this._resizeId);
				_this._resizeId = null;
			}
		};
		/**
		* Execute an immediate resize on the renderer, this is not
		* throttled and can be expensive to call many times in a row.
		* Will resize only if `resizeTo` property is set.
		* @memberof PIXI.Application#
		* @method resize
		*/
		this.resize = function() {
			if (!_this._resizeTo) return;
			_this.cancelResize();
			var width;
			var height;
			if (_this._resizeTo === globalThis.window) {
				width = globalThis.innerWidth;
				height = globalThis.innerHeight;
			} else {
				var _a = _this._resizeTo, clientWidth = _a.clientWidth, clientHeight = _a.clientHeight;
				width = clientWidth;
				height = clientHeight;
			}
			_this.renderer.resize(width, height);
		};
		this._resizeId = null;
		this._resizeTo = null;
		this.resizeTo = options.resizeTo || null;
	};
	/**
	* Clean up the ticker, scoped to application
	* @static
	* @private
	*/
	ResizePlugin.destroy = function() {
		globalThis.removeEventListener("resize", this.queueResize);
		this.cancelResize();
		this.cancelResize = null;
		this.queueResize = null;
		this.resizeTo = null;
		this.resize = null;
	};
	/** @ignore */
	ResizePlugin.extension = ExtensionType.Application;
	return ResizePlugin;
}();
/**
* Convenience class to create a new PIXI application.
*
* This class automatically creates the renderer, ticker and root container.
* @example
* // Create the application
* const app = new PIXI.Application();
*
* // Add the view to the DOM
* document.body.appendChild(app.view);
*
* // ex, add display objects
* app.stage.addChild(PIXI.Sprite.from('something.png'));
* @class
* @memberof PIXI
*/
var Application = function() {
	/**
	* @param {PIXI.IApplicationOptions} [options] - The optional application and renderer parameters.
	* @param {boolean} [options.antialias=false] -
	*  **WebGL Only.** Whether to enable anti-aliasing. This may affect performance.
	* @param {boolean} [options.autoDensity=false] -
	*  Whether the CSS dimensions of the renderer's view should be resized automatically.
	* @param {boolean} [options.autoStart=true] - Automatically starts the rendering after the construction.
	*  **Note**: Setting this parameter to false does NOT stop the shared ticker even if you set
	*  `options.sharedTicker` to `true` in case that it is already started. Stop it by your own.
	* @param {number} [options.backgroundAlpha=1] -
	*  Transparency of the background color, value from `0` (fully transparent) to `1` (fully opaque).
	* @param {number} [options.backgroundColor=0x000000] -
	*  The background color used to clear the canvas. It accepts hex numbers (e.g. `0xff0000`).
	* @param {boolean} [options.clearBeforeRender=true] - Whether to clear the canvas before new render passes.
	* @param {PIXI.IRenderingContext} [options.context] - **WebGL Only.** User-provided WebGL rendering context object.
	* @param {boolean} [options.forceCanvas=false] -
	*  Force using {@link PIXI.CanvasRenderer}, even if WebGL is available. This option only is available when
	*  using **pixi.js-legacy** or **@pixi/canvas-renderer** packages, otherwise it is ignored.
	* @param {number} [options.height=600] - The height of the renderer's view.
	* @param {string} [options.powerPreference] -
	*  **WebGL Only.** A hint indicating what configuration of GPU is suitable for the WebGL context,
	*  can be `'default'`, `'high-performance'` or `'low-power'`.
	*  Setting to `'high-performance'` will prioritize rendering performance over power consumption,
	*  while setting to `'low-power'` will prioritize power saving over rendering performance.
	* @param {boolean} [options.premultipliedAlpha=true] -
	*  **WebGL Only.** Whether the compositor will assume the drawing buffer contains colors with premultiplied alpha.
	* @param {boolean} [options.preserveDrawingBuffer=false] -
	*  **WebGL Only.** Whether to enable drawing buffer preservation. If enabled, the drawing buffer will preserve
	*  its value until cleared or overwritten. Enable this if you need to call `toDataUrl` on the WebGL context.
	* @param {Window|HTMLElement} [options.resizeTo] - Element to automatically resize stage to.
	* @param {number} [options.resolution=PIXI.settings.RESOLUTION] -
	*  The resolution / device pixel ratio of the renderer.
	* @param {boolean} [options.sharedLoader=false] - `true` to use PIXI.Loader.shared, `false` to create new Loader.
	* @param {boolean} [options.sharedTicker=false] - `true` to use PIXI.Ticker.shared, `false` to create new ticker.
	*  If set to `false`, you cannot register a handler to occur before anything that runs on the shared ticker.
	*  The system ticker will always run before both the shared ticker and the app ticker.
	* @param {boolean} [options.transparent] -
	*  **Deprecated since 6.0.0, Use `backgroundAlpha` instead.** \
	*  `true` sets `backgroundAlpha` to `0`, `false` sets `backgroundAlpha` to `1`.
	* @param {boolean|'notMultiplied'} [options.useContextAlpha=true] -
	*  Pass-through value for canvas' context attribute `alpha`. This option is for cases where the
	*  canvas needs to be opaque, possibly for performance reasons on some older devices.
	*  If you want to set transparency, please use `backgroundAlpha`. \
	*  **WebGL Only:** When set to `'notMultiplied'`, the canvas' context attribute `alpha` will be
	*  set to `true` and `premultipliedAlpha` will be to `false`.
	* @param {HTMLCanvasElement} [options.view=null] -
	*  The canvas to use as the view. If omitted, a new canvas will be created.
	* @param {number} [options.width=800] - The width of the renderer's view.
	*/
	function Application(options) {
		var _this = this;
		/**
		* The root display container that's rendered.
		* @member {PIXI.Container}
		*/
		this.stage = new Container();
		options = Object.assign({ forceCanvas: false }, options);
		this.renderer = autoDetectRenderer(options);
		Application._plugins.forEach(function(plugin) {
			plugin.init.call(_this, options);
		});
	}
	/**
	* Use the {@link PIXI.extensions.add} API to register plugins.
	* @deprecated since 6.5.0
	* @static
	* @param {PIXI.IApplicationPlugin} plugin - Plugin being installed
	*/
	Application.registerPlugin = function(plugin) {
		deprecation("6.5.0", "Application.registerPlugin() is deprecated, use extensions.add()");
		extensions.add({
			type: ExtensionType.Application,
			ref: plugin
		});
	};
	/** Render the current stage. */
	Application.prototype.render = function() {
		this.renderer.render(this.stage);
	};
	Object.defineProperty(Application.prototype, "view", {
		/**
		* Reference to the renderer's canvas element.
		* @member {HTMLCanvasElement}
		* @readonly
		*/
		get: function() {
			return this.renderer.view;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Application.prototype, "screen", {
		/**
		* Reference to the renderer's screen rectangle. Its safe to use as `filterArea` or `hitArea` for the whole screen.
		* @member {PIXI.Rectangle}
		* @readonly
		*/
		get: function() {
			return this.renderer.screen;
		},
		enumerable: false,
		configurable: true
	});
	/**
	* Destroy and don't use after this.
	* @param {boolean} [removeView=false] - Automatically remove canvas from DOM.
	* @param {object|boolean} [stageOptions] - Options parameter. A boolean will act as if all options
	*  have been set to that value
	* @param {boolean} [stageOptions.children=false] - if set to true, all the children will have their destroy
	*  method called as well. 'stageOptions' will be passed on to those calls.
	* @param {boolean} [stageOptions.texture=false] - Only used for child Sprites if stageOptions.children is set
	*  to true. Should it destroy the texture of the child sprite
	* @param {boolean} [stageOptions.baseTexture=false] - Only used for child Sprites if stageOptions.children is set
	*  to true. Should it destroy the base texture of the child sprite
	*/
	Application.prototype.destroy = function(removeView, stageOptions) {
		var _this = this;
		var plugins = Application._plugins.slice(0);
		plugins.reverse();
		plugins.forEach(function(plugin) {
			plugin.destroy.call(_this);
		});
		this.stage.destroy(stageOptions);
		this.stage = null;
		this.renderer.destroy(removeView);
		this.renderer = null;
	};
	/** Collection of installed plugins. */
	Application._plugins = [];
	return Application;
}();
extensions.handleByList(ExtensionType.Application, Application._plugins);
extensions.add(ResizePlugin);
//#endregion
//#region node_modules/@pixi/mesh-extras/dist/esm/mesh-extras.mjs
/*!
* @pixi/mesh-extras - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/mesh-extras is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics$1 = function(d, b) {
	extendStatics$1 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
		d.__proto__ = b;
	} || function(d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	};
	return extendStatics$1(d, b);
};
function __extends$1(d, b) {
	extendStatics$1(d, b);
	function __() {
		this.constructor = d;
	}
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
/**
* @memberof PIXI
*/
var PlaneGeometry = function(_super) {
	__extends$1(PlaneGeometry, _super);
	/**
	* @param width - The width of the plane.
	* @param height - The height of the plane.
	* @param segWidth - Number of horizontal segments.
	* @param segHeight - Number of vertical segments.
	*/
	function PlaneGeometry(width, height, segWidth, segHeight) {
		if (width === void 0) width = 100;
		if (height === void 0) height = 100;
		if (segWidth === void 0) segWidth = 10;
		if (segHeight === void 0) segHeight = 10;
		var _this = _super.call(this) || this;
		_this.segWidth = segWidth;
		_this.segHeight = segHeight;
		_this.width = width;
		_this.height = height;
		_this.build();
		return _this;
	}
	/**
	* Refreshes plane coordinates
	* @private
	*/
	PlaneGeometry.prototype.build = function() {
		var total = this.segWidth * this.segHeight;
		var verts = [];
		var uvs = [];
		var indices = [];
		var segmentsX = this.segWidth - 1;
		var segmentsY = this.segHeight - 1;
		var sizeX = this.width / segmentsX;
		var sizeY = this.height / segmentsY;
		for (var i = 0; i < total; i++) {
			var x = i % this.segWidth;
			var y = i / this.segWidth | 0;
			verts.push(x * sizeX, y * sizeY);
			uvs.push(x / segmentsX, y / segmentsY);
		}
		var totalSub = segmentsX * segmentsY;
		for (var i = 0; i < totalSub; i++) {
			var xpos = i % segmentsX;
			var ypos = i / segmentsX | 0;
			var value = ypos * this.segWidth + xpos;
			var value2 = ypos * this.segWidth + xpos + 1;
			var value3 = (ypos + 1) * this.segWidth + xpos;
			var value4 = (ypos + 1) * this.segWidth + xpos + 1;
			indices.push(value, value2, value3, value2, value4, value3);
		}
		this.buffers[0].data = new Float32Array(verts);
		this.buffers[1].data = new Float32Array(uvs);
		this.indexBuffer.data = new Uint16Array(indices);
		this.buffers[0].update();
		this.buffers[1].update();
		this.indexBuffer.update();
	};
	return PlaneGeometry;
}(MeshGeometry);
/**
* RopeGeometry allows you to draw a geometry across several points and then manipulate these points.
*
* ```js
* for (let i = 0; i < 20; i++) {
*     points.push(new PIXI.Point(i * 50, 0));
* };
* const rope = new PIXI.RopeGeometry(100, points);
* ```
* @memberof PIXI
*/
var RopeGeometry = function(_super) {
	__extends$1(RopeGeometry, _super);
	/**
	* @param width - The width (i.e., thickness) of the rope.
	* @param points - An array of {@link PIXI.Point} objects to construct this rope.
	* @param textureScale - By default the rope texture will be stretched to match
	*     rope length. If textureScale is positive this value will be treated as a scaling
	*     factor and the texture will preserve its aspect ratio instead. To create a tiling rope
	*     set baseTexture.wrapMode to {@link PIXI.WRAP_MODES.REPEAT} and use a power of two texture,
	*     then set textureScale=1 to keep the original texture pixel size.
	*     In order to reduce alpha channel artifacts provide a larger texture and downsample -
	*     i.e. set textureScale=0.5 to scale it down twice.
	*/
	function RopeGeometry(width, points, textureScale) {
		if (width === void 0) width = 200;
		if (textureScale === void 0) textureScale = 0;
		var _this = _super.call(this, new Float32Array(points.length * 4), new Float32Array(points.length * 4), new Uint16Array((points.length - 1) * 6)) || this;
		_this.points = points;
		_this._width = width;
		_this.textureScale = textureScale;
		_this.build();
		return _this;
	}
	Object.defineProperty(RopeGeometry.prototype, "width", {
		/**
		* The width (i.e., thickness) of the rope.
		* @readonly
		*/
		get: function() {
			return this._width;
		},
		enumerable: false,
		configurable: true
	});
	/** Refreshes Rope indices and uvs */
	RopeGeometry.prototype.build = function() {
		var points = this.points;
		if (!points) return;
		var vertexBuffer = this.getBuffer("aVertexPosition");
		var uvBuffer = this.getBuffer("aTextureCoord");
		var indexBuffer = this.getIndex();
		if (points.length < 1) return;
		if (vertexBuffer.data.length / 4 !== points.length) {
			vertexBuffer.data = new Float32Array(points.length * 4);
			uvBuffer.data = new Float32Array(points.length * 4);
			indexBuffer.data = new Uint16Array((points.length - 1) * 6);
		}
		var uvs = uvBuffer.data;
		var indices = indexBuffer.data;
		uvs[0] = 0;
		uvs[1] = 0;
		uvs[2] = 0;
		uvs[3] = 1;
		var amount = 0;
		var prev = points[0];
		var textureWidth = this._width * this.textureScale;
		var total = points.length;
		for (var i = 0; i < total; i++) {
			var index = i * 4;
			if (this.textureScale > 0) {
				var dx = prev.x - points[i].x;
				var dy = prev.y - points[i].y;
				var distance = Math.sqrt(dx * dx + dy * dy);
				prev = points[i];
				amount += distance / textureWidth;
			} else amount = i / (total - 1);
			uvs[index] = amount;
			uvs[index + 1] = 0;
			uvs[index + 2] = amount;
			uvs[index + 3] = 1;
		}
		var indexCount = 0;
		for (var i = 0; i < total - 1; i++) {
			var index = i * 2;
			indices[indexCount++] = index;
			indices[indexCount++] = index + 1;
			indices[indexCount++] = index + 2;
			indices[indexCount++] = index + 2;
			indices[indexCount++] = index + 1;
			indices[indexCount++] = index + 3;
		}
		uvBuffer.update();
		indexBuffer.update();
		this.updateVertices();
	};
	/** refreshes vertices of Rope mesh */
	RopeGeometry.prototype.updateVertices = function() {
		var points = this.points;
		if (points.length < 1) return;
		var lastPoint = points[0];
		var nextPoint;
		var perpX = 0;
		var perpY = 0;
		var vertices = this.buffers[0].data;
		var total = points.length;
		for (var i = 0; i < total; i++) {
			var point = points[i];
			var index = i * 4;
			if (i < points.length - 1) nextPoint = points[i + 1];
			else nextPoint = point;
			perpY = -(nextPoint.x - lastPoint.x);
			perpX = nextPoint.y - lastPoint.y;
			var perpLength = Math.sqrt(perpX * perpX + perpY * perpY);
			var num = this.textureScale > 0 ? this.textureScale * this._width / 2 : this._width / 2;
			perpX /= perpLength;
			perpY /= perpLength;
			perpX *= num;
			perpY *= num;
			vertices[index] = point.x + perpX;
			vertices[index + 1] = point.y + perpY;
			vertices[index + 2] = point.x - perpX;
			vertices[index + 3] = point.y - perpY;
			lastPoint = point;
		}
		this.buffers[0].update();
	};
	RopeGeometry.prototype.update = function() {
		if (this.textureScale > 0) this.build();
		else this.updateVertices();
	};
	return RopeGeometry;
}(MeshGeometry);
/**
* The rope allows you to draw a texture across several points and then manipulate these points
*
*```js
* for (let i = 0; i < 20; i++) {
*     points.push(new PIXI.Point(i * 50, 0));
* };
* let rope = new PIXI.SimpleRope(PIXI.Texture.from("snake.png"), points);
*  ```
* @memberof PIXI
*/
var SimpleRope = function(_super) {
	__extends$1(SimpleRope, _super);
	/**
	* @param texture - The texture to use on the rope.
	* @param points - An array of {@link PIXI.Point} objects to construct this rope.
	* @param {number} textureScale - Optional. Positive values scale rope texture
	* keeping its aspect ratio. You can reduce alpha channel artifacts by providing a larger texture
	* and downsampling here. If set to zero, texture will be stretched instead.
	*/
	function SimpleRope(texture, points, textureScale) {
		if (textureScale === void 0) textureScale = 0;
		var _this = this;
		var ropeGeometry = new RopeGeometry(texture.height, points, textureScale);
		var meshMaterial = new MeshMaterial(texture);
		if (textureScale > 0) texture.baseTexture.wrapMode = WRAP_MODES.REPEAT;
		_this = _super.call(this, ropeGeometry, meshMaterial) || this;
		/**
		* re-calculate vertices by rope points each frame
		* @member {boolean}
		*/
		_this.autoUpdate = true;
		return _this;
	}
	SimpleRope.prototype._render = function(renderer) {
		var geometry = this.geometry;
		if (this.autoUpdate || geometry._width !== this.shader.texture.height) {
			geometry._width = this.shader.texture.height;
			geometry.update();
		}
		_super.prototype._render.call(this, renderer);
	};
	return SimpleRope;
}(Mesh);
/**
* The SimplePlane allows you to draw a texture across several points and then manipulate these points
*
*```js
* for (let i = 0; i < 20; i++) {
*     points.push(new PIXI.Point(i * 50, 0));
* };
* let SimplePlane = new PIXI.SimplePlane(PIXI.Texture.from("snake.png"), points);
*  ```
* @memberof PIXI
*/
var SimplePlane = function(_super) {
	__extends$1(SimplePlane, _super);
	/**
	* @param texture - The texture to use on the SimplePlane.
	* @param verticesX - The number of vertices in the x-axis
	* @param verticesY - The number of vertices in the y-axis
	*/
	function SimplePlane(texture, verticesX, verticesY) {
		var _this = this;
		var planeGeometry = new PlaneGeometry(texture.width, texture.height, verticesX, verticesY);
		var meshMaterial = new MeshMaterial(Texture.WHITE);
		_this = _super.call(this, planeGeometry, meshMaterial) || this;
		_this.texture = texture;
		_this.autoResize = true;
		return _this;
	}
	/**
	* Method used for overrides, to do something in case texture frame was changed.
	* Meshes based on plane can override it and change more details based on texture.
	*/
	SimplePlane.prototype.textureUpdated = function() {
		this._textureID = this.shader.texture._updateID;
		var geometry = this.geometry;
		var _a = this.shader.texture, width = _a.width, height = _a.height;
		if (this.autoResize && (geometry.width !== width || geometry.height !== height)) {
			geometry.width = this.shader.texture.width;
			geometry.height = this.shader.texture.height;
			geometry.build();
		}
	};
	Object.defineProperty(SimplePlane.prototype, "texture", {
		get: function() {
			return this.shader.texture;
		},
		set: function(value) {
			if (this.shader.texture === value) return;
			this.shader.texture = value;
			this._textureID = -1;
			if (value.baseTexture.valid) this.textureUpdated();
			else value.once("update", this.textureUpdated, this);
		},
		enumerable: false,
		configurable: true
	});
	SimplePlane.prototype._render = function(renderer) {
		if (this._textureID !== this.shader.texture._updateID) this.textureUpdated();
		_super.prototype._render.call(this, renderer);
	};
	SimplePlane.prototype.destroy = function(options) {
		this.shader.texture.off("update", this.textureUpdated, this);
		_super.prototype.destroy.call(this, options);
	};
	return SimplePlane;
}(Mesh);
/**
* The Simple Mesh class mimics Mesh in PixiJS v4, providing easy-to-use constructor arguments.
* For more robust customization, use {@link PIXI.Mesh}.
* @memberof PIXI
*/
var SimpleMesh = function(_super) {
	__extends$1(SimpleMesh, _super);
	/**
	* @param texture - The texture to use
	* @param {Float32Array} [vertices] - if you want to specify the vertices
	* @param {Float32Array} [uvs] - if you want to specify the uvs
	* @param {Uint16Array} [indices] - if you want to specify the indices
	* @param drawMode - the drawMode, can be any of the Mesh.DRAW_MODES consts
	*/
	function SimpleMesh(texture, vertices, uvs, indices, drawMode) {
		if (texture === void 0) texture = Texture.EMPTY;
		var _this = this;
		var geometry = new MeshGeometry(vertices, uvs, indices);
		geometry.getBuffer("aVertexPosition").static = false;
		var meshMaterial = new MeshMaterial(texture);
		_this = _super.call(this, geometry, meshMaterial, null, drawMode) || this;
		_this.autoUpdate = true;
		return _this;
	}
	Object.defineProperty(SimpleMesh.prototype, "vertices", {
		/**
		* Collection of vertices data.
		* @type {Float32Array}
		*/
		get: function() {
			return this.geometry.getBuffer("aVertexPosition").data;
		},
		set: function(value) {
			this.geometry.getBuffer("aVertexPosition").data = value;
		},
		enumerable: false,
		configurable: true
	});
	SimpleMesh.prototype._render = function(renderer) {
		if (this.autoUpdate) this.geometry.getBuffer("aVertexPosition").update();
		_super.prototype._render.call(this, renderer);
	};
	return SimpleMesh;
}(Mesh);
var DEFAULT_BORDER_SIZE = 10;
/**
* The NineSlicePlane allows you to stretch a texture using 9-slice scaling. The corners will remain unscaled (useful
* for buttons with rounded corners for example) and the other areas will be scaled horizontally and or vertically
*
*```js
* let Plane9 = new PIXI.NineSlicePlane(PIXI.Texture.from('BoxWithRoundedCorners.png'), 15, 15, 15, 15);
*  ```
* <pre>
*      A                          B
*    +---+----------------------+---+
*  C | 1 |          2           | 3 |
*    +---+----------------------+---+
*    |   |                      |   |
*    | 4 |          5           | 6 |
*    |   |                      |   |
*    +---+----------------------+---+
*  D | 7 |          8           | 9 |
*    +---+----------------------+---+
*  When changing this objects width and/or height:
*     areas 1 3 7 and 9 will remain unscaled.
*     areas 2 and 8 will be stretched horizontally
*     areas 4 and 6 will be stretched vertically
*     area 5 will be stretched both horizontally and vertically
* </pre>
* @memberof PIXI
*/
var NineSlicePlane = function(_super) {
	__extends$1(NineSlicePlane, _super);
	/**
	* @param texture - The texture to use on the NineSlicePlane.
	* @param {number} [leftWidth=10] - size of the left vertical bar (A)
	* @param {number} [topHeight=10] - size of the top horizontal bar (C)
	* @param {number} [rightWidth=10] - size of the right vertical bar (B)
	* @param {number} [bottomHeight=10] - size of the bottom horizontal bar (D)
	*/
	function NineSlicePlane(texture, leftWidth, topHeight, rightWidth, bottomHeight) {
		if (leftWidth === void 0) leftWidth = DEFAULT_BORDER_SIZE;
		if (topHeight === void 0) topHeight = DEFAULT_BORDER_SIZE;
		if (rightWidth === void 0) rightWidth = DEFAULT_BORDER_SIZE;
		if (bottomHeight === void 0) bottomHeight = DEFAULT_BORDER_SIZE;
		var _this = _super.call(this, Texture.WHITE, 4, 4) || this;
		_this._origWidth = texture.orig.width;
		_this._origHeight = texture.orig.height;
		/** The width of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane. */
		_this._width = _this._origWidth;
		/** The height of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane. */
		_this._height = _this._origHeight;
		_this._leftWidth = leftWidth;
		_this._rightWidth = rightWidth;
		_this._topHeight = topHeight;
		_this._bottomHeight = bottomHeight;
		_this.texture = texture;
		return _this;
	}
	NineSlicePlane.prototype.textureUpdated = function() {
		this._textureID = this.shader.texture._updateID;
		this._refresh();
	};
	Object.defineProperty(NineSlicePlane.prototype, "vertices", {
		get: function() {
			return this.geometry.getBuffer("aVertexPosition").data;
		},
		set: function(value) {
			this.geometry.getBuffer("aVertexPosition").data = value;
		},
		enumerable: false,
		configurable: true
	});
	/** Updates the horizontal vertices. */
	NineSlicePlane.prototype.updateHorizontalVertices = function() {
		var vertices = this.vertices;
		var scale = this._getMinScale();
		vertices[9] = vertices[11] = vertices[13] = vertices[15] = this._topHeight * scale;
		vertices[17] = vertices[19] = vertices[21] = vertices[23] = this._height - this._bottomHeight * scale;
		vertices[25] = vertices[27] = vertices[29] = vertices[31] = this._height;
	};
	/** Updates the vertical vertices. */
	NineSlicePlane.prototype.updateVerticalVertices = function() {
		var vertices = this.vertices;
		var scale = this._getMinScale();
		vertices[2] = vertices[10] = vertices[18] = vertices[26] = this._leftWidth * scale;
		vertices[4] = vertices[12] = vertices[20] = vertices[28] = this._width - this._rightWidth * scale;
		vertices[6] = vertices[14] = vertices[22] = vertices[30] = this._width;
	};
	/**
	* Returns the smaller of a set of vertical and horizontal scale of nine slice corners.
	* @returns Smaller number of vertical and horizontal scale.
	*/
	NineSlicePlane.prototype._getMinScale = function() {
		var w = this._leftWidth + this._rightWidth;
		var scaleW = this._width > w ? 1 : this._width / w;
		var h = this._topHeight + this._bottomHeight;
		var scaleH = this._height > h ? 1 : this._height / h;
		return Math.min(scaleW, scaleH);
	};
	Object.defineProperty(NineSlicePlane.prototype, "width", {
		/** The width of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane. */
		get: function() {
			return this._width;
		},
		set: function(value) {
			this._width = value;
			this._refresh();
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(NineSlicePlane.prototype, "height", {
		/** The height of the NineSlicePlane, setting this will actually modify the vertices and UV's of this plane. */
		get: function() {
			return this._height;
		},
		set: function(value) {
			this._height = value;
			this._refresh();
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(NineSlicePlane.prototype, "leftWidth", {
		/** The width of the left column. */
		get: function() {
			return this._leftWidth;
		},
		set: function(value) {
			this._leftWidth = value;
			this._refresh();
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(NineSlicePlane.prototype, "rightWidth", {
		/** The width of the right column. */
		get: function() {
			return this._rightWidth;
		},
		set: function(value) {
			this._rightWidth = value;
			this._refresh();
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(NineSlicePlane.prototype, "topHeight", {
		/** The height of the top row. */
		get: function() {
			return this._topHeight;
		},
		set: function(value) {
			this._topHeight = value;
			this._refresh();
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(NineSlicePlane.prototype, "bottomHeight", {
		/** The height of the bottom row. */
		get: function() {
			return this._bottomHeight;
		},
		set: function(value) {
			this._bottomHeight = value;
			this._refresh();
		},
		enumerable: false,
		configurable: true
	});
	/** Refreshes NineSlicePlane coords. All of them. */
	NineSlicePlane.prototype._refresh = function() {
		var texture = this.texture;
		var uvs = this.geometry.buffers[1].data;
		this._origWidth = texture.orig.width;
		this._origHeight = texture.orig.height;
		var _uvw = 1 / this._origWidth;
		var _uvh = 1 / this._origHeight;
		uvs[0] = uvs[8] = uvs[16] = uvs[24] = 0;
		uvs[1] = uvs[3] = uvs[5] = uvs[7] = 0;
		uvs[6] = uvs[14] = uvs[22] = uvs[30] = 1;
		uvs[25] = uvs[27] = uvs[29] = uvs[31] = 1;
		uvs[2] = uvs[10] = uvs[18] = uvs[26] = _uvw * this._leftWidth;
		uvs[4] = uvs[12] = uvs[20] = uvs[28] = 1 - _uvw * this._rightWidth;
		uvs[9] = uvs[11] = uvs[13] = uvs[15] = _uvh * this._topHeight;
		uvs[17] = uvs[19] = uvs[21] = uvs[23] = 1 - _uvh * this._bottomHeight;
		this.updateHorizontalVertices();
		this.updateVerticalVertices();
		this.geometry.buffers[0].update();
		this.geometry.buffers[1].update();
	};
	return NineSlicePlane;
}(SimplePlane);
//#endregion
//#region node_modules/@pixi/sprite-animated/dist/esm/sprite-animated.mjs
/*!
* @pixi/sprite-animated - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/sprite-animated is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var extendStatics = function(d, b) {
	extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d, b) {
		d.__proto__ = b;
	} || function(d, b) {
		for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	};
	return extendStatics(d, b);
};
function __extends(d, b) {
	extendStatics(d, b);
	function __() {
		this.constructor = d;
	}
	d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
/**
* An AnimatedSprite is a simple way to display an animation depicted by a list of textures.
*
* ```js
* let alienImages = ["image_sequence_01.png","image_sequence_02.png","image_sequence_03.png","image_sequence_04.png"];
* let textureArray = [];
*
* for (let i=0; i < 4; i++)
* {
*      let texture = PIXI.Texture.from(alienImages[i]);
*      textureArray.push(texture);
* };
*
* let animatedSprite = new PIXI.AnimatedSprite(textureArray);
* ```
*
* The more efficient and simpler way to create an animated sprite is using a {@link PIXI.Spritesheet}
* containing the animation definitions:
*
* ```js
* PIXI.Loader.shared.add("assets/spritesheet.json").load(setup);
*
* function setup() {
*   let sheet = PIXI.Loader.shared.resources["assets/spritesheet.json"].spritesheet;
*   animatedSprite = new PIXI.AnimatedSprite(sheet.animations["image_sequence"]);
*   ...
* }
* ```
* @memberof PIXI
*/
var AnimatedSprite = function(_super) {
	__extends(AnimatedSprite, _super);
	/**
	* @param textures - An array of {@link PIXI.Texture} or frame
	*  objects that make up the animation.
	* @param {boolean} [autoUpdate=true] - Whether to use PIXI.Ticker.shared to auto update animation time.
	*/
	function AnimatedSprite(textures, autoUpdate) {
		if (autoUpdate === void 0) autoUpdate = true;
		var _this = _super.call(this, textures[0] instanceof Texture ? textures[0] : textures[0].texture) || this;
		_this._textures = null;
		_this._durations = null;
		_this._autoUpdate = autoUpdate;
		_this._isConnectedToTicker = false;
		_this.animationSpeed = 1;
		_this.loop = true;
		_this.updateAnchor = false;
		_this.onComplete = null;
		_this.onFrameChange = null;
		_this.onLoop = null;
		_this._currentTime = 0;
		_this._playing = false;
		_this._previousFrame = null;
		_this.textures = textures;
		return _this;
	}
	/** Stops the AnimatedSprite. */
	AnimatedSprite.prototype.stop = function() {
		if (!this._playing) return;
		this._playing = false;
		if (this._autoUpdate && this._isConnectedToTicker) {
			Ticker.shared.remove(this.update, this);
			this._isConnectedToTicker = false;
		}
	};
	/** Plays the AnimatedSprite. */
	AnimatedSprite.prototype.play = function() {
		if (this._playing) return;
		this._playing = true;
		if (this._autoUpdate && !this._isConnectedToTicker) {
			Ticker.shared.add(this.update, this, UPDATE_PRIORITY.HIGH);
			this._isConnectedToTicker = true;
		}
	};
	/**
	* Stops the AnimatedSprite and goes to a specific frame.
	* @param frameNumber - Frame index to stop at.
	*/
	AnimatedSprite.prototype.gotoAndStop = function(frameNumber) {
		this.stop();
		var previousFrame = this.currentFrame;
		this._currentTime = frameNumber;
		if (previousFrame !== this.currentFrame) this.updateTexture();
	};
	/**
	* Goes to a specific frame and begins playing the AnimatedSprite.
	* @param frameNumber - Frame index to start at.
	*/
	AnimatedSprite.prototype.gotoAndPlay = function(frameNumber) {
		var previousFrame = this.currentFrame;
		this._currentTime = frameNumber;
		if (previousFrame !== this.currentFrame) this.updateTexture();
		this.play();
	};
	/**
	* Updates the object transform for rendering.
	* @param deltaTime - Time since last tick.
	*/
	AnimatedSprite.prototype.update = function(deltaTime) {
		if (!this._playing) return;
		var elapsed = this.animationSpeed * deltaTime;
		var previousFrame = this.currentFrame;
		if (this._durations !== null) {
			var lag = this._currentTime % 1 * this._durations[this.currentFrame];
			lag += elapsed / 60 * 1e3;
			while (lag < 0) {
				this._currentTime--;
				lag += this._durations[this.currentFrame];
			}
			var sign = Math.sign(this.animationSpeed * deltaTime);
			this._currentTime = Math.floor(this._currentTime);
			while (lag >= this._durations[this.currentFrame]) {
				lag -= this._durations[this.currentFrame] * sign;
				this._currentTime += sign;
			}
			this._currentTime += lag / this._durations[this.currentFrame];
		} else this._currentTime += elapsed;
		if (this._currentTime < 0 && !this.loop) {
			this.gotoAndStop(0);
			if (this.onComplete) this.onComplete();
		} else if (this._currentTime >= this._textures.length && !this.loop) {
			this.gotoAndStop(this._textures.length - 1);
			if (this.onComplete) this.onComplete();
		} else if (previousFrame !== this.currentFrame) {
			if (this.loop && this.onLoop) {
				if (this.animationSpeed > 0 && this.currentFrame < previousFrame) this.onLoop();
				else if (this.animationSpeed < 0 && this.currentFrame > previousFrame) this.onLoop();
			}
			this.updateTexture();
		}
	};
	/** Updates the displayed texture to match the current frame index. */
	AnimatedSprite.prototype.updateTexture = function() {
		var currentFrame = this.currentFrame;
		if (this._previousFrame === currentFrame) return;
		this._previousFrame = currentFrame;
		this._texture = this._textures[currentFrame];
		this._textureID = -1;
		this._textureTrimmedID = -1;
		this._cachedTint = 16777215;
		this.uvs = this._texture._uvs.uvsFloat32;
		if (this.updateAnchor) this._anchor.copyFrom(this._texture.defaultAnchor);
		if (this.onFrameChange) this.onFrameChange(this.currentFrame);
	};
	/**
	* Stops the AnimatedSprite and destroys it.
	* @param {object|boolean} [options] - Options parameter. A boolean will act as if all options
	*  have been set to that value.
	* @param {boolean} [options.children=false] - If set to true, all the children will have their destroy
	*      method called as well. 'options' will be passed on to those calls.
	* @param {boolean} [options.texture=false] - Should it destroy the current texture of the sprite as well.
	* @param {boolean} [options.baseTexture=false] - Should it destroy the base texture of the sprite as well.
	*/
	AnimatedSprite.prototype.destroy = function(options) {
		this.stop();
		_super.prototype.destroy.call(this, options);
		this.onComplete = null;
		this.onFrameChange = null;
		this.onLoop = null;
	};
	/**
	* A short hand way of creating an AnimatedSprite from an array of frame ids.
	* @param frames - The array of frames ids the AnimatedSprite will use as its texture frames.
	* @returns - The new animated sprite with the specified frames.
	*/
	AnimatedSprite.fromFrames = function(frames) {
		var textures = [];
		for (var i = 0; i < frames.length; ++i) textures.push(Texture.from(frames[i]));
		return new AnimatedSprite(textures);
	};
	/**
	* A short hand way of creating an AnimatedSprite from an array of image ids.
	* @param images - The array of image urls the AnimatedSprite will use as its texture frames.
	* @returns The new animate sprite with the specified images as frames.
	*/
	AnimatedSprite.fromImages = function(images) {
		var textures = [];
		for (var i = 0; i < images.length; ++i) textures.push(Texture.from(images[i]));
		return new AnimatedSprite(textures);
	};
	Object.defineProperty(AnimatedSprite.prototype, "totalFrames", {
		/**
		* The total number of frames in the AnimatedSprite. This is the same as number of textures
		* assigned to the AnimatedSprite.
		* @readonly
		* @default 0
		*/
		get: function() {
			return this._textures.length;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(AnimatedSprite.prototype, "textures", {
		/** The array of textures used for this AnimatedSprite. */
		get: function() {
			return this._textures;
		},
		set: function(value) {
			if (value[0] instanceof Texture) {
				this._textures = value;
				this._durations = null;
			} else {
				this._textures = [];
				this._durations = [];
				for (var i = 0; i < value.length; i++) {
					this._textures.push(value[i].texture);
					this._durations.push(value[i].time);
				}
			}
			this._previousFrame = null;
			this.gotoAndStop(0);
			this.updateTexture();
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(AnimatedSprite.prototype, "currentFrame", {
		/**
		* The AnimatedSprites current frame index.
		* @readonly
		*/
		get: function() {
			var currentFrame = Math.floor(this._currentTime) % this._textures.length;
			if (currentFrame < 0) currentFrame += this._textures.length;
			return currentFrame;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(AnimatedSprite.prototype, "playing", {
		/**
		* Indicates if the AnimatedSprite is currently playing.
		* @readonly
		*/
		get: function() {
			return this._playing;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(AnimatedSprite.prototype, "autoUpdate", {
		/** Whether to use PIXI.Ticker.shared to auto update animation time. */
		get: function() {
			return this._autoUpdate;
		},
		set: function(value) {
			if (value !== this._autoUpdate) {
				this._autoUpdate = value;
				if (!this._autoUpdate && this._isConnectedToTicker) {
					Ticker.shared.remove(this.update, this);
					this._isConnectedToTicker = false;
				} else if (this._autoUpdate && !this._isConnectedToTicker && this._playing) {
					Ticker.shared.add(this.update, this);
					this._isConnectedToTicker = true;
				}
			}
		},
		enumerable: false,
		configurable: true
	});
	return AnimatedSprite;
}(Sprite);
//#endregion
//#region node_modules/pixi.js/dist/esm/pixi.mjs
/*!
* pixi.js - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* pixi.js is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
extensions.add(AccessibilityManager, Extract, InteractionManager, ParticleRenderer, Prepare, BatchRenderer, TilingSpriteRenderer, BitmapFontLoader, CompressedTextureLoader, DDSLoader, KTXLoader, SpritesheetLoader, TickerPlugin, AppLoaderPlugin);
/**
* This namespace contains WebGL-only display filters that can be applied
* to DisplayObjects using the {@link PIXI.DisplayObject#filters filters} property.
*
* Since PixiJS only had a handful of built-in filters, additional filters
* can be downloaded {@link https://github.com/pixijs/pixi-filters here} from the
* PixiJS Filters repository.
*
* All filters must extend {@link PIXI.Filter}.
* @example
* // Create a new application
* const app = new PIXI.Application();
*
* // Draw a green rectangle
* const rect = new PIXI.Graphics()
*     .beginFill(0x00ff00)
*     .drawRect(40, 40, 200, 200);
*
* // Add a blur filter
* rect.filters = [new PIXI.filters.BlurFilter()];
*
* // Display rectangle
* app.stage.addChild(rect);
* document.body.appendChild(app.view);
* @namespace PIXI.filters
*/
var filters = {
	AlphaFilter,
	BlurFilter,
	BlurFilterPass,
	ColorMatrixFilter,
	DisplacementFilter,
	FXAAFilter,
	NoiseFilter
};
//#endregion
export { ALPHA_MODES, AbstractBatchRenderer, AbstractMultiResource, AbstractRenderer, AccessibilityManager, AnimatedSprite, AppLoaderPlugin, Application, ArrayResource, Attribute, BLEND_MODES, BUFFER_BITS, BUFFER_TYPE, BaseImageResource, BasePrepare, BaseRenderTexture, BaseTexture, BatchDrawCall, BatchGeometry, BatchPluginFactory, BatchRenderer, BatchShaderGenerator, BatchSystem, BatchTextureArray, BitmapFont, BitmapFontData, BitmapFontLoader, BitmapText, BlobResource, Bounds, BrowserAdapter, Buffer, BufferResource, CLEAR_MODES, COLOR_MASK_BITS, CanvasResource, Circle, CompressedTextureLoader, CompressedTextureResource, Container, ContextSystem, CountLimiter, CubeResource, DDSLoader, DEG_TO_RAD, DRAW_MODES, DisplayObject, ENV, Ellipse, ExtensionType, Extract, FORMATS, FORMATS_TO_COMPONENTS, FillStyle, Filter, FilterState, FilterSystem, Framebuffer, FramebufferSystem, GC_MODES, GLFramebuffer, GLProgram, GLTexture, GRAPHICS_CURVES, Geometry, GeometrySystem, Graphics, GraphicsData, GraphicsGeometry, IGLUniformData, INSTALLED, INTERNAL_FORMATS, INTERNAL_FORMAT_TO_BYTES_PER_PIXEL, ImageBitmapResource, ImageResource, InteractionData, InteractionEvent, InteractionManager, InteractionTrackingData, KTXLoader, LINE_CAP, LINE_JOIN, LineStyle, Loader, LoaderResource, MASK_TYPES, MIPMAP_MODES, MSAA_QUALITY, MaskData, MaskSystem, Matrix, Mesh, MeshBatchUvs, MeshGeometry, MeshMaterial, NineSlicePlane, ObjectRenderer, ObservablePoint, PI_2, PRECISION, ParticleContainer, ParticleRenderer, PlaneGeometry, Point, Polygon, Prepare, Program, ProjectionSystem, Quad, QuadUv, RAD_TO_DEG, RENDERER_TYPE, Rectangle, RenderTexture, RenderTexturePool, RenderTextureSystem, Renderer, ResizePlugin, Resource, RopeGeometry, RoundedRectangle, Runner, SAMPLER_TYPES, SCALE_MODES, SHAPES, SVGResource, ScissorSystem, Shader, ShaderSystem, SimpleMesh, SimplePlane, SimpleRope, Sprite, SpriteMaskFilter, Spritesheet, SpritesheetLoader, State, StateSystem, StencilSystem, System, TARGETS, TEXT_GRADIENT, TYPES, TYPES_TO_BYTES_PER_COMPONENT, TYPES_TO_BYTES_PER_PIXEL, TemporaryDisplayObject, Text, TextFormat, TextMetrics, TextStyle, Texture, TextureGCSystem, TextureLoader, TextureMatrix, TextureSystem, TextureUvs, Ticker, TickerPlugin, TilingSprite, TilingSpriteRenderer, TimeLimiter, Transform, UPDATE_PRIORITY, UniformGroup, VERSION, VideoResource, ViewableBuffer, WRAP_MODES, XMLFormat, XMLStringFormat, accessibleTarget, autoDetectFormat, autoDetectRenderer, autoDetectResource, checkMaxIfStatementsInShader, createUBOElements, defaultFilterVertex, defaultVertex$1 as defaultVertex, extensions, filters, generateProgram, generateUniformBufferSync, getTestContext, getUBOData, graphicsUtils, groupD8, interactiveTarget, isMobile, parseDDS, parseKTX, resources, settings, systems, uniformParsers, utils_exports as utils };
