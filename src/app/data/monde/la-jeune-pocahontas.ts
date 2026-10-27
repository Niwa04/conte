import type { FicheConte } from '../contes';

const D = 'assets/contes/la-jeune-pocahontas';

export const POCAHONTAS: FicheConte = {
  slug: 'la-jeune-pocahontas',
  gabarit: 'la-jeune-pocahontas',
  titre: 'La jeune Pocahontas',
  accroche: 'Une fillette curieuse, des bateaux à voiles blanches et une rivière qui peut devenir un pont.',
  mentionOrigine: 'Inspiré de la vie de Matoaka, dite Pocahontas (Virginie, vers 1596 – 1617), et du récit de John Smith (1624)',
  drapeau: { src: 'assets/drapeaux/usa.svg', alt: 'Drapeau des États-Unis' },
  couverture: `${D}/couverture.webp`,
  couvertureAlt: 'Couverture du livre La jeune Pocahontas : la fillette au bord de la rivière, des voiliers au loin',
  fond: `${D}/pages/p01.webp`,
  etiquettes: ['Histoire américaine', 'États-Unis', '6 - 10 ans', '10 min de lecture'],
  citation: 'Entre deux rives, il suffit parfois d’une main tendue.',
  resume: 'Pocahontas vit avec son peuple, les Powhatan, au bord d’une grande rivière et ne se lasse jamais de poser des questions. Un jour de printemps, de grands bateaux arrivent avec des hommes venus d’un autre monde. Plutôt que de les fuir, elle va à leur rencontre, échange une plume contre une boussole et apprend leur langue. Quand l’hiver devient dur, elle remplit des paniers de maïs. Mais la méfiance grandit des deux côtés, et il faudra du courage pour garder la paix.',
  cartesDeco: [],
  imageHistoire: { src: `${D}/pages/p03.webp`, alt: 'Pocahontas, cachée derrière les branches, regarde des voiliers arriver sur la rivière', legende: 'Les voiles sur la rivière' },
  illustrations: [
    { src: `${D}/pages/p02.webp`, alt: 'Pocahontas se penche d’une branche pour attraper la main de son père, devant une maison longue' },
    { src: `${D}/pages/p05.webp`, alt: 'Pocahontas et John Smith plantent du maïs côte à côte dans un champ' },
    { src: `${D}/pages/p10.webp`, alt: 'Des enfants des deux peuples dansent en rond sur une colline au-dessus de la rivière' }
  ],
  personnages: [
    { nom: 'Pocahontas', role: 'La fillette curieuse', description: 'Vive, courageuse et pleine de questions, elle préfère comprendre les étrangers plutôt que les craindre.', image: `${D}/personnages/pocahontas.webp`, alt: 'Pocahontas, robe de peau beige à franges et écharpe rouge brodée', doubleur: null },
    { nom: 'Pocahontas devenue femme', role: 'La passeuse de paix', description: 'Elle grandit avec la même idée en tête : deux peuples différents peuvent s’apprendre beaucoup de choses.', image: `${D}/personnages/pocahontas-adulte.webp`, alt: 'Pocahontas adulte, robe de peau beige, collier et écharpe rouge', doubleur: null },
    { nom: 'John Smith', role: 'Le capitaine venu de la mer', description: 'Il arrive sur un grand bateau, une boussole à la main. Il apprend peu à peu à écouter.', image: `${D}/personnages/john-smith.webp`, alt: 'John Smith, gilet vert foncé, chemise blanche et grandes bottes', doubleur: null },
    { nom: 'Powhatan', role: 'Le grand chef', description: 'Père de Pocahontas, il dirige son peuple avec sagesse. Il aime les questions de sa fille.', image: `${D}/personnages/powhatan.webp`, alt: 'Le chef Powhatan, tunique verte et grand manteau rouge à franges', doubleur: null }
  ],
  origine: {
    titre: 'D’où vient ce conte ?',
    paragraphes: [
      'Pocahontas a vraiment existé. Elle s’appelait Matoaka, « Pocahontas » étant un surnom que l’on traduit souvent par « la joueuse ». Elle est née vers 1596 en Virginie, fille du chef Wahunsenacawh, que les Anglais appelaient Powhatan, et elle est morte en Angleterre en 1617 (à vérifier pour les dates exactes).',
      'La scène la plus célèbre, où elle protège John Smith, vient du livre que celui-ci a publié en 1624, The Generall Historie of Virginia. Beaucoup d’historiens doutent qu’elle se soit passée ainsi, et des descendants des Powhatan racontent une autre histoire. C’est pourquoi notre texte parle d’une légende.',
      'Notre version garde la curiosité de la fillette, la plume et la boussole, l’hiver de famine et la rencontre entre deux peuples. Elle laisse de côté la suite de la vie de Pocahontas pour se concentrer sur son enfance et l’idée du pont entre deux mondes.'
    ]
  },
  infos: [
    { libelle: 'Origine', valeur: 'Virginie, États-Unis (histoire et légende)', icone: 'origine', drapeau: 'assets/drapeaux/usa.svg' },
    { libelle: 'Âge conseillé', valeur: '6 - 10 ans', icone: 'age' },
    { libelle: 'Durée', valeur: '10 minutes', icone: 'duree' },
    { libelle: 'Contenu', valeur: '12 pages illustrées', icone: 'pages' },
    { libelle: 'Langue', valeur: 'Français', icone: 'langue' },
    { libelle: 'Date de sortie', valeur: 'À annoncer', icone: 'date', ton: 'attente' }
  ]
};
