import { Component, computed, signal } from '@angular/core';
import { Apparition } from '../../../shared/apparition';
import { FicheConteBloc } from '../../../shared/fiche-conte';
import { PageConteMonde } from '../../../shared/page-conte-monde';
import { PersonnagesConte } from '../../../shared/personnages-conte';

interface Mot {
  persan: string;
  translit: string;
  sens: string;
}

/**
 * Page d'Ali Baba (Perse, Mille et Une Nuits).
 * Parti pris : un rocher qui s'ouvre sur « Sésame, ouvre-toi ! » et quarante jarres à vérifier
 * comme Morgiane, au milieu de zelliges et de lanternes.
 */
@Component({
  selector: 'app-conte-ali-baba',
  imports: [Apparition, PersonnagesConte, FicheConteBloc],
  templateUrl: './conte-ali-baba.html',
  styleUrl: './conte-ali-baba.scss'
})
export default class ConteAliBaba extends PageConteMonde {
  protected readonly mots: Mot[] = [
    { persan: 'بازار', translit: 'bāzār', sens: 'le marché' },
    { persan: 'قالی', translit: 'ghāli', sens: 'le tapis' },
    { persan: 'گنج', translit: 'ganj', sens: 'le trésor' }
  ];

  /** La porte du rocher. */
  protected readonly ouvert = signal(false);

  protected basculerPorte(): void {
    this.ouvert.update((o) => !o);
  }

  /** Les quarante jarres : 0 = fermée, 1 = une voix chuchote, 2 = couvercle scellé. */
  protected readonly jarres = signal<number[]>(Array.from({ length: 40 }, () => 0));
  protected readonly scellees = computed(() => this.jarres().filter((j) => j === 2).length);
  protected readonly parole = signal('Une cour, une nuit, quarante jarres. Touche-en une.');

  protected touche(i: number): void {
    const etat = this.jarres()[i];
    if (etat === 2) return;
    this.jarres.update((liste) => liste.map((v, n) => (n === i ? v + 1 : v)));
    if (etat === 0) {
      this.parole.set('Une voix chuchote dans la jarre : « Est-ce l’heure ? »  Morgiane répond tout bas : « Pas encore. »');
    } else {
      this.parole.set(this.scellees() >= 40 ? 'Plus un bruit. Toutes les jarres sont scellées : la garde peut entrer.' : 'Le couvercle est fermé, la corde serrée. Il en reste ' + (40 - this.scellees()) + '.');
    }
  }

  protected recommencer(): void {
    this.jarres.set(Array.from({ length: 40 }, () => 0));
    this.parole.set('Une cour, une nuit, quarante jarres. Touche-en une.');
  }

  protected readonly rangs = Array.from({ length: 5 }, (_, r) => Array.from({ length: 8 }, (_, c) => r * 8 + c));
}
