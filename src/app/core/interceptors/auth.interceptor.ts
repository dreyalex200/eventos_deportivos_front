import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenStorage = inject(TokenStorageService);
  const router = inject(Router);

  // Do not add Authorization header to login or public auth endpoints
  const isAuthEndpoint = req.url.includes('/api/v1/auth/login') || req.url.includes('/api/v1/auth/anonymous');

  let authReq = req;
  if (!isAuthEndpoint) {
    const token = tokenStorage.getToken();
    if (token && !tokenStorage.isTokenExpired()) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }

  return next(authReq).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse) {
        // Differentiate authentication failure (401 on protected route) from other errors
        if (error.status === 401 && !isAuthEndpoint) {
          tokenStorage.clearSession();
          router.navigate(['/login']);
        }
        // For 403 (Forbidden/RBAC), 400 (Validation), 404, 500 etc., keep the session and propagate
      }
      return throwError(() => error);
    })
  );
};

