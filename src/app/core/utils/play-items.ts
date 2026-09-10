import { linkedSignal, Signal, untracked, WritableSignal } from '@angular/core';
import { Category, CategoryItem } from '../models/category.model';
import { shuffle } from './shuffle';

export function takePlayItems<T>(items: T[], maxWords: number | null): T[] {
  if (maxWords == null || maxWords < 1) {
    return [...items];
  }

  return shuffle(items).slice(0, Math.min(maxWords, items.length));
}

export function resetPlayItems(
  playItems: WritableSignal<CategoryItem[]>,
  category: Category | undefined,
  maxWords: number | null,
): void {
  playItems.set(category ? takePlayItems(category.items, maxWords) : []);
}

export function createPlayItemsSignal(
  category: Signal<Category | undefined>,
  maxWords: () => number | null,
): WritableSignal<CategoryItem[]> {
  return linkedSignal({
    source: category,
    computation: (current) =>
      current ? takePlayItems(current.items, untracked(maxWords)) : [],
  });
}
