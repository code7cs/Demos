import { Injectable, inject } from '@angular/core';
import {
  BankingDashboard,
  TransactionPage,
  TransactionQuery,
  TransferDraft,
  TransferReceipt,
} from '../state/banking.models';
import { CsrfTokenService } from '../security/csrf-token.service';
import { MockBackendService } from './mock-backend.service';

@Injectable()
export class BankingApiService {
  private readonly backend = inject(MockBackendService);
  private readonly csrf = inject(CsrfTokenService);

  getDashboard(userIdFromSession: string): Promise<BankingDashboard> {
    return this.backend.getDashboard(userIdFromSession);
  }

  getTransactions(query: TransactionQuery): Promise<TransactionPage> {
    return this.backend.getTransactions(query);
  }

  submitTransfer(draft: TransferDraft, idempotencyKey: string): Promise<TransferReceipt> {
    return this.backend.submitTransfer(draft, idempotencyKey, this.csrf.getToken());
  }

  getRequestStatus(requestId: string): Promise<TransferReceipt> {
    return this.backend.getRequestStatus(requestId);
  }
}
