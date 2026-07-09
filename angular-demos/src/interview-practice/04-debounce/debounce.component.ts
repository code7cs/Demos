import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, debounceTime, distinctUntilChanged, map } from 'rxjs';
import { TRANSACTIONS, Transaction } from '../shared/models';
@Component({
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<main>
    <h1>RxJS debounce</h1>
    <input [ngModel]="input" (ngModelChange)="onQueryChange($event)" placeholder="Type quickly" />
    <p>Processed query: {{ query || '(empty)' }}</p>
    <ul>
      @for (t of results; track t.id) {
        <li>{{ t.merchant }}</li>
      }
    </ul>
  </main>`,
  styles: [
    `
      main {
        max-width: 650px;
        margin: auto;
        padding: 2rem;
      }
      input {
        padding: 0.6rem;
        width: 100%;
      }
    `,
  ],
})
export class DebounceComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly query$ = new Subject<string>();
  input = '';
  query = '';
  results: Transaction[] = TRANSACTIONS;
  constructor() {
    this.query$
      .pipe(
        map((x) => x.trim().toLowerCase()),
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((q) => {
        this.query = q;
        this.results = TRANSACTIONS.filter((t) => t.merchant.toLowerCase().includes(q));
        this.cdr.markForCheck();
      });
  }
  onQueryChange(value: string): void {
    this.input = value;
    this.query$.next(value);
  }
}
