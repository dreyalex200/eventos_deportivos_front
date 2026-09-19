import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { authInterceptor } from './auth.interceptor';
import { TokenStorageService } from '../services/token-storage.service';

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let tokenStorage: TokenStorageService;
  let routerSpy: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    routerSpy = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        TokenStorageService,
        { provide: Router, useValue: routerSpy }
      ]
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    tokenStorage = TestBed.inject(TokenStorageService);
    tokenStorage.clearSession();
  });

  afterEach(() => {
    httpMock.verify();
    tokenStorage.clearSession();
  });

  it('should not attach Authorization header to login requests', () => {
    tokenStorage.saveSession({
      accessToken: 'valid-stored-jwt',
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: { id: 1, email: 'admin@sportsevents.com', roles: ['ADMIN'] }
    });

    http.post('/api/v1/auth/login', { email: 'test@example.com' }).subscribe();

    const req = httpMock.expectOne('/api/v1/auth/login');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({ success: true });
  });

  it('should attach Authorization Bearer header to protected requests when token exists', () => {
    tokenStorage.saveSession({
      accessToken: 'jwt-bearer-xyz',
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: { id: 1, email: 'admin@sportsevents.com', roles: ['ADMIN'] }
    });

    http.get('/api/v1/users/me').subscribe();

    const req = httpMock.expectOne('/api/v1/users/me');
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe('Bearer jwt-bearer-xyz');
    req.flush({ success: true });
  });

  it('should clear session and redirect to /login when 401 occurs on protected endpoint', () => {
    tokenStorage.saveSession({
      accessToken: 'expired-or-invalid-jwt',
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: { id: 1, email: 'admin@sportsevents.com', roles: ['ADMIN'] }
    });

    http.get('/api/v1/users/me').subscribe({
      next: () => {},
      error: () => {}
    });

    const req = httpMock.expectOne('/api/v1/users/me');
    req.flush(
      { status: 'error', error: { code: 'token_invalido', details: 'Full authentication required' } },
      { status: 401, statusText: 'Unauthorized' }
    );

    expect(tokenStorage.getToken()).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should NOT clear session or redirect to /login when 403 occurs', () => {
    tokenStorage.saveSession({
      accessToken: 'valid-jwt',
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: { id: 2, email: 'user@sportsevents.com', roles: ['USER'] }
    });

    http.get('/api/v1/events/1').subscribe({
      next: () => {},
      error: () => {}
    });

    const req = httpMock.expectOne('/api/v1/events/1');
    req.flush(
      { status: 'error', error: { code: 'FORBIDDEN_ROLE', details: 'Access Denied' } },
      { status: 403, statusText: 'Forbidden' }
    );

    expect(tokenStorage.getToken()).toBe('valid-jwt');
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
