import { Injectable, computed, inject, signal } from '@angular/core';
import { TransactionApiService } from '../data-access/transaction-api.service';
import {
  SortDirection,
  SortField,
  Transaction,
  TransactionPage,
  TransactionQuery,
  TransactionStatus,
} from '../models/transaction.models';

@Injectable()
export class TransactionSearchStore {
  private readonly api = inject(TransactionApiService);

  private readonly source = signal<Transaction[]>([]);

  readonly search = signal('');
  readonly status = signal<'all' | TransactionStatus>('all');
  readonly sortField = signal<SortField>('postedAt');
  readonly sortDirection = signal<SortDirection>('desc');
  readonly pageIndex = signal(0);
  readonly pageSize = signal(5);

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly query = computed<TransactionQuery>(() => ({
    search: this.search().trim().toLowerCase(),
    status: this.status(),
    sortField: this.sortField(),
    sortDirection: this.sortDirection(),
    pageIndex: this.pageIndex(),
    pageSize: this.pageSize(),
  }));

  readonly page = computed<TransactionPage>(() => {
    const query = this.query();
    const filtered = this.source().filter((transaction) => matchesStatus(transaction, query.status));
    const searched = filtered.filter((transaction) => matchesSearch(transaction, query.search));
    const sorted = sortTransactions(searched, query.sortField, query.sortDirection);
    const totalCount = sorted.length;
    const start = query.pageIndex * query.pageSize;
    const items = sorted.slice(start, start + query.pageSize);

    return {
      items,
      totalCount,
      pageIndex: query.pageIndex,
      pageSize: query.pageSize,
    };
  });

  readonly totalPages = computed(() => {
    const { totalCount, pageSize } = this.page();
    return Math.max(1, Math.ceil(totalCount / pageSize));
  });

  readonly isEmpty = computed(() => !this.loading() && !this.error() && this.page().totalCount === 0);

  async load(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);

    try {
      const transactions = await this.api.fetchTransactions();
      this.source.set(transactions);
      this.pageIndex.set(0);
    } catch (error) {
      this.source.set([]);
      this.error.set(error instanceof Error ? error.message : 'Something went wrong.');
    } finally {
      this.loading.set(false);
    }
  }

  setSearch(value: string): void {
    this.search.set(value);
    this.pageIndex.set(0);
  }

  setStatus(value: 'all' | TransactionStatus): void {
    this.status.set(value);
    this.pageIndex.set(0);
  }

  toggleSort(field: SortField): void {
    if (this.sortField() === field) {
      this.sortDirection.update((direction) => (direction === 'asc' ? 'desc' : 'asc'));
      return;
    }

    this.sortField.set(field);
    this.sortDirection.set(field === 'merchant' ? 'asc' : 'desc');
    this.pageIndex.set(0);
  }

  goToPage(index: number): void {
    const clamped = Math.min(Math.max(index, 0), this.totalPages() - 1);
    this.pageIndex.set(clamped);
  }

  simulateError(): void {
    this.api.simulateNextFailure();
    void this.load();
  }
}

function matchesStatus(transaction: Transaction, status: TransactionQuery['status']): boolean {
  return status === 'all' || transaction.status === status;
}

function matchesSearch(transaction: Transaction, search: string): boolean {
  if (!search) {
    return true;
  }

  const haystack = `${transaction.merchant} ${transaction.description}`.toLowerCase();
  return haystack.includes(search);
}

function sortTransactions(
  transactions: Transaction[],
  field: SortField,
  direction: SortDirection,
): Transaction[] {
  const multiplier = direction === 'asc' ? 1 : -1;

  return [...transactions].sort((left, right) => {
    if (field === 'merchant') {
      return left.merchant.localeCompare(right.merchant) * multiplier;
    }

    if (field === 'amountCents') {
      return (left.amountCents - right.amountCents) * multiplier;
    }

    return left.postedAt.localeCompare(right.postedAt) * multiplier;
  });
}
