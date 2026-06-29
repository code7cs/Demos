import { Injectable, signal } from '@angular/core';

export interface AuthSession {
  userId: string;
  displayName: string;
  roles: string[];
}

@Injectable()
export class AuthSessionService {
  // Interview point: frontend route guards improve UX, but backend authorization is the real enforcement.
  readonly session = signal<AuthSession>({
    userId: 'user-hanfan',
    displayName: 'Hanfan Wang',
    roles: ['customer'],
  });
}
