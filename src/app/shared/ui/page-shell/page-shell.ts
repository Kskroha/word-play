import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-shell',
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './page-shell.html',
  styleUrl: './page-shell.scss',
})
export class PageShell {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
  readonly showBack = input(true);
  readonly backLink = input<string | string[]>('/');
}
