import { useCallback, useEffect, useMemo, useState } from 'react';
import { getOfferCategories, hasActiveOfferFilters, queryOffers } from './offer.query';
import type { OfferRepository } from './offer.repository';
import {
  DEFAULT_OFFER_FILTERS,
  type Offer,
  type OfferCategory,
  type OfferFilters,
  type OfferSort,
} from './offer.types';

type RequestState =
  | { status: 'loading'; offers: Offer[]; errorMessage: '' }
  | { status: 'success'; offers: Offer[]; errorMessage: '' }
  | { status: 'error'; offers: Offer[]; errorMessage: string };

export function useOfferExplorer(repository: OfferRepository) {
  const [request, setRequest] = useState<RequestState>({
    status: 'loading',
    offers: [],
    errorMessage: '',
  });
  const [filters, setFilters] = useState<OfferFilters>(DEFAULT_OFFER_FILTERS);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [requestVersion, setRequestVersion] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setRequest((current) => ({ ...current, status: 'loading', errorMessage: '' }));

    repository
      .getOffers({ signal: controller.signal })
      .then((offers) => setRequest({ status: 'success', offers, errorMessage: '' }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setRequest({
          status: 'error',
          offers: [],
          errorMessage: error instanceof Error ? error.message : 'Unable to load offers.',
        });
      });

    return () => controller.abort();
  }, [repository, requestVersion]);

  const visibleOffers = useMemo(
    () => queryOffers(request.offers, filters),
    [request.offers, filters],
  );

  const applyFilters = useCallback(
    (nextFilters: OfferFilters) => {
      const nextOffers = queryOffers(request.offers, nextFilters);
      setFilters(nextFilters);
      setSelectedOfferId((currentId) =>
        currentId && !nextOffers.some((offer) => offer.id === currentId) ? null : currentId,
      );
    },
    [request.offers],
  );

  const selectedOffer = visibleOffers.find((offer) => offer.id === selectedOfferId) ?? null;

  return {
    status: request.status,
    errorMessage: request.errorMessage,
    filters,
    offers: visibleOffers,
    categories: getOfferCategories(request.offers),
    selectedOffer,
    selectedOfferId,
    hasActiveFilters: hasActiveOfferFilters(filters),
    setSearchTerm: (searchTerm: string) => applyFilters({ ...filters, searchTerm }),
    setCategory: (category: OfferCategory | '') => applyFilters({ ...filters, category }),
    setRecommendedOnly: (recommendedOnly: boolean) => applyFilters({ ...filters, recommendedOnly }),
    setSortBy: (sortBy: OfferSort) => applyFilters({ ...filters, sortBy }),
    resetFilters: () => applyFilters(DEFAULT_OFFER_FILTERS),
    selectOffer: setSelectedOfferId,
    retry: () => setRequestVersion((version) => version + 1),
  };
}
