import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { getCategoryById, isWordCategoryId } from '../../core/data/categories';
import { GAME_DEFINITIONS } from '../../core/models/game-settings.model';
import { GameSettingsService } from '../../core/services/game-settings.service';
import { getGameImageUrl } from '../../core/utils/game-images';
import { PageShell } from '../../shared/ui/page-shell/page-shell';

@Component({
  selector: 'app-game-list',
  imports: [PageShell, RouterLink],
  templateUrl: './game-list.html',
  styleUrl: './game-list.scss',
})
export class GameList {
  private readonly route = inject(ActivatedRoute);
  private readonly settingsService = inject(GameSettingsService);

  readonly gameImageUrl = getGameImageUrl;

  private readonly categoryId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('categoryId') ?? '')),
    { initialValue: '' },
  );

  readonly category = computed(() => {
    const id = this.categoryId();
    return isWordCategoryId(id) ? getCategoryById(id) : undefined;
  });

  readonly games = computed(() => {
    const enabledGames = this.settingsService.settings().enabledGames;

    return GAME_DEFINITIONS.map((game) => ({
      ...game,
      enabled: enabledGames.includes(game.id),
    }));
  });

  readonly enabledCount = computed(
    () => this.games().filter((game) => game.enabled).length,
  );
}
