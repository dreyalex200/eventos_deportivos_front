import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, AuthUser, LoginData, LoginRequest } from '../models/auth.model';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenStorage = inject(TokenStorageService);

  private readonly _currentUser = signal<AuthUser | null>(null);
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this._currentUser());

  constructor() {
    this.restoreSession();
  }

  private restoreSession(): void {
    if (this.tokenStorage.hasValidSession()) {
      this._currentUser.set(this.tokenStorage.getUser());
    } else {
      this.tokenStorage.clearSession();
      this._currentUser.set(null);
    }
  }

  login(credentials: LoginRequest): Observable<ApiResponse<LoginData>> {
    const url = `${environment.apiUrl}/api/v1/auth/login`;

    return this.http.post<ApiResponse<LoginData>>(url, credentials).pipe(
      tap(response => {
        if (response && response.data && response.data.accessToken) {
          this.tokenStorage.saveSession(response.data);
          this._currentUser.set(response.data.user);
        }
      })
    );
  }

  logout(redirectUrl = '/login'): void {
    this.tokenStorage.clearSession();
    this._currentUser.set(null);
    if (redirectUrl) {
      this.router.navigate([redirectUrl]);
    }
  }

  hasRole(role: string): boolean {
    const user = this._currentUser();
    return !!user && user.roles.includes(role);
  }
}
