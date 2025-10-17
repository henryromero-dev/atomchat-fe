import { User } from './user.entity';

export class LoginResponse {
  constructor(
    public readonly message: string,
    public readonly accessToken: string,
    public readonly user: User
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.message || this.message.trim() === '') {
      throw new Error('Message is required');
    }
    if (!this.accessToken || this.accessToken.trim() === '') {
      throw new Error('Access token is required');
    }
    if (!this.user) {
      throw new Error('User is required');
    }
  }

  public toPlainObject() {
    return {
      message: this.message,
      accessToken: this.accessToken,
      user: this.user.toPlainObject()
    };
  }

  public static fromPlainObject(data: any): LoginResponse {
    return new LoginResponse(
      data.message,
      data.accessToken,
      User.fromPlainObject(data.user)
    );
  }
}
