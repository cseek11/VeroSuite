/**
 * Encryption Key Rotation Script
 * 
 * This script rotates the ENCRYPTION_KEY by:
 * 1. Decrypting all existing encrypted data with the old key
 * 2. Re-encrypting with the new key
 * 3. Updating the database
 * 
 * ⚠️ CRITICAL: Run this script BEFORE updating ENCRYPTION_KEY in .env
 * 
 * Usage:
 * 1. Set OLD_ENCRYPTION_KEY and NEW_ENCRYPTION_KEY environment variables
 * 2. Run: npx ts-node backend/scripts/rotate-encryption-key.ts
 * 
 * Or use with dotenv:
 * OLD_ENCRYPTION_KEY=old_key NEW_ENCRYPTION_KEY=new_key npx ts-node backend/scripts/rotate-encryption-key.ts
 */

import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
// Path is now apps/api/.env (was backend/.env)
dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

// Encryption configuration
const algorithm = 'aes-256-gcm';
const keyLength = 32; // 32 bytes for AES-256
const ivLength = 16; // 16 bytes for GCM

// Get keys from environment
const oldKeyHex = process.env.OLD_ENCRYPTION_KEY || process.env.ENCRYPTION_KEY;
const newKeyHex = process.env.NEW_ENCRYPTION_KEY;

if (!oldKeyHex) {
  throw new Error('OLD_ENCRYPTION_KEY or ENCRYPTION_KEY environment variable is required');
}

if (!newKeyHex) {
  throw new Error('NEW_ENCRYPTION_KEY environment variable is required');
}

// Convert hex keys to buffers
const oldKey = Buffer.from(oldKeyHex, 'hex');
const newKey = Buffer.from(newKeyHex, 'hex');

if (oldKey.length !== keyLength) {
  throw new Error(`OLD_ENCRYPTION_KEY must be ${keyLength * 2} hex characters (${keyLength} bytes)`);
}

if (newKey.length !== keyLength) {
  throw new Error(`NEW_ENCRYPTION_KEY must be ${keyLength * 2} hex characters (${keyLength} bytes)`);
}

/**
 * Decrypt with old key
 */
function decryptWithOldKey(ciphertext: string): string {
  if (!ciphertext) {
    return ciphertext;
  }

  try {
    const parts = ciphertext.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted data format');
    }

    const [ivBase64, tagBase64, encryptedBase64] = parts;
    
    if (!ivBase64 || !tagBase64 || !encryptedBase64) {
      throw new Error('Invalid encrypted data format: missing components');
    }
    
    const iv = Buffer.from(ivBase64, 'base64');
    const tag = Buffer.from(tagBase64, 'base64');
    const encrypted = Buffer.from(encryptedBase64, 'base64');
    
    const decipher = crypto.createDecipheriv(algorithm, oldKey, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encrypted, undefined, 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error(`Failed to decrypt data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Encrypt with new key
 */
function encryptWithNewKey(plaintext: string): string {
  if (!plaintext) {
    return plaintext;
  }

  try {
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, newKey, iv);
    
    let encrypted = cipher.update(plaintext, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    const tag = cipher.getAuthTag();
    
    return `${iv.toString('base64')}:${tag.toString('base64')}:${encrypted}`;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error(`Failed to encrypt data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Main rotation function
 */
async function rotateEncryptionKey() {
  console.log('🔐 Starting encryption key rotation...');
  console.log('Old key (first 8 chars):', oldKeyHex.substring(0, 8) + '...');
  console.log('New key (first 8 chars):', newKeyHex.substring(0, 8) + '...');
  console.log('');

  try {
    // Get all users with encrypted fields
    console.log('📊 Fetching users with encrypted fields...');
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { social_security_number: { not: null } },
          { driver_license_number: { not: null } },
        ],
      },
      select: {
        id: true,
        email: true,
        social_security_number: true,
        driver_license_number: true,
      },
    });

    console.log(`Found ${users.length} users with encrypted fields`);
    console.log('');

    if (users.length === 0) {
      console.log('✅ No encrypted data found. Rotation complete.');
      return;
    }

    let successCount = 0;
    let errorCount = 0;
    const errors: Array<{ userId: string; email: string; error: string }> = [];

    // Process each user
    for (const user of users) {
      try {
        console.log(`Processing user: ${user.email} (${user.id})`);

        const updateData: {
          social_security_number?: string | null;
          driver_license_number?: string | null;
        } = {};

        // Decrypt and re-encrypt social_security_number
        if (user.social_security_number) {
          try {
            const decrypted = decryptWithOldKey(user.social_security_number);
            updateData.social_security_number = encryptWithNewKey(decrypted);
            console.log('  ✅ SSN rotated');
          } catch (error) {
            console.error(`  ❌ Failed to rotate SSN:`, error);
            errors.push({
              userId: user.id,
              email: user.email || 'unknown',
              error: `SSN rotation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            });
            errorCount++;
            continue; // Skip this user
          }
        }

        // Decrypt and re-encrypt driver_license_number
        if (user.driver_license_number) {
          try {
            const decrypted = decryptWithOldKey(user.driver_license_number);
            updateData.driver_license_number = encryptWithNewKey(decrypted);
            console.log('  ✅ Driver license rotated');
          } catch (error) {
            console.error(`  ❌ Failed to rotate driver license:`, error);
            errors.push({
              userId: user.id,
              email: user.email || 'unknown',
              error: `Driver license rotation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            });
            errorCount++;
            continue; // Skip this user
          }
        }

        // Update user in database
        await prisma.user.update({
          where: { id: user.id },
          data: updateData,
        });

        successCount++;
        console.log(`  ✅ User ${user.email} updated successfully`);
        console.log('');

      } catch (error) {
        console.error(`  ❌ Error processing user ${user.email}:`, error);
        errors.push({
          userId: user.id,
          email: user.email || 'unknown',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
        errorCount++;
      }
    }

    // Summary
    console.log('');
    console.log('='.repeat(60));
    console.log('📊 Rotation Summary');
    console.log('='.repeat(60));
    console.log(`Total users processed: ${users.length}`);
    console.log(`✅ Successfully rotated: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);

    if (errors.length > 0) {
      console.log('');
      console.log('❌ Errors encountered:');
      errors.forEach((err, index) => {
        console.log(`  ${index + 1}. User: ${err.email} (${err.userId})`);
        console.log(`     Error: ${err.error}`);
      });
    }

    if (errorCount > 0) {
      console.log('');
      console.log('⚠️  WARNING: Some users failed to rotate. Review errors above.');
      console.log('⚠️  Do NOT update ENCRYPTION_KEY in .env until all errors are resolved.');
      process.exit(1);
    } else {
      console.log('');
      console.log('✅ All encrypted data successfully rotated!');
      console.log('');
      console.log('📝 Next steps:');
      console.log('  1. Update ENCRYPTION_KEY in backend/.env with new key');
      console.log('  2. Update all deployment environments');
      console.log('  3. Restart backend services');
      console.log('  4. Verify decryption works with new key');
    }

  } catch (error) {
    console.error('❌ Fatal error during rotation:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the rotation
rotateEncryptionKey()
  .catch((error) => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
  });

