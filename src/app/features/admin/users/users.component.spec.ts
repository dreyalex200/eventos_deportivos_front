import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { UsersComponent } from './users.component';
import { UserService } from '../../../core/services/user.service';
import { AuthorizationService } from '../../../core/services/authorization.service';
import { ApiResponse } from '../../../core/models/auth.model';
import { CreatedUserData, UserProfileData } from '../../../core/models/user.model';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let userService: UserService;
  let authzService: AuthorizationService;

  const mockProfileResponse: ApiResponse<UserProfileData> = {
    success: true,
    status: 'success',
    message: 'Profile retrieved',
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
    requestId: 'req-profile-1'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        UserService,
        AuthorizationService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    authzService = TestBed.inject(AuthorizationService);
  });

  it('should create the users component and load authenticated profile on init', () => {
    vi.spyOn(userService, 'getMyProfile').mockReturnValue(of(mockProfileResponse));

    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.currentProfile()?.username).toBe('admin');
    expect(component.managedUsers().length).toBe(1);
    expect(component.isProfileLoading()).toBe(false);
  });

  it('should handle profile loading failure with appropriate error state', () => {
    const errorResponse = {
      status: 500,
      error: {
        status: 'error',
        error: { code: 'INTERNAL_ERROR', details: 'Internal server error' }
      }
    };
    vi.spyOn(userService, 'getMyProfile').mockReturnValue(throwError(() => errorResponse));

    fixture.detectChanges();

    expect(component.isProfileLoading()).toBe(false);
    expect(component.profileError()).toBe('Internal server error');
  });

  it('should validate all mandatory fields in userForm', () => {
    vi.spyOn(userService, 'getMyProfile').mockReturnValue(of(mockProfileResponse));
    fixture.detectChanges();

    expect(component.userForm.valid).toBe(false);

    // Set invalid values
    component.userForm.patchValue({
      username: 'ab', // min length 3
      email: 'invalid-email',
      password: '123', // min length 6
      firstName: '',
      lastName: ''
    });

    expect(component.userForm.get('username')?.hasError('minlength')).toBe(true);
    expect(component.userForm.get('email')?.hasError('email')).toBe(true);
    expect(component.userForm.get('password')?.hasError('minlength')).toBe(true);
    expect(component.userForm.get('firstName')?.hasError('required')).toBe(true);
    expect(component.userForm.get('lastName')?.hasError('required')).toBe(true);

    // Set valid values
    component.userForm.patchValue({
      username: 'carlos_gomez',
      email: 'carlos.gomez@sportsevents.com',
      password: 'Password123+',
      firstName: 'Carlos',
      lastName: 'Gómez',
      phone: '+573001112233',
      roles: 'OPERATOR'
    });

    expect(component.userForm.valid).toBe(true);
  });

  it('should submit user form and add newly created user to managed list', () => {
    vi.spyOn(userService, 'getMyProfile').mockReturnValue(of(mockProfileResponse));
    fixture.detectChanges();

    const mockCreateResponse: ApiResponse<CreatedUserData> = {
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
      requestId: 'req-create-1'
    };

    const createSpy = vi.spyOn(userService, 'createUser').mockReturnValue(of(mockCreateResponse));

    component.userForm.setValue({
      username: 'carlos_gomez',
      email: 'carlos.gomez@sportsevents.com',
      password: 'Password123+',
      firstName: 'Carlos',
      lastName: 'Gómez',
      phone: '+573001112233',
      roles: 'OPERATOR'
    });

    component.submitUserForm();

    expect(createSpy).toHaveBeenCalledWith({
      username: 'carlos_gomez',
      email: 'carlos.gomez@sportsevents.com',
      password: 'Password123+',
      firstName: 'Carlos',
      lastName: 'Gómez',
      phone: '+573001112233',
      roles: ['OPERATOR']
    });

    expect(component.formSuccess()).toContain('created successfully');
    expect(component.managedUsers().some(u => u.id === 2)).toBe(true);
  });

  it('should handle duplicate user error on creation', () => {
    vi.spyOn(userService, 'getMyProfile').mockReturnValue(of(mockProfileResponse));
    fixture.detectChanges();

    const conflictError = {
      status: 409,
      error: {
        status: 'error',
        error: { code: 'DUPLICATE_RESOURCE', details: 'Email already in use' }
      }
    };
    vi.spyOn(userService, 'createUser').mockReturnValue(throwError(() => conflictError));

    component.userForm.setValue({
      username: 'admin_duplicate',
      email: 'admin@sportsevents.com',
      password: 'Password123+',
      firstName: 'Admin',
      lastName: 'Duplicate',
      phone: '',
      roles: 'OPERATOR'
    });

    component.submitUserForm();

    expect(component.isSubmitting()).toBe(false);
    expect(component.formError()).toBe('Email already in use');
  });

  it('should perform user search by ID successfully', () => {
    vi.spyOn(userService, 'getMyProfile').mockReturnValue(of(mockProfileResponse));
    fixture.detectChanges();

    const mockLookupResponse: ApiResponse<UserProfileData> = {
      success: true,
      status: 'success',
      message: 'User found',
      data: {
        id: 9,
        username: 'referee_jane',
        email: 'jane@sportsevents.com',
        firstName: 'Jane',
        lastName: 'Doe',
        status: 1,
        roles: ['OPERATOR'],
        lastLoginAt: null,
        createdAt: '2026-09-18T12:00:00Z'
      },
      timestamp: '2026-09-19T10:00:00Z',
      requestId: 'req-lookup-9'
    };

    const getByIdSpy = vi.spyOn(userService, 'getUserById').mockReturnValue(of(mockLookupResponse));

    component.onSearchById('9');

    expect(getByIdSpy).toHaveBeenCalledWith(9);
    expect(component.lookupResult()?.username).toBe('referee_jane');
    expect(component.managedUsers().some(u => u.id === 9)).toBe(true);
  });

  it('should handle user not found error on ID search', () => {
    vi.spyOn(userService, 'getMyProfile').mockReturnValue(of(mockProfileResponse));
    fixture.detectChanges();

    const notFoundError = {
      status: 404,
      error: {
        status: 'error',
        error: { code: 'RESOURCE_NOT_FOUND', details: 'User not found' }
      }
    };
    vi.spyOn(userService, 'getUserById').mockReturnValue(throwError(() => notFoundError));

    component.onSearchById('999');

    expect(component.lookupError()).toBe('User with ID 999 was not found.');
    expect(component.lookupResult()).toBeNull();
  });

  it('should toggle create modal visibility and reset state', () => {
    vi.spyOn(userService, 'getMyProfile').mockReturnValue(of(mockProfileResponse));
    fixture.detectChanges();

    expect(component.isModalOpen()).toBe(false);
    component.openCreateModal();
    expect(component.isModalOpen()).toBe(true);
    component.closeCreateModal();
    expect(component.isModalOpen()).toBe(false);
  });
});
