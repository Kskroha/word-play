import { Component, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { getCategoryById } from '../../../core/data/categories';
import { LETTER_GAME_DEFINITIONS } from '../../../core/models/letter-games.model';
import { getLetterGameImageUrl } from '../../../core/utils/letter-game-images';
import { PageShell } from '../../../shared/ui/page-shell/page-shell';

@Component({
  selector: 'app-letter-game-list',
  imports: [PageShell, RouterLink],
  templateUrl: './letter-game-list.html',
  styleUrl: './letter-game-list.scss',
})
export class LetterGameList {
  readonly games = LETTER_GAME_DEFINITIONS;
  readonly gameImageUrl = getLetterGameImageUrl;
  readonly category = computed(() => getCategoryById('letters'));
}
