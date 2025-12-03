/**
 * Tests for stringUtils module.
 */

import { truncate, capitalize } from '../stringUtils';

describe('truncate', () => {
  it('should truncate string longer than maxLength', () => {
    expect(truncate('Hello World', 5)).toBe('He...');
  });

  it('should not truncate string shorter than maxLength', () => {
    expect(truncate('Hi', 10)).toBe('Hi');
  });

  it('should use custom ellipsis', () => {
    expect(truncate('Hello World', 5, '…')).toBe('Hell…');
  });

  it('should throw error for non-string input', () => {
    expect(() => truncate(123 as any, 5)).toThrow('First argument must be a string');
  });

  it('should throw error for negative maxLength', () => {
    expect(() => truncate('Hello', -1)).toThrow('maxLength must be a non-negative number');
  });

  it('should handle empty string', () => {
    expect(truncate('', 5)).toBe('');
  });
});

describe('capitalize', () => {
  it('should capitalize first letter', () => {
    expect(capitalize('hello')).toBe('Hello');
  });

  it('should handle already capitalized string', () => {
    expect(capitalize('HELLO')).toBe('Hello');
  });

  it('should handle empty string', () => {
    expect(capitalize('')).toBe('');
  });

  it('should throw error for non-string input', () => {
    expect(() => capitalize(123 as any)).toThrow('Argument must be a string');
  });
});



