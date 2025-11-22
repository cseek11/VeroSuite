import { execSync } from 'child_process';
import { config } from 'dotenv';
import { resolve } from 'path';
import { writeFileSync } from 'fs';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// Load test environment
config({ path: resolve(__dirname, '.env.test') });

// Export constants for use in tests
export const TEST_PASSWORD = 'Test123!@#';
export const TEST_USERS = {
  ADMIN: 'test-user-admin@test.example.com',
  DISPATCHER: 'test-user-dispatcher@test.example.com',
  TECHNICIAN: 'test-user-technician@test.example.com',
  TENANT2: 'test-user-tenant2@test.example.com'
};
export const TEST_TENANTS = {
  TENANT1: '11111111-1111-1111-1111-111111111111',
  TENANT2: '22222222-2222-2222-2222-222222222222'
};

export default async function globalSetup() {
  console.log('🔧 Starting global test setup...');

  try {
    // Validate environment
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL not set. Check backend/test/.env.test');
    }
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not set. Check backend/test/.env.test');
    }

    // Skip migrations for hosted databases (Supabase)
    // The database schema should already be set up
    // For local test databases, you can uncomment the migration step below
    console.log('📦 Verifying database connection...');
    // Uncomment if you need to run migrations on a local test database:
    // try {
    //   execSync('npx prisma migrate deploy', {
    //     cwd: resolve(__dirname, '..'),
    //     stdio: 'pipe',
    //     env: { ...process.env }
    //   });
    //   console.log('✅ Migrations applied');
    // } catch (error: any) {
    //   console.log('⚠️  Migrations skipped (database may already be up to date)');
    // }

    // Initialize Prisma client
    const prisma = new PrismaClient({
      datasources: { db: { url: process.env.DATABASE_URL } }
    });
    await prisma.$connect();

    // Clean up existing test data (idempotent setup)
    console.log('🧹 Cleaning up existing test data...');
    await prisma.user.deleteMany({
      where: { email: { endsWith: '@test.example.com' } }
    });
    await prisma.tenant.deleteMany({
      where: { id: { in: [TEST_TENANTS.TENANT1, TEST_TENANTS.TENANT2] } }
    });

    // Create password hash
    console.log('🔐 Hashing test password...');
    const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);

    // Create test tenants
    console.log('🏢 Creating test tenants...');
    await prisma.tenant.create({
      data: {
        id: TEST_TENANTS.TENANT1,
        name: 'Test Tenant 1',
        domain: 'test-tenant-1.example.com',
        status: 'active',
        subscription_tier: 'basic'
      }
    });
    await prisma.tenant.create({
      data: {
        id: TEST_TENANTS.TENANT2,
        name: 'Test Tenant 2',
        domain: 'test-tenant-2.example.com',
        status: 'active',
        subscription_tier: 'basic'
      }
    });

    // Create test users
    // IMPORTANT: User IDs must match what Supabase mock returns
    // AuthService looks up user by id: user.id from Supabase response
    console.log('👥 Creating test users...');
    
    await prisma.user.create({
      data: {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        email: TEST_USERS.ADMIN,
        password_hash: passwordHash,
        tenant_id: TEST_TENANTS.TENANT1,
        roles: ['admin'], // roles is String[] array
        first_name: 'Admin',
        last_name: 'User',
        status: 'active'
      }
    });

    await prisma.user.create({
      data: {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        email: TEST_USERS.DISPATCHER,
        password_hash: passwordHash,
        tenant_id: TEST_TENANTS.TENANT1,
        roles: ['dispatcher'],
        first_name: 'Dispatcher',
        last_name: 'User',
        status: 'active'
      }
    });

    await prisma.user.create({
      data: {
        id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        email: TEST_USERS.TECHNICIAN,
        password_hash: passwordHash,
        tenant_id: TEST_TENANTS.TENANT1,
        roles: ['technician'],
        first_name: 'Technician',
        last_name: 'User',
        status: 'active'
      }
    });

    await prisma.user.create({
      data: {
        id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
        email: TEST_USERS.TENANT2,
        password_hash: passwordHash,
        tenant_id: TEST_TENANTS.TENANT2,
        roles: ['dispatcher'],
        first_name: 'Tenant2',
        last_name: 'User',
        status: 'active'
      }
    });

    await prisma.$disconnect();

    // Write flag file to confirm setup completed
    writeFileSync(resolve(__dirname, '.test-setup-complete'), 'true');

    console.log('✅ Global test setup completed successfully');
    console.log('   Tenants:', Object.values(TEST_TENANTS));
    console.log('   Users:', Object.values(TEST_USERS));

  } catch (error) {
    console.error('❌ Global setup failed:', error);
    process.exit(1);
  }
}

