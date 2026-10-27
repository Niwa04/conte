import { Component, computed, signal } from '@angular/core';
import { Apparition } from '../../../shared/apparition';
import { FicheConteBloc } from '../../../shared/fiche-conte';
import { PageConteMonde } from '../../../shared/page-conte-monde';
import { PersonnagesConte } from '../../../shared/personnages-conte';

interface Mot {
  hawaien: string;
  prononce: string;
  sens: string;
}

/** Nombre d'heures de soleil dont une étoffe a besoin pour sécher (valeur de jeu, pas une mesure). */
const HEURES_POUR_SECHER = 8;

/**
 * Page de Maui, le héros qui capture le Soleil (Hawaï).
 * Parti pris : le temps du soleil. Avant le marché, il traverse le ciel en six heures et le tapa
 * ne sèche jamais ; après le marché, les journées s'allongent et le tapa sèche.
 */
@Component({
  selector: 'app-conte-maui-le-heros-qui-capture-le-soleil',
  imports: [Apparition, PersonnagesConte, FicheConteBloc],
  templateUrl: './conte-maui-le-heros-qui-capture-le-soleil.html',
  styleUrl: './conte-maui-le-heros-qui-capture-le-soleil.scss'
})
export default class ConteMaui extends PageConteMonde {
  protected readonly mots: Mot[] = [
    { hawaien: 'Lā', prononce: 'laa', sens: 'le soleil' },
    { hawaien: 'Kapa', prononce: 'ka-pa', sens: 'l’étoffe d’écorce' },
    { hawaien: 'Haleakalā', prononce: 'ha-lé-a-ka-laa', sens: 'la maison du soleil' }
  ];

  /** true = après le marché avec le Soleil. */
  protected readonly marche = signal(false);
  /** Avancée dans la journée, de 0 (lever) à 100 (coucher). */
  protected readonly avancee = signal(0);

  protected readonly heuresDeJour = computed(() => (this.marche() ? 12 : 6));
  protected readonly heureEcoulee = computed(() => (this.avancee() / 100) * this.heuresDeJour());
  /** Part de séchage du tapa (0 à 1). */
  protected readonly sec = computed(() => Math.min(1, this.heureEcoulee() / HEURES_POUR_SECHER));
  protected readonly sec100 = computed(() => Math.round(this.sec() * 100));

  /** Position du soleil sur son arc (pourcentages de la scène). */
  protected readonly gauche = computed(() => 6 + 88 * (this.avancee() / 100));
  protected readonly haut = computed(() => 62 - 50 * Math.sin(Math.PI * (this.avancee() / 100)));

  protected readonly verdict = computed(() => {
    if (this.avancee() === 0) return 'Le soleil se lève sur l’île. L’étoffe de Hina, peinte hier, est encore toute humide. Fais avancer le soleil dans le ciel.';
    if (this.sec() >= 1) return 'Le tapa est sec. Hina peut le plier et le ranger. Les couleurs sont plus belles que jamais.';
    if (this.avancee() >= 100) return 'Le soleil se couche et le tapa est encore humide. Il faudra tout recommencer demain.';
    return 'Le tapa sèche, mais lentement. Il faut encore du soleil.';
  });

  protected regler(ev: Event): void {
    this.avancee.set(Number((ev.target as HTMLInputElement).value));
  }

  protected choisir(apres: boolean): void {
    this.marche.set(apres);
    this.avancee.set(0);
  }
}
