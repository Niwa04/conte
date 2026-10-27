import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { Apparition } from '../../../shared/apparition';
import { FicheConteBloc } from '../../../shared/fiche-conte';
import { PageConteMonde } from '../../../shared/page-conte-monde';
import { PersonnagesConte } from '../../../shared/personnages-conte';

interface Mot {
  hanzi: string;
  pinyin: string;
  prononce: string;
  sens: string;
}

type Etat = 'attente' | 'saut' | 'piliers' | 'retour';

/**
 * Page du Roi des Singes (Chine).
 * Parti pris : la paume du Bouddha. On lance le saut du nuage ; Wukong atteint cinq piliers rouges
 * au bout du monde, écrit son nom… et découvre que c'étaient les doigts du Bouddha.
 */
@Component({
  selector: 'app-conte-le-roi-des-singes',
  imports: [Apparition, PersonnagesConte, FicheConteBloc],
  templateUrl: './conte-le-roi-des-singes.html',
  styleUrl: './conte-le-roi-des-singes.scss'
})
export default class ConteSinges extends PageConteMonde {
  private readonly destroyRef = inject(DestroyRef);
  private minuteries: ReturnType<typeof setTimeout>[] = [];

  protected readonly mots: Mot[] = [
    { hanzi: '猴', pinyin: 'hóu', prononce: 'hô', sens: 'le singe' },
    { hanzi: '云', pinyin: 'yún', prononce: 'yun', sens: 'le nuage' },
    { hanzi: '山', pinyin: 'shān', prononce: 'chann', sens: 'la montagne' }
  ];

  protected readonly etat = signal<Etat>('attente');
  protected readonly occupe = computed(() => this.etat() === 'saut' || this.etat() === 'piliers');
  protected readonly message = computed(() => {
    switch (this.etat()) {
      case 'saut': return 'Wukong file sur son nuage. Les étoiles deviennent des traînées de lumière…';
      case 'piliers': return 'Cinq grands piliers rouges ! « Voilà le bout du monde ! » Il y laisse son nom, pour preuve.';
      case 'retour': return 'Surprise : l’inscription est sur le doigt du Bouddha. Wukong n’a jamais quitté sa paume. Les piliers, c’étaient ses doigts.';
      default: return 'Le Bouddha propose un défi : « Si tu sautes hors de ma main, le Ciel est à toi. » Wukong éclate de rire. Cette main est si petite !';
    }
  });

  constructor() {
    super();
    this.destroyRef.onDestroy(() => this.minuteries.forEach((m) => clearTimeout(m)));
  }

  protected sauter(): void {
    if (this.occupe()) return;
    this.etat.set('saut');
    this.minuteries.push(setTimeout(() => this.etat.set('piliers'), 1700));
    this.minuteries.push(setTimeout(() => this.etat.set('retour'), 3900));
  }

  protected recommencer(): void {
    this.minuteries.forEach((m) => clearTimeout(m));
    this.minuteries = [];
    this.etat.set('attente');
  }
}
