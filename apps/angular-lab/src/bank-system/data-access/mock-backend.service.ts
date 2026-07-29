import { Injectable } from '@angular/core';
import {
  Account,
  BankingDashboard,
  RequestStatus,
  Transaction,
  TransactionPage,
  TransactionQuery,
  TransferDraft,
  TransferReceipt,
} from '../state/banking.models';

@Injectable()
export class MockBackendService {
  private readonly accounts: Account[] = [
    {
      id: 'checking-1',
      type: 'checking',
      displayName: '360 Checking',
      maskedNumber: '...2234',
      availableBalanceCents: 842350,
      currentBalanceCents: 842350,
    },
    {
      id: 'savings-1',
      type: 'savings',
      displayName: 'Performance Savings',
      maskedNumber: '...8821',
      availableBalanceCents: 1850000,
      currentBalanceCents: 1850000,
    },
    {
      id: 'card-1',
      type: 'credit-card',
      displayName: 'Venture X Card',
      maskedNumber: '...4409',
      availableBalanceCents: 1270000,
      currentBalanceCents: -32642,
      dueDate: '2026-07-12',
    },
  ];

  private readonly transactions: Transaction[] = [
    {
      id: 'txn-1001',
      accountId: 'checking-1',
      amountCents: -4275,
      merchant: 'Capital One Travel',
      description: 'Hotel deposit',
      status: 'posted',
      postedAt: '2026-06-15',
    },
    {
      id: 'txn-1002',
      accountId: 'checking-1',
      amountCents: 520000,
      merchant: 'Cisco Systems',
      description: 'Payroll',
      status: 'posted',
      postedAt: '2026-06-14',
    },
    {
      id: 'txn-1003',
      accountId: 'card-1',
      amountCents: -18970,
      merchant: 'United Airlines',
      description: 'Flight booking',
      status: 'pending',
      postedAt: '2026-06-16',
    },
    {
      id: 'txn-1004',
      accountId: 'card-1',
      amountCents: -8100,
      merchant: 'Restaurant',
      description: 'Team dinner',
      status: 'posted',
      postedAt: '2026-06-13',
    },
  ];

  private readonly requestStatuses = new Map<string, TransferReceipt>();

  async getDashboard(userIdFromSession: string): Promise<BankingDashboard> {
    this.assertAuthenticated(userIdFromSession);
    await this.networkDelay();

    return {
      accounts: this.accounts.map((account) => ({ ...account })),
      recentTransactions: this.transactions.slice(0, 4).map((transaction) => ({ ...transaction })),
      lastUpdated: new Date().toISOString(),
    };
  }

  async getTransactions(query: TransactionQuery): Promise<TransactionPage> {
    await this.networkDelay();
    const normalizedSearch = query.search.trim().toLowerCase();

    const items = this.transactions
      .filter((transaction) => transaction.accountId === query.accountId)
      .filter((transaction) => query.status === 'all' || transaction.status === query.status)
      .filter((transaction) => {
        if (!normalizedSearch) {
          return true;
        }

        return `${transaction.merchant} ${transaction.description}`.toLowerCase().includes(normalizedSearch);
      })
      .slice(0, query.limit);

    return { items };
  }

  async submitTransfer(
    draft: TransferDraft,
    idempotencyKey: string,
    csrfToken: string,
  ): Promise<TransferReceipt> {
    await this.networkDelay();
    this.assertCsrfToken(csrfToken);

    const existingReceipt = this.requestStatuses.get(idempotencyKey);
    if (existingReceipt) {
      return existingReceipt;
    }

    if (draft.fromAccountId === draft.toAccountId) {
      throw new Error('Source and destination accounts must be different.');
    }

    if (draft.amountCents <= 0) {
      throw new Error('Transfer amount must be greater than zero.');
    }

    const receipt: TransferReceipt = {
      requestId: idempotencyKey,
      status: 'processing',
      submittedAt: new Date().toISOString(),
      message: 'Transfer accepted. Backend status is still processing.',
    };

    this.requestStatuses.set(idempotencyKey, receipt);
    setTimeout(() => {
      this.requestStatuses.set(idempotencyKey, {
        ...receipt,
        status: 'completed',
        message: 'Transfer completed by backend payment service.',
      });
    }, 1800);

    return receipt;
  }

  async getRequestStatus(requestId: string): Promise<TransferReceipt> {
    await this.networkDelay();
    const receipt = this.requestStatuses.get(requestId);
    if (!receipt) {
      return {
        requestId,
        status: 'unknown' as RequestStatus,
        submittedAt: new Date().toISOString(),
        message: 'Request status is unknown. Do not blindly resubmit.',
      };
    }

    return { ...receipt };
  }

  private assertAuthenticated(userIdFromSession: string): void {
    if (!userIdFromSession) {
      throw new Error('No authenticated session.');
    }
  }

  private assertCsrfToken(csrfToken: string): void {
    if (csrfToken !== 'mock-csrf-token-from-secure-cookie') {
      throw new Error('Invalid CSRF token.');
    }
  }

  private networkDelay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 250));
  }
}
