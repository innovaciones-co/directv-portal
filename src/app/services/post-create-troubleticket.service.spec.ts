import { TestBed } from '@angular/core/testing';

import { PostCreateTroubleticketService } from './post-create-troubleticket.service';

describe('PostCreateTroubleticketService', () => {
  let service: PostCreateTroubleticketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostCreateTroubleticketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
