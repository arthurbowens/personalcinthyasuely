import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CarouselSlide, SwipeCarouselComponent } from './swipe-carousel.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SwipeCarouselComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly currentYear = new Date().getFullYear();
  protected readonly whatsappMessage = encodeURIComponent(
    'Olá, Cinthya! Quero saber mais sobre a consultoria online e começar minha transformação.',
  );
  protected readonly whatsappLink = `https://wa.me/559991544003?text=${this.whatsappMessage}`;
  protected readonly mobileMenuOpen = signal(false);

  protected readonly resultSlides: CarouselSlide[] = Array.from({ length: 12 }, (_, i) => ({
    src: `resultado${i + 1}.jpeg`,
    alt: `Resultado de transformação ${i + 1}`,
  }));

  protected readonly testimonialSlides: CarouselSlide[] = [
    { src: 'depoimento2.jpeg', alt: 'Depoimento de aluna 2' },
    { src: 'depoimento3.jpeg', alt: 'Depoimento de aluna 3' },
  ];

  protected toggleMenu(): void {
    this.mobileMenuOpen.update((value) => !value);
  }

  protected closeMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
