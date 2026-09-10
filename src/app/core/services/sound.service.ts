import { inject, Injectable } from '@angular/core';
import { getSpokenLetter } from '../utils/speech-letter';
import { GameSettingsService } from './game-settings.service';

const CORRECT_SOUND = 'assets/sounds/correct.wav';
const INCORRECT_SOUND = 'assets/sounds/incorrect.wav';
const SPEAK_AFTER_CANCEL_MS = 80;

@Injectable({ providedIn: 'root' })
export class SoundService {
  private readonly settingsService = inject(GameSettingsService);
  private correctAudio: HTMLAudioElement | null = null;
  private incorrectAudio: HTMLAudioElement | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private speakTimer: ReturnType<typeof setTimeout> | null = null;
  private unlocked = false;

  constructor() {
    this.initSpeech();
  }

  playCorrect(): void {
    this.play(this.getAudio(CORRECT_SOUND, 'correct'));
  }

  playIncorrect(): void {
    this.play(this.getAudio(INCORRECT_SOUND, 'incorrect'));
  }

  speakLetter(letter: string): void {
    const spoken = getSpokenLetter(letter);
    if (!spoken) {
      return;
    }

    this.speak(spoken, { rate: 0.95, interrupt: true });
  }

  speakWord(
    word: string,
    options?: {
      interrupt?: boolean;
      delayMs?: number;
    },
  ): void {
    const trimmed = word.trim();
    if (!trimmed) {
      return;
    }

    this.speak(trimmed, {
      rate: 0.85,
      interrupt: options?.interrupt ?? true,
      delayMs: options?.delayMs,
    });
  }

  private initSpeech(): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return;
    }

    const loadVoices = () => {
      this.voices = window.speechSynthesis.getVoices();
    };

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

    const unlock = () => {
      this.unlockSpeech();
      window.removeEventListener('pointerdown', unlock, true);
      window.removeEventListener('keydown', unlock, true);
    };

    window.addEventListener('pointerdown', unlock, true);
    window.addEventListener('keydown', unlock, true);
  }

  private unlockSpeech(): void {
    if (this.unlocked || typeof window === 'undefined' || !window.speechSynthesis) {
      return;
    }

    this.unlocked = true;
    window.speechSynthesis.getVoices();

    const warmUp = new SpeechSynthesisUtterance(' ');
    warmUp.volume = 0;
    warmUp.rate = 1;
    warmUp.lang = 'ru-RU';
    window.speechSynthesis.speak(warmUp);
  }

  private speak(
    text: string,
    options: {
      rate: number;
      interrupt?: boolean;
      delayMs?: number;
    },
  ): void {
    if (!this.settingsService.settings().soundEnabled) {
      return;
    }

    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return;
    }

    this.unlockSpeech();

    const start = () => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = options.rate;

      const voice = this.pickRussianVoice();
      if (voice) {
        utterance.voice = voice;
      }

      const play = () => {
        window.speechSynthesis.speak(utterance);
        window.speechSynthesis.resume();
      };

      const synth = window.speechSynthesis;
      if (options.interrupt && (synth.speaking || synth.pending)) {
        synth.cancel();
        this.clearSpeakTimer();
        this.speakTimer = setTimeout(play, SPEAK_AFTER_CANCEL_MS);
        return;
      }

      play();
    };

    if (options.delayMs && options.delayMs > 0) {
      this.clearSpeakTimer();
      this.speakTimer = setTimeout(start, options.delayMs);
      return;
    }

    start();
  }

  private pickRussianVoice(): SpeechSynthesisVoice | undefined {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return undefined;
    }

    const voices = this.voices.length ? this.voices : window.speechSynthesis.getVoices();
    this.voices = voices;

    return (
      voices.find((voice) => /^ru\b/i.test(voice.lang) && voice.localService) ??
      voices.find((voice) => /^ru\b/i.test(voice.lang))
    );
  }

  private clearSpeakTimer(): void {
    if (this.speakTimer) {
      clearTimeout(this.speakTimer);
      this.speakTimer = null;
    }
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
