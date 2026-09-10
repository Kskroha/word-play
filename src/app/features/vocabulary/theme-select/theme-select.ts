import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  getVocabularyThemeRoute,
  WORD_CATEGORIES,
} from '../../../core/data/categories';
import { CategoryId } from '../../../core/models/category.model';
import { HOME_ROUTE } from '../../../core/data/sections';
import { PageShell } from '../../../shared/ui/page-shell/page-shell';

@Component({
  selector: 'app-vocabulary-theme-select',
  imports: [PageShell, RouterLink],
  templateUrl: './theme-select.html',
  styleUrl: './theme-select.scss',
})
export class VocabularyThemeSelect {
  readonly themes = WORD_CATEGORIES;
  readonly backLink = HOME_ROUTE;
  readonly themeRoute = (categoryId: Exclude<CategoryId, 'letters'>) =>
    getVocabularyThemeRoute(categoryId);
}
