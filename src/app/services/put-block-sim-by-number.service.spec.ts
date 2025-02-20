import { TestBed } from '@angular/core/testing';

import { PutBlockSimByNumberService } from './put-block-sim-by-number.service';

describe('PutBlockSimByNumberService', () => {
  let service: PutBlockSimByNumberService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PutBlockSimByNumberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
