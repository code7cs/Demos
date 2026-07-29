import {
  OfferDetails,
  OfferError,
  OfferFilters,
  OfferList,
  OfferLoading,
} from './offer-explorer.views';
import { offerRepository, type OfferRepository } from './offer.repository';
import { useOfferExplorer } from './useOfferExplorer';
import './offer-explorer.css';

type OfferExplorerProps = { repository?: OfferRepository };

export default function OfferExplorer({ repository = offerRepository }: OfferExplorerProps) {
  const explorer = useOfferExplorer(repository);

  return (
    <main className="offer-explorer">
      <header className="offer-header">
        <p className="offer-kicker">MoneyLion practice</p>
        <h1>Offer Explorer</h1>
        <p>Find an offer that fits your goals.</p>
      </header>
      {explorer.status === 'loading' && <OfferLoading />}
      {explorer.status === 'error' && (
        <OfferError message={explorer.errorMessage} onRetry={explorer.retry} />
      )}
      {explorer.status === 'success' && (
        <>
          <OfferFilters
            filters={explorer.filters}
            categories={explorer.categories}
            hasActiveFilters={explorer.hasActiveFilters}
            onSearchTermChange={explorer.setSearchTerm}
            onCategoryChange={explorer.setCategory}
            onRecommendedOnlyChange={explorer.setRecommendedOnly}
            onSortChange={explorer.setSortBy}
            onReset={explorer.resetFilters}
          />
          <div className="offer-layout">
            <OfferList
              offers={explorer.offers}
              selectedOfferId={explorer.selectedOfferId}
              onSelect={explorer.selectOffer}
              onReset={explorer.resetFilters}
            />
            <OfferDetails offer={explorer.selectedOffer} />
          </div>
        </>
      )}
    </main>
  );
}
