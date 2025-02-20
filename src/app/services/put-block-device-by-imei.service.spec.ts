import { TestBed } from '@angular/core/testing';

import { PutBlockDeviceByImeiService } from './put-block-device-by-imei.service';

describe('PutBlockDeviceByImeiService', () => {
  let service: PutBlockDeviceByImeiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PutBlockDeviceByImeiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
