import { useState } from 'react';
import { useSearchSuggestions } from './useSearchSuggestions';

export type SearchProps = {
  onSelectItem: (item: string) => void;
};

export default function Search({ onSelectItem }: SearchProps) {
  const [query, setQuery] = useState('');
  const { loading, suggestions } = useSearchSuggestions(query);

  return (
    <div className="search">
      <div className={`control${loading ? ' is-loading' : ''}`}>
        <input
          className="input"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {!loading && suggestions.length > 0 && (
        <div className="list">
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
