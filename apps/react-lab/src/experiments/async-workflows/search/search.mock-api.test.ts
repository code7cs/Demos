import { describe, expect, it } from 'vitest';
import { getSearchSuggestions } from './search.mock-api';

describe('getSearchSuggestions', () => {
  it('returns case-insensitive substring matches', () => {
    expect(getSearchSuggestions('aws')).toEqual(['AWS Marketplace', 'AWS Lambda']);
    expect(getSearchSuggestions('CONTROL')).toEqual(['Webex Control Hub']);
  });

  it('returns an empty list for a blank query', () => {
    expect(getSearchSuggestions('   ')).toEqual([]);
  });
});
