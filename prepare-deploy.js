const fs = require('fs');
const path = require('path');

const pwaRoot = __dirname;
const siteRoot = path.resolve(pwaRoot, '..', 'Site');

for (const file of ['index.html', 'styles.css', 'script.js']) {
  fs.copyFileSync(path.join(siteRoot, file), path.join(pwaRoot, file));
}

const sourceImages = path.join(siteRoot, 'assets', 'images');
const targetImages = path.join(pwaRoot, 'assets', 'images');
fs.rmSync(targetImages, { recursive: true, force: true });
fs.mkdirSync(path.dirname(targetImages), { recursive: true });
fs.cpSync(sourceImages, targetImages, { recursive: true });

console.log('Site vitrine et ressources copiés dans le paquet PWA.');
