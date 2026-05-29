export type CardState = {
  id: number;
  emoji: string;
  isFaceUp: boolean;
  isMatched: boolean;
};

export const EMOJIS = [
  '🐵',
  '🐶',
  '🦊',
  '🐱',
  '🦁',
  '🐯',
  '🐴',
  '🦄',
  '🦓',
  '🦌',
  '🐮',
  '🐷',
  '🐭',
  '🐹',
  '🐻',
  '🐨',
  '🐼',
  '🐽',
  '🐸',
  '🐰',
  '🐙',
] as const;

export const PAIRS_COUNT = 8;
export const FLIP_BACK_DELAY_MS = 2000;

export function shuffle<T>(items: T[]): T[] {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
  }

  return shuffled;
}

function pickRandomEmojis(count: number): string[] {
  return shuffle([...EMOJIS]).slice(0, count);
}

export function createDeck(): CardState[] {
  const selectedEmojis = pickRandomEmojis(PAIRS_COUNT);
  const deck = [...selectedEmojis, ...selectedEmojis];

  return shuffle(deck).map((emoji, index) => ({
    id: index,
    emoji,
    isFaceUp: false,
    isMatched: false,
  }));
}

export function flipBackCards(cards: CardState[], cardIds: number[]): CardState[] {
  return cards.map((currentCard) =>
    cardIds.includes(currentCard.id) && !currentCard.isMatched
      ? { ...currentCard, isFaceUp: false }
      : currentCard,
  );
}

export function updateCard(
  cards: CardState[],
  cardId: number,
  patch: Partial<Pick<CardState, 'isFaceUp' | 'isMatched'>>,
): CardState[] {
  return cards.map((currentCard) =>
    currentCard.id === cardId ? { ...currentCard, ...patch } : currentCard,
  );
}
