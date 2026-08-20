import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORIES, getCategoryRoute } from '../../../core/data/categories';
import { CategoryId } from '../../../core/models/category.model';
import { getCategoryImageUrl, hasCategoryImage } from '../../../core/utils/category-images';
import { PageShell } from '../../../shared/ui/page-shell/page-shell';

@Component({
  selector: 'app-category-select',
  imports: [PageShell, RouterLink],
  templateUrl: './category-select.html',
  styleUrl: './category-select.scss',
})
export class CategorySelect {
  readonly categories = CATEGORIES;
  readonly categoryImageUrl = getCategoryImageUrl;
  readonly categoryRoute = (categoryId: CategoryId) => getCategoryRoute(categoryId);
  readonly isTitleOnlyCategory = (categoryId: CategoryId) =>
    categoryId !== 'letters' && !hasCategoryImage(categoryId);
}
