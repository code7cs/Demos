import { useState } from 'react';
import { offersData, type OfferCategory } from './offer-explorer.store';
import './offer-explorer.css';

type SortBy = 'title' | 'apr';

const categories = Array.from(new Set(offersData.map((offer) => offer.category)));

export default function OfferExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchCategory, setSearchCategory] = useState<OfferCategory | ''>('');
  const [recommendedOnly, setRecommendedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>('title');
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);

  const filteredOffers = offersData
    .filter((offer) => offer.title.toLowerCase().includes(searchTerm.trim().toLowerCase()))
    .filter((offer) => !searchCategory || offer.category === searchCategory)
    .filter((offer) => !recommendedOnly || offer.recommended)
    .sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }

      if (a.apr === null) return 1;
      if (b.apr === null) return -1;
      return a.apr - b.apr;
    });

  const selectedOffer = offersData.find((offer) => offer.id === selectedOfferId) ?? null;
  const hasActiveFilters =
    searchTerm.length > 0 || searchCategory !== '' || recommendedOnly || sortBy !== 'title';

  const resetFilters = () => {
    setSearchTerm('');
    setSearchCategory('');
    setRecommendedOnly(false);
    setSortBy('title');
  };

  return (
    <main className="offer-explorer">
      <header className="offer-header">
        <p className="offer-kicker">MoneyLion practice</p>
        <h1>Offer Explorer</h1>
        <p>Find an offer that fits your goals.</p>
      </header>

      <section className="offer-toolbar" aria-label="Offer filters">
        <div className="filter-field filter-field-search">
          <label htmlFor="offer-search">Search offers</label>
          <input
            id="offer-search"
            type="search"
            placeholder="Search by offer name"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <div className="filter-field">
          <label htmlFor="offer-category">Category</label>
          <select
            id="offer-category"
            value={searchCategory}
            onChange={(event) =>
              setSearchCategory(event.target.value as OfferCategory | '')
            }
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
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortBy)}
          >
            <option value="title">Title</option>
            <option value="apr">Lowest APR</option>
          </select>
        </div>

        <label className="checkbox-control">
          <input
            type="checkbox"
            checked={recommendedOnly}
            onChange={(event) => setRecommendedOnly(event.target.checked)}
          />
          <span>Recommended only</span>
        </label>

        <button
          className="reset-button"
          type="button"
          disabled={!hasActiveFilters}
          onClick={resetFilters}
        >
          Reset
        </button>
      </section>

      <div className="offer-layout">
        <section className="offer-list" aria-label="Available offers">
          <div className="results-summary" aria-live="polite">
            <strong>{filteredOffers.length}</strong>
            <span>{filteredOffers.length === 1 ? 'offer found' : 'offers found'}</span>
          </div>

          {filteredOffers.length === 0 ? (
            <div className="empty-state">
              <h2>No offers match your filters</h2>
              <p>Try a different search or clear the filters.</p>
              <button type="button" onClick={resetFilters}>
                Clear filters
              </button>
            </div>
          ) : (
            filteredOffers.map((offer) => {
              const isSelected = offer.id === selectedOfferId;

              return (
                <article
                  key={offer.id}
                  className={`offer-card${isSelected ? ' is-selected' : ''}`}
                >
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
                    <button type="button" onClick={() => setSelectedOfferId(offer.id)}>
                      {isSelected ? 'Selected' : 'View details'}
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </section>

        <aside className="offer-details" aria-live="polite">
          {selectedOffer ? (
            <>
              <p className="offer-category">Selected offer</p>
              <h2>{selectedOffer.title}</h2>
              {selectedOffer.recommended && (
                <span className="recommended-badge">Recommended for you</span>
              )}
              <dl>
                <div>
                  <dt>Category</dt>
                  <dd>{selectedOffer.category}</dd>
                </div>
                <div>
                  <dt>APR</dt>
                  <dd>
                    {selectedOffer.apr !== null ? `${selectedOffer.apr}%` : 'Not applicable'}
                  </dd>
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
      </div>
    </main>
  );
}