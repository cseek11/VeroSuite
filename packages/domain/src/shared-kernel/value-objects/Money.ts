import { ValueObject } from '../base/ValueObject';

interface MoneyProps {
  amount: number;
  currency: string;
}

/**
 * Money value object
 * Represents monetary amounts with currency
 * Prevents invalid currency or negative amounts
 */
export class Money extends ValueObject<MoneyProps> {
  private static readonly validCurrencies = [
    'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY', 'INR', 'MXN',
  ];

  private constructor(props: MoneyProps) {
    super(props);
  }

  /**
   * Create a Money value object with validation
   */
  public static create(amount: number, currency: string = 'USD'): Money {
    if (amount < 0) {
      throw new Error(`Amount cannot be negative: ${amount}`);
    }

    const upperCurrency = currency.toUpperCase();
    if (!this.validCurrencies.includes(upperCurrency)) {
      throw new Error(`Unsupported currency: ${currency}`);
    }

    return new Money({
      amount: Math.round(amount * 100) / 100, // Round to 2 decimals
      currency: upperCurrency,
    });
  }

  /**
   * Get the monetary amount
   */
  public get amount(): number {
    return this.props.amount;
  }

  /**
   * Get the currency code
   */
  public get currency(): string {
    return this.props.currency;
  }

  /**
   * Add two Money values (must be same currency)
   */
  public add(other: Money): Money {
    if (this.props.currency !== other.props.currency) {
      throw new Error(
        `Cannot add money in different currencies: ${this.props.currency} + ${other.props.currency}`,
      );
    }
    return Money.create(this.props.amount + other.props.amount, this.props.currency);
  }

  /**
   * Subtract two Money values (must be same currency)
   */
  public subtract(other: Money): Money {
    if (this.props.currency !== other.props.currency) {
      throw new Error(
        `Cannot subtract money in different currencies: ${this.props.currency} - ${other.props.currency}`,
      );
    }
    return Money.create(this.props.amount - other.props.amount, this.props.currency);
  }

  /**
   * Multiply money by a factor
   */
  public multiply(factor: number): Money {
    if (factor < 0) {
      throw new Error(`Multiplication factor cannot be negative: ${factor}`);
    }
    return Money.create(this.props.amount * factor, this.props.currency);
  }

  /**
   * Get formatted string representation
   */
  public getFormatted(): string {
    const currencySymbols: { [key: string]: string } = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      JPY: '¥',
      CNY: '¥',
    };
    const symbol = currencySymbols[this.props.currency] || this.props.currency;
    return `${symbol}${this.props.amount.toFixed(2)}`;
  }

  public toJSON(): object {
    return {
      amount: this.props.amount,
      currency: this.props.currency,
    };
  }
}
