import type { ChangeEvent } from 'react';
import { SUPPORTED_CURRENCIES, type CurrencyCode } from './crypto-converter.store';
import { useCryptoConverter } from './useCryptoConverter';
import './CryptoConverter.css';

function formatWuc(value: number | null): string {
  if (value === null) {
    return '—';
  }

  return value.toFixed(2);
}

function formatChange(value: number | null): string {
  if (value === null) {
    return '';
  }

  const absolute = Math.abs(value).toFixed(2);
  if (value > 0) {
    return `↑ ${absolute}`;
  }

  if (value < 0) {
    return `↓ ${absolute}`;
  }

  return '0.00';
}

function changeDirection(value: number | null): 'up' | 'down' | 'flat' | null {
  if (value === null || value === 0) {
    return value === 0 ? 'flat' : null;
  }

  return value > 0 ? 'up' : 'down';
}

export default function CryptoConverter() {
  const store = useCryptoConverter();
  const direction = changeDirection(store.wucChange);

  const onAmountInput = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);

    if (!Number.isFinite(value) || value < 0) {
      return;
    }

    store.setAmount(value);
  };

  const onCurrencyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    store.setCurrency(event.target.value as CurrencyCode);
  };

  return (
    <section className="crypto-converter">
      <h1 className="title">Crypto Converter</h1>
      <p className="subtitle">Convert fiat currency into Wildly Unstable Coin (WUC).</p>

      <div className="controls">
        <input
          type="number"
          className="amount-input"
          min={0}
          step="any"
          aria-label="Amount to convert"
          value={store.amount}
          onChange={onAmountInput}
        />

        <div className="select-wrap">
          <select
            className="currency-select"
            aria-label="Source currency"
            value={store.currency}
            onChange={onCurrencyChange}
          >
            {SUPPORTED_CURRENCIES.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="result-row" aria-live="polite">
        {store.error ? (
          <p className="error">{store.error}</p>
        ) : (
          <p className="wuc-result">
            <span className="wuc-amount">{formatWuc(store.wucAmount)} WUC</span>
            {direction !== null && (
              <span className={`wuc-change ${direction}`}>{formatChange(store.wucChange)}</span>
            )}
          </p>
        )}
      </div>
    </section>
  );
}
