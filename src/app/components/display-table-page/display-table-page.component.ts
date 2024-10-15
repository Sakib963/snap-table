import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-display-table-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display-table-page.component.html',
  styleUrls: ['./display-table-page.component.scss'],
})
export class DisplayTablePageComponent {
  @Input() data: any[] = [];
  @Input() columns: string[] = [];
  @Output() actionEmitter = new EventEmitter<any>();
  // Method to move a column up
  moveColumnUp(index: number) {
    if (index > 0) {
      const temp = this.columns[index];
      this.columns[index] = this.columns[index - 1];
      this.columns[index - 1] = temp;
    }
  }

  // Method to move a column down
  moveColumnDown(index: number) {
    if (index < this.columns.length - 1) {
      const temp = this.columns[index];
      this.columns[index] = this.columns[index + 1];
      this.columns[index + 1] = temp;
    }
  }

  // Method to go back to the previous page
  goBack() {
    this.actionEmitter.emit({ action: 'back', value: null });
  }
}
