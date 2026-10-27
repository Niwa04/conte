import type { FicheConte } from '../contes';

const D = 'assets/contes/la-reine-de-saba';

export const SABA: FicheConte = {
  slug: 'la-reine-de-saba',
  gabarit: 'la-reine-de-saba',
  titre: 'La Reine de Saba',
  accroche: 'Une reine qui compte les étoiles, cent chameaux, un roi sage et des énigmes pour apprendre à écouter.',
  mentionOrigine: 'D’après la tradition éthiopienne de Makeda, reine de Saba, et le Kebra Nagast (« La Gloire des rois », XIVe siècle)',
  drapeau: { src: 'assets/drapeaux/ethiopie.svg', alt: 'Drapeau de l’Éthiopie' },
  couverture: `${D}/couverture.webp`,
  couvertureAlt: 'Couverture du livre La Reine de Saba : Makeda sur la terrasse de son palais, sous un ciel d’étoiles',
  fond: `${D}/pages/p01.webp`,
  etiquettes: ['Conte éthiopien', 'Éthiopie', '6 - 10 ans', '10 min de lecture'],
  citation: 'Le ciel est toujours aussi grand, mais on y voit plus loin quand on partage ses questions.',
  resume: 'Makeda, reine de Saba, passe ses soirées à compter les étoiles et à se poser mille questions. Quand un marchand lui parle d’un roi très sage nommé Salomon, elle part avec une caravane de cent chameaux, à travers les montagnes et le désert. À Jérusalem, elle lui pose des énigmes et le regarde rendre la justice en écoutant chacun. Puis, le mal du pays la prend. Elle rentre chez elle, chargée de livres, de graines et d’une leçon sur l’écoute qu’elle voudra partager avec tout son peuple.',
  cartesDeco: [],
  imageHistoire: { src: `${D}/pages/p04.webp`, alt: 'Makeda et le roi Salomon, face à face sur les marches blanches du palais de Jérusalem', legende: 'La rencontre à Jérusalem' },
  illustrations: [
    { src: `${D}/pages/p03.webp`, alt: 'Une longue caravane de chameaux traverse les dunes dorées au coucher du soleil' },
    { src: `${D}/pages/p05.webp`, alt: 'Makeda, souriante, applaudit une réponse du roi Salomon, près d’un bassin de jardin' },
    { src: `${D}/pages/p11.webp`, alt: 'Makeda raconte son voyage à son petit garçon, sur la terrasse du palais, au crépuscule' }
  ],
  personnages: [
    { nom: 'Makeda', role: 'La reine de Saba', description: 'Curieuse et attentive, elle traverse le désert pour apprendre. À son retour, elle ouvre les assemblées à tous.', image: `${D}/personnages/makeda.webp`, alt: 'Makeda, couronne dorée, grand manteau rouge et robe turquoise', doubleur: null },
    { nom: 'Le roi Salomon', role: 'Le roi sage de Jérusalem', description: 'Calme et chaleureux, il écoute chacun jusqu’au bout avant de juger. Il aime les énigmes autant que la reine.', image: `${D}/personnages/salomon.webp`, alt: 'Le roi Salomon, manteau vert et orange brodé, barbe brune', doubleur: null },
    { nom: 'Le marchand', role: 'Celui qui apporte la nouvelle', description: 'Il arrive de loin avec ses épices et parle à Makeda d’un roi dont on vient écouter la sagesse.', image: `${D}/personnages/marchand.webp`, alt: 'Un marchand en turban blanc et manteau violet, un petit sac à la main', doubleur: null },
    { nom: 'Ménélik', role: 'Le fils de Makeda', description: 'Petit garçon aux grands yeux, il écoute chaque soir le récit du voyage de sa mère.', image: `${D}/personnages/menelik.webp`, alt: 'Ménélik enfant, tunique jaune brodée et ceinture orange', doubleur: null }
  ],
  origine: {
    titre: 'D’où vient ce conte ?',
    paragraphes: [
      'La reine de Saba apparaît d’abord dans la Bible, dans le Premier livre des Rois (chapitre 10) et dans le Deuxième livre des Chroniques (chapitre 9) : une reine vient éprouver la sagesse du roi Salomon par des questions, et lui apporte de l’or, des épices et des pierres précieuses. La Bible ne lui donne pas de nom.',
      'En Éthiopie, la tradition l’appelle Makeda. Elle est racontée dans le Kebra Nagast (« La Gloire des rois »), un livre éthiopien du XIVe siècle (à vérifier), qui fait de son fils Ménélik le premier roi d’une longue lignée. Cette histoire fait partie de l’identité de l’Éthiopie.',
      'Notre version garde le voyage, la rencontre et la naissance de Ménélik. Elle invente les énigmes et le dialogue sur l’écoute, pour parler aux enfants de curiosité et de partage.'
    ]
  },
  infos: [
    { libelle: 'Origine', valeur: 'Éthiopie (tradition de Makeda)', icone: 'origine', drapeau: 'assets/drapeaux/ethiopie.svg' },
    { libelle: 'Âge conseillé', valeur: '6 - 10 ans', icone: 'age' },
    { libelle: 'Durée', valeur: '10 minutes', icone: 'duree' },
    { libelle: 'Contenu', valeur: '12 pages illustrées', icone: 'pages' },
    { libelle: 'Langue', valeur: 'Français', icone: 'langue' },
    { libelle: 'Date de sortie', valeur: 'À annoncer', icone: 'date', ton: 'attente' }
  ]
};
