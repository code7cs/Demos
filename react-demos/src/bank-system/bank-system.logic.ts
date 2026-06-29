export type TransactionType = 'deposit' | 'withdraw' | 'transfer-in' | 'transfer-out';

export interface Transaction {
  id: string;
  accountId: string;
  type: TransactionType;
  amountCents: number;
  resultingBalanceCents: number;
  counterpartyAccountId?: string;
  createdAt: string;
}

export interface AccountSnapshot {
  accountId: string;
  ownerName: string;
  balanceCents: number;
  transactions: Transaction[];
}

interface AccountRecord {
  accountId: string;
  ownerName: string;
  balanceCents: number;
  transactions: Transaction[];
}

export class BankSystem {
  private readonly accounts = new Map<string, AccountRecord>();
  private nextTransactionId = 1;

  createAccount(accountId: string, ownerName: string, openingBalanceCents = 0): AccountSnapshot {
    if (this.accounts.has(accountId)) {
      throw new Error(`Account ${accountId} already exists.`);
    }

    this.assertValidAmount(openingBalanceCents, true);
    this.accounts.set(accountId, {
      accountId,
      ownerName,
      balanceCents: openingBalanceCents,
      transactions: [],
    });

    if (openingBalanceCents > 0) {
      this.record(accountId, 'deposit', openingBalanceCents);
    }

    return this.getAccount(accountId);
  }

  deposit(accountId: string, amountCents: number): AccountSnapshot {
    this.assertValidAmount(amountCents);
    const account = this.requireAccount(accountId);

    account.balanceCents += amountCents;
    this.record(accountId, 'deposit', amountCents);

    return this.getAccount(accountId);
  }

  withdraw(accountId: string, amountCents: number): AccountSnapshot {
    this.assertValidAmount(amountCents);
    const account = this.requireAccount(accountId);
    this.assertSufficientFunds(account, amountCents);

    account.balanceCents -= amountCents;
    this.record(accountId, 'withdraw', amountCents);

    return this.getAccount(accountId);
  }

  transfer(fromAccountId: string, toAccountId: string, amountCents: number): AccountSnapshot[] {
    this.assertValidAmount(amountCents);
    if (fromAccountId === toAccountId) {
      throw new Error('Cannot transfer to the same account.');
    }

    const from = this.requireAccount(fromAccountId);
    const to = this.requireAccount(toAccountId);
    this.assertSufficientFunds(from, amountCents);

    from.balanceCents -= amountCents;
    to.balanceCents += amountCents;

    this.record(fromAccountId, 'transfer-out', amountCents, toAccountId);
    this.record(toAccountId, 'transfer-in', amountCents, fromAccountId);

    return [this.getAccount(fromAccountId), this.getAccount(toAccountId)];
  }

  getAccount(accountId: string): AccountSnapshot {
    return this.cloneAccount(this.requireAccount(accountId));
  }

  getAccounts(): AccountSnapshot[] {
    return Array.from(this.accounts.values()).map((account) => this.cloneAccount(account));
  }

  private record(
    accountId: string,
    type: TransactionType,
    amountCents: number,
    counterpartyAccountId?: string,
  ): void {
    const account = this.requireAccount(accountId);
    account.transactions.push({
      id: `txn-${this.nextTransactionId++}`,
      accountId,
      type,
      amountCents,
      counterpartyAccountId,
      resultingBalanceCents: account.balanceCents,
      createdAt: new Date().toISOString(),
    });
  }

  private requireAccount(accountId: string): AccountRecord {
    const account = this.accounts.get(accountId);
    if (!account) {
      throw new Error(`Account ${accountId} does not exist.`);
    }
    return account;
  }

  private assertValidAmount(amountCents: number, allowZero = false): void {
    const validNumber = Number.isInteger(amountCents);
    const validValue = allowZero ? amountCents >= 0 : amountCents > 0;

    if (!validNumber || !validValue) {
      throw new Error('Amount must be a positive integer number of cents.');
    }
  }

  private assertSufficientFunds(account: AccountRecord, amountCents: number): void {
    if (account.balanceCents < amountCents) {
      throw new Error(`Insufficient funds in account ${account.accountId}.`);
    }
  }

  private cloneAccount(account: AccountRecord): AccountSnapshot {
    return {
      ...account,
      transactions: account.transactions.map((transaction) => ({ ...transaction })),
    };
  }
}

export function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
