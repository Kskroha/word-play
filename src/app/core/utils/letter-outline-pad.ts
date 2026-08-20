import { LetterAlphabetId } from '../data/categories';
import {
  drawLetterStrokes,
  getLetterStrokes,
  getStrokeDashPattern,
  getStrokeGuideLineWidth,
  getStrokeMaskLineWidth,
  LetterStrokes,
  scaleLetterStrokes,
} from '../data/letter-stroke-paths';
import {
  OUTLINE_GUIDE_FADE_MIN_RATIO,
  TRACE_BRUSH_COLORS,
} from './letter-trace';

const OUTLINE_FADE_STEP = 0.22;
const PROGRESS_CELL_SIZE = 10;
const MAX_CANVAS_SIDE = 720;
const MAX_DEVICE_PIXEL_RATIO = 1.25;
const GUIDE_REDRAW_INTERVAL_MS = 120;

function createDrawingContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  return canvas.getContext('2d')!;
}

export class LetterOutlinePad {
  private readonly guideCtx: CanvasRenderingContext2D;
  private readonly paintCtx: CanvasRenderingContext2D;
  private readonly outlineCanvas: HTMLCanvasElement;
  private readonly outlineCtx: CanvasRenderingContext2D;
  private readonly outlineGuideCanvas: HTMLCanvasElement;
  private readonly outlineGuideCtx: CanvasRenderingContext2D;
  private readonly outlineEraseCanvas: HTMLCanvasElement;
  private readonly outlineEraseCtx: CanvasRenderingContext2D;

  private width = 0;
  private height = 0;
  private progressCols = 0;
  private progressRows = 0;
  private guideCellTotal = 0;
  private guideCellFlags = new Uint8Array(0);
  private tracedCellFlags = new Uint8Array(0);
  private letter = 'А';
  private alphabet: LetterAlphabetId = 'ru';
  private scaledStrokes: LetterStrokes = [];
  private isDrawing = false;
  private celebrating = false;
  private eraseMaskDirty = false;
  private guideRedrawQueued = false;
  private lastGuideRedrawAt = 0;
  private lastX = 0;
  private lastY = 0;

  brushColor = TRACE_BRUSH_COLORS[0]!.color;
  guideColor = TRACE_BRUSH_COLORS[2]!.color;
  brushSize = 24;

  constructor(
    private readonly guideCanvas: HTMLCanvasElement,
    private readonly paintCanvas: HTMLCanvasElement,
  ) {
    this.guideCtx = createDrawingContext(guideCanvas);
    this.paintCtx = createDrawingContext(paintCanvas);
    this.outlineCanvas = document.createElement('canvas');
    this.outlineCtx = createDrawingContext(this.outlineCanvas);
    this.outlineGuideCanvas = document.createElement('canvas');
    this.outlineGuideCtx = createDrawingContext(this.outlineGuideCanvas);
    this.outlineEraseCanvas = document.createElement('canvas');
    this.outlineEraseCtx = createDrawingContext(this.outlineEraseCanvas);
  }

  resize(): void {
    const rect = this.guideCanvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);
    const nextWidth = Math.min(Math.max(Math.floor(rect.width * dpr), 1), MAX_CANVAS_SIDE);
    const nextHeight = Math.min(Math.max(Math.floor(rect.height * dpr), 1), MAX_CANVAS_SIDE);

    if (nextWidth === this.width && nextHeight === this.height) {
      return;
    }

    const previousPaint =
      this.width > 0 && this.height > 0 ? document.createElement('canvas') : null;
    const previousErase =
      this.width > 0 && this.height > 0 ? document.createElement('canvas') : null;

    if (previousPaint) {
      previousPaint.width = this.width;
      previousPaint.height = this.height;
      previousPaint.getContext('2d')!.drawImage(this.paintCanvas, 0, 0);
    }

    if (previousErase) {
      previousErase.width = this.width;
      previousErase.height = this.height;
      previousErase.getContext('2d')!.drawImage(this.outlineEraseCanvas, 0, 0);
    }

