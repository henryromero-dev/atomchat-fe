# Development Guide

This guide provides comprehensive information for developers working on the AtomChat Frontend application, including coding standards, best practices, and development workflows.

## Development Environment Setup

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- Angular CLI 17.x or higher
- Git
- VS Code (recommended) with Angular extensions

### Recommended VS Code Extensions
- Angular Language Service
- TypeScript Importer
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens

## Coding Standards

### TypeScript Standards

#### Naming Conventions
```typescript
// Classes and interfaces - PascalCase
export class TaskApplicationService {}
export interface TaskState {}

// Variables and functions - camelCase
const taskService = inject(TaskApplicationService);
function loadTasks() {}

// Constants - UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:3000/api';
const MAX_RETRY_ATTEMPTS = 3;

// Enums - PascalCase
enum TaskStatus {
  PENDING = 'pending',
  COMPLETED = 'completed'
}
```

#### Type Definitions
```typescript
// Use explicit types
const tasks: Task[] = [];
const isLoading: boolean = false;

// Use interfaces for object shapes
interface TaskFormData {
  title: string;
  description?: string;
}

// Use union types for limited values
type TaskStatus = 'pending' | 'completed' | 'cancelled';

// Use generic types
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}
```

#### Function Definitions
```typescript
// Use arrow functions for short functions
const formatDate = (date: Date): string => date.toISOString();

// Use function declarations for complex functions
function processTaskData(taskData: TaskFormData): CreateTaskRequest {
  // Complex logic here
  return new CreateTaskRequest(taskData.title, taskData.description, userId);
}

// Use async/await for asynchronous operations
async function loadUserTasks(userId: string): Promise<Task[]> {
  try {
    const response = await this.taskRepository.findAll(userId).toPromise();
    return response;
  } catch (error) {
    console.error('Failed to load tasks:', error);
    throw error;
  }
}
```

### Angular Standards

#### Component Structure
```typescript
@Component({
  selector: 'app-task-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TaskItemComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit, OnDestroy {
  // Dependencies first
  private readonly taskService = inject(TaskApplicationService);
  private readonly router = inject(Router);
  
  // Public properties
  public readonly tasks$ = this.taskService.getTasks();
  public readonly isLoading$ = this.taskService.getIsLoading();
  
  // Private properties
  private readonly destroy$ = new Subject<void>();
  
  // Lifecycle hooks
  ngOnInit() {
    // Initialization logic
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  // Public methods
  public onTaskClick(task: Task): void {
    // Handle task click
  }
  
  // Private methods
  private loadTasks(): void {
    // Load tasks logic
  }
}
```

#### Service Structure
```typescript
@Injectable({ providedIn: 'root' })
export class TaskApplicationService {
  // Private properties
  private readonly initialState: TaskState = {
    tasks: [],
    isLoading: false,
    error: null
  };
  
  private readonly stateSubject = new BehaviorSubject<TaskState>(this.initialState);
  
  // Public observables
  public readonly state$ = this.stateSubject.asObservable();
  
  // Constructor
  constructor(@Inject(TASK_REPOSITORY) private readonly taskRepository: TaskRepository) {}
  
  // Public methods
  public getTasks(): Observable<Task[]> {
    return this.state$.pipe(map(state => state.tasks));
  }
  
  // Private methods
  private updateState(partialState: Partial<TaskState>): void {
    const currentState = this.stateSubject.value;
    const newState = { ...currentState, ...partialState };
    this.stateSubject.next(newState);
  }
}
```

### HTML Template Standards

#### Template Structure
```html
<!-- Component template -->
<div class="task-list-container">
  <!-- Header section -->
  <div class="task-list-header">
    <h2>Tasks</h2>
    <button 
      type="button" 
      class="btn btn-primary"
      (click)="onAddTask()">
      Add Task
    </button>
  </div>
  
  <!-- Content section -->
  <div class="task-list-content">
    <!-- Loading state -->
    <div *ngIf="isLoading$ | async" class="loading-spinner">
      <p-progressSpinner></p-progressSpinner>
    </div>
    
    <!-- Error state -->
    <div *ngIf="error$ | async as error" class="error-message">
      <p-message severity="error" [text]="error"></p-message>
    </div>
    
    <!-- Task list -->
    <div *ngIf="tasks$ | async as tasks" class="task-list">
      <app-task-item
        *ngFor="let task of tasks; trackBy: trackByTaskId"
        [task]="task"
        (taskClick)="onTaskClick($event)"
        (taskDelete)="onTaskDelete($event)">
      </app-task-item>
    </div>
  </div>
</div>
```

#### Attribute Binding
```html
<!-- Use property binding for dynamic values -->
<input 
  type="text" 
  [value]="taskTitle"
  [disabled]="isLoading"
  [class.error]="hasError">

<!-- Use event binding for user interactions -->
<button 
  type="button"
  (click)="onSubmit()"
  (keydown.enter)="onSubmit()">
  Submit
</button>

<!-- Use two-way binding sparingly -->
<input 
  type="text"
  [(ngModel)]="formData.title">
```

### SCSS Standards

