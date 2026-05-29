import { useCallback, useMemo, useState } from 'react';
import {
  applyDelta,
  canRedo,
  canUndo,
  createInitialUndoableCounterState,
  formatAction,
  getHistoryLines,
  redo,
  undo,
} from './undoable-counter.store';

export function useUndoableCounter() {
  const [state, setState] = useState(createInitialUndoableCounterState);

  const historyLines = useMemo(() => getHistoryLines(state.history), [state.history]);

  return {
    count: state.count,
    historyLines,
    canUndo: canUndo(state),
    canRedo: canRedo(state),
    applyDelta: useCallback((delta: number) => {
      setState((current) => applyDelta(current, delta));
    }, []),
    undo: useCallback(() => {
      setState((current) => undo(current));
    }, []),
    redo: useCallback(() => {
      setState((current) => redo(current));
    }, []),
    formatButtonLabel: (delta: number) => `[${formatAction(delta)}]`,
  };
}
