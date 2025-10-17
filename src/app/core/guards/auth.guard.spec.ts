import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';

describe('AuthGuard', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    const routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should return true when user is authenticated', () => {
    // Arrange
    mockAuthService.isAuthenticated.and.returnValue(true);

    // Act
    const result = authGuard();

    // Assert
    expect(result).toBe(true);
    expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
  });

  it('should redirect to login when user is not authenticated', () => {
    // Arrange
    const mockUrlTree = { toString: () => '/login' };
    mockAuthService.isAuthenticated.and.returnValue(false);
    mockRouter.createUrlTree.and.returnValue(mockUrlTree as any);

    // Act
    const result = authGuard();

    // Assert
    expect(result).toBe(mockUrlTree);
    expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/login']);
  });

  it('should call isAuthenticated method from AuthService', () => {
    // Arrange
    mockAuthService.isAuthenticated.and.returnValue(true);

    // Act
    authGuard();

    // Assert
    expect(mockAuthService.isAuthenticated).toHaveBeenCalledTimes(1);
  });
});
