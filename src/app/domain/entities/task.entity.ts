/**
 * Task - Domain entity representing a task in the system
 * 
 * This entity encapsulates all business logic and validation rules for tasks.
 * It provides methods for task manipulation while maintaining immutability
 * and ensuring data integrity through validation.
 * 
 * Features:
 * - Immutable entity with readonly properties
 * - Built-in validation for business rules
 * - Methods for task state manipulation
 * - Factory methods for object creation
 * - Serialization support for API communication
 * 
 * @example
 * ```typescript
 * // Create task from API response
 * const task = Task.fromPlainObject({
 *   id: '123',
 *   title: 'Complete project',
 *   description: 'Finish the documentation',
 *   completed: false,
 *   userId: 'user123',
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z'
 * });
 * 
 * // Toggle completion status
 * const completedTask = task.toggleCompletion();
 * 
 * // Update task content
 * const updatedTask = task.updateContent('New Title', 'New Description');
 * ```
 */
export class Task {
  constructor(
    /** Unique identifier for the task */
    public readonly id: string,
    /** Task title (max 100 characters) */
    public readonly title: string,
    /** Task description (max 500 characters, optional) */
    public readonly description: string | undefined,
    /** Task completion status */
    public readonly completed: boolean,
    /** ID of the user who owns this task */
    public readonly userId: string,
    /** Task creation timestamp */
    public readonly createdAt: Date,
    /** Task last update timestamp */
    public readonly updatedAt: Date
  ) {
    this.validate();
  }

  /**
   * Validates task data according to business rules
   * @throws Error if validation fails
   */
  private validate(): void {
    if (!this.id || this.id.trim() === '') {
      throw new Error('Task ID is required');
    }
    if (!this.title || this.title.trim() === '') {
      throw new Error('Task title is required');
    }
    if (this.title.length > 100) {
      throw new Error('Task title must not exceed 100 characters');
    }
    if (this.description && this.description.length > 500) {
      throw new Error('Task description must not exceed 500 characters');
    }
    if (!this.userId || this.userId.trim() === '') {
      throw new Error('User ID is required');
    }
  }

  /**
   * Checks if the task is completed
   * @returns True if the task is completed
   */
  public isCompleted(): boolean {
    return this.completed;
  }

  /**
   * Checks if the task is pending
   * @returns True if the task is not completed
   */
  public isPending(): boolean {
    return !this.completed;
  }

  /**
   * Creates a new task instance with toggled completion status
   * @returns New Task instance with opposite completion status
   */
  public toggleCompletion(): Task {
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

  /**
   * Creates a new task instance with updated title
   * @param title - New title for the task
   * @returns New Task instance with updated title
   */
  public updateTitle(title: string): Task {
    return new Task(
      this.id,
      title,
      this.description,
      this.completed,
      this.userId,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Creates a new task instance with updated description
   * @param description - New description for the task
   * @returns New Task instance with updated description
   */
  public updateDescription(description: string | undefined): Task {
    return new Task(
      this.id,
      this.title,
      description,
      this.completed,
      this.userId,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Creates a new task instance with updated content
   * @param title - New title for the task
   * @param description - New description for the task
   * @returns New Task instance with updated content
   */
  public updateContent(title: string, description: string | undefined): Task {
    return new Task(
      this.id,
      title,
      description,
      this.completed,
      this.userId,
      this.createdAt,
      new Date()
    );
  }

  /**
   * Converts Task instance to plain object for serialization
   * @returns Plain object representation of the task
   */
  public toPlainObject() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Creates Task instance from plain object
   * @param data - Plain object containing task data
   * @returns Task instance
   */
  public static fromPlainObject(data: any): Task {
    return new Task(
      data.id,
      data.title,
      data.description,
      data.completed,
      data.userId,
      new Date(data.createdAt),
      new Date(data.updatedAt)
    );
  }
}
