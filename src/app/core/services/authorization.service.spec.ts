import { TestBed } from '@angular/core/testing';
import { AuthorizationService } from './authorization.service';
import { TokenStorageService } from './token-storage.service';

describe('AuthorizationService', () => {
  let service: AuthorizationService;
  let tokenStorage: TokenStorageService;

  // Helper to create a fake JWT with given payload
  function createFakeJwt(payload: Record<string, unknown>): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const body = btoa(JSON.stringify(payload));
    return `${header}.${body}.mock-signature`;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthorizationService, TokenStorageService]
    });

    service = TestBed.inject(AuthorizationService);
    tokenStorage = TestBed.inject(TokenStorageService);
    tokenStorage.clearSession();
  });

  afterEach(() => {
    tokenStorage.clearSession();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return empty roles and permissions when no token is present', () => {
    expect(service.getRoles()).toEqual([]);
    expect(service.getPermissions()).toEqual([]);
    expect(service.hasRole('ADMIN')).toBe(false);
    expect(service.hasPermission('USERS_CREATE')).toBe(false);
  });

  it('should extract roles and permissions from decoded JWT token', () => {
    const fakeToken = createFakeJwt({
      sub: '1',
      email: 'admin@sportsevents.com',
      roles: ['ADMIN'],
      permissions: ['USERS_CREATE', 'USERS_READ'],
      authorization: {
        role: 'ADMIN',
        roles: ['ADMIN'],
        permissions: ['USERS_CREATE', 'USERS_READ']
      }
    });

    tokenStorage.saveSession({
      accessToken: fakeToken,
      tokenType: 'Bearer',
      expiresIn: 86400,
      user: { id: 1, email: 'admin@sportsevents.com', roles: ['ADMIN'] }
    });

    expect(service.hasRole('ADMIN')).toBe(true);
    expect(service.hasRole('OPERATOR')).toBe(false);
    expect(service.hasPermission('USERS_CREATE')).toBe(true);
    expect(service.hasPermission('USERS_READ')).toBe(true);
    expect(service.hasPermission('EVENTS_DELETE')).toBe(false);
    expect(service.getPermissions()).toContain('USERS_CREATE');
    expect(service.getRoles()).toContain('ADMIN');
  });

  it('should fallback to user roles when token cannot be parsed', () => {
    tokenStorage.saveSession({
      accessToken: 'invalid-token-format',
      tokenType: 'Bearer',
      expiresIn: 86400,
      user: { id: 2, email: 'operator@sportsevents.com', roles: ['OPERATOR'] }
    });

    expect(service.hasRole('OPERATOR')).toBe(true);
    expect(service.getPermissions()).toEqual([]);
  });
});
