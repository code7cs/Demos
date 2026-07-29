import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, catchError, debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { MockApiService } from '../shared/mock-api.service';
import { Transaction } from '../shared/models';
type State = 'idle' | 'loading' | 'success' | 'empty' | 'error';
@Component({
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<main>
    <h1>Request states and cancellation</h1>
    <input (ngModelChange)="search($event)" ngModel placeholder="Try market or error" />
    @if (state === 'loading') {
      <p>Loading...</p>
    } @else if (state === 'error') {
      <p>Request failed. Try again.</p>
    } @else if (state === 'empty') {
      <p>No results.</p>
    } @else {
      <ul>
        @for (t of results; track t.id) {
          <li>{{ t.merchant }}</li>
        }
      </ul>
    }
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
export class RequestStateComponent {
  private readonly api = inject(MockApiService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly queries = new Subject<string>();
  state: State = 'idle';
  results: Transaction[] = [];
  constructor() {
    this.queries
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        tap(() => {
          this.state = 'loading';
          this.cdr.markForCheck();
        }),
        switchMap((q) =>
          this.api.search(q).pipe(
            catchError(() => {
              this.state = 'error';
              return of([] as Transaction[]);
            }),
          ),
        ),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe((items) => {
        if (this.state !== 'error') this.state = items.length ? 'success' : 'empty';
        this.results = items;
        this.cdr.markForCheck();
      });
  }
  search(query: string): void {
    this.queries.next(query.trim());
  }
}
