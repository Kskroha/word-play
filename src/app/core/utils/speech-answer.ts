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

export function parseSpokenYesNo(spoken: string): boolean | null {
  const norm = normalizeWord(spoken);
  if (!norm) {
    return null;
  }

  const noHints = ['нет', 'no', 'неа', 'неверно', 'неправильно', 'ложь'];
  const yesHints = ['да', 'yes', 'ага', 'угу', 'верно', 'правильно', 'истина'];

  if (noHints.some((hint) => norm === hint || norm.includes(hint))) {
    return false;
  }

  if (yesHints.some((hint) => norm === hint || norm.includes(hint))) {
    return true;
  }

  return null;
}

export function parseTypedYesNo(value: string): boolean | null {
  return parseSpokenYesNo(value);
}

export function getMatchConfirmationPhrase(isMatch: boolean, label: string): string {
  const word = label.trim();
  if (!word) {
    return isMatch ? 'Да' : 'Нет';
  }

  return isMatch ? `Да, это ${word}` : `Нет, это не ${word}`;
}
