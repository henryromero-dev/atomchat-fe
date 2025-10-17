# Testing Documentation

This document provides comprehensive information about testing strategies, patterns, and best practices for the AtomChat Frontend application.

## Testing Strategy

The application follows a comprehensive testing strategy that includes unit tests, integration tests, and end-to-end tests. The testing pyramid approach is used to ensure good coverage while maintaining fast feedback loops.

### Testing Pyramid

```
    /\
   /  \
  /    \  E2E Tests (Few, Slow, Expensive)
 /______\
/        \  Integration Tests (Some, Medium, Medium)
/__________\  Unit Tests (Many, Fast, Cheap)
```

### Testing Tools

- **Jest**: Unit testing framework
- **Angular Testing Library**: Component testing utilities
- **Jasmine**: Test assertion library
- **Karma**: Test runner (legacy, being phased out)
- **Playwright**: End-to-end testing framework

## Unit Testing

### Service Testing

#### Testing Application Services

**TaskApplicationService Testing**:
```typescript
describe('TaskApplicationService', () => {
  let service: TaskApplicationService;
  let mockRepository: jasmine.SpyObj<TaskRepository>;
  
  beforeEach(() => {
    const spy = jasmine.createSpyObj('TaskRepository', [
      'findAll',
      'create',
      'update',
      'delete',
      'toggleCompletion'
    ]);
    
    TestBed.configureTestingModule({
      providers: [
        TaskApplicationService,
        { provide: TASK_REPOSITORY, useValue: spy }
      ]
    });
    
    service = TestBed.inject(TaskApplicationService);
    mockRepository = TestBed.inject(TASK_REPOSITORY) as jasmine.SpyObj<TaskRepository>;
  });
  
  describe('loadTasks', () => {
    it('should load tasks successfully', () => {
      // Arrange
      const userId = 'user123';
      const mockTasks = [
        new Task('1', 'Task 1', 'Description 1', false, userId),
        new Task('2', 'Task 2', 'Description 2', true, userId)
      ];
      mockRepository.findAll.and.returnValue(of(mockTasks));
      
      // Act
      service.loadTasks(userId);
      
      // Assert
      service.getTasks().subscribe(tasks => {
        expect(tasks).toEqual(mockTasks);
      });
      expect(mockRepository.findAll).toHaveBeenCalledWith(userId);
    });
    
    it('should handle loading error', () => {
      // Arrange
      const userId = 'user123';
      const error = new Error('Network error');
      mockRepository.findAll.and.returnValue(throwError(() => error));
      
      // Act
      service.loadTasks(userId);
      
      // Assert
      service.getError().subscribe(errorMessage => {
        expect(errorMessage).toBe('Failed to load tasks');
      });
    });
  });
  
  describe('createTask', () => {
    it('should create task successfully', () => {
      // Arrange
      const request = new CreateTaskRequest('New Task', 'Description', 'user123');
      const createdTask = new Task('1', 'New Task', 'Description', false, 'user123');
      mockRepository.create.and.returnValue(of(createdTask));
      
      // Act
      service.createTask(request).subscribe();
      
      // Assert
      service.getTasks().subscribe(tasks => {
        expect(tasks).toContain(createdTask);
      });
      expect(mockRepository.create).toHaveBeenCalledWith(request);
    });
  });
  
  describe('toggleTaskCompletion', () => {
    it('should toggle task completion', () => {
      // Arrange
      const taskId = '1';
      const toggledTask = new Task('1', 'Task', 'Description', true, 'user123');
      mockRepository.toggleCompletion.and.returnValue(of(toggledTask));
      
      // Act
      service.toggleTaskCompletion(taskId).subscribe();
      
      // Assert
      service.getTasks().subscribe(tasks => {
        const task = tasks.find(t => t.id === taskId);
        expect(task?.completed).toBe(true);
      });
    });
  });
});
```

#### Testing Core Services

