import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  Observable,
  catchError,
  combineLatest,
  map,
  of,
  shareReplay,
  startWith,
} from 'rxjs';
import { formatCents, filterCreditCardTransactions } from './rxjs-banking.helpers';
import { RxjsBankingApiService } from './rxjs-banking-api.service';
import {
  CreditCardTransaction,
  TransactionFilterStatus,
} from './rxjs-banking.models';

interface TransactionSearchVm {
  loading: boolean;
  error: string | null;
  transactions: CreditCardTransaction[];
  totalCents: number;
}

@Component({
  selector: 'app-rxjs-transaction-search',
  standalone: true,
  imports: [AsyncPipe, DatePipe, ReactiveFormsModule],
  templateUrl: './rxjs-transaction-search.component.html',
  styleUrl: './rxjs-banking.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RxjsTransactionSearchComponent {
  private readonly api = inject(RxjsBankingApiService);

  protected readonly searchControl = new FormControl('', { nonNullable: true });
  protected readonly statusControl = new FormControl<TransactionFilterStatus>('all', {
    nonNullable: true,
  });
  protected readonly statuses: TransactionFilterStatus[] = ['all', 'pending', 'posted', 'declined'];

  private readonly transactionsState$ = this.api.fetchTransactions().pipe(
    map((transactions) => ({ loading: false, error: null, transactions })),
    startWith({ loading: true, error: null, transactions: [] }),
    catchError(() =>
      of({
        loading: false,
        error: 'Could not load transactions. Please try again.',
        transactions: [],
      }),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  protected readonly vm$: Observable<TransactionSearchVm> = combineLatest([
    this.transactionsState$,
    this.searchControl.valueChanges.pipe(startWith(this.searchControl.value)),
    this.statusControl.valueChanges.pipe(startWith(this.statusControl.value)),
  ]).pipe(
    map(([state, search, status]) => {
      const transactions = filterCreditCardTransactions(state.transactions, { search, status });
      const totalCents = transactions.reduce((total, transaction) => total + transaction.amountCents, 0);

      return {
        loading: state.loading,
        error: state.error,
        transactions,
        totalCents,
      };
    }),
  );

  protected formatMoney(amountCents: number): string {
    return formatCents(amountCents);
  }
}
