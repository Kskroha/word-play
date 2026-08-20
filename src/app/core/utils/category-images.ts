import { CategoryId } from '../models/category.model';

export const CATEGORY_IMAGE_URLS: Partial<Record<CategoryId, string>> = {
  emotions: 'assets/images/categories/emotions.png',
  numbers: 'assets/images/categories/digits.png',
  'sea-creatures': 'assets/images/categories/sea.png',
};

export function getCategoryImageUrl(categoryId: CategoryId): string | null {
  return CATEGORY_IMAGE_URLS[categoryId] ?? null;
}

export function hasCategoryImage(categoryId: CategoryId): boolean {
  return categoryId in CATEGORY_IMAGE_URLS;
}