**ToastService Testing**:
```typescript
describe('ToastService', () => {
  let service: ToastService;
  let messageService: jasmine.SpyObj<MessageService>;
  
  beforeEach(() => {
    const spy = jasmine.createSpyObj('MessageService', ['add']);
    
    TestBed.configureTestingModule({
      providers: [
        ToastService,
        { provide: MessageService, useValue: spy }
      ]
    });
    
    service = TestBed.inject(ToastService);
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
  });
  
  it('should show success message', () => {
    // Arrange
    const message = 'Operation successful';
    const detail = 'Task created successfully';
    
    // Act
    service.showSuccess(message, detail);
    
    // Assert
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: message,
      detail: detail
    });
  });
  
  it('should show error message', () => {
    // Arrange
    const message = 'Operation failed';
    const detail = 'Network error';
    
    // Act
    service.showError(message, detail);
    
    // Assert
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: message,
      detail: detail
    });
  });
});
```

### Component Testing

#### Testing Page Components

**TasksPageComponent Testing**:
```typescript
describe('TasksPageComponent', () => {
  let component: TasksPageComponent;
  let fixture: ComponentFixture<TasksPageComponent>;
  let mockTaskService: jasmine.SpyObj<TaskApplicationService>;
  let mockAuthService: jasmine.SpyObj<AuthApplicationService>;
  let mockToastService: jasmine.SpyObj<ToastService>;
  
  beforeEach(async () => {
    const taskSpy = jasmine.createSpyObj('TaskApplicationService', [
      'getTasks',
      'getIsLoading',
      'getError',
      'loadTasks',
      'createTask',
      'updateTask',
      'deleteTask',
      'toggleTaskCompletion'
    ]);
    
    const authSpy = jasmine.createSpyObj('AuthApplicationService', [
      'getCurrentUser',
      'logout'
    ]);
    
    const toastSpy = jasmine.createSpyObj('ToastService', [
      'showSuccess',
      'showError'
    ]);
    
    await TestBed.configureTestingModule({
      imports: [TasksPageComponent],
      providers: [
        { provide: TaskApplicationService, useValue: taskSpy },
        { provide: AuthApplicationService, useValue: authSpy },
        { provide: ToastService, useValue: toastSpy }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(TasksPageComponent);
    component = fixture.componentInstance;
    mockTaskService = TestBed.inject(TaskApplicationService) as jasmine.SpyObj<TaskApplicationService>;
    mockAuthService = TestBed.inject(AuthApplicationService) as jasmine.SpyObj<AuthApplicationService>;
    mockToastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should load tasks on initialization', () => {
    // Arrange
    const mockUser = new User('user123', 'user@example.com');
    const mockTasks = [new Task('1', 'Task 1', 'Description', false, 'user123')];
    
    mockAuthService.getCurrentUser.and.returnValue(mockUser);
    mockTaskService.getTasks.and.returnValue(of(mockTasks));
    mockTaskService.getIsLoading.and.returnValue(of(false));
    mockTaskService.getError.and.returnValue(of(null));
    
    // Act
    component.ngOnInit();
    
    // Assert
    expect(mockTaskService.loadTasks).toHaveBeenCalledWith('user123');
  });
  
  it('should create task successfully', () => {
    // Arrange
    const taskData = { title: 'New Task', description: 'Description' };
    const createdTask = new Task('1', 'New Task', 'Description', false, 'user123');
    
    mockTaskService.createTask.and.returnValue(of(createdTask));
    component.currentUser = new User('user123', 'user@example.com');
    
    // Act
    component.onCreateTask(taskData);
    
    // Assert
    expect(mockTaskService.createTask).toHaveBeenCalled();
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('Task created successfully!');
    expect(component.showTaskForm).toBe(false);
  });
  
  it('should handle task creation error', () => {
    // Arrange
    const taskData = { title: 'New Task', description: 'Description' };
    const error = new Error('Network error');
    
    mockTaskService.createTask.and.returnValue(throwError(() => error));
    component.currentUser = new User('user123', 'user@example.com');
    
    // Act
    component.onCreateTask(taskData);
    
    // Assert
    expect(mockToastService.showError).toHaveBeenCalledWith(
      'Failed to create task',
      'Network error'
    );
  });
  
  it('should toggle task completion', () => {
    // Arrange
    const task = new Task('1', 'Task', 'Description', false, 'user123');
    const toggledTask = new Task('1', 'Task', 'Description', true, 'user123');
    
    mockTaskService.toggleTaskCompletion.and.returnValue(of(toggledTask));
    
    // Act
    component.onToggleTaskCompletion(task);
    
    // Assert
    expect(mockTaskService.toggleTaskCompletion).toHaveBeenCalledWith('1');
    expect(mockToastService.showSuccess).toHaveBeenCalledWith('Task marked as completed!');
  });
});
```

