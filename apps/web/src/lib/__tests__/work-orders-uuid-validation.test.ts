/**
 * Work Orders UUID Validation Tests
 * 
 * Tests to catch "Validation failed (uuid is expected)" errors
 * by validating UUIDs before API calls
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { workOrdersApi } from '../work-orders-api';

// Mock fetch globally
global.fetch = vi.fn() as any;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock logger
vi.mock('@/utils/logger', () => ({
  logger: {
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

// UUID validation helper
function isValidUUID(str: string | undefined | null): boolean {
  if (!str || typeof str !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

describe('Work Orders UUID Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
    localStorageMock.clear();
    localStorageMock.setItem('verofield_auth', JSON.stringify({ token: 'test-token' }));
    localStorageMock.setItem('tenantId', '7193113e-ece2-4f7b-ae8c-176df4367e28');
  });

  describe('getWorkOrderById - UUID Validation', () => {
    it('should reject empty string ID', async () => {
      await expect(workOrdersApi.getWorkOrderById('')).rejects.toThrow();
      
      // Should not make API call with invalid ID
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should reject undefined ID', async () => {
      await expect(workOrdersApi.getWorkOrderById(undefined as any)).rejects.toThrow();
      
      // Should not make API call with invalid ID
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should reject null ID', async () => {
      await expect(workOrdersApi.getWorkOrderById(null as any)).rejects.toThrow();
      
      // Should not make API call with invalid ID
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should reject invalid UUID format', async () => {
      const invalidIds = [
        'not-a-uuid',
        '123',
        'abc-def-ghi',
        '12345678-1234-1234-1234-1234567890123', // Too long
        '1234567-1234-1234-1234-123456789012', // Too short
        '12345678-123-1234-1234-123456789012', // Invalid format
      ];

      for (const invalidId of invalidIds) {
        await expect(workOrdersApi.getWorkOrderById(invalidId)).rejects.toThrow();
      }
    });

    it('should accept valid UUID', async () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      const mockResponse = {
        ok: true,
        json: async () => ({ id: validUUID, description: 'Test' }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      const result = await workOrdersApi.getWorkOrderById(validUUID);

      expect(global.fetch).toHaveBeenCalled();
      expect(result).toHaveProperty('id', validUUID);
    });
  });

  describe('updateWorkOrder - UUID Validation', () => {
    it('should reject empty string ID', async () => {
      await expect(workOrdersApi.updateWorkOrder('', {})).rejects.toThrow();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should reject invalid UUID format', async () => {
      await expect(workOrdersApi.updateWorkOrder('invalid', {})).rejects.toThrow();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should accept valid UUID', async () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      const mockResponse = {
        ok: true,
        json: async () => ({ id: validUUID }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await workOrdersApi.updateWorkOrder(validUUID, { description: 'Updated' });

      expect(global.fetch).toHaveBeenCalled();
    });
  });

  describe('deleteWorkOrder - UUID Validation', () => {
    it('should reject empty string ID', async () => {
      await expect(workOrdersApi.deleteWorkOrder('')).rejects.toThrow();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should reject invalid UUID format', async () => {
      await expect(workOrdersApi.deleteWorkOrder('invalid')).rejects.toThrow();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should accept valid UUID', async () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      const mockResponse = {
        ok: true,
        json: async () => ({ message: 'Deleted' }),
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await workOrdersApi.deleteWorkOrder(validUUID);

      expect(global.fetch).toHaveBeenCalled();
    });
  });

  describe('getWorkOrdersByCustomer - UUID Validation', () => {
    it('should reject empty string customer ID', async () => {
      await expect(workOrdersApi.getWorkOrdersByCustomer('')).rejects.toThrow();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should reject invalid UUID format', async () => {
      await expect(workOrdersApi.getWorkOrdersByCustomer('invalid')).rejects.toThrow();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should accept valid UUID', async () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      const mockResponse = {
        ok: true,
        json: async () => [],
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await workOrdersApi.getWorkOrdersByCustomer(validUUID);

      expect(global.fetch).toHaveBeenCalled();
    });
  });

  describe('getWorkOrdersByTechnician - UUID Validation', () => {
    it('should reject empty string technician ID', async () => {
      await expect(workOrdersApi.getWorkOrdersByTechnician('')).rejects.toThrow();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should reject invalid UUID format', async () => {
      await expect(workOrdersApi.getWorkOrdersByTechnician('invalid')).rejects.toThrow();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('should accept valid UUID', async () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      const mockResponse = {
        ok: true,
        json: async () => [],
      };

      (global.fetch as any).mockResolvedValue(mockResponse);

      await workOrdersApi.getWorkOrdersByTechnician(validUUID);

      expect(global.fetch).toHaveBeenCalled();
    });
  });

  describe('UUID Validation Helper', () => {
    it('should validate UUID format correctly', () => {
      const validUUIDs = [
        '123e4567-e89b-12d3-a456-426614174000',
        '00000000-0000-0000-0000-000000000000',
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
        '7193113e-ece2-4f7b-ae8c-176df4367e28',
      ];

      validUUIDs.forEach(uuid => {
        expect(isValidUUID(uuid)).toBe(true);
      });
    });

    it('should reject invalid UUID formats', () => {
      const invalidUUIDs = [
        '',
        undefined,
        null,
        'not-a-uuid',
        '123',
        'abc-def-ghi',
        '12345678-1234-1234-1234-1234567890123', // Too long
        '1234567-1234-1234-1234-123456789012', // Too short
      ];

      invalidUUIDs.forEach(uuid => {
        expect(isValidUUID(uuid as any)).toBe(false);
      });
    });
  });

  describe('Regression Tests', () => {
    it('should prevent "Validation failed (uuid is expected)" error', async () => {
      // This test ensures we validate before making API call
      const invalidIds = ['', undefined, null, 'invalid', '123'];

      for (const invalidId of invalidIds) {
        await expect(
          workOrdersApi.getWorkOrderById(invalidId as any)
        ).rejects.toThrow();
        
        // Should not make API call
        expect(global.fetch).not.toHaveBeenCalled();
      }
    });

    it('should handle URL params that might be undefined', () => {
      // Simulate useParams() returning undefined
      const idFromParams: string | undefined = undefined;
      const id = idFromParams || '';

      // Should validate before using
      expect(isValidUUID(id)).toBe(false);
      expect(id).toBe('');
    });
  });
});

