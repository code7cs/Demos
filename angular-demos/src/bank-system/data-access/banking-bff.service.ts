import { Injectable, inject } from '@angular/core';
import {
  Account,
  BankingDashboard,
  Transaction,
  TransferDraft,
  TransferReceipt,
} from '../state/banking.models';
import { AuthSessionService } from '../security/auth-session.service';
import { TelemetryService } from '../telemetry/telemetry.service';
import { BankingApiService } from './banking-api.service';
import { createIdempotencyKey } from './idempotency-key';

export interface PortalHomeViewModel {
  displayName: string;
  accounts: Account[];
  recentTransactions: Transaction[];
  lastUpdated: string;
}

@Injectable()
export class BankingBffService {
  private readonly api = inject(BankingApiService);
  private readonly auth = inject(AuthSessionService);
  private readonly telemetry = inject(TelemetryService);

  private dashboardCache?: BankingDashboard;

  async getPortalHome(): Promise<PortalHomeViewModel> {
    const session = this.auth.session();
    const dashboard = this.dashboardCache ?? (await this.api.getDashboard(session.userId));
    this.dashboardCache = dashboard;
    this.telemetry.track('dashboard_loaded', { accountCount: dashboard.accounts.length });

    return {
      displayName: session.displayName,
      accounts: dashboard.accounts,
      recentTransactions: dashboard.recentTransactions,
      lastUpdated: dashboard.lastUpdated,
    };
  }

  async getTransactions(accountId: string, search: string): Promise<Transaction[]> {
    const page = await this.api.getTransactions({
      accountId,
      search,
      status: 'all',
      limit: 25,
    });
    this.telemetry.track('transactions_loaded', { accountId, count: page.items.length });
    return page.items;
  }

  async submitTransfer(draft: TransferDraft): Promise<TransferReceipt> {
    const idempotencyKey = createIdempotencyKey();
    this.telemetry.track('transfer_submitted', { amountCents: draft.amountCents });
    const receipt = await this.api.submitTransfer(draft, idempotencyKey);
    this.dashboardCache = undefined;
    return receipt;
  }

  getRequestStatus(requestId: string): Promise<TransferReceipt> {
    return this.api.getRequestStatus(requestId);
  }
}
