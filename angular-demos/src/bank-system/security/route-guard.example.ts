import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthSessionService } from './auth-session.service';

export const authenticatedCustomerGuard: CanActivateFn = () => {
  const auth = inject(AuthSessionService);
  return auth.session().roles.includes('customer');
};
