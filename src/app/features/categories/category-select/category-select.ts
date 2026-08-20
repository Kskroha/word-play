import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CATEGORIES } from '../../../core/data/categories';
import { getCategoryImageUrl } from '../../../core/utils/category-images';
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
}
