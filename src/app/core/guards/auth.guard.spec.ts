import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthApplicationService } from '../../application/services/auth-application.service';
import { authGuard } from './auth.guard';

describe('AuthGuard', () => {
  let mockAuthService: jest.Mocked<AuthApplicationService>;
  let mockRouter: jest.Mocked<Router>;

  beforeEach(() => {
    const authServiceSpy = {
      isAuthenticated: jest.fn()
    } as jest.Mocked<Pick<AuthApplicationService, 'isAuthenticated'>>;

    const routerSpy = {
      createUrlTree: jest.fn()
    } as jest.Mocked<Pick<Router, 'createUrlTree'>>;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthApplicationService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    mockAuthService = TestBed.inject(AuthApplicationService) as jest.Mocked<AuthApplicationService>;
    mockRouter = TestBed.inject(Router) as jest.Mocked<Router>;
  });

  it('should return true when user is authenticated', () => {
    // Arrange
    mockAuthService.isAuthenticated.mockReturnValue(true);

    // Act
    const result = TestBed.runInInjectionContext(() => {
      return authGuard(null as any, null as any);
    });

    // Assert
    expect(result).toBe(true);
    expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect to login when user is not authenticated', () => {
    // Arrange
    const mockUrlTree = { toString: () => '/login' };
    mockAuthService.isAuthenticated.mockReturnValue(false);
    mockRouter.createUrlTree.mockReturnValue(mockUrlTree as any);

    // Act
    const result = TestBed.runInInjectionContext(() => {
      return authGuard(null as any, null as any);
    });

    // Assert
    expect(result).toBe(mockUrlTree);
    expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/login']);
  });

  it('should call isAuthenticated method from AuthApplicationService', () => {
    // Arrange
    mockAuthService.isAuthenticated.mockReturnValue(true);

    // Act
    TestBed.runInInjectionContext(() => {
      authGuard(null as any, null as any);
    });

    // Assert
    expect(mockAuthService.isAuthenticated).toHaveBeenCalledTimes(1);
  });
});
