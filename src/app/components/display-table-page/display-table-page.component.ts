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
  @Input() headers: any[] = [];
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
    private _fb: FormBuilder,
    private _notificationService: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.form = this.createForm();
    this.setNewTableInstance();
  }

  createForm(): FormGroup {
    return this._fb.group({
      columns: [this.columns, [Validators.required]],
    });
  }

  updateFormControls(action: 'add' | 'remove') {
    this.headers.forEach((item) => {
      if (action === 'add') {
        if (!this.form.contains(`${item}`)) {
          // Avoid duplicate addition
          this.form.addControl(`${item}`, new FormControl(false));
        }
      } else if (action === 'remove') {
        if (this.form.contains(`${item}`)) {
          this.form.removeControl(`${item}`);
        }
      }
    });
  }

  onSubmitSelection(event: Event) {
    event.preventDefault();
    let newColumns = this.form.controls['columns'].value;
    console.log(newColumns);

    if (!newColumns.length) {
      this._notificationService.warning(
        'Warning!',
        'You must choose at least one column before proceeding.'
      );
    } else {
      this.columns = [];
      this.columns = newColumns;
      this.setNewTableInstance();
    }
  }

  onColumnSelectionChange(column: string, event: any) {
    let existingValue = this.form.controls['columns'].value;
    if (event) {
      existingValue.push(column);
    } else {
      existingValue = existingValue.filter((c: any) => c !== column);
    }
    this.form.controls['columns'].setValue(existingValue);
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
        popover: true,
      };
      construedColumns.push(itemConfig);
    });
    this.tableConfig['columns'] = construedColumns;
  }

  loadPayloadChangedData(): void {
    const { offset, limit, sort_column, sort_order } = this.payload;
    let dataToDisplay = [...this.data];

    if (sort_column && sort_order) {
      dataToDisplay.sort((a, b) => {
        const valueA = a[sort_column];
        const valueB = b[sort_column];

        if (valueA === valueB) return 0;

        if (sort_order === 'asc') {
          return valueA > valueB ? 1 : -1;
        } else if (sort_order === 'desc') {
          return valueA < valueB ? 1 : -1;
        }

        return 0;
      });
    }
    this.tableData['rows'] = dataToDisplay.slice(offset, offset + limit);
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
    this.updateFormControls('remove');
    this.constructNewTableData();
    this.payload = { offset: 0, limit: Constants.PAGE_SIZE };
    this.tableConfig = null;
    this.tableData = [];
    this.constructDefaultConfig();
    this.constructTableConfig();

    this.loadPayloadChangedData();
    this.tableData['total'] = this.parsedData.length;

    this.constructForm();
    console.log(this.form);
  }

  constructNewTableData(): any {
    // Filter the data based on selected columns
    this.data = this.parsedData.map((row) => {
      let filteredRow: any = {};
      this.columns.forEach((col) => {
        filteredRow[col] = row[col];
      });
      return filteredRow;
    });
  }

  constructForm(): any {
    this.headers.forEach((item) => {
      const isChecked = this.columns.includes(item);

      if (!this.form.contains(item)) {
        this.form.addControl(item, new FormControl(isChecked));
      } else {
        this.form.get(item)?.setValue(isChecked);
      }
    });
  }

  goBack() {
    this.actionEmitter.emit({ action: 'back', value: null });
  }
}
