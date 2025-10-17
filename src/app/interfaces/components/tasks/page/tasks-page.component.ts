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
    private readonly authApplicationService: AuthApplicationService = inject(AuthApplicationService);
    private readonly taskApplicationService: TaskApplicationService = inject(TaskApplicationService);
    private readonly toastService: ToastService = inject(ToastService);
    private readonly confirmationService: ConfirmationService = inject(ConfirmationService);

    public readonly tasks$ = this.taskApplicationService.getTasks();
    public readonly isLoading$ = this.taskApplicationService.getIsLoading();
    public readonly error$ = this.taskApplicationService.getError();

    public currentUser: User | null = null;
    public showTaskForm: boolean = false;
    public editingTask: Task | null = null;

    constructor() {
    }

    public ngOnInit(): void {
        this.currentUser = this.authApplicationService.getCurrentUser();
        if (this.currentUser) {
            this.taskApplicationService.loadTasks(this.currentUser.id);
        }
    }

    public onLogout(): void {
        this.authApplicationService.logout();
    }

    public trackByTaskId(_index: number, task: Task): string {
        return task.id;
    }

    public showCreateTaskForm(): void {
        this.editingTask = null;
        this.showTaskForm = true;
    }

    public showEditTaskDialog(task: Task): void {
        this.editingTask = task;
        this.showTaskForm = true;
    }

    public hideTaskForm(): void {
        this.showTaskForm = false;
        this.editingTask = null;
    }

    public onTaskSubmit(taskData: { title: string; description?: string }): void {
        if (this.editingTask) {
            this.onUpdateTask(taskData);
        } else {
            this.onCreateTask(taskData);
        }
    }

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

    public get tasks() {
        return this.tasks$;
    }
}
