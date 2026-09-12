import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthUser, LoginData } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly TOKEN_KEY = 'sf_access_token';
  private readonly USER_KEY = 'sf_auth_user';
  private readonly EXPIRES_AT_KEY = 'sf_token_expires_at';

  saveSession(data: LoginData): void {
    if (!this.isBrowser) return;

    try {
      localStorage.setItem(this.TOKEN_KEY, data.accessToken);
      localStorage.setItem(this.USER_KEY, JSON.stringify(data.user));

      // Calculate expiration timestamp in milliseconds
      const expiresAt = Date.now() + (data.expiresIn * 1000);
      localStorage.setItem(this.EXPIRES_AT_KEY, expiresAt.toString());
    } catch (e) {
      console.error('Failed to save session to storage', e);
    }
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): AuthUser | null {
    if (!this.isBrowser) return null;
    const userJson = localStorage.getItem(this.USER_KEY);
    if (!userJson) return null;

    try {
      return JSON.parse(userJson) as AuthUser;
    } catch {
      return null;
    }
  }

  getExpiresAt(): number | null {
    if (!this.isBrowser) return null;
    const expires = localStorage.getItem(this.EXPIRES_AT_KEY);
    return expires ? parseInt(expires, 10) : null;
  }

  isTokenExpired(): boolean {
    const expiresAt = this.getExpiresAt();
    if (!expiresAt) return true;
    return Date.now() >= expiresAt;
  }

  hasValidSession(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired();
  }

  clearSession(): void {
    if (!this.isBrowser) return;
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.EXPIRES_AT_KEY);
    } catch (e) {
      console.error('Failed to clear session from storage', e);
    }
  }
}
