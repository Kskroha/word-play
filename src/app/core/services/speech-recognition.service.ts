import { Injectable } from '@angular/core';

export interface SpeechRecognitionMatch {
  transcript: string;
  isFinal: boolean;
}

function getSpeechRecognitionConstructor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

@Injectable({ providedIn: 'root' })
export class SpeechRecognitionService {
  private activeRecognition: SpeechRecognitionInstance | null = null;

  isSupported(): boolean {
    return getSpeechRecognitionConstructor() !== null;
  }

  start(options: {
    lang: string;
    onResult: (result: SpeechRecognitionMatch) => void;
    onError?: (message: string) => void;
    onEnd?: () => void;
  }): boolean {
    this.stop();

    const Constructor = getSpeechRecognitionConstructor();
    if (!Constructor) {
      options.onError?.('Голосовой ввод не поддерживается в этом браузере');
      return false;
    }

    const recognition = new Constructor();
    recognition.lang = options.lang;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 5;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        if (!result) {
          continue;
        }

        for (let altIndex = 0; altIndex < result.length; altIndex += 1) {
          const transcript = result[altIndex]?.transcript?.trim();
          if (!transcript) {
            continue;
          }

          options.onResult({
            transcript,
            isFinal: result.isFinal,
          });
        }
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'aborted' || event.error === 'no-speech') {
        return;
      }

      options.onError?.(this.describeError(event.error));
    };

    recognition.onend = () => {
      this.activeRecognition = null;
      options.onEnd?.();
    };

    this.activeRecognition = recognition;

    try {
      recognition.start();
      return true;
    } catch {
      this.activeRecognition = null;
      options.onError?.('Не удалось включить микрофон');
      return false;
    }
  }

  stop(): void {
    if (!this.activeRecognition) {
      return;
    }

    try {
      this.activeRecognition.abort();
    } catch {
      // Ignore abort errors when recognition already ended.
    }

    this.activeRecognition = null;
  }

  private describeError(code: string): string {
    switch (code) {
      case 'not-allowed':
      case 'service-not-allowed':
        return 'Нужно разрешить доступ к микрофону';
      case 'audio-capture':
        return 'Микрофон недоступен';
      case 'network':
        return 'Нужно подключение к интернету для распознавания речи';
      default:
        return 'Не удалось распознать речь';
    }
  }
}
