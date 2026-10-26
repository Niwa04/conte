import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PwaService } from './core/pwa.service';
import { Installation } from './shared/installation';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Installation],
  template: '<router-outlet /><app-installation />'
})
export class App {
  // Instanciée dès le démarrage : l'événement d'installation du navigateur n'arrive qu'une fois.
  protected readonly pwa = inject(PwaService);
}
