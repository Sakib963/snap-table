import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgZorroCustomModule } from 'src/app/library/ng-zorro-custom/ng-zorro-custom.module';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgZorroCustomModule,
  ],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit {
  @Output() actionEmitter = new EventEmitter<any>();
  isLoading: boolean = false;
  isFileReadingComplete: boolean = false;
  headers: string[] = [];
  selectedColumns: string[] = [];
  form!: FormGroup;

  @ViewChild('inputChanger', { read: ElementRef })
  fileInputChanger!: ElementRef;

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

  onUploadFile(event: any): void {
    let files = event.target?.files;
    if (!this.validateFile(files[0])) {
      return;
    }
    this.onFileChange(files[0]);
  }

  validateFile(file: File): boolean {
    if (file.type !== 'text/csv') {
      this.fileInputChanger.nativeElement.value = '';
      this._notificationService.warning('Warn!', 'File must be in CSV Format');
      return false;
    }
    return true;
  }

  // This method will be triggered when the user uploads a file
  onFileChange(file: any) {
    if (file) {
      this.isLoading = true;
      this.headers = [];

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const csvText = e.target.result;

        setTimeout(() => {
          const jsonData = this.csvToJson(csvText);

          // Extract the headers (keys) from the first object
          this.headers = Object.keys(jsonData[0]);
          this.updateFormControls('add');

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
    if (event) {
      existingValue.push(column);
    } else {
      existingValue = existingValue.filter((c: any) => c !== column);
    }
    this.form.controls['columns'].setValue(existingValue);
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
        headers: this.headers,
      });
    }
  }

  handleDifferentFileClick(): void {
    this.isFileReadingComplete = false;
    this.updateFormControls('remove');
    this.headers = [];
    this.selectedColumns = [];
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

  loadSampleFile(filePath: string): void {
    this.isFileReadingComplete = false;
    this.updateFormControls('remove');
    this.headers = [];
    this.selectedColumns = [];
    fetch(filePath)
      .then((response) => response.blob())
      .then((blob) => {
        const file = new File(
          [blob],
          filePath.split('/').pop() || 'sample.csv',
          { type: 'text/csv' }
        );
        this.onFileChange(file)
      })
      .catch(() => {
        this._notificationService.error(
          'Error!',
          'There was an error loading the file. Please try again.'
        );
      });
  }
}
