import { existsSync } from 'fs';
import { resolve } from 'path';
import { getTestPrismaClient } from './test-database';

/**
 * Dump current test database state for debugging
 * Call this in afterEach when debugging test failures
 */
export async function dumpTestData() {
  const prisma = getTestPrismaClient();
  
  console.log('\n=== Test Database State ===');
  
  try {
    const tenants = await prisma.tenant.findMany();
    const users = await prisma.user.findMany({ 
      select: { id: true, email: true, roles: true } 
    });
    const workOrders = await prisma.workOrder.findMany();
    const jobs = await prisma.job.findMany();
    
    console.log('Tenants:', tenants.length, tenants.map(t => t.id));
    console.log('Users:', users.length, users.map(u => `${u.email} (${u.roles.join(',')})`));
    console.log('Work Orders:', workOrders.length);
    console.log('Jobs:', jobs.length);
  } catch (error: any) {
    console.error('Error dumping test data:', error.message);
  }
  
  console.log('===========================\n');
}

/**
 * Verify global test setup completed successfully
 * Call this in beforeAll to catch setup failures early
 */
export function verifyTestSetup() {
  const setupCompletePath = resolve(__dirname, '../.test-setup-complete');
  if (!existsSync(setupCompletePath)) {
    throw new Error(
      'Global test setup did not complete successfully. ' +
      'Run tests again or check backend/test/global-setup.ts logs. ' +
      'You may need to run: cd backend && npm run test:e2e'
    );
  }
}

