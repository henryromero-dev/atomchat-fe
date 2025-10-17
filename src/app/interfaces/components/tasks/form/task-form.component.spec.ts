import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TaskFormComponent } from './task-form.component';

describe('TaskFormComponent', () => {
  let component: TaskFormComponent;
  let fixture: ComponentFixture<TaskFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TaskFormComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.taskForm.get('title')?.value).toBe('');
    expect(component.taskForm.get('description')?.value).toBe('');
  });

  it('should validate required title', () => {
    const titleControl = component.taskForm.get('title');
    titleControl?.setValue('');
    titleControl?.markAsTouched();
    
    expect(component.isFieldInvalid('title')).toBe(true);
    expect(component.getFieldError('title')).toBe('This field is required');
  });

  it('should validate title max length', () => {
    const titleControl = component.taskForm.get('title');
    titleControl?.setValue('a'.repeat(101));
    titleControl?.markAsTouched();
    
    expect(component.isFieldInvalid('title')).toBe(true);
    expect(component.getFieldError('title')).toBe('Maximum length is 100');
  });

  it('should validate description max length', () => {
    const descriptionControl = component.taskForm.get('description');
    descriptionControl?.setValue('a'.repeat(501));
    descriptionControl?.markAsTouched();
    
    expect(component.isFieldInvalid('description')).toBe(true);
    expect(component.getFieldError('description')).toBe('Maximum length is 500');
  });

  it('should emit taskSubmit when form is valid', () => {
    spyOn(component.taskSubmit, 'emit');
    
    component.taskForm.patchValue({
      title: 'Test Task',
      description: 'Test Description'
    });
    
    component.onSubmit();
    
    expect(component.taskSubmit.emit).toHaveBeenCalledWith({
      title: 'Test Task',
      description: 'Test Description'
    });
  });

  it('should not emit taskSubmit when form is invalid', () => {
    spyOn(component.taskSubmit, 'emit');
    
    component.taskForm.patchValue({
      title: '',
      description: 'Test Description'
    });
    
    component.onSubmit();
    
    expect(component.taskSubmit.emit).not.toHaveBeenCalled();
  });

  it('should emit visibleChange and reset form on cancel', () => {
    spyOn(component.visibleChange, 'emit');
    spyOn(component.taskForm, 'reset');
    
    component.onCancel();
    
    expect(component.visibleChange.emit).toHaveBeenCalledWith(false);
    expect(component.taskForm.reset).toHaveBeenCalled();
  });
});
