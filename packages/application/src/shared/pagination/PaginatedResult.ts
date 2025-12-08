/**
 * PaginatedResult - Generic paginated result wrapper
 * Contains data items and pagination metadata
 */
export class PaginatedResult<T> {
  public readonly data: T[];
  public readonly page: number;
  public readonly limit: number;
  public readonly total: number;
  public readonly totalPages: number;
  public readonly hasNextPage: boolean;
  public readonly hasPreviousPage: boolean;

  constructor(data: T[], page: number, limit: number, total: number) {
    if (page < 1) {
      throw new Error('Page number must be at least 1');
    }

    if (limit < 1) {
      throw new Error('Limit must be at least 1');
    }

    if (total < 0) {
      throw new Error('Total cannot be negative');
    }

    this.data = data;
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.totalPages = Math.ceil(total / limit);
    this.hasNextPage = page < this.totalPages;
    this.hasPreviousPage = page > 1;
  }

  /**
   * Check if there are any items
   */
  public isEmpty(): boolean {
    return this.data.length === 0;
  }

  /**
   * Get the starting index of items on this page
   */
  public getStartIndex(): number {
    return (this.page - 1) * this.limit + 1;
  }

  /**
   * Get the ending index of items on this page
   */
  public getEndIndex(): number {
    return Math.min(this.page * this.limit, this.total);
  }

  /**
   * Get the page info as a string
   */
  public getPageInfo(): string {
    if (this.isEmpty()) {
      return `Page ${this.page} of ${this.totalPages} (no items)`;
    }
    return `Showing ${this.getStartIndex()}-${this.getEndIndex()} of ${this.total} items (page ${this.page} of ${this.totalPages})`;
  }

  /**
   * Map each item to a new type
   */
  public map<U>(fn: (item: T) => U): PaginatedResult<U> {
    return new PaginatedResult(this.data.map(fn), this.page, this.limit, this.total);
  }

  /**
   * Convert to plain object for JSON serialization
   */
  public toJSON(): object {
    return {
      data: this.data,
      page: this.page,
      limit: this.limit,
      total: this.total,
      totalPages: this.totalPages,
      hasNextPage: this.hasNextPage,
      hasPreviousPage: this.hasPreviousPage,
    };
  }
}
