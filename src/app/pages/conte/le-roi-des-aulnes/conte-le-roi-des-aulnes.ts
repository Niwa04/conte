import { Component, computed, signal } from '@angular/core';
import { Apparition } from '../../../shared/apparition';
import { FicheConteBloc } from '../../../shared/fiche-conte';
import { PageConteMonde } from '../../../shared/page-conte-monde';
import { PersonnagesConte } from '../../../shared/personnages-conte';

interface Mot {
  allemand: string;
  prononce: string;
  sens: string;
}

interface Moment {
  titre: string;
  enfant: string;
  pere: string;
}

/**
 * Page du Roi des Aulnes (Allemagne).
 * Parti pris : deux regards sur la même forêt. Un curseur sépare ce que voit le père
 * (la forêt, la lune, le brouillard) de ce que voit l'enfant (le roi dans la brume).
 */
@Component({
  selector: 'app-conte-le-roi-des-aulnes',
  imports: [Apparition, PersonnagesConte, FicheConteBloc],
  templateUrl: './conte-le-roi-des-aulnes.html',
  styleUrl: './conte-le-roi-des-aulnes.scss'
})
export default class ConteAulnes extends PageConteMonde {
  protected readonly mots: Mot[] = [
    { allemand: 'Erlkönig', prononce: 'èrl-keu-nik', sens: 'le roi des aulnes' },
    { allemand: 'Nebel', prononce: 'né-bel', sens: 'le brouillard' },
    { allemand: 'Wald', prononce: 'valt', sens: 'la forêt' }
  ];

  protected readonly moments: Moment[] = [
    { titre: 'La couronne', enfant: '« Père, tu ne vois pas le Roi des Aulnes ? Il porte une couronne et une longue traîne… »', pere: '« Ce n’est que du brouillard, mon enfant. »' },
    { titre: 'La voix', enfant: '« Père, tu n’entends pas ce que le Roi me promet ? »', pere: '« Calme-toi. C’est le vent dans les feuilles sèches. »' },
    { titre: 'Les filles', enfant: '« Regarde là-bas, les filles du Roi dans l’ombre ! »', pere: 'Il ne voit que de vieux saules gris, couverts de brume.' }
  ];

  /** Position de la séparation (0 = tout le regard de l'enfant, 100 = tout celui du père). */
  protected readonly coupe = signal(50);
  protected readonly moment = signal(0);
  protected readonly courant = computed(() => this.moments[this.moment()]);
  protected readonly voitLeRoi = computed(() => this.coupe() < 70);

  protected regler(ev: Event): void {
    this.coupe.set(Number((ev.target as HTMLInputElement).value));
  }

  protected choisir(i: number): void {
    this.moment.set(i);
  }
}
