import { Component, OnInit, inject, signal } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { type FicheConte, trouverConte } from '../../data/contes';
import { Apparition } from '../../shared/apparition';
import { Lucioles } from '../../shared/lucioles';
import { PwaService } from '../../core/pwa.service';
import { APP_URL } from '../../site.config';
import { ConteHamelin } from './hamelin/conte-hamelin';
import { ConteMomotaro } from './momotaro/conte-momotaro';

/** Page de présentation d'un conte : pour que les familles voient s'il leur plaira. */
@Component({
  selector: 'app-conte',
  imports: [RouterLink, Lucioles, Apparition, ConteMomotaro, ConteHamelin],
  templateUrl: './conte.html',
  styleUrl: './conte.scss'
})
export class Conte implements OnInit {
  private readonly pwa = inject(PwaService);

  /** Installe l'application (PWA) ; elle s'ouvre ensuite directement sur le jeu. */
  protected installer(): void {
    void this.pwa.installer();
  }

  protected readonly appUrl = APP_URL;
  protected readonly conte = signal<FicheConte | null>(null);
  protected readonly choix = signal(0);

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly titre = inject(Title);
  private readonly meta = inject(Meta);

  ngOnInit(): void {
    const fiche = trouverConte(this.route.snapshot.paramMap.get('slug') ?? '');
    if (!fiche) {
      void this.router.navigateByUrl('/', { replaceUrl: true });
      return;
    }
    this.conte.set(fiche);
    this.titre.setTitle(`${fiche.titre} · La Maison des Contes`);
    this.meta.updateTag({ name: 'description', content: `${fiche.accroche} Conte illustré, ${fiche.etiquettes.slice(2, 4).join(', ')}.` });
  }

  protected choisir(index: number): void {
    this.choix.set(index);
  }

  /** Flèches gauche/droite : passer d'un personnage à l'autre (comme sur des onglets). */
  protected naviguer(evenement: KeyboardEvent, total: number): void {
    const pas = evenement.key === 'ArrowRight' ? 1 : evenement.key === 'ArrowLeft' ? -1 : 0;
    if (!pas) return;
    evenement.preventDefault();
    const suivant = (this.choix() + pas + total) % total;
    this.choix.set(suivant);
    document.getElementById(`perso-onglet-${suivant}`)?.focus();
  }
}
