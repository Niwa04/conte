import type { FicheConte } from '../contes';

const D = 'assets/contes/le-roi-des-aulnes';

export const AULNES: FicheConte = {
  slug: 'le-roi-des-aulnes',
  gabarit: 'le-roi-des-aulnes',
  titre: 'Le Roi des Aulnes',
  accroche: 'Une nuit d’automne, un père à cheval, un enfant fiévreux et une voix que seul l’enfant entend.',
  mentionOrigine: 'D’après la ballade « Erlkönig » de Goethe (1782), mise en musique par Schubert en 1815',
  drapeau: { src: 'assets/drapeaux/allemagne.svg', alt: 'Drapeau de l’Allemagne' },
  couverture: `${D}/couverture.webp`,
  couvertureAlt: 'Couverture du livre Le Roi des Aulnes : un père à cheval avec son fils dans une forêt d’automne, sous la lune',
  fond: `${D}/pages/p01.webp`,
  etiquettes: ['Ballade allemande', 'Allemagne', '6 - 10 ans', '8 min de lecture'],
  citation: 'Certaines peurs ne se voient pas. Elles se tiennent tout près, dans le souffle du vent.',
  resume: 'Par une nuit d’automne, un père traverse à cheval une grande forêt allemande, son petit garçon serré contre lui. L’enfant a de la fièvre. Dans le vent et la brume, il croit voir un roi couronné et entend une voix très douce qui l’appelle. Son père, lui, ne voit que des feuilles, des saules et du brouillard. Il essaie de le rassurer, il galope vers la ferme dont on aperçoit la lampe. Un conte sombre et tendre, à lire accompagné, sur ce que l’on voit, ce que l’on entend et ce que l’on ressent près de ceux qu’on aime.',
  cartesDeco: [],
  imageHistoire: { src: `${D}/pages/p01.webp`, alt: 'Un père et son fils à cheval sur un chemin de forêt, sous la pleine lune et les feuilles rousses', legende: 'La forêt, une nuit d’automne' },
  illustrations: [
    { src: `${D}/pages/p03.webp`, alt: 'Une silhouette en manteau vert surgit au bord d’une eau brillante, entre des fleurs lumineuses' },
    { src: `${D}/pages/p06.webp`, alt: 'Le cheval galope dans les feuilles mortes, une brume verte et pâle dans le sillage' },
    { src: `${D}/pages/p07.webp`, alt: 'Le père porte son fils dans ses bras devant la porte de la ferme, une lampe allumée à l’intérieur' }
  ],
  personnages: [
    { nom: 'Le père', role: 'Le cavalier', description: 'Il parle doucement à son fils et le serre fort. Il ne voit pas ce que l’enfant voit, mais il sent son cœur battre.', image: `${D}/personnages/pere.webp`, alt: 'Le père, grand manteau vert, ceinture et bottes de cuir', doubleur: null },
    { nom: 'Le fils', role: 'L’enfant fiévreux', description: 'Pâle et brûlant de fièvre, il voit et entend ce qui échappe aux grandes personnes.', image: `${D}/personnages/fils.webp`, alt: 'Le petit garçon, gilet rouge, chemise jaune et bottes brunes', doubleur: null },
    { nom: 'Le Roi des Aulnes', role: 'Le roi de la brume', description: 'Une silhouette couronnée dans le brouillard, à la voix très douce. Il promet des jeux et des fleurs.', image: `${D}/personnages/roi-des-aulnes.webp`, alt: 'Le Roi des Aulnes, long manteau vert et turquoise brodé d’or, couronne pâle', doubleur: null },
    { nom: 'Les filles du Roi', role: 'Les danseuses du bord de l’eau', description: 'Trois jeunes filles de brume, cheveux d’or, de cuivre et de nuit, qui bercent et font danser.', image: `${D}/personnages/filles-du-roi.webp`, alt: 'Les trois filles du Roi en robes vertes, dorées et bleues', doubleur: null },
    { nom: 'Le cheval', role: 'Le fidèle galopeur', description: 'Il traverse la forêt à toute vitesse, sans jamais s’arrêter, vers la lumière de la ferme.', image: `${D}/personnages/cheval.webp`, alt: 'Un cheval brun à la crinière noire, sellé de rouge', doubleur: null }
  ],
  origine: {
    titre: 'D’où vient ce conte ?',
    paragraphes: [
      'Le Roi des Aulnes vient d’un poème de l’écrivain allemand Johann Wolfgang von Goethe, « Erlkönig », publié en 1782. C’est une ballade très courte, qui se lit d’un souffle, comme la course d’un cheval.',
      'Goethe s’est inspiré d’une ballade danoise traduite en allemand par Johann Gottfried Herder dans ses Volkslieder (1778). On dit que Herder a traduit par « Erlkönig », le roi des aulnes, un mot qui voulait peut-être dire « roi des elfes » (à vérifier). En 1815, le compositeur Franz Schubert a mis le poème en musique, et cette chanson est devenue l’une des plus célèbres du monde.',
      'Notre version garde la nuit, le galop, la voix du roi et les filles dans la brume. Elle invente la fin sur le « je suis là » et la voix qui revient les nuits d’automne, pour parler de ce qu’on ressent quand quelqu’un a peur.'
    ]
  },
  infos: [
    { libelle: 'Origine', valeur: 'Allemagne (ballade de Goethe)', icone: 'origine', drapeau: 'assets/drapeaux/allemagne.svg' },
    { libelle: 'Âge conseillé', valeur: '6 - 10 ans, accompagné', icone: 'age' },
    { libelle: 'Durée', valeur: '8 minutes', icone: 'duree' },
    { libelle: 'Contenu', valeur: '9 pages illustrées', icone: 'pages' },
    { libelle: 'Langue', valeur: 'Français', icone: 'langue' },
    { libelle: 'Date de sortie', valeur: 'À annoncer', icone: 'date', ton: 'attente' }
  ]
};
