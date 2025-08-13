import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Redirect root to dashboard
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // Auth routes (no layout)
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./features/auth/forgot-password.component').then(m => m.ForgotPasswordComponent)
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./features/auth/reset-password.component').then(m => m.ResetPasswordComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  },

  // Main application routes (with layout)
  {
    path: '',
    loadComponent: () => import('./layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      // Dashboard
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },

      // Tasks
      {
        path: 'tasks',
        children: [
          {
            path: '',
            loadComponent: () => import('./features/tasks/task-list.component').then(m => m.TaskListComponent)
          },
          {
            path: 'all',
            loadComponent: () => import('./features/tasks/all-tasks.component').then(m => m.AllTasksComponent),
            canActivate: [roleGuard],
            data: { roles: ['ADMIN', 'MANAGER'] }
          },
          {
            path: 'create',
            loadComponent: () => import('./features/tasks/task-form.component').then(m => m.TaskFormComponent),
            canActivate: [roleGuard],
            data: { roles: ['ADMIN', 'MANAGER'] }
          },
          {
            path: ':id',
            loadComponent: () => import('./features/tasks/task-detail.component').then(m => m.TaskDetailComponent)
          },
          {
            path: ':id/edit',
            loadComponent: () => import('./features/tasks/task-form.component').then(m => m.TaskFormComponent)
          }
        ]
      },

      // Users
      {
        path: 'users',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'MANAGER'] },
        children: [
          {
            path: '',
            loadComponent: () => import('./features/users/user-list.component').then(m => m.UserListComponent)
          },
          {
            path: ':id',
            loadComponent: () => import('./features/users/user-detail.component').then(m => m.UserDetailComponent)
          }
        ]
      },

      // Analytics
      {
        path: 'analytics',
        loadComponent: () => import('./features/analytics/analytics.component').then(m => m.AnalyticsComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'MANAGER'] }
      },

      // Activity Logs
      {
        path: 'activity-logs',
        loadComponent: () => import('./features/analytics/activity-logs.component').then(m => m.ActivityLogsComponent),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },

      // Profile & Settings
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./features/profile/settings.component').then(m => m.SettingsComponent)
      }
    ]
  },

  // Wildcard route - must be last
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found.component').then(m => m.NotFoundComponent)
  }
];
