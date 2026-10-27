import type { FicheConte } from '../contes';

const D = 'assets/contes/kintu-et-la-fille-du-ciel';

export const KINTU: FicheConte = {
  slug: 'kintu-et-la-fille-du-ciel',
  gabarit: 'kintu-et-la-fille-du-ciel',
  titre: 'Kintu et la fille du Ciel',
  accroche: 'Un homme, une vache, un escalier de nuages et trois épreuves pour rejoindre celle qui l’a choisi.',
  mentionOrigine: 'Inspiré du mythe de création des Baganda (Buganda, Ouganda), mis par écrit au début du XXe siècle',
  drapeau: { src: 'assets/drapeaux/ouganda.svg', alt: 'Drapeau de l’Ouganda' },
  couverture: `${D}/couverture.webp`,
  couvertureAlt: 'Couverture du livre Kintu et la fille du Ciel : Kintu, sa vache et Nambi devant l’escalier de nuages',
  fond: `${D}/pages/p01.webp`,
  etiquettes: ['Mythe ougandais', 'Ouganda', '6 - 10 ans', '10 min de lecture'],
  citation: 'Au début du monde, il n’y avait qu’un homme, une vache et un grand ciel qui regardait.',
  resume: 'Au tout début du monde, Kintu marche seul sur une terre verte, avec pour seule compagne sa vache. Nambi, la fille du roi du Ciel, le remarque et décide de l’épouser. Son père lui impose trois épreuves, qui paraissent impossibles : un festin géant, une jarre à remplir de rosée et une vache à reconnaître parmi des centaines. Ce mythe ougandais parle de patience, d’entraide et de la façon dont la vie, et la mort, sont arrivées parmi les humains.',
  cartesDeco: [],
  imageHistoire: { src: `${D}/pages/p04.webp`, alt: 'Kintu et Nambi montent un grand escalier de nuages vers les maisons du Ciel', legende: 'L’escalier de nuages' },
  illustrations: [
    { src: `${D}/pages/p05.webp`, alt: 'Kintu, assis au milieu de dizaines de plats en spirale, en cache une partie dans un trou du sol' },
    { src: `${D}/pages/p06.webp`, alt: 'Kintu recueille des gouttes de rosée sur une feuille et les verse dans une jarre, à l’aube' },
    { src: `${D}/pages/p07.webp`, alt: 'Kintu caresse sa vache parmi des centaines d’autres, une abeille posée sur sa corne' }
  ],
  personnages: [
    { nom: 'Kintu', role: 'Le premier homme', description: 'Patient et malin, il parle doucement à sa vache. Il accepte les épreuves pour la retrouver, et pour une rencontre inattendue.', image: `${D}/personnages/kintu.webp`, alt: 'Kintu, tunique orange et pagne vert', doubleur: null },
    { nom: 'Nambi', role: 'La fille du Ciel', description: 'Curieuse et courageuse, elle descend sur la terre et choisit Kintu. Elle l’aide en secret pendant les épreuves.', image: `${D}/personnages/nambi.webp`, alt: 'Nambi, robe turquoise aux motifs dorés et collier rouge', doubleur: null },
    { nom: 'Le roi Gulu', role: 'Le roi du Ciel', description: 'Il met Kintu à l’épreuve avant de donner sa bénédiction. Il prévient : ne revenez jamais en arrière.', image: `${D}/personnages/gulu.webp`, alt: 'Le roi Gulu, grand manteau pourpre et rouge, barbe blanche', doubleur: null },
    { nom: 'La vache', role: 'La compagne de Kintu', description: 'Sa seule richesse. Volée par les frères de Nambi, elle l’entraîne jusqu’au Ciel.', image: `${D}/personnages/vache.webp`, alt: 'Une vache brun roux aux grandes cornes blanches', doubleur: null },
    { nom: 'Walumbe', role: 'Le frère solitaire', description: 'Son nom veut dire « la Mort ». Il est toujours seul, car personne ne veut de lui.', image: `${D}/personnages/walumbe.webp`, alt: 'Walumbe, long manteau bleu indigo aux liserés roses', doubleur: null },
    { nom: 'Kayikuzi', role: 'Le frère le plus sage', description: 'Envoyé par son père, il tente de ramener Walumbe au Ciel, sans y parvenir.', image: `${D}/personnages/kayikuzi.webp`, alt: 'Kayikuzi, tunique verte brodée et écharpe crème', doubleur: null }
  ],
  origine: {
    titre: 'D’où vient ce conte ?',
    paragraphes: [
      'Kintu est le premier homme dans le mythe de création du Buganda, un royaume de l’actuel Ouganda. Les Baganda se racontent cette histoire depuis des générations : comment les hommes sont arrivés sur la terre, et pourquoi la mort les suit.',
      'Les premières versions écrites datent du début du XXe siècle : celle d’Apolo Kagwa, Premier ministre du royaume, et celle de l’Anglais John Roscoe dans son livre The Baganda (1911). Elles ne racontent pas tout à fait la même histoire (à vérifier).',
      'Notre version garde Kintu, Nambi, le roi Gulu, les trois épreuves et Walumbe. Elle ajoute l’abeille qui guide Kintu vers sa vache et une conclusion plus douce.'
    ]
  },
  infos: [
    { libelle: 'Origine', valeur: 'Buganda, Ouganda (mythe)', icone: 'origine', drapeau: 'assets/drapeaux/ouganda.svg' },
    { libelle: 'Âge conseillé', valeur: '6 - 10 ans', icone: 'age' },
    { libelle: 'Durée', valeur: '10 minutes', icone: 'duree' },
    { libelle: 'Contenu', valeur: '12 pages illustrées', icone: 'pages' },
    { libelle: 'Langue', valeur: 'Français', icone: 'langue' },
    { libelle: 'Date de sortie', valeur: 'À annoncer', icone: 'date', ton: 'attente' }
  ]
};
