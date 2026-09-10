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
import {
  createBalancedMatchSequence,
  createTrueFalseRound,
  TrueFalseRound,
} from '../../../core/utils/game-round';
import { MIC_OFF_ICON, MIC_ON_ICON } from '../../../core/utils/mic-icons';
import { parseSpokenYesNo } from '../../../core/utils/speech-answer';

type AnswerStatus = 'idle' | 'correct' | 'incorrect';

@Component({
  selector: 'app-say-yes-no-play',
  imports: [RouterLink, MatButtonModule, MatButtonToggleModule],
  templateUrl: './say-yes-no-play.html',
  styleUrl: './say-yes-no-play.scss',
})
export class SayYesNoPlay implements OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly settingsService = inject(GameSettingsService);
  private readonly sound = inject(SoundService);
  private readonly speech = inject(SpeechRecognitionService);

  readonly pictureModeLabels = PICTURE_MODE_LABELS;
  readonly speechSupported = signal(this.speech.isSupported());
  readonly micOffIcon = MIC_OFF_ICON;
  readonly micOnIcon = MIC_ON_ICON;

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
  private readonly matchSequence = signal<boolean[]>([]);
  readonly selectedAnswer = signal<boolean | null>(null);
  readonly isListening = signal(false);
  readonly heardText = signal('');
  readonly speechError = signal('');
  readonly pictureLoadFailed = signal(false);
  private advanceTimeout: ReturnType<typeof setTimeout> | null = null;
  private retryResetTimeout: ReturnType<typeof setTimeout> | null = null;

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

      untracked(() => {
        this.ensureMatchSequence(category.items.length);
        this.setupRound(item, category.items);
      });
    });
  }

  ngOnDestroy(): void {
    this.clearTimers();
    this.speech.stop();
  }

  startListening(): void {
    if (this.answerStatus() === 'correct' || this.isListening()) {
      return;
    }

    this.clearRetryResetTimeout();
    this.speechError.set('');
    this.heardText.set('');

    const started = this.speech.start({
      lang: 'ru-RU',
      onResult: (result) => {
        this.heardText.set(result.transcript);

        if (!result.isFinal) {
          return;
        }

        this.evaluateSpokenAnswer(result.transcript);
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

  nextTask(): void {
    this.clearTimers();
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
    this.clearTimers();
    this.speech.stop();
    this.isListening.set(false);
    this.currentIndex.set(0);
    this.isCompleted.set(false);
    this.answerStatus.set('idle');

    const category = this.category();
    if (category) {
      this.matchSequence.set(createBalancedMatchSequence(category.items.length));
    }
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

  isHintSelected(userSaysMatch: boolean): boolean {
    return this.selectedAnswer() === userSaysMatch;
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

  private ensureMatchSequence(roundCount: number): void {
    if (this.matchSequence().length === roundCount) {
      return;
    }

    this.matchSequence.set(createBalancedMatchSequence(roundCount));
  }

  private setupRound(item: CategoryItem, pool: CategoryItem[]): void {
    this.speech.stop();
    this.isListening.set(false);
    const isMatch = this.matchSequence()[this.currentIndex()] ?? false;
    this.round.set(createTrueFalseRound(item, pool, isMatch));
    this.answerStatus.set('idle');
    this.selectedAnswer.set(null);
    this.heardText.set('');
    this.speechError.set('');
    this.pictureLoadFailed.set(false);
  }

  private evaluateSpokenAnswer(rawAnswer: string): void {
    const parsed = parseSpokenYesNo(rawAnswer);
    if (parsed === null) {
      this.speechError.set('Скажи «да» или «нет»');
      return;
    }

    this.evaluateBooleanAnswer(parsed);
  }

  private evaluateBooleanAnswer(userSaysMatch: boolean): void {
    const round = this.round();
    if (!round || this.answerStatus() === 'correct') {
      return;
    }

    this.speech.stop();
    this.isListening.set(false);
    this.selectedAnswer.set(userSaysMatch);
    this.speechError.set('');

    if (userSaysMatch === round.isMatch) {
      this.answerStatus.set('correct');
      this.sound.playCorrect();
      this.speakCorrectAnswer(round.isMatch);
      this.advanceTimeout = setTimeout(() => this.nextTask(), 1600);
      return;
    }

    this.answerStatus.set('incorrect');
    this.sound.playIncorrect();
    this.speakCorrectAnswer(round.isMatch);
    this.scheduleRetryReset();
  }

  private speakCorrectAnswer(isMatch: boolean): void {
    this.sound.speakWord(isMatch ? 'Да' : 'Нет', { delayMs: 500 });
  }

  private scheduleRetryReset(): void {
    this.clearRetryResetTimeout();
    this.retryResetTimeout = setTimeout(() => {
      if (this.answerStatus() !== 'incorrect') {
        return;
      }

      this.answerStatus.set('idle');
      this.selectedAnswer.set(null);
    }, 900);
  }

  private clearRetryResetTimeout(): void {
    if (this.retryResetTimeout) {
      clearTimeout(this.retryResetTimeout);
      this.retryResetTimeout = null;
    }
  }

  private clearTimers(): void {
    this.clearRetryResetTimeout();

    if (this.advanceTimeout) {
      clearTimeout(this.advanceTimeout);
      this.advanceTimeout = null;
    }
  }
}
