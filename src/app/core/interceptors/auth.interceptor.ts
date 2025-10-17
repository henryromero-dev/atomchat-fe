import { HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';

import { AuthApplicationService } from '../../application/services';

/**
 * AuthInterceptor - HTTP interceptor for authentication
 * 
 * This interceptor automatically adds authentication headers to HTTP requests
 * and handles authentication-related errors. It skips authentication for
 * login/register endpoints and automatically logs out users on 401 errors.
 * 
 * Features:
 * - Automatic token injection in request headers
 * - Skips authentication for auth endpoints
 * - Handles 401 errors by logging out user
 * - Integrates with AuthApplicationService
 * 
 * @param req - HTTP request object
 * @param next - Next handler in the interceptor chain
 * @returns Observable of HTTP response
 */
export function authInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> {
  const authApplicationService = inject(AuthApplicationService);

  // Skip auth for login/register endpoints
  if (isAuthEndpoint(req.url)) {
    return next(req);
  }

  // Add auth token to request
  const authReq = addAuthHeader(req, authApplicationService);

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expired or invalid, logout user
        authApplicationService.logout();
      }
      return throwError(() => error);
    })
  );
}

/**
 * Checks if the request URL is an authentication endpoint
 * @param url - Request URL to check
 * @returns True if the URL is an auth endpoint
 */
function isAuthEndpoint(url: string): boolean {
  return url.includes('/auth/login') || url.includes('/auth/register');
}

/**
 * Adds authentication header to the HTTP request
 * @param req - HTTP request object
 * @param authApplicationService - Authentication service instance
 * @returns HTTP request with authentication header
 */
function addAuthHeader(req: HttpRequest<any>, authApplicationService: AuthApplicationService): HttpRequest<any> {
  const token = authApplicationService.getToken();
  if (token) {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return req;
}
