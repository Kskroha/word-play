import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { getCategoryById, isCategoryId } from '../../../core/data/categories';
import { CategoryItem } from '../../../core/models/category.model';
import { PictureMode, PICTURE_MODE_LABELS } from '../../../core/models/game-settings.model';
import { GameSettingsService } from '../../../core/services/game-settings.service';
import { SoundService } from '../../../core/services/sound.service';
import {
  getAvailablePictureModes,
  getCategoryItemPictureUrl,
} from '../../../core/utils/category-image';
import { pickPictureChoices } from '../../../core/utils/game-round';
import { createPlayItemsSignal, resetPlayItems } from '../../../core/utils/play-items';

type AnswerStatus = 'idle' | 'correct' | 'incorrect';

@Component({
  selector: 'app-picture-choice-play',
  imports: [RouterLink, MatButtonModule, MatButtonToggleModule],
  templateUrl: './picture-choice-play.html',
  styleUrl: './picture-choice-play.scss',
})
export class PictureChoicePlay {
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
  readonly choices = signal<CategoryItem[]>([]);
  readonly selectedChoiceId = signal<string | null>(null);
  readonly failedPictureIds = signal<Set<string>>(new Set());

  readonly pictureMode = computed(() => this.settingsService.settings().pictureMode);

  readonly maxChoices = computed(() => this.settingsService.settings().maxAnswerChoices);

  readonly availablePictureModes = computed(() => {
    const category = this.category();
    return category ? getAvailablePictureModes(category.id) : ['emoji' as PictureMode];
  });

  readonly showPictureModeToggle = computed(() => this.availablePictureModes().length > 1);

  readonly currentItem = computed<CategoryItem | undefined>(
    () => this.playItems()[this.currentIndex()],
  );

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

  constructor() {
    effect(() => {
      const item = this.currentItem();
      const category = this.category();
      const completed = this.isCompleted();

      if (!item || !category || completed) {
        return;
      }

      untracked(() => this.setupRound(item, this.playItems()));
    });
  }

  getPictureUrl(item: CategoryItem): string | null {
    const category = this.category();
    if (!category) {
      return null;
    }

    return getCategoryItemPictureUrl(category.id, item.id, this.pictureMode());
  }

  usePicture(item: CategoryItem): boolean {
    return (
      this.pictureMode() !== 'emoji' &&
      !!this.getPictureUrl(item) &&
      !this.failedPictureIds().has(item.id)
    );
  }

  onPictureError(itemId: string): void {
    this.failedPictureIds.update((ids) => new Set(ids).add(itemId));
  }

  selectChoice(choice: CategoryItem): void {
    if (this.answerStatus() === 'correct') {
      return;
    }

    const item = this.currentItem();
    if (!item) {
      return;
    }

    this.selectedChoiceId.set(choice.id);

    if (choice.id === item.id) {
      this.answerStatus.set('correct');
      this.sound.playCorrectThenSpeak(item.label);
      return;
    }

    this.answerStatus.set('incorrect');
    this.sound.playIncorrect();
  }

  nextTask(): void {
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
    this.refreshPlayItems();
    this.currentIndex.set(0);
    this.isCompleted.set(false);
    this.answerStatus.set('idle');
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
    this.failedPictureIds.set(new Set());
  }

  isChoiceWrong(choiceId: string): boolean {
    return this.answerStatus() === 'incorrect' && this.selectedChoiceId() === choiceId;
  }

  isChoiceCorrect(choiceId: string): boolean {
    const item = this.currentItem();
    return this.answerStatus() === 'correct' && item?.id === choiceId;
  }

  private refreshPlayItems(): void {
    resetPlayItems(this.playItems, this.category(), this.settingsService.settings().maxWordsPerGame);
  }

  private setupRound(item: CategoryItem, pool: CategoryItem[]): void {
    this.choices.set(pickPictureChoices(item, pool, this.maxChoices()));
    this.answerStatus.set('idle');
    this.selectedChoiceId.set(null);
    this.failedPictureIds.set(new Set());
    this.sound.speakWord(item.label, { delayMs: 300 });
  }

  speakPrompt(word = this.currentItem()?.label): void {
    if (!word) {
      return;
    }

    this.sound.speakWord(word);
  }
}
