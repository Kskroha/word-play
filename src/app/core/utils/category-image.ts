import { CategoryId } from '../models/category.model';
import { PictureMode } from '../models/game-settings.model';

const FISH_EMOTION_IMAGE_BASE = 'assets/images/emotions/fish';

export function getCategoryItemPictureUrl(
  categoryId: CategoryId,
  itemId: string,
  mode: PictureMode,
): string | null {
  if (mode !== 'fish') {
    return null;
  }

  if (categoryId === 'emotions') {
    return `${FISH_EMOTION_IMAGE_BASE}/f_${itemId}.jpg`;
  }

  return null;
}

export function categorySupportsPictureMode(
  categoryId: CategoryId,
  mode: PictureMode,
): boolean {
  if (mode === 'emoji') {
    return true;
  }

  return categoryId === 'emotions' && mode === 'fish';
}

export function getAvailablePictureModes(categoryId: CategoryId): PictureMode[] {
  const modes: PictureMode[] = ['emoji'];

  if (categoryId === 'emotions') {
    modes.push('fish');
  }

  return modes;
}
