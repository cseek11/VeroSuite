/**
 * DomainEvent - Base class for domain events
 * Domain events represent significant events that occur in the domain
 * They are immutable and carry information about what happened
 */
export abstract class DomainEvent {
  public readonly occurredOn: Date;
  public readonly aggregateId: string;

  constructor(aggregateId: string) {
    this.occurredOn = new Date();
    this.aggregateId = aggregateId;
  }

  /**
   * Get event type name
   */
  public abstract getEventName(): string;

  /**
   * Get event payload for persistence/publishing
   */
  public abstract getPayload(): object;

  /**
   * Convert to JSON for serialization
   */
  public toJSON(): object {
    return {
      eventName: this.getEventName(),
      aggregateId: this.aggregateId,
      occurredOn: this.occurredOn.toISOString(),
      payload: this.getPayload(),
    };
  }
}
