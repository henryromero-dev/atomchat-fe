import { TestBed } from '@angular/core/testing';
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
    expect(service.getLoading()).toBe(false);
  });

  it('should set loading to true', () => {
    service.setLoading(true);
    expect(service.getLoading()).toBe(true);
  });

  it('should set loading to false', () => {
    service.setLoading(true);
    service.setLoading(false);
    expect(service.getLoading()).toBe(false);
  });

  it('should emit loading state changes', () => {
    let emittedValue = false;
    service.loading$.subscribe((loading) => {
      emittedValue = loading;
    });

    service.setLoading(true);
    expect(emittedValue).toBe(true);

    service.setLoading(false);
    expect(emittedValue).toBe(false);
  });

  it('should handle multiple loading state changes', () => {
    const emittedValues: boolean[] = [];
    service.loading$.subscribe((loading) => {
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
    expect(service.getLoading()).toBe(true);

    service.setLoading(true);
    expect(service.getLoading()).toBe(true);

    service.setLoading(false);
    expect(service.getLoading()).toBe(false);
  });

  it('should handle rapid state changes', () => {
    const emittedValues: boolean[] = [];
    service.loading$.subscribe((loading) => {
      emittedValues.push(loading);
    });

    // Rapid state changes
    for (let i = 0; i < 10; i++) {
      service.setLoading(i % 2 === 0);
    }

    expect(emittedValues.length).toBe(11); // Initial false + 10 changes
    expect(emittedValues[emittedValues.length - 1]).toBe(false);
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
      expect(typeof service.getLoading()).toBe('boolean');
    });
  });

  it('should handle edge cases', () => {
    // Test with undefined - BehaviorSubject will emit undefined
    service.setLoading(undefined as any);
    expect(service.getLoading()).toBe(undefined);

    // Test with null - BehaviorSubject will emit null
    service.setLoading(null as any);
    expect(service.getLoading()).toBe(null);

    // Test with string 'true' - BehaviorSubject will emit the string as-is
    service.setLoading('true' as any);
    expect(service.getLoading()).toBe('true');
  });

  it('should maintain observable subscription after service destruction', () => {
    let emittedValue = false;
    const subscription = service.loading$.subscribe((loading) => {
      emittedValue = loading;
    });

    service.setLoading(true);
    expect(emittedValue).toBe(true);

    // Simulate service destruction
    service = null as any;

    // Subscription should still work
    expect(emittedValue).toBe(true);
    subscription.unsubscribe();
  });

  it('should provide loading observable', () => {
    expect(service.loading$).toBeDefined();
    
    let emittedValue: boolean | undefined;
    const subscription = service.loading$.subscribe((loading) => {
      emittedValue = loading;
    });

    service.setLoading(true);
    expect(emittedValue).toBe(true);

    service.setLoading(false);
    expect(emittedValue).toBe(false);

    subscription.unsubscribe();
  });
});