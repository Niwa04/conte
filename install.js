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
		const registration = await navigator.serviceWorker.ready;
		const worker = registration.active || registration.waiting || registration.installing;
		if (worker) {
			worker.postMessage({ type: "CACHE_GAME" });
		}
	} catch {
		// The game can still run online if offline caching is unavailable.
	}
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
