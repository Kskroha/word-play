import { LetterGameId } from '../models/letter-games.model';

export const LETTER_GAME_IMAGE_URLS: Record<LetterGameId, string> = {
  'paint-letter': 'assets/images/games/trace-letter.svg',
  'outline-letter': 'assets/images/games/outline-letter.svg',
};

export function getLetterGameImageUrl(gameId: LetterGameId): string {
  return LETTER_GAME_IMAGE_URLS[gameId];
}
