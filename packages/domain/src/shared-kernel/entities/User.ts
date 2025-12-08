import { AggregateRoot } from '../base/AggregateRoot';
import { Email } from '../value-objects/Email';

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  TECHNICIAN = 'TECHNICIAN',
  CUSTOMER = 'CUSTOMER',
}

interface UserProps {
  email: Email;
  firstName: string;
  lastName: string;
  role: UserRole;
  tenantId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User aggregate root
 * Represents a user account in the system
 */
export class User extends AggregateRoot<string> {
  private props: UserProps;

  private constructor(id: string, props: UserProps) {
    super(id);
    this.props = props;
  }

  /**
   * Create a new User
   */
  public static create(
    id: string,
    email: Email,
    firstName: string,
    lastName: string,
    role: UserRole,
    tenantId: string,
  ): User {
    if (!firstName || firstName.trim().length === 0) {
      throw new Error('First name is required');
    }

    if (!lastName || lastName.trim().length === 0) {
      throw new Error('Last name is required');
    }

    if (!tenantId || tenantId.trim().length === 0) {
      throw new Error('Tenant ID is required');
    }

    return new User(id, {
      email,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      role,
      tenantId,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  /**
   * Get user email
   */
  public get email(): Email {
    return this.props.email;
  }

  /**
   * Get user first name
   */
  public get firstName(): string {
    return this.props.firstName;
  }

  /**
   * Get user last name
   */
  public get lastName(): string {
    return this.props.lastName;
  }

  /**
   * Get full name
   */
  public get fullName(): string {
    return `${this.props.firstName} ${this.props.lastName}`;
  }

  /**
   * Get user role
   */
  public get role(): UserRole {
    return this.props.role;
  }

  /**
   * Get tenant ID
   */
  public get tenantId(): string {
    return this.props.tenantId;
  }

  /**
   * Check if user is active
   */
  public get isActive(): boolean {
    return this.props.isActive;
  }

  /**
   * Get creation timestamp
   */
  public get createdAt(): Date {
    return this.props.createdAt;
  }

  /**
   * Get last update timestamp
   */
  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  /**
   * Update user email
   */
  public updateEmail(newEmail: Email): void {
    this.props.email = newEmail;
    this.props.updatedAt = new Date();
  }

  /**
   * Update user name
   */
  public updateName(firstName: string, lastName: string): void {
    if (!firstName || firstName.trim().length === 0) {
      throw new Error('First name cannot be empty');
    }
    if (!lastName || lastName.trim().length === 0) {
      throw new Error('Last name cannot be empty');
    }
    this.props.firstName = firstName.trim();
    this.props.lastName = lastName.trim();
    this.props.updatedAt = new Date();
  }

  /**
   * Update user role
   */
  public updateRole(newRole: UserRole): void {
    this.props.role = newRole;
    this.props.updatedAt = new Date();
  }

  /**
   * Deactivate user
   */
  public deactivate(): void {
    this.props.isActive = false;
    this.props.updatedAt = new Date();
  }

  /**
   * Activate user
   */
  public activate(): void {
    this.props.isActive = true;
    this.props.updatedAt = new Date();
  }

  public toJSON(): object {
    return {
      id: this.id,
      email: this.props.email.toJSON(),
      firstName: this.props.firstName,
      lastName: this.props.lastName,
      fullName: this.fullName,
      role: this.props.role,
      tenantId: this.props.tenantId,
      isActive: this.props.isActive,
      createdAt: this.props.createdAt.toISOString(),
      updatedAt: this.props.updatedAt.toISOString(),
    };
  }
}
