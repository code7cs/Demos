import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TRANSACTIONS, Transaction, TransactionStatus } from '../shared/models';
@Component({
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<main>
    <h1>Search, filter, sort</h1>
    <input [(ngModel)]="query" placeholder="Merchant" /><select [(ngModel)]="status">
      <option value="all">All</option>
      <option value="posted">Posted</option>
      <option value="pending">Pending</option></select
    ><button (click)="toggleSort()">Amount {{ sortDirection }}</button>
    <p>{{ getVisibleTransactions().length }} results</p>
    <table>
      <tbody>
        @for (t of getVisibleTransactions(); track t.id) {
          <tr>
            <td>{{ t.merchant }}</td>
            <td>{{ t.status }}</td>
            <td>{{ t.amountCents / 100 | currency }}</td>
          </tr>
        } @empty {
          <tr>
            <td>No transactions</td>
          </tr>
        }
      </tbody>
    </table>
  </main>`,
  styles: [
    `
      main {
        max-width: 760px;
        margin: auto;
        padding: 2rem;
      }
      input,
      select,
      button {
        margin: 0 0.5rem 0.75rem 0;
        padding: 0.5rem;
      }
      table {
        width: 100%;
      }
      td {
        padding: 0.5rem;
        border-bottom: 1px solid #ddd;
      }
    `,
  ],
})
export class SearchSortComponent {
  query = '';
  status: TransactionStatus | 'all' = 'all';
  sortDirection: 'asc' | 'desc' = 'asc';
  getVisibleTransactions(): Transaction[] {
    const q = this.query.trim().toLowerCase();
    return TRANSACTIONS.filter(
      (t) =>
        (!q || t.merchant.toLowerCase().includes(q)) &&
        (this.status === 'all' || t.status === this.status),
    ).sort((a, b) =>
      this.sortDirection === 'asc' ? a.amountCents - b.amountCents : b.amountCents - a.amountCents,
    );
  }
  toggleSort(): void {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
  }
}
