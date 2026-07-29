import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  CryptoConverterStore,
  CurrencyCode,
  SUPPORTED_CURRENCIES,
} from './crypto-converter.store';

@Component({
  selector: 'app-crypto-converter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './crypto-converter.component.html',
  styleUrl: './crypto-converter.component.css',
  providers: [CryptoConverterStore],
})
export class CryptoConverterComponent {
  protected readonly store = inject(CryptoConverterStore);
  protected readonly currencies = SUPPORTED_CURRENCIES;

  protected onAmountInput(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);

    if (!Number.isFinite(value) || value < 0) {
      return;
    }

    this.store.setAmount(value);
  }

  protected onCurrencyChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as CurrencyCode;
    this.store.setCurrency(value);
  }

  protected formatWuc(value: number | null): string {
    if (value === null) {
      return '—';
    }

    return value.toFixed(2);
  }

  protected formatChange(value: number | null): string {
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

  protected changeDirection(value: number | null): 'up' | 'down' | 'flat' | null {
    if (value === null || value === 0) {
      return value === 0 ? 'flat' : null;
    }

    return value > 0 ? 'up' : 'down';
  }
}
