import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BankShellComponent } from './app-shell/bank-shell.component';
import { BankingApiService } from './data-access/banking-api.service';
import { BankingBffService } from './data-access/banking-bff.service';
import { MockBackendService } from './data-access/mock-backend.service';
import { AuthSessionService } from './security/auth-session.service';
import { CsrfTokenService } from './security/csrf-token.service';
import { BankingStore } from './state/banking.store';
import { TelemetryService } from './telemetry/telemetry.service';

@Component({
  selector: 'app-bank-system',
  standalone: true,
  imports: [BankShellComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './bank-system.component.html',
  styleUrl: './bank-system.component.css',
  providers: [
    AuthSessionService,
    BankingApiService,
    BankingBffService,
    BankingStore,
    CsrfTokenService,
    MockBackendService,
    TelemetryService,
  ],
})
export class BankSystemComponent {
  protected readonly store = inject(BankingStore);
}
