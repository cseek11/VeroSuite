/**
 * Tests for formatCurrency utility function
 * 
 * Coverage:
 * - Basic formatting
 * - Different currencies
 * - Different locales
 * - Edge cases
 * - Error handling
 */

import { formatCurrency } from '../formatCurrency';

describe('formatCurrency', () => {
  describe('Basic formatting', () => {
    it('should format USD currency correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
    });

    it('should format EUR currency correctly', () => {
      expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56');
    });

    it('should format with different locales', () => {
      expect(formatCurrency(1234.56, 'EUR', 'de-DE')).toBe('1.234,56 €');
      expect(formatCurrency(1234.56, 'JPY', 'ja-JP')).toBe('¥1,235');
    });
  });

  describe('Edge cases', () => {
    it('should handle negative numbers', () => {
      expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
    });

    it('should handle very large numbers', () => {
      expect(formatCurrency(999999999.99)).toBe('$999,999,999.99');
    });

    it('should handle very small numbers', () => {
      expect(formatCurrency(0.01)).toBe('$0.01');
    });

    it('should throw error for invalid input', () => {
      expect(() => formatCurrency(NaN)).toThrow('Amount must be a valid number');
      expect(() => formatCurrency('invalid' as any)).toThrow('Amount must be a valid number');
    });
  });

  describe('Currency codes', () => {
    it('should handle various currency codes', () => {
      expect(formatCurrency(100, 'GBP')).toContain('£');
      expect(formatCurrency(100, 'JPY')).toContain('¥');
      expect(formatCurrency(100, 'CNY')).toContain('¥');
    });
  });
});



