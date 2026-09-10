const RU_LETTER_NAMES: Record<string, string> = {
  а: 'а',
  б: 'бэ',
  в: 'вэ',
  г: 'гэ',
  д: 'дэ',
  е: 'е',
  ё: 'ё',
  ж: 'жэ',
  з: 'зэ',
  и: 'и',
  й: 'и краткое',
  к: 'ка',
  л: 'эль',
  м: 'эм',
  н: 'эн',
  о: 'о',
  п: 'пэ',
  р: 'эр',
  с: 'эс',
  т: 'тэ',
  у: 'у',
  ф: 'эф',
  х: 'ха',
  ц: 'цэ',
  ч: 'че',
  ш: 'ша',
  щ: 'ща',
  ъ: 'твёрдый знак',
  ы: 'ы',
  ь: 'мягкий знак',
  э: 'э',
  ю: 'ю',
  я: 'я',
};

export function getSpokenLetter(letter: string): string | null {
  const normalized = letter.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  if (normalized.length === 1) {
    return RU_LETTER_NAMES[normalized] ?? normalized;
  }

  return normalized;
}
