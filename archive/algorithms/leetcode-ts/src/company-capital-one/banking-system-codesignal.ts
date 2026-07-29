/**
 * Capital One / CodeSignal-style Banking System practice.
 *
 * This is intentionally plain in-memory TypeScript, not an app/UI version.
 * The shape mirrors common progressive-level prompts:
 *
 * Level 1: create account, deposit, withdraw/pay
 * Level 2: top activity by total transaction value
 * Level 3: pending transfer + accept within 24 hours
 *
 * npm run solve src/company-capital-one/banking-system-codesignal.ts
 */

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

type Account = {
  balance: number;
  activity: number;
};

type PendingTransfer = {
  id: string;
  source: string;
  target: string;
  amount: number;
  createdAt: number;
  accepted: boolean;
  expired: boolean;
};

class BankingSystem {
  private readonly accounts = new Map<string, Account>();
  private readonly transfers = new Map<string, PendingTransfer>();
  private nextTransferNumber = 1;

  createAccount(_timestamp: number, accountId: string): boolean {
    if (this.accounts.has(accountId)) return false;

    this.accounts.set(accountId, { balance: 0, activity: 0 });
    return true;
  }

  deposit(timestamp: number, accountId: string, amount: number): number | null {
    this.expireTransfers(timestamp);

    const account = this.accounts.get(accountId);
    if (!account || amount <= 0) return null;

    account.balance += amount;
    account.activity += amount;
    return account.balance;
  }

  withdraw(timestamp: number, accountId: string, amount: number): number | null {
    this.expireTransfers(timestamp);

    const account = this.accounts.get(accountId);
    if (!account || amount <= 0 || account.balance < amount) return null;

    account.balance -= amount;
    account.activity += amount;
    return account.balance;
  }

  pay(timestamp: number, accountId: string, amount: number): number | null {
    return this.withdraw(timestamp, accountId, amount);
  }

  topActivity(timestamp: number, n: number): string[] {
    this.expireTransfers(timestamp);

    return Array.from(this.accounts.entries())
      .sort(([leftId, left], [rightId, right]) => {
        if (right.activity !== left.activity) {
          return right.activity - left.activity;
        }

        return leftId.localeCompare(rightId);
      })
      .slice(0, n)
      .map(([accountId, account]) => `${accountId}(${account.activity})`);
  }

  transfer(timestamp: number, source: string, target: string, amount: number): string | null {
    this.expireTransfers(timestamp);

    const sourceAccount = this.accounts.get(source);
    const targetAccount = this.accounts.get(target);
    if (!sourceAccount || !targetAccount || source === target || amount <= 0) return null;
    if (sourceAccount.balance < amount) return null;

    sourceAccount.balance -= amount;

    const id = `transfer${this.nextTransferNumber++}`;
    this.transfers.set(id, {
      id,
      source,
      target,
      amount,
      createdAt: timestamp,
      accepted: false,
      expired: false,
    });

    return id;
  }

  acceptTransfer(timestamp: number, accountId: string, transferId: string): boolean {
    this.expireTransfers(timestamp);

    const transfer = this.transfers.get(transferId);
    if (!transfer || transfer.accepted || transfer.expired || transfer.target !== accountId) {
      return false;
    }

    if (timestamp - transfer.createdAt >= ONE_DAY_MS) {
      this.expireTransfer(transfer);
      return false;
    }

    const source = this.accounts.get(transfer.source);
    const target = this.accounts.get(transfer.target);
    if (!source || !target) return false;

    target.balance += transfer.amount;
    source.activity += transfer.amount;
    target.activity += transfer.amount;
    transfer.accepted = true;

    return true;
  }

  getBalance(timestamp: number, accountId: string): number | null {
    this.expireTransfers(timestamp);
    return this.accounts.get(accountId)?.balance ?? null;
  }

  private expireTransfers(timestamp: number): void {
    for (const transfer of this.transfers.values()) {
      if (!transfer.accepted && !transfer.expired && timestamp - transfer.createdAt >= ONE_DAY_MS) {
        this.expireTransfer(transfer);
      }
    }
  }

  private expireTransfer(transfer: PendingTransfer): void {
    const source = this.accounts.get(transfer.source);
    if (source) {
      source.balance += transfer.amount;
    }

    transfer.expired = true;
  }
}

