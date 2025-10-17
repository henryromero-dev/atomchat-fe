# Domain Models Documentation

This document provides comprehensive information about all domain entities and models in the AtomChat Frontend application.

## Domain Architecture

The domain layer contains the core business entities and repository interfaces. These models represent the business concepts and rules of the application, independent of any external frameworks or technologies.

## Entities

### User Entity

**Location**: `src/app/domain/entities/user.entity.ts`

**Purpose**: Represents a user in the system.

**Properties**:
- `id: string` - Unique user identifier
- `email: string` - User's email address
- `createdAt: Date` - User creation timestamp
- `updatedAt: Date` - User last update timestamp

**Methods**:
```typescript
static fromPlainObject(obj: any): User
toPlainObject(): any
```

**Usage Example**:
```typescript
// Create user from API response
const user = User.fromPlainObject({
  id: '123',
  email: 'user@example.com',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z'
});

// Convert to plain object for API requests
const userData = user.toPlainObject();
```

### Task Entity

**Location**: `src/app/domain/entities/task.entity.ts`

**Purpose**: Represents a task in the system.

**Properties**:
- `id: string` - Unique task identifier
- `title: string` - Task title
- `description: string | null` - Task description (optional)
- `completed: boolean` - Task completion status
- `userId: string` - ID of the user who owns the task
- `createdAt: Date` - Task creation timestamp
- `updatedAt: Date` - Task last update timestamp

**Methods**:
```typescript
static fromPlainObject(obj: any): Task
toPlainObject(): any
toggleCompletion(): Task
```

**Usage Example**:
```typescript
// Create task from API response
const task = Task.fromPlainObject({
  id: '456',
  title: 'Complete documentation',
  description: 'Write comprehensive docs',
  completed: false,
  userId: '123',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z'
});

// Toggle completion status
const updatedTask = task.toggleCompletion();

// Convert to plain object for API requests
const taskData = task.toPlainObject();
```

### AuthState Entity

**Location**: `src/app/domain/entities/auth-state.entity.ts`

**Purpose**: Represents the authentication state of the application.

**Properties**:
- `user: User | null` - Current authenticated user
- `isAuthenticated: boolean` - Authentication status
- `isLoading: boolean` - Loading state for auth operations
- `error: string | null` - Authentication error message

**Usage Example**:
```typescript
// Create initial auth state
const authState = new AuthState(null, false, false, null);

// Create authenticated state
const authenticatedState = new AuthState(user, true, false, null);

// Create error state
const errorState = new AuthState(null, false, false, 'Login failed');
```

## Request/Response Models

### LoginRequest

**Location**: `src/app/domain/entities/login-request.entity.ts`

**Purpose**: Represents a login request.

**Properties**:
- `email: string` - User's email address

**Methods**:
```typescript
toPlainObject(): any
```

**Usage Example**:
```typescript
const loginRequest = new LoginRequest('user@example.com');
const requestData = loginRequest.toPlainObject();
```

### RegisterRequest

**Location**: `src/app/domain/entities/register-request.entity.ts`

**Purpose**: Represents a user registration request.

**Properties**:
- `email: string` - User's email address

**Methods**:
```typescript
toPlainObject(): any
```

**Usage Example**:
```typescript
const registerRequest = new RegisterRequest('user@example.com');
const requestData = registerRequest.toPlainObject();
```

### LoginResponse

**Location**: `src/app/domain/entities/login-response.entity.ts`

**Purpose**: Represents a login response from the API.

**Properties**:
- `accessToken: string` - JWT access token
- `user: User` - User information

**Methods**:
```typescript
static fromPlainObject(obj: any): LoginResponse
```

**Usage Example**:
```typescript
// Create from API response
const loginResponse = LoginResponse.fromPlainObject({
  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  user: {
    id: '123',
    email: 'user@example.com',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z'
  }
});
```

### CreateTaskRequest

**Location**: `src/app/domain/entities/create-task-request.entity.ts`

**Purpose**: Represents a task creation request.

