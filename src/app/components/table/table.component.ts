import {
  Component,
  ContentChild,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { EmptyContainerComponent } from '../empty-container/empty-container.component';
import { Constants } from 'src/app/core/constants/constant';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzToolTipModule,
    NzIconModule,
    NzDividerModule,
    NzButtonModule,
    NzDropDownModule,
    EmptyContainerComponent,
    NzPopoverModule,
  ],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent {
  offset = 0;
  pageIndex = 1;
  pageSize = Constants.PAGE_SIZE;
  sortOrder: any = null;
  queryLoading: boolean = false;

  @Input() tableData: any;
  @Input() tableConfig: any;

  @Output() readonly actionEmitter: EventEmitter<Object> = new EventEmitter(
    undefined
  );
  @Output() readonly queryParamsEmitter: EventEmitter<Object> =
    new EventEmitter(undefined);
  @Output() readonly refreshEmitter: EventEmitter<boolean> = new EventEmitter(
    false
  );
  @Output() readonly resetEmitter: EventEmitter<boolean> = new EventEmitter(
    false
  );
  @ContentChild('filter') filter!: TemplateRef<any>;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _destroyRef: DestroyRef,
  ) {
    const state$ = this._activatedRoute.paramMap.pipe(
      map(() => window.history.state)
    );
    state$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((res: any) => {
      if (res.offset && res.pageIndex && res.pageSize) {
        this.offset = res.offset;
        this.pageIndex = res.pageIndex;
        this.pageSize = res.pageSize;
      }
    });
  }

  getActionAccordingToStatus(action: any, row: any): boolean {
    return action.status ? action.status.includes(row.status) : true;
  }

  getTextColorAccordionToStatus(
    textColor: any,
    status: string
  ): { color: string } | null {
    let code = textColor.find(
      (element: any) => element?.name === status
    )?.color;
    return code ? { color: code } : null;
  }

  getTooltipTitle(column: any, row: any): string | null {
    if (column['column_type'] === 'translate') {
      let source_column = row[`${column['source_column']}`];
      return column.tooltip ? source_column : null;
    } else {
      return column.tooltip ? row[column['source_column']] : null;
    }
  }

  getPopoverTitle(column: any): string {
    return column.popover ? column.display_name : '';
  }

  onAction(action: string, data: any): void {
    this.actionEmitter.emit({
      action: this.extractActionName(action),
      data: data,
    });
  }

  onQueryParamsChange(
    params: any,
    type: string,
    source_column?: string,
    column_type?: string
  ): void {
    let sort_column = source_column;
    if (column_type === 'translate') {
      sort_column = `${source_column}`;
    }
    this.queryLoading = true;
    setTimeout(() => {
      this.queryLoading = false;
    }, 500);

    if (type === 'page_size') {
      this.pageSize = params;
    } else if (type === 'page_index') {
      this.pageIndex = params;
    } else if (type === 'sort_order') {
      switch (params) {
        case 'ascend':
          this.sortOrder = 'asc';
          break;
        case 'descend':
          this.sortOrder = 'desc';
          break;
        default:
          this.sortOrder = null;
          break;
      }
    }
    this.offset = (this.pageIndex - 1) * this.pageSize;
    window.history.pushState(
      {
        ...window.history.state,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        offset: this.offset,
      },
      ''
    );
    this.queryParamsEmitter.emit({
      offset: (this.pageIndex - 1) * this.pageSize,
      limit: this.pageSize,
      sort_column,
      sort_order: this.sortOrder,
    });
  }

  onRefresh(): void {
    this.refreshEmitter.emit(true);
  }

  onReset(): void {
    this.offset = 0;
    this.pageIndex = 1;
    this.pageSize = Constants.PAGE_SIZE;
    window.history.pushState(
      {
        ...window.history.state,
        pageSize: this.pageSize,
        pageIndex: this.pageIndex,
        offset: this.offset,
      },
      ''
    );
    this.resetEmitter.emit(true);
  }

  extractActionName(actionKey: string): string {
    const parts = actionKey.split('.');
    const action = parts[parts.length - 1];
    return action.charAt(0).toUpperCase() + action.slice(1).toLowerCase();
  }
}
