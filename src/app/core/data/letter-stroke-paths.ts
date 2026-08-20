import { LetterAlphabetId } from '../data/categories';

export interface StrokePoint {
  x: number;
  y: number;
}

export type LetterStrokes = StrokePoint[][];

/** Maps a 0..1 design square into a wide print-style letter box. */
function box(x: number, y: number): StrokePoint {
  return {
    x: 0.12 + x * 0.76,
    y: 0.2 + y * 0.6,
  };
}

function seg(...coords: [number, number][]): StrokePoint[] {
  return coords.map(([x, y]) => box(x, y));
}

function arcBox(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  start: number,
  end: number,
  steps = 16,
): StrokePoint[] {
  const points: StrokePoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = start + ((end - start) * i) / steps;
    points.push(box(cx + Math.cos(t) * rx, cy + Math.sin(t) * ry));
  }
  return points;
}

function ovalBox(cx: number, cy: number, rx: number, ry: number, steps = 28): StrokePoint[] {
  return arcBox(cx, cy, rx, ry, -Math.PI / 2, Math.PI * 1.5, steps);
}

/** Rounded half-bowl growing from a stem at `stemX` towards `edgeX`. */
function bowl(stemX: number, top: number, bottom: number, edgeX: number, steps = 14): StrokePoint[] {
  return arcBox(stemX, (top + bottom) / 2, edgeX - stemX, (bottom - top) / 2, -Math.PI / 2, Math.PI / 2, steps);
}

const LATIN_STROKES: Record<string, LetterStrokes> = {
  A: [seg([0.32, 0.9], [0.5, 0.08], [0.68, 0.9]), seg([0.4, 0.55], [0.6, 0.55])],
  B: [
    seg([0.26, 0.08], [0.26, 0.92]),
    bowl(0.26, 0.08, 0.48, 0.62),
    bowl(0.26, 0.48, 0.92, 0.68),
  ],
  C: [arcBox(0.56, 0.5, 0.32, 0.42, Math.PI * 0.42, Math.PI * 1.58)],
  D: [seg([0.26, 0.08], [0.26, 0.92]), bowl(0.26, 0.08, 0.92, 0.74)],
  E: [
    seg([0.68, 0.08], [0.26, 0.08], [0.26, 0.92]),
    seg([0.26, 0.5], [0.58, 0.5]),
    seg([0.26, 0.92], [0.62, 0.92]),
  ],
  F: [seg([0.68, 0.08], [0.26, 0.08], [0.26, 0.92]), seg([0.26, 0.5], [0.58, 0.5])],
  G: [
    arcBox(0.56, 0.5, 0.32, 0.34, Math.PI * 0.35, Math.PI * 1.65),
    seg([0.56, 0.5], [0.74, 0.5]),
  ],
  H: [
    seg([0.26, 0.08], [0.26, 0.92]),
    seg([0.74, 0.08], [0.74, 0.92]),
    seg([0.26, 0.5], [0.74, 0.5]),
  ],
  I: [seg([0.5, 0.08], [0.5, 0.92])],
  J: [seg([0.62, 0.08], [0.62, 0.72], [0.5, 0.88], [0.34, 0.78])],
  K: [
    seg([0.26, 0.08], [0.26, 0.92]),
    seg([0.74, 0.08], [0.26, 0.5], [0.74, 0.92]),
  ],
  L: [seg([0.26, 0.08], [0.26, 0.92], [0.74, 0.92])],
  M: [seg([0.2, 0.92], [0.2, 0.08], [0.5, 0.52], [0.8, 0.08], [0.8, 0.92])],
  N: [seg([0.26, 0.92], [0.26, 0.08], [0.74, 0.92], [0.74, 0.08])],
  O: [ovalBox(0.5, 0.5, 0.34, 0.42)],
  P: [seg([0.26, 0.92], [0.26, 0.08]), bowl(0.26, 0.08, 0.48, 0.66)],
  Q: [ovalBox(0.5, 0.5, 0.34, 0.42), seg([0.6, 0.66], [0.78, 0.94])],
  R: [
    seg([0.26, 0.92], [0.26, 0.08]),
    bowl(0.26, 0.08, 0.46, 0.64),
    seg([0.5, 0.46], [0.74, 0.92]),
  ],
  S: [
    seg(
      [0.66, 0.2],
      [0.48, 0.08],
      [0.3, 0.2],
      [0.34, 0.38],
      [0.62, 0.5],
      [0.66, 0.66],
      [0.5, 0.88],
      [0.3, 0.78],
    ),
  ],
  T: [seg([0.2, 0.08], [0.8, 0.08]), seg([0.5, 0.08], [0.5, 0.92])],
  U: [
    [box(0.26, 0.08), ...arcBox(0.5, 0.6, 0.24, 0.32, Math.PI, 0, 16), box(0.74, 0.08)],
  ],
  V: [seg([0.22, 0.08], [0.5, 0.92], [0.78, 0.08])],
  W: [seg([0.16, 0.08], [0.32, 0.92], [0.5, 0.42], [0.68, 0.92], [0.84, 0.08])],
  X: [seg([0.24, 0.08], [0.76, 0.92]), seg([0.76, 0.08], [0.24, 0.92])],
  Y: [seg([0.24, 0.08], [0.5, 0.5], [0.76, 0.08]), seg([0.5, 0.5], [0.5, 0.92])],
  Z: [seg([0.22, 0.08], [0.78, 0.08], [0.22, 0.92], [0.78, 0.92])],
};

