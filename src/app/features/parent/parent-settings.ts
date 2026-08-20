import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  DIFFICULTY_LABELS,
  Difficulty,
  GAME_DEFINITIONS,
  GameId,
} from '../../core/models/game-settings.model';
import { GameSettingsService } from '../../core/services/game-settings.service';
import { PageShell } from '../../shared/ui/page-shell/page-shell';

@Component({
  selector: 'app-parent-settings',
  imports: [
    PageShell,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  templateUrl: './parent-settings.html',
  styleUrl: './parent-settings.scss',
})
export class ParentSettings {
  private readonly settingsService = inject(GameSettingsService);

  readonly settings = this.settingsService.settings;
  readonly games = GAME_DEFINITIONS;
  readonly difficultyLabels = DIFFICULTY_LABELS;
  readonly difficultyOptions: Difficulty[] = ['easy', 'medium', 'hard'];
  readonly answerChoiceOptions: Array<2 | 3 | 4> = [2, 3, 4];
  readonly sessionLimitOptions: Array<number | null> = [null, 5, 10, 15, 20, 30];

  updateDifficulty(difficulty: Difficulty): void {
    this.settingsService.update({ difficulty });
  }

  updateMaxAnswerChoices(maxAnswerChoices: 2 | 3 | 4): void {
    this.settingsService.update({ maxAnswerChoices });
  }

  updateSessionLimit(sessionTimeLimitMinutes: number | null): void {
    this.settingsService.update({ sessionTimeLimitMinutes });
  }

  updateSoundEnabled(soundEnabled: boolean): void {
    this.settingsService.update({ soundEnabled });
  }

  updateAnimationsEnabled(animationsEnabled: boolean): void {
    this.settingsService.update({ animationsEnabled });
  }

  isGameEnabled(gameId: GameId): boolean {
    return this.settingsService.isGameEnabled(gameId);
  }

  toggleGame(gameId: GameId, enabled: boolean): void {
    this.settingsService.setGameEnabled(gameId, enabled);
  }

  resetSettings(): void {
    this.settingsService.reset();
  }

  sessionLimitLabel(minutes: number | null): string {
    return minutes === null ? 'Без ограничения' : `${minutes} минут`;
  }
}
