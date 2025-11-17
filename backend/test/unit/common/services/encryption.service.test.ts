/**
 * Encryption Service Unit Tests
 * Tests for AES-256-GCM encryption and decryption
 */

import { Test, TestingModule } from '@nestjs/testing';
import { EncryptionService } from '../../../../src/common/services/encryption.service';
import { ConfigService } from '@nestjs/config';

describe('EncryptionService', () => {
  let service: EncryptionService;
  let configService: ConfigService;
  let mockConfigService: any;

  // Generate a valid 32-byte key (64 hex characters)
  const validHexKey = 'a'.repeat(64); // 32 bytes in hex
  const validBase64Key = Buffer.alloc(32, 'a').toString('base64');

  beforeEach(async () => {
    mockConfigService = {
      get: jest.fn((key: string) => {
        if (key === 'ENCRYPTION_KEY') return validHexKey;
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EncryptionService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<EncryptionService>(EncryptionService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should throw error when ENCRYPTION_KEY is not provided', () => {
      // Arrange
      const configServiceWithoutKey = {
        get: jest.fn((key: string) => {
          if (key === 'ENCRYPTION_KEY') return null;
          return null;
        }),
      };

      // Act & Assert
      expect(() => {
        new EncryptionService(configServiceWithoutKey as any);
      }).toThrow('ENCRYPTION_KEY environment variable is required');
    });

    it('should accept hex-encoded key', () => {
      // Arrange
      const configServiceWithHexKey = {
        get: jest.fn((key: string) => {
          if (key === 'ENCRYPTION_KEY') return validHexKey;
          return null;
        }),
      };

      // Act & Assert - should not throw
      expect(() => {
        new EncryptionService(configServiceWithHexKey as any);
      }).not.toThrow();
    });

    it('should accept base64-encoded key', () => {
      // Arrange
      const configServiceWithBase64Key = {
        get: jest.fn((key: string) => {
          if (key === 'ENCRYPTION_KEY') return validBase64Key;
          return null;
        }),
      };

      // Act & Assert - should not throw
      expect(() => {
        new EncryptionService(configServiceWithBase64Key as any);
      }).not.toThrow();
    });

    it('should throw error when key length is invalid', () => {
      // Arrange
      const invalidKey = 'short'; // Too short
      const configServiceWithInvalidKey = {
        get: jest.fn((key: string) => {
          if (key === 'ENCRYPTION_KEY') return invalidKey;
          return null;
        }),
      };

      // Act & Assert
      expect(() => {
        new EncryptionService(configServiceWithInvalidKey as any);
      }).toThrow('ENCRYPTION_KEY must be 32 bytes');
    });

    it('should handle UTF-8 key and pad/truncate to correct length', () => {
      // Arrange
      const utf8Key = 'a'.repeat(32); // 32 characters
      const configServiceWithUtf8Key = {
        get: jest.fn((key: string) => {
          if (key === 'ENCRYPTION_KEY') return utf8Key;
          return null;
        }),
      };

      // Act & Assert - should not throw
      expect(() => {
        new EncryptionService(configServiceWithUtf8Key as any);
      }).not.toThrow();
    });
  });

  describe('encrypt', () => {
    it('should encrypt plaintext string', () => {
      // Arrange
      const plaintext = 'sensitive data';

      // Act
      const encrypted = service.encrypt(plaintext);

      // Assert
      expect(encrypted).toBeDefined();
      expect(encrypted).not.toBe(plaintext);
      expect(encrypted).toContain(':');
      const parts = encrypted.split(':');
      expect(parts.length).toBe(3); // iv:tag:encryptedData
    });

    it('should return empty string when plaintext is empty', () => {
      // Arrange
      const plaintext = '';

      // Act
      const encrypted = service.encrypt(plaintext);

      // Assert
      expect(encrypted).toBe('');
    });

    it('should return null/undefined when plaintext is null/undefined', () => {
      // Act & Assert
      expect(service.encrypt(null as any)).toBeNull();
      expect(service.encrypt(undefined as any)).toBeUndefined();
    });

    it('should produce different ciphertext for same plaintext (due to random IV)', () => {
      // Arrange
      const plaintext = 'same data';

      // Act
      const encrypted1 = service.encrypt(plaintext);
      const encrypted2 = service.encrypt(plaintext);

      // Assert
      expect(encrypted1).not.toBe(encrypted2);
    });

    it('should handle special characters', () => {
      // Arrange
      const plaintext = 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';

      // Act
      const encrypted = service.encrypt(plaintext);

      // Assert
      expect(encrypted).toBeDefined();
      expect(encrypted).toContain(':');
    });

    it('should handle unicode characters', () => {
      // Arrange
      const plaintext = 'Unicode: 你好世界 🌍';

      // Act
      const encrypted = service.encrypt(plaintext);

      // Assert
      expect(encrypted).toBeDefined();
      expect(encrypted).toContain(':');
    });

    it('should handle long strings', () => {
      // Arrange
      const plaintext = 'a'.repeat(10000);

      // Act
      const encrypted = service.encrypt(plaintext);

      // Assert
      expect(encrypted).toBeDefined();
      expect(encrypted).toContain(':');
    });

    it('should throw error on encryption failure', () => {
      // Arrange
      const plaintext = 'test data';
      // Mock crypto to throw error
      const originalCreateCipheriv = require('crypto').createCipheriv;
      jest.spyOn(require('crypto'), 'createCipheriv').mockImplementationOnce(() => {
        throw new Error('Crypto error');
      });
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act & Assert
      expect(() => service.encrypt(plaintext)).toThrow('Failed to encrypt data');
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('decrypt', () => {
    it('should decrypt encrypted string back to original', () => {
      // Arrange
      const plaintext = 'sensitive data';
      const encrypted = service.encrypt(plaintext);

      // Act
      const decrypted = service.decrypt(encrypted);

      // Assert
      expect(decrypted).toBe(plaintext);
    });

    it('should return empty string when ciphertext is empty', () => {
      // Arrange
      const ciphertext = '';

      // Act
      const decrypted = service.decrypt(ciphertext);

      // Assert
      expect(decrypted).toBe('');
    });

    it('should return null/undefined when ciphertext is null/undefined', () => {
      // Act & Assert
      expect(service.decrypt(null as any)).toBeNull();
      expect(service.decrypt(undefined as any)).toBeUndefined();
    });

    it('should throw error for invalid format (missing parts)', () => {
      // Arrange
      const invalidCiphertext = 'invalid:format';

      // Act & Assert
      expect(() => service.decrypt(invalidCiphertext)).toThrow('Invalid encrypted data format');
    });

    it('should throw error for invalid format (empty parts)', () => {
      // Arrange
      const invalidCiphertext = '::';

      // Act & Assert
      expect(() => service.decrypt(invalidCiphertext)).toThrow('Invalid encrypted data format: missing components');
    });

    it('should throw error for tampered ciphertext', () => {
      // Arrange
      const plaintext = 'sensitive data';
      const encrypted = service.encrypt(plaintext);
      const parts = encrypted.split(':');
      const tampered = `${parts[0]}:${parts[1]}:tampered${parts[2]}`;

      // Act & Assert
      expect(() => service.decrypt(tampered)).toThrow('Failed to decrypt data');
    });

    it('should throw error for invalid base64 in ciphertext', () => {
      // Arrange
      const invalidCiphertext = 'invalid:base64:data!@#';

      // Act & Assert
      expect(() => service.decrypt(invalidCiphertext)).toThrow('Failed to decrypt data');
    });

    it('should handle decryption errors gracefully', () => {
      // Arrange
      const plaintext = 'test data';
      const encrypted = service.encrypt(plaintext);
      // Mock crypto to throw error
      const originalCreateDecipheriv = require('crypto').createDecipheriv;
      jest.spyOn(require('crypto'), 'createDecipheriv').mockImplementationOnce(() => {
        throw new Error('Crypto error');
      });
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // Act & Assert
      expect(() => service.decrypt(encrypted)).toThrow('Failed to decrypt data');
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('encryptFields', () => {
    it('should encrypt specified fields in object', () => {
      // Arrange
      const data = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'secret123',
        publicField: 'public',
      };
      const fieldsToEncrypt: (keyof typeof data)[] = ['password', 'email'];

      // Act
      const encrypted = service.encryptFields(data, fieldsToEncrypt);

      // Assert
      expect(encrypted.name).toBe(data.name);
      expect(encrypted.publicField).toBe(data.publicField);
      expect(encrypted.password).not.toBe(data.password);
      expect(encrypted.email).not.toBe(data.email);
      expect(encrypted.password).toContain(':');
      expect(encrypted.email).toContain(':');
    });

    it('should not encrypt non-string fields', () => {
      // Arrange
      const data = {
        name: 'John',
        age: 30,
        active: true,
      };
      const fieldsToEncrypt: (keyof typeof data)[] = ['age', 'active'];

      // Act
      const encrypted = service.encryptFields(data, fieldsToEncrypt);

      // Assert
      expect(encrypted.age).toBe(30);
      expect(encrypted.active).toBe(true);
    });

    it('should handle empty fieldsToEncrypt array', () => {
      // Arrange
      const data = {
        name: 'John',
        email: 'john@example.com',
      };
      const fieldsToEncrypt: (keyof typeof data)[] = [];

      // Act
      const encrypted = service.encryptFields(data, fieldsToEncrypt);

      // Assert
      expect(encrypted).toEqual(data);
    });

    it('should handle non-existent fields gracefully', () => {
      // Arrange
      const data = {
        name: 'John',
      };
      const fieldsToEncrypt: (keyof typeof data)[] = ['email' as any];

      // Act
      const encrypted = service.encryptFields(data, fieldsToEncrypt);

      // Assert
      expect(encrypted).toEqual(data);
    });
  });

  describe('decryptFields', () => {
    it('should decrypt specified fields in object', () => {
      // Arrange
      const originalData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'secret123',
      };
      const encrypted = service.encryptFields(originalData, ['email', 'password']);
      const fieldsToDecrypt: (keyof typeof encrypted)[] = ['email', 'password'];

      // Act
      const decrypted = service.decryptFields(encrypted, fieldsToDecrypt);

      // Assert
      expect(decrypted.name).toBe(originalData.name);
      expect(decrypted.email).toBe(originalData.email);
      expect(decrypted.password).toBe(originalData.password);
    });

    it('should handle decryption failures gracefully (legacy data)', () => {
      // Arrange
      const data = {
        name: 'John',
        email: 'not-encrypted-data', // Not in encrypted format
      };
      const fieldsToDecrypt: (keyof typeof data)[] = ['email'];
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      // Act
      const decrypted = service.decryptFields(data, fieldsToDecrypt);

      // Assert
      expect(decrypted.email).toBe('not-encrypted-data'); // Original value preserved
      expect(consoleWarnSpy).toHaveBeenCalled();
      consoleWarnSpy.mockRestore();
    });

    it('should not decrypt non-string fields', () => {
      // Arrange
      const data = {
        name: 'John',
        age: 30,
        active: true,
      };
      const fieldsToDecrypt: (keyof typeof data)[] = ['age', 'active'];

      // Act
      const decrypted = service.decryptFields(data, fieldsToDecrypt);

      // Assert
      expect(decrypted.age).toBe(30);
      expect(decrypted.active).toBe(true);
    });

    it('should handle empty fieldsToDecrypt array', () => {
      // Arrange
      const data = {
        name: 'John',
        email: 'encrypted:data:here',
      };
      const fieldsToDecrypt: (keyof typeof data)[] = [];

      // Act
      const decrypted = service.decryptFields(data, fieldsToDecrypt);

      // Assert
      expect(decrypted).toEqual(data);
    });

    it('should handle null/undefined field values', () => {
      // Arrange
      const data = {
        name: 'John',
        email: null as any,
        password: undefined as any,
      };
      const fieldsToDecrypt: (keyof typeof data)[] = ['email', 'password'];

      // Act
      const decrypted = service.decryptFields(data, fieldsToDecrypt);

      // Assert
      expect(decrypted.email).toBeNull();
      expect(decrypted.password).toBeUndefined();
    });
  });

  describe('round-trip encryption/decryption', () => {
    it('should encrypt and decrypt complex objects', () => {
      // Arrange
      const originalData = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          ssn: '123-45-6789',
        },
        metadata: {
          created: '2025-01-01',
          updated: '2025-01-02',
        },
      };

      // Act
      const encrypted = service.encryptFields(originalData, ['email', 'ssn'] as any);
      const decrypted = service.decryptFields(encrypted, ['email', 'ssn'] as any);

      // Assert
      expect(decrypted.email).toBe(originalData.email);
      expect(decrypted.ssn).toBe(originalData.ssn);
    });

    it('should handle multiple encrypt/decrypt cycles', () => {
      // Arrange
      const plaintext = 'sensitive data';

      // Act
      let encrypted = service.encrypt(plaintext);
      for (let i = 0; i < 5; i++) {
        const decrypted = service.decrypt(encrypted);
        expect(decrypted).toBe(plaintext);
        encrypted = service.encrypt(plaintext); // Re-encrypt with new IV
      }

      // Assert - all cycles should work
      expect(service.decrypt(encrypted)).toBe(plaintext);
    });
  });
});

