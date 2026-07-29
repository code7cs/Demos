const DEFAULT_WORD_URL = 'https://api.frontendeval.com/fake/word';
const WORD_URL_SELECTOR = '#wordle-api-url';

export function getQuery(): string {
  const element = document.querySelector(WORD_URL_SELECTOR);
  const url = element?.getAttribute('data-url')?.trim();

  return url || DEFAULT_WORD_URL;
}

export function getValidWordUrl(wordUrl: string): string {
  return wordUrl.replace(/\/word\/?$/, '/word/valid');
}

declare global {
  interface Window {
    getQuery?: () => string;
  }
}

export function registerGetQueryConsoleHelper(): void {
  window.getQuery = getQuery;
}
