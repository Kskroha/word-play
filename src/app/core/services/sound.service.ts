import { inject, Injectable } from '@angular/core';
import { GameSettingsService } from './game-settings.service';

const CORRECT_SOUND = 'assets/sounds/correct.wav';
const INCORRECT_SOUND = 'assets/sounds/incorrect.wav';

@Injectable({ providedIn: 'root' })
export class SoundService {
  private readonly settingsService = inject(GameSettingsService);
  private correctAudio: HTMLAudioElement | null = null;
  private incorrectAudio: HTMLAudioElement | null = null;

  playCorrect(): void {
    this.play(this.getAudio(CORRECT_SOUND, 'correct'));
  }

  playIncorrect(): void {
    this.play(this.getAudio(INCORRECT_SOUND, 'incorrect'));
  }

  private getAudio(src: string, key: 'correct' | 'incorrect'): HTMLAudioElement {
    if (key === 'correct') {
      this.correctAudio ??= new Audio(src);
      return this.correctAudio;
    }

    this.incorrectAudio ??= new Audio(src);
    return this.incorrectAudio;
  }

  private play(audio: HTMLAudioElement): void {
    if (!this.settingsService.settings().soundEnabled) {
      return;
    }

    audio.currentTime = 0;
    void audio.play().catch(() => undefined);
  }
}
