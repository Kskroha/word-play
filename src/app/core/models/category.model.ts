export type CategoryId =
  | 'letters'
  | 'emotions'
  | 'numbers'
  | 'sea-creatures'
  | 'domestic-animals'
  | 'wild-animals'
  | 'birds'
  | 'insects'
  | 'fruits'
  | 'vegetables'
  | 'food'
  | 'transport'
  | 'nature'
  | 'space'
  | 'family'
  | 'professions'
  | 'sports'
  | 'music';

export interface CategoryItem {
  id: string;
  label: string;
  blocks: string[];
  imageEmoji: string;
  imageUrl?: string;
}

export interface Category {
  id: CategoryId;
  title: string;
  description: string;
  emoji: string;
  items: CategoryItem[];
}
