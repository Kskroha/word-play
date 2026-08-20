import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORIES } from '../../../core/data/categories';
import { PageShell } from '../../../shared/ui/page-shell/page-shell';

@Component({
  selector: 'app-build-word-category-select',
  imports: [PageShell, RouterLink],
  templateUrl: './category-select.html',
  styleUrl: './category-select.scss',
})
export class BuildWordCategorySelect {
  readonly categories = CATEGORIES;
}