const CYRILLIC_STROKES: Record<string, LetterStrokes> = {
  А: [seg([0.3, 0.92], [0.5, 0.08], [0.7, 0.92]), seg([0.39, 0.58], [0.61, 0.58])],
  Б: [
    seg([0.26, 0.08], [0.68, 0.08]),
    seg([0.26, 0.08], [0.26, 0.92]),
    bowl(0.26, 0.44, 0.92, 0.7),
  ],
  В: [
    seg([0.26, 0.08], [0.26, 0.92]),
    bowl(0.26, 0.08, 0.48, 0.64),
    bowl(0.26, 0.48, 0.92, 0.7),
  ],
  Г: [seg([0.74, 0.08], [0.26, 0.08], [0.26, 0.92])],
  Д: [
    seg([0.22, 0.78], [0.34, 0.08], [0.78, 0.08], [0.78, 0.78]),
    seg([0.12, 0.78], [0.88, 0.78]),
    seg([0.18, 0.78], [0.18, 0.98]),
    seg([0.82, 0.78], [0.82, 0.98]),
  ],
  Е: [
    seg([0.7, 0.08], [0.26, 0.08], [0.26, 0.92], [0.7, 0.92]),
    seg([0.26, 0.5], [0.6, 0.5]),
  ],
  Ё: [
    seg([0.7, 0.08], [0.26, 0.08], [0.26, 0.92], [0.7, 0.92]),
    seg([0.26, 0.5], [0.6, 0.5]),
    ovalBox(0.36, -0.06, 0.045, 0.045, 12),
    ovalBox(0.58, -0.06, 0.045, 0.045, 12),
  ],
  Ж: [
    seg([0.5, 0.08], [0.5, 0.92]),
    seg([0.18, 0.08], [0.5, 0.5], [0.18, 0.92]),
    seg([0.82, 0.08], [0.5, 0.5], [0.82, 0.92]),
  ],
  З: [
    arcBox(0.46, 0.27, 0.2, 0.19, -Math.PI * 0.95, Math.PI * 0.45, 16),
    arcBox(0.46, 0.71, 0.22, 0.21, -Math.PI * 0.55, Math.PI * 0.78, 16),
  ],
  И: [seg([0.26, 0.08], [0.26, 0.92], [0.74, 0.08], [0.74, 0.92])],
  Й: [
    seg([0.26, 0.08], [0.26, 0.92], [0.74, 0.08], [0.74, 0.92]),
    seg([0.36, -0.1], [0.5, 0.0], [0.64, -0.1]),
  ],
  К: [
    seg([0.26, 0.08], [0.26, 0.92]),
    seg([0.74, 0.08], [0.3, 0.5], [0.74, 0.92]),
  ],
  Л: [seg([0.18, 0.92], [0.36, 0.08], [0.74, 0.08], [0.74, 0.92])],
  М: [seg([0.18, 0.92], [0.18, 0.08], [0.5, 0.56], [0.82, 0.08], [0.82, 0.92])],
  Н: [
    seg([0.26, 0.08], [0.26, 0.92]),
    seg([0.74, 0.08], [0.74, 0.92]),
    seg([0.26, 0.5], [0.74, 0.5]),
  ],
  О: [ovalBox(0.5, 0.5, 0.34, 0.42)],
  П: [seg([0.26, 0.92], [0.26, 0.08], [0.74, 0.08], [0.74, 0.92])],
  Р: [seg([0.26, 0.92], [0.26, 0.08]), bowl(0.26, 0.08, 0.48, 0.66)],
  С: [arcBox(0.56, 0.5, 0.32, 0.42, Math.PI * 0.42, Math.PI * 1.58)],
  Т: [seg([0.18, 0.08], [0.82, 0.08]), seg([0.5, 0.08], [0.5, 0.92])],
  У: [
    seg([0.76, 0.08], [0.48, 0.6], [0.3, 0.92]),
    seg([0.22, 0.08], [0.48, 0.6]),
  ],
  Ф: [ovalBox(0.5, 0.5, 0.32, 0.32), seg([0.5, 0.06], [0.5, 0.94])],
  Х: [seg([0.24, 0.08], [0.76, 0.92]), seg([0.76, 0.08], [0.24, 0.92])],
  Ц: [
    seg([0.26, 0.08], [0.26, 0.8], [0.72, 0.8], [0.72, 0.08]),
    seg([0.72, 0.8], [0.82, 0.96]),
  ],
  Ч: [
    seg([0.26, 0.08], [0.26, 0.48], [0.74, 0.48]),
    seg([0.74, 0.08], [0.74, 0.92]),
  ],
  Ш: [
    seg([0.14, 0.08], [0.14, 0.8], [0.86, 0.8], [0.86, 0.08]),
    seg([0.5, 0.08], [0.5, 0.8]),
  ],
  Щ: [
    seg([0.12, 0.08], [0.12, 0.78], [0.78, 0.78], [0.78, 0.08]),
    seg([0.45, 0.08], [0.45, 0.78]),
    seg([0.78, 0.78], [0.88, 0.96]),
  ],
  Ъ: [seg([0.16, 0.08], [0.42, 0.08], [0.42, 0.92]), bowl(0.42, 0.44, 0.92, 0.74)],
  Ы: [
    seg([0.16, 0.08], [0.16, 0.92]),
    bowl(0.16, 0.44, 0.92, 0.48),
    seg([0.74, 0.08], [0.74, 0.92]),
  ],
  Ь: [seg([0.28, 0.08], [0.28, 0.92]), bowl(0.28, 0.46, 0.92, 0.7)],
  Э: [
    arcBox(0.44, 0.5, 0.3, 0.42, -Math.PI * 0.42, Math.PI * 0.42),
    seg([0.4, 0.5], [0.7, 0.5]),
  ],
  Ю: [
    seg([0.14, 0.08], [0.14, 0.92]),
    seg([0.14, 0.5], [0.34, 0.5]),
    ovalBox(0.6, 0.5, 0.28, 0.4),
  ],
  Я: [
    seg([0.74, 0.08], [0.74, 0.92]),
    bowl(0.74, 0.08, 0.5, 0.34),
    seg([0.58, 0.5], [0.24, 0.92]),
  ],
};

