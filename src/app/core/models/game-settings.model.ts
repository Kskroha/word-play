export type Difficulty = 'easy' | 'medium' | 'hard';

export type PictureMode = 'emoji' | 'fish';

export type GameId =
  | 'picture-choice'
  | 'build-word'
  | 'type-word'
  | 'true-false';

export interface GameDefinition {
  id: GameId;
  title: string;
  description: string;
}

export interface GameSettings {
  settingsVersion: number;
  difficulty: Difficulty;
  maxAnswerChoices: 2 | 3 | 4;
  sessionTimeLimitMinutes: number | null;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  pictureMode: PictureMode;
  enabledGames: GameId[];
}

export const GAME_DEFINITIONS: GameDefinition[] = [
  {
    id: 'picture-choice',
    title: 'Выбери картинку',
    description: 'Посмотри на слово и выбери правильную картинку',
  },
  {
    id: 'build-word',
    title: 'Собери слово',
    description: 'Расставь буквы в правильном порядке',
  },
  {
    id: 'type-word',
    title: 'Напечатай слово',
    description: 'Набери слово на клавиатуре',
  },
  {
    id: 'true-false',
    title: 'Верно или неверно',
    description: 'Посмотри на задание и выбери ответ',
  },
];

export const CURRENT_SETTINGS_VERSION = 2;

export const DEFAULT_GAME_SETTINGS: GameSettings = {
  settingsVersion: CURRENT_SETTINGS_VERSION,
  difficulty: 'easy',
  maxAnswerChoices: 3,
  sessionTimeLimitMinutes: null,
  soundEnabled: true,
  animationsEnabled: true,
  pictureMode: 'emoji',
  enabledGames: ['picture-choice', 'build-word', 'type-word', 'true-false'],
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Лёгкая',
  medium: 'Средняя',
  hard: 'Сложная',
};

export const PICTURE_MODE_LABELS: Record<PictureMode, string> = {
  emoji: 'Эмодзи',
  fish: 'Рыбки',
};
