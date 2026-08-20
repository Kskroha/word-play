import { Injectable, signal } from '@angular/core';
import {
  CURRENT_SETTINGS_VERSION,
  DEFAULT_GAME_SETTINGS,
  GameId,
  GameSettings,
} from '../models/game-settings.model';

const STORAGE_KEY = 'word-play-settings';

@Injectable({ providedIn: 'root' })
export class GameSettingsService {
  readonly settings = signal<GameSettings>(this.load());

  update(partial: Partial<GameSettings>): void {
    this.settings.update((current) => {
      const next = { ...current, ...partial };
      this.save(next);
      return next;
    });
  }

  isGameEnabled(gameId: GameId): boolean {
    return this.settings().enabledGames.includes(gameId);
  }

  setGameEnabled(gameId: GameId, enabled: boolean): void {
    const enabledGames = this.settings().enabledGames;
    const next = enabled
      ? enabledGames.includes(gameId)
        ? enabledGames
        : [...enabledGames, gameId]
      : enabledGames.filter((id) => id !== gameId);

    this.update({ enabledGames: next });
  }

  reset(): void {
    this.update({ ...DEFAULT_GAME_SETTINGS });
  }

  private load(): GameSettings {
    if (typeof localStorage === 'undefined') {
      return { ...DEFAULT_GAME_SETTINGS };
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return { ...DEFAULT_GAME_SETTINGS };
      }

      const parsed = JSON.parse(raw) as Partial<GameSettings>;
      const merged: GameSettings = { ...DEFAULT_GAME_SETTINGS, ...parsed };

      if ((merged.settingsVersion ?? 0) < CURRENT_SETTINGS_VERSION) {
        const enabled = new Set(merged.enabledGames);
        for (const gameId of DEFAULT_GAME_SETTINGS.enabledGames) {
          enabled.add(gameId);
        }
        merged.enabledGames = [...enabled];
        merged.settingsVersion = CURRENT_SETTINGS_VERSION;
        this.save(merged);
      }

      return merged;
    } catch {
      return { ...DEFAULT_GAME_SETTINGS };
    }
  }

  private save(settings: GameSettings): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }
}
