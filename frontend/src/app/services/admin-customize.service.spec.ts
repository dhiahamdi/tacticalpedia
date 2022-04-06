import { TestBed } from '@angular/core/testing';

import { AdminCustomizeService } from './admin-customize.service';

describe('AdminCustomizeService', () => {
  let service: AdminCustomizeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminCustomizeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
