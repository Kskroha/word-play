import { getLetterCategoryItems, LetterAlphabetId } from '../data/categories';
import { Category } from '../models/category.model';
import { shuffle } from './shuffle';

export interface LetterTraceRound {
  letter: string;
  sampleWord: string;
  guideColor: string;
}

export interface TraceBrushColor {
  id: string;
  color: string;
  label: string;
}

export const TRACE_BRUSH_COLORS: TraceBrushColor[] = [
  { id: 'black', color: '#4a4560', label: 'Чёрный' },
  { id: 'red', color: '#f0a0a0', label: 'Красный' },
  { id: 'pink', color: '#f5a8c8', label: 'Розовый' },
  { id: 'lilac', color: '#b49fd4', label: 'Сиреневый' },
  { id: 'mint', color: '#7bc89a', label: 'Мятный' },
  { id: 'sky', color: '#7eb8dc', label: 'Голубой' },
  { id: 'peach', color: '#ffb88a', label: 'Персиковый' },
  { id: 'yellow', color: '#f5dfa0', label: 'Жёлтый' },
  { id: 'teal', color: '#8ed4c8', label: 'Бирюзовый' },
];

/** Доля закрашенной площади буквы для успеха. */
export const TRACE_MIN_FILL_RATIO = 0.95;

/** Доля пройденного контура буквы для успеха в игре «Закрась букву». */
export const TRACE_MIN_OUTLINE_RATIO = 0.55;

/** Доля пройденного контура для успеха в игре «Обведи букву». */
export const OUTLINE_TRACE_MIN_RATIO = 0.8;

/** Доля исчезнувшего пунктирного контура для успеха в игре «Напиши букву». */
export const OUTLINE_GUIDE_FADE_MIN_RATIO = 0.98;

export function pickRandomTraceGuideColor(): string {
  const index = Math.floor(Math.random() * TRACE_BRUSH_COLORS.length);
  return TRACE_BRUSH_COLORS[index]!.color;
}

export function findTraceBrushColorId(color: string): string | undefined {
  return TRACE_BRUSH_COLORS.find((item) => item.color === color)?.id;
}

export function traceColorWithAlpha(color: string, alpha: number): string {
  const normalized = color.replace('#', '');
  const r = Number.parseInt(normalized.slice(0, 2), 16);
  const g = Number.parseInt(normalized.slice(2, 4), 16);
  const b = Number.parseInt(normalized.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function getLetterTraceRoundsForAlphabet(alphabet: LetterAlphabetId): LetterTraceRound[] {
  return getLetterCategoryItems(alphabet).map((item) => ({
    letter: item.label,
    sampleWord: item.label,
    guideColor: pickRandomTraceGuideColor(),
  }));
}

export function getLetterTraceRounds(category: Category): LetterTraceRound[] {
  if (category.id === 'letters') {
    return getLetterTraceRoundsForAlphabet('ru');
  }

  const letterToWord = new Map<string, string>();

  for (const item of category.items) {
    for (const block of item.blocks) {
      for (const char of block) {
        if (/\p{L}/u.test(char) && !letterToWord.has(char)) {
          letterToWord.set(char, item.label);
        }
      }
    }
  }

  return shuffle(
    [...letterToWord.entries()].map(([letter, sampleWord]) => ({
      letter,
      sampleWord,
      guideColor: pickRandomTraceGuideColor(),
    })),
  );
}

export function getLetterPaintRatio(
  paintCtx: CanvasRenderingContext2D,
  maskCtx: CanvasRenderingContext2D,
  width: number,
  height: number,
): number {
  return getMaskCoverageRatio(paintCtx, maskCtx, width, height);
}

export function getLetterOutlineRatio(
  paintCtx: CanvasRenderingContext2D,
  outlineCtx: CanvasRenderingContext2D,
  width: number,
  height: number,
): number {
  return getMaskCoverageRatio(paintCtx, outlineCtx, width, height);
}

function getMaskCoverageRatio(
  paintCtx: CanvasRenderingContext2D,
  referenceCtx: CanvasRenderingContext2D,
  width: number,
  height: number,
): number {
  const referenceData = referenceCtx.getImageData(0, 0, width, height).data;
  const paintData = paintCtx.getImageData(0, 0, width, height).data;

  let referencePixels = 0;
  let coveredPixels = 0;

  for (let i = 3; i < referenceData.length; i += 4) {
    if (referenceData[i]! > 16) {
      referencePixels += 1;
      if (paintData[i]! > 16) {
        coveredPixels += 1;
      }
    }
  }

  if (referencePixels === 0) {
    return 0;
  }

  return coveredPixels / referencePixels;
}
