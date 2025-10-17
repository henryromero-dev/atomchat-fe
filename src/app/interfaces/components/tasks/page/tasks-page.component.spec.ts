import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService } from 'primeng/api';

import { TasksPageComponent } from './tasks-page.component';
import { AuthApplicationService } from '@/app/domain';
import { TaskApplicationService } from '@/app/domain';
import { ToastService } from '@/app/domain';
import { User } from '@/app/domain';
import { Task } from '@/app/domain/task.model';

describe('TasksPageComponent', () => {
  let component: TasksPageComponent;
  let fixture: ComponentFixture<TasksPageComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockTaskService: jasmine.SpyObj<TaskService>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  let mockConfirmationService: jasmine.SpyObj<ConfirmationService>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  };

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Test Task 1',
      description: 'Test Description 1',
      completed: false,
      createdAt: new Date('2024-01-15T10:00:00Z'),
      updatedAt: new Date('2024-01-15T10:00:00Z'),
    },
    {
      id: '2',
      title: 'Test Task 2',
      description: 'Test Description 2',
      completed: true,
      createdAt: new Date('2024-01-14T14:30:00Z'),
      updatedAt: new Date('2024-01-15T09:15:00Z'),
    },
  ];

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'logout']);
    const taskServiceSpy = jasmine.createSpyObj('TaskService', [
      'getTasks', 'getIsLoading', 'getError', 'createTask', 'updateTask', 'deleteTask', 'toggleTaskCompletion'
    ]);
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['showSuccess', 'showError']);
    const confirmationServiceSpy = jasmine.createSpyObj('ConfirmationService', ['confirm']);

    // Setup task service observables
    taskServiceSpy.getTasks.and.returnValue(of(mockTasks));
    taskServiceSpy.getIsLoading.and.returnValue(of(false));
    taskServiceSpy.getError.and.returnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [TasksPageComponent, ReactiveFormsModule, FormsModule, NoopAnimationsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: TaskService, useValue: taskServiceSpy },
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: ConfirmationService, useValue: confirmationServiceSpy },
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TasksPageComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockTaskService = TestBed.inject(TaskService) as jasmine.SpyObj<TaskService>;
    mockToastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    mockConfirmationService = TestBed.inject(ConfirmationService) as jasmine.SpyObj<ConfirmationService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render tasks page with toolbar', () => {
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('p-toolbar')).toBeTruthy();
    expect(compiled.querySelector('.app-title')).toBeTruthy();
    expect(compiled.querySelector('.app-title').textContent).toContain('AtomChat Tasks');
  });

  it('should display user email in toolbar', () => {
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const userInfo = compiled.querySelector('.user-info');
    expect(userInfo).toBeTruthy();
    expect(userInfo.textContent).toContain('test@example.com');
  });

  it('should show logout button in toolbar', () => {
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const logoutButton = compiled.querySelector('.logout-button');
    expect(logoutButton).toBeTruthy();
    expect(logoutButton.textContent).toContain('Back to Login');
  });

  it('should call authService.logout when logout button is clicked', () => {
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    fixture.detectChanges();
    
    const logoutButton = fixture.nativeElement.querySelector('.logout-button');
    logoutButton.click();
    
    expect(mockAuthService.logout).toHaveBeenCalled();
  });

  it('should render task list in order', () => {
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const taskCards = compiled.querySelectorAll('.task-card');
    const taskTitles = Array.from(taskCards).map(card => 
      card.querySelector('.task-title')?.textContent
    );
    
    expect(taskCards.length).toBe(2);
    expect(taskTitles[0]).toContain('Test Task 1');
    expect(taskTitles[1]).toContain('Test Task 2');
  });

  it('should show create task form when create button is clicked', () => {
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    fixture.detectChanges();
    
    const createButton = fixture.nativeElement.querySelector('.create-task-button');
    createButton.click();
    fixture.detectChanges();
    
    expect(component.showCreateForm).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.create-task-card')).toBeTruthy();
  });

  it('should create a task when form is submitted', () => {
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockTaskService.createTask.and.returnValue(of(mockTasks[0]));
    fixture.detectChanges();
    
    component.showCreateTaskForm();
    fixture.detectChanges();
    
    const form = component.createTaskForm;
    form.patchValue({
      title: 'New Task',
      description: 'New Description'
    });
    
    component.onCreateTask();
    
    expect(mockTaskService.createTask).toHaveBeenCalledWith({
      title: 'New Task',
      description: 'New Description'
    });
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('Task created successfully!');
  });

  it('should show error when task creation fails', () => {
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockTaskService.createTask.and.returnValue(throwError(() => new Error('Creation failed')));
    fixture.detectChanges();
    
    component.showCreateTaskForm();
    fixture.detectChanges();
    
    const form = component.createTaskForm;
    form.patchValue({
      title: 'New Task',
      description: 'New Description'
    });
    
    component.onCreateTask();
    
    expect(mockToastService.showError).toHaveBeenCalledWith('Failed to create task', 'Creation failed');
  });

  it('should show edit dialog when edit button is clicked', () => {
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    fixture.detectChanges();
    
    const editButton = fixture.nativeElement.querySelector('.edit-button');
    editButton.click();
    fixture.detectChanges();
    
    expect(component.showEditDialog).toBeTruthy();
    expect(component.editingTask).toEqual(mockTasks[0]);
  });

  it('should update task when edit form is submitted', () => {
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockTaskService.updateTask.and.returnValue(of(mockTasks[0]));
    fixture.detectChanges();
    
    component.showEditTaskDialog(mockTasks[0]);
    fixture.detectChanges();
    
    const form = component.editTaskForm;
    form.patchValue({
      title: 'Updated Task',
      description: 'Updated Description'
    });
    
    component.onUpdateTask();
    
    expect(mockTaskService.updateTask).toHaveBeenCalledWith({
      id: mockTasks[0].id,
      title: 'Updated Task',
      description: 'Updated Description',
      completed: mockTasks[0].completed
    });
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('Task updated successfully!');
  });

  it('should show confirmation dialog when delete button is clicked', () => {
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    fixture.detectChanges();
    
    const deleteButton = fixture.nativeElement.querySelector('.delete-button');
    deleteButton.click();
    
    expect(mockConfirmationService.confirm).toHaveBeenCalled();
  });

  it('should delete task when confirmed', () => {
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockTaskService.deleteTask.and.returnValue(of(void 0));
    fixture.detectChanges();
    
    // Simulate confirmation
    const confirmCall = mockConfirmationService.confirm.calls.mostRecent();
    const acceptCallback = confirmCall.args[0].accept;
    acceptCallback();
    
    expect(mockTaskService.deleteTask).toHaveBeenCalledWith(mockTasks[0].id);
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('Task deleted successfully!');
  });

  it('should toggle task completion when checkbox is clicked', () => {
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockTaskService.toggleTaskCompletion.and.returnValue(of(mockTasks[0]));
    fixture.detectChanges();
    
    component.onToggleTaskCompletion(mockTasks[0]);
    
    expect(mockTaskService.toggleTaskCompletion).toHaveBeenCalledWith(mockTasks[0].id);
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('Task marked as completed!');
  });

  it('should validate form fields correctly', () => {
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    fixture.detectChanges();
    
    const form = component.createTaskForm;
    
    // Test required validation
    expect(component.isFieldInvalid(form, 'title')).toBeFalsy();
    form.get('title')?.markAsTouched();
    expect(component.isFieldInvalid(form, 'title')).toBeTruthy();
    
    // Test error message
    expect(component.getFieldError(form, 'title')).toBe('This field is required');
  });

  it('should track tasks by id', () => {
    expect(component.trackByTaskId(0, mockTasks[0])).toBe('1');
    expect(component.trackByTaskId(1, mockTasks[1])).toBe('2');
  });

  it('should prevent unnecessary re-renders when task data is unchanged', () => {
    const task1 = { id: '1', title: 'Task 1', description: 'Description 1', completed: false, createdAt: new Date(), updatedAt: new Date() };
    const task2 = { id: '2', title: 'Task 2', description: 'Description 2', completed: true, createdAt: new Date(), updatedAt: new Date() };
    
    // Same task should return same id
    expect(component.trackByTaskId(0, task1)).toBe(component.trackByTaskId(0, task1));
    
    // Different tasks should return different ids
    expect(component.trackByTaskId(0, task1)).not.toBe(component.trackByTaskId(1, task2));
  });

  it('should use OnPush change detection strategy', () => {
    expect(component.changeDetectionStrategy).toBe(ChangeDetectionStrategy.OnPush);
  });

  it('should not re-render unchanged task rows when using trackByTaskId', () => {
    const initialTasks = [
      { id: '1', title: 'Task 1', description: 'Description 1', completed: false, createdAt: new Date(), updatedAt: new Date() },
      { id: '2', title: 'Task 2', description: 'Description 2', completed: true, createdAt: new Date(), updatedAt: new Date() }
    ];
    
    taskServiceSpy.getTasks.and.returnValue(of(initialTasks));
    fixture.detectChanges();
    
    // Spy on the trackBy function to verify it's called
    spyOn(component, 'trackByTaskId').and.callThrough();
    
    // Update only one task
    const updatedTasks = [
      { ...initialTasks[0], title: 'Updated Task 1' },
      initialTasks[1] // Unchanged
    ];
    
    taskServiceSpy.getTasks.and.returnValue(of(updatedTasks));
    fixture.detectChanges();
    
    // Verify trackBy was called for each task
    expect(component.trackByTaskId).toHaveBeenCalledTimes(4); // 2 initial + 2 updated
  });

  it('should handle null user gracefully', () => {
    mockAuthService.getCurrentUser.and.returnValue(null);
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    const userInfo = compiled.querySelector('.user-info');
    expect(userInfo).toBeFalsy();
  });
});
