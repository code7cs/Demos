import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Transaction } from '../../state/banking.models';

@Component({
  selector: 'bank-transaction-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.css',
})
export class TransactionTableComponent {
  readonly transactions = input.required<Transaction[]>();

  formatMoney(cents: number): string {
    const sign = cents < 0 ? '-' : '';
    const abs = Math.abs(cents) / 100;
    return `${sign}$${abs.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }
}
