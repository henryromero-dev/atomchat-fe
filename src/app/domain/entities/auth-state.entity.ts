import { User } from './user.entity';

export class AuthState {
  constructor(
    public readonly user: User | null,
    public readonly isAuthenticated: boolean,
    public readonly isLoading: boolean,
    public readonly error: string | null
  ) {}

  public toPlainObject() {
    return {
      user: this.user?.toPlainObject() || null,
      isAuthenticated: this.isAuthenticated,
      isLoading: this.isLoading,
      error: this.error
    };
  }

  public static fromPlainObject(data: any): AuthState {
    return new AuthState(
      data.user ? User.fromPlainObject(data.user) : null,
      data.isAuthenticated,
      data.isLoading,
      data.error
    );
  }
}
