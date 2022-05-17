import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupLibraryComponent } from './group-library.component';

describe('GroupLibraryComponent', () => {
  let component: GroupLibraryComponent;
  let fixture: ComponentFixture<GroupLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupLibraryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
