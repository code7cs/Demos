import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import ImageCarousel, { type CarouselSlide } from './ImageCarousel';

const slides: CarouselSlide[] = [
  {
    id: 'one',
    src: 'one.jpg',
    alt: 'First landscape',
    eyebrow: '01 / Landscape',
    title: 'Find a quieter horizon',
    description: 'A short caption gives the slide a clear purpose.',
  },
  {
    id: 'two',
    src: 'two.jpg',
    alt: 'Second landscape',
    eyebrow: '02 / Landscape',
    title: 'Make room for the unexpected',
    description: 'The next slide is selected without reloading the page.',
  },
  {
    id: 'three',
    src: 'three.jpg',
    alt: 'Third landscape',
    eyebrow: '03 / Landscape',
    title: 'Keep the path visible',
    description: 'The controls stay understandable at every position.',
  },
];

describe('ImageCarousel', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
      true;
    container = document.createElement('div');
    document.body.append(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
  });

  const renderCarousel = () => {
    act(() => root.render(<ImageCarousel slides={slides} />));
  };

  it('renders the first slide with an accessible carousel structure', () => {
    renderCarousel();

    const carousel = container.querySelector('[aria-roledescription="carousel"]');
    expect(carousel).not.toBeNull();
    expect(container.querySelector('img')?.getAttribute('src')).toBe('one.jpg');
    expect(container.querySelector('img')?.getAttribute('alt')).toBe('First landscape');
    expect(container.textContent).toContain('Find a quieter horizon');
    expect(container.querySelector('[aria-label="Previous slide"]')).not.toBeNull();
    expect(container.querySelector('[aria-label="Next slide"]')).not.toBeNull();
    expect(container.querySelector('[aria-label="Go to slide 1"]')?.getAttribute('aria-current')).toBe(
      'true',
    );
  });

  it('moves forward, backward, and wraps around the slide list', () => {
    renderCarousel();

    const next = container.querySelector<HTMLButtonElement>('[aria-label="Next slide"]')!;
    const previous = container.querySelector<HTMLButtonElement>('[aria-label="Previous slide"]')!;

    act(() => next.click());
    expect(container.querySelector('img')?.getAttribute('src')).toBe('two.jpg');

    act(() => previous.click());
    expect(container.querySelector('img')?.getAttribute('src')).toBe('one.jpg');

    act(() => previous.click());
    expect(container.querySelector('img')?.getAttribute('src')).toBe('three.jpg');

    act(() => next.click());
    expect(container.querySelector('img')?.getAttribute('src')).toBe('one.jpg');
  });

  it('jumps to a selected dot and supports keyboard navigation', () => {
    renderCarousel();

    const carousel = container.querySelector<HTMLElement>('[aria-roledescription="carousel"]')!;
    const thirdDot = container.querySelector<HTMLButtonElement>('[aria-label="Go to slide 3"]')!;

    act(() => thirdDot.click());
    expect(container.querySelector('img')?.getAttribute('src')).toBe('three.jpg');

    act(() => carousel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true })));
    expect(container.querySelector('img')?.getAttribute('src')).toBe('two.jpg');

    act(() => carousel.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true })));
    expect(container.querySelector('img')?.getAttribute('src')).toBe('three.jpg');

    act(() => carousel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true })));
    expect(container.querySelector('img')?.getAttribute('src')).toBe('one.jpg');
  });

  it('renders a useful empty state without throwing', () => {
    act(() => root.render(<ImageCarousel slides={[]} />));

    expect(container.querySelector('[role="status"]')?.textContent).toContain('No slides available');
    expect(container.querySelector('[aria-label="Next slide"]')).toBeNull();
  });
});
