const UNITY_BUILD_ROOTS = ["build", "Build", "PWA/build", "PWA/Build"];
// À mettre à jour après chaque nouveau build Unity pour invalider à la fois
// le cache du service worker et le cache IndexedDB interne du loader WebGL.
const UNITY_BUILD_VERSION = "20260910-1";
const GAME_REVEAL_DELAY_MS = 3000;
const PARENT_AUTH_BRIDGE_TIMEOUT_MS = 20000;
const LOADING_MESSAGE = "Ouverture de la Maison des Contes...";
const UNITY_LOADER_NAMES = [
	"Build.loader.js",
	"StoryBook.loader.js",
	"storybook.loader.js",
	"build.loader.js",
	"WebGL.loader.js"
];

const statusText = document.getElementById("statusText");
const progressFill = document.getElementById("progressFill");
const loadingPanel = document.getElementById("loadingPanel");
const unityCanvas = document.getElementById("unityCanvas");
let lastCheckedUnityLoaderUrl = "";
let unityBuildAssetUrls = null;

registerServiceWorker();
initUnity();
syncViewportSize();

window.addEventListener("resize", syncViewportSize);
window.addEventListener("orientationchange", syncViewportSize);

function registerServiceWorker() {
	if (isLocalPreview()) {
		// Le lanceur local doit toujours tester les fichiers fraîchement générés.
		// On retire un ancien worker/caches éventuels sans toucher la production.
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker.getRegistrations().then((registrations) =>
				Promise.all(registrations.map((registration) => registration.unregister()))
			).catch(() => {});
		}
		if ("caches" in window) {
			caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key)))).catch(() => {});
		}
		return;
	}

	if ("serviceWorker" in navigator) {
		window.addEventListener("load", () => {
			navigator.serviceWorker.register("service-worker.js").catch(() => {
				setStatus("Le mode hors ligne n'a pas pu etre active.");
			});
		});
	}
}

async function precacheGameForOffline(files = []) {
	if (isLocalPreview() || !("serviceWorker" in navigator)) {
		return;
	}

	try {
		const registration = await navigator.serviceWorker.ready;
		const worker = registration.active || registration.waiting || registration.installing;
		if (worker) {
			worker.postMessage({ type: "CACHE_GAME", files });
		}
	} catch {
		// The current online launch can continue without the offline cache.
	}
}

function isLocalPreview() {
	return ["localhost", "127.0.0.1"].includes(window.location.hostname);
}

async function initUnity() {
	setStatus(LOADING_MESSAGE);

	const loaderUrl = await findUnityLoader();
	if (!loaderUrl) {
		setMissingBuildState();
		return;
	}

	await loadScript(loaderUrl);

	if (typeof createUnityInstance !== "function") {
		setStatus("Le loader Unity est present, mais createUnityInstance est introuvable.");
		return;
	}

	const buildBasePath = loaderUrl.slice(0, loaderUrl.lastIndexOf("/"));
	const buildName = loaderUrl.split("/").pop().replace(".loader.js", "");
	const config = {
		arguments: [],
		dataUrl: unityBuildAssetUrls?.dataUrl || await findExistingUnityFile(buildBasePath, buildName, "data"),
		frameworkUrl: unityBuildAssetUrls?.frameworkUrl || await findExistingUnityFile(buildBasePath, buildName, "framework.js"),
		codeUrl: unityBuildAssetUrls?.codeUrl || await findExistingUnityFile(buildBasePath, buildName, "wasm"),
		streamingAssetsUrl: "build/StreamingAssets",
		companyName: "DefaultCompany",
		productName: "Maison des contes",
		productVersion: "0.1.0",
		autoSyncPersistentDataPath: true
	};
	precacheGameForOffline([loaderUrl, config.dataUrl, config.frameworkUrl, config.codeUrl]);

	setStatus(LOADING_MESSAGE);
	createUnityInstance(unityCanvas, config, (progress) => {
		progressFill.style.width = `${Math.round(progress * 100)}%`;
	}).then(async (unityInstance) => {
		window.unityInstance = unityInstance;
		window.dispatchEvent(new Event("MaisonDesContesUnityReady"));
		scheduleParentAuthBridgeCheck(unityInstance);
		progressFill.style.width = "100%";
		setStatus(LOADING_MESSAGE);
		await delay(GAME_REVEAL_DELAY_MS);
		loadingPanel.classList.add("is-hidden");
	}).catch((error) => {
		console.error(error);
		setStatus(`Le build Unity a ete trouve, mais le jeu n'a pas pu demarrer. ${formatError(error)}`);
	});
}

function scheduleParentAuthBridgeCheck(unityInstance) {
	window.setTimeout(() => {
		if (window.unityInstance !== unityInstance || window.MaisonDesContesAuth || !window.MaisonDesContesPendingReceiver) {
			return;
		}

		unityInstance.SendMessage(
			window.MaisonDesContesPendingReceiver,
			"OnParentAuthState",
			JSON.stringify({
				state: "error",
				error: "Le service de connexion n’a pas pu être chargé. Vérifiez votre connexion puis rechargez l’application."
			})
		);
	}, PARENT_AUTH_BRIDGE_TIMEOUT_MS);
}

