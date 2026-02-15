import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/auth']);
  }
  return true;
};

export const roleGuard = (requiredRole: UserRole): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.currentUser();
    if (!user) {
      return router.createUrlTree(['/auth']);
    }
    if (user.role !== requiredRole) {
      return router.createUrlTree([`/${user.role}`]);
    }
    return true;
  };
};
