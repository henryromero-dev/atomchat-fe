import { inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { AuthApplicationService } from '../../application/services';

export const authGuard = (): boolean | UrlTree => {
    const authApplicationService: AuthApplicationService = inject(AuthApplicationService);
    const router: Router = inject(Router);

    if (authApplicationService.isAuthenticated()) {
        return true;
    }

    return router.createUrlTree(['/login']);
};
