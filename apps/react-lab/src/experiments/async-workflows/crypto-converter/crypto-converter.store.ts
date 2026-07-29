const API_BASE = 'https://api.frontendeval.com/fake/crypto';
export const REFRESH_INTERVAL_MS = 10_000;

export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'CNY', 'JPY'] as const;
export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number];

interface CryptoRateResponse {
  value: number;
}

export interface CryptoConverterState {
  amount: number;
  currency: CurrencyCode;
  wucAmount: number | null;
  wucChange: number | null;
  loading: boolean;
  error: string | null;
  lastRate: number | null;
}

export function createInitialCryptoConverterState(): CryptoConverterState {
  return {
    amount: 1000,
    currency: 'USD',
    wucAmount: null,
    wucChange: null,
    loading: false,
    error: null,
    lastRate: null,
  };
}

async function fetchRate(currency: CurrencyCode): Promise<number> {
  const code = currency.toLowerCase();
  const response = await fetch(`${API_BASE}/${code}`);

  if (!response.ok) {
    throw new Error('Failed to fetch rate');
  }

  const data = (await response.json()) as CryptoRateResponse;
  return data.value;
}

export function applyRate(state: CryptoConverterState, newRate: number): CryptoConverterState {
  const amount = state.amount;
  const previousRate = state.lastRate;
  const newWuc = amount / newRate;

  let wucChange = state.wucChange;
  if (previousRate !== null) {
    const previousWuc = amount / previousRate;
    wucChange = newWuc - previousWuc;
  }

  return {
    ...state,
    lastRate: newRate,
    wucAmount: newWuc,
    wucChange,
    error: null,
  };
}

export function applyError(state: CryptoConverterState): CryptoConverterState {
  return {
    ...state,
    error: 'Could not fetch the exchange rate for this currency.',
    lastRate: null,
    wucAmount: null,
    wucChange: null,
  };
}

export function setAmount(state: CryptoConverterState, amount: number): CryptoConverterState {
  const next = { ...state, amount };

  if (state.lastRate !== null) {
    return { ...next, wucAmount: amount / state.lastRate };
  }

  return next;
}

export function setCurrency(state: CryptoConverterState, currency: CurrencyCode): CryptoConverterState {
  return {
    ...state,
    currency,
    lastRate: null,
    wucAmount: null,
    wucChange: null,
  };
}

export { fetchRate };
