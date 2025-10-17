import { inject, runInInjectionContext, Injector } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthApplicationService } from '../../application/services';

/**
 * AuthGuard - Route guard for authentication protection
 * 
 * This guard protects routes that require user authentication. It checks if the
 * user is currently authenticated and redirects to the login page if not.
 * 
 * Features:
 * - Authentication state verification
 * - Automatic redirect to login page for unauthenticated users
 * - Integration with AuthApplicationService
 * - Used in route configuration to protect private routes
 * 
 * @example
 * ```typescript
 * // In route configuration
 * const routes: Routes = [
 *   {
 *     path: 'tasks',
 *     component: TasksComponent,
 *     canActivate: [authGuard]
 *   }
 * ];
 * ```
 */
export const authGuard: CanActivateFn = () => {
    return runInInjectionContext(inject(Injector), () => {
        const authApplicationService: AuthApplicationService = inject(AuthApplicationService);
        const router: Router = inject(Router);

        if (authApplicationService.isAuthenticated()) {
            return true;
        }

        return router.createUrlTree(['/login']);
    });
};
