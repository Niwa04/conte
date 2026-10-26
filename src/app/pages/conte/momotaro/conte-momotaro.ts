import { Component, input, output, signal } from '@angular/core';
import { type FicheConte } from '../../../data/contes';
import { Apparition } from '../../../shared/apparition';
import { FicheConteBloc } from '../../../shared/fiche-conte';
import { PersonnagesConte } from '../../../shared/personnages-conte';
import { APP_URL } from '../../../site.config';

const DOSSIER = 'assets/contes/momotaro';

interface Convive {
  nom: string;
  image: string;
  titre: string;
  phrase: string;
}

interface Mot {
  kanji: string;
  romaji: string;
  sens: string;
}

/**
 * Page de Momotarō (Japon).
 * Parti pris : le papier washi, les vagues seigaiha, le soleil rouge et les cerisiers du Japon ;
 * et une table qui se remplit à chaque boulette partagée, comme dans le conte.
 */
@Component({
  selector: 'app-conte-momotaro',
  imports: [Apparition, PersonnagesConte, FicheConteBloc],
  templateUrl: './conte-momotaro.html',
  styleUrl: './conte-momotaro.scss'
})
export class ConteMomotaro {
  readonly conte = input.required<FicheConte>();
  readonly installer = output<void>();

  protected readonly appUrl = APP_URL;

  /** Illustration du conte utilisée comme fond de section (assombrie ou éclaircie par le SCSS). */
  protected fond(page: number): string {
    return `url(${DOSSIER}/pages/p${page < 10 ? '0' : ''}${page}.webp)`;
  }

  protected readonly petales = Array.from({ length: 16 }, (_, i) => ({
    gauche: (i * 37 + 11) % 100,
    delai: (i * 1.7) % 12,
    duree: 11 + ((i * 5) % 7),
    taille: 10 + ((i * 3) % 9),
    deriveX: (i % 2 ? 1 : -1) * (30 + ((i * 13) % 70))
  }));

  protected readonly mots: Mot[] = [
    { kanji: '桃', romaji: 'momo', sens: 'la pêche' },
    { kanji: '鬼', romaji: 'oni', sens: 'les géants cornus' },
    { kanji: '団子', romaji: 'dango', sens: 'les boulettes sucrées' }
  ];

  protected readonly parents = [
    { nom: 'La mère', image: `${DOSSIER}/personnages/mere.webp` },
    { nom: 'Le père', image: `${DOSSIER}/personnages/pere.webp` }
  ];

  /** Convives de la table, dans l'ordre où ils arrivent. */
  protected readonly convives: Convive[] = [
    { nom: 'Momotarō', image: `${DOSSIER}/personnages/momotaro.webp`, titre: 'Un enfant né d’une pêche', phrase: 'Trois bols sur la table : la place vide ne l’est plus.' },
    { nom: 'Le chien', image: `${DOSSIER}/personnages/chien.webp`, titre: 'Une boulette, un compagnon', phrase: 'Le chien propose un marché : si Momotarō partage son repas, il partagera aussi le danger.' },
    { nom: 'Le singe', image: `${DOSSIER}/personnages/singe.webp`, titre: 'Un grimpeur affamé', phrase: 'Le singe grimpe mieux que n’importe quel Oni. Il reste peu de boulettes, alors on les partage en plus petit.' },
    { nom: 'Le faisan', image: `${DOSSIER}/personnages/faisan.webp`, titre: 'Des yeux au-dessus des murs', phrase: 'Le faisan voit ce qui se cache derrière les murs de la forteresse. Plus personne n’est seul.' }
  ];

  /** Étape de la table : 0 = place vide, 4 = six bols. */
  protected readonly etape = signal(0);

  protected partager(): void {
    this.etape.update((e) => (e >= this.convives.length ? 0 : e + 1));
  }
}
