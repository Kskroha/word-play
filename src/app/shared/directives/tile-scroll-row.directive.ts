import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
} from '@angular/core';

@Directive({
  selector: '[appTileScrollRow]',
  standalone: true,
})
export class TileScrollRowDirective {
  private readonly host = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly destroyRef = inject(DestroyRef);
  private trackEl: HTMLDivElement | null = null;
  private thumbEl: HTMLDivElement | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private mutationObserver: MutationObserver | null = null;

  constructor() {
    afterNextRender(() => {
      this.ensureTrack();
      this.refresh();

      this.host.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onResize, { passive: true });

      this.resizeObserver = new ResizeObserver(() => this.refresh());
      this.resizeObserver.observe(this.host);

      this.mutationObserver = new MutationObserver(() => this.refresh());
      this.mutationObserver.observe(this.host, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    });

    this.destroyRef.onDestroy(() => {
      this.host.removeEventListener('scroll', this.onScroll);
      window.removeEventListener('resize', this.onResize);
      this.resizeObserver?.disconnect();
      this.mutationObserver?.disconnect();
    });
  }

  private readonly onScroll = (): void => {
    this.updateThumb();
  };

  private readonly onResize = (): void => {
    this.refresh();
  };

  private ensureTrack(): void {
    if (this.trackEl) {
      return;
    }

    this.trackEl = document.createElement('div');
    this.trackEl.className = 'play-tile-scroll-row__track';
    this.trackEl.setAttribute('aria-hidden', 'true');

    this.thumbEl = document.createElement('div');
    this.thumbEl.className = 'play-tile-scroll-row__track-thumb';
    this.trackEl.appendChild(this.thumbEl);
    this.host.appendChild(this.trackEl);
  }

  private refresh(): void {
    const { scrollWidth, clientWidth } = this.host;
    const scrollable = scrollWidth > clientWidth + 2;
    this.host.classList.toggle('is-scrollable', scrollable);

    if (!scrollable) {
      return;
    }

    this.updateThumb();
  }

  private updateThumb(): void {
    if (!this.thumbEl) {
      return;
    }

    const { scrollWidth, clientWidth, scrollLeft } = this.host;
    if (scrollWidth <= clientWidth + 2) {
      return;
    }

    const thumbWidth = Math.max((clientWidth / scrollWidth) * 100, 14);
    const maxScroll = scrollWidth - clientWidth;
    const scrollRatio = maxScroll > 0 ? scrollLeft / maxScroll : 0;
    const travel = 100 - thumbWidth;

    this.thumbEl.style.width = `${thumbWidth}%`;
    this.thumbEl.style.marginLeft = `${scrollRatio * travel}%`;
  }
}
