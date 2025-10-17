export class LoginRequest {
  constructor(
    public readonly email: string
  ) {
    this.validate();
  }

  private validate(): void {
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
      email: this.email
    };
  }

  public static fromPlainObject(data: any): LoginRequest {
    return new LoginRequest(data.email);
  }
}
