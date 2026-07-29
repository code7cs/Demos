export type TransactionStatus = 'pending' | 'posted' | 'declined';
export type TransactionFilterStatus = 'all' | TransactionStatus;
export type PaymentAmountOption = 'minimumDue' | 'statementBalance' | 'currentBalance' | 'custom';

export interface CreditCardTransaction {
  id: string;
  merchant: string;
  category: string;
  status: TransactionStatus;
  postedAt: string;
  amountCents: number;
}

export interface TransactionFilters {
  search: string;
  status: TransactionFilterStatus;
}

export interface PaymentSummary {
  accountId: string;
  minimumDueCents: number;
  statementBalanceCents: number;
  currentBalanceCents: number;
  dueDate: string;
}

export interface PaymentConfirmation {
  confirmationId: string;
  amountCents: number;
  submittedAt: string;
}
