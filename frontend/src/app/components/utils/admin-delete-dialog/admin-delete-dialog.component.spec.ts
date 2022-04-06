import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDeleteDialogComponent } from './admin-delete-dialog.component';

describe('AdminDeleteDialogComponent', () => {
  let component: AdminDeleteDialogComponent;
  let fixture: ComponentFixture<AdminDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDeleteDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
