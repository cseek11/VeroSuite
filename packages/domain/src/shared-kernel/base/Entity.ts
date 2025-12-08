/**
 * Entity - Base class for domain entities
 * Entities have identity and can change over time
 * Equality is based on ID, not on attributes
 */
export abstract class Entity<TId> {
  protected readonly _id: TId;

  constructor(id: TId) {
    this._id = id;
  }

  get id(): TId {
    return this._id;
  }

  /**
   * Entities are equal if they have the same ID
   */
  public equals(other: Entity<TId>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    return this._id === other._id;
  }

  /**
   * Convert to plain object for serialization
   */
  public abstract toJSON(): object;
}
