/**
 * String utilities - pure functions for string operations
 * No framework dependencies
 */

/**
 * Capitalize the first letter of a string
 */
export function capitalize(str: string): string {
  if (!str || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert string to lowercase
 */
export function lowercase(str: string): string {
  return str.toLowerCase();
}

/**
 * Convert string to uppercase
 */
export function uppercase(str: string): string {
  return str.toUpperCase();
}

/**
 * Trim whitespace from string
 */
export function trim(str: string): string {
  return str.trim();
}

/**
 * Truncate string to specified length with ellipsis
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

/**
 * Check if string is empty or whitespace only
 */
export function isEmpty(str: string): boolean {
  return !str || str.trim().length === 0;
}

/**
 * Reverse a string
 */
export function reverse(str: string): string {
  return str.split('').reverse().join('');
}

/**
 * Check if string starts with prefix
 */
export function startsWith(str: string, prefix: string): boolean {
  return str.startsWith(prefix);
}

/**
 * Check if string ends with suffix
 */
export function endsWith(str: string, suffix: string): boolean {
  return str.endsWith(suffix);
}

/**
 * Check if string contains substring
 */
export function contains(str: string, substring: string): boolean {
  return str.includes(substring);
}

/**
 * Replace all occurrences of a string
 */
export function replaceAll(str: string, find: string, replace: string): string {
  return str.split(find).join(replace);
}

/**
 * Convert camelCase to snake_case
 */
export function camelToSnake(str: string): string {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

/**
 * Convert snake_case to camelCase
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Convert string to kebab-case
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .replace(/_/g, '-')
    .toLowerCase()
    .replace(/^-/, '');
}

/**
 * Pad string to specified length
 */
export function padLeft(str: string, length: number, padChar: string = ' '): string {
  return padChar.repeat(Math.max(0, length - str.length)) + str;
}

/**
 * Pad string to specified length on right
 */
export function padRight(str: string, length: number, padChar: string = ' '): string {
  return str + padChar.repeat(Math.max(0, length - str.length));
}

/**
 * Remove all whitespace from string
 */
export function removeWhitespace(str: string): string {
  return str.replace(/\s+/g, '');
}

/**
 * Count occurrences of substring in string
 */
export function countOccurrences(str: string, substring: string): number {
  if (!substring) return 0;
  return str.split(substring).length - 1;
}

/**
 * Generate a slug from string
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
