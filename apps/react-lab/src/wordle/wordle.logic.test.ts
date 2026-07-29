import { describe, expect, it } from 'vitest';
import { createInitialWordleState, scoreGuess, submitGuess } from './wordle.logic';

describe('scoreGuess', () => {
  it('marks exact matches as correct', () => {
    expect(scoreGuess('north', 'north')).toEqual([
      { letter: 'n', status: 'correct' },
      { letter: 'o', status: 'correct' },
      { letter: 'r', status: 'correct' },
      { letter: 't', status: 'correct' },
      { letter: 'h', status: 'correct' },
    ]);
  });

  it('marks absent letters as absent', () => {
    expect(scoreGuess('xxxxx', 'north')).toEqual([
      { letter: 'x', status: 'absent' },
      { letter: 'x', status: 'absent' },
      { letter: 'x', status: 'absent' },
      { letter: 'x', status: 'absent' },
      { letter: 'x', status: 'absent' },
    ]);
  });

  it('handles present letters in the wrong position', () => {
    expect(scoreGuess('tango', 'north')).toEqual([
      { letter: 't', status: 'present' },
      { letter: 'a', status: 'absent' },
      { letter: 'n', status: 'present' },
      { letter: 'g', status: 'absent' },
      { letter: 'o', status: 'present' },
    ]);
  });

  it('limits duplicate highlights when the answer has fewer occurrences', () => {
    expect(scoreGuess('abbey', 'baring')).toEqual([
      { letter: 'a', status: 'present' },
      { letter: 'b', status: 'present' },
      { letter: 'b', status: 'absent' },
      { letter: 'e', status: 'absent' },
      { letter: 'y', status: 'absent' },
    ]);
  });
  it('prioritizes an exact duplicate-letter match over a present match', () => {
    expect(scoreGuess('booby', 'cocoa')).toEqual([
      { letter: 'b', status: 'absent' },
      { letter: 'o', status: 'correct' },
      { letter: 'o', status: 'present' },
      { letter: 'b', status: 'absent' },
      { letter: 'y', status: 'absent' },
    ]);
  });

  it('highlights duplicate letters when the answer contains them', () => {
    expect(scoreGuess('booty', 'robot')).toEqual([
      { letter: 'b', status: 'present' },
      { letter: 'o', status: 'correct' },
      { letter: 'o', status: 'present' },
      { letter: 't', status: 'present' },
      { letter: 'y', status: 'absent' },
    ]);
  });
});

describe('submitGuess', () => {
  it('ends the game after six incorrect guesses', () => {
    let state = createInitialWordleState();
    state = { ...state, answer: 'north', status: 'playing' };

    for (let attempt = 0; attempt < 6; attempt += 1) {
      state = submitGuess(state, 'xxxxx');
    }

    expect(state.status).toBe('lost');
    expect(state.guesses).toHaveLength(6);
  });
});
