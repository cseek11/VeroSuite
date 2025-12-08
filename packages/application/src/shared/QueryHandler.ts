import { Query } from './Query';
import { Result } from './Result';

/**
 * QueryHandler - Base class for query handlers
 * Executes queries and returns results
 */
export abstract class QueryHandler<TQuery extends Query, TResult> {
  /**
   * Handle the query
   */
  abstract execute(query: TQuery): Promise<Result<TResult>>;
}
