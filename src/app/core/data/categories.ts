import { Category, CategoryId, CategoryItem } from '../models/category.model';
import {
  BIRD_ITEMS,
  DOMESTIC_ANIMAL_ITEMS,
  FAMILY_ITEMS,
  FOOD_ITEMS,
  FRUIT_ITEMS,
  INSECT_ITEMS,
  MUSIC_ITEMS,
  NATURE_ITEMS,
  PROFESSION_ITEMS,
  SPACE_ITEMS,
  SPORT_ITEMS,
  TRANSPORT_ITEMS,
  VEGETABLE_ITEMS,
  WILD_ANIMAL_ITEMS,
} from './word-category-items';

export type LetterAlphabetId = 'ru' | 'en';

export const LETTER_ALPHABET_OPTIONS: { id: LetterAlphabetId; label: string }[] = [
  { id: 'ru', label: 'А-Я' },
  { id: 'en', label: 'A-Z' },
];

const CYRILLIC_LETTERS: { id: string; letter: string }[] = [
  { id: 'a', letter: 'а' },
  { id: 'b', letter: 'б' },
  { id: 'v', letter: 'в' },
  { id: 'g', letter: 'г' },
  { id: 'd', letter: 'д' },
  { id: 'e', letter: 'е' },
  { id: 'yo', letter: 'ё' },
  { id: 'zh', letter: 'ж' },
  { id: 'z', letter: 'з' },
  { id: 'i', letter: 'и' },
  { id: 'y', letter: 'й' },
  { id: 'k', letter: 'к' },
  { id: 'l', letter: 'л' },
  { id: 'm', letter: 'м' },
  { id: 'n', letter: 'н' },
  { id: 'o', letter: 'о' },
  { id: 'p', letter: 'п' },
  { id: 'r', letter: 'р' },
  { id: 's', letter: 'с' },
  { id: 't', letter: 'т' },
  { id: 'u', letter: 'у' },
  { id: 'f', letter: 'ф' },
  { id: 'h', letter: 'х' },
  { id: 'ts', letter: 'ц' },
  { id: 'ch', letter: 'ч' },
  { id: 'sh', letter: 'ш' },
  { id: 'sch', letter: 'щ' },
  { id: 'hard-sign', letter: 'ъ' },
  { id: 'soft-y', letter: 'ы' },
  { id: 'soft-sign', letter: 'ь' },
  { id: 'ye', letter: 'э' },
  { id: 'yu', letter: 'ю' },
  { id: 'ya', letter: 'я' },
];

const LATIN_LETTERS: { id: string; letter: string }[] = [
  { id: 'a', letter: 'a' },
  { id: 'b', letter: 'b' },
  { id: 'c', letter: 'c' },
  { id: 'd', letter: 'd' },
  { id: 'e', letter: 'e' },
  { id: 'f', letter: 'f' },
  { id: 'g', letter: 'g' },
  { id: 'h', letter: 'h' },
  { id: 'i', letter: 'i' },
  { id: 'j', letter: 'j' },
  { id: 'k', letter: 'k' },
  { id: 'l', letter: 'l' },
  { id: 'm', letter: 'm' },
  { id: 'n', letter: 'n' },
  { id: 'o', letter: 'o' },
  { id: 'p', letter: 'p' },
  { id: 'q', letter: 'q' },
  { id: 'r', letter: 'r' },
  { id: 's', letter: 's' },
  { id: 't', letter: 't' },
  { id: 'u', letter: 'u' },
  { id: 'v', letter: 'v' },
  { id: 'w', letter: 'w' },
  { id: 'x', letter: 'x' },
  { id: 'y', letter: 'y' },
  { id: 'z', letter: 'z' },
];

function buildLetterCategoryItems(
  letters: { id: string; letter: string }[],
  locale: 'ru-RU' | 'en-US',
): CategoryItem[] {
  return letters.map(({ id, letter }) => {
    const upper = letter.toLocaleUpperCase(locale);
    return {
      id,
      label: upper,
      blocks: [upper],
      imageEmoji: upper,
    };
  });
}

export function getLetterCategoryItems(alphabet: LetterAlphabetId): CategoryItem[] {
  if (alphabet === 'en') {
    return buildLetterCategoryItems(LATIN_LETTERS, 'en-US');
  }

  return buildLetterCategoryItems(CYRILLIC_LETTERS, 'ru-RU');
}

