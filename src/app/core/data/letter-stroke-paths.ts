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

/** Figma/SVG imports: keep 0..1 proportions (no wide print-style box squeeze). */
function segRaw(...coords: [number, number][]): StrokePoint[] {
  return coords.map(([x, y]) => ({ x, y }));
}

/** Figma/SVG pixel coords; divide by max(viewBox) so non-square exports keep shape. */
function segFigma(viewBoxWidth: number, viewBoxHeight: number, ...coords: [number, number][]): StrokePoint[] {
  const scale = Math.max(viewBoxWidth, viewBoxHeight);
  return coords.map(([x, y]) => ({ x: x / scale, y: y / scale }));
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
  // Figma export: viewBox 300×339 — use segFigma with raw SVG pixel coords
  А: [
    segFigma(300, 339, [0.458, 338.613], [45.183, 236.085], [147.628, 1.234], [253.303, 236.085], [299.437, 338.613]),
    segFigma(300, 339, [45.183, 236.085], [253.303, 236.085]),
  ],
  Б: [
    segFigma(223, 326, [0.5, 1.431], [0.5, 323.994]),
    segFigma(223, 326, [1.701, 158.902], [49.046, 158.902], [51.61, 158.839], [58.75, 158.706], [69.632, 158.585], [83.427, 158.558], [99.303, 158.708], [116.427, 159.118], [133.969, 159.869], [151.097, 161.044], [166.904, 163.791], [180.963, 169.065], [193.162, 176.664], [203.393, 186.381], [211.542, 198.012], [217.5, 211.354], [221.157, 226.201], [222.4, 242.349], [221.171, 258.313], [217.628, 272.696], [211.984, 285.421], [204.454, 296.416], [195.251, 305.606], [184.592, 312.916], [172.688, 318.273], [159.756, 321.601], [142.684, 323.466], [119.866, 324.584], [93.775, 325.109], [66.883, 325.194], [41.663, 324.994], [20.588, 324.66], [6.13, 324.347], [0.761, 324.209]),
    segFigma(223, 326, [1.701, 0.5], [202.286, 0.5]),
  ],
  В: [
    segFigma(233, 329, [0.5, 0.5], [0.5, 323.063]),
    segFigma(233, 329, [1.482, 156.77], [50.904, 156.77], [53.581, 156.705], [61.034, 156.568], [72.395, 156.443], [86.795, 156.416], [103.367, 156.57], [121.243, 156.992], [139.555, 157.766], [157.435, 158.977], [173.936, 161.808], [188.611, 167.244], [201.346, 175.074], [212.026, 185.089], [220.533, 197.076], [226.752, 210.825], [230.569, 226.126], [231.867, 242.768], [230.584, 259.22], [226.885, 274.042], [220.994, 287.156], [213.133, 298.487], [203.527, 307.958], [192.399, 315.492], [179.974, 321.012], [166.474, 324.442], [148.652, 326.364], [124.833, 327.516], [97.597, 328.057], [69.525, 328.145], [43.198, 327.938], [21.198, 327.594], [6.105, 327.272], [0.5, 327.129]),
    segFigma(233, 329, [1.428, 0.828], [48.143, 0.828], [50.673, 0.77], [57.718, 0.645], [68.456, 0.531], [82.068, 0.506], [97.732, 0.647], [114.629, 1.029], [131.938, 1.732], [148.838, 2.831], [164.434, 5.401], [178.306, 10.336], [190.343, 17.444], [200.437, 26.535], [208.479, 37.417], [214.358, 49.898], [217.965, 63.788], [219.192, 78.895], [217.98, 93.829], [214.483, 107.284], [208.914, 119.189], [201.484, 129.475], [192.404, 138.072], [181.886, 144.911], [170.141, 149.922], [157.381, 153.036], [140.536, 154.781], [118.021, 155.827], [92.277, 156.318], [65.743, 156.398], [40.859, 156.21], [20.064, 155.898], [5.798, 155.605], [0.5, 155.476]),
  ],
  Г: [segFigma(191, 320, [0.5, 319.052], [0.5, 0.5], [190.442, 0.5])],
  Д: [
    segFigma(340, 407, [282.664, 318.602], [282.664, 0.5], [93.413, 0.5], [93.413, 19.291], [93.4, 40.184], [93.308, 59.214], [93.059, 77.013], [92.574, 94.211], [91.775, 111.44], [90.582, 129.33], [88.917, 148.512], [86.702, 169.618], [83.932, 190.505], [80.574, 209.002], [76.502, 225.692], [71.592, 241.16], [65.718, 255.99], [58.756, 270.766], [50.581, 286.074], [41.067, 302.496], [35.014, 318.602]),
    segFigma(340, 407, [35.014, 318.602], [339.036, 318.602], [339.036, 405.845]),
    segFigma(340, 407, [35.014, 318.602], [0.5, 318.602], [0.5, 405.845]),
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
  targetSizeRatio = 0.64,
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

  const targetSize = Math.min(width, height) * targetSizeRatio;
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
  return Math.max(canvasSize * 0.052, 14);
}

export function getStrokeDashPattern(canvasSize: number): number[] {
  const unit = Math.max(canvasSize * 0.018, 7);
  return [unit * 1.45, unit];
}
