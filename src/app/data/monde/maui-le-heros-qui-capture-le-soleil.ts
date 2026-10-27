import type { FicheConte } from '../contes';

const D = 'assets/contes/maui-le-heros-qui-capture-le-soleil';

export const MAUI: FicheConte = {
  slug: 'maui-le-heros-qui-capture-le-soleil',
  gabarit: 'maui-le-heros-qui-capture-le-soleil',
  titre: 'Maui, le héros qui capture le Soleil',
  accroche: 'Une mère, des étoffes d’écorce qui ne sèchent jamais et un garçon qui négocie avec le Soleil.',
  mentionOrigine: 'Inspiré du mythe polynésien de Maui, dans sa version hawaïenne (Haleakalā), notée au XIXe siècle',
  drapeau: { src: 'assets/drapeaux/hawaii.svg', alt: 'Drapeau d’Hawaï' },
  couverture: `${D}/couverture.webp`,
  couvertureAlt: 'Couverture du livre Maui, le héros qui capture le Soleil : Maui et sa corde face au soleil levant sur la montagne',
  fond: `${D}/pages/p01.webp`,
  etiquettes: ['Mythe polynésien', 'Hawaï', '6 - 10 ans', '8 min de lecture'],
  citation: 'On ne gagne pas toujours par la force. Parfois, il suffit de savoir parler.',
  resume: 'À Hawaï, la mère de Maui, Hina, peint de belles étoffes d’écorce, mais le Soleil passe si vite dans le ciel qu’elles ne sèchent jamais. Maui tresse avec ses amis une corde en fibres de coco, grimpe sur la montagne Haleakalā et attrape les rayons du Soleil à l’aube. Mais il ne veut pas se battre : il veut négocier. Le Soleil, surpris, accepte un marché qui change les journées de toute l’île. Un mythe du Pacifique sur l’audace, le dialogue et le temps partagé.',
  cartesDeco: [],
  imageHistoire: { src: `${D}/pages/p01.webp`, alt: 'Hina et Maui sur la colline, au-dessus d’une baie turquoise et de la montagne Haleakalā', legende: 'L’île de Maui et de Hina' },
  illustrations: [
    { src: `${D}/pages/p04.webp`, alt: 'Maui et ses amis tressent une très longue corde de fibres de coco, sur le sable blanc' },
    { src: `${D}/pages/p06.webp`, alt: 'Maui lance sa corde vers un grand soleil au visage souriant, sur la montagne au lever du jour' },
    { src: `${D}/pages/p09.webp`, alt: 'Hina étend de grandes étoffes d’écorce rouges au soleil, au bord d’une plage où des enfants jouent' }
  ],
  personnages: [
    { nom: 'Maui', role: 'Le demi-dieu joyeux', description: 'Plein d’idées et de toupet, il préfère parler que se battre. Il aime sa mère et veut lui rendre service.', image: `${D}/personnages/maui.webp`, alt: 'Maui, pagne rouge à motifs, écharpe turquoise et corde sur l’épaule', doubleur: null },
    { nom: 'Hina', role: 'La mère de Maui', description: 'Elle fabrique et peint des étoffes d’écorce, les tapas, qu’elle étend au soleil pour qu’elles sèchent.', image: `${D}/personnages/hina.webp`, alt: 'Hina, longue tresse, fleur rouge dans les cheveux, robe turquoise à motifs rouges', doubleur: null },
    { nom: 'Le Soleil', role: 'Le voyageur du ciel', description: 'Très pressé, un peu fier, mais pas méchant. Il accepte de ralentir quand on lui explique pourquoi.', image: `${D}/personnages/soleil.webp`, alt: 'Le Soleil, un visage souriant entouré de longs rayons dorés', doubleur: null }
  ],
  origine: {
    titre: 'D’où vient ce conte ?',
    paragraphes: [
      'Maui est un héros de tout le Pacifique : on le retrouve chez les Hawaïens, les Maoris de Nouvelle-Zélande, à Samoa et dans bien d’autres îles. Selon les endroits, il pêche des îles, vole le feu ou attrape le soleil.',
      'La version hawaïenne est la plus connue pour cette histoire : Maui lasse le Soleil depuis le sommet du Haleakalā, dont le nom veut dire « la maison du soleil » (à vérifier). Des versions écrites ont été publiées au XIXe siècle, notamment par Abraham Fornander (1878-1885) et par W. D. Westervelt (Legends of Maui, 1910).',
      'Notre version garde Hina, le tapa qui ne sèche pas, la corde en fibres de coco et le marché avec le Soleil. Elle remplace le combat par une conversation, et c’est ainsi que les jours deviennent plus longs une partie de l’année.'
    ]
  },
  infos: [
    { libelle: 'Origine', valeur: 'Hawaï (mythe polynésien)', icone: 'origine', drapeau: 'assets/drapeaux/hawaii.svg' },
    { libelle: 'Âge conseillé', valeur: '6 - 10 ans', icone: 'age' },
    { libelle: 'Durée', valeur: '8 minutes', icone: 'duree' },
    { libelle: 'Contenu', valeur: '10 pages illustrées', icone: 'pages' },
    { libelle: 'Langue', valeur: 'Français', icone: 'langue' },
    { libelle: 'Date de sortie', valeur: 'À annoncer', icone: 'date', ton: 'attente' }
  ]
};
