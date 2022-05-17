import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSubscriptionComponent } from './group-subscription.component';

describe('GroupSubscriptionComponent', () => {
  let component: GroupSubscriptionComponent;
  let fixture: ComponentFixture<GroupSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupSubscriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
