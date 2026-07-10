import { useState } from 'react';
import { useSearchSuggestions } from './useSearchSuggestions';

export type SearchProps = {
  onSelectItem: (item: string) => void;
};

export default function Search({ onSelectItem }: SearchProps) {
  const [query, setQuery] = useState('');
  const { error, loading, suggestions } = useSearchSuggestions(query);

  return (
    <div className="search">
      <div className={`control${loading ? ' is-loading' : ''}`}>
        <label htmlFor="suggestion-search">Search words</label>
        <input
          className="input"
          id="suggestion-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try “ship” or “logistics”"
        />
      </div>

      {loading && <p role="status">Searching…</p>}
      {error && <p role="alert">{error}</p>}

      {!loading && !error && suggestions.length > 0 && (
        <div className="list" aria-label="Search suggestions">
          {suggestions.map((suggestion) => (
            <button
              className="list-item"
              key={suggestion}
              type="button"
              onClick={() => onSelectItem(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
