import { GameId } from '../models/game-settings.model';

export const GAME_IMAGE_URLS: Record<GameId, string> = {
  'picture-choice': 'assets/images/games/picture-choice.png',
  'build-word': 'assets/images/games/build-word.png',
  'type-word': 'assets/images/games/type-word.png',
  'true-false': 'assets/images/games/true-false.png',
};

export function getGameImageUrl(gameId: GameId): string {
  return GAME_IMAGE_URLS[gameId];
}
