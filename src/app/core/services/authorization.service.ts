import { Injectable, inject, computed } from '@angular/core';
import { TokenStorageService } from './token-storage.service';
import { JwtTokenPayload } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private readonly tokenStorage = inject(TokenStorageService);

  private decodePayload(token: string): JwtTokenPayload | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const padLength = (4 - (base64.length % 4)) % 4;
      const paddedBase64 = base64 + '='.repeat(padLength);

      let binaryString: string;
      if (typeof atob === 'function') {
        binaryString = atob(paddedBase64);
      } else if (typeof (globalThis as unknown as { Buffer?: { from: (str: string, enc: string) => { toString: (enc: string) => string } } }).Buffer !== 'undefined') {
        binaryString = (globalThis as unknown as { Buffer: { from: (str: string, enc: string) => { toString: (enc: string) => string } } }).Buffer.from(paddedBase64, 'base64').toString('binary');
      } else {
        return null;
      }

      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const decodedText = new TextDecoder('utf-8').decode(bytes);
      return JSON.parse(decodedText) as JwtTokenPayload;
    } catch {
      return null;
    }
  }

  getJwtPayload(): JwtTokenPayload | null {
    const token = this.tokenStorage.getToken();
    if (!token) return null;
    return this.decodePayload(token);
  }

  getRoles(): string[] {
    const payload = this.getJwtPayload();
    if (payload?.roles && Array.isArray(payload.roles)) {
      return payload.roles;
    }
    const user = this.tokenStorage.getUser();
    return user?.roles || [];
  }

  getPermissions(): string[] {
    const payload = this.getJwtPayload();
    if (payload?.permissions && Array.isArray(payload.permissions)) {
      return payload.permissions;
    }
    if (payload?.authorization?.permissions && Array.isArray(payload.authorization.permissions)) {
      return payload.authorization.permissions;
    }
    return [];
  }

  hasRole(role: string): boolean {
    const roles = this.getRoles();
    return roles.includes(role);
  }

  hasPermission(permission: string): boolean {
    const permissions = this.getPermissions();
    return permissions.includes(permission);
  }
}
