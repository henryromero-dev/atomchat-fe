# API Reference

This document provides comprehensive information about the API interfaces, data models, and HTTP endpoints used in the AtomChat Frontend application.

## Table of Contents

- [Authentication API](#authentication-api)
- [Task Management API](#task-management-api)
- [Data Models](#data-models)
- [Error Handling](#error-handling)
- [HTTP Interceptors](#http-interceptors)

## Authentication API

### Login Endpoint

**POST** `/api/auth/login`

Authenticates a user with their email address.

#### Request Body
```typescript
interface LoginRequest {
  email: string;
}
```

#### Response
```typescript
interface LoginResponse {
  accessToken: string;
  user: User;
}
```

#### Example Usage
```typescript
const loginRequest = new LoginRequest('user@example.com');
this.authService.login(loginRequest).subscribe({
  next: (response) => {
    console.log('Login successful:', response.user);
    // Token is automatically stored
  },
  error: (error) => {
    console.error('Login failed:', error);
  }
});
```

### Register Endpoint

**POST** `/api/auth/register`

Registers a new user with their email address.

#### Request Body
```typescript
interface RegisterRequest {
  email: string;
}
```

#### Response
```typescript
interface LoginResponse {
  accessToken: string;
  user: User;
}
```

#### Example Usage
```typescript
const registerRequest = new RegisterRequest('newuser@example.com');
this.authService.register(registerRequest).subscribe({
  next: (response) => {
    console.log('Registration successful:', response.user);
  },
  error: (error) => {
    console.error('Registration failed:', error);
  }
});
```

### Get Current User Endpoint

**GET** `/api/auth/me`

Retrieves the current authenticated user's information.

#### Headers
```
Authorization: Bearer <access_token>
```

#### Response
```typescript
interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Example Usage
```typescript
this.authService.getCurrentUser().subscribe({
  next: (user) => {
    console.log('Current user:', user);
  },
  error: (error) => {
    console.error('Failed to get user:', error);
  }
});
```

## Task Management API

### Get Tasks Endpoint

**GET** `/api/tasks`

Retrieves all tasks for the authenticated user.

#### Query Parameters
- `userId` (string, required): ID of the user whose tasks to retrieve

#### Headers
```
Authorization: Bearer <access_token>
```

#### Response
```typescript
interface Task[] {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Example Usage
```typescript
this.taskService.loadTasks('user123');
this.taskService.getTasks().subscribe(tasks => {
  console.log('User tasks:', tasks);
});
```

### Create Task Endpoint

**POST** `/api/tasks`

Creates a new task for the authenticated user.

#### Request Body
```typescript
interface CreateTaskRequest {
  title: string;
  description?: string;
  userId: string;
}
```

#### Headers
```
Authorization: Bearer <access_token>
```

#### Response
```typescript
interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Example Usage
```typescript
const request = new CreateTaskRequest(
  'New Task',
  'Task description',
  'user123'
);
this.taskService.createTask(request).subscribe({
  next: (task) => {
    console.log('Task created:', task);
  },
  error: (error) => {
    console.error('Failed to create task:', error);
  }
});
```

### Update Task Endpoint

**PUT** `/api/tasks/:id`

Updates an existing task.

#### URL Parameters
- `id` (string, required): ID of the task to update

#### Request Body
```typescript
interface UpdateTaskRequest {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
}
```

#### Headers
```
Authorization: Bearer <access_token>
```

#### Response
```typescript
interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Example Usage
```typescript
const updateRequest = new UpdateTaskRequest(
  'task123',
  'Updated Task Title',
  'Updated description',
  true,
  'user123'
);
this.taskService.updateTask(updateRequest).subscribe({
  next: (task) => {
    console.log('Task updated:', task);
  },
  error: (error) => {
    console.error('Failed to update task:', error);
  }
});
```

### Delete Task Endpoint

**DELETE** `/api/tasks/:id`

Deletes a task by ID.

#### URL Parameters
- `id` (string, required): ID of the task to delete

#### Headers
```
Authorization: Bearer <access_token>
```

#### Response
```
204 No Content
```

#### Example Usage
```typescript
this.taskService.deleteTask('task123').subscribe({
  next: () => {
    console.log('Task deleted successfully');
  },
  error: (error) => {
    console.error('Failed to delete task:', error);
  }
});
```

### Toggle Task Completion Endpoint

**PATCH** `/api/tasks/:id/toggle`

Toggles the completion status of a task.

#### URL Parameters
- `id` (string, required): ID of the task to toggle

#### Headers
```
Authorization: Bearer <access_token>
```

#### Response
```typescript
interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Example Usage
```typescript
this.taskService.toggleTaskCompletion('task123').subscribe({
  next: (task) => {
    console.log('Task completion toggled:', task);
  },
  error: (error) => {
    console.error('Failed to toggle task:', error);
  }
});
```

## Data Models

### User Model

```typescript
class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  /**
   * Creates a User instance from a plain object
   * @param obj - Plain object containing user data
   * @returns User instance
   */
  static fromPlainObject(obj: any): User {
    return new User(
      obj.id,
      obj.email,
      new Date(obj.createdAt),
      new Date(obj.updatedAt)
    );
  }

  /**
   * Converts User instance to plain object
   * @returns Plain object representation
   */
  toPlainObject(): any {
    return {
      id: this.id,
      email: this.email,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }
}
```

### Task Model

```typescript
class Task {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string | null,
    public readonly completed: boolean,
    public readonly userId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  /**
   * Creates a Task instance from a plain object
   * @param obj - Plain object containing task data
   * @returns Task instance
   */
  static fromPlainObject(obj: any): Task {
    return new Task(
      obj.id,
      obj.title,
      obj.description,
      obj.completed,
      obj.userId,
      new Date(obj.createdAt),
      new Date(obj.updatedAt)
    );
  }

  /**
   * Converts Task instance to plain object
   * @returns Plain object representation
   */
  toPlainObject(): any {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      userId: this.userId,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }

  /**
   * Creates a new Task instance with toggled completion status
   * @returns New Task instance with opposite completion status
   */
  toggleCompletion(): Task {
    return new Task(
      this.id,
      this.title,
      this.description,
      !this.completed,
      this.userId,
      this.createdAt,
      new Date()
    );
  }
}
```

### AuthState Model

```typescript
class AuthState {
  constructor(
    public readonly user: User | null,
    public readonly isAuthenticated: boolean,
    public readonly isLoading: boolean,
    public readonly error: string | null
  ) {}
}
```

### Request/Response Models

#### LoginRequest
```typescript
class LoginRequest {
  constructor(public readonly email: string) {}

  toPlainObject(): any {
    return { email: this.email };
  }
}
```

#### RegisterRequest
```typescript
class RegisterRequest {
  constructor(public readonly email: string) {}

  toPlainObject(): any {
    return { email: this.email };
  }
}
```

#### LoginResponse
```typescript
class LoginResponse {
  constructor(
    public readonly accessToken: string,
    public readonly user: User
  ) {}

  static fromPlainObject(obj: any): LoginResponse {
    return new LoginResponse(
      obj.accessToken,
      User.fromPlainObject(obj.user)
    );
  }
}
```

#### CreateTaskRequest
```typescript
class CreateTaskRequest {
  constructor(
    public readonly title: string,
    public readonly description: string | null,
    public readonly userId: string
  ) {}

  toPlainObject(): any {
    return {
      title: this.title,
      description: this.description,
      userId: this.userId
    };
  }
}
```

#### UpdateTaskRequest
```typescript
class UpdateTaskRequest {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string | null,
    public readonly completed: boolean,
    public readonly userId: string
  ) {}

  toPlainObject(): any {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      userId: this.userId
    };
  }
}
```

## Error Handling

### HTTP Error Response Format

```typescript
interface HttpErrorResponse {
  status: number;
  statusText: string;
  error: {
    error: string;
    message?: string;
  };
}
```

### Common Error Codes

| Status Code | Description | Common Causes |
|-------------|-------------|---------------|
| 400 | Bad Request | Invalid request data, validation errors |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found (user, task, etc.) |
| 409 | Conflict | Resource already exists (duplicate email) |
| 500 | Internal Server Error | Server-side error |

### Error Handling in Services

```typescript
// Example error handling in TaskApplicationService
public createTask(request: CreateTaskRequest): Observable<Task> {
  this.setLoading(true);
  this.clearError();

  return this.taskRepository.create(request).pipe(
    tap((task: Task) => {
      // Handle success
      const currentState = this.stateSubject.value;
      const updatedTasks = [...currentState.tasks, task];
      this.updateState({ tasks: updatedTasks, isLoading: false });
    }),
    catchError((error) => {
      // Handle error
      this.setError('Failed to create task');
      this.setLoading(false);
      return throwError(() => error);
    })
  );
}
```

### Error Handling in Components

```typescript
// Example error handling in component
this.taskService.createTask(request).subscribe({
  next: (task) => {
    this.toastService.showSuccess('Task created successfully!');
    this.hideTaskForm();
  },
  error: (error) => {
    this.toastService.showError('Failed to create task', error.message);
  }
});
```

## HTTP Interceptors

### Auth Interceptor

Automatically adds authentication headers to HTTP requests.

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

### Error Interceptor

Provides centralized error handling for HTTP requests.

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

### Loading Interceptor

Manages loading states for HTTP requests.

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

## Repository Interfaces

### AuthRepository Interface

```typescript
export interface AuthRepository {
  /**
   * Authenticates a user with login credentials
   * @param request - Login request containing user email
   * @returns Observable of login response with token and user data
   */
  login(request: LoginRequest): Observable<LoginResponse>;

  /**
   * Registers a new user
   * @param request - Registration request containing user email
   * @returns Observable of login response with token and user data
   */
  register(request: RegisterRequest): Observable<LoginResponse>;

  /**
   * Gets the current authenticated user
   * @returns Observable of current user data
   */
  getCurrentUser(): Observable<User>;
}
```

### TaskRepository Interface

```typescript
export interface TaskRepository {
  /**
   * Retrieves all tasks for a specific user
   * @param userId - ID of the user whose tasks to retrieve
   * @returns Observable of tasks array
   */
  findAll(userId: string): Observable<Task[]>;

  /**
   * Creates a new task
   * @param request - Task creation request
   * @returns Observable of the created task
   */
  create(request: CreateTaskRequest): Observable<Task>;

  /**
   * Updates an existing task
   * @param request - Task update request
   * @returns Observable of the updated task
   */
  update(request: UpdateTaskRequest): Observable<Task>;

  /**
   * Deletes a task by ID
   * @param taskId - ID of the task to delete
   * @returns Observable of void
   */
  delete(taskId: string): Observable<void>;

  /**
   * Toggles task completion status
   * @param taskId - ID of the task to toggle
   * @returns Observable of the updated task
   */
  toggleCompletion(taskId: string): Observable<Task>;
}
```

## Configuration

### Environment Configuration

```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};

// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.atomchat.com/api'
};
```

### HTTP Client Configuration

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        errorInterceptor,
        loadingInterceptor,
      ])
    ),
    // ... other providers
  ],
};
```

## Best Practices

### 1. Error Handling
- Always handle both success and error cases
- Provide user-friendly error messages
- Log errors for debugging purposes
- Use appropriate HTTP status codes

### 2. Authentication
- Store tokens securely in localStorage
- Implement automatic token refresh
- Handle token expiration gracefully
- Clear tokens on logout

### 3. State Management
- Use centralized state management
- Keep state immutable
- Handle loading and error states
- Provide clear state selectors

### 4. API Design
- Use consistent naming conventions
- Implement proper validation
- Provide comprehensive error responses
- Use appropriate HTTP methods

### 5. Performance
- Implement request caching where appropriate
- Use pagination for large datasets
- Optimize bundle size
- Monitor API performance
