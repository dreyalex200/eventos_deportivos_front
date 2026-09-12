import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';
import { ApiResponse, LoginData } from '../../../core/models/auth.model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let routerSpy: { navigateByUrl: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    routerSpy = { navigateByUrl: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AuthService,
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParams: {}
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with an invalid empty form', () => {
    expect(component.loginForm.valid).toBe(false);
    expect(component.loginForm.get('email')?.valid).toBe(false);
    expect(component.loginForm.get('password')?.valid).toBe(false);
  });

  it('should validate email format and requirement', () => {
    const emailControl = component.loginForm.get('email');

    emailControl?.setValue('');
    expect(emailControl?.hasError('required')).toBe(true);

    emailControl?.setValue('invalid-email-format');
    expect(emailControl?.hasError('email')).toBe(true);

    emailControl?.setValue('admin@sportsevents.com');
    expect(emailControl?.valid).toBe(true);
  });

  it('should validate password requirement', () => {
    const passwordControl = component.loginForm.get('password');

    passwordControl?.setValue('');
    expect(passwordControl?.hasError('required')).toBe(true);

    passwordControl?.setValue('Prueba123+');
    expect(passwordControl?.valid).toBe(true);
  });

  it('should toggle password visibility flag', () => {
    expect(component.showPassword()).toBe(false);
    component.togglePasswordVisibility();
    expect(component.showPassword()).toBe(true);
    component.togglePasswordVisibility();
    expect(component.showPassword()).toBe(false);
  });

  it('should not submit if form is invalid', () => {
    const loginSpy = vi.spyOn(authService, 'login');
    component.onSubmit();
    expect(loginSpy).not.toHaveBeenCalled();
  });

  it('should handle successful login and redirect to /admin', () => {
    const mockResponse: ApiResponse<LoginData> = {
      success: true,
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: 'valid-token',
        tokenType: 'Bearer',
        expiresIn: 86400,
        user: { id: 1, email: 'admin@sportsevents.com', roles: ['ADMIN'] }
      },
      timestamp: '2026-09-12T10:00:00Z',
      requestId: 'req-1'
    };

    vi.spyOn(authService, 'login').mockReturnValue(of(mockResponse));

    component.loginForm.setValue({
      email: 'admin@sportsevents.com',
      password: 'Prueba123+'
    });

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith({
      email: 'admin@sportsevents.com',
      password: 'Prueba123+'
    });
    expect(component.isLoading()).toBe(false);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/admin');
  });

  it('should handle login error and display error details message', () => {
    const errorResponse = {
      status: 401,
      error: {
        status: 'error',
        error: {
          code: 'INVALID_CREDENTIALS',
          details: 'Invalid email or password'
        }
      }
    };

    vi.spyOn(authService, 'login').mockReturnValue(throwError(() => errorResponse));

    component.loginForm.setValue({
      email: 'admin@sportsevents.com',
      password: 'WrongPassword'
    });

    component.onSubmit();

    expect(component.isLoading()).toBe(false);
    expect(component.errorMessage()).toBe('Invalid email or password');
  });
});
