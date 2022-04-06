import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDropzonePreviewComponent } from './custom-dropzone-preview.component';

describe('CustomDropzonePreviewComponent', () => {
  let component: CustomDropzonePreviewComponent;
  let fixture: ComponentFixture<CustomDropzonePreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomDropzonePreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDropzonePreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
