import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { SortDirection, SortField, Transaction } from '../../models/transaction.models';

@Component({
  selector: 'cr-transaction-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transaction-table.component.html',
  styleUrl: './transaction-table.component.css',
})
export class TransactionTableComponent {
  readonly transactions = input.required<Transaction[]>();
  readonly sortField = input.required<SortField>();
  readonly sortDirection = input.required<SortDirection>();
  readonly loading = input(false);

  readonly sortChange = output<SortField>();

  protected sortLabel(field: SortField): string {
    if (this.sortField() !== field) {
      return '';
    }

    return this.sortDirection() === 'asc' ? ' ↑' : ' ↓';
  }

  protected formatMoney(cents: number): string {
    const sign = cents < 0 ? '-' : '';
    const amount = Math.abs(cents) / 100;
    return `${sign}$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }
}
