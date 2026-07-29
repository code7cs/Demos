import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FLIP_BACK_DELAY_MS,
  createDeck,
  flipBackCards,
  updateCard,
  type CardState,
} from './memory-game.logic';
import './MemoryGame.css';

export default function MemoryGame() {
  const [cards, setCards] = useState<CardState[]>(() => createDeck());
  const [selectedCardIds, setSelectedCardIds] = useState<number[]>([]);
  const flipBackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasWon = useMemo(
    () => cards.length > 0 && cards.every((card) => card.isMatched),
    [cards],
  );

  const clearFlipBackTimeout = useCallback(() => {
    if (flipBackTimeoutRef.current !== null) {
      clearTimeout(flipBackTimeoutRef.current);
      flipBackTimeoutRef.current = null;
    }
  }, []);

  const resetGame = useCallback(() => {
    clearFlipBackTimeout();
    setSelectedCardIds([]);
    setCards(createDeck());
  }, [clearFlipBackTimeout]);

  useEffect(() => () => clearFlipBackTimeout(), [clearFlipBackTimeout]);

  const onCardClick = (cardId: number) => {
    const card = cards.find((currentCard) => currentCard.id === cardId);
    if (!card || card.isMatched || card.isFaceUp) {
      return;
    }

    let nextCards = cards;
    let nextSelectedIds = selectedCardIds;

    if (flipBackTimeoutRef.current !== null) {
      clearFlipBackTimeout();
      nextCards = flipBackCards(nextCards, selectedCardIds);
      nextSelectedIds = [];
    }

    nextCards = updateCard(nextCards, cardId, { isFaceUp: true });
    nextSelectedIds = [...nextSelectedIds, cardId];

    setCards(nextCards);
    setSelectedCardIds(nextSelectedIds);

    if (nextSelectedIds.length < 2) {
      return;
    }

    const [firstId, secondId] = nextSelectedIds;
    const firstCard = nextCards.find((currentCard) => currentCard.id === firstId);
    const secondCard = nextCards.find((currentCard) => currentCard.id === secondId);

    if (!firstCard || !secondCard) {
      setSelectedCardIds([]);
      return;
    }

    if (firstCard.emoji === secondCard.emoji) {
      let matchedCards = updateCard(nextCards, firstId, { isMatched: true });
      matchedCards = updateCard(matchedCards, secondId, { isMatched: true });
      setCards(matchedCards);
      setSelectedCardIds([]);
      return;
    }

    const mismatchIds = [...nextSelectedIds];
    clearFlipBackTimeout();
    flipBackTimeoutRef.current = setTimeout(() => {
      setCards((currentCards) => flipBackCards(currentCards, mismatchIds));
      setSelectedCardIds([]);
      flipBackTimeoutRef.current = null;
    }, FLIP_BACK_DELAY_MS);
  };

  return (
    <section className="memory-game">
      <h1 className="title">Memory Game</h1>
      <p className="subtitle">Match all pairs to win.</p>

      <div className="grid" role="grid" aria-label="Memory game cards">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            className={`card${card.isFaceUp || card.isMatched ? ' face-up' : ''}${card.isMatched ? ' matched' : ''}`}
            disabled={card.isMatched}
            onClick={() => onCardClick(card.id)}
          >
            <span aria-hidden="true">
              {card.isFaceUp || card.isMatched ? card.emoji : '❓'}
            </span>
          </button>
        ))}
      </div>

      {hasWon && (
        <div className="win-panel">
          <p className="win-text">You matched all pairs.</p>
          <button type="button" className="play-again" onClick={resetGame}>
            Play again
          </button>
        </div>
      )}
    </section>
  );
}