**Properties**:
- `title: string` - Task title
- `description: string | null` - Task description (optional)
- `userId: string` - ID of the user creating the task

**Methods**:
```typescript
toPlainObject(): any
```

**Usage Example**:
```typescript
const createRequest = new CreateTaskRequest(
  'Complete documentation',
  'Write comprehensive docs',
  '123'
);
const requestData = createRequest.toPlainObject();
```

### UpdateTaskRequest

**Location**: `src/app/domain/entities/update-task-request.entity.ts`

**Purpose**: Represents a task update request.

**Properties**:
- `id: string` - Task ID to update
- `title: string` - Updated task title
- `description: string | null` - Updated task description
- `completed: boolean` - Updated completion status
- `userId: string` - ID of the user updating the task

**Methods**:
```typescript
toPlainObject(): any
```

**Usage Example**:
```typescript
const updateRequest = new UpdateTaskRequest(
  '456',
  'Updated task title',
  'Updated description',
  true,
  '123'
);
const requestData = updateRequest.toPlainObject();
```

## Repository Interfaces

### AuthRepository

**Location**: `src/app/domain/repositories/auth.repository.ts`

**Purpose**: Defines the contract for authentication data access.

**Methods**:
```typescript
login(request: LoginRequest): Observable<LoginResponse>
register(request: RegisterRequest): Observable<LoginResponse>
getCurrentUser(): Observable<User>
```

**Usage Example**:
```typescript
@Injectable()
export class AuthRepositoryImpl implements AuthRepository {
  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', request.toPlainObject())
      .pipe(map(response => LoginResponse.fromPlainObject(response)));
  }
  
  register(request: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/register', request.toPlainObject())
      .pipe(map(response => LoginResponse.fromPlainObject(response)));
  }
  
  getCurrentUser(): Observable<User> {
    return this.http.get<User>('/api/auth/me')
      .pipe(map(user => User.fromPlainObject(user)));
  }
}
```

### TaskRepository

**Location**: `src/app/domain/repositories/task.repository.ts`

**Purpose**: Defines the contract for task data access.

**Methods**:
```typescript
findAll(userId: string): Observable<Task[]>
create(request: CreateTaskRequest): Observable<Task>
update(request: UpdateTaskRequest): Observable<Task>
delete(taskId: string): Observable<void>
toggleCompletion(taskId: string): Observable<Task>
```

**Usage Example**:
```typescript
@Injectable()
export class TaskRepositoryImpl implements TaskRepository {
  findAll(userId: string): Observable<Task[]> {
    return this.http.get<Task[]>(`/api/tasks?userId=${userId}`)
      .pipe(map(tasks => tasks.map(task => Task.fromPlainObject(task))));
  }
  
  create(request: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>('/api/tasks', request.toPlainObject())
      .pipe(map(task => Task.fromPlainObject(task)));
  }
  
  update(request: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`/api/tasks/${request.id}`, request.toPlainObject())
      .pipe(map(task => Task.fromPlainObject(task)));
  }
  
  delete(taskId: string): Observable<void> {
    return this.http.delete<void>(`/api/tasks/${taskId}`);
  }
  
  toggleCompletion(taskId: string): Observable<Task> {
    return this.http.patch<Task>(`/api/tasks/${taskId}/toggle`, {})
      .pipe(map(task => Task.fromPlainObject(task)));
  }
}
```

## Domain Rules and Validations

### User Validation
- Email must be a valid email format
- User ID must be a non-empty string
- Timestamps must be valid Date objects

### Task Validation
- Title must be between 1 and 100 characters
- Description must be between 0 and 500 characters
- User ID must be a non-empty string
- Completion status must be boolean

### Authentication Validation
- Access tokens must be non-empty strings
- User must be valid User entity
- Auth state must be consistent

## Entity Factory Methods

### fromPlainObject Pattern
All entities implement the `fromPlainObject` static method for creating instances from API responses:

```typescript
static fromPlainObject(obj: any): EntityType {
  return new EntityType(
    obj.id,
    obj.property1,
    obj.property2,
    // ... other properties
  );
}
```

