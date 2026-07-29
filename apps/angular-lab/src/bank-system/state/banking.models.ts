export type AccountType = 'checking' | 'savings' | 'credit-card';
export type TransactionStatus = 'pending' | 'posted' | 'failed' | 'reversed';
export type RequestStatus = 'idle' | 'processing' | 'completed' | 'failed' | 'unknown';

export interface Account {
  id: string;
  type: AccountType;
  displayName: string;
  maskedNumber: string;
  availableBalanceCents: number;
  currentBalanceCents: number;
  dueDate?: string;
}

export interface Transaction {
  id: string;
  accountId: string;
  amountCents: number;
  merchant: string;
  description: string;
  status: TransactionStatus;
  postedAt: string;
}

export interface TransferDraft {
  fromAccountId: string;
  toAccountId: string;
  amountCents: number;
  memo: string;
}

export interface TransferReceipt {
  requestId: string;
  status: RequestStatus;
  submittedAt: string;
  message: string;
}

export interface BankingDashboard {
  accounts: Account[];
  recentTransactions: Transaction[];
  lastUpdated: string;
}

export interface TransactionQuery {
  accountId: string;
  search: string;
  status: 'all' | TransactionStatus;
  limit: number;
  cursor?: string;
}

export interface TransactionPage {
  items: Transaction[];
  nextCursor?: string;
}

export interface BankingError {
  title: string;
  message: string;
  recoverable: boolean;
}
