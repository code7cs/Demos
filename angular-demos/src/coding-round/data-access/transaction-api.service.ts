import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.models';

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tx-1', merchant: 'Whole Foods', description: 'Groceries', status: 'posted', postedAt: '2026-06-16', amountCents: -8425 },
  { id: 'tx-2', merchant: 'Shell', description: 'Gas station', status: 'posted', postedAt: '2026-06-15', amountCents: -5200 },
  { id: 'tx-3', merchant: 'Amazon', description: 'Office supplies', status: 'pending', postedAt: '2026-06-15', amountCents: -12999 },
  { id: 'tx-4', merchant: 'Capital One', description: 'Paycheck deposit', status: 'posted', postedAt: '2026-06-14', amountCents: 325000 },
  { id: 'tx-5', merchant: 'Netflix', description: 'Subscription', status: 'posted', postedAt: '2026-06-13', amountCents: -1599 },
  { id: 'tx-6', merchant: 'Delta Airlines', description: 'Flight booking', status: 'posted', postedAt: '2026-06-12', amountCents: -48250 },
  { id: 'tx-7', merchant: 'Starbucks', description: 'Coffee', status: 'posted', postedAt: '2026-06-12', amountCents: -625 },
  { id: 'tx-8', merchant: 'Target', description: 'Household items', status: 'failed', postedAt: '2026-06-11', amountCents: -7340 },
  { id: 'tx-9', merchant: 'Spotify', description: 'Subscription', status: 'posted', postedAt: '2026-06-10', amountCents: -1099 },
  { id: 'tx-10', merchant: 'Uber', description: 'Ride share', status: 'posted', postedAt: '2026-06-09', amountCents: -2340 },
  { id: 'tx-11', merchant: 'CVS Pharmacy', description: 'Health products', status: 'pending', postedAt: '2026-06-09', amountCents: -2899 },
  { id: 'tx-12', merchant: 'Apple', description: 'App Store purchase', status: 'posted', postedAt: '2026-06-08', amountCents: -999 },
  { id: 'tx-13', merchant: 'Con Edison', description: 'Utility bill', status: 'posted', postedAt: '2026-06-07', amountCents: -14500 },
  { id: 'tx-14', merchant: 'Chipotle', description: 'Lunch', status: 'posted', postedAt: '2026-06-06', amountCents: -1485 },
  { id: 'tx-15', merchant: 'Best Buy', description: 'Electronics', status: 'posted', postedAt: '2026-06-05', amountCents: -89999 },
];

@Injectable()
export class TransactionApiService {
  private shouldFailNext = false;

  /** Dev helper for practicing the error state in the UI. */
  simulateNextFailure(): void {
    this.shouldFailNext = true;
  }

  async fetchTransactions(): Promise<Transaction[]> {
    await delay(700);

    if (this.shouldFailNext) {
      this.shouldFailNext = false;
      throw new Error('Unable to load transactions. Please try again.');
    }

    return MOCK_TRANSACTIONS.map((transaction) => ({ ...transaction }));
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
