import {
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Router, RouterLink } from '@angular/router';
import { getCategoryById, LETTER_ALPHABET_OPTIONS, LetterAlphabetId } from '../../../core/data/categories';
import { LetterOutlinePad } from '../../../core/utils/letter-outline-pad';
import {
  findTraceBrushColorId,
  getLetterTraceRoundsForAlphabet,
  LetterTraceRound,
  TRACE_BRUSH_COLORS,
} from '../../../core/utils/letter-trace';

@Component({
  selector: 'app-outline-letter-play',
  imports: [RouterLink, MatButtonModule, MatButtonToggleModule],
  templateUrl: './outline-letter-play.html',
  styleUrl: './outline-letter-play.scss',
})
export class OutlineLetterPlay implements OnDestroy {
  private readonly router = inject(Router);

  private readonly guideCanvasRef = viewChild<ElementRef<HTMLCanvasElement>>('guideCanvas');
  private readonly paintCanvasRef = viewChild<ElementRef<HTMLCanvasElement>>('paintCanvas');

  private pad: LetterOutlinePad | null = null;
  private padCanvas: HTMLCanvasElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private isPointerActive = false;
  private successCheckQueued = false;

  readonly brushColors = TRACE_BRUSH_COLORS;
  readonly alphabetOptions = LETTER_ALPHABET_OPTIONS;
  readonly selectedColorId = signal(TRACE_BRUSH_COLORS[0]!.id);
  readonly alphabet = signal<LetterAlphabetId>('ru');
  readonly hasPainted = signal(false);
  readonly roundComplete = signal(false);

  readonly category = computed(() => getCategoryById('letters'));

  readonly completionSubtitle = computed(() => {
    return this.alphabet() === 'en'
      ? 'Ты написал все буквы английского алфавита!'
      : 'Ты написал все буквы русского алфавита!';
  });

  readonly rounds = signal<LetterTraceRound[]>([]);

  readonly currentIndex = signal(0);
  readonly isCompleted = signal(false);

  readonly currentRound = computed(() => {
    return this.rounds()[this.currentIndex()];
  });

  readonly progressLabel = computed(() => {
    const total = this.rounds().length;
    if (total === 0) {
      return '';
    }

    return `${this.currentIndex() + 1} / ${total}`;
  });

  readonly progressPercent = computed(() => {
    const total = this.rounds().length;
    if (total === 0) {
      return 0;
    }

    return ((this.currentIndex() + 1) / total) * 100;
  });

  constructor() {
    effect(() => {
      const alphabet = this.alphabet();
      untracked(() => {
        this.currentIndex.set(0);
        this.isCompleted.set(false);
        this.rounds.set(getLetterTraceRoundsForAlphabet(alphabet));
      });
    });

    effect(() => {
      const round = this.currentRound();
      const completed = this.isCompleted();

      if (!round || completed) {
        return;
      }

      untracked(() => this.setupRound(round));
    });

    // The canvases live inside a conditional block, so they are recreated
    // whenever the player leaves and re-enters the play view.
    effect(() => {
      const guideCanvas = this.guideCanvasRef()?.nativeElement;
      const paintCanvas = this.paintCanvasRef()?.nativeElement;

      untracked(() => {
        if (!guideCanvas || !paintCanvas) {
          this.releasePad();
          return;
        }

        this.attachPad(guideCanvas, paintCanvas);
      });
    });
  }

  ngOnDestroy(): void {
    this.releasePad();
  }

  private attachPad(guideCanvas: HTMLCanvasElement, paintCanvas: HTMLCanvasElement): void {
    if (this.padCanvas === guideCanvas) {
      return;
    }

    this.releasePad();
    this.padCanvas = guideCanvas;
    this.pad = new LetterOutlinePad(guideCanvas, paintCanvas);

    const round = this.currentRound();
    if (round) {
      this.pad.setLetter(round.letter, round.guideColor, this.alphabet());
      this.syncBrushColorToGuide(round.guideColor);
    }

    this.resizeObserver = new ResizeObserver(() => this.pad?.resize());
    this.resizeObserver.observe(guideCanvas.parentElement ?? guideCanvas);

    requestAnimationFrame(() => this.pad?.resize());
  }

