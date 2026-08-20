import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { getCategoryById, isCategoryId } from '../../../core/data/categories';
import { CategoryItem } from '../../../core/models/category.model';
import { PictureMode, PICTURE_MODE_LABELS } from '../../../core/models/game-settings.model';
import { GameSettingsService } from '../../../core/services/game-settings.service';
import {
  getAvailablePictureModes,
  getCategoryItemPictureUrl,
} from '../../../core/utils/category-image';
import {
  areAllBlocksCorrect,
  areAllBlocksFilled,
  bankId,
  createWordBlocks,
  getBlockDropListIds,
  isSlotLetterCorrect,
  isSlotLetterWrong,
  LetterTile,
  parseContainerId,
  slotId,
  WordBlockState,
} from '../../../core/utils/word-builder';

type AnswerStatus = 'idle' | 'correct' | 'incorrect';

@Component({
  selector: 'app-build-word-play',
  imports: [RouterLink, MatButtonModule, MatButtonToggleModule, CdkDropList, CdkDrag],
  templateUrl: './build-word-play.html',
  styleUrl: './build-word-play.scss',
})
export class BuildWordPlay {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly settingsService = inject(GameSettingsService);

  readonly pictureModeLabels = PICTURE_MODE_LABELS;
  readonly bankId = bankId;
  readonly slotId = slotId;
  readonly getBlockDropListIds = getBlockDropListIds;

