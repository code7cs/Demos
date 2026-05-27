import { TestBed } from '@angular/core/testing';
import { UndoableCounterStore } from './undoable-counter.store';

describe('UndoableCounterStore', () => {
  let store: UndoableCounterStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UndoableCounterStore],
    });
    store = TestBed.inject(UndoableCounterStore);
  });

  it('starts at zero with empty history', () => {
    expect(store.count()).toBe(0);
    expect(store.historyLines()).toEqual([]);
    expect(store.canUndo()).toBe(false);
    expect(store.canRedo()).toBe(false);
  });

  it('records history in ACTION (BEFORE -> AFTER) format', () => {
    store.applyDelta(1);
    expect(store.count()).toBe(1);
    expect(store.historyLines()).toEqual(['+1 (0 -> 1)']);
  });

  it('undoes the last action and enables redo', () => {
    store.applyDelta(10);
    store.undo();

    expect(store.count()).toBe(0);
    expect(store.historyLines()).toEqual([]);
    expect(store.canRedo()).toBe(true);
  });

  it('redoes an undone action and restores history', () => {
    store.applyDelta(10);
    store.undo();
    store.redo();

    expect(store.count()).toBe(10);
    expect(store.historyLines()).toEqual(['+10 (0 -> 10)']);
    expect(store.canRedo()).toBe(false);
  });

  it('clears redo stack when a new action is applied after undo', () => {
    store.applyDelta(1);
    store.undo();
    store.applyDelta(100);

    expect(store.canRedo()).toBe(false);
    expect(store.historyLines()).toEqual(['+100 (0 -> 100)']);
  });
});
