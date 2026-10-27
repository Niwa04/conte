import { Component, computed, signal } from '@angular/core';
import { Apparition } from '../../../shared/apparition';
import { FicheConteBloc } from '../../../shared/fiche-conte';
import { PageConteMonde } from '../../../shared/page-conte-monde';
import { PersonnagesConte } from '../../../shared/personnages-conte';

interface Mot {
  syllabes: string;
  roman: string;
  prononce: string;
  sens: string;
}

interface Noeud {
  x: number;
  y: number;
  animal: 'poisson' | 'phoque' | 'morse' | 'baleine';
  nom: string;
}

/**
 * Page de Sedna (Arctique, légende inuit).
 * Parti pris : le peigne. Quatre nœuds dans les cheveux de Sedna ; on les défait un à un, doucement
 * (un geste trop vite et « elle demande de ralentir »), et les animaux marins reviennent près du palais.
 */
@Component({
  selector: 'app-conte-sedna-la-gardienne-des-profondeurs',
  imports: [Apparition, PersonnagesConte, FicheConteBloc],
  templateUrl: './conte-sedna-la-gardienne-des-profondeurs.html',
  styleUrl: './conte-sedna-la-gardienne-des-profondeurs.scss'
})
export default class ConteSedna extends PageConteMonde {
  protected readonly mots: Mot[] = [
    { syllabes: 'ᓯᑯ', roman: 'siku', prononce: 'si-kou', sens: 'la glace' },
    { syllabes: 'ᐃᒪᖅ', roman: 'imaq', prononce: 'i-mak', sens: 'la mer' },
    { syllabes: 'ᖃᔭᖅ', roman: 'qajaq', prononce: 'ka-yak', sens: 'le kayak' }
  ];

  protected readonly noeuds: Noeud[] = [
    { x: 330, y: 190, animal: 'poisson', nom: 'un banc de poissons' },
    { x: 470, y: 260, animal: 'phoque', nom: 'un phoque' },
    { x: 600, y: 190, animal: 'morse', nom: 'un morse' },
    { x: 720, y: 280, animal: 'baleine', nom: 'une baleine' }
  ];

  protected readonly defaits = signal<number[]>([]);
  protected readonly doucement = signal(false);
  protected readonly termine = computed(() => this.defaits().length === this.noeuds.length);
  protected readonly message = computed(() => {
    if (this.termine()) return '« Vous pouvez remonter. » Les animaux franchissent l’arche et regagnent la mer. Sedna sourit un peu : ses cheveux flottent enfin librement.';
    if (this.doucement()) return '« Doucement », demande Sedna. Il faut laisser un instant avant de défaire le nœud suivant.';
    const n = this.defaits().length;
    return n === 0
      ? 'Les cheveux de Sedna sont pleins de nœuds, et ses mains blessées ne peuvent pas les défaire. Touche un nœud avec précaution.'
      : `Un nœud de moins : ${this.noeuds[this.defaits()[n - 1]].nom} revient près du palais. Continue, sans tirer.`;
  });

  private dernier = 0;
  private minuterie: ReturnType<typeof setTimeout> | null = null;

  protected estDefait(i: number): boolean {
    return this.defaits().includes(i);
  }

  protected defaire(i: number): void {
    if (this.estDefait(i) || this.termine()) return;
    const maintenant = Date.now();
    if (maintenant - this.dernier < 900) {
      this.doucement.set(true);
      if (this.minuterie !== null) clearTimeout(this.minuterie);
      this.minuterie = setTimeout(() => this.doucement.set(false), 1600);
      return;
    }
    this.dernier = maintenant;
    this.doucement.set(false);
    this.defaits.update((l) => [...l, i]);
  }

  protected recommencer(): void {
    this.defaits.set([]);
    this.doucement.set(false);
    this.dernier = 0;
  }
}
