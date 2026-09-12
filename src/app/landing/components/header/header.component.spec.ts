import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the header component', () => {
    expect(component).toBeTruthy();
  });

  it('should have desktop login button navigating to /login and not #contact', () => {
    const desktopLoginBtn = fixture.nativeElement.querySelector('.nav-cta') as HTMLAnchorElement;
    expect(desktopLoginBtn).toBeTruthy();
    expect(desktopLoginBtn.textContent).toContain('Login');
    expect(desktopLoginBtn.getAttribute('href')).toBe('/login');
    expect(desktopLoginBtn.getAttribute('href')).not.toBe('#contact');
  });

  it('should have mobile login button navigating to /login and not #contact', () => {
    const mobileLoginBtn = fixture.nativeElement.querySelector('.mobile-cta-wrapper a') as HTMLAnchorElement;
    expect(mobileLoginBtn).toBeTruthy();
    expect(mobileLoginBtn.textContent).toContain('Login');
    expect(mobileLoginBtn.getAttribute('href')).toBe('/login');
    expect(mobileLoginBtn.getAttribute('href')).not.toBe('#contact');
  });

  it('should preserve existing contact navigation', () => {
    const contactLinks = fixture.nativeElement.querySelectorAll('a[href="#contact"]');
    expect(contactLinks.length).toBeGreaterThan(0);
    contactLinks.forEach((link: HTMLAnchorElement) => {
      expect(link.textContent?.trim()).toBe('Contact');
    });
  });
});
