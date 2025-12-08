/**
 * API Response Extraction Helper Tests
 * 
 * Tests for a reusable helper function that extracts data arrays
 * from various response structures. This can be used across
 * all API clients to prevent similar bugs.
 */

import { describe, it, expect } from 'vitest';

/**
 * Helper function to extract data array from various response structures
 * Handles:
 * - { data: { data: [...] } } (double-nested)
 * - { data: [...] } (single-nested)
 * - [...] (direct array)
 * - { items: [...] } (alternative format)
 */
function extractDataArray<T = any>(response: any, dataKey: string = 'data'): T[] {
  // Check for double-nested: { data: { data: [...] } }
  if (response?.[dataKey]?.[dataKey] && Array.isArray(response[dataKey][dataKey])) {
    return response[dataKey][dataKey];
  }
  
  // Check for single-nested: { data: [...] }
  if (response?.[dataKey] && Array.isArray(response[dataKey])) {
    return response[dataKey];
  }
  
  // Check for direct array
  if (Array.isArray(response)) {
    return response;
  }
  
  // Check for alternative key (e.g., { technicians: [...] })
  const alternativeKeys = ['technicians', 'items', 'results', 'list'];
  for (const key of alternativeKeys) {
    if (response?.[key] && Array.isArray(response[key])) {
      return response[key];
    }
  }
  
  // Check for nested alternative key (e.g., { data: { technicians: [...] } })
  for (const key of alternativeKeys) {
    if (response?.[dataKey]?.[key] && Array.isArray(response[dataKey][key])) {
      return response[dataKey][key];
    }
  }
  
  return [];
}

describe('extractDataArray Helper Function', () => {
  describe('Double-Nested Structure', () => {
    it('should extract from { data: { data: [...] } }', () => {
      const response = {
        data: {
          data: [{ id: '1' }, { id: '2' }],
          pagination: {},
        },
        meta: {},
      };

      const result = extractDataArray(response);
      expect(result).toEqual([{ id: '1' }, { id: '2' }]);
      expect(result.length).toBe(2);
    });

    it('should extract from { data: { technicians: [...] } }', () => {
      const response = {
        data: {
          technicians: [{ id: '1' }, { id: '2' }],
          total: 2,
        },
        meta: {},
      };

      const result = extractDataArray(response);
      expect(result).toEqual([{ id: '1' }, { id: '2' }]);
      expect(result.length).toBe(2);
    });
  });

  describe('Single-Nested Structure', () => {
    it('should extract from { data: [...] }', () => {
      const response = {
        data: [{ id: '1' }, { id: '2' }],
        meta: {},
      };

      const result = extractDataArray(response);
      expect(result).toEqual([{ id: '1' }, { id: '2' }]);
      expect(result.length).toBe(2);
    });
  });

  describe('Direct Array', () => {
    it('should extract from direct array', () => {
      const response = [{ id: '1' }, { id: '2' }];

      const result = extractDataArray(response);
      expect(result).toEqual([{ id: '1' }, { id: '2' }]);
      expect(result.length).toBe(2);
    });
  });

  describe('Alternative Formats', () => {
    it('should extract from { items: [...] }', () => {
      const response = {
        items: [{ id: '1' }, { id: '2' }],
      };

      const result = extractDataArray(response);
      expect(result).toEqual([{ id: '1' }, { id: '2' }]);
      expect(result.length).toBe(2);
    });

    it('should extract from { results: [...] }', () => {
      const response = {
        results: [{ id: '1' }, { id: '2' }],
      };

      const result = extractDataArray(response);
      expect(result).toEqual([{ id: '1' }, { id: '2' }]);
      expect(result.length).toBe(2);
    });
  });

  describe('Edge Cases', () => {
    it('should return empty array for null response', () => {
      const result = extractDataArray(null);
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should return empty array for undefined response', () => {
      const result = extractDataArray(undefined);
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should return empty array for empty object', () => {
      const result = extractDataArray({});
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should return empty array when data is not an array', () => {
      const response = {
        data: { message: 'No items' },
      };

      const result = extractDataArray(response);
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });
  });

  describe('Real-World Examples', () => {
    it('should handle technicians response structure', () => {
      const response = {
        data: {
          data: [
            { id: 'tech-1', first_name: 'John', last_name: 'Doe' },
            { id: 'tech-2', first_name: 'Jane', last_name: 'Smith' },
          ],
          pagination: { page: 1, limit: 20, total: 2 },
          success: true,
        },
        meta: { version: '2.0', count: 2 },
      };

      const result = extractDataArray(response);
      expect(result.length).toBe(2);
      expect(result[0]).toHaveProperty('id', 'tech-1');
      expect(result[0]).toHaveProperty('first_name', 'John');
    });

    it('should handle accounts response structure', () => {
      const response = {
        data: {
          data: [
            { id: 'acc-1', name: 'Account 1' },
          ],
          pagination: { page: 1, limit: 20, total: 1 },
        },
        meta: { version: '1.0', count: 1 },
      };

      const result = extractDataArray(response);
      expect(result.length).toBe(1);
      expect(result[0]).toHaveProperty('id', 'acc-1');
    });
  });
});

