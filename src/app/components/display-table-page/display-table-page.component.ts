import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-display-table-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './display-table-page.component.html',
  styleUrls: ['./display-table-page.component.scss'],
})
export class DisplayTablePageComponent implements OnInit {
  @Input() parsedData: any[] = [];
  @Input() headers: any[] = [];
  @Input() data: any[] = [];
  @Input() columns: string[] = [];
  @Output() actionEmitter = new EventEmitter<any>();

  ngOnInit(): void {
    console.log(this.parsedData, 'parsedData');
    console.log(this.headers, 'headers');
    console.log(this.data, 'data');
    console.log(this.columns, 'columns');
  }

  // Method to go back to the previous page
  goBack() {
    this.actionEmitter.emit({ action: 'back', value: null });
  }
}
