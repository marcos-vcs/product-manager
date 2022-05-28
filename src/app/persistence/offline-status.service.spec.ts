import { TestBed } from '@angular/core/testing';

import { OfflineStatusService } from './offline-status.service';

describe('OfflineStatusService', () => {
  let service: OfflineStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
