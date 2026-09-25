import { i as __toESM, n as __exportAll, t as __commonJSMin } from "./rolldown-runtime-B-lAHAz2.js";
//#region node_modules/@pixi/constants/dist/esm/constants.mjs
/*!
* @pixi/constants - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/constants is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/**
* Different types of environments for WebGL.
* @static
* @memberof PIXI
* @name ENV
* @enum {number}
* @property {number} WEBGL_LEGACY - Used for older v1 WebGL devices. PixiJS will aim to ensure compatibility
*  with older / less advanced devices. If you experience unexplained flickering prefer this environment.
* @property {number} WEBGL - Version 1 of WebGL
* @property {number} WEBGL2 - Version 2 of WebGL
*/
var ENV;
(function(ENV) {
	ENV[ENV["WEBGL_LEGACY"] = 0] = "WEBGL_LEGACY";
	ENV[ENV["WEBGL"] = 1] = "WEBGL";
	ENV[ENV["WEBGL2"] = 2] = "WEBGL2";
})(ENV || (ENV = {}));
/**
* Constant to identify the Renderer Type.
* @static
* @memberof PIXI
* @name RENDERER_TYPE
* @enum {number}
* @property {number} UNKNOWN - Unknown render type.
* @property {number} WEBGL - WebGL render type.
* @property {number} CANVAS - Canvas render type.
*/
var RENDERER_TYPE;
(function(RENDERER_TYPE) {
	RENDERER_TYPE[RENDERER_TYPE["UNKNOWN"] = 0] = "UNKNOWN";
	RENDERER_TYPE[RENDERER_TYPE["WEBGL"] = 1] = "WEBGL";
	RENDERER_TYPE[RENDERER_TYPE["CANVAS"] = 2] = "CANVAS";
})(RENDERER_TYPE || (RENDERER_TYPE = {}));
/**
* Bitwise OR of masks that indicate the buffers to be cleared.
* @static
* @memberof PIXI
* @name BUFFER_BITS
* @enum {number}
* @property {number} COLOR - Indicates the buffers currently enabled for color writing.
* @property {number} DEPTH - Indicates the depth buffer.
* @property {number} STENCIL - Indicates the stencil buffer.
*/
var BUFFER_BITS;
(function(BUFFER_BITS) {
	BUFFER_BITS[BUFFER_BITS["COLOR"] = 16384] = "COLOR";
	BUFFER_BITS[BUFFER_BITS["DEPTH"] = 256] = "DEPTH";
	BUFFER_BITS[BUFFER_BITS["STENCIL"] = 1024] = "STENCIL";
})(BUFFER_BITS || (BUFFER_BITS = {}));
/**
* Various blend modes supported by PIXI.
*
* IMPORTANT - The WebGL renderer only supports the NORMAL, ADD, MULTIPLY and SCREEN blend modes.
* Anything else will silently act like NORMAL.
* @memberof PIXI
* @name BLEND_MODES
* @enum {number}
* @property {number} NORMAL -
* @property {number} ADD -
* @property {number} MULTIPLY -
* @property {number} SCREEN -
* @property {number} OVERLAY -
* @property {number} DARKEN -
* @property {number} LIGHTEN -
* @property {number} COLOR_DODGE -
* @property {number} COLOR_BURN -
* @property {number} HARD_LIGHT -
* @property {number} SOFT_LIGHT -
* @property {number} DIFFERENCE -
* @property {number} EXCLUSION -
* @property {number} HUE -
* @property {number} SATURATION -
* @property {number} COLOR -
* @property {number} LUMINOSITY -
* @property {number} NORMAL_NPM -
* @property {number} ADD_NPM -
* @property {number} SCREEN_NPM -
* @property {number} NONE -
* @property {number} SRC_IN -
* @property {number} SRC_OUT -
* @property {number} SRC_ATOP -
* @property {number} DST_OVER -
* @property {number} DST_IN -
* @property {number} DST_OUT -
* @property {number} DST_ATOP -
* @property {number} SUBTRACT -
* @property {number} SRC_OVER -
* @property {number} ERASE -
* @property {number} XOR -
*/
var BLEND_MODES;
(function(BLEND_MODES) {
	BLEND_MODES[BLEND_MODES["NORMAL"] = 0] = "NORMAL";
	BLEND_MODES[BLEND_MODES["ADD"] = 1] = "ADD";
	BLEND_MODES[BLEND_MODES["MULTIPLY"] = 2] = "MULTIPLY";
	BLEND_MODES[BLEND_MODES["SCREEN"] = 3] = "SCREEN";
	BLEND_MODES[BLEND_MODES["OVERLAY"] = 4] = "OVERLAY";
	BLEND_MODES[BLEND_MODES["DARKEN"] = 5] = "DARKEN";
	BLEND_MODES[BLEND_MODES["LIGHTEN"] = 6] = "LIGHTEN";
	BLEND_MODES[BLEND_MODES["COLOR_DODGE"] = 7] = "COLOR_DODGE";
	BLEND_MODES[BLEND_MODES["COLOR_BURN"] = 8] = "COLOR_BURN";
	BLEND_MODES[BLEND_MODES["HARD_LIGHT"] = 9] = "HARD_LIGHT";
	BLEND_MODES[BLEND_MODES["SOFT_LIGHT"] = 10] = "SOFT_LIGHT";
	BLEND_MODES[BLEND_MODES["DIFFERENCE"] = 11] = "DIFFERENCE";
	BLEND_MODES[BLEND_MODES["EXCLUSION"] = 12] = "EXCLUSION";
	BLEND_MODES[BLEND_MODES["HUE"] = 13] = "HUE";
	BLEND_MODES[BLEND_MODES["SATURATION"] = 14] = "SATURATION";
	BLEND_MODES[BLEND_MODES["COLOR"] = 15] = "COLOR";
	BLEND_MODES[BLEND_MODES["LUMINOSITY"] = 16] = "LUMINOSITY";
	BLEND_MODES[BLEND_MODES["NORMAL_NPM"] = 17] = "NORMAL_NPM";
	BLEND_MODES[BLEND_MODES["ADD_NPM"] = 18] = "ADD_NPM";
	BLEND_MODES[BLEND_MODES["SCREEN_NPM"] = 19] = "SCREEN_NPM";
	BLEND_MODES[BLEND_MODES["NONE"] = 20] = "NONE";
	BLEND_MODES[BLEND_MODES["SRC_OVER"] = 0] = "SRC_OVER";
	BLEND_MODES[BLEND_MODES["SRC_IN"] = 21] = "SRC_IN";
	BLEND_MODES[BLEND_MODES["SRC_OUT"] = 22] = "SRC_OUT";
	BLEND_MODES[BLEND_MODES["SRC_ATOP"] = 23] = "SRC_ATOP";
	BLEND_MODES[BLEND_MODES["DST_OVER"] = 24] = "DST_OVER";
	BLEND_MODES[BLEND_MODES["DST_IN"] = 25] = "DST_IN";
	BLEND_MODES[BLEND_MODES["DST_OUT"] = 26] = "DST_OUT";
	BLEND_MODES[BLEND_MODES["DST_ATOP"] = 27] = "DST_ATOP";
	BLEND_MODES[BLEND_MODES["ERASE"] = 26] = "ERASE";
	BLEND_MODES[BLEND_MODES["SUBTRACT"] = 28] = "SUBTRACT";
	BLEND_MODES[BLEND_MODES["XOR"] = 29] = "XOR";
})(BLEND_MODES || (BLEND_MODES = {}));
/**
* Various webgl draw modes. These can be used to specify which GL drawMode to use
* under certain situations and renderers.
* @memberof PIXI
* @static
* @name DRAW_MODES
* @enum {number}
* @property {number} POINTS -
* @property {number} LINES -
* @property {number} LINE_LOOP -
* @property {number} LINE_STRIP -
* @property {number} TRIANGLES -
* @property {number} TRIANGLE_STRIP -
* @property {number} TRIANGLE_FAN -
*/
var DRAW_MODES;
(function(DRAW_MODES) {
	DRAW_MODES[DRAW_MODES["POINTS"] = 0] = "POINTS";
	DRAW_MODES[DRAW_MODES["LINES"] = 1] = "LINES";
	DRAW_MODES[DRAW_MODES["LINE_LOOP"] = 2] = "LINE_LOOP";
	DRAW_MODES[DRAW_MODES["LINE_STRIP"] = 3] = "LINE_STRIP";
	DRAW_MODES[DRAW_MODES["TRIANGLES"] = 4] = "TRIANGLES";
	DRAW_MODES[DRAW_MODES["TRIANGLE_STRIP"] = 5] = "TRIANGLE_STRIP";
	DRAW_MODES[DRAW_MODES["TRIANGLE_FAN"] = 6] = "TRIANGLE_FAN";
})(DRAW_MODES || (DRAW_MODES = {}));
/**
* Various GL texture/resources formats.
* @memberof PIXI
* @static
* @name FORMATS
* @enum {number}
* @property {number} [RGBA=6408] -
* @property {number} [RGB=6407] -
* @property {number} [RG=33319] -
* @property {number} [RED=6403] -
* @property {number} [RGBA_INTEGER=36249] -
* @property {number} [RGB_INTEGER=36248] -
* @property {number} [RG_INTEGER=33320] -
* @property {number} [RED_INTEGER=36244] -
* @property {number} [ALPHA=6406] -
* @property {number} [LUMINANCE=6409] -
* @property {number} [LUMINANCE_ALPHA=6410] -
* @property {number} [DEPTH_COMPONENT=6402] -
* @property {number} [DEPTH_STENCIL=34041] -
*/
var FORMATS;
(function(FORMATS) {
	FORMATS[FORMATS["RGBA"] = 6408] = "RGBA";
	FORMATS[FORMATS["RGB"] = 6407] = "RGB";
	FORMATS[FORMATS["RG"] = 33319] = "RG";
	FORMATS[FORMATS["RED"] = 6403] = "RED";
	FORMATS[FORMATS["RGBA_INTEGER"] = 36249] = "RGBA_INTEGER";
	FORMATS[FORMATS["RGB_INTEGER"] = 36248] = "RGB_INTEGER";
	FORMATS[FORMATS["RG_INTEGER"] = 33320] = "RG_INTEGER";
	FORMATS[FORMATS["RED_INTEGER"] = 36244] = "RED_INTEGER";
	FORMATS[FORMATS["ALPHA"] = 6406] = "ALPHA";
	FORMATS[FORMATS["LUMINANCE"] = 6409] = "LUMINANCE";
	FORMATS[FORMATS["LUMINANCE_ALPHA"] = 6410] = "LUMINANCE_ALPHA";
	FORMATS[FORMATS["DEPTH_COMPONENT"] = 6402] = "DEPTH_COMPONENT";
	FORMATS[FORMATS["DEPTH_STENCIL"] = 34041] = "DEPTH_STENCIL";
})(FORMATS || (FORMATS = {}));
/**
* Various GL target types.
* @memberof PIXI
* @static
* @name TARGETS
* @enum {number}
* @property {number} [TEXTURE_2D=3553] -
* @property {number} [TEXTURE_CUBE_MAP=34067] -
* @property {number} [TEXTURE_2D_ARRAY=35866] -
* @property {number} [TEXTURE_CUBE_MAP_POSITIVE_X=34069] -
* @property {number} [TEXTURE_CUBE_MAP_NEGATIVE_X=34070] -
* @property {number} [TEXTURE_CUBE_MAP_POSITIVE_Y=34071] -
* @property {number} [TEXTURE_CUBE_MAP_NEGATIVE_Y=34072] -
* @property {number} [TEXTURE_CUBE_MAP_POSITIVE_Z=34073] -
* @property {number} [TEXTURE_CUBE_MAP_NEGATIVE_Z=34074] -
*/
var TARGETS;
(function(TARGETS) {
	TARGETS[TARGETS["TEXTURE_2D"] = 3553] = "TEXTURE_2D";
	TARGETS[TARGETS["TEXTURE_CUBE_MAP"] = 34067] = "TEXTURE_CUBE_MAP";
	TARGETS[TARGETS["TEXTURE_2D_ARRAY"] = 35866] = "TEXTURE_2D_ARRAY";
	TARGETS[TARGETS["TEXTURE_CUBE_MAP_POSITIVE_X"] = 34069] = "TEXTURE_CUBE_MAP_POSITIVE_X";
	TARGETS[TARGETS["TEXTURE_CUBE_MAP_NEGATIVE_X"] = 34070] = "TEXTURE_CUBE_MAP_NEGATIVE_X";
	TARGETS[TARGETS["TEXTURE_CUBE_MAP_POSITIVE_Y"] = 34071] = "TEXTURE_CUBE_MAP_POSITIVE_Y";
	TARGETS[TARGETS["TEXTURE_CUBE_MAP_NEGATIVE_Y"] = 34072] = "TEXTURE_CUBE_MAP_NEGATIVE_Y";
	TARGETS[TARGETS["TEXTURE_CUBE_MAP_POSITIVE_Z"] = 34073] = "TEXTURE_CUBE_MAP_POSITIVE_Z";
	TARGETS[TARGETS["TEXTURE_CUBE_MAP_NEGATIVE_Z"] = 34074] = "TEXTURE_CUBE_MAP_NEGATIVE_Z";
})(TARGETS || (TARGETS = {}));
/**
* Various GL data format types.
* @memberof PIXI
* @static
* @name TYPES
* @enum {number}
* @property {number} [UNSIGNED_BYTE=5121] -
* @property {number} [UNSIGNED_SHORT=5123] -
* @property {number} [UNSIGNED_SHORT_5_6_5=33635] -
* @property {number} [UNSIGNED_SHORT_4_4_4_4=32819] -
* @property {number} [UNSIGNED_SHORT_5_5_5_1=32820] -
* @property {number} [UNSIGNED_INT=5125] -
* @property {number} [UNSIGNED_INT_10F_11F_11F_REV=35899] -
* @property {number} [UNSIGNED_INT_2_10_10_10_REV=33640] -
* @property {number} [UNSIGNED_INT_24_8=34042] -
* @property {number} [UNSIGNED_INT_5_9_9_9_REV=35902] -
* @property {number} [BYTE=5120] -
* @property {number} [SHORT=5122] -
* @property {number} [INT=5124] -
* @property {number} [FLOAT=5126] -
* @property {number} [FLOAT_32_UNSIGNED_INT_24_8_REV=36269] -
* @property {number} [HALF_FLOAT=36193] -
*/
var TYPES;
(function(TYPES) {
	TYPES[TYPES["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
	TYPES[TYPES["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
	TYPES[TYPES["UNSIGNED_SHORT_5_6_5"] = 33635] = "UNSIGNED_SHORT_5_6_5";
	TYPES[TYPES["UNSIGNED_SHORT_4_4_4_4"] = 32819] = "UNSIGNED_SHORT_4_4_4_4";
	TYPES[TYPES["UNSIGNED_SHORT_5_5_5_1"] = 32820] = "UNSIGNED_SHORT_5_5_5_1";
	TYPES[TYPES["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
	TYPES[TYPES["UNSIGNED_INT_10F_11F_11F_REV"] = 35899] = "UNSIGNED_INT_10F_11F_11F_REV";
	TYPES[TYPES["UNSIGNED_INT_2_10_10_10_REV"] = 33640] = "UNSIGNED_INT_2_10_10_10_REV";
	TYPES[TYPES["UNSIGNED_INT_24_8"] = 34042] = "UNSIGNED_INT_24_8";
	TYPES[TYPES["UNSIGNED_INT_5_9_9_9_REV"] = 35902] = "UNSIGNED_INT_5_9_9_9_REV";
	TYPES[TYPES["BYTE"] = 5120] = "BYTE";
	TYPES[TYPES["SHORT"] = 5122] = "SHORT";
	TYPES[TYPES["INT"] = 5124] = "INT";
	TYPES[TYPES["FLOAT"] = 5126] = "FLOAT";
	TYPES[TYPES["FLOAT_32_UNSIGNED_INT_24_8_REV"] = 36269] = "FLOAT_32_UNSIGNED_INT_24_8_REV";
	TYPES[TYPES["HALF_FLOAT"] = 36193] = "HALF_FLOAT";
})(TYPES || (TYPES = {}));
/**
* Various sampler types. Correspond to `sampler`, `isampler`, `usampler` GLSL types respectively.
* WebGL1 works only with FLOAT.
* @memberof PIXI
* @static
* @name SAMPLER_TYPES
* @enum {number}
* @property {number} [FLOAT=0] -
* @property {number} [INT=1] -
* @property {number} [UINT=2] -
*/
var SAMPLER_TYPES;
(function(SAMPLER_TYPES) {
	SAMPLER_TYPES[SAMPLER_TYPES["FLOAT"] = 0] = "FLOAT";
	SAMPLER_TYPES[SAMPLER_TYPES["INT"] = 1] = "INT";
	SAMPLER_TYPES[SAMPLER_TYPES["UINT"] = 2] = "UINT";
})(SAMPLER_TYPES || (SAMPLER_TYPES = {}));
/**
* The scale modes that are supported by pixi.
*
* The {@link PIXI.settings.SCALE_MODE} scale mode affects the default scaling mode of future operations.
* It can be re-assigned to either LINEAR or NEAREST, depending upon suitability.
* @memberof PIXI
* @static
* @name SCALE_MODES
* @enum {number}
* @property {number} LINEAR Smooth scaling
* @property {number} NEAREST Pixelating scaling
*/
var SCALE_MODES;
(function(SCALE_MODES) {
	SCALE_MODES[SCALE_MODES["NEAREST"] = 0] = "NEAREST";
	SCALE_MODES[SCALE_MODES["LINEAR"] = 1] = "LINEAR";
})(SCALE_MODES || (SCALE_MODES = {}));
/**
* The wrap modes that are supported by pixi.
*
* The {@link PIXI.settings.WRAP_MODE} wrap mode affects the default wrapping mode of future operations.
* It can be re-assigned to either CLAMP or REPEAT, depending upon suitability.
* If the texture is non power of two then clamp will be used regardless as WebGL can
* only use REPEAT if the texture is po2.
*
* This property only affects WebGL.
* @name WRAP_MODES
* @memberof PIXI
* @static
* @enum {number}
* @property {number} CLAMP - The textures uvs are clamped
* @property {number} REPEAT - The texture uvs tile and repeat
* @property {number} MIRRORED_REPEAT - The texture uvs tile and repeat with mirroring
*/
var WRAP_MODES;
(function(WRAP_MODES) {
	WRAP_MODES[WRAP_MODES["CLAMP"] = 33071] = "CLAMP";
	WRAP_MODES[WRAP_MODES["REPEAT"] = 10497] = "REPEAT";
	WRAP_MODES[WRAP_MODES["MIRRORED_REPEAT"] = 33648] = "MIRRORED_REPEAT";
})(WRAP_MODES || (WRAP_MODES = {}));
/**
* Mipmap filtering modes that are supported by pixi.
*
* The {@link PIXI.settings.MIPMAP_TEXTURES} affects default texture filtering.
* Mipmaps are generated for a baseTexture if its `mipmap` field is `ON`,
* or its `POW2` and texture dimensions are powers of 2.
* Due to platform restriction, `ON` option will work like `POW2` for webgl-1.
*
* This property only affects WebGL.
* @name MIPMAP_MODES
* @memberof PIXI
* @static
* @enum {number}
* @property {number} OFF - No mipmaps
* @property {number} POW2 - Generate mipmaps if texture dimensions are pow2
* @property {number} ON - Always generate mipmaps
* @property {number} ON_MANUAL - Use mipmaps, but do not auto-generate them; this is used with a resource
*   that supports buffering each level-of-detail.
*/
var MIPMAP_MODES;
(function(MIPMAP_MODES) {
	MIPMAP_MODES[MIPMAP_MODES["OFF"] = 0] = "OFF";
	MIPMAP_MODES[MIPMAP_MODES["POW2"] = 1] = "POW2";
	MIPMAP_MODES[MIPMAP_MODES["ON"] = 2] = "ON";
	MIPMAP_MODES[MIPMAP_MODES["ON_MANUAL"] = 3] = "ON_MANUAL";
})(MIPMAP_MODES || (MIPMAP_MODES = {}));
/**
* How to treat textures with premultiplied alpha
* @name ALPHA_MODES
* @memberof PIXI
* @static
* @enum {number}
* @property {number} NO_PREMULTIPLIED_ALPHA - Source is not premultiplied, leave it like that.
*  Option for compressed and data textures that are created from typed arrays.
* @property {number} PREMULTIPLY_ON_UPLOAD - Source is not premultiplied, premultiply on upload.
*  Default option, used for all loaded images.
* @property {number} PREMULTIPLIED_ALPHA - Source is already premultiplied
*  Example: spine atlases with `_pma` suffix.
* @property {number} NPM - Alias for NO_PREMULTIPLIED_ALPHA.
* @property {number} UNPACK - Default option, alias for PREMULTIPLY_ON_UPLOAD.
* @property {number} PMA - Alias for PREMULTIPLIED_ALPHA.
*/
var ALPHA_MODES;
(function(ALPHA_MODES) {
	ALPHA_MODES[ALPHA_MODES["NPM"] = 0] = "NPM";
	ALPHA_MODES[ALPHA_MODES["UNPACK"] = 1] = "UNPACK";
	ALPHA_MODES[ALPHA_MODES["PMA"] = 2] = "PMA";
	ALPHA_MODES[ALPHA_MODES["NO_PREMULTIPLIED_ALPHA"] = 0] = "NO_PREMULTIPLIED_ALPHA";
	ALPHA_MODES[ALPHA_MODES["PREMULTIPLY_ON_UPLOAD"] = 1] = "PREMULTIPLY_ON_UPLOAD";
	ALPHA_MODES[ALPHA_MODES["PREMULTIPLY_ALPHA"] = 2] = "PREMULTIPLY_ALPHA";
	ALPHA_MODES[ALPHA_MODES["PREMULTIPLIED_ALPHA"] = 2] = "PREMULTIPLIED_ALPHA";
})(ALPHA_MODES || (ALPHA_MODES = {}));
/**
* Configure whether filter textures are cleared after binding.
*
* Filter textures need not be cleared if the filter does not use pixel blending. {@link CLEAR_MODES.BLIT} will detect
* this and skip clearing as an optimization.
* @name CLEAR_MODES
* @memberof PIXI
* @static
* @enum {number}
* @property {number} BLEND - Do not clear the filter texture. The filter's output will blend on top of the output texture.
* @property {number} CLEAR - Always clear the filter texture.
* @property {number} BLIT - Clear only if {@link FilterSystem.forceClear} is set or if the filter uses pixel blending.
* @property {number} NO - Alias for BLEND, same as `false` in earlier versions
* @property {number} YES - Alias for CLEAR, same as `true` in earlier versions
* @property {number} AUTO - Alias for BLIT
*/
var CLEAR_MODES;
(function(CLEAR_MODES) {
	CLEAR_MODES[CLEAR_MODES["NO"] = 0] = "NO";
	CLEAR_MODES[CLEAR_MODES["YES"] = 1] = "YES";
	CLEAR_MODES[CLEAR_MODES["AUTO"] = 2] = "AUTO";
	CLEAR_MODES[CLEAR_MODES["BLEND"] = 0] = "BLEND";
	CLEAR_MODES[CLEAR_MODES["CLEAR"] = 1] = "CLEAR";
	CLEAR_MODES[CLEAR_MODES["BLIT"] = 2] = "BLIT";
})(CLEAR_MODES || (CLEAR_MODES = {}));
/**
* The gc modes that are supported by pixi.
*
* The {@link PIXI.settings.GC_MODE} Garbage Collection mode for PixiJS textures is AUTO
* If set to GC_MODE, the renderer will occasionally check textures usage. If they are not
* used for a specified period of time they will be removed from the GPU. They will of course
* be uploaded again when they are required. This is a silent behind the scenes process that
* should ensure that the GPU does not  get filled up.
*
* Handy for mobile devices!
* This property only affects WebGL.
* @name GC_MODES
* @enum {number}
* @static
* @memberof PIXI
* @property {number} AUTO - Garbage collection will happen periodically automatically
* @property {number} MANUAL - Garbage collection will need to be called manually
*/
var GC_MODES;
(function(GC_MODES) {
	GC_MODES[GC_MODES["AUTO"] = 0] = "AUTO";
	GC_MODES[GC_MODES["MANUAL"] = 1] = "MANUAL";
})(GC_MODES || (GC_MODES = {}));
/**
* Constants that specify float precision in shaders.
* @name PRECISION
* @memberof PIXI
* @constant
* @static
* @enum {string}
* @property {string} [LOW='lowp'] -
* @property {string} [MEDIUM='mediump'] -
* @property {string} [HIGH='highp'] -
*/
var PRECISION;
(function(PRECISION) {
	PRECISION["LOW"] = "lowp";
	PRECISION["MEDIUM"] = "mediump";
	PRECISION["HIGH"] = "highp";
})(PRECISION || (PRECISION = {}));
/**
* Constants for mask implementations.
* We use `type` suffix because it leads to very different behaviours
* @name MASK_TYPES
* @memberof PIXI
* @static
* @enum {number}
* @property {number} NONE - Mask is ignored
* @property {number} SCISSOR - Scissor mask, rectangle on screen, cheap
* @property {number} STENCIL - Stencil mask, 1-bit, medium, works only if renderer supports stencil
* @property {number} SPRITE - Mask that uses SpriteMaskFilter, uses temporary RenderTexture
* @property {number} COLOR - Color mask (RGBA)
*/
var MASK_TYPES;
(function(MASK_TYPES) {
	MASK_TYPES[MASK_TYPES["NONE"] = 0] = "NONE";
	MASK_TYPES[MASK_TYPES["SCISSOR"] = 1] = "SCISSOR";
	MASK_TYPES[MASK_TYPES["STENCIL"] = 2] = "STENCIL";
	MASK_TYPES[MASK_TYPES["SPRITE"] = 3] = "SPRITE";
	MASK_TYPES[MASK_TYPES["COLOR"] = 4] = "COLOR";
})(MASK_TYPES || (MASK_TYPES = {}));
/**
* Bitwise OR of masks that indicate the color channels that are rendered to.
* @static
* @memberof PIXI
* @name COLOR_MASK_BITS
* @enum {number}
* @property {number} RED - Red channel.
* @property {number} GREEN - Green channel
* @property {number} BLUE - Blue channel.
* @property {number} ALPHA - Alpha channel.
*/
var COLOR_MASK_BITS;
(function(COLOR_MASK_BITS) {
	COLOR_MASK_BITS[COLOR_MASK_BITS["RED"] = 1] = "RED";
	COLOR_MASK_BITS[COLOR_MASK_BITS["GREEN"] = 2] = "GREEN";
	COLOR_MASK_BITS[COLOR_MASK_BITS["BLUE"] = 4] = "BLUE";
	COLOR_MASK_BITS[COLOR_MASK_BITS["ALPHA"] = 8] = "ALPHA";
})(COLOR_MASK_BITS || (COLOR_MASK_BITS = {}));
/**
* Constants for multi-sampling antialiasing.
* @see PIXI.Framebuffer#multisample
* @name MSAA_QUALITY
* @memberof PIXI
* @static
* @enum {number}
* @property {number} NONE - No multisampling for this renderTexture
* @property {number} LOW - Try 2 samples
* @property {number} MEDIUM - Try 4 samples
* @property {number} HIGH - Try 8 samples
*/
var MSAA_QUALITY;
(function(MSAA_QUALITY) {
	MSAA_QUALITY[MSAA_QUALITY["NONE"] = 0] = "NONE";
	MSAA_QUALITY[MSAA_QUALITY["LOW"] = 2] = "LOW";
	MSAA_QUALITY[MSAA_QUALITY["MEDIUM"] = 4] = "MEDIUM";
	MSAA_QUALITY[MSAA_QUALITY["HIGH"] = 8] = "HIGH";
})(MSAA_QUALITY || (MSAA_QUALITY = {}));
/**
* Constants for various buffer types in Pixi
* @see PIXI.BUFFER_TYPE
* @name BUFFER_TYPE
* @memberof PIXI
* @static
* @enum {number}
* @property {number} ELEMENT_ARRAY_BUFFER - buffer type for using as an index buffer
* @property {number} ARRAY_BUFFER - buffer type for using attribute data
* @property {number} UNIFORM_BUFFER - the buffer type is for uniform buffer objects
*/
var BUFFER_TYPE;
(function(BUFFER_TYPE) {
	BUFFER_TYPE[BUFFER_TYPE["ELEMENT_ARRAY_BUFFER"] = 34963] = "ELEMENT_ARRAY_BUFFER";
	BUFFER_TYPE[BUFFER_TYPE["ARRAY_BUFFER"] = 34962] = "ARRAY_BUFFER";
	BUFFER_TYPE[BUFFER_TYPE["UNIFORM_BUFFER"] = 35345] = "UNIFORM_BUFFER";
})(BUFFER_TYPE || (BUFFER_TYPE = {}));
//#endregion
//#region node_modules/@pixi/settings/dist/esm/settings.mjs
/*!
* @pixi/settings - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/settings is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
var BrowserAdapter = {
	/**
	* Creates a canvas element of the given size.
	* This canvas is created using the browser's native canvas element.
	* @param width - width of the canvas
	* @param height - height of the canvas
	*/
	createCanvas: function(width, height) {
		var canvas = document.createElement("canvas");
		canvas.width = width;
		canvas.height = height;
		return canvas;
	},
	getWebGLRenderingContext: function() {
		return WebGLRenderingContext;
	},
	getNavigator: function() {
		return navigator;
	},
	getBaseUrl: function() {
		var _a;
		return (_a = document.baseURI) !== null && _a !== void 0 ? _a : window.location.href;
	},
	fetch: function(url, options) {
		return fetch(url, options);
	}
};
var appleIphone = /iPhone/i;
var appleIpod = /iPod/i;
var appleTablet = /iPad/i;
var appleUniversal = /\biOS-universal(?:.+)Mac\b/i;
var androidPhone = /\bAndroid(?:.+)Mobile\b/i;
var androidTablet = /Android/i;
var amazonPhone = /(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i;
var amazonTablet = /Silk/i;
var windowsPhone = /Windows Phone/i;
var windowsTablet = /\bWindows(?:.+)ARM\b/i;
var otherBlackBerry = /BlackBerry/i;
var otherBlackBerry10 = /BB10/i;
var otherOpera = /Opera Mini/i;
var otherChrome = /\b(CriOS|Chrome)(?:.+)Mobile/i;
var otherFirefox = /Mobile(?:.+)Firefox\b/i;
var isAppleTabletOnIos13 = function(navigator) {
	return typeof navigator !== "undefined" && navigator.platform === "MacIntel" && typeof navigator.maxTouchPoints === "number" && navigator.maxTouchPoints > 1 && typeof MSStream === "undefined";
};
function createMatch(userAgent) {
	return function(regex) {
		return regex.test(userAgent);
	};
}
function isMobile$1(param) {
	var nav = {
		userAgent: "",
		platform: "",
		maxTouchPoints: 0
	};
	if (!param && typeof navigator !== "undefined") nav = {
		userAgent: navigator.userAgent,
		platform: navigator.platform,
		maxTouchPoints: navigator.maxTouchPoints || 0
	};
	else if (typeof param === "string") nav.userAgent = param;
	else if (param && param.userAgent) nav = {
		userAgent: param.userAgent,
		platform: param.platform,
		maxTouchPoints: param.maxTouchPoints || 0
	};
	var userAgent = nav.userAgent;
	var tmp = userAgent.split("[FBAN");
	if (typeof tmp[1] !== "undefined") userAgent = tmp[0];
	tmp = userAgent.split("Twitter");
	if (typeof tmp[1] !== "undefined") userAgent = tmp[0];
	var match = createMatch(userAgent);
	var result = {
		apple: {
			phone: match(appleIphone) && !match(windowsPhone),
			ipod: match(appleIpod),
			tablet: !match(appleIphone) && (match(appleTablet) || isAppleTabletOnIos13(nav)) && !match(windowsPhone),
			universal: match(appleUniversal),
			device: (match(appleIphone) || match(appleIpod) || match(appleTablet) || match(appleUniversal) || isAppleTabletOnIos13(nav)) && !match(windowsPhone)
		},
		amazon: {
			phone: match(amazonPhone),
			tablet: !match(amazonPhone) && match(amazonTablet),
			device: match(amazonPhone) || match(amazonTablet)
		},
		android: {
			phone: !match(windowsPhone) && match(amazonPhone) || !match(windowsPhone) && match(androidPhone),
			tablet: !match(windowsPhone) && !match(amazonPhone) && !match(androidPhone) && (match(amazonTablet) || match(androidTablet)),
			device: !match(windowsPhone) && (match(amazonPhone) || match(amazonTablet) || match(androidPhone) || match(androidTablet)) || match(/\bokhttp\b/i)
		},
		windows: {
			phone: match(windowsPhone),
			tablet: match(windowsTablet),
			device: match(windowsPhone) || match(windowsTablet)
		},
		other: {
			blackberry: match(otherBlackBerry),
			blackberry10: match(otherBlackBerry10),
			opera: match(otherOpera),
			firefox: match(otherFirefox),
			chrome: match(otherChrome),
			device: match(otherBlackBerry) || match(otherBlackBerry10) || match(otherOpera) || match(otherFirefox) || match(otherChrome)
		},
		any: false,
		phone: false,
		tablet: false
	};
	result.any = result.apple.device || result.android.device || result.windows.device || result.other.device;
	result.phone = result.apple.phone || result.android.phone || result.windows.phone;
	result.tablet = result.apple.tablet || result.android.tablet || result.windows.tablet;
	return result;
}
var isMobile = isMobile$1(globalThis.navigator);
/**
* Uploading the same buffer multiple times in a single frame can cause performance issues.
* Apparent on iOS so only check for that at the moment
* This check may become more complex if this issue pops up elsewhere.
* @private
* @returns {boolean} `true` if the same buffer may be uploaded more than once.
*/
function canUploadSameBuffer() {
	return !isMobile.apple.device;
}
/**
* The maximum recommended texture units to use.
* In theory the bigger the better, and for desktop we'll use as many as we can.
* But some mobile devices slow down if there is to many branches in the shader.
* So in practice there seems to be a sweet spot size that varies depending on the device.
*
* In v4, all mobile devices were limited to 4 texture units because for this.
* In v5, we allow all texture units to be used on modern Apple or Android devices.
* @private
* @param {number} max
* @returns {number} The maximum recommended texture units to use.
*/
function maxRecommendedTextures(max) {
	var allowMax = true;
	if (isMobile.tablet || isMobile.phone) {
		if (isMobile.apple.device) {
			var match = navigator.userAgent.match(/OS (\d+)_(\d+)?/);
			if (match) {
				var majorVersion = parseInt(match[1], 10);
				if (majorVersion < 11) allowMax = false;
			}
		}
		if (isMobile.android.device) {
			var match = navigator.userAgent.match(/Android\s([0-9.]*)/);
			if (match) {
				var majorVersion = parseInt(match[1], 10);
				if (majorVersion < 7) allowMax = false;
			}
		}
	}
	return allowMax ? max : 4;
}
/**
* User's customizable globals for overriding the default PIXI settings, such
* as a renderer's default resolution, framerate, float precision, etc.
* @example
* // Use the native window resolution as the default resolution
* // will support high-density displays when rendering
* PIXI.settings.RESOLUTION = window.devicePixelRatio;
*
* // Disable interpolation when scaling, will make texture be pixelated
* PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
* @namespace PIXI.settings
*/
var settings = {
	/**
	* This adapter is used to call methods that are platform dependent.
	* For example `document.createElement` only runs on the web but fails in node environments.
	* This allows us to support more platforms by abstracting away specific implementations per platform.
	*
	* By default the adapter is set to work in the browser. However you can create your own
	* by implementing the `IAdapter` interface. See `IAdapter` for more information.
	* @name ADAPTER
	* @memberof PIXI.settings
	* @type {PIXI.IAdapter}
	* @default PIXI.BrowserAdapter
	*/
	ADAPTER: BrowserAdapter,
	/**
	* If set to true WebGL will attempt make textures mimpaped by default.
	* Mipmapping will only succeed if the base texture uploaded has power of two dimensions.
	* @static
	* @name MIPMAP_TEXTURES
	* @memberof PIXI.settings
	* @type {PIXI.MIPMAP_MODES}
	* @default PIXI.MIPMAP_MODES.POW2
	*/
	MIPMAP_TEXTURES: MIPMAP_MODES.POW2,
	/**
	* Default anisotropic filtering level of textures.
	* Usually from 0 to 16
	* @static
	* @name ANISOTROPIC_LEVEL
	* @memberof PIXI.settings
	* @type {number}
	* @default 0
	*/
	ANISOTROPIC_LEVEL: 0,
	/**
	* Default resolution / device pixel ratio of the renderer.
	* @static
	* @name RESOLUTION
	* @memberof PIXI.settings
	* @type {number}
	* @default 1
	*/
	RESOLUTION: 1,
	/**
	* Default filter resolution.
	* @static
	* @name FILTER_RESOLUTION
	* @memberof PIXI.settings
	* @type {number}
	* @default 1
	*/
	FILTER_RESOLUTION: 1,
	/**
	* Default filter samples.
	* @static
	* @name FILTER_MULTISAMPLE
	* @memberof PIXI.settings
	* @type {PIXI.MSAA_QUALITY}
	* @default PIXI.MSAA_QUALITY.NONE
	*/
	FILTER_MULTISAMPLE: MSAA_QUALITY.NONE,
	/**
	* The maximum textures that this device supports.
	* @static
	* @name SPRITE_MAX_TEXTURES
	* @memberof PIXI.settings
	* @type {number}
	* @default 32
	*/
	SPRITE_MAX_TEXTURES: maxRecommendedTextures(32),
	/**
	* The default sprite batch size.
	*
	* The default aims to balance desktop and mobile devices.
	* @static
	* @name SPRITE_BATCH_SIZE
	* @memberof PIXI.settings
	* @type {number}
	* @default 4096
	*/
	SPRITE_BATCH_SIZE: 4096,
	/**
	* The default render options if none are supplied to {@link PIXI.Renderer}
	* or {@link PIXI.CanvasRenderer}.
	* @static
	* @name RENDER_OPTIONS
	* @memberof PIXI.settings
	* @type {object}
	* @property {boolean} [antialias=false] - {@link PIXI.IRendererOptions.antialias}
	* @property {boolean} [autoDensity=false] - {@link PIXI.IRendererOptions.autoDensity}
	* @property {number} [backgroundAlpha=1] - {@link PIXI.IRendererOptions.backgroundAlpha}
	* @property {number} [backgroundColor=0x000000] - {@link PIXI.IRendererOptions.backgroundColor}
	* @property {boolean} [clearBeforeRender=true] - {@link PIXI.IRendererOptions.clearBeforeRender}
	* @property {number} [height=600] - {@link PIXI.IRendererOptions.height}
	* @property {boolean} [preserveDrawingBuffer=false] - {@link PIXI.IRendererOptions.preserveDrawingBuffer}
	* @property {boolean|'notMultiplied'} [useContextAlpha=true] - {@link PIXI.IRendererOptions.useContextAlpha}
	* @property {HTMLCanvasElement} [view=null] - {@link PIXI.IRendererOptions.view}
	* @property {number} [width=800] - {@link PIXI.IRendererOptions.width}
	*/
	RENDER_OPTIONS: {
		view: null,
		width: 800,
		height: 600,
		autoDensity: false,
		backgroundColor: 0,
		backgroundAlpha: 1,
		useContextAlpha: true,
		clearBeforeRender: true,
		antialias: false,
		preserveDrawingBuffer: false
	},
	/**
	* Default Garbage Collection mode.
	* @static
	* @name GC_MODE
	* @memberof PIXI.settings
	* @type {PIXI.GC_MODES}
	* @default PIXI.GC_MODES.AUTO
	*/
	GC_MODE: GC_MODES.AUTO,
	/**
	* Default Garbage Collection max idle.
	* @static
	* @name GC_MAX_IDLE
	* @memberof PIXI.settings
	* @type {number}
	* @default 3600
	*/
	GC_MAX_IDLE: 3600,
	/**
	* Default Garbage Collection maximum check count.
	* @static
	* @name GC_MAX_CHECK_COUNT
	* @memberof PIXI.settings
	* @type {number}
	* @default 600
	*/
	GC_MAX_CHECK_COUNT: 600,
	/**
	* Default wrap modes that are supported by pixi.
	* @static
	* @name WRAP_MODE
	* @memberof PIXI.settings
	* @type {PIXI.WRAP_MODES}
	* @default PIXI.WRAP_MODES.CLAMP
	*/
	WRAP_MODE: WRAP_MODES.CLAMP,
	/**
	* Default scale mode for textures.
	* @static
	* @name SCALE_MODE
	* @memberof PIXI.settings
	* @type {PIXI.SCALE_MODES}
	* @default PIXI.SCALE_MODES.LINEAR
	*/
	SCALE_MODE: SCALE_MODES.LINEAR,
	/**
	* Default specify float precision in vertex shader.
	* @static
	* @name PRECISION_VERTEX
	* @memberof PIXI.settings
	* @type {PIXI.PRECISION}
	* @default PIXI.PRECISION.HIGH
	*/
	PRECISION_VERTEX: PRECISION.HIGH,
	/**
	* Default specify float precision in fragment shader.
	* iOS is best set at highp due to https://github.com/pixijs/pixi.js/issues/3742
	* @static
	* @name PRECISION_FRAGMENT
	* @memberof PIXI.settings
	* @type {PIXI.PRECISION}
	* @default PIXI.PRECISION.MEDIUM
	*/
	PRECISION_FRAGMENT: isMobile.apple.device ? PRECISION.HIGH : PRECISION.MEDIUM,
	/**
	* Can we upload the same buffer in a single frame?
	* @static
	* @name CAN_UPLOAD_SAME_BUFFER
	* @memberof PIXI.settings
	* @type {boolean}
	*/
	CAN_UPLOAD_SAME_BUFFER: canUploadSameBuffer(),
	/**
	* Enables bitmap creation before image load. This feature is experimental.
	* @static
	* @name CREATE_IMAGE_BITMAP
	* @memberof PIXI.settings
	* @type {boolean}
	* @default false
	*/
	CREATE_IMAGE_BITMAP: false,
	/**
	* If true PixiJS will Math.floor() x/y values when rendering, stopping pixel interpolation.
	* Advantages can include sharper image quality (like text) and faster rendering on canvas.
	* The main disadvantage is movement of objects may appear less smooth.
	* @static
	* @constant
	* @memberof PIXI.settings
	* @type {boolean}
	* @default false
	*/
	ROUND_PIXELS: false
};
//#endregion
//#region node_modules/eventemitter3/index.js
var require_eventemitter3 = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var has = Object.prototype.hasOwnProperty;
	var prefix = "~";
	/**
	* Constructor to create a storage for our `EE` objects.
	* An `Events` instance is a plain object whose properties are event names.
	*
	* @constructor
	* @private
	*/
	function Events() {}
	if (Object.create) {
		Events.prototype = Object.create(null);
		if (!new Events().__proto__) prefix = false;
	}
	/**
	* Representation of a single event listener.
	*
	* @param {Function} fn The listener function.
	* @param {*} context The context to invoke the listener with.
	* @param {Boolean} [once=false] Specify if the listener is a one-time listener.
	* @constructor
	* @private
	*/
	function EE(fn, context, once) {
		this.fn = fn;
		this.context = context;
		this.once = once || false;
	}
	/**
	* Add a listener for a given event.
	*
	* @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn The listener function.
	* @param {*} context The context to invoke the listener with.
	* @param {Boolean} once Specify if the listener is a one-time listener.
	* @returns {EventEmitter}
	* @private
	*/
	function addListener(emitter, event, fn, context, once) {
		if (typeof fn !== "function") throw new TypeError("The listener must be a function");
		var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
		if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
		else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
		else emitter._events[evt] = [emitter._events[evt], listener];
		return emitter;
	}
	/**
	* Clear event by name.
	*
	* @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
	* @param {(String|Symbol)} evt The Event name.
	* @private
	*/
	function clearEvent(emitter, evt) {
		if (--emitter._eventsCount === 0) emitter._events = new Events();
		else delete emitter._events[evt];
	}
	/**
	* Minimal `EventEmitter` interface that is molded against the Node.js
	* `EventEmitter` interface.
	*
	* @constructor
	* @public
	*/
	function EventEmitter() {
		this._events = new Events();
		this._eventsCount = 0;
	}
	/**
	* Return an array listing the events for which the emitter has registered
	* listeners.
	*
	* @returns {Array}
	* @public
	*/
	EventEmitter.prototype.eventNames = function eventNames() {
		var names = [], events, name;
		if (this._eventsCount === 0) return names;
		for (name in events = this._events) if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
		if (Object.getOwnPropertySymbols) return names.concat(Object.getOwnPropertySymbols(events));
		return names;
	};
	/**
	* Return the listeners registered for a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @returns {Array} The registered listeners.
	* @public
	*/
	EventEmitter.prototype.listeners = function listeners(event) {
		var evt = prefix ? prefix + event : event, handlers = this._events[evt];
		if (!handlers) return [];
		if (handlers.fn) return [handlers.fn];
		for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) ee[i] = handlers[i].fn;
		return ee;
	};
	/**
	* Return the number of listeners listening to a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @returns {Number} The number of listeners.
	* @public
	*/
	EventEmitter.prototype.listenerCount = function listenerCount(event) {
		var evt = prefix ? prefix + event : event, listeners = this._events[evt];
		if (!listeners) return 0;
		if (listeners.fn) return 1;
		return listeners.length;
	};
	/**
	* Calls each of the listeners registered for a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @returns {Boolean} `true` if the event had listeners, else `false`.
	* @public
	*/
	EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
		var evt = prefix ? prefix + event : event;
		if (!this._events[evt]) return false;
		var listeners = this._events[evt], len = arguments.length, args, i;
		if (listeners.fn) {
			if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
			switch (len) {
				case 1: return listeners.fn.call(listeners.context), true;
				case 2: return listeners.fn.call(listeners.context, a1), true;
				case 3: return listeners.fn.call(listeners.context, a1, a2), true;
				case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
				case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
				case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
			}
			for (i = 1, args = new Array(len - 1); i < len; i++) args[i - 1] = arguments[i];
			listeners.fn.apply(listeners.context, args);
		} else {
			var length = listeners.length, j;
			for (i = 0; i < length; i++) {
				if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
				switch (len) {
					case 1:
						listeners[i].fn.call(listeners[i].context);
						break;
					case 2:
						listeners[i].fn.call(listeners[i].context, a1);
						break;
					case 3:
						listeners[i].fn.call(listeners[i].context, a1, a2);
						break;
					case 4:
						listeners[i].fn.call(listeners[i].context, a1, a2, a3);
						break;
					default:
						if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) args[j - 1] = arguments[j];
						listeners[i].fn.apply(listeners[i].context, args);
				}
			}
		}
		return true;
	};
	/**
	* Add a listener for a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn The listener function.
	* @param {*} [context=this] The context to invoke the listener with.
	* @returns {EventEmitter} `this`.
	* @public
	*/
	EventEmitter.prototype.on = function on(event, fn, context) {
		return addListener(this, event, fn, context, false);
	};
	/**
	* Add a one-time listener for a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn The listener function.
	* @param {*} [context=this] The context to invoke the listener with.
	* @returns {EventEmitter} `this`.
	* @public
	*/
	EventEmitter.prototype.once = function once(event, fn, context) {
		return addListener(this, event, fn, context, true);
	};
	/**
	* Remove the listeners of a given event.
	*
	* @param {(String|Symbol)} event The event name.
	* @param {Function} fn Only remove the listeners that match this function.
	* @param {*} context Only remove the listeners that have this context.
	* @param {Boolean} once Only remove one-time listeners.
	* @returns {EventEmitter} `this`.
	* @public
	*/
	EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
		var evt = prefix ? prefix + event : event;
		if (!this._events[evt]) return this;
		if (!fn) {
			clearEvent(this, evt);
			return this;
		}
		var listeners = this._events[evt];
		if (listeners.fn) {
			if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) clearEvent(this, evt);
		} else {
			for (var i = 0, events = [], length = listeners.length; i < length; i++) if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) events.push(listeners[i]);
			if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
			else clearEvent(this, evt);
		}
		return this;
	};
	/**
	* Remove all listeners, or those of the specified event.
	*
	* @param {(String|Symbol)} [event] The event name.
	* @returns {EventEmitter} `this`.
	* @public
	*/
	EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
		var evt;
		if (event) {
			evt = prefix ? prefix + event : event;
			if (this._events[evt]) clearEvent(this, evt);
		} else {
			this._events = new Events();
			this._eventsCount = 0;
		}
		return this;
	};
	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
	EventEmitter.prototype.addListener = EventEmitter.prototype.on;
	EventEmitter.prefixed = prefix;
	EventEmitter.EventEmitter = EventEmitter;
	if ("undefined" !== typeof module) module.exports = EventEmitter;
}));
//#endregion
//#region node_modules/earcut/src/earcut.js
var require_earcut = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = earcut;
	module.exports.default = earcut;
	function earcut(data, holeIndices, dim) {
		dim = dim || 2;
		var hasHoles = holeIndices && holeIndices.length, outerLen = hasHoles ? holeIndices[0] * dim : data.length, outerNode = linkedList(data, 0, outerLen, dim, true), triangles = [];
		if (!outerNode || outerNode.next === outerNode.prev) return triangles;
		var minX, minY, maxX, maxY, x, y, invSize;
		if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);
		if (data.length > 80 * dim) {
			minX = maxX = data[0];
			minY = maxY = data[1];
			for (var i = dim; i < outerLen; i += dim) {
				x = data[i];
				y = data[i + 1];
				if (x < minX) minX = x;
				if (y < minY) minY = y;
				if (x > maxX) maxX = x;
				if (y > maxY) maxY = y;
			}
			invSize = Math.max(maxX - minX, maxY - minY);
			invSize = invSize !== 0 ? 32767 / invSize : 0;
		}
		earcutLinked(outerNode, triangles, dim, minX, minY, invSize, 0);
		return triangles;
	}
	function linkedList(data, start, end, dim, clockwise) {
		var i, last;
		if (clockwise === signedArea(data, start, end, dim) > 0) for (i = start; i < end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
		else for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
		if (last && equals(last, last.next)) {
			removeNode(last);
			last = last.next;
		}
		return last;
	}
	function filterPoints(start, end) {
		if (!start) return start;
		if (!end) end = start;
		var p = start, again;
		do {
			again = false;
			if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
				removeNode(p);
				p = end = p.prev;
				if (p === p.next) break;
				again = true;
			} else p = p.next;
		} while (again || p !== end);
		return end;
	}
	function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
		if (!ear) return;
		if (!pass && invSize) indexCurve(ear, minX, minY, invSize);
		var stop = ear, prev, next;
		while (ear.prev !== ear.next) {
			prev = ear.prev;
			next = ear.next;
			if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
				triangles.push(prev.i / dim | 0);
				triangles.push(ear.i / dim | 0);
				triangles.push(next.i / dim | 0);
				removeNode(ear);
				ear = next.next;
				stop = next.next;
				continue;
			}
			ear = next;
			if (ear === stop) {
				if (!pass) earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);
				else if (pass === 1) {
					ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
					earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);
				} else if (pass === 2) splitEarcut(ear, triangles, dim, minX, minY, invSize);
				break;
			}
		}
	}
	function isEar(ear) {
		var a = ear.prev, b = ear, c = ear.next;
		if (area(a, b, c) >= 0) return false;
		var ax = a.x, bx = b.x, cx = c.x, ay = a.y, by = b.y, cy = c.y;
		var x0 = ax < bx ? ax < cx ? ax : cx : bx < cx ? bx : cx, y0 = ay < by ? ay < cy ? ay : cy : by < cy ? by : cy, x1 = ax > bx ? ax > cx ? ax : cx : bx > cx ? bx : cx, y1 = ay > by ? ay > cy ? ay : cy : by > cy ? by : cy;
		var p = c.next;
		while (p !== a) {
			if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
			p = p.next;
		}
		return true;
	}
	function isEarHashed(ear, minX, minY, invSize) {
		var a = ear.prev, b = ear, c = ear.next;
		if (area(a, b, c) >= 0) return false;
		var ax = a.x, bx = b.x, cx = c.x, ay = a.y, by = b.y, cy = c.y;
		var x0 = ax < bx ? ax < cx ? ax : cx : bx < cx ? bx : cx, y0 = ay < by ? ay < cy ? ay : cy : by < cy ? by : cy, x1 = ax > bx ? ax > cx ? ax : cx : bx > cx ? bx : cx, y1 = ay > by ? ay > cy ? ay : cy : by > cy ? by : cy;
		var minZ = zOrder(x0, y0, minX, minY, invSize), maxZ = zOrder(x1, y1, minX, minY, invSize);
		var p = ear.prevZ, n = ear.nextZ;
		while (p && p.z >= minZ && n && n.z <= maxZ) {
			if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c && pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
			p = p.prevZ;
			if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c && pointInTriangle(ax, ay, bx, by, cx, cy, n.x, n.y) && area(n.prev, n, n.next) >= 0) return false;
			n = n.nextZ;
		}
		while (p && p.z >= minZ) {
			if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c && pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
			p = p.prevZ;
		}
		while (n && n.z <= maxZ) {
			if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c && pointInTriangle(ax, ay, bx, by, cx, cy, n.x, n.y) && area(n.prev, n, n.next) >= 0) return false;
			n = n.nextZ;
		}
		return true;
	}
	function cureLocalIntersections(start, triangles, dim) {
		var p = start;
		do {
			var a = p.prev, b = p.next.next;
			if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {
				triangles.push(a.i / dim | 0);
				triangles.push(p.i / dim | 0);
				triangles.push(b.i / dim | 0);
				removeNode(p);
				removeNode(p.next);
				p = start = b;
			}
			p = p.next;
		} while (p !== start);
		return filterPoints(p);
	}
	function splitEarcut(start, triangles, dim, minX, minY, invSize) {
		var a = start;
		do {
			var b = a.next.next;
			while (b !== a.prev) {
				if (a.i !== b.i && isValidDiagonal(a, b)) {
					var c = splitPolygon(a, b);
					a = filterPoints(a, a.next);
					c = filterPoints(c, c.next);
					earcutLinked(a, triangles, dim, minX, minY, invSize, 0);
					earcutLinked(c, triangles, dim, minX, minY, invSize, 0);
					return;
				}
				b = b.next;
			}
			a = a.next;
		} while (a !== start);
	}
	function eliminateHoles(data, holeIndices, outerNode, dim) {
		var queue = [], i = 0, len = holeIndices.length, start, end, list;
		for (; i < len; i++) {
			start = holeIndices[i] * dim;
			end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
			list = linkedList(data, start, end, dim, false);
			if (list === list.next) list.steiner = true;
			queue.push(getLeftmost(list));
		}
		queue.sort(compareX);
		for (i = 0; i < queue.length; i++) outerNode = eliminateHole(queue[i], outerNode);
		return outerNode;
	}
	function compareX(a, b) {
		return a.x - b.x;
	}
	function eliminateHole(hole, outerNode) {
		var bridge = findHoleBridge(hole, outerNode);
		if (!bridge) return outerNode;
		var bridgeReverse = splitPolygon(bridge, hole);
		filterPoints(bridgeReverse, bridgeReverse.next);
		return filterPoints(bridge, bridge.next);
	}
	function findHoleBridge(hole, outerNode) {
		var p = outerNode, hx = hole.x, hy = hole.y, qx = -Infinity, m;
		do {
			if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
				var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
				if (x <= hx && x > qx) {
					qx = x;
					m = p.x < p.next.x ? p : p.next;
					if (x === hx) return m;
				}
			}
			p = p.next;
		} while (p !== outerNode);
		if (!m) return null;
		var stop = m, mx = m.x, my = m.y, tanMin = Infinity, tan;
		p = m;
		do {
			if (hx >= p.x && p.x >= mx && hx !== p.x && pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {
				tan = Math.abs(hy - p.y) / (hx - p.x);
				if (locallyInside(p, hole) && (tan < tanMin || tan === tanMin && (p.x > m.x || p.x === m.x && sectorContainsSector(m, p)))) {
					m = p;
					tanMin = tan;
				}
			}
			p = p.next;
		} while (p !== stop);
		return m;
	}
	function sectorContainsSector(m, p) {
		return area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
	}
	function indexCurve(start, minX, minY, invSize) {
		var p = start;
		do {
			if (p.z === 0) p.z = zOrder(p.x, p.y, minX, minY, invSize);
			p.prevZ = p.prev;
			p.nextZ = p.next;
			p = p.next;
		} while (p !== start);
		p.prevZ.nextZ = null;
		p.prevZ = null;
		sortLinked(p);
	}
	function sortLinked(list) {
		var i, p, q, e, tail, numMerges, pSize, qSize, inSize = 1;
		do {
			p = list;
			list = null;
			tail = null;
			numMerges = 0;
			while (p) {
				numMerges++;
				q = p;
				pSize = 0;
				for (i = 0; i < inSize; i++) {
					pSize++;
					q = q.nextZ;
					if (!q) break;
				}
				qSize = inSize;
				while (pSize > 0 || qSize > 0 && q) {
					if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
						e = p;
						p = p.nextZ;
						pSize--;
					} else {
						e = q;
						q = q.nextZ;
						qSize--;
					}
					if (tail) tail.nextZ = e;
					else list = e;
					e.prevZ = tail;
					tail = e;
				}
				p = q;
			}
			tail.nextZ = null;
			inSize *= 2;
		} while (numMerges > 1);
		return list;
	}
	function zOrder(x, y, minX, minY, invSize) {
		x = (x - minX) * invSize | 0;
		y = (y - minY) * invSize | 0;
		x = (x | x << 8) & 16711935;
		x = (x | x << 4) & 252645135;
		x = (x | x << 2) & 858993459;
		x = (x | x << 1) & 1431655765;
		y = (y | y << 8) & 16711935;
		y = (y | y << 4) & 252645135;
		y = (y | y << 2) & 858993459;
		y = (y | y << 1) & 1431655765;
		return x | y << 1;
	}
	function getLeftmost(start) {
		var p = start, leftmost = start;
		do {
			if (p.x < leftmost.x || p.x === leftmost.x && p.y < leftmost.y) leftmost = p;
			p = p.next;
		} while (p !== start);
		return leftmost;
	}
	function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
		return (cx - px) * (ay - py) >= (ax - px) * (cy - py) && (ax - px) * (by - py) >= (bx - px) * (ay - py) && (bx - px) * (cy - py) >= (cx - px) * (by - py);
	}
	function isValidDiagonal(a, b) {
		return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && (locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && (area(a.prev, a, b.prev) || area(a, b.prev, b)) || equals(a, b) && area(a.prev, a, a.next) > 0 && area(b.prev, b, b.next) > 0);
	}
	function area(p, q, r) {
		return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
	}
	function equals(p1, p2) {
		return p1.x === p2.x && p1.y === p2.y;
	}
	function intersects(p1, q1, p2, q2) {
		var o1 = sign(area(p1, q1, p2));
		var o2 = sign(area(p1, q1, q2));
		var o3 = sign(area(p2, q2, p1));
		var o4 = sign(area(p2, q2, q1));
		if (o1 !== o2 && o3 !== o4) return true;
		if (o1 === 0 && onSegment(p1, p2, q1)) return true;
		if (o2 === 0 && onSegment(p1, q2, q1)) return true;
		if (o3 === 0 && onSegment(p2, p1, q2)) return true;
		if (o4 === 0 && onSegment(p2, q1, q2)) return true;
		return false;
	}
	function onSegment(p, q, r) {
		return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
	}
	function sign(num) {
		return num > 0 ? 1 : num < 0 ? -1 : 0;
	}
	function intersectsPolygon(a, b) {
		var p = a;
		do {
			if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i && intersects(p, p.next, a, b)) return true;
			p = p.next;
		} while (p !== a);
		return false;
	}
	function locallyInside(a, b) {
		return area(a.prev, a, a.next) < 0 ? area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 : area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
	}
	function middleInside(a, b) {
		var p = a, inside = false, px = (a.x + b.x) / 2, py = (a.y + b.y) / 2;
		do {
			if (p.y > py !== p.next.y > py && p.next.y !== p.y && px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x) inside = !inside;
			p = p.next;
		} while (p !== a);
		return inside;
	}
	function splitPolygon(a, b) {
		var a2 = new Node(a.i, a.x, a.y), b2 = new Node(b.i, b.x, b.y), an = a.next, bp = b.prev;
		a.next = b;
		b.prev = a;
		a2.next = an;
		an.prev = a2;
		b2.next = a2;
		a2.prev = b2;
		bp.next = b2;
		b2.prev = bp;
		return b2;
	}
	function insertNode(i, x, y, last) {
		var p = new Node(i, x, y);
		if (!last) {
			p.prev = p;
			p.next = p;
		} else {
			p.next = last.next;
			p.prev = last;
			last.next.prev = p;
			last.next = p;
		}
		return p;
	}
	function removeNode(p) {
		p.next.prev = p.prev;
		p.prev.next = p.next;
		if (p.prevZ) p.prevZ.nextZ = p.nextZ;
		if (p.nextZ) p.nextZ.prevZ = p.prevZ;
	}
	function Node(i, x, y) {
		this.i = i;
		this.x = x;
		this.y = y;
		this.prev = null;
		this.next = null;
		this.z = 0;
		this.prevZ = null;
		this.nextZ = null;
		this.steiner = false;
	}
	earcut.deviation = function(data, holeIndices, dim, triangles) {
		var hasHoles = holeIndices && holeIndices.length;
		var outerLen = hasHoles ? holeIndices[0] * dim : data.length;
		var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
		if (hasHoles) for (var i = 0, len = holeIndices.length; i < len; i++) {
			var start = holeIndices[i] * dim;
			var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
			polygonArea -= Math.abs(signedArea(data, start, end, dim));
		}
		var trianglesArea = 0;
		for (i = 0; i < triangles.length; i += 3) {
			var a = triangles[i] * dim;
			var b = triangles[i + 1] * dim;
			var c = triangles[i + 2] * dim;
			trianglesArea += Math.abs((data[a] - data[c]) * (data[b + 1] - data[a + 1]) - (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
		}
		return polygonArea === 0 && trianglesArea === 0 ? 0 : Math.abs((trianglesArea - polygonArea) / polygonArea);
	};
	function signedArea(data, start, end, dim) {
		var sum = 0;
		for (var i = start, j = end - dim; i < end; i += dim) {
			sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
			j = i;
		}
		return sum;
	}
	earcut.flatten = function(data) {
		var dim = data[0][0].length, result = {
			vertices: [],
			holes: [],
			dimensions: dim
		}, holeIndex = 0;
		for (var i = 0; i < data.length; i++) {
			for (var j = 0; j < data[i].length; j++) for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
			if (i > 0) {
				holeIndex += data[i - 1].length;
				result.holes.push(holeIndex);
			}
		}
		return result;
	};
}));
//#endregion
//#region node_modules/punycode/punycode.js
var require_punycode = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/*! https://mths.be/punycode v1.4.1 by @mathias */
	(function(root) {
		/** Detect free variables */
		var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
		var freeModule = typeof module == "object" && module && !module.nodeType && module;
		var freeGlobal = typeof global == "object" && global;
		if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) root = freeGlobal;
		/**
		* The `punycode` object.
		* @name punycode
		* @type Object
		*/
		var punycode, maxInt = 2147483647, base = 36, tMin = 1, tMax = 26, skew = 38, damp = 700, initialBias = 72, initialN = 128, delimiter = "-", regexPunycode = /^xn--/, regexNonASCII = /[^\x20-\x7E]/, regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, errors = {
			"overflow": "Overflow: input needs wider integers to process",
			"not-basic": "Illegal input >= 0x80 (not a basic code point)",
			"invalid-input": "Invalid input"
		}, baseMinusTMin = base - tMin, floor = Math.floor, stringFromCharCode = String.fromCharCode, key;
		/**
		* A generic error utility function.
		* @private
		* @param {String} type The error type.
		* @returns {Error} Throws a `RangeError` with the applicable error message.
		*/
		function error(type) {
			throw new RangeError(errors[type]);
		}
		/**
		* A generic `Array#map` utility function.
		* @private
		* @param {Array} array The array to iterate over.
		* @param {Function} callback The function that gets called for every array
		* item.
		* @returns {Array} A new array of values returned by the callback function.
		*/
		function map(array, fn) {
			var length = array.length;
			var result = [];
			while (length--) result[length] = fn(array[length]);
			return result;
		}
		/**
		* A simple `Array#map`-like wrapper to work with domain name strings or email
		* addresses.
		* @private
		* @param {String} domain The domain name or email address.
		* @param {Function} callback The function that gets called for every
		* character.
		* @returns {Array} A new string of characters returned by the callback
		* function.
		*/
		function mapDomain(string, fn) {
			var parts = string.split("@");
			var result = "";
			if (parts.length > 1) {
				result = parts[0] + "@";
				string = parts[1];
			}
			string = string.replace(regexSeparators, ".");
			var encoded = map(string.split("."), fn).join(".");
			return result + encoded;
		}
		/**
		* Creates an array containing the numeric code points of each Unicode
		* character in the string. While JavaScript uses UCS-2 internally,
		* this function will convert a pair of surrogate halves (each of which
		* UCS-2 exposes as separate characters) into a single code point,
		* matching UTF-16.
		* @see `punycode.ucs2.encode`
		* @see <https://mathiasbynens.be/notes/javascript-encoding>
		* @memberOf punycode.ucs2
		* @name decode
		* @param {String} string The Unicode input string (UCS-2).
		* @returns {Array} The new array of code points.
		*/
		function ucs2decode(string) {
			var output = [], counter = 0, length = string.length, value, extra;
			while (counter < length) {
				value = string.charCodeAt(counter++);
				if (value >= 55296 && value <= 56319 && counter < length) {
					extra = string.charCodeAt(counter++);
					if ((extra & 64512) == 56320) output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
					else {
						output.push(value);
						counter--;
					}
				} else output.push(value);
			}
			return output;
		}
		/**
		* Creates a string based on an array of numeric code points.
		* @see `punycode.ucs2.decode`
		* @memberOf punycode.ucs2
		* @name encode
		* @param {Array} codePoints The array of numeric code points.
		* @returns {String} The new Unicode string (UCS-2).
		*/
		function ucs2encode(array) {
			return map(array, function(value) {
				var output = "";
				if (value > 65535) {
					value -= 65536;
					output += stringFromCharCode(value >>> 10 & 1023 | 55296);
					value = 56320 | value & 1023;
				}
				output += stringFromCharCode(value);
				return output;
			}).join("");
		}
		/**
		* Converts a basic code point into a digit/integer.
		* @see `digitToBasic()`
		* @private
		* @param {Number} codePoint The basic numeric code point value.
		* @returns {Number} The numeric value of a basic code point (for use in
		* representing integers) in the range `0` to `base - 1`, or `base` if
		* the code point does not represent a value.
		*/
		function basicToDigit(codePoint) {
			if (codePoint - 48 < 10) return codePoint - 22;
			if (codePoint - 65 < 26) return codePoint - 65;
			if (codePoint - 97 < 26) return codePoint - 97;
			return base;
		}
		/**
		* Converts a digit/integer into a basic code point.
		* @see `basicToDigit()`
		* @private
		* @param {Number} digit The numeric value of a basic code point.
		* @returns {Number} The basic code point whose value (when used for
		* representing integers) is `digit`, which needs to be in the range
		* `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
		* used; else, the lowercase form is used. The behavior is undefined
		* if `flag` is non-zero and `digit` has no uppercase form.
		*/
		function digitToBasic(digit, flag) {
			return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
		}
		/**
		* Bias adaptation function as per section 3.4 of RFC 3492.
		* https://tools.ietf.org/html/rfc3492#section-3.4
		* @private
		*/
		function adapt(delta, numPoints, firstTime) {
			var k = 0;
			delta = firstTime ? floor(delta / damp) : delta >> 1;
			delta += floor(delta / numPoints);
			for (; delta > baseMinusTMin * tMax >> 1; k += base) delta = floor(delta / baseMinusTMin);
			return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
		}
		/**
		* Converts a Punycode string of ASCII-only symbols to a string of Unicode
		* symbols.
		* @memberOf punycode
		* @param {String} input The Punycode string of ASCII-only symbols.
		* @returns {String} The resulting string of Unicode symbols.
		*/
		function decode(input) {
			var output = [], inputLength = input.length, out, i = 0, n = initialN, bias = initialBias, basic = input.lastIndexOf(delimiter), j, index, oldi, w, k, digit, t, baseMinusT;
			if (basic < 0) basic = 0;
			for (j = 0; j < basic; ++j) {
				if (input.charCodeAt(j) >= 128) error("not-basic");
				output.push(input.charCodeAt(j));
			}
			for (index = basic > 0 ? basic + 1 : 0; index < inputLength;) {
				for (oldi = i, w = 1, k = base;; k += base) {
					if (index >= inputLength) error("invalid-input");
					digit = basicToDigit(input.charCodeAt(index++));
					if (digit >= base || digit > floor((maxInt - i) / w)) error("overflow");
					i += digit * w;
					t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
					if (digit < t) break;
					baseMinusT = base - t;
					if (w > floor(maxInt / baseMinusT)) error("overflow");
					w *= baseMinusT;
				}
				out = output.length + 1;
				bias = adapt(i - oldi, out, oldi == 0);
				if (floor(i / out) > maxInt - n) error("overflow");
				n += floor(i / out);
				i %= out;
				output.splice(i++, 0, n);
			}
			return ucs2encode(output);
		}
		/**
		* Converts a string of Unicode symbols (e.g. a domain name label) to a
		* Punycode string of ASCII-only symbols.
		* @memberOf punycode
		* @param {String} input The string of Unicode symbols.
		* @returns {String} The resulting Punycode string of ASCII-only symbols.
		*/
		function encode(input) {
			var n, delta, handledCPCount, basicLength, bias, j, m, q, k, t, currentValue, output = [], inputLength, handledCPCountPlusOne, baseMinusT, qMinusT;
			input = ucs2decode(input);
			inputLength = input.length;
			n = initialN;
			delta = 0;
			bias = initialBias;
			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue < 128) output.push(stringFromCharCode(currentValue));
			}
			handledCPCount = basicLength = output.length;
			if (basicLength) output.push(delimiter);
			while (handledCPCount < inputLength) {
				for (m = maxInt, j = 0; j < inputLength; ++j) {
					currentValue = input[j];
					if (currentValue >= n && currentValue < m) m = currentValue;
				}
				handledCPCountPlusOne = handledCPCount + 1;
				if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) error("overflow");
				delta += (m - n) * handledCPCountPlusOne;
				n = m;
				for (j = 0; j < inputLength; ++j) {
					currentValue = input[j];
					if (currentValue < n && ++delta > maxInt) error("overflow");
					if (currentValue == n) {
						for (q = delta, k = base;; k += base) {
							t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
							if (q < t) break;
							qMinusT = q - t;
							baseMinusT = base - t;
							output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0)));
							q = floor(qMinusT / baseMinusT);
						}
						output.push(stringFromCharCode(digitToBasic(q, 0)));
						bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
						delta = 0;
						++handledCPCount;
					}
				}
				++delta;
				++n;
			}
			return output.join("");
		}
		/**
		* Converts a Punycode string representing a domain name or an email address
		* to Unicode. Only the Punycoded parts of the input will be converted, i.e.
		* it doesn't matter if you call it on a string that has already been
		* converted to Unicode.
		* @memberOf punycode
		* @param {String} input The Punycoded domain name or email address to
		* convert to Unicode.
		* @returns {String} The Unicode representation of the given Punycode
		* string.
		*/
		function toUnicode(input) {
			return mapDomain(input, function(string) {
				return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
			});
		}
		/**
		* Converts a Unicode string representing a domain name or an email address to
		* Punycode. Only the non-ASCII parts of the domain name will be converted,
		* i.e. it doesn't matter if you call it with a domain that's already in
		* ASCII.
		* @memberOf punycode
		* @param {String} input The domain name or email address to convert, as a
		* Unicode string.
		* @returns {String} The Punycode representation of the given domain name or
		* email address.
		*/
		function toASCII(input) {
			return mapDomain(input, function(string) {
				return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
			});
		}
		/** Define the public API */
		punycode = {
			/**
			* A string representing the current Punycode.js version number.
			* @memberOf punycode
			* @type String
			*/
			"version": "1.4.1",
			/**
			* An object of methods to convert from JavaScript's internal character
			* representation (UCS-2) to Unicode code points, and back.
			* @see <https://mathiasbynens.be/notes/javascript-encoding>
			* @memberOf punycode
			* @type Object
			*/
			"ucs2": {
				"decode": ucs2decode,
				"encode": ucs2encode
			},
			"decode": decode,
			"encode": encode,
			"toASCII": toASCII,
			"toUnicode": toUnicode
		};
		/** Expose `punycode` */
		if (typeof define == "function" && typeof define.amd == "object" && define.amd) define("punycode", function() {
			return punycode;
		});
		else if (freeExports && freeModule) {
			if (module.exports == freeExports) freeModule.exports = punycode;
			else for (key in punycode) punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
		} else root.punycode = punycode;
	})(exports);
}));
//#endregion
//#region node_modules/es-errors/type.js
var require_type = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./type')} */
	module.exports = TypeError;
}));
//#endregion
//#region __vite-browser-external
var require___vite_browser_external = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {};
}));
//#endregion
//#region node_modules/object-inspect/index.js
var require_object_inspect = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var hasMap = typeof Map === "function" && Map.prototype;
	var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null;
	var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === "function" ? mapSizeDescriptor.get : null;
	var mapForEach = hasMap && Map.prototype.forEach;
	var hasSet = typeof Set === "function" && Set.prototype;
	var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null;
	var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === "function" ? setSizeDescriptor.get : null;
	var setForEach = hasSet && Set.prototype.forEach;
	var weakMapHas = typeof WeakMap === "function" && WeakMap.prototype ? WeakMap.prototype.has : null;
	var weakSetHas = typeof WeakSet === "function" && WeakSet.prototype ? WeakSet.prototype.has : null;
	var weakRefDeref = typeof WeakRef === "function" && WeakRef.prototype ? WeakRef.prototype.deref : null;
	var booleanValueOf = Boolean.prototype.valueOf;
	var objectToString = Object.prototype.toString;
	var functionToString = Function.prototype.toString;
	var $match = String.prototype.match;
	var $slice = String.prototype.slice;
	var $replace = String.prototype.replace;
	var $toUpperCase = String.prototype.toUpperCase;
	var $toLowerCase = String.prototype.toLowerCase;
	var $test = RegExp.prototype.test;
	var $concat = Array.prototype.concat;
	var $join = Array.prototype.join;
	var $arrSlice = Array.prototype.slice;
	var $floor = Math.floor;
	var bigIntValueOf = typeof BigInt === "function" ? BigInt.prototype.valueOf : null;
	var gOPS = Object.getOwnPropertySymbols;
	var symToString = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol.prototype.toString : null;
	var hasShammedSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "object";
	var toStringTag = typeof Symbol === "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? "object" : "symbol") ? Symbol.toStringTag : null;
	var isEnumerable = Object.prototype.propertyIsEnumerable;
	var gPO = (typeof Reflect === "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(O) {
		return O.__proto__;
	} : null);
	function addNumericSeparator(num, str) {
		if (num === Infinity || num === -Infinity || num !== num || num && num > -1e3 && num < 1e3 || $test.call(/e/, str)) return str;
		var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
		if (typeof num === "number") {
			var int = num < 0 ? -$floor(-num) : $floor(num);
			if (int !== num) {
				var intStr = String(int);
				var dec = $slice.call(str, intStr.length + 1);
				return $replace.call(intStr, sepRegex, "$&_") + "." + $replace.call($replace.call(dec, /([0-9]{3})/g, "$&_"), /_$/, "");
			}
		}
		return $replace.call(str, sepRegex, "$&_");
	}
	var utilInspect = require___vite_browser_external();
	var inspectCustom = utilInspect.custom;
	var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;
	var quotes = {
		__proto__: null,
		"double": "\"",
		single: "'"
	};
	var quoteREs = {
		__proto__: null,
		"double": /(["\\])/g,
		single: /(['\\])/g
	};
	module.exports = function inspect_(obj, options, depth, seen) {
		var opts = options || {};
		if (has(opts, "quoteStyle") && !has(quotes, opts.quoteStyle)) throw new TypeError("option \"quoteStyle\" must be \"single\" or \"double\"");
		if (has(opts, "maxStringLength") && (typeof opts.maxStringLength === "number" ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) throw new TypeError("option \"maxStringLength\", if provided, must be a positive integer, Infinity, or `null`");
		var customInspect = has(opts, "customInspect") ? opts.customInspect : true;
		if (typeof customInspect !== "boolean" && customInspect !== "symbol") throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
		if (has(opts, "indent") && opts.indent !== null && opts.indent !== "	" && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) throw new TypeError("option \"indent\" must be \"\\t\", an integer > 0, or `null`");
		if (has(opts, "numericSeparator") && typeof opts.numericSeparator !== "boolean") throw new TypeError("option \"numericSeparator\", if provided, must be `true` or `false`");
		var numericSeparator = opts.numericSeparator;
		if (typeof obj === "undefined") return "undefined";
		if (obj === null) return "null";
		if (typeof obj === "boolean") return obj ? "true" : "false";
		if (typeof obj === "string") return inspectString(obj, opts);
		if (typeof obj === "number") {
			if (obj === 0) return Infinity / obj > 0 ? "0" : "-0";
			var str = String(obj);
			return numericSeparator ? addNumericSeparator(obj, str) : str;
		}
		if (typeof obj === "bigint") {
			var bigIntStr = String(obj) + "n";
			return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
		}
		var maxDepth = typeof opts.depth === "undefined" ? 5 : opts.depth;
		if (typeof depth === "undefined") depth = 0;
		if (depth >= maxDepth && maxDepth > 0 && typeof obj === "object") return isArray(obj) ? "[Array]" : "[Object]";
		var indent = getIndent(opts, depth);
		if (typeof seen === "undefined") seen = [];
		else if (indexOf(seen, obj) >= 0) return "[Circular]";
		function inspect(value, from, noIndent) {
			if (from) {
				seen = $arrSlice.call(seen);
				seen.push(from);
			}
			if (noIndent) {
				var newOpts = { depth: opts.depth };
				if (has(opts, "quoteStyle")) newOpts.quoteStyle = opts.quoteStyle;
				return inspect_(value, newOpts, depth + 1, seen);
			}
			return inspect_(value, opts, depth + 1, seen);
		}
		if (typeof obj === "function" && !isRegExp(obj)) {
			var name = nameOf(obj);
			var keys = arrObjKeys(obj, inspect);
			return "[Function" + (name ? ": " + name : " (anonymous)") + "]" + (keys.length > 0 ? " { " + $join.call(keys, ", ") + " }" : "");
		}
		if (isSymbol(obj)) {
			var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, "$1") : symToString.call(obj);
			return typeof obj === "object" && !hasShammedSymbols ? markBoxed(symString) : symString;
		}
		if (isElement(obj)) {
			var s = "<" + $toLowerCase.call(String(obj.nodeName));
			var attrs = obj.attributes || [];
			for (var i = 0; i < attrs.length; i++) s += " " + attrs[i].name + "=" + wrapQuotes(quote(attrs[i].value), "double", opts);
			s += ">";
			if (obj.childNodes && obj.childNodes.length) s += "...";
			s += "</" + $toLowerCase.call(String(obj.nodeName)) + ">";
			return s;
		}
		if (isArray(obj)) {
			if (obj.length === 0) return "[]";
			var xs = arrObjKeys(obj, inspect);
			if (indent && !singleLineValues(xs)) return "[" + indentedJoin(xs, indent) + "]";
			return "[ " + $join.call(xs, ", ") + " ]";
		}
		if (isError(obj)) {
			var parts = arrObjKeys(obj, inspect);
			if (!("cause" in Error.prototype) && "cause" in obj && !isEnumerable.call(obj, "cause")) return "{ [" + String(obj) + "] " + $join.call($concat.call("[cause]: " + inspect(obj.cause), parts), ", ") + " }";
			if (parts.length === 0) return "[" + String(obj) + "]";
			return "{ [" + String(obj) + "] " + $join.call(parts, ", ") + " }";
		}
		if (typeof obj === "object" && customInspect) {
			if (inspectSymbol && typeof obj[inspectSymbol] === "function" && utilInspect) return utilInspect(obj, { depth: maxDepth - depth });
			else if (customInspect !== "symbol" && typeof obj.inspect === "function") return obj.inspect();
		}
		if (isMap(obj)) {
			var mapParts = [];
			if (mapForEach) mapForEach.call(obj, function(value, key) {
				mapParts.push(inspect(key, obj, true) + " => " + inspect(value, obj));
			});
			return collectionOf("Map", mapSize.call(obj), mapParts, indent);
		}
		if (isSet(obj)) {
			var setParts = [];
			if (setForEach) setForEach.call(obj, function(value) {
				setParts.push(inspect(value, obj));
			});
			return collectionOf("Set", setSize.call(obj), setParts, indent);
		}
		if (isWeakMap(obj)) return weakCollectionOf("WeakMap");
		if (isWeakSet(obj)) return weakCollectionOf("WeakSet");
		if (isWeakRef(obj)) return weakCollectionOf("WeakRef");
		if (isNumber(obj)) return markBoxed(inspect(Number(obj)));
		if (isBigInt(obj)) return markBoxed(inspect(bigIntValueOf.call(obj)));
		if (isBoolean(obj)) return markBoxed(booleanValueOf.call(obj));
		if (isString(obj)) return markBoxed(inspect(String(obj)));
		if (typeof window !== "undefined" && obj === window) return "{ [object Window] }";
		if (typeof globalThis !== "undefined" && obj === globalThis || typeof global !== "undefined" && obj === global) return "{ [object globalThis] }";
		if (!isDate(obj) && !isRegExp(obj)) {
			var ys = arrObjKeys(obj, inspect);
			var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
			var protoTag = obj instanceof Object ? "" : "null prototype";
			var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? "Object" : "";
			var tag = (isPlainObject || typeof obj.constructor !== "function" ? "" : obj.constructor.name ? obj.constructor.name + " " : "") + (stringTag || protoTag ? "[" + $join.call($concat.call([], stringTag || [], protoTag || []), ": ") + "] " : "");
			if (ys.length === 0) return tag + "{}";
			if (indent) return tag + "{" + indentedJoin(ys, indent) + "}";
			return tag + "{ " + $join.call(ys, ", ") + " }";
		}
		return String(obj);
	};
	function wrapQuotes(s, defaultStyle, opts) {
		var quoteChar = quotes[opts.quoteStyle || defaultStyle];
		return quoteChar + s + quoteChar;
	}
	function quote(s) {
		return $replace.call(String(s), /"/g, "&quot;");
	}
	function canTrustToString(obj) {
		return !toStringTag || !(typeof obj === "object" && (toStringTag in obj || typeof obj[toStringTag] !== "undefined"));
	}
	function isArray(obj) {
		return toStr(obj) === "[object Array]" && canTrustToString(obj);
	}
	function isDate(obj) {
		return toStr(obj) === "[object Date]" && canTrustToString(obj);
	}
	function isRegExp(obj) {
		return toStr(obj) === "[object RegExp]" && canTrustToString(obj);
	}
	function isError(obj) {
		return toStr(obj) === "[object Error]" && canTrustToString(obj);
	}
	function isString(obj) {
		return toStr(obj) === "[object String]" && canTrustToString(obj);
	}
	function isNumber(obj) {
		return toStr(obj) === "[object Number]" && canTrustToString(obj);
	}
	function isBoolean(obj) {
		return toStr(obj) === "[object Boolean]" && canTrustToString(obj);
	}
	function isSymbol(obj) {
		if (hasShammedSymbols) return obj && typeof obj === "object" && obj instanceof Symbol;
		if (typeof obj === "symbol") return true;
		if (!obj || typeof obj !== "object" || !symToString) return false;
		try {
			symToString.call(obj);
			return true;
		} catch (e) {}
		return false;
	}
	function isBigInt(obj) {
		if (!obj || typeof obj !== "object" || !bigIntValueOf) return false;
		try {
			bigIntValueOf.call(obj);
			return true;
		} catch (e) {}
		return false;
	}
	var hasOwn = Object.prototype.hasOwnProperty || function(key) {
		return key in this;
	};
	function has(obj, key) {
		return hasOwn.call(obj, key);
	}
	function toStr(obj) {
		return objectToString.call(obj);
	}
	function nameOf(f) {
		if (f.name) return f.name;
		var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
		if (m) return m[1];
		return null;
	}
	function indexOf(xs, x) {
		if (xs.indexOf) return xs.indexOf(x);
		for (var i = 0, l = xs.length; i < l; i++) if (xs[i] === x) return i;
		return -1;
	}
	function isMap(x) {
		if (!mapSize || !x || typeof x !== "object") return false;
		try {
			mapSize.call(x);
			try {
				setSize.call(x);
			} catch (s) {
				return true;
			}
			return x instanceof Map;
		} catch (e) {}
		return false;
	}
	function isWeakMap(x) {
		if (!weakMapHas || !x || typeof x !== "object") return false;
		try {
			weakMapHas.call(x, weakMapHas);
			try {
				weakSetHas.call(x, weakSetHas);
			} catch (s) {
				return true;
			}
			return x instanceof WeakMap;
		} catch (e) {}
		return false;
	}
	function isWeakRef(x) {
		if (!weakRefDeref || !x || typeof x !== "object") return false;
		try {
			weakRefDeref.call(x);
			return true;
		} catch (e) {}
		return false;
	}
	function isSet(x) {
		if (!setSize || !x || typeof x !== "object") return false;
		try {
			setSize.call(x);
			try {
				mapSize.call(x);
			} catch (m) {
				return true;
			}
			return x instanceof Set;
		} catch (e) {}
		return false;
	}
	function isWeakSet(x) {
		if (!weakSetHas || !x || typeof x !== "object") return false;
		try {
			weakSetHas.call(x, weakSetHas);
			try {
				weakMapHas.call(x, weakMapHas);
			} catch (s) {
				return true;
			}
			return x instanceof WeakSet;
		} catch (e) {}
		return false;
	}
	function isElement(x) {
		if (!x || typeof x !== "object") return false;
		if (typeof HTMLElement !== "undefined" && x instanceof HTMLElement) return true;
		return typeof x.nodeName === "string" && typeof x.getAttribute === "function";
	}
	function inspectString(str, opts) {
		if (str.length > opts.maxStringLength) {
			var remaining = str.length - opts.maxStringLength;
			var trailer = "... " + remaining + " more character" + (remaining > 1 ? "s" : "");
			return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
		}
		var quoteRE = quoteREs[opts.quoteStyle || "single"];
		quoteRE.lastIndex = 0;
		return wrapQuotes($replace.call($replace.call(str, quoteRE, "\\$1"), /[\x00-\x1f]/g, lowbyte), "single", opts);
	}
	function lowbyte(c) {
		var n = c.charCodeAt(0);
		var x = {
			8: "b",
			9: "t",
			10: "n",
			12: "f",
			13: "r"
		}[n];
		if (x) return "\\" + x;
		return "\\x" + (n < 16 ? "0" : "") + $toUpperCase.call(n.toString(16));
	}
	function markBoxed(str) {
		return "Object(" + str + ")";
	}
	function weakCollectionOf(type) {
		return type + " { ? }";
	}
	function collectionOf(type, size, entries, indent) {
		var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ", ");
		return type + " (" + size + ") {" + joinedEntries + "}";
	}
	function singleLineValues(xs) {
		for (var i = 0; i < xs.length; i++) if (indexOf(xs[i], "\n") >= 0) return false;
		return true;
	}
	function getIndent(opts, depth) {
		var baseIndent;
		if (opts.indent === "	") baseIndent = "	";
		else if (typeof opts.indent === "number" && opts.indent > 0) baseIndent = $join.call(Array(opts.indent + 1), " ");
		else return null;
		return {
			base: baseIndent,
			prev: $join.call(Array(depth + 1), baseIndent)
		};
	}
	function indentedJoin(xs, indent) {
		if (xs.length === 0) return "";
		var lineJoiner = "\n" + indent.prev + indent.base;
		return lineJoiner + $join.call(xs, "," + lineJoiner) + "\n" + indent.prev;
	}
	function arrObjKeys(obj, inspect) {
		var isArr = isArray(obj);
		var xs = [];
		if (isArr) {
			xs.length = obj.length;
			for (var i = 0; i < obj.length; i++) xs[i] = has(obj, i) ? inspect(obj[i], obj) : "";
		}
		var syms = typeof gOPS === "function" ? gOPS(obj) : [];
		var symMap;
		if (hasShammedSymbols) {
			symMap = {};
			for (var k = 0; k < syms.length; k++) symMap["$" + syms[k]] = syms[k];
		}
		for (var key in obj) {
			if (!has(obj, key)) continue;
			if (isArr && String(Number(key)) === key && key < obj.length) continue;
			if (hasShammedSymbols && symMap["$" + key] instanceof Symbol) continue;
			else if ($test.call(/[^\w$]/, key)) xs.push(inspect(key, obj) + ": " + inspect(obj[key], obj));
			else xs.push(key + ": " + inspect(obj[key], obj));
		}
		if (typeof gOPS === "function") {
			for (var j = 0; j < syms.length; j++) if (isEnumerable.call(obj, syms[j])) xs.push("[" + inspect(syms[j]) + "]: " + inspect(obj[syms[j]], obj));
		}
		return xs;
	}
}));
//#endregion
//#region node_modules/side-channel-list/index.js
var require_side_channel_list = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var inspect = require_object_inspect();
	var $TypeError = require_type();
	/** @type {import('./list.d.ts').listGetNode} */
	var listGetNode = function(list, key, isDelete) {
		/** @type {typeof list | NonNullable<(typeof list)['next']>} */
		var prev = list;
		/** @type {(typeof list)['next']} */
		var curr;
		for (; (curr = prev.next) != null; prev = curr) if (curr.key === key) {
			prev.next = curr.next;
			if (!isDelete) {
				curr.next = list.next;
				list.next = curr;
			}
			return curr;
		}
	};
	/** @type {import('./list.d.ts').listGet} */
	var listGet = function(objects, key) {
		if (!objects) return;
		var node = listGetNode(objects, key);
		return node && node.value;
	};
	/** @type {import('./list.d.ts').listSet} */
	var listSet = function(objects, key, value) {
		var node = listGetNode(objects, key);
		if (node) node.value = value;
		else objects.next = {
			key,
			next: objects.next,
			value
		};
	};
	/** @type {import('./list.d.ts').listHas} */
	var listHas = function(objects, key) {
		if (!objects) return false;
		return !!listGetNode(objects, key);
	};
	/** @type {import('./list.d.ts').listDelete} */
	var listDelete = function(objects, key) {
		if (objects) return listGetNode(objects, key, true);
	};
	/** @type {import('.')} */
	module.exports = function getSideChannelList() {
		/** @typedef {ReturnType<typeof getSideChannelList>} Channel */
		/** @typedef {Parameters<Channel['get']>[0]} K */
		/** @typedef {Parameters<Channel['set']>[1]} V */
		/** @type {import('./list.d.ts').RootNode<V, K> | undefined} */ var $o;
		/** @type {Channel} */
		var channel = {
			assert: function(key) {
				if (!channel.has(key)) throw new $TypeError("Side channel does not contain " + inspect(key));
			},
			"delete": function(key) {
				var deletedNode = listDelete($o, key);
				if (deletedNode && $o && !$o.next) $o = void 0;
				return !!deletedNode;
			},
			get: function(key) {
				return listGet($o, key);
			},
			has: function(key) {
				return listHas($o, key);
			},
			set: function(key, value) {
				if (!$o) $o = { next: void 0 };
				listSet($o, key, value);
			}
		};
		return channel;
	};
}));
//#endregion
//#region node_modules/es-object-atoms/index.js
var require_es_object_atoms = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('.')} */
	module.exports = Object;
}));
//#endregion
//#region node_modules/es-errors/index.js
var require_es_errors = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('.')} */
	module.exports = Error;
}));
//#endregion
//#region node_modules/es-errors/eval.js
var require_eval = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./eval')} */
	module.exports = EvalError;
}));
//#endregion
//#region node_modules/es-errors/range.js
var require_range = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./range')} */
	module.exports = RangeError;
}));
//#endregion
//#region node_modules/es-errors/ref.js
var require_ref = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./ref')} */
	module.exports = ReferenceError;
}));
//#endregion
//#region node_modules/es-errors/syntax.js
var require_syntax = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./syntax')} */
	module.exports = SyntaxError;
}));
//#endregion
//#region node_modules/es-errors/uri.js
var require_uri = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./uri')} */
	module.exports = URIError;
}));
//#endregion
//#region node_modules/math-intrinsics/abs.js
var require_abs = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./abs')} */
	module.exports = Math.abs;
}));
//#endregion
//#region node_modules/math-intrinsics/floor.js
var require_floor = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./floor')} */
	module.exports = Math.floor;
}));
//#endregion
//#region node_modules/math-intrinsics/max.js
var require_max = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./max')} */
	module.exports = Math.max;
}));
//#endregion
//#region node_modules/math-intrinsics/min.js
var require_min = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./min')} */
	module.exports = Math.min;
}));
//#endregion
//#region node_modules/math-intrinsics/pow.js
var require_pow = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./pow')} */
	module.exports = Math.pow;
}));
//#endregion
//#region node_modules/math-intrinsics/round.js
var require_round = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./round')} */
	module.exports = Math.round;
}));
//#endregion
//#region node_modules/math-intrinsics/isNaN.js
var require_isNaN = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./isNaN')} */
	module.exports = Number.isNaN || function isNaN(a) {
		return a !== a;
	};
}));
//#endregion
//#region node_modules/math-intrinsics/sign.js
var require_sign = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $isNaN = require_isNaN();
	/** @type {import('./sign')} */
	module.exports = function sign(number) {
		if ($isNaN(number) || number === 0) return number;
		return number < 0 ? -1 : 1;
	};
}));
//#endregion
//#region node_modules/gopd/gOPD.js
var require_gOPD = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./gOPD')} */
	module.exports = Object.getOwnPropertyDescriptor;
}));
//#endregion
//#region node_modules/gopd/index.js
var require_gopd = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('.')} */
	var $gOPD = require_gOPD();
	if ($gOPD) try {
		$gOPD([], "length");
	} catch (e) {
		$gOPD = null;
	}
	module.exports = $gOPD;
}));
//#endregion
//#region node_modules/es-define-property/index.js
var require_es_define_property = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('.')} */
	var $defineProperty = Object.defineProperty || false;
	if ($defineProperty) try {
		$defineProperty({}, "a", { value: 1 });
	} catch (e) {
		$defineProperty = false;
	}
	module.exports = $defineProperty;
}));
//#endregion
//#region node_modules/has-symbols/shams.js
var require_shams = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./shams')} */
	module.exports = function hasSymbols() {
		if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") return false;
		if (typeof Symbol.iterator === "symbol") return true;
		/** @type {{ [k in symbol]?: unknown }} */
		var obj = {};
		var sym = Symbol("test");
		var symObj = Object(sym);
		if (typeof sym === "string") return false;
		if (Object.prototype.toString.call(sym) !== "[object Symbol]") return false;
		if (Object.prototype.toString.call(symObj) !== "[object Symbol]") return false;
		var symVal = 42;
		obj[sym] = symVal;
		for (var _ in obj) return false;
		if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) return false;
		if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) return false;
		var syms = Object.getOwnPropertySymbols(obj);
		if (syms.length !== 1 || syms[0] !== sym) return false;
		if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) return false;
		if (typeof Object.getOwnPropertyDescriptor === "function") {
			var descriptor = Object.getOwnPropertyDescriptor(obj, sym);
			if (descriptor.value !== symVal || descriptor.enumerable !== true) return false;
		}
		return true;
	};
}));
//#endregion
//#region node_modules/has-symbols/index.js
var require_has_symbols = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var origSymbol = typeof Symbol !== "undefined" && Symbol;
	var hasSymbolSham = require_shams();
	/** @type {import('.')} */
	module.exports = function hasNativeSymbols() {
		if (typeof origSymbol !== "function") return false;
		if (typeof Symbol !== "function") return false;
		if (typeof origSymbol("foo") !== "symbol") return false;
		if (typeof Symbol("bar") !== "symbol") return false;
		return hasSymbolSham();
	};
}));
//#endregion
//#region node_modules/get-proto/Reflect.getPrototypeOf.js
var require_Reflect_getPrototypeOf = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./Reflect.getPrototypeOf')} */
	module.exports = typeof Reflect !== "undefined" && Reflect.getPrototypeOf || null;
}));
//#endregion
//#region node_modules/get-proto/Object.getPrototypeOf.js
var require_Object_getPrototypeOf = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./Object.getPrototypeOf')} */
	module.exports = require_es_object_atoms().getPrototypeOf || null;
}));
//#endregion
//#region node_modules/function-bind/implementation.js
var require_implementation = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
	var toStr = Object.prototype.toString;
	var max = Math.max;
	var funcType = "[object Function]";
	var concatty = function concatty(a, b) {
		var arr = [];
		for (var i = 0; i < a.length; i += 1) arr[i] = a[i];
		for (var j = 0; j < b.length; j += 1) arr[j + a.length] = b[j];
		return arr;
	};
	var slicy = function slicy(arrLike, offset) {
		var arr = [];
		for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) arr[j] = arrLike[i];
		return arr;
	};
	var joiny = function(arr, joiner) {
		var str = "";
		for (var i = 0; i < arr.length; i += 1) {
			str += arr[i];
			if (i + 1 < arr.length) str += joiner;
		}
		return str;
	};
	module.exports = function bind(that) {
		var target = this;
		if (typeof target !== "function" || toStr.apply(target) !== funcType) throw new TypeError(ERROR_MESSAGE + target);
		var args = slicy(arguments, 1);
		var bound;
		var binder = function() {
			if (this instanceof bound) {
				var result = target.apply(this, concatty(args, arguments));
				if (Object(result) === result) return result;
				return this;
			}
			return target.apply(that, concatty(args, arguments));
		};
		var boundLength = max(0, target.length - args.length);
		var boundArgs = [];
		for (var i = 0; i < boundLength; i++) boundArgs[i] = "$" + i;
		bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
		if (target.prototype) {
			var Empty = function Empty() {};
			Empty.prototype = target.prototype;
			bound.prototype = new Empty();
			Empty.prototype = null;
		}
		return bound;
	};
}));
//#endregion
//#region node_modules/function-bind/index.js
var require_function_bind = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var implementation = require_implementation();
	module.exports = Function.prototype.bind || implementation;
}));
//#endregion
//#region node_modules/call-bind-apply-helpers/functionCall.js
var require_functionCall = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./functionCall')} */
	module.exports = Function.prototype.call;
}));
//#endregion
//#region node_modules/call-bind-apply-helpers/functionApply.js
var require_functionApply = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./functionApply')} */
	module.exports = Function.prototype.apply;
}));
//#endregion
//#region node_modules/call-bind-apply-helpers/reflectApply.js
var require_reflectApply = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	/** @type {import('./reflectApply')} */
	module.exports = typeof Reflect !== "undefined" && Reflect && Reflect.apply;
}));
//#endregion
//#region node_modules/call-bind-apply-helpers/actualApply.js
var require_actualApply = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var bind = require_function_bind();
	var $apply = require_functionApply();
	var $call = require_functionCall();
	/** @type {import('./actualApply')} */
	module.exports = require_reflectApply() || bind.call($call, $apply);
}));
//#endregion
//#region node_modules/call-bind-apply-helpers/index.js
var require_call_bind_apply_helpers = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var bind = require_function_bind();
	var $TypeError = require_type();
	var $call = require_functionCall();
	var $actualApply = require_actualApply();
	/** @type {(args: [Function, thisArg?: unknown, ...args: unknown[]]) => Function} TODO FIXME, find a way to use import('.') */
	module.exports = function callBindBasic(args) {
		if (args.length < 1 || typeof args[0] !== "function") throw new $TypeError("a function is required");
		return $actualApply(bind, $call, args);
	};
}));
//#endregion
//#region node_modules/dunder-proto/get.js
var require_get = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var callBind = require_call_bind_apply_helpers();
	var gOPD = require_gopd();
	var hasProtoAccessor;
	try {
		hasProtoAccessor = [].__proto__ === Array.prototype;
	} catch (e) {
		if (!e || typeof e !== "object" || !("code" in e) || e.code !== "ERR_PROTO_ACCESS") throw e;
	}
	var desc = !!hasProtoAccessor && gOPD && gOPD(Object.prototype, "__proto__");
	var $Object = Object;
	var $getPrototypeOf = $Object.getPrototypeOf;
	/** @type {import('./get')} */
	module.exports = desc && typeof desc.get === "function" ? callBind([desc.get]) : typeof $getPrototypeOf === "function" ? function getDunder(value) {
		return $getPrototypeOf(value == null ? value : $Object(value));
	} : false;
}));
//#endregion
//#region node_modules/get-proto/index.js
var require_get_proto = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var reflectGetProto = require_Reflect_getPrototypeOf();
	var originalGetProto = require_Object_getPrototypeOf();
	var getDunderProto = require_get();
	/** @type {import('.')} */
	module.exports = reflectGetProto ? function getProto(O) {
		return reflectGetProto(O);
	} : originalGetProto ? function getProto(O) {
		if (!O || typeof O !== "object" && typeof O !== "function") throw new TypeError("getProto: not an object");
		return originalGetProto(O);
	} : getDunderProto ? function getProto(O) {
		return getDunderProto(O);
	} : null;
}));
//#endregion
//#region node_modules/hasown/index.js
var require_hasown = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var call = Function.prototype.call;
	var $hasOwn = Object.prototype.hasOwnProperty;
	/** @type {import('.')} */
	module.exports = require_function_bind().call(call, $hasOwn);
}));
//#endregion
//#region node_modules/get-intrinsic/index.js
var require_get_intrinsic = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var undefined;
	var $Object = require_es_object_atoms();
	var $Error = require_es_errors();
	var $EvalError = require_eval();
	var $RangeError = require_range();
	var $ReferenceError = require_ref();
	var $SyntaxError = require_syntax();
	var $TypeError = require_type();
	var $URIError = require_uri();
	var abs = require_abs();
	var floor = require_floor();
	var max = require_max();
	var min = require_min();
	var pow = require_pow();
	var round = require_round();
	var sign = require_sign();
	var $Function = Function;
	var getEvalledConstructor = function(expressionSyntax) {
		try {
			return $Function("\"use strict\"; return (" + expressionSyntax + ").constructor;")();
		} catch (e) {}
	};
	var $gOPD = require_gopd();
	var $defineProperty = require_es_define_property();
	var throwTypeError = function() {
		throw new $TypeError();
	};
	var ThrowTypeError = $gOPD ? function() {
		try {
			arguments.callee;
			return throwTypeError;
		} catch (calleeThrows) {
			try {
				return $gOPD(arguments, "callee").get;
			} catch (gOPDthrows) {
				return throwTypeError;
			}
		}
	}() : throwTypeError;
	var hasSymbols = require_has_symbols()();
	var getProto = require_get_proto();
	var $ObjectGPO = require_Object_getPrototypeOf();
	var $ReflectGPO = require_Reflect_getPrototypeOf();
	var $apply = require_functionApply();
	var $call = require_functionCall();
	var needsEval = {};
	var TypedArray = typeof Uint8Array === "undefined" || !getProto ? undefined : getProto(Uint8Array);
	var INTRINSICS = {
		__proto__: null,
		"%AggregateError%": typeof AggregateError === "undefined" ? undefined : AggregateError,
		"%Array%": Array,
		"%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined : ArrayBuffer,
		"%ArrayIteratorPrototype%": hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined,
		"%AsyncFromSyncIteratorPrototype%": undefined,
		"%AsyncFunction%": needsEval,
		"%AsyncGenerator%": needsEval,
		"%AsyncGeneratorFunction%": needsEval,
		"%AsyncIteratorPrototype%": needsEval,
		"%Atomics%": typeof Atomics === "undefined" ? undefined : Atomics,
		"%BigInt%": typeof BigInt === "undefined" ? undefined : BigInt,
		"%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined : BigInt64Array,
		"%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined : BigUint64Array,
		"%Boolean%": Boolean,
		"%DataView%": typeof DataView === "undefined" ? undefined : DataView,
		"%Date%": Date,
		"%decodeURI%": decodeURI,
		"%decodeURIComponent%": decodeURIComponent,
		"%encodeURI%": encodeURI,
		"%encodeURIComponent%": encodeURIComponent,
		"%Error%": $Error,
		"%eval%": eval,
		"%EvalError%": $EvalError,
		"%Float16Array%": typeof Float16Array === "undefined" ? undefined : Float16Array,
		"%Float32Array%": typeof Float32Array === "undefined" ? undefined : Float32Array,
		"%Float64Array%": typeof Float64Array === "undefined" ? undefined : Float64Array,
		"%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined : FinalizationRegistry,
		"%Function%": $Function,
		"%GeneratorFunction%": needsEval,
		"%Int8Array%": typeof Int8Array === "undefined" ? undefined : Int8Array,
		"%Int16Array%": typeof Int16Array === "undefined" ? undefined : Int16Array,
		"%Int32Array%": typeof Int32Array === "undefined" ? undefined : Int32Array,
		"%isFinite%": isFinite,
		"%isNaN%": isNaN,
		"%IteratorPrototype%": hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined,
		"%JSON%": typeof JSON === "object" ? JSON : undefined,
		"%Map%": typeof Map === "undefined" ? undefined : Map,
		"%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols || !getProto ? undefined : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
		"%Math%": Math,
		"%Number%": Number,
		"%Object%": $Object,
		"%Object.getOwnPropertyDescriptor%": $gOPD,
		"%parseFloat%": parseFloat,
		"%parseInt%": parseInt,
		"%Promise%": typeof Promise === "undefined" ? undefined : Promise,
		"%Proxy%": typeof Proxy === "undefined" ? undefined : Proxy,
		"%RangeError%": $RangeError,
		"%ReferenceError%": $ReferenceError,
		"%Reflect%": typeof Reflect === "undefined" ? undefined : Reflect,
		"%RegExp%": RegExp,
		"%Set%": typeof Set === "undefined" ? undefined : Set,
		"%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols || !getProto ? undefined : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
		"%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined : SharedArrayBuffer,
		"%String%": String,
		"%StringIteratorPrototype%": hasSymbols && getProto ? getProto(""[Symbol.iterator]()) : undefined,
		"%Symbol%": hasSymbols ? Symbol : undefined,
		"%SyntaxError%": $SyntaxError,
		"%ThrowTypeError%": ThrowTypeError,
		"%TypedArray%": TypedArray,
		"%TypeError%": $TypeError,
		"%Uint8Array%": typeof Uint8Array === "undefined" ? undefined : Uint8Array,
		"%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined : Uint8ClampedArray,
		"%Uint16Array%": typeof Uint16Array === "undefined" ? undefined : Uint16Array,
		"%Uint32Array%": typeof Uint32Array === "undefined" ? undefined : Uint32Array,
		"%URIError%": $URIError,
		"%WeakMap%": typeof WeakMap === "undefined" ? undefined : WeakMap,
		"%WeakRef%": typeof WeakRef === "undefined" ? undefined : WeakRef,
		"%WeakSet%": typeof WeakSet === "undefined" ? undefined : WeakSet,
		"%Function.prototype.call%": $call,
		"%Function.prototype.apply%": $apply,
		"%Object.defineProperty%": $defineProperty,
		"%Object.getPrototypeOf%": $ObjectGPO,
		"%Math.abs%": abs,
		"%Math.floor%": floor,
		"%Math.max%": max,
		"%Math.min%": min,
		"%Math.pow%": pow,
		"%Math.round%": round,
		"%Math.sign%": sign,
		"%Reflect.getPrototypeOf%": $ReflectGPO
	};
	if (getProto) try {
		null.error;
	} catch (e) {
		INTRINSICS["%Error.prototype%"] = getProto(getProto(e));
	}
	var doEval = function doEval(name) {
		var value;
		if (name === "%AsyncFunction%") value = getEvalledConstructor("async function () {}");
		else if (name === "%GeneratorFunction%") value = getEvalledConstructor("function* () {}");
		else if (name === "%AsyncGeneratorFunction%") value = getEvalledConstructor("async function* () {}");
		else if (name === "%AsyncGenerator%") {
			var fn = doEval("%AsyncGeneratorFunction%");
			if (fn) value = fn.prototype;
		} else if (name === "%AsyncIteratorPrototype%") {
			var gen = doEval("%AsyncGenerator%");
			if (gen && getProto) value = getProto(gen.prototype);
		}
		INTRINSICS[name] = value;
		return value;
	};
	var LEGACY_ALIASES = {
		__proto__: null,
		"%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
		"%ArrayPrototype%": ["Array", "prototype"],
		"%ArrayProto_entries%": [
			"Array",
			"prototype",
			"entries"
		],
		"%ArrayProto_forEach%": [
			"Array",
			"prototype",
			"forEach"
		],
		"%ArrayProto_keys%": [
			"Array",
			"prototype",
			"keys"
		],
		"%ArrayProto_values%": [
			"Array",
			"prototype",
			"values"
		],
		"%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
		"%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
		"%AsyncGeneratorPrototype%": [
			"AsyncGeneratorFunction",
			"prototype",
			"prototype"
		],
		"%BooleanPrototype%": ["Boolean", "prototype"],
		"%DataViewPrototype%": ["DataView", "prototype"],
		"%DatePrototype%": ["Date", "prototype"],
		"%ErrorPrototype%": ["Error", "prototype"],
		"%EvalErrorPrototype%": ["EvalError", "prototype"],
		"%Float32ArrayPrototype%": ["Float32Array", "prototype"],
		"%Float64ArrayPrototype%": ["Float64Array", "prototype"],
		"%FunctionPrototype%": ["Function", "prototype"],
		"%Generator%": ["GeneratorFunction", "prototype"],
		"%GeneratorPrototype%": [
			"GeneratorFunction",
			"prototype",
			"prototype"
		],
		"%Int8ArrayPrototype%": ["Int8Array", "prototype"],
		"%Int16ArrayPrototype%": ["Int16Array", "prototype"],
		"%Int32ArrayPrototype%": ["Int32Array", "prototype"],
		"%JSONParse%": ["JSON", "parse"],
		"%JSONStringify%": ["JSON", "stringify"],
		"%MapPrototype%": ["Map", "prototype"],
		"%NumberPrototype%": ["Number", "prototype"],
		"%ObjectPrototype%": ["Object", "prototype"],
		"%ObjProto_toString%": [
			"Object",
			"prototype",
			"toString"
		],
		"%ObjProto_valueOf%": [
			"Object",
			"prototype",
			"valueOf"
		],
		"%PromisePrototype%": ["Promise", "prototype"],
		"%PromiseProto_then%": [
			"Promise",
			"prototype",
			"then"
		],
		"%Promise_all%": ["Promise", "all"],
		"%Promise_reject%": ["Promise", "reject"],
		"%Promise_resolve%": ["Promise", "resolve"],
		"%RangeErrorPrototype%": ["RangeError", "prototype"],
		"%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
		"%RegExpPrototype%": ["RegExp", "prototype"],
		"%SetPrototype%": ["Set", "prototype"],
		"%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
		"%StringPrototype%": ["String", "prototype"],
		"%SymbolPrototype%": ["Symbol", "prototype"],
		"%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
		"%TypedArrayPrototype%": ["TypedArray", "prototype"],
		"%TypeErrorPrototype%": ["TypeError", "prototype"],
		"%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
		"%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
		"%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
		"%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
		"%URIErrorPrototype%": ["URIError", "prototype"],
		"%WeakMapPrototype%": ["WeakMap", "prototype"],
		"%WeakSetPrototype%": ["WeakSet", "prototype"]
	};
	var bind = require_function_bind();
	var hasOwn = require_hasown();
	var $concat = bind.call($call, Array.prototype.concat);
	var $spliceApply = bind.call($apply, Array.prototype.splice);
	var $replace = bind.call($call, String.prototype.replace);
	var $strSlice = bind.call($call, String.prototype.slice);
	var $exec = bind.call($call, RegExp.prototype.exec);
	var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
	var reEscapeChar = /\\(\\)?/g;
	var stringToPath = function stringToPath(string) {
		var first = $strSlice(string, 0, 1);
		var last = $strSlice(string, -1);
		if (first === "%" && last !== "%") throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
		else if (last === "%" && first !== "%") throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
		var result = [];
		$replace(string, rePropName, function(match, number, quote, subString) {
			result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
		});
		return result;
	};
	var getBaseIntrinsic = function getBaseIntrinsic(name, allowMissing) {
		var intrinsicName = name;
		var alias;
		if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
			alias = LEGACY_ALIASES[intrinsicName];
			intrinsicName = "%" + alias[0] + "%";
		}
		if (hasOwn(INTRINSICS, intrinsicName)) {
			var value = INTRINSICS[intrinsicName];
			if (value === needsEval) value = doEval(intrinsicName);
			if (typeof value === "undefined" && !allowMissing) throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
			return {
				alias,
				name: intrinsicName,
				value
			};
		}
		throw new $SyntaxError("intrinsic " + name + " does not exist!");
	};
	module.exports = function GetIntrinsic(name, allowMissing) {
		if (typeof name !== "string" || name.length === 0) throw new $TypeError("intrinsic name must be a non-empty string");
		if (arguments.length > 1 && typeof allowMissing !== "boolean") throw new $TypeError("\"allowMissing\" argument must be a boolean");
		if ($exec(/^%?[^%]*%?$/, name) === null) throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
		var parts = stringToPath(name);
		var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
		var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
		var intrinsicRealName = intrinsic.name;
		var value = intrinsic.value;
		var skipFurtherCaching = false;
		var alias = intrinsic.alias;
		if (alias) {
			intrinsicBaseName = alias[0];
			$spliceApply(parts, $concat([0, 1], alias));
		}
		for (var i = 1, isOwn = true; i < parts.length; i += 1) {
			var part = parts[i];
			var first = $strSlice(part, 0, 1);
			var last = $strSlice(part, -1);
			if ((first === "\"" || first === "'" || first === "`" || last === "\"" || last === "'" || last === "`") && first !== last) throw new $SyntaxError("property names with quotes must have matching quotes");
			if (part === "constructor" || !isOwn) skipFurtherCaching = true;
			intrinsicBaseName += "." + part;
			intrinsicRealName = "%" + intrinsicBaseName + "%";
			if (hasOwn(INTRINSICS, intrinsicRealName)) value = INTRINSICS[intrinsicRealName];
			else if (value != null) {
				if (!(part in value)) {
					if (!allowMissing) throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
					return;
				}
				if ($gOPD && i + 1 >= parts.length) {
					var desc = $gOPD(value, part);
					isOwn = !!desc;
					if (isOwn && "get" in desc && !("originalValue" in desc.get)) value = desc.get;
					else value = value[part];
				} else {
					isOwn = hasOwn(value, part);
					value = value[part];
				}
				if (isOwn && !skipFurtherCaching) INTRINSICS[intrinsicRealName] = value;
			}
		}
		return value;
	};
}));
//#endregion
//#region node_modules/call-bound/index.js
var require_call_bound = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var GetIntrinsic = require_get_intrinsic();
	var callBindBasic = require_call_bind_apply_helpers();
	/** @type {(thisArg: string, searchString: string, position?: number) => number} */
	var $indexOf = callBindBasic([GetIntrinsic("%String.prototype.indexOf%")]);
	/** @type {import('.')} */
	module.exports = function callBoundIntrinsic(name, allowMissing) {
		var intrinsic = GetIntrinsic(name, !!allowMissing);
		if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) return callBindBasic([intrinsic]);
		return intrinsic;
	};
}));
//#endregion
//#region node_modules/side-channel-map/index.js
var require_side_channel_map = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var GetIntrinsic = require_get_intrinsic();
	var callBound = require_call_bound();
	var inspect = require_object_inspect();
	var $TypeError = require_type();
	var $Map = GetIntrinsic("%Map%", true);
	/** @type {<K, V>(thisArg: Map<K, V>, key: K) => V} */
	var $mapGet = callBound("Map.prototype.get", true);
	/** @type {<K, V>(thisArg: Map<K, V>, key: K, value: V) => void} */
	var $mapSet = callBound("Map.prototype.set", true);
	/** @type {<K, V>(thisArg: Map<K, V>, key: K) => boolean} */
	var $mapHas = callBound("Map.prototype.has", true);
	/** @type {<K, V>(thisArg: Map<K, V>, key: K) => boolean} */
	var $mapDelete = callBound("Map.prototype.delete", true);
	/** @type {<K, V>(thisArg: Map<K, V>) => number} */
	var $mapSize = callBound("Map.prototype.size", true);
	/** @type {import('.')} */
	module.exports = !!$Map && function getSideChannelMap() {
		/** @typedef {ReturnType<typeof getSideChannelMap>} Channel */
		/** @typedef {Parameters<Channel['get']>[0]} K */
		/** @typedef {Parameters<Channel['set']>[1]} V */
		/** @type {Map<K, V> | undefined} */ var $m;
		/** @type {Channel} */
		var channel = {
			assert: function(key) {
				if (!channel.has(key)) throw new $TypeError("Side channel does not contain " + inspect(key));
			},
			"delete": function(key) {
				if ($m) {
					var result = $mapDelete($m, key);
					if ($mapSize($m) === 0) $m = void 0;
					return result;
				}
				return false;
			},
			get: function(key) {
				if ($m) return $mapGet($m, key);
			},
			has: function(key) {
				if ($m) return $mapHas($m, key);
				return false;
			},
			set: function(key, value) {
				if (!$m) $m = new $Map();
				$mapSet($m, key, value);
			}
		};
		return channel;
	};
}));
//#endregion
//#region node_modules/side-channel-weakmap/index.js
var require_side_channel_weakmap = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var GetIntrinsic = require_get_intrinsic();
	var callBound = require_call_bound();
	var inspect = require_object_inspect();
	var getSideChannelMap = require_side_channel_map();
	var $TypeError = require_type();
	var $WeakMap = GetIntrinsic("%WeakMap%", true);
	/** @type {<K extends object, V>(thisArg: WeakMap<K, V>, key: K) => V} */
	var $weakMapGet = callBound("WeakMap.prototype.get", true);
	/** @type {<K extends object, V>(thisArg: WeakMap<K, V>, key: K, value: V) => void} */
	var $weakMapSet = callBound("WeakMap.prototype.set", true);
	/** @type {<K extends object, V>(thisArg: WeakMap<K, V>, key: K) => boolean} */
	var $weakMapHas = callBound("WeakMap.prototype.has", true);
	/** @type {<K extends object, V>(thisArg: WeakMap<K, V>, key: K) => boolean} */
	var $weakMapDelete = callBound("WeakMap.prototype.delete", true);
	/** @type {import('.')} */
	module.exports = $WeakMap ? function getSideChannelWeakMap() {
		/** @typedef {ReturnType<typeof getSideChannelWeakMap>} Channel */
		/** @typedef {Parameters<Channel['get']>[0]} K */
		/** @typedef {Parameters<Channel['set']>[1]} V */
		/** @type {WeakMap<K & object, V> | undefined} */ var $wm;
		/** @type {Channel | undefined} */ var $m;
		/** @type {Channel} */
		var channel = {
			assert: function(key) {
				if (!channel.has(key)) throw new $TypeError("Side channel does not contain " + inspect(key));
			},
			"delete": function(key) {
				if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
					if ($wm) return $weakMapDelete($wm, key);
				} else if (getSideChannelMap) {
					if ($m) return $m["delete"](key);
				}
				return false;
			},
			get: function(key) {
				if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
					if ($wm) return $weakMapGet($wm, key);
				}
				return $m && $m.get(key);
			},
			has: function(key) {
				if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
					if ($wm) return $weakMapHas($wm, key);
				}
				return !!$m && $m.has(key);
			},
			set: function(key, value) {
				if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
					if (!$wm) $wm = new $WeakMap();
					$weakMapSet($wm, key, value);
				} else if (getSideChannelMap) {
					if (!$m) $m = getSideChannelMap();
					/** @type {NonNullable<typeof $m>} */ $m.set(key, value);
				}
			}
		};
		return channel;
	} : getSideChannelMap;
}));
//#endregion
//#region node_modules/side-channel/index.js
var require_side_channel = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var $TypeError = require_type();
	var inspect = require_object_inspect();
	var getSideChannelList = require_side_channel_list();
	var getSideChannelMap = require_side_channel_map();
	var makeChannel = require_side_channel_weakmap() || getSideChannelMap || getSideChannelList;
	/** @type {import('.')} */
	module.exports = function getSideChannel() {
		/** @typedef {ReturnType<typeof getSideChannel>} Channel */
		/** @type {Channel | undefined} */ var $channelData;
		/** @type {Channel} */
		var channel = {
			assert: function(key) {
				if (!channel.has(key)) throw new $TypeError("Side channel does not contain " + (key && Object(key) === key ? "the given object key" : inspect(key)));
			},
			"delete": function(key) {
				return !!$channelData && $channelData["delete"](key);
			},
			get: function(key) {
				return $channelData && $channelData.get(key);
			},
			has: function(key) {
				return !!$channelData && $channelData.has(key);
			},
			set: function(key, value) {
				if (!$channelData) $channelData = makeChannel();
				$channelData.set(key, value);
			}
		};
		return channel;
	};
}));
//#endregion
//#region node_modules/qs/lib/formats.js
var require_formats = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var replace = String.prototype.replace;
	var percentTwenties = /%20/g;
	var Format = {
		RFC1738: "RFC1738",
		RFC3986: "RFC3986"
	};
	module.exports = {
		"default": Format.RFC3986,
		formatters: {
			RFC1738: function(value) {
				return replace.call(value, percentTwenties, "+");
			},
			RFC3986: function(value) {
				return String(value);
			}
		},
		RFC1738: Format.RFC1738,
		RFC3986: Format.RFC3986
	};
}));
//#endregion
//#region node_modules/qs/lib/utils.js
var require_utils = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var formats = require_formats();
	var getSideChannel = require_side_channel();
	var defineProperty = require_es_define_property();
	var has = Object.prototype.hasOwnProperty;
	var isArray = Array.isArray;
	var overflowChannel = getSideChannel();
	var markOverflow = function markOverflow(obj, maxIndex) {
		overflowChannel.set(obj, maxIndex);
		return obj;
	};
	var isOverflow = function isOverflow(obj) {
		return overflowChannel.has(obj);
	};
	var getMaxIndex = function getMaxIndex(obj) {
		return overflowChannel.get(obj);
	};
	var setMaxIndex = function setMaxIndex(obj, maxIndex) {
		overflowChannel.set(obj, maxIndex);
	};
	var hexTable = function() {
		var array = [];
		for (var i = 0; i < 256; ++i) array[array.length] = "%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase();
		return array;
	}();
	var compactQueue = function compactQueue(queue) {
		while (queue.length > 1) {
			var item = queue.pop();
			var obj = item.obj[item.prop];
			if (isArray(obj)) {
				var compacted = [];
				for (var j = 0; j < obj.length; ++j) if (typeof obj[j] !== "undefined") compacted[compacted.length] = obj[j];
				item.obj[item.prop] = compacted;
			}
		}
	};
	var arrayToObject = function arrayToObject(source, options) {
		var obj = options && options.plainObjects ? { __proto__: null } : {};
		for (var i = 0; i < source.length; ++i) if (typeof source[i] !== "undefined") obj[i] = source[i];
		return obj;
	};
	var setProperty = function setProperty(obj, key, value) {
		if (key === "__proto__" && defineProperty) defineProperty(obj, key, {
			configurable: true,
			enumerable: true,
			value,
			writable: true
		});
		else obj[key] = value;
	};
	var merge = function merge(target, source, options) {
		if (!source) return target;
		if (typeof source !== "object" && typeof source !== "function") {
			if (isArray(target)) {
				var nextIndex = target.length;
				if (options && typeof options.arrayLimit === "number" && nextIndex >= options.arrayLimit) {
					if (options.throwOnLimitExceeded) throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
					return markOverflow(arrayToObject(target.concat(source), options), nextIndex);
				}
				target[nextIndex] = source;
			} else if (target && typeof target === "object") {
				if (isOverflow(target)) {
					var newIndex = getMaxIndex(target) + 1;
					target[newIndex] = source;
					setMaxIndex(target, newIndex);
				} else if (options && options.strictMerge) return [target, source];
				else if (options && (options.plainObjects || options.allowPrototypes) || !has.call(Object.prototype, source)) target[source] = true;
			} else return [target, source];
			return target;
		}
		if (!target || typeof target !== "object") {
			if (isOverflow(source)) {
				var sourceKeys = Object.keys(source);
				var result = options && options.plainObjects ? {
					__proto__: null,
					0: target
				} : { 0: target };
				for (var m = 0; m < sourceKeys.length; m++) {
					var oldKey = parseInt(sourceKeys[m], 10);
					result[oldKey + 1] = source[sourceKeys[m]];
				}
				return markOverflow(result, getMaxIndex(source) + 1);
			}
			var combined = [target].concat(source);
			if (options && typeof options.arrayLimit === "number" && combined.length > options.arrayLimit) {
				if (options.throwOnLimitExceeded) throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
				return markOverflow(arrayToObject(combined, options), combined.length - 1);
			}
			return combined;
		}
		var mergeTarget = target;
		if (isArray(target) && !isArray(source)) mergeTarget = arrayToObject(target, options);
		if (isArray(target) && isArray(source)) {
			source.forEach(function(item, i) {
				if (has.call(target, i)) {
					var targetItem = target[i];
					if (targetItem && typeof targetItem === "object" && item && typeof item === "object") target[i] = merge(targetItem, item, options);
					else target[target.length] = item;
				} else target[i] = item;
			});
			if (options && typeof options.arrayLimit === "number" && target.length > options.arrayLimit) {
				if (options.throwOnLimitExceeded) throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
				return markOverflow(arrayToObject(target, options), target.length - 1);
			}
			return target;
		}
		return Object.keys(source).reduce(function(acc, key) {
			var value = source[key];
			if (has.call(acc, key)) setProperty(acc, key, merge(acc[key], value, options));
			else setProperty(acc, key, value);
			if (isOverflow(source) && !isOverflow(acc)) markOverflow(acc, getMaxIndex(source));
			if (isOverflow(acc)) {
				var keyNum = parseInt(key, 10);
				if (String(keyNum) === key && keyNum >= 0 && keyNum > getMaxIndex(acc)) setMaxIndex(acc, keyNum);
			}
			return acc;
		}, mergeTarget);
	};
	var assign = function assignSingleSource(target, source) {
		return Object.keys(source).reduce(function(acc, key) {
			setProperty(acc, key, source[key]);
			return acc;
		}, target);
	};
	var decode = function(str, defaultDecoder, charset) {
		var strWithoutPlus = str.replace(/\+/g, " ");
		if (charset === "iso-8859-1") return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
		try {
			return decodeURIComponent(strWithoutPlus);
		} catch (e) {
			return strWithoutPlus;
		}
	};
	var limit = 1024;
	module.exports = {
		arrayToObject,
		assign,
		combine: function combine(a, b, arrayLimit, plainObjects, throwOnLimitExceeded) {
			if (isOverflow(a)) {
				if (throwOnLimitExceeded) throw new RangeError("Array limit exceeded. Only " + arrayLimit + " element" + (arrayLimit === 1 ? "" : "s") + " allowed in an array.");
				var bValues = isArray(b) ? b : [b];
				var newIndex = getMaxIndex(a);
				for (var i = 0; i < bValues.length; ++i) {
					newIndex += 1;
					a[newIndex] = bValues[i];
				}
				setMaxIndex(a, newIndex);
				return a;
			}
			var result = [].concat(a, b);
			if (result.length > arrayLimit) {
				if (throwOnLimitExceeded) throw new RangeError("Array limit exceeded. Only " + arrayLimit + " element" + (arrayLimit === 1 ? "" : "s") + " allowed in an array.");
				return markOverflow(arrayToObject(result, { plainObjects }), result.length - 1);
			}
			return result;
		},
		compact: function compact(value) {
			var queue = [{
				obj: { o: value },
				prop: "o"
			}];
			var refs = getSideChannel();
			for (var i = 0; i < queue.length; ++i) {
				var item = queue[i];
				var obj = item.obj[item.prop];
				var keys = Object.keys(obj);
				for (var j = 0; j < keys.length; ++j) {
					var key = keys[j];
					var val = obj[key];
					if (typeof val === "object" && val !== null && !refs.has(val)) {
						queue[queue.length] = {
							obj,
							prop: key
						};
						refs.set(val, true);
					}
				}
			}
			compactQueue(queue);
			return value;
		},
		decode,
		encode: function encode(str, defaultEncoder, charset, kind, format) {
			if (str.length === 0) return str;
			var string = str;
			if (typeof str === "symbol") string = Symbol.prototype.toString.call(str);
			else if (typeof str !== "string") string = String(str);
			if (charset === "iso-8859-1") return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
				return "%26%23" + parseInt($0.slice(2), 16) + "%3B";
			});
			var out = "";
			for (var j = 0; j < string.length; j += limit) {
				var segment = string.length >= limit ? string.slice(j, j + limit) : string;
				if (j + limit < string.length) {
					var last = segment.charCodeAt(segment.length - 1);
					if (last >= 55296 && last <= 56319) {
						segment = segment.slice(0, -1);
						j -= 1;
					}
				}
				var arr = [];
				for (var i = 0; i < segment.length; ++i) {
					var c = segment.charCodeAt(i);
					if (c === 45 || c === 46 || c === 95 || c === 126 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || format === formats.RFC1738 && (c === 40 || c === 41)) {
						arr[arr.length] = segment.charAt(i);
						continue;
					}
					if (c < 128) {
						arr[arr.length] = hexTable[c];
						continue;
					}
					if (c < 2048) {
						arr[arr.length] = hexTable[192 | c >> 6] + hexTable[128 | c & 63];
						continue;
					}
					if (c < 55296 || c >= 57344) {
						arr[arr.length] = hexTable[224 | c >> 12] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
						continue;
					}
					i += 1;
					c = 65536 + ((c & 1023) << 10 | segment.charCodeAt(i) & 1023);
					arr[arr.length] = hexTable[240 | c >> 18] + hexTable[128 | c >> 12 & 63] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
				}
				out += arr.join("");
			}
			return out;
		},
		isBuffer: function isBuffer(obj) {
			if (!obj || typeof obj !== "object") return false;
			return !!(obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj));
		},
		isOverflow,
		isRegExp: function isRegExp(obj) {
			return Object.prototype.toString.call(obj) === "[object RegExp]";
		},
		markOverflow,
		maybeMap: function maybeMap(val, fn) {
			if (isArray(val)) {
				var mapped = [];
				for (var i = 0; i < val.length; i += 1) mapped[mapped.length] = fn(val[i]);
				return mapped;
			}
			return fn(val);
		},
		merge
	};
}));
//#endregion
//#region node_modules/qs/lib/stringify.js
var require_stringify = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var getSideChannel = require_side_channel();
	var utils = require_utils();
	var formats = require_formats();
	var has = Object.prototype.hasOwnProperty;
	var arrayPrefixGenerators = {
		brackets: function brackets(prefix) {
			return prefix + "[]";
		},
		comma: "comma",
		indices: function indices(prefix, key) {
			return prefix + "[" + key + "]";
		},
		repeat: function repeat(prefix) {
			return prefix;
		}
	};
	var isArray = Array.isArray;
	var push = Array.prototype.push;
	var pushToArray = function(arr, valueOrArray) {
		push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
	};
	var toISO = Date.prototype.toISOString;
	var defaultFormat = formats["default"];
	var defaults = {
		addQueryPrefix: false,
		allowDots: false,
		allowEmptyArrays: false,
		arrayFormat: "indices",
		charset: "utf-8",
		charsetSentinel: false,
		commaRoundTrip: false,
		delimiter: "&",
		depth: Infinity,
		encode: true,
		encodeDotInKeys: false,
		encoder: utils.encode,
		encodeValuesOnly: false,
		filter: void 0,
		format: defaultFormat,
		formatter: formats.formatters[defaultFormat],
		indices: false,
		serializeDate: function serializeDate(date) {
			return toISO.call(date);
		},
		skipNulls: false,
		strictNullHandling: false
	};
	var isNonNullishPrimitive = function isNonNullishPrimitive(v) {
		return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
	};
	var sentinel = {};
	var stringify = function stringify(object, prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel, depth, currentDepth) {
		var obj = object;
		if (currentDepth > depth) throw new RangeError("Input depth exceeded depth option of " + depth);
		var tmpSc = sideChannel;
		var step = 0;
		var findFlag = false;
		while ((tmpSc = tmpSc.get(sentinel)) !== void 0 && !findFlag) {
			var pos = tmpSc.get(object);
			step += 1;
			if (typeof pos !== "undefined") {
				if (pos === step) throw new RangeError("Cyclic object value");
				else findFlag = true;
			}
			if (typeof tmpSc.get(sentinel) === "undefined") step = 0;
		}
		obj = typeof filter === "function" ? filter(prefix, obj) : obj;
		if (obj instanceof Date) obj = serializeDate(obj);
		else if (generateArrayPrefix === "comma" && isArray(obj)) obj = utils.maybeMap(obj, function(value) {
			if (value instanceof Date) return serializeDate(value);
			return value;
		});
		if (obj === null) {
			if (strictNullHandling) return formatter(encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, "key", format) : prefix);
			obj = "";
		}
		if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
			if (encoder) return [formatter(encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, "key", format)) + "=" + formatter(encoder(obj, defaults.encoder, charset, "value", format))];
			return [formatter(prefix) + "=" + formatter(String(obj))];
		}
		var values = [];
		if (typeof obj === "undefined") return values;
		var objKeys;
		if (generateArrayPrefix === "comma" && isArray(obj)) {
			if (encodeValuesOnly && encoder) obj = utils.maybeMap(obj, function(v) {
				return v == null ? v : encoder(v);
			});
			objKeys = [{ value: obj.length > 0 ? obj.join(",") || null : void 0 }];
		} else if (isArray(filter)) objKeys = filter;
		else {
			var keys = Object.keys(obj);
			objKeys = sort ? keys.sort(sort) : keys;
		}
		var encodedPrefix = encodeDotInKeys ? String(prefix).replace(/\./g, "%2E") : String(prefix);
		var adjustedPrefix = commaRoundTrip && isArray(obj) && obj.length === 1 ? encodedPrefix + "[]" : encodedPrefix;
		if (allowEmptyArrays && isArray(obj) && obj.length === 0 && Object.keys(obj).length === 0) return adjustedPrefix + "[]";
		for (var j = 0; j < objKeys.length; ++j) {
			var key = objKeys[j];
			var value = typeof key === "object" && key && typeof key.value !== "undefined" ? key.value : obj[key];
			if (skipNulls && value === null) continue;
			var encodedKey = allowDots && encodeDotInKeys ? String(key).replace(/\./g, "%2E") : String(key);
			var keyPrefix = isArray(obj) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjustedPrefix, encodedKey) : adjustedPrefix : adjustedPrefix + (allowDots ? "." + encodedKey : "[" + encodedKey + "]");
			sideChannel.set(object, step);
			var valueSideChannel = getSideChannel();
			valueSideChannel.set(sentinel, sideChannel);
			pushToArray(values, stringify(value, keyPrefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, generateArrayPrefix === "comma" && encodeValuesOnly && isArray(obj) ? null : encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, valueSideChannel, depth, currentDepth + 1));
		}
		return values;
	};
	var normalizeStringifyOptions = function normalizeStringifyOptions(opts) {
		if (!opts) return defaults;
		if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
		if (typeof opts.encodeDotInKeys !== "undefined" && typeof opts.encodeDotInKeys !== "boolean") throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
		if (opts.encoder !== null && typeof opts.encoder !== "undefined" && typeof opts.encoder !== "function") throw new TypeError("Encoder has to be a function.");
		var charset = opts.charset || defaults.charset;
		if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
		var format = formats["default"];
		if (typeof opts.format !== "undefined") {
			if (!has.call(formats.formatters, opts.format)) throw new TypeError("Unknown format option provided.");
			format = opts.format;
		}
		var formatter = formats.formatters[format];
		var filter = defaults.filter;
		if (typeof opts.filter === "function" || isArray(opts.filter)) filter = opts.filter;
		var arrayFormat;
		if (opts.arrayFormat in arrayPrefixGenerators) arrayFormat = opts.arrayFormat;
		else if ("indices" in opts) arrayFormat = opts.indices ? "indices" : "repeat";
		else arrayFormat = defaults.arrayFormat;
		if ("commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
		var allowDots = typeof opts.allowDots === "undefined" ? opts.encodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
		return {
			addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults.addQueryPrefix,
			allowDots,
			allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
			arrayFormat,
			charset,
			charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
			commaRoundTrip: !!opts.commaRoundTrip,
			delimiter: typeof opts.delimiter === "undefined" ? defaults.delimiter : opts.delimiter,
			depth: typeof opts.depth === "number" ? opts.depth : defaults.depth,
			encode: typeof opts.encode === "boolean" ? opts.encode : defaults.encode,
			encodeDotInKeys: typeof opts.encodeDotInKeys === "boolean" ? opts.encodeDotInKeys : defaults.encodeDotInKeys,
			encoder: typeof opts.encoder === "function" ? opts.encoder : defaults.encoder,
			encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
			filter,
			format,
			formatter,
			serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults.serializeDate,
			skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults.skipNulls,
			sort: typeof opts.sort === "function" ? opts.sort : null,
			strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
		};
	};
	module.exports = function(object, opts) {
		var obj = object;
		var options = normalizeStringifyOptions(opts);
		var objKeys;
		var filter;
		if (typeof options.filter === "function") {
			filter = options.filter;
			obj = filter("", obj);
		} else if (isArray(options.filter)) {
			filter = options.filter;
			objKeys = filter;
		}
		var keys = [];
		if (typeof obj !== "object" || obj === null) return "";
		var generateArrayPrefix = arrayPrefixGenerators[options.arrayFormat];
		var commaRoundTrip = generateArrayPrefix === "comma" && options.commaRoundTrip;
		if (!objKeys) objKeys = Object.keys(obj);
		if (options.sort) objKeys.sort(options.sort);
		var sideChannel = getSideChannel();
		for (var i = 0; i < objKeys.length; ++i) {
			var key = objKeys[i];
			if (typeof key === "undefined" || key === null) continue;
			var value = obj[key];
			if (options.skipNulls && value === null) continue;
			pushToArray(keys, stringify(value, options.encodeDotInKeys ? String(key).replace(/\./g, "%2E") : String(key), generateArrayPrefix, commaRoundTrip, options.allowEmptyArrays, options.strictNullHandling, options.skipNulls, options.encodeDotInKeys, options.encode ? options.encoder : null, options.filter, options.sort, options.allowDots, options.serializeDate, options.format, options.formatter, options.encodeValuesOnly, options.charset, sideChannel, options.depth, 0));
		}
		var joined = keys.join(options.delimiter);
		var prefix = options.addQueryPrefix === true ? "?" : "";
		if (options.charsetSentinel) {
			if (options.charset === "iso-8859-1") prefix += "utf8=%26%2310003%3B" + options.delimiter;
			else prefix += "utf8=%E2%9C%93" + options.delimiter;
		}
		return joined.length > 0 ? prefix + joined : "";
	};
}));
//#endregion
//#region node_modules/qs/lib/parse.js
var require_parse = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var utils = require_utils();
	var has = Object.prototype.hasOwnProperty;
	var isArray = Array.isArray;
	var defaults = {
		allowDots: false,
		allowEmptyArrays: false,
		allowPrototypes: false,
		allowSparse: false,
		arrayLimit: 20,
		charset: "utf-8",
		charsetSentinel: false,
		comma: false,
		decodeDotInKeys: false,
		decoder: utils.decode,
		delimiter: "&",
		depth: 5,
		duplicates: "combine",
		ignoreQueryPrefix: false,
		interpretNumericEntities: false,
		parameterLimit: 1e3,
		parseArrays: true,
		plainObjects: false,
		strictDepth: false,
		strictMerge: true,
		strictNullHandling: false,
		throwOnLimitExceeded: false
	};
	var interpretNumericEntities = function(str) {
		return str.replace(/&#(\d+);/g, function($0, numberStr) {
			return String.fromCharCode(parseInt(numberStr, 10));
		});
	};
	var parseArrayValue = function(val, options, currentArrayLength) {
		if (val && typeof val === "string" && options.comma && val.indexOf(",") > -1) {
			if (options.throwOnLimitExceeded) {
				var commaCount = 0;
				var commaIndex = val.indexOf(",");
				while (commaIndex > -1) {
					commaCount += 1;
					if (commaCount >= options.arrayLimit) throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
					commaIndex = val.indexOf(",", commaIndex + 1);
				}
			}
			return val.split(",");
		}
		if (options.throwOnLimitExceeded && currentArrayLength >= options.arrayLimit) throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
		return val;
	};
	var isoSentinel = "utf8=%26%2310003%3B";
	var charsetSentinel = "utf8=%E2%9C%93";
	var parseValues = function parseQueryStringValues(str, options) {
		var obj = { __proto__: null };
		var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, "") : str;
		cleanStr = cleanStr.replace(/%5B/gi, "[").replace(/%5D/gi, "]");
		var limit = options.parameterLimit === Infinity ? void 0 : options.parameterLimit;
		var parts = cleanStr.split(options.delimiter, options.throwOnLimitExceeded && typeof limit !== "undefined" ? limit + 1 : limit);
		if (options.throwOnLimitExceeded && typeof limit !== "undefined" && parts.length > limit) throw new RangeError("Parameter limit exceeded. Only " + limit + " parameter" + (limit === 1 ? "" : "s") + " allowed.");
		var skipIndex = -1;
		var i;
		var charset = options.charset;
		if (options.charsetSentinel) {
			for (i = 0; i < parts.length; ++i) if (parts[i].indexOf("utf8=") === 0) {
				if (parts[i] === charsetSentinel) charset = "utf-8";
				else if (parts[i] === isoSentinel) charset = "iso-8859-1";
				skipIndex = i;
				i = parts.length;
			}
		}
		for (i = 0; i < parts.length; ++i) {
			if (i === skipIndex) continue;
			var part = parts[i];
			var bracketEqualsPos = part.indexOf("]=");
			var pos = bracketEqualsPos === -1 ? part.indexOf("=") : bracketEqualsPos + 1;
			var key;
			var val;
			if (pos === -1) {
				key = options.decoder(part, defaults.decoder, charset, "key");
				val = options.strictNullHandling ? null : "";
			} else {
				key = options.decoder(part.slice(0, pos), defaults.decoder, charset, "key");
				if (key !== null) val = utils.maybeMap(parseArrayValue(part.slice(pos + 1), options, isArray(obj[key]) ? obj[key].length : 0), function(encodedVal) {
					return options.decoder(encodedVal, defaults.decoder, charset, "value");
				});
			}
			if (val && options.interpretNumericEntities && charset === "iso-8859-1") val = interpretNumericEntities(String(val));
			if (part.indexOf("[]=") > -1) val = isArray(val) ? [val] : val;
			if (options.comma && isArray(val) && val.length > options.arrayLimit) val = utils.combine([], val, options.arrayLimit, options.plainObjects, options.throwOnLimitExceeded);
			if (key !== null) {
				var existing = has.call(obj, key);
				if (existing && (options.duplicates === "combine" || part.indexOf("[]=") > -1)) obj[key] = utils.combine(obj[key], val, options.arrayLimit, options.plainObjects, options.throwOnLimitExceeded);
				else if (!existing || options.duplicates === "last") obj[key] = val;
			}
		}
		return obj;
	};
	var parseObject = function(chain, val, options, valuesParsed) {
		var currentArrayLength = 0;
		if (chain.length > 0 && chain[chain.length - 1] === "[]") {
			var parentKey = chain.slice(0, -1).join("");
			currentArrayLength = Array.isArray(val) && val[parentKey] ? val[parentKey].length : 0;
		}
		var leaf = valuesParsed ? val : parseArrayValue(val, options, currentArrayLength);
		for (var i = chain.length - 1; i >= 0; --i) {
			var obj;
			var root = chain[i];
			if (root === "[]" && options.parseArrays) {
				if (utils.isOverflow(leaf)) obj = leaf;
				else obj = options.allowEmptyArrays && (leaf === "" || options.strictNullHandling && leaf === null) ? [] : utils.combine([], leaf, options.arrayLimit, options.plainObjects, options.throwOnLimitExceeded);
			} else {
				obj = options.plainObjects ? { __proto__: null } : {};
				var cleanRoot = root.charAt(0) === "[" && root.charAt(root.length - 1) === "]" ? root.slice(1, -1) : root;
				var decodedRoot = options.decodeDotInKeys ? cleanRoot.replace(/%2E/g, ".") : cleanRoot;
				var index = parseInt(decodedRoot, 10);
				var isValidArrayIndex = !isNaN(index) && root !== decodedRoot && String(index) === decodedRoot && index >= 0 && options.parseArrays;
				if (!options.parseArrays && decodedRoot === "") obj = { 0: leaf };
				else if (isValidArrayIndex && index < options.arrayLimit) {
					obj = [];
					obj[index] = leaf;
				} else if (isValidArrayIndex && options.throwOnLimitExceeded) throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
				else if (isValidArrayIndex) {
					obj[index] = leaf;
					utils.markOverflow(obj, index);
				} else if (decodedRoot !== "__proto__") obj[decodedRoot] = leaf;
			}
			leaf = obj;
		}
		return leaf;
	};
	var splitKeyIntoSegments = function splitKeyIntoSegments(originalKey, options) {
		var key = options.allowDots ? originalKey.replace(/\.([^.[]+)/g, "[$1]") : originalKey;
		if (options.depth <= 0) {
			if (!options.plainObjects && has.call(Object.prototype, key)) {
				if (!options.allowPrototypes) return;
			}
			return [key];
		}
		var segments = [];
		var first = key.indexOf("[");
		var parent = first >= 0 ? key.slice(0, first) : key;
		if (parent) {
			if (!options.plainObjects && has.call(Object.prototype, parent)) {
				if (!options.allowPrototypes) return;
			}
			segments[segments.length] = parent;
		}
		var n = key.length;
		var open = first;
		var collected = 0;
		while (open >= 0 && collected < options.depth) {
			var level = 1;
			var i = open + 1;
			var close = -1;
			while (i < n && close < 0) {
				var cu = key.charCodeAt(i);
				if (cu === 91) level += 1;
				else if (cu === 93) {
					level -= 1;
					if (level === 0) close = i;
				}
				i += 1;
			}
			if (close < 0) {
				segments[segments.length] = "[" + key.slice(open) + "]";
				return segments;
			}
			var seg = key.slice(open, close + 1);
			var content = seg.slice(1, -1);
			if (!options.plainObjects && has.call(Object.prototype, content) && !options.allowPrototypes) return;
			segments[segments.length] = seg;
			collected += 1;
			open = key.indexOf("[", close + 1);
		}
		if (open >= 0) {
			if (options.strictDepth === true) throw new RangeError("Input depth exceeded depth option of " + options.depth + " and strictDepth is true");
			segments[segments.length] = "[" + key.slice(open) + "]";
		}
		return segments;
	};
	var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
		if (!givenKey) return;
		var keys = splitKeyIntoSegments(givenKey, options);
		if (!keys) return;
		return parseObject(keys, val, options, valuesParsed);
	};
	var normalizeParseOptions = function normalizeParseOptions(opts) {
		if (!opts) return defaults;
		if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
		if (typeof opts.decodeDotInKeys !== "undefined" && typeof opts.decodeDotInKeys !== "boolean") throw new TypeError("`decodeDotInKeys` option can only be `true` or `false`, when provided");
		if (opts.decoder !== null && typeof opts.decoder !== "undefined" && typeof opts.decoder !== "function") throw new TypeError("Decoder has to be a function.");
		if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
		if (typeof opts.throwOnLimitExceeded !== "undefined" && typeof opts.throwOnLimitExceeded !== "boolean") throw new TypeError("`throwOnLimitExceeded` option must be a boolean");
		var charset = typeof opts.charset === "undefined" ? defaults.charset : opts.charset;
		var duplicates = typeof opts.duplicates === "undefined" ? defaults.duplicates : opts.duplicates;
		if (duplicates !== "combine" && duplicates !== "first" && duplicates !== "last") throw new TypeError("The duplicates option must be either combine, first, or last");
		return {
			allowDots: typeof opts.allowDots === "undefined" ? opts.decodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots,
			allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
			allowPrototypes: typeof opts.allowPrototypes === "boolean" ? opts.allowPrototypes : defaults.allowPrototypes,
			allowSparse: typeof opts.allowSparse === "boolean" ? opts.allowSparse : defaults.allowSparse,
			arrayLimit: typeof opts.arrayLimit === "number" ? opts.arrayLimit : defaults.arrayLimit,
			charset,
			charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
			comma: typeof opts.comma === "boolean" ? opts.comma : defaults.comma,
			decodeDotInKeys: typeof opts.decodeDotInKeys === "boolean" ? opts.decodeDotInKeys : defaults.decodeDotInKeys,
			decoder: typeof opts.decoder === "function" ? opts.decoder : defaults.decoder,
			delimiter: typeof opts.delimiter === "string" || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
			depth: typeof opts.depth === "number" || opts.depth === false ? +opts.depth : defaults.depth,
			duplicates,
			ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
			interpretNumericEntities: typeof opts.interpretNumericEntities === "boolean" ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
			parameterLimit: typeof opts.parameterLimit === "number" ? opts.parameterLimit : defaults.parameterLimit,
			parseArrays: opts.parseArrays !== false,
			plainObjects: typeof opts.plainObjects === "boolean" ? opts.plainObjects : defaults.plainObjects,
			strictDepth: typeof opts.strictDepth === "boolean" ? !!opts.strictDepth : defaults.strictDepth,
			strictMerge: typeof opts.strictMerge === "boolean" ? !!opts.strictMerge : defaults.strictMerge,
			strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling,
			throwOnLimitExceeded: typeof opts.throwOnLimitExceeded === "boolean" ? opts.throwOnLimitExceeded : false
		};
	};
	module.exports = function(str, opts) {
		var options = normalizeParseOptions(opts);
		if (str === "" || str === null || typeof str === "undefined") return options.plainObjects ? { __proto__: null } : {};
		var tempObj = typeof str === "string" ? parseValues(str, options) : str;
		var obj = options.plainObjects ? { __proto__: null } : {};
		var keys = Object.keys(tempObj);
		for (var i = 0; i < keys.length; ++i) {
			var key = keys[i];
			var newObj = parseKeys(key, tempObj[key], options, typeof str === "string");
			obj = utils.merge(obj, newObj, options);
		}
		if (options.allowSparse === true) return obj;
		return utils.compact(obj);
	};
}));
//#endregion
//#region node_modules/qs/lib/index.js
var require_lib = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var stringify = require_stringify();
	var parse = require_parse();
	module.exports = {
		formats: require_formats(),
		parse,
		stringify
	};
}));
//#endregion
//#region node_modules/url/url.js
var require_url = /* @__PURE__ */ __commonJSMin(((exports) => {
	var punycode = require_punycode();
	function Url() {
		this.protocol = null;
		this.slashes = null;
		this.auth = null;
		this.host = null;
		this.port = null;
		this.hostname = null;
		this.hash = null;
		this.search = null;
		this.query = null;
		this.pathname = null;
		this.path = null;
		this.href = null;
	}
	var protocolPattern = /^([a-z0-9.+-]+:)/i;
	var portPattern = /:[0-9]*$/;
	var simplePathPattern = /^(\/\/?(?!\/)[^?\s]*)(\?[^\s]*)?$/;
	var unwise = [
		"{",
		"}",
		"|",
		"\\",
		"^",
		"`"
	].concat([
		"<",
		">",
		"\"",
		"`",
		" ",
		"\r",
		"\n",
		"	"
	]);
	var autoEscape = ["'"].concat(unwise);
	var nonHostChars = [
		"%",
		"/",
		"?",
		";",
		"#"
	].concat(autoEscape);
	var hostEndingChars = [
		"/",
		"?",
		"#"
	];
	var hostnameMaxLen = 255;
	var hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/;
	var hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/;
	var unsafeProtocol = {
		javascript: true,
		"javascript:": true
	};
	var hostlessProtocol = {
		javascript: true,
		"javascript:": true
	};
	var slashedProtocol = {
		http: true,
		https: true,
		ftp: true,
		gopher: true,
		file: true,
		"http:": true,
		"https:": true,
		"ftp:": true,
		"gopher:": true,
		"file:": true
	};
	var querystring = require_lib();
	function urlParse(url, parseQueryString, slashesDenoteHost) {
		if (url && typeof url === "object" && url instanceof Url) return url;
		var u = new Url();
		u.parse(url, parseQueryString, slashesDenoteHost);
		return u;
	}
	Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
		if (typeof url !== "string") throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
		var queryIndex = url.indexOf("?"), splitter = queryIndex !== -1 && queryIndex < url.indexOf("#") ? "?" : "#", uSplit = url.split(splitter);
		uSplit[0] = uSplit[0].replace(/\\/g, "/");
		url = uSplit.join(splitter);
		var rest = url;
		rest = rest.trim();
		if (!slashesDenoteHost && url.split("#").length === 1) {
			var simplePath = simplePathPattern.exec(rest);
			if (simplePath) {
				this.path = rest;
				this.href = rest;
				this.pathname = simplePath[1];
				if (simplePath[2]) {
					this.search = simplePath[2];
					if (parseQueryString) this.query = querystring.parse(this.search.substr(1));
					else this.query = this.search.substr(1);
				} else if (parseQueryString) {
					this.search = "";
					this.query = {};
				}
				return this;
			}
		}
		var proto = protocolPattern.exec(rest);
		if (proto) {
			proto = proto[0];
			var lowerProto = proto.toLowerCase();
			this.protocol = lowerProto;
			rest = rest.substr(proto.length);
		}
		if (slashesDenoteHost || proto || rest.match(/^\/\/[^@/]+@[^@/]+/)) {
			var slashes = rest.substr(0, 2) === "//";
			if (slashes && !(proto && hostlessProtocol[proto])) {
				rest = rest.substr(2);
				this.slashes = true;
			}
		}
		if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
			var hostEnd = -1;
			for (var i = 0; i < hostEndingChars.length; i++) {
				var hec = rest.indexOf(hostEndingChars[i]);
				if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
			}
			var auth, atSign;
			if (hostEnd === -1) atSign = rest.lastIndexOf("@");
			else atSign = rest.lastIndexOf("@", hostEnd);
			if (atSign !== -1) {
				auth = rest.slice(0, atSign);
				rest = rest.slice(atSign + 1);
				this.auth = decodeURIComponent(auth);
			}
			hostEnd = -1;
			for (var i = 0; i < nonHostChars.length; i++) {
				var hec = rest.indexOf(nonHostChars[i]);
				if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) hostEnd = hec;
			}
			if (hostEnd === -1) hostEnd = rest.length;
			this.host = rest.slice(0, hostEnd);
			rest = rest.slice(hostEnd);
			this.parseHost();
			this.hostname = this.hostname || "";
			var ipv6Hostname = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
			if (!ipv6Hostname) {
				var hostparts = this.hostname.split(/\./);
				for (var i = 0, l = hostparts.length; i < l; i++) {
					var part = hostparts[i];
					if (!part) continue;
					if (!part.match(hostnamePartPattern)) {
						var newpart = "";
						for (var j = 0, k = part.length; j < k; j++) if (part.charCodeAt(j) > 127) newpart += "x";
						else newpart += part[j];
						if (!newpart.match(hostnamePartPattern)) {
							var validParts = hostparts.slice(0, i);
							var notHost = hostparts.slice(i + 1);
							var bit = part.match(hostnamePartStart);
							if (bit) {
								validParts.push(bit[1]);
								notHost.unshift(bit[2]);
							}
							if (notHost.length) rest = "/" + notHost.join(".") + rest;
							this.hostname = validParts.join(".");
							break;
						}
					}
				}
			}
			if (this.hostname.length > hostnameMaxLen) this.hostname = "";
			else this.hostname = this.hostname.toLowerCase();
			if (!ipv6Hostname) this.hostname = punycode.toASCII(this.hostname);
			var p = this.port ? ":" + this.port : "";
			var h = this.hostname || "";
			this.host = h + p;
			this.href += this.host;
			if (ipv6Hostname) {
				this.hostname = this.hostname.substr(1, this.hostname.length - 2);
				if (rest[0] !== "/") rest = "/" + rest;
			}
		}
		if (!unsafeProtocol[lowerProto]) for (var i = 0, l = autoEscape.length; i < l; i++) {
			var ae = autoEscape[i];
			if (rest.indexOf(ae) === -1) continue;
			var esc = encodeURIComponent(ae);
			if (esc === ae) esc = escape(ae);
			rest = rest.split(ae).join(esc);
		}
		var hash = rest.indexOf("#");
		if (hash !== -1) {
			this.hash = rest.substr(hash);
			rest = rest.slice(0, hash);
		}
		var qm = rest.indexOf("?");
		if (qm !== -1) {
			this.search = rest.substr(qm);
			this.query = rest.substr(qm + 1);
			if (parseQueryString) this.query = querystring.parse(this.query);
			rest = rest.slice(0, qm);
		} else if (parseQueryString) {
			this.search = "";
			this.query = {};
		}
		if (rest) this.pathname = rest;
		if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) this.pathname = "/";
		if (this.pathname || this.search) {
			var p = this.pathname || "";
			var s = this.search || "";
			this.path = p + s;
		}
		this.href = this.format();
		return this;
	};
	function urlFormat(obj) {
		if (typeof obj === "string") obj = urlParse(obj);
		if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
		return obj.format();
	}
	Url.prototype.format = function() {
		var auth = this.auth || "";
		if (auth) {
			auth = encodeURIComponent(auth);
			auth = auth.replace(/%3A/i, ":");
			auth += "@";
		}
		var protocol = this.protocol || "", pathname = this.pathname || "", hash = this.hash || "", host = false, query = "";
		if (this.host) host = auth + this.host;
		else if (this.hostname) {
			host = auth + (this.hostname.indexOf(":") === -1 ? this.hostname : "[" + this.hostname + "]");
			if (this.port) host += ":" + this.port;
		}
		if (this.query && typeof this.query === "object" && Object.keys(this.query).length) query = querystring.stringify(this.query, {
			arrayFormat: "repeat",
			addQueryPrefix: false
		});
		var search = this.search || query && "?" + query || "";
		if (protocol && protocol.substr(-1) !== ":") protocol += ":";
		if (this.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
			host = "//" + (host || "");
			if (pathname && pathname.charAt(0) !== "/") pathname = "/" + pathname;
		} else if (!host) host = "";
		if (hash && hash.charAt(0) !== "#") hash = "#" + hash;
		if (search && search.charAt(0) !== "?") search = "?" + search;
		pathname = pathname.replace(/[?#]/g, function(match) {
			return encodeURIComponent(match);
		});
		search = search.replace("#", "%23");
		return protocol + host + pathname + search + hash;
	};
	function urlResolve(source, relative) {
		return urlParse(source, false, true).resolve(relative);
	}
	Url.prototype.resolve = function(relative) {
		return this.resolveObject(urlParse(relative, false, true)).format();
	};
	Url.prototype.resolveObject = function(relative) {
		if (typeof relative === "string") {
			var rel = new Url();
			rel.parse(relative, false, true);
			relative = rel;
		}
		var result = new Url();
		var tkeys = Object.keys(this);
		for (var tk = 0; tk < tkeys.length; tk++) {
			var tkey = tkeys[tk];
			result[tkey] = this[tkey];
		}
		result.hash = relative.hash;
		if (relative.href === "") {
			result.href = result.format();
			return result;
		}
		if (relative.slashes && !relative.protocol) {
			var rkeys = Object.keys(relative);
			for (var rk = 0; rk < rkeys.length; rk++) {
				var rkey = rkeys[rk];
				if (rkey !== "protocol") result[rkey] = relative[rkey];
			}
			if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
				result.pathname = "/";
				result.path = result.pathname;
			}
			result.href = result.format();
			return result;
		}
		if (relative.protocol && relative.protocol !== result.protocol) {
			if (!slashedProtocol[relative.protocol]) {
				var keys = Object.keys(relative);
				for (var v = 0; v < keys.length; v++) {
					var k = keys[v];
					result[k] = relative[k];
				}
				result.href = result.format();
				return result;
			}
			result.protocol = relative.protocol;
			if (!relative.host && !hostlessProtocol[relative.protocol]) {
				var relPath = (relative.pathname || "").split("/");
				while (relPath.length && !(relative.host = relPath.shift()));
				if (!relative.host) relative.host = "";
				if (!relative.hostname) relative.hostname = "";
				if (relPath[0] !== "") relPath.unshift("");
				if (relPath.length < 2) relPath.unshift("");
				result.pathname = relPath.join("/");
			} else result.pathname = relative.pathname;
			result.search = relative.search;
			result.query = relative.query;
			result.host = relative.host || "";
			result.auth = relative.auth;
			result.hostname = relative.hostname || relative.host;
			result.port = relative.port;
			if (result.pathname || result.search) result.path = (result.pathname || "") + (result.search || "");
			result.slashes = result.slashes || relative.slashes;
			result.href = result.format();
			return result;
		}
		var isSourceAbs = result.pathname && result.pathname.charAt(0) === "/", isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === "/", mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname, removeAllDots = mustEndAbs, srcPath = result.pathname && result.pathname.split("/") || [], relPath = relative.pathname && relative.pathname.split("/") || [], psychotic = result.protocol && !slashedProtocol[result.protocol];
		if (psychotic) {
			result.hostname = "";
			result.port = null;
			if (result.host) {
				if (srcPath[0] === "") srcPath[0] = result.host;
				else srcPath.unshift(result.host);
			}
			result.host = "";
			if (relative.protocol) {
				relative.hostname = null;
				relative.port = null;
				if (relative.host) {
					if (relPath[0] === "") relPath[0] = relative.host;
					else relPath.unshift(relative.host);
				}
				relative.host = null;
			}
			mustEndAbs = mustEndAbs && (relPath[0] === "" || srcPath[0] === "");
		}
		if (isRelAbs) {
			result.host = relative.host || relative.host === "" ? relative.host : result.host;
			result.hostname = relative.hostname || relative.hostname === "" ? relative.hostname : result.hostname;
			result.search = relative.search;
			result.query = relative.query;
			srcPath = relPath;
		} else if (relPath.length) {
			if (!srcPath) srcPath = [];
			srcPath.pop();
			srcPath = srcPath.concat(relPath);
			result.search = relative.search;
			result.query = relative.query;
		} else if (relative.search != null) {
			if (psychotic) {
				result.host = srcPath.shift();
				result.hostname = result.host;
				var authInHost = result.host && result.host.indexOf("@") > 0 ? result.host.split("@") : false;
				if (authInHost) {
					result.auth = authInHost.shift();
					result.hostname = authInHost.shift();
					result.host = result.hostname;
				}
			}
			result.search = relative.search;
			result.query = relative.query;
			if (result.pathname !== null || result.search !== null) result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "");
			result.href = result.format();
			return result;
		}
		if (!srcPath.length) {
			result.pathname = null;
			if (result.search) result.path = "/" + result.search;
			else result.path = null;
			result.href = result.format();
			return result;
		}
		var last = srcPath.slice(-1)[0];
		var hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && (last === "." || last === "..") || last === "";
		var up = 0;
		for (var i = srcPath.length; i >= 0; i--) {
			last = srcPath[i];
			if (last === ".") srcPath.splice(i, 1);
			else if (last === "..") {
				srcPath.splice(i, 1);
				up++;
			} else if (up) {
				srcPath.splice(i, 1);
				up--;
			}
		}
		if (!mustEndAbs && !removeAllDots) for (; up--;) srcPath.unshift("..");
		if (mustEndAbs && srcPath[0] !== "" && (!srcPath[0] || srcPath[0].charAt(0) !== "/")) srcPath.unshift("");
		if (hasTrailingSlash && srcPath.join("/").substr(-1) !== "/") srcPath.push("");
		var isAbsolute = srcPath[0] === "" || srcPath[0] && srcPath[0].charAt(0) === "/";
		if (psychotic) {
			result.hostname = isAbsolute ? "" : srcPath.length ? srcPath.shift() : "";
			result.host = result.hostname;
			var authInHost = result.host && result.host.indexOf("@") > 0 ? result.host.split("@") : false;
			if (authInHost) {
				result.auth = authInHost.shift();
				result.hostname = authInHost.shift();
				result.host = result.hostname;
			}
		}
		mustEndAbs = mustEndAbs || result.host && srcPath.length;
		if (mustEndAbs && !isAbsolute) srcPath.unshift("");
		if (srcPath.length > 0) result.pathname = srcPath.join("/");
		else {
			result.pathname = null;
			result.path = null;
		}
		if (result.pathname !== null || result.search !== null) result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "");
		result.auth = relative.auth || result.auth;
		result.slashes = result.slashes || relative.slashes;
		result.href = result.format();
		return result;
	};
	Url.prototype.parseHost = function() {
		var host = this.host;
		var port = portPattern.exec(host);
		if (port) {
			port = port[0];
			if (port !== ":") this.port = port.substr(1);
			host = host.substr(0, host.length - port.length);
		}
		if (host) this.hostname = host;
	};
	exports.parse = urlParse;
	exports.resolve = urlResolve;
	exports.format = urlFormat;
}));
//#endregion
//#region node_modules/@pixi/utils/dist/esm/utils.mjs
/*!
* @pixi/utils - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/utils is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
var utils_exports = /* @__PURE__ */ __exportAll({
	BaseTextureCache: () => BaseTextureCache,
	CanvasRenderTarget: () => CanvasRenderTarget,
	DATA_URI: () => DATA_URI,
	EventEmitter: () => import_eventemitter3.default,
	ProgramCache: () => ProgramCache,
	TextureCache: () => TextureCache,
	clearTextureCache: () => clearTextureCache,
	correctBlendMode: () => correctBlendMode,
	createIndicesForQuads: () => createIndicesForQuads,
	decomposeDataUri: () => decomposeDataUri,
	deprecation: () => deprecation,
	destroyTextureCache: () => destroyTextureCache,
	determineCrossOrigin: () => determineCrossOrigin,
	earcut: () => import_earcut.default,
	getBufferType: () => getBufferType,
	getResolutionOfUrl: () => getResolutionOfUrl,
	hex2rgb: () => hex2rgb,
	hex2string: () => hex2string,
	interleaveTypedArrays: () => interleaveTypedArrays$1,
	isMobile: () => isMobile,
	isPow2: () => isPow2,
	isWebGLSupported: () => isWebGLSupported,
	log2: () => log2,
	nextPow2: () => nextPow2,
	path: () => path,
	premultiplyBlendMode: () => premultiplyBlendMode,
	premultiplyRgba: () => premultiplyRgba,
	premultiplyTint: () => premultiplyTint,
	premultiplyTintToRgba: () => premultiplyTintToRgba,
	removeItems: () => removeItems,
	rgb2hex: () => rgb2hex,
	sayHello: () => sayHello,
	sign: () => sign,
	skipHello: () => skipHello,
	string2hex: () => string2hex,
	trimCanvas: () => trimCanvas,
	uid: () => uid,
	url: () => url
});
var import_eventemitter3 = /* @__PURE__ */ __toESM(require_eventemitter3(), 1);
var import_earcut = /* @__PURE__ */ __toESM(require_earcut(), 1);
var import_url = require_url();
/**
* This file contains redeclared types for Node `url` and `querystring` modules. These modules
* don't provide their own typings but instead are a part of the full Node typings. The purpose of
* this file is to redeclare the required types to avoid having the whole Node types as a
* dependency.
*/
var url = {
	parse: import_url.parse,
	format: import_url.format,
	resolve: import_url.resolve
};
function assertPath(path) {
	if (typeof path !== "string") throw new TypeError("Path must be a string. Received " + JSON.stringify(path));
}
function removeUrlParams(url) {
	return url.split("?")[0].split("#")[0];
}
function escapeRegExp(string) {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function replaceAll(str, find, replace) {
	return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
}
function normalizeStringPosix(path, allowAboveRoot) {
	var res = "";
	var lastSegmentLength = 0;
	var lastSlash = -1;
	var dots = 0;
	var code;
	for (var i = 0; i <= path.length; ++i) {
		if (i < path.length) code = path.charCodeAt(i);
		else if (code === 47) break;
		else code = 47;
		if (code === 47) {
			if (lastSlash === i - 1 || dots === 1);
			else if (lastSlash !== i - 1 && dots === 2) {
				if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 || res.charCodeAt(res.length - 2) !== 46) {
					if (res.length > 2) {
						var lastSlashIndex = res.lastIndexOf("/");
						if (lastSlashIndex !== res.length - 1) {
							if (lastSlashIndex === -1) {
								res = "";
								lastSegmentLength = 0;
							} else {
								res = res.slice(0, lastSlashIndex);
								lastSegmentLength = res.length - 1 - res.lastIndexOf("/");
							}
							lastSlash = i;
							dots = 0;
							continue;
						}
					} else if (res.length === 2 || res.length === 1) {
						res = "";
						lastSegmentLength = 0;
						lastSlash = i;
						dots = 0;
						continue;
					}
				}
				if (allowAboveRoot) {
					if (res.length > 0) res += "/..";
					else res = "..";
					lastSegmentLength = 2;
				}
			} else {
				if (res.length > 0) res += "/" + path.slice(lastSlash + 1, i);
				else res = path.slice(lastSlash + 1, i);
				lastSegmentLength = i - lastSlash - 1;
			}
			lastSlash = i;
			dots = 0;
		} else if (code === 46 && dots !== -1) ++dots;
		else dots = -1;
	}
	return res;
}
var path = {
	/**
	* Converts a path to posix format.
	* @param path - The path to convert to posix
	*/
	toPosix: function(path) {
		return replaceAll(path, "\\", "/");
	},
	/**
	* Checks if the path is a URL
	* @param path - The path to check
	*/
	isUrl: function(path) {
		return /^https?:/.test(this.toPosix(path));
	},
	/**
	* Checks if the path is a data URL
	* @param path - The path to check
	*/
	isDataUrl: function(path) {
		return /^data:([a-z]+\/[a-z0-9-+.]+(;[a-z0-9-.!#$%*+.{}|~`]+=[a-z0-9-.!#$%*+.{}()_|~`]+)*)?(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s<>]*?)$/i.test(path);
	},
	/**
	* Checks if the path has a protocol e.g. http://
	* This will return true for windows file paths
	* @param path - The path to check
	*/
	hasProtocol: function(path) {
		return /^[^/:]+:\//.test(this.toPosix(path));
	},
	/**
	* Returns the protocol of the path e.g. http://, C:/, file:///
	* @param path - The path to get the protocol from
	*/
	getProtocol: function(path) {
		assertPath(path);
		path = this.toPosix(path);
		var protocol = "";
		var isFile = /^file:\/\/\//.exec(path);
		var isHttp = /^[^/:]+:\/\//.exec(path);
		var isWindows = /^[^/:]+:\//.exec(path);
		if (isFile || isHttp || isWindows) {
			var arr = (isFile === null || isFile === void 0 ? void 0 : isFile[0]) || (isHttp === null || isHttp === void 0 ? void 0 : isHttp[0]) || (isWindows === null || isWindows === void 0 ? void 0 : isWindows[0]);
			protocol = arr;
			path = path.slice(arr.length);
		}
		return protocol;
	},
	/**
	* Converts URL to an absolute path.
	* When loading from a Web Worker, we must use absolute paths.
	* If the URL is already absolute we return it as is
	* If it's not, we convert it
	* @param url - The URL to test
	* @param customBaseUrl - The base URL to use
	* @param customRootUrl - The root URL to use
	*/
	toAbsolute: function(url, customBaseUrl, customRootUrl) {
		if (this.isDataUrl(url)) return url;
		var baseUrl = removeUrlParams(this.toPosix(customBaseUrl !== null && customBaseUrl !== void 0 ? customBaseUrl : settings.ADAPTER.getBaseUrl()));
		var rootUrl = removeUrlParams(this.toPosix(customRootUrl !== null && customRootUrl !== void 0 ? customRootUrl : this.rootname(baseUrl)));
		assertPath(url);
		url = this.toPosix(url);
		if (url.startsWith("/")) return path.join(rootUrl, url.slice(1));
		return this.isAbsolute(url) ? url : this.join(baseUrl, url);
	},
	/**
	* Normalizes the given path, resolving '..' and '.' segments
	* @param path - The path to normalize
	*/
	normalize: function(path) {
		path = this.toPosix(path);
		assertPath(path);
		if (path.length === 0) return ".";
		var protocol = "";
		var isAbsolute = path.startsWith("/");
		if (this.hasProtocol(path)) {
			protocol = this.rootname(path);
			path = path.slice(protocol.length);
		}
		var trailingSeparator = path.endsWith("/");
		path = normalizeStringPosix(path, false);
		if (path.length > 0 && trailingSeparator) path += "/";
		if (isAbsolute) return "/" + path;
		return protocol + path;
	},
	/**
	* Determines if path is an absolute path.
	* Absolute paths can be urls, data urls, or paths on disk
	* @param path - The path to test
	*/
	isAbsolute: function(path) {
		assertPath(path);
		path = this.toPosix(path);
		if (this.hasProtocol(path)) return true;
		return path.startsWith("/");
	},
	/**
	* Joins all given path segments together using the platform-specific separator as a delimiter,
	* then normalizes the resulting path
	* @param segments - The segments of the path to join
	*/
	join: function() {
		var arguments$1 = arguments;
		var _a;
		var segments = [];
		for (var _i = 0; _i < arguments.length; _i++) segments[_i] = arguments$1[_i];
		if (segments.length === 0) return ".";
		var joined;
		for (var i = 0; i < segments.length; ++i) {
			var arg = segments[i];
			assertPath(arg);
			if (arg.length > 0) {
				if (joined === void 0) joined = arg;
				else {
					var prevArg = (_a = segments[i - 1]) !== null && _a !== void 0 ? _a : "";
					if (this.extname(prevArg)) joined += "/../" + arg;
					else joined += "/" + arg;
				}
			}
		}
		if (joined === void 0) return ".";
		return this.normalize(joined);
	},
	/**
	* Returns the directory name of a path
	* @param path - The path to parse
	*/
	dirname: function(path) {
		assertPath(path);
		if (path.length === 0) return ".";
		path = this.toPosix(path);
		var code = path.charCodeAt(0);
		var hasRoot = code === 47;
		var end = -1;
		var matchedSlash = true;
		var proto = this.getProtocol(path);
		var origpath = path;
		path = path.slice(proto.length);
		for (var i = path.length - 1; i >= 1; --i) {
			code = path.charCodeAt(i);
			if (code === 47) {
				if (!matchedSlash) {
					end = i;
					break;
				}
			} else matchedSlash = false;
		}
		if (end === -1) return hasRoot ? "/" : this.isUrl(origpath) ? proto + path : proto;
		if (hasRoot && end === 1) return "//";
		return proto + path.slice(0, end);
	},
	/**
	* Returns the root of the path e.g. /, C:/, file:///, http://domain.com/
	* @param path - The path to parse
	*/
	rootname: function(path) {
		assertPath(path);
		path = this.toPosix(path);
		var root = "";
		if (path.startsWith("/")) root = "/";
		else root = this.getProtocol(path);
		if (this.isUrl(path)) {
			var index = path.indexOf("/", root.length);
			if (index !== -1) root = path.slice(0, index);
			else root = path;
			if (!root.endsWith("/")) root += "/";
		}
		return root;
	},
	/**
	* Returns the last portion of a path
	* @param path - The path to test
	* @param ext - Optional extension to remove
	*/
	basename: function(path, ext) {
		assertPath(path);
		if (ext) assertPath(ext);
		path = this.toPosix(path);
		var start = 0;
		var end = -1;
		var matchedSlash = true;
		var i;
		if (ext !== void 0 && ext.length > 0 && ext.length <= path.length) {
			if (ext.length === path.length && ext === path) return "";
			var extIdx = ext.length - 1;
			var firstNonSlashEnd = -1;
			for (i = path.length - 1; i >= 0; --i) {
				var code = path.charCodeAt(i);
				if (code === 47) {
					if (!matchedSlash) {
						start = i + 1;
						break;
					}
				} else {
					if (firstNonSlashEnd === -1) {
						matchedSlash = false;
						firstNonSlashEnd = i + 1;
					}
					if (extIdx >= 0) {
						if (code === ext.charCodeAt(extIdx)) {
							if (--extIdx === -1) end = i;
						} else {
							extIdx = -1;
							end = firstNonSlashEnd;
						}
					}
				}
			}
			if (start === end) end = firstNonSlashEnd;
			else if (end === -1) end = path.length;
			return path.slice(start, end);
		}
		for (i = path.length - 1; i >= 0; --i) if (path.charCodeAt(i) === 47) {
			if (!matchedSlash) {
				start = i + 1;
				break;
			}
		} else if (end === -1) {
			matchedSlash = false;
			end = i + 1;
		}
		if (end === -1) return "";
		return path.slice(start, end);
	},
	/**
	* Returns the extension of the path, from the last occurrence of the . (period) character to end of string in the last
	* portion of the path. If there is no . in the last portion of the path, or if there are no . characters other than
	* the first character of the basename of path, an empty string is returned.
	* @param path - The path to parse
	*/
	extname: function(path) {
		assertPath(path);
		path = this.toPosix(path);
		var startDot = -1;
		var startPart = 0;
		var end = -1;
		var matchedSlash = true;
		var preDotState = 0;
		for (var i = path.length - 1; i >= 0; --i) {
			var code = path.charCodeAt(i);
			if (code === 47) {
				if (!matchedSlash) {
					startPart = i + 1;
					break;
				}
				continue;
			}
			if (end === -1) {
				matchedSlash = false;
				end = i + 1;
			}
			if (code === 46) {
				if (startDot === -1) startDot = i;
				else if (preDotState !== 1) preDotState = 1;
			} else if (startDot !== -1) preDotState = -1;
		}
		if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) return "";
		return path.slice(startDot, end);
	},
	/**
	* Parses a path into an object containing the 'root', `dir`, `base`, `ext`, and `name` properties.
	* @param path - The path to parse
	*/
	parse: function(path) {
		assertPath(path);
		var ret = {
			root: "",
			dir: "",
			base: "",
			ext: "",
			name: ""
		};
		if (path.length === 0) return ret;
		path = this.toPosix(path);
		var code = path.charCodeAt(0);
		var isAbsolute = this.isAbsolute(path);
		var start;
		ret.root = this.rootname(path);
		if (isAbsolute || this.hasProtocol(path)) start = 1;
		else start = 0;
		var startDot = -1;
		var startPart = 0;
		var end = -1;
		var matchedSlash = true;
		var i = path.length - 1;
		var preDotState = 0;
		for (; i >= start; --i) {
			code = path.charCodeAt(i);
			if (code === 47) {
				if (!matchedSlash) {
					startPart = i + 1;
					break;
				}
				continue;
			}
			if (end === -1) {
				matchedSlash = false;
				end = i + 1;
			}
			if (code === 46) {
				if (startDot === -1) startDot = i;
				else if (preDotState !== 1) preDotState = 1;
			} else if (startDot !== -1) preDotState = -1;
		}
		if (startDot === -1 || end === -1 || preDotState === 0 || preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
			if (end !== -1) {
				if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);
				else ret.base = ret.name = path.slice(startPart, end);
			}
		} else {
			if (startPart === 0 && isAbsolute) {
				ret.name = path.slice(1, startDot);
				ret.base = path.slice(1, end);
			} else {
				ret.name = path.slice(startPart, startDot);
				ret.base = path.slice(startPart, end);
			}
			ret.ext = path.slice(startDot, end);
		}
		ret.dir = this.dirname(path);
		return ret;
	},
	sep: "/",
	delimiter: ":"
};
/**
* The prefix that denotes a URL is for a retina asset.
* @static
* @name RETINA_PREFIX
* @memberof PIXI.settings
* @type {RegExp}
* @default /@([0-9\.]+)x/
* @example `@2x`
*/
settings.RETINA_PREFIX = /@([0-9\.]+)x/;
/**
* Should the `failIfMajorPerformanceCaveat` flag be enabled as a context option used in the `isWebGLSupported` function.
* If set to true, a WebGL renderer can fail to be created if the browser thinks there could be performance issues when
* using WebGL.
*
* In PixiJS v6 this has changed from true to false by default, to allow WebGL to work in as many scenarios as possible.
* However, some users may have a poor experience, for example, if a user has a gpu or driver version blacklisted by the
* browser.
*
* If your application requires high performance rendering, you may wish to set this to false.
* We recommend one of two options if you decide to set this flag to false:
*
* 1: Use the `pixi.js-legacy` package, which includes a Canvas renderer as a fallback in case high performance WebGL is
*    not supported.
*
* 2: Call `isWebGLSupported` (which if found in the PIXI.utils package) in your code before attempting to create a PixiJS
*    renderer, and show an error message to the user if the function returns false, explaining that their device & browser
*    combination does not support high performance WebGL.
*    This is a much better strategy than trying to create a PixiJS renderer and finding it then fails.
* @static
* @name FAIL_IF_MAJOR_PERFORMANCE_CAVEAT
* @memberof PIXI.settings
* @type {boolean}
* @default false
*/
settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = false;
var saidHello = false;
var VERSION$1 = "6.5.10";
/**
* Skips the hello message of renderers that are created after this is run.
* @function skipHello
* @memberof PIXI.utils
*/
function skipHello() {
	saidHello = true;
}
/**
* Logs out the version and renderer information for this running instance of PIXI.
* If you don't want to see this message you can run `PIXI.utils.skipHello()` before
* creating your renderer. Keep in mind that doing that will forever make you a jerk face.
* @static
* @function sayHello
* @memberof PIXI.utils
* @param {string} type - The string renderer type to log.
*/
function sayHello(type) {
	var _a;
	if (saidHello) return;
	if (settings.ADAPTER.getNavigator().userAgent.toLowerCase().indexOf("chrome") > -1) {
		var args = [
			"\n %c %c %c PixiJS " + VERSION$1 + " - ✰ " + type + " ✰  %c  %c  http://www.pixijs.com/  %c %c ♥%c♥%c♥ \n\n",
			"background: #ff66a5; padding:5px 0;",
			"background: #ff66a5; padding:5px 0;",
			"color: #ff66a5; background: #030307; padding:5px 0;",
			"background: #ff66a5; padding:5px 0;",
			"background: #ffc3dc; padding:5px 0;",
			"background: #ff66a5; padding:5px 0;",
			"color: #ff2424; background: #fff; padding:5px 0;",
			"color: #ff2424; background: #fff; padding:5px 0;",
			"color: #ff2424; background: #fff; padding:5px 0;"
		];
		(_a = globalThis.console).log.apply(_a, args);
	} else if (globalThis.console) globalThis.console.log("PixiJS " + VERSION$1 + " - " + type + " - http://www.pixijs.com/");
	saidHello = true;
}
var supported;
/**
* Helper for checking for WebGL support.
* @memberof PIXI.utils
* @function isWebGLSupported
* @returns {boolean} Is WebGL supported.
*/
function isWebGLSupported() {
	if (typeof supported === "undefined") supported = (function supported() {
		var contextOptions = {
			stencil: true,
			failIfMajorPerformanceCaveat: settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT
		};
		try {
			if (!settings.ADAPTER.getWebGLRenderingContext()) return false;
			var canvas = settings.ADAPTER.createCanvas();
			var gl = canvas.getContext("webgl", contextOptions) || canvas.getContext("experimental-webgl", contextOptions);
			var success = !!(gl && gl.getContextAttributes().stencil);
			if (gl) {
				var loseContext = gl.getExtension("WEBGL_lose_context");
				if (loseContext) loseContext.loseContext();
			}
			gl = null;
			return success;
		} catch (e) {
			return false;
		}
	})();
	return supported;
}
var cssColorNames = {
	aliceblue: "#f0f8ff",
	antiquewhite: "#faebd7",
	aqua: "#00ffff",
	aquamarine: "#7fffd4",
	azure: "#f0ffff",
	beige: "#f5f5dc",
	bisque: "#ffe4c4",
	black: "#000000",
	blanchedalmond: "#ffebcd",
	blue: "#0000ff",
	blueviolet: "#8a2be2",
	brown: "#a52a2a",
	burlywood: "#deb887",
	cadetblue: "#5f9ea0",
	chartreuse: "#7fff00",
	chocolate: "#d2691e",
	coral: "#ff7f50",
	cornflowerblue: "#6495ed",
	cornsilk: "#fff8dc",
	crimson: "#dc143c",
	cyan: "#00ffff",
	darkblue: "#00008b",
	darkcyan: "#008b8b",
	darkgoldenrod: "#b8860b",
	darkgray: "#a9a9a9",
	darkgreen: "#006400",
	darkgrey: "#a9a9a9",
	darkkhaki: "#bdb76b",
	darkmagenta: "#8b008b",
	darkolivegreen: "#556b2f",
	darkorange: "#ff8c00",
	darkorchid: "#9932cc",
	darkred: "#8b0000",
	darksalmon: "#e9967a",
	darkseagreen: "#8fbc8f",
	darkslateblue: "#483d8b",
	darkslategray: "#2f4f4f",
	darkslategrey: "#2f4f4f",
	darkturquoise: "#00ced1",
	darkviolet: "#9400d3",
	deeppink: "#ff1493",
	deepskyblue: "#00bfff",
	dimgray: "#696969",
	dimgrey: "#696969",
	dodgerblue: "#1e90ff",
	firebrick: "#b22222",
	floralwhite: "#fffaf0",
	forestgreen: "#228b22",
	fuchsia: "#ff00ff",
	gainsboro: "#dcdcdc",
	ghostwhite: "#f8f8ff",
	goldenrod: "#daa520",
	gold: "#ffd700",
	gray: "#808080",
	green: "#008000",
	greenyellow: "#adff2f",
	grey: "#808080",
	honeydew: "#f0fff0",
	hotpink: "#ff69b4",
	indianred: "#cd5c5c",
	indigo: "#4b0082",
	ivory: "#fffff0",
	khaki: "#f0e68c",
	lavenderblush: "#fff0f5",
	lavender: "#e6e6fa",
	lawngreen: "#7cfc00",
	lemonchiffon: "#fffacd",
	lightblue: "#add8e6",
	lightcoral: "#f08080",
	lightcyan: "#e0ffff",
	lightgoldenrodyellow: "#fafad2",
	lightgray: "#d3d3d3",
	lightgreen: "#90ee90",
	lightgrey: "#d3d3d3",
	lightpink: "#ffb6c1",
	lightsalmon: "#ffa07a",
	lightseagreen: "#20b2aa",
	lightskyblue: "#87cefa",
	lightslategray: "#778899",
	lightslategrey: "#778899",
	lightsteelblue: "#b0c4de",
	lightyellow: "#ffffe0",
	lime: "#00ff00",
	limegreen: "#32cd32",
	linen: "#faf0e6",
	magenta: "#ff00ff",
	maroon: "#800000",
	mediumaquamarine: "#66cdaa",
	mediumblue: "#0000cd",
	mediumorchid: "#ba55d3",
	mediumpurple: "#9370db",
	mediumseagreen: "#3cb371",
	mediumslateblue: "#7b68ee",
	mediumspringgreen: "#00fa9a",
	mediumturquoise: "#48d1cc",
	mediumvioletred: "#c71585",
	midnightblue: "#191970",
	mintcream: "#f5fffa",
	mistyrose: "#ffe4e1",
	moccasin: "#ffe4b5",
	navajowhite: "#ffdead",
	navy: "#000080",
	oldlace: "#fdf5e6",
	olive: "#808000",
	olivedrab: "#6b8e23",
	orange: "#ffa500",
	orangered: "#ff4500",
	orchid: "#da70d6",
	palegoldenrod: "#eee8aa",
	palegreen: "#98fb98",
	paleturquoise: "#afeeee",
	palevioletred: "#db7093",
	papayawhip: "#ffefd5",
	peachpuff: "#ffdab9",
	peru: "#cd853f",
	pink: "#ffc0cb",
	plum: "#dda0dd",
	powderblue: "#b0e0e6",
	purple: "#800080",
	rebeccapurple: "#663399",
	red: "#ff0000",
	rosybrown: "#bc8f8f",
	royalblue: "#4169e1",
	saddlebrown: "#8b4513",
	salmon: "#fa8072",
	sandybrown: "#f4a460",
	seagreen: "#2e8b57",
	seashell: "#fff5ee",
	sienna: "#a0522d",
	silver: "#c0c0c0",
	skyblue: "#87ceeb",
	slateblue: "#6a5acd",
	slategray: "#708090",
	slategrey: "#708090",
	snow: "#fffafa",
	springgreen: "#00ff7f",
	steelblue: "#4682b4",
	tan: "#d2b48c",
	teal: "#008080",
	thistle: "#d8bfd8",
	tomato: "#ff6347",
	turquoise: "#40e0d0",
	violet: "#ee82ee",
	wheat: "#f5deb3",
	white: "#ffffff",
	whitesmoke: "#f5f5f5",
	yellow: "#ffff00",
	yellowgreen: "#9acd32"
};
/**
* Converts a hexadecimal color number to an [R, G, B] array of normalized floats (numbers from 0.0 to 1.0).
* @example
* PIXI.utils.hex2rgb(0xffffff); // returns [1, 1, 1]
* @memberof PIXI.utils
* @function hex2rgb
* @param {number} hex - The hexadecimal number to convert
* @param  {number[]} [out=[]] - If supplied, this array will be used rather than returning a new one
* @returns {number[]} An array representing the [R, G, B] of the color where all values are floats.
*/
function hex2rgb(hex, out) {
	if (out === void 0) out = [];
	out[0] = (hex >> 16 & 255) / 255;
	out[1] = (hex >> 8 & 255) / 255;
	out[2] = (hex & 255) / 255;
	return out;
}
/**
* Converts a hexadecimal color number to a string.
* @example
* PIXI.utils.hex2string(0xffffff); // returns "#ffffff"
* @memberof PIXI.utils
* @function hex2string
* @param {number} hex - Number in hex (e.g., `0xffffff`)
* @returns {string} The string color (e.g., `"#ffffff"`).
*/
function hex2string(hex) {
	var hexString = hex.toString(16);
	hexString = "000000".substring(0, 6 - hexString.length) + hexString;
	return "#" + hexString;
}
/**
* Converts a string to a hexadecimal color number.
* It can handle:
*  hex strings starting with #: "#ffffff"
*  hex strings starting with 0x: "0xffffff"
*  hex strings without prefix: "ffffff"
*  css colors: "black"
* @example
* PIXI.utils.string2hex("#ffffff"); // returns 0xffffff, which is 16777215 as an integer
* @memberof PIXI.utils
* @function string2hex
* @param {string} string - The string color (e.g., `"#ffffff"`)
* @returns {number} Number in hexadecimal.
*/
function string2hex(string) {
	if (typeof string === "string") {
		string = cssColorNames[string.toLowerCase()] || string;
		if (string[0] === "#") string = string.slice(1);
	}
	return parseInt(string, 16);
}
/**
* Converts a color as an [R, G, B] array of normalized floats to a hexadecimal number.
* @example
* PIXI.utils.rgb2hex([1, 1, 1]); // returns 0xffffff, which is 16777215 as an integer
* @memberof PIXI.utils
* @function rgb2hex
* @param {number[]} rgb - Array of numbers where all values are normalized floats from 0.0 to 1.0.
* @returns {number} Number in hexadecimal.
*/
function rgb2hex(rgb) {
	return (rgb[0] * 255 << 16) + (rgb[1] * 255 << 8) + (rgb[2] * 255 | 0);
}
/**
* Corrects PixiJS blend, takes premultiplied alpha into account
* @memberof PIXI.utils
* @function mapPremultipliedBlendModes
* @private
* @returns {Array<number[]>} Mapped modes.
*/
function mapPremultipliedBlendModes() {
	var pm = [];
	var npm = [];
	for (var i = 0; i < 32; i++) {
		pm[i] = i;
		npm[i] = i;
	}
	pm[BLEND_MODES.NORMAL_NPM] = BLEND_MODES.NORMAL;
	pm[BLEND_MODES.ADD_NPM] = BLEND_MODES.ADD;
	pm[BLEND_MODES.SCREEN_NPM] = BLEND_MODES.SCREEN;
	npm[BLEND_MODES.NORMAL] = BLEND_MODES.NORMAL_NPM;
	npm[BLEND_MODES.ADD] = BLEND_MODES.ADD_NPM;
	npm[BLEND_MODES.SCREEN] = BLEND_MODES.SCREEN_NPM;
	var array = [];
	array.push(npm);
	array.push(pm);
	return array;
}
/**
* maps premultiply flag and blendMode to adjusted blendMode
* @memberof PIXI.utils
* @constant premultiplyBlendMode
* @type {Array<number[]>}
*/
var premultiplyBlendMode = mapPremultipliedBlendModes();
/**
* changes blendMode according to texture format
* @memberof PIXI.utils
* @function correctBlendMode
* @param {number} blendMode - supposed blend mode
* @param {boolean} premultiplied - whether source is premultiplied
* @returns {number} true blend mode for this texture
*/
function correctBlendMode(blendMode, premultiplied) {
	return premultiplyBlendMode[premultiplied ? 1 : 0][blendMode];
}
/**
* combines rgb and alpha to out array
* @memberof PIXI.utils
* @function premultiplyRgba
* @param {Float32Array|number[]} rgb - input rgb
* @param {number} alpha - alpha param
* @param {Float32Array} [out] - output
* @param {boolean} [premultiply=true] - do premultiply it
* @returns {Float32Array} vec4 rgba
*/
function premultiplyRgba(rgb, alpha, out, premultiply) {
	out = out || /* @__PURE__ */ new Float32Array(4);
	if (premultiply || premultiply === void 0) {
		out[0] = rgb[0] * alpha;
		out[1] = rgb[1] * alpha;
		out[2] = rgb[2] * alpha;
	} else {
		out[0] = rgb[0];
		out[1] = rgb[1];
		out[2] = rgb[2];
	}
	out[3] = alpha;
	return out;
}
/**
* premultiplies tint
* @memberof PIXI.utils
* @function premultiplyTint
* @param {number} tint - integer RGB
* @param {number} alpha - floating point alpha (0.0-1.0)
* @returns {number} tint multiplied by alpha
*/
function premultiplyTint(tint, alpha) {
	if (alpha === 1) return (alpha * 255 << 24) + tint;
	if (alpha === 0) return 0;
	var R = tint >> 16 & 255;
	var G = tint >> 8 & 255;
	var B = tint & 255;
	R = R * alpha + .5 | 0;
	G = G * alpha + .5 | 0;
	B = B * alpha + .5 | 0;
	return (alpha * 255 << 24) + (R << 16) + (G << 8) + B;
}
/**
* converts integer tint and float alpha to vec4 form, premultiplies by default
* @memberof PIXI.utils
* @function premultiplyTintToRgba
* @param {number} tint - input tint
* @param {number} alpha - alpha param
* @param {Float32Array} [out] - output
* @param {boolean} [premultiply=true] - do premultiply it
* @returns {Float32Array} vec4 rgba
*/
function premultiplyTintToRgba(tint, alpha, out, premultiply) {
	out = out || /* @__PURE__ */ new Float32Array(4);
	out[0] = (tint >> 16 & 255) / 255;
	out[1] = (tint >> 8 & 255) / 255;
	out[2] = (tint & 255) / 255;
	if (premultiply || premultiply === void 0) {
		out[0] *= alpha;
		out[1] *= alpha;
		out[2] *= alpha;
	}
	out[3] = alpha;
	return out;
}
/**
* Generic Mask Stack data structure
* @memberof PIXI.utils
* @function createIndicesForQuads
* @param {number} size - Number of quads
* @param {Uint16Array|Uint32Array} [outBuffer] - Buffer for output, length has to be `6 * size`
* @returns {Uint16Array|Uint32Array} - Resulting index buffer
*/
function createIndicesForQuads(size, outBuffer) {
	if (outBuffer === void 0) outBuffer = null;
	var totalIndices = size * 6;
	outBuffer = outBuffer || new Uint16Array(totalIndices);
	if (outBuffer.length !== totalIndices) throw new Error("Out buffer length is incorrect, got " + outBuffer.length + " and expected " + totalIndices);
	for (var i = 0, j = 0; i < totalIndices; i += 6, j += 4) {
		outBuffer[i + 0] = j + 0;
		outBuffer[i + 1] = j + 1;
		outBuffer[i + 2] = j + 2;
		outBuffer[i + 3] = j + 0;
		outBuffer[i + 4] = j + 2;
		outBuffer[i + 5] = j + 3;
	}
	return outBuffer;
}
function getBufferType(array) {
	if (array.BYTES_PER_ELEMENT === 4) {
		if (array instanceof Float32Array) return "Float32Array";
		else if (array instanceof Uint32Array) return "Uint32Array";
		return "Int32Array";
	} else if (array.BYTES_PER_ELEMENT === 2) {
		if (array instanceof Uint16Array) return "Uint16Array";
	} else if (array.BYTES_PER_ELEMENT === 1) {
		if (array instanceof Uint8Array) return "Uint8Array";
	}
	return null;
}
var map$2 = {
	Float32Array,
	Uint32Array,
	Int32Array,
	Uint8Array
};
function interleaveTypedArrays$1(arrays, sizes) {
	var outSize = 0;
	var stride = 0;
	var views = {};
	for (var i = 0; i < arrays.length; i++) {
		stride += sizes[i];
		outSize += arrays[i].length;
	}
	var buffer = /* @__PURE__ */ new ArrayBuffer(outSize * 4);
	var out = null;
	var littleOffset = 0;
	for (var i = 0; i < arrays.length; i++) {
		var size = sizes[i];
		var array = arrays[i];
		var type = getBufferType(array);
		if (!views[type]) views[type] = new map$2[type](buffer);
		out = views[type];
		for (var j = 0; j < array.length; j++) {
			var indexStart = (j / size | 0) * stride + littleOffset;
			var index = j % size;
			out[indexStart + index] = array[j];
		}
		littleOffset += size;
	}
	return new Float32Array(buffer);
}
/**
* Rounds to next power of two.
* @function nextPow2
* @memberof PIXI.utils
* @param {number} v - input value
* @returns {number} - next rounded power of two
*/
function nextPow2(v) {
	v += v === 0 ? 1 : 0;
	--v;
	v |= v >>> 1;
	v |= v >>> 2;
	v |= v >>> 4;
	v |= v >>> 8;
	v |= v >>> 16;
	return v + 1;
}
/**
* Checks if a number is a power of two.
* @function isPow2
* @memberof PIXI.utils
* @param {number} v - input value
* @returns {boolean} `true` if value is power of two
*/
function isPow2(v) {
	return !(v & v - 1) && !!v;
}
/**
* Computes ceil of log base 2
* @function log2
* @memberof PIXI.utils
* @param {number} v - input value
* @returns {number} logarithm base 2
*/
function log2(v) {
	var r = (v > 65535 ? 1 : 0) << 4;
	v >>>= r;
	var shift = (v > 255 ? 1 : 0) << 3;
	v >>>= shift;
	r |= shift;
	shift = (v > 15 ? 1 : 0) << 2;
	v >>>= shift;
	r |= shift;
	shift = (v > 3 ? 1 : 0) << 1;
	v >>>= shift;
	r |= shift;
	return r | v >> 1;
}
/**
* Remove items from a javascript array without generating garbage
* @function removeItems
* @memberof PIXI.utils
* @param {Array<any>} arr - Array to remove elements from
* @param {number} startIdx - starting index
* @param {number} removeCount - how many to remove
*/
function removeItems(arr, startIdx, removeCount) {
	var length = arr.length;
	var i;
	if (startIdx >= length || removeCount === 0) return;
	removeCount = startIdx + removeCount > length ? length - startIdx : removeCount;
	var len = length - removeCount;
	for (i = startIdx; i < len; ++i) arr[i] = arr[i + removeCount];
	arr.length = len;
}
/**
* Returns sign of number
* @memberof PIXI.utils
* @function sign
* @param {number} n - the number to check the sign of
* @returns {number} 0 if `n` is 0, -1 if `n` is negative, 1 if `n` is positive
*/
function sign(n) {
	if (n === 0) return 0;
	return n < 0 ? -1 : 1;
}
var nextUid = 0;
/**
* Gets the next unique identifier
* @memberof PIXI.utils
* @function uid
* @returns {number} The next unique identifier to use.
*/
function uid() {
	return ++nextUid;
}
var warnings = {};
/**
* Helper for warning developers about deprecated features & settings.
* A stack track for warnings is given; useful for tracking-down where
* deprecated methods/properties/classes are being used within the code.
* @memberof PIXI.utils
* @function deprecation
* @param {string} version - The version where the feature became deprecated
* @param {string} message - Message should include what is deprecated, where, and the new solution
* @param {number} [ignoreDepth=3] - The number of steps to ignore at the top of the error stack
*        this is mostly to ignore internal deprecation calls.
*/
function deprecation(version, message, ignoreDepth) {
	if (ignoreDepth === void 0) ignoreDepth = 3;
	if (warnings[message]) return;
	var stack = (/* @__PURE__ */ new Error()).stack;
	if (typeof stack === "undefined") console.warn("PixiJS Deprecation Warning: ", message + "\nDeprecated since v" + version);
	else {
		stack = stack.split("\n").splice(ignoreDepth).join("\n");
		if (console.groupCollapsed) {
			console.groupCollapsed("%cPixiJS Deprecation Warning: %c%s", "color:#614108;background:#fffbe6", "font-weight:normal;color:#614108;background:#fffbe6", message + "\nDeprecated since v" + version);
			console.warn(stack);
			console.groupEnd();
		} else {
			console.warn("PixiJS Deprecation Warning: ", message + "\nDeprecated since v" + version);
			console.warn(stack);
		}
	}
	warnings[message] = true;
}
/**
* @todo Describe property usage
* @static
* @name ProgramCache
* @memberof PIXI.utils
* @type {object}
*/
var ProgramCache = {};
/**
* @todo Describe property usage
* @static
* @name TextureCache
* @memberof PIXI.utils
* @type {object}
*/
var TextureCache = Object.create(null);
/**
* @todo Describe property usage
* @static
* @name BaseTextureCache
* @memberof PIXI.utils
* @type {object}
*/
var BaseTextureCache = Object.create(null);
/**
* Destroys all texture in the cache
* @memberof PIXI.utils
* @function destroyTextureCache
*/
function destroyTextureCache() {
	var key;
	for (key in TextureCache) TextureCache[key].destroy();
	for (key in BaseTextureCache) BaseTextureCache[key].destroy();
}
/**
* Removes all textures from cache, but does not destroy them
* @memberof PIXI.utils
* @function clearTextureCache
*/
function clearTextureCache() {
	var key;
	for (key in TextureCache) delete TextureCache[key];
	for (key in BaseTextureCache) delete BaseTextureCache[key];
}
/**
* Creates a Canvas element of the given size to be used as a target for rendering to.
* @class
* @memberof PIXI.utils
*/
var CanvasRenderTarget = function() {
	/**
	* @param width - the width for the newly created canvas
	* @param height - the height for the newly created canvas
	* @param {number} [resolution=PIXI.settings.RESOLUTION] - The resolution / device pixel ratio of the canvas
	*/
	function CanvasRenderTarget(width, height, resolution) {
		this.canvas = settings.ADAPTER.createCanvas();
		this.context = this.canvas.getContext("2d");
		this.resolution = resolution || settings.RESOLUTION;
		this.resize(width, height);
	}
	/**
	* Clears the canvas that was created by the CanvasRenderTarget class.
	* @private
	*/
	CanvasRenderTarget.prototype.clear = function() {
		this.context.setTransform(1, 0, 0, 1, 0, 0);
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	};
	/**
	* Resizes the canvas to the specified width and height.
	* @param desiredWidth - the desired width of the canvas
	* @param desiredHeight - the desired height of the canvas
	*/
	CanvasRenderTarget.prototype.resize = function(desiredWidth, desiredHeight) {
		this.canvas.width = Math.round(desiredWidth * this.resolution);
		this.canvas.height = Math.round(desiredHeight * this.resolution);
	};
	/** Destroys this canvas. */
	CanvasRenderTarget.prototype.destroy = function() {
		this.context = null;
		this.canvas = null;
	};
	Object.defineProperty(CanvasRenderTarget.prototype, "width", {
		/**
		* The width of the canvas buffer in pixels.
		* @member {number}
		*/
		get: function() {
			return this.canvas.width;
		},
		set: function(val) {
			this.canvas.width = Math.round(val);
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(CanvasRenderTarget.prototype, "height", {
		/**
		* The height of the canvas buffer in pixels.
		* @member {number}
		*/
		get: function() {
			return this.canvas.height;
		},
		set: function(val) {
			this.canvas.height = Math.round(val);
		},
		enumerable: false,
		configurable: true
	});
	return CanvasRenderTarget;
}();
/**
* Trim transparent borders from a canvas
* @memberof PIXI.utils
* @function trimCanvas
* @param {HTMLCanvasElement} canvas - the canvas to trim
* @returns {object} Trim data
*/
function trimCanvas(canvas) {
	var width = canvas.width;
	var height = canvas.height;
	var context = canvas.getContext("2d", { willReadFrequently: true });
	var pixels = context.getImageData(0, 0, width, height).data;
	var len = pixels.length;
	var bound = {
		top: null,
		left: null,
		right: null,
		bottom: null
	};
	var data = null;
	var i;
	var x;
	var y;
	for (i = 0; i < len; i += 4) if (pixels[i + 3] !== 0) {
		x = i / 4 % width;
		y = ~~(i / 4 / width);
		if (bound.top === null) bound.top = y;
		if (bound.left === null) bound.left = x;
		else if (x < bound.left) bound.left = x;
		if (bound.right === null) bound.right = x + 1;
		else if (bound.right < x) bound.right = x + 1;
		if (bound.bottom === null) bound.bottom = y;
		else if (bound.bottom < y) bound.bottom = y;
	}
	if (bound.top !== null) {
		width = bound.right - bound.left;
		height = bound.bottom - bound.top + 1;
		data = context.getImageData(bound.left, bound.top, width, height);
	}
	return {
		height,
		width,
		data
	};
}
/**
* Regexp for data URI.
* Based on: {@link https://github.com/ragingwind/data-uri-regex}
* @static
* @constant {RegExp|string} DATA_URI
* @memberof PIXI
* @example data:image/png;base64
*/
var DATA_URI = /^\s*data:(?:([\w-]+)\/([\w+.-]+))?(?:;charset=([\w-]+))?(?:;(base64))?,(.*)/i;
/**
* @memberof PIXI.utils
* @interface DecomposedDataUri
*/
/**
* type, eg. `image`
* @memberof PIXI.utils.DecomposedDataUri#
* @member {string} mediaType
*/
/**
* Sub type, eg. `png`
* @memberof PIXI.utils.DecomposedDataUri#
* @member {string} subType
*/
/**
* @memberof PIXI.utils.DecomposedDataUri#
* @member {string} charset
*/
/**
* Data encoding, eg. `base64`
* @memberof PIXI.utils.DecomposedDataUri#
* @member {string} encoding
*/
/**
* The actual data
* @memberof PIXI.utils.DecomposedDataUri#
* @member {string} data
*/
/**
* Split a data URI into components. Returns undefined if
* parameter `dataUri` is not a valid data URI.
* @memberof PIXI.utils
* @function decomposeDataUri
* @param {string} dataUri - the data URI to check
* @returns {PIXI.utils.DecomposedDataUri|undefined} The decomposed data uri or undefined
*/
function decomposeDataUri(dataUri) {
	var dataUriMatch = DATA_URI.exec(dataUri);
	if (dataUriMatch) return {
		mediaType: dataUriMatch[1] ? dataUriMatch[1].toLowerCase() : void 0,
		subType: dataUriMatch[2] ? dataUriMatch[2].toLowerCase() : void 0,
		charset: dataUriMatch[3] ? dataUriMatch[3].toLowerCase() : void 0,
		encoding: dataUriMatch[4] ? dataUriMatch[4].toLowerCase() : void 0,
		data: dataUriMatch[5]
	};
}
var tempAnchor;
/**
* Sets the `crossOrigin` property for this resource based on if the url
* for this resource is cross-origin. If crossOrigin was manually set, this
* function does nothing.
* Nipped from the resource loader!
* @ignore
* @param {string} url - The url to test.
* @param {object} [loc=window.location] - The location object to test against.
* @returns {string} The crossOrigin value to use (or empty string for none).
*/
function determineCrossOrigin(url$1, loc) {
	if (loc === void 0) loc = globalThis.location;
	if (url$1.indexOf("data:") === 0) return "";
	loc = loc || globalThis.location;
	if (!tempAnchor) tempAnchor = document.createElement("a");
	tempAnchor.href = url$1;
	var parsedUrl = url.parse(tempAnchor.href);
	var samePort = !parsedUrl.port && loc.port === "" || parsedUrl.port === loc.port;
	if (parsedUrl.hostname !== loc.hostname || !samePort || parsedUrl.protocol !== loc.protocol) return "anonymous";
	return "";
}
/**
* get the resolution / device pixel ratio of an asset by looking for the prefix
* used by spritesheets and image urls
* @memberof PIXI.utils
* @function getResolutionOfUrl
* @param {string} url - the image path
* @param {number} [defaultValue=1] - the defaultValue if no filename prefix is set.
* @returns {number} resolution / device pixel ratio of an asset
*/
function getResolutionOfUrl(url, defaultValue) {
	var resolution = settings.RETINA_PREFIX.exec(url);
	if (resolution) return parseFloat(resolution[1]);
	return defaultValue !== void 0 ? defaultValue : 1;
}
//#endregion
//#region node_modules/@pixi/math/dist/esm/math.mjs
/*!
* @pixi/math - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/math is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/**
* Two Pi.
* @static
* @member {number}
* @memberof PIXI
*/
var PI_2 = Math.PI * 2;
/**
* Conversion factor for converting radians to degrees.
* @static
* @member {number} RAD_TO_DEG
* @memberof PIXI
*/
var RAD_TO_DEG = 180 / Math.PI;
/**
* Conversion factor for converting degrees to radians.
* @static
* @member {number}
* @memberof PIXI
*/
var DEG_TO_RAD = Math.PI / 180;
/**
* Constants that identify shapes, mainly to prevent `instanceof` calls.
* @static
* @memberof PIXI
* @enum {number}
* @property {number} POLY Polygon
* @property {number} RECT Rectangle
* @property {number} CIRC Circle
* @property {number} ELIP Ellipse
* @property {number} RREC Rounded Rectangle
*/
var SHAPES;
(function(SHAPES) {
	SHAPES[SHAPES["POLY"] = 0] = "POLY";
	SHAPES[SHAPES["RECT"] = 1] = "RECT";
	SHAPES[SHAPES["CIRC"] = 2] = "CIRC";
	SHAPES[SHAPES["ELIP"] = 3] = "ELIP";
	SHAPES[SHAPES["RREC"] = 4] = "RREC";
})(SHAPES || (SHAPES = {}));
/**
* The Point object represents a location in a two-dimensional coordinate system, where `x` represents
* the position on the horizontal axis and `y` represents the position on the vertical axis
* @class
* @memberof PIXI
* @implements {IPoint}
*/
var Point = function() {
	/**
	* Creates a new `Point`
	* @param {number} [x=0] - position of the point on the x axis
	* @param {number} [y=0] - position of the point on the y axis
	*/
	function Point(x, y) {
		if (x === void 0) x = 0;
		if (y === void 0) y = 0;
		/** Position of the point on the x axis */
		this.x = 0;
		/** Position of the point on the y axis */
		this.y = 0;
		this.x = x;
		this.y = y;
	}
	/**
	* Creates a clone of this point
	* @returns A clone of this point
	*/
	Point.prototype.clone = function() {
		return new Point(this.x, this.y);
	};
	/**
	* Copies `x` and `y` from the given point into this point
	* @param p - The point to copy from
	* @returns The point instance itself
	*/
	Point.prototype.copyFrom = function(p) {
		this.set(p.x, p.y);
		return this;
	};
	/**
	* Copies this point's x and y into the given point (`p`).
	* @param p - The point to copy to. Can be any of type that is or extends `IPointData`
	* @returns The point (`p`) with values updated
	*/
	Point.prototype.copyTo = function(p) {
		p.set(this.x, this.y);
		return p;
	};
	/**
	* Accepts another point (`p`) and returns `true` if the given point is equal to this point
	* @param p - The point to check
	* @returns Returns `true` if both `x` and `y` are equal
	*/
	Point.prototype.equals = function(p) {
		return p.x === this.x && p.y === this.y;
	};
	/**
	* Sets the point to a new `x` and `y` position.
	* If `y` is omitted, both `x` and `y` will be set to `x`.
	* @param {number} [x=0] - position of the point on the `x` axis
	* @param {number} [y=x] - position of the point on the `y` axis
	* @returns The point instance itself
	*/
	Point.prototype.set = function(x, y) {
		if (x === void 0) x = 0;
		if (y === void 0) y = x;
		this.x = x;
		this.y = y;
		return this;
	};
	Point.prototype.toString = function() {
		return "[@pixi/math:Point x=" + this.x + " y=" + this.y + "]";
	};
	return Point;
}();
var tempPoints$1 = [
	new Point(),
	new Point(),
	new Point(),
	new Point()
];
/**
* Size object, contains width and height
* @memberof PIXI
* @typedef {object} ISize
* @property {number} width - Width component
* @property {number} height - Height component
*/
/**
* Rectangle object is an area defined by its position, as indicated by its top-left corner
* point (x, y) and by its width and its height.
* @memberof PIXI
*/
var Rectangle = function() {
	/**
	* @param x - The X coordinate of the upper-left corner of the rectangle
	* @param y - The Y coordinate of the upper-left corner of the rectangle
	* @param width - The overall width of the rectangle
	* @param height - The overall height of the rectangle
	*/
	function Rectangle(x, y, width, height) {
		if (x === void 0) x = 0;
		if (y === void 0) y = 0;
		if (width === void 0) width = 0;
		if (height === void 0) height = 0;
		this.x = Number(x);
		this.y = Number(y);
		this.width = Number(width);
		this.height = Number(height);
		this.type = SHAPES.RECT;
	}
	Object.defineProperty(Rectangle.prototype, "left", {
		/** Returns the left edge of the rectangle. */
		get: function() {
			return this.x;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Rectangle.prototype, "right", {
		/** Returns the right edge of the rectangle. */
		get: function() {
			return this.x + this.width;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Rectangle.prototype, "top", {
		/** Returns the top edge of the rectangle. */
		get: function() {
			return this.y;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Rectangle.prototype, "bottom", {
		/** Returns the bottom edge of the rectangle. */
		get: function() {
			return this.y + this.height;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Rectangle, "EMPTY", {
		/** A constant empty rectangle. */
		get: function() {
			return new Rectangle(0, 0, 0, 0);
		},
		enumerable: false,
		configurable: true
	});
	/**
	* Creates a clone of this Rectangle
	* @returns a copy of the rectangle
	*/
	Rectangle.prototype.clone = function() {
		return new Rectangle(this.x, this.y, this.width, this.height);
	};
	/**
	* Copies another rectangle to this one.
	* @param rectangle - The rectangle to copy from.
	* @returns Returns itself.
	*/
	Rectangle.prototype.copyFrom = function(rectangle) {
		this.x = rectangle.x;
		this.y = rectangle.y;
		this.width = rectangle.width;
		this.height = rectangle.height;
		return this;
	};
	/**
	* Copies this rectangle to another one.
	* @param rectangle - The rectangle to copy to.
	* @returns Returns given parameter.
	*/
	Rectangle.prototype.copyTo = function(rectangle) {
		rectangle.x = this.x;
		rectangle.y = this.y;
		rectangle.width = this.width;
		rectangle.height = this.height;
		return rectangle;
	};
	/**
	* Checks whether the x and y coordinates given are contained within this Rectangle
	* @param x - The X coordinate of the point to test
	* @param y - The Y coordinate of the point to test
	* @returns Whether the x/y coordinates are within this Rectangle
	*/
	Rectangle.prototype.contains = function(x, y) {
		if (this.width <= 0 || this.height <= 0) return false;
		if (x >= this.x && x < this.x + this.width) {
			if (y >= this.y && y < this.y + this.height) return true;
		}
		return false;
	};
	/**
	* Determines whether the `other` Rectangle transformed by `transform` intersects with `this` Rectangle object.
	* Returns true only if the area of the intersection is >0, this means that Rectangles
	* sharing a side are not overlapping. Another side effect is that an arealess rectangle
	* (width or height equal to zero) can't intersect any other rectangle.
	* @param {Rectangle} other - The Rectangle to intersect with `this`.
	* @param {Matrix} transform - The transformation matrix of `other`.
	* @returns {boolean} A value of `true` if the transformed `other` Rectangle intersects with `this`; otherwise `false`.
	*/
	Rectangle.prototype.intersects = function(other, transform) {
		if (!transform) {
			var x0_1 = this.x < other.x ? other.x : this.x;
			if ((this.right > other.right ? other.right : this.right) <= x0_1) return false;
			var y0_1 = this.y < other.y ? other.y : this.y;
			return (this.bottom > other.bottom ? other.bottom : this.bottom) > y0_1;
		}
		var x0 = this.left;
		var x1 = this.right;
		var y0 = this.top;
		var y1 = this.bottom;
		if (x1 <= x0 || y1 <= y0) return false;
		var lt = tempPoints$1[0].set(other.left, other.top);
		var lb = tempPoints$1[1].set(other.left, other.bottom);
		var rt = tempPoints$1[2].set(other.right, other.top);
		var rb = tempPoints$1[3].set(other.right, other.bottom);
		if (rt.x <= lt.x || lb.y <= lt.y) return false;
		var s = Math.sign(transform.a * transform.d - transform.b * transform.c);
		if (s === 0) return false;
		transform.apply(lt, lt);
		transform.apply(lb, lb);
		transform.apply(rt, rt);
		transform.apply(rb, rb);
		if (Math.max(lt.x, lb.x, rt.x, rb.x) <= x0 || Math.min(lt.x, lb.x, rt.x, rb.x) >= x1 || Math.max(lt.y, lb.y, rt.y, rb.y) <= y0 || Math.min(lt.y, lb.y, rt.y, rb.y) >= y1) return false;
		var nx = s * (lb.y - lt.y);
		var ny = s * (lt.x - lb.x);
		var n00 = nx * x0 + ny * y0;
		var n10 = nx * x1 + ny * y0;
		var n01 = nx * x0 + ny * y1;
		var n11 = nx * x1 + ny * y1;
		if (Math.max(n00, n10, n01, n11) <= nx * lt.x + ny * lt.y || Math.min(n00, n10, n01, n11) >= nx * rb.x + ny * rb.y) return false;
		var mx = s * (lt.y - rt.y);
		var my = s * (rt.x - lt.x);
		var m00 = mx * x0 + my * y0;
		var m10 = mx * x1 + my * y0;
		var m01 = mx * x0 + my * y1;
		var m11 = mx * x1 + my * y1;
		if (Math.max(m00, m10, m01, m11) <= mx * lt.x + my * lt.y || Math.min(m00, m10, m01, m11) >= mx * rb.x + my * rb.y) return false;
		return true;
	};
	/**
	* Pads the rectangle making it grow in all directions.
	* If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
	* @param paddingX - The horizontal padding amount.
	* @param paddingY - The vertical padding amount.
	* @returns Returns itself.
	*/
	Rectangle.prototype.pad = function(paddingX, paddingY) {
		if (paddingX === void 0) paddingX = 0;
		if (paddingY === void 0) paddingY = paddingX;
		this.x -= paddingX;
		this.y -= paddingY;
		this.width += paddingX * 2;
		this.height += paddingY * 2;
		return this;
	};
	/**
	* Fits this rectangle around the passed one.
	* @param rectangle - The rectangle to fit.
	* @returns Returns itself.
	*/
	Rectangle.prototype.fit = function(rectangle) {
		var x1 = Math.max(this.x, rectangle.x);
		var x2 = Math.min(this.x + this.width, rectangle.x + rectangle.width);
		var y1 = Math.max(this.y, rectangle.y);
		var y2 = Math.min(this.y + this.height, rectangle.y + rectangle.height);
		this.x = x1;
		this.width = Math.max(x2 - x1, 0);
		this.y = y1;
		this.height = Math.max(y2 - y1, 0);
		return this;
	};
	/**
	* Enlarges rectangle that way its corners lie on grid
	* @param resolution - resolution
	* @param eps - precision
	* @returns Returns itself.
	*/
	Rectangle.prototype.ceil = function(resolution, eps) {
		if (resolution === void 0) resolution = 1;
		if (eps === void 0) eps = .001;
		var x2 = Math.ceil((this.x + this.width - eps) * resolution) / resolution;
		var y2 = Math.ceil((this.y + this.height - eps) * resolution) / resolution;
		this.x = Math.floor((this.x + eps) * resolution) / resolution;
		this.y = Math.floor((this.y + eps) * resolution) / resolution;
		this.width = x2 - this.x;
		this.height = y2 - this.y;
		return this;
	};
	/**
	* Enlarges this rectangle to include the passed rectangle.
	* @param rectangle - The rectangle to include.
	* @returns Returns itself.
	*/
	Rectangle.prototype.enlarge = function(rectangle) {
		var x1 = Math.min(this.x, rectangle.x);
		var x2 = Math.max(this.x + this.width, rectangle.x + rectangle.width);
		var y1 = Math.min(this.y, rectangle.y);
		var y2 = Math.max(this.y + this.height, rectangle.y + rectangle.height);
		this.x = x1;
		this.width = x2 - x1;
		this.y = y1;
		this.height = y2 - y1;
		return this;
	};
	Rectangle.prototype.toString = function() {
		return "[@pixi/math:Rectangle x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + "]";
	};
	return Rectangle;
}();
/**
* The Circle object is used to help draw graphics and can also be used to specify a hit area for displayObjects.
* @memberof PIXI
*/
var Circle = function() {
	/**
	* @param x - The X coordinate of the center of this circle
	* @param y - The Y coordinate of the center of this circle
	* @param radius - The radius of the circle
	*/
	function Circle(x, y, radius) {
		if (x === void 0) x = 0;
		if (y === void 0) y = 0;
		if (radius === void 0) radius = 0;
		this.x = x;
		this.y = y;
		this.radius = radius;
		this.type = SHAPES.CIRC;
	}
	/**
	* Creates a clone of this Circle instance
	* @returns A copy of the Circle
	*/
	Circle.prototype.clone = function() {
		return new Circle(this.x, this.y, this.radius);
	};
	/**
	* Checks whether the x and y coordinates given are contained within this circle
	* @param x - The X coordinate of the point to test
	* @param y - The Y coordinate of the point to test
	* @returns Whether the x/y coordinates are within this Circle
	*/
	Circle.prototype.contains = function(x, y) {
		if (this.radius <= 0) return false;
		var r2 = this.radius * this.radius;
		var dx = this.x - x;
		var dy = this.y - y;
		dx *= dx;
		dy *= dy;
		return dx + dy <= r2;
	};
	/**
	* Returns the framing rectangle of the circle as a Rectangle object
	* @returns The framing rectangle
	*/
	Circle.prototype.getBounds = function() {
		return new Rectangle(this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
	};
	Circle.prototype.toString = function() {
		return "[@pixi/math:Circle x=" + this.x + " y=" + this.y + " radius=" + this.radius + "]";
	};
	return Circle;
}();
/**
* The Ellipse object is used to help draw graphics and can also be used to specify a hit area for displayObjects.
* @memberof PIXI
*/
var Ellipse = function() {
	/**
	* @param x - The X coordinate of the center of this ellipse
	* @param y - The Y coordinate of the center of this ellipse
	* @param halfWidth - The half width of this ellipse
	* @param halfHeight - The half height of this ellipse
	*/
	function Ellipse(x, y, halfWidth, halfHeight) {
		if (x === void 0) x = 0;
		if (y === void 0) y = 0;
		if (halfWidth === void 0) halfWidth = 0;
		if (halfHeight === void 0) halfHeight = 0;
		this.x = x;
		this.y = y;
		this.width = halfWidth;
		this.height = halfHeight;
		this.type = SHAPES.ELIP;
	}
	/**
	* Creates a clone of this Ellipse instance
	* @returns {PIXI.Ellipse} A copy of the ellipse
	*/
	Ellipse.prototype.clone = function() {
		return new Ellipse(this.x, this.y, this.width, this.height);
	};
	/**
	* Checks whether the x and y coordinates given are contained within this ellipse
	* @param x - The X coordinate of the point to test
	* @param y - The Y coordinate of the point to test
	* @returns Whether the x/y coords are within this ellipse
	*/
	Ellipse.prototype.contains = function(x, y) {
		if (this.width <= 0 || this.height <= 0) return false;
		var normx = (x - this.x) / this.width;
		var normy = (y - this.y) / this.height;
		normx *= normx;
		normy *= normy;
		return normx + normy <= 1;
	};
	/**
	* Returns the framing rectangle of the ellipse as a Rectangle object
	* @returns The framing rectangle
	*/
	Ellipse.prototype.getBounds = function() {
		return new Rectangle(this.x - this.width, this.y - this.height, this.width, this.height);
	};
	Ellipse.prototype.toString = function() {
		return "[@pixi/math:Ellipse x=" + this.x + " y=" + this.y + " width=" + this.width + " height=" + this.height + "]";
	};
	return Ellipse;
}();
/**
* A class to define a shape via user defined coordinates.
* @memberof PIXI
*/
var Polygon = function() {
	/**
	* @param {PIXI.IPointData[]|number[]} points - This can be an array of Points
	*  that form the polygon, a flat array of numbers that will be interpreted as [x,y, x,y, ...], or
	*  the arguments passed can be all the points of the polygon e.g.
	*  `new PIXI.Polygon(new PIXI.Point(), new PIXI.Point(), ...)`, or the arguments passed can be flat
	*  x,y values e.g. `new Polygon(x,y, x,y, x,y, ...)` where `x` and `y` are Numbers.
	*/
	function Polygon() {
		var arguments$1 = arguments;
		var points = [];
		for (var _i = 0; _i < arguments.length; _i++) points[_i] = arguments$1[_i];
		var flat = Array.isArray(points[0]) ? points[0] : points;
		if (typeof flat[0] !== "number") {
			var p = [];
			for (var i = 0, il = flat.length; i < il; i++) p.push(flat[i].x, flat[i].y);
			flat = p;
		}
		this.points = flat;
		this.type = SHAPES.POLY;
		this.closeStroke = true;
	}
	/**
	* Creates a clone of this polygon.
	* @returns - A copy of the polygon.
	*/
	Polygon.prototype.clone = function() {
		var polygon = new Polygon(this.points.slice());
		polygon.closeStroke = this.closeStroke;
		return polygon;
	};
	/**
	* Checks whether the x and y coordinates passed to this function are contained within this polygon.
	* @param x - The X coordinate of the point to test.
	* @param y - The Y coordinate of the point to test.
	* @returns - Whether the x/y coordinates are within this polygon.
	*/
	Polygon.prototype.contains = function(x, y) {
		var inside = false;
		var length = this.points.length / 2;
		for (var i = 0, j = length - 1; i < length; j = i++) {
			var xi = this.points[i * 2];
			var yi = this.points[i * 2 + 1];
			var xj = this.points[j * 2];
			var yj = this.points[j * 2 + 1];
			if (yi > y !== yj > y && x < (xj - xi) * ((y - yi) / (yj - yi)) + xi) inside = !inside;
		}
		return inside;
	};
	Polygon.prototype.toString = function() {
		return "[@pixi/math:Polygon" + ("closeStroke=" + this.closeStroke) + ("points=" + this.points.reduce(function(pointsDesc, currentPoint) {
			return pointsDesc + ", " + currentPoint;
		}, "") + "]");
	};
	return Polygon;
}();
/**
* The Rounded Rectangle object is an area that has nice rounded corners, as indicated by its
* top-left corner point (x, y) and by its width and its height and its radius.
* @memberof PIXI
*/
var RoundedRectangle = function() {
	/**
	* @param x - The X coordinate of the upper-left corner of the rounded rectangle
	* @param y - The Y coordinate of the upper-left corner of the rounded rectangle
	* @param width - The overall width of this rounded rectangle
	* @param height - The overall height of this rounded rectangle
	* @param radius - Controls the radius of the rounded corners
	*/
	function RoundedRectangle(x, y, width, height, radius) {
		if (x === void 0) x = 0;
		if (y === void 0) y = 0;
		if (width === void 0) width = 0;
		if (height === void 0) height = 0;
		if (radius === void 0) radius = 20;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.radius = radius;
		this.type = SHAPES.RREC;
	}
	/**
	* Creates a clone of this Rounded Rectangle.
	* @returns - A copy of the rounded rectangle.
	*/
	RoundedRectangle.prototype.clone = function() {
		return new RoundedRectangle(this.x, this.y, this.width, this.height, this.radius);
	};
	/**
	* Checks whether the x and y coordinates given are contained within this Rounded Rectangle
	* @param x - The X coordinate of the point to test.
	* @param y - The Y coordinate of the point to test.
	* @returns - Whether the x/y coordinates are within this Rounded Rectangle.
	*/
	RoundedRectangle.prototype.contains = function(x, y) {
		if (this.width <= 0 || this.height <= 0) return false;
		if (x >= this.x && x <= this.x + this.width) {
			if (y >= this.y && y <= this.y + this.height) {
				var radius = Math.max(0, Math.min(this.radius, Math.min(this.width, this.height) / 2));
				if (y >= this.y + radius && y <= this.y + this.height - radius || x >= this.x + radius && x <= this.x + this.width - radius) return true;
				var dx = x - (this.x + radius);
				var dy = y - (this.y + radius);
				var radius2 = radius * radius;
				if (dx * dx + dy * dy <= radius2) return true;
				dx = x - (this.x + this.width - radius);
				if (dx * dx + dy * dy <= radius2) return true;
				dy = y - (this.y + this.height - radius);
				if (dx * dx + dy * dy <= radius2) return true;
				dx = x - (this.x + radius);
				if (dx * dx + dy * dy <= radius2) return true;
			}
		}
		return false;
	};
	RoundedRectangle.prototype.toString = function() {
		return "[@pixi/math:RoundedRectangle x=" + this.x + " y=" + this.y + ("width=" + this.width + " height=" + this.height + " radius=" + this.radius + "]");
	};
	return RoundedRectangle;
}();
/**
* The ObservablePoint object represents a location in a two-dimensional coordinate system, where `x` represents
* the position on the horizontal axis and `y` represents the position on the vertical axis.
*
* An `ObservablePoint` is a point that triggers a callback when the point's position is changed.
* @memberof PIXI
*/
var ObservablePoint = function() {
	/**
	* Creates a new `ObservablePoint`
	* @param cb - callback function triggered when `x` and/or `y` are changed
	* @param scope - owner of callback
	* @param {number} [x=0] - position of the point on the x axis
	* @param {number} [y=0] - position of the point on the y axis
	*/
	function ObservablePoint(cb, scope, x, y) {
		if (x === void 0) x = 0;
		if (y === void 0) y = 0;
		this._x = x;
		this._y = y;
		this.cb = cb;
		this.scope = scope;
	}
	/**
	* Creates a clone of this point.
	* The callback and scope params can be overridden otherwise they will default
	* to the clone object's values.
	* @override
	* @param cb - The callback function triggered when `x` and/or `y` are changed
	* @param scope - The owner of the callback
	* @returns a copy of this observable point
	*/
	ObservablePoint.prototype.clone = function(cb, scope) {
		if (cb === void 0) cb = this.cb;
		if (scope === void 0) scope = this.scope;
		return new ObservablePoint(cb, scope, this._x, this._y);
	};
	/**
	* Sets the point to a new `x` and `y` position.
	* If `y` is omitted, both `x` and `y` will be set to `x`.
	* @param {number} [x=0] - position of the point on the x axis
	* @param {number} [y=x] - position of the point on the y axis
	* @returns The observable point instance itself
	*/
	ObservablePoint.prototype.set = function(x, y) {
		if (x === void 0) x = 0;
		if (y === void 0) y = x;
		if (this._x !== x || this._y !== y) {
			this._x = x;
			this._y = y;
			this.cb.call(this.scope);
		}
		return this;
	};
	/**
	* Copies x and y from the given point (`p`)
	* @param p - The point to copy from. Can be any of type that is or extends `IPointData`
	* @returns The observable point instance itself
	*/
	ObservablePoint.prototype.copyFrom = function(p) {
		if (this._x !== p.x || this._y !== p.y) {
			this._x = p.x;
			this._y = p.y;
			this.cb.call(this.scope);
		}
		return this;
	};
	/**
	* Copies this point's x and y into that of the given point (`p`)
	* @param p - The point to copy to. Can be any of type that is or extends `IPointData`
	* @returns The point (`p`) with values updated
	*/
	ObservablePoint.prototype.copyTo = function(p) {
		p.set(this._x, this._y);
		return p;
	};
	/**
	* Accepts another point (`p`) and returns `true` if the given point is equal to this point
	* @param p - The point to check
	* @returns Returns `true` if both `x` and `y` are equal
	*/
	ObservablePoint.prototype.equals = function(p) {
		return p.x === this._x && p.y === this._y;
	};
	ObservablePoint.prototype.toString = function() {
		return "[@pixi/math:ObservablePoint x=0 y=0 scope=" + this.scope + "]";
	};
	Object.defineProperty(ObservablePoint.prototype, "x", {
		/** Position of the observable point on the x axis. */
		get: function() {
			return this._x;
		},
		set: function(value) {
			if (this._x !== value) {
				this._x = value;
				this.cb.call(this.scope);
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(ObservablePoint.prototype, "y", {
		/** Position of the observable point on the y axis. */
		get: function() {
			return this._y;
		},
		set: function(value) {
			if (this._y !== value) {
				this._y = value;
				this.cb.call(this.scope);
			}
		},
		enumerable: false,
		configurable: true
	});
	return ObservablePoint;
}();
/**
* The PixiJS Matrix as a class makes it a lot faster.
*
* Here is a representation of it:
* ```js
* | a | c | tx|
* | b | d | ty|
* | 0 | 0 | 1 |
* ```
* @memberof PIXI
*/
var Matrix = function() {
	/**
	* @param a - x scale
	* @param b - y skew
	* @param c - x skew
	* @param d - y scale
	* @param tx - x translation
	* @param ty - y translation
	*/
	function Matrix(a, b, c, d, tx, ty) {
		if (a === void 0) a = 1;
		if (b === void 0) b = 0;
		if (c === void 0) c = 0;
		if (d === void 0) d = 1;
		if (tx === void 0) tx = 0;
		if (ty === void 0) ty = 0;
		this.array = null;
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
		this.tx = tx;
		this.ty = ty;
	}
	/**
	* Creates a Matrix object based on the given array. The Element to Matrix mapping order is as follows:
	*
	* a = array[0]
	* b = array[1]
	* c = array[3]
	* d = array[4]
	* tx = array[2]
	* ty = array[5]
	* @param array - The array that the matrix will be populated from.
	*/
	Matrix.prototype.fromArray = function(array) {
		this.a = array[0];
		this.b = array[1];
		this.c = array[3];
		this.d = array[4];
		this.tx = array[2];
		this.ty = array[5];
	};
	/**
	* Sets the matrix properties.
	* @param a - Matrix component
	* @param b - Matrix component
	* @param c - Matrix component
	* @param d - Matrix component
	* @param tx - Matrix component
	* @param ty - Matrix component
	* @returns This matrix. Good for chaining method calls.
	*/
	Matrix.prototype.set = function(a, b, c, d, tx, ty) {
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
		this.tx = tx;
		this.ty = ty;
		return this;
	};
	/**
	* Creates an array from the current Matrix object.
	* @param transpose - Whether we need to transpose the matrix or not
	* @param [out=new Float32Array(9)] - If provided the array will be assigned to out
	* @returns The newly created array which contains the matrix
	*/
	Matrix.prototype.toArray = function(transpose, out) {
		if (!this.array) this.array = /* @__PURE__ */ new Float32Array(9);
		var array = out || this.array;
		if (transpose) {
			array[0] = this.a;
			array[1] = this.b;
			array[2] = 0;
			array[3] = this.c;
			array[4] = this.d;
			array[5] = 0;
			array[6] = this.tx;
			array[7] = this.ty;
			array[8] = 1;
		} else {
			array[0] = this.a;
			array[1] = this.c;
			array[2] = this.tx;
			array[3] = this.b;
			array[4] = this.d;
			array[5] = this.ty;
			array[6] = 0;
			array[7] = 0;
			array[8] = 1;
		}
		return array;
	};
	/**
	* Get a new position with the current transformation applied.
	* Can be used to go from a child's coordinate space to the world coordinate space. (e.g. rendering)
	* @param pos - The origin
	* @param {PIXI.Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
	* @returns {PIXI.Point} The new point, transformed through this matrix
	*/
	Matrix.prototype.apply = function(pos, newPos) {
		newPos = newPos || new Point();
		var x = pos.x;
		var y = pos.y;
		newPos.x = this.a * x + this.c * y + this.tx;
		newPos.y = this.b * x + this.d * y + this.ty;
		return newPos;
	};
	/**
	* Get a new position with the inverse of the current transformation applied.
	* Can be used to go from the world coordinate space to a child's coordinate space. (e.g. input)
	* @param pos - The origin
	* @param {PIXI.Point} [newPos] - The point that the new position is assigned to (allowed to be same as input)
	* @returns {PIXI.Point} The new point, inverse-transformed through this matrix
	*/
	Matrix.prototype.applyInverse = function(pos, newPos) {
		newPos = newPos || new Point();
		var id = 1 / (this.a * this.d + this.c * -this.b);
		var x = pos.x;
		var y = pos.y;
		newPos.x = this.d * id * x + -this.c * id * y + (this.ty * this.c - this.tx * this.d) * id;
		newPos.y = this.a * id * y + -this.b * id * x + (-this.ty * this.a + this.tx * this.b) * id;
		return newPos;
	};
	/**
	* Translates the matrix on the x and y.
	* @param x - How much to translate x by
	* @param y - How much to translate y by
	* @returns This matrix. Good for chaining method calls.
	*/
	Matrix.prototype.translate = function(x, y) {
		this.tx += x;
		this.ty += y;
		return this;
	};
	/**
	* Applies a scale transformation to the matrix.
	* @param x - The amount to scale horizontally
	* @param y - The amount to scale vertically
	* @returns This matrix. Good for chaining method calls.
	*/
	Matrix.prototype.scale = function(x, y) {
		this.a *= x;
		this.d *= y;
		this.c *= x;
		this.b *= y;
		this.tx *= x;
		this.ty *= y;
		return this;
	};
	/**
	* Applies a rotation transformation to the matrix.
	* @param angle - The angle in radians.
	* @returns This matrix. Good for chaining method calls.
	*/
	Matrix.prototype.rotate = function(angle) {
		var cos = Math.cos(angle);
		var sin = Math.sin(angle);
		var a1 = this.a;
		var c1 = this.c;
		var tx1 = this.tx;
		this.a = a1 * cos - this.b * sin;
		this.b = a1 * sin + this.b * cos;
		this.c = c1 * cos - this.d * sin;
		this.d = c1 * sin + this.d * cos;
		this.tx = tx1 * cos - this.ty * sin;
		this.ty = tx1 * sin + this.ty * cos;
		return this;
	};
	/**
	* Appends the given Matrix to this Matrix.
	* @param matrix - The matrix to append.
	* @returns This matrix. Good for chaining method calls.
	*/
	Matrix.prototype.append = function(matrix) {
		var a1 = this.a;
		var b1 = this.b;
		var c1 = this.c;
		var d1 = this.d;
		this.a = matrix.a * a1 + matrix.b * c1;
		this.b = matrix.a * b1 + matrix.b * d1;
		this.c = matrix.c * a1 + matrix.d * c1;
		this.d = matrix.c * b1 + matrix.d * d1;
		this.tx = matrix.tx * a1 + matrix.ty * c1 + this.tx;
		this.ty = matrix.tx * b1 + matrix.ty * d1 + this.ty;
		return this;
	};
	/**
	* Sets the matrix based on all the available properties
	* @param x - Position on the x axis
	* @param y - Position on the y axis
	* @param pivotX - Pivot on the x axis
	* @param pivotY - Pivot on the y axis
	* @param scaleX - Scale on the x axis
	* @param scaleY - Scale on the y axis
	* @param rotation - Rotation in radians
	* @param skewX - Skew on the x axis
	* @param skewY - Skew on the y axis
	* @returns This matrix. Good for chaining method calls.
	*/
	Matrix.prototype.setTransform = function(x, y, pivotX, pivotY, scaleX, scaleY, rotation, skewX, skewY) {
		this.a = Math.cos(rotation + skewY) * scaleX;
		this.b = Math.sin(rotation + skewY) * scaleX;
		this.c = -Math.sin(rotation - skewX) * scaleY;
		this.d = Math.cos(rotation - skewX) * scaleY;
		this.tx = x - (pivotX * this.a + pivotY * this.c);
		this.ty = y - (pivotX * this.b + pivotY * this.d);
		return this;
	};
	/**
	* Prepends the given Matrix to this Matrix.
	* @param matrix - The matrix to prepend
	* @returns This matrix. Good for chaining method calls.
	*/
	Matrix.prototype.prepend = function(matrix) {
		var tx1 = this.tx;
		if (matrix.a !== 1 || matrix.b !== 0 || matrix.c !== 0 || matrix.d !== 1) {
			var a1 = this.a;
			var c1 = this.c;
			this.a = a1 * matrix.a + this.b * matrix.c;
			this.b = a1 * matrix.b + this.b * matrix.d;
			this.c = c1 * matrix.a + this.d * matrix.c;
			this.d = c1 * matrix.b + this.d * matrix.d;
		}
		this.tx = tx1 * matrix.a + this.ty * matrix.c + matrix.tx;
		this.ty = tx1 * matrix.b + this.ty * matrix.d + matrix.ty;
		return this;
	};
	/**
	* Decomposes the matrix (x, y, scaleX, scaleY, and rotation) and sets the properties on to a transform.
	* @param transform - The transform to apply the properties to.
	* @returns The transform with the newly applied properties
	*/
	Matrix.prototype.decompose = function(transform) {
		var a = this.a;
		var b = this.b;
		var c = this.c;
		var d = this.d;
		var pivot = transform.pivot;
		var skewX = -Math.atan2(-c, d);
		var skewY = Math.atan2(b, a);
		var delta = Math.abs(skewX + skewY);
		if (delta < 1e-5 || Math.abs(PI_2 - delta) < 1e-5) {
			transform.rotation = skewY;
			transform.skew.x = transform.skew.y = 0;
		} else {
			transform.rotation = 0;
			transform.skew.x = skewX;
			transform.skew.y = skewY;
		}
		transform.scale.x = Math.sqrt(a * a + b * b);
		transform.scale.y = Math.sqrt(c * c + d * d);
		transform.position.x = this.tx + (pivot.x * a + pivot.y * c);
		transform.position.y = this.ty + (pivot.x * b + pivot.y * d);
		return transform;
	};
	/**
	* Inverts this matrix
	* @returns This matrix. Good for chaining method calls.
	*/
	Matrix.prototype.invert = function() {
		var a1 = this.a;
		var b1 = this.b;
		var c1 = this.c;
		var d1 = this.d;
		var tx1 = this.tx;
		var n = a1 * d1 - b1 * c1;
		this.a = d1 / n;
		this.b = -b1 / n;
		this.c = -c1 / n;
		this.d = a1 / n;
		this.tx = (c1 * this.ty - d1 * tx1) / n;
		this.ty = -(a1 * this.ty - b1 * tx1) / n;
		return this;
	};
	/**
	* Resets this Matrix to an identity (default) matrix.
	* @returns This matrix. Good for chaining method calls.
	*/
	Matrix.prototype.identity = function() {
		this.a = 1;
		this.b = 0;
		this.c = 0;
		this.d = 1;
		this.tx = 0;
		this.ty = 0;
		return this;
	};
	/**
	* Creates a new Matrix object with the same values as this one.
	* @returns A copy of this matrix. Good for chaining method calls.
	*/
	Matrix.prototype.clone = function() {
		var matrix = new Matrix();
		matrix.a = this.a;
		matrix.b = this.b;
		matrix.c = this.c;
		matrix.d = this.d;
		matrix.tx = this.tx;
		matrix.ty = this.ty;
		return matrix;
	};
	/**
	* Changes the values of the given matrix to be the same as the ones in this matrix
	* @param matrix - The matrix to copy to.
	* @returns The matrix given in parameter with its values updated.
	*/
	Matrix.prototype.copyTo = function(matrix) {
		matrix.a = this.a;
		matrix.b = this.b;
		matrix.c = this.c;
		matrix.d = this.d;
		matrix.tx = this.tx;
		matrix.ty = this.ty;
		return matrix;
	};
	/**
	* Changes the values of the matrix to be the same as the ones in given matrix
	* @param {PIXI.Matrix} matrix - The matrix to copy from.
	* @returns {PIXI.Matrix} this
	*/
	Matrix.prototype.copyFrom = function(matrix) {
		this.a = matrix.a;
		this.b = matrix.b;
		this.c = matrix.c;
		this.d = matrix.d;
		this.tx = matrix.tx;
		this.ty = matrix.ty;
		return this;
	};
	Matrix.prototype.toString = function() {
		return "[@pixi/math:Matrix a=" + this.a + " b=" + this.b + " c=" + this.c + " d=" + this.d + " tx=" + this.tx + " ty=" + this.ty + "]";
	};
	Object.defineProperty(Matrix, "IDENTITY", {
		/**
		* A default (identity) matrix
		* @readonly
		*/
		get: function() {
			return new Matrix();
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Matrix, "TEMP_MATRIX", {
		/**
		* A temp matrix
		* @readonly
		*/
		get: function() {
			return new Matrix();
		},
		enumerable: false,
		configurable: true
	});
	return Matrix;
}();
var ux = [
	1,
	1,
	0,
	-1,
	-1,
	-1,
	0,
	1,
	1,
	1,
	0,
	-1,
	-1,
	-1,
	0,
	1
];
var uy = [
	0,
	1,
	1,
	1,
	0,
	-1,
	-1,
	-1,
	0,
	1,
	1,
	1,
	0,
	-1,
	-1,
	-1
];
var vx = [
	0,
	-1,
	-1,
	-1,
	0,
	1,
	1,
	1,
	0,
	1,
	1,
	1,
	0,
	-1,
	-1,
	-1
];
var vy = [
	1,
	1,
	0,
	-1,
	-1,
	-1,
	0,
	1,
	-1,
	-1,
	0,
	1,
	1,
	1,
	0,
	-1
];
/**
* [Cayley Table]{@link https://en.wikipedia.org/wiki/Cayley_table}
* for the composition of each rotation in the dihederal group D8.
* @type {number[][]}
* @private
*/
var rotationCayley = [];
/**
* Matrices for each `GD8Symmetry` rotation.
* @type {PIXI.Matrix[]}
* @private
*/
var rotationMatrices = [];
var signum = Math.sign;
function init() {
	for (var i = 0; i < 16; i++) {
		var row = [];
		rotationCayley.push(row);
		for (var j = 0; j < 16; j++) {
			var _ux = signum(ux[i] * ux[j] + vx[i] * uy[j]);
			var _uy = signum(uy[i] * ux[j] + vy[i] * uy[j]);
			var _vx = signum(ux[i] * vx[j] + vx[i] * vy[j]);
			var _vy = signum(uy[i] * vx[j] + vy[i] * vy[j]);
			for (var k = 0; k < 16; k++) if (ux[k] === _ux && uy[k] === _uy && vx[k] === _vx && vy[k] === _vy) {
				row.push(k);
				break;
			}
		}
	}
	for (var i = 0; i < 16; i++) {
		var mat = new Matrix();
		mat.set(ux[i], uy[i], vx[i], vy[i], 0, 0);
		rotationMatrices.push(mat);
	}
}
init();
/**
* @memberof PIXI
* @typedef {number} GD8Symmetry
* @see PIXI.groupD8
*/
/**
* Implements the dihedral group D8, which is similar to
* [group D4]{@link http://mathworld.wolfram.com/DihedralGroupD4.html};
* D8 is the same but with diagonals, and it is used for texture
* rotations.
*
* The directions the U- and V- axes after rotation
* of an angle of `a: GD8Constant` are the vectors `(uX(a), uY(a))`
* and `(vX(a), vY(a))`. These aren't necessarily unit vectors.
*
* **Origin:**<br>
*  This is the small part of gameofbombs.com portal system. It works.
* @see PIXI.groupD8.E
* @see PIXI.groupD8.SE
* @see PIXI.groupD8.S
* @see PIXI.groupD8.SW
* @see PIXI.groupD8.W
* @see PIXI.groupD8.NW
* @see PIXI.groupD8.N
* @see PIXI.groupD8.NE
* @author Ivan @ivanpopelyshev
* @namespace PIXI.groupD8
* @memberof PIXI
*/
var groupD8 = {
	/**
	* | Rotation | Direction |
	* |----------|-----------|
	* | 0°       | East      |
	* @memberof PIXI.groupD8
	* @constant {PIXI.GD8Symmetry}
	*/
	E: 0,
	/**
	* | Rotation | Direction |
	* |----------|-----------|
	* | 45°↻     | Southeast |
	* @memberof PIXI.groupD8
	* @constant {PIXI.GD8Symmetry}
	*/
	SE: 1,
	/**
	* | Rotation | Direction |
	* |----------|-----------|
	* | 90°↻     | South     |
	* @memberof PIXI.groupD8
	* @constant {PIXI.GD8Symmetry}
	*/
	S: 2,
	/**
	* | Rotation | Direction |
	* |----------|-----------|
	* | 135°↻    | Southwest |
	* @memberof PIXI.groupD8
	* @constant {PIXI.GD8Symmetry}
	*/
	SW: 3,
	/**
	* | Rotation | Direction |
	* |----------|-----------|
	* | 180°     | West      |
	* @memberof PIXI.groupD8
	* @constant {PIXI.GD8Symmetry}
	*/
	W: 4,
	/**
	* | Rotation    | Direction    |
	* |-------------|--------------|
	* | -135°/225°↻ | Northwest    |
	* @memberof PIXI.groupD8
	* @constant {PIXI.GD8Symmetry}
	*/
	NW: 5,
	/**
	* | Rotation    | Direction    |
	* |-------------|--------------|
	* | -90°/270°↻  | North        |
	* @memberof PIXI.groupD8
	* @constant {PIXI.GD8Symmetry}
	*/
	N: 6,
	/**
	* | Rotation    | Direction    |
	* |-------------|--------------|
	* | -45°/315°↻  | Northeast    |
	* @memberof PIXI.groupD8
	* @constant {PIXI.GD8Symmetry}
	*/
	NE: 7,
	/**
	* Reflection about Y-axis.
	* @memberof PIXI.groupD8
	* @constant {PIXI.GD8Symmetry}
	*/
	MIRROR_VERTICAL: 8,
	/**
	* Reflection about the main diagonal.
	* @memberof PIXI.groupD8
	* @constant {PIXI.GD8Symmetry}
	*/
	MAIN_DIAGONAL: 10,
	/**
	* Reflection about X-axis.
	* @memberof PIXI.groupD8
	* @constant {PIXI.GD8Symmetry}
	*/
	MIRROR_HORIZONTAL: 12,
	/**
	* Reflection about reverse diagonal.
	* @memberof PIXI.groupD8
	* @constant {PIXI.GD8Symmetry}
	*/
	REVERSE_DIAGONAL: 14,
	/**
	* @memberof PIXI.groupD8
	* @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
	* @returns {PIXI.GD8Symmetry} The X-component of the U-axis
	*    after rotating the axes.
	*/
	uX: function(ind) {
		return ux[ind];
	},
	/**
	* @memberof PIXI.groupD8
	* @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
	* @returns {PIXI.GD8Symmetry} The Y-component of the U-axis
	*    after rotating the axes.
	*/
	uY: function(ind) {
		return uy[ind];
	},
	/**
	* @memberof PIXI.groupD8
	* @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
	* @returns {PIXI.GD8Symmetry} The X-component of the V-axis
	*    after rotating the axes.
	*/
	vX: function(ind) {
		return vx[ind];
	},
	/**
	* @memberof PIXI.groupD8
	* @param {PIXI.GD8Symmetry} ind - sprite rotation angle.
	* @returns {PIXI.GD8Symmetry} The Y-component of the V-axis
	*    after rotating the axes.
	*/
	vY: function(ind) {
		return vy[ind];
	},
	/**
	* @memberof PIXI.groupD8
	* @param {PIXI.GD8Symmetry} rotation - symmetry whose opposite
	*   is needed. Only rotations have opposite symmetries while
	*   reflections don't.
	* @returns {PIXI.GD8Symmetry} The opposite symmetry of `rotation`
	*/
	inv: function(rotation) {
		if (rotation & 8) return rotation & 15;
		return -rotation & 7;
	},
	/**
	* Composes the two D8 operations.
	*
	* Taking `^` as reflection:
	*
	* |       | E=0 | S=2 | W=4 | N=6 | E^=8 | S^=10 | W^=12 | N^=14 |
	* |-------|-----|-----|-----|-----|------|-------|-------|-------|
	* | E=0   | E   | S   | W   | N   | E^   | S^    | W^    | N^    |
	* | S=2   | S   | W   | N   | E   | S^   | W^    | N^    | E^    |
	* | W=4   | W   | N   | E   | S   | W^   | N^    | E^    | S^    |
	* | N=6   | N   | E   | S   | W   | N^   | E^    | S^    | W^    |
	* | E^=8  | E^  | N^  | W^  | S^  | E    | N     | W     | S     |
	* | S^=10 | S^  | E^  | N^  | W^  | S    | E     | N     | W     |
	* | W^=12 | W^  | S^  | E^  | N^  | W    | S     | E     | N     |
	* | N^=14 | N^  | W^  | S^  | E^  | N    | W     | S     | E     |
	*
	* [This is a Cayley table]{@link https://en.wikipedia.org/wiki/Cayley_table}
	* @memberof PIXI.groupD8
	* @param {PIXI.GD8Symmetry} rotationSecond - Second operation, which
	*   is the row in the above cayley table.
	* @param {PIXI.GD8Symmetry} rotationFirst - First operation, which
	*   is the column in the above cayley table.
	* @returns {PIXI.GD8Symmetry} Composed operation
	*/
	add: function(rotationSecond, rotationFirst) {
		return rotationCayley[rotationSecond][rotationFirst];
	},
	/**
	* Reverse of `add`.
	* @memberof PIXI.groupD8
	* @param {PIXI.GD8Symmetry} rotationSecond - Second operation
	* @param {PIXI.GD8Symmetry} rotationFirst - First operation
	* @returns {PIXI.GD8Symmetry} Result
	*/
	sub: function(rotationSecond, rotationFirst) {
		return rotationCayley[rotationSecond][groupD8.inv(rotationFirst)];
	},
	/**
	* Adds 180 degrees to rotation, which is a commutative
	* operation.
	* @memberof PIXI.groupD8
	* @param {number} rotation - The number to rotate.
	* @returns {number} Rotated number
	*/
	rotate180: function(rotation) {
		return rotation ^ 4;
	},
	/**
	* Checks if the rotation angle is vertical, i.e. south
	* or north. It doesn't work for reflections.
	* @memberof PIXI.groupD8
	* @param {PIXI.GD8Symmetry} rotation - The number to check.
	* @returns {boolean} Whether or not the direction is vertical
	*/
	isVertical: function(rotation) {
		return (rotation & 3) === 2;
	},
	/**
	* Approximates the vector `V(dx,dy)` into one of the
	* eight directions provided by `groupD8`.
	* @memberof PIXI.groupD8
	* @param {number} dx - X-component of the vector
	* @param {number} dy - Y-component of the vector
	* @returns {PIXI.GD8Symmetry} Approximation of the vector into
	*  one of the eight symmetries.
	*/
	byDirection: function(dx, dy) {
		if (Math.abs(dx) * 2 <= Math.abs(dy)) {
			if (dy >= 0) return groupD8.S;
			return groupD8.N;
		} else if (Math.abs(dy) * 2 <= Math.abs(dx)) {
			if (dx > 0) return groupD8.E;
			return groupD8.W;
		} else if (dy > 0) {
			if (dx > 0) return groupD8.SE;
			return groupD8.SW;
		} else if (dx > 0) return groupD8.NE;
		return groupD8.NW;
	},
	/**
	* Helps sprite to compensate texture packer rotation.
	* @memberof PIXI.groupD8
	* @param {PIXI.Matrix} matrix - sprite world matrix
	* @param {PIXI.GD8Symmetry} rotation - The rotation factor to use.
	* @param {number} tx - sprite anchoring
	* @param {number} ty - sprite anchoring
	*/
	matrixAppendRotationInv: function(matrix, rotation, tx, ty) {
		if (tx === void 0) tx = 0;
		if (ty === void 0) ty = 0;
		var mat = rotationMatrices[groupD8.inv(rotation)];
		mat.tx = tx;
		mat.ty = ty;
		matrix.append(mat);
	}
};
/**
* Transform that takes care about its versions.
* @memberof PIXI
*/
var Transform = function() {
	function Transform() {
		this.worldTransform = new Matrix();
		this.localTransform = new Matrix();
		this.position = new ObservablePoint(this.onChange, this, 0, 0);
		this.scale = new ObservablePoint(this.onChange, this, 1, 1);
		this.pivot = new ObservablePoint(this.onChange, this, 0, 0);
		this.skew = new ObservablePoint(this.updateSkew, this, 0, 0);
		this._rotation = 0;
		this._cx = 1;
		this._sx = 0;
		this._cy = 0;
		this._sy = 1;
		this._localID = 0;
		this._currentLocalID = 0;
		this._worldID = 0;
		this._parentID = 0;
	}
	/** Called when a value changes. */
	Transform.prototype.onChange = function() {
		this._localID++;
	};
	/** Called when the skew or the rotation changes. */
	Transform.prototype.updateSkew = function() {
		this._cx = Math.cos(this._rotation + this.skew.y);
		this._sx = Math.sin(this._rotation + this.skew.y);
		this._cy = -Math.sin(this._rotation - this.skew.x);
		this._sy = Math.cos(this._rotation - this.skew.x);
		this._localID++;
	};
	Transform.prototype.toString = function() {
		return "[@pixi/math:Transform " + ("position=(" + this.position.x + ", " + this.position.y + ") ") + ("rotation=" + this.rotation + " ") + ("scale=(" + this.scale.x + ", " + this.scale.y + ") ") + ("skew=(" + this.skew.x + ", " + this.skew.y + ") ") + "]";
	};
	/** Updates the local transformation matrix. */
	Transform.prototype.updateLocalTransform = function() {
		var lt = this.localTransform;
		if (this._localID !== this._currentLocalID) {
			lt.a = this._cx * this.scale.x;
			lt.b = this._sx * this.scale.x;
			lt.c = this._cy * this.scale.y;
			lt.d = this._sy * this.scale.y;
			lt.tx = this.position.x - (this.pivot.x * lt.a + this.pivot.y * lt.c);
			lt.ty = this.position.y - (this.pivot.x * lt.b + this.pivot.y * lt.d);
			this._currentLocalID = this._localID;
			this._parentID = -1;
		}
	};
	/**
	* Updates the local and the world transformation matrices.
	* @param parentTransform - The parent transform
	*/
	Transform.prototype.updateTransform = function(parentTransform) {
		var lt = this.localTransform;
		if (this._localID !== this._currentLocalID) {
			lt.a = this._cx * this.scale.x;
			lt.b = this._sx * this.scale.x;
			lt.c = this._cy * this.scale.y;
			lt.d = this._sy * this.scale.y;
			lt.tx = this.position.x - (this.pivot.x * lt.a + this.pivot.y * lt.c);
			lt.ty = this.position.y - (this.pivot.x * lt.b + this.pivot.y * lt.d);
			this._currentLocalID = this._localID;
			this._parentID = -1;
		}
		if (this._parentID !== parentTransform._worldID) {
			var pt = parentTransform.worldTransform;
			var wt = this.worldTransform;
			wt.a = lt.a * pt.a + lt.b * pt.c;
			wt.b = lt.a * pt.b + lt.b * pt.d;
			wt.c = lt.c * pt.a + lt.d * pt.c;
			wt.d = lt.c * pt.b + lt.d * pt.d;
			wt.tx = lt.tx * pt.a + lt.ty * pt.c + pt.tx;
			wt.ty = lt.tx * pt.b + lt.ty * pt.d + pt.ty;
			this._parentID = parentTransform._worldID;
			this._worldID++;
		}
	};
	/**
	* Decomposes a matrix and sets the transforms properties based on it.
	* @param matrix - The matrix to decompose
	*/
	Transform.prototype.setFromMatrix = function(matrix) {
		matrix.decompose(this);
		this._localID++;
	};
	Object.defineProperty(Transform.prototype, "rotation", {
		/** The rotation of the object in radians. */
		get: function() {
			return this._rotation;
		},
		set: function(value) {
			if (this._rotation !== value) {
				this._rotation = value;
				this.updateSkew();
			}
		},
		enumerable: false,
		configurable: true
	});
	/** A default (identity) transform. */
	Transform.IDENTITY = new Transform();
	return Transform;
}();
//#endregion
//#region node_modules/@pixi/extensions/dist/esm/extensions.mjs
/*!
* @pixi/extensions - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/extensions is licensed under the MIT License.
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
var __assign$1 = function() {
	__assign$1 = Object.assign || function __assign(t) {
		var arguments$1 = arguments;
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments$1[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign$1.apply(this, arguments);
};
/**
* Collection of valid extension types.
* @memberof PIXI
* @property {string} Application - Application plugins
* @property {string} RendererPlugin - Plugins for Renderer
* @property {string} CanvasRendererPlugin - Plugins for CanvasRenderer
* @property {string} Loader - Plugins to use with Loader
* @property {string} LoadParser - Parsers for Assets loader.
* @property {string} ResolveParser - Parsers for Assets resolvers.
* @property {string} CacheParser - Parsers for Assets cache.
*/
var ExtensionType;
(function(ExtensionType) {
	ExtensionType["Application"] = "application";
	ExtensionType["RendererPlugin"] = "renderer-webgl-plugin";
	ExtensionType["CanvasRendererPlugin"] = "renderer-canvas-plugin";
	ExtensionType["Loader"] = "loader";
	ExtensionType["LoadParser"] = "load-parser";
	ExtensionType["ResolveParser"] = "resolve-parser";
	ExtensionType["CacheParser"] = "cache-parser";
	ExtensionType["DetectionParser"] = "detection-parser";
})(ExtensionType || (ExtensionType = {}));
/**
* Convert input into extension format data.
* @ignore
*/
var normalizeExtension = function(ext) {
	if (typeof ext === "function" || typeof ext === "object" && ext.extension) {
		if (!ext.extension) throw new Error("Extension class must have an extension object");
		var metadata = typeof ext.extension !== "object" ? { type: ext.extension } : ext.extension;
		ext = __assign$1(__assign$1({}, metadata), { ref: ext });
	}
	if (typeof ext === "object") ext = __assign$1({}, ext);
	else throw new Error("Invalid extension type");
	if (typeof ext.type === "string") ext.type = [ext.type];
	return ext;
};
/**
* Global registration of all PixiJS extensions. One-stop-shop for extensibility.
* @memberof PIXI
* @namespace extensions
*/
var extensions = {
	/** @ignore */
	_addHandlers: null,
	/** @ignore */
	_removeHandlers: null,
	/** @ignore */
	_queue: {},
	/**
	* Remove extensions from PixiJS.
	* @param extensions - Extensions to be removed.
	* @returns {PIXI.extensions} For chaining.
	*/
	remove: function() {
		var arguments$1 = arguments;
		var _this = this;
		var extensions = [];
		for (var _i = 0; _i < arguments.length; _i++) extensions[_i] = arguments$1[_i];
		extensions.map(normalizeExtension).forEach(function(ext) {
			ext.type.forEach(function(type) {
				var _a, _b;
				return (_b = (_a = _this._removeHandlers)[type]) === null || _b === void 0 ? void 0 : _b.call(_a, ext);
			});
		});
		return this;
	},
	/**
	* Register new extensions with PixiJS.
	* @param extensions - The spread of extensions to add to PixiJS.
	* @returns {PIXI.extensions} For chaining.
	*/
	add: function() {
		var arguments$1 = arguments;
		var _this = this;
		var extensions = [];
		for (var _i = 0; _i < arguments.length; _i++) extensions[_i] = arguments$1[_i];
		extensions.map(normalizeExtension).forEach(function(ext) {
			ext.type.forEach(function(type) {
				var handlers = _this._addHandlers;
				var queue = _this._queue;
				if (!handlers[type]) {
					queue[type] = queue[type] || [];
					queue[type].push(ext);
				} else handlers[type](ext);
			});
		});
		return this;
	},
	/**
	* Internal method to handle extensions by name.
	* @param type - The extension type.
	* @param onAdd  - Function for handling when extensions are added/registered passes {@link PIXI.ExtensionFormat}.
	* @param onRemove  - Function for handling when extensions are removed/unregistered passes {@link PIXI.ExtensionFormat}.
	* @returns {PIXI.extensions} For chaining.
	*/
	handle: function(type, onAdd, onRemove) {
		var addHandlers = this._addHandlers = this._addHandlers || {};
		var removeHandlers = this._removeHandlers = this._removeHandlers || {};
		if (addHandlers[type] || removeHandlers[type]) throw new Error("Extension type " + type + " already has a handler");
		addHandlers[type] = onAdd;
		removeHandlers[type] = onRemove;
		var queue = this._queue;
		if (queue[type]) {
			queue[type].forEach(function(ext) {
				return onAdd(ext);
			});
			delete queue[type];
		}
		return this;
	},
	/**
	* Handle a type, but using a map by `name` property.
	* @param type - Type of extension to handle.
	* @param map - The object map of named extensions.
	* @returns {PIXI.extensions} For chaining.
	*/
	handleByMap: function(type, map) {
		return this.handle(type, function(extension) {
			map[extension.name] = extension.ref;
		}, function(extension) {
			delete map[extension.name];
		});
	},
	/**
	* Handle a type, but using a list of extensions.
	* @param type - Type of extension to handle.
	* @param list - The list of extensions.
	* @returns {PIXI.extensions} For chaining.
	*/
	handleByList: function(type, list) {
		return this.handle(type, function(extension) {
			var _a, _b;
			if (list.includes(extension.ref)) return;
			list.push(extension.ref);
			if (type === ExtensionType.Loader) (_b = (_a = extension.ref).add) === null || _b === void 0 || _b.call(_a);
		}, function(extension) {
			var index = list.indexOf(extension.ref);
			if (index !== -1) list.splice(index, 1);
		});
	}
};
//#endregion
//#region node_modules/@pixi/runner/dist/esm/runner.mjs
/*!
* @pixi/runner - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/runner is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/**
* A Runner is a highly performant and simple alternative to signals. Best used in situations
* where events are dispatched to many objects at high frequency (say every frame!)
*
*
* like a signal..
* ```
* import { Runner } from '@pixi/runner';
*
* const myObject = {
*     loaded: new Runner('loaded')
* }
*
* const listener = {
*     loaded: function(){
*         // thin
*     }
* }
*
* myObject.loaded.add(listener);
*
* myObject.loaded.emit();
* ```
*
* Or for handling calling the same function on many items
* ```
* import { Runner } from '@pixi/runner';
*
* const myGame = {
*     update: new Runner('update')
* }
*
* const gameObject = {
*     update: function(time){
*         // update my gamey state
*     }
* }
*
* myGame.update.add(gameObject);
*
* myGame.update.emit(time);
* ```
* @memberof PIXI
*/
var Runner = function() {
	/**
	* @param name - The function name that will be executed on the listeners added to this Runner.
	*/
	function Runner(name) {
		this.items = [];
		this._name = name;
		this._aliasCount = 0;
	}
	/**
	* Dispatch/Broadcast Runner to all listeners added to the queue.
	* @param {...any} params - (optional) parameters to pass to each listener
	*/
	Runner.prototype.emit = function(a0, a1, a2, a3, a4, a5, a6, a7) {
		if (arguments.length > 8) throw new Error("max arguments reached");
		var _a = this, name = _a.name, items = _a.items;
		this._aliasCount++;
		for (var i = 0, len = items.length; i < len; i++) items[i][name](a0, a1, a2, a3, a4, a5, a6, a7);
		if (items === this.items) this._aliasCount--;
		return this;
	};
	Runner.prototype.ensureNonAliasedItems = function() {
		if (this._aliasCount > 0 && this.items.length > 1) {
			this._aliasCount = 0;
			this.items = this.items.slice(0);
		}
	};
	/**
	* Add a listener to the Runner
	*
	* Runners do not need to have scope or functions passed to them.
	* All that is required is to pass the listening object and ensure that it has contains a function that has the same name
	* as the name provided to the Runner when it was created.
	*
	* Eg A listener passed to this Runner will require a 'complete' function.
	*
	* ```
	* import { Runner } from '@pixi/runner';
	*
	* const complete = new Runner('complete');
	* ```
	*
	* The scope used will be the object itself.
	* @param {any} item - The object that will be listening.
	*/
	Runner.prototype.add = function(item) {
		if (item[this._name]) {
			this.ensureNonAliasedItems();
			this.remove(item);
			this.items.push(item);
		}
		return this;
	};
	/**
	* Remove a single listener from the dispatch queue.
	* @param {any} item - The listener that you would like to remove.
	*/
	Runner.prototype.remove = function(item) {
		var index = this.items.indexOf(item);
		if (index !== -1) {
			this.ensureNonAliasedItems();
			this.items.splice(index, 1);
		}
		return this;
	};
	/**
	* Check to see if the listener is already in the Runner
	* @param {any} item - The listener that you would like to check.
	*/
	Runner.prototype.contains = function(item) {
		return this.items.indexOf(item) !== -1;
	};
	/** Remove all listeners from the Runner */
	Runner.prototype.removeAll = function() {
		this.ensureNonAliasedItems();
		this.items.length = 0;
		return this;
	};
	/** Remove all references, don't use after this. */
	Runner.prototype.destroy = function() {
		this.removeAll();
		this.items = null;
		this._name = null;
	};
	Object.defineProperty(Runner.prototype, "empty", {
		/**
		* `true` if there are no this Runner contains no listeners
		* @readonly
		*/
		get: function() {
			return this.items.length === 0;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Runner.prototype, "name", {
		/**
		* The name of the runner.
		* @readonly
		*/
		get: function() {
			return this._name;
		},
		enumerable: false,
		configurable: true
	});
	return Runner;
}();
Object.defineProperties(Runner.prototype, {
	/**
	* Alias for `emit`
	* @memberof PIXI.Runner#
	* @method dispatch
	* @see PIXI.Runner#emit
	*/
	dispatch: { value: Runner.prototype.emit },
	/**
	* Alias for `emit`
	* @memberof PIXI.Runner#
	* @method run
	* @see PIXI.Runner#emit
	*/
	run: { value: Runner.prototype.emit }
});
//#endregion
//#region node_modules/@pixi/ticker/dist/esm/ticker.mjs
/*!
* @pixi/ticker - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/ticker is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/**
* Target frames per millisecond.
* @static
* @name TARGET_FPMS
* @memberof PIXI.settings
* @type {number}
* @default 0.06
*/
settings.TARGET_FPMS = .06;
/**
* Represents the update priorities used by internal PIXI classes when registered with
* the {@link PIXI.Ticker} object. Higher priority items are updated first and lower
* priority items, such as render, should go later.
* @static
* @constant
* @name UPDATE_PRIORITY
* @memberof PIXI
* @enum {number}
* @property {number} [INTERACTION=50] Highest priority, used for {@link PIXI.InteractionManager}
* @property {number} [HIGH=25] High priority updating, {@link PIXI.VideoBaseTexture} and {@link PIXI.AnimatedSprite}
* @property {number} [NORMAL=0] Default priority for ticker events, see {@link PIXI.Ticker#add}.
* @property {number} [LOW=-25] Low priority used for {@link PIXI.Application} rendering.
* @property {number} [UTILITY=-50] Lowest priority used for {@link PIXI.BasePrepare} utility.
*/
var UPDATE_PRIORITY;
(function(UPDATE_PRIORITY) {
	UPDATE_PRIORITY[UPDATE_PRIORITY["INTERACTION"] = 50] = "INTERACTION";
	UPDATE_PRIORITY[UPDATE_PRIORITY["HIGH"] = 25] = "HIGH";
	UPDATE_PRIORITY[UPDATE_PRIORITY["NORMAL"] = 0] = "NORMAL";
	UPDATE_PRIORITY[UPDATE_PRIORITY["LOW"] = -25] = "LOW";
	UPDATE_PRIORITY[UPDATE_PRIORITY["UTILITY"] = -50] = "UTILITY";
})(UPDATE_PRIORITY || (UPDATE_PRIORITY = {}));
/**
* Internal class for handling the priority sorting of ticker handlers.
* @private
* @class
* @memberof PIXI
*/
var TickerListener = function() {
	/**
	* Constructor
	* @private
	* @param fn - The listener function to be added for one update
	* @param context - The listener context
	* @param priority - The priority for emitting
	* @param once - If the handler should fire once
	*/
	function TickerListener(fn, context, priority, once) {
		if (context === void 0) context = null;
		if (priority === void 0) priority = 0;
		if (once === void 0) once = false;
		/** The next item in chain. */
		this.next = null;
		/** The previous item in chain. */
		this.previous = null;
		/** `true` if this listener has been destroyed already. */
		this._destroyed = false;
		this.fn = fn;
		this.context = context;
		this.priority = priority;
		this.once = once;
	}
	/**
	* Simple compare function to figure out if a function and context match.
	* @private
	* @param fn - The listener function to be added for one update
	* @param context - The listener context
	* @returns `true` if the listener match the arguments
	*/
	TickerListener.prototype.match = function(fn, context) {
		if (context === void 0) context = null;
		return this.fn === fn && this.context === context;
	};
	/**
	* Emit by calling the current function.
	* @private
	* @param deltaTime - time since the last emit.
	* @returns Next ticker
	*/
	TickerListener.prototype.emit = function(deltaTime) {
		if (this.fn) {
			if (this.context) this.fn.call(this.context, deltaTime);
			else this.fn(deltaTime);
		}
		var redirect = this.next;
		if (this.once) this.destroy(true);
		if (this._destroyed) this.next = null;
		return redirect;
	};
	/**
	* Connect to the list.
	* @private
	* @param previous - Input node, previous listener
	*/
	TickerListener.prototype.connect = function(previous) {
		this.previous = previous;
		if (previous.next) previous.next.previous = this;
		this.next = previous.next;
		previous.next = this;
	};
	/**
	* Destroy and don't use after this.
	* @private
	* @param hard - `true` to remove the `next` reference, this
	*        is considered a hard destroy. Soft destroy maintains the next reference.
	* @returns The listener to redirect while emitting or removing.
	*/
	TickerListener.prototype.destroy = function(hard) {
		if (hard === void 0) hard = false;
		this._destroyed = true;
		this.fn = null;
		this.context = null;
		if (this.previous) this.previous.next = this.next;
		if (this.next) this.next.previous = this.previous;
		var redirect = this.next;
		this.next = hard ? null : redirect;
		this.previous = null;
		return redirect;
	};
	return TickerListener;
}();
/**
* A Ticker class that runs an update loop that other objects listen to.
*
* This class is composed around listeners meant for execution on the next requested animation frame.
* Animation frames are requested only when necessary, e.g. When the ticker is started and the emitter has listeners.
* @class
* @memberof PIXI
*/
var Ticker = function() {
	function Ticker() {
		var _this = this;
		/**
		* Whether or not this ticker should invoke the method
		* {@link PIXI.Ticker#start} automatically
		* when a listener is added.
		*/
		this.autoStart = false;
		/**
		* Scalar time value from last frame to this frame.
		* This value is capped by setting {@link PIXI.Ticker#minFPS}
		* and is scaled with {@link PIXI.Ticker#speed}.
		* **Note:** The cap may be exceeded by scaling.
		*/
		this.deltaTime = 1;
		/**
		* The last time {@link PIXI.Ticker#update} was invoked.
		* This value is also reset internally outside of invoking
		* update, but only when a new animation frame is requested.
		* If the platform supports DOMHighResTimeStamp,
		* this value will have a precision of 1 µs.
		*/
		this.lastTime = -1;
		/**
		* Factor of current {@link PIXI.Ticker#deltaTime}.
		* @example
		* // Scales ticker.deltaTime to what would be
		* // the equivalent of approximately 120 FPS
		* ticker.speed = 2;
		*/
		this.speed = 1;
		/**
		* Whether or not this ticker has been started.
		* `true` if {@link PIXI.Ticker#start} has been called.
		* `false` if {@link PIXI.Ticker#stop} has been called.
		* While `false`, this value may change to `true` in the
		* event of {@link PIXI.Ticker#autoStart} being `true`
		* and a listener is added.
		*/
		this.started = false;
		/** Internal current frame request ID */
		this._requestId = null;
		/**
		* Internal value managed by minFPS property setter and getter.
		* This is the maximum allowed milliseconds between updates.
		*/
		this._maxElapsedMS = 100;
		/**
		* Internal value managed by minFPS property setter and getter.
		* This is the minimum allowed milliseconds between updates.
		*/
		this._minElapsedMS = 0;
		/** If enabled, deleting is disabled.*/
		this._protected = false;
		/** The last time keyframe was executed. Maintains a relatively fixed interval with the previous value. */
		this._lastFrame = -1;
		this._head = new TickerListener(null, null, Infinity);
		this.deltaMS = 1 / settings.TARGET_FPMS;
		this.elapsedMS = 1 / settings.TARGET_FPMS;
		this._tick = function(time) {
			_this._requestId = null;
			if (_this.started) {
				_this.update(time);
				if (_this.started && _this._requestId === null && _this._head.next) _this._requestId = requestAnimationFrame(_this._tick);
			}
		};
	}
	/**
	* Conditionally requests a new animation frame.
	* If a frame has not already been requested, and if the internal
	* emitter has listeners, a new frame is requested.
	* @private
	*/
	Ticker.prototype._requestIfNeeded = function() {
		if (this._requestId === null && this._head.next) {
			this.lastTime = performance.now();
			this._lastFrame = this.lastTime;
			this._requestId = requestAnimationFrame(this._tick);
		}
	};
	/**
	* Conditionally cancels a pending animation frame.
	* @private
	*/
	Ticker.prototype._cancelIfNeeded = function() {
		if (this._requestId !== null) {
			cancelAnimationFrame(this._requestId);
			this._requestId = null;
		}
	};
	/**
	* Conditionally requests a new animation frame.
	* If the ticker has been started it checks if a frame has not already
	* been requested, and if the internal emitter has listeners. If these
	* conditions are met, a new frame is requested. If the ticker has not
	* been started, but autoStart is `true`, then the ticker starts now,
	* and continues with the previous conditions to request a new frame.
	* @private
	*/
	Ticker.prototype._startIfPossible = function() {
		if (this.started) this._requestIfNeeded();
		else if (this.autoStart) this.start();
	};
	/**
	* Register a handler for tick events. Calls continuously unless
	* it is removed or the ticker is stopped.
	* @param fn - The listener function to be added for updates
	* @param context - The listener context
	* @param {number} [priority=PIXI.UPDATE_PRIORITY.NORMAL] - The priority for emitting
	* @returns This instance of a ticker
	*/
	Ticker.prototype.add = function(fn, context, priority) {
		if (priority === void 0) priority = UPDATE_PRIORITY.NORMAL;
		return this._addListener(new TickerListener(fn, context, priority));
	};
	/**
	* Add a handler for the tick event which is only execute once.
	* @param fn - The listener function to be added for one update
	* @param context - The listener context
	* @param {number} [priority=PIXI.UPDATE_PRIORITY.NORMAL] - The priority for emitting
	* @returns This instance of a ticker
	*/
	Ticker.prototype.addOnce = function(fn, context, priority) {
		if (priority === void 0) priority = UPDATE_PRIORITY.NORMAL;
		return this._addListener(new TickerListener(fn, context, priority, true));
	};
	/**
	* Internally adds the event handler so that it can be sorted by priority.
	* Priority allows certain handler (user, AnimatedSprite, Interaction) to be run
	* before the rendering.
	* @private
	* @param listener - Current listener being added.
	* @returns This instance of a ticker
	*/
	Ticker.prototype._addListener = function(listener) {
		var current = this._head.next;
		var previous = this._head;
		if (!current) listener.connect(previous);
		else {
			while (current) {
				if (listener.priority > current.priority) {
					listener.connect(previous);
					break;
				}
				previous = current;
				current = current.next;
			}
			if (!listener.previous) listener.connect(previous);
		}
		this._startIfPossible();
		return this;
	};
	/**
	* Removes any handlers matching the function and context parameters.
	* If no handlers are left after removing, then it cancels the animation frame.
	* @param fn - The listener function to be removed
	* @param context - The listener context to be removed
	* @returns This instance of a ticker
	*/
	Ticker.prototype.remove = function(fn, context) {
		var listener = this._head.next;
		while (listener) if (listener.match(fn, context)) listener = listener.destroy();
		else listener = listener.next;
		if (!this._head.next) this._cancelIfNeeded();
		return this;
	};
	Object.defineProperty(Ticker.prototype, "count", {
		/**
		* The number of listeners on this ticker, calculated by walking through linked list
		* @readonly
		* @member {number}
		*/
		get: function() {
			if (!this._head) return 0;
			var count = 0;
			var current = this._head;
			while (current = current.next) count++;
			return count;
		},
		enumerable: false,
		configurable: true
	});
	/** Starts the ticker. If the ticker has listeners a new animation frame is requested at this point. */
	Ticker.prototype.start = function() {
		if (!this.started) {
			this.started = true;
			this._requestIfNeeded();
		}
	};
	/** Stops the ticker. If the ticker has requested an animation frame it is canceled at this point. */
	Ticker.prototype.stop = function() {
		if (this.started) {
			this.started = false;
			this._cancelIfNeeded();
		}
	};
	/** Destroy the ticker and don't use after this. Calling this method removes all references to internal events. */
	Ticker.prototype.destroy = function() {
		if (!this._protected) {
			this.stop();
			var listener = this._head.next;
			while (listener) listener = listener.destroy(true);
			this._head.destroy();
			this._head = null;
		}
	};
	/**
	* Triggers an update. An update entails setting the
	* current {@link PIXI.Ticker#elapsedMS},
	* the current {@link PIXI.Ticker#deltaTime},
	* invoking all listeners with current deltaTime,
	* and then finally setting {@link PIXI.Ticker#lastTime}
	* with the value of currentTime that was provided.
	* This method will be called automatically by animation
	* frame callbacks if the ticker instance has been started
	* and listeners are added.
	* @param {number} [currentTime=performance.now()] - the current time of execution
	*/
	Ticker.prototype.update = function(currentTime) {
		if (currentTime === void 0) currentTime = performance.now();
		var elapsedMS;
		if (currentTime > this.lastTime) {
			elapsedMS = this.elapsedMS = currentTime - this.lastTime;
			if (elapsedMS > this._maxElapsedMS) elapsedMS = this._maxElapsedMS;
			elapsedMS *= this.speed;
			if (this._minElapsedMS) {
				var delta = currentTime - this._lastFrame | 0;
				if (delta < this._minElapsedMS) return;
				this._lastFrame = currentTime - delta % this._minElapsedMS;
			}
			this.deltaMS = elapsedMS;
			this.deltaTime = this.deltaMS * settings.TARGET_FPMS;
			var head = this._head;
			var listener = head.next;
			while (listener) listener = listener.emit(this.deltaTime);
			if (!head.next) this._cancelIfNeeded();
		} else this.deltaTime = this.deltaMS = this.elapsedMS = 0;
		this.lastTime = currentTime;
	};
	Object.defineProperty(Ticker.prototype, "FPS", {
		/**
		* The frames per second at which this ticker is running.
		* The default is approximately 60 in most modern browsers.
		* **Note:** This does not factor in the value of
		* {@link PIXI.Ticker#speed}, which is specific
		* to scaling {@link PIXI.Ticker#deltaTime}.
		* @member {number}
		* @readonly
		*/
		get: function() {
			return 1e3 / this.elapsedMS;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Ticker.prototype, "minFPS", {
		/**
		* Manages the maximum amount of milliseconds allowed to
		* elapse between invoking {@link PIXI.Ticker#update}.
		* This value is used to cap {@link PIXI.Ticker#deltaTime},
		* but does not effect the measured value of {@link PIXI.Ticker#FPS}.
		* When setting this property it is clamped to a value between
		* `0` and `PIXI.settings.TARGET_FPMS * 1000`.
		* @member {number}
		* @default 10
		*/
		get: function() {
			return 1e3 / this._maxElapsedMS;
		},
		set: function(fps) {
			var minFPS = Math.min(this.maxFPS, fps);
			var minFPMS = Math.min(Math.max(0, minFPS) / 1e3, settings.TARGET_FPMS);
			this._maxElapsedMS = 1 / minFPMS;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Ticker.prototype, "maxFPS", {
		/**
		* Manages the minimum amount of milliseconds required to
		* elapse between invoking {@link PIXI.Ticker#update}.
		* This will effect the measured value of {@link PIXI.Ticker#FPS}.
		* If it is set to `0`, then there is no limit; PixiJS will render as many frames as it can.
		* Otherwise it will be at least `minFPS`
		* @member {number}
		* @default 0
		*/
		get: function() {
			if (this._minElapsedMS) return Math.round(1e3 / this._minElapsedMS);
			return 0;
		},
		set: function(fps) {
			if (fps === 0) this._minElapsedMS = 0;
			else {
				var maxFPS = Math.max(this.minFPS, fps);
				this._minElapsedMS = 1 / (maxFPS / 1e3);
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Ticker, "shared", {
		/**
		* The shared ticker instance used by {@link PIXI.AnimatedSprite} and by
		* {@link PIXI.VideoResource} to update animation frames / video textures.
		*
		* It may also be used by {@link PIXI.Application} if created with the `sharedTicker` option property set to true.
		*
		* The property {@link PIXI.Ticker#autoStart} is set to `true` for this instance.
		* Please follow the examples for usage, including how to opt-out of auto-starting the shared ticker.
		* @example
		* let ticker = PIXI.Ticker.shared;
		* // Set this to prevent starting this ticker when listeners are added.
		* // By default this is true only for the PIXI.Ticker.shared instance.
		* ticker.autoStart = false;
		* // FYI, call this to ensure the ticker is stopped. It should be stopped
		* // if you have not attempted to render anything yet.
		* ticker.stop();
		* // Call this when you are ready for a running shared ticker.
		* ticker.start();
		* @example
		* // You may use the shared ticker to render...
		* let renderer = PIXI.autoDetectRenderer();
		* let stage = new PIXI.Container();
		* document.body.appendChild(renderer.view);
		* ticker.add(function (time) {
		*     renderer.render(stage);
		* });
		* @example
		* // Or you can just update it manually.
		* ticker.autoStart = false;
		* ticker.stop();
		* function animate(time) {
		*     ticker.update(time);
		*     renderer.render(stage);
		*     requestAnimationFrame(animate);
		* }
		* animate(performance.now());
		* @member {PIXI.Ticker}
		* @static
		*/
		get: function() {
			if (!Ticker._shared) {
				var shared = Ticker._shared = new Ticker();
				shared.autoStart = true;
				shared._protected = true;
			}
			return Ticker._shared;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Ticker, "system", {
		/**
		* The system ticker instance used by {@link PIXI.InteractionManager} and by
		* {@link PIXI.BasePrepare} for core timing functionality that shouldn't usually need to be paused,
		* unlike the `shared` ticker which drives visual animations and rendering which may want to be paused.
		*
		* The property {@link PIXI.Ticker#autoStart} is set to `true` for this instance.
		* @member {PIXI.Ticker}
		* @static
		*/
		get: function() {
			if (!Ticker._system) {
				var system = Ticker._system = new Ticker();
				system.autoStart = true;
				system._protected = true;
			}
			return Ticker._system;
		},
		enumerable: false,
		configurable: true
	});
	return Ticker;
}();
/**
* Middleware for for Application Ticker.
* @example
* import {TickerPlugin} from '@pixi/ticker';
* import {Application} from '@pixi/app';
* import {extensions} from '@pixi/extensions';
* extensions.add(TickerPlugin);
* @class
* @memberof PIXI
*/
var TickerPlugin = function() {
	function TickerPlugin() {}
	/**
	* Initialize the plugin with scope of application instance
	* @static
	* @private
	* @param {object} [options] - See application options
	*/
	TickerPlugin.init = function(options) {
		var _this = this;
		options = Object.assign({
			autoStart: true,
			sharedTicker: false
		}, options);
		Object.defineProperty(this, "ticker", {
			set: function(ticker) {
				if (this._ticker) this._ticker.remove(this.render, this);
				this._ticker = ticker;
				if (ticker) ticker.add(this.render, this, UPDATE_PRIORITY.LOW);
			},
			get: function() {
				return this._ticker;
			}
		});
		/**
		* Convenience method for stopping the render.
		* @method
		* @memberof PIXI.Application
		* @instance
		*/
		this.stop = function() {
			_this._ticker.stop();
		};
		/**
		* Convenience method for starting the render.
		* @method
		* @memberof PIXI.Application
		* @instance
		*/
		this.start = function() {
			_this._ticker.start();
		};
		/**
		* Internal reference to the ticker.
		* @type {PIXI.Ticker}
		* @name _ticker
		* @memberof PIXI.Application#
		* @private
		*/
		this._ticker = null;
		/**
		* Ticker for doing render updates.
		* @type {PIXI.Ticker}
		* @name ticker
		* @memberof PIXI.Application#
		* @default PIXI.Ticker.shared
		*/
		this.ticker = options.sharedTicker ? Ticker.shared : new Ticker();
		if (options.autoStart) this.start();
	};
	/**
	* Clean up the ticker, scoped to application.
	* @static
	* @private
	*/
	TickerPlugin.destroy = function() {
		if (this._ticker) {
			var oldTicker = this._ticker;
			this.ticker = null;
			oldTicker.destroy();
		}
	};
	/** @ignore */
	TickerPlugin.extension = ExtensionType.Application;
	return TickerPlugin;
}();
//#endregion
//#region node_modules/@pixi/core/dist/esm/core.mjs
/*!
* @pixi/core - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/core is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/**
* The maximum support for using WebGL. If a device does not
* support WebGL version, for instance WebGL 2, it will still
* attempt to fallback support to WebGL 1. If you want to
* explicitly remove feature support to target a more stable
* baseline, prefer a lower environment.
*
* Due to {@link https://bugs.chromium.org/p/chromium/issues/detail?id=934823|bug in chromium}
* we disable webgl2 by default for all non-apple mobile devices.
* @static
* @name PREFER_ENV
* @memberof PIXI.settings
* @type {number}
* @default PIXI.ENV.WEBGL2
*/
settings.PREFER_ENV = isMobile.any ? ENV.WEBGL : ENV.WEBGL2;
/**
* If set to `true`, *only* Textures and BaseTexture objects stored
* in the caches ({@link PIXI.utils.TextureCache TextureCache} and
* {@link PIXI.utils.BaseTextureCache BaseTextureCache}) can be
* used when calling {@link PIXI.Texture.from Texture.from} or
* {@link PIXI.BaseTexture.from BaseTexture.from}.
* Otherwise, these `from` calls throw an exception. Using this property
* can be useful if you want to enforce preloading all assets with
* {@link PIXI.Loader Loader}.
* @static
* @name STRICT_TEXTURE_CACHE
* @memberof PIXI.settings
* @type {boolean}
* @default false
*/
settings.STRICT_TEXTURE_CACHE = false;
/**
* Collection of installed resource types, class must extend {@link PIXI.Resource}.
* @example
* class CustomResource extends PIXI.Resource {
*   // MUST have source, options constructor signature
*   // for auto-detected resources to be created.
*   constructor(source, options) {
*     super();
*   }
*   upload(renderer, baseTexture, glTexture) {
*     // upload with GL
*     return true;
*   }
*   // used to auto-detect resource
*   static test(source, extension) {
*     return extension === 'xyz'|| source instanceof SomeClass;
*   }
* }
* // Install the new resource type
* PIXI.INSTALLED.push(CustomResource);
* @memberof PIXI
* @type {Array<PIXI.IResourcePlugin>}
* @static
* @readonly
*/
var INSTALLED = [];
/**
* Create a resource element from a single source element. This
* auto-detects which type of resource to create. All resources that
* are auto-detectable must have a static `test` method and a constructor
* with the arguments `(source, options?)`. Currently, the supported
* resources for auto-detection include:
*  - {@link PIXI.ImageResource}
*  - {@link PIXI.CanvasResource}
*  - {@link PIXI.VideoResource}
*  - {@link PIXI.SVGResource}
*  - {@link PIXI.BufferResource}
* @static
* @memberof PIXI
* @function autoDetectResource
* @param {string|*} source - Resource source, this can be the URL to the resource,
*        a typed-array (for BufferResource), HTMLVideoElement, SVG data-uri
*        or any other resource that can be auto-detected. If not resource is
*        detected, it's assumed to be an ImageResource.
* @param {object} [options] - Pass-through options to use for Resource
* @param {number} [options.width] - Width of BufferResource or SVG rasterization
* @param {number} [options.height] - Height of BufferResource or SVG rasterization
* @param {boolean} [options.autoLoad=true] - Image, SVG and Video flag to start loading
* @param {number} [options.scale=1] - SVG source scale. Overridden by width, height
* @param {boolean} [options.createBitmap=PIXI.settings.CREATE_IMAGE_BITMAP] - Image option to create Bitmap object
* @param {boolean} [options.crossorigin=true] - Image and Video option to set crossOrigin
* @param {boolean} [options.autoPlay=true] - Video option to start playing video immediately
* @param {number} [options.updateFPS=0] - Video option to update how many times a second the
*        texture should be updated from the video. Leave at 0 to update at every render
* @returns {PIXI.Resource} The created resource.
*/
function autoDetectResource(source, options) {
	if (!source) return null;
	var extension = "";
	if (typeof source === "string") {
		var result = /\.(\w{3,4})(?:$|\?|#)/i.exec(source);
		if (result) extension = result[1].toLowerCase();
	}
	for (var i = INSTALLED.length - 1; i >= 0; --i) {
		var ResourcePlugin = INSTALLED[i];
		if (ResourcePlugin.test && ResourcePlugin.test(source, extension)) return new ResourcePlugin(source, options);
	}
	throw new Error("Unrecognized source type to auto-detect Resource");
}
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
var __assign = function() {
	__assign = Object.assign || function __assign(t) {
		var arguments$1 = arguments;
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments$1[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign.apply(this, arguments);
};
function __rest(s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function") {
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
	}
	return t;
}
/**
* Base resource class for textures that manages validation and uploading, depending on its type.
*
* Uploading of a base texture to the GPU is required.
* @memberof PIXI
*/
var Resource = function() {
	/**
	* @param width - Width of the resource
	* @param height - Height of the resource
	*/
	function Resource(width, height) {
		if (width === void 0) width = 0;
		if (height === void 0) height = 0;
		this._width = width;
		this._height = height;
		this.destroyed = false;
		this.internal = false;
		this.onResize = new Runner("setRealSize");
		this.onUpdate = new Runner("update");
		this.onError = new Runner("onError");
	}
	/**
	* Bind to a parent BaseTexture
	* @param baseTexture - Parent texture
	*/
	Resource.prototype.bind = function(baseTexture) {
		this.onResize.add(baseTexture);
		this.onUpdate.add(baseTexture);
		this.onError.add(baseTexture);
		if (this._width || this._height) this.onResize.emit(this._width, this._height);
	};
	/**
	* Unbind to a parent BaseTexture
	* @param baseTexture - Parent texture
	*/
	Resource.prototype.unbind = function(baseTexture) {
		this.onResize.remove(baseTexture);
		this.onUpdate.remove(baseTexture);
		this.onError.remove(baseTexture);
	};
	/**
	* Trigger a resize event
	* @param width - X dimension
	* @param height - Y dimension
	*/
	Resource.prototype.resize = function(width, height) {
		if (width !== this._width || height !== this._height) {
			this._width = width;
			this._height = height;
			this.onResize.emit(width, height);
		}
	};
	Object.defineProperty(Resource.prototype, "valid", {
		/**
		* Has been validated
		* @readonly
		*/
		get: function() {
			return !!this._width && !!this._height;
		},
		enumerable: false,
		configurable: true
	});
	/** Has been updated trigger event. */
	Resource.prototype.update = function() {
		if (!this.destroyed) this.onUpdate.emit();
	};
	/**
	* This can be overridden to start preloading a resource
	* or do any other prepare step.
	* @protected
	* @returns Handle the validate event
	*/
	Resource.prototype.load = function() {
		return Promise.resolve(this);
	};
	Object.defineProperty(Resource.prototype, "width", {
		/**
		* The width of the resource.
		* @readonly
		*/
		get: function() {
			return this._width;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Resource.prototype, "height", {
		/**
		* The height of the resource.
		* @readonly
		*/
		get: function() {
			return this._height;
		},
		enumerable: false,
		configurable: true
	});
	/**
	* Set the style, optional to override
	* @param _renderer - yeah, renderer!
	* @param _baseTexture - the texture
	* @param _glTexture - texture instance for this webgl context
	* @returns - `true` is success
	*/
	Resource.prototype.style = function(_renderer, _baseTexture, _glTexture) {
		return false;
	};
	/** Clean up anything, this happens when destroying is ready. */
	Resource.prototype.dispose = function() {};
	/**
	* Call when destroying resource, unbind any BaseTexture object
	* before calling this method, as reference counts are maintained
	* internally.
	*/
	Resource.prototype.destroy = function() {
		if (!this.destroyed) {
			this.destroyed = true;
			this.dispose();
			this.onError.removeAll();
			this.onError = null;
			this.onResize.removeAll();
			this.onResize = null;
			this.onUpdate.removeAll();
			this.onUpdate = null;
		}
	};
	/**
	* Abstract, used to auto-detect resource type.
	* @param {*} _source - The source object
	* @param {string} _extension - The extension of source, if set
	*/
	Resource.test = function(_source, _extension) {
		return false;
	};
	return Resource;
}();
/**
* @interface SharedArrayBuffer
*/
/**
* Buffer resource with data of typed array.
* @memberof PIXI
*/
var BufferResource = function(_super) {
	__extends$1(BufferResource, _super);
	/**
	* @param source - Source buffer
	* @param options - Options
	* @param {number} options.width - Width of the texture
	* @param {number} options.height - Height of the texture
	*/
	function BufferResource(source, options) {
		var _this = this;
		var _a = options || {}, width = _a.width, height = _a.height;
		if (!width || !height) throw new Error("BufferResource width or height invalid");
		_this = _super.call(this, width, height) || this;
		_this.data = source;
		return _this;
	}
	/**
	* Upload the texture to the GPU.
	* @param renderer - Upload to the renderer
	* @param baseTexture - Reference to parent texture
	* @param glTexture - glTexture
	* @returns - true is success
	*/
	BufferResource.prototype.upload = function(renderer, baseTexture, glTexture) {
		var gl = renderer.gl;
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, baseTexture.alphaMode === ALPHA_MODES.UNPACK);
		var width = baseTexture.realWidth;
		var height = baseTexture.realHeight;
		if (glTexture.width === width && glTexture.height === height) gl.texSubImage2D(baseTexture.target, 0, 0, 0, width, height, baseTexture.format, glTexture.type, this.data);
		else {
			glTexture.width = width;
			glTexture.height = height;
			gl.texImage2D(baseTexture.target, 0, glTexture.internalFormat, width, height, 0, baseTexture.format, glTexture.type, this.data);
		}
		return true;
	};
	/** Destroy and don't use after this. */
	BufferResource.prototype.dispose = function() {
		this.data = null;
	};
	/**
	* Used to auto-detect the type of resource.
	* @param {*} source - The source object
	* @returns {boolean} `true` if <canvas>
	*/
	BufferResource.test = function(source) {
		return source instanceof Float32Array || source instanceof Uint8Array || source instanceof Uint32Array;
	};
	return BufferResource;
}(Resource);
var defaultBufferOptions = {
	scaleMode: SCALE_MODES.NEAREST,
	format: FORMATS.RGBA,
	alphaMode: ALPHA_MODES.NPM
};
/**
* A Texture stores the information that represents an image.
* All textures have a base texture, which contains information about the source.
* Therefore you can have many textures all using a single BaseTexture
* @memberof PIXI
* @typeParam R - The BaseTexture's Resource type.
* @typeParam RO - The options for constructing resource.
*/
var BaseTexture = function(_super) {
	__extends$1(BaseTexture, _super);
	/**
	* @param {PIXI.Resource|string|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement} [resource=null] -
	*        The current resource to use, for things that aren't Resource objects, will be converted
	*        into a Resource.
	* @param options - Collection of options
	* @param {PIXI.MIPMAP_MODES} [options.mipmap=PIXI.settings.MIPMAP_TEXTURES] - If mipmapping is enabled for texture
	* @param {number} [options.anisotropicLevel=PIXI.settings.ANISOTROPIC_LEVEL] - Anisotropic filtering level of texture
	* @param {PIXI.WRAP_MODES} [options.wrapMode=PIXI.settings.WRAP_MODE] - Wrap mode for textures
	* @param {PIXI.SCALE_MODES} [options.scaleMode=PIXI.settings.SCALE_MODE] - Default scale mode, linear, nearest
	* @param {PIXI.FORMATS} [options.format=PIXI.FORMATS.RGBA] - GL format type
	* @param {PIXI.TYPES} [options.type=PIXI.TYPES.UNSIGNED_BYTE] - GL data type
	* @param {PIXI.TARGETS} [options.target=PIXI.TARGETS.TEXTURE_2D] - GL texture target
	* @param {PIXI.ALPHA_MODES} [options.alphaMode=PIXI.ALPHA_MODES.UNPACK] - Pre multiply the image alpha
	* @param {number} [options.width=0] - Width of the texture
	* @param {number} [options.height=0] - Height of the texture
	* @param {number} [options.resolution=PIXI.settings.RESOLUTION] - Resolution of the base texture
	* @param {object} [options.resourceOptions] - Optional resource options,
	*        see {@link PIXI.autoDetectResource autoDetectResource}
	*/
	function BaseTexture(resource, options) {
		if (resource === void 0) resource = null;
		if (options === void 0) options = null;
		var _this = _super.call(this) || this;
		options = options || {};
		var alphaMode = options.alphaMode, mipmap = options.mipmap, anisotropicLevel = options.anisotropicLevel, scaleMode = options.scaleMode, width = options.width, height = options.height, wrapMode = options.wrapMode, format = options.format, type = options.type, target = options.target, resolution = options.resolution, resourceOptions = options.resourceOptions;
		if (resource && !(resource instanceof Resource)) {
			resource = autoDetectResource(resource, resourceOptions);
			resource.internal = true;
		}
		_this.resolution = resolution || settings.RESOLUTION;
		_this.width = Math.round((width || 0) * _this.resolution) / _this.resolution;
		_this.height = Math.round((height || 0) * _this.resolution) / _this.resolution;
		_this._mipmap = mipmap !== void 0 ? mipmap : settings.MIPMAP_TEXTURES;
		_this.anisotropicLevel = anisotropicLevel !== void 0 ? anisotropicLevel : settings.ANISOTROPIC_LEVEL;
		_this._wrapMode = wrapMode || settings.WRAP_MODE;
		_this._scaleMode = scaleMode !== void 0 ? scaleMode : settings.SCALE_MODE;
		_this.format = format || FORMATS.RGBA;
		_this.type = type || TYPES.UNSIGNED_BYTE;
		_this.target = target || TARGETS.TEXTURE_2D;
		_this.alphaMode = alphaMode !== void 0 ? alphaMode : ALPHA_MODES.UNPACK;
		_this.uid = uid();
		_this.touched = 0;
		_this.isPowerOfTwo = false;
		_this._refreshPOT();
		_this._glTextures = {};
		_this.dirtyId = 0;
		_this.dirtyStyleId = 0;
		_this.cacheId = null;
		_this.valid = width > 0 && height > 0;
		_this.textureCacheIds = [];
		_this.destroyed = false;
		_this.resource = null;
		_this._batchEnabled = 0;
		_this._batchLocation = 0;
		_this.parentTextureArray = null;
		/**
		* Fired when a not-immediately-available source finishes loading.
		* @protected
		* @event PIXI.BaseTexture#loaded
		* @param {PIXI.BaseTexture} baseTexture - Resource loaded.
		*/
		/**
		* Fired when a not-immediately-available source fails to load.
		* @protected
		* @event PIXI.BaseTexture#error
		* @param {PIXI.BaseTexture} baseTexture - Resource errored.
		* @param {ErrorEvent} event - Load error event.
		*/
		/**
		* Fired when BaseTexture is updated.
		* @protected
		* @event PIXI.BaseTexture#loaded
		* @param {PIXI.BaseTexture} baseTexture - Resource loaded.
		*/
		/**
		* Fired when BaseTexture is updated.
		* @protected
		* @event PIXI.BaseTexture#update
		* @param {PIXI.BaseTexture} baseTexture - Instance of texture being updated.
		*/
		/**
		* Fired when BaseTexture is destroyed.
		* @protected
		* @event PIXI.BaseTexture#dispose
		* @param {PIXI.BaseTexture} baseTexture - Instance of texture being destroyed.
		*/
		_this.setResource(resource);
		return _this;
	}
	Object.defineProperty(BaseTexture.prototype, "realWidth", {
		/**
		* Pixel width of the source of this texture
		* @readonly
		*/
		get: function() {
			return Math.round(this.width * this.resolution);
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BaseTexture.prototype, "realHeight", {
		/**
		* Pixel height of the source of this texture
		* @readonly
		*/
		get: function() {
			return Math.round(this.height * this.resolution);
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BaseTexture.prototype, "mipmap", {
		/**
		* Mipmap mode of the texture, affects downscaled images
		* @default PIXI.settings.MIPMAP_TEXTURES
		*/
		get: function() {
			return this._mipmap;
		},
		set: function(value) {
			if (this._mipmap !== value) {
				this._mipmap = value;
				this.dirtyStyleId++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BaseTexture.prototype, "scaleMode", {
		/**
		* The scale mode to apply when scaling this texture
		* @default PIXI.settings.SCALE_MODE
		*/
		get: function() {
			return this._scaleMode;
		},
		set: function(value) {
			if (this._scaleMode !== value) {
				this._scaleMode = value;
				this.dirtyStyleId++;
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BaseTexture.prototype, "wrapMode", {
		/**
		* How the texture wraps
		* @default PIXI.settings.WRAP_MODE
		*/
		get: function() {
			return this._wrapMode;
		},
		set: function(value) {
			if (this._wrapMode !== value) {
				this._wrapMode = value;
				this.dirtyStyleId++;
			}
		},
		enumerable: false,
		configurable: true
	});
	/**
	* Changes style options of BaseTexture
	* @param scaleMode - Pixi scalemode
	* @param mipmap - enable mipmaps
	* @returns - this
	*/
	BaseTexture.prototype.setStyle = function(scaleMode, mipmap) {
		var dirty;
		if (scaleMode !== void 0 && scaleMode !== this.scaleMode) {
			this.scaleMode = scaleMode;
			dirty = true;
		}
		if (mipmap !== void 0 && mipmap !== this.mipmap) {
			this.mipmap = mipmap;
			dirty = true;
		}
		if (dirty) this.dirtyStyleId++;
		return this;
	};
	/**
	* Changes w/h/resolution. Texture becomes valid if width and height are greater than zero.
	* @param desiredWidth - Desired visual width
	* @param desiredHeight - Desired visual height
	* @param resolution - Optionally set resolution
	* @returns - this
	*/
	BaseTexture.prototype.setSize = function(desiredWidth, desiredHeight, resolution) {
		resolution = resolution || this.resolution;
		return this.setRealSize(desiredWidth * resolution, desiredHeight * resolution, resolution);
	};
	/**
	* Sets real size of baseTexture, preserves current resolution.
	* @param realWidth - Full rendered width
	* @param realHeight - Full rendered height
	* @param resolution - Optionally set resolution
	* @returns - this
	*/
	BaseTexture.prototype.setRealSize = function(realWidth, realHeight, resolution) {
		this.resolution = resolution || this.resolution;
		this.width = Math.round(realWidth) / this.resolution;
		this.height = Math.round(realHeight) / this.resolution;
		this._refreshPOT();
		this.update();
		return this;
	};
	/**
	* Refresh check for isPowerOfTwo texture based on size
	* @private
	*/
	BaseTexture.prototype._refreshPOT = function() {
		this.isPowerOfTwo = isPow2(this.realWidth) && isPow2(this.realHeight);
	};
	/**
	* Changes resolution
	* @param resolution - res
	* @returns - this
	*/
	BaseTexture.prototype.setResolution = function(resolution) {
		var oldResolution = this.resolution;
		if (oldResolution === resolution) return this;
		this.resolution = resolution;
		if (this.valid) {
			this.width = Math.round(this.width * oldResolution) / resolution;
			this.height = Math.round(this.height * oldResolution) / resolution;
			this.emit("update", this);
		}
		this._refreshPOT();
		return this;
	};
	/**
	* Sets the resource if it wasn't set. Throws error if resource already present
	* @param resource - that is managing this BaseTexture
	* @returns - this
	*/
	BaseTexture.prototype.setResource = function(resource) {
		if (this.resource === resource) return this;
		if (this.resource) throw new Error("Resource can be set only once");
		resource.bind(this);
		this.resource = resource;
		return this;
	};
	/** Invalidates the object. Texture becomes valid if width and height are greater than zero. */
	BaseTexture.prototype.update = function() {
		if (!this.valid) {
			if (this.width > 0 && this.height > 0) {
				this.valid = true;
				this.emit("loaded", this);
				this.emit("update", this);
			}
		} else {
			this.dirtyId++;
			this.dirtyStyleId++;
			this.emit("update", this);
		}
	};
	/**
	* Handle errors with resources.
	* @private
	* @param event - Error event emitted.
	*/
	BaseTexture.prototype.onError = function(event) {
		this.emit("error", this, event);
	};
	/**
	* Destroys this base texture.
	* The method stops if resource doesn't want this texture to be destroyed.
	* Removes texture from all caches.
	*/
	BaseTexture.prototype.destroy = function() {
		if (this.resource) {
			this.resource.unbind(this);
			if (this.resource.internal) this.resource.destroy();
			this.resource = null;
		}
		if (this.cacheId) {
			delete BaseTextureCache[this.cacheId];
			delete TextureCache[this.cacheId];
			this.cacheId = null;
		}
		this.dispose();
		BaseTexture.removeFromCache(this);
		this.textureCacheIds = null;
		this.destroyed = true;
	};
	/**
	* Frees the texture from WebGL memory without destroying this texture object.
	* This means you can still use the texture later which will upload it to GPU
	* memory again.
	* @fires PIXI.BaseTexture#dispose
	*/
	BaseTexture.prototype.dispose = function() {
		this.emit("dispose", this);
	};
	/** Utility function for BaseTexture|Texture cast. */
	BaseTexture.prototype.castToBaseTexture = function() {
		return this;
	};
	/**
	* Helper function that creates a base texture based on the source you provide.
	* The source can be - image url, image element, canvas element. If the
	* source is an image url or an image element and not in the base texture
	* cache, it will be created and loaded.
	* @static
	* @param {string|string[]|HTMLImageElement|HTMLCanvasElement|SVGElement|HTMLVideoElement} source - The
	*        source to create base texture from.
	* @param options - See {@link PIXI.BaseTexture}'s constructor for options.
	* @param {string} [options.pixiIdPrefix=pixiid] - If a source has no id, this is the prefix of the generated id
	* @param {boolean} [strict] - Enforce strict-mode, see {@link PIXI.settings.STRICT_TEXTURE_CACHE}.
	* @returns {PIXI.BaseTexture} The new base texture.
	*/
	BaseTexture.from = function(source, options, strict) {
		if (strict === void 0) strict = settings.STRICT_TEXTURE_CACHE;
		var isFrame = typeof source === "string";
		var cacheId = null;
		if (isFrame) cacheId = source;
		else {
			if (!source._pixiId) source._pixiId = (options && options.pixiIdPrefix || "pixiid") + "_" + uid();
			cacheId = source._pixiId;
		}
		var baseTexture = BaseTextureCache[cacheId];
		if (isFrame && strict && !baseTexture) throw new Error("The cacheId \"" + cacheId + "\" does not exist in BaseTextureCache.");
		if (!baseTexture) {
			baseTexture = new BaseTexture(source, options);
			baseTexture.cacheId = cacheId;
			BaseTexture.addToCache(baseTexture, cacheId);
		}
		return baseTexture;
	};
	/**
	* Create a new BaseTexture with a BufferResource from a Float32Array.
	* RGBA values are floats from 0 to 1.
	* @param {Float32Array|Uint8Array} buffer - The optional array to use, if no data
	*        is provided, a new Float32Array is created.
	* @param width - Width of the resource
	* @param height - Height of the resource
	* @param options - See {@link PIXI.BaseTexture}'s constructor for options.
	*        Default properties are different from the constructor's defaults.
	* @param {PIXI.FORMATS} [options.format=PIXI.FORMATS.RGBA] - GL format type
	* @param {PIXI.ALPHA_MODES} [options.alphaMode=PIXI.ALPHA_MODES.NPM] - Image alpha, not premultiplied by default
	* @param {PIXI.SCALE_MODES} [options.scaleMode=PIXI.SCALE_MODES.NEAREST] - Scale mode, pixelating by default
	* @returns - The resulting new BaseTexture
	*/
	BaseTexture.fromBuffer = function(buffer, width, height, options) {
		buffer = buffer || new Float32Array(width * height * 4);
		var resource = new BufferResource(buffer, {
			width,
			height
		});
		var type = buffer instanceof Float32Array ? TYPES.FLOAT : TYPES.UNSIGNED_BYTE;
		return new BaseTexture(resource, Object.assign({}, defaultBufferOptions, options || {
			width,
			height,
			type
		}));
	};
	/**
	* Adds a BaseTexture to the global BaseTextureCache. This cache is shared across the whole PIXI object.
	* @param {PIXI.BaseTexture} baseTexture - The BaseTexture to add to the cache.
	* @param {string} id - The id that the BaseTexture will be stored against.
	*/
	BaseTexture.addToCache = function(baseTexture, id) {
		if (id) {
			if (baseTexture.textureCacheIds.indexOf(id) === -1) baseTexture.textureCacheIds.push(id);
			if (BaseTextureCache[id]) console.warn("BaseTexture added to the cache with an id [" + id + "] that already had an entry");
			BaseTextureCache[id] = baseTexture;
		}
	};
	/**
	* Remove a BaseTexture from the global BaseTextureCache.
	* @param {string|PIXI.BaseTexture} baseTexture - id of a BaseTexture to be removed, or a BaseTexture instance itself.
	* @returns {PIXI.BaseTexture|null} The BaseTexture that was removed.
	*/
	BaseTexture.removeFromCache = function(baseTexture) {
		if (typeof baseTexture === "string") {
			var baseTextureFromCache = BaseTextureCache[baseTexture];
			if (baseTextureFromCache) {
				var index = baseTextureFromCache.textureCacheIds.indexOf(baseTexture);
				if (index > -1) baseTextureFromCache.textureCacheIds.splice(index, 1);
				delete BaseTextureCache[baseTexture];
				return baseTextureFromCache;
			}
		} else if (baseTexture && baseTexture.textureCacheIds) {
			for (var i = 0; i < baseTexture.textureCacheIds.length; ++i) delete BaseTextureCache[baseTexture.textureCacheIds[i]];
			baseTexture.textureCacheIds.length = 0;
			return baseTexture;
		}
		return null;
	};
	/** Global number of the texture batch, used by multi-texture renderers. */
	BaseTexture._globalBatch = 0;
	return BaseTexture;
}(import_eventemitter3.default);
/**
* Resource that can manage several resource (items) inside.
* All resources need to have the same pixel size.
* Parent class for CubeResource and ArrayResource
* @memberof PIXI
*/
var AbstractMultiResource = function(_super) {
	__extends$1(AbstractMultiResource, _super);
	/**
	* @param length
	* @param options - Options to for Resource constructor
	* @param {number} [options.width] - Width of the resource
	* @param {number} [options.height] - Height of the resource
	*/
	function AbstractMultiResource(length, options) {
		var _this = this;
		var _a = options || {}, width = _a.width, height = _a.height;
		_this = _super.call(this, width, height) || this;
		_this.items = [];
		_this.itemDirtyIds = [];
		for (var i = 0; i < length; i++) {
			var partTexture = new BaseTexture();
			_this.items.push(partTexture);
			_this.itemDirtyIds.push(-2);
		}
		_this.length = length;
		_this._load = null;
		_this.baseTexture = null;
		return _this;
	}
	/**
	* Used from ArrayResource and CubeResource constructors.
	* @param resources - Can be resources, image elements, canvas, etc. ,
	*  length should be same as constructor length
	* @param options - Detect options for resources
	*/
	AbstractMultiResource.prototype.initFromArray = function(resources, options) {
		for (var i = 0; i < this.length; i++) {
			if (!resources[i]) continue;
			if (resources[i].castToBaseTexture) this.addBaseTextureAt(resources[i].castToBaseTexture(), i);
			else if (resources[i] instanceof Resource) this.addResourceAt(resources[i], i);
			else this.addResourceAt(autoDetectResource(resources[i], options), i);
		}
	};
	/** Destroy this BaseImageResource. */
	AbstractMultiResource.prototype.dispose = function() {
		for (var i = 0, len = this.length; i < len; i++) this.items[i].destroy();
		this.items = null;
		this.itemDirtyIds = null;
		this._load = null;
	};
	/**
	* Set a resource by ID
	* @param resource
	* @param index - Zero-based index of resource to set
	* @returns - Instance for chaining
	*/
	AbstractMultiResource.prototype.addResourceAt = function(resource, index) {
		if (!this.items[index]) throw new Error("Index " + index + " is out of bounds");
		if (resource.valid && !this.valid) this.resize(resource.width, resource.height);
		this.items[index].setResource(resource);
		return this;
	};
	/**
	* Set the parent base texture.
	* @param baseTexture
	*/
	AbstractMultiResource.prototype.bind = function(baseTexture) {
		if (this.baseTexture !== null) throw new Error("Only one base texture per TextureArray is allowed");
		_super.prototype.bind.call(this, baseTexture);
		for (var i = 0; i < this.length; i++) {
			this.items[i].parentTextureArray = baseTexture;
			this.items[i].on("update", baseTexture.update, baseTexture);
		}
	};
	/**
	* Unset the parent base texture.
	* @param baseTexture
	*/
	AbstractMultiResource.prototype.unbind = function(baseTexture) {
		_super.prototype.unbind.call(this, baseTexture);
		for (var i = 0; i < this.length; i++) {
			this.items[i].parentTextureArray = null;
			this.items[i].off("update", baseTexture.update, baseTexture);
		}
	};
	/**
	* Load all the resources simultaneously
	* @returns - When load is resolved
	*/
	AbstractMultiResource.prototype.load = function() {
		var _this = this;
		if (this._load) return this._load;
		var promises = this.items.map(function(item) {
			return item.resource;
		}).filter(function(item) {
			return item;
		}).map(function(item) {
			return item.load();
		});
		this._load = Promise.all(promises).then(function() {
			var _a = _this.items[0], realWidth = _a.realWidth, realHeight = _a.realHeight;
			_this.resize(realWidth, realHeight);
			return Promise.resolve(_this);
		});
		return this._load;
	};
	return AbstractMultiResource;
}(Resource);
/**
* A resource that contains a number of sources.
* @memberof PIXI
*/
var ArrayResource = function(_super) {
	__extends$1(ArrayResource, _super);
	/**
	* @param source - Number of items in array or the collection
	*        of image URLs to use. Can also be resources, image elements, canvas, etc.
	* @param options - Options to apply to {@link PIXI.autoDetectResource}
	* @param {number} [options.width] - Width of the resource
	* @param {number} [options.height] - Height of the resource
	*/
	function ArrayResource(source, options) {
		var _this = this;
		var _a = options || {}, width = _a.width, height = _a.height;
		var urls;
		var length;
		if (Array.isArray(source)) {
			urls = source;
			length = source.length;
		} else length = source;
		_this = _super.call(this, length, {
			width,
			height
		}) || this;
		if (urls) _this.initFromArray(urls, options);
		return _this;
	}
	/**
	* Set a baseTexture by ID,
	* ArrayResource just takes resource from it, nothing more
	* @param baseTexture
	* @param index - Zero-based index of resource to set
	* @returns - Instance for chaining
	*/
	ArrayResource.prototype.addBaseTextureAt = function(baseTexture, index) {
		if (baseTexture.resource) this.addResourceAt(baseTexture.resource, index);
		else throw new Error("ArrayResource does not support RenderTexture");
		return this;
	};
	/**
	* Add binding
	* @param baseTexture
	*/
	ArrayResource.prototype.bind = function(baseTexture) {
		_super.prototype.bind.call(this, baseTexture);
		baseTexture.target = TARGETS.TEXTURE_2D_ARRAY;
	};
	/**
	* Upload the resources to the GPU.
	* @param renderer
	* @param texture
	* @param glTexture
	* @returns - whether texture was uploaded
	*/
	ArrayResource.prototype.upload = function(renderer, texture, glTexture) {
		var _a = this, length = _a.length, itemDirtyIds = _a.itemDirtyIds, items = _a.items;
		var gl = renderer.gl;
		if (glTexture.dirtyId < 0) gl.texImage3D(gl.TEXTURE_2D_ARRAY, 0, glTexture.internalFormat, this._width, this._height, length, 0, texture.format, glTexture.type, null);
		for (var i = 0; i < length; i++) {
			var item = items[i];
			if (itemDirtyIds[i] < item.dirtyId) {
				itemDirtyIds[i] = item.dirtyId;
				if (item.valid) gl.texSubImage3D(gl.TEXTURE_2D_ARRAY, 0, 0, 0, i, item.resource.width, item.resource.height, 1, texture.format, glTexture.type, item.resource.source);
			}
		}
		return true;
	};
	return ArrayResource;
}(AbstractMultiResource);
/**
* Base for all the image/canvas resources.
* @memberof PIXI
*/
var BaseImageResource = function(_super) {
	__extends$1(BaseImageResource, _super);
	/**
	* @param {HTMLImageElement|HTMLCanvasElement|HTMLVideoElement|SVGElement} source
	*/
	function BaseImageResource(source) {
		var _this = this;
		var sourceAny = source;
		var width = sourceAny.naturalWidth || sourceAny.videoWidth || sourceAny.width;
		var height = sourceAny.naturalHeight || sourceAny.videoHeight || sourceAny.height;
		_this = _super.call(this, width, height) || this;
		_this.source = source;
		_this.noSubImage = false;
		return _this;
	}
	/**
	* Set cross origin based detecting the url and the crossorigin
	* @param element - Element to apply crossOrigin
	* @param url - URL to check
	* @param crossorigin - Cross origin value to use
	*/
	BaseImageResource.crossOrigin = function(element, url, crossorigin) {
		if (crossorigin === void 0 && url.indexOf("data:") !== 0) element.crossOrigin = determineCrossOrigin(url);
		else if (crossorigin !== false) element.crossOrigin = typeof crossorigin === "string" ? crossorigin : "anonymous";
	};
	/**
	* Upload the texture to the GPU.
	* @param renderer - Upload to the renderer
	* @param baseTexture - Reference to parent texture
	* @param glTexture
	* @param {HTMLImageElement|HTMLCanvasElement|HTMLVideoElement|SVGElement} [source] - (optional)
	* @returns - true is success
	*/
	BaseImageResource.prototype.upload = function(renderer, baseTexture, glTexture, source) {
		var gl = renderer.gl;
		var width = baseTexture.realWidth;
		var height = baseTexture.realHeight;
		source = source || this.source;
		if (source instanceof HTMLImageElement) {
			if (!source.complete || source.naturalWidth === 0) return false;
		} else if (source instanceof HTMLVideoElement) {
			if (source.readyState <= 1) return false;
		}
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, baseTexture.alphaMode === ALPHA_MODES.UNPACK);
		if (!this.noSubImage && baseTexture.target === gl.TEXTURE_2D && glTexture.width === width && glTexture.height === height) gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, baseTexture.format, glTexture.type, source);
		else {
			glTexture.width = width;
			glTexture.height = height;
			gl.texImage2D(baseTexture.target, 0, glTexture.internalFormat, baseTexture.format, glTexture.type, source);
		}
		return true;
	};
	/**
	* Checks if source width/height was changed, resize can cause extra baseTexture update.
	* Triggers one update in any case.
	*/
	BaseImageResource.prototype.update = function() {
		if (this.destroyed) return;
		var source = this.source;
		var width = source.naturalWidth || source.videoWidth || source.width;
		var height = source.naturalHeight || source.videoHeight || source.height;
		this.resize(width, height);
		_super.prototype.update.call(this);
	};
	/** Destroy this {@link BaseImageResource} */
	BaseImageResource.prototype.dispose = function() {
		this.source = null;
	};
	return BaseImageResource;
}(Resource);
/**
* @interface OffscreenCanvas
*/
/**
* Resource type for HTMLCanvasElement.
* @memberof PIXI
*/
var CanvasResource = function(_super) {
	__extends$1(CanvasResource, _super);
	/**
	* @param source - Canvas element to use
	*/
	function CanvasResource(source) {
		return _super.call(this, source) || this;
	}
	/**
	* Used to auto-detect the type of resource.
	* @param {*} source - The source object
	* @returns {boolean} `true` if source is HTMLCanvasElement or OffscreenCanvas
	*/
	CanvasResource.test = function(source) {
		var OffscreenCanvas = globalThis.OffscreenCanvas;
		if (OffscreenCanvas && source instanceof OffscreenCanvas) return true;
		return globalThis.HTMLCanvasElement && source instanceof HTMLCanvasElement;
	};
	return CanvasResource;
}(BaseImageResource);
/**
* Resource for a CubeTexture which contains six resources.
* @memberof PIXI
*/
var CubeResource = function(_super) {
	__extends$1(CubeResource, _super);
	/**
	* @param {Array<string|PIXI.Resource>} [source] - Collection of URLs or resources
	*        to use as the sides of the cube.
	* @param options - ImageResource options
	* @param {number} [options.width] - Width of resource
	* @param {number} [options.height] - Height of resource
	* @param {number} [options.autoLoad=true] - Whether to auto-load resources
	* @param {number} [options.linkBaseTexture=true] - In case BaseTextures are supplied,
	*   whether to copy them or use
	*/
	function CubeResource(source, options) {
		var _this = this;
		var _a = options || {}, width = _a.width, height = _a.height, autoLoad = _a.autoLoad, linkBaseTexture = _a.linkBaseTexture;
		if (source && source.length !== CubeResource.SIDES) throw new Error("Invalid length. Got " + source.length + ", expected 6");
		_this = _super.call(this, 6, {
			width,
			height
		}) || this;
		for (var i = 0; i < CubeResource.SIDES; i++) _this.items[i].target = TARGETS.TEXTURE_CUBE_MAP_POSITIVE_X + i;
		_this.linkBaseTexture = linkBaseTexture !== false;
		if (source) _this.initFromArray(source, options);
		if (autoLoad !== false) _this.load();
		return _this;
	}
	/**
	* Add binding.
	* @param baseTexture - parent base texture
	*/
	CubeResource.prototype.bind = function(baseTexture) {
		_super.prototype.bind.call(this, baseTexture);
		baseTexture.target = TARGETS.TEXTURE_CUBE_MAP;
	};
	CubeResource.prototype.addBaseTextureAt = function(baseTexture, index, linkBaseTexture) {
		if (!this.items[index]) throw new Error("Index " + index + " is out of bounds");
		if (!this.linkBaseTexture || baseTexture.parentTextureArray || Object.keys(baseTexture._glTextures).length > 0) {
			if (baseTexture.resource) this.addResourceAt(baseTexture.resource, index);
			else throw new Error("CubeResource does not support copying of renderTexture.");
		} else {
			baseTexture.target = TARGETS.TEXTURE_CUBE_MAP_POSITIVE_X + index;
			baseTexture.parentTextureArray = this.baseTexture;
			this.items[index] = baseTexture;
		}
		if (baseTexture.valid && !this.valid) this.resize(baseTexture.realWidth, baseTexture.realHeight);
		this.items[index] = baseTexture;
		return this;
	};
	/**
	* Upload the resource
	* @param renderer
	* @param _baseTexture
	* @param glTexture
	* @returns {boolean} true is success
	*/
	CubeResource.prototype.upload = function(renderer, _baseTexture, glTexture) {
		var dirty = this.itemDirtyIds;
		for (var i = 0; i < CubeResource.SIDES; i++) {
			var side = this.items[i];
			if (dirty[i] < side.dirtyId || glTexture.dirtyId < _baseTexture.dirtyId) {
				if (side.valid && side.resource) {
					side.resource.upload(renderer, side, glTexture);
					dirty[i] = side.dirtyId;
				} else if (dirty[i] < -1) {
					renderer.gl.texImage2D(side.target, 0, glTexture.internalFormat, _baseTexture.realWidth, _baseTexture.realHeight, 0, _baseTexture.format, glTexture.type, null);
					dirty[i] = -1;
				}
			}
		}
		return true;
	};
	/**
	* Used to auto-detect the type of resource.
	* @param {*} source - The source object
	* @returns {boolean} `true` if source is an array of 6 elements
	*/
	CubeResource.test = function(source) {
		return Array.isArray(source) && source.length === CubeResource.SIDES;
	};
	/** Number of texture sides to store for CubeResources. */
	CubeResource.SIDES = 6;
	return CubeResource;
}(AbstractMultiResource);
/**
* Resource type for HTMLImageElement.
* @memberof PIXI
*/
var ImageResource = function(_super) {
	__extends$1(ImageResource, _super);
	/**
	* @param source - image source or URL
	* @param options
	* @param {boolean} [options.autoLoad=true] - start loading process
	* @param {boolean} [options.createBitmap=PIXI.settings.CREATE_IMAGE_BITMAP] - whether its required to create
	*        a bitmap before upload
	* @param {boolean} [options.crossorigin=true] - Load image using cross origin
	* @param {PIXI.ALPHA_MODES} [options.alphaMode=PIXI.ALPHA_MODES.UNPACK] - Premultiply image alpha in bitmap
	*/
	function ImageResource(source, options) {
		var _this = this;
		options = options || {};
		if (!(source instanceof HTMLImageElement)) {
			var imageElement = new Image();
			BaseImageResource.crossOrigin(imageElement, source, options.crossorigin);
			imageElement.src = source;
			source = imageElement;
		}
		_this = _super.call(this, source) || this;
		if (!source.complete && !!_this._width && !!_this._height) {
			_this._width = 0;
			_this._height = 0;
		}
		_this.url = source.src;
		_this._process = null;
		_this.preserveBitmap = false;
		_this.createBitmap = (options.createBitmap !== void 0 ? options.createBitmap : settings.CREATE_IMAGE_BITMAP) && !!globalThis.createImageBitmap;
		_this.alphaMode = typeof options.alphaMode === "number" ? options.alphaMode : null;
		_this.bitmap = null;
		_this._load = null;
		if (options.autoLoad !== false) _this.load();
		return _this;
	}
	/**
	* Returns a promise when image will be loaded and processed.
	* @param createBitmap - whether process image into bitmap
	*/
	ImageResource.prototype.load = function(createBitmap) {
		var _this = this;
		if (this._load) return this._load;
		if (createBitmap !== void 0) this.createBitmap = createBitmap;
		this._load = new Promise(function(resolve, reject) {
			var source = _this.source;
			_this.url = source.src;
			var completed = function() {
				if (_this.destroyed) return;
				source.onload = null;
				source.onerror = null;
				_this.resize(source.width, source.height);
				_this._load = null;
				if (_this.createBitmap) resolve(_this.process());
				else resolve(_this);
			};
			if (source.complete && source.src) completed();
			else {
				source.onload = completed;
				source.onerror = function(event) {
					reject(event);
					_this.onError.emit(event);
				};
			}
		});
		return this._load;
	};
	/**
	* Called when we need to convert image into BitmapImage.
	* Can be called multiple times, real promise is cached inside.
	* @returns - Cached promise to fill that bitmap
	*/
	ImageResource.prototype.process = function() {
		var _this = this;
		var source = this.source;
		if (this._process !== null) return this._process;
		if (this.bitmap !== null || !globalThis.createImageBitmap) return Promise.resolve(this);
		var createImageBitmap = globalThis.createImageBitmap;
		var cors = !source.crossOrigin || source.crossOrigin === "anonymous";
		this._process = fetch(source.src, { mode: cors ? "cors" : "no-cors" }).then(function(r) {
			return r.blob();
		}).then(function(blob) {
			return createImageBitmap(blob, 0, 0, source.width, source.height, { premultiplyAlpha: _this.alphaMode === null || _this.alphaMode === ALPHA_MODES.UNPACK ? "premultiply" : "none" });
		}).then(function(bitmap) {
			if (_this.destroyed) return Promise.reject();
			_this.bitmap = bitmap;
			_this.update();
			_this._process = null;
			return Promise.resolve(_this);
		});
		return this._process;
	};
	/**
	* Upload the image resource to GPU.
	* @param renderer - Renderer to upload to
	* @param baseTexture - BaseTexture for this resource
	* @param glTexture - GLTexture to use
	* @returns {boolean} true is success
	*/
	ImageResource.prototype.upload = function(renderer, baseTexture, glTexture) {
		if (typeof this.alphaMode === "number") baseTexture.alphaMode = this.alphaMode;
		if (!this.createBitmap) return _super.prototype.upload.call(this, renderer, baseTexture, glTexture);
		if (!this.bitmap) {
			this.process();
			if (!this.bitmap) return false;
		}
		_super.prototype.upload.call(this, renderer, baseTexture, glTexture, this.bitmap);
		if (!this.preserveBitmap) {
			var flag = true;
			var glTextures = baseTexture._glTextures;
			for (var key in glTextures) {
				var otherTex = glTextures[key];
				if (otherTex !== glTexture && otherTex.dirtyId !== baseTexture.dirtyId) {
					flag = false;
					break;
				}
			}
			if (flag) {
				if (this.bitmap.close) this.bitmap.close();
				this.bitmap = null;
			}
		}
		return true;
	};
	/** Destroys this resource. */
	ImageResource.prototype.dispose = function() {
		this.source.onload = null;
		this.source.onerror = null;
		_super.prototype.dispose.call(this);
		if (this.bitmap) {
			this.bitmap.close();
			this.bitmap = null;
		}
		this._process = null;
		this._load = null;
	};
	/**
	* Used to auto-detect the type of resource.
	* @param {*} source - The source object
	* @returns {boolean} `true` if source is string or HTMLImageElement
	*/
	ImageResource.test = function(source) {
		return typeof source === "string" || source instanceof HTMLImageElement;
	};
	return ImageResource;
}(BaseImageResource);
/**
* Resource type for SVG elements and graphics.
* @memberof PIXI
*/
var SVGResource = function(_super) {
	__extends$1(SVGResource, _super);
	/**
	* @param sourceBase64 - Base64 encoded SVG element or URL for SVG file.
	* @param {object} [options] - Options to use
	* @param {number} [options.scale=1] - Scale to apply to SVG. Overridden by...
	* @param {number} [options.width] - Rasterize SVG this wide. Aspect ratio preserved if height not specified.
	* @param {number} [options.height] - Rasterize SVG this high. Aspect ratio preserved if width not specified.
	* @param {boolean} [options.autoLoad=true] - Start loading right away.
	*/
	function SVGResource(sourceBase64, options) {
		var _this = this;
		options = options || {};
		_this = _super.call(this, settings.ADAPTER.createCanvas()) || this;
		_this._width = 0;
		_this._height = 0;
		_this.svg = sourceBase64;
		_this.scale = options.scale || 1;
		_this._overrideWidth = options.width;
		_this._overrideHeight = options.height;
		_this._resolve = null;
		_this._crossorigin = options.crossorigin;
		_this._load = null;
		if (options.autoLoad !== false) _this.load();
		return _this;
	}
	SVGResource.prototype.load = function() {
		var _this = this;
		if (this._load) return this._load;
		this._load = new Promise(function(resolve) {
			_this._resolve = function() {
				_this.resize(_this.source.width, _this.source.height);
				resolve(_this);
			};
			if (SVGResource.SVG_XML.test(_this.svg.trim())) {
				if (!btoa) throw new Error("Your browser doesn't support base64 conversions.");
				_this.svg = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(_this.svg)));
			}
			_this._loadSvg();
		});
		return this._load;
	};
	/** Loads an SVG image from `imageUrl` or `data URL`. */
	SVGResource.prototype._loadSvg = function() {
		var _this = this;
		var tempImage = new Image();
		BaseImageResource.crossOrigin(tempImage, this.svg, this._crossorigin);
		tempImage.src = this.svg;
		tempImage.onerror = function(event) {
			if (!_this._resolve) return;
			tempImage.onerror = null;
			_this.onError.emit(event);
		};
		tempImage.onload = function() {
			if (!_this._resolve) return;
			var svgWidth = tempImage.width;
			var svgHeight = tempImage.height;
			if (!svgWidth || !svgHeight) throw new Error("The SVG image must have width and height defined (in pixels), canvas API needs them.");
			var width = svgWidth * _this.scale;
			var height = svgHeight * _this.scale;
			if (_this._overrideWidth || _this._overrideHeight) {
				width = _this._overrideWidth || _this._overrideHeight / svgHeight * svgWidth;
				height = _this._overrideHeight || _this._overrideWidth / svgWidth * svgHeight;
			}
			width = Math.round(width);
			height = Math.round(height);
			var canvas = _this.source;
			canvas.width = width;
			canvas.height = height;
			canvas._pixiId = "canvas_" + uid();
			canvas.getContext("2d").drawImage(tempImage, 0, 0, svgWidth, svgHeight, 0, 0, width, height);
			_this._resolve();
			_this._resolve = null;
		};
	};
	/**
	* Get size from an svg string using a regular expression.
	* @param svgString - a serialized svg element
	* @returns - image extension
	*/
	SVGResource.getSize = function(svgString) {
		var sizeMatch = SVGResource.SVG_SIZE.exec(svgString);
		var size = {};
		if (sizeMatch) {
			size[sizeMatch[1]] = Math.round(parseFloat(sizeMatch[3]));
			size[sizeMatch[5]] = Math.round(parseFloat(sizeMatch[7]));
		}
		return size;
	};
	/** Destroys this texture. */
	SVGResource.prototype.dispose = function() {
		_super.prototype.dispose.call(this);
		this._resolve = null;
		this._crossorigin = null;
	};
	/**
	* Used to auto-detect the type of resource.
	* @param {*} source - The source object
	* @param {string} extension - The extension of source, if set
	* @returns {boolean} - If the source is a SVG source or data file
	*/
	SVGResource.test = function(source, extension) {
		return extension === "svg" || typeof source === "string" && source.startsWith("data:image/svg+xml") || typeof source === "string" && SVGResource.SVG_XML.test(source);
	};
	/**
	* Regular expression for SVG XML document.
	* @example &lt;?xml version="1.0" encoding="utf-8" ?&gt;&lt;!-- image/svg --&gt;&lt;svg
	* @readonly
	*/
	SVGResource.SVG_XML = /^(<\?xml[^?]+\?>)?\s*(<!--[^(-->)]*-->)?\s*\<svg/m;
	/**
	* Regular expression for SVG size.
	* @example &lt;svg width="100" height="100"&gt;&lt;/svg&gt;
	* @readonly
	*/
	SVGResource.SVG_SIZE = /<svg[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*>/i;
	return SVGResource;
}(BaseImageResource);
/**
* Resource type for {@code HTMLVideoElement}.
* @memberof PIXI
*/
var VideoResource = function(_super) {
	__extends$1(VideoResource, _super);
	/**
	* @param {HTMLVideoElement|object|string|Array<string|object>} source - Video element to use.
	* @param {object} [options] - Options to use
	* @param {boolean} [options.autoLoad=true] - Start loading the video immediately
	* @param {boolean} [options.autoPlay=true] - Start playing video immediately
	* @param {number} [options.updateFPS=0] - How many times a second to update the texture from the video.
	* Leave at 0 to update at every render.
	* @param {boolean} [options.crossorigin=true] - Load image using cross origin
	*/
	function VideoResource(source, options) {
		var _this = this;
		options = options || {};
		if (!(source instanceof HTMLVideoElement)) {
			var videoElement = document.createElement("video");
			videoElement.setAttribute("preload", "auto");
			videoElement.setAttribute("webkit-playsinline", "");
			videoElement.setAttribute("playsinline", "");
			if (typeof source === "string") source = [source];
			var firstSrc = source[0].src || source[0];
			BaseImageResource.crossOrigin(videoElement, firstSrc, options.crossorigin);
			for (var i = 0; i < source.length; ++i) {
				var sourceElement = document.createElement("source");
				var _a = source[i], src = _a.src, mime = _a.mime;
				src = src || source[i];
				var baseSrc = src.split("?").shift().toLowerCase();
				var ext = baseSrc.slice(baseSrc.lastIndexOf(".") + 1);
				mime = mime || VideoResource.MIME_TYPES[ext] || "video/" + ext;
				sourceElement.src = src;
				sourceElement.type = mime;
				videoElement.appendChild(sourceElement);
			}
			source = videoElement;
		}
		_this = _super.call(this, source) || this;
		_this.noSubImage = true;
		_this._autoUpdate = true;
		_this._isConnectedToTicker = false;
		_this._updateFPS = options.updateFPS || 0;
		_this._msToNextUpdate = 0;
		_this.autoPlay = options.autoPlay !== false;
		_this._load = null;
		_this._resolve = null;
		_this._onCanPlay = _this._onCanPlay.bind(_this);
		_this._onError = _this._onError.bind(_this);
		if (options.autoLoad !== false) _this.load();
		return _this;
	}
	/**
	* Trigger updating of the texture.
	* @param _deltaTime - time delta since last tick
	*/
	VideoResource.prototype.update = function(_deltaTime) {
		if (!this.destroyed) {
			var elapsedMS = Ticker.shared.elapsedMS * this.source.playbackRate;
			this._msToNextUpdate = Math.floor(this._msToNextUpdate - elapsedMS);
			if (!this._updateFPS || this._msToNextUpdate <= 0) {
				_super.prototype.update.call(this);
				this._msToNextUpdate = this._updateFPS ? Math.floor(1e3 / this._updateFPS) : 0;
			}
		}
	};
	/**
	* Start preloading the video resource.
	* @returns {Promise<void>} Handle the validate event
	*/
	VideoResource.prototype.load = function() {
		var _this = this;
		if (this._load) return this._load;
		var source = this.source;
		if ((source.readyState === source.HAVE_ENOUGH_DATA || source.readyState === source.HAVE_FUTURE_DATA) && source.width && source.height) source.complete = true;
		source.addEventListener("play", this._onPlayStart.bind(this));
		source.addEventListener("pause", this._onPlayStop.bind(this));
		if (!this._isSourceReady()) {
			source.addEventListener("canplay", this._onCanPlay);
			source.addEventListener("canplaythrough", this._onCanPlay);
			source.addEventListener("error", this._onError, true);
		} else this._onCanPlay();
		this._load = new Promise(function(resolve) {
			if (_this.valid) resolve(_this);
			else {
				_this._resolve = resolve;
				source.load();
			}
		});
		return this._load;
	};
	/**
	* Handle video error events.
	* @param event
	*/
	VideoResource.prototype._onError = function(event) {
		this.source.removeEventListener("error", this._onError, true);
		this.onError.emit(event);
	};
	/**
	* Returns true if the underlying source is playing.
	* @returns - True if playing.
	*/
	VideoResource.prototype._isSourcePlaying = function() {
		var source = this.source;
		return !source.paused && !source.ended && this._isSourceReady();
	};
	/**
	* Returns true if the underlying source is ready for playing.
	* @returns - True if ready.
	*/
	VideoResource.prototype._isSourceReady = function() {
		return this.source.readyState > 2;
	};
	/** Runs the update loop when the video is ready to play. */
	VideoResource.prototype._onPlayStart = function() {
		if (!this.valid) this._onCanPlay();
		if (this.autoUpdate && !this._isConnectedToTicker) {
			Ticker.shared.add(this.update, this);
			this._isConnectedToTicker = true;
		}
	};
	/** Fired when a pause event is triggered, stops the update loop. */
	VideoResource.prototype._onPlayStop = function() {
		if (this._isConnectedToTicker) {
			Ticker.shared.remove(this.update, this);
			this._isConnectedToTicker = false;
		}
	};
	/** Fired when the video is loaded and ready to play. */
	VideoResource.prototype._onCanPlay = function() {
		var source = this.source;
		source.removeEventListener("canplay", this._onCanPlay);
		source.removeEventListener("canplaythrough", this._onCanPlay);
		var valid = this.valid;
		this.resize(source.videoWidth, source.videoHeight);
		if (!valid && this._resolve) {
			this._resolve(this);
			this._resolve = null;
		}
		if (this._isSourcePlaying()) this._onPlayStart();
		else if (this.autoPlay) source.play();
	};
	/** Destroys this texture. */
	VideoResource.prototype.dispose = function() {
		if (this._isConnectedToTicker) {
			Ticker.shared.remove(this.update, this);
			this._isConnectedToTicker = false;
		}
		var source = this.source;
		if (source) {
			source.removeEventListener("error", this._onError, true);
			source.pause();
			source.src = "";
			source.load();
		}
		_super.prototype.dispose.call(this);
	};
	Object.defineProperty(VideoResource.prototype, "autoUpdate", {
		/** Should the base texture automatically update itself, set to true by default. */
		get: function() {
			return this._autoUpdate;
		},
		set: function(value) {
			if (value !== this._autoUpdate) {
				this._autoUpdate = value;
				if (!this._autoUpdate && this._isConnectedToTicker) {
					Ticker.shared.remove(this.update, this);
					this._isConnectedToTicker = false;
				} else if (this._autoUpdate && !this._isConnectedToTicker && this._isSourcePlaying()) {
					Ticker.shared.add(this.update, this);
					this._isConnectedToTicker = true;
				}
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(VideoResource.prototype, "updateFPS", {
		/**
		* How many times a second to update the texture from the video. Leave at 0 to update at every render.
		* A lower fps can help performance, as updating the texture at 60fps on a 30ps video may not be efficient.
		*/
		get: function() {
			return this._updateFPS;
		},
		set: function(value) {
			if (value !== this._updateFPS) this._updateFPS = value;
		},
		enumerable: false,
		configurable: true
	});
	/**
	* Used to auto-detect the type of resource.
	* @param {*} source - The source object
	* @param {string} extension - The extension of source, if set
	* @returns {boolean} `true` if video source
	*/
	VideoResource.test = function(source, extension) {
		return globalThis.HTMLVideoElement && source instanceof HTMLVideoElement || VideoResource.TYPES.indexOf(extension) > -1;
	};
	/**
	* List of common video file extensions supported by VideoResource.
	* @readonly
	*/
	VideoResource.TYPES = [
		"mp4",
		"m4v",
		"webm",
		"ogg",
		"ogv",
		"h264",
		"avi",
		"mov"
	];
	/**
	* Map of video MIME types that can't be directly derived from file extensions.
	* @readonly
	*/
	VideoResource.MIME_TYPES = {
		ogv: "video/ogg",
		mov: "video/quicktime",
		m4v: "video/mp4"
	};
	return VideoResource;
}(BaseImageResource);
/**
* Resource type for ImageBitmap.
* @memberof PIXI
*/
var ImageBitmapResource = function(_super) {
	__extends$1(ImageBitmapResource, _super);
	/**
	* @param source - Image element to use
	*/
	function ImageBitmapResource(source) {
		return _super.call(this, source) || this;
	}
	/**
	* Used to auto-detect the type of resource.
	* @param {*} source - The source object
	* @returns {boolean} `true` if source is an ImageBitmap
	*/
	ImageBitmapResource.test = function(source) {
		return !!globalThis.createImageBitmap && typeof ImageBitmap !== "undefined" && source instanceof ImageBitmap;
	};
	return ImageBitmapResource;
}(BaseImageResource);
INSTALLED.push(ImageResource, ImageBitmapResource, CanvasResource, VideoResource, SVGResource, BufferResource, CubeResource, ArrayResource);
var _resources = {
	__proto__: null,
	Resource,
	BaseImageResource,
	INSTALLED,
	autoDetectResource,
	AbstractMultiResource,
	ArrayResource,
	BufferResource,
	CanvasResource,
	CubeResource,
	ImageResource,
	SVGResource,
	VideoResource,
	ImageBitmapResource
};
/**
* Resource type for DepthTexture.
* @memberof PIXI
*/
var DepthResource = function(_super) {
	__extends$1(DepthResource, _super);
	function DepthResource() {
		return _super !== null && _super.apply(this, arguments) || this;
	}
	/**
	* Upload the texture to the GPU.
	* @param renderer - Upload to the renderer
	* @param baseTexture - Reference to parent texture
	* @param glTexture - glTexture
	* @returns - true is success
	*/
	DepthResource.prototype.upload = function(renderer, baseTexture, glTexture) {
		var gl = renderer.gl;
		gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, baseTexture.alphaMode === ALPHA_MODES.UNPACK);
		var width = baseTexture.realWidth;
		var height = baseTexture.realHeight;
		if (glTexture.width === width && glTexture.height === height) gl.texSubImage2D(baseTexture.target, 0, 0, 0, width, height, baseTexture.format, glTexture.type, this.data);
		else {
			glTexture.width = width;
			glTexture.height = height;
			gl.texImage2D(baseTexture.target, 0, glTexture.internalFormat, width, height, 0, baseTexture.format, glTexture.type, this.data);
		}
		return true;
	};
	return DepthResource;
}(BufferResource);
/**
* A framebuffer can be used to render contents off of the screen. {@link PIXI.BaseRenderTexture} uses
* one internally to render into itself. You can attach a depth or stencil buffer to a framebuffer.
*
* On WebGL 2 machines, shaders can output to multiple textures simultaneously with GLSL 300 ES.
* @memberof PIXI
*/
var Framebuffer = function() {
	/**
	* @param width - Width of the frame buffer
	* @param height - Height of the frame buffer
	*/
	function Framebuffer(width, height) {
		this.width = Math.round(width || 100);
		this.height = Math.round(height || 100);
		this.stencil = false;
		this.depth = false;
		this.dirtyId = 0;
		this.dirtyFormat = 0;
		this.dirtySize = 0;
		this.depthTexture = null;
		this.colorTextures = [];
		this.glFramebuffers = {};
		this.disposeRunner = new Runner("disposeFramebuffer");
		this.multisample = MSAA_QUALITY.NONE;
	}
	Object.defineProperty(Framebuffer.prototype, "colorTexture", {
		/**
		* Reference to the colorTexture.
		* @readonly
		*/
		get: function() {
			return this.colorTextures[0];
		},
		enumerable: false,
		configurable: true
	});
	/**
	* Add texture to the colorTexture array.
	* @param index - Index of the array to add the texture to
	* @param texture - Texture to add to the array
	*/
	Framebuffer.prototype.addColorTexture = function(index, texture) {
		if (index === void 0) index = 0;
		this.colorTextures[index] = texture || new BaseTexture(null, {
			scaleMode: SCALE_MODES.NEAREST,
			resolution: 1,
			mipmap: MIPMAP_MODES.OFF,
			width: this.width,
			height: this.height
		});
		this.dirtyId++;
		this.dirtyFormat++;
		return this;
	};
	/**
	* Add a depth texture to the frame buffer.
	* @param texture - Texture to add.
	*/
	Framebuffer.prototype.addDepthTexture = function(texture) {
		this.depthTexture = texture || new BaseTexture(new DepthResource(null, {
			width: this.width,
			height: this.height
		}), {
			scaleMode: SCALE_MODES.NEAREST,
			resolution: 1,
			width: this.width,
			height: this.height,
			mipmap: MIPMAP_MODES.OFF,
			format: FORMATS.DEPTH_COMPONENT,
			type: TYPES.UNSIGNED_SHORT
		});
		this.dirtyId++;
		this.dirtyFormat++;
		return this;
	};
	/** Enable depth on the frame buffer. */
	Framebuffer.prototype.enableDepth = function() {
		this.depth = true;
		this.dirtyId++;
		this.dirtyFormat++;
		return this;
	};
	/** Enable stencil on the frame buffer. */
	Framebuffer.prototype.enableStencil = function() {
		this.stencil = true;
		this.dirtyId++;
		this.dirtyFormat++;
		return this;
	};
	/**
	* Resize the frame buffer
	* @param width - Width of the frame buffer to resize to
	* @param height - Height of the frame buffer to resize to
	*/
	Framebuffer.prototype.resize = function(width, height) {
		width = Math.round(width);
		height = Math.round(height);
		if (width === this.width && height === this.height) return;
		this.width = width;
		this.height = height;
		this.dirtyId++;
		this.dirtySize++;
		for (var i = 0; i < this.colorTextures.length; i++) {
			var texture = this.colorTextures[i];
			var resolution = texture.resolution;
			texture.setSize(width / resolution, height / resolution);
		}
		if (this.depthTexture) {
			var resolution = this.depthTexture.resolution;
			this.depthTexture.setSize(width / resolution, height / resolution);
		}
	};
	/** Disposes WebGL resources that are connected to this geometry. */
	Framebuffer.prototype.dispose = function() {
		this.disposeRunner.emit(this, false);
	};
	/** Destroys and removes the depth texture added to this framebuffer. */
	Framebuffer.prototype.destroyDepthTexture = function() {
		if (this.depthTexture) {
			this.depthTexture.destroy();
			this.depthTexture = null;
			++this.dirtyId;
			++this.dirtyFormat;
		}
	};
	return Framebuffer;
}();
/**
* A BaseRenderTexture is a special texture that allows any PixiJS display object to be rendered to it.
*
* __Hint__: All DisplayObjects (i.e. Sprites) that render to a BaseRenderTexture should be preloaded
* otherwise black rectangles will be drawn instead.
*
* A BaseRenderTexture takes a snapshot of any Display Object given to its render method. The position
* and rotation of the given Display Objects is ignored. For example:
*
* ```js
* let renderer = PIXI.autoDetectRenderer();
* let baseRenderTexture = new PIXI.BaseRenderTexture({ width: 800, height: 600 });
* let renderTexture = new PIXI.RenderTexture(baseRenderTexture);
* let sprite = PIXI.Sprite.from("spinObj_01.png");
*
* sprite.position.x = 800/2;
* sprite.position.y = 600/2;
* sprite.anchor.x = 0.5;
* sprite.anchor.y = 0.5;
*
* renderer.render(sprite, {renderTexture});
* ```
*
* The Sprite in this case will be rendered using its local transform. To render this sprite at 0,0
* you can clear the transform
*
* ```js
*
* sprite.setTransform()
*
* let baseRenderTexture = new PIXI.BaseRenderTexture({ width: 100, height: 100 });
* let renderTexture = new PIXI.RenderTexture(baseRenderTexture);
*
* renderer.render(sprite, {renderTexture});  // Renders to center of RenderTexture
* ```
* @memberof PIXI
*/
var BaseRenderTexture = function(_super) {
	__extends$1(BaseRenderTexture, _super);
	/**
	* @param options
	* @param {number} [options.width=100] - The width of the base render texture.
	* @param {number} [options.height=100] - The height of the base render texture.
	* @param {PIXI.SCALE_MODES} [options.scaleMode=PIXI.settings.SCALE_MODE] - See {@link PIXI.SCALE_MODES}
	*   for possible values.
	* @param {number} [options.resolution=PIXI.settings.RESOLUTION] - The resolution / device pixel ratio
	*   of the texture being generated.
	* @param {PIXI.MSAA_QUALITY} [options.multisample=PIXI.MSAA_QUALITY.NONE] - The number of samples of the frame buffer.
	*/
	function BaseRenderTexture(options) {
		if (options === void 0) options = {};
		var _this = this;
		if (typeof options === "number") options = {
			width: arguments[0],
			height: arguments[1],
			scaleMode: arguments[2],
			resolution: arguments[3]
		};
		options.width = options.width || 100;
		options.height = options.height || 100;
		options.multisample = options.multisample !== void 0 ? options.multisample : MSAA_QUALITY.NONE;
		_this = _super.call(this, null, options) || this;
		_this.mipmap = MIPMAP_MODES.OFF;
		_this.valid = true;
		_this.clearColor = [
			0,
			0,
			0,
			0
		];
		_this.framebuffer = new Framebuffer(_this.realWidth, _this.realHeight).addColorTexture(0, _this);
		_this.framebuffer.multisample = options.multisample;
		_this.maskStack = [];
		_this.filterStack = [{}];
		return _this;
	}
	/**
	* Resizes the BaseRenderTexture.
	* @param desiredWidth - The desired width to resize to.
	* @param desiredHeight - The desired height to resize to.
	*/
	BaseRenderTexture.prototype.resize = function(desiredWidth, desiredHeight) {
		this.framebuffer.resize(desiredWidth * this.resolution, desiredHeight * this.resolution);
		this.setRealSize(this.framebuffer.width, this.framebuffer.height);
	};
	/**
	* Frees the texture and framebuffer from WebGL memory without destroying this texture object.
	* This means you can still use the texture later which will upload it to GPU
	* memory again.
	* @fires PIXI.BaseTexture#dispose
	*/
	BaseRenderTexture.prototype.dispose = function() {
		this.framebuffer.dispose();
		_super.prototype.dispose.call(this);
	};
	/** Destroys this texture. */
	BaseRenderTexture.prototype.destroy = function() {
		_super.prototype.destroy.call(this);
		this.framebuffer.destroyDepthTexture();
		this.framebuffer = null;
	};
	return BaseRenderTexture;
}(BaseTexture);
/**
* Stores a texture's frame in UV coordinates, in
* which everything lies in the rectangle `[(0,0), (1,0),
* (1,1), (0,1)]`.
*
* | Corner       | Coordinates |
* |--------------|-------------|
* | Top-Left     | `(x0,y0)`   |
* | Top-Right    | `(x1,y1)`   |
* | Bottom-Right | `(x2,y2)`   |
* | Bottom-Left  | `(x3,y3)`   |
* @protected
* @memberof PIXI
*/
var TextureUvs = function() {
	function TextureUvs() {
		this.x0 = 0;
		this.y0 = 0;
		this.x1 = 1;
		this.y1 = 0;
		this.x2 = 1;
		this.y2 = 1;
		this.x3 = 0;
		this.y3 = 1;
		this.uvsFloat32 = /* @__PURE__ */ new Float32Array(8);
	}
	/**
	* Sets the texture Uvs based on the given frame information.
	* @protected
	* @param frame - The frame of the texture
	* @param baseFrame - The base frame of the texture
	* @param rotate - Rotation of frame, see {@link PIXI.groupD8}
	*/
	TextureUvs.prototype.set = function(frame, baseFrame, rotate) {
		var tw = baseFrame.width;
		var th = baseFrame.height;
		if (rotate) {
			var w2 = frame.width / 2 / tw;
			var h2 = frame.height / 2 / th;
			var cX = frame.x / tw + w2;
			var cY = frame.y / th + h2;
			rotate = groupD8.add(rotate, groupD8.NW);
			this.x0 = cX + w2 * groupD8.uX(rotate);
			this.y0 = cY + h2 * groupD8.uY(rotate);
			rotate = groupD8.add(rotate, 2);
			this.x1 = cX + w2 * groupD8.uX(rotate);
			this.y1 = cY + h2 * groupD8.uY(rotate);
			rotate = groupD8.add(rotate, 2);
			this.x2 = cX + w2 * groupD8.uX(rotate);
			this.y2 = cY + h2 * groupD8.uY(rotate);
			rotate = groupD8.add(rotate, 2);
			this.x3 = cX + w2 * groupD8.uX(rotate);
			this.y3 = cY + h2 * groupD8.uY(rotate);
		} else {
			this.x0 = frame.x / tw;
			this.y0 = frame.y / th;
			this.x1 = (frame.x + frame.width) / tw;
			this.y1 = frame.y / th;
			this.x2 = (frame.x + frame.width) / tw;
			this.y2 = (frame.y + frame.height) / th;
			this.x3 = frame.x / tw;
			this.y3 = (frame.y + frame.height) / th;
		}
		this.uvsFloat32[0] = this.x0;
		this.uvsFloat32[1] = this.y0;
		this.uvsFloat32[2] = this.x1;
		this.uvsFloat32[3] = this.y1;
		this.uvsFloat32[4] = this.x2;
		this.uvsFloat32[5] = this.y2;
		this.uvsFloat32[6] = this.x3;
		this.uvsFloat32[7] = this.y3;
	};
	TextureUvs.prototype.toString = function() {
		return "[@pixi/core:TextureUvs " + ("x0=" + this.x0 + " y0=" + this.y0 + " ") + ("x1=" + this.x1 + " y1=" + this.y1 + " x2=" + this.x2 + " ") + ("y2=" + this.y2 + " x3=" + this.x3 + " y3=" + this.y3) + "]";
	};
	return TextureUvs;
}();
var DEFAULT_UVS = new TextureUvs();
/**
* Used to remove listeners from WHITE and EMPTY Textures
* @ignore
*/
function removeAllHandlers(tex) {
	tex.destroy = function _emptyDestroy() {};
	tex.on = function _emptyOn() {};
	tex.once = function _emptyOnce() {};
	tex.emit = function _emptyEmit() {};
}
/**
* A texture stores the information that represents an image or part of an image.
*
* It cannot be added to the display list directly; instead use it as the texture for a Sprite.
* If no frame is provided for a texture, then the whole image is used.
*
* You can directly create a texture from an image and then reuse it multiple times like this :
*
* ```js
* let texture = PIXI.Texture.from('assets/image.png');
* let sprite1 = new PIXI.Sprite(texture);
* let sprite2 = new PIXI.Sprite(texture);
* ```
*
* If you didnt pass the texture frame to constructor, it enables `noFrame` mode:
* it subscribes on baseTexture events, it automatically resizes at the same time as baseTexture.
*
* Textures made from SVGs, loaded or not, cannot be used before the file finishes processing.
* You can check for this by checking the sprite's _textureID property.
* ```js
* var texture = PIXI.Texture.from('assets/image.svg');
* var sprite1 = new PIXI.Sprite(texture);
* //sprite1._textureID should not be undefined if the texture has finished processing the SVG file
* ```
* You can use a ticker or rAF to ensure your sprites load the finished textures after processing. See issue #3068.
* @memberof PIXI
* @typeParam R - The BaseTexture's Resource type.
*/
var Texture = function(_super) {
	__extends$1(Texture, _super);
	/**
	* @param baseTexture - The base texture source to create the texture from
	* @param frame - The rectangle frame of the texture to show
	* @param orig - The area of original texture
	* @param trim - Trimmed rectangle of original texture
	* @param rotate - indicates how the texture was rotated by texture packer. See {@link PIXI.groupD8}
	* @param anchor - Default anchor point used for sprite placement / rotation
	*/
	function Texture(baseTexture, frame, orig, trim, rotate, anchor) {
		var _this = _super.call(this) || this;
		_this.noFrame = false;
		if (!frame) {
			_this.noFrame = true;
			frame = new Rectangle(0, 0, 1, 1);
		}
		if (baseTexture instanceof Texture) baseTexture = baseTexture.baseTexture;
		_this.baseTexture = baseTexture;
		_this._frame = frame;
		_this.trim = trim;
		_this.valid = false;
		_this._uvs = DEFAULT_UVS;
		_this.uvMatrix = null;
		_this.orig = orig || frame;
		_this._rotate = Number(rotate || 0);
		if (rotate === true) _this._rotate = 2;
		else if (_this._rotate % 2 !== 0) throw new Error("attempt to use diamond-shaped UVs. If you are sure, set rotation manually");
		_this.defaultAnchor = anchor ? new Point(anchor.x, anchor.y) : new Point(0, 0);
		_this._updateID = 0;
		_this.textureCacheIds = [];
		if (!baseTexture.valid) baseTexture.once("loaded", _this.onBaseTextureUpdated, _this);
		else if (_this.noFrame) {
			if (baseTexture.valid) _this.onBaseTextureUpdated(baseTexture);
		} else _this.frame = frame;
		if (_this.noFrame) baseTexture.on("update", _this.onBaseTextureUpdated, _this);
		return _this;
	}
	/**
	* Updates this texture on the gpu.
	*
	* Calls the TextureResource update.
	*
	* If you adjusted `frame` manually, please call `updateUvs()` instead.
	*/
	Texture.prototype.update = function() {
		if (this.baseTexture.resource) this.baseTexture.resource.update();
	};
	/**
	* Called when the base texture is updated
	* @protected
	* @param baseTexture - The base texture.
	*/
	Texture.prototype.onBaseTextureUpdated = function(baseTexture) {
		if (this.noFrame) {
			if (!this.baseTexture.valid) return;
			this._frame.width = baseTexture.width;
			this._frame.height = baseTexture.height;
			this.valid = true;
			this.updateUvs();
		} else this.frame = this._frame;
		this.emit("update", this);
	};
	/**
	* Destroys this texture
	* @param [destroyBase=false] - Whether to destroy the base texture as well
	*/
	Texture.prototype.destroy = function(destroyBase) {
		if (this.baseTexture) {
			if (destroyBase) {
				var resource = this.baseTexture.resource;
				if (resource && resource.url && TextureCache[resource.url]) Texture.removeFromCache(resource.url);
				this.baseTexture.destroy();
			}
			this.baseTexture.off("loaded", this.onBaseTextureUpdated, this);
			this.baseTexture.off("update", this.onBaseTextureUpdated, this);
			this.baseTexture = null;
		}
		this._frame = null;
		this._uvs = null;
		this.trim = null;
		this.orig = null;
		this.valid = false;
		Texture.removeFromCache(this);
		this.textureCacheIds = null;
	};
	/**
	* Creates a new texture object that acts the same as this one.
	* @returns - The new texture
	*/
	Texture.prototype.clone = function() {
		var clonedFrame = this._frame.clone();
		var clonedOrig = this._frame === this.orig ? clonedFrame : this.orig.clone();
		var clonedTexture = new Texture(this.baseTexture, !this.noFrame && clonedFrame, clonedOrig, this.trim && this.trim.clone(), this.rotate, this.defaultAnchor);
		if (this.noFrame) clonedTexture._frame = clonedFrame;
		return clonedTexture;
	};
	/**
	* Updates the internal WebGL UV cache. Use it after you change `frame` or `trim` of the texture.
	* Call it after changing the frame
	*/
	Texture.prototype.updateUvs = function() {
		if (this._uvs === DEFAULT_UVS) this._uvs = new TextureUvs();
		this._uvs.set(this._frame, this.baseTexture, this.rotate);
		this._updateID++;
	};
	/**
	* Helper function that creates a new Texture based on the source you provide.
	* The source can be - frame id, image url, video url, canvas element, video element, base texture
	* @param {string|HTMLImageElement|HTMLCanvasElement|HTMLVideoElement|PIXI.BaseTexture} source -
	*        Source or array of sources to create texture from
	* @param options - See {@link PIXI.BaseTexture}'s constructor for options.
	* @param {string} [options.pixiIdPrefix=pixiid] - If a source has no id, this is the prefix of the generated id
	* @param {boolean} [strict] - Enforce strict-mode, see {@link PIXI.settings.STRICT_TEXTURE_CACHE}.
	* @returns {PIXI.Texture} The newly created texture
	*/
	Texture.from = function(source, options, strict) {
		if (options === void 0) options = {};
		if (strict === void 0) strict = settings.STRICT_TEXTURE_CACHE;
		var isFrame = typeof source === "string";
		var cacheId = null;
		if (isFrame) cacheId = source;
		else if (source instanceof BaseTexture) {
			if (!source.cacheId) {
				var prefix = options && options.pixiIdPrefix || "pixiid";
				source.cacheId = prefix + "-" + uid();
				BaseTexture.addToCache(source, source.cacheId);
			}
			cacheId = source.cacheId;
		} else {
			if (!source._pixiId) {
				var prefix = options && options.pixiIdPrefix || "pixiid";
				source._pixiId = prefix + "_" + uid();
			}
			cacheId = source._pixiId;
		}
		var texture = TextureCache[cacheId];
		if (isFrame && strict && !texture) throw new Error("The cacheId \"" + cacheId + "\" does not exist in TextureCache.");
		if (!texture && !(source instanceof BaseTexture)) {
			if (!options.resolution) options.resolution = getResolutionOfUrl(source);
			texture = new Texture(new BaseTexture(source, options));
			texture.baseTexture.cacheId = cacheId;
			BaseTexture.addToCache(texture.baseTexture, cacheId);
			Texture.addToCache(texture, cacheId);
		} else if (!texture && source instanceof BaseTexture) {
			texture = new Texture(source);
			Texture.addToCache(texture, cacheId);
		}
		return texture;
	};
	/**
	* Useful for loading textures via URLs. Use instead of `Texture.from` because
	* it does a better job of handling failed URLs more effectively. This also ignores
	* `PIXI.settings.STRICT_TEXTURE_CACHE`. Works for Videos, SVGs, Images.
	* @param url - The remote URL or array of URLs to load.
	* @param options - Optional options to include
	* @returns - A Promise that resolves to a Texture.
	*/
	Texture.fromURL = function(url, options) {
		var resourceOptions = Object.assign({ autoLoad: false }, options === null || options === void 0 ? void 0 : options.resourceOptions);
		var texture = Texture.from(url, Object.assign({ resourceOptions }, options), false);
		var resource = texture.baseTexture.resource;
		if (texture.baseTexture.valid) return Promise.resolve(texture);
		return resource.load().then(function() {
			return Promise.resolve(texture);
		});
	};
	/**
	* Create a new Texture with a BufferResource from a Float32Array.
	* RGBA values are floats from 0 to 1.
	* @param {Float32Array|Uint8Array} buffer - The optional array to use, if no data
	*        is provided, a new Float32Array is created.
	* @param width - Width of the resource
	* @param height - Height of the resource
	* @param options - See {@link PIXI.BaseTexture}'s constructor for options.
	* @returns - The resulting new BaseTexture
	*/
	Texture.fromBuffer = function(buffer, width, height, options) {
		return new Texture(BaseTexture.fromBuffer(buffer, width, height, options));
	};
	/**
	* Create a texture from a source and add to the cache.
	* @param {HTMLImageElement|HTMLCanvasElement|string} source - The input source.
	* @param imageUrl - File name of texture, for cache and resolving resolution.
	* @param name - Human readable name for the texture cache. If no name is
	*        specified, only `imageUrl` will be used as the cache ID.
	* @param options
	* @returns - Output texture
	*/
	Texture.fromLoader = function(source, imageUrl, name, options) {
		var baseTexture = new BaseTexture(source, Object.assign({
			scaleMode: settings.SCALE_MODE,
			resolution: getResolutionOfUrl(imageUrl)
		}, options));
		var resource = baseTexture.resource;
		if (resource instanceof ImageResource) resource.url = imageUrl;
		var texture = new Texture(baseTexture);
		if (!name) name = imageUrl;
		BaseTexture.addToCache(texture.baseTexture, name);
		Texture.addToCache(texture, name);
		if (name !== imageUrl) {
			BaseTexture.addToCache(texture.baseTexture, imageUrl);
			Texture.addToCache(texture, imageUrl);
		}
		if (texture.baseTexture.valid) return Promise.resolve(texture);
		return new Promise(function(resolve) {
			texture.baseTexture.once("loaded", function() {
				return resolve(texture);
			});
		});
	};
	/**
	* Adds a Texture to the global TextureCache. This cache is shared across the whole PIXI object.
	* @param texture - The Texture to add to the cache.
	* @param id - The id that the Texture will be stored against.
	*/
	Texture.addToCache = function(texture, id) {
		if (id) {
			if (texture.textureCacheIds.indexOf(id) === -1) texture.textureCacheIds.push(id);
			if (TextureCache[id]) console.warn("Texture added to the cache with an id [" + id + "] that already had an entry");
			TextureCache[id] = texture;
		}
	};
	/**
	* Remove a Texture from the global TextureCache.
	* @param texture - id of a Texture to be removed, or a Texture instance itself
	* @returns - The Texture that was removed
	*/
	Texture.removeFromCache = function(texture) {
		if (typeof texture === "string") {
			var textureFromCache = TextureCache[texture];
			if (textureFromCache) {
				var index = textureFromCache.textureCacheIds.indexOf(texture);
				if (index > -1) textureFromCache.textureCacheIds.splice(index, 1);
				delete TextureCache[texture];
				return textureFromCache;
			}
		} else if (texture && texture.textureCacheIds) {
			for (var i = 0; i < texture.textureCacheIds.length; ++i) if (TextureCache[texture.textureCacheIds[i]] === texture) delete TextureCache[texture.textureCacheIds[i]];
			texture.textureCacheIds.length = 0;
			return texture;
		}
		return null;
	};
	Object.defineProperty(Texture.prototype, "resolution", {
		/**
		* Returns resolution of baseTexture
		* @readonly
		*/
		get: function() {
			return this.baseTexture.resolution;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Texture.prototype, "frame", {
		/**
		* The frame specifies the region of the base texture that this texture uses.
		* Please call `updateUvs()` after you change coordinates of `frame` manually.
		*/
		get: function() {
			return this._frame;
		},
		set: function(frame) {
			this._frame = frame;
			this.noFrame = false;
			var x = frame.x, y = frame.y, width = frame.width, height = frame.height;
			var xNotFit = x + width > this.baseTexture.width;
			var yNotFit = y + height > this.baseTexture.height;
			if (xNotFit || yNotFit) {
				var relationship = xNotFit && yNotFit ? "and" : "or";
				var errorX = "X: " + x + " + " + width + " = " + (x + width) + " > " + this.baseTexture.width;
				var errorY = "Y: " + y + " + " + height + " = " + (y + height) + " > " + this.baseTexture.height;
				throw new Error("Texture Error: frame does not fit inside the base Texture dimensions: " + (errorX + " " + relationship + " " + errorY));
			}
			this.valid = width && height && this.baseTexture.valid;
			if (!this.trim && !this.rotate) this.orig = frame;
			if (this.valid) this.updateUvs();
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Texture.prototype, "rotate", {
		/**
		* Indicates whether the texture is rotated inside the atlas
		* set to 2 to compensate for texture packer rotation
		* set to 6 to compensate for spine packer rotation
		* can be used to rotate or mirror sprites
		* See {@link PIXI.groupD8} for explanation
		*/
		get: function() {
			return this._rotate;
		},
		set: function(rotate) {
			this._rotate = rotate;
			if (this.valid) this.updateUvs();
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Texture.prototype, "width", {
		/** The width of the Texture in pixels. */
		get: function() {
			return this.orig.width;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Texture.prototype, "height", {
		/** The height of the Texture in pixels. */
		get: function() {
			return this.orig.height;
		},
		enumerable: false,
		configurable: true
	});
	/** Utility function for BaseTexture|Texture cast. */
	Texture.prototype.castToBaseTexture = function() {
		return this.baseTexture;
	};
	Object.defineProperty(Texture, "EMPTY", {
		/** An empty texture, used often to not have to create multiple empty textures. Can not be destroyed. */
		get: function() {
			if (!Texture._EMPTY) {
				Texture._EMPTY = new Texture(new BaseTexture());
				removeAllHandlers(Texture._EMPTY);
				removeAllHandlers(Texture._EMPTY.baseTexture);
			}
			return Texture._EMPTY;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Texture, "WHITE", {
		/** A white texture of 16x16 size, used for graphics and other things Can not be destroyed. */
		get: function() {
			if (!Texture._WHITE) {
				var canvas = settings.ADAPTER.createCanvas(16, 16);
				var context = canvas.getContext("2d");
				canvas.width = 16;
				canvas.height = 16;
				context.fillStyle = "white";
				context.fillRect(0, 0, 16, 16);
				Texture._WHITE = new Texture(BaseTexture.from(canvas));
				removeAllHandlers(Texture._WHITE);
				removeAllHandlers(Texture._WHITE.baseTexture);
			}
			return Texture._WHITE;
		},
		enumerable: false,
		configurable: true
	});
	return Texture;
}(import_eventemitter3.default);
/**
* A RenderTexture is a special texture that allows any PixiJS display object to be rendered to it.
*
* __Hint__: All DisplayObjects (i.e. Sprites) that render to a RenderTexture should be preloaded
* otherwise black rectangles will be drawn instead.
*
* __Hint-2__: The actual memory allocation will happen on first render.
* You shouldn't create renderTextures each frame just to delete them after, try to reuse them.
*
* A RenderTexture takes a snapshot of any Display Object given to its render method. For example:
*
* ```js
* let renderer = PIXI.autoDetectRenderer();
* let renderTexture = PIXI.RenderTexture.create({ width: 800, height: 600 });
* let sprite = PIXI.Sprite.from("spinObj_01.png");
*
* sprite.position.x = 800/2;
* sprite.position.y = 600/2;
* sprite.anchor.x = 0.5;
* sprite.anchor.y = 0.5;
*
* renderer.render(sprite, {renderTexture});
* ```
* Note that you should not create a new renderer, but reuse the same one as the rest of the application.
*
* The Sprite in this case will be rendered using its local transform. To render this sprite at 0,0
* you can clear the transform
*
* ```js
*
* sprite.setTransform()
*
* let renderTexture = new PIXI.RenderTexture.create({ width: 100, height: 100 });
*
* renderer.render(sprite, {renderTexture});  // Renders to center of RenderTexture
* ```
* @memberof PIXI
*/
var RenderTexture = function(_super) {
	__extends$1(RenderTexture, _super);
	/**
	* @param baseRenderTexture - The base texture object that this texture uses.
	* @param frame - The rectangle frame of the texture to show.
	*/
	function RenderTexture(baseRenderTexture, frame) {
		var _this = _super.call(this, baseRenderTexture, frame) || this;
		_this.valid = true;
		_this.filterFrame = null;
		_this.filterPoolKey = null;
		_this.updateUvs();
		return _this;
	}
	Object.defineProperty(RenderTexture.prototype, "framebuffer", {
		/**
		* Shortcut to `this.baseTexture.framebuffer`, saves baseTexture cast.
		* @readonly
		*/
		get: function() {
			return this.baseTexture.framebuffer;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(RenderTexture.prototype, "multisample", {
		/**
		* Shortcut to `this.framebuffer.multisample`.
		* @default PIXI.MSAA_QUALITY.NONE
		*/
		get: function() {
			return this.framebuffer.multisample;
		},
		set: function(value) {
			this.framebuffer.multisample = value;
		},
		enumerable: false,
		configurable: true
	});
	/**
	* Resizes the RenderTexture.
	* @param desiredWidth - The desired width to resize to.
	* @param desiredHeight - The desired height to resize to.
	* @param resizeBaseTexture - Should the baseTexture.width and height values be resized as well?
	*/
	RenderTexture.prototype.resize = function(desiredWidth, desiredHeight, resizeBaseTexture) {
		if (resizeBaseTexture === void 0) resizeBaseTexture = true;
		var resolution = this.baseTexture.resolution;
		var width = Math.round(desiredWidth * resolution) / resolution;
		var height = Math.round(desiredHeight * resolution) / resolution;
		this.valid = width > 0 && height > 0;
		this._frame.width = this.orig.width = width;
		this._frame.height = this.orig.height = height;
		if (resizeBaseTexture) this.baseTexture.resize(width, height);
		this.updateUvs();
	};
	/**
	* Changes the resolution of baseTexture, but does not change framebuffer size.
	* @param resolution - The new resolution to apply to RenderTexture
	*/
	RenderTexture.prototype.setResolution = function(resolution) {
		var baseTexture = this.baseTexture;
		if (baseTexture.resolution === resolution) return;
		baseTexture.setResolution(resolution);
		this.resize(baseTexture.width, baseTexture.height, false);
	};
	RenderTexture.create = function(options) {
		var arguments$1 = arguments;
		var rest = [];
		for (var _i = 1; _i < arguments.length; _i++) rest[_i - 1] = arguments$1[_i];
		if (typeof options === "number") {
			deprecation("6.0.0", "Arguments (width, height, scaleMode, resolution) have been deprecated.");
			options = {
				width: options,
				height: rest[0],
				scaleMode: rest[1],
				resolution: rest[2]
			};
		}
		return new RenderTexture(new BaseRenderTexture(options));
	};
	return RenderTexture;
}(Texture);
/**
* Texture pool, used by FilterSystem and plugins.
*
* Stores collection of temporary pow2 or screen-sized renderTextures
*
* If you use custom RenderTexturePool for your filters, you can use methods
* `getFilterTexture` and `returnFilterTexture` same as in
* @memberof PIXI
*/
var RenderTexturePool = function() {
	/**
	* @param textureOptions - options that will be passed to BaseRenderTexture constructor
	* @param {PIXI.SCALE_MODES} [textureOptions.scaleMode] - See {@link PIXI.SCALE_MODES} for possible values.
	*/
	function RenderTexturePool(textureOptions) {
		this.texturePool = {};
		this.textureOptions = textureOptions || {};
		this.enableFullScreen = false;
		this._pixelsWidth = 0;
		this._pixelsHeight = 0;
	}
	/**
	* Creates texture with params that were specified in pool constructor.
	* @param realWidth - Width of texture in pixels.
	* @param realHeight - Height of texture in pixels.
	* @param multisample - Number of samples of the framebuffer.
	*/
	RenderTexturePool.prototype.createTexture = function(realWidth, realHeight, multisample) {
		if (multisample === void 0) multisample = MSAA_QUALITY.NONE;
		return new RenderTexture(new BaseRenderTexture(Object.assign({
			width: realWidth,
			height: realHeight,
			resolution: 1,
			multisample
		}, this.textureOptions)));
	};
	/**
	* Gets a Power-of-Two render texture or fullScreen texture
	* @param minWidth - The minimum width of the render texture.
	* @param minHeight - The minimum height of the render texture.
	* @param resolution - The resolution of the render texture.
	* @param multisample - Number of samples of the render texture.
	* @returns The new render texture.
	*/
	RenderTexturePool.prototype.getOptimalTexture = function(minWidth, minHeight, resolution, multisample) {
		if (resolution === void 0) resolution = 1;
		if (multisample === void 0) multisample = MSAA_QUALITY.NONE;
		var key;
		minWidth = Math.ceil(minWidth * resolution - 1e-6);
		minHeight = Math.ceil(minHeight * resolution - 1e-6);
		if (!this.enableFullScreen || minWidth !== this._pixelsWidth || minHeight !== this._pixelsHeight) {
			minWidth = nextPow2(minWidth);
			minHeight = nextPow2(minHeight);
			key = ((minWidth & 65535) << 16 | minHeight & 65535) >>> 0;
			if (multisample > 1) key += multisample * 4294967296;
		} else key = multisample > 1 ? -multisample : -1;
		if (!this.texturePool[key]) this.texturePool[key] = [];
		var renderTexture = this.texturePool[key].pop();
		if (!renderTexture) renderTexture = this.createTexture(minWidth, minHeight, multisample);
		renderTexture.filterPoolKey = key;
		renderTexture.setResolution(resolution);
		return renderTexture;
	};
	/**
	* Gets extra texture of the same size as input renderTexture
	*
	* `getFilterTexture(input, 0.5)` or `getFilterTexture(0.5, input)`
	* @param input - renderTexture from which size and resolution will be copied
	* @param resolution - override resolution of the renderTexture
	*  It overrides, it does not multiply
	* @param multisample - number of samples of the renderTexture
	*/
	RenderTexturePool.prototype.getFilterTexture = function(input, resolution, multisample) {
		var filterTexture = this.getOptimalTexture(input.width, input.height, resolution || input.resolution, multisample || MSAA_QUALITY.NONE);
		filterTexture.filterFrame = input.filterFrame;
		return filterTexture;
	};
	/**
	* Place a render texture back into the pool.
	* @param renderTexture - The renderTexture to free
	*/
	RenderTexturePool.prototype.returnTexture = function(renderTexture) {
		var key = renderTexture.filterPoolKey;
		renderTexture.filterFrame = null;
		this.texturePool[key].push(renderTexture);
	};
	/**
	* Alias for returnTexture, to be compliant with FilterSystem interface.
	* @param renderTexture - The renderTexture to free
	*/
	RenderTexturePool.prototype.returnFilterTexture = function(renderTexture) {
		this.returnTexture(renderTexture);
	};
	/**
	* Clears the pool.
	* @param destroyTextures - Destroy all stored textures.
	*/
	RenderTexturePool.prototype.clear = function(destroyTextures) {
		destroyTextures = destroyTextures !== false;
		if (destroyTextures) for (var i in this.texturePool) {
			var textures = this.texturePool[i];
			if (textures) for (var j = 0; j < textures.length; j++) textures[j].destroy(true);
		}
		this.texturePool = {};
	};
	/**
	* If screen size was changed, drops all screen-sized textures,
	* sets new screen size, sets `enableFullScreen` to true
	*
	* Size is measured in pixels, `renderer.view` can be passed here, not `renderer.screen`
	* @param size - Initial size of screen.
	*/
	RenderTexturePool.prototype.setScreenSize = function(size) {
		if (size.width === this._pixelsWidth && size.height === this._pixelsHeight) return;
		this.enableFullScreen = size.width > 0 && size.height > 0;
		for (var i in this.texturePool) {
			if (!(Number(i) < 0)) continue;
			var textures = this.texturePool[i];
			if (textures) for (var j = 0; j < textures.length; j++) textures[j].destroy(true);
			this.texturePool[i] = [];
		}
		this._pixelsWidth = size.width;
		this._pixelsHeight = size.height;
	};
	/**
	* Key that is used to store fullscreen renderTextures in a pool
	* @constant
	*/
	RenderTexturePool.SCREEN_KEY = -1;
	return RenderTexturePool;
}();
/**
* Holds the information for a single attribute structure required to render geometry.
*
* This does not contain the actual data, but instead has a buffer id that maps to a {@link PIXI.Buffer}
* This can include anything from positions, uvs, normals, colors etc.
* @memberof PIXI
*/
var Attribute = function() {
	/**
	* @param buffer - the id of the buffer that this attribute will look for
	* @param size - the size of the attribute. If you have 2 floats per vertex (eg position x and y) this would be 2.
	* @param normalized - should the data be normalized.
	* @param {PIXI.TYPES} [type=PIXI.TYPES.FLOAT] - what type of number is the attribute. Check {@link PIXI.TYPES} to see the ones available
	* @param [stride=0] - How far apart, in bytes, the start of each value is. (used for interleaving data)
	* @param [start=0] - How far into the array to start reading values (used for interleaving data)
	* @param [instance=false] - Whether the geometry is instanced.
	*/
	function Attribute(buffer, size, normalized, type, stride, start, instance) {
		if (size === void 0) size = 0;
		if (normalized === void 0) normalized = false;
		if (type === void 0) type = TYPES.FLOAT;
		this.buffer = buffer;
		this.size = size;
		this.normalized = normalized;
		this.type = type;
		this.stride = stride;
		this.start = start;
		this.instance = instance;
	}
	/** Destroys the Attribute. */
	Attribute.prototype.destroy = function() {
		this.buffer = null;
	};
	/**
	* Helper function that creates an Attribute based on the information provided
	* @param buffer - the id of the buffer that this attribute will look for
	* @param [size=0] - the size of the attribute. If you have 2 floats per vertex (eg position x and y) this would be 2
	* @param [normalized=false] - should the data be normalized.
	* @param [type=PIXI.TYPES.FLOAT] - what type of number is the attribute. Check {@link PIXI.TYPES} to see the ones available
	* @param [stride=0] - How far apart, in bytes, the start of each value is. (used for interleaving data)
	* @returns - A new {@link PIXI.Attribute} based on the information provided
	*/
	Attribute.from = function(buffer, size, normalized, type, stride) {
		return new Attribute(buffer, size, normalized, type, stride);
	};
	return Attribute;
}();
var UID$4 = 0;
/**
* A wrapper for data so that it can be used and uploaded by WebGL
* @memberof PIXI
*/
var Buffer = function() {
	/**
	* @param {PIXI.IArrayBuffer} data - the data to store in the buffer.
	* @param _static - `true` for static buffer
	* @param index - `true` for index buffer
	*/
	function Buffer(data, _static, index) {
		if (_static === void 0) _static = true;
		if (index === void 0) index = false;
		this.data = data || /* @__PURE__ */ new Float32Array(1);
		this._glBuffers = {};
		this._updateID = 0;
		this.index = index;
		this.static = _static;
		this.id = UID$4++;
		this.disposeRunner = new Runner("disposeBuffer");
	}
	/**
	* Flags this buffer as requiring an upload to the GPU.
	* @param {PIXI.IArrayBuffer|number[]} [data] - the data to update in the buffer.
	*/
	Buffer.prototype.update = function(data) {
		if (data instanceof Array) data = new Float32Array(data);
		this.data = data || this.data;
		this._updateID++;
	};
	/** Disposes WebGL resources that are connected to this geometry. */
	Buffer.prototype.dispose = function() {
		this.disposeRunner.emit(this, false);
	};
	/** Destroys the buffer. */
	Buffer.prototype.destroy = function() {
		this.dispose();
		this.data = null;
	};
	Object.defineProperty(Buffer.prototype, "index", {
		get: function() {
			return this.type === BUFFER_TYPE.ELEMENT_ARRAY_BUFFER;
		},
		/**
		* Flags whether this is an index buffer.
		*
		* Index buffers are of type `ELEMENT_ARRAY_BUFFER`. Note that setting this property to false will make
		* the buffer of type `ARRAY_BUFFER`.
		*
		* For backwards compatibility.
		*/
		set: function(value) {
			this.type = value ? BUFFER_TYPE.ELEMENT_ARRAY_BUFFER : BUFFER_TYPE.ARRAY_BUFFER;
		},
		enumerable: false,
		configurable: true
	});
	/**
	* Helper function that creates a buffer based on an array or TypedArray
	* @param {ArrayBufferView | number[]} data - the TypedArray that the buffer will store. If this is a regular Array it will be converted to a Float32Array.
	* @returns - A new Buffer based on the data provided.
	*/
	Buffer.from = function(data) {
		if (data instanceof Array) data = new Float32Array(data);
		return new Buffer(data);
	};
	return Buffer;
}();
var map$1 = {
	Float32Array,
	Uint32Array,
	Int32Array,
	Uint8Array
};
function interleaveTypedArrays(arrays, sizes) {
	var outSize = 0;
	var stride = 0;
	var views = {};
	for (var i = 0; i < arrays.length; i++) {
		stride += sizes[i];
		outSize += arrays[i].length;
	}
	var buffer = /* @__PURE__ */ new ArrayBuffer(outSize * 4);
	var out = null;
	var littleOffset = 0;
	for (var i = 0; i < arrays.length; i++) {
		var size = sizes[i];
		var array = arrays[i];
		var type = getBufferType(array);
		if (!views[type]) views[type] = new map$1[type](buffer);
		out = views[type];
		for (var j = 0; j < array.length; j++) {
			var indexStart = (j / size | 0) * stride + littleOffset;
			var index = j % size;
			out[indexStart + index] = array[j];
		}
		littleOffset += size;
	}
	return new Float32Array(buffer);
}
var byteSizeMap$1 = {
	5126: 4,
	5123: 2,
	5121: 1
};
var UID$3 = 0;
var map = {
	Float32Array,
	Uint32Array,
	Int32Array,
	Uint8Array,
	Uint16Array
};
/**
* The Geometry represents a model. It consists of two components:
* - GeometryStyle - The structure of the model such as the attributes layout
* - GeometryData - the data of the model - this consists of buffers.
* This can include anything from positions, uvs, normals, colors etc.
*
* Geometry can be defined without passing in a style or data if required (thats how I prefer!)
*
* ```js
* let geometry = new PIXI.Geometry();
*
* geometry.addAttribute('positions', [0, 0, 100, 0, 100, 100, 0, 100], 2);
* geometry.addAttribute('uvs', [0,0,1,0,1,1,0,1],2)
* geometry.addIndex([0,1,2,1,3,2])
* ```
* @memberof PIXI
*/
var Geometry = function() {
	/**
	* @param buffers - An array of buffers. optional.
	* @param attributes - Of the geometry, optional structure of the attributes layout
	*/
	function Geometry(buffers, attributes) {
		if (buffers === void 0) buffers = [];
		if (attributes === void 0) attributes = {};
		this.buffers = buffers;
		this.indexBuffer = null;
		this.attributes = attributes;
		this.glVertexArrayObjects = {};
		this.id = UID$3++;
		this.instanced = false;
		this.instanceCount = 1;
		this.disposeRunner = new Runner("disposeGeometry");
		this.refCount = 0;
	}
	/**
	*
	* Adds an attribute to the geometry
	* Note: `stride` and `start` should be `undefined` if you dont know them, not 0!
	* @param id - the name of the attribute (matching up to a shader)
	* @param {PIXI.Buffer|number[]} buffer - the buffer that holds the data of the attribute . You can also provide an Array and a buffer will be created from it.
	* @param size - the size of the attribute. If you have 2 floats per vertex (eg position x and y) this would be 2
	* @param normalized - should the data be normalized.
	* @param [type=PIXI.TYPES.FLOAT] - what type of number is the attribute. Check {PIXI.TYPES} to see the ones available
	* @param [stride=0] - How far apart, in bytes, the start of each value is. (used for interleaving data)
	* @param [start=0] - How far into the array to start reading values (used for interleaving data)
	* @param instance - Instancing flag
	* @returns - Returns self, useful for chaining.
	*/
	Geometry.prototype.addAttribute = function(id, buffer, size, normalized, type, stride, start, instance) {
		if (size === void 0) size = 0;
		if (normalized === void 0) normalized = false;
		if (instance === void 0) instance = false;
		if (!buffer) throw new Error("You must pass a buffer when creating an attribute");
		if (!(buffer instanceof Buffer)) {
			if (buffer instanceof Array) buffer = new Float32Array(buffer);
			buffer = new Buffer(buffer);
		}
		var ids = id.split("|");
		if (ids.length > 1) {
			for (var i = 0; i < ids.length; i++) this.addAttribute(ids[i], buffer, size, normalized, type);
			return this;
		}
		var bufferIndex = this.buffers.indexOf(buffer);
		if (bufferIndex === -1) {
			this.buffers.push(buffer);
			bufferIndex = this.buffers.length - 1;
		}
		this.attributes[id] = new Attribute(bufferIndex, size, normalized, type, stride, start, instance);
		this.instanced = this.instanced || instance;
		return this;
	};
	/**
	* Returns the requested attribute.
	* @param id - The name of the attribute required
	* @returns - The attribute requested.
	*/
	Geometry.prototype.getAttribute = function(id) {
		return this.attributes[id];
	};
	/**
	* Returns the requested buffer.
	* @param id - The name of the buffer required.
	* @returns - The buffer requested.
	*/
	Geometry.prototype.getBuffer = function(id) {
		return this.buffers[this.getAttribute(id).buffer];
	};
	/**
	*
	* Adds an index buffer to the geometry
	* The index buffer contains integers, three for each triangle in the geometry, which reference the various attribute buffers (position, colour, UV coordinates, other UV coordinates, normal, …). There is only ONE index buffer.
	* @param {PIXI.Buffer|number[]} [buffer] - The buffer that holds the data of the index buffer. You can also provide an Array and a buffer will be created from it.
	* @returns - Returns self, useful for chaining.
	*/
	Geometry.prototype.addIndex = function(buffer) {
		if (!(buffer instanceof Buffer)) {
			if (buffer instanceof Array) buffer = new Uint16Array(buffer);
			buffer = new Buffer(buffer);
		}
		buffer.type = BUFFER_TYPE.ELEMENT_ARRAY_BUFFER;
		this.indexBuffer = buffer;
		if (this.buffers.indexOf(buffer) === -1) this.buffers.push(buffer);
		return this;
	};
	/**
	* Returns the index buffer
	* @returns - The index buffer.
	*/
	Geometry.prototype.getIndex = function() {
		return this.indexBuffer;
	};
	/**
	* This function modifies the structure so that all current attributes become interleaved into a single buffer
	* This can be useful if your model remains static as it offers a little performance boost
	* @returns - Returns self, useful for chaining.
	*/
	Geometry.prototype.interleave = function() {
		if (this.buffers.length === 1 || this.buffers.length === 2 && this.indexBuffer) return this;
		var arrays = [];
		var sizes = [];
		var interleavedBuffer = new Buffer();
		var i;
		for (i in this.attributes) {
			var attribute = this.attributes[i];
			var buffer = this.buffers[attribute.buffer];
			arrays.push(buffer.data);
			sizes.push(attribute.size * byteSizeMap$1[attribute.type] / 4);
			attribute.buffer = 0;
		}
		interleavedBuffer.data = interleaveTypedArrays(arrays, sizes);
		for (i = 0; i < this.buffers.length; i++) if (this.buffers[i] !== this.indexBuffer) this.buffers[i].destroy();
		this.buffers = [interleavedBuffer];
		if (this.indexBuffer) this.buffers.push(this.indexBuffer);
		return this;
	};
	/** Get the size of the geometries, in vertices. */
	Geometry.prototype.getSize = function() {
		for (var i in this.attributes) {
			var attribute = this.attributes[i];
			return this.buffers[attribute.buffer].data.length / (attribute.stride / 4 || attribute.size);
		}
		return 0;
	};
	/** Disposes WebGL resources that are connected to this geometry. */
	Geometry.prototype.dispose = function() {
		this.disposeRunner.emit(this, false);
	};
	/** Destroys the geometry. */
	Geometry.prototype.destroy = function() {
		this.dispose();
		this.buffers = null;
		this.indexBuffer = null;
		this.attributes = null;
	};
	/**
	* Returns a clone of the geometry.
	* @returns - A new clone of this geometry.
	*/
	Geometry.prototype.clone = function() {
		var geometry = new Geometry();
		for (var i = 0; i < this.buffers.length; i++) geometry.buffers[i] = new Buffer(this.buffers[i].data.slice(0));
		for (var i in this.attributes) {
			var attrib = this.attributes[i];
			geometry.attributes[i] = new Attribute(attrib.buffer, attrib.size, attrib.normalized, attrib.type, attrib.stride, attrib.start, attrib.instance);
		}
		if (this.indexBuffer) {
			geometry.indexBuffer = geometry.buffers[this.buffers.indexOf(this.indexBuffer)];
			geometry.indexBuffer.type = BUFFER_TYPE.ELEMENT_ARRAY_BUFFER;
		}
		return geometry;
	};
	/**
	* Merges an array of geometries into a new single one.
	*
	* Geometry attribute styles must match for this operation to work.
	* @param geometries - array of geometries to merge
	* @returns - Shiny new geometry!
	*/
	Geometry.merge = function(geometries) {
		var geometryOut = new Geometry();
		var arrays = [];
		var sizes = [];
		var offsets = [];
		var geometry;
		for (var i = 0; i < geometries.length; i++) {
			geometry = geometries[i];
			for (var j = 0; j < geometry.buffers.length; j++) {
				sizes[j] = sizes[j] || 0;
				sizes[j] += geometry.buffers[j].data.length;
				offsets[j] = 0;
			}
		}
		for (var i = 0; i < geometry.buffers.length; i++) {
			arrays[i] = new map[getBufferType(geometry.buffers[i].data)](sizes[i]);
			geometryOut.buffers[i] = new Buffer(arrays[i]);
		}
		for (var i = 0; i < geometries.length; i++) {
			geometry = geometries[i];
			for (var j = 0; j < geometry.buffers.length; j++) {
				arrays[j].set(geometry.buffers[j].data, offsets[j]);
				offsets[j] += geometry.buffers[j].data.length;
			}
		}
		geometryOut.attributes = geometry.attributes;
		if (geometry.indexBuffer) {
			geometryOut.indexBuffer = geometryOut.buffers[geometry.buffers.indexOf(geometry.indexBuffer)];
			geometryOut.indexBuffer.type = BUFFER_TYPE.ELEMENT_ARRAY_BUFFER;
			var offset = 0;
			var stride = 0;
			var offset2 = 0;
			var bufferIndexToCount = 0;
			for (var i = 0; i < geometry.buffers.length; i++) if (geometry.buffers[i] !== geometry.indexBuffer) {
				bufferIndexToCount = i;
				break;
			}
			for (var i in geometry.attributes) {
				var attribute = geometry.attributes[i];
				if ((attribute.buffer | 0) === bufferIndexToCount) stride += attribute.size * byteSizeMap$1[attribute.type] / 4;
			}
			for (var i = 0; i < geometries.length; i++) {
				var indexBufferData = geometries[i].indexBuffer.data;
				for (var j = 0; j < indexBufferData.length; j++) geometryOut.indexBuffer.data[j + offset2] += offset;
				offset += geometries[i].buffers[bufferIndexToCount].data.length / stride;
				offset2 += indexBufferData.length;
			}
		}
		return geometryOut;
	};
	return Geometry;
}();
/**
* Helper class to create a quad
* @memberof PIXI
*/
var Quad = function(_super) {
	__extends$1(Quad, _super);
	function Quad() {
		var _this = _super.call(this) || this;
		_this.addAttribute("aVertexPosition", new Float32Array([
			0,
			0,
			1,
			0,
			1,
			1,
			0,
			1
		])).addIndex([
			0,
			1,
			3,
			2
		]);
		return _this;
	}
	return Quad;
}(Geometry);
/**
* Helper class to create a quad with uvs like in v4
* @memberof PIXI
*/
var QuadUv = function(_super) {
	__extends$1(QuadUv, _super);
	function QuadUv() {
		var _this = _super.call(this) || this;
		_this.vertices = new Float32Array([
			-1,
			-1,
			1,
			-1,
			1,
			1,
			-1,
			1
		]);
		_this.uvs = new Float32Array([
			0,
			0,
			1,
			0,
			1,
			1,
			0,
			1
		]);
		_this.vertexBuffer = new Buffer(_this.vertices);
		_this.uvBuffer = new Buffer(_this.uvs);
		_this.addAttribute("aVertexPosition", _this.vertexBuffer).addAttribute("aTextureCoord", _this.uvBuffer).addIndex([
			0,
			1,
			2,
			0,
			2,
			3
		]);
		return _this;
	}
	/**
	* Maps two Rectangle to the quad.
	* @param targetTextureFrame - The first rectangle
	* @param destinationFrame - The second rectangle
	* @returns - Returns itself.
	*/
	QuadUv.prototype.map = function(targetTextureFrame, destinationFrame) {
		var x = 0;
		var y = 0;
		this.uvs[0] = x;
		this.uvs[1] = y;
		this.uvs[2] = x + destinationFrame.width / targetTextureFrame.width;
		this.uvs[3] = y;
		this.uvs[4] = x + destinationFrame.width / targetTextureFrame.width;
		this.uvs[5] = y + destinationFrame.height / targetTextureFrame.height;
		this.uvs[6] = x;
		this.uvs[7] = y + destinationFrame.height / targetTextureFrame.height;
		x = destinationFrame.x;
		y = destinationFrame.y;
		this.vertices[0] = x;
		this.vertices[1] = y;
		this.vertices[2] = x + destinationFrame.width;
		this.vertices[3] = y;
		this.vertices[4] = x + destinationFrame.width;
		this.vertices[5] = y + destinationFrame.height;
		this.vertices[6] = x;
		this.vertices[7] = y + destinationFrame.height;
		this.invalidate();
		return this;
	};
	/**
	* Legacy upload method, just marks buffers dirty.
	* @returns - Returns itself.
	*/
	QuadUv.prototype.invalidate = function() {
		this.vertexBuffer._updateID++;
		this.uvBuffer._updateID++;
		return this;
	};
	return QuadUv;
}(Geometry);
var UID$2 = 0;
/**
* Uniform group holds uniform map and some ID's for work
*
* `UniformGroup` has two modes:
*
* 1: Normal mode
* Normal mode will upload the uniforms with individual function calls as required
*
* 2: Uniform buffer mode
* This mode will treat the uniforms as a uniform buffer. You can pass in either a buffer that you manually handle, or
* or a generic object that PixiJS will automatically map to a buffer for you.
* For maximum benefits, make Ubo UniformGroups static, and only update them each frame.
*
* Rules of UBOs:
* - UBOs only work with WebGL2, so make sure you have a fallback!
* - Only floats are supported (including vec[2,3,4], mat[2,3,4])
* - Samplers cannot be used in ubo's (a GPU limitation)
* - You must ensure that the object you pass in exactly matches in the shader ubo structure.
* Otherwise, weirdness will ensue!
* - The name of the ubo object added to the group must match exactly the name of the ubo in the shader.
*
* ```
* // ubo in shader:
* uniform myCoolData { // declaring a ubo..
* mat4 uCoolMatrix;
* float uFloatyMcFloatFace
*
*
* // a new uniform buffer object..
* const myCoolData = new UniformBufferGroup({
*   uCoolMatrix: new Matrix(),
*   uFloatyMcFloatFace: 23,
* }}
*
* // build a shader...
* const shader = Shader.from(srcVert, srcFrag, {
*   myCoolData // name matches the ubo name in the shader. will be processed accordingly.
* })
*
*  ```
* @memberof PIXI
*/
var UniformGroup = function() {
	/**
	* @param {object | Buffer} [uniforms] - Custom uniforms to use to augment the built-in ones. Or a pixi buffer.
	* @param isStatic - Uniforms wont be changed after creation.
	* @param isUbo - If true, will treat this uniform group as a uniform buffer object.
	*/
	function UniformGroup(uniforms, isStatic, isUbo) {
		this.group = true;
		this.syncUniforms = {};
		this.dirtyId = 0;
		this.id = UID$2++;
		this.static = !!isStatic;
		this.ubo = !!isUbo;
		if (uniforms instanceof Buffer) {
			this.buffer = uniforms;
			this.buffer.type = BUFFER_TYPE.UNIFORM_BUFFER;
			this.autoManage = false;
			this.ubo = true;
		} else {
			this.uniforms = uniforms;
			if (this.ubo) {
				this.buffer = new Buffer(/* @__PURE__ */ new Float32Array(1));
				this.buffer.type = BUFFER_TYPE.UNIFORM_BUFFER;
				this.autoManage = true;
			}
		}
	}
	UniformGroup.prototype.update = function() {
		this.dirtyId++;
		if (!this.autoManage && this.buffer) this.buffer.update();
	};
	UniformGroup.prototype.add = function(name, uniforms, _static) {
		if (!this.ubo) this.uniforms[name] = new UniformGroup(uniforms, _static);
		else throw new Error("[UniformGroup] uniform groups in ubo mode cannot be modified, or have uniform groups nested in them");
	};
	UniformGroup.from = function(uniforms, _static, _ubo) {
		return new UniformGroup(uniforms, _static, _ubo);
	};
	/**
	* A short hand function for creating a static UBO UniformGroup.
	* @param uniforms - the ubo item
	* @param _static - should this be updated each time it is used? defaults to true here!
	*/
	UniformGroup.uboFrom = function(uniforms, _static) {
		return new UniformGroup(uniforms, _static !== null && _static !== void 0 ? _static : true, true);
	};
	return UniformGroup;
}();
/**
* System plugin to the renderer to manage filter states.
* @ignore
*/
var FilterState = function() {
	function FilterState() {
		this.renderTexture = null;
		this.target = null;
		this.legacy = false;
		this.resolution = 1;
		this.multisample = MSAA_QUALITY.NONE;
		this.sourceFrame = new Rectangle();
		this.destinationFrame = new Rectangle();
		this.bindingSourceFrame = new Rectangle();
		this.bindingDestinationFrame = new Rectangle();
		this.filters = [];
		this.transform = null;
	}
	/** Clears the state */
	FilterState.prototype.clear = function() {
		this.target = null;
		this.filters = null;
		this.renderTexture = null;
	};
	return FilterState;
}();
var tempPoints = [
	new Point(),
	new Point(),
	new Point(),
	new Point()
];
var tempMatrix$2 = new Matrix();
/**
* System plugin to the renderer to manage filters.
*
* ## Pipeline
*
* The FilterSystem executes the filtering pipeline by rendering the display-object into a texture, applying its
* [filters]{@link PIXI.Filter} in series, and the last filter outputs into the final render-target.
*
* The filter-frame is the rectangle in world space being filtered, and those contents are mapped into
* `(0, 0, filterFrame.width, filterFrame.height)` into the filter render-texture. The filter-frame is also called
* the source-frame, as it is used to bind the filter render-textures. The last filter outputs to the `filterFrame`
* in the final render-target.
*
* ## Usage
*
* {@link PIXI.Container#renderAdvanced} is an example of how to use the filter system. It is a 3 step process:
*
* **push**: Use {@link PIXI.FilterSystem#push} to push the set of filters to be applied on a filter-target.
* **render**: Render the contents to be filtered using the renderer. The filter-system will only capture the contents
*      inside the bounds of the filter-target. NOTE: Using {@link PIXI.Renderer#render} is
*      illegal during an existing render cycle, and it may reset the filter system.
* **pop**: Use {@link PIXI.FilterSystem#pop} to pop & execute the filters you initially pushed. It will apply them
*      serially and output to the bounds of the filter-target.
* @memberof PIXI
*/
var FilterSystem = function() {
	/**
	* @param renderer - The renderer this System works for.
	*/
	function FilterSystem(renderer) {
		this.renderer = renderer;
		this.defaultFilterStack = [{}];
		this.texturePool = new RenderTexturePool();
		this.texturePool.setScreenSize(renderer.view);
		this.statePool = [];
		this.quad = new Quad();
		this.quadUv = new QuadUv();
		this.tempRect = new Rectangle();
		this.activeState = {};
		this.globalUniforms = new UniformGroup({
			outputFrame: new Rectangle(),
			inputSize: /* @__PURE__ */ new Float32Array(4),
			inputPixel: /* @__PURE__ */ new Float32Array(4),
			inputClamp: /* @__PURE__ */ new Float32Array(4),
			resolution: 1,
			filterArea: /* @__PURE__ */ new Float32Array(4),
			filterClamp: /* @__PURE__ */ new Float32Array(4)
		}, true);
		this.forceClear = false;
		this.useMaxPadding = false;
	}
	/**
	* Pushes a set of filters to be applied later to the system. This will redirect further rendering into an
	* input render-texture for the rest of the filtering pipeline.
	* @param {PIXI.DisplayObject} target - The target of the filter to render.
	* @param filters - The filters to apply.
	*/
	FilterSystem.prototype.push = function(target, filters) {
		var _a, _b;
		var renderer = this.renderer;
		var filterStack = this.defaultFilterStack;
		var state = this.statePool.pop() || new FilterState();
		var renderTextureSystem = this.renderer.renderTexture;
		var resolution = filters[0].resolution;
		var multisample = filters[0].multisample;
		var padding = filters[0].padding;
		var autoFit = filters[0].autoFit;
		var legacy = (_a = filters[0].legacy) !== null && _a !== void 0 ? _a : true;
		for (var i = 1; i < filters.length; i++) {
			var filter = filters[i];
			resolution = Math.min(resolution, filter.resolution);
			multisample = Math.min(multisample, filter.multisample);
			padding = this.useMaxPadding ? Math.max(padding, filter.padding) : padding + filter.padding;
			autoFit = autoFit && filter.autoFit;
			legacy = legacy || ((_b = filter.legacy) !== null && _b !== void 0 ? _b : true);
		}
		if (filterStack.length === 1) this.defaultFilterStack[0].renderTexture = renderTextureSystem.current;
		filterStack.push(state);
		state.resolution = resolution;
		state.multisample = multisample;
		state.legacy = legacy;
		state.target = target;
		state.sourceFrame.copyFrom(target.filterArea || target.getBounds(true));
		state.sourceFrame.pad(padding);
		var sourceFrameProjected = this.tempRect.copyFrom(renderTextureSystem.sourceFrame);
		if (renderer.projection.transform) this.transformAABB(tempMatrix$2.copyFrom(renderer.projection.transform).invert(), sourceFrameProjected);
		if (autoFit) {
			state.sourceFrame.fit(sourceFrameProjected);
			if (state.sourceFrame.width <= 0 || state.sourceFrame.height <= 0) {
				state.sourceFrame.width = 0;
				state.sourceFrame.height = 0;
			}
		} else if (!state.sourceFrame.intersects(sourceFrameProjected)) {
			state.sourceFrame.width = 0;
			state.sourceFrame.height = 0;
		}
		this.roundFrame(state.sourceFrame, renderTextureSystem.current ? renderTextureSystem.current.resolution : renderer.resolution, renderTextureSystem.sourceFrame, renderTextureSystem.destinationFrame, renderer.projection.transform);
		state.renderTexture = this.getOptimalFilterTexture(state.sourceFrame.width, state.sourceFrame.height, resolution, multisample);
		state.filters = filters;
		state.destinationFrame.width = state.renderTexture.width;
		state.destinationFrame.height = state.renderTexture.height;
		var destinationFrame = this.tempRect;
		destinationFrame.x = 0;
		destinationFrame.y = 0;
		destinationFrame.width = state.sourceFrame.width;
		destinationFrame.height = state.sourceFrame.height;
		state.renderTexture.filterFrame = state.sourceFrame;
		state.bindingSourceFrame.copyFrom(renderTextureSystem.sourceFrame);
		state.bindingDestinationFrame.copyFrom(renderTextureSystem.destinationFrame);
		state.transform = renderer.projection.transform;
		renderer.projection.transform = null;
		renderTextureSystem.bind(state.renderTexture, state.sourceFrame, destinationFrame);
		renderer.framebuffer.clear(0, 0, 0, 0);
	};
	/** Pops off the filter and applies it. */
	FilterSystem.prototype.pop = function() {
		var filterStack = this.defaultFilterStack;
		var state = filterStack.pop();
		var filters = state.filters;
		this.activeState = state;
		var globalUniforms = this.globalUniforms.uniforms;
		globalUniforms.outputFrame = state.sourceFrame;
		globalUniforms.resolution = state.resolution;
		var inputSize = globalUniforms.inputSize;
		var inputPixel = globalUniforms.inputPixel;
		var inputClamp = globalUniforms.inputClamp;
		inputSize[0] = state.destinationFrame.width;
		inputSize[1] = state.destinationFrame.height;
		inputSize[2] = 1 / inputSize[0];
		inputSize[3] = 1 / inputSize[1];
		inputPixel[0] = Math.round(inputSize[0] * state.resolution);
		inputPixel[1] = Math.round(inputSize[1] * state.resolution);
		inputPixel[2] = 1 / inputPixel[0];
		inputPixel[3] = 1 / inputPixel[1];
		inputClamp[0] = .5 * inputPixel[2];
		inputClamp[1] = .5 * inputPixel[3];
		inputClamp[2] = state.sourceFrame.width * inputSize[2] - .5 * inputPixel[2];
		inputClamp[3] = state.sourceFrame.height * inputSize[3] - .5 * inputPixel[3];
		if (state.legacy) {
			var filterArea = globalUniforms.filterArea;
			filterArea[0] = state.destinationFrame.width;
			filterArea[1] = state.destinationFrame.height;
			filterArea[2] = state.sourceFrame.x;
			filterArea[3] = state.sourceFrame.y;
			globalUniforms.filterClamp = globalUniforms.inputClamp;
		}
		this.globalUniforms.update();
		var lastState = filterStack[filterStack.length - 1];
		this.renderer.framebuffer.blit();
		if (filters.length === 1) {
			filters[0].apply(this, state.renderTexture, lastState.renderTexture, CLEAR_MODES.BLEND, state);
			this.returnFilterTexture(state.renderTexture);
		} else {
			var flip = state.renderTexture;
			var flop = this.getOptimalFilterTexture(flip.width, flip.height, state.resolution);
			flop.filterFrame = flip.filterFrame;
			var i = 0;
			for (i = 0; i < filters.length - 1; ++i) {
				if (i === 1 && state.multisample > 1) {
					flop = this.getOptimalFilterTexture(flip.width, flip.height, state.resolution);
					flop.filterFrame = flip.filterFrame;
				}
				filters[i].apply(this, flip, flop, CLEAR_MODES.CLEAR, state);
				var t = flip;
				flip = flop;
				flop = t;
			}
			filters[i].apply(this, flip, lastState.renderTexture, CLEAR_MODES.BLEND, state);
			if (i > 1 && state.multisample > 1) this.returnFilterTexture(state.renderTexture);
			this.returnFilterTexture(flip);
			this.returnFilterTexture(flop);
		}
		state.clear();
		this.statePool.push(state);
	};
	/**
	* Binds a renderTexture with corresponding `filterFrame`, clears it if mode corresponds.
	* @param filterTexture - renderTexture to bind, should belong to filter pool or filter stack
	* @param clearMode - clearMode, by default its CLEAR/YES. See {@link PIXI.CLEAR_MODES}
	*/
	FilterSystem.prototype.bindAndClear = function(filterTexture, clearMode) {
		if (clearMode === void 0) clearMode = CLEAR_MODES.CLEAR;
		var _a = this.renderer, renderTextureSystem = _a.renderTexture, stateSystem = _a.state;
		if (filterTexture === this.defaultFilterStack[this.defaultFilterStack.length - 1].renderTexture) this.renderer.projection.transform = this.activeState.transform;
		else this.renderer.projection.transform = null;
		if (filterTexture && filterTexture.filterFrame) {
			var destinationFrame = this.tempRect;
			destinationFrame.x = 0;
			destinationFrame.y = 0;
			destinationFrame.width = filterTexture.filterFrame.width;
			destinationFrame.height = filterTexture.filterFrame.height;
			renderTextureSystem.bind(filterTexture, filterTexture.filterFrame, destinationFrame);
		} else if (filterTexture !== this.defaultFilterStack[this.defaultFilterStack.length - 1].renderTexture) renderTextureSystem.bind(filterTexture);
		else this.renderer.renderTexture.bind(filterTexture, this.activeState.bindingSourceFrame, this.activeState.bindingDestinationFrame);
		var autoClear = stateSystem.stateId & 1 || this.forceClear;
		if (clearMode === CLEAR_MODES.CLEAR || clearMode === CLEAR_MODES.BLIT && autoClear) this.renderer.framebuffer.clear(0, 0, 0, 0);
	};
	/**
	* Draws a filter using the default rendering process.
	*
	* This should be called only by {@link Filter#apply}.
	* @param filter - The filter to draw.
	* @param input - The input render target.
	* @param output - The target to output to.
	* @param clearMode - Should the output be cleared before rendering to it
	*/
	FilterSystem.prototype.applyFilter = function(filter, input, output, clearMode) {
		var renderer = this.renderer;
		renderer.state.set(filter.state);
		this.bindAndClear(output, clearMode);
		filter.uniforms.uSampler = input;
		filter.uniforms.filterGlobals = this.globalUniforms;
		renderer.shader.bind(filter);
		filter.legacy = !!filter.program.attributeData.aTextureCoord;
		if (filter.legacy) {
			this.quadUv.map(input._frame, input.filterFrame);
			renderer.geometry.bind(this.quadUv);
			renderer.geometry.draw(DRAW_MODES.TRIANGLES);
		} else {
			renderer.geometry.bind(this.quad);
			renderer.geometry.draw(DRAW_MODES.TRIANGLE_STRIP);
		}
	};
	/**
	* Multiply _input normalized coordinates_ to this matrix to get _sprite texture normalized coordinates_.
	*
	* Use `outputMatrix * vTextureCoord` in the shader.
	* @param outputMatrix - The matrix to output to.
	* @param {PIXI.Sprite} sprite - The sprite to map to.
	* @returns The mapped matrix.
	*/
	FilterSystem.prototype.calculateSpriteMatrix = function(outputMatrix, sprite) {
		var _a = this.activeState, sourceFrame = _a.sourceFrame, destinationFrame = _a.destinationFrame;
		var orig = sprite._texture.orig;
		var mappedMatrix = outputMatrix.set(destinationFrame.width, 0, 0, destinationFrame.height, sourceFrame.x, sourceFrame.y);
		var worldTransform = sprite.worldTransform.copyTo(Matrix.TEMP_MATRIX);
		worldTransform.invert();
		mappedMatrix.prepend(worldTransform);
		mappedMatrix.scale(1 / orig.width, 1 / orig.height);
		mappedMatrix.translate(sprite.anchor.x, sprite.anchor.y);
		return mappedMatrix;
	};
	/** Destroys this Filter System. */
	FilterSystem.prototype.destroy = function() {
		this.renderer = null;
		this.texturePool.clear(false);
	};
	/**
	* Gets a Power-of-Two render texture or fullScreen texture
	* @param minWidth - The minimum width of the render texture in real pixels.
	* @param minHeight - The minimum height of the render texture in real pixels.
	* @param resolution - The resolution of the render texture.
	* @param multisample - Number of samples of the render texture.
	* @returns - The new render texture.
	*/
	FilterSystem.prototype.getOptimalFilterTexture = function(minWidth, minHeight, resolution, multisample) {
		if (resolution === void 0) resolution = 1;
		if (multisample === void 0) multisample = MSAA_QUALITY.NONE;
		return this.texturePool.getOptimalTexture(minWidth, minHeight, resolution, multisample);
	};
	/**
	* Gets extra render texture to use inside current filter
	* To be compliant with older filters, you can use params in any order
	* @param input - renderTexture from which size and resolution will be copied
	* @param resolution - override resolution of the renderTexture
	* @param multisample - number of samples of the renderTexture
	*/
	FilterSystem.prototype.getFilterTexture = function(input, resolution, multisample) {
		if (typeof input === "number") {
			var swap = input;
			input = resolution;
			resolution = swap;
		}
		input = input || this.activeState.renderTexture;
		var filterTexture = this.texturePool.getOptimalTexture(input.width, input.height, resolution || input.resolution, multisample || MSAA_QUALITY.NONE);
		filterTexture.filterFrame = input.filterFrame;
		return filterTexture;
	};
	/**
	* Frees a render texture back into the pool.
	* @param renderTexture - The renderTarget to free
	*/
	FilterSystem.prototype.returnFilterTexture = function(renderTexture) {
		this.texturePool.returnTexture(renderTexture);
	};
	/** Empties the texture pool. */
	FilterSystem.prototype.emptyPool = function() {
		this.texturePool.clear(true);
	};
	/** Calls `texturePool.resize()`, affects fullScreen renderTextures. */
	FilterSystem.prototype.resize = function() {
		this.texturePool.setScreenSize(this.renderer.view);
	};
	/**
	* @param matrix - first param
	* @param rect - second param
	*/
	FilterSystem.prototype.transformAABB = function(matrix, rect) {
		var lt = tempPoints[0];
		var lb = tempPoints[1];
		var rt = tempPoints[2];
		var rb = tempPoints[3];
		lt.set(rect.left, rect.top);
		lb.set(rect.left, rect.bottom);
		rt.set(rect.right, rect.top);
		rb.set(rect.right, rect.bottom);
		matrix.apply(lt, lt);
		matrix.apply(lb, lb);
		matrix.apply(rt, rt);
		matrix.apply(rb, rb);
		var x0 = Math.min(lt.x, lb.x, rt.x, rb.x);
		var y0 = Math.min(lt.y, lb.y, rt.y, rb.y);
		var x1 = Math.max(lt.x, lb.x, rt.x, rb.x);
		var y1 = Math.max(lt.y, lb.y, rt.y, rb.y);
		rect.x = x0;
		rect.y = y0;
		rect.width = x1 - x0;
		rect.height = y1 - y0;
	};
	FilterSystem.prototype.roundFrame = function(frame, resolution, bindingSourceFrame, bindingDestinationFrame, transform) {
		if (frame.width <= 0 || frame.height <= 0 || bindingSourceFrame.width <= 0 || bindingSourceFrame.height <= 0) return;
		if (transform) {
			var a = transform.a, b = transform.b, c = transform.c, d = transform.d;
			if ((Math.abs(b) > 1e-4 || Math.abs(c) > 1e-4) && (Math.abs(a) > 1e-4 || Math.abs(d) > 1e-4)) return;
		}
		transform = transform ? tempMatrix$2.copyFrom(transform) : tempMatrix$2.identity();
		transform.translate(-bindingSourceFrame.x, -bindingSourceFrame.y).scale(bindingDestinationFrame.width / bindingSourceFrame.width, bindingDestinationFrame.height / bindingSourceFrame.height).translate(bindingDestinationFrame.x, bindingDestinationFrame.y);
		this.transformAABB(transform, frame);
		frame.ceil(resolution);
		this.transformAABB(transform.invert(), frame);
	};
	return FilterSystem;
}();
/**
* Base for a common object renderer that can be used as a
* system renderer plugin.
* @memberof PIXI
*/
var ObjectRenderer = function() {
	/**
	* @param renderer - The renderer this manager works for.
	*/
	function ObjectRenderer(renderer) {
		this.renderer = renderer;
	}
	/** Stub method that should be used to empty the current batch by rendering objects now. */
	ObjectRenderer.prototype.flush = function() {};
	/** Generic destruction method that frees all resources. This should be called by subclasses. */
	ObjectRenderer.prototype.destroy = function() {
		this.renderer = null;
	};
	/**
	* Stub method that initializes any state required before
	* rendering starts. It is different from the `prerender`
	* signal, which occurs every frame, in that it is called
	* whenever an object requests _this_ renderer specifically.
	*/
	ObjectRenderer.prototype.start = function() {};
	/** Stops the renderer. It should free up any state and become dormant. */
	ObjectRenderer.prototype.stop = function() {
		this.flush();
	};
	/**
	* Keeps the object to render. It doesn't have to be
	* rendered immediately.
	* @param {PIXI.DisplayObject} _object - The object to render.
	*/
	ObjectRenderer.prototype.render = function(_object) {};
	return ObjectRenderer;
}();
/**
* System plugin to the renderer to manage batching.
* @memberof PIXI
*/
var BatchSystem = function() {
	/**
	* @param renderer - The renderer this System works for.
	*/
	function BatchSystem(renderer) {
		this.renderer = renderer;
		this.emptyRenderer = new ObjectRenderer(renderer);
		this.currentRenderer = this.emptyRenderer;
	}
	/**
	* Changes the current renderer to the one given in parameter
	* @param objectRenderer - The object renderer to use.
	*/
	BatchSystem.prototype.setObjectRenderer = function(objectRenderer) {
		if (this.currentRenderer === objectRenderer) return;
		this.currentRenderer.stop();
		this.currentRenderer = objectRenderer;
		this.currentRenderer.start();
	};
	/**
	* This should be called if you wish to do some custom rendering
	* It will basically render anything that may be batched up such as sprites
	*/
	BatchSystem.prototype.flush = function() {
		this.setObjectRenderer(this.emptyRenderer);
	};
	/** Reset the system to an empty renderer */
	BatchSystem.prototype.reset = function() {
		this.setObjectRenderer(this.emptyRenderer);
	};
	/**
	* Handy function for batch renderers: copies bound textures in first maxTextures locations to array
	* sets actual _batchLocation for them
	* @param arr - arr copy destination
	* @param maxTextures - number of copied elements
	*/
	BatchSystem.prototype.copyBoundTextures = function(arr, maxTextures) {
		var boundTextures = this.renderer.texture.boundTextures;
		for (var i = maxTextures - 1; i >= 0; --i) {
			arr[i] = boundTextures[i] || null;
			if (arr[i]) arr[i]._batchLocation = i;
		}
	};
	/**
	* Assigns batch locations to textures in array based on boundTextures state.
	* All textures in texArray should have `_batchEnabled = _batchId`,
	* and their count should be less than `maxTextures`.
	* @param texArray - textures to bound
	* @param boundTextures - current state of bound textures
	* @param batchId - marker for _batchEnabled param of textures in texArray
	* @param maxTextures - number of texture locations to manipulate
	*/
	BatchSystem.prototype.boundArray = function(texArray, boundTextures, batchId, maxTextures) {
		var elements = texArray.elements, ids = texArray.ids, count = texArray.count;
		var j = 0;
		for (var i = 0; i < count; i++) {
			var tex = elements[i];
			var loc = tex._batchLocation;
			if (loc >= 0 && loc < maxTextures && boundTextures[loc] === tex) {
				ids[i] = loc;
				continue;
			}
			while (j < maxTextures) {
				var bound = boundTextures[j];
				if (bound && bound._batchEnabled === batchId && bound._batchLocation === j) {
					j++;
					continue;
				}
				ids[i] = j;
				tex._batchLocation = j;
				boundTextures[j] = tex;
				break;
			}
		}
	};
	/**
	* @ignore
	*/
	BatchSystem.prototype.destroy = function() {
		this.renderer = null;
	};
	return BatchSystem;
}();
var CONTEXT_UID_COUNTER = 0;
/**
* System plugin to the renderer to manage the context.
* @memberof PIXI
*/
var ContextSystem = function() {
	/** @param renderer - The renderer this System works for. */
	function ContextSystem(renderer) {
		this.renderer = renderer;
		this.webGLVersion = 1;
		this.extensions = {};
		this.supports = { uint32Indices: false };
		this.handleContextLost = this.handleContextLost.bind(this);
		this.handleContextRestored = this.handleContextRestored.bind(this);
		renderer.view.addEventListener("webglcontextlost", this.handleContextLost, false);
		renderer.view.addEventListener("webglcontextrestored", this.handleContextRestored, false);
	}
	Object.defineProperty(ContextSystem.prototype, "isLost", {
		/**
		* `true` if the context is lost
		* @readonly
		*/
		get: function() {
			return !this.gl || this.gl.isContextLost();
		},
		enumerable: false,
		configurable: true
	});
	/**
	* Handles the context change event.
	* @param {WebGLRenderingContext} gl - New WebGL context.
	*/
	ContextSystem.prototype.contextChange = function(gl) {
		this.gl = gl;
		this.renderer.gl = gl;
		this.renderer.CONTEXT_UID = CONTEXT_UID_COUNTER++;
	};
	/**
	* Initializes the context.
	* @protected
	* @param {WebGLRenderingContext} gl - WebGL context
	*/
	ContextSystem.prototype.initFromContext = function(gl) {
		this.gl = gl;
		this.validateContext(gl);
		this.renderer.gl = gl;
		this.renderer.CONTEXT_UID = CONTEXT_UID_COUNTER++;
		this.renderer.runners.contextChange.emit(gl);
	};
	/**
	* Initialize from context options
	* @protected
	* @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
	* @param {object} options - context attributes
	*/
	ContextSystem.prototype.initFromOptions = function(options) {
		var gl = this.createContext(this.renderer.view, options);
		this.initFromContext(gl);
	};
	/**
	* Helper class to create a WebGL Context
	* @param canvas - the canvas element that we will get the context from
	* @param options - An options object that gets passed in to the canvas element containing the
	*    context attributes
	* @see https://developer.mozilla.org/en/docs/Web/API/HTMLCanvasElement/getContext
	* @returns {WebGLRenderingContext} the WebGL context
	*/
	ContextSystem.prototype.createContext = function(canvas, options) {
		var gl;
		if (settings.PREFER_ENV >= ENV.WEBGL2) gl = canvas.getContext("webgl2", options);
		if (gl) this.webGLVersion = 2;
		else {
			this.webGLVersion = 1;
			gl = canvas.getContext("webgl", options) || canvas.getContext("experimental-webgl", options);
			if (!gl) throw new Error("This browser does not support WebGL. Try using the canvas renderer");
		}
		this.gl = gl;
		this.getExtensions();
		return this.gl;
	};
	/** Auto-populate the {@link PIXI.ContextSystem.extensions extensions}. */
	ContextSystem.prototype.getExtensions = function() {
		var gl = this.gl;
		var common = {
			loseContext: gl.getExtension("WEBGL_lose_context"),
			anisotropicFiltering: gl.getExtension("EXT_texture_filter_anisotropic"),
			floatTextureLinear: gl.getExtension("OES_texture_float_linear"),
			s3tc: gl.getExtension("WEBGL_compressed_texture_s3tc"),
			s3tc_sRGB: gl.getExtension("WEBGL_compressed_texture_s3tc_srgb"),
			etc: gl.getExtension("WEBGL_compressed_texture_etc"),
			etc1: gl.getExtension("WEBGL_compressed_texture_etc1"),
			pvrtc: gl.getExtension("WEBGL_compressed_texture_pvrtc") || gl.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
			atc: gl.getExtension("WEBGL_compressed_texture_atc"),
			astc: gl.getExtension("WEBGL_compressed_texture_astc")
		};
		if (this.webGLVersion === 1) Object.assign(this.extensions, common, {
			drawBuffers: gl.getExtension("WEBGL_draw_buffers"),
			depthTexture: gl.getExtension("WEBGL_depth_texture"),
			vertexArrayObject: gl.getExtension("OES_vertex_array_object") || gl.getExtension("MOZ_OES_vertex_array_object") || gl.getExtension("WEBKIT_OES_vertex_array_object"),
			uint32ElementIndex: gl.getExtension("OES_element_index_uint"),
			floatTexture: gl.getExtension("OES_texture_float"),
			floatTextureLinear: gl.getExtension("OES_texture_float_linear"),
			textureHalfFloat: gl.getExtension("OES_texture_half_float"),
			textureHalfFloatLinear: gl.getExtension("OES_texture_half_float_linear")
		});
		else if (this.webGLVersion === 2) Object.assign(this.extensions, common, { colorBufferFloat: gl.getExtension("EXT_color_buffer_float") });
	};
	/**
	* Handles a lost webgl context
	* @param {WebGLContextEvent} event - The context lost event.
	*/
	ContextSystem.prototype.handleContextLost = function(event) {
		var _this = this;
		event.preventDefault();
		setTimeout(function() {
			if (_this.gl.isContextLost() && _this.extensions.loseContext) _this.extensions.loseContext.restoreContext();
		}, 0);
	};
	/** Handles a restored webgl context. */
	ContextSystem.prototype.handleContextRestored = function() {
		this.renderer.runners.contextChange.emit(this.gl);
	};
	ContextSystem.prototype.destroy = function() {
		var view = this.renderer.view;
		this.renderer = null;
		view.removeEventListener("webglcontextlost", this.handleContextLost);
		view.removeEventListener("webglcontextrestored", this.handleContextRestored);
		this.gl.useProgram(null);
		if (this.extensions.loseContext) this.extensions.loseContext.loseContext();
	};
	/** Handle the post-render runner event. */
	ContextSystem.prototype.postrender = function() {
		if (this.renderer.renderingToScreen) this.gl.flush();
	};
	/**
	* Validate context.
	* @param {WebGLRenderingContext} gl - Render context.
	*/
	ContextSystem.prototype.validateContext = function(gl) {
		var attributes = gl.getContextAttributes();
		var isWebGl2 = "WebGL2RenderingContext" in globalThis && gl instanceof globalThis.WebGL2RenderingContext;
		if (isWebGl2) this.webGLVersion = 2;
		if (attributes && !attributes.stencil) console.warn("Provided WebGL context does not have a stencil buffer, masks may not render correctly");
		var hasuint32 = isWebGl2 || !!gl.getExtension("OES_element_index_uint");
		this.supports.uint32Indices = hasuint32;
		if (!hasuint32) console.warn("Provided WebGL context does not support 32 index buffer, complex graphics may not render correctly");
	};
	return ContextSystem;
}();
/**
* Internal framebuffer for WebGL context.
* @memberof PIXI
*/
var GLFramebuffer = function() {
	function GLFramebuffer(framebuffer) {
		this.framebuffer = framebuffer;
		this.stencil = null;
		this.dirtyId = -1;
		this.dirtyFormat = -1;
		this.dirtySize = -1;
		this.multisample = MSAA_QUALITY.NONE;
		this.msaaBuffer = null;
		this.blitFramebuffer = null;
		this.mipLevel = 0;
	}
	return GLFramebuffer;
}();
var tempRectangle = new Rectangle();
/**
* System plugin to the renderer to manage framebuffers.
* @memberof PIXI
*/
var FramebufferSystem = function() {
	/**
	* @param renderer - The renderer this System works for.
	*/
	function FramebufferSystem(renderer) {
		this.renderer = renderer;
		this.managedFramebuffers = [];
		this.unknownFramebuffer = new Framebuffer(10, 10);
		this.msaaSamples = null;
	}
	/** Sets up the renderer context and necessary buffers. */
	FramebufferSystem.prototype.contextChange = function() {
		this.disposeAll(true);
		var gl = this.gl = this.renderer.gl;
		this.CONTEXT_UID = this.renderer.CONTEXT_UID;
		this.current = this.unknownFramebuffer;
		this.viewport = new Rectangle();
		this.hasMRT = true;
		this.writeDepthTexture = true;
		if (this.renderer.context.webGLVersion === 1) {
			var nativeDrawBuffersExtension_1 = this.renderer.context.extensions.drawBuffers;
			var nativeDepthTextureExtension = this.renderer.context.extensions.depthTexture;
			if (settings.PREFER_ENV === ENV.WEBGL_LEGACY) {
				nativeDrawBuffersExtension_1 = null;
				nativeDepthTextureExtension = null;
			}
			if (nativeDrawBuffersExtension_1) gl.drawBuffers = function(activeTextures) {
				return nativeDrawBuffersExtension_1.drawBuffersWEBGL(activeTextures);
			};
			else {
				this.hasMRT = false;
				gl.drawBuffers = function() {};
			}
			if (!nativeDepthTextureExtension) this.writeDepthTexture = false;
		} else this.msaaSamples = gl.getInternalformatParameter(gl.RENDERBUFFER, gl.RGBA8, gl.SAMPLES);
	};
	/**
	* Bind a framebuffer.
	* @param framebuffer
	* @param frame - frame, default is framebuffer size
	* @param mipLevel - optional mip level to set on the framebuffer - defaults to 0
	*/
	FramebufferSystem.prototype.bind = function(framebuffer, frame, mipLevel) {
		if (mipLevel === void 0) mipLevel = 0;
		var gl = this.gl;
		if (framebuffer) {
			var fbo = framebuffer.glFramebuffers[this.CONTEXT_UID] || this.initFramebuffer(framebuffer);
			if (this.current !== framebuffer) {
				this.current = framebuffer;
				gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.framebuffer);
			}
			if (fbo.mipLevel !== mipLevel) {
				framebuffer.dirtyId++;
				framebuffer.dirtyFormat++;
				fbo.mipLevel = mipLevel;
			}
			if (fbo.dirtyId !== framebuffer.dirtyId) {
				fbo.dirtyId = framebuffer.dirtyId;
				if (fbo.dirtyFormat !== framebuffer.dirtyFormat) {
					fbo.dirtyFormat = framebuffer.dirtyFormat;
					fbo.dirtySize = framebuffer.dirtySize;
					this.updateFramebuffer(framebuffer, mipLevel);
				} else if (fbo.dirtySize !== framebuffer.dirtySize) {
					fbo.dirtySize = framebuffer.dirtySize;
					this.resizeFramebuffer(framebuffer);
				}
			}
			for (var i = 0; i < framebuffer.colorTextures.length; i++) {
				var tex = framebuffer.colorTextures[i];
				this.renderer.texture.unbind(tex.parentTextureArray || tex);
			}
			if (framebuffer.depthTexture) this.renderer.texture.unbind(framebuffer.depthTexture);
			if (frame) {
				var mipWidth = frame.width >> mipLevel;
				var mipHeight = frame.height >> mipLevel;
				var scale = mipWidth / frame.width;
				this.setViewport(frame.x * scale, frame.y * scale, mipWidth, mipHeight);
			} else {
				var mipWidth = framebuffer.width >> mipLevel;
				var mipHeight = framebuffer.height >> mipLevel;
				this.setViewport(0, 0, mipWidth, mipHeight);
			}
		} else {
			if (this.current) {
				this.current = null;
				gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			}
			if (frame) this.setViewport(frame.x, frame.y, frame.width, frame.height);
			else this.setViewport(0, 0, this.renderer.width, this.renderer.height);
		}
	};
	/**
	* Set the WebGLRenderingContext's viewport.
	* @param x - X position of viewport
	* @param y - Y position of viewport
	* @param width - Width of viewport
	* @param height - Height of viewport
	*/
	FramebufferSystem.prototype.setViewport = function(x, y, width, height) {
		var v = this.viewport;
		x = Math.round(x);
		y = Math.round(y);
		width = Math.round(width);
		height = Math.round(height);
		if (v.width !== width || v.height !== height || v.x !== x || v.y !== y) {
			v.x = x;
			v.y = y;
			v.width = width;
			v.height = height;
			this.gl.viewport(x, y, width, height);
		}
	};
	Object.defineProperty(FramebufferSystem.prototype, "size", {
		/**
		* Get the size of the current width and height. Returns object with `width` and `height` values.
		* @readonly
		*/
		get: function() {
			if (this.current) return {
				x: 0,
				y: 0,
				width: this.current.width,
				height: this.current.height
			};
			return {
				x: 0,
				y: 0,
				width: this.renderer.width,
				height: this.renderer.height
			};
		},
		enumerable: false,
		configurable: true
	});
	/**
	* Clear the color of the context
	* @param r - Red value from 0 to 1
	* @param g - Green value from 0 to 1
	* @param b - Blue value from 0 to 1
	* @param a - Alpha value from 0 to 1
	* @param {PIXI.BUFFER_BITS} [mask=BUFFER_BITS.COLOR | BUFFER_BITS.DEPTH] - Bitwise OR of masks
	*  that indicate the buffers to be cleared, by default COLOR and DEPTH buffers.
	*/
	FramebufferSystem.prototype.clear = function(r, g, b, a, mask) {
		if (mask === void 0) mask = BUFFER_BITS.COLOR | BUFFER_BITS.DEPTH;
		var gl = this.gl;
		gl.clearColor(r, g, b, a);
		gl.clear(mask);
	};
	/**
	* Initialize framebuffer for this context
	* @protected
	* @param framebuffer
	* @returns - created GLFramebuffer
	*/
	FramebufferSystem.prototype.initFramebuffer = function(framebuffer) {
		var gl = this.gl;
		var fbo = new GLFramebuffer(gl.createFramebuffer());
		fbo.multisample = this.detectSamples(framebuffer.multisample);
		framebuffer.glFramebuffers[this.CONTEXT_UID] = fbo;
		this.managedFramebuffers.push(framebuffer);
		framebuffer.disposeRunner.add(this);
		return fbo;
	};
	/**
	* Resize the framebuffer
	* @param framebuffer
	* @protected
	*/
	FramebufferSystem.prototype.resizeFramebuffer = function(framebuffer) {
		var gl = this.gl;
		var fbo = framebuffer.glFramebuffers[this.CONTEXT_UID];
		if (fbo.msaaBuffer) {
			gl.bindRenderbuffer(gl.RENDERBUFFER, fbo.msaaBuffer);
			gl.renderbufferStorageMultisample(gl.RENDERBUFFER, fbo.multisample, gl.RGBA8, framebuffer.width, framebuffer.height);
		}
		if (fbo.stencil) {
			gl.bindRenderbuffer(gl.RENDERBUFFER, fbo.stencil);
			if (fbo.msaaBuffer) gl.renderbufferStorageMultisample(gl.RENDERBUFFER, fbo.multisample, gl.DEPTH24_STENCIL8, framebuffer.width, framebuffer.height);
			else gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, framebuffer.width, framebuffer.height);
		}
		var colorTextures = framebuffer.colorTextures;
		var count = colorTextures.length;
		if (!gl.drawBuffers) count = Math.min(count, 1);
		for (var i = 0; i < count; i++) {
			var texture = colorTextures[i];
			var parentTexture = texture.parentTextureArray || texture;
			this.renderer.texture.bind(parentTexture, 0);
		}
		if (framebuffer.depthTexture && this.writeDepthTexture) this.renderer.texture.bind(framebuffer.depthTexture, 0);
	};
	/**
	* Update the framebuffer
	* @param framebuffer
	* @param mipLevel
	* @protected
	*/
	FramebufferSystem.prototype.updateFramebuffer = function(framebuffer, mipLevel) {
		var gl = this.gl;
		var fbo = framebuffer.glFramebuffers[this.CONTEXT_UID];
		var colorTextures = framebuffer.colorTextures;
		var count = colorTextures.length;
		if (!gl.drawBuffers) count = Math.min(count, 1);
		if (fbo.multisample > 1 && this.canMultisampleFramebuffer(framebuffer)) {
			fbo.msaaBuffer = fbo.msaaBuffer || gl.createRenderbuffer();
			gl.bindRenderbuffer(gl.RENDERBUFFER, fbo.msaaBuffer);
			gl.renderbufferStorageMultisample(gl.RENDERBUFFER, fbo.multisample, gl.RGBA8, framebuffer.width, framebuffer.height);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, fbo.msaaBuffer);
		} else if (fbo.msaaBuffer) {
			gl.deleteRenderbuffer(fbo.msaaBuffer);
			fbo.msaaBuffer = null;
			if (fbo.blitFramebuffer) {
				fbo.blitFramebuffer.dispose();
				fbo.blitFramebuffer = null;
			}
		}
		var activeTextures = [];
		for (var i = 0; i < count; i++) {
			var texture = colorTextures[i];
			var parentTexture = texture.parentTextureArray || texture;
			this.renderer.texture.bind(parentTexture, 0);
			if (i === 0 && fbo.msaaBuffer) continue;
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, texture.target, parentTexture._glTextures[this.CONTEXT_UID].texture, mipLevel);
			activeTextures.push(gl.COLOR_ATTACHMENT0 + i);
		}
		if (activeTextures.length > 1) gl.drawBuffers(activeTextures);
		if (framebuffer.depthTexture) {
			if (this.writeDepthTexture) {
				var depthTexture = framebuffer.depthTexture;
				this.renderer.texture.bind(depthTexture, 0);
				gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTexture._glTextures[this.CONTEXT_UID].texture, mipLevel);
			}
		}
		if ((framebuffer.stencil || framebuffer.depth) && !(framebuffer.depthTexture && this.writeDepthTexture)) {
			fbo.stencil = fbo.stencil || gl.createRenderbuffer();
			gl.bindRenderbuffer(gl.RENDERBUFFER, fbo.stencil);
			if (fbo.msaaBuffer) gl.renderbufferStorageMultisample(gl.RENDERBUFFER, fbo.multisample, gl.DEPTH24_STENCIL8, framebuffer.width, framebuffer.height);
			else gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, framebuffer.width, framebuffer.height);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, fbo.stencil);
		} else if (fbo.stencil) {
			gl.deleteRenderbuffer(fbo.stencil);
			fbo.stencil = null;
		}
	};
	/**
	* Returns true if the frame buffer can be multisampled.
	* @param framebuffer
	*/
	FramebufferSystem.prototype.canMultisampleFramebuffer = function(framebuffer) {
		return this.renderer.context.webGLVersion !== 1 && framebuffer.colorTextures.length <= 1 && !framebuffer.depthTexture;
	};
	/**
	* Detects number of samples that is not more than a param but as close to it as possible
	* @param samples - number of samples
	* @returns - recommended number of samples
	*/
	FramebufferSystem.prototype.detectSamples = function(samples) {
		var msaaSamples = this.msaaSamples;
		var res = MSAA_QUALITY.NONE;
		if (samples <= 1 || msaaSamples === null) return res;
		for (var i = 0; i < msaaSamples.length; i++) if (msaaSamples[i] <= samples) {
			res = msaaSamples[i];
			break;
		}
		if (res === 1) res = MSAA_QUALITY.NONE;
		return res;
	};
	/**
	* Only works with WebGL2
	*
	* blits framebuffer to another of the same or bigger size
	* after that target framebuffer is bound
	*
	* Fails with WebGL warning if blits multisample framebuffer to different size
	* @param framebuffer - by default it blits "into itself", from renderBuffer to texture.
	* @param sourcePixels - source rectangle in pixels
	* @param destPixels - dest rectangle in pixels, assumed to be the same as sourcePixels
	*/
	FramebufferSystem.prototype.blit = function(framebuffer, sourcePixels, destPixels) {
		var _a = this, current = _a.current, renderer = _a.renderer, gl = _a.gl, CONTEXT_UID = _a.CONTEXT_UID;
		if (renderer.context.webGLVersion !== 2) return;
		if (!current) return;
		var fbo = current.glFramebuffers[CONTEXT_UID];
		if (!fbo) return;
		if (!framebuffer) {
			if (!fbo.msaaBuffer) return;
			var colorTexture = current.colorTextures[0];
			if (!colorTexture) return;
			if (!fbo.blitFramebuffer) {
				fbo.blitFramebuffer = new Framebuffer(current.width, current.height);
				fbo.blitFramebuffer.addColorTexture(0, colorTexture);
			}
			framebuffer = fbo.blitFramebuffer;
			if (framebuffer.colorTextures[0] !== colorTexture) {
				framebuffer.colorTextures[0] = colorTexture;
				framebuffer.dirtyId++;
				framebuffer.dirtyFormat++;
			}
			if (framebuffer.width !== current.width || framebuffer.height !== current.height) {
				framebuffer.width = current.width;
				framebuffer.height = current.height;
				framebuffer.dirtyId++;
				framebuffer.dirtySize++;
			}
		}
		if (!sourcePixels) {
			sourcePixels = tempRectangle;
			sourcePixels.width = current.width;
			sourcePixels.height = current.height;
		}
		if (!destPixels) destPixels = sourcePixels;
		var sameSize = sourcePixels.width === destPixels.width && sourcePixels.height === destPixels.height;
		this.bind(framebuffer);
		gl.bindFramebuffer(gl.READ_FRAMEBUFFER, fbo.framebuffer);
		gl.blitFramebuffer(sourcePixels.left, sourcePixels.top, sourcePixels.right, sourcePixels.bottom, destPixels.left, destPixels.top, destPixels.right, destPixels.bottom, gl.COLOR_BUFFER_BIT, sameSize ? gl.NEAREST : gl.LINEAR);
	};
	/**
	* Disposes framebuffer.
	* @param framebuffer - framebuffer that has to be disposed of
	* @param contextLost - If context was lost, we suppress all delete function calls
	*/
	FramebufferSystem.prototype.disposeFramebuffer = function(framebuffer, contextLost) {
		var fbo = framebuffer.glFramebuffers[this.CONTEXT_UID];
		var gl = this.gl;
		if (!fbo) return;
		delete framebuffer.glFramebuffers[this.CONTEXT_UID];
		var index = this.managedFramebuffers.indexOf(framebuffer);
		if (index >= 0) this.managedFramebuffers.splice(index, 1);
		framebuffer.disposeRunner.remove(this);
		if (!contextLost) {
			gl.deleteFramebuffer(fbo.framebuffer);
			if (fbo.msaaBuffer) gl.deleteRenderbuffer(fbo.msaaBuffer);
			if (fbo.stencil) gl.deleteRenderbuffer(fbo.stencil);
		}
		if (fbo.blitFramebuffer) fbo.blitFramebuffer.dispose();
	};
	/**
	* Disposes all framebuffers, but not textures bound to them.
	* @param [contextLost=false] - If context was lost, we suppress all delete function calls
	*/
	FramebufferSystem.prototype.disposeAll = function(contextLost) {
		var list = this.managedFramebuffers;
		this.managedFramebuffers = [];
		for (var i = 0; i < list.length; i++) this.disposeFramebuffer(list[i], contextLost);
	};
	/**
	* Forcing creation of stencil buffer for current framebuffer, if it wasn't done before.
	* Used by MaskSystem, when its time to use stencil mask for Graphics element.
	*
	* Its an alternative for public lazy `framebuffer.enableStencil`, in case we need stencil without rebind.
	* @private
	*/
	FramebufferSystem.prototype.forceStencil = function() {
		var framebuffer = this.current;
		if (!framebuffer) return;
		var fbo = framebuffer.glFramebuffers[this.CONTEXT_UID];
		if (!fbo || fbo.stencil) return;
		framebuffer.stencil = true;
		var w = framebuffer.width;
		var h = framebuffer.height;
		var gl = this.gl;
		var stencil = gl.createRenderbuffer();
		gl.bindRenderbuffer(gl.RENDERBUFFER, stencil);
		if (fbo.msaaBuffer) gl.renderbufferStorageMultisample(gl.RENDERBUFFER, fbo.multisample, gl.DEPTH24_STENCIL8, w, h);
		else gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, w, h);
		fbo.stencil = stencil;
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, stencil);
	};
	/** Resets framebuffer stored state, binds screen framebuffer. Should be called before renderTexture reset(). */
	FramebufferSystem.prototype.reset = function() {
		this.current = this.unknownFramebuffer;
		this.viewport = new Rectangle();
	};
	FramebufferSystem.prototype.destroy = function() {
		this.renderer = null;
	};
	return FramebufferSystem;
}();
var byteSizeMap = {
	5126: 4,
	5123: 2,
	5121: 1
};
/**
* System plugin to the renderer to manage geometry.
* @memberof PIXI
*/
var GeometrySystem = function() {
	/** @param renderer - The renderer this System works for. */
	function GeometrySystem(renderer) {
		this.renderer = renderer;
		this._activeGeometry = null;
		this._activeVao = null;
		this.hasVao = true;
		this.hasInstance = true;
		this.canUseUInt32ElementIndex = false;
		this.managedGeometries = {};
	}
	/** Sets up the renderer context and necessary buffers. */
	GeometrySystem.prototype.contextChange = function() {
		this.disposeAll(true);
		var gl = this.gl = this.renderer.gl;
		var context = this.renderer.context;
		this.CONTEXT_UID = this.renderer.CONTEXT_UID;
		if (context.webGLVersion !== 2) {
			var nativeVaoExtension_1 = this.renderer.context.extensions.vertexArrayObject;
			if (settings.PREFER_ENV === ENV.WEBGL_LEGACY) nativeVaoExtension_1 = null;
			if (nativeVaoExtension_1) {
				gl.createVertexArray = function() {
					return nativeVaoExtension_1.createVertexArrayOES();
				};
				gl.bindVertexArray = function(vao) {
					return nativeVaoExtension_1.bindVertexArrayOES(vao);
				};
				gl.deleteVertexArray = function(vao) {
					return nativeVaoExtension_1.deleteVertexArrayOES(vao);
				};
			} else {
				this.hasVao = false;
				gl.createVertexArray = function() {
					return null;
				};
				gl.bindVertexArray = function() {
					return null;
				};
				gl.deleteVertexArray = function() {
					return null;
				};
			}
		}
		if (context.webGLVersion !== 2) {
			var instanceExt_1 = gl.getExtension("ANGLE_instanced_arrays");
			if (instanceExt_1) {
				gl.vertexAttribDivisor = function(a, b) {
					return instanceExt_1.vertexAttribDivisorANGLE(a, b);
				};
				gl.drawElementsInstanced = function(a, b, c, d, e) {
					return instanceExt_1.drawElementsInstancedANGLE(a, b, c, d, e);
				};
				gl.drawArraysInstanced = function(a, b, c, d) {
					return instanceExt_1.drawArraysInstancedANGLE(a, b, c, d);
				};
			} else this.hasInstance = false;
		}
		this.canUseUInt32ElementIndex = context.webGLVersion === 2 || !!context.extensions.uint32ElementIndex;
	};
	/**
	* Binds geometry so that is can be drawn. Creating a Vao if required
	* @param geometry - Instance of geometry to bind.
	* @param shader - Instance of shader to use vao for.
	*/
	GeometrySystem.prototype.bind = function(geometry, shader) {
		shader = shader || this.renderer.shader.shader;
		var gl = this.gl;
		var vaos = geometry.glVertexArrayObjects[this.CONTEXT_UID];
		var incRefCount = false;
		if (!vaos) {
			this.managedGeometries[geometry.id] = geometry;
			geometry.disposeRunner.add(this);
			geometry.glVertexArrayObjects[this.CONTEXT_UID] = vaos = {};
			incRefCount = true;
		}
		var vao = vaos[shader.program.id] || this.initGeometryVao(geometry, shader, incRefCount);
		this._activeGeometry = geometry;
		if (this._activeVao !== vao) {
			this._activeVao = vao;
			if (this.hasVao) gl.bindVertexArray(vao);
			else this.activateVao(geometry, shader.program);
		}
		this.updateBuffers();
	};
	/** Reset and unbind any active VAO and geometry. */
	GeometrySystem.prototype.reset = function() {
		this.unbind();
	};
	/** Update buffers of the currently bound geometry. */
	GeometrySystem.prototype.updateBuffers = function() {
		var geometry = this._activeGeometry;
		var bufferSystem = this.renderer.buffer;
		for (var i = 0; i < geometry.buffers.length; i++) {
			var buffer = geometry.buffers[i];
			bufferSystem.update(buffer);
		}
	};
	/**
	* Check compatibility between a geometry and a program
	* @param geometry - Geometry instance.
	* @param program - Program instance.
	*/
	GeometrySystem.prototype.checkCompatibility = function(geometry, program) {
		var geometryAttributes = geometry.attributes;
		for (var j in program.attributeData) if (!geometryAttributes[j]) throw new Error("shader and geometry incompatible, geometry missing the \"" + j + "\" attribute");
	};
	/**
	* Takes a geometry and program and generates a unique signature for them.
	* @param geometry - To get signature from.
	* @param program - To test geometry against.
	* @returns - Unique signature of the geometry and program
	*/
	GeometrySystem.prototype.getSignature = function(geometry, program) {
		var attribs = geometry.attributes;
		var shaderAttributes = program.attributeData;
		var strings = ["g", geometry.id];
		for (var i in attribs) if (shaderAttributes[i]) strings.push(i, shaderAttributes[i].location);
		return strings.join("-");
	};
	/**
	* Creates or gets Vao with the same structure as the geometry and stores it on the geometry.
	* If vao is created, it is bound automatically. We use a shader to infer what and how to set up the
	* attribute locations.
	* @param geometry - Instance of geometry to to generate Vao for.
	* @param shader - Instance of the shader.
	* @param incRefCount - Increment refCount of all geometry buffers.
	*/
	GeometrySystem.prototype.initGeometryVao = function(geometry, shader, incRefCount) {
		if (incRefCount === void 0) incRefCount = true;
		var gl = this.gl;
		var CONTEXT_UID = this.CONTEXT_UID;
		var bufferSystem = this.renderer.buffer;
		var program = shader.program;
		if (!program.glPrograms[CONTEXT_UID]) this.renderer.shader.generateProgram(shader);
		this.checkCompatibility(geometry, program);
		var signature = this.getSignature(geometry, program);
		var vaoObjectHash = geometry.glVertexArrayObjects[this.CONTEXT_UID];
		var vao = vaoObjectHash[signature];
		if (vao) {
			vaoObjectHash[program.id] = vao;
			return vao;
		}
		var buffers = geometry.buffers;
		var attributes = geometry.attributes;
		var tempStride = {};
		var tempStart = {};
		for (var j in buffers) {
			tempStride[j] = 0;
			tempStart[j] = 0;
		}
		for (var j in attributes) {
			if (!attributes[j].size && program.attributeData[j]) attributes[j].size = program.attributeData[j].size;
			else if (!attributes[j].size) console.warn("PIXI Geometry attribute '" + j + "' size cannot be determined (likely the bound shader does not have the attribute)");
			tempStride[attributes[j].buffer] += attributes[j].size * byteSizeMap[attributes[j].type];
		}
		for (var j in attributes) {
			var attribute = attributes[j];
			var attribSize = attribute.size;
			if (attribute.stride === void 0) {
				if (tempStride[attribute.buffer] === attribSize * byteSizeMap[attribute.type]) attribute.stride = 0;
				else attribute.stride = tempStride[attribute.buffer];
			}
			if (attribute.start === void 0) {
				attribute.start = tempStart[attribute.buffer];
				tempStart[attribute.buffer] += attribSize * byteSizeMap[attribute.type];
			}
		}
		vao = gl.createVertexArray();
		gl.bindVertexArray(vao);
		for (var i = 0; i < buffers.length; i++) {
			var buffer = buffers[i];
			bufferSystem.bind(buffer);
			if (incRefCount) buffer._glBuffers[CONTEXT_UID].refCount++;
		}
		this.activateVao(geometry, program);
		this._activeVao = vao;
		vaoObjectHash[program.id] = vao;
		vaoObjectHash[signature] = vao;
		return vao;
	};
	/**
	* Disposes geometry.
	* @param geometry - Geometry with buffers. Only VAO will be disposed
	* @param [contextLost=false] - If context was lost, we suppress deleteVertexArray
	*/
	GeometrySystem.prototype.disposeGeometry = function(geometry, contextLost) {
		var _a;
		if (!this.managedGeometries[geometry.id]) return;
		delete this.managedGeometries[geometry.id];
		var vaos = geometry.glVertexArrayObjects[this.CONTEXT_UID];
		var gl = this.gl;
		var buffers = geometry.buffers;
		var bufferSystem = (_a = this.renderer) === null || _a === void 0 ? void 0 : _a.buffer;
		geometry.disposeRunner.remove(this);
		if (!vaos) return;
		if (bufferSystem) for (var i = 0; i < buffers.length; i++) {
			var buf = buffers[i]._glBuffers[this.CONTEXT_UID];
			if (buf) {
				buf.refCount--;
				if (buf.refCount === 0 && !contextLost) bufferSystem.dispose(buffers[i], contextLost);
			}
		}
		if (!contextLost) {
			for (var vaoId in vaos) if (vaoId[0] === "g") {
				var vao = vaos[vaoId];
				if (this._activeVao === vao) this.unbind();
				gl.deleteVertexArray(vao);
			}
		}
		delete geometry.glVertexArrayObjects[this.CONTEXT_UID];
	};
	/**
	* Dispose all WebGL resources of all managed geometries.
	* @param [contextLost=false] - If context was lost, we suppress `gl.delete` calls
	*/
	GeometrySystem.prototype.disposeAll = function(contextLost) {
		var all = Object.keys(this.managedGeometries);
		for (var i = 0; i < all.length; i++) this.disposeGeometry(this.managedGeometries[all[i]], contextLost);
	};
	/**
	* Activate vertex array object.
	* @param geometry - Geometry instance.
	* @param program - Shader program instance.
	*/
	GeometrySystem.prototype.activateVao = function(geometry, program) {
		var gl = this.gl;
		var CONTEXT_UID = this.CONTEXT_UID;
		var bufferSystem = this.renderer.buffer;
		var buffers = geometry.buffers;
		var attributes = geometry.attributes;
		if (geometry.indexBuffer) bufferSystem.bind(geometry.indexBuffer);
		var lastBuffer = null;
		for (var j in attributes) {
			var attribute = attributes[j];
			var buffer = buffers[attribute.buffer];
			var glBuffer = buffer._glBuffers[CONTEXT_UID];
			if (program.attributeData[j]) {
				if (lastBuffer !== glBuffer) {
					bufferSystem.bind(buffer);
					lastBuffer = glBuffer;
				}
				var location = program.attributeData[j].location;
				gl.enableVertexAttribArray(location);
				gl.vertexAttribPointer(location, attribute.size, attribute.type || gl.FLOAT, attribute.normalized, attribute.stride, attribute.start);
				if (attribute.instance) {
					if (this.hasInstance) gl.vertexAttribDivisor(location, 1);
					else throw new Error("geometry error, GPU Instancing is not supported on this device");
				}
			}
		}
	};
	/**
	* Draws the currently bound geometry.
	* @param type - The type primitive to render.
	* @param size - The number of elements to be rendered. If not specified, all vertices after the
	*  starting vertex will be drawn.
	* @param start - The starting vertex in the geometry to start drawing from. If not specified,
	*  drawing will start from the first vertex.
	* @param instanceCount - The number of instances of the set of elements to execute. If not specified,
	*  all instances will be drawn.
	*/
	GeometrySystem.prototype.draw = function(type, size, start, instanceCount) {
		var gl = this.gl;
		var geometry = this._activeGeometry;
		if (geometry.indexBuffer) {
			var byteSize = geometry.indexBuffer.data.BYTES_PER_ELEMENT;
			var glType = byteSize === 2 ? gl.UNSIGNED_SHORT : gl.UNSIGNED_INT;
			if (byteSize === 2 || byteSize === 4 && this.canUseUInt32ElementIndex) {
				if (geometry.instanced) gl.drawElementsInstanced(type, size || geometry.indexBuffer.data.length, glType, (start || 0) * byteSize, instanceCount || 1);
				else gl.drawElements(type, size || geometry.indexBuffer.data.length, glType, (start || 0) * byteSize);
			} else console.warn("unsupported index buffer type: uint32");
		} else if (geometry.instanced) gl.drawArraysInstanced(type, start, size || geometry.getSize(), instanceCount || 1);
		else gl.drawArrays(type, start, size || geometry.getSize());
		return this;
	};
	/** Unbind/reset everything. */
	GeometrySystem.prototype.unbind = function() {
		this.gl.bindVertexArray(null);
		this._activeVao = null;
		this._activeGeometry = null;
	};
	GeometrySystem.prototype.destroy = function() {
		this.renderer = null;
	};
	return GeometrySystem;
}();
/**
* Component for masked elements.
*
* Holds mask mode and temporary data about current mask.
* @memberof PIXI
*/
var MaskData = function() {
	/**
	* Create MaskData
	* @param {PIXI.DisplayObject} [maskObject=null] - object that describes the mask
	*/
	function MaskData(maskObject) {
		if (maskObject === void 0) maskObject = null;
		this.type = MASK_TYPES.NONE;
		this.autoDetect = true;
		this.maskObject = maskObject || null;
		this.pooled = false;
		this.isMaskData = true;
		this.resolution = null;
		this.multisample = settings.FILTER_MULTISAMPLE;
		this.enabled = true;
		this.colorMask = 15;
		this._filters = null;
		this._stencilCounter = 0;
		this._scissorCounter = 0;
		this._scissorRect = null;
		this._scissorRectLocal = null;
		this._colorMask = 15;
		this._target = null;
	}
	Object.defineProperty(MaskData.prototype, "filter", {
		/**
		* The sprite mask filter.
		* If set to `null`, the default sprite mask filter is used.
		* @default null
		*/
		get: function() {
			return this._filters ? this._filters[0] : null;
		},
		set: function(value) {
			if (value) {
				if (this._filters) this._filters[0] = value;
				else this._filters = [value];
			} else this._filters = null;
		},
		enumerable: false,
		configurable: true
	});
	/** Resets the mask data after popMask(). */
	MaskData.prototype.reset = function() {
		if (this.pooled) {
			this.maskObject = null;
			this.type = MASK_TYPES.NONE;
			this.autoDetect = true;
		}
		this._target = null;
		this._scissorRectLocal = null;
	};
	/**
	* Copies counters from maskData above, called from pushMask().
	* @param maskAbove
	*/
	MaskData.prototype.copyCountersOrReset = function(maskAbove) {
		if (maskAbove) {
			this._stencilCounter = maskAbove._stencilCounter;
			this._scissorCounter = maskAbove._scissorCounter;
			this._scissorRect = maskAbove._scissorRect;
		} else {
			this._stencilCounter = 0;
			this._scissorCounter = 0;
			this._scissorRect = null;
		}
	};
	return MaskData;
}();
/**
* @private
* @param {WebGLRenderingContext} gl - The current WebGL context {WebGLProgram}
* @param {number} type - the type, can be either VERTEX_SHADER or FRAGMENT_SHADER
* @param {string} src - The vertex shader source as an array of strings.
* @returns {WebGLShader} the shader
*/
function compileShader(gl, type, src) {
	var shader = gl.createShader(type);
	gl.shaderSource(shader, src);
	gl.compileShader(shader);
	return shader;
}
/**
* will log a shader error highlighting the lines with the error
* also will add numbers along the side.
* @param gl - the WebGLContext
* @param shader - the shader to log errors for
*/
function logPrettyShaderError(gl, shader) {
	var shaderSrc = gl.getShaderSource(shader).split("\n").map(function(line, index) {
		return index + ": " + line;
	});
	var shaderLog = gl.getShaderInfoLog(shader);
	var splitShader = shaderLog.split("\n");
	var dedupe = {};
	var lineNumbers = splitShader.map(function(line) {
		return parseFloat(line.replace(/^ERROR\: 0\:([\d]+)\:.*$/, "$1"));
	}).filter(function(n) {
		if (n && !dedupe[n]) {
			dedupe[n] = true;
			return true;
		}
		return false;
	});
	var logArgs = [""];
	lineNumbers.forEach(function(number) {
		shaderSrc[number - 1] = "%c" + shaderSrc[number - 1] + "%c";
		logArgs.push("background: #FF0000; color:#FFFFFF; font-size: 10px", "font-size: 10px");
	});
	logArgs[0] = shaderSrc.join("\n");
	console.error(shaderLog);
	console.groupCollapsed("click to view full shader code");
	console.warn.apply(console, logArgs);
	console.groupEnd();
}
/**
*
* logs out any program errors
* @param gl - The current WebGL context
* @param program - the WebGL program to display errors for
* @param vertexShader  - the fragment WebGL shader program
* @param fragmentShader - the vertex WebGL shader program
*/
function logProgramError(gl, program, vertexShader, fragmentShader) {
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) logPrettyShaderError(gl, vertexShader);
		if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) logPrettyShaderError(gl, fragmentShader);
		console.error("PixiJS Error: Could not initialize shader.");
		if (gl.getProgramInfoLog(program) !== "") console.warn("PixiJS Warning: gl.getProgramInfoLog()", gl.getProgramInfoLog(program));
	}
}
function booleanArray(size) {
	var array = new Array(size);
	for (var i = 0; i < array.length; i++) array[i] = false;
	return array;
}
/**
* @method defaultValue
* @memberof PIXI.glCore.shader
* @param {string} type - Type of value
* @param {number} size
* @private
*/
function defaultValue(type, size) {
	switch (type) {
		case "float": return 0;
		case "vec2": return new Float32Array(2 * size);
		case "vec3": return new Float32Array(3 * size);
		case "vec4": return new Float32Array(4 * size);
		case "int":
		case "uint":
		case "sampler2D":
		case "sampler2DArray": return 0;
		case "ivec2": return new Int32Array(2 * size);
		case "ivec3": return new Int32Array(3 * size);
		case "ivec4": return new Int32Array(4 * size);
		case "uvec2": return new Uint32Array(2 * size);
		case "uvec3": return new Uint32Array(3 * size);
		case "uvec4": return new Uint32Array(4 * size);
		case "bool": return false;
		case "bvec2": return booleanArray(2 * size);
		case "bvec3": return booleanArray(3 * size);
		case "bvec4": return booleanArray(4 * size);
		case "mat2": return new Float32Array([
			1,
			0,
			0,
			1
		]);
		case "mat3": return new Float32Array([
			1,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			1
		]);
		case "mat4": return new Float32Array([
			1,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			1
		]);
	}
	return null;
}
var unknownContext = {};
var context = unknownContext;
/**
* returns a little WebGL context to use for program inspection.
* @static
* @private
* @returns {WebGLRenderingContext} a gl context to test with
*/
function getTestContext() {
	if (context === unknownContext || context && context.isContextLost()) {
		var canvas = settings.ADAPTER.createCanvas();
		var gl = void 0;
		if (settings.PREFER_ENV >= ENV.WEBGL2) gl = canvas.getContext("webgl2", {});
		if (!gl) {
			gl = canvas.getContext("webgl", {}) || canvas.getContext("experimental-webgl", {});
			if (!gl) gl = null;
			else gl.getExtension("WEBGL_draw_buffers");
		}
		context = gl;
	}
	return context;
}
var maxFragmentPrecision;
function getMaxFragmentPrecision() {
	if (!maxFragmentPrecision) {
		maxFragmentPrecision = PRECISION.MEDIUM;
		var gl = getTestContext();
		if (gl) {
			if (gl.getShaderPrecisionFormat) maxFragmentPrecision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT).precision ? PRECISION.HIGH : PRECISION.MEDIUM;
		}
	}
	return maxFragmentPrecision;
}
/**
* Sets the float precision on the shader, ensuring the device supports the request precision.
* If the precision is already present, it just ensures that the device is able to handle it.
* @private
* @param {string} src - The shader source
* @param {PIXI.PRECISION} requestedPrecision - The request float precision of the shader.
* @param {PIXI.PRECISION} maxSupportedPrecision - The maximum precision the shader supports.
* @returns {string} modified shader source
*/
function setPrecision(src, requestedPrecision, maxSupportedPrecision) {
	if (src.substring(0, 9) !== "precision") {
		var precision = requestedPrecision;
		if (requestedPrecision === PRECISION.HIGH && maxSupportedPrecision !== PRECISION.HIGH) precision = PRECISION.MEDIUM;
		return "precision " + precision + " float;\n" + src;
	} else if (maxSupportedPrecision !== PRECISION.HIGH && src.substring(0, 15) === "precision highp") return src.replace("precision highp", "precision mediump");
	return src;
}
var GLSL_TO_SIZE = {
	float: 1,
	vec2: 2,
	vec3: 3,
	vec4: 4,
	int: 1,
	ivec2: 2,
	ivec3: 3,
	ivec4: 4,
	uint: 1,
	uvec2: 2,
	uvec3: 3,
	uvec4: 4,
	bool: 1,
	bvec2: 2,
	bvec3: 3,
	bvec4: 4,
	mat2: 4,
	mat3: 9,
	mat4: 16,
	sampler2D: 1
};
/**
* @private
* @method mapSize
* @memberof PIXI.glCore.shader
* @param {string} type
*/
function mapSize(type) {
	return GLSL_TO_SIZE[type];
}
var GL_TABLE = null;
var GL_TO_GLSL_TYPES = {
	FLOAT: "float",
	FLOAT_VEC2: "vec2",
	FLOAT_VEC3: "vec3",
	FLOAT_VEC4: "vec4",
	INT: "int",
	INT_VEC2: "ivec2",
	INT_VEC3: "ivec3",
	INT_VEC4: "ivec4",
	UNSIGNED_INT: "uint",
	UNSIGNED_INT_VEC2: "uvec2",
	UNSIGNED_INT_VEC3: "uvec3",
	UNSIGNED_INT_VEC4: "uvec4",
	BOOL: "bool",
	BOOL_VEC2: "bvec2",
	BOOL_VEC3: "bvec3",
	BOOL_VEC4: "bvec4",
	FLOAT_MAT2: "mat2",
	FLOAT_MAT3: "mat3",
	FLOAT_MAT4: "mat4",
	SAMPLER_2D: "sampler2D",
	INT_SAMPLER_2D: "sampler2D",
	UNSIGNED_INT_SAMPLER_2D: "sampler2D",
	SAMPLER_CUBE: "samplerCube",
	INT_SAMPLER_CUBE: "samplerCube",
	UNSIGNED_INT_SAMPLER_CUBE: "samplerCube",
	SAMPLER_2D_ARRAY: "sampler2DArray",
	INT_SAMPLER_2D_ARRAY: "sampler2DArray",
	UNSIGNED_INT_SAMPLER_2D_ARRAY: "sampler2DArray"
};
function mapType(gl, type) {
	if (!GL_TABLE) {
		var typeNames = Object.keys(GL_TO_GLSL_TYPES);
		GL_TABLE = {};
		for (var i = 0; i < typeNames.length; ++i) {
			var tn = typeNames[i];
			GL_TABLE[gl[tn]] = GL_TO_GLSL_TYPES[tn];
		}
	}
	return GL_TABLE[type];
}
var uniformParsers = [
	{
		test: function(data) {
			return data.type === "float" && data.size === 1 && !data.isArray;
		},
		code: function(name) {
			return "\n            if(uv[\"" + name + "\"] !== ud[\"" + name + "\"].value)\n            {\n                ud[\"" + name + "\"].value = uv[\"" + name + "\"]\n                gl.uniform1f(ud[\"" + name + "\"].location, uv[\"" + name + "\"])\n            }\n            ";
		}
	},
	{
		test: function(data, uniform) {
			return (data.type === "sampler2D" || data.type === "samplerCube" || data.type === "sampler2DArray") && data.size === 1 && !data.isArray && (uniform == null || uniform.castToBaseTexture !== void 0);
		},
		code: function(name) {
			return "t = syncData.textureCount++;\n\n            renderer.texture.bind(uv[\"" + name + "\"], t);\n\n            if(ud[\"" + name + "\"].value !== t)\n            {\n                ud[\"" + name + "\"].value = t;\n                gl.uniform1i(ud[\"" + name + "\"].location, t);\n; // eslint-disable-line max-len\n            }";
		}
	},
	{
		test: function(data, uniform) {
			return data.type === "mat3" && data.size === 1 && !data.isArray && uniform.a !== void 0;
		},
		code: function(name) {
			return "\n            gl.uniformMatrix3fv(ud[\"" + name + "\"].location, false, uv[\"" + name + "\"].toArray(true));\n            ";
		},
		codeUbo: function(name) {
			return "\n                var " + name + "_matrix = uv." + name + ".toArray(true);\n\n                data[offset] = " + name + "_matrix[0];\n                data[offset+1] = " + name + "_matrix[1];\n                data[offset+2] = " + name + "_matrix[2];\n        \n                data[offset + 4] = " + name + "_matrix[3];\n                data[offset + 5] = " + name + "_matrix[4];\n                data[offset + 6] = " + name + "_matrix[5];\n        \n                data[offset + 8] = " + name + "_matrix[6];\n                data[offset + 9] = " + name + "_matrix[7];\n                data[offset + 10] = " + name + "_matrix[8];\n            ";
		}
	},
	{
		test: function(data, uniform) {
			return data.type === "vec2" && data.size === 1 && !data.isArray && uniform.x !== void 0;
		},
		code: function(name) {
			return "\n                cv = ud[\"" + name + "\"].value;\n                v = uv[\"" + name + "\"];\n\n                if(cv[0] !== v.x || cv[1] !== v.y)\n                {\n                    cv[0] = v.x;\n                    cv[1] = v.y;\n                    gl.uniform2f(ud[\"" + name + "\"].location, v.x, v.y);\n                }";
		},
		codeUbo: function(name) {
			return "\n                v = uv." + name + ";\n\n                data[offset] = v.x;\n                data[offset+1] = v.y;\n            ";
		}
	},
	{
		test: function(data) {
			return data.type === "vec2" && data.size === 1 && !data.isArray;
		},
		code: function(name) {
			return "\n                cv = ud[\"" + name + "\"].value;\n                v = uv[\"" + name + "\"];\n\n                if(cv[0] !== v[0] || cv[1] !== v[1])\n                {\n                    cv[0] = v[0];\n                    cv[1] = v[1];\n                    gl.uniform2f(ud[\"" + name + "\"].location, v[0], v[1]);\n                }\n            ";
		}
	},
	{
		test: function(data, uniform) {
			return data.type === "vec4" && data.size === 1 && !data.isArray && uniform.width !== void 0;
		},
		code: function(name) {
			return "\n                cv = ud[\"" + name + "\"].value;\n                v = uv[\"" + name + "\"];\n\n                if(cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height)\n                {\n                    cv[0] = v.x;\n                    cv[1] = v.y;\n                    cv[2] = v.width;\n                    cv[3] = v.height;\n                    gl.uniform4f(ud[\"" + name + "\"].location, v.x, v.y, v.width, v.height)\n                }";
		},
		codeUbo: function(name) {
			return "\n                    v = uv." + name + ";\n\n                    data[offset] = v.x;\n                    data[offset+1] = v.y;\n                    data[offset+2] = v.width;\n                    data[offset+3] = v.height;\n                ";
		}
	},
	{
		test: function(data) {
			return data.type === "vec4" && data.size === 1 && !data.isArray;
		},
		code: function(name) {
			return "\n                cv = ud[\"" + name + "\"].value;\n                v = uv[\"" + name + "\"];\n\n                if(cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])\n                {\n                    cv[0] = v[0];\n                    cv[1] = v[1];\n                    cv[2] = v[2];\n                    cv[3] = v[3];\n\n                    gl.uniform4f(ud[\"" + name + "\"].location, v[0], v[1], v[2], v[3])\n                }";
		}
	}
];
var GLSL_TO_SINGLE_SETTERS_CACHED = {
	float: "\n    if (cv !== v)\n    {\n        cu.value = v;\n        gl.uniform1f(location, v);\n    }",
	vec2: "\n    if (cv[0] !== v[0] || cv[1] !== v[1])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n\n        gl.uniform2f(location, v[0], v[1])\n    }",
	vec3: "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n\n        gl.uniform3f(location, v[0], v[1], v[2])\n    }",
	vec4: "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n        cv[3] = v[3];\n\n        gl.uniform4f(location, v[0], v[1], v[2], v[3]);\n    }",
	int: "\n    if (cv !== v)\n    {\n        cu.value = v;\n\n        gl.uniform1i(location, v);\n    }",
	ivec2: "\n    if (cv[0] !== v[0] || cv[1] !== v[1])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n\n        gl.uniform2i(location, v[0], v[1]);\n    }",
	ivec3: "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n\n        gl.uniform3i(location, v[0], v[1], v[2]);\n    }",
	ivec4: "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n        cv[3] = v[3];\n\n        gl.uniform4i(location, v[0], v[1], v[2], v[3]);\n    }",
	uint: "\n    if (cv !== v)\n    {\n        cu.value = v;\n\n        gl.uniform1ui(location, v);\n    }",
	uvec2: "\n    if (cv[0] !== v[0] || cv[1] !== v[1])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n\n        gl.uniform2ui(location, v[0], v[1]);\n    }",
	uvec3: "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n\n        gl.uniform3ui(location, v[0], v[1], v[2]);\n    }",
	uvec4: "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n        cv[3] = v[3];\n\n        gl.uniform4ui(location, v[0], v[1], v[2], v[3]);\n    }",
	bool: "\n    if (cv !== v)\n    {\n        cu.value = v;\n        gl.uniform1i(location, v);\n    }",
	bvec2: "\n    if (cv[0] != v[0] || cv[1] != v[1])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n\n        gl.uniform2i(location, v[0], v[1]);\n    }",
	bvec3: "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n\n        gl.uniform3i(location, v[0], v[1], v[2]);\n    }",
	bvec4: "\n    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n        cv[3] = v[3];\n\n        gl.uniform4i(location, v[0], v[1], v[2], v[3]);\n    }",
	mat2: "gl.uniformMatrix2fv(location, false, v)",
	mat3: "gl.uniformMatrix3fv(location, false, v)",
	mat4: "gl.uniformMatrix4fv(location, false, v)",
	sampler2D: "\n    if (cv !== v)\n    {\n        cu.value = v;\n\n        gl.uniform1i(location, v);\n    }",
	samplerCube: "\n    if (cv !== v)\n    {\n        cu.value = v;\n\n        gl.uniform1i(location, v);\n    }",
	sampler2DArray: "\n    if (cv !== v)\n    {\n        cu.value = v;\n\n        gl.uniform1i(location, v);\n    }"
};
var GLSL_TO_ARRAY_SETTERS = {
	float: "gl.uniform1fv(location, v)",
	vec2: "gl.uniform2fv(location, v)",
	vec3: "gl.uniform3fv(location, v)",
	vec4: "gl.uniform4fv(location, v)",
	mat4: "gl.uniformMatrix4fv(location, false, v)",
	mat3: "gl.uniformMatrix3fv(location, false, v)",
	mat2: "gl.uniformMatrix2fv(location, false, v)",
	int: "gl.uniform1iv(location, v)",
	ivec2: "gl.uniform2iv(location, v)",
	ivec3: "gl.uniform3iv(location, v)",
	ivec4: "gl.uniform4iv(location, v)",
	uint: "gl.uniform1uiv(location, v)",
	uvec2: "gl.uniform2uiv(location, v)",
	uvec3: "gl.uniform3uiv(location, v)",
	uvec4: "gl.uniform4uiv(location, v)",
	bool: "gl.uniform1iv(location, v)",
	bvec2: "gl.uniform2iv(location, v)",
	bvec3: "gl.uniform3iv(location, v)",
	bvec4: "gl.uniform4iv(location, v)",
	sampler2D: "gl.uniform1iv(location, v)",
	samplerCube: "gl.uniform1iv(location, v)",
	sampler2DArray: "gl.uniform1iv(location, v)"
};
function generateUniformsSync(group, uniformData) {
	var _a;
	var funcFragments = ["\n        var v = null;\n        var cv = null;\n        var cu = null;\n        var t = 0;\n        var gl = renderer.gl;\n    "];
	for (var i in group.uniforms) {
		var data = uniformData[i];
		if (!data) {
			if ((_a = group.uniforms[i]) === null || _a === void 0 ? void 0 : _a.group) {
				if (group.uniforms[i].ubo) funcFragments.push("\n                        renderer.shader.syncUniformBufferGroup(uv." + i + ", '" + i + "');\n                    ");
				else funcFragments.push("\n                        renderer.shader.syncUniformGroup(uv." + i + ", syncData);\n                    ");
			}
			continue;
		}
		var uniform = group.uniforms[i];
		var parsed = false;
		for (var j = 0; j < uniformParsers.length; j++) if (uniformParsers[j].test(data, uniform)) {
			funcFragments.push(uniformParsers[j].code(i, uniform));
			parsed = true;
			break;
		}
		if (!parsed) {
			var template = (data.size === 1 && !data.isArray ? GLSL_TO_SINGLE_SETTERS_CACHED : GLSL_TO_ARRAY_SETTERS)[data.type].replace("location", "ud[\"" + i + "\"].location");
			funcFragments.push("\n            cu = ud[\"" + i + "\"];\n            cv = cu.value;\n            v = uv[\"" + i + "\"];\n            " + template + ";");
		}
	}
	return new Function("ud", "uv", "renderer", "syncData", funcFragments.join("\n"));
}
var fragTemplate = [
	"precision mediump float;",
	"void main(void){",
	"float test = 0.1;",
	"%forloop%",
	"gl_FragColor = vec4(0.0);",
	"}"
].join("\n");
function generateIfTestSrc(maxIfs) {
	var src = "";
	for (var i = 0; i < maxIfs; ++i) {
		if (i > 0) src += "\nelse ";
		if (i < maxIfs - 1) src += "if(test == " + i + ".0){}";
	}
	return src;
}
function checkMaxIfStatementsInShader(maxIfs, gl) {
	if (maxIfs === 0) throw new Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");
	var shader = gl.createShader(gl.FRAGMENT_SHADER);
	while (true) {
		var fragmentSrc = fragTemplate.replace(/%forloop%/gi, generateIfTestSrc(maxIfs));
		gl.shaderSource(shader, fragmentSrc);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) maxIfs = maxIfs / 2 | 0;
		else break;
	}
	return maxIfs;
}
var unsafeEval;
/**
* Not all platforms allow to generate function code (e.g., `new Function`).
* this provides the platform-level detection.
* @private
* @returns {boolean} `true` if `new Function` is supported.
*/
function unsafeEvalSupported() {
	if (typeof unsafeEval === "boolean") return unsafeEval;
	try {
		unsafeEval = new Function("param1", "param2", "param3", "return param1[param2] === param3;")({ a: "b" }, "a", "b") === true;
	} catch (e) {
		unsafeEval = false;
	}
	return unsafeEval;
}
var defaultFragment$2 = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n   gl_FragColor *= texture2D(uSampler, vTextureCoord);\n}";
var defaultVertex$3 = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n   vTextureCoord = aTextureCoord;\n}\n";
var UID$1 = 0;
var nameCache = {};
/**
* Helper class to create a shader program.
* @memberof PIXI
*/
var Program = function() {
	/**
	* @param vertexSrc - The source of the vertex shader.
	* @param fragmentSrc - The source of the fragment shader.
	* @param name - Name for shader
	*/
	function Program(vertexSrc, fragmentSrc, name) {
		if (name === void 0) name = "pixi-shader";
		this.id = UID$1++;
		this.vertexSrc = vertexSrc || Program.defaultVertexSrc;
		this.fragmentSrc = fragmentSrc || Program.defaultFragmentSrc;
		this.vertexSrc = this.vertexSrc.trim();
		this.fragmentSrc = this.fragmentSrc.trim();
		if (this.vertexSrc.substring(0, 8) !== "#version") {
			name = name.replace(/\s+/g, "-");
			if (nameCache[name]) {
				nameCache[name]++;
				name += "-" + nameCache[name];
			} else nameCache[name] = 1;
			this.vertexSrc = "#define SHADER_NAME " + name + "\n" + this.vertexSrc;
			this.fragmentSrc = "#define SHADER_NAME " + name + "\n" + this.fragmentSrc;
			this.vertexSrc = setPrecision(this.vertexSrc, settings.PRECISION_VERTEX, PRECISION.HIGH);
			this.fragmentSrc = setPrecision(this.fragmentSrc, settings.PRECISION_FRAGMENT, getMaxFragmentPrecision());
		}
		this.glPrograms = {};
		this.syncUniforms = null;
	}
	Object.defineProperty(Program, "defaultVertexSrc", {
		/**
		* The default vertex shader source.
		* @constant
		*/
		get: function() {
			return defaultVertex$3;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Program, "defaultFragmentSrc", {
		/**
		* The default fragment shader source.
		* @constant
		*/
		get: function() {
			return defaultFragment$2;
		},
		enumerable: false,
		configurable: true
	});
	/**
	* A short hand function to create a program based of a vertex and fragment shader.
	*
	* This method will also check to see if there is a cached program.
	* @param vertexSrc - The source of the vertex shader.
	* @param fragmentSrc - The source of the fragment shader.
	* @param name - Name for shader
	* @returns A shiny new PixiJS shader program!
	*/
	Program.from = function(vertexSrc, fragmentSrc, name) {
		var key = vertexSrc + fragmentSrc;
		var program = ProgramCache[key];
		if (!program) ProgramCache[key] = program = new Program(vertexSrc, fragmentSrc, name);
		return program;
	};
	return Program;
}();
/**
* A helper class for shaders.
* @memberof PIXI
*/
var Shader = function() {
	/**
	* @param program - The program the shader will use.
	* @param uniforms - Custom uniforms to use to augment the built-in ones.
	*/
	function Shader(program, uniforms) {
		/**
		* Used internally to bind uniform buffer objects.
		* @ignore
		*/
		this.uniformBindCount = 0;
		this.program = program;
		if (uniforms) {
			if (uniforms instanceof UniformGroup) this.uniformGroup = uniforms;
			else this.uniformGroup = new UniformGroup(uniforms);
		} else this.uniformGroup = new UniformGroup({});
		this.disposeRunner = new Runner("disposeShader");
	}
	Shader.prototype.checkUniformExists = function(name, group) {
		if (group.uniforms[name]) return true;
		for (var i in group.uniforms) {
			var uniform = group.uniforms[i];
			if (uniform.group) {
				if (this.checkUniformExists(name, uniform)) return true;
			}
		}
		return false;
	};
	Shader.prototype.destroy = function() {
		this.uniformGroup = null;
		this.disposeRunner.emit(this);
		this.disposeRunner.destroy();
	};
	Object.defineProperty(Shader.prototype, "uniforms", {
		/**
		* Shader uniform values, shortcut for `uniformGroup.uniforms`.
		* @readonly
		*/
		get: function() {
			return this.uniformGroup.uniforms;
		},
		enumerable: false,
		configurable: true
	});
	/**
	* A short hand function to create a shader based of a vertex and fragment shader.
	* @param vertexSrc - The source of the vertex shader.
	* @param fragmentSrc - The source of the fragment shader.
	* @param uniforms - Custom uniforms to use to augment the built-in ones.
	* @returns A shiny new PixiJS shader!
	*/
	Shader.from = function(vertexSrc, fragmentSrc, uniforms) {
		return new Shader(Program.from(vertexSrc, fragmentSrc), uniforms);
	};
	return Shader;
}();
var BLEND$1 = 0;
var OFFSET$1 = 1;
var CULLING$1 = 2;
var DEPTH_TEST$1 = 3;
var WINDING$1 = 4;
var DEPTH_MASK$1 = 5;
/**
* This is a WebGL state, and is is passed to {@link PIXI.StateSystem}.
*
* Each mesh rendered may require WebGL to be in a different state.
* For example you may want different blend mode or to enable polygon offsets
* @memberof PIXI
*/
var State = function() {
	function State() {
		this.data = 0;
		this.blendMode = BLEND_MODES.NORMAL;
		this.polygonOffset = 0;
		this.blend = true;
		this.depthMask = true;
	}
	Object.defineProperty(State.prototype, "blend", {
		/**
		* Activates blending of the computed fragment color values.
		* @default true
		*/
		get: function() {
			return !!(this.data & 1 << BLEND$1);
		},
		set: function(value) {
			if (!!(this.data & 1 << BLEND$1) !== value) this.data ^= 1 << BLEND$1;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(State.prototype, "offsets", {
		/**
		* Activates adding an offset to depth values of polygon's fragments
		* @default false
		*/
		get: function() {
			return !!(this.data & 1 << OFFSET$1);
		},
		set: function(value) {
			if (!!(this.data & 1 << OFFSET$1) !== value) this.data ^= 1 << OFFSET$1;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(State.prototype, "culling", {
		/**
		* Activates culling of polygons.
		* @default false
		*/
		get: function() {
			return !!(this.data & 1 << CULLING$1);
		},
		set: function(value) {
			if (!!(this.data & 1 << CULLING$1) !== value) this.data ^= 1 << CULLING$1;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(State.prototype, "depthTest", {
		/**
		* Activates depth comparisons and updates to the depth buffer.
		* @default false
		*/
		get: function() {
			return !!(this.data & 1 << DEPTH_TEST$1);
		},
		set: function(value) {
			if (!!(this.data & 1 << DEPTH_TEST$1) !== value) this.data ^= 1 << DEPTH_TEST$1;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(State.prototype, "depthMask", {
		/**
		* Enables or disables writing to the depth buffer.
		* @default true
		*/
		get: function() {
			return !!(this.data & 1 << DEPTH_MASK$1);
		},
		set: function(value) {
			if (!!(this.data & 1 << DEPTH_MASK$1) !== value) this.data ^= 1 << DEPTH_MASK$1;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(State.prototype, "clockwiseFrontFace", {
		/**
		* Specifies whether or not front or back-facing polygons can be culled.
		* @default false
		*/
		get: function() {
			return !!(this.data & 1 << WINDING$1);
		},
		set: function(value) {
			if (!!(this.data & 1 << WINDING$1) !== value) this.data ^= 1 << WINDING$1;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(State.prototype, "blendMode", {
		/**
		* The blend mode to be applied when this state is set. Apply a value of `PIXI.BLEND_MODES.NORMAL` to reset the blend mode.
		* Setting this mode to anything other than NO_BLEND will automatically switch blending on.
		* @default PIXI.BLEND_MODES.NORMAL
		*/
		get: function() {
			return this._blendMode;
		},
		set: function(value) {
			this.blend = value !== BLEND_MODES.NONE;
			this._blendMode = value;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(State.prototype, "polygonOffset", {
		/**
		* The polygon offset. Setting this property to anything other than 0 will automatically enable polygon offset fill.
		* @default 0
		*/
		get: function() {
			return this._polygonOffset;
		},
		set: function(value) {
			this.offsets = !!value;
			this._polygonOffset = value;
		},
		enumerable: false,
		configurable: true
	});
	State.prototype.toString = function() {
		return "[@pixi/core:State " + ("blendMode=" + this.blendMode + " ") + ("clockwiseFrontFace=" + this.clockwiseFrontFace + " ") + ("culling=" + this.culling + " ") + ("depthMask=" + this.depthMask + " ") + ("polygonOffset=" + this.polygonOffset) + "]";
	};
	State.for2d = function() {
		var state = new State();
		state.depthTest = false;
		state.blend = true;
		return state;
	};
	return State;
}();
var defaultFragment$1 = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n   gl_FragColor = texture2D(uSampler, vTextureCoord);\n}\n";
var defaultVertex$2 = "attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n    gl_Position = filterVertexPosition();\n    vTextureCoord = filterTextureCoord();\n}\n";
/**
* A filter is a special shader that applies post-processing effects to an input texture and writes into an output
* render-target.
*
* {@link http://pixijs.io/examples/#/filters/blur-filter.js Example} of the
* {@link PIXI.filters.BlurFilter BlurFilter}.
*
* ### Usage
* Filters can be applied to any DisplayObject or Container.
* PixiJS' `FilterSystem` renders the container into temporary Framebuffer,
* then filter renders it to the screen.
* Multiple filters can be added to the `filters` array property and stacked on each other.
*
* ```
* const filter = new PIXI.Filter(myShaderVert, myShaderFrag, { myUniform: 0.5 });
* const container = new PIXI.Container();
* container.filters = [filter];
* ```
*
* ### Previous Version Differences
*
* In PixiJS **v3**, a filter was always applied to _whole screen_.
*
* In PixiJS **v4**, a filter can be applied _only part of the screen_.
* Developers had to create a set of uniforms to deal with coordinates.
*
* In PixiJS **v5** combines _both approaches_.
* Developers can use normal coordinates of v3 and then allow filter to use partial Framebuffers,
* bringing those extra uniforms into account.
*
* Also be aware that we have changed default vertex shader, please consult
* {@link https://github.com/pixijs/pixi.js/wiki/v5-Creating-filters Wiki}.
*
* ### Frames
*
* The following table summarizes the coordinate spaces used in the filtering pipeline:
*
* <table>
* <thead>
*   <tr>
*     <th>Coordinate Space</th>
*     <th>Description</th>
*   </tr>
* </thead>
* <tbody>
*   <tr>
*     <td>Texture Coordinates</td>
*     <td>
*         The texture (or UV) coordinates in the input base-texture's space. These are normalized into the (0,1) range along
*         both axes.
*     </td>
*   </tr>
*   <tr>
*     <td>World Space</td>
*     <td>
*         A point in the same space as the world bounds of any display-object (i.e. in the scene graph's space).
*     </td>
*   </tr>
*   <tr>
*     <td>Physical Pixels</td>
*     <td>
*         This is base-texture's space with the origin on the top-left. You can calculate these by multiplying the texture
*         coordinates by the dimensions of the texture.
*     </td>
*   </tr>
* </tbody>
* </table>
*
* ### Built-in Uniforms
*
* PixiJS viewport uses screen (CSS) coordinates, `(0, 0, renderer.screen.width, renderer.screen.height)`,
* and `projectionMatrix` uniform maps it to the gl viewport.
*
* **uSampler**
*
* The most important uniform is the input texture that container was rendered into.
* _Important note: as with all Framebuffers in PixiJS, both input and output are
* premultiplied by alpha._
*
* By default, input normalized coordinates are passed to fragment shader with `vTextureCoord`.
* Use it to sample the input.
*
* ```
* const fragment = `
* varying vec2 vTextureCoord;
* uniform sampler2D uSampler;
* void main(void)
* {
*    gl_FragColor = texture2D(uSampler, vTextureCoord);
* }
* `;
*
* const myFilter = new PIXI.Filter(null, fragment);
* ```
*
* This filter is just one uniform less than {@link PIXI.filters.AlphaFilter AlphaFilter}.
*
* **outputFrame**
*
* The `outputFrame` holds the rectangle where filter is applied in screen (CSS) coordinates.
* It's the same as `renderer.screen` for a fullscreen filter.
* Only a part of  `outputFrame.zw` size of temporary Framebuffer is used,
* `(0, 0, outputFrame.width, outputFrame.height)`,
*
* Filters uses this quad to normalized (0-1) space, its passed into `aVertexPosition` attribute.
* To calculate vertex position in screen space using normalized (0-1) space:
*
* ```
* vec4 filterVertexPosition( void )
* {
*     vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;
*     return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
* }
* ```
*
* **inputSize**
*
* Temporary framebuffer is different, it can be either the size of screen, either power-of-two.
* The `inputSize.xy` are size of temporary framebuffer that holds input.
* The `inputSize.zw` is inverted, it's a shortcut to evade division inside the shader.
*
* Set `inputSize.xy = outputFrame.zw` for a fullscreen filter.
*
* To calculate input normalized coordinate, you have to map it to filter normalized space.
* Multiply by `outputFrame.zw` to get input coordinate.
* Divide by `inputSize.xy` to get input normalized coordinate.
*
* ```
* vec2 filterTextureCoord( void )
* {
*     return aVertexPosition * (outputFrame.zw * inputSize.zw); // same as /inputSize.xy
* }
* ```
* **resolution**
*
* The `resolution` is the ratio of screen (CSS) pixels to real pixels.
*
* **inputPixel**
*
* `inputPixel.xy` is the size of framebuffer in real pixels, same as `inputSize.xy * resolution`
* `inputPixel.zw` is inverted `inputPixel.xy`.
*
* It's handy for filters that use neighbour pixels, like {@link PIXI.filters.FXAAFilter FXAAFilter}.
*
* **inputClamp**
*
* If you try to get info from outside of used part of Framebuffer - you'll get undefined behaviour.
* For displacements, coordinates has to be clamped.
*
* The `inputClamp.xy` is left-top pixel center, you may ignore it, because we use left-top part of Framebuffer
* `inputClamp.zw` is bottom-right pixel center.
*
* ```
* vec4 color = texture2D(uSampler, clamp(modifiedTextureCoord, inputClamp.xy, inputClamp.zw))
* ```
* OR
* ```
* vec4 color = texture2D(uSampler, min(modifigedTextureCoord, inputClamp.zw))
* ```
*
* ### Additional Information
*
* Complete documentation on Filter usage is located in the
* {@link https://github.com/pixijs/pixi.js/wiki/v5-Creating-filters Wiki}.
*
* Since PixiJS only had a handful of built-in filters, additional filters can be downloaded
* {@link https://github.com/pixijs/pixi-filters here} from the PixiJS Filters repository.
* @memberof PIXI
*/
var Filter = function(_super) {
	__extends$1(Filter, _super);
	/**
	* @param vertexSrc - The source of the vertex shader.
	* @param fragmentSrc - The source of the fragment shader.
	* @param uniforms - Custom uniforms to use to augment the built-in ones.
	*/
	function Filter(vertexSrc, fragmentSrc, uniforms) {
		var _this = this;
		var program = Program.from(vertexSrc || Filter.defaultVertexSrc, fragmentSrc || Filter.defaultFragmentSrc);
		_this = _super.call(this, program, uniforms) || this;
		_this.padding = 0;
		_this.resolution = settings.FILTER_RESOLUTION;
		_this.multisample = settings.FILTER_MULTISAMPLE;
		_this.enabled = true;
		_this.autoFit = true;
		_this.state = new State();
		return _this;
	}
	/**
	* Applies the filter
	* @param {PIXI.FilterSystem} filterManager - The renderer to retrieve the filter from
	* @param {PIXI.RenderTexture} input - The input render target.
	* @param {PIXI.RenderTexture} output - The target to output to.
	* @param {PIXI.CLEAR_MODES} [clearMode] - Should the output be cleared before rendering to it.
	* @param {object} [_currentState] - It's current state of filter.
	*        There are some useful properties in the currentState :
	*        target, filters, sourceFrame, destinationFrame, renderTarget, resolution
	*/
	Filter.prototype.apply = function(filterManager, input, output, clearMode, _currentState) {
		filterManager.applyFilter(this, input, output, clearMode);
	};
	Object.defineProperty(Filter.prototype, "blendMode", {
		/**
		* Sets the blend mode of the filter.
		* @default PIXI.BLEND_MODES.NORMAL
		*/
		get: function() {
			return this.state.blendMode;
		},
		set: function(value) {
			this.state.blendMode = value;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Filter.prototype, "resolution", {
		/**
		* The resolution of the filter. Setting this to be lower will lower the quality but
		* increase the performance of the filter.
		*/
		get: function() {
			return this._resolution;
		},
		set: function(value) {
			this._resolution = value;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Filter, "defaultVertexSrc", {
		/**
		* The default vertex shader source
		* @constant
		*/
		get: function() {
			return defaultVertex$2;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Filter, "defaultFragmentSrc", {
		/**
		* The default fragment shader source
		* @constant
		*/
		get: function() {
			return defaultFragment$1;
		},
		enumerable: false,
		configurable: true
	});
	return Filter;
}(Shader);
var vertex = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 otherMatrix;\n\nvarying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vMaskCoord = ( otherMatrix * vec3( aTextureCoord, 1.0)  ).xy;\n}\n";
var fragment = "varying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform sampler2D mask;\nuniform float alpha;\nuniform float npmAlpha;\nuniform vec4 maskClamp;\n\nvoid main(void)\n{\n    float clip = step(3.5,\n        step(maskClamp.x, vMaskCoord.x) +\n        step(maskClamp.y, vMaskCoord.y) +\n        step(vMaskCoord.x, maskClamp.z) +\n        step(vMaskCoord.y, maskClamp.w));\n\n    vec4 original = texture2D(uSampler, vTextureCoord);\n    vec4 masky = texture2D(mask, vMaskCoord);\n    float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);\n\n    original *= (alphaMul * masky.r * alpha * clip);\n\n    gl_FragColor = original;\n}\n";
var tempMat = new Matrix();
/**
* Class controls uv mapping from Texture normal space to BaseTexture normal space.
*
* Takes `trim` and `rotate` into account. May contain clamp settings for Meshes and TilingSprite.
*
* Can be used in Texture `uvMatrix` field, or separately, you can use different clamp settings on the same texture.
* If you want to add support for texture region of certain feature or filter, that's what you're looking for.
*
* Takes track of Texture changes through `_lastTextureID` private field.
* Use `update()` method call to track it from outside.
* @see PIXI.Texture
* @see PIXI.Mesh
* @see PIXI.TilingSprite
* @memberof PIXI
*/
var TextureMatrix = function() {
	/**
	* @param texture - observed texture
	* @param clampMargin - Changes frame clamping, 0.5 by default. Use -0.5 for extra border.
	*/
	function TextureMatrix(texture, clampMargin) {
		this._texture = texture;
		this.mapCoord = new Matrix();
		this.uClampFrame = /* @__PURE__ */ new Float32Array(4);
		this.uClampOffset = /* @__PURE__ */ new Float32Array(2);
		this._textureID = -1;
		this._updateID = 0;
		this.clampOffset = 0;
		this.clampMargin = typeof clampMargin === "undefined" ? .5 : clampMargin;
		this.isSimple = false;
	}
	Object.defineProperty(TextureMatrix.prototype, "texture", {
		/** Texture property. */
		get: function() {
			return this._texture;
		},
		set: function(value) {
			this._texture = value;
			this._textureID = -1;
		},
		enumerable: false,
		configurable: true
	});
	/**
	* Multiplies uvs array to transform
	* @param uvs - mesh uvs
	* @param [out=uvs] - output
	* @returns - output
	*/
	TextureMatrix.prototype.multiplyUvs = function(uvs, out) {
		if (out === void 0) out = uvs;
		var mat = this.mapCoord;
		for (var i = 0; i < uvs.length; i += 2) {
			var x = uvs[i];
			var y = uvs[i + 1];
			out[i] = x * mat.a + y * mat.c + mat.tx;
			out[i + 1] = x * mat.b + y * mat.d + mat.ty;
		}
		return out;
	};
	/**
	* Updates matrices if texture was changed.
	* @param [forceUpdate=false] - if true, matrices will be updated any case
	* @returns - Whether or not it was updated
	*/
	TextureMatrix.prototype.update = function(forceUpdate) {
		var tex = this._texture;
		if (!tex || !tex.valid) return false;
		if (!forceUpdate && this._textureID === tex._updateID) return false;
		this._textureID = tex._updateID;
		this._updateID++;
		var uvs = tex._uvs;
		this.mapCoord.set(uvs.x1 - uvs.x0, uvs.y1 - uvs.y0, uvs.x3 - uvs.x0, uvs.y3 - uvs.y0, uvs.x0, uvs.y0);
		var orig = tex.orig;
		var trim = tex.trim;
		if (trim) {
			tempMat.set(orig.width / trim.width, 0, 0, orig.height / trim.height, -trim.x / trim.width, -trim.y / trim.height);
			this.mapCoord.append(tempMat);
		}
		var texBase = tex.baseTexture;
		var frame = this.uClampFrame;
		var margin = this.clampMargin / texBase.resolution;
		var offset = this.clampOffset;
		frame[0] = (tex._frame.x + margin + offset) / texBase.width;
		frame[1] = (tex._frame.y + margin + offset) / texBase.height;
		frame[2] = (tex._frame.x + tex._frame.width - margin + offset) / texBase.width;
		frame[3] = (tex._frame.y + tex._frame.height - margin + offset) / texBase.height;
		this.uClampOffset[0] = offset / texBase.realWidth;
		this.uClampOffset[1] = offset / texBase.realHeight;
		this.isSimple = tex._frame.width === texBase.width && tex._frame.height === texBase.height && tex.rotate === 0;
		return true;
	};
	return TextureMatrix;
}();
/**
* This handles a Sprite acting as a mask, as opposed to a Graphic.
*
* WebGL only.
* @memberof PIXI
*/
var SpriteMaskFilter = function(_super) {
	__extends$1(SpriteMaskFilter, _super);
	/** @ignore */
	function SpriteMaskFilter(vertexSrc, fragmentSrc, uniforms) {
		var _this = this;
		var sprite = null;
		if (typeof vertexSrc !== "string" && fragmentSrc === void 0 && uniforms === void 0) {
			sprite = vertexSrc;
			vertexSrc = void 0;
			fragmentSrc = void 0;
			uniforms = void 0;
		}
		_this = _super.call(this, vertexSrc || vertex, fragmentSrc || fragment, uniforms) || this;
		_this.maskSprite = sprite;
		_this.maskMatrix = new Matrix();
		return _this;
	}
	Object.defineProperty(SpriteMaskFilter.prototype, "maskSprite", {
		/**
		* Sprite mask
		* @type {PIXI.DisplayObject}
		*/
		get: function() {
			return this._maskSprite;
		},
		set: function(value) {
			this._maskSprite = value;
			if (this._maskSprite) this._maskSprite.renderable = false;
		},
		enumerable: false,
		configurable: true
	});
	/**
	* Applies the filter
	* @param filterManager - The renderer to retrieve the filter from
	* @param input - The input render target.
	* @param output - The target to output to.
	* @param clearMode - Should the output be cleared before rendering to it.
	*/
	SpriteMaskFilter.prototype.apply = function(filterManager, input, output, clearMode) {
		var maskSprite = this._maskSprite;
		var tex = maskSprite._texture;
		if (!tex.valid) return;
		if (!tex.uvMatrix) tex.uvMatrix = new TextureMatrix(tex, 0);
		tex.uvMatrix.update();
		this.uniforms.npmAlpha = tex.baseTexture.alphaMode ? 0 : 1;
		this.uniforms.mask = tex;
		this.uniforms.otherMatrix = filterManager.calculateSpriteMatrix(this.maskMatrix, maskSprite).prepend(tex.uvMatrix.mapCoord);
		this.uniforms.alpha = maskSprite.worldAlpha;
		this.uniforms.maskClamp = tex.uvMatrix.uClampFrame;
		filterManager.applyFilter(this, input, output, clearMode);
	};
	return SpriteMaskFilter;
}(Filter);
/**
* System plugin to the renderer to manage masks.
*
* There are three built-in types of masking:
* **Scissor Masking**: Scissor masking discards pixels that are outside of a rectangle called the scissor box. It is
*  the most performant as the scissor test is inexpensive. However, it can only be used when the mask is rectangular.
* **Stencil Masking**: Stencil masking discards pixels that don't overlap with the pixels rendered into the stencil
*  buffer. It is the next fastest option as it does not require rendering into a separate framebuffer. However, it does
*  cause the mask to be rendered **twice** for each masking operation; hence, minimize the rendering cost of your masks.
* **Sprite Mask Filtering**: Sprite mask filtering discards pixels based on the red channel of the sprite-mask's
*  texture. (Generally, the masking texture is grayscale). Using advanced techniques, you might be able to embed this
*  type of masking in a custom shader - and hence, bypassing the masking system fully for performance wins.
*
* The best type of masking is auto-detected when you `push` one. To use scissor masking, you must pass in a `Graphics`
* object with just a rectangle drawn.
*
* ## Mask Stacks
*
* In the scene graph, masks can be applied recursively, i.e. a mask can be applied during a masking operation. The mask
* stack stores the currently applied masks in order. Each {@link PIXI.BaseRenderTexture} holds its own mask stack, i.e.
* when you switch render-textures, the old masks only applied when you switch back to rendering to the old render-target.
* @memberof PIXI
*/
var MaskSystem = function() {
	/**
	* @param renderer - The renderer this System works for.
	*/
	function MaskSystem(renderer) {
		this.renderer = renderer;
		this.enableScissor = true;
		this.alphaMaskPool = [];
		this.maskDataPool = [];
		this.maskStack = [];
		this.alphaMaskIndex = 0;
	}
	/**
	* Changes the mask stack that is used by this System.
	* @param maskStack - The mask stack
	*/
	MaskSystem.prototype.setMaskStack = function(maskStack) {
		this.maskStack = maskStack;
		this.renderer.scissor.setMaskStack(maskStack);
		this.renderer.stencil.setMaskStack(maskStack);
	};
	/**
	* Enables the mask and appends it to the current mask stack.
	*
	* NOTE: The batch renderer should be flushed beforehand to prevent pending renders from being masked.
	* @param {PIXI.DisplayObject} target - Display Object to push the mask to
	* @param {PIXI.MaskData|PIXI.Sprite|PIXI.Graphics|PIXI.DisplayObject} maskDataOrTarget - The masking data.
	*/
	MaskSystem.prototype.push = function(target, maskDataOrTarget) {
		var maskData = maskDataOrTarget;
		if (!maskData.isMaskData) {
			var d = this.maskDataPool.pop() || new MaskData();
			d.pooled = true;
			d.maskObject = maskDataOrTarget;
			maskData = d;
		}
		var maskAbove = this.maskStack.length !== 0 ? this.maskStack[this.maskStack.length - 1] : null;
		maskData.copyCountersOrReset(maskAbove);
		maskData._colorMask = maskAbove ? maskAbove._colorMask : 15;
		if (maskData.autoDetect) this.detect(maskData);
		maskData._target = target;
		if (maskData.type !== MASK_TYPES.SPRITE) this.maskStack.push(maskData);
		if (maskData.enabled) switch (maskData.type) {
			case MASK_TYPES.SCISSOR:
				this.renderer.scissor.push(maskData);
				break;
			case MASK_TYPES.STENCIL:
				this.renderer.stencil.push(maskData);
				break;
			case MASK_TYPES.SPRITE:
				maskData.copyCountersOrReset(null);
				this.pushSpriteMask(maskData);
				break;
			case MASK_TYPES.COLOR: this.pushColorMask(maskData);
		}
		if (maskData.type === MASK_TYPES.SPRITE) this.maskStack.push(maskData);
	};
	/**
	* Removes the last mask from the mask stack and doesn't return it.
	*
	* NOTE: The batch renderer should be flushed beforehand to render the masked contents before the mask is removed.
	* @param {PIXI.IMaskTarget} target - Display Object to pop the mask from
	*/
	MaskSystem.prototype.pop = function(target) {
		var maskData = this.maskStack.pop();
		if (!maskData || maskData._target !== target) return;
		if (maskData.enabled) switch (maskData.type) {
			case MASK_TYPES.SCISSOR:
				this.renderer.scissor.pop(maskData);
				break;
			case MASK_TYPES.STENCIL:
				this.renderer.stencil.pop(maskData.maskObject);
				break;
			case MASK_TYPES.SPRITE:
				this.popSpriteMask(maskData);
				break;
			case MASK_TYPES.COLOR: this.popColorMask(maskData);
		}
		maskData.reset();
		if (maskData.pooled) this.maskDataPool.push(maskData);
		if (this.maskStack.length !== 0) {
			var maskCurrent = this.maskStack[this.maskStack.length - 1];
			if (maskCurrent.type === MASK_TYPES.SPRITE && maskCurrent._filters) maskCurrent._filters[0].maskSprite = maskCurrent.maskObject;
		}
	};
	/**
	* Sets type of MaskData based on its maskObject.
	* @param maskData
	*/
	MaskSystem.prototype.detect = function(maskData) {
		var maskObject = maskData.maskObject;
		if (!maskObject) maskData.type = MASK_TYPES.COLOR;
		else if (maskObject.isSprite) maskData.type = MASK_TYPES.SPRITE;
		else if (this.enableScissor && this.renderer.scissor.testScissor(maskData)) maskData.type = MASK_TYPES.SCISSOR;
		else maskData.type = MASK_TYPES.STENCIL;
	};
	/**
	* Applies the Mask and adds it to the current filter stack.
	* @param maskData - Sprite to be used as the mask.
	*/
	MaskSystem.prototype.pushSpriteMask = function(maskData) {
		var _a, _b;
		var maskObject = maskData.maskObject;
		var target = maskData._target;
		var alphaMaskFilter = maskData._filters;
		if (!alphaMaskFilter) {
			alphaMaskFilter = this.alphaMaskPool[this.alphaMaskIndex];
			if (!alphaMaskFilter) alphaMaskFilter = this.alphaMaskPool[this.alphaMaskIndex] = [new SpriteMaskFilter()];
		}
		var renderer = this.renderer;
		var renderTextureSystem = renderer.renderTexture;
		var resolution;
		var multisample;
		if (renderTextureSystem.current) {
			var renderTexture = renderTextureSystem.current;
			resolution = maskData.resolution || renderTexture.resolution;
			multisample = (_a = maskData.multisample) !== null && _a !== void 0 ? _a : renderTexture.multisample;
		} else {
			resolution = maskData.resolution || renderer.resolution;
			multisample = (_b = maskData.multisample) !== null && _b !== void 0 ? _b : renderer.multisample;
		}
		alphaMaskFilter[0].resolution = resolution;
		alphaMaskFilter[0].multisample = multisample;
		alphaMaskFilter[0].maskSprite = maskObject;
		var stashFilterArea = target.filterArea;
		target.filterArea = maskObject.getBounds(true);
		renderer.filter.push(target, alphaMaskFilter);
		target.filterArea = stashFilterArea;
		if (!maskData._filters) this.alphaMaskIndex++;
	};
	/**
	* Removes the last filter from the filter stack and doesn't return it.
	* @param maskData - Sprite to be used as the mask.
	*/
	MaskSystem.prototype.popSpriteMask = function(maskData) {
		this.renderer.filter.pop();
		if (maskData._filters) maskData._filters[0].maskSprite = null;
		else {
			this.alphaMaskIndex--;
			this.alphaMaskPool[this.alphaMaskIndex][0].maskSprite = null;
		}
	};
	/**
	* Pushes the color mask.
	* @param maskData - The mask data
	*/
	MaskSystem.prototype.pushColorMask = function(maskData) {
		var currColorMask = maskData._colorMask;
		var nextColorMask = maskData._colorMask = currColorMask & maskData.colorMask;
		if (nextColorMask !== currColorMask) this.renderer.gl.colorMask((nextColorMask & 1) !== 0, (nextColorMask & 2) !== 0, (nextColorMask & 4) !== 0, (nextColorMask & 8) !== 0);
	};
	/**
	* Pops the color mask.
	* @param maskData - The mask data
	*/
	MaskSystem.prototype.popColorMask = function(maskData) {
		var currColorMask = maskData._colorMask;
		var nextColorMask = this.maskStack.length > 0 ? this.maskStack[this.maskStack.length - 1]._colorMask : 15;
		if (nextColorMask !== currColorMask) this.renderer.gl.colorMask((nextColorMask & 1) !== 0, (nextColorMask & 2) !== 0, (nextColorMask & 4) !== 0, (nextColorMask & 8) !== 0);
	};
	MaskSystem.prototype.destroy = function() {
		this.renderer = null;
	};
	return MaskSystem;
}();
/**
* System plugin to the renderer to manage specific types of masking operations.
* @memberof PIXI
*/
var AbstractMaskSystem = function() {
	/**
	* @param renderer - The renderer this System works for.
	*/
	function AbstractMaskSystem(renderer) {
		this.renderer = renderer;
		this.maskStack = [];
		this.glConst = 0;
	}
	/** Gets count of masks of certain type. */
	AbstractMaskSystem.prototype.getStackLength = function() {
		return this.maskStack.length;
	};
	/**
	* Changes the mask stack that is used by this System.
	* @param {PIXI.MaskData[]} maskStack - The mask stack
	*/
	AbstractMaskSystem.prototype.setMaskStack = function(maskStack) {
		var gl = this.renderer.gl;
		var curStackLen = this.getStackLength();
		this.maskStack = maskStack;
		var newStackLen = this.getStackLength();
		if (newStackLen !== curStackLen) {
			if (newStackLen === 0) gl.disable(this.glConst);
			else {
				gl.enable(this.glConst);
				this._useCurrent();
			}
		}
	};
	/**
	* Setup renderer to use the current mask data.
	* @private
	*/
	AbstractMaskSystem.prototype._useCurrent = function() {};
	/** Destroys the mask stack. */
	AbstractMaskSystem.prototype.destroy = function() {
		this.renderer = null;
		this.maskStack = null;
	};
	return AbstractMaskSystem;
}();
var tempMatrix$1 = new Matrix();
var rectPool = [];
/**
* System plugin to the renderer to manage scissor masking.
*
* Scissor masking discards pixels outside of a rectangle called the scissor box. The scissor box is in the framebuffer
* viewport's space; however, the mask's rectangle is projected from world-space to viewport space automatically
* by this system.
* @memberof PIXI
*/
var ScissorSystem = function(_super) {
	__extends$1(ScissorSystem, _super);
	/**
	* @param {PIXI.Renderer} renderer - The renderer this System works for.
	*/
	function ScissorSystem(renderer) {
		var _this = _super.call(this, renderer) || this;
		_this.glConst = settings.ADAPTER.getWebGLRenderingContext().SCISSOR_TEST;
		return _this;
	}
	ScissorSystem.prototype.getStackLength = function() {
		var maskData = this.maskStack[this.maskStack.length - 1];
		if (maskData) return maskData._scissorCounter;
		return 0;
	};
	/**
	* evaluates _boundsTransformed, _scissorRect for MaskData
	* @param maskData
	*/
	ScissorSystem.prototype.calcScissorRect = function(maskData) {
		var _a;
		if (maskData._scissorRectLocal) return;
		var prevData = maskData._scissorRect;
		var maskObject = maskData.maskObject;
		var renderer = this.renderer;
		var renderTextureSystem = renderer.renderTexture;
		var rect = maskObject.getBounds(true, (_a = rectPool.pop()) !== null && _a !== void 0 ? _a : new Rectangle());
		this.roundFrameToPixels(rect, renderTextureSystem.current ? renderTextureSystem.current.resolution : renderer.resolution, renderTextureSystem.sourceFrame, renderTextureSystem.destinationFrame, renderer.projection.transform);
		if (prevData) rect.fit(prevData);
		maskData._scissorRectLocal = rect;
	};
	ScissorSystem.isMatrixRotated = function(matrix) {
		if (!matrix) return false;
		var a = matrix.a, b = matrix.b, c = matrix.c, d = matrix.d;
		return (Math.abs(b) > 1e-4 || Math.abs(c) > 1e-4) && (Math.abs(a) > 1e-4 || Math.abs(d) > 1e-4);
	};
	/**
	* Test, whether the object can be scissor mask with current renderer projection.
	* Calls "calcScissorRect()" if its true.
	* @param maskData - mask data
	* @returns whether Whether the object can be scissor mask
	*/
	ScissorSystem.prototype.testScissor = function(maskData) {
		var maskObject = maskData.maskObject;
		if (!maskObject.isFastRect || !maskObject.isFastRect()) return false;
		if (ScissorSystem.isMatrixRotated(maskObject.worldTransform)) return false;
		if (ScissorSystem.isMatrixRotated(this.renderer.projection.transform)) return false;
		this.calcScissorRect(maskData);
		var rect = maskData._scissorRectLocal;
		return rect.width > 0 && rect.height > 0;
	};
	ScissorSystem.prototype.roundFrameToPixels = function(frame, resolution, bindingSourceFrame, bindingDestinationFrame, transform) {
		if (ScissorSystem.isMatrixRotated(transform)) return;
		transform = transform ? tempMatrix$1.copyFrom(transform) : tempMatrix$1.identity();
		transform.translate(-bindingSourceFrame.x, -bindingSourceFrame.y).scale(bindingDestinationFrame.width / bindingSourceFrame.width, bindingDestinationFrame.height / bindingSourceFrame.height).translate(bindingDestinationFrame.x, bindingDestinationFrame.y);
		this.renderer.filter.transformAABB(transform, frame);
		frame.fit(bindingDestinationFrame);
		frame.x = Math.round(frame.x * resolution);
		frame.y = Math.round(frame.y * resolution);
		frame.width = Math.round(frame.width * resolution);
		frame.height = Math.round(frame.height * resolution);
	};
	/**
	* Applies the Mask and adds it to the current stencil stack.
	* @author alvin
	* @param maskData - The mask data.
	*/
	ScissorSystem.prototype.push = function(maskData) {
		if (!maskData._scissorRectLocal) this.calcScissorRect(maskData);
		var gl = this.renderer.gl;
		if (!maskData._scissorRect) gl.enable(gl.SCISSOR_TEST);
		maskData._scissorCounter++;
		maskData._scissorRect = maskData._scissorRectLocal;
		this._useCurrent();
	};
	/**
	* This should be called after a mask is popped off the mask stack. It will rebind the scissor box to be latest with the
	* last mask in the stack.
	*
	* This can also be called when you directly modify the scissor box and want to restore PixiJS state.
	* @param maskData - The mask data.
	*/
	ScissorSystem.prototype.pop = function(maskData) {
		var gl = this.renderer.gl;
		if (maskData) rectPool.push(maskData._scissorRectLocal);
		if (this.getStackLength() > 0) this._useCurrent();
		else gl.disable(gl.SCISSOR_TEST);
	};
	/**
	* Setup renderer to use the current scissor data.
	* @private
	*/
	ScissorSystem.prototype._useCurrent = function() {
		var rect = this.maskStack[this.maskStack.length - 1]._scissorRect;
		var y;
		if (this.renderer.renderTexture.current) y = rect.y;
		else y = this.renderer.height - rect.height - rect.y;
		this.renderer.gl.scissor(rect.x, y, rect.width, rect.height);
	};
	return ScissorSystem;
}(AbstractMaskSystem);
/**
* System plugin to the renderer to manage stencils (used for masks).
* @memberof PIXI
*/
var StencilSystem = function(_super) {
	__extends$1(StencilSystem, _super);
	/**
	* @param renderer - The renderer this System works for.
	*/
	function StencilSystem(renderer) {
		var _this = _super.call(this, renderer) || this;
		_this.glConst = settings.ADAPTER.getWebGLRenderingContext().STENCIL_TEST;
		return _this;
	}
	StencilSystem.prototype.getStackLength = function() {
		var maskData = this.maskStack[this.maskStack.length - 1];
		if (maskData) return maskData._stencilCounter;
		return 0;
	};
	/**
	* Applies the Mask and adds it to the current stencil stack.
	* @param maskData - The mask data
	*/
	StencilSystem.prototype.push = function(maskData) {
		var maskObject = maskData.maskObject;
		var gl = this.renderer.gl;
		var prevMaskCount = maskData._stencilCounter;
		if (prevMaskCount === 0) {
			this.renderer.framebuffer.forceStencil();
			gl.clearStencil(0);
			gl.clear(gl.STENCIL_BUFFER_BIT);
			gl.enable(gl.STENCIL_TEST);
		}
		maskData._stencilCounter++;
		var colorMask = maskData._colorMask;
		if (colorMask !== 0) {
			maskData._colorMask = 0;
			gl.colorMask(false, false, false, false);
		}
		gl.stencilFunc(gl.EQUAL, prevMaskCount, 4294967295);
		gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
		maskObject.renderable = true;
		maskObject.render(this.renderer);
		this.renderer.batch.flush();
		maskObject.renderable = false;
		if (colorMask !== 0) {
			maskData._colorMask = colorMask;
			gl.colorMask((colorMask & 1) !== 0, (colorMask & 2) !== 0, (colorMask & 4) !== 0, (colorMask & 8) !== 0);
		}
		this._useCurrent();
	};
	/**
	* Pops stencil mask. MaskData is already removed from stack
	* @param {PIXI.DisplayObject} maskObject - object of popped mask data
	*/
	StencilSystem.prototype.pop = function(maskObject) {
		var gl = this.renderer.gl;
		if (this.getStackLength() === 0) gl.disable(gl.STENCIL_TEST);
		else {
			var maskData = this.maskStack.length !== 0 ? this.maskStack[this.maskStack.length - 1] : null;
			var colorMask = maskData ? maskData._colorMask : 15;
			if (colorMask !== 0) {
				maskData._colorMask = 0;
				gl.colorMask(false, false, false, false);
			}
			gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);
			maskObject.renderable = true;
			maskObject.render(this.renderer);
			this.renderer.batch.flush();
			maskObject.renderable = false;
			if (colorMask !== 0) {
				maskData._colorMask = colorMask;
				gl.colorMask((colorMask & 1) !== 0, (colorMask & 2) !== 0, (colorMask & 4) !== 0, (colorMask & 8) !== 0);
			}
			this._useCurrent();
		}
	};
	/**
	* Setup renderer to use the current stencil data.
	* @private
	*/
	StencilSystem.prototype._useCurrent = function() {
		var gl = this.renderer.gl;
		gl.stencilFunc(gl.EQUAL, this.getStackLength(), 4294967295);
		gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
	};
	return StencilSystem;
}(AbstractMaskSystem);
/**
* System plugin to the renderer to manage the projection matrix.
*
* The `projectionMatrix` is a global uniform provided to all shaders. It is used to transform points in world space to
* normalized device coordinates.
* @memberof PIXI
*/
var ProjectionSystem = function() {
	/** @param renderer - The renderer this System works for. */
	function ProjectionSystem(renderer) {
		this.renderer = renderer;
		this.destinationFrame = null;
		this.sourceFrame = null;
		this.defaultFrame = null;
		this.projectionMatrix = new Matrix();
		this.transform = null;
	}
	/**
	* Updates the projection-matrix based on the sourceFrame → destinationFrame mapping provided.
	*
	* NOTE: It is expected you call `renderer.framebuffer.setViewport(destinationFrame)` after this. This is because
	* the framebuffer viewport converts shader vertex output in normalized device coordinates to window coordinates.
	*
	* NOTE-2: {@link RenderTextureSystem#bind} updates the projection-matrix when you bind a render-texture. It is expected
	* that you dirty the current bindings when calling this manually.
	* @param destinationFrame - The rectangle in the render-target to render the contents into. If rendering to the canvas,
	*  the origin is on the top-left; if rendering to a render-texture, the origin is on the bottom-left.
	* @param sourceFrame - The rectangle in world space that contains the contents being rendered.
	* @param resolution - The resolution of the render-target, which is the ratio of
	*  world-space (or CSS) pixels to physical pixels.
	* @param root - Whether the render-target is the screen. This is required because rendering to textures
	*  is y-flipped (i.e. upside down relative to the screen).
	*/
	ProjectionSystem.prototype.update = function(destinationFrame, sourceFrame, resolution, root) {
		this.destinationFrame = destinationFrame || this.destinationFrame || this.defaultFrame;
		this.sourceFrame = sourceFrame || this.sourceFrame || destinationFrame;
		this.calculateProjection(this.destinationFrame, this.sourceFrame, resolution, root);
		if (this.transform) this.projectionMatrix.append(this.transform);
		var renderer = this.renderer;
		renderer.globalUniforms.uniforms.projectionMatrix = this.projectionMatrix;
		renderer.globalUniforms.update();
		if (renderer.shader.shader) renderer.shader.syncUniformGroup(renderer.shader.shader.uniforms.globals);
	};
	/**
	* Calculates the `projectionMatrix` to map points inside `sourceFrame` to inside `destinationFrame`.
	* @param _destinationFrame - The destination frame in the render-target.
	* @param sourceFrame - The source frame in world space.
	* @param _resolution - The render-target's resolution, i.e. ratio of CSS to physical pixels.
	* @param root - Whether rendering into the screen. Otherwise, if rendering to a framebuffer, the projection
	*  is y-flipped.
	*/
	ProjectionSystem.prototype.calculateProjection = function(_destinationFrame, sourceFrame, _resolution, root) {
		var pm = this.projectionMatrix;
		var sign = !root ? 1 : -1;
		pm.identity();
		pm.a = 1 / sourceFrame.width * 2;
		pm.d = sign * (1 / sourceFrame.height * 2);
		pm.tx = -1 - sourceFrame.x * pm.a;
		pm.ty = -sign - sourceFrame.y * pm.d;
	};
	/**
	* Sets the transform of the active render target to the given matrix.
	* @param _matrix - The transformation matrix
	*/
	ProjectionSystem.prototype.setTransform = function(_matrix) {};
	ProjectionSystem.prototype.destroy = function() {
		this.renderer = null;
	};
	return ProjectionSystem;
}();
var tempRect = new Rectangle();
var tempRect2 = new Rectangle();
/**
* System plugin to the renderer to manage render textures.
*
* Should be added after FramebufferSystem
*
* ### Frames
*
* The `RenderTextureSystem` holds a sourceFrame → destinationFrame projection. The following table explains the different
* coordinate spaces used:
*
* | Frame                  | Description                                                      | Coordinate System                                       |
* | ---------------------- | ---------------------------------------------------------------- | ------------------------------------------------------- |
* | sourceFrame            | The rectangle inside of which display-objects are being rendered | **World Space**: The origin on the top-left             |
* | destinationFrame       | The rectangle in the render-target (canvas or texture) into which contents should be rendered | If rendering to the canvas, this is in screen space and the origin is on the top-left. If rendering to a render-texture, this is in its base-texture's space with the origin on the bottom-left.  |
* | viewportFrame          | The framebuffer viewport corresponding to the destination-frame  | **Window Coordinates**: The origin is always on the bottom-left. |
* @memberof PIXI
*/
var RenderTextureSystem = function() {
	/**
	* @param renderer - The renderer this System works for.
	*/
	function RenderTextureSystem(renderer) {
		this.renderer = renderer;
		this.clearColor = renderer._backgroundColorRgba;
		this.defaultMaskStack = [];
		this.current = null;
		this.sourceFrame = new Rectangle();
		this.destinationFrame = new Rectangle();
		this.viewportFrame = new Rectangle();
	}
	/**
	* Bind the current render texture.
	* @param renderTexture - RenderTexture to bind, by default its `null` - the screen.
	* @param sourceFrame - Part of world that is mapped to the renderTexture.
	* @param destinationFrame - Part of renderTexture, by default it has the same size as sourceFrame.
	*/
	RenderTextureSystem.prototype.bind = function(renderTexture, sourceFrame, destinationFrame) {
		if (renderTexture === void 0) renderTexture = null;
		var renderer = this.renderer;
		this.current = renderTexture;
		var baseTexture;
		var framebuffer;
		var resolution;
		if (renderTexture) {
			baseTexture = renderTexture.baseTexture;
			resolution = baseTexture.resolution;
			if (!sourceFrame) {
				tempRect.width = renderTexture.frame.width;
				tempRect.height = renderTexture.frame.height;
				sourceFrame = tempRect;
			}
			if (!destinationFrame) {
				tempRect2.x = renderTexture.frame.x;
				tempRect2.y = renderTexture.frame.y;
				tempRect2.width = sourceFrame.width;
				tempRect2.height = sourceFrame.height;
				destinationFrame = tempRect2;
			}
			framebuffer = baseTexture.framebuffer;
		} else {
			resolution = renderer.resolution;
			if (!sourceFrame) {
				tempRect.width = renderer.screen.width;
				tempRect.height = renderer.screen.height;
				sourceFrame = tempRect;
			}
			if (!destinationFrame) {
				destinationFrame = tempRect;
				destinationFrame.width = sourceFrame.width;
				destinationFrame.height = sourceFrame.height;
			}
		}
		var viewportFrame = this.viewportFrame;
		viewportFrame.x = destinationFrame.x * resolution;
		viewportFrame.y = destinationFrame.y * resolution;
		viewportFrame.width = destinationFrame.width * resolution;
		viewportFrame.height = destinationFrame.height * resolution;
		if (!renderTexture) viewportFrame.y = renderer.view.height - (viewportFrame.y + viewportFrame.height);
		viewportFrame.ceil();
		this.renderer.framebuffer.bind(framebuffer, viewportFrame);
		this.renderer.projection.update(destinationFrame, sourceFrame, resolution, !framebuffer);
		if (renderTexture) this.renderer.mask.setMaskStack(baseTexture.maskStack);
		else this.renderer.mask.setMaskStack(this.defaultMaskStack);
		this.sourceFrame.copyFrom(sourceFrame);
		this.destinationFrame.copyFrom(destinationFrame);
	};
	/**
	* Erases the render texture and fills the drawing area with a colour.
	* @param clearColor - The color as rgba, default to use the renderer backgroundColor
	* @param [mask=BUFFER_BITS.COLOR | BUFFER_BITS.DEPTH] - Bitwise OR of masks
	*  that indicate the buffers to be cleared, by default COLOR and DEPTH buffers.
	*/
	RenderTextureSystem.prototype.clear = function(clearColor, mask) {
		if (this.current) clearColor = clearColor || this.current.baseTexture.clearColor;
		else clearColor = clearColor || this.clearColor;
		var destinationFrame = this.destinationFrame;
		var baseFrame = this.current ? this.current.baseTexture : this.renderer.screen;
		var clearMask = destinationFrame.width !== baseFrame.width || destinationFrame.height !== baseFrame.height;
		if (clearMask) {
			var _a = this.viewportFrame, x = _a.x, y = _a.y, width = _a.width, height = _a.height;
			x = Math.round(x);
			y = Math.round(y);
			width = Math.round(width);
			height = Math.round(height);
			this.renderer.gl.enable(this.renderer.gl.SCISSOR_TEST);
			this.renderer.gl.scissor(x, y, width, height);
		}
		this.renderer.framebuffer.clear(clearColor[0], clearColor[1], clearColor[2], clearColor[3], mask);
		if (clearMask) this.renderer.scissor.pop();
	};
	RenderTextureSystem.prototype.resize = function() {
		this.bind(null);
	};
	/** Resets render-texture state. */
	RenderTextureSystem.prototype.reset = function() {
		this.bind(null);
	};
	RenderTextureSystem.prototype.destroy = function() {
		this.renderer = null;
	};
	return RenderTextureSystem;
}();
function uboUpdate(_ud, _uv, _renderer, _syncData, buffer) {
	_renderer.buffer.update(buffer);
}
var UBO_TO_SINGLE_SETTERS = {
	float: "\n        data[offset] = v;\n    ",
	vec2: "\n        data[offset] = v[0];\n        data[offset+1] = v[1];\n    ",
	vec3: "\n        data[offset] = v[0];\n        data[offset+1] = v[1];\n        data[offset+2] = v[2];\n\n    ",
	vec4: "\n        data[offset] = v[0];\n        data[offset+1] = v[1];\n        data[offset+2] = v[2];\n        data[offset+3] = v[3];\n    ",
	mat2: "\n        data[offset] = v[0];\n        data[offset+1] = v[1];\n\n        data[offset+4] = v[2];\n        data[offset+5] = v[3];\n    ",
	mat3: "\n        data[offset] = v[0];\n        data[offset+1] = v[1];\n        data[offset+2] = v[2];\n\n        data[offset + 4] = v[3];\n        data[offset + 5] = v[4];\n        data[offset + 6] = v[5];\n\n        data[offset + 8] = v[6];\n        data[offset + 9] = v[7];\n        data[offset + 10] = v[8];\n    ",
	mat4: "\n        for(var i = 0; i < 16; i++)\n        {\n            data[offset + i] = v[i];\n        }\n    "
};
var GLSL_TO_STD40_SIZE = {
	float: 4,
	vec2: 8,
	vec3: 12,
	vec4: 16,
	int: 4,
	ivec2: 8,
	ivec3: 12,
	ivec4: 16,
	uint: 4,
	uvec2: 8,
	uvec3: 12,
	uvec4: 16,
	bool: 4,
	bvec2: 8,
	bvec3: 12,
	bvec4: 16,
	mat2: 32,
	mat3: 48,
	mat4: 64
};
/**
* logic originally from here: https://github.com/sketchpunk/FunWithWebGL2/blob/master/lesson_022/Shaders.js
* rewrote it, but this was a great starting point to get a solid understanding of whats going on :)
* @ignore
* @param uniformData
*/
function createUBOElements(uniformData) {
	var uboElements = uniformData.map(function(data) {
		return {
			data,
			offset: 0,
			dataLen: 0,
			dirty: 0
		};
	});
	var size = 0;
	var chunkSize = 0;
	var offset = 0;
	for (var i = 0; i < uboElements.length; i++) {
		var uboElement = uboElements[i];
		size = GLSL_TO_STD40_SIZE[uboElement.data.type];
		if (uboElement.data.size > 1) size = Math.max(size, 16) * uboElement.data.size;
		uboElement.dataLen = size;
		if (chunkSize % size !== 0 && chunkSize < 16) {
			var lineUpValue = chunkSize % size % 16;
			chunkSize += lineUpValue;
			offset += lineUpValue;
		}
		if (chunkSize + size > 16) {
			offset = Math.ceil(offset / 16) * 16;
			uboElement.offset = offset;
			offset += size;
			chunkSize = size;
		} else {
			uboElement.offset = offset;
			chunkSize += size;
			offset += size;
		}
	}
	offset = Math.ceil(offset / 16) * 16;
	return {
		uboElements,
		size: offset
	};
}
function getUBOData(uniforms, uniformData) {
	var usedUniformDatas = [];
	for (var i in uniforms) if (uniformData[i]) usedUniformDatas.push(uniformData[i]);
	usedUniformDatas.sort(function(a, b) {
		return a.index - b.index;
	});
	return usedUniformDatas;
}
function generateUniformBufferSync(group, uniformData) {
	if (!group.autoManage) return {
		size: 0,
		syncFunc: uboUpdate
	};
	var _a = createUBOElements(getUBOData(group.uniforms, uniformData)), uboElements = _a.uboElements, size = _a.size;
	var funcFragments = ["\n    var v = null;\n    var v2 = null;\n    var cv = null;\n    var t = 0;\n    var gl = renderer.gl\n    var index = 0;\n    var data = buffer.data;\n    "];
	for (var i = 0; i < uboElements.length; i++) {
		var uboElement = uboElements[i];
		var uniform = group.uniforms[uboElement.data.name];
		var name = uboElement.data.name;
		var parsed = false;
		for (var j = 0; j < uniformParsers.length; j++) {
			var uniformParser = uniformParsers[j];
			if (uniformParser.codeUbo && uniformParser.test(uboElement.data, uniform)) {
				funcFragments.push("offset = " + uboElement.offset / 4 + ";", uniformParsers[j].codeUbo(uboElement.data.name, uniform));
				parsed = true;
				break;
			}
		}
		if (!parsed) {
			if (uboElement.data.size > 1) {
				var size_1 = mapSize(uboElement.data.type);
				var rowSize = Math.max(GLSL_TO_STD40_SIZE[uboElement.data.type] / 16, 1);
				var elementSize = size_1 / rowSize;
				var remainder = (4 - elementSize % 4) % 4;
				funcFragments.push("\n                cv = ud." + name + ".value;\n                v = uv." + name + ";\n                offset = " + uboElement.offset / 4 + ";\n\n                t = 0;\n\n                for(var i=0; i < " + uboElement.data.size * rowSize + "; i++)\n                {\n                    for(var j = 0; j < " + elementSize + "; j++)\n                    {\n                        data[offset++] = v[t++];\n                    }\n                    offset += " + remainder + ";\n                }\n\n                ");
			} else {
				var template = UBO_TO_SINGLE_SETTERS[uboElement.data.type];
				funcFragments.push("\n                cv = ud." + name + ".value;\n                v = uv." + name + ";\n                offset = " + uboElement.offset / 4 + ";\n                " + template + ";\n                ");
			}
		}
	}
	funcFragments.push("\n       renderer.buffer.update(buffer);\n    ");
	return {
		size,
		syncFunc: new Function("ud", "uv", "renderer", "syncData", "buffer", funcFragments.join("\n"))
	};
}
/**
* @private
*/
var IGLUniformData = function() {
	function IGLUniformData() {}
	return IGLUniformData;
}();
/**
* Helper class to create a WebGL Program
* @memberof PIXI
*/
var GLProgram = function() {
	/**
	* Makes a new Pixi program.
	* @param program - webgl program
	* @param uniformData - uniforms
	*/
	function GLProgram(program, uniformData) {
		this.program = program;
		this.uniformData = uniformData;
		this.uniformGroups = {};
		this.uniformDirtyGroups = {};
		this.uniformBufferBindings = {};
	}
	/** Destroys this program. */
	GLProgram.prototype.destroy = function() {
		this.uniformData = null;
		this.uniformGroups = null;
		this.uniformDirtyGroups = null;
		this.uniformBufferBindings = null;
		this.program = null;
	};
	return GLProgram;
}();
/**
* returns the attribute data from the program
* @private
* @param {WebGLProgram} [program] - the WebGL program
* @param {WebGLRenderingContext} [gl] - the WebGL context
* @returns {object} the attribute data for this program
*/
function getAttributeData(program, gl) {
	var attributes = {};
	var totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
	for (var i = 0; i < totalAttributes; i++) {
		var attribData = gl.getActiveAttrib(program, i);
		if (attribData.name.indexOf("gl_") === 0) continue;
		var type = mapType(gl, attribData.type);
		var data = {
			type,
			name: attribData.name,
			size: mapSize(type),
			location: gl.getAttribLocation(program, attribData.name)
		};
		attributes[attribData.name] = data;
	}
	return attributes;
}
/**
* returns the uniform data from the program
* @private
* @param program - the webgl program
* @param gl - the WebGL context
* @returns {object} the uniform data for this program
*/
function getUniformData(program, gl) {
	var uniforms = {};
	var totalUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
	for (var i = 0; i < totalUniforms; i++) {
		var uniformData = gl.getActiveUniform(program, i);
		var name = uniformData.name.replace(/\[.*?\]$/, "");
		var isArray = !!uniformData.name.match(/\[.*?\]$/);
		var type = mapType(gl, uniformData.type);
		uniforms[name] = {
			name,
			index: i,
			type,
			size: uniformData.size,
			isArray,
			value: defaultValue(type, uniformData.size)
		};
	}
	return uniforms;
}
/**
* generates a WebGL Program object from a high level Pixi Program.
* @param gl - a rendering context on which to generate the program
* @param program - the high level Pixi Program.
*/
function generateProgram(gl, program) {
	var glVertShader = compileShader(gl, gl.VERTEX_SHADER, program.vertexSrc);
	var glFragShader = compileShader(gl, gl.FRAGMENT_SHADER, program.fragmentSrc);
	var webGLProgram = gl.createProgram();
	gl.attachShader(webGLProgram, glVertShader);
	gl.attachShader(webGLProgram, glFragShader);
	gl.linkProgram(webGLProgram);
	if (!gl.getProgramParameter(webGLProgram, gl.LINK_STATUS)) logProgramError(gl, webGLProgram, glVertShader, glFragShader);
	program.attributeData = getAttributeData(webGLProgram, gl);
	program.uniformData = getUniformData(webGLProgram, gl);
	if (!/^[ \t]*#[ \t]*version[ \t]+300[ \t]+es[ \t]*$/m.test(program.vertexSrc)) {
		var keys = Object.keys(program.attributeData);
		keys.sort(function(a, b) {
			return a > b ? 1 : -1;
		});
		for (var i = 0; i < keys.length; i++) {
			program.attributeData[keys[i]].location = i;
			gl.bindAttribLocation(webGLProgram, i, keys[i]);
		}
		gl.linkProgram(webGLProgram);
	}
	gl.deleteShader(glVertShader);
	gl.deleteShader(glFragShader);
	var uniformData = {};
	for (var i in program.uniformData) {
		var data = program.uniformData[i];
		uniformData[i] = {
			location: gl.getUniformLocation(webGLProgram, i),
			value: defaultValue(data.type, data.size)
		};
	}
	return new GLProgram(webGLProgram, uniformData);
}
var UID = 0;
var defaultSyncData = {
	textureCount: 0,
	uboCount: 0
};
/**
* System plugin to the renderer to manage shaders.
* @memberof PIXI
*/
var ShaderSystem = function() {
	/** @param renderer - The renderer this System works for. */
	function ShaderSystem(renderer) {
		this.destroyed = false;
		this.renderer = renderer;
		this.systemCheck();
		this.gl = null;
		this.shader = null;
		this.program = null;
		this.cache = {};
		this._uboCache = {};
		this.id = UID++;
	}
	/**
	* Overrideable function by `@pixi/unsafe-eval` to silence
	* throwing an error if platform doesn't support unsafe-evals.
	* @private
	*/
	ShaderSystem.prototype.systemCheck = function() {
		if (!unsafeEvalSupported()) throw new Error("Current environment does not allow unsafe-eval, please use @pixi/unsafe-eval module to enable support.");
	};
	ShaderSystem.prototype.contextChange = function(gl) {
		this.gl = gl;
		this.reset();
	};
	/**
	* Changes the current shader to the one given in parameter.
	* @param shader - the new shader
	* @param dontSync - false if the shader should automatically sync its uniforms.
	* @returns the glProgram that belongs to the shader.
	*/
	ShaderSystem.prototype.bind = function(shader, dontSync) {
		shader.disposeRunner.add(this);
		shader.uniforms.globals = this.renderer.globalUniforms;
		var program = shader.program;
		var glProgram = program.glPrograms[this.renderer.CONTEXT_UID] || this.generateProgram(shader);
		this.shader = shader;
		if (this.program !== program) {
			this.program = program;
			this.gl.useProgram(glProgram.program);
		}
		if (!dontSync) {
			defaultSyncData.textureCount = 0;
			defaultSyncData.uboCount = 0;
			this.syncUniformGroup(shader.uniformGroup, defaultSyncData);
		}
		return glProgram;
	};
	/**
	* Uploads the uniforms values to the currently bound shader.
	* @param uniforms - the uniforms values that be applied to the current shader
	*/
	ShaderSystem.prototype.setUniforms = function(uniforms) {
		var shader = this.shader.program;
		var glProgram = shader.glPrograms[this.renderer.CONTEXT_UID];
		shader.syncUniforms(glProgram.uniformData, uniforms, this.renderer);
	};
	/**
	* Syncs uniforms on the group
	* @param group - the uniform group to sync
	* @param syncData - this is data that is passed to the sync function and any nested sync functions
	*/
	ShaderSystem.prototype.syncUniformGroup = function(group, syncData) {
		var glProgram = this.getGlProgram();
		if (!group.static || group.dirtyId !== glProgram.uniformDirtyGroups[group.id]) {
			glProgram.uniformDirtyGroups[group.id] = group.dirtyId;
			this.syncUniforms(group, glProgram, syncData);
		}
	};
	/**
	* Overrideable by the @pixi/unsafe-eval package to use static syncUniforms instead.
	* @param group
	* @param glProgram
	* @param syncData
	*/
	ShaderSystem.prototype.syncUniforms = function(group, glProgram, syncData) {
		(group.syncUniforms[this.shader.program.id] || this.createSyncGroups(group))(glProgram.uniformData, group.uniforms, this.renderer, syncData);
	};
	ShaderSystem.prototype.createSyncGroups = function(group) {
		var id = this.getSignature(group, this.shader.program.uniformData, "u");
		if (!this.cache[id]) this.cache[id] = generateUniformsSync(group, this.shader.program.uniformData);
		group.syncUniforms[this.shader.program.id] = this.cache[id];
		return group.syncUniforms[this.shader.program.id];
	};
	/**
	* Syncs uniform buffers
	* @param group - the uniform buffer group to sync
	* @param name - the name of the uniform buffer
	*/
	ShaderSystem.prototype.syncUniformBufferGroup = function(group, name) {
		var glProgram = this.getGlProgram();
		if (!group.static || group.dirtyId !== 0 || !glProgram.uniformGroups[group.id]) {
			group.dirtyId = 0;
			var syncFunc = glProgram.uniformGroups[group.id] || this.createSyncBufferGroup(group, glProgram, name);
			group.buffer.update();
			syncFunc(glProgram.uniformData, group.uniforms, this.renderer, defaultSyncData, group.buffer);
		}
		this.renderer.buffer.bindBufferBase(group.buffer, glProgram.uniformBufferBindings[name]);
	};
	/**
	* Will create a function that uploads a uniform buffer using the STD140 standard.
	* The upload function will then be cached for future calls
	* If a group is manually managed, then a simple upload function is generated
	* @param group - the uniform buffer group to sync
	* @param glProgram - the gl program to attach the uniform bindings to
	* @param name - the name of the uniform buffer (must exist on the shader)
	*/
	ShaderSystem.prototype.createSyncBufferGroup = function(group, glProgram, name) {
		var gl = this.renderer.gl;
		this.renderer.buffer.bind(group.buffer);
		var uniformBlockIndex = this.gl.getUniformBlockIndex(glProgram.program, name);
		glProgram.uniformBufferBindings[name] = this.shader.uniformBindCount;
		gl.uniformBlockBinding(glProgram.program, uniformBlockIndex, this.shader.uniformBindCount);
		this.shader.uniformBindCount++;
		var id = this.getSignature(group, this.shader.program.uniformData, "ubo");
		var uboData = this._uboCache[id];
		if (!uboData) uboData = this._uboCache[id] = generateUniformBufferSync(group, this.shader.program.uniformData);
		if (group.autoManage) {
			var data = new Float32Array(uboData.size / 4);
			group.buffer.update(data);
		}
		glProgram.uniformGroups[group.id] = uboData.syncFunc;
		return glProgram.uniformGroups[group.id];
	};
	/**
	* Takes a uniform group and data and generates a unique signature for them.
	* @param group - The uniform group to get signature of
	* @param group.uniforms
	* @param uniformData - Uniform information generated by the shader
	* @param preFix
	* @returns Unique signature of the uniform group
	*/
	ShaderSystem.prototype.getSignature = function(group, uniformData, preFix) {
		var uniforms = group.uniforms;
		var strings = [preFix + "-"];
		for (var i in uniforms) {
			strings.push(i);
			if (uniformData[i]) strings.push(uniformData[i].type);
		}
		return strings.join("-");
	};
	/**
	* Returns the underlying GLShade rof the currently bound shader.
	*
	* This can be handy for when you to have a little more control over the setting of your uniforms.
	* @returns The glProgram for the currently bound Shader for this context
	*/
	ShaderSystem.prototype.getGlProgram = function() {
		if (this.shader) return this.shader.program.glPrograms[this.renderer.CONTEXT_UID];
		return null;
	};
	/**
	* Generates a glProgram version of the Shader provided.
	* @param shader - The shader that the glProgram will be based on.
	* @returns A shiny new glProgram!
	*/
	ShaderSystem.prototype.generateProgram = function(shader) {
		var gl = this.gl;
		var program = shader.program;
		var glProgram = generateProgram(gl, program);
		program.glPrograms[this.renderer.CONTEXT_UID] = glProgram;
		return glProgram;
	};
	/** Resets ShaderSystem state, does not affect WebGL state. */
	ShaderSystem.prototype.reset = function() {
		this.program = null;
		this.shader = null;
	};
	/**
	* Disposes shader.
	* If disposing one equals with current shader, set current as null.
	* @param shader - Shader object
	*/
	ShaderSystem.prototype.disposeShader = function(shader) {
		if (this.shader === shader) this.shader = null;
	};
	/** Destroys this System and removes all its textures. */
	ShaderSystem.prototype.destroy = function() {
		this.renderer = null;
		this.destroyed = true;
	};
	return ShaderSystem;
}();
/**
* Maps gl blend combinations to WebGL.
* @memberof PIXI
* @function mapWebGLBlendModesToPixi
* @private
* @param {WebGLRenderingContext} gl - The rendering context.
* @param {number[][]} [array=[]] - The array to output into.
* @returns {number[][]} Mapped modes.
*/
function mapWebGLBlendModesToPixi(gl, array) {
	if (array === void 0) array = [];
	array[BLEND_MODES.NORMAL] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
	array[BLEND_MODES.ADD] = [gl.ONE, gl.ONE];
	array[BLEND_MODES.MULTIPLY] = [
		gl.DST_COLOR,
		gl.ONE_MINUS_SRC_ALPHA,
		gl.ONE,
		gl.ONE_MINUS_SRC_ALPHA
	];
	array[BLEND_MODES.SCREEN] = [
		gl.ONE,
		gl.ONE_MINUS_SRC_COLOR,
		gl.ONE,
		gl.ONE_MINUS_SRC_ALPHA
	];
	array[BLEND_MODES.OVERLAY] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
	array[BLEND_MODES.DARKEN] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
	array[BLEND_MODES.LIGHTEN] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
	array[BLEND_MODES.COLOR_DODGE] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
	array[BLEND_MODES.COLOR_BURN] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
	array[BLEND_MODES.HARD_LIGHT] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
	array[BLEND_MODES.SOFT_LIGHT] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
	array[BLEND_MODES.DIFFERENCE] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
	array[BLEND_MODES.EXCLUSION] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
	array[BLEND_MODES.HUE] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
	array[BLEND_MODES.SATURATION] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
	array[BLEND_MODES.COLOR] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
	array[BLEND_MODES.LUMINOSITY] = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
	array[BLEND_MODES.NONE] = [0, 0];
	array[BLEND_MODES.NORMAL_NPM] = [
		gl.SRC_ALPHA,
		gl.ONE_MINUS_SRC_ALPHA,
		gl.ONE,
		gl.ONE_MINUS_SRC_ALPHA
	];
	array[BLEND_MODES.ADD_NPM] = [
		gl.SRC_ALPHA,
		gl.ONE,
		gl.ONE,
		gl.ONE
	];
	array[BLEND_MODES.SCREEN_NPM] = [
		gl.SRC_ALPHA,
		gl.ONE_MINUS_SRC_COLOR,
		gl.ONE,
		gl.ONE_MINUS_SRC_ALPHA
	];
	array[BLEND_MODES.SRC_IN] = [gl.DST_ALPHA, gl.ZERO];
	array[BLEND_MODES.SRC_OUT] = [gl.ONE_MINUS_DST_ALPHA, gl.ZERO];
	array[BLEND_MODES.SRC_ATOP] = [gl.DST_ALPHA, gl.ONE_MINUS_SRC_ALPHA];
	array[BLEND_MODES.DST_OVER] = [gl.ONE_MINUS_DST_ALPHA, gl.ONE];
	array[BLEND_MODES.DST_IN] = [gl.ZERO, gl.SRC_ALPHA];
	array[BLEND_MODES.DST_OUT] = [gl.ZERO, gl.ONE_MINUS_SRC_ALPHA];
	array[BLEND_MODES.DST_ATOP] = [gl.ONE_MINUS_DST_ALPHA, gl.SRC_ALPHA];
	array[BLEND_MODES.XOR] = [gl.ONE_MINUS_DST_ALPHA, gl.ONE_MINUS_SRC_ALPHA];
	array[BLEND_MODES.SUBTRACT] = [
		gl.ONE,
		gl.ONE,
		gl.ONE,
		gl.ONE,
		gl.FUNC_REVERSE_SUBTRACT,
		gl.FUNC_ADD
	];
	return array;
}
var BLEND = 0;
var OFFSET = 1;
var CULLING = 2;
var DEPTH_TEST = 3;
var WINDING = 4;
var DEPTH_MASK = 5;
/**
* System plugin to the renderer to manage WebGL state machines.
* @memberof PIXI
*/
var StateSystem = function() {
	function StateSystem() {
		this.gl = null;
		this.stateId = 0;
		this.polygonOffset = 0;
		this.blendMode = BLEND_MODES.NONE;
		this._blendEq = false;
		this.map = [];
		this.map[BLEND] = this.setBlend;
		this.map[OFFSET] = this.setOffset;
		this.map[CULLING] = this.setCullFace;
		this.map[DEPTH_TEST] = this.setDepthTest;
		this.map[WINDING] = this.setFrontFace;
		this.map[DEPTH_MASK] = this.setDepthMask;
		this.checks = [];
		this.defaultState = new State();
		this.defaultState.blend = true;
	}
	StateSystem.prototype.contextChange = function(gl) {
		this.gl = gl;
		this.blendModes = mapWebGLBlendModesToPixi(gl);
		this.set(this.defaultState);
		this.reset();
	};
	/**
	* Sets the current state
	* @param {*} state - The state to set.
	*/
	StateSystem.prototype.set = function(state) {
		state = state || this.defaultState;
		if (this.stateId !== state.data) {
			var diff = this.stateId ^ state.data;
			var i = 0;
			while (diff) {
				if (diff & 1) this.map[i].call(this, !!(state.data & 1 << i));
				diff = diff >> 1;
				i++;
			}
			this.stateId = state.data;
		}
		for (var i = 0; i < this.checks.length; i++) this.checks[i](this, state);
	};
	/**
	* Sets the state, when previous state is unknown.
	* @param {*} state - The state to set
	*/
	StateSystem.prototype.forceState = function(state) {
		state = state || this.defaultState;
		for (var i = 0; i < this.map.length; i++) this.map[i].call(this, !!(state.data & 1 << i));
		for (var i = 0; i < this.checks.length; i++) this.checks[i](this, state);
		this.stateId = state.data;
	};
	/**
	* Sets whether to enable or disable blending.
	* @param value - Turn on or off WebGl blending.
	*/
	StateSystem.prototype.setBlend = function(value) {
		this.updateCheck(StateSystem.checkBlendMode, value);
		this.gl[value ? "enable" : "disable"](this.gl.BLEND);
	};
	/**
	* Sets whether to enable or disable polygon offset fill.
	* @param value - Turn on or off webgl polygon offset testing.
	*/
	StateSystem.prototype.setOffset = function(value) {
		this.updateCheck(StateSystem.checkPolygonOffset, value);
		this.gl[value ? "enable" : "disable"](this.gl.POLYGON_OFFSET_FILL);
	};
	/**
	* Sets whether to enable or disable depth test.
	* @param value - Turn on or off webgl depth testing.
	*/
	StateSystem.prototype.setDepthTest = function(value) {
		this.gl[value ? "enable" : "disable"](this.gl.DEPTH_TEST);
	};
	/**
	* Sets whether to enable or disable depth mask.
	* @param value - Turn on or off webgl depth mask.
	*/
	StateSystem.prototype.setDepthMask = function(value) {
		this.gl.depthMask(value);
	};
	/**
	* Sets whether to enable or disable cull face.
	* @param {boolean} value - Turn on or off webgl cull face.
	*/
	StateSystem.prototype.setCullFace = function(value) {
		this.gl[value ? "enable" : "disable"](this.gl.CULL_FACE);
	};
	/**
	* Sets the gl front face.
	* @param {boolean} value - true is clockwise and false is counter-clockwise
	*/
	StateSystem.prototype.setFrontFace = function(value) {
		this.gl.frontFace(this.gl[value ? "CW" : "CCW"]);
	};
	/**
	* Sets the blend mode.
	* @param {number} value - The blend mode to set to.
	*/
	StateSystem.prototype.setBlendMode = function(value) {
		if (value === this.blendMode) return;
		this.blendMode = value;
		var mode = this.blendModes[value];
		var gl = this.gl;
		if (mode.length === 2) gl.blendFunc(mode[0], mode[1]);
		else gl.blendFuncSeparate(mode[0], mode[1], mode[2], mode[3]);
		if (mode.length === 6) {
			this._blendEq = true;
			gl.blendEquationSeparate(mode[4], mode[5]);
		} else if (this._blendEq) {
			this._blendEq = false;
			gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
		}
	};
	/**
	* Sets the polygon offset.
	* @param {number} value - the polygon offset
	* @param {number} scale - the polygon offset scale
	*/
	StateSystem.prototype.setPolygonOffset = function(value, scale) {
		this.gl.polygonOffset(value, scale);
	};
	/** Resets all the logic and disables the VAOs. */
	StateSystem.prototype.reset = function() {
		this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false);
		this.forceState(this.defaultState);
		this._blendEq = true;
		this.blendMode = -1;
		this.setBlendMode(0);
	};
	/**
	* Checks to see which updates should be checked based on which settings have been activated.
	*
	* For example, if blend is enabled then we should check the blend modes each time the state is changed
	* or if polygon fill is activated then we need to check if the polygon offset changes.
	* The idea is that we only check what we have too.
	* @param func - the checking function to add or remove
	* @param value - should the check function be added or removed.
	*/
	StateSystem.prototype.updateCheck = function(func, value) {
		var index = this.checks.indexOf(func);
		if (value && index === -1) this.checks.push(func);
		else if (!value && index !== -1) this.checks.splice(index, 1);
	};
	/**
	* A private little wrapper function that we call to check the blend mode.
	* @param system - the System to perform the state check on
	* @param state - the state that the blendMode will pulled from
	*/
	StateSystem.checkBlendMode = function(system, state) {
		system.setBlendMode(state.blendMode);
	};
	/**
	* A private little wrapper function that we call to check the polygon offset.
	* @param system - the System to perform the state check on
	* @param state - the state that the blendMode will pulled from
	*/
	StateSystem.checkPolygonOffset = function(system, state) {
		system.setPolygonOffset(1, state.polygonOffset);
	};
	/**
	* @ignore
	*/
	StateSystem.prototype.destroy = function() {
		this.gl = null;
	};
	return StateSystem;
}();
/**
* System plugin to the renderer to manage texture garbage collection on the GPU,
* ensuring that it does not get clogged up with textures that are no longer being used.
* @memberof PIXI
*/
var TextureGCSystem = function() {
	/** @param renderer - The renderer this System works for. */
	function TextureGCSystem(renderer) {
		this.renderer = renderer;
		this.count = 0;
		this.checkCount = 0;
		this.maxIdle = settings.GC_MAX_IDLE;
		this.checkCountMax = settings.GC_MAX_CHECK_COUNT;
		this.mode = settings.GC_MODE;
	}
	/**
	* Checks to see when the last time a texture was used
	* if the texture has not been used for a specified amount of time it will be removed from the GPU
	*/
	TextureGCSystem.prototype.postrender = function() {
		if (!this.renderer.renderingToScreen) return;
		this.count++;
		if (this.mode === GC_MODES.MANUAL) return;
		this.checkCount++;
		if (this.checkCount > this.checkCountMax) {
			this.checkCount = 0;
			this.run();
		}
	};
	/**
	* Checks to see when the last time a texture was used
	* if the texture has not been used for a specified amount of time it will be removed from the GPU
	*/
	TextureGCSystem.prototype.run = function() {
		var tm = this.renderer.texture;
		var managedTextures = tm.managedTextures;
		var wasRemoved = false;
		for (var i = 0; i < managedTextures.length; i++) {
			var texture = managedTextures[i];
			if (!texture.framebuffer && this.count - texture.touched > this.maxIdle) {
				tm.destroyTexture(texture, true);
				managedTextures[i] = null;
				wasRemoved = true;
			}
		}
		if (wasRemoved) {
			var j = 0;
			for (var i = 0; i < managedTextures.length; i++) if (managedTextures[i] !== null) managedTextures[j++] = managedTextures[i];
			managedTextures.length = j;
		}
	};
	/**
	* Removes all the textures within the specified displayObject and its children from the GPU
	* @param {PIXI.DisplayObject} displayObject - the displayObject to remove the textures from.
	*/
	TextureGCSystem.prototype.unload = function(displayObject) {
		var tm = this.renderer.texture;
		var texture = displayObject._texture;
		if (texture && !texture.framebuffer) tm.destroyTexture(texture);
		for (var i = displayObject.children.length - 1; i >= 0; i--) this.unload(displayObject.children[i]);
	};
	TextureGCSystem.prototype.destroy = function() {
		this.renderer = null;
	};
	return TextureGCSystem;
}();
/**
* Returns a lookup table that maps each type-format pair to a compatible internal format.
* @memberof PIXI
* @function mapTypeAndFormatToInternalFormat
* @private
* @param {WebGLRenderingContext} gl - The rendering context.
* @returns Lookup table.
*/
function mapTypeAndFormatToInternalFormat(gl) {
	var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
	var table;
	if ("WebGL2RenderingContext" in globalThis && gl instanceof globalThis.WebGL2RenderingContext) table = (_a = {}, _a[TYPES.UNSIGNED_BYTE] = (_b = {}, _b[FORMATS.RGBA] = gl.RGBA8, _b[FORMATS.RGB] = gl.RGB8, _b[FORMATS.RG] = gl.RG8, _b[FORMATS.RED] = gl.R8, _b[FORMATS.RGBA_INTEGER] = gl.RGBA8UI, _b[FORMATS.RGB_INTEGER] = gl.RGB8UI, _b[FORMATS.RG_INTEGER] = gl.RG8UI, _b[FORMATS.RED_INTEGER] = gl.R8UI, _b[FORMATS.ALPHA] = gl.ALPHA, _b[FORMATS.LUMINANCE] = gl.LUMINANCE, _b[FORMATS.LUMINANCE_ALPHA] = gl.LUMINANCE_ALPHA, _b), _a[TYPES.BYTE] = (_c = {}, _c[FORMATS.RGBA] = gl.RGBA8_SNORM, _c[FORMATS.RGB] = gl.RGB8_SNORM, _c[FORMATS.RG] = gl.RG8_SNORM, _c[FORMATS.RED] = gl.R8_SNORM, _c[FORMATS.RGBA_INTEGER] = gl.RGBA8I, _c[FORMATS.RGB_INTEGER] = gl.RGB8I, _c[FORMATS.RG_INTEGER] = gl.RG8I, _c[FORMATS.RED_INTEGER] = gl.R8I, _c), _a[TYPES.UNSIGNED_SHORT] = (_d = {}, _d[FORMATS.RGBA_INTEGER] = gl.RGBA16UI, _d[FORMATS.RGB_INTEGER] = gl.RGB16UI, _d[FORMATS.RG_INTEGER] = gl.RG16UI, _d[FORMATS.RED_INTEGER] = gl.R16UI, _d[FORMATS.DEPTH_COMPONENT] = gl.DEPTH_COMPONENT16, _d), _a[TYPES.SHORT] = (_e = {}, _e[FORMATS.RGBA_INTEGER] = gl.RGBA16I, _e[FORMATS.RGB_INTEGER] = gl.RGB16I, _e[FORMATS.RG_INTEGER] = gl.RG16I, _e[FORMATS.RED_INTEGER] = gl.R16I, _e), _a[TYPES.UNSIGNED_INT] = (_f = {}, _f[FORMATS.RGBA_INTEGER] = gl.RGBA32UI, _f[FORMATS.RGB_INTEGER] = gl.RGB32UI, _f[FORMATS.RG_INTEGER] = gl.RG32UI, _f[FORMATS.RED_INTEGER] = gl.R32UI, _f[FORMATS.DEPTH_COMPONENT] = gl.DEPTH_COMPONENT24, _f), _a[TYPES.INT] = (_g = {}, _g[FORMATS.RGBA_INTEGER] = gl.RGBA32I, _g[FORMATS.RGB_INTEGER] = gl.RGB32I, _g[FORMATS.RG_INTEGER] = gl.RG32I, _g[FORMATS.RED_INTEGER] = gl.R32I, _g), _a[TYPES.FLOAT] = (_h = {}, _h[FORMATS.RGBA] = gl.RGBA32F, _h[FORMATS.RGB] = gl.RGB32F, _h[FORMATS.RG] = gl.RG32F, _h[FORMATS.RED] = gl.R32F, _h[FORMATS.DEPTH_COMPONENT] = gl.DEPTH_COMPONENT32F, _h), _a[TYPES.HALF_FLOAT] = (_j = {}, _j[FORMATS.RGBA] = gl.RGBA16F, _j[FORMATS.RGB] = gl.RGB16F, _j[FORMATS.RG] = gl.RG16F, _j[FORMATS.RED] = gl.R16F, _j), _a[TYPES.UNSIGNED_SHORT_5_6_5] = (_k = {}, _k[FORMATS.RGB] = gl.RGB565, _k), _a[TYPES.UNSIGNED_SHORT_4_4_4_4] = (_l = {}, _l[FORMATS.RGBA] = gl.RGBA4, _l), _a[TYPES.UNSIGNED_SHORT_5_5_5_1] = (_m = {}, _m[FORMATS.RGBA] = gl.RGB5_A1, _m), _a[TYPES.UNSIGNED_INT_2_10_10_10_REV] = (_o = {}, _o[FORMATS.RGBA] = gl.RGB10_A2, _o[FORMATS.RGBA_INTEGER] = gl.RGB10_A2UI, _o), _a[TYPES.UNSIGNED_INT_10F_11F_11F_REV] = (_p = {}, _p[FORMATS.RGB] = gl.R11F_G11F_B10F, _p), _a[TYPES.UNSIGNED_INT_5_9_9_9_REV] = (_q = {}, _q[FORMATS.RGB] = gl.RGB9_E5, _q), _a[TYPES.UNSIGNED_INT_24_8] = (_r = {}, _r[FORMATS.DEPTH_STENCIL] = gl.DEPTH24_STENCIL8, _r), _a[TYPES.FLOAT_32_UNSIGNED_INT_24_8_REV] = (_s = {}, _s[FORMATS.DEPTH_STENCIL] = gl.DEPTH32F_STENCIL8, _s), _a);
	else table = (_t = {}, _t[TYPES.UNSIGNED_BYTE] = (_u = {}, _u[FORMATS.RGBA] = gl.RGBA, _u[FORMATS.RGB] = gl.RGB, _u[FORMATS.ALPHA] = gl.ALPHA, _u[FORMATS.LUMINANCE] = gl.LUMINANCE, _u[FORMATS.LUMINANCE_ALPHA] = gl.LUMINANCE_ALPHA, _u), _t[TYPES.UNSIGNED_SHORT_5_6_5] = (_v = {}, _v[FORMATS.RGB] = gl.RGB, _v), _t[TYPES.UNSIGNED_SHORT_4_4_4_4] = (_w = {}, _w[FORMATS.RGBA] = gl.RGBA, _w), _t[TYPES.UNSIGNED_SHORT_5_5_5_1] = (_x = {}, _x[FORMATS.RGBA] = gl.RGBA, _x), _t);
	return table;
}
/**
* Internal texture for WebGL context.
* @memberof PIXI
*/
var GLTexture = function() {
	function GLTexture(texture) {
		this.texture = texture;
		this.width = -1;
		this.height = -1;
		this.dirtyId = -1;
		this.dirtyStyleId = -1;
		this.mipmap = false;
		this.wrapMode = 33071;
		this.type = TYPES.UNSIGNED_BYTE;
		this.internalFormat = FORMATS.RGBA;
		this.samplerType = 0;
	}
	return GLTexture;
}();
/**
* System plugin to the renderer to manage textures.
* @memberof PIXI
*/
var TextureSystem = function() {
	/**
	* @param renderer - The renderer this system works for.
	*/
	function TextureSystem(renderer) {
		this.renderer = renderer;
		this.boundTextures = [];
		this.currentLocation = -1;
		this.managedTextures = [];
		this._unknownBoundTextures = false;
		this.unknownTexture = new BaseTexture();
		this.hasIntegerTextures = false;
	}
	/** Sets up the renderer context and necessary buffers. */
	TextureSystem.prototype.contextChange = function() {
		var gl = this.gl = this.renderer.gl;
		this.CONTEXT_UID = this.renderer.CONTEXT_UID;
		this.webGLVersion = this.renderer.context.webGLVersion;
		this.internalFormats = mapTypeAndFormatToInternalFormat(gl);
		var maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
		this.boundTextures.length = maxTextures;
		for (var i = 0; i < maxTextures; i++) this.boundTextures[i] = null;
		this.emptyTextures = {};
		var emptyTexture2D = new GLTexture(gl.createTexture());
		gl.bindTexture(gl.TEXTURE_2D, emptyTexture2D.texture);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, /* @__PURE__ */ new Uint8Array(4));
		this.emptyTextures[gl.TEXTURE_2D] = emptyTexture2D;
		this.emptyTextures[gl.TEXTURE_CUBE_MAP] = new GLTexture(gl.createTexture());
		gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.emptyTextures[gl.TEXTURE_CUBE_MAP].texture);
		for (var i = 0; i < 6; i++) gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
		for (var i = 0; i < this.boundTextures.length; i++) this.bind(null, i);
	};
	/**
	* Bind a texture to a specific location
	*
	* If you want to unbind something, please use `unbind(texture)` instead of `bind(null, textureLocation)`
	* @param texture - Texture to bind
	* @param [location=0] - Location to bind at
	*/
	TextureSystem.prototype.bind = function(texture, location) {
		if (location === void 0) location = 0;
		var gl = this.gl;
		texture = texture === null || texture === void 0 ? void 0 : texture.castToBaseTexture();
		if (texture && texture.valid && !texture.parentTextureArray) {
			texture.touched = this.renderer.textureGC.count;
			var glTexture = texture._glTextures[this.CONTEXT_UID] || this.initTexture(texture);
			if (this.boundTextures[location] !== texture) {
				if (this.currentLocation !== location) {
					this.currentLocation = location;
					gl.activeTexture(gl.TEXTURE0 + location);
				}
				gl.bindTexture(texture.target, glTexture.texture);
			}
			if (glTexture.dirtyId !== texture.dirtyId) {
				if (this.currentLocation !== location) {
					this.currentLocation = location;
					gl.activeTexture(gl.TEXTURE0 + location);
				}
				this.updateTexture(texture);
			} else if (glTexture.dirtyStyleId !== texture.dirtyStyleId) this.updateTextureStyle(texture);
			this.boundTextures[location] = texture;
		} else {
			if (this.currentLocation !== location) {
				this.currentLocation = location;
				gl.activeTexture(gl.TEXTURE0 + location);
			}
			gl.bindTexture(gl.TEXTURE_2D, this.emptyTextures[gl.TEXTURE_2D].texture);
			this.boundTextures[location] = null;
		}
	};
	/** Resets texture location and bound textures Actual `bind(null, i)` calls will be performed at next `unbind()` call */
	TextureSystem.prototype.reset = function() {
		this._unknownBoundTextures = true;
		this.hasIntegerTextures = false;
		this.currentLocation = -1;
		for (var i = 0; i < this.boundTextures.length; i++) this.boundTextures[i] = this.unknownTexture;
	};
	/**
	* Unbind a texture.
	* @param texture - Texture to bind
	*/
	TextureSystem.prototype.unbind = function(texture) {
		var _a = this, gl = _a.gl, boundTextures = _a.boundTextures;
		if (this._unknownBoundTextures) {
			this._unknownBoundTextures = false;
			for (var i = 0; i < boundTextures.length; i++) if (boundTextures[i] === this.unknownTexture) this.bind(null, i);
		}
		for (var i = 0; i < boundTextures.length; i++) if (boundTextures[i] === texture) {
			if (this.currentLocation !== i) {
				gl.activeTexture(gl.TEXTURE0 + i);
				this.currentLocation = i;
			}
			gl.bindTexture(texture.target, this.emptyTextures[texture.target].texture);
			boundTextures[i] = null;
		}
	};
	/**
	* Ensures that current boundTextures all have FLOAT sampler type,
	* see {@link PIXI.SAMPLER_TYPES} for explanation.
	* @param maxTextures - number of locations to check
	*/
	TextureSystem.prototype.ensureSamplerType = function(maxTextures) {
		var _a = this, boundTextures = _a.boundTextures, hasIntegerTextures = _a.hasIntegerTextures, CONTEXT_UID = _a.CONTEXT_UID;
		if (!hasIntegerTextures) return;
		for (var i = maxTextures - 1; i >= 0; --i) {
			var tex = boundTextures[i];
			if (tex) {
				if (tex._glTextures[CONTEXT_UID].samplerType !== SAMPLER_TYPES.FLOAT) this.renderer.texture.unbind(tex);
			}
		}
	};
	/**
	* Initialize a texture
	* @private
	* @param texture - Texture to initialize
	*/
	TextureSystem.prototype.initTexture = function(texture) {
		var glTexture = new GLTexture(this.gl.createTexture());
		glTexture.dirtyId = -1;
		texture._glTextures[this.CONTEXT_UID] = glTexture;
		this.managedTextures.push(texture);
		texture.on("dispose", this.destroyTexture, this);
		return glTexture;
	};
	TextureSystem.prototype.initTextureType = function(texture, glTexture) {
		var _a, _b;
		glTexture.internalFormat = (_b = (_a = this.internalFormats[texture.type]) === null || _a === void 0 ? void 0 : _a[texture.format]) !== null && _b !== void 0 ? _b : texture.format;
		if (this.webGLVersion === 2 && texture.type === TYPES.HALF_FLOAT) glTexture.type = this.gl.HALF_FLOAT;
		else glTexture.type = texture.type;
	};
	/**
	* Update a texture
	* @private
	* @param {PIXI.BaseTexture} texture - Texture to initialize
	*/
	TextureSystem.prototype.updateTexture = function(texture) {
		var glTexture = texture._glTextures[this.CONTEXT_UID];
		if (!glTexture) return;
		var renderer = this.renderer;
		this.initTextureType(texture, glTexture);
		if (texture.resource && texture.resource.upload(renderer, texture, glTexture)) {
			if (glTexture.samplerType !== SAMPLER_TYPES.FLOAT) this.hasIntegerTextures = true;
		} else {
			var width = texture.realWidth;
			var height = texture.realHeight;
			var gl = renderer.gl;
			if (glTexture.width !== width || glTexture.height !== height || glTexture.dirtyId < 0) {
				glTexture.width = width;
				glTexture.height = height;
				gl.texImage2D(texture.target, 0, glTexture.internalFormat, width, height, 0, texture.format, glTexture.type, null);
			}
		}
		if (texture.dirtyStyleId !== glTexture.dirtyStyleId) this.updateTextureStyle(texture);
		glTexture.dirtyId = texture.dirtyId;
	};
	/**
	* Deletes the texture from WebGL
	* @private
	* @param texture - the texture to destroy
	* @param [skipRemove=false] - Whether to skip removing the texture from the TextureManager.
	*/
	TextureSystem.prototype.destroyTexture = function(texture, skipRemove) {
		var gl = this.gl;
		texture = texture.castToBaseTexture();
		if (texture._glTextures[this.CONTEXT_UID]) {
			this.unbind(texture);
			gl.deleteTexture(texture._glTextures[this.CONTEXT_UID].texture);
			texture.off("dispose", this.destroyTexture, this);
			delete texture._glTextures[this.CONTEXT_UID];
			if (!skipRemove) {
				var i = this.managedTextures.indexOf(texture);
				if (i !== -1) removeItems(this.managedTextures, i, 1);
			}
		}
	};
	/**
	* Update texture style such as mipmap flag
	* @private
	* @param {PIXI.BaseTexture} texture - Texture to update
	*/
	TextureSystem.prototype.updateTextureStyle = function(texture) {
		var glTexture = texture._glTextures[this.CONTEXT_UID];
		if (!glTexture) return;
		if ((texture.mipmap === MIPMAP_MODES.POW2 || this.webGLVersion !== 2) && !texture.isPowerOfTwo) glTexture.mipmap = false;
		else glTexture.mipmap = texture.mipmap >= 1;
		if (this.webGLVersion !== 2 && !texture.isPowerOfTwo) glTexture.wrapMode = WRAP_MODES.CLAMP;
		else glTexture.wrapMode = texture.wrapMode;
		if (texture.resource && texture.resource.style(this.renderer, texture, glTexture));
		else this.setStyle(texture, glTexture);
		glTexture.dirtyStyleId = texture.dirtyStyleId;
	};
	/**
	* Set style for texture
	* @private
	* @param texture - Texture to update
	* @param glTexture
	*/
	TextureSystem.prototype.setStyle = function(texture, glTexture) {
		var gl = this.gl;
		if (glTexture.mipmap && texture.mipmap !== MIPMAP_MODES.ON_MANUAL) gl.generateMipmap(texture.target);
		gl.texParameteri(texture.target, gl.TEXTURE_WRAP_S, glTexture.wrapMode);
		gl.texParameteri(texture.target, gl.TEXTURE_WRAP_T, glTexture.wrapMode);
		if (glTexture.mipmap) {
			gl.texParameteri(texture.target, gl.TEXTURE_MIN_FILTER, texture.scaleMode === SCALE_MODES.LINEAR ? gl.LINEAR_MIPMAP_LINEAR : gl.NEAREST_MIPMAP_NEAREST);
			var anisotropicExt = this.renderer.context.extensions.anisotropicFiltering;
			if (anisotropicExt && texture.anisotropicLevel > 0 && texture.scaleMode === SCALE_MODES.LINEAR) {
				var level = Math.min(texture.anisotropicLevel, gl.getParameter(anisotropicExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT));
				gl.texParameterf(texture.target, anisotropicExt.TEXTURE_MAX_ANISOTROPY_EXT, level);
			}
		} else gl.texParameteri(texture.target, gl.TEXTURE_MIN_FILTER, texture.scaleMode === SCALE_MODES.LINEAR ? gl.LINEAR : gl.NEAREST);
		gl.texParameteri(texture.target, gl.TEXTURE_MAG_FILTER, texture.scaleMode === SCALE_MODES.LINEAR ? gl.LINEAR : gl.NEAREST);
	};
	TextureSystem.prototype.destroy = function() {
		this.renderer = null;
	};
	return TextureSystem;
}();
var _systems = {
	__proto__: null,
	FilterSystem,
	BatchSystem,
	ContextSystem,
	FramebufferSystem,
	GeometrySystem,
	MaskSystem,
	ScissorSystem,
	StencilSystem,
	ProjectionSystem,
	RenderTextureSystem,
	ShaderSystem,
	StateSystem,
	TextureGCSystem,
	TextureSystem
};
var tempMatrix = new Matrix();
/**
* The AbstractRenderer is the base for a PixiJS Renderer. It is extended by the {@link PIXI.CanvasRenderer}
* and {@link PIXI.Renderer} which can be used for rendering a PixiJS scene.
* @abstract
* @class
* @extends PIXI.utils.EventEmitter
* @memberof PIXI
*/
var AbstractRenderer = function(_super) {
	__extends$1(AbstractRenderer, _super);
	/**
	* @param type - The renderer type.
	* @param {PIXI.IRendererOptions} [options] - The optional renderer parameters.
	* @param {boolean} [options.antialias=false] -
	*  **WebGL Only.** Whether to enable anti-aliasing. This may affect performance.
	* @param {boolean} [options.autoDensity=false] -
	*  Whether the CSS dimensions of the renderer's view should be resized automatically.
	* @param {number} [options.backgroundAlpha=1] -
	*  Transparency of the background color, value from `0` (fully transparent) to `1` (fully opaque).
	* @param {number} [options.backgroundColor=0x000000] -
	*  The background color used to clear the canvas. It accepts hex numbers (e.g. `0xff0000`).
	* @param {boolean} [options.clearBeforeRender=true] - Whether to clear the canvas before new render passes.
	* @param {PIXI.IRenderingContext} [options.context] - **WebGL Only.** User-provided WebGL rendering context object.
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
	* @param {number} [options.resolution=PIXI.settings.RESOLUTION] -
	*  The resolution / device pixel ratio of the renderer.
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
	function AbstractRenderer(type, options) {
		if (type === void 0) type = RENDERER_TYPE.UNKNOWN;
		var _this = _super.call(this) || this;
		options = Object.assign({}, settings.RENDER_OPTIONS, options);
		/**
		* The supplied constructor options.
		* @member {object}
		* @readonly
		*/
		_this.options = options;
		/**
		* The type of the renderer.
		* @member {number}
		* @default PIXI.RENDERER_TYPE.UNKNOWN
		* @see PIXI.RENDERER_TYPE
		*/
		_this.type = type;
		/**
		* Measurements of the screen. (0, 0, screenWidth, screenHeight).
		*
		* Its safe to use as filterArea or hitArea for the whole stage.
		* @member {PIXI.Rectangle}
		*/
		_this.screen = new Rectangle(0, 0, options.width, options.height);
		/**
		* The canvas element that everything is drawn to.
		* @member {HTMLCanvasElement}
		*/
		_this.view = options.view || settings.ADAPTER.createCanvas();
		/**
		* The resolution / device pixel ratio of the renderer.
		* @member {number}
		* @default PIXI.settings.RESOLUTION
		*/
		_this.resolution = options.resolution || settings.RESOLUTION;
		/**
		* Pass-thru setting for the canvas' context `alpha` property. This is typically
		* not something you need to fiddle with. If you want transparency, use `backgroundAlpha`.
		* @member {boolean}
		*/
		_this.useContextAlpha = options.useContextAlpha;
		/**
		* Whether CSS dimensions of canvas view should be resized to screen dimensions automatically.
		* @member {boolean}
		*/
		_this.autoDensity = !!options.autoDensity;
		/**
		* The value of the preserveDrawingBuffer flag affects whether or not the contents of
		* the stencil buffer is retained after rendering.
		* @member {boolean}
		*/
		_this.preserveDrawingBuffer = options.preserveDrawingBuffer;
		/**
		* This sets if the CanvasRenderer will clear the canvas or not before the new render pass.
		* If the scene is NOT transparent PixiJS will use a canvas sized fillRect operation every
		* frame to set the canvas background color. If the scene is transparent PixiJS will use clearRect
		* to clear the canvas every frame. Disable this by setting this to false. For example, if
		* your game has a canvas filling background image you often don't need this set.
		* @member {boolean}
		* @default
		*/
		_this.clearBeforeRender = options.clearBeforeRender;
		/**
		* The background color as a number.
		* @member {number}
		* @protected
		*/
		_this._backgroundColor = 0;
		/**
		* The background color as an [R, G, B, A] array.
		* @member {number[]}
		* @protected
		*/
		_this._backgroundColorRgba = [
			0,
			0,
			0,
			1
		];
		/**
		* The background color as a string.
		* @member {string}
		* @protected
		*/
		_this._backgroundColorString = "#000000";
		_this.backgroundColor = options.backgroundColor || _this._backgroundColor;
		_this.backgroundAlpha = options.backgroundAlpha;
		if (options.transparent !== void 0) {
			deprecation("6.0.0", "Option transparent is deprecated, please use backgroundAlpha instead.");
			_this.useContextAlpha = options.transparent;
			_this.backgroundAlpha = options.transparent ? 0 : 1;
		}
		/**
		* The last root object that the renderer tried to render.
		* @member {PIXI.DisplayObject}
		* @protected
		*/
		_this._lastObjectRendered = null;
		/**
		* Collection of plugins.
		* @readonly
		* @member {object}
		*/
		_this.plugins = {};
		return _this;
	}
	/**
	* Initialize the plugins.
	* @protected
	* @param {object} staticMap - The dictionary of statically saved plugins.
	*/
	AbstractRenderer.prototype.initPlugins = function(staticMap) {
		for (var o in staticMap) this.plugins[o] = new staticMap[o](this);
	};
	Object.defineProperty(AbstractRenderer.prototype, "width", {
		/**
		* Same as view.width, actual number of pixels in the canvas by horizontal.
		* @member {number}
		* @readonly
		* @default 800
		*/
		get: function() {
			return this.view.width;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(AbstractRenderer.prototype, "height", {
		/**
		* Same as view.height, actual number of pixels in the canvas by vertical.
		* @member {number}
		* @readonly
		* @default 600
		*/
		get: function() {
			return this.view.height;
		},
		enumerable: false,
		configurable: true
	});
	/**
	* Resizes the screen and canvas as close as possible to the specified width and height.
	* Canvas dimensions are multiplied by resolution and rounded to the nearest integers.
	* The new canvas dimensions divided by the resolution become the new screen dimensions.
	* @param desiredScreenWidth - The desired width of the screen.
	* @param desiredScreenHeight - The desired height of the screen.
	*/
	AbstractRenderer.prototype.resize = function(desiredScreenWidth, desiredScreenHeight) {
		this.view.width = Math.round(desiredScreenWidth * this.resolution);
		this.view.height = Math.round(desiredScreenHeight * this.resolution);
		var screenWidth = this.view.width / this.resolution;
		var screenHeight = this.view.height / this.resolution;
		this.screen.width = screenWidth;
		this.screen.height = screenHeight;
		if (this.autoDensity) {
			this.view.style.width = screenWidth + "px";
			this.view.style.height = screenHeight + "px";
		}
		/**
		* Fired after view has been resized.
		* @event PIXI.Renderer#resize
		* @param {number} screenWidth - The new width of the screen.
		* @param {number} screenHeight - The new height of the screen.
		*/
		this.emit("resize", screenWidth, screenHeight);
	};
	/**
	* @ignore
	*/
	AbstractRenderer.prototype.generateTexture = function(displayObject, options, resolution, region) {
		if (options === void 0) options = {};
		if (typeof options === "number") {
			deprecation("6.1.0", "generateTexture options (scaleMode, resolution, region) are now object options.");
			options = {
				scaleMode: options,
				resolution,
				region
			};
		}
		var manualRegion = options.region, textureOptions = __rest(options, ["region"]);
		region = manualRegion || displayObject.getLocalBounds(null, true);
		if (region.width === 0) region.width = 1;
		if (region.height === 0) region.height = 1;
		var renderTexture = RenderTexture.create(__assign({
			width: region.width,
			height: region.height
		}, textureOptions));
		tempMatrix.tx = -region.x;
		tempMatrix.ty = -region.y;
		this.render(displayObject, {
			renderTexture,
			clear: false,
			transform: tempMatrix,
			skipUpdateTransform: !!displayObject.parent
		});
		return renderTexture;
	};
	/**
	* Removes everything from the renderer and optionally removes the Canvas DOM element.
	* @param [removeView=false] - Removes the Canvas element from the DOM.
	*/
	AbstractRenderer.prototype.destroy = function(removeView) {
		for (var o in this.plugins) {
			this.plugins[o].destroy();
			this.plugins[o] = null;
		}
		if (removeView && this.view.parentNode) this.view.parentNode.removeChild(this.view);
		var thisAny = this;
		thisAny.plugins = null;
		thisAny.type = RENDERER_TYPE.UNKNOWN;
		thisAny.view = null;
		thisAny.screen = null;
		thisAny._tempDisplayObjectParent = null;
		thisAny.options = null;
		this._backgroundColorRgba = null;
		this._backgroundColorString = null;
		this._lastObjectRendered = null;
	};
	Object.defineProperty(AbstractRenderer.prototype, "backgroundColor", {
		/**
		* The background color to fill if not transparent
		* @member {number}
		*/
		get: function() {
			return this._backgroundColor;
		},
		set: function(value) {
			this._backgroundColor = value;
			this._backgroundColorString = hex2string(value);
			hex2rgb(value, this._backgroundColorRgba);
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(AbstractRenderer.prototype, "backgroundAlpha", {
		/**
		* The background color alpha. Setting this to 0 will make the canvas transparent.
		* @member {number}
		*/
		get: function() {
			return this._backgroundColorRgba[3];
		},
		set: function(value) {
			this._backgroundColorRgba[3] = value;
		},
		enumerable: false,
		configurable: true
	});
	return AbstractRenderer;
}(import_eventemitter3.default);
var GLBuffer = function() {
	function GLBuffer(buffer) {
		this.buffer = buffer || null;
		this.updateID = -1;
		this.byteLength = -1;
		this.refCount = 0;
	}
	return GLBuffer;
}();
/**
* System plugin to the renderer to manage buffers.
*
* WebGL uses Buffers as a way to store objects to the GPU.
* This system makes working with them a lot easier.
*
* Buffers are used in three main places in WebGL
* - geometry information
* - Uniform information (via uniform buffer objects - a WebGL 2 only feature)
* - Transform feedback information. (WebGL 2 only feature)
*
* This system will handle the binding of buffers to the GPU as well as uploading
* them. With this system, you never need to work directly with GPU buffers, but instead work with
* the PIXI.Buffer class.
* @class
* @memberof PIXI
*/
var BufferSystem = function() {
	/**
	* @param {PIXI.Renderer} renderer - The renderer this System works for.
	*/
	function BufferSystem(renderer) {
		this.renderer = renderer;
		this.managedBuffers = {};
		this.boundBufferBases = {};
	}
	/**
	* @ignore
	*/
	BufferSystem.prototype.destroy = function() {
		this.renderer = null;
	};
	/** Sets up the renderer context and necessary buffers. */
	BufferSystem.prototype.contextChange = function() {
		this.disposeAll(true);
		this.gl = this.renderer.gl;
		this.CONTEXT_UID = this.renderer.CONTEXT_UID;
	};
	/**
	* This binds specified buffer. On first run, it will create the webGL buffers for the context too
	* @param buffer - the buffer to bind to the renderer
	*/
	BufferSystem.prototype.bind = function(buffer) {
		var _a = this, gl = _a.gl, CONTEXT_UID = _a.CONTEXT_UID;
		var glBuffer = buffer._glBuffers[CONTEXT_UID] || this.createGLBuffer(buffer);
		gl.bindBuffer(buffer.type, glBuffer.buffer);
	};
	/**
	* Binds an uniform buffer to at the given index.
	*
	* A cache is used so a buffer will not be bound again if already bound.
	* @param buffer - the buffer to bind
	* @param index - the base index to bind it to.
	*/
	BufferSystem.prototype.bindBufferBase = function(buffer, index) {
		var _a = this, gl = _a.gl, CONTEXT_UID = _a.CONTEXT_UID;
		if (this.boundBufferBases[index] !== buffer) {
			var glBuffer = buffer._glBuffers[CONTEXT_UID] || this.createGLBuffer(buffer);
			this.boundBufferBases[index] = buffer;
			gl.bindBufferBase(gl.UNIFORM_BUFFER, index, glBuffer.buffer);
		}
	};
	/**
	* Binds a buffer whilst also binding its range.
	* This will make the buffer start from the offset supplied rather than 0 when it is read.
	* @param buffer - the buffer to bind
	* @param index - the base index to bind at, defaults to 0
	* @param offset - the offset to bind at (this is blocks of 256). 0 = 0, 1 = 256, 2 = 512 etc
	*/
	BufferSystem.prototype.bindBufferRange = function(buffer, index, offset) {
		var _a = this, gl = _a.gl, CONTEXT_UID = _a.CONTEXT_UID;
		offset = offset || 0;
		var glBuffer = buffer._glBuffers[CONTEXT_UID] || this.createGLBuffer(buffer);
		gl.bindBufferRange(gl.UNIFORM_BUFFER, index || 0, glBuffer.buffer, offset * 256, 256);
	};
	/**
	* Will ensure the data in the buffer is uploaded to the GPU.
	* @param {PIXI.Buffer} buffer - the buffer to update
	*/
	BufferSystem.prototype.update = function(buffer) {
		var _a = this, gl = _a.gl, CONTEXT_UID = _a.CONTEXT_UID;
		var glBuffer = buffer._glBuffers[CONTEXT_UID];
		if (buffer._updateID === glBuffer.updateID) return;
		glBuffer.updateID = buffer._updateID;
		gl.bindBuffer(buffer.type, glBuffer.buffer);
		if (glBuffer.byteLength >= buffer.data.byteLength) gl.bufferSubData(buffer.type, 0, buffer.data);
		else {
			var drawType = buffer.static ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW;
			glBuffer.byteLength = buffer.data.byteLength;
			gl.bufferData(buffer.type, buffer.data, drawType);
		}
	};
	/**
	* Disposes buffer
	* @param {PIXI.Buffer} buffer - buffer with data
	* @param {boolean} [contextLost=false] - If context was lost, we suppress deleteVertexArray
	*/
	BufferSystem.prototype.dispose = function(buffer, contextLost) {
		if (!this.managedBuffers[buffer.id]) return;
		delete this.managedBuffers[buffer.id];
		var glBuffer = buffer._glBuffers[this.CONTEXT_UID];
		var gl = this.gl;
		buffer.disposeRunner.remove(this);
		if (!glBuffer) return;
		if (!contextLost) gl.deleteBuffer(glBuffer.buffer);
		delete buffer._glBuffers[this.CONTEXT_UID];
	};
	/**
	* dispose all WebGL resources of all managed buffers
	* @param {boolean} [contextLost=false] - If context was lost, we suppress `gl.delete` calls
	*/
	BufferSystem.prototype.disposeAll = function(contextLost) {
		var all = Object.keys(this.managedBuffers);
		for (var i = 0; i < all.length; i++) this.dispose(this.managedBuffers[all[i]], contextLost);
	};
	/**
	* creates and attaches a GLBuffer object tied to the current context.
	* @param buffer
	* @protected
	*/
	BufferSystem.prototype.createGLBuffer = function(buffer) {
		var _a = this, CONTEXT_UID = _a.CONTEXT_UID, gl = _a.gl;
		buffer._glBuffers[CONTEXT_UID] = new GLBuffer(gl.createBuffer());
		this.managedBuffers[buffer.id] = buffer;
		buffer.disposeRunner.add(this);
		return buffer._glBuffers[CONTEXT_UID];
	};
	return BufferSystem;
}();
/**
* The Renderer draws the scene and all its content onto a WebGL enabled canvas.
*
* This renderer should be used for browsers that support WebGL.
*
* This renderer works by automatically managing WebGLBatchesm, so no need for Sprite Batches or Sprite Clouds.
* Don't forget to add the view to your DOM or you will not see anything!
*
* Renderer is composed of systems that manage specific tasks. The following systems are added by default
* whenever you create a renderer:
*
* | System                               | Description                                                                   |
* | ------------------------------------ | ----------------------------------------------------------------------------- |
* | {@link PIXI.BatchSystem}             | This manages object renderers that defer rendering until a flush.             |
* | {@link PIXI.ContextSystem}           | This manages the WebGL context and extensions.                                |
* | {@link PIXI.EventSystem}             | This manages UI events.                                                       |
* | {@link PIXI.FilterSystem}            | This manages the filtering pipeline for post-processing effects.              |
* | {@link PIXI.FramebufferSystem}       | This manages framebuffers, which are used for offscreen rendering.            |
* | {@link PIXI.GeometrySystem}          | This manages geometries & buffers, which are used to draw object meshes.      |
* | {@link PIXI.MaskSystem}              | This manages masking operations.                                              |
* | {@link PIXI.ProjectionSystem}        | This manages the `projectionMatrix`, used by shaders to get NDC coordinates.  |
* | {@link PIXI.RenderTextureSystem}     | This manages render-textures, which are an abstraction over framebuffers.     |
* | {@link PIXI.ScissorSystem}           | This handles scissor masking, and is used internally by {@link MaskSystem}    |
* | {@link PIXI.ShaderSystem}            | This manages shaders, programs that run on the GPU to calculate 'em pixels.   |
* | {@link PIXI.StateSystem}             | This manages the WebGL state variables like blend mode, depth testing, etc.   |
* | {@link PIXI.StencilSystem}           | This handles stencil masking, and is used internally by {@link MaskSystem}    |
* | {@link PIXI.TextureSystem}           | This manages textures and their resources on the GPU.                         |
* | {@link PIXI.TextureGCSystem}         | This will automatically remove textures from the GPU if they are not used.    |
*
* The breadth of the API surface provided by the renderer is contained within these systems.
* @memberof PIXI
*/
var Renderer = function(_super) {
	__extends$1(Renderer, _super);
	/**
	* @param {PIXI.IRendererOptions} [options] - The optional renderer parameters.
	* @param {boolean} [options.antialias=false] -
	*  **WebGL Only.** Whether to enable anti-aliasing. This may affect performance.
	* @param {boolean} [options.autoDensity=false] -
	*  Whether the CSS dimensions of the renderer's view should be resized automatically.
	* @param {number} [options.backgroundAlpha=1] -
	*  Transparency of the background color, value from `0` (fully transparent) to `1` (fully opaque).
	* @param {number} [options.backgroundColor=0x000000] -
	*  The background color used to clear the canvas. It accepts hex numbers (e.g. `0xff0000`).
	* @param {boolean} [options.clearBeforeRender=true] - Whether to clear the canvas before new render passes.
	* @param {PIXI.IRenderingContext} [options.context] - **WebGL Only.** User-provided WebGL rendering context object.
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
	* @param {number} [options.resolution=PIXI.settings.RESOLUTION] -
	*  The resolution / device pixel ratio of the renderer.
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
	function Renderer(options) {
		var _this = _super.call(this, RENDERER_TYPE.WEBGL, options) || this;
		options = _this.options;
		_this.gl = null;
		_this.CONTEXT_UID = 0;
		_this.runners = {
			destroy: new Runner("destroy"),
			contextChange: new Runner("contextChange"),
			reset: new Runner("reset"),
			update: new Runner("update"),
			postrender: new Runner("postrender"),
			prerender: new Runner("prerender"),
			resize: new Runner("resize")
		};
		_this.runners.contextChange.add(_this);
		_this.globalUniforms = new UniformGroup({ projectionMatrix: new Matrix() }, true);
		_this.addSystem(MaskSystem, "mask").addSystem(ContextSystem, "context").addSystem(StateSystem, "state").addSystem(ShaderSystem, "shader").addSystem(TextureSystem, "texture").addSystem(BufferSystem, "buffer").addSystem(GeometrySystem, "geometry").addSystem(FramebufferSystem, "framebuffer").addSystem(ScissorSystem, "scissor").addSystem(StencilSystem, "stencil").addSystem(ProjectionSystem, "projection").addSystem(TextureGCSystem, "textureGC").addSystem(FilterSystem, "filter").addSystem(RenderTextureSystem, "renderTexture").addSystem(BatchSystem, "batch");
		_this.initPlugins(Renderer.__plugins);
		_this.multisample = void 0;
		if (options.context) _this.context.initFromContext(options.context);
		else _this.context.initFromOptions({
			alpha: !!_this.useContextAlpha,
			antialias: options.antialias,
			premultipliedAlpha: _this.useContextAlpha && _this.useContextAlpha !== "notMultiplied",
			stencil: true,
			preserveDrawingBuffer: options.preserveDrawingBuffer,
			powerPreference: _this.options.powerPreference
		});
		_this.renderingToScreen = true;
		sayHello(_this.context.webGLVersion === 2 ? "WebGL 2" : "WebGL 1");
		_this.resize(_this.options.width, _this.options.height);
		return _this;
	}
	/**
	* Create renderer if WebGL is available. Overrideable
	* by the **@pixi/canvas-renderer** package to allow fallback.
	* throws error if WebGL is not available.
	* @param options
	* @private
	*/
	Renderer.create = function(options) {
		if (isWebGLSupported()) return new Renderer(options);
		throw new Error("WebGL unsupported in this browser, use \"pixi.js-legacy\" for fallback canvas2d support.");
	};
	Renderer.prototype.contextChange = function() {
		var gl = this.gl;
		var samples;
		if (this.context.webGLVersion === 1) {
			var framebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
			samples = gl.getParameter(gl.SAMPLES);
			gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
		} else {
			var framebuffer = gl.getParameter(gl.DRAW_FRAMEBUFFER_BINDING);
			gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
			samples = gl.getParameter(gl.SAMPLES);
			gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, framebuffer);
		}
		if (samples >= MSAA_QUALITY.HIGH) this.multisample = MSAA_QUALITY.HIGH;
		else if (samples >= MSAA_QUALITY.MEDIUM) this.multisample = MSAA_QUALITY.MEDIUM;
		else if (samples >= MSAA_QUALITY.LOW) this.multisample = MSAA_QUALITY.LOW;
		else this.multisample = MSAA_QUALITY.NONE;
	};
	/**
	* Add a new system to the renderer.
	* @param ClassRef - Class reference
	* @param name - Property name for system, if not specified
	*        will use a static `name` property on the class itself. This
	*        name will be assigned as s property on the Renderer so make
	*        sure it doesn't collide with properties on Renderer.
	* @returns Return instance of renderer
	*/
	Renderer.prototype.addSystem = function(ClassRef, name) {
		var system = new ClassRef(this);
		if (this[name]) throw new Error("Whoops! The name \"" + name + "\" is already in use");
		this[name] = system;
		for (var i in this.runners) this.runners[i].add(system);
		/**
		* Fired after rendering finishes.
		* @event PIXI.Renderer#postrender
		*/
		/**
		* Fired before rendering starts.
		* @event PIXI.Renderer#prerender
		*/
		/**
		* Fired when the WebGL context is set.
		* @event PIXI.Renderer#context
		* @param {WebGLRenderingContext} gl - WebGL context.
		*/
		return this;
	};
	/**
	* @ignore
	*/
	Renderer.prototype.render = function(displayObject, options) {
		var renderTexture;
		var clear;
		var transform;
		var skipUpdateTransform;
		if (options) {
			if (options instanceof RenderTexture) {
				deprecation("6.0.0", "Renderer#render arguments changed, use options instead.");
				renderTexture = options;
				clear = arguments[2];
				transform = arguments[3];
				skipUpdateTransform = arguments[4];
			} else {
				renderTexture = options.renderTexture;
				clear = options.clear;
				transform = options.transform;
				skipUpdateTransform = options.skipUpdateTransform;
			}
		}
		this.renderingToScreen = !renderTexture;
		this.runners.prerender.emit();
		this.emit("prerender");
		this.projection.transform = transform;
		if (this.context.isLost) return;
		if (!renderTexture) this._lastObjectRendered = displayObject;
		if (!skipUpdateTransform) {
			var cacheParent = displayObject.enableTempParent();
			displayObject.updateTransform();
			displayObject.disableTempParent(cacheParent);
		}
		this.renderTexture.bind(renderTexture);
		this.batch.currentRenderer.start();
		if (clear !== void 0 ? clear : this.clearBeforeRender) this.renderTexture.clear();
		displayObject.render(this);
		this.batch.currentRenderer.flush();
		if (renderTexture) renderTexture.baseTexture.update();
		this.runners.postrender.emit();
		this.projection.transform = null;
		this.emit("postrender");
	};
	/**
	* @override
	* @ignore
	*/
	Renderer.prototype.generateTexture = function(displayObject, options, resolution, region) {
		if (options === void 0) options = {};
		var renderTexture = _super.prototype.generateTexture.call(this, displayObject, options, resolution, region);
		this.framebuffer.blit();
		return renderTexture;
	};
	/**
	* Resizes the WebGL view to the specified width and height.
	* @param desiredScreenWidth - The desired width of the screen.
	* @param desiredScreenHeight - The desired height of the screen.
	*/
	Renderer.prototype.resize = function(desiredScreenWidth, desiredScreenHeight) {
		_super.prototype.resize.call(this, desiredScreenWidth, desiredScreenHeight);
		this.runners.resize.emit(this.screen.height, this.screen.width);
	};
	/**
	* Resets the WebGL state so you can render things however you fancy!
	* @returns Returns itself.
	*/
	Renderer.prototype.reset = function() {
		this.runners.reset.emit();
		return this;
	};
	/** Clear the frame buffer. */
	Renderer.prototype.clear = function() {
		this.renderTexture.bind();
		this.renderTexture.clear();
	};
	/**
	* Removes everything from the renderer (event listeners, spritebatch, etc...)
	* @param [removeView=false] - Removes the Canvas element from the DOM.
	*  See: https://github.com/pixijs/pixi.js/issues/2233
	*/
	Renderer.prototype.destroy = function(removeView) {
		this.runners.destroy.emit();
		for (var r in this.runners) this.runners[r].destroy();
		_super.prototype.destroy.call(this, removeView);
		this.gl = null;
	};
	Object.defineProperty(Renderer.prototype, "extract", {
		/**
		* Please use `plugins.extract` instead.
		* @member {PIXI.Extract} extract
		* @deprecated since 6.0.0
		* @readonly
		*/
		get: function() {
			deprecation("6.0.0", "Renderer#extract has been deprecated, please use Renderer#plugins.extract instead.");
			return this.plugins.extract;
		},
		enumerable: false,
		configurable: true
	});
	/**
	* Use the {@link PIXI.extensions.add} API to register plugins.
	* @deprecated since 6.5.0
	* @param pluginName - The name of the plugin.
	* @param ctor - The constructor function or class for the plugin.
	*/
	Renderer.registerPlugin = function(pluginName, ctor) {
		deprecation("6.5.0", "Renderer.registerPlugin() has been deprecated, please use extensions.add() instead.");
		extensions.add({
			name: pluginName,
			type: ExtensionType.RendererPlugin,
			ref: ctor
		});
	};
	/**
	* Collection of installed plugins. These are included by default in PIXI, but can be excluded
	* by creating a custom build. Consult the README for more information about creating custom
	* builds and excluding plugins.
	* @readonly
	* @property {PIXI.AccessibilityManager} accessibility Support tabbing interactive elements.
	* @property {PIXI.Extract} extract Extract image data from renderer.
	* @property {PIXI.InteractionManager} interaction Handles mouse, touch and pointer events.
	* @property {PIXI.ParticleRenderer} particle Renderer for ParticleContainer objects.
	* @property {PIXI.Prepare} prepare Pre-render display objects.
	* @property {PIXI.BatchRenderer} batch Batching of Sprite, Graphics and Mesh objects.
	* @property {PIXI.TilingSpriteRenderer} tilingSprite Renderer for TilingSprite objects.
	*/
	Renderer.__plugins = {};
	return Renderer;
}(AbstractRenderer);
extensions.handleByMap(ExtensionType.RendererPlugin, Renderer.__plugins);
/**
* This helper function will automatically detect which renderer you should be using.
* WebGL is the preferred renderer as it is a lot faster. If WebGL is not supported by
* the browser then this function will return a canvas renderer.
* @memberof PIXI
* @function autoDetectRenderer
* @param {PIXI.IRendererOptionsAuto} [options] - The optional renderer parameters.
* @param {boolean} [options.antialias=false] -
*  **WebGL Only.** Whether to enable anti-aliasing. This may affect performance.
* @param {boolean} [options.autoDensity=false] -
*  Whether the CSS dimensions of the renderer's view should be resized automatically.
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
* @param {number} [options.resolution=PIXI.settings.RESOLUTION] -
*  The resolution / device pixel ratio of the renderer.
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
* @returns {PIXI.Renderer|PIXI.CanvasRenderer}
*  Returns {@link PIXI.Renderer} if WebGL is available, otherwise {@link PIXI.CanvasRenderer}.
*/
function autoDetectRenderer(options) {
	return Renderer.create(options);
}
var $defaultVertex = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}";
var $defaultFilterVertex = "attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n    gl_Position = filterVertexPosition();\n    vTextureCoord = filterTextureCoord();\n}\n";
/**
* Default vertex shader
* @memberof PIXI
* @member {string} defaultVertex
*/
/**
* Default filter vertex shader
* @memberof PIXI
* @member {string} defaultFilterVertex
*/
var defaultVertex$1 = $defaultVertex;
var defaultFilterVertex = $defaultFilterVertex;
/**
* Use the ISystem interface instead.
* @deprecated since 6.1.0
* @memberof PIXI
*/
var System = function() {
	/**
	* @param renderer - Reference to Renderer
	*/
	function System(renderer) {
		deprecation("6.1.0", "System class is deprecated, implemement ISystem interface instead.");
		this.renderer = renderer;
	}
	/** Destroy and don't use after this. */
	System.prototype.destroy = function() {
		this.renderer = null;
	};
	return System;
}();
/**
* Used by the batcher to draw batches.
* Each one of these contains all information required to draw a bound geometry.
* @memberof PIXI
*/
var BatchDrawCall = function() {
	function BatchDrawCall() {
		this.texArray = null;
		this.blend = 0;
		this.type = DRAW_MODES.TRIANGLES;
		this.start = 0;
		this.size = 0;
		this.data = null;
	}
	return BatchDrawCall;
}();
/**
* Used by the batcher to build texture batches.
* Holds list of textures and their respective locations.
* @memberof PIXI
*/
var BatchTextureArray = function() {
	function BatchTextureArray() {
		this.elements = [];
		this.ids = [];
		this.count = 0;
	}
	BatchTextureArray.prototype.clear = function() {
		for (var i = 0; i < this.count; i++) this.elements[i] = null;
		this.count = 0;
	};
	return BatchTextureArray;
}();
/**
* Flexible wrapper around `ArrayBuffer` that also provides typed array views on demand.
* @memberof PIXI
*/
var ViewableBuffer = function() {
	function ViewableBuffer(sizeOrBuffer) {
		if (typeof sizeOrBuffer === "number") this.rawBinaryData = new ArrayBuffer(sizeOrBuffer);
		else if (sizeOrBuffer instanceof Uint8Array) this.rawBinaryData = sizeOrBuffer.buffer;
		else this.rawBinaryData = sizeOrBuffer;
		this.uint32View = new Uint32Array(this.rawBinaryData);
		this.float32View = new Float32Array(this.rawBinaryData);
	}
	Object.defineProperty(ViewableBuffer.prototype, "int8View", {
		/** View on the raw binary data as a `Int8Array`. */
		get: function() {
			if (!this._int8View) this._int8View = new Int8Array(this.rawBinaryData);
			return this._int8View;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(ViewableBuffer.prototype, "uint8View", {
		/** View on the raw binary data as a `Uint8Array`. */
		get: function() {
			if (!this._uint8View) this._uint8View = new Uint8Array(this.rawBinaryData);
			return this._uint8View;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(ViewableBuffer.prototype, "int16View", {
		/**  View on the raw binary data as a `Int16Array`. */
		get: function() {
			if (!this._int16View) this._int16View = new Int16Array(this.rawBinaryData);
			return this._int16View;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(ViewableBuffer.prototype, "uint16View", {
		/** View on the raw binary data as a `Uint16Array`. */
		get: function() {
			if (!this._uint16View) this._uint16View = new Uint16Array(this.rawBinaryData);
			return this._uint16View;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(ViewableBuffer.prototype, "int32View", {
		/** View on the raw binary data as a `Int32Array`. */
		get: function() {
			if (!this._int32View) this._int32View = new Int32Array(this.rawBinaryData);
			return this._int32View;
		},
		enumerable: false,
		configurable: true
	});
	/**
	* Returns the view of the given type.
	* @param type - One of `int8`, `uint8`, `int16`,
	*    `uint16`, `int32`, `uint32`, and `float32`.
	* @returns - typed array of given type
	*/
	ViewableBuffer.prototype.view = function(type) {
		return this[type + "View"];
	};
	/** Destroys all buffer references. Do not use after calling this. */
	ViewableBuffer.prototype.destroy = function() {
		this.rawBinaryData = null;
		this._int8View = null;
		this._uint8View = null;
		this._int16View = null;
		this._uint16View = null;
		this._int32View = null;
		this.uint32View = null;
		this.float32View = null;
	};
	ViewableBuffer.sizeOf = function(type) {
		switch (type) {
			case "int8":
			case "uint8": return 1;
			case "int16":
			case "uint16": return 2;
			case "int32":
			case "uint32":
			case "float32": return 4;
			default: throw new Error(type + " isn't a valid view type");
		}
	};
	return ViewableBuffer;
}();
/**
* Renderer dedicated to drawing and batching sprites.
*
* This is the default batch renderer. It buffers objects
* with texture-based geometries and renders them in
* batches. It uploads multiple textures to the GPU to
* reduce to the number of draw calls.
* @memberof PIXI
*/
var AbstractBatchRenderer = function(_super) {
	__extends$1(AbstractBatchRenderer, _super);
	/**
	* This will hook onto the renderer's `contextChange`
	* and `prerender` signals.
	* @param {PIXI.Renderer} renderer - The renderer this works for.
	*/
	function AbstractBatchRenderer(renderer) {
		var _this = _super.call(this, renderer) || this;
		_this.shaderGenerator = null;
		_this.geometryClass = null;
		_this.vertexSize = null;
		_this.state = State.for2d();
		_this.size = settings.SPRITE_BATCH_SIZE * 4;
		_this._vertexCount = 0;
		_this._indexCount = 0;
		_this._bufferedElements = [];
		_this._bufferedTextures = [];
		_this._bufferSize = 0;
		_this._shader = null;
		_this._packedGeometries = [];
		_this._packedGeometryPoolSize = 2;
		_this._flushId = 0;
		_this._aBuffers = {};
		_this._iBuffers = {};
		_this.MAX_TEXTURES = 1;
		_this.renderer.on("prerender", _this.onPrerender, _this);
		renderer.runners.contextChange.add(_this);
		_this._dcIndex = 0;
		_this._aIndex = 0;
		_this._iIndex = 0;
		_this._attributeBuffer = null;
		_this._indexBuffer = null;
		_this._tempBoundTextures = [];
		return _this;
	}
	/**
	* Handles the `contextChange` signal.
	*
	* It calculates `this.MAX_TEXTURES` and allocating the packed-geometry object pool.
	*/
	AbstractBatchRenderer.prototype.contextChange = function() {
		var gl = this.renderer.gl;
		if (settings.PREFER_ENV === ENV.WEBGL_LEGACY) this.MAX_TEXTURES = 1;
		else {
			this.MAX_TEXTURES = Math.min(gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS), settings.SPRITE_MAX_TEXTURES);
			this.MAX_TEXTURES = checkMaxIfStatementsInShader(this.MAX_TEXTURES, gl);
		}
		this._shader = this.shaderGenerator.generateShader(this.MAX_TEXTURES);
		for (var i = 0; i < this._packedGeometryPoolSize; i++) this._packedGeometries[i] = new this.geometryClass();
		this.initFlushBuffers();
	};
	/** Makes sure that static and dynamic flush pooled objects have correct dimensions. */
	AbstractBatchRenderer.prototype.initFlushBuffers = function() {
		var _drawCallPool = AbstractBatchRenderer._drawCallPool, _textureArrayPool = AbstractBatchRenderer._textureArrayPool;
		var MAX_SPRITES = this.size / 4;
		var MAX_TA = Math.floor(MAX_SPRITES / this.MAX_TEXTURES) + 1;
		while (_drawCallPool.length < MAX_SPRITES) _drawCallPool.push(new BatchDrawCall());
		while (_textureArrayPool.length < MAX_TA) _textureArrayPool.push(new BatchTextureArray());
		for (var i = 0; i < this.MAX_TEXTURES; i++) this._tempBoundTextures[i] = null;
	};
	/** Handles the `prerender` signal. It ensures that flushes start from the first geometry object again. */
	AbstractBatchRenderer.prototype.onPrerender = function() {
		this._flushId = 0;
	};
	/**
	* Buffers the "batchable" object. It need not be rendered immediately.
	* @param {PIXI.DisplayObject} element - the element to render when
	*    using this renderer
	*/
	AbstractBatchRenderer.prototype.render = function(element) {
		if (!element._texture.valid) return;
		if (this._vertexCount + element.vertexData.length / 2 > this.size) this.flush();
		this._vertexCount += element.vertexData.length / 2;
		this._indexCount += element.indices.length;
		this._bufferedTextures[this._bufferSize] = element._texture.baseTexture;
		this._bufferedElements[this._bufferSize++] = element;
	};
	AbstractBatchRenderer.prototype.buildTexturesAndDrawCalls = function() {
		var _a = this, textures = _a._bufferedTextures, MAX_TEXTURES = _a.MAX_TEXTURES;
		var textureArrays = AbstractBatchRenderer._textureArrayPool;
		var batch = this.renderer.batch;
		var boundTextures = this._tempBoundTextures;
		var touch = this.renderer.textureGC.count;
		var TICK = ++BaseTexture._globalBatch;
		var countTexArrays = 0;
		var texArray = textureArrays[0];
		var start = 0;
		batch.copyBoundTextures(boundTextures, MAX_TEXTURES);
		for (var i = 0; i < this._bufferSize; ++i) {
			var tex = textures[i];
			textures[i] = null;
			if (tex._batchEnabled === TICK) continue;
			if (texArray.count >= MAX_TEXTURES) {
				batch.boundArray(texArray, boundTextures, TICK, MAX_TEXTURES);
				this.buildDrawCalls(texArray, start, i);
				start = i;
				texArray = textureArrays[++countTexArrays];
				++TICK;
			}
			tex._batchEnabled = TICK;
			tex.touched = touch;
			texArray.elements[texArray.count++] = tex;
		}
		if (texArray.count > 0) {
			batch.boundArray(texArray, boundTextures, TICK, MAX_TEXTURES);
			this.buildDrawCalls(texArray, start, this._bufferSize);
			++countTexArrays;
			++TICK;
		}
		for (var i = 0; i < boundTextures.length; i++) boundTextures[i] = null;
		BaseTexture._globalBatch = TICK;
	};
	/**
	* Populating drawcalls for rendering
	* @param texArray
	* @param start
	* @param finish
	*/
	AbstractBatchRenderer.prototype.buildDrawCalls = function(texArray, start, finish) {
		var _a = this, elements = _a._bufferedElements, _attributeBuffer = _a._attributeBuffer, _indexBuffer = _a._indexBuffer, vertexSize = _a.vertexSize;
		var drawCalls = AbstractBatchRenderer._drawCallPool;
		var dcIndex = this._dcIndex;
		var aIndex = this._aIndex;
		var iIndex = this._iIndex;
		var drawCall = drawCalls[dcIndex];
		drawCall.start = this._iIndex;
		drawCall.texArray = texArray;
		for (var i = start; i < finish; ++i) {
			var sprite = elements[i];
			var spriteBlendMode = premultiplyBlendMode[sprite._texture.baseTexture.alphaMode ? 1 : 0][sprite.blendMode];
			elements[i] = null;
			if (start < i && drawCall.blend !== spriteBlendMode) {
				drawCall.size = iIndex - drawCall.start;
				start = i;
				drawCall = drawCalls[++dcIndex];
				drawCall.texArray = texArray;
				drawCall.start = iIndex;
			}
			this.packInterleavedGeometry(sprite, _attributeBuffer, _indexBuffer, aIndex, iIndex);
			aIndex += sprite.vertexData.length / 2 * vertexSize;
			iIndex += sprite.indices.length;
			drawCall.blend = spriteBlendMode;
		}
		if (start < finish) {
			drawCall.size = iIndex - drawCall.start;
			++dcIndex;
		}
		this._dcIndex = dcIndex;
		this._aIndex = aIndex;
		this._iIndex = iIndex;
	};
	/**
	* Bind textures for current rendering
	* @param texArray
	*/
	AbstractBatchRenderer.prototype.bindAndClearTexArray = function(texArray) {
		var textureSystem = this.renderer.texture;
		for (var j = 0; j < texArray.count; j++) {
			textureSystem.bind(texArray.elements[j], texArray.ids[j]);
			texArray.elements[j] = null;
		}
		texArray.count = 0;
	};
	AbstractBatchRenderer.prototype.updateGeometry = function() {
		var _a = this, packedGeometries = _a._packedGeometries, attributeBuffer = _a._attributeBuffer, indexBuffer = _a._indexBuffer;
		if (!settings.CAN_UPLOAD_SAME_BUFFER) {
			if (this._packedGeometryPoolSize <= this._flushId) {
				this._packedGeometryPoolSize++;
				packedGeometries[this._flushId] = new this.geometryClass();
			}
			packedGeometries[this._flushId]._buffer.update(attributeBuffer.rawBinaryData);
			packedGeometries[this._flushId]._indexBuffer.update(indexBuffer);
			this.renderer.geometry.bind(packedGeometries[this._flushId]);
			this.renderer.geometry.updateBuffers();
			this._flushId++;
		} else {
			packedGeometries[this._flushId]._buffer.update(attributeBuffer.rawBinaryData);
			packedGeometries[this._flushId]._indexBuffer.update(indexBuffer);
			this.renderer.geometry.updateBuffers();
		}
	};
	AbstractBatchRenderer.prototype.drawBatches = function() {
		var dcCount = this._dcIndex;
		var _a = this.renderer, gl = _a.gl, stateSystem = _a.state;
		var drawCalls = AbstractBatchRenderer._drawCallPool;
		var curTexArray = null;
		for (var i = 0; i < dcCount; i++) {
			var _b = drawCalls[i], texArray = _b.texArray, type = _b.type, size = _b.size, start = _b.start, blend = _b.blend;
			if (curTexArray !== texArray) {
				curTexArray = texArray;
				this.bindAndClearTexArray(texArray);
			}
			this.state.blendMode = blend;
			stateSystem.set(this.state);
			gl.drawElements(type, size, gl.UNSIGNED_SHORT, start * 2);
		}
	};
	/** Renders the content _now_ and empties the current batch. */
	AbstractBatchRenderer.prototype.flush = function() {
		if (this._vertexCount === 0) return;
		this._attributeBuffer = this.getAttributeBuffer(this._vertexCount);
		this._indexBuffer = this.getIndexBuffer(this._indexCount);
		this._aIndex = 0;
		this._iIndex = 0;
		this._dcIndex = 0;
		this.buildTexturesAndDrawCalls();
		this.updateGeometry();
		this.drawBatches();
		this._bufferSize = 0;
		this._vertexCount = 0;
		this._indexCount = 0;
	};
	/** Starts a new sprite batch. */
	AbstractBatchRenderer.prototype.start = function() {
		this.renderer.state.set(this.state);
		this.renderer.texture.ensureSamplerType(this.MAX_TEXTURES);
		this.renderer.shader.bind(this._shader);
		if (settings.CAN_UPLOAD_SAME_BUFFER) this.renderer.geometry.bind(this._packedGeometries[this._flushId]);
	};
	/** Stops and flushes the current batch. */
	AbstractBatchRenderer.prototype.stop = function() {
		this.flush();
	};
	/** Destroys this `AbstractBatchRenderer`. It cannot be used again. */
	AbstractBatchRenderer.prototype.destroy = function() {
		for (var i = 0; i < this._packedGeometryPoolSize; i++) if (this._packedGeometries[i]) this._packedGeometries[i].destroy();
		this.renderer.off("prerender", this.onPrerender, this);
		this._aBuffers = null;
		this._iBuffers = null;
		this._packedGeometries = null;
		this._attributeBuffer = null;
		this._indexBuffer = null;
		if (this._shader) {
			this._shader.destroy();
			this._shader = null;
		}
		_super.prototype.destroy.call(this);
	};
	/**
	* Fetches an attribute buffer from `this._aBuffers` that can hold atleast `size` floats.
	* @param size - minimum capacity required
	* @returns - buffer than can hold atleast `size` floats
	*/
	AbstractBatchRenderer.prototype.getAttributeBuffer = function(size) {
		var roundedP2 = nextPow2(Math.ceil(size / 8));
		var roundedSizeIndex = log2(roundedP2);
		var roundedSize = roundedP2 * 8;
		if (this._aBuffers.length <= roundedSizeIndex) this._iBuffers.length = roundedSizeIndex + 1;
		var buffer = this._aBuffers[roundedSize];
		if (!buffer) this._aBuffers[roundedSize] = buffer = new ViewableBuffer(roundedSize * this.vertexSize * 4);
		return buffer;
	};
	/**
	* Fetches an index buffer from `this._iBuffers` that can
	* have at least `size` capacity.
	* @param size - minimum required capacity
	* @returns - buffer that can fit `size` indices.
	*/
	AbstractBatchRenderer.prototype.getIndexBuffer = function(size) {
		var roundedP2 = nextPow2(Math.ceil(size / 12));
		var roundedSizeIndex = log2(roundedP2);
		var roundedSize = roundedP2 * 12;
		if (this._iBuffers.length <= roundedSizeIndex) this._iBuffers.length = roundedSizeIndex + 1;
		var buffer = this._iBuffers[roundedSizeIndex];
		if (!buffer) this._iBuffers[roundedSizeIndex] = buffer = new Uint16Array(roundedSize);
		return buffer;
	};
	/**
	* Takes the four batching parameters of `element`, interleaves
	* and pushes them into the batching attribute/index buffers given.
	*
	* It uses these properties: `vertexData` `uvs`, `textureId` and
	* `indicies`. It also uses the "tint" of the base-texture, if
	* present.
	* @param {PIXI.DisplayObject} element - element being rendered
	* @param attributeBuffer - attribute buffer.
	* @param indexBuffer - index buffer
	* @param aIndex - number of floats already in the attribute buffer
	* @param iIndex - number of indices already in `indexBuffer`
	*/
	AbstractBatchRenderer.prototype.packInterleavedGeometry = function(element, attributeBuffer, indexBuffer, aIndex, iIndex) {
		var uint32View = attributeBuffer.uint32View, float32View = attributeBuffer.float32View;
		var packedVertices = aIndex / this.vertexSize;
		var uvs = element.uvs;
		var indicies = element.indices;
		var vertexData = element.vertexData;
		var textureId = element._texture.baseTexture._batchLocation;
		var alpha = Math.min(element.worldAlpha, 1);
		var argb = alpha < 1 && element._texture.baseTexture.alphaMode ? premultiplyTint(element._tintRGB, alpha) : element._tintRGB + (alpha * 255 << 24);
		for (var i = 0; i < vertexData.length; i += 2) {
			float32View[aIndex++] = vertexData[i];
			float32View[aIndex++] = vertexData[i + 1];
			float32View[aIndex++] = uvs[i];
			float32View[aIndex++] = uvs[i + 1];
			uint32View[aIndex++] = argb;
			float32View[aIndex++] = textureId;
		}
		for (var i = 0; i < indicies.length; i++) indexBuffer[iIndex++] = packedVertices + indicies[i];
	};
	/**
	* Pool of `BatchDrawCall` objects that `flush` used
	* to create "batches" of the objects being rendered.
	*
	* These are never re-allocated again.
	* Shared between all batch renderers because it can be only one "flush" working at the moment.
	* @member {PIXI.BatchDrawCall[]}
	*/
	AbstractBatchRenderer._drawCallPool = [];
	/**
	* Pool of `BatchDrawCall` objects that `flush` used
	* to create "batches" of the objects being rendered.
	*
	* These are never re-allocated again.
	* Shared between all batch renderers because it can be only one "flush" working at the moment.
	* @member {PIXI.BatchTextureArray[]}
	*/
	AbstractBatchRenderer._textureArrayPool = [];
	return AbstractBatchRenderer;
}(ObjectRenderer);
/**
* Helper that generates batching multi-texture shader. Use it with your new BatchRenderer
* @memberof PIXI
*/
var BatchShaderGenerator = function() {
	/**
	* @param vertexSrc - Vertex shader
	* @param fragTemplate - Fragment shader template
	*/
	function BatchShaderGenerator(vertexSrc, fragTemplate) {
		this.vertexSrc = vertexSrc;
		this.fragTemplate = fragTemplate;
		this.programCache = {};
		this.defaultGroupCache = {};
		if (fragTemplate.indexOf("%count%") < 0) throw new Error("Fragment template must contain \"%count%\".");
		if (fragTemplate.indexOf("%forloop%") < 0) throw new Error("Fragment template must contain \"%forloop%\".");
	}
	BatchShaderGenerator.prototype.generateShader = function(maxTextures) {
		if (!this.programCache[maxTextures]) {
			var sampleValues = new Int32Array(maxTextures);
			for (var i = 0; i < maxTextures; i++) sampleValues[i] = i;
			this.defaultGroupCache[maxTextures] = UniformGroup.from({ uSamplers: sampleValues }, true);
			var fragmentSrc = this.fragTemplate;
			fragmentSrc = fragmentSrc.replace(/%count%/gi, "" + maxTextures);
			fragmentSrc = fragmentSrc.replace(/%forloop%/gi, this.generateSampleSrc(maxTextures));
			this.programCache[maxTextures] = new Program(this.vertexSrc, fragmentSrc);
		}
		var uniforms = {
			tint: new Float32Array([
				1,
				1,
				1,
				1
			]),
			translationMatrix: new Matrix(),
			default: this.defaultGroupCache[maxTextures]
		};
		return new Shader(this.programCache[maxTextures], uniforms);
	};
	BatchShaderGenerator.prototype.generateSampleSrc = function(maxTextures) {
		var src = "";
		src += "\n";
		src += "\n";
		for (var i = 0; i < maxTextures; i++) {
			if (i > 0) src += "\nelse ";
			if (i < maxTextures - 1) src += "if(vTextureId < " + i + ".5)";
			src += "\n{";
			src += "\n	color = texture2D(uSamplers[" + i + "], vTextureCoord);";
			src += "\n}";
		}
		src += "\n";
		src += "\n";
		return src;
	};
	return BatchShaderGenerator;
}();
/**
* Geometry used to batch standard PIXI content (e.g. Mesh, Sprite, Graphics objects).
* @memberof PIXI
*/
var BatchGeometry = function(_super) {
	__extends$1(BatchGeometry, _super);
	/**
	* @param {boolean} [_static=false] - Optimization flag, where `false`
	*        is updated every frame, `true` doesn't change frame-to-frame.
	*/
	function BatchGeometry(_static) {
		if (_static === void 0) _static = false;
		var _this = _super.call(this) || this;
		_this._buffer = new Buffer(null, _static, false);
		_this._indexBuffer = new Buffer(null, _static, true);
		_this.addAttribute("aVertexPosition", _this._buffer, 2, false, TYPES.FLOAT).addAttribute("aTextureCoord", _this._buffer, 2, false, TYPES.FLOAT).addAttribute("aColor", _this._buffer, 4, true, TYPES.UNSIGNED_BYTE).addAttribute("aTextureId", _this._buffer, 1, true, TYPES.FLOAT).addIndex(_this._indexBuffer);
		return _this;
	}
	return BatchGeometry;
}(Geometry);
var defaultVertex = "precision highp float;\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\nattribute float aTextureId;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform vec4 tint;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vTextureId = aTextureId;\n    vColor = aColor * tint;\n}\n";
var defaultFragment = "varying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\nuniform sampler2D uSamplers[%count%];\n\nvoid main(void){\n    vec4 color;\n    %forloop%\n    gl_FragColor = color * vColor;\n}\n";
/** @memberof PIXI */
var BatchPluginFactory = function() {
	function BatchPluginFactory() {}
	/**
	* Create a new BatchRenderer plugin for Renderer. this convenience can provide an easy way
	* to extend BatchRenderer with all the necessary pieces.
	* @example
	* const fragment = `
	* varying vec2 vTextureCoord;
	* varying vec4 vColor;
	* varying float vTextureId;
	* uniform sampler2D uSamplers[%count%];
	*
	* void main(void){
	*     vec4 color;
	*     %forloop%
	*     gl_FragColor = vColor * vec4(color.a - color.rgb, color.a);
	* }
	* `;
	* const InvertBatchRenderer = PIXI.BatchPluginFactory.create({ fragment });
	* PIXI.extensions.add({
	*  name: 'invert',
	*  ref: InvertBatchRenderer,
	*  type: PIXI.ExtensionType.RendererPlugin,
	* });
	* const sprite = new PIXI.Sprite();
	* sprite.pluginName = 'invert';
	* @param {object} [options]
	* @param {string} [options.vertex=PIXI.BatchPluginFactory.defaultVertexSrc] - Vertex shader source
	* @param {string} [options.fragment=PIXI.BatchPluginFactory.defaultFragmentTemplate] - Fragment shader template
	* @param {number} [options.vertexSize=6] - Vertex size
	* @param {object} [options.geometryClass=PIXI.BatchGeometry]
	* @returns {*} New batch renderer plugin
	*/
	BatchPluginFactory.create = function(options) {
		var _a = Object.assign({
			vertex: defaultVertex,
			fragment: defaultFragment,
			geometryClass: BatchGeometry,
			vertexSize: 6
		}, options), vertex = _a.vertex, fragment = _a.fragment, vertexSize = _a.vertexSize, geometryClass = _a.geometryClass;
		return function(_super) {
			__extends$1(BatchPlugin, _super);
			function BatchPlugin(renderer) {
				var _this = _super.call(this, renderer) || this;
				_this.shaderGenerator = new BatchShaderGenerator(vertex, fragment);
				_this.geometryClass = geometryClass;
				_this.vertexSize = vertexSize;
				return _this;
			}
			return BatchPlugin;
		}(AbstractBatchRenderer);
	};
	Object.defineProperty(BatchPluginFactory, "defaultVertexSrc", {
		/**
		* The default vertex shader source
		* @readonly
		*/
		get: function() {
			return defaultVertex;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BatchPluginFactory, "defaultFragmentTemplate", {
		/**
		* The default fragment shader source
		* @readonly
		*/
		get: function() {
			return defaultFragment;
		},
		enumerable: false,
		configurable: true
	});
	return BatchPluginFactory;
}();
var BatchRenderer = BatchPluginFactory.create();
Object.assign(BatchRenderer, { extension: {
	name: "batch",
	type: ExtensionType.RendererPlugin
} });
/**
* @memberof PIXI
* @namespace resources
* @see PIXI
* @deprecated since 6.0.0
*/
var resources = {};
var _loop_1 = function(name) {
	Object.defineProperty(resources, name, { get: function() {
		deprecation("6.0.0", "PIXI.systems." + name + " has moved to PIXI." + name);
		return _resources[name];
	} });
};
for (var name in _resources) _loop_1(name);
/**
* @memberof PIXI
* @namespace systems
* @see PIXI
* @deprecated since 6.0.0
*/
var systems = {};
var _loop_2 = function(name) {
	Object.defineProperty(systems, name, { get: function() {
		deprecation("6.0.0", "PIXI.resources." + name + " has moved to PIXI." + name);
		return _systems[name];
	} });
};
for (var name in _systems) _loop_2(name);
/**
* @namespace PIXI
*/
/**
* String of the current PIXI version.
* @memberof PIXI
*/
var VERSION = "6.5.10";
//#endregion
//#region node_modules/@pixi/display/dist/esm/display.mjs
/*!
* @pixi/display - v6.5.10
* Compiled Thu, 06 Jul 2023 15:25:11 UTC
*
* @pixi/display is licensed under the MIT License.
* http://www.opensource.org/licenses/mit-license
*/
/**
* Sets the default value for the container property 'sortableChildren'.
* If set to true, the container will sort its children by zIndex value
* when updateTransform() is called, or manually if sortChildren() is called.
*
* This actually changes the order of elements in the array, so should be treated
* as a basic solution that is not performant compared to other solutions,
* such as @link https://github.com/pixijs/pixi-display
*
* Also be aware of that this may not work nicely with the addChildAt() function,
* as the zIndex sorting may cause the child to automatically sorted to another position.
* @static
* @constant
* @name SORTABLE_CHILDREN
* @memberof PIXI.settings
* @type {boolean}
* @default false
*/
settings.SORTABLE_CHILDREN = false;
/**
* 'Builder' pattern for bounds rectangles.
*
* This could be called an Axis-Aligned Bounding Box.
* It is not an actual shape. It is a mutable thing; no 'EMPTY' or those kind of problems.
* @memberof PIXI
*/
var Bounds = function() {
	function Bounds() {
		this.minX = Infinity;
		this.minY = Infinity;
		this.maxX = -Infinity;
		this.maxY = -Infinity;
		this.rect = null;
		this.updateID = -1;
	}
	/**
	* Checks if bounds are empty.
	* @returns - True if empty.
	*/
	Bounds.prototype.isEmpty = function() {
		return this.minX > this.maxX || this.minY > this.maxY;
	};
	/** Clears the bounds and resets. */
	Bounds.prototype.clear = function() {
		this.minX = Infinity;
		this.minY = Infinity;
		this.maxX = -Infinity;
		this.maxY = -Infinity;
	};
	/**
	* Can return Rectangle.EMPTY constant, either construct new rectangle, either use your rectangle
	* It is not guaranteed that it will return tempRect
	* @param rect - Temporary object will be used if AABB is not empty
	* @returns - A rectangle of the bounds
	*/
	Bounds.prototype.getRectangle = function(rect) {
		if (this.minX > this.maxX || this.minY > this.maxY) return Rectangle.EMPTY;
		rect = rect || new Rectangle(0, 0, 1, 1);
		rect.x = this.minX;
		rect.y = this.minY;
		rect.width = this.maxX - this.minX;
		rect.height = this.maxY - this.minY;
		return rect;
	};
	/**
	* This function should be inlined when its possible.
	* @param point - The point to add.
	*/
	Bounds.prototype.addPoint = function(point) {
		this.minX = Math.min(this.minX, point.x);
		this.maxX = Math.max(this.maxX, point.x);
		this.minY = Math.min(this.minY, point.y);
		this.maxY = Math.max(this.maxY, point.y);
	};
	/**
	* Adds a point, after transformed. This should be inlined when its possible.
	* @param matrix
	* @param point
	*/
	Bounds.prototype.addPointMatrix = function(matrix, point) {
		var a = matrix.a, b = matrix.b, c = matrix.c, d = matrix.d, tx = matrix.tx, ty = matrix.ty;
		var x = a * point.x + c * point.y + tx;
		var y = b * point.x + d * point.y + ty;
		this.minX = Math.min(this.minX, x);
		this.maxX = Math.max(this.maxX, x);
		this.minY = Math.min(this.minY, y);
		this.maxY = Math.max(this.maxY, y);
	};
	/**
	* Adds a quad, not transformed
	* @param vertices - The verts to add.
	*/
	Bounds.prototype.addQuad = function(vertices) {
		var minX = this.minX;
		var minY = this.minY;
		var maxX = this.maxX;
		var maxY = this.maxY;
		var x = vertices[0];
		var y = vertices[1];
		minX = x < minX ? x : minX;
		minY = y < minY ? y : minY;
		maxX = x > maxX ? x : maxX;
		maxY = y > maxY ? y : maxY;
		x = vertices[2];
		y = vertices[3];
		minX = x < minX ? x : minX;
		minY = y < minY ? y : minY;
		maxX = x > maxX ? x : maxX;
		maxY = y > maxY ? y : maxY;
		x = vertices[4];
		y = vertices[5];
		minX = x < minX ? x : minX;
		minY = y < minY ? y : minY;
		maxX = x > maxX ? x : maxX;
		maxY = y > maxY ? y : maxY;
		x = vertices[6];
		y = vertices[7];
		minX = x < minX ? x : minX;
		minY = y < minY ? y : minY;
		maxX = x > maxX ? x : maxX;
		maxY = y > maxY ? y : maxY;
		this.minX = minX;
		this.minY = minY;
		this.maxX = maxX;
		this.maxY = maxY;
	};
	/**
	* Adds sprite frame, transformed.
	* @param transform - transform to apply
	* @param x0 - left X of frame
	* @param y0 - top Y of frame
	* @param x1 - right X of frame
	* @param y1 - bottom Y of frame
	*/
	Bounds.prototype.addFrame = function(transform, x0, y0, x1, y1) {
		this.addFrameMatrix(transform.worldTransform, x0, y0, x1, y1);
	};
	/**
	* Adds sprite frame, multiplied by matrix
	* @param matrix - matrix to apply
	* @param x0 - left X of frame
	* @param y0 - top Y of frame
	* @param x1 - right X of frame
	* @param y1 - bottom Y of frame
	*/
	Bounds.prototype.addFrameMatrix = function(matrix, x0, y0, x1, y1) {
		var a = matrix.a;
		var b = matrix.b;
		var c = matrix.c;
		var d = matrix.d;
		var tx = matrix.tx;
		var ty = matrix.ty;
		var minX = this.minX;
		var minY = this.minY;
		var maxX = this.maxX;
		var maxY = this.maxY;
		var x = a * x0 + c * y0 + tx;
		var y = b * x0 + d * y0 + ty;
		minX = x < minX ? x : minX;
		minY = y < minY ? y : minY;
		maxX = x > maxX ? x : maxX;
		maxY = y > maxY ? y : maxY;
		x = a * x1 + c * y0 + tx;
		y = b * x1 + d * y0 + ty;
		minX = x < minX ? x : minX;
		minY = y < minY ? y : minY;
		maxX = x > maxX ? x : maxX;
		maxY = y > maxY ? y : maxY;
		x = a * x0 + c * y1 + tx;
		y = b * x0 + d * y1 + ty;
		minX = x < minX ? x : minX;
		minY = y < minY ? y : minY;
		maxX = x > maxX ? x : maxX;
		maxY = y > maxY ? y : maxY;
		x = a * x1 + c * y1 + tx;
		y = b * x1 + d * y1 + ty;
		minX = x < minX ? x : minX;
		minY = y < minY ? y : minY;
		maxX = x > maxX ? x : maxX;
		maxY = y > maxY ? y : maxY;
		this.minX = minX;
		this.minY = minY;
		this.maxX = maxX;
		this.maxY = maxY;
	};
	/**
	* Adds screen vertices from array
	* @param vertexData - calculated vertices
	* @param beginOffset - begin offset
	* @param endOffset - end offset, excluded
	*/
	Bounds.prototype.addVertexData = function(vertexData, beginOffset, endOffset) {
		var minX = this.minX;
		var minY = this.minY;
		var maxX = this.maxX;
		var maxY = this.maxY;
		for (var i = beginOffset; i < endOffset; i += 2) {
			var x = vertexData[i];
			var y = vertexData[i + 1];
			minX = x < minX ? x : minX;
			minY = y < minY ? y : minY;
			maxX = x > maxX ? x : maxX;
			maxY = y > maxY ? y : maxY;
		}
		this.minX = minX;
		this.minY = minY;
		this.maxX = maxX;
		this.maxY = maxY;
	};
	/**
	* Add an array of mesh vertices
	* @param transform - mesh transform
	* @param vertices - mesh coordinates in array
	* @param beginOffset - begin offset
	* @param endOffset - end offset, excluded
	*/
	Bounds.prototype.addVertices = function(transform, vertices, beginOffset, endOffset) {
		this.addVerticesMatrix(transform.worldTransform, vertices, beginOffset, endOffset);
	};
	/**
	* Add an array of mesh vertices.
	* @param matrix - mesh matrix
	* @param vertices - mesh coordinates in array
	* @param beginOffset - begin offset
	* @param endOffset - end offset, excluded
	* @param padX - x padding
	* @param padY - y padding
	*/
	Bounds.prototype.addVerticesMatrix = function(matrix, vertices, beginOffset, endOffset, padX, padY) {
		if (padX === void 0) padX = 0;
		if (padY === void 0) padY = padX;
		var a = matrix.a;
		var b = matrix.b;
		var c = matrix.c;
		var d = matrix.d;
		var tx = matrix.tx;
		var ty = matrix.ty;
		var minX = this.minX;
		var minY = this.minY;
		var maxX = this.maxX;
		var maxY = this.maxY;
		for (var i = beginOffset; i < endOffset; i += 2) {
			var rawX = vertices[i];
			var rawY = vertices[i + 1];
			var x = a * rawX + c * rawY + tx;
			var y = d * rawY + b * rawX + ty;
			minX = Math.min(minX, x - padX);
			maxX = Math.max(maxX, x + padX);
			minY = Math.min(minY, y - padY);
			maxY = Math.max(maxY, y + padY);
		}
		this.minX = minX;
		this.minY = minY;
		this.maxX = maxX;
		this.maxY = maxY;
	};
	/**
	* Adds other {@link Bounds}.
	* @param bounds - The Bounds to be added
	*/
	Bounds.prototype.addBounds = function(bounds) {
		var minX = this.minX;
		var minY = this.minY;
		var maxX = this.maxX;
		var maxY = this.maxY;
		this.minX = bounds.minX < minX ? bounds.minX : minX;
		this.minY = bounds.minY < minY ? bounds.minY : minY;
		this.maxX = bounds.maxX > maxX ? bounds.maxX : maxX;
		this.maxY = bounds.maxY > maxY ? bounds.maxY : maxY;
	};
	/**
	* Adds other Bounds, masked with Bounds.
	* @param bounds - The Bounds to be added.
	* @param mask - TODO
	*/
	Bounds.prototype.addBoundsMask = function(bounds, mask) {
		var _minX = bounds.minX > mask.minX ? bounds.minX : mask.minX;
		var _minY = bounds.minY > mask.minY ? bounds.minY : mask.minY;
		var _maxX = bounds.maxX < mask.maxX ? bounds.maxX : mask.maxX;
		var _maxY = bounds.maxY < mask.maxY ? bounds.maxY : mask.maxY;
		if (_minX <= _maxX && _minY <= _maxY) {
			var minX = this.minX;
			var minY = this.minY;
			var maxX = this.maxX;
			var maxY = this.maxY;
			this.minX = _minX < minX ? _minX : minX;
			this.minY = _minY < minY ? _minY : minY;
			this.maxX = _maxX > maxX ? _maxX : maxX;
			this.maxY = _maxY > maxY ? _maxY : maxY;
		}
	};
	/**
	* Adds other Bounds, multiplied by matrix. Bounds shouldn't be empty.
	* @param bounds - other bounds
	* @param matrix - multiplicator
	*/
	Bounds.prototype.addBoundsMatrix = function(bounds, matrix) {
		this.addFrameMatrix(matrix, bounds.minX, bounds.minY, bounds.maxX, bounds.maxY);
	};
	/**
	* Adds other Bounds, masked with Rectangle.
	* @param bounds - TODO
	* @param area - TODO
	*/
	Bounds.prototype.addBoundsArea = function(bounds, area) {
		var _minX = bounds.minX > area.x ? bounds.minX : area.x;
		var _minY = bounds.minY > area.y ? bounds.minY : area.y;
		var _maxX = bounds.maxX < area.x + area.width ? bounds.maxX : area.x + area.width;
		var _maxY = bounds.maxY < area.y + area.height ? bounds.maxY : area.y + area.height;
		if (_minX <= _maxX && _minY <= _maxY) {
			var minX = this.minX;
			var minY = this.minY;
			var maxX = this.maxX;
			var maxY = this.maxY;
			this.minX = _minX < minX ? _minX : minX;
			this.minY = _minY < minY ? _minY : minY;
			this.maxX = _maxX > maxX ? _maxX : maxX;
			this.maxY = _maxY > maxY ? _maxY : maxY;
		}
	};
	/**
	* Pads bounds object, making it grow in all directions.
	* If paddingY is omitted, both paddingX and paddingY will be set to paddingX.
	* @param paddingX - The horizontal padding amount.
	* @param paddingY - The vertical padding amount.
	*/
	Bounds.prototype.pad = function(paddingX, paddingY) {
		if (paddingX === void 0) paddingX = 0;
		if (paddingY === void 0) paddingY = paddingX;
		if (!this.isEmpty()) {
			this.minX -= paddingX;
			this.maxX += paddingX;
			this.minY -= paddingY;
			this.maxY += paddingY;
		}
	};
	/**
	* Adds padded frame. (x0, y0) should be strictly less than (x1, y1)
	* @param x0 - left X of frame
	* @param y0 - top Y of frame
	* @param x1 - right X of frame
	* @param y1 - bottom Y of frame
	* @param padX - padding X
	* @param padY - padding Y
	*/
	Bounds.prototype.addFramePad = function(x0, y0, x1, y1, padX, padY) {
		x0 -= padX;
		y0 -= padY;
		x1 += padX;
		y1 += padY;
		this.minX = this.minX < x0 ? this.minX : x0;
		this.maxX = this.maxX > x1 ? this.maxX : x1;
		this.minY = this.minY < y0 ? this.minY : y0;
		this.maxY = this.maxY > y1 ? this.maxY : y1;
	};
	return Bounds;
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
* The base class for all objects that are rendered on the screen.
*
* This is an abstract class and can not be used on its own; rather it should be extended.
*
* ## Display objects implemented in PixiJS
*
* | Display Object                  | Description                                                           |
* | ------------------------------- | --------------------------------------------------------------------- |
* | {@link PIXI.Container}          | Adds support for `children` to DisplayObject                          |
* | {@link PIXI.Graphics}           | Shape-drawing display object similar to the Canvas API                |
* | {@link PIXI.Sprite}             | Draws textures (i.e. images)                                          |
* | {@link PIXI.Text}               | Draws text using the Canvas API internally                            |
* | {@link PIXI.BitmapText}         | More scaleable solution for text rendering, reusing glyph textures    |
* | {@link PIXI.TilingSprite}       | Draws textures/images in a tiled fashion                              |
* | {@link PIXI.AnimatedSprite}     | Draws an animation of multiple images                                 |
* | {@link PIXI.Mesh}               | Provides a lower-level API for drawing meshes with custom data        |
* | {@link PIXI.NineSlicePlane}     | Mesh-related                                                          |
* | {@link PIXI.SimpleMesh}         | v4-compatible mesh                                                    |
* | {@link PIXI.SimplePlane}        | Mesh-related                                                          |
* | {@link PIXI.SimpleRope}         | Mesh-related                                                          |
*
* ## Transforms
*
* The [transform]{@link DisplayObject#transform} of a display object describes the projection from its
* local coordinate space to its parent's local coordinate space. The following properties are derived
* from the transform:
*
* <table>
*   <thead>
*     <tr>
*       <th>Property</th>
*       <th>Description</th>
*     </tr>
*   </thead>
*   <tbody>
*     <tr>
*       <td>[pivot]{@link PIXI.DisplayObject#pivot}</td>
*       <td>
*         Invariant under rotation, scaling, and skewing. The projection of into the parent's space of the pivot
*         is equal to position, regardless of the other three transformations. In other words, It is the center of
*         rotation, scaling, and skewing.
*       </td>
*     </tr>
*     <tr>
*       <td>[position]{@link PIXI.DisplayObject#position}</td>
*       <td>
*         Translation. This is the position of the [pivot]{@link PIXI.DisplayObject#pivot} in the parent's local
*         space. The default value of the pivot is the origin (0,0). If the top-left corner of your display object
*         is (0,0) in its local space, then the position will be its top-left corner in the parent's local space.
*       </td>
*     </tr>
*     <tr>
*       <td>[scale]{@link PIXI.DisplayObject#scale}</td>
*       <td>
*         Scaling. This will stretch (or compress) the display object's projection. The scale factors are along the
*         local coordinate axes. In other words, the display object is scaled before rotated or skewed. The center
*         of scaling is the [pivot]{@link PIXI.DisplayObject#pivot}.
*       </td>
*     </tr>
*     <tr>
*       <td>[rotation]{@link PIXI.DisplayObject#rotation}</td>
*       <td>
*          Rotation. This will rotate the display object's projection by this angle (in radians).
*       </td>
*     </tr>
*     <tr>
*       <td>[skew]{@link PIXI.DisplayObject#skew}</td>
*       <td>
*         <p>Skewing. This can be used to deform a rectangular display object into a parallelogram.</p>
*         <p>
*         In PixiJS, skew has a slightly different behaviour than the conventional meaning. It can be
*         thought of the net rotation applied to the coordinate axes (separately). For example, if "skew.x" is
*         ⍺ and "skew.y" is β, then the line x = 0 will be rotated by ⍺ (y = -x*cot⍺) and the line y = 0 will be
*         rotated by β (y = x*tanβ). A line y = x*tanϴ (i.e. a line at angle ϴ to the x-axis in local-space) will
*         be rotated by an angle between ⍺ and β.
*         </p>
*         <p>
*         It can be observed that if skew is applied equally to both axes, then it will be equivalent to applying
*         a rotation. Indeed, if "skew.x" = -ϴ and "skew.y" = ϴ, it will produce an equivalent of "rotation" = ϴ.
*         </p>
*         <p>
*         Another quite interesting observation is that "skew.x", "skew.y", rotation are communtative operations. Indeed,
*         because rotation is essentially a careful combination of the two.
*         </p>
*       </td>
*     </tr>
*     <tr>
*       <td>angle</td>
*       <td>Rotation. This is an alias for [rotation]{@link PIXI.DisplayObject#rotation}, but in degrees.</td>
*     </tr>
*     <tr>
*       <td>x</td>
*       <td>Translation. This is an alias for position.x!</td>
*     </tr>
*     <tr>
*       <td>y</td>
*       <td>Translation. This is an alias for position.y!</td>
*     </tr>
*     <tr>
*       <td>width</td>
*       <td>
*         Implemented in [Container]{@link PIXI.Container}. Scaling. The width property calculates scale.x by dividing
*         the "requested" width by the local bounding box width. It is indirectly an abstraction over scale.x, and there
*         is no concept of user-defined width.
*       </td>
*     </tr>
*     <tr>
*       <td>height</td>
*       <td>
*         Implemented in [Container]{@link PIXI.Container}. Scaling. The height property calculates scale.y by dividing
*         the "requested" height by the local bounding box height. It is indirectly an abstraction over scale.y, and there
*         is no concept of user-defined height.
*       </td>
*     </tr>
*   </tbody>
* </table>
*
* ## Bounds
*
* The bounds of a display object is defined by the minimum axis-aligned rectangle in world space that can fit
* around it. The abstract `calculateBounds` method is responsible for providing it (and it should use the
* `worldTransform` to calculate in world space).
*
* There are a few additional types of bounding boxes:
*
* | Bounds                | Description                                                                              |
* | --------------------- | ---------------------------------------------------------------------------------------- |
* | World Bounds          | This is synonymous is the regular bounds described above. See `getBounds()`.             |
* | Local Bounds          | This the axis-aligned bounding box in the parent's local space. See `getLocalBounds()`.  |
* | Render Bounds         | The bounds, but including extra rendering effects like filter padding.                   |
* | Projected Bounds      | The bounds of the projected display object onto the screen. Usually equals world bounds. |
* | Relative Bounds       | The bounds of a display object when projected onto a ancestor's (or parent's) space.     |
* | Natural Bounds        | The bounds of an object in its own local space (not parent's space, like in local bounds)|
* | Content Bounds        | The natural bounds when excluding all children of a `Container`.                         |
*
* ### calculateBounds
*
* [Container]{@link Container} already implements `calculateBounds` in a manner that includes children.
*
* But for a non-Container display object, the `calculateBounds` method must be overridden in order for `getBounds` and
* `getLocalBounds` to work. This method must write the bounds into `this._bounds`.
*
* Generally, the following technique works for most simple cases: take the list of points
* forming the "hull" of the object (i.e. outline of the object's shape), and then add them
* using {@link PIXI.Bounds#addPointMatrix}.
*
* ```js
* calculateBounds(): void
* {
*     const points = [...];
*
*     for (let i = 0, j = points.length; i < j; i++)
*     {
*         this._bounds.addPointMatrix(this.worldTransform, points[i]);
*     }
* }
* ```
*
* You can optimize this for a large number of points by using {@link PIXI.Bounds#addVerticesMatrix} to pass them
* in one array together.
*
* ## Alpha
*
* This alpha sets a display object's **relative opacity** w.r.t its parent. For example, if the alpha of a display
* object is 0.5 and its parent's alpha is 0.5, then it will be rendered with 25% opacity (assuming alpha is not
* applied on any ancestor further up the chain).
*
* The alpha with which the display object will be rendered is called the [worldAlpha]{@link PIXI.DisplayObject#worldAlpha}.
*
* ## Renderable vs Visible
*
* The `renderable` and `visible` properties can be used to prevent a display object from being rendered to the
* screen. However, there is a subtle difference between the two. When using `renderable`, the transforms  of the display
* object (and its children subtree) will continue to be calculated. When using `visible`, the transforms will not
* be calculated.
*
* It is recommended that applications use the `renderable` property for culling. See
* [@pixi-essentials/cull]{@link https://www.npmjs.com/package/@pixi-essentials/cull} or
* [pixi-cull]{@link https://www.npmjs.com/package/pixi-cull} for more details.
*
* Otherwise, to prevent an object from rendering in the general-purpose sense - `visible` is the property to use. This
* one is also better in terms of performance.
* @memberof PIXI
*/
var DisplayObject = function(_super) {
	__extends(DisplayObject, _super);
	function DisplayObject() {
		var _this = _super.call(this) || this;
		_this.tempDisplayObjectParent = null;
		_this.transform = new Transform();
		_this.alpha = 1;
		_this.visible = true;
		_this.renderable = true;
		_this.cullable = false;
		_this.cullArea = null;
		_this.parent = null;
		_this.worldAlpha = 1;
		_this._lastSortedIndex = 0;
		_this._zIndex = 0;
		_this.filterArea = null;
		_this.filters = null;
		_this._enabledFilters = null;
		_this._bounds = new Bounds();
		_this._localBounds = null;
		_this._boundsID = 0;
		_this._boundsRect = null;
		_this._localBoundsRect = null;
		_this._mask = null;
		_this._maskRefCount = 0;
		_this._destroyed = false;
		_this.isSprite = false;
		_this.isMask = false;
		return _this;
	}
	/**
	* Mixes all enumerable properties and methods from a source object to DisplayObject.
	* @param source - The source of properties and methods to mix in.
	*/
	DisplayObject.mixin = function(source) {
		var keys = Object.keys(source);
		for (var i = 0; i < keys.length; ++i) {
			var propertyName = keys[i];
			Object.defineProperty(DisplayObject.prototype, propertyName, Object.getOwnPropertyDescriptor(source, propertyName));
		}
	};
	Object.defineProperty(DisplayObject.prototype, "destroyed", {
		/**
		* Fired when this DisplayObject is added to a Container.
		* @instance
		* @event added
		* @param {PIXI.Container} container - The container added to.
		*/
		/**
		* Fired when this DisplayObject is removed from a Container.
		* @instance
		* @event removed
		* @param {PIXI.Container} container - The container removed from.
		*/
		/**
		* Fired when this DisplayObject is destroyed. This event is emitted once
		* destroy is finished.
		* @instance
		* @event destroyed
		*/
		/** Readonly flag for destroyed display objects. */
		get: function() {
			return this._destroyed;
		},
		enumerable: false,
		configurable: true
	});
	/** Recursively updates transform of all objects from the root to this one internal function for toLocal() */
	DisplayObject.prototype._recursivePostUpdateTransform = function() {
		if (this.parent) {
			this.parent._recursivePostUpdateTransform();
			this.transform.updateTransform(this.parent.transform);
		} else this.transform.updateTransform(this._tempDisplayObjectParent.transform);
	};
	/** Updates the object transform for rendering. TODO - Optimization pass! */
	DisplayObject.prototype.updateTransform = function() {
		this._boundsID++;
		this.transform.updateTransform(this.parent.transform);
		this.worldAlpha = this.alpha * this.parent.worldAlpha;
	};
	/**
	* Calculates and returns the (world) bounds of the display object as a [Rectangle]{@link PIXI.Rectangle}.
	*
	* This method is expensive on containers with a large subtree (like the stage). This is because the bounds
	* of a container depend on its children's bounds, which recursively causes all bounds in the subtree to
	* be recalculated. The upside, however, is that calling `getBounds` once on a container will indeed update
	* the bounds of all children (the whole subtree, in fact). This side effect should be exploited by using
	* `displayObject._bounds.getRectangle()` when traversing through all the bounds in a scene graph. Otherwise,
	* calling `getBounds` on each object in a subtree will cause the total cost to increase quadratically as
	* its height increases.
	*
	* The transforms of all objects in a container's **subtree** and of all **ancestors** are updated.
	* The world bounds of all display objects in a container's **subtree** will also be recalculated.
	*
	* The `_bounds` object stores the last calculation of the bounds. You can use to entirely skip bounds
	* calculation if needed.
	*
	* ```js
	* const lastCalculatedBounds = displayObject._bounds.getRectangle(optionalRect);
	* ```
	*
	* Do know that usage of `getLocalBounds` can corrupt the `_bounds` of children (the whole subtree, actually). This
	* is a known issue that has not been solved. See [getLocalBounds]{@link PIXI.DisplayObject#getLocalBounds} for more
	* details.
	*
	* `getBounds` should be called with `skipUpdate` equal to `true` in a render() call. This is because the transforms
	* are guaranteed to be update-to-date. In fact, recalculating inside a render() call may cause corruption in certain
	* cases.
	* @param skipUpdate - Setting to `true` will stop the transforms of the scene graph from
	*  being updated. This means the calculation returned MAY be out of date BUT will give you a
	*  nice performance boost.
	* @param rect - Optional rectangle to store the result of the bounds calculation.
	* @returns - The minimum axis-aligned rectangle in world space that fits around this object.
	*/
	DisplayObject.prototype.getBounds = function(skipUpdate, rect) {
		if (!skipUpdate) {
			if (!this.parent) {
				this.parent = this._tempDisplayObjectParent;
				this.updateTransform();
				this.parent = null;
			} else {
				this._recursivePostUpdateTransform();
				this.updateTransform();
			}
		}
		if (this._bounds.updateID !== this._boundsID) {
			this.calculateBounds();
			this._bounds.updateID = this._boundsID;
		}
		if (!rect) {
			if (!this._boundsRect) this._boundsRect = new Rectangle();
			rect = this._boundsRect;
		}
		return this._bounds.getRectangle(rect);
	};
	/**
	* Retrieves the local bounds of the displayObject as a rectangle object.
	* @param rect - Optional rectangle to store the result of the bounds calculation.
	* @returns - The rectangular bounding area.
	*/
	DisplayObject.prototype.getLocalBounds = function(rect) {
		if (!rect) {
			if (!this._localBoundsRect) this._localBoundsRect = new Rectangle();
			rect = this._localBoundsRect;
		}
		if (!this._localBounds) this._localBounds = new Bounds();
		var transformRef = this.transform;
		var parentRef = this.parent;
		this.parent = null;
		this.transform = this._tempDisplayObjectParent.transform;
		var worldBounds = this._bounds;
		var worldBoundsID = this._boundsID;
		this._bounds = this._localBounds;
		var bounds = this.getBounds(false, rect);
		this.parent = parentRef;
		this.transform = transformRef;
		this._bounds = worldBounds;
		this._bounds.updateID += this._boundsID - worldBoundsID;
		return bounds;
	};
	/**
	* Calculates the global position of the display object.
	* @param position - The world origin to calculate from.
	* @param point - A Point object in which to store the value, optional
	*  (otherwise will create a new Point).
	* @param skipUpdate - Should we skip the update transform.
	* @returns - A point object representing the position of this object.
	*/
	DisplayObject.prototype.toGlobal = function(position, point, skipUpdate) {
		if (skipUpdate === void 0) skipUpdate = false;
		if (!skipUpdate) {
			this._recursivePostUpdateTransform();
			if (!this.parent) {
				this.parent = this._tempDisplayObjectParent;
				this.displayObjectUpdateTransform();
				this.parent = null;
			} else this.displayObjectUpdateTransform();
		}
		return this.worldTransform.apply(position, point);
	};
	/**
	* Calculates the local position of the display object relative to another point.
	* @param position - The world origin to calculate from.
	* @param from - The DisplayObject to calculate the global position from.
	* @param point - A Point object in which to store the value, optional
	*  (otherwise will create a new Point).
	* @param skipUpdate - Should we skip the update transform
	* @returns - A point object representing the position of this object
	*/
	DisplayObject.prototype.toLocal = function(position, from, point, skipUpdate) {
		if (from) position = from.toGlobal(position, point, skipUpdate);
		if (!skipUpdate) {
			this._recursivePostUpdateTransform();
			if (!this.parent) {
				this.parent = this._tempDisplayObjectParent;
				this.displayObjectUpdateTransform();
				this.parent = null;
			} else this.displayObjectUpdateTransform();
		}
		return this.worldTransform.applyInverse(position, point);
	};
	/**
	* Set the parent Container of this DisplayObject.
	* @param container - The Container to add this DisplayObject to.
	* @returns - The Container that this DisplayObject was added to.
	*/
	DisplayObject.prototype.setParent = function(container) {
		if (!container || !container.addChild) throw new Error("setParent: Argument must be a Container");
		container.addChild(this);
		return container;
	};
	/**
	* Convenience function to set the position, scale, skew and pivot at once.
	* @param x - The X position
	* @param y - The Y position
	* @param scaleX - The X scale value
	* @param scaleY - The Y scale value
	* @param rotation - The rotation
	* @param skewX - The X skew value
	* @param skewY - The Y skew value
	* @param pivotX - The X pivot value
	* @param pivotY - The Y pivot value
	* @returns - The DisplayObject instance
	*/
	DisplayObject.prototype.setTransform = function(x, y, scaleX, scaleY, rotation, skewX, skewY, pivotX, pivotY) {
		if (x === void 0) x = 0;
		if (y === void 0) y = 0;
		if (scaleX === void 0) scaleX = 1;
		if (scaleY === void 0) scaleY = 1;
		if (rotation === void 0) rotation = 0;
		if (skewX === void 0) skewX = 0;
		if (skewY === void 0) skewY = 0;
		if (pivotX === void 0) pivotX = 0;
		if (pivotY === void 0) pivotY = 0;
		this.position.x = x;
		this.position.y = y;
		this.scale.x = !scaleX ? 1 : scaleX;
		this.scale.y = !scaleY ? 1 : scaleY;
		this.rotation = rotation;
		this.skew.x = skewX;
		this.skew.y = skewY;
		this.pivot.x = pivotX;
		this.pivot.y = pivotY;
		return this;
	};
	/**
	* Base destroy method for generic display objects. This will automatically
	* remove the display object from its parent Container as well as remove
	* all current event listeners and internal references. Do not use a DisplayObject
	* after calling `destroy()`.
	* @param _options
	*/
	DisplayObject.prototype.destroy = function(_options) {
		if (this.parent) this.parent.removeChild(this);
		this._destroyed = true;
		this.transform = null;
		this.parent = null;
		this._bounds = null;
		this.mask = null;
		this.cullArea = null;
		this.filters = null;
		this.filterArea = null;
		this.hitArea = null;
		this.interactive = false;
		this.interactiveChildren = false;
		this.emit("destroyed");
		this.removeAllListeners();
	};
	Object.defineProperty(DisplayObject.prototype, "_tempDisplayObjectParent", {
		/**
		* @protected
		* @member {PIXI.Container}
		*/
		get: function() {
			if (this.tempDisplayObjectParent === null) this.tempDisplayObjectParent = new TemporaryDisplayObject();
			return this.tempDisplayObjectParent;
		},
		enumerable: false,
		configurable: true
	});
	/**
	* Used in Renderer, cacheAsBitmap and other places where you call an `updateTransform` on root
	*
	* ```
	* const cacheParent = elem.enableTempParent();
	* elem.updateTransform();
	* elem.disableTempParent(cacheParent);
	* ```
	* @returns - current parent
	*/
	DisplayObject.prototype.enableTempParent = function() {
		var myParent = this.parent;
		this.parent = this._tempDisplayObjectParent;
		return myParent;
	};
	/**
	* Pair method for `enableTempParent`
	* @param cacheParent - Actual parent of element
	*/
	DisplayObject.prototype.disableTempParent = function(cacheParent) {
		this.parent = cacheParent;
	};
	Object.defineProperty(DisplayObject.prototype, "x", {
		/**
		* The position of the displayObject on the x axis relative to the local coordinates of the parent.
		* An alias to position.x
		*/
		get: function() {
			return this.position.x;
		},
		set: function(value) {
			this.transform.position.x = value;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(DisplayObject.prototype, "y", {
		/**
		* The position of the displayObject on the y axis relative to the local coordinates of the parent.
		* An alias to position.y
		*/
		get: function() {
			return this.position.y;
		},
		set: function(value) {
			this.transform.position.y = value;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(DisplayObject.prototype, "worldTransform", {
		/**
		* Current transform of the object based on world (parent) factors.
		* @readonly
		*/
		get: function() {
			return this.transform.worldTransform;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(DisplayObject.prototype, "localTransform", {
		/**
		* Current transform of the object based on local factors: position, scale, other stuff.
		* @readonly
		*/
		get: function() {
			return this.transform.localTransform;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(DisplayObject.prototype, "position", {
		/**
		* The coordinate of the object relative to the local coordinates of the parent.
		* @since 4.0.0
		*/
		get: function() {
			return this.transform.position;
		},
		set: function(value) {
			this.transform.position.copyFrom(value);
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(DisplayObject.prototype, "scale", {
		/**
		* The scale factors of this object along the local coordinate axes.
		*
		* The default scale is (1, 1).
		* @since 4.0.0
		*/
		get: function() {
			return this.transform.scale;
		},
		set: function(value) {
			this.transform.scale.copyFrom(value);
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(DisplayObject.prototype, "pivot", {
		/**
		* The center of rotation, scaling, and skewing for this display object in its local space. The `position`
		* is the projection of `pivot` in the parent's local space.
		*
		* By default, the pivot is the origin (0, 0).
		* @since 4.0.0
		*/
		get: function() {
			return this.transform.pivot;
		},
		set: function(value) {
			this.transform.pivot.copyFrom(value);
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(DisplayObject.prototype, "skew", {
		/**
		* The skew factor for the object in radians.
		* @since 4.0.0
		*/
		get: function() {
			return this.transform.skew;
		},
		set: function(value) {
			this.transform.skew.copyFrom(value);
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(DisplayObject.prototype, "rotation", {
		/**
		* The rotation of the object in radians.
		* 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
		*/
		get: function() {
			return this.transform.rotation;
		},
		set: function(value) {
			this.transform.rotation = value;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(DisplayObject.prototype, "angle", {
		/**
		* The angle of the object in degrees.
		* 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
		*/
		get: function() {
			return this.transform.rotation * RAD_TO_DEG;
		},
		set: function(value) {
			this.transform.rotation = value * DEG_TO_RAD;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(DisplayObject.prototype, "zIndex", {
		/**
		* The zIndex of the displayObject.
		*
		* If a container has the sortableChildren property set to true, children will be automatically
		* sorted by zIndex value; a higher value will mean it will be moved towards the end of the array,
		* and thus rendered on top of other display objects within the same container.
		* @see PIXI.Container#sortableChildren
		*/
		get: function() {
			return this._zIndex;
		},
		set: function(value) {
			this._zIndex = value;
			if (this.parent) this.parent.sortDirty = true;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(DisplayObject.prototype, "worldVisible", {
		/**
		* Indicates if the object is globally visible.
		* @readonly
		*/
		get: function() {
			var item = this;
			do {
				if (!item.visible) return false;
				item = item.parent;
			} while (item);
			return true;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(DisplayObject.prototype, "mask", {
		/**
		* Sets a mask for the displayObject. A mask is an object that limits the visibility of an
		* object to the shape of the mask applied to it. In PixiJS a regular mask must be a
		* {@link PIXI.Graphics} or a {@link PIXI.Sprite} object. This allows for much faster masking in canvas as it
		* utilities shape clipping. Furthermore, a mask of an object must be in the subtree of its parent.
		* Otherwise, `getLocalBounds` may calculate incorrect bounds, which makes the container's width and height wrong.
		* To remove a mask, set this property to `null`.
		*
		* For sprite mask both alpha and red channel are used. Black mask is the same as transparent mask.
		* @example
		* const graphics = new PIXI.Graphics();
		* graphics.beginFill(0xFF3300);
		* graphics.drawRect(50, 250, 100, 100);
		* graphics.endFill();
		*
		* const sprite = new PIXI.Sprite(texture);
		* sprite.mask = graphics;
		* @todo At the moment, PIXI.CanvasRenderer doesn't support PIXI.Sprite as mask.
		*/
		get: function() {
			return this._mask;
		},
		set: function(value) {
			if (this._mask === value) return;
			if (this._mask) {
				var maskObject = this._mask.isMaskData ? this._mask.maskObject : this._mask;
				if (maskObject) {
					maskObject._maskRefCount--;
					if (maskObject._maskRefCount === 0) {
						maskObject.renderable = true;
						maskObject.isMask = false;
					}
				}
			}
			this._mask = value;
			if (this._mask) {
				var maskObject = this._mask.isMaskData ? this._mask.maskObject : this._mask;
				if (maskObject) {
					if (maskObject._maskRefCount === 0) {
						maskObject.renderable = false;
						maskObject.isMask = true;
					}
					maskObject._maskRefCount++;
				}
			}
		},
		enumerable: false,
		configurable: true
	});
	return DisplayObject;
}(import_eventemitter3.default);
/**
* @private
*/
var TemporaryDisplayObject = function(_super) {
	__extends(TemporaryDisplayObject, _super);
	function TemporaryDisplayObject() {
		var _this = _super !== null && _super.apply(this, arguments) || this;
		_this.sortDirty = null;
		return _this;
	}
	return TemporaryDisplayObject;
}(DisplayObject);
/**
* DisplayObject default updateTransform, does not update children of container.
* Will crash if there's no parent element.
* @memberof PIXI.DisplayObject#
* @method displayObjectUpdateTransform
*/
DisplayObject.prototype.displayObjectUpdateTransform = DisplayObject.prototype.updateTransform;
function sortChildren(a, b) {
	if (a.zIndex === b.zIndex) return a._lastSortedIndex - b._lastSortedIndex;
	return a.zIndex - b.zIndex;
}
/**
* Container is a general-purpose display object that holds children. It also adds built-in support for advanced
* rendering features like masking and filtering.
*
* It is the base class of all display objects that act as a container for other objects, including Graphics
* and Sprite.
*
* ```js
* import { BlurFilter } from '@pixi/filter-blur';
* import { Container } from '@pixi/display';
* import { Graphics } from '@pixi/graphics';
* import { Sprite } from '@pixi/sprite';
*
* let container = new Container();
* let sprite = Sprite.from("https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png");
*
* sprite.width = 512;
* sprite.height = 512;
*
* // Adds a sprite as a child to this container. As a result, the sprite will be rendered whenever the container
* // is rendered.
* container.addChild(sprite);
*
* // Blurs whatever is rendered by the container
* container.filters = [new BlurFilter()];
*
* // Only the contents within a circle at the center should be rendered onto the screen.
* container.mask = new Graphics()
*  .beginFill(0xffffff)
*  .drawCircle(sprite.width / 2, sprite.height / 2, Math.min(sprite.width, sprite.height) / 2)
*  .endFill();
* ```
* @memberof PIXI
*/
var Container = function(_super) {
	__extends(Container, _super);
	function Container() {
		var _this = _super.call(this) || this;
		_this.children = [];
		_this.sortableChildren = settings.SORTABLE_CHILDREN;
		_this.sortDirty = false;
		return _this;
		/**
		* Fired when a DisplayObject is added to this Container.
		* @event PIXI.Container#childAdded
		* @param {PIXI.DisplayObject} child - The child added to the Container.
		* @param {PIXI.Container} container - The container that added the child.
		* @param {number} index - The children's index of the added child.
		*/
		/**
		* Fired when a DisplayObject is removed from this Container.
		* @event PIXI.DisplayObject#childRemoved
		* @param {PIXI.DisplayObject} child - The child removed from the Container.
		* @param {PIXI.Container} container - The container that removed the child.
		* @param {number} index - The former children's index of the removed child
		*/
	}
	/**
	* Overridable method that can be used by Container subclasses whenever the children array is modified.
	* @param _length
	*/
	Container.prototype.onChildrenChange = function(_length) {};
	/**
	* Adds one or more children to the container.
	*
	* Multiple items can be added like so: `myContainer.addChild(thingOne, thingTwo, thingThree)`
	* @param {...PIXI.DisplayObject} children - The DisplayObject(s) to add to the container
	* @returns {PIXI.DisplayObject} - The first child that was added.
	*/
	Container.prototype.addChild = function() {
		var arguments$1 = arguments;
		var children = [];
		for (var _i = 0; _i < arguments.length; _i++) children[_i] = arguments$1[_i];
		if (children.length > 1) for (var i = 0; i < children.length; i++) this.addChild(children[i]);
		else {
			var child = children[0];
			if (child.parent) child.parent.removeChild(child);
			child.parent = this;
			this.sortDirty = true;
			child.transform._parentID = -1;
			this.children.push(child);
			this._boundsID++;
			this.onChildrenChange(this.children.length - 1);
			this.emit("childAdded", child, this, this.children.length - 1);
			child.emit("added", this);
		}
		return children[0];
	};
	/**
	* Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown
	* @param {PIXI.DisplayObject} child - The child to add
	* @param {number} index - The index to place the child in
	* @returns {PIXI.DisplayObject} The child that was added.
	*/
	Container.prototype.addChildAt = function(child, index) {
		if (index < 0 || index > this.children.length) throw new Error(child + "addChildAt: The index " + index + " supplied is out of bounds " + this.children.length);
		if (child.parent) child.parent.removeChild(child);
		child.parent = this;
		this.sortDirty = true;
		child.transform._parentID = -1;
		this.children.splice(index, 0, child);
		this._boundsID++;
		this.onChildrenChange(index);
		child.emit("added", this);
		this.emit("childAdded", child, this, index);
		return child;
	};
	/**
	* Swaps the position of 2 Display Objects within this container.
	* @param child - First display object to swap
	* @param child2 - Second display object to swap
	*/
	Container.prototype.swapChildren = function(child, child2) {
		if (child === child2) return;
		var index1 = this.getChildIndex(child);
		var index2 = this.getChildIndex(child2);
		this.children[index1] = child2;
		this.children[index2] = child;
		this.onChildrenChange(index1 < index2 ? index1 : index2);
	};
	/**
	* Returns the index position of a child DisplayObject instance
	* @param child - The DisplayObject instance to identify
	* @returns - The index position of the child display object to identify
	*/
	Container.prototype.getChildIndex = function(child) {
		var index = this.children.indexOf(child);
		if (index === -1) throw new Error("The supplied DisplayObject must be a child of the caller");
		return index;
	};
	/**
	* Changes the position of an existing child in the display object container
	* @param child - The child DisplayObject instance for which you want to change the index number
	* @param index - The resulting index number for the child display object
	*/
	Container.prototype.setChildIndex = function(child, index) {
		if (index < 0 || index >= this.children.length) throw new Error("The index " + index + " supplied is out of bounds " + this.children.length);
		var currentIndex = this.getChildIndex(child);
		removeItems(this.children, currentIndex, 1);
		this.children.splice(index, 0, child);
		this.onChildrenChange(index);
	};
	/**
	* Returns the child at the specified index
	* @param index - The index to get the child at
	* @returns - The child at the given index, if any.
	*/
	Container.prototype.getChildAt = function(index) {
		if (index < 0 || index >= this.children.length) throw new Error("getChildAt: Index (" + index + ") does not exist.");
		return this.children[index];
	};
	/**
	* Removes one or more children from the container.
	* @param {...PIXI.DisplayObject} children - The DisplayObject(s) to remove
	* @returns {PIXI.DisplayObject} The first child that was removed.
	*/
	Container.prototype.removeChild = function() {
		var arguments$1 = arguments;
		var children = [];
		for (var _i = 0; _i < arguments.length; _i++) children[_i] = arguments$1[_i];
		if (children.length > 1) for (var i = 0; i < children.length; i++) this.removeChild(children[i]);
		else {
			var child = children[0];
			var index = this.children.indexOf(child);
			if (index === -1) return null;
			child.parent = null;
			child.transform._parentID = -1;
			removeItems(this.children, index, 1);
			this._boundsID++;
			this.onChildrenChange(index);
			child.emit("removed", this);
			this.emit("childRemoved", child, this, index);
		}
		return children[0];
	};
	/**
	* Removes a child from the specified index position.
	* @param index - The index to get the child from
	* @returns The child that was removed.
	*/
	Container.prototype.removeChildAt = function(index) {
		var child = this.getChildAt(index);
		child.parent = null;
		child.transform._parentID = -1;
		removeItems(this.children, index, 1);
		this._boundsID++;
		this.onChildrenChange(index);
		child.emit("removed", this);
		this.emit("childRemoved", child, this, index);
		return child;
	};
	/**
	* Removes all children from this container that are within the begin and end indexes.
	* @param beginIndex - The beginning position.
	* @param endIndex - The ending position. Default value is size of the container.
	* @returns - List of removed children
	*/
	Container.prototype.removeChildren = function(beginIndex, endIndex) {
		if (beginIndex === void 0) beginIndex = 0;
		if (endIndex === void 0) endIndex = this.children.length;
		var begin = beginIndex;
		var end = endIndex;
		var range = end - begin;
		var removed;
		if (range > 0 && range <= end) {
			removed = this.children.splice(begin, range);
			for (var i = 0; i < removed.length; ++i) {
				removed[i].parent = null;
				if (removed[i].transform) removed[i].transform._parentID = -1;
			}
			this._boundsID++;
			this.onChildrenChange(beginIndex);
			for (var i = 0; i < removed.length; ++i) {
				removed[i].emit("removed", this);
				this.emit("childRemoved", removed[i], this, i);
			}
			return removed;
		} else if (range === 0 && this.children.length === 0) return [];
		throw new RangeError("removeChildren: numeric values are outside the acceptable range.");
	};
	/** Sorts children by zIndex. Previous order is maintained for 2 children with the same zIndex. */
	Container.prototype.sortChildren = function() {
		var sortRequired = false;
		for (var i = 0, j = this.children.length; i < j; ++i) {
			var child = this.children[i];
			child._lastSortedIndex = i;
			if (!sortRequired && child.zIndex !== 0) sortRequired = true;
		}
		if (sortRequired && this.children.length > 1) this.children.sort(sortChildren);
		this.sortDirty = false;
	};
	/** Updates the transform on all children of this container for rendering. */
	Container.prototype.updateTransform = function() {
		if (this.sortableChildren && this.sortDirty) this.sortChildren();
		this._boundsID++;
		this.transform.updateTransform(this.parent.transform);
		this.worldAlpha = this.alpha * this.parent.worldAlpha;
		for (var i = 0, j = this.children.length; i < j; ++i) {
			var child = this.children[i];
			if (child.visible) child.updateTransform();
		}
	};
	/**
	* Recalculates the bounds of the container.
	*
	* This implementation will automatically fit the children's bounds into the calculation. Each child's bounds
	* is limited to its mask's bounds or filterArea, if any is applied.
	*/
	Container.prototype.calculateBounds = function() {
		this._bounds.clear();
		this._calculateBounds();
		for (var i = 0; i < this.children.length; i++) {
			var child = this.children[i];
			if (!child.visible || !child.renderable) continue;
			child.calculateBounds();
			if (child._mask) {
				var maskObject = child._mask.isMaskData ? child._mask.maskObject : child._mask;
				if (maskObject) {
					maskObject.calculateBounds();
					this._bounds.addBoundsMask(child._bounds, maskObject._bounds);
				} else this._bounds.addBounds(child._bounds);
			} else if (child.filterArea) this._bounds.addBoundsArea(child._bounds, child.filterArea);
			else this._bounds.addBounds(child._bounds);
		}
		this._bounds.updateID = this._boundsID;
	};
	/**
	* Retrieves the local bounds of the displayObject as a rectangle object.
	*
	* Calling `getLocalBounds` may invalidate the `_bounds` of the whole subtree below. If using it inside a render()
	* call, it is advised to call `getBounds()` immediately after to recalculate the world bounds of the subtree.
	* @param rect - Optional rectangle to store the result of the bounds calculation.
	* @param skipChildrenUpdate - Setting to `true` will stop re-calculation of children transforms,
	*  it was default behaviour of pixi 4.0-5.2 and caused many problems to users.
	* @returns - The rectangular bounding area.
	*/
	Container.prototype.getLocalBounds = function(rect, skipChildrenUpdate) {
		if (skipChildrenUpdate === void 0) skipChildrenUpdate = false;
		var result = _super.prototype.getLocalBounds.call(this, rect);
		if (!skipChildrenUpdate) for (var i = 0, j = this.children.length; i < j; ++i) {
			var child = this.children[i];
			if (child.visible) child.updateTransform();
		}
		return result;
	};
	/**
	* Recalculates the content bounds of this object. This should be overriden to
	* calculate the bounds of this specific object (not including children).
	* @protected
	*/
	Container.prototype._calculateBounds = function() {};
	/**
	* Renders this object and its children with culling.
	* @protected
	* @param {PIXI.Renderer} renderer - The renderer
	*/
	Container.prototype._renderWithCulling = function(renderer) {
		var sourceFrame = renderer.renderTexture.sourceFrame;
		if (!(sourceFrame.width > 0 && sourceFrame.height > 0)) return;
		var bounds;
		var transform;
		if (this.cullArea) {
			bounds = this.cullArea;
			transform = this.worldTransform;
		} else if (this._render !== Container.prototype._render) bounds = this.getBounds(true);
		if (bounds && sourceFrame.intersects(bounds, transform)) this._render(renderer);
		else if (this.cullArea) return;
		for (var i = 0, j = this.children.length; i < j; ++i) {
			var child = this.children[i];
			var childCullable = child.cullable;
			child.cullable = childCullable || !this.cullArea;
			child.render(renderer);
			child.cullable = childCullable;
		}
	};
	/**
	* Renders the object using the WebGL renderer.
	*
	* The [_render]{@link PIXI.Container#_render} method is be overriden for rendering the contents of the
	* container itself. This `render` method will invoke it, and also invoke the `render` methods of all
	* children afterward.
	*
	* If `renderable` or `visible` is false or if `worldAlpha` is not positive or if `cullable` is true and
	* the bounds of this object are out of frame, this implementation will entirely skip rendering.
	* See {@link PIXI.DisplayObject} for choosing between `renderable` or `visible`. Generally,
	* setting alpha to zero is not recommended for purely skipping rendering.
	*
	* When your scene becomes large (especially when it is larger than can be viewed in a single screen), it is
	* advised to employ **culling** to automatically skip rendering objects outside of the current screen.
	* See [cullable]{@link PIXI.DisplayObject#cullable} and [cullArea]{@link PIXI.DisplayObject#cullArea}.
	* Other culling methods might be better suited for a large number static objects; see
	* [@pixi-essentials/cull]{@link https://www.npmjs.com/package/@pixi-essentials/cull} and
	* [pixi-cull]{@link https://www.npmjs.com/package/pixi-cull}.
	*
	* The [renderAdvanced]{@link PIXI.Container#renderAdvanced} method is internally used when when masking or
	* filtering is applied on a container. This does, however, break batching and can affect performance when
	* masking and filtering is applied extensively throughout the scene graph.
	* @param renderer - The renderer
	*/
	Container.prototype.render = function(renderer) {
		if (!this.visible || this.worldAlpha <= 0 || !this.renderable) return;
		if (this._mask || this.filters && this.filters.length) this.renderAdvanced(renderer);
		else if (this.cullable) this._renderWithCulling(renderer);
		else {
			this._render(renderer);
			for (var i = 0, j = this.children.length; i < j; ++i) this.children[i].render(renderer);
		}
	};
	/**
	* Render the object using the WebGL renderer and advanced features.
	* @param renderer - The renderer
	*/
	Container.prototype.renderAdvanced = function(renderer) {
		var filters = this.filters;
		var mask = this._mask;
		if (filters) {
			if (!this._enabledFilters) this._enabledFilters = [];
			this._enabledFilters.length = 0;
			for (var i = 0; i < filters.length; i++) if (filters[i].enabled) this._enabledFilters.push(filters[i]);
		}
		var flush = filters && this._enabledFilters && this._enabledFilters.length || mask && (!mask.isMaskData || mask.enabled && (mask.autoDetect || mask.type !== MASK_TYPES.NONE));
		if (flush) renderer.batch.flush();
		if (filters && this._enabledFilters && this._enabledFilters.length) renderer.filter.push(this, this._enabledFilters);
		if (mask) renderer.mask.push(this, this._mask);
		if (this.cullable) this._renderWithCulling(renderer);
		else {
			this._render(renderer);
			for (var i = 0, j = this.children.length; i < j; ++i) this.children[i].render(renderer);
		}
		if (flush) renderer.batch.flush();
		if (mask) renderer.mask.pop(this);
		if (filters && this._enabledFilters && this._enabledFilters.length) renderer.filter.pop();
	};
	/**
	* To be overridden by the subclasses.
	* @param _renderer - The renderer
	*/
	Container.prototype._render = function(_renderer) {};
	/**
	* Removes all internal references and listeners as well as removes children from the display list.
	* Do not use a Container after calling `destroy`.
	* @param options - Options parameter. A boolean will act as if all options
	*  have been set to that value
	* @param {boolean} [options.children=false] - if set to true, all the children will have their destroy
	*  method called as well. 'options' will be passed on to those calls.
	* @param {boolean} [options.texture=false] - Only used for child Sprites if options.children is set to true
	*  Should it destroy the texture of the child sprite
	* @param {boolean} [options.baseTexture=false] - Only used for child Sprites if options.children is set to true
	*  Should it destroy the base texture of the child sprite
	*/
	Container.prototype.destroy = function(options) {
		_super.prototype.destroy.call(this);
		this.sortDirty = false;
		var destroyChildren = typeof options === "boolean" ? options : options && options.children;
		var oldChildren = this.removeChildren(0, this.children.length);
		if (destroyChildren) for (var i = 0; i < oldChildren.length; ++i) oldChildren[i].destroy(options);
	};
	Object.defineProperty(Container.prototype, "width", {
		/** The width of the Container, setting this will actually modify the scale to achieve the value set. */
		get: function() {
			return this.scale.x * this.getLocalBounds().width;
		},
		set: function(value) {
			var width = this.getLocalBounds().width;
			if (width !== 0) this.scale.x = value / width;
			else this.scale.x = 1;
			this._width = value;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(Container.prototype, "height", {
		/** The height of the Container, setting this will actually modify the scale to achieve the value set. */
		get: function() {
			return this.scale.y * this.getLocalBounds().height;
		},
		set: function(value) {
			var height = this.getLocalBounds().height;
			if (height !== 0) this.scale.y = value / height;
			else this.scale.y = 1;
			this._height = value;
		},
		enumerable: false,
		configurable: true
	});
	return Container;
}(DisplayObject);
/**
* Container default updateTransform, does update children of container.
* Will crash if there's no parent element.
* @memberof PIXI.Container#
* @method containerUpdateTransform
*/
Container.prototype.containerUpdateTransform = Container.prototype.updateTransform;
//#endregion
export { Shader as $, hex2rgb as $t, GLFramebuffer as A, RENDERER_TYPE as An, UPDATE_PRIORITY as At, MaskSystem as B, Point as Bt, ContextSystem as C, ENV as Cn, getTestContext as Ct, FilterSystem as D, MIPMAP_MODES as Dn, uniformParsers as Dt, FilterState as E, MASK_TYPES as En, systems as Et, IGLUniformData as F, WRAP_MODES as Fn, DEG_TO_RAD as Ft, QuadUv as G, SHAPES as Gt, Program as H, RAD_TO_DEG as Ht, INSTALLED as I, Ellipse as It, RenderTextureSystem as J, CanvasRenderTarget as Jt, RenderTexture as K, Transform as Kt, ImageBitmapResource as L, Matrix as Lt, GLTexture as M, SCALE_MODES as Mn, ExtensionType as Mt, Geometry as N, TARGETS as Nn, extensions as Nt, Framebuffer as O, MSAA_QUALITY as On, Ticker as Ot, GeometrySystem as P, TYPES as Pn, Circle as Pt, ScissorSystem as Q, getResolutionOfUrl as Qt, ImageResource as R, ObservablePoint as Rt, CanvasResource as S, DRAW_MODES as Sn, generateUniformBufferSync as St, Filter as T, GC_MODES as Tn, resources as Tt, ProjectionSystem as U, Rectangle as Ut, ObjectRenderer as V, Polygon as Vt, Quad as W, RoundedRectangle as Wt, Resource as X, createIndicesForQuads as Xt, Renderer as Y, correctBlendMode as Yt, SVGResource as Z, deprecation as Zt, BatchShaderGenerator as _, BLEND_MODES as _n, checkMaxIfStatementsInShader as _t, AbstractBatchRenderer as a, premultiplyTintToRgba as an, System as at, Buffer as b, CLEAR_MODES as bn, defaultVertex$1 as bt, ArrayResource as c, string2hex as cn, TextureMatrix as ct, BaseRenderTexture as d, url as dn, UniformGroup as dt, hex2string as en, ShaderSystem as et, BaseTexture as f, utils_exports as fn, VERSION as ft, BatchRenderer as g, ALPHA_MODES as gn, autoDetectResource as gt, BatchPluginFactory as h, settings as hn, autoDetectRenderer as ht, TemporaryDisplayObject as i, premultiplyTint as in, StencilSystem as it, GLProgram as j, SAMPLER_TYPES as jn, Runner as jt, FramebufferSystem as k, PRECISION as kn, TickerPlugin as kt, Attribute as l, trimCanvas as ln, TextureSystem as lt, BatchGeometry as m, isMobile as mn, ViewableBuffer as mt, Container as n, import_eventemitter3 as nn, State as nt, AbstractMultiResource as o, removeItems as on, Texture as ot, BatchDrawCall as p, BrowserAdapter as pn, VideoResource as pt, RenderTexturePool as q, groupD8 as qt, DisplayObject as r, premultiplyRgba as rn, StateSystem as rt, AbstractRenderer as s, sign as sn, TextureGCSystem as st, Bounds as t, import_earcut as tn, SpriteMaskFilter as tt, BaseImageResource as u, uid as un, TextureUvs as ut, BatchSystem as v, BUFFER_BITS as vn, createUBOElements as vt, CubeResource as w, FORMATS as wn, getUBOData as wt, BufferResource as x, COLOR_MASK_BITS as xn, generateProgram as xt, BatchTextureArray as y, BUFFER_TYPE as yn, defaultFilterVertex as yt, MaskData as z, PI_2 as zt };
