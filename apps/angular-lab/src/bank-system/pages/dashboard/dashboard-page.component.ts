import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AccountSummaryCardComponent } from '../../components/account-summary-card/account-summary-card.component';
import { TransactionTableComponent } from '../../components/transaction-table/transaction-table.component';
import { BankingStore } from '../../state/banking.store';

@Component({
  selector: 'bank-dashboard-page',
  standalone: true,
  imports: [AccountSummaryCardComponent, TransactionTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.css',
})
export class DashboardPageComponent {
  protected readonly store = inject(BankingStore);
}
