import { useCallback, useEffect, useState, type KeyboardEvent } from 'react';
import './ImageCarousel.css';

export type CarouselSlide = {
  id: string;
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
  description: string;
};

export const DEFAULT_SLIDES: readonly CarouselSlide[] = [
  {
    id: 'quiet-horizon',
    src: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=85',
    alt: 'A calm lake surrounded by mountains',
    eyebrow: '01 / Landscape',
    title: 'Find a quieter horizon',
    description: 'A focused frame gives the next decision room to appear.',
  },
  {
    id: 'unexpected-path',
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=85',
    alt: 'A green valley beneath a bright sky',
    eyebrow: '02 / Landscape',
    title: 'Make room for the unexpected',
    description: 'Small interactions become easier to understand when the state is explicit.',
  },
  {
    id: 'visible-path',
    src: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=85',
    alt: 'A wooden path leading through a green field',
    eyebrow: '03 / Landscape',
    title: 'Keep the path visible',
    description: 'Navigation stays discoverable with buttons, dots, and keyboard support.',
  },
  {
    id: 'open-space',
    src: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1400&q=85',
    alt: 'A forest opening into a mountain valley',
    eyebrow: '04 / Landscape',
    title: 'Leave space for the next idea',
    description: 'A reusable slide shape keeps the visual layer separate from navigation state.',
  },
];

type ImageCarouselProps = {
  slides?: readonly CarouselSlide[];
};

function wrapIndex(index: number, length: number) {
  return (index + length) % length;
}

export default function ImageCarousel({ slides = DEFAULT_SLIDES }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex((currentIndex) => {
      if (slides.length === 0) {
        return 0;
      }

      return Math.min(currentIndex, slides.length - 1);
    });
  }, [slides.length]);

  const moveBy = useCallback(
    (offset: number) => {
      setActiveIndex((currentIndex) => wrapIndex(currentIndex + offset, slides.length));
    },
    [slides.length],
  );

  if (slides.length === 0) {
    return (
      <section className="image-carousel" aria-label="Image carousel">
        <p className="image-carousel__empty" role="status">
          No slides available.
        </p>
      </section>
    );
  }

  const safeActiveIndex = Math.min(activeIndex, slides.length - 1);
  const activeSlide = slides[safeActiveIndex];

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        moveBy(-1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        moveBy(1);
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(slides.length - 1);
        break;
      default:
        break;
    }
  };

  return (
    <section
      className="image-carousel"
      aria-label="Image carousel"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <header className="image-carousel__header">
        <p className="image-carousel__eyebrow">UX &amp; quality / Interview exercise</p>
        <h1>Image Carousel</h1>
        <p>
          A small, reusable slider with predictable state, keyboard navigation, and an explicit
          empty state.
        </p>
      </header>

      <div className="image-carousel__panel">
        <div className="image-carousel__stage">
          <img
            key={activeSlide.id}
            className="image-carousel__image"
            src={activeSlide.src}
            alt={activeSlide.alt}
            draggable="false"
          />
          <div className="image-carousel__scrim" aria-hidden="true" />
          <div className="image-carousel__content">
            <p className="image-carousel__slide-eyebrow">{activeSlide.eyebrow}</p>
            <h2>{activeSlide.title}</h2>
            <p>{activeSlide.description}</p>
          </div>
          <div className="image-carousel__arrows" aria-label="Carousel controls">
            <button type="button" aria-label="Previous slide" onClick={() => moveBy(-1)}>
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" aria-label="Next slide" onClick={() => moveBy(1)}>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <div className="image-carousel__footer">
          <p className="image-carousel__count" aria-live="polite">
            <span className="sr-only">Current slide: </span>
            {safeActiveIndex + 1} / {slides.length}
          </p>
          <div className="image-carousel__dots" aria-label="Choose slide">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className={`image-carousel__dot${index === safeActiveIndex ? ' is-active' : ''}`}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === safeActiveIndex ? 'true' : undefined}
                title={slide.title}
                onClick={() => setActiveIndex(index)}
              >
                <span aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <p className="image-carousel__hint">
        Tip: focus the carousel, then use <kbd>←</kbd> <kbd>→</kbd>, <kbd>Home</kbd>, or{' '}
        <kbd>End</kbd>.
      </p>
      <p className="sr-only" aria-live="polite">
        Slide {safeActiveIndex + 1} of {slides.length}: {activeSlide.title}
      </p>
    </section>
  );
}
