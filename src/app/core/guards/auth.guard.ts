import { inject, runInInjectionContext, Injector } from '@angular/core';
import { Router, UrlTree, CanActivateFn } from '@angular/router';
import { AuthApplicationService } from '../../application/services';

export const authGuard: CanActivateFn = (route, state) => {
    return runInInjectionContext(inject(Injector), () => {
        const authApplicationService: AuthApplicationService = inject(AuthApplicationService);
        const router: Router = inject(Router);

        if (authApplicationService.isAuthenticated()) {
            return true;
        }

        return router.createUrlTree(['/login']);
    });
};