  private readonly categoryId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('categoryId') ?? '')),
    { initialValue: '' },
  );

  readonly category = computed(() => {
    const id = this.categoryId();
    return isCategoryId(id) ? getCategoryById(id) : undefined;
  });

  readonly currentIndex = signal(0);
  readonly answerStatus = signal<AnswerStatus>('idle');
  readonly isCompleted = signal(false);
  readonly layoutVersion = signal(0);
  readonly hintVisible = signal(false);
  readonly pictureLoadFailed = signal(false);

  readonly pictureMode = computed(() => this.settingsService.settings().pictureMode);

  readonly availablePictureModes = computed(() => {
    const category = this.category();
    return category ? getAvailablePictureModes(category.id) : ['emoji' as PictureMode];
  });

  readonly showPictureModeToggle = computed(() => this.availablePictureModes().length > 1);

  readonly currentPictureUrl = computed(() => {
    const category = this.category();
    const item = this.currentItem();
    if (!category || !item) {
      return null;
    }

    return getCategoryItemPictureUrl(category.id, item.id, this.pictureMode());
  });

  readonly usePicture = computed(
    () => this.pictureMode() !== 'emoji' && !!this.currentPictureUrl() && !this.pictureLoadFailed(),
  );

  wordBlocks: WordBlockState[] = [];

  readonly currentItem = computed<CategoryItem | undefined>(() => {
    const category = this.category();
    if (!category) {
      return undefined;
    }

    return category.items[this.currentIndex()];
  });

  readonly progressLabel = computed(() => {
    const category = this.category();
    if (!category) {
      return '';
    }

    return `${this.currentIndex() + 1} / ${category.items.length}`;
  });

  readonly progressPercent = computed(() => {
    const category = this.category();
    if (!category || category.items.length === 0) {
      return 0;
    }

    return ((this.currentIndex() + 1) / category.items.length) * 100;
  });

  constructor() {
    effect(() => {
      const item = this.currentItem();
      const completed = this.isCompleted();

      if (!item || completed) {
        return;
      }

      untracked(() => this.setupRound(item));
    });
  }

  onTileClick(tile: LetterTile, blockIndex: number): void {
    if (this.answerStatus() === 'correct') {
      return;
    }

    const block = this.wordBlocks[blockIndex];
    const emptyIndex = block.slotDropData.findIndex((slot) => slot.length === 0);
    if (emptyIndex === -1) {
      return;
    }

    this.placeTileInSlot(tile, blockIndex, emptyIndex, bankId(blockIndex));
  }

  onSlotClick(blockIndex: number, slotIndex: number): void {
    if (this.answerStatus() === 'correct') {
      return;
    }

    if (this.wordBlocks[blockIndex]?.slotDropData[slotIndex]?.length !== 1) {
      return;
    }

    this.returnTileToBank(blockIndex, slotIndex);
  }

  onDrop(event: CdkDragDrop<LetterTile[]>): void {
    if (this.answerStatus() === 'correct') {
      return;
    }

    const target = parseContainerId(event.container.id);
    const source = parseContainerId(event.previousContainer.id);
    if (!target || !source) {
      return;
    }

    if (target.blockIndex !== source.blockIndex) {
      return;
    }

    if (event.previousContainer === event.container) {
      if (target.kind === 'bank') {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      }
      return;
    }

    const draggedTile = event.previousContainer.data[event.previousIndex];
    if (!draggedTile) {
      return;
    }

    if (target.kind === 'bank' && source.kind === 'slot') {
      this.returnTileToBank(source.blockIndex, source.slotIndex!);
      return;
    }

    if (target.kind === 'slot' && source.kind === 'bank') {
      this.placeTileInSlot(
        draggedTile,
        target.blockIndex,
        target.slotIndex!,
        event.previousContainer.id,
      );
      return;
    }

    if (target.kind === 'slot' && source.kind === 'slot') {
      this.placeTileInSlot(
        draggedTile,
        target.blockIndex,
        target.slotIndex!,
        event.previousContainer.id,
      );
    }
  }

  nextTask(): void {
    const category = this.category();
    if (!category) {
      return;
    }

    const nextIndex = this.currentIndex() + 1;
    if (nextIndex >= category.items.length) {
      this.isCompleted.set(true);
      return;
    }

    this.currentIndex.set(nextIndex);
  }

  restartCategory(): void {
    this.currentIndex.set(0);
    this.isCompleted.set(false);
    this.answerStatus.set('idle');
  }

  goBackToCategories(): void {
    const category = this.category();
    if (!category) {
      void this.router.navigate(['/categories']);
      return;
    }

    void this.router.navigate(['/categories', category.id]);
  }

  toggleHint(): void {
    this.hintVisible.update((visible) => !visible);
  }

  setPictureMode(mode: PictureMode | null): void {
    if (!mode) {
      return;
    }

    this.settingsService.update({ pictureMode: mode });
    this.pictureLoadFailed.set(false);
  }

  onPictureError(): void {
    this.pictureLoadFailed.set(true);
  }

  isSlotCorrect(blockIndex: number, slotIndex: number): boolean {
    this.layoutVersion();

    const block = this.wordBlocks[blockIndex];
    if (!block) {
      return false;
    }

    return isSlotLetterCorrect(block, slotIndex);
  }

  isSlotWrong(blockIndex: number, slotIndex: number): boolean {
    this.layoutVersion();

    const block = this.wordBlocks[blockIndex];
    if (!block) {
      return false;
    }

    return isSlotLetterWrong(block, slotIndex);
  }

  private setupRound(item: CategoryItem): void {
    this.wordBlocks = createWordBlocks(item.blocks);
    this.answerStatus.set('idle');
    this.hintVisible.set(false);
    this.pictureLoadFailed.set(false);
    this.bumpLayout();
  }

  private bumpLayout(): void {
    this.layoutVersion.update((version) => version + 1);
    this.evaluateAnswerIfComplete();
  }

  private evaluateAnswerIfComplete(): void {
    if (this.answerStatus() === 'correct') {
      return;
    }

    if (!areAllBlocksFilled(this.wordBlocks)) {
      this.answerStatus.set('idle');
      return;
    }

    this.answerStatus.set(areAllBlocksCorrect(this.wordBlocks) ? 'correct' : 'incorrect');
  }

  private placeTileInSlot(
    tile: LetterTile,
    blockIndex: number,
    slotIndex: number,
    fromContainerId: string,
  ): void {
    const block = this.wordBlocks[blockIndex];
    const source = parseContainerId(fromContainerId);
    if (!block || !source || source.blockIndex !== blockIndex) {
      return;
    }

    if (source.kind === 'bank') {
      const bankIndex = block.bank.findIndex((item) => item.id === tile.id);
      if (bankIndex !== -1) {
        block.bank.splice(bankIndex, 1);
      }
    } else if (source.kind === 'slot') {
      block.slotDropData[source.slotIndex!] = [];
    }

    const replacedTile = block.slotDropData[slotIndex][0];
    if (replacedTile) {
      block.bank.push(replacedTile);
    }

    block.slotDropData[slotIndex] = [tile];
    this.bumpLayout();
  }

  private returnTileToBank(blockIndex: number, slotIndex: number): void {
    const block = this.wordBlocks[blockIndex];
    const tile = block?.slotDropData[slotIndex]?.[0];
    if (!block || !tile) {
      return;
    }

    block.slotDropData[slotIndex] = [];
    block.bank.push(tile);
    this.bumpLayout();
  }
}
