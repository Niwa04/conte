import { Component, computed, signal } from '@angular/core';
import { Apparition } from '../../../shared/apparition';
import { FicheConteBloc } from '../../../shared/fiche-conte';
import { PageConteMonde } from '../../../shared/page-conte-monde';
import { PersonnagesConte } from '../../../shared/personnages-conte';

interface Mot {
  danois: string;
  prononce: string;
  sens: string;
}

interface Saison {
  nom: string;
  titre: string;
  texte: string;
  decor: string;
  page: number;
}

/**
 * Page du Vilain Petit Canard (Danemark).
 * Parti pris : les quatre saisons de l'étang. Un curseur fait passer de l'été au printemps ;
 * au printemps, on se penche sur l'eau et le reflet du caneton change.
 */
@Component({
  selector: 'app-conte-le-vilain-petit-canard',
  imports: [Apparition, PersonnagesConte, FicheConteBloc],
  templateUrl: './conte-le-vilain-petit-canard.html',
  styleUrl: './conte-le-vilain-petit-canard.scss'
})
export default class ConteCanard extends PageConteMonde {
  protected readonly mots: Mot[] = [
    { danois: 'And', prononce: 'an', sens: 'le canard' },
    { danois: 'Svane', prononce: 'svâ-né', sens: 'le cygne' },
    { danois: 'Smuk', prononce: 'smok', sens: 'beau, belle' }
  ];

  protected readonly saisons: Saison[] = [
    { nom: 'Été', titre: 'L’œuf le plus gros', texte: 'Au bord de l’étang, le dernier œuf s’ouvre. Le caneton qui en sort est grand, gris et un peu maladroit. Dans la basse-cour, on se moque déjà de lui.', decor: 'etang', page: 2 },
    { nom: 'Automne', titre: 'Seul dans les roseaux', texte: 'Il s’est enfui. Un soir, de grands oiseaux blancs passent dans le ciel. Il ne sait pas qui ils sont, mais il ne peut pas les oublier.', decor: 'roseaux', page: 6 },
    { nom: 'Hiver', titre: 'L’étang gelé', texte: 'L’eau gèle autour de lui. Un paysan le sauve, mais la peur le fait repartir dans la neige. Il survit comme il peut, jusqu’au bout du froid.', decor: 'hiver', page: 7 },
    { nom: 'Printemps', titre: 'Le reflet', texte: 'Le soleil revient et ses ailes le portent jusqu’à un jardin fleuri. Dans l’eau du bassin, il se penche timidement sur son reflet.', decor: 'printemps', page: 10 }
  ];

  protected readonly indice = signal(0);
  protected readonly regarde = signal(false);
  protected readonly saison = computed(() => this.saisons[this.indice()]);
  protected readonly printemps = computed(() => this.indice() === this.saisons.length - 1);

  protected aller(i: number): void {
    this.indice.set(i);
    if (i !== this.saisons.length - 1) this.regarde.set(false);
  }

  protected regler(ev: Event): void {
    this.aller(Number((ev.target as HTMLInputElement).value));
  }

  protected basculer(): void {
    if (this.printemps()) this.regarde.update((v) => !v);
  }
}
