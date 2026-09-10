import { inject, Injectable } from '@angular/core';
import { getSpokenLetter } from '../utils/speech-letter';
import { GameSettingsService } from './game-settings.service';

const CORRECT_SOUND = 'assets/sounds/correct.wav';
const INCORRECT_SOUND = 'assets/sounds/incorrect.wav';
const SPEAK_AFTER_CANCEL_MS = 120;
const SPEAK_AFTER_FEEDBACK_MS = 400;

@Injectable({ providedIn: 'root' })
export class SoundService {
  private readonly settingsService = inject(GameSettingsService);
  private correctAudio: HTMLAudioElement | null = null;
  private incorrectAudio: HTMLAudioElement | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private speakTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly heldUtterances = new Set<SpeechSynthesisUtterance>();

  constructor() {
    this.initSpeech();
  }

  playCorrect(): Promise<void> {
    return this.play(this.getAudio(CORRECT_SOUND, 'correct'));
  }

  playIncorrect(): Promise<void> {
    return this.play(this.getAudio(INCORRECT_SOUND, 'incorrect'));
  }

  playCorrectThenSpeak(word: string): void {
    this.playThenSpeak(this.playCorrect(), word);
  }

  playCorrectThenSpeakLetter(letter: string): void {
    void this.playCorrect().then(() => {
      this.speakLetter(letter, { delayMs: SPEAK_AFTER_FEEDBACK_MS });
    });
  }

  playIncorrectThenSpeak(word: string): void {
    this.playThenSpeak(this.playIncorrect(), word);
  }

  speakLetter(letter: string, options?: { delayMs?: number }): void {
    const spoken = getSpokenLetter(letter);
    if (!spoken) {
      return;
    }

    this.speak(spoken, { rate: 0.95, interrupt: true, delayMs: options?.delayMs });
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

    const start = () => this.enqueueUtterance(text, options.rate, options.interrupt !== false);

    if (options.delayMs && options.delayMs > 0) {
      this.clearSpeakTimer();
      this.speakTimer = setTimeout(start, options.delayMs);
      return;
    }

    start();
  }

  private enqueueUtterance(text: string, rate: number, interrupt: boolean): void {
    const synth = window.speechSynthesis;
    const utterance = this.createUtterance(text, rate);

    const play = () => {
      synth.speak(utterance);
      if (synth.paused) {
        synth.resume();
      }
    };

    if (interrupt && (synth.speaking || synth.pending || synth.paused)) {
      synth.cancel();
      this.clearSpeakTimer();
      this.speakTimer = setTimeout(play, SPEAK_AFTER_CANCEL_MS);
      return;
    }

    play();
  }

  private createUtterance(text: string, rate: number): SpeechSynthesisUtterance {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.volume = 1;
    utterance.pitch = 1;

    const voice = this.pickLocalRussianVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    }

    this.heldUtterances.add(utterance);
    const release = () => this.heldUtterances.delete(utterance);
    utterance.onend = release;
    utterance.onerror = (event) => {
      release();
      if (event.error === 'interrupted' || event.error === 'canceled') {
        return;
      }

      this.retryWithDefaultVoice(text, rate);
    };

    return utterance;
  }

  private retryWithDefaultVoice(text: string, rate: number): void {
    if (!window.speechSynthesis) {
      return;
    }

    const fallback = new SpeechSynthesisUtterance(text);
    fallback.rate = rate;
    fallback.volume = 1;
    this.heldUtterances.add(fallback);
    const release = () => this.heldUtterances.delete(fallback);
    fallback.addEventListener('end', release);
    fallback.addEventListener('error', release);
    window.speechSynthesis.speak(fallback);
  }

  private pickLocalRussianVoice(): SpeechSynthesisVoice | undefined {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return undefined;
    }

    const voices = this.voices.length ? this.voices : window.speechSynthesis.getVoices();
    this.voices = voices;

    return voices.find((voice) => voice.localService && /^ru\b/i.test(voice.lang));
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

  private playThenSpeak(feedback: Promise<void>, word: string): void {
    void feedback.then(() => {
      this.speakWord(word, { delayMs: SPEAK_AFTER_FEEDBACK_MS });
    });
  }

  private play(audio: HTMLAudioElement): Promise<void> {
    if (!this.settingsService.settings().soundEnabled) {
      return Promise.resolve();
    }

    audio.currentTime = 0;

    return new Promise((resolve) => {
      const finish = () => {
        audio.removeEventListener('ended', finish);
        audio.removeEventListener('error', finish);
        resolve();
      };

      audio.addEventListener('ended', finish);
      audio.addEventListener('error', finish);
      void audio.play().catch(() => finish());
    });
  }
}
