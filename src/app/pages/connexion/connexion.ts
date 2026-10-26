import { Component, signal } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { SceneCompte } from '../../shared/scene-compte';

@Component({
  selector: 'app-connexion',
  imports: [SceneCompte],
  templateUrl: './connexion.html',
  styleUrl: './connexion.scss'
})
export class Connexion {
  protected readonly enCours = signal(false);
  protected readonly erreur = signal<string | null>(null);

  constructor(private readonly auth: AuthService) {}

  protected async connecter(): Promise<void> {
    this.erreur.set(null);
    this.enCours.set(true);
    try {
      await this.auth.connecterAvecGoogle();
      // La page est quittée : Supabase redirige vers Google.
    } catch (e) {
      this.erreur.set(e instanceof Error ? e.message : 'La connexion a échoué. Réessaie dans un instant.');
      this.enCours.set(false);
    }
  }
}
