import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * LoadingService - Global loading state management service
 * 
 * This service provides a centralized way to manage loading states throughout
 * the application. It uses RxJS BehaviorSubject to provide reactive loading
 * state updates to components.
 * 
 * Features:
 * - Global loading state management
 * - Reactive state updates using observables
 * - Simple API for setting and getting loading state
 * - Used by HTTP interceptors and components
 * 
 * @example
 * ```typescript
 * // Inject the service
 * private readonly loadingService = inject(LoadingService);
 * 
 * // Set loading state
 * this.loadingService.setLoading(true);
 * 
 * // Get current loading state
 * const isLoading = this.loadingService.getLoading();
 * 
 * // Subscribe to loading state changes
 * this.loadingService.loading$.subscribe(isLoading => {
 *   console.log('Loading state:', isLoading);
 * });
 * ```
 */
@Injectable({
    providedIn: 'root',
})
export class LoadingService {
    /** BehaviorSubject for managing loading state */
    private readonly loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    
    /** Public observable for loading state changes */
    public readonly loading$: Observable<boolean> = this.loadingSubject.asObservable();

    /**
     * Sets the global loading state
     * @param loading - Loading state boolean
     */
    public setLoading(loading: boolean): void {
        this.loadingSubject.next(loading);
    }

    /**
     * Gets the current loading state
     * @returns Current loading state boolean
     */
    public getLoading(): boolean {
        return this.loadingSubject.value;
    }
}
