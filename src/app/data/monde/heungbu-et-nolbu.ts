import type { FicheConte } from '../contes';

const D = 'assets/contes/heungbu-et-nolbu';

export const HEUNGBU: FicheConte = {
  slug: 'heungbu-et-nolbu',
  gabarit: 'heungbu-et-nolbu',
  titre: 'Heungbu et Nolbu',
  accroche: 'Deux frères, une hirondelle blessée et deux courges qui ne gardent pas les mêmes secrets.',
  mentionOrigine: 'Inspiré du conte populaire coréen, lié au pansori « Heungbuga » (XIXe siècle)',
  drapeau: { src: 'assets/drapeaux/coree.svg', alt: 'Drapeau de la Corée' },
  couverture: `${D}/couverture.webp`,
  couvertureAlt: 'Couverture du livre Heungbu et Nolbu : les deux frères et l’hirondelle devant une maison coréenne',
  fond: `${D}/pages/p01.webp`,
  etiquettes: ['Conte coréen', 'Corée', '6 - 10 ans', '10 min de lecture'],
  citation: 'Un geste de bonté tient parfois dans le creux d’une main, et revient au printemps suivant.',
  resume: 'À la mort de leurs parents, Nolbu garde toute la fortune et chasse son frère cadet Heungbu, qui s’en va avec sa femme et ses enfants. Pauvre mais généreux, Heungbu soigne une jeune hirondelle blessée tombée de son nid. Au printemps suivant, l’oiseau revient avec une graine, et ce qui pousse va tout changer. Ce conte coréen parle de bonté, d’avidité et de ce que l’on récolte en retour.',
  cartesDeco: [],
  imageHistoire: { src: `${D}/pages/p04.webp`, alt: 'Une hirondelle vole au-dessus d’une maison au toit de chaume, une famille lui fait signe', legende: 'Le retour de l’hirondelle' },
  illustrations: [
    { src: `${D}/pages/p02.webp`, alt: 'Heungbu, courbé dans la neige, frappe à la grande porte rouge de son frère' },
    { src: `${D}/pages/p03.webp`, alt: 'Heungbu et sa femme soignent une petite hirondelle posée au creux de leurs mains' },
    { src: `${D}/pages/p06.webp`, alt: 'Dans la cour, de grandes courges ouvertes débordent de riz, de pièces et de soieries colorées' }
  ],
  personnages: [
    { nom: 'Heungbu', role: 'Le frère cadet', description: 'Pauvre en richesses, riche en bonté. Il n’hésite pas à soigner un oiseau avec le peu qu’il a.', image: `${D}/personnages/heungbu.webp`, alt: 'Heungbu, veste turquoise, ceinture jaune et pantalon bleu foncé', doubleur: null },
    { nom: 'Nolbu', role: 'Le frère aîné', description: 'Il a tout reçu et veut toujours plus. Il ferme sa porte quand son frère a faim.', image: `${D}/personnages/nolbu.webp`, alt: 'Nolbu, long manteau prune brodé, les bras croisés', doubleur: null },
    { nom: 'L’hirondelle', role: 'La petite messagère', description: 'Tombée du nid, elle est soignée par la famille de Heungbu. Elle n’oubliera pas.', image: `${D}/personnages/hirondelle.webp`, alt: 'Une hirondelle au dos bleu nuit et à la gorge rouge, posée sur une branche', doubleur: null },
    { nom: 'La femme de Heungbu', role: 'Celle qui soigne', description: 'Calme et patiente, elle prête le fil et la brindille qui soutiennent la patte blessée.', image: `${D}/personnages/epouse.webp`, alt: 'La femme de Heungbu, haut blanc et jupe rouge, un linge à la main', doubleur: null },
    { nom: 'La fille', role: 'La grande sœur', description: 'Elle veille sur l’oisillon avec son petit frère et ne le quitte pas des yeux.', image: `${D}/personnages/fille.webp`, alt: 'La fille de Heungbu, tresse sur l’épaule, haut vert et jupe rose', doubleur: null },
    { nom: 'Le fils', role: 'Le petit curieux', description: 'Chaque matin, il demande si l’hirondelle pourra bientôt voler.', image: `${D}/personnages/fils.webp`, alt: 'Le fils de Heungbu, haut jaune et pantalon turquoise', doubleur: null }
  ],
  origine: {
    titre: 'D’où vient ce conte ?',
    paragraphes: [
      'Heungbu et Nolbu est un conte populaire de Corée, transmis de bouche à oreille. Il a aussi nourri le pansori « Heungbuga », un genre de chant narratif où un chanteur et un joueur de tambour racontent une histoire à voix haute.',
      'La version écrite remonte à la fin de la dynastie Joseon, au XIXe siècle, et son auteur n’est pas connu (à vérifier).',
      'Notre histoire garde le frère chassé, l’hirondelle soignée et les courges. Elle ajoute un retour de Nolbu et une réconciliation finale entre les deux frères.'
    ]
  },
  infos: [
    { libelle: 'Origine', valeur: 'Corée, tradition orale', icone: 'origine', drapeau: 'assets/drapeaux/coree.svg' },
    { libelle: 'Âge conseillé', valeur: '6 - 10 ans', icone: 'age' },
    { libelle: 'Durée', valeur: '10 minutes', icone: 'duree' },
    { libelle: 'Contenu', valeur: '11 pages illustrées', icone: 'pages' },
    { libelle: 'Langue', valeur: 'Français', icone: 'langue' },
    { libelle: 'Date de sortie', valeur: 'À annoncer', icone: 'date', ton: 'attente' }
  ]
};
