import { HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';

import { AuthApplicationService } from '../../application/services';

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

function isAuthEndpoint(url: string): boolean {
  return url.includes('/auth/login') || url.includes('/auth/register');
}

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
