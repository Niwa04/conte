import { Component, input } from '@angular/core';

interface Luciole {
  x: number;
  y: number;
  taille: number;
  duree: number;
  delai: number;
  dx: number;
  dy: number;
}

/** Générateur pseudo-aléatoire stable (mulberry32) : même disposition à chaque affichage. */
function aleatoire(graine: number): () => number {
  let a = graine;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

@Component({
  selector: 'app-lucioles',
  template: `
    @for (l of lucioles(); track $index) {
      <span
        class="luciole"
        [class.luciole--etoile]="type() === 'etoiles'"
        [style.left.%]="l.x"
        [style.top.%]="l.y"
        [style.--t.px]="l.taille"
        [style.--d.s]="l.duree"
        [style.animation-delay.s]="l.delai"
        [style.--dx.px]="l.dx"
        [style.--dy.px]="l.dy"
      ></span>
    }
  `,
  styleUrl: './lucioles.scss',
  host: { 'aria-hidden': 'true' }
})
export class Lucioles {
  readonly nombre = input(24);
  /** « lucioles » : points dorés qui dérivent ; « etoiles » : points blancs qui scintillent. */
  readonly type = input<'lucioles' | 'etoiles'>('lucioles');
  readonly graine = input(1);

  protected lucioles(): Luciole[] {
    const r = aleatoire(this.graine() * 7919);
    return Array.from({ length: this.nombre() }, () => ({
      x: r() * 100,
      y: r() * 100,
      taille: 3 + r() * 6,
      duree: 5 + r() * 7,
      delai: -r() * 12,
      dx: (r() - 0.5) * 90,
      dy: (r() - 0.5) * 70
    }));
  }
}
