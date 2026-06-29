import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'cr-pagination',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {
  readonly pageIndex = input(0);
  readonly totalPages = input(1);
  readonly totalCount = input(0);
  readonly pageSize = input(5);
  readonly disabled = input(false);

  readonly pageChange = output<number>();

  protected readonly rangeLabel = computed(() => {
    if (this.totalCount() === 0) {
      return '0 results';
    }

    const start = this.pageIndex() * this.pageSize() + 1;
    const end = Math.min((this.pageIndex() + 1) * this.pageSize(), this.totalCount());
    return `${start}-${end} of ${this.totalCount()}`;
  });

  protected previous(): void {
    this.pageChange.emit(this.pageIndex() - 1);
  }

  protected next(): void {
    this.pageChange.emit(this.pageIndex() + 1);
  }
}
