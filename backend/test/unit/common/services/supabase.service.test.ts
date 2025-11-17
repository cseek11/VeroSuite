/**
 * Supabase Service Unit Tests
 * Tests for Supabase client initialization and retrieval
 */

import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseService } from '../../../../src/common/services/supabase.service';

// Mock @supabase/supabase-js
const mockSupabaseClient = {
  from: jest.fn(),
  auth: {},
  storage: {},
};

const mockCreateClient = jest.fn().mockReturnValue(mockSupabaseClient);

jest.mock('@supabase/supabase-js', () => ({
  createClient: (...args: any[]) => mockCreateClient(...args),
}));

describe('SupabaseService', () => {
  let service: SupabaseService;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment variables
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SECRET_KEY;
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SECRET_KEY;
  });

  describe('constructor', () => {
    it('should initialize Supabase client with environment variables', () => {
      // Arrange
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_SECRET_KEY = 'sb_secret_test_key';
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      service = new SupabaseService();

      // Assert
      expect(mockCreateClient).toHaveBeenCalledWith(
        'https://test.supabase.co',
        'sb_secret_test_key'
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'SupabaseService - Initializing with URL:',
        'https://test.supabase.co'
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'SupabaseService - Using secret key type:',
        'New Secret Key'
      );
      consoleLogSpy.mockRestore();
    });

    it('should detect new secret key format (sb_secret_)', () => {
      // Arrange
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_SECRET_KEY = 'sb_secret_test_key';
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      service = new SupabaseService();

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'SupabaseService - Using secret key type:',
        'New Secret Key'
      );
      consoleLogSpy.mockRestore();
    });

    it('should detect legacy key format', () => {
      // Arrange
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_SECRET_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';
      const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      service = new SupabaseService();

      // Assert
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'SupabaseService - Using secret key type:',
        'Legacy Key'
      );
      consoleLogSpy.mockRestore();
    });

    it('should throw error when SUPABASE_URL is missing', () => {
      // Arrange
      process.env.SUPABASE_URL = '';
      process.env.SUPABASE_SECRET_KEY = 'test-key';

      // Act & Assert
      expect(() => new SupabaseService()).toThrow(
        'Missing required environment variables: SUPABASE_URL and SUPABASE_SECRET_KEY'
      );
    });

    it('should throw error when SUPABASE_SECRET_KEY is missing', () => {
      // Arrange
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_SECRET_KEY = '';

      // Act & Assert
      expect(() => new SupabaseService()).toThrow(
        'Missing required environment variables: SUPABASE_URL and SUPABASE_SECRET_KEY'
      );
    });

    it('should throw error when both environment variables are missing', () => {
      // Arrange
      delete process.env.SUPABASE_URL;
      delete process.env.SUPABASE_SECRET_KEY;

      // Act & Assert
      expect(() => new SupabaseService()).toThrow(
        'Missing required environment variables: SUPABASE_URL and SUPABASE_SECRET_KEY'
      );
    });

    it('should use default empty string when env vars are undefined', () => {
      // Arrange
      delete process.env.SUPABASE_URL;
      delete process.env.SUPABASE_SECRET_KEY;

      // Act & Assert
      expect(() => new SupabaseService()).toThrow(
        'Missing required environment variables: SUPABASE_URL and SUPABASE_SECRET_KEY'
      );
    });
  });

  describe('getClient', () => {
    it('should return the Supabase client instance', () => {
      // Arrange
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_SECRET_KEY = 'test-key';
      mockCreateClient.mockReturnValue(mockSupabaseClient);
      service = new SupabaseService();

      // Act
      const client = service.getClient();

      // Assert
      expect(client).toBe(mockSupabaseClient);
      expect(mockCreateClient).toHaveBeenCalledTimes(1);
    });

    it('should return the same client instance on multiple calls', () => {
      // Arrange
      process.env.SUPABASE_URL = 'https://test.supabase.co';
      process.env.SUPABASE_SECRET_KEY = 'test-key';
      mockCreateClient.mockReturnValue(mockSupabaseClient);
      service = new SupabaseService();

      // Act
      const client1 = service.getClient();
      const client2 = service.getClient();

      // Assert
      expect(client1).toBe(client2);
      expect(client1).toBe(mockSupabaseClient);
    });
  });
});

