import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BankingError, RequestStatus, TransferReceipt } from '../../state/banking.models';

@Component({
  selector: 'bank-status-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './status-banner.component.html',
  styleUrl: './status-banner.component.css',
})
export class StatusBannerComponent {
  readonly error = input<BankingError | null>(null);
  readonly requestStatus = input<RequestStatus>('idle');
  readonly receipt = input<TransferReceipt | null>(null);
}
