import type { Offer, OfferCategory, OfferFilters, OfferSort } from './offer.types';

type OfferFiltersProps = {
  filters: OfferFilters;
  categories: OfferCategory[];
  hasActiveFilters: boolean;
  onSearchTermChange: (value: string) => void;
  onCategoryChange: (value: OfferCategory | '') => void;
  onRecommendedOnlyChange: (value: boolean) => void;
  onSortChange: (value: OfferSort) => void;
  onReset: () => void;
};

export function OfferFilters(props: OfferFiltersProps) {
  const { filters, categories } = props;
  return (
    <section className="offer-toolbar" aria-label="Offer filters">
      <div className="filter-field filter-field-search">
        <label htmlFor="offer-search">Search offers</label>
        <input
          id="offer-search"
          type="search"
          placeholder="Search by offer name"
          value={filters.searchTerm}
          onChange={(event) => props.onSearchTermChange(event.target.value)}
        />
      </div>
      <div className="filter-field">
        <label htmlFor="offer-category">Category</label>
        <select
          id="offer-category"
          value={filters.category}
          onChange={(event) => props.onCategoryChange(event.target.value as OfferCategory | '')}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-field">
        <label htmlFor="offer-sort">Sort by</label>
        <select
          id="offer-sort"
          value={filters.sortBy}
          onChange={(event) => props.onSortChange(event.target.value as OfferSort)}
        >
          <option value="title">Title</option>
          <option value="apr">Lowest APR</option>
        </select>
      </div>
      <label className="checkbox-control">
        <input
          type="checkbox"
          checked={filters.recommendedOnly}
          onChange={(event) => props.onRecommendedOnlyChange(event.target.checked)}
        />
        <span>Recommended only</span>
      </label>
      <button
        className="reset-button"
        type="button"
        disabled={!props.hasActiveFilters}
        onClick={props.onReset}
      >
        Reset
      </button>
    </section>
  );
}

export function OfferList({
  offers,
  selectedOfferId,
  onSelect,
  onReset,
}: {
  offers: Offer[];
  selectedOfferId: string | null;
  onSelect: (id: string) => void;
  onReset: () => void;
}) {
  return (
    <section className="offer-list" aria-label="Available offers">
      <div className="results-summary" aria-live="polite">
        <strong>{offers.length}</strong>
        <span>{offers.length === 1 ? 'offer found' : 'offers found'}</span>
      </div>
      {offers.length === 0 ? (
        <div className="empty-state">
          <h2>No offers match your filters</h2>
          <p>Try a different search or clear the filters.</p>
          <button type="button" onClick={onReset}>
            Clear filters
          </button>
        </div>
      ) : (
        offers.map((offer) => (
          <OfferCard
            key={offer.id}
            offer={offer}
            selected={offer.id === selectedOfferId}
            onSelect={onSelect}
          />
        ))
      )}
    </section>
  );
}

export function OfferCard({
  offer,
  selected,
  onSelect,
}: {
  offer: Offer;
  selected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <article className={`offer-card${selected ? ' is-selected' : ''}`}>
      <div className="offer-card-heading">
        <div>
          <p className="offer-category">{offer.category}</p>
          <h2>{offer.title}</h2>
        </div>
        {offer.recommended && <span className="recommended-badge">Recommended</span>}
      </div>
      <div className="offer-card-footer">
        <div className="apr-value">
          <span>APR</span>
          <strong>{offer.apr !== null ? `${offer.apr}%` : 'N/A'}</strong>
        </div>
        <button type="button" aria-pressed={selected} onClick={() => onSelect(offer.id)}>
          {selected ? 'Selected' : 'View details'}
        </button>
      </div>
    </article>
  );
}

export function OfferDetails({ offer }: { offer: Offer | null }) {
  return (
    <aside className="offer-details" aria-live="polite">
      {offer ? (
        <>
          <p className="offer-category">Selected offer</p>
          <h2>{offer.title}</h2>
          {offer.recommended && <span className="recommended-badge">Recommended for you</span>}
          <dl>
            <div>
              <dt>Category</dt>
              <dd>{offer.category}</dd>
            </div>
            <div>
              <dt>APR</dt>
              <dd>{offer.apr !== null ? `${offer.apr}%` : 'Not applicable'}</dd>
            </div>
          </dl>
        </>
      ) : (
        <div className="details-placeholder">
          <h2>Offer details</h2>
          <p>Select an offer to compare its category and APR.</p>
        </div>
      )}
    </aside>
  );
}

export function OfferLoading() {
  return (
    <div className="offer-request-state" role="status">
      <h2>Loading offers</h2>
      <p>Finding the latest offers for you…</p>
    </div>
  );
}

export function OfferError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="offer-request-state offer-error" role="alert">
      <h2>We couldn’t load your offers</h2>
      <p>{message}</p>
      <button type="button" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}
