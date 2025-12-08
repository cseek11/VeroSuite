import { Query } from '../Query';

/**
 * PaginationQuery - Base class for paginated queries
 * Handles pagination parameters (page, limit, sort)
 */
export abstract class PaginationQuery extends Query {
  public readonly page: number;
  public readonly limit: number;
  public readonly sortBy?: string;
  public readonly sortOrder?: 'ASC' | 'DESC';

  constructor(page: number = 1, limit: number = 20, sortBy?: string, sortOrder: 'ASC' | 'DESC' = 'ASC') {
    super();

    if (page < 1) {
      throw new Error('Page number must be at least 1');
    }

    if (limit < 1 || limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }

    this.page = page;
    this.limit = limit;
    this.sortBy = sortBy;
    this.sortOrder = sortOrder;
  }

  /**
   * Get the offset for database queries
   */
  public getOffset(): number {
    return (this.page - 1) * this.limit;
  }

  /**
   * Get the limit for database queries
   */
  public getLimit(): number {
    return this.limit;
  }
}
