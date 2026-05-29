import { useUndoableCounter } from './useUndoableCounter';
import './UndoableCounter.css';

const NEGATIVE_DELTAS = [-100, -10, -1] as const;
const POSITIVE_DELTAS = [1, 10, 100] as const;

export default function UndoableCounter() {
  const store = useUndoableCounter();

  return (
    <div className="counter-app">
      <h1 className="title">Undoable counter</h1>

      <div className="undo-redo">
        <button type="button" className="btn" disabled={!store.canUndo} onClick={store.undo}>
          Undo
        </button>
        <button type="button" className="btn" disabled={!store.canRedo} onClick={store.redo}>
          Redo
        </button>
      </div>

      <div className="counter-row">
        <div className="delta-group">
          {NEGATIVE_DELTAS.map((delta) => (
            <button
              key={delta}
              type="button"
              className="btn delta-btn"
              onClick={() => store.applyDelta(delta)}
            >
              {store.formatButtonLabel(delta)}
            </button>
          ))}
        </div>

        <output className="count-display" aria-live="polite">
          {store.count}
        </output>

        <div className="delta-group">
          {POSITIVE_DELTAS.map((delta) => (
            <button
              key={delta}
              type="button"
              className="btn delta-btn"
              onClick={() => store.applyDelta(delta)}
            >
              {store.formatButtonLabel(delta)}
            </button>
          ))}
        </div>
      </div>

      <section className="history-panel" aria-label="Action history">
        <h2 className="history-title">History</h2>
        <ul className="history-list">
          {store.historyLines.map((line, index) => (
            <li key={`${line}-${index}`}>{line}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
