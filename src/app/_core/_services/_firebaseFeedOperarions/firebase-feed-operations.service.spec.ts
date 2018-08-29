import { TestBed, inject } from '@angular/core/testing';

import { FirebaseFeedOperationsService } from './firebase-feed-operations.service';

describe('FirebaseFeedOperationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirebaseFeedOperationsService]
    });
  });

  it('should be created', inject([FirebaseFeedOperationsService], (service: FirebaseFeedOperationsService) => {
    expect(service).toBeTruthy();
  }));
});
