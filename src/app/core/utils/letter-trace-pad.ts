import {
  getLetterOutlineRatio,
  getLetterPaintRatio,
  TRACE_BRUSH_COLORS,
  TRACE_MIN_FILL_RATIO,
  TRACE_MIN_OUTLINE_RATIO,
  traceColorWithAlpha,
} from './letter-trace';

const LETTER_FONT_FAMILY = 'Nunito, "Segoe UI", sans-serif';

export class LetterTracePad {
  private readonly guideCtx: CanvasRenderingContext2D;
  private readonly paintCtx: CanvasRenderingContext2D;
  private readonly maskCanvas: HTMLCanvasElement;
  private readonly maskCtx: CanvasRenderingContext2D;
  private readonly outlineCanvas: HTMLCanvasElement;
  private readonly outlineCtx: CanvasRenderingContext2D;

  private width = 0;
  private height = 0;
  private letter = 'а';
  private isDrawing = false;
  private celebrating = false;
  private lastX = 0;
  private lastY = 0;

  brushColor = TRACE_BRUSH_COLORS[0]!.color;
  guideColor = TRACE_BRUSH_COLORS[2]!.color;
  brushSize = 48;

  constructor(
    private readonly guideCanvas: HTMLCanvasElement,
    private readonly paintCanvas: HTMLCanvasElement,
  ) {
    this.guideCtx = guideCanvas.getContext('2d')!;
    this.paintCtx = paintCanvas.getContext('2d')!;
    this.maskCanvas = document.createElement('canvas');
    this.maskCtx = this.maskCanvas.getContext('2d')!;
    this.outlineCanvas = document.createElement('canvas');
    this.outlineCtx = this.outlineCanvas.getContext('2d')!;
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
    if (previousPaint) {
      previousPaint.width = this.width;
      previousPaint.height = this.height;
      previousPaint.getContext('2d')!.drawImage(this.paintCanvas, 0, 0);
    }

    this.width = nextWidth;
    this.height = nextHeight;

    for (const canvas of [this.guideCanvas, this.paintCanvas, this.maskCanvas, this.outlineCanvas]) {
      canvas.width = nextWidth;
      canvas.height = nextHeight;
    }

    this.redrawGuide();

    if (previousPaint) {
      if (this.celebrating) {
        this.fillLetterPerfectly();
      } else {
        this.paintCtx.drawImage(previousPaint, 0, 0, this.width, this.height);
        this.applyMask();
      }
      return;
    }

    this.paintCtx.clearRect(0, 0, this.width, this.height);
  }

  setLetter(letter: string, guideColor?: string): void {
    this.letter = letter;
    if (guideColor) {
      this.guideColor = guideColor;
    }
    this.celebrating = false;
    this.redrawGuide();
    this.clearPaint(false);
  }

  setCelebrating(value: boolean): void {
    this.celebrating = value;
    this.redrawGuide();
    if (value) {
      this.fillLetterPerfectly();
    }
  }

  clearPaint(redrawGuide = true): void {
    this.paintCtx.clearRect(0, 0, this.width, this.height);
    if (redrawGuide) {
      this.celebrating = false;
      this.redrawGuide();
    }
  }

  getPaintRatio(): number {
    return getLetterPaintRatio(this.paintCtx, this.maskCtx, this.width, this.height);
  }

  getOutlineRatio(): number {
    return getLetterOutlineRatio(this.paintCtx, this.outlineCtx, this.width, this.height);
  }

  isRoundSuccessful(): boolean {
    return (
      this.getPaintRatio() >= TRACE_MIN_FILL_RATIO ||
      this.getOutlineRatio() >= TRACE_MIN_OUTLINE_RATIO
    );
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
    this.paintLine(this.lastX, this.lastY, point.x, point.y);
    this.lastX = point.x;
    this.lastY = point.y;
  }

