export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly createdAt: string,
    public readonly updatedAt: string
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.id || this.id.trim() === '') {
      throw new Error('User ID is required');
    }
    if (!this.email || this.email.trim() === '') {
      throw new Error('Email is required');
    }
    if (!this.isValidEmail(this.email)) {
      throw new Error('Invalid email format');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public toPlainObject() {
    return {
      id: this.id,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  public static fromPlainObject(data: any): User {
    return new User(
      data.id,
      data.email,
      data.createdAt,
      data.updatedAt
    );
  }
}
