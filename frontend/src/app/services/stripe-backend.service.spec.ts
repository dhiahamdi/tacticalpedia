import { TestBed } from '@angular/core/testing';

import { StripeBackendService } from './stripe-backend.service';

describe('StripeBackendService', () => {
  let service: StripeBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StripeBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
