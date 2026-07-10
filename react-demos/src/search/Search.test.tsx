import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Search from './Search';

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
      '/search-api/sug?s=ap&max=8',
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(container.querySelector('.control.is-loading')).not.toBeNull();
    expect(container.querySelector('.list')).toBeNull();

    await act(async () => {
      resolveRequest(
        new Response(
          JSON.stringify([
            { word: 'apple', score: 1 },
            { word: 'apricot', score: 1 },
          ]),
          { status: 200 },
        ),
      );
      await request;
    });

    const items = [...container.querySelectorAll<HTMLButtonElement>('.list-item')];
    expect(items.map((item) => item.textContent)).toEqual(['apple', 'apricot']);
    expect(container.querySelector('.control.is-loading')).toBeNull();
    act(() => items[1].click());
    expect(onSelectItem).toHaveBeenCalledWith('apricot');
  });
});
