import { Component, computed, effect, inject, OnDestroy, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { getCategoryById, isCategoryId } from '../../../core/data/categories';
import { PictureMode, PICTURE_MODE_LABELS } from '../../../core/models/game-settings.model';
import { GameSettingsService } from '../../../core/services/game-settings.service';
import { SoundService } from '../../../core/services/sound.service';
import {
  getAvailablePictureModes,
  getCategoryItemPictureUrl,
} from '../../../core/utils/category-image';
import { getMatchConfirmationPhrase } from '../../../core/utils/speech-answer';
import { CategoryItem } from '../../../core/models/category.model';
import {
  createBalancedMatchSequence,
  createTrueFalseRound,
  TrueFalseRound,
} from '../../../core/utils/game-round';
import { createPlayItemsSignal, resetPlayItems } from '../../../core/utils/play-items';

type AnswerStatus = 'idle' | 'correct' | 'incorrect';

@Component({
  selector: 'app-true-false-play',
  imports: [RouterLink, MatButtonModule, MatButtonToggleModule],
  templateUrl: './true-false-play.html',
  styleUrl: './true-false-play.scss',
})
export class TrueFalsePlay implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly settingsService = inject(GameSettingsService);
  private readonly sound = inject(SoundService);

  readonly pictureModeLabels = PICTURE_MODE_LABELS;

  private readonly categoryId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('categoryId') ?? '')),
    { initialValue: '' },
  );

  readonly category = computed(() => {
    const id = this.categoryId();
    return isCategoryId(id) ? getCategoryById(id) : undefined;
  });

  readonly playItems = createPlayItemsSignal(
    this.category,
    () => this.settingsService.settings().maxWordsPerGame,
  );

  readonly currentIndex = signal(0);
  readonly answerStatus = signal<AnswerStatus>('idle');
  readonly isCompleted = signal(false);
  readonly round = signal<TrueFalseRound | null>(null);
  private readonly matchSequence = signal<boolean[]>([]);
  readonly selectedAnswer = signal<boolean | null>(null);
  readonly pictureLoadFailed = signal(false);
  private advanceTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly pictureMode = computed(() => this.settingsService.settings().pictureMode);

  readonly availablePictureModes = computed(() => {
    const category = this.category();
    return category ? getAvailablePictureModes(category.id) : ['emoji' as PictureMode];
  });

  readonly showPictureModeToggle = computed(() => this.availablePictureModes().length > 1);

  readonly currentItem = computed(() => this.playItems()[this.currentIndex()]);

  readonly progressLabel = computed(() => {
    const total = this.playItems().length;
    if (total === 0) {
      return '';
    }

    return `${this.currentIndex() + 1} / ${total}`;
  });

  readonly progressPercent = computed(() => {
    const total = this.playItems().length;
    if (total === 0) {
      return 0;
    }

    return ((this.currentIndex() + 1) / total) * 100;
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
      const completed = this.isCompleted();

      if (!item || completed) {
        return;
      }

      untracked(() => {
        const items = this.playItems();
        this.ensureMatchSequence(items.length);
        this.setupRound(item, items);
      });
    });
  }

  ngOnDestroy(): void {
    this.clearAdvanceTimeout();
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
    const spokenAnswer = getMatchConfirmationPhrase(round.isMatch, round.wordItem.label);

    if (userSaysMatch === round.isMatch) {
      this.answerStatus.set('correct');
      this.sound.playCorrectThenSpeak(spokenAnswer);
      this.scheduleAdvance();
      return;
    }

    this.answerStatus.set('incorrect');
    this.sound.playIncorrectThenSpeak(spokenAnswer);
  }

  nextTask(): void {
    this.clearAdvanceTimeout();

    const total = this.playItems().length;
    if (total === 0) {
      return;
    }

    const nextIndex = this.currentIndex() + 1;
    if (nextIndex >= total) {
      this.isCompleted.set(true);
      return;
    }

    this.currentIndex.set(nextIndex);
  }

  restartCategory(): void {
    this.clearAdvanceTimeout();
    this.refreshPlayItems();
    this.currentIndex.set(0);
    this.isCompleted.set(false);
    this.answerStatus.set('idle');
    this.matchSequence.set(createBalancedMatchSequence(this.playItems().length));
  }

  goBackToCategories(): void {
    const category = this.category();
    if (!category) {
      void this.router.navigate(['/vocabulary']);
      return;
    }

    void this.router.navigate(['/vocabulary', category.id]);
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

  private refreshPlayItems(): void {
    resetPlayItems(this.playItems, this.category(), this.settingsService.settings().maxWordsPerGame);
  }

  private ensureMatchSequence(roundCount: number): void {
    if (this.matchSequence().length === roundCount) {
      return;
    }

    this.matchSequence.set(createBalancedMatchSequence(roundCount));
  }

  private setupRound(item: CategoryItem, pool: CategoryItem[]): void {
    this.clearAdvanceTimeout();
    const isMatch = this.matchSequence()[this.currentIndex()] ?? false;
    const round = createTrueFalseRound(item, pool, isMatch);
    this.round.set(round);
    this.answerStatus.set('idle');
    this.selectedAnswer.set(null);
    this.pictureLoadFailed.set(false);
    this.sound.speakWord(round.wordItem.label, { delayMs: 300 });
  }

  speakPrompt(word = this.round()?.wordItem.label): void {
    if (!word) {
      return;
    }

    this.sound.speakWord(word);
  }

  private scheduleAdvance(): void {
    this.clearAdvanceTimeout();
    this.advanceTimeout = setTimeout(() => {
      this.advanceTimeout = null;
      this.nextTask();
    }, 4200);
  }

  private clearAdvanceTimeout(): void {
    if (this.advanceTimeout) {
      clearTimeout(this.advanceTimeout);
      this.advanceTimeout = null;
    }
  }
}
