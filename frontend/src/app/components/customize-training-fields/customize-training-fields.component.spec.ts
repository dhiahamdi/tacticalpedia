import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeTrainingFieldsComponent } from './customize-training-fields.component';

describe('CustomizeTrainingFieldsComponent', () => {
  let component: CustomizeTrainingFieldsComponent;
  let fixture: ComponentFixture<CustomizeTrainingFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomizeTrainingFieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizeTrainingFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
