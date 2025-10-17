import { Component, EventEmitter, Input, Output, inject, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DialogModule } from 'primeng/dialog';

import { Task } from '@/app/domain';

export interface TaskFormData {
    title: string;
    description?: string;
}

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
    private readonly fb: FormBuilder = inject(FormBuilder);

    @Input() visible: boolean = false;
    @Input() taskToEdit: Task | null = null;

    @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() taskSubmit: EventEmitter<TaskFormData> = new EventEmitter<TaskFormData>();

    public readonly taskForm: FormGroup;

    constructor() {
        this.taskForm = this.fb.group({
            title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
            description: ['', [Validators.maxLength(500), Validators.required]],
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['taskToEdit'] && this.taskToEdit) {
            this.taskForm.patchValue({
                title: this.taskToEdit.title,
                description: this.taskToEdit.description || '',
            });
        }
    }

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

    public onCancel(): void {
        this.taskForm.reset();
        this.visibleChange.emit(false);
    }

    public isFieldInvalid(fieldName: string): boolean {
        const field = this.taskForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

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

    public get submitButtonLabel(): string {
        return this.taskToEdit?.id ? 'Update Task' : 'Create Task';
    }

    public get formTitle(): string {
        return this.taskToEdit?.id ? 'Edit Task' : 'Create New Task';
    }

    public get cancelButtonLabel(): string {
        return 'Cancel';
    }
}
