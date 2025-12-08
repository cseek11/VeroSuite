import { ValueObject } from '../base/ValueObject';

interface EmailProps {
  value: string;
}

/**
 * Email value object
 * Ensures email format validity and immutability
 */
export class Email extends ValueObject<EmailProps> {
  private static readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(props: EmailProps) {
    super(props);
  }

  /**
   * Create an Email value object with validation
   */
  public static create(email: string): Email {
    const trimmed = email.trim().toLowerCase();

    if (!this.emailRegex.test(trimmed)) {
      throw new Error(`Invalid email format: ${email}`);
    }

    return new Email({ value: trimmed });
  }

  /**
   * Get the email string value
   */
  public get value(): string {
    return this.props.value;
  }

  public toJSON(): object {
    return {
      email: this.props.value,
    };
  }
}
