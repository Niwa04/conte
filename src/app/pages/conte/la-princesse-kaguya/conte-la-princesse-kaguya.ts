import { Component, computed, signal } from '@angular/core';
import { Apparition } from '../../../shared/apparition';
import { FicheConteBloc } from '../../../shared/fiche-conte';
import { PageConteMonde } from '../../../shared/page-conte-monde';
import { PersonnagesConte } from '../../../shared/personnages-conte';

interface Mot {
  kanji: string;
  romaji: string;
  prononce: string;
  sens: string;
}

interface PhaseLune {
  seuil: number;
  nom: string;
  titre: string;
  texte: string;
  page: number;
}

/**
 * Page de La Princesse Kaguya (Japon).
 * Parti pris : la lune. Un curseur fait grandir la lune du noir à la pleine lune,
 * et chaque phase raconte un moment du conte, jusqu'à la nuit du départ.
 */
@Component({
  selector: 'app-conte-la-princesse-kaguya',
  imports: [Apparition, PersonnagesConte, FicheConteBloc],
  templateUrl: './conte-la-princesse-kaguya.html',
  styleUrl: './conte-la-princesse-kaguya.scss'
})
export default class ConteKaguya extends PageConteMonde {
  protected readonly mots: Mot[] = [
    { kanji: '月', romaji: 'tsuki', prononce: 'tsou-ki', sens: 'la lune' },
    { kanji: '竹', romaji: 'take', prononce: 'ta-ké', sens: 'le bambou' },
    { kanji: '姫', romaji: 'hime', prononce: 'hi-mé', sens: 'la princesse' }
  ];

  protected readonly phases: PhaseLune[] = [
    { seuil: 0, nom: 'Nouvelle lune', titre: 'Un bambou qui brille', texte: 'Le ciel est noir, et pourtant une tige éclaire la forêt. À l’intérieur, une enfant minuscule sourit au vieux coupeur.', page: 2 },
    { seuil: 25, nom: 'Premier croissant', titre: 'Une petite fille à la maison', texte: 'Elle reçoit un nom, Kaguya, et grandit avec une vitesse étonnante. La maison de bambou ne s’est jamais autant remplie de rires.', page: 3 },
    { seuil: 50, nom: 'Premier quartier', titre: 'Cinq tâches impossibles', texte: 'Cinq princes la réclament. Pour qu’ils renoncent, Kaguya leur demande cinq trésors qui n’existent pas. Elle ne se moque d’aucun.', page: 6 },
    { seuil: 75, nom: 'Lune presque pleine', titre: 'Un secret trop lourd', texte: 'Chaque soir, Kaguya regarde la lune et pleure. Elle finit par dire la vérité à ceux qui l’ont élevée.', page: 8 },
    { seuil: 100, nom: 'Pleine lune', titre: 'La nuit du départ', texte: 'Une lumière descend du ciel, plus forte que tous les gardes. Kaguya doit rentrer chez elle, mais elle laisse un cadeau derrière elle.', page: 12 }
  ];

  /** Avancement de la lune, de 0 (nouvelle lune) à 100 (pleine lune). */
  protected readonly phase = signal(0);
  protected readonly etape = computed(() => {
    const p = this.phase();
    let e = 0;
    this.phases.forEach((ph, i) => { if (p >= ph.seuil - 12) e = i; });
    return e;
  });
  protected readonly courante = computed(() => this.phases[this.etape()]);

  protected regler(ev: Event): void {
    this.phase.set(Number((ev.target as HTMLInputElement).value));
  }

  protected aller(i: number): void {
    this.phase.set(this.phases[i].seuil);
  }
}
