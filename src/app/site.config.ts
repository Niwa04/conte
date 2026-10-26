/**
 * Contenu éditable du site vitrine.
 * Les textes de la FAQ sont des propositions à relire.
 */

/**
 * Adresse du jeu (build WebGL) : c'est aussi la page d'ouverture de la PWA installée (voir manifest.webmanifest).
 * Le build est copié dans public/webgl-build par « npm run webgl:synchroniser ».
 */
export const APP_URL = '/webgl-build/game.html';

export interface Volet {
  icone: 'voix' | 'pages' | '3d';
  titre: string;
  texte: string;
}

/** La lecture interactive : les trois points forts de l'application. */
export const VOLETS: Volet[] = [
  {
    icone: 'voix',
    titre: 'Des contes doublés par de vrais comédiens',
    texte: 'Chaque histoire se lit, mais s’écoute aussi : des comédiens donnent leur voix aux contes.'
  },
  {
    icone: 'pages',
    titre: 'Des pages qui se tournent',
    texte: 'On tourne les pages du livre comme dans un vrai album illustré.'
  },
  {
    icone: '3d',
    titre: 'Des éléments 3D à découvrir',
    texte: 'Dans la maison, des éléments en 3D se découvrent et rendent la lecture plus immersive.'
  }
];

export interface Capture {
  src: string;
  alt: string;
}

export const CAPTURES_INTERACTIF: Capture[] = [
  { src: 'assets/captures/accueil-livre.webp', alt: 'Le livre La Maison des Contes posé dans la pièce 3D de l’application' },
  { src: 'assets/captures/fiche-conte.webp', alt: 'Fiche du conte Le Joueur de flûte de Hamelin avec les boutons Essayer et Lire le conte' }
];

export interface Collection {
  icone: 'cartes' | 'objets';
  titre: string;
  texte: string;
}

/** La collection : à compléter avec le détail réel (comment on obtient cartes et objets). */
export const COLLECTIONS: Collection[] = [
  { icone: 'cartes', titre: 'Les cartes', texte: 'Des cartes illustrées à collectionner, à retrouver dans l’application.' },
  { icone: 'objets', titre: 'Les objets', texte: 'Des objets à collectionner pour compléter sa propre collection.' }
];

export interface Formule {
  nom: string;
  prix: string;
  prixAnnuel?: string;
  points: string[];
  mise_en_avant: boolean;
}

/** Formules : modèle d'accès tiré du studio (gratuit, inclus dans l'abonnement). */
export const FORMULES: Formule[] = [
  {
    nom: 'Découverte',
    prix: 'Gratuit',
    points: ['Une sélection de contes gratuits en entier', 'Les 2 premières pages des autres contes', 'Toute la bibliothèque à parcourir'],
    mise_en_avant: false
  },
  {
    nom: 'Abonnement',
    prix: '5,99 € / mois',
    prixAnnuel: '59 € par an',
    points: ['Tous les contes inclus en lecture complète', 'Lecture audio', 'Nouveaux contes régulièrement'],
    mise_en_avant: true
  }
];

export interface Question {
  question: string;
  reponse: string;
}

/** À CONFIRMER : réponses rédigées d'après ce que je sais du projet. */
export const FAQ: Question[] = [
  {
    question: 'Comment installer l’application ?',
    reponse: 'L’application fonctionne dans le navigateur. Ouvrez-la depuis votre téléphone, votre tablette ou votre ordinateur, puis choisissez « Ajouter à l’écran d’accueil » pour l’avoir comme une application.'
  },
  {
    question: 'Pour quel âge sont les contes ?',
    reponse: 'Chaque conte indique sa tranche d’âge (par exemple 6 - 10 ans) et sa durée de lecture. Les filtres de la bibliothèque aident à choisir.'
  },
  {
    question: 'Puis-je essayer avant de m’abonner ?',
    reponse: 'Oui, chaque conte propose d’essayer ses deux premières pages avant de le lire en entier.'
  },
  {
    question: 'Les contes viennent d’où ?',
    reponse: 'Surtout des grands classiques racontés aux enfants (Blanche Neige, Cendrillon, Sindbad, Peter Pan…) et des histoires pour les tout-petits, avec en plus une sélection de contes du monde et des histoires originales de l’univers de Contésia.'
  },
  {
    question: 'Les enfants sont-ils protégés ?',
    reponse: 'Un espace parents permet de gérer les profils de lecture. Les contes sont relus avant publication.'
  }
];