export function getLetterStrokes(letter: string, alphabet: LetterAlphabetId): LetterStrokes | null {
  const map = alphabet === 'en' ? LATIN_STROKES : CYRILLIC_STROKES;
  return map[letter] ?? null;
}

export function scaleLetterStrokes(
  strokes: LetterStrokes,
  width: number,
  height: number,
  paddingRatio = 0.16,
): LetterStrokes {
  const points = strokes.flat();
  if (points.length === 0) {
    return [];
  }

  const minX = Math.min(...points.map((point) => point.x));
  const maxX = Math.max(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  const maxY = Math.max(...points.map((point) => point.y));
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;
  const innerWidth = width * (1 - paddingRatio * 2);
  const innerHeight = height * (1 - paddingRatio * 2);

  let scale = Math.min(innerWidth / rangeX, innerHeight / rangeY);

  // Keep letter size close to the paint-letter game (~64% of the pad).
  const targetSize = Math.min(width, height) * 0.64;
  const strokeSize = Math.max(rangeX, rangeY) * scale;
  if (strokeSize > targetSize) {
    scale = targetSize / Math.max(rangeX, rangeY);
  }

  const scaledWidth = rangeX * scale;
  const scaledHeight = rangeY * scale;
  const offsetX = (width - scaledWidth) / 2 - minX * scale;
  const offsetY = (height - scaledHeight) / 2 - minY * scale;

  return strokes.map((segment) =>
    segment.map((point) => ({
      x: point.x * scale + offsetX,
      y: point.y * scale + offsetY,
    })),
  );
}

export function drawLetterStrokes(
  ctx: CanvasRenderingContext2D,
  strokes: LetterStrokes,
  options: {
    lineWidth: number;
    color: string;
    dash?: number[];
  },
): void {
  ctx.save();
  ctx.lineWidth = options.lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = options.color;

  if (options.dash) {
    ctx.setLineDash(options.dash);
  }

  for (const segment of strokes) {
    if (segment.length < 2) {
      continue;
    }

    ctx.beginPath();
    ctx.moveTo(segment[0]!.x, segment[0]!.y);
    for (let index = 1; index < segment.length; index++) {
      ctx.lineTo(segment[index]!.x, segment[index]!.y);
    }
    ctx.stroke();
  }

  ctx.setLineDash([]);
  ctx.restore();
}

export function getStrokeGuideLineWidth(canvasSize: number): number {
  return Math.max(canvasSize * 0.008, 2.5);
}

export function getStrokeMaskLineWidth(canvasSize: number): number {
  return Math.max(canvasSize * 0.045, 12);
}

export function getStrokeDashPattern(canvasSize: number): number[] {
  const unit = Math.max(canvasSize * 0.018, 7);
  return [unit * 1.45, unit];
}
