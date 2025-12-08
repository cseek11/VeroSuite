/**
 * Query - Base class for queries
 * Queries represent requests to read data from the system
 * Queries should not modify state
 */
export abstract class Query {
  public readonly timestamp: Date;

  constructor() {
    this.timestamp = new Date();
  }

  /**
   * Get the query type name
   */
  abstract getQueryName(): string;
}
