import { Component, inject } from '@angular/core';
import { formatAction, UndoableCounterStore } from './undoable-counter.store';

@Component({
  selector: 'app-undoable-counter',
  templateUrl: './undoable-counter.component.html',
  styleUrl: './undoable-counter.component.css',
  providers: [UndoableCounterStore],
})
export class UndoableCounterComponent {
  protected readonly store = inject(UndoableCounterStore);

  protected readonly negativeDeltas = [-100, -10, -1] as const;
  protected readonly positiveDeltas = [1, 10, 100] as const;

  protected formatButtonLabel(delta: number): string {
    return `[${formatAction(delta)}]`;
  }
}
