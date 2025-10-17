import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { UiModule } from './shared/ui/ui.module';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { environment } from '@environments/environment';
import { ENVIRONMENT } from './core/tokens/environment.token';
import { TASK_INFRASTRUCTURE_PROVIDERS } from './infrastructure/providers/task-infrastructure.provider';
import { AUTH_INFRASTRUCTURE_PROVIDERS } from './infrastructure/providers/auth-infrastructure.provider';

/**
 * Application configuration for AtomChat Frontend
 * 
 * This configuration sets up the Angular application with all necessary providers,
 * interceptors, and infrastructure services. It configures the hexagonal architecture
 * dependencies and provides global services for the application.
 * 
 * Features:
 * - Router configuration with lazy-loaded routes
 * - HTTP client with interceptors for auth, error handling, and loading
 * - Animation support
 * - PrimeNG UI module
 * - Environment configuration injection
 * - Infrastructure providers for task and auth services
 * 
 * @example
 * ```typescript
 * // In main.ts
 * bootstrapApplication(AppComponent, appConfig);
 * ```
 */
export const appConfig: ApplicationConfig = {
    providers: [
        // Router configuration
        provideRouter(routes),
        
        // HTTP client with interceptors
        provideHttpClient(
            withInterceptors([
                authInterceptor,      // Authentication interceptor
                errorInterceptor,     // Error handling interceptor
                loadingInterceptor,   // Loading state interceptor
            ])
        ),
        
        // Animation support
        provideAnimations(),
        
        // PrimeNG UI module
        importProvidersFrom(UiModule),
        
        // Environment configuration
        {
            provide: ENVIRONMENT,
            useValue: environment,
        },
        
        // Infrastructure providers for hexagonal architecture
        ...TASK_INFRASTRUCTURE_PROVIDERS,    // Task-related infrastructure
        ...AUTH_INFRASTRUCTURE_PROVIDERS,    // Authentication infrastructure
    ],
};
