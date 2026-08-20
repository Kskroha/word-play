export type LetterGameId = 'paint-letter' | 'outline-letter';

export interface LetterGameDefinition {
  id: LetterGameId;
  title: string;
  description: string;
}

export const LETTER_GAME_DEFINITIONS: LetterGameDefinition[] = [
  {
    id: 'paint-letter',
    title: 'Закрась букву',
    description: 'Закрась букву целиком',
  },
  {
    id: 'outline-letter',
    title: 'Напиши букву',
    description: 'Проведи по пунктирным линиям',
  },
];
