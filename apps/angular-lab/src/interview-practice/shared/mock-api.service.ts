import { Injectable } from '@angular/core';
import { Observable, defer, delay, of, throwError } from 'rxjs';
import { TRANSACTIONS, Transaction } from './models';
@Injectable({ providedIn: 'root' })
export class MockApiService {
  search(query: string): Observable<Transaction[]> {
    return defer(() =>
      query.toLowerCase() === 'error'
        ? throwError(() => new Error('Simulated network error'))
        : of(TRANSACTIONS.filter((t) => t.merchant.toLowerCase().includes(query.toLowerCase()))),
    ).pipe(delay(600));
  }
}