async function findExistingUnityFile(buildBasePath, buildName, extension) {
	const candidates = [
		`${buildBasePath}/${buildName}.${extension}.br`,
		`${buildBasePath}/${buildName}.${extension}.gz`,
		`${buildBasePath}/${buildName}.${extension}`
	];

	for (const candidate of candidates) {
		lastCheckedUnityLoaderUrl = new URL(candidate, location.href).href;
		try {
			const response = await fetch(candidate, { method: "HEAD", cache: "no-store" });
			if (response.ok) {
				return candidate;
			}
		} catch {
			if (await hasCachedResponse(candidate)) {
				return candidate;
			}
		}
	}

	return candidates[0];
}

async function findUnityLoader() {
	// L'index Unity 6 contient les hash independants du loader, du framework,
	// des donnees et du wasm. Il doit etre lu avant toute detection directe.
	const loaderFromUnityIndex = await findLoaderFromUnityIndex();
	if (loaderFromUnityIndex) {
		return loaderFromUnityIndex;
	}

	const candidates = buildUnityLoaderCandidates();

	for (const candidate of candidates) {
		try {
			const response = await fetch(candidate, { method: "HEAD", cache: "no-store" });
			if (response.ok) {
				return candidate;
			}
		} catch {
			if (await hasCachedResponse(candidate)) {
				return candidate;
			}
		}
	}

	return null;
}

function buildUnityLoaderCandidates() {
	const candidates = [];

	for (const root of UNITY_BUILD_ROOTS) {
		for (const loaderName of UNITY_LOADER_NAMES) {
			candidates.push(`${root}/Build/${loaderName}`);
			candidates.push(`${root}/${loaderName}`);
		}
	}

	return [...new Set(candidates)];
}

async function findLoaderFromUnityIndex() {
	for (const root of UNITY_BUILD_ROOTS) {
		const indexUrl = `${root}/index.html`;
		lastCheckedUnityLoaderUrl = new URL(indexUrl, location.href).href;

		try {
			const response = await fetch(indexUrl, { cache: "no-store" });
			if (!response.ok) {
				continue;
			}

			const html = await response.text();
			const buildUrl = readUnityTemplateVariable(html, "buildUrl") || "Build";
			const loaderUrl = readUnityLoaderUrl(html, buildUrl) || `${buildUrl}/Build.loader.js`;
			const rootUrl = new URL(`${root}/`, location.href);
			const dataUrl = readUnityBuildAssetUrl(html, "dataUrl", buildUrl);
			const frameworkUrl = readUnityBuildAssetUrl(html, "frameworkUrl", buildUrl);
			const codeUrl = readUnityBuildAssetUrl(html, "codeUrl", buildUrl);
			unityBuildAssetUrls = {
				dataUrl: dataUrl ? new URL(dataUrl, rootUrl).href : null,
				frameworkUrl: frameworkUrl ? new URL(frameworkUrl, rootUrl).href : null,
				codeUrl: codeUrl ? new URL(codeUrl, rootUrl).href : null
			};
			return new URL(loaderUrl, rootUrl).href;
		} catch {
			// Continue to the next possible Unity build index.
		}
	}

	return null;
}

function readUnityTemplateVariable(html, variableName) {
	const pattern = new RegExp(`var\\s+${variableName}\\s*=\\s*["']([^"']+)["']`);
	const match = html.match(pattern);
	return match ? match[1] : null;
}

function readUnityLoaderUrl(html, buildUrl) {
	// Unity 6 emits: var loaderUrl = buildUrl + "/<hash>.loader.js";
	const relativeLoader = html.match(/var\s+loaderUrl\s*=\s*buildUrl\s*\+\s*["']([^"']+\.loader\.js)["']/);
	if (relativeLoader) {
		return `${buildUrl}/${relativeLoader[1]}`;
	}

	// Keep compatibility with templates that use a literal loader URL.
	const literalLoader = html.match(/var\s+loaderUrl\s*=\s*["']([^"']+\.loader\.js)["']/);
	return literalLoader ? literalLoader[1] : null;
}

function readUnityBuildAssetUrl(html, variableName, buildUrl) {
	const relativeAsset = html.match(new RegExp(`${variableName}\\s*:\\s*buildUrl\\s*\\+\\s*["']([^"']+)["']`));
	if (relativeAsset) {
		return `${buildUrl}/${relativeAsset[1]}`;
	}

	const literalAsset = html.match(new RegExp(`${variableName}\\s*:\\s*["']([^"']+)["']`));
	return literalAsset ? literalAsset[1] : null;
}

async function hasCachedResponse(url) {
	if (!("caches" in window)) {
		return false;
	}

	const response = await caches.match(url);
	return Boolean(response);
}

function loadScript(src) {
	return new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = src;
		script.async = true;
		script.onload = resolve;
		script.onerror = reject;
		document.body.appendChild(script);
	});
}

function withBuildVersion(url) {
	const versionedUrl = new URL(url, location.href);
	versionedUrl.searchParams.set("build", UNITY_BUILD_VERSION);
	return versionedUrl.href;
}

function setMissingBuildState() {
	progressFill.style.width = "0%";
	setStatus(`Build WebGL manquant. Fichier attendu: ${new URL("build/Build/Build.loader.js", location.href).href}. Dernier test: ${lastCheckedUnityLoaderUrl}`);
}

function setStatus(message) {
	statusText.textContent = message;
}

function delay(duration) {
	return new Promise((resolve) => window.setTimeout(resolve, duration));
}

function formatError(error) {
	if (!error) {
		return "";
	}

	if (typeof error === "string") {
		return error;
	}

	return error.message || error.toString();
}

function syncViewportSize() {
	document.documentElement.style.setProperty("--viewport-width", `${window.innerWidth}px`);
	document.documentElement.style.setProperty("--viewport-height", `${window.innerHeight}px`);
}
