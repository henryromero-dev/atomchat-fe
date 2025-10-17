# Components Documentation

This document provides comprehensive information about all UI components in the AtomChat Frontend application.

## Component Architecture

All components in the application are built as Angular standalone components, following the latest Angular patterns and best practices. Components are organized by feature and functionality.

## Page Components

### LoginPageComponent

**Location**: `src/app/interfaces/components/login/login-page.component.ts`

**Purpose**: Handles user authentication including login and registration.

**Features**:
- Email-based authentication
- Form validation
- User registration dialog
- Automatic navigation after successful authentication

**Usage**:
```typescript
import { LoginPageComponent } from '@/app/interfaces/components/login/login-page.component';

// Component is automatically loaded via lazy loading in routes
```

**Key Methods**:
- `onSubmit()`: Processes login form submission
- `onConfirmCreateUser()`: Handles user registration
- `onCancelCreateUser()`: Cancels registration dialog
- `isFieldInvalid(fieldName: string)`: Validates form fields
- `getFieldError(fieldName: string)`: Returns field validation errors

**Dependencies**:
- `AuthApplicationService`: For authentication operations
- `Router`: For navigation
- `FormBuilder`: For reactive form creation

### TasksPageComponent

**Location**: `src/app/interfaces/components/tasks/page/tasks-page.component.ts`

**Purpose**: Main page for task management operations.

**Features**:
- Display user tasks
- Create new tasks
- Edit existing tasks
- Delete tasks with confirmation
- Toggle task completion
- Loading states and error handling

**Usage**:
```typescript
import { TasksPageComponent } from '@/app/interfaces/components/tasks/page/tasks-page.component';

// Component is automatically loaded via lazy loading in routes
```

**Key Methods**:
- `onCreateTask(taskData)`: Creates a new task
- `onUpdateTask(taskData)`: Updates an existing task
- `onToggleTaskCompletion(task)`: Toggles task completion status
- `confirmDeleteTask(task)`: Shows delete confirmation dialog
- `showCreateTaskForm()`: Opens task creation form
- `showEditTaskDialog(task)`: Opens task editing form

**Dependencies**:
- `AuthApplicationService`: For user authentication
- `TaskApplicationService`: For task operations
- `ToastService`: For user notifications
- `ConfirmationService`: For delete confirmations

**State Management**:
- `tasks$`: Observable of user tasks
- `isLoading$`: Observable of loading state
- `error$`: Observable of error state

## Form Components

### TaskFormComponent

**Location**: `src/app/interfaces/components/tasks/form/task-form.component.ts`

**Purpose**: Reusable form component for creating and editing tasks.

**Features**:
- Reactive form with validation
- Support for both create and edit modes
- Form validation with custom error messages
- Emits form data to parent component

**Usage**:
```typescript
import { TaskFormComponent } from '@/app/interfaces/components/tasks/form/task-form.component';

@Component({
  template: `
    <app-task-form
      [visible]="showForm"
      [taskToEdit]="editingTask"
      (visibleChange)="onFormVisibilityChange($event)"
      (taskSubmit)="onTaskSubmit($event)">
    </app-task-form>
  `
})
export class ParentComponent {
  onFormVisibilityChange(visible: boolean) {
    this.showForm = visible;
  }

  onTaskSubmit(taskData: TaskFormData) {
    // Handle task creation or update
  }
}
```

**Input Properties**:
- `visible: boolean`: Controls form visibility
- `taskToEdit: Task | null`: Task to edit (null for create mode)

**Output Events**:
- `visibleChange: EventEmitter<boolean>`: Emitted when form visibility changes
- `taskSubmit: EventEmitter<TaskFormData>`: Emitted when form is submitted

**Form Fields**:
- `title`: Required, 1-100 characters
- `description`: Optional, max 500 characters

**Key Methods**:
- `onSubmit()`: Validates and submits form
- `onCancel()`: Resets form and closes dialog
- `isFieldInvalid(fieldName: string)`: Checks field validation
- `getFieldError(fieldName: string)`: Returns field error message

## Shared Components

### ToolbarComponent

**Location**: `src/app/shared/ui/toolbar/toolbar.component.ts`

**Purpose**: Application toolbar with user information and logout functionality.

**Features**:
- Display current user information
- Logout functionality
- Responsive design

**Usage**:
```typescript
import { ToolbarComponent } from '@/app/shared/ui/toolbar/toolbar.component';

@Component({
  template: `<app-toolbar (logout)="onLogout()"></app-toolbar>`
})
export class ParentComponent {
  onLogout() {
    // Handle logout
  }
}
```

**Output Events**:
- `logout: EventEmitter<void>`: Emitted when logout button is clicked

## Component Patterns

