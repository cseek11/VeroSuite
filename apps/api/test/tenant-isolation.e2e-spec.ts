import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { getTestPrismaClient } from './utils/test-database';
import { getTestAuthToken } from './utils/test-auth';
import { configureTestApp } from './utils/test-app';
import { TEST_USERS, TEST_TENANTS } from './global-setup';

describe('Tenant Isolation (e2e)', () => {
  let app: INestApplication;
  const prisma = getTestPrismaClient();
  let tokenA: string;
  let tokenB: string;
  let jobIdA: string;
  let createdJobIds: string[] = [];

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleFixture.createNestApplication();
    configureTestApp(app);
    await app.init();

    // Get tokens for different tenant users
    tokenA = await getTestAuthToken(TEST_USERS.DISPATCHER); // Tenant 1 user
    tokenB = await getTestAuthToken(TEST_USERS.TENANT2);    // Tenant 2 user

    // Create a job for tenant 1
    const customer = await prisma.account.create({
      data: {
        tenant_id: TEST_TENANTS.TENANT1,
        name: 'Test Customer Tenant 1',
        account_type: 'commercial',
        status: 'active',
      },
    });

    const workOrder = await prisma.workOrder.create({
      data: {
        tenant_id: TEST_TENANTS.TENANT1,
        customer_id: customer.id,
        description: 'Test work order',
        status: 'pending',
        priority: 'medium',
      },
    });

    const job = await prisma.job.create({
      data: {
        tenant_id: TEST_TENANTS.TENANT1,
        work_order_id: workOrder.id,
        account_id: customer.id,
        location_id: (await prisma.location.create({
          data: {
            tenant_id: TEST_TENANTS.TENANT1,
            account_id: customer.id,
            name: 'Test Location',
            address_line1: '123 Test St',
            city: 'Test City',
            state: 'TX',
            postal_code: '12345',
          },
        })).id,
        scheduled_date: new Date(),
        status: 'unassigned',
        priority: 'medium',
      },
    });
    jobIdA = job.id;
    createdJobIds.push(job.id);
  });

  beforeEach(() => {
    createdJobIds = [];
  });

  afterEach(async () => {
    // Clean up jobs created during test
    if (createdJobIds.length > 0) {
      await prisma.job.deleteMany({
        where: { id: { in: createdJobIds } }
      });
    }
  });

  afterAll(async () => {
    // Close app
    if (app) {
      await app.close();
    }
    // Prisma disconnect handled by global teardown
  });

  it('should allow Tenant A to access its own job', async () => {
    await request(app.getHttpServer())
      .get(`/api/v1/jobs/${jobIdA}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .expect(200);
  });

  it('should not allow Tenant B to access Tenant A job (404)', async () => {
    await request(app.getHttpServer())
      .get(`/api/v1/jobs/${jobIdA}`)
      .set('Authorization', `Bearer ${tokenB}`)
      .expect(404);
  });
});
