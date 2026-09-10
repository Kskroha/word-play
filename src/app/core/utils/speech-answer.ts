import { normalizeWord } from './word-builder';

export function isSpokenAnswerCorrect(spoken: string, expected: string): boolean {
  const spokenNorm = normalizeWord(spoken);
  const expectedNorm = normalizeWord(expected);

  if (!spokenNorm || !expectedNorm) {
    return false;
  }

  if (spokenNorm === expectedNorm) {
    return true;
  }

  if (spokenNorm.includes(expectedNorm) || expectedNorm.includes(spokenNorm)) {
    return true;
  }

  const expectedWords = expected
    .toLowerCase()
    .split(/\s+/)
    .map((word) => normalizeWord(word))
    .filter(Boolean);

  if (expectedWords.length > 1) {
    return expectedWords.every((word) => spokenNorm.includes(word));
  }

  return false;
}
