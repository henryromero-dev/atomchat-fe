export class UpdateTaskRequest {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string | undefined,
    public readonly completed: boolean,
    public readonly userId: string
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

  public toPlainObject() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      userId: this.userId
    };
  }

  public static fromPlainObject(data: any): UpdateTaskRequest {
    return new UpdateTaskRequest(
      data.id,
      data.title,
      data.description,
      data.completed,
      data.userId
    );
  }
}
