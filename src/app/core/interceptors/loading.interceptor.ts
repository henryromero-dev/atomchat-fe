import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';


let activeRequests = 0;

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

function shouldSkipLoading(req: HttpRequest<any>): boolean {
  // Skip loading for background requests or specific endpoints
  const skipLoadingEndpoints = [
    '/auth/refresh',
    '/health',
    '/ping',
  ];

  return skipLoadingEndpoints.some(endpoint => req.url.includes(endpoint));
}