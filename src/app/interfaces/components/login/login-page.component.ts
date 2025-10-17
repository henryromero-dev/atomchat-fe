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
    private readonly authApplicationService: AuthApplicationService = inject(AuthApplicationService);
    private readonly router: Router = inject(Router);
    private readonly fb: FormBuilder = inject(FormBuilder);

    public readonly loginForm: FormGroup;

    public readonly authState$ = this.authApplicationService.getAuthState();
    public showCreateUserDialog: boolean = false;

    constructor() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

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

    public onCancelCreateUser(): void {
        this.showCreateUserDialog = false;
        this.loginForm.patchValue({ email: '' });
    }

    public isFieldInvalid(fieldName: string): boolean {
        const field = this.loginForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

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
