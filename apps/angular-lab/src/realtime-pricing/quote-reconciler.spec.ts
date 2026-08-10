import { describe, expect, it } from 'vitest';
import { QuoteReconciler } from './quote-reconciler';

const quote = (symbol: string, price: number) => ({
  symbol,
  price,
  bid: price - 0.015625,
  ask: price + 0.015625,
  dailyChange: 0,
  updatedAt: '2026-08-01T14:30:00.000Z',
});

describe('QuoteReconciler', () => {
  it('applies a newer sequential delta to its matching quote', () => {
    const reconciler = new QuoteReconciler();
    reconciler.replaceSnapshot(10, [quote('FN 5.0', 101.25)]);

    const result = reconciler.applyDelta(11, quote('FN 5.0', 101.5));

    expect(result).toEqual({ kind: 'applied', quote: quote('FN 5.0', 101.5) });
    expect(reconciler.rows()).toEqual([quote('FN 5.0', 101.5)]);
  });

  it('ignores a duplicate delta without changing the current quote', () => {
    const reconciler = new QuoteReconciler();
    reconciler.replaceSnapshot(10, [quote('FN 5.0', 101.25)]);

    reconciler.applyDelta(11, quote('FN 5.0', 101.5));
    const result = reconciler.applyDelta(11, quote('FN 5.0', 99));

    expect(result).toEqual({ kind: 'ignored' });
    expect(reconciler.rows()).toEqual([quote('FN 5.0', 101.5)]);
  });

  it('requests a resync when a sequence gap makes the client state unsafe', () => {
    const reconciler = new QuoteReconciler();
    reconciler.replaceSnapshot(10, [quote('FN 5.0', 101.25)]);

    expect(reconciler.applyDelta(12, quote('FN 5.0', 101.5))).toEqual({
      kind: 'resync-required',
    });
  });

  it('replaces all client rows after receiving a fresh snapshot', () => {
    const reconciler = new QuoteReconciler();
    reconciler.replaceSnapshot(10, [quote('FN 5.0', 101.25)]);

    reconciler.replaceSnapshot(20, [quote('FN 4.5', 99.75)]);

    expect(reconciler.rows()).toEqual([quote('FN 4.5', 99.75)]);
  });
});
