// Copie le lanceur WebGL (dossier « conte » : game.html, parent-auth.js, app.js…) et le dernier build Unity
// vers public/webgl-build, pour le tester depuis le site.
//
// Le lanceur est indispensable : c'est lui qui fournit `window.MaisonDesContesAuth` (connexion Supabase,
// catalogue). La page index.html générée par Unity seule ne le fournit pas, d'où le blocage « Récupération du catalogue ».
//
// Les fichiers .gz / .br du build sont décompressés, car le serveur de développement du site n'envoie pas
// l'en-tête « Content-Encoding ».
//
// Utilisation : npm run webgl:synchroniser [dossier-source]   (à relancer après chaque build Unity)
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { brotliDecompressSync, gunzipSync } from 'node:zlib';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const racine = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(process.argv[2] ?? join(racine, '..', '..', 'conte'));
const cible = join(racine, 'public', 'webgl-build');

if (!existsSync(join(source, 'game.html')) || !existsSync(join(source, 'build', 'index.html'))) {
  console.error(`Lanceur introuvable dans ${source} (game.html et build/index.html attendus).`);
  console.error('Construis d\'abord le jeu dans Unity : menu « Maison des contes > Construire le WebGL dans le site ».');
  process.exit(1);
}

// Garde-fou : un vieux build donne une vieille interface. On affiche sa date et on prévient s'il date de plus d'un jour.
const dossierSource = join(source, 'build', 'Build');
const fichiersBuild = readdirSync(dossierSource).filter((f) => /\.(data|wasm)(\.gz|\.br)?$/.test(f));
const dateBuild = new Date(Math.max(...fichiersBuild.map((f) => statSync(join(dossierSource, f)).mtimeMs)));
console.log(`Build source : ${dateBuild.toLocaleString('fr-FR')}`);
if (Date.now() - dateBuild.getTime() > 24 * 3600 * 1000) {
  console.warn("ATTENTION : ce build date de plus d'un jour. Reconstruis-le dans Unity (menu « Maison des contes > Construire le WebGL dans le site ») pour avoir la dernière interface.");
}

// Nettoyage : ancien format (build Unity déposé directement) et copie précédente.
for (const element of ['index.html', 'Build', 'TemplateData', 'build', 'assets', 'icons']) {
  rmSync(join(cible, element), { recursive: true, force: true });
}
mkdirSync(cible, { recursive: true });

const ignorer = (chemin) => chemin.endsWith('.meta') || /[\/]\.git([\/]|$)/.test(chemin);
for (const fichier of ['game.html', 'game.css', 'app.js', 'parent-auth.js']) {
  cpSync(join(source, fichier), join(cible, fichier));
}
for (const dossier of ['assets', 'icons', 'build']) {
  if (existsSync(join(source, dossier))) cpSync(join(source, dossier), join(cible, dossier), { recursive: true, filter: (c) => !ignorer(c) });
}

// Les fichiers .gz laissés à la racine de build/ par d'anciens builds ne sont pas utilisés : on les écarte.
for (const nom of readdirSync(join(cible, 'build'))) {
  if (/\.(gz|br)$/.test(nom)) rmSync(join(cible, 'build', nom));
}

// Le lanceur doit utiliser le manifeste du site (qui ouvre le jeu), pas un manifeste relatif absent d'ici.
const fichierJeu = join(cible, 'game.html');
writeFileSync(fichierJeu, readFileSync(fichierJeu, 'utf8').replace('href="manifest.webmanifest"', 'href="/manifest.webmanifest"'));

// Correctif sur la copie : app.js fabrique « Build//fichier.js » (double slash). Le serveur de conte l'accepte,
// celui du site non. La source dans conte/ n'est pas modifiée.
const fichierApp = join(cible, 'app.js');
let app = readFileSync(fichierApp, 'utf8');
const avant = app;
const sansSlash = (expression) => `\`\${buildUrl}/\${${expression}.replace(/^[/]+/, "")}\``;
app = app
  .replaceAll('`${buildUrl}/${relativeLoader[1]}`', () => sansSlash('relativeLoader[1]'))
  .replaceAll('`${buildUrl}/${relativeAsset[1]}`', () => sansSlash('relativeAsset[1]'));
if (app === avant) console.warn("Attention : le correctif du double slash n'a pas été appliqué (app.js a changé ?).");
writeFileSync(fichierApp, app);

// Décompression du build
const dossierBuild = join(cible, 'build', 'Build');
const pageBuild = join(cible, 'build', 'index.html');
let html = readFileSync(pageBuild, 'utf8');
let nombre = 0;
for (const nom of readdirSync(dossierBuild)) {
  const extension = nom.endsWith('.gz') ? 'gz' : nom.endsWith('.br') ? 'br' : null;
  if (!extension) continue;
  const sortie = nom.slice(0, -(extension.length + 1));
  const brut = readFileSync(join(dossierBuild, nom));
  writeFileSync(join(dossierBuild, sortie), extension === 'gz' ? gunzipSync(brut) : brotliDecompressSync(brut));
  rmSync(join(dossierBuild, nom));
  html = html.split(nom).join(sortie);
  nombre++;
}
writeFileSync(pageBuild, html);
console.log(`Lanceur et build copiés dans public/webgl-build (${nombre} fichier(s) décompressé(s)).`);
console.log('Relance « npm start » pour que le site voie les nouveaux fichiers.');
