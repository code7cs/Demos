import { useCallback, useEffect, useRef, useState } from 'react';
import { getQuery, getValidWordUrl, registerGetQueryConsoleHelper } from './getQuery';
import {
  WORD_LENGTH,
  canSubmitGuess,
  createInitialWordleState,
  getFailureMessage,
  getRemainingGuesses,
  getSuccessMessage,
  setCurrentInput,
  setLoadError,
  setLoadedAnswer,
  setValidationError,
  submitGuess,
  type WordleState,
} from './wordle.logic';

async function fetchAnswer(wordUrl: string): Promise<string> {
  const response = await fetch(wordUrl);

  if (!response.ok) {
    throw new Error('Could not load the word of the day.');
  }

  const text = (await response.text()).trim().replace(/^"|"$/g, '');

  if (text.length !== WORD_LENGTH) {
    throw new Error('The word of the day must be five letters long.');
  }

  return text.toLowerCase();
}

async function isValidWord(validUrl: string, word: string): Promise<boolean> {
  const response = await fetch(validUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word }),
  });

  if (!response.ok) {
    throw new Error('Could not validate the submitted word.');
  }

  return (await response.json()) === true;
}

export function useWordle() {
  const [state, setState] = useState<WordleState>(createInitialWordleState);
  const [wordUrl, setWordUrl] = useState('');
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    registerGetQueryConsoleHelper();
    const url = getQuery();
    setWordUrl(url);

    let cancelled = false;

    const loadWord = async () => {
      try {
        const answer = await fetchAnswer(url);
        if (!cancelled) {
          setState((current) => setLoadedAnswer(current, answer));
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error ? error.message : 'Could not load the word of the day.';
          setState((current) => setLoadError(current, message));
        }
      }
    };

    void loadWord();

    return () => {
      cancelled = true;
    };
  }, []);

  const onInputChange = useCallback((value: string) => {
    setState((current) => setCurrentInput(current, value));
  }, []);

  const submitCurrentGuess = useCallback(async () => {
    const current = stateRef.current;

    if (!canSubmitGuess(current)) {
      return;
    }

    const guess = current.currentInput;
    const validUrl = getValidWordUrl(wordUrl || getQuery());

    try {
      const valid = await isValidWord(validUrl, guess);
      if (!valid) {
        setState((latest) => setValidationError(latest, 'That word is not in the dictionary.'));
        return;
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Could not validate the submitted word.';
      setState((latest) => setValidationError(latest, message));
      return;
    }

    setState((latest) => submitGuess(latest, guess));
  }, [wordUrl]);

  const onInputKeyDown = useCallback(
    (key: string) => {
      if (key === 'Enter') {
        void submitCurrentGuess();
      }
    },
    [submitCurrentGuess],
  );

  return {
    state,
    wordUrl,
    remainingGuesses: getRemainingGuesses(state.guesses),
    successMessage: state.status === 'won' ? getSuccessMessage(state.guesses) : null,
    failureMessage:
      state.status === 'lost' && state.answer ? getFailureMessage(state.answer) : null,
    onInputChange,
    onInputKeyDown,
    submitCurrentGuess,
  };
}
