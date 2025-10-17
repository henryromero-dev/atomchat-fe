import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginPageComponent } from './login-page.component';
import { AuthApplicationService } from '../../../application/services/auth-application.service';
import { LoginRequest, RegisterRequest } from '../../../domain/entities';

describe('LoginPageComponent', () => {
  let authServiceSpy: jest.Mocked<AuthApplicationService>;
  let routerSpy: jest.Mocked<Router>;
  let formBuilder: FormBuilder;

  beforeEach(() => {
    const authSpy = {
      login: jest.fn(),
      register: jest.fn(),
      getAuthState: jest.fn()
    } as jest.Mocked<Pick<AuthApplicationService, 'login' | 'register' | 'getAuthState'>>;

    const routerSpyObj = {
      navigate: jest.fn()
    } as jest.Mocked<Pick<Router, 'navigate'>>;

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: AuthApplicationService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
      ],
    });

    authServiceSpy = TestBed.inject(AuthApplicationService) as jest.Mocked<AuthApplicationService>;
    routerSpy = TestBed.inject(Router) as jest.Mocked<Router>;
    formBuilder = TestBed.inject(FormBuilder);

    // Setup auth state observable
    authServiceSpy.getAuthState.mockReturnValue(of({ isAuthenticated: false, user: null }));
  });

  it('should create component instance', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new LoginPageComponent();
    });
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty email', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new LoginPageComponent();
    });
    expect(component.loginForm.get('email')?.value).toBe('');
  });

  it('should mark form as invalid when email is empty', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new LoginPageComponent();
    });
    component.loginForm.get('email')?.setValue('');
    expect(component.loginForm.invalid).toBe(true);
    
    // Mark field as touched to trigger validation display
    component.loginForm.get('email')?.markAsTouched();
    expect(component.isFieldInvalid('email')).toBe(true);
  });

  it('should mark form as invalid when email format is invalid', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new LoginPageComponent();
    });
    component.loginForm.get('email')?.setValue('invalid-email');
    expect(component.loginForm.invalid).toBe(true);
    
    // Mark field as touched to trigger validation display
    component.loginForm.get('email')?.markAsTouched();
    expect(component.isFieldInvalid('email')).toBe(true);
  });

  it('should mark form as valid when email is correct', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new LoginPageComponent();
    });
    component.loginForm.get('email')?.setValue('test@example.com');
    expect(component.loginForm.valid).toBe(true);
    expect(component.isFieldInvalid('email')).toBe(false);
  });

  it('should call authService.login with correct credentials on form submission', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new LoginPageComponent();
    });
    const mockEmail = 'test@example.com';
    component.loginForm.get('email')?.setValue(mockEmail);
    
    authServiceSpy.login.mockReturnValue(of({}));

    component.onSubmit();

    expect(authServiceSpy.login).toHaveBeenCalledWith(expect.any(LoginRequest));
    expect(authServiceSpy.login).toHaveBeenCalledTimes(1);
  });

  it('should handle successful login', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new LoginPageComponent();
    });
    const mockEmail = 'test@example.com';
    component.loginForm.get('email')?.setValue(mockEmail);
    
    authServiceSpy.login.mockReturnValue(of({}));

    component.onSubmit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should handle login error and show create user dialog when user not found', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new LoginPageComponent();
    });
    const mockEmail = 'test@example.com';
    component.loginForm.get('email')?.setValue(mockEmail);
    
    const error = new Error('User not found');
    authServiceSpy.login.mockReturnValue(throwError(() => error));

    component.onSubmit();

    expect(component.showCreateUserDialog).toBe(true);
  });

  it('should not submit form when invalid', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new LoginPageComponent();
    });
    component.loginForm.get('email')?.setValue('');
    
    component.onSubmit();

    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });

  it('should handle create user confirmation', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new LoginPageComponent();
    });
    const mockEmail = 'test@example.com';
    component.loginForm.get('email')?.setValue(mockEmail);
    component.showCreateUserDialog = true;
    
    authServiceSpy.register.mockReturnValue(of({}));

    component.onConfirmCreateUser();

    expect(authServiceSpy.register).toHaveBeenCalledWith(expect.any(RegisterRequest));
    expect(component.showCreateUserDialog).toBe(false);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should handle create user cancellation', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new LoginPageComponent();
    });
    component.showCreateUserDialog = true;
    component.loginForm.get('email')?.setValue('test@example.com');

    component.onCancelCreateUser();

    expect(component.showCreateUserDialog).toBe(false);
    expect(component.loginForm.get('email')?.value).toBe('');
  });

  it('should return correct error messages', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new LoginPageComponent();
    });
    const emailField = component.loginForm.get('email');
    
    // Test required error
    emailField?.setValue('');
    emailField?.markAsTouched();
    expect(component.getFieldError('email')).toBe('This field is required');
    
    // Test email format error
    emailField?.setValue('invalid-email');
    emailField?.markAsTouched();
    expect(component.getFieldError('email')).toBe('Please enter a valid email address');
    
    // Test no error
    emailField?.setValue('valid@example.com');
    emailField?.markAsTouched();
    expect(component.getFieldError('email')).toBe('');
  });

  it('should track auth state changes', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new LoginPageComponent();
    });
    expect(component.authState$).toBeDefined();
    expect(authServiceSpy.getAuthState).toHaveBeenCalled();
  });

  it('should initialize with correct default state', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new LoginPageComponent();
    });
    expect(component.showCreateUserDialog).toBe(false);
    expect(component.loginForm).toBeDefined();
    expect(component.authState$).toBeDefined();
  });
});