import { Injectable } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';
import {
  CreditCardTransaction,
  PaymentConfirmation,
  PaymentSummary,
} from './rxjs-banking.models';

const TRANSACTIONS: CreditCardTransaction[] = [
  {
    id: 'txn-001',
    merchant: 'Whole Foods',
    category: 'Groceries',
    status: 'posted',
    postedAt: '2026-06-20',
    amountCents: 8421,
  },
  {
    id: 'txn-002',
    merchant: 'United Airlines',
    category: 'Travel',
    status: 'pending',
    postedAt: '2026-06-21',
    amountCents: 32544,
  },
  {
    id: 'txn-003',
    merchant: 'Netflix',
    category: 'Entertainment',
    status: 'posted',
    postedAt: '2026-06-15',
    amountCents: 2299,
  },
  {
    id: 'txn-004',
    merchant: 'Unknown Online Store',
    category: 'Shopping',
    status: 'declined',
    postedAt: '2026-06-22',
    amountCents: 19999,
  },
  {
    id: 'txn-005',
    merchant: 'Shell',
    category: 'Gas',
    status: 'posted',
    postedAt: '2026-06-18',
    amountCents: 5112,
  },
];

const PAYMENT_SUMMARY: PaymentSummary = {
  accountId: 'card-123',
  minimumDueCents: 3500,
  statementBalanceCents: 126450,
  currentBalanceCents: 142010,
  dueDate: '2026-07-12',
};

@Injectable({ providedIn: 'root' })
export class RxjsBankingApiService {
  fetchTransactions(): Observable<CreditCardTransaction[]> {
    return of(TRANSACTIONS).pipe(delay(400));
  }

  fetchPaymentSummary(): Observable<PaymentSummary> {
    return of(PAYMENT_SUMMARY).pipe(delay(400));
  }

  submitPayment(amountCents: number): Observable<PaymentConfirmation> {
    if (amountCents <= 0 || amountCents > PAYMENT_SUMMARY.currentBalanceCents) {
      return throwError(() => new Error('Payment amount is invalid.'));
    }

    return of({
      confirmationId: 'pay-001',
      amountCents,
      submittedAt: new Date().toISOString(),
    }).pipe(delay(500));
  }
}
