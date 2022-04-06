import { TestBed } from '@angular/core/testing';

import { TrainingCustomizeService } from './training-customize.service';

describe('TrainingCustomizeService', () => {
  let service: TrainingCustomizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingCustomizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
