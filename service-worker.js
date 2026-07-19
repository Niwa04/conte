const CACHE_NAME = "maison-des-contes-pwa-v18";
const APP_SHELL = [
	"./",
	"./index.html",
	"./launch.html",
	"./game.html",
	"./game.css",
	"./styles.css",
	"./app.js",
	"./install.js",
	"./manifest.webmanifest",
	"./assets/images/loading-cover.png",
	"./assets/images/header-logo.png",
	"./assets/images/hero-book.png",
	"./icons/icon.svg",
	"./icons/maskable-icon.svg",
	"./icons/icon-192.png",
	"./icons/icon-512.png"
];
const GAME_FILES = [
	"./build/Build/Build.loader.js",
	"./build/Build/Build.data.br",
	"./build/Build/Build.framework.js.br",
	"./build/Build/Build.wasm.br",
	"./build/TemplateData/favicon.ico",
	"./build/TemplateData/style.css"
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

	event.waitUntil(cacheGameFiles(event.source));
});

self.addEventListener("fetch", (event) => {
	if (event.request.method !== "GET") {
		return;
	}

	const url = new URL(event.request.url);
	const isUnityBuildFile = url.pathname.includes("/build/");

	if (isUnityBuildFile) {
		event.respondWith(cacheFirst(event.request));
		return;
	}

	event.respondWith(networkFirst(event.request));
});

async function cacheGameFiles(client) {
	const cache = await caches.open(CACHE_NAME);
	let cachedCount = 0;

	for (const file of GAME_FILES) {
		const request = new Request(file, { cache: "reload" });
		const cached = await caches.match(request);
		if (cached) {
			cachedCount++;
			reportCacheProgress(client, cachedCount, GAME_FILES.length);
			continue;
		}

		try {
			const response = await fetch(request);
			if (response.ok) {
				await cache.put(request, response.clone());
				cachedCount++;
			}
		} catch {
			reportCacheProgress(client, cachedCount, GAME_FILES.length, true);
			return;
		}

		reportCacheProgress(client, cachedCount, GAME_FILES.length);
	}

	reportCacheProgress(client, cachedCount, GAME_FILES.length, false, true);
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

async function networkFirst(request) {
	try {
		const response = await fetch(request);
		if (response.ok) {
			const cache = await caches.open(CACHE_NAME);
			cache.put(request, response.clone());
		}
		return response;
	} catch {
		const cached = await caches.match(request);
		if (cached) {
			return cached;
		}
		throw new Error("Offline and no cached response available.");
	}
}
