export type OfferCategory = 'Credit Builder' | 'Personal Loan' | 'Cash Advance';

export type OfferSort = 'title' | 'apr';

export type Offer = {
  id: string;
  title: string;
  category: OfferCategory;
  apr: number | null;
  recommended: boolean;
};

export type OfferFilters = {
  searchTerm: string;
  category: OfferCategory | '';
  recommendedOnly: boolean;
  sortBy: OfferSort;
};

export const DEFAULT_OFFER_FILTERS: OfferFilters = {
  searchTerm: '',
  category: '',
  recommendedOnly: false,
  sortBy: 'title',
};
