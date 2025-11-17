/**
 * Audit Service Unit Tests
 * Tests for audit log retrieval (placeholder implementation)
 */

import { Test, TestingModule } from '@nestjs/testing';
import { AuditService } from '../../../src/audit/audit.service';

describe('AuditService', () => {
  let service: AuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditService],
    }).compile();

    service = module.get<AuditService>(AuditService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getLogs', () => {
    it('should return demo audit logs', async () => {
      // Act
      const result = await service.getLogs();

      // Assert
      expect(result).toEqual([{ id: 'demo-log', action: 'login' }]);
    });

    it('should return an array', async () => {
      // Act
      const result = await service.getLogs();

      // Assert
      expect(Array.isArray(result)).toBe(true);
    });
  });
});

