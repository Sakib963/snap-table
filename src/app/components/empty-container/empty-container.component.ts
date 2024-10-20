import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { Router } from '@angular/router';

@Component({
  selector: 'empty-container',
  standalone: true,
  imports: [CommonModule, NzEmptyModule],
  templateUrl: './empty-container.component.html',
  styleUrls: ['./empty-container.component.scss'],
})
export class EmptyContainerComponent {
  constructor(private _router: Router) {}

  reloadComponent(): void {
    const url = this._router.url;
    this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this._router.navigate([`/${url}`]);
    });
  }
}
