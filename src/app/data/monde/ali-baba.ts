import type { FicheConte } from '../contes';

const D = 'assets/contes/ali-baba';

export const ALI_BABA: FicheConte = {
  slug: 'ali-baba',
  gabarit: 'ali-baba',
  titre: 'Ali Baba',
  accroche: 'Un rocher qui s’ouvre sur un mot, quarante jarres et une servante que personne ne surprend.',
  mentionOrigine: 'Inspiré du conte des Mille et Une Nuits « Ali Baba et les quarante voleurs », popularisé en français par Antoine Galland (1704-1717)',
  drapeau: { src: 'assets/drapeaux/iran.svg', alt: 'Drapeau de l’Iran' },
  couverture: `${D}/couverture.webp`,
  couvertureAlt: 'Couverture du livre Ali Baba : le bûcheron devant l’entrée dorée de la grotte aux trésors',
  fond: `${D}/pages/p01.webp`,
  etiquettes: ['Mille et Une Nuits', 'Perse', '6 - 10 ans', '12 min de lecture'],
  citation: 'Il suffit parfois d’un mot pour changer une vie, et d’un peu de courage pour la protéger.',
  resume: 'Ali Baba ramasse du bois avec ses trois ânes quand il découvre, par hasard, le secret de quarante voleurs : un rocher qui s’ouvre à la voix d’une formule magique. Il n’y prend que ce dont il a besoin, mais la curiosité de son frère Cassim va attirer le danger jusqu’à leur porte. Heureusement, la servante Morgiane réfléchit plus vite que tous les voleurs réunis. Ce conte parle de générosité, d’avidité et de courage.',
  cartesDeco: [],
  imageHistoire: { src: `${D}/pages/p03.webp`, alt: 'Ali Baba découvre une grotte remplie d’or, de bijoux et de tapis brodés', legende: 'La grotte aux mille lanternes' },
  illustrations: [
    { src: `${D}/pages/p02.webp`, alt: 'Les quarante cavaliers arrivent au galop devant un grand rocher, sous le regard d’Ali Baba caché dans un arbre' },
    { src: `${D}/pages/p10.webp`, alt: 'Des silhouettes se faufilent dans une ruelle éclairée aux lanternes, vue d’un toit' },
    { src: `${D}/pages/p12.webp`, alt: 'Morgiane, une lanterne à la main, se penche sur de grandes jarres dans la cour' }
  ],
  personnages: [
    { nom: 'Ali Baba', role: 'Le bûcheron au grand cœur', description: 'Pauvre mais généreux, il chante en ramassant du bois avec ses trois ânes. Un secret découvert par hasard va changer sa vie.', image: `${D}/personnages/ali-baba.webp`, alt: 'Ali Baba, tunique turquoise, gilet brun et hache à la main', doubleur: null },
    { nom: 'Morgiane', role: 'La servante rusée', description: 'Vive et courageuse, elle comprend avant tout le monde ce qui se prépare, et garde toujours son calme.', image: `${D}/personnages/morgiane.webp`, alt: 'Morgiane, tunique turquoise, écharpe rouge et large pantalon bleu', doubleur: null },
    { nom: 'Cassim', role: 'Le frère aîné', description: 'Riche commerçant, il en veut toujours plus. Sa curiosité l’entraîne jusqu’à la grotte.', image: `${D}/personnages/cassim.webp`, alt: 'Cassim, long manteau vert et bordeaux brodé d’or', doubleur: null },
    { nom: 'Le chef des voleurs', role: 'Le chef des quarante', description: 'Patient et rusé, il reviendra déguisé. Personne ne doit connaître sa formule.', image: `${D}/personnages/chef-des-voleurs.webp`, alt: 'Le chef des voleurs, grand manteau bleu brodé et turban, appuyé à une grande jarre', doubleur: null },
    { nom: 'La femme d’Ali Baba', role: 'Celle qui compte les pièces', description: 'Il y a tant d’or qu’elle doit emprunter une grande mesure à sa belle-sœur.', image: `${D}/personnages/epouse-ali-baba.webp`, alt: 'La femme d’Ali Baba, robe rose et voile bleu clair', doubleur: null },
    { nom: 'La femme de Cassim', role: 'La belle-sœur curieuse', description: 'Elle glisse un peu de cire au fond de la mesure pour savoir ce qu’on y a pesé.', image: `${D}/personnages/epouse-cassim.webp`, alt: 'La femme de Cassim, robe bordeaux et voile jaune', doubleur: null }
  ],
  origine: {
    titre: 'D’où vient ce conte ?',
    paragraphes: [
      'Ali Baba appartient aux Mille et Une Nuits, ce grand recueil de contes du monde arabe et persan. Pourtant, ce récit ne figure pas dans les plus anciens manuscrits arabes connus : il est entré dans le recueil par la porte de la France.',
      'L’orientaliste Antoine Galland le publie en français entre 1704 et 1717 dans sa traduction des Mille et Une Nuits. D’après la tradition, il l’aurait entendu raconter par un conteur syrien, Hanna Diyab (à vérifier).',
      'Notre histoire garde le rocher qui s’ouvre, la croix à la craie, les jarres et Morgiane. Elle ajoute une fin plus douce : Cassim est pardonné, et Morgiane épouse le fils d’Ali Baba.'
    ]
  },
  infos: [
    { libelle: 'Origine', valeur: 'Perse, Mille et Une Nuits', icone: 'origine', drapeau: 'assets/drapeaux/iran.svg' },
    { libelle: 'Âge conseillé', valeur: '6 - 10 ans', icone: 'age' },
    { libelle: 'Durée', valeur: '12 minutes', icone: 'duree' },
    { libelle: 'Contenu', valeur: '15 pages illustrées', icone: 'pages' },
    { libelle: 'Langue', valeur: 'Français', icone: 'langue' },
    { libelle: 'Date de sortie', valeur: 'À annoncer', icone: 'date', ton: 'attente' }
  ]
};
