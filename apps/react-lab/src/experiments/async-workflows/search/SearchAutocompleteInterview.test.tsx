import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import SearchAutocompleteInterview from './SearchAutocompleteInterview';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

describe('SearchAutocompleteInterview', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  it('filters local items as the user types', () => {
    act(() => root.render(<SearchAutocompleteInterview />));
    const input = container.querySelector<HTMLInputElement>('input')!;

    act(() => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(
        input,
        'aws',
      );
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    expect([...container.querySelectorAll('button')].map((button) => button.textContent)).toEqual([
      'AWS Marketplace',
      'AWS Lambda',
    ]);
  });

  it('puts the clicked suggestion in the input', () => {
    act(() => root.render(<SearchAutocompleteInterview />));
    const input = container.querySelector<HTMLInputElement>('input')!;

    act(() => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(
        input,
        'react',
      );
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    act(() => container.querySelector('button')!.click());

    expect(input.value).toBe('React');
    expect(container.textContent).toContain('Selected: React');
  });
});
