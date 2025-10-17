import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User, LoginRequest, RegisterRequest, LoginResponse, AuthState } from '../../domain/entities';
import { AUTH_REPOSITORY, AuthRepository } from '../../domain/repositories';

@Injectable({
    providedIn: 'root'
})
export class AuthApplicationService {
    private readonly TOKEN_KEY: string = 'access_token';
    private readonly USER_KEY: string = 'user';

    private readonly initialState: AuthState = new AuthState(
        null,
        false,
        false,
        null
    );

    private readonly authStateSubject: BehaviorSubject<AuthState> = new BehaviorSubject<AuthState>(this.initialState);
    public readonly authState$: Observable<AuthState> = this.authStateSubject.asObservable();

    constructor(
        @Inject(AUTH_REPOSITORY) private readonly authRepository: AuthRepository,
        private readonly router: Router
    ) {
        this.initializeAuth();
    }

    public getCurrentUser(): User | null {
        return this.authStateSubject.value.user;
    }

    public isAuthenticated(): boolean {
        return this.authStateSubject.value.isAuthenticated;
    }

    public getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    public getAuthState(): Observable<AuthState> {
        return this.authState$;
    }

    public login(request: LoginRequest): Observable<LoginResponse> {
        this.setLoading(true);

        return this.authRepository.login(request).pipe(
            tap((response: LoginResponse) => {
                this.setToken(response.accessToken);
                this.setUser(response.user);
                this.authStateSubject.next(new AuthState(
                    response.user,
                    true,
                    false,
                    null
                ));
            }),
            catchError((error) => {
                this.setLoading(false);
                let errorMessage: string = 'Login failed. Please try again.';

                if (error.error?.error) {
                    errorMessage = error.error.error;
                } else if (error.message) {
                    errorMessage = error.message;
                }

                this.setError(errorMessage);
                return throwError(() => error);
            })
        );
    }

    public register(request: RegisterRequest): Observable<LoginResponse> {
        this.setLoading(true);

        return this.authRepository.register(request).pipe(
            tap((response: LoginResponse) => {
                this.setToken(response.accessToken);
                this.setUser(response.user);
                this.authStateSubject.next(new AuthState(
                    response.user,
                    true,
                    false,
                    null
                ));
            }),
            catchError((error) => {
                this.setLoading(false);
                let errorMessage: string = 'Registration failed. Please try again.';

                if (error.error?.error) {
                    errorMessage = error.error.error;
                }

                this.setError(errorMessage);
                return throwError(() => error);
            })
        );
    }

    public logout(): void {
        this.clearToken();
        this.clearUser();
        // Reset to initial state to clear any loading or error states
        this.authStateSubject.next(this.initialState);
        this.router.navigate(['/login']);
    }

    private initializeAuth(): void {
        const token: string | null = this.getToken();
        const user: User | null = this.getStoredUser();

        if (token && user) {
            this.authStateSubject.next(new AuthState(
                user,
                true,
                false,
                null
            ));
        } else if (token) {
            this.verifyTokenAndGetUser();
        }
    }

    private verifyTokenAndGetUser(): void {
        const token: string | null = this.getToken();
        if (!token) return;

        this.authRepository.getCurrentUser().subscribe({
            next: (user: User) => {
                this.setUser(user);
                this.authStateSubject.next(new AuthState(
                    user,
                    true,
                    false,
                    null
                ));
            },
            error: () => {
                this.clearToken();
                this.clearUser();
                this.authStateSubject.next(new AuthState(
                    null,
                    false,
                    false,
                    null
                ));
            }
        });
    }

    private getStoredUser(): User | null {
        const userStr: string | null = localStorage.getItem(this.USER_KEY);
        return userStr ? User.fromPlainObject(JSON.parse(userStr)) : null;
    }

    private setToken(accessToken: string): void {
        localStorage.setItem(this.TOKEN_KEY, accessToken);
    }

    private setUser(user: User): void {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user.toPlainObject()));
    }

    private clearToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
    }

    private clearUser(): void {
        localStorage.removeItem(this.USER_KEY);
    }

    private setLoading(loading: boolean): void {
        this.authStateSubject.next(new AuthState(
            this.authStateSubject.value.user,
            this.authStateSubject.value.isAuthenticated,
            loading,
            this.authStateSubject.value.error
        ));
    }

    private setError(error: string): void {
        this.authStateSubject.next(new AuthState(
            this.authStateSubject.value.user,
            this.authStateSubject.value.isAuthenticated,
            false,
            error
        ));
    }
}
