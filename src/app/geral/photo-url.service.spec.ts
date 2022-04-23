import { TestBed } from '@angular/core/testing';

import { PhotoUrlService } from './photo-url.service';

describe('PhotoUrlService', () => {
  let service: PhotoUrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotoUrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
