import type { FicheConte } from '../contes';

const D = 'assets/contes/sedna-la-gardienne-des-profondeurs';

export const SEDNA: FicheConte = {
  slug: 'sedna-la-gardienne-des-profondeurs',
  gabarit: 'sedna-la-gardienne-des-profondeurs',
  titre: 'Sedna, la gardienne des profondeurs',
  accroche: 'Une jeune fille qui veut choisir sa vie, un grand oiseau de mer et un peigne qui change le sort des animaux.',
  mentionOrigine: 'Inspiré de la légende inuit de Sedna (Arctique), recueillie notamment par Franz Boas (1888) et Knud Rasmussen (1929)',
  drapeau: { src: 'assets/drapeaux/canada.svg', alt: 'Drapeau du Canada' },
  couverture: `${D}/couverture.webp`,
  couvertureAlt: 'Couverture du livre Sedna, la gardienne des profondeurs : Sedna, queue turquoise, nage devant une baleine sous la glace',
  fond: `${D}/pages/p01.webp`,
  etiquettes: ['Légende inuit', 'Arctique', '7 - 10 ans', '10 min de lecture'],
  citation: 'Sous la glace, quelqu’un écoute encore. Il faut seulement lui parler avec douceur.',
  resume: 'Sedna refuse qu’on choisisse son mari à sa place. Un étranger vêtu de fourrures l’emmène sur son île, mais c’est un grand oiseau de mer, qui lui a menti. Quand son père vient la chercher, l’oiseau les poursuit, et la peur fait commettre au père un geste terrible. Sedna tombe dans la mer, où ses doigts deviennent des phoques, des morses et des baleines, et elle devient la gardienne des animaux marins. Quand les chasseurs prennent trop, il faudra qu’un ancien vienne l’écouter. Une légende grave et tendre à lire accompagné.',
  cartesDeco: [],
  imageHistoire: { src: `${D}/pages/p01.webp`, alt: 'Sedna et son père sur la grève au coucher du soleil, près du kayak, une moufle levée pour un adieu', legende: 'Sedna et son père, au bord de la mer' },
  illustrations: [
    { src: `${D}/pages/p03.webp`, alt: 'Un grand oiseau aux ailes bleues survole une falaise noire où se trouve son nid, au-dessus de la mer' },
    { src: `${D}/pages/p07.webp`, alt: 'Sedna, entourée de poissons, d’un phoque, de morses et d’une baleine, dans l’eau pleine de lumière' },
    { src: `${D}/pages/p10.webp`, alt: 'Un vieil homme à la longue chevelure blanche prend soin de peigner Sedna sous une arche de pierre noire' }
  ],
  personnages: [
    { nom: 'Sedna', role: 'La gardienne des animaux marins', description: 'Fière, courageuse et blessée. Elle décide de veiller sur les poissons, les phoques et les baleines.', image: `${D}/personnages/sedna.webp`, alt: 'Sedna, manteau turquoise bordé de fourrure et ceinture rouge', doubleur: null },
    { nom: 'Sedna sous la mer', role: 'La maîtresse des profondeurs', description: 'Sous l’eau, ses jambes deviennent une longue queue turquoise. Ses cheveux flottent librement.', image: `${D}/personnages/sedna-marine.webp`, alt: 'Sedna avec une queue turquoise aux reflets de nacre et de longs cheveux noirs', doubleur: null },
    { nom: 'Le père', role: 'Le pêcheur en kayak', description: 'Il aime sa fille et vient la chercher. Mais la peur le fait agir comme il n’aurait jamais voulu.', image: `${D}/personnages/pere.webp`, alt: 'Le père de Sedna, manteau de fourrure orangé, grande pagaie', doubleur: null },
    { nom: 'L’étranger', role: 'Le voyageur aux belles fourrures', description: 'Il promet un feu qui ne s’éteint jamais. Il cache son vrai visage jusqu’à l’arrivée.', image: `${D}/personnages/voyageur.webp`, alt: 'L’étranger, long manteau bleu bordé de fourrure blanche', doubleur: null },
    { nom: 'L’oiseau de mer', role: 'L’époux menteur', description: 'Un grand oiseau aux ailes bleu nuit. Il retient Sedna sur son île avant de la poursuivre au-dessus des vagues.', image: `${D}/personnages/oiseau.webp`, alt: 'Un grand oiseau blanc aux immenses ailes bleu nuit, déployées', doubleur: null },
    { nom: 'L’ancien', role: 'Celui qui écoute la mer', description: 'Il descend jusqu’à Sedna avec un peigne et la promesse de ne prendre que ce qui nourrit les familles.', image: `${D}/personnages/ancien.webp`, alt: 'Un vieil homme aux cheveux blancs, manteau prune bordé de fourrure', doubleur: null }
  ],
  origine: {
    titre: 'D’où vient ce conte ?',
    paragraphes: [
      'Sedna est une figure centrale des légendes des Inuit, dans l’Arctique canadien et au Groenland. Elle est la maîtresse des animaux de la mer, ceux dont dépendent les chasseurs. Selon les régions, on la nomme aussi Nuliajuk ou Takannaaluk (à vérifier).',
      'Cette légende était transmise à l’oral par les anciens et par les chamans. Des versions ont été notées à la fin du XIXe siècle et au début du XXe : par Franz Boas dans The Central Eskimo (1888), puis par Knud Rasmussen, dans Intellectual Culture of the Iglulik Eskimos (1929). Elles varient beaucoup d’un village à l’autre.',
      'Notre version garde l’époux oiseau, la trahison du père, les animaux marins nés de ses doigts et la visite de l’ancien. Elle invente la scène du peigne et fait de la douceur la clé du récit. Ce conte est plus grave que d’autres : mieux vaut le lire avec un adulte.'
    ]
  },
  infos: [
    { libelle: 'Origine', valeur: 'Arctique (légende inuit)', icone: 'origine', drapeau: 'assets/drapeaux/canada.svg' },
    { libelle: 'Âge conseillé', valeur: '7 - 10 ans, accompagné', icone: 'age' },
    { libelle: 'Durée', valeur: '10 minutes', icone: 'duree' },
    { libelle: 'Contenu', valeur: '12 pages illustrées', icone: 'pages' },
    { libelle: 'Langue', valeur: 'Français', icone: 'langue' },
    { libelle: 'Date de sortie', valeur: 'À annoncer', icone: 'date', ton: 'attente' }
  ]
};