  private releasePad(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    this.pad = null;
    this.padCanvas = null;
  }

  selectColor(colorId: string): void {
    this.selectedColorId.set(colorId);
    this.applySelectedColor();
  }

  selectAlphabet(alphabet: LetterAlphabetId): void {
    if (this.alphabet() === alphabet) {
      return;
    }

    this.alphabet.set(alphabet);
  }

  onPointerDown(event: PointerEvent): void {
    if (this.roundComplete()) {
      return;
    }

    event.preventDefault();
    this.isPointerActive = true;
    this.paintCanvasRef()?.nativeElement.setPointerCapture(event.pointerId);
    this.pad?.handlePointerDown(event.clientX, event.clientY);
    this.hasPainted.set(true);
    this.scheduleSuccessCheck();
  }

  onPointerMove(event: PointerEvent): void {
    if (this.roundComplete() || !this.isPointerActive) {
      return;
    }

    event.preventDefault();
    this.pad?.handlePointerMove(event.clientX, event.clientY);
    this.scheduleSuccessCheck();
  }

  onPointerUp(event: PointerEvent): void {
    if (!this.isPointerActive) {
      return;
    }

    this.isPointerActive = false;

    const paintCanvas = this.paintCanvasRef()?.nativeElement;
    if (paintCanvas?.hasPointerCapture(event.pointerId)) {
      paintCanvas.releasePointerCapture(event.pointerId);
    }

    this.pad?.handlePointerUp();
    this.scheduleSuccessCheck(true);
  }

  clearPad(): void {
    this.isPointerActive = false;
    this.pad?.clearPaint();
    this.hasPainted.set(false);
    this.roundComplete.set(false);
  }

  nextTask(): void {
    const total = this.rounds().length;
    const nextIndex = this.currentIndex() + 1;

    if (nextIndex >= total) {
      this.isCompleted.set(true);
      return;
    }

    this.currentIndex.set(nextIndex);
  }

  restartCategory(): void {
    this.currentIndex.set(0);
    this.isCompleted.set(false);
  }

  goBackToLetterGames(): void {
    void this.router.navigate(['/categories', 'letters']);
  }

  private setupRound(round: LetterTraceRound): void {
    this.isPointerActive = false;
    this.hasPainted.set(false);
    this.roundComplete.set(false);
    this.pad?.setLetter(round.letter, round.guideColor, this.alphabet());
    this.syncBrushColorToGuide(round.guideColor);
    requestAnimationFrame(() => this.pad?.resize());
  }

  private syncBrushColorToGuide(guideColor: string): void {
    const colorId = findTraceBrushColorId(guideColor);
    if (colorId) {
      this.selectedColorId.set(colorId);
    }
    this.applySelectedColor();
  }

  private applySelectedColor(): void {
    if (!this.pad) {
      return;
    }

    const color = this.brushColors.find((item) => item.id === this.selectedColorId());
    if (color) {
      this.pad.brushColor = color.color;
    }
  }

  private scheduleSuccessCheck(immediate = false): void {
    if (this.roundComplete()) {
      return;
    }

    if (immediate) {
      this.successCheckQueued = false;
      this.checkRoundSuccess();
      return;
    }

    if (this.successCheckQueued) {
      return;
    }

    this.successCheckQueued = true;
    requestAnimationFrame(() => {
      this.successCheckQueued = false;
      this.checkRoundSuccess();
    });
  }

  private checkRoundSuccess(): void {
    if (this.roundComplete() || !this.pad?.isRoundSuccessful()) {
      return;
    }

    this.pad.setCelebrating(true);
    this.hasPainted.set(true);
    this.roundComplete.set(true);
  }
}
