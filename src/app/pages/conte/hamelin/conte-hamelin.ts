import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { type FicheConte } from '../../../data/contes';
import { Apparition } from '../../../shared/apparition';
import { FicheConteBloc } from '../../../shared/fiche-conte';
import { PersonnagesConte } from '../../../shared/personnages-conte';
import { APP_URL } from '../../../site.config';

/** Demi-tons au-dessus du ré4, sur une gamme mineure pentatonique : la mélodie du musicien. */
const AIR = [0, 3, 5, 7, 5, 3, 0, -2, 0, 3, 5, 10, 7, 5, 3, 5, 7, 10, 12, 10, 7, 5, 3, 0];

/** Flûte synthétisée (Web Audio) : aucun fichier audio, le son ne démarre qu'à la demande. */
class Flute {
  private ctx: AudioContext | null = null;
  private sortie: GainNode | null = null;
  private minuteur: ReturnType<typeof setInterval> | null = null;
  private rang = 0;

  constructor(private readonly auNote: (rang: number) => void) {}

  get joue(): boolean {
    return this.minuteur !== null;
  }

  demarrer(): void {
    if (this.minuteur) return;
    const Contexte = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!Contexte) return;
    this.ctx ??= new Contexte();
    void this.ctx.resume();
    this.sortie = this.ctx.createGain();
    this.sortie.gain.value = 0.0001;
    this.sortie.gain.exponentialRampToValueAtTime(0.5, this.ctx.currentTime + 0.6);
    this.sortie.connect(this.ctx.destination);
    this.jouerNote();
    this.minuteur = setInterval(() => this.jouerNote(), 420);
  }

  arreter(fondu = 0.8): void {
    if (this.minuteur) clearInterval(this.minuteur);
    this.minuteur = null;
    const ctx = this.ctx;
    const sortie = this.sortie;
    if (!ctx || !sortie) return;
    sortie.gain.cancelScheduledValues(ctx.currentTime);
    sortie.gain.setValueAtTime(Math.max(sortie.gain.value, 0.0001), ctx.currentTime);
    sortie.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + fondu);
    window.setTimeout(() => sortie.disconnect(), fondu * 1000 + 100);
    this.sortie = null;
  }

  private jouerNote(): void {
    const ctx = this.ctx;
    const sortie = this.sortie;
    if (!ctx || !sortie) return;
    const position = this.rang++ % AIR.length;
    this.auNote(position);
    const frequence = 293.66 * 2 ** (AIR[position] / 12);
    const debut = ctx.currentTime;
    const note = ctx.createGain();
    note.gain.setValueAtTime(0.0001, debut);
    note.gain.exponentialRampToValueAtTime(0.35, debut + 0.06);
    note.gain.exponentialRampToValueAtTime(0.0001, debut + 0.55);
    note.connect(sortie);

    const vibrato = ctx.createOscillator();
    const profondeur = ctx.createGain();
    vibrato.frequency.value = 5.2;
    profondeur.gain.value = 7;
    vibrato.connect(profondeur);

    [[1, 1], [2, 0.22], [3, 0.07]].forEach(([harmonique, poids]) => {
      const oscillateur = ctx.createOscillator();
      const volume = ctx.createGain();
      oscillateur.type = 'sine';
      oscillateur.frequency.value = frequence * harmonique;
      volume.gain.value = poids;
      profondeur.connect(oscillateur.detune);
      oscillateur.connect(volume).connect(note);
      oscillateur.start(debut);
      oscillateur.stop(debut + 0.65);
    });
    vibrato.start(debut);
    vibrato.stop(debut + 0.65);
  }

  fermer(): void {
    this.arreter(0.1);
    window.setTimeout(() => void this.ctx?.close(), 300);
  }
}

interface Mot {
  allemand: string;
  sens: string;
}

interface Repere {
  annee: string;
  titre: string;
  texte: string;
}

/**
 * Page du Joueur de flûte de Hamelin (Allemagne).
 * Parti pris : la ville de Hameln, en Basse-Saxe, sur la Weser. Maisons à colombages, pignons à gradins,
 * drapeau allemand, mots allemands ; et la mélodie du musicien, jouée sur une partition.
 */
@Component({
  selector: 'app-conte-hamelin',
  imports: [Apparition, PersonnagesConte, FicheConteBloc],
  templateUrl: './conte-hamelin.html',
  styleUrl: './conte-hamelin.scss'
})
export class ConteHamelin {
  readonly conte = input.required<FicheConte>();
  readonly installer = output<void>();

  protected readonly appUrl = APP_URL;

  /** Illustration du conte utilisée comme fond de section (assombrie ou éclaircie par le SCSS). */
  protected fond(page: number): string {
    return `url(assets/contes/le-joueur-de-flute-de-hamelin/pages/p${page < 10 ? '0' : ''}${page}.webp)`;
  }

  protected readonly mots: Mot[] = [
    { allemand: 'Rattenfänger', sens: 'le preneur de rats' },
    { allemand: 'Fachwerk', sens: 'les colombages' },
    { allemand: 'Weser', sens: 'la rivière de Hamelin' }
  ];

  protected readonly reperes: Repere[] = [
    { annee: '1284', titre: 'Les enfants disparaissent', texte: 'La tradition de Hamelin place ici la disparition d’enfants de la ville.' },
    { annee: '1816', titre: 'Les frères Grimm', texte: 'Jacob et Wilhelm Grimm rassemblent la légende dans leurs Légendes allemandes.' },
    { annee: '1842', titre: 'Robert Browning', texte: 'Le poète anglais en fait un long poème, « The Pied Piper of Hamelin ».' },
    { annee: 'Aujourd’hui', titre: 'La ville raconte', texte: 'Hamelin garde sa légende vivante, sur ses places et dans ses rues.' }
  ];

  /** Positions des notes sur la portée (y en pixels du viewBox), d'après leur hauteur. */
  protected readonly partition = AIR.map((demiTons, i) => ({ x: 34 + i * 38, y: 118 - demiTons * 7.5 }));
  protected readonly noteCourante = signal(-1);
  protected readonly musique = signal(false);

  private readonly flute = new Flute((n) => this.noteCourante.set(n));

  constructor() {
    inject(DestroyRef).onDestroy(() => this.flute.fermer());
  }

  protected basculerMusique(): void {
    if (this.musique()) {
      this.flute.arreter();
      this.musique.set(false);
      this.noteCourante.set(-1);
    } else {
      this.flute.demarrer();
      this.musique.set(this.flute.joue);
    }
  }
}
