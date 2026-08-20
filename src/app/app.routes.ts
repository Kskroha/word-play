import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/welcome/welcome').then((m) => m.Welcome),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./features/categories/category-select/category-select').then(
        (m) => m.CategorySelect,
      ),
  },
  {
    path: 'categories/letters',
    loadComponent: () =>
      import('./features/letters/letter-game-list/letter-game-list').then(
        (m) => m.LetterGameList,
      ),
  },
  {
    path: 'categories/letters/paint-letter',
    loadComponent: () =>
      import('./features/trace-letter/trace-letter-play/trace-letter-play').then(
        (m) => m.TraceLetterPlay,
      ),
  },
  {
    path: 'categories/letters/outline-letter',
    loadComponent: () =>
      import('./features/outline-letter/outline-letter-play/outline-letter-play').then(
        (m) => m.OutlineLetterPlay,
      ),
  },
  {
    path: 'categories/:categoryId',
    loadComponent: () =>
      import('./features/games/game-list').then((m) => m.GameList),
  },
  {
    path: 'categories/:categoryId/build-word',
    loadComponent: () =>
      import('./features/build-word/build-word-play/build-word-play').then(
        (m) => m.BuildWordPlay,
      ),
  },
  {
    path: 'categories/:categoryId/picture-choice',
    loadComponent: () =>
      import('./features/picture-choice/picture-choice-play/picture-choice-play').then(
        (m) => m.PictureChoicePlay,
      ),
  },
  {
    path: 'categories/:categoryId/true-false',
    loadComponent: () =>
      import('./features/true-false/true-false-play/true-false-play').then(
        (m) => m.TrueFalsePlay,
      ),
  },
  {
    path: 'categories/:categoryId/type-word',
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
    path: 'games',
    redirectTo: 'categories',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
