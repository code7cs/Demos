export const SEARCH_API_URL = '/search-api/sug';

type DatamuseSuggestion = {
  word: string;
  score: number;
};

export async function fetchSuggestions(query: string, signal?: AbortSignal): Promise<string[]> {
  const queryString = new URLSearchParams({ s: query, max: '8' });
  const response = await fetch(`${SEARCH_API_URL}?${queryString}`, { signal });
  if (!response.ok) {
    throw new Error('Unable to load suggestions');
  }

  const data: unknown = await response.json();
  if (
    !Array.isArray(data) ||
    !data.every(
      (item): item is DatamuseSuggestion =>
        typeof item === 'object' &&
        item !== null &&
        typeof item.word === 'string' &&
        typeof item.score === 'number',
    )
  ) {
    throw new Error('Invalid suggestions response');
  }

  return data.map((item) => item.word);
}
