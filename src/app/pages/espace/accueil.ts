import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogueService } from '../../core/catalogue.service';
import { dateLongue } from '../../core/dates';

/** Tableau de bord : le résumé du compte, avec un lien vers chaque rubrique. */
@Component({
  selector: 'app-espace-accueil',
  imports: [RouterLink],
  template: `
    <h1 class="espace-titre">Mon espace</h1>

    <div class="resume">
      <a class="panneau panneau--lien" routerLink="/compte/abonnement">
        <p class="panneau__etiquette">Abonnement</p>
        @if (donnees.chargement() && !donnees.catalogue()) {
          <p class="panneau__valeur">…</p>
        } @else if (donnees.catalogue()?.has_subscription) {
          <p class="panneau__valeur">Actif</p>
          @if (fin()) { <p class="panneau__detail">Période en cours jusqu’au {{ fin() }}</p> }
        } @else {
          <p class="panneau__valeur">Aucun</p>
          <p class="panneau__detail">Pas d’abonnement actif</p>
        }
      </a>

      <a class="panneau panneau--lien" routerLink="/compte/contes">
        <p class="panneau__etiquette">Mes contes</p>
        @if (donnees.chargement() && !donnees.catalogue()) {
          <p class="panneau__valeur">…</p>
        } @else {
          <p class="panneau__valeur">{{ donnees.contesAccessibles().length }}</p>
          <p class="panneau__detail">accessibles sur {{ donnees.contes().length }} dans la bibliothèque</p>
        }
      </a>

      <a class="panneau panneau--lien" routerLink="/compte/collection">
        <p class="panneau__etiquette">Collection</p>
        @if (donnees.chargement() && !donnees.catalogue()) {
          <p class="panneau__valeur">…</p>
        } @else {
          <p class="panneau__valeur">{{ donnees.cartes().length }}</p>
          <p class="panneau__detail">{{ donnees.cartes().length > 1 ? 'cartes obtenues' : 'carte obtenue' }}</p>
        }
      </a>
    </div>
  `,
  styles: `
    .resume { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.2rem; }
  `
})
export class EspaceAccueil {
  protected readonly fin = computed(() => dateLongue(this.donnees.catalogue()?.current_period_end));

  constructor(protected readonly donnees: CatalogueService) {}
}
