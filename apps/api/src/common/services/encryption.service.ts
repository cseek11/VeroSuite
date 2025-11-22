import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly keyLength = 32; // 32 bytes for AES-256
  private readonly ivLength = 16; // 16 bytes for GCM
  private readonly key: Buffer;

  constructor(private configService: ConfigService) {
    const encryptionKey = this.configService.get<string>('ENCRYPTION_KEY');
    
    if (!encryptionKey) {
      throw new Error('ENCRYPTION_KEY environment variable is required');
    }

    // Convert key to buffer (expecting hex string or base64)
    try {
      // Try hex first
      this.key = Buffer.from(encryptionKey, 'hex');
      if (this.key.length !== this.keyLength) {
        // If not hex or wrong length, try base64
        this.key = Buffer.from(encryptionKey, 'base64');
      }
    } catch (error) {
      // If both fail, use the string directly and pad/truncate to keyLength
      const keyBuffer = Buffer.from(encryptionKey, 'utf8');
      this.key = Buffer.alloc(this.keyLength);
      keyBuffer.copy(this.key, 0, 0, Math.min(keyBuffer.length, this.keyLength));
    }

    if (this.key.length !== this.keyLength) {
      throw new Error(`ENCRYPTION_KEY must be ${this.keyLength} bytes (${this.keyLength * 2} hex characters or ${Math.ceil(this.keyLength * 4 / 3)} base64 characters)`);
    }
  }

  /**
   * Encrypts a plaintext string using AES-256-GCM
   * @param plaintext The text to encrypt
   * @returns Encrypted string in format: iv:tag:encryptedData (all base64 encoded)
   */
  encrypt(plaintext: string): string {
    if (!plaintext) {
      return plaintext;
    }

    try {
      // Generate random IV for each encryption
      const iv = crypto.randomBytes(this.ivLength);
      
      // Create cipher
      const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
      
      // Encrypt the plaintext
      let encrypted = cipher.update(plaintext, 'utf8', 'base64');
      encrypted += cipher.final('base64');
      
      // Get authentication tag
      const tag = cipher.getAuthTag();
      
      // Return format: iv:tag:encryptedData (all base64)
      return `${iv.toString('base64')}:${tag.toString('base64')}:${encrypted}`;
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error(`Failed to encrypt data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Decrypts an encrypted string
   * @param ciphertext Encrypted string in format: iv:tag:encryptedData
   * @returns Decrypted plaintext
   */
  decrypt(ciphertext: string): string {
    if (!ciphertext) {
      return ciphertext;
    }

    try {
      // Split the ciphertext into components
      const parts = ciphertext.split(':');
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted data format');
      }

      const [ivBase64, tagBase64, encryptedBase64] = parts;
      
      if (!ivBase64 || !tagBase64 || !encryptedBase64) {
        throw new Error('Invalid encrypted data format: missing components');
      }
      
      // Convert from base64
      const iv = Buffer.from(ivBase64, 'base64');
      const tag = Buffer.from(tagBase64, 'base64');
      const encrypted = Buffer.from(encryptedBase64, 'base64');
      
      // Create decipher
      const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
      decipher.setAuthTag(tag);
      
      // Decrypt
      let decrypted = decipher.update(encrypted, undefined, 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error(`Failed to decrypt data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Encrypts multiple fields in an object
   * @param data Object containing fields to encrypt
   * @param fieldsToEncrypt Array of field names to encrypt
   * @returns Object with encrypted fields
   */
  encryptFields<T extends Record<string, any>>(
    data: T,
    fieldsToEncrypt: (keyof T)[]
  ): T {
    const encrypted = { ...data };
    
    for (const field of fieldsToEncrypt) {
      if (encrypted[field] && typeof encrypted[field] === 'string') {
        encrypted[field] = this.encrypt(encrypted[field] as string) as T[keyof T];
      }
    }
    
    return encrypted;
  }

  /**
   * Decrypts multiple fields in an object
   * @param data Object containing encrypted fields
   * @param fieldsToDecrypt Array of field names to decrypt
   * @returns Object with decrypted fields
   */
  decryptFields<T extends Record<string, any>>(
    data: T,
    fieldsToDecrypt: (keyof T)[]
  ): T {
    const decrypted = { ...data };
    
    for (const field of fieldsToDecrypt) {
      if (decrypted[field] && typeof decrypted[field] === 'string') {
        try {
          decrypted[field] = this.decrypt(decrypted[field] as string) as T[keyof T];
        } catch (error) {
          // If decryption fails, it might not be encrypted (legacy data)
          // Log but don't throw - return the original value
          console.warn(`Failed to decrypt field ${String(field)}:`, error);
        }
      }
    }
    
    return decrypted;
  }
}

