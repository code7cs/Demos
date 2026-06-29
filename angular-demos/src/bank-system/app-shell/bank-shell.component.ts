import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { ArchitectureMapComponent } from '../components/architecture-map/architecture-map.component';
import { StatusBannerComponent } from '../components/status-banner/status-banner.component';
import { DashboardPageComponent } from '../pages/dashboard/dashboard-page.component';
import { TransactionsPageComponent } from '../pages/transactions/transactions-page.component';
import { TransferWizardPageComponent } from '../pages/transfer-wizard/transfer-wizard-page.component';
import { BankingStore } from '../state/banking.store';

type DemoTab = 'dashboard' | 'transactions' | 'transfer' | 'architecture';

@Component({
  selector: 'bank-shell',
  standalone: true,
  imports: [
    ArchitectureMapComponent,
    DashboardPageComponent,
    JsonPipe,
    StatusBannerComponent,
    TransactionsPageComponent,
    TransferWizardPageComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bank-shell.component.html',
  styleUrl: './bank-shell.component.css',
})
export class BankShellComponent implements OnInit {
  protected readonly store = inject(BankingStore);
  protected readonly activeTab = signal<DemoTab>('architecture');

  async ngOnInit(): Promise<void> {
    await this.store.loadPortal();
  }

  protected show(tab: DemoTab): void {
    this.activeTab.set(tab);
  }
}
