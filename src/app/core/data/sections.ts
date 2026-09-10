import { AppSection } from '../models/sections.model';

export const APP_SECTIONS: AppSection[] = [
  {
    id: 'letters',
    title: 'Буквы',
    description: 'Учимся узнавать, закрашивать и писать буквы',
    emoji: '🔤',
    route: ['/letters'],
  },
  {
    id: 'vocabulary',
    title: 'Слова по темам',
    description: 'Животные, еда, транспорт и другие темы',
    emoji: '📚',
    route: ['/vocabulary'],
  },
];

export const HOME_ROUTE: string[] = ['/categories'];
