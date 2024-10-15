import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnapTableComponent } from './snap-table.component';

describe('SnapTableComponent', () => {
  let component: SnapTableComponent;
  let fixture: ComponentFixture<SnapTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SnapTableComponent]
    });
    fixture = TestBed.createComponent(SnapTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
