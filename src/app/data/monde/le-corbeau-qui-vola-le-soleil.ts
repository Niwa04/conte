import type { FicheConte } from '../contes';

const D = 'assets/contes/le-corbeau-qui-vola-le-soleil';

export const CORBEAU: FicheConte = {
  slug: 'le-corbeau-qui-vola-le-soleil',
  gabarit: 'le-corbeau-qui-vola-le-soleil',
  titre: 'Le Corbeau qui vola le Soleil',
  accroche: 'Un monde sans lumière, trois boîtes de cèdre bien fermées et un corbeau blanc très malin.',
  mentionOrigine: 'Inspiré des mythes du Corbeau des peuples du Nord-Ouest du Pacifique (Tlingit, Haïda…), notés notamment par John R. Swanton en 1909',
  drapeau: { src: 'assets/drapeaux/alaska.svg', alt: 'Drapeau de l’Alaska' },
  couverture: `${D}/couverture.webp`,
  couvertureAlt: 'Couverture du livre Le Corbeau qui vola le Soleil : un corbeau blanc dans la nuit glacée, un halo doré au bec',
  fond: `${D}/pages/p01.webp`,
  etiquettes: ['Mythe amérindien', 'Alaska', '6 - 10 ans', '10 min de lecture'],
  citation: 'Il n’y avait ni soleil, ni lune, ni étoiles. Seulement un petit oiseau têtu.',
  resume: 'Au tout début, le monde est plongé dans le noir. Sur les rives glacées de l’Alaska, les gens avancent à tâtons. Corbeau, blanc comme la neige et très malin, sait qu’un vieux chef garde la lumière dans des boîtes de bois. Pour entrer chez lui, il prend la forme d’une aiguille de cèdre, se glisse dans la cruche de sa fille et naît sous les traits d’un bébé. Ce mythe du Nord-Ouest du Pacifique raconte comment la lumière est venue sur la terre, et pourquoi les corbeaux sont noirs.',
  cartesDeco: [],
  imageHistoire: { src: `${D}/pages/p02.webp`, alt: 'Un corbeau blanc en plein vol dans la tempête de neige, au-dessus d’une forêt de sapins', legende: 'Corbeau, blanc comme la neige' },
  illustrations: [
    { src: `${D}/pages/p03.webp`, alt: 'Dans la maison du vieux chef, une main se pose sur trois grandes boîtes de bois rangées devant le feu' },
    { src: `${D}/pages/p06.webp`, alt: 'Un bébé lance des étoiles scintillantes vers le trou de fumée de la maison' },
    { src: `${D}/pages/p10.webp`, alt: 'Le soleil se lève sur une baie de montagnes enneigées, un petit oiseau noir vole devant lui' }
  ],
  personnages: [
    { nom: 'Corbeau', role: 'Le farceur au bon cœur', description: 'Blanc comme la neige, malin et joueur. Il ne supporte pas que les gens vivent dans le noir.', image: `${D}/personnages/corbeau-blanc.webp`, alt: 'Un corbeau entièrement blanc, aux pattes sombres', doubleur: null },
    { nom: 'L’enfant aux yeux noirs', role: 'Corbeau déguisé', description: 'Un bébé curieux qui pleure pour avoir les boîtes. Personne ne se doute qu’il est Corbeau.', image: `${D}/personnages/corbeau-enfant.webp`, alt: 'Un petit enfant assis, tunique crème brodée de vert et pantalon orange', doubleur: null },
    { nom: 'La fille du chef', role: 'La mère de l’enfant', description: 'Elle puise l’eau à la source, sans voir la petite aiguille de cèdre dans sa cruche.', image: `${D}/personnages/fille-du-chef.webp`, alt: 'La fille du chef, longue tresse, robe turquoise et gilet orange, une cruche à la main', doubleur: null },
    { nom: 'Le vieux chef', role: 'Le gardien de la lumière', description: 'Il garde ses boîtes jalousement. Mais il ne sait rien refuser à son petit-fils.', image: `${D}/personnages/vieux-chef.webp`, alt: 'Le vieux chef, cheveux gris, grand manteau rouge et orange à motifs', doubleur: null },
    { nom: 'Corbeau noir', role: 'Corbeau aujourd’hui', description: 'La fumée a noirci ses plumes. Depuis, tous les corbeaux sont noirs, et fiers d’avoir donné la lumière.', image: `${D}/personnages/corbeau-noir.webp`, alt: 'Un corbeau noir aux reflets bleu nuit', doubleur: null }
  ],
  origine: {
    titre: 'D’où vient ce conte ?',
    paragraphes: [
      'Ce récit appartient aux peuples du Nord-Ouest du Pacifique, sur la côte de l’Alaska et du Canada : les Tlingit, les Haïda, les Tsimshian et d’autres. Corbeau (Raven en anglais) y est un personnage central : un farceur, un transformateur du monde, qui apporte aux humains la lumière et d’autres cadeaux.',
      'Ces histoires sont d’abord orales et se racontent encore aujourd’hui. Des versions écrites ont été notées par des chercheurs, comme John R. Swanton dans Tlingit Myths and Texts (1909). Elles varient d’un peuple à l’autre (à vérifier selon la version).',
      'Notre version garde les boîtes des étoiles, de la lune et du soleil, l’aiguille de cèdre et les plumes noircies par la fumée. Elle est racontée à hauteur d’enfant, avec un Corbeau généreux plutôt que rusé.'
    ]
  },
  infos: [
    { libelle: 'Origine', valeur: 'Nord-Ouest du Pacifique (Alaska)', icone: 'origine', drapeau: 'assets/drapeaux/alaska.svg' },
    { libelle: 'Âge conseillé', valeur: '6 - 10 ans', icone: 'age' },
    { libelle: 'Durée', valeur: '10 minutes', icone: 'duree' },
    { libelle: 'Contenu', valeur: '12 pages illustrées', icone: 'pages' },
    { libelle: 'Langue', valeur: 'Français', icone: 'langue' },
    { libelle: 'Date de sortie', valeur: 'À annoncer', icone: 'date', ton: 'attente' }
  ]
};
