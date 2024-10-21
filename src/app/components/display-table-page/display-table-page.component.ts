import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Constants } from 'src/app/core/constants/constant';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-display-table-page',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './display-table-page.component.html',
  styleUrls: ['./display-table-page.component.scss'],
})
export class DisplayTablePageComponent implements OnInit {
  @Input() parsedData: any[] = [];
  @Input() headers: any[] = [];
  @Input() data: any[] = [];
  @Input() columns: string[] = [];
  @Output() actionEmitter = new EventEmitter<any>();

  payload: any = { offset: 0, limit: Constants.PAGE_SIZE };
  tableConfig: any;
  tableData: any = [];
  filterConfig: any;
  isReset = false;

  ngOnInit(): void {
    // console.log(this.parsedData, 'parsedData');
    // console.log(this.headers, 'headers');
    // console.log(this.columns, 'columns');
    this.setNewTableInstance();
  }

  constructDefaultConfig(): any {
    this.tableConfig = {
        render_type: 'all',
        table_title: 'Csv To Table',
        page_size_option: [10, 20, 30, 50],
        filter_config: {
          filter_by: [],
        },
    };
  }

  constructTableConfig(): any {
    let construedColumns: any = [];
    this.columns.map((item: any) => {
      let itemConfig = {
        source_column: item,
        display_name: item,
        alignment: 'left',
        width: '120px',
        tooltip: true,
        sorting: true,
        column_type: 'text',
        popover: true
      };
      construedColumns.push(itemConfig);
    });
    this.tableConfig['columns'] = construedColumns;
  }

  loadPayloadChangedData(): any {
    const { offset, limit } = this.payload;
    this.tableData['rows'] = this.data.slice(offset, offset + limit);
  }

  executeQueryParamsChange(queryParams: any): void {
    console.log(queryParams, 'executeQueryParamsChange');

    this.payload = { ...this.payload, ...queryParams };
    this.loadPayloadChangedData();
  }

  executeRefresh(isRefresh: boolean): void {
    isRefresh && this.loadPayloadChangedData();
  }

  executeReset(isReset: boolean): void {
    if (isReset) {
      this.isReset = true;
      this.setNewTableInstance();
    }
  }

  setNewTableInstance(): any {
    this.payload = { offset: 0, limit: Constants.PAGE_SIZE };
    this.tableConfig = null;
    this.tableData = [];
    this.constructDefaultConfig();
    this.constructTableConfig();

    this.loadPayloadChangedData();
    this.tableData['total'] = this.parsedData.length;
  }

  // Method to go back to the previous page
  goBack() {
    this.actionEmitter.emit({ action: 'back', value: null });
  }
}
