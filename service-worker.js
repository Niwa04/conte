const CACHE_NAME = "maison-des-contes-pwa-v77";
const PWA_CACHE_PREFIX = "maison-des-contes-pwa-";
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
			// Préserver UnityCache et les autres caches qui n'appartiennent pas à la PWA.
			keys.filter((key) => key.startsWith(PWA_CACHE_PREFIX) && key !== CACHE_NAME)
				.map((key) => caches.delete(key))
		))
	);
	self.clients.claim();
});

self.addEventListener("message", (event) => {
	if (!event.data || event.data.type !== "CACHE_GAME") {
		return;
	}

	event.waitUntil(cacheGameFiles(event.source, event.data.files));
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


async function cacheGameFiles(client, requestedFiles) {
	const cache = await caches.open(CACHE_NAME);
	const files = Array.isArray(requestedFiles) ? requestedFiles : [];
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
			if (response.ok) {
				await cache.put(request, response.clone());
				cachedCount++;
			}
		} catch {
			reportCacheProgress(client, cachedCount, files.length, true);
			return;
		}

		reportCacheProgress(client, cachedCount, files.length);
	}

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
