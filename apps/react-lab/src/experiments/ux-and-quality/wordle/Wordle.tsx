import type { KeyboardEvent } from 'react';
import { MAX_GUESSES, WORD_LENGTH, type ScoredLetter } from './wordle.logic';
import { useWordle } from './useWordle';
import './Wordle.css';

function LetterTile({ letter, status }: ScoredLetter) {
  return (
    <span className={`letter-tile ${status}`} aria-label={`${letter}, ${status}`}>
      {letter.toUpperCase()}
    </span>
  );
}

function EmptyRow() {
  return (
    <div className="guess-row" aria-hidden="true">
      {Array.from({ length: WORD_LENGTH }, (_, index) => (
        <span key={index} className="letter-tile empty" />
      ))}
    </div>
  );
}

export default function Wordle() {
  const { state, remainingGuesses, successMessage, failureMessage, onInputChange, onInputKeyDown } =
    useWordle();

  const emptyRows = Math.max(0, MAX_GUESSES - state.guesses.length - (state.status === 'playing' ? 1 : 0));

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onInputKeyDown(event.key);
  };

  return (
    <section className="wordle">
      <div
        id="wordle-api-url"
        data-url="https://api.frontendeval.com/fake/word"
        hidden
        aria-hidden="true"
      />

      <h1 className="title">Wordle</h1>
      <p className="subtitle">Guess the five-letter word in six tries.</p>

      {state.status === 'loading' && <p className="status-message">Loading today&apos;s word…</p>}
      {state.error && <p className="error">{state.error}</p>}

      {state.status !== 'loading' && (
        <>
          <p className="remaining">Guesses remaining: {remainingGuesses}</p>

          <div className="board" aria-label="Wordle guesses">
            {state.guesses.map((result, rowIndex) => (
              <div key={`${result.guess}-${rowIndex}`} className="guess-row">
                {result.letters.map((letter, index) => (
                  <LetterTile key={`${rowIndex}-${index}`} {...letter} />
                ))}
              </div>
            ))}

            {state.status === 'playing' && (
              <div className="guess-row current-input-row">
                {Array.from({ length: WORD_LENGTH }, (_, index) => (
                  <span key={index} className="letter-tile empty current">
                    {state.currentInput[index]?.toUpperCase() ?? ''}
                  </span>
                ))}
              </div>
            )}

            {Array.from({ length: emptyRows }, (_, index) => (
              <EmptyRow key={`empty-${index}`} />
            ))}
          </div>

          {state.status === 'playing' && (
            <div className="input-panel">
              <label className="input-label" htmlFor="wordle-guess">
                Enter a guess
              </label>
              <input
                id="wordle-guess"
                className="guess-input"
                type="text"
                inputMode="text"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                maxLength={WORD_LENGTH}
                value={state.currentInput}
                onChange={(event) => onInputChange(event.target.value)}
                onKeyDown={handleKeyDown}
              />
              <p className="hint">Press Enter to submit.</p>
              {state.validationError && <p className="validation-error">{state.validationError}</p>}
            </div>
          )}

          {successMessage && <p className="result success">{successMessage}</p>}
          {failureMessage && <p className="result failure">{failureMessage}</p>}
        </>
      )}
    </section>
  );
}