    this.width = nextWidth;
    this.height = nextHeight;

    for (const canvas of [
      this.guideCanvas,
      this.paintCanvas,
      this.outlineCanvas,
      this.outlineGuideCanvas,
      this.outlineEraseCanvas,
    ]) {
      canvas.width = nextWidth;
      canvas.height = nextHeight;
    }

    this.updateScaledStrokes();
    this.rebuildOutlineGuide();
    this.updateOutlineMask();
    this.rebuildProgressGrid();
    this.redrawGuide();

    if (previousPaint) {
      this.paintCtx.drawImage(previousPaint, 0, 0, this.width, this.height);
      this.applyOutlineMask();
    } else {
      this.paintCtx.clearRect(0, 0, this.width, this.height);
    }

    if (previousErase) {
      this.outlineEraseCtx.drawImage(previousErase, 0, 0, this.width, this.height);
      this.redrawGuide();
    } else {
      this.outlineEraseCtx.clearRect(0, 0, this.width, this.height);
    }
  }

  setLetter(letter: string, guideColor?: string, alphabet: LetterAlphabetId = 'ru'): void {
    this.letter = letter;
    this.alphabet = alphabet;
    if (guideColor) {
      this.guideColor = guideColor;
    }
    this.celebrating = false;
    this.updateScaledStrokes();
    this.rebuildOutlineGuide();
    this.updateOutlineMask();
    this.rebuildProgressGrid();
    this.clearPaint(false);
    this.redrawGuide();
  }

  setCelebrating(value: boolean): void {
    this.celebrating = value;
    this.guideRedrawQueued = false;
    this.redrawGuide();
  }

  clearPaint(redrawGuide = true): void {
    this.paintCtx.clearRect(0, 0, this.width, this.height);
    this.outlineEraseCtx.clearRect(0, 0, this.width, this.height);
    this.tracedCellFlags.fill(0);
    this.eraseMaskDirty = false;
    if (redrawGuide) {
      this.celebrating = false;
      this.guideRedrawQueued = false;
      this.redrawGuide();
    }
  }

  getGuideFadeRatio(): number {
    if (this.guideCellTotal === 0) {
      return 0;
    }

    let tracedCells = 0;
    for (let index = 0; index < this.guideCellFlags.length; index += 1) {
      if (this.guideCellFlags[index] && this.tracedCellFlags[index]) {
        tracedCells += 1;
      }
    }

    return tracedCells / this.guideCellTotal;
  }

  isRoundSuccessful(): boolean {
    return this.getGuideFadeRatio() >= OUTLINE_GUIDE_FADE_MIN_RATIO;
  }

  handlePointerDown(clientX: number, clientY: number): void {
    this.isDrawing = true;
    const point = this.getCanvasPoint(clientX, clientY);
    this.lastX = point.x;
    this.lastY = point.y;
    this.paintDot(point.x, point.y);
  }

  handlePointerMove(clientX: number, clientY: number): void {
    if (!this.isDrawing) {
      return;
    }

    const point = this.getCanvasPoint(clientX, clientY);
    if (point.x === this.lastX && point.y === this.lastY) {
      return;
    }

    this.paintSegment(this.lastX, this.lastY, point.x, point.y);
    this.lastX = point.x;
    this.lastY = point.y;
    this.scheduleGuideRedraw();
  }

  handlePointerUp(): void {
    this.isDrawing = false;
    this.guideRedrawQueued = false;
    this.flushEraseMask();
    this.redrawGuide();
  }

  private getCanvasPoint(clientX: number, clientY: number): { x: number; y: number } {
    const rect = this.guideCanvas.getBoundingClientRect();
    const scaleX = this.width / rect.width;
    const scaleY = this.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }

  private updateScaledStrokes(): void {
    const strokes = getLetterStrokes(this.letter, this.alphabet);
    this.scaledStrokes = strokes
      ? scaleLetterStrokes(strokes, this.width, this.height, 0.1, 0.78)
      : [];

    const canvasSize = Math.min(this.width, this.height);
    this.brushSize = Math.max(getStrokeMaskLineWidth(canvasSize) * 1.85, 56);
  }

  private paintDot(x: number, y: number): void {
    this.paintCtx.fillStyle = this.brushColor;
    this.paintCtx.beginPath();
    this.paintCtx.arc(x, y, this.brushSize / 2, 0, Math.PI * 2);
    this.paintCtx.fill();
    this.applyOutlineMask();
    this.fadeOutlineDot(x, y);
    this.markBrushArea(x, y, x, y);
    this.flushEraseMask();
    this.redrawGuide();
  }

  private paintSegment(x1: number, y1: number, x2: number, y2: number): void {
    this.paintCtx.strokeStyle = this.brushColor;
    this.paintCtx.lineWidth = this.brushSize;
    this.paintCtx.lineCap = 'round';
    this.paintCtx.lineJoin = 'round';
    this.paintCtx.beginPath();
    this.paintCtx.moveTo(x1, y1);
    this.paintCtx.lineTo(x2, y2);
    this.paintCtx.stroke();
    this.applyOutlineMask();
    this.fadeOutlineSegment(x1, y1, x2, y2);
    this.markBrushArea(x1, y1, x2, y2);
  }

  private applyOutlineMask(): void {
    this.paintCtx.globalCompositeOperation = 'destination-in';
    this.paintCtx.drawImage(this.outlineCanvas, 0, 0);
    this.paintCtx.globalCompositeOperation = 'source-over';
  }

  private fadeOutlineDot(x: number, y: number): void {
    this.outlineEraseCtx.fillStyle = `rgba(255, 255, 255, ${OUTLINE_FADE_STEP})`;
    this.outlineEraseCtx.beginPath();
    this.outlineEraseCtx.arc(x, y, this.brushSize / 2, 0, Math.PI * 2);
    this.outlineEraseCtx.fill();
    this.eraseMaskDirty = true;
  }

  private fadeOutlineSegment(x1: number, y1: number, x2: number, y2: number): void {
    this.outlineEraseCtx.strokeStyle = `rgba(255, 255, 255, ${OUTLINE_FADE_STEP})`;
    this.outlineEraseCtx.lineWidth = this.brushSize;
    this.outlineEraseCtx.lineCap = 'round';
    this.outlineEraseCtx.lineJoin = 'round';
    this.outlineEraseCtx.beginPath();
    this.outlineEraseCtx.moveTo(x1, y1);
    this.outlineEraseCtx.lineTo(x2, y2);
    this.outlineEraseCtx.stroke();
    this.eraseMaskDirty = true;
  }

  private flushEraseMask(): void {
    if (!this.eraseMaskDirty) {
      return;
    }

    this.outlineEraseCtx.globalCompositeOperation = 'destination-in';
    this.outlineEraseCtx.drawImage(this.outlineCanvas, 0, 0);
    this.outlineEraseCtx.globalCompositeOperation = 'source-over';
    this.eraseMaskDirty = false;
  }

  private scheduleGuideRedraw(): void {
    const now = performance.now();
    if (now - this.lastGuideRedrawAt < GUIDE_REDRAW_INTERVAL_MS) {
      if (this.guideRedrawQueued) {
        return;
      }

      this.guideRedrawQueued = true;
      requestAnimationFrame(() => {
        this.guideRedrawQueued = false;
        if (!this.isDrawing) {
          return;
        }

        this.lastGuideRedrawAt = performance.now();
        this.flushEraseMask();
        this.redrawGuide();
      });
      return;
    }

    this.lastGuideRedrawAt = now;
    this.flushEraseMask();
    this.redrawGuide();
  }

  private redrawGuide(): void {
    const ctx = this.guideCtx;
    ctx.clearRect(0, 0, this.width, this.height);
    this.drawPaperBackground(ctx);

    if (this.celebrating) {
      return;
    }

    ctx.drawImage(this.outlineGuideCanvas, 0, 0);
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.drawImage(this.outlineEraseCanvas, 0, 0);
    ctx.restore();
  }

  private drawPaperBackground(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, this.width, this.height);
  }

  private rebuildOutlineGuide(): void {
    const ctx = this.outlineGuideCtx;
    ctx.clearRect(0, 0, this.width, this.height);

    if (this.scaledStrokes.length === 0) {
      return;
    }

    const canvasSize = Math.min(this.width, this.height);
    drawLetterStrokes(ctx, this.scaledStrokes, {
      lineWidth: getStrokeGuideLineWidth(canvasSize),
      color: this.guideColor,
      dash: getStrokeDashPattern(canvasSize),
    });
  }

  private updateOutlineMask(): void {
    this.outlineCtx.clearRect(0, 0, this.width, this.height);

    if (this.scaledStrokes.length === 0) {
      return;
    }

    const canvasSize = Math.min(this.width, this.height);
    drawLetterStrokes(this.outlineCtx, this.scaledStrokes, {
      lineWidth: getStrokeMaskLineWidth(canvasSize),
      color: '#000000',
    });
  }

  private rebuildProgressGrid(): void {
    this.progressCols = Math.max(Math.ceil(this.width / PROGRESS_CELL_SIZE), 1);
    this.progressRows = Math.max(Math.ceil(this.height / PROGRESS_CELL_SIZE), 1);
    const cellCount = this.progressCols * this.progressRows;

    this.guideCellFlags = new Uint8Array(cellCount);
    this.tracedCellFlags = new Uint8Array(cellCount);
    this.guideCellTotal = 0;

    if (this.width === 0 || this.height === 0) {
      return;
    }

    const guideData = this.outlineGuideCtx.getImageData(0, 0, this.width, this.height).data;

    for (let row = 0; row < this.progressRows; row += 1) {
      for (let col = 0; col < this.progressCols; col += 1) {
        const startX = col * PROGRESS_CELL_SIZE;
        const startY = row * PROGRESS_CELL_SIZE;
        const endX = Math.min(startX + PROGRESS_CELL_SIZE, this.width);
        const endY = Math.min(startY + PROGRESS_CELL_SIZE, this.height);

        if (this.cellHasGuide(guideData, startX, startY, endX, endY)) {
          const index = row * this.progressCols + col;
          this.guideCellFlags[index] = 1;
          this.guideCellTotal += 1;
        }
      }
    }
  }

  private cellHasGuide(
    guideData: Uint8ClampedArray,
    startX: number,
    startY: number,
    endX: number,
    endY: number,
  ): boolean {
    for (let y = startY; y < endY; y += 2) {
      for (let x = startX; x < endX; x += 2) {
        const alpha = guideData[(y * this.width + x) * 4 + 3]!;
        if (alpha > 16) {
          return true;
        }
      }
    }

    return false;
  }

  private markBrushArea(x1: number, y1: number, x2: number, y2: number): void {
    const radius = this.brushSize / 2;
    const minX = Math.min(x1, x2) - radius;
    const maxX = Math.max(x1, x2) + radius;
    const minY = Math.min(y1, y2) - radius;
    const maxY = Math.max(y1, y2) + radius;

    const startCol = Math.max(Math.floor(minX / PROGRESS_CELL_SIZE), 0);
    const endCol = Math.min(Math.ceil(maxX / PROGRESS_CELL_SIZE), this.progressCols);
    const startRow = Math.max(Math.floor(minY / PROGRESS_CELL_SIZE), 0);
    const endRow = Math.min(Math.ceil(maxY / PROGRESS_CELL_SIZE), this.progressRows);

    for (let row = startRow; row < endRow; row += 1) {
      for (let col = startCol; col < endCol; col += 1) {
        const index = row * this.progressCols + col;
        if (this.guideCellFlags[index]) {
          this.tracedCellFlags[index] = 1;
        }
      }
    }
  }
}
