import { AggregateRoot } from '../base/AggregateRoot';
import { Email } from '../value-objects/Email';
import { PhoneNumber } from '../value-objects/PhoneNumber';
import { Address } from '../value-objects/Address';

interface CustomerProps {
  name: string;
  email: Email;
  phoneNumber: PhoneNumber;
  address: Address;
  tenantId: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Customer aggregate root
 * Represents a customer in the system
 */
export class Customer extends AggregateRoot<string> {
  private props: CustomerProps;

  private constructor(id: string, props: CustomerProps) {
    super(id);
    this.props = props;
  }

  /**
   * Create a new Customer
   */
  public static create(
    id: string,
    name: string,
    email: Email,
    phoneNumber: PhoneNumber,
    address: Address,
    tenantId: string,
  ): Customer {
    if (!name || name.trim().length === 0) {
      throw new Error('Customer name is required');
    }

    if (!tenantId || tenantId.trim().length === 0) {
      throw new Error('Tenant ID is required');
    }

    return new Customer(id, {
      name: name.trim(),
      email,
      phoneNumber,
      address,
      tenantId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  /**
   * Get customer name
   */
  public get name(): string {
    return this.props.name;
  }

  /**
   * Get customer email
   */
  public get email(): Email {
    return this.props.email;
  }

  /**
   * Get customer phone number
   */
  public get phoneNumber(): PhoneNumber {
    return this.props.phoneNumber;
  }

  /**
   * Get customer address
   */
  public get address(): Address {
    return this.props.address;
  }

  /**
   * Get tenant ID
   */
  public get tenantId(): string {
    return this.props.tenantId;
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
   * Update customer name
   */
  public updateName(newName: string): void {
    if (!newName || newName.trim().length === 0) {
      throw new Error('Customer name cannot be empty');
    }
    this.props.name = newName.trim();
    this.props.updatedAt = new Date();
  }

  /**
   * Update customer email
   */
  public updateEmail(newEmail: Email): void {
    this.props.email = newEmail;
    this.props.updatedAt = new Date();
  }

  /**
   * Update customer phone number
   */
  public updatePhoneNumber(newPhoneNumber: PhoneNumber): void {
    this.props.phoneNumber = newPhoneNumber;
    this.props.updatedAt = new Date();
  }

  /**
   * Update customer address
   */
  public updateAddress(newAddress: Address): void {
    this.props.address = newAddress;
    this.props.updatedAt = new Date();
  }

  public toJSON(): object {
    return {
      id: this.id,
      name: this.props.name,
      email: this.props.email.toJSON(),
      phoneNumber: this.props.phoneNumber.toJSON(),
      address: this.props.address.toJSON(),
      tenantId: this.props.tenantId,
      createdAt: this.props.createdAt.toISOString(),
      updatedAt: this.props.updatedAt.toISOString(),
    };
  }
}
