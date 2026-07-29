import { useCallback, useEffect, useState } from 'react';
import {
  REFRESH_INTERVAL_MS,
  applyError,
  applyRate,
  createInitialCryptoConverterState,
  fetchRate,
  setAmount,
  setCurrency,
  type CurrencyCode,
} from './crypto-converter.store';

export function useCryptoConverter() {
  const [state, setState] = useState(createInitialCryptoConverterState);
  const [refreshNonce, setRefreshNonce] = useState(0);

  const requestRefresh = useCallback(() => {
    setRefreshNonce((nonce) => nonce + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const currency = state.currency;

    const loadRate = async () => {
      setState((current) => ({ ...current, loading: true, error: null }));

      try {
        const rate = await fetchRate(currency);
        if (cancelled) {
          return;
        }

        setState((current) => {
          if (current.currency !== currency) {
            return current;
          }

          return { ...applyRate(current, rate), loading: false };
        });
      } catch {
        if (cancelled) {
          return;
        }

        setState((current) => {
          if (current.currency !== currency) {
            return current;
          }

          return { ...applyError(current), loading: false };
        });
      }
    };

    void loadRate();

    const intervalId = setInterval(() => {
      void loadRate();
    }, REFRESH_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(intervalId);
    };
  }, [state.currency, refreshNonce]);

  const setAmountValue = useCallback(
    (amount: number) => {
      setState((current) => setAmount(current, amount));
      requestRefresh();
    },
    [requestRefresh],
  );

  const setCurrencyValue = useCallback(
    (currency: CurrencyCode) => {
      setState((current) => setCurrency(current, currency));
      requestRefresh();
    },
    [requestRefresh],
  );

  return {
    amount: state.amount,
    currency: state.currency,
    wucAmount: state.wucAmount,
    wucChange: state.wucChange,
    error: state.error,
    setAmount: setAmountValue,
    setCurrency: setCurrencyValue,
  };
}
