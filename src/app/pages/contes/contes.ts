import { Component, OnInit, computed, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { ContesPublicsService, type ContePublic } from '../../core/contes-publics.service';
import { PwaService } from '../../core/pwa.service';
import { Lucioles } from '../../shared/lucioles';

/** Ordre d'affichage des catégories ; les autres catégories passent ensuite, sous « Autres contes ». */
const CATEGORIES = [
  { cle: 'classique', titre: 'Contes classiques' },
  { cle: 'enfant', titre: 'Contes pour enfants' },
  { cle: 'original', titre: 'Contes originaux' },
  { cle: 'monde', titre: 'Contes du monde' },
  { cle: 'extension_univers', titre: 'Contes d’extension d’univers' }
] as const;

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

  protected readonly sections = computed(() => {
    const contes = this.catalogue.contes();
    const connues = new Set<string>(CATEGORIES.map((categorie) => categorie.cle));
    const sections: Array<{ cle: string; titre: string; contes: ContePublic[] }> = CATEGORIES.map(({ cle, titre }) => ({
      cle,
      titre,
      contes: contes.filter((conte) => conte.category === cle)
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
