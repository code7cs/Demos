import { describe, expect, it } from 'vitest';
import { getOfferCategories, hasActiveOfferFilters, queryOffers } from './offer.query';
import { DEFAULT_OFFER_FILTERS, type Offer } from './offer.types';

const offers: Offer[] = [
  {
    id: '1',
    title: 'Zulu Loan',
    category: 'Personal Loan',
    apr: 12.5,
    recommended: false,
  },
  {
    id: '2',
    title: 'Alpha Builder',
    category: 'Credit Builder',
    apr: 3.5,
    recommended: true,
  },
  {
    id: '3',
    title: 'Instant Cash',
    category: 'Cash Advance',
    apr: null,
    recommended: true,
  },
];

describe('offer query policy', () => {
  it('normalizes search and combines filters without mutating input', () => {
    const original = offers.map((offer) => ({ ...offer }));

    const result = queryOffers(offers, {
      ...DEFAULT_OFFER_FILTERS,
      searchTerm: '  ALPHA  ',
      category: 'Credit Builder',
      recommendedOnly: true,
    });

    expect(result.map(({ id }) => id)).toEqual(['2']);
    expect(offers).toEqual(original);
  });

  it('sorts titles alphabetically', () => {
    expect(queryOffers(offers, DEFAULT_OFFER_FILTERS).map(({ id }) => id)).toEqual(['2', '3', '1']);
  });

  it('sorts APR ascending and places missing APR last', () => {
    expect(
      queryOffers(offers, { ...DEFAULT_OFFER_FILTERS, sortBy: 'apr' }).map(({ id }) => id),
    ).toEqual(['2', '1', '3']);
  });

  it('derives unique categories in source order', () => {
    expect(getOfferCategories([...offers, offers[0]])).toEqual([
      'Personal Loan',
      'Credit Builder',
      'Cash Advance',
    ]);
  });

  it('recognizes only meaningful filter changes', () => {
    expect(hasActiveOfferFilters({ ...DEFAULT_OFFER_FILTERS, searchTerm: '   ' })).toBe(false);
    expect(hasActiveOfferFilters({ ...DEFAULT_OFFER_FILTERS, recommendedOnly: true })).toBe(true);
  });
});
