import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Account } from '../../state/banking.models';

@Component({
  selector: 'bank-account-summary-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './account-summary-card.component.html',
  styleUrl: './account-summary-card.component.css',
})
export class AccountSummaryCardComponent {
  readonly account = input.required<Account>();

  formatMoney(cents: number): string {
    const sign = cents < 0 ? '-' : '';
    const abs = Math.abs(cents) / 100;
    return `${sign}$${abs.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }
}
