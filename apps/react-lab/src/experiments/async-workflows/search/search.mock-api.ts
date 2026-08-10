export const SEARCH_ITEMS = [
  'AWS Marketplace',
  'AWS Lambda',
  'Amazon Aurora',
  'Amazon CloudFront',
  'Amazon Cognito',
  'Amazon S3',
  'React',
  'TypeScript',
  'Webex Control Hub',
] as const;

export function getSearchSuggestions(query: string): string[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  if (!normalizedQuery) {
    return [];
  }

  return SEARCH_ITEMS.filter((item) =>
    item.toLocaleLowerCase().includes(normalizedQuery),
  ).slice(0, 8);
}
