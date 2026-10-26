import { Component, computed } from '@angular/core';
import { CatalogueService } from '../../core/catalogue.service';
import { dateLongue } from '../../core/dates';
import { APP_URL, FORMULES } from '../../site.config';

/** L'abonnement du compte, en consultation. */
@Component({
  selector: 'app-espace-abonnement',
  templateUrl: './abonnement.html',
  styleUrl: './abonnement.scss'
})
export class EspaceAbonnement {
  protected readonly appUrl = APP_URL;
  protected readonly formule = FORMULES.find((f) => f.mise_en_avant) ?? FORMULES[0];

  protected readonly fin = computed(() => dateLongue(this.donnees.catalogue()?.current_period_end));
  protected readonly statut = computed(() =>
    this.donnees.catalogue()?.subscription_status?.toLowerCase() === 'trialing' ? 'Période d’essai' : 'Actif'
  );

  constructor(protected readonly donnees: CatalogueService) {}
}
