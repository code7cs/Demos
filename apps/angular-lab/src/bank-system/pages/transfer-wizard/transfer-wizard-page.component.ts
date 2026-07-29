import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StatusBannerComponent } from '../../components/status-banner/status-banner.component';
import { BankingStore } from '../../state/banking.store';

@Component({
  selector: 'bank-transfer-wizard-page',
  standalone: true,
  imports: [FormsModule, StatusBannerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transfer-wizard-page.component.html',
  styleUrl: './transfer-wizard-page.component.css',
})
export class TransferWizardPageComponent {
  protected readonly store = inject(BankingStore);

  protected updateAmount(value: string): void {
    const amount = Number(value);
    this.store.updateDraft({ amountCents: Number.isFinite(amount) ? Math.round(amount * 100) : 0 });
  }
}
