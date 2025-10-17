import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { ErrorInterceptor } from './error.interceptor';
import { ToastService } from '../services/toast.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

describe('ErrorInterceptor', () => {
  let interceptor: ErrorInterceptor;
  let toastServiceSpy: jasmine.SpyObj<ToastService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let mockHandler: jasmine.SpyObj<HttpHandler>;

  beforeEach(() => {
    const toastSpy = jasmine.createSpyObj('ToastService', ['showError', 'showWarn']);
    const authSpy = jasmine.createSpyObj('AuthService', ['logout']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const handlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);

    TestBed.configureTestingModule({
      providers: [
        ErrorInterceptor,
        { provide: ToastService, useValue: toastSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
      ],
    });

    interceptor = TestBed.inject(ErrorInterceptor);
    toastServiceSpy = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockHandler = handlerSpy;
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should pass through successful responses', () => {
    const mockRequest = new HttpRequest('GET', '/api/tasks');
    const mockResponse = { status: 200, body: { data: 'success' } };

    mockHandler.handle.and.returnValue(of(mockResponse as HttpEvent<any>));

    interceptor.intercept(mockRequest, mockHandler).subscribe({
      next: (response) => {
        expect(response).toBe(mockResponse);
      }
    });

    expect(mockHandler.handle).toHaveBeenCalledWith(mockRequest);
  });

  it('should handle 401 Unauthorized errors', () => {
    const mockRequest = new HttpRequest('GET', '/api/tasks');
    const errorResponse = new HttpErrorResponse({
      status: 401,
      statusText: 'Unauthorized',
      error: { message: 'Token expired' }
    });

    mockHandler.handle.and.returnValue(throwError(() => errorResponse));

    interceptor.intercept(mockRequest, mockHandler).subscribe({
      error: (error) => {
        expect(error).toBe(errorResponse);
      }
    });

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    expect(toastServiceSpy.showError).toHaveBeenCalledWith('Session expired', 'Please log in again');
  });

  it('should handle 403 Forbidden errors', () => {
    const mockRequest = new HttpRequest('GET', '/api/tasks');
    const errorResponse = new HttpErrorResponse({
      status: 403,
      statusText: 'Forbidden',
      error: { message: 'Access denied' }
    });

    mockHandler.handle.and.returnValue(throwError(() => errorResponse));

    interceptor.intercept(mockRequest, mockHandler).subscribe({
      error: (error) => {
        expect(error).toBe(errorResponse);
      }
    });

    expect(toastServiceSpy.showError).toHaveBeenCalledWith('Access denied', 'You do not have permission to perform this action');
  });

  it('should handle 404 Not Found errors', () => {
    const mockRequest = new HttpRequest('GET', '/api/tasks/999');
    const errorResponse = new HttpErrorResponse({
      status: 404,
      statusText: 'Not Found',
      error: { message: 'Resource not found' }
    });

    mockHandler.handle.and.returnValue(throwError(() => errorResponse));

    interceptor.intercept(mockRequest, mockHandler).subscribe({
      error: (error) => {
        expect(error).toBe(errorResponse);
      }
    });

    expect(toastServiceSpy.showError).toHaveBeenCalledWith('Not found', 'The requested resource was not found');
  });

  it('should handle 500 Internal Server Error', () => {
    const mockRequest = new HttpRequest('GET', '/api/tasks');
    const errorResponse = new HttpErrorResponse({
      status: 500,
      statusText: 'Internal Server Error',
      error: { message: 'Something went wrong' }
    });

    mockHandler.handle.and.returnValue(throwError(() => errorResponse));

    interceptor.intercept(mockRequest, mockHandler).subscribe({
      error: (error) => {
        expect(error).toBe(errorResponse);
      }
    });

    expect(toastServiceSpy.showError).toHaveBeenCalledWith('Server error', 'Something went wrong on our end. Please try again later');
  });

  it('should handle network errors', () => {
    const mockRequest = new HttpRequest('GET', '/api/tasks');
    const errorResponse = new HttpErrorResponse({
      status: 0,
      statusText: 'Unknown Error',
      error: { message: 'Network error' }
    });

    mockHandler.handle.and.returnValue(throwError(() => errorResponse));

    interceptor.intercept(mockRequest, mockHandler).subscribe({
      error: (error) => {
        expect(error).toBe(errorResponse);
      }
    });

    expect(toastServiceSpy.showError).toHaveBeenCalledWith('Network error', 'Please check your internet connection and try again');
  });

  it('should handle client-side errors', () => {
    const mockRequest = new HttpRequest('GET', '/api/tasks');
    const errorResponse = new HttpErrorResponse({
      status: 0,
      statusText: 'Unknown Error',
      error: new Error('Client-side error')
    });

    mockHandler.handle.and.returnValue(throwError(() => errorResponse));

    interceptor.intercept(mockRequest, mockHandler).subscribe({
      error: (error) => {
        expect(error).toBe(errorResponse);
      }
    });

    expect(toastServiceSpy.showError).toHaveBeenCalledWith('An error occurred', 'An unexpected error occurred. Please try again');
  });

  it('should handle errors with custom error messages', () => {
    const mockRequest = new HttpRequest('GET', '/api/tasks');
    const errorResponse = new HttpErrorResponse({
      status: 400,
      statusText: 'Bad Request',
      error: { message: 'Custom validation error' }
    });

    mockHandler.handle.and.returnValue(throwError(() => errorResponse));

    interceptor.intercept(mockRequest, mockHandler).subscribe({
      error: (error) => {
        expect(error).toBe(errorResponse);
      }
    });

    expect(toastServiceSpy.showError).toHaveBeenCalledWith('Bad request', 'Custom validation error');
  });

  it('should handle errors without error message', () => {
    const mockRequest = new HttpRequest('GET', '/api/tasks');
    const errorResponse = new HttpErrorResponse({
      status: 400,
      statusText: 'Bad Request',
      error: {}
    });

    mockHandler.handle.and.returnValue(throwError(() => errorResponse));

    interceptor.intercept(mockRequest, mockHandler).subscribe({
      error: (error) => {
        expect(error).toBe(errorResponse);
      }
    });

    expect(toastServiceSpy.showError).toHaveBeenCalledWith('Bad request', 'An error occurred while processing your request');
  });

  it('should not handle non-HTTP errors', () => {
    const mockRequest = new HttpRequest('GET', '/api/tasks');
    const regularError = new Error('Regular error');

    mockHandler.handle.and.returnValue(throwError(() => regularError));

    interceptor.intercept(mockRequest, mockHandler).subscribe({
      error: (error) => {
        expect(error).toBe(regularError);
      }
    });

    expect(toastServiceSpy.showError).not.toHaveBeenCalled();
  });
});

