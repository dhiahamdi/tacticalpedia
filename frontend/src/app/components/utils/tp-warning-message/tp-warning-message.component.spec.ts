import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TpWarningMessageComponent } from './tp-warning-message.component';

describe('TpWarningMessageComponent', () => {
  let component: TpWarningMessageComponent;
  let fixture: ComponentFixture<TpWarningMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TpWarningMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TpWarningMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
