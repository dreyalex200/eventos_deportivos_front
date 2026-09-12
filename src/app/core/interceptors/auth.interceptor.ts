import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenStorageService } from '../services/token-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);

  // Do not add Authorization header to login or public auth endpoints
  if (req.url.includes('/api/v1/auth/login')) {
    return next(req);
  }

  const token = tokenStorage.getToken();
  if (token && !tokenStorage.isTokenExpired()) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};
