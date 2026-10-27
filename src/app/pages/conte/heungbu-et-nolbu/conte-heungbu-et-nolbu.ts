import { Component, signal } from '@angular/core';
import { Apparition } from '../../../shared/apparition';
import { FicheConteBloc } from '../../../shared/fiche-conte';
import { PageConteMonde } from '../../../shared/page-conte-monde';
import { PersonnagesConte } from '../../../shared/personnages-conte';

interface Mot {
  hangeul: string;
  romanisation: string;
  sens: string;
}

interface Courge {
  id: 'heungbu' | 'nolbu';
  titre: string;
  coups: number;
  page: number;
  ouverture: string;
  fermee: string;
}

/**
 * Page de Heungbu et Nolbu (Corée).
 * Parti pris : le papier hanji et les cinq couleurs coréennes, une hirondelle qui traverse la page,
 * et deux courges à scier, comme dans le pansori : l'une pour la bonté, l'autre pour l'avidité.
 */
@Component({
  selector: 'app-conte-heungbu-et-nolbu',
  imports: [Apparition, PersonnagesConte, FicheConteBloc],
  templateUrl: './conte-heungbu-et-nolbu.html',
  styleUrl: './conte-heungbu-et-nolbu.scss'
})
export default class ConteHeungbuEtNolbu extends PageConteMonde {
  protected readonly mots: Mot[] = [
    { hangeul: '박', romanisation: 'bak', sens: 'la courge, la calebasse' },
    { hangeul: '제비', romanisation: 'jebi', sens: 'l’hirondelle' },
    { hangeul: '한지', romanisation: 'hanji', sens: 'le papier de mûrier' }
  ];

  /** Deux courges à scier : trois allers-retours de scie, puis elles s'ouvrent. */
  protected readonly courges = signal<Courge[]>([
    { id: 'heungbu', titre: 'La courge de Heungbu', coups: 0, page: 6, ouverture: 'Une lumière dorée : du riz, des pièces et des soieries colorées. La bonté a fait fleurir la cour.', fermee: 'Elle a poussé là où l’hirondelle a laissé sa graine.' },
    { id: 'nolbu', titre: 'La courge de Nolbu', coups: 0, page: 9, ouverture: 'Une fumée violette et des lutins moqueurs : l’avidité n’a pas apporté que de l’or.', fermee: 'Nolbu l’a fait pousser en espérant le même cadeau.' }
  ]);

  protected scier(index: number): void {
    this.courges.update((liste) => liste.map((c, i) => (i === index && c.coups < 3 ? { ...c, coups: c.coups + 1 } : c)));
  }

  protected recommencer(): void {
    this.courges.update((liste) => liste.map((c) => ({ ...c, coups: 0 })));
  }

  protected touchee(): boolean {
    return this.courges().some((c) => c.coups > 0);
  }
}
