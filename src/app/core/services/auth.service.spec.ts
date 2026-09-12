import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { TokenStorageService } from './token-storage.service';
import { ApiResponse, LoginData, LoginRequest } from '../models/auth.model';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let tokenStorage: TokenStorageService;
  let routerSpy: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    routerSpy = { navigate: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        TokenStorageService,
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    tokenStorage = TestBed.inject(TokenStorageService);
    tokenStorage.clearSession();
  });

  afterEach(() => {
    httpMock.verify();
    tokenStorage.clearSession();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
  });

  it('should send POST request to login endpoint and store session on success', () => {
    const mockRequest: LoginRequest = {
      email: 'admin@sportsevents.com',
      password: 'Prueba123+'
    };

    const mockResponse: ApiResponse<LoginData> = {
      success: true,
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: 'mock-jwt-token-xyz',
        tokenType: 'Bearer',
        expiresIn: 86400,
        user: {
          id: 1,
          email: 'admin@sportsevents.com',
          roles: ['ADMIN']
        }
      },
      timestamp: '2026-09-12T10:00:00Z',
      requestId: 'mock-req-id'
    };

    service.login(mockRequest).subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.data.accessToken).toBe('mock-jwt-token-xyz');
      expect(service.isAuthenticated()).toBe(true);
      expect(service.currentUser()?.email).toBe('admin@sportsevents.com');
      expect(service.hasRole('ADMIN')).toBe(true);
      expect(tokenStorage.getToken()).toBe('mock-jwt-token-xyz');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  });

  it('should clear session and navigate to login on logout', () => {
    const mockData: LoginData = {
      accessToken: 'sample-token',
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: { id: 1, email: 'admin@sportsevents.com', roles: ['ADMIN'] }
    };
    tokenStorage.saveSession(mockData);

    service.logout('/login');

    expect(tokenStorage.getToken()).toBeNull();
    expect(service.isAuthenticated()).toBe(false);
    expect(service.currentUser()).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