#### File Organization
```scss
// task-list.component.scss

// Variables
$primary-color: #007bff;
$error-color: #dc3545;
$border-radius: 4px;

// Component styles
.task-list-container {
  // Container styles
  
  // Header styles
  .task-list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    
    h2 {
      margin: 0;
      color: $primary-color;
    }
  }
  
  // Content styles
  .task-list-content {
    .loading-spinner {
      text-align: center;
      padding: 2rem;
    }
    
    .error-message {
      margin-bottom: 1rem;
    }
    
    .task-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  }
}

// Responsive design
@media (max-width: 768px) {
  .task-list-container {
    .task-list-header {
      flex-direction: column;
      gap: 1rem;
    }
  }
}
```

#### CSS Class Naming
```scss
// Use BEM methodology
.task-list { }
.task-list__header { }
.task-list__content { }
.task-list__item { }
.task-list__item--active { }

// Use semantic class names
.error-message { }
.loading-spinner { }
.success-notification { }
```

## Development Workflow

### Feature Development Process

#### 1. Planning
- Create feature branch from `main`
- Define requirements and acceptance criteria
- Plan component and service structure
- Identify dependencies and interfaces

#### 2. Implementation
- Start with domain entities and interfaces
- Implement infrastructure layer
- Create application services
- Build UI components
- Add comprehensive tests

#### 3. Testing
- Write unit tests for services
- Write component tests
- Test user interactions
- Verify error handling

#### 4. Code Review
- Self-review code before submitting PR
- Ensure all tests pass
- Check code coverage
- Verify coding standards compliance

#### 5. Integration
- Merge to main branch
- Deploy to staging environment
- Perform integration testing
- Deploy to production

### Git Workflow

#### Branch Naming
```bash
# Feature branches
feature/task-management
feature/user-authentication

# Bug fix branches
bugfix/login-error-handling
bugfix/task-deletion-issue

# Hotfix branches
hotfix/security-patch
hotfix/critical-bug-fix
```

#### Commit Messages
```bash
# Feature commits
feat: add task completion toggle functionality

# Bug fix commits
fix: resolve task deletion confirmation dialog issue

# Documentation commits
docs: update component documentation

# Refactor commits
refactor: simplify task state management

# Test commits
test: add unit tests for task application service
```

### Code Review Process

#### Self-Review Checklist
- [ ] Code follows established patterns
- [ ] All tests pass
- [ ] No console.log statements
- [ ] Proper error handling
- [ ] Accessibility considerations
- [ ] Performance optimizations
- [ ] Security considerations

#### Review Criteria
- **Functionality**: Does the code work as expected?
- **Quality**: Is the code clean and maintainable?
- **Testing**: Are there adequate tests?
- **Documentation**: Is the code well-documented?
- **Standards**: Does it follow coding standards?

## Testing Guidelines

### Unit Testing

#### Service Testing
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
  
  it('should load tasks successfully', () => {
    const mockTasks = [new Task('1', 'Test Task', 'Description', false, 'user1')];
    mockRepository.findAll.and.returnValue(of(mockTasks));
    
    service.loadTasks('user1');
    
    service.getTasks().subscribe(tasks => {
      expect(tasks).toEqual(mockTasks);
    });
    
    expect(mockRepository.findAll).toHaveBeenCalledWith('user1');
  });
  
  it('should handle task creation error', () => {
    const error = new Error('Network error');
    mockRepository.create.and.returnValue(throwError(() => error));
    
    service.createTask(new CreateTaskRequest('Test', 'Description', 'user1'))
      .subscribe({
        error: (err) => {
          expect(err).toBe(error);
        }
      });
  });
});
```

#### Component Testing
```typescript
describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let mockTaskService: jasmine.SpyObj<TaskApplicationService>;
  
  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TaskApplicationService', ['loadTasks', 'deleteTask']);
    
    await TestBed.configureTestingModule({
      imports: [TaskListComponent],
      providers: [
        { provide: TaskApplicationService, useValue: spy }
      ]
    }).compileComponents();
    
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    mockTaskService = TestBed.inject(TaskApplicationService) as jasmine.SpyObj<TaskApplicationService>;
  });
  
  it('should display tasks when loaded', () => {
    const mockTasks = [new Task('1', 'Test Task', 'Description', false, 'user1')];
    mockTaskService.getTasks.and.returnValue(of(mockTasks));
    
    fixture.detectChanges();
    
    const taskElements = fixture.debugElement.queryAll(By.css('.task-item'));
    expect(taskElements).toHaveLength(1);
  });
  
  it('should call deleteTask when delete button is clicked', () => {
    const mockTask = new Task('1', 'Test Task', 'Description', false, 'user1');
    mockTaskService.deleteTask.and.returnValue(of(undefined));
    
    component.onTaskDelete(mockTask);
    
    expect(mockTaskService.deleteTask).toHaveBeenCalledWith('1');
  });
});
```

### Integration Testing

#### End-to-End Testing
```typescript
describe('Task Management Flow', () => {
  it('should allow user to create and manage tasks', async () => {
    // Navigate to tasks page
    await page.goto('/tasks');
    
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
    
    // Delete task
    await page.click('[data-testid="delete-task-button"]');
    await page.click('[data-testid="confirm-delete-button"]');
    
    // Verify task is deleted
    await expect(page.locator('[data-testid="task-item"]')).toHaveCount(0);
  });
});
```

## Performance Guidelines

### Optimization Strategies

#### Change Detection
```typescript
// Use OnPush change detection strategy
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent {
  // Component implementation
}

