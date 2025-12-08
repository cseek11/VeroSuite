import { ValueObject } from '../base/ValueObject';

interface AddressProps {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

/**
 * Address value object
 * Represents a physical address with all components
 */
export class Address extends ValueObject<AddressProps> {
  private constructor(props: AddressProps) {
    super(props);
  }

  /**
   * Create an Address value object with validation
   */
  public static create(
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string,
  ): Address {
    if (!street || !city || !state || !zipCode || !country) {
      throw new Error('All address fields are required');
    }

    return new Address({
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      zipCode: zipCode.trim(),
      country: country.trim(),
    });
  }

  /**
   * Get street address
   */
  public get street(): string {
    return this.props.street;
  }

  /**
   * Get city
   */
  public get city(): string {
    return this.props.city;
  }

  /**
   * Get state
   */
  public get state(): string {
    return this.props.state;
  }

  /**
   * Get zip code
   */
  public get zipCode(): string {
    return this.props.zipCode;
  }

  /**
   * Get country
   */
  public get country(): string {
    return this.props.country;
  }

  /**
   * Get formatted full address
   */
  public getFormatted(): string {
    return `${this.props.street}, ${this.props.city}, ${this.props.state} ${this.props.zipCode}, ${this.props.country}`;
  }

  public toJSON(): object {
    return {
      street: this.props.street,
      city: this.props.city,
      state: this.props.state,
      zipCode: this.props.zipCode,
      country: this.props.country,
    };
  }
}
