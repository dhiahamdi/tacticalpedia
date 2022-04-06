import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingGridComponent } from './training-grid.component';

describe('TrainingGridComponent', () => {
  let component: TrainingGridComponent;
  let fixture: ComponentFixture<TrainingGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrainingGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
