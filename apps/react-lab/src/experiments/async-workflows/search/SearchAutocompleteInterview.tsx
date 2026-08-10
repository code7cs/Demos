import { useState } from 'react';

const ITEMS = [
  'AWS Marketplace',
  'AWS Lambda',
  'Amazon Aurora',
  'React',
  'TypeScript',
];

export default function SearchAutocompleteInterview() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const suggestions = normalizedQuery
    ? ITEMS.filter((item) => item.toLowerCase().includes(normalizedQuery))
    : [];

  function selectSuggestion(item: string) {
    setQuery(item);
    setSelected(item);
  }

  return (
    <div>
      <label htmlFor="interview-search">Search</label>
      <input
        id="interview-search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setSelected(null);
        }}
      />

      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((suggestion) => (
            <li key={suggestion}>
              <button type="button" onClick={() => selectSuggestion(suggestion)}>
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      )}

      {selected && <p>Selected: {selected}</p>}
    </div>
  );
}
