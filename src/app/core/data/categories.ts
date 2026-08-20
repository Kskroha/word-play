import { Category, CategoryId } from '../models/category.model';

export const CATEGORIES: Category[] = [
  {
    id: 'emotions',
    title: 'Эмоции',
    description: 'Слова про чувства и эмоции',
    emoji: '😊',
    items: [
      { id: 'happy', label: 'я радуюсь', blocks: ['я', 'радуюсь'], imageEmoji: '😊' },
      { id: 'sad', label: 'мне грустно', blocks: ['мне', 'грустно'], imageEmoji: '😢' },
      { id: 'afraid', label: 'я боюсь', blocks: ['я', 'боюсь'], imageEmoji: '😨' },
      { id: 'angry', label: 'я злюсь', blocks: ['я', 'злюсь'], imageEmoji: '😠' },
      { id: 'surprised', label: 'я удивлен', blocks: ['я', 'удивлен'], imageEmoji: '😲' },
      { id: 'ashamed', label: 'мне стыдно', blocks: ['мне', 'стыдно'], imageEmoji: '😳' },
      { id: 'thinking', label: 'я думаю', blocks: ['я', 'думаю'], imageEmoji: '🤔' },
      { id: 'proud', label: 'я горжусь', blocks: ['я', 'горжусь'], imageEmoji: '😌' },
      { id: 'bored', label: 'мне скучно', blocks: ['мне', 'скучно'], imageEmoji: '😐' },
      { id: 'delighted', label: 'я в восторге', blocks: ['я', 'в', 'восторге'], imageEmoji: '🤩' },
    ],
  },
  {
    id: 'numbers',
    title: 'Цифры',
    description: 'Числа от одного до десяти',
    emoji: '🔢',
    items: [
      { id: 'one', label: '1', blocks: ['один'], imageEmoji: '1️⃣' },
      { id: 'two', label: '2', blocks: ['два'], imageEmoji: '2️⃣' },
      { id: 'three', label: '3', blocks: ['три'], imageEmoji: '3️⃣' },
      { id: 'four', label: '4', blocks: ['четыре'], imageEmoji: '4️⃣' },
      { id: 'five', label: '5', blocks: ['пять'], imageEmoji: '5️⃣' },
      { id: 'six', label: '6', blocks: ['шесть'], imageEmoji: '6️⃣' },
      { id: 'seven', label: '7', blocks: ['семь'], imageEmoji: '7️⃣' },
      { id: 'eight', label: '8', blocks: ['восемь'], imageEmoji: '8️⃣' },
      { id: 'nine', label: '9', blocks: ['девять'], imageEmoji: '9️⃣' },
      { id: 'ten', label: '10', blocks: ['десять'], imageEmoji: '🔟' },
    ],
  },
  {
    id: 'sea-creatures',
    title: 'Морские обитатели',
    description: 'Названия морских животных',
    emoji: '🐠',
    items: [
      { id: 'fish', label: 'рыба', blocks: ['рыба'], imageEmoji: '🐟' },
      { id: 'crab', label: 'краб', blocks: ['краб'], imageEmoji: '🦀' },
      { id: 'whale', label: 'кит', blocks: ['кит'], imageEmoji: '🐋' },
      { id: 'shark', label: 'акула', blocks: ['акула'], imageEmoji: '🦈' },
      { id: 'octopus', label: 'осьминог', blocks: ['осьминог'], imageEmoji: '🐙' },
      { id: 'jellyfish', label: 'медуза', blocks: ['медуза'], imageEmoji: '🪼' },
      { id: 'turtle', label: 'черепаха', blocks: ['черепаха'], imageEmoji: '🐢' },
      { id: 'dolphin', label: 'дельфин', blocks: ['дельфин'], imageEmoji: '🐬' },
    ],
  },
];

export function getCategoryById(id: CategoryId): Category | undefined {
  return CATEGORIES.find((category) => category.id === id);
}

export function isCategoryId(value: string): value is CategoryId {
  return CATEGORIES.some((category) => category.id === value);
}
