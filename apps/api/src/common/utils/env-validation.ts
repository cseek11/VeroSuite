/**
 * Environment Variable Validation Utility
 * Ensures all required environment variables are present at startup
 */

import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

export interface RequiredEnvVars {
  SUPABASE_URL: string;
  SUPABASE_SECRET_KEY: string;
  JWT_SECRET: string;
  DATABASE_URL: string;
}

export interface OptionalEnvVars {
  SUPABASE_PUBLISHABLE_KEY?: string | undefined;
  JWT_EXPIRES_IN?: string | undefined;
  REFRESH_TOKEN_EXPIRES_IN?: string | undefined;
  CORS_ORIGIN?: string | undefined;
  STRIPE_SECRET_KEY?: string | undefined;
  STRIPE_PUBLISHABLE_KEY?: string | undefined;
  STRIPE_WEBHOOK_SECRET?: string | undefined;
  REDIS_URL?: string | undefined;
}

/**
 * Validates required environment variables at startup
 * Throws an error if any required variables are missing
 * @param configService - ConfigService instance
 * @param traceId - Optional trace ID for logging
 */
export function validateEnvironmentVariables(
  configService: ConfigService,
  traceId?: string,
): RequiredEnvVars {
  const requiredVars: (keyof RequiredEnvVars)[] = [
    'SUPABASE_URL',
    'SUPABASE_SECRET_KEY', 
    'JWT_SECRET',
    'DATABASE_URL'
  ];

  const missing: string[] = [];
  const values: Partial<RequiredEnvVars> = {};

  for (const varName of requiredVars) {
    const value = configService.get<string>(varName);
    if (!value || value.trim() === '') {
      missing.push(varName);
    } else {
      values[varName] = value;
    }
  }

  if (missing.length > 0) {
    const errorMessage = `Missing required environment variables: ${missing.join(', ')}\n` +
      `Please check your .env file and ensure all required variables are set.\n` +
      `See apps/api/env.example for reference.${traceId ? ` [traceId: ${traceId}]` : ''}`;
    throw new Error(errorMessage);
  }

  // Validate key formats
  validateKeyFormats(values as RequiredEnvVars);

  return values as RequiredEnvVars;
}

/**
 * Validates the format of sensitive keys
 */
function validateKeyFormats(envVars: RequiredEnvVars): void {
  const errors: string[] = [];

  // Validate Supabase URL
  if (!envVars.SUPABASE_URL.startsWith('https://') || !envVars.SUPABASE_URL.includes('.supabase.co')) {
    errors.push('SUPABASE_URL must be a valid Supabase URL (https://xxx.supabase.co)');
  }

  // Validate Supabase Secret Key format
  if (!envVars.SUPABASE_SECRET_KEY.startsWith('sb_secret_')) {
    errors.push('SUPABASE_SECRET_KEY must start with "sb_secret_"');
  }

  // Validate JWT Secret strength
  if (envVars.JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET must be at least 32 characters long for security');
  }

  // Validate Database URL format
  if (!envVars.DATABASE_URL.startsWith('postgresql://')) {
    errors.push('DATABASE_URL must be a valid PostgreSQL connection string');
  }

  if (errors.length > 0) {
    throw new Error(`Environment variable validation failed:\n${errors.join('\n')}`);
  }
}

/**
 * Logs environment variable status (without exposing values)
 * Uses structured logging with trace context
 * @param envVars - Required environment variables
 * @param optionalVars - Optional environment variables
 * @param traceId - Optional trace ID for request tracking
 */
export function logEnvironmentStatus(
  envVars: RequiredEnvVars,
  optionalVars: OptionalEnvVars,
  traceId?: string,
): void {
  const logger = new Logger('EnvValidation');
  const logContext: Record<string, any> = {
    operation: 'environment_validation',
    traceId: traceId || 'startup',
    spanId: 'env-status',
  };

  logger.log('Environment Variables Status', {
    ...logContext,
    required: {
      SUPABASE_URL: envVars.SUPABASE_URL,
      SUPABASE_SECRET_KEY: maskSecret(envVars.SUPABASE_SECRET_KEY),
      JWT_SECRET: maskSecret(envVars.JWT_SECRET),
      DATABASE_URL: maskDatabaseUrl(envVars.DATABASE_URL),
    },
    optional: {
      SUPABASE_PUBLISHABLE_KEY: optionalVars.SUPABASE_PUBLISHABLE_KEY
        ? maskSecret(optionalVars.SUPABASE_PUBLISHABLE_KEY)
        : 'not set',
      STRIPE_SECRET_KEY: optionalVars.STRIPE_SECRET_KEY
        ? maskSecret(optionalVars.STRIPE_SECRET_KEY)
        : 'not set (mock mode)',
      REDIS_URL: optionalVars.REDIS_URL
        ? maskDatabaseUrl(optionalVars.REDIS_URL)
        : 'not set (caching disabled)',
    },
  });
}

/**
 * Masks sensitive values for logging
 */
function maskSecret(value: string): string {
  if (value.length <= 8) return '***';
  return value.substring(0, 4) + '***' + value.substring(value.length - 4);
}

/**
 * Masks database URLs for logging
 */
function maskDatabaseUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//***:***@${urlObj.host}${urlObj.pathname}`;
  } catch {
    return '***';
  }
}
