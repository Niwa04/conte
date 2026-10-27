import { Component, computed, signal } from '@angular/core';
import { Apparition } from '../../../shared/apparition';
import { FicheConteBloc } from '../../../shared/fiche-conte';
import { PageConteMonde } from '../../../shared/page-conte-monde';
import { PersonnagesConte } from '../../../shared/personnages-conte';

interface Mot {
  geez: string;
  roman: string;
  prononce: string;
  sens: string;
}

interface Enigme {
  question: string;
  choix: string[];
  bonne: number;
  explication: string;
}

/**
 * Page de La Reine de Saba (Éthiopie).
 * Parti pris : la nuit étoilée de Makeda. Chaque énigme résolue allume une étoile ;
 * trois étoiles allumées, la constellation de la reine apparaît.
 */
@Component({
  selector: 'app-conte-la-reine-de-saba',
  imports: [Apparition, PersonnagesConte, FicheConteBloc],
  templateUrl: './conte-la-reine-de-saba.html',
  styleUrl: './conte-la-reine-de-saba.scss'
})
export default class ConteSaba extends PageConteMonde {
  protected readonly mots: Mot[] = [
    { geez: 'ንግሥት', roman: 'nigist', prononce: 'ni-guist', sens: 'la reine' },
    { geez: 'ኮከብ', roman: 'kokeb', prononce: 'ko-kèb', sens: 'l’étoile' },
    { geez: 'ሰላም', roman: 'selam', prononce: 'sé-lam', sens: 'la paix, bonjour' }
  ];

  protected readonly enigmes: Enigme[] = [
    { question: 'Qu’est-ce qui est toujours devant toi, mais que tu ne peux jamais voir ?', choix: ['Ton ombre', 'Demain', 'Le vent'], bonne: 1, explication: 'Demain est toujours devant nous, mais personne ne l’a encore vu. Le roi Salomon a répondu sans hésiter.' },
    { question: 'Qu’est-ce qui grandit quand on le partage ?', choix: ['Un gâteau', 'Un secret', 'La joie'], bonne: 2, explication: 'La joie : plus on la donne, plus elle grandit. Makeda a applaudi cette réponse.' },
    { question: 'Plus j’en prends, plus j’en laisse derrière moi. Qu’est-ce que c’est ?', choix: ['Des pas', 'De l’eau', 'Des chameaux'], bonne: 0, explication: 'Des pas : chaque pas qu’on fait en laisse un de plus derrière soi, comme la caravane dans le sable.' }
  ];

  protected readonly index = signal(0);
  protected readonly trouvees = signal(0);
  protected readonly resolue = signal(false);
  protected readonly essai = signal<number | null>(null);

  protected readonly enigme = computed(() => this.enigmes[this.index()]);
  protected readonly fini = computed(() => this.trouvees() === this.enigmes.length);

  protected repondre(i: number): void {
    if (this.resolue()) return;
    this.essai.set(i);
    if (i === this.enigme().bonne) {
      this.resolue.set(true);
      this.trouvees.update((n) => n + 1);
    }
  }

  protected suivante(): void {
    if (this.index() < this.enigmes.length - 1) {
      this.index.update((n) => n + 1);
      this.resolue.set(false);
      this.essai.set(null);
    }
  }

  protected recommencer(): void {
    this.index.set(0);
    this.trouvees.set(0);
    this.resolue.set(false);
    this.essai.set(null);
  }
}
