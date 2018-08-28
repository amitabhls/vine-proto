import { TestBed, inject } from '@angular/core/testing';

import { IonicStorageService } from './ionic-storage.service';

describe('IonicStorageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IonicStorageService]
    });
  });

  it('should be created', inject([IonicStorageService], (service: IonicStorageService) => {
    expect(service).toBeTruthy();
  }));
});
