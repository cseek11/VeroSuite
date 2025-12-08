/**
 * ValueObject - Base class for domain value objects
 * Value objects have no identity - they are defined by their attributes
 * Value objects should be immutable
 * Equality is based on attribute values, not identity
 */
export abstract class ValueObject<T> {
  protected readonly props: T;

  constructor(props: T) {
    Object.freeze(this);
    this.props = Object.freeze(props);
  }

  /**
   * Value objects are equal if their attributes are equal
   */
  public equals(other: ValueObject<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (other.props === undefined) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }

  /**
   * Get the value object's properties
   */
  public getValue(): T {
    return this.props;
  }

  /**
   * Convert to plain object for serialization
   */
  public abstract toJSON(): object;
}
