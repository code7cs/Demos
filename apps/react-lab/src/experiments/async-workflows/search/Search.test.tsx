import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Search from './Search';
import { SEARCH_DEBOUNCE_MS } from './useSearchSuggestions';

describe('Search', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    vi.useFakeTimers();
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('renders the required input structure', () => {
    act(() => root.render(<Search onSelectItem={vi.fn()} />));
    expect(container.querySelector('.control > input.input')).not.toBeNull();
    expect(container.querySelector('.list')).toBeNull();
  });

  it('debounces requests and renders selectable suggestions', async () => {
    let resolveRequest: (response: Response) => void = () => undefined;
    const request = new Promise<Response>((resolve) => {
      resolveRequest = resolve;
    });
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockReturnValue(request);
    const onSelectItem = vi.fn();

    act(() => root.render(<Search onSelectItem={onSelectItem} />));
    const input = container.querySelector('input')!;
    act(() => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, 'ap');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    await act(async () => vi.advanceTimersByTime(499));
    expect(fetchMock).not.toHaveBeenCalled();
    await act(async () => vi.advanceTimersByTime(1));
    expect(fetchMock).toHaveBeenCalledWith(
      '/search-api/items?q=ap',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(container.querySelector('.control.is-loading')).not.toBeNull();
    expect(container.querySelector('.list')).toBeNull();

    await act(async () => {
      resolveRequest(new Response(JSON.stringify(['apple', 'apricot']), { status: 200 }));
      await request;
    });

    const items = [...container.querySelectorAll<HTMLButtonElement>('.list-item')];
    expect(items.map((item) => item.textContent)).toEqual(['apple', 'apricot']);
    expect(container.querySelector('.control.is-loading')).toBeNull();
    act(() => items[1].click());
    expect(onSelectItem).toHaveBeenCalledWith('apricot');
  });

  it('supports keyboard navigation and selects the active suggestion', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(['apple', 'apricot']), { status: 200 }),
    );
    const onSelectItem = vi.fn();

    act(() => root.render(<Search onSelectItem={onSelectItem} />));
    const input = container.querySelector<HTMLInputElement>('input')!;

    act(() => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, 'ap');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await act(async () => vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS));
    await act(async () => undefined);

    expect(fetchMock).toHaveBeenCalledWith(
      '/search-api/items?q=ap',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );

    act(() => input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })));
    expect(input.getAttribute('aria-activedescendant')).toBe('search-option-0');

    act(() => input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })));
    expect(input.getAttribute('aria-activedescendant')).toBe('search-option-1');

    act(() => input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })));

    expect(onSelectItem).toHaveBeenCalledWith('apricot');
    expect(input.value).toBe('apricot');
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('renders a recoverable error when suggestions cannot be loaded', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network failure'));

    act(() => root.render(<Search onSelectItem={vi.fn()} />));
    const input = container.querySelector<HTMLInputElement>('input')!;

    act(() => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, 'ap');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await act(async () => vi.advanceTimersByTime(SEARCH_DEBOUNCE_MS));
    await act(async () => undefined);

    expect(container.querySelector('[role="alert"]')?.textContent).toContain(
      'Unable to load suggestions',
    );
  });
});
