import {
  filterCreditCardTransactions,
  getPaymentAmountCents,
} from './rxjs-banking.helpers';
import { CreditCardTransaction, PaymentSummary } from './rxjs-banking.models';

const transactions: CreditCardTransaction[] = [
  {
    id: 'txn-1',
    merchant: 'Whole Foods',
    category: 'Groceries',
    status: 'posted',
    postedAt: '2026-06-20',
    amountCents: 8421,
  },
  {
    id: 'txn-2',
    merchant: 'United Airlines',
    category: 'Travel',
    status: 'pending',
    postedAt: '2026-06-21',
    amountCents: 32544,
  },
  {
    id: 'txn-3',
    merchant: 'Unknown Store',
    category: 'Shopping',
    status: 'declined',
    postedAt: '2026-06-22',
    amountCents: 19999,
  },
];

const summary: PaymentSummary = {
  accountId: 'card-123',
  minimumDueCents: 3500,
  statementBalanceCents: 126450,
  currentBalanceCents: 142010,
  dueDate: '2026-07-12',
};

describe('RxJS banking interview helpers', () => {
  it('filters transactions by search text and status', () => {
    const result = filterCreditCardTransactions(transactions, {
      search: 'air',
      status: 'pending',
    });

    expect(result.map((transaction) => transaction.id)).toEqual(['txn-2']);
  });

  it('returns no transactions when status does not match', () => {
    const result = filterCreditCardTransactions(transactions, {
      search: 'air',
      status: 'posted',
    });

    expect(result).toEqual([]);
  });

  it('resolves built-in payment amount options in cents', () => {
    expect(getPaymentAmountCents(summary, 'minimumDue', 0)).toBe(3500);
    expect(getPaymentAmountCents(summary, 'statementBalance', 0)).toBe(126450);
    expect(getPaymentAmountCents(summary, 'currentBalance', 0)).toBe(142010);
  });

  it('uses custom payment amount when custom is selected', () => {
    expect(getPaymentAmountCents(summary, 'custom', 5000)).toBe(5000);
  });
});
