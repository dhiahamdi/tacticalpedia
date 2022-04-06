import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCustomizeComponent } from './admin-customize.component';

describe('AdminCustomizeComponent', () => {
  let component: AdminCustomizeComponent;
  let fixture: ComponentFixture<AdminCustomizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminCustomizeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCustomizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
