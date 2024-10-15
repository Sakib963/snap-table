import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from 'src/app/components/landing-page/landing-page.component';
import { DisplayTablePageComponent } from 'src/app/components/display-table-page/display-table-page.component';

@Component({
  selector: 'app-snap-table',
  standalone: true,
  imports: [CommonModule, LandingPageComponent, DisplayTablePageComponent],
  templateUrl: './snap-table.component.html',
  styleUrls: ['./snap-table.component.scss']
})
export class SnapTableComponent {
  isFileUploaded: boolean = false;
  parsedData: any[] = [];
  filteredData: any[] = []; // Store the filtered data based on user's selection
  selectedColumns: string[] = []; // To store the columns selected by the user

  handleActions(event: any) {
    if(event.action === 'file_upload') {
      this.parsedData = event.data; // Save the parsed data
    } else if (event.action === 'columns') {
      this.onColumnsSelected(event.data)
    }
  }

  // Receive the selected columns and filter the data accordingly
  onColumnsSelected(columns: any) {
    this.selectedColumns = columns;
    console.log(this.selectedColumns, 'selectedColumns');

    // Filter the data based on selected columns
    this.filteredData = this.parsedData.map(row => {
      let filteredRow: any = {};
      this.selectedColumns.forEach(col => {
        filteredRow[col] = row[col];
      });
      return filteredRow;
    });
    console.log(this.filteredData);
    this.isFileUploaded = true;
  }

  handleTableActions(event: any):any {
    if (event.action === 'back') {
      this.isFileUploaded = false;
    }
  }
}
