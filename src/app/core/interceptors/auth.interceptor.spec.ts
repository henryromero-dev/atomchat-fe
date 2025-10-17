import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { of } from 'rxjs';
import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from '../services/auth.service';

describe('AuthInterceptor', () => {
  let interceptor: AuthInterceptor;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let mockHandler: jasmine.SpyObj<HttpHandler>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    const handlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);

    TestBed.configureTestingModule({
      providers: [
        AuthInterceptor,
        { provide: AuthService, useValue: authSpy },
      ],
    });

    interceptor = TestBed.inject(AuthInterceptor);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockHandler = handlerSpy;
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add Authorization header when token is available', () => {
    const mockToken = 'mock-jwt-token';
    const mockRequest = new HttpRequest('GET', '/api/tasks');
    const mockResponse = new HttpRequest('GET', '/api/tasks', {
      headers: mockRequest.headers.set('Authorization', `Bearer ${mockToken}`)
    });

    authServiceSpy.getToken.and.returnValue(mockToken);
    mockHandler.handle.and.returnValue(of({} as HttpEvent<any>));

    interceptor.intercept(mockRequest, mockHandler).subscribe();

    expect(authServiceSpy.getToken).toHaveBeenCalled();
    expect(mockHandler.handle).toHaveBeenCalledWith(jasmine.objectContaining({
      headers: jasmine.objectContaining({
        Authorization: `Bearer ${mockToken}`
      })
    }));
  });

  it('should not add Authorization header when token is not available', () => {
    const mockRequest = new HttpRequest('GET', '/api/tasks');

    authServiceSpy.getToken.and.returnValue(null);
    mockHandler.handle.and.returnValue(of({} as HttpEvent<any>));

    interceptor.intercept(mockRequest, mockHandler).subscribe();

    expect(authServiceSpy.getToken).toHaveBeenCalled();
    expect(mockHandler.handle).toHaveBeenCalledWith(mockRequest);
  });

  it('should not add Authorization header when token is empty string', () => {
    const mockRequest = new HttpRequest('GET', '/api/tasks');

    authServiceSpy.getToken.and.returnValue('');
    mockHandler.handle.and.returnValue(of({} as HttpEvent<any>));

    interceptor.intercept(mockRequest, mockHandler).subscribe();

    expect(authServiceSpy.getToken).toHaveBeenCalled();
    expect(mockHandler.handle).toHaveBeenCalledWith(mockRequest);
  });

  it('should preserve existing headers when adding Authorization', () => {
    const mockToken = 'mock-jwt-token';
    const mockRequest = new HttpRequest('GET', '/api/tasks', {
      headers: new HttpRequest('GET', '/api/tasks').headers.set('Content-Type', 'application/json')
    });

    authServiceSpy.getToken.and.returnValue(mockToken);
    mockHandler.handle.and.returnValue(of({} as HttpEvent<any>));

    interceptor.intercept(mockRequest, mockHandler).subscribe();

    expect(mockHandler.handle).toHaveBeenCalledWith(jasmine.objectContaining({
      headers: jasmine.objectContaining({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mockToken}`
      })
    }));
  });

  it('should handle different HTTP methods', () => {
    const mockToken = 'mock-jwt-token';
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];

    authServiceSpy.getToken.and.returnValue(mockToken);
    mockHandler.handle.and.returnValue(of({} as HttpEvent<any>));

    methods.forEach(method => {
      const mockRequest = new HttpRequest(method, '/api/tasks');
      interceptor.intercept(mockRequest, mockHandler).subscribe();

      expect(mockHandler.handle).toHaveBeenCalledWith(jasmine.objectContaining({
        headers: jasmine.objectContaining({
          Authorization: `Bearer ${mockToken}`
        })
      }));
    });
  });

  it('should handle different URLs', () => {
    const mockToken = 'mock-jwt-token';
    const urls = ['/api/tasks', '/api/users', '/api/auth/profile', 'https://external-api.com/data'];

    authServiceSpy.getToken.and.returnValue(mockToken);
    mockHandler.handle.and.returnValue(of({} as HttpEvent<any>));

    urls.forEach(url => {
      const mockRequest = new HttpRequest('GET', url);
      interceptor.intercept(mockRequest, mockHandler).subscribe();

      expect(mockHandler.handle).toHaveBeenCalledWith(jasmine.objectContaining({
        headers: jasmine.objectContaining({
          Authorization: `Bearer ${mockToken}`
        })
      }));
    });
  });
});

