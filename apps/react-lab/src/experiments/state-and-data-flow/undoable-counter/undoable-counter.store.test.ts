import { describe, expect, it } from 'vitest';
import {
  applyDelta,
  canRedo,
  canUndo,
  createInitialUndoableCounterState,
  getHistoryLines,
  redo,
  undo,
} from './undoable-counter.store';

describe('UndoableCounterStore', () => {
  it('starts at zero with empty history', () => {
    const state = createInitialUndoableCounterState();

    expect(state.count).toBe(0);
    expect(getHistoryLines(state.history)).toEqual([]);
    expect(canUndo(state)).toBe(false);
    expect(canRedo(state)).toBe(false);
  });

  it('records history in ACTION (BEFORE -> AFTER) format', () => {
    const state = applyDelta(createInitialUndoableCounterState(), 1);

    expect(state.count).toBe(1);
    expect(getHistoryLines(state.history)).toEqual(['+1 (0 -> 1)']);
  });

  it('undoes the last action and enables redo', () => {
    let state = applyDelta(createInitialUndoableCounterState(), 10);
    state = undo(state);

    expect(state.count).toBe(0);
    expect(getHistoryLines(state.history)).toEqual([]);
    expect(canRedo(state)).toBe(true);
  });

  it('redoes an undone action and restores history', () => {
    let state = applyDelta(createInitialUndoableCounterState(), 10);
    state = undo(state);
    state = redo(state);

    expect(state.count).toBe(10);
    expect(getHistoryLines(state.history)).toEqual(['+10 (0 -> 10)']);
    expect(canRedo(state)).toBe(false);
  });

  it('clears redo stack when a new action is applied after undo', () => {
    let state = applyDelta(createInitialUndoableCounterState(), 1);
    state = undo(state);
    state = applyDelta(state, 100);

    expect(canRedo(state)).toBe(false);
    expect(getHistoryLines(state.history)).toEqual(['+100 (0 -> 100)']);
  });
});