#### Testing Form Components

**TaskFormComponent Testing**:
```typescript
describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormComponent]
    }).compileComponents();
    
    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should initialize form with empty values', () => {
    // Assert
    expect(component.taskForm.get('title')?.value).toBe('');
    expect(component.taskForm.get('description')?.value).toBe('');
  });
  
  it('should populate form when editing task', () => {
    // Arrange
    const task = new Task('1', 'Test Task', 'Test Description', false, 'user123');
    
    // Act
    component.taskToEdit = task;
    component.ngOnChanges({
      taskToEdit: {
        currentValue: task,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    });
    
    // Assert
    expect(component.taskForm.get('title')?.value).toBe('Test Task');
    expect(component.taskForm.get('description')?.value).toBe('Test Description');
  });
  
  it('should emit taskSubmit when form is valid', () => {
    // Arrange
    spyOn(component.taskSubmit, 'emit');
    component.taskForm.patchValue({
      title: 'Test Task',
      description: 'Test Description'
    });
    
    // Act
    component.onSubmit();
    
    // Assert
    expect(component.taskSubmit.emit).toHaveBeenCalledWith({
      title: 'Test Task',
      description: 'Test Description'
    });
  });
  
  it('should not emit taskSubmit when form is invalid', () => {
    // Arrange
    spyOn(component.taskSubmit, 'emit');
    component.taskForm.patchValue({
      title: '', // Invalid: empty title
      description: 'Test Description'
    });
    
    // Act
    component.onSubmit();
    
    // Assert
    expect(component.taskSubmit.emit).not.toHaveBeenCalled();
  });
  
  it('should validate title field', () => {
    // Arrange
    const titleControl = component.taskForm.get('title');
    
    // Act & Assert
    titleControl?.setValue('');
    expect(titleControl?.hasError('required')).toBe(true);
    
    titleControl?.setValue('a'.repeat(101));
    expect(titleControl?.hasError('maxlength')).toBe(true);
    
    titleControl?.setValue('Valid Title');
    expect(titleControl?.valid).toBe(true);
  });
  
  it('should reset form on cancel', () => {
    // Arrange
    component.taskForm.patchValue({
      title: 'Test Task',
      description: 'Test Description'
    });
    spyOn(component.visibleChange, 'emit');
    
    // Act
    component.onCancel();
    
    // Assert
    expect(component.taskForm.get('title')?.value).toBe('');
    expect(component.taskForm.get('description')?.value).toBe('');
    expect(component.visibleChange.emit).toHaveBeenCalledWith(false);
  });
});
```

### Repository Testing

#### Testing Infrastructure Implementations

