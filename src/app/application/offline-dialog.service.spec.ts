import { TestBed } from '@angular/core/testing';

import { OfflineDialogService } from './offline-dialog.service';

describe('OfflineDialogService', () => {
  let service: OfflineDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
