import { Component, computed, signal } from '@angular/core';
import { CatalogueService, type ConteCatalogue } from '../../core/catalogue.service';
import { APP_URL } from '../../site.config';

type Filtre = 'tous' | 'accessibles' | 'verrouilles';

/** La bibliothèque telle que la voit le compte : contes accessibles, contes à débloquer, avancement. */
@Component({
  selector: 'app-espace-contes',
  templateUrl: './contes.html',
  styleUrl: './contes.scss'
})
export class EspaceContes {
  protected readonly appUrl = APP_URL;
  protected readonly filtre = signal<Filtre>('tous');

  protected readonly filtres: { id: Filtre; libelle: string }[] = [
    { id: 'tous', libelle: 'Tous' },
    { id: 'accessibles', libelle: 'Accessibles' },
    { id: 'verrouilles', libelle: 'À débloquer' }
  ];

  protected readonly liste = computed(() => {
    const contes = this.donnees.contes();
    switch (this.filtre()) {
      case 'accessibles': return contes.filter((c) => c.has_full_access);
      case 'verrouilles': return contes.filter((c) => !c.has_full_access);
      default: return contes;
    }
  });

  constructor(protected readonly donnees: CatalogueService) {}

  protected acces(conte: ConteCatalogue): string {
    if (!conte.has_full_access) return 'À débloquer';
    if (conte.owned) return 'Acheté';
    return conte.access_model === 'free' ? 'Gratuit' : 'Inclus dans l’abonnement';
  }

  protected avancement(conte: ConteCatalogue): string {
    const p = this.donnees.progressions()[conte.id];
    if (!p) return '';
    if (p.completed_at) return 'Terminé';
    return p.last_page_number > 0 ? `En cours · page ${p.last_page_number}` : '';
  }
}
