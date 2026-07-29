import { useEffect, useState } from 'react';
import {
  getTransactions,
  type Transaction,
} from './account-activity.store';

type CategoryFilter = Transaction['category'] | 'All';

const formatMoney = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

export default function AccountActivity() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    getTransactions(controller.signal)
      .then(setTransactions)
      .catch((requestError: unknown) => {
        if (
          requestError instanceof DOMException &&
          requestError.name === 'AbortError'
        ) {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load transactions',
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [retryCount]);

  const visibleTransactions = transactions
    .filter((transaction) =>
      transaction.description.toLowerCase().includes(search.toLowerCase()),
    )
    .filter(
      (transaction) =>
        category === 'All' || transaction.category === category,
    )
    .sort(
      (left, right) =>
        new Date(right.date).getTime() - new Date(left.date).getTime(),
    );

  const totals = transactions.reduce(
    (result, transaction) => {
      if (transaction.amount > 0) result.income += transaction.amount;
      else result.expenses += Math.abs(transaction.amount);
      result.net += transaction.amount;
      return result;
    },
    { income: 0, expenses: 0, net: 0 },
  );

  const selectedTransaction = transactions.find(
    (transaction) => transaction.id === selectedId,
  );

  if (loading) {
    return <p role="status">Loading transactions…</p>;
  }

  if (error) {
    return (
      <section role="alert">
        <p>{error}</p>
        <button
          type="button"
          onClick={() => setRetryCount((count) => count + 1)}
        >
          Retry
        </button>
      </section>
    );
  }

  return (
    <main className="account-activity">
      <header>
        <p>MoneyLion practice</p>
        <h1>Account Activity</h1>
        <p>View your account activity.</p>
      </header>

      {transactions.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
        <>
          <section aria-label="Account totals">
            <p>Income: {formatMoney(totals.income)}</p>
            <p>Expenses: {formatMoney(totals.expenses)}</p>
            <p>Net: {formatMoney(totals.net)}</p>
          </section>

          <section aria-label="Transaction filters">
            <label>
              Search
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>

            <label>
              Category
              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as CategoryFilter)
                }
              >
                <option value="All">All</option>
                <option value="Income">Income</option>
                <option value="Food">Food</option>
                <option value="Bills">Bills</option>
                <option value="Shopping">Shopping</option>
              </select>
            </label>
          </section>

          <p>{visibleTransactions.length} transactions found</p>

          {visibleTransactions.length === 0 ? (
            <p>No matching transactions</p>
          ) : (
            <ul>
              {visibleTransactions.map((transaction) => (
                <li key={transaction.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(transaction.id)}
                  >
                    {transaction.description} · {transaction.category} ·{' '}
                    {formatMoney(transaction.amount)} ·{' '}
                    {new Date(transaction.date).toLocaleDateString()}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {selectedTransaction && (
            <section aria-live="polite">
              <h2>Transaction details</h2>
              <p>{selectedTransaction.description}</p>
              <p>{selectedTransaction.category}</p>
              <p>{formatMoney(selectedTransaction.amount)}</p>
              <button type="button" onClick={() => setSelectedId(null)}>
                Close
              </button>
            </section>
          )}
        </>
      )}
    </main>
  );
}