### Standalone Components
All components are standalone, meaning they don't require NgModules:

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss'
})
export class ExampleComponent {
  // Component implementation
}
```

### Change Detection Strategy
Most components use `OnPush` change detection for better performance:

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // ... other configuration
})
export class ExampleComponent {
  // Component implementation
}
```

### Dependency Injection
Components use the `inject()` function for dependency injection:

```typescript
@Component({})
export class ExampleComponent {
  private readonly service = inject(SomeService);
  private readonly router = inject(Router);
}
```

## Component Communication

### Parent-Child Communication
Components communicate through inputs and outputs:

```typescript
// Parent component
@Component({
  template: `
    <child-component
      [data]="parentData"
      (dataChange)="onDataChange($event)">
    </child-component>
  `
})
export class ParentComponent {
  parentData = 'initial value';
  
  onDataChange(newData: string) {
    this.parentData = newData;
  }
}

// Child component
@Component({})
export class ChildComponent {
  @Input() data: string = '';
  @Output() dataChange = new EventEmitter<string>();
  
  updateData() {
    this.dataChange.emit('new value');
  }
}
```

### Service-Based Communication
Components communicate through shared services:

```typescript
@Component({})
export class ComponentA {
  private readonly sharedService = inject(SharedService);
  
  sendData() {
    this.sharedService.updateData('new data');
  }
}

@Component({})
export class ComponentB {
  private readonly sharedService = inject(SharedService);
  
  data$ = this.sharedService.getData();
}
```

## Form Handling

### Reactive Forms
All forms use Angular reactive forms with validation:

```typescript
@Component({})
export class FormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  
  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(1)]],
    description: ['', [Validators.maxLength(500)]]
  });
  
  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;
      // Process form data
    }
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}
```

### Form Validation
Custom validation messages are provided:

```typescript
getFieldError(fieldName: string): string {
  const field = this.form.get(fieldName);
  if (field && field.errors) {
    if (field.errors['required']) {
      return 'This field is required';
    }
    if (field.errors['minlength']) {
      return `Minimum length is ${field.errors['minlength'].requiredLength}`;
    }
  }
  return '';
}
```

## UI Library Integration

### PrimeNG Components
The application uses PrimeNG components for consistent UI:

```typescript
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';

@Component({
  imports: [ButtonModule, CardModule, DialogModule],
  // ... other configuration
})
export class ExampleComponent {
  // Component implementation
}
```

### Common PrimeNG Components Used
- `ButtonModule`: For buttons and actions
- `CardModule`: For content containers
- `DialogModule`: For modal dialogs
- `InputTextModule`: For text inputs
- `InputTextareaModule`: For textarea inputs
- `ProgressSpinnerModule`: For loading indicators
- `MessageModule`: For displaying messages
- `ToastModule`: For notifications
- `ConfirmDialogModule`: For confirmation dialogs

## Testing Components

### Component Testing
Components are tested using Angular Testing Library:

```typescript
describe('ExampleComponent', () => {
  let component: ExampleComponent;
  let fixture: ComponentFixture<ExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExampleComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display form when visible', () => {
    component.visible = true;
    fixture.detectChanges();
    
    expect(fixture.debugElement.query(By.css('.form-container'))).toBeTruthy();
  });
});
```

### Testing User Interactions
Test user interactions and form submissions:

```typescript
it('should emit taskSubmit when form is submitted', () => {
  spyOn(component.taskSubmit, 'emit');
  
  component.visible = true;
  fixture.detectChanges();
  
  const form = fixture.debugElement.query(By.css('form'));
  form.triggerEventHandler('ngSubmit', null);
  
  expect(component.taskSubmit.emit).toHaveBeenCalled();
});
```

## Best Practices

### 1. Component Design
- Keep components focused on a single responsibility
- Use inputs and outputs for parent-child communication
- Prefer composition over inheritance
- Use standalone components for better tree-shaking

### 2. State Management
- Keep component state minimal
- Use services for shared state
- Prefer reactive patterns with observables
- Handle loading and error states

### 3. Performance
- Use OnPush change detection strategy
- Implement trackBy functions for *ngFor
- Lazy load components when possible
- Minimize DOM manipulation

### 4. Accessibility
- Use semantic HTML elements
- Provide proper ARIA labels
- Ensure keyboard navigation
- Test with screen readers

### 5. Testing
- Write tests for component behavior
- Test user interactions
- Mock external dependencies
- Aim for high test coverage

## Component Lifecycle

### Lifecycle Hooks
Components implement appropriate lifecycle hooks:

```typescript
export class ExampleComponent implements OnInit, OnDestroy {
  ngOnInit() {
    // Component initialization
  }
  
  ngOnDestroy() {
    // Cleanup subscriptions
  }
}
```

### Memory Management
Always clean up subscriptions to prevent memory leaks:

```typescript
export class ExampleComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  
  constructor() {
    this.dataService.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        // Handle data
      });
  }
  
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```
