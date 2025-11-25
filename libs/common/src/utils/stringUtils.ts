/**
 * stringUtils - String utility functions.
 * 
 * Pure utility functions with no external dependencies,
 * no database access, and no security concerns.
 * 
 * @module stringUtils
 */

/**
 * Truncates a string to a specified length with optional ellipsis.
 * 
 * @param str - The string to truncate
 * @param maxLength - Maximum length of the truncated string
 * @param ellipsis - String to append if truncated (default: '...')
 * @returns Truncated string
 * 
 * @example
 * ```typescript
 * truncate("Hello World", 5) // "Hello..."
 * truncate("Hello World", 5, "...") // "Hello..."
 * truncate("Hi", 10) // "Hi" (no truncation needed)
 * ```
 */
export function truncate(
  str: string,
  maxLength: number,
  ellipsis: string = '...'
): string {
  if (typeof str !== 'string') {
    throw new Error('First argument must be a string');
  }
  
  if (typeof maxLength !== 'number' || maxLength < 0) {
    throw new Error('maxLength must be a non-negative number');
  }
  
  if (str.length <= maxLength) {
    return str;
  }
  
  return str.slice(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * Capitalizes the first letter of a string.
 * 
 * @param str - The string to capitalize
 * @returns String with first letter capitalized
 * 
 * @example
 * ```typescript
 * capitalize("hello") // "Hello"
 * capitalize("HELLO") // "HELLO"
 * capitalize("") // ""
 * ```
 */
export function capitalize(str: string): string {
  if (typeof str !== 'string') {
    throw new Error('Argument must be a string');
  }
  
  if (str.length === 0) {
    return str;
  }
  
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

