import { TestBed } from '@angular/core/testing';

import { GetCustomersBySubscriptionService } from './get-customers-by-subscription.service';

describe('GetCustomersBySubscriptionService', () => {
  let service: GetCustomersBySubscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetCustomersBySubscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
