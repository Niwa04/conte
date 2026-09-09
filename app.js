// Le build Unity est généré directement dans le dossier build de ce site.
const UNITY_BUILD_ROOTS = ["build", "Build"];
const GAME_REVEAL_DELAY_MS = 3000;
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

registerServiceWorker();
initUnity();
syncViewportSize();

window.addEventListener("resize", syncViewportSize);
window.addEventListener("orientationchange", syncViewportSize);

function registerServiceWorker() {
	if ("serviceWorker" in navigator) {
		window.addEventListener("load", () => {
			navigator.serviceWorker.register("service-worker.js").catch(() => {
				setStatus("Le mode hors ligne n'a pas pu etre active.");
			});
		});
	}
}

async function precacheGameForOffline(files) {
	if (!("serviceWorker" in navigator)) {
		return;
	}
	if (!Array.isArray(files) || files.length === 0) {
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

async function initUnity() {
	setStatus(LOADING_MESSAGE);

	const unityBuild = await findUnityBuild();
	if (!unityBuild) {
		setMissingBuildState();
		return;
	}

	const loaderUrl = unityBuild.loaderUrl;
	const buildVersion = unityBuild.version || buildVersionFromUrl(loaderUrl);

	try {
		await loadScript(withBuildVersion(loaderUrl, buildVersion));
	} catch (error) {
		console.error("Impossible de charger le loader Unity.", error);
		setStatus(`Loader Unity introuvable ou impossible à charger : ${loaderUrl}`);
		return;
	}

	if (typeof createUnityInstance !== "function") {
		setStatus("Le loader Unity est present, mais createUnityInstance est introuvable.");
		return;
	}

	const buildBasePath = loaderUrl.slice(0, loaderUrl.lastIndexOf("/"));
	const buildName = loaderUrl.split("/").pop().replace(".loader.js", "");
	const dataUrl = unityBuild.dataUrl || await findExistingUnityFile(buildBasePath, buildName, "data");
	const frameworkUrl = unityBuild.frameworkUrl || await findExistingUnityFile(buildBasePath, buildName, "framework.js");
	const codeUrl = unityBuild.codeUrl || await findExistingUnityFile(buildBasePath, buildName, "wasm");
	const missingFiles = [
		["data", dataUrl],
		["framework.js", frameworkUrl],
		["wasm", codeUrl]
	].filter(([, url]) => !url);

	if (missingFiles.length > 0) {
		const missingLabels = missingFiles.map(([label]) => label).join(", ");
		setStatus(`Fichier(s) du build Unity introuvable(s) : ${missingLabels}. Vérifie le dossier build/Build.`);
		return;
	}

	const buildFiles = [loaderUrl, dataUrl, frameworkUrl, codeUrl]
		.filter(Boolean)
		.map((url) => withBuildVersion(url, buildVersion));
	precacheGameForOffline(buildFiles);

	const config = {
		dataUrl: withBuildVersion(dataUrl, buildVersion),
		frameworkUrl: withBuildVersion(frameworkUrl, buildVersion),
		codeUrl: withBuildVersion(codeUrl, buildVersion),
		streamingAssetsUrl: "StreamingAssets",
		companyName: "StoryBook",
		productName: "StoryBook",
		productVersion: "1.0",
		autoSyncPersistentDataPath: true
	};

	setStatus(LOADING_MESSAGE);
	createUnityInstance(unityCanvas, config, (progress) => {
		progressFill.style.width = `${Math.round(progress * 100)}%`;
	}).then(async (unityInstance) => {
		window.unityInstance = unityInstance;
		window.dispatchEvent(new Event("MaisonDesContesUnityReady"));
		// Unity doit être prêt avant de restaurer le catalogue téléchargé.
		// Le bridge garde la demande en attente si son receiver n'est pas
		// encore enregistré au moment exact où le player devient disponible.
		if (window.MaisonDesContesAuth && typeof window.MaisonDesContesAuth.loadRuntimeCatalogCache === "function") {
			window.MaisonDesContesAuth.loadRuntimeCatalogCache();
		}
		progressFill.style.width = "100%";
		setStatus(LOADING_MESSAGE);
		await delay(GAME_REVEAL_DELAY_MS);
		loadingPanel.classList.add("is-hidden");
	}).catch((error) => {
		console.error(error);
		setStatus(`Le build Unity a ete trouve, mais le jeu n'a pas pu demarrer. ${formatError(error)}`);
	});
}

async function findExistingUnityFile(buildBasePath, buildName, extension) {
	const candidates = [
		`${buildBasePath}/${buildName}.${extension}`,
		`${buildBasePath}/${buildName}.${extension}.br`,
		`${buildBasePath}/${buildName}.${extension}.gz`
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

	return null;
}

async function findUnityBuild() {
	const candidates = buildUnityLoaderCandidates();

	for (const candidate of candidates) {
		try {
			const response = await fetch(candidate, { method: "HEAD", cache: "no-store" });
			if (response.ok) {
				return {
					loaderUrl: candidate,
					version: buildVersionFromUrl(candidate)
				};
			}
		} catch {
			if (await hasCachedResponse(candidate)) {
				return {
					loaderUrl: candidate,
					version: buildVersionFromUrl(candidate)
				};
			}
		}
	}

	const buildFromUnityIndex = await findBuildFromUnityIndex();
	if (buildFromUnityIndex) {
		return buildFromUnityIndex;
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

async function findBuildFromUnityIndex() {
	for (const root of UNITY_BUILD_ROOTS) {
		const indexUrl = new URL(`${root}/index.html`, location.href);
		indexUrl.searchParams.set("pwa", Date.now().toString());
		lastCheckedUnityLoaderUrl = indexUrl.href;

		try {
			const response = await fetch(indexUrl.href, { cache: "no-store" });
			if (!response.ok) {
				continue;
			}

			const html = await response.text();
			const buildUrl = readUnityTemplateVariable(html, "buildUrl") || "Build";
			const loaderPath = readUnityBuildPath(html, "loaderUrl", buildUrl);
			const dataPath = readUnityBuildPath(html, "dataUrl", buildUrl);
			const frameworkPath = readUnityBuildPath(html, "frameworkUrl", buildUrl);
			const codePath = readUnityBuildPath(html, "codeUrl", buildUrl);
			if (!loaderPath) {
				continue;
			}

			const rootUrl = new URL(`${root}/`, location.href);
			return {
				loaderUrl: new URL(loaderPath, rootUrl).href,
				dataUrl: dataPath ? new URL(dataPath, rootUrl).href : null,
				frameworkUrl: frameworkPath ? new URL(frameworkPath, rootUrl).href : null,
				codeUrl: codePath ? new URL(codePath, rootUrl).href : null,
				version: fingerprintText(html)
			};
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

function readUnityBuildPath(html, variableName, buildUrl) {
	const literalPath = readUnityTemplateVariable(html, variableName);
	if (literalPath) {
		return literalPath;
	}

	// Les templates Unity récents utilisent :
	// var loaderUrl = buildUrl + "/<hash>.loader.js";
	const expressionPattern = new RegExp(`(?:var\\s+${variableName}\\s*=|${variableName}\\s*:)\\s*buildUrl\\s*\\+\\s*["']([^"']+)["']`);
	const expressionMatch = html.match(expressionPattern);
	return expressionMatch ? `${buildUrl}${expressionMatch[1]}` : null;
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

function buildVersionFromUrl(url) {
	const pathname = new URL(url, location.href).pathname;
	const filename = pathname.slice(pathname.lastIndexOf("/") + 1);
	return filename.replace(/\.loader\.js$/i, "") || "unity";
}

function fingerprintText(value) {
	let hash = 2166136261;

	for (let index = 0; index < value.length; index++) {
		hash ^= value.charCodeAt(index);
		hash = Math.imul(hash, 16777619);
	}

	return `index-${(hash >>> 0).toString(16)}`;
}

function withBuildVersion(url, buildVersion = "unity") {
	const versionedUrl = new URL(url, location.href);
	versionedUrl.searchParams.set("build", buildVersion);
	return versionedUrl.href;
}

function setMissingBuildState() {
	progressFill.style.width = "0%";
	setStatus(`Build WebGL manquant. Fichier attendu dans build/Build. Dernier test : ${lastCheckedUnityLoaderUrl}`);
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
