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
  /** Résumé en étapes, sans dévoiler la fin. */
  etapes: { titre: string; texte: string }[];
  /** Cartes de collection du conte, utilisées comme décoration. */
  cartesDeco: string[];
  imageHistoire: { src: string; alt: string; legende: string };
  illustrations: IllustrationConte[];
  personnages: PersonnageConte[];
  origine: { titre: string; paragraphes: string[] };
  infos: InfoConte[];
}

const DOSSIER = 'assets/contes/aicha-et-la-gazelle-enchantee';

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
    etapes: [
      {
        titre: 'Au village',
        texte: 'Aïcha et son petit frère Ali vivent dans un village de Kabylie. Quand leur mère disparaît, leur belle-mère ne leur laisse que des miettes. Mais sur la tombe de leur mère, deux roseaux poussent par miracle : l’un laisse couler du miel, l’autre du beurre frais.'
      },
      {
        titre: 'Sur les chemins',
        texte: 'Pour échapper à la belle-mère, Aïcha prend son frère par la main et s’enfuit. Au pied d’un rocher, Ali boit à une source… et la magie opère : le petit garçon devient gazelle. Aïcha n’a plus qu’une idée : lui rendre sa forme humaine.'
      },
      {
        titre: 'À la ville',
        texte: 'Entre oliviers, jardins de palais et rencontre avec un jeune sultan, ce conte parle de fidélité, de courage et de l’amour d’une sœur pour son frère.'
      }
    ],
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
        src: `${DOSSIER}/jardin.webp`,
        alt: 'Aïcha et sa gazelle dans un jardin fleuri face à un jeune sultan, devant les murs d’une ville'
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
  }
];

export function trouverConte(slug: string): FicheConte | undefined {
  return CONTES.find((c) => c.slug === slug);
}
