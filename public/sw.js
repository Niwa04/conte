// Service worker minimal : il rend le site installable comme application (PWA).
// Il ne met rien en cache : le jeu et le site sont toujours servis à jour.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (evenement) => evenement.waitUntil(self.clients.claim()));
self.addEventListener('fetch', () => {});
