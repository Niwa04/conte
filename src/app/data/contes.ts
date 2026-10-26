/**
 * Fiches de présentation des contes (pages publiques /contes/:slug).
 * Les informations viennent de la base La Maison des contes et des dossiers du studio.
 */

export interface IllustrationConte {
  src: string;
  alt: string;
}

export interface InfoConte {
  libelle: string;
  valeur: string;
  icone: 'auteur' | 'origine' | 'age' | 'duree' | 'pages' | 'langue' | 'prix' | 'date';
  /** Petit drapeau affiché devant la valeur. */
  drapeau?: string;
  /** Mise en valeur : « ok » pastille verte, « attente » pastille en pointillés. */
  ton?: 'ok' | 'attente';
}

export interface PersonnageConte {
  nom: string;
  role: string;
  description: string;
  image: string;
  alt: string;
  /** Comédien ou comédienne qui prête sa voix ; null tant qu'aucune voix n'est attribuée (affiché « anonyme »). */
  doubleur: string | null;
}

export interface FicheConte {
  slug: string;
  /** Mise en page propre au conte ; absent = gabarit classique (Aïcha). */
  gabarit?: 'momotaro' | 'hamelin';
  titre: string;
  accroche: string;
  mentionOrigine: string;
  drapeau: { src: string; alt: string };
  couverture: string;
  couvertureAlt: string;
  /** Illustration plein cadre derrière l'en-tête. */
  fond: string;
  etiquettes: string[];
  citation: string;
  /** Résumé du conte en quelques phrases, sans liste et sans dévoiler la fin. */
  resume: string;
  /** Cartes de collection du conte, utilisées comme décoration. */
  cartesDeco: string[];
  imageHistoire: { src: string; alt: string; legende: string };
  illustrations: IllustrationConte[];
  personnages: PersonnageConte[];
  origine: { titre: string; paragraphes: string[] };
  infos: InfoConte[];
}

const DOSSIER = 'assets/contes/aicha-et-la-gazelle-enchantee';
const MOMO = 'assets/contes/momotaro';
const HAMELIN = 'assets/contes/le-joueur-de-flute-de-hamelin';

