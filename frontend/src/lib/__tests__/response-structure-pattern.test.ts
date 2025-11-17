/**
 * Response Structure Pattern Tests
 * 
 * Simplified tests that focus on the response extraction pattern
 * without requiring full API mocking. These tests verify the
 * extraction logic that should be used across all API clients.
 */

import { describe, it, expect } from 'vitest';

/**
 * Response extraction pattern - matches what's in enhanced-api.ts
 */
function extractDataArray(response: any): any[] {
  // Check if response.data.data exists (double-nested structure from controller wrapping DTO)
  if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  // Check if response.data.technicians exists (alternative nested structure)
  else if (response && response.data && response.data.technicians && Array.isArray(response.data.technicians)) {
    return response.data.technicians;
  }
  // Check if response.data is a direct array
  else if (response && response.data && Array.isArray(response.data)) {
    return response.data;
  }
  // Check if response is a direct array
  else if (Array.isArray(response)) {
    return response;
  }
  // Check if response.technicians exists (alternative format)
  else if (response && response.technicians && Array.isArray(response.technicians)) {
    return response.technicians;
  }
  
  return [];
}

describe('Response Structure Extraction Pattern', () => {
  describe('Double-Nested Structure (Controller-wrapped DTO)', () => {
    it('should extract from { data: { data: [...] } } - technicians pattern', () => {
      const response = {
        data: {
          data: [
            { id: '1', first_name: 'John', last_name: 'Doe' },
            { id: '2', first_name: 'Jane', last_name: 'Smith' },
          ],
          pagination: { page: 1, limit: 20, total: 2 },
          success: true,
        },
        meta: { version: '2.0', count: 2 },
      };

      const result = extractDataArray(response);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0]).toHaveProperty('id', '1');
      expect(result[0]).toHaveProperty('first_name', 'John');
    });

    it('should extract from { data: { data: [...] } } - accounts pattern', () => {
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
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
      expect(result[0]).toHaveProperty('id', 'acc-1');
    });

    it('should extract from { data: { data: [...] } } - work orders pattern', () => {
      const response = {
        data: {
          data: [
            { id: 'wo-1', description: 'Work Order 1' },
          ],
          pagination: { page: 1, limit: 20, total: 1 },
        },
        meta: { version: '1.0', count: 1 },
      };

      const result = extractDataArray(response);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
      expect(result[0]).toHaveProperty('id', 'wo-1');
    });
  });

  describe('Single-Nested Structure', () => {
    it('should extract from { data: [...] }', () => {
      const response = {
        data: [
          { id: '1', name: 'Item 1' },
          { id: '2', name: 'Item 2' },
        ],
        meta: { version: '2.0', count: 2 },
      };

      const result = extractDataArray(response);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });
  });

  describe('Alternative Formats', () => {
    it('should extract from { data: { technicians: [...] } }', () => {
      const response = {
        data: {
          technicians: [
            { id: '1', name: 'Tech 1' },
          ],
          total: 1,
        },
        meta: {},
      };

      const result = extractDataArray(response);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
    });

    it('should extract from { technicians: [...] }', () => {
      const response = {
        technicians: [
          { id: '1', name: 'Tech 1' },
        ],
      };

      const result = extractDataArray(response);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(1);
    });

    it('should extract from direct array', () => {
      const response = [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
      ];

      const result = extractDataArray(response);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });
  });

  describe('Edge Cases', () => {
    it('should return empty array for null', () => {
      const result = extractDataArray(null);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should return empty array for undefined', () => {
      const result = extractDataArray(undefined);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should return empty array when data is not an array', () => {
      const response = {
        data: {
          data: { message: 'No items' }, // Not an array!
        },
      };

      const result = extractDataArray(response);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should return empty array for unexpected structure', () => {
      const response = {
        unexpected: 'structure',
        with: { nested: 'data' },
      };

      const result = extractDataArray(response);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe('Regression Tests', () => {
    it('should prevent "Unexpected response format" for double-nested structure', () => {
      // This is the exact structure that caused the technicians bug
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
      
      // Should extract correctly, not return empty array
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0]).toHaveProperty('id', 'tech-1');
      expect(result[0]).toHaveProperty('first_name', 'John');
    });

    it('should handle empty double-nested structure', () => {
      const response = {
        data: {
          data: [],
          pagination: { page: 1, limit: 20, total: 0 },
        },
        meta: { version: '2.0', count: 0 },
      };

      const result = extractDataArray(response);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe('Pattern Detection', () => {
    it('should detect double-nested structure', () => {
      const response = {
        data: {
          data: [{ id: '1' }],
        },
      };

      const isDoubleNested = response?.data?.data && Array.isArray(response.data.data);
      expect(isDoubleNested).toBe(true);
    });

    it('should detect single-nested structure', () => {
      const response = {
        data: [{ id: '1' }],
      };

      const isSingleNested = response?.data && Array.isArray(response.data);
      expect(isSingleNested).toBe(true);
    });
  });
});

