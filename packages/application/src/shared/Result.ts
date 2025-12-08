/**
 * Result - Generic result wrapper for command/query execution
 * Supports both success and failure outcomes with error tracking
 */
export class Result<T> {
  public readonly isSuccess: boolean;
  public readonly value?: T;
  public readonly error?: string;

  private constructor(isSuccess: boolean, value?: T, error?: string) {
    this.isSuccess = isSuccess;
    this.value = value;
    this.error = error;
  }

  /**
   * Create a successful result
   */
  public static ok<U>(value?: U): Result<U> {
    return new Result(true, value);
  }

  /**
   * Create a failure result
   */
  public static fail<U>(error: string): Result<U> {
    return new Result(false, undefined, error);
  }

  /**
   * Get the value or throw if failed
   */
  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error(`Cannot get value of failed result: ${this.error}`);
    }
    return this.value as T;
  }

  /**
   * Get the error or throw if successful
   */
  public getError(): string {
    if (this.isSuccess) {
      throw new Error('Cannot get error of successful result');
    }
    return this.error as string;
  }

  /**
   * Map result to another type
   */
  public map<U>(fn: (value: T) => U): Result<U> {
    if (!this.isSuccess) {
      return Result.fail(this.error!);
    }
    try {
      return Result.ok(fn(this.value as T));
    } catch (error) {
      return Result.fail((error as Error).message);
    }
  }

  /**
   * Flat map (bind) result to another result
   */
  public flatMap<U>(fn: (value: T) => Result<U>): Result<U> {
    if (!this.isSuccess) {
      return Result.fail(this.error!);
    }
    try {
      return fn(this.value as T);
    } catch (error) {
      return Result.fail((error as Error).message);
    }
  }

  /**
   * Get value or return default
   */
  public getValueOr(defaultValue: T): T {
    return this.isSuccess ? (this.value as T) : defaultValue;
  }

  /**
   * Execute a function on success
   */
  public onSuccess(fn: (value: T) => void): Result<T> {
    if (this.isSuccess) {
      fn(this.value as T);
    }
    return this;
  }

  /**
   * Execute a function on failure
   */
  public onFailure(fn: (error: string) => void): Result<T> {
    if (!this.isSuccess) {
      fn(this.error!);
    }
    return this;
  }
}
