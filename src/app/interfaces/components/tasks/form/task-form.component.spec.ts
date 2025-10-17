import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { TaskFormComponent, TaskFormData } from './task-form.component';
import { Task } from '@/app/domain';

describe('TaskFormComponent', () => {
  let formBuilder: FormBuilder;

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    completed: false,
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-01-15T10:00:00Z'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [FormBuilder],
    });

    formBuilder = TestBed.inject(FormBuilder);
  });

  it('should create', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TaskFormComponent();
    });
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TaskFormComponent();
    });
    
    expect(component.taskForm.get('title')?.value).toBe('');
    expect(component.taskForm.get('description')?.value).toBe('');
  });

  it('should validate required title', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TaskFormComponent();
    });
    
    const titleControl = component.taskForm.get('title');
    titleControl?.setValue('');
    titleControl?.markAsTouched();
    
    expect(component.isFieldInvalid('title')).toBe(true);
    expect(component.getFieldError('title')).toBe('This field is required');
  });

  it('should validate title max length', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TaskFormComponent();
    });
    
    const titleControl = component.taskForm.get('title');
    titleControl?.setValue('a'.repeat(101));
    titleControl?.markAsTouched();
    
    expect(component.isFieldInvalid('title')).toBe(true);
    expect(component.getFieldError('title')).toBe('Maximum length is 100');
  });

  it('should validate description max length', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TaskFormComponent();
    });
    
    const descriptionControl = component.taskForm.get('description');
    descriptionControl?.setValue('a'.repeat(501));
    descriptionControl?.markAsTouched();
    
    expect(component.isFieldInvalid('description')).toBe(true);
    expect(component.getFieldError('description')).toBe('Maximum length is 500');
  });

  it('should emit taskSubmit when form is valid', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TaskFormComponent();
    });
    
    const emitSpy = jest.spyOn(component.taskSubmit, 'emit');
    
    component.taskForm.patchValue({
      title: 'Test Task',
      description: 'Test Description'
    });
    
    component.onSubmit();
    
    expect(emitSpy).toHaveBeenCalledWith({
      title: 'Test Task',
      description: 'Test Description'
    });
  });

  it('should not emit taskSubmit when form is invalid', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TaskFormComponent();
    });
    
    const emitSpy = jest.spyOn(component.taskSubmit, 'emit');
    
    component.taskForm.patchValue({
      title: '', // Invalid: required field is empty
      description: 'Test Description'
    });
    
    component.onSubmit();
    
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should emit visibleChange and reset form on cancel', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TaskFormComponent();
    });
    
    const visibleChangeSpy = jest.spyOn(component.visibleChange, 'emit');
    
    component.taskForm.patchValue({
      title: 'Test Task',
      description: 'Test Description'
    });
    
    component.onCancel();
    
    expect(visibleChangeSpy).toHaveBeenCalledWith(false);
    expect(component.taskForm.get('title')?.value).toBeNull();
    expect(component.taskForm.get('description')?.value).toBeNull();
  });

  it('should update form when taskToEdit changes', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TaskFormComponent();
    });
    
    component.taskToEdit = mockTask;
    
    const changes = {
      taskToEdit: {
        currentValue: mockTask,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    };
    
    component.ngOnChanges(changes as any);
    
    expect(component.taskForm.get('title')?.value).toBe(mockTask.title);
    expect(component.taskForm.get('description')?.value).toBe(mockTask.description);
  });

  it('should not update form when taskToEdit becomes null', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TaskFormComponent();
    });
    
    // First set a task
    component.taskToEdit = mockTask;
    component.ngOnChanges({
      taskToEdit: {
        currentValue: mockTask,
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    } as any);
    
    // Then set it to null
    component.taskToEdit = null;
    const changes = {
      taskToEdit: {
        currentValue: null,
        previousValue: mockTask,
        firstChange: false,
        isFirstChange: () => false
      }
    };
    
    component.ngOnChanges(changes as any);
    
    // The form should still have the previous values since ngOnChanges doesn't reset when taskToEdit is null
    expect(component.taskForm.get('title')?.value).toBe(mockTask.title);
    expect(component.taskForm.get('description')?.value).toBe(mockTask.description);
  });

  it('should return correct error messages for title field', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TaskFormComponent();
    });
    
    const titleControl = component.taskForm.get('title');
    
    // Test required error
    titleControl?.setValue('');
    titleControl?.markAsTouched();
    expect(component.getFieldError('title')).toBe('This field is required');
    
    // Test max length error
    titleControl?.setValue('a'.repeat(101));
    titleControl?.markAsTouched();
    expect(component.getFieldError('title')).toBe('Maximum length is 100');
    
    // Test no error
    titleControl?.setValue('Valid Title');
    titleControl?.markAsTouched();
    expect(component.getFieldError('title')).toBe('');
  });

  it('should return correct error messages for description field', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TaskFormComponent();
    });
    
    const descriptionControl = component.taskForm.get('description');
    
    // Test required error (description is required in this form)
    descriptionControl?.setValue('');
    descriptionControl?.markAsTouched();
    expect(component.getFieldError('description')).toBe('This field is required');
    
    // Test max length error
    descriptionControl?.setValue('a'.repeat(501));
    descriptionControl?.markAsTouched();
    expect(component.getFieldError('description')).toBe('Maximum length is 500');
    
    // Test no error
    descriptionControl?.setValue('Valid Description');
    descriptionControl?.markAsTouched();
    expect(component.getFieldError('description')).toBe('');
  });

  it('should have correct default input values', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TaskFormComponent();
    });
    
    expect(component.visible).toBe(false);
    expect(component.taskToEdit).toBeNull();
  });

  it('should validate form correctly', () => {
    const component = TestBed.runInInjectionContext(() => {
      return new TaskFormComponent();
    });
    
    // Empty form should be invalid
    expect(component.taskForm.invalid).toBe(true);
    
    // Form with only title should be invalid (description is required)
    component.taskForm.patchValue({
      title: 'Test Task',
      description: ''
    });
    expect(component.taskForm.invalid).toBe(true);
    
    // Form with both fields should be valid
    component.taskForm.patchValue({
      title: 'Test Task',
      description: 'Test Description'
    });
    expect(component.taskForm.valid).toBe(true);
  });
});