### toPlainObject Pattern
All entities implement the `toPlainObject` method for converting to API request format:

```typescript
toPlainObject(): any {
  return {
    id: this.id,
    property1: this.property1,
    property2: this.property2,
    // ... other properties
  };
}
```

## Domain Events

### Task Events
Tasks can emit domain events for state changes:

```typescript
export class Task {
  toggleCompletion(): Task {
    const updatedTask = new Task(
      this.id,
      this.title,
      this.description,
      !this.completed,
      this.userId,
      this.createdAt,
      new Date()
    );
    
    // Emit domain event
    DomainEventBus.emit(new TaskCompletionToggledEvent(updatedTask));
    
    return updatedTask;
  }
}
```

## Testing Domain Models

### Unit Testing Entities
Test entity behavior and validation:

```typescript
describe('Task Entity', () => {
  it('should create task from plain object', () => {
    const plainObject = {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      completed: false,
      userId: 'user1',
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z'
    };
    
    const task = Task.fromPlainObject(plainObject);
    
    expect(task.id).toBe('1');
    expect(task.title).toBe('Test Task');
    expect(task.completed).toBe(false);
  });
  
  it('should toggle completion status', () => {
    const task = new Task('1', 'Test Task', 'Description', false, 'user1');
    const toggledTask = task.toggleCompletion();
    
    expect(toggledTask.completed).toBe(true);
    expect(toggledTask.id).toBe(task.id);
  });
});
```

### Testing Repository Interfaces
Test repository implementations:

```typescript
describe('TaskRepositoryImpl', () => {
  let repository: TaskRepositoryImpl;
  let httpClient: jasmine.SpyObj<HttpClient>;
  
  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete', 'patch']);
    repository = new TaskRepositoryImpl(spy);
    httpClient = spy;
  });
  
  it('should find all tasks', () => {
    const mockTasks = [{ id: '1', title: 'Task 1', completed: false, userId: 'user1' }];
    httpClient.get.and.returnValue(of(mockTasks));
    
    repository.findAll('user1').subscribe(tasks => {
      expect(tasks).toHaveLength(1);
      expect(tasks[0].id).toBe('1');
    });
  });
});
```

## Best Practices

### 1. Entity Design
- Keep entities focused on business logic
- Use immutable objects where possible
- Implement proper validation
- Use factory methods for creation

### 2. Repository Design
- Define clear interfaces
- Use dependency injection
- Handle errors appropriately
- Map between domain and data models

### 3. Validation
- Validate input data
- Provide clear error messages
- Use consistent validation patterns
- Handle edge cases

### 4. Testing
- Test entity behavior
- Test repository implementations
- Mock external dependencies
- Test error scenarios

### 5. Domain Events
- Use events for loose coupling
- Keep events focused and specific
- Handle event propagation
- Test event emission

## Domain Model Relationships

### User-Task Relationship
- One user can have many tasks
- Tasks belong to one user
- User ID is required for task operations

### Authentication Flow
- Login creates authentication state
- Authentication state includes user information
- Logout clears authentication state

### Task Lifecycle
- Tasks are created with pending status
- Tasks can be updated or deleted
- Tasks can be marked as completed
- Task completion can be toggled

## Domain Model Serialization

### JSON Serialization
Entities handle JSON serialization/deserialization:

```typescript
// Serialize to JSON
const json = JSON.stringify(task.toPlainObject());

// Deserialize from JSON
const taskData = JSON.parse(json);
const task = Task.fromPlainObject(taskData);
```

### Date Handling
Dates are handled consistently across entities:

```typescript
// Convert string to Date
const date = new Date(dateString);

// Convert Date to string
const dateString = date.toISOString();
```

## Domain Model Extensions

### Adding New Properties
When adding new properties to entities:

1. Update constructor
2. Update `fromPlainObject` method
3. Update `toPlainObject` method
4. Update validation rules
5. Update tests

### Adding New Methods
When adding new methods to entities:

1. Keep methods focused on business logic
2. Maintain immutability where possible
3. Add proper validation
4. Write comprehensive tests
5. Update documentation
