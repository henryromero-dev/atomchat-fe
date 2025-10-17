/**
 * User - Domain entity representing a user in the system
 * 
 * This entity encapsulates user data and validation rules. It ensures data integrity
 * through validation and provides methods for user data manipulation while maintaining
 * immutability.
 * 
 * Features:
 * - Immutable entity with readonly properties
 * - Built-in email validation
 * - Factory methods for object creation
 * - Serialization support for API communication
 * - Business rule validation
 * 
 * @example
 * ```typescript
 * // Create user from API response
 * const user = User.fromPlainObject({
 *   id: '123',
 *   email: 'user@example.com',
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z'
 * });
 * 
 * // Convert to plain object for API requests
 * const userData = user.toPlainObject();
 * ```
 */
export class User {
  constructor(
    /** Unique identifier for the user */
    public readonly id: string,
    /** User's email address */
    public readonly email: string,
    /** User creation timestamp */
    public readonly createdAt: string,
    /** User last update timestamp */
    public readonly updatedAt: string
  ) {
    this.validate();
  }

  /**
   * Validates user data according to business rules
   * @throws Error if validation fails
   */
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

  /**
   * Validates email format using regex
   * @param email - Email address to validate
   * @returns True if email format is valid
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Converts User instance to plain object for serialization
   * @returns Plain object representation of the user
   */
  public toPlainObject() {
    return {
      id: this.id,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Creates User instance from plain object
   * @param data - Plain object containing user data
   * @returns User instance
   */
  public static fromPlainObject(data: any): User {
    return new User(
      data.id,
      data.email,
      data.createdAt,
      data.updatedAt
    );
  }
}
