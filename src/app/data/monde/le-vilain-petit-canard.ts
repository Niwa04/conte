import type { FicheConte } from '../contes';

const D = 'assets/contes/le-vilain-petit-canard';

export const CANARD: FicheConte = {
  slug: 'le-vilain-petit-canard',
  gabarit: 'le-vilain-petit-canard',
  titre: 'Le Vilain Petit Canard',
  accroche: 'Un caneton gris trop grand, un long hiver et un reflet qui change tout.',
  mentionOrigine: 'D’après le conte « Den grimme ælling » de Hans Christian Andersen (Danemark, 1843)',
  drapeau: { src: 'assets/drapeaux/danemark.svg', alt: 'Drapeau du Danemark' },
  couverture: `${D}/couverture.webp`,
  couvertureAlt: 'Couverture du livre Le Vilain Petit Canard : un caneton gris au bord d’un étang, des cygnes au loin',
  fond: `${D}/pages/p01.webp`,
  etiquettes: ['Conte danois', 'Danemark', '6 - 10 ans', '10 min de lecture'],
  citation: 'Il faut parfois un hiver entier pour découvrir qui l’on est.',
  resume: 'Au bord d’un étang du Danemark, un œuf éclot plus tard que les autres et en sort un grand caneton gris, maladroit. Dans la basse-cour, tout le monde se moque de lui. Il s’enfuit, traverse les marais, la maison de la vieille femme, un automne triste et un hiver glacial. Mais le printemps revient, et avec lui un grand jardin plein de fleurs où il se penche, un peu timide, sur l’eau d’un bassin. Un conte tendre sur la différence, le courage et le temps qui passe.',
  cartesDeco: [],
  imageHistoire: { src: `${D}/pages/p02.webp`, alt: 'Le grand caneton gris sort de sa coquille, sa maman cane et ses frères jaunes à côté de lui', legende: 'L’œuf le plus gros' },
  illustrations: [
    { src: `${D}/pages/p03.webp`, alt: 'Dans la basse-cour boueuse, le caneton gris est entouré d’oies, de canards et d’une poule' },
    { src: `${D}/pages/p06.webp`, alt: 'Au coucher du soleil, des cygnes blancs s’envolent au-dessus des roseaux d’automne' },
    { src: `${D}/pages/p10.webp`, alt: 'Le caneton se penche sur l’eau d’un bassin et y voit le reflet d’un cygne blanc' }
  ],
  personnages: [
    { nom: 'Le caneton gris', role: 'Le petit dernier', description: 'Plus grand, plus gris, plus timide que les autres. Il cherche seulement une place où on voudra de lui.', image: `${D}/personnages/petit-caneton-gris.webp`, alt: 'Un caneton gris au duvet ébouriffé, les pattes orange', doubleur: null },
    { nom: 'Maman cane', role: 'La mère qui couve', description: 'Elle a attendu longtemps, et elle défend son grand caneton gris, même quand les autres se moquent.', image: `${D}/personnages/maman-cane.webp`, alt: 'Maman cane, plumage brun moucheté et aile bleu-vert', doubleur: null },
    { nom: 'Les canetons', role: 'La fratrie jaune', description: 'Quatre petits canetons dorés, vifs et joueurs, qui trouvent leur grand frère un peu étrange.', image: `${D}/personnages/fratrie-canetons.webp`, alt: 'Quatre petits canetons jaunes, le bec orange', doubleur: null },
    { nom: 'Les cygnes', role: 'La famille retrouvée', description: 'De grands oiseaux blancs au long cou. Ils accueillent le nouveau venu sans rien lui demander.', image: `${D}/personnages/cygnes-adultes.webp`, alt: 'Trois grands cygnes blancs au cou élégant', doubleur: null }
  ],
  origine: {
    titre: 'D’où vient ce conte ?',
    paragraphes: [
      'Le Vilain Petit Canard est un conte de l’écrivain danois Hans Christian Andersen, publié en 1843 sous le titre « Den grimme ælling ». Andersen est né à Odense en 1805 et il a écrit plus de cent cinquante contes.',
      'Ce n’est pas un conte populaire recueilli à l’oral, mais une invention d’auteur. On y voit souvent un reflet de la vie d’Andersen, un garçon pauvre et un peu à part qui est devenu célèbre (à vérifier). Andersen aimait aussi découper des silhouettes dans du papier, ce qui a inspiré le style de cette page.',
      'Notre version garde les œufs et la cane, les moqueries de la basse-cour, la vieille femme, l’hiver gelé et le cygne qui se découvre dans l’eau. Elle suit les saisons de près, pour faire sentir le temps qui passe.'
    ]
  },
  infos: [
    { libelle: 'Origine', valeur: 'Danemark (Andersen, 1843)', icone: 'origine', drapeau: 'assets/drapeaux/danemark.svg' },
    { libelle: 'Âge conseillé', valeur: '6 - 10 ans', icone: 'age' },
    { libelle: 'Durée', valeur: '10 minutes', icone: 'duree' },
    { libelle: 'Contenu', valeur: '12 pages illustrées', icone: 'pages' },
    { libelle: 'Langue', valeur: 'Français', icone: 'langue' },
    { libelle: 'Date de sortie', valeur: 'À annoncer', icone: 'date', ton: 'attente' }
  ]
};
