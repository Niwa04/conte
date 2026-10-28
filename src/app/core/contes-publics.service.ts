import { Injectable, signal } from '@angular/core';

export interface ContePublic {
  id: string;
  /** « story » pour un conte, « anthology » pour un recueil (affiché comme un conte). */
  kind: 'story' | 'anthology';
  title: string;
  /** Catégorie du conte dans le studio : classique, enfant, original, monde… */
  category: string;
  /** Couverture à plat (toujours présente). */
  cover_url: string;
  /** Couverture 3D / perspective, quand elle existe : c'est elle qu'on affiche dans la liste. */
  cover_perspective_url?: string | null;
  /** Tranche / dos du livre, quand elle existe. */
  cover_spine_url?: string | null;
  /** Chemin du site (/contes/…) ou lien http(s) ; null tant qu'aucune page de présentation n'est renseignée. */
  presentation_url: string | null;
}

/** Catégorie définie dans le studio (table story_categories), dans son ordre d'affichage. */
export interface CategoriePublique {
  slug: string;
  label: string;
}

/**
 * Contes du studio qui ont une image de couverture, lus avec la fonction publique « public-stories »
 * (même projet Supabase que le studio) : aucun compte n'est nécessaire pour afficher la liste.
 */
@Injectable({ providedIn: 'root' })
export class ContesPublicsService {
  readonly contes = signal<ContePublic[]>([]);
  readonly categories = signal<CategoriePublique[]>([]);
  readonly chargement = signal(false);
  readonly erreur = signal<string | null>(null);
  readonly charge = signal(false);

  private envoi?: Promise<void>;

  charger(): Promise<void> {
    return (this.envoi ??= this.lire().finally(() => (this.envoi = undefined)));
  }

  private async lire(): Promise<void> {
    this.chargement.set(true);
    this.erreur.set(null);
    try {
      const configuration = await fetch('/app-config.json', { cache: 'no-store' });
      if (!configuration.ok) throw new Error('La configuration du site est introuvable.');
      const { supabaseUrl, supabasePublishableKey } = (await configuration.json()) as { supabaseUrl?: string; supabasePublishableKey?: string };
      if (!supabaseUrl) throw new Error('La configuration du site est incomplète.');

      const reponse = await fetch(`${supabaseUrl.replace(/\/$/, '')}/functions/v1/public-stories`, {
        headers: supabasePublishableKey ? { apikey: supabasePublishableKey } : {}
      });
      if (!reponse.ok) throw new Error(`Liste des contes indisponible (erreur ${reponse.status}).`);
      const { stories, categories } = (await reponse.json()) as { stories?: ContePublic[]; categories?: CategoriePublique[] };
      this.contes.set((stories ?? []).filter((conte) => !!conte.cover_url));
      this.categories.set(categories ?? []);
      this.charge.set(true);
    } catch (erreur) {
      this.erreur.set(erreur instanceof Error ? erreur.message : 'Impossible de charger les contes.');
    } finally {
      this.chargement.set(false);
    }
  }
}
