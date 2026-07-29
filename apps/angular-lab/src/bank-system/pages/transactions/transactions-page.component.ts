import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransactionTableComponent } from '../../components/transaction-table/transaction-table.component';
import { BankingStore } from '../../state/banking.store';

@Component({
  selector: 'bank-transactions-page',
  standalone: true,
  imports: [FormsModule, TransactionTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transactions-page.component.html',
  styleUrl: './transactions-page.component.css',
})
export class TransactionsPageComponent {
  protected readonly store = inject(BankingStore);

  protected async onSearch(search: string): Promise<void> {
    await this.store.updateTransactionSearch(search);
  }
}
