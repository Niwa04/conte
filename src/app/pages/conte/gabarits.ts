import { type Type } from '@angular/core';

/**
 * Pages de contes du monde à design propre, chargées à la demande (une par conte).
 * La clé est le champ `gabarit` de la fiche dans data/contes.ts.
 */
export const GABARITS: Record<string, () => Promise<Type<unknown>>> = {
  'ali-baba': () => import('./ali-baba/conte-ali-baba').then((m) => m.default),
  'heungbu-et-nolbu': () => import('./heungbu-et-nolbu/conte-heungbu-et-nolbu').then((m) => m.default),
  'kintu-et-la-fille-du-ciel': () => import('./kintu-et-la-fille-du-ciel/conte-kintu-et-la-fille-du-ciel').then((m) => m.default),
  'la-princesse-kaguya': () => import('./la-princesse-kaguya/conte-la-princesse-kaguya').then((m) => m.default),
  'la-jeune-pocahontas': () => import('./la-jeune-pocahontas/conte-la-jeune-pocahontas').then((m) => m.default),
  'la-reine-amina-de-zaria': () => import('./la-reine-amina-de-zaria/conte-la-reine-amina-de-zaria').then((m) => m.default),
  'la-reine-de-saba': () => import('./la-reine-de-saba/conte-la-reine-de-saba').then((m) => m.default),
  'le-corbeau-qui-vola-le-soleil': () => import('./le-corbeau-qui-vola-le-soleil/conte-le-corbeau-qui-vola-le-soleil').then((m) => m.default),
  'le-roi-des-aulnes': () => import('./le-roi-des-aulnes/conte-le-roi-des-aulnes').then((m) => m.default),
  'le-roi-des-singes': () => import('./le-roi-des-singes/conte-le-roi-des-singes').then((m) => m.default),
  'le-singe-et-la-lune': () => import('./le-singe-et-la-lune/conte-le-singe-et-la-lune').then((m) => m.default),
  'le-vilain-petit-canard': () => import('./le-vilain-petit-canard/conte-le-vilain-petit-canard').then((m) => m.default),
  'maui-le-heros-qui-capture-le-soleil': () => import('./maui-le-heros-qui-capture-le-soleil/conte-maui-le-heros-qui-capture-le-soleil').then((m) => m.default),
  'sedna-la-gardienne-des-profondeurs': () => import('./sedna-la-gardienne-des-profondeurs/conte-sedna-la-gardienne-des-profondeurs').then((m) => m.default),
};
