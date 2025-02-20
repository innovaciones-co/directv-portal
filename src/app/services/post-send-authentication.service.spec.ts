import { TestBed } from '@angular/core/testing';

import { PostSendAuthenticationService } from './post-send-authentication.service';

describe('PostSendAuthenticationService', () => {
  let service: PostSendAuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostSendAuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
