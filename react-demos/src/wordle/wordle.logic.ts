export const MAX_GUESSES = 6;
export const WORD_LENGTH = 5;

export type LetterStatus = 'correct' | 'present' | 'absent';

export interface ScoredLetter {
  letter: string;
  status: LetterStatus;
}

export interface GuessResult {
  guess: string;
  letters: ScoredLetter[];
  isCorrect: boolean;
}

export interface WordleState {
  answer: string | null;
  guesses: GuessResult[];
  currentInput: string;
  status: 'loading' | 'playing' | 'won' | 'lost';
  error: string | null;
  validationError: string | null;
}

export function createInitialWordleState(): WordleState {
  return {
    answer: null,
    guesses: [],
    currentInput: '',
    status: 'loading',
    error: null,
    validationError: null,
  };
}

export function scoreGuess(guess: string, answer: string): ScoredLetter[] {
  const normalizedGuess = guess.toLowerCase();
  const normalizedAnswer = answer.toLowerCase();
  const statuses: LetterStatus[] = Array(WORD_LENGTH).fill('absent');
  const unmatchedAnswerCounts = new Map<string, number>();

  for (let index = 0; index < WORD_LENGTH; index += 1) {
    if (normalizedGuess[index] === normalizedAnswer[index]) {
      statuses[index] = 'correct';
      continue;
    }

    const letter = normalizedAnswer[index];
    unmatchedAnswerCounts.set(letter, (unmatchedAnswerCounts.get(letter) ?? 0) + 1);
  }

  for (let index = 0; index < WORD_LENGTH; index += 1) {
    if (statuses[index] === 'correct') {
      continue;
    }

    const letter = normalizedGuess[index];
    const remaining = unmatchedAnswerCounts.get(letter) ?? 0;

    if (remaining > 0) {
      statuses[index] = 'present';
      unmatchedAnswerCounts.set(letter, remaining - 1);
    }
  }

  return normalizedGuess.split('').map((letter, index) => ({
    letter,
    status: statuses[index],
  }));
}

export function getRemainingGuesses(guesses: GuessResult[]): number {
  return MAX_GUESSES - guesses.length;
}

export function canSubmitGuess(state: WordleState): boolean {
  return (
    state.status === 'playing' &&
    state.currentInput.length === WORD_LENGTH &&
    state.validationError === null
  );
}

export function setLoadedAnswer(state: WordleState, answer: string): WordleState {
  return {
    ...state,
    answer,
    status: 'playing',
    error: null,
  };
}

export function setLoadError(state: WordleState, message: string): WordleState {
  return {
    ...state,
    status: 'playing',
    answer: null,
    error: message,
  };
}

export function setCurrentInput(state: WordleState, value: string): WordleState {
  const lettersOnly = value.toLowerCase().replace(/[^a-z]/g, '').slice(0, WORD_LENGTH);

  return {
    ...state,
    currentInput: lettersOnly,
    validationError: null,
  };
}

export function setValidationError(state: WordleState, message: string | null): WordleState {
  return {
    ...state,
    validationError: message,
  };
}

export function submitGuess(state: WordleState, guess: string): WordleState {
  if (state.status !== 'playing' || !state.answer) {
    return state;
  }

  const normalizedGuess = guess.toLowerCase();
  const letters = scoreGuess(normalizedGuess, state.answer);
  const isCorrect = normalizedGuess === state.answer.toLowerCase();
  const guesses = [...state.guesses, { guess: normalizedGuess, letters, isCorrect }];

  if (isCorrect) {
    return {
      ...state,
      guesses,
      currentInput: '',
      validationError: null,
      status: 'won',
    };
  }

  if (guesses.length >= MAX_GUESSES) {
    return {
      ...state,
      guesses,
      currentInput: '',
      validationError: null,
      status: 'lost',
    };
  }

  return {
    ...state,
    guesses,
    currentInput: '',
    validationError: null,
  };
}

export function getSuccessMessage(guesses: GuessResult[]): string {
  return `You correctly guessed the word in ${guesses.length} tries!`;
}

export function getFailureMessage(answer: string): string {
  return `The word was '${answer}'`;
}
