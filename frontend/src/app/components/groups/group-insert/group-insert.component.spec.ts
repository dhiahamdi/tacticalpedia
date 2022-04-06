import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupInsertComponent } from './group-insert.component';

describe('GroupInsertComponent', () => {
  let component: GroupInsertComponent;
  let fixture: ComponentFixture<GroupInsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupInsertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
