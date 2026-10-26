import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Lucioles } from './lucioles';

/** Décor commun aux pages de connexion et de compte : forêt dorée, cartouche, carte de cuir bleu. */
@Component({
  selector: 'app-scene-compte',
  imports: [RouterLink, Lucioles],
  template: `
    <main class="scene">
      <app-lucioles [nombre]="30" [graine]="9" />
      <a class="retour" routerLink="/">← Retour au site</a>
      <section class="carte">
        <img class="carte__badge" src="assets/badge-maison-des-contes.webp" alt="La Maison des Contes" width="277" height="352">
        <ng-content />
      </section>
    </main>
  `,
  styleUrl: './scene-compte.scss'
})
export class SceneCompte {}
