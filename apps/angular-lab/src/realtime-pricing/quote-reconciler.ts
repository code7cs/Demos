import { PriceQuote } from './pricing.models';

export type DeltaResult =
  { kind: 'applied'; quote: PriceQuote } | { kind: 'ignored' } | { kind: 'resync-required' };

/**
 * Keeps the sequence/order rules independent from WebSocket and Angular code,
 * which makes the correctness rules easy to test.
 */
export class QuoteReconciler {
  private lastSequence = 0;
  private quotes = new Map<string, PriceQuote>();

  replaceSnapshot(sequence: number, quotes: PriceQuote[]): PriceQuote[] {
    this.lastSequence = sequence;
    this.quotes = new Map(quotes.map((quote) => [quote.symbol, quote]));
    return this.rows();
  }

  applyDelta(sequence: number, quote: PriceQuote): DeltaResult {
    if (sequence <= this.lastSequence) {
      return { kind: 'ignored' };
    }

    if (sequence !== this.lastSequence + 1) {
      return { kind: 'resync-required' };
    }

    this.lastSequence = sequence;
    this.quotes.set(quote.symbol, quote);
    return { kind: 'applied', quote };
  }

  rows(): PriceQuote[] {
    return [...this.quotes.values()];
  }
}
