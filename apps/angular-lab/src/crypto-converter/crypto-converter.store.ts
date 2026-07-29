import { HttpClient } from '@angular/common/http';
import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, Subject, catchError, finalize, merge, switchMap, tap, timer } from 'rxjs';

const API_BASE = 'https://api.frontendeval.com/fake/crypto';
const REFRESH_INTERVAL_MS = 10_000;

export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'CNY', 'JPY'] as const;
export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number];

interface CryptoRateResponse {
  value: number;
}

@Injectable()
export class CryptoConverterStore {
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);
  private readonly refreshRequest$ = new Subject<void>();

  readonly amount = signal(1000);
  readonly currency = signal<CurrencyCode>('USD');
  readonly wucAmount = signal<number | null>(null);
  readonly wucChange = signal<number | null>(null);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  private readonly lastRate = signal<number | null>(null);

  constructor() {
    merge(timer(0, REFRESH_INTERVAL_MS), this.refreshRequest$)
      .pipe(
        switchMap(() => this.fetchRate$()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  setAmount(amount: number): void {
    this.amount.set(amount);

    const rate = this.lastRate();
    if (rate !== null) {
      this.wucAmount.set(amount / rate);
    }

    this.refreshRequest$.next();
  }

  setCurrency(currency: CurrencyCode): void {
    this.currency.set(currency);
    this.lastRate.set(null);
    this.wucAmount.set(null);
    this.wucChange.set(null);
    this.refreshRequest$.next();
  }

  private fetchRate$() {
    const code = this.currency().toLowerCase();
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<CryptoRateResponse>(`${API_BASE}/${code}`).pipe(
      tap((response) => this.applyRate(response.value)),
      catchError(() => {
        this.applyError();
        return EMPTY;
      }),
      finalize(() => this.loading.set(false)),
    );
  }

  private applyRate(newRate: number): void {
    const amount = this.amount();
    const previousRate = this.lastRate();
    const newWuc = amount / newRate;

    if (previousRate !== null) {
      const previousWuc = amount / previousRate;
      this.wucChange.set(newWuc - previousWuc);
    }

    this.lastRate.set(newRate);
    this.wucAmount.set(newWuc);
  }

  private applyError(): void {
    this.error.set('Could not fetch the exchange rate for this currency.');
    this.lastRate.set(null);
    this.wucAmount.set(null);
    this.wucChange.set(null);
  }
}
