import type { FicheConte } from '../contes';

const D = 'assets/contes/la-reine-amina-de-zaria';

export const AMINA: FicheConte = {
  slug: 'la-reine-amina-de-zaria',
  gabarit: 'la-reine-amina-de-zaria',
  titre: 'La Reine Amina de Zaria',
  accroche: 'Une petite fille qui rêve de chevaux, une reine qui apprend à écouter et des murailles de terre qui portent son nom.',
  mentionOrigine: 'Inspiré de la tradition du royaume haoussa de Zazzau (Zaria, nord du Nigeria) ; dates incertaines, XVIe siècle selon la tradition',
  drapeau: { src: 'assets/drapeaux/nigeria.svg', alt: 'Drapeau du Nigeria' },
  couverture: `${D}/couverture.webp`,
  couvertureAlt: 'Couverture du livre La Reine Amina de Zaria : Amina à cheval devant les remparts de terre ocre',
  fond: `${D}/pages/p06.webp`,
  etiquettes: ['Histoire africaine', 'Nigeria', '6 - 10 ans', '10 min de lecture'],
  citation: 'Être forte, c’est aussi savoir s’arrêter pour écouter.',
  resume: 'Dans le royaume de Zazzau, la petite Amina regarde les cavaliers s’entraîner et rêve de protéger les siens. Elle apprend le cheval, l’arc et la patience, puis devient reine. Quand une ville de la frontière est menacée, elle prend la route avec ses cavaliers. Elle fait bâtir des murailles de terre autour des villes, mais comprend qu’il faut aussi écouter les habitants pour qu’ils vivent bien derrière ces murs. Des années plus tard, un grand-père raconte son histoire à sa petite-fille, près d’un feu.',
  cartesDeco: [],
  imageHistoire: { src: `${D}/pages/p04.webp`, alt: 'Amina, debout sur les marches de la cour, reçoit les insignes royaux devant la foule', legende: 'La reine de Zazzau' },
  illustrations: [
    { src: `${D}/pages/p03.webp`, alt: 'Amina au galop sur un cheval brun, l’arc tendu vers la cible' },
    { src: `${D}/pages/p06.webp`, alt: 'Une colonne de cavaliers quitte la capitale par une grande porte rouge, au lever du soleil' },
    { src: `${D}/pages/p09.webp`, alt: 'Des bâtisseurs élèvent un rempart de terre autour d’une ville, les paniers pleins d’argile' }
  ],
  personnages: [
    { nom: 'Amina', role: 'La reine de Zazzau', description: 'Courageuse et réfléchie, elle sait commander mais aussi écouter. Elle protège les villes et pense à ceux qui y vivent.', image: `${D}/personnages/amina.webp`, alt: 'Amina adulte, tunique turquoise, foulard bleu et arc', doubleur: null },
    { nom: 'Amina enfant', role: 'La petite cavalière', description: 'Elle grimpe sur un muret pour regarder les cavaliers et rêve déjà de protéger son royaume.', image: `${D}/personnages/amina-enfant.webp`, alt: 'Amina enfant, tunique turquoise et foulard bleu, la main au front', doubleur: null },
    { nom: 'Bakwa', role: 'La mère d’Amina', description: 'Reine avant elle, elle lui apprend à regarder où elle pose les pieds et à ménager ses forces.', image: `${D}/personnages/bakwa.webp`, alt: 'La reine Bakwa, grand voile rose et robe jaune brodée', doubleur: null },
    { nom: 'Le commandant', role: 'Le chef des cavaliers', description: 'Fidèle et attentif, il montre à Amina le repère dans le sable et la suit sur la route.', image: `${D}/personnages/commandant.webp`, alt: 'Le commandant, turban orangé, tunique bleue et ceinture rouge', doubleur: null },
    { nom: 'La vieille femme', role: 'Une habitante de la ville', description: 'Elle dit à Amina ce qui manque vraiment : à l’abri, il faut aussi pouvoir manger et travailler.', image: `${D}/personnages/vieille-femme.webp`, alt: 'Une vieille femme, robe verte, châle crème et foulard rouge', doubleur: null },
    { nom: 'Le grand-père', role: 'Le conteur', description: 'Près du feu, il montre les remparts à sa petite-fille et lui raconte la reine Amina.', image: `${D}/personnages/grand-pere.webp`, alt: 'Un grand-père assis, bonnet bleu, tunique blanche brodée et écharpe jaune', doubleur: null }
  ],
  origine: {
    titre: 'D’où vient ce conte ?',
    paragraphes: [
      'Amina est un personnage de l’histoire du royaume haoussa de Zazzau (aujourd’hui Zaria, dans le nord du Nigeria). On la présente comme une reine, une sarauniya, et comme une grande cavalière. Les dates de sa vie varient selon les auteurs : certains la placent entre 1533 et 1610, d’autres après 1576 (à vérifier).',
      'Les textes écrits qui la citent sont tardifs : Muhammad Bello, dans son Infaq al-Maisur (vers 1836), puis la Chronique de Kano, à la fin du XIXe siècle. Pour le reste, on dépend de la tradition orale, qui lui attribue les « murailles d’Amina » (ganuwar Amina) et le commerce du sel, des étoffes et des noix de kola.',
      'Notre version est une adaptation pour les enfants : l’enfance d’Amina, sa mère Bakwa (la tradition la cite, mais on la connaît mal) et la scène du grand-père sont imaginées. Elle garde ce que la tradition retient : une reine qui protège et qui bâtit.'
    ]
  },
  infos: [
    { libelle: 'Origine', valeur: 'Zazzau (Zaria), Nigeria', icone: 'origine', drapeau: 'assets/drapeaux/nigeria.svg' },
    { libelle: 'Âge conseillé', valeur: '6 - 10 ans', icone: 'age' },
    { libelle: 'Durée', valeur: '10 minutes', icone: 'duree' },
    { libelle: 'Contenu', valeur: '12 pages illustrées', icone: 'pages' },
    { libelle: 'Langue', valeur: 'Français', icone: 'langue' },
    { libelle: 'Date de sortie', valeur: 'À annoncer', icone: 'date', ton: 'attente' }
  ]
};
