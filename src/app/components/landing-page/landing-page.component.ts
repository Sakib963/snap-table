import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  isLoading: boolean = false;
  isFileReadingComplete: boolean = false;
  headers: string[] = [];
  selectedColumns: string[] = [];

  form!: FormGroup;

  fileUploadAnimationUrl: any;

  @Output() actionEmitter = new EventEmitter<any>();

  constructor(
    private _fb: FormBuilder,
    private _notificationService: NzNotificationService
  ) {}

  ngOnInit(): void {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this._fb.group({
      columns: [[], [Validators.required]],
    });
  }

  // This method will be triggered when the user uploads a file
  onFileChange(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.isLoading = true;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const csvText = e.target.result;

        setTimeout(() => {
          const jsonData = this.csvToJson(csvText);

          // Extract the headers (keys) from the first object
          this.headers = Object.keys(jsonData[0]);

          this.isLoading = false;
          this.isFileReadingComplete = true;
          this.actionEmitter.emit({ action: 'file_upload', data: jsonData });
        }, 2000);
      };

      reader.onerror = (error) => {
        this._notificationService.error(
          'Error!',
          'There was an error reading the file. Please try again.'
        );
        this.isLoading = false;
        this.isFileReadingComplete = false;
      };

      reader.readAsText(file);
    }
  }

  // Function to convert CSV string to JSON
  csvToJson(csv: string): any[] {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');

    const jsonData = lines.slice(1).map((line) => {
      const values = line.split(',');
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header.trim()] = values[index]?.trim();
      });
      return obj;
    });

    return jsonData;
  }

  // Event handler for checkbox change
  onColumnSelectionChange(column: string, event: any) {
    let existingValue = this.form.controls['columns'].value;
    if (event.target.checked) {
      existingValue.push(column);
      this.form.controls['columns'].setValue(existingValue);
    } else {
      existingValue = existingValue.filter((c: any) => c !== column);
    }
  }

  // Finalize the columns and emit the filtered data
  onSubmitSelection(event: Event) {
    event.preventDefault();
    let columns = this.form.controls['columns'].value;
    if (!columns.length) {
      this._notificationService.warning(
        'Warning!',
        'You must choose at least one column before proceeding.'
      );
    } else {
      this.actionEmitter.emit({
        action: 'columns',
        data: this.form.controls['columns'].value,
        headers: this.headers
      });
    }
  }

  updateAllChecked(): void {
    // this.indeterminate = false;
  }
}
