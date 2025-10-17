import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginPageComponent } from './login-page.component';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;
  let confirmationServiceSpy: jasmine.SpyObj<ConfirmationService>;

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    avatar: 'https://example.com/avatar.jpg',
  };

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login', 'isAuthenticated', 'getCurrentUser']);
    const toastSpy = jasmine.createSpyObj('ToastService', ['showSuccess', 'showError', 'showInfo', 'showWarn', 'clear']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const messageSpy = jasmine.createSpyObj('MessageService', ['add', 'clear']);
    const confirmationSpy = jasmine.createSpyObj('ConfirmationService', ['confirm']);

    await TestBed.configureTestingModule({
      imports: [
        LoginPageComponent,
        ReactiveFormsModule,
        FormsModule,
        InputTextModule,
        ButtonModule,
        CardModule,
        MessageModule,
        DialogModule,
        ConfirmDialogModule,
        ProgressSpinnerModule,
        ToastModule,
      ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authSpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: MessageService, useValue: messageSpy },
        { provide: ConfirmationService, useValue: confirmationSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    toastServiceSpy = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    messageServiceSpy = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    confirmationServiceSpy = TestBed.inject(ConfirmationService) as jasmine.SpyObj<ConfirmationService>;

    // Mock initial state
    authServiceSpy.isAuthenticated.and.returnValue(false);
    authServiceSpy.getCurrentUser.and.returnValue(null);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should initialize with correct default state', () => {
    expect(component.isLoading).toBeFalse();
    expect(component.showPasswordResetDialog).toBeFalse();
    expect(component.showPasswordResetForm).toBeFalse();
    expect(component.passwordResetEmail).toBe('');
  });

  describe('Form Validation', () => {
    it('should mark form as invalid when email is empty', () => {
      component.loginForm.patchValue({ email: '', password: 'password123' });
      expect(component.loginForm.valid).toBeFalse();
      expect(component.loginForm.get('email')?.hasError('required')).toBeTrue();
    });

    it('should mark form as invalid when email format is invalid', () => {
      component.loginForm.patchValue({ email: 'invalid-email', password: 'password123' });
      expect(component.loginForm.valid).toBeFalse();
      expect(component.loginForm.get('email')?.hasError('email')).toBeTrue();
    });

    it('should mark form as valid when all fields are correct', () => {
      component.loginForm.patchValue({ email: 'test@example.com', password: 'password123' });
      expect(component.loginForm.valid).toBeTrue();
    });

    it('should show validation errors in template', () => {
      component.loginForm.patchValue({ email: '', password: '' });
      component.loginForm.markAllAsTouched();
      fixture.detectChanges();

      const emailError = fixture.debugElement.nativeElement.querySelector('.form-error');
      expect(emailError).toBeTruthy();
      expect(emailError.textContent).toContain('Email is required');
    });
  });

  describe('Login Flow', () => {
    it('should call authService.login with correct credentials on form submission', () => {
      const formData = { email: 'test@example.com', password: 'password123' };
      component.loginForm.patchValue(formData);
      authServiceSpy.login.and.returnValue(of(mockUser));

      component.onLogin();

      expect(authServiceSpy.login).toHaveBeenCalledWith(formData);
    });

    it('should handle successful login', () => {
      component.loginForm.patchValue({ email: 'test@example.com', password: 'password123' });
      authServiceSpy.login.and.returnValue(of(mockUser));

      component.onLogin();

      expect(component.isLoading).toBeFalse();
      expect(toastServiceSpy.showSuccess).toHaveBeenCalledWith('Login successful!', 'Welcome back!');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks']);
    });

    it('should handle login error', () => {
      component.loginForm.patchValue({ email: 'test@example.com', password: 'wrongpassword' });
      authServiceSpy.login.and.returnValue(throwError(() => new Error('Invalid credentials')));

      component.onLogin();

      expect(component.isLoading).toBeFalse();
      expect(toastServiceSpy.showError).toHaveBeenCalledWith('Login failed', 'Invalid credentials');
    });

    it('should not submit form when invalid', () => {
      component.loginForm.patchValue({ email: '', password: '' });
      component.loginForm.markAllAsTouched();

      component.onLogin();

      expect(authServiceSpy.login).not.toHaveBeenCalled();
    });

    it('should set loading state during login', () => {
      component.loginForm.patchValue({ email: 'test@example.com', password: 'password123' });
      authServiceSpy.login.and.returnValue(of(mockUser));

      component.onLogin();

      expect(component.isLoading).toBeTrue();
    });
  });

  describe('Password Reset Flow', () => {
    it('should show password reset dialog when requested', () => {
      component.requestPasswordReset();

      expect(component.showPasswordResetDialog).toBeTrue();
      expect(component.showPasswordResetForm).toBeTrue();
    });

    it('should hide password reset dialog when cancelled', () => {
      component.showPasswordResetDialog = true;
      component.showPasswordResetForm = true;

      component.cancelPasswordReset();

      expect(component.showPasswordResetDialog).toBeFalse();
      expect(component.showPasswordResetForm).toBeFalse();
    });

    it('should handle password reset form submission', () => {
      component.passwordResetEmail = 'test@example.com';
      authServiceSpy.login.and.returnValue(of(mockUser));

      component.onPasswordReset();

      expect(component.showPasswordResetForm).toBeFalse();
      expect(toastServiceSpy.showInfo).toHaveBeenCalledWith('Password reset sent', 'Check your email for instructions');
    });

    it('should handle password reset error', () => {
      component.passwordResetEmail = 'test@example.com';
      authServiceSpy.login.and.returnValue(throwError(() => new Error('Email not found')));

      component.onPasswordReset();

      expect(toastServiceSpy.showError).toHaveBeenCalledWith('Password reset failed', 'Email not found');
    });
  });

  describe('Navigation', () => {
    it('should navigate to tasks page on successful login', () => {
      component.loginForm.patchValue({ email: 'test@example.com', password: 'password123' });
      authServiceSpy.login.and.returnValue(of(mockUser));

      component.onLogin();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks']);
    });

    it('should not navigate when login fails', () => {
      component.loginForm.patchValue({ email: 'test@example.com', password: 'wrongpassword' });
      authServiceSpy.login.and.returnValue(throwError(() => new Error('Invalid credentials')));

      component.onLogin();

      expect(routerSpy.navigate).not.toHaveBeenCalled();
    });
  });

  describe('Error Display', () => {
    it('should display error message when login fails', () => {
      component.loginForm.patchValue({ email: 'test@example.com', password: 'wrongpassword' });
      authServiceSpy.login.and.returnValue(throwError(() => new Error('Invalid credentials')));

      component.onLogin();
      fixture.detectChanges();

      expect(toastServiceSpy.showError).toHaveBeenCalledWith('Login failed', 'Invalid credentials');
    });

    it('should clear errors when form is reset', () => {
      component.loginForm.patchValue({ email: 'test@example.com', password: 'password123' });
      component.resetForm();

      expect(component.loginForm.get('email')?.value).toBe('');
      expect(component.loginForm.get('password')?.value).toBe('');
    });
  });

  describe('Template Rendering', () => {
    it('should render login form', () => {
      fixture.detectChanges();

      const form = fixture.debugElement.nativeElement.querySelector('form');
      const emailInput = fixture.debugElement.nativeElement.querySelector('input[type="email"]');
      const passwordInput = fixture.debugElement.nativeElement.querySelector('input[type="password"]');
      const submitButton = fixture.debugElement.nativeElement.querySelector('button[type="submit"]');

      expect(form).toBeTruthy();
      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
      expect(submitButton).toBeTruthy();
    });

    it('should show loading spinner when loading', () => {
      component.isLoading = true;
      fixture.detectChanges();

      const spinner = fixture.debugElement.nativeElement.querySelector('p-progressSpinner');
      expect(spinner).toBeTruthy();
    });

    it('should show password reset dialog when requested', () => {
      component.showPasswordResetDialog = true;
      fixture.detectChanges();

      const dialog = fixture.debugElement.nativeElement.querySelector('p-dialog');
      expect(dialog).toBeTruthy();
    });

    it('should show password reset form when in reset mode', () => {
      component.showPasswordResetDialog = true;
      component.showPasswordResetForm = true;
      fixture.detectChanges();

      const resetForm = fixture.debugElement.nativeElement.querySelector('.password-reset-form');
      expect(resetForm).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      fixture.detectChanges();

      const emailInput = fixture.debugElement.nativeElement.querySelector('input[type="email"]');
      const passwordInput = fixture.debugElement.nativeElement.querySelector('input[type="password"]');
      const submitButton = fixture.debugElement.nativeElement.querySelector('button[type="submit"]');

      expect(emailInput.getAttribute('aria-label')).toBe('Email address');
      expect(passwordInput.getAttribute('aria-label')).toBe('Password');
      expect(submitButton.getAttribute('aria-label')).toBe('Sign in to your account');
    });

    it('should have proper form labels', () => {
      fixture.detectChanges();

      const emailLabel = fixture.debugElement.nativeElement.querySelector('label[for="email"]');
      const passwordLabel = fixture.debugElement.nativeElement.querySelector('label[for="password"]');

      expect(emailLabel).toBeTruthy();
      expect(passwordLabel).toBeTruthy();
    });
  });
});