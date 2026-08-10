import { useState, type KeyboardEvent } from 'react';
import { useSearchSuggestions } from './useSearchSuggestions';
import './Search.css';

export type SearchProps = {
  onSelectItem: (item: string) => void;
};

const LISTBOX_ID = 'search-suggestions';

export default function Search({ onSelectItem }: SearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const { error, loading, suggestions } = useSearchSuggestions(query);

  const selectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setActiveIndex(-1);
    setIsOpen(false);
    onSelectItem(suggestion);
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setActiveIndex(-1);
    setIsOpen(true);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' && suggestions.length > 0) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => (current >= suggestions.length - 1 ? 0 : current + 1));
      return;
    }

    if (event.key === 'ArrowUp' && suggestions.length > 0) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => (current <= 0 ? suggestions.length - 1 : current - 1));
      return;
    }

    if (event.key === 'Enter' && isOpen && activeIndex >= 0) {
      event.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
      return;
    }

    if (event.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const hasPopup = isOpen && (loading || suggestions.length > 0 || Boolean(error));

  return (
    <div className="search">
      <label className="search__label" htmlFor="search-input">
        Search items
      </label>
      <div className={'control' + (loading ? ' is-loading' : '')}>
        <input
          aria-activedescendant={activeIndex >= 0 ? 'search-option-' + activeIndex : undefined}
          aria-autocomplete="list"
          aria-busy={loading}
          aria-controls={LISTBOX_ID}
          aria-expanded={hasPopup}
          aria-label="Search items"
          className="input"
          id="search-input"
          onChange={(event) => handleInputChange(event.target.value)}
          onFocus={() => {
            if (suggestions.length > 0 || error) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search items"
          role="combobox"
          type="search"
          value={query}
        />
        {loading && (
          <span className="search__status" role="status">
            Loading suggestions…
          </span>
        )}
      </div>

      {error && (
        <p className="search__error" role="alert">
          {error}. Try again.
        </p>
      )}

      {!loading && !error && isOpen && suggestions.length > 0 && (
        <ul className="list" id={LISTBOX_ID} role="listbox">
          {suggestions.map((suggestion, index) => (
            <li
              aria-selected={index === activeIndex}
              className={index === activeIndex ? 'list-option is-active' : 'list-option'}
              id={'search-option-' + index}
              key={suggestion}
              role="option"
            >
              <button
                className="list-item list-item__button"
                onClick={() => selectSuggestion(suggestion)}
                onMouseDown={(event) => event.preventDefault()}
                type="button"
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      )}

      {!loading && !error && isOpen && query.trim() && suggestions.length === 0 && (
        <p className="search__empty" role="status">
          No suggestions found.
        </p>
      )}
    </div>
  );
}