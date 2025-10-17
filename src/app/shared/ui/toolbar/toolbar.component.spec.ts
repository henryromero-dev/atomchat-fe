import { TestBed } from '@angular/core/testing';
import { ToolbarComponent } from './toolbar.component';

describe('ToolbarComponent', () => {
  it('should create', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new ToolbarComponent();
    });
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default values', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new ToolbarComponent();
    });
    
    expect(component.title).toBe('');
    expect(component.userEmail).toBeNull();
    expect(component.showLogoutButton).toBe(true);
  });

  it('should set title input', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new ToolbarComponent();
    });
    
    component.title = 'Test Title';
    
    expect(component.title).toBe('Test Title');
  });

  it('should set userEmail input', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new ToolbarComponent();
    });
    
    component.userEmail = 'test@example.com';
    
    expect(component.userEmail).toBe('test@example.com');
  });

  it('should set showLogoutButton input', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new ToolbarComponent();
    });
    
    component.showLogoutButton = false;
    
    expect(component.showLogoutButton).toBe(false);
  });

  it('should emit logout event when onLogout is called', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new ToolbarComponent();
    });
    
    const emitSpy = jest.spyOn(component.logout, 'emit');
    
    component.onLogout();
    
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should have logout EventEmitter', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new ToolbarComponent();
    });
    
    expect(component.logout).toBeDefined();
    expect(component.logout.emit).toBeDefined();
  });

  it('should allow setting all inputs together', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new ToolbarComponent();
    });
    
    component.title = 'My App';
    component.userEmail = 'user@example.com';
    component.showLogoutButton = false;
    
    expect(component.title).toBe('My App');
    expect(component.userEmail).toBe('user@example.com');
    expect(component.showLogoutButton).toBe(false);
  });

  it('should handle null userEmail', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new ToolbarComponent();
    });
    
    component.userEmail = null;
    
    expect(component.userEmail).toBeNull();
  });

  it('should handle empty string userEmail', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new ToolbarComponent();
    });
    
    component.userEmail = '';
    
    expect(component.userEmail).toBe('');
  });

  it('should handle multiple logout calls', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new ToolbarComponent();
    });
    
    const emitSpy = jest.spyOn(component.logout, 'emit');
    
    component.onLogout();
    component.onLogout();
    component.onLogout();
    
    expect(emitSpy).toHaveBeenCalledTimes(3);
  });
});