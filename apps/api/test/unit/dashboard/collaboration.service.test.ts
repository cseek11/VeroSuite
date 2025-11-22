/**
 * Collaboration Service Unit Tests
 * Tests for presence tracking, locking, and conflict detection
 */

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CollaborationService } from '../../../src/dashboard/collaboration.service';
import { SupabaseService } from '../../../src/common/services/supabase.service';

describe('CollaborationService', () => {
  let service: CollaborationService;
  let supabaseService: SupabaseService;

  const mockTenantId = 'tenant-123';
  const mockUserId = 'user-123';
  const mockSessionId = 'session-123';
  const mockRegionId = 'region-123';

  // Create a query builder that supports chaining - reuse same builder for same table
  const queryBuilders = new Map<string, any>();
  
  const createMockQueryBuilder = (table: string) => {
    if (!queryBuilders.has(table)) {
      const builder: any = {
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        upsert: jest.fn(), // upsert() returns a promise directly, not chainable - will be mocked per test
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        neq: jest.fn().mockReturnThis(),
        gt: jest.fn().mockReturnThis(), // gt() is chainable by default, can be overridden to return promise
        lt: jest.fn().mockReturnThis(), // lt() is chainable by default, can be overridden to return promise
        order: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        single: jest.fn(), // will be mocked per test
      };
      queryBuilders.set(table, builder);
    }
    return queryBuilders.get(table);
  };

  // Helper to get builder for test setup - ensures same instance is used
  const getBuilder = (table: string) => {
    if (!queryBuilders.has(table)) {
      createMockQueryBuilder(table);
    }
    return queryBuilders.get(table);
  };

  const mockSupabaseClient = {
    from: jest.fn((table: string) => {
      // Always return the same builder instance for the same table
      return getBuilder(table);
    }),
  };

  beforeEach(async () => {
    // Clear query builders before each test
    queryBuilders.clear();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollaborationService,
        {
          provide: SupabaseService,
          useValue: {
            getClient: jest.fn().mockReturnValue(mockSupabaseClient),
          },
        },
      ],
    }).compile();

    service = module.get<CollaborationService>(CollaborationService);
    supabaseService = module.get<SupabaseService>(SupabaseService);

    // Reset mocks - clear the from() mock call history
    mockSupabaseClient.from.mockClear();
    
    // Re-apply mockReturnThis() for chainable methods after builders are created
    // This ensures query chains work correctly
    queryBuilders.forEach((builder) => {
      builder.select.mockReturnThis();
      builder.insert.mockReturnThis();
      builder.update.mockReturnThis();
      builder.delete.mockReturnThis();
      builder.eq.mockReturnThis();
      builder.neq.mockReturnThis();
      builder.gt.mockReturnThis();
      builder.lt.mockReturnThis();
      builder.order.mockReturnThis();
      builder.limit.mockReturnThis();
    });
  });

  describe('updatePresence', () => {
    it('should update presence successfully', async () => {
      // Pre-create builder so we can set up mocks
      // This ensures the builder exists before the service calls from()
      const tempClient = supabaseService.getClient();
      const preCreatedBuilder = tempClient.from('dashboard_region_presence');
      const builder = getBuilder('dashboard_region_presence');
      
      // Verify we're using the same builder instance
      expect(preCreatedBuilder).toBe(builder);
      
      // updatePresence calls: .from().upsert() - upsert() is called directly and returns a promise
      builder.upsert.mockResolvedValueOnce({ data: null, error: null });

      await service.updatePresence(mockRegionId, mockUserId, mockSessionId, true, mockTenantId);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('dashboard_region_presence');
      expect(builder.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          region_id: mockRegionId,
          user_id: mockUserId,
          session_id: mockSessionId,
          is_editing: true,
          tenant_id: mockTenantId,
        }),
        expect.objectContaining({
          onConflict: 'region_id,user_id,session_id',
        })
      );
    });

    it('should handle errors gracefully', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_region_presence');
      const builder = getBuilder('dashboard_region_presence');
      builder.upsert.mockRejectedValueOnce(new Error('Database error'));

      // Should not throw
      await expect(
        service.updatePresence(mockRegionId, mockUserId, mockSessionId, true, mockTenantId)
      ).resolves.not.toThrow();
    });
  });

  describe('getPresence', () => {
    const mockPresence = [
      {
        region_id: mockRegionId,
        user_id: mockUserId,
        session_id: mockSessionId,
        is_editing: true,
        last_seen: new Date().toISOString(),
      },
    ];

    it('should return active presence', async () => {
      // Pre-create builder so we can set up mocks
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_region_presence');
      const builder = getBuilder('dashboard_region_presence');
      // getPresence calls cleanupStalePresence first, which does .delete().lt()
      // delete() returns builder, lt() returns promise
      builder.lt.mockImplementationOnce(() => Promise.resolve({ data: null, error: null })); // Cleanup lt
      // Then the main query: .select().eq().eq().gt().order() - order() returns promise
      builder.order.mockImplementationOnce(() => Promise.resolve({ data: mockPresence, error: null }));

      const result = await service.getPresence(mockRegionId, mockTenantId);

      expect(result).toEqual(mockPresence);
      expect(builder.eq).toHaveBeenCalledWith('region_id', mockRegionId);
      expect(builder.eq).toHaveBeenCalledWith('tenant_id', mockTenantId);
    });

    it('should filter stale presence', async () => {
      const staleTime = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_region_presence');
      const builder = getBuilder('dashboard_region_presence');
      builder.lt.mockImplementationOnce(() => Promise.resolve({ data: null, error: null })); // Cleanup lt
      builder.order.mockImplementationOnce(() => Promise.resolve({
        data: [{ ...mockPresence[0], last_seen: staleTime }],
        error: null,
      }));

      const result = await service.getPresence(mockRegionId, mockTenantId);

      expect(result).toBeDefined();
      expect(builder.gt).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_region_presence');
      const builder = getBuilder('dashboard_region_presence');
      builder.lt.mockImplementationOnce(() => Promise.resolve({ data: null, error: null })); // Cleanup lt
      builder.order.mockImplementationOnce(() => Promise.resolve({ data: null, error: { message: 'Database error' } }));

      await expect(service.getPresence(mockRegionId, mockTenantId)).rejects.toThrow(BadRequestException);
    });

    it('should return empty array on non-BadRequestException errors', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_region_presence');
      const builder = getBuilder('dashboard_region_presence');
      // Cleanup fails - lt() throws
      builder.lt.mockRejectedValueOnce(new Error('Unexpected error'));
      // If cleanup fails, the main query still runs
      builder.order.mockRejectedValueOnce(new Error('Unexpected error'));

      const result = await service.getPresence(mockRegionId, mockTenantId);

      expect(result).toEqual([]);
    });
  });

  describe('acquireLock', () => {
    it('should acquire lock when region is not locked', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_region_presence');
      const builder = getBuilder('dashboard_region_presence');
      // acquireLock chain: .select().eq().eq().eq().gt().neq().limit().single()
      // First call: check for existing lock
      builder.single.mockResolvedValueOnce({ data: null, error: { code: 'PGRST116' } }); // No existing lock
      // Second call: updatePresence (called by acquireLock)
      builder.upsert.mockResolvedValueOnce({ data: null, error: null });

      const result = await service.acquireLock(mockRegionId, mockUserId, mockTenantId, mockSessionId);

      expect(result.success).toBe(true);
      expect(result.lockedBy).toBeUndefined();
    });

    it('should fail to acquire lock when region is locked by another user', async () => {
      const existingLock = {
        user_id: 'other-user-123',
        last_seen: new Date().toISOString(),
      };

      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_region_presence');
      const builder = getBuilder('dashboard_region_presence');
      // The query chain is: .select().eq().eq().eq().gt().neq().limit().single()
      // Ensure all chainable methods return builder (re-applied in beforeEach)
      // single() is the final call and returns the promise
      // Mock must return data with user_id property
      builder.single.mockResolvedValueOnce({ data: existingLock, error: null });

      const result = await service.acquireLock(mockRegionId, mockUserId, mockTenantId, mockSessionId);

      expect(result.success).toBe(false);
      expect(result.lockedBy).toBe('other-user-123');
    });

    it('should handle errors gracefully', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_region_presence');
      const builder = getBuilder('dashboard_region_presence');
      builder.single.mockRejectedValueOnce(new Error('Database error'));

      const result = await service.acquireLock(mockRegionId, mockUserId, mockTenantId, mockSessionId);

      expect(result.success).toBe(false);
    });
  });

  describe('releaseLock', () => {
    it('should release lock successfully', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_region_presence');
      const builder = getBuilder('dashboard_region_presence');
      // releaseLock calls updatePresence, which calls .from().upsert()
      builder.upsert.mockResolvedValueOnce({ data: null, error: null });

      await service.releaseLock(mockRegionId, mockUserId, mockSessionId, mockTenantId);

      expect(builder.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          is_editing: false,
        }),
        expect.anything()
      );
    });

    it('should handle errors gracefully', async () => {
      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_region_presence');
      const builder = getBuilder('dashboard_region_presence');
      builder.upsert.mockRejectedValueOnce(new Error('Database error'));

      // Should not throw
      await expect(
        service.releaseLock(mockRegionId, mockUserId, mockSessionId, mockTenantId)
      ).resolves.not.toThrow();
    });
  });

  describe('detectConflicts', () => {
    it('should detect conflicts when regions are being edited', async () => {
      const changes = {
        regions: [{ id: mockRegionId }],
      };

      const conflictingPresence = [
        {
          user_id: 'other-user-123',
          is_editing: true,
          last_seen: new Date().toISOString(),
        },
      ];

      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_region_presence');
      const builder = getBuilder('dashboard_region_presence');
      // detectConflicts query chain: .select().eq().eq().eq().gt() - gt() is final call, returns promise
      builder.gt.mockImplementationOnce(() => Promise.resolve({ data: conflictingPresence, error: null }));

      const result = await service.detectConflicts('layout-123', changes, mockTenantId);

      expect(result).toHaveLength(1);
      expect(result[0].region_id).toBe(mockRegionId);
      expect(result[0].conflicting_users).toContain('other-user-123');
    });

    it('should return empty array when no conflicts', async () => {
      const changes = {
        regions: [{ id: mockRegionId }],
      };

      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_region_presence');
      const builder = getBuilder('dashboard_region_presence');
      builder.gt.mockImplementationOnce(() => Promise.resolve({ data: [], error: null }));

      const result = await service.detectConflicts('layout-123', changes, mockTenantId);

      expect(result).toEqual([]);
    });

    it('should handle errors gracefully', async () => {
      const changes = {
        regions: [{ id: mockRegionId }],
      };

      const tempClient = supabaseService.getClient();
      tempClient.from('dashboard_region_presence');
      const builder = getBuilder('dashboard_region_presence');
      builder.gt.mockRejectedValueOnce(new Error('Database error'));

      const result = await service.detectConflicts('layout-123', changes, mockTenantId);

      expect(result).toEqual([]);
    });

    it('should return empty array when no regions in changes', async () => {
      const changes = {};

      const result = await service.detectConflicts('layout-123', changes, mockTenantId);

      expect(result).toEqual([]);
    });
  });
});

