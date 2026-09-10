import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  signal,
  untracked,
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
import { SoundService } from '../../../core/services/sound.service';
import { SpeechRecognitionService } from '../../../core/services/speech-recognition.service';
import {
  getAvailablePictureModes,
  getCategoryItemPictureUrl,
} from '../../../core/utils/category-image';
import { isSpokenAnswerCorrect } from '../../../core/utils/speech-answer';
import { normalizeWord } from '../../../core/utils/word-builder';

type AnswerStatus = 'idle' | 'correct' | 'incorrect';

@Component({
  selector: 'app-name-picture-play',
  imports: [RouterLink, MatButtonModule, MatButtonToggleModule],
  templateUrl: './name-picture-play.html',
  styleUrl: './name-picture-play.scss',
})
export class NamePicturePlay implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly settingsService = inject(GameSettingsService);
  private readonly sound = inject(SoundService);
  private readonly speech = inject(SpeechRecognitionService);

  readonly pictureModeLabels = PICTURE_MODE_LABELS;
  readonly speechSupported = signal(this.speech.isSupported());

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
  readonly isListening = signal(false);
  readonly heardText = signal('');
  readonly speechError = signal('');
  readonly typedFallback = signal('');
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

  constructor() {
    effect(() => {
      const item = this.currentItem();
      const completed = this.isCompleted();

      if (!item || completed) {
        return;
      }

      untracked(() => this.setupRound());
    });
  }

  ngOnDestroy(): void {
    this.speech.stop();
  }

  startListening(): void {
    if (this.answerStatus() === 'correct' || this.isListening()) {
      return;
    }

    this.speechError.set('');
    this.heardText.set('');
    this.answerStatus.set('idle');

    const started = this.speech.start({
      lang: 'ru-RU',
      onResult: (result) => {
        this.heardText.set(result.transcript);

        if (!result.isFinal) {
          return;
        }

        this.evaluateAnswer(result.transcript);
      },
      onError: (message) => {
        this.speechError.set(message);
        this.isListening.set(false);
      },
      onEnd: () => {
        this.isListening.set(false);
      },
    });

    if (started) {
      this.isListening.set(true);
    }
  }

  submitTypedAnswer(): void {
    if (this.answerStatus() === 'correct') {
      return;
    }

    this.evaluateAnswer(this.typedFallback());
  }

  onTypedFallbackInput(event: Event): void {
    this.typedFallback.set((event.target as HTMLInputElement).value);
    this.answerStatus.set('idle');
    this.speechError.set('');
  }

  nextTask(): void {
    this.speech.stop();
    this.isListening.set(false);

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
    this.speech.stop();
    this.isListening.set(false);
    this.currentIndex.set(0);
    this.isCompleted.set(false);
    this.answerStatus.set('idle');
  }

  goBackToThemes(): void {
    void this.router.navigate(['/name-picture']);
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

  private setupRound(): void {
    this.speech.stop();
    this.isListening.set(false);
    this.answerStatus.set('idle');
    this.heardText.set('');
    this.speechError.set('');
    this.typedFallback.set('');
    this.pictureLoadFailed.set(false);
  }

  private evaluateAnswer(rawAnswer: string): void {
    const item = this.currentItem();
    if (!item || this.answerStatus() === 'correct') {
      return;
    }

    const normalized = normalizeWord(rawAnswer);
    if (!normalized) {
      return;
    }

    if (isSpokenAnswerCorrect(rawAnswer, item.label)) {
      this.answerStatus.set('correct');
      this.speech.stop();
      this.isListening.set(false);
      this.sound.playCorrect();
      return;
    }

    this.answerStatus.set('incorrect');
    this.sound.playIncorrect();
  }
}