type TestCase = {
  name: string;
  run: () => unknown;
  expected: unknown;
};

function runTests(cases: TestCase[]): void {
  let passed = 0;

  for (let i = 0; i < cases.length; i++) {
    const { name, run, expected } = cases[i];
    const got = run();
    const ok = JSON.stringify(got) === JSON.stringify(expected);

    console.log(
      ok ? "✓" : "✗",
      `${name}:`,
      ok ? "pass" : `expected ${JSON.stringify(expected)}, got ${JSON.stringify(got)}`
    );

    if (ok) passed++;
  }

  console.log(`${passed}/${cases.length} passed\n`);
}

runTests([
  {
    name: "level 1 basic account operations",
    run: () => {
      const bank = new BankingSystem();

      return [
        bank.createAccount(1, "acctA"),
        bank.createAccount(2, "acctA"),
        bank.deposit(3, "acctA", 1000),
        bank.withdraw(4, "acctA", 250),
        bank.withdraw(5, "acctA", 1000),
        bank.deposit(6, "missing", 100),
      ];
    },
    expected: [true, false, 1000, 750, null, null],
  },
  {
    name: "level 2 top activity sorts by amount desc then account id",
    run: () => {
      const bank = new BankingSystem();

      bank.createAccount(1, "acctB");
      bank.createAccount(2, "acctA");
      bank.createAccount(3, "acctC");
      bank.deposit(4, "acctA", 500);
      bank.deposit(5, "acctB", 500);
      bank.deposit(6, "acctC", 200);
      bank.withdraw(7, "acctC", 50);

      return bank.topActivity(8, 3);
    },
    expected: ["acctA(500)", "acctB(500)", "acctC(250)"],
  },
  {
    name: "level 3 pending transfer withholds source until accepted",
    run: () => {
      const bank = new BankingSystem();

      bank.createAccount(1, "source");
      bank.createAccount(2, "target");
      bank.deposit(3, "source", 1000);
      const transferId = bank.transfer(4, "source", "target", 300);

      return [
        transferId,
        bank.getBalance(5, "source"),
        bank.getBalance(6, "target"),
        bank.acceptTransfer(7, "target", transferId ?? ""),
        bank.getBalance(8, "source"),
        bank.getBalance(9, "target"),
        bank.topActivity(10, 2),
      ];
    },
    expected: ["transfer1", 700, 0, true, 700, 300, ["source(1300)", "target(300)"]],
  },
  {
    name: "level 3 rejects wrong target and duplicate accept",
    run: () => {
      const bank = new BankingSystem();

      bank.createAccount(1, "source");
      bank.createAccount(2, "target");
      bank.createAccount(3, "other");
      bank.deposit(4, "source", 1000);
      const transferId = bank.transfer(5, "source", "target", 200) ?? "";

      return [
        bank.acceptTransfer(6, "other", transferId),
        bank.acceptTransfer(7, "target", transferId),
        bank.acceptTransfer(8, "target", transferId),
      ];
    },
    expected: [false, true, false],
  },
  {
    name: "level 3 expired transfer refunds source",
    run: () => {
      const bank = new BankingSystem();

      bank.createAccount(1, "source");
      bank.createAccount(2, "target");
      bank.deposit(3, "source", 1000);
      const transferId = bank.transfer(4, "source", "target", 400) ?? "";

      return [
        bank.getBalance(5, "source"),
        bank.acceptTransfer(4 + ONE_DAY_MS, "target", transferId),
        bank.getBalance(4 + ONE_DAY_MS + 1, "source"),
        bank.getBalance(4 + ONE_DAY_MS + 2, "target"),
        bank.topActivity(4 + ONE_DAY_MS + 3, 2),
      ];
    },
    expected: [600, false, 1000, 0, ["source(1000)", "target(0)"]],
  },
  {
    name: "invalid pending transfers do not consume transfer ids",
    run: () => {
      const bank = new BankingSystem();

      bank.createAccount(1, "source");
      bank.createAccount(2, "target");
      bank.deposit(3, "source", 100);

      return [
        bank.transfer(4, "source", "missing", 10),
        bank.transfer(5, "source", "source", 10),
        bank.transfer(6, "source", "target", 10),
      ];
    },
    expected: [null, null, "transfer1"],
  },
]);

export { BankingSystem };
