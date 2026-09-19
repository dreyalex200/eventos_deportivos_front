import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.model';
import { CreatedUserData, CreateUserRequest, UserProfileData } from '../models/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        UserService
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send POST request to create a new user', () => {
    const mockRequest: CreateUserRequest = {
      username: 'carlos_gomez',
      email: 'carlos.gomez@sportsevents.com',
      password: 'Password123+',
      firstName: 'Carlos',
      lastName: 'Gómez',
      phone: '+573001112233',
      roles: ['OPERATOR']
    };

    const mockResponse: ApiResponse<CreatedUserData> = {
      success: true,
      status: 'success',
      message: 'User created successfully',
      data: {
        id: 2,
        username: 'carlos_gomez',
        email: 'carlos.gomez@sportsevents.com',
        firstName: 'Carlos',
        lastName: 'Gómez',
        phone: '+573001112233',
        status: 1,
        roles: ['OPERATOR'],
        createdAt: '2026-09-19T14:40:00Z',
        updatedAt: '2026-09-19T14:40:00Z'
      },
      timestamp: '2026-09-19T14:40:00Z',
      requestId: 'mock-req-uuid'
    };

    service.createUser(mockRequest).subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.data.id).toBe(2);
      expect(response.data.username).toBe('carlos_gomez');
      expect(response.data.roles).toContain('OPERATOR');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/users`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRequest);
    req.flush(mockResponse);
  });

  it('should send GET request to retrieve current user profile', () => {
    const mockProfileResponse: ApiResponse<UserProfileData> = {
      success: true,
      status: 'success',
      message: 'User profile retrieved successfully',
      data: {
        id: 1,
        username: 'admin',
        email: 'admin@sportsevents.com',
        firstName: 'Administrator',
        lastName: 'System',
        status: 1,
        roles: ['ADMIN'],
        lastLoginAt: '2026-09-12T10:17:44Z',
        createdAt: '2026-09-12T09:56:15Z'
      },
      timestamp: '2026-09-12T10:25:00Z',
      requestId: 'mock-uuid-2'
    };

    service.getMyProfile().subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.data.id).toBe(1);
      expect(response.data.email).toBe('admin@sportsevents.com');
      expect(response.data.roles).toContain('ADMIN');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/users/me`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProfileResponse);
  });

  it('should send GET request to retrieve user by ID', () => {
    const mockUserResponse: ApiResponse<UserProfileData> = {
      success: true,
      status: 'success',
      message: 'User profile retrieved successfully',
      data: {
        id: 5,
        username: 'operator_dan',
        email: 'dan@sportsevents.com',
        firstName: 'Daniel',
        lastName: 'Rios',
        status: 1,
        roles: ['OPERATOR'],
        lastLoginAt: null,
        createdAt: '2026-09-15T08:00:00Z'
      },
      timestamp: '2026-09-15T08:30:00Z',
      requestId: 'mock-uuid-3'
    };

    service.getUserById(5).subscribe(response => {
      expect(response.success).toBe(true);
      expect(response.data.id).toBe(5);
      expect(response.data.username).toBe('operator_dan');
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/users/5`);
    expect(req.request.method).toBe('GET');
    req.flush(mockUserResponse);
  });
});
