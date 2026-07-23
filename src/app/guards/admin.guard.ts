import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  
  const isAdmin = role === 'ADMIN' || token === 'admin-token' || token === 'admin@knotix.com';
  
  if (isAdmin) {
    return true;
  }
  
  router.navigate(['/']);
  return false;
};
