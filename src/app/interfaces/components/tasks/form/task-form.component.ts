import { Component, EventEmitter, Input, Output, inject, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DialogModule } from 'primeng/dialog';

import { Task } from '@/app/domain';

/**
 * Interface for task form data
 */
export interface TaskFormData {
    /** Task title */
    title: string;
    /** Task description (optional) */
    description?: string;
}

/**
 * TaskFormComponent - Reusable form component for creating and editing tasks
 * 
 * This component provides a reusable form for both creating new tasks and editing
 * existing tasks. It handles form validation, data binding, and emits form data
 * to parent components.
 * 
 * Features:
 * - Reactive form with validation
 * - Support for both create and edit modes
 * - Form validation with custom error messages
 * - Emits form data to parent component
 * - Handles form reset and cancellation
 * 
 * @example
 * ```html
 * <app-task-form
 *   [visible]="showForm"
 *   [taskToEdit]="editingTask"
 *   (visibleChange)="onFormVisibilityChange($event)"
 *   (taskSubmit)="onTaskSubmit($event)">
 * </app-task-form>
 * ```
 */
@Component({
    selector: 'app-task-form',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        InputTextareaModule,
        DialogModule,
    ],
    templateUrl: './task-form.component.html',
    styleUrl: './task-form.component.scss',
})
export class TaskFormComponent implements OnChanges {
    /** Form builder for reactive forms */
    private readonly fb: FormBuilder = inject(FormBuilder);

    /** Controls form visibility */
    @Input() visible: boolean = false;
    
    /** Task to edit (null for create mode) */
    @Input() taskToEdit: Task | null = null;

    /** Emitted when form visibility changes */
    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    
    /** Emitted when form is submitted with valid data */
    @Output() taskSubmit: EventEmitter<TaskFormData> = new EventEmitter<TaskFormData>();

    /** Reactive form for task data */
    public readonly taskForm: FormGroup;

    constructor() {
        this.taskForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
            description: ['', [Validators.maxLength(500), Validators.required]],
        });
    }

    /**
     * Lifecycle hook that responds to input changes
     * Populates form when editing an existing task
     * @param changes - Object containing changed properties
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['taskToEdit'] && this.taskToEdit) {
            this.taskForm.patchValue({
                title: this.taskToEdit.title,
                description: this.taskToEdit.description || '',
            });
        }
    }

    /**
     * Handles form submission
     * Validates form and emits task data if valid
     */
    public onSubmit(): void {
        if (this.taskForm.valid) {
            const formData: TaskFormData = this.taskForm.value;
            const taskData: TaskFormData = {
                title: formData.title,
                ...(formData.description && { description: formData.description })
            };
            this.taskSubmit.emit(taskData);
            this.onCancel();
        }
    }

    /**
     * Handles form cancellation
     * Resets form and hides the dialog
     */
    public onCancel(): void {
        this.taskForm.reset();
        this.visibleChange.emit(false);
    }

    /**
     * Checks if a form field is invalid and has been touched
     * @param fieldName - Name of the form field to check
     * @returns True if the field is invalid and touched/dirty
     */
    public isFieldInvalid(fieldName: string): boolean {
        const field = this.taskForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    /**
     * Gets the error message for a form field
     * @param fieldName - Name of the form field
     * @returns Error message string or empty string if no error
     */
    public getFieldError(fieldName: string): string {
        const field = this.taskForm.get(fieldName);
        if (field && field.errors) {
            if (field.errors['required']) {
                return 'This field is required';
            }
            if (field.errors['minlength']) {
                return `Minimum length is ${field.errors['minlength'].requiredLength}`;
            }
            if (field.errors['maxlength']) {
                return `Maximum length is ${field.errors['maxlength'].requiredLength}`;
            }
        }
        return '';
    }

    /**
     * Gets the submit button label based on edit mode
     * @returns Button label text
     */
    public get submitButtonLabel(): string {
        return this.taskToEdit?.id ? 'Update Task' : 'Create Task';
    }

    /**
     * Gets the form title based on edit mode
     * @returns Form title text
     */
    public get formTitle(): string {
        return this.taskToEdit?.id ? 'Edit Task' : 'Create New Task';
    }

    /**
     * Gets the cancel button label
     * @returns Cancel button label text
     */
    public get cancelButtonLabel(): string {
        return 'Cancel';
    }
}
