import { Entity } from './Entity';
import { DomainEvent } from './DomainEvent';

/**
 * AggregateRoot - Entity that acts as a root for an aggregate
 * Aggregates are clusters of entities and value objects treated as a single unit
 * The aggregate root is the only entity in an aggregate that external objects should reference
 * Aggregates raise domain events that describe state changes
 */
export abstract class AggregateRoot<TId> extends Entity<TId> {
  private _uncommittedEvents: DomainEvent[] = [];

  constructor(id: TId) {
    super(id);
  }

  /**
   * Add a domain event to be raised
   */
  protected addDomainEvent(event: DomainEvent): void {
    this._uncommittedEvents.push(event);
  }

  /**
   * Get all uncommitted domain events
   */
  public getUncommittedEvents(): DomainEvent[] {
    return this._uncommittedEvents;
  }

  /**
   * Clear uncommitted events after they are persisted
   */
  public clearUncommittedEvents(): void {
    this._uncommittedEvents = [];
  }

  /**
   * Get number of uncommitted events
   */
  public getUncommittedEventsCount(): number {
    return this._uncommittedEvents.length;
  }

  /**
   * Check if aggregate has uncommitted events
   */
  public hasUncommittedEvents(): boolean {
    return this._uncommittedEvents.length > 0;
  }
}
