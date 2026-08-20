import { shuffle } from './shuffle';

export interface LetterTile {
  id: string;
  letter: string;
}

export interface WordBlockState {
  word: string;
  slotDropData: LetterTile[][];
  bank: LetterTile[];
}

export function normalizeWord(word: string): string {
  return word.toLowerCase().replace(/\s+/g, '').replace(/ё/g, 'е');
}

export function splitAnswerIntoLetters(answer: string): string[] {
  return normalizeWord(answer).split('');
}

export function createLetterTiles(word: string): LetterTile[] {
  return shuffle(
    splitAnswerIntoLetters(word).map((letter, index) => ({
      id: `${index}-${letter}-${crypto.randomUUID()}`,
      letter,
    })),
  );
}

export function createWordBlockState(word: string): WordBlockState {
  const letterCount = splitAnswerIntoLetters(word).length;

  return {
    word,
    slotDropData: Array.from({ length: letterCount }, () => []),
    bank: createLetterTiles(word),
  };
}

export function createWordBlocks(blocks: string[]): WordBlockState[] {
  return blocks.map((word) => createWordBlockState(word));
}

export function isAnswerCorrect(slots: Array<LetterTile | null>, answer: string): boolean {
  const built = slots.map((slot) => slot?.letter ?? '').join('');
  return normalizeWord(built) === normalizeWord(answer);
}

export function isWordBlockComplete(block: WordBlockState): boolean {
  return (
    block.slotDropData.length > 0 && block.slotDropData.every((slot) => slot.length === 1)
  );
}

export function isWordBlockCorrect(block: WordBlockState): boolean {
  const slots = block.slotDropData.map((slot) => slot[0] ?? null);
  return isAnswerCorrect(slots, block.word);
}

export function areAllBlocksFilled(blocks: WordBlockState[]): boolean {
  return blocks.length > 0 && blocks.every(isWordBlockComplete);
}

export function areAllBlocksCorrect(blocks: WordBlockState[]): boolean {
  return blocks.length > 0 && blocks.every(isWordBlockCorrect);
}

export function bankId(blockIndex: number): string {
  return `bank-${blockIndex}`;
}

export function slotId(blockIndex: number, slotIndex: number): string {
  return `slot-${blockIndex}-${slotIndex}`;
}

export function parseContainerId(containerId: string): {
  kind: 'bank' | 'slot';
  blockIndex: number;
  slotIndex?: number;
} | null {
  if (containerId.startsWith('bank-')) {
    return { kind: 'bank', blockIndex: Number(containerId.replace('bank-', '')) };
  }

  if (containerId.startsWith('slot-')) {
    const [, blockIndex, slotIndex] = containerId.split('-');
    return {
      kind: 'slot',
      blockIndex: Number(blockIndex),
      slotIndex: Number(slotIndex),
    };
  }

  return null;
}

export function isSlotLetterCorrect(block: WordBlockState, slotIndex: number): boolean {
  const tile = block.slotDropData[slotIndex]?.[0];
  if (!tile) {
    return false;
  }

  const expectedLetter = splitAnswerIntoLetters(block.word)[slotIndex];
  if (!expectedLetter) {
    return false;
  }

  return normalizeWord(tile.letter) === normalizeWord(expectedLetter);
}

export function isSlotLetterWrong(block: WordBlockState, slotIndex: number): boolean {
  const tile = block.slotDropData[slotIndex]?.[0];
  if (!tile) {
    return false;
  }

  return !isSlotLetterCorrect(block, slotIndex);
}

export function getBlockDropListIds(block: WordBlockState, blockIndex: number): string[] {
  return [
    bankId(blockIndex),
    ...block.slotDropData.map((_, slotIndex) => slotId(blockIndex, slotIndex)),
  ];
}
