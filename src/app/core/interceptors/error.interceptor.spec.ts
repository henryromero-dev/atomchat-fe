import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandlerFn, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { errorInterceptor } from './error.interceptor';
import { MessageService } from 'primeng/api';

describe('ErrorInterceptor', () => {
  let messageServiceSpy: jest.Mocked<MessageService>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    const messageSpy = {
      add: jest.fn()
    } as jest.Mocked<Pick<MessageService, 'add'>>;

    mockNext = jest.fn();

    TestBed.configureTestingModule({
      providers: [
        { provide: MessageService, useValue: messageSpy },
      ],
    });

    messageServiceSpy = TestBed.inject(MessageService) as jest.Mocked<MessageService>;
  });

  it('should pass through successful responses', () => {
    const mockRequest = new HttpRequest('GET', '/api/tasks');
    const mockResponse = of({ status: 200, body: { data: 'success' } } as HttpEvent<any>);

    mockNext.mockReturnValue(mockResponse);

    TestBed.runInInjectionContext(() => {
      errorInterceptor(mockRequest, mockNext).subscribe({
        next: (response) => {
          expect(response).toEqual({ status: 200, body: { data: 'success' } });
        }
      });
    });

    expect(mockNext).toHaveBeenCalledWith(mockRequest);
  });

  it('should handle 400 Bad Request errors', () => {
    const mockRequest = new HttpRequest('GET', '/api/tasks');
    const errorResponse = new HttpErrorResponse({
      status: 400,
      statusText: 'Bad Request',
      error: { message: 'Custom validation error' }
    });

    mockNext.mockReturnValue(throwError(() => errorResponse));

    TestBed.runInInjectionContext(() => {
      errorInterceptor(mockRequest, mockNext).subscribe({
        error: (error) => {
          expect(error).toBe(errorResponse);
        }
      });
    });

    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Custom validation error',
      life: 5000,
    });
  });

  it('should handle 401 Unauthorized errors', () => {
    const mockRequest = new HttpRequest('GET', '/api/tasks');
    const errorResponse = new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized',
      error: { message: 'Token expired' }
    });

    mockNext.mockReturnValue(throwError(() => errorResponse));

    TestBed.runInInjectionContext(() => {
      errorInterceptor(mockRequest, mockNext).subscribe({
        error: (error) => {
          expect(error).toBe(errorResponse);
        }
      });
    });

    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Unauthorized. Please log in again.',
      life: 5000,
    });
  });

  it('should handle 403 Forbidden errors', () => {
    const mockRequest = new HttpRequest('GET', '/api/tasks');
    const errorResponse = new HttpErrorResponse({
      status: 403,
      statusText: 'Forbidden',
      error: { message: 'Access denied' }
    });

    mockNext.mockReturnValue(throwError(() => errorResponse));

    TestBed.runInInjectionContext(() => {
      errorInterceptor(mockRequest, mockNext).subscribe({
        error: (error) => {
          expect(error).toBe(errorResponse);
        }
      });
    });

    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Forbidden. You do not have permission to perform this action.',
      life: 5000,
    });
  });

  it('should handle 404 Not Found errors', () => {
    const mockRequest = new HttpRequest('GET', '/api/tasks/999');
    const errorResponse = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found',
      error: { message: 'Resource not found' }
    });

    mockNext.mockReturnValue(throwError(() => errorResponse));

    TestBed.runInInjectionContext(() => {
      errorInterceptor(mockRequest, mockNext).subscribe({
        error: (error) => {
          expect(error).toBe(errorResponse);
        }
      });
    });

    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Resource not found',
      life: 5000,
    });
  });

  it('should handle 500 Internal Server Error', () => {
    const mockRequest = new HttpRequest('GET', '/api/tasks');
    const errorResponse = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
      error: { message: 'Something went wrong' }
    });

    mockNext.mockReturnValue(throwError(() => errorResponse));

    TestBed.runInInjectionContext(() => {
      errorInterceptor(mockRequest, mockNext).subscribe({
        error: (error) => {
          expect(error).toBe(errorResponse);
        }
      });
    });

    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Internal server error. Please try again later.',
      life: 5000,
    });
  });

  it('should handle client-side errors', () => {
    const mockRequest = new HttpRequest('GET', '/api/tasks');
    const errorResponse = new HttpErrorResponse({
      status: 0,
      statusText: 'Unknown Error',
      error: new Error('Client-side error')
    });

    mockNext.mockReturnValue(throwError(() => errorResponse));

    TestBed.runInInjectionContext(() => {
      errorInterceptor(mockRequest, mockNext).subscribe({
        error: (error) => {
          expect(error).toBe(errorResponse);
        }
      });
    });

    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Client-side error',
      life: 5000,
    });
  });

  it('should handle errors without error message', () => {
    const mockRequest = new HttpRequest('GET', '/api/tasks');
    const errorResponse = new HttpErrorResponse({
      status: 400,
      statusText: 'Bad Request',
      error: {}
    });

    mockNext.mockReturnValue(throwError(() => errorResponse));

    TestBed.runInInjectionContext(() => {
      errorInterceptor(mockRequest, mockNext).subscribe({
        error: (error) => {
          expect(error).toBe(errorResponse);
        }
      });
    });

    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Bad Request',
      life: 5000,
    });
  });

  it('should handle errors with default message when no specific error message', () => {
    const mockRequest = new HttpRequest('GET', '/api/tasks');
    const errorResponse = new HttpErrorResponse({
      status: 999,
      statusText: 'Unknown Error',
      error: {}
    });

    mockNext.mockReturnValue(throwError(() => errorResponse));

    TestBed.runInInjectionContext(() => {
      errorInterceptor(mockRequest, mockNext).subscribe({
        error: (error) => {
          expect(error).toBe(errorResponse);
        }
      });
    });

    expect(messageServiceSpy.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Server Error: 999',
      life: 5000,
    });
  });
});