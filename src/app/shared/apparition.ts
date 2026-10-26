import { DestroyRef, Directive, ElementRef, inject } from '@angular/core';

/** Fait apparaître l'élément en douceur quand il entre dans l'écran. */
@Directive({
  selector: '[appApparition]',
  host: { class: 'apparition' }
})
export class Apparition {
  constructor() {
    const element: HTMLElement = inject(ElementRef).nativeElement;
    const reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduit || typeof IntersectionObserver === 'undefined') {
      element.classList.add('apparition--visible');
      return;
    }

    const observateur = new IntersectionObserver(
      (entrees) => {
        if (entrees.some((e) => e.isIntersecting)) {
          element.classList.add('apparition--visible');
          observateur.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observateur.observe(element);
    inject(DestroyRef).onDestroy(() => observateur.disconnect());
  }
}