  handlePointerUp(): void {
    this.isDrawing = false;
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

  private paintDot(x: number, y: number): void {
    this.paintCtx.fillStyle = this.brushColor;
    this.paintCtx.beginPath();
    this.paintCtx.arc(x, y, this.brushSize / 2, 0, Math.PI * 2);
    this.paintCtx.fill();
    this.applyMask();
  }

  private paintLine(x1: number, y1: number, x2: number, y2: number): void {
    this.paintCtx.strokeStyle = this.brushColor;
    this.paintCtx.lineWidth = this.brushSize;
    this.paintCtx.lineCap = 'round';
    this.paintCtx.lineJoin = 'round';
    this.paintCtx.beginPath();
    this.paintCtx.moveTo(x1, y1);
    this.paintCtx.lineTo(x2, y2);
    this.paintCtx.stroke();
    this.applyMask();
  }

  private applyMask(): void {
    this.paintCtx.globalCompositeOperation = 'destination-in';
    this.paintCtx.drawImage(this.maskCanvas, 0, 0);
    this.paintCtx.globalCompositeOperation = 'source-over';
  }

  private fillLetterPerfectly(): void {
    this.paintCtx.clearRect(0, 0, this.width, this.height);
    this.paintCtx.fillStyle = this.brushColor;
    this.paintCtx.fillRect(0, 0, this.width, this.height);
    this.applyMask();

    this.paintCtx.save();
    this.paintCtx.globalCompositeOperation = 'source-atop';
    const highlight = this.paintCtx.createLinearGradient(0, 0, 0, this.height);
    highlight.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
    highlight.addColorStop(0.55, 'rgba(255, 255, 255, 0.06)');
    highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');
    this.paintCtx.fillStyle = highlight;
    this.paintCtx.fillRect(0, 0, this.width, this.height);
    this.paintCtx.restore();
  }

  private redrawGuide(): void {
    const ctx = this.guideCtx;
    ctx.clearRect(0, 0, this.width, this.height);
    this.drawPaperBackground(ctx);
    this.drawLetterGuide(ctx);
    this.updateMask();
    this.updateOutlineMask();
  }

  private drawPaperBackground(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, this.width, this.height);
  }

  private getLetterLayout(ctx: CanvasRenderingContext2D): {
    fontSize: number;
    x: number;
    y: number;
  } {
    const fontSize = Math.min(this.width, this.height) * 0.68;
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    ctx.font = `800 ${fontSize}px ${LETTER_FONT_FAMILY}`;
    const metrics = ctx.measureText(this.letter);
    const ascent = metrics.actualBoundingBoxAscent ?? fontSize * 0.8;
    const descent = metrics.actualBoundingBoxDescent ?? fontSize * 0.2;
    const baselineY = centerY + (ascent - descent) / 2;

    return { fontSize, x: centerX, y: baselineY };
  }

  private drawLetterGuide(ctx: CanvasRenderingContext2D): void {
    if (this.celebrating) {
      return;
    }

    const { fontSize, x, y } = this.getLetterLayout(ctx);

    ctx.save();
    ctx.font = `800 ${fontSize}px ${LETTER_FONT_FAMILY}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';

    ctx.fillStyle = traceColorWithAlpha(this.guideColor, 0.34);
    ctx.fillText(this.letter, x, y);

    ctx.lineWidth = Math.max(fontSize * 0.028, 4);
    ctx.strokeStyle = this.guideColor;
    ctx.setLineDash([Math.max(fontSize * 0.06, 10), Math.max(fontSize * 0.04, 7)]);
    ctx.strokeText(this.letter, x, y);
    ctx.setLineDash([]);
    ctx.restore();
  }

  private updateMask(): void {
    const { fontSize, x, y } = this.getLetterLayout(this.maskCtx);

    this.maskCtx.clearRect(0, 0, this.width, this.height);
    this.maskCtx.save();
    this.maskCtx.font = `800 ${fontSize}px ${LETTER_FONT_FAMILY}`;
    this.maskCtx.textAlign = 'center';
    this.maskCtx.textBaseline = 'alphabetic';
    this.maskCtx.fillStyle = '#000000';
    this.maskCtx.fillText(this.letter, x, y);
    this.maskCtx.restore();
  }

  private updateOutlineMask(): void {
    const { fontSize, x, y } = this.getLetterLayout(this.outlineCtx);

    this.outlineCtx.clearRect(0, 0, this.width, this.height);
    this.outlineCtx.save();
    this.outlineCtx.font = `800 ${fontSize}px ${LETTER_FONT_FAMILY}`;
    this.outlineCtx.textAlign = 'center';
    this.outlineCtx.textBaseline = 'alphabetic';
    this.outlineCtx.lineWidth = Math.max(fontSize * 0.11, 14);
    this.outlineCtx.lineJoin = 'round';
    this.outlineCtx.lineCap = 'round';
    this.outlineCtx.strokeStyle = '#000000';
    this.outlineCtx.strokeText(this.letter, x, y);
    this.outlineCtx.restore();
  }
}
