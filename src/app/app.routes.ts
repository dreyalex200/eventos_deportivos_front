import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./landing/landing.component').then(m => m.LandingComponent),
    title: 'Sports Events Management Platform | Manage Competitions, Teams and Tournaments'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
