import { Component, OnDestroy, computed, signal } from '@angular/core';

type CardState = {
  id: number;
  emoji: string;
  isFaceUp: boolean;
  isMatched: boolean;
};

const EMOJIS = [
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

const PAIRS_COUNT = 8;
const FLIP_BACK_DELAY_MS = 2000;

@Component({
  selector: 'app-memory-game',
  templateUrl: './memory-game.component.html',
  styleUrl: './memory-game.component.css',
})
export class MemoryGameComponent implements OnDestroy {
  protected readonly cards = signal<CardState[]>([]);
  protected readonly selectedCardIds = signal<number[]>([]);
  protected readonly hasWon = computed(
    () => this.cards().length > 0 && this.cards().every((card) => card.isMatched),
  );

  private flipBackTimeoutId: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.resetGame();
  }

  ngOnDestroy(): void {
    this.clearFlipBackTimeout();
  }

  protected onCardClick(cardId: number): void {
    const card = this.cards().find((currentCard) => currentCard.id === cardId);
    if (!card || card.isMatched || card.isFaceUp) {
      return;
    }

    if (this.flipBackTimeoutId !== null) {
      this.clearFlipBackTimeout();
      this.flipBackCards(this.selectedCardIds());
      this.selectedCardIds.set([]);
    }

    this.updateCard(cardId, { isFaceUp: true });
    this.selectedCardIds.update((ids) => [...ids, cardId]);

    const selectedIds = this.selectedCardIds();
    if (selectedIds.length < 2) {
      return;
    }

    const [firstId, secondId] = selectedIds;
    const firstCard = this.cards().find((currentCard) => currentCard.id === firstId);
    const secondCard = this.cards().find((currentCard) => currentCard.id === secondId);

    if (!firstCard || !secondCard) {
      this.selectedCardIds.set([]);
      return;
    }

    if (firstCard.emoji === secondCard.emoji) {
      this.updateCard(firstId, { isMatched: true });
      this.updateCard(secondId, { isMatched: true });
      this.selectedCardIds.set([]);
      return;
    }

    const mismatchIds = [...selectedIds];
    this.clearFlipBackTimeout();
    this.flipBackTimeoutId = setTimeout(() => {
      this.flipBackCards(mismatchIds);
      this.selectedCardIds.set([]);
      this.flipBackTimeoutId = null;
    }, FLIP_BACK_DELAY_MS);
  }

  protected resetGame(): void {
    this.clearFlipBackTimeout();
    this.selectedCardIds.set([]);

    const selectedEmojis = this.pickRandomEmojis(PAIRS_COUNT);
    const deck = [...selectedEmojis, ...selectedEmojis];
    this.cards.set(
      this.shuffle(deck).map((emoji, index) => ({
        id: index,
        emoji,
        isFaceUp: false,
        isMatched: false,
      })),
    );
  }

  private flipBackCards(cardIds: number[]): void {
    this.cards.update((currentCards) =>
      currentCards.map((currentCard) =>
        cardIds.includes(currentCard.id) && !currentCard.isMatched
          ? { ...currentCard, isFaceUp: false }
          : currentCard,
      ),
    );
  }

  private updateCard(cardId: number, patch: Partial<Pick<CardState, 'isFaceUp' | 'isMatched'>>): void {
    this.cards.update((currentCards) =>
      currentCards.map((currentCard) =>
        currentCard.id === cardId ? { ...currentCard, ...patch } : currentCard,
      ),
    );
  }

  private pickRandomEmojis(count: number): string[] {
    return this.shuffle([...EMOJIS]).slice(0, count);
  }

  private clearFlipBackTimeout(): void {
    if (this.flipBackTimeoutId !== null) {
      clearTimeout(this.flipBackTimeoutId);
      this.flipBackTimeoutId = null;
    }
  }

  private shuffle<T>(items: T[]): T[] {
    const shuffled = [...items];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }

    return shuffled;
  }
}