**TaskRepositoryImpl Testing**:
```typescript
describe('TaskRepositoryImpl', () => {
  let repository: TaskRepositoryImpl;
  let httpClient: jasmine.SpyObj<HttpClient>;
  
  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete', 'patch']);
    
    TestBed.configureTestingModule({
      providers: [
        TaskRepositoryImpl,
        { provide: HttpClient, useValue: spy }
      ]
    });
    
    repository = TestBed.inject(TaskRepositoryImpl);
    httpClient = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
  });
  
  describe('findAll', () => {
    it('should return tasks for user', () => {
      // Arrange
      const userId = 'user123';
      const mockResponse = [
        {
          id: '1',
          title: 'Task 1',
          description: 'Description 1',
          completed: false,
          userId: 'user123',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z'
        }
      ];
      httpClient.get.and.returnValue(of(mockResponse));
      
      // Act
      repository.findAll(userId).subscribe(tasks => {
        // Assert
        expect(tasks).toHaveLength(1);
        expect(tasks[0].id).toBe('1');
        expect(tasks[0].title).toBe('Task 1');
        expect(httpClient.get).toHaveBeenCalledWith(`${repository['apiUrl']}/tasks?userId=${userId}`);
      });
    });
  });
  
  describe('create', () => {
    it('should create new task', () => {
      // Arrange
      const request = new CreateTaskRequest('New Task', 'Description', 'user123');
      const mockResponse = {
        id: '1',
        title: 'New Task',
        description: 'Description',
        completed: false,
        userId: 'user123',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      };
      httpClient.post.and.returnValue(of(mockResponse));
      
      // Act
      repository.create(request).subscribe(task => {
        // Assert
        expect(task.id).toBe('1');
        expect(task.title).toBe('New Task');
        expect(httpClient.post).toHaveBeenCalledWith(
          `${repository['apiUrl']}/tasks`,
          request.toPlainObject()
        );
      });
    });
  });
});
```

## Integration Testing

### Component Integration Testing

**Task Management Flow Testing**:
```typescript
describe('Task Management Integration', () => {
  let component: TasksPageComponent;
  let fixture: ComponentFixture<TasksPageComponent>;
  let taskService: TaskApplicationService;
  let authService: AuthApplicationService;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksPageComponent],
      providers: [
        TaskApplicationService,
        AuthApplicationService,
        { provide: TASK_REPOSITORY, useClass: TaskRepositoryImpl },
        { provide: AUTH_REPOSITORY, useClass: AuthRepositoryImpl },
        { provide: HttpClient, useClass: HttpClientTestingModule }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(TasksPageComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskApplicationService);
    authService = TestBed.inject(AuthApplicationService);
  });
  
  it('should complete full task management flow', fakeAsync(() => {
    // Arrange
    const mockUser = new User('user123', 'user@example.com');
    const mockTasks = [new Task('1', 'Task 1', 'Description', false, 'user123')];
    
    spyOn(authService, 'getCurrentUser').and.returnValue(mockUser);
    spyOn(taskService, 'getTasks').and.returnValue(of(mockTasks));
    spyOn(taskService, 'getIsLoading').and.returnValue(of(false));
    spyOn(taskService, 'getError').and.returnValue(of(null));
    
    // Act
    component.ngOnInit();
    fixture.detectChanges();
    tick();
    
    // Assert
    expect(component.currentUser).toBe(mockUser);
    expect(component.tasks$).toBeDefined();
    
    // Test task creation
    const taskData = { title: 'New Task', description: 'Description' };
    spyOn(taskService, 'createTask').and.returnValue(of(new Task('2', 'New Task', 'Description', false, 'user123')));
    
    component.onCreateTask(taskData);
    tick();
    
    expect(taskService.createTask).toHaveBeenCalled();
  }));
});
```

### Service Integration Testing

**Authentication Flow Testing**:
```typescript
describe('Authentication Integration', () => {
  let authService: AuthApplicationService;
  let authRepository: AuthRepository;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthApplicationService,
        { provide: AUTH_REPOSITORY, useClass: AuthRepositoryImpl },
        { provide: HttpClient, useClass: HttpClientTestingModule }
      ]
    });
    
    authService = TestBed.inject(AuthApplicationService);
    authRepository = TestBed.inject(AUTH_REPOSITORY);
  });
  
  it('should handle complete authentication flow', () => {
    // Arrange
    const loginRequest = new LoginRequest('user@example.com');
    const mockResponse = {
      accessToken: 'token123',
      user: {
        id: 'user123',
        email: 'user@example.com',
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z'
      }
    };
    
    spyOn(authRepository, 'login').and.returnValue(of(mockResponse));
    
    // Act
    authService.login(loginRequest).subscribe();
    
    // Assert
    expect(authService.getCurrentUser()?.email).toBe('user@example.com');
    expect(authService.isAuthenticated()).toBe(true);
    expect(authService.getToken()).toBe('token123');
  });
});
```

