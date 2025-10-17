# Services Documentation

This document provides comprehensive information about all services in the AtomChat Frontend application, including application services, core services, and infrastructure implementations.

## Service Architecture

Services in the application follow the hexagonal architecture pattern, organized into different layers:

- **Application Services**: Business logic and state management
- **Core Services**: Shared utilities and cross-cutting concerns
- **Infrastructure Services**: External service implementations

## Application Services

### TaskApplicationService

**Location**: `src/app/application/services/task-application.service.ts`

**Purpose**: Manages task-related business logic and state.

**Features**:
- Centralized task state management
- CRUD operations for tasks
- Loading and error state handling
- Reactive state updates

**State Interface**:
```typescript
interface TaskState {
    tasks: Task[];
    isLoading: boolean;
    error: string | null;
}
```

**Key Methods**:

#### State Getters
```typescript
getTasks(): Observable<Task[]>
getIsLoading(): Observable<boolean>
getError(): Observable<string | null>
```

#### Task Operations
```typescript
loadTasks(userId: string): void
createTask(request: CreateTaskRequest): Observable<Task>
updateTask(request: UpdateTaskRequest): Observable<Task>
deleteTask(taskId: string): Observable<void>
toggleTaskCompletion(taskId: string): Observable<Task>
```

**Usage Example**:
```typescript
@Component({})
export class TasksComponent {
  private readonly taskService = inject(TaskApplicationService);
  
  ngOnInit() {
    // Load tasks for current user
    this.taskService.loadTasks(this.currentUser.id);
    
    // Subscribe to tasks
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }
  
  createTask(taskData: CreateTaskRequest) {
    this.taskService.createTask(taskData).subscribe({
      next: (task) => console.log('Task created:', task),
      error: (error) => console.error('Error:', error)
    });
  }
}
```

**State Management**:
- Uses `BehaviorSubject` for reactive state
- Immutable state updates
- Automatic UI updates on state changes
- Centralized error handling

### AuthApplicationService

**Location**: `src/app/application/services/auth-application.service.ts`

**Purpose**: Manages user authentication and authorization state.

**Features**:
- User authentication and registration
- Token management
- Authentication state persistence
- Automatic token verification

**State Interface**:
```typescript
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}
```

**Key Methods**:

#### Authentication Operations
```typescript
login(request: LoginRequest): Observable<LoginResponse>
register(request: RegisterRequest): Observable<LoginResponse>
logout(): void
```

#### State Getters
```typescript
getCurrentUser(): User | null
isAuthenticated(): boolean
getToken(): string | null
getAuthState(): Observable<AuthState>
```

**Usage Example**:
```typescript
@Component({})
export class LoginComponent {
  private readonly authService = inject(AuthApplicationService);
  
  login(email: string) {
    const request = new LoginRequest(email);
    this.authService.login(request).subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: (error) => this.handleError(error)
    });
  }
  
  checkAuthStatus() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/tasks']);
    }
  }
}
```

**Token Management**:
- Automatic token storage in localStorage
- Token verification on app initialization
- Secure token handling
- Automatic logout on token expiration

## Core Services

### ToastService

**Location**: `src/app/core/services/toast.service.ts`

**Purpose**: Provides centralized toast notification functionality.

**Features**:
- Success, error, warning, and info notifications
- Consistent notification styling
- Auto-dismiss functionality
- Message queuing

**Key Methods**:
```typescript
showSuccess(message: string, detail?: string): void
showError(message: string, detail?: string): void
showWarning(message: string, detail?: string): void
showInfo(message: string, detail?: string): void
```

**Usage Example**:
```typescript
@Component({})
export class ExampleComponent {
  private readonly toastService = inject(ToastService);
  
  onSuccess() {
    this.toastService.showSuccess('Operation completed successfully!');
  }
  
  onError(error: any) {
    this.toastService.showError('Operation failed', error.message);
  }
}
```

### LoadingService

**Location**: `src/app/core/services/loading.service.ts`

**Purpose**: Manages global loading state across the application.

**Features**:
- Global loading indicator
- Request-based loading tracking
- Automatic loading state management
- Loading state persistence

**Key Methods**:
```typescript
setLoading(loading: boolean): void
getLoading(): Observable<boolean>
```

**Usage Example**:
```typescript
@Component({})
export class ExampleComponent {
  private readonly loadingService = inject(LoadingService);
  
  async performOperation() {
    this.loadingService.setLoading(true);
    try {
      await this.someAsyncOperation();
    } finally {
      this.loadingService.setLoading(false);
    }
  }
}
```

## HTTP Interceptors

### AuthInterceptor

**Location**: `src/app/core/interceptors/auth.interceptor.ts`

**Purpose**: Automatically adds authentication headers to HTTP requests.

**Features**:
- Automatic token injection
- Request/response handling
- Token refresh logic
- Error handling

**Implementation**:
```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthApplicationService);
  const token = authService.getToken();
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req);
};
```

### ErrorInterceptor

**Location**: `src/app/core/interceptors/error.interceptor.ts`

**Purpose**: Centralized error handling for HTTP requests.

**Features**:
- Global error handling
- User-friendly error messages
- Automatic error logging
- Error state management

**Implementation**:
```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';
      
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toastService.showError('Request Failed', errorMessage);
      return throwError(() => error);
    })
  );
};
```

### LoadingInterceptor

**Location**: `src/app/core/interceptors/loading.interceptor.ts`

**Purpose**: Manages loading states for HTTP requests.

