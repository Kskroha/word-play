import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { APP_SECTIONS } from '../../../core/data/sections';
import { PageShell } from '../../../shared/ui/page-shell/page-shell';

@Component({
  selector: 'app-category-select',
  imports: [PageShell, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './category-select.html',
  styleUrl: './category-select.scss',
})
export class CategorySelect {
  readonly sections = APP_SECTIONS;
}
