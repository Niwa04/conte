import { Directive, inject, input } from '@angular/core';
import { PwaService } from '../core/pwa.service';
import { type FicheConte } from '../data/contes';
import { APP_URL } from '../site.config';

/** Base des pages de contes du monde à design propre : données du conte, fonds illustrés, bouton d'installation. */
@Directive()
export abstract class PageConteMonde {
  readonly conte = input.required<FicheConte>();
  protected readonly appUrl = APP_URL;
  private readonly pwa = inject(PwaService);

  protected installer(): void {
    void this.pwa.installer();
  }

  /** Illustration du conte (page n) utilisée comme fond de section : url(…) pour [style.--fond]. */
  protected fond(page: number): string {
    return `url(assets/contes/${this.conte().slug}/pages/p${page < 10 ? '0' : ''}${page}.webp)`;
  }

  /** Chemin de l'illustration (page n) pour un <img>. */
  protected page(n: number): string {
    return `assets/contes/${this.conte().slug}/pages/p${n < 10 ? '0' : ''}${n}.webp`;
  }

  /** Décor créé pour le conte (dossier deco/) : url(…) pour [style.--fond]. */
  protected deco(nom: string): string {
    return `url(assets/contes/${this.conte().slug}/deco/${nom}.webp)`;
  }

  /** Chemin d'une image du conte (personnage, décor créé…). */
  protected chemin(fichier: string): string {
    return `assets/contes/${this.conte().slug}/${fichier}`;
  }
}
