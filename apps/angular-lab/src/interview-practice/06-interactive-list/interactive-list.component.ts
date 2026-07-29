import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TRANSACTIONS, Transaction } from '../shared/models';
@Component({
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<main>
    <h1>Interactive list</h1>
    <input [(ngModel)]="merchant" placeholder="Merchant" /><input
      [(ngModel)]="amount"
      type="number"
      placeholder="Amount"
    /><button (click)="addTransaction()">Add</button>
    <ul>
      @for (t of transactions; track t.id) {
        <li>
          {{ t.merchant }} - {{ t.status }} <button (click)="toggleStatus(t.id)">Toggle</button>
          <button (click)="removeTransaction(t.id)">Delete</button>
        </li>
      } @empty {
        <li>No transactions</li>
      }
    </ul>
  </main>`,
  styles: [
    `
      main {
        max-width: 700px;
        margin: auto;
        padding: 2rem;
      }
      input,
      button {
        margin: 0.25rem;
        padding: 0.5rem;
      }
      li {
        padding: 0.4rem;
      }
    `,
  ],
})
export class InteractiveListComponent {
  transactions = [...TRANSACTIONS];
  merchant = '';
  amount: number | null = null;
  private nextId = 100;
  addTransaction(): void {
    const name = this.merchant.trim();
    if (!name || this.amount === null) return;
    this.transactions = [
      ...this.transactions,
      {
        id: String(this.nextId++),
        merchant: name,
        category: 'Other',
        status: 'pending',
        amountCents: Math.round(this.amount * 100),
      },
    ];
    this.merchant = '';
    this.amount = null;
  }
  toggleStatus(id: string): void {
    this.transactions = this.transactions.map((t) =>
      t.id === id ? { ...t, status: t.status === 'posted' ? 'pending' : 'posted' } : t,
    );
  }
  removeTransaction(id: string): void {
    this.transactions = this.transactions.filter((t) => t.id !== id);
  }
}
