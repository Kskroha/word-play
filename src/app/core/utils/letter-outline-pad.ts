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
const GUIDE_FADE_ALPHA_THRESHOLD = 68;
const GUIDE_FADE_SAMPLE_STRIDE = 4;

function createDrawingContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  return canvas.getContext('2d', { desynchronized: true })!;
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
  private letter = 'А';
  private alphabet: LetterAlphabetId = 'ru';
  private scaledStrokes: LetterStrokes = [];
  private isDrawing = false;
  private celebrating = false;
  private guideRedrawQueued = false;
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
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const nextWidth = Math.max(Math.floor(rect.width * dpr), 1);
    const nextHeight = Math.max(Math.floor(rect.height * dpr), 1);

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
    if (redrawGuide) {
      this.celebrating = false;
      this.guideRedrawQueued = false;
      this.redrawGuide();
    }
  }

  getGuideFadeRatio(): number {
    const guideData = this.outlineGuideCtx.getImageData(0, 0, this.width, this.height).data;
    const eraseData = this.outlineEraseCtx.getImageData(0, 0, this.width, this.height).data;

    let guidePixels = 0;
    let fadedPixels = 0;
    const stride = GUIDE_FADE_SAMPLE_STRIDE * 4;

    for (let index = 3; index < guideData.length; index += stride) {
      if (guideData[index]! <= 16) {
        continue;
      }

      guidePixels += 1;
      if (eraseData[index]! >= GUIDE_FADE_ALPHA_THRESHOLD) {
        fadedPixels += 1;
      }
    }

    if (guidePixels === 0) {
      return 0;
    }

    return fadedPixels / guidePixels;
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
    this.paintStrokeTo(point.x, point.y);
  }

  handlePointerUp(): void {
    this.isDrawing = false;
    this.guideRedrawQueued = false;
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

  private paintStrokeTo(x: number, y: number): void {
    const dx = x - this.lastX;
    const dy = y - this.lastY;
    const distance = Math.hypot(dx, dy);
    const step = Math.max(this.brushSize * 0.22, 2);

    if (distance <= step) {
      this.paintSegment(this.lastX, this.lastY, x, y);
      this.lastX = x;
      this.lastY = y;
      return;
    }

    const steps = Math.ceil(distance / step);
    let prevX = this.lastX;
    let prevY = this.lastY;

    for (let index = 1; index <= steps; index += 1) {
      const t = index / steps;
      const nextX = this.lastX + dx * t;
      const nextY = this.lastY + dy * t;
      this.paintSegment(prevX, prevY, nextX, nextY);
      prevX = nextX;
      prevY = nextY;
    }

    this.lastX = x;
    this.lastY = y;
  }

  private paintDot(x: number, y: number): void {
    this.paintCtx.fillStyle = this.brushColor;
    this.paintCtx.beginPath();
    this.paintCtx.arc(x, y, this.brushSize / 2, 0, Math.PI * 2);
    this.paintCtx.fill();
    this.applyOutlineMask();
    this.fadeOutlineDot(x, y);
    this.guideRedrawQueued = false;
    this.redrawGuide();
  }

  private paintSegment(x1: number, y1: number, x2: number, y2: number): void {
    if (x1 === x2 && y1 === y2) {
      return;
    }

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
    this.scheduleGuideRedraw();
  }

  private applyOutlineMask(): void {
    this.paintCtx.globalCompositeOperation = 'destination-in';
    this.paintCtx.drawImage(this.outlineCanvas, 0, 0);
    this.paintCtx.globalCompositeOperation = 'source-over';
  }

  private fadeOutlineDot(x: number, y: number): void {
    this.outlineEraseCtx.save();
    this.outlineEraseCtx.fillStyle = `rgba(255, 255, 255, ${OUTLINE_FADE_STEP})`;
    this.outlineEraseCtx.beginPath();
    this.outlineEraseCtx.arc(x, y, this.brushSize / 2, 0, Math.PI * 2);
    this.outlineEraseCtx.fill();
    this.outlineEraseCtx.globalCompositeOperation = 'destination-in';
    this.outlineEraseCtx.drawImage(this.outlineCanvas, 0, 0);
    this.outlineEraseCtx.restore();
  }

  private fadeOutlineSegment(x1: number, y1: number, x2: number, y2: number): void {
    this.outlineEraseCtx.save();
    this.outlineEraseCtx.strokeStyle = `rgba(255, 255, 255, ${OUTLINE_FADE_STEP})`;
    this.outlineEraseCtx.lineWidth = this.brushSize;
    this.outlineEraseCtx.lineCap = 'round';
    this.outlineEraseCtx.lineJoin = 'round';
    this.outlineEraseCtx.beginPath();
    this.outlineEraseCtx.moveTo(x1, y1);
    this.outlineEraseCtx.lineTo(x2, y2);
    this.outlineEraseCtx.stroke();
    this.outlineEraseCtx.globalCompositeOperation = 'destination-in';
    this.outlineEraseCtx.drawImage(this.outlineCanvas, 0, 0);
    this.outlineEraseCtx.restore();
  }

  private scheduleGuideRedraw(): void {
    if (this.guideRedrawQueued) {
      return;
    }

    this.guideRedrawQueued = true;
    requestAnimationFrame(() => {
      this.guideRedrawQueued = false;
      if (!this.isDrawing) {
        return;
      }
      this.redrawGuide();
    });
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
}
