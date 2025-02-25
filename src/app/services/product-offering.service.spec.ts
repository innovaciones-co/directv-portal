import { TestBed } from '@angular/core/testing';

import { ProductOfferingService } from './product-offering.service';

describe('ProductOfferingService', () => {
  let service: ProductOfferingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductOfferingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
