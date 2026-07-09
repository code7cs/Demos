import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TRANSACTIONS, Transaction } from '../shared/models';
export interface CategoryTotal {
  category: string;
  count: number;
  totalCents: number;
}
@Component({
  standalone: true,
  imports: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<main>
    <h1>Group and aggregate</h1>
    <table>
      <tr>
        <th>Category</th>
        <th>Count</th>
        <th>Total</th>
      </tr>
      @for (x of groupByCategory(transactions); track x.category) {
        <tr>
          <td>{{ x.category }}</td>
          <td>{{ x.count }}</td>
          <td>{{ x.totalCents / 100 | currency }}</td>
        </tr>
      }
    </table>
  </main>`,
  styles: [
    `
      main {
        max-width: 650px;
        margin: auto;
        padding: 2rem;
      }
      table {
        width: 100%;
      }
      th,
      td {
        text-align: left;
        padding: 0.5rem;
        border-bottom: 1px solid #ddd;
      }
    `,
  ],
})
export class GroupAggregateComponent {
  readonly transactions = TRANSACTIONS;
  groupByCategory(items: Transaction[]): CategoryTotal[] {
    const map = new Map<string, CategoryTotal>();
    for (const t of items) {
      const x = map.get(t.category) ?? { category: t.category, count: 0, totalCents: 0 };
      x.count++;
      x.totalCents += t.amountCents;
      map.set(t.category, x);
    }
    return [...map.values()].sort((a, b) => b.totalCents - a.totalCents);
  }
}
