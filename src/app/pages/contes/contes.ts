import { Component, OnInit, computed, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ContesPublicsService, type ContePublic } from '../../core/contes-publics.service';
import { PwaService } from '../../core/pwa.service';
import { Lucioles } from '../../shared/lucioles';

/**
 * Liste des contes du studio qui ont une image de couverture.
 * Un clic ouvre l'URL de présentation du conte quand elle est renseignée dans le studio.
 */
@Component({
  selector: 'app-contes',
  imports: [RouterLink, Lucioles],
  templateUrl: './contes.html',
  styleUrl: './contes.scss'
})
export class Contes implements OnInit {
  private readonly pwa = inject(PwaService);
  protected readonly catalogue = inject(ContesPublicsService);

  /** Une section par catégorie du studio (dans son ordre) ; les contes sans catégorie connue passent sous « Autres contes ». */
  protected readonly sections = computed(() => {
    const contes = this.catalogue.contes();
    const categories = this.catalogue.categories();
    const connues = new Set<string>(categories.map((categorie) => categorie.slug));
    const sections: Array<{ cle: string; titre: string; contes: ContePublic[] }> = categories.map(({ slug, label }) => ({
      cle: slug,
      titre: label,
      contes: contes.filter((conte) => conte.category === slug)
    }));
    sections.push({ cle: 'autres', titre: 'Autres contes', contes: contes.filter((conte) => !connues.has(conte.category)) });
    return sections.filter((section) => section.contes.length > 0);
  });

  constructor() {
    inject(Title).setTitle('Nos contes · La Maison des Contes');
    inject(Meta).updateTag({ name: 'description', content: 'Découvrez les contes illustrés de La Maison des Contes.' });
  }

  ngOnInit(): void {
    void this.catalogue.charger();
  }

  /** Image de la liste : la couverture 3D / perspective si elle existe, sinon la couverture normale. */
  protected image(conte: ContePublic): string {
    return conte.cover_perspective_url || conte.cover_url;
  }

  protected est3d(conte: ContePublic): boolean {
    return !!conte.cover_perspective_url;
  }

  /** Chemin du site (/contes/…) : navigation interne ; sinon lien externe, ouvert dans un nouvel onglet. */
  /** Route de l'application (/contes/momotaro) : navigation Angular, sans rechargement. */
  protected estInterne(url: string): boolean {
    return url.startsWith('/') && !this.estFichier(url);
  }

  /** Fichier statique du site (/archibald_complete.html) : ce n'est pas une route Angular, il faut un vrai lien. */
  protected estFichier(url: string): boolean {
    return url.startsWith('/') && /\.[a-z0-9]+(?:[?#].*)?$/i.test(url);
  }

  /** Installe l'application (PWA) ; elle s'ouvre ensuite directement sur le jeu. */
  protected installer(): void {
    void this.pwa.installer();
  }
}
