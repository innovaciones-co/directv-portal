import { TestBed } from '@angular/core/testing';

import { GetToubleticketCategoriesService } from './get-toubleticket-categories.service';

describe('GetToubleticketCategoriesService', () => {
  let service: GetToubleticketCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetToubleticketCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
