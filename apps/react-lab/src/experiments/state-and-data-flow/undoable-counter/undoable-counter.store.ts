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

export interface UndoableCounterState {
  count: number;
  history: HistoryEntry[];
  redoStack: HistoryEntry[];
}

export function createInitialUndoableCounterState(): UndoableCounterState {
  return { count: 0, history: [], redoStack: [] };
}

export function getHistoryLines(history: HistoryEntry[]): string[] {
  return history.map((entry) => formatHistoryEntry(entry));
}

export function canUndo(state: UndoableCounterState): boolean {
  return state.history.length > 0;
}

export function canRedo(state: UndoableCounterState): boolean {
  return state.redoStack.length > 0;
}

export function applyDelta(state: UndoableCounterState, delta: number): UndoableCounterState {
  const before = state.count;
  const after = before + delta;
  const entry: HistoryEntry = { delta, before, after };

  return {
    count: after,
    redoStack: [],
    history: [entry, ...state.history].slice(0, MAX_UNDO_ACTIONS),
  };
}

export function undo(state: UndoableCounterState): UndoableCounterState {
  const [latest, ...rest] = state.history;
  if (!latest) {
    return state;
  }

  return {
    count: latest.before,
    history: rest,
    redoStack: [latest, ...state.redoStack],
  };
}

export function redo(state: UndoableCounterState): UndoableCounterState {
  const [latest, ...rest] = state.redoStack;
  if (!latest) {
    return state;
  }

  return {
    count: latest.after,
    redoStack: rest,
    history: [latest, ...state.history].slice(0, MAX_UNDO_ACTIONS),
  };
}
