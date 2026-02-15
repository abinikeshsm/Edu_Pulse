import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth'
  },
  {
    path: 'auth',
    loadComponent: () =>
      import('./features/auth/auth-page.component').then((m) => m.AuthPageComponent)
  },
  {
    path: 'professor',
    canActivate: [roleGuard('professor')],
    loadComponent: () =>
      import('./features/professor/professor-dashboard.component').then(
        (m) => m.ProfessorDashboardComponent
      )
  },
  {
    path: 'student',
    canActivate: [roleGuard('student')],
    loadComponent: () =>
      import('./features/student/student-dashboard.component').then((m) => m.StudentDashboardComponent)
  },
  {
    path: 'quiz/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/quiz/quiz-attempt.component').then((m) => m.QuizAttemptComponent)
  },
  {
    path: 'leaderboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/leaderboard/leaderboard.component').then((m) => m.LeaderboardComponent)
  },
  {
    path: '**',
    redirectTo: 'auth'
  }
];
