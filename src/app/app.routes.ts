import { Routes } from '@angular/router';
import { connecteGuard, visiteurGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: '',
    title: 'La Maison des Contes',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home)
  },
  {
    path: 'contes/:slug',
    loadComponent: () => import('./pages/conte/conte').then((m) => m.Conte)
  },
  {
    path: 'connexion',
    title: 'Connexion · La Maison des Contes',
    canActivate: [visiteurGuard],
    loadComponent: () => import('./pages/connexion/connexion').then((m) => m.Connexion)
  },
  {
    path: 'connexion/callback',
    title: 'Connexion en cours · La Maison des Contes',
    loadComponent: () => import('./pages/connexion/callback').then((m) => m.ConnexionCallback)
  },
  {
    path: 'compte',
    canActivate: [connecteGuard],
    loadComponent: () => import('./pages/espace/espace').then((m) => m.Espace),
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'Mon espace · La Maison des Contes',
        loadComponent: () => import('./pages/espace/accueil').then((m) => m.EspaceAccueil)
      },
      {
        path: 'contes',
        title: 'Mes contes · La Maison des Contes',
        loadComponent: () => import('./pages/espace/contes').then((m) => m.EspaceContes)
      },
      {
        path: 'abonnement',
        title: 'Mon abonnement · La Maison des Contes',
        loadComponent: () => import('./pages/espace/abonnement').then((m) => m.EspaceAbonnement)
      },
      {
        path: 'collection',
        title: 'Ma collection · La Maison des Contes',
        loadComponent: () => import('./pages/espace/collection').then((m) => m.EspaceCollection)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
