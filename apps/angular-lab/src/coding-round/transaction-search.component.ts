import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { PaginationComponent } from './components/pagination/pagination.component';
import { SearchToolbarComponent } from './components/search-toolbar/search-toolbar.component';
import { TransactionTableComponent } from './components/transaction-table/transaction-table.component';
import { TransactionApiService } from './data-access/transaction-api.service';
import { TransactionSearchStore } from './state/transaction-search.store';

@Component({
  selector: 'app-transaction-search',
  standalone: true,
  imports: [SearchToolbarComponent, TransactionTableComponent, PaginationComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './transaction-search.component.html',
  styleUrl: './transaction-search.component.css',
  providers: [TransactionApiService, TransactionSearchStore],
})
export class TransactionSearchComponent implements OnInit {
  protected readonly store = inject(TransactionSearchStore);

  ngOnInit(): void {
    void this.store.load();
  }

  protected retry(): void {
    void this.store.load();
  }
}
