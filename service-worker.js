const CACHE_NAME = "maison-des-contes-pwa-v28";
const APP_SHELL = [
	"./",
	"./index.html",
	"./launch.html",
	"./game.html",
	"./game.css",
	"./styles.css",
	"./app.js",
	"./parent-auth.js",
	"./install.js",
	"./manifest.webmanifest",
	"./assets/images/loading-cover.png",
	"./assets/images/header-logo.png",
	"./assets/images/hero-book.png",
	"./icons/maison-des-contes-192.png",
	"./icons/maison-des-contes-512.png"
];
self.addEventListener("install", (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
	);
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches.keys().then((keys) => Promise.all(
			keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
		))
	);
	self.clients.claim();
});

self.addEventListener("message", (event) => {
	if (!event.data || event.data.type !== "CACHE_GAME") {
		return;
	}

	const files = Array.isArray(event.data.files) ? event.data.files : [];
	if (files.length === 0) {
		return;
	}

	event.waitUntil(cacheGameFiles(event.source, files));
});

self.addEventListener("fetch", (event) => {
	if (event.request.method !== "GET") {
		return;
	}

	const url = new URL(event.request.url);
	const isUnityBuildFile = isUnityArtifact(url);

	if (isUnityBuildFile) {
		event.respondWith(cacheFirst(event.request));
		return;
	}

	event.respondWith(networkFirst(event.request));
});

function isUnityArtifact(url) {
	const path = url.pathname.toLowerCase();
	return /\/build\/(?:[^/]+\/)*[^/]+\.(?:loader\.js|data(?:\.[^/]*)?|framework\.js(?:\.[^/]*)?|wasm(?:\.[^/]*)?)$/i.test(path);
}

async function cacheGameFiles(client, files) {
	const cache = await caches.open(CACHE_NAME);
	let cachedCount = 0;

	for (const file of files) {
		const request = new Request(file, { cache: "reload" });
		const cached = await caches.match(request);
		if (cached) {
			cachedCount++;
			reportCacheProgress(client, cachedCount, files.length);
			continue;
		}

		try {
			const response = await fetch(request);
			if (!response.ok) {
				reportCacheProgress(client, cachedCount, files.length, true);
				return;
			}

			await cache.put(request, response.clone());
			cachedCount++;
		} catch {
			reportCacheProgress(client, cachedCount, files.length, true);
			return;
		}

		reportCacheProgress(client, cachedCount, files.length);
	}

	await removeObsoleteBuildVariants(cache, files);
	reportCacheProgress(client, cachedCount, files.length, false, true);
}

function reportCacheProgress(client, cachedCount, totalCount, failed = false, complete = false) {
	if (!client) {
		return;
	}

	client.postMessage({
		type: "CACHE_GAME_PROGRESS",
		cachedCount,
		totalCount,
		failed,
		complete
	});
}

async function cacheFirst(request) {
	const cached = await caches.match(request);
	if (cached) {
		return cached;
	}

	const response = await fetch(request);
	if (response.ok) {
		const cache = await caches.open(CACHE_NAME);
		cache.put(request, response.clone());
	}
	return response;
}

async function removeObsoleteBuildVariants(cache, files) {
	const wanted = new Set(files.map((file) => new URL(file, self.location.href).href));
	const requests = await cache.keys();

	for (const request of requests) {
		const url = new URL(request.url);
		if (isUnityArtifact(url) && !wanted.has(url.href)) {
			await cache.delete(request);
		}
	}
}

async function networkFirst(request) {
	const requestUrl = new URL(request.url);
	const cacheRequest = isUnityIndex(requestUrl)
		? new Request(new URL(requestUrl.pathname, requestUrl.origin).href)
		: request;

	try {
		const response = await fetch(request);
		if (response.ok) {
			const cache = await caches.open(CACHE_NAME);
			cache.put(cacheRequest, response.clone());
		}
		return response;
	} catch {
		const cached = await caches.match(cacheRequest);
		if (cached) {
			return cached;
		}
		throw new Error("Offline and no cached response available.");
	}
}

function isUnityIndex(url) {
	return /\/build\/index\.html$/i.test(url.pathname);
}
