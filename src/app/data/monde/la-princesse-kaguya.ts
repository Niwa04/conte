import type { FicheConte } from '../contes';

const D = 'assets/contes/la-princesse-kaguya';

export const KAGUYA: FicheConte = {
  slug: 'la-princesse-kaguya',
  gabarit: 'la-princesse-kaguya',
  titre: 'La Princesse Kaguya',
  accroche: 'Une enfant trouvée dans un bambou lumineux, cinq prétendants, un Empereur… et une lune qui l’attend.',
  mentionOrigine: 'D’après le Conte du coupeur de bambou (Taketori monogatari), récit japonais anonyme du Xe siècle environ',
  drapeau: { src: 'assets/drapeaux/japon.svg', alt: 'Drapeau du Japon' },
  couverture: `${D}/couverture.webp`,
  couvertureAlt: 'Couverture du livre La Princesse Kaguya : Kaguya en kimono rouge sous la pleine lune, au milieu des bambous',
  fond: `${D}/pages/p01.webp`,
  etiquettes: ['Conte japonais', 'Japon', '6 - 10 ans', '10 min de lecture'],
  citation: 'Il est des lumières qu’on ne peut garder, seulement aimer.',
  resume: 'Un vieux coupeur de bambou découvre un soir une toute petite fille dans une tige qui brille. Lui et sa femme l’élèvent comme leur enfant et l’appellent Kaguya. Elle grandit vite, et sa beauté attire cinq princes, auxquels elle confie des tâches impossibles pour qu’ils la laissent en paix. Même l’Empereur voudrait la connaître. Mais Kaguya regarde la lune chaque soir avec tristesse : elle garde un secret qu’il faudra bientôt dire à ceux qu’elle aime.',
  cartesDeco: [],
  imageHistoire: { src: `${D}/pages/p03.webp`, alt: 'Kaguya devenue jeune fille, entre la vieille femme et le coupeur de bambou, dans leur maison au soleil couchant', legende: 'Une enfant tombée du ciel' },
  illustrations: [
    { src: `${D}/pages/p05.webp`, alt: 'Kaguya parle aux prétendants assis sur la véranda, en kimono rouge' },
    { src: `${D}/pages/p07.webp`, alt: 'L’Empereur en robe pourpre devant Kaguya, qui s’incline sur la véranda' },
    { src: `${D}/pages/p11.webp`, alt: 'Kaguya, drapée dans un manteau de plumes blanches, offre un petit flacon à ses parents' }
  ],
  personnages: [
    { nom: 'Kaguya', role: 'La princesse qui brille', description: 'Douce et lumineuse, elle ne vient pas de la Terre. Elle a appris à aimer chez ceux qui l’ont élevée.', image: `${D}/personnages/kaguya.webp`, alt: 'Kaguya, longs cheveux noirs et kimono rouge brodé de bambous', doubleur: null },
    { nom: 'Le coupeur de bambou', role: 'Le père de Kaguya', description: 'Un vieil homme souriant qui vit au pied de la colline. Il trouve dans une tige le plus beau des cadeaux.', image: `${D}/personnages/pere.webp`, alt: 'Le coupeur de bambou, hotte dans le dos et tunique bleu nuit', doubleur: null },
    { nom: 'La vieille femme', role: 'La mère de Kaguya', description: 'Elle rêvait d’un enfant. Elle accueille la petite fille avec le cœur grand ouvert.', image: `${D}/personnages/mere.webp`, alt: 'La vieille femme, kimono vert et tablier crème', doubleur: null },
    { nom: 'Un prétendant', role: 'L’un des cinq princes', description: 'Cinq princes tentent de gagner Kaguya. Aucun ne réussit l’épreuve : on ne gagne pas un cœur avec un trésor.', image: `${D}/personnages/pretendant-3.webp`, alt: 'Un prince en grande robe rouge brodée d’or', doubleur: null },
    { nom: 'L’Empereur', role: 'Le souverain du Japon', description: 'Respectueux, il ne force jamais Kaguya. Il garde pour elle un attachement qui dure longtemps.', image: `${D}/personnages/empereur.webp`, alt: 'L’Empereur, longue robe pourpre et dorée, éventail à la main', doubleur: null },
    { nom: 'Le messager lunaire', role: 'Le peuple de la Lune', description: 'Lumineux et silencieux, il vient chercher Kaguya les nuits de pleine lune, un manteau de plumes sur le bras.', image: `${D}/personnages/messager-lunaire.webp`, alt: 'Un messager de la Lune, longs cheveux argentés et robe vert pâle', doubleur: null }
  ],
  origine: {
    titre: 'D’où vient ce conte ?',
    paragraphes: [
      'Ce conte vient du Japon. Il est connu sous le nom de Taketori monogatari, le « Conte du coupeur de bambou ». C’est un récit ancien, d’auteur inconnu, que l’on date en général de la fin du IXe ou du début du Xe siècle (à vérifier). On le présente souvent comme l’un des plus vieux récits en prose du Japon.',
      'Il était déjà célèbre un siècle plus tard : Murasaki Shikibu, dans son roman Le Dit du Genji (vers 1008), le cite comme « l’ancêtre de tous les récits » (à vérifier). Depuis, il a été raconté, peint et joué sans cesse, jusqu’au film d’animation d’Isao Takahata, Le Conte de la princesse Kaguya (2013).',
      'Notre version garde les cinq prétendants et leurs tâches impossibles, la visite de l’Empereur, le manteau de plumes et l’élixir de longue vie. Elle raconte l’histoire à hauteur d’enfant, avec une fin pleine de tendresse.'
    ]
  },
  infos: [
    { libelle: 'Origine', valeur: 'Japon (récit ancien)', icone: 'origine', drapeau: 'assets/drapeaux/japon.svg' },
    { libelle: 'Âge conseillé', valeur: '6 - 10 ans', icone: 'age' },
    { libelle: 'Durée', valeur: '10 minutes', icone: 'duree' },
    { libelle: 'Contenu', valeur: '13 pages illustrées', icone: 'pages' },
    { libelle: 'Langue', valeur: 'Français', icone: 'langue' },
    { libelle: 'Date de sortie', valeur: 'À annoncer', icone: 'date', ton: 'attente' }
  ]
};
