export class CreateTaskRequest {
  constructor(
    public readonly title: string,
    public readonly description: string | undefined,
    public readonly userId: string
  ) {
    this.validate();
  }

  private validate(): void {
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
      title: this.title,
      description: this.description,
      userId: this.userId
    };
  }

  public static fromPlainObject(data: any): CreateTaskRequest {
    return new CreateTaskRequest(
      data.title,
      data.description,
      data.userId
    );
  }
}
