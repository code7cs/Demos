import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AgGridAngular } from 'ag-grid-angular';
import {
  AllCommunityModule,
  ColDef,
  GridApi,
  GridReadyEvent,
  ModuleRegistry,
  ValidationModule,
  GetRowIdParams,
  themeQuartz,
} from 'ag-grid-community';
import { PricingFeedService } from './pricing-feed.service';
import { PriceQuote } from './pricing.models';
ModuleRegistry.registerModules([AllCommunityModule, ValidationModule]);
@Component({
  selector: 'app-realtime-pricing',
  standalone: true,
  imports: [AgGridAngular, DatePipe],
  templateUrl: './realtime-pricing.component.html',
  styleUrl: './realtime-pricing.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RealtimePricingComponent {
  private readonly destroyRef = inject(DestroyRef);
  readonly feed = inject(PricingFeedService);
  readonly theme = themeQuartz;
  readonly columnDefs: ColDef<PriceQuote>[] = [
    { field: 'symbol', headerName: 'Instrument', minWidth: 150 },
    { field: 'price', valueFormatter: price, type: 'rightAligned', minWidth: 110 },
    { field: 'bid', valueFormatter: price, type: 'rightAligned', minWidth: 105 },
    { field: 'ask', valueFormatter: price, type: 'rightAligned', minWidth: 105 },
    {
      field: 'dailyChange',
      headerName: 'Day Δ',
      valueFormatter: change,
      cellClass: (p) => (p.value >= 0 ? 'positive' : 'negative'),
      type: 'rightAligned',
      minWidth: 105,
    },
    {
      field: 'updatedAt',
      headerName: 'Updated',
      valueFormatter: (p) => new Date(p.value).toLocaleTimeString(),
      minWidth: 140,
    },
  ];
  readonly getRowId = (params: GetRowIdParams<PriceQuote>) => params.data.symbol;
  private gridApi?: GridApi<PriceQuote>;
  constructor() {
    // A snapshot replaces initial grid data; later feed batches use transactions below.
    effect(() => this.gridApi?.setGridOption('rowData', this.feed.rows()));
    this.feed.updates.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((updates) => {
      const add: PriceQuote[] = [];
      const update: PriceQuote[] = [];

      for (const quote of updates) {
        // A reconnect can replace the grid snapshot while a frame is queued.
        // Treat a new symbol as an add instead of issuing an invalid update transaction.
        (this.gridApi?.getRowNode(quote.symbol) ? update : add).push(quote);
      }

      this.gridApi?.applyTransaction({ add, update });
    });
    void this.feed.start();
  }
  onGridReady(event: GridReadyEvent<PriceQuote>): void {
    this.gridApi = event.api;
    event.api.setGridOption('rowData', this.feed.rows());
  }
  reconnect(): void {
    void this.feed.reconnectNow();
  }
  togglePause(): void {
    void this.feed.toggleServerPause();
  }
  burst(): void {
    void this.feed.requestBurst();
  }
  ngOnDestroy(): void {
    this.feed.stop();
  }
}
function price(params: { value: number }): string {
  return params.value.toFixed(5);
}
function change(params: { value: number }): string {
  return `${params.value >= 0 ? '+' : ''}${params.value.toFixed(5)}`;
}
