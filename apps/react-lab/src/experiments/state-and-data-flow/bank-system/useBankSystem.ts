import { useMemo, useState } from 'react';
import { BankSystem } from './bank-system.logic';
import type { AccountSnapshot } from './bank-system.logic';

function seedBank(): BankSystem {
  const bank = new BankSystem();
  bank.createAccount('checking-1', 'Hanfan', 100000);
  bank.createAccount('savings-1', 'Hanfan', 25000);
  return bank;
}

export function useBankSystem() {
  const bank = useMemo(() => seedBank(), []);
  const [accounts, setAccounts] = useState<AccountSnapshot[]>(() => bank.getAccounts());
  const [message, setMessage] = useState('Seeded checking and savings accounts.');

  function refresh(nextMessage: string): void {
    setAccounts(bank.getAccounts());
    setMessage(nextMessage);
  }

  function runDemoTransfer(): void {
    try {
      bank.transfer('checking-1', 'savings-1', 20000);
      refresh('Transferred $200.00 from checking to savings.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unknown transfer error.');
    }
  }

  function depositPaycheck(): void {
    bank.deposit('checking-1', 50000);
    refresh('Deposited $500.00 into checking.');
  }

  function simulateDeclinedWithdrawal(): void {
    try {
      bank.withdraw('savings-1', 999999);
      refresh('Withdrawal completed.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unknown withdrawal error.');
    }
  }

  return {
    accounts,
    message,
    depositPaycheck,
    runDemoTransfer,
    simulateDeclinedWithdrawal,
  };
}
