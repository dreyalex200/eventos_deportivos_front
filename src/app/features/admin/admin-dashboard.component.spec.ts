import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AuthService } from '../../core/services/auth.service';
import { AuthorizationService } from '../../core/services/authorization.service';
import { UserService } from '../../core/services/user.service';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let fixture: ComponentFixture<AdminDashboardComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          { path: 'login', component: class {} },
          { path: '', component: class {} }
        ]),
        AuthService,
        AuthorizationService,
        UserService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create the admin dashboard component', () => {
    expect(component).toBeTruthy();
  });

  it('should default to overview tab and allow switching to users tab', () => {
    expect(component.currentTab()).toBe('overview');
    component.setTab('users');
    expect(component.currentTab()).toBe('users');
    component.setTab('overview');
    expect(component.currentTab()).toBe('overview');
  });

  it('should call authService.logout on logout', () => {
    const logoutSpy = vi.spyOn(authService, 'logout');
    component.logout();
    expect(logoutSpy).toHaveBeenCalledWith('/login');
  });
});
