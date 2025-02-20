import { TestBed } from '@angular/core/testing';

import { QueryImeiService } from './query-imei.service';

describe('QueryImeiService', () => {
  let service: QueryImeiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QueryImeiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
