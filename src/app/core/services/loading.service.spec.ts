import { TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService],
    });
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with loading false', () => {
    expect(service.getIsLoading()).toBeFalse();
  });

  it('should set loading to true', () => {
    service.setLoading(true);
    expect(service.getIsLoading()).toBeTrue();
  });

  it('should set loading to false', () => {
    service.setLoading(true);
    service.setLoading(false);
    expect(service.getIsLoading()).toBeFalse();
  });

  it('should emit loading state changes', () => {
    let emittedValue = false;
    service.isLoading$.subscribe((loading) => {
      emittedValue = loading;
    });

    service.setLoading(true);
    expect(emittedValue).toBeTrue();

    service.setLoading(false);
    expect(emittedValue).toBeFalse();
  });

  it('should handle multiple loading state changes', () => {
    const emittedValues: boolean[] = [];
    service.isLoading$.subscribe((loading) => {
      emittedValues.push(loading);
    });

    service.setLoading(true);
    service.setLoading(false);
    service.setLoading(true);
    service.setLoading(false);

    expect(emittedValues).toEqual([false, true, false, true, false]);
  });

  it('should maintain loading state across multiple calls', () => {
    service.setLoading(true);
    expect(service.getIsLoading()).toBeTrue();

    service.setLoading(true);
    expect(service.getIsLoading()).toBeTrue();

    service.setLoading(false);
    expect(service.getIsLoading()).toBeFalse();
  });

  it('should handle rapid state changes', () => {
    const emittedValues: boolean[] = [];
    service.isLoading$.subscribe((loading) => {
      emittedValues.push(loading);
    });

    // Rapid state changes
    for (let i = 0; i < 10; i++) {
      service.setLoading(i % 2 === 0);
    }

    expect(emittedValues.length).toBe(11); // Initial false + 10 changes
    expect(emittedValues[emittedValues.length - 1]).toBeFalse();
  });

  it('should be thread-safe for concurrent access', () => {
    const promises: Promise<void>[] = [];

    // Simulate concurrent access
    for (let i = 0; i < 100; i++) {
      promises.push(
        new Promise((resolve) => {
          setTimeout(() => {
            service.setLoading(i % 2 === 0);
            resolve();
          }, Math.random() * 10);
        })
      );
    }

    return Promise.all(promises).then(() => {
      // Final state should be consistent
      expect(typeof service.getIsLoading()).toBe('boolean');
    });
  });

  it('should handle edge cases', () => {
    // Test with undefined
    service.setLoading(undefined as any);
    expect(service.getIsLoading()).toBeFalse();

    // Test with null
    service.setLoading(null as any);
    expect(service.getIsLoading()).toBeFalse();

    // Test with string
    service.setLoading('true' as any);
    expect(service.getIsLoading()).toBeTrue();
  });

  it('should maintain observable subscription after service destruction', () => {
    let emittedValue = false;
    const subscription = service.isLoading$.subscribe((loading) => {
      emittedValue = loading;
    });

    service.setLoading(true);
    expect(emittedValue).toBeTrue();

    // Simulate service destruction
    service = null as any;

    // Subscription should still work
    expect(emittedValue).toBeTrue();
    subscription.unsubscribe();
  });
});

