/**
 * Feature Flag Service Unit Tests
 * Tests for feature flag evaluation, rollout, and A/B testing
 */

import { Test, TestingModule } from '@nestjs/testing';
import { FeatureFlagService, FeatureFlagConfig, EvaluationContext } from '../../../../src/common/services/feature-flag.service';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../../../../src/common/services/supabase.service';

describe('FeatureFlagService', () => {
  let service: FeatureFlagService;
  let configService: ConfigService;
  let supabaseService: SupabaseService;
  let mockConfigService: any;
  let mockSupabaseService: any;
  let mockSupabaseClient: any;

  const mockContext: EvaluationContext = {
    userId: 'user-123',
    tenantId: 'tenant-123',
    userGroups: ['beta-testers'],
  };

  beforeEach(async () => {
    // Mock Supabase query builder
    const queryBuilders = new Map<string, any>();
    const createMockQueryBuilder = (table: string) => {
      if (!queryBuilders.has(table)) {
        const builder: any = {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn(),
        };
        queryBuilders.set(table, builder);
      }
      return queryBuilders.get(table);
    };

    mockSupabaseClient = {
      from: jest.fn((table: string) => createMockQueryBuilder(table)),
    };

    mockSupabaseService = {
      getClient: jest.fn().mockReturnValue(mockSupabaseClient),
    };

    mockConfigService = {
      get: jest.fn((key: string) => {
        // Return undefined for most keys (no env overrides)
        return undefined;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureFlagService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: SupabaseService,
          useValue: mockSupabaseService,
        },
      ],
    }).compile();

    service = module.get<FeatureFlagService>(FeatureFlagService);
    configService = module.get<ConfigService>(ConfigService);
    supabaseService = module.get<SupabaseService>(SupabaseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor and initialization', () => {
    it('should initialize with default flags', () => {
      // Assert
      expect(service).toBeDefined();
    });

    it('should load default flags from environment variables', async () => {
      // Arrange
      const configServiceWithFlags = {
        get: jest.fn((key: string) => {
          if (key === 'FEATURE_DASHBOARD_NEW_STATE_MANAGEMENT') return 'true';
          if (key === 'FEATURE_DASHBOARD_VIRTUALIZATION') return 'false';
          return undefined;
        }),
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [
          FeatureFlagService,
          {
            provide: ConfigService,
            useValue: configServiceWithFlags,
          },
          {
            provide: SupabaseService,
            useValue: mockSupabaseService,
          },
        ],
      }).compile();

      const serviceWithFlags = module.get<FeatureFlagService>(FeatureFlagService);

      // Act
      const result = serviceWithFlags.evaluateFlag('DASHBOARD_NEW_STATE_MANAGEMENT', mockContext);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('evaluateFlag', () => {
    it('should return false for non-existent flag', async () => {
      // Act
      const result = await service.evaluateFlag('NON_EXISTENT_FLAG', mockContext);

      // Assert
      expect(result).toBe(false);
    });

    it('should check environment variable override first', async () => {
      // Arrange
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'FEATURE_TEST_FLAG') return 'true';
        return undefined;
      });

      // Act
      const result = await service.evaluateFlag('TEST_FLAG', mockContext);

      // Assert
      expect(result).toBe(true);
      expect(mockConfigService.get).toHaveBeenCalledWith('FEATURE_TEST_FLAG');
    });

    it('should return false when env override is false', async () => {
      // Arrange
      mockConfigService.get.mockImplementation((key: string) => {
        if (key === 'FEATURE_TEST_FLAG') return 'false';
        return undefined;
      });

      // Act
      const result = await service.evaluateFlag('TEST_FLAG', mockContext);

      // Assert
      expect(result).toBe(false);
    });

    it('should check in-memory flags after env check', async () => {
      // Arrange
      const flagConfig: FeatureFlagConfig = {
        key: 'TEST_FLAG',
        enabled: true,
      };
      service.setFlag('TEST_FLAG', flagConfig);

      // Act
      const result = await service.evaluateFlag('TEST_FLAG', mockContext);

      // Assert
      expect(result).toBe(true);
    });

    it('should fall back to default flags', async () => {
      // Act
      const result = await service.evaluateFlag('DASHBOARD_NEW_STATE_MANAGEMENT', mockContext);

      // Assert
      expect(result).toBe(false); // Default is false
    });
  });

  describe('percentage-based rollout', () => {
    it('should enable flag for users within percentage', async () => {
      // Arrange
      const flagConfig: FeatureFlagConfig = {
        key: 'TEST_FLAG',
        enabled: true,
        rollout: {
          percentage: 50, // 50% rollout
        },
      };
      service.setFlag('TEST_FLAG', flagConfig);

      // Act - Test with multiple user IDs to find one in the 50%
      let enabledCount = 0;
      for (let i = 0; i < 100; i++) {
        const context = { ...mockContext, userId: `user-${i}` };
        const result = await service.evaluateFlag('TEST_FLAG', context);
        if (result) enabledCount++;
      }

      // Assert - Should be approximately 50% (allowing some variance)
      expect(enabledCount).toBeGreaterThan(30);
      expect(enabledCount).toBeLessThan(70);
    });

    it('should disable flag for users outside percentage', async () => {
      // Arrange
      const flagConfig: FeatureFlagConfig = {
        key: 'TEST_FLAG',
        enabled: true,
        rollout: {
          percentage: 0, // 0% rollout - should be disabled for all
        },
      };
      service.setFlag('TEST_FLAG', flagConfig);

      // Act
      const result = await service.evaluateFlag('TEST_FLAG', mockContext);

      // Assert
      expect(result).toBe(false);
    });

    it('should enable flag for 100% rollout', async () => {
      // Arrange
      const flagConfig: FeatureFlagConfig = {
        key: 'TEST_FLAG',
        enabled: true,
        rollout: {
          percentage: 100, // 100% rollout
        },
      };
      service.setFlag('TEST_FLAG', flagConfig);

      // Act
      const result = await service.evaluateFlag('TEST_FLAG', mockContext);

      // Assert
      expect(result).toBe(true);
    });

    it('should provide consistent results for same user', async () => {
      // Arrange
      const flagConfig: FeatureFlagConfig = {
        key: 'TEST_FLAG',
        enabled: true,
        rollout: {
          percentage: 50,
        },
      };
      service.setFlag('TEST_FLAG', flagConfig);
      const context = { ...mockContext, userId: 'consistent-user' };

      // Act
      const result1 = await service.evaluateFlag('TEST_FLAG', context);
      const result2 = await service.evaluateFlag('TEST_FLAG', context);
      const result3 = await service.evaluateFlag('TEST_FLAG', context);

      // Assert
      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });
  });

  describe('user group targeting', () => {
    it('should enable flag for users in matching group', async () => {
      // Arrange
      const flagConfig: FeatureFlagConfig = {
        key: 'TEST_FLAG',
        enabled: true,
        rollout: {
          userGroups: ['beta-testers'],
        },
      };
      service.setFlag('TEST_FLAG', flagConfig);

      // Act
      const result = await service.evaluateFlag('TEST_FLAG', mockContext);

      // Assert
      expect(result).toBe(true);
    });

    it('should disable flag for users not in matching group', async () => {
      // Arrange
      const flagConfig: FeatureFlagConfig = {
        key: 'TEST_FLAG',
        enabled: true,
        rollout: {
          userGroups: ['admin'],
        },
      };
      service.setFlag('TEST_FLAG', flagConfig);

      // Act
      const result = await service.evaluateFlag('TEST_FLAG', mockContext);

      // Assert
      expect(result).toBe(false);
    });

    it('should enable flag if user is in any matching group', async () => {
      // Arrange
      const flagConfig: FeatureFlagConfig = {
        key: 'TEST_FLAG',
        enabled: true,
        rollout: {
          userGroups: ['admin', 'beta-testers', 'premium'],
        },
      };
      service.setFlag('TEST_FLAG', flagConfig);

      // Act
      const result = await service.evaluateFlag('TEST_FLAG', mockContext);

      // Assert
      expect(result).toBe(true);
    });

    it('should handle users with no groups', async () => {
      // Arrange
      const flagConfig: FeatureFlagConfig = {
        key: 'TEST_FLAG',
        enabled: true,
        rollout: {
          userGroups: ['beta-testers'],
        },
      };
      service.setFlag('TEST_FLAG', flagConfig);
      const contextWithoutGroups = {
        ...mockContext,
        userGroups: undefined,
      };

      // Act
      const result = await service.evaluateFlag('TEST_FLAG', contextWithoutGroups);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('tenant targeting', () => {
    it('should enable flag for matching tenant', async () => {
      // Arrange
      const flagConfig: FeatureFlagConfig = {
        key: 'TEST_FLAG',
        enabled: true,
        rollout: {
          tenants: ['tenant-123'],
        },
      };
      service.setFlag('TEST_FLAG', flagConfig);

      // Act
      const result = await service.evaluateFlag('TEST_FLAG', mockContext);

      // Assert
      expect(result).toBe(true);
    });

    it('should disable flag for non-matching tenant', async () => {
      // Arrange
      const flagConfig: FeatureFlagConfig = {
        key: 'TEST_FLAG',
        enabled: true,
        rollout: {
          tenants: ['tenant-456'],
        },
      };
      service.setFlag('TEST_FLAG', flagConfig);

      // Act
      const result = await service.evaluateFlag('TEST_FLAG', mockContext);

      // Assert
      expect(result).toBe(false);
    });

    it('should enable flag if tenant is in list', async () => {
      // Arrange
      const flagConfig: FeatureFlagConfig = {
        key: 'TEST_FLAG',
        enabled: true,
        rollout: {
          tenants: ['tenant-123', 'tenant-456', 'tenant-789'],
        },
      };
      service.setFlag('TEST_FLAG', flagConfig);

      // Act
      const result = await service.evaluateFlag('TEST_FLAG', mockContext);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('combined rollout strategies', () => {
    it('should enable flag when user group matches even if percentage is low', async () => {
      // Arrange
      const flagConfig: FeatureFlagConfig = {
        key: 'TEST_FLAG',
        enabled: true,
        rollout: {
          percentage: 10, // Low percentage
          userGroups: ['beta-testers'],
        },
      };
      service.setFlag('TEST_FLAG', flagConfig);

      // Act
      const result = await service.evaluateFlag('TEST_FLAG', mockContext);

      // Assert
      expect(result).toBe(true); // User group takes precedence
    });

    it('should enable flag when tenant matches even if percentage is low', async () => {
      // Arrange
      const flagConfig: FeatureFlagConfig = {
        key: 'TEST_FLAG',
        enabled: true,
        rollout: {
          percentage: 10, // Low percentage
          tenants: ['tenant-123'],
        },
      };
      service.setFlag('TEST_FLAG', flagConfig);

      // Act
      const result = await service.evaluateFlag('TEST_FLAG', mockContext);

      // Assert
      expect(result).toBe(true); // Tenant targeting takes precedence
    });
  });

  describe('disabled flags', () => {
    it('should return false for disabled flag regardless of rollout', async () => {
      // Arrange
      const flagConfig: FeatureFlagConfig = {
        key: 'TEST_FLAG',
        enabled: false,
        rollout: {
          percentage: 100,
          userGroups: ['beta-testers'],
          tenants: ['tenant-123'],
        },
      };
      service.setFlag('TEST_FLAG', flagConfig);

      // Act
      const result = await service.evaluateFlag('TEST_FLAG', mockContext);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('database flags', () => {
    it('should query database for flags when available', async () => {
      // Arrange
      const flagBuilder = mockSupabaseClient.from('feature_flags');
      flagBuilder.single.mockResolvedValue({
        data: {
          key: 'DB_FLAG',
          enabled: true,
          rollout: null,
          variants: null,
        },
        error: null,
      });

      // Act
      const result = await service.evaluateFlag('DB_FLAG', mockContext);

      // Assert
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('feature_flags');
      expect(flagBuilder.eq).toHaveBeenCalledWith('key', 'DB_FLAG');
      expect(flagBuilder.eq).toHaveBeenCalledWith('enabled', true);
      expect(result).toBe(true);
    });

    it('should fall back to defaults when database query fails', async () => {
      // Arrange
      const flagBuilder = mockSupabaseClient.from('feature_flags');
      flagBuilder.single.mockResolvedValue({
        data: null,
        error: { message: 'Table not found' },
      });

      // Act
      const result = await service.evaluateFlag('DB_FLAG', mockContext);

      // Assert
      expect(result).toBe(false); // Falls back to default
    });

    it('should handle database errors gracefully', async () => {
      // Arrange
      const flagBuilder = mockSupabaseClient.from('feature_flags');
      flagBuilder.single.mockRejectedValue(new Error('Database error'));

      // Act
      const result = await service.evaluateFlag('DB_FLAG', mockContext);

      // Assert
      expect(result).toBe(false); // Falls back to default
    });
  });

  describe('setFlag', () => {
    it('should set flag programmatically', async () => {
      // Arrange
      const flagConfig: FeatureFlagConfig = {
        key: 'PROGRAMMATIC_FLAG',
        enabled: true,
      };

      // Act
      service.setFlag('PROGRAMMATIC_FLAG', flagConfig);
      const result = await service.evaluateFlag('PROGRAMMATIC_FLAG', mockContext);

      // Assert
      expect(result).toBe(true);
    });

    it('should overwrite existing flag', async () => {
      // Arrange
      const flagConfig1: FeatureFlagConfig = {
        key: 'UPDATE_FLAG',
        enabled: false,
      };
      const flagConfig2: FeatureFlagConfig = {
        key: 'UPDATE_FLAG',
        enabled: true,
      };

      // Act
      service.setFlag('UPDATE_FLAG', flagConfig1);
      const result1 = await service.evaluateFlag('UPDATE_FLAG', mockContext);
      service.setFlag('UPDATE_FLAG', flagConfig2);
      const result2 = await service.evaluateFlag('UPDATE_FLAG', mockContext);

      // Assert
      expect(result1).toBe(false);
      expect(result2).toBe(true);
    });
  });

  describe('getAllFlags', () => {
    it('should return all flags for context', async () => {
      // Arrange
      service.setFlag('CUSTOM_FLAG', {
        key: 'CUSTOM_FLAG',
        enabled: true,
      });

      // Act
      const result = await service.getAllFlags(mockContext);

      // Assert
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
      // Should include default flags
      expect(result).toHaveProperty('DASHBOARD_NEW_STATE_MANAGEMENT');
      expect(result).toHaveProperty('CUSTOM_FLAG');
    });

    it('should evaluate each flag with context', async () => {
      // Arrange
      const flagConfig: FeatureFlagConfig = {
        key: 'CONTEXT_FLAG',
        enabled: true,
        rollout: {
          tenants: ['tenant-123'],
        },
      };
      service.setFlag('CONTEXT_FLAG', flagConfig);

      // Act
      const result = await service.getAllFlags(mockContext);

      // Assert
      expect(result.CONTEXT_FLAG).toBe(true);
    });

    it('should not duplicate flags', async () => {
      // Arrange
      service.setFlag('DASHBOARD_NEW_STATE_MANAGEMENT', {
        key: 'DASHBOARD_NEW_STATE_MANAGEMENT',
        enabled: true,
      });

      // Act
      const result = await service.getAllFlags(mockContext);

      // Assert
      // Should only have one entry per flag
      const keys = Object.keys(result);
      const uniqueKeys = new Set(keys);
      expect(keys.length).toBe(uniqueKeys.size);
    });
  });
});

