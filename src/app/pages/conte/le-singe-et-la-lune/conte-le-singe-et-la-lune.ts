import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { Apparition } from '../../../shared/apparition';
import { FicheConteBloc } from '../../../shared/fiche-conte';
import { PageConteMonde } from '../../../shared/page-conte-monde';
import { PersonnagesConte } from '../../../shared/personnages-conte';

interface Mot {
  hindi: string;
  roman: string;
  prononce: string;
  sens: string;
}

type Etat = 'chaine' | 'chute' | 'ciel';

/**
 * Page du Singe et la Lune (Inde).
 * Parti pris : la chaîne de singes. On ajoute un singe à la fois pour atteindre le reflet dans le puits ;
 * au sixième, la branche casse, et il ne reste qu'à lever la tête.
 */
@Component({
  selector: 'app-conte-le-singe-et-la-lune',
  imports: [Apparition, PersonnagesConte, FicheConteBloc],
  templateUrl: './conte-le-singe-et-la-lune.html',
  styleUrl: './conte-le-singe-et-la-lune.scss'
})
export default class ConteSingeLune extends PageConteMonde {
  private readonly destroyRef = inject(DestroyRef);
  private minuterie: ReturnType<typeof setTimeout> | null = null;

  protected readonly mots: Mot[] = [
    { hindi: 'चाँद', roman: 'chānd', prononce: 'tchând', sens: 'la lune' },
    { hindi: 'बंदर', roman: 'bandar', prononce: 'ban-dar', sens: 'le singe' },
    { hindi: 'कुआँ', roman: 'kuān', prononce: 'kou-ân', sens: 'le puits' }
  ];

  protected readonly maximum = 6;
  protected readonly maillons = signal(1);
  protected readonly etat = signal<Etat>('chaine');
  protected readonly liste = computed(() => Array.from({ length: this.maillons() }, (_, i) => i));
  protected readonly inclinaison = computed(() => (this.maillons() - 1) * 2.2);
  protected readonly message = computed(() => {
    switch (this.etat()) {
      case 'chute': return 'Crac ! La branche se brise et toute la troupe dégringole, en tas, dans les feuilles.';
      case 'ciel': return 'Regardez ! La Lune est là-haut, dans le ciel, à sa place. Dans le puits, ce n’était que son reflet.';
      default:
        return this.maillons() === 1
          ? 'La Lune brille au fond du puits. Dadi s’accroche à la branche. Qui veut l’aider à descendre jusqu’à l’eau ?'
          : this.maillons() < this.maximum
            ? `${this.maillons()} singes sont accrochés. La branche grince un peu. Encore un petit effort…`
            : 'Le dernier singe est tout près de l’eau. La branche craque…';
    }
  });

  constructor() {
    super();
    this.destroyRef.onDestroy(() => this.effacer());
  }

  protected ajouter(): void {
    if (this.etat() !== 'chaine') return;
    const n = this.maillons() + 1;
    this.maillons.set(n);
    if (n >= this.maximum) {
      this.minuterie = setTimeout(() => {
        this.etat.set('chute');
        this.minuterie = setTimeout(() => this.etat.set('ciel'), 1800);
      }, 700);
    }
  }

  protected recommencer(): void {
    this.effacer();
    this.maillons.set(1);
    this.etat.set('chaine');
  }

  private effacer(): void {
    if (this.minuterie !== null) clearTimeout(this.minuterie);
    this.minuterie = null;
  }
}
