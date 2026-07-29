import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import OfferExplorer from './offer-explorer';
import { createSimulatedOfferRepository } from './offer.repository';

describe('OfferExplorer', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.useFakeTimers();
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.useRealTimers();
  });

  it('loads offers asynchronously and clears a selection hidden by filters', async () => {
    const repository = createSimulatedOfferRepository({ delayMs: 100 });
    act(() => root.render(<OfferExplorer repository={repository} />));
    expect(container.querySelector('[role="status"]')?.textContent).toContain('Loading offers');

    await act(async () => vi.advanceTimersByTimeAsync(100));
    expect(container.textContent).toContain('5offers found');

    const flexibleCard = [...container.querySelectorAll('article')].find((card) =>
      card.textContent?.includes('Flexible Personal Loan'),
    )!;
    act(() => flexibleCard.querySelector('button')!.click());
    expect(container.querySelector('.offer-details')?.textContent).toContain(
      'Flexible Personal Loan',
    );

    const category = container.querySelector<HTMLSelectElement>('#offer-category')!;
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')!.set!.call(
        category,
        'Credit Builder',
      );
      category.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(container.querySelector('.offer-details')?.textContent).toContain('Offer details');
    expect(container.querySelector('.offer-details')?.textContent).not.toContain(
      'Flexible Personal Loan',
    );
  });

  it('recovers from a load failure through retry', async () => {
    const repository = createSimulatedOfferRepository({ delayMs: 100, failTimes: 1 });
    act(() => root.render(<OfferExplorer repository={repository} />));

    await act(async () => vi.advanceTimersByTimeAsync(100));
    expect(container.querySelector('[role="alert"]')?.textContent).toContain(
      'Unable to load offers',
    );

    act(() => container.querySelector<HTMLButtonElement>('[role="alert"] button')!.click());
    await act(async () => vi.advanceTimersByTimeAsync(100));
    expect(container.textContent).toContain('5offers found');
  });
});
