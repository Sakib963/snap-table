import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Constants } from 'src/app/core/constants/constant';
import { TableComponent } from '../table/table.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgZorroCustomModule } from 'src/app/library/ng-zorro-custom/ng-zorro-custom.module';

@Component({
  selector: 'app-display-table-page',
  standalone: true,
  imports: [
    CommonModule,
    TableComponent,
    ReactiveFormsModule,
    NgZorroCustomModule,
  ],
  templateUrl: './display-table-page.component.html',
  styleUrls: ['./display-table-page.component.scss'],
})
export class DisplayTablePageComponent implements OnInit {
  @Input() parsedData: any[] = [];
  @Input() headers: string[] = [];
  @Input() data: any[] = [];
  @Input() columns: string[] = [];
  @Output() actionEmitter = new EventEmitter<any>();

  payload: any = { offset: 0, limit: Constants.PAGE_SIZE };
  tableConfig: any;
  tableData: any = [];
  filterConfig: any;
  isReset = false;
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notificationService: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.form = this.createForm();
    this.initializeTable();
  }

  createForm(): FormGroup {
    return this.fb.group({
      columns: [this.columns, [Validators.required]],
    });
  }

  // Form Controls for Each Header Based on Selection
  updateFormControls(action: 'add' | 'remove') {
    this.headers.forEach((item) => {
      const controlExists = this.form.contains(item);
      if (action === 'add' && !controlExists) {
        this.form.addControl(item, new FormControl(false));
      } else if (action === 'remove' && controlExists) {
        this.form.removeControl(item);
      }
    });
  }

  // Handle Column Selection and Submit
  onSubmitSelection(event: Event) {
    event.preventDefault();
    const selectedColumns = this.form.controls['columns'].value;

    if (!selectedColumns.length) {
      this.showWarning(
        'You must choose at least one column before proceeding.'
      );
    } else {
      this.columns = selectedColumns;
      this.initializeTable();
    }
  }

  // Column Selection Change Handler
  onColumnSelectionChange(column: string, isSelected: boolean) {
    let currentSelection = this.form.controls['columns'].value;
    currentSelection = isSelected
      ? [...currentSelection, column]
      : currentSelection.filter((c: string) => c !== column);
    this.form.controls['columns'].setValue(currentSelection);
  }

  // Construct Default and Dynamic Table Configuration
  initializeTable(): void {
    this.updateFormControls('remove');
    this.constructFilteredData();
    this.resetPayload();

    this.tableConfig = this.constructDefaultTableConfig();
    this.constructColumnConfig();

    this.refreshTableData();
    this.updateFormBasedOnColumns();
  }

  // Configure Default Table Settings
  constructDefaultTableConfig(): any {
    return {
      render_type: 'all',
      table_title: 'Csv To Table',
      page_size_option: [10, 20, 30, 50],
      filter_config: { filter_by: [] },
    };
  }

  // Add Dynamic Column Configuration for the Table
  constructColumnConfig(): void {
    this.tableConfig['columns'] = this.columns.map((item) => ({
      source_column: item,
      display_name: item,
      alignment: 'left',
      width: '120px',
      tooltip: true,
      sorting: true,
      column_type: 'text',
      popover: true,
    }));
  }

  // Slice or Sort Data Based on Payload
  loadPayloadChangedData(): void {
    const { offset, limit, sort_column, sort_order } = this.payload;
    let displayData = [...this.data];

    if (sort_column && sort_order) {
      displayData = this.sortData(displayData, sort_column, sort_order);
    }

    this.tableData['rows'] = displayData.slice(offset, offset + limit);
  }

  sortData(data: any[], column: string, order: string) {
    return data.sort((a, b) => {
      const [valueA, valueB] = [a[column], b[column]];
      if (valueA === valueB) return 0;
      return order === 'asc'
        ? valueA > valueB
          ? 1
          : -1
        : valueA < valueB
        ? 1
        : -1;
    });
  }

  executeQueryParamsChange(queryParams: any): void {
    this.payload = { ...this.payload, ...queryParams };
    this.loadPayloadChangedData();
  }

  executeRefresh(isRefresh: boolean): void {
    if (isRefresh) this.loadPayloadChangedData();
  }

  executeReset(isReset: boolean): void {
    if (isReset) {
      this.isReset = true;
      this.initializeTable();
    }
  }

  // Filter Data Based on Selected Columns
  constructFilteredData(): void {
    this.data = this.parsedData.map((row) =>
      this.columns.reduce((filteredRow: any, col) => {
        filteredRow[col] = row[col];
        return filteredRow;
      }, {})
    );
  }

  resetPayload() {
    this.payload = { offset: 0, limit: Constants.PAGE_SIZE };
  }

  refreshTableData() {
    this.loadPayloadChangedData();
    this.tableData['total'] = this.parsedData.length;
  }

  // Update Form Based on Current Column Selection
  updateFormBasedOnColumns(): void {
    this.headers.forEach((header) => {
      const isChecked = this.columns.includes(header);
      const control = this.form.get(header);

      if (control) {
        control.setValue(isChecked);
      } else {
        this.form.addControl(header, new FormControl(isChecked));
      }
    });
  }

  showWarning(message: string) {
    this.notificationService.warning('Warning!', message);
  }

  goBack() {
    this.actionEmitter.emit({ action: 'back' });
  }
}
