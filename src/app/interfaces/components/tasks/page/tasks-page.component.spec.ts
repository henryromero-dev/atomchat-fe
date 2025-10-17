import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { TasksPageComponent } from './tasks-page.component';
import { AuthApplicationService } from '@/app/application/services/auth-application.service';
import { TaskApplicationService } from '@/app/application/services/task-application.service';
import { ToastService } from '@/app/core/services/toast.service';
import { ConfirmationService } from 'primeng/api';
import { User, Task } from '@/app/domain';

describe('TasksPageComponent', () => {
  let authServiceSpy: jest.Mocked<AuthApplicationService>;
  let taskServiceSpy: jest.Mocked<TaskApplicationService>;
  let toastServiceSpy: jest.Mocked<ToastService>;
  let confirmationServiceSpy: jest.Mocked<ConfirmationService>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    avatar: 'https://example.com/avatar.jpg',
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

  beforeEach(() => {
    const authSpy = {
      getCurrentUser: jest.fn(),
      logout: jest.fn()
    } as jest.Mocked<Pick<AuthApplicationService, 'getCurrentUser' | 'logout'>>;

    const taskSpy = {
      getTasks: jest.fn(),
      getIsLoading: jest.fn(),
      getError: jest.fn(),
      loadTasks: jest.fn(),
      createTask: jest.fn(),
      updateTask: jest.fn(),
      deleteTask: jest.fn(),
      toggleTaskCompletion: jest.fn()
    } as jest.Mocked<Pick<TaskApplicationService, 'getTasks' | 'getIsLoading' | 'getError' | 'loadTasks' | 'createTask' | 'updateTask' | 'deleteTask' | 'toggleTaskCompletion'>>;

    const toastSpy = {
      showSuccess: jest.fn(),
      showError: jest.fn()
    } as jest.Mocked<Pick<ToastService, 'showSuccess' | 'showError'>>;

    const confirmationSpy = {
      confirm: jest.fn()
    } as jest.Mocked<Pick<ConfirmationService, 'confirm'>>;

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
      providers: [
        { provide: AuthApplicationService, useValue: authSpy },
        { provide: TaskApplicationService, useValue: taskSpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: ConfirmationService, useValue: confirmationSpy },
      ],
    });

    authServiceSpy = TestBed.inject(AuthApplicationService) as jest.Mocked<AuthApplicationService>;
    taskServiceSpy = TestBed.inject(TaskApplicationService) as jest.Mocked<TaskApplicationService>;
    toastServiceSpy = TestBed.inject(ToastService) as jest.Mocked<ToastService>;
    confirmationServiceSpy = TestBed.inject(ConfirmationService) as jest.Mocked<ConfirmationService>;

    // Setup task service observables
    taskServiceSpy.getTasks.mockReturnValue(of(mockTasks));
    taskServiceSpy.getIsLoading.mockReturnValue(of(false));
    taskServiceSpy.getError.mockReturnValue(of(null));
  });

  it('should create', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TasksPageComponent();
    });
    expect(component).toBeTruthy();
  });

  it('should initialize with correct default state', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TasksPageComponent();
    });
    
    expect(component.showTaskForm).toBe(false);
    expect(component.editingTask).toBeNull();
    expect(component.currentUser).toBeNull();
  });

  it('should load tasks on initialization when user exists', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TasksPageComponent();
    });
    
    authServiceSpy.getCurrentUser.mockReturnValue(mockUser);
    
    component.ngOnInit();
    
    expect(authServiceSpy.getCurrentUser).toHaveBeenCalled();
    expect(taskServiceSpy.loadTasks).toHaveBeenCalledWith(mockUser.id);
    expect(component.currentUser).toBe(mockUser);
  });

  it('should not load tasks when user is null', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TasksPageComponent();
    });
    
    authServiceSpy.getCurrentUser.mockReturnValue(null);
    
    component.ngOnInit();
    
    expect(authServiceSpy.getCurrentUser).toHaveBeenCalled();
    expect(taskServiceSpy.loadTasks).not.toHaveBeenCalled();
    expect(component.currentUser).toBeNull();
  });

  it('should show create task form', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TasksPageComponent();
    });
    
    component.showCreateTaskForm();
    
    expect(component.showTaskForm).toBe(true);
    expect(component.editingTask).toBeNull();
  });

  it('should show edit task dialog', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TasksPageComponent();
    });
    
    component.showEditTaskDialog(mockTasks[0]);
    
    expect(component.editingTask).toBe(mockTasks[0]);
    expect(component.showTaskForm).toBe(true);
  });

  it('should hide task form', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TasksPageComponent();
    });
    
    component.showTaskForm = true;
    component.editingTask = mockTasks[0];
    
    component.hideTaskForm();
    
    expect(component.showTaskForm).toBe(false);
    expect(component.editingTask).toBeNull();
  });

  it('should create a task when form is submitted for new task', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TasksPageComponent();
    });
    
    component.currentUser = mockUser;
    const newTask = {
      title: 'New Task',
      description: 'New Description'
    };
    
    taskServiceSpy.createTask.mockReturnValue(of(mockTasks[0]));
    
    component.onTaskSubmit(newTask);
    
    expect(taskServiceSpy.createTask).toHaveBeenCalled();
    expect(toastServiceSpy.showSuccess).toHaveBeenCalledWith('Task created successfully!');
    expect(component.showTaskForm).toBe(false);
  });

  it('should update a task when form is submitted for existing task', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TasksPageComponent();
    });
    
    component.currentUser = mockUser;
    component.editingTask = mockTasks[0];
    
    const updatedTask = {
      title: 'Updated Task',
      description: 'Updated Description'
    };
    
    taskServiceSpy.updateTask.mockReturnValue(of(mockTasks[0]));
    
    component.onTaskSubmit(updatedTask);
    
    expect(taskServiceSpy.updateTask).toHaveBeenCalled();
    expect(toastServiceSpy.showSuccess).toHaveBeenCalledWith('Task updated successfully!');
    expect(component.showTaskForm).toBe(false);
  });

  it('should handle task creation error', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TasksPageComponent();
    });
    
    component.currentUser = mockUser;
    const newTask = {
      title: 'New Task',
      description: 'New Description'
    };
    
    const error = new Error('Creation failed');
    taskServiceSpy.createTask.mockReturnValue(throwError(() => error));
    
    component.onTaskSubmit(newTask);
    
    expect(taskServiceSpy.createTask).toHaveBeenCalled();
    expect(toastServiceSpy.showError).toHaveBeenCalledWith('Failed to create task', error.message);
  });

  it('should handle task update error', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TasksPageComponent();
    });
    
    component.currentUser = mockUser;
    component.editingTask = mockTasks[0];
    
    const updatedTask = {
      title: 'Updated Task',
      description: 'Updated Description'
    };
    
    const error = new Error('Update failed');
    taskServiceSpy.updateTask.mockReturnValue(throwError(() => error));
    
    component.onTaskSubmit(updatedTask);
    
    expect(taskServiceSpy.updateTask).toHaveBeenCalled();
    expect(toastServiceSpy.showError).toHaveBeenCalledWith('Failed to update task', error.message);
  });

  it('should show confirmation dialog when delete button is clicked', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TasksPageComponent();
    });
    
    component.confirmDeleteTask(mockTasks[0]);
    
    expect(confirmationServiceSpy.confirm).toHaveBeenCalledWith({
      message: `Are you sure you want to delete "${mockTasks[0].title}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: expect.any(Function),
    });
  });

  it('should delete task when confirmed', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TasksPageComponent();
    });
    
    taskServiceSpy.deleteTask.mockReturnValue(of(void 0));
    
    component.confirmDeleteTask(mockTasks[0]);
    
    // Simulate the accept callback
    const confirmCall = confirmationServiceSpy.confirm.mock.calls[0];
    const acceptCallback = confirmCall[0].accept;
    acceptCallback();
    
    expect(taskServiceSpy.deleteTask).toHaveBeenCalledWith(mockTasks[0].id);
    expect(toastServiceSpy.showSuccess).toHaveBeenCalledWith('Task deleted successfully!');
  });

  it('should handle task deletion error', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TasksPageComponent();
    });
    
    const error = new Error('Delete failed');
    taskServiceSpy.deleteTask.mockReturnValue(throwError(() => error));
    
    // Simulate the accept callback
    component.confirmDeleteTask(mockTasks[0]);
    const confirmCall = confirmationServiceSpy.confirm.mock.calls[0];
    const acceptCallback = confirmCall[0].accept;
    acceptCallback();
    
    expect(taskServiceSpy.deleteTask).toHaveBeenCalledWith(mockTasks[0].id);
    expect(toastServiceSpy.showError).toHaveBeenCalledWith('Failed to delete task', error.message);
  });

  it('should toggle task completion', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TasksPageComponent();
    });
    
    taskServiceSpy.toggleTaskCompletion.mockReturnValue(of(mockTasks[0]));
    
    component.onToggleTaskCompletion(mockTasks[0]);
    
    expect(taskServiceSpy.toggleTaskCompletion).toHaveBeenCalledWith(mockTasks[0].id);
    expect(toastServiceSpy.showSuccess).toHaveBeenCalledWith('Task marked as completed!');
  });

  it('should handle toggle completion error', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TasksPageComponent();
    });
    
    const error = new Error('Toggle failed');
    taskServiceSpy.toggleTaskCompletion.mockReturnValue(throwError(() => error));
    
    component.onToggleTaskCompletion(mockTasks[0]);
    
    expect(taskServiceSpy.toggleTaskCompletion).toHaveBeenCalledWith(mockTasks[0].id);
    expect(toastServiceSpy.showError).toHaveBeenCalledWith('Failed to update task status', error.message);
  });

  it('should call authService.logout when logout button is clicked', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TasksPageComponent();
    });
    
    component.onLogout();
    
    expect(authServiceSpy.logout).toHaveBeenCalled();
  });

  it('should track tasks by id', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TasksPageComponent();
    });
    
    expect(component.trackByTaskId(0, mockTasks[0])).toBe(mockTasks[0].id);
    expect(component.trackByTaskId(1, mockTasks[1])).toBe(mockTasks[1].id);
  });

  it('should return tasks observable', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TasksPageComponent();
    });
    
    expect(component.tasks).toBe(component.tasks$);
  });
});