import { HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';

import { MessageService } from 'primeng/api';

export function errorInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      handleError(error, messageService);
      return throwError(() => error);
    })
  );
}

function handleError(error: HttpErrorResponse, messageService: MessageService): void {
  let errorMessage = 'An unexpected error occurred';
  let severity: 'error' | 'warn' | 'info' | 'success' = 'error';

  if (error.error instanceof ErrorEvent) {
    // Client-side error
    errorMessage = `Client Error: ${error.error.message}`;
  } else {
    // Server-side error
    const status = error.status;
    const serverError = error.error;

    switch (status) {
      case 400:
        errorMessage = serverError?.message || 'Bad Request';
        severity = 'warn';
        break;
      case 401:
        errorMessage = 'Unauthorized. Please log in again.';
        break;
      case 403:
        errorMessage = 'Forbidden. You do not have permission to perform this action.';
        break;
      case 404:
        errorMessage = 'Resource not found';
        severity = 'warn';
        break;
      case 409:
        errorMessage = serverError?.message || 'Conflict. The resource already exists.';
        severity = 'warn';
        break;
      case 422:
        errorMessage = serverError?.message || 'Validation Error';
        severity = 'warn';
        break;
      case 429:
        errorMessage = 'Too many requests. Please try again later.';
        break;
      case 500:
        errorMessage = 'Internal server error. Please try again later.';
        break;
      case 502:
      case 503:
      case 504:
        errorMessage = 'Service temporarily unavailable. Please try again later.';
        break;
      default:
        errorMessage = serverError?.message || `Server Error: ${status}`;
    }
  }

  // Show user-friendly error message
  messageService.add({
    severity,
    summary: getErrorSummary(severity),
    detail: errorMessage,
    life: 5000,
  });
}

function getErrorSummary(severity: string): string {
  switch (severity) {
    case 'warn':
      return 'Warning';
    case 'info':
      return 'Information';
    case 'success':
      return 'Success';
    default:
      return 'Error';
  }
}