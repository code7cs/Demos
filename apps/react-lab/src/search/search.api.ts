export const SEARCH_API_URL = '/search-api/items';

export async function fetchSuggestions(
  query: string,
  signal?: AbortSignal,
): Promise<string[]> {
  const queryString = new URLSearchParams({ q: query });
  const response = await fetch(`${SEARCH_API_URL}?${queryString}`, { signal });
  if (!response.ok) {
    throw new Error('Unable to load suggestions');
  }

  const data: unknown = await response.json();
  if (!Array.isArray(data) || !data.every((item) => typeof item === 'string')) {
    throw new Error('Invalid suggestions response');
  }

  return data;
}
