import { useEffect, useState } from 'react';
import { fetchSuggestions } from './search.api';

export const SEARCH_DEBOUNCE_MS = 500;

export function useSearchSuggestions(query: string) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) {
      setSuggestions([]);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    setSuggestions([]);
    setError(null);
    setLoading(false);

    const timeoutId = setTimeout(() => {
      setLoading(true);

      fetchSuggestions(normalizedQuery, controller.signal)
        .then(setSuggestions)
        .catch(() => {
          if (!controller.signal.aborted) {
            setSuggestions([]);
            setError('Unable to load suggestions. Please try again.');
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) {
            setLoading(false);
          }
        });
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  return { error, loading, suggestions };
}