// Use trackBy functions for *ngFor
trackByTaskId(index: number, task: Task): string {
  return task.id;
}
```

#### Memory Management
```typescript
// Always unsubscribe from observables
export class TaskComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  
  constructor() {
    this.taskService.getTasks()
      .pipe(takeUntil(this.destroy$))
      .subscribe(tasks => {
        // Handle tasks
      });
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

#### Lazy Loading
```typescript
// Lazy load components
const routes: Routes = [
  {
    path: 'tasks',
    loadComponent: () => import('./tasks/tasks.component').then(m => m.TasksComponent)
  }
];
```

### Bundle Optimization

#### Tree Shaking
```typescript
// Import only what you need
import { map, filter, takeUntil } from 'rxjs/operators';

// Use standalone components
@Component({
  standalone: true,
  imports: [CommonModule, ButtonModule]
})
export class TaskComponent {}
```

#### Code Splitting
```typescript
// Split large components into smaller ones
@Component({
  selector: 'app-task-list',
  template: `
    <app-task-header></app-task-header>
    <app-task-items></app-task-items>
    <app-task-footer></app-task-footer>
  `
})
export class TaskListComponent {}
```

## Security Guidelines

### Input Validation
```typescript
// Validate all user inputs
export class TaskFormComponent {
  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]]
  });
  
  onSubmit() {
    if (this.taskForm.valid) {
      const formData = this.taskForm.value;
      // Process form data
    }
  }
}
```

### XSS Prevention
```typescript
// Sanitize user input
import { DomSanitizer } from '@angular/platform-browser';

export class TaskComponent {
  constructor(private sanitizer: DomSanitizer) {}
  
  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.sanitize(SecurityContext.HTML, html);
  }
}
```

### CSRF Protection
```typescript
// Use HTTP-only cookies for tokens
// Implement proper CORS configuration
// Validate all API requests
```

## Accessibility Guidelines

### ARIA Labels
```html
<!-- Provide proper ARIA labels -->
<button 
  type="button"
  aria-label="Delete task"
  (click)="onDeleteTask(task)">
  <i class="pi pi-trash"></i>
</button>

<!-- Use semantic HTML -->
<main role="main">
  <section aria-labelledby="tasks-heading">
    <h2 id="tasks-heading">Tasks</h2>
    <!-- Task content -->
  </section>
</main>
```

### Keyboard Navigation
```typescript
// Handle keyboard events
@HostListener('keydown', ['$event'])
onKeyDown(event: KeyboardEvent): void {
  if (event.key === 'Enter' || event.key === ' ') {
    this.onTaskClick();
    event.preventDefault();
  }
}
```

### Screen Reader Support
```html
<!-- Provide screen reader text -->
<span class="sr-only">Task completed</span>
<i class="pi pi-check" aria-hidden="true"></i>

<!-- Use proper heading structure -->
<h1>Main Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>
```

## Deployment Guidelines

### Environment Configuration
```typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  enableLogging: true
};

// environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.atomchat.com/api',
  enableLogging: false
};
```

### Build Optimization
```bash
# Production build
ng build --configuration production

# Analyze bundle size
ng build --stats-json
npx webpack-bundle-analyzer dist/atomchat-fe/stats.json
```

### CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build application
        run: npm run build
      - name: Deploy to production
        run: npm run deploy
```

## Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear Angular cache
rm -rf .angular
ng build

# Clear node modules
rm -rf node_modules package-lock.json
npm install
```

#### Runtime Errors
```typescript
// Check for null/undefined values
if (task && task.id) {
  // Safe to use task.id
}

// Use optional chaining
const taskTitle = task?.title ?? 'Untitled';
```

#### Performance Issues
```typescript
// Use OnPush change detection
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})

// Implement trackBy functions
trackByTaskId(index: number, task: Task): string {
  return task.id;
}
```

### Debugging Tools

#### Angular DevTools
- Install Angular DevTools browser extension
- Use for component inspection and debugging

#### Browser DevTools
- Use Network tab for API debugging
- Use Console for error logging
- Use Performance tab for performance analysis

#### VS Code Debugging
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}/src"
    }
  ]
}
```

## Best Practices Summary

### Code Quality
- Write clean, readable code
- Follow established patterns
- Use TypeScript strictly
- Implement comprehensive tests

### Performance
- Use OnPush change detection
- Implement proper memory management
- Optimize bundle size
- Monitor performance metrics

### Security
- Validate all inputs
- Sanitize user data
- Use secure authentication
- Implement proper error handling

### Accessibility
- Use semantic HTML
- Provide ARIA labels
- Support keyboard navigation
- Test with screen readers

### Maintainability
- Write self-documenting code
- Use consistent naming conventions
- Implement proper error handling
- Maintain comprehensive documentation
