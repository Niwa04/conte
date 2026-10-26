import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';
import { PwaService } from '../../core/pwa.service';
import { APP_URL, CAPTURES_INTERACTIF, COLLECTIONS, FAQ, FORMULES, VOLETS } from '../../site.config';
import { RouterLink } from '@angular/router';
import { Apparition } from '../../shared/apparition';
import { Lucioles } from '../../shared/lucioles';

const COULEURS_ETINCELLES = ['#ffe27a', '#ff9ec7', '#8fd3ff', '#b6f58a', '#ffffff'];

@Component({
  selector: 'app-home',
  imports: [Lucioles, Apparition, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  private readonly pwa = inject(PwaService);

  /** Installe l'application (PWA) ; elle s'ouvre ensuite directement sur le jeu. */
  protected installer(): void {
    void this.pwa.installer();
  }

  protected readonly appUrl = APP_URL;
  protected readonly volets = VOLETS;
  protected readonly captures = CAPTURES_INTERACTIF;
  protected readonly collections = COLLECTIONS;
  protected readonly formules = FORMULES;
  protected readonly faq = FAQ;

  /** Tranches d'âge réellement présentes dans la bibliothèque, avec un conte en exemple. */
  protected readonly ages = [
    { tranche: '2 - 4 ans', exemple: 'Le meilleur ami de Robi', image: 'assets/covers/robi.webp' },
    { tranche: '4 - 6 ans', exemple: 'Les Trois Petits Cochons', image: 'assets/covers/trois-petits-cochons.webp' },
    { tranche: '6 - 10 ans', exemple: 'Blanche Neige', image: 'assets/covers/blanche-neige.webp' },
    { tranche: '10 ans et plus', exemple: 'La méchante reine', image: 'assets/covers/mechante-reine.webp' }
  ];

  protected readonly menuOuvert = signal(false);

  /** Build WebGL Unity déposé dans public/webgl-build : null = vérification en cours. */
  protected readonly testDisponible = signal<boolean | null>(null);
  protected readonly testLance = signal(false);
  protected readonly urlTest: SafeResourceUrl = inject(DomSanitizer).bypassSecurityTrustResourceUrl('webgl-build/game.html');

  async ngOnInit(): Promise<void> {
    try {
      const [lanceur, build] = await Promise.all([
        fetch('webgl-build/game.html', { cache: 'no-store' }).then((r) => (r.ok ? r.text() : '')),
        fetch('webgl-build/build/index.html', { cache: 'no-store' }).then((r) => (r.ok ? r.text() : ''))
      ]);
      // Sans fichiers déposés, le serveur renvoie la page du site : on reconnaît le lanceur et le build à leur contenu.
      this.testDisponible.set(/unityCanvas/.test(lanceur) && /createUnityInstance/.test(build));
    } catch {
      this.testDisponible.set(false);
    }
  }

  protected lancerTest(): void { this.testLance.set(true); }

  protected arreterTest(): void { this.testLance.set(false); }
  protected pleinEcran(cadre: HTMLIFrameElement): void { void cadre.requestFullscreen?.(); }

  private derniereEtincelle = 0;
  private readonly mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private readonly pointeurFin = window.matchMedia('(pointer: fine)').matches;

  protected basculerMenu(): void {
    this.menuOuvert.update((v) => !v);
  }

  /** Traîne d'étincelles derrière la souris (écrans à souris uniquement). */
  @HostListener('document:pointermove', ['$event'])
  protected etincelle(evenement: PointerEvent): void {
    if (this.mouvementReduit || !this.pointeurFin) return;
    const maintenant = performance.now();
    if (maintenant - this.derniereEtincelle < 45) return;
    this.derniereEtincelle = maintenant;

    const etoile = document.createElement('span');
    etoile.className = 'etincelle';
    etoile.style.left = `${evenement.clientX}px`;
    etoile.style.top = `${evenement.clientY}px`;
    etoile.style.setProperty('--c', COULEURS_ETINCELLES[Math.floor(Math.random() * COULEURS_ETINCELLES.length)]);
    etoile.style.setProperty('--dx', `${(Math.random() - 0.5) * 40}px`);
    etoile.style.setProperty('--s', `${8 + Math.random() * 10}px`);
    document.body.appendChild(etoile);
    etoile.addEventListener('animationend', () => etoile.remove(), { once: true });
  }
}
