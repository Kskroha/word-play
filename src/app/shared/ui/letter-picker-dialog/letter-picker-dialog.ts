import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface LetterPickerDialogData {
  letters: readonly string[];
  currentIndex: number;
}

@Component({
  selector: 'app-letter-picker-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './letter-picker-dialog.html',
  styleUrl: './letter-picker-dialog.scss',
})
export class LetterPickerDialog {
  private readonly dialogRef = inject(MatDialogRef<LetterPickerDialog, number>);
  readonly data = inject<LetterPickerDialogData>(MAT_DIALOG_DATA);

  selectLetter(index: number): void {
    this.dialogRef.close(index);
  }

  close(): void {
    this.dialogRef.close();
  }
}
