import { Component, ElementRef, input, signal, viewChild } from '@angular/core';

export type CarouselSlide = {
  src: string;
  alt: string;
};

@Component({
  selector: 'app-swipe-carousel',
  template: `
    <div class="relative">
      <div
        #track
        class="carousel-track flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 -mx-1 px-1 touch-pan-x"
        (scroll)="onScroll()"
      >
        @for (slide of slides(); track slide.src; let i = $index) {
          <figure
            class="carousel-slide shrink-0 snap-center rounded-2xl overflow-hidden border-2 border-brand-pink/30 bg-brand-black shadow-xl shadow-brand-pink/10"
          >
            <img [src]="slide.src" [alt]="slide.alt" class="w-full h-full object-cover" loading="lazy" />
          </figure>
        }
      </div>

      @if (slides().length > 1) {
        <div class="flex items-center justify-center gap-3 mt-6">
          <button
            type="button"
            class="carousel-nav"
            (click)="scrollBy(-1)"
            aria-label="Anterior"
          >
            ‹
          </button>

          <div class="flex items-center gap-2">
            @for (slide of slides(); track slide.src; let i = $index) {
              <button
                type="button"
                class="carousel-dot"
                [class.is-active]="activeIndex() === i"
                (click)="scrollTo(i)"
                [attr.aria-label]="'Ir para slide ' + (i + 1)"
              ></button>
            }
          </div>

          <button
            type="button"
            class="carousel-nav"
            (click)="scrollBy(1)"
            aria-label="Próximo"
          >
            ›
          </button>
        </div>

        <p class="text-center text-sm text-brand-muted mt-3 md:hidden">Deslize com o dedo para ver mais</p>
      }
    </div>
  `,
  styles: `
    .carousel-track {
      scrollbar-width: none;
      -ms-overflow-style: none;
      -webkit-overflow-scrolling: touch;
    }

    .carousel-track::-webkit-scrollbar {
      display: none;
    }

    .carousel-slide {
      width: min(85vw, 320px);
      aspect-ratio: 3 / 4;
    }

    @media (min-width: 768px) {
      .carousel-slide {
        width: 300px;
      }
    }

    .carousel-nav {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 9999px;
      border: 1px solid rgb(233 30 140 / 0.4);
      background: rgb(20 16 20);
      color: #fff;
      font-size: 1.5rem;
      line-height: 1;
      transition: background 0.2s ease, border-color 0.2s ease;
    }

    .carousel-nav:hover {
      background: rgb(233 30 140 / 0.2);
      border-color: rgb(233 30 140 / 0.7);
    }

    .carousel-dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 9999px;
      background: rgb(233 30 140 / 0.25);
      transition: transform 0.2s ease, background 0.2s ease;
    }

    .carousel-dot.is-active {
      background: rgb(233 30 140);
      transform: scale(1.25);
    }
  `,
})
export class SwipeCarouselComponent {
  readonly slides = input.required<CarouselSlide[]>();

  private readonly track = viewChild<ElementRef<HTMLElement>>('track');
  protected readonly activeIndex = signal(0);

  protected onScroll(): void {
    const el = this.track()?.nativeElement;
    if (!el) {
      return;
    }

    const slide = el.querySelector<HTMLElement>('.carousel-slide');
    if (!slide) {
      return;
    }

    const gap = 16;
    const slideWidth = slide.offsetWidth + gap;
    const index = Math.round(el.scrollLeft / slideWidth);
    this.activeIndex.set(Math.min(Math.max(index, 0), this.slides().length - 1));
  }

  protected scrollTo(index: number): void {
    const el = this.track()?.nativeElement;
    if (!el) {
      return;
    }

    const slide = el.querySelector<HTMLElement>('.carousel-slide');
    if (!slide) {
      return;
    }

    const gap = 16;
    const slideWidth = slide.offsetWidth + gap;
    el.scrollTo({ left: slideWidth * index, behavior: 'smooth' });
    this.activeIndex.set(index);
  }

  protected scrollBy(direction: -1 | 1): void {
    const next = this.activeIndex() + direction;
    const wrapped =
      next < 0 ? this.slides().length - 1 : next >= this.slides().length ? 0 : next;
    this.scrollTo(wrapped);
  }
}
