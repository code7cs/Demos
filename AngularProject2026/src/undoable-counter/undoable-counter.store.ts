import { Injectable, computed, signal } from '@angular/core';

export interface HistoryEntry {
  delta: number;
  before: number;
  after: number;
}

export const MAX_UNDO_ACTIONS = 50;

export function formatAction(delta: number): string {
  return delta > 0 ? `+${delta}` : `${delta}`;
}

export function formatHistoryEntry(entry: HistoryEntry): string {
  return `${formatAction(entry.delta)} (${entry.before} -> ${entry.after})`;
}

@Injectable()
export class UndoableCounterStore {
  readonly count = signal(0);

  private readonly history = signal<HistoryEntry[]>([]);
  private readonly redoStack = signal<HistoryEntry[]>([]);

  readonly historyLines = computed(() =>
    this.history().map((entry) => formatHistoryEntry(entry)),
  );

  readonly canUndo = computed(() => this.history().length > 0);
  readonly canRedo = computed(() => this.redoStack().length > 0);

  applyDelta(delta: number): void {
    const before = this.count();
    const after = before + delta;
    const entry: HistoryEntry = { delta, before, after };

    this.count.set(after);
    this.redoStack.set([]);

    const nextHistory = [entry, ...this.history()].slice(0, MAX_UNDO_ACTIONS);
    this.history.set(nextHistory);
  }

  undo(): void {
    const [latest, ...rest] = this.history();
    if (!latest) {
      return;
    }

    this.count.set(latest.before);
    this.history.set(rest);
    this.redoStack.update((stack) => [latest, ...stack]);
  }

  redo(): void {
    const [latest, ...rest] = this.redoStack();
    if (!latest) {
      return;
    }

    this.count.set(latest.after);
    this.redoStack.set(rest);
    this.history.update((entries) => [latest, ...entries].slice(0, MAX_UNDO_ACTIONS));
  }
}
