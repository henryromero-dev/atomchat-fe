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

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(
            withInterceptors([
                authInterceptor,
                errorInterceptor,
                loadingInterceptor,
            ])
        ),
        provideAnimations(),
        importProvidersFrom(UiModule),
        {
            provide: ENVIRONMENT,
            useValue: environment,
        },
        ...TASK_INFRASTRUCTURE_PROVIDERS,
        ...AUTH_INFRASTRUCTURE_PROVIDERS,
    ],
};
