import { TestBed } from '@angular/core/testing';

import { GetNetworkOperatorService } from './get-network-operator-code.service';

describe('GetNetworkOperatorCodeService', () => {
  let service: GetNetworkOperatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetNetworkOperatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
