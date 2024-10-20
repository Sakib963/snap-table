import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyContainerComponent } from './empty-container.component';

describe('EmptyContainerComponent', () => {
  let component: EmptyContainerComponent;
  let fixture: ComponentFixture<EmptyContainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmptyContainerComponent]
    });
    fixture = TestBed.createComponent(EmptyContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
