import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarComponent } from './toolbar.component';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display title', () => {
    component.title = 'Test Title';
    fixture.detectChanges();
    
    const titleElement = fixture.nativeElement.querySelector('h1');
    expect(titleElement.textContent).toContain('Test Title');
  });

  it('should display user email when provided', () => {
    component.userEmail = 'test@example.com';
    fixture.detectChanges();
    
    const welcomeElement = fixture.nativeElement.querySelector('.small.opacity-75');
    expect(welcomeElement.textContent).toContain('Welcome, test@example.com');
  });

  it('should hide user email when not provided', () => {
    component.userEmail = null;
    fixture.detectChanges();
    
    const welcomeElement = fixture.nativeElement.querySelector('.small.opacity-75');
    expect(welcomeElement).toBeNull();
  });

  it('should emit logout event when logout button is clicked', () => {
    spyOn(component.logout, 'emit');
    
    const logoutButton = fixture.nativeElement.querySelector('p-button');
    logoutButton.click();
    
    expect(component.logout.emit).toHaveBeenCalled();
  });

  it('should hide logout button when showLogoutButton is false', () => {
    component.showLogoutButton = false;
    fixture.detectChanges();
    
    const logoutButton = fixture.nativeElement.querySelector('p-button');
    expect(logoutButton).toBeNull();
  });
});
