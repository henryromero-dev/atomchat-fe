import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

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
