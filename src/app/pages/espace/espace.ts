import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CatalogueService } from '../../core/catalogue.service';
import { APP_URL } from '../../site.config';

/** Cadre de l'espace parent : menu latéral, en-tête avec le nom, et la page choisie. */
@Component({
  selector: 'app-espace',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './espace.html',
  styleUrl: './espace.scss'
})
export class Espace implements OnInit {
  protected readonly appUrl = APP_URL;
  protected readonly enCours = signal(false);

  constructor(
    protected readonly auth: AuthService,
    protected readonly donnees: CatalogueService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    void this.donnees.charger();
  }

  protected async deconnecter(): Promise<void> {
    this.enCours.set(true);
    try {
      await this.auth.deconnecter();
      await this.router.navigateByUrl('/', { replaceUrl: true });
    } finally {
      this.enCours.set(false);
    }
  }
}
