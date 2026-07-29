import { formatMoney } from './bank-system.logic';
import { useBankSystem } from './useBankSystem';
import './BankSystemDemo.css';

export default function BankSystemDemo() {
  const store = useBankSystem();

  return (
    <section className="bank-demo">
      <h1>Bank system OOD</h1>

      <div className="bank-actions" aria-label="Bank demo actions">
        <button type="button" onClick={store.depositPaycheck}>
          Deposit paycheck
        </button>
        <button type="button" onClick={store.runDemoTransfer}>
          Transfer to savings
        </button>
        <button type="button" onClick={store.simulateDeclinedWithdrawal}>
          Test insufficient funds
        </button>
      </div>

      <p className="bank-message" role="status">
        {store.message}
      </p>

      <div className="account-grid">
        {store.accounts.map((account) => (
          <article className="account-card" key={account.accountId}>
            <h2>{account.ownerName}</h2>
            <p className="account-id">{account.accountId}</p>
            <strong>{formatMoney(account.balanceCents)}</strong>

            <h3>Transactions</h3>
            <ul>
              {account.transactions.map((transaction) => (
                <li key={transaction.id}>
                  <span>{transaction.type}</span>
                  <span>{formatMoney(transaction.amountCents)}</span>
                  <span>{formatMoney(transaction.resultingBalanceCents)}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
