export const LETTER_FONT_FAMILY = 'Nunito, "Segoe UI", sans-serif';

export const PAINT_LETTER_FONT_WEIGHT = 800;
export const OUTLINE_LETTER_FONT_WEIGHT = 400;

export interface LetterLayout {
  fontSize: number;
  x: number;
  y: number;
}

export function getLetterLayout(
  ctx: CanvasRenderingContext2D,
  letter: string,
  width: number,
  height: number,
  fontWeight: number = PAINT_LETTER_FONT_WEIGHT,
): LetterLayout {
  const fontSize = Math.min(width, height) * 0.68;
  const centerX = width / 2;
  const centerY = height / 2;

  ctx.font = `${fontWeight} ${fontSize}px ${LETTER_FONT_FAMILY}`;
  const metrics = ctx.measureText(letter);
  const ascent = metrics.actualBoundingBoxAscent ?? fontSize * 0.8;
  const descent = metrics.actualBoundingBoxDescent ?? fontSize * 0.2;
  const baselineY = centerY + (ascent - descent) / 2;

  return { fontSize, x: centerX, y: baselineY };
}

export function getOutlineLetterStrokeWidth(fontSize: number): number {
  return Math.max(fontSize * 0.024, 3);
}

export function getOutlineLetterMaskWidth(fontSize: number): number {
  return Math.max(fontSize * 0.065, 10);
}
