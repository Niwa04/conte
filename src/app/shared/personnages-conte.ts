import { Component, input, signal } from '@angular/core';
import { type PersonnageConte } from '../data/contes';

/**
 * Personnages d'un conte : on en choisit un pour le voir en grand, lire qui il est
 * et savoir qui lui prête sa voix. L'habillage se règle par variables CSS :
 * --pc-fond, --pc-texte, --pc-accent, --pc-bord, --pc-vignette (rayon des vignettes).
 */
@Component({
  selector: 'app-personnages-conte',
  template: `
    <div class="onglets" role="tablist" aria-label="Personnages du conte" (keydown)="naviguer($event)">
      @for (p of personnages(); track p.nom; let n = $index) {
        <button
          type="button"
          role="tab"
          class="onglet"
          [id]="idBase() + '-onglet-' + n"
          [attr.aria-selected]="choix() === n"
          [attr.aria-controls]="idBase() + '-panneau'"
          [attr.tabindex]="choix() === n ? 0 : -1"
          [class.onglet--actif]="choix() === n"
          (click)="choix.set(n)"
        >
          <img [src]="p.image" alt="" width="120" height="160" loading="lazy">
          <span>{{ p.nom }}</span>
        </button>
      }
    </div>

    @if (personnages()[choix()]; as p) {
      <article class="fiche" [id]="idBase() + '-panneau'" role="tabpanel" [attr.aria-labelledby]="idBase() + '-onglet-' + choix()">
        <img class="fiche__image" [src]="p.image" [alt]="p.alt" width="560" height="747">
        <div class="fiche__texte">
          <p class="fiche__role">{{ p.role }}</p>
          <h3>{{ p.nom }}</h3>
          <p class="fiche__description">{{ p.description }}</p>
          <p class="fiche__voix">
            <svg viewBox="0 0 64 64" aria-hidden="true"><rect x="24" y="6" width="16" height="30" rx="8"/><path d="M14 30c0 11 8 18 18 18s18-7 18-18M32 48v10M22 58h20"/></svg>
            <span>Voix : <strong>{{ p.doubleur ?? 'anonyme' }}</strong></span>
          </p>
        </div>
      </article>
    }
  `,
  styles: `
    :host { display: block; color: var(--pc-texte, #fff); }

    .onglets { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.8rem; margin: 0 0 1.6rem; }
    .onglet {
      display: grid; justify-items: center; gap: 0.35rem;
      width: 96px; padding: 0.4rem 0.3rem 0.5rem;
      border: 3px solid transparent; border-radius: 14px;
      background: rgb(255 255 255 / 0.08); color: inherit; font: inherit; font-size: 0.85rem; font-weight: 700;
      cursor: pointer; transition: transform 0.15s, border-color 0.15s, background 0.15s;
      &:hover { transform: translateY(-3px); }
      &:focus-visible { outline: 3px solid var(--pc-accent, gold); outline-offset: 2px; }
      img { width: 72px; height: 72px; object-fit: cover; object-position: top; border-radius: var(--pc-vignette, 50%); background: rgb(255 255 255 / 0.2); }
    }
    .onglet--actif { border-color: var(--pc-accent, gold); background: rgb(255 255 255 / 0.2); }

    .fiche {
      display: grid; grid-template-columns: minmax(200px, 320px) 1fr; gap: 2rem; align-items: center;
      max-width: 880px; margin: 0 auto; padding: 1.4rem;
      background: var(--pc-fond, rgb(0 0 0 / 0.45));
      border: 3px solid var(--pc-bord, var(--pc-accent, gold));
      border-radius: var(--pc-rayon, 14px);
      box-shadow: 0 18px 34px rgb(0 0 0 / 0.4);
      animation: entree 0.35s ease;
    }
    .fiche__image { display: block; width: 100%; height: auto; border-radius: calc(var(--pc-rayon, 14px) - 4px); }
    .fiche__role { margin: 0; text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.8rem; font-weight: 700; color: var(--pc-accent, gold); }
    h3 { margin: 0.2rem 0 0.6rem; font-family: var(--police-titre); font-size: clamp(1.7rem, 3vw, 2.3rem); line-height: 1.1; }
    .fiche__description { margin: 0 0 1rem; font-size: 1.1rem; line-height: 1.6; }
    .fiche__voix {
      display: inline-flex; align-items: center; gap: 0.6rem; margin: 0; padding: 0.4rem 0.9rem;
      border-radius: 999px; background: rgb(255 255 255 / 0.12); font-size: 0.95rem;
      svg { width: 20px; height: 20px; fill: none; stroke: var(--pc-accent, gold); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
    }
    @keyframes entree { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
    @media (max-width: 700px) { .fiche { grid-template-columns: 1fr; gap: 1rem; } .fiche__image { max-width: 280px; margin: 0 auto; } }
    @media (prefers-reduced-motion: reduce) { .fiche { animation: none; } .onglet { transition: none; } }
  `
})
export class PersonnagesConte {
  readonly personnages = input.required<PersonnageConte[]>();
  /** Préfixe des id, pour qu'une page puisse en porter plusieurs sans collision. */
  readonly idBase = input('perso');
  protected readonly choix = signal(0);

  /** Flèches gauche/droite : passer d'un personnage à l'autre (comme sur des onglets). */
  protected naviguer(evenement: KeyboardEvent): void {
    const pas = evenement.key === 'ArrowRight' ? 1 : evenement.key === 'ArrowLeft' ? -1 : 0;
    if (!pas) return;
    evenement.preventDefault();
    const total = this.personnages().length;
    const suivant = (this.choix() + pas + total) % total;
    this.choix.set(suivant);
    document.getElementById(`${this.idBase()}-onglet-${suivant}`)?.focus();
  }
}
