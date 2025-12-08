import { ValueObject } from '../base/ValueObject';

interface PhoneNumberProps {
  value: string;
  countryCode: string;
}

/**
 * PhoneNumber value object
 * Stores phone number with country code
 * Basic format validation
 */
export class PhoneNumber extends ValueObject<PhoneNumberProps> {
  private static readonly phoneRegex = /^\+?[\d\s\-().]+$/;

  private constructor(props: PhoneNumberProps) {
    super(props);
  }

  /**
   * Create a PhoneNumber value object with validation
   */
  public static create(phoneNumber: string, countryCode: string = 'US'): PhoneNumber {
    const trimmed = phoneNumber.trim();

    if (!this.phoneRegex.test(trimmed)) {
      throw new Error(`Invalid phone number format: ${phoneNumber}`);
    }

    if (!countryCode || countryCode.length !== 2) {
      throw new Error(`Invalid country code: ${countryCode}`);
    }

    return new PhoneNumber({
      value: trimmed,
      countryCode: countryCode.toUpperCase(),
    });
  }

  /**
   * Get the phone number string
   */
  public get value(): string {
    return this.props.value;
  }

  /**
   * Get the country code
   */
  public get countryCode(): string {
    return this.props.countryCode;
  }

  /**
   * Get formatted phone number with country code
   */
  public getFormatted(): string {
    return `+${this.props.countryCode} ${this.props.value}`;
  }

  public toJSON(): object {
    return {
      phoneNumber: this.props.value,
      countryCode: this.props.countryCode,
    };
  }
}
