import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { getCategoryById, isCategoryId } from '../../../core/data/categories';
import { PictureMode, PICTURE_MODE_LABELS } from '../../../core/models/game-settings.model';
import { GameSettingsService } from '../../../core/services/game-settings.service';
import {
  getAvailablePictureModes,
  getCategoryItemPictureUrl,
} from '../../../core/utils/category-image';
import { CategoryItem } from '../../../core/models/category.model';
import { createTrueFalseRound, TrueFalseRound } from '../../../core/utils/game-round';

type AnswerStatus = 'idle' | 'correct' | 'incorrect';

@Component({
  selector: 'app-true-false-play',
  imports: [RouterLink, MatButtonModule, MatButtonToggleModule],
  templateUrl: './true-false-play.html',
  styleUrl: './true-false-play.scss',
})
export class TrueFalsePlay {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly settingsService = inject(GameSettingsService);

  readonly pictureModeLabels = PICTURE_MODE_LABELS;

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
  readonly round = signal<TrueFalseRound | null>(null);
  readonly selectedAnswer = signal<boolean | null>(null);
  readonly pictureLoadFailed = signal(false);

  readonly pictureMode = computed(() => this.settingsService.settings().pictureMode);

  readonly availablePictureModes = computed(() => {
    const category = this.category();
    return category ? getAvailablePictureModes(category.id) : ['emoji' as PictureMode];
  });

  readonly showPictureModeToggle = computed(() => this.availablePictureModes().length > 1);

  readonly currentItem = computed(() => {
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
    const round = this.round();
    if (!category || !round) {
      return null;
    }

    return getCategoryItemPictureUrl(category.id, round.pictureItem.id, this.pictureMode());
  });

  readonly usePicture = computed(
    () => this.pictureMode() !== 'emoji' && !!this.currentPictureUrl() && !this.pictureLoadFailed(),
  );

  constructor() {
    effect(() => {
      const item = this.currentItem();
      const category = this.category();
      const completed = this.isCompleted();

      if (!item || !category || completed) {
        return;
      }

      untracked(() => this.setupRound(item, category.items));
    });
  }

  answer(userSaysMatch: boolean): void {
    if (this.answerStatus() === 'correct') {
      return;
    }

    const round = this.round();
    if (!round) {
      return;
    }

    this.selectedAnswer.set(userSaysMatch);

    if (userSaysMatch === round.isMatch) {
      this.answerStatus.set('correct');
      return;
    }

    this.answerStatus.set('incorrect');
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

  isAnswerWrong(userSaysMatch: boolean): boolean {
    return this.answerStatus() === 'incorrect' && this.selectedAnswer() === userSaysMatch;
  }

  isAnswerCorrect(userSaysMatch: boolean): boolean {
    const round = this.round();
    return (
      this.answerStatus() === 'correct' &&
      this.selectedAnswer() === userSaysMatch &&
      userSaysMatch === round?.isMatch
    );
  }

  private setupRound(item: CategoryItem, pool: CategoryItem[]): void {
    this.round.set(createTrueFalseRound(item, pool));
    this.answerStatus.set('idle');
    this.selectedAnswer.set(null);
    this.pictureLoadFailed.set(false);
  }
}
