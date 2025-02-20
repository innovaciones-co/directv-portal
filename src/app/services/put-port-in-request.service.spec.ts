import { TestBed } from '@angular/core/testing';

import { PutPortInRequestService } from './put-port-in-request.service';

describe('PutPortInRequestService', () => {
  let service: PutPortInRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PutPortInRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
