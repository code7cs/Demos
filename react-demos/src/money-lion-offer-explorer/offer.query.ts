import {
  DEFAULT_OFFER_FILTERS,
  type Offer,
  type OfferCategory,
  type OfferFilters,
} from './offer.types';

export function queryOffers(offers: readonly Offer[], filters: OfferFilters): Offer[] {
  const normalizedSearch = filters.searchTerm.trim().toLocaleLowerCase();

  return offers
    .filter((offer) => offer.title.toLocaleLowerCase().includes(normalizedSearch))
    .filter((offer) => !filters.category || offer.category === filters.category)
    .filter((offer) => !filters.recommendedOnly || offer.recommended)
    .sort((left, right) => {
      if (filters.sortBy === 'title') return left.title.localeCompare(right.title);
      if (left.apr === null) return right.apr === null ? 0 : 1;
      if (right.apr === null) return -1;
      return left.apr - right.apr;
    });
}

export function getOfferCategories(offers: readonly Offer[]): OfferCategory[] {
  return [...new Set(offers.map((offer) => offer.category))];
}

export function hasActiveOfferFilters(filters: OfferFilters): boolean {
  return (
    filters.searchTerm.trim() !== DEFAULT_OFFER_FILTERS.searchTerm ||
    filters.category !== DEFAULT_OFFER_FILTERS.category ||
    filters.recommendedOnly !== DEFAULT_OFFER_FILTERS.recommendedOnly ||
    filters.sortBy !== DEFAULT_OFFER_FILTERS.sortBy
  );
}
