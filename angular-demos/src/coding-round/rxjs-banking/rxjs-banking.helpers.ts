import {
  CreditCardTransaction,
  PaymentAmountOption,
  PaymentSummary,
  TransactionFilters,
} from './rxjs-banking.models';

export function filterCreditCardTransactions(
  transactions: CreditCardTransaction[],
  filters: TransactionFilters,
): CreditCardTransaction[] {
  const search = filters.search.trim().toLowerCase();

  return transactions.filter((transaction) => {
    const matchesSearch =
      !search ||
      transaction.merchant.toLowerCase().includes(search) ||
      transaction.category.toLowerCase().includes(search);

    const matchesStatus = filters.status === 'all' || transaction.status === filters.status;

    return matchesSearch && matchesStatus;
  });
}

export function getPaymentAmountCents(
  summary: PaymentSummary,
  amountOption: PaymentAmountOption,
  customAmountCents: number,
): number {
  switch (amountOption) {
    case 'minimumDue':
      return summary.minimumDueCents;
    case 'statementBalance':
      return summary.statementBalanceCents;
    case 'currentBalance':
      return summary.currentBalanceCents;
    case 'custom':
      return customAmountCents;
  }
}

export function formatCents(amountCents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amountCents / 100);
}
