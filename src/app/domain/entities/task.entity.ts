export class Task {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string | undefined,
    public readonly completed: boolean,
    public readonly userId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {
    this.validate();
  }

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

  public isCompleted(): boolean {
    return this.completed;
  }

  public isPending(): boolean {
    return !this.completed;
  }

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
