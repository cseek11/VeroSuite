import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  validateEnvironmentVariables,
  logEnvironmentStatus,
  RequiredEnvVars,
  OptionalEnvVars,
} from '../../src/common/utils/env-validation';

describe('Environment Variable Validation', () => {
  let configService: ConfigService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env.test'],
        }),
      ],
    }).compile();

    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(async () => {
    await module.close();
  });

  describe('validateEnvironmentVariables', () => {
    it('should validate all required environment variables', () => {
      // Set all required variables
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_SECRET_KEY = 'sb_secret_test_key';
      process.env.JWT_SECRET = 'test-jwt-secret-minimum-32-characters-long';
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';

      const traceId = 'test-trace-id';
      const result = validateEnvironmentVariables(configService, traceId);

      expect(result).toBeDefined();
      expect(result.SUPABASE_URL).toBe('https://test.supabase.co');
      expect(result.SUPABASE_SECRET_KEY).toBe('sb_secret_test_key');
      expect(result.JWT_SECRET).toBe('test-jwt-secret-minimum-32-characters-long');
      expect(result.DATABASE_URL).toBe('postgresql://user:pass@localhost:5432/db');
    });

    it('should throw error when SUPABASE_URL is missing', () => {
      delete process.env.SUPABASE_URL;
      process.env.SUPABASE_SECRET_KEY = 'sb_secret_test';
      process.env.JWT_SECRET = 'test-jwt-secret-minimum-32-characters-long';
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';

      const traceId = 'test-trace-id';
      expect(() => validateEnvironmentVariables(configService, traceId)).toThrow(
        'Missing required environment variables: SUPABASE_URL',
      );
    });

    it('should throw error when JWT_SECRET is missing', () => {
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_SECRET_KEY = 'sb_secret_test';
      delete process.env.JWT_SECRET;
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';

      const traceId = 'test-trace-id';
      expect(() => validateEnvironmentVariables(configService, traceId)).toThrow(
        'Missing required environment variables: JWT_SECRET',
      );
    });

    it('should throw error with traceId in message', () => {
      delete process.env.SUPABASE_URL;
      process.env.SUPABASE_SECRET_KEY = 'sb_secret_test';
      process.env.JWT_SECRET = 'test-jwt-secret-minimum-32-characters-long';
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';

      const traceId = 'test-trace-id-12345';
      try {
        validateEnvironmentVariables(configService, traceId);
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        const errorMessage = (error as Error).message;
        expect(errorMessage).toContain('[traceId: test-trace-id-12345]');
      }
    });

    it('should validate key formats', () => {
      // Invalid Supabase URL
      process.env.SUPABASE_URL = 'http://invalid-url.com';
      process.env.SUPABASE_SECRET_KEY = 'sb_secret_test';
      process.env.JWT_SECRET = 'test-jwt-secret-minimum-32-characters-long';
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';

      const traceId = 'test-trace-id';
      expect(() => validateEnvironmentVariables(configService, traceId)).toThrow(
        'SUPABASE_URL must be a valid Supabase URL',
      );
    });

    it('should validate JWT_SECRET length', () => {
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_SECRET_KEY = 'sb_secret_test';
      process.env.JWT_SECRET = 'short'; // Too short
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db';

      const traceId = 'test-trace-id';
      expect(() => validateEnvironmentVariables(configService, traceId)).toThrow(
        'JWT_SECRET must be at least 32 characters long',
      );
    });
  });

  describe('logEnvironmentStatus', () => {
    it('should log environment status with structured format', () => {
      const requiredVars: RequiredEnvVars = {
        SUPABASE_URL: 'https://test.supabase.co',
        SUPABASE_SECRET_KEY: 'sb_secret_test_key_12345',
        JWT_SECRET: 'test-jwt-secret-minimum-32-characters-long',
        DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
      };

      const optionalVars: OptionalEnvVars = {
        STRIPE_SECRET_KEY: 'sk_test_12345',
        REDIS_URL: 'redis://localhost:6379',
      };

      const traceId = 'test-trace-id';
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      logEnvironmentStatus(requiredVars, optionalVars, traceId);

      expect(consoleSpy).toHaveBeenCalled();
      const logCall = consoleSpy.mock.calls[0];
      expect(logCall[0]).toBe('Environment Variables Status');
      expect(logCall[1]).toHaveProperty('traceId', traceId);
      expect(logCall[1]).toHaveProperty('spanId', 'env-status');
      expect(logCall[1]).toHaveProperty('operation', 'environment_validation');

      consoleSpy.mockRestore();
    });

    it('should mask sensitive values in logs', () => {
      const requiredVars: RequiredEnvVars = {
        SUPABASE_URL: 'https://test.supabase.co',
        SUPABASE_SECRET_KEY: 'sb_secret_very_long_secret_key_1234567890',
        JWT_SECRET: 'very-long-jwt-secret-key-minimum-32-characters',
        DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
      };

      const optionalVars: OptionalEnvVars = {};
      const traceId = 'test-trace-id';
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      logEnvironmentStatus(requiredVars, optionalVars, traceId);

      const logCall = consoleSpy.mock.calls[0];
      const logData = logCall[1];
      
      // Check that secrets are masked
      expect(logData.required.SUPABASE_SECRET_KEY).toMatch(/sb_s\*\*\*\d+/);
      expect(logData.required.JWT_SECRET).toMatch(/.{4}\*\*\*.{4}/);
      expect(logData.required.DATABASE_URL).toContain('***:***@');

      consoleSpy.mockRestore();
    });
  });
});




