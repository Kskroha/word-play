import { CategoryId } from '../models/category.model';

export const CATEGORY_IMAGE_URLS: Record<CategoryId, string> = {
  emotions: '/assets/images/categories/emotions.png',
  numbers: '/assets/images/categories/digits.png',
  'sea-creatures': '/assets/images/categories/sea.png',
};

export function getCategoryImageUrl(categoryId: CategoryId): string {
  return CATEGORY_IMAGE_URLS[categoryId];
}
