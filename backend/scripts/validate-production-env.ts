#!/usr/bin/env ts-node
/**
 * Production Environment Validation Script
 * 
 * Validates that all required production environment variables are set
 * Run this before deploying to production
 * 
 * Usage: ts-node scripts/validate-production-env.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

interface EnvVar {
  name: string;
  required: boolean;
  description: string;
  validator?: (value: string) => boolean;
  errorMessage?: string;
}

const requiredEnvVars: EnvVar[] = [
  {
    name: 'NODE_ENV',
    required: true,
    description: 'Node environment',
    validator: (v) => v === 'production',
    errorMessage: 'NODE_ENV must be "production"'
  },
  {
    name: 'DATABASE_URL',
    required: true,
    description: 'PostgreSQL database connection string',
    validator: (v) => v.startsWith('postgresql://'),
    errorMessage: 'DATABASE_URL must be a valid PostgreSQL connection string'
  },
  {
    name: 'SUPABASE_URL',
    required: true,
    description: 'Supabase project URL',
    validator: (v) => v.startsWith('https://') && v.includes('.supabase.co'),
    errorMessage: 'SUPABASE_URL must be a valid Supabase URL'
  },
  {
    name: 'SUPABASE_SECRET_KEY',
    required: true,
    description: 'Supabase secret key',
    validator: (v) => v.startsWith('sb_secret_') || v.length > 20,
    errorMessage: 'SUPABASE_SECRET_KEY must be a valid Supabase secret key'
  },
  {
    name: 'JWT_SECRET',
    required: true,
    description: 'JWT signing secret',
    validator: (v) => v.length >= 32,
    errorMessage: 'JWT_SECRET must be at least 32 characters'
  },
  {
    name: 'ALLOWED_ORIGINS',
    required: true,
    description: 'Comma-separated list of allowed CORS origins',
    validator: (v) => v.split(',').every(origin => origin.startsWith('https://')),
    errorMessage: 'ALLOWED_ORIGINS must contain only HTTPS URLs in production'
  }
];

const optionalEnvVars: EnvVar[] = [
  {
    name: 'SENTRY_DSN',
    required: false,
    description: 'Sentry DSN for error tracking',
    validator: (v) => v.startsWith('https://'),
    errorMessage: 'SENTRY_DSN must be a valid Sentry URL'
  },
  {
    name: 'PORT',
    required: false,
    description: 'Server port',
    validator: (v) => !isNaN(parseInt(v)) && parseInt(v) > 0 && parseInt(v) < 65536,
    errorMessage: 'PORT must be a valid port number'
  }
];

function validateEnvVar(envVar: EnvVar, value: string | undefined): { valid: boolean; error?: string } {
  if (envVar.required && !value) {
    return {
      valid: false,
      error: `Required environment variable ${envVar.name} is missing`
    };
  }

  if (value && envVar.validator && !envVar.validator(value)) {
    return {
      valid: false,
      error: envVar.errorMessage || `Invalid value for ${envVar.name}`
    };
  }

  return { valid: true };
}

function main() {
  console.log('🔍 Validating production environment variables...\n');

  // Load .env.production if it exists
  const envPath = path.join(__dirname, '..', '.env.production');
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`✅ Loaded .env.production from ${envPath}\n`);
  } else {
    console.log('⚠️  .env.production not found, using current environment\n');
  }

  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate required variables
  console.log('📋 Checking required variables:');
  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar.name];
    const result = validateEnvVar(envVar, value);
    
    if (result.valid) {
      const displayValue = envVar.name.includes('SECRET') || envVar.name.includes('KEY') 
        ? '***' + value?.slice(-4) 
        : value;
      console.log(`  ✅ ${envVar.name}: ${displayValue || '(not set)'}`);
    } else {
      errors.push(`${envVar.name}: ${result.error}`);
      console.log(`  ❌ ${envVar.name}: ${result.error}`);
    }
  }

  // Validate optional variables
  console.log('\n📋 Checking optional variables:');
  for (const envVar of optionalEnvVars) {
    const value = process.env[envVar.name];
    if (value) {
      const result = validateEnvVar(envVar, value);
      if (result.valid) {
        const displayValue = envVar.name.includes('SECRET') || envVar.name.includes('KEY') 
          ? '***' + value.slice(-4) 
          : value;
        console.log(`  ✅ ${envVar.name}: ${displayValue}`);
      } else {
        warnings.push(`${envVar.name}: ${result.error}`);
        console.log(`  ⚠️  ${envVar.name}: ${result.error}`);
      }
    } else {
      console.log(`  ⚪ ${envVar.name}: (not set - optional)`);
    }
  }

  // Security checks
  console.log('\n🔒 Security checks:');
  
  // Check for development values in production
  const devPatterns = ['localhost', '127.0.0.1', 'dev', 'test', 'staging'];
  const envString = JSON.stringify(process.env);
  for (const pattern of devPatterns) {
    if (envString.toLowerCase().includes(pattern) && 
        (process.env.SUPABASE_URL?.includes(pattern) || 
         process.env.ALLOWED_ORIGINS?.includes(pattern))) {
      warnings.push(`Potential development value detected: ${pattern}`);
      console.log(`  ⚠️  Potential development value detected: ${pattern}`);
    }
  }

  // Check for weak secrets
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET is too short (minimum 32 characters)');
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ All environment variables are valid!');
    console.log('✅ Production environment is ready for deployment.');
    process.exit(0);
  } else {
    if (errors.length > 0) {
      console.log(`\n❌ Found ${errors.length} error(s):`);
      errors.forEach(error => console.log(`   - ${error}`));
    }
    if (warnings.length > 0) {
      console.log(`\n⚠️  Found ${warnings.length} warning(s):`);
      warnings.forEach(warning => console.log(`   - ${warning}`));
    }
    console.log('\n❌ Production environment validation failed.');
    console.log('Please fix the errors before deploying to production.');
    process.exit(errors.length > 0 ? 1 : 0);
  }
}

main();


