import type { FicheConte } from '../contes';

const D = 'assets/contes/le-roi-des-singes';

export const SINGES: FicheConte = {
  slug: 'le-roi-des-singes',
  gabarit: 'le-roi-des-singes',
  titre: 'Le Roi des Singes',
  accroche: 'Né d’un rocher, Sun Wukong saute plus vite que le vent. Mais peut-on s’échapper de la main du Bouddha ?',
  mentionOrigine: 'Inspiré du roman chinois « Voyage en Occident » (Xiyouji) de Wu Cheng’en, XVIe siècle',
  drapeau: { src: 'assets/drapeaux/chine.svg', alt: 'Drapeau de la Chine' },
  couverture: `${D}/couverture.webp`,
  couvertureAlt: 'Couverture du livre Le Roi des Singes : Sun Wukong, bâton doré sur l’épaule, sur un nuage devant des montagnes',
  fond: `${D}/pages/p01.webp`,
  etiquettes: ['Conte chinois', 'Chine', '6 - 10 ans', '12 min de lecture'],
  citation: 'On peut sauter jusqu’au bout du monde et se retrouver, malgré tout, dans la main d’un plus grand que soi.',
  resume: 'Sur la Montagne des Fleurs et des Fruits, un rocher s’ouvre et en sort un petit singe. Il devient roi de tous les singes, apprend les soixante-douze transformations et le saut du nuage, se fait un bâton doré et fait toutes les farces. Quand il bouscule le palais du Ciel, l’Empereur de Jade fait appel au Bouddha, qui lui lance un défi : sauter hors de sa main. Ce conte chinois très célèbre parle d’orgueil, d’humilité et d’une longue amitié sur la route.',
  cartesDeco: [],
  imageHistoire: { src: `${D}/pages/p01.webp`, alt: 'Un petit singe doré bondit hors d’un rocher brisé, au milieu des fleurs roses et des montagnes', legende: 'Un singe né d’un rocher' },
  illustrations: [
    { src: `${D}/pages/p02.webp`, alt: 'Le petit singe bondit vers la cascade qui cache une grotte' },
    { src: `${D}/pages/p06.webp`, alt: 'Sous la mer, Wukong saisit un pilier d’or dans le palais du Roi-Dragon' },
    { src: `${D}/pages/p10.webp`, alt: 'Sun Wukong, minuscule, se tient debout dans la main ouverte du Bouddha' }
  ],
  personnages: [
    { nom: 'Sun Wukong', role: 'Le Roi des Singes', description: 'Rapide, joueur et très fier. Son bâton doré rapetisse jusqu’à tenir dans son oreille.', image: `${D}/personnages/sun-wukong.webp`, alt: 'Sun Wukong, tunique rouge brodée d’or, bâton doré sur l’épaule', doubleur: null },
    { nom: 'Subhuti', role: 'Le maître sage', description: 'Il apprend à Wukong les transformations et le saut du nuage, en lui conseillant de rester humble.', image: `${D}/personnages/subhuti.webp`, alt: 'Subhuti, robe turquoise, longue barbe blanche et bâton', doubleur: null },
    { nom: 'Le Roi-Dragon', role: 'Le maître des mers', description: 'Il garde un pilier d’or dans son palais sous l’eau, qui deviendra le bâton du singe.', image: `${D}/personnages/roi-dragon.webp`, alt: 'Le Roi-Dragon, tête de dragon, robe bleue brodée de vagues', doubleur: null },
    { nom: 'L’Empereur de Jade', role: 'Le maître du Ciel', description: 'Il règne sur le palais céleste. Les farces de Wukong finissent par le fâcher.', image: `${D}/personnages/empereur-de-jade.webp`, alt: 'L’Empereur de Jade, robe verte brodée de dragons et coiffe à pendeloques', doubleur: null },
    { nom: 'Le Bouddha', role: 'Le sage au sourire calme', description: 'Il propose un défi à Wukong : sauter hors de sa main. Il ne se met jamais en colère.', image: `${D}/personnages/bouddha.webp`, alt: 'Le Bouddha, robe orange, halo doré derrière la tête', doubleur: null },
    { nom: 'Le moine', role: 'Le compagnon de route', description: 'Doux et patient, il délivre le Roi des Singes de sa montagne et voyage avec lui.', image: `${D}/personnages/moine.webp`, alt: 'Un moine au crâne rasé, robe orange et crème, bâton de pèlerin', doubleur: null }
  ],
  origine: {
    titre: 'D’où vient ce conte ?',
    paragraphes: [
      'Le Roi des Singes, Sun Wukong, est le héros d’un roman chinois, Le Voyage en Occident (Xiyouji), attribué à Wu Cheng’en et publié vers 1592, à la fin du XVIe siècle (à vérifier). C’est l’un des quatre grands romans classiques chinois.',
      'Le livre s’inspire du vrai pèlerinage du moine Xuanzang, qui a voyagé en Inde au VIIe siècle pour rapporter des textes bouddhiques, ainsi que de très anciennes histoires populaires. Certains pensent que Wukong doit aussi quelque chose à Hanuman, le singe du Ramayana indien (à vérifier).',
      'Notre version garde la naissance dans un rocher, la grotte derrière la cascade, le bâton doré, les pêches de longue vie, la main du Bouddha et les cinq piliers. Elle raconte tout cela sans combats violents.'
    ]
  },
  infos: [
    { libelle: 'Origine', valeur: 'Chine (roman du XVIe siècle)', icone: 'origine', drapeau: 'assets/drapeaux/chine.svg' },
    { libelle: 'Âge conseillé', valeur: '6 - 10 ans', icone: 'age' },
    { libelle: 'Durée', valeur: '12 minutes', icone: 'duree' },
    { libelle: 'Contenu', valeur: '13 pages illustrées', icone: 'pages' },
    { libelle: 'Langue', valeur: 'Français', icone: 'langue' },
    { libelle: 'Date de sortie', valeur: 'À annoncer', icone: 'date', ton: 'attente' }
  ]
};