## End-to-End Testing

### Playwright E2E Tests

**Task Management E2E Test**:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  
  test('should allow user to create and manage tasks', async ({ page }) => {
    // Login
    await page.fill('[data-testid="email-input"]', 'user@example.com');
    await page.click('[data-testid="login-button"]');
    
    // Wait for tasks page to load
    await expect(page.locator('[data-testid="tasks-page"]')).toBeVisible();
    
    // Create new task
    await page.click('[data-testid="add-task-button"]');
    await page.fill('[data-testid="task-title-input"]', 'New Task');
    await page.fill('[data-testid="task-description-input"]', 'Task Description');
    await page.click('[data-testid="submit-button"]');
    
    // Verify task is created
    await expect(page.locator('[data-testid="task-item"]')).toContainText('New Task');
    
    // Toggle task completion
    await page.click('[data-testid="task-checkbox"]');
    await expect(page.locator('[data-testid="task-item"]')).toHaveClass('completed');
    
    // Edit task
    await page.click('[data-testid="edit-task-button"]');
    await page.fill('[data-testid="task-title-input"]', 'Updated Task');
    await page.click('[data-testid="submit-button"]');
    
    // Verify task is updated
    await expect(page.locator('[data-testid="task-item"]')).toContainText('Updated Task');
    
    // Delete task
    await page.click('[data-testid="delete-task-button"]');
    await page.click('[data-testid="confirm-delete-button"]');
    
    // Verify task is deleted
    await expect(page.locator('[data-testid="task-item"]')).toHaveCount(0);
  });
  
  test('should handle authentication errors', async ({ page }) => {
    // Try to login with invalid email
    await page.fill('[data-testid="email-input"]', 'invalid-email');
    await page.click('[data-testid="login-button"]');
    
    // Verify error message
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Please enter a valid email address');
  });
  
  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network failure
    await page.route('**/api/tasks', route => route.abort());
    
    // Login
    await page.fill('[data-testid="email-input"]', 'user@example.com');
    await page.click('[data-testid="login-button"]');
    
    // Verify error handling
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Failed to load tasks');
  });
});
```

### E2E Test Configuration

**playwright.config.ts**:
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
  },
  
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  
  webServer: {
    command: 'npm start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Testing Utilities

### Test Helpers

**Test Data Factory**:
```typescript
export class TestDataFactory {
  static createUser(overrides: Partial<User> = {}): User {
    return new User(
      overrides.id || 'user123',
      overrides.email || 'user@example.com',
      overrides.createdAt || new Date('2023-01-01T00:00:00Z'),
      overrides.updatedAt || new Date('2023-01-01T00:00:00Z')
    );
  }
  
  static createTask(overrides: Partial<Task> = {}): Task {
    return new Task(
      overrides.id || 'task123',
      overrides.title || 'Test Task',
      overrides.description || 'Test Description',
      overrides.completed || false,
      overrides.userId || 'user123',
      overrides.createdAt || new Date('2023-01-01T00:00:00Z'),
      overrides.updatedAt || new Date('2023-01-01T00:00:00Z')
    );
  }
  
  static createTaskRequest(overrides: Partial<CreateTaskRequest> = {}): CreateTaskRequest {
    return new CreateTaskRequest(
      overrides.title || 'Test Task',
      overrides.description || 'Test Description',
      overrides.userId || 'user123'
    );
  }
}
```

**Mock Service Factory**:
```typescript
export class MockServiceFactory {
  static createTaskApplicationService(): jasmine.SpyObj<TaskApplicationService> {
    return jasmine.createSpyObj('TaskApplicationService', [
      'getTasks',
      'getIsLoading',
      'getError',
      'loadTasks',
      'createTask',
      'updateTask',
      'deleteTask',
      'toggleTaskCompletion'
    ]);
  }
  
