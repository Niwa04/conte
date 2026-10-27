import { Component, computed, signal } from '@angular/core';
import { Apparition } from '../../../shared/apparition';
import { FicheConteBloc } from '../../../shared/fiche-conte';
import { PageConteMonde } from '../../../shared/page-conte-monde';
import { PersonnagesConte } from '../../../shared/personnages-conte';

interface Mot {
  tlingit: string;
  prononce: string;
  sens: string;
}

interface Boite {
  nom: string;
  texte: string;
}

/**
 * Page du Corbeau qui vola le Soleil (Alaska).
 * Parti pris : trois boîtes de cèdre dans le noir. On les ouvre dans l'ordre du conte :
 * les étoiles, la lune, puis le soleil, qui noircit les plumes du corbeau.
 */
@Component({
  selector: 'app-conte-le-corbeau-qui-vola-le-soleil',
  imports: [Apparition, PersonnagesConte, FicheConteBloc],
  templateUrl: './conte-le-corbeau-qui-vola-le-soleil.html',
  styleUrl: './conte-le-corbeau-qui-vola-le-soleil.scss'
})
export default class ConteCorbeau extends PageConteMonde {
  protected readonly mots: Mot[] = [
    { tlingit: 'Yéil', prononce: 'yéil', sens: 'le corbeau' },
    { tlingit: 'Héen', prononce: 'hèèn', sens: 'l’eau' },
    { tlingit: 'Gunalchéesh', prononce: 'gou-nal-tchéèch', sens: 'merci' }
  ];

  protected readonly boites: Boite[] = [
    { nom: 'Les étoiles', texte: 'Le bébé joue avec les petites lumières, puis les lance par le trou de fumée. Elles s’envolent et se dispersent dans le ciel.' },
    { nom: 'La lune', texte: 'Il fait rouler la lune, puis la jette là-haut. Elle s’accroche, ronde et douce. En bas, les gens lèvent la tête.' },
    { nom: 'Le soleil', texte: 'La plus grande boîte est ouverte. Corbeau reprend sa forme, saisit la lumière et s’enfuit par la cheminée. La fumée noircit ses plumes pour toujours.' }
  ];

  /** Nombre de boîtes déjà ouvertes (0 à 3). */
  protected readonly ouvertes = signal(0);
  protected readonly derniere = computed(() => (this.ouvertes() > 0 ? this.boites[this.ouvertes() - 1] : null));

  protected ouvrir(i: number): void {
    if (i === this.ouvertes()) this.ouvertes.set(i + 1);
  }

  protected refermer(): void {
    this.ouvertes.set(0);
  }
}
