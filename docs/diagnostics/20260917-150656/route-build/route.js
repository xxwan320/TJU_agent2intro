import { n as __toESM } from "./rolldown-runtime-BPOCksWG.js";
Object.freeze({
	map_load: 1,
	geolocation: 1,
	poi_search: 0,
	walking_route: 1
});
Object.freeze({
	map_load: 100,
	geolocation: 3e3,
	poi_search: 100,
	walking_route: 200
});
var MapCallError = class extends Error {
	code;
	constructor(code) {
		super(code);
		this.name = "MapCallError";
		this.code = code;
	}
};
//#endregion
//#region frontend/src/transport/api.ts
async function api(path, options) {
	const controller = new AbortController();
	const external = options?.signal;
	const abort = () => controller.abort(external?.reason);
	if (external?.aborted) abort();
	else external?.addEventListener("abort", abort, { once: true });
	const timeout = setTimeout(() => controller.abort(/* @__PURE__ */ new Error("transport_timeout")), path === "/chat" || path === "/tours" || path.startsWith("/tours/") ? 125e3 : 15e3);
	try {
		const response = await fetch("/api" + path, {
			...options,
			signal: controller.signal
		});
		let body;
		try {
			body = await response.json();
		} catch (error) {
			if (controller.signal.aborted) throw error;
			throw { error: {
				code: "UPSTREAM_PROTOCOL_ERROR",
				message: "应用接口未返回有效 JSON。",
				request_id: null,
				retryable: false
			} };
		}
		if (!response.ok) throw body;
		return body;
	} catch (error) {
		if (controller.signal.aborted && !external?.aborted) throw { error: {
			code: "TRANSPORT_TIMEOUT",
			message: "等待应用接口超时，请重试。",
			request_id: null,
			retryable: true
		} };
		throw error;
	} finally {
		clearTimeout(timeout);
		external?.removeEventListener("abort", abort);
	}
}
//#endregion
//#region frontend/src/transport/amap-navigation.ts
var DestinationSelectionRequired = class extends MapCallError {
	matches;
	origin;
	constructor(matches) {
		super("destination_selection_required");
		this.matches = matches;
	}
};
var loadSdk = async (config) => {
	if (!config.js_key || !config.status.security_key_configured) throw new MapCallError("map_not_configured");
	window._AMapSecurityConfig = { serviceHost: window.location.origin + config.service_host };
	return await (await import("./dist-C7Su4ecp.js").then((m) => /* @__PURE__ */ __toESM(m.default, 1))).default.load({
		key: config.js_key,
		version: "2.0",
		plugins: ["AMap.Geolocation", "AMap.CitySearch"]
	});
};
function pair(value) {
	const p = value;
	const lng = typeof p?.getLng === "function" ? p.getLng() : p?.lng;
	const lat = typeof p?.getLat === "function" ? p.getLat() : p?.lat;
	if (typeof lng !== "number" || typeof lat !== "number" || !Number.isFinite(lng) || !Number.isFinite(lat) || Math.abs(lng) > 180 || Math.abs(lat) > 90) throw new MapCallError("invalid_coordinates");
	return [lng, lat];
}
function providerPoint(value) {
	if (typeof value !== "string") throw new MapCallError("invalid_coordinates");
	const parts = value.split(",");
	if (parts.length !== 2 || parts.some((p) => !p.trim())) throw new MapCallError("invalid_coordinates");
	return pair({
		lng: Number(parts[0]),
		lat: Number(parts[1])
	});
}
function meters(value) {
	if (typeof value !== "number" && (typeof value !== "string" || !/^\d+(?:\.\d+)?$/.test(value))) throw new MapCallError("invalid_route_result");
	const result = Number(value);
	if (!Number.isFinite(result) || result < 0) throw new MapCallError("invalid_route_result");
	return result;
}
var SERVICE_CODES = /* @__PURE__ */ new Set([
	"NOT_CONFIGURED",
	"VALIDATION_ERROR",
	"RATE_LIMITED",
	"UPSTREAM_TIMEOUT",
	"TRANSPORT_TIMEOUT",
	"NETWORK_ERROR",
	"UPSTREAM_PROTOCOL_ERROR",
	"INVALID_USER_KEY",
	"USERKEY_PLAT_NOMATCH",
	"INVALID_USER_SCODE",
	"INVALID_USER_DOMAIN",
	"DAILY_QUERY_OVER_LIMIT",
	"INSUFFICIENT_PRIVILEGES",
	"NO_ROADS_NEARBY",
	"OVER_DIRECTION_RANGE",
	"OUT_OF_SERVICE"
]);
function callbackResult(signal, invoke, parse, cleanup = () => {}, timeoutMs = 15e3) {
	return new Promise((resolve, reject) => {
		let settled = false;
		const finish = (error, value) => {
			if (settled) return;
			settled = true;
			clearTimeout(timer);
			signal.removeEventListener("abort", abort);
			cleanup();
			if (error) reject(error);
			else resolve(value);
		};
		const abort = () => finish(new MapCallError("cancelled"));
		const timer = setTimeout(() => finish(new MapCallError("map_timeout")), timeoutMs);
		signal.addEventListener("abort", abort, { once: true });
		if (signal.aborted) {
			abort();
			return;
		}
		try {
			invoke((status, result) => {
				if (settled) return;
				if (status !== "complete") {
					const data = result;
					const reason = [
						data?.info,
						data?.message,
						data?.code
					].filter((x) => typeof x === "string").join(" ").toUpperCase();
					const code = /PERMISSION_DENIED|USER_DENIED|USER DENIED/.test(reason) ? "permission_denied" : /TIME_OUT|TIMEOUT|TIME OUT/.test(reason) ? "location_timeout" : status === "no_data" ? "route_no_data" : "map_provider_failed";
					finish(new MapCallError(code));
					return;
				}
				try {
					finish(null, parse(result));
				} catch (error) {
					finish(error);
				}
			});
		} catch (error) {
			finish(error);
		}
	});
}
var AmapNavigation = class {
	sdk = null;
	loading = null;
	config;
	budget;
	loader;
	readJson;
	destinations = /* @__PURE__ */ new Map();
	destinationLists = /* @__PURE__ */ new Map();
	constructor(config, budget, loader = loadSdk, readJson = api) {
		this.config = config;
		this.budget = budget;
		this.loader = loader;
		this.readJson = readJson;
	}
	async serviceGet(path, params, signal) {
		if (signal.aborted) throw new MapCallError("cancelled");
		let abort = () => {};
		const cancelled = new Promise((_, reject) => {
			abort = () => reject(new MapCallError("cancelled"));
			signal.addEventListener("abort", abort, { once: true });
		});
		try {
			const body = await Promise.race([this.readJson("/maps/amap/_AMapService/" + path + "?" + new URLSearchParams({
				...params,
				output: "JSON"
			}), {
				signal,
				cache: "no-store"
			}), cancelled]);
			if (!body || String(body.status) !== "1") throw new MapCallError("UPSTREAM_PROTOCOL_ERROR");
			return body;
		} catch (error) {
			if (signal.aborted) throw new MapCallError("cancelled");
			if (error instanceof MapCallError) throw error;
			const code = error?.error?.code;
			throw new MapCallError(typeof code === "string" && SERVICE_CODES.has(code) ? code : "NETWORK_ERROR");
		} finally {
			signal.removeEventListener("abort", abort);
		}
	}
	assertReady() {
		if (!this.config.js_key || !this.config.status.security_key_configured) throw new MapCallError("map_not_configured");
		if (!["UNVERIFIED", "VERIFIED"].includes(this.config.status.online_map)) throw new MapCallError("map_proxy_not_ready");
	}
	async getSdk() {
		this.assertReady();
		if (!this.config.js_key || !this.config.status.security_key_configured) throw new MapCallError("map_not_configured");
		if (this.sdk) return this.sdk;
		if (!this.loading) this.loading = this.loader(this.config).then((sdk) => {
			this.sdk = sdk;
			return sdk;
		});
		return this.loading;
	}
	async createMap(host, operationId, signal, userInitiated, options = {}) {
		this.assertReady();
		return this.budget.run("map_load", operationId, userInitiated, signal, async () => {
			const sdk = await this.getSdk();
			if (signal.aborted) throw new MapCallError("cancelled");
			const handle = new sdk.Map(host, {
				zoom: 15,
				...options
			});
			if (signal.aborted) {
				handle.destroy();
				throw new MapCallError("cancelled");
			}
			return handle;
		});
	}
	async locate(operationId, signal, userConsented) {
		this.assertReady();
		return this.budget.run("geolocation", operationId, userConsented, signal, async () => {
			const sdk = await this.getSdk();
			if (signal.aborted) throw new MapCallError("cancelled");
			const geo = new sdk.Geolocation({
				enableHighAccuracy: true,
				timeout: 1e4,
				convert: true,
				noIpLocate: 0,
				showMarker: false,
				showCircle: false,
				panToLocation: false
			});
			return callbackResult(signal, (done) => geo.getCurrentPosition(done), (value) => {
				const result = value;
				const [lng, lat] = pair(result.position);
				return {
					lng,
					lat,
					crs: "GCJ02",
					source: "amap_geolocation",
					accuracy_m: typeof result.accuracy === "number" && Number.isFinite(result.accuracy) && result.accuracy >= 0 && result.location_type !== "ip" ? result.accuracy : null,
					timestamp: (/* @__PURE__ */ new Date()).toISOString()
				};
			});
		});
	}
	async locateCity(operationId, signal, userConsented) {
		this.assertReady();
		return this.budget.run("geolocation", operationId, userConsented, signal, async () => {
			const result = await this.serviceGet("v3/ip", {}, signal);
			if (typeof result.rectangle !== "string" || !result.rectangle.includes(";")) throw new MapCallError("city_location_unavailable");
			const corners = result.rectangle.split(";").map(providerPoint);
			if (corners.length !== 2) throw new MapCallError("city_location_unavailable");
			const coordinates = pair({
				lng: (corners[0][0] + corners[1][0]) / 2,
				lat: (corners[0][1] + corners[1][1]) / 2
			});
			return {
				lng: coordinates[0],
				lat: coordinates[1],
				crs: "GCJ02",
				source: "amap_geolocation",
				accuracy_m: null,
				timestamp: (/* @__PURE__ */ new Date()).toISOString()
			};
		});
	}
	async findDestination(poi, operationId, signal) {
		this.assertReady();
		if (signal.aborted) throw new MapCallError("cancelled");
		const cached = this.destinationLists.get(poi.id);
		if (cached?.length && cached.every((match) => Date.now() - match.matchedAt < 6e5)) return cached;
		return this.budget.run("poi_search", operationId, true, signal, async () => {
			const campus = poi.campus_id === "weijinlu" ? "天津大学卫津路校区" : "天津大学北洋园校区";
			const rows = (await this.serviceGet("v3/place/text", {
				keywords: campus + poi.name.replace(/天津大学|卫津路校区|北洋园校区/g, "").trim(),
				city: "天津",
				citylimit: "true",
				offset: "5",
				page: "1",
				extensions: "base"
			}, signal)).pois;
			if (rows !== void 0 && !Array.isArray(rows)) throw new MapCallError("UPSTREAM_PROTOCOL_ERROR");
			if (!rows?.length) throw new MapCallError("destination_not_found");
			const matches = rows.slice(0, 5).filter((row) => typeof row.id === "string" && typeof row.name === "string" && row.location).map((row) => {
				const [lng, lat] = providerPoint(row.location);
				const match = Object.freeze({
					poiId: poi.id,
					providerId: row.id,
					name: row.name,
					address: typeof row.address === "string" ? row.address : "地址未提供",
					lng,
					lat,
					matchedAt: Date.now()
				});
				this.destinations.set(poi.id + "/" + row.id, match);
				return match;
			});
			while (this.destinations.size > 100) this.destinations.delete(this.destinations.keys().next().value);
			if (!matches.length) throw new MapCallError("destination_not_found");
			this.destinationLists.set(poi.id, matches);
			while (this.destinationLists.size > 100) this.destinationLists.delete(this.destinationLists.keys().next().value);
			return matches;
		});
	}
	async navigate(request, poi, signal, matched) {
		if (poi.id !== request.destination_poi_id || poi.campus_id !== request.campus_id) throw new MapCallError("poi_context_mismatch");
		if (!request.user_initiated) throw new MapCallError("user_action_required");
		let origin = request.origin;
		if (!origin || origin.source !== "manual" && (!Number.isFinite(Date.parse(origin.timestamp)) || Date.now() - Date.parse(origin.timestamp) > 12e4)) origin = await this.locateCity(request.route_id + "-ip", signal, true);
		let route;
		try {
			route = await this.walk({
				...request,
				origin
			}, poi, signal, matched);
		} catch (error) {
			if (error instanceof DestinationSelectionRequired) error.origin = origin;
			throw error;
		}
		const matches = this.destinationLists.get(poi.id) ?? [];
		const destination = matched && Date.now() - matched.matchedAt < 6e5 ? matched : matches.find((candidate) => candidate.name.endsWith(poi.name)) ?? (matches.length === 1 ? matches[0] : void 0);
		return {
			route,
			origin,
			destination
		};
	}
	async walk(request, poi, signal, matched) {
		if (signal.aborted) throw new MapCallError("cancelled");
		if (!request.user_initiated) throw new MapCallError("user_action_required");
		if (poi.id !== request.destination_poi_id || poi.campus_id !== request.campus_id) throw new MapCallError("poi_context_mismatch");
		const entrance = request.entrance_id ? poi.entrances.find((x) => x.id === request.entrance_id) : null;
		if (request.entrance_id && !entrance) throw new MapCallError("entrance_not_found");
		let target = entrance ? entrance.location : poi.location;
		if (matched && Date.now() - matched.matchedAt >= 6e5) matched = void 0;
		const loc = entrance ? entrance.location : poi.location;
		if (!matched && (!loc || loc.crs !== "GCJ02" || loc.quality === "pending" || loc.quality === "approximate" || !loc.verified_at || poi.verification_status !== "verified")) {
			const matches = await this.findDestination(poi, request.route_id + "-destination", signal);
			const exact = matches.filter((candidate) => candidate.name.endsWith(poi.name));
			if (exact.length === 1) matched = exact[0];
			else if (matches.length === 1) matched = matches[0];
			else throw new DestinationSelectionRequired(matches);
		}
		if (matched) {
			const known = this.destinations.get(poi.id + "/" + matched.providerId);
			if (!known || known !== matched || known.poiId !== poi.id || Date.now() - known.matchedAt > 6e5) throw new MapCallError("destination_match_expired");
			target = known;
		} else target = loc;
		const origin = request.origin;
		pair(origin);
		pair(target);
		const age = Date.now() - Date.parse(origin.timestamp);
		if (origin.crs !== "GCJ02" || !["manual", "amap_geolocation"].includes(origin.source) || origin.accuracy_m !== null && (!Number.isFinite(origin.accuracy_m) || origin.accuracy_m < 0) || origin.source === "manual" && origin.accuracy_m !== null || !Number.isFinite(age) || age < -5e3 || origin.source !== "manual" && age > 12e4) throw new MapCallError("location_expired_or_inaccurate");
		this.assertReady();
		return this.budget.run("walking_route", request.route_id, request.user_initiated, signal, async () => {
			const point = (p) => p.lng.toFixed(6) + "," + p.lat.toFixed(6);
			const paths = (await this.serviceGet("v3/direction/walking", {
				origin: point(origin),
				destination: point(target)
			}, signal)).route?.paths;
			if (!Array.isArray(paths) || !paths.length) throw new MapCallError("route_no_data");
			const raw = paths[0];
			if (!raw || !Array.isArray(raw.steps) || !raw.steps.length) throw new MapCallError("invalid_route_result");
			const steps = raw.steps.map((step) => {
				if (typeof step.instruction !== "string" || !step.instruction.trim() || typeof step.polyline !== "string" || !step.polyline) throw new MapCallError("invalid_route_step");
				return {
					instruction: step.instruction,
					distance_m: meters(step.distance),
					polyline: step.polyline.split(";").map(providerPoint)
				};
			});
			return {
				route_id: request.route_id,
				destination_poi_id: poi.id,
				provider: "amap",
				crs: "GCJ02",
				distance_m: meters(raw.distance),
				duration_s: raw.duration == null ? null : meters(raw.duration),
				steps,
				campus_access: "unverified",
				access_source_refs: []
			};
		});
	}
};
function routeNarration(route) {
	return [
		"步行路线，全程约" + Math.round(route.distance_m) + "米。",
		...route.steps.map((s, i) => "第" + (i + 1) + "步，" + s.instruction),
		...route.campus_access === "unverified" ? ["校园入口、门禁和道路实际通行情况尚待核验。"] : []
	].join("\n");
}
async function speakRoute(controller, run, route) {
	return controller.playFull(run, routeNarration(route));
}
//#endregion
export { AmapNavigation, DestinationSelectionRequired, routeNarration, speakRoute };
