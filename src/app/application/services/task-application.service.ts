import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../../domain/entities';
import { TASK_REPOSITORY, TaskRepository } from '../../domain/repositories';

/**
 * Interface representing the state of task operations
 */
export interface TaskState {
    /** Array of user tasks */
    tasks: Task[];
    /** Loading state indicator */
    isLoading: boolean;
    /** Error message if any */
    error: string | null;
}

/**
 * TaskApplicationService - Application service for task management
 * 
 * This service manages all task-related business logic and state management.
 * It provides a centralized way to handle task operations including CRUD operations,
 * state management, and error handling.
 * 
 * Features:
 * - Centralized task state management using RxJS BehaviorSubject
 * - CRUD operations for tasks (Create, Read, Update, Delete)
 * - Task completion toggling
 * - Loading and error state management
 * - Reactive state updates for UI components
 * 
 * @example
 * ```typescript
 * // Inject the service
 * private readonly taskService = inject(TaskApplicationService);
 * 
 * // Load tasks for a user
 * this.taskService.loadTasks(userId);
 * 
 * // Subscribe to tasks
 * this.taskService.getTasks().subscribe(tasks => {
 *   console.log('Current tasks:', tasks);
 * });
 * 
 * // Create a new task
 * const request = new CreateTaskRequest('New Task', 'Description', userId);
 * this.taskService.createTask(request).subscribe(task => {
 *   console.log('Task created:', task);
 * });
 * ```
 */
@Injectable({
    providedIn: 'root'
})
export class TaskApplicationService {
    /** Initial state for task operations */
    private readonly initialState: TaskState = {
        tasks: [],
        isLoading: false,
        error: null,
    };

    /** BehaviorSubject for managing task state */
    private readonly stateSubject: BehaviorSubject<TaskState> = new BehaviorSubject<TaskState>(this.initialState);
    
    /** Public observable for state changes */
    public readonly state$: Observable<TaskState> = this.stateSubject.asObservable();

    constructor(@Inject(TASK_REPOSITORY) private readonly taskRepository: TaskRepository) { }

    /**
     * Gets the current tasks observable
     * @returns Observable stream of tasks array
     */
    public getTasks(): Observable<Task[]> {
        return this.state$.pipe(map((state: TaskState) => state.tasks));
    }

    /**
     * Gets the loading state observable
     * @returns Observable stream of loading boolean
     */
    public getIsLoading(): Observable<boolean> {
        return this.state$.pipe(map((state: TaskState) => state.isLoading));
    }

    /**
     * Gets the error state observable
     * @returns Observable stream of error message or null
     */
    public getError(): Observable<string | null> {
        return this.state$.pipe(map((state: TaskState) => state.error));
    }

    /**
     * Loads tasks for a specific user
     * Updates the state with fetched tasks or error
     * @param userId - ID of the user whose tasks to load
     */
    public loadTasks(userId: string): void {
        this.setLoading(true);
        this.clearError();

        this.taskRepository.findAll(userId).pipe(
            tap((tasks: Task[]) => {
                this.updateState({ tasks, isLoading: false });
            }),
            catchError((error) => {
                this.setError('Failed to load tasks');
                this.setLoading(false);
                return throwError(() => error);
            })
        ).subscribe();
    }

    /**
     * Creates a new task
     * @param request - Task creation request
     * @returns Observable of the created task
     */
    public createTask(request: CreateTaskRequest): Observable<Task> {
        this.setLoading(true);
        this.clearError();

        return this.taskRepository.create(request).pipe(
            tap((task: Task) => {
                const currentState: TaskState = this.stateSubject.value;
                const updatedTasks: Task[] = [...currentState.tasks, task];
                this.updateState({ tasks: updatedTasks, isLoading: false });
            }),
            catchError((error) => {
                this.setError('Failed to create task');
                this.setLoading(false);
                return throwError(() => error);
            })
        );
    }

    /**
     * Updates an existing task
     * @param request - Task update request
     * @returns Observable of the updated task
     */
    public updateTask(request: UpdateTaskRequest): Observable<Task> {
        this.setLoading(true);
        this.clearError();

        return this.taskRepository.update(request).pipe(
            tap((task: Task) => {
                const currentState: TaskState = this.stateSubject.value;
                const taskIndex: number = currentState.tasks.findIndex((t: Task) => t.id === request.id);
                if (taskIndex !== -1) {
                    const updatedTasks: Task[] = [...currentState.tasks];
                    updatedTasks[taskIndex] = task;
                    this.updateState({ tasks: updatedTasks, isLoading: false });
                }
            }),
            catchError((error) => {
                this.setError('Failed to update task');
                this.setLoading(false);
                return throwError(() => error);
            })
        );
    }

    /**
     * Deletes a task by ID
     * @param taskId - ID of the task to delete
     * @returns Observable of void
     */
    public deleteTask(taskId: string): Observable<void> {
        this.setLoading(true);
        this.clearError();

        return this.taskRepository.delete(taskId).pipe(
            tap(() => {
                const currentState: TaskState = this.stateSubject.value;
                const updatedTasks: Task[] = currentState.tasks.filter((task: Task) => task.id !== taskId);
                this.updateState({ tasks: updatedTasks, isLoading: false });
            }),
            catchError((error) => {
                this.setError('Failed to delete task');
                this.setLoading(false);
                return throwError(() => error);
            })
        );
    }

    /**
     * Toggles task completion status
     * @param taskId - ID of the task to toggle
     * @returns Observable of the updated task
     */
    public toggleTaskCompletion(taskId: string): Observable<Task> {
        this.setLoading(true);
        this.clearError();

        return this.taskRepository.toggleCompletion(taskId).pipe(
            tap((task: Task) => {
                const currentState: TaskState = this.stateSubject.value;
                const taskIndex: number = currentState.tasks.findIndex((t: Task) => t.id === taskId);
                if (taskIndex !== -1) {
                    const updatedTasks: Task[] = [...currentState.tasks];
                    updatedTasks[taskIndex] = task;
                    this.updateState({ tasks: updatedTasks, isLoading: false });
                }
            }),
            catchError((error) => {
                this.setError('Failed to toggle task completion');
                this.setLoading(false);
                return throwError(() => error);
            })
        );
    }

    /**
     * Updates the task state with partial state changes
     * @param partialState - Partial state object to merge
     */
    private updateState(partialState: Partial<TaskState>): void {
        const currentState: TaskState = this.stateSubject.value;
        const newState: TaskState = { ...currentState, ...partialState };
        this.stateSubject.next(newState);
    }

    /**
     * Sets the loading state
     * @param loading - Loading state boolean
     */
    private setLoading(loading: boolean): void {
        this.updateState({ isLoading: loading });
    }

    /**
     * Sets an error state
     * @param error - Error message string
     */
    private setError(error: string): void {
        this.updateState({ error, isLoading: false });
    }

    /**
     * Clears the current error state
     */
    private clearError(): void {
        this.updateState({ error: null });
    }
}
