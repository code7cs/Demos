import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  Observable,
  Subject,
  catchError,
  combineLatest,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import { formatCents, getPaymentAmountCents } from './rxjs-banking.helpers';
import { RxjsBankingApiService } from './rxjs-banking-api.service';
import {
  PaymentAmountOption,
  PaymentConfirmation,
  PaymentSummary,
} from './rxjs-banking.models';

interface PaymentSubmitState {
  submitting: boolean;
  confirmation: PaymentConfirmation | null;
  error: string | null;
}

@Component({
  selector: 'app-rxjs-payment-form',
  standalone: true,
  imports: [AsyncPipe, DatePipe, ReactiveFormsModule],
  templateUrl: './rxjs-payment-form.component.html',
  styleUrl: './rxjs-banking.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RxjsPaymentFormComponent {
  private readonly api = inject(RxjsBankingApiService);
  private readonly submitSubject = new Subject<void>();

  protected readonly form = new FormGroup({
    amountOption: new FormControl<PaymentAmountOption>('minimumDue', { nonNullable: true }),
    customAmountCents: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.min(1)],
    }),
  });

  protected readonly summary$: Observable<PaymentSummary> = this.api.fetchPaymentSummary().pipe(
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  protected readonly selectedAmountCents$ = combineLatest([
    this.summary$,
    this.form.controls.amountOption.valueChanges.pipe(startWith(this.form.controls.amountOption.value)),
    this.form.controls.customAmountCents.valueChanges.pipe(
      startWith(this.form.controls.customAmountCents.value),
    ),
  ]).pipe(
    map(([summary, option, customAmountCents]) =>
      getPaymentAmountCents(summary, option, customAmountCents),
    ),
  );

  protected readonly canSubmit$ = combineLatest([this.summary$, this.selectedAmountCents$]).pipe(
    map(([summary, amountCents]) => amountCents > 0 && amountCents <= summary.currentBalanceCents),
  );

  protected readonly submitState$: Observable<PaymentSubmitState> = this.submitSubject.pipe(
    switchMap(() =>
      combineLatest([this.summary$, this.selectedAmountCents$]).pipe(
        switchMap(([summary, amountCents]) => {
          if (amountCents <= 0 || amountCents > summary.currentBalanceCents) {
            return of({
              submitting: false,
              confirmation: null,
              error: 'Enter an amount greater than $0 and no more than the current balance.',
            });
          }

          return this.api.submitPayment(amountCents).pipe(
            map((confirmation) => ({ submitting: false, confirmation, error: null })),
            startWith({ submitting: true, confirmation: null, error: null }),
            catchError(() =>
              of({
                submitting: false,
                confirmation: null,
                error: 'Payment could not be submitted.',
              }),
            ),
          );
        }),
      ),
    ),
    startWith({ submitting: false, confirmation: null, error: null }),
  );

  protected submitPayment(): void {
    this.form.markAllAsTouched();
    this.submitSubject.next();
  }

  protected formatMoney(amountCents: number): string {
    return formatCents(amountCents);
  }
}
