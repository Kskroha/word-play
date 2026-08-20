import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { getCategoryById, isCategoryId } from '../../../core/data/categories';
import { CategoryItem } from '../../../core/models/category.model';
import { PictureMode, PICTURE_MODE_LABELS } from '../../../core/models/game-settings.model';
import { GameSettingsService } from '../../../core/services/game-settings.service';
import {
  getAvailablePictureModes,
  getCategoryItemPictureUrl,
} from '../../../core/utils/category-image';
import {
  getItemTypingAnswer,
  isTypedAnswerCorrect,
  isTypedLetterCorrect,
} from '../../../core/utils/game-round';
import { normalizeWord, splitAnswerIntoLetters } from '../../../core/utils/word-builder';

type AnswerStatus = 'idle' | 'correct' | 'incorrect';

@Component({
  selector: 'app-type-word-play',
  imports: [RouterLink, MatButtonModule, MatButtonToggleModule],
  templateUrl: './type-word-play.html',
  styleUrl: './type-word-play.scss',
})
export class TypeWordPlay {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly settingsService = inject(GameSettingsService);

  readonly pictureModeLabels = PICTURE_MODE_LABELS;

  private readonly typeInput = viewChild<ElementRef<HTMLInputElement>>('typeInput');

  private readonly categoryId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('categoryId') ?? '')),
    { initialValue: '' },
  );

  readonly category = computed(() => {
    const id = this.categoryId();
    return isCategoryId(id) ? getCategoryById(id) : undefined;
  });

  readonly currentIndex = signal(0);
  readonly answerStatus = signal<AnswerStatus>('idle');
  readonly isCompleted = signal(false);
  readonly typedText = signal('');
  readonly expectedLetters = signal<string[]>([]);
  readonly pictureLoadFailed = signal(false);

  readonly pictureMode = computed(() => this.settingsService.settings().pictureMode);

  readonly availablePictureModes = computed(() => {
    const category = this.category();
    return category ? getAvailablePictureModes(category.id) : ['emoji' as PictureMode];
  });

  readonly showPictureModeToggle = computed(() => this.availablePictureModes().length > 1);

  readonly currentItem = computed<CategoryItem | undefined>(() => {
    const category = this.category();
    if (!category) {
      return undefined;
    }

    return category.items[this.currentIndex()];
  });

  readonly progressLabel = computed(() => {
    const category = this.category();
    if (!category) {
      return '';
    }

    return `${this.currentIndex() + 1} / ${category.items.length}`;
  });

  readonly progressPercent = computed(() => {
    const category = this.category();
    if (!category || category.items.length === 0) {
      return 0;
    }

    return ((this.currentIndex() + 1) / category.items.length) * 100;
  });

  readonly currentPictureUrl = computed(() => {
    const category = this.category();
    const item = this.currentItem();
    if (!category || !item) {
      return null;
    }

    return getCategoryItemPictureUrl(category.id, item.id, this.pictureMode());
  });

  readonly usePicture = computed(
    () => this.pictureMode() !== 'emoji' && !!this.currentPictureUrl() && !this.pictureLoadFailed(),
  );

  readonly currentAnswer = computed(() => {
    const item = this.currentItem();
    return item ? getItemTypingAnswer(item) : '';
  });

  constructor() {
    effect(() => {
      const item = this.currentItem();
      const completed = this.isCompleted();

      if (!item || completed) {
        return;
      }

      untracked(() => this.setupRound(item));
    });

    effect(() => {
      const item = this.currentItem();
      const completed = this.isCompleted();

      if (!item || completed) {
        return;
      }

      untracked(() => {
        queueMicrotask(() => this.focusInput());
      });
    });
  }

  focusInput(): void {
    if (this.answerStatus() === 'correct') {
      return;
    }

    this.typeInput()?.nativeElement.focus();
  }

  onTypeInput(event: Event): void {
    if (this.answerStatus() === 'correct') {
      return;
    }

    const rawValue = (event.target as HTMLInputElement).value;
    const normalized = normalizeWord(rawValue);
    const maxLength = this.expectedLetters().length;
    const clipped = normalized.slice(0, maxLength);

    if (clipped !== rawValue && this.typeInput()?.nativeElement) {
      this.typeInput()!.nativeElement.value = clipped;
    }

    this.typedText.set(clipped);
    this.evaluateIfComplete();
  }

  onTypeKeydown(event: KeyboardEvent): void {
    if (this.answerStatus() === 'correct') {
      event.preventDefault();
    }
  }

  slotLetter(index: number): string {
    return this.typedText()[index] ?? '';
  }

  isSlotFilled(index: number): boolean {
    return index < this.typedText().length;
  }

  isSlotCorrect(index: number): boolean {
    if (this.answerStatus() !== 'correct' && this.answerStatus() !== 'incorrect') {
      return false;
    }

    return isTypedLetterCorrect(this.typedText(), this.expectedLetters(), index);
  }

  isSlotWrong(index: number): boolean {
    if (this.answerStatus() !== 'incorrect') {
      return false;
    }

    if (!this.isSlotFilled(index)) {
      return false;
    }

    return !isTypedLetterCorrect(this.typedText(), this.expectedLetters(), index);
  }

  isSlotActive(index: number): boolean {
    if (this.answerStatus() === 'correct') {
      return false;
    }

    return index === this.typedText().length;
  }

  nextTask(): void {
    const category = this.category();
    if (!category) {
      return;
    }

    const nextIndex = this.currentIndex() + 1;
    if (nextIndex >= category.items.length) {
      this.isCompleted.set(true);
      return;
    }

    this.currentIndex.set(nextIndex);
  }

  restartCategory(): void {
    this.currentIndex.set(0);
    this.isCompleted.set(false);
    this.answerStatus.set('idle');
  }

  goBackToCategories(): void {
    const category = this.category();
    if (!category) {
      void this.router.navigate(['/categories']);
      return;
    }

    void this.router.navigate(['/categories', category.id]);
  }

  setPictureMode(mode: PictureMode | null): void {
    if (!mode) {
      return;
    }

    this.settingsService.update({ pictureMode: mode });
    this.pictureLoadFailed.set(false);
  }

  onPictureError(): void {
    this.pictureLoadFailed.set(true);
  }

  private setupRound(item: CategoryItem): void {
    const answer = getItemTypingAnswer(item);
    this.expectedLetters.set(splitAnswerIntoLetters(answer));
    this.typedText.set('');
    this.answerStatus.set('idle');
    this.pictureLoadFailed.set(false);

    const input = this.typeInput()?.nativeElement;
    if (input) {
      input.value = '';
    }
  }

  private evaluateIfComplete(): void {
    if (this.answerStatus() === 'correct') {
      return;
    }

    const typed = this.typedText();
    const expectedLength = this.expectedLetters().length;

    if (typed.length < expectedLength) {
      this.answerStatus.set('idle');
      return;
    }

    const answer = this.currentAnswer();
    this.answerStatus.set(isTypedAnswerCorrect(typed, answer) ? 'correct' : 'incorrect');
  }
}
