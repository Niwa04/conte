import { Component, OnInit, signal } from '@angular/core';
import { CatalogueService, type CarteCollection } from '../../core/catalogue.service';
import { dateLongue } from '../../core/dates';

/** Les cartes obtenues par le compte. Les images sont protégées : on les télécharge avec le jeton. */
@Component({
  selector: 'app-espace-collection',
  templateUrl: './collection.html',
  styleUrl: './collection.scss'
})
export class EspaceCollection implements OnInit {
  protected readonly images = signal<Record<string, string>>({});
  protected readonly echecs = signal<Record<string, true>>({});

  constructor(protected readonly donnees: CatalogueService) {}

  async ngOnInit(): Promise<void> {
    await this.donnees.charger();
    for (const carte of this.donnees.cartes()) void this.chargerImage(carte);
  }

  protected date(carte: CarteCollection): string {
    return dateLongue(carte.acquired_at);
  }

  private async chargerImage(carte: CarteCollection): Promise<void> {
    try {
      const url = await this.donnees.imageCarte(carte);
      this.images.update((m) => ({ ...m, [carte.item_id]: url }));
    } catch {
      this.echecs.update((m) => ({ ...m, [carte.item_id]: true }));
    }
  }
}