export const CATEGORIES: Category[] = [
  {
    id: 'letters',
    title: 'Буквы',
    description: 'Учимся раскрашивать буквы',
    emoji: '🔤',
    items: getLetterCategoryItems('ru'),
  },
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
      { id: 'seal', label: 'тюлень', blocks: ['тюлень'], imageEmoji: '🦭' },
      { id: 'squid', label: 'кальмар', blocks: ['кальмар'], imageEmoji: '🦑' },
      { id: 'lobster', label: 'омар', blocks: ['омар'], imageEmoji: '🦞' },
      { id: 'shrimp', label: 'креветка', blocks: ['креветка'], imageEmoji: '🦐' },
      { id: 'tropical-fish', label: 'рыбка', blocks: ['рыбка'], imageEmoji: '🐠' },
      { id: 'blowfish', label: 'рыба-шар', blocks: ['рыба-шар'], imageEmoji: '🐡' },
      { id: 'oyster', label: 'устрица', blocks: ['устрица'], imageEmoji: '🦪' },
      { id: 'shell', label: 'ракушка', blocks: ['ракушка'], imageEmoji: '🐚' },
      { id: 'penguin', label: 'пингвин', blocks: ['пингвин'], imageEmoji: '🐧' },
      { id: 'coral', label: 'коралл', blocks: ['коралл'], imageEmoji: '🪸' },
      { id: 'mermaid', label: 'русалка', blocks: ['русалка'], imageEmoji: '🧜‍♀️' },
      { id: 'beluga', label: 'белуха', blocks: ['белуха'], imageEmoji: '🐳' },
    ],
  },
  {
    id: 'domestic-animals',
    title: 'Домашние животные',
    description: 'Питомцы и домашний скот',
    emoji: '🐕',
    items: DOMESTIC_ANIMAL_ITEMS,
  },
  {
    id: 'wild-animals',
    title: 'Дикие животные',
    description: 'Животные дикой природы',
    emoji: '🦁',
    items: WILD_ANIMAL_ITEMS,
  },
  {
    id: 'birds',
    title: 'Птицы',
    description: 'Перелётные и домашние птицы',
    emoji: '🐦',
    items: BIRD_ITEMS,
  },
  {
    id: 'insects',
    title: 'Насекомые',
    description: 'Мир насекомых и паукообразных',
    emoji: '🐝',
    items: INSECT_ITEMS,
  },
  {
    id: 'fruits',
    title: 'Фрукты',
    description: 'Сочные и спелые фрукты',
    emoji: '🍎',
    items: FRUIT_ITEMS,
  },
  {
    id: 'vegetables',
    title: 'Овощи',
    description: 'Овощи и зелень',
    emoji: '🥕',
    items: VEGETABLE_ITEMS,
  },
  {
    id: 'food',
    title: 'Еда и сладости',
    description: 'Вкусная еда и десерты',
    emoji: '🍰',
    items: FOOD_ITEMS,
  },
  {
    id: 'transport',
    title: 'Транспорт',
    description: 'Машины, поезда и другой транспорт',
    emoji: '🚗',
    items: TRANSPORT_ITEMS,
  },
  {
    id: 'nature',
    title: 'Погода и природа',
    description: 'Природа, погода и растения',
    emoji: '🌳',
    items: NATURE_ITEMS,
  },
  {
    id: 'space',
    title: 'Космос',
    description: 'Планеты, звёзды и космос',
    emoji: '🚀',
    items: SPACE_ITEMS,
  },
  {
    id: 'family',
    title: 'Семья',
    description: 'Члены семьи и близкие',
    emoji: '👨‍👩‍👧',
    items: FAMILY_ITEMS,
  },
  {
    id: 'professions',
    title: 'Профессии',
    description: 'Кем можно стать',
    emoji: '👨‍⚕️',
    items: PROFESSION_ITEMS,
  },
  {
    id: 'sports',
    title: 'Спорт и игры',
    description: 'Спорт, игры и активность',
    emoji: '⚽',
    items: SPORT_ITEMS,
  },
  {
    id: 'music',
    title: 'Музыка',
    description: 'Инструменты и музыка',
    emoji: '🎵',
    items: MUSIC_ITEMS,
  },
];

export function getCategoryById(id: CategoryId): Category | undefined {
  return CATEGORIES.find((category) => category.id === id);
}

export function isCategoryId(value: string): value is CategoryId {
  return CATEGORIES.some((category) => category.id === value);
}

export function isWordCategoryId(value: string): value is Exclude<CategoryId, 'letters'> {
  return isCategoryId(value) && value !== 'letters';
}

export function getCategoryRoute(categoryId: CategoryId): string[] {
  if (categoryId === 'letters') {
    return ['/categories', 'letters'];
  }

  return ['/categories', categoryId];
}