  static createAuthApplicationService(): jasmine.SpyObj<AuthApplicationService> {
    return jasmine.createSpyObj('AuthApplicationService', [
      'getCurrentUser',
      'isAuthenticated',
      'getToken',
      'getAuthState',
      'login',
      'register',
      'logout'
    ]);
  }
}
```

### Custom Matchers

**Custom Jest Matchers**:
```typescript
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidTask(): R;
      toBeValidUser(): R;
    }
  }
}

expect.extend({
  toBeValidTask(received: Task) {
    const pass = received instanceof Task &&
      typeof received.id === 'string' &&
      typeof received.title === 'string' &&
      typeof received.completed === 'boolean' &&
      typeof received.userId === 'string';
    
    return {
      message: () => `expected ${received} to be a valid Task`,
      pass
    };
  },
  
  toBeValidUser(received: User) {
    const pass = received instanceof User &&
      typeof received.id === 'string' &&
      typeof received.email === 'string' &&
      received.email.includes('@');
    
    return {
      message: () => `expected ${received} to be a valid User`,
      pass
    };
  }
});
```

## Testing Best Practices

### 1. Test Structure

#### AAA Pattern (Arrange, Act, Assert)
```typescript
it('should create task successfully', () => {
  // Arrange
  const request = new CreateTaskRequest('New Task', 'Description', 'user123');
  const createdTask = new Task('1', 'New Task', 'Description', false, 'user123');
  mockRepository.create.and.returnValue(of(createdTask));
  
  // Act
  service.createTask(request).subscribe();
  
  // Assert
  expect(mockRepository.create).toHaveBeenCalledWith(request);
  service.getTasks().subscribe(tasks => {
    expect(tasks).toContain(createdTask);
  });
});
```

#### Descriptive Test Names
```typescript
// Good
it('should return tasks for authenticated user when loadTasks is called')

// Bad
it('should work')
```

### 2. Test Isolation

#### Independent Tests
```typescript
describe('TaskApplicationService', () => {
  let service: TaskApplicationService;
  let mockRepository: jasmine.SpyObj<TaskRepository>;
  
  beforeEach(() => {
    // Each test gets a fresh instance
    const spy = jasmine.createSpyObj('TaskRepository', ['findAll']);
    TestBed.configureTestingModule({
      providers: [
        TaskApplicationService,
        { provide: TASK_REPOSITORY, useValue: spy }
      ]
    });
    
    service = TestBed.inject(TaskApplicationService);
    mockRepository = TestBed.inject(TASK_REPOSITORY) as jasmine.SpyObj<TaskRepository>;
  });
  
  it('should load tasks', () => {
    // Test implementation
  });
  
  it('should handle errors', () => {
    // Test implementation
  });
});
```

### 3. Mocking Strategies

#### Mock External Dependencies
```typescript
// Mock HTTP client
const mockHttpClient = jasmine.createSpyObj('HttpClient', ['get', 'post']);

// Mock services
const mockTaskService = jasmine.createSpyObj('TaskApplicationService', ['loadTasks']);

// Mock observables
mockTaskService.loadTasks.and.returnValue(of(mockTasks));
```

#### Use Real Implementations When Appropriate
```typescript
// Use real service for integration tests
TestBed.configureTestingModule({
  providers: [
    TaskApplicationService,
    { provide: TASK_REPOSITORY, useClass: TaskRepositoryImpl }
  ]
});
```

### 4. Test Data Management

#### Use Test Data Factories
```typescript
// Good
const task = TestDataFactory.createTask({ title: 'Custom Title' });

