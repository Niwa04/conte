import { Component, computed, signal } from '@angular/core';
import { Apparition } from '../../../shared/apparition';
import { FicheConteBloc } from '../../../shared/fiche-conte';
import { PageConteMonde } from '../../../shared/page-conte-monde';
import { PersonnagesConte } from '../../../shared/personnages-conte';

interface Mot {
  natif: string;
  prononce: string;
  sens: string;
}

interface Perle {
  titre: string;
  texte: string;
  page: number;
}

/**
 * Page de La jeune Pocahontas (États-Unis, Virginie).
 * Parti pris : un pont entre deux rives. Une ceinture de perles de coquillage se tisse perle après perle,
 * chaque perle est un geste qui rapproche les deux peuples.
 */
@Component({
  selector: 'app-conte-la-jeune-pocahontas',
  imports: [Apparition, PersonnagesConte, FicheConteBloc],
  templateUrl: './conte-la-jeune-pocahontas.html',
  styleUrl: './conte-la-jeune-pocahontas.scss'
})
export default class ContePocahontas extends PageConteMonde {
  protected readonly mots: Mot[] = [
    { natif: 'Tsenacommacah', prononce: 'tsé-na-co-ma-ca', sens: 'le pays des Powhatan' },
    { natif: 'Tassantassa', prononce: 'ta-san-ta-sa', sens: 'les étrangers' },
    { natif: 'Wingapo', prononce: 'win-ga-po', sens: 'bonjour, ami' }
  ];

  protected readonly perles: Perle[] = [
    { titre: 'Une plume contre une boussole', texte: 'Pocahontas sort des buissons et montre une plume. John répond avec une boussole qui tourne. Ils n’ont pas besoin de mots.', page: 4 },
    { titre: 'Apprendre ensemble', texte: 'Elle lui apprend à planter le maïs et à reconnaître les plantes. Lui lui parle des bateaux et des livres de son pays.', page: 5 },
    { titre: 'Des paniers dans la neige', texte: 'L’hiver est rude et les nouveaux venus manquent de nourriture. Pocahontas et ses amies leur portent du maïs, des haricots et des courges.', page: 6 },
    { titre: 'Les malentendus', texte: 'La faim rend méfiant. Les anciens se demandent ce que veulent ces étrangers. « Quand on se parle, on se comprend », répond Pocahontas.', page: 7 },
    { titre: 'Une main tendue', texte: 'Selon la légende, elle s’interpose pour protéger John Smith. Les historiens ne savent pas si c’est vrai, mais le récit se transmet.', page: 9 },
    { titre: 'L’adieu au bord de l’eau', texte: 'Un jour, John doit repartir. « Souviens-toi de la rivière », dit-elle. La rivière, elle, continue de couler.', page: 11 }
  ];

  protected readonly etape = signal(0);
  /** Nombre de perles déjà tissées (la ceinture ne se défait pas). */
  protected readonly tissees = signal(1);
  protected readonly perle = computed(() => this.perles[this.etape()]);

  protected aller(i: number): void {
    this.etape.set(i);
    this.tissees.update((n) => Math.max(n, i + 1));
  }

  protected suivante(): void {
    if (this.etape() < this.perles.length - 1) this.aller(this.etape() + 1);
  }
}
