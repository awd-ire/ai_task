import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'auth',
    canActivate: [guestGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/auth/register/register.component').then((m) => m.RegisterComponent),
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'tasks',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/tasks/task-list/task-list.component').then((m) => m.TaskListComponent),
      },
      {
        path: 'new',
        loadComponent: () => import('./pages/tasks/task-form/task-form.component').then((m) => m.TaskFormComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./pages/tasks/task-form/task-form.component').then((m) => m.TaskFormComponent),
      },
    ],
  },
  { path: '**', redirectTo: '/dashboard' },
];
