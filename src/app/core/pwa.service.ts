import { Injectable, signal } from '@angular/core';
import { APP_URL } from '../site.config';

/** Événement non standard envoyé par Chrome, Edge et Android quand le site peut être installé. */
interface InstallationProposee extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export type EtatInstallation = 'inconnu' | 'installable' | 'installee';

/**
 * Installation du site comme application (PWA). Une fois installée, l'application s'ouvre
 * directement sur le jeu (voir manifest.webmanifest), pas sur l'accueil du site.
 */
@Injectable({ providedIn: 'root' })
export class PwaService {
  readonly etat = signal<EtatInstallation>('inconnu');
  /** Aide affichée quand le navigateur ne propose pas d'installation directe. */
  readonly aide = signal<{ titre: string; etapes: string[] } | null>(null);

  private proposition: InstallationProposee | null = null;

  constructor() {
    if (this.enModeApplication()) this.etat.set('installee');

    window.addEventListener('beforeinstallprompt', (evenement) => {
      evenement.preventDefault(); // on déclenche l'installation nous-mêmes, depuis nos boutons
      this.proposition = evenement as InstallationProposee;
      if (this.etat() !== 'installee') this.etat.set('installable');
    });
    window.addEventListener('appinstalled', () => {
      this.proposition = null;
      this.etat.set('installee');
      this.aide.set(null);
    });

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => undefined);
    }
  }

  /** Bouton « Télécharger l'application » : installe la PWA, ou explique comment faire. */
  async installer(): Promise<void> {
    if (this.enModeApplication()) {
      this.ouvrirJeu();
      return;
    }

    if (this.proposition) {
      const proposition = this.proposition;
      this.proposition = null; // une proposition ne sert qu'une fois
      await proposition.prompt();
      const choix = await proposition.userChoice;
      if (choix.outcome === 'accepted') this.ouvrirJeu();
      return;
    }

    this.aide.set(this.expliquer());
  }

  fermerAide(): void {
    this.aide.set(null);
  }

  ouvrirJeu(): void {
    window.location.assign(APP_URL + '?launch=installed');
  }

  private enModeApplication(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches
      || window.matchMedia('(display-mode: fullscreen)').matches
      || (navigator as Navigator & { standalone?: boolean }).standalone === true;
  }

  private expliquer(): { titre: string; etapes: string[] } {
    const agent = navigator.userAgent;
    if (/iphone|ipad|ipod/i.test(agent)) {
      return {
        titre: 'Installer sur iPhone ou iPad',
        etapes: [
          'Ouvrez ce site dans Safari.',
          'Touchez le bouton Partager, en bas de l’écran.',
          'Choisissez « Sur l’écran d’accueil », puis « Ajouter ».'
        ]
      };
    }
    if (!window.isSecureContext) {
      return {
        titre: 'Installation indisponible ici',
        etapes: ['L’installation demande une adresse sécurisée (https) ou localhost.']
      };
    }
    return {
      titre: 'Installer l’application',
      etapes: [
        /firefox/i.test(agent)
          ? 'Firefox ne permet pas d’installer le site sur ordinateur : utilisez Chrome ou Edge.'
          : 'Dans le menu de votre navigateur (⋮), choisissez « Installer La Maison des Contes » ou « Installer l’application ».',
        'Si cette option n’apparaît pas, rechargez la page et réessayez dans quelques secondes.'
      ]
    };
  }
}
