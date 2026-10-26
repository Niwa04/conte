const installButton = document.getElementById("installButton");
const installStatus = document.getElementById("installStatus");
let deferredInstallPrompt = null;

registerServiceWorker();
precacheGameForOffline();

window.addEventListener("beforeinstallprompt", (event) => {
	event.preventDefault();
	deferredInstallPrompt = event;
	setInstallStatus("");
});

installButton.addEventListener("click", async () => {
	if (deferredInstallPrompt) {
		installButton.disabled = true;
		setInstallStatus("Ouverture de l'installation Chrome...");
		deferredInstallPrompt.prompt();
		const result = await deferredInstallPrompt.userChoice;
		deferredInstallPrompt = null;
		installButton.disabled = false;

		if (result.outcome === "accepted") {
			openGame();
		} else {
			setInstallStatus("");
		}
		return;
	}

	showInstallUnavailableMessage();
});

window.addEventListener("appinstalled", () => {
	deferredInstallPrompt = null;
	installButton.disabled = true;
	openGame();
});

function showInstallUnavailableMessage() {
	const isAppleDevice = /iphone|ipad|ipod/i.test(navigator.userAgent);
	const isLocalFile = location.protocol === "file:";

	if (isLocalFile) {
		setInstallStatus("Ouvre cette page avec le serveur local http://localhost:8080. Chrome ne peut pas installer une PWA depuis un fichier ouvert directement.");
		return;
	}

	if (isAppleDevice) {
		setInstallStatus("Sur iPhone ou iPad, Safari ne permet pas le bouton d'installation direct. Utilise Partager puis Ajouter a l'ecran d'accueil.");
		return;
	}

	setInstallStatus("Chrome ne propose pas encore l'installation. Attends quelques secondes, recharge la page, puis reclique sur Telecharger.");
}

function setInstallStatus(message) {
	installStatus.textContent = message;
}

function openGame() {
	setInstallStatus("Lancement du jeu...");
	location.replace("game.html?launch=installed");
}

function registerServiceWorker() {
	if ("serviceWorker" in navigator) {
		window.addEventListener("load", () => {
			navigator.serviceWorker.register("service-worker.js").catch(() => {});
		});
	}
}

async function precacheGameForOffline() {
	if (!("serviceWorker" in navigator)) {
		return;
	}

	try {
		const files = await findUnityBuildFiles();
		if (files.length === 0) {
			return;
		}

		const registration = await navigator.serviceWorker.ready;
		const worker = registration.active || registration.waiting || registration.installing;
		if (worker) {
			worker.postMessage({ type: "CACHE_GAME", files });
		}
	} catch {
		// The game can still run online if offline caching is unavailable.
	}
}

async function findUnityBuildFiles() {
	const indexUrl = new URL("build/index.html", location.href);
	indexUrl.searchParams.set("pwa", Date.now().toString());

	const response = await fetch(indexUrl.href, { cache: "no-store" });
	if (!response.ok) {
		return [];
	}

	const html = await response.text();
	const buildUrl = readUnityTemplateVariable(html, "buildUrl") || "Build";
	const paths = [
		readUnityBuildPath(html, "loaderUrl", buildUrl),
		readUnityBuildPath(html, "dataUrl", buildUrl),
		readUnityBuildPath(html, "frameworkUrl", buildUrl),
		readUnityBuildPath(html, "codeUrl", buildUrl)
	].filter(Boolean);

	const version = fingerprintText(html);
	return paths.map((path) => {
		const fileUrl = new URL(`build/${path}`, location.href);
		fileUrl.searchParams.set("build", version);
		return fileUrl.href;
	});
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

	const expressionPattern = new RegExp(`(?:var\\s+${variableName}\\s*=|${variableName}\\s*:)\\s*buildUrl\\s*\\+\\s*["']([^"']+)["']`);
	const expressionMatch = html.match(expressionPattern);
	return expressionMatch ? `${buildUrl}${expressionMatch[1]}` : null;
}

function fingerprintText(value) {
	let hash = 2166136261;

	for (let index = 0; index < value.length; index++) {
		hash ^= value.charCodeAt(index);
		hash = Math.imul(hash, 16777619);
	}

	return `index-${(hash >>> 0).toString(16)}`;
}

navigator.serviceWorker?.addEventListener("message", (event) => {
	if (!event.data || event.data.type !== "CACHE_GAME_PROGRESS") {
		return;
	}

	if (event.data.complete) {
		setInstallStatus("Jeu pret hors ligne.");
		return;
	}

	if (event.data.failed) {
		setInstallStatus("Le cache hors ligne n'a pas pu etre termine. Relance avec internet.");
		return;
	}

	if (event.data.cachedCount > 0) {
		setInstallStatus(`Preparation hors ligne... ${event.data.cachedCount}/${event.data.totalCount}`);
	}
});
