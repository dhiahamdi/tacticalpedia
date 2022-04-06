import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertDraftComponent } from './insert-draft.component';

describe('InsertDraftComponent', () => {
  let component: InsertDraftComponent;
  let fixture: ComponentFixture<InsertDraftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsertDraftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
