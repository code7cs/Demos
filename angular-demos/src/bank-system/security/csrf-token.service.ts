import { Injectable } from '@angular/core';

@Injectable()
export class CsrfTokenService {
  getToken(): string {
    // In a real banking app this would come from a secure server-issued token.
    return 'mock-csrf-token-from-secure-cookie';
  }
}
