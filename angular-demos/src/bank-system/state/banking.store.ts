import { Injectable, computed, inject, signal } from '@angular/core';
import { mapApiError } from '../data-access/api-error.mapper';
import { BankingBffService } from '../data-access/banking-bff.service';
import { TelemetryService } from '../telemetry/telemetry.service';
import {
  Account,
  BankingError,
  RequestStatus,
  Transaction,
  TransferDraft,
  TransferReceipt,
} from './banking.models';

@Injectable()
export class BankingStore {
  private readonly bff = inject(BankingBffService);
  private readonly telemetry = inject(TelemetryService);

  readonly displayName = signal('');
  readonly accounts = signal<Account[]>([]);
  readonly recentTransactions = signal<Transaction[]>([]);
  readonly selectedAccountId = signal('checking-1');
  readonly transactionSearch = signal('');
  readonly visibleTransactions = signal<Transaction[]>([]);
  readonly error = signal<BankingError | null>(null);
  readonly requestStatus = signal<RequestStatus>('idle');
  readonly latestReceipt = signal<TransferReceipt | null>(null);
  readonly lastUpdated = signal('');
  readonly telemetryEvents = computed(() => this.telemetry.events);

  readonly transferDraft = signal<TransferDraft>({
    fromAccountId: 'checking-1',
    toAccountId: 'savings-1',
    amountCents: 12500,
    memo: 'Move money to savings',
  });

  readonly selectedAccount = computed(() => {
    return this.accounts().find((account) => account.id === this.selectedAccountId()) ?? null;
  });

  async loadPortal(): Promise<void> {
    try {
      this.error.set(null);
      const home = await this.bff.getPortalHome();
      this.displayName.set(home.displayName);
      this.accounts.set(home.accounts);
      this.recentTransactions.set(home.recentTransactions);
      this.lastUpdated.set(home.lastUpdated);
      await this.loadTransactions();
    } catch (error) {
      this.error.set(mapApiError(error));
    }
  }

  async selectAccount(accountId: string): Promise<void> {
    this.selectedAccountId.set(accountId);
    await this.loadTransactions();
  }

  async updateTransactionSearch(search: string): Promise<void> {
    this.transactionSearch.set(search);
    await this.loadTransactions();
  }

  updateDraft(patch: Partial<TransferDraft>): void {
    this.transferDraft.update((draft) => ({ ...draft, ...patch }));
  }

  async submitTransfer(): Promise<void> {
    try {
      this.error.set(null);
      this.requestStatus.set('processing');
      const receipt = await this.bff.submitTransfer(this.transferDraft());
      this.latestReceipt.set(receipt);
      this.requestStatus.set(receipt.status);
    } catch (error) {
      this.error.set(mapApiError(error));
      this.requestStatus.set('failed');
    }
  }

  async refreshRequestStatus(): Promise<void> {
    const receipt = this.latestReceipt();
    if (!receipt) {
      return;
    }

    const updatedReceipt = await this.bff.getRequestStatus(receipt.requestId);
    this.latestReceipt.set(updatedReceipt);
    this.requestStatus.set(updatedReceipt.status);
  }

  formatMoney(cents: number): string {
    const abs = Math.abs(cents) / 100;
    const sign = cents < 0 ? '-' : '';
    return `${sign}$${abs.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }

  private async loadTransactions(): Promise<void> {
    const transactions = await this.bff.getTransactions(this.selectedAccountId(), this.transactionSearch());
    this.visibleTransactions.set(transactions);
  }
}
