import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayTablePageComponent } from './display-table-page.component';

describe('DisplayTablePageComponent', () => {
  let component: DisplayTablePageComponent;
  let fixture: ComponentFixture<DisplayTablePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DisplayTablePageComponent]
    });
    fixture = TestBed.createComponent(DisplayTablePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
