import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AuthorizationService } from '../../core/services/authorization.service';
import { UsersComponent } from './users/users.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, UsersComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
  readonly authService = inject(AuthService);
  readonly authz = inject(AuthorizationService);

  readonly currentTab = signal<'overview' | 'users'>('overview');

  setTab(tab: 'overview' | 'users'): void {
    this.currentTab.set(tab);
  }

  logout(): void {
    this.authService.logout('/login');
  }
}

