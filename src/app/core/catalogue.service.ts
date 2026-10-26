import { Injectable, computed, signal } from '@angular/core';
import { AuthService } from './auth.service';

export interface ConteCatalogue {
  id: string;
  title: string;
  age_range: string | null;
  reading_minutes: number | null;
  description: string | null;
  cover_url: string | null;
  access_model: 'free' | 'subscription' | 'one_time_purchase' | 'subscription_or_purchase';
  has_full_access: boolean;
  owned: boolean;
}

export interface CarteCollection {
  item_id: string;
  name: string;
  image_url: string;
  acquired_at: string;
}

export interface Catalogue {
  authenticated: boolean;
  has_subscription: boolean;
  subscription_status: string;
  current_period_end: string;
  owned_collection_cards: CarteCollection[];
  stories: ConteCatalogue[];
}

export interface ProgressionConte {
  story_id: string;
  last_page_number: number;
  completed_at: string | null;
}

/**
 * Données du compte, lues avec les mêmes fonctions Supabase que l'application Unity
 * (reader-catalog) : le site affiche donc exactement ce que voit l'application.
 */
@Injectable({ providedIn: 'root' })
export class CatalogueService {
  readonly catalogue = signal<Catalogue | null>(null);
  readonly progressions = signal<Record<string, ProgressionConte>>({});
  readonly erreur = signal<string | null>(null);
  readonly chargement = signal(false);

  readonly contes = computed(() => this.catalogue()?.stories ?? []);
  readonly contesAccessibles = computed(() => this.contes().filter((c) => c.has_full_access));
  readonly cartes = computed(() => this.catalogue()?.owned_collection_cards ?? []);

  private envoi?: Promise<void>;
  private readonly imagesCartes = new Map<string, Promise<string>>();

  constructor(private readonly auth: AuthService) {}

  charger(): Promise<void> {
    return (this.envoi ??= this.lire().finally(() => (this.envoi = undefined)));
  }

  /** Image d'une carte : protégée par le compte, donc téléchargée avec le jeton. */
  imageCarte(carte: CarteCollection): Promise<string> {
    let image = this.imagesCartes.get(carte.item_id);
    if (!image) {
      image = this.auth.telechargerProtege(carte.image_url);
      this.imagesCartes.set(carte.item_id, image);
    }
    return image;
  }

  private async lire(): Promise<void> {
    this.chargement.set(true);
    this.erreur.set(null);
    try {
      const client = await this.auth.obtenirClient();
      this.catalogue.set(await this.auth.appelerFonction<Catalogue>('reader-catalog'));

      // Progression : lecture de ses propres lignes uniquement. Une erreur ici n'empêche pas l'affichage.
      const utilisateur = this.auth.utilisateur();
      if (utilisateur) {
        const { data: lignes } = await client
          .from('reader_story_progress')
          .select('story_id,last_page_number,completed_at')
          .eq('reader_id', utilisateur.id);
        this.progressions.set(Object.fromEntries((lignes ?? []).map((l) => [l.story_id, l as ProgressionConte])));
      }
    } catch {
      this.erreur.set('Impossible de charger tes contes pour le moment. Réessaie dans un instant.');
    } finally {
      this.chargement.set(false);
    }
  }
}
