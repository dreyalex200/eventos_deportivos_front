import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./landing/landing.component').then(m => m.LandingComponent),
    title: 'Plataforma de Gestión de Eventos Deportivos | Administra Competencias, Equipos y Torneos'
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    title: 'Iniciar Sesión | SportFlow Plataforma de Eventos'
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () => import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    title: 'Panel de Administración | SportFlow Plataforma de Eventos'
  },
  {
    path: '**',
    redirectTo: ''
  }
];

