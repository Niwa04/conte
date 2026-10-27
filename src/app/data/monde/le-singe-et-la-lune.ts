import type { FicheConte } from '../contes';

const D = 'assets/contes/le-singe-et-la-lune';

export const SINGE_LUNE: FicheConte = {
  slug: 'le-singe-et-la-lune',
  gabarit: 'le-singe-et-la-lune',
  titre: 'Le Singe et la Lune',
  accroche: 'La Lune est tombée dans le puits ! Une troupe de singes fait tout pour la sauver.',
  mentionOrigine: 'D’après un motif très ancien des contes de l’Inde : la lune qu’on croit tombée dans l’eau (Panchatantra ou Jataka, à vérifier)',
  drapeau: { src: 'assets/drapeaux/inde.svg', alt: 'Drapeau de l’Inde' },
  couverture: `${D}/couverture.webp`,
  couvertureAlt: 'Couverture du livre Le Singe et la Lune : des singes penchés au bord d’un puits où brille la Lune',
  fond: `${D}/pages/p01.webp`,
  etiquettes: ['Conte indien', 'Inde', '6 - 10 ans', '8 min de lecture'],
  citation: 'Avant de s’inquiéter, il faut d’abord lever la tête.',
  resume: 'Dans un immense banian, au bord d’un village de l’Inde, vit une troupe de singes, dont le petit Bholu, qui pose mille questions. Une nuit, il aperçoit la Lune au fond d’un puits et croit qu’elle est tombée. Toute la troupe se précipite pour la sauver, sous la direction de la grand-mère Dadi, qui propose de faire une chaîne avec les queues. Mais personne n’a pensé à regarder le ciel. Un conte plein de rires, sur la curiosité, les reflets et le bon sens.',
  cartesDeco: [],
  imageHistoire: { src: `${D}/pages/p02.webp`, alt: 'Bholu, assis sur une branche du banian, discute avec la vieille Dadi au coucher du soleil', legende: 'Bholu et ses mille questions' },
  illustrations: [
    { src: `${D}/pages/p03.webp`, alt: 'Bholu, penché au bord d’un puits de pierre, regarde la Lune qui brille dans l’eau' },
    { src: `${D}/pages/p06.webp`, alt: 'Une chaîne de singes suspendus par les queues descend d’une branche vers le puits' },
    { src: `${D}/pages/p08.webp`, alt: 'Les singes en tas lèvent la tête : la vraie Lune brille dans le ciel, entourée de nuages' }
  ],
  personnages: [
    { nom: 'Bholu', role: 'Le petit curieux', description: 'Un jeune singe roux qui veut tout comprendre : pourquoi la pluie tombe, où va le vent… et qui a vu la Lune dans le puits.', image: `${D}/personnages/bholu.webp`, alt: 'Bholu, singe roux, gilet turquoise et pagne orange', doubleur: null },
    { nom: 'Dadi', role: 'La grand-mère sage', description: 'Un vieux singe au poil gris et à l’écharpe jaune, qui garde son calme et propose la chaîne.', image: `${D}/personnages/dadi.webp`, alt: 'Dadi, vieux singe gris, gilet rouge et écharpe jaune', doubleur: null },
    { nom: 'Le petit singe', role: 'Un membre de la troupe', description: 'Il suit Bholu, accroche sa queue à celle du voisin et pose, lui aussi, la bonne question à la fin.', image: `${D}/personnages/petit-singe.webp`, alt: 'Un petit singe orange, gilet vert et pagne rouge', doubleur: null }
  ],
  origine: {
    titre: 'D’où vient ce conte ?',
    paragraphes: [
      'L’histoire des singes qui veulent sauver la Lune tombée dans un puits est un motif très ancien des récits de l’Inde. On le retrouve sous plusieurs formes dans les recueils de fables du sous-continent, comme le Panchatantra ou les Jataka, les récits des vies antérieures du Bouddha (à vérifier : cette parenté est reprise dans nos sources, mais je n’ai pas pu retrouver le texte exact).',
      'Le point commun de toutes les versions est le même : un reflet pris pour la réalité, des singes très zélés, et une branche qui finit par craquer. L’histoire fait rire, mais elle apprend aussi à regarder d’abord, à agir ensuite.',
      'Notre version garde le puits et la chaîne de singes qui casse la branche. Elle invente Bholu, la grand-mère Dadi et la morale « lever la tête ».'
    ]
  },
  infos: [
    { libelle: 'Origine', valeur: 'Inde (motif de fable ancien)', icone: 'origine', drapeau: 'assets/drapeaux/inde.svg' },
    { libelle: 'Âge conseillé', valeur: '6 - 10 ans', icone: 'age' },
    { libelle: 'Durée', valeur: '8 minutes', icone: 'duree' },
    { libelle: 'Contenu', valeur: '10 pages illustrées', icone: 'pages' },
    { libelle: 'Langue', valeur: 'Français', icone: 'langue' },
    { libelle: 'Date de sortie', valeur: 'À annoncer', icone: 'date', ton: 'attente' }
  ]
};
