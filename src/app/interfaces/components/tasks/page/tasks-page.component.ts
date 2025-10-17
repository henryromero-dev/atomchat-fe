import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToolbarModule } from 'primeng/toolbar';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthApplicationService, TaskApplicationService } from '@/app/application';
import { ToastService } from '@/app/core/services/toast.service';
import { User, Task, CreateTaskRequest, UpdateTaskRequest } from '@/app/domain';
import { ToolbarComponent } from '@/app/shared/ui';
import { TaskFormComponent } from '../form/task-form.component';

/**
 * TasksPageComponent - Main page component for task management
 * 
 * This component provides the main interface for users to view, create, edit, and delete tasks.
 * It integrates with the TaskApplicationService for business logic and manages the task form
 * for creating and editing tasks.
 * 
 * Features:
 * - Display user tasks in a list format
 * - Create new tasks using TaskFormComponent
 * - Edit existing tasks
 * - Delete tasks with confirmation dialog
 * - Toggle task completion status
 * - Show loading states and error messages
 * 
 * @example
 * ```html
 * <app-tasks-page></app-tasks-page>
 * ```
 */
@Component({
    selector: 'app-tasks-page',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        ButtonModule,
        CardModule,
        ToolbarModule,
        DividerModule,
        ProgressSpinnerModule,
        MessageModule,
        CheckboxModule,
        ConfirmDialogModule,
        ToastModule,
        ToolbarComponent,
        TaskFormComponent,
    ],
    providers: [ConfirmationService, MessageService],
    templateUrl: './tasks-page.component.html',
    styleUrl: './tasks-page.component.scss',
})
export class TasksPageComponent implements OnInit {
    /** Authentication service for user management */
    private readonly authApplicationService: AuthApplicationService = inject(AuthApplicationService);
    
    /** Task application service for task operations */
    private readonly taskApplicationService: TaskApplicationService = inject(TaskApplicationService);
    
    /** Toast service for user notifications */
    private readonly toastService: ToastService = inject(ToastService);
    
    /** Confirmation service for delete confirmations */
    private readonly confirmationService: ConfirmationService = inject(ConfirmationService);

    /** Observable stream of user tasks */
    public readonly tasks$ = this.taskApplicationService.getTasks();
    
    /** Observable stream of loading state */
    public readonly isLoading$ = this.taskApplicationService.getIsLoading();
    
    /** Observable stream of error messages */
    public readonly error$ = this.taskApplicationService.getError();

    /** Current authenticated user */
    public currentUser: User | null = null;
    
    /** Controls task form visibility */
    public showTaskForm: boolean = false;
    
    /** Task being edited (null for create mode) */
    public editingTask: Task | null = null;

    constructor() {
    }

    /**
     * Component initialization lifecycle hook
     * Loads current user and fetches their tasks
     */
    public ngOnInit(): void {
        this.currentUser = this.authApplicationService.getCurrentUser();
        if (this.currentUser) {
            this.taskApplicationService.loadTasks(this.currentUser.id);
        }
    }

    /**
     * Handles user logout
     * Logs out the current user and redirects to login page
     */
    public onLogout(): void {
        this.authApplicationService.logout();
    }

    /**
     * TrackBy function for task list optimization
     * @param _index - Index of the item in the list
     * @param task - Task object
     * @returns Unique identifier for the task
     */
    public trackByTaskId(_index: number, task: Task): string {
        return task.id;
    }

    /**
     * Shows the task creation form
     * Resets editing task and shows the form
     */
    public showCreateTaskForm(): void {
        this.editingTask = null;
        this.showTaskForm = true;
    }

    /**
     * Shows the task editing form
     * @param task - Task to edit
     */
    public showEditTaskDialog(task: Task): void {
        this.editingTask = task;
        this.showTaskForm = true;
    }

    /**
     * Hides the task form
     * Resets form state and hides the dialog
     */
    public hideTaskForm(): void {
        this.showTaskForm = false;
        this.editingTask = null;
    }

    /**
     * Handles task form submission
     * Determines whether to create or update based on editing state
     * @param taskData - Form data from TaskFormComponent
     */
    public onTaskSubmit(taskData: { title: string; description?: string }): void {
        if (this.editingTask) {
            this.onUpdateTask(taskData);
        } else {
            this.onCreateTask(taskData);
        }
    }

    /**
     * Creates a new task
     * @param taskData - Task data from the form
     */
    public onCreateTask(taskData: { title: string; description?: string }): void {
        if (!this.currentUser) return;

        const request: CreateTaskRequest = new CreateTaskRequest(
            taskData.title,
            taskData.description,
            this.currentUser.id
        );

        this.taskApplicationService.createTask(request).subscribe({
            next: () => {
                this.toastService.showSuccess('Task created successfully!');
                this.hideTaskForm();
            },
            error: (error) => {
                this.toastService.showError('Failed to create task', error.message);
            },
        });
    }

    /**
     * Updates an existing task
     * @param taskData - Updated task data from the form
     */
    public onUpdateTask(taskData: { title: string; description?: string }): void {
        if (this.editingTask && this.currentUser) {
            const updateRequest: UpdateTaskRequest = new UpdateTaskRequest(
                this.editingTask.id,
                taskData.title,
                taskData.description,
                this.editingTask.completed,
                this.currentUser.id
            );

            this.taskApplicationService.updateTask(updateRequest).subscribe({
                next: () => {
                    this.toastService.showSuccess('Task updated successfully!');
                    this.hideTaskForm();
                },
                error: (error) => {
                    this.toastService.showError('Failed to update task', error.message);
                },
            });
        }
    }

    /**
     * Toggles task completion status
     * @param task - Task to toggle
     */
    public onToggleTaskCompletion(task: Task): void {
        this.taskApplicationService.toggleTaskCompletion(task.id).subscribe({
            next: () => {
                const status: string = task.completed ? 'marked as pending' : 'marked as completed';
                this.toastService.showSuccess(`Task ${status}!`);
            },
            error: (error) => {
                this.toastService.showError('Failed to update task status', error.message);
            },
        });
    }

    /**
     * Shows confirmation dialog for task deletion
     * @param task - Task to delete
     */
    public confirmDeleteTask(task: Task): void {
        this.confirmationService.confirm({
            message: `Are you sure you want to delete "${task.title}"?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.deleteTask(task.id);
            },
        });
    }

    /**
     * Deletes a task after confirmation
     * @param taskId - ID of the task to delete
     */
    private deleteTask(taskId: string): void {
        this.taskApplicationService.deleteTask(taskId).subscribe({
            next: () => {
                this.toastService.showSuccess('Task deleted successfully!');
            },
            error: (error) => {
                this.toastService.showError('Failed to delete task', error.message);
            },
        });
    }

    /**
     * Getter for tasks observable
     * @returns Observable stream of tasks
     */
    public get tasks() {
        return this.tasks$;
    }
}
