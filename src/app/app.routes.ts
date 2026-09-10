import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'categories',
    pathMatch: 'full',
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./features/categories/category-select/category-select').then(
        (m) => m.CategorySelect,
      ),
  },
  {
    path: 'letters',
    loadComponent: () =>
      import('./features/letters/letter-game-list/letter-game-list').then(
        (m) => m.LetterGameList,
      ),
  },
  {
    path: 'letters/paint-letter',
    loadComponent: () =>
      import('./features/trace-letter/trace-letter-play/trace-letter-play').then(
        (m) => m.TraceLetterPlay,
      ),
  },
  {
    path: 'letters/outline-letter',
    loadComponent: () =>
      import('./features/outline-letter/outline-letter-play/outline-letter-play').then(
        (m) => m.OutlineLetterPlay,
      ),
  },
  {
    path: 'vocabulary',
    loadComponent: () =>
      import('./features/vocabulary/theme-select/theme-select').then(
        (m) => m.VocabularyThemeSelect,
      ),
  },
  {
    path: 'vocabulary/:categoryId',
    loadComponent: () =>
      import('./features/games/game-list').then((m) => m.GameList),
  },
  {
    path: 'vocabulary/:categoryId/build-word',
    loadComponent: () =>
      import('./features/build-word/build-word-play/build-word-play').then(
        (m) => m.BuildWordPlay,
      ),
  },
  {
    path: 'vocabulary/:categoryId/picture-choice',
    loadComponent: () =>
      import('./features/picture-choice/picture-choice-play/picture-choice-play').then(
        (m) => m.PictureChoicePlay,
      ),
  },
  {
    path: 'vocabulary/:categoryId/true-false',
    loadComponent: () =>
      import('./features/true-false/true-false-play/true-false-play').then(
        (m) => m.TrueFalsePlay,
      ),
  },
  {
    path: 'vocabulary/:categoryId/type-word',
    loadComponent: () =>
      import('./features/type-word/type-word-play/type-word-play').then(
        (m) => m.TypeWordPlay,
      ),
  },
  {
    path: 'parent',
    loadComponent: () =>
      import('./features/parent/parent-settings').then((m) => m.ParentSettings),
  },
  {
    path: 'categories/letters',
    redirectTo: 'letters',
    pathMatch: 'full',
  },
  {
    path: 'categories/letters/paint-letter',
    redirectTo: 'letters/paint-letter',
    pathMatch: 'full',
  },
  {
    path: 'categories/letters/outline-letter',
    redirectTo: 'letters/outline-letter',
    pathMatch: 'full',
  },
  {
    path: 'categories/:categoryId/build-word',
    redirectTo: 'vocabulary/:categoryId/build-word',
  },
  {
    path: 'categories/:categoryId/picture-choice',
    redirectTo: 'vocabulary/:categoryId/picture-choice',
  },
  {
    path: 'categories/:categoryId/true-false',
    redirectTo: 'vocabulary/:categoryId/true-false',
  },
  {
    path: 'categories/:categoryId/type-word',
    redirectTo: 'vocabulary/:categoryId/type-word',
  },
  {
    path: 'categories/:categoryId',
    redirectTo: 'vocabulary/:categoryId',
  },
  {
    path: 'games',
    redirectTo: 'categories',
  },
  {
    path: '**',
    redirectTo: 'categories',
  },
];
