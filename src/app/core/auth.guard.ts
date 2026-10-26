import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/** Réserve une page aux personnes connectées. */
export const connecteGuard: CanActivateFn = async () => {
  // inject() n'est utilisable qu'avant le premier await.
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.initialiser().catch(() => undefined);
  return auth.connecte() ? true : router.createUrlTree(['/connexion']);
};

/** Évite d'afficher la page de connexion à quelqu'un qui est déjà connecté. */
export const visiteurGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.initialiser().catch(() => undefined);
  return auth.connecte() ? router.createUrlTree(['/compte']) : true;
};
