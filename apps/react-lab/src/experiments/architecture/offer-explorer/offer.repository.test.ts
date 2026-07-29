import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSimulatedOfferRepository } from './offer.repository';

describe('simulated offer repository', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('returns cloned offers after the configured delay', async () => {
    const repository = createSimulatedOfferRepository({ delayMs: 100 });
    const request = repository.getOffers();

    await vi.advanceTimersByTimeAsync(100);
    const firstResult = await request;
    firstResult[0].title = 'Changed by caller';

    const secondRequest = repository.getOffers();
    await vi.advanceTimersByTimeAsync(100);
    const secondResult = await secondRequest;

    expect(secondResult[0].title).toBe('Credit Builder Plus');
  });

  it('fails deterministically and then allows retry', async () => {
    const repository = createSimulatedOfferRepository({ delayMs: 100, failTimes: 1 });
    const failedRequest = repository.getOffers();
    const failure = failedRequest.catch((error: unknown) => error);
    await vi.advanceTimersByTimeAsync(100);
    await expect(failure).resolves.toMatchObject({ message: 'Unable to load offers. Please try again.' });

    const retryRequest = repository.getOffers();
    await vi.advanceTimersByTimeAsync(100);
    await expect(retryRequest).resolves.toHaveLength(5);
  });

  it('rejects an aborted request', async () => {
    const repository = createSimulatedOfferRepository({ delayMs: 100 });
    const controller = new AbortController();
    const request = repository.getOffers({ signal: controller.signal });

    controller.abort();

    await expect(request).rejects.toMatchObject({ name: 'AbortError' });
  });
});
