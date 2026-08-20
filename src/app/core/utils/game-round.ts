import { CategoryItem } from '../models/category.model';
import { shuffle } from './shuffle';
import { normalizeWord } from './word-builder';

export function getItemTypingAnswer(item: CategoryItem): string {
  return item.blocks.join('');
}

export function pickPictureChoices(
  correct: CategoryItem,
  pool: CategoryItem[],
  count: number,
): CategoryItem[] {
  const choiceCount = Math.min(Math.max(count, 2), pool.length);
  const others = pool.filter((item) => item.id !== correct.id);
  const distractors = shuffle(others).slice(0, choiceCount - 1);

  return shuffle([correct, ...distractors]);
}

export interface TrueFalseRound {
  wordItem: CategoryItem;
  pictureItem: CategoryItem;
  isMatch: boolean;
}

export function createTrueFalseRound(
  promptItem: CategoryItem,
  pool: CategoryItem[],
): TrueFalseRound {
  const isMatch = Math.random() < 0.5;

  if (isMatch) {
    return {
      wordItem: promptItem,
      pictureItem: promptItem,
      isMatch: true,
    };
  }

  const others = pool.filter((item) => item.id !== promptItem.id);
  const pictureItem = others[Math.floor(Math.random() * others.length)] ?? promptItem;

  return {
    wordItem: promptItem,
    pictureItem,
    isMatch: false,
  };
}

export function isTypedAnswerCorrect(typed: string, answer: string): boolean {
  return normalizeWord(typed) === normalizeWord(answer);
}

export function isTypedLetterCorrect(typed: string, expectedLetters: string[], index: number): boolean {
  const letter = typed[index];
  const expected = expectedLetters[index];

  if (!letter || !expected) {
    return false;
  }

  return normalizeWord(letter) === normalizeWord(expected);
}
