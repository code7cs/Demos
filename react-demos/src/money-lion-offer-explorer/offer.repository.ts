import { OFFER_FIXTURES } from './offers.fixture';
import type { Offer } from './offer.types';

export interface OfferRepository {
  getOffers(options?: { signal?: AbortSignal }): Promise<Offer[]>;
}

type SimulatedRepositoryOptions = {
  delayMs?: number;
  failTimes?: number;
};

export function createSimulatedOfferRepository({
  delayMs = 650,
  failTimes = 0,
}: SimulatedRepositoryOptions = {}): OfferRepository {
  let remainingFailures = failTimes;

  return {
    getOffers({ signal } = {}) {
      return new Promise((resolve, reject) => {
        const onAbort = () => {
          clearTimeout(timer);
          reject(new DOMException('The request was aborted', 'AbortError'));
        };
        const timer = setTimeout(() => {
          signal?.removeEventListener('abort', onAbort);

          // Deterministic failures make retry behavior reliable in demos and tests.
          if (remainingFailures > 0) {
            remainingFailures -= 1;
            reject(new Error('Unable to load offers. Please try again.'));
            return;
          }

          resolve(OFFER_FIXTURES.map((offer) => ({ ...offer })));
        }, delayMs);

        if (signal?.aborted) {
          onAbort();
          return;
        }
        signal?.addEventListener('abort', onAbort, { once: true });
      });
    },
  };
}

export const offerRepository = createSimulatedOfferRepository();
