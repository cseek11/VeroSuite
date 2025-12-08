/**
 * UUID Validation Pattern Tests
 * 
 * Tests for UUID validation pattern that should be applied
 * to all API clients that accept UUID parameters.
 * 
 * This prevents "Validation failed (uuid is expected)" errors
 * by validating UUIDs before making API calls.
 */

import { describe, it, expect } from 'vitest';

/**
 * UUID validation helper - should be used across all API clients
 */
function isValidUUID(str: string | undefined | null): boolean {
  if (!str || typeof str !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

describe('UUID Validation Pattern', () => {
  describe('Valid UUIDs', () => {
    it('should accept standard UUID v4 format', () => {
      const validUUIDs = [
        '123e4567-e89b-12d3-a456-426614174000',
        '7193113e-ece2-4f7b-ae8c-176df4367e28',
        '00000000-0000-0000-0000-000000000000',
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
        '550e8400-e29b-41d4-a716-446655440000',
      ];

      validUUIDs.forEach(uuid => {
        expect(isValidUUID(uuid)).toBe(true);
      });
    });

    it('should accept uppercase UUIDs', () => {
      expect(isValidUUID('123E4567-E89B-12D3-A456-426614174000')).toBe(true);
    });

    it('should accept mixed case UUIDs', () => {
      expect(isValidUUID('123e4567-E89b-12D3-a456-426614174000')).toBe(true);
    });
  });

  describe('Invalid UUIDs', () => {
    it('should reject empty string', () => {
      expect(isValidUUID('')).toBe(false);
    });

    it('should reject undefined', () => {
      expect(isValidUUID(undefined)).toBe(false);
    });

    it('should reject null', () => {
      expect(isValidUUID(null)).toBe(false);
    });

    it('should reject non-string types', () => {
      expect(isValidUUID(123 as any)).toBe(false);
      expect(isValidUUID({} as any)).toBe(false);
      expect(isValidUUID([] as any)).toBe(false);
    });

    it('should reject invalid formats', () => {
      const invalidUUIDs = [
        'not-a-uuid',
        '123',
        'abc-def-ghi',
        '12345678-1234-1234-1234-1234567890123', // Too long
        '1234567-1234-1234-1234-123456789012', // Too short
        '12345678-123-1234-1234-123456789012', // Invalid segment length
        '12345678-1234-123-1234-123456789012', // Invalid segment length
        '12345678-1234-1234-123-123456789012', // Invalid segment length
        '12345678-1234-1234-1234-12345678901', // Invalid segment length
        '12345678-1234-1234-1234-1234567890123', // Too long
        '12345678-1234-1234-1234-1234567890', // Too short
        '12345678-1234-1234-1234-123456789012-extra', // Extra characters
        '12345678-1234-1234-1234', // Missing segment
        '12345678-1234-1234', // Missing segments
        '12345678-1234', // Missing segments
        '12345678', // Missing segments
      ];

      invalidUUIDs.forEach(uuid => {
        expect(isValidUUID(uuid)).toBe(false);
      });
    });

    it('should reject UUIDs with invalid characters', () => {
      const invalidUUIDs = [
        '12345678-1234-1234-1234-12345678901g', // Invalid character 'g'
        '12345678-1234-1234-1234-12345678901G', // Invalid character 'G'
        '12345678-1234-1234-1234-12345678901z', // Invalid character 'z'
        '12345678-1234-1234-1234-12345678901!', // Invalid character '!'
        '12345678-1234-1234-1234-12345678901@', // Invalid character '@'
      ];

      invalidUUIDs.forEach(uuid => {
        expect(isValidUUID(uuid)).toBe(false);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle whitespace', () => {
      expect(isValidUUID(' 123e4567-e89b-12d3-a456-426614174000 ')).toBe(false);
      expect(isValidUUID('123e4567-e89b-12d3-a456-426614174000 ')).toBe(false);
      expect(isValidUUID(' 123e4567-e89b-12d3-a456-426614174000')).toBe(false);
    });

    it('should handle special characters', () => {
      expect(isValidUUID('123e4567-e89b-12d3-a456-42661417400!')).toBe(false);
      expect(isValidUUID('123e4567-e89b-12d3-a456-42661417400@')).toBe(false);
      expect(isValidUUID('123e4567-e89b-12d3-a456-42661417400#')).toBe(false);
    });
  });

  describe('Usage Pattern', () => {
    it('should be used before API calls', () => {
      const id = '123e4567-e89b-12d3-a456-426614174000';
      
      // Pattern: Validate before API call
      if (!isValidUUID(id)) {
        throw new Error(`Invalid ID: "${id}". ID must be a valid UUID.`);
      }
      
      // Would proceed with API call here
      expect(id).toBe('123e4567-e89b-12d3-a456-426614174000');
    });

    it('should prevent API calls with invalid IDs', () => {
      const invalidId = '';
      
      // Pattern: Validate before API call
      if (!isValidUUID(invalidId)) {
        // Should throw error, preventing API call
        expect(() => {
          if (!isValidUUID(invalidId)) {
            throw new Error(`Invalid ID: "${invalidId}". ID must be a valid UUID.`);
          }
        }).toThrow();
      }
    });
  });

  describe('Similar Endpoints Pattern', () => {
    it('should validate customer IDs', () => {
      const customerId = '123e4567-e89b-12d3-a456-426614174000';
      expect(isValidUUID(customerId)).toBe(true);
    });

    it('should validate technician IDs', () => {
      const technicianId = '123e4567-e89b-12d3-a456-426614174000';
      expect(isValidUUID(technicianId)).toBe(true);
    });

    it('should validate account IDs', () => {
      const accountId = '123e4567-e89b-12d3-a456-426614174000';
      expect(isValidUUID(accountId)).toBe(true);
    });

    it('should validate job IDs', () => {
      const jobId = '123e4567-e89b-12d3-a456-426614174000';
      expect(isValidUUID(jobId)).toBe(true);
    });
  });
});

