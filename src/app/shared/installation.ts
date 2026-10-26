import { Component, inject } from '@angular/core';
import { PwaService } from '../core/pwa.service';

/** Boîte d'aide à l'installation : affichée seulement quand le navigateur ne propose pas l'installation directe. */
@Component({
  selector: 'app-installation',
  template: `
    @if (pwa.aide(); as aide) {
      <div class="voile" (click)="pwa.fermerAide()">
        <section class="boite" role="dialog" aria-modal="true" aria-labelledby="titre-installation" (click)="$event.stopPropagation()" (keydown.escape)="pwa.fermerAide()">
          <h2 id="titre-installation">{{ aide.titre }}</h2>
          <ol>
            @for (etape of aide.etapes; track etape) { <li>{{ etape }}</li> }
          </ol>
          <div class="actions">
            <button type="button" class="bouton bouton--vert bouton--petit" (click)="pwa.ouvrirJeu()">Ouvrir l’application maintenant</button>
            <button type="button" class="bouton bouton--blanc bouton--petit" (click)="pwa.fermerAide()" #fermer>Fermer</button>
          </div>
        </section>
      </div>
    }
  `,
  styles: `
    .voile { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 1rem; background: rgb(4 10 40 / 0.72); backdrop-filter: blur(3px); }
    .boite {
      width: min(100%, 470px);
      padding: 1.8rem 1.8rem 1.5rem;
      border-radius: 18px;
      border: 3px solid var(--mdc-gold);
      background: linear-gradient(var(--mdc-cream), var(--mdc-parchemin));
      color: var(--mdc-ink);
      box-shadow: inset 0 0 0 4px var(--mdc-cream), 0 24px 54px rgb(0 0 0 / 0.55);
    }
    h2 { margin: 0 0 1rem; font-size: 1.5rem; color: var(--mdc-navy); }
    ol { margin: 0 0 1.4rem; padding-left: 1.3rem; line-height: 1.7; font-size: 1.05rem; }
    .actions { display: flex; flex-wrap: wrap; gap: 0.8rem; }
  `
})
export class Installation {
  protected readonly pwa = inject(PwaService);
}
