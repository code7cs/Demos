class BankSystem {
  constructor() {
    this.accounts = new Map();
    this.nextTransactionId = 1;
  }

  createAccount(accountId, ownerName, openingBalanceCents = 0) {
    this.assertNewAccount(accountId);
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

  deposit(accountId, amountCents) {
    this.assertValidAmount(amountCents);
    const account = this.requireAccount(accountId);

    account.balanceCents += amountCents;
    this.record(accountId, 'deposit', amountCents);

    return this.getAccount(accountId);
  }

  withdraw(accountId, amountCents) {
    this.assertValidAmount(amountCents);
    const account = this.requireAccount(accountId);
    this.assertSufficientFunds(account, amountCents);

    account.balanceCents -= amountCents;
    this.record(accountId, 'withdraw', amountCents);

    return this.getAccount(accountId);
  }

  transfer(fromAccountId, toAccountId, amountCents) {
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

    return {
      from: this.getAccount(fromAccountId),
      to: this.getAccount(toAccountId),
    };
  }

  getAccount(accountId) {
    const account = this.requireAccount(accountId);
    return {
      ...account,
      transactions: account.transactions.map((transaction) => ({ ...transaction })),
    };
  }

  getStatement(accountId) {
    return this.getAccount(accountId).transactions;
  }

  record(accountId, type, amountCents, counterpartyAccountId = null) {
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

  requireAccount(accountId) {
    const account = this.accounts.get(accountId);
    if (!account) {
      throw new Error(`Account ${accountId} does not exist.`);
    }
    return account;
  }

  assertNewAccount(accountId) {
    if (this.accounts.has(accountId)) {
      throw new Error(`Account ${accountId} already exists.`);
    }
  }

  assertValidAmount(amountCents, allowZero = false) {
    const validNumber = Number.isInteger(amountCents);
    const validValue = allowZero ? amountCents >= 0 : amountCents > 0;

    if (!validNumber || !validValue) {
      throw new Error('Amount must be a positive integer number of cents.');
    }
  }

  assertSufficientFunds(account, amountCents) {
    if (account.balanceCents < amountCents) {
      throw new Error(`Insufficient funds in account ${account.accountId}.`);
    }
  }
}

function formatMoney(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

function runDemo() {
  const bank = new BankSystem();

  bank.createAccount('checking-1', 'Hanfan', 100000);
  bank.createAccount('savings-1', 'Hanfan', 25000);
  bank.deposit('checking-1', 5000);
  bank.withdraw('checking-1', 1200);
  bank.transfer('checking-1', 'savings-1', 20000);

  console.log('Checking:', formatMoney(bank.getAccount('checking-1').balanceCents));
  console.log('Savings:', formatMoney(bank.getAccount('savings-1').balanceCents));
  console.table(bank.getStatement('checking-1'));
}

runDemo();

module.exports = { BankSystem, formatMoney };
