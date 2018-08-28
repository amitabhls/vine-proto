import { TestBed, inject } from '@angular/core/testing';

import { GetstreamService } from './getstream.service';

describe('GetstreamService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetstreamService]
    });
  });

  it('should be created', inject([GetstreamService], (service: GetstreamService) => {
    expect(service).toBeTruthy();
  }));
});
