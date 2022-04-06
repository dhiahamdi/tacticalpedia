import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupsLibraryComponent } from './groups-library.component';

describe('GroupsLibraryComponent', () => {
  let component: GroupsLibraryComponent;
  let fixture: ComponentFixture<GroupsLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupsLibraryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupsLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
