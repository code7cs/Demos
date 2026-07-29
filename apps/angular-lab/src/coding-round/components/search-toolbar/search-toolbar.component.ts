import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TransactionStatus } from '../../models/transaction.models';

@Component({
  selector: 'cr-search-toolbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search-toolbar.component.html',
  styleUrl: './search-toolbar.component.css',
})
export class SearchToolbarComponent {
  readonly search = input('');
  readonly status = input<'all' | TransactionStatus>('all');
  readonly loading = input(false);

  readonly searchChange = output<string>();
  readonly statusChange = output<'all' | TransactionStatus>();

  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchChange.emit(value);
  }

  protected onStatusChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as 'all' | TransactionStatus;
    this.statusChange.emit(value);
  }
}
