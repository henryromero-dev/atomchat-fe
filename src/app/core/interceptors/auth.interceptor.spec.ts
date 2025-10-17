import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpEvent } from '@angular/common/http';
import { of } from 'rxjs';
import { authInterceptor } from './auth.interceptor';
import { AuthApplicationService } from '../../application/services/auth-application.service';

describe('AuthInterceptor', () => {
  let authServiceSpy: jest.Mocked<AuthApplicationService>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    const authSpy = {
      getToken: jest.fn(),
      logout: jest.fn()
    } as jest.Mocked<Pick<AuthApplicationService, 'getToken' | 'logout'>>;

    mockNext = jest.fn();

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthApplicationService, useValue: authSpy },
      ],
    });

    authServiceSpy = TestBed.inject(AuthApplicationService) as jest.Mocked<AuthApplicationService>;
  });

  it('should add Authorization header when token is available', () => {
    const mockToken = 'mock-jwt-token';
    const mockRequest = new HttpRequest('GET', '/api/tasks');
    const mockResponse = of({} as HttpEvent<any>);

    authServiceSpy.getToken.mockReturnValue(mockToken);
    mockNext.mockReturnValue(mockResponse);

    TestBed.runInInjectionContext(() => {
      TestBed.runInInjectionContext(() => {
      authInterceptor(mockRequest, mockNext).subscribe();
    });
    });

    expect(authServiceSpy.getToken).toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
      headers: expect.objectContaining({
        lazyUpdate: expect.arrayContaining([
          expect.objectContaining({
            name: 'Authorization',
            value: `Bearer ${mockToken}`
          })
        ])
      })
    }));
  });

  it('should not add Authorization header when token is not available', () => {
    const mockRequest = new HttpRequest('GET', '/api/tasks');
    const mockResponse = of({} as HttpEvent<any>);

    authServiceSpy.getToken.mockReturnValue(null);
    mockNext.mockReturnValue(mockResponse);

    TestBed.runInInjectionContext(() => {
      authInterceptor(mockRequest, mockNext).subscribe();
    });

    expect(authServiceSpy.getToken).toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(mockRequest);
  });

  it('should not add Authorization header when token is empty string', () => {
    const mockRequest = new HttpRequest('GET', '/api/tasks');
    const mockResponse = of({} as HttpEvent<any>);

    authServiceSpy.getToken.mockReturnValue('');
    mockNext.mockReturnValue(mockResponse);

    TestBed.runInInjectionContext(() => {
      authInterceptor(mockRequest, mockNext).subscribe();
    });

    expect(authServiceSpy.getToken).toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(mockRequest);
  });

  it('should preserve existing headers when adding Authorization', () => {
    const mockToken = 'mock-jwt-token';
    const mockRequest = new HttpRequest('GET', '/api/tasks', {
      headers: new HttpRequest('GET', '/api/tasks').headers.set('Content-Type', 'application/json')
    });
    const mockResponse = of({} as HttpEvent<any>);

    authServiceSpy.getToken.mockReturnValue(mockToken);
    mockNext.mockReturnValue(mockResponse);

    TestBed.runInInjectionContext(() => {
      authInterceptor(mockRequest, mockNext).subscribe();
    });

    expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
      headers: expect.objectContaining({
        lazyUpdate: expect.arrayContaining([
          expect.objectContaining({
            name: 'Content-Type',
            value: 'application/json'
          }),
          expect.objectContaining({
            name: 'Authorization',
            value: `Bearer ${mockToken}`
          })
        ])
      })
    }));
  });

  it('should handle different HTTP methods', () => {
    const mockToken = 'mock-jwt-token';
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
    const mockResponse = of({} as HttpEvent<any>);

    authServiceSpy.getToken.mockReturnValue(mockToken);
    mockNext.mockReturnValue(mockResponse);

    methods.forEach(method => {
      const mockRequest = new HttpRequest(method, '/api/tasks');
      TestBed.runInInjectionContext(() => {
      authInterceptor(mockRequest, mockNext).subscribe();
    });

      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
        headers: expect.objectContaining({
          lazyUpdate: expect.arrayContaining([
            expect.objectContaining({
              name: 'Authorization',
              value: `Bearer ${mockToken}`
            })
          ])
        })
      }));
    });
  });

  it('should handle different URLs', () => {
    const mockToken = 'mock-jwt-token';
    const urls = ['/api/tasks', '/api/users', '/api/auth/profile', 'https://external-api.com/data'];
    const mockResponse = of({} as HttpEvent<any>);

    authServiceSpy.getToken.mockReturnValue(mockToken);
    mockNext.mockReturnValue(mockResponse);

    urls.forEach(url => {
      const mockRequest = new HttpRequest('GET', url);
      TestBed.runInInjectionContext(() => {
      authInterceptor(mockRequest, mockNext).subscribe();
    });

      expect(mockNext).toHaveBeenCalledWith(expect.objectContaining({
        headers: expect.objectContaining({
          lazyUpdate: expect.arrayContaining([
            expect.objectContaining({
              name: 'Authorization',
              value: `Bearer ${mockToken}`
            })
          ])
        })
      }));
    });
  });
});

