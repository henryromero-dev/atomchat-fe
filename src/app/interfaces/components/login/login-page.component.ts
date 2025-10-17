import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';

import { AuthApplicationService } from '../../../application/services';
import { LoginRequest, RegisterRequest } from '../../../domain/entities';

/**
 * LoginPageComponent - Authentication page component
 * 
 * This component handles user authentication including login and registration.
 * It provides a simple email-based authentication system where users can either
 * log in with an existing email or register a new account.
 * 
 * Features:
 * - Email-based authentication
 * - User registration for new accounts
 * - Form validation with error messages
 * - Loading states during authentication
 * - Automatic navigation after successful authentication
 * 
 * @example
 * ```html
 * <app-login-page></app-login-page>
 * ```
 */
@Component({
    selector: 'app-login-page',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        CardModule,
        MessageModule,
        ProgressSpinnerModule,
        DialogModule,
    ],
    templateUrl: './login-page.component.html',
    styleUrl: './login-page.component.scss',
})
export class LoginPageComponent {
    /** Authentication service for login/register operations */
    private readonly authApplicationService: AuthApplicationService = inject(AuthApplicationService);
    
    /** Router service for navigation */
    private readonly router: Router = inject(Router);
    
    /** Form builder for reactive forms */
    private readonly fb: FormBuilder = inject(FormBuilder);

    /** Reactive form for login input */
    public readonly loginForm: FormGroup;

    /** Observable stream of authentication state */
    public readonly authState$ = this.authApplicationService.getAuthState();
    
    /** Controls user registration dialog visibility */
    public showCreateUserDialog: boolean = false;

    constructor() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

    /**
     * Handles login form submission
     * Attempts to log in the user with the provided email
     */
    public onSubmit(): void {
        if (this.loginForm.valid) {
            const loginRequest: LoginRequest = new LoginRequest(this.loginForm.value.email);

            this.authApplicationService.login(loginRequest).subscribe({
                next: () => {
                    this.router.navigate(['/tasks']);
                },
                error: (error) => {
                    console.error('Login error:', error);
                    
                    if (error.message && error.message.includes('User not found')) {
                        this.showCreateUserDialog = true;
                    }
                },
            });
        }
    }

    /**
     * Handles user registration confirmation
     * Creates a new user account with the provided email
     */
    public onConfirmCreateUser(): void {
        if (this.loginForm.valid) {
            const registerRequest: RegisterRequest = new RegisterRequest(this.loginForm.value.email);

            this.authApplicationService.register(registerRequest).subscribe({
                next: () => {
                    this.showCreateUserDialog = false;
                    this.router.navigate(['/tasks']);
                },
                error: (error) => {
                    console.error('Register error:', error);
                },
            });
        }
    }

    /**
     * Cancels user registration
     * Hides the registration dialog and resets the form
     */
    public onCancelCreateUser(): void {
        this.showCreateUserDialog = false;
        this.loginForm.patchValue({ email: '' });
    }

    /**
     * Checks if a form field is invalid and has been touched
     * @param fieldName - Name of the form field to check
     * @returns True if the field is invalid and touched/dirty
     */
    public isFieldInvalid(fieldName: string): boolean {
        const field = this.loginForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    /**
     * Gets the error message for a form field
     * @param fieldName - Name of the form field
     * @returns Error message string or empty string if no error
     */
    public getFieldError(fieldName: string): string {
        const field = this.loginForm.get(fieldName);
        if (field && field.errors) {
            if (field.errors['required']) {
                return 'This field is required';
            }
            if (field.errors['email']) {
                return 'Please enter a valid email address';
            }
        }
        return '';
    }
}
