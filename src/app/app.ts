import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CarouselSlide, SwipeCarouselComponent } from './swipe-carousel.component';

type AssistantQuestion = {
  id: string;
  question: string;
  options: { label: string; value: string }[];
};

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SwipeCarouselComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly currentYear = new Date().getFullYear();
  protected readonly whatsappNumber = '559991544003';
  protected readonly whatsappMessage = encodeURIComponent(
    'Olá, Cinthya! Quero saber mais sobre a consultoria online e começar minha transformação.',
  );
  protected readonly whatsappLink = `https://wa.me/${this.whatsappNumber}?text=${this.whatsappMessage}`;
  protected readonly mobileMenuOpen = signal(false);
  protected readonly assistantOpen = signal(true);

  protected readonly assistantQuestions: AssistantQuestion[] = [
    {
      id: 'goal',
      question: 'Qual é o seu objetivo principal?',
      options: [
        { label: 'Emagrecer', value: 'emagrecer' },
        { label: 'Melhorar autoestima', value: 'melhorar autoestima' },
        { label: 'Definir corpo e postura', value: 'definir corpo e postura' },
        { label: 'Treino para rotina real', value: 'treino para rotina real' },
      ],
    },
    {
      id: 'format',
      question: 'Como você prefere ser atendida?',
      options: [
        { label: 'Online', value: 'online' },
        { label: 'Presencial', value: 'presencial em Açailândia' },
        { label: 'Pode ser os dois', value: 'online e presencial' },
      ],
    },
    {
      id: 'time',
      question: 'Qual o seu momento atual?',
      options: [
        { label: 'Quero começar agora', value: 'quero começar agora' },
        { label: 'Ainda estou avaliando', value: 'ainda estou avaliando' },
        { label: 'Preciso de apoio e disciplina', value: 'preciso de apoio e disciplina' },
      ],
    },
  ];

  protected readonly assistantIndex = signal(0);
  protected readonly assistantAnswers = signal<Record<string, string>>({});
  protected readonly assistantFinished = signal(false);

  protected readonly resultSlides: CarouselSlide[] = Array.from({ length: 12 }, (_, i) => ({
    src: `resultado${i + 1}.jpeg`,
    alt: `Resultado de transformação ${i + 1}`,
  }));

  protected readonly testimonialSlides: CarouselSlide[] = [
    { src: 'depoimento2.jpeg', alt: 'Depoimento de aluna 2' },
    { src: 'depoimento3.jpeg', alt: 'Depoimento de aluna 3' },
  ];

  protected get currentAssistantQuestion(): AssistantQuestion {
    return this.assistantQuestions[this.assistantIndex()];
  }

  protected toggleAssistant(): void {
    this.assistantOpen.update((value) => !value);
  }

  protected openAssistant(): void {
    this.assistantOpen.set(true);
  }

  protected closeAssistant(): void {
    this.assistantOpen.set(false);
  }

  protected selectAssistantOption(value: string): void {
    const current = this.currentAssistantQuestion;
    const answers = { ...this.assistantAnswers() };
    answers[current.id] = value;
    this.assistantAnswers.set(answers);

    if (this.assistantIndex() < this.assistantQuestions.length - 1) {
      this.assistantIndex.set(this.assistantIndex() + 1);
      return;
    }

    this.assistantFinished.set(true);
  }

  protected resetAssistant(): void {
    this.assistantIndex.set(0);
    this.assistantAnswers.set({});
    this.assistantFinished.set(false);
  }

  protected getAssistantWhatsappLink(): string {
    const answers = this.assistantAnswers();
    const goal = answers['goal'] ?? 'emagrecer';
    const format = answers['format'] ?? 'online';
    const time = answers['time'] ?? 'quero começar agora';

    const text =
      `Olá, Cinthya! Sou uma aluna interessada em transformação pessoal. ` +
      `Meu principal objetivo é ${goal}. ` +
      `Prefiro atendimento ${format}. ` +
      `Meu momento atual é: ${time}. ` +
      `Quero saber mais sobre a consultoria e começar.`;

    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(text)}`;
  }

  protected toggleMenu(): void {
    this.mobileMenuOpen.update((value) => !value);
  }

  protected closeMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
