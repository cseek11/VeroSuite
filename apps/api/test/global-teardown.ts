import { PrismaClient } from '@prisma/client';
import { unlinkSync, existsSync } from 'fs';
import { resolve } from 'path';

export default async function globalTeardown() {
  console.log('🧹 Starting global test teardown...');

  try {
    const prisma = new PrismaClient({
      datasources: { db: { url: process.env.DATABASE_URL } }
    });
    await prisma.$connect();

    // Check for leaked test data
    const leakedWorkOrders = await prisma.workOrder.count({
      where: { tenant_id: { in: ['11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'] } }
    });
    if (leakedWorkOrders > 0) {
      console.warn(`⚠️  Found ${leakedWorkOrders} work orders not cleaned up by tests`);
    }

    // Clean up test data
    console.log('🗑️  Cleaning up test data...');
    await prisma.user.deleteMany({
      where: { email: { endsWith: '@test.example.com' } }
    });
    await prisma.tenant.deleteMany({
      where: { id: { in: ['11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222'] } }
    });

    await prisma.$disconnect();

    // Remove flag file
    const flagPath = resolve(__dirname, '.test-setup-complete');
    if (existsSync(flagPath)) {
      unlinkSync(flagPath);
    }

    console.log('✅ Global test teardown completed');

  } catch (error) {
    console.error('⚠️  Global teardown error (non-fatal):', error.message);
  }
}