// Bad
const task = new Task('1', 'Custom Title', 'Description', false, 'user123', new Date(), new Date());
```

#### Keep Test Data Minimal
```typescript
// Good
const task = TestDataFactory.createTask({ title: 'Test Task' });

// Bad
const task = TestDataFactory.createTask({
  id: '123',
  title: 'Test Task',
  description: 'Long description that is not needed for this test',
  completed: false,
  userId: 'user123',
  createdAt: new Date('2023-01-01T00:00:00Z'),
  updatedAt: new Date('2023-01-01T00:00:00Z')
});
```

### 5. Error Testing

#### Test Error Scenarios
```typescript
it('should handle network errors', () => {
  // Arrange
  const error = new HttpErrorResponse({
    status: 500,
    statusText: 'Internal Server Error'
  });
  mockRepository.findAll.and.returnValue(throwError(() => error));
  
  // Act
  service.loadTasks('user123');
  
  // Assert
  service.getError().subscribe(errorMessage => {
    expect(errorMessage).toBe('Failed to load tasks');
  });
});
```

#### Test Edge Cases
```typescript
it('should handle empty task list', () => {
  // Arrange
  mockRepository.findAll.and.returnValue(of([]));
  
  // Act
  service.loadTasks('user123');
  
  // Assert
  service.getTasks().subscribe(tasks => {
    expect(tasks).toEqual([]);
  });
});
```

## Test Coverage

### Coverage Configuration

**jest.config.js**:
```javascript
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts',
    '!src/app/**/*.module.ts',
    '!src/app/**/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  coverageReporters: ['text', 'lcov', 'html']
};
```

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
open coverage/lcov-report/index.html
```

### Coverage Goals

- **Unit Tests**: 90%+ coverage for services and utilities
- **Component Tests**: 80%+ coverage for components
- **Integration Tests**: 70%+ coverage for complete workflows
- **E2E Tests**: 100% coverage for critical user paths

## Continuous Integration

### GitHub Actions Workflow

**.github/workflows/test.yml**:
```yaml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:coverage
      
      - name: Run E2E tests
        run: npm run e2e
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella
```

## Testing Troubleshooting

### Common Issues

#### Test Timeouts
```typescript
// Increase timeout for slow tests
it('should handle long operation', async () => {
  // Test implementation
}, 10000);
```

#### Mock Issues
```typescript
// Ensure mocks are properly configured
beforeEach(() => {
  mockRepository.findAll.and.returnValue(of([]));
  mockRepository.create.and.returnValue(of(mockTask));
});
```

#### Async Testing
```typescript
// Use fakeAsync and tick for async operations
it('should handle async operation', fakeAsync(() => {
  // Arrange
  mockService.asyncMethod.and.returnValue(of(result));
  
  // Act
  component.performAsyncOperation();
  tick();
  
  // Assert
  expect(component.result).toBe(result);
}));
```

### Debugging Tests

#### Debug Mode
```bash
# Run tests in debug mode
npm run test -- --verbose --no-coverage

# Run specific test file
npm run test -- --testNamePattern="TaskApplicationService"
```

#### Visual Debugging
```typescript
// Use browser debugging for component tests
it('should render correctly', () => {
  fixture.detectChanges();
  console.log(fixture.debugElement.nativeElement.innerHTML);
});
```

## Testing Checklist

### Before Writing Tests
- [ ] Understand the component/service behavior
- [ ] Identify dependencies and mock requirements
- [ ] Plan test scenarios (happy path, error cases, edge cases)
- [ ] Set up test data factories if needed

### While Writing Tests
- [ ] Follow AAA pattern (Arrange, Act, Assert)
- [ ] Use descriptive test names
- [ ] Test both success and error scenarios
- [ ] Mock external dependencies
- [ ] Keep tests independent and isolated

### After Writing Tests
- [ ] Run tests to ensure they pass
- [ ] Check test coverage
- [ ] Review test code for clarity
- [ ] Ensure tests are maintainable
- [ ] Document complex test scenarios
