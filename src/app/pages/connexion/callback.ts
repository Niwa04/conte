import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { SceneCompte } from '../../shared/scene-compte';

/** Page d'arrivée après Google : termine la connexion puis ouvre le compte. */
@Component({
  selector: 'app-connexion-callback',
  imports: [SceneCompte, RouterLink],
  template: `
    <app-scene-compte>
      @if (erreur()) {
        <h1>Connexion impossible</h1>
        <p class="message-erreur" role="alert">{{ erreur() }}</p>
        <a class="bouton-or" routerLink="/connexion">Réessayer</a>
      } @else {
        <h1>Un instant…</h1>
        <p role="status">On ouvre ta maison des contes.</p>
      }
    </app-scene-compte>
  `,
  styles: `h1 { margin: 0 0 0.8rem; font-size: 2rem; color: var(--mdc-gold-clair); }`
})
export class ConnexionCallback implements OnInit {
  protected readonly erreur = signal<string | null>(null);

  constructor(private readonly auth: AuthService, private readonly router: Router) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.auth.terminerConnexion();
      await this.router.navigateByUrl('/compte', { replaceUrl: true });
    } catch (e) {
      this.erreur.set(e instanceof Error ? e.message : 'La connexion a échoué.');
    }
  }
}
