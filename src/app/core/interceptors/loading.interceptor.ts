import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';

/** Counter for active HTTP requests */
let activeRequests = 0;

/**
 * LoadingInterceptor - HTTP interceptor for loading state management
 * 
 * This interceptor manages global loading states by tracking active HTTP requests.
 * It shows loading indicators during requests and hides them when all requests
 * are completed. It can skip loading for certain background requests.
 * 
 * Features:
 * - Global loading state management
 * - Request counting to handle multiple concurrent requests
 * - Skip loading for background requests
 * - Integration with LoadingService
 * - Automatic cleanup when requests complete
 * 
 * @param req - HTTP request object
 * @param next - Next handler in the interceptor chain
 * @returns Observable of HTTP response
 */
export function loadingInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> {
  const loadingService = inject(LoadingService);

  // Skip loading for certain requests
  if (shouldSkipLoading(req)) {
    return next(req);
  }

  activeRequests++;
  loadingService.setLoading(true);

  return next(req).pipe(
    finalize(() => {
      activeRequests--;
      if (activeRequests === 0) {
        loadingService.setLoading(false);
      }
    })
  );
}

/**
 * Determines if loading should be skipped for the given request
 * @param req - HTTP request object
 * @returns True if loading should be skipped
 */
function shouldSkipLoading(req: HttpRequest<any>): boolean {
  // Skip loading for background requests or specific endpoints
  const skipLoadingEndpoints = [
    '/auth/refresh',
    '/health',
    '/ping',
  ];

  return skipLoadingEndpoints.some(endpoint => req.url.includes(endpoint));
}