import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

/**
 * Application routes configuration for AtomChat Frontend
 * 
 * This configuration defines all the routes in the application, including
 * lazy-loaded components and route guards for authentication protection.
 * 
 * Route Structure:
 * - Root path redirects to tasks page
 * - Login page for user authentication
 * - Tasks page (protected with auth guard)
 * - Wildcard route for handling 404 errors
 * 
 * Features:
 * - Lazy loading for better performance
 * - Authentication guard protection
 * - Automatic redirects
 * - 404 error handling
 * 
 * @example
 * ```typescript
 * // Routes are automatically loaded by Angular Router
 * // Access via: /login, /tasks
 * ```
 */
export const routes: Routes = [
    {
        path: '',
        redirectTo: '/tasks',
        pathMatch: 'full',
    },
    {
        path: 'login',
        loadComponent: () => import('./interfaces/components/login/login-page.component').then(m => m.LoginPageComponent),
    },
    {
        path: 'tasks',
        loadComponent: () => import('./interfaces/components/tasks/page/tasks-page.component').then(m => m.TasksPageComponent),
        canActivate: [authGuard],
    },
    {
        path: '**',
        redirectTo: '/login',
    },
];
