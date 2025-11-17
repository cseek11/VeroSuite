/**
 * Session Service Unit Tests
 * Tests for session creation, validation, and cleanup
 */

import { Test, TestingModule } from '@nestjs/testing';
import { SessionService, ActiveSession } from '../../../src/auth/session.service';
import { DatabaseService } from '../../../src/common/services/database.service';
import { createClient } from '@supabase/supabase-js';

describe('SessionService', () => {
  let service: SessionService;
  let databaseService: DatabaseService;
  let mockSupabaseClient: any;

  const mockTenantId = 'tenant-123';
  const mockUserId = 'user-123';

  const mockAuditLogs = [
    {
      id: 'log-1',
      timestamp: new Date('2025-01-15T10:00:00Z'),
      ip_address: '192.168.1.1',
      user_agent: 'Mozilla/5.0',
    },
    {
      id: 'log-2',
      timestamp: new Date('2025-01-14T09:00:00Z'),
      ip_address: '192.168.1.2',
      user_agent: 'Chrome/120.0',
    },
  ];

  beforeEach(async () => {
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SECRET_KEY = 'test-secret-key';

    mockSupabaseClient = {
      auth: {
        admin: {
          signOut: jest.fn(),
        },
      },
    };

    const createClientMock = require('@supabase/supabase-js').createClient;
    createClientMock.mockReturnValue(mockSupabaseClient);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionService,
        {
          provide: DatabaseService,
          useValue: {
            auditLog: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<SessionService>(SessionService);
    databaseService = module.get<DatabaseService>(DatabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getActiveSessions', () => {
    it('should return active sessions from audit logs', async () => {
      jest.spyOn(databaseService.auditLog, 'findMany').mockResolvedValue(mockAuditLogs as any);

      const result = await service.getActiveSessions(mockTenantId, mockUserId);

      expect(result).toHaveLength(2);
      expect(result[0]).toMatchObject({
        id: 'log-1',
        user_id: mockUserId,
        token_id: 'log-1',
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0',
      });
      expect(result[0].created_at).toBeDefined();
      expect(result[0].last_activity).toBeDefined();
      expect(result[0].expires_at).toBeDefined();
    });

    it('should return empty array when no sessions found', async () => {
      jest.spyOn(databaseService.auditLog, 'findMany').mockResolvedValue([]);

      const result = await service.getActiveSessions(mockTenantId, mockUserId);

      expect(result).toEqual([]);
    });

    it('should return empty array when Supabase client is not initialized', async () => {
      // Create service without Supabase env vars
      delete process.env.SUPABASE_URL;
      delete process.env.SUPABASE_SECRET_KEY;

      const moduleWithoutSupabase: TestingModule = await Test.createTestingModule({
        providers: [
          SessionService,
          {
            provide: DatabaseService,
            useValue: {
              auditLog: {
                findMany: jest.fn(),
              },
            },
          },
        ],
      }).compile();

      const serviceWithoutSupabase = moduleWithoutSupabase.get<SessionService>(SessionService);

      const result = await serviceWithoutSupabase.getActiveSessions(mockTenantId, mockUserId);

      expect(result).toEqual([]);
    });

    it('should handle sessions without ip_address', async () => {
      const logsWithoutIp = [
        {
          id: 'log-1',
          timestamp: new Date('2025-01-15T10:00:00Z'),
          ip_address: null,
          user_agent: 'Mozilla/5.0',
        },
      ];

      jest.spyOn(databaseService.auditLog, 'findMany').mockResolvedValue(logsWithoutIp as any);

      const result = await service.getActiveSessions(mockTenantId, mockUserId);

      expect(result).toHaveLength(1);
      expect(result[0].ip_address).toBeUndefined();
    });

    it('should handle sessions without user_agent', async () => {
      const logsWithoutUserAgent = [
        {
          id: 'log-1',
          timestamp: new Date('2025-01-15T10:00:00Z'),
          ip_address: '192.168.1.1',
          user_agent: null,
        },
      ];

      jest.spyOn(databaseService.auditLog, 'findMany').mockResolvedValue(logsWithoutUserAgent as any);

      const result = await service.getActiveSessions(mockTenantId, mockUserId);

      expect(result).toHaveLength(1);
      expect(result[0].user_agent).toBeUndefined();
    });

    it('should handle database errors gracefully', async () => {
      jest.spyOn(databaseService.auditLog, 'findMany').mockRejectedValue(new Error('Database error'));

      const result = await service.getActiveSessions(mockTenantId, mockUserId);

      expect(result).toEqual([]);
    });
  });

  describe('revokeSession', () => {
    it('should revoke session successfully', async () => {
      mockSupabaseClient.auth.admin.signOut.mockResolvedValue({ error: null });

      const result = await service.revokeSession(mockTenantId, mockUserId, 'session-123');

      expect(result).toEqual({
        success: true,
        message: 'Session revoked successfully',
      });
      expect(mockSupabaseClient.auth.admin.signOut).toHaveBeenCalledWith('session-123', 'global');
    });

    it('should throw error when Supabase client is not initialized', async () => {
      delete process.env.SUPABASE_URL;
      delete process.env.SUPABASE_SECRET_KEY;

      const moduleWithoutSupabase: TestingModule = await Test.createTestingModule({
        providers: [
          SessionService,
          {
            provide: DatabaseService,
            useValue: {
              auditLog: {
                findMany: jest.fn(),
              },
            },
          },
        ],
      }).compile();

      const serviceWithoutSupabase = moduleWithoutSupabase.get<SessionService>(SessionService);

      await expect(
        serviceWithoutSupabase.revokeSession(mockTenantId, mockUserId, 'session-123')
      ).rejects.toThrow('Supabase client not initialized');
    });

    it('should throw error when Supabase signOut fails', async () => {
      mockSupabaseClient.auth.admin.signOut.mockResolvedValue({
        error: { message: 'Session not found' },
      });

      await expect(
        service.revokeSession(mockTenantId, mockUserId, 'session-123')
      ).rejects.toThrow('Failed to revoke session: Session not found');
    });
  });

  describe('revokeAllSessions', () => {
    it('should revoke all sessions successfully', async () => {
      jest.spyOn(service, 'getActiveSessions').mockResolvedValue([
        { id: 'session-1' } as ActiveSession,
        { id: 'session-2' } as ActiveSession,
      ]);
      jest.spyOn(service, 'revokeSession').mockResolvedValue({
        success: true,
        message: 'Session revoked successfully',
      });

      const result = await service.revokeAllSessions(mockTenantId, mockUserId);

      expect(result.success).toBe(true);
      expect(result.revoked).toBe(2);
      expect(result.failed).toBe(0);
    });

    it('should handle partial failures', async () => {
      jest.spyOn(service, 'getActiveSessions').mockResolvedValue([
        { id: 'session-1' } as ActiveSession,
        { id: 'session-2' } as ActiveSession,
      ]);
      jest.spyOn(service, 'revokeSession')
        .mockResolvedValueOnce({ success: true, message: 'Success' })
        .mockRejectedValueOnce(new Error('Failed'));

      const result = await service.revokeAllSessions(mockTenantId, mockUserId);

      expect(result.success).toBe(false);
      expect(result.revoked).toBe(1);
      expect(result.failed).toBe(1);
    });

    it('should handle empty sessions list', async () => {
      jest.spyOn(service, 'getActiveSessions').mockResolvedValue([]);

      const result = await service.revokeAllSessions(mockTenantId, mockUserId);

      expect(result.success).toBe(true);
      expect(result.revoked).toBe(0);
      expect(result.failed).toBe(0);
    });
  });

  describe('getSessionHistory', () => {
    it('should return session history from audit logs', async () => {
      const historyLogs = [
        {
          id: 'log-1',
          action: 'login',
          timestamp: new Date('2025-01-15T10:00:00Z'),
          ip_address: '192.168.1.1',
          user_agent: 'Mozilla/5.0',
        },
        {
          id: 'log-2',
          action: 'logout',
          timestamp: new Date('2025-01-15T11:00:00Z'),
          ip_address: '192.168.1.1',
          user_agent: 'Mozilla/5.0',
        },
      ];

      jest.spyOn(databaseService.auditLog, 'findMany').mockResolvedValue(historyLogs as any);

      const result = await service.getSessionHistory(mockTenantId, mockUserId);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: 'log-1',
        action: 'login',
        timestamp: '2025-01-15T10:00:00.000Z',
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0',
      });
      expect(databaseService.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            tenant_id: mockTenantId,
            user_id: mockUserId,
            action: {
              in: ['login', 'logout', 'session_revoked'],
            },
          },
          take: 50,
        })
      );
    });

    it('should respect limit parameter', async () => {
      jest.spyOn(databaseService.auditLog, 'findMany').mockResolvedValue([]);

      await service.getSessionHistory(mockTenantId, mockUserId, 20);

      expect(databaseService.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 20,
        })
      );
    });

    it('should handle database errors', async () => {
      jest.spyOn(databaseService.auditLog, 'findMany').mockRejectedValue(new Error('Database error'));

      await expect(
        service.getSessionHistory(mockTenantId, mockUserId)
      ).rejects.toThrow('Database error');
    });
  });
});