**Features**:
- Automatic loading state management
- Request counting
- Loading state optimization
- Error handling

**Implementation**:
```typescript
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);
  
  loadingService.setLoading(true);
  
  return next(req).pipe(
    finalize(() => {
      loadingService.setLoading(false);
    })
  );
};
```

## Infrastructure Services

### TaskRepository Implementation

**Location**: `src/app/infrastructure/repositories/task.repository.impl.ts`

**Purpose**: Implements task data access using HTTP requests.

**Features**:
- HTTP-based task operations
- Error handling
- Request/response mapping
- Type safety

**Key Methods**:
```typescript
findAll(userId: string): Observable<Task[]>
create(request: CreateTaskRequest): Observable<Task>
update(request: UpdateTaskRequest): Observable<Task>
delete(taskId: string): Observable<void>
toggleCompletion(taskId: string): Observable<Task>
```

**Implementation Example**:
```typescript
@Injectable()
export class TaskRepositoryImpl implements TaskRepository {
  constructor(private readonly http: HttpClient) {}
  
  findAll(userId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/tasks?userId=${userId}`)
      .pipe(map(tasks => tasks.map(task => Task.fromPlainObject(task))));
  }
  
  create(request: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, request.toPlainObject())
      .pipe(map(task => Task.fromPlainObject(task)));
  }
}
```

### AuthRepository Implementation

**Location**: `src/app/infrastructure/repositories/auth.repository.impl.ts`

**Purpose**: Implements authentication data access using HTTP requests.

**Features**:
- HTTP-based authentication
- Token handling
- User management
- Error handling

**Key Methods**:
```typescript
login(request: LoginRequest): Observable<LoginResponse>
register(request: RegisterRequest): Observable<LoginResponse>
getCurrentUser(): Observable<User>
```

## Service Configuration

### Dependency Injection

Services are configured using Angular's dependency injection system:

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    // Application services
    TaskApplicationService,
    AuthApplicationService,
    
    // Core services
    ToastService,
    LoadingService,
    
    // Infrastructure providers
    ...TASK_INFRASTRUCTURE_PROVIDERS,
    ...AUTH_INFRASTRUCTURE_PROVIDERS,
    
    // HTTP interceptors
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        errorInterceptor,
        loadingInterceptor,
      ])
    ),
  ],
};
```

### Infrastructure Providers

Infrastructure providers configure repository implementations:

```typescript
// task-infrastructure.provider.ts
export const TASK_INFRASTRUCTURE_PROVIDERS: Provider[] = [
  TaskRepositoryImpl,
  {
    provide: TASK_REPOSITORY,
    useExisting: TaskRepositoryImpl,
  },
];
```

## Service Testing

### Unit Testing Services

Services are tested using Angular testing utilities:

```typescript
describe('TaskApplicationService', () => {
  let service: TaskApplicationService;
  let mockRepository: jasmine.SpyObj<TaskRepository>;
  
  beforeEach(() => {
    const spy = jasmine.createSpyObj('TaskRepository', ['findAll', 'create']);
    
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
    const mockTasks = [new Task('1', 'Test Task', 'Test Description', false, 'user1')];
    mockRepository.findAll.and.returnValue(of(mockTasks));
    
    service.loadTasks('user1');
    
    expect(mockRepository.findAll).toHaveBeenCalledWith('user1');
  });
});
```

### Testing State Management

Test state management and reactive updates:

```typescript
it('should update state when tasks are loaded', () => {
  const mockTasks = [new Task('1', 'Test Task', 'Test Description', false, 'user1')];
  mockRepository.findAll.and.returnValue(of(mockTasks));
  
  service.loadTasks('user1');
  
  service.getTasks().subscribe(tasks => {
    expect(tasks).toEqual(mockTasks);
  });
});
```

## Best Practices

### 1. Service Design
- Keep services focused on single responsibility
- Use dependency injection for loose coupling
- Implement proper error handling
- Use reactive patterns with observables

### 2. State Management
- Use BehaviorSubject for state management
- Keep state immutable
- Provide clear state selectors
- Handle loading and error states

### 3. Error Handling
- Centralize error handling
- Provide user-friendly error messages
- Log errors for debugging
- Implement retry logic where appropriate

### 4. Testing
- Write comprehensive unit tests
- Mock external dependencies
- Test state management
- Test error scenarios

### 5. Performance
- Use OnPush change detection
- Implement proper subscription management
- Avoid memory leaks
- Optimize HTTP requests

## Service Lifecycle

### Initialization
Services are initialized when first injected:

```typescript
@Injectable({ providedIn: 'root' })
export class ExampleService {
  constructor() {
    // Service initialization
    this.initializeService();
  }
  
  private initializeService() {
    // Setup logic
  }
}
```

### Cleanup
Services should clean up resources when destroyed:

```typescript
@Injectable({ providedIn: 'root' })
export class ExampleService implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## Service Communication

### Inter-Service Communication
Services can communicate through shared state or direct injection:

```typescript
@Injectable({ providedIn: 'root' })
export class ServiceA {
  private readonly serviceB = inject(ServiceB);
  
  doSomething() {
    // Use serviceB
    this.serviceB.performAction();
  }
}
```

### Event-Based Communication
Use observables for loose coupling:

```typescript
@Injectable({ providedIn: 'root' })
export class EventService {
  private readonly eventSubject = new Subject<string>();
  public readonly events$ = this.eventSubject.asObservable();
  
  emitEvent(event: string) {
    this.eventSubject.next(event);
  }
}
```
