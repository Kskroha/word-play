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
  {
    id: 'name-picture',
    title: 'Назови картинку',
    description: 'Посмотри на картинку и скажи вслух, что это',
    emoji: '🎤',
    route: ['/name-picture'],
  },
];

export const HOME_ROUTE: string[] = ['/categories'];