export const CONTES: FicheConte[] = [
  {
    slug: 'aicha-et-la-gazelle-enchantee',
    titre: 'Aïcha et la Gazelle enchantée',
    accroche: 'Un frère changé en gazelle, une source enchantée et une sœur prête à tout pour lui.',
    mentionOrigine: 'Inspiré du conte traditionnel kabyle « La Vache des orphelins » (بقرة اليتامى)',
    drapeau: { src: 'assets/drapeaux/algerie.svg', alt: 'Drapeau de l’Algérie' },
    couverture: `${DOSSIER}/couverture.webp`,
    couvertureAlt: 'Couverture du livre Aïcha et la Gazelle : une jeune fille serre contre elle une gazelle, au coucher du soleil sur la Kabylie',
    fond: `${DOSSIER}/source.webp`,
    etiquettes: ['Conte kabyle', 'Algérie', '6 - 10 ans', '10 min de lecture', 'Gratuit'],
    citation: 'Il était une fois, dans un petit village de Kabylie, une jeune fille nommée Aïcha et son petit frère Ali.',
    resume: 'Aïcha et son petit frère Ali vivent dans un village de Kabylie. Quand leur mère disparaît, leur belle-mère ne leur laisse que des miettes, et les deux enfants prennent la fuite. Au pied d’un rocher, Ali boit à une source enchantée et devient gazelle : Aïcha n’a plus qu’une idée, lui rendre sa forme humaine. Entre oliviers, jardins de palais et rencontre avec un jeune sultan, ce conte parle de fidélité, de courage et de l’amour d’une sœur pour son frère.',
    cartesDeco: [`${DOSSIER}/carte-aicha.webp`, `${DOSSIER}/carte-sultan.webp`],
    imageHistoire: {
      src: `${DOSSIER}/voyage.webp`,
      alt: 'Aïcha, de dos, tend la main à sa gazelle devant les remparts éclairés d’une ville, au crépuscule',
      legende: 'Aïcha et sa gazelle aux portes de la ville'
    },
    illustrations: [
      {
        src: `${DOSSIER}/roseaux.webp`,
        alt: 'Aïcha et Ali devant deux roseaux : l’un laisse couler du miel doré, l’autre du beurre frais'
      },
      {
        src: `${DOSSIER}/source.webp`,
        alt: 'Aïcha caresse une gazelle au bord d’une source enchantée, entourée de lumière'
      },
      {
        src: `${DOSSIER}/palais.webp`,
        alt: 'Aïcha, souriante, tient la main du sultan dans la cour d’un palais, la gazelle à ses côtés'
      }
    ],
    personnages: [
      {
        nom: 'Aïcha',
        role: 'L’héroïne',
        description: 'La grande sœur d’Ali. Douce et courageuse, elle ne lâche jamais la main de son petit frère.',
        image: `${DOSSIER}/personnages/aicha.webp`,
        alt: 'Aïcha, jeune fille kabyle aux longs cheveux bruns, en robe ocre et fouta rayée rouge',
        doubleur: null
      },
      {
        nom: 'Ali',
        role: 'Le petit frère',
        description: 'Un petit garçon qui suit sa sœur partout, jusqu’au jour où il boit à une source.',
        image: `${DOSSIER}/personnages/ali.webp`,
        alt: 'Ali, petit garçon aux cheveux courts, en tunique bleue rapiécée',
        doubleur: null
      },
      {
        nom: 'La gazelle',
        role: 'Ali, après la source',
        description: 'Une petite gazelle au regard expressif, qui ne quitte plus Aïcha.',
        image: `${DOSSIER}/personnages/gazelle.webp`,
        alt: 'Une jeune gazelle aux grandes oreilles et au regard doux',
        doubleur: null
      },
      {
        nom: 'Le jeune sultan',
        role: 'Le souverain de la ville',
        description: 'Intrigué par cette gazelle qui ne quitte jamais la jeune fille, il prend le temps de l’écouter.',
        image: `${DOSSIER}/personnages/sultan.webp`,
        alt: 'Le jeune sultan, en robe bleue brodée et grand châle blanc, la main tendue',
        doubleur: null
      },
      {
        nom: 'La belle-mère',
        role: 'La nouvelle épouse du père',
        description: 'Aimable au début, elle réserve bientôt les meilleurs repas à sa propre fille.',
        image: `${DOSSIER}/personnages/belle-mere.webp`,
        alt: 'La belle-mère, en robe rouge brodée, la main sur la hanche',
        doubleur: null
      },
      {
        nom: 'Djohra',
        role: 'La fille de la belle-mère',
        description: 'Elle vit sous le même toit qu’Aïcha et Ali, et profite des meilleurs repas.',
        image: `${DOSSIER}/personnages/djohra.webp`,
        alt: 'Djohra, jeune fille à la tresse, en robe verte brodée, l’air renfrogné',
        doubleur: null
      }
    ],
    origine: {
      titre: 'D’où vient ce conte ?',
      paragraphes: [
        'Aïcha et la Gazelle enchantée vient de Kabylie, une région montagneuse du nord de l’Algérie. Ces histoires se racontaient à voix haute, de génération en génération, et celle-ci s’inspire du conte « La Vache des orphelins ».',
        'On y retrouve des motifs que l’on rencontre dans de nombreux contes du monde, comme dans Cendrillon : des enfants maltraités par une belle-mère, de petits miracles du quotidien, et un courage qui finit par être récompensé.'
      ]
    },
    infos: [
      { libelle: 'Adapté par', valeur: 'Oukkal Mohamed Amin', icone: 'auteur' },
      { libelle: 'Origine', valeur: 'Kabylie, Algérie (tradition orale)', icone: 'origine', drapeau: 'assets/drapeaux/algerie.svg' },
      { libelle: 'Âge conseillé', valeur: '6 - 10 ans', icone: 'age' },
      { libelle: 'Durée', valeur: '10 minutes', icone: 'duree' },
      { libelle: 'Contenu', valeur: '15 pages illustrées', icone: 'pages' },
      { libelle: 'Langue', valeur: 'Français', icone: 'langue' },
      { libelle: 'Prix', valeur: 'Gratuit', icone: 'prix', ton: 'ok' },
      { libelle: 'Date de sortie', valeur: 'À annoncer', icone: 'date', ton: 'attente' }
    ]
  },
  {
    slug: 'momotaro',
    gabarit: 'momotaro',
    titre: 'Momotarō',
    accroche: 'Une place vide à table, une pêche sur la rivière et trois compagnons qui partagent leur dernière boulette.',
    mentionOrigine: 'Inspiré du conte populaire japonais, notamment de la version d’Iwaya Sazanami (1894)',
    drapeau: { src: 'assets/drapeaux/japon.svg', alt: 'Drapeau du Japon' },
    couverture: `${MOMO}/livre-3d.webp`,
    couvertureAlt: 'Le livre Momotarō : le garçon né d’une pêche, son chien, son singe et son faisan sous les cerisiers en fleurs',
    fond: `${MOMO}/pages/p07.webp`,
    etiquettes: ['Conte japonais', 'Japon', '6 - 10 ans', '10 min de lecture'],
    citation: 'Dans un village au pied des montagnes, une pêche géante descend la rivière, et avec elle, un enfant tant attendu.',
    resume: 'Un vieux couple vit au pied des montagnes japonaises, avec deux bols sur sa table et une place vide. Un jour, une pêche géante descend la rivière et change leur vie. Quand des Oni volent la récolte d’un village, Momotarō part sur leur île avec des boulettes de millet : chaque boulette partagée lui donne un compagnon, un chien, un singe et un faisan. Ce conte parle de partage, de courage et de ce que l’on rend à ceux à qui on l’a pris.',
    cartesDeco: [],
    imageHistoire: { src: `${MOMO}/pages/p07.webp`, alt: 'Momotarō partage une boulette de millet avec le singe, le chien et le faisan', legende: 'Une boulette de millet, quatre amis' },
    illustrations: [
      { src: `${MOMO}/pages/p02.webp`, alt: 'La vieille femme repêche une énorme pêche dans la rivière aux pétales de cerisier' },
      { src: `${MOMO}/pages/p06.webp`, alt: 'Momotarō offre une boulette à un chien roux dans la forêt' },
      { src: `${MOMO}/pages/p09.webp`, alt: 'Les compagnons passent le portail de la forteresse des Oni' }
    ],
    personnages: [
      { nom: 'Momotarō', role: 'Le garçon né d’une pêche', description: 'Grand et généreux, il sait qu’il ne peut pas aider tout le monde. Mais il peut arrêter les voleurs, et il part le faire.', image: `${MOMO}/personnages/momotaro.webp`, alt: 'Momotarō, kimono cobalt à vagues dorées et haori corail', doubleur: null },
      { nom: 'Le chien', role: 'Le premier compagnon', description: 'Un chien roux et crème à la queue bouclée. Il propose un marché : partager le repas, c’est partager le danger.', image: `${MOMO}/personnages/chien.webp`, alt: 'Un chien roux et crème à la queue bouclée', doubleur: null },
      { nom: 'Le singe', role: 'Le grimpeur', description: 'Un macaque doré au visage rose, curieux et gourmand. Aucun mur ne lui résiste.', image: `${MOMO}/personnages/singe.webp`, alt: 'Un macaque doré au visage rose', doubleur: null },
      { nom: 'Le faisan', role: 'L’éclaireur', description: 'Vert et cobalt, les joues rouges, il voit loin. Il passe au-dessus des murs pour savoir ce qui se cache derrière.', image: `${MOMO}/personnages/faisan.webp`, alt: 'Un faisan vert et cobalt aux joues rouges', doubleur: null },
      { nom: 'La mère', role: 'Celle qui attendait', description: 'Elle a tant attendu un enfant. Elle sait rire et pleurer en même temps.', image: `${MOMO}/personnages/mere.webp`, alt: 'La mère de Momotarō, kimono prune et tablier turquoise', doubleur: null },
      { nom: 'Le père', role: 'Celui qui plante les haricots', description: 'Un vieil homme doux qui rêve de transmettre son travail à quelqu’un. Il confie à son fils une épée dans son fourreau.', image: `${MOMO}/personnages/pere.webp`, alt: 'Le père de Momotarō, veste mousse et pantalon indigo', doubleur: null },
      { nom: 'Le roi des Oni', role: 'Le chef des voleurs', description: 'Un géant à la longue crinière, la massue sur l’épaule. Il règne sur une forteresse noire pleine de butin.', image: `${MOMO}/personnages/roi-oni.webp`, alt: 'Le roi des Oni, la crinière longue et un collier de grosses perles', doubleur: null }
    ],
    origine: {
      titre: 'D’où vient ce conte ?',
      paragraphes: [
        'Momotarō, « le garçon né d’une pêche », est un conte populaire japonais. Il se racontait à voix haute bien avant d’être écrit, et la tradition le rattache à la région d’Okayama. On le trouvait aussi dans de petits livres illustrés de l’époque d’Edo.',
        'La version qui l’a fait connaître aux enfants est celle d’Iwaya Sazanami (1870-1933), écrivain japonais et pionnier de la littérature pour la jeunesse. Il publie son Momotarō en 1894, à l’époque Meiji, dans sa série de contes du Japon.',
        'Notre histoire s’en inspire librement : on y retrouve la pêche, les Oni, le chien, le singe et le faisan, mais le texte est une adaptation de La Maison des Contes.'
      ]
    },
    infos: [
      { libelle: 'Origine', valeur: 'Japon, tradition orale', icone: 'origine', drapeau: 'assets/drapeaux/japon.svg' },
      { libelle: 'Âge conseillé', valeur: '6 - 10 ans', icone: 'age' },
      { libelle: 'Durée', valeur: '10 minutes', icone: 'duree' },
      { libelle: 'Contenu', valeur: '12 pages illustrées', icone: 'pages' },
      { libelle: 'Langue', valeur: 'Français', icone: 'langue' },
      { libelle: 'Date de sortie', valeur: 'À annoncer', icone: 'date', ton: 'attente' }
    ]
  },
  {
    slug: 'le-joueur-de-flute-de-hamelin',
    gabarit: 'hamelin',
    titre: 'Le Joueur de flûte de Hamelin',
    accroche: 'Une ville infestée de rats, un musicien sans nom et une promesse que personne n’aurait dû oublier.',
    mentionOrigine: 'Inspiré de la légende de Hamelin, en Allemagne, fixée notamment par les frères Grimm (1816) et Robert Browning (1842)',
    drapeau: { src: 'assets/drapeaux/allemagne.svg', alt: 'Drapeau de l’Allemagne' },
    couverture: `${HAMELIN}/couverture.webp`,
    couvertureAlt: 'Couverture du Joueur de flûte de Hamelin : le musicien à la flûte argentée devant la ville de Hamelin au coucher du soleil',
    fond: `${HAMELIN}/pages/p10.webp`,
    etiquettes: ['Légende allemande', 'Allemagne', '6 - 10 ans', '10 min de lecture'],
    citation: 'Dans la vallée de la Weser, une ville a oublié qu’une parole donnée est une dette.',
    resume: 'À Hamelin, les rats sont partout et le maire promet une bourse d’or à celui qui sauvera la ville. Un étranger à la flûte argentée y parvient, mais personne ne tient parole. Un dimanche, quand les adultes sont à l’église, une autre mélodie s’élève sur la place. Ce conte parle de la valeur d’une promesse, et de ce qu’il en coûte de l’oublier.',
    cartesDeco: [],
    imageHistoire: { src: `${HAMELIN}/pages/p10.webp`, alt: 'Les enfants suivent le joueur de flûte sur un sentier fleuri vers la montagne', legende: 'Le sentier vers la montagne' },
    illustrations: [
      { src: `${HAMELIN}/pages/p01.webp`, alt: 'Les habitants de Hamelin chassent les rats qui envahissent la ville' },
      { src: `${HAMELIN}/pages/p03.webp`, alt: 'Le joueur de flûte arrive dans la salle de l’hôtel de ville' },
      { src: `${HAMELIN}/pages/p05.webp`, alt: 'Le joueur de flûte joue sur la grande place et les rats l’entourent' }
    ],
    personnages: [
      { nom: 'Le joueur de flûte', role: 'Le musicien venu d’ailleurs', description: 'Un voyageur calme et énigmatique. Il porte un manteau turquoise et vermillon, un bonnet à plume rouge et une flûte d’argent. Personne ne sait d’où il vient.', image: `${HAMELIN}/personnages/joueur.webp`, alt: 'Le joueur de flûte, manteau turquoise et vermillon, bonnet à plume rouge et flûte argentée', doubleur: null },
      { nom: 'Le maire', role: 'Celui qui promet', description: 'Trapu et fier, en robe prune bordée de fourrure, la chaîne d’or au cou. Il promet beaucoup quand il a peur.', image: `${HAMELIN}/personnages/maire.webp`, alt: 'Le maire de Hamelin, robe prune à col de fourrure et chaîne dorée', doubleur: null },
      { nom: 'La marchande', role: 'Celle qui regarde', description: 'Une vieille marchande au panier d’osier. Elle remarque ce que les autres ne voient pas.', image: `${HAMELIN}/personnages/marchande.webp`, alt: 'La vieille marchande de Hamelin, châle orange et panier d’osier', doubleur: null },
      { nom: 'La mère', role: 'Celle qui supplie', description: 'Une habitante de Hamelin, tablier crème et robe vert émeraude. Elle est la première à demander qu’on fasse quelque chose.', image: `${HAMELIN}/personnages/mere.webp`, alt: 'Une mère de Hamelin, robe vert émeraude et tablier crème', doubleur: null },
      { nom: 'La petite fille', role: 'Celle qui écoute', description: 'Huit ans, deux tresses nouées de rubans safran. Curieuse et rêveuse, elle a l’oreille fine.', image: `${HAMELIN}/personnages/fillette.webp`, alt: 'Une petite fille aux deux tresses nouées de rubans safran', doubleur: null }
    ],
    origine: {
      titre: 'D’où vient cette légende ?',
      paragraphes: [
        'La légende vient de Hamelin (Hameln), une ville allemande de Basse-Saxe, sur la Weser. La tradition place les faits en 1284 : des enfants de la ville auraient disparu un jour de juin, derrière un musicien inconnu.',
        'Les frères Grimm la mettent par écrit en 1816 dans leurs Légendes allemandes (Deutsche Sagen). En 1842, le poète anglais Robert Browning en tire un long poème, The Pied Piper of Hamelin, qui l’a fait connaître dans le monde entier.',
        'Dans les récits anciens, les habitants refusent de payer le musicien, qui se venge. Notre version garde cette promesse brisée et y ajoute quelques personnages, comme la marchande et la petite fille.'
      ]
    },
    infos: [
      { libelle: 'Origine', valeur: 'Hamelin, Allemagne (légende)', icone: 'origine', drapeau: 'assets/drapeaux/allemagne.svg' },
      { libelle: 'Âge conseillé', valeur: '6 - 10 ans', icone: 'age' },
      { libelle: 'Durée', valeur: '10 minutes', icone: 'duree' },
      { libelle: 'Contenu', valeur: '13 pages illustrées', icone: 'pages' },
      { libelle: 'Langue', valeur: 'Français', icone: 'langue' },
      { libelle: 'Date de sortie', valeur: 'À annoncer', icone: 'date', ton: 'attente' }
    ]
  }
];

export function trouverConte(slug: string): FicheConte | undefined {
  return CONTES.find((c) => c.slug === slug);
}
