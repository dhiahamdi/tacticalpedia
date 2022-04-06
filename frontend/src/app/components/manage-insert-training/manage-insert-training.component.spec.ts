import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageInsertTrainingComponent } from './manage-insert-training.component';

describe('ManageInsertTrainingComponent', () => {
  let component: ManageInsertTrainingComponent;
  let fixture: ComponentFixture<ManageInsertTrainingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageInsertTrainingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageInsertTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
