# StoryBook PWA

Ce dossier contient la coquille PWA du jeu WebGL.

## Utilisation

1. Fais un build Unity WebGL.
2. Copie les fichiers generes dans `PWA/build`.
3. Lance le dossier via un serveur local ou un hebergement HTTPS.

Exemple local depuis ce dossier:

```powershell
node dev-server.js
```

Puis ouvre `http://localhost:8080`.

N'ouvre pas `index.html` directement en double-cliquant dessus. Les builds Unity WebGL compresses en `.br` ont besoin d'un serveur qui envoie `Content-Encoding: br`, sinon le navigateur ne peut pas charger le jeu.

## PWA

L'installation native depend du navigateur. Android Chrome supporte generalement le bouton d'installation. Sur iPhone/iPad, utilise le menu Partager de Safari puis `Ajouter a l'ecran d'accueil`.
