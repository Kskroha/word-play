import {
  AfterViewInit,
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
import { Router, RouterLink } from '@angular/router';
import { getCategoryById } from '../../../core/data/categories';
import {
  getLetterTraceRounds,
  LetterTraceRound,
  TRACE_BRUSH_COLORS,
} from '../../../core/utils/letter-trace';
import { LetterTracePad } from '../../../core/utils/letter-trace-pad';

@Component({
  selector: 'app-trace-letter-play',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './trace-letter-play.html',
  styleUrl: './trace-letter-play.scss',
})
export class TraceLetterPlay implements AfterViewInit, OnDestroy {
  private readonly router = inject(Router);

  private readonly guideCanvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('guideCanvas');
  private readonly paintCanvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('paintCanvas');

  private pad: LetterTracePad | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private isPointerActive = false;
  private successCheckQueued = false;

  readonly brushColors = TRACE_BRUSH_COLORS;
  readonly selectedColorId = signal(TRACE_BRUSH_COLORS[0]!.id);
  readonly hasPainted = signal(false);
  readonly roundComplete = signal(false);

  readonly category = computed(() => getCategoryById('letters'));

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
      const category = this.category();
      untracked(() => {
        this.currentIndex.set(0);
        this.isCompleted.set(false);
        this.rounds.set(category ? getLetterTraceRounds(category) : []);
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
  }

  ngAfterViewInit(): void {
    const guideCanvas = this.guideCanvasRef().nativeElement;
    const paintCanvas = this.paintCanvasRef().nativeElement;
    this.pad = new LetterTracePad(guideCanvas, paintCanvas);

    const round = this.currentRound();
    if (round) {
      this.pad.setLetter(round.letter, round.guideColor);
      this.applySelectedColor();
    }

    this.resizeObserver = new ResizeObserver(() => {
      this.pad?.resize();
    });
    this.resizeObserver.observe(guideCanvas.parentElement ?? guideCanvas);

    requestAnimationFrame(() => this.pad?.resize());
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  selectColor(colorId: string): void {
    this.selectedColorId.set(colorId);
    this.applySelectedColor();
  }

  onPointerDown(event: PointerEvent): void {
    if (this.roundComplete()) {
      return;
    }

    event.preventDefault();
    this.isPointerActive = true;
    this.paintCanvasRef().nativeElement.setPointerCapture(event.pointerId);
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

    if (this.paintCanvasRef().nativeElement.hasPointerCapture(event.pointerId)) {
      this.paintCanvasRef().nativeElement.releasePointerCapture(event.pointerId);
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

  goBackToCategories(): void {
    void this.router.navigate(['/categories']);
  }

  private setupRound(round: LetterTraceRound): void {
    this.isPointerActive = false;
    this.hasPainted.set(false);
    this.roundComplete.set(false);
    this.pad?.setLetter(round.letter, round.guideColor);
    this.applySelectedColor();
    requestAnimationFrame(() => this.pad?.resize());
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
